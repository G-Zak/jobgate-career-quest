"""
Enhanced serializers with i18n support for numerical tests
"""
from rest_framework import serializers
from .models import Test, Question
from .models_i18n import (
    TestTranslation, QuestionTranslation, 
    NumericalTestCategory, NumericalQuestionExtension
)


class NumericalTestCategorySerializer(serializers.ModelSerializer):
    """Serializer for numerical test categories with translations"""
    display_name = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()
    
    class Meta:
        model = NumericalTestCategory
        fields = ['name', 'display_name', 'description', 'display_order']
    
    def get_display_name(self, obj):
        language = self.context.get('language', 'en')
        translation = obj.translations.filter(language=language).first()
        return translation.display_name if translation else obj.get_name_display()
    
    def get_description(self, obj):
        language = self.context.get('language', 'en')
        translation = obj.translations.filter(language=language).first()
        return translation.description if translation else ''


class NumericalQuestionExtensionSerializer(serializers.ModelSerializer):
    """Serializer for numerical question extensions"""
    category = NumericalTestCategorySerializer(read_only=True)
    
    class Meta:
        model = NumericalQuestionExtension
        fields = [
            'category', 'calculation_steps', 'formula_used', 'data_table',
            'chart_data', 'requires_calculator', 'multiple_steps',
            'data_interpretation_required', 'average_time_seconds', 'success_rate'
        ]


class QuestionWithTranslationSerializer(serializers.ModelSerializer):
    """Enhanced question serializer with translation support"""
    question_text = serializers.SerializerMethodField()
    options = serializers.SerializerMethodField()
    explanation = serializers.SerializerMethodField()
    numerical_extension = NumericalQuestionExtensionSerializer(read_only=True)
    translations = serializers.SerializerMethodField()
    
    class Meta:
        model = Question
        fields = [
            'id', 'question_type', 'question_text', 'options', 'explanation',
            'difficulty_level', 'order', 'numerical_extension', 'translations'
        ]
        # Exclude correct_answer for security
    
    def get_question_text(self, obj):
        language = self.context.get('language', 'en')
        translation = obj.translations.filter(language=language).first()
        return translation.question_text if translation else obj.question_text
    
    def get_options(self, obj):
        language = self.context.get('language', 'en')
        translation = obj.translations.filter(language=language).first()
        return translation.options if translation else obj.options
    
    def get_explanation(self, obj):
        # Only return explanation if user has permission (e.g., after test completion)
        if not self.context.get('include_explanations', False):
            return None
        
        language = self.context.get('language', 'en')
        translation = obj.translations.filter(language=language).first()
        return translation.explanation if translation else obj.explanation
    
    def get_translations(self, obj):
        """Return all available translations for frontend caching"""
        translations = {}
        for translation in obj.translations.all():
            translations[translation.language] = {
                'question_text': translation.question_text,
                'options': translation.options,
                'explanation': translation.explanation
            }
        return translations


class TestWithTranslationSerializer(serializers.ModelSerializer):
    """Enhanced test serializer with translation support"""
    title = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()
    instructions = serializers.SerializerMethodField()
    questions = QuestionWithTranslationSerializer(many=True, read_only=True)
    
    class Meta:
        model = Test
        fields = [
            'id', 'title', 'description', 'instructions', 'test_type',
            'duration_minutes', 'total_questions', 'passing_score',
            'questions'
        ]
    
    def get_title(self, obj):
        language = self.context.get('language', 'en')
        translation = obj.translations.filter(language=language).first()
        return translation.title if translation else obj.title
    
    def get_description(self, obj):
        language = self.context.get('language', 'en')
        translation = obj.translations.filter(language=language).first()
        return translation.description if translation else obj.description
    
    def get_instructions(self, obj):
        language = self.context.get('language', 'en')
        translation = obj.translations.filter(language=language).first()
        return translation.instructions if translation else ''


class TestSubmissionWithI18nSerializer(serializers.Serializer):
    """Enhanced test submission serializer with i18n support"""
    test_id = serializers.IntegerField()
    answers = serializers.DictField()
    started_at = serializers.DateTimeField()
    finished_at = serializers.DateTimeField()
    language = serializers.CharField(max_length=5, default='en')
    metadata = serializers.DictField(required=False)
    
    def validate_test_id(self, value):
        try:
            test = Test.objects.get(id=value, is_active=True)
            return value
        except Test.DoesNotExist:
            raise serializers.ValidationError("Test not found or inactive")
    
    def validate_answers(self, value):
        if not isinstance(value, dict):
            raise serializers.ValidationError("Answers must be a dictionary")
        return value
    
    def validate_language(self, value):
        if value not in ['en', 'fr']:
            raise serializers.ValidationError("Unsupported language")
        return value
