from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.utils.decorators import method_decorator
from django.db import transaction
import json
import logging

from .models import JobRecommendation, UserJobPreference
from .services import RecommendationEngine
from skills.models import CandidateProfile
from skills.models import Skill

logger = logging.getLogger(__name__)

@api_view(['GET'])
def get_recommendations(request):
    """
    Get job recommendations for the current user
    """
    try:
        # Parse user profile from query parameters
        user_profile = None
        if request.GET.get('user_profile'):
            try:
                user_profile = json.loads(request.GET.get('user_profile'))
            except json.JSONDecodeError:
                logger.warning("Invalid user_profile JSON")
                user_profile = None
        
        # If no user profile provided, create a default one for testing
        if not user_profile:
            user_profile = {
                'name': 'Test User',
                'email': 'test@example.com',
                'skillsWithProficiency': [
                    {'name': 'Python', 'proficiency': 'intermediate'},
                    {'name': 'Django', 'proficiency': 'intermediate'},
                    {'name': 'React', 'proficiency': 'intermediate'}
                ],
                'contact': {
                    'location': 'Casablanca, Maroc'
                }
            }
        
        # Create or get candidate profile based on user data
        candidate = None
        if request.user.is_authenticated:
            try:
                candidate = CandidateProfile.objects.get(user=request.user)
            except CandidateProfile.DoesNotExist:
                candidate = CandidateProfile.objects.create(
                    user=request.user,
                    first_name=user_profile.get('name', 'Test').split(' ')[0],
                    last_name=' '.join(user_profile.get('name', 'Test User').split(' ')[1:]),
                    email=user_profile.get('email', 'test@example.com')
                )
        else:
            # For anonymous users, create a unique candidate based on profile data
            if user_profile and user_profile.get('email'):
                # Use email as unique identifier
                email = user_profile.get('email')
                username = email.split('@')[0] + '_' + str(abs(hash(email)) % 10000)
                
                from django.contrib.auth.models import User
                test_user, created = User.objects.get_or_create(
                    username=username,
                    defaults={
                        'email': email,
                        'password': 'anonymous123'
                    }
                )
                
                # Try to get existing candidate by email first
                try:
                    candidate = CandidateProfile.objects.get(email=email)
                    # Update user if different
                    if candidate.user != test_user:
                        candidate.user = test_user
                        candidate.save()
                except CandidateProfile.DoesNotExist:
                    # Create new candidate
                    candidate = CandidateProfile.objects.create(
                        user=test_user,
                        first_name=user_profile.get('name', 'User').split(' ')[0],
                        last_name=' '.join(user_profile.get('name', 'User').split(' ')[1:]) or 'User',
                        email=email
                    )
            else:
                # Fallback to first candidate if no profile data
                candidate = CandidateProfile.objects.first()
                if not candidate:
                    from django.contrib.auth.models import User
                    test_user = User.objects.create_user(
                        username='anonymous_user',
                        email='anonymous@example.com',
                        password='anonymous123'
                    )
                    candidate = CandidateProfile.objects.create(
                        user=test_user,
                        first_name='Anonymous',
                        last_name='User',
                        email='anonymous@example.com'
                    )
        
        # Update candidate skills based on user profile
        if user_profile.get('skills') or user_profile.get('skillsWithProficiency'):
            skills_to_add = []
            if user_profile.get('skillsWithProficiency'):
                skills_to_add = [skill['name'] for skill in user_profile['skillsWithProficiency']]
            elif user_profile.get('skills'):
                skills_to_add = user_profile['skills']
            
            # Clear existing skills and add new ones
            candidate.skills.clear()
            
            # Get or create skills
            for skill_name in skills_to_add:
                skill, created = Skill.objects.get_or_create(
                    name=skill_name,
                    defaults={'category': 'programming', 'description': f'{skill_name} skill'}
                )
                candidate.skills.add(skill)
        
        # Get parameters
        limit = int(request.GET.get('limit', 10))
        min_score = float(request.GET.get('min_score', 50.0))
        status_filter = request.GET.get('status', None)
        
        # Get user preferences
        if request.user.is_authenticated:
            user_prefs, _ = UserJobPreference.objects.get_or_create(user=request.user)
        else:
            # Create default preferences for anonymous users
            user_prefs = UserJobPreference(
                min_score_threshold=min_score,
                preferred_cities=[],
                preferred_countries=[],
                accepts_remote=True,
                preferred_job_types=[],
                target_salary_min=0,
                target_salary_max=200000
            )
        
        # Use complete user profile data for recommendations
        user_profile_data = user_profile if user_profile else None
        
        # Generate recommendations based on current user profile
        engine = RecommendationEngine()
        
        # Check if we have existing recommendations for this candidate
        existing_recommendations = JobRecommendation.objects.filter(candidate=candidate)
        
        # Only regenerate if we don't have recommendations or if user profile has changed significantly
        if not existing_recommendations.exists() or user_profile_data:
            # Clear existing recommendations for this candidate to force regeneration
            JobRecommendation.objects.filter(candidate=candidate).delete()
            
            # Generate new recommendations with complete user profile data
            recommendations = engine.generate_recommendations(candidate, limit, user_profile_data)
        else:
            # Use existing recommendations
            recommendations = list(existing_recommendations)
        
        # Filter by minimum score
        recommendations = [r for r in recommendations if r.overall_score >= min_score]
        
        # Filter by status if provided
        if status_filter:
            recommendations = [r for r in recommendations if r.status == status_filter]
        
        # Serialize recommendations
        recommendations_data = []
        for rec in recommendations:
            job = rec.job
            recommendations_data.append({
                'id': rec.id,
                'job': {
                    'id': job.id,
                    'title': job.title,
                    'company': job.company,
                    'location': job.location,
                    'job_type': job.job_type,
                    'seniority': job.seniority,
                    'description': job.description,
                    'salary_min': job.salary_min,
                    'salary_max': job.salary_max,
                    'salary_currency': job.salary_currency,
                    'remote': job.remote,
                    'posted_at': job.posted_at.isoformat() if job.posted_at else None,
                    'required_skills': [
                        {'name': skill.name, 'category': skill.category}
                        for skill in job.required_skills.all()
                    ],
                    'preferred_skills': [
                        {'name': skill.name, 'category': skill.category}
                        for skill in job.preferred_skills.all()
                    ]
                },
                'overall_score': rec.overall_score,
                'skill_match_score': rec.skill_match_score,
                'salary_fit_score': rec.salary_fit_score,
                'location_match_score': rec.location_match_score,
                'seniority_match_score': rec.seniority_match_score,
                'remote_bonus': rec.remote_bonus,
                'matched_skills': rec.matched_skills,
                'missing_skills': rec.missing_skills,
                'recommendation_reason': rec.recommendation_reason,
                'status': rec.status,
                'created_at': rec.created_at.isoformat() if rec.created_at else None,
                'updated_at': rec.updated_at.isoformat() if rec.updated_at else None
            })
        
        # Get user preferences for response
        user_prefs_data = None
        if user_prefs:
            user_prefs_data = {
                'min_score_threshold': user_prefs.min_score_threshold,
                'preferred_job_types': user_prefs.preferred_job_types,
                'preferred_seniority': user_prefs.preferred_seniority,
                'preferred_cities': user_prefs.preferred_cities,
                'preferred_countries': user_prefs.preferred_countries,
                'target_salary_min': user_prefs.target_salary_min,
                'target_salary_max': user_prefs.target_salary_max,
                'accepts_remote': user_prefs.accepts_remote
            }
        
        return Response({
            'recommendations': recommendations_data,
            'user_preferences': user_prefs_data,
            'total_count': len(recommendations_data),
            'candidate_info': {
                'name': f"{candidate.first_name} {candidate.last_name}",
                'email': candidate.email,
                'skills_count': candidate.skills.count()
            }
        })
        
    except Exception as e:
        logger.error(f"Error in get_recommendations: {str(e)}")
        return Response(
            {'error': f'Failed to get recommendations: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_job_recommendations(request):
    """
    Get job recommendations for dashboard - simplified format for frontend
    """
    try:
        # Get parameters
        limit = int(request.GET.get('limit', 3))
        min_score = float(request.GET.get('min_score', 50.0))
        
        # Get user preferences
        user_prefs, _ = UserJobPreference.objects.get_or_create(user=request.user)
        
        # Get candidate profile
        try:
            candidate = CandidateProfile.objects.get(user=request.user)
        except CandidateProfile.DoesNotExist:
            # Create a basic candidate profile if it doesn't exist
            candidate = CandidateProfile.objects.create(
                user=request.user,
                first_name=request.user.first_name or 'User',
                last_name=request.user.last_name or 'Name',
                email=request.user.email or 'user@example.com'
            )
        
        # Use the recommendation engine
        engine = RecommendationEngine()
        recommendations = engine.generate_recommendations(
            candidate=candidate,
            limit=limit
        )
        
        # Transform recommendations to dashboard format
        jobs_data = []
        for rec in recommendations:
            job = rec.job
            jobs_data.append({
                'id': str(job.id),
                'title': job.title,
                'company': job.company,
                'match': round(rec.overall_score, 0),
                'salary': f"${job.salary_min:,}-${job.salary_max:,}" if job.salary_min and job.salary_max else "Salary not specified",
                'location': job.location,
                'skills': [skill.name for skill in job.required_skills.all()[:3]],  # Top 3 skills
                'description': job.description[:100] + "..." if job.description and len(job.description) > 100 else job.description or "",
                'job_type': job.job_type or "Full-time",
                'remote': job.remote
            })
        
        return Response({
            'jobs': jobs_data,
            'total_count': len(jobs_data)
        })
        
    except Exception as e:
        logger.error(f"Error in get_job_recommendations: {str(e)}")
        return Response(
            {'error': f'Failed to get job recommendations: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
def user_skills_analysis(request):
    """
    Get skills analysis for the current user
    """
    try:
        # Parse user profile from query parameters
        user_profile = None
        if request.GET.get('user_profile'):
            try:
                user_profile = json.loads(request.GET.get('user_profile'))
            except json.JSONDecodeError:
                logger.warning("Invalid user_profile JSON")
                user_profile = None
        
        # If no user profile provided, create a default one for testing
        if not user_profile:
            user_profile = {
                'name': 'Test User',
                'email': 'test@example.com',
                'skillsWithProficiency': [
                    {'name': 'Python', 'proficiency': 'intermediate'},
                    {'name': 'Django', 'proficiency': 'intermediate'},
                    {'name': 'React', 'proficiency': 'intermediate'}
                ]
            }
        
        # Create or get candidate profile based on user data
        candidate = None
        if request.user.is_authenticated:
            try:
                candidate = CandidateProfile.objects.get(user=request.user)
            except CandidateProfile.DoesNotExist:
                candidate = CandidateProfile.objects.create(
                    user=request.user,
                    first_name=user_profile.get('name', 'Test').split(' ')[0],
                    last_name=' '.join(user_profile.get('name', 'Test User').split(' ')[1:]),
                    email=user_profile.get('email', 'test@example.com')
                )
        else:
            # For anonymous users, create a unique candidate based on profile data
            if user_profile and user_profile.get('email'):
                # Use email as unique identifier
                email = user_profile.get('email')
                username = email.split('@')[0] + '_' + str(abs(hash(email)) % 10000)
                
                from django.contrib.auth.models import User
                test_user, created = User.objects.get_or_create(
                    username=username,
                    defaults={
                        'email': email,
                        'password': 'anonymous123'
                    }
                )
                
                # Try to get existing candidate by email first
                try:
                    candidate = CandidateProfile.objects.get(email=email)
                    # Update user if different
                    if candidate.user != test_user:
                        candidate.user = test_user
                        candidate.save()
                except CandidateProfile.DoesNotExist:
                    # Create new candidate
                    candidate = CandidateProfile.objects.create(
                        user=test_user,
                        first_name=user_profile.get('name', 'User').split(' ')[0],
                        last_name=' '.join(user_profile.get('name', 'User').split(' ')[1:]) or 'User',
                        email=email
                    )
            else:
                # Fallback to first candidate if no profile data
                candidate = CandidateProfile.objects.first()
                if not candidate:
                    from django.contrib.auth.models import User
                    test_user = User.objects.create_user(
                        username='anonymous_user',
                        email='anonymous@example.com',
                        password='anonymous123'
                    )
                    candidate = CandidateProfile.objects.create(
                        user=test_user,
                        first_name='Anonymous',
                        last_name='User',
                        email='anonymous@example.com'
                    )
        
        # Update candidate skills based on user profile
        if user_profile.get('skills') or user_profile.get('skillsWithProficiency'):
            skills_to_add = []
            if user_profile.get('skillsWithProficiency'):
                skills_to_add = [skill['name'] for skill in user_profile['skillsWithProficiency']]
            elif user_profile.get('skills'):
                skills_to_add = user_profile['skills']
            
            # Clear existing skills and add new ones
            candidate.skills.clear()
            
            # Get or create skills
            for skill_name in skills_to_add:
                skill, created = Skill.objects.get_or_create(
                    name=skill_name,
                    defaults={'category': 'programming', 'description': f'{skill_name} skill'}
                )
                candidate.skills.add(skill)
        
        # Get skills analysis
        skills = candidate.skills.all()
        skills_data = []
        for skill in skills:
            skills_data.append({
                'name': skill.name,
                'category': skill.category,
                'description': skill.description
            })
        
        # Analyze skills
        total_skills = len(skills_data)
        top_skills = skills_data[:10]  # Top 10 skills
        
        # Categorize skills
        skill_categories = {}
        for skill in skills_data:
            category = skill['category']
            if category not in skill_categories:
                skill_categories[category] = []
            skill_categories[category].append(skill)
        
        return Response({
            'total_skills': total_skills,
            'top_skills': top_skills,
            'skill_categories': skill_categories,
            'candidate_info': {
                'name': f"{candidate.first_name} {candidate.last_name}",
                'email': candidate.email
            }
        })
        
    except Exception as e:
        logger.error(f"Error in user_skills_analysis: {str(e)}")
        return Response(
            {'error': f'Failed to get skills analysis: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_recommendation_status(request, recommendation_id):
    """
    Update the status of a job recommendation
    """
    try:
        recommendation = JobRecommendation.objects.get(
            id=recommendation_id,
            candidate__user=request.user
        )
        
        new_status = request.data.get('status')
        if new_status not in ['new', 'viewed', 'applied', 'rejected']:
            return Response(
                {'error': 'Invalid status'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        recommendation.status = new_status
        recommendation.save()
        
        return Response({
            'message': 'Recommendation status updated successfully',
            'status': recommendation.status
        })
        
    except JobRecommendation.DoesNotExist:
        return Response(
            {'error': 'Recommendation not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        logger.error(f"Error updating recommendation status: {str(e)}")
        return Response(
            {'error': f'Failed to update recommendation status: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def apply_to_job(request, job_id):
    """
    Apply to a job
    """
    try:
        from job_offers.models import JobApplication
        
        # Check if already applied
        existing_application = JobApplication.objects.filter(
            user=request.user,
            job_id=job_id
        ).first()
        
        if existing_application:
            return Response(
                {'error': 'Already applied to this job'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create new application
        application = JobApplication.objects.create(
            user=request.user,
            job_id=job_id,
            status='applied',
            cover_letter=request.data.get('cover_letter', ''),
            resume_url=request.data.get('resume_url', '')
        )
        
        return Response({
            'message': 'Application submitted successfully',
            'application_id': application.id
        })
        
    except Exception as e:
        logger.error(f"Error applying to job: {str(e)}")
        return Response(
            {'error': f'Failed to apply to job: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_my_applications(request):
    """
    Get user's job applications
    """
    try:
        from job_offers.models import JobApplication
        
        applications = JobApplication.objects.filter(user=request.user).order_by('-created_at')
        
        applications_data = []
        for app in applications:
            applications_data.append({
                'id': app.id,
                'job_id': app.job_id,
                'status': app.status,
                'cover_letter': app.cover_letter,
                'resume_url': app.resume_url,
                'created_at': app.created_at.isoformat() if app.created_at else None,
                'updated_at': app.updated_at.isoformat() if app.updated_at else None
            })
        
        return Response({
            'applications': applications_data,
            'total_count': len(applications_data)
        })
        
    except Exception as e:
        logger.error(f"Error getting applications: {str(e)}")
        return Response(
            {'error': f'Failed to get applications: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET', 'PUT'])
def user_preferences(request):
    """
    Get or update user job preferences
    """
    try:
        if request.method == 'GET':
            if request.user.is_authenticated:
                user_prefs, created = UserJobPreference.objects.get_or_create(user=request.user)
            else:
                # Return default preferences for anonymous users
                user_prefs = UserJobPreference(
                    min_score_threshold=50,
                    preferred_job_types=[],
                    preferred_seniority='',
                    preferred_cities=[],
                    preferred_countries=[],
                    target_salary_min=0,
                    target_salary_max=200000,
                    accepts_remote=True
                )
            
            return Response({
                'min_score_threshold': user_prefs.min_score_threshold,
                'preferred_job_types': user_prefs.preferred_job_types,
                'preferred_seniority': user_prefs.preferred_seniority,
                'preferred_cities': user_prefs.preferred_cities,
                'preferred_countries': user_prefs.preferred_countries,
                'target_salary_min': user_prefs.target_salary_min,
                'target_salary_max': user_prefs.target_salary_max,
                'accepts_remote': user_prefs.accepts_remote
            })
        
        elif request.method == 'PUT':
            if request.user.is_authenticated:
                user_prefs, created = UserJobPreference.objects.get_or_create(user=request.user)
                
                # Update preferences
                user_prefs.min_score_threshold = request.data.get('min_score_threshold', user_prefs.min_score_threshold)
                user_prefs.preferred_job_types = request.data.get('preferred_job_types', user_prefs.preferred_job_types)
                user_prefs.preferred_seniority = request.data.get('preferred_seniority', user_prefs.preferred_seniority)
                user_prefs.preferred_cities = request.data.get('preferred_cities', user_prefs.preferred_cities)
                user_prefs.preferred_countries = request.data.get('preferred_countries', user_prefs.preferred_countries)
                user_prefs.target_salary_min = request.data.get('target_salary_min', user_prefs.target_salary_min)
                user_prefs.target_salary_max = request.data.get('target_salary_max', user_prefs.target_salary_max)
                user_prefs.accepts_remote = request.data.get('accepts_remote', user_prefs.accepts_remote)
                
                user_prefs.save()
                
                return Response({
                    'message': 'Preferences updated successfully',
                    'preferences': {
                        'min_score_threshold': user_prefs.min_score_threshold,
                        'preferred_job_types': user_prefs.preferred_job_types,
                        'preferred_seniority': user_prefs.preferred_seniority,
                        'preferred_cities': user_prefs.preferred_cities,
                        'preferred_countries': user_prefs.preferred_countries,
                        'target_salary_min': user_prefs.target_salary_min,
                        'target_salary_max': user_prefs.target_salary_max,
                        'accepts_remote': user_prefs.accepts_remote
                    }
                })
            else:
                return Response(
                    {'error': 'Authentication required to update preferences'},
                    status=status.HTTP_401_UNAUTHORIZED
                )
        
    except Exception as e:
        logger.error(f"Error with user preferences: {str(e)}")
        return Response(
            {'error': f'Failed to handle preferences: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
