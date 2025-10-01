"""
Advanced Machine Learning-based Job Recommendation System

This module implements:
1. Phase 1: Content-Based Filtering using TF-IDF and Cosine Similarity
2. Phase 2: K-Means Clustering for job categorization and user clustering

Author: JobGate Development Team
"""

import logging
import numpy as np
import pandas as pd
from typing import List, Dict, Tuple, Optional, Any
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
import joblib
import os
from django.conf import settings
from django.db.models import Q
from django.utils import timezone

from .models import JobOffer, JobRecommendation
from skills.models import CandidateProfile
from skills.models import Skill

logger = logging.getLogger(__name__)

class ContentBasedRecommender:
 """
 Phase 1: Content-Based Filtering using TF-IDF and Cosine Similarity

 This class implements content-based filtering by:
 1. Converting job descriptions and user skills into TF-IDF vectors
 2. Computing cosine similarity between user profile and job postings
 3. Returning top N most similar jobs
 """

 def __init__(self, max_features: int = 5000, ngram_range: Tuple[int, int] = (1, 2)):
 """
 Initialize the content-based recommender

 Args:
 max_features: Maximum number of features for TF-IDF vectorizer
 ngram_range: Range of n-grams to consider (unigrams and bigrams)
 """
 self.max_features = max_features
 self.ngram_range = ngram_range
 self.tfidf_vectorizer = TfidfVectorizer(
 max_features=max_features,
 ngram_range=ngram_range,
 stop_words='english', # Can be extended to French
 lowercase=True,
 strip_accents='unicode',
 min_df=2, # Ignore terms that appear in less than 2 documents
 max_df=0.95, # Ignore terms that appear in more than 95% of documents
 )
 self.job_vectors = None
 self.job_ids = None
 self.is_fitted = False

 def _prepare_job_text(self, job: JobOffer) -> str:
 """
 Prepare job text by combining title, description, requirements, and skills

 Args:
 job: JobOffer instance

 Returns:
 Combined text string for TF-IDF processing
 """
 # Get skill names
 required_skills = [skill.name for skill in job.required_skills.all()]
 preferred_skills = [skill.name for skill in job.preferred_skills.all()]
 all_skills = required_skills + preferred_skills

 # Combine all text fields
 text_parts = [
 job.title,
 job.description,
 job.requirements,
 job.responsibilities,
 ' '.join(all_skills),
 job.industry or '',
 job.company,
 ]

 # Join and clean text
 combined_text = ' '.join(filter(None, text_parts))
 return combined_text.strip()

 def _prepare_user_profile_text(self, user_skills: List[Skill],
 user_profile_data: Optional[Dict] = None) -> str:
 """
 Prepare user profile text for TF-IDF processing

 Args:
 user_skills: List of user's skills
 user_profile_data: Additional user profile data

 Returns:
 Combined text string representing user profile
 """
 # Get skill names
 skill_names = [skill.name for skill in user_skills]

 # Add skills with proficiency if available
 if user_profile_data and 'skillsWithProficiency' in user_profile_data:
 proficiency_skills = []
 for skill_data in user_profile_data['skillsWithProficiency']:
 if isinstance(skill_data, dict):
 skill_name = skill_data.get('name', '')
 proficiency = skill_data.get('proficiency', 'intermediate')
 # Repeat skill name based on proficiency level
 proficiency_multiplier = {
 'beginner': 1,
 'intermediate': 2,
 'advanced': 3,
 'expert': 4
 }.get(proficiency, 1)
 proficiency_skills.extend([skill_name] * proficiency_multiplier)
 skill_names.extend(proficiency_skills)

 # Add other profile information
 profile_parts = [skill_names]

 if user_profile_data:
 if user_profile_data.get('bio'):
 profile_parts.append(user_profile_data['bio'])
 if user_profile_data.get('location'):
 profile_parts.append(user_profile_data['location'])
 if user_profile_data.get('industry_preferences'):
 profile_parts.append(' '.join(user_profile_data['industry_preferences']))

 # Join and clean text
 combined_text = ' '.join([' '.join(part) if isinstance(part, list) else part
 for part in profile_parts if part])
 return combined_text.strip()

 def fit(self, jobs: List[JobOffer]) -> None:
 """
 Fit the TF-IDF vectorizer on job data

 Args:
 jobs: List of JobOffer instances to train on
 """
 logger.info(f"Fitting TF-IDF vectorizer on {len(jobs)} jobs")

 # Prepare job texts
 job_texts = [self._prepare_job_text(job) for job in jobs]

 # Fit TF-IDF vectorizer
 self.job_vectors = self.tfidf_vectorizer.fit_transform(job_texts)
 self.job_ids = [job.id for job in jobs]
 self.is_fitted = True

 logger.info(f"TF-IDF vectorizer fitted successfully. Shape: {self.job_vectors.shape}")

 def recommend(self, user_skills: List[Skill],
 user_profile_data: Optional[Dict] = None,
 top_k: int = 5,
 min_similarity: float = 0.1) -> List[Dict[str, Any]]:
 """
 Get content-based job recommendations for a user

 Args:
 user_skills: List of user's skills
 user_profile_data: Additional user profile data
 top_k: Number of top recommendations to return
 min_similarity: Minimum similarity threshold

 Returns:
 List of recommendation dictionaries with job info and similarity scores
 """
 if not self.is_fitted:
 raise ValueError("Recommender must be fitted before making recommendations")

 # Prepare user profile text
 user_text = self._prepare_user_profile_text(user_skills, user_profile_data)

 # Transform user profile to TF-IDF vector
 user_vector = self.tfidf_vectorizer.transform([user_text])

 # Calculate cosine similarities
 similarities = cosine_similarity(user_vector, self.job_vectors).flatten()

 # Get top recommendations
 top_indices = np.argsort(similarities)[::-1]

 recommendations = []
 for idx in top_indices:
 if similarities[idx] < min_similarity:
 break

 job_id = self.job_ids[idx]
 similarity_score = similarities[idx]

 # Get job details
 try:
 job = JobOffer.objects.get(id=job_id)
 recommendations.append({
 'job': job,
 'similarity_score': float(similarity_score),
 'recommendation_type': 'content_based',
 'matched_features': self._get_matched_features(user_text, job)
 })

 if len(recommendations) >= top_k:
 break

 except JobOffer.DoesNotExist:
 logger.warning(f"Job with ID {job_id} not found")
 continue

 logger.info(f"Generated {len(recommendations)} content-based recommendations")
 return recommendations

 def _get_matched_features(self, user_text: str, job: JobOffer) -> List[str]:
 """
 Get the most important features that matched between user and job

 Args:
 user_text: User profile text
 job: JobOffer instance

 Returns:
 List of matched feature names
 """
 # Get feature names from TF-IDF vectorizer
 feature_names = self.tfidf_vectorizer.get_feature_names_out()

 # Transform both user and job texts
 user_vector = self.tfidf_vectorizer.transform([user_text])
 job_text = self._prepare_job_text(job)
 job_vector = self.tfidf_vectorizer.transform([job_text])

 # Find common non-zero features
 user_indices = user_vector.nonzero()[1]
 job_indices = job_vector.nonzero()[1]
 common_indices = np.intersection1d(user_indices, job_indices)

 # Get feature names and their importance
 matched_features = []
 for idx in common_indices:
 feature_name = feature_names[idx]
 user_tfidf = user_vector[0, idx]
 job_tfidf = job_vector[0, idx]
 importance = (user_tfidf + job_tfidf) / 2
 matched_features.append((feature_name, float(importance)))

 # Sort by importance and return top features
 matched_features.sort(key=lambda x: x[1], reverse=True)
 return [feature[0] for feature in matched_features[:10]]

