"""
API views for cognitive job recommendation system
"""

import logging
from typing import List, Optional
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.db.models import Q
from django.http import JsonResponse

from .models import JobOffer, JobRecommendation, ScoringWeights, ClusterCenters
from .serializers import JobOfferSerializer
from django.core.paginator import Paginator
from .cognitive_recommendation_service import CognitiveRecommendationService
from .kmeans_clustering_service import KMeansClusteringService
from .tasks import (
    compute_recommendations_for_candidate,
    compute_recommendations_for_job,
    batch_recompute_all_recommendations,
    train_kmeans_clusters
)

logger = logging.getLogger(__name__)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_recommendations_for_candidate(request, candidate_id: int):
    """
    Get job recommendations for a specific candidate
    """
    try:
        # Validate candidate
        if request.user.id != candidate_id and not request.user.is_staff:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            candidate = User.objects.get(id=candidate_id)
        except User.DoesNotExist:
            return Response({'error': 'Candidate not found'}, status=status.HTTP_404_NOT_FOUND)
        
        # Get query parameters
        limit = int(request.GET.get('limit', 10))
        min_score = float(request.GET.get('min_score', 0.0))
        include_breakdown = request.GET.get('include_breakdown', 'false').lower() == 'true'
        
        # Get recommendations
        recommendations = JobRecommendation.objects.filter(
            candidate_id=candidate_id,
            overall_score__gte=min_score
        ).select_related('job_offer').order_by('-overall_score')[:limit]
        
        # Format response
        results = []
        for rec in recommendations:
            job_data = {
                'id': rec.job_offer.id,
                'title': rec.job_offer.title,
                'company': rec.job_offer.company,
                'location': rec.job_offer.location,
                'salary_min': rec.job_offer.salary_min,
                'salary_max': rec.job_offer.salary_max,
                'currency': rec.job_offer.currency,
                'remote_flag': rec.job_offer.remote_flag,
                'seniority': rec.job_offer.seniority,
                'posted_at': rec.job_offer.posted_at.isoformat(),
            }
            
            recommendation_data = {
                'job_offer': job_data,
                'overall_score': rec.overall_score,
                'technical_test_score': rec.technical_test_score,
                'skill_match_score': rec.skill_match_score,
                'experience_score': rec.experience_score,
                'salary_score': rec.salary_score,
                'location_score': rec.location_score,
                'cluster_fit_score': rec.cluster_fit_score,
                'computed_at': rec.computed_at.isoformat(),
                'algorithm_version': rec.algorithm_version
            }
            
            if include_breakdown:
                recommendation_data['breakdown'] = rec.breakdown
            
            results.append(recommendation_data)
        
        return Response({
            'candidate_id': candidate_id,
            'recommendations': results,
            'total_found': len(results),
            'parameters': {
                'limit': limit,
                'min_score': min_score,
                'include_breakdown': include_breakdown
            }
        })
        
    except Exception as e:
        logger.error(f"Error getting recommendations for candidate {candidate_id}: {str(e)}")
        return Response({'error': 'Internal server error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def recompute_recommendations_for_candidate(request, candidate_id: int):
    """
    Trigger recomputation of recommendations for a candidate
    """
    try:
        # Validate permissions
        if request.user.id != candidate_id and not request.user.is_staff:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        
        # Validate candidate exists
        try:
            candidate = User.objects.get(id=candidate_id)
        except User.DoesNotExist:
            return Response({'error': 'Candidate not found'}, status=status.HTTP_404_NOT_FOUND)
        
        # Get optional job IDs from request
        job_offer_ids = request.data.get('job_offer_ids', None)
        
        # Enqueue background task
        task = compute_recommendations_for_candidate.delay(candidate_id, job_offer_ids)
        
        return Response({
            'message': 'Recommendation recomputation started',
            'task_id': task.id,
            'candidate_id': candidate_id,
            'job_offer_ids': job_offer_ids
        }, status=status.HTTP_202_ACCEPTED)
        
    except Exception as e:
        logger.error(f"Error triggering recomputation for candidate {candidate_id}: {str(e)}")
        return Response({'error': 'Internal server error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_recommendations_for_job(request, job_offer_id: int):
    """
    Get candidate recommendations for a specific job offer (admin only)
    """
    try:
        # Only staff can view job recommendations
        if not request.user.is_staff:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        
        # Validate job offer
        try:
            job_offer = JobOffer.objects.get(id=job_offer_id)
        except JobOffer.DoesNotExist:
            return Response({'error': 'Job offer not found'}, status=status.HTTP_404_NOT_FOUND)
        
        # Get query parameters
        limit = int(request.GET.get('limit', 20))
        min_score = float(request.GET.get('min_score', 0.0))
        include_breakdown = request.GET.get('include_breakdown', 'false').lower() == 'true'
        
        # Get recommendations
        recommendations = JobRecommendation.objects.filter(
            job_offer_id=job_offer_id,
            overall_score__gte=min_score
        ).order_by('-overall_score')[:limit]
        
        # Format response
        results = []
        for rec in recommendations:
            try:
                candidate = User.objects.get(id=rec.candidate_id)
                candidate_profile = candidate.candidateprofile
                
                candidate_data = {
                    'id': candidate.id,
                    'first_name': candidate_profile.first_name,
                    'last_name': candidate_profile.last_name,
                    'email': candidate_profile.email,
                    'location': candidate_profile.location,
                    'skills_count': candidate_profile.skills.count()
                }
                
                recommendation_data = {
                    'candidate': candidate_data,
                    'overall_score': rec.overall_score,
                    'technical_test_score': rec.technical_test_score,
                    'skill_match_score': rec.skill_match_score,
                    'experience_score': rec.experience_score,
                    'salary_score': rec.salary_score,
                    'location_score': rec.location_score,
                    'cluster_fit_score': rec.cluster_fit_score,
                    'computed_at': rec.computed_at.isoformat(),
                    'algorithm_version': rec.algorithm_version
                }
                
                if include_breakdown:
                    recommendation_data['breakdown'] = rec.breakdown
                
                results.append(recommendation_data)
                
            except (User.DoesNotExist, AttributeError):
                # Skip recommendations for deleted/invalid candidates
                continue
        
        return Response({
            'job_offer_id': job_offer_id,
            'job_title': job_offer.title,
            'recommendations': results,
            'total_found': len(results),
            'parameters': {
                'limit': limit,
                'min_score': min_score,
                'include_breakdown': include_breakdown
            }
        })
        
    except Exception as e:
        logger.error(f"Error getting recommendations for job {job_offer_id}: {str(e)}")
        return Response({'error': 'Internal server error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def batch_recompute_all(request):
    """
    Trigger batch recomputation of all recommendations (admin only)
    """
    try:
        # Only staff can trigger batch recomputation
        if not request.user.is_staff:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        
        # Enqueue background task
        task = batch_recompute_all_recommendations.delay()
        
        return Response({
            'message': 'Batch recomputation started',
            'task_id': task.id,
            'note': 'This may take several minutes to complete'
        }, status=status.HTTP_202_ACCEPTED)
        
    except Exception as e:
        logger.error(f"Error triggering batch recomputation: {str(e)}")
        return Response({'error': 'Internal server error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def train_clustering_model(request):
    """
    Trigger K-Means clustering model training (admin only)
    """
    try:
        # Only staff can trigger clustering
        if not request.user.is_staff:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        
        # Get parameters
        n_clusters = int(request.data.get('n_clusters', 8))
        
        if n_clusters < 2 or n_clusters > 20:
            return Response({'error': 'n_clusters must be between 2 and 20'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Enqueue background task
        task = train_kmeans_clusters.delay(n_clusters)
        
        return Response({
            'message': 'K-Means clustering training started',
            'task_id': task.id,
            'n_clusters': n_clusters,
            'note': 'Training may take several minutes to complete'
        }, status=status.HTTP_202_ACCEPTED)
        
    except Exception as e:
        logger.error(f"Error triggering clustering training: {str(e)}")
        return Response({'error': 'Internal server error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_scoring_weights(request):
    """
    Get current active scoring weights
    """
    try:
        weights = ScoringWeights.objects.filter(is_active=True).first()
        
        if not weights:
            return Response({'error': 'No active scoring weights found'}, status=status.HTTP_404_NOT_FOUND)
        
        return Response({
            'id': weights.id,
            'name': weights.name,
            'weights': weights.get_weights_dict(),
            'created_at': weights.created_at.isoformat(),
            'updated_at': weights.updated_at.isoformat()
        })
        
    except Exception as e:
        logger.error(f"Error getting scoring weights: {str(e)}")
        return Response({'error': 'Internal server error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_cluster_info(request):
    """
    Get information about active clustering model
    """
    try:
        cluster_model = ClusterCenters.objects.filter(is_active=True).first()
        
        if not cluster_model:
            return Response({'error': 'No active clustering model found'}, status=status.HTTP_404_NOT_FOUND)
        
        return Response({
            'id': cluster_model.id,
            'algorithm_version': cluster_model.algorithm_version,
            'n_clusters': cluster_model.n_clusters,
            'trained_at': cluster_model.trained_at.isoformat(),
            'inertia': cluster_model.inertia,
            'silhouette_score': cluster_model.silhouette_score,
            'n_samples_trained': cluster_model.n_samples_trained,
            'training_metadata': cluster_model.training_metadata
        })
        
    except Exception as e:
        logger.error(f"Error getting cluster info: {str(e)}")
        return Response({'error': 'Internal server error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def webhook_test_submission(request):
    """
    Webhook handler for technical test submissions
    Triggers recommendation recomputation for relevant jobs
    """
    try:
        # Get data from request
        candidate_id = request.data.get('candidate_id')
        test_id = request.data.get('test_id')

        if not candidate_id or not test_id:
            return Response(
                {'error': 'candidate_id and test_id are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Validate candidate exists and user has permission
        if request.user.id != candidate_id and not request.user.is_staff:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)

        try:
            candidate = User.objects.get(id=candidate_id)
        except User.DoesNotExist:
            return Response({'error': 'Candidate not found'}, status=status.HTTP_404_NOT_FOUND)

        # Import here to avoid circular imports
        from .tasks import recompute_recommendations_after_test_submission

        # Enqueue background task
        task = recompute_recommendations_after_test_submission.delay(candidate_id, test_id)

        return Response({
            'message': 'Test submission webhook processed',
            'task_id': task.id,
            'candidate_id': candidate_id,
            'test_id': test_id,
            'note': 'Recommendations will be recomputed for relevant jobs'
        }, status=status.HTTP_202_ACCEPTED)

    except Exception as e:
        logger.error(f"Error processing test submission webhook: {str(e)}")
        return Response({'error': 'Internal server error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_recommendation_stats(request):
    """
    Get statistics about the recommendation system
    """
    try:
        if not request.user.is_staff:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)

        from django.db.models import Count, Avg, Max, Min

        # Basic counts
        total_recommendations = JobRecommendation.objects.count()
        total_candidates = JobRecommendation.objects.values('candidate_id').distinct().count()
        total_jobs = JobRecommendation.objects.values('job_offer').distinct().count()

        # Score statistics
        score_stats = JobRecommendation.objects.aggregate(
            avg_overall_score=Avg('overall_score'),
            max_overall_score=Max('overall_score'),
            min_overall_score=Min('overall_score'),
            avg_technical_score=Avg('technical_test_score'),
            avg_skill_match_score=Avg('skill_match_score')
        )

        # Recent activity
        from django.utils import timezone
        from datetime import timedelta

        recent_cutoff = timezone.now() - timedelta(days=7)
        recent_recommendations = JobRecommendation.objects.filter(
            computed_at__gte=recent_cutoff
        ).count()

        # Algorithm version distribution
        algorithm_versions = JobRecommendation.objects.values('algorithm_version').annotate(
            count=Count('id')
        ).order_by('-count')

        # Active cluster model info
        cluster_model = ClusterCenters.objects.filter(is_active=True).first()
        cluster_info = None
        if cluster_model:
            cluster_info = {
                'id': cluster_model.id,
                'n_clusters': cluster_model.n_clusters,
                'trained_at': cluster_model.trained_at.isoformat(),
                'n_samples_trained': cluster_model.n_samples_trained
            }

        return Response({
            'total_recommendations': total_recommendations,
            'total_candidates': total_candidates,
            'total_jobs': total_jobs,
            'score_statistics': score_stats,
            'recent_recommendations_7d': recent_recommendations,
            'algorithm_versions': list(algorithm_versions),
            'active_cluster_model': cluster_info,
            'generated_at': timezone.now().isoformat()
        })

    except Exception as e:
        logger.error(f"Error getting recommendation stats: {str(e)}")
        return Response({'error': 'Internal server error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_job_offers(request):
    """
    Get all job offers with filtering and pagination
    """
    try:
        # Get query parameters
        search = request.GET.get('search', '')
        location = request.GET.get('location', '')
        industry = request.GET.get('industry', '')
        job_type = request.GET.get('job_type', '')
        seniority = request.GET.get('seniority', '')
        remote = request.GET.get('remote', '').lower() == 'true'
        salary_min = request.GET.get('salary_min', '')
        salary_max = request.GET.get('salary_max', '')
        page = int(request.GET.get('page', 1))
        page_size = int(request.GET.get('page_size', 20))

        # Start with all active job offers
        queryset = JobOffer.objects.filter(status='active').select_related().prefetch_related('required_skills', 'preferred_skills')

        # Apply filters
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) |
                Q(company__icontains=search) |
                Q(description__icontains=search)
            )

        if location:
            queryset = queryset.filter(Q(location__icontains=location) | Q(city__icontains=location))

        if industry:
            queryset = queryset.filter(industry__icontains=industry)

        if job_type:
            queryset = queryset.filter(job_type=job_type)

        if seniority:
            queryset = queryset.filter(seniority=seniority)

        if remote:
            queryset = queryset.filter(remote_flag=True)

        if salary_min:
            try:
                min_salary = int(salary_min)
                queryset = queryset.filter(salary_min__gte=min_salary)
            except ValueError:
                pass

        if salary_max:
            try:
                max_salary = int(salary_max)
                queryset = queryset.filter(salary_max__lte=max_salary)
            except ValueError:
                pass

        # Order by most recent first
        queryset = queryset.order_by('-posted_at')

        # Paginate results
        paginator = Paginator(queryset, page_size)
        page_obj = paginator.get_page(page)

        # Serialize the results
        serializer = JobOfferSerializer(page_obj.object_list, many=True)

        return Response({
            'results': serializer.data,
            'count': paginator.count,
            'num_pages': paginator.num_pages,
            'current_page': page,
            'has_next': page_obj.has_next(),
            'has_previous': page_obj.has_previous(),
            'page_size': page_size
        })

    except Exception as e:
        logger.error(f"Error getting job offers: {str(e)}")
        return Response({'error': 'Internal server error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
