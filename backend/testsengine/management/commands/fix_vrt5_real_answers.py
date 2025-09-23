from django.core.management.base import BaseCommand
from django.db import transaction
from testsengine.models import Question, Test
import random

class Command(BaseCommand):
    help = 'Fix VRT5 Blood Relations questions with realistic answer options'

    def add_arguments(self, parser):
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Show what would be done without making changes',
        )

    def handle(self, *args, **options):
        dry_run = options['dry_run']
        
        if dry_run:
            self.stdout.write(self.style.WARNING('DRY RUN MODE - No changes will be made'))
        
        test_id = 5  # VRT5 - Blood Relations
        
        with transaction.atomic():
            if dry_run:
                # In dry run, don't use atomic transaction
                pass
            
            self.fix_vrt5_questions(test_id, dry_run)
        
        if not dry_run:
            self.stdout.write(self.style.SUCCESS('✅ VRT5 Blood Relations questions fixed successfully!'))
        else:
            self.stdout.write(self.style.WARNING('Dry run completed. Use without --dry-run to apply changes.'))

    def fix_vrt5_questions(self, test_id, dry_run=False):
        test = Test.objects.get(id=test_id)
        self.stdout.write(f'\n🔍 Processing {test.title} (ID: {test_id})')
        
        questions = Question.objects.filter(test_id=test_id).order_by('order')
        self.stdout.write(f'   Found {questions.count()} questions to fix')
        
        # Define realistic blood relation options for different question types
        blood_relation_options = {
            'father': ['Father', 'Uncle', 'Grandfather', 'Brother'],
            'mother': ['Mother', 'Aunt', 'Grandmother', 'Sister'],
            'son': ['Son', 'Nephew', 'Grandson', 'Brother'],
            'daughter': ['Daughter', 'Niece', 'Granddaughter', 'Sister'],
            'brother': ['Brother', 'Cousin', 'Uncle', 'Nephew'],
            'sister': ['Sister', 'Cousin', 'Aunt', 'Niece'],
            'uncle': ['Uncle', 'Father', 'Brother', 'Cousin'],
            'aunt': ['Aunt', 'Mother', 'Sister', 'Cousin'],
            'grandfather': ['Grandfather', 'Father', 'Great-grandfather', 'Uncle'],
            'grandmother': ['Grandmother', 'Mother', 'Great-grandmother', 'Aunt'],
            'grandson': ['Grandson', 'Son', 'Nephew', 'Brother'],
            'granddaughter': ['Granddaughter', 'Daughter', 'Niece', 'Sister'],
            'nephew': ['Nephew', 'Son', 'Brother', 'Cousin'],
            'niece': ['Niece', 'Daughter', 'Sister', 'Cousin'],
            'cousin': ['Cousin', 'Brother', 'Sister', 'Nephew'],
            'brother_in_law': ['Brother-in-law', 'Brother', 'Uncle', 'Cousin'],
            'sister_in_law': ['Sister-in-law', 'Sister', 'Aunt', 'Cousin'],
            'father_in_law': ['Father-in-law', 'Father', 'Uncle', 'Brother'],
            'mother_in_law': ['Mother-in-law', 'Mother', 'Aunt', 'Sister'],
            'great_uncle': ['Great-uncle', 'Uncle', 'Grandfather', 'Father'],
            'great_aunt': ['Great-aunt', 'Aunt', 'Grandmother', 'Mother'],
            'great_grandfather': ['Great-grandfather', 'Grandfather', 'Father', 'Uncle'],
            'great_grandmother': ['Great-grandmother', 'Grandmother', 'Mother', 'Aunt']
        }
        
        updated_count = 0
        
        for i, question in enumerate(questions):
            # Extract the correct answer from the current options
            current_options = question.options
            correct_answer_letter = question.correct_answer
            
            # Find the correct answer text
            correct_answer_text = None
            if correct_answer_letter and len(current_options) >= ord(correct_answer_letter) - ord('A') + 1:
                correct_index = ord(correct_answer_letter) - ord('A')
                correct_answer_text = current_options[correct_index]
            
            # Determine the relationship type based on the correct answer
            relationship_type = self.determine_relationship_type(correct_answer_text)
            
            # Get realistic options for this relationship type
            if relationship_type in blood_relation_options:
                realistic_options = blood_relation_options[relationship_type].copy()
            else:
                # Fallback to general family terms
                realistic_options = ['Father', 'Mother', 'Son', 'Daughter', 'Brother', 'Sister', 'Uncle', 'Aunt']
            
            # Ensure we have exactly 4 options
            while len(realistic_options) < 4:
                realistic_options.append(f'Relative{len(realistic_options)+1}')
            
            # Shuffle options but keep the correct answer
            if correct_answer_text and correct_answer_text in realistic_options:
                # Remove the correct answer, shuffle the rest, then add it back
                realistic_options.remove(correct_answer_text)
                random.shuffle(realistic_options)
                realistic_options = realistic_options[:3]  # Take first 3
                realistic_options.append(correct_answer_text)  # Add correct answer at the end
                random.shuffle(realistic_options)  # Shuffle again
            else:
                # If we can't find the correct answer, just shuffle
                random.shuffle(realistic_options)
                realistic_options = realistic_options[:4]
            
            # Find the new position of the correct answer
            new_correct_letter = None
            if correct_answer_text and correct_answer_text in realistic_options:
                new_correct_index = realistic_options.index(correct_answer_text)
                new_correct_letter = chr(65 + new_correct_index)  # A, B, C, or D
            else:
                # If we can't find the correct answer, default to A
                new_correct_letter = 'A'
            
            if not dry_run:
                # Update the question
                question.options = realistic_options
                question.correct_answer = new_correct_letter
                question.save()
                updated_count += 1
                
                if updated_count % 10 == 0:
                    self.stdout.write(f'   Updated {updated_count} questions...')
            else:
                # Dry run - just show what would be changed
                self.stdout.write(f'   Question {i+1}: Would update options from {current_options} to {realistic_options}')
                self.stdout.write(f'   Correct answer would change from {correct_answer_letter} to {new_correct_letter}')
        
        if not dry_run:
            self.stdout.write(f'   ✅ Updated {updated_count} questions with realistic blood relation options')
        else:
            self.stdout.write(f'   Would update {len(questions)} questions')

    def determine_relationship_type(self, answer_text):
        """Determine the relationship type based on the answer text"""
        if not answer_text:
            return 'general'
        
        answer_lower = answer_text.lower()
        
        # Map answer text to relationship types
        if 'father' in answer_lower:
            return 'father'
        elif 'mother' in answer_lower:
            return 'mother'
        elif 'son' in answer_lower:
            return 'son'
        elif 'daughter' in answer_lower:
            return 'daughter'
        elif 'brother' in answer_lower:
            return 'brother'
        elif 'sister' in answer_lower:
            return 'sister'
        elif 'uncle' in answer_lower:
            return 'uncle'
        elif 'aunt' in answer_lower:
            return 'aunt'
        elif 'grandfather' in answer_lower:
            return 'grandfather'
        elif 'grandmother' in answer_lower:
            return 'grandmother'
        elif 'grandson' in answer_lower:
            return 'grandson'
        elif 'granddaughter' in answer_lower:
            return 'granddaughter'
        elif 'nephew' in answer_lower:
            return 'nephew'
        elif 'niece' in answer_lower:
            return 'niece'
        elif 'cousin' in answer_lower:
            return 'cousin'
        elif 'brother-in-law' in answer_lower or 'brother_in_law' in answer_lower:
            return 'brother_in_law'
        elif 'sister-in-law' in answer_lower or 'sister_in_law' in answer_lower:
            return 'sister_in_law'
        elif 'father-in-law' in answer_lower or 'father_in_law' in answer_lower:
            return 'father_in_law'
        elif 'mother-in-law' in answer_lower or 'mother_in_law' in answer_lower:
            return 'mother_in_law'
        elif 'great-uncle' in answer_lower or 'great_uncle' in answer_lower:
            return 'great_uncle'
        elif 'great-aunt' in answer_lower or 'great_aunt' in answer_lower:
            return 'great_aunt'
        elif 'great-grandfather' in answer_lower or 'great_grandfather' in answer_lower:
            return 'great_grandfather'
        elif 'great-grandmother' in answer_lower or 'great_grandmother' in answer_lower:
            return 'great_grandmother'
        else:
            return 'general'
