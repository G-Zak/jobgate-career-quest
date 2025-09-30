#!/usr/bin/env python
"""
Create sample data for the cognitive job recommendation system
"""

import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'careerquest.settings')
django.setup()

from django.contrib.auth.models import User
from django.utils import timezone
from recommendation.models import JobOffer, ScoringWeights, JobRecommendation
from skills.models import Skill, CandidateProfile, TechnicalTest, TestResult


def create_skills():
    """Create essential skills"""
    skills_data = [
        ('Python', 'programming'),
        ('JavaScript', 'programming'),
        ('React', 'frontend'),
        ('Django', 'backend'),
        ('PostgreSQL', 'database'),
        ('Docker', 'devops'),
        ('AWS', 'cloud'),
        ('Machine Learning', 'ai'),
        ('Data Analysis', 'analytics'),
        ('Communication', 'soft_skills'),
        ('Problem Solving', 'soft_skills'),
    ]
    
    skills = {}
    for name, category in skills_data:
        skill, created = Skill.objects.get_or_create(
            name=name,
            defaults={'category': category}
        )
        skills[name] = skill
        if created:
            print(f"✓ Created skill: {name}")
    
    return skills


def create_technical_tests(skills):
    """Create technical tests"""
    tests_data = [
        ('Python Programming Test', 'Python', 'Test Python programming skills'),
        ('JavaScript Assessment', 'JavaScript', 'Test JavaScript knowledge'),
        ('React Development Test', 'React', 'Test React framework skills'),
        ('Django Framework Test', 'Django', 'Test Django backend skills'),
        ('Problem Solving Test', 'Problem Solving', 'Test algorithmic thinking'),
    ]

    tests = {}
    for name, skill_name, description in tests_data:
        if skill_name in skills:
            test, created = TechnicalTest.objects.get_or_create(
                test_name=name,
                defaults={
                    'skill': skills[skill_name],
                    'description': description,
                    'instructions': f'Complete the {name} assessment',
                    'total_score': 100,
                    'time_limit': 60,
                    'is_active': True
                }
            )
            tests[name] = test
            if created:
                print(f"✓ Created technical test: {name}")

    return tests


def create_job_offers(skills):
    """Create realistic Moroccan job offers"""
    jobs_data = [
        {
            'title': 'Senior Python Developer',
            'company': 'TechCorp Morocco',
            'location': 'Casablanca, Morocco',
            'salary_min': 15000,
            'salary_max': 25000,
            'description': 'Senior Python developer for fintech applications',
            'requirements': 'Python, Django, PostgreSQL, 5+ years experience',
            'responsibilities': 'Develop backend APIs, mentor junior developers',
            'required_skills': ['Python', 'Django', 'PostgreSQL'],
            'preferred_skills': ['AWS', 'Docker'],
        },
        {
            'title': 'Full Stack JavaScript Developer',
            'company': 'StartupHub Rabat',
            'location': 'Rabat, Morocco',
            'salary_min': 12000,
            'salary_max': 18000,
            'description': 'Full stack developer for e-commerce platform',
            'requirements': 'JavaScript, React, 3+ years experience',
            'responsibilities': 'Build frontend and backend features',
            'required_skills': ['JavaScript', 'React'],
            'preferred_skills': ['Docker'],
        },
        {
            'title': 'Data Scientist',
            'company': 'Analytics Pro',
            'location': 'Casablanca, Morocco',
            'salary_min': 18000,
            'salary_max': 28000,
            'description': 'Data scientist for business intelligence',
            'requirements': 'Python, Machine Learning, Data Analysis, 4+ years',
            'responsibilities': 'Build ML models, analyze business data',
            'required_skills': ['Python', 'Machine Learning', 'Data Analysis'],
            'preferred_skills': ['PostgreSQL', 'AWS'],
        },
    ]
    
    job_offers = []
    for job_data in jobs_data:
        # Extract skills from job data
        required_skills = job_data.pop('required_skills', [])
        preferred_skills = job_data.pop('preferred_skills', [])
        
        # Create job offer
        job_offer, created = JobOffer.objects.get_or_create(
            title=job_data['title'],
            company=job_data['company'],
            defaults={
                **job_data,
                'status': 'active',
                'currency': 'MAD',
                'source_type': 'sample'
            }
        )
        
        if created:
            # Add skills
            for skill_name in required_skills:
                if skill_name in skills:
                    job_offer.required_skills.add(skills[skill_name])
            
            for skill_name in preferred_skills:
                if skill_name in skills:
                    job_offer.preferred_skills.add(skills[skill_name])
            
            print(f"✓ Created job offer: {job_offer.title} at {job_offer.company}")
        
        job_offers.append(job_offer)
    
    return job_offers


