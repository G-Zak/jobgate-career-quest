"""Minimal, clean models for the recommendation app used during development.

This file provides a compact set of definitions so Django can import the
app during development. It intentionally avoids complex logic and keeps
fields minimal. Expand later as needed.
"""

from django.db import models
from django.contrib.auth import get_user_model


User = get_user_model()


class ScoringWeights(models.Model):
    """Simple scoring weight container."""

    name = models.CharField(max_length=100, default="default")
    is_active = models.BooleanField(default=True)
    skill_match_weight = models.FloatField(default=0.3)
    technical_test_weight = models.FloatField(default=0.25)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Scoring Weights"
        verbose_name_plural = "Scoring Weights"

    def __str__(self):
        return f"{self.name} ({'Active' if self.is_active else 'Inactive'})"


class JobOffer(models.Model):
    """Minimal JobOffer used by recommendation details."""

    title = models.CharField(max_length=200)
    company = models.CharField(max_length=200)
    posted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} at {self.company}"


class JobRecommendationDetail(models.Model):
    """A lightweight detail model for job recommendation results."""

    job_offer = models.ForeignKey(JobOffer, on_delete=models.CASCADE, related_name="recommendation_details")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="recommendation_details")
    overall_score = models.FloatField(default=0.0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Job Recommendation Detail"
        verbose_name_plural = "Job Recommendation Details"

    def __str__(self):
        return f"{self.user} - {self.job_offer.title} ({self.overall_score:.1f})"

