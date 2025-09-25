#!/usr/bin/env python3
"""
Post-merge script to restore test data after merging with main
This script should be run after merging branches
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

def main():
    print("🔄 Post-merge test data restoration...")
    
    # Check if backup files exist
    backup_dir = 'backend/testsengine/fixtures'
    if not os.path.exists(backup_dir):
        print("⚠️ No backup directory found")
        print("🔄 Running setup script to populate tests...")
        call_command('populate_technical_tests', force=True)
        return
    
    # Check if tests exist in database
    if Test.objects.exists():
        print(f"✅ Tests already exist in database ({Test.objects.count()} tests)")
        print("🔄 Updating with backup data...")
        call_command('restore_tests', input_dir=backup_dir, force=True)
    else:
        print("⚠️ No tests found in database")
        print("🔄 Restoring from backup...")
        call_command('restore_tests', input_dir=backup_dir, force=True)
    
    # Verify restoration
    test_count = Test.objects.count()
    question_count = Question.objects.count()
    skill_count = Skill.objects.count()
    
    print(f"\n✅ Restoration completed!")
    print(f"   📊 Tests: {test_count}")
    print(f"   📝 Questions: {question_count}")
    print(f"   🎯 Skills: {skill_count}")
    
    if test_count == 0:
        print("⚠️ No tests found after restoration")
        print("🔄 Running population script as fallback...")
        call_command('populate_technical_tests', force=True)
        print("✅ Fallback population completed")

if __name__ == '__main__':
    main()