def create_test_candidates(skills, tests):
    """Create test candidates with different profiles"""
    candidates_data = [
        {
            'username': 'ahmed_dev',
            'email': 'ahmed@example.com',
            'first_name': 'Ahmed',
            'last_name': 'Benali',
            'location': 'Casablanca',
            'skills': ['Python', 'Django', 'PostgreSQL', 'Problem Solving'],
            'test_results': [
                ('Python Programming Test', 85),
                ('Django Framework Test', 78),
                ('Problem Solving Test', 92),
            ]
        },
        {
            'username': 'fatima_js',
            'email': 'fatima@example.com',
            'first_name': 'Fatima',
            'last_name': 'Alaoui',
            'location': 'Rabat',
            'skills': ['JavaScript', 'React', 'Communication'],
            'test_results': [
                ('JavaScript Assessment', 88),
                ('React Development Test', 82),
                ('Problem Solving Test', 75),
            ]
        },
        {
            'username': 'youssef_data',
            'email': 'youssef@example.com',
            'first_name': 'Youssef',
            'last_name': 'Idrissi',
            'location': 'Casablanca',
            'skills': ['Python', 'Machine Learning', 'Data Analysis', 'PostgreSQL'],
            'test_results': [
                ('Python Programming Test', 91),
                ('Problem Solving Test', 89),
            ]
        },
    ]
    
    candidates = []
    for candidate_data in candidates_data:
        # Create user
        user, created = User.objects.get_or_create(
            username=candidate_data['username'],
            defaults={
                'email': candidate_data['email'],
                'first_name': candidate_data['first_name'],
                'last_name': candidate_data['last_name']
            }
        )
        
        # Create candidate profile
        profile, created = CandidateProfile.objects.get_or_create(
            user=user,
            defaults={
                'first_name': candidate_data['first_name'],
                'last_name': candidate_data['last_name'],
                'email': candidate_data['email'],
                'location': candidate_data['location']
            }
        )
        
        if created:
            # Add skills
            for skill_name in candidate_data['skills']:
                if skill_name in skills:
                    profile.skills.add(skills[skill_name])
            
            # Add test results
            for test_name, score in candidate_data['test_results']:
                if test_name in tests:
                    TestResult.objects.get_or_create(
                        candidate=profile,
                        test=tests[test_name],
                        defaults={
                            'score': score,
                            'passed': score >= 70,
                            'completed_at': timezone.now()
                        }
                    )
            
            print(f"✓ Created candidate: {profile.full_name}")
        
        candidates.append((user, profile))
    
    return candidates


def create_scoring_weights():
    """Create default scoring weights"""
    weights, created = ScoringWeights.objects.get_or_create(
        name="cognitive_default",
        defaults={
            'is_active': True,
            'skill_match_weight': 0.30,
            'technical_test_weight': 0.25,
            'experience_weight': 0.15,
            'salary_weight': 0.10,
            'location_weight': 0.10,
            'cluster_fit_weight': 0.10,
            'employability_weight': 0.05,
            'test_pass_threshold': 70.0,
            'required_skill_weight': 1.0,
            'preferred_skill_weight': 0.5,
            'technical_test_default_weights': {
                'Python': 1.0,
                'JavaScript': 1.0,
                'React': 0.8,
                'Django': 0.8,
            }
        }
    )

    if created:
        print(f"✓ Created scoring weights: {weights.name}")

    return weights


