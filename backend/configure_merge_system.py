#!/usr/bin/env python3
"""
Configuration script to set up the merge system
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

def setup_merge_system():
    """Set up the complete merge system"""
    
    print("🚀 Configuring Test Data Merge System")
    print("=" * 50)
    
    # Check current state
    skills_count = Skill.objects.count()
    tests_count = Test.objects.count()
    questions_count = Question.objects.count()
    
    print(f"📊 Current database state:")
    print(f"   Skills: {skills_count}")
    print(f"   Tests: {tests_count}")
    print(f"   Questions: {questions_count}")
    
    if tests_count == 0:
        print("\n⚠️ No tests found in database!")
        print("🔄 Populating database with technical tests...")
        call_command('populate_technical_tests', force=True)
        
        # Update counts
        skills_count = Skill.objects.count()
        tests_count = Test.objects.count()
        questions_count = Question.objects.count()
        
        print(f"✅ Database populated:")
        print(f"   Skills: {skills_count}")
        print(f"   Tests: {tests_count}")
        print(f"   Questions: {questions_count}")
    
    # Create initial backup
    print(f"\n📦 Creating initial backup...")
    call_command('backup_tests', output_dir='backend/testsengine/fixtures', include_questions=True)
    
    # Verify backup
    backup_dir = 'backend/testsengine/fixtures'
    backup_files = [
        'skills_backup.json',
        'tests_backup.json',
        'questions_backup.json'
    ]
    
    print(f"\n📁 Backup files created:")
    for file in backup_files:
        file_path = os.path.join(backup_dir, file)
        if os.path.exists(file_path):
            size = os.path.getsize(file_path)
            print(f"   ✅ {file} ({size:,} bytes)")
        else:
            print(f"   ❌ {file} (missing)")
    
    # Create .gitignore for backup files (optional)
    gitignore_path = os.path.join(backup_dir, '.gitignore')
    with open(gitignore_path, 'w') as f:
        f.write("# Test data backups\n")
        f.write("*.json\n")
        f.write("!*.json\n")  # But include our backup files
    
    print(f"\n📝 Created .gitignore in {backup_dir}")
    
    # Test the system
    print(f"\n🧪 Testing the system...")
    call_command('restore_tests', input_dir=backup_dir, force=True)
    
    # Verify test worked
    final_skills = Skill.objects.count()
    final_tests = Test.objects.count()
    final_questions = Question.objects.count()
    
    if (final_skills == skills_count and 
        final_tests == tests_count and 
        final_questions == questions_count):
        print("✅ System test passed!")
    else:
        print("❌ System test failed!")
        return False
    
    print(f"\n🎉 Merge system configured successfully!")
    print(f"📚 Documentation: backend/TEST_DATA_MANAGEMENT.md")
    
    return True

def show_usage_instructions():
    """Show usage instructions"""
    
    print(f"\n📋 Usage Instructions:")
    print("=" * 50)
    
    print("🔄 Before merging with main:")
    print("   cd backend")
    print("   python manage.py backup_tests --include-questions")
    print("   git add backend/testsengine/fixtures/")
    print("   git commit -m 'Backup test data before merge'")
    print("   git merge main")
    
    print(f"\n🔄 After merging:")
    print("   cd backend")
    print("   python post_merge_restore.py")
    
    print(f"\n🔄 Verify everything worked:")
    print("   python validate_test_data.py")
    
    print(f"\n🔄 Emergency recovery:")
    print("   cd backend")
    print("   python manage.py populate_technical_tests --force")
    print("   python manage.py backup_tests --include-questions")

def main():
    """Main configuration function"""
    
    try:
        success = setup_merge_system()
        
        if success:
            show_usage_instructions()
            print(f"\n🎯 Next steps:")
            print("   1. Add backup files to git: git add backend/testsengine/fixtures/")
            print("   2. Commit: git commit -m 'Setup test data merge system'")
            print("   3. You're ready to merge safely!")
        else:
            print(f"\n❌ Configuration failed!")
            return False
        
        return True
        
    except Exception as e:
        print(f"\n❌ Configuration failed with error: {e}")
        return False

if __name__ == '__main__':
    success = main()
    sys.exit(0 if success else 1)
