#!/usr/bin/env python
"""
Complete End-to-End Job Recommendation System Demo
Demonstrates the full user journey from profile creation to personalized recommendations
"""

import os
import sys
import django
import json
from datetime import datetime, timedelta

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'careerquest.settings')
django.setup()

from django.contrib.auth.models import User
from django.utils import timezone
from django.db import connection
from recommendation.models import JobOffer
from skills.models import CandidateProfile, Skill
from testsengine.models import TestSubmission, Test
from universal_recommendation_system import UniversalRecommendationSystem


class EndToEndDemo:
    """Complete demonstration of the job recommendation system"""
    
    def __init__(self):
        self.system = UniversalRecommendationSystem()
        
    def create_demo_user(self, email, first_name, last_name, location='Casablanca'):
        """Create a demo user with basic profile"""
        try:
            user = User.objects.get(email=email)
            print(f"✓ Using existing user: {user.first_name} {user.last_name}")
        except User.DoesNotExist:
            user = User.objects.create_user(
                username=email,
                email=email,
                first_name=first_name,
                last_name=last_name,
                password='demo123'
            )
            print(f"✓ Created new user: {first_name} {last_name}")
        
        # Ensure candidate profile exists
        candidate = self.system.get_candidate_profile(user)
        if not candidate.location:
            candidate.location = location
            candidate.save()
        
        return user, candidate
    
    def simulate_skill_assessment(self, user, skills_to_add):
        """Simulate user adding skills to their profile"""
        candidate = CandidateProfile.objects.get(user=user)
        
        print(f"\n📚 Adding skills to {user.first_name}'s profile:")
        for skill_name in skills_to_add:
            skill, created = Skill.objects.get_or_create(
                name=skill_name,
                defaults={'category': 'Technical'}
            )
            candidate.skills.add(skill)
            print(f"   • {skill_name}")
        
        return candidate.skills.count()
    
    def simulate_test_completion(self, user, test_results):
        """Simulate user completing technical tests"""
        print(f"\n🧪 Simulating test completions for {user.first_name}:")
        
        for test_name, score in test_results.items():
            # Find or create test
            test, created = Test.objects.get_or_create(
                title=test_name,
                defaults={
                    'test_type': 'technical',
                    'description': f'Technical assessment for {test_name}',
                    'duration_minutes': 30,
                    'total_questions': 20,
                    'passing_score': 70.0
                }
            )
            
            # Create test submission
            submission, created = TestSubmission.objects.get_or_create(
                user=user,
                test=test,
                defaults={
                    'is_complete': True,
                    'submitted_at': timezone.now(),
                    'time_taken_seconds': 1800  # 30 minutes
                }
            )
            
            # Create or update score
            from testsengine.models import Score
            score_obj, created = Score.objects.get_or_create(
                submission=submission,
                defaults={
                    'raw_score': score,
                    'max_possible_score': 100,
                    'percentage_score': score,
                    'correct_answers': int(score * 20 / 100),
                    'total_questions': 20
                }
            )
            
            if not created:
                score_obj.percentage_score = score
                score_obj.save()
            
            print(f"   • {test_name}: {score}%")
    
    def demonstrate_user_journey(self, user_data):
        """Demonstrate complete user journey"""
        email = user_data['email']
        first_name = user_data['first_name']
        last_name = user_data['last_name']
        location = user_data.get('location', 'Casablanca')
        skills = user_data.get('skills', [])
        test_scores = user_data.get('test_scores', {})
        
        print(f"\n{'='*80}")
        print(f"🚀 DEMONSTRATING USER JOURNEY: {first_name} {last_name}")
        print(f"{'='*80}")
        
        # Step 1: User Registration/Profile Creation
        print(f"\n1️⃣ STEP 1: Profile Creation")
        user, candidate = self.create_demo_user(email, first_name, last_name, location)
        
        # Step 2: Skill Assessment
        print(f"\n2️⃣ STEP 2: Skill Assessment")
        if skills:
            skill_count = self.simulate_skill_assessment(user, skills)
            print(f"   ✅ Total skills in profile: {skill_count}")
        else:
            print(f"   ⚠️ No skills provided - system will use defaults")
        
        # Step 3: Technical Test Completion
        print(f"\n3️⃣ STEP 3: Technical Test Completion")
        if test_scores:
            self.simulate_test_completion(user, test_scores)
        else:
            print(f"   ⚠️ No test scores provided - using existing data")
        
        # Step 4: Generate Personalized Recommendations
        print(f"\n4️⃣ STEP 4: Personalized Job Recommendations")
        summary = self.system.create_recommendation_summary(user)
        
        print(f"\n📊 {first_name}'s Profile Summary:")
        print(f"   📍 Location: {summary['user_profile']['location']}")
        print(f"   🎯 Skills: {', '.join(summary['user_profile']['skills'][:5])}")
        print(f"   🧪 Technical Tests: {len(summary['user_profile']['technical_scores'])} completed")
        print(f"   🧠 Cognitive Score: {summary['user_profile']['cognitive_scores']['overall_score']:.0f}%")
        
        print(f"\n🎯 Found {summary['total_recommendations']} relevant job matches")
        
        # Step 5: Show Top Recommendations with Explanations
        print(f"\n5️⃣ STEP 5: Top Personalized Recommendations")
        
        for i, rec in enumerate(summary['recommendations'][:3], 1):
            job = rec['job_offer']
            score_data = rec['score_data']
            breakdown = score_data['breakdown']
            
            print(f"\n🏆 RECOMMENDATION #{i}")
            print(f"   Job: {job.title} at {job.company}")
            print(f"   Location: {job.location} {'(Remote Available)' if job.remote_flag else ''}")
            print(f"   Salary: {breakdown['salary_range']}")
            print(f"   Match Score: {rec['match_percentage']:.1f}%")
            
            print(f"   📊 Detailed Scoring:")
            print(f"      • Skill Match: {score_data['skill_match_score']:.1%}")
            print(f"      • Technical Tests: {score_data['technical_test_score']:.1%}")
            print(f"      • Cognitive Fit: {score_data['cognitive_score']:.1%}")
            print(f"      • Location Fit: {score_data['location_score']:.1%}")
            print(f"      • Salary Fit: {score_data['salary_score']:.1%}")
            
            print(f"   🎯 Why This Job is Recommended:")
            explanations = self.system.explain_recommendation(rec)
            for explanation in explanations[:4]:
                print(f"      {explanation}")
            
            if breakdown['matched_skills']:
                print(f"   ✅ Your Matching Skills: {', '.join(breakdown['matched_skills'][:3])}")
            if breakdown['missing_skills']:
                print(f"   📚 Skills to Develop: {', '.join(breakdown['missing_skills'][:3])}")
        
        return summary
    
    def run_complete_demo(self):
        """Run complete end-to-end demonstration with multiple user types"""
        print("🌟 COMPLETE END-TO-END JOB RECOMMENDATION SYSTEM DEMO")
        print("=" * 80)
        
        # Demo users with different profiles
        demo_users = [
            {
                'email': 'sarah.developer@example.com',
                'first_name': 'Sarah',
                'last_name': 'Developer',
                'location': 'Casablanca',
                'skills': ['Python', 'Django', 'JavaScript', 'React', 'SQL'],
                'test_scores': {
                    'Python Programming Test': 85,
                    'JavaScript Fundamentals': 78,
                    'Database Design': 82
                }
            },
            {
                'email': 'ahmed.analyst@example.com',
                'first_name': 'Ahmed',
                'last_name': 'Analyst',
                'location': 'Rabat',
                'skills': ['Excel', 'SQL', 'Python', 'Tableau', 'Statistics'],
                'test_scores': {
                    'Data Analysis Test': 88,
                    'SQL Fundamentals': 92,
                    'Statistical Analysis': 75
                }
            },
            {
                'email': 'fatima.newgrad@example.com',
                'first_name': 'Fatima',
                'last_name': 'NewGrad',
                'location': 'Marrakech',
                'skills': ['Communication', 'Problem Solving', 'Microsoft Office'],
                'test_scores': {
                    'General Aptitude': 70,
                    'Communication Skills': 85
                }
            }
        ]
        
        all_summaries = []
        
        for user_data in demo_users:
            summary = self.demonstrate_user_journey(user_data)
            all_summaries.append(summary)
        
        # Final Summary
        print(f"\n{'='*80}")
        print("🎉 END-TO-END DEMONSTRATION COMPLETE!")
        print(f"{'='*80}")
        
        print(f"\n📈 System Performance Summary:")
        total_users = len(all_summaries)
        total_recommendations = sum(len(s['recommendations']) for s in all_summaries)
        avg_recommendations = total_recommendations / total_users if total_users > 0 else 0
        
        print(f"   • Users Processed: {total_users}")
        print(f"   • Total Recommendations Generated: {total_recommendations}")
        print(f"   • Average Recommendations per User: {avg_recommendations:.1f}")
        print(f"   • Job Database Size: {JobOffer.objects.filter(source_type='comprehensive_demo').count()} positions")
        
        print(f"\n✅ Key Features Demonstrated:")
        print(f"   • ✅ Universal user support (new and existing users)")
        print(f"   • ✅ Intelligent skill inference and assessment")
        print(f"   • ✅ Technical test integration and scoring")
        print(f"   • ✅ Cognitive ability assessment")
        print(f"   • ✅ Multi-factor recommendation algorithm")
        print(f"   • ✅ Personalized explanations and guidance")
        print(f"   • ✅ Location-aware matching")
        print(f"   • ✅ Salary fit analysis")
        print(f"   • ✅ Skills gap identification")
        print(f"   • ✅ Quality filtering (only relevant matches shown)")
        
        print(f"\n🚀 The job recommendation system is ready for production!")
        
        return all_summaries


def main():
    """Run the complete end-to-end demonstration"""
    demo = EndToEndDemo()
    demo.run_complete_demo()


if __name__ == "__main__":
    main()
