"""
Admin configuration for recommendation models
"""
from django.contrib import admin
from django.utils.html import format_html
from .models import (
    JobOffer, JobRecommendation, UserJobPreference, 
    ScoringWeights, JobRecommendationDetail, RecommendationAnalytics
)


@admin.register(JobOffer)
class JobOfferAdmin(admin.ModelAdmin):
    list_display = [
        'title', 'company', 'job_type', 'seniority', 'location', 
        'salary_range', 'status', 'posted_at'
    ]
    list_filter = [
        'job_type', 'seniority', 'status', 'remote', 'city', 
        'posted_at', 'updated_at'
    ]
    search_fields = ['title', 'company', 'description', 'location']
    readonly_fields = ['posted_at', 'updated_at']
    
    fieldsets = (
        ('Informations de base', {
            'fields': ('title', 'company', 'description', 'requirements')
        }),
        ('Détails du poste', {
            'fields': ('job_type', 'seniority', 'location', 'city', 'remote')
        }),
        ('Salaire', {
            'fields': ('salary_min', 'salary_max')
        }),
        ('Compétences', {
            'fields': ('required_skills', 'preferred_skills', 'tags')
        }),
        ('Statut et dates', {
            'fields': ('status', 'posted_at', 'updated_at')
        }),
        ('Informations supplémentaires', {
            'fields': ('benefits', 'company_size', 'industry'),
            'classes': ('collapse',)
        }),
    )
    
    filter_horizontal = ['required_skills', 'preferred_skills']
    
    def salary_range(self, obj):
        if obj.salary_min and obj.salary_max:
            return f"{obj.salary_min:,} - {obj.salary_max:,}"
        elif obj.salary_min:
            return f"À partir de {obj.salary_min:,}"
        elif obj.salary_max:
            return f"Jusqu'à {obj.salary_max:,}"
        return 'Non spécifié'
    salary_range.short_description = 'Fourchette de salaire'


@admin.register(JobRecommendation)
class JobRecommendationAdmin(admin.ModelAdmin):
    list_display = [
        'user', 'job_title', 'company', 'score', 
        'algorithm_version', 'created_at'
    ]
    list_filter = ['algorithm_version', 'created_at', 'job_offer__job_type', 'job_offer__seniority']
    search_fields = [
        'user__username', 'user__email', 
        'job_offer__title', 'job_offer__company'
    ]
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Utilisateur et emploi', {
            'fields': ('user', 'job_offer')
        }),
        ('Scores', {
            'fields': ('score', 'algorithm_version', 'cluster_id')
        }),
        ('Dates', {
            'fields': ('created_at', 'updated_at')
        }),
    )
    
    def job_title(self, obj):
        return obj.job_offer.title
    job_title.short_description = 'Titre du poste'
    
    def company(self, obj):
        return obj.job_offer.company
    company.short_description = 'Entreprise'


@admin.register(UserJobPreference)
class UserJobPreferenceAdmin(admin.ModelAdmin):
    list_display = [
        'user', 'preferred_locations_display', 'remote_preference', 
        'preferred_seniority', 'target_salary_range'
    ]
    list_filter = ['remote_preference', 'preferred_seniority', 'willing_to_relocate']
    search_fields = ['user__username', 'user__email']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Utilisateur', {
            'fields': ('user',)
        }),
        ('Préférences de localisation', {
            'fields': ('preferred_locations', 'willing_to_relocate', 'remote_preference')
        }),
        ('Préférences d\'emploi', {
            'fields': ('preferred_job_types', 'preferred_seniority')
        }),
        ('Préférences salariales', {
            'fields': ('target_salary_min', 'target_salary_max')
        }),
        ('Préférences d\'entreprise', {
            'fields': ('preferred_industries', 'preferred_company_sizes')
        }),
        ('Compétences préférées', {
            'fields': ('skill_priorities',)
        }),
        ('Dates', {
            'fields': ('created_at', 'updated_at')
        }),
    )
    
    def preferred_locations_display(self, obj):
        locations = obj.preferred_locations[:3]  # Show first 3 locations
        if len(obj.preferred_locations) > 3:
            locations.append('...')
        return ', '.join(locations) if locations else 'Aucune'
    preferred_locations_display.short_description = 'Lieux préférés'
    
    def target_salary_range(self, obj):
        if obj.target_salary_min and obj.target_salary_max:
            return f"{obj.target_salary_min:,} - {obj.target_salary_max:,}"
        elif obj.target_salary_min:
            return f"À partir de {obj.target_salary_min:,}"
        elif obj.target_salary_max:
            return f"Jusqu'à {obj.target_salary_max:,}"
        return 'Non spécifié'
    target_salary_range.short_description = 'Fourchette de salaire cible'


