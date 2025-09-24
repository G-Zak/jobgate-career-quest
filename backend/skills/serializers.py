"""
Serializers for Skills Testing System
"""

from rest_framework import serializers
from .models import (
    Skill, CandidateProfile, TechnicalTest, TestQuestion, TestResult
)


class SkillSerializer(serializers.ModelSerializer):
    """Serializer for Skill model"""
    
    class Meta:
        model = Skill
        fields = ['id', 'name', 'category', 'description', 'created_at']




# ============================================================================
# EXISTING SERIALIZERS (for backward compatibility)
# ============================================================================

class CandidateProfileSerializer(serializers.ModelSerializer):
    """Serializer for CandidateProfile model"""
    skills = SkillSerializer(many=True, read_only=True)
    
    class Meta:
        model = CandidateProfile
        fields = [
            'id', 'user', 'first_name', 'last_name', 'email', 'phone',
            'photo', 'bio', 'location', 'linkedin', 'skills',
            'skills_with_proficiency', 'cv_file', 'created_at', 'updated_at'
        ]


class TechnicalTestSerializer(serializers.ModelSerializer):
    """Serializer for TechnicalTest model"""
    skill = SkillSerializer(read_only=True)
    skill_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = TechnicalTest
        fields = [
            'id', 'test_name', 'skill', 'skill_id', 'description',
            'instructions', 'total_score', 'time_limit', 'is_active',
            'json_data', 'created_at'
        ]


class TestQuestionSerializer(serializers.ModelSerializer):
    """Serializer for TestQuestion model"""
    
    class Meta:
        model = TestQuestion
        fields = [
            'id', 'test', 'order', 'question_text', 'option_a',
            'option_b', 'option_c', 'option_d', 'correct_answer',
            'points', 'explanation'
        ]


class TestResultSerializer(serializers.ModelSerializer):
    """Serializer for TestResult model"""
    candidate = CandidateProfileSerializer(read_only=True)
    test = TechnicalTestSerializer(read_only=True)
    
    class Meta:
        model = TestResult
        fields = [
            'id', 'candidate', 'test', 'score', 'answers_data',
            'time_taken', 'status', 'started_at', 'completed_at'
        ]