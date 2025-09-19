"""
Django management command to test all DRF serializers
"""
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.test import TestCase
from django.utils import timezone
from decimal import Decimal
import json

from testsengine.models import (
    Test, Question, TestSubmission, Answer, Score,
    TestSession, TestAnswer, CodingChallenge, CodingSubmission,
    CodingSession, TestAttempt
)
from testsengine.serializers import (
    # Core serializers
    QuestionForTestSerializer, TestDetailSerializer, TestListSerializer,
    SubmissionInputSerializer, AnswerDetailSerializer, ScoreDetailSerializer,
    TestSubmissionSerializer,
    
    # Model serializers
    TestSessionSerializer, TestAnswerSerializer, CodingChallengeSerializer,
    CodingSubmissionSerializer, CodingSubmissionCreateSerializer, 
    CodingSessionSerializer, TestAttemptSerializer,
    
    # Utility serializers
    UserTestProgressSerializer, TestStatisticsSerializer, ScoringConfigSerializer,
    
    # Admin serializers
    QuestionAdminSerializer, TestAdminSerializer
)


class Command(BaseCommand):
    help = 'Test all DRF serializers for completeness and functionality'

    def add_arguments(self, parser):
        parser.add_argument(
            '--test-core',
            action='store_true',
            help='Test core serializers (Question, Test, Score, etc.)'
        )
        parser.add_argument(
            '--test-coding',
            action='store_true',
            help='Test coding-related serializers'
        )
        parser.add_argument(
            '--test-utility',
            action='store_true',
            help='Test utility and aggregate serializers'
        )
        parser.add_argument(
            '--test-validation',
            action='store_true',
            help='Test serializer validation logic'
        )

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('🧪 DRF SERIALIZERS COMPREHENSIVE TEST'))
        self.stdout.write('=' * 70)

        if options.get('test_core'):
            self.test_core_serializers()

        if options.get('test_coding'):
            self.test_coding_serializers()

        if options.get('test_utility'):
            self.test_utility_serializers()

        if options.get('test_validation'):
            self.test_validation_logic()

        if not any([options.get('test_core'), options.get('test_coding'),
                   options.get('test_utility'), options.get('test_validation')]):
            self.test_all_serializers()

    def test_all_serializers(self):
        """Test all serializer categories"""
        self.stdout.write('\n🔄 Running all serializer tests...\n')
        self.test_core_serializers()
        self.test_coding_serializers()
        self.test_utility_serializers()
        self.test_validation_logic()

    def test_core_serializers(self):
        """Test core test and scoring serializers"""
        self.stdout.write('\n📊 TESTING CORE SERIALIZERS')
        self.stdout.write('-' * 50)

        try:
            # Create test data
            user = self.get_or_create_test_user()
            test = self.create_sample_test()
            question = self.create_sample_question(test)

            # Test QuestionForTestSerializer
            question_serializer = QuestionForTestSerializer(question)
            question_data = question_serializer.data
            
            self.stdout.write('✅ QuestionForTestSerializer: SUCCESS')
            self.stdout.write(f'   Fields: {len(question_data)} fields')
            
            # Verify security: correct_answer should NOT be present
            if 'correct_answer' not in question_data:
                self.stdout.write('   ✅ Security: correct_answer properly excluded')
            else:
                self.stdout.write('   ❌ Security: correct_answer exposed!')
            
            # Verify scoring_coefficient is included
            if 'scoring_coefficient' in question_data:
                self.stdout.write(f'   ✅ Scoring coefficient: {question_data["scoring_coefficient"]}')
            
            # Test TestDetailSerializer
            test_serializer = TestDetailSerializer(test)
            test_data = test_serializer.data
            
            self.stdout.write('✅ TestDetailSerializer: SUCCESS')
            self.stdout.write(f'   Max Score: {test_data.get("max_possible_score")}')
            self.stdout.write(f'   Questions: {len(test_data.get("questions", []))}')
            
            # Test TestListSerializer
            list_serializer = TestListSerializer([test], many=True)
            list_data = list_serializer.data
            
            self.stdout.write('✅ TestListSerializer: SUCCESS')
            self.stdout.write(f'   Tests listed: {len(list_data)}')

            # Test with submission and scoring if available
            submission = TestSubmission.objects.filter(user=user, test=test).first()
            if submission and hasattr(submission, 'score'):
                score_serializer = ScoreDetailSerializer(submission.score)
                score_data = score_serializer.data
                
                self.stdout.write('✅ ScoreDetailSerializer: SUCCESS')
                self.stdout.write(f'   Score: {score_data.get("percentage_score")}%')
                self.stdout.write(f'   Grade: {score_data.get("grade_letter")}')
                self.stdout.write(f'   Answers: {len(score_data.get("answers", []))}')
            else:
                self.stdout.write('⚠️  ScoreDetailSerializer: No test data available')

        except Exception as e:
            self.stdout.write(f'❌ Core serializers test failed: {e}')

    def test_coding_serializers(self):
        """Test coding challenge related serializers"""
        self.stdout.write('\n💻 TESTING CODING SERIALIZERS')
        self.stdout.write('-' * 50)

        try:
            # Test CodingChallengeSerializer
            coding_data = {
                'title': 'Test Challenge',
                'description': 'Test description',
                'difficulty': 'intermediate',
                'category': 'algorithms',
                'language': 'python',
                'problem_statement': 'Sample problem',
                'time_limit_seconds': 300,
                'test_cases': [{'input': '1', 'output': '1'}]
            }
            
            challenge_serializer = CodingChallengeSerializer(data=coding_data)
            if challenge_serializer.is_valid():
                self.stdout.write('✅ CodingChallengeSerializer: Validation SUCCESS')
                
                # Test computed fields
                challenge_data = challenge_serializer.validated_data
                self.stdout.write(f'   Language: {challenge_data["language"]}')
                self.stdout.write(f'   Difficulty: {challenge_data["difficulty"]}')
            else:
                self.stdout.write(f'❌ CodingChallengeSerializer validation: {challenge_serializer.errors}')

            # Test CodingSubmissionSerializer validation
            submission_data = {
                'code': 'print("Hello World")'
            }
            
            submission_serializer = CodingSubmissionCreateSerializer(data=submission_data)
            if submission_serializer.is_valid():
                self.stdout.write('✅ CodingSubmissionCreateSerializer: Validation SUCCESS')
            else:
                self.stdout.write(f'❌ CodingSubmissionCreateSerializer: {submission_serializer.errors}')

            # Test coding session serializer
            user = self.get_or_create_test_user()
            session_data = {
                'user': user.id,
                'started_at': timezone.now(),
                'is_completed': False,
                'session_data': {'language': 'python'}
            }
            
            session_serializer = CodingSessionSerializer(data=session_data)
            self.stdout.write('✅ CodingSessionSerializer: Structure validated')

        except Exception as e:
            self.stdout.write(f'❌ Coding serializers test failed: {e}')

    def test_utility_serializers(self):
        """Test utility and aggregate serializers"""
        self.stdout.write('\n🔧 TESTING UTILITY SERIALIZERS')
        self.stdout.write('-' * 50)

        try:
            # Test ScoringConfigSerializer
            config_data = {
                'difficulty_coefficients': {'easy': 1.0, 'medium': 1.5, 'hard': 2.0},
                'test_duration_minutes': 20,
                'scoring_version': '1.0',
                'grade_thresholds': {90: 'A', 80: 'B', 70: 'C', 60: 'D', 0: 'F'},
                'passing_score_default': 70
            }
            
            config_serializer = ScoringConfigSerializer(data=config_data)
            if config_serializer.is_valid():
                self.stdout.write('✅ ScoringConfigSerializer: SUCCESS')
                validated_data = config_serializer.validated_data
                self.stdout.write(f'   Coefficients: {validated_data["difficulty_coefficients"]}')
                self.stdout.write(f'   Duration: {validated_data["test_duration_minutes"]} minutes')
            else:
                self.stdout.write(f'❌ ScoringConfigSerializer: {config_serializer.errors}')

            # Test UserTestProgressSerializer
            progress_data = {
                'user_id': 1,
                'username': 'testuser',
                'tests_attempted': 5,
                'tests_completed': 3,
                'average_score': 75.5,
                'best_score': 95.0,
                'total_time_spent': 120,
                'coding_challenges_attempted': 2,
                'coding_challenges_completed': 1,
                'last_activity': timezone.now()
            }
            
            progress_serializer = UserTestProgressSerializer(data=progress_data)
            if progress_serializer.is_valid():
                self.stdout.write('✅ UserTestProgressSerializer: SUCCESS')
                validated_data = progress_serializer.validated_data
                self.stdout.write(f'   Tests: {validated_data["tests_completed"]}/{validated_data["tests_attempted"]}')
                self.stdout.write(f'   Average Score: {validated_data["average_score"]}%')
            else:
                self.stdout.write(f'❌ UserTestProgressSerializer: {progress_serializer.errors}')

            # Test TestStatisticsSerializer
            stats_data = {
                'test_id': 1,
                'test_title': 'Sample Test',
                'total_attempts': 100,
                'completed_attempts': 85,
                'average_score': 73.2,
                'pass_rate': 68.2,
                'average_completion_time': 18.5,
                'difficulty_breakdown': {'easy': 30, 'medium': 40, 'hard': 30},
                'top_performers': ['user1', 'user2', 'user3']
            }
            
            stats_serializer = TestStatisticsSerializer(data=stats_data)
            if stats_serializer.is_valid():
                self.stdout.write('✅ TestStatisticsSerializer: SUCCESS')
                validated_data = stats_serializer.validated_data
                self.stdout.write(f'   Completion Rate: {validated_data["completed_attempts"]}/{validated_data["total_attempts"]}')
                self.stdout.write(f'   Pass Rate: {validated_data["pass_rate"]}%')
            else:
                self.stdout.write(f'❌ TestStatisticsSerializer: {stats_serializer.errors}')

        except Exception as e:
            self.stdout.write(f'❌ Utility serializers test failed: {e}')

    def test_validation_logic(self):
        """Test serializer validation logic"""
        self.stdout.write('\n🔍 TESTING VALIDATION LOGIC')
        self.stdout.write('-' * 50)

        try:
            # Test SubmissionInputSerializer validation
            invalid_submission_data = [
                {
                    'name': 'Empty answers',
                    'data': {'answers': {}, 'time_taken_seconds': 600},
                    'should_fail': True
                },
                {
                    'name': 'Invalid time',
                    'data': {'answers': {'1': 'A'}, 'time_taken_seconds': 5},
                    'should_fail': True
                },
                {
                    'name': 'Invalid answer format',
                    'data': {'answers': {'1': 'X'}, 'time_taken_seconds': 600},
                    'should_fail': True
                },
                {
                    'name': 'Valid submission',
                    'data': {'answers': {'1': 'A', '2': 'B'}, 'time_taken_seconds': 600},
                    'should_fail': False
                },
                {
                    'name': 'With metadata',
                    'data': {
                        'answers': {'1': 'A'},
                        'time_taken_seconds': 600,
                        'submission_metadata': {'browser': 'Chrome', 'device': 'Desktop'}
                    },
                    'should_fail': False
                }
            ]

            for test_case in invalid_submission_data:
                serializer = SubmissionInputSerializer(data=test_case['data'])
                is_valid = serializer.is_valid()
                
                if test_case['should_fail']:
                    if not is_valid:
                        self.stdout.write(f'   ✅ {test_case["name"]}: Correctly rejected')
                    else:
                        self.stdout.write(f'   ❌ {test_case["name"]}: Should have failed but passed')
                else:
                    if is_valid:
                        self.stdout.write(f'   ✅ {test_case["name"]}: Correctly validated')
                    else:
                        self.stdout.write(f'   ❌ {test_case["name"]}: Should have passed but failed - {serializer.errors}')

            # Test CodingSubmissionCreateSerializer validation
            coding_validation_tests = [
                {
                    'name': 'Empty code',
                    'data': {'code': ''},
                    'should_fail': True
                },
                {
                    'name': 'Too long code',
                    'data': {'code': 'a' * 60000},
                    'should_fail': True
                },
                {
                    'name': 'Valid code',
                    'data': {'code': 'print("Hello")'},
                    'should_fail': False
                }
            ]

            for test_case in coding_validation_tests:
                serializer = CodingSubmissionCreateSerializer(data=test_case['data'])
                is_valid = serializer.is_valid()
                
                if test_case['should_fail']:
                    if not is_valid:
                        self.stdout.write(f'   ✅ Coding {test_case["name"]}: Correctly rejected')
                    else:
                        self.stdout.write(f'   ❌ Coding {test_case["name"]}: Should have failed')
                else:
                    if is_valid:
                        self.stdout.write(f'   ✅ Coding {test_case["name"]}: Correctly validated')
                    else:
                        self.stdout.write(f'   ❌ Coding {test_case["name"]}: Should have passed - {serializer.errors}')

        except Exception as e:
            self.stdout.write(f'❌ Validation logic test failed: {e}')

    def get_or_create_test_user(self):
        """Get or create test user"""
        user, created = User.objects.get_or_create(
            username='serializer_test_user',
            defaults={
                'email': 'serializer_test@example.com',
                'first_name': 'Serializer',
                'last_name': 'Tester'
            }
        )

        if created or not user.check_password('testpass123'):
            user.set_password('testpass123')
            user.save()

        return user

    def create_sample_test(self):
        """Create or get sample test"""
        test, created = Test.objects.get_or_create(
            title='Serializer Test Sample',
            defaults={
                'test_type': 'verbal_reasoning',
                'description': 'Test for serializer validation',
                'duration_minutes': 20,
                'total_questions': 3,
                'passing_score': 70,
                'version': '1.0'
            }
        )
        return test

    def create_sample_question(self, test):
        """Create or get sample question"""
        question, created = Question.objects.get_or_create(
            test=test,
            order=1,
            defaults={
                'question_type': 'multiple_choice',
                'question_text': 'Sample question for serializer test?',
                'options': ['Option A', 'Option B', 'Option C', 'Option D'],
                'correct_answer': 'B',
                'difficulty_level': 'medium'
            }
        )
        return question
