from django.db import models
from django.contrib.auth.models import User
from django.conf import settings
import json

# Create your models here.

class Test(models.Model):
    """
    Test definition with metadata for scoring system.
    Optimized for PostgreSQL with proper indexing.
    """
    TEST_TYPES = [
        ('verbal_reasoning', 'Verbal Reasoning'),
        ('numerical_reasoning', 'Numerical Reasoning'),
        ('logical_reasoning', 'Logical Reasoning'),
        ('abstract_reasoning', 'Abstract Reasoning'),
        ('spatial_reasoning', 'Spatial Reasoning'),
        ('situational_judgment', 'Situational Judgment'),
        ('technical', 'Technical'),
    ]
    
    # Basic test information
    title = models.CharField(max_length=200, db_index=True)
    test_type = models.CharField(max_length=50, choices=TEST_TYPES, db_index=True)
    description = models.TextField()
    
    # Test configuration
    duration_minutes = models.PositiveIntegerField(
        default=20,
        help_text="Fixed duration in minutes (20 minutes for all tests)"
    )
    total_questions = models.PositiveIntegerField(
        help_text="Total number of questions in this test"
    )
    passing_score = models.PositiveIntegerField(
        default=70,
        help_text="Minimum percentage score to pass"
    )
    
    # Scoring configuration
    max_possible_score = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        help_text="Maximum possible score using difficulty coefficients",
        null=True,
        blank=True
    )
    
    # Test status and metadata
    is_active = models.BooleanField(default=True, db_index=True)
    version = models.CharField(
        max_length=10,
        default="1.0",
        help_text="Test version for tracking changes"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['test_type', 'title']
        indexes = [
            models.Index(fields=['test_type', 'is_active']),
            models.Index(fields=['is_active', 'created_at']),
        ]
        constraints = [
            models.CheckConstraint(
                check=models.Q(total_questions__gt=0),
                name='positive_total_questions'
            ),
            models.CheckConstraint(
                check=models.Q(duration_minutes__gt=0),
                name='positive_duration'
            ),
            models.CheckConstraint(
                check=models.Q(passing_score__gte=0, passing_score__lte=100),
                name='valid_passing_score'
            ),
        ]
    
    def __str__(self):
        return f"{self.title} ({self.test_type})"
    
    def calculate_max_score(self):
        """Calculate maximum possible score for this test"""
        from decimal import Decimal
        COEFFICIENTS = {'easy': Decimal('1.0'), 'medium': Decimal('1.5'), 'hard': Decimal('2.0')}
        
        total = Decimal('0.0')
        for question in self.questions.all():
            total += COEFFICIENTS.get(question.difficulty_level, Decimal('1.0'))
        
        return total


class Question(models.Model):
    """
    Individual question within a test.
    Optimized for scoring system with difficulty coefficients.
    """
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
        ('situational_judgment', 'Situational Judgment'),
    ]
    
    DIFFICULTY_CHOICES = [
        ('easy', 'Easy (Coefficient: 1.0)'),
        ('medium', 'Medium (Coefficient: 1.5)'),
        ('hard', 'Hard (Coefficient: 2.0)'),
    ]
    
    # Core question data
    test = models.ForeignKey(Test, on_delete=models.CASCADE, related_name='questions')
    question_type = models.CharField(max_length=50, choices=QUESTION_TYPES, db_index=True)
    question_text = models.TextField()
    passage = models.TextField(blank=True, null=True)  # For reading comprehension
    context = models.TextField(blank=True, null=True)  # Additional context if needed
    
    # Answer options and scoring
    options = models.JSONField(help_text="Store options as JSON array")
    correct_answer = models.CharField(
        max_length=10,
        help_text="Correct answer (A, B, C, D, etc.)",
        db_index=True
    )
    explanation = models.TextField(blank=True, null=True)
    
    # Scoring configuration (CRITICAL for backend scoring)
    difficulty_level = models.CharField(
        max_length=20,
        choices=DIFFICULTY_CHOICES,
        default='medium',
        db_index=True,
        help_text="Determines scoring coefficient: Easy=1.0, Medium=1.5, Hard=2.0"
    )
    
    # Question ordering and metadata
    order = models.PositiveIntegerField(
        help_text="Order of question within the test"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    # Visual Content Fields for Spatial Reasoning
    main_image = models.URLField(blank=True, null=True)
    option_images = models.JSONField(default=list, blank=True)
    sequence_images = models.JSONField(default=list, blank=True)
    
    # Image Economy Fields for Efficient Asset Management
    base_image_id = models.CharField(max_length=100, blank=True, null=True)
    overlay_ids = models.JSONField(default=list, blank=True)
    transforms = models.JSONField(default=dict, blank=True)
    option_remap = models.JSONField(default=dict, blank=True)
    
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
    complexity_score = models.PositiveIntegerField(
        default=1,
        help_text="1-5 visual complexity rating"
    )
    
    class Meta:
        ordering = ['test', 'order']
        indexes = [
            models.Index(fields=['test', 'order']),
            models.Index(fields=['test', 'difficulty_level']),
            models.Index(fields=['question_type', 'difficulty_level']),
        ]
        constraints = [
            models.UniqueConstraint(
                fields=['test', 'order'],
                name='unique_test_question_order'
            ),
            models.CheckConstraint(
                check=models.Q(order__gt=0),
                name='positive_question_order'
            ),
            models.CheckConstraint(
                check=models.Q(complexity_score__gte=1, complexity_score__lte=5),
                name='valid_complexity_score'
            ),
        ]
    
    def __str__(self):
        return f"Q{self.order}: {self.question_text[:50]}..."
    
    @property
    def scoring_coefficient(self):
        """Get the scoring coefficient for this question's difficulty"""
        coefficients = {'easy': 1.0, 'medium': 1.5, 'hard': 2.0}
        return coefficients.get(self.difficulty_level, 1.0)
    
    def check_answer(self, user_answer):
        """Check if the provided answer is correct"""
        return str(user_answer).upper() == str(self.correct_answer).upper()


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


class CodingChallenge(models.Model):
    DIFFICULTY_CHOICES = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
        ('expert', 'Expert'),
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
    
    LANGUAGE_CHOICES = [
        ('python', 'Python'),
        ('javascript', 'JavaScript'),
        ('java', 'Java'),
        ('cpp', 'C++'),
        ('csharp', 'C#'),
        ('go', 'Go'),
        ('rust', 'Rust'),
    ]
    
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    description = models.TextField()
    difficulty = models.CharField(max_length=20, choices=DIFFICULTY_CHOICES)
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES)
    language = models.CharField(max_length=20, choices=LANGUAGE_CHOICES)
    problem_statement = models.TextField()
    input_format = models.TextField(blank=True, null=True)
    output_format = models.TextField(blank=True, null=True)
    constraints = models.TextField(blank=True, null=True)
    starter_code = models.TextField(blank=True, null=True)
    solution_code = models.TextField(blank=True, null=True)
    test_cases = models.JSONField(default=list)
    max_points = models.IntegerField(default=100)
    time_limit_seconds = models.IntegerField(default=2)
    memory_limit_mb = models.IntegerField(default=128)
    tags = models.JSONField(default=list)
    estimated_time_minutes = models.IntegerField(default=30)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.title} ({self.difficulty})"
    
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
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    challenge = models.ForeignKey(CodingChallenge, on_delete=models.CASCADE)
    code = models.TextField()
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='pending')
    score = models.IntegerField(default=0)
    tests_passed = models.IntegerField(default=0)
    total_tests = models.IntegerField(default=0)
    execution_time_ms = models.IntegerField(default=0)
    memory_used_mb = models.FloatField(default=0.0)
    test_results = models.JSONField(default=list)
    error_message = models.TextField(blank=True, null=True)
    compilation_output = models.TextField(blank=True, null=True)
    submitted_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.user.username} - {self.challenge.title} ({self.status})"
    
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
    current_code = models.TextField(blank=True, null=True)
    start_time = models.DateTimeField(auto_now_add=True)
    last_activity = models.DateTimeField(auto_now=True)
    completion_time = models.DateTimeField(blank=True, null=True)
    best_submission = models.ForeignKey(
        CodingSubmission, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='best_for_session'
    )
    
    def __str__(self):
        return f"{self.user.username} - {self.challenge.title} ({self.status})"
    
    class Meta:
        unique_together = [('user', 'challenge')]
        ordering = ['-last_activity']


