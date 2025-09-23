from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe
import json
from .models import CandidateProfile, Skill, TechnicalTest, TestQuestion, TestResult

@admin.register(CandidateProfile)
class CandidateProfileAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'email', 'phone', 'skills_count', 'tests_taken', 'created_at']
    list_filter = ['created_at', 'skills__category', 'skills']
    search_fields = ['first_name', 'last_name', 'email', 'user__username']
    filter_horizontal = ['skills']
    
    fieldsets = (
        ('👤 Informations personnelles', {
            'fields': ('user', 'first_name', 'last_name', 'email', 'phone')
        }),
        ('💼 Compétences et CV', {
            'fields': ('skills', 'cv_file')
        }),
        ('📊 Métadonnées', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )
    readonly_fields = ['created_at', 'updated_at']
    
    def skills_count(self, obj):
        count = obj.skills.count()
        if count > 0:
            return format_html('<span style="color: green; font-weight: bold;">{} compétences</span>', count)
        return format_html('<span style="color: red;">Aucune compétence</span>')
    skills_count.short_description = 'Compétences'
    
    def tests_taken(self, obj):
        count = TestResult.objects.filter(candidate=obj, status='completed').count()
        if count > 0:
            url = reverse('admin:skills_testresult_changelist') + f'?candidate__id__exact={obj.id}'
            return format_html('<a href="{}" style="color: blue; font-weight: bold;">{} tests passés</a>', url, count)
        return format_html('<span style="color: gray;">Aucun test</span>')
    tests_taken.short_description = 'Tests passés'

@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ['name', 'category_badge', 'description_short', 'tests_count', 'candidates_count']
    list_filter = ['category', 'created_at']
    search_fields = ['name', 'description']
    ordering = ['category', 'name']
    
    def category_badge(self, obj):
        colors = {
            'programming': '#3B82F6', 'frontend': '#10B981', 'backend': '#F59E0B',
            'database': '#8B5CF6', 'devops': '#EF4444', 'mobile': '#06B6D4',
            'testing': '#84CC16', 'other': '#6B7280'
        }
        color = colors.get(obj.category, '#6B7280')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 8px; border-radius: 12px; font-size: 12px;">{}</span>',
            color, obj.get_category_display()
        )
    category_badge.short_description = 'Catégorie'
    
    def description_short(self, obj):
        return obj.description[:50] + "..." if len(obj.description) > 50 else obj.description
    description_short.short_description = 'Description'
    
    def tests_count(self, obj):
        count = TechnicalTest.objects.filter(skill=obj).count()
        if count > 0:
            url = reverse('admin:skills_technicaltest_changelist') + f'?skill__id__exact={obj.id}'
            return format_html('<a href="{}">{} tests</a>', url, count)
        return '0 test'
    tests_count.short_description = 'Tests'
    
    def candidates_count(self, obj):
        count = obj.candidateprofile_set.count()
        return f"{count} candidats"
    candidates_count.short_description = 'Candidats'

@admin.register(TechnicalTest)
class TechnicalTestAdmin(admin.ModelAdmin):
    list_display = ['test_name', 'skill_badge', 'question_count', 'total_score', 'time_limit', 'status_badge', 'results_count']
    list_filter = ['skill__category', 'skill', 'is_active', 'created_at']
    search_fields = ['test_name', 'skill__name', 'description']
    
    fieldsets = (
        ('🎯 Configuration du test', {
            'fields': ('test_name', 'skill', 'description', 'instructions')
        }),
        ('⚙️ Paramètres', {
            'fields': ('total_score', 'time_limit', 'is_active')
        }),
        ('📄 Import JSON', {
            'fields': ('json_data',),
            'description': mark_safe('''
                <strong>Format JSON attendu :</strong>
                <pre style="background: #f5f5f5; padding: 10px; border-radius: 5px; font-size: 12px;">
{
  "questions": [
    {
      "question": "Votre question ici ?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct_answer": "a",
      "points": 2,
      "explanation": "Explication optionnelle"
    }
  ]
}
                </pre>
                <p style="color: #666; font-size: 12px;">
                    💡 <strong>Astuce :</strong> Collez votre JSON dans le champ ci-dessus et les questions seront automatiquement créées !
                </p>
            ''')
        })
    )
    
    def skill_badge(self, obj):
        colors = {
            'programming': '#3B82F6', 'frontend': '#10B981', 'backend': '#F59E0B',
            'database': '#8B5CF6', 'devops': '#EF4444', 'mobile': '#06B6D4',
            'testing': '#84CC16', 'other': '#6B7280'
        }
        color = colors.get(obj.skill.category, '#6B7280')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 8px; border-radius: 12px; font-size: 12px;">{}</span>',
            color, obj.skill.name
        )
    skill_badge.short_description = 'Compétence'
    
    def status_badge(self, obj):
        if obj.is_active:
            return format_html('<span style="color: green; font-weight: bold;">✅ Actif</span>')
        return format_html('<span style="color: red; font-weight: bold;">❌ Inactif</span>')
    status_badge.short_description = 'Statut'
    
    def results_count(self, obj):
        count = TestResult.objects.filter(test=obj).count()
        if count > 0:
            url = reverse('admin:skills_testresult_changelist') + f'?test__id__exact={obj.id}'
            return format_html('<a href="{}">{} résultats</a>', url, count)
        return '0 résultat'
    results_count.short_description = 'Résultats'

