#!/usr/bin/env python3
"""
Database Import Script for Skills Assessment Data
This script imports the cleaned JSONL files into a MySQL/MariaDB database
"""

import json
import mysql.connector
from mysql.connector import Error
import os
from datetime import datetime
import sys

class SkillsAssessmentImporter:
    def __init__(self, host='localhost', database='jobgate_skills_assessment', 
                 user='root', password=''):
        self.connection_params = {
            'host': host,
            'database': database,
            'user': user,
            'password': password
        }
        self.connection = None

    def connect(self):
        """Establish database connection"""
        try:
            self.connection = mysql.connector.connect(**self.connection_params)
            print(f"✅ Connected to MySQL database: {self.connection_params['database']}")
            return True
        except Error as e:
            print(f"❌ Error connecting to MySQL: {e}")
            return False

    def disconnect(self):
        """Close database connection"""
        if self.connection and self.connection.is_connected():
            self.connection.close()
            print("🔌 Database connection closed")

    def read_jsonl(self, file_path):
        """Read JSONL file and return list of dictionaries"""
        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                return [json.loads(line.strip()) for line in file if line.strip()]
        except Exception as e:
            print(f"❌ Error reading {file_path}: {e}")
            return []

    def import_sjt_questions(self, file_path):
        """Import SJT questions from JSONL file"""
        questions = self.read_jsonl(file_path)
        if not questions:
            return False

        cursor = self.connection.cursor()
        
        # Clear existing data
        cursor.execute("DELETE FROM sjt_questions")
        print(f"🧹 Cleared existing SJT questions")

        insert_query = """
        INSERT INTO sjt_questions 
        (id, domain, scenario, choices, answer_index, answer, explanation, difficulty, tags, translations)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """

        success_count = 0
        for question in questions:
            try:
                data = (
                    question['id'],
                    question['domain'],
                    question['scenario'],
                    json.dumps(question['choices']),
                    question['answer_index'],
                    question['answer'],
                    question['explanation'],
                    question['difficulty'],
                    json.dumps(question.get('tags', [])),
                    json.dumps(question.get('translations', {}))
                )
                cursor.execute(insert_query, data)
                success_count += 1
            except Exception as e:
                print(f"⚠️  Error inserting SJT question {question.get('id', 'unknown')}: {e}")

        self.connection.commit()
        cursor.close()
        print(f"✅ Imported {success_count}/{len(questions)} SJT questions")
        return True

    def import_verbal_questions(self, file_path, question_type):
        """Import verbal reasoning questions from JSONL file"""
        questions = self.read_jsonl(file_path)
        if not questions:
            return False

        cursor = self.connection.cursor()
        
        # Clear existing data for this type
        cursor.execute("DELETE FROM verbal_questions WHERE type = %s", (question_type,))
        print(f"🧹 Cleared existing {question_type} questions")

        insert_query = """
        INSERT INTO verbal_questions 
        (id, type, subtype, stem, choices, answer_index, answer, difficulty, explanation, 
         relationship_type, structure_data, tags, translations)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """

        success_count = 0
        for question in questions:
            try:
                data = (
                    question['id'],
                    question.get('type', question_type),
                    question.get('subtype', question.get('type', '')),
                    question['stem'],
                    json.dumps(question['choices']),
                    question['answer_index'],
                    question['answer'],
                    question['difficulty'],
                    question.get('explanation', ''),
                    question.get('relationship', question.get('relationship_type', '')),
                    json.dumps(question.get('structure', {})),
                    json.dumps(question.get('tags', [])),
                    json.dumps(question.get('translations', {}))
                )
                cursor.execute(insert_query, data)
                success_count += 1
            except Exception as e:
                print(f"⚠️  Error inserting {question_type} question {question.get('id', 'unknown')}: {e}")

        self.connection.commit()
        cursor.close()
        print(f"✅ Imported {success_count}/{len(questions)} {question_type} questions")
        return True

    def import_test_config(self, file_path):
        """Import test configuration from JSON file"""
        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                config = json.load(file)
        except Exception as e:
            print(f"❌ Error reading config file {file_path}: {e}")
            return False

        cursor = self.connection.cursor()
        
        # Clear existing config
        cursor.execute("DELETE FROM test_configurations WHERE id = 'spatial_reasoning'")
        
        insert_query = """
        INSERT INTO test_configurations 
        (id, test_name, description, total_duration_minutes, sections, difficulty_levels, 
         scoring_method, image_path_base)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """

        try:
            data = (
                'spatial_reasoning',
                config['test_name'],
                config['description'],
                config['total_duration_minutes'],
                json.dumps(config['sections']),
                json.dumps(config['difficulty_levels']),
                config.get('scoring_method', 'standard'),
                config.get('image_path_base', '')
            )
            cursor.execute(insert_query, data)
            self.connection.commit()
            cursor.close()
            print(f"✅ Imported spatial test configuration")
            return True
        except Exception as e:
            print(f"❌ Error inserting test configuration: {e}")
            cursor.close()
            return False

    def run_import(self, base_path='./db-migration'):
        """Run the complete import process"""
        print("🚀 Starting Skills Assessment Data Import")
        print("=" * 50)

        if not self.connect():
            return False

        try:
            # Import SJT questions
            sjt_path = os.path.join(base_path, 'situational-judgment', 'sjt_questions.jsonl')
            if os.path.exists(sjt_path):
                self.import_sjt_questions(sjt_path)
            else:
                print(f"⚠️  SJT file not found: {sjt_path}")

            # Import verbal reasoning questions
            verbal_files = [
                ('analogy_questions.jsonl', 'analogy'),
                ('blood_relations_questions.jsonl', 'blood_relations'),
                ('classification_questions.jsonl', 'classification'),
                ('coding_decoding_questions.jsonl', 'coding_decoding')
            ]

            for filename, question_type in verbal_files:
                file_path = os.path.join(base_path, 'verbal-reasoning', filename)
                if os.path.exists(file_path):
                    self.import_verbal_questions(file_path, question_type)
                else:
                    print(f"⚠️  Verbal file not found: {file_path}")

            # Import spatial test configuration
            config_path = os.path.join(base_path, 'spatial-reasoning', 'spatial_test_config.json')
            if os.path.exists(config_path):
                self.import_test_config(config_path)
            else:
                print(f"⚠️  Config file not found: {config_path}")

            print("\n✅ Import process completed!")
            print("\n📊 Database Summary:")
            
            # Get counts
            cursor = self.connection.cursor()
            
            cursor.execute("SELECT COUNT(*) FROM sjt_questions")
            sjt_count = cursor.fetchone()[0]
            
            cursor.execute("SELECT COUNT(*) FROM verbal_questions")
            verbal_count = cursor.fetchone()[0]
            
            cursor.execute("SELECT COUNT(*) FROM test_configurations")
            config_count = cursor.fetchone()[0]
            
            cursor.close()
            
            print(f"  - SJT Questions: {sjt_count}")
            print(f"  - Verbal Questions: {verbal_count}")
            print(f"  - Test Configurations: {config_count}")

        except Exception as e:
            print(f"❌ Import process failed: {e}")
            return False
        finally:
            self.disconnect()

        return True

def main():
    """Main function with command line argument support"""
    import argparse
    
    parser = argparse.ArgumentParser(description='Import skills assessment data to database')
    parser.add_argument('--host', default='localhost', help='Database host')
    parser.add_argument('--database', default='jobgate_skills_assessment', help='Database name')
    parser.add_argument('--user', default='root', help='Database user')
    parser.add_argument('--password', default='', help='Database password')
    parser.add_argument('--data-path', default='./db-migration', help='Path to migration data directory')
    
    args = parser.parse_args()
    
    # Check if data directory exists
    if not os.path.exists(args.data_path):
        print(f"❌ Data directory not found: {args.data_path}")
        sys.exit(1)
    
    # Create importer and run
    importer = SkillsAssessmentImporter(
        host=args.host,
        database=args.database,
        user=args.user,
        password=args.password
    )
    
    success = importer.run_import(args.data_path)
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()
