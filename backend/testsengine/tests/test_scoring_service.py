"""
Comprehensive tests for the scoring service
"""

from decimal import Decimal
from django.test import TestCase
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.db import IntegrityError

from ..models import Test, Question, TestSubmission, Answer, Score
from ..services.scoring_service import ScoringService, ScoringConfig, ScoringUtils

class ScoringServiceTestCase(TestCase):
 """Test cases for the main ScoringService functionality"""

 def setUp(self):
 """Set up test data"""
 self.user = User.objects.create_user(username='testuser', password='testpass')
 self.scoring_service = ScoringService()

 # Create a test with mixed difficulty questions
 self.test = Test.objects.create(
 title='Test Scoring System',
 test_type='verbal_reasoning',
 description='Test for scoring validation',
 duration_minutes=20,
 total_questions=6,
 passing_score=70
 )

 # Create questions with different difficulties
 self.questions = [
 Question.objects.create(
 test=self.test,
 question_type='multiple_choice',
 question_text='Easy question 1',
 options=['A', 'B', 'C', 'D'],
 correct_answer='A',
 difficulty_level='easy',
 order=1
 ),
 Question.objects.create(
 test=self.test,
 question_type='multiple_choice',
 question_text='Easy question 2',
 options=['A', 'B', 'C', 'D'],
 correct_answer='B',
 difficulty_level='easy',
 order=2
 ),
 Question.objects.create(
 test=self.test,
 question_type='multiple_choice',
 question_text='Medium question 1',
 options=['A', 'B', 'C', 'D'],
 correct_answer='C',
 difficulty_level='medium',
 order=3
 ),
 Question.objects.create(
 test=self.test,
 question_type='multiple_choice',
 question_text='Medium question 2',
 options=['A', 'B', 'C', 'D'],
 correct_answer='D',
 difficulty_level='medium',
 order=4
 ),
 Question.objects.create(
 test=self.test,
 question_type='multiple_choice',
 question_text='Hard question 1',
 options=['A', 'B', 'C', 'D'],
 correct_answer='A',
 difficulty_level='hard',
 order=5
 ),
 Question.objects.create(
 test=self.test,
 question_type='multiple_choice',
 question_text='Hard question 2',
 options=['A', 'B', 'C', 'D'],
 correct_answer='B',
 difficulty_level='hard',
 order=6
 ),
 ]

 def test_perfect_score(self):
 """Test scoring with all correct answers"""
 answers_data = {
 str(self.questions[0].id): 'A', # Easy - correct (1.0 points)
 str(self.questions[1].id): 'B', # Easy - correct (1.0 points)
 str(self.questions[2].id): 'C', # Medium - correct (1.5 points)
 str(self.questions[3].id): 'D', # Medium - correct (1.5 points)
 str(self.questions[4].id): 'A', # Hard - correct (2.0 points)
 str(self.questions[5].id): 'B', # Hard - correct (2.0 points)
 }

 submission, score = self.scoring_service.score_test_submission(
 self.user, self.test, answers_data, 1200 # 20 minutes
 )

 # Expected: 2×1.0 + 2×1.5 + 2×2.0 = 9.0 points
 expected_raw_score = Decimal('9.0')
 expected_max_score = Decimal('9.0')
 expected_percentage = Decimal('100.00')

 self.assertEqual(score.raw_score, expected_raw_score)
 self.assertEqual(score.max_possible_score, expected_max_score)
 self.assertEqual(score.percentage_score, expected_percentage)
 self.assertEqual(score.correct_answers, 6)
 self.assertEqual(score.total_questions, 6)

 # Check difficulty breakdown
 self.assertEqual(score.easy_correct, 2)
 self.assertEqual(score.medium_correct, 2)
 self.assertEqual(score.hard_correct, 2)
 self.assertEqual(score.easy_score, Decimal('2.0'))
 self.assertEqual(score.medium_score, Decimal('3.0'))
 self.assertEqual(score.hard_score, Decimal('4.0'))

 # Check grade
 self.assertEqual(score.grade_letter, 'A')
 self.assertTrue(score.passed)

 def test_partial_score(self):
 """Test scoring with some wrong answers"""
 answers_data = {
 str(self.questions[0].id): 'A', # Easy - correct (1.0 points)
 str(self.questions[1].id): 'C', # Easy - wrong (0.0 points)
 str(self.questions[2].id): 'C', # Medium - correct (1.5 points)
 str(self.questions[3].id): 'A', # Medium - wrong (0.0 points)
 str(self.questions[4].id): 'A', # Hard - correct (2.0 points)
 str(self.questions[5].id): 'C', # Hard - wrong (0.0 points)
 }

 submission, score = self.scoring_service.score_test_submission(
 self.user, self.test, answers_data, 900 # 15 minutes
 )

 # Expected: 1×1.0 + 1×1.5 + 1×2.0 = 4.5 points out of 9.0
 expected_raw_score = Decimal('4.5')
 expected_max_score = Decimal('9.0')
 expected_percentage = Decimal('50.00')

 self.assertEqual(score.raw_score, expected_raw_score)
 self.assertEqual(score.percentage_score, expected_percentage)
 self.assertEqual(score.correct_answers, 3)

 # Check difficulty breakdown
 self.assertEqual(score.easy_correct, 1)
 self.assertEqual(score.medium_correct, 1)
 self.assertEqual(score.hard_correct, 1)
 self.assertEqual(score.easy_score, Decimal('1.0'))
 self.assertEqual(score.medium_score, Decimal('1.5'))
 self.assertEqual(score.hard_score, Decimal('2.0'))

 # Check grade
 self.assertEqual(score.grade_letter, 'F')
 self.assertFalse(score.passed)

 def test_zero_score(self):
 """Test scoring with all wrong answers"""
 answers_data = {
 str(self.questions[0].id): 'B', # Easy - wrong
 str(self.questions[1].id): 'C', # Easy - wrong
 str(self.questions[2].id): 'A', # Medium - wrong
 str(self.questions[3].id): 'B', # Medium - wrong
 str(self.questions[4].id): 'C', # Hard - wrong
 str(self.questions[5].id): 'D', # Hard - wrong
 }

 submission, score = self.scoring_service.score_test_submission(
 self.user, self.test, answers_data, 600 # 10 minutes
 )

 self.assertEqual(score.raw_score, Decimal('0.0'))
 self.assertEqual(score.percentage_score, Decimal('0.00'))
 self.assertEqual(score.correct_answers, 0)
 self.assertEqual(score.grade_letter, 'F')
 self.assertFalse(score.passed)

 def test_difficulty_coefficients(self):
 """Test that difficulty coefficients are applied correctly"""
 config = ScoringConfig()

 self.assertEqual(config.DIFFICULTY_COEFFICIENTS['easy'], Decimal('1.0'))
 self.assertEqual(config.DIFFICULTY_COEFFICIENTS['medium'], Decimal('1.5'))
 self.assertEqual(config.DIFFICULTY_COEFFICIENTS['hard'], Decimal('2.0'))

 # Test question scoring coefficient property
 easy_q = self.questions[0] # easy
 medium_q = self.questions[2] # medium
 hard_q = self.questions[4] # hard

 self.assertEqual(easy_q.scoring_coefficient, 1.0)
 self.assertEqual(medium_q.scoring_coefficient, 1.5)
 self.assertEqual(hard_q.scoring_coefficient, 2.0)

 def test_answer_validation(self):
 """Test answer checking functionality"""
 question = self.questions[0] # correct_answer = 'A'

 self.assertTrue(question.check_answer('A'))
 self.assertTrue(question.check_answer('a')) # case insensitive
 self.assertFalse(question.check_answer('B'))
 self.assertFalse(question.check_answer(''))

 def test_submission_validation(self):
 """Test validation of submission data"""
 # Test empty answers
 with self.assertRaises(ValidationError):
 self.scoring_service.score_test_submission(
 self.user, self.test, {}, 600
 )

 # Test negative time
 with self.assertRaises(ValidationError):
 self.scoring_service.score_test_submission(
 self.user, self.test, {str(self.questions[0].id): 'A'}, -100
 )

 # Test invalid question ID
 with self.assertRaises(ValidationError):
 self.scoring_service.score_test_submission(
 self.user, self.test, {'99999': 'A'}, 600
 )

 def test_unique_submission_per_user_test(self):
 """Test that only one submission per user per test is allowed"""
 answers_data = {str(self.questions[0].id): 'A'}

 # First submission
 submission1, score1 = self.scoring_service.score_test_submission(
 self.user, self.test, answers_data, 600
 )

 # Second submission should replace the first
 answers_data_2 = {str(self.questions[0].id): 'B'}
 submission2, score2 = self.scoring_service.score_test_submission(
 self.user, self.test, answers_data_2, 700
 )

 # Should only have one submission
 submissions = TestSubmission.objects.filter(user=self.user, test=self.test)
 self.assertEqual(submissions.count(), 1)
 self.assertEqual(submissions.first().id, submission2.id)

 def test_score_summary(self):
 """Test score summary generation"""
 answers_data = {
 str(self.questions[0].id): 'A', # Easy - correct
 str(self.questions[2].id): 'C', # Medium - correct
 str(self.questions[4].id): 'A', # Hard - correct
 str(self.questions[1].id): 'C', # Easy - wrong
 str(self.questions[3].id): 'A', # Medium - wrong
 str(self.questions[5].id): 'C', # Hard - wrong
 }

 submission, score = self.scoring_service.score_test_submission(
 self.user, self.test, answers_data, 900
 )

 summary = self.scoring_service.get_score_summary(score)

 # Check structure
 self.assertIn('overall', summary)
 self.assertIn('difficulty_breakdown', summary)
 self.assertIn('performance', summary)
 self.assertIn('metadata', summary)

 # Check values
 self.assertEqual(summary['overall']['correct_answers'], 3)
 self.assertEqual(summary['overall']['percentage'], 50.0)
 self.assertEqual(summary['difficulty_breakdown']['easy']['correct'], 1)
 self.assertEqual(summary['difficulty_breakdown']['medium']['correct'], 1)
 self.assertEqual(summary['difficulty_breakdown']['hard']['correct'], 1)

