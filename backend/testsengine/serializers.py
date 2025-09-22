"""
DRF Serializers for the testsengine app
These serializers implement the backend-only scoring architecture by:
- Exposing questions WITHOUT correct answers to frontend
- Providing detailed scoring results for display
- Maintaining secure data flow
"""

from rest_framework import serializers
from decimal import Decimal
from .models import (
    Test, Question, TestSubmission, Answer, Score, 
    TestSession, TestAnswer, CodingChallenge, CodingSubmission, 
    CodingSession, TestAttempt
)
from .services.scoring_service import ScoringService


class QuestionForTestSerializer(serializers.ModelSerializer):
    """
    Serializer for questions displayed to users taking a test.
    CRITICAL: Does NOT include correct_answer to maintain backend-only scoring.
    """
    
    class Meta:
        model = Question
        fields = [
            'id',
            'question_type', 
            'question_text',
            'passage',
            'context',
            'options',
            'order',
            'difficulty_level',  # Shown for transparency
            'main_image',
            'option_images',
            'visual_style'
        ]
        # Explicitly exclude correct_answer and complexity_score
        
    def to_representation(self, instance):
        """Customize the representation to ensure security"""
        data = super().to_representation(instance)
        
        # Ensure no sensitive data leaks through
        sensitive_fields = ['correct_answer', 'complexity_score']
        for field in sensitive_fields:
            data.pop(field, None)
            
        # Add coefficient for transparency (frontend can show difficulty weighting)
        data['scoring_coefficient'] = instance.scoring_coefficient
        
        # For SJT tests (test_id = 4), include QuestionOption data instead of JSON options
        if instance.test_id == 4:
            try:
                from .question_option_model import QuestionOption
                question_options = QuestionOption.objects.filter(question=instance).order_by('option_letter')
                if question_options.exists():
                    # Replace the JSON options with QuestionOption data
                    data['options'] = [
                        {
                            'option_id': opt.option_letter,
                            'text': opt.option_text,
                            'value': opt.option_letter,
                            'score_value': opt.score_value
                        }
                        for opt in question_options
                    ]
            except ImportError:
                # Fallback to JSON options if QuestionOption model not available
                pass
        
        return data


class TestDetailSerializer(serializers.ModelSerializer):
    """
    Serializer for test metadata and configuration.
    Used when fetching test details before starting.
    """
    questions = QuestionForTestSerializer(many=True, read_only=True)
    max_possible_score = serializers.SerializerMethodField()
    difficulty_distribution = serializers.SerializerMethodField()
    
    class Meta:
        model = Test
        fields = [
            'id',
            'title',
            'test_type',
            'description', 
            'duration_minutes',
            'total_questions',
            'passing_score',
            'is_active',
            'created_at',
            'version',
            'max_possible_score',
            'difficulty_distribution',
            'questions'
        ]
        
    def get_max_possible_score(self, obj):
        """Calculate maximum possible score for this test"""
        return float(obj.calculate_max_score())
        
    def get_difficulty_distribution(self, obj):
        """Get distribution of questions by difficulty"""
        questions = obj.questions.all()
        distribution = {
            'easy': questions.filter(difficulty_level='easy').count(),
            'medium': questions.filter(difficulty_level='medium').count(), 
            'hard': questions.filter(difficulty_level='hard').count(),
            'total': questions.count()
        }
        
        # Add coefficients for transparency
        distribution['coefficients'] = {
            'easy': 1.0,
            'medium': 1.5,
            'hard': 2.0
        }
        
        return distribution


class TestListSerializer(serializers.ModelSerializer):
    """
    Serializer for listing available tests.
    Shows basic info without questions.
    """
    max_possible_score = serializers.SerializerMethodField()
    question_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Test
        fields = [
            'id',
            'title',
            'test_type',
            'description',
            'duration_minutes',
            'total_questions',
            'passing_score',
            'is_active',
            'created_at',
            'max_possible_score',
            'question_count'
        ]
        
    def get_max_possible_score(self, obj):
        return float(obj.calculate_max_score())
        
    def get_question_count(self, obj):
        return obj.questions.count()


