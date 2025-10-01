"""
Django Service Layer for Universal Scoring System

Service classes to handle scoring operations with database integration.
"""

import logging
from typing import Dict, List, Optional, Union, Any
from django.db import transaction
from django.contrib.auth.models import User
from django.utils import timezone
from decimal import Decimal

from .models_scoring import (
 ScoringConfig, Question, TestSession, QuestionResponse, TestResult,
 QuestionType
)
from .scoring_system import (
 UniversalScoringSystem, GlobalScoringConfig, Question as ScoringQuestion,
 ScoreWeight, calculate_score, ScoringPresets
)

logger = logging.getLogger(__name__)

class ScoringService:
 """Service class for handling scoring operations"""

 def __init__(self, scoring_config: Optional[Union[ScoringConfig, str]] = None):
 """
 Initialize scoring service.

 Args:
 scoring_config: ScoringConfig instance or config name
 """
 if isinstance(scoring_config, str):
 try:
 self.scoring_config = ScoringConfig.objects.get(name=scoring_config)
 except ScoringConfig.DoesNotExist:
 logger.warning(f"Scoring config '{scoring_config}' not found, using default")
 self.scoring_config = ScoringConfig.objects.filter(is_default=True).first()
 else:
 self.scoring_config = scoring_config

 # Create global config for scoring system
 if self.scoring_config:
 self.global_config = GlobalScoringConfig(
 time_weight=float(self.scoring_config.time_weight),
 difficulty_weight=float(self.scoring_config.difficulty_weight),
 accuracy_weight=float(self.scoring_config.accuracy_weight)
 )
 else:
 self.global_config = GlobalScoringConfig() # Use defaults

 self.scoring_system = UniversalScoringSystem(self.global_config)

 def create_question(self,
 question_id: str,
 question_type: str,
 question_text: str,
 correct_answer: str,
 difficulty: int = 1,
 section: int = 1,
 options: Optional[List[str]] = None,
 category: Optional[str] = None,
 **kwargs) -> Question:
 """
 Create a new question in the database.

 Args:
 question_id: Unique question identifier
 question_type: Type of question
 question_text: Question text
 correct_answer: Correct answer
 difficulty: Difficulty level (1-5)
 section: Section number
 options: Answer options (for multiple choice)
 category: Question category
 **kwargs: Additional fields

 Returns:
 Created Question instance
 """
 question_data = {
 'id': question_id,
 'question_type': question_type,
 'question_text': question_text,
 'correct_answer': correct_answer,
 'difficulty': difficulty,
 'section': section,
 'options': options or [],
 'category': category or '',
 'metadata': kwargs.get('metadata', {})
 }

 # Add custom scoring weights if provided
 if 'base_score' in kwargs:
 question_data['base_score'] = kwargs['base_score']
 if 'difficulty_bonus' in kwargs:
 question_data['difficulty_bonus'] = kwargs['difficulty_bonus']
 if 'time_factor' in kwargs:
 question_data['time_factor'] = kwargs['time_factor']

 question = Question.objects.create(**question_data)
 logger.info(f"Created question: {question_id}")
 return question

 def start_test_session(self,
 user: User,
 test_id: str,
 test_type: str,
 scoring_config_name: Optional[str] = None) -> TestSession:
 """
 Start a new test session.

 Args:
 user: User taking the test
 test_id: Test identifier
 test_type: Type of test
 scoring_config_name: Optional scoring configuration name

 Returns:
 Created TestSession instance
 """
 scoring_config = None
 if scoring_config_name:
 try:
 scoring_config = ScoringConfig.objects.get(name=scoring_config_name)
 except ScoringConfig.DoesNotExist:
 logger.warning(f"Scoring config '{scoring_config_name}' not found")

 session = TestSession.objects.create(
 user=user,
 test_id=test_id,
 test_type=test_type,
 started_at=timezone.now(),
 scoring_config=scoring_config
 )

 logger.info(f"Started test session for user {user.username}: {test_id}")
 return session

 def record_question_response(self,
 session: TestSession,
 question_id: str,
 user_answer: Union[str, int, float],
 time_taken: float) -> QuestionResponse:
 """
 Record a user's response to a question.

 Args:
 session: Test session
 question_id: Question identifier
 user_answer: User's answer
 time_taken: Time taken in seconds

 Returns:
 Created QuestionResponse instance
 """
 try:
 question = Question.objects.get(id=question_id)
 except Question.DoesNotExist:
 raise ValueError(f"Question {question_id} not found")

 # Calculate score
 question_dict = question.to_scoring_dict()
 scoring_question = ScoringQuestion(**question_dict)

 calculated_score = self.scoring_system.calculate_score(
 scoring_question,
 user_answer,
 time_taken
 )

 score_breakdown = self.scoring_system.get_score_breakdown(
 scoring_question,
 user_answer,
 time_taken
 )

 is_correct = score_breakdown.get('correct', False)

 response = QuestionResponse.objects.create(
 session=session,
 question=question,
 user_answer=str(user_answer),
 time_taken=Decimal(str(time_taken)),
 is_correct=is_correct,
 calculated_score=calculated_score,
 score_breakdown=score_breakdown
 )

 logger.info(f"Recorded response for {question_id}: {calculated_score} points")
 return response

 def complete_test_session(self, session: TestSession) -> TestResult:
 """
 Complete a test session and calculate final results.

 Args:
 session: Test session to complete

 Returns:
 Created TestResult instance
 """
 with transaction.atomic():
 # Update session
 session.status = 'completed'
 session.completed_at = timezone.now()
 session.save()

 # Create test result
 result = TestResult.objects.create(session=session)
 result.calculate_from_responses()

 logger.info(f"Completed test session for {session.user.username}: {result.percentage}%")
 return result

 def get_session_results(self, session: TestSession) -> Dict[str, Any]:
 """
 Get comprehensive results for a test session.

 Args:
 session: Test session

 Returns:
 Dictionary with detailed results
 """
 try:
 result = session.result
 except TestResult.DoesNotExist:
 # Calculate results if not already done
 result = self.complete_test_session(session)

 responses = session.responses.all()

 return {
 'session_id': session.id,
 'user': session.user.username,
 'test_id': session.test_id,
 'test_type': session.test_type,
 'status': session.status,
 'started_at': session.started_at,
 'completed_at': session.completed_at,
 'duration_seconds': session.duration_seconds,

 # Overall scores
 'total_score': result.total_score,
 'max_possible_score': result.max_possible_score,
 'percentage': float(result.percentage),
 'grade': result.grade,
 'performance_level': result.performance_level,

 # Question statistics
 'total_questions': result.total_questions,
 'answered_questions': result.answered_questions,
 'correct_answers': result.correct_answers,
 'completion_rate': (result.answered_questions / result.total_questions * 100) if result.total_questions > 0 else 0,

 # Timing statistics
 'total_time_seconds': result.total_time_seconds,
 'average_time_per_question': float(result.average_time_per_question),

 # Difficulty breakdown
 'difficulty_breakdown': result.difficulty_breakdown,

 # Recommendations
 'recommendations': result.recommendations,

 # Detailed responses
 'responses': [
 {
 'question_id': response.question.id,
 'question_text': response.question.question_text,
 'question_type': response.question.question_type,
 'difficulty': response.question.difficulty,
 'user_answer': response.user_answer,
 'correct_answer': response.question.correct_answer,
 'is_correct': response.is_correct,
 'time_taken': float(response.time_taken),
 'calculated_score': response.calculated_score,
 'score_breakdown': response.score_breakdown
 }
 for response in responses
 ]
 }

 def get_user_test_history(self, user: User, test_type: Optional[str] = None) -> List[Dict[str, Any]]:
 """
 Get user's test history.

 Args:
 user: User
 test_type: Optional filter by test type

 Returns:
 List of test session results
 """
 sessions = TestSession.objects.filter(user=user)
 if test_type:
 sessions = sessions.filter(test_type=test_type)

 results = []
 for session in sessions:
 try:
 result = session.result
 results.append({
 'session_id': session.id,
 'test_id': session.test_id,
 'test_type': session.test_type,
 'completed_at': session.completed_at,
 'percentage': float(result.percentage),
 'grade': result.grade,
 'performance_level': result.performance_level,
 'total_questions': result.total_questions,
 'correct_answers': result.correct_answers
 })
 except TestResult.DoesNotExist:
 # Skip sessions without results
 continue

 return results

 def bulk_create_questions(self, questions_data: List[Dict[str, Any]]) -> List[Question]:
 """
 Bulk create questions from data.

 Args:
 questions_data: List of question dictionaries

 Returns:
 List of created Question instances
 """
 questions = []
 for data in questions_data:
 question = self.create_question(**data)
 questions.append(question)

 logger.info(f"Bulk created {len(questions)} questions")
 return questions

