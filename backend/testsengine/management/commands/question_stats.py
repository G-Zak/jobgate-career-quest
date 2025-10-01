from django.core.management.base import BaseCommand
from testsengine.models import Question

class Command(BaseCommand):
 help = 'Display question statistics'

 def handle(self, *args, **options):
 total_questions = Question.objects.count()
 self.stdout.write(f"Total questions: {total_questions}")

 # Questions by type
 self.stdout.write("\n=== Questions by Type ===")
 from django.db.models import Count
 type_counts = Question.objects.values('question_type').annotate(count=Count('id')).order_by('question_type')
 for item in type_counts:
 self.stdout.write(f"{item['question_type']}: {item['count']}")

 # Questions by difficulty
 self.stdout.write("\n=== Questions by Difficulty ===")
 diff_counts = Question.objects.values('difficulty_level').annotate(count=Count('id')).order_by('difficulty_level')
 for item in diff_counts:
 self.stdout.write(f"{item['difficulty_level']}: {item['count']}")

 # Mental Rotation specific stats
 mental_rotation_count = Question.objects.filter(question_type="Mental Rotation").count()
 if mental_rotation_count > 0:
 self.stdout.write("\n=== Mental Rotation Questions by Difficulty ===")
 mr_diff_counts = Question.objects.filter(question_type="Mental Rotation").values('difficulty_level').annotate(count=Count('id')).order_by('difficulty_level')
 for item in mr_diff_counts:
 self.stdout.write(f"{item['difficulty_level']}: {item['count']}")

 # Check visual content fields
 questions_with_base_image = Question.objects.exclude(base_image_id__isnull=True).count()
 questions_with_overlays = Question.objects.exclude(overlay_ids__isnull=True).count()
 questions_with_transforms = Question.objects.exclude(transforms__isnull=True).count()

 self.stdout.write("\n=== Visual Content Statistics ===")
 self.stdout.write(f"Questions with base_image_id: {questions_with_base_image}")
 self.stdout.write(f"Questions with overlay_ids: {questions_with_overlays}")
 self.stdout.write(f"Questions with transforms: {questions_with_transforms}")
