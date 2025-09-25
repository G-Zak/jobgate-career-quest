from django.core.management.base import BaseCommand
from django.core import serializers
import json
import os
from datetime import datetime

from testsengine.models import Test, Question
from testsengine.question_option_model import QuestionOption


class Command(BaseCommand):
    help = "Export ALL test data (all tests, questions, scenarios, options, scoring) to JSON file for backup"

    def add_arguments(self, parser):
        parser.add_argument("--output-dir", type=str, default=".", help="Output directory (default current)")
        parser.add_argument("--filename", type=str, help="Custom filename (default: all_tests_export_YYYYMMDD_HHMMSS.json)")
        parser.add_argument("--include-inactive", action="store_true", help="Include inactive tests")

    def handle(self, *args, **opts):
        output_dir = opts.get("output_dir", ".")
        custom_filename = opts.get("filename")
        include_inactive = opts.get("include_inactive", False)

        # Generate filename if not provided
        if not custom_filename:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"all_tests_export_{timestamp}.json"
        else:
            filename = custom_filename

        output_path = os.path.join(output_dir, filename)

        try:
            # Get all tests
            if include_inactive:
                tests = Test.objects.all().order_by('id')
            else:
                tests = Test.objects.filter(is_active=True).order_by('id')
            
            if not tests.exists():
                self.stdout.write(self.style.WARNING("No tests found"))
                return

            # Get all questions for these tests
            test_ids = list(tests.values_list('id', flat=True))
            questions = Question.objects.filter(test_id__in=test_ids).order_by('test_id', 'order')
            
            # Get all question options
            question_ids = list(questions.values_list('id', flat=True))
            question_options = QuestionOption.objects.filter(question_id__in=question_ids).order_by('question_id', 'option_letter')

            # Build export data structure
            export_data = {
                "export_info": {
                    "exported_at": datetime.now().isoformat(),
                    "total_tests": tests.count(),
                    "total_questions": questions.count(),
                    "total_options": question_options.count(),
                    "include_inactive": include_inactive,
                    "export_version": "2.0",
                    "database_schema": "testsengine",
                    "export_type": "complete_backup"
                },
                "tests": [],
                "questions": [],
                "question_options": []
            }

            # Export tests
            for test in tests:
                test_data = {
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
                }
                export_data["tests"].append(test_data)

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

            # Export question options
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

            # Summary by test
            test_summary = {}
            for test in tests:
                test_questions = [q for q in questions if q.test_id == test.id]
                test_options = [o for o in question_options if any(q.id == o.question_id for q in test_questions)]
                test_summary[test.id] = {
                    "title": test.title,
                    "type": test.test_type,
                    "questions": len(test_questions),
                    "options": len(test_options),
                    "duration": test.duration_minutes,
                    "active": test.is_active
                }

            # Display summary
            self.stdout.write(self.style.SUCCESS(f"✅ ALL test data exported successfully!"))
            self.stdout.write(f"📁 File: {output_path}")
            self.stdout.write(f"📊 Total Tests: {len(export_data['tests'])}")
            self.stdout.write(f"❓ Total Questions: {len(export_data['questions'])}")
            self.stdout.write(f"⚙️  Total Options: {len(export_data['question_options'])}")
            
            self.stdout.write("\n📋 Test Summary:")
            for test_id, info in test_summary.items():
                status = "✅" if info["active"] else "❌"
                self.stdout.write(f"  {status} Test {test_id}: {info['title']} ({info['type']})")
                self.stdout.write(f"     📝 {info['questions']} questions, ⚙️ {info['options']} options, ⏱️ {info['duration']}min")
            
            # Show file size
            file_size = os.path.getsize(output_path)
            if file_size > 1024 * 1024:
                size_str = f"{file_size / (1024 * 1024):.1f} MB"
            elif file_size > 1024:
                size_str = f"{file_size / 1024:.1f} KB"
            else:
                size_str = f"{file_size} bytes"
            self.stdout.write(f"\n📦 File size: {size_str}")

        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Export failed: {str(e)}"))
