#!/usr/bin/env python
"""
Test LRT1 API endpoint functionality
"""
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'careerquest.settings')
django.setup()

from django.test import Client
from django.contrib.auth.models import User
from testsengine.models import Test, TestSubmission
import json
import random

def test_lrt1_api_endpoint():
    """Test the LRT1 API endpoint"""
    
    print("🔍 TESTING LRT1 API ENDPOINT")
    print("=" * 50)
    
    # Create test client and user
    client = Client()
    user = User.objects.create_user(
        username='lrt1_api_user',
        email='lrt1api@test.com',
        password='testpass123'
    )
    
    # Login
    client.login(username='lrt1_api_user', password='testpass123')
    
    # Get LRT1 test
    lrt1 = Test.objects.get(id=13)
    print(f"Test: {lrt1.title}")
    print(f"Questions: {lrt1.questions.count()}")
    
    # Clean up any existing submissions
    TestSubmission.objects.filter(user=user, test=lrt1).delete()
    
    # Test 1: Submit with mixed difficulty questions
    print(f"\n📝 Test 1: Mixed difficulty submission")
    
    # Select questions from different difficulties
    easy_questions = list(lrt1.questions.filter(difficulty_level='easy')[:3])
    medium_questions = list(lrt1.questions.filter(difficulty_level='medium')[:3])
    hard_questions = list(lrt1.questions.filter(difficulty_level='hard')[:3])
    
    selected_questions = easy_questions + medium_questions + hard_questions
    answers_data = {}
    
    print(f"Selected questions:")
    expected_raw_score = 0
    for q in selected_questions:
        answers_data[str(q.id)] = q.correct_answer  # All correct
        expected_raw_score += q.scoring_coefficient
        print(f"  Q{q.order} ({q.difficulty_level}): {q.question_text[:50]}... -> {q.correct_answer}")
    
    # Prepare request data
    request_data = {
        'answers': answers_data,
        'time_taken_seconds': 540,  # 9 minutes
        'submission_metadata': {
            'browser': 'Chrome',
            'testType': 'logical_reasoning',
            'device': 'Desktop'
        }
    }
    
    print(f"\n📤 Submitting to API endpoint...")
    print(f"URL: /api/tests/{lrt1.id}/submit/")
    print(f"Questions: {len(answers_data)}")
    print(f"Expected raw score: {expected_raw_score}")
    
    # Make API request
    response = client.post(
        f'/api/tests/{lrt1.id}/submit/',
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
        
        # Verify the scoring
        expected_max_score = expected_raw_score  # All correct
        expected_percentage = 100.0
        
        assert float(score_data['raw_score']) == expected_raw_score, f"Raw score mismatch"
        assert float(score_data['max_possible_score']) == expected_max_score, f"Max score mismatch"
        assert float(score_data['percentage_score']) == expected_percentage, f"Percentage mismatch"
        
        print(f"\n✅ Test 1 passed!")
        
    else:
        print(f"❌ API request failed!")
        try:
            error_data = response.json()
            print(f"Error: {error_data}")
        except:
            print(f"Response content: {response.content}")
        return False
    
    # Test 2: Test new question types specifically
    print(f"\n📝 Test 2: New question types via API")
    TestSubmission.objects.filter(user=user, test=lrt1).delete()
    
    # Select the new questions (Q51-Q55)
    new_questions = list(lrt1.questions.filter(order__gte=51))
    answers_data = {}
    expected_raw_score = 0
    
    print(f"Testing new question types:")
    for q in new_questions:
        answers_data[str(q.id)] = q.correct_answer
        expected_raw_score += q.scoring_coefficient
        print(f"  Q{q.order} ({q.difficulty_level}): {q.question_text[:60]}...")
    
    request_data = {
        'answers': answers_data,
        'time_taken_seconds': 300,
        'submission_metadata': {
            'browser': 'Chrome',
            'testType': 'logical_reasoning'
        }
    }
    
    response = client.post(
        f'/api/tests/{lrt1.id}/submit/',
        data=json.dumps(request_data),
        content_type='application/json'
    )
    
    print(f"Response: {response.status_code}")
    if response.status_code == 201:
        response_data = response.json()
        score_data = response_data['score']
        
        print(f"New questions scoring:")
        print(f"  Raw Score: {score_data['raw_score']} (expected: {expected_raw_score})")
        print(f"  Percentage: {score_data['percentage_score']}%")
        print(f"  Grade: {score_data['grade_letter']}")
        
        assert float(score_data['raw_score']) == expected_raw_score
        assert float(score_data['percentage_score']) == 100.0
        
        print(f"✅ Test 2 passed!")
    else:
        print(f"❌ Test 2 failed: {response.status_code}")
        return False
    
    # Test 3: Partial correct answers
    print(f"\n📝 Test 3: Partial correct answers")
    TestSubmission.objects.filter(user=user, test=lrt1).delete()
    
    # Select 10 random questions, answer only 6 correctly
    random_questions = random.sample(list(lrt1.questions.all()), 10)
    answers_data = {}
    expected_raw_score = 0
    expected_max_score = 0
    
    for i, q in enumerate(random_questions):
        expected_max_score += q.scoring_coefficient
        if i < 6:  # First 6 correct
            answers_data[str(q.id)] = q.correct_answer
            expected_raw_score += q.scoring_coefficient
        else:  # Last 4 incorrect
            wrong_answer = 'A' if q.correct_answer != 'A' else 'B'
            answers_data[str(q.id)] = wrong_answer
    
    request_data = {
        'answers': answers_data,
        'time_taken_seconds': 600,
        'submission_metadata': {
            'browser': 'Chrome',
            'testType': 'logical_reasoning'
        }
    }
    
    response = client.post(
        f'/api/tests/{lrt1.id}/submit/',
        data=json.dumps(request_data),
        content_type='application/json'
    )
    
    if response.status_code == 201:
        response_data = response.json()
        score_data = response_data['score']
        
        expected_percentage = (expected_raw_score / expected_max_score) * 100
        
        print(f"Partial scoring results:")
        print(f"  Raw Score: {score_data['raw_score']} (expected: {expected_raw_score})")
        print(f"  Max Possible: {score_data['max_possible_score']} (expected: {expected_max_score})")
        print(f"  Percentage: {score_data['percentage_score']}% (expected: ~{expected_percentage:.1f}%)")
        print(f"  Grade: {score_data['grade_letter']}")
        print(f"  Correct: {score_data['correct_answers']}/10")
        
        assert float(score_data['raw_score']) == expected_raw_score
        assert float(score_data['max_possible_score']) == expected_max_score
        assert abs(float(score_data['percentage_score']) - expected_percentage) < 0.1
        assert score_data['correct_answers'] == 6
        
        print(f"✅ Test 3 passed!")
    else:
        print(f"❌ Test 3 failed: {response.status_code}")
        return False
    
    print(f"\n✅ All LRT1 API tests passed!")
    return True

if __name__ == "__main__":
    success = test_lrt1_api_endpoint()
    if success:
        print(f"\n🎉 LRT1 API endpoint is fully functional!")
    else:
        print(f"\n❌ LRT1 API endpoint has issues")
