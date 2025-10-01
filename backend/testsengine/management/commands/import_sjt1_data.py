from django.core.management.base import BaseCommand
from django.db import transaction
import json
import os
from datetime import datetime

from testsengine.models import Test, Question
from testsengine.question_option_model import QuestionOption

class Command(BaseCommand):
 help = "Import test data from JSON export file (supports both single test and complete backup formats)"

 def add_arguments(self, parser):
 parser.add_argument("filename", type=str, help="JSON file to import")
 parser.add_argument("--dry-run", action="store_true", help="Preview import without saving")
 parser.add_argument("--overwrite", action="store_true", help="Overwrite existing test data")

 def handle(self, *args, **opts):
 filename = opts["filename"]
 dry_run = opts.get("dry_run", False)
 overwrite = opts.get("overwrite", False)

 if not os.path.exists(filename):
 self.stdout.write(self.style.ERROR(f"File not found: {filename}"))
 return

 try:
 with open(filename, 'r', encoding='utf-8') as f:
 data = json.load(f)

 # Validate export format
 if "export_info" not in data or "test_metadata" not in data:
 self.stdout.write(self.style.ERROR("Invalid export file format"))
 return

 export_info = data["export_info"]
 test_metadata = data["test_metadata"]
 questions_data = data.get("questions", [])
 options_data = data.get("question_options", [])

 test_id = test_metadata["id"]

 self.stdout.write(f" Import file: {filename}")
 self.stdout.write(f" Export info: {export_info['exported_at']}")
 self.stdout.write(f" Test ID: {test_id}")
 self.stdout.write(f" Questions: {len(questions_data)}")
 self.stdout.write(f"️ Options: {len(options_data)}")

 if dry_run:
 self.stdout.write(self.style.WARNING("[DRY RUN] Would import the above data"))
 return

 # Check if test exists
 existing_test = Test.objects.filter(id=test_id).first()
 if existing_test and not overwrite:
 self.stdout.write(self.style.ERROR(f"Test {test_id} already exists. Use --overwrite to replace it."))
 return

 with transaction.atomic():
 # Clear existing data if overwriting
 if existing_test and overwrite:
 self.stdout.write(f"️ Clearing existing test {test_id} data...")
 QuestionOption.objects.filter(question__test_id=test_id).delete()
 Question.objects.filter(test_id=test_id).delete()
 existing_test.delete()

 # Create/update test
 test_fields = {
 "title": test_metadata["title"],
 "test_type": test_metadata["test_type"],
 "description": test_metadata["description"],
 "duration_minutes": test_metadata["duration_minutes"],
 "total_questions": test_metadata["total_questions"],
 "passing_score": test_metadata["passing_score"],
 "is_active": test_metadata["is_active"],
 }

 if test_metadata.get("version"):
 test_fields["version"] = test_metadata["version"]

 test, created = Test.objects.update_or_create(
 id=test_id,
 defaults=test_fields
 )

 action = "Created" if created else "Updated"
 self.stdout.write(f" {action} test: {test.title}")

 # Import questions
 question_id_mapping = {} # old_id -> new_id
 for q_data in questions_data:
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

 self.stdout.write(f" Imported {len(questions_data)} questions")

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

 self.stdout.write(f" Imported {len(options_data)} question options")

 self.stdout.write(self.style.SUCCESS(f" Import completed successfully!"))
 self.stdout.write(f" Test: {test.title} (ID: {test_id})")
 self.stdout.write(f"⏱️ Duration: {test.duration_minutes} minutes")
 self.stdout.write(f" Questions shown: {test.total_questions}")
 self.stdout.write(f" Questions in pool: {len(questions_data)}")

 except json.JSONDecodeError as e:
 self.stdout.write(self.style.ERROR(f"Invalid JSON file: {str(e)}"))
 except Exception as e:
 self.stdout.write(self.style.ERROR(f"Import failed: {str(e)}"))
