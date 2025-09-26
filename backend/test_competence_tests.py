#!/usr/bin/env python
"""
Test competence validation tests functionality
"""
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'careerquest.settings')
django.setup()

from testsengine.models import Test, Question

def test_competence_tests():
    """Test that competence tests are working correctly"""
    print("🧪 Testing competence validation tests...")
    
    # Test different types of tests
    test_types = [
        'verbal_reasoning',
        'numerical_reasoning', 
        'abstract_reasoning',
        'spatial_reasoning',
        'diagrammatic_reasoning',
        'logical_reasoning',
        'situational_judgment',
        'technical'
    ]
    
    for test_type in test_types:
        tests = Test.objects.filter(test_type=test_type, is_active=True)
        questions = Question.objects.filter(test__test_type=test_type)
        
        print(f"  📊 {test_type}: {tests.count()} tests, {questions.count()} questions")
        
        # Test a few questions from each type
        if questions.exists():
            sample_question = questions.first()
            print(f"    ✅ Sample question: {sample_question.question_text[:50]}...")
            print(f"    ✅ Options: {len(sample_question.options)} options")
            print(f"    ✅ Correct answer: {sample_question.correct_answer}")
    
    # Test specific test types that were mentioned
    print("\n🔍 Testing specific test types:")
    
    # Numerical reasoning
    numerical_tests = Test.objects.filter(test_type='numerical_reasoning', is_active=True)
    print(f"  📈 Numerical Reasoning: {numerical_tests.count()} tests")
    for test in numerical_tests:
        questions_count = Question.objects.filter(test=test).count()
        print(f"    - {test.title}: {questions_count} questions")
    
    # Abstract reasoning  
    abstract_tests = Test.objects.filter(test_type='abstract_reasoning', is_active=True)
    print(f"  🔺 Abstract Reasoning: {abstract_tests.count()} tests")
    for test in abstract_tests:
        questions_count = Question.objects.filter(test=test).count()
        print(f"    - {test.title}: {questions_count} questions")
    
    # Spatial reasoning
    spatial_tests = Test.objects.filter(test_type='spatial_reasoning', is_active=True)
    print(f"  🧩 Spatial Reasoning: {spatial_tests.count()} tests")
    for test in spatial_tests:
        questions_count = Question.objects.filter(test=test).count()
        print(f"    - {test.title}: {questions_count} questions")
    
    print(f"\n✅ Total tests in database: {Test.objects.count()}")
    print(f"✅ Total questions in database: {Question.objects.count()}")
    
    return True

if __name__ == '__main__':
    test_competence_tests()

