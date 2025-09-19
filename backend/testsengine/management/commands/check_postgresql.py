"""
Django management command to verify PostgreSQL setup for scoring system
"""
from django.core.management.base import BaseCommand
from django.db import connection
from django.conf import settings
from careerquest.database_config import get_db_pool_status
import json

class Command(BaseCommand):
    help = 'Check PostgreSQL configuration and connection for scoring system'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('🔍 PostgreSQL Configuration Check'))
        self.stdout.write('=' * 50)
        
        # Database engine check
        engine = connection.settings_dict['ENGINE']
        if 'postgresql' in engine:
            self.stdout.write(self.style.SUCCESS(f'✅ Database Engine: {engine}'))
        else:
            self.stdout.write(self.style.ERROR(f'❌ Database Engine: {engine} (Expected PostgreSQL)'))
            return
        
        # Connection details
        self.stdout.write(f'📊 Database Name: {connection.settings_dict["NAME"]}')
        self.stdout.write(f'👤 Database User: {connection.settings_dict["USER"]}')
        self.stdout.write(f'🏠 Database Host: {connection.settings_dict["HOST"]}')
        self.stdout.write(f'🔌 Database Port: {connection.settings_dict["PORT"]}')
        
        # Connection pooling
        self.stdout.write(f'🔄 Connection Max Age: {connection.settings_dict.get("CONN_MAX_AGE", "Not set")} seconds')
        self.stdout.write(f'💓 Health Checks: {connection.settings_dict.get("CONN_HEALTH_CHECKS", "Not set")}')
        
        # Django settings
        self.stdout.write(f'⚛️  Atomic Requests: {settings.DATABASE_ATOMIC_REQUESTS}')
        
        # Test connection
        try:
            with connection.cursor() as cursor:
                cursor.execute('SELECT version();')
                version = cursor.fetchone()[0]
                self.stdout.write(self.style.SUCCESS(f'✅ Connection Test: SUCCESS'))
                self.stdout.write(f'🐘 PostgreSQL Version: {version}')
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'❌ Connection Test: FAILED - {e}'))
            return
        
        # Connection pool status
        try:
            pool_status = get_db_pool_status()
            self.stdout.write('\n📊 Connection Pool Status:')
            for key, value in pool_status.items():
                self.stdout.write(f'   {key}: {value}')
        except Exception as e:
            self.stdout.write(self.style.WARNING(f'⚠️  Pool Status: Could not retrieve - {e}'))
        
        # Check scoring-related tables
        self.stdout.write('\n🗄️  Scoring System Tables:')
        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT table_name 
                    FROM information_schema.tables 
                    WHERE table_schema = 'public' 
                    AND table_name LIKE 'testsengine_%' 
                    ORDER BY table_name;
                """)
                tables = cursor.fetchall()
                
                scoring_tables = ['testsengine_test', 'testsengine_question', 
                                'testsengine_testsubmission', 'testsengine_score', 'testsengine_answer']
                
                for table_name, in tables:
                    if table_name in scoring_tables:
                        self.stdout.write(self.style.SUCCESS(f'   ✅ {table_name}'))
                    else:
                        self.stdout.write(f'   📋 {table_name}')
                        
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'❌ Table Check: FAILED - {e}'))
        
        self.stdout.write('\n' + '=' * 50)
        self.stdout.write(self.style.SUCCESS('🎉 PostgreSQL setup verification complete!'))
        
        # Recommendations
        self.stdout.write('\n💡 Next Steps:')
        self.stdout.write('   1. Add missing scoring models to models.py')
        self.stdout.write('   2. Create scoring service')
        self.stdout.write('   3. Implement scoring APIs')
        self.stdout.write('   4. Import test data to PostgreSQL')