class SubmissionInputSerializer(serializers.Serializer):
    """
    Enhanced serializer for validating user answer submissions.
    Used when users submit their answers for scoring.
    """
    answers = serializers.DictField(
        child=serializers.CharField(max_length=10),
        help_text="Dictionary mapping question_id -> selected_answer (e.g., {'1': 'A', '2': 'B'})"
    )
    time_taken_seconds = serializers.IntegerField(
        min_value=1,
        help_text="Total time taken to complete the test in seconds"
    )
    submission_metadata = serializers.DictField(
        required=False,
        help_text="Optional metadata about the submission (browser, device, etc.)"
    )
    
    def validate_answers(self, value):
        """Validate that answers are in correct format"""
        if not value:
            raise serializers.ValidationError("At least one answer must be provided")
            
        # Validate answer format (should be A, B, C, D, etc.)
        valid_answers = ['A', 'B', 'C', 'D', 'E', 'F']
        for question_id, answer in value.items():
            if not question_id.isdigit():
                raise serializers.ValidationError(f"Question ID '{question_id}' must be a number")
            if answer.upper() not in valid_answers:
                raise serializers.ValidationError(f"Answer '{answer}' must be one of: {valid_answers}")
                
        return value
        
    def validate_time_taken_seconds(self, value):
        """Validate time taken is reasonable"""
        if value > 3600:  # 60 minutes maximum
            raise serializers.ValidationError("Time taken exceeds maximum allowed duration (60 minutes)")
        if value < 10:  # Less than 10 seconds
            raise serializers.ValidationError("Time taken is unrealistically short")
        return value
    
    def validate_submission_metadata(self, value):
        """Validate submission metadata"""
        if value:
            # Ensure metadata doesn't contain sensitive information
            allowed_keys = ['browser', 'device', 'session_id', 'user_agent', 'screen_resolution', 'timezone']
            for key in value.keys():
                if key not in allowed_keys:
                    raise serializers.ValidationError(f"Metadata key '{key}' is not allowed")
                    
            # Validate values are strings and reasonable length
            for key, val in value.items():
                if not isinstance(val, str) or len(val) > 200:
                    raise serializers.ValidationError(f"Metadata value for '{key}' must be a string under 200 characters")
        
        return value


class AnswerDetailSerializer(serializers.ModelSerializer):
    """
    Serializer for individual answer details in scoring results.
    Shows the user's answer and whether it was correct.
    """
    question_text = serializers.CharField(source='question.question_text', read_only=True)
    question_order = serializers.IntegerField(source='question.order', read_only=True)
    difficulty_level = serializers.CharField(source='question.difficulty_level', read_only=True)
    correct_answer = serializers.CharField(source='question.correct_answer', read_only=True)
    scoring_coefficient = serializers.FloatField(source='question.scoring_coefficient', read_only=True)
    
    class Meta:
        model = Answer
        fields = [
            'question_order',
            'question_text',
            'selected_answer',
            'correct_answer',  # NOW revealed after submission
            'is_correct',
            'points_awarded',
            'difficulty_level',
            'scoring_coefficient',
            'time_taken_seconds',
            'answered_at'
        ]


class ScoreDetailSerializer(serializers.ModelSerializer):
    """
    Serializer for comprehensive score details.
    Provides all scoring information after test completion.
    """
    answers = AnswerDetailSerializer(source='submission.answers', many=True, read_only=True)
    test_title = serializers.CharField(source='submission.test.title', read_only=True)
    test_type = serializers.CharField(source='submission.test.test_type', read_only=True)
    user_username = serializers.CharField(source='submission.user.username', read_only=True)
    
    class Meta:
        model = Score
        fields = [
            'id',
            'raw_score',
            'max_possible_score', 
            'percentage_score',
            'correct_answers',
            'total_questions',
            
            # Difficulty breakdown
            'easy_correct',
            'medium_correct', 
            'hard_correct',
            'easy_score',
            'medium_score',
            'hard_score',
            
            # Performance metrics
            'average_time_per_question',
            'fastest_question_time',
            'slowest_question_time',
            
            # Metadata
            'scoring_algorithm',
            'calculated_at',
            'metadata',
            
            # Related data
            'test_title',
            'test_type',
            'user_username',
            'answers'
        ]
        
    def to_representation(self, instance):
        """Add computed fields to the representation"""
        data = super().to_representation(instance)
        
        # Add computed properties
        data['grade_letter'] = instance.grade_letter
        data['passed'] = instance.passed
        
        # Add summary statistics
        data['summary'] = {
            'overall_performance': f"{data['percentage_score']}% ({data['grade_letter']})",
            'status': 'PASSED' if data['passed'] else 'FAILED',
            'time_efficiency': f"{data['average_time_per_question']}s per question",
            'difficulty_strengths': self._get_difficulty_strengths(instance),
            'recommendations': self._get_recommendations(instance)
        }
        
        return data
        
    def _get_difficulty_strengths(self, score):
        """Analyze performance by difficulty level"""
        easy_pct = (score.easy_correct / 3 * 100) if score.easy_correct else 0
        medium_pct = (score.medium_correct / 3 * 100) if score.medium_correct else 0  
        hard_pct = (score.hard_correct / 3 * 100) if score.hard_correct else 0
        
        strengths = []
        if easy_pct >= 80:
            strengths.append('Easy questions')
        if medium_pct >= 80:
            strengths.append('Medium questions')
        if hard_pct >= 80:
            strengths.append('Hard questions')
            
        return strengths if strengths else ['None identified']
        
    def _get_recommendations(self, score):
        """Generate improvement recommendations"""
        recommendations = []
        
        if score.percentage_score < 70:
            recommendations.append('Review fundamental concepts')
        if score.hard_correct == 0:
            recommendations.append('Practice advanced problem-solving')
        if score.average_time_per_question > 120:  # 2 minutes
            recommendations.append('Improve time management')
        if score.easy_correct < 3:
            recommendations.append('Review basic concepts')
            
        return recommendations if recommendations else ['Great job! Keep practicing']


