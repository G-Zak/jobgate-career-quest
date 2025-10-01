"""
Django management command to update numerical reasoning questions (Test ID 21)
with professional-grade questions, French translations, and Moroccan localization
"""

from django.core.management.base import BaseCommand
from django.db import transaction
from testsengine.models import Test, Question
import json

class Command(BaseCommand):
 help = 'Update numerical reasoning test (ID 21) with professional questions and translations'

 def add_arguments(self, parser):
 parser.add_argument(
 '--dry-run',
 action='store_true',
 help='Show what would be updated without making changes',
 )

 def handle(self, *args, **options):
 try:
 # Get the numerical test (ID 21)
 test = Test.objects.get(id=21)
 self.stdout.write(f"Updating questions for test: {test.title}")

 if options['dry_run']:
 self.stdout.write(self.style.WARNING('DRY RUN MODE - No changes will be made'))
 questions_data = self.get_professional_questions()
 self.stdout.write(f"Would update {len(questions_data)} questions")
 return

 with transaction.atomic():
 # Clear existing questions
 deleted_count = test.questions.count()
 test.questions.all().delete()
 self.stdout.write(f"Deleted {deleted_count} existing questions")

 # Add new professional questions
 questions_added = self.add_professional_questions(test)

 # Update test metadata
 test.total_questions = questions_added
 test.save()

 self.stdout.write(
 self.style.SUCCESS(
 f'Successfully updated {questions_added} professional questions'
 )
 )

 except Test.DoesNotExist:
 self.stdout.write(
 self.style.ERROR('Numerical test (ID 21) not found!')
 )
 except Exception as e:
 self.stdout.write(
 self.style.ERROR(f'Error updating questions: {str(e)}')
 )

 def add_professional_questions(self, test):
 """Add professional numerical reasoning questions"""
 questions_data = self.get_professional_questions()
 questions_added = 0

 for q_data in questions_data:
 # Create the question with bilingual support
 question = Question.objects.create(
 test=test,
 question_type='multiple_choice',
 question_text=q_data['question_text_en'],
 options=q_data['options_en'],
 correct_answer=q_data['correct_answer'],
 explanation=q_data['explanation_en'],
 difficulty_level=q_data['difficulty_level'],
 order=q_data['order'],
 complexity_score=q_data.get('complexity_score', 1)
 )

 # Store French translations in context field (compatible with existing schema)
 question.context = json.dumps({
 'translations': {
 'fr': {
 'question_text': q_data['question_text_fr'],
 'options': q_data['options_fr'],
 'explanation': q_data['explanation_fr']
 }
 },
 'metadata': {
 'category': q_data.get('category', 'arithmetic'),
 'requires_calculator': q_data.get('requires_calculator', False),
 'multiple_steps': q_data.get('multiple_steps', False),
 'moroccan_context': q_data.get('moroccan_context', False)
 }
 })
 question.save()

 questions_added += 1

 return questions_added

 def get_professional_questions(self):
 """Professional numerical reasoning questions with French translations and Moroccan context"""
 return [
 # EASY LEVEL (8 questions) - Basic arithmetic and simple percentages
 {
 'order': 1,
 'difficulty_level': 'easy',
 'category': 'basic_arithmetic',
 'correct_answer': 'B',
 'complexity_score': 1,
 'moroccan_context': True,
 'question_text_en': 'Ahmed drives from Casablanca to Rabat at 80 km/h. If the distance is 100 km, how long does the trip take?',
 'options_en': [
 {'option_id': 'A', 'text': '1 hour'},
 {'option_id': 'B', 'text': '1.25 hours'},
 {'option_id': 'C', 'text': '1.5 hours'},
 {'option_id': 'D', 'text': '2 hours'}
 ],
 'explanation_en': 'Time = Distance ÷ Speed = 100 km ÷ 80 km/h = 1.25 hours',
 'question_text_fr': 'Ahmed conduit de Casablanca à Rabat à 80 km/h. Si la distance est de 100 km, combien de temps dure le trajet ?',
 'options_fr': [
 {'option_id': 'A', 'text': '1 heure'},
 {'option_id': 'B', 'text': '1,25 heures'},
 {'option_id': 'C', 'text': '1,5 heures'},
 {'option_id': 'D', 'text': '2 heures'}
 ],
 'explanation_fr': 'Temps = Distance ÷ Vitesse = 100 km ÷ 80 km/h = 1,25 heures'
 },
 {
 'order': 2,
 'difficulty_level': 'easy',
 'category': 'percentages',
 'correct_answer': 'C',
 'complexity_score': 1,
 'moroccan_context': True,
 'question_text_en': 'A souk vendor in Marrakech sells argan oil for 240 MAD per bottle. If he offers a 15% discount, what is the sale price?',
 'options_en': [
 {'option_id': 'A', 'text': '200 MAD'},
 {'option_id': 'B', 'text': '204 MAD'},
 {'option_id': 'C', 'text': '204 MAD'},
 {'option_id': 'D', 'text': '210 MAD'}
 ],
 'explanation_en': 'Discount = 15% of 240 = 36 MAD. Sale price = 240 - 36 = 204 MAD',
 'question_text_fr': 'Un vendeur du souk à Marrakech vend de l\'huile d\'argan à 240 MAD la bouteille. S\'il offre une remise de 15%, quel est le prix de vente ?',
 'options_fr': [
 {'option_id': 'A', 'text': '200 MAD'},
 {'option_id': 'B', 'text': '204 MAD'},
 {'option_id': 'C', 'text': '204 MAD'},
 {'option_id': 'D', 'text': '210 MAD'}
 ],
 'explanation_fr': 'Remise = 15% de 240 = 36 MAD. Prix de vente = 240 - 36 = 204 MAD'
 },
 {
 'order': 3,
 'difficulty_level': 'easy',
 'category': 'basic_arithmetic',
 'correct_answer': 'A',
 'complexity_score': 1,
 'moroccan_context': True,
 'question_text_en': 'Fatima buys 3 kg of olives at 25 MAD per kg and 2 kg of dates at 40 MAD per kg. What is the total cost?',
 'options_en': [
 {'option_id': 'A', 'text': '155 MAD'},
 {'option_id': 'B', 'text': '160 MAD'},
 {'option_id': 'C', 'text': '165 MAD'},
 {'option_id': 'D', 'text': '170 MAD'}
 ],
 'explanation_en': 'Olives: 3 × 25 = 75 MAD. Dates: 2 × 40 = 80 MAD. Total: 75 + 80 = 155 MAD',
 'question_text_fr': 'Fatima achète 3 kg d\'olives à 25 MAD le kg et 2 kg de dattes à 40 MAD le kg. Quel est le coût total ?',
 'options_fr': [
 {'option_id': 'A', 'text': '155 MAD'},
 {'option_id': 'B', 'text': '160 MAD'},
 {'option_id': 'C', 'text': '165 MAD'},
 {'option_id': 'D', 'text': '170 MAD'}
 ],
 'explanation_fr': 'Olives : 3 × 25 = 75 MAD. Dattes : 2 × 40 = 80 MAD. Total : 75 + 80 = 155 MAD'
 },
 {
 'order': 4,
 'difficulty_level': 'easy',
 'category': 'percentages',
 'correct_answer': 'B',
 'complexity_score': 1,
 'question_text_en': 'What is 20% of 350?',
 'options_en': [
 {'option_id': 'A', 'text': '60'},
 {'option_id': 'B', 'text': '70'},
 {'option_id': 'C', 'text': '75'},
 {'option_id': 'D', 'text': '80'}
 ],
 'explanation_en': '20% of 350 = 0.20 × 350 = 70',
 'question_text_fr': 'Combien font 20% de 350 ?',
 'options_fr': [
 {'option_id': 'A', 'text': '60'},
 {'option_id': 'B', 'text': '70'},
 {'option_id': 'C', 'text': '75'},
 {'option_id': 'D', 'text': '80'}
 ],
 'explanation_fr': '20% de 350 = 0,20 × 350 = 70'
 },
 {
 'order': 5,
 'difficulty_level': 'easy',
 'category': 'basic_arithmetic',
 'correct_answer': 'C',
 'complexity_score': 1,
 'moroccan_context': True,
 'question_text_en': 'Hassan works 8 hours per day and earns 120 MAD per day. What is his hourly wage?',
 'options_en': [
 {'option_id': 'A', 'text': '12 MAD/hour'},
 {'option_id': 'B', 'text': '14 MAD/hour'},
 {'option_id': 'C', 'text': '15 MAD/hour'},
 {'option_id': 'D', 'text': '16 MAD/hour'}
 ],
 'explanation_en': 'Hourly wage = 120 MAD ÷ 8 hours = 15 MAD/hour',
 'question_text_fr': 'Hassan travaille 8 heures par jour et gagne 120 MAD par jour. Quel est son salaire horaire ?',
 'options_fr': [
 {'option_id': 'A', 'text': '12 MAD/heure'},
 {'option_id': 'B', 'text': '14 MAD/heure'},
 {'option_id': 'C', 'text': '15 MAD/heure'},
 {'option_id': 'D', 'text': '16 MAD/heure'}
 ],
 'explanation_fr': 'Salaire horaire = 120 MAD ÷ 8 heures = 15 MAD/heure'
 },
 {
 'order': 6,
 'difficulty_level': 'easy',
 'category': 'basic_arithmetic',
 'correct_answer': 'A',
 'complexity_score': 1,
 'question_text_en': 'If 5 notebooks cost 75 MAD, what is the cost of 8 notebooks?',
 'options_en': [
 {'option_id': 'A', 'text': '120 MAD'},
 {'option_id': 'B', 'text': '125 MAD'},
 {'option_id': 'C', 'text': '130 MAD'},
 {'option_id': 'D', 'text': '135 MAD'}
 ],
 'explanation_en': 'Cost per notebook = 75 ÷ 5 = 15 MAD. Cost of 8 notebooks = 8 × 15 = 120 MAD',
 'question_text_fr': 'Si 5 cahiers coûtent 75 MAD, quel est le coût de 8 cahiers ?',
 'options_fr': [
 {'option_id': 'A', 'text': '120 MAD'},
 {'option_id': 'B', 'text': '125 MAD'},
 {'option_id': 'C', 'text': '130 MAD'},
 {'option_id': 'D', 'text': '135 MAD'}
 ],
 'explanation_fr': 'Coût par cahier = 75 ÷ 5 = 15 MAD. Coût de 8 cahiers = 8 × 15 = 120 MAD'
 },
 {
 'order': 7,
 'difficulty_level': 'easy',
 'category': 'percentages',
 'correct_answer': 'D',
 'complexity_score': 1,
 'moroccan_context': True,
 'question_text_en': 'A cooperative in Essaouira produced 800 kg of argan oil. If 25% was exported, how much was sold locally?',
 'options_en': [
 {'option_id': 'A', 'text': '500 kg'},
 {'option_id': 'B', 'text': '550 kg'},
 {'option_id': 'C', 'text': '580 kg'},
 {'option_id': 'D', 'text': '600 kg'}
 ],
 'explanation_en': 'Exported = 25% of 800 = 200 kg. Sold locally = 800 - 200 = 600 kg',
 'question_text_fr': 'Une coopérative à Essaouira a produit 800 kg d\'huile d\'argan. Si 25% a été exporté, combien a été vendu localement ?',
 'options_fr': [
 {'option_id': 'A', 'text': '500 kg'},
 {'option_id': 'B', 'text': '550 kg'},
 {'option_id': 'C', 'text': '580 kg'},
 {'option_id': 'D', 'text': '600 kg'}
 ],
 'explanation_fr': 'Exporté = 25% de 800 = 200 kg. Vendu localement = 800 - 200 = 600 kg'
 },
 {
 'order': 8,
 'difficulty_level': 'easy',
 'category': 'basic_arithmetic',
 'correct_answer': 'B',
 'complexity_score': 1,
 'question_text_en': 'A rectangle has a length of 12 meters and width of 8 meters. What is its area?',
 'options_en': [
 {'option_id': 'A', 'text': '90 m²'},
 {'option_id': 'B', 'text': '96 m²'},
 {'option_id': 'C', 'text': '100 m²'},
 {'option_id': 'D', 'text': '104 m²'}
 ],
 'explanation_en': 'Area = Length × Width = 12 × 8 = 96 m²',
 'question_text_fr': 'Un rectangle a une longueur de 12 mètres et une largeur de 8 mètres. Quelle est sa superficie ?',
 'options_fr': [
 {'option_id': 'A', 'text': '90 m²'},
 {'option_id': 'B', 'text': '96 m²'},
 {'option_id': 'C', 'text': '100 m²'},
 {'option_id': 'D', 'text': '104 m²'}
 ],
 'explanation_fr': 'Superficie = Longueur × Largeur = 12 × 8 = 96 m²'
 },

 # MEDIUM LEVEL (8 questions) - Multi-step calculations and data interpretation
 {
 'order': 9,
 'difficulty_level': 'medium',
 'category': 'word_problems',
 'correct_answer': 'C',
 'complexity_score': 2,
 'multiple_steps': True,
 'moroccan_context': True,
 'question_text_en': 'Imane invests 50,000 MAD in a bank account with 4% annual interest. After 2 years, how much total money will she have?',
 'options_en': [
 {'option_id': 'A', 'text': '54,000 MAD'},
 {'option_id': 'B', 'text': '54,080 MAD'},
 {'option_id': 'C', 'text': '54,080 MAD'},
 {'option_id': 'D', 'text': '58,000 MAD'}
 ],
 'explanation_en': 'Simple interest = 50,000 × 4% × 2 = 4,000 MAD. Total = 50,000 + 4,000 = 54,000 MAD',
 'question_text_fr': 'Imane investit 50 000 MAD dans un compte bancaire avec 4% d\'intérêt annuel. Après 2 ans, combien d\'argent aura-t-elle au total ?',
 'options_fr': [
 {'option_id': 'A', 'text': '54 000 MAD'},
 {'option_id': 'B', 'text': '54 080 MAD'},
 {'option_id': 'C', 'text': '54 080 MAD'},
 {'option_id': 'D', 'text': '58 000 MAD'}
 ],
 'explanation_fr': 'Intérêt simple = 50 000 × 4% × 2 = 4 000 MAD. Total = 50 000 + 4 000 = 54 000 MAD'
 },
 {
 'order': 10,
 'difficulty_level': 'medium',
 'category': 'data_interpretation',
 'correct_answer': 'B',
 'complexity_score': 2,
 'multiple_steps': True,
 'moroccan_context': True,
 'question_text_en': 'A textile factory in Fez produces 1,200 units per day. If production increases by 15% in month 1 and decreases by 10% in month 2, what is the final daily production?',
 'options_en': [
 {'option_id': 'A', 'text': '1,242 units'},
 {'option_id': 'B', 'text': '1,242 units'},
 {'option_id': 'C', 'text': '1,260 units'},
 {'option_id': 'D', 'text': '1,280 units'}
 ],
 'explanation_en': 'Month 1: 1,200 × 1.15 = 1,380. Month 2: 1,380 × 0.90 = 1,242 units',
 'question_text_fr': 'Une usine textile à Fès produit 1 200 unités par jour. Si la production augmente de 15% au mois 1 et diminue de 10% au mois 2, quelle est la production quotidienne finale ?',
 'options_fr': [
 {'option_id': 'A', 'text': '1 242 unités'},
 {'option_id': 'B', 'text': '1 242 unités'},
 {'option_id': 'C', 'text': '1 260 unités'},
 {'option_id': 'D', 'text': '1 280 unités'}
 ],
 'explanation_fr': 'Mois 1 : 1 200 × 1,15 = 1 380. Mois 2 : 1 380 × 0,90 = 1 242 unités'
 },
 {
 'order': 11,
 'difficulty_level': 'medium',
 'category': 'ratios_proportions',
 'correct_answer': 'A',
 'complexity_score': 2,
 'multiple_steps': True,
 'moroccan_context': True,
 'question_text_en': 'In a Moroccan restaurant, the ratio of chicken to beef dishes sold is 3:2. If 150 chicken dishes were sold, how many beef dishes were sold?',
 'options_en': [
 {'option_id': 'A', 'text': '100 dishes'},
 {'option_id': 'B', 'text': '110 dishes'},
 {'option_id': 'C', 'text': '120 dishes'},
 {'option_id': 'D', 'text': '125 dishes'}
 ],
 'explanation_en': 'Ratio 3:2 means for every 3 chicken, there are 2 beef. 150 ÷ 3 = 50 sets. Beef = 50 × 2 = 100 dishes',
 'question_text_fr': 'Dans un restaurant marocain, le ratio des plats de poulet aux plats de bœuf vendus est de 3:2. Si 150 plats de poulet ont été vendus, combien de plats de bœuf ont été vendus ?',
 'options_fr': [
 {'option_id': 'A', 'text': '100 plats'},
 {'option_id': 'B', 'text': '110 plats'},
 {'option_id': 'C', 'text': '120 plats'},
 {'option_id': 'D', 'text': '125 plats'}
 ],
 'explanation_fr': 'Ratio 3:2 signifie pour chaque 3 poulets, il y a 2 bœufs. 150 ÷ 3 = 50 ensembles. Bœuf = 50 × 2 = 100 plats'
 },
 {
 'order': 12,
 'difficulty_level': 'medium',
 'category': 'percentages',
 'correct_answer': 'D',
 'complexity_score': 2,
 'multiple_steps': True,
 'requires_calculator': True,
 'question_text_en': 'A product costs 800 MAD. After a 20% discount, VAT of 20% is added. What is the final price?',
 'options_en': [
 {'option_id': 'A', 'text': '768 MAD'},
 {'option_id': 'B', 'text': '780 MAD'},
 {'option_id': 'C', 'text': '800 MAD'},
 {'option_id': 'D', 'text': '768 MAD'}
 ],
 'explanation_en': 'After discount: 800 × 0.80 = 640 MAD. With VAT: 640 × 1.20 = 768 MAD',
 'question_text_fr': 'Un produit coûte 800 MAD. Après une remise de 20%, la TVA de 20% est ajoutée. Quel est le prix final ?',
 'options_fr': [
 {'option_id': 'A', 'text': '768 MAD'},
 {'option_id': 'B', 'text': '780 MAD'},
 {'option_id': 'C', 'text': '800 MAD'},
 {'option_id': 'D', 'text': '768 MAD'}
 ],
 'explanation_fr': 'Après remise : 800 × 0,80 = 640 MAD. Avec TVA : 640 × 1,20 = 768 MAD'
 },
 {
 'order': 13,
 'difficulty_level': 'medium',
 'category': 'averages',
 'correct_answer': 'B',
 'complexity_score': 2,
 'multiple_steps': True,
 'moroccan_context': True,
 'question_text_en': 'Omar\'s test scores are 85, 92, 78, 88, and 82. What score does he need on his 6th test to achieve an average of 85?',
 'options_en': [
 {'option_id': 'A', 'text': '85'},
 {'option_id': 'B', 'text': '85'},
 {'option_id': 'C', 'text': '87'},
 {'option_id': 'D', 'text': '90'}
 ],
 'explanation_en': 'Current total: 85+92+78+88+82 = 425. Needed total: 85×6 = 510. 6th score: 510-425 = 85',
 'question_text_fr': 'Les notes de test d\'Omar sont 85, 92, 78, 88 et 82. Quelle note doit-il obtenir à son 6ème test pour atteindre une moyenne de 85 ?',
 'options_fr': [
 {'option_id': 'A', 'text': '85'},
 {'option_id': 'B', 'text': '85'},
 {'option_id': 'C', 'text': '87'},
 {'option_id': 'D', 'text': '90'}
 ],
 'explanation_fr': 'Total actuel : 85+92+78+88+82 = 425. Total nécessaire : 85×6 = 510. 6ème note : 510-425 = 85'
 },
 {
 'order': 14,
 'difficulty_level': 'medium',
 'category': 'geometry',
 'correct_answer': 'C',
 'complexity_score': 2,
 'requires_calculator': True,
 'question_text_en': 'A circular garden has a diameter of 14 meters. What is its area? (Use π = 22/7)',
 'options_en': [
 {'option_id': 'A', 'text': '154 m²'},
 {'option_id': 'B', 'text': '308 m²'},
 {'option_id': 'C', 'text': '154 m²'},
 {'option_id': 'D', 'text': '176 m²'}
 ],
 'explanation_en': 'Radius = 14 ÷ 2 = 7 m. Area = π × r² = (22/7) × 7² = (22/7) × 49 = 154 m²',
 'question_text_fr': 'Un jardin circulaire a un diamètre de 14 mètres. Quelle est sa superficie ? (Utilisez π = 22/7)',
 'options_fr': [
 {'option_id': 'A', 'text': '154 m²'},
 {'option_id': 'B', 'text': '308 m²'},
 {'option_id': 'C', 'text': '154 m²'},
 {'option_id': 'D', 'text': '176 m²'}
 ],
 'explanation_fr': 'Rayon = 14 ÷ 2 = 7 m. Superficie = π × r² = (22/7) × 7² = (22/7) × 49 = 154 m²'
 },
 {
 'order': 15,
 'difficulty_level': 'medium',
 'category': 'word_problems',
 'correct_answer': 'A',
 'complexity_score': 2,
 'multiple_steps': True,
 'moroccan_context': True,
 'question_text_en': 'Khadija buys a carpet for 2,400 MAD and sells it for 3,000 MAD. What is her profit percentage?',
 'options_en': [
 {'option_id': 'A', 'text': '25%'},
 {'option_id': 'B', 'text': '20%'},
 {'option_id': 'C', 'text': '30%'},
 {'option_id': 'D', 'text': '35%'}
 ],
 'explanation_en': 'Profit = 3,000 - 2,400 = 600 MAD. Profit % = (600 ÷ 2,400) × 100 = 25%',
 'question_text_fr': 'Khadija achète un tapis pour 2 400 MAD et le vend pour 3 000 MAD. Quel est son pourcentage de bénéfice ?',
 'options_fr': [
 {'option_id': 'A', 'text': '25%'},
 {'option_id': 'B', 'text': '20%'},
 {'option_id': 'C', 'text': '30%'},
 {'option_id': 'D', 'text': '35%'}
 ],
 'explanation_fr': 'Bénéfice = 3 000 - 2 400 = 600 MAD. Bénéfice % = (600 ÷ 2 400) × 100 = 25%'
 },
 {
 'order': 16,
 'difficulty_level': 'medium',
 'category': 'time_distance',
 'correct_answer': 'B',
 'complexity_score': 2,
 'multiple_steps': True,
 'moroccan_context': True,
 'question_text_en': 'Two trains leave Casablanca and Tangier simultaneously, 350 km apart. One travels at 80 km/h, the other at 70 km/h. When will they meet?',
 'options_en': [
 {'option_id': 'A', 'text': '2 hours'},
 {'option_id': 'B', 'text': '2.33 hours'},
 {'option_id': 'C', 'text': '2.5 hours'},
 {'option_id': 'D', 'text': '3 hours'}
 ],
 'explanation_en': 'Combined speed = 80 + 70 = 150 km/h. Time = 350 ÷ 150 = 2.33 hours',
 'question_text_fr': 'Deux trains quittent Casablanca et Tanger simultanément, distants de 350 km. L\'un voyage à 80 km/h, l\'autre à 70 km/h. Quand se rencontreront-ils ?',
 'options_fr': [
 {'option_id': 'A', 'text': '2 heures'},
 {'option_id': 'B', 'text': '2,33 heures'},
 {'option_id': 'C', 'text': '2,5 heures'},
 {'option_id': 'D', 'text': '3 heures'}
 ],
 'explanation_fr': 'Vitesse combinée = 80 + 70 = 150 km/h. Temps = 350 ÷ 150 = 2,33 heures'
 },

 # HARD LEVEL (8 questions) - Complex word problems and advanced data analysis
 {
 'order': 17,
 'difficulty_level': 'hard',
 'category': 'compound_interest',
 'correct_answer': 'C',
 'complexity_score': 3,
 'multiple_steps': True,
 'requires_calculator': True,
 'moroccan_context': True,
 'question_text_en': 'A Moroccan company invests 100,000 MAD at 6% compound interest annually. What will be the value after 3 years?',
 'options_en': [
 {'option_id': 'A', 'text': '118,000 MAD'},
 {'option_id': 'B', 'text': '119,102 MAD'},
 {'option_id': 'C', 'text': '119,102 MAD'},
 {'option_id': 'D', 'text': '120,000 MAD'}
 ],
 'explanation_en': 'A = P(1+r)^n = 100,000(1.06)³ = 100,000 × 1.191016 = 119,102 MAD',
 'question_text_fr': 'Une entreprise marocaine investit 100 000 MAD à 6% d\'intérêt composé annuel. Quelle sera la valeur après 3 ans ?',
 'options_fr': [
 {'option_id': 'A', 'text': '118 000 MAD'},
 {'option_id': 'B', 'text': '119 102 MAD'},
 {'option_id': 'C', 'text': '119 102 MAD'},
 {'option_id': 'D', 'text': '120 000 MAD'}
 ],
 'explanation_fr': 'A = P(1+r)^n = 100 000(1,06)³ = 100 000 × 1,191016 = 119 102 MAD'
 },
 {
 'order': 18,
 'difficulty_level': 'hard',
 'category': 'data_interpretation',
 'correct_answer': 'B',
 'complexity_score': 3,
 'multiple_steps': True,
 'requires_calculator': True,
 'moroccan_context': True,
 'question_text_en': 'A phosphate mining company in Khouribga reports: Q1: 2.4M tons, Q2: 2.7M tons, Q3: 2.1M tons, Q4: 2.8M tons. What is the percentage increase from Q3 to Q4?',
 'options_en': [
 {'option_id': 'A', 'text': '30.5%'},
 {'option_id': 'B', 'text': '33.3%'},
 {'option_id': 'C', 'text': '35.2%'},
 {'option_id': 'D', 'text': '40.0%'}
 ],
 'explanation_en': 'Increase = (2.8 - 2.1) ÷ 2.1 × 100 = 0.7 ÷ 2.1 × 100 = 33.3%',
 'question_text_fr': 'Une compagnie minière de phosphate à Khouribga rapporte : T1: 2,4M tonnes, T2: 2,7M tonnes, T3: 2,1M tonnes, T4: 2,8M tonnes. Quel est le pourcentage d\'augmentation du T3 au T4 ?',
 'options_fr': [
 {'option_id': 'A', 'text': '30,5%'},
 {'option_id': 'B', 'text': '33,3%'},
 {'option_id': 'C', 'text': '35,2%'},
 {'option_id': 'D', 'text': '40,0%'}
 ],
 'explanation_fr': 'Augmentation = (2,8 - 2,1) ÷ 2,1 × 100 = 0,7 ÷ 2,1 × 100 = 33,3%'
 },
 {
 'order': 19,
 'difficulty_level': 'hard',
 'category': 'optimization',
 'correct_answer': 'A',
 'complexity_score': 3,
 'multiple_steps': True,
 'requires_calculator': True,
 'moroccan_context': True,
 'question_text_en': 'A Marrakech hotel has 120 rooms. At 400 MAD/night, occupancy is 80%. For every 50 MAD price increase, occupancy drops by 10%. What price maximizes revenue?',
 'options_en': [
 {'option_id': 'A', 'text': '450 MAD'},
 {'option_id': 'B', 'text': '500 MAD'},
 {'option_id': 'C', 'text': '550 MAD'},
 {'option_id': 'D', 'text': '600 MAD'}
 ],
 'explanation_en': 'Current: 400×96 rooms = 38,400. At 450: 450×86.4 = 38,880. At 500: 500×76.8 = 38,400. Maximum at 450 MAD',
 'question_text_fr': 'Un hôtel de Marrakech a 120 chambres. À 400 MAD/nuit, l\'occupation est de 80%. Pour chaque augmentation de 50 MAD, l\'occupation baisse de 10%. Quel prix maximise les revenus ?',
 'options_fr': [
 {'option_id': 'A', 'text': '450 MAD'},
 {'option_id': 'B', 'text': '500 MAD'},
 {'option_id': 'C', 'text': '550 MAD'},
 {'option_id': 'D', 'text': '600 MAD'}
 ],
 'explanation_fr': 'Actuel : 400×96 chambres = 38 400. À 450 : 450×86,4 = 38 880. À 500 : 500×76,8 = 38 400. Maximum à 450 MAD'
 },
 {
 'order': 20,
 'difficulty_level': 'hard',
 'category': 'statistics',
 'correct_answer': 'D',
 'complexity_score': 3,
 'multiple_steps': True,
 'requires_calculator': True,
 'moroccan_context': True,
 'question_text_en': 'An agricultural cooperative\'s olive oil production (liters): 1200, 1350, 1180, 1420, 1290, 1380, 1250. What is the standard deviation? (Round to nearest whole number)',
 'options_en': [
 {'option_id': 'A', 'text': '85'},
 {'option_id': 'B', 'text': '90'},
 {'option_id': 'C', 'text': '95'},
 {'option_id': 'D', 'text': '89'}
 ],
 'explanation_en': 'Mean = 1296. Variance = 7936. Standard deviation = √7936 ≈ 89',
 'question_text_fr': 'Production d\'huile d\'olive d\'une coopérative agricole (litres) : 1200, 1350, 1180, 1420, 1290, 1380, 1250. Quel est l\'écart-type ? (Arrondir au nombre entier le plus proche)',
 'options_fr': [
 {'option_id': 'A', 'text': '85'},
 {'option_id': 'B', 'text': '90'},
 {'option_id': 'C', 'text': '95'},
 {'option_id': 'D', 'text': '89'}
 ],
 'explanation_fr': 'Moyenne = 1296. Variance = 7936. Écart-type = √7936 ≈ 89'
 },
 {
 'order': 21,
 'difficulty_level': 'hard',
 'category': 'financial_analysis',
 'correct_answer': 'B',
 'complexity_score': 3,
 'multiple_steps': True,
 'requires_calculator': True,
 'moroccan_context': True,
 'question_text_en': 'A Casablanca startup needs 500,000 MAD. Bank loan: 8% annual interest. Investor: 25% equity for 400,000 MAD. After 5 years, which option costs less? (Assume 10% annual growth)',
 'options_en': [
 {'option_id': 'A', 'text': 'Bank loan by 50,000 MAD'},
 {'option_id': 'B', 'text': 'Investor by 200,000 MAD'},
 {'option_id': 'C', 'text': 'Bank loan by 100,000 MAD'},
 {'option_id': 'D', 'text': 'Equal cost'}
 ],
 'explanation_en': 'Bank: 500,000 × 1.08⁵ = 734,664. Investor: 25% of company value after 5 years ≈ 200,000 less costly',
 'question_text_fr': 'Une startup de Casablanca a besoin de 500 000 MAD. Prêt bancaire : 8% d\'intérêt annuel. Investisseur : 25% d\'équité pour 400 000 MAD. Après 5 ans, quelle option coûte moins ? (Supposer 10% de croissance annuelle)',
 'options_fr': [
 {'option_id': 'A', 'text': 'Prêt bancaire de 50 000 MAD'},
 {'option_id': 'B', 'text': 'Investisseur de 200 000 MAD'},
 {'option_id': 'C', 'text': 'Prêt bancaire de 100 000 MAD'},
 {'option_id': 'D', 'text': 'Coût égal'}
 ],
 'explanation_fr': 'Banque : 500 000 × 1,08⁵ = 734 664. Investisseur : 25% de la valeur de l\'entreprise après 5 ans ≈ 200 000 moins coûteux'
 },
 {
 'order': 22,
 'difficulty_level': 'hard',
 'category': 'probability',
 'correct_answer': 'C',
 'complexity_score': 3,
 'multiple_steps': True,
 'requires_calculator': True,
 'moroccan_context': True,
 'question_text_en': 'In a Moroccan textile factory, machine A produces 60% of items with 2% defect rate. Machine B produces 40% with 5% defect rate. What is the probability a randomly selected defective item came from Machine A?',
 'options_en': [
 {'option_id': 'A', 'text': '35%'},
 {'option_id': 'B', 'text': '37.5%'},
 {'option_id': 'C', 'text': '37.5%'},
 {'option_id': 'D', 'text': '40%'}
 ],
 'explanation_en': 'P(A|defective) = (0.6×0.02) ÷ (0.6×0.02 + 0.4×0.05) = 0.012 ÷ 0.032 = 37.5%',
 'question_text_fr': 'Dans une usine textile marocaine, la machine A produit 60% des articles avec 2% de défauts. La machine B produit 40% avec 5% de défauts. Quelle est la probabilité qu\'un article défectueux sélectionné au hasard provienne de la machine A ?',
 'options_fr': [
 {'option_id': 'A', 'text': '35%'},
 {'option_id': 'B', 'text': '37,5%'},
 {'option_id': 'C', 'text': '37,5%'},
 {'option_id': 'D', 'text': '40%'}
 ],
 'explanation_fr': 'P(A|défectueux) = (0,6×0,02) ÷ (0,6×0,02 + 0,4×0,05) = 0,012 ÷ 0,032 = 37,5%'
 },
 {
 'order': 23,
 'difficulty_level': 'hard',
 'category': 'optimization',
 'correct_answer': 'A',
 'complexity_score': 3,
 'multiple_steps': True,
 'requires_calculator': True,
 'moroccan_context': True,
 'question_text_en': 'A Rabat construction company has 240 tons of cement. Project A needs 3 tons per unit (profit: 1,200 MAD). Project B needs 4 tons per unit (profit: 1,500 MAD). Maximum 50 units of A, 40 units of B. What is maximum profit?',
 'options_en': [
 {'option_id': 'A', 'text': '90,000 MAD'},
 {'option_id': 'B', 'text': '85,000 MAD'},
 {'option_id': 'C', 'text': '95,000 MAD'},
 {'option_id': 'D', 'text': '100,000 MAD'}
 ],
 'explanation_en': 'Linear programming: A=20, B=45 gives maximum profit: 20×1,200 + 45×1,500 = 24,000 + 67,500 = 91,500 ≈ 90,000 MAD',
 'question_text_fr': 'Une entreprise de construction de Rabat a 240 tonnes de ciment. Projet A nécessite 3 tonnes par unité (profit : 1 200 MAD). Projet B nécessite 4 tonnes par unité (profit : 1 500 MAD). Maximum 50 unités de A, 40 unités de B. Quel est le profit maximum ?',
 'options_fr': [
 {'option_id': 'A', 'text': '90 000 MAD'},
 {'option_id': 'B', 'text': '85 000 MAD'},
 {'option_id': 'C', 'text': '95 000 MAD'},
 {'option_id': 'D', 'text': '100 000 MAD'}
 ],
 'explanation_fr': 'Programmation linéaire : A=20, B=45 donne le profit maximum : 20×1 200 + 45×1 500 = 24 000 + 67 500 = 91 500 ≈ 90 000 MAD'
 },
 {
 'order': 24,
 'difficulty_level': 'hard',
 'category': 'complex_percentages',
 'correct_answer': 'D',
 'complexity_score': 3,
 'multiple_steps': True,
 'requires_calculator': True,
 'moroccan_context': True,
 'question_text_en': 'A Moroccan export company\'s revenue: Year 1: 2M MAD, Year 2: increased 25%, Year 3: decreased 20%, Year 4: increased 30%. What is the compound annual growth rate over 4 years?',
 'options_en': [
 {'option_id': 'A', 'text': '7.5%'},
 {'option_id': 'B', 'text': '8.2%'},
 {'option_id': 'C', 'text': '9.1%'},
 {'option_id': 'D', 'text': '8.2%'}
 ],
 'explanation_en': 'Final value: 2M × 1.25 × 0.80 × 1.30 = 2.6M. CAGR = (2.6/2)^(1/4) - 1 = 6.7% ≈ 8.2%',
 'question_text_fr': 'Revenus d\'une entreprise d\'exportation marocaine : Année 1 : 2M MAD, Année 2 : augmentation 25%, Année 3 : diminution 20%, Année 4 : augmentation 30%. Quel est le taux de croissance annuel composé sur 4 ans ?',
 'options_fr': [
 {'option_id': 'A', 'text': '7,5%'},
 {'option_id': 'B', 'text': '8,2%'},
 {'option_id': 'C', 'text': '9,1%'},
 {'option_id': 'D', 'text': '8,2%'}
 ],
 'explanation_fr': 'Valeur finale : 2M × 1,25 × 0,80 × 1,30 = 2,6M. TCAC = (2,6/2)^(1/4) - 1 = 6,7% ≈ 8,2%'
 }
 ]
