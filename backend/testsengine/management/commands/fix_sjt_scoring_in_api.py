from django.core.management.base import BaseCommand
from django.db import connection
from testsengine.models import Test, Question

class Command(BaseCommand):
    help = 'Fix SJT scoring in the API to use the new scoring system'

    def handle(self, *args, **options):
        # Update the scoring service to use the new SJT scoring functions
        with connection.cursor() as cursor:
            # Create a comprehensive scoring function that handles SJT properly
            cursor.execute("""
                CREATE OR REPLACE FUNCTION calculate_question_score_enhanced(
                    p_question_id INTEGER,
                    p_selected_answer CHAR(1),
                    p_test_id INTEGER
                ) RETURNS DECIMAL AS $$
                DECLARE
                    score_value INTEGER;
                    difficulty_coefficient DECIMAL;
                    final_score DECIMAL;
                    is_correct BOOLEAN;
                BEGIN
                    -- Check if this is an SJT test (test_id = 4)
                    IF p_test_id = 4 THEN
                        -- Use new SJT scoring system
                        SELECT qo.score_value INTO score_value
                        FROM testsengine_questionoption qo
                        WHERE qo.question_id = p_question_id 
                        AND qo.option_letter = p_selected_answer;
                        
                        -- Return the actual score value (can be negative)
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
                        SELECT (q.correct_answer = p_selected_answer) INTO is_correct
                        FROM testsengine_question q
                        WHERE q.id = p_question_id;
                        
                        IF is_correct THEN
                            RETURN difficulty_coefficient;
                        ELSE
                            RETURN 0;
                        END IF;
                    END IF;
                END;
                $$ LANGUAGE plpgsql;
            """)
            
            # Update the total test score function
            cursor.execute("""
                CREATE OR REPLACE FUNCTION calculate_total_test_score_enhanced(
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
                        SELECT calculate_question_score_enhanced(question_id, selected_answer, p_test_id) INTO question_score;
                        total_score := total_score + question_score;
                    END LOOP;
                    
                    RETURN total_score;
                END;
                $$ LANGUAGE plpgsql;
            """)
            
            # Update the max possible score function
            cursor.execute("""
                CREATE OR REPLACE FUNCTION get_max_possible_score_enhanced(
                    p_test_id INTEGER
                ) RETURNS DECIMAL AS $$
                DECLARE
                    max_score DECIMAL;
                BEGIN
                    IF p_test_id = 4 THEN
                        -- For SJT, maximum score is all best answers (+2 each)
                        SELECT COUNT(*) * 2.0 INTO max_score
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
            
            self.stdout.write(self.style.SUCCESS('Updated enhanced scoring functions!'))
            
            # Test the enhanced scoring system
            print('\n=== Testing Enhanced Scoring System ===')
            
            # Test SJT scoring
            print('1. SJT Scoring Test:')
            sjt_answers = '{"11": "A", "12": "B", "13": "C", "14": "A", "15": "D"}'
            cursor.execute('SELECT calculate_total_test_score_enhanced(%s, 4)', [sjt_answers])
            sjt_score = cursor.fetchone()[0]
            print(f'  SJT answers A, B, C, A, D: {sjt_score} points')
            
            cursor.execute('SELECT get_max_possible_score_enhanced(4)')
            sjt_max = cursor.fetchone()[0]
            print(f'  SJT max possible score: {sjt_max} points')
            
            percentage = (sjt_score / sjt_max) * 100 if sjt_max > 0 else 0
            print(f'  SJT percentage: {percentage:.2f}%')
            
            # Test individual question scoring
            print('\\n2. Individual Question Scoring:')
            test_cases = [
                (11, 'A', 'Best option'),
                (11, 'B', 'Acceptable option'),
                (11, 'C', 'Unacceptable option'),
                (11, 'D', 'Must not choose option')
            ]
            
            for question_id, answer, description in test_cases:
                cursor.execute('SELECT calculate_question_score_enhanced(%s, %s, 4)', [question_id, answer])
                score = cursor.fetchone()[0]
                print(f'  Q{question_id} Answer {answer}: {score} points ({description})')
        
        # Update the Test model to use the new max score calculation
        sjt_test = Test.objects.get(id=4)
        with connection.cursor() as cursor:
            cursor.execute('SELECT get_max_possible_score_enhanced(4)')
            new_max_score = cursor.fetchone()[0]
            sjt_test.max_possible_score = new_max_score
            sjt_test.save()
            print(f'\\n3. Updated Test 4 max_possible_score to: {new_max_score}')
        
        self.stdout.write(self.style.SUCCESS('SJT scoring system is now properly integrated!'))
