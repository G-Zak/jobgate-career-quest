#!/usr/bin/env python
"""
Test script for the Employability Scoring System
Run this to verify the scoring system works correctly
"""

import os
import sys
import django

# Setup Django environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'careerquest.settings')
django.setup()

from testsengine.employability_scoring import EmployabilityScorer, EmployabilityCategories, ProfileWeights
from testsengine.models import Test, TestSession
from django.contrib.auth import get_user_model

def test_employability_categories():
    """Test the category mapping system"""
    print("=== Testing Employability Categories ===")
    
    # Test category mapping
    categories = EmployabilityCategories()
    
    print("Test Type -> Category Mappings:")
    for test_type, category in categories.TEST_CATEGORY_MAPPING.items():
        print(f"  {test_type} -> {category}")
    
    print(f"\nAvailable Categories: {categories.get_all_categories()}")
    
    # Test specific mappings
    assert categories.get_category_for_test_type('verbal_reasoning') == 'cognitive'
    assert categories.get_category_for_test_type('technical') == 'technical'
    assert categories.get_category_for_test_type('situational_judgment') == 'situational'
    
    print("✅ Category mapping tests passed!")

def test_profile_weights():
    """Test the profile weighting system"""
    print("\n=== Testing Profile Weights ===")
    
    weights = ProfileWeights()
    
    print("Available Profiles:")
    for profile in weights.get_available_profiles():
        profile_weights = weights.get_weights_for_profile(profile)
        print(f"  {profile}:")
        for category, weight in profile_weights.items():
            print(f"    {category}: {weight}")
        
        # Verify weights sum to 1.0
        total_weight = sum(profile_weights.values())
        assert abs(total_weight - 1.0) < 0.01, f"Weights for {profile} don't sum to 1.0: {total_weight}"
    
    print("✅ Profile weight tests passed!")

def test_employability_scorer():
    """Test the employability scorer with mock data"""
    print("\n=== Testing Employability Scorer ===")
    
    # Get or create a test user
    User = get_user_model()
    test_user, created = User.objects.get_or_create(
        username='test_employability_user',
        defaults={
            'email': 'test@example.com',
            'first_name': 'Test',
            'last_name': 'User'
        }
    )
    
    if created:
        print(f"Created test user: {test_user.username}")
    else:
        print(f"Using existing test user: {test_user.username}")
    
    # Initialize scorer
    scorer = EmployabilityScorer(test_user)
    
    # Test category score calculation
    category_scores = scorer.calculate_category_scores()
    print(f"Category Scores: {category_scores}")
    
    # Test overall score calculation
    overall_data = scorer.calculate_overall_score()
    print(f"Overall Score Data: {overall_data}")
    
    # Test with different profiles
    for profile in ['Software Engineer', 'Data Scientist', 'Product Manager']:
        profile_data = scorer.calculate_overall_score(profile)
        print(f"{profile} Score: {profile_data['overall_score']}")
    
    print("✅ Employability scorer tests passed!")

def test_api_response_structure():
    """Test that the API response has the expected structure"""
    print("\n=== Testing API Response Structure ===")
    
    # Get or create a test user
    User = get_user_model()
    test_user, _ = User.objects.get_or_create(
        username='test_api_user',
        defaults={
            'email': 'testapi@example.com',
            'first_name': 'API',
            'last_name': 'Test'
        }
    )
    
    scorer = EmployabilityScorer(test_user)
    response_data = scorer.calculate_overall_score('Software Engineer')
    
    # Check required fields
    required_fields = [
        'overall_score', 'categories', 'total_tests_completed', 
        'improvement_trend', 'score_interpretation', 'recommendations'
    ]
    
    for field in required_fields:
        assert field in response_data, f"Missing required field: {field}"
        print(f"✅ {field}: {type(response_data[field])}")
    
    # Check score interpretation structure
    interpretation = response_data['score_interpretation']
    interpretation_fields = ['level', 'description', 'market_position', 'color']
    for field in interpretation_fields:
        assert field in interpretation, f"Missing interpretation field: {field}"
    
    print("✅ API response structure tests passed!")

if __name__ == '__main__':
    print("🚀 Starting Employability Scoring System Tests\n")
    
    try:
        test_employability_categories()
        test_profile_weights()
        test_employability_scorer()
        test_api_response_structure()
        
        print("\n🎉 All tests passed! The Employability Scoring System is working correctly.")
        
    except Exception as e:
        print(f"\n❌ Test failed with error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
