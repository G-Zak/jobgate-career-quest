"""
Enhanced Django models for Skills Assessment Database Migration
Compatible with existing testsengine models
"""

from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
import json
import uuid


class AssessmentQuestion(models.Model):
    """
    Enhanced question model for skills assessment with flexible JSON storage
    """
    TEST_TYPES = [
        ('sjt', 'Situational Judgment Test'),
        ('verbal', 'Verbal Reasoning'),
        ('spatial', 'Spatial Reasoning'),
        ('numerical', 'Numerical Reasoning'),
        ('logical', 'Logical Reasoning'),
    ]
    
    DIFFICULTY_LEVELS = [
        ('easy', 'Easy'),
        ('medium', 'Medium'),
        ('hard', 'Hard'),
    ]
    
    # Primary identifiers
    question_id = models.CharField(max_length=50, unique=True, db_index=True)
    test_type = models.CharField(max_length=20, choices=TEST_TYPES, db_index=True)
    category = models.CharField(max_length=50, db_index=True)
    subcategory = models.CharField(max_length=50, blank=True, null=True)
    
    # Question content
    question_text = models.TextField()
    choices = models.JSONField(help_text="Array of choice objects with text and optional metadata")
    correct_answer = models.IntegerField(validators=[MinValueValidator(0)])
    explanation = models.TextField(blank=True, null=True)
    
    # Classification
    difficulty = models.CharField(max_length=10, choices=DIFFICULTY_LEVELS, db_index=True)
    tags = models.JSONField(default=list, blank=True, help_text="Array of tags for categorization")
    
    # Metadata for different question types
    metadata = models.JSONField(default=dict, blank=True, help_text="Additional data: time_limit, images, etc.")
    
    # Performance tracking
    total_attempts = models.IntegerField(default=0)
    correct_attempts = models.IntegerField(default=0)
    avg_time_taken = models.DecimalField(max_digits=8, decimal_places=2, default=0.0)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['test_type', 'category', 'question_id']
        indexes = [
            models.Index(fields=['test_type', 'category']),
            models.Index(fields=['test_type', 'difficulty']),
            models.Index(fields=['category', 'subcategory']),
        ]
    
    def __str__(self):
        return f"{self.question_id} - {self.test_type.upper()} ({self.category})"
    
    @property
    def success_rate(self):
        """Calculate success rate percentage"""
        if self.total_attempts == 0:
            return 0.0
        return (self.correct_attempts / self.total_attempts) * 100
    
    def update_analytics(self, is_correct, time_taken):
        """Update question performance analytics"""
        self.total_attempts += 1
        if is_correct:
            self.correct_attempts += 1
        
        # Update average time (running average)
        if self.total_attempts == 1:
            self.avg_time_taken = time_taken
        else:
            self.avg_time_taken = (
                (self.avg_time_taken * (self.total_attempts - 1) + time_taken) 
                / self.total_attempts
            )
        self.save()


class TestConfiguration(models.Model):
    """
    Test configuration and rules
    """
    name = models.CharField(max_length=100)
    test_type = models.CharField(max_length=20, choices=AssessmentQuestion.TEST_TYPES)
    description = models.TextField(blank=True)
    
    # Test parameters
    total_questions = models.IntegerField(validators=[MinValueValidator(1)])
    time_limit = models.IntegerField(null=True, blank=True, help_text="Time limit in minutes")
    passing_score = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(100)], default=70)
    
    # Question selection rules
    difficulty_distribution = models.JSONField(
        default=dict, 
        help_text='{"easy": 30, "medium": 50, "hard": 20} - percentage distribution'
    )
    category_distribution = models.JSONField(
        default=dict,
        help_text='Category-specific question counts or percentages'
    )
    
    # Settings
    randomize_questions = models.BooleanField(default=True)
    randomize_choices = models.BooleanField(default=True)
    show_results_immediately = models.BooleanField(default=False)
    allow_review = models.BooleanField(default=True)
    
    # Status
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['test_type', 'name']
    
    def __str__(self):
        return f"{self.name} ({self.test_type.upper()})"


