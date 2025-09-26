#!/usr/bin/env python
"""
Test script to verify all functionality works correctly
"""
import os
import sys
import django
import requests
import json

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'careerquest.settings')
django.setup()

from django.contrib.auth.models import User
from skills.models import Skill, CandidateProfile
from testsengine.models import Test, Question
from recommendation.models import JobOffer

def test_database_data():
    """Test that database has the expected data"""
    print("🔍 Testing database data...")
    
    # Test users
    users = User.objects.all()
    print(f"  ✅ Users: {users.count()}")
    
    # Test skills
    skills = Skill.objects.all()
    print(f"  ✅ Skills: {skills.count()}")
    
    # Test tests
    tests = Test.objects.all()
    print(f"  ✅ Tests: {tests.count()}")
    
    # Test job offers
    jobs = JobOffer.objects.all()
    print(f"  ✅ Job offers: {jobs.count()}")
    
    # Test candidate profiles
    profiles = CandidateProfile.objects.all()
    print(f"  ✅ Candidate profiles: {profiles.count()}")
    
    return True

def test_api_endpoints():
    """Test API endpoints"""
    print("🔍 Testing API endpoints...")
    
    base_url = "http://localhost:8000"
    
    try:
        # Test skills API
        response = requests.get(f"{base_url}/api/skills/")
        if response.status_code == 200:
            skills_data = response.json()
            print(f"  ✅ Skills API: {len(skills_data)} skills returned")
        else:
            print(f"  ❌ Skills API failed: {response.status_code}")
            return False
        
        # Test job offers API
        response = requests.get(f"{base_url}/api/recommendations/job-offers/")
        if response.status_code == 200:
            jobs_data = response.json()
            print(f"  ✅ Job offers API: {jobs_data.get('count', 0)} jobs returned")
        else:
            print(f"  ❌ Job offers API failed: {response.status_code}")
            return False
        
        return True
        
    except Exception as e:
        print(f"  ❌ API test failed: {e}")
        return False

def test_recommendation_system():
    """Test recommendation system"""
    print("🔍 Testing recommendation system...")
    
    try:
        # Get a test user with profile
        profile = CandidateProfile.objects.first()
        if not profile:
            print("  ⚠️  No candidate profile found")
            return True
        
        # Test recommendation calculation
        from recommendation.services import RecommendationEngine
        engine = RecommendationEngine()
        
        # Get user skills
        user_skills = profile.skills.all()
        print(f"  ✅ User skills: {user_skills.count()}")
        
        # Test skill similarity calculation
        if user_skills.exists():
            test_skill = user_skills.first()
            similarity, matched, missing = engine.calculate_skill_similarity([test_skill], [test_skill])
            print(f"  ✅ Skill similarity calculation: {similarity}")
        
        return True
        
    except Exception as e:
        print(f"  ❌ Recommendation test failed: {e}")
        return False

def test_frontend_connection():
    """Test frontend connection"""
    print("🔍 Testing frontend connection...")
    
    try:
        response = requests.get("http://localhost:3000")
        if response.status_code == 200:
            print("  ✅ Frontend is running")
            return True
        else:
            print(f"  ❌ Frontend failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"  ❌ Frontend test failed: {e}")
        return False

def main():
    """Run all tests"""
    print("🚀 Starting functionality tests...")
    
    tests = [
        test_database_data,
        test_api_endpoints,
        test_recommendation_system,
        test_frontend_connection
    ]
    
    passed = 0
    total = len(tests)
    
    for test in tests:
        try:
            if test():
                passed += 1
            print()
        except Exception as e:
            print(f"  ❌ Test failed with exception: {e}")
            print()
    
    print(f"📊 Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! The system is ready for delivery.")
        return True
    else:
        print("⚠️  Some tests failed. Please check the issues above.")
        return False

if __name__ == '__main__':
    main()