class TestDataImporter:
 """Utility class for importing test data from various formats"""

 @staticmethod
 def import_logical_questions(questions_data: List[Dict[str, Any]]) -> List[Question]:
 """
 Import logical reasoning questions.

 Args:
 questions_data: List of logical question dictionaries

 Returns:
 List of created Question instances
 """
 service = ScoringService()
 questions = []

 for data in questions_data:
 question_data = {
 'question_id': data['id'],
 'question_type': 'logical',
 'question_text': data['question'],
 'correct_answer': data['correct_answer'],
 'difficulty': data.get('difficulty', 1),
 'section': data.get('section', 1),
 'options': data.get('options', []),
 'category': 'logical_reasoning',
 'base_score': data.get('scoreWeight', {}).get('base', 5),
 'difficulty_bonus': data.get('scoreWeight', {}).get('difficultyBonus', 2.0),
 'time_factor': data.get('scoreWeight', {}).get('timeFactor', 1.0)
 }

 question = service.create_question(**question_data)
 questions.append(question)

 return questions

 @staticmethod
 def import_numerical_questions(questions_data: List[Dict[str, Any]]) -> List[Question]:
 """
 Import numerical reasoning questions.

 Args:
 questions_data: List of numerical question dictionaries

 Returns:
 List of created Question instances
 """
 service = ScoringService()
 questions = []

 for data in questions_data:
 # Extract options text from numerical format
 options = []
 if 'options' in data:
 options = [opt['text'] if isinstance(opt, dict) else str(opt) for opt in data['options']]

 question_data = {
 'question_id': f"numerical_{data['question_id']}",
 'question_type': 'numerical',
 'question_text': data['question'],
 'correct_answer': data['correct_answer'],
 'difficulty': data.get('complexity_score', data.get('difficulty', 1)),
 'section': 1,
 'options': options,
 'category': data.get('category', 'numerical_reasoning'),
 'base_score': 5,
 'difficulty_bonus': 2.0,
 'time_factor': 1.0
 }

 question = service.create_question(**question_data)
 questions.append(question)

 return questions

 @staticmethod
 def import_questions_from_json(json_data: Dict[str, Any], test_type: str) -> List[Question]:
 """
 Import questions from JSON data.

 Args:
 json_data: JSON data containing questions
 test_type: Type of test

 Returns:
 List of created Question instances
 """
 service = ScoringService()
 questions = []

 # Extract questions from various JSON structures
 questions_data = []
 if 'sections' in json_data:
 for section in json_data['sections']:
 if 'questions' in section:
 questions_data.extend(section['questions'])
 elif 'questions' in json_data:
 questions_data = json_data['questions']

 for data in questions_data:
 question_data = {
 'question_id': data.get('id', f"{test_type}_{len(questions) + 1}"),
 'question_type': test_type,
 'question_text': data.get('question', data.get('question_text', '')),
 'correct_answer': data.get('correct_answer', data.get('correctAnswer', '')),
 'difficulty': data.get('difficulty', data.get('complexity_score', 1)),
 'section': data.get('section', 1),
 'options': data.get('options', []),
 'category': data.get('category', test_type),
 'metadata': {k: v for k, v in data.items() if k not in [
 'id', 'question', 'question_text', 'correct_answer', 'correctAnswer',
 'difficulty', 'complexity_score', 'section', 'options', 'category'
 ]}
 }

 question = service.create_question(**question_data)
 questions.append(question)

 return questions

