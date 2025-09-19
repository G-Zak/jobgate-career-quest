"""
Django Management Command for Database Optimization
=================================================

This command provides database optimization functionality including:
- Index analysis and recommendations
- Query performance analysis
- Database statistics updates
- Vacuum and analyze operations
- Index usage monitoring

Usage:
    python manage.py optimize_database --analyze
    python manage.py optimize_database --vacuum
    python manage.py optimize_database --index-usage
    python manage.py optimize_database --recommendations
"""

from django.core.management.base import BaseCommand, CommandError
from django.db import connection
from django.conf import settings
import time
from datetime import datetime


class Command(BaseCommand):
    help = 'Optimize database performance with indexes, vacuum, and analysis'

    def add_arguments(self, parser):
        parser.add_argument(
            '--analyze',
            action='store_true',
            help='Update database statistics'
        )
        parser.add_argument(
            '--vacuum',
            action='store_true',
            help='Run VACUUM on all tables'
        )
        parser.add_argument(
            '--index-usage',
            action='store_true',
            help='Show index usage statistics'
        )
        parser.add_argument(
            '--recommendations',
            action='store_true',
            help='Show optimization recommendations'
        )
        parser.add_argument(
            '--slow-queries',
            action='store_true',
            help='Show slow query analysis'
        )
        parser.add_argument(
            '--all',
            action='store_true',
            help='Run all optimization operations'
        )
        parser.add_argument(
            '--verbose',
            action='store_true',
            help='Verbose output'
        )

    def handle(self, *args, **options):
        """Handle the command execution"""
        
        if options['all']:
            self.run_all_optimizations(options['verbose'])
        else:
            if options['analyze']:
                self.update_statistics(options['verbose'])
            
            if options['vacuum']:
                self.run_vacuum(options['verbose'])
            
            if options['index_usage']:
                self.show_index_usage(options['verbose'])
            
            if options['recommendations']:
                self.show_recommendations(options['verbose'])
            
            if options['slow_queries']:
                self.analyze_slow_queries(options['verbose'])
            
            if not any([options['analyze'], options['vacuum'], options['index_usage'], 
                       options['recommendations'], options['slow_queries']]):
                self.stdout.write(self.style.WARNING('No operation specified. Use --help for options.'))
                return

    def run_all_optimizations(self, verbose=False):
        """Run all optimization operations"""
        self.stdout.write(self.style.SUCCESS('🚀 Running all database optimizations...'))
        
        self.update_statistics(verbose)
        self.run_vacuum(verbose)
        self.show_index_usage(verbose)
        self.show_recommendations(verbose)
        self.analyze_slow_queries(verbose)
        
        self.stdout.write(self.style.SUCCESS('✅ All optimizations completed!'))

    def update_statistics(self, verbose=False):
        """Update database statistics"""
        self.stdout.write('📊 Updating database statistics...')
        
        start_time = time.time()
        
        with connection.cursor() as cursor:
            # Update statistics for all tables
            cursor.execute("ANALYZE;")
            
            # Get updated statistics
            cursor.execute("""
                SELECT 
                    schemaname,
                    relname as tablename,
                    n_tup_ins as inserts,
                    n_tup_upd as updates,
                    n_tup_del as deletes,
                    n_live_tup as live_rows,
                    n_dead_tup as dead_rows,
                    last_analyze,
                    last_autoanalyze
                FROM pg_stat_user_tables 
                WHERE schemaname = 'public'
                ORDER BY relname;
            """)
            
            tables = cursor.fetchall()
            
            if verbose:
                self.stdout.write('\n📋 Table Statistics:')
                for table in tables:
                    self.stdout.write(f'  • {table[1]}: {table[5]} live rows, {table[6]} dead rows')
                    if table[7]:
                        self.stdout.write(f'    Last analyzed: {table[7]}')
                    if table[8]:
                        self.stdout.write(f'    Last auto-analyzed: {table[8]}')
        
        duration = time.time() - start_time
        self.stdout.write(self.style.SUCCESS(f'✅ Statistics updated in {duration:.2f}s'))

    def run_vacuum(self, verbose=False):
        """Run VACUUM on all tables"""
        self.stdout.write('🧹 Running VACUUM on all tables...')
        
        start_time = time.time()
        
        with connection.cursor() as cursor:
            # Get table sizes before vacuum
            cursor.execute("""
                SELECT 
                    tablename,
                    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size_before
                FROM pg_tables 
                WHERE schemaname = 'public'
                ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
            """)
            
            tables_before = cursor.fetchall()
            
            if verbose:
                self.stdout.write('\n📊 Table sizes before VACUUM:')
                for table in tables_before:
                    self.stdout.write(f'  • {table[0]}: {table[1]}')
            
            # Run VACUUM
            cursor.execute("VACUUM ANALYZE;")
            
            # Get table sizes after vacuum
            cursor.execute("""
                SELECT 
                    tablename,
                    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size_after
                FROM pg_tables 
                WHERE schemaname = 'public'
                ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
            """)
            
            tables_after = cursor.fetchall()
            
            if verbose:
                self.stdout.write('\n📊 Table sizes after VACUUM:')
                for table in tables_after:
                    self.stdout.write(f'  • {table[0]}: {table[1]}')
        
        duration = time.time() - start_time
        self.stdout.write(self.style.SUCCESS(f'✅ VACUUM completed in {duration:.2f}s'))

    def show_index_usage(self, verbose=False):
        """Show index usage statistics"""
        self.stdout.write('🔍 Analyzing index usage...')
        
        with connection.cursor() as cursor:
            # Get index usage statistics
            cursor.execute("""
                SELECT 
                    schemaname,
                    relname as tablename,
                    indexrelname as indexname,
                    idx_tup_read,
                    idx_tup_fetch,
                    idx_scan,
                    pg_size_pretty(pg_relation_size(indexrelid)) as index_size
                FROM pg_stat_user_indexes 
                WHERE schemaname = 'public'
                ORDER BY idx_scan DESC;
            """)
            
            indexes = cursor.fetchall()
            
            self.stdout.write('\n📊 Index Usage Statistics:')
            self.stdout.write('-' * 80)
            
            unused_indexes = []
            for index in indexes:
                schema, table, name, reads, fetches, scans, size = index
                
                if scans == 0:
                    unused_indexes.append((table, name, size))
                    if verbose:
                        self.stdout.write(f'⚠️  UNUSED: {table}.{name} ({size})')
                else:
                    efficiency = (fetches / reads * 100) if reads > 0 else 0
                    self.stdout.write(f'✅ {table}.{name}: {scans} scans, {efficiency:.1f}% efficiency ({size})')
            
            if unused_indexes:
                self.stdout.write(f'\n⚠️  Found {len(unused_indexes)} unused indexes:')
                for table, name, size in unused_indexes:
                    self.stdout.write(f'  • {table}.{name} ({size})')

    def show_recommendations(self, verbose=False):
        """Show optimization recommendations"""
        self.stdout.write('💡 Generating optimization recommendations...')
        
        with connection.cursor() as cursor:
            # Check for missing indexes on foreign keys
            cursor.execute("""
                SELECT 
                    t.table_name,
                    t.column_name,
                    t.constraint_name
                FROM information_schema.table_constraints tc
                JOIN information_schema.key_column_usage t ON tc.constraint_name = t.constraint_name
                WHERE tc.constraint_type = 'FOREIGN KEY'
                AND tc.table_schema = 'public'
                AND NOT EXISTS (
                    SELECT 1 FROM pg_indexes 
                    WHERE tablename = t.table_name 
                    AND indexdef LIKE '%' || t.column_name || '%'
                );
            """)
            
            missing_fk_indexes = cursor.fetchall()
            
            # Check for tables without primary key indexes
            cursor.execute("""
                SELECT 
                    tablename,
                    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
                FROM pg_tables 
                WHERE schemaname = 'public'
                AND tablename NOT IN (
                    SELECT tablename FROM pg_indexes 
                    WHERE indexname LIKE '%_pkey'
                );
            """)
            
            missing_pk_indexes = cursor.fetchall()
            
            # Check for large tables without proper indexes
            cursor.execute("""
                SELECT 
                    tablename,
                    n_live_tup as row_count,
                    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
                FROM pg_stat_user_tables 
                WHERE schemaname = 'public'
                AND n_live_tup > 1000
                AND tablename NOT IN (
                    SELECT DISTINCT tablename FROM pg_indexes 
                    WHERE tablename IN (
                        SELECT tablename FROM pg_stat_user_tables 
                        WHERE schemaname = 'public' AND n_live_tup > 1000
                    )
                );
            """)
            
            large_tables = cursor.fetchall()
            
            self.stdout.write('\n🎯 Optimization Recommendations:')
            self.stdout.write('-' * 50)
            
            if missing_fk_indexes:
                self.stdout.write('\n🔗 Missing Foreign Key Indexes:')
                for table, column, constraint in missing_fk_indexes:
                    self.stdout.write(f'  • {table}.{column} (constraint: {constraint})')
            
            if missing_pk_indexes:
                self.stdout.write('\n🔑 Tables without Primary Key Indexes:')
                for table, size in missing_pk_indexes:
                    self.stdout.write(f'  • {table} ({size})')
            
            if large_tables:
                self.stdout.write('\n📊 Large Tables without Indexes:')
                for table, rows, size in large_tables:
                    self.stdout.write(f'  • {table}: {rows:,} rows ({size})')
            
            if not any([missing_fk_indexes, missing_pk_indexes, large_tables]):
                self.stdout.write('✅ No immediate optimization recommendations found!')

    def analyze_slow_queries(self, verbose=False):
        """Analyze slow queries (if pg_stat_statements is available)"""
        self.stdout.write('🐌 Analyzing slow queries...')
        
        with connection.cursor() as cursor:
            # Check if pg_stat_statements is available
            cursor.execute("""
                SELECT EXISTS(
                    SELECT 1 FROM pg_extension 
                    WHERE extname = 'pg_stat_statements'
                );
            """)
            
            has_pg_stat_statements = cursor.fetchone()[0]
            
            if not has_pg_stat_statements:
                self.stdout.write(self.style.WARNING('⚠️  pg_stat_statements extension not available'))
                self.stdout.write('To enable slow query analysis, run:')
                self.stdout.write('  CREATE EXTENSION IF NOT EXISTS pg_stat_statements;')
                return
            
            # Get slow queries
            cursor.execute("""
                SELECT 
                    query,
                    calls,
                    total_time,
                    mean_time,
                    rows
                FROM pg_stat_statements 
                WHERE mean_time > 100  -- queries taking more than 100ms on average
                ORDER BY mean_time DESC
                LIMIT 10;
            """)
            
            slow_queries = cursor.fetchall()
            
            if slow_queries:
                self.stdout.write('\n🐌 Slow Queries:')
                self.stdout.write('-' * 80)
                for query, calls, total_time, mean_time, rows in slow_queries:
                    self.stdout.write(f'Query: {query[:100]}...')
                    self.stdout.write(f'  Calls: {calls}, Total: {total_time:.2f}ms, Mean: {mean_time:.2f}ms, Rows: {rows}')
                    self.stdout.write()
            else:
                self.stdout.write('✅ No slow queries found!')

    def get_database_size(self):
        """Get current database size"""
        with connection.cursor() as cursor:
            cursor.execute("SELECT pg_size_pretty(pg_database_size(current_database()));")
            return cursor.fetchone()[0]

    def get_table_count(self):
        """Get total number of tables"""
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT COUNT(*) FROM pg_tables 
                WHERE schemaname = 'public';
            """)
            return cursor.fetchone()[0]

    def get_index_count(self):
        """Get total number of indexes"""
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT COUNT(*) FROM pg_indexes 
                WHERE schemaname = 'public';
            """)
            return cursor.fetchone()[0]
