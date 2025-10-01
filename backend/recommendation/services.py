"""
Job recommendation services and algorithms
"""
import math
import logging
from typing import List, Dict, Tuple, Optional
from django.db.models import Q, F
from django.db import transaction
from django.utils import timezone
from datetime import timedelta

logger = logging.getLogger(__name__)

from .models import JobOffer, JobRecommendation, UserJobPreference
from skills.models import Skill, TestResult, CandidateProfile

class RecommendationEngine:
 """Main recommendation engine for job matching"""

 def __init__(self):
 self.skill_weights = {
 'programming': 1.0,
 'frontend': 0.9,
 'backend': 0.9,
 'database': 0.8,
 'devops': 0.8,
 'mobile': 0.7,
 'testing': 0.6,
 'other': 0.5
 }

 def calculate_skill_similarity(self, user_skills: List[Skill], job_skills: List[Skill]) -> Tuple[float, List[str], List[str]]:
 """
 Calculate skill similarity between user and job requirements

 Returns:
 - similarity_score: float between 0 and 1
 - matched_skills: list of skill names that match
 - missing_skills: list of required skills user doesn't have
 """
 if not job_skills:
 return 0.0, [], []

 user_skill_names = {skill.name.lower() for skill in user_skills}
 job_skill_names = {skill.name.lower() for skill in job_skills}

 # Find matches and missing skills
 matched_skills = list(user_skill_names.intersection(job_skill_names))
 missing_skills = list(job_skill_names - user_skill_names)

 # Calculate similarity score
 if not job_skill_names:
 return 0.0, matched_skills, missing_skills

 similarity_score = len(matched_skills) / len(job_skill_names)

 # Apply category weights
 weighted_score = 0.0
 total_weight = 0.0

 for skill in job_skills:
 weight = self.skill_weights.get(skill.category, 0.5)
 if skill.name.lower() in matched_skills:
 weighted_score += weight
 total_weight += weight

 if total_weight > 0:
 similarity_score = weighted_score / total_weight

 return similarity_score, matched_skills, missing_skills

 def calculate_salary_fit(self, user_prefs: UserJobPreference, job: JobOffer) -> float:
 """Calculate salary fit score between 0 and 1"""
 if not user_prefs.target_salary_min or not job.salary_min:
 return 0.5 # Neutral score if no salary data

 user_min = user_prefs.target_salary_min
 job_min = job.salary_min
 job_max = job.salary_max or job_min

 # If job salary range overlaps with user expectations
 if job_min <= user_min <= job_max:
 return 1.0
 elif job_min > user_min:
 # Job pays more than expected - good
 return min(1.0, 0.8 + (job_min - user_min) / user_min * 0.2)
 else:
 # Job pays less than expected
 return max(0.0, 0.5 - (user_min - job_max) / user_min * 0.5)

 def calculate_location_match(self, user_prefs: UserJobPreference, job: JobOffer) -> float:
 """Calculate location match score between 0 and 1"""
 if not user_prefs.preferred_cities:
 return 0.5 # Neutral if no location preferences

 job_city = job.city.lower()
 preferred_cities = [city.lower() for city in user_prefs.preferred_cities]

 # Exact match
 if job_city in preferred_cities:
 return 1.0

 # Partial match (city contains preferred city or vice versa)
 for preferred_city in preferred_cities:
 if preferred_city in job_city or job_city in preferred_city:
 return 0.7

 return 0.0

 def calculate_seniority_match(self, user_prefs: UserJobPreference, job: JobOffer) -> float:
 """Calculate seniority level match score between 0 and 1"""
 if not user_prefs.preferred_seniority or not job.seniority:
 return 0.5 # Neutral if no seniority data

 # Exact match
 if user_prefs.preferred_seniority == job.seniority:
 return 1.0

 # Seniority level hierarchy
 seniority_levels = ['junior', 'mid', 'senior', 'lead']
 user_level = seniority_levels.index(user_prefs.preferred_seniority)
 job_level = seniority_levels.index(job.seniority)

 # Close levels get partial score
 level_diff = abs(user_level - job_level)
 if level_diff == 1:
 return 0.7
 elif level_diff == 2:
 return 0.4
 else:
 return 0.1

 def calculate_remote_bonus(self, user_prefs: UserJobPreference, job: JobOffer) -> float:
 """Calculate remote work bonus score"""
 if not user_prefs.accepts_remote or not job.remote:
 return 0.0
 return 0.1 # 10% bonus for remote work match

 def calculate_experience_match(self, user_profile_data: Dict, job: JobOffer) -> float:
 """Calculate experience match score based on user profile experience"""
 if not user_profile_data.get('experience') or not job.seniority:
 return 0.5 # Neutral score if no data

 user_experience = user_profile_data['experience']
 if not user_experience:
 return 0.3 # Lower score if no experience

 # Calculate years of experience from user profile
 total_experience_years = 0
 for exp in user_experience:
 if exp.get('dateRange'):
 # Simple parsing of date range (e.g., "2020 - 2022")
 try:
 years = exp['dateRange'].split(' - ')
 if len(years) == 2:
 start_year = int(years[0])
 end_year = int(years[1]) if years[1] != 'Présent' else 2024
 total_experience_years += (end_year - start_year)
 except:
 continue

 # Map experience to seniority levels
 if total_experience_years >= 5:
 user_seniority = 'senior'
 elif total_experience_years >= 2:
 user_seniority = 'mid'
 else:
 user_seniority = 'junior'

 # Calculate match with job seniority
 seniority_levels = ['junior', 'mid', 'senior', 'lead']
 try:
 user_level = seniority_levels.index(user_seniority)
 job_level = seniority_levels.index(job.seniority)

 level_diff = abs(user_level - job_level)
 if level_diff == 0:
 return 1.0 # Perfect match
 elif level_diff == 1:
 return 0.7 # Close match
 elif level_diff == 2:
 return 0.4 # Partial match
 else:
 return 0.1 # Poor match
 except ValueError:
 return 0.5 # Neutral if seniority not found

 def calculate_education_match(self, user_profile_data: Dict, job: JobOffer) -> float:
 """Calculate education match score based on user profile education"""
 if not user_profile_data.get('education'):
 return 0.5 # Neutral score if no education data

 user_education = user_profile_data['education']
 if not user_education:
 return 0.3 # Lower score if no education

 # Check if user has relevant education
 # This is a simplified check - in a real system, you'd have more sophisticated matching
 education_keywords = ['master', 'bachelor', 'degree', 'diploma', 'certificate', 'university', 'college']

 for edu in user_education:
 program = edu.get('program', '').lower()
 school = edu.get('school', '').lower()

 # Check if education contains relevant keywords
 if any(keyword in program or keyword in school for keyword in education_keywords):
 return 0.8 # Good education match

 return 0.5 # Neutral score

 def calculate_job_score(self, candidate: CandidateProfile, job: JobOffer, user_prefs: Optional[UserJobPreference] = None, user_profile_data: Optional[Dict] = None) -> Dict:
 """
 Calculate comprehensive job match score

 Returns:
 Dictionary with scores and metadata
 """
 # Get user preferences or create default
 if not user_prefs:
 user_prefs, _ = UserJobPreference.objects.get_or_create(user=candidate.user)

 # Get candidate skills - use profile skills if provided, otherwise use database skills
 if user_profile_data and 'skillsWithProficiency' in user_profile_data:
 # Use skills with proficiency from user profile
 from skills.models import Skill
 user_skills = []
 for skill_data in user_profile_data['skillsWithProficiency']:
 skill_name = skill_data.get('name', skill_data) if isinstance(skill_data, dict) else skill_data
 skill, _ = Skill.objects.get_or_create(name=skill_name)
 user_skills.append(skill)
 elif user_profile_data and 'skills' in user_profile_data:
 # Use simple skills array from user profile
 from skills.models import Skill
 user_skills = []
 for skill_name in user_profile_data['skills']:
 skill, _ = Skill.objects.get_or_create(name=skill_name)
 user_skills.append(skill)
 else:
 user_skills = list(candidate.skills.all())

 job_required_skills = list(job.required_skills.all())
 job_preferred_skills = list(job.preferred_skills.all())

 # Calculate skill similarity (60% weight)
 skill_score, matched_skills, missing_skills = self.calculate_skill_similarity(
 user_skills, job_required_skills
 )

 # Add preferred skills bonus
 preferred_matches = 0
 if job_preferred_skills:
 user_skill_names = {skill.name.lower() for skill in user_skills}
 preferred_matches = sum(1 for skill in job_preferred_skills
 if skill.name.lower() in user_skill_names)
 skill_score += (preferred_matches / len(job_preferred_skills)) * 0.2

 skill_score = min(1.0, skill_score)

 # Calculate other factors
 salary_fit = self.calculate_salary_fit(user_prefs, job)
 location_match = self.calculate_location_match(user_prefs, job)
 seniority_match = self.calculate_seniority_match(user_prefs, job)
 remote_bonus = self.calculate_remote_bonus(user_prefs, job)

 # Calculate experience and education match if profile data is available
 experience_match = 0.5 # Default neutral score
 education_match = 0.5 # Default neutral score

 if user_profile_data:
 experience_match = self.calculate_experience_match(user_profile_data, job)
 education_match = self.calculate_education_match(user_profile_data, job)

 # Calculate overall score with weights
 overall_score = (
 skill_score * 0.4 + # Skills are most important
 experience_match * 0.2 + # Experience is very important
 education_match * 0.1 + # Education adds value
 salary_fit * 0.15 + # Salary fit
 location_match * 0.1 + # Location preference
 seniority_match * 0.05 + # Seniority match
 remote_bonus # Remote work bonus
 )

 # Generate professional recommendation reason
 reasons = []

 # Skills analysis
 if skill_score > 0.8:
 reasons.append("Excellent match des compétences techniques")
 elif skill_score > 0.6:
 reasons.append("Bon match des compétences requises")
 elif skill_score > 0.4:
 reasons.append("Match partiel des compétences")
 else:
 reasons.append("Compétences à développer")

 # Experience analysis
 if experience_match > 0.8:
 reasons.append("Expérience parfaitement adaptée")
 elif experience_match > 0.6:
 reasons.append("Expérience bien alignée")
 elif experience_match > 0.4:
 reasons.append("Expérience partiellement pertinente")

 # Education analysis
 if education_match > 0.8:
 reasons.append("Formation très pertinente")
 elif education_match > 0.6:
 reasons.append("Formation adaptée")

 # Salary analysis
 if salary_fit > 0.8:
 reasons.append("Salaire très attractif")
 elif salary_fit > 0.6:
 reasons.append("Salaire correspondant aux attentes")
 elif salary_fit < 0.4:
 reasons.append("Salaire en dessous des attentes")

 # Location analysis
 if location_match > 0.8:
 reasons.append("Localisation idéale")
 elif location_match > 0.6:
 reasons.append("Localisation convenable")

 # Remote work bonus
 if job.remote and user_prefs.accepts_remote:
 reasons.append("Possibilité de télétravail")

 # Skills details
 if len(matched_skills) > 0:
 reasons.append(f"Compétences correspondantes: {', '.join(matched_skills[:3])}")

 return {
 'overall_score': overall_score,
 'skill_match_score': skill_score,
 'experience_match_score': experience_match,
 'education_match_score': education_match,
 'salary_fit_score': salary_fit,
 'location_match_score': location_match,
 'seniority_match_score': seniority_match,
 'remote_bonus': remote_bonus,
 'matched_skills': matched_skills,
 'missing_skills': missing_skills,
 'recommendation_reason': '; '.join(reasons) if reasons else "Recommandation basée sur le profil complet"
 }

 def generate_recommendations(self, candidate: CandidateProfile, limit: int = 10, user_profile_data: Optional[Dict] = None) -> List[JobRecommendation]:
 """
 Generate job recommendations for a candidate
 """
 # Get user preferences
 user_prefs, _ = UserJobPreference.objects.get_or_create(user=candidate.user)

 # Get active jobs
 active_jobs = JobOffer.objects.filter(
 status='active',
 expires_at__gt=timezone.now()
 ).exclude(
 jobrecommendation__candidate=candidate
 )

 recommendations = []

 for job in active_jobs:
 try:
 # Calculate job score
 score_data = self.calculate_job_score(candidate, job, user_prefs, user_profile_data)

 # Only recommend if score meets threshold
 if score_data['overall_score'] * 100 >= user_prefs.min_score_threshold:
 # Create or update recommendation with transaction
 with transaction.atomic():
 recommendation, created = JobRecommendation.objects.update_or_create(
 candidate=candidate,
 job=job,
 defaults={
 'overall_score': score_data['overall_score'] * 100,
 'skill_match_score': score_data['skill_match_score'] * 100,
 'salary_fit_score': score_data['salary_fit_score'] * 100,
 'location_match_score': score_data['location_match_score'] * 100,
 'seniority_match_score': score_data['seniority_match_score'] * 100,
 'remote_bonus': score_data['remote_bonus'] * 100,
 'matched_skills': score_data['matched_skills'],
 'missing_skills': score_data['missing_skills'],
 'recommendation_reason': score_data['recommendation_reason'],
 'status': 'new'
 }
 )
 recommendations.append(recommendation)
 except Exception as e:
 # Log error but continue with other jobs
 logger.warning(f"Failed to create recommendation for job {job.id}: {str(e)}")
 continue

 # Sort by score and return top recommendations
 recommendations.sort(key=lambda x: x.overall_score, reverse=True)
 return recommendations[:limit]

 def update_recommendations_for_job(self, job: JobOffer):
 """Update recommendations for all candidates when a job is updated"""
 candidates = CandidateProfile.objects.all()

 for candidate in candidates:
 # Remove existing recommendation for this job
 JobRecommendation.objects.filter(
 candidate=candidate,
 job=job
 ).delete()

 # Generate new recommendation
 user_prefs, _ = UserJobPreference.objects.get_or_create(user=candidate.user)
 score_data = self.calculate_job_score(candidate, job, user_prefs)

 if score_data['overall_score'] * 100 >= 50: # Default threshold
 JobRecommendation.objects.create(
 candidate=candidate,
 job=job,
 overall_score=score_data['overall_score'] * 100,
 skill_match_score=score_data['skill_match_score'] * 100,
 salary_fit_score=score_data['salary_fit_score'] * 100,
 location_match_score=score_data['location_match_score'] * 100,
 seniority_match_score=score_data['seniority_match_score'] * 100,
 remote_bonus=score_data['remote_bonus'] * 100,
 matched_skills=score_data['matched_skills'],
 missing_skills=score_data['missing_skills'],
 recommendation_reason=score_data['recommendation_reason'],
 status='new'
 )

