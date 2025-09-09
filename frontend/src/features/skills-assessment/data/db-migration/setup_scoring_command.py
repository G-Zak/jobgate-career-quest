"""
Django management command to set up scoring profiles
Usage: python manage.py setup_scoring
"""

from django.core.management.base import BaseCommand
from django.db import transaction
from testsengine.models import ScoringProfile
from scoring_configs import (
    SJT_SCORING_CONFIG, 
    VERBAL_SCORING_CONFIG, 
    SPATIAL_SCORING_CONFIG
)


class Command(BaseCommand):
    help = 'Set up scoring profiles for all test types'

    def add_arguments(self, parser):
        parser.add_argument(
            '--update-existing',
            action='store_true',
            help='Update existing scoring profiles'
        )
        parser.add_argument(
            '--test-type',
            type=str,
            choices=['sjt', 'verbal', 'spatial', 'all'],
            default='all',
            help='Set up scoring for specific test type'
        )

    def handle(self, *args, **options):
        update_existing = options['update_existing']
        test_type = options['test_type']

        self.stdout.write(
            self.style.SUCCESS('Setting up scoring profiles...')
        )

        configs = []
        if test_type in ['sjt', 'all']:
            configs.append(SJT_SCORING_CONFIG)
        if test_type in ['verbal', 'all']:
            configs.append(VERBAL_SCORING_CONFIG)
        if test_type in ['spatial', 'all']:
            configs.append(SPATIAL_SCORING_CONFIG)

        created_count = 0
        updated_count = 0
        skipped_count = 0

        with transaction.atomic():
            for config in configs:
                try:
                    # Check if profile exists
                    existing_profile = ScoringProfile.objects.filter(
                        name=config['name'],
                        test_type=config['test_type']
                    ).first()

                    if existing_profile:
                        if update_existing:
                            # Update existing profile
                            for key, value in config.items():
                                if key != 'name':  # Don't update name
                                    setattr(existing_profile, key, value)
                            existing_profile.save()
                            updated_count += 1
                            self.stdout.write(f'  Updated: {config["name"]}')
                        else:
                            skipped_count += 1
                            self.stdout.write(f'  Skipped (exists): {config["name"]}')
                    else:
                        # Create new profile
                        ScoringProfile.objects.create(**config)
                        created_count += 1
                        self.stdout.write(f'  Created: {config["name"]}')

                except Exception as e:
                    self.stdout.write(
                        self.style.ERROR(f'Error setting up {config["name"]}: {e}')
                    )

        # Summary
        self.stdout.write('\n' + '='*50)
        self.stdout.write(self.style.SUCCESS('Scoring Setup Summary:'))
        self.stdout.write(f'  Profiles created: {created_count}')
        self.stdout.write(f'  Profiles updated: {updated_count}')
        self.stdout.write(f'  Profiles skipped: {skipped_count}')

        if created_count > 0 or updated_count > 0:
            self.stdout.write(
                self.style.SUCCESS(f'Successfully configured scoring for {test_type} tests!')
            )

        # Show available scoring profiles
        self.stdout.write('\nAvailable Scoring Profiles:')
        for profile in ScoringProfile.objects.filter(is_active=True).order_by('test_type'):
            self.stdout.write(f'  {profile.test_type.upper()}: {profile.name} ({profile.scoring_method})')
