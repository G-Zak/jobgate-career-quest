"""
Django Models for Universal Scoring System

Models to support the universal scoring system for all test types.
"""

from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
from decimal import Decimal
import json

class ScoringConfig(models.Model):
 """Global scoring configuration for tests"""

 name = models.CharField(max_length=100, unique=True)
 description = models.TextField(blank=True)

 # Scoring weights (should sum to 1.0)
 time_weight = models.DecimalField(
 max_digits=3,
 decimal_places=2,
 default=0.30,
 validators=[MinValueValidator(0.0), MaxValueValidator(1.0)]
 )
 difficulty_weight = models.DecimalField(
 max_digits=3,
 decimal_places=2,
 default=0.50,
 validators=[MinValueValidator(0.0), MaxValueValidator(1.0)]
 )
 accuracy_weight = models.DecimalField(
 max_digits=3,
 decimal_places=2,
 default=0.20,
 validators=[MinValueValidator(0.0), MaxValueValidator(1.0)]
 )

 # Metadata
 is_default = models.BooleanField(default=False)
 created_at = models.DateTimeField(auto_now_add=True)
 updated_at = models.DateTimeField(auto_now=True)

 class Meta:
 db_table = 'scoring_configs'
 verbose_name = 'Scoring Configuration'
 verbose_name_plural = 'Scoring Configurations'

 def __str__(self):
 return f"{self.name} (T:{self.time_weight}, D:{self.difficulty_weight}, A:{self.accuracy_weight})"

 def clean(self):
 """Validate that weights sum to approximately 1.0"""
 from django.core.exceptions import ValidationError

 total = float(self.time_weight + self.difficulty_weight + self.accuracy_weight)
 if abs(total - 1.0) > 0.01:
 raise ValidationError(
 f"Scoring weights must sum to 1.0, got {total}"
 )

 def save(self, *args, **kwargs):
 self.clean()
 super().save(*args, **kwargs)

class QuestionType(models.TextChoices):
 """Supported question types"""
 MULTIPLE_CHOICE = 'multiple_choice', 'Multiple Choice'
 NUMERICAL = 'numerical', 'Numerical'
 VERBAL = 'verbal', 'Verbal'
 ABSTRACT = 'abstract', 'Abstract'
 SPATIAL = 'spatial', 'Spatial'
 SITUATIONAL = 'situational', 'Situational Judgment'
 DIAGRAMMATIC = 'diagrammatic', 'Diagrammatic'
 TECHNICAL = 'technical', 'Technical'
 LOGICAL = 'logical', 'Logical'
 OPEN_ENDED = 'open_ended', 'Open Ended'

class Question(models.Model):
 """Universal question model that works for all test types"""

 # Basic question information
 id = models.CharField(max_length=100, primary_key=True)
 question_type = models.CharField(
 max_length=20,
 choices=QuestionType.choices,
 default=QuestionType.MULTIPLE_CHOICE
 )
 question_text = models.TextField()
 correct_answer = models.TextField()

 # Question metadata
 difficulty = models.IntegerField(
 default=1,
 validators=[MinValueValidator(1), MaxValueValidator(5)]
 )
 section = models.IntegerField(default=1)
 category = models.CharField(max_length=100, blank=True)

 # Options for multiple choice questions
 options = models.JSONField(default=list, blank=True)

 # Scoring configuration
 base_score = models.IntegerField(default=5)
 difficulty_bonus = models.DecimalField(
 max_digits=3,
 decimal_places=1,
 default=2.0
 )
 time_factor = models.DecimalField(
 max_digits=3,
 decimal_places=1,
 default=1.0
 )

 # Additional metadata
 metadata = models.JSONField(default=dict, blank=True)
 created_at = models.DateTimeField(auto_now_add=True)
 updated_at = models.DateTimeField(auto_now=True)

 class Meta:
 db_table = 'questions'
 verbose_name = 'Question'
 verbose_name_plural = 'Questions'
 ordering = ['section', 'id']

 def __str__(self):
 return f"{self.id}: {self.question_text[:50]}..."

 def get_options_list(self):
 """Get options as a list for multiple choice questions"""
 if self.question_type == QuestionType.MULTIPLE_CHOICE and self.options:
 return self.options
 return []

 def to_scoring_dict(self):
 """Convert to dictionary format expected by scoring system"""
 from .scoring_system import Question as ScoringQuestion, ScoreWeight, QuestionType as ScoringQuestionType

 return {
 'id': self.id,
 'type': self.question_type,
 'question': self.question_text,
 'options': self.get_options_list(),
 'correct_answer': self.correct_answer,
 'difficulty': self.difficulty,
 'section': self.section,
 'scoreWeight': {
 'base': self.base_score,
 'difficulty_bonus': float(self.difficulty_bonus),
 'time_factor': float(self.time_factor)
 },
 'category': self.category,
 'metadata': self.metadata
 }

