from django.core.management.base import BaseCommand
from django.db import transaction
from testsengine.models import Test, Question

class Command(BaseCommand):
    help = 'Cleans up VRT tests organization'

    def handle(self, *args, **options):
        self.stdout.write('🧹 Cleaning up VRT Tests...')
        
        with transaction.atomic():
            # Clear all VRT tests first
            for test_id in [1, 2, 3, 4, 5]:
                Question.objects.filter(test_id=test_id).delete()
                self.stdout.write(f'  ✅ Cleared Test {test_id}')
            
            # VRT1: Reading Comprehension (keep existing)
            reading_questions = Question.objects.filter(question_type='reading_comprehension')
            for i, q in enumerate(reading_questions, 1):
                q.test_id = 1
                q.order = i
                q.save()
            self.stdout.write(f'  ✅ VRT1: {reading_questions.count()} reading comprehension questions')
            
            # VRT2: Analogies (keep existing)
            analogy_questions = Question.objects.filter(question_type='analogies')
            for i, q in enumerate(analogy_questions, 1):
                q.test_id = 2
                q.order = i
                q.save()
            self.stdout.write(f'  ✅ VRT2: {analogy_questions.count()} analogy questions')
            
            # VRT3: Verbal Classification (create new)
            classification_questions = [
                {
                    'question_text': 'Choose the word which is least like the others.',
                    'options': ['curd', 'butter', 'oil', 'cheese', 'cream'],
                    'correct_answer': 'C',
                    'difficulty': 'easy',
                    'explanation': 'Oil is the only non-dairy product in the list.'
                },
                {
                    'question_text': 'Which word does not belong with the others?',
                    'options': ['apple', 'banana', 'carrot', 'orange', 'grape'],
                    'correct_answer': 'C',
                    'difficulty': 'easy',
                    'explanation': 'Carrot is a vegetable, while the others are fruits.'
                },
                {
                    'question_text': 'Find the odd one out.',
                    'options': ['pen', 'pencil', 'eraser', 'paper', 'notebook'],
                    'correct_answer': 'D',
                    'difficulty': 'medium',
                    'explanation': 'Paper is a writing surface, while the others are writing tools.'
                },
                {
                    'question_text': 'Which word is different from the others?',
                    'options': ['dog', 'cat', 'bird', 'fish', 'tree'],
                    'correct_answer': 'E',
                    'difficulty': 'easy',
                    'explanation': 'Tree is a plant, while the others are animals.'
                },
                {
                    'question_text': 'Select the word that does not belong.',
                    'options': ['red', 'blue', 'green', 'yellow', 'sweet'],
                    'correct_answer': 'E',
                    'difficulty': 'easy',
                    'explanation': 'Sweet is a taste, while the others are colors.'
                }
            ]
            
            for i, q_data in enumerate(classification_questions, 1):
                Question.objects.create(
                    test_id=3,
                    question_type='verbal_classification',
                    question_text=q_data['question_text'],
                    options=q_data['options'],
                    correct_answer=q_data['correct_answer'],
                    difficulty_level=q_data['difficulty'],
                    order=i,
                    explanation=q_data['explanation']
                )
            self.stdout.write(f'  ✅ VRT3: {len(classification_questions)} verbal classification questions')
            
            # VRT4: Coding & Decoding (move from test 7)
            coding_questions = Question.objects.filter(test_id=7, question_type='logical_deduction')
            for i, q in enumerate(coding_questions, 1):
                q.test_id = 4
                q.question_type = 'coding_decoding'
                q.order = i
                q.save()
            self.stdout.write(f'  ✅ VRT4: {coding_questions.count()} coding & decoding questions')
            
            # VRT5: Blood Relations (move from test 8)
            blood_questions = Question.objects.filter(test_id=8, question_type='logical_deduction')
            for i, q in enumerate(blood_questions, 1):
                q.test_id = 5
                q.question_type = 'blood_relations'
                q.order = i
                q.save()
            self.stdout.write(f'  ✅ VRT5: {blood_questions.count()} blood relation questions')
            
            # Update test metadata
            test_configs = {
                1: {'title': 'VRT1 - Reading Comprehension', 'description': 'Test your reading comprehension and verbal reasoning skills', 'total_questions': max(reading_questions.count(), 1)},
                2: {'title': 'VRT2 - Verbal Analogies', 'description': 'Comprehensive analogies across 9 different types', 'total_questions': max(analogy_questions.count(), 1)},
                3: {'title': 'VRT3 - Verbal Classification', 'description': 'Word classification and categorization skills', 'total_questions': max(len(classification_questions), 1)},
                4: {'title': 'VRT4 - Coding & Decoding', 'description': 'Coding and decoding patterns and sequences', 'total_questions': max(coding_questions.count(), 1)},
                5: {'title': 'VRT5 - Blood Relations', 'description': 'Family relationships and blood relation problems', 'total_questions': max(blood_questions.count(), 1)}
            }
            
            for test_id, config in test_configs.items():
                test, created = Test.objects.get_or_create(
                    id=test_id,
                    defaults={
                        'title': config['title'],
                        'description': config['description'],
                        'test_type': 'verbal_reasoning',
                        'duration_minutes': 25,
                        'total_questions': config['total_questions'],
                        'is_active': True
                    }
                )
                if not created:
                    test.title = config['title']
                    test.description = config['description']
                    test.test_type = 'verbal_reasoning'
                    test.duration_minutes = 25
                    test.total_questions = config['total_questions']
                    test.is_active = True
                    test.save()
                self.stdout.write(f'  ✅ Updated Test {test_id}: {config["title"]}')

        # Final audit
        self.stdout.write('\n📋 Final VRT Test Audit:')
        for test_id in [1, 2, 3, 4, 5]:
            test = Test.objects.filter(id=test_id).first()
            question_count = Question.objects.filter(test_id=test_id).count()
            if test:
                self.stdout.write(f'  ✅ Test {test_id}: {test.title} - {question_count} questions')
            else:
                self.stdout.write(f'  ❌ Test {test_id}: Not found')

        self.stdout.write('\n🎉 VRT Tests cleanup completed!')
