#!/usr/bin/env python
"""
Database Import Script for Teammates
This script imports the shared database data.
"""

import os
import sys
import django
from django.core.management import call_command

def import_database():
    """Import shared database data"""
    print("🔄 Importing Shared Database Data...")
    
    # Setup Django
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'careerquest.settings')
    django.setup()
    
    # Check if export file exists (try team export first, then fallback)
    export_file = 'team_database_export.json'
    if not os.path.exists(export_file):
        export_file = 'database_export.json'
        if not os.path.exists(export_file):
            print("❌ No database export file found!")
            print("Please make sure team_database_export.json or database_export.json is in the backend directory.")
            return False
    
    # Get file size
    file_size = os.path.getsize(export_file)
    print(f"📁 Found database export file: {export_file} ({file_size:,} bytes)")
    
    # Run migrations first (creates empty tables)
    print("\n1️⃣ Running migrations...")
    try:
        call_command('migrate')
        print("✅ Migrations completed")
    except Exception as e:
        print(f"⚠️ Migration warning: {e}")
    
    # Import the data
    print("\n2️⃣ Importing data...")
    try:
        call_command('loaddata', export_file)
        print("✅ Data imported successfully")
    except Exception as e:
        print(f"❌ Import failed: {e}")
        return False
    
    # Verify import
    print("\n3️⃣ Verifying import...")
    try:
        from testsengine.models import Question
        from testsengine.question_option_model import QuestionOption
        from skills.models import Skill
        
        questions = Question.objects.count()
        options = QuestionOption.objects.count()
        skills = Skill.objects.count()
        
        print(f"📊 Imported Data:")
        print(f"   - Questions: {questions}")
        print(f"   - Question Options: {options}")
        print(f"   - Skills: {skills}")
        
        if questions > 100 and options > 100 and skills > 10:
            print("🎉 Database import completed successfully!")
            print("\n🚀 You can now run:")
            print("   - Backend: python manage.py runserver")
            print("   - Frontend: npm run dev")
            return True
        else:
            print("⚠️ Import may be incomplete")
            return False
            
    except Exception as e:
        print(f"❌ Verification failed: {e}")
        return False

if __name__ == "__main__":
    success = import_database()
    if success:
        print("\n✅ Setup complete! Your database now has the same data as your teammate.")
    else:
        print("\n❌ Setup failed. Please check the error messages above.")
