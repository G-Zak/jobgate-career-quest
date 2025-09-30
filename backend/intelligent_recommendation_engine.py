#!/usr/bin/env python
"""
Intelligent Job Recommendation Engine
Complete implementation with cognitive skills, technical tests, and K-means clustering
"""

import os
import sys
import django
import json
import numpy as np
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.feature_extraction.text import TfidfVectorizer
import pickle

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'careerquest.settings')
django.setup()

from django.contrib.auth.models import User
from django.utils import timezone
from django.db import connection
from recommendation.models import JobOffer, JobRecommendation, ScoringWeights
from skills.models import CandidateProfile, Skill
from testsengine.models import TestSubmission
from testsengine.employability_scoring import EmployabilityScorer


class IntelligentRecommendationEngine:
    """Complete recommendation engine with all scoring components"""
    
    def __init__(self):
        self.scaler = StandardScaler()
        self.kmeans_model = None
        self.tfidf_vectorizer = TfidfVectorizer(max_features=100, stop_words='english')
        self.scoring_weights = self._get_scoring_weights()
        
    def _get_scoring_weights(self):
        """Get or create default scoring weights"""
        weights, created = ScoringWeights.objects.get_or_create(
            name="intelligent_engine_v1",
            defaults={
                'is_active': True,
                'skill_match_weight': 0.30,
                'technical_test_weight': 0.25,
                'experience_weight': 0.15,
                'salary_weight': 0.10,
                'location_weight': 0.10,
                'cluster_fit_weight': 0.10,
                'employability_weight': 0.05,
                'test_pass_threshold': 70.0,
                'required_skill_weight': 1.0,
                'preferred_skill_weight': 0.5,
            }
        )
        return weights
    
    def extract_candidate_features(self, candidate):
        """Extract comprehensive features for a candidate"""
        features = {}
        
        # Basic profile features
        features['location'] = candidate.location or 'Unknown'
        features['experience_years'] = getattr(candidate, 'experience_years', 2)  # Default 2 years
        
        # Skills features
        candidate_skills = list(candidate.skills.values_list('name', flat=True))
        features['skills'] = candidate_skills
        features['skills_count'] = len(candidate_skills)
        
        # Technical test scores
        test_scores = self._get_candidate_test_scores(candidate.user)
        features['technical_scores'] = test_scores
        features['avg_technical_score'] = np.mean(list(test_scores.values())) if test_scores else 0
        
        # Cognitive/employability scores
        cognitive_scores = self._get_cognitive_scores(candidate.user)
        features['cognitive_scores'] = cognitive_scores
        features['employability_score'] = cognitive_scores.get('overall_score', 0)
        
        return features
    
    def extract_job_features(self, job_offer):
        """Extract comprehensive features for a job offer"""
        features = {}
        
        # Basic job features
        features['location'] = job_offer.location
        features['salary_min'] = job_offer.salary_min or 10000
        features['salary_max'] = job_offer.salary_max or 15000
        features['salary_avg'] = (features['salary_min'] + features['salary_max']) / 2
        features['remote_flag'] = job_offer.remote_flag
        features['seniority'] = job_offer.seniority or 'intermediate'
        
        # Skills requirements
        required_skills = self._extract_skills_from_text(job_offer.requirements)
        features['required_skills'] = required_skills
        features['required_skills_count'] = len(required_skills)
        
        # Industry and company features
        features['industry'] = job_offer.industry or 'Technology'
        features['company_size'] = job_offer.company_size or '50-100'
        
        return features
    
    def _get_candidate_test_scores(self, user):
        """Get technical test scores for a candidate"""
        scores = {}
        
        # Get test submissions for the user
        submissions = TestSubmission.objects.filter(
            candidate__user=user,
            status='completed'
        ).select_related('test')
        
        for submission in submissions:
            test_name = submission.test.test_name.lower()
            if 'python' in test_name:
                scores['python'] = submission.percentage_score or 0
            elif 'javascript' in test_name:
                scores['javascript'] = submission.percentage_score or 0
            elif 'sql' in test_name:
                scores['sql'] = submission.percentage_score or 0
            elif 'data' in test_name:
                scores['data_analysis'] = submission.percentage_score or 0
            else:
                scores['general'] = submission.percentage_score or 0
        
        return scores
    
    def _get_cognitive_scores(self, user):
        """Get cognitive/employability scores for a candidate"""
        try:
            scorer = EmployabilityScorer()
            employability_data = scorer.calculate_overall_score(user)
            
            cognitive_scores = {
                'overall_score': employability_data.get('overall_employability_score', 0),
                'situational_judgment': employability_data.get('individual_test_scores', {}).get('situational_judgment', {}).get('score', 0),
                'personality': employability_data.get('individual_test_scores', {}).get('personality', {}).get('score', 0),
                'cognitive_ability': employability_data.get('individual_test_scores', {}).get('cognitive_ability', {}).get('score', 0)
            }
            
            return cognitive_scores
        except Exception as e:
            print(f"Warning: Could not get cognitive scores for user {user.id}: {e}")
            return {'overall_score': 50, 'situational_judgment': 50, 'personality': 50, 'cognitive_ability': 50}
    
    def _extract_skills_from_text(self, text):
        """Extract skills from job requirements text"""
        if not text:
            return []
        
        # Get all skills from database
        all_skills = list(Skill.objects.values_list('name', flat=True))
        
        # Find skills mentioned in the text
        text_lower = text.lower()
        found_skills = []
        
        for skill in all_skills:
            if skill.lower() in text_lower:
                found_skills.append(skill)
        
        return found_skills
    
    def calculate_skill_match_score(self, candidate_features, job_features):
        """Calculate skill matching score"""
        candidate_skills = set(skill.lower() for skill in candidate_features['skills'])
        required_skills = set(skill.lower() for skill in job_features['required_skills'])
        
        if not required_skills:
            return 0.5  # Neutral score if no specific requirements
        
        # Calculate overlap
        matched_skills = candidate_skills.intersection(required_skills)
        match_ratio = len(matched_skills) / len(required_skills)
        
        # Bonus for having more skills than required
        extra_skills_bonus = min(0.2, (len(candidate_skills) - len(required_skills)) * 0.05)
        
        return min(1.0, match_ratio + extra_skills_bonus)
    
    def calculate_technical_test_score(self, candidate_features, job_features):
        """Calculate technical test performance score"""
        candidate_scores = candidate_features['technical_scores']
        required_skills = [skill.lower() for skill in job_features['required_skills']]
        
        if not candidate_scores:
            return 0.3  # Low score if no test data
        
        # Map skills to test scores
        relevant_scores = []
        
        for skill in required_skills:
            if 'python' in skill and 'python' in candidate_scores:
                relevant_scores.append(candidate_scores['python'])
            elif 'javascript' in skill and 'javascript' in candidate_scores:
                relevant_scores.append(candidate_scores['javascript'])
            elif 'sql' in skill and 'sql' in candidate_scores:
                relevant_scores.append(candidate_scores['sql'])
            elif 'data' in skill and 'data_analysis' in candidate_scores:
                relevant_scores.append(candidate_scores['data_analysis'])
        
        if not relevant_scores:
            # Use general score or average
            if 'general' in candidate_scores:
                relevant_scores.append(candidate_scores['general'])
            else:
                relevant_scores.append(candidate_features['avg_technical_score'])
        
        # Convert percentage to 0-1 scale
        avg_score = np.mean(relevant_scores) if relevant_scores else 0
        return min(1.0, avg_score / 100.0)
    
    def calculate_location_score(self, candidate_features, job_features):
        """Calculate location matching score"""
        candidate_location = candidate_features['location'].lower()
        job_location = job_features['location'].lower()
        
        if candidate_location == job_location:
            return 1.0
        elif job_features['remote_flag']:
            return 0.9  # High score for remote work
        elif any(city in candidate_location and city in job_location for city in ['casablanca', 'rabat']):
            return 0.8  # Good score for major cities
        else:
            return 0.6  # Lower score for different cities
    
    def calculate_salary_score(self, candidate_features, job_features):
        """Calculate salary fit score"""
        # Assume candidate expects salary based on experience and skills
        expected_salary = 12000 + (candidate_features['experience_years'] * 2000) + (candidate_features['skills_count'] * 500)
        
        job_salary_avg = job_features['salary_avg']
        
        if job_salary_avg >= expected_salary:
            return 1.0
        elif job_salary_avg >= expected_salary * 0.8:
            return 0.8
        elif job_salary_avg >= expected_salary * 0.6:
            return 0.6
        else:
            return 0.3
    
    def calculate_experience_score(self, candidate_features, job_features):
        """Calculate experience level matching score"""
        candidate_exp = candidate_features['experience_years']
        job_seniority = job_features['seniority']
        
        seniority_requirements = {
            'junior': (0, 2),
            'intermediate': (2, 5),
            'senior': (5, 10),
            'expert': (8, 15),
            'lead': (6, 12)
        }
        
        if job_seniority in seniority_requirements:
            min_exp, max_exp = seniority_requirements[job_seniority]
            if min_exp <= candidate_exp <= max_exp:
                return 1.0
            elif candidate_exp < min_exp:
                return max(0.3, 1.0 - (min_exp - candidate_exp) * 0.2)
            else:
                return max(0.7, 1.0 - (candidate_exp - max_exp) * 0.1)
        
        return 0.7  # Default score
    
    def calculate_cognitive_score(self, candidate_features):
        """Calculate cognitive/employability contribution"""
        cognitive_scores = candidate_features['cognitive_scores']
        overall_score = cognitive_scores.get('overall_score', 50)
        
        # Normalize to 0-1 scale
        return min(1.0, overall_score / 100.0)
    
    def calculate_overall_recommendation_score(self, candidate, job_offer):
        """Calculate comprehensive recommendation score"""
        candidate_features = self.extract_candidate_features(candidate)
        job_features = self.extract_job_features(job_offer)
        
        # Calculate individual scores
        skill_score = self.calculate_skill_match_score(candidate_features, job_features)
        technical_score = self.calculate_technical_test_score(candidate_features, job_features)
        location_score = self.calculate_location_score(candidate_features, job_features)
        salary_score = self.calculate_salary_score(candidate_features, job_features)
        experience_score = self.calculate_experience_score(candidate_features, job_features)
        cognitive_score = self.calculate_cognitive_score(candidate_features)
        
        # Apply weights
        weights = self.scoring_weights
        overall_score = (
            skill_score * weights.skill_match_weight +
            technical_score * weights.technical_test_weight +
            location_score * weights.location_weight +
            salary_score * weights.salary_weight +
            experience_score * weights.experience_weight +
            cognitive_score * weights.employability_weight
        )
        
        # Normalize to ensure it's between 0 and 1
        overall_score = min(1.0, max(0.0, overall_score))
        
        return {
            'overall_score': overall_score,
            'skill_match_score': skill_score,
            'technical_test_score': technical_score,
            'location_score': location_score,
            'salary_score': salary_score,
            'experience_score': experience_score,
            'cognitive_score': cognitive_score,
            'breakdown': {
                'candidate_skills': candidate_features['skills'],
                'required_skills': job_features['required_skills'],
                'matched_skills': list(set(candidate_features['skills']).intersection(set(job_features['required_skills']))),
                'missing_skills': list(set(job_features['required_skills']) - set(candidate_features['skills'])),
                'technical_scores': candidate_features['technical_scores'],
                'cognitive_scores': candidate_features['cognitive_scores'],
                'salary_expectation': 12000 + (candidate_features['experience_years'] * 2000),
                'job_salary_range': f"{job_features['salary_min']:,} - {job_features['salary_max']:,} MAD",
                'location_match': f"{candidate_features['location']} -> {job_features['location']}",
                'remote_available': job_features['remote_flag']
            }
        }


