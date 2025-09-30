#!/usr/bin/env python
"""
Simple demo of the cognitive job recommendation system
"""

import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'careerquest.settings')
django.setup()

from django.contrib.auth.models import User
from django.utils import timezone
from django.db import connection
from recommendation.models import JobOffer, JobRecommendation
from skills.models import Skill, CandidateProfile


def create_simple_data():
    """Create simple test data that works with existing schema"""
    print("🚀 Creating Simple Demo Data")
    print("=" * 40)
    
    # Create skills
    python_skill, _ = Skill.objects.get_or_create(name="Python", defaults={'category': 'programming'})
    js_skill, _ = Skill.objects.get_or_create(name="JavaScript", defaults={'category': 'programming'})
    react_skill, _ = Skill.objects.get_or_create(name="React", defaults={'category': 'frontend'})
    
    print("✓ Created skills")
    
    # Create job offers using Django ORM
    job_offers = []

    job1, created = JobOffer.objects.get_or_create(
        title='Python Developer',
        company='TechCorp',
        defaults={
            'location': 'Casablanca',
            'salary_min': 15000,
            'salary_max': 20000,
            'description': 'Python developer position - Develop Python applications',
            'requirements': 'Python, 3+ years experience',
            'currency': 'MAD',
            'source_type': 'demo'
        }
    )
    if created:
        job1.required_skills.add(python_skill)
    job_offers.append(job1)

    job2, created = JobOffer.objects.get_or_create(
        title='Frontend Developer',
        company='WebStudio',
        defaults={
            'location': 'Rabat',
            'salary_min': 12000,
            'salary_max': 16000,
            'description': 'Frontend developer position - Build user interfaces',
            'requirements': 'JavaScript, React experience',
            'currency': 'MAD',
            'source_type': 'demo'
        }
    )
    if created:
        job2.required_skills.add(js_skill, react_skill)
    job_offers.append(job2)

    job3, created = JobOffer.objects.get_or_create(
        title='Full Stack Developer',
        company='StartupHub',
        defaults={
            'location': 'Casablanca',
            'salary_min': 18000,
            'salary_max': 25000,
            'description': 'Full stack developer - Frontend and backend development',
            'requirements': 'Python, JavaScript, React experience',
            'currency': 'MAD',
            'source_type': 'demo'
        }
    )
    if created:
        job3.required_skills.add(python_skill, js_skill, react_skill)
    job_offers.append(job3)

    print("✓ Created 3 job offers")
    
    # Create test candidates
    user1, created = User.objects.get_or_create(
        username='demo_candidate1',
        defaults={'email': 'demo1@example.com', 'first_name': 'Ahmed', 'last_name': 'Demo'}
    )
    
    profile1, created = CandidateProfile.objects.get_or_create(
        user=user1,
        defaults={
            'first_name': 'Ahmed',
            'last_name': 'Demo',
            'email': 'demo1@example.com',
            'location': 'Casablanca'
        }
    )
    
    if created:
        profile1.skills.add(python_skill)
        print("✓ Created candidate 1: Ahmed (Python)")
    
    user2, created = User.objects.get_or_create(
        username='demo_candidate2',
        defaults={'email': 'demo2@example.com', 'first_name': 'Fatima', 'last_name': 'Demo'}
    )
    
    profile2, created = CandidateProfile.objects.get_or_create(
        user=user2,
        defaults={
            'first_name': 'Fatima',
            'last_name': 'Demo',
            'email': 'demo2@example.com',
            'location': 'Rabat'
        }
    )
    
    if created:
        profile2.skills.add(js_skill, react_skill)
        print("✓ Created candidate 2: Fatima (JavaScript, React)")
    
    return job_offers, [(user1, profile1), (user2, profile2)]


