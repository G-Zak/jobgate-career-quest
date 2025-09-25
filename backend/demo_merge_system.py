#!/usr/bin/env python3
"""
Demo script showing how to use the merge system
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

def demo_backup_process():
    """Demonstrate the backup process"""
    
    print("🎬 DEMO: Test Data Backup Process")
    print("=" * 50)
    
    # Show current data
    skills_count = Skill.objects.count()
    tests_count = Test.objects.count()
    questions_count = Question.objects.count()
    
    print(f"📊 Current database state:")
    print(f"   Skills: {skills_count}")
    print(f"   Tests: {tests_count}")
    print(f"   Questions: {questions_count}")
    
    # Create backup
    print(f"\n🔄 Creating backup...")
    call_command('backup_tests', output_dir='demo_backup', include_questions=True)
    
    # Show backup files
    print(f"\n📁 Backup files created:")
    backup_dir = 'demo_backup'
    for file in os.listdir(backup_dir):
        file_path = os.path.join(backup_dir, file)
        size = os.path.getsize(file_path)
        print(f"   {file} ({size:,} bytes)")
    
    return backup_dir

def demo_restore_process(backup_dir):
    """Demonstrate the restore process"""
    
    print(f"\n🎬 DEMO: Test Data Restore Process")
    print("=" * 50)
    
    # Show data before restore
    skills_count = Skill.objects.count()
    tests_count = Test.objects.count()
    questions_count = Question.objects.count()
    
    print(f"📊 Database state before restore:")
    print(f"   Skills: {skills_count}")
    print(f"   Tests: {tests_count}")
    print(f"   Questions: {questions_count}")
    
    # Restore from backup
    print(f"\n🔄 Restoring from backup...")
    call_command('restore_tests', input_dir=backup_dir, force=True)
    
    # Show data after restore
    skills_count = Skill.objects.count()
    tests_count = Test.objects.count()
    questions_count = Question.objects.count()
    
    print(f"\n📊 Database state after restore:")
    print(f"   Skills: {skills_count}")
    print(f"   Tests: {tests_count}")
    print(f"   Questions: {questions_count}")

def demo_git_workflow():
    """Demonstrate the Git workflow"""
    
    print(f"\n🎬 DEMO: Git Workflow for Safe Merging")
    print("=" * 50)
    
    print("📋 Step-by-step Git workflow:")
    print("   1. Before merging:")
    print("      cd backend")
    print("      python manage.py backup_tests --include-questions")
    print("      git add backend/testsengine/fixtures/")
    print("      git commit -m 'Backup test data before merge'")
    print("")
    print("   2. Merge:")
    print("      git merge main")
    print("")
    print("   3. After merging:")
    print("      cd backend")
    print("      python post_merge_restore.py")
    print("")
    print("   4. Verify:")
    print("      python validate_test_data.py")

def cleanup_demo():
    """Clean up demo files"""
    
    print(f"\n🧹 Cleaning up demo files...")
    
    import shutil
    if os.path.exists('demo_backup'):
        shutil.rmtree('demo_backup')
        print("✅ Demo backup directory removed")

def main():
    """Run the complete demo"""
    
    print("🚀 Test Data Merge System Demo")
    print("=" * 50)
    print("This demo shows how to safely manage test data during Git operations.")
    print("")
    
    try:
        # Demo backup
        backup_dir = demo_backup_process()
        
        # Demo restore
        demo_restore_process(backup_dir)
        
        # Demo Git workflow
        demo_git_workflow()
        
        # Cleanup
        cleanup_demo()
        
        print(f"\n🎉 Demo completed successfully!")
        print(f"📚 For more information, see: backend/TEST_DATA_MANAGEMENT.md")
        
    except Exception as e:
        print(f"\n❌ Demo failed with error: {e}")
        cleanup_demo()
        return False
    
    return True

if __name__ == '__main__':
    success = main()
    sys.exit(0 if success else 1)
