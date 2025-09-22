from django.core.management.base import BaseCommand
from django.db import transaction
from django.db.models import Max
from testsengine.models import Test, Question

class Command(BaseCommand):
    help = 'Fixes VRT test organization to ensure each test has the correct type of questions'

    def handle(self, *args, **options):
        self.stdout.write('🔍 Auditing VRT Tests Organization...')
        
        # Define the correct VRT test structure
        vrt_tests = {
            1: {
                'title': 'VRT1 - Reading Comprehension',
                'description': 'Test your reading comprehension and verbal reasoning skills',
                'question_type': 'reading_comprehension',
                'expected_questions': 20
            },
            2: {
                'title': 'VRT2 - Verbal Analogies', 
                'description': 'Comprehensive analogies across 9 different types',
                'question_type': 'analogies',
                'expected_questions': 26
            },
            3: {
                'title': 'VRT3 - Verbal Classification',
                'description': 'Word classification and categorization skills',
                'question_type': 'verbal_classification',
                'expected_questions': 25
            },
            4: {
                'title': 'VRT4 - Coding & Decoding',
                'description': 'Coding and decoding patterns and sequences',
                'question_type': 'coding_decoding',
                'expected_questions': 25
            },
            5: {
                'title': 'VRT5 - Blood Relations',
                'description': 'Family relationships and blood relation problems',
                'question_type': 'blood_relations',
                'expected_questions': 30
            }
        }

        # Current test assignments (what we have now)
        current_assignments = {
            1: 'reading_comprehension',  # VRT1 - Correct
            5: 'analogies',              # Should be VRT3
            6: 'analogies',              # Should be VRT2
            7: 'coding_decoding',        # Should be VRT4
            8: 'blood_relations'         # Should be VRT5
        }

        self.stdout.write('\n📊 Current Test Assignments:')
        for test_id, question_type in current_assignments.items():
            test = Test.objects.filter(id=test_id).first()
            question_count = Question.objects.filter(test_id=test_id).count()
            self.stdout.write(f'  Test {test_id}: {test.title if test else "Not found"} - {question_count} questions ({question_type})')

        self.stdout.write('\n🎯 Target VRT Test Structure:')
        for vrt_num, config in vrt_tests.items():
            self.stdout.write(f'  VRT{vrt_num}: {config["title"]} - {config["description"]} ({config["expected_questions"]} questions)')

        # Auto-confirm for automated execution
        self.stdout.write('\n✅ Proceeding with reorganization...')

        with transaction.atomic():
            self.stdout.write('\n🔄 Reorganizing VRT Tests...')
            
            # Step 1: Update test metadata
            self.stdout.write('\n1️⃣ Updating test metadata...')
            for vrt_num, config in vrt_tests.items():
                test, created = Test.objects.get_or_create(
                    id=vrt_num,
                    defaults={
                        'title': config['title'],
                        'description': config['description'],
                        'test_type': 'verbal_reasoning',
                        'duration_minutes': 25,
                        'total_questions': config['expected_questions'],
                        'is_active': True
                    }
                )
                if not created:
                    test.title = config['title']
                    test.description = config['description']
                    test.test_type = 'verbal_reasoning'
                    test.duration_minutes = 25
                    test.total_questions = config['expected_questions']
                    test.is_active = True
                    test.save()
                self.stdout.write(f'  ✅ Updated Test {vrt_num}: {config["title"]}')

            # Step 2: Move questions to correct tests
            self.stdout.write('\n2️⃣ Moving questions to correct tests...')
            
            # Move analogies from test 5 to test 2 (VRT2)
            analogies_from_5 = Question.objects.filter(test_id=5, question_type='analogies')
            if analogies_from_5.exists():
                # Get max order in target test
                max_order = Question.objects.filter(test_id=2).aggregate(max_order=Max('order'))['max_order'] or 0
                for i, q in enumerate(analogies_from_5):
                    q.order = max_order + i + 1
                    q.test_id = 2
                    q.save()
                self.stdout.write(f'  ✅ Moved {analogies_from_5.count()} analogies from Test 5 to Test 2 (VRT2)')
            
            # Move analogies from test 6 to test 2 (VRT2) - keep existing ones
            analogies_from_6 = Question.objects.filter(test_id=6, question_type='analogies')
            if analogies_from_6.exists():
                # Update order to continue from existing questions
                max_order = Question.objects.filter(test_id=2).aggregate(max_order=Max('order'))['max_order'] or 0
                for i, q in enumerate(analogies_from_6):
                    q.order = max_order + i + 1
                    q.test_id = 2
                    q.save()
                self.stdout.write(f'  ✅ Moved {analogies_from_6.count()} analogies from Test 6 to Test 2 (VRT2)')

            # Move coding & decoding from test 7 to test 4 (VRT4)
            coding_from_7 = Question.objects.filter(test_id=7, question_type='coding_decoding')
            if coding_from_7.exists():
                max_order = Question.objects.filter(test_id=4).aggregate(max_order=Max('order'))['max_order'] or 0
                for i, q in enumerate(coding_from_7):
                    q.order = max_order + i + 1
                    q.test_id = 4
                    q.save()
                self.stdout.write(f'  ✅ Moved {coding_from_7.count()} coding questions from Test 7 to Test 4 (VRT4)')

            # Move blood relations from test 8 to test 5 (VRT5)
            blood_from_8 = Question.objects.filter(test_id=8, question_type='blood_relations')
            if blood_from_8.exists():
                max_order = Question.objects.filter(test_id=5).aggregate(max_order=Max('order'))['max_order'] or 0
                for i, q in enumerate(blood_from_8):
                    q.order = max_order + i + 1
                    q.test_id = 5
                    q.save()
                self.stdout.write(f'  ✅ Moved {blood_from_8.count()} blood relation questions from Test 8 to Test 5 (VRT5)')

            # Step 3: Create VRT3 (Verbal Classification) if needed
            self.stdout.write('\n3️⃣ Setting up VRT3 (Verbal Classification)...')
            vrt3_questions = Question.objects.filter(test_id=3)
            if not vrt3_questions.exists():
                # Create some verbal classification questions
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
                self.stdout.write(f'  ✅ Created {len(classification_questions)} verbal classification questions for VRT3')

            # Step 4: Reorder all questions
            self.stdout.write('\n4️⃣ Reordering questions...')
            for test_id in [1, 2, 3, 4, 5]:
                questions = Question.objects.filter(test_id=test_id).order_by('id')
                for i, question in enumerate(questions, 1):
                    question.order = i
                    question.save()
                self.stdout.write(f'  ✅ Reordered {questions.count()} questions in Test {test_id}')

        # Final audit
        self.stdout.write('\n📋 Final VRT Test Audit:')
        for test_id in [1, 2, 3, 4, 5]:
            test = Test.objects.filter(id=test_id).first()
            question_count = Question.objects.filter(test_id=test_id).count()
            if test:
                self.stdout.write(f'  ✅ Test {test_id}: {test.title} - {question_count} questions')
            else:
                self.stdout.write(f'  ❌ Test {test_id}: Not found')

        self.stdout.write('\n🎉 VRT Tests reorganization completed!')
        self.stdout.write('\n📝 Summary:')
        self.stdout.write('  VRT1: Reading Comprehension (Test ID 1)')
        self.stdout.write('  VRT2: Verbal Analogies (Test ID 2)')
        self.stdout.write('  VRT3: Verbal Classification (Test ID 3)')
        self.stdout.write('  VRT4: Coding & Decoding (Test ID 4)')
        self.stdout.write('  VRT5: Blood Relations (Test ID 5)')
