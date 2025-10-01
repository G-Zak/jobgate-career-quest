"""
Django management command to test dedicated scoring API endpoints
"""
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.test import Client
import json

from testsengine.models import Test, Question, TestSubmission

class Command(BaseCommand):
 help = 'Test dedicated scoring API endpoints'

 def add_arguments(self, parser):
 parser.add_argument(
 '--test-calculate',
 action='store_true',
 help='Test calculate score endpoint (preview mode)'
 )
 parser.add_argument(
 '--test-recalculate',
 action='store_true',
 help='Test recalculate score endpoint'
 )
 parser.add_argument(
 '--test-analytics',
 action='store_true',
 help='Test analytics and comparison endpoints'
 )
 parser.add_argument(
 '--test-leaderboard',
 action='store_true',
 help='Test leaderboard endpoint'
 )

 def handle(self, *args, **options):
 self.stdout.write(self.style.SUCCESS(' DEDICATED SCORING ENDPOINTS TEST'))
 self.stdout.write('=' * 60)

 if options.get('test_calculate'):
 self.test_calculate_score()

 if options.get('test_recalculate'):
 self.test_recalculate_score()

 if options.get('test_analytics'):
 self.test_analytics()

 if options.get('test_leaderboard'):
 self.test_leaderboard()

 if not any([options.get('test_calculate'), options.get('test_recalculate'),
 options.get('test_analytics'), options.get('test_leaderboard')]):
 self.test_all_endpoints()

 def test_all_endpoints(self):
 """Test all scoring endpoints"""
 self.stdout.write('\n Running all scoring endpoint tests...\n')
 self.test_calculate_score()
 self.test_recalculate_score()
 self.test_analytics()
 self.test_leaderboard()

 def test_calculate_score(self):
 """Test the calculate score endpoint (preview mode)"""
 self.stdout.write('\n TESTING CALCULATE SCORE ENDPOINT')
 self.stdout.write('-' * 50)

 client = Client()
 user = self.get_or_create_test_user()

 if not client.login(username='api_test_user', password='testpass123'):
 self.stdout.write(' Failed to login')
 return

 test = Test.objects.filter(is_active=True).first()
 if not test:
 self.stdout.write(' No active test found')
 return

 # Test calculate score with sample answers
 questions = test.questions.all()
 answers_data = {}

 # Create mixed answers (some correct, some wrong)
 for i, question in enumerate(questions):
 if i % 2 == 0: # Every other correct
 answers_data[str(question.id)] = question.correct_answer
 else: # Wrong answers
 wrong_options = ['A', 'B', 'C', 'D']
 if question.correct_answer in wrong_options:
 wrong_options.remove(question.correct_answer)
 answers_data[str(question.id)] = wrong_options[0]

 payload = {
 'answers': answers_data,
 'time_taken_seconds': 800
 }

 try:
 response = client.post(
 f'/api/tests/{test.id}/calculate-score/',
 data=json.dumps(payload),
 content_type='application/json'
 )

 if response.status_code == 200:
 result = response.json()
 score_preview = result.get('score_preview', {})

 self.stdout.write(' Calculate Score: SUCCESS')
 self.stdout.write(f' Preview Score: {score_preview.get("percentage_score")}%')
 self.stdout.write(f' Grade: {score_preview.get("grade_letter")}')
 self.stdout.write(f' Correct: {score_preview.get("correct_answers")}/{score_preview.get("total_questions")}')
 self.stdout.write(f' Raw Score: {score_preview.get("raw_score")}/{score_preview.get("max_possible_score")}')
 self.stdout.write(f' Note: {result.get("note")}')

 # Verify difficulty breakdown
 breakdown = score_preview.get('difficulty_breakdown', {})
 self.stdout.write(f' Difficulty Performance:')
 for level in ['easy', 'medium', 'hard']:
 if level in breakdown:
 correct = breakdown[level]['correct']
 score = breakdown[level]['score']
 self.stdout.write(f' {level.title()}: {correct}/3 correct = {score} points')

 else:
 self.stdout.write(f' Calculate Score failed: {response.status_code}')
 if response.content:
 self.stdout.write(f' Error: {response.content.decode()}')

 except Exception as e:
 self.stdout.write(f' Calculate Score error: {e}')

 def test_recalculate_score(self):
 """Test the recalculate score endpoint"""
 self.stdout.write('\n TESTING RECALCULATE SCORE ENDPOINT')
 self.stdout.write('-' * 50)

 client = Client()
 user = self.get_or_create_test_user()

 if not client.login(username='api_test_user', password='testpass123'):
 self.stdout.write(' Failed to login')
 return

 # Find an existing submission for this user
 submission = TestSubmission.objects.filter(user=user).first()

 if not submission:
 self.stdout.write(' No existing submission found for recalculation test')
 return

 try:
 response = client.post(f'/api/submissions/{submission.id}/recalculate/')

 if response.status_code == 200:
 result = response.json()
 score = result.get('score', {})

 self.stdout.write(' Recalculate Score: SUCCESS')
 self.stdout.write(f' Submission ID: {result.get("submission_id")}')
 self.stdout.write(f' Recalculated Score: {score.get("percentage_score")}%')
 self.stdout.write(f' Grade: {score.get("grade_letter")}')
 self.stdout.write(f' Message: {result.get("message")}')

 else:
 self.stdout.write(f' Recalculate Score failed: {response.status_code}')

 except Exception as e:
 self.stdout.write(f' Recalculate Score error: {e}')

 def test_analytics(self):
 """Test analytics and comparison endpoints"""
 self.stdout.write('\n TESTING ANALYTICS ENDPOINTS')
 self.stdout.write('-' * 50)

 client = Client()
 user = self.get_or_create_test_user()

 if not client.login(username='api_test_user', password='testpass123'):
 self.stdout.write(' Failed to login')
 return

 # Test user analytics
 try:
 response = client.get('/api/analytics/scores/')

 if response.status_code == 200:
 result = response.json()
 analytics = result.get('analytics')

 if analytics:
 self.stdout.write(' Score Analytics: SUCCESS')

 overall = analytics.get('overall_performance', {})
 self.stdout.write(f' Total Tests: {overall.get("total_tests_taken")}')
 self.stdout.write(f' Average Score: {overall.get("average_score")}%')
 self.stdout.write(f' Pass Rate: {overall.get("pass_rate")}%')

 difficulty = analytics.get('difficulty_analysis', {})
 self.stdout.write(f' Difficulty Performance:')
 self.stdout.write(f' Easy: {difficulty.get("easy_average")}%')
 self.stdout.write(f' Medium: {difficulty.get("medium_average")}%')
 self.stdout.write(f' Hard: {difficulty.get("hard_average")}%')
 else:
 self.stdout.write(' Score Analytics: No data available')

 else:
 self.stdout.write(f' Score Analytics failed: {response.status_code}')

 except Exception as e:
 self.stdout.write(f' Score Analytics error: {e}')

 # Test score comparison
 submissions = TestSubmission.objects.filter(user=user)[:3]
 if submissions.count() >= 2:
 submission_ids = ','.join(str(s.id) for s in submissions)

 try:
 response = client.get(f'/api/scores/compare/?submissions={submission_ids}')

 if response.status_code == 200:
 result = response.json()
 stats = result.get('statistics', {})

 self.stdout.write(' Score Comparison: SUCCESS')
 self.stdout.write(f' Submissions Compared: {stats.get("total_submissions")}')
 self.stdout.write(f' Average Score: {stats.get("average_score")}%')
 self.stdout.write(f' Highest Score: {stats.get("highest_score")}%')
 self.stdout.write(f' Improvement: {stats.get("improvement")}%')

 else:
 self.stdout.write(f' Score Comparison failed: {response.status_code}')

 except Exception as e:
 self.stdout.write(f' Score Comparison error: {e}')
 else:
 self.stdout.write('️ Score Comparison: Not enough submissions for comparison')

 def test_leaderboard(self):
 """Test leaderboard endpoint"""
 self.stdout.write('\n TESTING LEADERBOARD ENDPOINT')
 self.stdout.write('-' * 50)

 client = Client()
 user = self.get_or_create_test_user()

 if not client.login(username='api_test_user', password='testpass123'):
 self.stdout.write(' Failed to login')
 return

 test = Test.objects.filter(is_active=True).first()
 if not test:
 self.stdout.write(' No active test found')
 return

 try:
 response = client.get(f'/api/tests/{test.id}/leaderboard/')

 if response.status_code == 200:
 result = response.json()
 leaderboard = result.get('leaderboard', [])

 self.stdout.write(' Leaderboard: SUCCESS')
 self.stdout.write(f' Test: {result.get("test_info", {}).get("title")}')
 self.stdout.write(f' Total Participants: {result.get("total_participants")}')
 self.stdout.write(f' User Rank: {result.get("user_rank", "Not ranked")}')

 if leaderboard:
 self.stdout.write(f' Top Performers:')
 for entry in leaderboard[:3]: # Show top 3
 self.stdout.write(f' #{entry["rank"]}: {entry["username"]} - {entry["percentage_score"]}% ({entry["grade_letter"]})')
 else:
 self.stdout.write(' No leaderboard data available')

 else:
 self.stdout.write(f' Leaderboard failed: {response.status_code}')

 except Exception as e:
 self.stdout.write(f' Leaderboard error: {e}')

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

 if created or not user.check_password('testpass123'):
 user.set_password('testpass123')
 user.save()

 return user
