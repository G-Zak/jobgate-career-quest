#!/usr/bin/env python3
"""
Database Migration Script for Skills Assessment Questions
Loads JSONL data into PostgreSQL/MySQL via Django ORM

Usage:
    python migrate_to_database.py --database postgresql
    python migrate_to_database.py --database mysql
    python migrate_to_database.py --dry-run  # Test without committing
"""

import os
import sys
import json
import argparse
import logging
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Any

# Django setup (if running standalone)
import django
from django.conf import settings
from django.db import transaction, connection
from django.core.management import call_command

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('migration.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)


class SkillsAssessmentMigrator:
    """
    Migrates skills assessment data from JSONL files to database
    """
    
    def __init__(self, data_dir: str, dry_run: bool = False):
        self.data_dir = Path(data_dir)
        self.dry_run = dry_run
        self.stats = {
            'total_questions': 0,
            'successful_imports': 0,
            'failed_imports': 0,
            'skipped_duplicates': 0
        }
        
        # Import Django models
        from django.apps import apps
        self.AssessmentQuestion = apps.get_model('testsengine', 'AssessmentQuestion')
        self.TestConfiguration = apps.get_model('testsengine', 'TestConfiguration')
    
    def load_jsonl_file(self, file_path: Path) -> List[Dict[str, Any]]:
        """Load and parse JSONL file"""
        questions = []
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                for line_num, line in enumerate(f, 1):
                    line = line.strip()
                    if not line:
                        continue
                    try:
                        question = json.loads(line)
                        questions.append(question)
                    except json.JSONDecodeError as e:
                        logger.error(f"JSON error in {file_path}:{line_num}: {e}")
            
            logger.info(f"Loaded {len(questions)} questions from {file_path.name}")
            return questions
            
        except FileNotFoundError:
            logger.error(f"File not found: {file_path}")
            return []
        except Exception as e:
            logger.error(f"Error loading {file_path}: {e}")
            return []
    
    def normalize_question_data(self, question: Dict[str, Any], test_type: str, category: str) -> Dict[str, Any]:
        """
        Normalize question data to match Django model fields
        """
        # Generate question_id if not present
        question_id = question.get('id', question.get('question_id'))
        if not question_id:
            question_id = f"{test_type}_{category}_{len(str(question.get('question', ''))[:10])}"
        
        # Normalize choices format
        choices = question.get('choices', [])
        if isinstance(choices, dict):
            # Convert {"A": "...", "B": "..."} to [{"text": "...", "id": "A"}, ...]
            choices = [{"id": k, "text": v} for k, v in choices.items()]
        elif isinstance(choices, list) and choices and isinstance(choices[0], str):
            # Convert ["option1", "option2"] to [{"text": "option1", "id": "A"}, ...]
            choice_labels = ['A', 'B', 'C', 'D', 'E']
            choices = [{"id": choice_labels[i], "text": choice} for i, choice in enumerate(choices)]
        
        # Normalize correct answer
        correct_answer = question.get('correct_answer', question.get('answer', 0))
        if isinstance(correct_answer, str):
            # Convert "A" to 0, "B" to 1, etc.
            if correct_answer.upper() in 'ABCDE':
                correct_answer = ord(correct_answer.upper()) - ord('A')
            else:
                correct_answer = 0
        
        # Extract metadata
        metadata = {}
        for key in ['time_limit', 'images', 'scenario', 'context', 'visual_elements']:
            if key in question:
                metadata[key] = question[key]
        
        return {
            'question_id': question_id,
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
    
    def migrate_file(self, file_path: Path, test_type: str, category: str) -> int:
        """
        Migrate a single JSONL file to database
        """
        logger.info(f"Migrating {file_path.name} ({test_type} - {category})")
        
        questions_data = self.load_jsonl_file(file_path)
        if not questions_data:
            return 0
        
        successful_imports = 0
        
        with transaction.atomic():
            for question_data in questions_data:
                try:
                    # Normalize the question data
                    normalized_data = self.normalize_question_data(question_data, test_type, category)
                    
                    if self.dry_run:
                        logger.info(f"DRY RUN: Would import question {normalized_data['question_id']}")
                        successful_imports += 1
                        continue
                    
                    # Check for existing question
                    existing = self.AssessmentQuestion.objects.filter(
                        question_id=normalized_data['question_id']
                    ).first()
                    
                    if existing:
                        logger.warning(f"Question {normalized_data['question_id']} already exists, skipping")
                        self.stats['skipped_duplicates'] += 1
                        continue
                    
                    # Create new question
                    question_obj = self.AssessmentQuestion.objects.create(**normalized_data)
                    logger.debug(f"Created question: {question_obj.question_id}")
                    successful_imports += 1
                    
                except Exception as e:
                    logger.error(f"Failed to import question: {e}")
                    logger.error(f"Question data: {question_data}")
                    self.stats['failed_imports'] += 1
                    
                    if not self.dry_run:
                        # In production, you might want to continue instead of failing
                        raise  # Re-raise to trigger transaction rollback
        
        logger.info(f"Successfully imported {successful_imports} questions from {file_path.name}")
        return successful_imports
    
    def create_test_configurations(self):
        """
        Create standard test configurations
        """
        if self.dry_run:
            logger.info("DRY RUN: Would create test configurations")
            return
        
        configurations = [
            {
                'name': 'SJT Assessment',
                'test_type': 'sjt',
                'description': 'Situational Judgment Test with 8 workplace domains',
                'total_questions': 50,
                'time_limit': 60,
                'difficulty_distribution': {'easy': 20, 'medium': 60, 'hard': 20},
                'category_distribution': {
                    'teamwork': 12, 'leadership': 12, 'ethics': 10, 'communication': 8, 
                    'customer_service': 8
                }
            },
            {
                'name': 'Verbal Reasoning Assessment',
                'test_type': 'verbal',
                'description': 'Comprehensive verbal reasoning test',
                'total_questions': 60,
                'time_limit': 90,
                'difficulty_distribution': {'easy': 30, 'medium': 50, 'hard': 20},
                'category_distribution': {
                    'analogies': 20, 'blood_relations': 15, 'classification': 15, 'coding_decoding': 10
                }
            },
            {
                'name': 'Spatial Reasoning Assessment',
                'test_type': 'spatial',
                'description': 'Visual-spatial intelligence test',
                'total_questions': 40,
                'time_limit': 75,
                'difficulty_distribution': {'easy': 25, 'medium': 50, 'hard': 25},
                'category_distribution': {
                    'mental_rotation': 15, 'shape_assembly': 10, 'spatial_visualization': 15
                }
            }
        ]
        
        for config_data in configurations:
            config, created = self.TestConfiguration.objects.get_or_create(
                name=config_data['name'],
                test_type=config_data['test_type'],
                defaults=config_data
            )
            
            if created:
                logger.info(f"Created test configuration: {config.name}")
            else:
                logger.info(f"Test configuration already exists: {config.name}")
    
    def run_migration(self):
        """
        Run the complete migration process
        """
        logger.info("Starting Skills Assessment Database Migration")
        logger.info(f"Data directory: {self.data_dir}")
        logger.info(f"Dry run mode: {self.dry_run}")
        
        # Define file mappings
        file_mappings = [
            # SJT Files
            ('situational-judgment/sjt_questions.jsonl', 'sjt', 'workplace_scenarios'),
            
            # Verbal Reasoning Files
            ('verbal-reasoning/analogy_questions.jsonl', 'verbal', 'analogies'),
            ('verbal-reasoning/blood_relations_questions.jsonl', 'verbal', 'blood_relations'),
            ('verbal-reasoning/classification_questions.jsonl', 'verbal', 'classification'),
            ('verbal-reasoning/classification_questions_extended.jsonl', 'verbal', 'classification'),
            ('verbal-reasoning/coding_decoding_questions.jsonl', 'verbal', 'coding_decoding'),
            ('verbal-reasoning/coding_decoding_questions_extended.jsonl', 'verbal', 'coding_decoding'),
            
            # Spatial files would be added when available
            # ('spatial-reasoning/spatial_questions.jsonl', 'spatial', 'visual_spatial'),
        ]
        
        # Migrate each file
        for file_path, test_type, category in file_mappings:
            full_path = self.data_dir / file_path
            if full_path.exists():
                imported = self.migrate_file(full_path, test_type, category)
                self.stats['successful_imports'] += imported
                self.stats['total_questions'] += imported
            else:
                logger.warning(f"File not found: {full_path}")
        
        # Create test configurations
        self.create_test_configurations()
        
        # Print final statistics
        logger.info("Migration completed!")
        logger.info(f"Total questions processed: {self.stats['total_questions']}")
        logger.info(f"Successful imports: {self.stats['successful_imports']}")
        logger.info(f"Failed imports: {self.stats['failed_imports']}")
        logger.info(f"Skipped duplicates: {self.stats['skipped_duplicates']}")


def setup_database_connection(database_type: str):
    """
    Configure Django database connection
    """
    if database_type == 'postgresql':
        database_config = {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': os.getenv('DB_NAME', 'jobgate_career_quest'),
            'USER': os.getenv('DB_USER', 'jobgate_user'),
            'PASSWORD': os.getenv('DB_PASSWORD', ''),
            'HOST': os.getenv('DB_HOST', 'localhost'),
            'PORT': os.getenv('DB_PORT', '5432'),
        }
    elif database_type == 'mysql':
        database_config = {
            'ENGINE': 'django.db.backends.mysql',
            'NAME': os.getenv('DB_NAME', 'jobgate_career_quest'),
            'USER': os.getenv('DB_USER', 'jobgate_user'),
            'PASSWORD': os.getenv('DB_PASSWORD', ''),
            'HOST': os.getenv('DB_HOST', 'localhost'),
            'PORT': os.getenv('DB_PORT', '3306'),
            'OPTIONS': {
                'charset': 'utf8mb4',
            },
        }
    else:  # SQLite for development
        database_config = {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': 'skills_assessment.db',
        }
    
    # Configure Django settings
    if not settings.configured:
        settings.configure(
            DATABASES={'default': database_config},
            INSTALLED_APPS=[
                'django.contrib.contenttypes',
                'django.contrib.auth',
                'testsengine',  # Your Django app
            ],
            USE_TZ=True,
        )
        django.setup()


def main():
    parser = argparse.ArgumentParser(description='Migrate skills assessment data to database')
    parser.add_argument('--database', choices=['postgresql', 'mysql', 'sqlite'], 
                       default='postgresql', help='Database type')
    parser.add_argument('--data-dir', default='./db-migration', 
                       help='Directory containing migration data files')
    parser.add_argument('--dry-run', action='store_true', 
                       help='Test migration without committing changes')
    parser.add_argument('--create-tables', action='store_true',
                       help='Create database tables before migration')
    
    args = parser.parse_args()
    
    # Setup database connection
    setup_database_connection(args.database)
    
    # Create tables if requested
    if args.create_tables:
        logger.info("Creating database tables...")
        call_command('migrate', verbosity=1)
    
    # Run migration
    migrator = SkillsAssessmentMigrator(args.data_dir, args.dry_run)
    migrator.run_migration()


if __name__ == '__main__':
    main()
