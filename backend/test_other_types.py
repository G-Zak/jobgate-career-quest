#!/usr/bin/env python
"""
Test scoring for other test types (abstract reasoning, etc.)
"""
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'careerquest.settings')
django.setup()

from django.contrib.auth.models import User
from testsengine.models import Test, TestSubmission
from testsengine.services.scoring_service import ScoringService

def test_abstract_reasoning():
    """Test abstract reasoning test scoring"""
    
    print("🔍 TESTING ABSTRACT REASONING SCORING")
    print("=" * 50)
    
    # Get abstract reasoning test
    test = Test.objects.get(id=10)  # ART1 - Abstract Reasoning
    print(f"Test: {test.title} ({test.test_type})")
    print(f"Total questions: {test.questions.count()}")
    
    # Get first 3 questions
    questions = test.questions.all()[:3]
    print(f"Testing with {len(questions)} questions:")
    for q in questions:
        print(f"  Q{q.order}: {q.difficulty_level} (coeff: {q.scoring_coefficient}) - Answer: {q.correct_answer}")
    
    # Get or create test user
    user, created = User.objects.get_or_create(
        username='abstract_test_user',
        defaults={'email': 'abstract@test.com'}
    )
    
    # Clean up existing submissions
    TestSubmission.objects.filter(user=user, test=test).delete()
    
    # Test with all correct answers
    answers_data = {}
    expected_raw_score = 0
    expected_max_score = 0
    
    for q in questions:
        answers_data[str(q.id)] = q.correct_answer
        expected_raw_score += q.scoring_coefficient
        expected_max_score += q.scoring_coefficient
    
    print(f"\n📝 Submitting all correct answers...")
    print(f"Expected raw score: {expected_raw_score}")
    print(f"Expected max score: {expected_max_score}")
    
    scoring_service = ScoringService()
    submission, score = scoring_service.score_test_submission(
        user=user,
        test=test,
        answers_data=answers_data,
        time_taken_seconds=300
    )
    
    print(f"\nResults:")
    print(f"  Raw Score: {score.raw_score} (expected: {expected_raw_score})")
    print(f"  Max Possible: {score.max_possible_score} (expected: {expected_max_score})")
    print(f"  Percentage: {score.percentage_score}% (expected: 100%)")
    print(f"  Grade: {score.grade_letter}")
    print(f"  Correct: {score.correct_answers}/{score.total_questions}")
    
    # Verify individual answers
    print(f"  Individual breakdown:")
    for answer in submission.answers.all():
        q = answer.question
        print(f"    Q{q.order} ({q.difficulty_level}): {answer.selected_answer} -> "
              f"{'✅' if answer.is_correct else '❌'} ({answer.points_awarded} pts)")
    
    # Verify results
    assert float(score.raw_score) == expected_raw_score
    assert float(score.max_possible_score) == expected_max_score
    assert float(score.percentage_score) == 100.0
    assert score.correct_answers == len(questions)
    
    print(f"\n✅ Abstract reasoning test scoring works correctly!")
    
    # Test with partial correct answers
    print(f"\n📝 Testing with 1 correct, 2 wrong...")
    TestSubmission.objects.filter(user=user, test=test).delete()
    
    # Only first question correct
    answers_data = {}
    for i, q in enumerate(questions):
        if i == 0:
            answers_data[str(q.id)] = q.correct_answer  # Correct
        else:
            # Wrong answer
            wrong_answer = 'A' if q.correct_answer != 'A' else 'B'
            answers_data[str(q.id)] = wrong_answer
    
    submission, score = scoring_service.score_test_submission(
        user=user,
        test=test,
        answers_data=answers_data,
        time_taken_seconds=300
    )
    
    expected_raw_score_partial = questions[0].scoring_coefficient  # Only first question
    expected_percentage_partial = (expected_raw_score_partial / expected_max_score) * 100
    
    print(f"Results:")
    print(f"  Raw Score: {score.raw_score} (expected: {expected_raw_score_partial})")
    print(f"  Max Possible: {score.max_possible_score} (expected: {expected_max_score})")
    print(f"  Percentage: {score.percentage_score}% (expected: ~{expected_percentage_partial:.2f}%)")
    print(f"  Grade: {score.grade_letter}")
    print(f"  Correct: {score.correct_answers}/{score.total_questions}")
    
    # Verify individual answers
    print(f"  Individual breakdown:")
    for answer in submission.answers.all():
        q = answer.question
        print(f"    Q{q.order} ({q.difficulty_level}): {answer.selected_answer} -> "
              f"{'✅' if answer.is_correct else '❌'} ({answer.points_awarded} pts)")
    
    # Verify results
    assert float(score.raw_score) == expected_raw_score_partial
    assert float(score.max_possible_score) == expected_max_score
    assert abs(float(score.percentage_score) - expected_percentage_partial) < 0.01
    assert score.correct_answers == 1
    
    print(f"\n✅ Partial scoring works correctly!")

if __name__ == "__main__":
    test_abstract_reasoning()
