from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe
from django.db.models import Count, Avg, Q
from django.contrib.admin import SimpleListFilter
from django.utils import timezone
from datetime import timedelta

from .models import (
    Test, Question, TestSubmission, Answer, Score,
    TestSession, TestAnswer, CodingChallenge, CodingSubmission, 
    CodingSession, TestAttempt
)
from .question_option_model import QuestionOption


class TestTypeFilter(SimpleListFilter):
    title = 'Test Type'
    parameter_name = 'test_type'
    
    def lookups(self, request, model_admin):
        return [
            ('verbal_reasoning', 'Verbal Reasoning'),
            ('numerical_reasoning', 'Numerical Reasoning'),
            ('logical_reasoning', 'Logical Reasoning'),
            ('situational_judgment', 'Situational Judgment'),
            ('abstract_reasoning', 'Abstract Reasoning'),
            ('spatial_reasoning', 'Spatial Reasoning'),
            ('technical', 'Technical'),
            ('diagrammatic_reasoning', 'Diagrammatic Reasoning'),
        ]
    
    def queryset(self, request, queryset):
        if self.value():
            return queryset.filter(test_type=self.value())


class DifficultyFilter(SimpleListFilter):
    title = 'Difficulty Level'
    parameter_name = 'difficulty'
    
    def lookups(self, request, model_admin):
        return [
            ('easy', 'Easy'),
            ('medium', 'Medium'),
            ('hard', 'Hard'),
        ]
    
    def queryset(self, request, queryset):
        if self.value():
            return queryset.filter(difficulty_level=self.value())


class SubmissionStatusFilter(SimpleListFilter):
    title = 'Submission Status'
    parameter_name = 'status'
    
    def lookups(self, request, model_admin):
        return [
            ('complete', 'Complete'),
            ('incomplete', 'Incomplete'),
            ('scored', 'Scored'),
            ('unscored', 'Unscored'),
        ]
    
    def queryset(self, request, queryset):
        if self.value() == 'complete':
            return queryset.filter(is_complete=True)
        elif self.value() == 'incomplete':
            return queryset.filter(is_complete=False)
        elif self.value() == 'scored':
            return queryset.filter(scored_at__isnull=False)
        elif self.value() == 'unscored':
            return queryset.filter(scored_at__isnull=True)