# Convenience functions for easy integration
def create_scoring_service(config_name: Optional[str] = None) -> ScoringService:
 """
 Create a scoring service instance.

 Args:
 config_name: Optional scoring configuration name

 Returns:
 ScoringService instance
 """
 return ScoringService(config_name)

def record_test_response(session_id: int,
 question_id: str,
 user_answer: Union[str, int, float],
 time_taken: float) -> QuestionResponse:
 """
 Convenience function to record a test response.

 Args:
 session_id: Test session ID
 question_id: Question ID
 user_answer: User's answer
 time_taken: Time taken in seconds

 Returns:
 QuestionResponse instance
 """
 try:
 session = TestSession.objects.get(id=session_id)
 except TestSession.DoesNotExist:
 raise ValueError(f"Test session {session_id} not found")

 service = ScoringService(session.scoring_config)
 return service.record_question_response(session, question_id, user_answer, time_taken)

def get_test_results(session_id: int) -> Dict[str, Any]:
 """
 Get test results for a session.

 Args:
 session_id: Test session ID

 Returns:
 Test results dictionary
 """
 try:
 session = TestSession.objects.get(id=session_id)
 except TestSession.DoesNotExist:
 raise ValueError(f"Test session {session_id} not found")

 service = ScoringService(session.scoring_config)
 return service.get_session_results(session)

