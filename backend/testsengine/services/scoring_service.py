"""
Dedicated Scoring Service for Backend-Only Test Scoring System

This service implements the difficulty coefficient system:
- Easy questions: 1.0 coefficient
- Medium questions: 1.5 coefficient  
- Hard questions: 2.0 coefficient

All scoring logic is centralized here to ensure consistency and maintainability.
"""

from decimal import Decimal, ROUND_HALF_UP
from typing import Dict, List, Tuple, Optional, Any
from django.db import transaction
from django.utils import timezone
from django.core.exceptions import ValidationError
import logging

from ..models import Test, Question, TestSubmission, Answer, Score

logger = logging.getLogger(__name__)


class ScoringConfig:
    """Configuration constants for the scoring system"""
    
    # Difficulty coefficients (FIXED SYSTEM REQUIREMENT)
    DIFFICULTY_COEFFICIENTS = {
        'easy': Decimal('1.0'),
        'medium': Decimal('1.5'),
        'hard': Decimal('2.0')
    }
    
    # Timer settings
    TEST_DURATION_MINUTES = 20  # Fixed 20 minutes
    
    # Scoring algorithm version
    SCORING_VERSION = "1.0"
    
    # Performance levels for grading
    GRADE_THRESHOLDS = {
        90: 'A',
        80: 'B', 
        70: 'C',
        60: 'D',
        0: 'F'
    }


