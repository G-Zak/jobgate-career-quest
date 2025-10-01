from django.core.management.base import BaseCommand
from django.db import transaction
import json

from testsengine.models import Question

class Command(BaseCommand):
 help = "Add French translations to existing SJT questions in-place without altering content or scoring"

 def add_arguments(self, parser):
 parser.add_argument("--test-id", type=int, default=30, help="Backend test id to update (default 30)")
 parser.add_argument("--dry-run", action="store_true", help="Preview changes without writing to DB")
 parser.add_argument(
 "--mode",
 choices=["copy_en", "fill_missing"],
 default="copy_en",
 help="copy_en: set FR = EN for all items; fill_missing: only set FR when missing"
 )

 def handle(self, *args, **opts):
 test_id = opts.get("test_id", 30)
 dry = opts.get("dry_run", False)
 mode = opts.get("mode", "copy_en")

 qs = Question.objects.filter(test_id=test_id, question_type='situational_judgment').order_by('order')
 total = qs.count()
 if total == 0:
 self.stdout.write(self.style.WARNING(f"No SJT questions found for test_id={test_id}"))
 return

 updated = 0
 with transaction.atomic():
 for q in qs:
 # Parse context JSON safely
 ctx = {}
 if q.context:
 try:
 ctx = json.loads(q.context)
 except Exception:
 ctx = {}

 # Ensure context.scenario structure exists
 scenario = ctx.get("scenario")
 if isinstance(scenario, dict):
 en_text = scenario.get("en")
 fr_text = scenario.get("fr")
 else:
 # Some legacy records may have plain string scenario; treat as EN
 en_text = scenario if isinstance(scenario, str) else None
 fr_text = None
 ctx["scenario"] = {"en": en_text, "fr": None}

 changed = False

 # Update scenario.fr per mode
 if mode == "copy_en":
 if en_text:
 if ctx.get("scenario", {}).get("fr") != en_text:
 ctx["scenario"]["fr"] = en_text
 changed = True
 else: # fill_missing
 if en_text and not fr_text:
 ctx["scenario"]["fr"] = en_text
 changed = True

 # Ensure translations.fr structure exists
 translations = ctx.get("translations") or {}
 fr_block = translations.get("fr") or {}

 # Prepare localized question_text and options
 # Use existing values if present depending on mode
 if mode == "copy_en":
 fr_qtext_new = q.question_text
 fr_options_new = list(q.options) if isinstance(q.options, list) else []
 else: # fill_missing
 fr_qtext_new = fr_block.get("question_text") or q.question_text
 fr_options_new = fr_block.get("options") or (list(q.options) if isinstance(q.options, list) else [])

 # Apply
 if fr_block.get("question_text") != fr_qtext_new:
 fr_block["question_text"] = fr_qtext_new
 changed = True

 if fr_block.get("options") != fr_options_new:
 fr_block["options"] = fr_options_new
 changed = True

 translations["fr"] = fr_block
 ctx["translations"] = translations

 if changed:
 updated += 1
 if not dry:
 q.context = json.dumps(ctx)
 q.save(update_fields=["context"])

 if dry:
 self.stdout.write(f"[DRY RUN] Would update {updated}/{total} questions for test_id={test_id}")
 else:
 self.stdout.write(self.style.SUCCESS(f"Updated {updated}/{total} SJT questions with FR translations (mode={mode})"))

