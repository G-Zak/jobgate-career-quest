"""
Enhanced models for job recommendations with cognitive skills, technical tests, and K-Means clustering
"""
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from skills.models import Skill, TechnicalTest


class ScoringWeights(models.Model):
    """
    Configurable scoring weights for recommendation algorithm - Enhanced for technical tests and cognitive skills
    """
    name = models.CharField(max_length=100, default="default")
    is_active = models.BooleanField(default=True)

    # Core scoring weights (must sum to reasonable total)
    skill_match_weight = models.FloatField(default=0.30, help_text="Weight for skill matching score")
    technical_test_weight = models.FloatField(default=0.25, help_text="Weight for technical test performance")
    experience_weight = models.FloatField(default=0.15, help_text="Weight for experience level match")
    salary_weight = models.FloatField(default=0.10, help_text="Weight for salary fit")
    location_weight = models.FloatField(default=0.10, help_text="Weight for location match")
    cluster_fit_weight = models.FloatField(default=0.10, help_text="Weight for K-Means cluster fit")

    # Technical test configuration
    test_pass_threshold = models.FloatField(default=70.0, help_text="Minimum score to consider test passed")
    technical_test_default_weights = models.JSONField(
        default=dict,
        blank=True,
        help_text="Default weights for different technical tests {skill_name: weight}"
    )

    # Cognitive/employability scoring
    employability_weight = models.FloatField(default=0.05, help_text="Weight for cognitive/employability score")

    # Skill type weights (within skill matching)
    required_skill_weight = models.FloatField(default=1.0, help_text="Weight for required skills")
    preferred_skill_weight = models.FloatField(default=0.5, help_text="Weight for preferred skills")

    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        verbose_name = "Scoring Weights"
        verbose_name_plural = "Scoring Weights"
        ordering = ['-is_active', '-created_at']

    def __str__(self):
        return f"{self.name} ({'Active' if self.is_active else 'Inactive'})"

    def get_weights_dict(self):
        """Return weights as dictionary for easy use"""
        return {
            'skill_match': self.skill_match_weight,
            'technical_test': self.technical_test_weight,
            'experience': self.experience_weight,
            'salary': self.salary_weight,
            'location': self.location_weight,
            'cluster_fit': self.cluster_fit_weight,
            'employability': self.employability_weight,
            'required_skill_weight': self.required_skill_weight,
            'preferred_skill_weight': self.preferred_skill_weight,
            'test_pass_threshold': self.test_pass_threshold,
            'technical_test_default_weights': self.technical_test_default_weights
        }


class SkillTechnicalTestMapping(models.Model):
    """
    Mapping between skills and technical tests for job recommendations
    """
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE, related_name='technical_test_mappings')
    technical_test = models.ForeignKey(TechnicalTest, on_delete=models.CASCADE, related_name='skill_mappings')
    default_weight = models.FloatField(default=1.0, help_text="Default weight for this skill-test mapping")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Skill-Technical Test Mapping"
        verbose_name_plural = "Skill-Technical Test Mappings"
        unique_together = ['skill', 'technical_test']
        ordering = ['skill__name', 'technical_test__test_name']

    def __str__(self):
        return f"{self.skill.name} -> {self.technical_test.test_name} (weight: {self.default_weight})"


class ClusterCenters(models.Model):
    """
    Store K-Means cluster centers for job-candidate matching
    """
    algorithm_version = models.CharField(max_length=50, default="kmeans_v1")
    n_clusters = models.IntegerField(help_text="Number of clusters")
    centers = models.JSONField(help_text="List of cluster centers (arrays)")
    trained_at = models.DateTimeField(auto_now_add=True)
    training_metadata = models.JSONField(
        default=dict,
        blank=True,
        help_text="Metadata about training: feature names, normalization params, etc."
    )

    # Training statistics
    inertia = models.FloatField(null=True, blank=True, help_text="K-Means inertia score")
    silhouette_score = models.FloatField(null=True, blank=True, help_text="Silhouette analysis score")
    n_samples_trained = models.IntegerField(default=0, help_text="Number of samples used for training")

    is_active = models.BooleanField(default=True, help_text="Whether this model is currently active")

    class Meta:
        verbose_name = "Cluster Centers"
        verbose_name_plural = "Cluster Centers"
        ordering = ['-trained_at']

    def __str__(self):
        return f"{self.algorithm_version} - {self.n_clusters} clusters ({self.trained_at.strftime('%Y-%m-%d')})"


