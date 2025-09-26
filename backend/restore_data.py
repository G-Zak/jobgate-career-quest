#!/usr/bin/env python
"""
Smart data restoration script that handles foreign key issues
"""
import os
import sys
import django
import json
from django.core.management import execute_from_command_line
from django.core import serializers
from django.db import transaction
from django.contrib.auth.models import User

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'careerquest.settings')
django.setup()

def restore_data():
    """Restore data with proper foreign key handling"""
    try:
        print("🔄 Starting smart data restoration...")
        
        # Load backup data
        with open('complete_database_backup.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        print(f"📊 Loaded {len(data)} records from backup")
        
        # Group data by model
        models_data = {}
        for record in data:
            model_name = record['model']
            if model_name not in models_data:
                models_data[model_name] = []
            models_data[model_name].append(record)
        
        # Import models
        from skills.models import Skill, CandidateProfile, TechnicalTest, TestQuestion, TestResult
        from testsengine.models import Test, Question, TestSession, TestAnswer, CodingChallenge, CodingSubmission, CodingSession, TestAttempt, TestSubmission, Answer, Score, QuestionOption
        from recommendation.models import JobOffer, JobRecommendation, UserJobPreference, RecommendationAnalytics, SavedJob, JobRecommendationDetail, JobApplication, ScoringWeights
        
        # Create a mapping for user IDs
        user_id_mapping = {}
        
        with transaction.atomic():
            # First, create all users
            print("👤 Creating users...")
            for record in models_data.get('auth.user', []):
                fields = record['fields']
                user, created = User.objects.get_or_create(
                    username=fields['username'],
                    defaults={
                        'email': fields.get('email', ''),
                        'first_name': fields.get('first_name', ''),
                        'last_name': fields.get('last_name', ''),
                        'is_staff': fields.get('is_staff', False),
                        'is_active': fields.get('is_active', True),
                        'is_superuser': fields.get('is_superuser', False),
                        'date_joined': fields.get('date_joined'),
                        'last_login': fields.get('last_login')
                    }
                )
                user_id_mapping[record['pk']] = user.id
                if created:
                    print(f"  ✅ Created user: {user.username}")
            
            # Create skills
            print("🔧 Creating skills...")
            for record in models_data.get('skills.skill', []):
                fields = record['fields']
                skill, created = Skill.objects.get_or_create(
                    name=fields['name'],
                    defaults={
                        'category': fields.get('category', 'other'),
                        'description': fields.get('description', ''),
                        'is_technical': fields.get('is_technical', True)
                    }
                )
                if created:
                    print(f"  ✅ Created skill: {skill.name}")
            
            # Create tests
            print("📝 Creating tests...")
            for record in models_data.get('testsengine.test', []):
                fields = record['fields']
                test, created = Test.objects.get_or_create(
                    title=fields['title'],
                    defaults={
                        'description': fields.get('description', ''),
                        'test_type': fields.get('test_type', 'technical'),
                        'duration': fields.get('duration', 30),
                        'total_questions': fields.get('total_questions', 10),
                        'passing_score': fields.get('passing_score', 60),
                        'is_active': fields.get('is_active', True),
                        'skill': fields.get('skill', ''),
                        'difficulty_level': fields.get('difficulty_level', 'intermediate')
                    }
                )
                if created:
                    print(f"  ✅ Created test: {test.title}")
            
            # Create job offers
            print("💼 Creating job offers...")
            for record in models_data.get('recommendation.joboffer', []):
                fields = record['fields']
                job, created = JobOffer.objects.get_or_create(
                    title=fields['title'],
                    company=fields['company'],
                    defaults={
                        'location': fields.get('location', ''),
                        'city': fields.get('city', ''),
                        'job_type': fields.get('job_type', 'full-time'),
                        'seniority': fields.get('seniority', ''),
                        'salary_min': fields.get('salary_min'),
                        'salary_max': fields.get('salary_max'),
                        'remote': fields.get('remote', False),
                        'description': fields.get('description', ''),
                        'requirements': fields.get('requirements', ''),
                        'benefits': fields.get('benefits', ''),
                        'industry': fields.get('industry', ''),
                        'company_size': fields.get('company_size', ''),
                        'tags': fields.get('tags', []),
                        'status': fields.get('status', 'active')
                    }
                )
                if created:
                    print(f"  ✅ Created job: {job.title} at {job.company}")
            
            # Create candidate profiles (only for existing users)
            print("👥 Creating candidate profiles...")
            for record in models_data.get('skills.candidateprofile', []):
                fields = record['fields']
                old_user_id = record['fields']['user']
                if old_user_id in user_id_mapping:
                    new_user_id = user_id_mapping[old_user_id]
                    profile, created = CandidateProfile.objects.get_or_create(
                        user_id=new_user_id,
                        defaults={
                            'bio': fields.get('bio', ''),
                            'linkedin': fields.get('linkedin', ''),
                            'github': fields.get('github', ''),
                            'location': fields.get('location', ''),
                            'experience_level': fields.get('experience_level', ''),
                            'skills_with_proficiency': fields.get('skills_with_proficiency', [])
                        }
                    )
                    if created:
                        print(f"  ✅ Created profile for user {profile.user.username}")
                else:
                    print(f"  ⚠️  Skipped profile for non-existent user {old_user_id}")
            
            print("✅ Data restoration completed successfully!")
            print(f"📊 Created {User.objects.count()} users")
            print(f"🔧 Created {Skill.objects.count()} skills")
            print(f"📝 Created {Test.objects.count()} tests")
            print(f"💼 Created {JobOffer.objects.count()} job offers")
            print(f"👥 Created {CandidateProfile.objects.count()} profiles")
            
        return True
        
    except Exception as e:
        print(f"❌ Error restoring data: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == '__main__':
    restore_data()

