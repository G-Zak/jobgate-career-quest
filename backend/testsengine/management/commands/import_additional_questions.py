"""
Django management command to import additional test questions from JSONL files
"""
import json
import os
from django.core.management.base import BaseCommand
from django.db import transaction, models
from testsengine.models import Test, Question
from django.conf import settings


class Command(BaseCommand):
    help = 'Import additional test questions from JSONL files'

    def add_arguments(self, parser):
        parser.add_argument(
            '--file',
            type=str,
            help='Specific JSONL file to import',
        )
        parser.add_argument(
            '--test-type',
            type=str,
            help='Test type to import questions for',
        )
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Show what would be imported without actually importing',
        )

    def handle(self, *args, **options):
        self.dry_run = options['dry_run']
        
        if self.dry_run:
            self.stdout.write(self.style.WARNING('DRY RUN MODE - No data will be imported'))
        
        # Define the base path for data files
        base_path = os.path.join(settings.BASE_DIR, '..', 'frontend', 'src', 'features', 'skills-assessment', 'data')
        
        # Define import mappings
        import_mappings = {
            'verbal_reasoning': [
                {
                    'file': 'verbal_analogy_dataset.jsonl',
                    'test_id': 5,  # Verbal Analogies
                    'question_type': 'multiple_choice',
                    'difficulty_mapping': {'easy': 'easy', 'medium': 'medium', 'hard': 'hard'}
                },
                {
                    'file': 'verbal_classification_dataset.jsonl',
                    'test_id': 6,  # Verbal Classification
                    'question_type': 'multiple_choice',
                    'difficulty_mapping': {'easy': 'easy', 'medium': 'medium', 'hard': 'hard'}
                },
                {
                    'file': 'verbal_coding_decoding_dataset.jsonl',
                    'test_id': 7,  # Coding & Decoding
                    'question_type': 'multiple_choice',
                    'difficulty_mapping': {'easy': 'easy', 'medium': 'medium', 'hard': 'hard'}
                },
                {
                    'file': 'verbalReasoningVRT7.jsonl',
                    'test_id': 8,  # Blood Relations
                    'question_type': 'multiple_choice',
                    'difficulty_mapping': {'easy': 'easy', 'medium': 'medium', 'hard': 'hard'}
                }
            ],
            'situational_judgment': [
                {
                    'file': 'db-migration/situational-judgment/sjt_questions.jsonl',
                    'test_id': 4,  # Situational Judgment Test
                    'question_type': 'multiple_choice',
                    'difficulty_mapping': {'easy': 'easy', 'medium': 'medium', 'hard': 'hard'}
                }
            ]
        }
        
        # If specific file is provided, import only that file
        if options['file']:
            self.import_specific_file(base_path, options['file'])
        elif options['test_type']:
            if options['test_type'] in import_mappings:
                for mapping in import_mappings[options['test_type']]:
                    self.import_questions_from_file(base_path, mapping)
            else:
                self.stdout.write(self.style.ERROR(f'Unknown test type: {options["test_type"]}'))
        else:
            # Import all available data
            for test_type, mappings in import_mappings.items():
                self.stdout.write(self.style.SUCCESS(f'\n=== Importing {test_type.upper()} questions ==='))
                for mapping in mappings:
                    self.import_questions_from_file(base_path, mapping)

    def import_specific_file(self, base_path, filename):
        """Import questions from a specific file"""
        file_path = os.path.join(base_path, filename)
        
        if not os.path.exists(file_path):
            self.stdout.write(self.style.ERROR(f'File not found: {file_path}'))
            return
        
        # Try to determine test type and mapping from filename
        if 'analogy' in filename:
            mapping = {'test_id': 5, 'question_type': 'multiple_choice', 'difficulty_mapping': {'easy': 'easy', 'medium': 'medium', 'hard': 'hard'}}
        elif 'classification' in filename:
            mapping = {'test_id': 6, 'question_type': 'multiple_choice', 'difficulty_mapping': {'easy': 'easy', 'medium': 'medium', 'hard': 'hard'}}
        elif 'coding' in filename:
            mapping = {'test_id': 7, 'question_type': 'multiple_choice', 'difficulty_mapping': {'easy': 'easy', 'medium': 'medium', 'hard': 'hard'}}
        elif 'blood' in filename or 'VRT7' in filename:
            mapping = {'test_id': 8, 'question_type': 'multiple_choice', 'difficulty_mapping': {'easy': 'easy', 'medium': 'medium', 'hard': 'hard'}}
        elif 'sjt' in filename:
            mapping = {'test_id': 4, 'question_type': 'multiple_choice', 'difficulty_mapping': {'easy': 'easy', 'medium': 'medium', 'hard': 'hard'}}
        else:
            self.stdout.write(self.style.ERROR(f'Cannot determine test type for file: {filename}'))
            return
        
        self.import_questions_from_file(base_path, mapping, filename)

    def import_questions_from_file(self, base_path, mapping, filename=None):
        """Import questions from a JSONL file"""
        file_path = os.path.join(base_path, filename or mapping['file'])
        
        if not os.path.exists(file_path):
            self.stdout.write(self.style.WARNING(f'File not found: {file_path}'))
            return
        
        try:
            test = Test.objects.get(id=mapping['test_id'])
            self.stdout.write(f'Importing to test: {test.title} (ID: {test.id})')
        except Test.DoesNotExist:
            self.stdout.write(self.style.ERROR(f'Test with ID {mapping["test_id"]} not found'))
            return
        
        questions_imported = 0
        questions_skipped = 0
        
        with open(file_path, 'r', encoding='utf-8') as f:
            for line_num, line in enumerate(f, 1):
                line = line.strip()
                if not line:
                    continue
                
                try:
                    question_data = json.loads(line)
                    
                    if self.dry_run:
                        question_text = question_data.get('question', question_data.get('question_text', question_data.get('stem', 'No question text')))
                        self.stdout.write(f'Would import: {question_text[:50]}...')
                        questions_imported += 1
                        continue
                    
                    # Process the question data
                    processed_question = self.process_question_data(question_data, mapping)
                    
                    if processed_question:
                        with transaction.atomic():
                            # Check if question already exists
                            existing_question = Question.objects.filter(
                                test=test,
                                question_text=processed_question['question_text']
                            ).first()
                            
                            if existing_question:
                                questions_skipped += 1
                                self.stdout.write(f'  - Skipped (exists): {processed_question["question_text"][:50]}...')
                            else:
                                # Create new question
                                question = Question.objects.create(
                                    test=test,
                                    **{k: v for k, v in processed_question.items() if k != 'test_id'}
                                )
                                questions_imported += 1
                                self.stdout.write(f'  ✓ Imported: {processed_question["question_text"][:50]}...')
                    
                except json.JSONDecodeError as e:
                    self.stdout.write(self.style.WARNING(f'Invalid JSON on line {line_num}: {e}'))
                    continue
                except Exception as e:
                    self.stdout.write(self.style.ERROR(f'Error processing line {line_num}: {e}'))
                    continue
        
        self.stdout.write(self.style.SUCCESS(f'Import completed: {questions_imported} imported, {questions_skipped} skipped'))

    def process_question_data(self, data, mapping):
        """Process question data from JSONL file"""
        try:
            # Extract question text (try multiple field names)
            question_text = data.get('question', data.get('question_text', data.get('stem', data.get('scenario', ''))))
            if not question_text:
                return None
            
            # Extract options (try multiple field names)
            options = []
            if 'options' in data and isinstance(data['options'], list):
                options = data['options']
            elif 'choices' in data and isinstance(data['choices'], list):
                options = data['choices']
            else:
                # Try to extract from individual option fields
                for i in range(1, 5):  # A, B, C, D
                    option_key = f'option_{chr(96 + i)}'  # option_a, option_b, etc.
                    if option_key in data and data[option_key]:
                        options.append(data[option_key])
            
            if len(options) < 2:
                self.stdout.write(self.style.WARNING(f'Insufficient options for question: {question_text[:50]}...'))
                return None
            
            # Extract correct answer (try multiple field names and methods)
            correct_answer = data.get('correct_answer', data.get('answer', data.get('answer_text', '')))
            correct_answer_index = None
            
            # Method 1: Direct answer text match
            if correct_answer:
                for i, option in enumerate(options):
                    if option.strip().lower() == correct_answer.strip().lower():
                        correct_answer_index = chr(65 + i)  # A, B, C, D
                        break
            
            # Method 2: Answer index
            if correct_answer_index is None and 'answer_index' in data:
                answer_idx = data['answer_index']
                if isinstance(answer_idx, int) and 0 <= answer_idx < len(options):
                    correct_answer_index = chr(65 + answer_idx)
            
            # Method 3: Try to match by first letter
            if correct_answer_index is None and correct_answer:
                for i, option in enumerate(options):
                    if option.strip().lower().startswith(correct_answer.strip().lower()):
                        correct_answer_index = chr(65 + i)
                        break
            
            if correct_answer_index is None:
                self.stdout.write(self.style.WARNING(f'Could not determine correct answer for question: {question_text[:50]}...'))
                return None
            
            # Extract difficulty
            difficulty = data.get('difficulty', data.get('difficulty_level', 'medium'))
            if difficulty in mapping['difficulty_mapping']:
                difficulty = mapping['difficulty_mapping'][difficulty]
            
            # Extract explanation
            explanation = data.get('explanation', data.get('explanation_text', ''))
            
            # Extract context
            context = data.get('context', data.get('scenario', ''))
            
            # Get next order number
            max_order = Question.objects.filter(test_id=mapping['test_id']).aggregate(
                max_order=models.Max('order')
            )['max_order'] or 0
            
            return {
                'test_id': mapping['test_id'],
                'question_type': mapping['question_type'],
                'question_text': question_text,
                'options': options,
                'correct_answer': correct_answer_index,
                'explanation': explanation,
                'context': context,
                'difficulty_level': difficulty,
                'order': max_order + 1,
                'visual_style': 'standard'
            }
            
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error processing question data: {e}'))
            return None

    def get_scoring_coefficient(self, difficulty):
        """Get scoring coefficient based on difficulty"""
        coefficients = {
            'easy': 1.0,
            'medium': 1.5,
            'hard': 2.0
        }
        return coefficients.get(difficulty, 1.5)