class TestSubmissionSerializer(serializers.ModelSerializer):
    """
    Serializer for test submission metadata.
    Shows submission info without detailed scoring.
    """
    score = ScoreDetailSerializer(read_only=True)
    test_title = serializers.CharField(source='test.title', read_only=True)
    user_username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = TestSubmission
        fields = [
            'id',
            'submitted_at',
            'time_taken_seconds',
            'is_complete',
            'scored_at',
            'scoring_version',
            'test_title',
            'user_username',
            'score'
        ]


# Admin/Management Serializers (with sensitive data for admin use)

class QuestionAdminSerializer(serializers.ModelSerializer):
    """
    Full question serializer for admin interface.
    Includes correct answers and all sensitive data.
    """
    scoring_coefficient = serializers.FloatField(read_only=True)
    
    class Meta:
        model = Question
        fields = '__all__'


class TestAdminSerializer(serializers.ModelSerializer):
    """
    Full test serializer for admin interface.
    """
    questions = QuestionAdminSerializer(many=True, read_only=True)
    max_possible_score = serializers.SerializerMethodField()
    
    class Meta:
        model = Test
        fields = '__all__'
        
    def get_max_possible_score(self, obj):
        return float(obj.calculate_max_score())


# Utility Serializers

class DifficultyDistributionSerializer(serializers.Serializer):
    """
    Serializer for difficulty distribution analysis.
    """
    easy_count = serializers.IntegerField()
    medium_count = serializers.IntegerField()
    hard_count = serializers.IntegerField()
    total_count = serializers.IntegerField()
    easy_percentage = serializers.FloatField()
    medium_percentage = serializers.FloatField()
    hard_percentage = serializers.FloatField()
    is_balanced = serializers.BooleanField()
    recommendations = serializers.ListField(child=serializers.CharField())


class ScoringConfigSerializer(serializers.Serializer):
    """
    Serializer for scoring configuration display.
    """
    difficulty_coefficients = serializers.DictField()
    test_duration_minutes = serializers.IntegerField()
    scoring_version = serializers.CharField()
    grade_thresholds = serializers.DictField()
    passing_score_default = serializers.IntegerField()


# ===============================================================================
# COMPREHENSIVE MODEL SERIALIZERS - Complete coverage for all testsengine models
# ===============================================================================

class TestSessionSerializer(serializers.ModelSerializer):
    """
    Serializer for TestSession model - tracks user test sessions
    """
    user_username = serializers.CharField(source='user.username', read_only=True)
    test_title = serializers.CharField(source='test.title', read_only=True)
    
    class Meta:
        model = TestSession
        fields = [
            'id',
            'user',
            'user_username',
            'test',
            'test_title',
            'started_at',
            'ended_at',
            'is_completed',
            'session_data'
        ]
        read_only_fields = ['started_at']


class TestAnswerSerializer(serializers.ModelSerializer):
    """
    Serializer for TestAnswer model - individual test answers
    """
    question_text = serializers.CharField(source='question.question_text', read_only=True)
    question_order = serializers.IntegerField(source='question.order', read_only=True)
    
    class Meta:
        model = TestAnswer
        fields = [
            'id',
            'question',
            'question_text',
            'question_order',
            'selected_answer',
            'answered_at'
        ]
        read_only_fields = ['answered_at']


