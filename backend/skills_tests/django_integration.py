"""
Django Integration for Skills Tests
Provides Django views and models for the skills assessment system
"""

import json
import os
from datetime import datetime
from typing import Dict, List, Any

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.utils.decorators import method_decorator
from django.views import View
from django.core.exceptions import ValidationError
from django.conf import settings

# Import our skills test modules
from . import SkillsTestEngine, Question, TestResult
from .test_utils import TestSession, TestAnalytics, export_test_results

# Global test sessions storage (in production, use Redis or database)
TEST_SESSIONS = {}

class SkillsTestView(View):
    """Base view for skills test endpoints"""
    
    def dispatch(self, request, *args, **kwargs):
        """Add CORS headers and JSON content type validation"""
        response = super().dispatch(request, *args, **kwargs)
        
        # Add CORS headers
        response['Access-Control-Allow-Origin'] = '*'
        response['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
        response['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
        
        return response
    
    def options(self, request, *args, **kwargs):
        """Handle preflight OPTIONS requests"""
        response = JsonResponse({})
        return response


@method_decorator(csrf_exempt, name='dispatch')
class StartTestView(SkillsTestView):
    """Start a new test session"""
    
    def post(self, request):
        try:
            data = json.loads(request.body)
            test_type = data.get('test_type')
            user_id = data.get('user_id', 'anonymous')
            num_questions = data.get('num_questions')
            
            # Validate test type
            if test_type not in ['numerical_reasoning', 'abstract_reasoning']:
                return JsonResponse({
                    'error': 'Invalid test type. Must be numerical_reasoning or abstract_reasoning'
                }, status=400)
            
            # Create new test session
            session = TestSession(test_type, user_id)
            start_info = session.start_test(num_questions)
            
            # Store session (in production, use proper session storage)
            TEST_SESSIONS[session.session_id] = session
            
            return JsonResponse({
                'success': True,
                'session_id': session.session_id,
                'test_info': start_info,
                'message': f'{test_type.replace("_", " ").title()} test started successfully'
            })
            
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON data'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)


@method_decorator(csrf_exempt, name='dispatch')
class SubmitAnswerView(SkillsTestView):
    """Submit an answer for the current question"""
    
    def post(self, request):
        try:
            data = json.loads(request.body)
            session_id = data.get('session_id')
            answer = data.get('answer')
            time_taken = data.get('time_taken', 0)
            is_timeout = data.get('is_timeout', False)
            
            # Validate required fields
            if not session_id or not answer:
                return JsonResponse({
                    'error': 'session_id and answer are required'
                }, status=400)
            
            # Get session
            session = TEST_SESSIONS.get(session_id)
            if not session:
                return JsonResponse({
                    'error': 'Invalid session_id or session expired'
                }, status=404)
            
            # If it's a timeout with no selected answer, handle specially
            if is_timeout and answer == 'timeout':
                # Log the timeout event
                print(f"Question timed out for session {session_id}, current question: {session.current_question_index + 1}")
                # For timeout, we use the answer that was actually submitted, which might be 'timeout'
                # The TestSession class will handle recording this as an incorrect answer
            
            # Submit answer
            result = session.submit_answer(answer, time_taken)
            
            return JsonResponse({
                'success': True,
                'result': result
            })
            
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON data'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)


class GetQuestionView(SkillsTestView):
    """Get the current question for a test session"""
    
    def get(self, request, session_id):
        try:
            session = TEST_SESSIONS.get(session_id)
            if not session:
                return JsonResponse({
                    'error': 'Invalid session_id or session expired'
                }, status=404)
            
            current_question = session.get_current_question()
            if not current_question:
                return JsonResponse({
                    'error': 'No current question available'
                }, status=404)
            
            return JsonResponse({
                'success': True,
                'question': current_question,
                'progress': {
                    'current': session.current_question_index + 1,
                    'total': len(session.questions)
                }
            })
            
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)


class GetTestResultsView(SkillsTestView):
    """Get detailed test results for a completed session"""
    
    def get(self, request, session_id):
        try:
            session = TEST_SESSIONS.get(session_id)
            if not session:
                return JsonResponse({
                    'error': 'Invalid session_id or session expired'
                }, status=404)
            
            if not session.is_completed:
                return JsonResponse({
                    'error': 'Test is not completed yet'
                }, status=400)
            
            # Get test results
            test_result = session.calculate_final_score()
            
            # Generate analytics
            category_performance = TestAnalytics.analyze_performance_by_category(
                test_result, session.questions
            )
            difficulty_performance = TestAnalytics.analyze_difficulty_performance(
                test_result, session.questions
            )
            recommendations = TestAnalytics.generate_recommendations(
                test_result, session.questions
            )
            
            # Prepare detailed response
            response_data = {
                'success': True,
                'session_info': session.get_session_summary(),
                'results': {
                    'raw_score': test_result.raw_score,
                    'total_questions': test_result.total_questions,
                    'percentage': test_result.percentage,
                    'time_taken': test_result.time_taken,
                    'time_bonus': test_result.time_bonus,
                    'final_score': test_result.final_score,
                    'percentile': test_result.percentile
                },
                'analytics': {
                    'category_performance': category_performance,
                    'difficulty_performance': difficulty_performance,
                    'recommendations': recommendations
                },
                'detailed_responses': []
            }
            
            # Add detailed question responses
            for i, question in enumerate(session.questions):
                if i < len(test_result.user_answers):
                    response_data['detailed_responses'].append({
                        'question_id': question.question_id,
                        'category': question.category,
                        'difficulty': question.difficulty,
                        'user_answer': test_result.user_answers[i],
                        'correct_answer': test_result.correct_answers[i],
                        'is_correct': test_result.user_answers[i] == test_result.correct_answers[i],
                        'time_taken': test_result.question_times[i] if test_result.question_times else 0,
                        'explanation': question.explanation
                    })
            
            return JsonResponse(response_data)
            
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)


