from django.core.management.base import BaseCommand
from django.core import serializers
import json
import os
from datetime import datetime

from testsengine.models import Test, Question
from testsengine.question_option_model import QuestionOption


class Command(BaseCommand):
    help = "Export SJT1 test data (questions, scenarios, options, scoring) to JSON file for backup"

    def add_arguments(self, parser):
        parser.add_argument("--test-id", type=int, default=30, help="Test ID to export (default 30)")
        parser.add_argument("--output-dir", type=str, default=".", help="Output directory (default current)")
        parser.add_argument("--filename", type=str, help="Custom filename (default: sjt1_export_YYYYMMDD_HHMMSS.json)")

    def handle(self, *args, **opts):
        test_id = opts.get("test_id", 30)
        output_dir = opts.get("output_dir", ".")
        custom_filename = opts.get("filename")

        # Generate filename if not provided
        if not custom_filename:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"sjt1_export_{timestamp}.json"
        else:
            filename = custom_filename

        output_path = os.path.join(output_dir, filename)

        try:
            # Get test metadata
            test = Test.objects.get(id=test_id)
            
            # Get all questions for this test
            questions = Question.objects.filter(test_id=test_id).order_by('order')
            
            if not questions.exists():
                self.stdout.write(self.style.WARNING(f"No questions found for test_id={test_id}"))
                return

            # Get all question options (for SJT scoring)
            question_ids = list(questions.values_list('id', flat=True))
            question_options = QuestionOption.objects.filter(question_id__in=question_ids)

            # Build export data structure
            export_data = {
                "export_info": {
                    "exported_at": datetime.now().isoformat(),
                    "test_id": test_id,
                    "total_questions": questions.count(),
                    "total_options": question_options.count(),
                    "export_version": "1.0"
                },
                "test_metadata": {
                    "id": test.id,
                    "title": test.title,
                    "test_type": test.test_type,
                    "description": test.description,
                    "duration_minutes": test.duration_minutes,
                    "total_questions": test.total_questions,
                    "passing_score": test.passing_score,
                    "is_active": test.is_active,
                    "created_at": test.created_at.isoformat() if test.created_at else None,
                    "version": getattr(test, 'version', None)
                },
                "questions": [],
                "question_options": []
            }

            # Export questions with full data
            for question in questions:
                question_data = {
                    "id": question.id,
                    "test_id": question.test_id,
                    "question_type": question.question_type,
                    "question_text": question.question_text,
                    "passage": question.passage,
                    "options": question.options,
                    "correct_answer": question.correct_answer,
                    "difficulty_level": question.difficulty_level,
                    "order": question.order,
                    "explanation": question.explanation,
                    "context": question.context,
                    "main_image": question.main_image,
                    "option_images": question.option_images,
                    "visual_style": question.visual_style,
                    "created_at": question.created_at.isoformat() if question.created_at else None
                }
                
                # Parse context if it's JSON
                if question.context:
                    try:
                        question_data["context_parsed"] = json.loads(question.context)
                    except:
                        question_data["context_parsed"] = None

                export_data["questions"].append(question_data)

            # Export question options (SJT scoring)
            for option in question_options:
                option_data = {
                    "id": option.id,
                    "question_id": option.question_id,
                    "option_letter": option.option_letter,
                    "option_text": option.option_text,
                    "score_value": option.score_value,
                    "created_at": option.created_at.isoformat() if option.created_at else None
                }
                export_data["question_options"].append(option_data)

            # Write to file
            with open(output_path, 'w', encoding='utf-8') as f:
                json.dump(export_data, f, indent=2, ensure_ascii=False)

            # Summary
            self.stdout.write(self.style.SUCCESS(f"✅ SJT1 data exported successfully!"))
            self.stdout.write(f"📁 File: {output_path}")
            self.stdout.write(f"📊 Test: {test.title} (ID: {test_id})")
            self.stdout.write(f"❓ Questions: {len(export_data['questions'])}")
            self.stdout.write(f"⚙️  Options: {len(export_data['question_options'])}")
            self.stdout.write(f"⏱️  Duration: {test.duration_minutes} minutes")
            self.stdout.write(f"🎯 Total Questions: {test.total_questions}")
            
            # Show file size
            file_size = os.path.getsize(output_path)
            if file_size > 1024 * 1024:
                size_str = f"{file_size / (1024 * 1024):.1f} MB"
            elif file_size > 1024:
                size_str = f"{file_size / 1024:.1f} KB"
            else:
                size_str = f"{file_size} bytes"
            self.stdout.write(f"📦 File size: {size_str}")

        except Test.DoesNotExist:
            self.stdout.write(self.style.ERROR(f"Test with ID {test_id} not found"))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Export failed: {str(e)}"))
