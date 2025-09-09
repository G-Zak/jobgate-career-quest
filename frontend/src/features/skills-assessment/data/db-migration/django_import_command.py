"""
Django management command to import skills assessment questions
Usage: python manage.py import_questions --file questions.jsonl --test-type sjt
"""

from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from testsengine.models import AssessmentQuestion, TestConfiguration
import json
import logging

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = 'Import skills assessment questions from JSONL files'

    def add_arguments(self, parser):
        parser.add_argument(
            '--file',
            type=str,
            required=True,
            help='Path to JSONL file containing questions'
        )
        parser.add_argument(
            '--test-type',
            type=str,
            required=True,
            choices=['sjt', 'verbal', 'spatial', 'numerical', 'logical'],
            help='Type of test (sjt, verbal, spatial, numerical, logical)'
        )
        parser.add_argument(
            '--category',
            type=str,
            help='Question category (optional, will be inferred if not provided)'
        )
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Preview import without making changes'
        )
        parser.add_argument(
            '--update-existing',
            action='store_true',
            help='Update existing questions instead of skipping them'
        )

    def handle(self, *args, **options):
        file_path = options['file']
        test_type = options['test_type']
        category = options.get('category', 'general')
        dry_run = options['dry_run']
        update_existing = options['update_existing']

        self.stdout.write(
            self.style.SUCCESS(f'Importing {test_type} questions from {file_path}')
        )

        if dry_run:
            self.stdout.write(
                self.style.WARNING('DRY RUN MODE - No changes will be made')
            )

        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                questions = []
                for line_num, line in enumerate(f, 1):
                    line = line.strip()
                    if not line:
                        continue
                    try:
                        question = json.loads(line)
                        questions.append(question)
                    except json.JSONDecodeError as e:
                        self.stdout.write(
                            self.style.ERROR(f'JSON error on line {line_num}: {e}')
                        )

            self.stdout.write(f'Found {len(questions)} questions to import')

            imported_count = 0
            updated_count = 0
            skipped_count = 0
            error_count = 0

            with transaction.atomic():
                for i, question_data in enumerate(questions, 1):
                    try:
                        # Generate question_id if not present
                        question_id = question_data.get('id', question_data.get('question_id'))
                        if not question_id:
                            question_id = f"{test_type}_{category}_{i:04d}"

                        # Normalize data
                        normalized_data = self.normalize_question_data(
                            question_data, test_type, category
                        )

                        if dry_run:
                            self.stdout.write(f'  Would import: {question_id}')
                            imported_count += 1
                            continue

                        # Check if question exists
                        existing_question = AssessmentQuestion.objects.filter(
                            question_id=question_id
                        ).first()

                        if existing_question:
                            if update_existing:
                                # Update existing question
                                for key, value in normalized_data.items():
                                    setattr(existing_question, key, value)
                                existing_question.save()
                                updated_count += 1
                                self.stdout.write(f'  Updated: {question_id}')
                            else:
                                skipped_count += 1
                                self.stdout.write(f'  Skipped (exists): {question_id}')
                        else:
                            # Create new question
                            AssessmentQuestion.objects.create(**normalized_data)
                            imported_count += 1
                            self.stdout.write(f'  Imported: {question_id}')

                    except Exception as e:
                        error_count += 1
                        self.stdout.write(
                            self.style.ERROR(f'  Error importing question {i}: {e}')
                        )

            # Summary
            self.stdout.write('\n' + '='*50)
            self.stdout.write(self.style.SUCCESS('Import Summary:'))
            self.stdout.write(f'  New questions imported: {imported_count}')
            self.stdout.write(f'  Existing questions updated: {updated_count}')
            self.stdout.write(f'  Questions skipped: {skipped_count}')
            self.stdout.write(f'  Errors: {error_count}')

            if not dry_run and imported_count > 0:
                self.stdout.write(
                    self.style.SUCCESS(f'Successfully imported {imported_count} questions!')
                )

        except FileNotFoundError:
            raise CommandError(f'File not found: {file_path}')
        except Exception as e:
            raise CommandError(f'Import failed: {e}')

    def normalize_question_data(self, question, test_type, category):
        """Normalize question data to match model fields"""
        
        # Handle choices format
        choices = question.get('choices', [])
        if isinstance(choices, dict):
            choices = [{"id": k, "text": v} for k, v in choices.items()]
        elif isinstance(choices, list) and choices and isinstance(choices[0], str):
            choice_labels = ['A', 'B', 'C', 'D', 'E']
            choices = [{"id": choice_labels[i], "text": choice} 
                      for i, choice in enumerate(choices)]

        # Handle correct answer
        correct_answer = question.get('correct_answer', question.get('answer', 0))
        if isinstance(correct_answer, str):
            if correct_answer.upper() in 'ABCDE':
                correct_answer = ord(correct_answer.upper()) - ord('A')
            else:
                correct_answer = 0

        # Extract metadata
        metadata = {}
        for key in ['time_limit', 'images', 'scenario', 'context']:
            if key in question:
                metadata[key] = question[key]

        return {
            'question_id': question.get('id', question.get('question_id')),
            'test_type': test_type,
            'category': category,
            'subcategory': question.get('subcategory', question.get('type', '')),
            'question_text': question.get('question', question.get('question_text', '')),
            'choices': choices,
            'correct_answer': correct_answer,
            'explanation': question.get('explanation', ''),
            'difficulty': question.get('difficulty', 'medium').lower(),
            'tags': question.get('tags', []),
            'metadata': metadata
        }
