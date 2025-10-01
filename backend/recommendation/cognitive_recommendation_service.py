"""
Cognitive Job Recommendation Service with Technical Tests and K-Means Clustering
Implements the exact algorithm specified in the requirements
"""

import logging
import numpy as np
from typing import Dict, List, Tuple, Optional
from django.contrib.auth.models import User
from django.db.models import Q, Avg
from django.utils import timezone
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import silhouette_score

from .models import (
 JobOffer, JobRecommendation, ScoringWeights, SkillTechnicalTestMapping,
 ClusterCenters, RecommendationAudit
)
from skills.models import TestResult, CandidateProfile, Skill
from testsengine.employability_scoring import EmployabilityScorer

logger = logging.getLogger(__name__)

class CognitiveRecommendationService:
 """
 Enhanced recommendation service with cognitive skills, technical tests, and K-Means clustering
 """

 def __init__(self, algorithm_version="cognitive_kmeans_v1"):
 self.algorithm_version = algorithm_version
 self.weights = self._get_active_weights()

 def _get_active_weights(self) -> ScoringWeights:
 """Get active scoring weights"""
 weights = ScoringWeights.objects.filter(is_active=True).first()
 if not weights:
 # Create default weights if none exist
 weights = ScoringWeights.objects.create(
 name="default",
 is_active=True,
 skill_match_weight=0.30,
 technical_test_weight=0.25,
 experience_weight=0.15,
 salary_weight=0.10,
 location_weight=0.10,
 cluster_fit_weight=0.10,
 employability_weight=0.05,
 test_pass_threshold=70.0
 )
 logger.info("Created default scoring weights")
 return weights

 def compute_technical_test_score(self, candidate_id: int, job_offer: JobOffer) -> Tuple[float, Dict]:
 """
 Compute technical test score exactly as specified in requirements
 Returns: (technical_test_score, breakdown_dict)
 """
 try:
 user = User.objects.get(id=candidate_id)
 candidate_profile = CandidateProfile.objects.get(user=user)
 except (User.DoesNotExist, CandidateProfile.DoesNotExist):
 return 0.0, {
 'test_ids_and_scores': {},
 'passed_ratio': 0.0,
 'total_relevant_tests': 0,
 'tests_taken': 0,
 'error': 'Candidate not found'
 }

 # Get relevant tests for this job
 relevant_tests = job_offer.get_relevant_technical_tests()

 if not relevant_tests:
 return 0.0, {
 'test_ids_and_scores': {},
 'passed_ratio': 0.0,
 'total_relevant_tests': 0,
 'tests_taken': 0,
 'note': 'No relevant technical tests found'
 }

 test_scores = {}
 total_weighted_score = 0.0
 total_weights = 0.0
 tests_passed = 0
 tests_taken = 0

 for technical_test, weight, is_required in relevant_tests:
 # Get latest completed test result for this candidate
 test_result = TestResult.objects.filter(
 candidate=candidate_profile,
 test=technical_test,
 status='completed'
 ).order_by('-completed_at').first()

 if test_result:
 # Normalize score to 0-1
 normalized_score = test_result.score / 100.0
 tests_taken += 1

 # Check if passed
 if test_result.score >= self.weights.test_pass_threshold:
 tests_passed += 1

 test_scores[technical_test.id] = {
 'score': test_result.score,
 'normalized_score': normalized_score,
 'weight': weight,
 'is_required': is_required,
 'passed': test_result.score >= self.weights.test_pass_threshold
 }

 total_weighted_score += weight * normalized_score
 total_weights += weight
 else:
 # No result = score 0 (as specified in requirements)
 test_scores[technical_test.id] = {
 'score': 0,
 'normalized_score': 0.0,
 'weight': weight,
 'is_required': is_required,
 'passed': False
 }
 total_weights += weight

 # Calculate final technical test score
 if total_weights > 0:
 technical_test_score = total_weighted_score / total_weights
 else:
 technical_test_score = 0.0

 # Calculate passed ratio
 passed_ratio = tests_passed / len(relevant_tests) if relevant_tests else 0.0

 breakdown = {
 'test_ids_and_scores': test_scores,
 'passed_ratio': passed_ratio,
 'total_relevant_tests': len(relevant_tests),
 'tests_taken': tests_taken,
 'tests_passed': tests_passed,
 'total_weighted_score': total_weighted_score,
 'total_weights': total_weights
 }

 return technical_test_score, breakdown

 def compute_skill_match_score(self, candidate_id: int, job_offer: JobOffer) -> Tuple[float, Dict]:
 """
 Compute skill matching score
 Returns: (skill_match_score, breakdown_dict)
 """
 try:
 user = User.objects.get(id=candidate_id)
 candidate_profile = CandidateProfile.objects.get(user=user)
 candidate_skills = set(candidate_profile.skills.all())
 except (User.DoesNotExist, CandidateProfile.DoesNotExist):
 return 0.0, {'error': 'Candidate not found'}

 required_skills = set(job_offer.required_skills.all())
 preferred_skills = set(job_offer.preferred_skills.all())

 # Calculate matches
 required_matched = candidate_skills.intersection(required_skills)
 preferred_matched = candidate_skills.intersection(preferred_skills)

 # Calculate scores
 required_score = len(required_matched) / len(required_skills) if required_skills else 1.0
 preferred_score = len(preferred_matched) / len(preferred_skills) if preferred_skills else 1.0

 # Weighted combination
 weights = self.weights.get_weights_dict()
 skill_match_score = (
 weights['required_skill_weight'] * required_score +
 weights['preferred_skill_weight'] * preferred_score
 ) / (weights['required_skill_weight'] + weights['preferred_skill_weight'])

 breakdown = {
 'matched_skills': [skill.name for skill in required_matched.union(preferred_matched)],
 'missing_skills': [skill.name for skill in required_skills.union(preferred_skills) - candidate_skills],
 'required_matched': [skill.name for skill in required_matched],
 'preferred_matched': [skill.name for skill in preferred_matched],
 'required_missing': [skill.name for skill in required_skills - candidate_skills],
 'preferred_missing': [skill.name for skill in preferred_skills - candidate_skills],
 'required_score': required_score,
 'preferred_score': preferred_score,
 'total_required': len(required_skills),
 'total_preferred': len(preferred_skills),
 'total_matched': len(required_matched) + len(preferred_matched)
 }

 return skill_match_score, breakdown

 def compute_experience_score(self, candidate_id: int, job_offer: JobOffer) -> float:
 """
 Compute experience level match score
 Simple implementation - can be enhanced based on candidate profile
 """
 try:
 user = User.objects.get(id=candidate_id)
 candidate_profile = CandidateProfile.objects.get(user=user)

 # Simple heuristic based on skills count and test results
 skills_count = candidate_profile.skills.count()
 test_results_count = TestResult.objects.filter(
 candidate=candidate_profile,
 status='completed'
 ).count()

 # Normalize to 0-1 based on activity level
 experience_score = min(1.0, (skills_count * 0.1 + test_results_count * 0.05))

 return experience_score

 except (User.DoesNotExist, CandidateProfile.DoesNotExist):
 return 0.0

 def compute_salary_score(self, candidate_id: int, job_offer: JobOffer) -> float:
 """
 Compute salary fit score
 Simple implementation - assumes candidate prefers higher salaries
 """
 if not job_offer.salary_min or not job_offer.salary_max:
 return 0.5 # Neutral score if no salary info

 # Simple scoring: higher salaries get higher scores
 # Normalize based on typical salary ranges in Morocco
 avg_salary = (job_offer.salary_min + job_offer.salary_max) / 2

 # Rough normalization (adjust based on market data)
 if avg_salary >= 25000: # High salary
 return 1.0
 elif avg_salary >= 15000: # Medium salary
 return 0.7
 elif avg_salary >= 8000: # Entry level
 return 0.5
 else:
 return 0.3

 def compute_location_score(self, candidate_id: int, job_offer: JobOffer) -> float:
 """
 Compute location match score
 Simple implementation - can be enhanced with candidate preferences
 """
 # For now, give higher scores to major cities and remote jobs
 if job_offer.remote_flag:
 return 1.0

 major_cities = ['Casablanca', 'Rabat', 'Marrakech', 'Tangier', 'Fes']
 if any(city.lower() in job_offer.location.lower() for city in major_cities):
 return 0.8

 return 0.6 # Default for other locations

 def compute_cluster_fit_score(self, candidate_id: int, job_offer: JobOffer) -> float:
 """
 Compute K-Means cluster fit score
 Returns distance-based score from candidate to job's cluster
 """
 try:
 # Get active cluster model
 cluster_model = ClusterCenters.objects.filter(is_active=True).first()
 if not cluster_model:
 return 0.5 # Neutral score if no cluster model

 # Get candidate and job features (simplified for now)
 candidate_features = self._get_candidate_features(candidate_id)
 job_features = self._get_job_features(job_offer)

 if candidate_features is None or job_features is None:
 return 0.5

 # Find closest cluster for job
 centers = np.array(cluster_model.centers)
 job_distances = np.linalg.norm(centers - job_features, axis=1)
 job_cluster = np.argmin(job_distances)

 # Calculate candidate distance to job's cluster
 candidate_distance = np.linalg.norm(centers[job_cluster] - candidate_features)

 # Convert distance to score (closer = higher score)
 # Normalize based on typical distances
 max_distance = np.max(np.linalg.norm(centers, axis=1))
 cluster_fit_score = max(0.0, 1.0 - (candidate_distance / max_distance))

 return cluster_fit_score

 except Exception as e:
 logger.warning(f"Error computing cluster fit score: {e}")
 return 0.5

 def _get_candidate_features(self, candidate_id: int) -> Optional[np.ndarray]:
 """
 Extract feature vector for candidate
 Features: skills (binary), avg test scores, experience proxy
 """
 try:
 user = User.objects.get(id=candidate_id)
 candidate_profile = CandidateProfile.objects.get(user=user)

 # Get all skills as binary features
 all_skills = Skill.objects.all().order_by('id')
 candidate_skills = set(candidate_profile.skills.values_list('id', flat=True))
 skill_features = [1.0 if skill.id in candidate_skills else 0.0 for skill in all_skills]

 # Average test score
 avg_test_score = TestResult.objects.filter(
 candidate=candidate_profile,
 status='completed'
 ).aggregate(avg_score=Avg('score'))['avg_score'] or 0.0
 avg_test_score = avg_test_score / 100.0 # Normalize to 0-1

 # Experience proxy (skills count normalized)
 experience_proxy = min(1.0, candidate_profile.skills.count() / 20.0)

 # Employability score
 try:
 scorer = EmployabilityScorer()
 employability_data = scorer.calculate_overall_score(user)
 employability_score = employability_data.get('overall_readiness', 0) / 100.0
 except:
 employability_score = 0.0

 features = skill_features + [avg_test_score, experience_proxy, employability_score]
 return np.array(features)

 except Exception as e:
 logger.warning(f"Error getting candidate features for {candidate_id}: {e}")
 return None

 def _get_job_features(self, job_offer: JobOffer) -> Optional[np.ndarray]:
 """
 Extract feature vector for job offer
 Features: required/preferred skills (binary), salary level, seniority
 """
 try:
 # Get all skills as binary features
 all_skills = Skill.objects.all().order_by('id')
 required_skills = set(job_offer.required_skills.values_list('id', flat=True))
 preferred_skills = set(job_offer.preferred_skills.values_list('id', flat=True))

 skill_features = []
 for skill in all_skills:
 if skill.id in required_skills:
 skill_features.append(1.0)
 elif skill.id in preferred_skills:
 skill_features.append(0.5)
 else:
 skill_features.append(0.0)

 # Salary level (normalized)
 if job_offer.salary_min and job_offer.salary_max:
 avg_salary = (job_offer.salary_min + job_offer.salary_max) / 2
 salary_level = min(1.0, avg_salary / 50000.0) # Normalize to typical max
 else:
 salary_level = 0.5

 # Seniority level
 seniority_map = {
 'junior': 0.2,
 'intermediate': 0.4,
 'senior': 0.6,
 'lead': 0.8,
 'principal': 1.0,
 'expert': 1.0
 }
 seniority_level = seniority_map.get(job_offer.seniority, 0.5)

 # Remote flag
 remote_flag = 1.0 if job_offer.remote_flag else 0.0

 features = skill_features + [salary_level, seniority_level, remote_flag]
 return np.array(features)

 except Exception as e:
 logger.warning(f"Error getting job features for {job_offer.id}: {e}")
 return None

 def compute_overall_recommendation(self, candidate_id: int, job_offer: JobOffer) -> JobRecommendation:
 """
 Compute overall recommendation score and create/update JobRecommendation record
 """
 # Compute individual scores
 technical_test_score, tech_breakdown = self.compute_technical_test_score(candidate_id, job_offer)
 skill_match_score, skill_breakdown = self.compute_skill_match_score(candidate_id, job_offer)
 experience_score = self.compute_experience_score(candidate_id, job_offer)
 salary_score = self.compute_salary_score(candidate_id, job_offer)
 location_score = self.compute_location_score(candidate_id, job_offer)
 cluster_fit_score = self.compute_cluster_fit_score(candidate_id, job_offer)

 # Get employability score
 try:
 user = User.objects.get(id=candidate_id)
 scorer = EmployabilityScorer()
 employability_data = scorer.calculate_overall_score(user)
 employability_score = employability_data.get('overall_readiness', 0) / 100.0
 except:
 employability_score = 0.0

 # Compute weighted overall score
 weights = self.weights.get_weights_dict()
 overall_score = (
 weights['skill_match'] * skill_match_score +
 weights['technical_test'] * technical_test_score +
 weights['experience'] * experience_score +
 weights['salary'] * salary_score +
 weights['location'] * location_score +
 weights['cluster_fit'] * cluster_fit_score +
 weights['employability'] * employability_score
 )

 # Create detailed breakdown
 breakdown = {
 'technical_test': tech_breakdown,
 'skill_match': skill_breakdown,
 'scores': {
 'technical_test_score': technical_test_score,
 'skill_match_score': skill_match_score,
 'experience_score': experience_score,
 'salary_score': salary_score,
 'location_score': location_score,
 'cluster_fit_score': cluster_fit_score,
 'employability_score': employability_score,
 'overall_score': overall_score
 },
 'weights_used': weights,
 'computed_at': timezone.now().isoformat()
 }

 # Create or update recommendation
 recommendation, created = JobRecommendation.objects.update_or_create(
 candidate_id=candidate_id,
 job_offer=job_offer,
 defaults={
 'overall_score': overall_score,
 'technical_test_score': technical_test_score,
 'skill_match_score': skill_match_score,
 'experience_score': experience_score,
 'salary_score': salary_score,
 'location_score': location_score,
 'cluster_fit_score': cluster_fit_score,
 'breakdown': breakdown,
 'algorithm_version': self.algorithm_version,
 'weights_snapshot_id': self.weights.id,
 'computed_at': timezone.now()
 }
 )

 # Create audit trail if score changed significantly
 if not created:
 old_score = JobRecommendation.objects.get(id=recommendation.id).overall_score
 if abs(old_score - overall_score) > 0.05: # 5% threshold
 RecommendationAudit.objects.create(
 recommendation=recommendation,
 candidate_id=candidate_id,
 job_offer=job_offer,
 old_overall_score=old_score,
 new_overall_score=overall_score,
 reason="score_recomputation",
 algorithm_version=self.algorithm_version,
 weights_snapshot_id=self.weights.id
 )

 return recommendation
