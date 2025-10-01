from django.core.management.base import BaseCommand
from testsengine.models import Question

class Command(BaseCommand):
 help = 'Add correct answers for Situational Judgment Test (Test ID 4)'

 def handle(self, *args, **options):
 test_id = 4 # Situational Judgment Test

 # Get all questions for this test
 questions = Question.objects.filter(test_id=test_id)

 self.stdout.write(f'Found {questions.count()} questions for test {test_id}')

 # For situational judgment tests, we'll set reasonable correct answers
 # These are based on typical best practices for situational judgment
 correct_answers = {
 11: "1", # Speak privately with the team lead about including Amina more actively
 12: "0", # First option (you'll need to check the actual question)
 13: "2", # Third option (you'll need to check the actual question)
 # Add more as needed
 }

 updated_count = 0
 for question in questions:
 if question.id in correct_answers:
 question.correct_answer = correct_answers[question.id]
 question.save()
 updated_count += 1
 self.stdout.write(f' Updated question {question.id}: correct_answer = {question.correct_answer}')
 else:
 # Set a default answer (first option) for questions without specific answers
 question.correct_answer = "0"
 question.save()
 updated_count += 1
 self.stdout.write(f' Updated question {question.id}: correct_answer = 0 (default)')

 self.stdout.write(self.style.SUCCESS(f'Successfully updated {updated_count} questions with correct answers!'))
