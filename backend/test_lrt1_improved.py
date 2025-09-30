#!/usr/bin/env python
"""
Test the improved LRT1 (Logical Reasoning Test 1) functionality
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

def test_improved_lrt1():
    """Test the improved LRT1 test"""
    
    print("🔍 TESTING IMPROVED LRT1")
    print("=" * 50)
    
    # Get LRT1 test
    lrt1 = Test.objects.get(id=13)
    print(f"Test: {lrt1.title}")
    print(f"Type: {lrt1.test_type}")
    print(f"Questions: {lrt1.questions.count()}")
    print(f"Duration: {lrt1.duration_minutes} minutes")
    
    # Analyze new difficulty distribution
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
    
    # Test new question types
    print(f"\n📝 Testing New Question Types:")
    new_questions = questions.filter(order__gte=51)
    for q in new_questions:
        print(f"  Q{q.order} ({q.difficulty_level}): {q.question_text[:70]}...")
        print(f"    Answer: {q.correct_answer} ({q.options[ord(q.correct_answer) - ord('A')]})")
    
    # Get or create test user
    user, created = User.objects.get_or_create(
        username='lrt1_improved_user',
        defaults={'email': 'lrt1improved@test.com'}
    )
    
    # Clean up existing submissions
    TestSubmission.objects.filter(user=user, test=lrt1).delete()
    
    # Test 1: Test new question types specifically
    print(f"\n📝 Test 1: New question types scoring")
    
    # Select the 5 new questions
    new_questions_list = list(new_questions)
    answers_data = {}
    expected_raw_score = 0
    expected_max_score = 0
    
    print(f"Testing new questions:")
    for q in new_questions_list:
        answers_data[str(q.id)] = q.correct_answer  # All correct
        expected_raw_score += q.scoring_coefficient
        expected_max_score += q.scoring_coefficient
        print(f"  Q{q.order} ({q.difficulty_level}): Answer {q.correct_answer}")
    
    # Submit and score
    scoring_service = ScoringService()
    submission, score = scoring_service.score_test_submission(
        user=user,
        test=lrt1,
        answers_data=answers_data,
        time_taken_seconds=300
    )
    
    print(f"\nResults:")
    print(f"  Raw score: {score.raw_score} (expected: {expected_raw_score})")
    print(f"  Max possible: {score.max_possible_score} (expected: {expected_max_score})")
    print(f"  Percentage: {score.percentage_score}% (expected: 100%)")
    print(f"  Grade: {score.grade_letter}")
    print(f"  Correct: {score.correct_answers}/{score.total_questions}")
    
    # Verify individual answers
    print(f"  Individual breakdown:")
    for answer in submission.answers.all():
        q = answer.question
        print(f"    Q{q.order} ({q.difficulty_level}): {answer.selected_answer} -> "
              f"{'✅' if answer.is_correct else '❌'} ({answer.points_awarded} pts)")
    
    # Verify scoring accuracy
    assert float(score.raw_score) == expected_raw_score, f"Raw score mismatch"
    assert float(score.max_possible_score) == expected_max_score, f"Max score mismatch"
    assert float(score.percentage_score) == 100.0, f"Percentage should be 100%"
    
    print(f"✅ Test 1 passed!")
    
    # Test 2: Random selection from full pool (including new questions)
    print(f"\n📝 Test 2: Random selection from full 55-question pool")
    TestSubmission.objects.filter(user=user, test=lrt1).delete()
    
    # Select 15 random questions from the full pool
    selected_questions = random.sample(list(questions), 15)
    
    answers_data = {}
    expected_raw_score = 0
    expected_max_score = 0
    
    print(f"Selected questions:")
    for q in selected_questions:
        answers_data[str(q.id)] = q.correct_answer  # All correct
        expected_raw_score += q.scoring_coefficient
        expected_max_score += q.scoring_coefficient
        print(f"  Q{q.order} ({q.difficulty_level}): {q.question_text[:50]}...")
    
    submission, score = scoring_service.score_test_submission(
        user=user,
        test=lrt1,
        answers_data=answers_data,
        time_taken_seconds=900  # 15 minutes
    )
    
    print(f"\nResults:")
    print(f"  Raw score: {score.raw_score} (expected: {expected_raw_score})")
    print(f"  Max possible: {score.max_possible_score} (expected: {expected_max_score})")
    print(f"  Percentage: {score.percentage_score}% (expected: 100%)")
    print(f"  Grade: {score.grade_letter}")
    print(f"  Correct: {score.correct_answers}/{score.total_questions}")
    
    # Verify scoring
    assert float(score.raw_score) == expected_raw_score, f"Raw score mismatch"
    assert float(score.max_possible_score) == expected_max_score, f"Max score mismatch"
    assert float(score.percentage_score) == 100.0, f"Percentage should be 100%"
    
    print(f"✅ Test 2 passed!")
    
    # Test 3: Grammar verification
    print(f"\n📝 Test 3: Grammar verification")
    
    grammar_issues = []
    for q in questions:
        text = q.question_text
        if any(issue in text for issue in ['an driver', 'an merchant', 'an tourist', 'an writer', 'an professional']):
            grammar_issues.append(f"Q{q.order}: {text[:80]}...")
    
    if grammar_issues:
        print(f"❌ Grammar issues found:")
        for issue in grammar_issues:
            print(f"  {issue}")
    else:
        print(f"✅ No grammar issues found!")
    
    # Test 4: Question variety verification
    print(f"\n📝 Test 4: Question variety verification")
    
    reasoning_types = {
        'Universal Affirmative (All X are Y)': 0,
        'Universal Negative (No X are Y)': 0,
        'Conditional (If-Then)': 0,
        'Modus Tollens': 0,
        'Disjunctive Syllogism': 0,
        'Hypothetical Syllogism': 0,
        'Contradictory Premises': 0
    }
    
    for q in questions:
        text = q.question_text.lower()
        if 'all' in text and 'are' in text:
            reasoning_types['Universal Affirmative (All X are Y)'] += 1
        elif 'no' in text and 'are' in text:
            reasoning_types['Universal Negative (No X are Y)'] += 1
        elif 'if' in text and 'then' in text:
            reasoning_types['Conditional (If-Then)'] += 1
            if 'not present' in text or 'not open' in text:
                reasoning_types['Modus Tollens'] += 1
            elif 'if people visit' in text and 'if the weather' in text:
                reasoning_types['Hypothetical Syllogism'] += 1
        elif 'either' in text and 'or' in text:
            reasoning_types['Disjunctive Syllogism'] += 1
        elif q.correct_answer == 'D':
            reasoning_types['Contradictory Premises'] += 1
    
    print(f"Logical reasoning types covered:")
    total_types = 0
    for rtype, count in reasoning_types.items():
        if count > 0:
            print(f"  ✅ {rtype}: {count} questions")
            total_types += 1
        else:
            print(f"  ❌ {rtype}: 0 questions")
    
    print(f"\nVariety Score: {total_types}/7 reasoning types covered")
    
    print(f"\n✅ LRT1 improved testing completed!")
    
    return {
        'total_questions': questions.count(),
        'grammar_issues': len(grammar_issues),
        'reasoning_types_covered': total_types,
        'max_score': actual_max,
        'scoring_works': True
    }

if __name__ == "__main__":
    result = test_improved_lrt1()
    print(f"\n📊 FINAL SUMMARY:")
    print(f"Total Questions: {result['total_questions']}")
    print(f"Grammar Issues: {result['grammar_issues']}")
    print(f"Reasoning Types: {result['reasoning_types_covered']}/7")
    print(f"Max Score: {result['max_score']}")
    print(f"Scoring Works: {result['scoring_works']}")
    
    if result['grammar_issues'] == 0 and result['reasoning_types_covered'] >= 6:
        print(f"🎉 LRT1 is now fully improved and ready for use!")
    else:
        print(f"⚠️ Some improvements may still be needed")
