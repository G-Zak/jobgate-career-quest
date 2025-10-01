from django.core.management.base import BaseCommand
from django.conf import settings
from django.db import connection
import json

class Command(BaseCommand):
 help = 'Database migration and monitoring utility'

 def add_arguments(self, parser):
 parser.add_argument(
 '--action',
 choices=['status', 'migrate', 'backup', 'pool-status'],
 default='status',
 help='Action to perform'
 )
 parser.add_argument(
 '--backup-file',
 type=str,
 default='database_backup.json',
 help='Backup file name'
 )

 def handle(self, *args, **options):
 action = options['action']

 if action == 'status':
 self.show_database_status()
 elif action == 'migrate':
 self.migrate_to_postgresql()
 elif action == 'backup':
 self.backup_database(options['backup_file'])
 elif action == 'pool-status':
 self.show_pool_status()

 def show_database_status(self):
 """Display current database configuration and status"""
 self.stdout.write(self.style.SUCCESS('=== DATABASE STATUS ==='))

 db_config = settings.DATABASES['default']
 engine = db_config['ENGINE']

 if 'postgresql' in engine:
 self.stdout.write(f"Engine: PostgreSQL")
 self.stdout.write(f"Host: {db_config.get('HOST', 'localhost')}")
 self.stdout.write(f"Port: {db_config.get('PORT', '5432')}")
 self.stdout.write(f"Database: {db_config.get('NAME')}")
 self.stdout.write(f"User: {db_config.get('USER')}")

 # Test connection
 try:
 with connection.cursor() as cursor:
 cursor.execute("SELECT version();")
 version = cursor.fetchone()[0]
 self.stdout.write(f"Version: {version}")

 cursor.execute("SELECT current_database();")
 current_db = cursor.fetchone()[0]
 self.stdout.write(f"Connected to: {current_db}")

 # Connection count
 cursor.execute("""
 SELECT count(*) FROM pg_stat_activity
 WHERE datname = current_database();
 """)
 connections = cursor.fetchone()[0]
 self.stdout.write(f"Active connections: {connections}")

 self.stdout.write(self.style.SUCCESS(" PostgreSQL connection successful"))

 except Exception as e:
 self.stdout.write(self.style.ERROR(f" Connection failed: {e}"))

 elif 'sqlite' in engine:
 self.stdout.write(f"Engine: SQLite")
 self.stdout.write(f"Database: {db_config.get('NAME')}")

 try:
 with connection.cursor() as cursor:
 cursor.execute("SELECT sqlite_version();")
 version = cursor.fetchone()[0]
 self.stdout.write(f"SQLite version: {version}")

 self.stdout.write(self.style.SUCCESS(" SQLite connection successful"))

 except Exception as e:
 self.stdout.write(self.style.ERROR(f" Connection failed: {e}"))

 def show_pool_status(self):
 """Show connection pool status for PostgreSQL"""
 db_config = settings.DATABASES['default']
 engine = db_config['ENGINE']

 if 'postgresql' not in engine:
 self.stdout.write(self.style.WARNING("Connection pooling only available for PostgreSQL"))
 return

 self.stdout.write(self.style.SUCCESS('=== CONNECTION POOL STATUS ==='))

 try:
 # Import pool status function
 from careerquest.database_config import get_db_pool_status
 status = get_db_pool_status()

 if 'error' in status:
 self.stdout.write(self.style.ERROR(f"Error: {status['error']}"))
 return

 self.stdout.write(f"Pool Size: Django's built-in connection pooling")
 self.stdout.write(f"CONN_MAX_AGE: {status.get('conn_max_age', 'N/A')} seconds")
 self.stdout.write(f"Health Checks: {status.get('health_checks', 'N/A')}")
 self.stdout.write(f"Total Connections: {status.get('total_connections', 0)}")
 self.stdout.write(f"Active Connections: {status.get('active_connections', 0)}")
 self.stdout.write(f"Idle Connections: {status.get('idle_connections', 0)}")

 # Connection efficiency
 total = status.get('total_connections', 0)
 active = status.get('active_connections', 0)
 if total > 0:
 efficiency = (active / total) * 100
 self.stdout.write(f"Connection Efficiency: {efficiency:.1f}%")

 if total > 15:
 self.stdout.write(self.style.WARNING("️ Many connections - monitor usage"))
 elif active == 0:
 self.stdout.write(self.style.SUCCESS(" No active connections - system idle"))
 else:
 self.stdout.write(self.style.SUCCESS(" Connection usage looks normal"))

 except Exception as e:
 self.stdout.write(self.style.ERROR(f"Failed to get pool status: {e}"))

 def backup_database(self, backup_file):
 """Backup current database data"""
 self.stdout.write(f"Backing up database to {backup_file}...")

 try:
 from django.core.management import call_command

 with open(backup_file, 'w') as f:
 call_command('dumpdata',
 stdout=f,
 natural_foreign=True,
 natural_primary=True,
 exclude=['contenttypes', 'auth.permission'])

 self.stdout.write(self.style.SUCCESS(f" Backup saved to {backup_file}"))

 except Exception as e:
 self.stdout.write(self.style.ERROR(f" Backup failed: {e}"))

 def migrate_to_postgresql(self):
 """Guide user through PostgreSQL migration"""
 self.stdout.write(self.style.SUCCESS('=== POSTGRESQL MIGRATION GUIDE ==='))

 steps = [
 "1. Install PostgreSQL: brew install postgresql@15",
 "2. Start service: brew services start postgresql@15",
 "3. Create database: createdb jobgate_career_quest",
 "4. Create user: createuser -P jobgate_user",
 "5. Update .env: USE_POSTGRESQL=True",
 "6. Install deps: pip install django-db-pool python-decouple",
 "7. Run migrations: python manage.py migrate",
 "8. Load data: python manage.py loaddata backup_file.json"
 ]

 for step in steps:
 self.stdout.write(f" {step}")

 self.stdout.write("\n" + self.style.WARNING("️ Remember to backup your data first!"))
 self.stdout.write("Run: python manage.py db_manager --action backup")

 # Check current status
 db_config = settings.DATABASES['default']
 if 'postgresql' in db_config['ENGINE']:
 self.stdout.write(self.style.SUCCESS("\n You're already using PostgreSQL!"))
 else:
 self.stdout.write(self.style.WARNING("\n Currently using SQLite - follow steps above to migrate"))
