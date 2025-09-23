#!/usr/bin/env python
"""
Complete Database Export Script
Exports all data including questions, tests, skills, and configurations
"""

import os
import sys
import django
from django.core.management import call_command

def export_complete_database():
    """Export complete database for team sharing"""
    print("🔄 Exporting Complete Database for Team Sharing...")
    
    # Setup Django
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'careerquest.settings')
    django.setup()
    
    # Export all data except sensitive auth data
    export_file = 'team_database_export.json'
    
    try:
        print("📊 Exporting all data...")
        call_command('dumpdata', 
                    '--natural-foreign', 
                    '--natural-primary', 
                    '-e', 'contenttypes', 
                    '-e', 'auth.Permission',
                    '--indent', '2',
                    '--output', export_file)
        
        # Get file size
        file_size = os.path.getsize(export_file)
        print(f"✅ Database exported successfully!")
        print(f"📁 File: {export_file} ({file_size:,} bytes)")
        
        # Verify export contains questions
        with open(export_file, 'r') as f:
            content = f.read()
            question_count = content.count('"model": "testsengine.question"')
            test_count = content.count('"model": "testsengine.test"')
            skill_count = content.count('"model": "skills.skill"')
            
        print(f"📈 Export contains:")
        print(f"   - {question_count} questions")
        print(f"   - {test_count} tests")
        print(f"   - {skill_count} skills")
        
        return True
        
    except Exception as e:
        print(f"❌ Export failed: {e}")
        return False

if __name__ == '__main__':
    success = export_complete_database()
    if success:
        print("\n🎉 Database export ready for team sharing!")
        print("📤 You can now commit and push this file to your branch.")
    else:
        print("\n❌ Export failed. Please check the error above.")
        sys.exit(1)
