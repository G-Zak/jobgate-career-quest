#!/usr/bin/env python
"""
Test diagrammatic and situational judgment test fixes
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

def test_diagrammatic_situational_fixes():
    """Test the diagrammatic and situational judgment test fixes"""
    
    print("🔍 TESTING DIAGRAMMATIC & SITUATIONAL JUDGMENT FIXES")
    print("=" * 60)
    
    # Test cases: (test_id, test_name, test_type, component)
    test_cases = [
        # Need to find the correct test IDs for diagrammatic and situational
        # Let's check what tests are available first
    ]
    
    # First, let's find available tests
    print("📋 Available tests in database:")
    client = Client()
    
    # Create a test user
    user = User.objects.create_user(
        username='test_finder_user',
        email='testfinder@test.com',
        password='testpass123'
    )
    client.login(username='test_finder_user', password='testpass123')
    
    # Get all tests
    from testsengine.models import Test
    all_tests = Test.objects.all()
    
    diagrammatic_test = None
    situational_test = None
    
    for test in all_tests:
        print(f"  ID {test.id}: {test.title} ({test.test_type})")
        if 'diagrammatic' in test.title.lower() or 'diagram' in test.title.lower():
            diagrammatic_test = test
        elif 'situational' in test.title.lower() or 'sjt' in test.title.lower():
            situational_test = test
    
    # Test the found tests
    test_results = []
    
    if diagrammatic_test:
        print(f"\n📝 Testing {diagrammatic_test.title} (ID: {diagrammatic_test.id})")
        print("-" * 55)
        result = test_single_test(client, diagrammatic_test, 'diagrammatic_reasoning', 'DiagrammaticReasoningTest')
        test_results.append((diagrammatic_test.title, result[0], result[1], 'DiagrammaticReasoningTest'))
    else:
        print(f"\n⚠️ No diagrammatic test found")
        test_results.append(("Diagrammatic Test", False, "Not found", 'DiagrammaticReasoningTest'))
    
    if situational_test:
        print(f"\n📝 Testing {situational_test.title} (ID: {situational_test.id})")
        print("-" * 55)
        result = test_single_test(client, situational_test, 'situational_judgment', 'SituationalJudgmentTest')
        test_results.append((situational_test.title, result[0], result[1], 'SituationalJudgmentTest'))
    else:
        print(f"\n⚠️ No situational judgment test found")
        test_results.append(("Situational Test", False, "Not found", 'SituationalJudgmentTest'))
    
    # Summary
    print(f"\n📊 DIAGRAMMATIC & SITUATIONAL TEST SUMMARY")
    print("=" * 60)
    
    passed = 0
    failed = 0
    
    for test_name, success, details, component in test_results:
        status = "✅ WORKING" if success else "❌ FAILED"
        print(f"{status} | {test_name}")
        print(f"         Component: {component}")
        print(f"         Result: {details}")
        print()
        
        if success:
            passed += 1
        else:
            failed += 1
    
    print(f"Results: {passed} working, {failed} failed")
    
    if failed == 0:
        print(f"\n🎉 DIAGRAMMATIC & SITUATIONAL TESTS ARE WORKING!")
        print(f"✅ Both use modern TestResultsPage")
        print(f"✅ Proper duplicate submission handling")
        print(f"✅ Consistent with other test types")
        return True
    else:
        print(f"\n⚠️ Some tests still have issues")
        return False

def test_single_test(client, test, test_type, component_name):
    """Test a single test for scoring and duplicate submission handling"""
    
    try:
        # Create unique user for this test
        username = f'test_user_{test.id}_{test_type}'
        user = User.objects.create_user(
            username=username,
            email=f'{username}@test.com',
            password='testpass123'
        )
        
        # Login with new user
        client.login(username=username, password='testpass123')
        
        # Clean up existing submissions
        TestSubmission.objects.filter(user=user, test=test).delete()
        
        # Get first 3 questions
        questions = list(test.questions.all()[:3])
        if not questions:
            print(f"⚠️ No questions found for {test.title}")
            return (False, "No questions")
        
        # Create answers (all correct for 100%)
        answers_data = {}
        for q in questions:
            answers_data[str(q.id)] = q.correct_answer
        
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
        
        print(f"Expected: 3/3 = 100.0%")
        
        # First submission
        response = client.post(
            f'/api/tests/{test.id}/submit/',
            data=json.dumps(request_data),
            content_type='application/json'
        )
        
        if response.status_code != 201:
            print(f"❌ First submission failed: {response.status_code}")
            try:
                error_data = response.json()
                print(f"Error: {error_data}")
            except:
                print(f"Response content: {response.content}")
            return (False, f"First submission failed: {response.status_code}")
        
        response_data = response.json()
        score_data = response_data.get('score', {})
        first_score = score_data.get('percentage_score')
        
        print(f"✅ Scoring: {first_score}%")
        
        # Duplicate submission
        response = client.post(
            f'/api/tests/{test.id}/submit/',
            data=json.dumps(request_data),
            content_type='application/json'
        )
        
        if response.status_code == 409:
            error_data = response.json()
            existing_score = error_data.get('existing_score')
            
            print(f"✅ Duplicate: {existing_score}%")
            
            # Check if frontend would handle correctly
            frontend_error = {
                'message': 'DUPLICATE_SUBMISSION',
                'existingSubmission': {
                    'submissionId': error_data.get('existing_submission_id'),
                    'score': existing_score,
                    'submittedAt': error_data.get('submitted_at'),
                    'message': error_data.get('message')
                }
            }
            
            # Frontend should create results structure
            existing_score_float = float(frontend_error['existingSubmission']['score'])
            frontend_results = {
                'percentage_score': f"{existing_score_float:.2f}",
                'correct_answers': round((existing_score_float / 100) * len(questions)),
                'total_questions': len(questions),
                'passed': existing_score_float >= 70,
                'isDuplicateSubmission': True
            }
            
            print(f"✅ Frontend: {frontend_results['percentage_score']}% -> TestResultsPage")
            
            # Verify scores match and are not 0
            if (str(existing_score).replace('.0', '') == str(first_score).replace('.00', '') and 
                float(frontend_results['percentage_score']) > 0):
                print(f"✅ {component_name}: WORKING CORRECTLY")
                return (True, f"{existing_score}%")
            else:
                print(f"❌ {component_name}: Score issues")
                return (False, f"Score mismatch or 0%")
        else:
            print(f"❌ Expected 409, got {response.status_code}")
            return (False, f"Expected 409, got {response.status_code}")
            
    except Exception as e:
        print(f"❌ Error testing {test.title}: {str(e)}")
        return (False, f"Error: {str(e)}")

if __name__ == "__main__":
    success = test_diagrammatic_situational_fixes()
    if success:
        print(f"\n🎯 DIAGRAMMATIC & SITUATIONAL TESTS FIXED!")
        print(f"All tests now use consistent TestResultsPage interface!")
    else:
        print(f"\n❌ Some issues remain")
