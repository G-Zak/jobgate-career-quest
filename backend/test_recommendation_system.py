#!/usr/bin/env python
"""
Test script for the recommendation system
"""
import os
import sys
import django

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'careerquest.settings')
django.setup()

from django.contrib.auth.models import User
from skills.models import Skill, CandidateProfile
from recommendation.models import JobOffer, UserJobPreference
from recommendation.services import RecommendationEngine, SkillAnalyzer


def create_test_data():
    """Create test data for the recommendation system"""
    print("Creating test data...")
    
    # Create test user
    user, created = User.objects.get_or_create(
        username='testuser',
        defaults={'email': 'test@example.com'}
    )
    if created:
        user.set_password('testpass123')
        user.save()
        print("✓ Created test user")
    else:
        print("✓ Test user already exists")
    
    # Create candidate profile
    candidate, created = CandidateProfile.objects.get_or_create(
        user=user,
        defaults={
            'first_name': 'Test',
            'last_name': 'User',
            'email': 'test@example.com'
        }
    )
    if created:
        print("✓ Created candidate profile")
    else:
        print("✓ Candidate profile already exists")
    
    # Create skills
    skills_data = [
        ('Python', 'programming'),
        ('JavaScript', 'frontend'),
        ('Django', 'backend'),
        ('React', 'frontend'),
        ('PostgreSQL', 'database'),
        ('Docker', 'devops'),
        ('Git', 'other')
    ]
    
    created_skills = []
    for name, category in skills_data:
        skill, created = Skill.objects.get_or_create(
            name=name,
            defaults={'category': category, 'description': f'{name} skill'}
        )
        created_skills.append(skill)
        if created:
            print(f"✓ Created skill: {name}")
    
    # Add some skills to candidate
    candidate.skills.add(*created_skills[:4])  # Python, JavaScript, Django, React
    print("✓ Added skills to candidate")
    
    # Create user preferences
    prefs, created = UserJobPreference.objects.get_or_create(
        user=user,
        defaults={
            'preferred_cities': ['Casablanca', 'Rabat'],
            'accepts_remote': True,
            'preferred_job_types': ['CDI', 'CDD'],
            'preferred_seniority': 'mid',
            'target_salary_min': 10000,
            'target_salary_max': 20000
        }
    )
    if created:
        print("✓ Created user preferences")
    else:
        print("✓ User preferences already exist")
    
    # Create sample jobs
    jobs_data = [
        {
            'title': 'Développeur Python Senior',
            'company': 'TechCorp Morocco',
            'description': 'Développeur Python expérimenté pour notre équipe backend',
            'requirements': 'Python, Django, PostgreSQL, Docker',
            'responsibilities': 'Développement d\'APIs, maintenance du code',
            'job_type': 'CDI',
            'seniority': 'senior',
            'location': 'Casablanca, Maroc',
            'city': 'Casablanca',
            'remote': True,
            'salary_min': 15000,
            'salary_max': 25000,
            'contact_email': 'hr@techcorp.ma',
            'required_skills': ['Python', 'Django', 'PostgreSQL']
        },
        {
            'title': 'Développeur React.js',
            'company': 'Digital Agency',
            'description': 'Développeur frontend React.js pour notre équipe créative',
            'requirements': 'React.js, JavaScript, HTML5, CSS3',
            'responsibilities': 'Développement d\'interfaces utilisateur',
            'job_type': 'CDI',
            'seniority': 'mid',
            'location': 'Rabat, Maroc',
            'city': 'Rabat',
            'remote': False,
            'salary_min': 8000,
            'salary_max': 15000,
            'contact_email': 'jobs@digitalagency.ma',
            'required_skills': ['React', 'JavaScript']
        },
        {
            'title': 'DevOps Engineer',
            'company': 'Cloud Solutions',
            'description': 'Ingénieur DevOps pour gérer notre infrastructure cloud',
            'requirements': 'Docker, Git, Linux, AWS',
            'responsibilities': 'Gestion de l\'infrastructure, automatisation',
            'job_type': 'CDI',
            'seniority': 'senior',
            'location': 'Casablanca, Maroc',
            'city': 'Casablanca',
            'remote': True,
            'salary_min': 18000,
            'salary_max': 30000,
            'contact_email': 'careers@cloudsolutions.ma',
            'required_skills': ['Docker', 'Git']
        }
    ]
    
    created_jobs = []
    for job_data in jobs_data:
        required_skills = job_data.pop('required_skills')
        job, created = JobOffer.objects.get_or_create(
            title=job_data['title'],
            company=job_data['company'],
            defaults=job_data
        )
        if created:
            # Add required skills
            for skill_name in required_skills:
                try:
                    skill = Skill.objects.get(name=skill_name)
                    job.required_skills.add(skill)
                except Skill.DoesNotExist:
                    print(f"⚠️  Skill {skill_name} not found for job {job.title}")
            created_jobs.append(job)
            print(f"✓ Created job: {job.title}")
    
    return candidate, created_jobs