def generate_sample_recommendations(candidates, job_offers):
    """Generate sample recommendations manually"""
    print("\n=== Generating Sample Recommendations ===")

    # Sample recommendation data based on skill matching
    recommendations_data = [
        # Ahmed (Python, Django, PostgreSQL) -> Senior Python Developer (perfect match)
        {
            'candidate_id': candidates[0][0].id,
            'job_offer': job_offers[0],  # Senior Python Developer
            'overall_score': 0.92,
            'technical_test_score': 0.85,
            'skill_match_score': 0.95,
            'experience_score': 0.80,
            'salary_score': 0.90,
            'location_score': 1.0,
            'cluster_fit_score': 0.88,
            'breakdown': {
                'matched_skills': ['Python', 'Django', 'PostgreSQL'],
                'missing_skills': [],
                'technical_tests': {
                    'Python Programming Test': {'score': 85, 'passed': True},
                    'Django Framework Test': {'score': 78, 'passed': True}
                }
            }
        },
        # Fatima (JavaScript, React) -> Full Stack JavaScript Developer (good match)
        {
            'candidate_id': candidates[1][0].id,
            'job_offer': job_offers[1],  # Full Stack JavaScript Developer
            'overall_score': 0.87,
            'technical_test_score': 0.85,
            'skill_match_score': 0.90,
            'experience_score': 0.75,
            'salary_score': 0.85,
            'location_score': 0.95,
            'cluster_fit_score': 0.82,
            'breakdown': {
                'matched_skills': ['JavaScript', 'React'],
                'missing_skills': [],
                'technical_tests': {
                    'JavaScript Assessment': {'score': 88, 'passed': True},
                    'React Development Test': {'score': 82, 'passed': True}
                }
            }
        },
        # Youssef (Python, ML, Data Analysis) -> Data Scientist (excellent match)
        {
            'candidate_id': candidates[2][0].id,
            'job_offer': job_offers[2],  # Data Scientist
            'overall_score': 0.94,
            'technical_test_score': 0.91,
            'skill_match_score': 0.98,
            'experience_score': 0.85,
            'salary_score': 0.95,
            'location_score': 1.0,
            'cluster_fit_score': 0.90,
            'breakdown': {
                'matched_skills': ['Python', 'Machine Learning', 'Data Analysis', 'PostgreSQL'],
                'missing_skills': [],
                'technical_tests': {
                    'Python Programming Test': {'score': 91, 'passed': True}
                }
            }
        },
    ]

    for rec_data in recommendations_data:
        recommendation, created = JobRecommendation.objects.get_or_create(
            candidate_id=rec_data['candidate_id'],
            job_offer=rec_data['job_offer'],
            defaults={
                'overall_score': rec_data['overall_score'],
                'technical_test_score': rec_data['technical_test_score'],
                'skill_match_score': rec_data['skill_match_score'],
                'experience_score': rec_data['experience_score'],
                'salary_score': rec_data['salary_score'],
                'location_score': rec_data['location_score'],
                'cluster_fit_score': rec_data['cluster_fit_score'],
                'breakdown': rec_data['breakdown'],
                'algorithm_version': 'cognitive_v1.0',
                'computed_at': timezone.now()
            }
        )

        if created:
            print(f"✓ Created recommendation: Candidate {rec_data['candidate_id']} -> {rec_data['job_offer'].title} (Score: {rec_data['overall_score']:.3f})")


def main():
    """Create all sample data"""
    print("🚀 Creating Sample Data for Cognitive Job Recommendations")
    print("=" * 60)

    # Create base data
    skills = create_skills()
    tests = create_technical_tests(skills)
    weights = create_scoring_weights()

    # Create job offers
    job_offers = create_job_offers(skills)

    # Create test candidates
    candidates = create_test_candidates(skills, tests)

    # Generate sample recommendations
    generate_sample_recommendations(candidates, job_offers)

    print("\n" + "=" * 60)
    print("✅ Sample data created successfully!")
    print(f"   - {len(skills)} skills")
    print(f"   - {len(tests)} technical tests")
    print(f"   - {len(job_offers)} job offers")
    print(f"   - {len(candidates)} candidates")
    print(f"   - 3 sample recommendations")
    print("\n📖 Next steps:")
    print("   1. Visit /admin/recommendation/ to view the data")
    print("   2. Check JobRecommendation table for computed scores")
    print("   3. Test the cognitive recommendation system")


if __name__ == "__main__":
    main()
