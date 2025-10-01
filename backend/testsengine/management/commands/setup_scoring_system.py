"""
Django management command to set up the universal scoring system.

Usage: python manage.py setup_scoring_system
"""

from django.core.management.base import BaseCommand
from django.db import transaction
from decimal import Decimal

from testsengine.models_scoring import ScoringConfig

class Command(BaseCommand):
 help = 'Set up the universal scoring system with default configurations'

 def add_arguments(self, parser):
 parser.add_argument(
 '--reset',
 action='store_true',
 help='Reset existing scoring configurations',
 )

 def handle(self, *args, **options):
 if options['reset']:
 self.stdout.write('Resetting existing scoring configurations...')
 ScoringConfig.objects.all().delete()

 self.stdout.write('Setting up universal scoring system...')

 # Default scoring configurations
 configs = [
 {
 'name': 'standard',
 'description': 'Standard balanced scoring configuration',
 'time_weight': Decimal('0.30'),
 'difficulty_weight': Decimal('0.50'),
 'accuracy_weight': Decimal('0.20'),
 'is_default': True
 },
 {
 'name': 'speed_focused',
 'description': 'Speed-focused scoring (rewards quick answers)',
 'time_weight': Decimal('0.50'),
 'difficulty_weight': Decimal('0.30'),
 'accuracy_weight': Decimal('0.20'),
 'is_default': False
 },
 {
 'name': 'accuracy_focused',
 'description': 'Accuracy-focused scoring (rewards correct answers)',
 'time_weight': Decimal('0.20'),
 'difficulty_weight': Decimal('0.30'),
 'accuracy_weight': Decimal('0.50'),
 'is_default': False
 },
 {
 'name': 'difficulty_focused',
 'description': 'Difficulty-focused scoring (rewards hard questions)',
 'time_weight': Decimal('0.20'),
 'difficulty_weight': Decimal('0.60'),
 'accuracy_weight': Decimal('0.20'),
 'is_default': False
 },
 {
 'name': 'numerical_optimized',
 'description': 'Optimized for numerical reasoning tests',
 'time_weight': Decimal('0.40'),
 'difficulty_weight': Decimal('0.40'),
 'accuracy_weight': Decimal('0.20'),
 'is_default': False
 },
 {
 'name': 'verbal_optimized',
 'description': 'Optimized for verbal reasoning tests',
 'time_weight': Decimal('0.20'),
 'difficulty_weight': Decimal('0.30'),
 'accuracy_weight': Decimal('0.50'),
 'is_default': False
 },
 {
 'name': 'logical_optimized',
 'description': 'Optimized for logical reasoning tests',
 'time_weight': Decimal('0.30'),
 'difficulty_weight': Decimal('0.50'),
 'accuracy_weight': Decimal('0.20'),
 'is_default': False
 },
 {
 'name': 'abstract_optimized',
 'description': 'Optimized for abstract reasoning tests',
 'time_weight': Decimal('0.30'),
 'difficulty_weight': Decimal('0.60'),
 'accuracy_weight': Decimal('0.10'),
 'is_default': False
 }
 ]

 created_count = 0
 updated_count = 0

 with transaction.atomic():
 for config_data in configs:
 config, created = ScoringConfig.objects.get_or_create(
 name=config_data['name'],
 defaults=config_data
 )

 if created:
 created_count += 1
 self.stdout.write(
 self.style.SUCCESS(f' Created scoring config: {config.name}')
 )
 else:
 # Update existing config
 for key, value in config_data.items():
 if key != 'name':
 setattr(config, key, value)
 config.save()
 updated_count += 1
 self.stdout.write(
 self.style.WARNING(f'~ Updated scoring config: {config.name}')
 )

 self.stdout.write('\n' + '='*50)
 self.stdout.write(self.style.SUCCESS(f' Created {created_count} new configurations'))
 if updated_count > 0:
 self.stdout.write(self.style.WARNING(f'~ Updated {updated_count} existing configurations'))

 self.stdout.write('\nAvailable scoring configurations:')
 for config in ScoringConfig.objects.all().order_by('name'):
 status = ' (DEFAULT)' if config.is_default else ''
 self.stdout.write(f' • {config.name}: T={config.time_weight}, D={config.difficulty_weight}, A={config.accuracy_weight}{status}')

 self.stdout.write('\n' + '='*50)
 self.stdout.write(self.style.SUCCESS('Universal scoring system setup completed!'))
 self.stdout.write('\nNext steps:')
 self.stdout.write('1. Run migrations: python manage.py migrate')
 self.stdout.write('2. Import questions: python manage.py shell < testsengine/examples_scoring.py')
 self.stdout.write('3. Test the API endpoints')
 self.stdout.write('4. Integrate with your frontend')

