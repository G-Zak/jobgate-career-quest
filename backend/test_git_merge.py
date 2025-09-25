#!/usr/bin/env python3
"""
Test script to simulate Git merge operations
"""

import os
import sys
import django
from pathlib import Path

# Setup Django environment
backend_dir = Path(__file__).parent
sys.path.append(str(backend_dir))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'careerquest.settings')
django.setup()

from django.core.management import call_command
from testsengine.models import Test, Question
from skills.models import Skill

def simulate_pre_merge():
    """Simulate pre-merge backup"""
    
    print("🎬 SIMULATING: Pre-merge backup")
    print("=" * 40)
    
    # Get current state
    skills_count = Skill.objects.count()
    tests_count = Test.objects.count()
    questions_count = Question.objects.count()
    
    print(f"📊 Current state: {skills_count} skills, {tests_count} tests, {questions_count} questions")
    
    # Create backup
    print("🔄 Creating backup...")
    call_command('backup_tests', output_dir='backend/testsengine/fixtures', include_questions=True)
    
    print("✅ Pre-merge backup completed")
    return skills_count, tests_count, questions_count

def simulate_merge_conflict():
    """Simulate a merge conflict that clears data"""
    
    print("\n🎬 SIMULATING: Merge conflict (data loss)")
    print("=" * 40)
    
    # Simulate data loss (clear some data)
    print("⚠️ Simulating data loss during merge...")
    
    # Clear some tests to simulate merge conflict
    Test.objects.filter(test_type='technical').delete()
    Question.objects.filter(test__test_type='technical').delete()
    
    remaining_skills = Skill.objects.count()
    remaining_tests = Test.objects.count()
    remaining_questions = Question.objects.count()
    
    print(f"📊 After simulated merge conflict:")
    print(f"   Skills: {remaining_skills}")
    print(f"   Tests: {remaining_tests}")
    print(f"   Questions: {remaining_questions}")
    
    print("❌ Data loss detected!")

def simulate_post_merge_restore():
    """Simulate post-merge restoration"""
    
    print("\n🎬 SIMULATING: Post-merge restoration")
    print("=" * 40)
    
    # Restore from backup
    print("🔄 Restoring from backup...")
    call_command('restore_tests', input_dir='backend/testsengine/fixtures', force=True)
    
    # Check restored state
    restored_skills = Skill.objects.count()
    restored_tests = Test.objects.count()
    restored_questions = Question.objects.count()
    
    print(f"📊 After restoration:")
    print(f"   Skills: {restored_skills}")
    print(f"   Tests: {restored_tests}")
    print(f"   Questions: {restored_questions}")
    
    print("✅ Data restored successfully!")

def main():
    """Run the complete Git merge simulation"""
    
    print("🚀 Git Merge Simulation Test")
    print("=" * 50)
    print("This test simulates a Git merge operation with data loss and recovery.")
    print("")
    
    try:
        # Step 1: Pre-merge backup
        original_skills, original_tests, original_questions = simulate_pre_merge()
        
        # Step 2: Simulate merge conflict
        simulate_merge_conflict()
        
        # Step 3: Post-merge restoration
        simulate_post_merge_restore()
        
        # Step 4: Verify restoration
        final_skills = Skill.objects.count()
        final_tests = Test.objects.count()
        final_questions = Question.objects.count()
        
        print(f"\n📋 Final Results:")
        print("=" * 40)
        print(f"Original: {original_skills} skills, {original_tests} tests, {original_questions} questions")
        print(f"Final:    {final_skills} skills, {final_tests} tests, {final_questions} questions")
        
        if (final_skills == original_skills and 
            final_tests == original_tests and 
            final_questions == original_questions):
            print("\n🎉 SUCCESS: All data restored correctly!")
            print("✅ The merge system works perfectly!")
            return True
        else:
            print("\n❌ FAILURE: Data restoration incomplete!")
            return False
            
    except Exception as e:
        print(f"\n❌ Test failed with error: {e}")
        return False

if __name__ == '__main__':
    success = main()
    sys.exit(0 if success else 1)
