from django.core.management.base import BaseCommand
from django.db import connection

class Command(BaseCommand):
 help = 'Update scoring service to handle SJT multi-score system'

 def handle(self, *args, **options):
 # Create a new scoring function for SJT
 with connection.cursor() as cursor:
 # Create a function to calculate SJT scores
 cursor.execute("""
 CREATE OR REPLACE FUNCTION calculate_sjt_score(
 p_question_id INTEGER,
 p_selected_answer CHAR(1)
 ) RETURNS INTEGER AS $$
 DECLARE
 score_value INTEGER;
 BEGIN
 SELECT qo.score_value INTO score_value
 FROM testsengine_questionoption qo
 WHERE qo.question_id = p_question_id
 AND qo.option_letter = p_selected_answer;

 RETURN COALESCE(score_value, 0);
 END;
 $$ LANGUAGE plpgsql;
 """)

 # Create a view for easy SJT scoring
 cursor.execute("""
 CREATE OR REPLACE VIEW sjt_scoring_view AS
 SELECT
 q.id as question_id,
 q.question_text,
 qo.option_letter,
 qo.option_text,
 qo.score_value,
 CASE
 WHEN qo.score_value = 2 THEN 'Best Option'
 WHEN qo.score_value = 1 THEN 'Acceptable'
 WHEN qo.score_value = 0 THEN 'Unacceptable'
 WHEN qo.score_value = -1 THEN 'Must Not Choose'
 END as score_description
 FROM testsengine_question q
 JOIN testsengine_questionoption qo ON q.id = qo.question_id
 WHERE q.test_id = 4
 ORDER BY q.id, qo.option_letter;
 """)

 self.stdout.write(self.style.SUCCESS('Created SJT scoring functions and views!'))

 # Test the scoring function
 cursor.execute("""
 SELECT
 question_id,
 option_letter,
 option_text,
 score_value,
 score_description
 FROM sjt_scoring_view
 WHERE question_id IN (11, 12, 13)
 ORDER BY question_id, option_letter
 LIMIT 12;
 """)

 results = cursor.fetchall()
 self.stdout.write('\n=== Sample SJT Scoring Data ===')
 for row in results:
 self.stdout.write(f'Q{row[0]} {row[1]}: {row[2][:50]}... | Score: {row[3]} ({row[4]})')