class JobClusterRecommender:
 """
 Phase 2: K-Means Clustering for Job Categorization and User Clustering

 This class implements:
 1. Clustering jobs into categories (Data Science, Web Dev, Design, etc.)
 2. Assigning users to the nearest cluster
 3. Recommending jobs from the user's cluster
 """

 def __init__(self, n_clusters: int = 8, random_state: int = 42):
 """
 Initialize the clustering recommender

 Args:
 n_clusters: Number of clusters for K-Means
 random_state: Random state for reproducibility
 """
 self.n_clusters = n_clusters
 self.random_state = random_state
 self.kmeans = KMeans(n_clusters=n_clusters, random_state=random_state, n_init=10)
 self.scaler = StandardScaler()
 self.pca = PCA(n_components=0.95) # Keep 95% of variance

 self.job_clusters = None
 self.job_features = None
 self.job_ids = None
 self.cluster_centers = None
 self.is_fitted = False

 # Cluster names (can be learned or predefined)
 self.cluster_names = {
 0: "Data Science & Analytics",
 1: "Web Development",
 2: "Mobile Development",
 3: "DevOps & Cloud",
 4: "UI/UX Design",
 5: "Backend Development",
 6: "Testing & QA",
 7: "Project Management"
 }

 def _extract_job_features(self, jobs: List[JobOffer]) -> np.ndarray:
 """
 Extract numerical features from jobs for clustering

 Args:
 jobs: List of JobOffer instances

 Returns:
 Feature matrix (n_jobs, n_features)
 """
 features = []

 for job in jobs:
 # Basic job features
 job_features = [
 len(job.title.split()), # Title length
 len(job.description.split()), # Description length
 len(job.requirements.split()), # Requirements length
 job.salary_min or 0, # Salary min
 job.salary_max or 0, # Salary max
 int(job.remote), # Remote work (binary)
 len(job.required_skills.all()), # Number of required skills
 len(job.preferred_skills.all()), # Number of preferred skills
 ]

 # Seniority level encoding
 seniority_encoding = {
 'junior': 1,
 'mid': 2,
 'senior': 3,
 'lead': 4
 }
 job_features.append(seniority_encoding.get(job.seniority, 2))

 # Job type encoding
 job_type_encoding = {
 'CDI': 1,
 'CDD': 2,
 'Stage': 3,
 'Freelance': 4,
 'Alternance': 5,
 'Temps partiel': 6
 }
 job_features.append(job_type_encoding.get(job.job_type, 1))

 # Skill category features (count skills by category)
 skill_categories = {
 'programming': 0,
 'frontend': 0,
 'backend': 0,
 'database': 0,
 'devops': 0,
 'mobile': 0,
 'testing': 0,
 'other': 0
 }

 for skill in job.required_skills.all():
 category = skill.category
 if category in skill_categories:
 skill_categories[category] += 1

 # Add skill category counts
 job_features.extend(skill_categories.values())

 features.append(job_features)

 return np.array(features)

 def fit(self, jobs: List[JobOffer]) -> None:
 """
 Fit the K-Means clustering on job data

 Args:
 jobs: List of JobOffer instances to cluster
 """
 logger.info(f"Fitting K-Means clustering on {len(jobs)} jobs")

 # Extract features
 self.job_features = self._extract_job_features(jobs)
 self.job_ids = [job.id for job in jobs]

 # Scale features
 scaled_features = self.scaler.fit_transform(self.job_features)

 # Apply PCA for dimensionality reduction
 pca_features = self.pca.fit_transform(scaled_features)

 # Fit K-Means
 self.job_clusters = self.kmeans.fit_predict(pca_features)
 self.cluster_centers = self.kmeans.cluster_centers_
 self.is_fitted = True

 logger.info(f"K-Means clustering fitted successfully. "
 f"Clusters: {self.n_clusters}, "
 f"Features shape: {self.job_features.shape}")

 # Log cluster distribution
 unique, counts = np.unique(self.job_clusters, return_counts=True)
 for cluster_id, count in zip(unique, counts):
 cluster_name = self.cluster_names.get(cluster_id, f"Cluster {cluster_id}")
 logger.info(f"Cluster {cluster_id} ({cluster_name}): {count} jobs")

 def get_user_cluster(self, user_skills: List[Skill],
 user_profile_data: Optional[Dict] = None) -> int:
 """
 Assign user to the nearest cluster

 Args:
 user_skills: List of user's skills
 user_profile_data: Additional user profile data

 Returns:
 Cluster ID that the user belongs to
 """
 if not self.is_fitted:
 raise ValueError("Clustering must be fitted before assigning user clusters")

 # Create a dummy job with user's profile to extract features
 # We'll use the average job features as a template
 avg_features = np.mean(self.job_features, axis=0)

 # Modify features based on user profile
 user_features = avg_features.copy()

 # Adjust based on user skills
 if user_skills:
 # Count user skills by category
 skill_categories = {
 'programming': 0,
 'frontend': 0,
 'backend': 0,
 'database': 0,
 'devops': 0,
 'mobile': 0,
 'testing': 0,
 'other': 0
 }

 for skill in user_skills:
 category = skill.category
 if category in skill_categories:
 skill_categories[category] += 1

 # Update skill category features (indices 8-15 in our feature vector)
 skill_start_idx = 8
 for i, (category, count) in enumerate(skill_categories.items()):
 user_features[skill_start_idx + i] = count

 # Scale and transform features
 scaled_features = self.scaler.transform([user_features])
 pca_features = self.pca.transform(scaled_features)

 # Predict cluster
 user_cluster = self.kmeans.predict(pca_features)[0]

 logger.info(f"User assigned to cluster {user_cluster} "
 f"({self.cluster_names.get(user_cluster, 'Unknown')})")

 return user_cluster

 def recommend_from_cluster(self, user_cluster: int,
 jobs: List[JobOffer],
 top_k: int = 5) -> List[Dict[str, Any]]:
 """
 Get job recommendations from user's cluster

 Args:
 user_cluster: Cluster ID assigned to user
 jobs: List of available jobs
 top_k: Number of recommendations to return

 Returns:
 List of recommendation dictionaries
 """
 if not self.is_fitted:
 raise ValueError("Clustering must be fitted before making recommendations")

 # Get jobs from the same cluster
 cluster_job_ids = [self.job_ids[i] for i, cluster in enumerate(self.job_clusters)
 if cluster == user_cluster]

 # Filter available jobs to only include those in the cluster
 cluster_jobs = [job for job in jobs if job.id in cluster_job_ids]

 # Sort by posting date (most recent first)
 cluster_jobs.sort(key=lambda x: x.posted_at, reverse=True)

 # Return top recommendations
 recommendations = []
 for job in cluster_jobs[:top_k]:
 recommendations.append({
 'job': job,
 'similarity_score': 0.8, # High score for cluster-based recommendations
 'recommendation_type': 'cluster_based',
 'cluster_id': user_cluster,
 'cluster_name': self.cluster_names.get(user_cluster, f"Cluster {user_cluster}")
 })

 logger.info(f"Generated {len(recommendations)} cluster-based recommendations "
 f"from cluster {user_cluster}")

 return recommendations

