"""
Celery tasks for job recommendation system
Handles batch processing and background computation
"""

import logging
from typing import List, Optional
from celery import shared_task
from django.contrib.auth.models import User
from django.db import transaction
from django.utils import timezone
from django.db.models import Q

from .models import JobOffer, JobRecommendation, ScoringWeights, ClusterCenters
from .cognitive_recommendation_service import CognitiveRecommendationService
from .kmeans_clustering_service import KMeansClusteringService

logger = logging.getLogger(__name__)

@shared_task(bind=True, max_retries=3)
def compute_recommendations_for_candidate(self, candidate_id: int, job_offer_ids: Optional[List[int]] = None):
 """
 Compute recommendations for a single candidate
 """
 try:
 logger.info(f"Computing recommendations for candidate {candidate_id}")

 # Validate candidate exists
 try:
 user = User.objects.get(id=candidate_id)
 except User.DoesNotExist:
 logger.error(f"Candidate {candidate_id} not found")
 return {'error': 'Candidate not found'}

 # Get job offers to process
 if job_offer_ids:
 job_offers = JobOffer.objects.filter(id__in=job_offer_ids, status='active')
 else:
 job_offers = JobOffer.objects.filter(status='active')

 if not job_offers.exists():
 logger.warning(f"No active job offers found for candidate {candidate_id}")
 return {'processed': 0, 'message': 'No active job offers'}

 # Initialize recommendation service
 service = CognitiveRecommendationService()

 processed_count = 0
 errors = []

 # Process each job offer
 for job_offer in job_offers:
 try:
 with transaction.atomic():
 recommendation = service.compute_overall_recommendation(candidate_id, job_offer)
 processed_count += 1

 if processed_count % 10 == 0:
 logger.info(f"Processed {processed_count} recommendations for candidate {candidate_id}")

 except Exception as e:
 error_msg = f"Error processing job {job_offer.id}: {str(e)}"
 logger.error(error_msg)
 errors.append(error_msg)

 result = {
 'candidate_id': candidate_id,
 'processed': processed_count,
 'total_jobs': job_offers.count(),
 'errors': errors,
 'completed_at': timezone.now().isoformat()
 }

 logger.info(f"Completed recommendations for candidate {candidate_id}: {processed_count} processed")
 return result

 except Exception as e:
 logger.error(f"Task failed for candidate {candidate_id}: {str(e)}")
 raise self.retry(countdown=60, exc=e)

@shared_task(bind=True, max_retries=3)
def compute_recommendations_for_job(self, job_offer_id: int, candidate_ids: Optional[List[int]] = None):
 """
 Compute recommendations for a single job offer against candidates
 """
 try:
 logger.info(f"Computing recommendations for job {job_offer_id}")

 # Validate job offer exists
 try:
 job_offer = JobOffer.objects.get(id=job_offer_id, status='active')
 except JobOffer.DoesNotExist:
 logger.error(f"Job offer {job_offer_id} not found or inactive")
 return {'error': 'Job offer not found or inactive'}

 # Get candidates to process
 if candidate_ids:
 candidates = User.objects.filter(
 id__in=candidate_ids,
 candidateprofile__isnull=False,
 is_active=True
 )
 else:
 candidates = User.objects.filter(
 candidateprofile__isnull=False,
 is_active=True
 )

 if not candidates.exists():
 logger.warning(f"No active candidates found for job {job_offer_id}")
 return {'processed': 0, 'message': 'No active candidates'}

 # Initialize recommendation service
 service = CognitiveRecommendationService()

 processed_count = 0
 errors = []

 # Process each candidate
 for candidate in candidates:
 try:
 with transaction.atomic():
 recommendation = service.compute_overall_recommendation(candidate.id, job_offer)
 processed_count += 1

 if processed_count % 10 == 0:
 logger.info(f"Processed {processed_count} recommendations for job {job_offer_id}")

 except Exception as e:
 error_msg = f"Error processing candidate {candidate.id}: {str(e)}"
 logger.error(error_msg)
 errors.append(error_msg)

 result = {
 'job_offer_id': job_offer_id,
 'processed': processed_count,
 'total_candidates': candidates.count(),
 'errors': errors,
 'completed_at': timezone.now().isoformat()
 }

 logger.info(f"Completed recommendations for job {job_offer_id}: {processed_count} processed")
 return result

 except Exception as e:
 logger.error(f"Task failed for job {job_offer_id}: {str(e)}")
 raise self.retry(countdown=60, exc=e)

