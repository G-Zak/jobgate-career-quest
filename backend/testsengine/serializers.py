from rest_framework import serializers
from .models import Test, Question, TestSession, TestAnswer

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = [
            'id', 'question_type', 'question_text', 'passage', 'context', 
            'options', 'difficulty_level', 'order',
            # Visual content fields
            'main_image', 'option_images', 'sequence_images',
            # Image economy fields  
            'base_image_id', 'overlay_ids', 'transforms', 'option_remap',
            # Visual metadata
            'visual_style', 'complexity_score'
        ]

class SpatialQuestionSerializer(serializers.ModelSerializer):
    """Enhanced serializer for spatial reasoning questions with full visual data"""
    
    class Meta:
        model = Question
        fields = [
            'id', 'question_type', 'question_text', 'context',
            'options', 'difficulty_level', 'order',
            # Visual content fields
            'main_image', 'option_images', 'sequence_images',
            # Image economy fields for dynamic rendering
            'base_image_id', 'overlay_ids', 'transforms', 'option_remap',
            # Visual metadata
            'visual_style', 'complexity_score'
        ]

class TestSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)
    
    class Meta:
        model = Test
        fields = ['id', 'title', 'test_type', 'description', 'duration_minutes', 'total_questions', 'passing_score', 'questions']

class TestSessionSerializer(serializers.ModelSerializer):
    test_title = serializers.CharField(source='test.title', read_only=True)
    
    class Meta:
        model = TestSession
        fields = ['id', 'test', 'test_title', 'status', 'start_time', 'end_time', 'current_question', 'score', 'time_spent']
        read_only_fields = ['start_time', 'end_time', 'score']

class TestAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestAnswer
        fields = ['question', 'selected_answer', 'time_taken']

class SubmitAnswerSerializer(serializers.Serializer):
    question_id = serializers.IntegerField()
    selected_answer = serializers.CharField(max_length=10)
    time_taken = serializers.IntegerField(default=0)
