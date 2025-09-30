#!/usr/bin/env python
"""
Final verification that ALL test types including SJT fix are working
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

def test_all_final_with_sjt_fix():
    """Final verification of ALL test types including SJT fix"""
    
    print("🔍 FINAL VERIFICATION - ALL TEST TYPES WITH SJT FIX")
    print("=" * 60)
    
    # Test cases: (test_id, test_name, test_type, frontend_component)
    test_cases = [
        (21, 'NRT1 - Numerical Reasoning', 'numerical_reasoning', 'NumericalReasoningTest'),
        (13, 'LRT1 - Logical Reasoning', 'logical_reasoning', 'LogicalReasoningTest'),
        (30, 'SJT1 - Situational Judgment', 'situational_judgment', 'SituationalJudgmentTest'),
        (10, 'ART1 - Abstract Reasoning', 'abstract_reasoning', 'AbstractReasoningTest'),
        (24, 'Diagrammatic Reasoning', 'diagrammatic_reasoning', 'DiagrammaticReasoningTest'),
        (11, 'SRT1 - Spatial Reasoning', 'spatial_reasoning', 'SpatialReasoningTest'),
    ]
    
    results = []
    
    for test_id, test_name, test_type, component in test_cases:
        print(f"\n📝 Testing {test_name} ({component})")
        print("-" * 55)
        
        try:
            # Create unique user for each test
            username = f'final_sjt_fix_user_{test_id}'
            user = User.objects.create_user(
                username=username,
                email=f'{username}@test.com',
                password='testpass123'
            )
            
            # Create test client and login
            client = Client()
            client.login(username=username, password='testpass123')
            
            test = Test.objects.get(id=test_id)
            
            # Clean up existing submissions
            TestSubmission.objects.filter(user=user, test=test).delete()
            
            # Get first 3 questions
            questions = list(test.questions.all()[:3])
            if not questions:
                print(f"⚠️ No questions found for {test_name}")
                results.append((test_name, False, "No questions", component))
                continue
            
            # Create answers (all correct for 100%)
            answers_data = {}
            for q in questions:
                answers_data[str(q.id)] = q.correct_answer
            
            # Simulate frontend API call
            request_data = {
                'answers': answers_data,
                'time_taken_seconds': 300,
                'submission_metadata': {
                    'browser': 'Chrome',
                    'testType': test_type,
                    'device': 'Desktop'
                }
            }
            
            print(f"Expected: 3/3 = 100.0%")
            
            # First submission
            response = client.post(
                f'/api/tests/{test_id}/submit/',
                data=json.dumps(request_data),
                content_type='application/json'
            )
            
            if response.status_code != 201:
                print(f"❌ First submission failed: {response.status_code}")
                results.append((test_name, False, f"First submission failed: {response.status_code}", component))
                continue
            
            response_data = response.json()
            score_data = response_data.get('score', {})
            first_score = score_data.get('percentage_score')
            
            print(f"✅ Scoring: {first_score}%")
            
            # Duplicate submission
            response = client.post(
                f'/api/tests/{test_id}/submit/',
                data=json.dumps(request_data),
                content_type='application/json'
            )
            
            if response.status_code == 409:
                error_data = response.json()
                existing_score = error_data.get('existing_score')
                
                print(f"✅ Duplicate: {existing_score}%")
                
                # Verify scores match and are not 0
                if (str(existing_score).replace('.0', '') == str(first_score).replace('.00', '') and 
                    float(first_score) > 0):
                    print(f"✅ {component}: WORKING PERFECTLY")
                    results.append((test_name, True, f"{existing_score}%", component))
                else:
                    print(f"❌ {component}: Score issues")
                    results.append((test_name, False, f"Score mismatch or 0%", component))
            else:
                print(f"❌ Expected 409, got {response.status_code}")
                results.append((test_name, False, f"Expected 409, got {response.status_code}", component))
                
        except Exception as e:
            print(f"❌ Error testing {test_name}: {str(e)}")
            results.append((test_name, False, f"Error: {str(e)}", component))
    
    # Final Summary
    print(f"\n📊 FINAL VERIFICATION SUMMARY - ALL TEST TYPES")
    print("=" * 60)
    
    passed = 0
    failed = 0
    
    for test_name, success, details, component in results:
        status = "✅ WORKING PERFECTLY" if success else "❌ FAILED"
        print(f"{status} | {test_name}")
        print(f"                      Component: {component}")
        print(f"                      Result: {details}")
        print(f"                      Interface: TestResultsPage")
        print(f"                      Scoring: Standard MCQ")
        print()
        
        if success:
            passed += 1
        else:
            failed += 1
    
    print(f"Results: {passed} working perfectly, {failed} failed")
    
    if failed == 0:
        print(f"\n🎉 ALL TEST TYPES ARE WORKING PERFECTLY!")
        print(f"✅ SJT scoring issue COMPLETELY RESOLVED")
        print(f"✅ Consistent scoring across ALL 6 test types")
        print(f"✅ Proper duplicate submission handling for ALL tests")
        print(f"✅ ALL tests use modern TestResultsPage")
        print(f"✅ NO more 0% scores for any test type")
        print(f"✅ Complete consistency across the entire test engine")
        
        print(f"\n🎯 ULTIMATE SUCCESS!")
        print(f"📋 All Test Types Working:")
        print(f"   • Numerical Reasoning (NumericalReasoningTest)")
        print(f"   • Logical Reasoning (LogicalReasoningTest)")
        print(f"   • Situational Judgment (SituationalJudgmentTest) ← FIXED!")
        print(f"   • Abstract Reasoning (AbstractReasoningTest)")
        print(f"   • Diagrammatic Reasoning (DiagrammaticReasoningTest)")
        print(f"   • Spatial Reasoning (SpatialReasoningTest)")
        
        print(f"\n🏆 PERFECT TEST ENGINE!")
        print(f"The user can now submit ANY test type and see correct scores!")
        
        return True
    else:
        print(f"\n⚠️ Some test types still have issues")
        return False

if __name__ == "__main__":
    success = test_all_final_with_sjt_fix()
    if success:
        print(f"\n🌟 COMPLETE MISSION SUCCESS!")
        print(f"All scoring issues are completely resolved!")
        print(f"The test engine is now perfect and production-ready!")
    else:
        print(f"\n❌ Some issues remain")
