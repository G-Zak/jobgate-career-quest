#!/usr/bin/env python
"""
Quick test script for SJT scoring system
Run with: python test_sjt_scoring.py
"""

import os
import sys
import django

# Setup Django
sys.path.append('.')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'careerquest.settings')
django.setup()

from django.db import connection
from testsengine.models import Question

def test_sjt_scoring():
    print("🔍 Testing SJT Scoring System")
    print("=" * 50)
    
    # Test 1: Check question structure
    print("\n1. Checking question structure...")
    questions = Question.objects.filter(test_id=4)[:3]
    for q in questions:
        print(f"Q{q.id}: {q.question_text[:60]}...")
        print(f"  Options: {len(q.options)} options")
        print(f"  Correct: {q.correct_answer}")
    
    # Test 2: Check scoring functions
    print("\n2. Testing scoring functions...")
    with connection.cursor() as cursor:
        # Individual question scoring
        cursor.execute('SELECT calculate_sjt_score(11, %s)', ['A'])
        score_a = cursor.fetchone()[0]
        print(f"Q11 Answer A: {score_a} points")
        
        cursor.execute('SELECT calculate_sjt_score(11, %s)', ['D'])
        score_d = cursor.fetchone()[0]
        print(f"Q11 Answer D: {score_d} points")
        
        # Total score calculation
        test_answers = '{"11": "A", "12": "B", "13": "C", "14": "A", "15": "D"}'
        cursor.execute('SELECT calculate_total_sjt_score(%s)', [test_answers])
        total_score = cursor.fetchone()[0]
        print(f"Total score for mixed answers: {total_score}")
        
        # Maximum possible score
        cursor.execute("""
            SELECT SUM(score_value) as max_score
            FROM testsengine_questionoption qo
            JOIN testsengine_question q ON qo.question_id = q.id
            WHERE q.test_id = 4 AND qo.score_value = 2
        """)
        max_score = cursor.fetchone()[0]
        print(f"Maximum possible score: {max_score}")
    
    # Test 3: Show sample options with scores
    print("\n3. Sample options with scores...")
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT question_id, option_letter, option_text, score_value, score_description
            FROM sjt_scoring_view 
            WHERE question_id IN (11, 12, 13)
            ORDER BY question_id, option_letter
            LIMIT 12
        """)
        options = cursor.fetchall()
        for q_id, letter, text, score, desc in options:
            print(f"Q{q_id} {letter}: {text[:50]}... | {score} pts ({desc})")
    
    # Test 4: Check database counts
    print("\n4. Database statistics...")
    with connection.cursor() as cursor:
        cursor.execute("SELECT COUNT(*) FROM testsengine_question WHERE test_id = 4")
        question_count = cursor.fetchone()[0]
        print(f"Total SJT questions: {question_count}")
        
        cursor.execute("SELECT COUNT(*) FROM testsengine_questionoption")
        option_count = cursor.fetchone()[0]
        print(f"Total question options: {option_count}")
        
        cursor.execute("SELECT COUNT(DISTINCT question_id) FROM testsengine_questionoption")
        questions_with_options = cursor.fetchone()[0]
        print(f"Questions with options: {questions_with_options}")
    
    print("\n✅ SJT Scoring System Test Complete!")

if __name__ == "__main__":
    test_sjt_scoring()