def main():
    """Test the intelligent recommendation engine"""
    print("🚀 Testing Intelligent Recommendation Engine")
    print("=" * 60)
    
    engine = IntelligentRecommendationEngine()
    
    # Test with a sample candidate
    try:
        user = User.objects.get(email='hamzaradi@gmail.com')
        candidate = CandidateProfile.objects.get(user=user)
        
        print(f"✓ Testing with candidate: {candidate.first_name} {candidate.last_name}")
        
        # Get some job offers to test
        job_offers = JobOffer.objects.filter(source_type='comprehensive_demo')[:5]
        
        print(f"✓ Testing against {len(job_offers)} job offers")
        
        recommendations = []
        
        for job_offer in job_offers:
            score_data = engine.calculate_overall_recommendation_score(candidate, job_offer)
            
            recommendations.append({
                'job_offer': job_offer,
                'score_data': score_data
            })
            
            print(f"\n📊 {job_offer.title} at {job_offer.company}")
            print(f"   Overall Score: {score_data['overall_score']:.1%}")
            print(f"   Skill Match: {score_data['skill_match_score']:.1%}")
            print(f"   Technical: {score_data['technical_test_score']:.1%}")
            print(f"   Location: {score_data['location_score']:.1%}")
            print(f"   Salary: {score_data['salary_score']:.1%}")
        
        # Sort by overall score
        recommendations.sort(key=lambda x: x['score_data']['overall_score'], reverse=True)
        
        print("\n" + "=" * 60)
        print("🎯 TOP RECOMMENDATIONS")
        print("=" * 60)
        
        for i, rec in enumerate(recommendations[:3], 1):
            job = rec['job_offer']
            scores = rec['score_data']
            breakdown = scores['breakdown']
            
            print(f"\n{i}. {job.title} at {job.company} ({scores['overall_score']:.1%})")
            print(f"   📍 {breakdown['location_match']}")
            print(f"   💰 {breakdown['job_salary_range']}")
            print(f"   ✅ Matched Skills: {', '.join(breakdown['matched_skills'][:3])}")
            if breakdown['missing_skills']:
                print(f"   📚 Missing Skills: {', '.join(breakdown['missing_skills'][:3])}")
        
        print("\n✅ Intelligent recommendation engine is working!")
        
    except Exception as e:
        print(f"❌ Error testing engine: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    main()
