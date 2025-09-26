#!/usr/bin/env python
"""
Simple data restoration for essential data only
"""
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'careerquest.settings')
django.setup()

from django.contrib.auth.models import User
from skills.models import Skill, CandidateProfile
from testsengine.models import Test, Question
from recommendation.models import JobOffer

def create_essential_data():
    """Create essential data for testing"""
    try:
        print("🔄 Creating essential data...")
        
        # Create test users
        users_data = [
            {'username': 'testuser1', 'email': 'test1@example.com', 'password': 'test123'},
            {'username': 'testuser2', 'email': 'test2@example.com', 'password': 'test123'},
            {'username': 'candidate1', 'email': 'candidate1@example.com', 'password': 'test123'},
        ]
        
        for user_data in users_data:
            user, created = User.objects.get_or_create(
                username=user_data['username'],
                defaults={'email': user_data['email']}
            )
            if created:
                user.set_password(user_data['password'])
                user.save()
                print(f"  ✅ Created user: {user.username}")
        
        # Create essential skills
        skills_data = [
            'Python', 'JavaScript', 'React', 'Django', 'Node.js', 'SQL', 'HTML', 'CSS',
            'Java', 'Spring Boot', 'Angular', 'Vue.js', 'MongoDB', 'PostgreSQL',
            'Docker', 'Kubernetes', 'AWS', 'Git', 'Linux', 'Agile'
        ]
        
        for skill_name in skills_data:
            skill, created = Skill.objects.get_or_create(
                name=skill_name,
                defaults={'category': 'programming'}
            )
            if created:
                print(f"  ✅ Created skill: {skill.name}")
        
        # Create sample tests
        test_data = [
            {
                'title': 'Python Programming Test',
                'description': 'Test your Python programming skills',
                'test_type': 'technical',
                'duration_minutes': 30,
                'total_questions': 10,
                'passing_score': 70
            },
            {
                'title': 'JavaScript Fundamentals',
                'description': 'Test your JavaScript knowledge',
                'test_type': 'technical',
                'duration_minutes': 25,
                'total_questions': 8,
                'passing_score': 60
            },
            {
                'title': 'React Development',
                'description': 'Test your React.js skills',
                'test_type': 'technical',
                'duration_minutes': 35,
                'total_questions': 12,
                'passing_score': 75
            }
        ]
        
        for test_info in test_data:
            test, created = Test.objects.get_or_create(
                title=test_info['title'],
                defaults=test_info
            )
            if created:
                print(f"  ✅ Created test: {test.title}")
        
        # Create sample job offers
        jobs_data = [
            {
                'title': 'Senior Python Developer',
                'company': 'TechCorp',
                'location': 'Casablanca, Morocco',
                'city': 'Casablanca',
                'description': 'We are looking for an experienced Python developer to join our team.',
                'job_type': 'full-time',
                'seniority': 'senior',
                'salary_min': 15000,
                'salary_max': 25000,
                'remote': True,
                'tags': ['Python', 'Django', 'PostgreSQL', 'AWS']
            },
            {
                'title': 'Frontend React Developer',
                'company': 'WebSolutions',
                'location': 'Rabat, Morocco',
                'city': 'Rabat',
                'description': 'Join our frontend team to build amazing user interfaces.',
                'job_type': 'full-time',
                'seniority': 'intermediate',
                'salary_min': 12000,
                'salary_max': 18000,
                'remote': False,
                'tags': ['React', 'JavaScript', 'HTML', 'CSS']
            },
            {
                'title': 'Full Stack Developer',
                'company': 'StartupXYZ',
                'location': 'Marrakech, Morocco',
                'city': 'Marrakech',
                'description': 'Full stack developer position with modern technologies.',
                'job_type': 'full-time',
                'seniority': 'intermediate',
                'salary_min': 10000,
                'salary_max': 20000,
                'remote': True,
                'tags': ['Python', 'React', 'Node.js', 'MongoDB']
            }
        ]
        
        for job_info in jobs_data:
            job, created = JobOffer.objects.get_or_create(
                title=job_info['title'],
                company=job_info['company'],
                defaults=job_info
            )
            if created:
                print(f"  ✅ Created job: {job.title} at {job.company}")
        
        # Create candidate profile for test user
        test_user = User.objects.get(username='candidate1')
        profile, created = CandidateProfile.objects.get_or_create(
            user=test_user,
            defaults={
                'first_name': 'John',
                'last_name': 'Doe',
                'email': 'candidate1@example.com',
                'bio': 'Experienced software developer with 5+ years of experience',
                'location': 'Casablanca, Morocco',
                'skills_with_proficiency': [
                    {'name': 'Python', 'proficiency': 0.9},
                    {'name': 'JavaScript', 'proficiency': 0.8},
                    {'name': 'React', 'proficiency': 0.7},
                    {'name': 'Django', 'proficiency': 0.8}
                ]
            }
        )
        if created:
            print(f"  ✅ Created profile for {test_user.username}")
        
        print("✅ Essential data creation completed!")
        print(f"📊 Users: {User.objects.count()}")
        print(f"🔧 Skills: {Skill.objects.count()}")
        print(f"📝 Tests: {Test.objects.count()}")
        print(f"💼 Jobs: {JobOffer.objects.count()}")
        print(f"👥 Profiles: {CandidateProfile.objects.count()}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error creating data: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == '__main__':
    create_essential_data()
