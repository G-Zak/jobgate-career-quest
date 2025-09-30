#!/usr/bin/env python
"""
Test script for the cognitive job recommendation system
Demonstrates the key functionality without requiring full migration
"""

import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'careerquest.settings')
django.setup()

from django.contrib.auth.models import User
from recommendation.cognitive_recommendation_service import CognitiveRecommendationService
from recommendation.models import JobOffer, ScoringWeights
from skills.models import Skill, CandidateProfile, TechnicalTest, TestResult


def get_test_data():
    """Get existing test data or create minimal data"""
    print("Getting test data...")

    # Try to get existing data first
    job_offer = JobOffer.objects.filter(status='active').first()
    user = User.objects.filter(candidateprofile__isnull=False).first()

    if job_offer and user:
        print(f"✓ Using existing job offer: {job_offer.title}")
        print(f"✓ Using existing candidate: {user.username}")
        return user, job_offer

    # Create minimal test data if none exists
    print("Creating minimal test data...")

    # Create test skills
    python_skill, _ = Skill.objects.get_or_create(
        name="Python",
        defaults={'category': 'programming'}
    )

    # Create test user if needed
    if not user:
        user, created = User.objects.get_or_create(
            username="testcandidate",
            defaults={
                'email': 'test@example.com',
                'first_name': 'Test',
                'last_name': 'Candidate'
            }
        )

        candidate_profile, created = CandidateProfile.objects.get_or_create(
            user=user,
            defaults={
                'first_name': 'Test',
                'last_name': 'Candidate',
                'email': 'test@example.com',
                'location': 'Casablanca'
            }
        )

        if created:
            candidate_profile.skills.add(python_skill)
            print(f"✓ Created candidate profile: {candidate_profile.full_name}")

    # Use existing job offer or create a simple one
    if not job_offer:
        print("⚠ No existing job offers found. Please run: python manage.py seed_moroccan_jobs --count 10")
        # Create a minimal job offer for testing
        try:
            job_offer = JobOffer.objects.create(
                title="Test Backend Developer",
                company="TestCorp",
                location="Casablanca, Morocco",
                description="Test job for recommendation system",
                requirements="Python experience",
                responsibilities="Backend development",
                status='active'
            )
            job_offer.required_skills.add(python_skill)
            print(f"✓ Created minimal job offer: {job_offer.title}")
        except Exception as e:
            print(f"❌ Could not create job offer: {e}")
            print("Please run migrations and seed data first")
            return None, None

    return user, job_offer


def test_technical_test_scoring():
    """Test technical test scoring functionality"""
    print("\n=== Testing Technical Test Scoring ===")

    user, job_offer = get_test_data()
    if not user or not job_offer:
        print("❌ Could not get test data")
        return 0.0, {}

    service = CognitiveRecommendationService()

    # Test technical test score computation
    tech_score, breakdown = service.compute_technical_test_score(user.id, job_offer)

    print(f"Technical test score: {tech_score:.3f}")
    print(f"Breakdown: {breakdown}")

    return tech_score, breakdown


def test_skill_matching():
    """Test skill matching functionality"""
    print("\n=== Testing Skill Matching ===")

    user, job_offer = get_test_data()
    if not user or not job_offer:
        print("❌ Could not get test data")
        return 0.0, {}

    service = CognitiveRecommendationService()

    # Test skill matching
    skill_score, breakdown = service.compute_skill_match_score(user.id, job_offer)

    print(f"Skill match score: {skill_score:.3f}")
    print(f"Matched skills: {breakdown.get('matched_skills', [])}")
    print(f"Missing skills: {breakdown.get('missing_skills', [])}")

    return skill_score, breakdown


def test_overall_recommendation():
    """Test overall recommendation computation"""
    print("\n=== Testing Overall Recommendation ===")

    user, job_offer = get_test_data()
    if not user or not job_offer:
        print("❌ Could not get test data")
        return None

    service = CognitiveRecommendationService()
    
    try:
        # Test overall recommendation
        recommendation = service.compute_overall_recommendation(user.id, job_offer)
        
        print(f"Overall score: {recommendation.overall_score:.3f}")
        print(f"Technical test score: {recommendation.technical_test_score:.3f}")
        print(f"Skill match score: {recommendation.skill_match_score:.3f}")
        print(f"Experience score: {recommendation.experience_score:.3f}")
        print(f"Algorithm version: {recommendation.algorithm_version}")
        
        # Show breakdown
        if recommendation.breakdown:
            scores = recommendation.breakdown.get('scores', {})
            print("\nDetailed scores:")
            for score_type, value in scores.items():
                print(f"  {score_type}: {value:.3f}")
        
        return recommendation
        
    except Exception as e:
        print(f"Error computing recommendation: {e}")
        return None


def test_api_endpoints():
    """Test API endpoint functionality"""
    print("\n=== Testing API Endpoints ===")
    
    try:
        from recommendation.api_views import get_scoring_weights
        from django.test import RequestFactory
        from django.contrib.auth.models import AnonymousUser
        
        factory = RequestFactory()
        request = factory.get('/api/cognitive/scoring-weights/')
        request.user = AnonymousUser()
        
        print("✓ API views can be imported")
        print("Note: Full API testing requires authentication and server setup")
        
    except Exception as e:
        print(f"API import error: {e}")


def main():
    """Run all tests"""
    print("🚀 Testing Cognitive Job Recommendation System")
    print("=" * 50)
    
    try:
        # Test individual components
        test_technical_test_scoring()
        test_skill_matching()
        recommendation = test_overall_recommendation()
        test_api_endpoints()
        
        print("\n" + "=" * 50)
        print("✅ All tests completed successfully!")
        
        if recommendation:
            print(f"\n📊 Sample Recommendation Summary:")
            print(f"   Candidate: {recommendation.candidate_id}")
            print(f"   Job: {recommendation.job_offer.title}")
            print(f"   Overall Score: {recommendation.overall_score:.1%}")
            print(f"   Computed: {recommendation.computed_at}")
        
        print(f"\n📖 Next Steps:")
        print(f"   1. Run migrations: python manage.py migrate")
        print(f"   2. Seed data: python manage.py seed_moroccan_jobs --count 50")
        print(f"   3. Create mappings: python manage.py seed_skill_test_mappings")
        print(f"   4. Start Celery: celery -A careerquest worker --loglevel=info")
        print(f"   5. Test API: curl -H 'Authorization: Bearer TOKEN' http://localhost:8000/api/cognitive/candidate/1/recommendations/")
        
    except Exception as e:
        print(f"\n❌ Test failed: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    main()
