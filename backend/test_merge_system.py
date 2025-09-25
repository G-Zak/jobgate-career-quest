#!/usr/bin/env python3
"""
Test script to verify the merge system works correctly
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

def test_backup_restore_cycle():
    """Test the complete backup and restore cycle"""
    
    print("🧪 Testing backup and restore cycle...")
    
    # Get initial counts
    initial_skills = Skill.objects.count()
    initial_tests = Test.objects.count()
    initial_questions = Question.objects.count()
    
    print(f"📊 Initial state: {initial_skills} skills, {initial_tests} tests, {initial_questions} questions")
    
    # Test backup
    print("\n🔄 Testing backup...")
    call_command('backup_tests', output_dir='test_backup', include_questions=True)
    
    # Verify backup files exist
    backup_files = [
        'test_backup/skills_backup.json',
        'test_backup/tests_backup.json',
        'test_backup/questions_backup.json'
    ]
    
    for file_path in backup_files:
        if os.path.exists(file_path):
            print(f"✅ Backup file created: {file_path}")
        else:
            print(f"❌ Backup file missing: {file_path}")
            return False
    
    # Test restore (with clear existing)
    print("\n🔄 Testing restore with clear existing...")
    call_command('restore_tests', input_dir='test_backup', clear_existing=True)
    
    # Verify counts after restore
    final_skills = Skill.objects.count()
    final_tests = Test.objects.count()
    final_questions = Question.objects.count()
    
    print(f"📊 Final state: {final_skills} skills, {final_tests} tests, {final_questions} questions")
    
    # Check if counts match
    if (final_skills == initial_skills and 
        final_tests == initial_tests and 
        final_questions == initial_questions):
        print("✅ Backup and restore cycle successful!")
        return True
    else:
        print("❌ Backup and restore cycle failed!")
        print(f"   Skills: {initial_skills} -> {final_skills}")
        print(f"   Tests: {initial_tests} -> {final_tests}")
        print(f"   Questions: {initial_questions} -> {final_questions}")
        return False

def test_validation():
    """Test the validation system"""
    
    print("\n🧪 Testing validation system...")
    
    # Run validation
    from validate_test_data import validate_test_data
    is_valid = validate_test_data()
    
    if is_valid:
        print("✅ Validation test passed!")
        return True
    else:
        print("❌ Validation test failed!")
        return False

def cleanup_test_files():
    """Clean up test files"""
    
    print("\n🧹 Cleaning up test files...")
    
    import shutil
    if os.path.exists('test_backup'):
        shutil.rmtree('test_backup')
        print("✅ Test backup directory removed")
    
    print("✅ Cleanup completed")

def main():
    """Run all tests"""
    
    print("🚀 Starting merge system tests...")
    
    try:
        # Test backup and restore
        backup_restore_success = test_backup_restore_cycle()
        
        # Test validation
        validation_success = test_validation()
        
        # Cleanup
        cleanup_test_files()
        
        # Summary
        print("\n📋 Test Results:")
        print(f"   Backup/Restore: {'✅ PASS' if backup_restore_success else '❌ FAIL'}")
        print(f"   Validation: {'✅ PASS' if validation_success else '❌ FAIL'}")
        
        if backup_restore_success and validation_success:
            print("\n🎉 All tests passed! The merge system is working correctly.")
            return True
        else:
            print("\n⚠️ Some tests failed. Check the output above for details.")
            return False
            
    except Exception as e:
        print(f"\n❌ Test failed with error: {e}")
        cleanup_test_files()
        return False

if __name__ == '__main__':
    success = main()
    sys.exit(0 if success else 1)
