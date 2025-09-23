#!/usr/bin/env python3
"""
Database Verification Script for JobGate Career Quest
Run this script to verify your database setup is working correctly.
"""

import os
import sys
import django
from pathlib import Path

# Add the backend directory to Python path
backend_dir = Path(__file__).parent / "backend"
sys.path.insert(0, str(backend_dir))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'careerquest.settings')
django.setup()

from testsengine.models import Test, Question, QuestionOption, TestSession, Score
from django.contrib.auth.models import User

def verify_database():
    """Verify database setup and data integrity."""
    print("🔍 Verifying JobGate Career Quest Database...")
    print("=" * 50)
    
    # Check basic connectivity
    try:
        test_count = Test.objects.count()
        print(f"✅ Database connection: OK")
        print(f"📊 Total tests: {test_count}")
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return False
    
    # Check questions
    try:
        question_count = Question.objects.count()
        print(f"📝 Total questions: {question_count}")
        
        if question_count < 1000:
            print("⚠️  Warning: Low question count. Expected 1000+ questions.")
        else:
            print("✅ Question count: OK")
    except Exception as e:
        print(f"❌ Questions check failed: {e}")
        return False
    
    # Check question options
    try:
        option_count = QuestionOption.objects.count()
        print(f"🔘 Total answer options: {option_count}")
        
        if option_count < 4000:
            print("⚠️  Warning: Low option count. Expected 4000+ options.")
        else:
            print("✅ Answer options: OK")
    except Exception as e:
        print(f"❌ Options check failed: {e}")
        return False
    
    # Check test sessions
    try:
        session_count = TestSession.objects.count()
        print(f"📈 Total test sessions: {session_count}")
    except Exception as e:
        print(f"❌ Test sessions check failed: {e}")
        return False
    
    # Check users
    try:
        user_count = User.objects.count()
        print(f"👥 Total users: {user_count}")
    except Exception as e:
        print(f"❌ Users check failed: {e}")
        return False
    
    # Check specific test categories
    print("\n📚 Test Categories:")
    test_categories = {
        'VRT': 'Verbal Reasoning',
        'NRT': 'Numerical Reasoning', 
        'LRT': 'Logical Reasoning',
        'ART': 'Abstract Reasoning',
        'DRT': 'Diagrammatic Reasoning',
        'SRT': 'Spatial Reasoning',
        'SJT': 'Situational Judgment',
        'TST': 'Technical Skills'
    }
    
    for prefix, name in test_categories.items():
        try:
            count = Test.objects.filter(name__startswith=prefix).count()
            print(f"  {name} ({prefix}): {count} tests")
        except Exception as e:
            print(f"  {name} ({prefix}): Error - {e}")
    
    # Check question distribution
    print("\n📊 Question Distribution:")
    for prefix, name in test_categories.items():
        try:
            tests = Test.objects.filter(name__startswith=prefix)
            total_questions = 0
            for test in tests:
                total_questions += Question.objects.filter(test=test).count()
            print(f"  {name}: {total_questions} questions")
        except Exception as e:
            print(f"  {name}: Error - {e}")
    
    print("\n" + "=" * 50)
    print("🎉 Database verification complete!")
    print("\n📋 Next steps:")
    print("1. Start the application: docker-compose up -d")
    print("2. Access frontend: http://localhost:3000")
    print("3. Access admin: http://localhost:8000/admin")
    print("4. Check API: http://localhost:8000/api/tests/")
    
    return True

if __name__ == "__main__":
    verify_database()
