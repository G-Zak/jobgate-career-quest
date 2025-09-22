#!/usr/bin/env python
"""
Debug script to test recommendation generation
"""
import os
import sys
import django

# Add the backend directory to the Python path
sys.path.append('backend')

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'careerquest.settings')
django.setup()

from recommendation.services import RecommendationEngine
from recommendation.models import JobOffer, JobRecommendation
from skills.models import CandidateProfile, Skill
from django.contrib.auth.models import User

def debug_recommendations():
    print("=== Debugging Recommendation System ===")
    
    # Check job offers
    job_count = JobOffer.objects.count()
    print(f"Job offers: {job_count}")
    
    if job_count > 0:
        job = JobOffer.objects.first()
        print(f"Sample job: {job.title} - {job.company}")
        print(f"Job skills: {[skill.name for skill in job.required_skills.all()]}")
    
    # Check candidates
    candidate_count = CandidateProfile.objects.count()
    print(f"Candidates: {candidate_count}")
    
    if candidate_count > 0:
        candidate = CandidateProfile.objects.first()
        print(f"Sample candidate: {candidate.first_name} {candidate.last_name}")
        print(f"Candidate skills: {[skill.name for skill in candidate.skills.all()]}")
    
    # Check skills
    skill_count = Skill.objects.count()
    print(f"Skills: {skill_count}")
    
    if skill_count > 0:
        skills = Skill.objects.all()[:5]
        print(f"Sample skills: {[skill.name for skill in skills]}")
    
    # Test recommendation generation
    if candidate_count > 0 and job_count > 0:
        try:
            engine = RecommendationEngine()
            candidate = CandidateProfile.objects.first()
            
            print(f"\n=== Testing with candidate: {candidate.first_name} ===")
            
            # Test with first job
            job = JobOffer.objects.first()
            print(f"Testing with job: {job.title}")
            
            # Get user preferences
            from recommendation.models import UserJobPreference
            user_prefs, created = UserJobPreference.objects.get_or_create(user=candidate.user)
            print(f"User preferences: min_score={user_prefs.min_score_threshold}")
            
            # Calculate score
            score_data = engine.calculate_job_score(candidate, job, user_prefs)
            print(f"Score data: {score_data}")
            
            # Generate recommendations
            recommendations = engine.generate_recommendations(candidate, 5)
            print(f"Generated recommendations: {len(recommendations)}")
            
            for i, rec in enumerate(recommendations):
                print(f"  {i+1}. {rec.job.title} - Score: {rec.overall_score}")
                
        except Exception as e:
            print(f"Error during recommendation generation: {e}")
            import traceback
            traceback.print_exc()
    
    # Check existing recommendations
    rec_count = JobRecommendation.objects.count()
    print(f"\nExisting recommendations: {rec_count}")
    
    if rec_count > 0:
        recs = JobRecommendation.objects.all()[:3]
        for rec in recs:
            print(f"  - {rec.job.title} for {rec.candidate.first_name} (Score: {rec.overall_score})")

if __name__ == "__main__":
    debug_recommendations()
