"""
Universal Scoring System Examples

Comprehensive examples showing how to use the universal scoring system
for all test types (logical, numerical, verbal, abstract, etc.).
"""

import json
from decimal import Decimal
from django.contrib.auth.models import User
from django.utils import timezone

from .models_scoring import ScoringConfig, Question, TestSession
from .scoring_system import (
 UniversalScoringSystem, GlobalScoringConfig, Question as ScoringQuestion,
 ScoreWeight, ScoringPresets, QuestionType
)
from .scoring_service import ScoringService, TestDataImporter

def example_basic_scoring():
 """Example 1: Basic score calculation for different question types"""
 print(" Example 1: Basic Score Calculation\n")

 # Create scoring system with default configuration
 scoring_system = UniversalScoringSystem()

 # Example questions for different types
 questions = [
 # Multiple Choice Question
 ScoringQuestion(
 id="mc_1",
 type=QuestionType.MULTIPLE_CHOICE,
 question="What is 2 + 2?",
 options=["3", "4", "5", "6"],
 correct_answer="4",
 difficulty=1,
 score_weight=ScoreWeight(base=5, difficulty_bonus=2.0, time_factor=1.0)
 ),

 # Numerical Question
 ScoringQuestion(
 id="num_1",
 type=QuestionType.NUMERICAL,
 question="If a car travels 60 mph for 2.5 hours, how far does it go?",
 correct_answer="150",
 difficulty=2,
 score_weight=ScoreWeight(base=5, difficulty_bonus=2.0, time_factor=1.0)
 ),

 # Verbal Question
 ScoringQuestion(
 id="verbal_1",
 type=QuestionType.VERBAL,
 question="Choose the word that best completes the analogy: Book is to Library as Car is to ___",
 options=["Garage", "Road", "Driver", "Engine"],
 correct_answer="a",
 difficulty=2,
 score_weight=ScoreWeight(base=5, difficulty_bonus=2.0, time_factor=1.0)
 ),

 # Abstract Question
 ScoringQuestion(
 id="abstract_1",
 type=QuestionType.ABSTRACT,
 question="Which figure completes the pattern? [Pattern description]",
 options=["Option A", "Option B", "Option C", "Option D"],
 correct_answer="c",
 difficulty=3,
 score_weight=ScoreWeight(base=5, difficulty_bonus=2.0, time_factor=1.0)
 )
 ]

 # Test scenarios
 scenarios = [
 {"answer": "4", "time": 15, "description": "Correct, fast"},
 {"answer": "4", "time": 60, "description": "Correct, slow"},
 {"answer": "5", "time": 10, "description": "Wrong, fast"},
 {"answer": "150", "time": 45, "description": "Correct numerical"},
 {"answer": "a", "time": 30, "description": "Correct verbal"},
 {"answer": "c", "time": 90, "description": "Correct abstract, slow"}
 ]

 for i, question in enumerate(questions):
 print(f"Question {i+1} ({question.type.value}): {question.question}")

 for scenario in scenarios:
 score = scoring_system.calculate_score(
 question,
 scenario["answer"],
 scenario["time"]
 )
 print(f" {scenario['description']}: {score} points")
 print()

def example_scoring_configurations():
 """Example 2: Different scoring configurations"""
 print("️ Example 2: Scoring Configuration Comparison\n")

 question = ScoringQuestion(
 id="config_test",
 type=QuestionType.NUMERICAL,
 question="Calculate 15% of 240",
 correct_answer="36",
 difficulty=2,
 score_weight=ScoreWeight(base=5, difficulty_bonus=2.0, time_factor=1.0)
 )

 user_answer = "36"
 time_taken = 30.0

 # Test different configurations
 configs = [
 ("Standard", ScoringPresets.get_standard_config()),
 ("Speed Focused", ScoringPresets.get_speed_focused_config()),
 ("Accuracy Focused", ScoringPresets.get_accuracy_focused_config()),
 ("Difficulty Focused", ScoringPresets.get_difficulty_focused_config()),
 ("Numerical Optimized", ScoringPresets.get_numerical_config()),
 ("Verbal Optimized", ScoringPresets.get_verbal_config())
 ]

 print(f"Question: {question.question}")
 print(f"Answer: {user_answer}, Time: {time_taken}s, Difficulty: {question.difficulty}\n")

 for config_name, config in configs:
 scoring_system = UniversalScoringSystem(config)
 score = scoring_system.calculate_score(question, user_answer, time_taken)

 print(f"{config_name}: {score} points")
 print(f" Config: Time={config.time_weight}, Difficulty={config.difficulty_weight}, Accuracy={config.accuracy_weight}")
 print()