class TestAttempt(models.Model):
    """
    Unified test attempt tracking for all test types
    """
    ATTEMPT_RESULT = (
        ('completed', 'completed'),
        ('aborted', 'aborted'),
        ('timeout', 'timeout'),
    )

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='test_attempts')
    test_id = models.CharField(max_length=64, db_index=True)          # e.g. 'verbal','abstract'
    test_version = models.CharField(max_length=32, blank=True, null=True)
    language = models.CharField(max_length=8, default='en')

    total_questions = models.PositiveIntegerField()
    correct = models.PositiveIntegerField()
    percentage = models.PositiveIntegerField()
    raw_score = models.FloatField(default=0.0)                         # optional normalized score

    started_at = models.DateTimeField()
    finished_at = models.DateTimeField()
    duration_seconds = models.PositiveIntegerField()

    result = models.CharField(max_length=16, choices=ATTEMPT_RESULT, default='completed')
    result_label = models.CharField(max_length=32, blank=True, null=True)  # e.g. 'Pass', 'Level B'

    payload = models.JSONField(default=dict)  # answers, section breakdown, any metadata

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [models.Index(fields=['user','test_id','created_at'])]
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.test_id} ({self.percentage}%) - {self.result}"


# ============================================================================
# CLEAN POSTGRESQL MODELS FOR BACKEND-ONLY SCORING SYSTEM
# ============================================================================

