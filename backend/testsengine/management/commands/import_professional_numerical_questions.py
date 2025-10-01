"""
Import professional numerical reasoning questions with translations
"""
from django.core.management.base import BaseCommand
from django.db import transaction
from testsengine.models import Test, Question
from testsengine.models_i18n import (
 QuestionTranslation, NumericalTestCategory, NumericalQuestionExtension
)
import json

class Command(BaseCommand):
 help = 'Import professional numerical reasoning questions with translations'

 def add_arguments(self, parser):
 parser.add_argument(
 '--test-id',
 type=int,
 default=21,
 help='Test ID to import questions to (default: 21)',
 )

 def handle(self, *args, **options):
 test_id = options['test_id']

 try:
 test = Test.objects.get(id=test_id)
 self.stdout.write(f'Importing questions to: {test.title}')

 with transaction.atomic():
 # Clear existing questions
 test.questions.all().delete()

 # Import new professional questions
 questions_created = self.import_questions(test)

 # Update test metadata
 test.total_questions = questions_created
 test.save()

 self.stdout.write(
 self.style.SUCCESS(
 f'Successfully imported {questions_created} professional questions'
 )
 )

 except Test.DoesNotExist:
 self.stdout.write(
 self.style.ERROR(f'Test with ID {test_id} not found!')
 )

 def import_questions(self, test):
 """Import professional numerical questions"""
 questions_data = self.get_professional_questions()
 questions_created = 0

 for q_data in questions_data:
 # Create the main question
 question = Question.objects.create(
 test=test,
 question_type='multiple_choice',
 question_text=q_data['en']['question_text'],
 options=q_data['en']['options'],
 correct_answer=q_data['correct_answer'],
 explanation=q_data['en']['explanation'],
 difficulty_level=q_data['difficulty_level'],
 order=q_data['order']
 )

 # Create translations
 for lang in ['en', 'fr']:
 QuestionTranslation.objects.create(
 question=question,
 language=lang,
 question_text=q_data[lang]['question_text'],
 options=q_data[lang]['options'],
 explanation=q_data[lang]['explanation']
 )

 # Create numerical extension
 category = NumericalTestCategory.objects.get(name=q_data['category'])
 NumericalQuestionExtension.objects.create(
 question=question,
 category=category,
 calculation_steps=q_data.get('calculation_steps', []),
 formula_used=q_data.get('formula_used', ''),
 requires_calculator=q_data.get('requires_calculator', False),
 multiple_steps=q_data.get('multiple_steps', False),
 average_time_seconds=q_data.get('time_limit', 90)
 )

 questions_created += 1

 return questions_created

 def get_professional_questions(self):
 """Professional numerical reasoning questions with translations"""
 return [
 # Easy Level - Basic Arithmetic
 {
 'order': 1,
 'difficulty_level': 'easy',
 'category': 'basic_arithmetic',
 'correct_answer': 'B',
 'formula_used': 'Distance = Speed × Time',
 'calculation_steps': ['60 × 2.5', '= 150'],
 'time_limit': 60,
 'en': {
 'question_text': 'A car travels at 60 km/h for 2.5 hours. What distance does it cover?',
 'options': [
 {'id': 'A', 'text': '120 km'},
 {'id': 'B', 'text': '150 km'},
 {'id': 'C', 'text': '180 km'},
 {'id': 'D', 'text': '200 km'}
 ],
 'explanation': 'Distance = Speed × Time = 60 km/h × 2.5 h = 150 km'
 },
 'fr': {
 'question_text': 'Une voiture roule à 60 km/h pendant 2,5 heures. Quelle distance parcourt-elle ?',
 'options': [
 {'id': 'A', 'text': '120 km'},
 {'id': 'B', 'text': '150 km'},
 {'id': 'C', 'text': '180 km'},
 {'id': 'D', 'text': '200 km'}
 ],
 'explanation': 'Distance = Vitesse × Temps = 60 km/h × 2,5 h = 150 km'
 }
 },
 {
 'order': 2,
 'difficulty_level': 'easy',
 'category': 'percentages',
 'correct_answer': 'A',
 'formula_used': 'Percentage = (Part/Whole) × 100',
 'calculation_steps': ['15% of 240', '0.15 × 240', '= 36'],
 'time_limit': 60,
 'en': {
 'question_text': 'What is 15% of 240?',
 'options': [
 {'id': 'A', 'text': '36'},
 {'id': 'B', 'text': '24'},
 {'id': 'C', 'text': '48'},
 {'id': 'D', 'text': '60'}
 ],
 'explanation': '15% of 240 = 0.15 × 240 = 36'
 },
 'fr': {
 'question_text': 'Combien font 15% de 240 ?',
 'options': [
 {'id': 'A', 'text': '36'},
 {'id': 'B', 'text': '24'},
 {'id': 'C', 'text': '48'},
 {'id': 'D', 'text': '60'}
 ],
 'explanation': '15% de 240 = 0,15 × 240 = 36'
 }
 },

 # Medium Level - Word Problems
 {
 'order': 9,
 'difficulty_level': 'medium',
 'category': 'word_problems',
 'correct_answer': 'C',
 'formula_used': 'Profit = Selling Price - Cost Price',
 'calculation_steps': ['Cost: €800', 'Selling: €800 + 25%', '€800 × 1.25 = €1000', 'Profit = €1000 - €800 = €200'],
 'multiple_steps': True,
 'time_limit': 120,
 'en': {
 'question_text': 'A shopkeeper buys an item for €800 and sells it at a 25% profit. What is the profit amount?',
 'options': [
 {'id': 'A', 'text': '€150'},
 {'id': 'B', 'text': '€180'},
 {'id': 'C', 'text': '€200'},
 {'id': 'D', 'text': '€250'}
 ],
 'explanation': 'Selling price = €800 × 1.25 = €1000. Profit = €1000 - €800 = €200'
 },
 'fr': {
 'question_text': 'Un commerçant achète un article pour 800€ et le vend avec un bénéfice de 25%. Quel est le montant du bénéfice ?',
 'options': [
 {'id': 'A', 'text': '150€'},
 {'id': 'B', 'text': '180€'},
 {'id': 'C', 'text': '200€'},
 {'id': 'D', 'text': '250€'}
 ],
 'explanation': 'Prix de vente = 800€ × 1,25 = 1000€. Bénéfice = 1000€ - 800€ = 200€'
 }
 },

 # Hard Level - Data Interpretation
 {
 'order': 17,
 'difficulty_level': 'hard',
 'category': 'data_interpretation',
 'correct_answer': 'B',
 'formula_used': 'Percentage Change = ((New - Old) / Old) × 100',
 'calculation_steps': [
 'Q1 Sales: 120 + 95 + 105 + 130 = 450',
 'Q3 Sales: 145 + 110 + 115 + 140 = 510',
 'Change: (510 - 450) / 450 × 100',
 '= 60/450 × 100 = 13.33%'
 ],
 'multiple_steps': True,
 'data_interpretation_required': True,
 'time_limit': 180,
 'data_table': {
 'title': 'Quarterly Sales Data (in thousands)',
 'headers': ['Product', 'Q1', 'Q2', 'Q3', 'Q4'],
 'rows': [
 ['Product A', 120, 135, 145, 150],
 ['Product B', 95, 105, 110, 125],
 ['Product C', 105, 110, 115, 120],
 ['Product D', 130, 135, 140, 145]
 ]
 },
 'en': {
 'question_text': 'Based on the quarterly sales data table, what is the percentage increase in total sales from Q1 to Q3?',
 'options': [
 {'id': 'A', 'text': '11.5%'},
 {'id': 'B', 'text': '13.3%'},
 {'id': 'C', 'text': '15.2%'},
 {'id': 'D', 'text': '17.8%'}
 ],
 'explanation': 'Q1 total: 450k, Q3 total: 510k. Increase: (510-450)/450 × 100 = 13.33%'
 },
 'fr': {
 'question_text': 'Basé sur le tableau des ventes trimestrielles, quel est le pourcentage d\'augmentation des ventes totales du T1 au T3 ?',
 'options': [
 {'id': 'A', 'text': '11,5%'},
 {'id': 'B', 'text': '13,3%'},
 {'id': 'C', 'text': '15,2%'},
 {'id': 'D', 'text': '17,8%'}
 ],
 'explanation': 'Total T1: 450k, Total T3: 510k. Augmentation: (510-450)/450 × 100 = 13,33%'
 }
 }
 ]