def test_recommendation_engine(candidate, jobs):
    """Test the recommendation engine"""
    print("\n" + "="*50)
    print("TESTING RECOMMENDATION ENGINE")
    print("="*50)
    
    engine = RecommendationEngine()
    
    # Test skill similarity
    print("\n1. Testing skill similarity calculation:")
    user_skills = list(candidate.skills.all())
    for job in jobs:
        job_skills = list(job.required_skills.all())
        score, matched, missing = engine.calculate_skill_similarity(user_skills, job_skills)
        print(f"   {job.title}: {score:.2f} (matched: {matched}, missing: {missing})")
    
    # Test job scoring
    print("\n2. Testing job scoring:")
    for job in jobs:
        score_data = engine.calculate_job_score(candidate, job)
        print(f"   {job.title}:")
        print(f"     Overall Score: {score_data['overall_score']:.2f}")
        print(f"     Skill Match: {score_data['skill_match_score']:.2f}")
        print(f"     Salary Fit: {score_data['salary_fit_score']:.2f}")
        print(f"     Location Match: {score_data['location_match_score']:.2f}")
        print(f"     Seniority Match: {score_data['seniority_match_score']:.2f}")
        print(f"     Matched Skills: {score_data['matched_skills']}")
        print(f"     Missing Skills: {score_data['missing_skills']}")
        print()
    
    # Test recommendation generation
    print("3. Testing recommendation generation:")
    recommendations = engine.generate_recommendations(candidate, limit=5)
    print(f"   Generated {len(recommendations)} recommendations")
    
    for i, rec in enumerate(recommendations, 1):
        print(f"   {i}. {rec.job.title} - {rec.job.company}")
        print(f"      Score: {rec.overall_score:.1f}%")
        print(f"      Matched Skills: {rec.matched_skills}")
        print(f"      Reason: {rec.recommendation_reason}")
        print()


def test_skill_analyzer(candidate):
    """Test the skill analyzer"""
    print("\n" + "="*50)
    print("TESTING SKILL ANALYZER")
    print("="*50)
    
    # Test skill vector
    print("\n1. Testing skill vector generation:")
    skill_vector = SkillAnalyzer.get_user_skill_vector(candidate)
    print(f"   Skill vector: {skill_vector}")
    
    # Test top skills
    print("\n2. Testing top skills extraction:")
    top_skills = SkillAnalyzer.get_top_skills(candidate, limit=5)
    print(f"   Top skills:")
    for skill in top_skills:
        print(f"     - {skill['name']}: {skill['score']:.2f} ({skill['level']})")
    
    # Test skill levels
    print("\n3. Testing skill level determination:")
    test_scores = [0.95, 0.75, 0.55, 0.35]
    for score in test_scores:
        level = SkillAnalyzer.get_skill_level(score)
        print(f"   Score {score}: {level}")


def main():
    """Main test function"""
    print("JOB RECOMMENDATION SYSTEM TEST")
    print("="*50)
    
    try:
        # Create test data
        candidate, jobs = create_test_data()
        
        # Test recommendation engine
        test_recommendation_engine(candidate, jobs)
        
        # Test skill analyzer
        test_skill_analyzer(candidate)
        
        print("\n" + "="*50)
        print("✅ ALL TESTS COMPLETED SUCCESSFULLY!")
        print("="*50)
        
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        import traceback
        traceback.print_exc()


if __name__ == '__main__':
    main()

