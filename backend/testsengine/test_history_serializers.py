"""
Test History Serializers
Handles serialization for test history and session data
"""

from rest_framework import serializers
from .models import TestSession, TestAnswer, Test, User
from django.utils import timezone


class TestAnswerHistorySerializer(serializers.ModelSerializer):
    """Serializer for individual test answers in history"""
    question_text = serializers.CharField(source='question.question_text', read_only=True)
    question_order = serializers.IntegerField(source='question.order', read_only=True)
    correct_answer = serializers.CharField(source='question.correct_answer', read_only=True)
    difficulty_level = serializers.CharField(source='question.difficulty_level', read_only=True)
    
    class Meta:
        model = TestAnswer
        fields = [
            'id',
            'question_text',
            'question_order',
            'selected_answer',
            'correct_answer',
            'is_correct',
            'time_taken',
            'answered_at',
            'difficulty_level'
        ]


class TestSessionHistorySerializer(serializers.ModelSerializer):
    """Serializer for test session history"""
    test_title = serializers.CharField(source='test.title', read_only=True)
    test_type = serializers.CharField(source='test.test_type', read_only=True)
    user_username = serializers.CharField(source='user.username', read_only=True)
    duration_minutes = serializers.SerializerMethodField()
    answers = TestAnswerHistorySerializer(source='test_answers', many=True, read_only=True)
    score_percentage = serializers.SerializerMethodField()
    passed = serializers.SerializerMethodField()
    
    class Meta:
        model = TestSession
        fields = [
            'id',
            'user_username',
            'test_title',
            'test_type',
            'status',
            'start_time',
            'end_time',
            'duration_minutes',
            'score',
            'score_percentage',
            'passed',
            'time_spent',
            'answers'
        ]
    
    def get_duration_minutes(self, obj):
        """Calculate duration in minutes"""
        if obj.start_time and obj.end_time:
            duration = obj.end_time - obj.start_time
            return round(duration.total_seconds() / 60, 2)
        return None
    
    def get_score_percentage(self, obj):
        """Get score as percentage"""
        return obj.score if obj.score is not None else 0
    
    def get_passed(self, obj):
        """Check if test was passed"""
        if obj.score is not None and obj.test.passing_score is not None:
            return obj.score >= obj.test.passing_score
        return False


class TestSessionCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating new test sessions"""
    
    class Meta:
        model = TestSession
        fields = ['test', 'status']
        read_only_fields = ['user']
    
    def create(self, validated_data):
        """Create test session with current user"""
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class TestSessionUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating test sessions (submitting answers)"""
    
    class Meta:
        model = TestSession
        fields = ['status', 'score', 'answers', 'time_spent', 'end_time']
    
    def update(self, instance, validated_data):
        """Update session and mark as completed"""
        if validated_data.get('status') == 'completed':
            validated_data['end_time'] = timezone.now()
        return super().update(instance, validated_data)


class TestHistorySummarySerializer(serializers.Serializer):
    """Serializer for test history summary statistics"""
    total_sessions = serializers.IntegerField()
    completed_sessions = serializers.IntegerField()
    average_score = serializers.FloatField()
    best_score = serializers.FloatField()
    total_time_spent = serializers.IntegerField()  # in minutes
    tests_taken = serializers.ListField()
    recent_sessions = TestSessionHistorySerializer(many=True)


class TestCategoryStatsSerializer(serializers.Serializer):
    """Serializer for test category statistics"""
    test_type = serializers.CharField()
    count = serializers.IntegerField()
    average_score = serializers.FloatField()
    best_score = serializers.FloatField()
    last_taken = serializers.DateTimeField()


class TestHistoryChartSerializer(serializers.Serializer):
    """Serializer for chart data"""
    labels = serializers.ListField()  # Dates or test names
    scores = serializers.ListField()  # Score values
    categories = serializers.ListField()  # Test categories
    time_spent = serializers.ListField()  # Time spent values