class TestSession(models.Model):
 """Represents a user's test session"""

 user = models.ForeignKey(User, on_delete=models.CASCADE)
 test_id = models.CharField(max_length=100)
 test_type = models.CharField(max_length=50)

 # Session timing
 started_at = models.DateTimeField()
 completed_at = models.DateTimeField(null=True, blank=True)

 # Scoring configuration used
 scoring_config = models.ForeignKey(
 ScoringConfig,
 on_delete=models.SET_NULL,
 null=True
 )

 # Session status
 STATUS_CHOICES = [
 ('in_progress', 'In Progress'),
 ('completed', 'Completed'),
 ('abandoned', 'Abandoned'),
 ('time_expired', 'Time Expired')
 ]
 status = models.CharField(
 max_length=20,
 choices=STATUS_CHOICES,
 default='in_progress'
 )

 # Session metadata
 metadata = models.JSONField(default=dict, blank=True)

 class Meta:
 db_table = 'test_sessions'
 verbose_name = 'Test Session'
 verbose_name_plural = 'Test Sessions'
 ordering = ['-started_at']

 def __str__(self):
 return f"{self.user.username} - {self.test_type} ({self.status})"

 @property
 def duration_seconds(self):
 """Get session duration in seconds"""
 if self.completed_at:
 return (self.completed_at - self.started_at).total_seconds()
 return None

class QuestionResponse(models.Model):
 """Represents a user's response to a specific question"""

 session = models.ForeignKey(TestSession, on_delete=models.CASCADE, related_name='responses')
 question = models.ForeignKey(Question, on_delete=models.CASCADE)

 # User's answer
 user_answer = models.TextField()

 # Timing information
 time_taken = models.DecimalField(
 max_digits=8,
 decimal_places=2,
 help_text="Time taken in seconds"
 )
 answered_at = models.DateTimeField(auto_now_add=True)

 # Scoring information
 is_correct = models.BooleanField(default=False)
 calculated_score = models.IntegerField(default=0)
 score_breakdown = models.JSONField(default=dict, blank=True)

 class Meta:
 db_table = 'question_responses'
 verbose_name = 'Question Response'
 verbose_name_plural = 'Question Responses'
 unique_together = ['session', 'question']
 ordering = ['answered_at']

 def __str__(self):
 return f"{self.session.user.username} - {self.question.id}: {self.calculated_score}pts"

 def calculate_score(self):
 """Calculate and update the score for this response"""
 from .scoring_system import (
 UniversalScoringSystem,
 GlobalScoringConfig,
 Question as ScoringQuestion
 )

 # Get scoring configuration
 if self.session.scoring_config:
 global_config = GlobalScoringConfig(
 time_weight=float(self.session.scoring_config.time_weight),
 difficulty_weight=float(self.session.scoring_config.difficulty_weight),
 accuracy_weight=float(self.session.scoring_config.accuracy_weight)
 )
 else:
 global_config = GlobalScoringConfig() # Use defaults

 # Create scoring system
 scoring_system = UniversalScoringSystem(global_config)

 # Convert question to scoring format
 question_dict = self.question.to_scoring_dict()
 scoring_question = ScoringQuestion(**question_dict)

 # Calculate score
 self.calculated_score = scoring_system.calculate_score(
 scoring_question,
 self.user_answer,
 float(self.time_taken)
 )

 # Get detailed breakdown
 self.score_breakdown = scoring_system.get_score_breakdown(
 scoring_question,
 self.user_answer,
 float(self.time_taken)
 )

 # Update correctness
 self.is_correct = self.score_breakdown.get('correct', False)

 return self.calculated_score