class JobRecommendationDetail(models.Model):
    """
    Detailed breakdown of job recommendation scores for transparency
    """
    job_offer = models.ForeignKey('JobOffer', on_delete=models.CASCADE, related_name='recommendation_details')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='recommendation_details')
    
    # Overall scores
    overall_score = models.FloatField(help_text="Overall recommendation score (0-100)")
    content_score = models.FloatField(help_text="Content similarity score (0-100)")
    skill_score = models.FloatField(help_text="Skill matching score (0-100)")
    cluster_fit_score = models.FloatField(help_text="Cluster fit score (0-100)")
    
    # Skill breakdown
    required_skill_score = models.FloatField(help_text="Required skills match score (0-100)")
    preferred_skill_score = models.FloatField(help_text="Preferred skills match score (0-100)")
    required_skills_count = models.IntegerField(default=0)
    preferred_skills_count = models.IntegerField(default=0)
    required_matched_count = models.IntegerField(default=0)
    preferred_matched_count = models.IntegerField(default=0)
    
    # Bonuses
    location_bonus = models.FloatField(default=0.0, help_text="Location match bonus")
    experience_bonus = models.FloatField(default=0.0, help_text="Experience level bonus")
    remote_bonus = models.FloatField(default=0.0, help_text="Remote work bonus")
    salary_fit = models.FloatField(default=0.0, help_text="Salary fit score")
    
    # Matched skills (stored as JSON)
    matched_skills = models.JSONField(default=list, help_text="List of matched skills")
    missing_skills = models.JSONField(default=list, help_text="List of missing skills")
    required_matched_skills = models.JSONField(default=list, help_text="Required skills that matched")
    preferred_matched_skills = models.JSONField(default=list, help_text="Preferred skills that matched")
    required_missing_skills = models.JSONField(default=list, help_text="Required skills that didn't match")
    preferred_missing_skills = models.JSONField(default=list, help_text="Preferred skills that didn't match")
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Job Recommendation Detail"
        verbose_name_plural = "Job Recommendation Details"
        unique_together = ['job_offer', 'user']
        ordering = ['-overall_score', '-created_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.job_offer.title} ({self.overall_score:.1f}%)"
    
    def get_skill_match_percentage(self):
        """Calculate overall skill match percentage"""
        total_skills = self.required_skills_count + self.preferred_skills_count
        if total_skills == 0:
            return 0
        return (self.required_matched_count + self.preferred_matched_count) / total_skills * 100
    
    def get_required_skill_match_percentage(self):
        """Calculate required skill match percentage"""
        if self.required_skills_count == 0:
            return 0
        return self.required_matched_count / self.required_skills_count * 100
    
    def get_preferred_skill_match_percentage(self):
        """Calculate preferred skill match percentage"""
        if self.preferred_skills_count == 0:
            return 0
        return self.preferred_matched_count / self.preferred_skills_count * 100


class JobOffer(models.Model):
    """
    Enhanced Job Offer model with additional fields for better recommendations - Morocco context
    """
    JOB_TYPE_CHOICES = [
        ('full-time', 'Full Time'),
        ('part-time', 'Part Time'),
        ('contract', 'Contract'),
        ('internship', 'Internship'),
        ('freelance', 'Freelance'),
    ]

    SENIORITY_CHOICES = [
        ('junior', 'Junior'),
        ('intermediate', 'Intermediate'),
        ('senior', 'Senior'),
        ('lead', 'Lead'),
        ('principal', 'Principal'),
        ('expert', 'Expert'),
    ]

    title = models.CharField(max_length=200)
    company = models.CharField(max_length=200)
    location = models.CharField(max_length=200)
    city = models.CharField(max_length=100, blank=True)
    job_type = models.CharField(max_length=20, choices=JOB_TYPE_CHOICES, default='full-time')
    seniority = models.CharField(max_length=20, choices=SENIORITY_CHOICES, blank=True)
    salary_min = models.IntegerField(null=True, blank=True, help_text="Salary in MAD")
    salary_max = models.IntegerField(null=True, blank=True, help_text="Salary in MAD")
    currency = models.CharField(max_length=3, default='MAD', help_text="Currency code")
    remote_flag = models.BooleanField(default=False, help_text="Remote work available")
    description = models.TextField()
    requirements = models.TextField(blank=True)
    benefits = models.TextField(blank=True)
    industry = models.CharField(max_length=100, blank=True)
    company_size = models.CharField(max_length=50, blank=True)
    tags = models.JSONField(default=list, blank=True)

    # Source tracking for seeded data
    source_id = models.CharField(max_length=100, blank=True, help_text="External source ID")
    source_type = models.CharField(max_length=50, default='manual', help_text="Source type: manual, seed, api, etc.")

    status = models.CharField(max_length=20, default='active', choices=[
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('closed', 'Closed'),
    ])
    posted_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Skills relationships
    required_skills = models.ManyToManyField(Skill, related_name='required_jobs', blank=True)
    preferred_skills = models.ManyToManyField(Skill, related_name='preferred_jobs', blank=True)

    class Meta:
        verbose_name = "Job Offer"
        verbose_name_plural = "Job Offers"
        ordering = ['-posted_at']

    def __str__(self):
        return f"{self.title} at {self.company}"

    def get_all_skills(self):
        """Get all skills (required + preferred)"""
        return list(self.required_skills.all()) + list(self.preferred_skills.all())

    def get_skill_names(self):
        """Get skill names as list"""
        return [skill.name for skill in self.get_all_skills()]

    def get_relevant_technical_tests(self):
        """Get technical tests relevant to this job based on required and preferred skills"""
        from skills.models import TechnicalTest

        all_skills = self.get_all_skills()
        skill_ids = [skill.id for skill in all_skills]

        # Get technical tests mapped to these skills
        mappings = SkillTechnicalTestMapping.objects.filter(skill_id__in=skill_ids).select_related('technical_test')

        # Return list of (technical_test, weight, is_required) tuples
        relevant_tests = []
        for mapping in mappings:
            is_required = mapping.skill in self.required_skills.all()
            weight = mapping.default_weight if is_required else mapping.default_weight * 0.5
            relevant_tests.append((mapping.technical_test, weight, is_required))

        return relevant_tests


class JobRecommendation(models.Model):
    """
    Enhanced Job recommendation with technical tests, cognitive skills, and detailed breakdown
    """
    candidate_id = models.IntegerField(help_text="Candidate ID (User ID)")
    job_offer = models.ForeignKey(JobOffer, on_delete=models.CASCADE, related_name='recommendations')

    # Core scores (0-1 normalized)
    overall_score = models.FloatField(default=0.0, help_text="Overall recommendation score (0-1)")
    technical_test_score = models.FloatField(default=0.0, help_text="Technical test performance score (0-1)")
    skill_match_score = models.FloatField(default=0.0, help_text="Skill matching score (0-1)")
    experience_score = models.FloatField(default=0.0, help_text="Experience level match score (0-1)")
    salary_score = models.FloatField(default=0.0, help_text="Salary fit score (0-1)")
    location_score = models.FloatField(default=0.0, help_text="Location match score (0-1)")
    cluster_fit_score = models.FloatField(default=0.0, help_text="K-Means cluster fit score (0-1)")

    # Detailed breakdown stored as JSON
    breakdown = models.JSONField(
        default=dict,
        help_text="Detailed breakdown: matched_skills, missing_skills, test_ids_and_scores, passed_ratio, etc."
    )

    # Algorithm tracking
    algorithm_version = models.CharField(max_length=50, default="cognitive_kmeans_v1")
    computed_at = models.DateTimeField(auto_now=True)
    weights_snapshot_id = models.IntegerField(null=True, blank=True, help_text="ScoringWeights ID used")
    source_snapshot_id = models.CharField(max_length=100, blank=True, help_text="Source data snapshot ID")

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Job Recommendation"
        verbose_name_plural = "Job Recommendations"
        unique_together = ['candidate_id', 'job_offer']
        ordering = ['-overall_score', '-computed_at']
        indexes = [
            models.Index(fields=['candidate_id', '-overall_score']),
            models.Index(fields=['job_offer', '-overall_score']),
            models.Index(fields=['computed_at']),
        ]

    def __str__(self):
        return f"Candidate {self.candidate_id} - {self.job_offer.title} ({self.overall_score:.3f})"

    def get_user(self):
        """Get User object from candidate_id"""
        try:
            return User.objects.get(id=self.candidate_id)
        except User.DoesNotExist:
            return None


class RecommendationAudit(models.Model):
    """
    Audit trail for recommendation changes
    """
    recommendation = models.ForeignKey(JobRecommendation, on_delete=models.CASCADE, related_name='audit_trail')
    candidate_id = models.IntegerField()
    job_offer = models.ForeignKey(JobOffer, on_delete=models.CASCADE)

    old_overall_score = models.FloatField(null=True, blank=True)
    new_overall_score = models.FloatField()

    changed_at = models.DateTimeField(auto_now_add=True)
    reason = models.CharField(max_length=200, help_text="Reason for change: weights_updated, new_test_result, etc.")

    # Additional context
    algorithm_version = models.CharField(max_length=50, blank=True)
    weights_snapshot_id = models.IntegerField(null=True, blank=True)

    class Meta:
        verbose_name = "Recommendation Audit"
        verbose_name_plural = "Recommendation Audits"
        ordering = ['-changed_at']

    def __str__(self):
        return f"Candidate {self.candidate_id} - {self.job_offer.title} - {self.reason}"


class UserJobPreference(models.Model):
    """
    User job preferences for better recommendations
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='job_preferences')
    
    # Location preferences
    preferred_locations = models.JSONField(default=list, help_text="List of preferred cities/countries")
    willing_to_relocate = models.BooleanField(default=True)
    
    # Job type preferences
    preferred_job_types = models.JSONField(default=list, help_text="Preferred job types")
    preferred_seniority = models.CharField(max_length=20, blank=True)
    
    # Salary preferences
    target_salary_min = models.IntegerField(null=True, blank=True)
    target_salary_max = models.IntegerField(null=True, blank=True)
    
    # Remote work preferences
    remote_preference = models.CharField(max_length=20, default='flexible', choices=[
        ('remote', 'Remote Only'),
        ('hybrid', 'Hybrid'),
        ('office', 'Office Only'),
        ('flexible', 'Flexible'),
    ])
    
    # Industry preferences
    preferred_industries = models.JSONField(default=list, help_text="Preferred industries")
    
    # Company size preferences
    preferred_company_sizes = models.JSONField(default=list, help_text="Preferred company sizes")
    
    # Skill preferences
    skill_priorities = models.JSONField(default=dict, help_text="Skill importance weights")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "User Job Preference"
        verbose_name_plural = "User Job Preferences"
    
    def __str__(self):
        return f"{self.user.username} Job Preferences"


class RecommendationAnalytics(models.Model):
    """
    Analytics for recommendation system performance
    """
    date = models.DateField(default=timezone.now)
    
    # Recommendation metrics
    total_recommendations = models.IntegerField(default=0)
    avg_score = models.FloatField(default=0.0)
    min_score = models.FloatField(default=0.0)
    max_score = models.FloatField(default=0.0)
    
    # Skill matching metrics
    avg_skill_match = models.FloatField(default=0.0)
    avg_required_skill_match = models.FloatField(default=0.0)
    avg_preferred_skill_match = models.FloatField(default=0.0)
    
    # Cluster metrics
    cluster_distribution = models.JSONField(default=dict, help_text="Distribution of jobs across clusters")
    avg_cluster_fit = models.FloatField(default=0.0)
    
    # User engagement
    recommendations_viewed = models.IntegerField(default=0)
    applications_from_recommendations = models.IntegerField(default=0)
    jobs_saved_from_recommendations = models.IntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = "Recommendation Analytics"
        verbose_name_plural = "Recommendation Analytics"
        unique_together = ['date']
        ordering = ['-date']
    
    def __str__(self):
        return f"Analytics for {self.date} ({self.total_recommendations} recommendations)"


class SavedJob(models.Model):
    """
    Model to track jobs saved by users
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='saved_jobs')
    job_id = models.IntegerField(help_text="ID of the saved job")
    job_title = models.CharField(max_length=200, blank=True, help_text="Title of the saved job")
    job_company = models.CharField(max_length=200, blank=True, help_text="Company of the saved job")
    saved_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = "Saved Job"
        verbose_name_plural = "Saved Jobs"
        ordering = ['-saved_at']
        unique_together = ('user', 'job_id')
    
    def __str__(self):
        return f"{self.user.username} saved job {self.job_id}"


class JobApplication(models.Model):
    """
    Model to track job applications by users
    """
    STATUS_CHOICES = [
        ('applied', 'Applied'),
        ('under_review', 'Under Review'),
        ('shortlisted', 'Shortlisted'),
        ('interview_scheduled', 'Interview Scheduled'),
        ('interviewed', 'Interviewed'),
        ('rejected', 'Rejected'),
        ('accepted', 'Accepted'),
        ('withdrawn', 'Withdrawn'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='job_applications')
    job_id = models.IntegerField(help_text="ID of the job being applied to")
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='applied')
    cover_letter = models.TextField(blank=True, help_text="Cover letter for the application")
    resume_url = models.URLField(blank=True, help_text="URL to the resume file")
    applied_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    notes = models.TextField(blank=True, help_text="Additional notes about the application")
    
    class Meta:
        verbose_name = "Job Application"
        verbose_name_plural = "Job Applications"
        ordering = ['-applied_at']
        unique_together = ('user', 'job_id')
    
    def __str__(self):
        return f"{self.user.username} applied to job {self.job_id}"

