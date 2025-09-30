"""
Admin configuration for enhanced cognitive recommendation models
"""
from django.contrib import admin
from django.utils.html import format_html
from .models import (
    JobOffer, JobRecommendation, ScoringWeights,
    SkillTechnicalTestMapping, ClusterCenters, RecommendationAudit
)


@admin.register(JobOffer)
class JobOfferAdmin(admin.ModelAdmin):
    list_display = [
        'title', 'company', 'job_type', 'seniority', 'location', 
        'salary_range', 'status', 'posted_at'
    ]
    list_filter = [
        'job_type', 'seniority', 'status', 'remote_flag', 'city',
        'posted_at', 'updated_at', 'source_type'
    ]
    search_fields = ['title', 'company', 'description', 'location']
    readonly_fields = ['posted_at', 'updated_at']
    
    fieldsets = (
        ('Informations de base', {
            'fields': ('title', 'company', 'description', 'requirements')
        }),
        ('Détails du poste', {
            'fields': ('job_type', 'seniority', 'location', 'city', 'remote_flag')
        }),
        ('Salaire', {
            'fields': ('salary_min', 'salary_max', 'currency')
        }),
        ('Compétences', {
            'fields': ('required_skills', 'preferred_skills', 'tags')
        }),
        ('Statut et dates', {
            'fields': ('status', 'posted_at', 'updated_at')
        }),
        ('Informations supplémentaires', {
            'fields': ('benefits', 'company_size', 'industry', 'source_type', 'source_id'),
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
        'candidate_display', 'job_title', 'company', 'overall_score',
        'technical_test_score', 'algorithm_version', 'computed_at'
    ]
    list_filter = ['algorithm_version', 'computed_at', 'job_offer__job_type', 'job_offer__seniority']
    search_fields = [
        'candidate_id', 'job_offer__title', 'job_offer__company'
    ]
    readonly_fields = ['created_at', 'updated_at', 'computed_at']

    fieldsets = (
        ('Candidat et emploi', {
            'fields': ('candidate_id', 'job_offer')
        }),
        ('Scores principaux', {
            'fields': ('overall_score', 'technical_test_score', 'skill_match_score')
        }),
        ('Scores détaillés', {
            'fields': ('experience_score', 'salary_score', 'location_score', 'cluster_fit_score')
        }),
        ('Métadonnées', {
            'fields': ('algorithm_version', 'weights_snapshot_id', 'source_snapshot_id')
        }),
        ('Dates', {
            'fields': ('computed_at', 'created_at', 'updated_at')
        }),
    )

    def candidate_display(self, obj):
        try:
            user = obj.get_user()
            return f"Candidate {obj.candidate_id}" + (f" ({user.username})" if user else "")
        except:
            return f"Candidate {obj.candidate_id}"
    candidate_display.short_description = 'Candidat'

    def job_title(self, obj):
        return obj.job_offer.title
    job_title.short_description = 'Titre du poste'

    def company(self, obj):
        return obj.job_offer.company
    company.short_description = 'Entreprise'


@admin.register(ScoringWeights)
class ScoringWeightsAdmin(admin.ModelAdmin):
    list_display = [
        'name', 'is_active', 'skill_match_weight', 'technical_test_weight',
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
            'fields': ('skill_match_weight', 'technical_test_weight', 'experience_weight',
                      'salary_weight', 'location_weight', 'cluster_fit_weight', 'employability_weight')
        }),
        ('Poids des compétences', {
            'fields': ('required_skill_weight', 'preferred_skill_weight')
        }),
        ('Configuration des tests techniques', {
            'fields': ('test_pass_threshold', 'technical_test_default_weights')
        }),
        ('Dates', {
            'fields': ('created_at', 'updated_at')
        }),
    )


@admin.register(SkillTechnicalTestMapping)
class SkillTechnicalTestMappingAdmin(admin.ModelAdmin):
    list_display = [
        'skill', 'technical_test', 'default_weight', 'created_at'
    ]
    list_filter = ['skill__category', 'default_weight', 'created_at']
    search_fields = ['skill__name', 'technical_test__test_name']
    readonly_fields = ['created_at', 'updated_at']

    fieldsets = (
        ('Mapping', {
            'fields': ('skill', 'technical_test', 'default_weight')
        }),
        ('Dates', {
            'fields': ('created_at', 'updated_at')
        }),
    )


@admin.register(ClusterCenters)
class ClusterCentersAdmin(admin.ModelAdmin):
    list_display = [
        'algorithm_version', 'n_clusters', 'trained_at', 'is_active',
        'n_samples_trained', 'silhouette_score'
    ]
    list_filter = ['is_active', 'algorithm_version', 'trained_at']
    search_fields = ['algorithm_version']
    readonly_fields = ['trained_at', 'inertia', 'silhouette_score', 'n_samples_trained']

    fieldsets = (
        ('Modèle', {
            'fields': ('algorithm_version', 'n_clusters', 'is_active')
        }),
        ('Métriques d\'entraînement', {
            'fields': ('inertia', 'silhouette_score', 'n_samples_trained', 'trained_at')
        }),
        ('Données', {
            'fields': ('centers', 'training_metadata'),
            'classes': ('collapse',)
        }),
    )


@admin.register(RecommendationAudit)
class RecommendationAuditAdmin(admin.ModelAdmin):
    list_display = [
        'candidate_id', 'job_offer', 'old_overall_score', 'new_overall_score',
        'reason', 'changed_at'
    ]
    list_filter = ['reason', 'changed_at', 'algorithm_version']
    search_fields = ['candidate_id', 'job_offer__title', 'reason']
    readonly_fields = ['changed_at']

    fieldsets = (
        ('Recommandation', {
            'fields': ('recommendation', 'candidate_id', 'job_offer')
        }),
        ('Changement de score', {
            'fields': ('old_overall_score', 'new_overall_score', 'reason')
        }),
        ('Métadonnées', {
            'fields': ('algorithm_version', 'weights_snapshot_id', 'changed_at')
        }),
    )