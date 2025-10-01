"""
Django management command to import numerical reasoning questions into the database.
"""

from django.core.management.base import BaseCommand
from testsengine.models import Test, Question
import json

class Command(BaseCommand):
 help = 'Import numerical reasoning questions into the database'

 def add_arguments(self, parser):
 parser.add_argument(
 '--test-id',
 type=int,
 help='Specific test ID to update (optional)',
 )

 def handle(self, *args, **options):
 self.stdout.write('Starting numerical reasoning questions import...')

 # Create or get numerical reasoning tests
 tests_data = [
 {
 'id': 21,
 'title': 'Numerical Reasoning - Basic Arithmetic',
 'test_type': 'numerical_reasoning',
 'description': 'Basic arithmetic operations and calculations',
 'duration_minutes': 20,
 'questions': self.get_basic_arithmetic_questions()
 },
 {
 'id': 22,
 'title': 'Numerical Reasoning - Data Interpretation',
 'test_type': 'numerical_reasoning',
 'description': 'Data interpretation and analysis',
 'duration_minutes': 25,
 'questions': self.get_data_interpretation_questions()
 },
 {
 'id': 23,
 'title': 'Numerical Reasoning - Word Problems',
 'test_type': 'numerical_reasoning',
 'description': 'Mathematical word problems and problem solving',
 'duration_minutes': 30,
 'questions': self.get_word_problems_questions()
 }
 ]

 for test_data in tests_data:
 self.create_numerical_test(test_data)

 self.stdout.write(
 self.style.SUCCESS('Successfully imported numerical reasoning questions!')
 )

 def create_numerical_test(self, test_data):
 """Create or update a numerical reasoning test"""
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
 self.stdout.write(f' Created question {question.order}: {question.question_text[:50]}...')

 def get_basic_arithmetic_questions(self):
 """Basic arithmetic questions"""
 return [
 {
 'order': 1,
 'question_type': 'arithmetic',
 'question_text': 'What is 15% of 240?',
 'options': ['36', '24', '48', '60', '72'],
 'correct_answer': 'A',
 'difficulty_level': 'easy',
 'scoring_coefficient': 1.0,
 'explanation': '15% of 240 = 0.15 × 240 = 36'
 },
 {
 'order': 2,
 'question_type': 'arithmetic',
 'question_text': 'If a train travels 300 km in 4 hours, what is its average speed?',
 'options': ['75 km/h', '80 km/h', '85 km/h', '90 km/h', '95 km/h'],
 'correct_answer': 'A',
 'difficulty_level': 'easy',
 'scoring_coefficient': 1.0,
 'explanation': 'Speed = Distance ÷ Time = 300 km ÷ 4 hours = 75 km/h'
 },
 {
 'order': 3,
 'question_type': 'arithmetic',
 'question_text': 'What is the value of 3² + 4²?',
 'options': ['25', '49', '7', '12', '5'],
 'correct_answer': 'A',
 'difficulty_level': 'easy',
 'scoring_coefficient': 1.0,
 'explanation': '3² + 4² = 9 + 16 = 25'
 },
 {
 'order': 4,
 'question_type': 'arithmetic',
 'question_text': 'If 5x + 3 = 23, what is the value of x?',
 'options': ['4', '5', '6', '7', '8'],
 'correct_answer': 'A',
 'difficulty_level': 'medium',
 'scoring_coefficient': 1.5,
 'explanation': '5x + 3 = 23, so 5x = 20, therefore x = 4'
 },
 {
 'order': 5,
 'question_type': 'arithmetic',
 'question_text': 'What is the square root of 144?',
 'options': ['12', '14', '16', '18', '20'],
 'correct_answer': 'A',
 'difficulty_level': 'easy',
 'scoring_coefficient': 1.0,
 'explanation': '√144 = 12, since 12² = 144'
 }
 ]

 def get_data_interpretation_questions(self):
 """Data interpretation questions"""
 return [
 {
 'order': 1,
 'question_type': 'data_interpretation',
 'question_text': 'In a survey of 200 people, 60% said they prefer coffee. How many people prefer coffee?',
 'options': ['100', '110', '120', '130', '140'],
 'correct_answer': 'C',
 'difficulty_level': 'easy',
 'scoring_coefficient': 1.0,
 'explanation': '60% of 200 = 0.6 × 200 = 120 people'
 },
 {
 'order': 2,
 'question_type': 'data_interpretation',
 'question_text': 'A company\'s revenue increased from $50,000 to $65,000. What is the percentage increase?',
 'options': ['25%', '30%', '35%', '40%', '45%'],
 'correct_answer': 'B',
 'difficulty_level': 'medium',
 'scoring_coefficient': 1.5,
 'explanation': 'Increase = $65,000 - $50,000 = $15,000. Percentage = (15,000 ÷ 50,000) × 100 = 30%'
 },
 {
 'order': 3,
 'question_type': 'data_interpretation',
 'question_text': 'If the average of 5 numbers is 20, what is their sum?',
 'options': ['80', '90', '100', '110', '120'],
 'correct_answer': 'C',
 'difficulty_level': 'easy',
 'scoring_coefficient': 1.0,
 'explanation': 'Average = Sum ÷ Count, so Sum = Average × Count = 20 × 5 = 100'
 },
 {
 'order': 4,
 'question_type': 'data_interpretation',
 'question_text': 'A store offers a 20% discount on all items. If an item costs $80, what is the sale price?',
 'options': ['$60', '$64', '$68', '$72', '$76'],
 'correct_answer': 'B',
 'difficulty_level': 'medium',
 'scoring_coefficient': 1.5,
 'explanation': 'Discount = 20% of $80 = $16. Sale price = $80 - $16 = $64'
 },
 {
 'order': 5,
 'question_type': 'data_interpretation',
 'question_text': 'In a class of 30 students, 18 are girls. What percentage are boys?',
 'options': ['30%', '35%', '40%', '45%', '50%'],
 'correct_answer': 'C',
 'difficulty_level': 'easy',
 'scoring_coefficient': 1.0,
 'explanation': 'Boys = 30 - 18 = 12. Percentage = (12 ÷ 30) × 100 = 40%'
 }
 ]

 def get_word_problems_questions(self):
 """Word problems questions"""
 return [
 {
 'order': 1,
 'question_type': 'word_problem',
 'question_text': 'A rectangle has a length of 8 cm and width of 6 cm. What is its area?',
 'options': ['48 cm²', '28 cm²', '14 cm²', '24 cm²', '32 cm²'],
 'correct_answer': 'A',
 'difficulty_level': 'easy',
 'scoring_coefficient': 1.0,
 'explanation': 'Area = Length × Width = 8 cm × 6 cm = 48 cm²'
 },
 {
 'order': 2,
 'question_type': 'word_problem',
 'question_text': 'John is 3 times as old as his son. If the son is 8 years old, how old is John?',
 'options': ['24 years', '25 years', '26 years', '27 years', '28 years'],
 'correct_answer': 'A',
 'difficulty_level': 'easy',
 'scoring_coefficient': 1.0,
 'explanation': 'John\'s age = 3 × Son\'s age = 3 × 8 = 24 years'
 },
 {
 'order': 3,
 'question_type': 'word_problem',
 'question_text': 'A car travels 180 km in 3 hours. How far will it travel in 5 hours at the same speed?',
 'options': ['300 km', '320 km', '340 km', '360 km', '380 km'],
 'correct_answer': 'A',
 'difficulty_level': 'medium',
 'scoring_coefficient': 1.5,
 'explanation': 'Speed = 180 km ÷ 3 hours = 60 km/h. Distance in 5 hours = 60 × 5 = 300 km'
 },
 {
 'order': 4,
 'question_type': 'word_problem',
 'question_text': 'If 3 workers can complete a job in 8 days, how many days will it take 6 workers?',
 'options': ['4 days', '5 days', '6 days', '7 days', '8 days'],
 'correct_answer': 'A',
 'difficulty_level': 'hard',
 'scoring_coefficient': 2.0,
 'explanation': 'More workers = less time. 6 workers is 2 times 3 workers, so time is halved: 8 ÷ 2 = 4 days'
 },
 {
 'order': 5,
 'question_type': 'word_problem',
 'question_text': 'A number is increased by 25% and then decreased by 20%. What is the net change?',
 'options': ['No change', '5% increase', '5% decrease', '10% increase', '10% decrease'],
 'correct_answer': 'A',
 'difficulty_level': 'hard',
 'scoring_coefficient': 2.0,
 'explanation': 'Let original = 100. After 25% increase: 125. After 20% decrease: 125 × 0.8 = 100. Net change = 0%'
 }
 ]