class ListAvailableTestsView(SkillsTestView):
    """List all available test types and their configurations"""
    
    def get(self, request):
        try:
            engine = SkillsTestEngine()
            
            available_tests = {}
            for test_type in ['numerical_reasoning', 'abstract_reasoning']:
                test_info = engine.get_test_info(test_type)
                questions = engine.load_questions(test_type)
                
                # Count questions by category and difficulty
                categories = {}
                difficulties = {'easy': 0, 'medium': 0, 'hard': 0}
                
                for question in questions:
                    # Count by category
                    cat = question.category
                    categories[cat] = categories.get(cat, 0) + 1
                    
                    # Count by difficulty
                    if question.difficulty in difficulties:
                        difficulties[question.difficulty] += 1
                
                available_tests[test_type] = {
                    'name': test_type.replace('_', ' ').title(),
                    'configuration': test_info,
                    'total_questions_available': len(questions),
                    'categories': categories,
                    'difficulty_breakdown': difficulties
                }
            
            return JsonResponse({
                'success': True,
                'available_tests': available_tests
            })
            
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)


@method_decorator(csrf_exempt, name='dispatch')
class ExportResultsView(SkillsTestView):
    """Export test results to file"""
    
    def post(self, request):
        try:
            data = json.loads(request.body)
            session_id = data.get('session_id')
            
            session = TEST_SESSIONS.get(session_id)
            if not session:
                return JsonResponse({
                    'error': 'Invalid session_id or session expired'
                }, status=404)
            
            if not session.is_completed:
                return JsonResponse({
                    'error': 'Test is not completed yet'
                }, status=400)
            
            # Export results
            test_result = session.calculate_final_score()
            session_info = session.get_session_summary()
            
            # Create exports directory if it doesn't exist
            exports_dir = os.path.join(settings.MEDIA_ROOT, 'test_exports')
            os.makedirs(exports_dir, exist_ok=True)
            
            # Generate filename
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"test_results_{session_id}_{timestamp}.json"
            filepath = os.path.join(exports_dir, filename)
            
            # Export the results
            export_path = export_test_results(test_result, session.questions, session_info, filepath)
            
            # Generate download URL
            download_url = f"/media/test_exports/{filename}"
            
            return JsonResponse({
                'success': True,
                'export_path': export_path,
                'download_url': download_url,
                'filename': filename
            })
            
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON data'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)


# URL patterns for Django urls.py
"""
Add these URL patterns to your Django urls.py:

from django.urls import path
from skills_tests.django_integration import (
    StartTestView, SubmitAnswerView, GetQuestionView, 
    GetTestResultsView, ListAvailableTestsView, ExportResultsView
)

urlpatterns = [
    path('api/skills-tests/start/', StartTestView.as_view(), name='start_test'),
    path('api/skills-tests/submit-answer/', SubmitAnswerView.as_view(), name='submit_answer'),
    path('api/skills-tests/question/<str:session_id>/', GetQuestionView.as_view(), name='get_question'),
    path('api/skills-tests/results/<str:session_id>/', GetTestResultsView.as_view(), name='get_results'),
    path('api/skills-tests/available/', ListAvailableTestsView.as_view(), name='list_tests'),
    path('api/skills-tests/export/', ExportResultsView.as_view(), name='export_results'),
]
"""

# Example usage in frontend JavaScript:
"""
// Start a test
const startTest = async (testType, userId) => {
    const response = await fetch('/api/skills-tests/start/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            test_type: testType,
            user_id: userId,
            num_questions: 25  // optional
        })
    });
    return await response.json();
};

// Submit an answer
const submitAnswer = async (sessionId, answer, timeTaken) => {
    const response = await fetch('/api/skills-tests/submit-answer/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            session_id: sessionId,
            answer: answer,
            time_taken: timeTaken
        })
    });
    return await response.json();
};

// Get test results
const getResults = async (sessionId) => {
    const response = await fetch(`/api/skills-tests/results/${sessionId}/`);
    return await response.json();
};
"""