@admin.register(Test)
class TestAdmin(admin.ModelAdmin):
    list_display = [
        'title', 'test_type', 'duration_minutes', 'total_questions', 
        'max_possible_score', 'passing_score', 'is_active', 'question_count',
        'submission_count', 'avg_score', 'created_at'
    ]
    list_filter = [TestTypeFilter, 'is_active', 'created_at', 'version']
    search_fields = ['title', 'description', 'test_type']
    readonly_fields = ['created_at', 'updated_at', 'max_possible_score', 'question_count']
    list_editable = ['is_active', 'passing_score']
    ordering = ['-created_at']
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'test_type', 'description', 'version')
        }),
        ('Configuration', {
            'fields': ('duration_minutes', 'total_questions', 'passing_score', 'is_active')
        }),
        ('Scoring', {
            'fields': ('max_possible_score',),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
    
    def question_count(self, obj):
        count = obj.questions.count()
        if count > 0:
            url = reverse('admin:testsengine_question_changelist') + f'?test__id__exact={obj.id}'
            return format_html('<a href="{}">{} questions</a>', url, count)
        return '0 questions'
    question_count.short_description = 'Questions'
    
    def submission_count(self, obj):
        count = obj.submissions.count()
        if count > 0:
            url = reverse('admin:testsengine_testsubmission_changelist') + f'?test__id__exact={obj.id}'
            return format_html('<a href="{}">{} submissions</a>', url, count)
        return '0 submissions'
    submission_count.short_description = 'Submissions'
    
    def avg_score(self, obj):
        avg = obj.submissions.filter(
            score__isnull=False
        ).aggregate(avg_score=Avg('score__percentage_score'))['avg_score']
        if avg:
            return f"{avg:.1f}%"
        return "N/A"
    avg_score.short_description = 'Avg Score'


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = [
        'id', 'test', 'order', 'question_type', 'difficulty_level', 
        'scoring_coefficient', 'has_passage', 'options_count', 'created_at'
    ]
    list_filter = [DifficultyFilter, 'question_type', 'test', 'created_at']
    search_fields = ['question_text', 'passage', 'test__title']
    ordering = ['test', 'order']
    list_editable = ['order', 'difficulty_level']
    readonly_fields = ['created_at', 'scoring_coefficient', 'options_count']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('test', 'order', 'question_type', 'difficulty_level')
        }),
        ('Content', {
            'fields': ('question_text', 'passage', 'options', 'correct_answer')
        }),
        ('Scoring', {
            'fields': ('scoring_coefficient', 'complexity_score'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
    
    def has_passage(self, obj):
        return bool(obj.passage)
    has_passage.boolean = True
    has_passage.short_description = 'Has Passage'
    
    def options_count(self, obj):
        if obj.options:
            return len(obj.options)
        return 0
    options_count.short_description = 'Options'
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('test')


@admin.register(TestSubmission)
class TestSubmissionAdmin(admin.ModelAdmin):
    list_display = [
        'id', 'user', 'test', 'submitted_at', 'time_taken_seconds', 
        'is_complete', 'score_display', 'grade_display', 'status'
    ]
    list_filter = [SubmissionStatusFilter, 'test', 'submitted_at', 'is_complete']
    search_fields = ['user__username', 'user__email', 'test__title']
    readonly_fields = ['submitted_at', 'scored_at', 'scoring_version']
    ordering = ['-submitted_at']
    date_hierarchy = 'submitted_at'
    
    fieldsets = (
        ('Submission Details', {
            'fields': ('user', 'test', 'submitted_at', 'time_taken_seconds', 'is_complete')
        }),
        ('Scoring', {
            'fields': ('scored_at', 'scoring_version'),
            'classes': ('collapse',)
        }),
        ('Raw Data', {
            'fields': ('answers_data',),
            'classes': ('collapse',)
        }),
    )
    
    def score_display(self, obj):
        if obj.score:
            return f"{obj.score.percentage_score:.1f}%"
        return "Not scored"
    score_display.short_description = 'Score'
    
    def grade_display(self, obj):
        if obj.score:
            return obj.score.grade_letter
        return "N/A"
    grade_display.short_description = 'Grade'
    
    def status(self, obj):
        if obj.score:
            if obj.score.passed:
                return format_html('<span style="color: green;">✓ Passed</span>')
            else:
                return format_html('<span style="color: red;">✗ Failed</span>')
        return format_html('<span style="color: orange;">⏳ Pending</span>')
    status.short_description = 'Status'
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user', 'test', 'score')


@admin.register(Answer)
class AnswerAdmin(admin.ModelAdmin):
    list_display = [
        'id', 'submission', 'question', 'selected_answer', 'is_correct', 
        'points_awarded', 'time_taken_seconds', 'answered_at'
    ]
    list_filter = ['is_correct', 'question__test', 'answered_at']
    search_fields = ['submission__user__username', 'question__question_text']
    readonly_fields = ['answered_at', 'points_awarded']
    ordering = ['-answered_at']
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('submission__user', 'question')


@admin.register(Score)
class ScoreAdmin(admin.ModelAdmin):
    list_display = [
        'id', 'submission', 'raw_score', 'max_possible_score', 
        'percentage_score', 'grade_letter', 'passed', 'calculated_at'
    ]
    list_filter = ['calculated_at', 'scoring_algorithm']
    search_fields = ['submission__user__username', 'submission__test__title']
    readonly_fields = ['calculated_at', 'scoring_algorithm']
    ordering = ['-calculated_at']
    
    fieldsets = (
        ('Score Summary', {
            'fields': ('submission', 'raw_score', 'max_possible_score', 'percentage_score', 'grade_letter', 'passed')
        }),
        ('Breakdown', {
            'fields': ('correct_answers', 'incorrect_answers', 'total_questions', 'time_taken_seconds'),
            'classes': ('collapse',)
        }),
        ('Difficulty Analysis', {
            'fields': ('easy_correct', 'medium_correct', 'hard_correct', 'difficulty_breakdown'),
            'classes': ('collapse',)
        }),
        ('Metadata', {
            'fields': ('scoring_algorithm', 'calculated_at', 'metadata'),
            'classes': ('collapse',)
        }),
    )
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('submission__user', 'submission__test')


@admin.register(TestSession)
class TestSessionAdmin(admin.ModelAdmin):
    list_display = ['user', 'test', 'status', 'score', 'start_time', 'end_time', 'duration']
    list_filter = ['status', 'test', 'start_time']
    search_fields = ['user__username', 'test__title']
    readonly_fields = ['start_time', 'end_time']
    
    def duration(self, obj):
        if obj.start_time and obj.end_time:
            delta = obj.end_time - obj.start_time
            return str(delta).split('.')[0]  # Remove microseconds
        return "N/A"
    duration.short_description = 'Duration'


@admin.register(TestAnswer)
class TestAnswerAdmin(admin.ModelAdmin):
    list_display = ['session', 'question', 'selected_answer', 'is_correct', 'time_taken']
    list_filter = ['is_correct', 'question__test']
    search_fields = ['session__user__username', 'question__question_text']


@admin.register(CodingChallenge)
class CodingChallengeAdmin(admin.ModelAdmin):
    list_display = [
        'title', 'difficulty', 'category', 'language', 'max_points', 
        'estimated_time_minutes', 'is_active', 'submission_count'
    ]
    list_filter = ['difficulty', 'category', 'language', 'is_active']
    search_fields = ['title', 'description', 'category']
    readonly_fields = ['created_at', 'updated_at', 'submission_count']
    
    def submission_count(self, obj):
        count = obj.codingsubmission_set.count()
        if count > 0:
            url = reverse('admin:testsengine_codingsubmission_changelist') + f'?challenge__id__exact={obj.id}'
            return format_html('<a href="{}">{} submissions</a>', url, count)
        return '0 submissions'
    submission_count.short_description = 'Submissions'


@admin.register(CodingSubmission)
class CodingSubmissionAdmin(admin.ModelAdmin):
    list_display = [
        'id', 'user', 'challenge', 'score', 'tests_passed', 'total_tests', 
        'memory_used_mb', 'submitted_at', 'status'
    ]
    list_filter = ['challenge', 'submitted_at', 'tests_passed']
    search_fields = ['user__username', 'challenge__title']
    readonly_fields = ['submitted_at']
    ordering = ['-submitted_at']
    
    def status(self, obj):
        if obj.tests_passed == obj.total_tests:
            return format_html('<span style="color: green;">✓ All Tests Passed</span>')
        elif obj.tests_passed > 0:
            return format_html('<span style="color: orange;">⚠ Partial ({}/{})</span>', obj.tests_passed, obj.total_tests)
        else:
            return format_html('<span style="color: red;">✗ Failed</span>')
    status.short_description = 'Status'


@admin.register(CodingSession)
class CodingSessionAdmin(admin.ModelAdmin):
    list_display = ['user', 'challenge', 'status', 'start_time', 'completion_time', 'duration']
    list_filter = ['status', 'challenge', 'start_time']
    search_fields = ['user__username', 'challenge__title']
    readonly_fields = ['start_time', 'last_activity']
    
    def duration(self, obj):
        if obj.start_time and obj.completion_time:
            delta = obj.completion_time - obj.start_time
            return str(delta).split('.')[0]
        return "N/A"
    duration.short_description = 'Duration'


@admin.register(TestAttempt)
class TestAttemptAdmin(admin.ModelAdmin):
    list_display = ['user', 'test_id', 'percentage', 'result', 'created_at']
    list_filter = ['test_id', 'result', 'language']
    search_fields = ['user__username', 'test_id']
    readonly_fields = ['created_at']
    date_hierarchy = 'created_at'


# Customize admin site
admin.site.site_header = "JobGate Career Quest - Test Management"
admin.site.site_title = "Test Admin"
admin.site.index_title = "Test Management Dashboard"