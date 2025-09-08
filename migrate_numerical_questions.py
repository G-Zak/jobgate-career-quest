"""
Migrate Numerical Reasoning questions from JSON to SQLite database
"""

import json
import sqlite3
import os
from datetime import datetime
from pathlib import Path

# Configuration
JSON_FILE = 'backend/skills_tests/data/numerical_reasoning_questions.json'
DB_FILE = 'Numerical_Reasoning.db'

# Create database schema
def create_database_schema(conn):
    """Create the necessary tables for the numerical reasoning database"""
    cursor = conn.cursor()
    
    # Create tests table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS tests (
        test_id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        total_time INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')
    
    # Create questions table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS questions (
        question_id INTEGER PRIMARY KEY AUTOINCREMENT,
        test_id INTEGER,
        category TEXT,
        difficulty TEXT,
        question_content TEXT,
        correct_answer TEXT,
        explanation TEXT,
        time_limit INTEGER,
        points INTEGER,
        metadata TEXT,
        FOREIGN KEY (test_id) REFERENCES tests (test_id)
    )
    ''')
    
    # Create options table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS options (
        option_id INTEGER PRIMARY KEY AUTOINCREMENT,
        question_id INTEGER,
        option_label TEXT,
        content TEXT,
        FOREIGN KEY (question_id) REFERENCES questions (question_id)
    )
    ''')
    
    # Create users table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        user_id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT
    )
    ''')
    
    # Create attempts table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS attempts (
        attempt_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        test_id INTEGER,
        start_time TIMESTAMP,
        end_time TIMESTAMP,
        score INTEGER,
        FOREIGN KEY (user_id) REFERENCES users (user_id),
        FOREIGN KEY (test_id) REFERENCES tests (test_id)
    )
    ''')
    
    # Create attempt_answers table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS attempt_answers (
        attempt_answer_id INTEGER PRIMARY KEY AUTOINCREMENT,
        attempt_id INTEGER,
        question_id INTEGER,
        chosen_option TEXT,
        is_correct BOOLEAN,
        FOREIGN KEY (attempt_id) REFERENCES attempts (attempt_id),
        FOREIGN KEY (question_id) REFERENCES questions (question_id)
    )
    ''')
    
    # Create test record
    cursor.execute('''
    INSERT INTO tests (name, description, total_time, created_at)
    VALUES (?, ?, ?, ?)
    ''', ('Numerical Reasoning', 'Numerical reasoning test with calculations and data interpretation', 1800, datetime.now()))
    
    conn.commit()
    return cursor.lastrowid  # Return the test_id

# Function to read JSON questions
def read_json_questions():
    with open(JSON_FILE, 'r') as f:
        return json.load(f)

# Main migration function
def migrate_questions_to_sqlite():
    """Migrate numerical reasoning questions from JSON to SQLite"""
    # Check if database already exists
    db_exists = os.path.exists(DB_FILE)
    
    # Connect to SQLite database
    conn = sqlite3.connect(DB_FILE)
    
    # Create schema if needed
    if not db_exists:
        test_id = create_database_schema(conn)
    else:
        # Get existing test ID
        cursor = conn.cursor()
        cursor.execute("SELECT test_id FROM tests WHERE name = 'Numerical Reasoning'")
        test = cursor.fetchone()
        if test is None:
            test_id = create_database_schema(conn)
        else:
            test_id = test[0]
    
    cursor = conn.cursor()
    
    # Read JSON questions
    questions = read_json_questions()
    
    # Process each question
    for question in questions:
        question_id = question["question_id"].replace('NUM_', '')
        
        # Insert or update question
        question_content = question["question_content"]
        
        cursor.execute('''
        INSERT OR REPLACE INTO questions 
        (question_id, test_id, category, difficulty, question_content, correct_answer, explanation, time_limit, points, metadata)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            int(question_id), 
            test_id,
            question["category"].lower(),
            question["difficulty"].lower(),
            json.dumps(question_content),
            question["correct_answer"],
            question["explanation"],
            question["time_limit"],
            question["points"],
            json.dumps(question.get("metadata", {}))
        ))
        
        # Delete any existing options for this question
        cursor.execute("DELETE FROM options WHERE question_id = ?", (int(question_id),))
        
        # Insert options
        for option in question["options"]:
            option_content = option["content"]
            
            cursor.execute('''
            INSERT INTO options (question_id, option_label, content)
            VALUES (?, ?, ?)
            ''', (
                int(question_id),
                option["option_id"],
                json.dumps(option_content)
            ))
    
    # Commit and close
    conn.commit()
    conn.close()
    
    print(f"Successfully migrated numerical reasoning questions to {DB_FILE}")

if __name__ == "__main__":
    migrate_questions_to_sqlite()
