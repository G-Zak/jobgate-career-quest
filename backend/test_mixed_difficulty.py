#!/usr/bin/env python
"""
Test mixed difficulty scoring for numerical reasoning test
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

def test_mixed_difficulty_scoring():
    """Test scoring with mixed difficulty questions"""
    
    print("🔍 TESTING MIXED DIFFICULTY SCORING")
    print("=" * 50)
    
    # Get test and specific questions
    test = Test.objects.get(id=21)
    easy_q = Question.objects.get(id=2558)    # Easy Q1
    medium_q = Question.objects.get(id=2566)  # Medium Q9  
    hard_q = Question.objects.get(id=2574)    # Hard Q17
    
    print(f"Test: {test.title}")
    print(f"Selected questions:")
    print(f"  Easy Q{easy_q.order}: {easy_q.difficulty_level} (coeff: {easy_q.scoring_coefficient}) - Answer: {easy_q.correct_answer}")
    print(f"  Medium Q{medium_q.order}: {medium_q.difficulty_level} (coeff: {medium_q.scoring_coefficient}) - Answer: {medium_q.correct_answer}")
    print(f"  Hard Q{hard_q.order}: {hard_q.difficulty_level} (coeff: {hard_q.scoring_coefficient}) - Answer: {hard_q.correct_answer}")
    
    # Get or create test user
    user, created = User.objects.get_or_create(
        username='mixed_difficulty_user',
        defaults={'email': 'mixed@test.com'}
    )
    
    # Clean up existing submissions
    TestSubmission.objects.filter(user=user, test=test).delete()
    
    # Test Case 1: All correct answers
    print(f"\n📝 Test Case 1: All correct answers")
    answers_data = {
        str(easy_q.id): easy_q.correct_answer,      # 1.0 points
        str(medium_q.id): medium_q.correct_answer,  # 1.5 points  
        str(hard_q.id): hard_q.correct_answer       # 2.0 points
    }
    
    scoring_service = ScoringService()
    submission, score = scoring_service.score_test_submission(
        user=user,
        test=test,
        answers_data=answers_data,
        time_taken_seconds=300
    )
    
    expected_raw_score = 1.0 + 1.5 + 2.0  # 4.5
    expected_max_score = 1.0 + 1.5 + 2.0  # 4.5
    expected_percentage = 100.0
    
    print(f"Results:")
    print(f"  Raw Score: {score.raw_score} (expected: {expected_raw_score})")
    print(f"  Max Possible: {score.max_possible_score} (expected: {expected_max_score})")
    print(f"  Percentage: {score.percentage_score}% (expected: {expected_percentage}%)")
    print(f"  Grade: {score.grade_letter}")
    print(f"  Correct: {score.correct_answers}/{score.total_questions}")
    
    # Verify individual answers
    print(f"  Individual breakdown:")
    for answer in submission.answers.all():
        q = answer.question
        print(f"    Q{q.order} ({q.difficulty_level}): {answer.selected_answer} -> "
              f"{'✅' if answer.is_correct else '❌'} ({answer.points_awarded} pts)")
    
    # Clean up for next test
    submission.delete()
    
    # Test Case 2: Only hard question correct
    print(f"\n📝 Test Case 2: Only hard question correct")
    answers_data = {
        str(easy_q.id): 'A' if easy_q.correct_answer != 'A' else 'B',    # Wrong - 0 points
        str(medium_q.id): 'A' if medium_q.correct_answer != 'A' else 'B', # Wrong - 0 points
        str(hard_q.id): hard_q.correct_answer                             # Correct - 2.0 points
    }
    
    submission, score = scoring_service.score_test_submission(
        user=user,
        test=test,
        answers_data=answers_data,
        time_taken_seconds=300
    )
    
    expected_raw_score = 2.0  # Only hard question correct
    expected_max_score = 4.5  # Same max possible
    expected_percentage = (2.0 / 4.5) * 100  # ~44.44%
    
    print(f"Results:")
    print(f"  Raw Score: {score.raw_score} (expected: {expected_raw_score})")
    print(f"  Max Possible: {score.max_possible_score} (expected: {expected_max_score})")
    print(f"  Percentage: {score.percentage_score}% (expected: ~{expected_percentage:.2f}%)")
    print(f"  Grade: {score.grade_letter}")
    print(f"  Correct: {score.correct_answers}/{score.total_questions}")
    
    # Verify individual answers
    print(f"  Individual breakdown:")
    for answer in submission.answers.all():
        q = answer.question
        print(f"    Q{q.order} ({q.difficulty_level}): {answer.selected_answer} -> "
              f"{'✅' if answer.is_correct else '❌'} ({answer.points_awarded} pts)")
    
    # Verify the fix is working
    assert float(score.raw_score) == expected_raw_score, f"Raw score mismatch: {score.raw_score} != {expected_raw_score}"
    assert float(score.max_possible_score) == expected_max_score, f"Max score mismatch: {score.max_possible_score} != {expected_max_score}"
    assert abs(float(score.percentage_score) - expected_percentage) < 0.01, f"Percentage mismatch: {score.percentage_score} != {expected_percentage:.2f}"
    
    print(f"\n✅ All tests passed! Mixed difficulty scoring is working correctly.")

if __name__ == "__main__":
    test_mixed_difficulty_scoring()