@admin.register(ScoringWeights)
class ScoringWeightsAdmin(admin.ModelAdmin):
    list_display = [
        'name', 'is_active', 'skill_match_weight', 'content_similarity_weight',
        'cluster_fit_weight', 'created_at'
    ]
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'created_by__username']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Configuration', {
            'fields': ('name', 'is_active', 'created_by')
        }),
        ('Poids principaux', {
            'fields': ('skill_match_weight', 'content_similarity_weight', 'cluster_fit_weight')
        }),
        ('Poids des compétences', {
            'fields': ('required_skill_weight', 'preferred_skill_weight')
        }),
        ('Bonus', {
            'fields': ('location_bonus_weight', 'experience_bonus_weight', 'remote_bonus_weight', 'salary_fit_weight')
        }),
        ('Seuils', {
            'fields': ('min_score_threshold', 'max_recommendations')
        }),
        ('Dates', {
            'fields': ('created_at', 'updated_at')
        }),
    )


@admin.register(JobRecommendationDetail)
class JobRecommendationDetailAdmin(admin.ModelAdmin):
    list_display = [
        'user', 'job_title', 'company', 'overall_score', 
        'skill_score', 'content_score', 'created_at'
    ]
    list_filter = ['created_at', 'job_offer__job_type', 'job_offer__seniority']
    search_fields = [
        'user__username', 'user__email',
        'job_offer__title', 'job_offer__company'
    ]
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Utilisateur et emploi', {
            'fields': ('user', 'job_offer')
        }),
        ('Scores principaux', {
            'fields': ('overall_score', 'content_score', 'skill_score', 'cluster_fit_score')
        }),
        ('Scores des compétences', {
            'fields': ('required_skill_score', 'preferred_skill_score')
        }),
        ('Compteurs de compétences', {
            'fields': ('required_skills_count', 'preferred_skills_count', 'required_matched_count', 'preferred_matched_count')
        }),
        ('Bonus', {
            'fields': ('location_bonus', 'experience_bonus', 'remote_bonus', 'salary_fit')
        }),
        ('Compétences correspondantes', {
            'fields': ('matched_skills', 'missing_skills', 'required_matched_skills', 'preferred_matched_skills')
        }),
        ('Compétences manquantes', {
            'fields': ('required_missing_skills', 'preferred_missing_skills')
        }),
        ('Dates', {
            'fields': ('created_at', 'updated_at')
        }),
    )
    
    def job_title(self, obj):
        return obj.job_offer.title
    job_title.short_description = 'Titre du poste'
    
    def company(self, obj):
        return obj.job_offer.company
    company.short_description = 'Entreprise'


@admin.register(RecommendationAnalytics)
class RecommendationAnalyticsAdmin(admin.ModelAdmin):
    list_display = [
        'date', 'total_recommendations', 'avg_score', 
        'avg_skill_match', 'recommendations_viewed'
    ]
    list_filter = ['date']
    search_fields = ['date']
    readonly_fields = ['created_at']
    
    fieldsets = (
        ('Métriques de recommandation', {
            'fields': ('date', 'total_recommendations', 'avg_score', 'min_score', 'max_score')
        }),
        ('Métriques de compétences', {
            'fields': ('avg_skill_match', 'avg_required_skill_match', 'avg_preferred_skill_match')
        }),
        ('Métriques de cluster', {
            'fields': ('avg_cluster_fit', 'cluster_distribution')
        }),
        ('Engagement utilisateur', {
            'fields': ('recommendations_viewed', 'applications_from_recommendations', 'jobs_saved_from_recommendations')
        }),
        ('Dates', {
            'fields': ('created_at',)
        }),
    )