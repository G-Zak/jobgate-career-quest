#!/usr/bin/env python
"""
Import competence validation tests from JSON backup
"""
import os
import sys
import django
import json
from datetime import datetime

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'careerquest.settings')
django.setup()

from testsengine.models import Test, Question
from skills.models import Skill

def import_competence_tests():
    """Import all competence validation tests from JSON"""
    try:
        print("🔄 Starting competence tests import...")
        
        # Load the JSON file
        with open('../all_tests_export_20250925_112742.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        print(f"📊 Found {data['export_info']['total_tests']} tests with {data['export_info']['total_questions']} questions")
        
        # Import tests
        imported_tests = 0
        imported_questions = 0
        
        # Create a mapping of test IDs to Test objects
        test_mapping = {}
        
        for test_data in data['tests']:
            # Create or get test
            test, created = Test.objects.get_or_create(
                title=test_data['title'],
                defaults={
                    'test_type': test_data['test_type'],
                    'description': test_data['description'],
                    'duration_minutes': test_data['duration_minutes'],
                    'total_questions': test_data['total_questions'],
                    'passing_score': test_data['passing_score'],
                    'is_active': test_data['is_active'],
                    'version': test_data.get('version', '1.0')
                }
            )
            
            if created:
                imported_tests += 1
                print(f"  ✅ Created test: {test.title}")
            
            # Map original test ID to our test object
            test_mapping[test_data['id']] = test
        
        # Import questions
        if 'questions' in data:
            print(f"📝 Importing {len(data['questions'])} questions...")
            
            for question_data in data['questions']:
                test_id = question_data.get('test_id')
                if test_id not in test_mapping:
                    continue
                
                test = test_mapping[test_id]
                
                # Create question
                question, q_created = Question.objects.get_or_create(
                    test=test,
                    question_text=question_data['question_text'],
                    defaults={
                        'question_type': question_data.get('question_type', 'multiple_choice'),
                        'difficulty_level': question_data.get('difficulty_level', 'medium'),
                        'order': question_data.get('order', 1),
                        'complexity_score': question_data.get('complexity_score', 1),
                        'explanation': question_data.get('explanation', ''),
                        'base_image_id': question_data.get('base_image_id'),
                        'passage': question_data.get('passage', ''),
                        'context': question_data.get('context', ''),
                        'main_image': question_data.get('main_image'),
                        'option_images': question_data.get('option_images', []),
                        'visual_style': question_data.get('visual_style', 'technical_3d'),
                        'correct_answer': question_data.get('correct_answer', 'A'),
                        'options': question_data.get('options', [])
                    }
                )
                
                if q_created:
                    imported_questions += 1
                    if imported_questions % 100 == 0:
                        print(f"  📝 Imported {imported_questions} questions...")
        
        print(f"✅ Import completed!")
        print(f"📊 Tests imported: {imported_tests}")
        print(f"📊 Questions imported: {imported_questions}")
        print(f"📊 Total tests in database: {Test.objects.count()}")
        print(f"📊 Total questions in database: {Question.objects.count()}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error importing tests: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == '__main__':
    import_competence_tests()
