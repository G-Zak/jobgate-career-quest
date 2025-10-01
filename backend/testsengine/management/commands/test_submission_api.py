"""
Django management command to comprehensively test the submission API endpoint
"""
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.test import Client
import json

from testsengine.models import Test, Question, TestSubmission

class Command(BaseCommand):
 help = 'Comprehensively test the submission API endpoint'

 def add_arguments(self, parser):
 parser.add_argument(
 '--test-valid-submission',
 action='store_true',
 help='Test valid submission flow'
 )
 parser.add_argument(
 '--test-validation',
 action='store_true',
 help='Test validation and error handling'
 )
 parser.add_argument(
 '--test-duplicate-submission',
 action='store_true',
 help='Test duplicate submission handling'
 )
 parser.add_argument(
 '--test-metadata',
 action='store_true',
 help='Test submission with metadata'
 )

 def handle(self, *args, **options):
 self.stdout.write(self.style.SUCCESS(' SUBMISSION API COMPREHENSIVE TEST'))
 self.stdout.write('=' * 60)

 if options.get('test_valid_submission'):
 self.test_valid_submission()

 if options.get('test_validation'):
 self.test_validation()

 if options.get('test_duplicate_submission'):
 self.test_duplicate_submission()

 if options.get('test_metadata'):
 self.test_metadata()

 if not any([options.get('test_valid_submission'), options.get('test_validation'),
 options.get('test_duplicate_submission'), options.get('test_metadata')]):
 self.test_all_scenarios()

 def test_all_scenarios(self):
 """Test all submission scenarios"""
 self.stdout.write('\n Running all submission tests...\n')
 self.test_valid_submission()
 self.test_validation()
 self.test_duplicate_submission()
 self.test_metadata()

 def test_valid_submission(self):
 """Test valid submission with comprehensive validation"""
 self.stdout.write('\n TESTING VALID SUBMISSION FLOW')
 self.stdout.write('-' * 50)

 client = Client()
 user = self.get_or_create_test_user('submission_test_user')

 if not client.login(username='submission_test_user', password='testpass123'):
 self.stdout.write(' Failed to login')
 return

 test = Test.objects.filter(is_active=True).first()
 if not test:
 self.stdout.write(' No active test found')
 return

 # Clear any existing submissions for clean test
 TestSubmission.objects.filter(user=user, test=test).delete()

 # Create comprehensive test answers
 questions = test.questions.all()
 answers_data = {}

 # Mix of correct and incorrect answers for realistic scoring
 for i, question in enumerate(questions):
 if i % 3 == 0: # Every third correct
 answers_data[str(question.id)] = question.correct_answer
 else: # Wrong answers
 wrong_options = ['A', 'B', 'C', 'D']
 if question.correct_answer in wrong_options:
 wrong_options.remove(question.correct_answer)
 answers_data[str(question.id)] = wrong_options[0]

 payload = {
 'answers': answers_data,
 'time_taken_seconds': 900, # 15 minutes
 'submission_metadata': {
 'browser': 'Chrome',
 'device': 'Desktop',
 'session_id': 'test123'
 }
 }

 try:
 response = client.post(
 f'/api/tests/{test.id}/submit/',
 data=json.dumps(payload),
 content_type='application/json'
 )

 if response.status_code == 201:
 result = response.json()

 self.stdout.write(' Valid Submission: SUCCESS')
 self.stdout.write(f' Submission ID: {result.get("submission_id")}')
 self.stdout.write(f' Message: {result.get("message")}')

 # Check score data
 score = result.get('score', {})
 self.stdout.write(f' Score: {score.get("percentage_score")}%')
 self.stdout.write(f' Grade: {score.get("grade_letter")}')
 self.stdout.write(f' Correct: {score.get("correct_answers")}/{score.get("total_questions")}')

 # Check processing info
 processing_info = result.get('processing_info', {})
 self.stdout.write(f' Questions Answered: {processing_info.get("questions_answered")}')
 self.stdout.write(f' Completion Rate: {processing_info.get("completion_rate")}%')
 self.stdout.write(f' Time Efficiency: {processing_info.get("time_efficiency")}')

 # Check next steps
 next_steps = result.get('next_steps', {})
 self.stdout.write(f' Next Steps Available: {len(next_steps)} endpoints')

 # Check warnings
 warnings = result.get('warnings', [])
 if warnings:
 self.stdout.write(f' Warnings: {len(warnings)}')
 for warning in warnings:
 self.stdout.write(f' • {warning}')

 else:
 self.stdout.write(f' Valid Submission failed: {response.status_code}')
 if response.content:
 self.stdout.write(f' Error: {response.content.decode()}')

 except Exception as e:
 self.stdout.write(f' Valid Submission error: {e}')

 def test_validation(self):
 """Test validation and error handling"""
 self.stdout.write('\n TESTING VALIDATION AND ERROR HANDLING')
 self.stdout.write('-' * 50)

 client = Client()
 user = self.get_or_create_test_user('validation_test_user')

 if not client.login(username='validation_test_user', password='testpass123'):
 self.stdout.write(' Failed to login')
 return

 test = Test.objects.filter(is_active=True).first()
 if not test:
 self.stdout.write(' No active test found')
 return

 # Clear any existing submissions
 TestSubmission.objects.filter(user=user, test=test).delete()

 validation_tests = [
 {
 'name': 'Missing Answers',
 'payload': {
 'answers': {},
 'time_taken_seconds': 900
 },
 'expected_status': 400
 },
 {
 'name': 'Invalid Answer Format',
 'payload': {
 'answers': {'1': 'X', '2': 'Y'},
 'time_taken_seconds': 900
 },
 'expected_status': 400
 },
 {
 'name': 'Very Short Time',
 'payload': {
 'answers': {'1': 'A'},
 'time_taken_seconds': 5
 },
 'expected_status': 400
 },
 {
 'name': 'Extremely Long Time',
 'payload': {
 'answers': {'1': 'A'},
 'time_taken_seconds': 4000
 },
 'expected_status': 400
 },
 {
 'name': 'Missing Questions',
 'payload': {
 'answers': {'1': 'A'}, # Only answer first question
 'time_taken_seconds': 900
 },
 'expected_status': 400
 }
 ]

 for test_case in validation_tests:
 try:
 response = client.post(
 f'/api/tests/{test.id}/submit/',
 data=json.dumps(test_case['payload']),
 content_type='application/json'
 )

 if response.status_code == test_case['expected_status']:
 self.stdout.write(f' {test_case["name"]}: Validated correctly ({response.status_code})')
 else:
 self.stdout.write(f' {test_case["name"]}: Expected {test_case["expected_status"]}, got {response.status_code}')

 # Show error details for failed validations
 if response.status_code >= 400:
 try:
 error_data = response.json()
 error_msg = error_data.get('error', 'Unknown error')
 self.stdout.write(f' Error: {error_msg}')
 except:
 pass

 except Exception as e:
 self.stdout.write(f' {test_case["name"]} error: {e}')

 def test_duplicate_submission(self):
 """Test duplicate submission handling"""
 self.stdout.write('\n TESTING DUPLICATE SUBMISSION HANDLING')
 self.stdout.write('-' * 50)

 client = Client()
 user = self.get_or_create_test_user('duplicate_test_user')

 if not client.login(username='duplicate_test_user', password='testpass123'):
 self.stdout.write(' Failed to login')
 return

 test = Test.objects.filter(is_active=True).first()
 if not test:
 self.stdout.write(' No active test found')
 return

 # Clear any existing submissions
 TestSubmission.objects.filter(user=user, test=test).delete()

 # Create valid answers
 questions = test.questions.all()
 answers_data = {str(q.id): q.correct_answer for q in questions}

 payload = {
 'answers': answers_data,
 'time_taken_seconds': 800
 }

 # First submission should succeed
 try:
 response1 = client.post(
 f'/api/tests/{test.id}/submit/',
 data=json.dumps(payload),
 content_type='application/json'
 )

 if response1.status_code == 201:
 self.stdout.write(' First Submission: SUCCESS')
 result1 = response1.json()
 submission_id = result1.get('submission_id')
 score = result1.get('score', {}).get('percentage_score')
 self.stdout.write(f' Submission ID: {submission_id}')
 self.stdout.write(f' Score: {score}%')
 else:
 self.stdout.write(f' First submission failed: {response1.status_code}')
 return

 # Second submission should be rejected with 409 Conflict
 response2 = client.post(
 f'/api/tests/{test.id}/submit/',
 data=json.dumps(payload),
 content_type='application/json'
 )

 if response2.status_code == 409:
 self.stdout.write(' Duplicate Submission: PROPERLY REJECTED')
 result2 = response2.json()
 self.stdout.write(f' Error: {result2.get("error")}')
 self.stdout.write(f' Existing Submission ID: {result2.get("existing_submission_id")}')
 self.stdout.write(f' Existing Score: {result2.get("existing_score")}%')
 self.stdout.write(f' Message: {result2.get("message")}')
 else:
 self.stdout.write(f' Duplicate submission handling failed: {response2.status_code}')

 except Exception as e:
 self.stdout.write(f' Duplicate submission test error: {e}')

 def test_metadata(self):
 """Test submission with metadata"""
 self.stdout.write('\n TESTING SUBMISSION WITH METADATA')
 self.stdout.write('-' * 50)

 client = Client()
 user = self.get_or_create_test_user('metadata_test_user')

 if not client.login(username='metadata_test_user', password='testpass123'):
 self.stdout.write(' Failed to login')
 return

 test = Test.objects.filter(is_active=True).first()
 if not test:
 self.stdout.write(' No active test found')
 return

 # Clear any existing submissions
 TestSubmission.objects.filter(user=user, test=test).delete()

 # Create valid answers
 questions = test.questions.all()
 answers_data = {str(q.id): q.correct_answer for q in questions[:3]} # Only answer first 3

 metadata_tests = [
 {
 'name': 'Valid Metadata',
 'payload': {
 'answers': answers_data,
 'time_taken_seconds': 1000,
 'submission_metadata': {
 'browser': 'Firefox',
 'device': 'Mobile',
 'user_agent': 'Mozilla/5.0',
 'screen_resolution': '1920x1080'
 }
 },
 'expected_status': 400 # Should fail due to missing questions, but metadata should be valid
 },
 {
 'name': 'Invalid Metadata Key',
 'payload': {
 'answers': answers_data,
 'time_taken_seconds': 1000,
 'submission_metadata': {
 'invalid_key': 'test'
 }
 },
 'expected_status': 400
 },
 {
 'name': 'Metadata Value Too Long',
 'payload': {
 'answers': answers_data,
 'time_taken_seconds': 1000,
 'submission_metadata': {
 'browser': 'A' * 300 # Too long
 }
 },
 'expected_status': 400
 }
 ]

 for test_case in metadata_tests:
 try:
 response = client.post(
 f'/api/tests/{test.id}/submit/',
 data=json.dumps(test_case['payload']),
 content_type='application/json'
 )

 self.stdout.write(f' {test_case["name"]}: Status {response.status_code}')

 if response.status_code >= 400:
 try:
 error_data = response.json()
 error_msg = error_data.get('error', 'Unknown error')
 self.stdout.write(f' Error: {error_msg}')
 except:
 pass

 except Exception as e:
 self.stdout.write(f' {test_case["name"]} error: {e}')

 def get_or_create_test_user(self, username):
 """Get or create test user with specified username"""
 user, created = User.objects.get_or_create(
 username=username,
 defaults={
 'email': f'{username}@example.com',
 'first_name': 'Test',
 'last_name': 'User'
 }
 )

 if created or not user.check_password('testpass123'):
 user.set_password('testpass123')
 user.save()

 return user
