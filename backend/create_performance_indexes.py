#!/usr/bin/env python3
"""
Create Performance Indexes Script
================================

This script creates performance indexes for the PostgreSQL database
outside of Django migrations to avoid transaction block issues.

Usage:
    python create_performance_indexes.py
    python create_performance_indexes.py --check
    python create_performance_indexes.py --drop
"""

import os
import sys
import argparse
import time
from pathlib import Path

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'careerquest.settings')
import django
django.setup()

from django.db import connection


class IndexCreator:
    """Creates performance indexes for the database"""
    
    def __init__(self):
        self.indexes = [
            # TestSubmission optimizations
            {
                'name': 'idx_testsubmission_user_submitted',
                'sql': 'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_testsubmission_user_submitted ON testsengine_testsubmission (user_id, submitted_at DESC);',
                'drop_sql': 'DROP INDEX IF EXISTS idx_testsubmission_user_submitted;'
            },
            {
                'name': 'idx_testsubmission_test_submitted',
                'sql': 'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_testsubmission_test_submitted ON testsengine_testsubmission (test_id, submitted_at DESC);',
                'drop_sql': 'DROP INDEX IF EXISTS idx_testsubmission_test_submitted;'
            },
            {
                'name': 'idx_testsubmission_user_test_submitted',
                'sql': 'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_testsubmission_user_test_submitted ON testsengine_testsubmission (user_id, test_id, submitted_at DESC);',
                'drop_sql': 'DROP INDEX IF EXISTS idx_testsubmission_user_test_submitted;'
            },
            
            # Answer optimizations
            {
                'name': 'idx_answer_submission_correct',
                'sql': 'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_answer_submission_correct ON testsengine_answer (submission_id, is_correct, points_awarded);',
                'drop_sql': 'DROP INDEX IF EXISTS idx_answer_submission_correct;'
            },
            {
                'name': 'idx_answer_question_correct',
                'sql': 'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_answer_question_correct ON testsengine_answer (question_id, is_correct, points_awarded);',
                'drop_sql': 'DROP INDEX IF EXISTS idx_answer_question_correct;'
            },
            
            # Question optimizations
            {
                'name': 'idx_question_test_difficulty',
                'sql': 'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_question_test_difficulty ON testsengine_question (test_id, difficulty_level, scoring_coefficient);',
                'drop_sql': 'DROP INDEX IF EXISTS idx_question_test_difficulty;'
            },
            {
                'name': 'idx_question_test_type_difficulty',
                'sql': 'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_question_test_type_difficulty ON testsengine_question (test_id, question_type, difficulty_level);',
                'drop_sql': 'DROP INDEX IF EXISTS idx_question_test_type_difficulty;'
            },
            
            # Score optimizations
            {
                'name': 'idx_score_percentage_grade',
                'sql': 'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_score_percentage_grade ON testsengine_score (percentage_score DESC, grade_letter, passed);',
                'drop_sql': 'DROP INDEX IF EXISTS idx_score_percentage_grade;'
            },
            {
                'name': 'idx_score_calculated_at',
                'sql': 'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_score_calculated_at ON testsengine_score (calculated_at DESC);',
                'drop_sql': 'DROP INDEX IF EXISTS idx_score_calculated_at;'
            },
            
            # Test optimizations
            {
                'name': 'idx_test_type_active_created',
                'sql': 'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_test_type_active_created ON testsengine_test (test_type, is_active, created_at DESC);',
                'drop_sql': 'DROP INDEX IF EXISTS idx_test_type_active_created;'
            },
            {
                'name': 'idx_test_active_duration',
                'sql': 'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_test_active_duration ON testsengine_test (is_active, duration_minutes, total_questions);',
                'drop_sql': 'DROP INDEX IF EXISTS idx_test_active_duration;'
            },
            
            # Partial indexes for common filters
            {
                'name': 'idx_testsubmission_active',
                'sql': 'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_testsubmission_active ON testsengine_testsubmission (user_id, test_id) WHERE is_complete = true;',
                'drop_sql': 'DROP INDEX IF EXISTS idx_testsubmission_active;'
            },
            {
                'name': 'idx_answer_correct_only',
                'sql': 'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_answer_correct_only ON testsengine_answer (submission_id, question_id) WHERE is_correct = true;',
                'drop_sql': 'DROP INDEX IF EXISTS idx_answer_correct_only;'
            },
            
            # Text search indexes
            {
                'name': 'idx_question_text_search',
                'sql': 'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_question_text_search ON testsengine_question USING gin(to_tsvector(\'english\', question_text));',
                'drop_sql': 'DROP INDEX IF EXISTS idx_question_text_search;'
            },
            {
                'name': 'idx_test_title_search',
                'sql': 'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_test_title_search ON testsengine_test USING gin(to_tsvector(\'english\', title));',
                'drop_sql': 'DROP INDEX IF EXISTS idx_test_title_search;'
            },
            
            # Statistics and analytics indexes
            {
                'name': 'idx_score_analytics',
                'sql': 'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_score_analytics ON testsengine_score (raw_score, max_possible_score, percentage_score, calculated_at);',
                'drop_sql': 'DROP INDEX IF EXISTS idx_score_analytics;'
            },
            {
                'name': 'idx_submission_analytics',
                'sql': 'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_submission_analytics ON testsengine_testsubmission (submitted_at, time_taken_seconds, is_complete);',
                'drop_sql': 'DROP INDEX IF EXISTS idx_submission_analytics;'
            },
            
            # Foreign key optimization indexes
            {
                'name': 'idx_answer_submission_question',
                'sql': 'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_answer_submission_question ON testsengine_answer (submission_id, question_id, answered_at);',
                'drop_sql': 'DROP INDEX IF EXISTS idx_answer_submission_question;'
            },
            
            # Performance monitoring indexes
            {
                'name': 'idx_testsubmission_performance',
                'sql': 'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_testsubmission_performance ON testsengine_testsubmission (time_taken_seconds, submitted_at) WHERE is_complete = true;',
                'drop_sql': 'DROP INDEX IF EXISTS idx_testsubmission_performance;'
            },
        ]
    
    def check_indexes(self):
        """Check which indexes exist"""
        print("🔍 Checking existing indexes...")
        
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT indexname 
                FROM pg_indexes 
                WHERE schemaname = 'public' 
                AND indexname LIKE 'idx_%'
                ORDER BY indexname;
            """)
            
            existing_indexes = [row[0] for row in cursor.fetchall()]
            
            print(f"\n📊 Found {len(existing_indexes)} performance indexes:")
            for index in existing_indexes:
                print(f"  ✅ {index}")
            
            missing_indexes = []
            for index_def in self.indexes:
                if index_def['name'] not in existing_indexes:
                    missing_indexes.append(index_def['name'])
            
            if missing_indexes:
                print(f"\n⚠️  Missing {len(missing_indexes)} indexes:")
                for index in missing_indexes:
                    print(f"  ❌ {index}")
            else:
                print("\n✅ All performance indexes are present!")
            
            return existing_indexes, missing_indexes
    
    def create_indexes(self, verbose=False):
        """Create all performance indexes"""
        print("🚀 Creating performance indexes...")
        
        created_count = 0
        failed_count = 0
        
        with connection.cursor() as cursor:
            for i, index_def in enumerate(self.indexes, 1):
                print(f"\n[{i}/{len(self.indexes)}] Creating {index_def['name']}...")
                
                try:
                    start_time = time.time()
                    cursor.execute(index_def['sql'])
                    duration = time.time() - start_time
                    
                    print(f"  ✅ Created in {duration:.2f}s")
                    created_count += 1
                    
                except Exception as e:
                    print(f"  ❌ Failed: {e}")
                    failed_count += 1
                    
                    if verbose:
                        print(f"  SQL: {index_def['sql']}")
        
        print(f"\n📊 Summary:")
        print(f"  ✅ Created: {created_count}")
        print(f"  ❌ Failed: {failed_count}")
        
        return created_count, failed_count
    
    def drop_indexes(self, verbose=False):
        """Drop all performance indexes"""
        print("🗑️  Dropping performance indexes...")
        
        dropped_count = 0
        failed_count = 0
        
        with connection.cursor() as cursor:
            for i, index_def in enumerate(self.indexes, 1):
                print(f"\n[{i}/{len(self.indexes)}] Dropping {index_def['name']}...")
                
                try:
                    start_time = time.time()
                    cursor.execute(index_def['drop_sql'])
                    duration = time.time() - start_time
                    
                    print(f"  ✅ Dropped in {duration:.2f}s")
                    dropped_count += 1
                    
                except Exception as e:
                    print(f"  ❌ Failed: {e}")
                    failed_count += 1
                    
                    if verbose:
                        print(f"  SQL: {index_def['drop_sql']}")
        
        print(f"\n📊 Summary:")
        print(f"  ✅ Dropped: {dropped_count}")
        print(f"  ❌ Failed: {failed_count}")
        
        return dropped_count, failed_count
    
    def get_database_info(self):
        """Get database information"""
        with connection.cursor() as cursor:
            # Get database size
            cursor.execute("SELECT pg_size_pretty(pg_database_size(current_database()));")
            db_size = cursor.fetchone()[0]
            
            # Get table count
            cursor.execute("SELECT COUNT(*) FROM pg_tables WHERE schemaname = 'public';")
            table_count = cursor.fetchone()[0]
            
            # Get index count
            cursor.execute("SELECT COUNT(*) FROM pg_indexes WHERE schemaname = 'public';")
            index_count = cursor.fetchone()[0]
            
            return {
                'database_size': db_size,
                'table_count': table_count,
                'index_count': index_count
            }


def main():
    """Main function"""
    parser = argparse.ArgumentParser(description='Create Performance Indexes')
    parser.add_argument('--check', action='store_true', help='Check existing indexes')
    parser.add_argument('--drop', action='store_true', help='Drop all performance indexes')
    parser.add_argument('--verbose', action='store_true', help='Verbose output')
    
    args = parser.parse_args()
    
    creator = IndexCreator()
    
    # Get database info
    info = creator.get_database_info()
    print(f"📊 Database: {info['database_size']}, Tables: {info['table_count']}, Indexes: {info['index_count']}")
    
    if args.check:
        creator.check_indexes()
    elif args.drop:
        confirm = input("Are you sure you want to drop all performance indexes? (y/N): ")
        if confirm.lower() == 'y':
            creator.drop_indexes(args.verbose)
        else:
            print("Operation cancelled.")
    else:
        # Create indexes
        existing, missing = creator.check_indexes()
        
        if missing:
            print(f"\n🚀 Creating {len(missing)} missing indexes...")
            creator.create_indexes(args.verbose)
        else:
            print("\n✅ All indexes already exist!")


if __name__ == '__main__':
    main()
