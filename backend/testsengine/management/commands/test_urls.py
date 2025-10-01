"""
Django management command to test and validate all URL patterns
"""
from django.core.management.base import BaseCommand
from django.urls import reverse, NoReverseMatch
from django.test import Client
from django.contrib.auth.models import User
from django.conf import settings
import importlib

from testsengine import views

class Command(BaseCommand):
 help = 'Test and validate all URL patterns for the testsengine app'

 def add_arguments(self, parser):
 parser.add_argument(
 '--test-existing',
 action='store_true',
 help='Test only currently implemented URL patterns'
 )
 parser.add_argument(
 '--test-all',
 action='store_true',
 help='Test all URL patterns including future ones'
 )
 parser.add_argument(
 '--show-structure',
 action='store_true',
 help='Show complete URL structure and organization'
 )

 def handle(self, *args, **options):
 self.stdout.write(self.style.SUCCESS(' URL PATTERNS VALIDATION'))
 self.stdout.write('=' * 60)

 if options.get('show_structure'):
 self.show_url_structure()

 if options.get('test_existing'):
 self.test_existing_urls()

 if options.get('test_all'):
 self.test_all_urls()

 if not any([options.get('show_structure'), options.get('test_existing'), options.get('test_all')]):
 self.show_url_structure()
 self.test_existing_urls()

 def show_url_structure(self):
 """Show the complete URL structure and organization"""
 self.stdout.write('\n URL STRUCTURE OVERVIEW')
 self.stdout.write('-' * 50)

 url_categories = {
 ' CORE TEST MANAGEMENT': [
 'api/tests/',
 'api/tests/<id>/',
 'api/tests/<id>/questions/',
 'api/tests/<id>/submit/',
 'api/tests/<id>/stats/',
 ],
 ' SUBMISSION & RESULTS': [
 'api/submissions/',
 'api/submissions/<id>/results/',
 'api/my-submissions/',
 ],
 '️ SCORING ENDPOINTS': [
 'api/tests/<id>/calculate-score/',
 'api/submissions/<id>/recalculate/',
 'api/scores/compare/',
 'api/tests/<id>/leaderboard/',
 ],
 ' CODING CHALLENGES': [
 'api/coding-challenges/',
 'api/coding-challenges/<id>/',
 'api/coding-challenges/<id>/submit/',
 'api/coding-submissions/',
 ],
 ' ANALYTICS & REPORTING': [
 'api/analytics/scores/',
 'api/analytics/progress/',
 'api/reports/user/<id>/',
 'api/exports/scores/',
 ],
 ' UTILITIES & CONFIG': [
 'api/scoring-config/',
 'api/validate-answers/',
 'api/health/',
 'api/status/',
 ],
 ' ADMIN MANAGEMENT': [
 'api/admin/tests/',
 'api/admin/questions/',
 'api/admin/submissions/',
 'api/admin/system/backup/',
 ],
 ' API DOCUMENTATION': [
 'api/docs/',
 'api/schema/',
 'api/endpoints/',
 ]
 }

 for category, urls in url_categories.items():
 self.stdout.write(f'\n{category}:')
 for url in urls:
 self.stdout.write(f' • {url}')

 self.stdout.write(f'\n Total URL patterns: {sum(len(urls) for urls in url_categories.values())}')

 def test_existing_urls(self):
 """Test currently implemented URL patterns"""
 self.stdout.write('\n TESTING EXISTING URL PATTERNS')
 self.stdout.write('-' * 50)

 # URL patterns that should currently exist and work
 existing_patterns = [
 # Core test management (implemented)
 ('test-list', [], 'GET'),
 ('test-detail', [1], 'GET'),
 ('test-questions', [1], 'GET'),
 ('submit-test', [1], 'POST'),
 ('test-stats', [1], 'GET'),

 # Submission and results (implemented)
 ('test-results', [1], 'GET'),
 ('user-submissions', [], 'GET'),

 # Scoring endpoints (implemented)
 ('calculate-score', [1], 'POST'),
 ('recalculate-score', [1], 'POST'),
 ('compare-scores', [], 'GET'),
 ('test-leaderboard', [1], 'GET'),

 # Analytics (implemented)
 ('score-analytics', [], 'GET'),

 # Utilities (implemented)
 ('scoring-config', [], 'GET'),
 ('validate-answers', [], 'POST'),
 ('health-check', [], 'GET'),
 ]

 implemented_count = 0
 total_count = len(existing_patterns)

 for pattern_name, args, method in existing_patterns:
 try:
 # Test URL reverse
 url = reverse(f'testsengine:{pattern_name}', args=args)

 # Check if view exists
 view_exists = self.check_view_exists(pattern_name)

 if view_exists:
 self.stdout.write(f' {pattern_name}: {url} ({method})')
 implemented_count += 1
 else:
 self.stdout.write(f' ️ {pattern_name}: {url} (URL exists, view needs implementation)')

 except NoReverseMatch:
 self.stdout.write(f' {pattern_name}: URL pattern not found')
 except Exception as e:
 self.stdout.write(f' {pattern_name}: Error - {e}')

 self.stdout.write(f'\n Implementation Status: {implemented_count}/{total_count} ({implemented_count/total_count*100:.1f}%)')

 def test_all_urls(self):
 """Test all URL patterns including future ones"""
 self.stdout.write('\n TESTING ALL URL PATTERNS (Including Future)')
 self.stdout.write('-' * 50)

 # All URL patterns including future ones
 all_patterns = [
 # Existing patterns
 'test-list', 'test-detail', 'test-questions', 'submit-test', 'test-stats',
 'test-results', 'user-submissions',
 'calculate-score', 'recalculate-score', 'compare-scores', 'test-leaderboard',
 'score-analytics', 'scoring-config', 'validate-answers', 'health-check',

 # Future patterns (planned but not implemented)
 'start-test', 'submission-list', 'submission-detail',
 'score-list', 'score-detail',
 'coding-challenge-list', 'coding-challenge-detail', 'coding-submit',
 'coding-submission-list', 'coding-submission-detail',
 'test-session-list', 'test-session-detail', 'active-test-session',
 'test-attempt-list', 'test-attempt-detail', 'test-attempt-create',
 'progress-analytics', 'performance-analytics', 'coding-analytics',
 'system-overview', 'test-analytics', 'user-analytics',
 'user-report', 'test-report', 'score-export', 'submission-export',
 'system-config', 'test-types', 'difficulty-levels',
 'validate-code', 'preview-test', 'system-status', 'system-metrics',
 'admin-test-list', 'admin-question-list', 'admin-submission-list',
 'import-test-data', 'export-test-data', 'bulk-create-questions',
 'system-cleanup', 'system-backup',
 'api-docs', 'api-schema', 'api-endpoints'
 ]

 implemented = 0
 future = 0
 errors = 0

 for pattern_name in all_patterns:
 try:
 # Try to reverse the URL
 url = reverse(f'testsengine:{pattern_name}')

 # Check if view is implemented
 view_exists = self.check_view_exists(pattern_name)

 if view_exists:
 self.stdout.write(f' {pattern_name}: Implemented')
 implemented += 1
 else:
 self.stdout.write(f' {pattern_name}: Future (URL ready, view needed)')
 future += 1

 except NoReverseMatch:
 self.stdout.write(f' {pattern_name}: Future (URL pattern needed)')
 future += 1
 except Exception as e:
 self.stdout.write(f' {pattern_name}: Error - {e}')
 errors += 1

 total = implemented + future + errors
 self.stdout.write(f'\n Complete Status:')
 self.stdout.write(f' Implemented: {implemented} ({implemented/total*100:.1f}%)')
 self.stdout.write(f' Future: {future} ({future/total*100:.1f}%)')
 self.stdout.write(f' Errors: {errors} ({errors/total*100:.1f}%)')

 def check_view_exists(self, pattern_name):
 """Check if a view function/class exists for the given pattern"""
 # Convert URL pattern name to view name
 view_name_map = {
 'test-list': 'TestListView',
 'test-detail': 'TestDetailView',
 'test-questions': 'TestQuestionsView',
 'submit-test': 'SubmitTestView',
 'test-stats': 'TestStatsView',
 'test-results': 'TestResultView',
 'user-submissions': 'UserSubmissionsView',
 'calculate-score': 'CalculateScoreView',
 'recalculate-score': 'RecalculateScoreView',
 'compare-scores': 'ScoreComparisonView',
 'test-leaderboard': 'LeaderboardView',
 'score-analytics': 'ScoreAnalyticsView',
 'scoring-config': 'scoring_config_view',
 'validate-answers': 'validate_test_answers',
 'health-check': 'health_check',
 }

 view_name = view_name_map.get(pattern_name)
 if not view_name:
 return False

 # Check if view exists in views module
 return hasattr(views, view_name)

 def test_url_accessibility(self):
 """Test URL accessibility with authentication"""
 self.stdout.write('\n TESTING URL ACCESSIBILITY')
 self.stdout.write('-' * 50)

 client = Client()

 # Test without authentication
 test_urls = [
 '/api/health/', # Should work without auth
 '/api/tests/', # Should require auth
 '/api/scoring-config/', # Should require auth
 ]

 self.stdout.write('\nWithout Authentication:')
 for url in test_urls:
 try:
 response = client.get(url)
 if response.status_code == 200:
 self.stdout.write(f' {url}: Accessible (200)')
 elif response.status_code == 401:
 self.stdout.write(f' {url}: Auth required (401)')
 else:
 self.stdout.write(f' ️ {url}: Status {response.status_code}')
 except Exception as e:
 self.stdout.write(f' {url}: Error - {e}')

 # Test with authentication
 try:
 user = User.objects.get(username='api_test_user')
 client.login(username='api_test_user', password='testpass123')

 self.stdout.write('\nWith Authentication:')
 for url in test_urls:
 try:
 response = client.get(url)
 if response.status_code == 200:
 self.stdout.write(f' {url}: Accessible (200)')
 else:
 self.stdout.write(f' ️ {url}: Status {response.status_code}')
 except Exception as e:
 self.stdout.write(f' {url}: Error - {e}')

 except User.DoesNotExist:
 self.stdout.write('\n️ No test user found for authentication testing')
