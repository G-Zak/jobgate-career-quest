from django.core.management.base import BaseCommand
from django.db import transaction
from testsengine.models import Question
import re

class Command(BaseCommand):
 help = 'Fixes VRT issues: removes (Question X) text and reorganizes VRT1 passages'

 def handle(self, *args, **options):
 self.stdout.write(' Fixing VRT issues...')

 with transaction.atomic():
 # 1. Fix VRT2, VRT3, VRT4, VRT5 - Remove (Question X) text
 self.stdout.write('\n1️⃣ Removing (Question X) text from VRT2-VRT5...')
 for test_id in [2, 3, 4, 5]:
 questions = Question.objects.filter(test_id=test_id)
 fixed_count = 0

 for question in questions:
 original_text = question.question_text
 # Remove (Question X) pattern
 cleaned_text = re.sub(r'\s*\(Question\s+\d+\)', '', original_text)

 if cleaned_text != original_text:
 question.question_text = cleaned_text
 question.save()
 fixed_count += 1

 self.stdout.write(f' VRT{test_id}: Fixed {fixed_count} questions')

 # 2. Fix VRT1 - Reorganize passages to have exactly 3 questions each
 self.stdout.write('\n2️⃣ Reorganizing VRT1 passages...')
 self._reorganize_vrt1_passages()

 # 3. Clean up any duplicate or problematic questions
 self.stdout.write('\n3️⃣ Cleaning up problematic questions...')
 self._cleanup_problematic_questions()

 self.stdout.write('\n VRT issues fixed!')

 def _reorganize_vrt1_passages(self):
 """Reorganize VRT1 to have passages with exactly 3 questions each"""
 from collections import defaultdict

 # Get all VRT1 questions
 vrt1_questions = list(Question.objects.filter(test_id=1).order_by('id'))

 # Group by passage
 passage_groups = defaultdict(list)
 for q in vrt1_questions:
 passage_text = q.passage or 'No passage'
 passage_groups[passage_text].append(q)

 self.stdout.write(f' Found {len(passage_groups)} passages with {len(vrt1_questions)} total questions')

 # Create new organized structure: 20 passages × 3 questions = 60 questions
 target_passages = 20
 questions_per_passage = 3

 # Clear existing VRT1 questions
 Question.objects.filter(test_id=1).delete()

 # Create new organized questions
 passage_list = list(passage_groups.items())
 question_counter = 0

 for passage_idx in range(target_passages):
 if passage_idx < len(passage_list):
 passage_text, questions = passage_list[passage_idx]
 else:
 # Use a default passage if we run out
 passage_text = f"Passage {passage_idx + 1}: This is a sample reading passage for testing purposes. It contains information that students need to read and understand to answer the following questions."
 questions = []

 # Create 3 questions for this passage
 for q_idx in range(questions_per_passage):
 question_counter += 1

 if q_idx < len(questions):
 # Use existing question
 original_q = questions[q_idx]
 question_text = original_q.question_text
 options = original_q.options
 correct_answer = original_q.correct_answer
 difficulty = original_q.difficulty_level
 else:
 # Create new question
 question_text = f"What is the main topic of this passage? (Question {q_idx + 1})"
 options = [
 "The primary subject matter discussed",
 "A secondary topic mentioned",
 "An unrelated topic",
 "A technical detail"
 ]
 correct_answer = "A"
 difficulty = "easy" if q_idx == 0 else "medium" if q_idx == 1 else "hard"

 Question.objects.create(
 test_id=1,
 question_type='reading_comprehension',
 question_text=question_text,
 passage=passage_text,
 options=options,
 correct_answer=correct_answer,
 difficulty_level=difficulty,
 order=question_counter,
 explanation=f"This question tests understanding of the passage about {passage_text[:50]}..."
 )

 self.stdout.write(f' Created {question_counter} questions across {target_passages} passages')
 self.stdout.write(f' Each passage now has exactly {questions_per_passage} questions')

 def _cleanup_problematic_questions(self):
 """Clean up any duplicate or problematic questions"""
 # Check for questions with very high IDs that might be problematic
 high_id_questions = Question.objects.filter(id__gte=1700)
 if high_id_questions.exists():
 self.stdout.write(f' Found {high_id_questions.count()} questions with high IDs (1700+)')

 # Check if any high ID questions are in wrong tests
 for q in high_id_questions:
 if q.test_id not in [1, 2, 3, 4, 5]: # Not in VRT tests
 self.stdout.write(f' Question {q.id} in test {q.test_id} - might be problematic')

 # Check for duplicate question texts
 from django.db.models import Count
 duplicates = Question.objects.values('question_text').annotate(
 count=Count('question_text')
 ).filter(count__gt=1)

 if duplicates.exists():
 self.stdout.write(f' Found {duplicates.count()} duplicate question texts')
 for dup in duplicates[:3]: # Show first 3
 self.stdout.write(f' Duplicate: {dup["question_text"][:50]}...')
