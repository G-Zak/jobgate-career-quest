#!/usr/bin/env python
"""
Test frontend integration by simulating the exact API call the frontend makes
"""
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'careerquest.settings')
django.setup()

from django.test import Client
from django.contrib.auth.models import User
from testsengine.models import Test, TestSubmission
import json

def test_frontend_integration():
    """Test the exact API flow the frontend uses"""
    
    print("🔍 TESTING FRONTEND INTEGRATION")
    print("=" * 50)
    
    # Create test client and user
    client = Client()
    user = User.objects.create_user(
        username='frontend_integration_user',
        email='frontend@test.com',
        password='testpass123'
    )
    
    # Login
    client.login(username='frontend_integration_user', password='testpass123')
    
    # Test different test types
    test_cases = [
        (21, 'NRT1 - Numerical Reasoning', 'numerical_reasoning'),
        (13, 'LRT1 - Logical Reasoning', 'logical_reasoning'),
        (30, 'SJT1 - Situational Judgment', 'situational_judgment'),
    ]
    
    for test_id, test_name, test_type in test_cases:
        print(f"\n📝 Testing {test_name}")
        print("-" * 40)
        
        try:
            test = Test.objects.get(id=test_id)
            
            # Clean up existing submissions
            TestSubmission.objects.filter(user=user, test=test).delete()
            
            # Get first 3 questions
            questions = list(test.questions.all()[:3])
            if not questions:
                print(f"⚠️ No questions found for {test_name}")
                continue
            
            # Create answers (all correct)
            answers_data = {}
            for q in questions:
                answers_data[str(q.id)] = q.correct_answer
            
            # Simulate exact frontend API call
            request_data = {
                'answers': answers_data,
                'time_taken_seconds': 300,
                'submission_metadata': {
                    'browser': 'Chrome',
                    'testType': test_type,
                    'device': 'Desktop'
                }
            }
            
            print(f"Making API call to /api/tests/{test_id}/submit/")
            print(f"Answers: {len(answers_data)} questions")
            
            response = client.post(
                f'/api/tests/{test_id}/submit/',
                data=json.dumps(request_data),
                content_type='application/json'
            )
            
            print(f"Response Status: {response.status_code}")
            
            if response.status_code == 201:
                response_data = response.json()
                
                print(f"✅ API Response Structure:")
                print(f"  message: {response_data.get('message', 'N/A')}")
                print(f"  submission_id: {response_data.get('submission_id', 'N/A')}")
                
                # Check score object structure
                score_data = response_data.get('score', {})
                print(f"  score object keys: {list(score_data.keys())}")
                
                # Verify key fields that frontend expects
                key_fields = [
                    'percentage_score', 'correct_answers', 'total_questions',
                    'raw_score', 'max_possible_score', 'grade_letter', 'passed'
                ]
                
                print(f"  Key score fields:")
                for field in key_fields:
                    value = score_data.get(field, 'MISSING')
                    print(f"    {field}: {value} ({type(value).__name__})")
                
                # Simulate what frontend does: setResults(data.score)
                frontend_results = score_data
                
                # Simulate TestResultsPage extractResultData logic
                if frontend_results.get('percentage_score') is not None:
                    extracted_data = {
                        'testId': str(test_id),
                        'score': int(frontend_results.get('correct_answers', 0)),
                        'totalQuestions': int(frontend_results.get('total_questions', 0)),
                        'percentage': float(frontend_results.get('percentage_score', 0)),
                        'timeSpent': 300,  # From request
                        'resultLabel': str(frontend_results.get('grade_letter', 'Completed')),
                        'isPassed': bool(frontend_results.get('passed', False))
                    }
                    
                    print(f"  Frontend extracted data:")
                    for key, value in extracted_data.items():
                        print(f"    {key}: {value} ({type(value).__name__})")
                    
                    # Check if this would show 0%
                    if extracted_data['percentage'] == 0:
                        print(f"  ❌ ISSUE: Frontend would show 0% score!")
                    else:
                        print(f"  ✅ Frontend would show {extracted_data['percentage']}% score")
                else:
                    print(f"  ❌ ISSUE: percentage_score field missing!")
                
            else:
                print(f"❌ API call failed: {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"Error: {error_data}")
                except:
                    print(f"Response content: {response.content}")
                    
        except Exception as e:
            print(f"❌ Error testing {test_name}: {str(e)}")
    
    print(f"\n📊 Frontend integration test completed!")

if __name__ == "__main__":
    test_frontend_integration()
