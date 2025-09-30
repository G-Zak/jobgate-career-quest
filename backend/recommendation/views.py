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

from .models import JobRecommendation, UserJobPreference, SavedJob
from .services import RecommendationEngine
from .advanced_services import AdvancedRecommendationEngine
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
        existing_recommendations = JobRecommendation.objects.filter(candidate_id=candidate.id)

        # Only regenerate if we don't have recommendations or if user profile has changed significantly
        if not existing_recommendations.exists() or user_profile_data:
            # Clear existing recommendations for this candidate to force regeneration
            JobRecommendation.objects.filter(candidate_id=candidate.id).delete()
            
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
        from .models import JobApplication
        
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
        from .models import JobApplication
        
        applications = JobApplication.objects.filter(user=request.user).order_by('-applied_at')
        
        applications_data = []
        for app in applications:
            applications_data.append({
                'id': app.id,
                'job_id': app.job_id,
                'status': app.status,
                'cover_letter': app.cover_letter,
                'resume_url': app.resume_url,
                'applied_at': app.applied_at.isoformat() if app.applied_at else None,
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

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_profile_for_recommendations(request):
    """
    Get complete user profile data for job recommendations
    """
    try:
        # Get or create candidate profile
        try:
            candidate = CandidateProfile.objects.get(user=request.user)
        except CandidateProfile.DoesNotExist:
            candidate = CandidateProfile.objects.create(
                user=request.user,
                first_name=request.user.first_name or 'User',
                last_name=request.user.last_name or 'Name',
                email=request.user.email or 'user@example.com'
            )
        
        # Get user skills
        skills_data = []
        for skill in candidate.skills.all():
            skills_data.append({
                'id': skill.id,
                'name': skill.name,
                'category': skill.category,
                'description': skill.description
            })
        
        # Get user preferences
        user_prefs, _ = UserJobPreference.objects.get_or_create(user=request.user)
        
        # Build complete profile data
        profile_data = {
            'id': candidate.id,
            'user_id': request.user.id,
            'name': f"{candidate.first_name} {candidate.last_name}",
            'first_name': candidate.first_name,
            'last_name': candidate.last_name,
            'email': candidate.email,
            'location': getattr(candidate, 'location', ''),
            'about': getattr(candidate, 'about', ''),
            'skills': skills_data,
            'skills_count': len(skills_data),
            'preferences': {
                'min_score_threshold': user_prefs.min_score_threshold,
                'preferred_job_types': user_prefs.preferred_job_types,
                'preferred_seniority': user_prefs.preferred_seniority,
                'preferred_cities': user_prefs.preferred_cities,
                'preferred_countries': user_prefs.preferred_countries,
                'target_salary_min': user_prefs.target_salary_min,
                'target_salary_max': user_prefs.target_salary_max,
                'accepts_remote': user_prefs.accepts_remote
            },
            'created_at': candidate.created_at.isoformat() if hasattr(candidate, 'created_at') and candidate.created_at else None,
            'updated_at': candidate.updated_at.isoformat() if hasattr(candidate, 'updated_at') and candidate.updated_at else None
        }
        
        return Response({
            'profile': profile_data,
            'success': True
        })
        
    except Exception as e:
        logger.error(f"Error getting user profile: {str(e)}")
        return Response(
            {'error': f'Failed to get user profile: {str(e)}', 'success': False},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def sync_profile_with_recommendations(request):
    """
    Sync user profile data with recommendation system and regenerate recommendations
    """
    try:
        # Get or create candidate profile
        try:
            candidate = CandidateProfile.objects.get(user=request.user)
        except CandidateProfile.DoesNotExist:
            candidate = CandidateProfile.objects.create(
                user=request.user,
                first_name=request.user.first_name or 'User',
                last_name=request.user.last_name or 'Name',
                email=request.user.email or 'user@example.com'
            )
        
        # Update candidate profile with provided data
        profile_data = request.data.get('profile', {})
        
        if 'first_name' in profile_data:
            candidate.first_name = profile_data['first_name']
        if 'last_name' in profile_data:
            candidate.last_name = profile_data['last_name']
        if 'email' in profile_data:
            candidate.email = profile_data['email']
        if 'location' in profile_data:
            candidate.location = profile_data['location']
        if 'about' in profile_data:
            candidate.about = profile_data['about']
        
        candidate.save()
        
        # Update skills if provided
        if 'skills' in profile_data:
            skills_to_add = []
            for skill_data in profile_data['skills']:
                if isinstance(skill_data, dict):
                    skill_name = skill_data.get('name', skill_data.get('skill'))
                else:
                    skill_name = skill_data
                
                if skill_name:
                    skill, created = Skill.objects.get_or_create(
                        name=skill_name,
                        defaults={'category': 'programming', 'description': f'{skill_name} skill'}
                    )
                    skills_to_add.append(skill)
            
            # Clear existing skills and add new ones
            candidate.skills.clear()
            candidate.skills.set(skills_to_add)
        
        # Update user preferences if provided
        preferences = request.data.get('preferences', {})
        if preferences:
            user_prefs, _ = UserJobPreference.objects.get_or_create(user=request.user)
            
            if 'min_score_threshold' in preferences:
                user_prefs.min_score_threshold = preferences['min_score_threshold']
            if 'preferred_job_types' in preferences:
                user_prefs.preferred_job_types = preferences['preferred_job_types']
            if 'preferred_seniority' in preferences:
                user_prefs.preferred_seniority = preferences['preferred_seniority']
            if 'preferred_cities' in preferences:
                user_prefs.preferred_cities = preferences['preferred_cities']
            if 'preferred_countries' in preferences:
                user_prefs.preferred_countries = preferences['preferred_countries']
            if 'target_salary_min' in preferences:
                user_prefs.target_salary_min = preferences['target_salary_min']
            if 'target_salary_max' in preferences:
                user_prefs.target_salary_max = preferences['target_salary_max']
            if 'accepts_remote' in preferences:
                user_prefs.accepts_remote = preferences['accepts_remote']
            
            user_prefs.save()
        
        # Clear existing recommendations to force regeneration
        JobRecommendation.objects.filter(candidate=candidate).delete()
        
        # Generate new recommendations
        engine = RecommendationEngine()
        limit = request.data.get('limit', 10)
        min_score = request.data.get('min_score', 50.0)
        
        # Create user profile data for recommendations
        user_profile_data = {
            'name': f"{candidate.first_name} {candidate.last_name}",
            'email': candidate.email,
            'skillsWithProficiency': [
                {'name': skill.name, 'proficiency': 'intermediate'}
                for skill in candidate.skills.all()
            ],
            'contact': {
                'location': candidate.location or ''
            },
            'education': profile_data.get('education', []),
            'experience': profile_data.get('experience', [])
        }
        
        recommendations = engine.generate_recommendations(
            candidate=candidate,
            limit=limit,
            user_profile_data=user_profile_data
        )
        
        # Filter by minimum score
        recommendations = [r for r in recommendations if r.overall_score >= min_score]
        
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
                    'city': job.city,
                    'job_type': job.job_type,
                    'seniority': job.seniority,
                    'description': job.description,
                    'requirements': job.requirements,
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
                    ],
                    'tags': job.tags
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
        
        return Response({
            'message': 'Profile synced and recommendations generated successfully',
            'recommendations': recommendations_data,
            'total_count': len(recommendations_data),
            'candidate_info': {
                'name': f"{candidate.first_name} {candidate.last_name}",
                'email': candidate.email,
                'skills_count': candidate.skills.count()
            },
            'success': True
        })
        
    except Exception as e:
        logger.error(f"Error syncing profile with recommendations: {str(e)}")
        return Response(
            {'error': f'Failed to sync profile: {str(e)}', 'success': False},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_advanced_recommendations(request):
    """
    Get job recommendations using the enhanced algorithm (Content-Based + K-Means)
    """
    try:
        # Get user profile data
        profile_data = request.data.get('profile', {})
        user_skills = profile_data.get('skills', [])
        user_location = profile_data.get('location', '')
        
        if not user_skills:
            return Response({
                'recommendations': [],
                'total_count': 0,
                'message': 'No skills provided for recommendations'
            })
        
        # Initialize enhanced recommendation engine
        from .enhanced_services import EnhancedRecommendationEngine
        engine = EnhancedRecommendationEngine()
        
        # Generate recommendations using enhanced algorithm
        recommendations = engine.generate_enhanced_recommendations(
            user_skills=user_skills,
            user_location=user_location,
            user_profile_data=profile_data,
            limit=request.data.get('limit', 10)
        )
        
        # Format response to match enhanced algorithm output
        formatted_recommendations = []
        for rec in recommendations:
            job = rec['job']
            formatted_recommendations.append({
                    'id': job['id'],
                    'title': job['title'],
                    'company': job['company'],
                    'location': job['location'],
                'city': job.get('city', ''),
                    'job_type': job['job_type'],
                    'seniority': job['seniority'],
                    'salary_min': job['salary_min'],
                    'salary_max': job['salary_max'],
                    'remote': job['remote'],
                'description': job.get('description', ''),
                'requirements': job.get('requirements', ''),
                'benefits': job.get('benefits', ''),
                'industry': job.get('industry', ''),
                'company_size': job.get('company_size', ''),
                'tags': job['tags'],
                    'required_skills': job['required_skills'],
                    'preferred_skills': job['preferred_skills'],
                'skill_categories': job.get('skill_categories', []),
                
                # AI-Powered Match Details
                'ai_powered_match': {
                    'overall_score': round(rec['score'], 1),
                    'breakdown': {
                        'skill_match': {
                            'score': round(rec['skill_score'], 1),
                            'required_skills': {
                                'matched': rec['required_matched_count'],
                                'total': rec['required_skills_count'],
                                'percentage': round(rec['required_skill_match_percentage'], 1),
                                'matched_skills': rec['required_matched_skills'],
                                'missing_skills': rec['required_missing_skills']
                            },
                            'preferred_skills': {
                                'matched': rec['preferred_matched_count'],
                                'total': rec['preferred_skills_count'],
                                'percentage': round(rec['preferred_skill_match_percentage'], 1),
                                'matched_skills': rec['preferred_matched_skills'],
                                'missing_skills': rec['preferred_missing_skills']
                            }
                        },
                        'content_similarity': {
                            'score': round(rec['content_score'], 1),
                            'description': 'How well your profile matches the job description'
                        },
                        'cluster_fit': {
                            'score': round(rec['cluster_fit_score'], 1),
                            'description': 'How well this job fits your career cluster',
                            'cluster_id': rec.get('cluster_id', 'Unknown'),
                            'cluster_name': rec.get('cluster_name', 'Career Cluster'),
                            'user_fit_percentage': round(rec.get('cluster_fit_score', 0), 1)
                        },
                        'location_remote_fit': {
                            'location_match': rec.get('location_match', False),
                            'location_bonus': round(rec['location_bonus'], 1),
                            'remote_available': rec.get('remote', False),
                            'remote_bonus': round(rec['remote_bonus'], 1),
                            'total_location_score': round(rec['location_bonus'] + rec['remote_bonus'], 1),
                            'description': f"Location: {'Match' if rec.get('location_match', False) else 'No match'} | Remote: {'Available' if rec.get('remote', False) else 'Not available'}"
                        },
                        'experience_seniority': {
                            'user_experience': profile_data.get('experienceLevel', 'intermediate'),
                            'job_seniority': job.get('seniority', 'mid'),
                            'experience_bonus': round(rec['experience_bonus'], 1),
                            'description': f"Your level: {profile_data.get('experienceLevel', 'intermediate')} | Job level: {job.get('seniority', 'mid')}"
                        },
                        'bonuses': {
                            'location': round(rec['location_bonus'], 1),
                            'experience': round(rec['experience_bonus'], 1),
                            'remote': round(rec['remote_bonus'], 1),
                            'salary_fit': round(rec['salary_fit'], 1)
                        },
                        'overall_breakdown': {
                            'skill_match_contribution': round(rec['skill_score'] * 0.7, 1),
                            'content_similarity_contribution': round(rec['content_score'] * 0.2, 1),
                            'cluster_fit_contribution': round(rec['cluster_fit_score'] * 0.1, 1),
                            'location_contribution': round(rec['location_bonus'], 1),
                            'experience_contribution': round(rec['experience_bonus'], 1),
                            'remote_contribution': round(rec['remote_bonus'], 1),
                            'salary_contribution': round(rec['salary_fit'] * 0.05, 1),
                            'total_calculated': round(
                                (rec['skill_score'] * 0.7) +
                                (rec['content_score'] * 0.2) +
                                (rec['cluster_fit_score'] * 0.1) +
                                rec['location_bonus'] +
                                rec['experience_bonus'] +
                                rec['remote_bonus'] +
                                (rec['salary_fit'] * 0.05), 1
                            ),
                            'weighting_explanation': {
                                'skill_match': '70% - Most important factor',
                                'content_similarity': '20% - Job description match',
                                'cluster_fit': '10% - Career cluster alignment',
                                'location_bonus': 'Fixed bonus for location match',
                                'experience_bonus': 'Fixed bonus for experience match',
                                'remote_bonus': 'Fixed bonus for remote work',
                                'salary_fit': '5% - Salary expectations'
                            }
                        }
                    },
                    'explanation': f"Good match! This job fits well with your skills and experience. You match {rec['required_skill_match_percentage']:.0f}% of required skills - excellent!"
                }
            })
        
        # Get cluster information for debugging
        cluster_info = engine.get_cluster_info_enhanced()
        
        return Response({
            'recommendations': formatted_recommendations,
            'total_count': len(formatted_recommendations),
            'algorithm_info': {
                'method': 'Enhanced Content-Based Filtering + K-Means Clustering',
                'clusters': cluster_info,
                'is_trained': engine.is_trained
            },
            'success': True
        })
        
    except Exception as e:
        logger.error(f"Error getting advanced recommendations: {str(e)}")
        return Response(
            {'error': f'Failed to get recommendations: {str(e)}', 'success': False},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_saved_recommendations(request):
    """
    Get saved job recommendations for the current user
    """
    try:
        # Get candidate profile
        try:
            candidate = CandidateProfile.objects.get(user=request.user)
        except CandidateProfile.DoesNotExist:
            return Response({
                'recommendations': [],
                'total_count': 0,
                'message': 'No candidate profile found'
            })
        
        # Get parameters
        limit = int(request.GET.get('limit', 10))
        min_score = float(request.GET.get('min_score', 0.0))
        status_filter = request.GET.get('status', None)
        
        # Get saved recommendations
        recommendations_query = JobRecommendation.objects.filter(candidate=candidate)
        
        # Filter by minimum score
        if min_score > 0:
            recommendations_query = recommendations_query.filter(overall_score__gte=min_score)
        
        # Filter by status
        if status_filter:
            recommendations_query = recommendations_query.filter(status=status_filter)
        
        # Order by score and creation date
        recommendations = recommendations_query.order_by('-overall_score', '-created_at')[:limit]
        
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
                    'city': job.city,
                    'job_type': job.job_type,
                    'seniority': job.seniority,
                    'description': job.description,
                    'requirements': job.requirements,
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
                    ],
                    'tags': job.tags
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
        
        return Response({
            'recommendations': recommendations_data,
            'total_count': len(recommendations_data),
            'candidate_info': {
                'name': f"{candidate.first_name} {candidate.last_name}",
                'email': candidate.email,
                'skills_count': candidate.skills.count()
            }
        })
        
    except Exception as e:
        logger.error(f"Error getting saved recommendations: {str(e)}")
        return Response(
            {'error': f'Failed to get saved recommendations: {str(e)}'},
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


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def saved_jobs_api(request):
    """
    API endpoint for managing saved jobs
    GET: Retrieve user's saved jobs
    POST: Save a job for the user
    """
    try:
        user = request.user
        
        if request.method == 'GET':
            # Get user_id from query params
            user_id = request.GET.get('user_id')
            if user_id and str(user.id) != str(user_id):
                return Response(
                    {'error': 'Cannot access other user\'s saved jobs'},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            # Get saved jobs for the user
            saved_jobs = SavedJob.objects.filter(user=user).order_by('-saved_at')
            
            # Format response
            jobs_data = []
            for saved_job in saved_jobs:
                jobs_data.append({
                    'id': saved_job.id,
                    'job_id': saved_job.job_id,
                    'job_title': saved_job.job_title,
                    'job_company': saved_job.job_company,
                    'saved_at': saved_job.saved_at.isoformat()
                })
            
            return Response({
                'results': jobs_data,
                'count': len(jobs_data)
            })
        
        elif request.method == 'POST':
            # Save a job
            data = request.data
            job_id = data.get('job_id')
            job_title = data.get('job_title', '')
            job_company = data.get('job_company', '')
            
            if not job_id:
                return Response(
                    {'error': 'job_id is required'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Create or update saved job
            saved_job, created = SavedJob.objects.get_or_create(
                user=user,
                job_id=job_id,
                defaults={
                    'job_title': job_title,
                    'job_company': job_company
                }
            )
            
            if not created:
                # Update existing saved job
                saved_job.job_title = job_title
                saved_job.job_company = job_company
                saved_job.save()
            
            return Response({
                'message': 'Job saved successfully',
                'saved_job': {
                    'id': saved_job.id,
                    'job_id': saved_job.job_id,
                    'job_title': saved_job.job_title,
                    'job_company': saved_job.job_company,
                    'saved_at': saved_job.saved_at.isoformat()
                }
            }, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)
    
    except Exception as e:
        logger.error(f"Error with saved jobs API: {str(e)}")
        return Response(
            {'error': f'Failed to handle saved jobs: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_saved_job(request, job_id):
    """
    API endpoint to delete a saved job
    """
    try:
        user = request.user
        
        try:
            saved_job = SavedJob.objects.get(user=user, job_id=job_id)
            saved_job.delete()
            
            return Response({
                'message': 'Job removed from saved jobs successfully'
            })
        
        except SavedJob.DoesNotExist:
            return Response(
                {'error': 'Saved job not found'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    except Exception as e:
        logger.error(f"Error deleting saved job: {str(e)}")
        return Response(
            {'error': f'Failed to delete saved job: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
