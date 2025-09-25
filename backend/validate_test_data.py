#!/usr/bin/env python3
"""
Validation script to check test data integrity
"""

import os
import sys
import django
from pathlib import Path

# Setup Django environment
backend_dir = Path(__file__).parent
sys.path.append(str(backend_dir))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'careerquest.settings')
django.setup()

from testsengine.models import Test, Question
from skills.models import Skill

def validate_test_data():
    """Validate that test data is complete and consistent"""
    
    print("🔍 Validating test data integrity...")
    
    # Check skills
    skills = Skill.objects.all()
    print(f"📊 Skills: {skills.count()}")
    
    if skills.count() == 0:
        print("❌ No skills found!")
        return False
    
    # Check tests
    tests = Test.objects.all()
    print(f"📊 Tests: {tests.count()}")
    
    if tests.count() == 0:
        print("❌ No tests found!")
        return False
    
    # Check questions
    questions = Question.objects.all()
    print(f"📊 Questions: {questions.count()}")
    
    if questions.count() == 0:
        print("❌ No questions found!")
        return False
    
    # Check question options (stored in JSON field)
    questions_with_options = questions.filter(options__isnull=False).exclude(options=[])
    print(f"📊 Questions with Options: {questions_with_options.count()}")
    
    # Check test types
    test_types = tests.values_list('test_type', flat=True).distinct()
    print(f"📊 Test Types: {list(test_types)}")
    
    # Check technical tests specifically
    technical_tests = tests.filter(test_type='technical')
    print(f"📊 Technical Tests: {technical_tests.count()}")
    
    # Check questions per test
    for test in tests[:5]:  # Check first 5 tests
        test_questions = questions.filter(test=test)
        print(f"   📝 {test.title}: {test_questions.count()} questions")
    
    # Validate data consistency
    issues = []
    
    # Check for tests without questions
    for test in tests:
        test_questions = questions.filter(test=test)
        if test_questions.count() == 0:
            issues.append(f"Test '{test.title}' has no questions")
    
    # Check for questions without options
    for question in questions[:10]:  # Check first 10 questions
        if not question.options or len(question.options) == 0:
            issues.append(f"Question '{question.question_text[:50]}...' has no options")
    
    if issues:
        print("\n❌ Issues found:")
        for issue in issues:
            print(f"   - {issue}")
        return False
    
    print("\n✅ Test data validation passed!")
    return True

def main():
    print("🚀 Starting test data validation...")
    
    is_valid = validate_test_data()
    
    if is_valid:
        print("\n🎉 All test data is valid and ready for merging!")
    else:
        print("\n⚠️ Test data validation failed!")
        print("🔄 Run setup_tests_for_merge.py to fix issues")
    
    return is_valid

if __name__ == '__main__':
    main()
