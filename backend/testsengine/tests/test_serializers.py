"""
Comprehensive tests for DRF serializers
"""

import json
from decimal import Decimal
from django.test import TestCase
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError

from ..models import Test, Question, TestSubmission, Answer, Score
from ..serializers import (
    TestListSerializer, TestDetailSerializer, QuestionForTestSerializer,
    SubmissionInputSerializer, AnswerDetailSerializer, TestSubmissionSerializer,
    ScoreDetailSerializer, ScoringConfigSerializer
)


class TestSerializerTestCase(TestCase):
    """Test cases for Test serializers"""
    
    def setUp(self):
        """Set up test data"""
        self.test = Test.objects.create(
            title='Test Serializer Test',
            test_type='verbal_reasoning',
            description='Test for serializer validation',
            duration_minutes=20,
            total_questions=3,
            passing_score=70,
            max_possible_score=Decimal('4.5'),
            is_active=True,
            version='1.0'
        )
        
        # Create questions
        self.questions = [
            Question.objects.create(
                test=self.test,
                question_type='multiple_choice',
                question_text='Test question 1',
                options=['A', 'B', 'C', 'D'],
                correct_answer='A',
                difficulty_level='easy',
                order=1
            ),
            Question.objects.create(
                test=self.test,
                question_type='multiple_choice',
                question_text='Test question 2',
                options=['A', 'B', 'C', 'D'],
                correct_answer='B',
                difficulty_level='medium',
                order=2
            ),
            Question.objects.create(
                test=self.test,
                question_type='multiple_choice',
                question_text='Test question 3',
                options=['A', 'B', 'C', 'D'],
                correct_answer='C',
                difficulty_level='hard',
                order=3
            )
        ]
    
    def test_test_list_serializer(self):
        """Test TestListSerializer"""
        serializer = TestListSerializer(self.test)
        data = serializer.data
        
        # Check required fields
        self.assertIn('id', data)
        self.assertIn('title', data)
        self.assertIn('test_type', data)
        self.assertIn('duration_minutes', data)
        self.assertIn('total_questions', data)
        self.assertIn('passing_score', data)
        self.assertIn('is_active', data)
        self.assertIn('created_at', data)
        
        # Check values
        self.assertEqual(data['title'], 'Test Serializer Test')
        self.assertEqual(data['test_type'], 'verbal_reasoning')
        self.assertEqual(data['duration_minutes'], 20)
        self.assertEqual(data['total_questions'], 3)
        self.assertEqual(data['passing_score'], 70)
        self.assertTrue(data['is_active'])
    
    def test_test_detail_serializer(self):
        """Test TestDetailSerializer"""
        serializer = TestDetailSerializer(self.test)
        data = serializer.data
        
        # Check all fields are present
        self.assertIn('id', data)
        self.assertIn('title', data)
        self.assertIn('test_type', data)
        self.assertIn('description', data)
        self.assertIn('duration_minutes', data)
        self.assertIn('total_questions', data)
        self.assertIn('passing_score', data)
        self.assertIn('max_possible_score', data)
        self.assertIn('is_active', data)
        self.assertIn('version', data)
        self.assertIn('created_at', data)
        self.assertIn('updated_at', data)
        
        # Check values
        self.assertEqual(data['description'], 'Test for serializer validation')
        self.assertEqual(data['max_possible_score'], '4.50')
        self.assertEqual(data['version'], '1.0')
    
    def test_question_for_test_serializer(self):
        """Test QuestionForTestSerializer (should hide correct answers)"""
        question = self.questions[0]
        serializer = QuestionForTestSerializer(question)
        data = serializer.data
        
        # Check required fields are present
        self.assertIn('id', data)
        self.assertIn('question_text', data)
        self.assertIn('options', data)
        self.assertIn('difficulty_level', data)
        self.assertIn('question_type', data)
        self.assertIn('order', data)
        
        # Check that sensitive fields are NOT present
        self.assertNotIn('correct_answer', data)
        self.assertNotIn('complexity_score', data)
        
        # Check values
        self.assertEqual(data['question_text'], 'Test question 1')
        self.assertEqual(data['options'], ['A', 'B', 'C', 'D'])
        self.assertEqual(data['difficulty_level'], 'easy')
        self.assertEqual(data['question_type'], 'multiple_choice')
        self.assertEqual(data['order'], 1)


