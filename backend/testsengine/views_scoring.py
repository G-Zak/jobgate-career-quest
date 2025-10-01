"""
Django Views for Universal Scoring System

API endpoints for the universal scoring system.
"""

import json
import logging
from typing import Dict, Any
from django.http import JsonResponse, HttpResponseBadRequest
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.utils.decorators import method_decorator
from django.views import View
from django.core.exceptions import ValidationError
from django.db import transaction

from .models_scoring import ScoringConfig, TestSession, Question, TestResult
from .scoring_service import ScoringService, TestDataImporter

logger = logging.getLogger(__name__)

class ScoringAPIView(View):
 """Base class for scoring API views"""

 @method_decorator(csrf_exempt)
 def dispatch(self, *args, **kwargs):
 return super().dispatch(*args, **kwargs)

class StartTestSessionView(ScoringAPIView):
 """Start a new test session"""

 @method_decorator(login_required)
 def post(self, request):
 try:
 data = json.loads(request.body)

 # Validate required fields
 required_fields = ['test_id', 'test_type']
 for field in required_fields:
 if field not in data:
 return JsonResponse({
 'error': f'Missing required field: {field}'
 }, status=400)

 # Create scoring service
 scoring_config_name = data.get('scoring_config')
 service = ScoringService(scoring_config_name)

 # Start test session
 session = service.start_test_session(
 user=request.user,
 test_id=data['test_id'],
 test_type=data['test_type'],
 scoring_config_name=scoring_config_name
 )

 return JsonResponse({
 'success': True,
 'session_id': session.id,
 'test_id': session.test_id,
 'test_type': session.test_type,
 'started_at': session.started_at.isoformat(),
 'scoring_config': {
 'time_weight': float(session.scoring_config.time_weight) if session.scoring_config else 0.3,
 'difficulty_weight': float(session.scoring_config.difficulty_weight) if session.scoring_config else 0.5,
 'accuracy_weight': float(session.scoring_config.accuracy_weight) if session.scoring_config else 0.2
 }
 })

 except Exception as e:
 logger.error(f"Error starting test session: {e}")
 return JsonResponse({
 'error': 'Failed to start test session',
 'details': str(e)
 }, status=500)

class RecordResponseView(ScoringAPIView):
 """Record a question response"""

 @method_decorator(login_required)
 def post(self, request):
 try:
 data = json.loads(request.body)

 # Validate required fields
 required_fields = ['session_id', 'question_id', 'user_answer', 'time_taken']
 for field in required_fields:
 if field not in data:
 return JsonResponse({
 'error': f'Missing required field: {field}'
 }, status=400)

 # Get session
 try:
 session = TestSession.objects.get(id=data['session_id'], user=request.user)
 except TestSession.DoesNotExist:
 return JsonResponse({
 'error': 'Test session not found'
 }, status=404)

 # Create scoring service
 service = ScoringService(session.scoring_config)

 # Record response
 response = service.record_question_response(
 session=session,
 question_id=data['question_id'],
 user_answer=data['user_answer'],
 time_taken=float(data['time_taken'])
 )

 return JsonResponse({
 'success': True,
 'response_id': response.id,
 'question_id': response.question.id,
 'is_correct': response.is_correct,
 'calculated_score': response.calculated_score,
 'score_breakdown': response.score_breakdown
 })

 except Exception as e:
 logger.error(f"Error recording response: {e}")
 return JsonResponse({
 'error': 'Failed to record response',
 'details': str(e)
 }, status=500)

class CompleteTestSessionView(ScoringAPIView):
 """Complete a test session and get results"""

 @method_decorator(login_required)
 def post(self, request):
 try:
 data = json.loads(request.body)

 if 'session_id' not in data:
 return JsonResponse({
 'error': 'Missing required field: session_id'
 }, status=400)

 # Get session
 try:
 session = TestSession.objects.get(id=data['session_id'], user=request.user)
 except TestSession.DoesNotExist:
 return JsonResponse({
 'error': 'Test session not found'
 }, status=404)

 # Create scoring service
 service = ScoringService(session.scoring_config)

 # Complete session and get results
 result = service.complete_test_session(session)
 results_data = service.get_session_results(session)

 return JsonResponse({
 'success': True,
 'results': results_data
 })

 except Exception as e:
 logger.error(f"Error completing test session: {e}")
 return JsonResponse({
 'error': 'Failed to complete test session',
 'details': str(e)
 }, status=500)

class GetTestResultsView(ScoringAPIView):
 """Get test results for a session"""

 @method_decorator(login_required)
 def get(self, request, session_id):
 try:
 # Get session
 try:
 session = TestSession.objects.get(id=session_id, user=request.user)
 except TestSession.DoesNotExist:
 return JsonResponse({
 'error': 'Test session not found'
 }, status=404)

 # Create scoring service
 service = ScoringService(session.scoring_config)

 # Get results
 results_data = service.get_session_results(session)

 return JsonResponse({
 'success': True,
 'results': results_data
 })

 except Exception as e:
 logger.error(f"Error getting test results: {e}")
 return JsonResponse({
 'error': 'Failed to get test results',
 'details': str(e)
 }, status=500)

class GetUserTestHistoryView(ScoringAPIView):
 """Get user's test history"""

 @method_decorator(login_required)
 def get(self, request):
 try:
 # Get optional test_type filter
 test_type = request.GET.get('test_type')

 # Create scoring service
 service = ScoringService()

 # Get test history
 history = service.get_user_test_history(request.user, test_type)

 return JsonResponse({
 'success': True,
 'history': history
 })

 except Exception as e:
 logger.error(f"Error getting test history: {e}")
 return JsonResponse({
 'error': 'Failed to get test history',
 'details': str(e)
 }, status=500)

