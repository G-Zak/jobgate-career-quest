from django.core.management.base import BaseCommand
from testsengine.models import Question
import json

class Command(BaseCommand):
 help = 'Export Mental Rotation questions to markdown format'

 def handle(self, *args, **options):
 # Get all Mental Rotation questions ordered by difficulty and ID
 mr_questions = Question.objects.filter(question_type='mental_rotation').order_by('difficulty_level', 'id')

 output = []
 output.append('# Mental Rotation Questions Database')
 output.append('')
 output.append('## Overview')
 output.append(f'Total Mental Rotation Questions: {mr_questions.count()}')
 output.append('')

 # Group by difficulty
 difficulties = {}
 for q in mr_questions:
 if q.difficulty_level not in difficulties:
 difficulties[q.difficulty_level] = []
 difficulties[q.difficulty_level].append(q)

 for difficulty in ['easy', 'medium', 'hard']:
 if difficulty in difficulties:
 questions = difficulties[difficulty]
 output.append(f'- **{difficulty.title()}**: {len(questions)} questions')

 output.append('')
 output.append('---')
 output.append('')

 # Generate detailed questions by difficulty
 for difficulty in ['easy', 'medium', 'hard']:
 if difficulty not in difficulties:
 continue

 questions = difficulties[difficulty]
 output.append(f'## {difficulty.title()} Level Questions ({len(questions)} questions)')
 output.append('')

 for i, q in enumerate(questions, 1):
 output.append(f'### Question {i} (ID: {q.id})')
 output.append('')
 output.append(f'**Base Image:** `{q.base_image_id}`')
 output.append('')
 output.append(f'**Question Text:**')
 output.append(f'{q.question_text}')
 output.append('')
 output.append(f'**Options:**')

 # Handle options - they could be string, list, or dict
 try:
 if isinstance(q.options, str):
 options = json.loads(q.options)
 else:
 options = q.options

 if isinstance(options, dict):
 for key, value in options.items():
 output.append(f'- **{key}:** {value}')
 elif isinstance(options, list):
 for idx, value in enumerate(options):
 letter = chr(65 + idx) # A, B, C, D
 output.append(f'- **{letter}:** {value}')
 else:
 output.append(f'- {options}')
 except Exception as e:
 output.append(f'- Error parsing options: {e}')

 output.append('')
 output.append(f'**Correct Answer:** {q.correct_answer}')
 output.append('')
 output.append(f'**Explanation:**')
 output.append(f'{q.explanation}')
 output.append('')
 output.append(f'**Technical Details:**')
 output.append(f'- Transforms: `{q.transforms}`')
 output.append(f'- Overlay IDs: `{q.overlay_ids}`')
 output.append(f'- Option Remap: `{q.option_remap}`')
 output.append(f'- Visual Style: `{q.visual_style}`')
 output.append(f'- Complexity Score: {q.complexity_score}')
 output.append('')
 output.append('---')
 output.append('')

 # Print all output
 for line in output:
 self.stdout.write(line)
