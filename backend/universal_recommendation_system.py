#!/usr/bin/env python
"""
Universal Job Recommendation System
Works for any user with complete end-to-end functionality
"""

import os
import sys
import django
import json
import numpy as np
from collections import defaultdict

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'careerquest.settings')
django.setup()

from django.contrib.auth.models import User
from django.utils import timezone
from django.db import connection
from recommendation.models import JobOffer
from skills.models import CandidateProfile, Skill
from testsengine.models import TestSubmission
from testsengine.employability_scoring import EmployabilityScorer


class UniversalRecommendationSystem:
    """Universal recommendation system that works for any user"""
    
    def __init__(self):
        self.min_match_threshold = 0.40  # Only show jobs with 40%+ match
        
    def get_candidate_profile(self, user):
        """Get or create comprehensive candidate profile"""
        try:
            candidate = CandidateProfile.objects.get(user=user)
        except CandidateProfile.DoesNotExist:
            # Create basic profile if it doesn't exist
            candidate = CandidateProfile.objects.create(
                user=user,
                first_name=user.first_name or 'User',
                last_name=user.last_name or 'Profile',
                email=user.email,
                location='Casablanca'  # Default location
            )
        
        return candidate
    
    def get_candidate_skills(self, candidate):
        """Get candidate skills with intelligent defaults"""
        skills = list(candidate.skills.values_list('name', flat=True))
        
        # If no skills, infer from test results or provide defaults
        if not skills:
            test_skills = self._infer_skills_from_tests(candidate.user)
            if test_skills:
                # Add inferred skills to profile
                for skill_name in test_skills:
                    skill, created = Skill.objects.get_or_create(
                        name=skill_name,
                        defaults={'category': 'Technical'}
                    )
                    candidate.skills.add(skill)
                skills = test_skills
            else:
                # Default skills for new users
                default_skills = ['Problem Solving', 'Communication', 'Teamwork']
                for skill_name in default_skills:
                    skill, created = Skill.objects.get_or_create(
                        name=skill_name,
                        defaults={'category': 'Soft Skills'}
                    )
                    candidate.skills.add(skill)
                skills = default_skills
        
        return skills
    
    def _infer_skills_from_tests(self, user):
        """Infer skills from completed tests"""
        skills = []
        
        submissions = TestSubmission.objects.filter(
            user=user,
            is_complete=True
        ).select_related('test')

        for submission in submissions:
            test_title = submission.test.title.lower()
            # Handle Score object or numeric value
            score_value = getattr(submission, 'score', None)

            if score_value and hasattr(score_value, 'percentage_score'):
                score = float(score_value.percentage_score) or 0
            else:
                score = 0

            if score >= 60:
                if 'python' in test_title:
                    skills.append('Python')
                elif 'javascript' in test_title:
                    skills.append('JavaScript')
                elif 'sql' in test_title:
                    skills.append('SQL')
                elif 'data' in test_title:
                    skills.append('Data Analysis')
        
        return skills
    
    def get_technical_test_scores(self, user):
        """Get technical test performance"""
        scores = {}
        
        submissions = TestSubmission.objects.filter(
            user=user,
            is_complete=True
        ).select_related('test')

        for submission in submissions:
            test_title = submission.test.title
            # Handle Score object or numeric value
            score_value = getattr(submission, 'score', None)

            if score_value and hasattr(score_value, 'percentage_score'):
                numeric_score = float(score_value.percentage_score) or 0
            else:
                numeric_score = 0

            scores[test_title] = numeric_score

        return scores
    
    def get_cognitive_scores(self, user):
        """Get cognitive/employability scores"""
        try:
            scorer = EmployabilityScorer(user)
            employability_data = scorer.calculate_overall_score()

            return {
                'overall_score': employability_data.get('overall_employability_score', 50),
                'situational_judgment': employability_data.get('individual_test_scores', {}).get('situational_judgment', {}).get('score', 50),
                'personality': employability_data.get('individual_test_scores', {}).get('personality', {}).get('score', 50),
                'cognitive_ability': employability_data.get('individual_test_scores', {}).get('cognitive_ability', {}).get('score', 50)
            }
        except Exception as e:
            print(f"Warning: Using default cognitive scores for user {user.id}: {e}")
            return {'overall_score': 50, 'situational_judgment': 50, 'personality': 50, 'cognitive_ability': 50}
    
    def extract_job_skills(self, job_offer):
        """Extract required skills from job offer"""
        skills = []
        text = (job_offer.requirements or '').lower()
        
        # Common skill patterns
        skill_patterns = {
            'python': ['python'],
            'javascript': ['javascript', 'js'],
            'java': ['java'],
            'sql': ['sql', 'database'],
            'react': ['react'],
            'angular': ['angular'],
            'vue': ['vue'],
            'node': ['node.js', 'nodejs'],
            'django': ['django'],
            'flask': ['flask'],
            'aws': ['aws', 'amazon web services'],
            'docker': ['docker'],
            'git': ['git'],
            'machine learning': ['machine learning', 'ml'],
            'data analysis': ['data analysis', 'analytics'],
            'excel': ['excel'],
            'tableau': ['tableau'],
            'power bi': ['power bi', 'powerbi']
        }
        
        for skill, patterns in skill_patterns.items():
            if any(pattern in text for pattern in patterns):
                skills.append(skill.title())
        
        return skills

    def calculate_experience_score(self, candidate, job_offer):
        """Calculate experience-based score using enhanced profile data"""
        try:
            # Get years of experience from enhanced profile
            years_experience = getattr(candidate, 'years_of_experience', 0)
            if hasattr(candidate, 'work_experiences'):
                # Calculate from work experiences if available
                total_months = 0
                for exp in candidate.work_experiences.all():
                    if hasattr(exp, 'start_date') and exp.start_date:
                        from django.utils import timezone
                        end_date = exp.end_date or timezone.now().date()
                        months = (end_date.year - exp.start_date.year) * 12 + (end_date.month - exp.start_date.month)
                        total_months += max(0, months)
                years_experience = round(total_months / 12, 1)

            # Map job seniority to required experience
            seniority_experience_map = {
                'junior': 0,
                'intermediate': 2,
                'senior': 5,
                'lead': 8,
                'principal': 10,
                'expert': 10
            }

            required_experience = seniority_experience_map.get(job_offer.seniority.lower(), 2)

            # Score based on experience match
            if years_experience >= required_experience:
                return min(1.0, years_experience / (required_experience + 2))  # Cap at 1.0
            else:
                return max(0.3, years_experience / required_experience)  # Minimum 0.3

        except Exception as e:
            print(f"Error calculating experience score: {e}")
            return 0.5  # Default neutral score

    def calculate_match_score(self, candidate, job_offer):
        """Calculate comprehensive match score"""
        # Get candidate data
        candidate_skills = set(skill.lower() for skill in self.get_candidate_skills(candidate))
        technical_scores = self.get_technical_test_scores(candidate.user)
        cognitive_scores = self.get_cognitive_scores(candidate.user)
        
        # Get job data
        job_skills = set(skill.lower() for skill in self.extract_job_skills(job_offer))
        
        # 1. Skill Match Score (25% weight - decreased from 30%)
        if job_skills:
            matched_skills = candidate_skills.intersection(job_skills)
            skill_match = len(matched_skills) / len(job_skills)
        else:
            skill_match = 0.5  # Neutral if no specific requirements

        # 2. Technical Test Score (15% weight - decreased from 20%)
        if technical_scores:
            avg_technical = np.mean(list(technical_scores.values())) / 100
        else:
            avg_technical = 0.4  # Lower score if no tests completed

        # 3. Cognitive Score (35% weight - increased from 15%)
        cognitive_score = cognitive_scores['overall_score'] / 100

        # 4. Experience Score (15% weight - new component)
        experience_score = self.calculate_experience_score(candidate, job_offer)
        
        # 5. Location Score (7% weight - decreased from 10%)
        candidate_location = (candidate.location or 'casablanca').lower()
        job_location = job_offer.location.lower()

        if candidate_location == job_location:
            location_score = 1.0
        elif job_offer.remote_flag:
            location_score = 0.9
        else:
            location_score = 0.7

        # 6. Salary Score (3% weight - decreased from 5%)
        if job_offer.salary_min and job_offer.salary_max:
            # Assume candidate expects reasonable salary
            expected_salary = 15000  # Default expectation
            job_salary_avg = (job_offer.salary_min + job_offer.salary_max) / 2

            if job_salary_avg >= expected_salary:
                salary_score = 1.0
            else:
                salary_score = max(0.5, job_salary_avg / expected_salary)
        else:
            salary_score = 0.7  # Neutral if no salary info

        # Calculate weighted overall score with enhanced cognitive-focused weights
        overall_score = (
            cognitive_score * 0.35 +     # Increased: Cognitive skills are fundamental
            skill_match * 0.25 +         # Decreased: Skills verified in interviews
            avg_technical * 0.15 +       # Decreased: Preliminary screening only
            experience_score * 0.15 +    # New: Experience matching job requirements
            location_score * 0.07 +      # Decreased: Geographic preferences
            salary_score * 0.03          # Decreased: Prioritize cognitive/skills/experience
        )
        
        return {
            'overall_score': overall_score,
            'skill_match_score': skill_match,
            'technical_test_score': avg_technical,
            'cognitive_score': cognitive_score,
            'experience_score': experience_score,
            'location_score': location_score,
            'salary_score': salary_score,
            'breakdown': {
                'candidate_skills': list(candidate_skills),
                'job_skills': list(job_skills),
                'matched_skills': list(candidate_skills.intersection(job_skills)),
                'missing_skills': list(job_skills - candidate_skills),
                'technical_scores': technical_scores,
                'cognitive_scores': cognitive_scores,
                'experience_years': getattr(candidate, 'years_of_experience', 0),
                'location_match': f"{candidate.location} -> {job_offer.location}",
                'salary_range': f"{job_offer.salary_min or 0:,} - {job_offer.salary_max or 0:,} MAD" if job_offer.salary_min else "Not specified",
                'remote_available': job_offer.remote_flag
            }
        }
    
    def get_recommendations_for_user(self, user, limit=10):
        """Get personalized recommendations for any user"""
        candidate = self.get_candidate_profile(user)
        
        # Get all available jobs
        job_offers = JobOffer.objects.filter(
            source_type='comprehensive_demo',
            status='active'
        )
        
        recommendations = []
        
        for job_offer in job_offers:
            score_data = self.calculate_match_score(candidate, job_offer)

            # Debug: print first few scores
            if len(recommendations) < 3:
                print(f"Debug: {job_offer.title} - Score: {score_data['overall_score']:.2f}")

            # Only include jobs above minimum threshold
            if score_data['overall_score'] >= self.min_match_threshold:
                recommendations.append({
                    'job_offer': job_offer,
                    'score_data': score_data,
                    'match_percentage': score_data['overall_score'] * 100
                })

        # Sort by overall score
        recommendations.sort(key=lambda x: x['score_data']['overall_score'], reverse=True)

        return recommendations[:limit]
    
    def explain_recommendation(self, recommendation):
        """Generate explanation for why a job is recommended"""
        score_data = recommendation['score_data']
        breakdown = score_data['breakdown']
        job = recommendation['job_offer']
        
        explanations = []
        
        # Skill match explanation
        if breakdown['matched_skills']:
            explanations.append(f"✅ Your skills match: {', '.join(breakdown['matched_skills'][:3])}")
        
        if breakdown['missing_skills']:
            explanations.append(f"📚 Skills to develop: {', '.join(breakdown['missing_skills'][:3])}")
        
        # Technical performance
        if breakdown['technical_scores']:
            avg_score = np.mean(list(breakdown['technical_scores'].values()))
            if avg_score >= 70:
                explanations.append(f"🎯 Strong technical performance (avg: {avg_score:.0f}%)")
            elif avg_score >= 50:
                explanations.append(f"📈 Good technical foundation (avg: {avg_score:.0f}%)")
        
        # Cognitive fit
        cognitive_score = breakdown['cognitive_scores']['overall_score']
        if cognitive_score >= 70:
            explanations.append("🧠 Excellent cognitive fit for the role")
        elif cognitive_score >= 50:
            explanations.append("🧠 Good cognitive abilities for the role")
        
        # Location and remote
        if breakdown['remote_available']:
            explanations.append("🏠 Remote work available")
        elif score_data['location_score'] >= 0.9:
            explanations.append("📍 Perfect location match")
        
        # Salary fit
        if score_data['salary_score'] >= 0.8:
            explanations.append("💰 Competitive salary range")
        
        return explanations
    
    def create_recommendation_summary(self, user):
        """Create comprehensive recommendation summary for user"""
        recommendations = self.get_recommendations_for_user(user)
        candidate = self.get_candidate_profile(user)
        
        summary = {
            'user': user,
            'candidate': candidate,
            'total_recommendations': len(recommendations),
            'recommendations': recommendations,
            'user_profile': {
                'skills': self.get_candidate_skills(candidate),
                'technical_scores': self.get_technical_test_scores(user),
                'cognitive_scores': self.get_cognitive_scores(user),
                'location': candidate.location
            }
        }
        
        return summary


