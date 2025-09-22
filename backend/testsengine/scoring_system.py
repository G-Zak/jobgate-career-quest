"""
Universal Test Scoring System

A comprehensive, scalable scoring system for ALL test types in the skills assessment platform.
Supports: Multiple Choice, Numerical, Verbal, Abstract, Spatial, Situational, Diagrammatic, and more.

Author: JobGate Career Quest
Version: 1.0.0
"""

import math
import logging
from typing import Dict, Any, Optional, Union, List
from dataclasses import dataclass
from enum import Enum
from decimal import Decimal, ROUND_HALF_UP

logger = logging.getLogger(__name__)


class QuestionType(Enum):
    """Supported question types"""
    MULTIPLE_CHOICE = "multiple_choice"
    NUMERICAL = "numerical"
    VERBAL = "verbal"
    ABSTRACT = "abstract"
    SPATIAL = "spatial"
    SITUATIONAL = "situational"
    DIAGRAMMATIC = "diagrammatic"
    TECHNICAL = "technical"
    LOGICAL = "logical"
    OPEN_ENDED = "open_ended"


@dataclass
class ScoreWeight:
    """Score weight configuration for individual questions"""
    base: int = 5
    difficulty_bonus: float = 2.0
    time_factor: float = 1.0


@dataclass
class GlobalScoringConfig:
    """Global scoring configuration for tests"""
    time_weight: float = 0.3
    difficulty_weight: float = 0.5
    accuracy_weight: float = 0.2
    
    def __post_init__(self):
        """Validate that weights sum to approximately 1.0"""
        total = self.time_weight + self.difficulty_weight + self.accuracy_weight
        if abs(total - 1.0) > 0.01:
            logger.warning(f"Scoring weights sum to {total}, not 1.0. Consider normalizing.")


@dataclass
class Question:
    """Universal question object structure"""
    id: str
    type: Union[str, QuestionType]
    question: str
    options: Optional[List[str]] = None
    correct_answer: str = ""
    difficulty: int = 1
    section: int = 1
    score_weight: Optional[ScoreWeight] = None
    category: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None
    
    def __post_init__(self):
        """Initialize default values and validate"""
        if self.score_weight is None:
            self.score_weight = ScoreWeight()
        
        if isinstance(self.type, str):
            try:
                self.type = QuestionType(self.type)
            except ValueError:
                logger.warning(f"Unknown question type: {self.type}")
                self.type = QuestionType.MULTIPLE_CHOICE
        
        # Validate difficulty range
        self.difficulty = max(1, min(5, self.difficulty))
        
        # Ensure options is a list for multiple choice questions
        if self.type == QuestionType.MULTIPLE_CHOICE and self.options is None:
            self.options = []


class TimeEfficiencyCalculator:
    """Calculates time efficiency factors based on question type and difficulty"""
    
    # Time thresholds for different question types (in seconds)
    TIME_THRESHOLDS = {
        QuestionType.MULTIPLE_CHOICE: {"excellent": 15, "good": 30, "average": 60, "slow": 120},
        QuestionType.NUMERICAL: {"excellent": 30, "good": 60, "average": 90, "slow": 150},
        QuestionType.VERBAL: {"excellent": 45, "good": 90, "average": 120, "slow": 180},
        QuestionType.ABSTRACT: {"excellent": 20, "good": 40, "average": 70, "slow": 120},
        QuestionType.SPATIAL: {"excellent": 25, "good": 50, "average": 80, "slow": 130},
        QuestionType.SITUATIONAL: {"excellent": 40, "good": 80, "average": 120, "slow": 180},
        QuestionType.DIAGRAMMATIC: {"excellent": 30, "good": 60, "average": 90, "slow": 150},
        QuestionType.TECHNICAL: {"excellent": 60, "good": 120, "average": 180, "slow": 240},
        QuestionType.LOGICAL: {"excellent": 20, "good": 40, "average": 70, "slow": 120},
        QuestionType.OPEN_ENDED: {"excellent": 120, "good": 240, "average": 360, "slow": 600},
    }
    
    # Difficulty multipliers for time adjustment
    DIFFICULTY_TIME_MULTIPLIERS = {
        1: 0.8,  # Easy questions - faster expected
        2: 1.0,  # Medium questions - standard time
        3: 1.2,  # Hard questions - more time expected
        4: 1.5,  # Very hard questions - significantly more time
        5: 2.0   # Expert questions - much more time expected
    }
    
    @classmethod
    def calculate_efficiency(cls, time_taken: float, difficulty: int, question_type: QuestionType) -> float:
        """
        Calculate time efficiency factor based on time taken, difficulty, and question type.
        
        Args:
            time_taken: Time taken to answer in seconds
            difficulty: Question difficulty level (1-5)
            question_type: Type of question
            
        Returns:
            Time efficiency factor (0.0 to 2.0)
        """
        if time_taken < 0:
            logger.warning(f"Negative time taken: {time_taken}")
            return 0.0
        
        # Get base thresholds for this question type
        thresholds = cls.TIME_THRESHOLDS.get(question_type, cls.TIME_THRESHOLDS[QuestionType.MULTIPLE_CHOICE])
        
        # Adjust thresholds based on difficulty
        difficulty_multiplier = cls.DIFFICULTY_TIME_MULTIPLIERS.get(difficulty, 1.0)
        adjusted_thresholds = {
            key: value * difficulty_multiplier 
            for key, value in thresholds.items()
        }
        
        # Calculate efficiency based on adjusted thresholds
        if time_taken <= adjusted_thresholds["excellent"]:
            return 2.0  # Maximum time bonus
        elif time_taken <= adjusted_thresholds["good"]:
            return 1.5  # Good time bonus
        elif time_taken <= adjusted_thresholds["average"]:
            return 1.0  # Standard time bonus
        elif time_taken <= adjusted_thresholds["slow"]:
            return 0.5  # Reduced time bonus
        else:
            return 0.2  # Minimal time bonus for very slow answers