class UserTestSession(models.Model):
    """
    Individual user test sessions with detailed tracking
    """
    STATUS_CHOICES = [
        ('not_started', 'Not Started'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('paused', 'Paused'),
        ('abandoned', 'Abandoned'),
        ('expired', 'Expired'),
    ]
    
    # Session identification
    session_token = models.UUIDField(default=uuid.uuid4, unique=True, db_index=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='test_sessions')
    test_configuration = models.ForeignKey(TestConfiguration, on_delete=models.CASCADE)
    
    # Session state
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='not_started', db_index=True)
    current_question_index = models.IntegerField(default=0)
    selected_questions = models.JSONField(default=list, help_text="List of question IDs for this session")
    
    # Timing
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    time_taken = models.IntegerField(default=0, help_text="Total time taken in seconds")
    time_remaining = models.IntegerField(null=True, blank=True, help_text="Time remaining in seconds")
    
    # Results
    total_score = models.IntegerField(default=0)
    percentage_score = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    questions_answered = models.IntegerField(default=0)
    questions_correct = models.IntegerField(default=0)
    
    # Session data for persistence
    session_data = models.JSONField(
        default=dict,
        help_text="Store session state, navigation history, flags, etc."
    )
    
    class Meta:
        ordering = ['-started_at']
        indexes = [
            models.Index(fields=['user', 'status']),
            models.Index(fields=['test_configuration', 'status']),
            models.Index(fields=['started_at']),
        ]
    
    def __str__(self):
        return f"{self.user.username} - {self.test_configuration.name} ({self.status})"
    
    @property
    def is_active(self):
        """Check if session is currently active"""
        return self.status in ['not_started', 'in_progress', 'paused']
    
    @property
    def completion_percentage(self):
        """Calculate completion percentage"""
        total_questions = len(self.selected_questions)
        if total_questions == 0:
            return 0.0
        return (self.questions_answered / total_questions) * 100


class UserQuestionResponse(models.Model):
    """
    Individual question responses with detailed analytics
    """
    session = models.ForeignKey(UserTestSession, on_delete=models.CASCADE, related_name='responses')
    question = models.ForeignKey(AssessmentQuestion, on_delete=models.CASCADE)
    
    # Response data
    user_answer = models.IntegerField(null=True, blank=True, help_text="Index of selected choice")
    is_correct = models.BooleanField(default=False)
    is_skipped = models.BooleanField(default=False)
    
    # Timing data
    time_taken = models.IntegerField(default=0, help_text="Time taken in seconds")
    time_to_first_selection = models.IntegerField(null=True, blank=True)
    number_of_changes = models.IntegerField(default=0, help_text="Number of times answer was changed")
    
    # Response metadata
    response_data = models.JSONField(
        default=dict,
        help_text="Additional response data: confidence, difficulty perception, etc."
    )
    
    # Timestamps
    answered_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['session', 'question']
        ordering = ['session', 'answered_at']
        indexes = [
            models.Index(fields=['session']),
            models.Index(fields=['question']),
            models.Index(fields=['is_correct']),
        ]
    
    def __str__(self):
        return f"{self.session.user.username} - {self.question.question_id}: {self.user_answer}"
    
    def save(self, *args, **kwargs):
        """Override save to update question analytics"""
        super().save(*args, **kwargs)
        
        # Update question analytics
        if self.time_taken > 0:  # Only update if timing data is available
            self.question.update_analytics(self.is_correct, self.time_taken)


class QuestionAnalytics(models.Model):
    """
    Aggregated analytics for question performance optimization
    """
    question = models.OneToOneField(AssessmentQuestion, on_delete=models.CASCADE, related_name='analytics')
    
    # Performance metrics
    difficulty_rating = models.DecimalField(
        max_digits=3, decimal_places=2, default=0.0,
        help_text="Calculated difficulty based on performance (0-5 scale)"
    )
    discrimination_index = models.DecimalField(
        max_digits=4, decimal_places=3, default=0.0,
        help_text="How well question discriminates between high/low performers"
    )
    
    # Detailed statistics
    avg_time_by_difficulty = models.JSONField(default=dict, help_text="Average time by user skill level")
    choice_distribution = models.JSONField(default=dict, help_text="Distribution of selected choices")
    performance_trends = models.JSONField(default=dict, help_text="Performance trends over time")
    
    # Flags for review
    needs_review = models.BooleanField(default=False)
    review_reason = models.CharField(max_length=100, blank=True)
    
    last_updated = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name_plural = "Question Analytics"
    
    def __str__(self):
        return f"Analytics for {self.question.question_id}"
