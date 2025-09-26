#!/usr/bin/env python
"""
Check available test IDs
"""
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'careerquest.settings')
django.setup()

from testsengine.models import Test

def check_test_ids():
    """Check available test IDs and types"""
    print("🔍 Available Tests:")
    print("=" * 50)
    
    tests = Test.objects.filter(is_active=True).order_by('id')
    
    for test in tests:
        questions_count = test.questions.count()
        print(f"ID {test.id}: {test.title}")
        print(f"  Type: {test.test_type}")
        print(f"  Questions: {questions_count}")
        print(f"  Duration: {test.duration_minutes} minutes")
        print()

if __name__ == '__main__':
    check_test_ids()

