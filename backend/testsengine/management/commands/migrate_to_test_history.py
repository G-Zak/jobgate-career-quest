"""
Management command to migrate existing TestSubmissions to TestSessions
for the new test history system.
"""

from django.core.management.base import BaseCommand
from django.utils import timezone
from testsengine.models import TestSubmission, TestSession, TestAnswer, Question
import logging

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Migrate existing TestSubmissions to TestSessions for test history'

    def add_arguments(self, parser):
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Show what would be migrated without actually creating records',
        )
        parser.add_argument(
            '--user-id',
            type=int,
            help='Migrate only submissions for a specific user ID',
        )

    def handle(self, *args, **options):
        dry_run = options['dry_run']
        user_id = options.get('user_id')
        
        # Filter submissions
        submissions_query = TestSubmission.objects.filter(user__isnull=False)
        if user_id:
            submissions_query = submissions_query.filter(user_id=user_id)
        
        submissions = submissions_query.select_related('user', 'test', 'score').all()
        
        self.stdout.write(f"Found {submissions.count()} submissions to migrate")
        
        if dry_run:
            self.stdout.write(self.style.WARNING("DRY RUN - No records will be created"))
        
        migrated_count = 0
        skipped_count = 0
        
        for submission in submissions:
            try:
                # Check if TestSession already exists
                existing_session = TestSession.objects.filter(
                    user=submission.user,
                    test=submission.test
                ).first()
                
                if existing_session:
                    self.stdout.write(f"Skipping submission {submission.id} - TestSession already exists")
                    skipped_count += 1
                    continue
                
                if not dry_run:
                    # Create TestSession
                    test_session = TestSession.objects.create(
                        user=submission.user,
                        test=submission.test,
                        status='completed',
                        start_time=submission.submitted_at,
                        end_time=submission.submitted_at,  # Use same time for now
                        score=float(submission.score.percentage_score) if submission.score else 0.0,
                        answers=submission.answers_data,
                        time_spent=submission.time_taken_seconds
                    )
                    
                    # Create TestAnswer records
                    for question_id, selected_answer in submission.answers_data.items():
                        try:
                            question = Question.objects.get(id=question_id)
                            is_correct = (question.correct_answer == selected_answer)
                            
                            TestAnswer.objects.create(
                                session=test_session,
                                question=question,
                                selected_answer=selected_answer,
                                is_correct=is_correct,
                                time_taken=0
                            )
                        except Question.DoesNotExist:
                            logger.warning(f"Question {question_id} not found for submission {submission.id}")
                            continue
                    
                    self.stdout.write(f"Created TestSession {test_session.id} for submission {submission.id}")
                else:
                    self.stdout.write(f"Would create TestSession for submission {submission.id}")
                
                migrated_count += 1
                
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f"Error migrating submission {submission.id}: {str(e)}")
                )
                skipped_count += 1
        
        if dry_run:
            self.stdout.write(
                self.style.SUCCESS(f"DRY RUN COMPLETE: Would migrate {migrated_count} submissions, skip {skipped_count}")
            )
        else:
            self.stdout.write(
                self.style.SUCCESS(f"MIGRATION COMPLETE: Migrated {migrated_count} submissions, skipped {skipped_count}")
            )
