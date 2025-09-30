#!/usr/bin/env python
"""
Debug script to identify test issues
"""
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'careerquest.settings')
django.setup()

from decimal import Decimal
from django.contrib.auth.models import User
from testsengine.models import Test, Question, TestSubmission, Answer, Score
from testsengine.serializers import (
    TestListSerializer, TestDetailSerializer, QuestionForTestSerializer,
    SubmissionInputSerializer, AnswerDetailSerializer, TestSubmissionSerializer,
    ScoreDetailSerializer, ScoringConfigSerializer
)

def test_basic_functionality():
    """Test basic functionality to identify issues"""
    print("🔍 DEBUGGING TEST ISSUES")
    print("=" * 50)
    
    # Test 1: Model creation
    print("\n1. Testing model creation...")
    try:
        # Create test user
        user, created = User.objects.get_or_create(
            username='test_debug_user',
            defaults={'email': 'test@debug.com'}
        )
        print(f"✅ User created/found: {user.username}")
        
        # Use existing test data
        test = Test.objects.first()
        if not test:
            print("❌ No tests found in database")
            return False
        print(f"✅ Using existing test: {test.title}")

        # Get questions from the test
        questions = list(test.questions.all()[:2])
        if len(questions) < 2:
            print("❌ Test doesn't have enough questions")
            return False

        question1, question2 = questions[0], questions[1]
        print(f"✅ Questions created: {question1.id}, {question2.id}")
        
    except Exception as e:
        print(f"❌ Model creation failed: {e}")
        return False
    
    # Test 2: Serializer functionality
    print("\n2. Testing serializers...")
    try:
        # Test TestListSerializer
        list_serializer = TestListSerializer(test)
        list_data = list_serializer.data
        print(f"✅ TestListSerializer works: {list(list_data.keys())}")
        
        # Test TestDetailSerializer
        detail_serializer = TestDetailSerializer(test)
        detail_data = detail_serializer.data
        print(f"✅ TestDetailSerializer works: {list(detail_data.keys())}")
        
        # Test QuestionForTestSerializer
        question_serializer = QuestionForTestSerializer(question1)
        question_data = question_serializer.data
        print(f"✅ QuestionForTestSerializer works: {list(question_data.keys())}")
        
        # Check that correct_answer is not exposed
        if 'correct_answer' not in question_data:
            print("✅ Correct answer properly hidden")
        else:
            print("❌ Correct answer exposed!")
            
    except Exception as e:
        print(f"❌ Serializer test failed: {e}")
        import traceback
        traceback.print_exc()
        return False
    
    # Test 3: Submission serializer
    print("\n3. Testing submission serializer...")
    try:
        # Test SubmissionInputSerializer
        submission_data = {
            'answers': {
                str(question1.id): 'A',
                str(question2.id): 'B'
            },
            'time_taken_seconds': 600,
            'submission_metadata': {
                'browser': 'Chrome',
                'device': 'desktop'
            }
        }
        
        submission_serializer = SubmissionInputSerializer(data=submission_data)
        if submission_serializer.is_valid():
            print("✅ SubmissionInputSerializer validation works")
        else:
            print(f"❌ SubmissionInputSerializer validation failed: {submission_serializer.errors}")
            
    except Exception as e:
        print(f"❌ Submission serializer test failed: {e}")
        import traceback
        traceback.print_exc()
        return False
    
    # Test 4: Scoring functionality
    print("\n4. Testing scoring functionality...")
    try:
        from testsengine.services.scoring_service import ScoringService
        
        scoring_service = ScoringService()
        
        # Create submission and score
        answers_data = {
            str(question1.id): 'A',  # Correct
            str(question2.id): 'B'   # Correct
        }
        
        submission, score = scoring_service.score_test_submission(
            user, test, answers_data, 600
        )
        
        print(f"✅ Scoring works: {score.percentage_score}%")
        
        # Test ScoreDetailSerializer
        score_serializer = ScoreDetailSerializer(score)
        score_data = score_serializer.data
        print(f"✅ ScoreDetailSerializer works: {score_data.get('percentage_score')}%")
        
    except Exception as e:
        print(f"❌ Scoring test failed: {e}")
        import traceback
        traceback.print_exc()
        return False
    
    # Test 5: ScoringConfigSerializer
    print("\n5. Testing ScoringConfigSerializer...")
    try:
        from testsengine.services.scoring_service import ScoringConfig
        
        config = ScoringConfig()
        config_serializer = ScoringConfigSerializer(config)
        config_data = config_serializer.data
        print(f"✅ ScoringConfigSerializer works: {list(config_data.keys())}")
        
    except Exception as e:
        print(f"❌ ScoringConfigSerializer test failed: {e}")
        import traceback
        traceback.print_exc()
        return False
    
    print("\n✅ All basic functionality tests passed!")
    
    # Cleanup (only if we created them)
    try:
        if 'created' in locals() and created:
            test.delete()
            print("✅ Test cleanup completed")
        if 'created' in locals() and user.username == 'test_debug_user':
            # Only delete if it's our test user
            pass  # Keep test user for debugging
        print("✅ Cleanup completed")
    except Exception as e:
        print(f"⚠️ Cleanup warning: {e}")
    
    return True

if __name__ == "__main__":
    test_basic_functionality()
