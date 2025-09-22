"""
API Views for the testsengine app
Implements backend-only scoring architecture with secure endpoints
"""

from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.db import transaction
from django.db import models
from django.utils import timezone
from django.core.cache import cache
from django.http import Http404
import logging

from .models import Test, Question, TestSubmission, Answer, Score
from .serializers import (
    TestListSerializer, TestDetailSerializer, QuestionForTestSerializer,
    SubmissionInputSerializer, ScoreDetailSerializer, TestSubmissionSerializer,
    ScoringConfigSerializer, DifficultyDistributionSerializer
)
from .services.scoring_service import ScoringService, ScoringConfig, ScoringUtils

logger = logging.getLogger(__name__)


class TestListView(generics.ListAPIView):
    """
    List all active tests available for taking.
    GET /api/tests/
    """
    serializer_class = TestListSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Return only active tests with questions"""
        return Test.objects.filter(
            is_active=True,
            questions__isnull=False
        ).distinct().order_by('-created_at')
    
    def list(self, request, *args, **kwargs):
        """Add metadata to the response"""
        response = super().list(request, *args, **kwargs)
        
        # Add scoring configuration for transparency
        config = ScoringConfig()
        response.data = {
            'tests': response.data,
            'scoring_config': {
                'coefficients': {k: float(v) for k, v in config.DIFFICULTY_COEFFICIENTS.items()},
                'test_duration_minutes': config.TEST_DURATION_MINUTES,
                'scoring_version': config.SCORING_VERSION
            }
        }
        
        return response


class TestDetailView(generics.RetrieveAPIView):
    """
    Get detailed test information including questions (WITHOUT correct answers).
    GET /api/tests/{id}/
    
    This is the main endpoint for starting a test.
    """
    serializer_class = TestDetailSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Test.objects.filter(is_active=True)
    
    def retrieve(self, request, *args, **kwargs):
        """Add user-specific metadata and security checks"""
        test = self.get_object()
        
        # Check if user already has a submission for this test
        existing_submission = TestSubmission.objects.filter(
            user=request.user,
            test=test
        ).first()
        
        if existing_submission:
            logger.warning(f"User {request.user.username} already has submission for test {test.title}")
            
        response = super().retrieve(request, *args, **kwargs)
        
        # Add user-specific metadata
        response.data['user_status'] = {
            'has_previous_submission': existing_submission is not None,
            'previous_submission_id': existing_submission.id if existing_submission else None,
            'previous_score': existing_submission.score.percentage_score if existing_submission and hasattr(existing_submission, 'score') else None
        }
        
        # Add instructions for frontend
        response.data['instructions'] = {
            'duration_minutes': test.duration_minutes,
            'total_questions': test.total_questions,
            'passing_score': test.passing_score,
            'scoring_info': 'Difficulty coefficients: Easy=1.0, Medium=1.5, Hard=2.0',
            'submission_format': 'Submit answers as {"question_id": "selected_answer"} format',
            'time_tracking': 'Frontend should track total time and send with submission'
        }
        
        return response


class TestQuestionsView(APIView):
    """
    Get only the questions for a test (alternative endpoint).
    GET /api/tests/{test_id}/questions/
    
    Provides questions in a cleaner format for frontend consumption.
    """
    permission_classes = [permissions.AllowAny]  # Temporarily allow anonymous access for testing
    
    def get(self, request, test_id):
        """Return random questions without correct answers"""
        test = get_object_or_404(Test, id=test_id, is_active=True)
        
        # Get all questions
        all_questions = test.questions.all()
        
        if not all_questions.exists():
            return Response(
                {'error': 'No questions found for this test'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # For numerical test (ID 21), logical tests (30, 31, 32), diagrammatic tests (24, 25), and abstract test (10), return random questions with balanced difficulty
        if test_id == 21:  # Numerical test
            questions = self._get_balanced_random_questions(all_questions, 20)
        elif test_id in [30, 31, 32]:  # Logical tests
            questions = self._get_balanced_random_questions(all_questions, 20)
        elif test_id in [24, 25]:  # Diagrammatic tests (DRT1, DRT2)
            questions = self._get_balanced_random_questions(all_questions, 20)
        elif test_id == 4:  # Situational Judgment Test
            questions = self._get_balanced_random_questions(all_questions, 20)
        elif test_id == 10:  # Abstract test (ART1)
            questions = self._get_balanced_random_questions(all_questions, 20)
        else:
            # For other tests, return all questions in order
            questions = all_questions.order_by('order')
        
        serializer = QuestionForTestSerializer(questions, many=True)
        
        return Response({
            'test_id': test.id,
            'test_title': test.title,
            'test_type': test.test_type,
            'duration_minutes': test.duration_minutes,
            'total_questions': len(questions),
            'questions': serializer.data,
            'fetched_at': timezone.now().isoformat(),
            'security_note': 'Correct answers are not included - submit for scoring',
            'random_selection': test_id in [4, 10, 21, 24, 25, 30, 31, 32]  # Indicate if questions were randomly selected
        })
    
    def _get_balanced_random_questions(self, all_questions, target_count=20):
        """Get 20 random questions with balanced difficulty distribution"""
        import random
        
        # Separate questions by difficulty
        easy_questions = list(all_questions.filter(difficulty_level='easy'))
        medium_questions = list(all_questions.filter(difficulty_level='medium'))
        hard_questions = list(all_questions.filter(difficulty_level='hard'))
        
        # Calculate how many questions to select from each difficulty
        # Target distribution: 8 easy, 7 medium, 5 hard (total 20)
        easy_count = min(8, len(easy_questions))
        medium_count = min(7, len(medium_questions))
        hard_count = min(5, len(hard_questions))
        
        # If we don't have enough questions in some categories, redistribute
        remaining = target_count - (easy_count + medium_count + hard_count)
        if remaining > 0:
            if len(easy_questions) > easy_count:
                easy_count += min(remaining, len(easy_questions) - easy_count)
                remaining = target_count - (easy_count + medium_count + hard_count)
            if remaining > 0 and len(medium_questions) > medium_count:
                medium_count += min(remaining, len(medium_questions) - medium_count)
                remaining = target_count - (easy_count + medium_count + hard_count)
            if remaining > 0 and len(hard_questions) > hard_count:
                hard_count += min(remaining, len(hard_questions) - hard_count)
        
        # Randomly select questions from each difficulty level
        selected_questions = []
        selected_questions.extend(random.sample(easy_questions, easy_count))
        selected_questions.extend(random.sample(medium_questions, medium_count))
        selected_questions.extend(random.sample(hard_questions, hard_count))
        
        # Shuffle the final selection to randomize order
        random.shuffle(selected_questions)
        
        return selected_questions


class SubmitTestView(APIView):
    """
    Submit test answers for scoring - MAIN SUBMISSION ENDPOINT.
    POST /api/tests/{test_id}/submit/
    
    This is the primary endpoint for submitting test answers and receiving
    immediate scoring results. Implements the backend-only scoring architecture.
    
    Request Body: {
        "answers": {"1": "A", "2": "B", "3": "C"},  // question_id -> selected_answer
        "time_taken_seconds": 1200,                  // total test duration
        "submission_metadata": {                      // optional metadata
            "browser": "Chrome",
            "device": "Desktop",
            "session_id": "abc123"
        }
    }
    """
    permission_classes = [permissions.AllowAny]  # Temporarily allow anonymous access for testing
    
    @transaction.atomic
    def post(self, request, test_id):
        """Process test submission and calculate score"""
        test = get_object_or_404(Test, id=test_id, is_active=True)
        
        # Handle anonymous users for testing
        user = request.user if request.user.is_authenticated else None
        
        # Check if user already has a submission for this test (only for authenticated users)
        existing_submission = None
        if user:
            existing_submission = TestSubmission.objects.filter(
                user=user,
                test=test
            ).first()
            
            if existing_submission:
                logger.warning(f"User {user.username} already has submission for test {test.title}")
                return Response({
                    'error': 'Submission already exists for this test',
                    'existing_submission_id': existing_submission.id,
                    'existing_score': existing_submission.score.percentage_score if hasattr(existing_submission, 'score') else None,
                    'submitted_at': existing_submission.submitted_at.isoformat(),
                    'message': 'Use recalculate endpoint to update score if needed'
                }, status=status.HTTP_409_CONFLICT)
        
        # Validate input data
        serializer = SubmissionInputSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {'error': 'Invalid submission data', 'details': serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        validated_data = serializer.validated_data
        answers_data = validated_data['answers']
        time_taken_seconds = validated_data['time_taken_seconds']
        submission_metadata = request.data.get('submission_metadata', {})
        
        # Additional validation
        validation_result = self._validate_submission_requirements(test, answers_data, time_taken_seconds)
        if not validation_result['valid']:
            return Response({
                'error': 'Submission validation failed',
                'details': validation_result['errors'],
                'warnings': validation_result.get('warnings', [])
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Use scoring service to process submission
            scoring_service = ScoringService()
            
            submission, score = scoring_service.score_test_submission(
                user=user,  # This will be None for anonymous users
                test=test,
                answers_data=answers_data,
                time_taken_seconds=time_taken_seconds
            )
            
            # Add submission metadata
            if submission_metadata:
                submission.answers_data.update({'metadata': submission_metadata})
                submission.save()
            
            logger.info(f"Test submitted successfully: User {request.user.username}, Test {test.title}, Score {score.percentage_score}%")
            
            # Return immediate score results with enhanced data
            score_serializer = ScoreDetailSerializer(score)
            
            response_data = {
                'success': True,
                'submission_id': submission.id,
                'message': 'Test submitted and scored successfully',
                'score': score_serializer.data,
                'submitted_at': submission.submitted_at.isoformat(),
                'processing_info': {
                    'scoring_version': submission.scoring_version,
                    'questions_answered': len(answers_data),
                    'expected_questions': test.total_questions,
                    'completion_rate': len(answers_data) / test.total_questions * 100 if test.total_questions > 0 else 0,
                    'time_efficiency': self._calculate_time_efficiency(time_taken_seconds, test.duration_minutes)
                },
                'next_steps': {
                    'view_detailed_results': f'/api/submissions/{submission.id}/results/',
                    'compare_with_others': f'/api/tests/{test.id}/leaderboard/',
                    'view_analytics': '/api/analytics/scores/'
                }
            }
            
            # Add warnings if any
            warnings = validation_result.get('warnings', [])
            if warnings:
                response_data['warnings'] = warnings
            
            return Response(response_data, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            logger.error(f"Error processing test submission: {e}")
            return Response(
                {'error': 'Failed to process submission', 'details': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def _validate_submission_requirements(self, test, answers_data, time_taken_seconds):
        """Validate submission meets test requirements"""
        errors = []
        warnings = []
        
        # Check that provided questions are valid (allow partial submissions)
        expected_questions = set(str(q.id) for q in test.questions.all())
        provided_questions = set(answers_data.keys())
        
        extra_questions = provided_questions - expected_questions
        
        if extra_questions:
            errors.append(f"Invalid question IDs provided: {sorted(extra_questions)}")
        
        # Allow partial submissions - only validate that provided answers are for valid questions
        if not provided_questions:
            errors.append("No answers provided")
        
        # Check time constraints
        max_time = test.duration_minutes * 60 + 60  # Allow 1 minute grace period
        if time_taken_seconds > max_time:
            warnings.append(f"Submission time ({time_taken_seconds}s) exceeds test duration ({test.duration_minutes} minutes)")
        
        if time_taken_seconds < 60:  # Less than 1 minute
            warnings.append(f"Very fast submission ({time_taken_seconds}s) - please verify answers")
        
        # Check answer format
        valid_answers = ['A', 'B', 'C', 'D', 'E', 'F']
        for question_id, answer in answers_data.items():
            if answer.upper() not in valid_answers:
                errors.append(f"Invalid answer format '{answer}' for question {question_id}")
        
        return {
            'valid': len(errors) == 0,
            'errors': errors,
            'warnings': warnings
        }
    
    def _calculate_time_efficiency(self, time_taken_seconds, duration_minutes):
        """Calculate time efficiency metrics"""
        expected_time = duration_minutes * 60
        efficiency = (expected_time / time_taken_seconds) * 100 if time_taken_seconds > 0 else 0
        
        if efficiency > 100:
            return f"Efficient ({efficiency:.1f}% of allocated time used)"
        elif efficiency > 80:
            return f"Good pace ({efficiency:.1f}% of allocated time used)"
        else:
            return f"Time pressure ({efficiency:.1f}% of allocated time used)"


class TestResultView(generics.RetrieveAPIView):
    """
    Get detailed test results by submission ID.
    GET /api/submissions/{submission_id}/results/
    """
    serializer_class = ScoreDetailSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        """Get score for the submission, ensuring user owns it"""
        submission_id = self.kwargs['submission_id']
        submission = get_object_or_404(
            TestSubmission,
            id=submission_id,
            user=self.request.user
        )
        
        if not hasattr(submission, 'score'):
            raise Http404("Score not found for this submission")
            
        return submission.score


class UserSubmissionsView(generics.ListAPIView):
    """
    List all submissions for the current user.
    GET /api/my-submissions/
    """
    serializer_class = TestSubmissionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return TestSubmission.objects.filter(
            user=self.request.user
        ).order_by('-submitted_at')


class TestStatsView(APIView):
    """
    Get statistics for a specific test.
    GET /api/tests/{test_id}/stats/
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, test_id):
        """Return test statistics and difficulty distribution"""
        test = get_object_or_404(Test, id=test_id, is_active=True)
        
        # Use scoring utils to analyze the test
        utils = ScoringUtils()
        distribution = utils.validate_difficulty_distribution(test)
        
        # Get submission statistics
        submissions = TestSubmission.objects.filter(test=test)
        scores = Score.objects.filter(submission__test=test)
        
        stats = {
            'test_info': {
                'id': test.id,
                'title': test.title,
                'type': test.test_type,
                'total_questions': test.total_questions,
                'max_possible_score': float(test.calculate_max_score()),
                'duration_minutes': test.duration_minutes,
                'passing_score': test.passing_score
            },
            'difficulty_distribution': distribution,
            'submission_stats': {
                'total_submissions': submissions.count(),
                'completed_submissions': submissions.filter(is_complete=True).count(),
                'average_score': float(scores.aggregate(avg=models.Avg('percentage_score'))['avg'] or 0),
                'pass_rate': float(scores.filter(percentage_score__gte=test.passing_score).count() / max(scores.count(), 1) * 100)
            }
        }
        
        return Response(stats)


