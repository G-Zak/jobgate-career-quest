from rest_framework import serializers
from .models import Skill, CandidateProfile, TechnicalTest, TestQuestion, TestResult

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['id', 'name', 'category', 'description', 'created_at']

class TestQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestQuestion
        fields = ['id', 'order', 'question_text', 'option_a', 'option_b', 'option_c', 'option_d', 'correct_answer', 'points', 'explanation']

class TechnicalTestSerializer(serializers.ModelSerializer):
    questions = TestQuestionSerializer(source='testquestion_set', many=True, read_only=True)
    question_count = serializers.ReadOnlyField()
    skill_name = serializers.CharField(source='skill.name', read_only=True)
    
    class Meta:
        model = TechnicalTest
        fields = ['id', 'test_name', 'skill', 'skill_name', 'description', 'instructions', 'total_score', 'time_limit', 'is_active', 'question_count', 'questions', 'created_at']

class CandidateProfileSerializer(serializers.ModelSerializer):
    skills = SkillSerializer(many=True, read_only=True)
    full_name = serializers.ReadOnlyField()
    
    class Meta:
        model = CandidateProfile
        fields = ['id', 'user', 'first_name', 'last_name', 'full_name', 'email', 'phone', 'skills', 'created_at']

class TestResultSerializer(serializers.ModelSerializer):
    percentage = serializers.ReadOnlyField()
    candidate_name = serializers.CharField(source='candidate.full_name', read_only=True)
    test_name = serializers.CharField(source='test.test_name', read_only=True)
    
    class Meta:
        model = TestResult
        fields = ['id', 'candidate', 'candidate_name', 'test', 'test_name', 'score', 'percentage', 'answers_data', 'time_taken', 'status', 'started_at', 'completed_at']