class ScoringUtilsTestCase(TestCase):
 """Test cases for ScoringUtils"""

 def setUp(self):
 self.test = Test.objects.create(
 title='Utils Test',
 test_type='numerical_reasoning',
 description='Test for utils',
 duration_minutes=20,
 total_questions=3
 )

 def test_max_score_calculation(self):
 """Test maximum score calculation"""
 # Create questions with different difficulties
 Question.objects.create(
 test=self.test, question_text='Q1', options=['A', 'B'],
 correct_answer='A', difficulty_level='easy', order=1
 )
 Question.objects.create(
 test=self.test, question_text='Q2', options=['A', 'B'],
 correct_answer='B', difficulty_level='medium', order=2
 )
 Question.objects.create(
 test=self.test, question_text='Q3', options=['A', 'B'],
 correct_answer='A', difficulty_level='hard', order=3
 )

 max_score = ScoringUtils.get_test_max_score(self.test)
 expected = Decimal('1.0') + Decimal('1.5') + Decimal('2.0') # 4.5

 self.assertEqual(max_score, expected)

 def test_difficulty_distribution_validation(self):
 """Test difficulty distribution validation"""
 # Create unbalanced test (all easy)
 for i in range(5):
 Question.objects.create(
 test=self.test, question_text=f'Q{i}', options=['A', 'B'],
 correct_answer='A', difficulty_level='easy', order=i+1
 )

 result = ScoringUtils.validate_difficulty_distribution(self.test)

 self.assertFalse(result['valid'])
 self.assertIn('Too many easy questions', str(result['issues']))
 self.assertIn('Too few medium questions', str(result['issues']))
 self.assertIn('Too few hard questions', str(result['issues']))

 self.assertEqual(result['distribution']['easy'], 5)
 self.assertEqual(result['distribution']['medium'], 0)
 self.assertEqual(result['distribution']['hard'], 0)