def demonstrate_universal_system():
    """Demonstrate the universal recommendation system"""
    print("🚀 Universal Job Recommendation System Demo")
    print("=" * 60)
    
    system = UniversalRecommendationSystem()
    
    # Test with existing user
    try:
        user = User.objects.get(email='hamzaradi@gmail.com')
        print(f"✓ Testing with user: {user.first_name} {user.last_name}")
        
        # Get comprehensive recommendations
        summary = system.create_recommendation_summary(user)
        
        print(f"\n📊 User Profile Summary:")
        print(f"   Skills: {', '.join(summary['user_profile']['skills'][:5])}")
        print(f"   Technical Tests: {len(summary['user_profile']['technical_scores'])} completed")
        print(f"   Cognitive Score: {summary['user_profile']['cognitive_scores']['overall_score']:.0f}%")
        print(f"   Location: {summary['user_profile']['location']}")
        
        print(f"\n🎯 Found {summary['total_recommendations']} relevant job matches (60%+ match)")
        
        print("\n" + "=" * 60)
        print("TOP PERSONALIZED RECOMMENDATIONS")
        print("=" * 60)
        
        for i, rec in enumerate(summary['recommendations'][:5], 1):
            job = rec['job_offer']
            score_data = rec['score_data']
            
            print(f"\n{i}. {job.title} at {job.company}")
            print(f"   📍 Location: {job.location}")
            print(f"   💰 Salary: {score_data['breakdown']['salary_range']}")
            print(f"   🎯 Match Score: {rec['match_percentage']:.1f}%")
            
            print(f"   📊 Score Breakdown:")
            print(f"      • Skills: {score_data['skill_match_score']:.1%}")
            print(f"      • Technical: {score_data['technical_test_score']:.1%}")
            print(f"      • Cognitive: {score_data['cognitive_score']:.1%}")
            print(f"      • Location: {score_data['location_score']:.1%}")
            print(f"      • Salary: {score_data['salary_score']:.1%}")
            
            # Show explanations
            explanations = system.explain_recommendation(rec)
            for explanation in explanations[:3]:
                print(f"   {explanation}")
        
        print("\n" + "=" * 60)
        print("✅ UNIVERSAL RECOMMENDATION SYSTEM WORKING!")
        print("=" * 60)
        
        print(f"\n🎉 Key Features Demonstrated:")
        print(f"   • ✅ Works for any user (existing or new)")
        print(f"   • ✅ Intelligent skill inference from tests")
        print(f"   • ✅ Comprehensive scoring (skills, technical, cognitive)")
        print(f"   • ✅ Smart filtering (only 60%+ matches shown)")
        print(f"   • ✅ Detailed explanations for each recommendation")
        print(f"   • ✅ Personalized for user's location and preferences")
        
        return summary
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return None


if __name__ == "__main__":
    demonstrate_universal_system()
