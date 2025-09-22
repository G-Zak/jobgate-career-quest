from django.core.management.base import BaseCommand
from django.db import transaction
from testsengine.models import Test, Question
import random

class Command(BaseCommand):
    help = 'Standardizes all tests to have exactly 21 questions (7 passages with 3 questions each) with random selection'

    def handle(self, *args, **options):
        self.stdout.write('🎯 Standardizing all tests to 21 questions (7 passages × 3 questions)...')
        
        # Define test configurations
        test_configs = {
            1: {'title': 'VRT1 - Reading Comprehension', 'type': 'reading_comprehension', 'passages_needed': 7},
            2: {'title': 'VRT2 - Verbal Analogies', 'type': 'analogies', 'passages_needed': 7},
            3: {'title': 'VRT3 - Verbal Classification', 'type': 'verbal_classification', 'passages_needed': 7},
            4: {'title': 'VRT4 - Coding & Decoding', 'type': 'coding_decoding', 'passages_needed': 7},
            5: {'title': 'VRT5 - Blood Relations', 'type': 'blood_relations', 'passages_needed': 7},
            10: {'title': 'ART1 - Abstract Reasoning', 'type': 'abstract_reasoning', 'passages_needed': 7},
            11: {'title': 'SRT1 - Spatial Reasoning', 'type': 'spatial_reasoning', 'passages_needed': 7},
            12: {'title': 'DRT1 - Diagrammatic Reasoning', 'type': 'diagrammatic_reasoning', 'passages_needed': 7},
            13: {'title': 'LRT1 - Logical Reasoning', 'type': 'logical_reasoning', 'passages_needed': 7},
            21: {'title': 'NRT1 - Numerical Reasoning', 'type': 'numerical_reasoning', 'passages_needed': 7},
            30: {'title': 'SJT1 - Situational Judgment', 'type': 'situational_judgment', 'passages_needed': 7},
        }
        
        with transaction.atomic():
            for test_id, config in test_configs.items():
                self.stdout.write(f'\n📝 Processing Test {test_id}: {config["title"]}')
                
                # Get or create test
                test, created = Test.objects.get_or_create(
                    id=test_id,
                    defaults={
                        'title': config['title'],
                        'test_type': config['type'],
                        'duration_minutes': 25,
                        'total_questions': 21,
                        'is_active': True
                    }
                )
                
                if not created:
                    test.title = config['title']
                    test.test_type = config['type']
                    test.duration_minutes = 25
                    test.total_questions = 21
                    test.is_active = True
                    test.save()
                
                # Get existing questions
                existing_questions = list(Question.objects.filter(test_id=test_id).order_by('id'))
                self.stdout.write(f'  📊 Found {len(existing_questions)} existing questions')
                
                if len(existing_questions) >= 21:
                    # If we have enough questions, select 21 randomly
                    selected_questions = random.sample(existing_questions, 21)
                    
                    # Clear all questions and add selected ones
                    Question.objects.filter(test_id=test_id).delete()
                    
                    for i, question in enumerate(selected_questions):
                        question.id = None  # Create new ID
                        question.test_id = test_id
                        question.order = i + 1
                        question.save()
                    
                    self.stdout.write(f'  ✅ Randomly selected 21 questions from {len(existing_questions)} available')
                
                elif len(existing_questions) > 0:
                    # If we have some questions but not enough, duplicate and modify them
                    self.stdout.write(f'  ⚠️ Only {len(existing_questions)} questions available, creating variations...')
                    
                    # Clear existing questions
                    Question.objects.filter(test_id=test_id).delete()
                    
                    # Create 21 questions by duplicating and modifying existing ones
                    questions_to_create = []
                    for i in range(21):
                        base_question = existing_questions[i % len(existing_questions)]
                        
                        # Create variation of the question
                        new_question = Question(
                            test_id=test_id,
                            question_type=base_question.question_type,
                            question_text=f"{base_question.question_text} (Question {i+1})",
                            passage=base_question.passage,
                            options=base_question.options,
                            correct_answer=base_question.correct_answer,
                            difficulty_level=base_question.difficulty_level,
                            order=i + 1,
                            explanation=base_question.explanation,
                            main_image=base_question.main_image,
                            option_images=base_question.option_images
                        )
                        questions_to_create.append(new_question)
                    
                    # Bulk create questions
                    Question.objects.bulk_create(questions_to_create)
                    self.stdout.write(f'  ✅ Created 21 questions from {len(existing_questions)} base questions')
                
                else:
                    # If no questions exist, create sample questions
                    self.stdout.write(f'  ⚠️ No questions found, creating sample questions...')
                    self._create_sample_questions(test_id, config)
                    self.stdout.write(f'  ✅ Created 21 sample questions')
        
        self.stdout.write('\n🎉 All tests standardized to 21 questions!')
        self.stdout.write('📊 Final Test Structure:')
        
        for test_id in sorted(test_configs.keys()):
            test = Test.objects.get(id=test_id)
            question_count = test.questions.count()
            self.stdout.write(f'  Test {test_id}: {test.title} - {question_count} questions')

    def _create_sample_questions(self, test_id, config):
        """Create 21 sample questions for a test"""
        sample_questions = []
        
        for i in range(21):
            passage_num = (i // 3) + 1
            question_num = (i % 3) + 1
            
            if config['type'] == 'reading_comprehension':
                passage_text = f"This is sample passage {passage_num} for {config['title']}. It contains information that will be used to answer the following questions. The content is designed to test reading comprehension skills and understanding of written material."
                
                sample_questions.append(Question(
                    test_id=test_id,
                    question_type='reading_comprehension',
                    question_text=f"What is the main topic of passage {passage_num}?",
                    passage=passage_text,
                    options=['Option A', 'Option B', 'Option C', 'Option D'],
                    correct_answer='A',
                    difficulty_level='medium',
                    order=i + 1,
                    explanation=f"This question tests understanding of passage {passage_num}."
                ))
            else:
                # For other test types, create appropriate sample questions
                sample_questions.append(Question(
                    test_id=test_id,
                    question_type=config['type'],
                    question_text=f"Sample question {i+1} for {config['title']}?",
                    options=['Option A', 'Option B', 'Option C', 'Option D'],
                    correct_answer='A',
                    difficulty_level='medium',
                    order=i + 1,
                    explanation=f"This is a sample question for {config['title']}."
                ))
        
        Question.objects.bulk_create(sample_questions)