class TestSubmission(models.Model):
    """
    Represents a user's submission of a complete test.
    This is the main entry point for scoring calculations.
    """
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='test_submissions',
        null=True,
        blank=True
    )
    test = models.ForeignKey(
        Test, 
        on_delete=models.CASCADE, 
        related_name='submissions'
    )
    
    # Submission metadata
    submitted_at = models.DateTimeField(auto_now_add=True)
    time_taken_seconds = models.PositiveIntegerField(
        help_text="Total time taken to complete the test"
    )
    is_complete = models.BooleanField(
        default=True,
        help_text="Whether all questions were answered"
    )
    
    # Raw data from frontend
    answers_data = models.JSONField(
        default=dict,
        help_text="Raw answers from frontend for backup/debugging"
    )
    
    # Scoring metadata
    scored_at = models.DateTimeField(
        null=True, 
        blank=True,
        help_text="When the submission was scored"
    )
    scoring_version = models.CharField(
        max_length=10,
        default="1.0",
        help_text="Version of scoring algorithm used"
    )
    
    class Meta:
        ordering = ['-submitted_at']
        indexes = [
            models.Index(fields=['user', 'test']),
            models.Index(fields=['submitted_at']),
            models.Index(fields=['test', 'submitted_at']),
        ]
        constraints = [
            models.UniqueConstraint(
                fields=['user', 'test'], 
                name='unique_user_test_submission'
            )
        ]
    
    def __str__(self):
        return f"{self.user.username} - {self.test.title} ({self.submitted_at.strftime('%Y-%m-%d %H:%M')})"


