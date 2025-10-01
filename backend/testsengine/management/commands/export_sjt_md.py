from django.core.management.base import BaseCommand
from django.utils.text import slugify
from testsengine.models import Test, Question
from pathlib import Path

class Command(BaseCommand):
 help = "Export Situational Judgment Test questions (scenario + answers) to Markdown"

 def add_arguments(self, parser):
 parser.add_argument('--test-id', type=int, default=None, help='Specific Test ID to export (defaults to first SJT test found)')
 parser.add_argument('--out', type=str, default='docs/SJT_Questions.md', help='Output Markdown path')

 def handle(self, *args, **options):
 test_id = options['test_id']
 out_path = Path(options['out'])
 out_path.parent.mkdir(parents=True, exist_ok=True)

 if test_id:
 test = Test.objects.filter(id=test_id, test_type='situational_judgment').first()
 else:
 test = Test.objects.filter(test_type='situational_judgment', is_active=True).order_by('id').first()

 if not test:
 self.stderr.write(self.style.ERROR('No Situational Judgment test found.'))
 return

 questions = test.questions.all().order_by('order')
 if not questions.exists():
 self.stderr.write(self.style.WARNING(f'No questions found for test {test.id} - {test.title}'))

 def get_text(q):
 # Try to extract a readable scenario/question text
 for key in ['passage', 'question_text']:
 val = getattr(q, key, None)
 if isinstance(val, str) and val.strip():
 return val.strip()
 ctx = getattr(q, 'context', None)
 if isinstance(ctx, str) and ctx.strip():
 return ctx.strip()
 # Fallback to str
 return (q.question_text or '').strip()

 lines = []
 lines.append(f"# Situational Judgment Test: {test.title} (ID: {test.id})\n")
 lines.append(f"Total Questions: {questions.count()}\n")
 lines.append("---\n")

 for q in questions:
 scenario = get_text(q)
 correct = str(q.correct_answer).strip()
 lines.append(f"## Q{q.order}\n")
 lines.append("**Scenario**:\n")
 lines.append(f"{scenario}\n")
 # Render options as letters A..F from serializer logic; try best-effort from model
 opts = []
 try:
 if isinstance(q.options, list) and q.options:
 letters = ['A','B','C','D','E','F']
 for i, raw in enumerate(q.options[:len(letters)]):
 letter = letters[i]
 if isinstance(raw, dict):
 txt = raw.get('text') or raw.get('label') or raw.get('value') or ''
 else:
 txt = str(raw)
 # Hide numeric-only placeholders
 try:
 float(txt)
 txt = f"Option {letter}"
 except Exception:
 pass
 opts.append((letter, txt))
 except Exception:
 pass
 if opts:
 lines.append("\n**Options**:\n")
 for letter, txt in opts:
 lines.append(f"- {letter}. {txt}")
 lines.append("")
 lines.append(f"\n**Answer**: {correct}\n")
 lines.append("---\n")

 out_path.write_text("\n".join(lines), encoding='utf-8')
 self.stdout.write(self.style.SUCCESS(f'Exported {questions.count()} SJT questions to {out_path}'))

