"""
Skills Tests Module for JobGate Career Quest
Handles Numerical and Abstract Reasoning Tests

Author: Skills Assessment Team
Date: August 27, 2025
"""

import json
import os
import time
from typing import List, Dict, Any, Optional, Tuple
from dataclasses import dataclass
from datetime import datetime, timedelta
import random
import math

@dataclass
class TestResult:
    """Data class for test results"""
    raw_score: int
    total_questions: int
    percentage: float
    time_taken: int  # in seconds
    time_bonus: int = 0
    final_score: int = 0
    percentile: int = 50  # placeholder
    correct_answers: List[str] = None
    user_answers: List[str] = None
    question_times: List[int] = None

@dataclass
class Question:
    """Data class for test questions"""
    question_id: str
    test_type: str
    difficulty: str
    category: str
    question_content: Dict[str, Any]
    options: List[Dict[str, Any]]
    correct_answer: str
    explanation: str
    time_limit: int
    points: int
    metadata: Dict[str, Any] = None

class SkillsTestEngine:
    """Main engine for handling skills tests"""
    
    def __init__(self, data_path: str = None):
        """Initialize the test engine with data path"""
        if data_path is None:
            # Get the directory of this file and construct data path
            current_dir = os.path.dirname(os.path.abspath(__file__))
            self.data_path = os.path.join(current_dir, 'data')
        else:
            self.data_path = data_path
            
        self.questions_cache = {}
        self.test_configs = {}
        self._load_test_configurations()
    
    def _load_test_configurations(self):
        """Load test configurations from schema files"""
        schema_path = os.path.join(os.path.dirname(self.data_path), 'schemas')
        
        # Load numerical test config
        numerical_config_path = os.path.join(schema_path, 'numerical_test_config.json')
        if os.path.exists(numerical_config_path):
            with open(numerical_config_path, 'r', encoding='utf-8') as f:
                self.test_configs['numerical_reasoning'] = json.load(f)
        
        # Load abstract test config
        abstract_config_path = os.path.join(schema_path, 'abstract_test_config.json')
        if os.path.exists(abstract_config_path):
            with open(abstract_config_path, 'r', encoding='utf-8') as f:
                self.test_configs['abstract_reasoning'] = json.load(f)
    
    def load_questions(self, test_category: str) -> List[Question]:
        """
        Load questions for a specific test category
        
        Args:
            test_category: 'numerical_reasoning' or 'abstract_reasoning'
            
        Returns:
            List of Question objects
        """
        if test_category in self.questions_cache:
            return self.questions_cache[test_category]
        
        filename_map = {
            'numerical_reasoning': 'numerical_reasoning_questions.json',
            'abstract_reasoning': 'abstract_reasoning_questions.json'
        }
        
        if test_category not in filename_map:
            raise ValueError(f"Unknown test category: {test_category}")
        
        # Try to load from SQLite DB first (for both abstract and numerical)
        try:
            from .sqlite_loader import SkillsTestDBLoader
            loader = SkillsTestDBLoader()
            print(f"Attempting to load {test_category} questions from SQLite database")
            questions = loader.load_questions(test_category)
            print(f"Successfully loaded {len(questions)} {test_category} questions from SQLite")
            self.questions_cache[test_category] = questions
            return questions
        except Exception as e:
            print(f"Error loading {test_category} from SQLite, falling back to JSON: {e}")
            # Fall back to JSON loading if SQLite fails
        
        # Default loading from JSON
        file_path = os.path.join(self.data_path, filename_map[test_category])
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                questions_data = json.load(f)
            
            questions = []
            for q_data in questions_data:
                question = Question(**q_data)
                questions.append(question)
            
            self.questions_cache[test_category] = questions
            return questions
            
        except FileNotFoundError:
            raise FileNotFoundError(f"Questions file not found: {file_path}")
        except json.JSONDecodeError as e:
            raise ValueError(f"Invalid JSON in questions file: {e}")
    
    def present_question(self, question: Question) -> Dict[str, Any]:
        """
        Format a question for presentation to the user
        
        Args:
            question: Question object
            
        Returns:
            Dictionary with formatted question data
        """
        return {
            'question_id': question.question_id,
            'difficulty': question.difficulty,
            'category': question.category,
            'content': question.question_content,
            'options': question.options,
            'time_limit': question.time_limit,
            'points': question.points
        }
    
    def validate_answer(self, user_answer: str, question: Question) -> Tuple[bool, str]:
        """
        Validate a user's answer against the correct answer
        
        Args:
            user_answer: User's selected option (A, B, C, D, E)
            question: Question object
            
        Returns:
            Tuple of (is_correct: bool, explanation: str)
        """
        is_correct = user_answer.upper() == question.correct_answer.upper()
        return is_correct, question.explanation
    
    def calculate_numerical_score(self, responses: List[Dict[str, Any]], 
                                questions: List[Question],
                                total_time_taken: int) -> TestResult:
        """
        Calculate score for numerical reasoning test with time bonus
        
        Args:
            responses: List of user responses with question_id, answer, time_taken
            questions: List of Question objects
            total_time_taken: Total time taken in seconds
            
        Returns:
            TestResult object
        """
        config = self.test_configs.get('numerical_reasoning', {})
        scoring_config = config.get('scoring', {})
        
        # Create lookup for questions
        question_map = {q.question_id: q for q in questions}
        
        raw_score = 0
        correct_answers = []
        user_answers = []
        question_times = []
        points_earned = 0
        
        for response in responses:
            question_id = response['question_id']
            user_answer = response['answer']
            time_taken = response.get('time_taken', 0)
            
            question = question_map.get(question_id)
            if not question:
                continue
                
            is_correct, _ = self.validate_answer(user_answer, question)
            
            correct_answers.append(question.correct_answer)
            user_answers.append(user_answer)
            question_times.append(time_taken)
            
            if is_correct:
                raw_score += 1
                # Apply difficulty multiplier
                multiplier = scoring_config.get('difficulty_multipliers', {}).get(question.difficulty, 1.0)
                points_earned += int(question.points * multiplier)
        
        # Calculate percentage
        percentage = (raw_score / len(questions)) * 100 if questions else 0
        
        # Calculate time bonus
        time_bonus = 0
        if scoring_config.get('time_bonus_enabled', False):
            time_limit_seconds = config.get('test_info', {}).get('time_limit_minutes', 20) * 60
            threshold_seconds = scoring_config.get('time_bonus_threshold_minutes', 15) * 60
            max_bonus = scoring_config.get('max_time_bonus_points', 20)
            
            if total_time_taken < threshold_seconds:
                time_saved = threshold_seconds - total_time_taken
                time_bonus = min(int((time_saved / threshold_seconds) * max_bonus), max_bonus)
        
        final_score = points_earned + time_bonus
        
        return TestResult(
            raw_score=raw_score,
            total_questions=len(questions),
            percentage=round(percentage, 1),
            time_taken=total_time_taken,
            time_bonus=time_bonus,
            final_score=final_score,
            percentile=self._calculate_percentile(percentage),
            correct_answers=correct_answers,
            user_answers=user_answers,
            question_times=question_times
        )
    
    def calculate_abstract_score(self, responses: List[Dict[str, Any]], 
                               questions: List[Question],
                               total_time_taken: int) -> TestResult:
        """
        Calculate score for abstract reasoning test (simple scoring)
        
        Args:
            responses: List of user responses with question_id, answer, time_taken
            questions: List of Question objects
            total_time_taken: Total time taken in seconds
            
        Returns:
            TestResult object
        """
        config = self.test_configs.get('abstract_reasoning', {})
        scoring_config = config.get('scoring', {})
        
        # Create lookup for questions
        question_map = {q.question_id: q for q in questions}
        
        raw_score = 0
        correct_answers = []
        user_answers = []
        question_times = []
        
        base_points = scoring_config.get('base_points_per_question', 5)
        
        for response in responses:
            question_id = response['question_id']
            user_answer = response['answer']
            time_taken = response.get('time_taken', 0)
            
            question = question_map.get(question_id)
            if not question:
                continue
                
            is_correct, _ = self.validate_answer(user_answer, question)
            
            correct_answers.append(question.correct_answer)
            user_answers.append(user_answer)
            question_times.append(time_taken)
            
            if is_correct:
                raw_score += 1
        
        # Calculate percentage and final score
        percentage = (raw_score / len(questions)) * 100 if questions else 0
        final_score = raw_score * base_points
        
        return TestResult(
            raw_score=raw_score,
            total_questions=len(questions),
            percentage=round(percentage, 1),
            time_taken=total_time_taken,
            time_bonus=0,  # No time bonus for abstract reasoning
            final_score=final_score,
            percentile=self._calculate_percentile(percentage),
            correct_answers=correct_answers,
            user_answers=user_answers,
            question_times=question_times
        )
    
    def _calculate_percentile(self, percentage: float) -> int:
        """
        Calculate percentile ranking (placeholder implementation)
        In a real system, this would compare against historical data
        
        Args:
            percentage: Test percentage score
            
        Returns:
            Percentile ranking (1-99)
        """
        # Simple approximation - in reality this would use historical data
        if percentage >= 90:
            return random.randint(85, 99)
        elif percentage >= 80:
            return random.randint(70, 84)
        elif percentage >= 70:
            return random.randint(55, 69)
        elif percentage >= 60:
            return random.randint(40, 54)
        elif percentage >= 50:
            return random.randint(25, 39)
        else:
            return random.randint(1, 24)
    
    def generate_test_session(self, test_type: str, num_questions: int = None) -> List[Question]:
        """
        Generate a test session with selected questions
        
        Args:
            test_type: 'numerical_reasoning' or 'abstract_reasoning'
            num_questions: Number of questions (uses default from config if None)
            
        Returns:
            List of Question objects for the test session
        """
        all_questions = self.load_questions(test_type)
        
        # Get default question count from config
        if num_questions is None:
            test_config = self.test_configs.get(test_type, {})
            num_questions = test_config.get('test_info', {}).get('total_questions', 20)
        
        # Get difficulty distribution
        test_config = self.test_configs.get(test_type, {})
        difficulty_dist = test_config.get('difficulty_distribution', {
            'easy': 0.4, 'medium': 0.45, 'hard': 0.15
        })
        
        # Calculate how many questions of each difficulty
        easy_count = int(num_questions * difficulty_dist.get('easy', 0.4))
        hard_count = int(num_questions * difficulty_dist.get('hard', 0.15))
        medium_count = num_questions - easy_count - hard_count
        
        # Separate questions by difficulty
        easy_questions = [q for q in all_questions if q.difficulty == 'easy']
        medium_questions = [q for q in all_questions if q.difficulty == 'medium']
        hard_questions = [q for q in all_questions if q.difficulty == 'hard']
        
        # Randomly select questions
        selected_questions = []
        
        if easy_questions:
            selected_questions.extend(random.sample(
                easy_questions, min(easy_count, len(easy_questions))
            ))
        
        if medium_questions:
            selected_questions.extend(random.sample(
                medium_questions, min(medium_count, len(medium_questions))
            ))
        
        if hard_questions:
            selected_questions.extend(random.sample(
                hard_questions, min(hard_count, len(hard_questions))
            ))
        
        # Shuffle the final selection
        random.shuffle(selected_questions)
        
        return selected_questions[:num_questions]
    
    def get_test_info(self, test_type: str) -> Dict[str, Any]:
        """
        Get test configuration information
        
        Args:
            test_type: 'numerical_reasoning' or 'abstract_reasoning'
            
        Returns:
            Dictionary with test configuration
        """
        return self.test_configs.get(test_type, {})


