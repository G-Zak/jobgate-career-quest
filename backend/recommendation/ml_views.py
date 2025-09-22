"""
API Views for Machine Learning-based Job Recommendations

This module provides REST API endpoints for:
1. Content-based filtering recommendations
2. K-Means clustering recommendations  
3. Hybrid recommendations
4. Recommendation model training and management

Author: JobGate Development Team
"""

import logging
from rest_framework import status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db.models import Q, Avg
from django.utils import timezone
from datetime import timedelta

from .models import JobOffer, JobRecommendation, CandidateProfile
from .ml_recommender import (
    ContentBasedRecommender,
    JobClusterRecommender, 
    HybridRecommender,
    get_ml_recommendations,
    save_recommendations_to_db
)
from skills.models import Skill

logger = logging.getLogger(__name__)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_content_based_recommendations(request):
    """
    Get content-based job recommendations using TF-IDF and cosine similarity
    
    POST /api/recommendations/content-based/
    
    Body:
    {
        "candidate_id": 1,
        "top_k": 5,
        "min_similarity": 0.1,
        "user_profile_data": {
            "skillsWithProficiency": [...],
            "bio": "...",
            "location": "..."
        }
    }
    """
    try:
        candidate_id = request.data.get('candidate_id')
        top_k = request.data.get('top_k', 5)
        min_similarity = request.data.get('min_similarity', 0.1)
        user_profile_data = request.data.get('user_profile_data', {})
        
        if not candidate_id:
            return Response(
                {'error': 'candidate_id is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get candidate
        candidate = get_object_or_404(CandidateProfile, id=candidate_id)
        
        # Get recommendations
        recommendations = get_ml_recommendations(
            candidate=candidate,
            user_profile_data=user_profile_data,
            recommendation_type='content',
            top_k=top_k
        )
        
        # Format response
        formatted_recommendations = []
        for rec in recommendations:
            job = rec['job']
            formatted_recommendations.append({
                'job_id': job.id,
                'title': job.title,
                'company': job.company,
                'location': job.location,
                'job_type': job.job_type,
                'seniority': job.seniority,
                'salary_range': job.salary_range,
                'remote': job.remote,
                'similarity_score': rec['similarity_score'],
                'recommendation_type': rec['recommendation_type'],
                'matched_features': rec.get('matched_features', []),
                'posted_at': job.posted_at.isoformat(),
                'description_preview': job.description[:200] + '...' if len(job.description) > 200 else job.description
            })
        
        return Response({
            'success': True,
            'recommendations': formatted_recommendations,
            'total_count': len(formatted_recommendations),
            'algorithm': 'content_based_tfidf_cosine'
        })
        
    except Exception as e:
        logger.error(f"Error in content-based recommendations: {str(e)}")
        return Response(
            {'error': f'Failed to generate recommendations: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_cluster_based_recommendations(request):
    """
    Get cluster-based job recommendations using K-Means clustering
    
    POST /api/recommendations/cluster-based/
    
    Body:
    {
        "candidate_id": 1,
        "top_k": 5,
        "user_profile_data": {...}
    }
    """
    try:
        candidate_id = request.data.get('candidate_id')
        top_k = request.data.get('top_k', 5)
        user_profile_data = request.data.get('user_profile_data', {})
        
        if not candidate_id:
            return Response(
                {'error': 'candidate_id is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get candidate
        candidate = get_object_or_404(CandidateProfile, id=candidate_id)
        
        # Get recommendations
        recommendations = get_ml_recommendations(
            candidate=candidate,
            user_profile_data=user_profile_data,
            recommendation_type='cluster',
            top_k=top_k
        )
        
        # Format response
        formatted_recommendations = []
        for rec in recommendations:
            job = rec['job']
            formatted_recommendations.append({
                'job_id': job.id,
                'title': job.title,
                'company': job.company,
                'location': job.location,
                'job_type': job.job_type,
                'seniority': job.seniority,
                'salary_range': job.salary_range,
                'remote': job.remote,
                'similarity_score': rec['similarity_score'],
                'recommendation_type': rec['recommendation_type'],
                'cluster_info': rec.get('cluster_info', {}),
                'posted_at': job.posted_at.isoformat(),
                'description_preview': job.description[:200] + '...' if len(job.description) > 200 else job.description
            })
        
        return Response({
            'success': True,
            'recommendations': formatted_recommendations,
            'total_count': len(formatted_recommendations),
            'algorithm': 'kmeans_clustering'
        })
        
    except Exception as e:
        logger.error(f"Error in cluster-based recommendations: {str(e)}")
        return Response(
            {'error': f'Failed to generate recommendations: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_hybrid_recommendations(request):
    """
    Get hybrid job recommendations combining content-based and clustering approaches
    
    POST /api/recommendations/hybrid/
    
    Body:
    {
        "candidate_id": 1,
        "top_k": 5,
        "min_similarity": 0.1,
        "user_profile_data": {...}
    }
    """
    try:
        candidate_id = request.data.get('candidate_id')
        top_k = request.data.get('top_k', 5)
        min_similarity = request.data.get('min_similarity', 0.1)
        user_profile_data = request.data.get('user_profile_data', {})
        
        if not candidate_id:
            return Response(
                {'error': 'candidate_id is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get candidate
        candidate = get_object_or_404(CandidateProfile, id=candidate_id)
        
        # Get recommendations
        recommendations = get_ml_recommendations(
            candidate=candidate,
            user_profile_data=user_profile_data,
            recommendation_type='hybrid',
            top_k=top_k
        )
        
        # Format response
        formatted_recommendations = []
        for rec in recommendations:
            job = rec['job']
            formatted_recommendations.append({
                'job_id': job.id,
                'title': job.title,
                'company': job.company,
                'location': job.location,
                'job_type': job.job_type,
                'seniority': job.seniority,
                'salary_range': job.salary_range,
                'remote': job.remote,
                'similarity_score': rec['similarity_score'],
                'recommendation_type': rec['recommendation_type'],
                'content_score': rec.get('content_score', 0),
                'cluster_score': rec.get('cluster_score', 0),
                'recommendation_types': rec.get('recommendation_types', []),
                'matched_features': rec.get('matched_features', []),
                'cluster_info': rec.get('cluster_info', {}),
                'posted_at': job.posted_at.isoformat(),
                'description_preview': job.description[:200] + '...' if len(job.description) > 200 else job.description
            })
        
        return Response({
            'success': True,
            'recommendations': formatted_recommendations,
            'total_count': len(formatted_recommendations),
            'algorithm': 'hybrid_content_cluster'
        })
        
    except Exception as e:
        logger.error(f"Error in hybrid recommendations: {str(e)}")
        return Response(
            {'error': f'Failed to generate recommendations: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def save_ml_recommendations(request):
    """
    Save ML recommendations to database
    
    POST /api/recommendations/save-ml/
    
    Body:
    {
        "candidate_id": 1,
        "recommendation_type": "hybrid",
        "top_k": 5,
        "user_profile_data": {...}
    }
    """
    try:
        candidate_id = request.data.get('candidate_id')
        recommendation_type = request.data.get('recommendation_type', 'hybrid')
        top_k = request.data.get('top_k', 5)
        user_profile_data = request.data.get('user_profile_data', {})
        
        if not candidate_id:
            return Response(
                {'error': 'candidate_id is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get candidate
        candidate = get_object_or_404(CandidateProfile, id=candidate_id)
        
        # Get recommendations
        recommendations = get_ml_recommendations(
            candidate=candidate,
            user_profile_data=user_profile_data,
            recommendation_type=recommendation_type,
            top_k=top_k
        )
        
        # Save to database
        created_recommendations = save_recommendations_to_db(candidate, recommendations)
        
        return Response({
            'success': True,
            'message': f'Successfully saved {len(created_recommendations)} ML recommendations',
            'created_count': len(created_recommendations),
            'algorithm': recommendation_type
        })
        
    except Exception as e:
        logger.error(f"Error saving ML recommendations: {str(e)}")
        return Response(
            {'error': f'Failed to save recommendations: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_recommendation_analytics(request):
    """
    Get analytics about recommendation performance
    
    GET /api/recommendations/analytics/
    """
    try:
        # Get recent recommendations
        recent_recommendations = JobRecommendation.objects.filter(
            created_at__gte=timezone.now() - timedelta(days=30)
        )
        
        # Calculate statistics
        total_recommendations = recent_recommendations.count()
        viewed_recommendations = recent_recommendations.filter(status='viewed').count()
        applied_recommendations = recent_recommendations.filter(status='applied').count()
        
        # Average scores by recommendation type
        ml_recommendations = recent_recommendations.filter(
            recommendation_reason__icontains='ML'
        )
        
        avg_ml_score = ml_recommendations.aggregate(
            avg_score=Avg('overall_score')
        )['avg_score'] or 0
        
        # Job type distribution
        job_types = recent_recommendations.values_list('job__job_type', flat=True).distinct()
        
        analytics = {
            'total_recommendations': total_recommendations,
            'viewed_recommendations': viewed_recommendations,
            'applied_recommendations': applied_recommendations,
            'view_rate': (viewed_recommendations / total_recommendations * 100) if total_recommendations > 0 else 0,
            'application_rate': (applied_recommendations / total_recommendations * 100) if total_recommendations > 0 else 0,
            'avg_ml_score': round(avg_ml_score, 2),
            'job_types': list(job_types),
            'period_days': 30
        }
        
        return Response({
            'success': True,
            'analytics': analytics
        })
        
    except Exception as e:
        logger.error(f"Error getting recommendation analytics: {str(e)}")
        return Response(
            {'error': f'Failed to get analytics: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def train_recommendation_models(request):
    """
    Train/retrain recommendation models with current job data
    
    POST /api/recommendations/train-models/
    
    Body:
    {
        "force_retrain": false,
        "min_jobs": 10
    }
    """
    try:
        force_retrain = request.data.get('force_retrain', False)
        min_jobs = request.data.get('min_jobs', 10)
        
        # Get active jobs
        active_jobs = JobOffer.objects.filter(status='active')
        
        if active_jobs.count() < min_jobs:
            return Response(
                {'error': f'Not enough active jobs for training. Need at least {min_jobs}, got {active_jobs.count()}'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Initialize and train models
        content_recommender = ContentBasedRecommender()
        cluster_recommender = JobClusterRecommender()
        
        jobs_list = list(active_jobs)
        
        # Train content-based model
        content_recommender.fit(jobs_list)
        
        # Train clustering model
        cluster_recommender.fit(jobs_list)
        
        return Response({
            'success': True,
            'message': 'Models trained successfully',
            'jobs_used': len(jobs_list),
            'content_model_features': content_recommender.job_vectors.shape[1] if content_recommender.is_fitted else 0,
            'cluster_model_clusters': cluster_recommender.n_clusters if cluster_recommender.is_fitted else 0
        })
        
    except Exception as e:
        logger.error(f"Error training recommendation models: {str(e)}")
        return Response(
            {'error': f'Failed to train models: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
