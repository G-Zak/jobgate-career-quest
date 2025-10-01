from django.contrib import admin

from .models import (
    CandidateProfile,
    Skill,
    TechnicalTest,
    TestQuestion,
    TestResult,
    Education,
    WorkExperience,
    Project,
)


@admin.register(CandidateProfile)
class CandidateProfileAdmin(admin.ModelAdmin):
    list_display = ["full_name", "email", "phone", "created_at"]
    search_fields = ["first_name", "last_name", "email", "user__username"]


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ["name", "category"]
    search_fields = ["name", "description"]


@admin.register(TechnicalTest)
class TechnicalTestAdmin(admin.ModelAdmin):
    list_display = ["test_name", "skill", "is_active", "created_at"]
    search_fields = ["test_name", "skill__name"]


@admin.register(TestQuestion)
class TestQuestionAdmin(admin.ModelAdmin):
    list_display = ["test", "order", "question_text"]
    search_fields = ["question_text"]


@admin.register(TestResult)
class TestResultAdmin(admin.ModelAdmin):
    list_display = ["candidate", "test", "score", "completed_at"]
    search_fields = ["candidate__first_name", "candidate__last_name"]


# Register simpler admin entries for other models
admin.site.register(Education)
admin.site.register(WorkExperience)
admin.site.register(Project)