class AnswerValidator:
    """Validates and normalizes answers for different question types"""
    
    @staticmethod
    def normalize_answer(answer: Union[str, int, float], question_type: QuestionType) -> str:
        """
        Normalize answer to string format for comparison.
        
        Args:
            answer: User's answer in any format
            question_type: Type of question
            
        Returns:
            Normalized answer as string
        """
        if answer is None:
            return ""
        
        # Convert to string and normalize
        normalized = str(answer).strip().lower()
        
        # Handle different question types
        if question_type == QuestionType.MULTIPLE_CHOICE:
            # For multiple choice, ensure single letter
            if len(normalized) == 1 and normalized.isalpha():
                return normalized
            elif normalized in ['a', 'b', 'c', 'd', 'e']:
                return normalized
        elif question_type == QuestionType.NUMERICAL:
            # For numerical, try to normalize to decimal format
            try:
                # Remove common formatting
                cleaned = normalized.replace(',', '').replace('$', '').replace('%', '')
                # Convert to float and back to string to normalize
                num_value = float(cleaned)
                return f"{num_value:.2f}"
            except ValueError:
                return normalized
        elif question_type in [QuestionType.VERBAL, QuestionType.SITUATIONAL]:
            # For text-based questions, return as-is but normalized
            return normalized
        
        return normalized
    
    @staticmethod
    def is_answer_correct(user_answer: str, correct_answer: str, question_type: QuestionType) -> bool:
        """
        Check if user's answer is correct for the given question type.
        
        Args:
            user_answer: User's normalized answer
            correct_answer: Correct answer
            question_type: Type of question
            
        Returns:
            True if answer is correct, False otherwise
        """
        user_normalized = AnswerValidator.normalize_answer(user_answer, question_type)
        correct_normalized = AnswerValidator.normalize_answer(correct_answer, question_type)
        
        # Exact match
        if user_normalized == correct_normalized:
            return True
        
        # For numerical questions, allow some tolerance
        if question_type == QuestionType.NUMERICAL:
            try:
                user_num = float(user_normalized)
                correct_num = float(correct_normalized)
                # Allow 1% tolerance for numerical answers
                tolerance = abs(correct_num * 0.01)
                return abs(user_num - correct_num) <= tolerance
            except ValueError:
                pass
        
        # For multiple choice, handle case variations
        if question_type == QuestionType.MULTIPLE_CHOICE:
            return user_normalized == correct_normalized
        
        return False


