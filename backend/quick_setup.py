#!/usr/bin/env python
"""
Quick Database Setup for Teammates
This script populates the database with all necessary data.
"""

import os
import sys
import django
from django.core.management import call_command

def quick_setup():
    """Quick database setup for teammates"""
    print("🚀 Quick Database Setup for Teammates...")
    
    # Setup Django
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'careerquest.settings')
    django.setup()
    
    # List of commands to run
    commands = [
        ('add_sample_skills', 'Adding skills...'),
        ('create_sample_candidate', 'Creating sample candidate...'),
        ('add_numerical_questions', 'Adding numerical questions...'),
        ('add_more_numerical_questions', 'Adding more numerical questions...'),
        ('add_lrt1_questions', 'Adding LRT1 questions...'),
        ('add_lrt2_questions', 'Adding LRT2 questions...'),
        ('add_lrt3_questions', 'Adding LRT3 questions...'),
        ('add_diagrammatic_20_questions', 'Adding diagrammatic questions...'),
        ('add_drt2_questions', 'Adding DRT2 questions...'),
        ('add_abstract_questions', 'Adding abstract questions...'),
        ('create_spatial_tests', 'Adding spatial questions...'),
        ('update_spatial_tests_to_5_options', 'Updating spatial options...'),
        ('add_sjt_correct_answers', 'Adding SJT questions...'),
        ('update_sjt_scoring_system_fixed', 'Setting up SJT scoring...'),
        ('create_sjt_scoring_service', 'Creating SJT scoring functions...'),
    ]
    
    success_count = 0
    total_commands = len(commands)
    
    for command, description in commands:
        try:
            print(f"\n{description}")
            call_command(command)
            print(f"✅ {command} completed")
            success_count += 1
        except Exception as e:
            print(f"❌ {command} failed: {str(e)[:100]}...")
            continue
    
    # Verify setup
    print(f"\n📊 Setup Summary:")
    print(f"   - Commands run: {success_count}/{total_commands}")
    
    try:
        from testsengine.models import Question, Test
        from skills.models import Skill
        
        total_questions = Question.objects.count()
        total_tests = Test.objects.count()
        total_skills = Skill.objects.count()
        
        print(f"   - Total Questions: {total_questions}")
        print(f"   - Total Tests: {total_tests}")
        print(f"   - Total Skills: {total_skills}")
        
        if total_questions > 100 and total_skills > 10:
            print("🎉 Database setup completed successfully!")
            print("\n🚀 Your teammate can now run:")
            print("   - Backend: python manage.py runserver")
            print("   - Frontend: npm run dev")
        else:
            print("⚠️ Database setup may be incomplete")
            
    except Exception as e:
        print(f"❌ Verification failed: {e}")
    
    print("\n📝 Next steps:")
    print("1. Start backend: python manage.py runserver")
    print("2. Start frontend: npm run dev")
    print("3. Check Django Admin: http://localhost:8000/admin/")

if __name__ == "__main__":
    quick_setup()
