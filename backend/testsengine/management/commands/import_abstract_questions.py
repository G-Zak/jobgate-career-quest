"""
Django management command to import abstract reasoning questions into the database.
"""

from django.core.management.base import BaseCommand
from testsengine.models import Test, Question
import json


class Command(BaseCommand):
    help = 'Import abstract reasoning questions into the database'

    def add_arguments(self, parser):
        parser.add_argument(
            '--test-id',
            type=int,
            help='Specific test ID to update (optional)',
        )

    def handle(self, *args, **options):
        self.stdout.write('Starting abstract reasoning questions import...')
        
        # Create or get abstract reasoning tests
        tests_data = [
            {
                'id': 27,
                'title': 'Abstract Reasoning - Pattern Completion',
                'test_type': 'abstract_reasoning',
                'description': 'Complete abstract patterns and sequences',
                'duration_minutes': 25,
                'questions': self.get_pattern_completion_questions()
            },
            {
                'id': 28,
                'title': 'Abstract Reasoning - Matrix Reasoning',
                'test_type': 'abstract_reasoning',
                'description': 'Solve matrix-based abstract reasoning problems',
                'duration_minutes': 30,
                'questions': self.get_matrix_reasoning_questions()
            },
            {
                'id': 29,
                'title': 'Abstract Reasoning - Series Completion',
                'test_type': 'abstract_reasoning',
                'description': 'Complete abstract series and sequences',
                'duration_minutes': 20,
                'questions': self.get_series_completion_questions()
            }
        ]

        for test_data in tests_data:
            self.create_abstract_test(test_data)

        self.stdout.write(
            self.style.SUCCESS('Successfully imported abstract reasoning questions!')
        )

    def create_abstract_test(self, test_data):
        """Create or update an abstract reasoning test"""
        test, created = Test.objects.update_or_create(
            id=test_data['id'],
            defaults={
                'title': test_data['title'],
                'test_type': test_data['test_type'],
                'description': test_data['description'],
                'duration_minutes': test_data['duration_minutes'],
                'total_questions': len(test_data['questions']),
                'is_active': True
            }
        )

        if created:
            self.stdout.write(f'Created test: {test.title}')
        else:
            self.stdout.write(f'Updated test: {test.title}')

        # Create questions for this test
        for question_data in test_data['questions']:
            self.create_question(test, question_data)

    def create_question(self, test, question_data):
        """Create a question for the test"""
        question, created = Question.objects.update_or_create(
            test=test,
            order=question_data['order'],
            defaults={
                'test': test,
                'question_type': question_data['question_type'],
                'question_text': question_data['question_text'],
                'context': question_data.get('context', ''),
                'options': question_data['options'],
                'correct_answer': question_data['correct_answer'],
                'explanation': question_data.get('explanation', ''),
                'difficulty_level': question_data.get('difficulty_level', 'medium'),
                'order': question_data['order'],
                'main_image': question_data.get('main_image')
            }
        )

        if created:
            self.stdout.write(f'  Created question {question.order}: {question.question_text[:50]}...')

    def get_pattern_completion_questions(self):
        """Pattern completion questions"""
        return [
            {
                'order': 1,
                'question_type': 'pattern_completion',
                'question_text': 'What comes next in this abstract pattern?',
                'context': 'Pattern: Circle, Square, Triangle, Circle, Square, ?',
                'options': ['Triangle', 'Circle', 'Square', 'Diamond', 'Pentagon'],
                'correct_answer': 'A',
                'difficulty_level': 'easy',
                'explanation': 'The pattern repeats every 3 shapes: Circle, Square, Triangle.'
            },
            {
                'order': 2,
                'question_type': 'pattern_completion',
                'question_text': 'Which shape completes the sequence?',
                'context': 'Sequence: 1 dot, 2 dots, 3 dots, 4 dots, ?',
                'options': ['5 dots', '6 dots', '7 dots', '8 dots', '9 dots'],
                'correct_answer': 'A',
                'difficulty_level': 'easy',
                'explanation': 'The sequence increases by 1 dot each time.'
            },
            {
                'order': 3,
                'question_type': 'pattern_completion',
                'question_text': 'What is the next element in this pattern?',
                'context': 'Pattern: A, C, E, G, ?',
                'options': ['H', 'I', 'J', 'K', 'L'],
                'correct_answer': 'B',
                'difficulty_level': 'medium',
                'explanation': 'The pattern skips one letter: A (skip B) C (skip D) E (skip F) G, so next is I.'
            },
            {
                'order': 4,
                'question_type': 'pattern_completion',
                'question_text': 'Which shape follows the pattern?',
                'context': 'Pattern: Large circle, Small square, Large triangle, Small circle, ?',
                'options': ['Large square', 'Small triangle', 'Large circle', 'Small square', 'Large triangle'],
                'correct_answer': 'A',
                'difficulty_level': 'hard',
                'explanation': 'Pattern alternates between large and small, and cycles through circle, square, triangle.'
            },
            {
                'order': 5,
                'question_type': 'pattern_completion',
                'question_text': 'What completes this sequence?',
                'context': 'Sequence: 2, 4, 8, 16, ?',
                'options': ['24', '32', '40', '48', '64'],
                'correct_answer': 'B',
                'difficulty_level': 'medium',
                'explanation': 'Each number is double the previous: 2×2=4, 4×2=8, 8×2=16, 16×2=32.'
            }
        ]

    def get_matrix_reasoning_questions(self):
        """Matrix reasoning questions"""
        return [
            {
                'order': 1,
                'question_type': 'matrix_reasoning',
                'question_text': 'What should replace the question mark in this matrix?',
                'context': 'Matrix: [A B C] [D E F] [G H ?]',
                'options': ['I', 'J', 'K', 'L', 'M'],
                'correct_answer': 'A',
                'difficulty_level': 'easy',
                'explanation': 'The matrix follows alphabetical order: A,B,C in first row, D,E,F in second row, so G,H,I in third row.'
            },
            {
                'order': 2,
                'question_type': 'matrix_reasoning',
                'question_text': 'Which pattern completes the matrix?',
                'context': 'Matrix: [1 2 3] [4 5 6] [7 8 ?]',
                'options': ['9', '10', '11', '12', '13'],
                'correct_answer': 'A',
                'difficulty_level': 'easy',
                'explanation': 'The matrix follows numerical order: 1,2,3 in first row, 4,5,6 in second row, so 7,8,9 in third row.'
            },
            {
                'order': 3,
                'question_type': 'matrix_reasoning',
                'question_text': 'What is the missing element?',
                'context': 'Matrix: [A B C] [B C D] [C D ?]',
                'options': ['D', 'E', 'F', 'G', 'H'],
                'correct_answer': 'B',
                'difficulty_level': 'medium',
                'explanation': 'Each row shifts one position to the right: A,B,C → B,C,D → C,D,E.'
            },
            {
                'order': 4,
                'question_type': 'matrix_reasoning',
                'question_text': 'Which symbol completes the pattern?',
                'context': 'Matrix: [○ □ △] [□ △ ○] [△ ○ ?]',
                'options': ['□', '○', '△', '◇', '☆'],
                'correct_answer': 'A',
                'difficulty_level': 'hard',
                'explanation': 'Each row rotates the symbols: ○,□,△ → □,△,○ → △,○,□.'
            },
            {
                'order': 5,
                'question_type': 'matrix_reasoning',
                'question_text': 'What should be in the bottom right corner?',
                'context': 'Matrix: [1 2 3] [2 4 6] [3 6 ?]',
                'options': ['9', '12', '15', '18', '21'],
                'correct_answer': 'A',
                'difficulty_level': 'medium',
                'explanation': 'Each row is multiplied by its row number: 1×1,2×1,3×1 → 1×2,2×2,3×2 → 1×3,2×3,3×3.'
            }
        ]

    def get_series_completion_questions(self):
        """Series completion questions"""
        return [
            {
                'order': 1,
                'question_type': 'series_completion',
                'question_text': 'What comes next in this series?',
                'context': 'Series: 2, 4, 6, 8, ?',
                'options': ['10', '12', '14', '16', '18'],
                'correct_answer': 'A',
                'difficulty_level': 'easy',
                'explanation': 'The series increases by 2 each time: 2+2=4, 4+2=6, 6+2=8, 8+2=10.'
            },
            {
                'order': 2,
                'question_type': 'series_completion',
                'question_text': 'Which number completes the sequence?',
                'context': 'Sequence: 1, 4, 9, 16, ?',
                'options': ['25', '36', '49', '64', '81'],
                'correct_answer': 'A',
                'difficulty_level': 'medium',
                'explanation': 'The sequence represents perfect squares: 1²=1, 2²=4, 3²=9, 4²=16, 5²=25.'
            },
            {
                'order': 3,
                'question_type': 'series_completion',
                'question_text': 'What is the next term?',
                'context': 'Series: A, D, G, J, ?',
                'options': ['M', 'N', 'O', 'P', 'Q'],
                'correct_answer': 'A',
                'difficulty_level': 'medium',
                'explanation': 'The series skips 2 letters each time: A (skip B,C) D (skip E,F) G (skip H,I) J, so next is M.'
            },
            {
                'order': 4,
                'question_type': 'series_completion',
                'question_text': 'Which pattern completes the series?',
                'context': 'Series: 1, 1, 2, 3, 5, ?',
                'options': ['8', '13', '21', '34', '55'],
                'correct_answer': 'A',
                'difficulty_level': 'hard',
                'explanation': 'This is the Fibonacci sequence: each number is the sum of the two preceding numbers: 1+1=2, 1+2=3, 2+3=5, 3+5=8.'
            },
            {
                'order': 5,
                'question_type': 'series_completion',
                'question_text': 'What comes next in this abstract series?',
                'context': 'Series: 3, 6, 12, 24, ?',
                'options': ['48', '72', '96', '120', '144'],
                'correct_answer': 'A',
                'difficulty_level': 'medium',
                'explanation': 'Each number is double the previous: 3×2=6, 6×2=12, 12×2=24, 24×2=48.'
            }
        ]
