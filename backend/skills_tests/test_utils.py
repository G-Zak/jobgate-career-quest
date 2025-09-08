"""
Test Management Utilities for Skills Assessment
Provides additional utilities for test administration
"""

import json
import os
from typing import Dict, List, Any, Optional
from datetime import datetime
import uuid

from . import SkillsTestEngine, Question, TestResult

class TestSession:
    """Manages a single test session"""
    
    def __init__(self, test_type: str, user_id: str = None):
        self.session_id = str(uuid.uuid4())
        self.test_type = test_type
        self.user_id = user_id or "anonymous"
        self.start_time = None
        self.end_time = None
        self.current_question_index = 0
        self.questions = []
        self.responses = []
        self.is_completed = False
        
        # Initialize test engine
        self.engine = SkillsTestEngine()
        
    def start_test(self, num_questions: int = None) -> Dict[str, Any]:
        """
        Start a new test session
        
        Args:
            num_questions: Number of questions (uses default if None)
            
        Returns:
            Dictionary with session info and first question
        """
        self.start_time = datetime.now()
        self.questions = self.engine.generate_test_session(self.test_type, num_questions)
        
        if not self.questions:
            raise ValueError("No questions available for test")
        
        return {
            'session_id': self.session_id,
            'test_type': self.test_type,
            'total_questions': len(self.questions),
            'current_question': 1,
            'question': self.engine.present_question(self.questions[0])
        }
    
    def get_current_question(self) -> Optional[Dict[str, Any]]:
        """Get the current question"""
        if 0 <= self.current_question_index < len(self.questions):
            question = self.questions[self.current_question_index]
            return self.engine.present_question(question)
        return None
    
    def submit_answer(self, answer: str, time_taken: int = None) -> Dict[str, Any]:
        """
        Submit an answer for the current question
        
        Args:
            answer: Selected option (A, B, C, D, E)
            time_taken: Time taken for this question in seconds
            
        Returns:
            Dictionary with submission result and next question info
        """
        if self.current_question_index >= len(self.questions):
            raise ValueError("No more questions available")
        
        current_question = self.questions[self.current_question_index]
        
        # Record the response
        response = {
            'question_id': current_question.question_id,
            'answer': answer.upper(),
            'time_taken': time_taken or 0,
            'timestamp': datetime.now().isoformat()
        }
        self.responses.append(response)
        
        # Validate answer
        is_correct, explanation = self.engine.validate_answer(answer, current_question)
        
        # Move to next question
        self.current_question_index += 1
        
        result = {
            'question_number': self.current_question_index,
            'total_questions': len(self.questions),
            'is_correct': is_correct,
            'correct_answer': current_question.correct_answer,
            'explanation': explanation
        }
        
        # Check if test is completed
        if self.current_question_index >= len(self.questions):
            self.end_time = datetime.now()
            self.is_completed = True
            result['test_completed'] = True
            result['final_results'] = self.calculate_final_score()
        else:
            # Provide next question
            result['test_completed'] = False
            result['next_question'] = self.get_current_question()
        
        return result
    
    def calculate_final_score(self) -> TestResult:
        """Calculate the final test score"""
        if not self.is_completed:
            raise ValueError("Test not completed yet")
        
        total_time = int((self.end_time - self.start_time).total_seconds())
        
        if self.test_type == 'numerical_reasoning':
            return self.engine.calculate_numerical_score(
                self.responses, self.questions, total_time
            )
        elif self.test_type == 'abstract_reasoning':
            return self.engine.calculate_abstract_score(
                self.responses, self.questions, total_time
            )
        else:
            raise ValueError(f"Unknown test type: {self.test_type}")
    
    def get_session_summary(self) -> Dict[str, Any]:
        """Get a summary of the test session"""
        return {
            'session_id': self.session_id,
            'test_type': self.test_type,
            'user_id': self.user_id,
            'start_time': self.start_time.isoformat() if self.start_time else None,
            'end_time': self.end_time.isoformat() if self.end_time else None,
            'total_questions': len(self.questions),
            'questions_answered': len(self.responses),
            'is_completed': self.is_completed,
            'current_question_index': self.current_question_index + 1
        }


