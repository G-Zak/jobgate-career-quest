from django.db import models
from django.contrib.auth.models import User
import json

# Create your models here.

class Test(models.Model):
    TEST_TYPES = [
        ('verbal_reasoning', 'Verbal Reasoning'),
        ('numerical_reasoning', 'Numerical Reasoning'),
        ('logical_reasoning', 'Logical Reasoning'),
        ('abstract_reasoning', 'Abstract Reasoning'),
        ('spatial_reasoning', 'Spatial Reasoning'),
        ('technical', 'Technical'),
    ]
    
    title = models.CharField(max_length=200)
    test_type = models.CharField(max_length=50, choices=TEST_TYPES)
    description = models.TextField()
    duration_minutes = models.IntegerField()  # Duration in minutes
    total_questions = models.IntegerField()
    passing_score = models.IntegerField(default=70)  # Percentage
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.title} ({self.test_type})"
    
    class Meta:
        ordering = ['test_type', 'title']


class Question(models.Model):
    QUESTION_TYPES = [
        ('reading_comprehension', 'Reading Comprehension'),
        ('vocabulary', 'Vocabulary in Context'),
        ('logical_deduction', 'Logical Deduction from Text'),
        ('critical_reasoning', 'Critical Reasoning'),
        ('analogies', 'Analogies and Relationships'),
        ('mental_rotation', 'Mental Rotation'),
        ('paper_folding', 'Paper Folding/Unfolding'),
        ('cross_sections', 'Cross-sections Identification'),
        ('spatial_transformation', 'Spatial Transformation'),
        ('perspective_changes', 'Perspective Changes'),
        ('multiple_choice', 'Multiple Choice'),
    ]
    
    test = models.ForeignKey(Test, on_delete=models.CASCADE, related_name='questions')
    question_type = models.CharField(max_length=50, choices=QUESTION_TYPES)
    question_text = models.TextField()
    passage = models.TextField(blank=True, null=True)  # For reading comprehension
    context = models.TextField(blank=True, null=True)  # Additional context if needed
    options = models.JSONField()  # Store options as JSON array
    correct_answer = models.CharField(max_length=10)  # e.g., 'A', 'B', 'C', 'D'
    explanation = models.TextField(blank=True, null=True)
    difficulty_level = models.CharField(
        max_length=20, 
        choices=[('easy', 'Easy'), ('medium', 'Medium'), ('hard', 'Hard')],
        default='medium'
    )
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    
    # Visual Content Fields for Spatial Reasoning
    main_image = models.URLField(blank=True, null=True)  # Primary question image
    option_images = models.JSONField(default=list, blank=True)  # URLs for A, B, C, D option images
    sequence_images = models.JSONField(default=list, blank=True)  # For step-by-step visuals (folding)
    
    # Image Economy Fields for Efficient Asset Management
    base_image_id = models.CharField(max_length=100, blank=True, null=True)  # Reference to base asset
    overlay_ids = models.JSONField(default=list, blank=True)  # Overlay elements (arrows, lines)
    transforms = models.JSONField(default=dict, blank=True)  # Rotation, scale, flip transformations
    option_remap = models.JSONField(default=dict, blank=True)  # Answer shuffling for anti-cheating
    
    # Visual Metadata
    visual_style = models.CharField(
        max_length=50, 
        choices=[
            ('technical_3d', 'Technical 3D Render'),
            ('diagram', 'Technical Diagram'),
            ('wireframe', 'Wireframe'),
            ('isometric', 'Isometric View'),
            ('orthographic', 'Orthographic Projection')
        ],
        default='technical_3d',
        blank=True
    )
    complexity_score = models.IntegerField(default=1)  # 1-5 visual complexity rating
    
    def __str__(self):
        return f"Q{self.order}: {self.question_text[:50]}..."
    
    class Meta:
        ordering = ['test', 'order']


class TestSession(models.Model):
    STATUS_CHOICES = [
        ('not_started', 'Not Started'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('abandoned', 'Abandoned'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    test = models.ForeignKey(Test, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='not_started')
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(null=True, blank=True)
    current_question = models.IntegerField(default=1)
    score = models.IntegerField(null=True, blank=True)  # Percentage score
    answers = models.JSONField(default=dict)  # Store user answers
    time_spent = models.IntegerField(default=0)  # Time spent in seconds
    
    def __str__(self):
        return f"{self.user.username} - {self.test.title} ({self.status})"
    
    class Meta:
        unique_together = ['user', 'test']
        ordering = ['-start_time']


class TestAnswer(models.Model):
    session = models.ForeignKey(TestSession, on_delete=models.CASCADE, related_name='test_answers')
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    selected_answer = models.CharField(max_length=10)  # e.g., 'A', 'B', 'C', 'D'
    is_correct = models.BooleanField()
    time_taken = models.IntegerField(default=0)  # Time taken for this question in seconds
    answered_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.session.user.username} - Q{self.question.order}: {self.selected_answer}"
    
    class Meta:
        unique_together = ['session', 'question']
        ordering = ['question__order']
