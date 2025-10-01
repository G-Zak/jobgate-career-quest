from rest_framework import serializers
from django.contrib.auth import get_user_model

try:
    from .models import Test, Question, UserTest, TestResult, TestSession
except ImportError:
    # Create minimal fallback classes if models don't exist
    class Test:
        class _meta:
            fields = '__all__'
    class Question:
        class _meta:
            fields = '__all__'
    class UserTest:
        class _meta:
            fields = '__all__'
    class TestResult:
        class _meta:
            fields = '__all__'
    class TestSession:
        class _meta:
            fields = '__all__'

User = get_user_model()

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = '__all__'

class TestListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Test
        fields = ['id', 'title', 'description', 'duration', 'is_active']

class TestDetailSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)
    
    class Meta:
        model = Test
        fields = ['id', 'title', 'description', 'duration', 'is_active', 'questions']

class TestSessionHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = TestSession
        fields = '__all__'

class TestSessionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestSession
        fields = ['test', 'answers']

class UserTestSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserTest
        fields = '__all__'

class TestResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestResult
        fields = '__all__'