class SubmissionSerializerTestCase(TestCase):
    """Test cases for submission-related serializers"""
    
    def setUp(self):
        """Set up test data"""
        self.user = User.objects.create_user(
            username='serializer_user',
            email='serializer@example.com',
            password='testpass123'
        )
        
        self.test = Test.objects.create(
            title='Submission Test',
            test_type='numerical_reasoning',
            description='Test for submission serializers',
            duration_minutes=20,
            total_questions=2,
            passing_score=70
        )
        
        self.questions = [
            Question.objects.create(
                test=self.test,
                question_type='multiple_choice',
                question_text='What is 2 + 2?',
                options=['3', '4', '5', '6'],
                correct_answer='B',
                difficulty_level='easy',
                order=1
            ),
            Question.objects.create(
                test=self.test,
                question_type='multiple_choice',
                question_text='What is 3 × 3?',
                options=['6', '9', '12', '15'],
                correct_answer='B',
                difficulty_level='medium',
                order=2
            )
        ]
        
        self.submission = TestSubmission.objects.create(
            user=self.user,
            test=self.test,
            time_taken_seconds=600,
            answers_data={str(self.questions[0].id): 'B', str(self.questions[1].id): 'B'},
            is_complete=True
        )
        
        self.score = Score.objects.create(
            submission=self.submission,
            raw_score=Decimal('2.5'),
            max_possible_score=Decimal('2.5'),
            percentage_score=Decimal('100.00'),
            correct_answers=2,
            total_questions=2,
            easy_correct=1,
            medium_correct=1,
            hard_correct=0,
            easy_score=Decimal('1.0'),
            medium_score=Decimal('1.5'),
            hard_score=Decimal('0.0'),
            average_time_per_question=Decimal('300.0'),
            fastest_question_time=300,
            slowest_question_time=300
        )
    
    def test_submission_input_serializer_valid_data(self):
        """Test SubmissionInputSerializer with valid data"""
        valid_data = {
            'answers': {
                str(self.questions[0].id): 'B',
                str(self.questions[1].id): 'B'
            },
            'time_taken_seconds': 600,
            'submission_metadata': {
                'browser': 'Chrome',
                'device': 'desktop'
            }
        }
        
        serializer = SubmissionInputSerializer(data=valid_data)
        self.assertTrue(serializer.is_valid())
        
        validated_data = serializer.validated_data
        self.assertEqual(validated_data['time_taken_seconds'], 600)
        self.assertIn(str(self.questions[0].id), validated_data['answers'])
        self.assertEqual(validated_data['answers'][str(self.questions[0].id)], 'B')
        self.assertIn('submission_metadata', validated_data)
    
    def test_submission_input_serializer_invalid_data(self):
        """Test SubmissionInputSerializer with invalid data"""
        # Test empty answers
        invalid_data = {
            'answers': {},
            'time_taken_seconds': 600
        }
        
        serializer = SubmissionInputSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('answers', serializer.errors)
        
        # Test negative time
        invalid_data = {
            'answers': {str(self.questions[0].id): 'B'},
            'time_taken_seconds': -100
        }
        
        serializer = SubmissionInputSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('time_taken_seconds', serializer.errors)
        
        # Test zero time
        invalid_data = {
            'answers': {str(self.questions[0].id): 'B'},
            'time_taken_seconds': 0
        }
        
        serializer = SubmissionInputSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('time_taken_seconds', serializer.errors)
    
    def test_submission_input_serializer_validation_methods(self):
        """Test SubmissionInputSerializer validation methods"""
        # Test validate_answers method
        serializer = SubmissionInputSerializer()
        
        # Valid answers
        valid_answers = {str(self.questions[0].id): 'B'}
        validated_answers = serializer.validate_answers(valid_answers)
        self.assertEqual(validated_answers, valid_answers)
        
        # Invalid question ID
        with self.assertRaises(ValidationError):
            serializer.validate_answers({'99999': 'B'})
        
        # Test validate_time_taken_seconds method
        self.assertEqual(serializer.validate_time_taken_seconds(600), 600)
        
        with self.assertRaises(ValidationError):
            serializer.validate_time_taken_seconds(-100)
        
        with self.assertRaises(ValidationError):
            serializer.validate_time_taken_seconds(0)
    
    def test_test_submission_serializer(self):
        """Test TestSubmissionSerializer"""
        serializer = TestSubmissionSerializer(self.submission)
        data = serializer.data
        
        # Check required fields
        self.assertIn('id', data)
        self.assertIn('user', data)
        self.assertIn('test', data)
        self.assertIn('submitted_at', data)
        self.assertIn('time_taken_seconds', data)
        self.assertIn('is_complete', data)
        self.assertIn('answers_data', data)
        self.assertIn('scored_at', data)
        self.assertIn('scoring_version', data)
        
        # Check values
        self.assertEqual(data['user'], self.user.id)
        self.assertEqual(data['test'], self.test.id)
        self.assertEqual(data['time_taken_seconds'], 600)
        self.assertTrue(data['is_complete'])
        self.assertIn(str(self.questions[0].id), data['answers_data'])
    
    def test_answer_detail_serializer(self):
        """Test AnswerDetailSerializer"""
        # Create an answer
        answer = Answer.objects.create(
            submission=self.submission,
            question=self.questions[0],
            selected_answer='B',
            is_correct=True,
            time_taken_seconds=300,
            points_awarded=Decimal('1.0')
        )
        
        serializer = AnswerDetailSerializer(answer)
        data = serializer.data
        
        # Check required fields
        self.assertIn('id', data)
        self.assertIn('submission', data)
        self.assertIn('question', data)
        self.assertIn('selected_answer', data)
        self.assertIn('is_correct', data)
        self.assertIn('time_taken_seconds', data)
        self.assertIn('points_awarded', data)
        self.assertIn('answered_at', data)
        
        # Check values
        self.assertEqual(data['selected_answer'], 'B')
        self.assertTrue(data['is_correct'])
        self.assertEqual(data['time_taken_seconds'], 300)
        self.assertEqual(data['points_awarded'], '1.00')
    
    def test_score_detail_serializer(self):
        """Test ScoreDetailSerializer"""
        serializer = ScoreDetailSerializer(self.score)
        data = serializer.data
        
        # Check required fields
        self.assertIn('id', data)
        self.assertIn('submission', data)
        self.assertIn('raw_score', data)
        self.assertIn('max_possible_score', data)
        self.assertIn('percentage_score', data)
        self.assertIn('grade_letter', data)
        self.assertIn('passed', data)
        self.assertIn('correct_answers', data)
        self.assertIn('total_questions', data)
        self.assertIn('easy_correct', data)
        self.assertIn('medium_correct', data)
        self.assertIn('hard_correct', data)
        self.assertIn('easy_score', data)
        self.assertIn('medium_score', data)
        self.assertIn('hard_score', data)
        self.assertIn('average_time_per_question', data)
        self.assertIn('fastest_question_time', data)
        self.assertIn('slowest_question_time', data)
        self.assertIn('scoring_algorithm', data)
        self.assertIn('calculated_at', data)
        self.assertIn('metadata', data)
        
        # Check values
        self.assertEqual(data['raw_score'], '2.50')
        self.assertEqual(data['max_possible_score'], '2.50')
        self.assertEqual(data['percentage_score'], '100.00')
        self.assertEqual(data['grade_letter'], 'A')
        self.assertTrue(data['passed'])
        self.assertEqual(data['correct_answers'], 2)
        self.assertEqual(data['total_questions'], 2)
        self.assertEqual(data['easy_correct'], 1)
        self.assertEqual(data['medium_correct'], 1)
        self.assertEqual(data['hard_correct'], 0)
        self.assertEqual(data['easy_score'], '1.00')
        self.assertEqual(data['medium_score'], '1.50')
        self.assertEqual(data['hard_score'], '0.00')


