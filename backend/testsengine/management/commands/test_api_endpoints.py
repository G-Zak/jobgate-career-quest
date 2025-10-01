"""
Django management command to test API endpoints
"""
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.test import Client
from django.urls import reverse
import json

from testsengine.models import Test, Question, TestSubmission

class Command(BaseCommand):
 help = 'Test API endpoints for the scoring system'

 def add_arguments(self, parser):
 parser.add_argument(
 '--create-user',
 action='store_true',
 help='Create a test user for API testing'
 )
 parser.add_argument(
 '--test-flow',
 action='store_true',
 help='Test complete flow: fetch test → submit answers → get results'
 )

 def handle(self, *args, **options):
 self.stdout.write(self.style.SUCCESS(' API ENDPOINTS TEST'))
 self.stdout.write('=' * 50)

 if options.get('create_user'):
 self.create_test_user()

 if options.get('test_flow'):
 self.test_complete_flow()

 if not any([options.get('create_user'), options.get('test_flow')]):
 self.test_basic_endpoints()

 def create_test_user(self):
 """Create a test user for API testing"""
 self.stdout.write('\n CREATING TEST USER')
 self.stdout.write('-' * 30)

 user, created = User.objects.get_or_create(
 username='api_test_user',
 defaults={
 'email': 'test@example.com',
 'first_name': 'API',
 'last_name': 'Tester'
 }
 )

 if created:
 user.set_password('testpass123')
 user.save()
 self.stdout.write(' Created new test user: api_test_user')
 else:
 self.stdout.write(' Test user already exists: api_test_user')

 self.stdout.write(f' Username: {user.username}')
 self.stdout.write(f' Email: {user.email}')

 def test_basic_endpoints(self):
 """Test basic API endpoints"""
 self.stdout.write('\n TESTING BASIC ENDPOINTS')
 self.stdout.write('-' * 40)

 client = Client()

 # Test health check (no auth required)
 try:
 response = client.get('/api/health/')
 if response.status_code == 200:
 data = response.json()
 self.stdout.write(f' Health Check: {data.get("status")}')
 self.stdout.write(f' Database Tests: {data.get("database", {}).get("tests", 0)}')
 self.stdout.write(f' Database Questions: {data.get("database", {}).get("questions", 0)}')
 else:
 self.stdout.write(f' Health Check failed: {response.status_code}')
 except Exception as e:
 self.stdout.write(f' Health Check error: {e}')

 # Create and login test user
 user = self.get_or_create_test_user()
 login_success = client.login(username='api_test_user', password='testpass123')

 if not login_success:
 self.stdout.write(' Failed to login test user')
 return

 self.stdout.write(' User authenticated successfully')

 # Test scoring config
 try:
 response = client.get('/api/scoring-config/')
 if response.status_code == 200:
 config = response.json()
 self.stdout.write(' Scoring Config retrieved')
 self.stdout.write(f' Coefficients: {config.get("difficulty_coefficients")}')
 self.stdout.write(f' Version: {config.get("scoring_version")}')
 else:
 self.stdout.write(f' Scoring Config failed: {response.status_code}')
 except Exception as e:
 self.stdout.write(f' Scoring Config error: {e}')

 # Test test list
 try:
 response = client.get('/api/tests/')
 if response.status_code == 200:
 data = response.json()
 tests = data.get('tests', [])
 self.stdout.write(f' Test List retrieved: {len(tests)} tests')
 if tests:
 self.stdout.write(f' First test: {tests[0].get("title")}')
 else:
 self.stdout.write(f' Test List failed: {response.status_code}')
 except Exception as e:
 self.stdout.write(f' Test List error: {e}')

 def test_complete_flow(self):
 """Test complete API flow"""
 self.stdout.write('\n TESTING COMPLETE API FLOW')
 self.stdout.write('-' * 40)

 client = Client()
 user = self.get_or_create_test_user()

 # Login
 login_success = client.login(username='api_test_user', password='testpass123')
 if not login_success:
 self.stdout.write(' Failed to login')
 return

 # Check if we have a test
 test = Test.objects.filter(is_active=True).first()
 if not test:
 self.stdout.write(' No active test found for testing')
 return

 self.stdout.write(f' Using test: {test.title}')

 # Step 1: Get test details
 try:
 response = client.get(f'/api/tests/{test.id}/')
 if response.status_code == 200:
 test_data = response.json()
 self.stdout.write(' Step 1: Test details retrieved')
 self.stdout.write(f' Questions: {len(test_data.get("questions", []))}')
 self.stdout.write(f' Duration: {test_data.get("duration_minutes")} minutes')
 self.stdout.write(f' Max Score: {test_data.get("max_possible_score")}')

 # Verify no correct answers are exposed
 questions = test_data.get('questions', [])
 has_correct_answers = any('correct_answer' in q for q in questions)
 if has_correct_answers:
 self.stdout.write(' SECURITY ISSUE: Correct answers exposed!')
 else:
 self.stdout.write(' Security check passed: No correct answers exposed')

 else:
 self.stdout.write(f' Step 1 failed: {response.status_code}')
 return
 except Exception as e:
 self.stdout.write(f' Step 1 error: {e}')
 return

 # Step 2: Get questions (alternative endpoint)
 try:
 response = client.get(f'/api/tests/{test.id}/questions/')
 if response.status_code == 200:
 questions_data = response.json()
 self.stdout.write(' Step 2: Questions retrieved separately')
 self.stdout.write(f' Questions count: {len(questions_data.get("questions", []))}')
 else:
 self.stdout.write(f' Step 2 failed: {response.status_code}')
 except Exception as e:
 self.stdout.write(f' Step 2 error: {e}')

 # Step 3: Submit answers
 questions = test.questions.all()
 if not questions:
 self.stdout.write(' No questions found in test')
 return

 # Create sample answers (mix of correct and incorrect)
 answers_data = {}
 for i, question in enumerate(questions):
 if i % 2 == 0: # Every other question correct
 answers_data[str(question.id)] = question.correct_answer
 else: # Wrong answers
 wrong_options = ['A', 'B', 'C', 'D']
 if question.correct_answer in wrong_options:
 wrong_options.remove(question.correct_answer)
 answers_data[str(question.id)] = wrong_options[0]

 submission_payload = {
 'answers': answers_data,
 'time_taken_seconds': 900 # 15 minutes
 }

 try:
 response = client.post(
 f'/api/tests/{test.id}/submit/',
 data=json.dumps(submission_payload),
 content_type='application/json'
 )

 if response.status_code == 201:
 result = response.json()
 self.stdout.write(' Step 3: Test submitted successfully')
 self.stdout.write(f' Submission ID: {result.get("submission_id")}')

 score = result.get('score', {})
 if score:
 self.stdout.write(f' Score: {score.get("percentage_score")}%')
 self.stdout.write(f' Grade: {score.get("grade_letter")}')
 self.stdout.write(f' Status: {"PASSED" if score.get("passed") else "FAILED"}')

 # Step 4: Get detailed results
 submission_id = result.get('submission_id')
 if submission_id:
 try:
 response = client.get(f'/api/submissions/{submission_id}/results/')
 if response.status_code == 200:
 detailed_results = response.json()
 self.stdout.write(' Step 4: Detailed results retrieved')
 self.stdout.write(f' Correct answers: {detailed_results.get("correct_answers")}/{detailed_results.get("total_questions")}')

 # Now correct answers should be visible
 answers = detailed_results.get('answers', [])
 if answers and 'correct_answer' in answers[0]:
 self.stdout.write(' Post-submission: Correct answers now visible')
 else:
 self.stdout.write(' Post-submission: Correct answers still hidden')

 else:
 self.stdout.write(f' Step 4 failed: {response.status_code}')
 except Exception as e:
 self.stdout.write(f' Step 4 error: {e}')

 else:
 self.stdout.write(f' Step 3 failed: {response.status_code}')
 if response.content:
 self.stdout.write(f' Error: {response.content.decode()}')
 except Exception as e:
 self.stdout.write(f' Step 3 error: {e}')

 self.stdout.write('\n API flow testing complete!')

 def get_or_create_test_user(self):
 """Get or create test user"""
 user, created = User.objects.get_or_create(
 username='api_test_user',
 defaults={
 'email': 'test@example.com',
 'first_name': 'API',
 'last_name': 'Tester'
 }
 )

 if created:
 user.set_password('testpass123')
 user.save()

 return user
