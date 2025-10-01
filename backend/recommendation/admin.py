"""Minimal admin for the recommendation app.

Keep registrations minimal so Django can import admin during manage.py
operations even if the original admin implementation is missing or corrupted.
"""

from django.contrib import admin
from django.contrib.admin.sites import AlreadyRegistered


try:
    from .models import JobOffer, JobRecommendation, ScoringWeights
except Exception:
    JobOffer = JobRecommendation = ScoringWeights = None


def _safe_register(model):
    if model is None:
        return
    try:
        admin.site.register(model)
    except AlreadyRegistered:
        # model already registered elsewhere; ignore
        pass


_safe_register(JobOffer)
_safe_register(JobRecommendation)
_safe_register(ScoringWeights)