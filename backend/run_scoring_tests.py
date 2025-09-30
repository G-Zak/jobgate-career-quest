#!/usr/bin/env python
"""
Run scoring service tests directly
"""
import os
import sys
import django
import unittest

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'careerquest.settings')
django.setup()

from testsengine.tests.test_scoring_service import ScoringServiceTestCase

if __name__ == "__main__":
    # Create a test suite with scoring service tests
    suite = unittest.TestSuite()
    
    # Add basic scoring tests
    try:
        suite.addTest(ScoringServiceTestCase('test_perfect_score'))
        suite.addTest(ScoringServiceTestCase('test_partial_score'))
        suite.addTest(ScoringServiceTestCase('test_zero_score'))
        suite.addTest(ScoringServiceTestCase('test_difficulty_coefficients'))
        suite.addTest(ScoringServiceTestCase('test_answer_validation'))
        suite.addTest(ScoringServiceTestCase('test_submission_validation'))
        suite.addTest(ScoringServiceTestCase('test_unique_submission_per_user_test'))
        suite.addTest(ScoringServiceTestCase('test_score_summary'))
        suite.addTest(ScoringServiceTestCase('test_max_score_calculation'))
        suite.addTest(ScoringServiceTestCase('test_question_scoring_coefficient'))
        suite.addTest(ScoringServiceTestCase('test_question_check_answer'))
        suite.addTest(ScoringServiceTestCase('test_score_grade_letter'))
        suite.addTest(ScoringServiceTestCase('test_score_passed_property'))
    except ValueError as e:
        print(f"Warning: Could not add some scoring tests: {e}")
    
    # Run the tests
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    
    # Print results
    if result.wasSuccessful():
        print(f"\n✅ All {result.testsRun} scoring tests passed!")
    else:
        print(f"\n❌ {len(result.failures)} failures, {len(result.errors)} errors out of {result.testsRun} tests")
        for test, traceback in result.failures:
            print(f"\nFAILURE: {test}")
            print(traceback)
        for test, traceback in result.errors:
            print(f"\nERROR: {test}")
            print(traceback)
    
    # Exit with appropriate code
    sys.exit(0 if result.wasSuccessful() else 1)