class UniversalScoringSystem:
    """
    Universal scoring system that works for all test types.
    
    This system calculates scores based on:
    - Answer correctness (required for any points)
    - Question difficulty (higher difficulty = more points)
    - Time efficiency (faster answers = bonus points)
    - Global scoring configuration weights
    """
    
    def __init__(self, global_config: Optional[GlobalScoringConfig] = None):
        """
        Initialize the scoring system.
        
        Args:
            global_config: Global scoring configuration. If None, uses defaults.
        """
        self.global_config = global_config or GlobalScoringConfig()
        self.time_calculator = TimeEfficiencyCalculator()
        self.answer_validator = AnswerValidator()
        
        # Validate global config
        self._validate_global_config()
    
    def _validate_global_config(self):
        """Validate global scoring configuration"""
        total_weight = (self.global_config.time_weight + 
                       self.global_config.difficulty_weight + 
                       self.global_config.accuracy_weight)
        
        if abs(total_weight - 1.0) > 0.01:
            logger.warning(f"Global scoring weights sum to {total_weight}, not 1.0")
    
    def calculate_score(self, 
                       question: Question, 
                       user_answer: Union[str, int, float], 
                       time_taken: float) -> int:
        """
        Calculate score for a single question.
        
        Args:
            question: Question object with all necessary fields
            user_answer: User's answer in any format
            time_taken: Time taken to answer in seconds
            
        Returns:
            Calculated score as rounded integer
        """
        try:
            # Step 1: Check if answer is correct
            is_correct = self.answer_validator.is_answer_correct(
                user_answer, 
                question.correct_answer, 
                question.type
            )
            
            if not is_correct:
                return 0  # Wrong answer = 0 points
            
            # Step 2: Start with base score
            base_score = question.score_weight.base
            
            # Step 3: Add difficulty bonus
            difficulty_bonus = (question.difficulty * 
                              question.score_weight.difficulty_bonus * 
                              self.global_config.difficulty_weight)
            
            # Step 4: Calculate time efficiency
            time_efficiency = self.time_calculator.calculate_efficiency(
                time_taken, 
                question.difficulty, 
                question.type
            )
            
            time_bonus = time_efficiency * self.global_config.time_weight
            
            # Step 5: Calculate preliminary score
            preliminary_score = base_score + difficulty_bonus + time_bonus
            
            # Step 6: Apply accuracy weight as final multiplier
            final_score = preliminary_score * self.global_config.accuracy_weight
            
            # Step 7: Round to nearest integer
            rounded_score = int(Decimal(str(final_score)).quantize(
                Decimal('1'), rounding=ROUND_HALF_UP
            ))
            
            # Ensure non-negative score
            return max(0, rounded_score)
            
        except Exception as e:
            logger.error(f"Error calculating score for question {question.id}: {e}")
            return 0
    
    def calculate_batch_scores(self, 
                              questions: List[Question], 
                              user_answers: Dict[str, Union[str, int, float]], 
                              time_data: Dict[str, float]) -> Dict[str, int]:
        """
        Calculate scores for multiple questions at once.
        
        Args:
            questions: List of Question objects
            user_answers: Dict mapping question_id to user's answer
            time_data: Dict mapping question_id to time taken
            
        Returns:
            Dict mapping question_id to calculated score
        """
        scores = {}
        
        for question in questions:
            question_id = question.id
            user_answer = user_answers.get(question_id, "")
            time_taken = time_data.get(question_id, 0.0)
            
            score = self.calculate_score(question, user_answer, time_taken)
            scores[question_id] = score
        
        return scores
    
    def get_score_breakdown(self, 
                           question: Question, 
                           user_answer: Union[str, int, float], 
                           time_taken: float) -> Dict[str, Any]:
        """
        Get detailed breakdown of score calculation for debugging/analysis.
        
        Args:
            question: Question object
            user_answer: User's answer
            time_taken: Time taken in seconds
            
        Returns:
            Detailed breakdown of score calculation
        """
        is_correct = self.answer_validator.is_answer_correct(
            user_answer, 
            question.correct_answer, 
            question.type
        )
        
        if not is_correct:
            return {
                "correct": False,
                "final_score": 0,
                "breakdown": {
                    "base_score": question.score_weight.base,
                    "difficulty_bonus": 0,
                    "time_bonus": 0,
                    "preliminary_score": 0,
                    "accuracy_multiplier": self.global_config.accuracy_weight,
                    "final_score": 0
                }
            }
        
        base_score = question.score_weight.base
        difficulty_bonus = (question.difficulty * 
                          question.score_weight.difficulty_bonus * 
                          self.global_config.difficulty_weight)
        
        time_efficiency = self.time_calculator.calculate_efficiency(
            time_taken, 
            question.difficulty, 
            question.type
        )
        time_bonus = time_efficiency * self.global_config.time_weight
        
        preliminary_score = base_score + difficulty_bonus + time_bonus
        final_score = preliminary_score * self.global_config.accuracy_weight
        
        return {
            "correct": True,
            "final_score": int(Decimal(str(final_score)).quantize(
                Decimal('1'), rounding=ROUND_HALF_UP
            )),
            "breakdown": {
                "base_score": base_score,
                "difficulty_bonus": round(difficulty_bonus, 2),
                "time_bonus": round(time_bonus, 2),
                "time_efficiency": round(time_efficiency, 2),
                "preliminary_score": round(preliminary_score, 2),
                "accuracy_multiplier": self.global_config.accuracy_weight,
                "final_score": round(final_score, 2)
            },
            "question_info": {
                "type": question.type.value,
                "difficulty": question.difficulty,
                "time_taken": time_taken
            }
        }