# Configuration and Utility Endpoints

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def scoring_config_view(request):
    """
    Get current scoring configuration.
    GET /api/scoring-config/
    """
    config = ScoringConfig()
    
    config_data = {
        'difficulty_coefficients': {k: float(v) for k, v in config.DIFFICULTY_COEFFICIENTS.items()},
        'test_duration_minutes': config.TEST_DURATION_MINUTES,
        'scoring_version': config.SCORING_VERSION,
        'grade_thresholds': config.GRADE_THRESHOLDS,
        'passing_score_default': 70
    }
    
    serializer = ScoringConfigSerializer(config_data)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def validate_test_answers(request):
    """
    Validate answer format without scoring (for frontend validation).
    POST /api/validate-answers/
    
    Body: {
        "test_id": 1,
        "answers": {"1": "A", "2": "B"}
    }
    """
    test_id = request.data.get('test_id')
    answers = request.data.get('answers', {})
    
    if not test_id:
        return Response({'error': 'test_id is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    test = get_object_or_404(Test, id=test_id, is_active=True)
    
    # Validate answer format
    serializer = SubmissionInputSerializer(data={'answers': answers, 'time_taken_seconds': 1})
    if not serializer.is_valid():
        return Response({
            'valid': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Check if all questions are answered
    question_ids = set(str(q.id) for q in test.questions.all())
    provided_ids = set(answers.keys())
    
    missing_questions = question_ids - provided_ids
    extra_questions = provided_ids - question_ids
    
    return Response({
        'valid': len(missing_questions) == 0 and len(extra_questions) == 0,
        'missing_questions': list(missing_questions),
        'extra_questions': list(extra_questions),
        'total_questions': len(question_ids),
        'answered_questions': len(provided_ids),
        'completion_percentage': len(provided_ids) / len(question_ids) * 100 if question_ids else 0
    })


# Dedicated Scoring Endpoints

class CalculateScoreView(APIView):
    """
    Calculate score for a given set of answers without creating a submission.
    POST /api/tests/{test_id}/calculate-score/
    
    This endpoint allows calculating scores for preview/validation purposes
    without permanently storing the submission.
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, test_id):
        """Calculate score without creating permanent submission"""
        test = get_object_or_404(Test, id=test_id, is_active=True)
        
        # Validate input data
        serializer = SubmissionInputSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {'error': 'Invalid submission data', 'details': serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        validated_data = serializer.validated_data
        answers_data = validated_data['answers']
        time_taken_seconds = validated_data['time_taken_seconds']
        
        try:
            # Calculate score without saving to database
            scoring_service = ScoringService()
            
            # Simulate scoring without database operations
            score_preview = self._calculate_score_preview(
                test, answers_data, time_taken_seconds, scoring_service
            )
            
            logger.info(f"Score calculated for preview: User {request.user.username}, Test {test.title}, Score {score_preview['percentage_score']}%")
            
            return Response({
                'success': True,
                'message': 'Score calculated successfully (preview mode)',
                'score_preview': score_preview,
                'calculated_at': timezone.now().isoformat(),
                'note': 'This is a preview calculation - no data has been saved'
            })
            
        except Exception as e:
            logger.error(f"Error calculating score preview: {e}")
            return Response(
                {'error': 'Failed to calculate score', 'details': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def _calculate_score_preview(self, test, answers_data, time_taken_seconds, scoring_service):
        """Calculate score preview without database operations"""
        questions = test.questions.all().order_by('order')
        
        correct_answers = 0
        raw_score = 0
        difficulty_breakdown = {'easy': 0, 'medium': 0, 'hard': 0}
        difficulty_correct = {'easy': 0, 'medium': 0, 'hard': 0}
        answer_details = []
        
        for question in questions:
            question_id_str = str(question.id)
            selected_answer = answers_data.get(question_id_str, '').upper()
            is_correct = question.check_answer(selected_answer)
            
            if is_correct:
                points = float(scoring_service.config.DIFFICULTY_COEFFICIENTS[question.difficulty_level])
                raw_score += points
                correct_answers += 1
                difficulty_correct[question.difficulty_level] += 1
                difficulty_breakdown[question.difficulty_level] += points
            
            answer_details.append({
                'question_id': question.id,
                'question_order': question.order,
                'question_text': question.question_text,
                'selected_answer': selected_answer,
                'correct_answer': question.correct_answer,
                'is_correct': is_correct,
                'difficulty_level': question.difficulty_level,
                'points_awarded': points if is_correct else 0,
                'scoring_coefficient': float(scoring_service.config.DIFFICULTY_COEFFICIENTS[question.difficulty_level])
            })
        
        max_possible_score = float(test.calculate_max_score())
        percentage_score = (raw_score / max_possible_score * 100) if max_possible_score > 0 else 0
        
        # Calculate grade
        grade_letter = 'F'
        for threshold, grade in scoring_service.config.GRADE_THRESHOLDS.items():
            if percentage_score >= threshold:
                grade_letter = grade
                break
        
        return {
            'raw_score': raw_score,
            'max_possible_score': max_possible_score,
            'percentage_score': round(percentage_score, 2),
            'correct_answers': correct_answers,
            'total_questions': questions.count(),
            'grade_letter': grade_letter,
            'passed': percentage_score >= test.passing_score,
            'difficulty_breakdown': {
                'easy': {'correct': difficulty_correct['easy'], 'score': difficulty_breakdown['easy']},
                'medium': {'correct': difficulty_correct['medium'], 'score': difficulty_breakdown['medium']},
                'hard': {'correct': difficulty_correct['hard'], 'score': difficulty_breakdown['hard']}
            },
            'time_taken_seconds': time_taken_seconds,
            'average_time_per_question': round(time_taken_seconds / questions.count(), 2) if questions.count() > 0 else 0,
            'answer_details': answer_details
        }


class RecalculateScoreView(APIView):
    """
    Recalculate score for an existing submission.
    POST /api/submissions/{submission_id}/recalculate/
    
    Useful for debugging or when scoring algorithm is updated.
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, submission_id):
        """Recalculate score for existing submission"""
        submission = get_object_or_404(
            TestSubmission,
            id=submission_id,
            user=request.user
        )
        
        try:
            scoring_service = ScoringService()
            
            # Recalculate the score
            with transaction.atomic():
                new_score = scoring_service.recalculate_score(submission)
            
            score_serializer = ScoreDetailSerializer(new_score)
            
            logger.info(f"Score recalculated: Submission {submission_id}, New score {new_score.percentage_score}%")
            
            return Response({
                'success': True,
                'message': 'Score recalculated successfully',
                'submission_id': submission.id,
                'recalculated_at': timezone.now().isoformat(),
                'score': score_serializer.data
            })
            
        except Exception as e:
            logger.error(f"Error recalculating score for submission {submission_id}: {e}")
            return Response(
                {'error': 'Failed to recalculate score', 'details': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ScoreComparisonView(APIView):
    """
    Compare scores across multiple submissions.
    GET /api/scores/compare/?submissions=1,2,3
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        """Compare multiple scores"""
        submission_ids = request.query_params.get('submissions', '').split(',')
        
        if not submission_ids or not all(id.strip().isdigit() for id in submission_ids):
            return Response(
                {'error': 'Valid submission IDs required (e.g., ?submissions=1,2,3)'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get submissions belonging to the user
        submissions = TestSubmission.objects.filter(
            id__in=[int(id.strip()) for id in submission_ids],
            user=request.user
        ).select_related('test', 'score')
        
        if not submissions.exists():
            return Response(
                {'error': 'No valid submissions found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        comparison_data = []
        for submission in submissions:
            if hasattr(submission, 'score'):
                comparison_data.append({
                    'submission_id': submission.id,
                    'test_title': submission.test.title,
                    'test_type': submission.test.test_type,
                    'submitted_at': submission.submitted_at.isoformat(),
                    'time_taken_seconds': submission.time_taken_seconds,
                    'percentage_score': float(submission.score.percentage_score),
                    'grade_letter': submission.score.grade_letter,
                    'passed': submission.score.passed,
                    'correct_answers': submission.score.correct_answers,
                    'total_questions': submission.score.total_questions,
                    'difficulty_performance': {
                        'easy': f"{submission.score.easy_correct}/3" if submission.score.easy_correct else "0/3",
                        'medium': f"{submission.score.medium_correct}/3" if submission.score.medium_correct else "0/3", 
                        'hard': f"{submission.score.hard_correct}/3" if submission.score.hard_correct else "0/3"
                    }
                })
        
        # Calculate comparison statistics
        scores = [item['percentage_score'] for item in comparison_data]
        comparison_stats = {
            'total_submissions': len(comparison_data),
            'average_score': round(sum(scores) / len(scores), 2) if scores else 0,
            'highest_score': max(scores) if scores else 0,
            'lowest_score': min(scores) if scores else 0,
            'improvement': round(scores[-1] - scores[0], 2) if len(scores) >= 2 else 0,
            'consistency': round(max(scores) - min(scores), 2) if len(scores) > 1 else 0
        }
        
        return Response({
            'comparison_data': comparison_data,
            'statistics': comparison_stats,
            'generated_at': timezone.now().isoformat()
        })


class LeaderboardView(APIView):
    """
    Get leaderboard for a specific test.
    GET /api/tests/{test_id}/leaderboard/
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, test_id):
        """Get test leaderboard"""
        test = get_object_or_404(Test, id=test_id, is_active=True)
        
        # Get top scores for this test
        top_scores = Score.objects.filter(
            submission__test=test
        ).select_related(
            'submission__user', 'submission__test'
        ).order_by('-percentage_score', 'submission__time_taken_seconds')[:10]
        
        leaderboard_data = []
        for i, score in enumerate(top_scores, 1):
            leaderboard_data.append({
                'rank': i,
                'username': score.submission.user.username,
                'percentage_score': float(score.percentage_score),
                'grade_letter': score.grade_letter,
                'time_taken_seconds': score.submission.time_taken_seconds,
                'submitted_at': score.submission.submitted_at.isoformat(),
                'correct_answers': score.correct_answers,
                'total_questions': score.total_questions
            })
        
        # Get current user's rank if they have a submission
        user_score = Score.objects.filter(
            submission__test=test,
            submission__user=request.user
        ).first()
        
        user_rank = None
        if user_score:
            better_scores = Score.objects.filter(
                submission__test=test,
                percentage_score__gt=user_score.percentage_score
            ).count()
            
            same_scores_faster = Score.objects.filter(
                submission__test=test,
                percentage_score=user_score.percentage_score,
                submission__time_taken_seconds__lt=user_score.submission.time_taken_seconds
            ).count()
            
            user_rank = better_scores + same_scores_faster + 1
        
        return Response({
            'test_info': {
                'id': test.id,
                'title': test.title,
                'test_type': test.test_type
            },
            'leaderboard': leaderboard_data,
            'user_rank': user_rank,
            'total_participants': Score.objects.filter(submission__test=test).count(),
            'generated_at': timezone.now().isoformat()
        })


# Analytics and Reporting Endpoints

class ScoreAnalyticsView(APIView):
    """
    Get comprehensive analytics for scores.
    GET /api/analytics/scores/
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        """Get score analytics for the authenticated user"""
        user_submissions = TestSubmission.objects.filter(
            user=request.user
        ).select_related('test', 'score')
        
        if not user_submissions.exists():
            return Response({
                'message': 'No submissions found for analysis',
                'analytics': None
            })
        
        # Calculate analytics
        scores = [s.score for s in user_submissions if hasattr(s, 'score')]
        
        if not scores:
            return Response({
                'message': 'No scored submissions found for analysis',
                'analytics': None
            })
        
        analytics = {
            'overall_performance': {
                'total_tests_taken': len(scores),
                'average_score': round(sum(float(s.percentage_score) for s in scores) / len(scores), 2),
                'highest_score': max(float(s.percentage_score) for s in scores),
                'lowest_score': min(float(s.percentage_score) for s in scores),
                'tests_passed': sum(1 for s in scores if s.passed),
                'pass_rate': round(sum(1 for s in scores if s.passed) / len(scores) * 100, 2)
            },
            'difficulty_analysis': {
                'easy_average': round(sum(s.easy_correct for s in scores) / (len(scores) * 3) * 100, 2) if scores else 0,
                'medium_average': round(sum(s.medium_correct for s in scores) / (len(scores) * 3) * 100, 2) if scores else 0,
                'hard_average': round(sum(s.hard_correct for s in scores) / (len(scores) * 3) * 100, 2) if scores else 0
            },
            'time_performance': {
                'average_time_per_question': round(sum(float(s.average_time_per_question) for s in scores) / len(scores), 2),
                'fastest_overall': min(s.fastest_question_time for s in scores),
                'slowest_overall': max(s.slowest_question_time for s in scores)
            },
            'progress_trend': [
                {
                    'test_number': i + 1,
                    'percentage_score': float(score.percentage_score),
                    'date': score.submission.submitted_at.isoformat(),
                    'test_title': score.submission.test.title
                }
                for i, score in enumerate(scores)
            ]
        }
        
        return Response({
            'user': request.user.username,
            'analytics': analytics,
            'generated_at': timezone.now().isoformat()
        })


# Health Check Endpoint

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def health_check(request):
    """
    Health check endpoint for the API.
    GET /api/health/
    """
    try:
        # Check database connectivity
        test_count = Test.objects.count()
        question_count = Question.objects.count()
        submission_count = TestSubmission.objects.count()
        score_count = Score.objects.count()
        
        # Check scoring service
        scoring_service = ScoringService()
        config = scoring_service.config
        
        return Response({
            'status': 'healthy',
            'timestamp': timezone.now().isoformat(),
            'database': {
                'connected': True,
                'tests': test_count,
                'questions': question_count,
                'submissions': submission_count,
                'scores': score_count
            },
            'scoring_service': {
                'available': True,
                'version': config.SCORING_VERSION,
                'coefficients': {k: float(v) for k, v in config.DIFFICULTY_COEFFICIENTS.items()}
            },
            'api_version': '1.0'
        })
    except Exception as e:
        return Response({
            'status': 'unhealthy',
            'error': str(e),
            'timestamp': timezone.now().isoformat()
        }, status=status.HTTP_503_SERVICE_UNAVAILABLE)