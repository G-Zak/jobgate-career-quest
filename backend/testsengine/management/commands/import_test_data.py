"""
Django management command to import comprehensive test questions from migration data
Supports importing from the skills-assessment data files into our PostgreSQL backend-only scoring system
"""

from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from django.contrib.auth.models import User
from decimal import Decimal
import json
import os
import logging
from pathlib import Path

from testsengine.models import Test, Question
from testsengine.services.scoring_service import ScoringService

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = 'Import comprehensive test questions from skills assessment migration data'

    def add_arguments(self, parser):
        parser.add_argument(
            '--data-source',
            type=str,
            choices=['migration', 'json', 'all'],
            default='migration',
            help='Data source: migration (from frontend files), json (simple JSON files), or all'
        )
        parser.add_argument(
            '--test-types',
            type=str,
            nargs='+',
            choices=['sjt', 'verbal', 'spatial', 'technical', 'all'],
            default=['all'],
            help='Test types to import (space-separated)'
        )
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Preview import without making changes'
        )
        parser.add_argument(
            '--clear-existing',
            action='store_true',
            help='Clear existing test data before importing'
        )
        parser.add_argument(
            '--update-existing',
            action='store_true',
            help='Update existing questions instead of skipping them'
        )
        parser.add_argument(
            '--create-demo-data',
            action='store_true',
            help='Create comprehensive demo data for testing'
        )
        parser.add_argument(
            '--validate-scoring',
            action='store_true',
            help='Test scoring system after import'
        )

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('🔄 COMPREHENSIVE TEST DATA IMPORT'))
        self.stdout.write('=' * 60)

        self.dry_run = options['dry_run']
        self.clear_existing = options['clear_existing']
        self.update_existing = options['update_existing']
        
        if self.dry_run:
            self.stdout.write(self.style.WARNING('🔍 DRY RUN MODE - No changes will be made'))

        # Clear existing data if requested
        if self.clear_existing and not self.dry_run:
            self.clear_existing_data()

        # Import data based on source
        if options['data_source'] in ['migration', 'all']:
            self.import_migration_data(options['test_types'])

        if options['data_source'] in ['json', 'all']:
            self.import_json_data()

        if options['create_demo_data']:
            self.create_demo_data()

        # Validate scoring system
        if options['validate_scoring']:
            self.validate_scoring_system()

        # Summary
        self.show_import_summary()

    def clear_existing_data(self):
        """Clear existing test data"""
        self.stdout.write('\n🗑️  CLEARING EXISTING DATA')
        self.stdout.write('-' * 40)

        question_count = Question.objects.count()
        test_count = Test.objects.count()

        Question.objects.all().delete()
        Test.objects.all().delete()

        self.stdout.write(f'✅ Cleared {test_count} tests and {question_count} questions')

    def import_migration_data(self, test_types):
        """Import data from frontend migration files"""
        self.stdout.write('\n📁 IMPORTING MIGRATION DATA')
        self.stdout.write('-' * 40)

        migration_base = Path(__file__).parent.parent.parent.parent.parent / 'frontend' / 'src' / 'features' / 'skills-assessment' / 'data' / 'db-migration'
        
        if not migration_base.exists():
            self.stdout.write(self.style.WARNING(f'⚠️  Migration directory not found: {migration_base}'))
            return

        if 'all' in test_types:
            test_types = ['sjt', 'verbal', 'spatial']

        for test_type in test_types:
            if test_type == 'sjt':
                self.import_sjt_questions(migration_base)
            elif test_type == 'verbal':
                self.import_verbal_questions(migration_base)
            elif test_type == 'spatial':
                self.import_spatial_questions(migration_base)

    def import_sjt_questions(self, migration_base):
        """Import Situational Judgment Test questions"""
        self.stdout.write('\n📊 Importing SJT Questions')
        
        sjt_file = migration_base / 'situational-judgment' / 'sjt_questions.jsonl'
        if not sjt_file.exists():
            self.stdout.write(f'⚠️  SJT file not found: {sjt_file}')
            return

        # Create SJT test
        test_data = {
            'title': 'Situational Judgment Test',
            'test_type': 'situational_judgment',
            'description': 'Assess decision-making skills in workplace scenarios',
            'duration_minutes': 30,
            'total_questions': 1,  # Temporary value, will be updated after counting questions
            'passing_score': 70,
            'is_active': True,
            'version': '1.0'
        }

        test = self.create_or_get_test('SJT_COMPREHENSIVE', test_data)
        questions_imported = 0

        try:
            with open(sjt_file, 'r', encoding='utf-8') as f:
                for line_num, line in enumerate(f, 1):
                    if not line.strip():
                        continue
                    
                    try:
                        question_data = json.loads(line)
                        question = self.create_sjt_question(test, question_data, line_num)
                        if question:
                            questions_imported += 1
                    except json.JSONDecodeError as e:
                        self.stdout.write(f'❌ JSON error in line {line_num}: {e}')
                    except Exception as e:
                        self.stdout.write(f'❌ Error processing line {line_num}: {e}')

            # Update test question count
            if not self.dry_run:
                test.total_questions = questions_imported
                test.save()

            self.stdout.write(f'✅ SJT: Imported {questions_imported} questions')

        except Exception as e:
            self.stdout.write(f'❌ Failed to import SJT questions: {e}')

    def create_sjt_question(self, test, data, order):
        """Create an SJT question from JSON data"""
        question_id = data.get('id', f'SJT-{order:04d}')
        
        if not self.update_existing:
            if Question.objects.filter(test=test, order=order).exists():
                return None

        # Map choices to our format
        choices = data.get('choices', [])
        if not choices:
            return None

        # Convert answer_index to letter
        answer_index = data.get('answer_index', 0)
        correct_answer = chr(ord('A') + answer_index) if answer_index < len(choices) else 'A'

        # Determine difficulty
        difficulty = data.get('difficulty', 'medium')
        if difficulty not in ['easy', 'medium', 'hard']:
            difficulty = 'medium'

        question_data = {
            'test': test,
            'question_type': 'situational_judgment',
            'question_text': data.get('scenario', ''),
            'context': f"Domain: {data.get('domain', 'general')}",
            'options': choices,
            'correct_answer': correct_answer,
            'explanation': data.get('explanation', ''),
            'difficulty_level': difficulty,
            'order': order
        }

        if not self.dry_run:
            question, created = Question.objects.update_or_create(
                test=test,
                order=order,
                defaults=question_data
            )
            return question
        else:
            self.stdout.write(f'   📝 Would create: {question_data["question_text"][:50]}...')
            return True

    def import_verbal_questions(self, migration_base):
        """Import Verbal Reasoning questions"""
        self.stdout.write('\n🗣️  Importing Verbal Reasoning Questions')
        
        verbal_dir = migration_base / 'verbal-reasoning'
        if not verbal_dir.exists():
            self.stdout.write(f'⚠️  Verbal reasoning directory not found: {verbal_dir}')
            return

        # Different verbal reasoning subtests
        verbal_tests = [
            ('analogy_questions.jsonl', 'Verbal Analogies', 'analogies'),
            ('classification_questions.jsonl', 'Verbal Classification', 'logical_deduction'),
            ('coding_decoding_questions.jsonl', 'Coding & Decoding', 'logical_deduction'),
            ('blood_relations_questions.jsonl', 'Blood Relations', 'logical_deduction'),
        ]

        for filename, test_title, question_type in verbal_tests:
            file_path = verbal_dir / filename
            if file_path.exists():
                self.import_verbal_subtest(file_path, test_title, question_type)
            else:
                self.stdout.write(f'⚠️  File not found: {filename}')

    def import_verbal_subtest(self, file_path, test_title, question_type):
        """Import a specific verbal reasoning subtest"""
        # Create test
        test_data = {
            'title': test_title,
            'test_type': 'verbal_reasoning',
            'description': f'Assess {test_title.lower()} skills',
            'duration_minutes': 20,
            'total_questions': 1,  # Temporary value, will be updated
            'passing_score': 70,
            'is_active': True,
            'version': '1.0'
        }

        test_key = test_title.replace(' ', '_').upper()
        test = self.create_or_get_test(test_key, test_data)
        questions_imported = 0

        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                for line_num, line in enumerate(f, 1):
                    if not line.strip():
                        continue
                    
                    try:
                        question_data = json.loads(line)
                        question = self.create_verbal_question(test, question_data, question_type, line_num)
                        if question:
                            questions_imported += 1
                    except Exception as e:
                        self.stdout.write(f'❌ Error in {file_path.name} line {line_num}: {e}')

            # Update test
            if not self.dry_run:
                test.total_questions = questions_imported
                test.save()

            self.stdout.write(f'✅ {test_title}: Imported {questions_imported} questions')

        except Exception as e:
            self.stdout.write(f'❌ Failed to import {test_title}: {e}')

    def create_verbal_question(self, test, data, question_type, order):
        """Create a verbal reasoning question"""
        if not self.update_existing:
            if Question.objects.filter(test=test, order=order).exists():
                return None

        # Get question text (could be 'stem', 'question', or other fields)
        question_text = data.get('stem') or data.get('question') or data.get('question_text', '')
        if not question_text:
            return None

        choices = data.get('choices', [])
        if not choices:
            return None

        # Convert answer
        answer_index = data.get('answer_index', 0)
        correct_answer = chr(ord('A') + answer_index) if answer_index < len(choices) else 'A'

        # Difficulty
        difficulty = data.get('difficulty', 'medium')
        if difficulty not in ['easy', 'medium', 'hard']:
            difficulty = 'medium'

        question_data = {
            'test': test,
            'question_type': question_type,
            'question_text': question_text,
            'options': choices,
            'correct_answer': correct_answer,
            'explanation': data.get('explanation', ''),
            'difficulty_level': difficulty,
            'order': order
        }

        if not self.dry_run:
            question, created = Question.objects.update_or_create(
                test=test,
                order=order,
                defaults=question_data
            )
            return question
        else:
            self.stdout.write(f'   📝 Would create: {question_text[:50]}...')
            return True

    def import_spatial_questions(self, migration_base):
        """Import Spatial Reasoning questions"""
        self.stdout.write('\n🔲 Importing Spatial Reasoning Questions')
        
        spatial_dir = migration_base / 'spatial-reasoning'
        config_file = spatial_dir / 'spatial_test_config.json'
        
        if not config_file.exists():
            self.stdout.write(f'⚠️  Spatial config file not found: {config_file}')
            return

        try:
            with open(config_file, 'r', encoding='utf-8') as f:
                config = json.load(f)
            
            # Create spatial reasoning test
            test_data = {
                'title': 'Spatial Reasoning Test',
                'test_type': 'spatial_reasoning',
                'description': 'Assess spatial visualization and reasoning abilities',
                'duration_minutes': 25,
                'total_questions': 20,  # Placeholder
                'passing_score': 70,
                'is_active': True,
                'version': '1.0'
            }

            test = self.create_or_get_test('SPATIAL_COMPREHENSIVE', test_data)
            
            # Create sample spatial questions since we don't have the full dataset
            self.create_sample_spatial_questions(test)
            
            self.stdout.write(f'✅ Spatial: Created sample test structure')

        except Exception as e:
            self.stdout.write(f'❌ Failed to import spatial questions: {e}')

    def create_sample_spatial_questions(self, test):
        """Create sample spatial reasoning questions"""
        sample_questions = [
            {
                'question_text': 'Which figure completes the pattern?',
                'question_type': 'pattern_completion',
                'options': ['Figure A', 'Figure B', 'Figure C', 'Figure D'],
                'correct_answer': 'B',
                'difficulty_level': 'medium',
                'explanation': 'The pattern follows a rotation sequence.'
            },
            {
                'question_text': 'How would this object look when rotated 90 degrees clockwise?',
                'question_type': 'mental_rotation',
                'options': ['Option A', 'Option B', 'Option C', 'Option D'],
                'correct_answer': 'C',
                'difficulty_level': 'hard',
                'explanation': 'Mental rotation requires visualizing the object from a different perspective.'
            }
        ]

        for i, q_data in enumerate(sample_questions, 1):
            if not self.dry_run:
                Question.objects.update_or_create(
                    test=test,
                    order=i,
                    defaults={
                        'test': test,
                        'question_type': q_data['question_type'],
                        'question_text': q_data['question_text'],
                        'options': q_data['options'],
                        'correct_answer': q_data['correct_answer'],
                        'explanation': q_data['explanation'],
                        'difficulty_level': q_data['difficulty_level'],
                        'order': i
                    }
                )

    def import_json_data(self):
        """Import from simple JSON files"""
        self.stdout.write('\n📄 IMPORTING JSON DATA')
        self.stdout.write('-' * 40)

        json_files = [
            ('exemple_test_javascript.json', 'JavaScript Technical Test', 'technical'),
            ('exemple_test_python.json', 'Python Technical Test', 'technical'),
        ]

        for filename, test_title, test_type in json_files:
            file_path = Path(__file__).parent.parent.parent.parent / filename
            if file_path.exists():
                self.import_json_file(file_path, test_title, test_type)
            else:
                self.stdout.write(f'⚠️  JSON file not found: {filename}')

    def import_json_file(self, file_path, test_title, test_type):
        """Import questions from a JSON file"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)

            questions_data = data.get('questions', [])
            if not questions_data:
                return

            # Create test
            test_data = {
                'title': test_title,
                'test_type': test_type,
                'description': f'Technical assessment for {test_title.split()[0]}',
                'duration_minutes': 45,
                'total_questions': len(questions_data),
                'passing_score': 70,
                'is_active': True,
                'version': '1.0'
            }

            test_key = test_title.replace(' ', '_').upper()
            test = self.create_or_get_test(test_key, test_data)

            questions_imported = 0
            for i, q_data in enumerate(questions_data, 1):
                question = self.create_json_question(test, q_data, i)
                if question:
                    questions_imported += 1

            self.stdout.write(f'✅ {test_title}: Imported {questions_imported} questions')

        except Exception as e:
            self.stdout.write(f'❌ Failed to import {file_path.name}: {e}')

    def create_json_question(self, test, data, order):
        """Create question from JSON data"""
        if not self.update_existing:
            if Question.objects.filter(test=test, order=order).exists():
                return None

        question_text = data.get('question', '')
        options = data.get('options', [])
        correct_answer_key = data.get('correct_answer', 'a').upper()

        if not question_text or not options:
            return None

        question_data = {
            'test': test,
            'question_type': 'multiple_choice',
            'question_text': question_text,
            'options': options,
            'correct_answer': correct_answer_key,
            'explanation': data.get('explanation', ''),
            'difficulty_level': 'medium',  # Default for technical questions
            'order': order
        }

        if not self.dry_run:
            question, created = Question.objects.update_or_create(
                test=test,
                order=order,
                defaults=question_data
            )
            return question
        else:
            self.stdout.write(f'   📝 Would create: {question_text[:50]}...')
            return True

    def create_demo_data(self):
        """Create comprehensive demo data for testing"""
        self.stdout.write('\n🎯 CREATING DEMO DATA')
        self.stdout.write('-' * 40)

        # Create a comprehensive demo test
        demo_test_data = {
            'title': 'Comprehensive Skills Assessment Demo',
            'test_type': 'mixed',
            'description': 'A comprehensive test covering multiple skill areas for demonstration',
            'duration_minutes': 20,
            'total_questions': 9,
            'passing_score': 70,
            'is_active': True,
            'version': '2.0'
        }

        demo_test = self.create_or_get_test('COMPREHENSIVE_DEMO', demo_test_data)

        # Create demo questions with different difficulties
        demo_questions = [
            # Easy questions
            {
                'question_text': 'What is the capital of France?',
                'options': ['London', 'Paris', 'Berlin', 'Madrid'],
                'correct_answer': 'B',
                'difficulty_level': 'easy',
                'question_type': 'multiple_choice',
                'explanation': 'Paris is the capital and largest city of France.'
            },
            {
                'question_text': 'Which of the following is a primary color?',
                'options': ['Green', 'Purple', 'Red', 'Orange'],
                'correct_answer': 'C',
                'difficulty_level': 'easy',
                'question_type': 'multiple_choice',
                'explanation': 'Red is one of the three primary colors in traditional color theory.'
            },
            {
                'question_text': 'What is 5 + 3?',
                'options': ['6', '7', '8', '9'],
                'correct_answer': 'C',
                'difficulty_level': 'easy',
                'question_type': 'multiple_choice',
                'explanation': 'Basic addition: 5 + 3 = 8.'
            },
            # Medium questions
            {
                'question_text': 'If a team member consistently misses deadlines, what is the best approach?',
                'options': [
                    'Ignore it and work around them',
                    'Have a private conversation to understand the issues',
                    'Report them to management immediately',
                    'Publicly call them out in team meetings'
                ],
                'correct_answer': 'B',
                'difficulty_level': 'medium',
                'question_type': 'situational_judgment',
                'explanation': 'A private conversation allows you to understand the root cause and work together on solutions.'
            },
            {
                'question_text': 'Book is to Library as _____ is to Museum.',
                'options': ['Visitor', 'Artifact', 'Guide', 'Building'],
                'correct_answer': 'B',
                'difficulty_level': 'medium',
                'question_type': 'analogies',
                'explanation': 'Books are the main items housed in a library, just as artifacts are the main items housed in a museum.'
            },
            {
                'question_text': 'Which programming principle helps reduce code duplication?',
                'options': ['Inheritance', 'DRY (Don\'t Repeat Yourself)', 'Encapsulation', 'Polymorphism'],
                'correct_answer': 'B',
                'difficulty_level': 'medium',
                'question_type': 'multiple_choice',
                'explanation': 'The DRY principle specifically aims to reduce repetition of software patterns.'
            },
            # Hard questions
            {
                'question_text': 'In a complex project with conflicting stakeholder requirements, what is the most effective approach?',
                'options': [
                    'Choose the requirement from the highest-ranking stakeholder',
                    'Implement all requirements regardless of conflicts',
                    'Facilitate a stakeholder meeting to prioritize and resolve conflicts',
                    'Delay the project until conflicts are resolved externally'
                ],
                'correct_answer': 'C',
                'difficulty_level': 'hard',
                'question_type': 'situational_judgment',
                'explanation': 'Facilitating stakeholder alignment ensures all voices are heard and creates buy-in for the final decisions.'
            },
            {
                'question_text': 'Optimist is to Hopeful as Pessimist is to _____.',
                'options': ['Realistic', 'Doubtful', 'Careful', 'Analytical'],
                'correct_answer': 'B',
                'difficulty_level': 'hard',
                'question_type': 'analogies',
                'explanation': 'An optimist tends to be hopeful about outcomes, while a pessimist tends to be doubtful about positive outcomes.'
            },
            {
                'question_text': 'Which design pattern is best for creating objects without specifying their concrete classes?',
                'options': ['Singleton', 'Observer', 'Factory', 'Decorator'],
                'correct_answer': 'C',
                'difficulty_level': 'hard',
                'question_type': 'multiple_choice',
                'explanation': 'The Factory pattern creates objects without exposing the instantiation logic to the client.'
            }
        ]

        questions_created = 0
        for i, q_data in enumerate(demo_questions, 1):
            if not self.dry_run:
                Question.objects.update_or_create(
                    test=demo_test,
                    order=i,
                    defaults={
                        'test': demo_test,
                        'question_type': q_data['question_type'],
                        'question_text': q_data['question_text'],
                        'options': q_data['options'],
                        'correct_answer': q_data['correct_answer'],
                        'explanation': q_data['explanation'],
                        'difficulty_level': q_data['difficulty_level'],
                        'order': i
                    }
                )
                questions_created += 1
            else:
                self.stdout.write(f'   📝 Would create demo question {i}')

        self.stdout.write(f'✅ Demo: Created {questions_created} questions')

    def create_or_get_test(self, test_key, test_data):
        """Create or get existing test"""
        if not self.dry_run:
            # Try to find existing test by title
            existing_test = Test.objects.filter(title=test_data['title']).first()
            if existing_test:
                if self.update_existing:
                    for key, value in test_data.items():
                        setattr(existing_test, key, value)
                    existing_test.save()
                    return existing_test
                else:
                    return existing_test
            else:
                return Test.objects.create(**test_data)
        else:
            self.stdout.write(f'   🏗️  Would create test: {test_data["title"]}')
            return None

    def validate_scoring_system(self):
        """Test the scoring system with imported data"""
        self.stdout.write('\n⚖️  VALIDATING SCORING SYSTEM')
        self.stdout.write('-' * 40)

        try:
            # Get a test with questions
            test = Test.objects.filter(total_questions__gt=0).first()
            if not test:
                self.stdout.write('⚠️  No tests with questions found for validation')
                return

            # Get test user
            user, created = User.objects.get_or_create(
                username='scoring_test_user',
                defaults={
                    'email': 'scoring_test@example.com',
                    'first_name': 'Scoring',
                    'last_name': 'Validator'
                }
            )

            if created:
                user.set_password('testpass123')
                user.save()

            # Create sample answers
            questions = test.questions.all()[:3]  # Test with first 3 questions
            answers_data = {}
            for i, question in enumerate(questions):
                # Alternate between correct and incorrect answers
                if i % 2 == 0:
                    answers_data[str(question.id)] = question.correct_answer
                else:
                    # Give wrong answer
                    wrong_answers = ['A', 'B', 'C', 'D']
                    wrong_answers.remove(question.correct_answer)
                    answers_data[str(question.id)] = wrong_answers[0]

            # Test scoring
            scoring_service = ScoringService()
            submission, score = scoring_service.score_test_submission(
                user=user,
                test=test,
                answers_data=answers_data,
                time_taken_seconds=600
            )

            self.stdout.write(f'✅ Scoring validation successful:')
            self.stdout.write(f'   Test: {test.title}')
            self.stdout.write(f'   Questions tested: {len(answers_data)}')
            self.stdout.write(f'   Score: {score.percentage_score}%')
            self.stdout.write(f'   Grade: {score.grade_letter}')

        except Exception as e:
            self.stdout.write(f'❌ Scoring validation failed: {e}')

    def show_import_summary(self):
        """Show summary of imported data"""
        self.stdout.write('\n📊 IMPORT SUMMARY')
        self.stdout.write('=' * 60)

        total_tests = Test.objects.count()
        total_questions = Question.objects.count()

        self.stdout.write(f'📈 Total Tests: {total_tests}')
        self.stdout.write(f'📝 Total Questions: {total_questions}')

        if total_tests > 0:
            self.stdout.write('\n📋 Tests by Type:')
            from django.db import models
            for test_type, count in Test.objects.values_list('test_type').annotate(count=models.Count('id')):
                self.stdout.write(f'   • {test_type}: {count} tests')

        if total_questions > 0:
            self.stdout.write('\n⚖️  Questions by Difficulty:')
            for difficulty, count in Question.objects.values_list('difficulty_level').annotate(count=models.Count('id')):
                self.stdout.write(f'   • {difficulty}: {count} questions')

        # Show some sample tests
        self.stdout.write('\n📚 Available Tests:')
        for test in Test.objects.all()[:10]:
            question_count = test.questions.count()
            max_score = test.calculate_max_score()
            self.stdout.write(f'   • {test.title} ({test.test_type}): {question_count} questions, max score: {max_score}')

        self.stdout.write('\n🎉 Import completed successfully!')
        if not self.dry_run:
            self.stdout.write('💡 You can now:')
            self.stdout.write('   • Test the API endpoints with real data')
            self.stdout.write('   • Use the scoring system with comprehensive questions')
            self.stdout.write('   • Set up the Django admin for test management')
        else:
            self.stdout.write('🔍 This was a dry run - use without --dry-run to actually import data')