class ModelMethodsTestCase(TestCase):
 """Test cases for model methods"""

 def setUp(self):
 self.test = Test.objects.create(
 title='Model Test',
 test_type='spatial_reasoning',
 description='Test model methods',
 duration_minutes=20,
 total_questions=2,
 passing_score=75
 )

 self.question = Question.objects.create(
 test=self.test,
 question_text='Test question',
 options=['A', 'B', 'C', 'D'],
 correct_answer='B',
 difficulty_level='medium',
 order=1
 )

 def test_test_max_score_calculation(self):
 """Test Test.calculate_max_score method"""
 # Add another question
 Question.objects.create(
 test=self.test, question_text='Q2', options=['A', 'B'],
 correct_answer='A', difficulty_level='hard', order=2
 )

 max_score = self.test.calculate_max_score()
 expected = Decimal('1.5') + Decimal('2.0') # medium + hard

 self.assertEqual(max_score, expected)

 def test_question_scoring_coefficient(self):
 """Test Question.scoring_coefficient property"""
 easy_q = Question(difficulty_level='easy')
 medium_q = Question(difficulty_level='medium')
 hard_q = Question(difficulty_level='hard')

 self.assertEqual(easy_q.scoring_coefficient, 1.0)
 self.assertEqual(medium_q.scoring_coefficient, 1.5)
 self.assertEqual(hard_q.scoring_coefficient, 2.0)

 def test_question_check_answer(self):
 """Test Question.check_answer method"""
 self.assertTrue(self.question.check_answer('B'))
 self.assertTrue(self.question.check_answer('b'))
 self.assertFalse(self.question.check_answer('A'))
 self.assertFalse(self.question.check_answer(''))

 def test_score_grade_letter(self):
 """Test Score.grade_letter property"""
 # Create a dummy score to test grading
 user = User.objects.create_user(username='test', password='test')
 submission = TestSubmission.objects.create(
 user=user, test=self.test, time_taken_seconds=600, answers_data={}
 )

 # Test different percentage scores
 test_cases = [
 (95, 'A'),
 (85, 'B'),
 (75, 'C'),
 (65, 'D'),
 (45, 'F')
 ]

 for percentage, expected_grade in test_cases:
 score = Score(submission=submission, percentage_score=Decimal(str(percentage)))
 self.assertEqual(score.grade_letter, expected_grade)

 def test_score_passed_property(self):
 """Test Score.passed property"""
 user = User.objects.create_user(username='test', password='test')
 submission = TestSubmission.objects.create(
 user=user, test=self.test, time_taken_seconds=600, answers_data={}
 )

 # Test passing (>= 75%)
 passing_score = Score(submission=submission, percentage_score=Decimal('80'))
 self.assertTrue(passing_score.passed)

 # Test failing (< 75%)
 failing_score = Score(submission=submission, percentage_score=Decimal('70'))
 self.assertFalse(failing_score.passed)