class TestAnalytics:
    """Provides analytics and insights for test performance"""
    
    @staticmethod
    def analyze_performance_by_category(test_result: TestResult, 
                                      questions: List[Question]) -> Dict[str, Any]:
        """
        Analyze performance broken down by question category
        
        Args:
            test_result: TestResult object
            questions: List of Question objects
            
        Returns:
            Dictionary with category breakdown
        """
        if not test_result.user_answers or not test_result.correct_answers:
            return {}
        
        category_stats = {}
        
        for i, question in enumerate(questions):
            if i >= len(test_result.user_answers):
                continue
                
            category = question.category
            if category not in category_stats:
                category_stats[category] = {
                    'total': 0,
                    'correct': 0,
                    'total_time': 0,
                    'questions': []
                }
            
            is_correct = (test_result.user_answers[i] == test_result.correct_answers[i])
            time_taken = test_result.question_times[i] if test_result.question_times else 0
            
            category_stats[category]['total'] += 1
            category_stats[category]['total_time'] += time_taken
            category_stats[category]['questions'].append({
                'question_id': question.question_id,
                'difficulty': question.difficulty,
                'correct': is_correct,
                'time_taken': time_taken
            })
            
            if is_correct:
                category_stats[category]['correct'] += 1
        
        # Calculate percentages and averages
        for category, stats in category_stats.items():
            stats['percentage'] = (stats['correct'] / stats['total']) * 100
            stats['average_time'] = stats['total_time'] / stats['total']
            stats.pop('questions')  # Remove detailed questions for summary
        
        return category_stats
    
    @staticmethod
    def analyze_difficulty_performance(test_result: TestResult, 
                                     questions: List[Question]) -> Dict[str, Any]:
        """
        Analyze performance by difficulty level
        
        Args:
            test_result: TestResult object
            questions: List of Question objects
            
        Returns:
            Dictionary with difficulty breakdown
        """
        if not test_result.user_answers or not test_result.correct_answers:
            return {}
        
        difficulty_stats = {}
        
        for i, question in enumerate(questions):
            if i >= len(test_result.user_answers):
                continue
                
            difficulty = question.difficulty
            if difficulty not in difficulty_stats:
                difficulty_stats[difficulty] = {
                    'total': 0,
                    'correct': 0,
                    'total_time': 0
                }
            
            is_correct = (test_result.user_answers[i] == test_result.correct_answers[i])
            time_taken = test_result.question_times[i] if test_result.question_times else 0
            
            difficulty_stats[difficulty]['total'] += 1
            difficulty_stats[difficulty]['total_time'] += time_taken
            
            if is_correct:
                difficulty_stats[difficulty]['correct'] += 1
        
        # Calculate percentages and averages
        for difficulty, stats in difficulty_stats.items():
            stats['percentage'] = (stats['correct'] / stats['total']) * 100
            stats['average_time'] = stats['total_time'] / stats['total']
        
        return difficulty_stats
    
    @staticmethod
    def generate_recommendations(test_result: TestResult, 
                               questions: List[Question]) -> List[str]:
        """
        Generate study recommendations based on test performance
        
        Args:
            test_result: TestResult object
            questions: List of Question objects
            
        Returns:
            List of recommendation strings
        """
        recommendations = []
        
        # Analyze category performance
        category_performance = TestAnalytics.analyze_performance_by_category(
            test_result, questions
        )
        
        # Analyze difficulty performance
        difficulty_performance = TestAnalytics.analyze_difficulty_performance(
            test_result, questions
        )
        
        # Overall performance recommendations
        if test_result.percentage >= 80:
            recommendations.append("Excellent performance! You demonstrate strong reasoning skills.")
        elif test_result.percentage >= 60:
            recommendations.append("Good performance with room for improvement in specific areas.")
        else:
            recommendations.append("Focus on fundamental concepts to improve your reasoning skills.")
        
        # Category-specific recommendations
        weak_categories = [
            cat for cat, stats in category_performance.items() 
            if stats['percentage'] < 60
        ]
        
        if weak_categories:
            recommendations.append(
                f"Focus on improving in: {', '.join(weak_categories)}"
            )
        
        # Difficulty-specific recommendations
        if 'easy' in difficulty_performance and difficulty_performance['easy']['percentage'] < 70:
            recommendations.append(
                "Review fundamental concepts - focus on easier problems first"
            )
        
        if 'hard' in difficulty_performance and difficulty_performance['hard']['percentage'] > 60:
            recommendations.append(
                "You handle complex problems well - consider advanced practice materials"
            )
        
        # Time management recommendations
        avg_time_per_question = test_result.time_taken / test_result.total_questions
        expected_time = 48 if questions[0].test_type == 'numerical_reasoning' else 45  # seconds
        
        if avg_time_per_question > expected_time * 1.2:
            recommendations.append(
                "Work on time management - practice solving problems more quickly"
            )
        elif avg_time_per_question < expected_time * 0.7:
            recommendations.append(
                "Take more time to carefully read and analyze questions"
            )
        
        return recommendations


def export_test_results(test_result: TestResult, questions: List[Question], 
                       session_info: Dict[str, Any], filepath: str = None) -> str:
    """
    Export test results to JSON file
    
    Args:
        test_result: TestResult object
        questions: List of Question objects
        session_info: Session information dictionary
        filepath: Optional custom filepath
        
    Returns:
        Path to the exported file
    """
    if filepath is None:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filepath = f"test_results_{session_info.get('session_id', 'unknown')}_{timestamp}.json"
    
    # Prepare export data
    export_data = {
        'session_info': session_info,
        'test_results': {
            'raw_score': test_result.raw_score,
            'total_questions': test_result.total_questions,
            'percentage': test_result.percentage,
            'time_taken': test_result.time_taken,
            'time_bonus': test_result.time_bonus,
            'final_score': test_result.final_score,
            'percentile': test_result.percentile
        },
        'detailed_responses': [
            {
                'question_id': questions[i].question_id if i < len(questions) else None,
                'user_answer': test_result.user_answers[i] if i < len(test_result.user_answers) else None,
                'correct_answer': test_result.correct_answers[i] if i < len(test_result.correct_answers) else None,
                'time_taken': test_result.question_times[i] if test_result.question_times and i < len(test_result.question_times) else None,
                'is_correct': (test_result.user_answers[i] == test_result.correct_answers[i]) if i < len(test_result.user_answers) and i < len(test_result.correct_answers) else None
            }
            for i in range(test_result.total_questions)
        ],
        'analytics': {
            'category_performance': TestAnalytics.analyze_performance_by_category(test_result, questions),
            'difficulty_performance': TestAnalytics.analyze_difficulty_performance(test_result, questions),
            'recommendations': TestAnalytics.generate_recommendations(test_result, questions)
        },
        'export_timestamp': datetime.now().isoformat()
    }
    
    # Write to file
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(export_data, f, indent=2, ensure_ascii=False)
    
    return filepath
