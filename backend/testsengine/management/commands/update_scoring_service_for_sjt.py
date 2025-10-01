from django.core.management.base import BaseCommand
from django.db import connection

class Command(BaseCommand):
 help = 'Update scoring service to use new SJT scoring system'

 def handle(self, *args, **options):
 with connection.cursor() as cursor:
 # Create a new scoring function that handles both old and new systems
 cursor.execute("""
 CREATE OR REPLACE FUNCTION calculate_question_score(
 p_question_id INTEGER,
 p_selected_answer CHAR(1),
 p_test_id INTEGER
 ) RETURNS DECIMAL AS $$
 DECLARE
 score_value INTEGER;
 difficulty_coefficient DECIMAL;
 final_score DECIMAL;
 BEGIN
 -- Check if this is an SJT test (test_id = 4)
 IF p_test_id = 4 THEN
 -- Use new SJT scoring system
 SELECT qo.score_value INTO score_value
 FROM testsengine_questionoption qo
 WHERE qo.question_id = p_question_id
 AND qo.option_letter = p_selected_answer;

 RETURN COALESCE(score_value, 0);
 ELSE
 -- Use old scoring system with difficulty coefficients
 SELECT
 CASE
 WHEN q.difficulty_level = 'easy' THEN 1.0
 WHEN q.difficulty_level = 'medium' THEN 1.5
 WHEN q.difficulty_level = 'hard' THEN 2.0
 ELSE 1.0
 END INTO difficulty_coefficient
 FROM testsengine_question q
 WHERE q.id = p_question_id;

 -- Check if answer is correct
 IF EXISTS (
 SELECT 1 FROM testsengine_question q
 WHERE q.id = p_question_id
 AND q.correct_answer = p_selected_answer
 ) THEN
 RETURN difficulty_coefficient;
 ELSE
 RETURN 0;
 END IF;
 END IF;
 END;
 $$ LANGUAGE plpgsql;
 """)

 # Create a function to calculate total test score
 cursor.execute("""
 CREATE OR REPLACE FUNCTION calculate_total_test_score(
 p_answers JSONB,
 p_test_id INTEGER
 ) RETURNS DECIMAL AS $$
 DECLARE
 total_score DECIMAL := 0;
 question_id INTEGER;
 selected_answer CHAR(1);
 question_score DECIMAL;
 BEGIN
 FOR question_id, selected_answer IN
 SELECT key::INTEGER, value::CHAR(1)
 FROM jsonb_each_text(p_answers)
 LOOP
 SELECT calculate_question_score(question_id, selected_answer, p_test_id) INTO question_score;
 total_score := total_score + question_score;
 END LOOP;

 RETURN total_score;
 END;
 $$ LANGUAGE plpgsql;
 """)

 # Create a function to get maximum possible score for a test
 cursor.execute("""
 CREATE OR REPLACE FUNCTION get_max_possible_score(
 p_test_id INTEGER
 ) RETURNS DECIMAL AS $$
 DECLARE
 max_score DECIMAL;
 BEGIN
 IF p_test_id = 4 THEN
 -- For SJT, maximum score is all best answers (+2 each)
 SELECT COUNT(*) * 2 INTO max_score
 FROM testsengine_question q
 WHERE q.test_id = p_test_id;
 ELSE
 -- For other tests, use difficulty coefficients
 SELECT SUM(
 CASE
 WHEN q.difficulty_level = 'easy' THEN 1.0
 WHEN q.difficulty_level = 'medium' THEN 1.5
 WHEN q.difficulty_level = 'hard' THEN 2.0
 ELSE 1.0
 END
 ) INTO max_score
 FROM testsengine_question q
 WHERE q.test_id = p_test_id;
 END IF;

 RETURN COALESCE(max_score, 0);
 END;
 $$ LANGUAGE plpgsql;
 """)

 self.stdout.write(self.style.SUCCESS('Updated scoring functions for SJT!'))

 # Test the new scoring system
 print('\n=== Testing Updated Scoring System ===')

 # Test SJT scoring
 print('1. SJT Scoring Test:')
 sjt_answers = '{"11": "A", "12": "B", "13": "C"}'
 cursor.execute('SELECT calculate_total_test_score(%s, 4)', [sjt_answers])
 sjt_score = cursor.fetchone()[0]
 print(f' SJT answers A, B, C: {sjt_score} points')

 cursor.execute('SELECT get_max_possible_score(4)')
 sjt_max = cursor.fetchone()[0]
 print(f' SJT max possible score: {sjt_max} points')

 # Test other test scoring (should use old system)
 print('\\n2. Other Test Scoring Test:')
 other_answers = '{"1": "A", "2": "B"}'
 cursor.execute('SELECT calculate_total_test_score(%s, 1)', [other_answers])
 other_score = cursor.fetchone()[0]
 print(f' Other test answers: {other_score} points')

 # Test individual question scoring
 print('\\n3. Individual Question Scoring:')
 cursor.execute('SELECT calculate_question_score(11, %s, 4)', ['A'])
 q11_a = cursor.fetchone()[0]
 print(f' Q11 Answer A (SJT): {q11_a} points')

 cursor.execute('SELECT calculate_question_score(11, %s, 4)', ['D'])
 q11_d = cursor.fetchone()[0]
 print(f' Q11 Answer D (SJT): {q11_d} points')
