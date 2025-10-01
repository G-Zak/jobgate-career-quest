"""
Django management command to add Logical Deduction questions for LRT3
"""

from django.core.management.base import BaseCommand
from django.db import transaction, models
from testsengine.models import Test, Question
import random

class Command(BaseCommand):
 help = 'Add Logical Deduction questions for LRT3 (Logical Reasoning - Critical Thinking)'

 def handle(self, *args, **options):
 try:
 # Get the LRT3 test (ID 32)
 test = Test.objects.get(id=32)
 self.stdout.write(f"Adding Logical Deduction questions to test: {test.title}")

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
 self.style.ERROR('LRT3 test (ID 32) not found!')
 )
 except Exception as e:
 self.stdout.write(
 self.style.ERROR(f'Error adding questions: {str(e)}')
 )

 def add_questions(self, test):
 """Add Logical Deduction questions with 3 difficulty levels"""
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
 """Return Logical Deduction questions with 3 difficulty levels"""
 return [
 # EASY QUESTIONS (1-10)
 {
 'question_text': 'Premise 1: All birds have feathers.\nPremise 2: Penguins are birds.\nConclusion: Penguins have feathers.\n\nIs this conclusion valid?',
 'options': [
 {'option_id': 'A', 'text': 'Yes, the conclusion is valid'},
 {'option_id': 'B', 'text': 'No, the conclusion is invalid'},
 {'option_id': 'C', 'text': 'Cannot be determined'},
 {'option_id': 'D', 'text': 'The premises are contradictory'},
 {'option_id': 'E', 'text': 'More information is needed'}
 ],
 'correct_answer': 'A',
 'difficulty_level': 'easy',
 'complexity_score': 1,
 'category': 'Logical Deduction',
 'explanation': 'This is a valid syllogism. If all birds have feathers and penguins are birds, then penguins must have feathers.'
 },
 {
 'question_text': 'Premise 1: If it rains, the ground gets wet.\nPremise 2: It is raining.\nConclusion: The ground is wet.\n\nIs this conclusion valid?',
 'options': [
 {'option_id': 'A', 'text': 'Yes, the conclusion is valid'},
 {'option_id': 'B', 'text': 'No, the conclusion is invalid'},
 {'option_id': 'C', 'text': 'Cannot be determined'},
 {'option_id': 'D', 'text': 'The premises are contradictory'},
 {'option_id': 'E', 'text': 'More information is needed'}
 ],
 'correct_answer': 'A',
 'difficulty_level': 'easy',
 'complexity_score': 1,
 'category': 'Logical Deduction',
 'explanation': 'This is a valid modus ponens. If P then Q, and P is true, therefore Q is true.'
 },
 {
 'question_text': 'Premise 1: All students must wear uniforms.\nPremise 2: John is a student.\nConclusion: John must wear a uniform.\n\nIs this conclusion valid?',
 'options': [
 {'option_id': 'A', 'text': 'Yes, the conclusion is valid'},
 {'option_id': 'B', 'text': 'No, the conclusion is invalid'},
 {'option_id': 'C', 'text': 'Cannot be determined'},
 {'option_id': 'D', 'text': 'The premises are contradictory'},
 {'option_id': 'E', 'text': 'More information is needed'}
 ],
 'correct_answer': 'A',
 'difficulty_level': 'easy',
 'complexity_score': 1,
 'category': 'Logical Deduction',
 'explanation': 'This is a valid syllogism. If all students must wear uniforms and John is a student, then John must wear a uniform.'
 },
 {
 'question_text': 'Premise 1: If the car is out of gas, it will not start.\nPremise 2: The car will not start.\nConclusion: The car is out of gas.\n\nIs this conclusion valid?',
 'options': [
 {'option_id': 'A', 'text': 'Yes, the conclusion is valid'},
 {'option_id': 'B', 'text': 'No, the conclusion is invalid'},
 {'option_id': 'C', 'text': 'Cannot be determined'},
 {'option_id': 'D', 'text': 'The premises are contradictory'},
 {'option_id': 'E', 'text': 'More information is needed'}
 ],
 'correct_answer': 'B',
 'difficulty_level': 'easy',
 'complexity_score': 1,
 'category': 'Logical Deduction',
 'explanation': 'This is the fallacy of affirming the consequent. The car may not start for reasons other than being out of gas.'
 },
 {
 'question_text': 'Premise 1: All roses are flowers.\nPremise 2: This is a rose.\nConclusion: This is a flower.\n\nIs this conclusion valid?',
 'options': [
 {'option_id': 'A', 'text': 'Yes, the conclusion is valid'},
 {'option_id': 'B', 'text': 'No, the conclusion is invalid'},
 {'option_id': 'C', 'text': 'Cannot be determined'},
 {'option_id': 'D', 'text': 'The premises are contradictory'},
 {'option_id': 'E', 'text': 'More information is needed'}
 ],
 'correct_answer': 'A',
 'difficulty_level': 'easy',
 'complexity_score': 1,
 'category': 'Logical Deduction',
 'explanation': 'This is a valid syllogism. If all roses are flowers and this is a rose, then this is a flower.'
 },
 {
 'question_text': 'Premise 1: If you study hard, you will pass the exam.\nPremise 2: You did not study hard.\nConclusion: You will not pass the exam.\n\nIs this conclusion valid?',
 'options': [
 {'option_id': 'A', 'text': 'Yes, the conclusion is valid'},
 {'option_id': 'B', 'text': 'No, the conclusion is invalid'},
 {'option_id': 'C', 'text': 'Cannot be determined'},
 {'option_id': 'D', 'text': 'The premises are contradictory'},
 {'option_id': 'E', 'text': 'More information is needed'}
 ],
 'correct_answer': 'B',
 'difficulty_level': 'easy',
 'complexity_score': 1,
 'category': 'Logical Deduction',
 'explanation': 'This is the fallacy of denying the antecedent. Not studying hard does not necessarily mean you will fail; you might pass for other reasons.'
 },
 {
 'question_text': 'Premise 1: All mammals are warm-blooded.\nPremise 2: Whales are mammals.\nConclusion: Whales are warm-blooded.\n\nIs this conclusion valid?',
 'options': [
 {'option_id': 'A', 'text': 'Yes, the conclusion is valid'},
 {'option_id': 'B', 'text': 'No, the conclusion is invalid'},
 {'option_id': 'C', 'text': 'Cannot be determined'},
 {'option_id': 'D', 'text': 'The premises are contradictory'},
 {'option_id': 'E', 'text': 'More information is needed'}
 ],
 'correct_answer': 'A',
 'difficulty_level': 'easy',
 'complexity_score': 1,
 'category': 'Logical Deduction',
 'explanation': 'This is a valid syllogism. If all mammals are warm-blooded and whales are mammals, then whales are warm-blooded.'
 },
 {
 'question_text': 'Premise 1: If the door is locked, we cannot enter.\nPremise 2: We cannot enter.\nConclusion: The door is locked.\n\nIs this conclusion valid?',
 'options': [
 {'option_id': 'A', 'text': 'Yes, the conclusion is valid'},
 {'option_id': 'B', 'text': 'No, the conclusion is invalid'},
 {'option_id': 'C', 'text': 'Cannot be determined'},
 {'option_id': 'D', 'text': 'The premises are contradictory'},
 {'option_id': 'E', 'text': 'More information is needed'}
 ],
 'correct_answer': 'B',
 'difficulty_level': 'easy',
 'complexity_score': 1,
 'category': 'Logical Deduction',
 'explanation': 'This is the fallacy of affirming the consequent. There may be other reasons why we cannot enter besides the door being locked.'
 },
 {
 'question_text': 'Premise 1: All triangles have three sides.\nPremise 2: This shape has three sides.\nConclusion: This shape is a triangle.\n\nIs this conclusion valid?',
 'options': [
 {'option_id': 'A', 'text': 'Yes, the conclusion is valid'},
 {'option_id': 'B', 'text': 'No, the conclusion is invalid'},
 {'option_id': 'C', 'text': 'Cannot be determined'},
 {'option_id': 'D', 'text': 'The premises are contradictory'},
 {'option_id': 'E', 'text': 'More information is needed'}
 ],
 'correct_answer': 'B',
 'difficulty_level': 'easy',
 'complexity_score': 1,
 'category': 'Logical Deduction',
 'explanation': 'This is the fallacy of affirming the consequent. Having three sides is necessary but not sufficient to be a triangle.'
 },
 {
 'question_text': 'Premise 1: If it is snowing, the temperature is below freezing.\nPremise 2: The temperature is below freezing.\nConclusion: It is snowing.\n\nIs this conclusion valid?',
 'options': [
 {'option_id': 'A', 'text': 'Yes, the conclusion is valid'},
 {'option_id': 'B', 'text': 'No, the conclusion is invalid'},
 {'option_id': 'C', 'text': 'Cannot be determined'},
 {'option_id': 'D', 'text': 'The premises are contradictory'},
 {'option_id': 'E', 'text': 'More information is needed'}
 ],
 'correct_answer': 'B',
 'difficulty_level': 'easy',
 'complexity_score': 1,
 'category': 'Logical Deduction',
 'explanation': 'This is the fallacy of affirming the consequent. Below-freezing temperature is necessary but not sufficient for snow.'
 },

 # MEDIUM QUESTIONS (11-20)
 {
 'question_text': 'Premise 1: If A implies B, and B implies C, then A implies C.\nPremise 2: If it rains, the ground gets wet.\nPremise 3: If the ground gets wet, plants grow better.\nConclusion: If it rains, plants grow better.\n\nIs this conclusion valid?',
 'options': [
 {'option_id': 'A', 'text': 'Yes, the conclusion is valid'},
 {'option_id': 'B', 'text': 'No, the conclusion is invalid'},
 {'option_id': 'C', 'text': 'Cannot be determined'},
 {'option_id': 'D', 'text': 'The premises are contradictory'},
 {'option_id': 'E', 'text': 'More information is needed'}
 ],
 'correct_answer': 'A',
 'difficulty_level': 'medium',
 'complexity_score': 2,
 'category': 'Logical Deduction',
 'explanation': 'This is a valid chain of implications. If A→B and B→C, then A→C. Rain→wet ground→better plant growth, so rain→better plant growth.'
 },
 {
 'question_text': 'Premise 1: Either P or Q is true.\nPremise 2: P is false.\nConclusion: Q is true.\n\nIs this conclusion valid?',
 'options': [
 {'option_id': 'A', 'text': 'Yes, the conclusion is valid'},
 {'option_id': 'B', 'text': 'No, the conclusion is invalid'},
 {'option_id': 'C', 'text': 'Cannot be determined'},
 {'option_id': 'D', 'text': 'The premises are contradictory'},
 {'option_id': 'E', 'text': 'More information is needed'}
 ],
 'correct_answer': 'A',
 'difficulty_level': 'medium',
 'complexity_score': 2,
 'category': 'Logical Deduction',
 'explanation': 'This is valid disjunctive syllogism. If P∨Q and ¬P, then Q must be true.'
 },
 {
 'question_text': 'Premise 1: All A are B.\nPremise 2: Some B are C.\nConclusion: Some A are C.\n\nIs this conclusion valid?',
 'options': [
 {'option_id': 'A', 'text': 'Yes, the conclusion is valid'},
 {'option_id': 'B', 'text': 'No, the conclusion is invalid'},
 {'option_id': 'C', 'text': 'Cannot be determined'},
 {'option_id': 'D', 'text': 'The premises are contradictory'},
 {'option_id': 'E', 'text': 'More information is needed'}
 ],
 'correct_answer': 'B',
 'difficulty_level': 'medium',
 'complexity_score': 2,
 'category': 'Logical Deduction',
 'explanation': 'This is the fallacy of undistributed middle. The conclusion does not follow because the middle term B is not distributed in the second premise.'
 },
 {
 'question_text': 'Premise 1: If not A, then B.\nPremise 2: If B, then C.\nPremise 3: Not C.\nConclusion: A.\n\nIs this conclusion valid?',
 'options': [
 {'option_id': 'A', 'text': 'Yes, the conclusion is valid'},
 {'option_id': 'B', 'text': 'No, the conclusion is invalid'},
 {'option_id': 'C', 'text': 'Cannot be determined'},
 {'option_id': 'D', 'text': 'The premises are contradictory'},
 {'option_id': 'E', 'text': 'More information is needed'}
 ],
 'correct_answer': 'A',
 'difficulty_level': 'medium',
 'complexity_score': 2,
 'category': 'Logical Deduction',
 'explanation': 'This is valid. If ¬A→B and B→C, then ¬A→C. If ¬C, then by contraposition, ¬(¬A), which means A.'
 },
 {
 'question_text': 'Premise 1: All X are Y.\nPremise 2: No Y are Z.\nConclusion: No X are Z.\n\nIs this conclusion valid?',
 'options': [
 {'option_id': 'A', 'text': 'Yes, the conclusion is valid'},
 {'option_id': 'B', 'text': 'No, the conclusion is invalid'},
 {'option_id': 'C', 'text': 'Cannot be determined'},
 {'option_id': 'D', 'text': 'The premises are contradictory'},
 {'option_id': 'E', 'text': 'More information is needed'}
 ],
 'correct_answer': 'A',
 'difficulty_level': 'medium',
 'complexity_score': 2,
 'category': 'Logical Deduction',
 'explanation': 'This is a valid syllogism. If all X are Y and no Y are Z, then no X are Z (by transitivity of the universal negative).'
 },
 {
 'question_text': 'Premise 1: If A and B, then C.\nPremise 2: A is true.\nPremise 3: B is true.\nConclusion: C is true.\n\nIs this conclusion valid?',
 'options': [
 {'option_id': 'A', 'text': 'Yes, the conclusion is valid'},
 {'option_id': 'B', 'text': 'No, the conclusion is invalid'},
 {'option_id': 'C', 'text': 'Cannot be determined'},
 {'option_id': 'D', 'text': 'The premises are contradictory'},
 {'option_id': 'E', 'text': 'More information is needed'}
 ],
 'correct_answer': 'A',
 'difficulty_level': 'medium',
 'complexity_score': 2,
 'category': 'Logical Deduction',
 'explanation': 'This is valid. If (A∧B)→C and both A and B are true, then A∧B is true, so C must be true.'
 },
 {
 'question_text': 'Premise 1: Some A are B.\nPremise 2: All B are C.\nConclusion: Some A are C.\n\nIs this conclusion valid?',
 'options': [
 {'option_id': 'A', 'text': 'Yes, the conclusion is valid'},
 {'option_id': 'B', 'text': 'No, the conclusion is invalid'},
 {'option_id': 'C', 'text': 'Cannot be determined'},
 {'option_id': 'D', 'text': 'The premises are contradictory'},
 {'option_id': 'E', 'text': 'More information is needed'}
 ],
 'correct_answer': 'A',
 'difficulty_level': 'medium',
 'complexity_score': 2,
 'category': 'Logical Deduction',
 'explanation': 'This is valid. If some A are B and all B are C, then some A are C (by transitivity of the particular affirmative).'
 },
 {
 'question_text': 'Premise 1: If P, then Q.\nPremise 2: If Q, then R.\nPremise 3: If R, then S.\nPremise 4: P is true.\nConclusion: S is true.\n\nIs this conclusion valid?',
 'options': [
 {'option_id': 'A', 'text': 'Yes, the conclusion is valid'},
 {'option_id': 'B', 'text': 'No, the conclusion is invalid'},
 {'option_id': 'C', 'text': 'Cannot be determined'},
 {'option_id': 'D', 'text': 'The premises are contradictory'},
 {'option_id': 'E', 'text': 'More information is needed'}
 ],
 'correct_answer': 'A',
 'difficulty_level': 'medium',
 'complexity_score': 2,
 'category': 'Logical Deduction',
 'explanation': 'This is valid. If P→Q, Q→R, R→S, and P is true, then by modus ponens: Q is true, then R is true, then S is true.'
 },
 {
 'question_text': 'Premise 1: Either A or B or C.\nPremise 2: Not A.\nPremise 3: Not B.\nConclusion: C.\n\nIs this conclusion valid?',
 'options': [
 {'option_id': 'A', 'text': 'Yes, the conclusion is valid'},
 {'option_id': 'B', 'text': 'No, the conclusion is invalid'},
 {'option_id': 'C', 'text': 'Cannot be determined'},
 {'option_id': 'D', 'text': 'The premises are contradictory'},
 {'option_id': 'E', 'text': 'More information is needed'}
 ],
 'correct_answer': 'A',
 'difficulty_level': 'medium',
 'complexity_score': 2,
 'category': 'Logical Deduction',
 'explanation': 'This is valid. If A∨B∨C and both ¬A and ¬B, then by elimination, C must be true.'
 },
 {
 'question_text': 'Premise 1: All X are Y.\nPremise 2: Some Y are Z.\nPremise 3: All Z are W.\nConclusion: Some X are W.\n\nIs this conclusion valid?',
 'options': [
 {'option_id': 'A', 'text': 'Yes, the conclusion is valid'},
 {'option_id': 'B', 'text': 'No, the conclusion is invalid'},
 {'option_id': 'C', 'text': 'Cannot be determined'},
 {'option_id': 'D', 'text': 'The premises are contradictory'},
 {'option_id': 'E', 'text': 'More information is needed'}
 ],
 'correct_answer': 'B',
 'difficulty_level': 'medium',
 'complexity_score': 2,
 'category': 'Logical Deduction',
 'explanation': 'This is invalid. The middle term Y is not distributed in the second premise, making this an invalid syllogism.'
 },

 # HARD QUESTIONS (21-30)
 {
 'question_text': 'Premise 1: If (A and B) or (C and D), then E.\nPremise 2: If E, then F.\nPremise 3: Not F.\nPremise 4: A is true.\nPremise 5: B is true.\nConclusion: Not (C and D).\n\nIs this conclusion valid?',
 'options': [
 {'option_id': 'A', 'text': 'Yes, the conclusion is valid'},
 {'option_id': 'B', 'text': 'No, the conclusion is invalid'},
 {'option_id': 'C', 'text': 'Cannot be determined'},
 {'option_id': 'D', 'text': 'The premises are contradictory'},
 {'option_id': 'E', 'text': 'More information is needed'}
 ],
 'correct_answer': 'A',
 'difficulty_level': 'hard',
 'complexity_score': 3,
 'category': 'Logical Deduction',
 'explanation': 'This is valid. If (A∧B)∨(C∧D)→E and E→F, then (A∧B)∨(C∧D)→F. If ¬F, then ¬[(A∧B)∨(C∧D)]. Since A∧B is true, ¬(C∧D) must be true.'
 },
 {
 'question_text': 'Premise 1: For all x, if P(x) then Q(x).\nPremise 2: For all x, if Q(x) then R(x).\nPremise 3: There exists an x such that P(x).\nConclusion: There exists an x such that R(x).\n\nIs this conclusion valid?',
 'options': [
 {'option_id': 'A', 'text': 'Yes, the conclusion is valid'},
 {'option_id': 'B', 'text': 'No, the conclusion is invalid'},
 {'option_id': 'C', 'text': 'Cannot be determined'},
 {'option_id': 'D', 'text': 'The premises are contradictory'},
 {'option_id': 'E', 'text': 'More information is needed'}
 ],
 'correct_answer': 'A',
 'difficulty_level': 'hard',
 'complexity_score': 3,
 'category': 'Logical Deduction',
 'explanation': 'This is valid. If ∀x(P(x)→Q(x)) and ∀x(Q(x)→R(x)), then ∀x(P(x)→R(x)). If ∃xP(x), then by modus ponens, ∃xR(x).'
 },
 {
 'question_text': 'Premise 1: If A implies B, then C implies D.\nPremise 2: If C implies D, then E implies F.\nPremise 3: A implies B.\nPremise 4: Not F.\nConclusion: Not E.\n\nIs this conclusion valid?',
 'options': [
 {'option_id': 'A', 'text': 'Yes, the conclusion is valid'},
 {'option_id': 'B', 'text': 'No, the conclusion is invalid'},
 {'option_id': 'C', 'text': 'Cannot be determined'},
 {'option_id': 'D', 'text': 'The premises are contradictory'},
 {'option_id': 'E', 'text': 'More information is needed'}
 ],
 'correct_answer': 'A',
 'difficulty_level': 'hard',
 'complexity_score': 3,
 'category': 'Logical Deduction',
 'explanation': 'This is valid. If (A→B)→(C→D) and (C→D)→(E→F), then (A→B)→(E→F). If A→B and ¬F, then by modus tollens, ¬E.'
 },
 {
 'question_text': 'Premise 1: All A are B.\nPremise 2: Some B are not C.\nPremise 3: All C are D.\nConclusion: Some A are not D.\n\nIs this conclusion valid?',
 'options': [
 {'option_id': 'A', 'text': 'Yes, the conclusion is valid'},
 {'option_id': 'B', 'text': 'No, the conclusion is invalid'},
 {'option_id': 'C', 'text': 'Cannot be determined'},
 {'option_id': 'D', 'text': 'The premises are contradictory'},
 {'option_id': 'E', 'text': 'More information is needed'}
 ],
 'correct_answer': 'B',
 'difficulty_level': 'hard',
 'complexity_score': 3,
 'category': 'Logical Deduction',
 'explanation': 'This is invalid. The conclusion does not follow because the premises do not establish a connection between A and D through the given relationships.'
 },
 {
 'question_text': 'Premise 1: If P then (Q or R).\nPremise 2: If Q then S.\nPremise 3: If R then T.\nPremise 4: P is true.\nPremise 5: Not S.\nPremise 6: Not T.\nConclusion: Contradiction.\n\nIs this conclusion valid?',
 'options': [
 {'option_id': 'A', 'text': 'Yes, the conclusion is valid'},
 {'option_id': 'B', 'text': 'No, the conclusion is invalid'},
 {'option_id': 'C', 'text': 'Cannot be determined'},
 {'option_id': 'D', 'text': 'The premises are contradictory'},
 {'option_id': 'E', 'text': 'More information is needed'}
 ],
 'correct_answer': 'A',
 'difficulty_level': 'hard',
 'complexity_score': 3,
 'category': 'Logical Deduction',
 'explanation': 'This is valid. If P→(Q∨R), Q→S, R→T, P is true, and both ¬S and ¬T, then we have Q∨R, but both Q and R lead to contradictions, so the premises are inconsistent.'
 },
 {
 'question_text': 'Premise 1: For all x, (P(x) and Q(x)) implies R(x).\nPremise 2: There exists an x such that P(x) and not R(x).\nConclusion: There exists an x such that not Q(x).\n\nIs this conclusion valid?',
 'options': [
 {'option_id': 'A', 'text': 'Yes, the conclusion is valid'},
 {'option_id': 'B', 'text': 'No, the conclusion is invalid'},
 {'option_id': 'C', 'text': 'Cannot be determined'},
 {'option_id': 'D', 'text': 'The premises are contradictory'},
 {'option_id': 'E', 'text': 'More information is needed'}
 ],
 'correct_answer': 'A',
 'difficulty_level': 'hard',
 'complexity_score': 3,
 'category': 'Logical Deduction',
 'explanation': 'This is valid. If ∀x((P(x)∧Q(x))→R(x)) and ∃x(P(x)∧¬R(x)), then for some x, P(x) is true but R(x) is false. Since (P(x)∧Q(x))→R(x), we must have ¬(P(x)∧Q(x)), which means ¬Q(x).'
 },
 {
 'question_text': 'Premise 1: If A then (B and C).\nPremise 2: If (B and C) then D.\nPremise 3: If D then E.\nPremise 4: A is true.\nPremise 5: Not E.\nConclusion: The premises are inconsistent.\n\nIs this conclusion valid?',
 'options': [
 {'option_id': 'A', 'text': 'Yes, the conclusion is valid'},
 {'option_id': 'B', 'text': 'No, the conclusion is invalid'},
 {'option_id': 'C', 'text': 'Cannot be determined'},
 {'option_id': 'D', 'text': 'The premises are contradictory'},
 {'option_id': 'E', 'text': 'More information is needed'}
 ],
 'correct_answer': 'A',
 'difficulty_level': 'hard',
 'complexity_score': 3,
 'category': 'Logical Deduction',
 'explanation': 'This is valid. If A→(B∧C), (B∧C)→D, D→E, A is true, and ¬E, then we have A→E but ¬E, which is a contradiction, making the premises inconsistent.'
 },
 {
 'question_text': 'Premise 1: All X are Y.\nPremise 2: Some Y are Z.\nPremise 3: All Z are W.\nPremise 4: No W are V.\nConclusion: Some X are not V.\n\nIs this conclusion valid?',
 'options': [
 {'option_id': 'A', 'text': 'Yes, the conclusion is valid'},
 {'option_id': 'B', 'text': 'No, the conclusion is invalid'},
 {'option_id': 'C', 'text': 'Cannot be determined'},
 {'option_id': 'D', 'text': 'The premises are contradictory'},
 {'option_id': 'E', 'text': 'More information is needed'}
 ],
 'correct_answer': 'B',
 'difficulty_level': 'hard',
 'complexity_score': 3,
 'category': 'Logical Deduction',
 'explanation': 'This is invalid. The premises do not establish a sufficient connection between X and V to validly conclude that some X are not V.'
 },
 {
 'question_text': 'Premise 1: If P then Q.\nPremise 2: If R then S.\nPremise 3: P or R.\nPremise 4: Not Q.\nPremise 5: Not S.\nConclusion: Contradiction.\n\nIs this conclusion valid?',
 'options': [
 {'option_id': 'A', 'text': 'Yes, the conclusion is valid'},
 {'option_id': 'B', 'text': 'No, the conclusion is invalid'},
 {'option_id': 'C', 'text': 'Cannot be determined'},
 {'option_id': 'D', 'text': 'The premises are contradictory'},
 {'option_id': 'E', 'text': 'More information is needed'}
 ],
 'correct_answer': 'A',
 'difficulty_level': 'hard',
 'complexity_score': 3,
 'category': 'Logical Deduction',
 'explanation': 'This is valid. If P→Q, R→S, P∨R, ¬Q, and ¬S, then by modus tollens, ¬P and ¬R. But P∨R requires at least one to be true, creating a contradiction.'
 },
 {
 'question_text': 'Premise 1: For all x, if P(x) then Q(x).\nPremise 2: For all x, if Q(x) then R(x).\nPremise 3: For all x, if R(x) then S(x).\nPremise 4: There exists an x such that P(x).\nPremise 5: There exists an x such that not S(x).\nConclusion: The premises are inconsistent.\n\nIs this conclusion valid?',
 'options': [
 {'option_id': 'A', 'text': 'Yes, the conclusion is valid'},
 {'option_id': 'B', 'text': 'No, the conclusion is invalid'},
 {'option_id': 'C', 'text': 'Cannot be determined'},
 {'option_id': 'D', 'text': 'The premises are contradictory'},
 {'option_id': 'E', 'text': 'More information is needed'}
 ],
 'correct_answer': 'A',
 'difficulty_level': 'hard',
 'complexity_score': 3,
 'category': 'Logical Deduction',
 'explanation': 'This is valid. If ∀x(P(x)→Q(x)), ∀x(Q(x)→R(x)), ∀x(R(x)→S(x)), ∃xP(x), and ∃x¬S(x), then we have P(x)→S(x) for all x, but some x has ¬S(x), creating a contradiction.'
 }
 ]
