from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
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


# ======= CODING CHALLENGES MODELS =======

class CodingChallenge(models.Model):
    DIFFICULTY_CHOICES = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
        ('expert', 'Expert'),
    ]
    
    LANGUAGE_CHOICES = [
        ('python', 'Python'),
        ('javascript', 'JavaScript'),
        ('java', 'Java'),
        ('cpp', 'C++'),
        ('csharp', 'C#'),
        ('go', 'Go'),
        ('rust', 'Rust'),
    ]
    
    CATEGORY_CHOICES = [
        ('algorithms', 'Algorithms'),
        ('data_structures', 'Data Structures'),
        ('string_manipulation', 'String Manipulation'),
        ('mathematics', 'Mathematics'),
        ('dynamic_programming', 'Dynamic Programming'),
        ('recursion', 'Recursion'),
        ('sorting_searching', 'Sorting & Searching'),
        ('graph_theory', 'Graph Theory'),
        ('web_development', 'Web Development'),
        ('database', 'Database'),
    ]
    
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    description = models.TextField()
    difficulty = models.CharField(max_length=20, choices=DIFFICULTY_CHOICES)
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES)
    language = models.CharField(max_length=20, choices=LANGUAGE_CHOICES)
    
    # Problem Statement
    problem_statement = models.TextField()
    input_format = models.TextField(blank=True, null=True)
    output_format = models.TextField(blank=True, null=True)
    constraints = models.TextField(blank=True, null=True)
    
    # Code Templates
    starter_code = models.TextField(blank=True, null=True)  # Template code for users
    solution_code = models.TextField(blank=True, null=True)  # Reference solution
    
    # Test Cases
    test_cases = models.JSONField(default=list)  # List of {input, expected_output, is_hidden}
    
    # Scoring
    max_points = models.IntegerField(default=100)
    time_limit_seconds = models.IntegerField(default=2)  # Execution time limit
    memory_limit_mb = models.IntegerField(default=128)  # Memory limit
    
    # Metadata
    tags = models.JSONField(default=list)  # Additional tags for filtering
    estimated_time_minutes = models.IntegerField(default=30)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.title} ({self.language} - {self.difficulty})"
    
    class Meta:
        ordering = ['difficulty', 'title']


class CodingSubmission(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('running', 'Running'),
        ('accepted', 'Accepted'),
        ('wrong_answer', 'Wrong Answer'),
        ('compilation_error', 'Compilation Error'),
        ('runtime_error', 'Runtime Error'),
        ('time_limit_exceeded', 'Time Limit Exceeded'),
        ('memory_limit_exceeded', 'Memory Limit Exceeded'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)  # Allow anonymous submissions
    challenge = models.ForeignKey(CodingChallenge, on_delete=models.CASCADE)
    code = models.TextField()
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='pending')
    
    # Results
    score = models.IntegerField(default=0)  # Points earned
    tests_passed = models.IntegerField(default=0)
    total_tests = models.IntegerField(default=0)
    execution_time_ms = models.IntegerField(default=0)
    memory_used_mb = models.FloatField(default=0.0)
    
    # Detailed Results
    test_results = models.JSONField(default=list)  # Detailed test case results
    error_message = models.TextField(blank=True, null=True)
    compilation_output = models.TextField(blank=True, null=True)
    
    submitted_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        user_display = self.user.username if self.user else "Anonymous"
        return f"{user_display} - {self.challenge.title} ({self.status})"
    
    @property
    def success_rate(self):
        if self.total_tests == 0:
            return 0
        return round((self.tests_passed / self.total_tests) * 100, 1)
    
    class Meta:
        ordering = ['-submitted_at']


class CodingSession(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('completed', 'Completed'),
        ('abandoned', 'Abandoned'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    challenge = models.ForeignKey(CodingChallenge, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    
    # Session data
    current_code = models.TextField(blank=True, null=True)  # Auto-save user's code
    start_time = models.DateTimeField(auto_now_add=True)
    last_activity = models.DateTimeField(auto_now=True)
    completion_time = models.DateTimeField(null=True, blank=True)
    
    # Best submission reference
    best_submission = models.ForeignKey(
        CodingSubmission, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='best_for_session'
    )
    
    def __str__(self):
        return f"{self.user.username} - {self.challenge.title} Session"
    
    @property
    def time_spent_minutes(self):
        if self.completion_time:
            duration = self.completion_time - self.start_time
        else:
            duration = timezone.now() - self.start_time
        return round(duration.total_seconds() / 60, 1)
    
    class Meta:
        unique_together = ['user', 'challenge']
        ordering = ['-last_activity']