class ScoringPresets:
    """Predefined scoring configurations for different test types"""
    
    @staticmethod
    def get_standard_config() -> GlobalScoringConfig:
        """Standard balanced configuration"""
        return GlobalScoringConfig(
            time_weight=0.3,
            difficulty_weight=0.5,
            accuracy_weight=0.2
        )
    
    @staticmethod
    def get_speed_focused_config() -> GlobalScoringConfig:
        """Speed-focused configuration"""
        return GlobalScoringConfig(
            time_weight=0.5,
            difficulty_weight=0.3,
            accuracy_weight=0.2
        )
    
    @staticmethod
    def get_accuracy_focused_config() -> GlobalScoringConfig:
        """Accuracy-focused configuration"""
        return GlobalScoringConfig(
            time_weight=0.2,
            difficulty_weight=0.3,
            accuracy_weight=0.5
        )
    
    @staticmethod
    def get_difficulty_focused_config() -> GlobalScoringConfig:
        """Difficulty-focused configuration"""
        return GlobalScoringConfig(
            time_weight=0.2,
            difficulty_weight=0.6,
            accuracy_weight=0.2
        )
    
    @staticmethod
    def get_numerical_config() -> GlobalScoringConfig:
        """Configuration optimized for numerical tests"""
        return GlobalScoringConfig(
            time_weight=0.4,
            difficulty_weight=0.4,
            accuracy_weight=0.2
        )
    
    @staticmethod
    def get_verbal_config() -> GlobalScoringConfig:
        """Configuration optimized for verbal tests"""
        return GlobalScoringConfig(
            time_weight=0.2,
            difficulty_weight=0.3,
            accuracy_weight=0.5
        )


# Convenience functions for easy integration
def calculate_score(question: Question, 
                   user_answer: Union[str, int, float], 
                   time_taken: float,
                   global_config: Optional[GlobalScoringConfig] = None) -> int:
    """
    Convenience function to calculate score for a single question.
    
    Args:
        question: Question object
        user_answer: User's answer
        time_taken: Time taken in seconds
        global_config: Optional global configuration
        
    Returns:
        Calculated score as integer
    """
    scoring_system = UniversalScoringSystem(global_config)
    return scoring_system.calculate_score(question, user_answer, time_taken)


def create_question(id: str, 
                   type: str, 
                   question: str, 
                   correct_answer: str,
                   difficulty: int = 1,
                   section: int = 1,
                   options: Optional[List[str]] = None,
                   score_weight: Optional[ScoreWeight] = None,
                   category: Optional[str] = None) -> Question:
    """
    Convenience function to create a Question object.
    
    Args:
        id: Unique question identifier
        type: Question type
        question: Question text
        correct_answer: Correct answer
        difficulty: Difficulty level (1-5)
        section: Section number
        options: Answer options (for multiple choice)
        score_weight: Custom score weight configuration
        category: Question category
        
    Returns:
        Question object
    """
    return Question(
        id=id,
        type=type,
        question=question,
        correct_answer=correct_answer,
        difficulty=difficulty,
        section=section,
        options=options,
        score_weight=score_weight,
        category=category
    )


# Example usage and testing
if __name__ == "__main__":
    # Example 1: Multiple Choice Question
    mc_question = create_question(
        id="q_1",
        type="multiple_choice",
        question="What is 2 + 2?",
        correct_answer="4",
        difficulty=1,
        options=["3", "4", "5", "6"]
    )
    
    scoring_system = UniversalScoringSystem()
    score = scoring_system.calculate_score(mc_question, "4", 15.0)
    print(f"Multiple Choice Score: {score}")
    
    # Example 2: Numerical Question
    num_question = create_question(
        id="q_2",
        type="numerical",
        question="If a car travels 60 mph for 2.5 hours, how far does it go?",
        correct_answer="150",
        difficulty=2
    )
    
    score = scoring_system.calculate_score(num_question, "150", 45.0)
    print(f"Numerical Score: {score}")
    
    # Example 3: Wrong Answer
    score = scoring_system.calculate_score(mc_question, "5", 10.0)
    print(f"Wrong Answer Score: {score}")
    
    # Example 4: Detailed breakdown
    breakdown = scoring_system.get_score_breakdown(num_question, "150", 45.0)
    print(f"Score Breakdown: {breakdown}")

