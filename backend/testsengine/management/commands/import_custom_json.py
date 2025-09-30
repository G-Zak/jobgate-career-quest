import json
from pathlib import Path
from django.core.management.base import BaseCommand
from testsengine.models import Test, Question
from django.db import transaction

class Command(BaseCommand):
    help = 'Import tests and questions from a custom JSON export file (not a Django fixture)'

    def add_arguments(self, parser):
        parser.add_argument('json_path', type=str, help='Path to the custom JSON export file')

    def handle(self, *args, **options):
        json_path = Path(options['json_path'])
        if not json_path.exists():
            self.stdout.write(self.style.ERROR(f'File not found: {json_path}'))
            return
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        tests = data.get('tests', [])
        questions = data.get('questions', [])
        self.stdout.write(f'Found {len(tests)} tests and {len(questions)} questions.')
        test_map = {}
        with transaction.atomic():
            for t in tests:
                test_obj, created = Test.objects.get_or_create(
                    id=t['id'],
                    defaults={
                        'title': t['title'],
                        'test_type': t['test_type'],
                        'description': t.get('description', ''),
                        'duration_minutes': t.get('duration_minutes', 20),
                        'total_questions': t.get('total_questions', 0),
                        'passing_score': t.get('passing_score', 70),
                        'is_active': t.get('is_active', True),
                        'version': t.get('version', '1.0'),
                    }
                )
                test_map[t['id']] = test_obj
            self.stdout.write(self.style.SUCCESS(f'Imported/updated {len(test_map)} tests.'))
            imported = 0
            for q in questions:
                test_obj = test_map.get(q['test_id'])
                if not test_obj:
                    continue
                Question.objects.update_or_create(
                    id=q['id'],
                    defaults={
                        'test': test_obj,
                        'question_type': q.get('question_type', 'multiple_choice'),
                        'question_text': q.get('question_text', ''),
                        'passage': q.get('passage'),
                        'context': q.get('context'),
                        'options': q.get('options', []),
                        'correct_answer': q.get('correct_answer', ''),
                        'explanation': q.get('explanation'),
                        'difficulty_level': q.get('difficulty_level', 'medium'),
                        'order': q.get('order', 1),
                        'main_image': q.get('main_image'),
                        'option_images': q.get('option_images', []),
                        'sequence_images': q.get('sequence_images', []),
                        'base_image_id': q.get('base_image_id'),
                        'overlay_ids': q.get('overlay_ids', []),
                        'transforms': q.get('transforms', {}),
                        'option_remap': q.get('option_remap', {}),
                        'visual_style': q.get('visual_style', 'technical_3d'),
                        'complexity_score': q.get('complexity_score', 1),
                    }
                )
                imported += 1
            self.stdout.write(self.style.SUCCESS(f'Imported/updated {imported} questions.'))