class ScoringService:
    """
    Main scoring service for calculating test scores using difficulty coefficients.
    This is the single source of truth for all scoring operations.
    """
    
    def __init__(self):
        self.config = ScoringConfig()
        
    @transaction.atomic
    def score_test_submission(self, user, test: Test, answers_data: Dict[str, str], 
                            time_taken_seconds: int) -> Tuple[TestSubmission, Score]:
        """
        Complete scoring workflow for a test submission.
        
        Args:
            user: User who submitted the test
            test: Test instance
            answers_data: Dict mapping question_id -> selected_answer (e.g., {'1': 'A', '2': 'B'})
            time_taken_seconds: Total time taken for the test
            
        Returns:
            Tuple of (TestSubmission, Score) instances
            
        Raises:
            ValidationError: If answers_data is invalid
            ValueError: If scoring calculation fails
        """
        logger.info(f"Starting scoring for user {user.username} on test {test.title}")
        
        # Validate inputs
        self._validate_submission_data(test, answers_data, time_taken_seconds)
        
        # Create TestSubmission
        submission = self._create_test_submission(user, test, answers_data, time_taken_seconds)
        
        # Create Answer records and calculate scores
        answer_results = self._create_and_score_answers(submission, answers_data)
        
        # Calculate comprehensive score
        score = self._calculate_comprehensive_score(submission, answer_results)
        
        # Mark submission as scored
        submission.scored_at = timezone.now()
        submission.scoring_version = self.config.SCORING_VERSION
        submission.save()
        
        logger.info(f"Scoring complete: {score.percentage_score}% ({score.correct_answers}/{score.total_questions})")
        
        return submission, score
    
    def _validate_submission_data(self, test: Test, answers_data: Dict[str, str], 
                                time_taken_seconds: int) -> None:
        """Validate submission data before processing"""
        if not answers_data:
            raise ValidationError("No answers provided for submission")
            
        if time_taken_seconds < 0:
            raise ValidationError("Time taken cannot be negative")
            
        if time_taken_seconds > (self.config.TEST_DURATION_MINUTES * 60 + 60):  # Allow 1 minute grace
            logger.warning(f"Submission time ({time_taken_seconds}s) exceeds test duration")
            
        # Validate that all question IDs exist
        question_ids = set(str(q.id) for q in test.questions.all())
        provided_ids = set(answers_data.keys())
        
        if not provided_ids.issubset(question_ids):
            invalid_ids = provided_ids - question_ids
            raise ValidationError(f"Invalid question IDs: {invalid_ids}")
    
    def _create_test_submission(self, user, test: Test, answers_data: Dict[str, str], 
                              time_taken_seconds: int) -> TestSubmission:
        """Create TestSubmission record"""
        
        # Check for existing submission (one per user per test)
        existing_submission = TestSubmission.objects.filter(user=user, test=test).first()
        if existing_submission:
            logger.warning(f"Overwriting existing submission for user {user.username} on test {test.title}")
            existing_submission.delete()
        
        submission = TestSubmission.objects.create(
            user=user,
            test=test,
            time_taken_seconds=time_taken_seconds,
            answers_data=answers_data,
            is_complete=True,
            submitted_at=timezone.now()
        )
        
        logger.debug(f"Created TestSubmission {submission.id}")
        return submission
    
    def _create_and_score_answers(self, submission: TestSubmission, 
                                answers_data: Dict[str, str]) -> List[Dict[str, Any]]:
        """Create Answer records and calculate individual scores"""
        
        answer_results = []
        questions = submission.test.questions.all().order_by('order')
        
        for question in questions:
            question_id_str = str(question.id)
            selected_answer = answers_data.get(question_id_str, '').upper()
            
            # Determine if answer is correct
            is_correct = question.check_answer(selected_answer)
            
            # Calculate points based on difficulty coefficient
            if is_correct:
                points_awarded = self.config.DIFFICULTY_COEFFICIENTS[question.difficulty_level]
            else:
                points_awarded = Decimal('0.0')
            
            # Create Answer record
            answer = Answer.objects.create(
                submission=submission,
                question=question,
                selected_answer=selected_answer,
                is_correct=is_correct,
                points_awarded=points_awarded,
                time_taken_seconds=0,  # Individual question timing not implemented yet
                answered_at=timezone.now()
            )
            
            answer_results.append({
                'answer': answer,
                'question': question,
                'is_correct': is_correct,
                'points_awarded': points_awarded,
                'difficulty': question.difficulty_level
            })
        
        logger.debug(f"Created {len(answer_results)} Answer records")
        return answer_results
    
    def _calculate_comprehensive_score(self, submission: TestSubmission, 
                                     answer_results: List[Dict[str, Any]]) -> Score:
        """Calculate comprehensive score with detailed breakdown"""
        
        # Overall calculations
        total_questions = len(answer_results)
        correct_answers = sum(1 for result in answer_results if result['is_correct'])
        raw_score = sum(result['points_awarded'] for result in answer_results)
        
        # Calculate maximum possible score for this test
        max_possible_score = submission.test.calculate_max_score()
        
        # Calculate percentage
        if max_possible_score > 0:
            percentage_score = (raw_score / max_possible_score * 100).quantize(
                Decimal('0.01'), rounding=ROUND_HALF_UP
            )
        else:
            percentage_score = Decimal('0.00')
        
        # Difficulty breakdown
        difficulty_breakdown = self._calculate_difficulty_breakdown(answer_results)
        
        # Performance metrics
        time_metrics = self._calculate_time_metrics(submission, answer_results)
        
        # Create Score record
        score = Score.objects.create(
            submission=submission,
            raw_score=raw_score,
            max_possible_score=max_possible_score,
            percentage_score=percentage_score,
            correct_answers=correct_answers,
            total_questions=total_questions,
            
            # Difficulty breakdown
            easy_correct=difficulty_breakdown['easy']['correct'],
            medium_correct=difficulty_breakdown['medium']['correct'],
            hard_correct=difficulty_breakdown['hard']['correct'],
            easy_score=difficulty_breakdown['easy']['score'],
            medium_score=difficulty_breakdown['medium']['score'],
            hard_score=difficulty_breakdown['hard']['score'],
            
            # Performance metrics
            average_time_per_question=time_metrics['average'],
            fastest_question_time=time_metrics['fastest'],
            slowest_question_time=time_metrics['slowest'],
            
            # Metadata
            scoring_algorithm="difficulty_weighted",
            calculated_at=timezone.now(),
            metadata={
                'scoring_version': self.config.SCORING_VERSION,
                'difficulty_coefficients': {k: float(v) for k, v in self.config.DIFFICULTY_COEFFICIENTS.items()},
                'test_duration_minutes': self.config.TEST_DURATION_MINUTES,
                'submission_time_seconds': submission.time_taken_seconds
            }
        )
        
        logger.debug(f"Created Score {score.id}: {score.percentage_score}%")
        return score
    
    def _calculate_difficulty_breakdown(self, answer_results: List[Dict[str, Any]]) -> Dict[str, Dict[str, Any]]:
        """Calculate breakdown by difficulty level"""
        
        breakdown = {
            'easy': {'correct': 0, 'total': 0, 'score': Decimal('0.0')},
            'medium': {'correct': 0, 'total': 0, 'score': Decimal('0.0')},
            'hard': {'correct': 0, 'total': 0, 'score': Decimal('0.0')}
        }
        
        for result in answer_results:
            difficulty = result['difficulty']
            breakdown[difficulty]['total'] += 1
            
            if result['is_correct']:
                breakdown[difficulty]['correct'] += 1
                breakdown[difficulty]['score'] += result['points_awarded']
        
        return breakdown
    
    def _calculate_time_metrics(self, submission: TestSubmission, 
                              answer_results: List[Dict[str, Any]]) -> Dict[str, Decimal]:
        """Calculate time-based performance metrics"""
        
        total_time = submission.time_taken_seconds
        total_questions = len(answer_results)
        
        if total_questions > 0:
            average_time = Decimal(str(total_time / total_questions)).quantize(
                Decimal('0.01'), rounding=ROUND_HALF_UP
            )
        else:
            average_time = Decimal('0.00')
        
        # For now, use average for fastest/slowest since individual timing isn't implemented
        # In future versions, these could be calculated from individual Answer.time_taken_seconds
        return {
            'average': average_time,
            'fastest': max(1, int(average_time * Decimal('0.5'))),  # Estimate: 50% of average
            'slowest': int(average_time * Decimal('2.0'))  # Estimate: 200% of average
        }
    
    def get_score_summary(self, score: Score) -> Dict[str, Any]:
        """Get a formatted summary of the score results"""
        
        return {
            'overall': {
                'percentage': float(score.percentage_score),
                'grade_letter': score.grade_letter,
                'passed': score.passed,
                'raw_score': float(score.raw_score),
                'max_possible_score': float(score.max_possible_score),
                'correct_answers': score.correct_answers,
                'total_questions': score.total_questions
            },
            'difficulty_breakdown': {
                'easy': {
                    'correct': score.easy_correct,
                    'score': float(score.easy_score),
                    'coefficient': float(self.config.DIFFICULTY_COEFFICIENTS['easy'])
                },
                'medium': {
                    'correct': score.medium_correct,
                    'score': float(score.medium_score),
                    'coefficient': float(self.config.DIFFICULTY_COEFFICIENTS['medium'])
                },
                'hard': {
                    'correct': score.hard_correct,
                    'score': float(score.hard_score),
                    'coefficient': float(self.config.DIFFICULTY_COEFFICIENTS['hard'])
                }
            },
            'performance': {
                'average_time_per_question': float(score.average_time_per_question),
                'fastest_question_time': score.fastest_question_time,
                'slowest_question_time': score.slowest_question_time,
                'total_time_taken': score.submission.time_taken_seconds
            },
            'metadata': {
                'scoring_algorithm': score.scoring_algorithm,
                'calculated_at': score.calculated_at.isoformat(),
                'test_title': score.submission.test.title,
                'test_type': score.submission.test.test_type
            }
        }
    
    def recalculate_score(self, submission: TestSubmission) -> Score:
        """Recalculate score for an existing submission (for debugging/migration)"""
        
        logger.info(f"Recalculating score for submission {submission.id}")
        
        # Delete existing score if it exists
        if hasattr(submission, 'score'):
            submission.score.delete()
        
        # Get existing answers
        answers = submission.answers.all()
        answer_results = []
        
        for answer in answers:
            answer_results.append({
                'answer': answer,
                'question': answer.question,
                'is_correct': answer.is_correct,
                'points_awarded': answer.points_awarded,
                'difficulty': answer.question.difficulty_level
            })
        
        # Recalculate comprehensive score
        score = self._calculate_comprehensive_score(submission, answer_results)
        
        # Update submission
        submission.scored_at = timezone.now()
        submission.scoring_version = self.config.SCORING_VERSION
        submission.save()
        
        logger.info(f"Score recalculated: {score.percentage_score}%")
        return score


