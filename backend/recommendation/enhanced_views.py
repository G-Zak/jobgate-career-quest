"""
Enhanced views for job recommendations with detailed breakdowns and transparency
"""
import logging
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
from django.utils import timezone
from django.core.cache import cache
from django.db.models import Q, Count, Avg, Max, Min
from datetime import timedelta
import json

from .enhanced_services import EnhancedRecommendationEngine
from .models import JobRecommendation, JobRecommendationDetail, ScoringWeights, RecommendationAnalytics
from skills.models import CandidateProfile

logger = logging.getLogger(__name__)

# Global engine instance
recommendation_engine = EnhancedRecommendationEngine()


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_enhanced_recommendations(request):
    """
    Get enhanced job recommendations with detailed breakdowns
    """
    try:
        user = request.user
        data = request.data
        
        # Extract user profile data
        user_skills = data.get('skills', [])
        user_location = data.get('location', '')
        user_profile_data = data.get('profile_data', {})
        limit = data.get('limit', 10)
        
        if not user_skills:
            return Response({
                'error': 'Skills are required for recommendations',
                'recommendations': []
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Generate recommendations using enhanced engine
        recommendations = recommendation_engine.generate_enhanced_recommendations(
            user_skills=user_skills,
            user_location=user_location,
            user_profile_data=user_profile_data,
            limit=limit
        )
        
        if not recommendations:
            return Response({
                'message': 'No recommendations found',
                'recommendations': []
            }, status=status.HTTP_200_OK)
        
        # Store recommendations in database
        with transaction.atomic():
            # Clear old recommendations for this user
            JobRecommendation.objects.filter(user=user).delete()
            JobRecommendationDetail.objects.filter(user=user).delete()
            
            # Create new recommendations
            for rec in recommendations:
                job_offer = rec['job']
                
                # Create main recommendation record
                job_rec = JobRecommendation.objects.create(
                    user=user,
                    job_offer_id=job_offer['id'],
                    score=rec['score'],
                    algorithm_version="enhanced_v1"
                )
                
                # Create detailed breakdown
                JobRecommendationDetail.objects.create(
                    job_offer_id=job_offer['id'],
                    user=user,
                    overall_score=rec['score'],
                    content_score=rec['content_score'],
                    skill_score=rec['skill_score'],
                    cluster_fit_score=rec['cluster_fit_score'],
                    required_skill_score=rec['required_skill_match_percentage'],
                    preferred_skill_score=rec['preferred_skill_match_percentage'],
                    required_skills_count=rec['required_skills_count'],
                    preferred_skills_count=rec['preferred_skills_count'],
                    required_matched_count=rec['required_matched_count'],
                    preferred_matched_count=rec['preferred_matched_count'],
                    location_bonus=rec['location_bonus'],
                    experience_bonus=rec['experience_bonus'],
                    remote_bonus=rec['remote_bonus'],
                    salary_fit=rec['salary_fit'],
                    matched_skills=rec['matched_skills'],
                    missing_skills=rec['missing_skills'],
                    required_matched_skills=rec['required_matched_skills'],
                    preferred_matched_skills=rec['preferred_matched_skills'],
                    required_missing_skills=rec['required_missing_skills'],
                    preferred_missing_skills=rec['preferred_missing_skills']
                )
        
        # Prepare response with detailed breakdowns
        response_data = []
        for rec in recommendations:
            job = rec['job']
            
            response_data.append({
                'id': job['id'],
                'title': job['title'],
                'company': job['company'],
                'location': job['location'],
                'city': job['city'],
                'job_type': job['job_type'],
                'seniority': job['seniority'],
                'salary_min': job['salary_min'],
                'salary_max': job['salary_max'],
                'remote': job['remote'],
                'description': job['description'],
                'requirements': job['requirements'],
                'benefits': job['benefits'],
                'industry': job['industry'],
                'company_size': job['company_size'],
                'tags': job['tags'],
                'required_skills': job['required_skills'],
                'preferred_skills': job['preferred_skills'],
                'skill_categories': job['skill_categories'],
                
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
                            'description': 'How well this job fits your career cluster'
                        },
                        'bonuses': {
                            'location': round(rec['location_bonus'], 1),
                            'experience': round(rec['experience_bonus'], 1),
                            'remote': round(rec['remote_bonus'], 1),
                            'salary_fit': round(rec['salary_fit'], 1)
                        }
                    },
                    'explanation': generate_match_explanation(rec)
                }
            })
        
        # Update analytics
        update_recommendation_analytics(len(recommendations), recommendations)
        
        return Response({
            'recommendations': response_data,
            'total': len(response_data),
            'algorithm_version': 'enhanced_v1',
            'generated_at': timezone.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Error generating enhanced recommendations: {str(e)}")
        return Response({
            'error': 'Failed to generate recommendations',
            'details': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_recommendation_detail(request, job_id):
    """
    Get detailed breakdown for a specific job recommendation
    """
    try:
        user = request.user
        
        # Get recommendation detail
        detail = JobRecommendationDetail.objects.filter(
            user=user,
            job_offer_id=job_id
        ).first()
        
        if not detail:
            return Response({
                'error': 'Recommendation detail not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Get job offer
        job_offer = detail.job_offer
        
        response_data = {
            'job': {
                'id': job_offer.id,
                'title': job_offer.title,
                'company': job_offer.company,
                'location': job_offer.location,
                'city': job_offer.city,
                'job_type': job_offer.job_type,
                'seniority': job_offer.seniority,
                'salary_min': job_offer.salary_min,
                'salary_max': job_offer.salary_max,
                'remote': job_offer.remote,
                'description': job_offer.description,
                'requirements': job_offer.requirements,
                'benefits': job_offer.benefits,
                'industry': job_offer.industry,
                'company_size': job_offer.company_size,
                'tags': job_offer.tags,
                'required_skills': [skill.name for skill in job_offer.required_skills.all()],
                'preferred_skills': [skill.name for skill in job_offer.preferred_skills.all()]
            },
            'ai_powered_match': {
                'overall_score': round(detail.overall_score, 1),
                'breakdown': {
                    'skill_match': {
                        'score': round(detail.skill_score, 1),
                        'required_skills': {
                            'matched': detail.required_matched_count,
                            'total': detail.required_skills_count,
                            'percentage': round(detail.get_required_skill_match_percentage(), 1),
                            'matched_skills': detail.required_matched_skills,
                            'missing_skills': detail.required_missing_skills
                        },
                        'preferred_skills': {
                            'matched': detail.preferred_matched_count,
                            'total': detail.preferred_skills_count,
                            'percentage': round(detail.get_preferred_skill_match_percentage(), 1),
                            'matched_skills': detail.preferred_matched_skills,
                            'missing_skills': detail.preferred_missing_skills
                        }
                    },
                    'content_similarity': {
                        'score': round(detail.content_score, 1),
                        'description': 'How well your profile matches the job description'
                    },
                    'cluster_fit': {
                        'score': round(detail.cluster_fit_score, 1),
                        'description': 'How well this job fits your career cluster'
                    },
                    'bonuses': {
                        'location': round(detail.location_bonus, 1),
                        'experience': round(detail.experience_bonus, 1),
                        'remote': round(detail.remote_bonus, 1),
                        'salary_fit': round(detail.salary_fit, 1)
                    }
                },
                'explanation': generate_match_explanation_from_detail(detail)
            },
            'created_at': detail.created_at.isoformat(),
            'updated_at': detail.updated_at.isoformat()
        }
        
        return Response(response_data)
        
    except Exception as e:
        logger.error(f"Error getting recommendation detail: {str(e)}")
        return Response({
            'error': 'Failed to get recommendation detail',
            'details': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_scoring_weights(request):
    """
    Get current scoring weights configuration
    """
    try:
        weights = ScoringWeights.objects.filter(is_active=True).first()
        
        if not weights:
            # Return default weights
            default_weights = recommendation_engine.scoring_weights
            return Response({
                'weights': default_weights,
                'is_default': True
            })
        
        return Response({
            'weights': weights.get_weights_dict(),
            'is_default': False,
            'name': weights.name,
            'updated_at': weights.updated_at.isoformat()
        })
        
    except Exception as e:
        logger.error(f"Error getting scoring weights: {str(e)}")
        return Response({
            'error': 'Failed to get scoring weights',
            'details': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_scoring_weights(request):
    """
    Update scoring weights configuration (admin only)
    """
    try:
        if not request.user.is_staff:
            return Response({
                'error': 'Permission denied. Admin access required.'
            }, status=status.HTTP_403_FORBIDDEN)
        
        data = request.data
        
        # Deactivate current active weights
        ScoringWeights.objects.filter(is_active=True).update(is_active=False)
        
        # Create new weights
        weights = ScoringWeights.objects.create(
            name=data.get('name', 'Custom Weights'),
            skill_match_weight=data.get('skill_match_weight', 0.70),
            content_similarity_weight=data.get('content_similarity_weight', 0.20),
            cluster_fit_weight=data.get('cluster_fit_weight', 0.10),
            required_skill_weight=data.get('required_skill_weight', 0.80),
            preferred_skill_weight=data.get('preferred_skill_weight', 0.20),
            location_bonus_weight=data.get('location_bonus_weight', 0.05),
            experience_bonus_weight=data.get('experience_bonus_weight', 0.03),
            remote_bonus_weight=data.get('remote_bonus_weight', 0.02),
            salary_fit_weight=data.get('salary_fit_weight', 0.00),
            min_score_threshold=data.get('min_score_threshold', 15.0),
            max_recommendations=data.get('max_recommendations', 10),
            created_by=request.user
        )
        
        # Update engine weights
        recommendation_engine.scoring_weights = weights.get_weights_dict()
        
        return Response({
            'message': 'Scoring weights updated successfully',
            'weights': weights.get_weights_dict()
        })
        
    except Exception as e:
        logger.error(f"Error updating scoring weights: {str(e)}")
        return Response({
            'error': 'Failed to update scoring weights',
            'details': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_cluster_info(request):
    """
    Get cluster information for analysis
    """
    try:
        if not request.user.is_staff:
            return Response({
                'error': 'Permission denied. Admin access required.'
            }, status=status.HTTP_403_FORBIDDEN)
        
        cluster_info = recommendation_engine.get_cluster_info_enhanced()
        
        return Response({
            'clusters': cluster_info,
            'total_clusters': len(cluster_info),
            'algorithm_trained': recommendation_engine.is_trained
        })
        
    except Exception as e:
        logger.error(f"Error getting cluster info: {str(e)}")
        return Response({
            'error': 'Failed to get cluster info',
            'details': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_recommendation_analytics(request):
    """
    Get recommendation system analytics
    """
    try:
        if not request.user.is_staff:
            return Response({
                'error': 'Permission denied. Admin access required.'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Get analytics for last 30 days
        end_date = timezone.now().date()
        start_date = end_date - timedelta(days=30)
        
        analytics = RecommendationAnalytics.objects.filter(
            date__range=[start_date, end_date]
        ).order_by('-date')
        
        analytics_data = []
        for analytic in analytics:
            analytics_data.append({
                'date': analytic.date.isoformat(),
                'total_recommendations': analytic.total_recommendations,
                'avg_score': round(analytic.avg_score, 2),
                'min_score': round(analytic.min_score, 2),
                'max_score': round(analytic.max_score, 2),
                'avg_skill_match': round(analytic.avg_skill_match, 2),
                'avg_required_skill_match': round(analytic.avg_required_skill_match, 2),
                'avg_preferred_skill_match': round(analytic.avg_preferred_skill_match, 2),
                'avg_cluster_fit': round(analytic.avg_cluster_fit, 2),
                'recommendations_viewed': analytic.recommendations_viewed,
                'applications_from_recommendations': analytic.applications_from_recommendations,
                'jobs_saved_from_recommendations': analytic.jobs_saved_from_recommendations
            })
        
        return Response({
            'analytics': analytics_data,
            'period': {
                'start_date': start_date.isoformat(),
                'end_date': end_date.isoformat()
            }
        })
        
    except Exception as e:
        logger.error(f"Error getting recommendation analytics: {str(e)}")
        return Response({
            'error': 'Failed to get analytics',
            'details': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def generate_match_explanation(rec_data):
    """
    Generate human-readable explanation for match score
    """
    score = rec_data['score']
    required_match = rec_data['required_skill_match_percentage']
    preferred_match = rec_data['preferred_skill_match_percentage']
    
    explanations = []
    
    # Overall score explanation
    if score >= 80:
        explanations.append("Excellent match! This job aligns very well with your profile.")
    elif score >= 60:
        explanations.append("Good match! This job fits well with your skills and experience.")
    elif score >= 40:
        explanations.append("Moderate match. Consider developing missing skills to improve your fit.")
    else:
        explanations.append("Basic match. This job may require significant skill development.")
    
    # Required skills explanation
    if required_match >= 80:
        explanations.append(f"You match {required_match:.0f}% of required skills - excellent!")
    elif required_match >= 60:
        explanations.append(f"You match {required_match:.0f}% of required skills - good fit.")
    elif required_match >= 40:
        explanations.append(f"You match {required_match:.0f}% of required skills - consider learning the missing ones.")
    else:
        explanations.append(f"You match {required_match:.0f}% of required skills - focus on developing these skills.")
    
    # Preferred skills explanation
    if preferred_match > 0:
        if preferred_match >= 60:
            explanations.append(f"You also match {preferred_match:.0f}% of preferred skills - great bonus!")
        elif preferred_match >= 30:
            explanations.append(f"You match {preferred_match:.0f}% of preferred skills - nice addition.")
        else:
            explanations.append(f"You match {preferred_match:.0f}% of preferred skills - room for improvement.")
    
    return " ".join(explanations)


def generate_match_explanation_from_detail(detail):
    """
    Generate explanation from stored detail
    """
    score = detail.overall_score
    required_match = detail.get_required_skill_match_percentage()
    preferred_match = detail.get_preferred_skill_match_percentage()
    
    explanations = []
    
    if score >= 80:
        explanations.append("Excellent match! This job aligns very well with your profile.")
    elif score >= 60:
        explanations.append("Good match! This job fits well with your skills and experience.")
    elif score >= 40:
        explanations.append("Moderate match. Consider developing missing skills to improve your fit.")
    else:
        explanations.append("Basic match. This job may require significant skill development.")
    
    if required_match >= 80:
        explanations.append(f"You match {required_match:.0f}% of required skills - excellent!")
    elif required_match >= 60:
        explanations.append(f"You match {required_match:.0f}% of required skills - good fit.")
    elif required_match >= 40:
        explanations.append(f"You match {required_match:.0f}% of required skills - consider learning the missing ones.")
    else:
        explanations.append(f"You match {required_match:.0f}% of required skills - focus on developing these skills.")
    
    if preferred_match > 0:
        if preferred_match >= 60:
            explanations.append(f"You also match {preferred_match:.0f}% of preferred skills - great bonus!")
        elif preferred_match >= 30:
            explanations.append(f"You match {preferred_match:.0f}% of preferred skills - nice addition.")
        else:
            explanations.append(f"You match {preferred_match:.0f}% of preferred skills - room for improvement.")
    
    return " ".join(explanations)


def update_recommendation_analytics(total_recommendations, recommendations):
    """
    Update recommendation analytics
    """
    try:
        today = timezone.now().date()
        
        # Calculate metrics
        scores = [rec['score'] for rec in recommendations]
        skill_scores = [rec['skill_score'] for rec in recommendations]
        required_scores = [rec['required_skill_match_percentage'] for rec in recommendations]
        preferred_scores = [rec['preferred_skill_match_percentage'] for rec in recommendations]
        cluster_scores = [rec['cluster_fit_score'] for rec in recommendations]
        
        # Get or create analytics record
        analytics, created = RecommendationAnalytics.objects.get_or_create(
            date=today,
            defaults={
                'total_recommendations': total_recommendations,
                'avg_score': sum(scores) / len(scores) if scores else 0,
                'min_score': min(scores) if scores else 0,
                'max_score': max(scores) if scores else 0,
                'avg_skill_match': sum(skill_scores) / len(skill_scores) if skill_scores else 0,
                'avg_required_skill_match': sum(required_scores) / len(required_scores) if required_scores else 0,
                'avg_preferred_skill_match': sum(preferred_scores) / len(preferred_scores) if preferred_scores else 0,
                'avg_cluster_fit': sum(cluster_scores) / len(cluster_scores) if cluster_scores else 0
            }
        )
        
        if not created:
            # Update existing record
            analytics.total_recommendations += total_recommendations
            analytics.avg_score = (analytics.avg_score + sum(scores) / len(scores)) / 2 if scores else analytics.avg_score
            analytics.min_score = min(analytics.min_score, min(scores)) if scores else analytics.min_score
            analytics.max_score = max(analytics.max_score, max(scores)) if scores else analytics.max_score
            analytics.save()
        
    except Exception as e:
        logger.error(f"Error updating analytics: {str(e)}")