class Answer(models.Model):
    """
    Individual answer to a specific question within a test submission.
    Each answer is scored based on the difficulty coefficient.
    """
    submission = models.ForeignKey(
        TestSubmission,
        on_delete=models.CASCADE,
        related_name='answers'
    )
    question = models.ForeignKey(
        Question,
        on_delete=models.CASCADE,
        related_name='user_answers'
    )
    
    # Answer data
    selected_answer = models.CharField(
        max_length=10,
        help_text="User's selected answer (A, B, C, D, etc.)"
    )
    is_correct = models.BooleanField(
        help_text="Whether the answer is correct"
    )
    
    # Timing data
    time_taken_seconds = models.PositiveIntegerField(
        default=0,
        help_text="Time taken to answer this specific question"
    )
    answered_at = models.DateTimeField(auto_now_add=True)
    
    # Scoring data
    points_awarded = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0.0,
        help_text="Points awarded based on difficulty coefficient"
    )
    
    class Meta:
        ordering = ['question__order']
        indexes = [
            models.Index(fields=['submission', 'is_correct']),
            models.Index(fields=['question', 'is_correct']),
        ]
        constraints = [
            models.UniqueConstraint(
                fields=['submission', 'question'],
                name='unique_submission_question_answer'
            )
        ]
    
    def __str__(self):
        return f"{self.submission.user.username} - Q{self.question.order}: {self.selected_answer}"


class Score(models.Model):
    """
    Calculated score for a test submission with detailed breakdown.
    This is the single source of truth for all scoring data.
    """
    submission = models.OneToOneField(
        TestSubmission,
        on_delete=models.CASCADE,
        related_name='score'
    )
    
    # Overall scores
    raw_score = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        help_text="Total points earned using difficulty coefficients"
    )
    max_possible_score = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        help_text="Maximum possible points for this test"
    )
    percentage_score = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        help_text="Percentage score (0-100)"
    )
    
    # Question breakdown
    correct_answers = models.PositiveIntegerField(
        help_text="Number of correct answers"
    )
    total_questions = models.PositiveIntegerField(
        help_text="Total number of questions"
    )
    
    # Difficulty breakdown
    easy_correct = models.PositiveIntegerField(default=0)
    medium_correct = models.PositiveIntegerField(default=0)
    hard_correct = models.PositiveIntegerField(default=0)
    
    easy_score = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        default=0.0,
        help_text="Score from easy questions (coefficient 1.0)"
    )
    medium_score = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        default=0.0,
        help_text="Score from medium questions (coefficient 1.5)"
    )
    hard_score = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        default=0.0,
        help_text="Score from hard questions (coefficient 2.0)"
    )
    
    # Performance metrics
    average_time_per_question = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        help_text="Average time per question in seconds"
    )
    fastest_question_time = models.PositiveIntegerField(
        help_text="Fastest question time in seconds"
    )
    slowest_question_time = models.PositiveIntegerField(
        help_text="Slowest question time in seconds"
    )
    
    # Scoring metadata
    scoring_algorithm = models.CharField(
        max_length=50,
        default="difficulty_weighted",
        help_text="Algorithm used for scoring"
    )
    calculated_at = models.DateTimeField(auto_now_add=True)
    
    # Additional data for future enhancements
    metadata = models.JSONField(
        default=dict,
        blank=True,
        help_text="Additional scoring data and metrics"
    )
    
    class Meta:
        ordering = ['-calculated_at']
        indexes = [
            models.Index(fields=['submission', 'percentage_score']),
            models.Index(fields=['calculated_at']),
        ]
    
    def __str__(self):
        return f"{self.submission.user.username} - {self.submission.test.title}: {self.percentage_score}%"
    
    @property
    def grade_letter(self):
        """Calculate letter grade based on percentage"""
        if self.percentage_score >= 90:
            return 'A'
        elif self.percentage_score >= 80:
            return 'B'
        elif self.percentage_score >= 70:
            return 'C'
        elif self.percentage_score >= 60:
            return 'D'
        else:
            return 'F'
    
    @property
    def passed(self):
        """Check if the user passed based on test's passing score"""
        return self.percentage_score >= self.submission.test.passing_score
