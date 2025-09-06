from django.contrib import admin
from .models import Test, Question, TestSession, TestAnswer

@admin.register(Test)
class TestAdmin(admin.ModelAdmin):
    list_display = ['title', 'test_type', 'duration_minutes', 'total_questions', 'passing_score', 'is_active']
    list_filter = ['test_type', 'is_active', 'created_at']
    search_fields = ['title', 'description']
    readonly_fields = ['created_at', 'updated_at']

@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ['test', 'order', 'question_type', 'difficulty_level', 'correct_answer']
    list_filter = ['test', 'question_type', 'difficulty_level']
    search_fields = ['question_text', 'passage']
    ordering = ['test', 'order']

@admin.register(TestSession)
class TestSessionAdmin(admin.ModelAdmin):
    list_display = ['user', 'test', 'status', 'score', 'start_time', 'end_time']
    list_filter = ['status', 'test', 'start_time']
    search_fields = ['user__username', 'test__title']
    readonly_fields = ['start_time', 'end_time']

@admin.register(TestAnswer)
class TestAnswerAdmin(admin.ModelAdmin):
    list_display = ['session', 'question', 'selected_answer', 'is_correct', 'time_taken']
    list_filter = ['is_correct', 'question__test']
    search_fields = ['session__user__username', 'question__question_text']
