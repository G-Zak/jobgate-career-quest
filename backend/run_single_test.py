#!/usr/bin/env python
"""
Run a single test to debug issues
"""
import os
import sys
import django
import unittest

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'careerquest.settings')
django.setup()

from testsengine.tests.test_serializers import TestSerializerTestCase

if __name__ == "__main__":
    # Create a test suite with just one test
    suite = unittest.TestSuite()
    
    # Add specific tests
    suite.addTest(TestSerializerTestCase('test_test_list_serializer'))
    suite.addTest(TestSerializerTestCase('test_test_detail_serializer'))
    suite.addTest(TestSerializerTestCase('test_question_for_test_serializer'))
    
    # Run the tests
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    
    # Print results
    if result.wasSuccessful():
        print("\n✅ All tests passed!")
    else:
        print(f"\n❌ {len(result.failures)} failures, {len(result.errors)} errors")
        for test, traceback in result.failures:
            print(f"\nFAILURE: {test}")
            print(traceback)
        for test, traceback in result.errors:
            print(f"\nERROR: {test}")
            print(traceback)