def create_sample_recommendations(job_offers, candidates):
    """Create sample recommendations using Django ORM"""
    print("\n=== Creating Sample Recommendations ===")

    # Clear existing demo recommendations
    JobRecommendation.objects.filter(algorithm_version='demo_v1.0').delete()

    # Sample recommendations data
    recommendations = [
        # Ahmed (Python) -> Python Developer (excellent match)
        {
            'candidate_id': candidates[0][0].id,
            'job_offer_id': job_offers[0].id,
            'overall_score': 0.92,
            'technical_test_score': 0.85,
            'skill_match_score': 0.95,
            'experience_score': 0.80,
            'salary_score': 0.90,
            'location_score': 1.0,
            'cluster_fit_score': 0.88,
            'breakdown': {
                'matched_skills': ['Python'],
                'missing_skills': [],
                'match_reason': 'Perfect skill match for Python developer role'
            }
        },
        # Ahmed (Python) -> Full Stack Developer (good match)
        {
            'candidate_id': candidates[0][0].id,
            'job_offer_id': job_offers[2].id,
            'overall_score': 0.75,
            'technical_test_score': 0.85,
            'skill_match_score': 0.65,  # Only has Python, missing JS/React
            'experience_score': 0.80,
            'salary_score': 0.85,
            'location_score': 1.0,
            'cluster_fit_score': 0.70,
            'breakdown': {
                'matched_skills': ['Python'],
                'missing_skills': ['JavaScript', 'React'],
                'match_reason': 'Has Python skills but missing frontend technologies'
            }
        },
        # Fatima (JS, React) -> Frontend Developer (excellent match)
        {
            'candidate_id': candidates[1][0].id,
            'job_offer_id': job_offers[1].id,
            'overall_score': 0.89,
            'technical_test_score': 0.82,
            'skill_match_score': 0.95,
            'experience_score': 0.75,
            'salary_score': 0.85,
            'location_score': 0.95,  # Rabat to Rabat
            'cluster_fit_score': 0.85,
            'breakdown': {
                'matched_skills': ['JavaScript', 'React'],
                'missing_skills': [],
                'match_reason': 'Perfect match for frontend developer role'
            }
        },
        # Fatima (JS, React) -> Full Stack Developer (very good match)
        {
            'candidate_id': candidates[1][0].id,
            'job_offer_id': job_offers[2].id,
            'overall_score': 0.83,
            'technical_test_score': 0.82,
            'skill_match_score': 0.80,  # Has JS/React, missing Python
            'experience_score': 0.75,
            'salary_score': 0.90,
            'location_score': 1.0,  # Rabat to Casablanca
            'cluster_fit_score': 0.80,
            'breakdown': {
                'matched_skills': ['JavaScript', 'React'],
                'missing_skills': ['Python'],
                'match_reason': 'Strong frontend skills, could learn Python for backend'
            }
        },
    ]
    
    # Create recommendations using Django ORM
    for rec in recommendations:
        job_offer = JobOffer.objects.get(id=rec['job_offer_id'])

        recommendation = JobRecommendation.objects.create(
            candidate_id=rec['candidate_id'],
            job_offer=job_offer,
            overall_score=rec['overall_score'],
            technical_test_score=rec['technical_test_score'],
            skill_match_score=rec['skill_match_score'],
            experience_score=rec['experience_score'],
            salary_score=rec['salary_score'],
            location_score=rec['location_score'],
            cluster_fit_score=rec['cluster_fit_score'],
            breakdown=rec['breakdown'],
            algorithm_version='demo_v1.0',
            computed_at=timezone.now()
        )

        print(f"✓ Created recommendation: Candidate {rec['candidate_id']} -> {job_offer.title} (Score: {rec['overall_score']:.3f})")


def show_results():
    """Show the created recommendations"""
    print("\n=== Recommendation Results ===")
    
    recommendations = JobRecommendation.objects.filter(algorithm_version='demo_v1.0').order_by('-overall_score')
    
    for rec in recommendations:
        candidate = User.objects.get(id=rec.candidate_id)
        print(f"\n🎯 {candidate.first_name} {candidate.last_name} -> {rec.job_offer.title}")
        print(f"   Company: {rec.job_offer.company}")
        print(f"   Overall Score: {rec.overall_score:.1%}")
        print(f"   Technical Test: {rec.technical_test_score:.1%}")
        print(f"   Skill Match: {rec.skill_match_score:.1%}")
        print(f"   Location: {rec.location_score:.1%}")
        
        if rec.breakdown:
            matched = rec.breakdown.get('matched_skills', [])
            missing = rec.breakdown.get('missing_skills', [])
            if matched:
                print(f"   ✅ Matched Skills: {', '.join(matched)}")
            if missing:
                print(f"   ❌ Missing Skills: {', '.join(missing)}")


def main():
    """Run the demo"""
    job_offers, candidates = create_simple_data()
    create_sample_recommendations(job_offers, candidates)
    show_results()
    
    print("\n" + "=" * 60)
    print("✅ Demo completed successfully!")
    print("\n📖 What was created:")
    print("   - 3 job offers (Python, Frontend, Full Stack)")
    print("   - 2 candidates with different skill sets")
    print("   - 4 personalized job recommendations")
    print("\n🔍 Next steps:")
    print("   1. Visit /admin/recommendation/jobrecommendation/ to see the data")
    print("   2. Check the breakdown JSON field for detailed scoring")
    print("   3. Notice how scores vary based on skill matching")
    print("\n💡 Key insights from the demo:")
    print("   - Ahmed (Python) gets 92% match for Python Developer role")
    print("   - Fatima (JS/React) gets 89% match for Frontend Developer")
    print("   - Cross-skill recommendations show lower but still viable scores")
    print("   - Location matching affects the overall recommendation score")


if __name__ == "__main__":
    main()
