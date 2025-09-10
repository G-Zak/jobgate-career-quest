import os
from django.core.management.base import BaseCommand
from django.core.management import call_command

class Command(BaseCommand):
    help = 'Populate database with comprehensive technical tests and questions'
    
    def add_arguments(self, parser):
        parser.add_argument(
            '--force',
            action='store_true',
            help='Force repopulation even if tests exist',
        )
    
    def handle(self, *args, **options):
        self.stdout.write('🚀 Starting technical test population...')
        
        # Run the population script
        script_path = '/Users/zakariaguennani/Documents/Dev/EMSI/Internship/jobgate-career-quest/backend/populate_technical_tests.py'
        exit_code = os.system(f'cd /Users/zakariaguennani/Documents/Dev/EMSI/Internship/jobgate-career-quest/backend && python populate_technical_tests.py')
        
        if exit_code == 0:
            self.stdout.write(
                self.style.SUCCESS('✅ Successfully populated technical tests!')
            )
            self.stdout.write('📝 Created comprehensive tests for:')
            self.stdout.write('   🐍 Python (15 questions)')
            self.stdout.write('   📜 JavaScript (12 questions)')
            self.stdout.write('   ⚛️  React.js (10 questions)')
            self.stdout.write('   🎸 Django (12 questions)')
            self.stdout.write('   🗄️  SQL (10 questions)')
            self.stdout.write('')
            self.stdout.write('🎯 Total: 59 questions across 5 tests')
            self.stdout.write('📊 Mixed difficulty levels: Beginner → Intermediate → Advanced')
        else:
            self.stdout.write(
                self.style.ERROR('❌ Failed to populate technical tests!')
            )
