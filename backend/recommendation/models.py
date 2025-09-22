from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from skills.models import Skill, CandidateProfile
import json

class JobOffer(models.Model):
    """Job offers posted by companies"""
    JOB_TYPES = [
        ('CDI', 'CDI'),
        ('CDD', 'CDD'),
        ('Stage', 'Stage'),
        ('Freelance', 'Freelance'),
        ('Alternance', 'Alternance'),
        ('Temps partiel', 'Temps partiel'),
    ]
    
    SENIORITY_LEVELS = [
        ('junior', 'Junior (0-2 ans)'),
        ('mid', 'Mid-level (2-5 ans)'),
        ('senior', 'Senior (5-10 ans)'),
        ('lead', 'Lead/Expert (10+ ans)'),
    ]
    
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('paused', 'Paused'),
        ('closed', 'Closed'),
        ('draft', 'Draft'),
    ]
    
    # Basic job information
    title = models.CharField(max_length=200, verbose_name="Titre du poste")
    company = models.CharField(max_length=200, verbose_name="Entreprise")
    description = models.TextField(verbose_name="Description")
    requirements = models.TextField(verbose_name="Exigences")
    responsibilities = models.TextField(verbose_name="Responsabilités")
    
    # Job details
    job_type = models.CharField(max_length=20, choices=JOB_TYPES, verbose_name="Type de contrat")
    seniority = models.CharField(max_length=20, choices=SENIORITY_LEVELS, verbose_name="Niveau d'expérience")
    location = models.CharField(max_length=200, verbose_name="Localisation")
    city = models.CharField(max_length=100, verbose_name="Ville")
    remote = models.BooleanField(default=False, verbose_name="Télétravail possible")
    
    # Salary information
    salary_min = models.IntegerField(null=True, blank=True, verbose_name="Salaire minimum (MAD)")
    salary_max = models.IntegerField(null=True, blank=True, verbose_name="Salaire maximum (MAD)")
    salary_currency = models.CharField(max_length=3, default='MAD', verbose_name="Devise")
    
    # Skills and requirements
    required_skills = models.ManyToManyField(Skill, related_name='required_jobs', verbose_name="Compétences requises")
    preferred_skills = models.ManyToManyField(Skill, related_name='preferred_jobs', blank=True, verbose_name="Compétences préférées")
    tags = models.JSONField(default=list, verbose_name="Tags")
    
    # Status and metadata
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active', verbose_name="Statut")
    posted_at = models.DateTimeField(auto_now_add=True, verbose_name="Publié le")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Modifié le")
    expires_at = models.DateTimeField(null=True, blank=True, verbose_name="Expire le")
    
    # Contact information
    contact_email = models.EmailField(verbose_name="Email de contact")
    contact_phone = models.CharField(max_length=20, blank=True, verbose_name="Téléphone de contact")
    
    # Additional metadata
    benefits = models.TextField(blank=True, verbose_name="Avantages")
    company_size = models.CharField(max_length=50, blank=True, verbose_name="Taille de l'entreprise")
    industry = models.CharField(max_length=100, blank=True, verbose_name="Secteur d'activité")
    
    class Meta:
        ordering = ['-posted_at']
        verbose_name = "Offre d'emploi"
        verbose_name_plural = "Offres d'emploi"
    
    def __str__(self):
        return f"{self.title} - {self.company}"
    
    @property
    def salary_range(self):
        """Get formatted salary range"""
        if self.salary_min and self.salary_max:
            return f"{self.salary_min:,} - {self.salary_max:,} {self.salary_currency}"
        elif self.salary_min:
            return f"À partir de {self.salary_min:,} {self.salary_currency}"
        elif self.salary_max:
            return f"Jusqu'à {self.salary_max:,} {self.salary_currency}"
        return "Salaire non spécifié"
    
    @property
    def is_active(self):
        """Check if job is currently active"""
        if self.status != 'active':
            return False
        if self.expires_at and timezone.now() > self.expires_at:
            return False
        return True