class ScoringUtils:
    """Utility functions for scoring operations"""
    
    @staticmethod
    def get_test_max_score(test: Test) -> Decimal:
        """Calculate maximum possible score for a test"""
        return test.calculate_max_score()
    
    @staticmethod
    def validate_difficulty_distribution(test: Test) -> Dict[str, Any]:
        """Validate that a test has a reasonable difficulty distribution"""
        
        questions = test.questions.all()
        total_questions = questions.count()
        
        if total_questions == 0:
            return {'valid': False, 'error': 'Test has no questions'}
        
        difficulty_counts = {
            'easy': questions.filter(difficulty_level='easy').count(),
            'medium': questions.filter(difficulty_level='medium').count(),
            'hard': questions.filter(difficulty_level='hard').count()
        }
        
        # Check for reasonable distribution (at least 20% each, max 60% any single difficulty)
        percentages = {k: (v / total_questions * 100) for k, v in difficulty_counts.items()}
        
        issues = []
        for difficulty, percentage in percentages.items():
            if percentage < 20:
                issues.append(f"Too few {difficulty} questions ({percentage:.1f}%)")
            elif percentage > 60:
                issues.append(f"Too many {difficulty} questions ({percentage:.1f}%)")
        
        return {
            'valid': len(issues) == 0,
            'issues': issues,
            'distribution': difficulty_counts,
            'percentages': percentages,
            'total_questions': total_questions,
            'max_possible_score': float(ScoringUtils.get_test_max_score(test))
        }
