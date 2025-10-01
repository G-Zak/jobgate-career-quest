#!/usr/bin/env python3
"""
Comprehensive Test Runner
========================

This command runs all tests for the scoring system and APIs,
providing detailed reporting and coverage analysis.
"""

from django.core.management.base import BaseCommand
from django.test.utils import get_runner
from django.conf import settings
import sys
import time
from io import StringIO

class Command(BaseCommand):
 help = 'Run comprehensive tests for scoring system and APIs'

 def add_arguments(self, parser):
 parser.add_argument(
 '--test-type',
 choices=['unit', 'api', 'integration', 'serializers', 'all'],
 default='all',
 help='Type of tests to run'
 )
 parser.add_argument(
 '--verbose',
 action='store_true',
 help='Verbose output'
 )
 parser.add_argument(
 '--coverage',
 action='store_true',
 help='Run with coverage analysis'
 )
 parser.add_argument(
 '--parallel',
 action='store_true',
 help='Run tests in parallel'
 )
 parser.add_argument(
 '--keepdb',
 action='store_true',
 help='Keep test database after tests'
 )

 def handle(self, *args, **options):
 self.stdout.write(self.style.SUCCESS(' COMPREHENSIVE TEST RUNNER'))
 self.stdout.write('=' * 60 + '\n')

 start_time = time.time()

 # Configure test runner
 test_runner = get_runner(settings)()

 # Determine test modules based on test type
 test_modules = self._get_test_modules(options['test_type'])

 if not test_modules:
 self.stdout.write(self.style.ERROR('No test modules found for the specified test type.'))
 return

 # Run tests
 self.stdout.write(f' Running {options["test_type"]} tests...')
 self.stdout.write(f' Test modules: {", ".join(test_modules)}')
 self.stdout.write('-' * 40)

 # Capture output
 old_stdout = sys.stdout
 sys.stdout = captured_output = StringIO()

 try:
 # Run tests
 test_args = test_modules
 if options['parallel']:
 test_args.append('--parallel')
 if options['keepdb']:
 test_args.append('--keepdb')

 result = test_runner.run_tests(test_args, verbosity=2 if options['verbose'] else 1)

 # Restore stdout
 sys.stdout = old_stdout

 # Display results
 output = captured_output.getvalue()
 if options['verbose']:
 self.stdout.write(output)

 # Parse and display summary
 self._display_test_summary(result, output, time.time() - start_time)

 # Run coverage if requested
 if options['coverage']:
 self._run_coverage_analysis(test_modules)

 except Exception as e:
 sys.stdout = old_stdout
 self.stdout.write(self.style.ERROR(f' Test execution failed: {e}'))
 return

 # Final status
 if isinstance(result, int):
 # Django test runner returns exit code
 success = result == 0
 else:
 # Django test runner returns result object
 success = result.wasSuccessful()

 if success:
 self.stdout.write(self.style.SUCCESS('\n All tests passed successfully!'))
 else:
 self.stdout.write(self.style.ERROR('\n Some tests failed.'))
 sys.exit(1)

 def _get_test_modules(self, test_type):
 """Get test modules based on test type"""
 base_modules = {
 'unit': ['testsengine.tests.test_scoring_service'],
 'api': ['testsengine.tests.test_api_endpoints'],
 'integration': ['testsengine.tests.test_integration'],
 'serializers': ['testsengine.tests.test_serializers'],
 'all': [
 'testsengine.tests.test_scoring_service',
 'testsengine.tests.test_api_endpoints',
 'testsengine.tests.test_integration',
 'testsengine.tests.test_serializers'
 ]
 }

 return base_modules.get(test_type, [])

 def _display_test_summary(self, result, output, duration):
 """Display test summary"""
 self.stdout.write('\n TEST SUMMARY')
 self.stdout.write('-' * 40)

 # Extract test statistics from output
 lines = output.split('\n')
 test_count = 0
 failure_count = 0
 error_count = 0

 for line in lines:
 if 'Ran' in line and 'test' in line:
 # Extract test count
 parts = line.split()
 for i, part in enumerate(parts):
 if part == 'test' and i > 0:
 try:
 test_count = int(parts[i-1])
 except (ValueError, IndexError):
 pass
 elif 'FAILED' in line:
 # Extract failure count
 parts = line.split()
 for part in parts:
 if part.isdigit():
 failure_count = int(part)
 break
 elif 'ERROR' in line:
 # Extract error count
 parts = line.split()
 for part in parts:
 if part.isdigit():
 error_count = int(part)
 break

 # Display statistics
 self.stdout.write(f'⏱️ Duration: {duration:.2f} seconds')
 self.stdout.write(f' Tests run: {test_count}')
 self.stdout.write(f' Passed: {test_count - failure_count - error_count}')
 self.stdout.write(f' Failed: {failure_count}')
 self.stdout.write(f' Errors: {error_count}')

 # Success rate
 if test_count > 0:
 success_rate = ((test_count - failure_count - error_count) / test_count) * 100
 self.stdout.write(f' Success rate: {success_rate:.1f}%')

 # Display failures and errors if any
 if failure_count > 0 or error_count > 0:
 self.stdout.write('\n FAILURES AND ERRORS:')
 self.stdout.write('-' * 40)

 # Extract failure/error details from output
 in_failure_section = False
 for line in lines:
 if 'FAIL:' in line or 'ERROR:' in line:
 in_failure_section = True
 self.stdout.write(self.style.ERROR(line))
 elif in_failure_section and line.strip():
 if line.startswith(' ') or line.startswith('\t'):
 self.stdout.write(line)
 else:
 in_failure_section = False

 def _run_coverage_analysis(self, test_modules):
 """Run coverage analysis"""
 self.stdout.write('\n COVERAGE ANALYSIS')
 self.stdout.write('-' * 40)

 try:
 import coverage

 # Start coverage
 cov = coverage.Coverage()
 cov.start()

 # Run tests again with coverage
 test_runner = get_runner(settings)()
 result = test_runner.run_tests(test_modules, verbosity=0)

 # Stop coverage
 cov.stop()
 cov.save()

 # Generate report
 self.stdout.write(' Coverage Report:')
 cov.report(show_missing=True)

 # Generate HTML report
 try:
 cov.html_report(directory='htmlcov')
 self.stdout.write(f' HTML report generated: htmlcov/index.html')
 except Exception as e:
 self.stdout.write(f'️ Could not generate HTML report: {e}')

 except ImportError:
 self.stdout.write('️ Coverage package not installed. Install with: pip install coverage')
 except Exception as e:
 self.stdout.write(f'️ Coverage analysis failed: {e}')

