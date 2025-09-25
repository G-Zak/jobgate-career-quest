#!/usr/bin/env python3
"""
Command to restore test data from fixtures after merging
"""

import os
import json
from django.core.management.base import BaseCommand
from django.core import serializers
from django.db import transaction
from testsengine.models import Test, Question
from skills.models import Skill

class Command(BaseCommand):
    help = 'Restore test data from fixtures after merging'
    
    def add_arguments(self, parser):
        parser.add_argument(
            '--input-dir',
            type=str,
            default='backend/testsengine/fixtures',
            help='Directory containing backup files'
        )
        parser.add_argument(
            '--force',
            action='store_true',
            help='Force restore even if data exists'
        )
        parser.add_argument(
            '--clear-existing',
            action='store_true',
            help='Clear existing data before restoring'
        )
    
    def handle(self, *args, **options):
        input_dir = options['input_dir']
        force = options['force']
        clear_existing = options['clear_existing']
        
        if not os.path.exists(input_dir):
            self.stdout.write(
                self.style.ERROR(f'❌ Input directory not found: {input_dir}')
            )
            return
        
        self.stdout.write('🔄 Starting test data restoration...')
        
        with transaction.atomic():
            if clear_existing:
                self.clear_existing_data()
            
            # Restore in order: skills -> tests -> questions
            self.restore_skills(input_dir, force)
            self.restore_tests(input_dir, force)
            self.restore_questions(input_dir, force)
        
        self.stdout.write(
            self.style.SUCCESS('✅ Test data restoration completed successfully!')
        )
    
    def clear_existing_data(self):
        """Clear existing test data"""
        self.stdout.write('🧹 Clearing existing test data...')
        Question.objects.all().delete()
        Test.objects.all().delete()
        Skill.objects.all().delete()
        self.stdout.write('✅ Existing data cleared')
    
    def restore_skills(self, input_dir, force):
        """Restore skills from backup"""
        file_path = os.path.join(input_dir, 'skills_backup.json')
        if os.path.exists(file_path):
            with open(file_path, 'r', encoding='utf-8') as f:
                data = f.read()
            
            # Check if skills already exist
            if not force and Skill.objects.exists():
                self.stdout.write('⚠️ Skills already exist. Use --force to overwrite or --clear-existing')
                return
            
            # Deserialize and save
            for obj in serializers.deserialize('json', data):
                obj.save()
            
            self.stdout.write(f'✅ Restored {Skill.objects.count()} skills')
        else:
            self.stdout.write('⚠️ No skills backup file found')
    
    def restore_tests(self, input_dir, force):
        """Restore tests from backup"""
        file_path = os.path.join(input_dir, 'tests_backup.json')
        if os.path.exists(file_path):
            with open(file_path, 'r', encoding='utf-8') as f:
                data = f.read()
            
            # Check if tests already exist
            if not force and Test.objects.exists():
                self.stdout.write('⚠️ Tests already exist. Use --force to overwrite or --clear-existing')
                return
            
            # Deserialize and save
            for obj in serializers.deserialize('json', data):
                obj.save()
            
            self.stdout.write(f'✅ Restored {Test.objects.count()} tests')
        else:
            self.stdout.write('⚠️ No tests backup file found')
    
    def restore_questions(self, input_dir, force):
        """Restore questions from backup"""
        file_path = os.path.join(input_dir, 'questions_backup.json')
        if os.path.exists(file_path):
            with open(file_path, 'r', encoding='utf-8') as f:
                data = f.read()
            
            # Check if questions already exist
            if not force and Question.objects.exists():
                self.stdout.write('⚠️ Questions already exist. Use --force to overwrite or --clear-existing')
                return
            
            # Deserialize and save
            for obj in serializers.deserialize('json', data):
                obj.save()
            
            self.stdout.write(f'✅ Restored {Question.objects.count()} questions')
        else:
            self.stdout.write('⚠️ No questions backup file found')
    