# Convenience functions for easy integration
def create_numerical_test(num_questions: int = 25) -> Tuple[List[Question], Dict[str, Any]]:
    """
    Create a numerical reasoning test session
    
    Args:
        num_questions: Number of questions for the test
        
    Returns:
        Tuple of (questions, test_info)
    """
    engine = SkillsTestEngine()
    questions = engine.generate_test_session('numerical_reasoning', num_questions)
    test_info = engine.get_test_info('numerical_reasoning')
    return questions, test_info

def create_abstract_test(num_questions: int = 20) -> Tuple[List[Question], Dict[str, Any]]:
    """
    Create an abstract reasoning test session
    
    Args:
        num_questions: Number of questions for the test
        
    Returns:
        Tuple of (questions, test_info)
    """
    engine = SkillsTestEngine()
    questions = engine.generate_test_session('abstract_reasoning', num_questions)
    test_info = engine.get_test_info('abstract_reasoning')
    return questions, test_info

def calculate_test_score(test_type: str, responses: List[Dict[str, Any]], 
                        questions: List[Question], total_time: int) -> TestResult:
    """
    Calculate test score based on responses
    
    Args:
        test_type: 'numerical_reasoning' or 'abstract_reasoning'
        responses: List of user responses
        questions: List of Question objects
        total_time: Total time taken in seconds
        
    Returns:
        TestResult object
    """
    engine = SkillsTestEngine()
    
    if test_type == 'numerical_reasoning':
        return engine.calculate_numerical_score(responses, questions, total_time)
    elif test_type == 'abstract_reasoning':
        return engine.calculate_abstract_score(responses, questions, total_time)
    else:
        raise ValueError(f"Unknown test type: {test_type}")
