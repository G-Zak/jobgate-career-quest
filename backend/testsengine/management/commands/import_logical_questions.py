"""
Django management command to import logical reasoning questions into the database.
"""

from django.core.management.base import BaseCommand
from testsengine.models import Test, Question
import json


class Command(BaseCommand):
    help = 'Import logical reasoning questions into the database'

    def add_arguments(self, parser):
        parser.add_argument(
            '--test-id',
            type=int,
            help='Specific test ID to update (optional)',
        )

    def handle(self, *args, **options):
        self.stdout.write('Starting logical reasoning questions import...')
        
        # Create or get logical reasoning tests
        tests_data = [
            {
                'id': 30,
                'title': 'Logical Reasoning - Deductive Logic',
                'test_type': 'logical_reasoning',
                'description': 'Deductive reasoning and logical inference',
                'duration_minutes': 25,
                'questions': self.get_deductive_logic_questions()
            },
            {
                'id': 31,
                'title': 'Logical Reasoning - Inductive Logic',
                'test_type': 'logical_reasoning',
                'description': 'Inductive reasoning and pattern recognition',
                'duration_minutes': 30,
                'questions': self.get_inductive_logic_questions()
            },
            {
                'id': 32,
                'title': 'Logical Reasoning - Critical Thinking',
                'test_type': 'logical_reasoning',
                'description': 'Critical thinking and argument analysis',
                'duration_minutes': 35,
                'questions': self.get_critical_thinking_questions()
            }
        ]

        for test_data in tests_data:
            self.create_logical_test(test_data)

        self.stdout.write(
            self.style.SUCCESS('Successfully imported logical reasoning questions!')
        )

    def create_logical_test(self, test_data):
        """Create or update a logical reasoning test"""
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

    def get_deductive_logic_questions(self):
        """Deductive logic questions"""
        return [
            {
                'order': 1,
                'question_type': 'deductive_logic',
                'question_text': 'If all birds can fly, and penguins are birds, what can we conclude?',
                'context': 'Given premises: All birds can fly. Penguins are birds.',
                'options': ['Penguins can fly', 'Penguins cannot fly', 'Some birds cannot fly', 'The premise is false', 'Cannot determine'],
                'correct_answer': 'A',
                'difficulty_level': 'easy',
                'explanation': 'Using deductive logic: If all birds can fly (major premise) and penguins are birds (minor premise), then penguins can fly (conclusion).'
            },
            {
                'order': 2,
                'question_type': 'deductive_logic',
                'question_text': 'If A implies B, and B implies C, what can we conclude about A and C?',
                'context': 'Logical chain: A → B → C',
                'options': ['A implies C', 'C implies A', 'A and C are equivalent', 'No relationship', 'Cannot determine'],
                'correct_answer': 'A',
                'difficulty_level': 'medium',
                'explanation': 'This follows the transitive property: if A→B and B→C, then A→C.'
            },
            {
                'order': 3,
                'question_type': 'deductive_logic',
                'question_text': 'If no cats are dogs, and Fluffy is a cat, what can we conclude about Fluffy?',
                'context': 'Premises: No cats are dogs. Fluffy is a cat.',
                'options': ['Fluffy is a dog', 'Fluffy is not a dog', 'Fluffy might be a dog', 'Cannot determine', 'The premises are contradictory'],
                'correct_answer': 'B',
                'difficulty_level': 'easy',
                'explanation': 'Since no cats are dogs and Fluffy is a cat, Fluffy cannot be a dog.'
            },
            {
                'order': 4,
                'question_type': 'deductive_logic',
                'question_text': 'If either P or Q is true, and P is false, what can we conclude about Q?',
                'context': 'Logical statement: P ∨ Q (P or Q), and P is false.',
                'options': ['Q is true', 'Q is false', 'Q might be true', 'Cannot determine', 'The statement is invalid'],
                'correct_answer': 'A',
                'difficulty_level': 'medium',
                'explanation': 'In an OR statement, if one part is false, the other must be true for the whole statement to be true.'
            },
            {
                'order': 5,
                'question_type': 'deductive_logic',
                'question_text': 'If all squares are rectangles, and all rectangles have four sides, what can we conclude about squares?',
                'context': 'Premises: All squares are rectangles. All rectangles have four sides.',
                'options': ['Squares have four sides', 'Squares have more than four sides', 'Squares have fewer than four sides', 'Cannot determine', 'The premises are false'],
                'correct_answer': 'A',
                'difficulty_level': 'easy',
                'explanation': 'Using syllogistic reasoning: All squares are rectangles, all rectangles have four sides, therefore all squares have four sides.'
            }
        ]

    def get_inductive_logic_questions(self):
        """Inductive logic questions"""
        return [
            {
                'order': 1,
                'question_type': 'inductive_logic',
                'question_text': 'Every morning for a week, the sun has risen. What can we reasonably conclude?',
                'context': 'Observation: Sun has risen every morning for 7 consecutive days.',
                'options': ['The sun will rise tomorrow', 'The sun will not rise tomorrow', 'The sun rises randomly', 'Cannot make any conclusion', 'The pattern will break'],
                'correct_answer': 'A',
                'difficulty_level': 'easy',
                'explanation': 'This is inductive reasoning - we generalize from observed patterns to make predictions about future events.'
            },
            {
                'order': 2,
                'question_type': 'inductive_logic',
                'question_text': 'In a sample of 1000 people, 80% prefer coffee over tea. What can we conclude about the general population?',
                'context': 'Sample data: 800 out of 1000 people prefer coffee.',
                'options': ['Most people prefer coffee', 'All people prefer coffee', 'Coffee is objectively better', 'The sample is biased', 'Cannot generalize'],
                'correct_answer': 'A',
                'difficulty_level': 'medium',
                'explanation': 'Inductive reasoning allows us to generalize from a sample to the population, though with some uncertainty.'
            },
            {
                'order': 3,
                'question_type': 'inductive_logic',
                'question_text': 'Every swan observed so far has been white. What is the strongest conclusion?',
                'context': 'Observation: All observed swans are white.',
                'options': ['All swans are white', 'Most swans are white', 'Swans are typically white', 'Black swans do not exist', 'The observation is incomplete'],
                'correct_answer': 'C',
                'difficulty_level': 'hard',
                'explanation': 'Inductive reasoning provides probable conclusions, not certain ones. "Typically" acknowledges the possibility of exceptions.'
            },
            {
                'order': 4,
                'question_type': 'inductive_logic',
                'question_text': 'In the last 10 years, stock prices have generally increased in January. What can we reasonably predict?',
                'context': 'Historical pattern: Stock prices tend to rise in January over 10 years.',
                'options': ['Stocks will rise next January', 'Stocks might rise next January', 'January is always profitable', 'The pattern will continue forever', 'Cannot make predictions'],
                'correct_answer': 'B',
                'difficulty_level': 'medium',
                'explanation': 'Inductive reasoning suggests probable outcomes based on patterns, but acknowledges uncertainty and the possibility of change.'
            },
            {
                'order': 5,
                'question_type': 'inductive_logic',
                'question_text': 'Every time it has rained, the grass has grown greener. What can we conclude?',
                'context': 'Observation: Rain consistently leads to greener grass.',
                'options': ['Rain causes grass to grow greener', 'Rain and green grass are correlated', 'Grass always needs rain', 'The pattern is coincidental', 'Cannot determine causation'],
                'correct_answer': 'B',
                'difficulty_level': 'hard',
                'explanation': 'Inductive reasoning can identify correlations, but establishing causation requires additional evidence and analysis.'
            }
        ]

    def get_critical_thinking_questions(self):
        """Critical thinking questions"""
        return [
            {
                'order': 1,
                'question_type': 'critical_thinking',
                'question_text': 'A study claims that people who eat chocolate daily are happier. What is the most important question to ask?',
                'context': 'Research finding: Daily chocolate consumption correlates with happiness.',
                'options': ['How much chocolate?', 'What type of chocolate?', 'Could happiness cause chocolate eating?', 'How many people were studied?', 'What about other factors?'],
                'correct_answer': 'C',
                'difficulty_level': 'medium',
                'explanation': 'Critical thinking requires considering alternative explanations and reverse causality - maybe happy people eat more chocolate.'
            },
            {
                'order': 2,
                'question_type': 'critical_thinking',
                'question_text': 'A politician claims that crime has decreased by 50% since they took office. What evidence would be most important to verify this claim?',
                'context': 'Political claim: 50% reduction in crime under current leadership.',
                'options': ['Police reports', 'Independent crime statistics', 'Public opinion polls', 'Media coverage', 'Personal observations'],
                'correct_answer': 'B',
                'difficulty_level': 'easy',
                'explanation': 'Critical thinking requires independent verification from unbiased sources, not self-reported data.'
            },
            {
                'order': 3,
                'question_type': 'critical_thinking',
                'question_text': 'A company advertises that 9 out of 10 doctors recommend their product. What is the most critical flaw in this claim?',
                'context': 'Marketing claim: 90% of doctors recommend the product.',
                'options': ['The sample size is too small', 'The doctors were paid', 'The question was leading', 'The product is expensive', 'The claim is too general'],
                'correct_answer': 'C',
                'difficulty_level': 'hard',
                'explanation': 'Critical thinking involves recognizing how the framing of questions can bias responses and make claims misleading.'
            },
            {
                'order': 4,
                'question_type': 'critical_thinking',
                'question_text': 'A news headline states "Local crime rate soars 200%". What additional information is most important?',
                'context': 'News headline about dramatic crime increase.',
                'options': ['The time period', 'The types of crimes', 'The population size', 'The baseline numbers', 'The reporting method'],
                'correct_answer': 'D',
                'difficulty_level': 'medium',
                'explanation': 'Critical thinking requires understanding the baseline - a 200% increase from 1 to 3 crimes is very different from 100 to 300 crimes.'
            },
            {
                'order': 5,
                'question_type': 'critical_thinking',
                'question_text': 'A study shows that students who use laptops in class perform worse on exams. What is the most likely explanation?',
                'context': 'Research finding: Laptop use correlates with lower exam performance.',
                'options': ['Laptops are distracting', 'Laptops cause eye strain', 'Weaker students use laptops more', 'Laptops are expensive', 'Laptops are outdated'],
                'correct_answer': 'C',
                'difficulty_level': 'hard',
                'explanation': 'Critical thinking involves considering confounding variables - maybe students who struggle academically are more likely to use laptops for assistance.'
            }
        ]