class CodingChallengeSerializer(serializers.ModelSerializer):
    """
    Serializer for CodingChallenge model - coding test challenges
    """
    test_cases_count = serializers.SerializerMethodField()
    difficulty_rating = serializers.SerializerMethodField()
    
    class Meta:
        model = CodingChallenge
        fields = [
            'id',
            'title',
            'slug',
            'description',
            'difficulty',
            'category',
            'language',
            'problem_statement',
            'input_format',
            'output_format',
            'constraints',
            'starter_code',
            'solution_code',
            'test_cases',
            'max_points',
            'time_limit_seconds',
            'memory_limit_mb',
            'tags',
            'estimated_time_minutes',
            'is_active',
            'created_at',
            'updated_at',
            'test_cases_count',
            'difficulty_rating'
        ]
        read_only_fields = ['created_at', 'updated_at']
    
    def get_test_cases_count(self, obj):
        """Get number of test cases"""
        return len(obj.test_cases) if obj.test_cases else 0
    
    def get_difficulty_rating(self, obj):
        """Get difficulty rating"""
        difficulty_map = {'beginner': 1, 'intermediate': 2, 'advanced': 3, 'expert': 4}
        return difficulty_map.get(obj.difficulty, 2)


class CodingChallengeListSerializer(serializers.ModelSerializer):
    """
    Simplified serializer for listing coding challenges
    """
    test_cases_count = serializers.SerializerMethodField()
    
    class Meta:
        model = CodingChallenge
        fields = [
            'id',
            'title',
            'slug',
            'difficulty',
            'category',
            'language',
            'time_limit_seconds',
            'max_points',
            'estimated_time_minutes',
            'is_active',
            'created_at',
            'test_cases_count'
        ]
    
    def get_test_cases_count(self, obj):
        return len(obj.test_cases) if obj.test_cases else 0


class CodingSubmissionSerializer(serializers.ModelSerializer):
    """
    Serializer for CodingSubmission model - coding challenge submissions
    """
    user_username = serializers.CharField(source='user.username', read_only=True)
    challenge_title = serializers.CharField(source='challenge.title', read_only=True)
    success_rate = serializers.SerializerMethodField()
    
    class Meta:
        model = CodingSubmission
        fields = [
            'id',
            'user',
            'user_username',
            'challenge',
            'challenge_title',
            'code',
            'status',
            'score',
            'tests_passed',
            'total_tests',
            'execution_time_ms',
            'memory_used_mb',
            'test_results',
            'error_message',
            'compilation_output',
            'submitted_at',
            'success_rate'
        ]
        read_only_fields = ['submitted_at']
    
    def get_success_rate(self, obj):
        """Calculate success rate from test results"""
        if obj.total_tests > 0:
            return round((obj.tests_passed / obj.total_tests * 100), 2)
        return 0.0


class CodingSubmissionCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating coding submissions
    """
    class Meta:
        model = CodingSubmission
        fields = [
            'challenge',
            'code'
        ]
    
    def validate_code(self, value):
        """Validate code submission"""
        if not value or not value.strip():
            raise serializers.ValidationError("Code cannot be empty")
        
        if len(value) > 50000:  # 50KB limit
            raise serializers.ValidationError("Code exceeds maximum length (50KB)")
        
        return value


class CodingSessionSerializer(serializers.ModelSerializer):
    """
    Serializer for CodingSession model - coding test sessions
    """
    user_username = serializers.CharField(source='user.username', read_only=True)
    challenge_title = serializers.CharField(source='challenge.title', read_only=True)
    duration_minutes = serializers.SerializerMethodField()
    
    class Meta:
        model = CodingSession
        fields = [
            'id',
            'user',
            'user_username',
            'challenge',
            'challenge_title',
            'started_at',
            'ended_at',
            'is_completed',
            'session_data',
            'duration_minutes'
        ]
        read_only_fields = ['started_at']
    
    def get_duration_minutes(self, obj):
        """Calculate session duration in minutes"""
        if obj.started_at and obj.ended_at:
            duration = obj.ended_at - obj.started_at
            return round(duration.total_seconds() / 60, 2)
        return None


class TestAttemptSerializer(serializers.ModelSerializer):
    """
    Serializer for TestAttempt model - test attempt tracking
    """
    user_username = serializers.CharField(source='user.username', read_only=True)
    test_title = serializers.CharField(source='test.title', read_only=True)
    completion_percentage = serializers.SerializerMethodField()
    
    class Meta:
        model = TestAttempt
        fields = [
            'id',
            'user',
            'user_username',
            'test',
            'test_title',
            'started_at',
            'last_activity_at',
            'questions_answered',
            'total_questions',
            'current_question_index',
            'time_spent_minutes',
            'is_paused',
            'is_completed',
            'completion_percentage',
            'attempt_data'
        ]
        read_only_fields = ['started_at', 'last_activity_at']
    
    def get_completion_percentage(self, obj):
        """Calculate completion percentage"""
        if obj.total_questions > 0:
            return round((obj.questions_answered / obj.total_questions * 100), 2)
        return 0.0


class TestAttemptCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating test attempts
    """
    class Meta:
        model = TestAttempt
        fields = [
            'test'
        ]
    
    def validate_test(self, value):
        """Validate test is active and available"""
        if not value.is_active:
            raise serializers.ValidationError("Test is not currently active")
        return value


