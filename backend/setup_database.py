#!/usr/bin/env python
"""
Complete Database Setup Script for Teammates
This script populates the database with all necessary data for the project to work.
"""

import os
import sys
import django
from django.core.management import call_command
from django.db import connection

def setup_database():
    """Complete database setup for teammates"""
    print("🚀 Starting Complete Database Setup...")
    
    # 1. Run migrations first
    print("\n1️⃣ Running database migrations...")
    try:
        call_command('makemigrations')
        call_command('migrate')
        print("✅ Migrations completed")
    except Exception as e:
        print(f"⚠️ Migration warning: {e}")
        print("Continuing with setup...")
    
    # 2. Create superuser (optional)
    print("\n2️⃣ Creating superuser...")
    try:
        from django.contrib.auth.models import User
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
            print("✅ Superuser created: admin/admin123")
        else:
            print("✅ Superuser already exists")
    except Exception as e:
        print(f"⚠️ Superuser creation failed: {e}")
    
    # 3. Add sample skills
    print("\n3️⃣ Adding sample skills...")
    try:
        call_command('add_sample_skills')
        print("✅ Skills added successfully")
    except Exception as e:
        print(f"❌ Skills addition failed: {e}")
    
    # 4. Create sample candidate
    print("\n4️⃣ Creating sample candidate...")
    try:
        call_command('create_sample_candidate')
        print("✅ Sample candidate created")
    except Exception as e:
        print(f"❌ Sample candidate creation failed: {e}")
    
    # 5. Add numerical questions
    print("\n5️⃣ Adding numerical questions...")
    try:
        call_command('add_numerical_questions')
        call_command('add_more_numerical_questions')
        print("✅ Numerical questions added")
    except Exception as e:
        print(f"❌ Numerical questions failed: {e}")
    
    # 6. Add logical questions
    print("\n6️⃣ Adding logical questions...")
    try:
        call_command('add_lrt1_questions')
        call_command('add_lrt2_questions')
        call_command('add_lrt3_questions')
        print("✅ Logical questions added")
    except Exception as e:
        print(f"❌ Logical questions failed: {e}")
    
    # 7. Add diagrammatic questions
    print("\n7️⃣ Adding diagrammatic questions...")
    try:
        call_command('add_diagrammatic_20_questions')
        call_command('add_drt2_questions')
        print("✅ Diagrammatic questions added")
    except Exception as e:
        print(f"❌ Diagrammatic questions failed: {e}")
    
    # 8. Add abstract questions
    print("\n8️⃣ Adding abstract questions...")
    try:
        call_command('add_abstract_questions')
        print("✅ Abstract questions added")
    except Exception as e:
        print(f"❌ Abstract questions failed: {e}")
    
    # 9. Add spatial questions
    print("\n9️⃣ Adding spatial questions...")
    try:
        call_command('create_spatial_tests')
        call_command('update_spatial_tests_to_5_options')
        print("✅ Spatial questions added")
    except Exception as e:
        print(f"❌ Spatial questions failed: {e}")
    
    # 10. Add SJT questions and scoring system
    print("\n🔟 Adding SJT questions and scoring system...")
    try:
        # First create the QuestionOption model
        call_command('migrate')
        
        # Add SJT questions (if not already added)
        call_command('add_sjt_correct_answers')
        
        # Update SJT scoring system
        call_command('update_sjt_scoring_system_fixed')
        
        # Create scoring functions
        call_command('create_sjt_scoring_service')
        
        print("✅ SJT questions and scoring system added")
    except Exception as e:
        print(f"❌ SJT setup failed: {e}")
    
    # 11. Verify setup
    print("\n✅ Verifying database setup...")
    try:
        from testsengine.models import Question, Test
        from skills.models import Skill
        
        total_questions = Question.objects.count()
        total_tests = Test.objects.count()
        total_skills = Skill.objects.count()
        
        print(f"📊 Database Summary:")
        print(f"   - Total Questions: {total_questions}")
        print(f"   - Total Tests: {total_tests}")
        print(f"   - Total Skills: {total_skills}")
        
        # Check specific tests
        sjt_questions = Question.objects.filter(test_id=4).count()
        print(f"   - SJT Questions: {sjt_questions}")
        
        if total_questions > 100 and total_skills > 10:
            print("🎉 Database setup completed successfully!")
        else:
            print("⚠️ Database setup may be incomplete")
            
    except Exception as e:
        print(f"❌ Verification failed: {e}")
    
    print("\n🚀 Setup complete! Your teammate can now run the project.")

if __name__ == "__main__":
    # Setup Django
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'careerquest.settings')
    django.setup()
    
    setup_database()
