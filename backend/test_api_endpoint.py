#!/usr/bin/env python
"""
Test the actual API endpoint for numerical reasoning test submission
"""
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'careerquest.settings')
django.setup()

from django.test import TestCase, Client
from django.contrib.auth.models import User
from django.urls import reverse
from testsengine.models import Test, TestSubmission
import json

def test_numerical_reasoning_api():
    """Test the actual API endpoint"""
    
    print("🔍 TESTING NUMERICAL REASONING API ENDPOINT")
    print("=" * 55)
    
    # Create test client and user
    client = Client()
    user = User.objects.create_user(
        username='api_test_user',
        email='api@test.com',
        password='testpass123'
    )
    
    # Login
    client.login(username='api_test_user', password='testpass123')
    
    # Get numerical reasoning test
    test = Test.objects.get(id=21)
    print(f"Test: {test.title} ({test.test_type})")
    
    # Clean up any existing submissions
    TestSubmission.objects.filter(user=user, test=test).delete()
    
    # Get first 3 questions for testing
    questions = test.questions.all()[:3]
    answers_data = {}
    
    print(f"\nPreparing submission for {len(questions)} questions:")
    for q in questions:
        answers_data[str(q.id)] = q.correct_answer
        print(f"  Q{q.order}: {q.question_text[:50]}... -> {q.correct_answer}")
    
    # Prepare request data
    request_data = {
        'answers': answers_data,
        'time_taken_seconds': 300,
        'submission_metadata': {
            'browser': 'Chrome',
            'testType': 'numerical_reasoning',
            'device': 'Desktop'
        }
    }
    
    print(f"\n📤 Submitting to API endpoint...")
    print(f"URL: /api/tests/{test.id}/submit/")
    print(f"Data: {json.dumps(request_data, indent=2)}")
    
    # Make API request
    response = client.post(
        f'/api/tests/{test.id}/submit/',
        data=json.dumps(request_data),
        content_type='application/json'
    )
    
    print(f"\n📥 API Response:")
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 201:
        response_data = response.json()
        print(f"✅ Success! Response data:")
        print(f"  Message: {response_data['message']}")
        print(f"  Submission ID: {response_data['submission_id']}")
        
        score_data = response_data['score']
        print(f"  Score Details:")
        print(f"    Raw Score: {score_data['raw_score']}")
        print(f"    Max Possible: {score_data['max_possible_score']}")
        print(f"    Percentage: {score_data['percentage_score']}%")
        print(f"    Grade: {score_data['grade_letter']}")
        print(f"    Passed: {score_data['passed']}")
        print(f"    Correct: {score_data['correct_answers']}/{score_data['total_questions']}")
        
        # Verify the fix worked
        expected_raw_score = sum(q.scoring_coefficient for q in questions)
        expected_max_score = expected_raw_score  # Same since all correct
        expected_percentage = 100.0
        
        assert float(score_data['raw_score']) == expected_raw_score, f"Raw score mismatch"
        assert float(score_data['max_possible_score']) == expected_max_score, f"Max score mismatch"
        assert float(score_data['percentage_score']) == expected_percentage, f"Percentage mismatch"
        
        print(f"\n✅ All assertions passed! API endpoint is working correctly.")
        
        # Test with numeric answers (if the test supports them)
        print(f"\n📝 Testing with numeric answers...")
        TestSubmission.objects.filter(user=user, test=test).delete()
        
        # Try submitting numeric answers (this should work for numerical reasoning)
        numeric_request_data = {
            'answers': {
                str(questions[0].id): '42',      # Numeric answer
                str(questions[1].id): '3.14',    # Decimal answer
                str(questions[2].id): questions[2].correct_answer  # Letter answer
            },
            'time_taken_seconds': 300,
            'submission_metadata': {
                'browser': 'Chrome',
                'testType': 'numerical_reasoning'
            }
        }
        
        response = client.post(
            f'/api/tests/{test.id}/submit/',
            data=json.dumps(numeric_request_data),
            content_type='application/json'
        )
        
        print(f"Numeric answers response: {response.status_code}")
        if response.status_code == 201:
            print(f"✅ Numeric answers accepted successfully!")
        elif response.status_code == 400:
            response_data = response.json()
            print(f"⚠️ Numeric answers rejected (expected for MCQ): {response_data.get('error', 'Unknown error')}")
        else:
            print(f"❌ Unexpected response: {response.status_code}")
            print(f"Response: {response.json()}")
        
    else:
        print(f"❌ API request failed!")
        try:
            error_data = response.json()
            print(f"Error: {error_data}")
        except:
            print(f"Response content: {response.content}")
        return False
    
    print(f"\n✅ API endpoint test completed successfully!")
    return True

if __name__ == "__main__":
    test_numerical_reasoning_api()