class ScoringConfigSerializerTestCase(TestCase):
    """Test cases for ScoringConfigSerializer"""
    
    def test_scoring_config_serializer(self):
        """Test ScoringConfigSerializer"""
        from ..services.scoring_service import ScoringConfig
        
        config = ScoringConfig()
        serializer = ScoringConfigSerializer(config)
        data = serializer.data
        
        # Check required fields
        self.assertIn('difficulty_coefficients', data)
        self.assertIn('grading_scale', data)
        self.assertIn('time_limits', data)
        self.assertIn('scoring_algorithm', data)
        self.assertIn('version', data)
        
        # Check difficulty coefficients
        coefficients = data['difficulty_coefficients']
        self.assertEqual(coefficients['easy'], '1.0')
        self.assertEqual(coefficients['medium'], '1.5')
        self.assertEqual(coefficients['hard'], '2.0')
        
        # Check grading scale
        grading_scale = data['grading_scale']
        self.assertIn('A', grading_scale)
        self.assertIn('B', grading_scale)
        self.assertIn('C', grading_scale)
        self.assertIn('D', grading_scale)
        self.assertIn('F', grading_scale)
        
        # Check time limits
        time_limits = data['time_limits']
        self.assertIn('default_duration_minutes', time_limits)
        self.assertIn('max_duration_minutes', time_limits)
        self.assertIn('min_duration_seconds', time_limits)