# ===============================================================================
# UTILITY AND AGGREGATE SERIALIZERS
# ===============================================================================

class UserTestProgressSerializer(serializers.Serializer):
    """
    Serializer for user's overall test progress
    """
    user_id = serializers.IntegerField()
    username = serializers.CharField()
    tests_attempted = serializers.IntegerField()
    tests_completed = serializers.IntegerField()
    average_score = serializers.FloatField()
    best_score = serializers.FloatField()
    total_time_spent = serializers.IntegerField()  # in minutes
    coding_challenges_attempted = serializers.IntegerField()
    coding_challenges_completed = serializers.IntegerField()
    last_activity = serializers.DateTimeField()


class TestStatisticsSerializer(serializers.Serializer):
    """
    Serializer for test statistics
    """
    test_id = serializers.IntegerField()
    test_title = serializers.CharField()
    total_attempts = serializers.IntegerField()
    completed_attempts = serializers.IntegerField()
    average_score = serializers.FloatField()
    pass_rate = serializers.FloatField()
    average_completion_time = serializers.FloatField()  # in minutes
    difficulty_breakdown = serializers.DictField()
    top_performers = serializers.ListField()


class CodingChallengeStatisticsSerializer(serializers.Serializer):
    """
    Serializer for coding challenge statistics
    """
    challenge_id = serializers.IntegerField()
    challenge_title = serializers.CharField()
    total_submissions = serializers.IntegerField()
    successful_submissions = serializers.IntegerField()
    success_rate = serializers.FloatField()
    average_execution_time = serializers.FloatField()
    most_used_language = serializers.CharField()
    language_distribution = serializers.DictField()


# ===============================================================================
# NESTED AND DETAILED SERIALIZERS
# ===============================================================================

class TestWithAttemptsSerializer(serializers.ModelSerializer):
    """
    Test serializer with related attempts
    """
    attempts = TestAttemptSerializer(many=True, read_only=True, source='testattempt_set')
    submissions = TestSubmissionSerializer(many=True, read_only=True, source='submissions')
    question_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Test
        fields = [
            'id',
            'title',
            'test_type',
            'description',
            'duration_minutes',
            'total_questions',
            'passing_score',
            'is_active',
            'created_at',
            'question_count',
            'attempts',
            'submissions'
        ]
    
    def get_question_count(self, obj):
        return obj.questions.count()


class UserCodingProfileSerializer(serializers.Serializer):
    """
    Complete coding profile for a user
    """
    user_id = serializers.IntegerField()
    username = serializers.CharField()
    coding_sessions = CodingSessionSerializer(many=True)
    coding_submissions = CodingSubmissionSerializer(many=True)
    favorite_languages = serializers.ListField()
    skill_levels = serializers.DictField()
    total_coding_time = serializers.IntegerField()  # in minutes
    challenges_solved = serializers.IntegerField()
    current_streak = serializers.IntegerField()
    best_streak = serializers.IntegerField()


# ===============================================================================
# EXPORT AND REPORTING SERIALIZERS
# ===============================================================================

class TestResultsExportSerializer(serializers.Serializer):
    """
    Serializer for exporting test results
    """
    test_info = TestDetailSerializer()
    submissions = TestSubmissionSerializer(many=True)
    summary_statistics = TestStatisticsSerializer()
    generated_at = serializers.DateTimeField()
    export_format = serializers.CharField()


class UserReportSerializer(serializers.Serializer):
    """
    Comprehensive user report serializer
    """
    user_info = serializers.DictField()
    test_progress = UserTestProgressSerializer()
    coding_profile = UserCodingProfileSerializer()
    recent_activity = serializers.ListField()
    achievements = serializers.ListField()
    recommendations = serializers.ListField()
    report_generated_at = serializers.DateTimeField()