@admin.register(TestQuestion)
class TestQuestionAdmin(admin.ModelAdmin):
    list_display = ['test', 'order', 'question_text_short', 'correct_answer', 'points']
    list_filter = ['test__skill', 'test', 'correct_answer']
    search_fields = ['question_text', 'test__test_name']
    ordering = ['test', 'order']
    
    fieldsets = (
        ('📝 Question', {
            'fields': ('test', 'order', 'question_text')
        }),
        ('📋 Options de réponse', {
            'fields': ('option_a', 'option_b', 'option_c', 'option_d')
        }),
        ('✅ Correction', {
            'fields': ('correct_answer', 'points', 'explanation')
        })
    )
    
    def question_text_short(self, obj):
        return obj.question_text[:50] + "..." if len(obj.question_text) > 50 else obj.question_text
    question_text_short.short_description = 'Question'

@admin.register(TestResult)
class TestResultAdmin(admin.ModelAdmin):
    list_display = ['candidate', 'test', 'score_display', 'percentage_display', 'status_badge', 'time_display', 'completed_at']
    list_filter = ['test__skill', 'test', 'status', 'completed_at']
    search_fields = ['candidate__first_name', 'candidate__last_name', 'test__test_name']
    readonly_fields = ['percentage_display', 'time_display', 'answers_summary']
    
    fieldsets = (
        ('📊 Résultat', {
            'fields': ('candidate', 'test', 'score', 'percentage_display', 'status')
        }),
        ('⏱️ Temporel', {
            'fields': ('time_taken', 'time_display', 'started_at', 'completed_at')
        }),
        ('📋 Détails des réponses', {
            'fields': ('answers_data', 'answers_summary'),
            'classes': ('collapse',)
        })
    )
    
    def score_display(self, obj):
        percentage = obj.percentage
        color = '#10B981' if percentage >= 70 else '#F59E0B' if percentage >= 50 else '#EF4444'
        return format_html('<span style="color: {}; font-weight: bold;">{}/{}</span>', color, obj.score, obj.test.total_score)
    score_display.short_description = 'Score'
    
    def percentage_display(self, obj):
        percentage = obj.percentage
        color = '#10B981' if percentage >= 70 else '#F59E0B' if percentage >= 50 else '#EF4444'
        return format_html('<span style="color: {}; font-weight: bold;">{}%</span>', color, percentage)
    percentage_display.short_description = 'Pourcentage'
    
    def status_badge(self, obj):
        colors = {'completed': '#10B981', 'in_progress': '#F59E0B', 'abandoned': '#EF4444'}
        color = colors.get(obj.status, '#6B7280')
        return format_html('<span style="color: {}; font-weight: bold;">{}</span>', color, obj.get_status_display())
    status_badge.short_description = 'Statut'
    
    def time_display(self, obj):
        minutes = obj.time_taken // 60
        seconds = obj.time_taken % 60
        return f"{minutes}m {seconds}s"
    time_display.short_description = 'Temps'
    
    def answers_summary(self, obj):
        if not obj.answers_data:
            return "Aucune réponse"
        try:
            answers = obj.answers_data if isinstance(obj.answers_data, dict) else json.loads(obj.answers_data)
            correct = sum(1 for answer in answers.values() if answer.get('is_correct', False))
            total = len(answers)
            return format_html('<span style="color: #10B981; font-weight: bold;">{}</span> bonnes réponses sur <span style="font-weight: bold;">{}</span>', correct, total)
        except:
            return "Erreur dans les données"
    answers_summary.short_description = 'Résumé des réponses'

# Personnalisation de l'interface d'administration
admin.site.site_header = "🎯 Administration - Tests Techniques"
admin.site.site_title = "Skills Assessment Admin"
admin.site.index_title = "Tableau de bord - Créez vos tests ici !"
