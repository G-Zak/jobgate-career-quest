"""
Django management command to add 30 new numerical reasoning questions
with 3 difficulty levels: easy, medium, hard
"""

from django.core.management.base import BaseCommand
from django.db import transaction
from testsengine.models import Test, Question
import json

class Command(BaseCommand):
 help = 'Add 30 new numerical reasoning questions with 3 difficulty levels'

 def handle(self, *args, **options):
 try:
 # Get the numerical test (ID 21)
 test = Test.objects.get(id=21)
 self.stdout.write(f"Adding questions to test: {test.title}")

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
 # Calculate order (start from existing questions + 1)
 order = test.questions.count() + i

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
 """Return 30 questions with 3 difficulty levels"""
 return [
 # EASY QUESTIONS (1-10)
 {
 'question_text': 'What is 20% of 150?',
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
 'explanation': '20% of 150 = 0.20 × 150 = 30'
 },
 {
 'question_text': 'If a car travels 60 km in 1 hour, how far will it travel in 3 hours?',
 'options': [
 {'option_id': 'A', 'text': '120 km'},
 {'option_id': 'B', 'text': '150 km'},
 {'option_id': 'C', 'text': '180 km'},
 {'option_id': 'D', 'text': '200 km'},
 {'option_id': 'E', 'text': '240 km'}
 ],
 'correct_answer': 'C',
 'difficulty_level': 'easy',
 'complexity_score': 1,
 'explanation': 'Distance = Speed × Time = 60 km/h × 3 h = 180 km'
 },
 {
 'question_text': 'What is 5 × 8 + 3?',
 'options': [
 {'option_id': 'A', 'text': '43'},
 {'option_id': 'B', 'text': '45'},
 {'option_id': 'C', 'text': '47'},
 {'option_id': 'D', 'text': '48'},
 {'option_id': 'E', 'text': '50'}
 ],
 'correct_answer': 'A',
 'difficulty_level': 'easy',
 'complexity_score': 1,
 'explanation': '5 × 8 + 3 = 40 + 3 = 43'
 },
 {
 'question_text': 'If 1 meter = 100 centimeters, how many centimeters are in 2.5 meters?',
 'options': [
 {'option_id': 'A', 'text': '250 cm'},
 {'option_id': 'B', 'text': '200 cm'},
 {'option_id': 'C', 'text': '300 cm'},
 {'option_id': 'D', 'text': '150 cm'},
 {'option_id': 'E', 'text': '350 cm'}
 ],
 'correct_answer': 'A',
 'difficulty_level': 'easy',
 'complexity_score': 1,
 'explanation': '2.5 meters × 100 cm/meter = 250 cm'
 },
 {
 'question_text': 'What is the value of 4²?',
 'options': [
 {'option_id': 'A', 'text': '8'},
 {'option_id': 'B', 'text': '12'},
 {'option_id': 'C', 'text': '16'},
 {'option_id': 'D', 'text': '20'},
 {'option_id': 'E', 'text': '24'}
 ],
 'correct_answer': 'C',
 'difficulty_level': 'easy',
 'complexity_score': 1,
 'explanation': '4² = 4 × 4 = 16'
 },
 {
 'question_text': 'If a pizza is cut into 8 equal slices and you eat 3 slices, what fraction of the pizza did you eat?',
 'options': [
 {'option_id': 'A', 'text': '3/8'},
 {'option_id': 'B', 'text': '1/3'},
 {'option_id': 'C', 'text': '3/5'},
 {'option_id': 'D', 'text': '5/8'},
 {'option_id': 'E', 'text': '2/3'}
 ],
 'correct_answer': 'A',
 'difficulty_level': 'easy',
 'complexity_score': 1,
 'explanation': '3 slices out of 8 total slices = 3/8'
 },
 {
 'question_text': 'What is 12 + 18 - 5?',
 'options': [
 {'option_id': 'A', 'text': '25'},
 {'option_id': 'B', 'text': '30'},
 {'option_id': 'C', 'text': '35'},
 {'option_id': 'D', 'text': '20'},
 {'option_id': 'E', 'text': '15'}
 ],
 'correct_answer': 'A',
 'difficulty_level': 'easy',
 'complexity_score': 1,
 'explanation': '12 + 18 - 5 = 30 - 5 = 25'
 },
 {
 'question_text': 'If a box contains 24 apples and you remove 6 apples, how many apples are left?',
 'options': [
 {'option_id': 'A', 'text': '16'},
 {'option_id': 'B', 'text': '18'},
 {'option_id': 'C', 'text': '20'},
 {'option_id': 'D', 'text': '22'},
 {'option_id': 'E', 'text': '26'}
 ],
 'correct_answer': 'B',
 'difficulty_level': 'easy',
 'complexity_score': 1,
 'explanation': '24 - 6 = 18 apples left'
 },
 {
 'question_text': 'What is 1/4 of 80?',
 'options': [
 {'option_id': 'A', 'text': '15'},
 {'option_id': 'B', 'text': '20'},
 {'option_id': 'C', 'text': '25'},
 {'option_id': 'D', 'text': '30'},
 {'option_id': 'E', 'text': '35'}
 ],
 'correct_answer': 'B',
 'difficulty_level': 'easy',
 'complexity_score': 1,
 'explanation': '1/4 of 80 = 80 ÷ 4 = 20'
 },
 {
 'question_text': 'If you have 15 marbles and you give away 7, how many marbles do you have left?',
 'options': [
 {'option_id': 'A', 'text': '6'},
 {'option_id': 'B', 'text': '7'},
 {'option_id': 'C', 'text': '8'},
 {'option_id': 'D', 'text': '9'},
 {'option_id': 'E', 'text': '10'}
 ],
 'correct_answer': 'C',
 'difficulty_level': 'easy',
 'complexity_score': 1,
 'explanation': '15 - 7 = 8 marbles left'
 },

 # MEDIUM QUESTIONS (11-20)
 {
 'question_text': 'A store offers a 15% discount on all items. If a shirt originally costs $80, what is the sale price?',
 'options': [
 {'option_id': 'A', 'text': '$65'},
 {'option_id': 'B', 'text': '$68'},
 {'option_id': 'C', 'text': '$70'},
 {'option_id': 'D', 'text': '$72'},
 {'option_id': 'E', 'text': '$75'}
 ],
 'correct_answer': 'B',
 'difficulty_level': 'medium',
 'complexity_score': 2,
 'explanation': 'Discount = 15% of $80 = $12. Sale price = $80 - $12 = $68'
 },
 {
 'question_text': 'If 3 workers can complete a job in 8 days, how many days will it take 6 workers to complete the same job?',
 'options': [
 {'option_id': 'A', 'text': '2 days'},
 {'option_id': 'B', 'text': '4 days'},
 {'option_id': 'C', 'text': '6 days'},
 {'option_id': 'D', 'text': '8 days'},
 {'option_id': 'E', 'text': '12 days'}
 ],
 'correct_answer': 'B',
 'difficulty_level': 'medium',
 'complexity_score': 2,
 'explanation': 'More workers = less time. 3 workers × 8 days = 24 worker-days. 24 ÷ 6 workers = 4 days'
 },
 {
 'question_text': 'What is the average of 12, 18, 24, and 30?',
 'options': [
 {'option_id': 'A', 'text': '20'},
 {'option_id': 'B', 'text': '21'},
 {'option_id': 'C', 'text': '22'},
 {'option_id': 'D', 'text': '23'},
 {'option_id': 'E', 'text': '24'}
 ],
 'correct_answer': 'B',
 'difficulty_level': 'medium',
 'complexity_score': 2,
 'explanation': 'Average = (12 + 18 + 24 + 30) ÷ 4 = 84 ÷ 4 = 21'
 },
 {
 'question_text': 'If a rectangle has a length of 12 cm and a width of 8 cm, what is its area?',
 'options': [
 {'option_id': 'A', 'text': '96 cm²'},
 {'option_id': 'B', 'text': '100 cm²'},
 {'option_id': 'C', 'text': '104 cm²'},
 {'option_id': 'D', 'text': '108 cm²'},
 {'option_id': 'E', 'text': '112 cm²'}
 ],
 'correct_answer': 'A',
 'difficulty_level': 'medium',
 'complexity_score': 2,
 'explanation': 'Area = length × width = 12 cm × 8 cm = 96 cm²'
 },
 {
 'question_text': 'A recipe calls for 2 cups of flour for every 3 cups of sugar. If you use 9 cups of sugar, how many cups of flour do you need?',
 'options': [
 {'option_id': 'A', 'text': '4 cups'},
 {'option_id': 'B', 'text': '5 cups'},
 {'option_id': 'C', 'text': '6 cups'},
 {'option_id': 'D', 'text': '7 cups'},
 {'option_id': 'E', 'text': '8 cups'}
 ],
 'correct_answer': 'C',
 'difficulty_level': 'medium',
 'complexity_score': 2,
 'explanation': 'Ratio is 2:3. For 9 cups sugar: 9 ÷ 3 = 3, so 2 × 3 = 6 cups flour'
 },
 {
 'question_text': 'What is 25% of 120 plus 15% of 80?',
 'options': [
 {'option_id': 'A', 'text': '42'},
 {'option_id': 'B', 'text': '45'},
 {'option_id': 'C', 'text': '48'},
 {'option_id': 'D', 'text': '50'},
 {'option_id': 'E', 'text': '52'}
 ],
 'correct_answer': 'A',
 'difficulty_level': 'medium',
 'complexity_score': 2,
 'explanation': '25% of 120 = 30, 15% of 80 = 12. Total = 30 + 12 = 42'
 },
 {
 'question_text': 'If a train travels 240 km in 3 hours, what is its average speed in km/h?',
 'options': [
 {'option_id': 'A', 'text': '70 km/h'},
 {'option_id': 'B', 'text': '75 km/h'},
 {'option_id': 'C', 'text': '80 km/h'},
 {'option_id': 'D', 'text': '85 km/h'},
 {'option_id': 'E', 'text': '90 km/h'}
 ],
 'correct_answer': 'C',
 'difficulty_level': 'medium',
 'complexity_score': 2,
 'explanation': 'Speed = Distance ÷ Time = 240 km ÷ 3 h = 80 km/h'
 },
 {
 'question_text': 'What is the next number in the sequence: 2, 6, 12, 20, 30, ?',
 'options': [
 {'option_id': 'A', 'text': '40'},
 {'option_id': 'B', 'text': '42'},
 {'option_id': 'C', 'text': '44'},
 {'option_id': 'D', 'text': '46'},
 {'option_id': 'E', 'text': '48'}
 ],
 'correct_answer': 'B',
 'difficulty_level': 'medium',
 'complexity_score': 2,
 'explanation': 'Pattern: differences are 4, 6, 8, 10, so next difference is 12. 30 + 12 = 42'
 },
 {
 'question_text': 'If a square has a perimeter of 32 cm, what is its area?',
 'options': [
 {'option_id': 'A', 'text': '64 cm²'},
 {'option_id': 'B', 'text': '72 cm²'},
 {'option_id': 'C', 'text': '80 cm²'},
 {'option_id': 'D', 'text': '88 cm²'},
 {'option_id': 'E', 'text': '96 cm²'}
 ],
 'correct_answer': 'A',
 'difficulty_level': 'medium',
 'complexity_score': 2,
 'explanation': 'Perimeter = 4 × side. 32 = 4s, so s = 8 cm. Area = 8² = 64 cm²'
 },
 {
 'question_text': 'A company has 120 employees. If 30% are managers and 40% are engineers, how many employees are neither managers nor engineers?',
 'options': [
 {'option_id': 'A', 'text': '30'},
 {'option_id': 'B', 'text': '36'},
 {'option_id': 'C', 'text': '42'},
 {'option_id': 'D', 'text': '48'},
 {'option_id': 'E', 'text': '54'}
 ],
 'correct_answer': 'B',
 'difficulty_level': 'medium',
 'complexity_score': 2,
 'explanation': 'Managers: 30% of 120 = 36. Engineers: 40% of 120 = 48. Neither: 120 - 36 - 48 = 36'
 },

 # HARD QUESTIONS (21-30)
 {
 'question_text': 'A bank offers 5% annual interest. If you invest $1000, how much will you have after 2 years with compound interest?',
 'options': [
 {'option_id': 'A', 'text': '$1100'},
 {'option_id': 'B', 'text': '$1102.50'},
 {'option_id': 'C', 'text': '$1105'},
 {'option_id': 'D', 'text': '$1107.50'},
 {'option_id': 'E', 'text': '$1110'}
 ],
 'correct_answer': 'B',
 'difficulty_level': 'hard',
 'complexity_score': 3,
 'explanation': 'Year 1: $1000 × 1.05 = $1050. Year 2: $1050 × 1.05 = $1102.50'
 },
 {
 'question_text': 'If 2x + 3y = 15 and x - y = 3, what is the value of x?',
 'options': [
 {'option_id': 'A', 'text': '3'},
 {'option_id': 'B', 'text': '4'},
 {'option_id': 'C', 'text': '5'},
 {'option_id': 'D', 'text': '6'},
 {'option_id': 'E', 'text': '7'}
 ],
 'correct_answer': 'B',
 'difficulty_level': 'hard',
 'complexity_score': 3,
 'explanation': 'From x - y = 3, we get y = x - 3. Substituting: 2x + 3(x - 3) = 15, so 5x - 9 = 15, x = 4.8'
 },
 {
 'question_text': 'A cube has a volume of 125 cubic centimeters. What is the length of one edge?',
 'options': [
 {'option_id': 'A', 'text': '3 cm'},
 {'option_id': 'B', 'text': '4 cm'},
 {'option_id': 'C', 'text': '5 cm'},
 {'option_id': 'D', 'text': '6 cm'},
 {'option_id': 'E', 'text': '7 cm'}
 ],
 'correct_answer': 'C',
 'difficulty_level': 'hard',
 'complexity_score': 3,
 'explanation': 'Volume = edge³. 125 = edge³, so edge = ∛125 = 5 cm'
 },
 {
 'question_text': 'If a clock shows 3:15, what is the angle between the hour and minute hands?',
 'options': [
 {'option_id': 'A', 'text': '0°'},
 {'option_id': 'B', 'text': '7.5°'},
 {'option_id': 'C', 'text': '15°'},
 {'option_id': 'D', 'text': '22.5°'},
 {'option_id': 'E', 'text': '30°'}
 ],
 'correct_answer': 'B',
 'difficulty_level': 'hard',
 'complexity_score': 3,
 'explanation': 'Hour hand at 3:15 is 1/4 of the way from 3 to 4. 30° × 1/4 = 7.5° from 3. Minute hand at 3 = 90°. Difference = 90° - 7.5° = 82.5°, but the smaller angle is 7.5°'
 },
 {
 'question_text': 'A store sells items at a 25% markup. If the cost price is $80, what is the selling price?',
 'options': [
 {'option_id': 'A', 'text': '$95'},
 {'option_id': 'B', 'text': '$100'},
 {'option_id': 'C', 'text': '$105'},
 {'option_id': 'D', 'text': '$110'},
 {'option_id': 'E', 'text': '$115'}
 ],
 'correct_answer': 'B',
 'difficulty_level': 'hard',
 'complexity_score': 3,
 'explanation': 'Markup = 25% of $80 = $20. Selling price = $80 + $20 = $100'
 },
 {
 'question_text': 'What is the probability of rolling a sum of 7 with two dice?',
 'options': [
 {'option_id': 'A', 'text': '1/6'},
 {'option_id': 'B', 'text': '1/12'},
 {'option_id': 'C', 'text': '1/18'},
 {'option_id': 'D', 'text': '1/36'},
 {'option_id': 'E', 'text': '1/9'}
 ],
 'correct_answer': 'A',
 'difficulty_level': 'hard',
 'complexity_score': 3,
 'explanation': 'Ways to get 7: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) = 6 ways. Total outcomes = 36. Probability = 6/36 = 1/6'
 },
 {
 'question_text': 'If a right triangle has legs of 6 cm and 8 cm, what is the length of the hypotenuse?',
 'options': [
 {'option_id': 'A', 'text': '9 cm'},
 {'option_id': 'B', 'text': '10 cm'},
 {'option_id': 'C', 'text': '11 cm'},
 {'option_id': 'D', 'text': '12 cm'},
 {'option_id': 'E', 'text': '13 cm'}
 ],
 'correct_answer': 'B',
 'difficulty_level': 'hard',
 'complexity_score': 3,
 'explanation': 'Using Pythagorean theorem: c² = a² + b² = 6² + 8² = 36 + 64 = 100. So c = √100 = 10 cm'
 },
 {
 'question_text': 'A sequence starts with 1, 1, 2, 3, 5, 8, 13, ... What is the 10th term?',
 'options': [
 {'option_id': 'A', 'text': '34'},
 {'option_id': 'B', 'text': '55'},
 {'option_id': 'C', 'text': '89'},
 {'option_id': 'D', 'text': '144'},
 {'option_id': 'E', 'text': '233'}
 ],
 'correct_answer': 'B',
 'difficulty_level': 'hard',
 'complexity_score': 3,
 'explanation': 'Fibonacci sequence: each term is the sum of the two preceding terms. 8th: 21, 9th: 34, 10th: 55'
 },
 {
 'question_text': 'If 3x + 2y = 18 and x + y = 8, what is the value of y?',
 'options': [
 {'option_id': 'A', 'text': '2'},
 {'option_id': 'B', 'text': '3'},
 {'option_id': 'C', 'text': '4'},
 {'option_id': 'D', 'text': '5'},
 {'option_id': 'E', 'text': '6'}
 ],
 'correct_answer': 'E',
 'difficulty_level': 'hard',
 'complexity_score': 3,
 'explanation': 'From x + y = 8, we get x = 8 - y. Substituting: 3(8 - y) + 2y = 18, so 24 - 3y + 2y = 18, -y = -6, y = 6'
 },
 {
 'question_text': 'A circle has a radius of 7 cm. What is its area? (Use π = 22/7)',
 'options': [
 {'option_id': 'A', 'text': '154 cm²'},
 {'option_id': 'B', 'text': '154.5 cm²'},
 {'option_id': 'C', 'text': '155 cm²'},
 {'option_id': 'D', 'text': '155.5 cm²'},
 {'option_id': 'E', 'text': '156 cm²'}
 ],
 'correct_answer': 'A',
 'difficulty_level': 'hard',
 'complexity_score': 3,
 'explanation': 'Area = πr² = (22/7) × 7² = (22/7) × 49 = 22 × 7 = 154 cm²'
 }
 ]
