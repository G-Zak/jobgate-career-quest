#!/usr/bin/env python
"""
Check test submissions in database
"""
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'careerquest.settings')
django.setup()

from testsengine.models import TestSubmission, Score, Test

def check_test_submissions():
    """Check test submissions in database"""
    print("🔍 Test Submissions in Database:")
    print("=" * 50)
    
    # Check submissions
    submissions = TestSubmission.objects.all()
    print(f"Total submissions: {submissions.count()}")
    
    # Check scores
    scores = Score.objects.all()
    print(f"Total scores: {scores.count()}")
    
    # Show recent submissions
    print("\nRecent submissions:")
    for sub in submissions.order_by('-submitted_at')[:10]:
        user_info = sub.user.username if sub.user else "Anonymous"
        score_info = f"{sub.score.percentage_score}%" if hasattr(sub, 'score') and sub.score else "No score"
        print(f"  ID {sub.id}: Test {sub.test_id} ({sub.test.title if sub.test else 'Unknown'}), User: {user_info}, Score: {score_info}")
    
    # Check for technical tests specifically
    print("\nTechnical test submissions:")
    tech_submissions = submissions.filter(test__test_type='technical')
    print(f"Technical test submissions: {tech_submissions.count()}")
    
    for sub in tech_submissions:
        user_info = sub.user.username if sub.user else "Anonymous"
        score_info = f"{sub.score.percentage_score}%" if hasattr(sub, 'score') and sub.score else "No score"
        print(f"  ID {sub.id}: {sub.test.title}, User: {user_info}, Score: {score_info}")

if __name__ == '__main__':
    check_test_submissions()

