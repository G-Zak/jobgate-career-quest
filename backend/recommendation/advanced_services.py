"""
Advanced Job Recommendation Services
Implements Content-Based Filtering and K-Means Clustering as described in the documentation
"""
import math
import logging
import numpy as np
from typing import List, Dict, Tuple, Optional
from django.db.models import Q, F
from django.db import transaction
from django.utils import timezone
from datetime import timedelta
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import KMeans
from sklearn.metrics.pairwise import cosine_similarity
import json

logger = logging.getLogger(__name__)

from .models import JobOffer, JobRecommendation, UserJobPreference, CandidateProfile
from skills.models import Skill, TestResult


class AdvancedRecommendationEngine:
    """
    Advanced recommendation engine implementing:
    1. Content-Based Filtering (Phase 1)
    2. K-Means Clustering (Phase 2)
    """
    
    def __init__(self):
        self.vectorizer = TfidfVectorizer(
            max_features=1000,
            stop_words='english',
            ngram_range=(1, 2)
        )
        self.kmeans = None
        self.job_vectors = None
        self.job_clusters = None
        self.cluster_centers = None
        self.is_trained = False
        
        # Skill weights for different categories
        self.skill_weights = {
            'programming': 1.0,
            'frontend': 0.9,
            'backend': 0.9,
            'database': 0.8,
            'devops': 0.8,
            'mobile': 0.7,
            'testing': 0.6,
            'other': 0.5
        }
    
    def prepare_job_data(self) -> Tuple[List[str], List[Dict]]:
        """
        Step 1: Collect job data and prepare for vectorization
        """
        jobs = JobOffer.objects.filter(status='active')
        job_descriptions = []
        job_metadata = []
        
        for job in jobs:
            # Create comprehensive job description
            skills_text = ' '.join([skill.name for skill in job.required_skills.all()])
            preferred_skills_text = ' '.join([skill.name for skill in job.preferred_skills.all()])
            tags_text = ' '.join(job.tags) if job.tags else ''
            
            full_description = f"{job.title} {job.description} {job.requirements} {skills_text} {preferred_skills_text} {tags_text}"
            
            job_descriptions.append(full_description)
            job_metadata.append({
                'id': job.id,
                'title': job.title,
                'company': job.company,
                'location': job.location,
                'job_type': job.job_type,
                'seniority': job.seniority,
                'salary_min': job.salary_min,
                'salary_max': job.salary_max,
                'remote': job.remote,
                'required_skills': [skill.name for skill in job.required_skills.all()],
                'preferred_skills': [skill.name for skill in job.preferred_skills.all()],
                'tags': job.tags or []
            })
        
        return job_descriptions, job_metadata
    
    def train_kmeans_model(self, n_clusters: int = 5):
        """
        Step 2: Train K-Means clustering model
        """
        try:
            job_descriptions, job_metadata = self.prepare_job_data()
            
            if len(job_descriptions) < n_clusters:
                logger.warning(f"Not enough jobs ({len(job_descriptions)}) for {n_clusters} clusters")
                n_clusters = max(2, len(job_descriptions) // 2)
            
            # Vectorize job descriptions using TF-IDF
            self.job_vectors = self.vectorizer.fit_transform(job_descriptions)
            
            # Apply K-Means clustering
            self.kmeans = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
            self.job_clusters = self.kmeans.fit_predict(self.job_vectors)
            self.cluster_centers = self.kmeans.cluster_centers_
            self.job_metadata = job_metadata
            self.is_trained = True
            
            logger.info(f"K-Means model trained with {n_clusters} clusters on {len(job_descriptions)} jobs")
            
            # Log cluster information
            for i in range(n_clusters):
                cluster_jobs = [job_metadata[j] for j, cluster in enumerate(self.job_clusters) if cluster == i]
                cluster_skills = set()
                for job in cluster_jobs:
                    cluster_skills.update(job['required_skills'])
                    cluster_skills.update(job['preferred_skills'])
                
                logger.info(f"Cluster {i}: {len(cluster_jobs)} jobs, skills: {list(cluster_skills)[:10]}")
            
        except Exception as e:
            logger.error(f"Error training K-Means model: {str(e)}")
            self.is_trained = False
    
    def get_user_profile_vector(self, user_skills: List[str], user_profile_data: Optional[Dict] = None) -> np.ndarray:
        """
        Convert user profile to vector for similarity calculation
        """
        # Create user profile text
        profile_text = ' '.join(user_skills)
        
        if user_profile_data:
            if 'experience' in user_profile_data:
                exp_text = ' '.join([exp.get('description', '') for exp in user_profile_data['experience']])
                profile_text += f" {exp_text}"
            
            if 'education' in user_profile_data:
                edu_text = ' '.join([edu.get('description', '') for edu in user_profile_data['education']])
                profile_text += f" {edu_text}"
        
        # Vectorize user profile
        if self.is_trained and self.vectorizer:
            user_vector = self.vectorizer.transform([profile_text])
            return user_vector
        else:
            # Fallback: create simple skill-based vector
            return self._create_simple_skill_vector(user_skills)
    
    def _create_simple_skill_vector(self, user_skills: List[str]) -> np.ndarray:
        """
        Create a simple skill-based vector when TF-IDF is not available
        """
        # This is a simplified version for when clustering is not trained
        return np.array([[1.0] * len(user_skills)])
    
    def calculate_cosine_similarity(self, user_vector: np.ndarray, job_vector: np.ndarray) -> float:
        """
        Calculate cosine similarity between user and job vectors
        """
        try:
            similarity = cosine_similarity(user_vector, job_vector)[0][0]
            return float(similarity)
        except Exception as e:
            logger.error(f"Error calculating cosine similarity: {str(e)}")
            return 0.0
    
    def assign_user_to_cluster(self, user_vector: np.ndarray) -> int:
        """
        Assign user to the nearest cluster
        """
        if not self.is_trained or self.cluster_centers is None:
            return 0  # Default to first cluster
        
        try:
            # Calculate distances to all cluster centers
            distances = []
            for center in self.cluster_centers:
                # Reshape for cosine similarity calculation
                center_reshaped = center.reshape(1, -1)
                user_reshaped = user_vector.reshape(1, -1)
                
                # Ensure same dimensions
                min_dim = min(center_reshaped.shape[1], user_reshaped.shape[1])
                center_reshaped = center_reshaped[:, :min_dim]
                user_reshaped = user_reshaped[:, :min_dim]
                
                distance = 1 - cosine_similarity(user_reshaped, center_reshaped)[0][0]
                distances.append(distance)
            
            # Return cluster with minimum distance
            return int(np.argmin(distances))
        except Exception as e:
            logger.error(f"Error assigning user to cluster: {str(e)}")
            return 0
    
    def calculate_skill_similarity(self, user_skills: List[str], job_skills: List[str]) -> Tuple[float, List[str], List[str]]:
        """
        Calculate skill similarity between user and job requirements
        """
        if not job_skills:
            return 0.0, [], []
        
        user_skill_names = {skill.lower() for skill in user_skills}
        job_skill_names = {skill.lower() for skill in job_skills}
        
        # Find matches and missing skills
        matched_skills = list(user_skill_names.intersection(job_skill_names))
        missing_skills = list(job_skill_names - user_skill_names)
        
        # Calculate similarity score
        if not job_skill_names:
            return 0.0, [], []
        
        similarity_score = len(matched_skills) / len(job_skill_names)
        return similarity_score, matched_skills, missing_skills
    
    def calculate_job_score(self, user_skills: List[str], job_metadata: Dict, user_location: str = "", user_profile_data: Optional[Dict] = None) -> Dict:
        """
        Calculate comprehensive job score using multiple factors
        """
        # 1. Content-based similarity (TF-IDF + Cosine Similarity)
        user_vector = self.get_user_profile_vector(user_skills, user_profile_data)
        
        # Find job vector (simplified for this example)
        content_score = 0.5  # Default content score
        
        if self.is_trained and self.job_vectors is not None:
            # Find the job in our trained data
            job_idx = None
            for i, job in enumerate(self.job_metadata):
                if job['id'] == job_metadata['id']:
                    job_idx = i
                    break
            
            if job_idx is not None:
                job_vector = self.job_vectors[job_idx:job_idx+1]
                content_score = self.calculate_cosine_similarity(user_vector, job_vector)
        
        # 2. Skill-based similarity (separate required and preferred)
        required_skills = job_metadata['required_skills']
        preferred_skills = job_metadata['preferred_skills']
        all_job_skills = required_skills + preferred_skills
        
        # Calculate required skills match
        required_skill_score, required_matched, required_missing = self.calculate_skill_similarity(user_skills, required_skills)
        
        # Calculate preferred skills match
        preferred_skill_score, preferred_matched, preferred_missing = self.calculate_skill_similarity(user_skills, preferred_skills)
        
        # Overall skill score (weighted: 80% required, 20% preferred)
        skill_score = (required_skill_score * 0.8) + (preferred_skill_score * 0.2)
        
        # Combine all matched skills for display
        all_matched_skills = required_matched + preferred_matched
        all_missing_skills = required_missing + preferred_missing
        
        # 3. Location bonus (enhanced)
        location_bonus = 0.0
        if user_location and job_metadata['location']:
            user_city = user_location.lower().strip()
            job_location = job_metadata['location'].lower().strip()
            
            # Exact city match
            if user_city in job_location:
                location_bonus = 0.15
            # Same country match (if location contains country info)
            elif any(country in job_location for country in ['morocco', 'maroc', 'ma']):
                location_bonus = 0.05
        
        # 4. Remote work bonus
        remote_bonus = 0.05 if job_metadata.get('remote', False) else 0.0
        
        # 5. Experience level matching
        experience_bonus = 0.0
        if user_profile_data and 'experienceLevel' in user_profile_data:
            user_experience = user_profile_data['experienceLevel'].lower()
            job_seniority = job_metadata.get('seniority', '').lower()
            
            # Experience level mapping
            experience_levels = {
                'junior': 0,
                'entry': 0,
                '0-1 an': 0,
                '1-3 ans': 1,
                'intermediate': 2,
                '3-5 ans': 2,
                'senior': 3,
                '5+ ans': 3,
                'lead': 4,
                'principal': 4,
                'expert': 5
            }
            
            user_level = experience_levels.get(user_experience, 1)
            job_level = experience_levels.get(job_seniority, 1)
            
            # Perfect match
            if user_level == job_level:
                experience_bonus = 0.1
            # Close match (within 1 level)
            elif abs(user_level - job_level) <= 1:
                experience_bonus = 0.05
            # User overqualified (can still apply but lower bonus)
            elif user_level > job_level:
                experience_bonus = 0.02
        
        # 6. Salary fit (simplified)
        salary_fit = 0.5  # Default salary fit
        if user_profile_data and 'preferences' in user_profile_data:
            target_salary = user_profile_data['preferences'].get('target_salary_min', 0)
            if target_salary and job_metadata.get('salary_min'):
                if job_metadata['salary_min'] >= target_salary * 0.8:  # Within 20% of target
                    salary_fit = 0.8
                elif job_metadata['salary_min'] >= target_salary * 0.6:  # Within 40% of target
                    salary_fit = 0.6
        
        # Combine scores with weights - Focus on skill matching
        overall_score = (
            skill_score * 0.8 +        # 80% skill match (primary factor)
            content_score * 0.15 +     # 15% content similarity
            location_bonus +           # 3% location bonus (filter)
            experience_bonus +         # 2% experience match (filter)
            remote_bonus +             # 0% remote bonus (removed)
            salary_fit * 0.0           # 0% salary fit (removed)
        ) * 100  # Convert to percentage
        
        return {
            'overall_score': min(100, max(0, overall_score)),
            'content_score': content_score * 100,
            'skill_score': skill_score * 100,
            'required_skill_score': required_skill_score * 100,
            'preferred_skill_score': preferred_skill_score * 100,
            'location_bonus': location_bonus * 100,
            'experience_bonus': experience_bonus * 100,
            'remote_bonus': remote_bonus * 100,
            'salary_fit': salary_fit * 100,
            'matched_skills': all_matched_skills,  # All matched skills (required + preferred)
            'missing_skills': all_missing_skills,  # All missing skills
            'required_matched_skills': required_matched,
            'preferred_matched_skills': preferred_matched,
            'required_missing_skills': required_missing,
            'preferred_missing_skills': preferred_missing,
            'required_skills_count': len(required_skills),
            'preferred_skills_count': len(preferred_skills),
            'required_matched_count': len(required_matched),
            'preferred_matched_count': len(preferred_matched)
        }
    
    def generate_recommendations(self, user_skills: List[str], user_location: str = "", user_profile_data: Optional[Dict] = None, limit: int = 10) -> List[Dict]:
        """
        Generate job recommendations using the advanced algorithm
        """
        try:
            # Train model if not already trained
            if not self.is_trained:
                self.train_kmeans_model()
            
            # Get job data
            job_descriptions, job_metadata = self.prepare_job_data()
            
            if not job_metadata:
                logger.warning("No active jobs found for recommendations")
                return []
            
            # Calculate scores for all jobs
            job_scores = []
            for job in job_metadata:
                score_data = self.calculate_job_score(user_skills, job, user_location, user_profile_data)
                
                job_scores.append({
                    'job': job,
                    'score': score_data['overall_score'],
                    'content_score': score_data['content_score'],
                    'skill_score': score_data['skill_score'],
                    'location_bonus': score_data['location_bonus'],
                    'experience_bonus': score_data['experience_bonus'],
                    'remote_bonus': score_data['remote_bonus'],
                    'salary_fit': score_data['salary_fit'],
                    'matched_skills': score_data['matched_skills'],
                    'missing_skills': score_data['missing_skills'],
                    'matched_skills_count': score_data['matched_skills_count'],
                    'total_skills_count': score_data['total_skills_count']
                })
            
            # Sort by score and return top recommendations
            job_scores.sort(key=lambda x: x['score'], reverse=True)
            
            # Filter out very low scores
            filtered_scores = [job for job in job_scores if job['score'] >= 20]  # Minimum 20% match
            
            return filtered_scores[:limit]
            
        except Exception as e:
            logger.error(f"Error generating recommendations: {str(e)}")
            return []
    
    def get_cluster_info(self) -> Dict:
        """
        Get information about job clusters for debugging/analysis
        """
        if not self.is_trained:
            return {"error": "Model not trained"}
        
        cluster_info = {}
        for i in range(len(self.cluster_centers)):
            cluster_jobs = [self.job_metadata[j] for j, cluster in enumerate(self.job_clusters) if cluster == i]
            cluster_skills = set()
            for job in cluster_jobs:
                cluster_skills.update(job['required_skills'])
                cluster_skills.update(job['preferred_skills'])
            
            cluster_info[f"cluster_{i}"] = {
                "job_count": len(cluster_jobs),
                "top_skills": list(cluster_skills)[:10],
                "job_titles": [job['title'] for job in cluster_jobs[:5]]
            }
        
        return cluster_info


