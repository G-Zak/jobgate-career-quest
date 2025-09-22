"""
Admin configuration for recommendation models
"""
from django.contrib import admin
from django.utils.html import format_html
from .models import JobOffer, JobRecommendation, UserJobPreference, JobApplication


@admin.register(JobOffer)
class JobOfferAdmin(admin.ModelAdmin):
    list_display = [
        'title', 'company', 'job_type', 'seniority', 'location', 
        'salary_range', 'status', 'posted_at', 'is_active'
    ]
    list_filter = [
        'job_type', 'seniority', 'status', 'remote', 'city', 
        'posted_at', 'expires_at'
    ]
    search_fields = ['title', 'company', 'description', 'location']
    readonly_fields = ['posted_at', 'updated_at', 'is_active']
    
    fieldsets = (
        ('Informations de base', {
            'fields': ('title', 'company', 'description', 'requirements', 'responsibilities')
        }),
        ('Détails du poste', {
            'fields': ('job_type', 'seniority', 'location', 'city', 'remote')
        }),
        ('Salaire', {
            'fields': ('salary_min', 'salary_max', 'salary_currency')
        }),
        ('Compétences', {
            'fields': ('required_skills', 'preferred_skills', 'tags')
        }),
        ('Statut et dates', {
            'fields': ('status', 'posted_at', 'updated_at', 'expires_at', 'is_active')
        }),
        ('Contact', {
            'fields': ('contact_email', 'contact_phone')
        }),
        ('Informations supplémentaires', {
            'fields': ('benefits', 'company_size', 'industry'),
            'classes': ('collapse',)
        }),
    )
    
    filter_horizontal = ['required_skills', 'preferred_skills']
    
    def salary_range(self, obj):
        return obj.salary_range
    salary_range.short_description = 'Fourchette de salaire'
    
    def is_active(self, obj):
        if obj.is_active:
            return format_html('<span style="color: green;">✓ Actif</span>')
        else:
            return format_html('<span style="color: red;">✗ Inactif</span>')
    is_active.short_description = 'Statut'


@admin.register(JobRecommendation)
class JobRecommendationAdmin(admin.ModelAdmin):
    list_display = [
        'candidate', 'job_title', 'company', 'overall_score', 
        'skill_match_score', 'status', 'created_at'
    ]
    list_filter = ['status', 'created_at', 'job__job_type', 'job__seniority']
    search_fields = [
        'candidate__first_name', 'candidate__last_name', 
        'job__title', 'job__company'
    ]
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Candidat et emploi', {
            'fields': ('candidate', 'job')
        }),
        ('Scores', {
            'fields': (
                'overall_score', 'skill_match_score', 'salary_fit_score',
                'location_match_score', 'seniority_match_score', 'remote_bonus'
            )
        }),
        ('Analyse des compétences', {
            'fields': ('matched_skills', 'missing_skills', 'recommendation_reason')
        }),
        ('Statut', {
            'fields': ('status', 'created_at', 'updated_at')
        }),
    )
    
    def job_title(self, obj):
        return obj.job.title
    job_title.short_description = 'Titre du poste'
    
    def company(self, obj):
        return obj.job.company
    company.short_description = 'Entreprise'


@admin.register(UserJobPreference)
class UserJobPreferenceAdmin(admin.ModelAdmin):
    list_display = [
        'user', 'preferred_cities_display', 'accepts_remote', 
        'preferred_seniority', 'target_salary_range', 'max_recommendations'
    ]
    list_filter = ['accepts_remote', 'preferred_seniority', 'salary_currency']
    search_fields = ['user__username', 'user__email']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Utilisateur', {
            'fields': ('user',)
        }),
        ('Préférences de localisation', {
            'fields': ('preferred_cities', 'preferred_countries', 'accepts_remote')
        }),
        ('Préférences d\'emploi', {
            'fields': ('preferred_job_types', 'preferred_seniority')
        }),
        ('Préférences salariales', {
            'fields': ('target_salary_min', 'target_salary_max', 'salary_currency')
        }),
        ('Compétences préférées', {
            'fields': ('preferred_skills', 'skill_weights')
        }),
        ('Préférences d\'entreprise', {
            'fields': ('preferred_industries', 'preferred_company_sizes')
        }),
        ('Paramètres de recommandation', {
            'fields': ('max_recommendations', 'min_score_threshold')
        }),
        ('Dates', {
            'fields': ('created_at', 'updated_at')
        }),
    )
    
    filter_horizontal = ['preferred_skills']
    
    def preferred_cities_display(self, obj):
        cities = obj.preferred_cities[:3]  # Show first 3 cities
        if len(obj.preferred_cities) > 3:
            cities.append('...')
        return ', '.join(cities) if cities else 'Aucune'
    preferred_cities_display.short_description = 'Villes préférées'
    
    def target_salary_range(self, obj):
        if obj.target_salary_min and obj.target_salary_max:
            return f"{obj.target_salary_min:,} - {obj.target_salary_max:,} {obj.salary_currency}"
        elif obj.target_salary_min:
            return f"À partir de {obj.target_salary_min:,} {obj.salary_currency}"
        elif obj.target_salary_max:
            return f"Jusqu'à {obj.target_salary_max:,} {obj.salary_currency}"
        return 'Non spécifié'
    target_salary_range.short_description = 'Fourchette de salaire cible'


@admin.register(JobApplication)
class JobApplicationAdmin(admin.ModelAdmin):
    list_display = [
        'candidate', 'job_title', 'company', 'status', 
        'applied_at', 'recommendation_score'
    ]
    list_filter = ['status', 'applied_at', 'job__job_type']
    search_fields = [
        'candidate__first_name', 'candidate__last_name',
        'job__title', 'job__company'
    ]
    readonly_fields = ['applied_at', 'updated_at']
    
    fieldsets = (
        ('Candidat et emploi', {
            'fields': ('candidate', 'job', 'recommendation')
        }),
        ('Candidature', {
            'fields': ('cover_letter', 'status', 'notes')
        }),
        ('Dates', {
            'fields': ('applied_at', 'updated_at')
        }),
    )
    
    def job_title(self, obj):
        return obj.job.title
    job_title.short_description = 'Titre du poste'
    
    def company(self, obj):
        return obj.job.company
    company.short_description = 'Entreprise'
    
    def recommendation_score(self, obj):
        if obj.recommendation:
            return f"{obj.recommendation.overall_score:.1f}%"
        return 'N/A'
    recommendation_score.short_description = 'Score de recommandation'