@shared_task(bind=True, max_retries=2)
def batch_recompute_all_recommendations(self):
 """
 Recompute all recommendations for all active candidates and jobs
 """
 try:
 logger.info("Starting batch recomputation of all recommendations")

 # Get all active candidates and jobs
 candidates = User.objects.filter(
 candidateprofile__isnull=False,
 is_active=True
 )
 job_offers = JobOffer.objects.filter(status='active')

 total_combinations = candidates.count() * job_offers.count()
 logger.info(f"Processing {total_combinations} candidate-job combinations")

 if total_combinations == 0:
 return {'message': 'No active candidates or jobs found'}

 # Initialize recommendation service
 service = CognitiveRecommendationService()

 processed_count = 0
 errors = []

 # Process all combinations
 for candidate in candidates:
 for job_offer in job_offers:
 try:
 with transaction.atomic():
 recommendation = service.compute_overall_recommendation(candidate.id, job_offer)
 processed_count += 1

 if processed_count % 100 == 0:
 logger.info(f"Batch progress: {processed_count}/{total_combinations} ({processed_count/total_combinations*100:.1f}%)")

 except Exception as e:
 error_msg = f"Error processing candidate {candidate.id} - job {job_offer.id}: {str(e)}"
 logger.error(error_msg)
 errors.append(error_msg)

 result = {
 'total_combinations': total_combinations,
 'processed': processed_count,
 'errors': len(errors),
 'error_details': errors[:10], # First 10 errors only
 'completed_at': timezone.now().isoformat()
 }

 logger.info(f"Batch recomputation completed: {processed_count}/{total_combinations} processed")
 return result

 except Exception as e:
 logger.error(f"Batch recomputation task failed: {str(e)}")
 raise self.retry(countdown=300, exc=e) # 5 minute delay

@shared_task(bind=True, max_retries=2)
def train_kmeans_clusters(self, n_clusters: int = 8):
 """
 Train new K-Means clustering model
 """
 try:
 logger.info(f"Training K-Means clustering model with {n_clusters} clusters")

 service = KMeansClusteringService()
 cluster_model = service.train_kmeans_model(n_clusters=n_clusters)

 if cluster_model:
 result = {
 'model_id': cluster_model.id,
 'n_clusters': cluster_model.n_clusters,
 'inertia': cluster_model.inertia,
 'silhouette_score': cluster_model.silhouette_score,
 'n_samples_trained': cluster_model.n_samples_trained,
 'trained_at': cluster_model.trained_at.isoformat()
 }
 logger.info(f"K-Means model trained successfully: {result}")
 return result
 else:
 logger.warning("K-Means training failed - insufficient data")
 return {'error': 'Insufficient data for clustering'}

 except Exception as e:
 logger.error(f"K-Means training task failed: {str(e)}")
 raise self.retry(countdown=300, exc=e)

@shared_task(bind=True, max_retries=3)
def recompute_recommendations_after_test_submission(self, candidate_id: int, test_id: int):
 """
 Recompute recommendations for a candidate after they submit a technical test
 """
 try:
 logger.info(f"Recomputing recommendations for candidate {candidate_id} after test {test_id} submission")

 # Validate candidate exists
 try:
 user = User.objects.get(id=candidate_id)
 except User.DoesNotExist:
 logger.error(f"Candidate {candidate_id} not found")
 return {'error': 'Candidate not found'}

 # Find job offers that use this technical test
 from .models import SkillTechnicalTestMapping
 from skills.models import TechnicalTest

 try:
 technical_test = TechnicalTest.objects.get(id=test_id)
 except TechnicalTest.DoesNotExist:
 logger.error(f"Technical test {test_id} not found")
 return {'error': 'Technical test not found'}

 # Get skill mappings for this test
 skill_mappings = SkillTechnicalTestMapping.objects.filter(technical_test=technical_test)
 skill_ids = [mapping.skill.id for mapping in skill_mappings]

 # Find job offers that require or prefer these skills
 relevant_jobs = JobOffer.objects.filter(
 status='active'
 ).filter(
 Q(required_skills__id__in=skill_ids) | Q(preferred_skills__id__in=skill_ids)
 ).distinct()

 if not relevant_jobs.exists():
 logger.info(f"No relevant job offers found for test {test_id}")
 return {'processed': 0, 'message': 'No relevant job offers'}

 # Initialize recommendation service
 service = CognitiveRecommendationService()

 processed_count = 0
 errors = []

 # Recompute recommendations for relevant jobs
 for job_offer in relevant_jobs:
 try:
 with transaction.atomic():
 recommendation = service.compute_overall_recommendation(candidate_id, job_offer)
 processed_count += 1

 except Exception as e:
 error_msg = f"Error processing job {job_offer.id}: {str(e)}"
 logger.error(error_msg)
 errors.append(error_msg)

 result = {
 'candidate_id': candidate_id,
 'test_id': test_id,
 'processed': processed_count,
 'relevant_jobs': relevant_jobs.count(),
 'errors': errors,
 'completed_at': timezone.now().isoformat()
 }

 logger.info(f"Recomputed {processed_count} recommendations for candidate {candidate_id} after test submission")
 return result

 except Exception as e:
 logger.error(f"Task failed for candidate {candidate_id} test {test_id}: {str(e)}")
 raise self.retry(countdown=60, exc=e)

@shared_task
def periodic_cluster_retraining():
 """
 Periodic task to retrain clustering model (run weekly)
 """
 logger.info("Starting periodic cluster retraining")

 # Check if we have enough new data to warrant retraining
 from django.utils import timezone
 from datetime import timedelta

 # Get latest cluster model
 latest_model = ClusterCenters.objects.filter(is_active=True).first()

 if latest_model:
 days_since_training = (timezone.now() - latest_model.trained_at).days
 if days_since_training < 7:
 logger.info(f"Cluster model is only {days_since_training} days old, skipping retraining")
 return {'message': 'Model too recent, skipping retraining'}

 # Trigger retraining
 return train_kmeans_clusters.delay(n_clusters=8)
