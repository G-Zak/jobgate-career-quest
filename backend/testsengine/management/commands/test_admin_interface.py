#!/usr/bin/env python3
"""
Test Django Admin Interface
===========================

This command tests the Django admin interface functionality
and provides a comprehensive overview of admin capabilities.
"""

from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.contrib.admin.sites import site
from django.urls import reverse
from django.test import Client
from django.contrib.auth import authenticate
from django.db.models import Count

from testsengine.models import Test, Question, TestSubmission, Answer, Score


class Command(BaseCommand):
    help = 'Test Django admin interface functionality'

    def add_arguments(self, parser):
        parser.add_argument(
            '--create-sample-data',
            action='store_true',
            help='Create sample data for testing admin interface'
        )
        parser.add_argument(
            '--test-admin-views',
            action='store_true',
            help='Test admin views and functionality'
        )
        parser.add_argument(
            '--show-admin-stats',
            action='store_true',
            help='Show admin interface statistics'
        )

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('🔧 DJANGO ADMIN INTERFACE TEST'))
        self.stdout.write('=' * 60 + '\n')

        if options['create_sample_data']:
            self.create_sample_data()

        if options['test_admin_views']:
            self.test_admin_views()

        if options['show_admin_stats']:
            self.show_admin_stats()

        if not any([options['create_sample_data'], options['test_admin_views'], options['show_admin_stats']]):
            self.show_admin_overview()

    def create_sample_data(self):
        """Create sample data for testing admin interface"""
        self.stdout.write('📊 CREATING SAMPLE DATA')
        self.stdout.write('-' * 40)

        # Create sample test
        test, created = Test.objects.get_or_create(
            title='Sample Admin Test',
            defaults={
                'test_type': 'verbal_reasoning',
                'description': 'Test created for admin interface testing',
                'duration_minutes': 20,
                'total_questions': 5,
                'passing_score': 70,
                'is_active': True,
                'version': '1.0'
            }
        )

        if created:
            self.stdout.write(f'✅ Created test: {test.title}')
        else:
            self.stdout.write(f'ℹ️  Test already exists: {test.title}')

        # Create sample questions
        sample_questions = [
            {
                'question_text': 'What is the capital of France?',
                'options': ['London', 'Paris', 'Berlin', 'Madrid'],
                'correct_answer': 'B',
                'difficulty_level': 'easy',
                'question_type': 'multiple_choice'
            },
            {
                'question_text': 'Which word is most similar to "happy"?',
                'options': ['Sad', 'Joyful', 'Angry', 'Tired'],
                'correct_answer': 'B',
                'difficulty_level': 'medium',
                'question_type': 'vocabulary'
            },
            {
                'question_text': 'If all birds can fly, and penguins are birds, can penguins fly?',
                'options': ['Yes', 'No', 'Sometimes', 'Not enough information'],
                'correct_answer': 'B',
                'difficulty_level': 'hard',
                'question_type': 'logical_deduction'
            }
        ]

        for i, q_data in enumerate(sample_questions, 1):
            question, created = Question.objects.get_or_create(
                test=test,
                order=i,
                defaults={
                    'question_text': q_data['question_text'],
                    'options': q_data['options'],
                    'correct_answer': q_data['correct_answer'],
                    'difficulty_level': q_data['difficulty_level'],
                    'question_type': q_data['question_type'],
                    'complexity_score': 3
                }
            )

            if created:
                self.stdout.write(f'✅ Created question {i}: {question.question_text[:50]}...')
            else:
                self.stdout.write(f'ℹ️  Question {i} already exists')

        # Update test max score
        test.calculate_max_score()
        test.save()

        self.stdout.write(f'\n📈 Test Statistics:')
        self.stdout.write(f'   • Questions: {test.questions.count()}')
        self.stdout.write(f'   • Max Score: {test.max_possible_score}')
        self.stdout.write(f'   • Difficulty Distribution:')
        
        for difficulty in ['easy', 'medium', 'hard']:
            count = test.questions.filter(difficulty_level=difficulty).count()
            self.stdout.write(f'     - {difficulty.title()}: {count} questions')

    def test_admin_views(self):
        """Test admin views and functionality"""
        self.stdout.write('\n🔍 TESTING ADMIN VIEWS')
        self.stdout.write('-' * 40)

        # Test admin authentication
        try:
            user = User.objects.get(username='admin')
            self.stdout.write(f'✅ Admin user found: {user.username}')
        except User.DoesNotExist:
            self.stdout.write('❌ Admin user not found')
            return

        # Test admin site registration
        from testsengine.models import (
            Test, Question, TestSubmission, Answer, Score,
            TestSession, TestAnswer, CodingChallenge, CodingSubmission,
            CodingSession, TestAttempt
        )

        registered_models = [
            (Test, 'Test'),
            (Question, 'Question'),
            (TestSubmission, 'TestSubmission'),
            (Answer, 'Answer'),
            (Score, 'Score'),
            (TestSession, 'TestSession'),
            (TestAnswer, 'TestAnswer'),
            (CodingChallenge, 'CodingChallenge'),
            (CodingSubmission, 'CodingSubmission'),
            (CodingSession, 'CodingSession'),
            (TestAttempt, 'TestAttempt'),
        ]

        self.stdout.write('\n📋 Registered Admin Models:')
        for model_class, model_name in registered_models:
            try:
                if model_class in site._registry:
                    admin_class = site._registry[model_class]
                    self.stdout.write(f'   ✅ {model_name}: {admin_class.__class__.__name__}')
                else:
                    self.stdout.write(f'   ❌ {model_name}: Not registered')
            except Exception as e:
                self.stdout.write(f'   ⚠️  {model_name}: Error - {e}')

        # Test admin URLs
        self.stdout.write('\n🌐 Admin URLs:')
        admin_urls = [
            ('admin:index', 'Admin Index'),
            ('admin:testsengine_test_changelist', 'Test List'),
            ('admin:testsengine_question_changelist', 'Question List'),
            ('admin:testsengine_testsubmission_changelist', 'Submission List'),
            ('admin:testsengine_score_changelist', 'Score List'),
        ]

        for url_name, description in admin_urls:
            try:
                url = reverse(url_name)
                self.stdout.write(f'   ✅ {description}: {url}')
            except Exception as e:
                self.stdout.write(f'   ❌ {description}: Error - {e}')

    def show_admin_stats(self):
        """Show admin interface statistics"""
        self.stdout.write('\n📊 ADMIN INTERFACE STATISTICS')
        self.stdout.write('-' * 40)

        # Model counts
        stats = {
            'Tests': Test.objects.count(),
            'Questions': Question.objects.count(),
            'Submissions': TestSubmission.objects.count(),
            'Answers': Answer.objects.count(),
            'Scores': Score.objects.count(),
            'Users': User.objects.count(),
        }

        self.stdout.write('📈 Database Statistics:')
        for model, count in stats.items():
            self.stdout.write(f'   • {model}: {count}')

        # Test distribution
        if Test.objects.exists():
            self.stdout.write('\n📋 Test Distribution:')
            for test_type, count in Test.objects.values_list('test_type').annotate(
                count=Count('id')
            ).order_by('test_type'):
                self.stdout.write(f'   • {test_type.replace("_", " ").title()}: {count} tests')

        # Question difficulty distribution
        if Question.objects.exists():
            self.stdout.write('\n🎯 Question Difficulty Distribution:')
            for difficulty, count in Question.objects.values_list('difficulty_level').annotate(
                count=Count('id')
            ).order_by('difficulty_level'):
                self.stdout.write(f'   • {difficulty.title()}: {count} questions')

        # Recent activity
        if TestSubmission.objects.exists():
            recent_submissions = TestSubmission.objects.order_by('-submitted_at')[:5]
            self.stdout.write('\n🕒 Recent Submissions:')
            for submission in recent_submissions:
                score_info = f" ({submission.score.percentage_score}%)" if submission.score else " (Not scored)"
                self.stdout.write(f'   • {submission.user.username} - {submission.test.title}{score_info}')

    def show_admin_overview(self):
        """Show admin interface overview"""
        self.stdout.write('🎛️  DJANGO ADMIN INTERFACE OVERVIEW')
        self.stdout.write('=' * 60)
        
        self.stdout.write('\n📋 Available Admin Models:')
        admin_models = [
            ('Test', 'Manage test definitions and metadata'),
            ('Question', 'Manage individual test questions'),
            ('TestSubmission', 'View user test submissions'),
            ('Answer', 'View individual user answers'),
            ('Score', 'View calculated scores and grades'),
            ('TestSession', 'Manage test sessions'),
            ('TestAnswer', 'View session answers'),
            ('CodingChallenge', 'Manage coding challenges'),
            ('CodingSubmission', 'View coding submissions'),
            ('CodingSession', 'Manage coding sessions'),
            ('TestAttempt', 'View test attempts'),
        ]

        for model, description in admin_models:
            self.stdout.write(f'   • {model}: {description}')

        self.stdout.write('\n🔧 Admin Features:')
        features = [
            'Advanced filtering and search',
            'Bulk operations',
            'Custom list displays',
            'Readonly field protection',
            'Custom fieldsets organization',
            'Performance optimizations',
            'Security controls',
            'Export capabilities',
        ]

        for feature in features:
            self.stdout.write(f'   ✅ {feature}')

        self.stdout.write('\n🚀 Quick Start:')
        self.stdout.write('   1. Access admin at: http://localhost:8000/admin/')
        self.stdout.write('   2. Login with: admin / admin123')
        self.stdout.write('   3. Explore the test management interface')
        self.stdout.write('   4. Create sample data: python manage.py test_admin_interface --create-sample-data')

        self.stdout.write('\n📊 Current Statistics:')
        self.show_admin_stats()

        self.stdout.write('\n💡 Usage Examples:')
        self.stdout.write('   • Create sample data: python manage.py test_admin_interface --create-sample-data')
        self.stdout.write('   • Test admin views: python manage.py test_admin_interface --test-admin-views')
        self.stdout.write('   • Show statistics: python manage.py test_admin_interface --show-admin-stats')
