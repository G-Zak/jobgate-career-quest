"""
SQLite Database Integration for Skills Tests
Handles loading questions from the SQLite database instead of JSON files.
Supports both numerical and abstract reasoning tests.
"""

import sqlite3
import json
import os
from typing import List, Dict, Any, Optional
from pathlib import Path

from . import Question

class SkillsTestDBLoader:
    """Class to handle loading test questions from SQLite database"""
    
    def __init__(self, db_path: str = None):
        """Initialize with path to SQLite database"""
        if db_path is None:
            # Default to project root - will check for both types of databases
            self.db_path = {
                'abstract_reasoning': str(Path(__file__).resolve().parent.parent.parent / 'Abstract_Reasoning.db'),
                'numerical_reasoning': str(Path(__file__).resolve().parent.parent.parent / 'Numerical_Reasoning.db')
            }
        else:
            self.db_path = {
                'abstract_reasoning': db_path,
                'numerical_reasoning': db_path
            }
    
    def load_questions(self, test_type: str) -> List[Question]:
        """
        Load questions from SQLite database
        
        Args:
            test_type: The type of test ('abstract_reasoning' or 'numerical_reasoning')
            
        Returns:
            List of Question objects
        """
        conn = None
        try:
            # Select the appropriate database file
            db_path = self.db_path.get(test_type)
            if not os.path.exists(db_path):
                raise FileNotFoundError(f"Database file not found: {db_path}")
                
            conn = sqlite3.connect(db_path)
            cursor = conn.cursor()
            
            # Set the test name based on type
            test_name = 'Abstract Reasoning' if test_type == 'abstract_reasoning' else 'Numerical Reasoning'
            
            # Get test ID for the selected test
            cursor.execute("SELECT test_id FROM tests WHERE name = ?", (test_name,))
            test = cursor.fetchone()
            if not test:
                raise ValueError(f"{test_name} test not found in database")
            
            test_id = test[0]
            
            # Load questions for the test
            cursor.execute("""
                SELECT question_id, category, difficulty, question_content, correct_answer, 
                       explanation, time_limit, points, metadata
                FROM questions 
                WHERE test_id = ?
            """, (test_id,))
            
            questions_data = cursor.fetchall()
            questions = []
            
            for q_data in questions_data:
                # Get options for this question
                cursor.execute("""
                    SELECT option_label, content
                    FROM options
                    WHERE question_id = ?
                """, (q_data[0],))
                
                options_data = cursor.fetchall()
                options = []
                
                for opt_data in options_data:
                    option_label = opt_data[0]
                    content = json.loads(opt_data[1])
                    
                    options.append({
                        "option_id": option_label,
                        "content": content
                    })
                
                # Create prefix based on test type
                prefix = "ART_" if test_type == "abstract_reasoning" else "NUM_"
                
                # Create Question object
                question = Question(
                    question_id=f"{prefix}{q_data[0]:03d}",
                    test_type=test_type,
                    difficulty=q_data[2],
                    category=q_data[1],
                    question_content=json.loads(q_data[3]),
                    options=options,
                    correct_answer=q_data[4],
                    explanation=q_data[5],
                    time_limit=q_data[6],
                    points=q_data[7],
                    metadata=json.loads(q_data[8]) if q_data[8] else {}
                )
                
                questions.append(question)
            
            return questions
            
        except sqlite3.Error as e:
            print(f"SQLite error: {e}")
            # Fallback to original JSON loading if database fails
            raise
        finally:
            if conn:
                conn.close()
    
    def get_available_tests(self):
        """
        Get information about available tests in the database
        
        Returns:
            Dictionary with test information
        """
        results = {}
        
        for test_type, db_path in self.db_path.items():
            if not os.path.exists(db_path):
                continue
                
            try:
                conn = sqlite3.connect(db_path)
                cursor = conn.cursor()
                
                # Get test information
                cursor.execute("SELECT * FROM tests")
                tests = cursor.fetchall()
                
                # Get question counts
                cursor.execute("SELECT COUNT(*) FROM questions")
                question_count = cursor.fetchone()[0]
                
                # Get category distribution
                cursor.execute("SELECT category, COUNT(*) FROM questions GROUP BY category")
                categories = {row[0]: row[1] for row in cursor.fetchall()}
                
                # Get difficulty distribution
                cursor.execute("SELECT difficulty, COUNT(*) FROM questions GROUP BY difficulty")
                difficulties = {row[0]: row[1] for row in cursor.fetchall()}
                
                # Add to results
                for test in tests:
                    test_name = test[1].lower().replace(' ', '_')
                    if test_name == test_type:
                        results[test_type] = {
                            'name': test[1],
                            'description': test[2],
                            'total_time': test[3],
                            'created_at': test[4],
                            'question_count': question_count,
                            'categories': categories,
                            'difficulties': difficulties
                        }
                
                conn.close()
            except Exception as e:
                print(f"Error getting test info for {test_type}: {e}")
        
        return results
