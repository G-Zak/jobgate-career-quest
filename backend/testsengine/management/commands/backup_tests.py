#!/usr/bin/env python3
"""
Command to backup all test data to fixtures for safe merging
"""

import os
import json
from django.core.management.base import BaseCommand
from django.core import serializers
from testsengine.models import Test, Question
from skills.models import Skill

class Command(BaseCommand):
 help = 'Backup all test data to fixtures for safe merging'

 def add_arguments(self, parser):
 parser.add_argument(
 '--output-dir',
 type=str,
 default='backend/testsengine/fixtures',
 help='Directory to save backup files'
 )
 parser.add_argument(
 '--include-questions',
 action='store_true',
 help='Include questions and options in backup'
 )

 def handle(self, *args, **options):
 output_dir = options['output_dir']
 include_questions = options['include_questions']

 # Create output directory if it doesn't exist
 os.makedirs(output_dir, exist_ok=True)

 self.stdout.write(' Starting test data backup...')

 # Backup skills
 self.backup_skills(output_dir)

 # Backup tests
 self.backup_tests(output_dir)

 if include_questions:
 # Backup questions (options are included in JSON field)
 self.backup_questions(output_dir)

 self.stdout.write(
 self.style.SUCCESS(' Test data backup completed successfully!')
 )
 self.stdout.write(f' Backup files saved to: {output_dir}')

 def backup_skills(self, output_dir):
 """Backup all skills"""
 skills = Skill.objects.all()
 if skills.exists():
 data = serializers.serialize('json', skills, indent=2)
 file_path = os.path.join(output_dir, 'skills_backup.json')
 with open(file_path, 'w', encoding='utf-8') as f:
 f.write(data)
 self.stdout.write(f' Backed up {skills.count()} skills to skills_backup.json')
 else:
 self.stdout.write('️ No skills found to backup')

 def backup_tests(self, output_dir):
 """Backup all tests"""
 tests = Test.objects.all()
 if tests.exists():
 data = serializers.serialize('json', tests, indent=2)
 file_path = os.path.join(output_dir, 'tests_backup.json')
 with open(file_path, 'w', encoding='utf-8') as f:
 f.write(data)
 self.stdout.write(f' Backed up {tests.count()} tests to tests_backup.json')
 else:
 self.stdout.write('️ No tests found to backup')

 def backup_questions(self, output_dir):
 """Backup all questions"""
 questions = Question.objects.all()
 if questions.exists():
 data = serializers.serialize('json', questions, indent=2)
 file_path = os.path.join(output_dir, 'questions_backup.json')
 with open(file_path, 'w', encoding='utf-8') as f:
 f.write(data)
 self.stdout.write(f' Backed up {questions.count()} questions to questions_backup.json')
 else:
 self.stdout.write('️ No questions found to backup')

