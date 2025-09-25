#!/usr/bin/env python3
"""
Setup script to initialize and backup test data for safe merging
This script should be run after cloning the repository or before merging
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
    print("🚀 Setting up test data for safe merging...")
    
    # Check if tests already exist
    if Test.objects.exists():
        print("✅ Tests already exist in database")
        print(f"   📊 Found {Test.objects.count()} tests")
        print(f"   📝 Found {Question.objects.count()} questions")
        print(f"   🎯 Found {Skill.objects.count()} skills")
        
        # Create backup
        print("📦 Creating backup of existing test data...")
        call_command('backup_tests', output_dir='backend/testsengine/fixtures', include_questions=True)
        print("✅ Backup created successfully")
        
    else:
        print("⚠️ No tests found in database")
        print("🔄 Populating database with technical tests...")
        
        # Run the population script
        call_command('populate_technical_tests', force=True)
        
        # Create backup
        print("📦 Creating backup of populated test data...")
        call_command('backup_tests', output_dir='backend/testsengine/fixtures', include_questions=True)
        print("✅ Backup created successfully")
    
    print("\n🎉 Test data setup completed!")
    print("📁 Backup files are saved in: backend/testsengine/fixtures/")
    print("\n📋 Next steps:")
    print("   1. Add backup files to git: git add backend/testsengine/fixtures/")
    print("   2. Commit backup: git commit -m 'Backup test data'")
    print("   3. Merge safely: git merge main")
    print("   4. Restore if needed: python manage.py restore_tests")

if __name__ == '__main__':
    main()
