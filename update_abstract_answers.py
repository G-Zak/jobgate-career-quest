"""
Update correct answers in the Abstract_Reasoning.db database
to match the provided answers list
"""

import sqlite3
import os

def update_abstract_answers():
    # Connect to the database
    db_path = 'Abstract_Reasoning.db'
    if not os.path.exists(db_path):
        print(f"Database file not found: {db_path}")
        return False
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Correct answers for each question (1-indexed for database)
    correct_answers = [
        ("A", 1),  # Question 1 (0.png)
        ("C", 2),  # Question 2 (1.png)
        ("C", 3),  # Question 3 (2.png)
        ("D", 4),  # Question 4 (3.png)
        ("B", 5),  # Question 5 (4.png)
        ("B", 6),  # Question 6 (5.png)
        ("C", 7),  # Question 7 (6.png)
        ("D", 8),  # Question 8 (7.png)
        ("A", 9),  # Question 9 (8.png)
        ("C", 10), # Question 10 (9.png)
        ("C", 11), # Question 11 (10.png)
        ("D", 12), # Question 12 (11.png)
        ("A", 13), # Question 13 (12.png)
        ("D", 14), # Question 14 (13.png)
        ("E", 15), # Question 15 (14.png)
        ("D", 16), # Question 16 (15.png)
        ("A", 17), # Question 17 (16.png)
        ("C", 18), # Question 18 (17.png)
        ("A", 19), # Question 19 (18.png)
        ("B", 20), # Question 20 (19.png)
        ("D", 21), # Question 21 (20.png)
        ("B", 22), # Question 22 (21.png)
        ("C", 23), # Question 23 (22.png)
        ("C", 24), # Question 24 (23.png)
        ("D", 25), # Question 25 (24.png)
    ]
    
    try:
        # Begin transaction
        conn.execute('BEGIN TRANSACTION')
        
        # Update each question's correct answer
        for answer, question_id in correct_answers:
            cursor.execute(
                "UPDATE questions SET correct_answer = ? WHERE question_id = ?",
                (answer, question_id)
            )
            print(f"Updated question {question_id}: correct answer set to {answer}")
        
        # Commit changes
        conn.commit()
        print("All changes committed successfully")
        
        # Verify the updates
        cursor.execute("SELECT question_id, correct_answer FROM questions ORDER BY question_id")
        updated_answers = cursor.fetchall()
        
        print("\nVerification of updated answers:")
        for q_id, answer in updated_answers:
            print(f"Question {q_id}: {answer}")
            
        return True
    
    except Exception as e:
        # Rollback in case of error
        conn.rollback()
        print(f"Error updating answers: {e}")
        return False
    
    finally:
        conn.close()

if __name__ == "__main__":
    print("Updating abstract reasoning test correct answers...")
    success = update_abstract_answers()
    if success:
        print("Update completed successfully")
    else:
        print("Update failed")
