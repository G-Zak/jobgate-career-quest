from django.core.management.base import BaseCommand
from django.db import transaction
from testsengine.models import Question
import re

class Command(BaseCommand):
    help = 'Cleans up question texts by removing unnecessary prefixes and formatting'

    def handle(self, *args, **options):
        self.stdout.write('🧹 Cleaning up question texts...')
        
        with transaction.atomic():
            # Get all questions that have unnecessary prefixes
            questions_to_clean = Question.objects.filter(
                question_text__icontains='(Question '
            )
            
            self.stdout.write(f'Found {questions_to_clean.count()} questions to clean')
            
            cleaned_count = 0
            for question in questions_to_clean:
                original_text = question.question_text
                
                # Remove patterns like "(Question X)" at the end
                cleaned_text = re.sub(r'\s*\(Question\s+\d+\)\s*$', '', original_text)
                
                # Remove patterns like "Question X:" at the beginning
                cleaned_text = re.sub(r'^Question\s+\d+:\s*', '', cleaned_text)
                
                # Remove patterns like "Q X:" at the beginning
                cleaned_text = re.sub(r'^Q\s+\d+:\s*', '', cleaned_text)
                
                # Clean up any double spaces
                cleaned_text = re.sub(r'\s+', ' ', cleaned_text).strip()
                
                if cleaned_text != original_text:
                    question.question_text = cleaned_text
                    question.save()
                    cleaned_count += 1
                    
                    if cleaned_count % 10 == 0:
                        self.stdout.write(f'  Cleaned {cleaned_count} questions...')
            
            self.stdout.write(f'✅ Successfully cleaned {cleaned_count} question texts')
            
            # Show some examples of cleaned questions
            self.stdout.write('\n📝 Examples of cleaned questions:')
            sample_questions = Question.objects.filter(
                question_text__icontains='pattern'
            )[:3]
            
            for q in sample_questions:
                self.stdout.write(f'  ID {q.id}: {q.question_text[:80]}...')
        
        self.stdout.write('\n🎉 Question text cleanup completed!')
