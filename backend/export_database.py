#!/usr/bin/env python
"""
Database export script with proper encoding handling
"""
import os
import sys
import django
import json
from django.core.management import execute_from_command_line
from django.core import serializers
from django.db import connection
from django.conf import settings

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'careerquest.settings')
django.setup()

def export_database():
    """Export database with proper encoding"""
    try:
        print("🔄 Starting database export...")
        
        # Get all models
        from django.apps import apps
        models_to_export = []
        
        # Export each app separately to avoid encoding issues
        apps_to_export = ['skills', 'testsengine', 'recommendation', 'accounts', 'auth_api', 'badges']
        
        all_data = []
        
        for app_name in apps_to_export:
            try:
                app_config = apps.get_app_config(app_name)
                for model in app_config.get_models():
                    if not model._meta.abstract:
                        print(f"📦 Exporting {model._meta.label}...")
                        try:
                            data = serializers.serialize('json', model.objects.all(), ensure_ascii=False, indent=2)
                            parsed_data = json.loads(data)
                            all_data.extend(parsed_data)
                        except Exception as e:
                            print(f"⚠️  Warning: Could not export {model._meta.label}: {e}")
                            continue
            except Exception as e:
                print(f"⚠️  Warning: Could not export app {app_name}: {e}")
                continue
        
        # Save to file with UTF-8 encoding
        with open('complete_database_backup.json', 'w', encoding='utf-8') as f:
            json.dump(all_data, f, ensure_ascii=False, indent=2)
        
        print(f"✅ Database exported successfully to complete_database_backup.json")
        print(f"📊 Total records exported: {len(all_data)}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error exporting database: {e}")
        return False

if __name__ == '__main__':
    export_database()