class TestResult(models.Model):
 """Aggregated test results for a session"""

 session = models.OneToOneField(TestSession, on_delete=models.CASCADE, related_name='result')

 # Overall scores
 total_score = models.IntegerField(default=0)
 max_possible_score = models.IntegerField(default=0)
 percentage = models.DecimalField(
 max_digits=5,
 decimal_places=2,
 default=0.00
 )

 # Question statistics
 total_questions = models.IntegerField(default=0)
 answered_questions = models.IntegerField(default=0)
 correct_answers = models.IntegerField(default=0)

 # Timing statistics
 total_time_seconds = models.IntegerField(default=0)
 average_time_per_question = models.DecimalField(
 max_digits=8,
 decimal_places=2,
 default=0.00
 )

 # Difficulty breakdown
 difficulty_breakdown = models.JSONField(default=dict, blank=True)

 # Performance indicators
 performance_level = models.CharField(max_length=50, blank=True)
 grade = models.CharField(max_length=2, blank=True)

 # Recommendations
 recommendations = models.JSONField(default=list, blank=True)

 # Metadata
 calculated_at = models.DateTimeField(auto_now_add=True)

 class Meta:
 db_table = 'test_results'
 verbose_name = 'Test Result'
 verbose_name_plural = 'Test Results'

 def __str__(self):
 return f"{self.session.user.username} - {self.session.test_type}: {self.percentage}%"

 def calculate_from_responses(self):
 """Calculate test result from question responses"""
 responses = self.session.responses.all()

 if not responses:
 return

 # Basic statistics
 self.total_questions = responses.count()
 self.answered_questions = responses.filter(user_answer__isnull=False).count()
 self.correct_answers = responses.filter(is_correct=True).count()

 # Score calculations
 self.total_score = sum(response.calculated_score for response in responses)
 self.max_possible_score = sum(
 response.question.base_score +
 (response.question.difficulty * float(response.question.difficulty_bonus))
 for response in responses
 )

 # Percentage
 if self.max_possible_score > 0:
 self.percentage = (Decimal(self.total_score) / Decimal(self.max_possible_score)) * 100

 # Timing statistics
 self.total_time_seconds = int(sum(float(response.time_taken) for response in responses))
 if self.answered_questions > 0:
 self.average_time_per_question = Decimal(self.total_time_seconds) / Decimal(self.answered_questions)

 # Difficulty breakdown
 self.difficulty_breakdown = {}
 for difficulty in range(1, 6):
 difficulty_responses = responses.filter(question__difficulty=difficulty)
 if difficulty_responses.exists():
 total = difficulty_responses.count()
 correct = difficulty_responses.filter(is_correct=True).count()
 self.difficulty_breakdown[difficulty] = {
 'total': total,
 'correct': correct,
 'accuracy': (correct / total * 100) if total > 0 else 0
 }

 # Performance level and grade
 self._calculate_performance_indicators()

 # Generate recommendations
 self._generate_recommendations()

 self.save()

 def _calculate_performance_indicators(self):
 """Calculate performance level and grade"""
 percentage = float(self.percentage)

 # Grade calculation
 if percentage >= 90:
 self.grade = 'A'
 elif percentage >= 80:
 self.grade = 'B'
 elif percentage >= 70:
 self.grade = 'C'
 elif percentage >= 60:
 self.grade = 'D'
 else:
 self.grade = 'F'

 # Performance level
 if percentage >= 80 and float(self.average_time_per_question) <= 60:
 self.performance_level = 'Excellent'
 elif percentage >= 70 and float(self.average_time_per_question) <= 90:
 self.performance_level = 'Good'
 elif percentage >= 60:
 self.performance_level = 'Average'
 elif percentage >= 50:
 self.performance_level = 'Below Average'
 else:
 self.performance_level = 'Needs Improvement'

 def _generate_recommendations(self):
 """Generate recommendations based on performance"""
 recommendations = []

 if float(self.percentage) < 70:
 recommendations.append("Focus on understanding fundamental concepts")

 if float(self.average_time_per_question) > 120:
 recommendations.append("Practice speed and efficiency")

 # Difficulty-specific recommendations
 for difficulty, breakdown in self.difficulty_breakdown.items():
 if difficulty >= 4 and breakdown['accuracy'] < 50:
 recommendations.append(f"Work on more challenging level {difficulty} problems")

 if self.answered_questions < self.total_questions:
 recommendations.append("Improve time management to complete all questions")

 if not recommendations:
 recommendations.append("Excellent performance! Consider advanced challenges")

 self.recommendations = recommendations

