"""
Django management command to add Statement and Assumption questions for LRT1
"""

from django.core.management.base import BaseCommand
from django.db import transaction, models
from testsengine.models import Test, Question
import random

class Command(BaseCommand):
 help = 'Add Statement and Assumption questions for LRT1 (Logical Reasoning - Deductive Logic)'

 def handle(self, *args, **options):
 try:
 # Get the LRT1 test (ID 30)
 test = Test.objects.get(id=30)
 self.stdout.write(f"Adding Statement and Assumption questions to test: {test.title}")

 with transaction.atomic():
 # Clear existing questions first
 test.questions.all().delete()
 self.stdout.write("Cleared existing questions")

 # Add new questions
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
 self.style.ERROR('LRT1 test (ID 30) not found!')
 )
 except Exception as e:
 self.stdout.write(
 self.style.ERROR(f'Error adding questions: {str(e)}')
 )

 def add_questions(self, test):
 """Add Statement and Assumption questions with 3 difficulty levels"""
 questions_data = self.get_questions_data()
 questions_added = 0

 for i, question_data in enumerate(questions_data, start=1):
 question = Question.objects.create(
 test=test,
 question_text=question_data['question_text'],
 options=question_data['options'],
 correct_answer=question_data['correct_answer'],
 difficulty_level=question_data['difficulty_level'],
 explanation=question_data.get('explanation', ''),
 order=i,
 question_type='logical_deduction'
 )

 questions_added += 1
 self.stdout.write(f"Added question {i}: {question_data['question_text'][:50]}...")

 return questions_added

 def get_questions_data(self):
 """Return Statement and Assumption questions with 3 difficulty levels"""
 return [
 # EASY QUESTIONS (1-10)
 {
 'question_text': 'Statement: "All students must wear uniforms to school."\nAssumption: "Uniforms help maintain discipline."\nIs the assumption implicit in the statement?',
 'options': [
 {'option_id': 'A', 'text': 'Yes, the assumption is implicit'},
 {'option_id': 'B', 'text': 'No, the assumption is not implicit'},
 {'option_id': 'C', 'text': 'Cannot be determined'},
 {'option_id': 'D', 'text': 'The assumption contradicts the statement'},
 {'option_id': 'E', 'text': 'The statement is ambiguous'}
 ],
 'correct_answer': 'A',
 'difficulty_level': 'easy',
 'complexity_score': 1,
 'category': 'Statement and Assumption',
 'explanation': 'The assumption that uniforms help maintain discipline is implicit in the statement about mandatory uniforms.'
 },
 {
 'question_text': 'Statement: "The company will implement a new policy next month."\nAssumption: "The policy has been approved by management."\nIs the assumption implicit in the statement?',
 'options': [
 {'option_id': 'A', 'text': 'Yes, the assumption is implicit'},
 {'option_id': 'B', 'text': 'No, the assumption is not implicit'},
 {'option_id': 'C', 'text': 'Cannot be determined'},
 {'option_id': 'D', 'text': 'The assumption contradicts the statement'},
 {'option_id': 'E', 'text': 'The statement is ambiguous'}
 ],
 'correct_answer': 'A',
 'difficulty_level': 'easy',
 'complexity_score': 1,
 'category': 'Statement and Assumption',
 'explanation': 'For a company to implement a new policy, management approval is typically required and implicit.'
 },
 {
 'question_text': 'Statement: "The library will be closed on Sundays."\nAssumption: "People do not need library services on Sundays."\nIs the assumption implicit in the statement?',
 'options': [
 {'option_id': 'A', 'text': 'Yes, the assumption is implicit'},
 {'option_id': 'B', 'text': 'No, the assumption is not implicit'},
 {'option_id': 'C', 'text': 'Cannot be determined'},
 {'option_id': 'D', 'text': 'The assumption contradicts the statement'},
 {'option_id': 'E', 'text': 'The statement is ambiguous'}
 ],
 'correct_answer': 'B',
 'difficulty_level': 'easy',
 'complexity_score': 1,
 'category': 'Statement and Assumption',
 'explanation': 'The statement about closure does not necessarily imply that people do not need the services.'
 },
 {
 'question_text': 'Statement: "The new software will increase productivity."\nAssumption: "The current software is inefficient."\nIs the assumption implicit in the statement?',
 'options': [
 {'option_id': 'A', 'text': 'Yes, the assumption is implicit'},
 {'option_id': 'B', 'text': 'No, the assumption is not implicit'},
 {'option_id': 'C', 'text': 'Cannot be determined'},
 {'option_id': 'D', 'text': 'The assumption contradicts the statement'},
 {'option_id': 'E', 'text': 'The statement is ambiguous'}
 ],
 'correct_answer': 'A',
 'difficulty_level': 'easy',
 'complexity_score': 1,
 'category': 'Statement and Assumption',
 'explanation': 'The statement implies that current productivity can be improved, suggesting current inefficiency.'
 },
 {
 'question_text': 'Statement: "The meeting has been postponed to next week."\nAssumption: "The original meeting time was inconvenient."\nIs the assumption implicit in the statement?',
 'options': [
 {'option_id': 'A', 'text': 'Yes, the assumption is implicit'},
 {'option_id': 'B', 'text': 'No, the assumption is not implicit'},
 {'option_id': 'C', 'text': 'Cannot be determined'},
 {'option_id': 'D', 'text': 'The assumption contradicts the statement'},
 {'option_id': 'E', 'text': 'The statement is ambiguous'}
 ],
 'correct_answer': 'C',
 'difficulty_level': 'easy',
 'complexity_score': 1,
 'category': 'Statement and Assumption',
 'explanation': 'The reason for postponement is not specified, so we cannot determine if inconvenience was the cause.'
 },
 {
 'question_text': 'Statement: "The restaurant offers vegetarian options."\nAssumption: "Some customers prefer vegetarian food."\nIs the assumption implicit in the statement?',
 'options': [
 {'option_id': 'A', 'text': 'Yes, the assumption is implicit'},
 {'option_id': 'B', 'text': 'No, the assumption is not implicit'},
 {'option_id': 'C', 'text': 'Cannot be determined'},
 {'option_id': 'D', 'text': 'The assumption contradicts the statement'},
 {'option_id': 'E', 'text': 'The statement is ambiguous'}
 ],
 'correct_answer': 'A',
 'difficulty_level': 'easy',
 'complexity_score': 1,
 'category': 'Statement and Assumption',
 'explanation': 'Offering vegetarian options implies there is demand from customers who prefer such food.'
 },
 {
 'question_text': 'Statement: "The project deadline has been extended by two weeks."\nAssumption: "The original deadline was unrealistic."\nIs the assumption implicit in the statement?',
 'options': [
 {'option_id': 'A', 'text': 'Yes, the assumption is implicit'},
 {'option_id': 'B', 'text': 'No, the assumption is not implicit'},
 {'option_id': 'C', 'text': 'Cannot be determined'},
 {'option_id': 'D', 'text': 'The assumption contradicts the statement'},
 {'option_id': 'E', 'text': 'The statement is ambiguous'}
 ],
 'correct_answer': 'C',
 'difficulty_level': 'easy',
 'complexity_score': 1,
 'category': 'Statement and Assumption',
 'explanation': 'The extension could be for various reasons, not necessarily because the original deadline was unrealistic.'
 },
 {
 'question_text': 'Statement: "The company will hire 50 new employees this year."\nAssumption: "The company is expanding its operations."\nIs the assumption implicit in the statement?',
 'options': [
 {'option_id': 'A', 'text': 'Yes, the assumption is implicit'},
 {'option_id': 'B', 'text': 'No, the assumption is not implicit'},
 {'option_id': 'C', 'text': 'Cannot be determined'},
 {'option_id': 'D', 'text': 'The assumption contradicts the statement'},
 {'option_id': 'E', 'text': 'The statement is ambiguous'}
 ],
 'correct_answer': 'A',
 'difficulty_level': 'easy',
 'complexity_score': 1,
 'category': 'Statement and Assumption',
 'explanation': 'Hiring many new employees typically indicates business growth and expansion.'
 },
 {
 'question_text': 'Statement: "The store will close early on holidays."\nAssumption: "Holidays have reduced customer traffic."\nIs the assumption implicit in the statement?',
 'options': [
 {'option_id': 'A', 'text': 'Yes, the assumption is implicit'},
 {'option_id': 'B', 'text': 'No, the assumption is not implicit'},
 {'option_id': 'C', 'text': 'Cannot be determined'},
 {'option_id': 'D', 'text': 'The assumption contradicts the statement'},
 {'option_id': 'E', 'text': 'The statement is ambiguous'}
 ],
 'correct_answer': 'A',
 'difficulty_level': 'easy',
 'complexity_score': 1,
 'category': 'Statement and Assumption',
 'explanation': 'Closing early on holidays suggests reduced business activity during those times.'
 },
 {
 'question_text': 'Statement: "The new policy requires all employees to attend training."\nAssumption: "Current employees lack necessary skills."\nIs the assumption implicit in the statement?',
 'options': [
 {'option_id': 'A', 'text': 'Yes, the assumption is implicit'},
 {'option_id': 'B', 'text': 'No, the assumption is not implicit'},
 {'option_id': 'C', 'text': 'Cannot be determined'},
 {'option_id': 'D', 'text': 'The assumption contradicts the statement'},
 {'option_id': 'E', 'text': 'The statement is ambiguous'}
 ],
 'correct_answer': 'C',
 'difficulty_level': 'easy',
 'complexity_score': 1,
 'category': 'Statement and Assumption',
 'explanation': 'Training could be for various reasons - skill updates, new procedures, or compliance, not necessarily skill deficiencies.'
 },

 # MEDIUM QUESTIONS (11-20)
 {
 'question_text': 'Statement: "The government has decided to increase taxes on luxury goods."\nAssumption: "Luxury goods are purchased primarily by wealthy individuals."\nIs the assumption implicit in the statement?',
 'options': [
 {'option_id': 'A', 'text': 'Yes, the assumption is implicit'},
 {'option_id': 'B', 'text': 'No, the assumption is not implicit'},
 {'option_id': 'C', 'text': 'Cannot be determined'},
 {'option_id': 'D', 'text': 'The assumption contradicts the statement'},
 {'option_id': 'E', 'text': 'The statement is ambiguous'}
 ],
 'correct_answer': 'A',
 'difficulty_level': 'medium',
 'complexity_score': 2,
 'category': 'Statement and Assumption',
 'explanation': 'Taxing luxury goods implies targeting those who can afford them, typically wealthier individuals.'
 },
 {
 'question_text': 'Statement: "The university will introduce online courses next semester."\nAssumption: "Traditional classroom learning is becoming obsolete."\nIs the assumption implicit in the statement?',
 'options': [
 {'option_id': 'A', 'text': 'Yes, the assumption is implicit'},
 {'option_id': 'B', 'text': 'No, the assumption is not implicit'},
 {'option_id': 'C', 'text': 'Cannot be determined'},
 {'option_id': 'D', 'text': 'The assumption contradicts the statement'},
 {'option_id': 'E', 'text': 'The statement is ambiguous'}
 ],
 'correct_answer': 'B',
 'difficulty_level': 'medium',
 'complexity_score': 2,
 'category': 'Statement and Assumption',
 'explanation': 'Adding online courses does not imply that traditional learning is obsolete; it may be complementary.'
 },
 {
 'question_text': 'Statement: "The company will reduce its carbon footprint by 50% this year."\nAssumption: "The company has been environmentally irresponsible in the past."\nIs the assumption implicit in the statement?',
 'options': [
 {'option_id': 'A', 'text': 'Yes, the assumption is implicit'},
 {'option_id': 'B', 'text': 'No, the assumption is not implicit'},
 {'option_id': 'C', 'text': 'Cannot be determined'},
 {'option_id': 'D', 'text': 'The assumption contradicts the statement'},
 {'option_id': 'E', 'text': 'The statement is ambiguous'}
 ],
 'correct_answer': 'C',
 'difficulty_level': 'medium',
 'complexity_score': 2,
 'category': 'Statement and Assumption',
 'explanation': 'The reduction could be for various reasons - regulatory compliance, cost savings, or corporate responsibility - not necessarily past irresponsibility.'
 },
 {
 'question_text': 'Statement: "The new smartphone will be available in limited quantities."\nAssumption: "The manufacturer cannot meet high demand."\nIs the assumption implicit in the statement?',
 'options': [
 {'option_id': 'A', 'text': 'Yes, the assumption is implicit'},
 {'option_id': 'B', 'text': 'No, the assumption is not implicit'},
 {'option_id': 'C', 'text': 'Cannot be determined'},
 {'option_id': 'D', 'text': 'The assumption contradicts the statement'},
 {'option_id': 'E', 'text': 'The statement is ambiguous'}
 ],
 'correct_answer': 'C',
 'difficulty_level': 'medium',
 'complexity_score': 2,
 'category': 'Statement and Assumption',
 'explanation': 'Limited quantities could be due to various reasons - production capacity, marketing strategy, or supply chain issues.'
 },
 {
 'question_text': 'Statement: "The city will implement a new public transportation system."\nAssumption: "The current transportation system is inadequate."\nIs the assumption implicit in the statement?',
 'options': [
 {'option_id': 'A', 'text': 'Yes, the assumption is implicit'},
 {'option_id': 'B', 'text': 'No, the assumption is not implicit'},
 {'option_id': 'C', 'text': 'Cannot be determined'},
 {'option_id': 'D', 'text': 'The assumption contradicts the statement'},
 {'option_id': 'E', 'text': 'The statement is ambiguous'}
 ],
 'correct_answer': 'A',
 'difficulty_level': 'medium',
 'complexity_score': 2,
 'category': 'Statement and Assumption',
 'explanation': 'Implementing a new system typically implies that the current one needs improvement or replacement.'
 },
 {
 'question_text': 'Statement: "The hospital will extend its visiting hours."\nAssumption: "Current visiting hours are too restrictive."\nIs the assumption implicit in the statement?',
 'options': [
 {'option_id': 'A', 'text': 'Yes, the assumption is implicit'},
 {'option_id': 'B', 'text': 'No, the assumption is not implicit'},
 {'option_id': 'C', 'text': 'Cannot be determined'},
 {'option_id': 'D', 'text': 'The assumption contradicts the statement'},
 {'option_id': 'E', 'text': 'The statement is ambiguous'}
 ],
 'correct_answer': 'A',
 'difficulty_level': 'medium',
 'complexity_score': 2,
 'category': 'Statement and Assumption',
 'explanation': 'Extending hours suggests that current hours are insufficient for patient and visitor needs.'
 },
 {
 'question_text': 'Statement: "The company will invest heavily in research and development."\nAssumption: "The company is falling behind its competitors."\nIs the assumption implicit in the statement?',
 'options': [
 {'option_id': 'A', 'text': 'Yes, the assumption is implicit'},
 {'option_id': 'B', 'text': 'No, the assumption is not implicit'},
 {'option_id': 'C', 'text': 'Cannot be determined'},
 {'option_id': 'D', 'text': 'The assumption contradicts the statement'},
 {'option_id': 'E', 'text': 'The statement is ambiguous'}
 ],
 'correct_answer': 'C',
 'difficulty_level': 'medium',
 'complexity_score': 2,
 'category': 'Statement and Assumption',
 'explanation': 'R&D investment could be for various reasons - innovation, market expansion, or maintaining competitive advantage, not necessarily falling behind.'
 },
 {
 'question_text': 'Statement: "The school will introduce mandatory computer classes."\nAssumption: "Students lack basic computer skills."\nIs the assumption implicit in the statement?',
 'options': [
 {'option_id': 'A', 'text': 'Yes, the assumption is implicit'},
 {'option_id': 'B', 'text': 'No, the assumption is not implicit'},
 {'option_id': 'C', 'text': 'Cannot be determined'},
 {'option_id': 'D', 'text': 'The assumption contradicts the statement'},
 {'option_id': 'E', 'text': 'The statement is ambiguous'}
 ],
 'correct_answer': 'A',
 'difficulty_level': 'medium',
 'complexity_score': 2,
 'category': 'Statement and Assumption',
 'explanation': 'Making computer classes mandatory suggests that students need these skills and may not have them currently.'
 },
 {
 'question_text': 'Statement: "The restaurant will stop serving meat dishes."\nAssumption: "The restaurant wants to attract vegetarian customers."\nIs the assumption implicit in the statement?',
 'options': [
 {'option_id': 'A', 'text': 'Yes, the assumption is implicit'},
 {'option_id': 'B', 'text': 'No, the assumption is not implicit'},
 {'option_id': 'C', 'text': 'Cannot be determined'},
 {'option_id': 'D', 'text': 'The assumption contradicts the statement'},
 {'option_id': 'E', 'text': 'The statement is ambiguous'}
 ],
 'correct_answer': 'C',
 'difficulty_level': 'medium',
 'complexity_score': 2,
 'category': 'Statement and Assumption',
 'explanation': 'Stopping meat service could be for various reasons - cost, supply issues, or philosophical reasons, not necessarily to attract vegetarians.'
 },
 {
 'question_text': 'Statement: "The company will relocate its headquarters to a larger city."\nAssumption: "The current location limits business growth."\nIs the assumption implicit in the statement?',
 'options': [
 {'option_id': 'A', 'text': 'Yes, the assumption is implicit'},
 {'option_id': 'B', 'text': 'No, the assumption is not implicit'},
 {'option_id': 'C', 'text': 'Cannot be determined'},
 {'option_id': 'D', 'text': 'The assumption contradicts the statement'},
 {'option_id': 'E', 'text': 'The statement is ambiguous'}
 ],
 'correct_answer': 'A',
 'difficulty_level': 'medium',
 'complexity_score': 2,
 'category': 'Statement and Assumption',
 'explanation': 'Relocating to a larger city typically implies seeking better opportunities for growth and expansion.'
 },

 # HARD QUESTIONS (21-30)
 {
 'question_text': 'Statement: "The government will implement a universal basic income program."\nAssumption: "Traditional employment structures are becoming unsustainable."\nIs the assumption implicit in the statement?',
 'options': [
 {'option_id': 'A', 'text': 'Yes, the assumption is implicit'},
 {'option_id': 'B', 'text': 'No, the assumption is not implicit'},
 {'option_id': 'C', 'text': 'Cannot be determined'},
 {'option_id': 'D', 'text': 'The assumption contradicts the statement'},
 {'option_id': 'E', 'text': 'The statement is ambiguous'}
 ],
 'correct_answer': 'A',
 'difficulty_level': 'hard',
 'complexity_score': 3,
 'category': 'Statement and Assumption',
 'explanation': 'Universal basic income typically addresses concerns about job displacement and changing economic structures.'
 },
 {
 'question_text': 'Statement: "The pharmaceutical company will prioritize rare disease research."\nAssumption: "Rare diseases are more profitable to treat than common ones."\nIs the assumption implicit in the statement?',
 'options': [
 {'option_id': 'A', 'text': 'Yes, the assumption is implicit'},
 {'option_id': 'B', 'text': 'No, the assumption is not implicit'},
 {'option_id': 'C', 'text': 'Cannot be determined'},
 {'option_id': 'D', 'text': 'The assumption contradicts the statement'},
 {'option_id': 'E', 'text': 'The statement is ambiguous'}
 ],
 'correct_answer': 'B',
 'difficulty_level': 'hard',
 'complexity_score': 3,
 'category': 'Statement and Assumption',
 'explanation': 'Prioritizing rare diseases could be for humanitarian, regulatory, or scientific reasons, not necessarily profitability.'
 },
 {
 'question_text': 'Statement: "The university will eliminate all standardized testing requirements."\nAssumption: "Standardized tests do not accurately measure student potential."\nIs the assumption implicit in the statement?',
 'options': [
 {'option_id': 'A', 'text': 'Yes, the assumption is implicit'},
 {'option_id': 'B', 'text': 'No, the assumption is not implicit'},
 {'option_id': 'C', 'text': 'Cannot be determined'},
 {'option_id': 'D', 'text': 'The assumption contradicts the statement'},
 {'option_id': 'E', 'text': 'The statement is ambiguous'}
 ],
 'correct_answer': 'A',
 'difficulty_level': 'hard',
 'complexity_score': 3,
 'category': 'Statement and Assumption',
 'explanation': 'Eliminating standardized tests suggests they are not effective measures of student capability or potential.'
 },
 {
 'question_text': 'Statement: "The tech company will open-source all its software."\nAssumption: "Proprietary software models are becoming obsolete."\nIs the assumption implicit in the statement?',
 'options': [
 {'option_id': 'A', 'text': 'Yes, the assumption is implicit'},
 {'option_id': 'B', 'text': 'No, the assumption is not implicit'},
 {'option_id': 'C', 'text': 'Cannot be determined'},
 {'option_id': 'D', 'text': 'The assumption contradicts the statement'},
 {'option_id': 'E', 'text': 'The statement is ambiguous'}
 ],
 'correct_answer': 'C',
 'difficulty_level': 'hard',
 'complexity_score': 3,
 'category': 'Statement and Assumption',
 'explanation': 'Open-sourcing could be for various reasons - community building, security, or competitive strategy, not necessarily obsolescence of proprietary models.'
 },
 {
 'question_text': 'Statement: "The country will phase out all fossil fuel power plants."\nAssumption: "Renewable energy technology is now cost-competitive."\nIs the assumption implicit in the statement?',
 'options': [
 {'option_id': 'A', 'text': 'Yes, the assumption is implicit'},
 {'option_id': 'B', 'text': 'No, the assumption is not implicit'},
 {'option_id': 'C', 'text': 'Cannot be determined'},
 {'option_id': 'D', 'text': 'The assumption contradicts the statement'},
 {'option_id': 'E', 'text': 'The statement is ambiguous'}
 ],
 'correct_answer': 'A',
 'difficulty_level': 'hard',
 'complexity_score': 3,
 'category': 'Statement and Assumption',
 'explanation': 'Phasing out fossil fuels implies that alternatives are now viable, suggesting cost competitiveness of renewables.'
 },
 {
 'question_text': 'Statement: "The hospital will implement AI-powered diagnostic systems."\nAssumption: "Human doctors are prone to diagnostic errors."\nIs the assumption implicit in the statement?',
 'options': [
 {'option_id': 'A', 'text': 'Yes, the assumption is implicit'},
 {'option_id': 'B', 'text': 'No, the assumption is not implicit'},
 {'option_id': 'C', 'text': 'Cannot be determined'},
 {'option_id': 'D', 'text': 'The assumption contradicts the statement'},
 {'option_id': 'E', 'text': 'The statement is ambiguous'}
 ],
 'correct_answer': 'C',
 'difficulty_level': 'hard',
 'complexity_score': 3,
 'category': 'Statement and Assumption',
 'explanation': 'AI implementation could be for various reasons - efficiency, accuracy, or cost reduction, not necessarily human error concerns.'
 },
 {
 'question_text': 'Statement: "The corporation will divest all its non-core business units."\nAssumption: "Diversification strategies are less effective than specialization."\nIs the assumption implicit in the statement?',
 'options': [
 {'option_id': 'A', 'text': 'Yes, the assumption is implicit'},
 {'option_id': 'B', 'text': 'No, the assumption is not implicit'},
 {'option_id': 'C', 'text': 'Cannot be determined'},
 {'option_id': 'D', 'text': 'The assumption contradicts the statement'},
 {'option_id': 'E', 'text': 'The statement is ambiguous'}
 ],
 'correct_answer': 'A',
 'difficulty_level': 'hard',
 'complexity_score': 3,
 'category': 'Statement and Assumption',
 'explanation': 'Focusing on core units suggests that diversification is less effective than specialized focus.'
 },
 {
 'question_text': 'Statement: "The government will nationalize all private healthcare providers."\nAssumption: "Private healthcare creates inequality in access to medical services."\nIs the assumption implicit in the statement?',
 'options': [
 {'option_id': 'A', 'text': 'Yes, the assumption is implicit'},
 {'option_id': 'B', 'text': 'No, the assumption is not implicit'},
 {'option_id': 'C', 'text': 'Cannot be determined'},
 {'option_id': 'D', 'text': 'The assumption contradicts the statement'},
 {'option_id': 'E', 'text': 'The statement is ambiguous'}
 ],
 'correct_answer': 'A',
 'difficulty_level': 'hard',
 'complexity_score': 3,
 'category': 'Statement and Assumption',
 'explanation': 'Nationalizing healthcare typically aims to ensure universal access, implying that private systems create inequality.'
 },
 {
 'question_text': 'Statement: "The university will eliminate all tenure-track positions."\nAssumption: "Tenure systems inhibit academic innovation and productivity."\nIs the assumption implicit in the statement?',
 'options': [
 {'option_id': 'A', 'text': 'Yes, the assumption is implicit'},
 {'option_id': 'B', 'text': 'No, the assumption is not implicit'},
 {'option_id': 'C', 'text': 'Cannot be determined'},
 {'option_id': 'D', 'text': 'The assumption contradicts the statement'},
 {'option_id': 'E', 'text': 'The statement is ambiguous'}
 ],
 'correct_answer': 'A',
 'difficulty_level': 'hard',
 'complexity_score': 3,
 'category': 'Statement and Assumption',
 'explanation': 'Eliminating tenure suggests that the current system is counterproductive to academic goals.'
 },
 {
 'question_text': 'Statement: "The company will transition to a fully remote work model."\nAssumption: "Physical office spaces are no longer necessary for productivity."\nIs the assumption implicit in the statement?',
 'options': [
 {'option_id': 'A', 'text': 'Yes, the assumption is implicit'},
 {'option_id': 'B', 'text': 'No, the assumption is not implicit'},
 {'option_id': 'C', 'text': 'Cannot be determined'},
 {'option_id': 'D', 'text': 'The assumption contradicts the statement'},
 {'option_id': 'E', 'text': 'The statement is ambiguous'}
 ],
 'correct_answer': 'A',
 'difficulty_level': 'hard',
 'complexity_score': 3,
 'category': 'Statement and Assumption',
 'explanation': 'Going fully remote implies that physical offices are not essential for maintaining productivity and collaboration.'
 }
 ]
