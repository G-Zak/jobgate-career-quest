#!/usr/bin/env python
"""
Verification: SJT scoring returns >0 when correct answers are submitted, and duplicate submission is handled.
Uses a unique username each run to avoid unique-constraint errors.
"""
import os
import json
import time
import random
import string
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'careerquest.settings')
django.setup()

from django.test import Client
from django.contrib.auth.models import User
from testsengine.models import Test, TestSubmission

def unique_username(prefix="sjt_verify_"):
    suffix = f"{int(time.time())}_{random.randint(1000,9999)}"
    return prefix + suffix

def run():
    print("\n🔎 Verifying SJT scoring (unique user)...")
    sjt_test = Test.objects.filter(test_type='situational_judgment').first()
    if not sjt_test:
        print("❌ No SJT test found")
        return False
    print(f"Using SJT: {sjt_test.title} (ID: {sjt_test.id})")

    # Prepare questions
    questions = list(sjt_test.questions.all()[:5])
    if not questions:
        print("❌ No questions found for SJT")
        return False

    # Create unique user
    uname = unique_username()
    user = User.objects.create_user(username=uname, email=f"{uname}@test.com", password="testpass123")

    client = Client()
    client.login(username=uname, password="testpass123")

    # Ensure clean slate
    TestSubmission.objects.filter(user=user, test=sjt_test).delete()

    # Submit correct answers for selected questions
    answers = {str(q.id): q.correct_answer for q in questions}
    payload = {
        "answers": answers,
        "time_taken_seconds": 120,
        "submission_metadata": {"testType": "situational_judgment"}
    }

    print(f"Submitting answers for {len(answers)} questions...")
    resp = client.post(f"/api/tests/{sjt_test.id}/submit/", data=json.dumps(payload), content_type="application/json")
    if resp.status_code != 201:
        print(f"❌ Submission failed: {resp.status_code}\n{resp.content}")
        return False

    data = resp.json()
    score = float(data["score"]["percentage_score"]) if "score" in data else 0.0
    print(f"✅ Score: {score}% (correct={data['score']['correct_answers']}/{data['score']['total_questions']})")
    if score <= 0:
        print("❌ Expected > 0 score for correct answers")
        return False

    # Duplicate submission should return 409
    resp2 = client.post(f"/api/tests/{sjt_test.id}/submit/", data=json.dumps(payload), content_type="application/json")
    if resp2.status_code != 409:
        print(f"❌ Expected 409 on duplicate, got {resp2.status_code}")
        return False
    print("✅ Duplicate submission handled properly (409)")
    return True

if __name__ == "__main__":
    ok = run()
    print("\n🎯 Result:", "PASS" if ok else "FAIL")

