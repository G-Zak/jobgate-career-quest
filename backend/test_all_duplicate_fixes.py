#!/usr/bin/env python
"""
Test all test types duplicate submission fixes
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

def test_all_duplicate_fixes():
    """Test duplicate submission fixes for all test types"""
    
    print("🔍 TESTING ALL TEST TYPES DUPLICATE SUBMISSION FIXES")
    print("=" * 65)
    
    # Test cases: (test_id, test_name, test_type)
    test_cases = [
        (21, 'NRT1 - Numerical Reasoning', 'numerical_reasoning'),
        (13, 'LRT1 - Logical Reasoning', 'logical_reasoning'),
        (30, 'SJT1 - Situational Judgment', 'situational_judgment'),
        (10, 'ART1 - Abstract Reasoning', 'abstract_reasoning'),
    ]
    
    results = []
    
    for test_id, test_name, test_type in test_cases:
        print(f"\n📝 Testing {test_name}")
        print("-" * 50)
        
        try:
            # Create unique user for each test
            username = f'duplicate_test_user_{test_id}'
            user = User.objects.create_user(
                username=username,
                email=f'{username}@test.com',
                password='testpass123'
            )
            
            # Create test client and login
            client = Client()
            client.login(username=username, password='testpass123')
            
            test = Test.objects.get(id=test_id)
            
            # Clean up existing submissions
            TestSubmission.objects.filter(user=user, test=test).delete()
            
            # Get first 3 questions
            questions = list(test.questions.all()[:3])
            if not questions:
                print(f"⚠️ No questions found for {test_name}")
                results.append((test_name, False, "No questions"))
                continue
            
            # Create answers (2 correct, 1 incorrect for partial score)
            answers_data = {}
            expected_correct = 0
            
            for i, q in enumerate(questions):
                if i < 2:  # First 2 correct
                    answers_data[str(q.id)] = q.correct_answer
                    expected_correct += 1
                else:  # Last 1 incorrect
                    if test_type == 'numerical_reasoning':
                        wrong_answer = '999' if q.correct_answer != '999' else '888'
                    else:
                        wrong_answer = 'B' if q.correct_answer != 'B' else 'C'
                    answers_data[str(q.id)] = wrong_answer
            
            expected_percentage = (expected_correct / len(questions)) * 100
            
            # Simulate frontend API call
            request_data = {
                'answers': answers_data,
                'time_taken_seconds': 300,
                'submission_metadata': {
                    'browser': 'Chrome',
                    'testType': test_type,
                    'device': 'Desktop'
                }
            }
            
            print(f"Expected: {expected_correct}/{len(questions)} = {expected_percentage:.1f}%")
            
            # First submission
            response = client.post(
                f'/api/tests/{test_id}/submit/',
                data=json.dumps(request_data),
                content_type='application/json'
            )
            
            if response.status_code != 201:
                print(f"❌ First submission failed: {response.status_code}")
                results.append((test_name, False, f"First submission failed: {response.status_code}"))
                continue
            
            response_data = response.json()
            score_data = response_data.get('score', {})
            first_score = score_data.get('percentage_score')
            
            print(f"First submission: {first_score}%")
            
            # Duplicate submission
            response = client.post(
                f'/api/tests/{test_id}/submit/',
                data=json.dumps(request_data),
                content_type='application/json'
            )
            
            if response.status_code == 409:
                error_data = response.json()
                existing_score = error_data.get('existing_score')
                
                print(f"Duplicate detected: {existing_score}%")
                
                # Verify scores match
                if str(existing_score).replace('.0', '') == str(first_score).replace('.00', ''):
                    print(f"✅ {test_name}: Scores match ({existing_score}%)")
                    results.append((test_name, True, f"{existing_score}%"))
                else:
                    print(f"❌ {test_name}: Score mismatch ({existing_score}% != {first_score}%)")
                    results.append((test_name, False, f"Score mismatch: {existing_score}% != {first_score}%"))
            else:
                print(f"❌ Expected 409, got {response.status_code}")
                results.append((test_name, False, f"Expected 409, got {response.status_code}"))
                
        except Exception as e:
            print(f"❌ Error testing {test_name}: {str(e)}")
            results.append((test_name, False, f"Error: {str(e)}"))
    
    # Summary
    print(f"\n📊 DUPLICATE SUBMISSION FIX SUMMARY")
    print("=" * 65)
    
    passed = 0
    failed = 0
    
    for test_name, success, details in results:
        if success:
            print(f"✅ {test_name}: {details}")
            passed += 1
        else:
            print(f"❌ {test_name}: {details}")
            failed += 1
    
    print(f"\nResults: {passed} passed, {failed} failed")
    
    if failed == 0:
        print(f"\n🎉 All test types handle duplicate submissions correctly!")
        print(f"Users will see their actual scores instead of 0% or error messages.")
        return True
    else:
        print(f"\n⚠️ Some test types still need duplicate submission fixes")
        return False

if __name__ == "__main__":
    success = test_all_duplicate_fixes()
    if success:
        print(f"\n✅ All duplicate submission issues are resolved!")
    else:
        print(f"\n❌ Some duplicate submission issues remain")