def example_detailed_breakdown():
 """Example 3: Detailed score breakdown"""
 print(" Example 3: Detailed Score Breakdown\n")

 question = ScoringQuestion(
 id="breakdown_test",
 type=QuestionType.LOGICAL,
 question="Look at this series: 2, 4, 6, 8, 10, ... What number should come next?",
 options=["11", "12", "13", "14"],
 correct_answer="b",
 difficulty=2,
 score_weight=ScoreWeight(base=5, difficulty_bonus=2.0, time_factor=1.0)
 )

 user_answer = "b"
 time_taken = 25.0

 scoring_system = UniversalScoringSystem()
 breakdown = scoring_system.get_score_breakdown(question, user_answer, time_taken)

 print(f"Question: {question.question}")
 print(f"Answer: {user_answer}, Time: {time_taken}s\n")

 print("Score Breakdown:")
 print(f" Correct: {breakdown['correct']}")
 print(f" Final Score: {breakdown['final_score']}")

 bd = breakdown['breakdown']
 print(f" Base Score: {bd['base_score']}")
 print(f" Difficulty Bonus: {bd['difficulty_bonus']}")
 print(f" Time Bonus: {bd['time_bonus']}")
 print(f" Time Efficiency: {bd['time_efficiency']}")
 print(f" Preliminary Score: {bd['preliminary_score']}")
 print(f" Accuracy Multiplier: {bd['accuracy_multiplier']}")
 print(f" Final Score: {bd['final_score']}")
 print()

def example_database_integration():
 """Example 4: Database integration with Django models"""
 print("️ Example 4: Database Integration\n")

 # This example would typically be run in Django shell or management command

 # Create scoring configuration
 config, created = ScoringConfig.objects.get_or_create(
 name="example_config",
 defaults={
 'time_weight': Decimal('0.3'),
 'difficulty_weight': Decimal('0.5'),
 'accuracy_weight': Decimal('0.2'),
 'description': 'Example configuration for testing'
 }
 )

 # Create questions
 questions_data = [
 {
 'question_id': 'demo_mc_1',
 'question_type': 'multiple_choice',
 'question_text': 'What is 3 + 3?',
 'correct_answer': '6',
 'difficulty': 1,
 'options': ['5', '6', '7', '8'],
 'category': 'basic_math'
 },
 {
 'question_id': 'demo_num_1',
 'question_type': 'numerical',
 'question_text': 'If 20% of x is 40, what is x?',
 'correct_answer': '200',
 'difficulty': 3,
 'category': 'percentage_calculation'
 }
 ]

 # Create scoring service
 service = ScoringService('example_config')

 # Create questions
 questions = []
 for data in questions_data:
 question = service.create_question(**data)
 questions.append(question)

 print(f"Created {len(questions)} questions")

 # Example of how to use in a real test session
 print("\nExample test session flow:")
 print("1. Start test session")
 print("2. Record question responses")
 print("3. Complete session and get results")
 print("4. View detailed results")
 print()

