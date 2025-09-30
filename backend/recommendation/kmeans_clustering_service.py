"""
K-Means Clustering Service for Job-Candidate Matching
Trains and maintains cluster models for recommendation system
"""

import logging
import numpy as np
from typing import List, Dict, Tuple, Optional
from django.contrib.auth.models import User
from django.db.models import Avg
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import silhouette_score
from sklearn.decomposition import PCA

from .models import ClusterCenters, JobOffer
from skills.models import TestResult, CandidateProfile, Skill
from testsengine.employability_scoring import EmployabilityScorer

logger = logging.getLogger(__name__)


class KMeansClusteringService:
    """
    Service for training and managing K-Means clusters for job-candidate matching
    """
    
    def __init__(self, algorithm_version="kmeans_v1"):
        self.algorithm_version = algorithm_version
        self.scaler = StandardScaler()
        
    def extract_candidate_features(self, candidate_ids: List[int]) -> Tuple[np.ndarray, List[str]]:
        """
        Extract feature matrix for candidates
        Returns: (feature_matrix, feature_names)
        """
        features_list = []
        feature_names = []
        
        # Get all skills for consistent feature ordering
        all_skills = list(Skill.objects.all().order_by('id'))
        skill_names = [f"skill_{skill.name}" for skill in all_skills]
        
        # Define feature names
        feature_names = skill_names + [
            'avg_test_score',
            'experience_proxy',
            'employability_score',
            'total_skills',
            'tests_completed'
        ]
        
        for candidate_id in candidate_ids:
            try:
                user = User.objects.get(id=candidate_id)
                candidate_profile = CandidateProfile.objects.get(user=user)
                
                # Skill features (binary)
                candidate_skills = set(candidate_profile.skills.values_list('id', flat=True))
                skill_features = [1.0 if skill.id in candidate_skills else 0.0 for skill in all_skills]
                
                # Test performance features
                test_results = TestResult.objects.filter(
                    candidate=candidate_profile,
                    status='completed'
                )
                avg_test_score = test_results.aggregate(avg_score=Avg('score'))['avg_score'] or 0.0
                avg_test_score = avg_test_score / 100.0  # Normalize to 0-1
                tests_completed = test_results.count()
                
                # Experience proxy
                total_skills = candidate_profile.skills.count()
                experience_proxy = min(1.0, total_skills / 20.0)  # Normalize
                
                # Employability score
                try:
                    scorer = EmployabilityScorer()
                    employability_data = scorer.calculate_overall_score(user)
                    employability_score = employability_data.get('overall_readiness', 0) / 100.0
                except:
                    employability_score = 0.0
                
                # Combine all features
                candidate_features = skill_features + [
                    avg_test_score,
                    experience_proxy,
                    employability_score,
                    total_skills / 50.0,  # Normalized total skills
                    min(1.0, tests_completed / 10.0)  # Normalized tests completed
                ]
                
                features_list.append(candidate_features)
                
            except Exception as e:
                logger.warning(f"Error extracting features for candidate {candidate_id}: {e}")
                # Add zero features for missing candidates
                features_list.append([0.0] * len(feature_names))
        
        return np.array(features_list), feature_names
    
    def extract_job_features(self, job_offers: List[JobOffer]) -> Tuple[np.ndarray, List[str]]:
        """
        Extract feature matrix for job offers
        Returns: (feature_matrix, feature_names)
        """
        features_list = []
        
        # Get all skills for consistent feature ordering
        all_skills = list(Skill.objects.all().order_by('id'))
        skill_names = [f"job_skill_{skill.name}" for skill in all_skills]
        
        # Define feature names
        feature_names = skill_names + [
            'salary_level',
            'seniority_level',
            'remote_flag',
            'required_skills_count',
            'preferred_skills_count'
        ]
        
        for job_offer in job_offers:
            try:
                # Skill features (required=1.0, preferred=0.5, none=0.0)
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
                    salary_level = min(1.0, avg_salary / 50000.0)  # Normalize to typical max
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
                
                # Other features
                remote_flag = 1.0 if job_offer.remote_flag else 0.0
                required_skills_count = len(required_skills) / 20.0  # Normalized
                preferred_skills_count = len(preferred_skills) / 20.0  # Normalized
                
                # Combine all features
                job_features = skill_features + [
                    salary_level,
                    seniority_level,
                    remote_flag,
                    required_skills_count,
                    preferred_skills_count
                ]
                
                features_list.append(job_features)
                
            except Exception as e:
                logger.warning(f"Error extracting features for job {job_offer.id}: {e}")
                # Add zero features for problematic jobs
                features_list.append([0.0] * len(feature_names))
        
        return np.array(features_list), feature_names
    
    def train_kmeans_model(self, n_clusters: int = 8, random_state: int = 42) -> ClusterCenters:
        """
        Train K-Means model on combined candidate-job feature space
        """
        logger.info(f"Training K-Means model with {n_clusters} clusters")
        
        # Get active candidates and jobs
        candidate_ids = list(User.objects.filter(
            candidateprofile__isnull=False,
            is_active=True
        ).values_list('id', flat=True))
        
        job_offers = list(JobOffer.objects.filter(status='active'))
        
        if len(candidate_ids) < 10 or len(job_offers) < 5:
            logger.warning("Insufficient data for clustering")
            return None
        
        # Extract features
        candidate_features, candidate_feature_names = self.extract_candidate_features(candidate_ids)
        job_features, job_feature_names = self.extract_job_features(job_offers)
        
        # Combine features (candidates and jobs in same space)
        # Pad shorter feature vectors to match
        max_features = max(candidate_features.shape[1], job_features.shape[1])
        
        if candidate_features.shape[1] < max_features:
            padding = np.zeros((candidate_features.shape[0], max_features - candidate_features.shape[1]))
            candidate_features = np.hstack([candidate_features, padding])
        
        if job_features.shape[1] < max_features:
            padding = np.zeros((job_features.shape[0], max_features - job_features.shape[1]))
            job_features = np.hstack([job_features, padding])
        
        # Combine all data
        all_features = np.vstack([candidate_features, job_features])
        
        # Standardize features
        all_features_scaled = self.scaler.fit_transform(all_features)
        
        # Train K-Means
        kmeans = KMeans(n_clusters=n_clusters, random_state=random_state, n_init=10)
        cluster_labels = kmeans.fit_predict(all_features_scaled)
        
        # Calculate metrics
        try:
            silhouette_avg = silhouette_score(all_features_scaled, cluster_labels)
        except:
            silhouette_avg = None
        
        # Prepare metadata
        training_metadata = {
            'feature_names': candidate_feature_names + job_feature_names[:max_features - len(candidate_feature_names)],
            'n_candidates': len(candidate_ids),
            'n_jobs': len(job_offers),
            'scaler_mean': self.scaler.mean_.tolist(),
            'scaler_scale': self.scaler.scale_.tolist(),
            'random_state': random_state,
            'candidate_cluster_distribution': np.bincount(cluster_labels[:len(candidate_ids)]).tolist(),
            'job_cluster_distribution': np.bincount(cluster_labels[len(candidate_ids):]).tolist()
        }
        
        # Deactivate old models
        ClusterCenters.objects.filter(is_active=True).update(is_active=False)
        
        # Save new model
        cluster_model = ClusterCenters.objects.create(
            algorithm_version=self.algorithm_version,
            n_clusters=n_clusters,
            centers=kmeans.cluster_centers_.tolist(),
            training_metadata=training_metadata,
            inertia=kmeans.inertia_,
            silhouette_score=silhouette_avg,
            n_samples_trained=len(all_features),
            is_active=True
        )
        
        logger.info(f"K-Means model trained successfully. Inertia: {kmeans.inertia_:.2f}, Silhouette: {silhouette_avg:.3f if silhouette_avg else 'N/A'}")
        
        return cluster_model
    
    def get_cluster_assignments(self, candidate_ids: List[int] = None, job_ids: List[int] = None) -> Dict:
        """
        Get cluster assignments for candidates and/or jobs using active model
        """
        cluster_model = ClusterCenters.objects.filter(is_active=True).first()
        if not cluster_model:
            logger.warning("No active cluster model found")
            return {}
        
        results = {}
        
        # Load scaler parameters
        metadata = cluster_model.training_metadata
        self.scaler.mean_ = np.array(metadata['scaler_mean'])
        self.scaler.scale_ = np.array(metadata['scaler_scale'])
        
        centers = np.array(cluster_model.centers)
        
        if candidate_ids:
            candidate_features, _ = self.extract_candidate_features(candidate_ids)
            # Pad if necessary
            if candidate_features.shape[1] < len(metadata['scaler_mean']):
                padding = np.zeros((candidate_features.shape[0], len(metadata['scaler_mean']) - candidate_features.shape[1]))
                candidate_features = np.hstack([candidate_features, padding])
            
            candidate_features_scaled = self.scaler.transform(candidate_features)
            candidate_clusters = []
            
            for features in candidate_features_scaled:
                distances = np.linalg.norm(centers - features, axis=1)
                cluster_id = np.argmin(distances)
                candidate_clusters.append(int(cluster_id))
            
            results['candidates'] = dict(zip(candidate_ids, candidate_clusters))
        
        if job_ids:
            job_offers = JobOffer.objects.filter(id__in=job_ids)
            job_features, _ = self.extract_job_features(list(job_offers))
            # Pad if necessary
            if job_features.shape[1] < len(metadata['scaler_mean']):
                padding = np.zeros((job_features.shape[0], len(metadata['scaler_mean']) - job_features.shape[1]))
                job_features = np.hstack([job_features, padding])
            
            job_features_scaled = self.scaler.transform(job_features)
            job_clusters = []
            
            for features in job_features_scaled:
                distances = np.linalg.norm(centers - features, axis=1)
                cluster_id = np.argmin(distances)
                job_clusters.append(int(cluster_id))
            
            results['jobs'] = dict(zip(job_ids, job_clusters))
        
        return results