class SerializerValidationTestCase(TestCase):
    """Test cases for serializer validation edge cases"""
    
    def setUp(self):
        """Set up test data"""
        self.user = User.objects.create_user(
            username='validation_user',
            email='validation@example.com',
            password='testpass123'
        )
        
        self.test = Test.objects.create(
            title='Validation Test',
            test_type='logical_reasoning',
            description='Test for validation edge cases',
            duration_minutes=20,
            total_questions=1,
            passing_score=70
        )
        
        self.question = Question.objects.create(
            test=self.test,
            question_type='multiple_choice',
            question_text='Test question',
            options=['A', 'B', 'C', 'D'],
            correct_answer='A',
            difficulty_level='easy',
            order=1
        )
    
    def test_submission_input_serializer_edge_cases(self):
        """Test SubmissionInputSerializer with edge cases"""
        serializer = SubmissionInputSerializer()
        
        # Test very large time values
        with self.assertRaises(ValidationError):
            serializer.validate_time_taken_seconds(999999)
        
        # Test very small time values
        with self.assertRaises(ValidationError):
            serializer.validate_time_taken_seconds(1)
        
        # Test valid time range
        self.assertEqual(serializer.validate_time_taken_seconds(60), 60)  # 1 minute
        self.assertEqual(serializer.validate_time_taken_seconds(1200), 1200)  # 20 minutes
        self.assertEqual(serializer.validate_time_taken_seconds(3600), 3600)  # 1 hour
    
    def test_submission_input_serializer_metadata_validation(self):
        """Test SubmissionInputSerializer metadata validation"""
        # Test with valid metadata
        valid_data = {
            'answers': {str(self.question.id): 'A'},
            'time_taken_seconds': 600,
            'submission_metadata': {
                'browser': 'Chrome',
                'device': 'desktop',
                'screen_resolution': '1920x1080',
                'user_agent': 'Mozilla/5.0...'
            }
        }
        
        serializer = SubmissionInputSerializer(data=valid_data)
        self.assertTrue(serializer.is_valid())
        
        # Test with empty metadata
        valid_data['submission_metadata'] = {}
        serializer = SubmissionInputSerializer(data=valid_data)
        self.assertTrue(serializer.is_valid())
        
        # Test with None metadata
        valid_data['submission_metadata'] = None
        serializer = SubmissionInputSerializer(data=valid_data)
        self.assertTrue(serializer.is_valid())
    
    def test_serializer_field_validation(self):
        """Test field-level validation in serializers"""
        # Test QuestionForTestSerializer with different question types
        question_types = ['multiple_choice', 'true_false', 'fill_in_blank']
        
        for q_type in question_types:
            question = Question.objects.create(
                test=self.test,
                question_type=q_type,
                question_text=f'Test {q_type} question',
                options=['A', 'B'] if q_type != 'fill_in_blank' else [],
                correct_answer='A' if q_type != 'fill_in_blank' else 'test answer',
                difficulty_level='easy',
                order=2
            )
            
            serializer = QuestionForTestSerializer(question)
            data = serializer.data
            
            # Should not expose correct_answer regardless of question type
            self.assertNotIn('correct_answer', data)
            self.assertIn('question_text', data)
            self.assertIn('question_type', data)
    
    def test_serializer_nested_validation(self):
        """Test nested validation in complex serializers"""
        # Test TestSubmissionSerializer with nested score
        submission = TestSubmission.objects.create(
            user=self.user,
            test=self.test,
            time_taken_seconds=600,
            answers_data={str(self.question.id): 'A'},
            is_complete=True
        )
        
        score = Score.objects.create(
            submission=submission,
            raw_score=Decimal('1.0'),
            max_possible_score=Decimal('1.0'),
            percentage_score=Decimal('100.00'),
            correct_answers=1,
            total_questions=1,
            easy_correct=1,
            medium_correct=0,
            hard_correct=0,
            easy_score=Decimal('1.0'),
            medium_score=Decimal('0.0'),
            hard_score=Decimal('0.0'),
            average_time_per_question=Decimal('600.0'),
            fastest_question_time=600,
            slowest_question_time=600
        )
        
        serializer = TestSubmissionSerializer(submission)
        data = serializer.data
        
        # Check that nested relationships are properly serialized
        self.assertIn('user', data)
        self.assertIn('test', data)
        self.assertIsInstance(data['user'], int)
        self.assertIsInstance(data['test'], int)
        
        # Check that the submission has the correct structure
        self.assertIn('submitted_at', data)
        self.assertIn('time_taken_seconds', data)
        self.assertIn('is_complete', data)
