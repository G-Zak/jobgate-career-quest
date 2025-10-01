from django.core.management.base import BaseCommand
from django.db import models
from django.db import connection

class Command(BaseCommand):
 help = 'Create new models and tables for SJT scoring system'

 def handle(self, *args, **options):
 with connection.cursor() as cursor:
 # Create question_options table for SJT scoring
 cursor.execute("""
 CREATE TABLE IF NOT EXISTS testsengine_questionoption (
 id SERIAL PRIMARY KEY,
 question_id INTEGER NOT NULL,
 option_text TEXT NOT NULL,
 score_value INTEGER NOT NULL,
 option_letter CHAR(1) NOT NULL,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY (question_id) REFERENCES testsengine_question(id) ON DELETE CASCADE
 );
 """)

 # Create index for better performance
 cursor.execute("""
 CREATE INDEX IF NOT EXISTS idx_questionoption_question_id
 ON testsengine_questionoption(question_id);
 """)

 self.stdout.write(self.style.SUCCESS('Created question_options table successfully!'))
