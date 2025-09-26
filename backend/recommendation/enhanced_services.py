"""
Enhanced Job Recommendation Services
Implements improved Content-Based Filtering and K-Means Clustering with:
- Better skill matching for all user skills
- Balanced clustering
- Configurable scoring weights
- Detailed match breakdowns
- Performance optimizations
"""
import math
import logging
import numpy as np
from typing import List, Dict, Tuple, Optional
from django.db.models import Q, F, Count
from django.db import transaction
from django.utils import timezone
from datetime import timedelta
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import KMeans
from sklearn.metrics.pairwise import cosine_similarity
import json
import pickle
import os
from django.core.cache import cache

logger = logging.getLogger(__name__)

from .models import JobOffer, JobRecommendation, UserJobPreference, ScoringWeights
from skills.models import Skill, TestResult, CandidateProfile


class ProportionalTestScoringEngine:
    """
    New proportional test scoring engine implementing:
    - Skills (50%) - most important factor
    - Technical Tests (30%) - proportional to relevant tests passed
    - Location (20%) - important but not dominant
    """
    
    def __init__(self):
        self.skill_weight = 0.5  # 50% for skills
        self.test_weight = 0.3   # 30% for technical tests
        self.location_weight = 0.2  # 20% for location
        self.test_pass_threshold = 70  # Minimum percentage to pass a test
    
    def calculate_proportional_job_score(self, user, job, user_skills=None, user_location=None) -> Dict:
        """
        Calculate job match score using proportional test scoring
        
        Args:
            user: Django User instance
            job: JobOffer instance
            user_skills: List of user skill names
            user_location: User's location string
            
        Returns:
            Dictionary with detailed scoring breakdown
        """
        try:
            # 1. Calculate Skills Score (50% weight)
            skills_score = self._calculate_skills_score(user, job, user_skills)
            
            # 2. Calculate Technical Tests Score (30% weight) - proportional
            test_score, test_details = self._calculate_proportional_test_score(user, job, user_skills)
            
            # 3. Calculate Location Score (20% weight)
            location_score = self._calculate_location_score(user_location, job.location)
            
            # Calculate weighted total score
            weighted_score = (
                self.skill_weight * skills_score +
                self.test_weight * test_score +
                self.location_weight * location_score
            )
            
            # Convert to percentage
            global_score = round(weighted_score * 100)
            
            # Prepare detailed breakdown
            score_breakdown = {
                'global_score': global_score,
                'skills_score': round(skills_score * 100, 1),
                'test_score': round(test_score * 100, 1),
                'location_score': round(location_score * 100, 1),
                'test_details': test_details,
                'weights': {
                    'skills': self.skill_weight,
                    'tests': self.test_weight,
                    'location': self.location_weight
                }
            }
            
            logger.info(f"Proportional job score calculated for user {user.id}, job {job.id}: {global_score}%")
            return score_breakdown
            
        except Exception as e:
            logger.error(f"Error calculating proportional job score: {str(e)}")
            return {
                'global_score': 0,
                'skills_score': 0,
                'test_score': 0,
                'location_score': 0,
                'test_details': {'error': str(e)},
                'weights': {
                    'skills': self.skill_weight,
                    'tests': self.test_weight,
                    'location': self.location_weight
                }
            }
    
    def _calculate_skills_score(self, user, job, user_skills=None) -> float:
        """Calculate skills match score (0-1 scale)"""
        try:
            # Get job skills
            job_required_skills = [skill.name.lower() for skill in job.required_skills.all()]
            job_preferred_skills = [skill.name.lower() for skill in job.preferred_skills.all()]
            
            if not user_skills:
                # Get user skills from database
                candidate_profile = CandidateProfile.objects.filter(user=user).first()
                if candidate_profile:
                    user_skills = [skill.name.lower() for skill in candidate_profile.skills.all()]
                else:
                    return 0.0
            
            # Normalize user skills
            user_skills_normalized = [skill.lower() for skill in user_skills]
            
            # Calculate required skills match
            required_matches = sum(1 for skill in job_required_skills if skill in user_skills_normalized)
            required_score = required_matches / len(job_required_skills) if job_required_skills else 0
            
            # Calculate preferred skills match
            preferred_matches = sum(1 for skill in job_preferred_skills if skill in user_skills_normalized)
            preferred_score = preferred_matches / len(job_preferred_skills) if job_preferred_skills else 0
            
            # Weighted skills score (70% required, 30% preferred)
            total_skills = len(job_required_skills) + len(job_preferred_skills)
            if total_skills == 0:
                return 0.0
            
            skills_score = (required_score * 0.7) + (preferred_score * 0.3)
            return min(skills_score, 1.0)
            
        except Exception as e:
            logger.error(f"Error calculating skills score: {str(e)}")
            return 0.0
    
    def _calculate_proportional_test_score(self, user, job, user_skills=None) -> Tuple[float, Dict]:
        """Calculate proportional test score (0-1 scale)"""
        try:
            # Get job skills that have tests
            job_skills = [skill.name.lower() for skill in job.required_skills.all()] + \
                        [skill.name.lower() for skill in job.preferred_skills.all()]
            
            # Get user's test results
            test_results = TestResult.objects.filter(
                candidate__user=user,
                status='completed',
                score__gte=self.test_pass_threshold  # Only consider passed tests (70%+)
            ).select_related('test')
            
            # Filter tests relevant to this job
            relevant_tests = []
            for test_result in test_results:
                test_skill = test_result.test.skill.name.lower() if test_result.test.skill else None
                if test_skill and test_skill in job_skills:
                    relevant_tests.append({
                        'skill': test_skill,
                        'score': test_result.score,
                        'percentage': test_result.score,  # score is already a percentage
                        'is_passed': test_result.score >= self.test_pass_threshold
                    })
            
            # Calculate proportional score
            total_relevant_tests = len(set(job_skills))  # Unique skills that have tests
            passed_tests = len([t for t in relevant_tests if t['is_passed']])
            
            test_score = passed_tests / total_relevant_tests if total_relevant_tests > 0 else 0
            
            # Prepare test details
            test_details = {
                'passed_tests': passed_tests,
                'total_relevant_tests': total_relevant_tests,
                'test_proportion': test_score,
                'test_contribution_percentage': round(test_score * 30, 1),
                'relevant_tests': relevant_tests
            }
            
            return test_score, test_details
            
        except Exception as e:
            logger.error(f"Error calculating test score: {str(e)}")
            return 0.0, {'error': str(e)}
    
    def _calculate_location_score(self, user_location, job_location) -> float:
        """Calculate location match score (0-1 scale)"""
        if not user_location or not job_location:
            return 0.0
        
        try:
            user_loc_lower = user_location.lower().strip()
            job_loc_lower = job_location.lower().strip()
            
            # Check for exact match
            if user_loc_lower == job_loc_lower:
                return 1.0
            
            # Check for partial match
            if user_loc_lower in job_loc_lower or job_loc_lower in user_loc_lower:
                return 1.0
            
            # Check for city-level match
            user_city = user_loc_lower.split(',')[0].strip()
            job_city = job_loc_lower.split(',')[0].strip()
            
            if user_city == job_city:
                return 1.0
            
            return 0.0
            
        except Exception as e:
            logger.error(f"Error calculating location score: {str(e)}")
            return 0.0


