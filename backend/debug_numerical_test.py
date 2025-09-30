#!/usr/bin/env python
"""
Debug script to test numerical reasoning test submission and scoring
"""
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'careerquest.settings')
django.setup()

from django.contrib.auth.models import User
from testsengine.models import Test, TestSubmission, Score
from testsengine.services.scoring_service import ScoringService
from testsengine.serializers import SubmissionInputSerializer
from testsengine.views import SubmitTestView
from django.test import RequestFactory
from django.http import JsonResponse
import json

def test_numerical_reasoning_submission():
    """Test numerical reasoning test submission and scoring"""
    
    print("🔍 DEBUGGING NUMERICAL REASONING TEST SUBMISSION")
    print("=" * 60)
    
    # Get test ID 21 (numerical reasoning)
    try:
        test = Test.objects.get(id=21)
        print(f"✅ Found test: {test.title} ({test.test_type})")
        print(f"   Questions: {test.questions.count()}")
        print(f"   Duration: {test.duration_minutes} minutes")
    except Test.DoesNotExist:
        print("❌ Test ID 21 not found")
        return
    
    # Get or create test user
    user, created = User.objects.get_or_create(
        username='debug_numerical_user',
        defaults={'email': 'debug@test.com'}
    )
    print(f"✅ User: {user.username} ({'created' if created else 'existing'})")
    
    # Clean up any existing submissions
    existing_submissions = TestSubmission.objects.filter(user=user, test=test)
    if existing_submissions.exists():
        print(f"🧹 Cleaning up {existing_submissions.count()} existing submissions")
        existing_submissions.delete()
    
    # Prepare test answers (first 5 questions)
    questions = test.questions.all()[:5]
    answers_data = {}
    
    print(f"\n📝 Preparing answers for {len(questions)} questions:")
    for i, q in enumerate(questions):
        # Mix correct and incorrect answers for testing
        if i < 3:
            # First 3 correct
            answers_data[str(q.id)] = q.correct_answer
            print(f"   Q{q.order}: {q.question_text[:50]}... -> {q.correct_answer} ✅")
        else:
            # Last 2 incorrect (use 'A' if correct is not 'A', otherwise use 'B')
            wrong_answer = 'A' if q.correct_answer != 'A' else 'B'
            answers_data[str(q.id)] = wrong_answer
            print(f"   Q{q.order}: {q.question_text[:50]}... -> {wrong_answer} ❌ (correct: {q.correct_answer})")
    
    print(f"\n🎯 Test answers: {answers_data}")
    
    # Test 1: Serializer validation
    print(f"\n1️⃣ Testing SubmissionInputSerializer validation...")
    serializer_data = {
        'answers': answers_data,
        'time_taken_seconds': 300,  # 5 minutes
        'submission_metadata': {'browser': 'Chrome', 'testType': 'numerical_reasoning'}
    }
    
    serializer = SubmissionInputSerializer(data=serializer_data, context={'test': test})
    if serializer.is_valid():
        print("✅ Serializer validation passed")
    else:
        print(f"❌ Serializer validation failed: {serializer.errors}")
        return
    
    # Test 2: View validation
    print(f"\n2️⃣ Testing SubmitTestView validation...")
    view = SubmitTestView()
    validation_result = view._validate_submission_requirements(test, answers_data, 300)
    
    if validation_result['valid']:
        print("✅ View validation passed")
    else:
        print(f"❌ View validation failed:")
        for error in validation_result['errors']:
            print(f"   - {error}")
        for warning in validation_result.get('warnings', []):
            print(f"   ⚠️ {warning}")
        
        # This is likely where the issue is - let's continue anyway to test scoring
    
    # Test 3: Direct scoring service
    print(f"\n3️⃣ Testing ScoringService directly...")
    try:
        scoring_service = ScoringService()
        submission, score = scoring_service.score_test_submission(
            user=user,
            test=test,
            answers_data=answers_data,
            time_taken_seconds=300
        )
        
        print(f"✅ Scoring completed successfully!")
        print(f"   Submission ID: {submission.id}")
        print(f"   Raw Score: {score.raw_score}")
        print(f"   Max Possible: {score.max_possible_score}")
        print(f"   Percentage: {score.percentage_score}%")
        print(f"   Correct Answers: {score.correct_answers}/{score.total_questions}")
        print(f"   Grade: {score.grade_letter}")
        print(f"   Passed: {score.passed}")
        
        # Check individual answers
        print(f"\n📊 Individual answer breakdown:")
        for answer in submission.answers.all():
            print(f"   Q{answer.question.order}: {answer.selected_answer} -> "
                  f"{'✅' if answer.is_correct else '❌'} ({answer.points_awarded} pts)")
        
    except Exception as e:
        print(f"❌ Scoring failed: {e}")
        import traceback
        traceback.print_exc()
        return
    
    # Test 4: Full API endpoint simulation
    print(f"\n4️⃣ Testing full API endpoint...")
    try:
        factory = RequestFactory()
        request_data = {
            'answers': answers_data,
            'time_taken_seconds': 300,
            'submission_metadata': {'browser': 'Chrome', 'testType': 'numerical_reasoning'}
        }
        
        request = factory.post(
            f'/api/tests/{test.id}/submit/',
            data=json.dumps(request_data),
            content_type='application/json'
        )
        request.user = user
        
        # Clean up the previous submission for this test
        TestSubmission.objects.filter(user=user, test=test).delete()
        
        view = SubmitTestView()
        response = view.post(request, test.id)
        
        if response.status_code == 201:
            print("✅ API endpoint test passed")
            response_data = response.data
            print(f"   Score: {response_data['score']['percentage_score']}%")
            print(f"   Message: {response_data['message']}")
        else:
            print(f"❌ API endpoint test failed: {response.status_code}")
            print(f"   Response: {response.data}")
            
    except Exception as e:
        print(f"❌ API endpoint test failed: {e}")
        import traceback
        traceback.print_exc()
    
    print(f"\n✅ Debug test completed!")

if __name__ == "__main__":
    test_numerical_reasoning_submission()
