"""
Enhanced models for job recommendations with scoring weights and detailed tracking
"""
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from skills.models import Skill


class ScoringWeights(models.Model):
    """
    Configurable scoring weights for recommendation algorithm
    """
    name = models.CharField(max_length=100, default="Default Weights")
    is_active = models.BooleanField(default=True)
    
    # Core scoring weights - Updated for proportional test scoring
    skill_match_weight = models.FloatField(default=0.50, help_text="Weight for skill matching score (50%)")
    technical_test_weight = models.FloatField(default=0.30, help_text="Weight for technical test score (30%)")
    location_weight = models.FloatField(default=0.20, help_text="Weight for location match (20%)")
    
    # Legacy weights (kept for backward compatibility)
    content_similarity_weight = models.FloatField(default=0.00, help_text="Weight for content similarity score (disabled)")
    cluster_fit_weight = models.FloatField(default=0.00, help_text="Weight for cluster fit score (disabled)")
    
    # Skill type weights
    required_skill_weight = models.FloatField(default=0.80, help_text="Weight for required skills within skill matching")
    preferred_skill_weight = models.FloatField(default=0.20, help_text="Weight for preferred skills within skill matching")
    
    # Bonus weights
    location_bonus_weight = models.FloatField(default=0.05, help_text="Bonus for location match")
    experience_bonus_weight = models.FloatField(default=0.03, help_text="Bonus for experience level match")
    remote_bonus_weight = models.FloatField(default=0.02, help_text="Bonus for remote work")
    salary_fit_weight = models.FloatField(default=0.00, help_text="Weight for salary fit (disabled by default)")
    
    # Thresholds
    min_score_threshold = models.FloatField(default=15.0, help_text="Minimum score to include in recommendations")
    max_recommendations = models.IntegerField(default=10, help_text="Maximum number of recommendations")
    
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
            'location': self.location_weight,
            'content_similarity': self.content_similarity_weight,
            'cluster_fit': self.cluster_fit_weight,
            'required_skill_weight': self.required_skill_weight,
            'preferred_skill_weight': self.preferred_skill_weight,
            'location_bonus': self.location_bonus_weight,
            'experience_bonus': self.experience_bonus_weight,
            'remote_bonus': self.remote_bonus_weight,
            'salary_fit': self.salary_fit_weight,
            'min_score_threshold': self.min_score_threshold,
            'max_recommendations': self.max_recommendations
        }


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
    technical_test_score = models.FloatField(default=0.0, help_text="Technical test score (0-100)")
    location_score = models.FloatField(default=0.0, help_text="Location match score (0-100)")
    cluster_fit_score = models.FloatField(help_text="Cluster fit score (0-100)")
    
    # Skill breakdown
    required_skill_score = models.FloatField(help_text="Required skills match score (0-100)")
    preferred_skill_score = models.FloatField(help_text="Preferred skills match score (0-100)")
    required_skills_count = models.IntegerField(default=0)
    preferred_skills_count = models.IntegerField(default=0)
    required_matched_count = models.IntegerField(default=0)
    preferred_matched_count = models.IntegerField(default=0)
    
    # Test details
    passed_tests = models.IntegerField(default=0, help_text="Number of tests passed")
    total_relevant_tests = models.IntegerField(default=0, help_text="Total relevant tests for this job")
    test_proportion = models.FloatField(default=0.0, help_text="Proportion of tests passed (0-1)")
    
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
    Enhanced Job Offer model with additional fields for better recommendations
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
    salary_min = models.IntegerField(null=True, blank=True)
    salary_max = models.IntegerField(null=True, blank=True)
    remote = models.BooleanField(default=False)
    description = models.TextField()
    requirements = models.TextField(blank=True)
    benefits = models.TextField(blank=True)
    industry = models.CharField(max_length=100, blank=True)
    company_size = models.CharField(max_length=50, blank=True)
    tags = models.JSONField(default=list, blank=True)
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


class JobRecommendation(models.Model):
    """
    Job recommendation with enhanced tracking
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='job_recommendations')
    job_offer = models.ForeignKey(JobOffer, on_delete=models.CASCADE, related_name='recommendations', null=True, blank=True)
    score = models.FloatField(default=0.0, help_text="Overall recommendation score")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Additional tracking
    algorithm_version = models.CharField(max_length=50, default="enhanced_v1")
    cluster_id = models.IntegerField(null=True, blank=True, help_text="K-Means cluster ID")
    
    class Meta:
        verbose_name = "Job Recommendation"
        verbose_name_plural = "Job Recommendations"
        unique_together = ['user', 'job_offer']
        ordering = ['-score', '-created_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.job_offer.title} ({self.score:.1f}%)"


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

