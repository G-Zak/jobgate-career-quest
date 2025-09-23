"""
Django management command to import diagrammatic reasoning questions into the database.
"""

from django.core.management.base import BaseCommand
from testsengine.models import Test, Question
import json


class Command(BaseCommand):
    help = 'Import diagrammatic reasoning questions into the database'

    def add_arguments(self, parser):
        parser.add_argument(
            '--test-id',
            type=int,
            help='Specific test ID to update (optional)',
        )

    def handle(self, *args, **options):
        self.stdout.write('Starting diagrammatic reasoning questions import...')
        
        # Create or get diagrammatic reasoning tests
        tests_data = [
            {
                'id': 24,
                'title': 'Diagrammatic Reasoning - Pattern Recognition',
                'test_type': 'diagrammatic_reasoning',
                'description': 'Pattern recognition and sequence completion',
                'duration_minutes': 30,
                'questions': self.get_pattern_recognition_questions()
            },
            {
                'id': 25,
                'title': 'Diagrammatic Reasoning - Logic Diagrams',
                'test_type': 'diagrammatic_reasoning',
                'description': 'Logic flow diagrams and decision trees',
                'duration_minutes': 35,
                'questions': self.get_logic_diagram_questions()
            },
            {
                'id': 26,
                'title': 'Diagrammatic Reasoning - Network Analysis',
                'test_type': 'diagrammatic_reasoning',
                'description': 'Network diagrams and connectivity analysis',
                'duration_minutes': 40,
                'questions': self.get_network_analysis_questions()
            }
        ]

        for test_data in tests_data:
            self.create_diagrammatic_test(test_data)

        self.stdout.write(
            self.style.SUCCESS('Successfully imported diagrammatic reasoning questions!')
        )

    def create_diagrammatic_test(self, test_data):
        """Create or update a diagrammatic reasoning test"""
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

    def get_pattern_recognition_questions(self):
        """Pattern recognition questions"""
        return [
            {
                'order': 1,
                'question_type': 'pattern_recognition',
                'question_text': 'What comes next in the sequence?',
                'context': 'Look at the pattern: Circle, Square, Triangle, Circle, Square, ?',
                'options': ['Triangle', 'Circle', 'Square', 'Diamond', 'Pentagon'],
                'correct_answer': 'A',
                'difficulty_level': 'easy',
                'explanation': 'The pattern repeats every 3 shapes: Circle, Square, Triangle.'
            },
            {
                'order': 2,
                'question_type': 'pattern_recognition',
                'question_text': 'Which figure completes the sequence?',
                'context': 'Sequence: 1 dot, 2 dots, 3 dots, 4 dots, ?',
                'options': ['5 dots', '6 dots', '7 dots', '8 dots', '9 dots'],
                'correct_answer': 'A',
                'difficulty_level': 'easy',
                'explanation': 'The sequence increases by 1 dot each time.'
            },
            {
                'order': 3,
                'question_type': 'pattern_recognition',
                'question_text': 'What is the next element in this pattern?',
                'context': 'Pattern: A, C, E, G, ?',
                'options': ['H', 'I', 'J', 'K', 'L'],
                'correct_answer': 'B',
                'difficulty_level': 'medium',
                'explanation': 'The pattern skips one letter: A (skip B) C (skip D) E (skip F) G, so next is I.'
            },
            {
                'order': 4,
                'question_type': 'pattern_recognition',
                'question_text': 'Which shape follows the pattern?',
                'context': 'Pattern: Large circle, Small square, Large triangle, Small circle, ?',
                'options': ['Large square', 'Small triangle', 'Large circle', 'Small square', 'Large triangle'],
                'correct_answer': 'A',
                'difficulty_level': 'hard',
                'explanation': 'Pattern alternates between large and small, and cycles through circle, square, triangle.'
            },
            {
                'order': 5,
                'question_type': 'pattern_recognition',
                'question_text': 'What completes this sequence?',
                'context': 'Sequence: 2, 4, 8, 16, ?',
                'options': ['24', '32', '40', '48', '64'],
                'correct_answer': 'B',
                'difficulty_level': 'medium',
                'explanation': 'Each number is double the previous: 2×2=4, 4×2=8, 8×2=16, 16×2=32.'
            }
        ]

    def get_logic_diagram_questions(self):
        """Logic diagram questions"""
        return [
            {
                'order': 1,
                'question_type': 'logic_diagram',
                'question_text': 'If A leads to B, and B leads to C, what happens if A is true?',
                'context': 'Logic flow: A → B → C',
                'options': ['C is true', 'C is false', 'Cannot determine', 'B is false', 'A is false'],
                'correct_answer': 'A',
                'difficulty_level': 'easy',
                'explanation': 'If A is true, then B is true, and if B is true, then C is true.'
            },
            {
                'order': 2,
                'question_type': 'logic_diagram',
                'question_text': 'In this decision tree, what path leads to success?',
                'context': 'Decision tree: Start → Is X > 5? → Yes: Success, No: Is Y < 3? → Yes: Success, No: Failure',
                'options': ['X > 5', 'Y < 3', 'Both X > 5 and Y < 3', 'Neither condition', 'Cannot determine'],
                'correct_answer': 'C',
                'difficulty_level': 'medium',
                'explanation': 'Success is achieved if either X > 5 OR Y < 3 (when X ≤ 5).'
            },
            {
                'order': 3,
                'question_type': 'logic_diagram',
                'question_text': 'What is the output of this logic gate?',
                'context': 'AND gate with inputs: A=1, B=0',
                'options': ['0', '1', 'Cannot determine', 'Depends on other inputs', 'Error'],
                'correct_answer': 'A',
                'difficulty_level': 'easy',
                'explanation': 'AND gate outputs 1 only when both inputs are 1. Since B=0, output is 0.'
            },
            {
                'order': 4,
                'question_type': 'logic_diagram',
                'question_text': 'Which condition must be true for the process to complete?',
                'context': 'Process flow: Check A → Check B → Check C → Complete. All checks must pass.',
                'options': ['A only', 'B only', 'C only', 'A and B and C', 'Any one of A, B, or C'],
                'correct_answer': 'D',
                'difficulty_level': 'medium',
                'explanation': 'Since all checks must pass, A AND B AND C must all be true.'
            },
            {
                'order': 5,
                'question_type': 'logic_diagram',
                'question_text': 'What is the result of this complex logic expression?',
                'context': 'Expression: (A OR B) AND (NOT C) where A=1, B=0, C=1',
                'options': ['True', 'False', 'Cannot evaluate', 'Depends on other variables', 'Error'],
                'correct_answer': 'B',
                'difficulty_level': 'hard',
                'explanation': '(1 OR 0) AND (NOT 1) = 1 AND 0 = 0 (False).'
            }
        ]

    def get_network_analysis_questions(self):
        """Network analysis questions"""
        return [
            {
                'order': 1,
                'question_type': 'network_analysis',
                'question_text': 'How many direct connections does Node A have?',
                'context': 'Network: A connects to B and C, B connects to D, C connects to E',
                'options': ['1', '2', '3', '4', '5'],
                'correct_answer': 'B',
                'difficulty_level': 'easy',
                'explanation': 'Node A has direct connections to B and C, so 2 connections.'
            },
            {
                'order': 2,
                'question_type': 'network_analysis',
                'question_text': 'What is the shortest path from A to D?',
                'context': 'Network: A-B-C-D, A-E-D, A-F-G-D',
                'options': ['A-B-C-D', 'A-E-D', 'A-F-G-D', 'All paths are equal', 'Cannot determine'],
                'correct_answer': 'B',
                'difficulty_level': 'medium',
                'explanation': 'A-E-D has 2 hops, while A-B-C-D and A-F-G-D have 3 hops each.'
            },
            {
                'order': 3,
                'question_type': 'network_analysis',
                'question_text': 'Which node is a bottleneck in this network?',
                'context': 'Network: All nodes connect through a central hub H',
                'options': ['Node A', 'Node B', 'Hub H', 'No bottleneck', 'Cannot determine'],
                'correct_answer': 'C',
                'difficulty_level': 'easy',
                'explanation': 'Hub H is the bottleneck as all traffic must pass through it.'
            },
            {
                'order': 4,
                'question_type': 'network_analysis',
                'question_text': 'If Node X fails, how many nodes become disconnected?',
                'context': 'Network: A-X-B, C-X-D, E-F (X is central node)',
                'options': ['0', '2', '4', '6', 'Cannot determine'],
                'correct_answer': 'C',
                'difficulty_level': 'hard',
                'explanation': 'If X fails, A, B, C, and D become disconnected (4 nodes). E and F remain connected.'
            },
            {
                'order': 5,
                'question_type': 'network_analysis',
                'question_text': 'What is the network redundancy level?',
                'context': 'Network: Each node has 2 alternative paths to reach any other node',
                'options': ['1', '2', '3', '4', 'Cannot determine'],
                'correct_answer': 'B',
                'difficulty_level': 'medium',
                'explanation': 'Redundancy level is 2 since each node has 2 alternative paths.'
            }
        ]
