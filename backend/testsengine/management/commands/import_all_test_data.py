from django.core.management.base import BaseCommand
from django.db import transaction
import json
import os
from datetime import datetime

from testsengine.models import Test, Question
from testsengine.question_option_model import QuestionOption

class Command(BaseCommand):
 help = "Import ALL test data from JSON export file (complete backup restore)"

 def add_arguments(self, parser):
 parser.add_argument("filename", type=str, help="JSON file to import")
 parser.add_argument("--dry-run", action="store_true", help="Preview import without saving")
 parser.add_argument("--overwrite", action="store_true", help="Overwrite existing test data")
 parser.add_argument("--test-ids", type=str, help="Comma-separated test IDs to import (default: all)")
 parser.add_argument("--skip-existing", action="store_true", help="Skip tests that already exist")

 def handle(self, *args, **opts):
 filename = opts["filename"]
 dry_run = opts.get("dry_run", False)
 overwrite = opts.get("overwrite", False)
 test_ids_str = opts.get("test_ids")
 skip_existing = opts.get("skip_existing", False)

 if not os.path.exists(filename):
 self.stdout.write(self.style.ERROR(f"File not found: {filename}"))
 return

 try:
 with open(filename, 'r', encoding='utf-8') as f:
 data = json.load(f)

 # Validate export format
 if "export_info" not in data:
 self.stdout.write(self.style.ERROR("Invalid export file format"))
 return

 export_info = data["export_info"]
 tests_data = data.get("tests", [])
 questions_data = data.get("questions", [])
 options_data = data.get("question_options", [])

 # Filter by test IDs if specified
 if test_ids_str:
 target_test_ids = [int(x.strip()) for x in test_ids_str.split(",")]
 tests_data = [t for t in tests_data if t["id"] in target_test_ids]
 test_ids_in_export = [t["id"] for t in tests_data]
 questions_data = [q for q in questions_data if q["test_id"] in test_ids_in_export]
 question_ids_in_export = [q["id"] for q in questions_data]
 options_data = [o for o in options_data if o["question_id"] in question_ids_in_export]

 self.stdout.write(f" Import file: {filename}")
 self.stdout.write(f" Export info: {export_info.get('exported_at', 'Unknown')}")
 self.stdout.write(f" Tests to import: {len(tests_data)}")
 self.stdout.write(f" Questions to import: {len(questions_data)}")
 self.stdout.write(f"️ Options to import: {len(options_data)}")

 if dry_run:
 self.stdout.write(self.style.WARNING("[DRY RUN] Would import the above data"))
 for test_data in tests_data:
 test_questions = [q for q in questions_data if q["test_id"] == test_data["id"]]
 self.stdout.write(f" Test {test_data['id']}: {test_data['title']} ({len(test_questions)} questions)")
 return

 imported_tests = 0
 imported_questions = 0
 imported_options = 0
 skipped_tests = 0

 with transaction.atomic():
 # Import tests
 for test_data in tests_data:
 test_id = test_data["id"]
 existing_test = Test.objects.filter(id=test_id).first()

 if existing_test:
 if skip_existing:
 self.stdout.write(f"⏭️ Skipping existing test {test_id}: {test_data['title']}")
 skipped_tests += 1
 continue
 elif not overwrite:
 self.stdout.write(self.style.ERROR(f"Test {test_id} already exists. Use --overwrite or --skip-existing"))
 return
 else:
 # Clear existing data
 self.stdout.write(f"️ Clearing existing test {test_id} data...")
 QuestionOption.objects.filter(question__test_id=test_id).delete()
 Question.objects.filter(test_id=test_id).delete()
 existing_test.delete()

 # Create test
 test_fields = {
 "title": test_data["title"],
 "test_type": test_data["test_type"],
 "description": test_data["description"],
 "duration_minutes": test_data["duration_minutes"],
 "total_questions": test_data["total_questions"],
 "passing_score": test_data["passing_score"],
 "is_active": test_data["is_active"],
 }

 if test_data.get("version"):
 test_fields["version"] = test_data["version"]

 test = Test.objects.create(id=test_id, **test_fields)
 imported_tests += 1
 self.stdout.write(f" Created test: {test.title} (ID: {test_id})")

 # Import questions
 question_id_mapping = {} # old_id -> new_id
 for q_data in questions_data:
 test_id = q_data["test_id"]

 # Skip if test was skipped
 if not Test.objects.filter(id=test_id).exists():
 continue

 old_question_id = q_data["id"]

 question = Question.objects.create(
 test_id=test_id,
 question_type=q_data["question_type"],
 question_text=q_data["question_text"],
 passage=q_data.get("passage"),
 options=q_data.get("options", []),
 correct_answer=q_data.get("correct_answer"),
 difficulty_level=q_data.get("difficulty_level", "medium"),
 order=q_data.get("order", 1),
 explanation=q_data.get("explanation"),
 context=q_data.get("context"),
 main_image=q_data.get("main_image"),
 option_images=q_data.get("option_images", []),
 visual_style=q_data.get("visual_style", "technical_3d")
 )

 question_id_mapping[old_question_id] = question.id
 imported_questions += 1

 # Import question options
 for opt_data in options_data:
 old_question_id = opt_data["question_id"]
 new_question_id = question_id_mapping.get(old_question_id)

 if new_question_id:
 QuestionOption.objects.create(
 question_id=new_question_id,
 option_letter=opt_data["option_letter"],
 option_text=opt_data["option_text"],
 score_value=opt_data["score_value"]
 )
 imported_options += 1

 self.stdout.write(self.style.SUCCESS(f" Import completed successfully!"))
 self.stdout.write(f" Imported {imported_tests} tests")
 self.stdout.write(f" Imported {imported_questions} questions")
 self.stdout.write(f" Imported {imported_options} question options")
 if skipped_tests > 0:
 self.stdout.write(f"⏭️ Skipped {skipped_tests} existing tests")

 except json.JSONDecodeError as e:
 self.stdout.write(self.style.ERROR(f"Invalid JSON file: {str(e)}"))
 except Exception as e:
 self.stdout.write(self.style.ERROR(f"Import failed: {str(e)}"))