class SkillAnalyzer:
 """Analyze user skills from test results and profile"""

 @staticmethod
 def get_user_skill_vector(candidate: CandidateProfile) -> Dict[str, float]:
 """
 Build user skill vector from test results and profile skills
 """
 skill_scores = {}

 # Get test results for this candidate
 test_results = TestResult.objects.filter(
 candidate=candidate,
 status='completed'
 ).select_related('test__skill')

 # Calculate skill scores from test performance
 for result in test_results:
 skill = result.test.skill
 if skill:
 # Calculate score based on test performance
 score = result.percentage / 100.0

 # Apply recency weighting (recent tests have more weight)
 days_ago = (timezone.now() - result.completed_at).days
 recency_factor = math.exp(-days_ago / 180) # 6-month half-life

 weighted_score = score * recency_factor

 # Update skill score (take maximum)
 skill_scores[skill.name] = max(
 skill_scores.get(skill.name, 0),
 weighted_score
 )

 # Add profile skills with base score
 for skill in candidate.skills.all():
 if skill.name not in skill_scores:
 skill_scores[skill.name] = 0.5 # Base score for profile skills

 return skill_scores

 @staticmethod
 def get_top_skills(candidate: CandidateProfile, limit: int = 5) -> List[Dict]:
 """
 Get top skills for a candidate based on test performance
 """
 skill_vector = SkillAnalyzer.get_user_skill_vector(candidate)

 # Sort by score and return top skills
 sorted_skills = sorted(
 skill_vector.items(),
 key=lambda x: x[1],
 reverse=True
 )

 return [
 {'name': name, 'score': score, 'level': SkillAnalyzer.get_skill_level(score)}
 for name, score in sorted_skills[:limit]
 ]

 @staticmethod
 def get_skill_level(score: float) -> str:
 """Convert score to skill level"""
 if score >= 0.9:
 return 'Expert'
 elif score >= 0.7:
 return 'Avancé'
 elif score >= 0.5:
 return 'Intermédiaire'
 else:
 return 'Débutant'
