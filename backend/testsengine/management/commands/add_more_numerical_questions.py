"""
Django management command to add 30 more numerical reasoning questions
with 3 difficulty levels: easy, medium, hard
"""

from django.core.management.base import BaseCommand
from django.db import transaction, models
from testsengine.models import Test, Question
import json

class Command(BaseCommand):
 help = 'Add 30 more numerical reasoning questions with 3 difficulty levels'

 def handle(self, *args, **options):
 try:
 # Get the numerical test (ID 21)
 test = Test.objects.get(id=21)
 self.stdout.write(f"Adding more questions to test: {test.title}")

 with transaction.atomic():
 # Add 30 new questions
 questions_added = self.add_questions(test)

 self.stdout.write(
 self.style.SUCCESS(
 f'Successfully added {questions_added} questions to {test.title}'
 )
 )

 # Update test total questions count
 test.total_questions = test.questions.count()
 test.save()

 self.stdout.write(f"Updated total questions count to: {test.total_questions}")

 except Test.DoesNotExist:
 self.stdout.write(
 self.style.ERROR('Numerical test (ID 21) not found!')
 )
 except Exception as e:
 self.stdout.write(
 self.style.ERROR(f'Error adding questions: {str(e)}')
 )

 def add_questions(self, test):
 """Add 30 questions with 3 difficulty levels"""
 questions_data = self.get_questions_data()
 questions_added = 0

 for i, question_data in enumerate(questions_data, start=1):
 # Calculate order (start from the highest existing order + 1)
 max_order = test.questions.aggregate(max_order=models.Max('order'))['max_order'] or 0
 order = max_order + i

 question = Question.objects.create(
 test=test,
 question_text=question_data['question_text'],
 options=question_data['options'],
 correct_answer=question_data['correct_answer'],
 difficulty_level=question_data['difficulty_level'],
 explanation=question_data.get('explanation', ''),
 order=order,
 question_type='multiple_choice',
 complexity_score=question_data.get('complexity_score', 1)
 )

 questions_added += 1
 self.stdout.write(f"Added question {i}: {question_data['question_text'][:50]}...")

 return questions_added

 def get_questions_data(self):
 """Return 30 more questions with 3 difficulty levels"""
 return [
 # EASY QUESTIONS (31-40)
 {
 'question_text': 'What is 30% of 200?',
 'options': [
 {'option_id': 'A', 'text': '50'},
 {'option_id': 'B', 'text': '60'},
 {'option_id': 'C', 'text': '70'},
 {'option_id': 'D', 'text': '80'},
 {'option_id': 'E', 'text': '90'}
 ],
 'correct_answer': 'B',
 'difficulty_level': 'easy',
 'complexity_score': 1,
 'explanation': '30% of 200 = 0.30 × 200 = 60'
 },
 {
 'question_text': 'If a book has 150 pages and you read 30 pages, what fraction have you read?',
 'options': [
 {'option_id': 'A', 'text': '1/3'},
 {'option_id': 'B', 'text': '1/4'},
 {'option_id': 'C', 'text': '1/5'},
 {'option_id': 'D', 'text': '1/6'},
 {'option_id': 'E', 'text': '2/5'}
 ],
 'correct_answer': 'C',
 'difficulty_level': 'easy',
 'complexity_score': 1,
 'explanation': '30 pages out of 150 = 30/150 = 1/5'
 },
 {
 'question_text': 'What is 7 × 6 - 8?',
 'options': [
 {'option_id': 'A', 'text': '32'},
 {'option_id': 'B', 'text': '34'},
 {'option_id': 'C', 'text': '36'},
 {'option_id': 'D', 'text': '38'},
 {'option_id': 'E', 'text': '40'}
 ],
 'correct_answer': 'B',
 'difficulty_level': 'easy',
 'complexity_score': 1,
 'explanation': '7 × 6 - 8 = 42 - 8 = 34'
 },
 {
 'question_text': 'If 1 kilogram = 1000 grams, how many grams are in 2.5 kilograms?',
 'options': [
 {'option_id': 'A', 'text': '2500 g'},
 {'option_id': 'B', 'text': '2000 g'},
 {'option_id': 'C', 'text': '3000 g'},
 {'option_id': 'D', 'text': '1500 g'},
 {'option_id': 'E', 'text': '3500 g'}
 ],
 'correct_answer': 'A',
 'difficulty_level': 'easy',
 'complexity_score': 1,
 'explanation': '2.5 kilograms × 1000 g/kg = 2500 g'
 },
 {
 'question_text': 'What is the value of 6²?',
 'options': [
 {'option_id': 'A', 'text': '30'},
 {'option_id': 'B', 'text': '32'},
 {'option_id': 'C', 'text': '34'},
 {'option_id': 'D', 'text': '36'},
 {'option_id': 'E', 'text': '38'}
 ],
 'correct_answer': 'D',
 'difficulty_level': 'easy',
 'complexity_score': 1,
 'explanation': '6² = 6 × 6 = 36'
 },
 {
 'question_text': 'If you have 20 coins and you spend 8 coins, how many coins do you have left?',
 'options': [
 {'option_id': 'A', 'text': '10'},
 {'option_id': 'B', 'text': '11'},
 {'option_id': 'C', 'text': '12'},
 {'option_id': 'D', 'text': '13'},
 {'option_id': 'E', 'text': '14'}
 ],
 'correct_answer': 'C',
 'difficulty_level': 'easy',
 'complexity_score': 1,
 'explanation': '20 - 8 = 12 coins left'
 },
 {
 'question_text': 'What is 3/4 of 80?',
 'options': [
 {'option_id': 'A', 'text': '50'},
 {'option_id': 'B', 'text': '55'},
 {'option_id': 'C', 'text': '60'},
 {'option_id': 'D', 'text': '65'},
 {'option_id': 'E', 'text': '70'}
 ],
 'correct_answer': 'C',
 'difficulty_level': 'easy',
 'complexity_score': 1,
 'explanation': '3/4 of 80 = (3 × 80) ÷ 4 = 240 ÷ 4 = 60'
 },
 {
 'question_text': 'If a triangle has a base of 10 cm and height of 6 cm, what is its area?',
 'options': [
 {'option_id': 'A', 'text': '30 cm²'},
 {'option_id': 'B', 'text': '32 cm²'},
 {'option_id': 'C', 'text': '34 cm²'},
 {'option_id': 'D', 'text': '36 cm²'},
 {'option_id': 'E', 'text': '38 cm²'}
 ],
 'correct_answer': 'A',
 'difficulty_level': 'easy',
 'complexity_score': 1,
 'explanation': 'Area = (base × height) ÷ 2 = (10 × 6) ÷ 2 = 60 ÷ 2 = 30 cm²'
 },
 {
 'question_text': 'What is 15 + 25 - 10?',
 'options': [
 {'option_id': 'A', 'text': '25'},
 {'option_id': 'B', 'text': '30'},
 {'option_id': 'C', 'text': '35'},
 {'option_id': 'D', 'text': '40'},
 {'option_id': 'E', 'text': '45'}
 ],
 'correct_answer': 'B',
 'difficulty_level': 'easy',
 'complexity_score': 1,
 'explanation': '15 + 25 - 10 = 40 - 10 = 30'
 },
 {
 'question_text': 'If a box contains 36 pencils and you take out 9 pencils, how many pencils are left?',
 'options': [
 {'option_id': 'A', 'text': '25'},
 {'option_id': 'B', 'text': '26'},
 {'option_id': 'C', 'text': '27'},
 {'option_id': 'D', 'text': '28'},
 {'option_id': 'E', 'text': '29'}
 ],
 'correct_answer': 'C',
 'difficulty_level': 'easy',
 'complexity_score': 1,
 'explanation': '36 - 9 = 27 pencils left'
 },

 # MEDIUM QUESTIONS (41-50)
 {
 'question_text': 'A restaurant bill is $120. If you want to leave a 18% tip, how much should you pay in total?',
 'options': [
 {'option_id': 'A', 'text': '$138.60'},
 {'option_id': 'B', 'text': '$141.60'},
 {'option_id': 'C', 'text': '$144.60'},
 {'option_id': 'D', 'text': '$147.60'},
 {'option_id': 'E', 'text': '$150.60'}
 ],
 'correct_answer': 'B',
 'difficulty_level': 'medium',
 'complexity_score': 2,
 'explanation': 'Tip = 18% of $120 = $21.60. Total = $120 + $21.60 = $141.60'
 },
 {
 'question_text': 'If 4 machines can produce 200 items in 5 hours, how many items can 6 machines produce in 8 hours?',
 'options': [
 {'option_id': 'A', 'text': '480'},
 {'option_id': 'B', 'text': '500'},
 {'option_id': 'C', 'text': '520'},
 {'option_id': 'D', 'text': '540'},
 {'option_id': 'E', 'text': '560'}
 ],
 'correct_answer': 'A',
 'difficulty_level': 'medium',
 'complexity_score': 2,
 'explanation': 'Rate per machine = 200 ÷ (4 × 5) = 10 items/hour. 6 machines × 8 hours × 10 = 480 items'
 },
 {
 'question_text': 'What is the median of 8, 12, 15, 18, 22, 25, 30?',
 'options': [
 {'option_id': 'A', 'text': '15'},
 {'option_id': 'B', 'text': '18'},
 {'option_id': 'C', 'text': '20'},
 {'option_id': 'D', 'text': '22'},
 {'option_id': 'E', 'text': '25'}
 ],
 'correct_answer': 'B',
 'difficulty_level': 'medium',
 'complexity_score': 2,
 'explanation': 'Median is the middle value when arranged in order. With 7 numbers, the 4th value is 18'
 },
 {
 'question_text': 'A circle has a diameter of 14 cm. What is its circumference? (Use π = 22/7)',
 'options': [
 {'option_id': 'A', 'text': '44 cm'},
 {'option_id': 'B', 'text': '46 cm'},
 {'option_id': 'C', 'text': '48 cm'},
 {'option_id': 'D', 'text': '50 cm'},
 {'option_id': 'E', 'text': '52 cm'}
 ],
 'correct_answer': 'A',
 'difficulty_level': 'medium',
 'complexity_score': 2,
 'explanation': 'Circumference = π × diameter = (22/7) × 14 = 22 × 2 = 44 cm'
 },
 {
 'question_text': 'If the ratio of boys to girls in a class is 3:2 and there are 30 students total, how many boys are there?',
 'options': [
 {'option_id': 'A', 'text': '12'},
 {'option_id': 'B', 'text': '15'},
 {'option_id': 'C', 'text': '18'},
 {'option_id': 'D', 'text': '20'},
 {'option_id': 'E', 'text': '22'}
 ],
 'correct_answer': 'C',
 'difficulty_level': 'medium',
 'complexity_score': 2,
 'explanation': 'Ratio 3:2 means 3/5 are boys. 3/5 of 30 = (3 × 30) ÷ 5 = 90 ÷ 5 = 18 boys'
 },
 {
 'question_text': 'What is 40% of 150 plus 25% of 80?',
 'options': [
 {'option_id': 'A', 'text': '80'},
 {'option_id': 'B', 'text': '85'},
 {'option_id': 'C', 'text': '90'},
 {'option_id': 'D', 'text': '95'},
 {'option_id': 'E', 'text': '100'}
 ],
 'correct_answer': 'A',
 'difficulty_level': 'medium',
 'complexity_score': 2,
 'explanation': '40% of 150 = 60, 25% of 80 = 20. Total = 60 + 20 = 80'
 },
 {
 'question_text': 'If a car travels 180 km in 2.5 hours, what is its average speed in km/h?',
 'options': [
 {'option_id': 'A', 'text': '70 km/h'},
 {'option_id': 'B', 'text': '72 km/h'},
 {'option_id': 'C', 'text': '75 km/h'},
 {'option_id': 'D', 'text': '78 km/h'},
 {'option_id': 'E', 'text': '80 km/h'}
 ],
 'correct_answer': 'B',
 'difficulty_level': 'medium',
 'complexity_score': 2,
 'explanation': 'Speed = Distance ÷ Time = 180 km ÷ 2.5 h = 72 km/h'
 },
 {
 'question_text': 'What is the next number in the sequence: 1, 4, 9, 16, 25, ?',
 'options': [
 {'option_id': 'A', 'text': '30'},
 {'option_id': 'B', 'text': '32'},
 {'option_id': 'C', 'text': '34'},
 {'option_id': 'D', 'text': '36'},
 {'option_id': 'E', 'text': '38'}
 ],
 'correct_answer': 'D',
 'difficulty_level': 'medium',
 'complexity_score': 2,
 'explanation': 'Perfect squares: 1², 2², 3², 4², 5², so next is 6² = 36'
 },
 {
 'question_text': 'If a rectangle has a length of 15 cm and a width of 8 cm, what is its perimeter?',
 'options': [
 {'option_id': 'A', 'text': '44 cm'},
 {'option_id': 'B', 'text': '46 cm'},
 {'option_id': 'C', 'text': '48 cm'},
 {'option_id': 'D', 'text': '50 cm'},
 {'option_id': 'E', 'text': '52 cm'}
 ],
 'correct_answer': 'B',
 'difficulty_level': 'medium',
 'complexity_score': 2,
 'explanation': 'Perimeter = 2(length + width) = 2(15 + 8) = 2 × 23 = 46 cm'
 },
 {
 'question_text': 'A store has 240 items. If 35% are sold, how many items remain?',
 'options': [
 {'option_id': 'A', 'text': '144'},
 {'option_id': 'B', 'text': '148'},
 {'option_id': 'C', 'text': '152'},
 {'option_id': 'D', 'text': '156'},
 {'option_id': 'E', 'text': '160'}
 ],
 'correct_answer': 'D',
 'difficulty_level': 'medium',
 'complexity_score': 2,
 'explanation': '35% sold means 65% remain. 65% of 240 = 0.65 × 240 = 156 items'
 },

 # HARD QUESTIONS (51-60)
 {
 'question_text': 'A bank offers 6% annual interest compounded quarterly. If you invest $2000, how much will you have after 1 year?',
 'options': [
 {'option_id': 'A', 'text': '$2122.73'},
 {'option_id': 'B', 'text': '$2123.60'},
 {'option_id': 'C', 'text': '$2124.50'},
 {'option_id': 'D', 'text': '$2125.40'},
 {'option_id': 'E', 'text': '$2126.30'}
 ],
 'correct_answer': 'A',
 'difficulty_level': 'hard',
 'complexity_score': 3,
 'explanation': 'Quarterly rate = 6% ÷ 4 = 1.5%. Amount = $2000 × (1.015)⁴ = $2000 × 1.06136 = $2122.73'
 },
 {
 'question_text': 'If 3x + 4y = 20 and 2x - y = 5, what is the value of x + y?',
 'options': [
 {'option_id': 'A', 'text': '5'},
 {'option_id': 'B', 'text': '6'},
 {'option_id': 'C', 'text': '7'},
 {'option_id': 'D', 'text': '8'},
 {'option_id': 'E', 'text': '9'}
 ],
 'correct_answer': 'C',
 'difficulty_level': 'hard',
 'complexity_score': 3,
 'explanation': 'From 2x - y = 5, we get y = 2x - 5. Substituting: 3x + 4(2x - 5) = 20, so 11x - 20 = 20, x = 40/11 ≈ 3.64, y ≈ 2.27, x + y ≈ 5.91 ≈ 6'
 },
 {
 'question_text': 'A sphere has a radius of 6 cm. What is its volume? (Use π = 3.14)',
 'options': [
 {'option_id': 'A', 'text': '904.32 cm³'},
 {'option_id': 'B', 'text': '905.32 cm³'},
 {'option_id': 'C', 'text': '906.32 cm³'},
 {'option_id': 'D', 'text': '907.32 cm³'},
 {'option_id': 'E', 'text': '908.32 cm³'}
 ],
 'correct_answer': 'A',
 'difficulty_level': 'hard',
 'complexity_score': 3,
 'explanation': 'Volume = (4/3)πr³ = (4/3) × 3.14 × 6³ = (4/3) × 3.14 × 216 = 904.32 cm³'
 },
 {
 'question_text': 'If a clock shows 2:30, what is the angle between the hour and minute hands?',
 'options': [
 {'option_id': 'A', 'text': '105°'},
 {'option_id': 'B', 'text': '110°'},
 {'option_id': 'C', 'text': '115°'},
 {'option_id': 'D', 'text': '120°'},
 {'option_id': 'E', 'text': '125°'}
 ],
 'correct_answer': 'A',
 'difficulty_level': 'hard',
 'complexity_score': 3,
 'explanation': 'Hour hand at 2:30 is 2.5 × 30° = 75° from 12. Minute hand at 6 = 180°. Difference = 180° - 75° = 105°'
 },
 {
 'question_text': 'A company sells items at a 40% markup. If the selling price is $140, what is the cost price?',
 'options': [
 {'option_id': 'A', 'text': '$95'},
 {'option_id': 'B', 'text': '$98'},
 {'option_id': 'C', 'text': '$100'},
 {'option_id': 'D', 'text': '$102'},
 {'option_id': 'E', 'text': '$105'}
 ],
 'correct_answer': 'C',
 'difficulty_level': 'hard',
 'complexity_score': 3,
 'explanation': 'If cost price is C, then selling price = C + 0.4C = 1.4C. So 1.4C = $140, C = $140 ÷ 1.4 = $100'
 },
 {
 'question_text': 'What is the probability of rolling two dice and getting a sum of 8?',
 'options': [
 {'option_id': 'A', 'text': '5/36'},
 {'option_id': 'B', 'text': '1/6'},
 {'option_id': 'C', 'text': '7/36'},
 {'option_id': 'D', 'text': '1/4'},
 {'option_id': 'E', 'text': '2/9'}
 ],
 'correct_answer': 'A',
 'difficulty_level': 'hard',
 'complexity_score': 3,
 'explanation': 'Ways to get 8: (2,6), (3,5), (4,4), (5,3), (6,2) = 5 ways. Total outcomes = 36. Probability = 5/36'
 },
 {
 'question_text': 'If a right triangle has legs of 9 cm and 12 cm, what is the length of the hypotenuse?',
 'options': [
 {'option_id': 'A', 'text': '13 cm'},
 {'option_id': 'B', 'text': '14 cm'},
 {'option_id': 'C', 'text': '15 cm'},
 {'option_id': 'D', 'text': '16 cm'},
 {'option_id': 'E', 'text': '17 cm'}
 ],
 'correct_answer': 'C',
 'difficulty_level': 'hard',
 'complexity_score': 3,
 'explanation': 'Using Pythagorean theorem: c² = a² + b² = 9² + 12² = 81 + 144 = 225. So c = √225 = 15 cm'
 },
 {
 'question_text': 'A sequence starts with 2, 6, 18, 54, 162, ... What is the 8th term?',
 'options': [
 {'option_id': 'A', 'text': '4374'},
 {'option_id': 'B', 'text': '4860'},
 {'option_id': 'C', 'text': '5346'},
 {'option_id': 'D', 'text': '5832'},
 {'option_id': 'E', 'text': '6318'}
 ],
 'correct_answer': 'A',
 'difficulty_level': 'hard',
 'complexity_score': 3,
 'explanation': 'Geometric sequence with ratio 3. 6th: 486, 7th: 1458, 8th: 4374'
 },
 {
 'question_text': 'If 4x + 3y = 25 and x + 2y = 10, what is the value of x - y?',
 'options': [
 {'option_id': 'A', 'text': '1'},
 {'option_id': 'B', 'text': '2'},
 {'option_id': 'C', 'text': '3'},
 {'option_id': 'D', 'text': '4'},
 {'option_id': 'E', 'text': '5'}
 ],
 'correct_answer': 'B',
 'difficulty_level': 'hard',
 'complexity_score': 3,
 'explanation': 'From x + 2y = 10, we get x = 10 - 2y. Substituting: 4(10 - 2y) + 3y = 25, so 40 - 8y + 3y = 25, -5y = -15, y = 3, x = 4, x - y = 1'
 },
 {
 'question_text': 'A cylinder has a radius of 5 cm and height of 12 cm. What is its volume? (Use π = 3.14)',
 'options': [
 {'option_id': 'A', 'text': '942 cm³'},
 {'option_id': 'B', 'text': '944 cm³'},
 {'option_id': 'C', 'text': '946 cm³'},
 {'option_id': 'D', 'text': '948 cm³'},
 {'option_id': 'E', 'text': '950 cm³'}
 ],
 'correct_answer': 'A',
 'difficulty_level': 'hard',
 'complexity_score': 3,
 'explanation': 'Volume = πr²h = 3.14 × 5² × 12 = 3.14 × 25 × 12 = 942 cm³'
 }
 ]
