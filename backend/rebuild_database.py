#!/usr/bin/env python
"""
Complete database rebuild script
"""
import os
import sys
import django
from django.core.management import execute_from_command_line
from django.db import connection
from django.conf import settings

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'careerquest.settings')
django.setup()

def rebuild_database():
    """Completely rebuild the database"""
    try:
        print("🔄 Starting complete database rebuild...")
        
        # Drop and recreate database
        print("🗑️  Dropping existing database...")
        with connection.cursor() as cursor:
            cursor.execute("DROP SCHEMA public CASCADE;")
            cursor.execute("CREATE SCHEMA public;")
            cursor.execute("GRANT ALL ON SCHEMA public TO postgres;")
            cursor.execute("GRANT ALL ON SCHEMA public TO public;")
        
        print("✅ Database dropped and recreated")
        
        # Run migrations
        print("🔄 Running migrations...")
        os.system("python manage.py makemigrations")
        os.system("python manage.py migrate")
        
        # Create superuser
        print("👤 Creating superuser...")
        from django.contrib.auth.models import User
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
            print("✅ Superuser created: admin/admin123")
        else:
            print("ℹ️  Superuser already exists")
        
        # Load initial data
        print("📊 Loading initial data...")
        os.system("python manage.py loaddata complete_database_backup.json")
        
        print("✅ Database rebuild completed successfully!")
        return True
        
    except Exception as e:
        print(f"❌ Error rebuilding database: {e}")
        return False

if __name__ == '__main__':
    rebuild_database()