class HybridRecommender:
 """
 Hybrid Recommendation System combining Content-Based and Clustering approaches

 This class combines both approaches to provide more diverse and accurate recommendations
 """

 def __init__(self, content_weight: float = 0.7, cluster_weight: float = 0.3):
 """
 Initialize hybrid recommender

 Args:
 content_weight: Weight for content-based recommendations
 cluster_weight: Weight for cluster-based recommendations
 """
 self.content_weight = content_weight
 self.cluster_weight = cluster_weight

 self.content_recommender = ContentBasedRecommender()
 self.cluster_recommender = JobClusterRecommender()
 self.is_fitted = False

 def fit(self, jobs: List[JobOffer]) -> None:
 """
 Fit both recommendation systems

 Args:
 jobs: List of JobOffer instances to train on
 """
 logger.info("Fitting hybrid recommendation system")

 # Fit both recommenders
 self.content_recommender.fit(jobs)
 self.cluster_recommender.fit(jobs)

 self.is_fitted = True
 logger.info("Hybrid recommendation system fitted successfully")

 def recommend(self, user_skills: List[Skill],
 user_profile_data: Optional[Dict] = None,
 top_k: int = 5,
 min_similarity: float = 0.1) -> List[Dict[str, Any]]:
 """
 Get hybrid job recommendations

 Args:
 user_skills: List of user's skills
 user_profile_data: Additional user profile data
 top_k: Number of recommendations to return
 min_similarity: Minimum similarity threshold

 Returns:
 List of hybrid recommendation dictionaries
 """
 if not self.is_fitted:
 raise ValueError("Hybrid recommender must be fitted before making recommendations")

 # Get content-based recommendations
 content_recs = self.content_recommender.recommend(
 user_skills, user_profile_data, top_k * 2, min_similarity
 )

 # Get user's cluster
 user_cluster = self.cluster_recommender.get_user_cluster(user_skills, user_profile_data)

 # Get cluster-based recommendations
 all_jobs = JobOffer.objects.filter(status='active')
 cluster_recs = self.cluster_recommender.recommend_from_cluster(
 user_cluster, all_jobs, top_k * 2
 )

 # Combine and score recommendations
 job_scores = {}

 # Add content-based scores
 for rec in content_recs:
 job_id = rec['job'].id
 job_scores[job_id] = {
 'job': rec['job'],
 'content_score': rec['similarity_score'] * self.content_weight,
 'cluster_score': 0,
 'total_score': rec['similarity_score'] * self.content_weight,
 'content_features': rec.get('matched_features', []),
 'recommendation_types': ['content_based']
 }

 # Add cluster-based scores
 for rec in cluster_recs:
 job_id = rec['job'].id
 if job_id in job_scores:
 # Job already has content score, add cluster score
 job_scores[job_id]['cluster_score'] = rec['similarity_score'] * self.cluster_weight
 job_scores[job_id]['total_score'] += rec['similarity_score'] * self.cluster_weight
 job_scores[job_id]['recommendation_types'].append('cluster_based')
 job_scores[job_id]['cluster_info'] = {
 'cluster_id': rec['cluster_id'],
 'cluster_name': rec['cluster_name']
 }
 else:
 # New job from cluster
 job_scores[job_id] = {
 'job': rec['job'],
 'content_score': 0,
 'cluster_score': rec['similarity_score'] * self.cluster_weight,
 'total_score': rec['similarity_score'] * self.cluster_weight,
 'content_features': [],
 'recommendation_types': ['cluster_based'],
 'cluster_info': {
 'cluster_id': rec['cluster_id'],
 'cluster_name': rec['cluster_name']
 }
 }

 # Sort by total score and return top recommendations
 sorted_jobs = sorted(job_scores.values(), key=lambda x: x['total_score'], reverse=True)

 recommendations = []
 for job_data in sorted_jobs[:top_k]:
 recommendations.append({
 'job': job_data['job'],
 'similarity_score': job_data['total_score'],
 'recommendation_type': 'hybrid',
 'content_score': job_data['content_score'],
 'cluster_score': job_data['cluster_score'],
 'recommendation_types': job_data['recommendation_types'],
 'matched_features': job_data['content_features'],
 'cluster_info': job_data.get('cluster_info', {})
 })

 logger.info(f"Generated {len(recommendations)} hybrid recommendations")
 return recommendations

