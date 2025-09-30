#!/usr/bin/env python
"""
Test scoring for all test types to ensure no regression
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

def test_all_test_types():
    """Test scoring for different test types"""
    
    print("🔍 TESTING ALL TEST TYPES SCORING")
    print("=" * 50)
    
    # Test cases: (test_id, test_name, expected_type)
    test_cases = [
        (21, 'NRT1 - Numerical Reasoning', 'numerical_reasoning'),
        (13, 'LRT1 - Logical Reasoning', 'logical_reasoning'),
        (10, 'ART1 - Abstract Reasoning', 'abstract_reasoning'),
        (30, 'SJT1 - Situational Judgment', 'situational_judgment'),
    ]
    
    # Get or create test user
    user, created = User.objects.get_or_create(
        username='all_types_test_user',
        defaults={'email': 'alltypes@test.com'}
    )
    
    scoring_service = ScoringService()
    results = []
    
    for test_id, test_name, test_type in test_cases:
        try:
            print(f"\n📝 Testing {test_name}")
            print("-" * 40)
            
            test = Test.objects.get(id=test_id)
            print(f"Test Type: {test.test_type}")
            
            # Clean up existing submissions
            TestSubmission.objects.filter(user=user, test=test).delete()
            
            # Get first 3 questions for quick testing
            questions = list(test.questions.all()[:3])
            if not questions:
                print(f"⚠️ No questions found for {test_name}")
                continue
                
            print(f"Testing with {len(questions)} questions:")
            
            # Test all correct answers
            answers_data = {}
            expected_raw_score = 0
            
            for q in questions:
                answers_data[str(q.id)] = q.correct_answer
                expected_raw_score += q.scoring_coefficient
                print(f"  Q{q.order} ({q.difficulty_level}): coeff={q.scoring_coefficient}")
            
            # Submit and score
            submission, score = scoring_service.score_test_submission(
                user=user,
                test=test,
                answers_data=answers_data,
                time_taken_seconds=300
            )
            
            print(f"Results:")
            print(f"  Raw Score: {score.raw_score} (expected: {expected_raw_score})")
            print(f"  Max Possible: {score.max_possible_score}")
            print(f"  Percentage: {score.percentage_score}%")
            print(f"  Grade: {score.grade_letter}")
            print(f"  Correct: {score.correct_answers}/{score.total_questions}")
            
            # Verify scoring
            is_correct = (
                float(score.raw_score) == expected_raw_score and
                float(score.max_possible_score) == expected_raw_score and
                float(score.percentage_score) == 100.0 and
                score.correct_answers == len(questions)
            )
            
            if is_correct:
                print(f"✅ {test_name} scoring is correct!")
                results.append((test_name, True, None))
            else:
                error_msg = f"Scoring mismatch for {test_name}"
                print(f"❌ {error_msg}")
                results.append((test_name, False, error_msg))
                
        except Exception as e:
            error_msg = f"Error testing {test_name}: {str(e)}"
            print(f"❌ {error_msg}")
            results.append((test_name, False, error_msg))
    
    # Summary
    print(f"\n📊 SUMMARY")
    print("=" * 50)
    
    passed = 0
    failed = 0
    
    for test_name, success, error in results:
        if success:
            print(f"✅ {test_name}")
            passed += 1
        else:
            print(f"❌ {test_name}: {error}")
            failed += 1
    
    print(f"\nResults: {passed} passed, {failed} failed")
    
    if failed == 0:
        print(f"🎉 All test types are working correctly!")
        return True
    else:
        print(f"⚠️ Some test types have issues")
        return False

if __name__ == "__main__":
    success = test_all_test_types()
    if success:
        print(f"\n✅ All test types scoring is working correctly!")
    else:
        print(f"\n❌ Some test types need attention")