def example_api_usage():
 """Example 5: API usage patterns"""
 print(" Example 5: API Usage Patterns\n")

 # Example API requests (would be sent from frontend)

 # Start test session
 start_session_data = {
 "test_id": "logical_reasoning_v1",
 "test_type": "logical",
 "scoring_config": "standard"
 }

 print("1. Start Test Session:")
 print(f"POST /scoring/start-session/")
 print(f"Body: {json.dumps(start_session_data, indent=2)}")
 print()

 # Record response
 record_response_data = {
 "session_id": 123,
 "question_id": "logical_1_1",
 "user_answer": "b",
 "time_taken": 25.5
 }

 print("2. Record Question Response:")
 print(f"POST /scoring/record-response/")
 print(f"Body: {json.dumps(record_response_data, indent=2)}")
 print()

 # Complete session
 complete_session_data = {
 "session_id": 123
 }

 print("3. Complete Test Session:")
 print(f"POST /scoring/complete-session/")
 print(f"Body: {json.dumps(complete_session_data, indent=2)}")
 print()

 # Get results
 print("4. Get Test Results:")
 print(f"GET /scoring/results/123/")
 print()

def example_question_import():
 """Example 6: Importing questions from various formats"""
 print(" Example 6: Question Import Examples\n")

 # Logical questions format (from frontend)
 logical_questions = [
 {
 "id": "logical_1_1",
 "question": "Look at this series: 2, 4, 6, 8, 10, ... What number should come next?",
 "options": ["11", "12", "13", "14"],
 "correct_answer": "b",
 "difficulty": 1,
 "section": 1,
 "scoreWeight": {
 "base": 5,
 "difficultyBonus": 2,
 "timeFactor": 1
 }
 }
 ]

 # Numerical questions format (from frontend)
 numerical_questions = [
 {
 "question_id": 1,
 "category": "Basic Arithmetic",
 "complexity_score": 2,
 "question": "If a car travels at a speed of 60 miles per hour, how far will it travel in 2.5 hours?",
 "options": [
 {"option_id": "A", "text": "120 miles"},
 {"option_id": "B", "text": "150 miles"},
 {"option_id": "C", "text": "180 miles"},
 {"option_id": "D", "text": "200 miles"}
 ],
 "correct_answer": "B"
 }
 ]

 print("Logical Questions Import:")
 print(f"Questions: {json.dumps(logical_questions, indent=2)}")
 print()

 print("Numerical Questions Import:")
 print(f"Questions: {json.dumps(numerical_questions, indent=2)}")
 print()

 print("Import API Usage:")
 import_data = {
 "questions_data": logical_questions,
 "test_type": "logical"
 }

 print(f"POST /scoring/import-questions/")
 print(f"Body: {json.dumps(import_data, indent=2)}")
 print()

def example_complete_workflow():
 """Example 7: Complete test workflow"""
 print(" Example 7: Complete Test Workflow\n")

 # This would typically be implemented in a Django view or service

 workflow_steps = [
 "1. User starts test → POST /scoring/start-session/",
 "2. System loads questions for test type",
 "3. User answers questions → POST /scoring/record-response/ (for each question)",
 "4. System tracks timing and scores in real-time",
 "5. User completes test → POST /scoring/complete-session/",
 "6. System calculates final results and generates recommendations",
 "7. Results displayed to user → GET /scoring/results/{session_id}/",
 "8. Results stored in user's test history"
 ]

 for step in workflow_steps:
 print(step)

 print("\nKey Features:")
 print(" Universal scoring for all test types")
 print(" Real-time score calculation")
 print(" Detailed performance analytics")
 print(" Difficulty-based scoring")
 print(" Time efficiency tracking")
 print(" Comprehensive recommendations")
 print(" Database persistence")
 print(" API integration ready")
 print()

def run_all_examples():
 """Run all examples"""
 print(" Universal Scoring System - Complete Examples\n")
 print("=" * 60)

 example_basic_scoring()
 example_scoring_configurations()
 example_detailed_breakdown()
 example_database_integration()
 example_api_usage()
 example_question_import()
 example_complete_workflow()

 print(" All examples completed!")
 print("\nThe universal scoring system is ready for production use!")

if __name__ == "__main__":
 run_all_examples()

