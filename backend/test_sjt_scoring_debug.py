#!/usr/bin/env python
"""
Debug SJT scoring issue - check why it's returning 0%
"""
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'careerquest.settings')
django.setup()

from django.test import Client
from django.contrib.auth.models import User
from testsengine.models import Test, TestSubmission, Question
from testsengine.question_option_model import QuestionOption
import json

def debug_sjt_scoring():
    """Debug SJT scoring to find why it returns 0%"""
    
    print("🔍 DEBUGGING SJT SCORING ISSUE")
    print("=" * 50)
    
    # Find SJT test
    sjt_tests = Test.objects.filter(test_type='situational_judgment')
    
    if not sjt_tests.exists():
        print("❌ No SJT tests found")
        return False
    
    sjt_test = sjt_tests.first()
    print(f"SJT Test: {sjt_test.title} (ID: {sjt_test.id})")
    
    # Get first few questions
    questions = list(sjt_test.questions.all()[:3])
    print(f"Questions found: {len(questions)}")
    
    for i, q in enumerate(questions):
        print(f"\nQuestion {i+1} (ID: {q.id}):")
        print(f"  Text: {q.question_text[:100]}...")
        print(f"  Correct Answer: {q.correct_answer}")
        print(f"  Difficulty: {q.difficulty_level}")
        
        # Check if QuestionOption records exist for this question
        options = QuestionOption.objects.filter(question=q)
        print(f"  QuestionOptions found: {options.count()}")
        
        if options.exists():
            for opt in options:
                print(f"    {opt.option_letter}: Score {opt.score_value} - {opt.option_text[:50]}...")
        else:
            print(f"    ❌ NO QuestionOption records found!")
            print(f"    This is why SJT scoring returns 0!")
    
    # Test the scoring logic directly
    print(f"\n📝 Testing SJT Scoring Logic:")
    
    if questions:
        test_question = questions[0]
        print(f"Testing with Question ID: {test_question.id}")
        print(f"Correct Answer: {test_question.correct_answer}")
        
        # Try to get QuestionOption for correct answer
        try:
            from testsengine.question_option_model import QuestionOption as _QO
            opt = _QO.objects.filter(question=test_question, option_letter=test_question.correct_answer).first()
            
            if opt:
                print(f"✅ Found QuestionOption: {opt.option_letter} = {opt.score_value} points")
                print(f"✅ SJT scoring would work correctly")
            else:
                print(f"❌ No QuestionOption found for {test_question.correct_answer}")
                print(f"❌ This causes score_value = 0, points_awarded = 0")
                print(f"❌ Result: 0% score even with correct answers")
                
                # Check what options DO exist
                all_opts = _QO.objects.filter(question=test_question)
                print(f"Available options for this question:")
                for opt in all_opts:
                    print(f"  {opt.option_letter}: {opt.score_value} points")
                    
        except Exception as e:
            print(f"❌ Error accessing QuestionOption: {e}")
    
    # Test actual API submission
    print(f"\n📝 Testing API Submission:")
    
    # Create test user
    user = User.objects.create_user(
        username='sjt_debug_user',
        email='sjt@debug.com',
        password='testpass123'
    )
    
    client = Client()
    client.login(username='sjt_debug_user', password='testpass123')
    
    # Clean up existing submissions
    TestSubmission.objects.filter(user=user, test=sjt_test).delete()
    
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
    
    print(f"Submitting answers: {answers_data}")
    
    response = client.post(
        f'/api/tests/{sjt_test.id}/submit/',
        data=json.dumps(request_data),
        content_type='application/json'
    )
    
    if response.status_code == 201:
        response_data = response.json()
        score_data = response_data.get('score', {})
        score = score_data.get('percentage_score')
        
        print(f"✅ API Response: {score}%")
        print(f"  Correct: {score_data.get('correct_answers')}/{score_data.get('total_questions')}")
        print(f"  Raw Score: {score_data.get('raw_score')}")
        print(f"  Max Score: {score_data.get('max_possible_score')}")
        
        if float(score) == 0.0:
            print(f"\n❌ CONFIRMED: SJT returns 0% despite correct answers")
            print(f"❌ ROOT CAUSE: Missing or incorrect QuestionOption records")
            print(f"❌ SOLUTION: Either fix QuestionOption data or use standard MCQ scoring")
        else:
            print(f"\n✅ SJT scoring is working correctly")
            
    else:
        print(f"❌ API submission failed: {response.status_code}")
        try:
            error_data = response.json()
            print(f"Error: {error_data}")
        except:
            print(f"Response: {response.content}")
    
    return True

if __name__ == "__main__":
    debug_sjt_scoring()
