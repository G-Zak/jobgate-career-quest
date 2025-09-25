#!/usr/bin/env python
"""
Script to create test job offers for the recommendation system
"""
import os
import sys
import django
from datetime import datetime, timedelta
from django.utils import timezone

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'careerquest.settings')
django.setup()

from recommendation.models import JobOffer
from skills.models import Skill

def create_test_jobs():
    """Create test job offers with various skills"""
    
    # First, create some skills if they don't exist
    skills_data = [
        {'name': 'Python', 'category': 'programming'},
        {'name': 'Django', 'category': 'backend'},
        {'name': 'React', 'category': 'frontend'},
        {'name': 'JavaScript', 'category': 'programming'},
        {'name': 'Java', 'category': 'programming'},
        {'name': 'Spring Boot', 'category': 'backend'},
        {'name': 'Node.js', 'category': 'backend'},
        {'name': 'Vue.js', 'category': 'frontend'},
        {'name': 'PostgreSQL', 'category': 'database'},
        {'name': 'MongoDB', 'category': 'database'},
        {'name': 'Docker', 'category': 'devops'},
        {'name': 'AWS', 'category': 'devops'},
        {'name': 'Git', 'category': 'other'},
        {'name': 'REST API', 'category': 'backend'},
        {'name': 'GraphQL', 'category': 'backend'},
    ]
    
    # Create skills
    skills = {}
    for skill_data in skills_data:
        skill, created = Skill.objects.get_or_create(
            name=skill_data['name'],
            defaults={'category': skill_data['category'], 'description': f'{skill_data["name"]} skill'}
        )
        skills[skill_data['name']] = skill
        if created:
            print(f"Created skill: {skill_data['name']}")
    
    # Create test job offers
    job_offers_data = [
        {
            'title': 'Senior Python Developer',
            'company': 'TechCorp Inc.',
            'location': 'Casablanca, Morocco',
            'city': 'Casablanca',
            'description': 'We are looking for a senior Python developer with Django experience to join our team.',
            'requirements': '5+ years of Python experience, Django framework knowledge, REST API development',
            'job_type': 'full-time',
            'seniority': 'senior',
            'salary_min': 15000,
            'salary_max': 25000,
            'salary_currency': 'MAD',
            'remote': True,
            'status': 'active',
            'required_skills': ['Python', 'Django', 'REST API', 'PostgreSQL'],
            'preferred_skills': ['Docker', 'AWS', 'Git'],
            'tags': ['Python', 'Django', 'Backend', 'API']
        },
        {
            'title': 'React Frontend Developer',
            'company': 'StartupXYZ',
            'location': 'Rabat, Morocco',
            'city': 'Rabat',
            'description': 'Join our frontend team to build amazing user interfaces with React.',
            'requirements': '3+ years of React experience, JavaScript proficiency, modern frontend tools',
            'job_type': 'full-time',
            'seniority': 'mid',
            'salary_min': 12000,
            'salary_max': 18000,
            'salary_currency': 'MAD',
            'remote': True,
            'status': 'active',
            'required_skills': ['React', 'JavaScript', 'Git'],
            'preferred_skills': ['Vue.js', 'Node.js', 'Docker'],
            'tags': ['React', 'Frontend', 'JavaScript', 'UI']
        },
        {
            'title': 'Full Stack Java Developer',
            'company': 'Enterprise Solutions',
            'location': 'Casablanca, Morocco',
            'city': 'Casablanca',
            'description': 'Full stack development using Java Spring Boot and modern frontend technologies.',
            'requirements': '4+ years of Java experience, Spring Boot knowledge, frontend skills',
            'job_type': 'full-time',
            'seniority': 'senior',
            'salary_min': 18000,
            'salary_max': 28000,
            'salary_currency': 'MAD',
            'remote': False,
            'status': 'active',
            'required_skills': ['Java', 'Spring Boot', 'JavaScript', 'PostgreSQL'],
            'preferred_skills': ['React', 'Docker', 'AWS'],
            'tags': ['Java', 'Spring Boot', 'Full Stack', 'Backend']
        },
        {
            'title': 'Python Django Developer',
            'company': 'WebAgency Pro',
            'location': 'Marrakech, Morocco',
            'city': 'Marrakech',
            'description': 'Django web development for various client projects.',
            'requirements': '2+ years of Django experience, Python proficiency, web development',
            'job_type': 'full-time',
            'seniority': 'mid',
            'salary_min': 10000,
            'salary_max': 16000,
            'salary_currency': 'MAD',
            'remote': True,
            'status': 'active',
            'required_skills': ['Python', 'Django', 'JavaScript', 'Git'],
            'preferred_skills': ['React', 'PostgreSQL', 'Docker'],
            'tags': ['Python', 'Django', 'Web Development', 'Backend']
        },
        {
            'title': 'React Native Mobile Developer',
            'company': 'MobileFirst',
            'location': 'Casablanca, Morocco',
            'city': 'Casablanca',
            'description': 'Develop mobile applications using React Native.',
            'requirements': '3+ years of React Native experience, mobile development knowledge',
            'job_type': 'full-time',
            'seniority': 'mid',
            'salary_min': 14000,
            'salary_max': 20000,
            'salary_currency': 'MAD',
            'remote': True,
            'status': 'active',
            'required_skills': ['React', 'JavaScript', 'Git'],
            'preferred_skills': ['Node.js', 'Docker', 'AWS'],
            'tags': ['React Native', 'Mobile', 'JavaScript', 'iOS', 'Android']
        },
        {
            'title': 'Backend API Developer',
            'company': 'APICorp',
            'location': 'Casablanca, Morocco',
            'city': 'Casablanca',
            'description': 'Develop and maintain REST APIs and microservices.',
            'requirements': '3+ years of backend development, API design experience',
            'job_type': 'full-time',
            'seniority': 'mid',
            'salary_min': 13000,
            'salary_max': 19000,
            'salary_currency': 'MAD',
            'remote': True,
            'status': 'active',
            'required_skills': ['Python', 'REST API', 'PostgreSQL', 'Git'],
            'preferred_skills': ['Django', 'Docker', 'AWS', 'GraphQL'],
            'tags': ['API', 'Backend', 'Python', 'REST']
        }
    ]
    
    # Create job offers
    for job_data in job_offers_data:
        # Extract skills
        required_skills = job_data.pop('required_skills', [])
        preferred_skills = job_data.pop('preferred_skills', [])
        tags = job_data.pop('tags', [])
        
        # Set expiration date (30 days from now)
        job_data['expires_at'] = timezone.now() + timedelta(days=30)
        job_data['posted_at'] = timezone.now()
        
        # Create job offer
        job_offer, created = JobOffer.objects.get_or_create(
            title=job_data['title'],
            company=job_data['company'],
            defaults=job_data
        )
        
        if created:
            # Add required skills
            for skill_name in required_skills:
                if skill_name in skills:
                    job_offer.required_skills.add(skills[skill_name])
            
            # Add preferred skills
            for skill_name in preferred_skills:
                if skill_name in skills:
                    job_offer.preferred_skills.add(skills[skill_name])
            
            print(f"Created job offer: {job_data['title']} at {job_data['company']}")
        else:
            print(f"Job offer already exists: {job_data['title']} at {job_data['company']}")
    
    print(f"\nTotal job offers in database: {JobOffer.objects.count()}")
    print(f"Active job offers: {JobOffer.objects.filter(status='active').count()}")

if __name__ == '__main__':
    create_test_jobs()






