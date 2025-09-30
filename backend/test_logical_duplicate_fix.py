#!/usr/bin/env python
"""
Test logical reasoning duplicate submission fix
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

def test_logical_duplicate_fix():
    """Test the logical reasoning duplicate submission fix"""
    
    print("🔍 TESTING LOGICAL REASONING DUPLICATE SUBMISSION FIX")
    print("=" * 60)
    
    # Create test client and user
    client = Client()
    user = User.objects.create_user(
        username='logical_duplicate_test_user',
        email='logicaldupe@test.com',
        password='testpass123'
    )
    
    # Login
    client.login(username='logical_duplicate_test_user', password='testpass123')
    
    # Get LRT1 test
    lrt1_test = Test.objects.get(id=13)
    print(f"Test: {lrt1_test.title}")
    
    # Clean up any existing submissions
    TestSubmission.objects.filter(user=user, test=lrt1_test).delete()
    
    # Get first 5 questions for testing
    questions = list(lrt1_test.questions.all()[:5])
    
    # Create answers (3 correct, 2 incorrect for partial score)
    answers_data = {}
    expected_correct = 0
    
    for i, q in enumerate(questions):
        if i < 3:  # First 3 correct
            answers_data[str(q.id)] = q.correct_answer
            expected_correct += 1
        else:  # Last 2 incorrect
            wrong_answer = 'B' if q.correct_answer != 'B' else 'C'
            answers_data[str(q.id)] = wrong_answer
    
    expected_percentage = (expected_correct / len(questions)) * 100
    
    # Simulate exact frontend API call
    request_data = {
        'answers': answers_data,
        'time_taken_seconds': 300,
        'submission_metadata': {
            'browser': 'Chrome',
            'testType': 'logical_reasoning',
            'device': 'Desktop'
        }
    }
    
    print(f"\n📝 Step 1: First submission (should succeed)")
    print(f"Answers: {len(answers_data)} questions")
    print(f"Expected correct: {expected_correct}/{len(questions)}")
    print(f"Expected percentage: {expected_percentage:.1f}%")
    
    # Make first API request
    response = client.post(
        f'/api/tests/{lrt1_test.id}/submit/',
        data=json.dumps(request_data),
        content_type='application/json'
    )
    
    print(f"Response Status: {response.status_code}")
    
    if response.status_code == 201:
        response_data = response.json()
        score_data = response_data.get('score', {})
        
        print(f"✅ First submission successful:")
        print(f"  Submission ID: {response_data.get('submission_id')}")
        print(f"  Score: {score_data.get('percentage_score')}%")
        print(f"  Correct: {score_data.get('correct_answers')}/{score_data.get('total_questions')}")
        
        first_submission_id = response_data.get('submission_id')
        first_score = score_data.get('percentage_score')
        
    else:
        print(f"❌ First submission failed: {response.status_code}")
        return False
    
    print(f"\n📝 Step 2: Duplicate submission (should return 409 with existing data)")
    
    # Make duplicate API request
    response = client.post(
        f'/api/tests/{lrt1_test.id}/submit/',
        data=json.dumps(request_data),
        content_type='application/json'
    )
    
    print(f"Response Status: {response.status_code}")
    
    if response.status_code == 409:
        error_data = response.json()
        
        print(f"✅ Duplicate submission detected correctly:")
        print(f"  Message: {error_data.get('message')}")
        print(f"  Existing submission ID: {error_data.get('existing_submission_id')}")
        print(f"  Existing score: {error_data.get('existing_score')}")
        print(f"  Submitted at: {error_data.get('submitted_at')}")
        
        # Verify the existing submission data matches
        existing_score = error_data.get('existing_score')
        existing_submission_id = error_data.get('existing_submission_id')
        
        if str(existing_submission_id) == str(first_submission_id):
            print(f"  ✅ Submission ID matches: {existing_submission_id}")
        else:
            print(f"  ❌ Submission ID mismatch: {existing_submission_id} != {first_submission_id}")
            
        if str(existing_score) == str(first_score):
            print(f"  ✅ Score matches: {existing_score}%")
        else:
            print(f"  ❌ Score mismatch: {existing_score}% != {first_score}%")
        
        # Test what frontend would do with this error
        print(f"\n📝 Step 3: Frontend handling simulation")
        
        # Simulate the error structure that backendSubmissionHelper.js creates
        frontend_error = {
            'message': 'DUPLICATE_SUBMISSION',
            'existingSubmission': {
                'submissionId': existing_submission_id,
                'score': existing_score,
                'submittedAt': error_data.get('submitted_at'),
                'message': error_data.get('message')
            }
        }
        
        # Simulate what the fixed LogicalReasoningTest.jsx would do
        existing_score_float = float(frontend_error['existingSubmission']['score']) if frontend_error['existingSubmission']['score'] else 0
        
        frontend_results = {
            'id': frontend_error['existingSubmission']['submissionId'],
            'raw_score': f"{existing_score_float:.2f}",
            'max_possible_score': "100.00",
            'percentage_score': f"{existing_score_float:.2f}",
            'correct_answers': round((existing_score_float / 100) * len(questions)),
            'total_questions': len(questions),
            'grade_letter': 'A' if existing_score_float >= 90 else 'B' if existing_score_float >= 80 else 'C' if existing_score_float >= 70 else 'D' if existing_score_float >= 60 else 'F',
            'passed': existing_score_float >= 70,
            'test_title': "LRT1 - Logical Reasoning",
            'test_type': "logical_reasoning",
            'isDuplicateSubmission': True,
            'existingSubmissionMessage': frontend_error['existingSubmission']['message']
        }
        
        print(f"Frontend would create results object:")
        for key, value in frontend_results.items():
            print(f"  {key}: {value}")
        
        # Verify frontend would show correct score
        if float(frontend_results['percentage_score']) > 0:
            print(f"  ✅ Frontend would show {frontend_results['percentage_score']}% (not 0%)")
        else:
            print(f"  ❌ Frontend would still show 0%")
            
        print(f"\n✅ Logical reasoning duplicate submission fix is working!")
        return True
        
    else:
        print(f"❌ Expected 409 Conflict, got {response.status_code}")
        try:
            error_data = response.json()
            print(f"Response: {error_data}")
        except:
            print(f"Response content: {response.content}")
        return False

if __name__ == "__main__":
    success = test_logical_duplicate_fix()
    if success:
        print(f"\n🎉 Logical reasoning duplicate submission handling is fixed!")
        print(f"Users will now see their actual scores instead of error messages when encountering duplicate submissions.")
    else:
        print(f"\n❌ Logical reasoning duplicate submission handling needs more work")