class JobRecommendation(models.Model):
    """Job recommendations for candidates"""
    candidate = models.ForeignKey(CandidateProfile, on_delete=models.CASCADE, verbose_name="Candidat")
    job = models.ForeignKey(JobOffer, on_delete=models.CASCADE, verbose_name="Offre d'emploi")
    
    # Recommendation scores
    overall_score = models.FloatField(verbose_name="Score global")
    skill_match_score = models.FloatField(verbose_name="Score de correspondance des compétences")
    salary_fit_score = models.FloatField(verbose_name="Score d'adéquation salariale")
    location_match_score = models.FloatField(verbose_name="Score de correspondance de localisation")
    seniority_match_score = models.FloatField(verbose_name="Score de correspondance d'expérience")
    remote_bonus = models.FloatField(default=0, verbose_name="Bonus télétravail")
    
    # Recommendation metadata
    matched_skills = models.JSONField(default=list, verbose_name="Compétences correspondantes")
    missing_skills = models.JSONField(default=list, verbose_name="Compétences manquantes")
    recommendation_reason = models.TextField(blank=True, verbose_name="Raison de la recommandation")
    
    # Status and interaction
    status = models.CharField(
        max_length=20,
        choices=[
            ('new', 'Nouveau'),
            ('viewed', 'Consulté'),
            ('applied', 'Candidaté'),
            ('interested', 'Intéressé'),
            ('not_interested', 'Pas intéressé'),
        ],
        default='new',
        verbose_name="Statut"
    )
    
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Créé le")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Modifié le")
    
    class Meta:
        unique_together = ['candidate', 'job']
        ordering = ['-overall_score', '-created_at']
        verbose_name = "Recommandation d'emploi"
        verbose_name_plural = "Recommandations d'emploi"
    
    def __str__(self):
        return f"{self.candidate} - {self.job} ({self.overall_score:.1f}%)"

class UserJobPreference(models.Model):
    """User preferences for job recommendations"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, verbose_name="Utilisateur")
    
    # Location preferences
    preferred_cities = models.JSONField(default=list, verbose_name="Villes préférées")
    preferred_countries = models.JSONField(default=list, verbose_name="Pays préférés")
    accepts_remote = models.BooleanField(default=True, verbose_name="Accepte le télétravail")
    
    # Job type preferences
    preferred_job_types = models.JSONField(default=list, verbose_name="Types de contrat préférés")
    preferred_seniority = models.CharField(
        max_length=20,
        choices=JobOffer.SENIORITY_LEVELS,
        blank=True,
        verbose_name="Niveau d'expérience préféré"
    )
    
    # Salary preferences
    target_salary_min = models.IntegerField(null=True, blank=True, verbose_name="Salaire minimum cible (MAD)")
    target_salary_max = models.IntegerField(null=True, blank=True, verbose_name="Salaire maximum cible (MAD)")
    salary_currency = models.CharField(max_length=3, default='MAD', verbose_name="Devise préférée")
    
    # Skill preferences
    preferred_skills = models.ManyToManyField(Skill, blank=True, verbose_name="Compétences préférées")
    skill_weights = models.JSONField(default=dict, verbose_name="Poids des compétences")
    
    # Industry preferences
    preferred_industries = models.JSONField(default=list, verbose_name="Secteurs préférés")
    preferred_company_sizes = models.JSONField(default=list, verbose_name="Tailles d'entreprise préférées")
    
    # Recommendation settings
    max_recommendations = models.IntegerField(default=10, verbose_name="Nombre maximum de recommandations")
    min_score_threshold = models.FloatField(default=50.0, verbose_name="Score minimum pour recommandation")
    
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Créé le")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Modifié le")
    
    class Meta:
        verbose_name = "Préférences d'emploi"
        verbose_name_plural = "Préférences d'emploi"
    
    def __str__(self):
        return f"Préférences de {self.user.username}"

class JobApplication(models.Model):
    """Job applications by candidates"""
    STATUS_CHOICES = [
        ('applied', 'Candidature envoyée'),
        ('under_review', 'En cours d\'examen'),
        ('shortlisted', 'Présélectionné'),
        ('interview_scheduled', 'Entretien programmé'),
        ('interviewed', 'Entretien passé'),
        ('rejected', 'Rejeté'),
        ('accepted', 'Accepté'),
        ('withdrawn', 'Retiré'),
    ]
    
    candidate = models.ForeignKey(CandidateProfile, on_delete=models.CASCADE, verbose_name="Candidat")
    job = models.ForeignKey(JobOffer, on_delete=models.CASCADE, verbose_name="Offre d'emploi")
    recommendation = models.ForeignKey(
        JobRecommendation, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        verbose_name="Recommandation associée"
    )
    
    # Application details
    cover_letter = models.TextField(blank=True, verbose_name="Lettre de motivation")
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='applied', verbose_name="Statut")
    
    # Application metadata
    applied_at = models.DateTimeField(auto_now_add=True, verbose_name="Candidaté le")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Modifié le")
    notes = models.TextField(blank=True, verbose_name="Notes")
    
    class Meta:
        unique_together = ['candidate', 'job']
        ordering = ['-applied_at']
        verbose_name = "Candidature"
        verbose_name_plural = "Candidatures"
    
    def __str__(self):
        return f"{self.candidate} - {self.job} ({self.status})"