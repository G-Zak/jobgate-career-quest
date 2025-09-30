#!/usr/bin/env python
"""
Test SJT API endpoint after scoring fix
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

def test_sjt_api_fix():
    """Test the SJT API endpoint after scoring fix"""
    
    print("🔍 TESTING SJT API ENDPOINT AFTER FIX")
    print("=" * 50)
    
    # Create test client and user
    client = Client()
    user = User.objects.create_user(
        username='sjt_api_fix_user',
        email='sjtapifix@test.com',
        password='testpass123'
    )
    
    # Login
    client.login(username='sjt_api_fix_user', password='testpass123')
    
    # Get SJT test
    sjt_test = Test.objects.get(id=30)
    print(f"Test: {sjt_test.title}")
    
    # Clean up any existing submissions
    TestSubmission.objects.filter(user=user, test=sjt_test).delete()
    
    # Get first 5 questions for testing
    questions = list(sjt_test.questions.all()[:5])
    answers_data = {}
    expected_raw_score = 0
    
    print(f"Selected questions:")
    for q in questions:
        answers_data[str(q.id)] = q.correct_answer  # All correct
        expected_raw_score += q.scoring_coefficient
        print(f"  Q{q.order} ({q.difficulty_level}): {q.question_text[:50]}... -> {q.correct_answer}")
    
    # Prepare request data
    request_data = {
        'answers': answers_data,
        'time_taken_seconds': 300,
        'submission_metadata': {
            'browser': 'Chrome',
            'testType': 'situational_judgment',
            'device': 'Desktop'
        }
    }
    
    print(f"\n📤 Submitting to API endpoint...")
    print(f"URL: /api/tests/{sjt_test.id}/submit/")
    print(f"Questions: {len(answers_data)}")
    print(f"Expected raw score: {expected_raw_score}")
    
    # Make API request
    response = client.post(
        f'/api/tests/{sjt_test.id}/submit/',
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
        assert score_data['correct_answers'] == len(questions), f"Correct answers mismatch"
        
        print(f"\n✅ API test passed!")
        
        # Test partial correct answers
        print(f"\n📝 Testing partial correct answers via API")
        TestSubmission.objects.filter(user=user, test=sjt_test).delete()
        
        # Answer only first 3 correctly
        partial_answers = {}
        expected_partial_score = 0
        
        for i, q in enumerate(questions):
            if i < 3:  # First 3 correct
                partial_answers[str(q.id)] = q.correct_answer
                expected_partial_score += q.scoring_coefficient
            else:  # Last 2 incorrect
                wrong_answer = 'B' if q.correct_answer != 'B' else 'C'
                partial_answers[str(q.id)] = wrong_answer
        
        partial_request = {
            'answers': partial_answers,
            'time_taken_seconds': 300,
            'submission_metadata': {
                'browser': 'Chrome',
                'testType': 'situational_judgment'
            }
        }
        
        response = client.post(
            f'/api/tests/{sjt_test.id}/submit/',
            data=json.dumps(partial_request),
            content_type='application/json'
        )
        
        if response.status_code == 201:
            response_data = response.json()
            score_data = response_data['score']
            
            expected_partial_percentage = (expected_partial_score / expected_max_score) * 100
            
            print(f"Partial scoring results:")
            print(f"  Raw Score: {score_data['raw_score']} (expected: {expected_partial_score})")
            print(f"  Max Possible: {score_data['max_possible_score']} (expected: {expected_max_score})")
            print(f"  Percentage: {score_data['percentage_score']}% (expected: ~{expected_partial_percentage:.1f}%)")
            print(f"  Grade: {score_data['grade_letter']}")
            print(f"  Correct: {score_data['correct_answers']}/5")
            
            assert float(score_data['raw_score']) == expected_partial_score
            assert float(score_data['max_possible_score']) == expected_max_score
            assert abs(float(score_data['percentage_score']) - expected_partial_percentage) < 0.1
            assert score_data['correct_answers'] == 3
            
            print(f"✅ Partial scoring test passed!")
        else:
            print(f"❌ Partial scoring test failed: {response.status_code}")
            return False
        
    else:
        print(f"❌ API request failed!")
        try:
            error_data = response.json()
            print(f"Error: {error_data}")
        except:
            print(f"Response content: {response.content}")
        return False
    
    print(f"\n✅ All SJT API tests passed!")
    return True

if __name__ == "__main__":
    success = test_sjt_api_fix()
    if success:
        print(f"\n🎉 SJT API endpoint is now working correctly!")
    else:
        print(f"\n❌ SJT API endpoint still has issues")
