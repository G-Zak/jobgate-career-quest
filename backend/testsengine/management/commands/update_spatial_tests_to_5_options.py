from django.core.management.base import BaseCommand
from testsengine.models import Question

class Command(BaseCommand):
    help = 'Update all spatial tests to have 5 options (A, B, C, D, E)'

    def handle(self, *args, **options):
        # Spatial test IDs
        spatial_test_ids = [15, 16, 17]  # Shape Assembly, Rotation, Visualization
        
        for test_id in spatial_test_ids:
            self.stdout.write(f'Processing spatial test {test_id}...')
            
            # Get all questions for this test
            questions = Question.objects.filter(test_id=test_id)
            
            updated_count = 0
            for question in questions:
                # Check if question has only 4 options
                if question.options and len(question.options) == 4:
                    # Add option E
                    new_options = question.options + ['E']
                    question.options = new_options
                    question.save()
                    updated_count += 1
                    self.stdout.write(f'  Updated question {question.id}: {question.options}')
            
            self.stdout.write(f'Updated {updated_count} questions in test {test_id}')
        
        self.stdout.write(self.style.SUCCESS('Successfully updated all spatial tests to have 5 options!'))
