"""
Django Management Command for Database Backup
============================================

This command provides easy access to backup and restore operations
from within Django's management command system.

Usage:
    python manage.py backup_database --type=full
    python manage.py backup_database --restore --file=backup_20250919_143022.sql
    python manage.py backup_database --list
    python manage.py backup_database --verify --file=backup_20250919_143022.sql
    python manage.py backup_database --cleanup
    python manage.py backup_database --info
"""

from django.core.management.base import BaseCommand, CommandError
from django.conf import settings
import os
import sys
import json
from pathlib import Path

# Add the backend directory to Python path to import backup_restore
backend_dir = Path(__file__).parent.parent.parent.parent
sys.path.insert(0, str(backend_dir))

from backup_restore import PostgreSQLBackupManager


class Command(BaseCommand):
    help = 'Manage PostgreSQL database backups and restores'

    def add_arguments(self, parser):
        # Backup options
        parser.add_argument(
            '--type',
            choices=['full', 'schema', 'data'],
            default='full',
            help='Type of backup to create (default: full)'
        )
        parser.add_argument(
            '--tables',
            nargs='+',
            help='Specific tables to backup (space-separated)'
        )
        
        # Restore options
        parser.add_argument(
            '--restore',
            action='store_true',
            help='Restore from backup instead of creating backup'
        )
        parser.add_argument(
            '--file',
            help='Backup file to restore or verify'
        )
        parser.add_argument(
            '--create-db',
            action='store_true',
            help='Create database if it doesn\'t exist during restore'
        )
        
        # Other operations
        parser.add_argument(
            '--list',
            action='store_true',
            help='List available backups'
        )
        parser.add_argument(
            '--verify',
            action='store_true',
            help='Verify backup file integrity'
        )
        parser.add_argument(
            '--cleanup',
            action='store_true',
            help='Clean up old backups'
        )
        parser.add_argument(
            '--info',
            action='store_true',
            help='Show database information'
        )
        
        # Configuration
        parser.add_argument(
            '--config',
            help='Path to configuration file'
        )
        parser.add_argument(
            '--verbose',
            action='store_true',
            help='Enable verbose output'
        )

    def handle(self, *args, **options):
        """Handle the command execution"""
        
        # Determine operation
        if options['restore']:
            operation = 'restore'
        elif options['list']:
            operation = 'list'
        elif options['verify']:
            operation = 'verify'
        elif options['cleanup']:
            operation = 'cleanup'
        elif options['info']:
            operation = 'info'
        else:
            operation = 'backup'
        
        # Validate required options
        if operation in ['restore', 'verify'] and not options['file']:
            raise CommandError(f"Operation '{operation}' requires --file option")
        
        if operation == 'backup' and not options['file']:
            # Generate default filename for backup
            from datetime import datetime
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            options['file'] = f"backup_{options['type']}_{timestamp}.sql"
        
        # Initialize backup manager
        try:
            manager = PostgreSQLBackupManager(options['config'])
        except Exception as e:
            raise CommandError(f"Failed to initialize backup manager: {e}")
        
        # Execute operation
        try:
            if operation == 'backup':
                self.handle_backup(manager, options)
            elif operation == 'restore':
                self.handle_restore(manager, options)
            elif operation == 'list':
                self.handle_list(manager, options)
            elif operation == 'verify':
                self.handle_verify(manager, options)
            elif operation == 'cleanup':
                self.handle_cleanup(manager, options)
            elif operation == 'info':
                self.handle_info(manager, options)
                
        except Exception as e:
            raise CommandError(f"Operation failed: {e}")

    def handle_backup(self, manager, options):
        """Handle backup operation"""
        self.stdout.write(
            self.style.SUCCESS(f"🔄 Creating {options['type']} backup...")
        )
        
        success = manager.create_backup(
            backup_type=options['type'],
            tables=options['tables']
        )
        
        if success:
            self.stdout.write(
                self.style.SUCCESS("✅ Backup created successfully!")
            )
        else:
            self.stdout.write(
                self.style.ERROR("❌ Backup failed!")
            )
            raise CommandError("Backup operation failed")

    def handle_restore(self, manager, options):
        """Handle restore operation"""
        self.stdout.write(
            self.style.WARNING(f"🔄 Restoring from backup: {options['file']}")
        )
        
        # Confirm restore operation
        if not options.get('verbosity', 1) == 0:  # Skip confirmation in non-verbose mode
            confirm = input("This will overwrite the current database. Continue? (y/N): ")
            if confirm.lower() != 'y':
                self.stdout.write("Restore cancelled.")
                return
        
        success = manager.restore_backup(
            backup_file=options['file'],
            create_database=options['create_db']
        )
        
        if success:
            self.stdout.write(
                self.style.SUCCESS("✅ Restore completed successfully!")
            )
        else:
            self.stdout.write(
                self.style.ERROR("❌ Restore failed!")
            )
            raise CommandError("Restore operation failed")

    def handle_list(self, manager, options):
        """Handle list operation"""
        self.stdout.write("📋 Available Backups:")
        self.stdout.write("-" * 60)
        
        backups = manager.list_backups()
        
        if not backups:
            self.stdout.write("📭 No backups found")
            return
        
        for backup in backups:
            size_mb = backup['size_bytes'] / (1024 * 1024)
            self.stdout.write(f"📁 {backup['filename']}")
            self.stdout.write(f"   Type: {backup['backup_type']}")
            self.stdout.write(f"   Size: {size_mb:.2f} MB")
            self.stdout.write(f"   Created: {backup['created_at'].strftime('%Y-%m-%d %H:%M:%S')}")
            self.stdout.write(f"   Compressed: {'Yes' if backup['compression'] else 'No'}")
            self.stdout.write()

    def handle_verify(self, manager, options):
        """Handle verify operation"""
        self.stdout.write(f"🔍 Verifying backup: {options['file']}")
        
        success = manager.verify_backup(options['file'])
        
        if success:
            self.stdout.write(
                self.style.SUCCESS("✅ Backup verification passed!")
            )
        else:
            self.stdout.write(
                self.style.ERROR("❌ Backup verification failed!")
            )
            raise CommandError("Backup verification failed")

    def handle_cleanup(self, manager, options):
        """Handle cleanup operation"""
        self.stdout.write("🧹 Cleaning up old backups...")
        
        removed_count = manager.cleanup_old_backups()
        
        self.stdout.write(
            self.style.SUCCESS(f"✅ Cleaned up {removed_count} old backups")
        )

    def handle_info(self, manager, options):
        """Handle info operation"""
        self.stdout.write("📊 Database Information:")
        self.stdout.write("-" * 40)
        
        info = manager.get_database_info()
        
        if not info:
            self.stdout.write(
                self.style.ERROR("❌ Could not retrieve database information")
            )
            return
        
        self.stdout.write(f"Database: {info.get('database_name', 'Unknown')}")
        self.stdout.write(f"Size: {info.get('database_size', 'Unknown')}")
        self.stdout.write(f"Active Connections: {info.get('active_connections', 'Unknown')}")
        
        self.stdout.write("\n📋 Tables:")
        for table in info.get('tables', []):
            self.stdout.write(
                f"  • {table['name']}: {table['size']} "
                f"(Inserts: {table['inserts']}, Updates: {table['updates']}, Deletes: {table['deletes']})"
            )
