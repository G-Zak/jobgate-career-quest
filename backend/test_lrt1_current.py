#!/usr/bin/env python
"""
Test current LRT1 (Logical Reasoning Test 1) functionality
"""
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'careerquest.settings')
django.setup()

from django.contrib.auth.models import User
from testsengine.models import Test, TestSubmission, Question
from testsengine.services.scoring_service import ScoringService
import random

def test_lrt1_current_state():
    """Test the current LRT1 test"""
    
    print("🔍 TESTING CURRENT LRT1 STATE")
    print("=" * 50)
    
    # Get LRT1 test
    lrt1 = Test.objects.get(id=13)
    print(f"Test: {lrt1.title}")
    print(f"Type: {lrt1.test_type}")
    print(f"Questions: {lrt1.questions.count()}")
    print(f"Duration: {lrt1.duration_minutes} minutes")
    print(f"Active: {lrt1.is_active}")
    
    # Analyze difficulty distribution
    questions = lrt1.questions.all()
    easy_count = questions.filter(difficulty_level='easy').count()
    medium_count = questions.filter(difficulty_level='medium').count()
    hard_count = questions.filter(difficulty_level='hard').count()
    
    print(f"\nDifficulty Distribution:")
    print(f"  Easy (1.0x): {easy_count} questions")
    print(f"  Medium (1.5x): {medium_count} questions") 
    print(f"  Hard (2.0x): {hard_count} questions")
    
    # Calculate expected max score
    expected_max = easy_count * 1.0 + medium_count * 1.5 + hard_count * 2.0
    actual_max = float(lrt1.calculate_max_score())
    print(f"  Expected max score: {expected_max}")
    print(f"  Actual max score: {actual_max}")
    
    # Get or create test user
    user, created = User.objects.get_or_create(
        username='lrt1_test_user',
        defaults={'email': 'lrt1@test.com'}
    )
    
    # Clean up existing submissions
    TestSubmission.objects.filter(user=user, test=lrt1).delete()
    
    # Test 1: Random selection of 10 questions
    print(f"\n📝 Test 1: Random selection of 10 questions")
    selected_questions = random.sample(list(questions), 10)
    
    answers_data = {}
    expected_raw_score = 0
    expected_max_score = 0
    
    print(f"Selected questions:")
    for q in selected_questions:
        answers_data[str(q.id)] = q.correct_answer  # All correct
        expected_raw_score += q.scoring_coefficient
        expected_max_score += q.scoring_coefficient
        print(f"  Q{q.order} ({q.difficulty_level}): {q.question_text[:60]}... -> {q.correct_answer}")
    
    print(f"\nExpected scoring:")
    print(f"  Raw score: {expected_raw_score}")
    print(f"  Max possible: {expected_max_score}")
    print(f"  Percentage: 100%")
    
    # Submit and score
    scoring_service = ScoringService()
    submission, score = scoring_service.score_test_submission(
        user=user,
        test=lrt1,
        answers_data=answers_data,
        time_taken_seconds=600  # 10 minutes
    )
    
    print(f"\nActual results:")
    print(f"  Raw score: {score.raw_score}")
    print(f"  Max possible: {score.max_possible_score}")
    print(f"  Percentage: {score.percentage_score}%")
    print(f"  Grade: {score.grade_letter}")
    print(f"  Correct: {score.correct_answers}/{score.total_questions}")
    
    # Verify scoring accuracy
    assert float(score.raw_score) == expected_raw_score, f"Raw score mismatch: {score.raw_score} != {expected_raw_score}"
    assert float(score.max_possible_score) == expected_max_score, f"Max score mismatch: {score.max_possible_score} != {expected_max_score}"
    assert float(score.percentage_score) == 100.0, f"Percentage should be 100%: {score.percentage_score}"
    
    print(f"✅ Test 1 passed!")
    
    # Test 2: Mixed correct/incorrect answers
    print(f"\n📝 Test 2: Mixed correct/incorrect (50% correct)")
    TestSubmission.objects.filter(user=user, test=lrt1).delete()
    
    answers_data = {}
    expected_raw_score = 0
    
    for i, q in enumerate(selected_questions):
        if i < 5:  # First 5 correct
            answers_data[str(q.id)] = q.correct_answer
            expected_raw_score += q.scoring_coefficient
        else:  # Last 5 incorrect
            wrong_answer = 'A' if q.correct_answer != 'A' else 'B'
            answers_data[str(q.id)] = wrong_answer
    
    submission, score = scoring_service.score_test_submission(
        user=user,
        test=lrt1,
        answers_data=answers_data,
        time_taken_seconds=600
    )
    
    expected_percentage = (expected_raw_score / expected_max_score) * 100
    
    print(f"Results:")
    print(f"  Raw score: {score.raw_score} (expected: {expected_raw_score})")
    print(f"  Max possible: {score.max_possible_score} (expected: {expected_max_score})")
    print(f"  Percentage: {score.percentage_score}% (expected: ~{expected_percentage:.1f}%)")
    print(f"  Grade: {score.grade_letter}")
    print(f"  Correct: {score.correct_answers}/{score.total_questions}")
    
    # Verify individual answers
    print(f"\nIndividual breakdown:")
    for answer in submission.answers.all():
        q = answer.question
        print(f"  Q{q.order} ({q.difficulty_level}): {answer.selected_answer} -> "
              f"{'✅' if answer.is_correct else '❌'} ({answer.points_awarded} pts)")
    
    # Verify scoring
    assert float(score.raw_score) == expected_raw_score, f"Raw score mismatch"
    assert abs(float(score.percentage_score) - expected_percentage) < 0.1, f"Percentage mismatch"
    assert score.correct_answers == 5, f"Should have 5 correct answers"
    
    print(f"✅ Test 2 passed!")
    
    # Test 3: Check question content quality
    print(f"\n📝 Test 3: Question content quality check")
    
    # Check for proper logical reasoning content
    logical_reasoning_indicators = [
        'premise', 'conclusion', 'valid', 'invalid', 'syllogism', 
        'if', 'then', 'all', 'some', 'no', 'therefore'
    ]
    
    content_quality_score = 0
    for q in questions[:20]:  # Check first 20 questions
        text_lower = q.question_text.lower()
        indicators_found = sum(1 for indicator in logical_reasoning_indicators if indicator in text_lower)
        if indicators_found >= 2:  # At least 2 logical reasoning indicators
            content_quality_score += 1
    
    quality_percentage = (content_quality_score / 20) * 100
    print(f"Content quality: {content_quality_score}/20 questions have proper logical reasoning content ({quality_percentage}%)")
    
    if quality_percentage >= 80:
        print(f"✅ Content quality is good!")
    else:
        print(f"⚠️ Content quality needs improvement")
    
    print(f"\n✅ LRT1 current state testing completed!")
    
    return {
        'test_id': lrt1.id,
        'total_questions': questions.count(),
        'difficulty_distribution': {
            'easy': easy_count,
            'medium': medium_count,
            'hard': hard_count
        },
        'max_score': actual_max,
        'content_quality': quality_percentage,
        'scoring_works': True
    }

if __name__ == "__main__":
    result = test_lrt1_current_state()
    print(f"\n📊 SUMMARY:")
    print(f"Test ID: {result['test_id']}")
    print(f"Questions: {result['total_questions']}")
    print(f"Max Score: {result['max_score']}")
    print(f"Content Quality: {result['content_quality']}%")
    print(f"Scoring Works: {result['scoring_works']}")