class CalculateScoreView(ScoringAPIView):
 """Calculate score for a single question (for testing/debugging)"""

 def post(self, request):
 try:
 data = json.loads(request.body)

 # Validate required fields
 required_fields = ['question', 'user_answer', 'time_taken']
 for field in required_fields:
 if field not in data:
 return JsonResponse({
 'error': f'Missing required field: {field}'
 }, status=400)

 # Get optional global config
 global_config = None
 if 'global_config' in data:
 config_data = data['global_config']
 from .scoring_system import GlobalScoringConfig
 global_config = GlobalScoringConfig(
 time_weight=config_data.get('time_weight', 0.3),
 difficulty_weight=config_data.get('difficulty_weight', 0.5),
 accuracy_weight=config_data.get('accuracy_weight', 0.2)
 )

 # Create scoring service
 service = ScoringService()

 # Calculate score
 from .scoring_system import Question as ScoringQuestion
 scoring_question = ScoringQuestion(**data['question'])

 score = service.scoring_system.calculate_score(
 scoring_question,
 data['user_answer'],
 float(data['time_taken'])
 )

 breakdown = service.scoring_system.get_score_breakdown(
 scoring_question,
 data['user_answer'],
 float(data['time_taken'])
 )

 return JsonResponse({
 'success': True,
 'score': score,
 'breakdown': breakdown
 })

 except Exception as e:
 logger.error(f"Error calculating score: {e}")
 return JsonResponse({
 'error': 'Failed to calculate score',
 'details': str(e)
 }, status=500)

class ImportQuestionsView(ScoringAPIView):
 """Import questions from JSON data"""

 @method_decorator(login_required)
 def post(self, request):
 try:
 data = json.loads(request.body)

 # Validate required fields
 if 'questions_data' not in data or 'test_type' not in data:
 return JsonResponse({
 'error': 'Missing required fields: questions_data, test_type'
 }, status=400)

 # Import questions based on test type
 test_type = data['test_type']
 questions_data = data['questions_data']

 if test_type == 'logical':
 questions = TestDataImporter.import_logical_questions(questions_data)
 elif test_type == 'numerical':
 questions = TestDataImporter.import_numerical_questions(questions_data)
 else:
 questions = TestDataImporter.import_questions_from_json(
 {'questions': questions_data}, test_type
 )

 return JsonResponse({
 'success': True,
 'imported_count': len(questions),
 'questions': [q.id for q in questions]
 })

 except Exception as e:
 logger.error(f"Error importing questions: {e}")
 return JsonResponse({
 'error': 'Failed to import questions',
 'details': str(e)
 }, status=500)

class GetScoringConfigsView(ScoringAPIView):
 """Get available scoring configurations"""

 def get(self, request):
 try:
 configs = ScoringConfig.objects.all()

 configs_data = []
 for config in configs:
 configs_data.append({
 'id': config.id,
 'name': config.name,
 'description': config.description,
 'time_weight': float(config.time_weight),
 'difficulty_weight': float(config.difficulty_weight),
 'accuracy_weight': float(config.accuracy_weight),
 'is_default': config.is_default
 })

 return JsonResponse({
 'success': True,
 'configs': configs_data
 })

 except Exception as e:
 logger.error(f"Error getting scoring configs: {e}")
 return JsonResponse({
 'error': 'Failed to get scoring configurations',
 'details': str(e)
 }, status=500)

# Function-based views for simple operations
@require_http_methods(["GET"])
@login_required
def get_question_details(request, question_id):
 """Get details for a specific question"""
 try:
 question = Question.objects.get(id=question_id)

 return JsonResponse({
 'success': True,
 'question': {
 'id': question.id,
 'type': question.question_type,
 'question_text': question.question_text,
 'difficulty': question.difficulty,
 'section': question.section,
 'category': question.category,
 'options': question.get_options_list(),
 'base_score': question.base_score,
 'difficulty_bonus': float(question.difficulty_bonus),
 'time_factor': float(question.time_factor)
 }
 })

 except Question.DoesNotExist:
 return JsonResponse({
 'error': 'Question not found'
 }, status=404)
 except Exception as e:
 logger.error(f"Error getting question details: {e}")
 return JsonResponse({
 'error': 'Failed to get question details',
 'details': str(e)
 }, status=500)

@require_http_methods(["GET"])
@login_required
def get_session_status(request, session_id):
 """Get current status of a test session"""
 try:
 session = TestSession.objects.get(id=session_id, user=request.user)

 # Get response count
 response_count = session.responses.count()

 return JsonResponse({
 'success': True,
 'session': {
 'id': session.id,
 'test_id': session.test_id,
 'test_type': session.test_type,
 'status': session.status,
 'started_at': session.started_at.isoformat(),
 'completed_at': session.completed_at.isoformat() if session.completed_at else None,
 'response_count': response_count,
 'has_results': hasattr(session, 'result')
 }
 })

 except TestSession.DoesNotExist:
 return JsonResponse({
 'error': 'Test session not found'
 }, status=404)
 except Exception as e:
 logger.error(f"Error getting session status: {e}")
 return JsonResponse({
 'error': 'Failed to get session status',
 'details': str(e)
 }, status=500)

