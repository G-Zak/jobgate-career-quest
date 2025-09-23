"""
Django management command to test and demonstrate the scoring service
"""
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.db import transaction
from decimal import Decimal

from testsengine.models import Test, Question, TestSubmission, Answer, Score
from testsengine.services.scoring_service import ScoringService, ScoringUtils


class Command(BaseCommand):
    help = 'Test and demonstrate the scoring service functionality'

    def add_arguments(self, parser):
        parser.add_argument(
            '--create-sample-data',
            action='store_true',
            help='Create sample test data for demonstration'
        )
        parser.add_argument(
            '--run-scoring-test',
            action='store_true',
            help='Run a complete scoring test with sample data'
        )
        parser.add_argument(
            '--validate-coefficients',
            action='store_true',
            help='Validate difficulty coefficients are working correctly'
        )
        parser.add_argument(
            '--verbose',
            action='store_true',
            help='Show detailed output'
        )

    def handle(self, *args, **options):
        self.verbose = options.get('verbose', False)
        
        self.stdout.write(self.style.SUCCESS('🧪 SCORING SERVICE TEST SUITE'))
        self.stdout.write('=' * 60)
        
        if options.get('create_sample_data'):
            self.create_sample_data()
        
        if options.get('validate_coefficients'):
            self.validate_coefficients()
        
        if options.get('run_scoring_test'):
            self.run_scoring_test()
        
        if not any([options.get('create_sample_data'), 
                   options.get('validate_coefficients'),
                   options.get('run_scoring_test')]):
            self.run_all_tests()

    def run_all_tests(self):
        """Run all tests in sequence"""
        self.stdout.write('\n🔄 Running all tests...\n')
        self.create_sample_data()
        self.validate_coefficients()
        self.run_scoring_test()

    @transaction.atomic
    def create_sample_data(self):
        """Create sample test data for demonstration"""
        self.stdout.write('\n📊 CREATING SAMPLE DATA')
        self.stdout.write('-' * 40)
        
        # Create or get test user
        user, created = User.objects.get_or_create(
            username='test_scorer',
            defaults={'password': 'testpass123'}
        )
        if created:
            self.stdout.write('✅ Created test user: test_scorer')
        else:
            self.stdout.write('✅ Using existing test user: test_scorer')
        
        # Create sample test
        test, created = Test.objects.get_or_create(
            title='Scoring System Demo Test',
            defaults={
                'test_type': 'verbal_reasoning',
                'description': 'Demonstration test for scoring system with mixed difficulty questions',
                'duration_minutes': 20,
                'total_questions': 9,
                'passing_score': 70,
                'version': '1.0'
            }
        )
        
        if created:
            self.stdout.write('✅ Created sample test: Scoring System Demo Test')
            
            # Create questions with different difficulties
            questions_data = [
                # Easy questions (coefficient 1.0)
                {'text': 'What is 2 + 2?', 'options': ['3', '4', '5', '6'], 'correct': 'B', 'difficulty': 'easy'},
                {'text': 'Which is larger: 5 or 3?', 'options': ['5', '3', 'Equal', 'Cannot tell'], 'correct': 'A', 'difficulty': 'easy'},
                {'text': 'What color is the sky?', 'options': ['Red', 'Blue', 'Green', 'Purple'], 'correct': 'B', 'difficulty': 'easy'},
                
                # Medium questions (coefficient 1.5)
                {'text': 'If A = 1, B = 2, what is A + B?', 'options': ['2', '3', '4', '5'], 'correct': 'B', 'difficulty': 'medium'},
                {'text': 'Complete: Cat is to Kitten as Dog is to ___', 'options': ['Bark', 'Puppy', 'Pet', 'Animal'], 'correct': 'B', 'difficulty': 'medium'},
                {'text': 'What is 15% of 100?', 'options': ['5', '10', '15', '20'], 'correct': 'C', 'difficulty': 'medium'},
                
                # Hard questions (coefficient 2.0)
                {'text': 'If all roses are flowers and some flowers are red, then:', 'options': ['All roses are red', 'Some roses might be red', 'No roses are red', 'Cannot determine'], 'correct': 'B', 'difficulty': 'hard'},
                {'text': 'In a sequence 2, 6, 18, 54, what comes next?', 'options': ['108', '162', '216', '324'], 'correct': 'B', 'difficulty': 'hard'},
                {'text': 'If P implies Q, and Q implies R, then P implies:', 'options': ['Not R', 'R', 'Maybe R', 'Unknown'], 'correct': 'B', 'difficulty': 'hard'},
            ]
            
            for i, q_data in enumerate(questions_data, 1):
                Question.objects.create(
                    test=test,
                    question_type='multiple_choice',
                    question_text=q_data['text'],
                    options=q_data['options'],
                    correct_answer=q_data['correct'],
                    difficulty_level=q_data['difficulty'],
                    order=i
                )
            
            self.stdout.write(f'✅ Created {len(questions_data)} sample questions')
            self.stdout.write(f'   • Easy: 3 questions (coefficient 1.0)')
            self.stdout.write(f'   • Medium: 3 questions (coefficient 1.5)')
            self.stdout.write(f'   • Hard: 3 questions (coefficient 2.0)')
            
        else:
            self.stdout.write('✅ Using existing sample test')
        
        # Calculate and display max score
        max_score = test.calculate_max_score()
        self.stdout.write(f'📊 Maximum possible score: {max_score} points')
        self.stdout.write(f'   (3×1.0 + 3×1.5 + 3×2.0 = {float(max_score)})')

    def validate_coefficients(self):
        """Validate that difficulty coefficients are working correctly"""
        self.stdout.write('\n⚖️  VALIDATING DIFFICULTY COEFFICIENTS')
        self.stdout.write('-' * 40)
        
        scoring_service = ScoringService()
        config = scoring_service.config
        
        # Test configuration values
        self.stdout.write('📋 Configuration Values:')
        for difficulty, coefficient in config.DIFFICULTY_COEFFICIENTS.items():
            self.stdout.write(f'   • {difficulty.title()}: {coefficient}')
        
        # Test question coefficient property
        try:
            test = Test.objects.get(title='Scoring System Demo Test')
            questions = test.questions.all().order_by('order')
            
            self.stdout.write('\n🔍 Question Coefficient Validation:')
            for question in questions:
                expected_coeff = float(config.DIFFICULTY_COEFFICIENTS[question.difficulty_level])
                actual_coeff = question.scoring_coefficient
                
                if expected_coeff == actual_coeff:
                    status = '✅'
                else:
                    status = '❌'
                
                self.stdout.write(f'   {status} Q{question.order} ({question.difficulty_level}): {actual_coeff}')
        
        except Test.DoesNotExist:
            self.stdout.write(self.style.WARNING('⚠️  Sample test not found. Run with --create-sample-data first.'))

    def run_scoring_test(self):
        """Run a complete scoring test with different scenarios"""
        self.stdout.write('\n🎯 RUNNING SCORING TESTS')
        self.stdout.write('-' * 40)
        
        try:
            test = Test.objects.get(title='Scoring System Demo Test')
            user = User.objects.get(username='test_scorer')
            scoring_service = ScoringService()
            
            # Get questions for reference
            questions = list(test.questions.all().order_by('order'))
            
            # Test Scenario 1: Perfect score
            self.stdout.write('\n📊 Test Scenario 1: Perfect Score')
            answers_perfect = {
                str(questions[0].id): 'B',  # Easy - correct
                str(questions[1].id): 'A',  # Easy - correct  
                str(questions[2].id): 'B',  # Easy - correct
                str(questions[3].id): 'B',  # Medium - correct
                str(questions[4].id): 'B',  # Medium - correct
                str(questions[5].id): 'C',  # Medium - correct
                str(questions[6].id): 'B',  # Hard - correct
                str(questions[7].id): 'B',  # Hard - correct
                str(questions[8].id): 'B',  # Hard - correct
            }
            
            submission1, score1 = scoring_service.score_test_submission(
                user, test, answers_perfect, 1200  # 20 minutes
            )
            
            self.display_score_results('Perfect Score', score1)
            
            # Test Scenario 2: Partial score (only easy and medium correct)
            self.stdout.write('\n📊 Test Scenario 2: Partial Score (Easy + Medium only)')
            
            # Create another user for second test
            user2, _ = User.objects.get_or_create(
                username='test_scorer_2',
                defaults={'password': 'testpass123'}
            )
            
            answers_partial = {
                str(questions[0].id): 'B',  # Easy - correct
                str(questions[1].id): 'A',  # Easy - correct
                str(questions[2].id): 'B',  # Easy - correct
                str(questions[3].id): 'B',  # Medium - correct
                str(questions[4].id): 'B',  # Medium - correct
                str(questions[5].id): 'C',  # Medium - correct
                str(questions[6].id): 'A',  # Hard - wrong
                str(questions[7].id): 'A',  # Hard - wrong
                str(questions[8].id): 'A',  # Hard - wrong
            }
            
            submission2, score2 = scoring_service.score_test_submission(
                user2, test, answers_partial, 900  # 15 minutes
            )
            
            self.display_score_results('Partial Score', score2)
            
            # Test Scenario 3: Poor performance (only easy questions correct)
            self.stdout.write('\n📊 Test Scenario 3: Poor Performance (Easy only)')
            
            user3, _ = User.objects.get_or_create(
                username='test_scorer_3',
                defaults={'password': 'testpass123'}
            )
            
            answers_poor = {
                str(questions[0].id): 'B',  # Easy - correct
                str(questions[1].id): 'A',  # Easy - correct
                str(questions[2].id): 'B',  # Easy - correct
                str(questions[3].id): 'A',  # Medium - wrong
                str(questions[4].id): 'A',  # Medium - wrong
                str(questions[5].id): 'A',  # Medium - wrong
                str(questions[6].id): 'A',  # Hard - wrong
                str(questions[7].id): 'A',  # Hard - wrong
                str(questions[8].id): 'A',  # Hard - wrong
            }
            
            submission3, score3 = scoring_service.score_test_submission(
                user3, test, answers_poor, 600  # 10 minutes
            )
            
            self.display_score_results('Poor Performance', score3)
            
            # Summary comparison
            self.stdout.write('\n📈 SCORING COMPARISON SUMMARY')
            self.stdout.write('-' * 40)
            scenarios = [
                ('Perfect Score', score1),
                ('Partial Score', score2),
                ('Poor Performance', score3)
            ]
            
            for name, score in scenarios:
                self.stdout.write(f'{name:20} | {score.percentage_score:6}% | {score.grade_letter} | {"PASS" if score.passed else "FAIL"}')
            
        except Test.DoesNotExist:
            self.stdout.write(self.style.ERROR('❌ Sample test not found. Run with --create-sample-data first.'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'❌ Scoring test failed: {e}'))

    def display_score_results(self, scenario_name, score):
        """Display detailed score results"""
        if self.verbose:
            summary = ScoringService().get_score_summary(score)
            
            self.stdout.write(f'   Results for {scenario_name}:')
            self.stdout.write(f'   • Overall Score: {score.percentage_score}% ({score.correct_answers}/{score.total_questions})')
            self.stdout.write(f'   • Raw Score: {score.raw_score} / {score.max_possible_score} points')
            self.stdout.write(f'   • Grade: {score.grade_letter} | Status: {"PASS" if score.passed else "FAIL"}')
            self.stdout.write(f'   • Difficulty Breakdown:')
            self.stdout.write(f'     - Easy: {score.easy_correct}/3 correct = {score.easy_score} points')
            self.stdout.write(f'     - Medium: {score.medium_correct}/3 correct = {score.medium_score} points')
            self.stdout.write(f'     - Hard: {score.hard_correct}/3 correct = {score.hard_score} points')
            self.stdout.write(f'   • Time: {score.average_time_per_question}s avg per question')
        else:
            self.stdout.write(f'   ✅ {scenario_name}: {score.percentage_score}% ({score.grade_letter}) - {"PASS" if score.passed else "FAIL"}')
