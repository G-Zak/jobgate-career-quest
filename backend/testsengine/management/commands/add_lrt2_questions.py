"""
Django management command to add Matching Definitions questions for LRT2
"""

from django.core.management.base import BaseCommand
from django.db import transaction, models
from testsengine.models import Test, Question
import random

class Command(BaseCommand):
 help = 'Add Matching Definitions questions for LRT2 (Logical Reasoning - Inductive Logic)'

 def handle(self, *args, **options):
 try:
 # Get the LRT2 test (ID 31)
 test = Test.objects.get(id=31)
 self.stdout.write(f"Adding Matching Definitions questions to test: {test.title}")

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
 self.style.ERROR('LRT2 test (ID 31) not found!')
 )
 except Exception as e:
 self.stdout.write(
 self.style.ERROR(f'Error adding questions: {str(e)}')
 )

 def add_questions(self, test):
 """Add Matching Definitions questions with 3 difficulty levels"""
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
 """Return Matching Definitions questions with 3 difficulty levels"""
 return [
 # EASY QUESTIONS (1-10)
 {
 'question_text': 'Match the definition with the correct term:\n\nDefinition: "A person who studies the stars and planets"\n\nWhich term best matches this definition?',
 'options': [
 {'option_id': 'A', 'text': 'Astronomer'},
 {'option_id': 'B', 'text': 'Geologist'},
 {'option_id': 'C', 'text': 'Biologist'},
 {'option_id': 'D', 'text': 'Chemist'},
 {'option_id': 'E', 'text': 'Physicist'}
 ],
 'correct_answer': 'A',
 'difficulty_level': 'easy',
 'complexity_score': 1,
 'category': 'Matching Definitions',
 'explanation': 'An astronomer is a scientist who studies celestial objects, space, and the physical universe.'
 },
 {
 'question_text': 'Match the definition with the correct term:\n\nDefinition: "A person who designs buildings"\n\nWhich term best matches this definition?',
 'options': [
 {'option_id': 'A', 'text': 'Engineer'},
 {'option_id': 'B', 'text': 'Architect'},
 {'option_id': 'C', 'text': 'Contractor'},
 {'option_id': 'D', 'text': 'Builder'},
 {'option_id': 'E', 'text': 'Designer'}
 ],
 'correct_answer': 'B',
 'difficulty_level': 'easy',
 'complexity_score': 1,
 'category': 'Matching Definitions',
 'explanation': 'An architect is a person who designs buildings and oversees their construction.'
 },
 {
 'question_text': 'Match the definition with the correct term:\n\nDefinition: "A person who treats diseases and injuries"\n\nWhich term best matches this definition?',
 'options': [
 {'option_id': 'A', 'text': 'Nurse'},
 {'option_id': 'B', 'text': 'Doctor'},
 {'option_id': 'C', 'text': 'Surgeon'},
 {'option_id': 'D', 'text': 'Therapist'},
 {'option_id': 'E', 'text': 'Pharmacist'}
 ],
 'correct_answer': 'B',
 'difficulty_level': 'easy',
 'complexity_score': 1,
 'category': 'Matching Definitions',
 'explanation': 'A doctor is a qualified practitioner of medicine who diagnoses and treats diseases and injuries.'
 },
 {
 'question_text': 'Match the definition with the correct term:\n\nDefinition: "A person who writes books"\n\nWhich term best matches this definition?',
 'options': [
 {'option_id': 'A', 'text': 'Editor'},
 {'option_id': 'B', 'text': 'Author'},
 {'option_id': 'C', 'text': 'Publisher'},
 {'option_id': 'D', 'text': 'Journalist'},
 {'option_id': 'E', 'text': 'Writer'}
 ],
 'correct_answer': 'B',
 'difficulty_level': 'easy',
 'complexity_score': 1,
 'category': 'Matching Definitions',
 'explanation': 'An author is a person who writes books, articles, or other literary works.'
 },
 {
 'question_text': 'Match the definition with the correct term:\n\nDefinition: "A person who teaches students"\n\nWhich term best matches this definition?',
 'options': [
 {'option_id': 'A', 'text': 'Professor'},
 {'option_id': 'B', 'text': 'Teacher'},
 {'option_id': 'C', 'text': 'Instructor'},
 {'option_id': 'D', 'text': 'Tutor'},
 {'option_id': 'E', 'text': 'Educator'}
 ],
 'correct_answer': 'B',
 'difficulty_level': 'easy',
 'complexity_score': 1,
 'category': 'Matching Definitions',
 'explanation': 'A teacher is a person who teaches, especially in a school.'
 },
 {
 'question_text': 'Match the definition with the correct term:\n\nDefinition: "A person who creates art"\n\nWhich term best matches this definition?',
 'options': [
 {'option_id': 'A', 'text': 'Artist'},
 {'option_id': 'B', 'text': 'Painter'},
 {'option_id': 'C', 'text': 'Sculptor'},
 {'option_id': 'D', 'text': 'Designer'},
 {'option_id': 'E', 'text': 'Creator'}
 ],
 'correct_answer': 'A',
 'difficulty_level': 'easy',
 'complexity_score': 1,
 'category': 'Matching Definitions',
 'explanation': 'An artist is a person who creates art, especially paintings or drawings.'
 },
 {
 'question_text': 'Match the definition with the correct term:\n\nDefinition: "A person who fixes cars"\n\nWhich term best matches this definition?',
 'options': [
 {'option_id': 'A', 'text': 'Mechanic'},
 {'option_id': 'B', 'text': 'Engineer'},
 {'option_id': 'C', 'text': 'Technician'},
 {'option_id': 'D', 'text': 'Repairer'},
 {'option_id': 'E', 'text': 'Specialist'}
 ],
 'correct_answer': 'A',
 'difficulty_level': 'easy',
 'complexity_score': 1,
 'category': 'Matching Definitions',
 'explanation': 'A mechanic is a person who repairs and maintains machinery, especially cars.'
 },
 {
 'question_text': 'Match the definition with the correct term:\n\nDefinition: "A person who grows crops"\n\nWhich term best matches this definition?',
 'options': [
 {'option_id': 'A', 'text': 'Gardener'},
 {'option_id': 'B', 'text': 'Farmer'},
 {'option_id': 'C', 'text': 'Rancher'},
 {'option_id': 'D', 'text': 'Cultivator'},
 {'option_id': 'E', 'text': 'Grower'}
 ],
 'correct_answer': 'B',
 'difficulty_level': 'easy',
 'complexity_score': 1,
 'category': 'Matching Definitions',
 'explanation': 'A farmer is a person who owns or manages a farm, growing crops or raising livestock.'
 },
 {
 'question_text': 'Match the definition with the correct term:\n\nDefinition: "A person who sells goods"\n\nWhich term best matches this definition?',
 'options': [
 {'option_id': 'A', 'text': 'Merchant'},
 {'option_id': 'B', 'text': 'Salesperson'},
 {'option_id': 'C', 'text': 'Retailer'},
 {'option_id': 'D', 'text': 'Trader'},
 {'option_id': 'E', 'text': 'Vendor'}
 ],
 'correct_answer': 'B',
 'difficulty_level': 'easy',
 'complexity_score': 1,
 'category': 'Matching Definitions',
 'explanation': 'A salesperson is a person whose job is to sell goods or services.'
 },
 {
 'question_text': 'Match the definition with the correct term:\n\nDefinition: "A person who cooks food"\n\nWhich term best matches this definition?',
 'options': [
 {'option_id': 'A', 'text': 'Chef'},
 {'option_id': 'B', 'text': 'Cook'},
 {'option_id': 'C', 'text': 'Baker'},
 {'option_id': 'D', 'text': 'Culinary'},
 {'option_id': 'E', 'text': 'Kitchen'}
 ],
 'correct_answer': 'B',
 'difficulty_level': 'easy',
 'complexity_score': 1,
 'category': 'Matching Definitions',
 'explanation': 'A cook is a person who prepares and cooks food, especially as a job.'
 },

 # MEDIUM QUESTIONS (11-20)
 {
 'question_text': 'Match the definition with the correct term:\n\nDefinition: "A person who studies the behavior and characteristics of human populations"\n\nWhich term best matches this definition?',
 'options': [
 {'option_id': 'A', 'text': 'Sociologist'},
 {'option_id': 'B', 'text': 'Demographer'},
 {'option_id': 'C', 'text': 'Anthropologist'},
 {'option_id': 'D', 'text': 'Psychologist'},
 {'option_id': 'E', 'text': 'Statistician'}
 ],
 'correct_answer': 'B',
 'difficulty_level': 'medium',
 'complexity_score': 2,
 'category': 'Matching Definitions',
 'explanation': 'A demographer is a person who studies the structure and characteristics of human populations.'
 },
 {
 'question_text': 'Match the definition with the correct term:\n\nDefinition: "A person who specializes in the study of mental processes and behavior"\n\nWhich term best matches this definition?',
 'options': [
 {'option_id': 'A', 'text': 'Psychiatrist'},
 {'option_id': 'B', 'text': 'Psychologist'},
 {'option_id': 'C', 'text': 'Neurologist'},
 {'option_id': 'D', 'text': 'Therapist'},
 {'option_id': 'E', 'text': 'Counselor'}
 ],
 'correct_answer': 'B',
 'difficulty_level': 'medium',
 'complexity_score': 2,
 'category': 'Matching Definitions',
 'explanation': 'A psychologist is a person who studies mental processes and behavior, typically through research and therapy.'
 },
 {
 'question_text': 'Match the definition with the correct term:\n\nDefinition: "A person who studies the origin, history, and structure of the earth"\n\nWhich term best matches this definition?',
 'options': [
 {'option_id': 'A', 'text': 'Geologist'},
 {'option_id': 'B', 'text': 'Geographer'},
 {'option_id': 'C', 'text': 'Archaeologist'},
 {'option_id': 'D', 'text': 'Paleontologist'},
 {'option_id': 'E', 'text': 'Seismologist'}
 ],
 'correct_answer': 'A',
 'difficulty_level': 'medium',
 'complexity_score': 2,
 'category': 'Matching Definitions',
 'explanation': 'A geologist is a scientist who studies the solid and liquid matter that constitutes the Earth.'
 },
 {
 'question_text': 'Match the definition with the correct term:\n\nDefinition: "A person who studies the relationships between living organisms and their environment"\n\nWhich term best matches this definition?',
 'options': [
 {'option_id': 'A', 'text': 'Biologist'},
 {'option_id': 'B', 'text': 'Ecologist'},
 {'option_id': 'C', 'text': 'Botanist'},
 {'option_id': 'D', 'text': 'Zoologist'},
 {'option_id': 'E', 'text': 'Naturalist'}
 ],
 'correct_answer': 'B',
 'difficulty_level': 'medium',
 'complexity_score': 2,
 'category': 'Matching Definitions',
 'explanation': 'An ecologist is a scientist who studies the relationships between living organisms and their environment.'
 },
 {
 'question_text': 'Match the definition with the correct term:\n\nDefinition: "A person who studies the structure and function of living organisms"\n\nWhich term best matches this definition?',
 'options': [
 {'option_id': 'A', 'text': 'Physiologist'},
 {'option_id': 'B', 'text': 'Anatomist'},
 {'option_id': 'C', 'text': 'Biologist'},
 {'option_id': 'D', 'text': 'Pathologist'},
 {'option_id': 'E', 'text': 'Microbiologist'}
 ],
 'correct_answer': 'C',
 'difficulty_level': 'medium',
 'complexity_score': 2,
 'category': 'Matching Definitions',
 'explanation': 'A biologist is a scientist who studies living organisms and their structure, function, growth, and evolution.'
 },
 {
 'question_text': 'Match the definition with the correct term:\n\nDefinition: "A person who studies the properties and behavior of matter"\n\nWhich term best matches this definition?',
 'options': [
 {'option_id': 'A', 'text': 'Chemist'},
 {'option_id': 'B', 'text': 'Physicist'},
 {'option_id': 'C', 'text': 'Materialist'},
 {'option_id': 'D', 'text': 'Analyst'},
 {'option_id': 'E', 'text': 'Scientist'}
 ],
 'correct_answer': 'A',
 'difficulty_level': 'medium',
 'complexity_score': 2,
 'category': 'Matching Definitions',
 'explanation': 'A chemist is a scientist who studies the properties, composition, and behavior of matter.'
 },
 {
 'question_text': 'Match the definition with the correct term:\n\nDefinition: "A person who studies the development, structure, and functioning of human society"\n\nWhich term best matches this definition?',
 'options': [
 {'option_id': 'A', 'text': 'Sociologist'},
 {'option_id': 'B', 'text': 'Anthropologist'},
 {'option_id': 'C', 'text': 'Political Scientist'},
 {'option_id': 'D', 'text': 'Economist'},
 {'option_id': 'E', 'text': 'Historian'}
 ],
 'correct_answer': 'A',
 'difficulty_level': 'medium',
 'complexity_score': 2,
 'category': 'Matching Definitions',
 'explanation': 'A sociologist is a social scientist who studies the development, structure, and functioning of human society.'
 },
 {
 'question_text': 'Match the definition with the correct term:\n\nDefinition: "A person who studies the past through material remains"\n\nWhich term best matches this definition?',
 'options': [
 {'option_id': 'A', 'text': 'Historian'},
 {'option_id': 'B', 'text': 'Archaeologist'},
 {'option_id': 'C', 'text': 'Paleontologist'},
 {'option_id': 'D', 'text': 'Anthropologist'},
 {'option_id': 'E', 'text': 'Geologist'}
 ],
 'correct_answer': 'B',
 'difficulty_level': 'medium',
 'complexity_score': 2,
 'category': 'Matching Definitions',
 'explanation': 'An archaeologist is a person who studies human history through the excavation and analysis of artifacts and other physical remains.'
 },
 {
 'question_text': 'Match the definition with the correct term:\n\nDefinition: "A person who studies the production, distribution, and consumption of goods and services"\n\nWhich term best matches this definition?',
 'options': [
 {'option_id': 'A', 'text': 'Economist'},
 {'option_id': 'B', 'text': 'Accountant'},
 {'option_id': 'C', 'text': 'Financial Analyst'},
 {'option_id': 'D', 'text': 'Business Analyst'},
 {'option_id': 'E', 'text': 'Statistician'}
 ],
 'correct_answer': 'A',
 'difficulty_level': 'medium',
 'complexity_score': 2,
 'category': 'Matching Definitions',
 'explanation': 'An economist is a social scientist who studies the production, distribution, and consumption of goods and services.'
 },
 {
 'question_text': 'Match the definition with the correct term:\n\nDefinition: "A person who studies the structure and properties of substances and the changes they undergo"\n\nWhich term best matches this definition?',
 'options': [
 {'option_id': 'A', 'text': 'Chemist'},
 {'option_id': 'B', 'text': 'Physicist'},
 {'option_id': 'C', 'text': 'Biochemist'},
 {'option_id': 'D', 'text': 'Analytical Chemist'},
 {'option_id': 'E', 'text': 'Organic Chemist'}
 ],
 'correct_answer': 'A',
 'difficulty_level': 'medium',
 'complexity_score': 2,
 'category': 'Matching Definitions',
 'explanation': 'A chemist studies the structure, properties, and transformations of matter, including chemical reactions.'
 },

 # HARD QUESTIONS (21-30)
 {
 'question_text': 'Match the definition with the correct term:\n\nDefinition: "A person who studies the mathematical foundations of quantum mechanics and the behavior of matter at the atomic and subatomic level"\n\nWhich term best matches this definition?',
 'options': [
 {'option_id': 'A', 'text': 'Quantum Physicist'},
 {'option_id': 'B', 'text': 'Theoretical Physicist'},
 {'option_id': 'C', 'text': 'Mathematical Physicist'},
 {'option_id': 'D', 'text': 'Particle Physicist'},
 {'option_id': 'E', 'text': 'Nuclear Physicist'}
 ],
 'correct_answer': 'A',
 'difficulty_level': 'hard',
 'complexity_score': 3,
 'category': 'Matching Definitions',
 'explanation': 'A quantum physicist specializes in the study of quantum mechanics and the behavior of matter at atomic and subatomic levels.'
 },
 {
 'question_text': 'Match the definition with the correct term:\n\nDefinition: "A person who studies the molecular and cellular mechanisms of biological processes"\n\nWhich term best matches this definition?',
 'options': [
 {'option_id': 'A', 'text': 'Molecular Biologist'},
 {'option_id': 'B', 'text': 'Cell Biologist'},
 {'option_id': 'C', 'text': 'Biochemist'},
 {'option_id': 'D', 'text': 'Geneticist'},
 {'option_id': 'E', 'text': 'Microbiologist'}
 ],
 'correct_answer': 'A',
 'difficulty_level': 'hard',
 'complexity_score': 3,
 'category': 'Matching Definitions',
 'explanation': 'A molecular biologist studies biological processes at the molecular level, including DNA, RNA, and protein interactions.'
 },
 {
 'question_text': 'Match the definition with the correct term:\n\nDefinition: "A person who studies the computational and mathematical aspects of biological systems"\n\nWhich term best matches this definition?',
 'options': [
 {'option_id': 'A', 'text': 'Bioinformatician'},
 {'option_id': 'B', 'text': 'Computational Biologist'},
 {'option_id': 'C', 'text': 'Systems Biologist'},
 {'option_id': 'D', 'text': 'Mathematical Biologist'},
 {'option_id': 'E', 'text': 'Biostatistician'}
 ],
 'correct_answer': 'B',
 'difficulty_level': 'hard',
 'complexity_score': 3,
 'category': 'Matching Definitions',
 'explanation': 'A computational biologist uses computational methods to study biological systems and processes.'
 },
 {
 'question_text': 'Match the definition with the correct term:\n\nDefinition: "A person who studies the psychological and social factors that influence human behavior in organizational settings"\n\nWhich term best matches this definition?',
 'options': [
 {'option_id': 'A', 'text': 'Organizational Psychologist'},
 {'option_id': 'B', 'text': 'Industrial Psychologist'},
 {'option_id': 'C', 'text': 'Social Psychologist'},
 {'option_id': 'D', 'text': 'Business Psychologist'},
 {'option_id': 'E', 'text': 'Workplace Psychologist'}
 ],
 'correct_answer': 'A',
 'difficulty_level': 'hard',
 'complexity_score': 3,
 'category': 'Matching Definitions',
 'explanation': 'An organizational psychologist studies human behavior in workplace and organizational contexts.'
 },
 {
 'question_text': 'Match the definition with the correct term:\n\nDefinition: "A person who studies the mathematical modeling of complex systems and emergent behavior"\n\nWhich term best matches this definition?',
 'options': [
 {'option_id': 'A', 'text': 'Complexity Scientist'},
 {'option_id': 'B', 'text': 'Systems Theorist'},
 {'option_id': 'C', 'text': 'Mathematical Modeler'},
 {'option_id': 'D', 'text': 'Network Scientist'},
 {'option_id': 'E', 'text': 'Chaos Theorist'}
 ],
 'correct_answer': 'A',
 'difficulty_level': 'hard',
 'complexity_score': 3,
 'category': 'Matching Definitions',
 'explanation': 'A complexity scientist studies complex systems and emergent behavior using mathematical and computational models.'
 },
 {
 'question_text': 'Match the definition with the correct term:\n\nDefinition: "A person who studies the intersection of neuroscience, psychology, and computer science to understand brain function"\n\nWhich term best matches this definition?',
 'options': [
 {'option_id': 'A', 'text': 'Cognitive Neuroscientist'},
 {'option_id': 'B', 'text': 'Computational Neuroscientist'},
 {'option_id': 'C', 'text': 'Neuropsychologist'},
 {'option_id': 'D', 'text': 'Brain Scientist'},
 {'option_id': 'E', 'text': 'Neural Engineer'}
 ],
 'correct_answer': 'B',
 'difficulty_level': 'hard',
 'complexity_score': 3,
 'category': 'Matching Definitions',
 'explanation': 'A computational neuroscientist uses computational methods to study brain function and neural systems.'
 },
 {
 'question_text': 'Match the definition with the correct term:\n\nDefinition: "A person who studies the mathematical foundations of machine learning and artificial intelligence"\n\nWhich term best matches this definition?',
 'options': [
 {'option_id': 'A', 'text': 'Machine Learning Engineer'},
 {'option_id': 'B', 'text': 'AI Researcher'},
 {'option_id': 'C', 'text': 'Theoretical Computer Scientist'},
 {'option_id': 'D', 'text': 'Algorithmic Theorist'},
 {'option_id': 'E', 'text': 'Data Scientist'}
 ],
 'correct_answer': 'C',
 'difficulty_level': 'hard',
 'complexity_score': 3,
 'category': 'Matching Definitions',
 'explanation': 'A theoretical computer scientist studies the mathematical foundations of computing, including machine learning algorithms.'
 },
 {
 'question_text': 'Match the definition with the correct term:\n\nDefinition: "A person who studies the mathematical modeling of financial markets and economic systems"\n\nWhich term best matches this definition?',
 'options': [
 {'option_id': 'A', 'text': 'Quantitative Analyst'},
 {'option_id': 'B', 'text': 'Financial Mathematician'},
 {'option_id': 'C', 'text': 'Econometrician'},
 {'option_id': 'D', 'text': 'Mathematical Economist'},
 {'option_id': 'E', 'text': 'Risk Analyst'}
 ],
 'correct_answer': 'D',
 'difficulty_level': 'hard',
 'complexity_score': 3,
 'category': 'Matching Definitions',
 'explanation': 'A mathematical economist uses mathematical methods to model and analyze economic systems and financial markets.'
 },
 {
 'question_text': 'Match the definition with the correct term:\n\nDefinition: "A person who studies the mathematical foundations of information theory and communication systems"\n\nWhich term best matches this definition?',
 'options': [
 {'option_id': 'A', 'text': 'Information Theorist'},
 {'option_id': 'B', 'text': 'Communication Engineer'},
 {'option_id': 'C', 'text': 'Signal Processing Engineer'},
 {'option_id': 'D', 'text': 'Telecommunications Engineer'},
 {'option_id': 'E', 'text': 'Network Engineer'}
 ],
 'correct_answer': 'A',
 'difficulty_level': 'hard',
 'complexity_score': 3,
 'category': 'Matching Definitions',
 'explanation': 'An information theorist studies the mathematical foundations of information theory, including data compression and communication.'
 },
 {
 'question_text': 'Match the definition with the correct term:\n\nDefinition: "A person who studies the mathematical modeling of climate systems and environmental processes"\n\nWhich term best matches this definition?',
 'options': [
 {'option_id': 'A', 'text': 'Climate Modeler'},
 {'option_id': 'B', 'text': 'Environmental Mathematician'},
 {'option_id': 'C', 'text': 'Atmospheric Scientist'},
 {'option_id': 'D', 'text': 'Earth System Scientist'},
 {'option_id': 'E', 'text': 'Climate Scientist'}
 ],
 'correct_answer': 'A',
 'difficulty_level': 'hard',
 'complexity_score': 3,
 'category': 'Matching Definitions',
 'explanation': 'A climate modeler uses mathematical and computational models to study climate systems and environmental processes.'
 }
 ]
