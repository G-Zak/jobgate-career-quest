# Django management command to migrate existing test data and setup scoring
from django.core.management.base import BaseCommand
from django.db import transaction
from testsengine.models import Question, TestSession, TestResponse
from testsengine.models import ScoringProfile, TestScore # Import from models
import json
import os
from pathlib import Path

class Command(BaseCommand):
 help = 'Migrate test data and setup comprehensive scoring system'

 def add_arguments(self, parser):
 parser.add_argument(
 '--data-dir',
 type=str,
 default='db-migration/questions',
 help='Path to the questions data directory'
 )
 parser.add_argument(
 '--recalculate-scores',
 action='store_true',
 help='Recalculate scores for existing test sessions'
 )

 def handle(self, *args, **options):
 data_dir = Path(options['data_dir'])

 with transaction.atomic():
 # 1. Migrate questions if they don't exist
 self.migrate_questions(data_dir)

 # 2. Setup scoring profiles
 self.setup_scoring_profiles()

 # 3. Recalculate scores if requested
 if options['recalculate_scores']:
 self.recalculate_existing_scores()

 def migrate_questions(self, data_dir):
 """Migrate questions from JSONL files to database"""
 self.stdout.write("Migrating questions to database...")

 question_files = {
 'sjt': data_dir / 'sjt_questions.jsonl',
 'verbal': data_dir / 'verbal_reasoning_questions.jsonl',
 'spatial': data_dir / 'spatial_reasoning_questions.jsonl'
 }

 total_imported = 0

 for test_type, file_path in question_files.items():
 if not file_path.exists():
 self.stdout.write(
 self.style.WARNING(f"File {file_path} not found, skipping...")
 )
 continue

 imported_count = 0

 with open(file_path, 'r', encoding='utf-8') as f:
 for line_num, line in enumerate(f, 1):
 try:
 data = json.loads(line.strip())

 # Check if question already exists
 if Question.objects.filter(
 test_type=test_type,
 question_id=data.get('id', f"{test_type}_{line_num}")
 ).exists():
 continue

 # Create question
 question = Question.objects.create(
 test_type=test_type,
 question_id=data.get('id', f"{test_type}_{line_num}"),
 question_text=data.get('question', data.get('scenario', '')),
 options=data.get('options', []),
 correct_answer=data.get('correct_answer', data.get('answer')),
 difficulty_level=data.get('difficulty', 'medium'),
 category=data.get('category', 'general'),
 tags=data.get('tags', []),
 explanation=data.get('explanation', ''),
 metadata=data
 )

 imported_count += 1

 except json.JSONDecodeError:
 self.stdout.write(
 self.style.ERROR(f"Invalid JSON in {file_path} line {line_num}")
 )
 continue
 except Exception as e:
 self.stdout.write(
 self.style.ERROR(f"Error importing question from {file_path} line {line_num}: {e}")
 )
 continue

 self.stdout.write(
 self.style.SUCCESS(f"Imported {imported_count} {test_type} questions")
 )
 total_imported += imported_count

 self.stdout.write(
 self.style.SUCCESS(f"Total questions imported: {total_imported}")
 )

 def setup_scoring_profiles(self):
 """Setup scoring profiles for different test types"""
 self.stdout.write("Setting up scoring profiles...")

 # Define scoring configurations inline
 configs = {
 'sjt': {
 'algorithm': 'competency_based',
 'parameters': {
 'competency_weights': {
 'leadership': 0.25,
 'teamwork': 0.20,
 'problem_solving': 0.25,
 'communication': 0.20,
 'decision_making': 0.10
 },
 'response_scoring': {
 'most_effective': 3,
 'effective': 2,
 'somewhat_effective': 1,
 'ineffective': 0
 }
 },
 'scale': {'min': 0, 'max': 100},
 'thresholds': {'pass': 70}
 },
 'verbal': {
 'algorithm': 'weighted_difficulty',
 'parameters': {
 'difficulty_weights': {
 'easy': 1.0,
 'medium': 1.5,
 'hard': 2.0,
 'expert': 2.5
 },
 'time_penalty_factor': 0.1
 },
 'scale': {'min': 0, 'max': 100},
 'thresholds': {'pass': 70}
 },
 'spatial': {
 'algorithm': 'irt_scoring',
 'parameters': {
 'ability_range': (-3, 3),
 'difficulty_range': (-2, 2),
 'discrimination_factor': 1.5,
 'time_weight': 0.2
 },
 'scale': {'min': 0, 'max': 100},
 'thresholds': {'pass': 70}
 }
 }

 for test_type, config in configs.items():
 # Create or update scoring profile
 profile, created = ScoringProfile.objects.get_or_create(
 name=f"{test_type.upper()} Standard Scoring",
 test_type=test_type,
 defaults={
 'scoring_algorithm': config['algorithm'],
 'algorithm_parameters': config['parameters'],
 'scale_min': config['scale']['min'],
 'scale_max': config['scale']['max'],
 'pass_threshold': config['thresholds']['pass'],
 'category_weights': config.get('category_weights', {}),
 'time_limits': config.get('time_limits', {}),
 'performance_levels': config.get('performance_levels', {}),
 'industry_rubrics': config.get('industry_rubrics', {}),
 'is_active': True
 }
 )

 if created:
 self.stdout.write(
 self.style.SUCCESS(f"Created scoring profile for {test_type}")
 )
 else:
 self.stdout.write(f"Scoring profile for {test_type} already exists")

 def recalculate_existing_scores(self):
 """Recalculate scores for existing test sessions"""
 self.stdout.write("Recalculating scores for existing test sessions...")

 sessions = TestSession.objects.all()

 for session in sessions:
 try:
 # Get scoring profile for this test type
 profile = ScoringProfile.objects.filter(
 test_type=session.test_type,
 is_active=True
 ).first()

 if not profile:
 self.stdout.write(
 self.style.WARNING(f"No scoring profile found for {session.test_type}")
 )
 continue

 # Basic score calculation (will be enhanced with full scoring engine)
 responses = TestResponse.objects.filter(session=session)
 correct_count = responses.filter(is_correct=True).count()
 total_count = responses.count()

 if total_count > 0:
 percentage = (correct_count / total_count) * 100
 scaled_score = (percentage / 100) * (profile.scale_max - profile.scale_min) + profile.scale_min

 # Create or update test score
 test_score, created = TestScore.objects.get_or_create(
 session=session,
 scoring_profile=profile,
 defaults={
 'raw_score': correct_count,
 'scaled_score': scaled_score,
 'percentage_score': percentage,
 'percentile_rank': min(95, percentage), # Placeholder
 'completion_time': session.end_time - session.start_time if session.end_time and session.start_time else 0,
 'accuracy_rate': percentage,
 'time_per_question': 60, # Placeholder
 'strengths': [],
 'weaknesses': [],
 'recommendations': [f"Continue practicing {session.test_type} questions"]
 }
 )

 if not created:
 # Update existing score
 test_score.raw_score = correct_count
 test_score.scaled_score = scaled_score
 test_score.percentage_score = percentage
 test_score.accuracy_rate = percentage
 test_score.save()

 self.stdout.write(f"Processed score for session {session.id}")

 except Exception as e:
 self.stdout.write(
 self.style.ERROR(f"Error calculating score for session {session.id}: {e}")
 )

 self.stdout.write(
 self.style.SUCCESS("Score recalculation completed")
 )