# Utility functions for easy integration
def get_ml_recommendations(candidate: CandidateProfile,
 user_profile_data: Optional[Dict] = None,
 recommendation_type: str = 'hybrid',
 top_k: int = 5) -> List[Dict[str, Any]]:
 """
 Get machine learning-based job recommendations for a candidate

 Args:
 candidate: CandidateProfile instance
 user_profile_data: Additional user profile data
 recommendation_type: Type of recommendation ('content', 'cluster', 'hybrid')
 top_k: Number of recommendations to return

 Returns:
 List of recommendation dictionaries
 """
 # Get active jobs
 active_jobs = JobOffer.objects.filter(status='active')

 if not active_jobs.exists():
 logger.warning("No active jobs found for recommendations")
 return []

 # Get user skills
 user_skills = list(candidate.skills.all())

 # Initialize appropriate recommender
 if recommendation_type == 'content':
 recommender = ContentBasedRecommender()
 elif recommendation_type == 'cluster':
 recommender = JobClusterRecommender()
 else: # hybrid
 recommender = HybridRecommender()

 # Fit and recommend
 recommender.fit(list(active_jobs))
 recommendations = recommender.recommend(user_skills, user_profile_data, top_k)

 return recommendations

def save_recommendations_to_db(candidate: CandidateProfile,
 recommendations: List[Dict[str, Any]]) -> List[JobRecommendation]:
 """
 Save ML recommendations to database

 Args:
 candidate: CandidateProfile instance
 recommendations: List of recommendation dictionaries

 Returns:
 List of created JobRecommendation instances
 """
 created_recommendations = []

 for rec in recommendations:
 job = rec['job']
 similarity_score = rec['similarity_score']

 # Create or update recommendation
 recommendation, created = JobRecommendation.objects.get_or_create(
 candidate=candidate,
 job=job,
 defaults={
 'overall_score': similarity_score * 100, # Convert to percentage
 'skill_match_score': similarity_score * 100,
 'salary_fit_score': 50.0, # Default neutral score
 'location_match_score': 50.0, # Default neutral score
 'seniority_match_score': 50.0, # Default neutral score
 'remote_bonus': 0.0,
 'matched_skills': rec.get('matched_features', []),
 'missing_skills': [],
 'recommendation_reason': f"ML {rec['recommendation_type']} recommendation",
 'status': 'new'
 }
 )

 if created:
 created_recommendations.append(recommendation)
 logger.info(f"Created ML recommendation: {candidate} -> {job} "
 f"(Score: {similarity_score:.3f})")

 return created_recommendations