class EnhancedRecommendationEngine:
    """
    Enhanced recommendation engine with improved skill matching,
    balanced clustering, and detailed scoring breakdowns
    """
    
    def __init__(self):
        self.vectorizer = TfidfVectorizer(
            max_features=2000,  # Increased for better text analysis
            stop_words='english',
            ngram_range=(1, 3),  # Include trigrams for better matching
            min_df=1,
            max_df=0.95
        )
        self.kmeans = None
        self.job_vectors = None
        self.job_clusters = None
        self.cluster_centers = None
        self.is_trained = False
        
        # Load or create default scoring weights
        self.scoring_weights = self.load_scoring_weights()
        
        # Skill matching improvements
        self.skill_synonyms = self.load_skill_synonyms()
        self.skill_categories = self.load_skill_categories()
        
    def load_scoring_weights(self) -> Dict:
        """Load scoring weights from database or use defaults"""
        try:
            weights = ScoringWeights.objects.first()
            if weights:
                return {
                    'skill_match': weights.skill_match_weight,
                    'content_similarity': weights.content_similarity_weight,
                    'location_bonus': weights.location_bonus_weight,
                    'experience_bonus': weights.experience_bonus_weight,
                    'remote_bonus': weights.remote_bonus_weight,
                    'salary_fit': weights.salary_fit_weight,
                    'cluster_fit': weights.cluster_fit_weight,
                    'required_skill_weight': weights.required_skill_weight,
                    'preferred_skill_weight': weights.preferred_skill_weight
                }
        except Exception as e:
            logger.warning(f"Could not load scoring weights: {e}")
        
        # Default weights
        return {
            'skill_match': 0.70,  # Increased from 0.80
            'content_similarity': 0.20,  # Increased from 0.15
            'location_bonus': 0.05,
            'experience_bonus': 0.03,
            'remote_bonus': 0.02,
            'salary_fit': 0.00,  # Disabled for now
            'cluster_fit': 0.10,  # New: cluster fit bonus
            'required_skill_weight': 0.80,  # Weight for required skills
            'preferred_skill_weight': 0.20   # Weight for preferred skills
        }
    
    def load_skill_synonyms(self) -> Dict[str, List[str]]:
        """Load skill synonyms for better matching"""
        return {
            'python': ['py', 'python3', 'python2'],
            'javascript': ['js', 'ecmascript', 'nodejs', 'node.js'],
            'react': ['reactjs', 'react.js'],
            'vue': ['vuejs', 'vue.js'],
            'angular': ['angularjs', 'angular.js'],
            'django': ['django framework'],
            'flask': ['flask framework'],
            'postgresql': ['postgres', 'postgresql database'],
            'mysql': ['mysql database'],
            'mongodb': ['mongo', 'mongo db'],
            'redis': ['redis cache'],
            'docker': ['docker container', 'containerization'],
            'kubernetes': ['k8s', 'kube'],
            'aws': ['amazon web services', 'amazon aws'],
            'azure': ['microsoft azure'],
            'gcp': ['google cloud platform', 'google cloud'],
            'git': ['git version control', 'version control'],
            'ci/cd': ['continuous integration', 'continuous deployment', 'cicd'],
            'rest api': ['rest', 'api', 'restful api'],
            'graphql': ['graph ql', 'graphql api'],
            'microservices': ['microservice', 'micro service'],
            'machine learning': ['ml', 'machine learning', 'ai'],
            'data science': ['data scientist', 'data analysis'],
            'frontend': ['front-end', 'front end', 'ui'],
            'backend': ['back-end', 'back end', 'server-side'],
            'full stack': ['fullstack', 'full-stack', 'full stack developer']
        }
    
    def load_skill_categories(self) -> Dict[str, List[str]]:
        """Load skill categories for better clustering"""
        return {
            'programming_languages': ['python', 'javascript', 'java', 'c#', 'c++', 'go', 'rust', 'php', 'ruby', 'swift', 'kotlin'],
            'web_frameworks': ['react', 'vue', 'angular', 'django', 'flask', 'express', 'spring', 'laravel', 'rails'],
            'databases': ['postgresql', 'mysql', 'mongodb', 'redis', 'elasticsearch', 'cassandra'],
            'cloud_platforms': ['aws', 'azure', 'gcp', 'digital ocean', 'heroku'],
            'devops_tools': ['docker', 'kubernetes', 'jenkins', 'gitlab', 'terraform', 'ansible'],
            'mobile_development': ['react native', 'flutter', 'ios', 'android', 'xamarin'],
            'data_science': ['pandas', 'numpy', 'scikit-learn', 'tensorflow', 'pytorch', 'jupyter'],
            'testing': ['jest', 'cypress', 'selenium', 'pytest', 'unittest', 'junit']
        }
    
    def normalize_skill_name(self, skill: str) -> str:
        """Normalize skill name for better matching"""
        skill_lower = skill.lower().strip()
        
        # Check synonyms
        for canonical, synonyms in self.skill_synonyms.items():
            if skill_lower in synonyms or skill_lower == canonical:
                return canonical
        
        return skill_lower
    
    def enhanced_skill_similarity(self, user_skills: List[str], job_skills: List[str]) -> Tuple[float, List[str], List[str]]:
        """
        Enhanced skill similarity with better matching and synonyms
        """
        if not job_skills:
            return 0.0, [], []
        
        # Normalize all skills
        user_skills_normalized = [self.normalize_skill_name(skill) for skill in user_skills]
        job_skills_normalized = [self.normalize_skill_name(skill) for skill in job_skills]
        
        # Find exact matches
        user_skill_set = set(user_skills_normalized)
        job_skill_set = set(job_skills_normalized)
        
        exact_matches = list(user_skill_set.intersection(job_skill_set))
        
        # Find partial matches (skills that contain each other)
        partial_matches = []
        for user_skill in user_skill_set:
            for job_skill in job_skill_set:
                if user_skill != job_skill:  # Skip exact matches
                    if user_skill in job_skill or job_skill in user_skill:
                        partial_matches.append(job_skill)
        
        # Find category matches
        category_matches = []
        for user_skill in user_skill_set:
            for category, skills in self.skill_categories.items():
                if user_skill in skills:
                    for job_skill in job_skill_set:
                        if job_skill in skills and job_skill not in exact_matches and job_skill not in partial_matches:
                            category_matches.append(job_skill)
        
        # Combine all matches
        all_matches = exact_matches + partial_matches + category_matches
        missing_skills = list(job_skill_set - set(all_matches))
        
        # Calculate weighted similarity score
        exact_weight = 1.0
        partial_weight = 0.7
        category_weight = 0.5
        
        weighted_score = (
            len(exact_matches) * exact_weight +
            len(partial_matches) * partial_weight +
            len(category_matches) * category_weight
        ) / len(job_skills_normalized)
        
        return min(1.0, weighted_score), all_matches, missing_skills
    
    def prepare_job_data_enhanced(self) -> Tuple[List[str], List[Dict]]:
        """
        Enhanced job data preparation with better skill extraction
        """
        # Use cache if available (optional)
        cache_key = 'enhanced_job_data'
        try:
            cached_data = cache.get(cache_key)
            if cached_data:
                return cached_data
        except Exception:
            # Cache not available, continue without caching
            pass
        
        jobs = JobOffer.objects.filter(status='active').prefetch_related(
            'required_skills', 'preferred_skills'
        )
        
        job_descriptions = []
        job_metadata = []
        
        for job in jobs:
            # Enhanced skill extraction
            required_skills = [skill.name for skill in job.required_skills.all()]
            preferred_skills = [skill.name for skill in job.preferred_skills.all()]
            tags = job.tags or []
            
            # Create comprehensive job description with skill categories
            skills_text = ' '.join(required_skills + preferred_skills)
            tags_text = ' '.join(tags)
            
            # Add skill categories to description
            skill_categories = []
            for skill in required_skills + preferred_skills:
                for category, skills in self.skill_categories.items():
                    if self.normalize_skill_name(skill) in skills:
                        skill_categories.append(category)
            
            categories_text = ' '.join(set(skill_categories))
            
            full_description = f"{job.title} {job.description} {job.requirements} {skills_text} {tags_text} {categories_text}"
            
            job_descriptions.append(full_description)
            job_metadata.append({
                'id': job.id,
                'title': job.title,
                'company': job.company,
                'location': job.location,
                'city': job.city,
                'job_type': job.job_type,
                'seniority': job.seniority,
                'salary_min': job.salary_min,
                'salary_max': job.salary_max,
                'remote': job.remote,
                'required_skills': required_skills,
                'preferred_skills': preferred_skills,
                'tags': tags,
                'description': job.description,
                'requirements': job.requirements,
                'benefits': job.benefits or '',
                'industry': job.industry or '',
                'company_size': job.company_size or '',
                'skill_categories': list(set(skill_categories))
            })
        
        result = (job_descriptions, job_metadata)
        
        # Cache for 1 hour (optional)
        try:
            cache.set(cache_key, result, 3600)
        except Exception:
            # Cache not available, continue without caching
            pass
        
        return result
    
    def train_kmeans_enhanced(self, n_clusters: int = None):
        """
        Enhanced K-Means training with dynamic cluster selection
        """
        try:
            job_descriptions, job_metadata = self.prepare_job_data_enhanced()
            
            if len(job_descriptions) < 2:
                logger.warning("Not enough jobs for clustering")
                return
            
            # Dynamic cluster selection based on job count and skill diversity
            if n_clusters is None:
                # Calculate optimal number of clusters
                job_count = len(job_descriptions)
                skill_diversity = len(set([skill for job in job_metadata for skill in job['required_skills'] + job['preferred_skills']]))
                
                # Rule of thumb: 1 cluster per 3-5 jobs, but consider skill diversity
                n_clusters = max(2, min(job_count // 3, skill_diversity // 10, 8))
            
            # Vectorize job descriptions
            self.job_vectors = self.vectorizer.fit_transform(job_descriptions)
            
            # Apply K-Means clustering with multiple initializations
            self.kmeans = KMeans(
                n_clusters=n_clusters,
                random_state=42,
                n_init=20,  # More initializations for better results
                max_iter=300,
                algorithm='lloyd'
            )
            
            self.job_clusters = self.kmeans.fit_predict(self.job_vectors)
            self.cluster_centers = self.kmeans.cluster_centers_
            self.is_trained = True
            
            # Store metadata for analysis
            self.job_metadata = job_metadata
            
            logger.info(f"Enhanced K-Means trained with {n_clusters} clusters")
            
        except Exception as e:
            logger.error(f"Error training enhanced K-Means: {str(e)}")
            raise
    
    def calculate_cluster_fit_score(self, user_skills: List[str], job_metadata: Dict) -> float:
        """
        Calculate how well the job fits the user's cluster
        """
        if not self.is_trained or self.job_clusters is None:
            return 0.0
        
        # Find the job's cluster
        job_id = job_metadata['id']
        job_cluster = None
        
        for i, job in enumerate(self.job_metadata):
            if job['id'] == job_id:
                job_cluster = self.job_clusters[i]
                break
        
        if job_cluster is None:
            return 0.0
        
        # Calculate user's cluster affinity
        user_vector = self.get_user_profile_vector(user_skills, {})
        user_cluster_distances = self.kmeans.transform(user_vector.reshape(1, -1))[0]
        
        # Get distance to job's cluster
        job_cluster_distance = user_cluster_distances[job_cluster]
        
        # Convert distance to similarity score (closer = higher score)
        max_distance = max(user_cluster_distances)
        if max_distance > 0:
            cluster_fit = 1.0 - (job_cluster_distance / max_distance)
        else:
            cluster_fit = 1.0
        
        return max(0.0, cluster_fit)
    
    def calculate_enhanced_job_score(self, user_skills: List[str], job_metadata: Dict, user_location: str = "", user_profile_data: Optional[Dict] = None) -> Dict:
        """
        Enhanced job scoring with detailed breakdown
        """
        # 1. Enhanced skill matching
        required_skills = job_metadata['required_skills']
        preferred_skills = job_metadata['preferred_skills']
        
        # Calculate required skills match with enhanced similarity
        required_skill_score, required_matched, required_missing = self.enhanced_skill_similarity(user_skills, required_skills)
        
        # Calculate preferred skills match
        preferred_skill_score, preferred_matched, preferred_missing = self.enhanced_skill_similarity(user_skills, preferred_skills)
        
        # Weighted skill score
        skill_score = (
            required_skill_score * self.scoring_weights['required_skill_weight'] +
            preferred_skill_score * self.scoring_weights['preferred_skill_weight']
        )
        
        # 2. Content similarity
        user_vector = self.get_user_profile_vector(user_skills, user_profile_data)
        content_score = 0.5  # Default
        
        if self.is_trained and self.job_vectors is not None:
            job_idx = None
            for i, job in enumerate(self.job_metadata):
                if job['id'] == job_metadata['id']:
                    job_idx = i
                    break
            
            if job_idx is not None:
                job_vector = self.job_vectors[job_idx:job_idx+1]
                content_score = self.calculate_cosine_similarity(user_vector, job_vector)
        
        # 3. Cluster fit score
        cluster_fit_score = self.calculate_cluster_fit_score(user_skills, job_metadata)
        
        # 4. Enhanced location bonus with Moroccan cities
        location_bonus = 0.0
        if user_location and job_metadata['location']:
            user_city = user_location.lower().strip()
            job_location = job_metadata['location'].lower().strip()
            
            # Major Moroccan cities for better matching
            moroccan_cities = {
                'casablanca': ['casablanca', 'casa'],
                'rabat': ['rabat', 'salé'],
                'marrakech': ['marrakech', 'marrakesh'],
                'fes': ['fes', 'fès', 'fez'],
                'agadir': ['agadir'],
                'tangier': ['tangier', 'tanger'],
                'oujda': ['oujda'],
                'kenitra': ['kenitra'],
                'tetouan': ['tetouan', 'tétouan'],
                'meknes': ['meknes', 'meknès']
            }
            
            # Check for exact city match
            for city, variations in moroccan_cities.items():
                if any(var in user_city for var in variations) and any(var in job_location for var in variations):
                    location_bonus = 0.15  # Perfect city match
                    break
                elif any(var in user_city for var in variations) and any(var in job_location for var in variations):
                    location_bonus = 0.10  # Partial city match
                    break
            
            # Fallback: check if user city is in job location or vice versa
            if location_bonus == 0:
                if user_city in job_location or job_location in user_city:
                    location_bonus = 0.08
                elif any(country in job_location for country in ['morocco', 'maroc', 'ma']):
                    location_bonus = 0.05  # Same country
        
        # 5. Remote work bonus
        remote_bonus = 0.05 if job_metadata.get('remote', False) else 0.0
        
        # 6. Experience level matching
        experience_bonus = 0.0
        if user_profile_data and 'experienceLevel' in user_profile_data:
            user_experience = user_profile_data['experienceLevel'].lower()
            job_seniority = job_metadata.get('seniority', '').lower()
            
            experience_levels = {
                'junior': 0, 'entry': 0, '0-1 an': 0,
                '1-3 ans': 1, 'intermediate': 2, '3-5 ans': 2,
                'senior': 3, '5+ ans': 3, 'lead': 4, 'principal': 4, 'expert': 5
            }
            
            user_level = experience_levels.get(user_experience, 1)
            job_level = experience_levels.get(job_seniority, 1)
            
            if user_level == job_level:
                experience_bonus = 0.1
            elif abs(user_level - job_level) <= 1:
                experience_bonus = 0.05
            elif user_level > job_level:
                experience_bonus = 0.02
        
        # 7. Salary fit (simplified)
        salary_fit = 0.5
        if user_profile_data and 'preferences' in user_profile_data:
            target_salary = user_profile_data['preferences'].get('target_salary_min', 0)
            if target_salary and job_metadata.get('salary_min'):
                if job_metadata['salary_min'] >= target_salary * 0.8:
                    salary_fit = 0.8
                elif job_metadata['salary_min'] >= target_salary * 0.6:
                    salary_fit = 0.6
        
        # Calculate overall score with enhanced weights
        overall_score = (
            skill_score * self.scoring_weights['skill_match'] +
            content_score * self.scoring_weights['content_similarity'] +
            cluster_fit_score * self.scoring_weights['cluster_fit'] +
            location_bonus +
            experience_bonus +
            remote_bonus +
            salary_fit * self.scoring_weights['salary_fit']
        ) * 100
        
        # Combine all matched skills
        all_matched_skills = required_matched + preferred_matched
        all_missing_skills = required_missing + preferred_missing
        
        return {
            'overall_score': min(100, max(0, overall_score)),
            'content_score': content_score * 100,
            'skill_score': skill_score * 100,
            'required_skill_score': required_skill_score * 100,
            'preferred_skill_score': preferred_skill_score * 100,
            'cluster_fit_score': cluster_fit_score * 100,
            'location_bonus': location_bonus * 100,
            'experience_bonus': experience_bonus * 100,
            'remote_bonus': remote_bonus * 100,
            'salary_fit': salary_fit * 100,
            'matched_skills': all_matched_skills,
            'missing_skills': all_missing_skills,
            'required_matched_skills': required_matched,
            'preferred_matched_skills': preferred_matched,
            'required_missing_skills': required_missing,
            'preferred_missing_skills': preferred_missing,
            'required_skills_count': len(required_skills),
            'preferred_skills_count': len(preferred_skills),
            'required_matched_count': len(required_matched),
            'preferred_matched_count': len(preferred_matched),
            'matched_skills_count': len(all_matched_skills),
            'total_skills_count': len(required_skills) + len(preferred_skills),
            'skill_match_percentage': (len(all_matched_skills) / (len(required_skills) + len(preferred_skills)) * 100) if (len(required_skills) + len(preferred_skills)) > 0 else 0,
            'required_skill_match_percentage': (len(required_matched) / len(required_skills) * 100) if len(required_skills) > 0 else 0,
            'preferred_skill_match_percentage': (len(preferred_matched) / len(preferred_skills) * 100) if len(preferred_skills) > 0 else 0
        }
    
    def generate_enhanced_recommendations(self, user_skills: List[str], user_location: str = "", user_profile_data: Optional[Dict] = None, limit: int = 10) -> List[Dict]:
        """
        Generate enhanced recommendations with detailed breakdowns
        """
        try:
            # Train model if not already trained
            if not self.is_trained:
                self.train_kmeans_enhanced()
            
            # Get job data
            job_descriptions, job_metadata = self.prepare_job_data_enhanced()
            
            if not job_metadata:
                logger.warning("No active jobs found for recommendations")
                return []
            
            # Calculate scores for all jobs
            job_scores = []
            for i, job in enumerate(job_metadata):
                score_data = self.calculate_enhanced_job_score(user_skills, job, user_location, user_profile_data)
                
                # Get cluster information for this job
                cluster_id = self.job_clusters[i] if i < len(self.job_clusters) else 0
                cluster_name = f"Career Cluster {cluster_id + 1}"
                
                # Check location match
                location_match = False
                if user_location and job.get('location'):
                    user_location_lower = user_location.lower().strip()
                    job_location_lower = job.get('location', '').lower().strip()
                    location_match = (user_location_lower in job_location_lower or 
                                   job_location_lower in user_location_lower or
                                   any(city in job_location_lower for city in user_location_lower.split(',')))
                
                job_scores.append({
                    'job': job,
                    'score': score_data['overall_score'],
                    'content_score': score_data['content_score'],
                    'skill_score': score_data['skill_score'],
                    'cluster_fit_score': score_data['cluster_fit_score'],
                    'location_bonus': score_data['location_bonus'],
                    'experience_bonus': score_data['experience_bonus'],
                    'remote_bonus': score_data['remote_bonus'],
                    'salary_fit': score_data['salary_fit'],
                    'matched_skills': score_data['matched_skills'],
                    'missing_skills': score_data['missing_skills'],
                    'matched_skills_count': score_data['matched_skills_count'],
                    'total_skills_count': score_data['total_skills_count'],
                    'required_skill_match_percentage': score_data['required_skill_match_percentage'],
                    'preferred_skill_match_percentage': score_data['preferred_skill_match_percentage'],
                    'skill_match_percentage': score_data['skill_match_percentage'],
                    'required_matched_skills': score_data['required_matched_skills'],
                    'preferred_matched_skills': score_data['preferred_matched_skills'],
                    'required_missing_skills': score_data['required_missing_skills'],
                    'preferred_missing_skills': score_data['preferred_missing_skills'],
                    'required_skills_count': score_data['required_skills_count'],
                    'preferred_skills_count': score_data['preferred_skills_count'],
                    'required_matched_count': score_data['required_matched_count'],
                    'preferred_matched_count': score_data['preferred_matched_count'],
                    # Additional fields for enhanced View Details
                    'cluster_id': cluster_id,
                    'cluster_name': cluster_name,
                    'location_match': location_match
                })
            
            # Sort by score and filter
            job_scores.sort(key=lambda x: x['score'], reverse=True)
            
            # Lower threshold for better coverage
            filtered_scores = [job for job in job_scores if job['score'] >= 15]  # Lowered from 20
            
            return filtered_scores[:limit]
            
        except Exception as e:
            logger.error(f"Error generating enhanced recommendations: {str(e)}")
            return []
    
    def get_user_profile_vector(self, user_skills: List[str], user_profile_data: Optional[Dict] = None) -> np.ndarray:
        """
        Create user profile vector for content similarity
        """
        if not user_skills:
            return np.zeros(1)
        
        # Create user profile text
        profile_text = ' '.join(user_skills)
        
        if user_profile_data:
            if 'experience' in user_profile_data:
                profile_text += ' ' + ' '.join(user_profile_data['experience'])
            if 'education' in user_profile_data:
                profile_text += ' ' + ' '.join(user_profile_data['education'])
        
        # Transform using trained vectorizer
        if self.is_trained and self.vectorizer is not None:
            return self.vectorizer.transform([profile_text]).toarray()[0]
        
        return np.zeros(1)
    
    def calculate_cosine_similarity(self, user_vector: np.ndarray, job_vector: np.ndarray) -> float:
        """
        Calculate cosine similarity between user and job vectors
        """
        if user_vector.shape[0] != job_vector.shape[1]:
            return 0.0
        
        similarity = cosine_similarity(user_vector.reshape(1, -1), job_vector)[0][0]
        return float(similarity)
    
    def get_cluster_info_enhanced(self) -> Dict:
        """
        Get enhanced cluster information with skill analysis
        """
        if not self.is_trained or self.job_clusters is None:
            return {}
        
        cluster_info = {}
        
        for cluster_id in range(self.kmeans.n_clusters):
            cluster_jobs = [self.job_metadata[i] for i, cluster in enumerate(self.job_clusters) if cluster == cluster_id]
            
            if not cluster_jobs:
                continue
            
            # Analyze skills in this cluster
            all_skills = []
            for job in cluster_jobs:
                all_skills.extend(job['required_skills'] + job['preferred_skills'])
            
            skill_counts = {}
            for skill in all_skills:
                skill_lower = self.normalize_skill_name(skill)
                skill_counts[skill_lower] = skill_counts.get(skill_lower, 0) + 1
            
            # Top skills in cluster
            top_skills = sorted(skill_counts.items(), key=lambda x: x[1], reverse=True)[:10]
            
            # Job titles in cluster
            job_titles = [job['title'] for job in cluster_jobs]
            
            cluster_info[f'cluster_{cluster_id}'] = {
                'job_count': len(cluster_jobs),
                'top_skills': [skill for skill, count in top_skills],
                'job_titles': job_titles,
                'skill_diversity': len(set(all_skills))
            }
        
        return cluster_info
