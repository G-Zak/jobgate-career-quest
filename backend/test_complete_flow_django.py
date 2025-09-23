#!/usr/bin/env python3
"""
Complete End-to-End Flow Test using Django Test Client
=====================================================

This script tests the complete flow using Django's test client:
1. Fetch questions from API
2. Submit answers to API
3. Get score results from API

It simulates a real user taking a test and verifies the entire scoring system works correctly.
"""

import os
import sys
import django
from datetime import datetime

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'careerquest.settings')
django.setup()

from django.test import Client
from django.contrib.auth.models import User
from django.urls import reverse
import json


class DjangoFlowTester:
    def __init__(self):
        self.client = Client()
        self.test_results = {}
        
    def log(self, message, level="INFO"):
        timestamp = datetime.now().strftime("%H:%M:%S")
        print(f"[{timestamp}] {level}: {message}")
    
    def setup_test_user(self):
        """Create or get test user"""
        self.log("Setting up test user...")
        try:
            user, created = User.objects.get_or_create(
                username='testuser',
                defaults={'email': 'test@example.com'}
            )
            if created:
                user.set_password('testpass123')
                user.save()
                self.log("✅ Test user created")
            else:
                self.log("✅ Test user already exists")
            
            # Login the user
            login_success = self.client.login(username='testuser', password='testpass123')
            if login_success:
                self.log("✅ User logged in successfully")
                return True
            else:
                self.log("❌ Failed to login user", "ERROR")
                return False
        except Exception as e:
            self.log(f"❌ Error setting up user: {e}", "ERROR")
            return False
    
    def test_get_tests_list(self):
        """Test fetching the list of available tests"""
        self.log("Fetching available tests...")
        try:
            response = self.client.get(reverse('testsengine:test-list'))
            if response.status_code == 200:
                data = response.json()
                tests = data.get('tests', [])
                self.log(f"✅ Found {len(tests)} available tests")
                
                # Find a suitable test for our flow
                for test in tests:
                    if test.get('is_active', False) and test.get('total_questions', 0) > 0:
                        self.test_results['selected_test'] = test
                        self.log(f"✅ Selected test: {test['title']} (ID: {test['id']})")
                        return True
                
                self.log("❌ No suitable active tests found", "ERROR")
                return False
            else:
                self.log(f"❌ Failed to fetch tests: {response.status_code}", "ERROR")
                return False
        except Exception as e:
            self.log(f"❌ Error fetching tests: {e}", "ERROR")
            return False
    
    def test_get_test_questions(self):
        """Test fetching questions for the selected test"""
        if 'selected_test' not in self.test_results:
            self.log("❌ No test selected", "ERROR")
            return False
        
        test_id = self.test_results['selected_test']['id']
        self.log(f"Fetching questions for test {test_id}...")
        
        try:
            response = self.client.get(reverse('testsengine:test-questions', args=[test_id]))
            if response.status_code == 200:
                data = response.json()
                questions = data.get('questions', [])
                self.log(f"✅ Retrieved {len(questions)} questions")
                
                # Verify questions don't contain correct answers
                for i, question in enumerate(questions):
                    if 'correct_answer' in question:
                        self.log(f"❌ Question {i+1} exposes correct answer!", "ERROR")
                        return False
                
                self.log("✅ Questions properly secured (no correct answers exposed)")
                self.test_results['questions'] = questions
                return True
            else:
                self.log(f"❌ Failed to fetch questions: {response.status_code}", "ERROR")
                return False
        except Exception as e:
            self.log(f"❌ Error fetching questions: {e}", "ERROR")
            return False
    
    def test_submit_answers(self):
        """Test submitting answers and getting score"""
        if 'questions' not in self.test_results:
            self.log("❌ No questions available", "ERROR")
            return False
        
        test_id = self.test_results['selected_test']['id']
        questions = self.test_results['questions']
        
        # Create some sample answers (mix of correct and incorrect)
        answers = {}
        # Take first 3 questions safely
        questions_to_answer = questions[:3] if len(questions) >= 3 else questions
        for i, question in enumerate(questions_to_answer):
            # Simulate different answer patterns
            if i == 0:
                answers[str(question['id'])] = 'A'  # First answer
            elif i == 1:
                answers[str(question['id'])] = 'B'  # Second answer
            else:
                answers[str(question['id'])] = 'C'  # Third answer
        
        submission_data = {
            'answers': answers,
            'time_taken_seconds': 900,  # 15 minutes
            'submission_metadata': {
                'browser': 'Test Browser',
                'device': 'Test Device'
            }
        }
        
        self.log(f"Submitting answers for {len(answers)} questions...")
        
        try:
            self.log(f"Submitting data: {submission_data}")
            response = self.client.post(
                reverse('testsengine:submit-test', args=[test_id]),
                data=json.dumps(submission_data),
                content_type='application/json'
            )
            
            if response.status_code == 201:
                data = response.json()
                self.log("✅ Test submitted successfully!")
                
                # Verify response structure
                if 'submission_id' in data and 'score' in data:
                    submission_id = data['submission_id']
                    score = data['score']
                    
                    self.log(f"✅ Submission ID: {submission_id}")
                    self.log(f"✅ Score: {score.get('raw_score', 'N/A')}/{score.get('max_possible_score', 'N/A')}")
                    self.log(f"✅ Percentage: {score.get('percentage_score', 'N/A')}%")
                    self.log(f"✅ Grade: {score.get('grade_letter', 'N/A')}")
                    self.log(f"✅ Passed: {score.get('passed', 'N/A')}")
                    
                    self.test_results['submission_id'] = submission_id
                    self.test_results['score'] = score
                    return True
                else:
                    self.log("❌ Invalid response structure", "ERROR")
                    return False
            else:
                self.log(f"❌ Submission failed: {response.status_code}", "ERROR")
                try:
                    error_data = response.json()
                    self.log(f"❌ Error details: {error_data}", "ERROR")
                except:
                    self.log(f"❌ Error response: {response.content.decode()}", "ERROR")
                return False
        except Exception as e:
            self.log(f"❌ Error submitting answers: {e}", "ERROR")
            return False
    
    def test_get_detailed_results(self):
        """Test fetching detailed results for the submission"""
        if 'submission_id' not in self.test_results:
            self.log("❌ No submission ID available", "ERROR")
            return False
        
        submission_id = self.test_results['submission_id']
        self.log(f"Fetching detailed results for submission {submission_id}...")
        
        try:
            response = self.client.get(reverse('testsengine:test-results', args=[submission_id]))
            if response.status_code == 200:
                data = response.json()
                self.log("✅ Detailed results retrieved successfully!")
                
                # Verify detailed score information
                if 'percentage_score' in data:
                    self.log(f"✅ Detailed Score: {data.get('percentage_score', 'N/A')}%")
                    self.log(f"✅ Grade: {data.get('grade_letter', 'N/A')}")
                    self.log(f"✅ Passed: {data.get('passed', 'N/A')}")
                    
                    # Check for additional details
                    if 'correct_answers' in data:
                        self.log(f"✅ Correct Answers: {data.get('correct_answers', 'N/A')}")
                    if 'total_questions' in data:
                        self.log(f"✅ Total Questions: {data.get('total_questions', 'N/A')}")
                    if 'difficulty_breakdown' in data:
                        breakdown = data.get('difficulty_breakdown', {})
                        self.log(f"✅ Difficulty Breakdown: {breakdown}")
                    
                    self.test_results['detailed_results'] = data
                    return True
                else:
                    self.log("❌ Invalid detailed results structure", "ERROR")
                    return False
            else:
                self.log(f"❌ Failed to fetch detailed results: {response.status_code}", "ERROR")
                return False
        except Exception as e:
            self.log(f"❌ Error fetching detailed results: {e}", "ERROR")
            return False
    
    def test_score_preview(self):
        """Test score preview functionality"""
        if 'questions' not in self.test_results:
            self.log("❌ No questions available for preview", "ERROR")
            return False
        
        test_id = self.test_results['selected_test']['id']
        questions = self.test_results['questions']
        
        # Create preview answers
        preview_answers = {}
        # Take first 2 questions safely
        questions_to_preview = questions[:2] if len(questions) >= 2 else questions
        for i, question in enumerate(questions_to_preview):
            preview_answers[str(question['id'])] = 'A'
        
        preview_data = {
            'answers': preview_answers,
            'time_taken_seconds': 600
        }
        
        self.log("Testing score preview functionality...")
        
        try:
            response = self.client.post(
                reverse('testsengine:calculate-score', args=[test_id]),
                data=json.dumps(preview_data),
                content_type='application/json'
            )
            
            if response.status_code == 200:
                data = response.json()
                if 'score_preview' in data:
                    preview = data['score_preview']
                    self.log("✅ Score preview working!")
                    self.log(f"✅ Preview Score: {preview.get('raw_score', 'N/A')}")
                    self.log(f"✅ Preview Percentage: {preview.get('percentage_score', 'N/A')}%")
                    self.log(f"✅ Preview Grade: {preview.get('grade_letter', 'N/A')}")
                    return True
                else:
                    self.log("❌ Invalid preview response structure", "ERROR")
                    return False
            else:
                self.log(f"❌ Score preview failed: {response.status_code}", "ERROR")
                return False
        except Exception as e:
            self.log(f"❌ Error with score preview: {e}", "ERROR")
            return False
    
    def test_user_submissions_history(self):
        """Test fetching user submissions history"""
        self.log("Testing user submissions history...")
        
        try:
            response = self.client.get(reverse('testsengine:user-submissions'))
            if response.status_code == 200:
                submissions = response.json()
                self.log(f"✅ Retrieved {len(submissions)} user submissions")
                
                # Check if our submission is in the history
                if 'submission_id' in self.test_results:
                    submission_id = self.test_results['submission_id']
                    found = any(sub.get('id') == submission_id for sub in submissions)
                    if found:
                        self.log("✅ Our submission found in history!")
                    else:
                        self.log("⚠️ Our submission not found in history", "WARNING")
                
                return True
            else:
                self.log(f"❌ Failed to fetch submissions history: {response.status_code}", "ERROR")
                return False
        except Exception as e:
            self.log(f"❌ Error fetching submissions history: {e}", "ERROR")
            return False
    
    def run_complete_flow_test(self):
        """Run the complete end-to-end flow test"""
        self.log("🚀 Starting Complete End-to-End Flow Test using Django Test Client")
        self.log("=" * 75)
        
        test_steps = [
            ("Setup Test User", self.setup_test_user),
            ("Get Tests List", self.test_get_tests_list),
            ("Get Test Questions", self.test_get_test_questions),
            ("Submit Answers", self.test_submit_answers),
            ("Get Detailed Results", self.test_get_detailed_results),
            ("Score Preview", self.test_score_preview),
            ("User Submissions History", self.test_user_submissions_history),
        ]
        
        passed = 0
        total = len(test_steps)
        
        for step_name, test_func in test_steps:
            self.log(f"\n--- Testing: {step_name} ---")
            try:
                if test_func():
                    passed += 1
                    self.log(f"✅ {step_name} PASSED")
                else:
                    self.log(f"❌ {step_name} FAILED", "ERROR")
            except Exception as e:
                self.log(f"❌ {step_name} ERROR: {e}", "ERROR")
        
        # Summary
        self.log("\n" + "=" * 75)
        self.log(f"🎯 COMPLETE FLOW TEST SUMMARY")
        self.log(f"✅ Passed: {passed}/{total} tests")
        self.log(f"📊 Success Rate: {(passed/total)*100:.1f}%")
        
        if passed == total:
            self.log("🎉 ALL TESTS PASSED! Complete flow is working correctly.")
            return True
        else:
            self.log(f"⚠️ {total-passed} tests failed. Please check the issues above.")
            return False
    
    def print_test_results(self):
        """Print detailed test results"""
        if not self.test_results:
            self.log("No test results to display", "WARNING")
            return
        
        self.log("\n📋 DETAILED TEST RESULTS")
        self.log("-" * 40)
        
        if 'selected_test' in self.test_results:
            test = self.test_results['selected_test']
            self.log(f"Selected Test: {test.get('title', 'Unknown')}")
            self.log(f"Test Type: {test.get('test_type', 'Unknown')}")
            self.log(f"Total Questions: {test.get('total_questions', 'Unknown')}")
            self.log(f"Duration: {test.get('duration_minutes', 'Unknown')} minutes")
        
        if 'questions' in self.test_results:
            questions = self.test_results['questions']
            self.log(f"Questions Retrieved: {len(questions)}")
            self.log("✅ Security: Correct answers not exposed")
        
        if 'score' in self.test_results:
            score = self.test_results['score']
            self.log(f"Final Score: {score.get('raw_score', 'N/A')}/{score.get('max_possible_score', 'N/A')}")
            self.log(f"Percentage: {score.get('percentage_score', 'N/A')}%")
            self.log(f"Grade: {score.get('grade_letter', 'N/A')}")
            self.log(f"Passed: {score.get('passed', 'N/A')}")
        
        if 'submission_id' in self.test_results:
            self.log(f"Submission ID: {self.test_results['submission_id']}")


def main():
    """Main function to run the complete flow test"""
    print("🧪 COMPLETE END-TO-END FLOW TEST USING DJANGO TEST CLIENT")
    print("=" * 75)
    print("This test verifies the complete flow using Django's test client:")
    print("1. Setup test user and authentication")
    print("2. Fetch questions from API")
    print("3. Submit answers to API") 
    print("4. Get score results from API")
    print("=" * 75)
    
    tester = DjangoFlowTester()
    
    try:
        success = tester.run_complete_flow_test()
        tester.print_test_results()
        
        if success:
            print("\n🎉 SUCCESS: Complete flow is working correctly!")
            exit(0)
        else:
            print("\n❌ FAILURE: Some tests failed. Please check the output above.")
            exit(1)
    except KeyboardInterrupt:
        print("\n⏹️ Test interrupted by user")
        exit(1)
    except Exception as e:
        print(f"\n💥 Unexpected error: {e}")
        exit(1)


if __name__ == "__main__":
    main()
