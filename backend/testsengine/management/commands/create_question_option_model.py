from django.core.management.base import BaseCommand
from django.db import connection

class Command(BaseCommand):
 help = 'Create QuestionOption model and register it in admin'

 def handle(self, *args, **options):
 with connection.cursor() as cursor:
 # First, let's check if the table exists
 cursor.execute("""
 SELECT EXISTS (
 SELECT FROM information_schema.tables
 WHERE table_name = 'testsengine_questionoption'
 );
 """)
 table_exists = cursor.fetchone()[0]

 if table_exists:
 self.stdout.write(" QuestionOption table already exists")
 else:
 # Create the table if it doesn't exist
 cursor.execute("""
 CREATE TABLE testsengine_questionoption (
 id SERIAL PRIMARY KEY,
 question_id INTEGER NOT NULL,
 option_text TEXT NOT NULL,
 score_value INTEGER NOT NULL,
 option_letter CHAR(1) NOT NULL,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY (question_id) REFERENCES testsengine_question(id) ON DELETE CASCADE
 );
 """)
 self.stdout.write(" Created QuestionOption table")

 # Create index for better performance
 cursor.execute("""
 CREATE INDEX IF NOT EXISTS idx_questionoption_question_id
 ON testsengine_questionoption(question_id);
 """)

 self.stdout.write(" Created index on question_id")

 # Now create the Django model
 model_content = '''
from django.db import models
from django.contrib import admin

class QuestionOption(models.Model):
 """Question options with scoring for SJT tests"""
 question = models.ForeignKey('Question', on_delete=models.CASCADE, related_name='question_options')
 option_text = models.TextField()
 score_value = models.IntegerField(help_text="Score: +2 (Best), +1 (Acceptable), 0 (Unacceptable), -1 (Must Not Choose)")
 option_letter = models.CharField(max_length=1, help_text="A, B, C, D")
 created_at = models.DateTimeField(auto_now_add=True)

 class Meta:
 ordering = ['question', 'option_letter']
 verbose_name = "Question Option"
 verbose_name_plural = "Question Options"

 def __str__(self):
 return f"Q{self.question.id} {self.option_letter}: {self.option_text[:50]}... (Score: {self.score_value})"

@admin.register(QuestionOption)
class QuestionOptionAdmin(admin.ModelAdmin):
 list_display = ['question', 'option_letter', 'option_text_short', 'score_value', 'score_description']
 list_filter = ['score_value', 'question__test', 'created_at']
 search_fields = ['option_text', 'question__question_text']
 ordering = ['question', 'option_letter']
 list_editable = ['score_value']

 def option_text_short(self, obj):
 return obj.option_text[:60] + "..." if len(obj.option_text) > 60 else obj.option_text
 option_text_short.short_description = "Option Text"

 def score_description(self, obj):
 score_map = {2: "Best Option", 1: "Acceptable", 0: "Unacceptable", -1: "Must Not Choose"}
 return score_map.get(obj.score_value, "Unknown")
 score_description.short_description = "Score Description"
'''

 # Write the model to a temporary file
 with open('backend/testsengine/question_option_model.py', 'w') as f:
 f.write(model_content)

 self.stdout.write(" Created QuestionOption model")
 self.stdout.write(" Registered QuestionOption in admin")
 self.stdout.write("\n Next steps:")
 self.stdout.write("1. Add 'from .question_option_model import QuestionOption' to testsengine/admin.py")
 self.stdout.write("2. Restart the Django server")
 self.stdout.write("3. Go to http://localhost:8000/admin/")
 self.stdout.write("4. Look for 'Question Options' in the TESTS ENGINE section")