class TestCategories:
 """Test categories and their descriptions"""

 CATEGORIES = {
 'unit': {
 'name': 'Unit Tests',
 'description': 'Tests for individual components and functions',
 'modules': ['test_scoring_service'],
 'focus': 'ScoringService, model methods, utility functions'
 },
 'api': {
 'name': 'API Tests',
 'description': 'Tests for REST API endpoints',
 'modules': ['test_api_endpoints'],
 'focus': 'API endpoints, authentication, validation, error handling'
 },
 'integration': {
 'name': 'Integration Tests',
 'description': 'Tests for complete user flows',
 'modules': ['test_integration'],
 'focus': 'End-to-end flows, multi-user scenarios, data consistency'
 },
 'serializers': {
 'name': 'Serializer Tests',
 'description': 'Tests for DRF serializers',
 'modules': ['test_serializers'],
 'focus': 'Data serialization, validation, field handling'
 }
 }

 @classmethod
 def get_category_info(cls, category):
 """Get information about a test category"""
 return cls.CATEGORIES.get(category, {})

 @classmethod
 def list_categories(cls):
 """List all available test categories"""
 return list(cls.CATEGORIES.keys())

 @classmethod
 def get_all_modules(cls):
 """Get all test modules"""
 modules = []
 for category in cls.CATEGORIES.values():
 modules.extend(category['modules'])
 return modules
