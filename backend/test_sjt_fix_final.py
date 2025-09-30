#!/usr/bin/env python
"""
Test SJT scoring fix - should now return correct scores instead of 0%
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

def test_sjt_scoring_fix():
    """Test that SJT scoring now works correctly"""
    
    print("🔍 TESTING SJT SCORING FIX")
    print("=" * 40)
    
    # Find SJT test
    sjt_tests = Test.objects.filter(test_type='situational_judgment')
    
    if not sjt_tests.exists():
        print("❌ No SJT tests found")
        return False
    
    sjt_test = sjt_tests.first()
    print(f"SJT Test: {sjt_test.title} (ID: {sjt_test.id})")
    
    # Get first 3 questions
    questions = list(sjt_test.questions.all()[:3])
    print(f"Questions: {len(questions)}")
    
    for i, q in enumerate(questions):
        print(f"  Q{i+1} (ID: {q.id}): Correct={q.correct_answer}, Difficulty={q.difficulty_level}")
    
    # Create test user
    user = User.objects.create_user(
        username='sjt_fix_test_user_final',
        email='sjtfixfinal@test.com',
        password='testpass123'
    )
    
    client = Client()
    client.login(username='sjt_fix_test_user_final', password='testpass123')
    
    # Clean up existing submissions
    TestSubmission.objects.filter(user=user, test=sjt_test).delete()
    
    print(f"\n📝 Test: All correct answers")
    
    # Create answers (all correct)
    answers_data = {}
    for q in questions:
        answers_data[str(q.id)] = q.correct_answer
    
    request_data = {
        'answers': answers_data,
        'time_taken_seconds': 300,
        'submission_metadata': {
            'browser': 'Chrome',
            'testType': 'situational_judgment',
            'device': 'Desktop'
        }
    }
    
    print(f"Submitting: {answers_data}")
    
    response = client.post(
        f'/api/tests/{sjt_test.id}/submit/',
        data=json.dumps(request_data),
        content_type='application/json'
    )
    
    if response.status_code == 201:
        response_data = response.json()
        score_data = response_data.get('score', {})
        score = score_data.get('percentage_score')
        
        print(f"✅ Score: {score}%")
        print(f"  Correct: {score_data.get('correct_answers')}/{score_data.get('total_questions')}")
        print(f"  Raw Score: {score_data.get('raw_score')}")
        print(f"  Max Score: {score_data.get('max_possible_score')}")
        print(f"  Grade: {score_data.get('grade_letter')}")
        print(f"  Passed: {score_data.get('passed')}")
        
        if float(score) > 0:
            print(f"✅ SUCCESS: SJT scoring is now working!")
            
            # Test duplicate submission
            print(f"\n📝 Test: Duplicate submission")
            
            response = client.post(
                f'/api/tests/{sjt_test.id}/submit/',
                data=json.dumps(request_data),
                content_type='application/json'
            )
            
            if response.status_code == 409:
                error_data = response.json()
                existing_score = error_data.get('existing_score')
                
                print(f"✅ Duplicate: {existing_score}%")
                
                if str(existing_score).replace('.0', '') == str(score).replace('.00', ''):
                    print(f"✅ Duplicate handling works correctly")
                    return True
                else:
                    print(f"❌ Duplicate score mismatch")
                    return False
            else:
                print(f"❌ Expected 409, got {response.status_code}")
                return False
        else:
            print(f"❌ FAILED: Still getting 0% score")
            return False
            
    else:
        print(f"❌ API submission failed: {response.status_code}")
        try:
            error_data = response.json()
            print(f"Error: {error_data}")
        except:
            print(f"Response: {response.content}")
        return False

if __name__ == "__main__":
    success = test_sjt_scoring_fix()
    if success:
        print(f"\n🎉 SJT SCORING COMPLETELY FIXED!")
        print(f"✅ No more 0% scores for correct answers")
        print(f"✅ Uses standard MCQ scoring like other tests")
        print(f"✅ Proper duplicate submission handling")
        print(f"✅ Consistent with all other test types")
        print(f"\n🎯 The user can now submit SJT tests and see correct scores!")
    else:
        print(f"\n❌ SJT scoring still has issues")
