from rest_framework import serializers
from .models import Test, Question, TestSession, TestAnswer, CodingChallenge, CodingSubmission, CodingSession

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


# ======= CODING CHALLENGES SERIALIZERS =======

class CodingChallengeListSerializer(serializers.ModelSerializer):
    """Serializer for listing coding challenges (without solutions)"""
    
    class Meta:
        model = CodingChallenge
        fields = [
            'id', 'title', 'slug', 'description', 'difficulty', 'category', 
            'language', 'max_points', 'estimated_time_minutes', 'tags'
        ]

class CodingChallengeDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer for a specific coding challenge"""
    
    # Filter test cases to only show public ones
    public_test_cases = serializers.SerializerMethodField()
    
    class Meta:
        model = CodingChallenge
        fields = [
            'id', 'title', 'slug', 'description', 'difficulty', 'category',
            'language', 'problem_statement', 'input_format', 'output_format',
            'constraints', 'starter_code', 'max_points', 'time_limit_seconds',
            'memory_limit_mb', 'tags', 'estimated_time_minutes', 'public_test_cases'
        ]
    
    def get_public_test_cases(self, obj):
        """Return only public (non-hidden) test cases"""
        return [
            test_case for test_case in obj.test_cases 
            if not test_case.get('is_hidden', False)
        ]

class CodingSubmissionSerializer(serializers.ModelSerializer):
    challenge_title = serializers.CharField(source='challenge.title', read_only=True)
    
    class Meta:
        model = CodingSubmission
        fields = [
            'id', 'challenge', 'challenge_title', 'code', 'status', 'score',
            'tests_passed', 'total_tests', 'execution_time_ms', 'memory_used_mb',
            'error_message', 'submitted_at', 'success_rate'
        ]
        read_only_fields = [
            'status', 'score', 'tests_passed', 'total_tests', 'execution_time_ms',
            'memory_used_mb', 'error_message', 'submitted_at', 'success_rate'
        ]

class CodingSubmissionDetailSerializer(serializers.ModelSerializer):
    """Detailed submission serializer with test results"""
    challenge_title = serializers.CharField(source='challenge.title', read_only=True)
    
    class Meta:
        model = CodingSubmission
        fields = [
            'id', 'challenge', 'challenge_title', 'code', 'status', 'score',
            'tests_passed', 'total_tests', 'execution_time_ms', 'memory_used_mb',
            'test_results', 'error_message', 'compilation_output', 'submitted_at', 'success_rate'
        ]
        read_only_fields = [
            'status', 'score', 'tests_passed', 'total_tests', 'execution_time_ms',
            'memory_used_mb', 'test_results', 'error_message', 'compilation_output',
            'submitted_at', 'success_rate'
        ]

class CodingSessionSerializer(serializers.ModelSerializer):
    challenge_title = serializers.CharField(source='challenge.title', read_only=True)
    best_score = serializers.IntegerField(source='best_submission.score', read_only=True)
    
    class Meta:
        model = CodingSession
        fields = [
            'id', 'challenge', 'challenge_title', 'status', 'current_code',
            'start_time', 'last_activity', 'completion_time', 'time_spent_minutes',
            'best_submission', 'best_score'
        ]
        read_only_fields = [
            'start_time', 'last_activity', 'completion_time', 'time_spent_minutes'
        ]

class SubmitCodeSerializer(serializers.Serializer):
    """Serializer for code submission"""
    challenge_id = serializers.IntegerField()
    code = serializers.CharField()
    
class SaveCodeSerializer(serializers.Serializer):
    """Serializer for saving code during session"""
    challenge_id = serializers.IntegerField()
    code = serializers.CharField(allow_blank=True)
