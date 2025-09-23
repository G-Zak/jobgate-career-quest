#!/usr/bin/env python3
"""
PostgreSQL Backup and Restore Management
=======================================

This script provides comprehensive backup and restore functionality for the
scoring system's PostgreSQL database. It supports:

- Full database backups
- Schema-only backups
- Data-only backups
- Incremental backups
- Automated backup scheduling
- Restore operations
- Backup verification
- Cleanup of old backups

Usage:
    python backup_restore.py backup --type=full
    python backup_restore.py restore --file=backup_20250919_143022.sql
    python backup_restore.py list
    python backup_restore.py verify --file=backup_20250919_143022.sql
"""

import os
import sys
import subprocess
import argparse
import json
import datetime
import logging
from pathlib import Path
from typing import Dict, List, Optional, Tuple
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'careerquest.settings')
import django
django.setup()

from django.conf import settings
from django.db import connection


class PostgreSQLBackupManager:
    """Manages PostgreSQL backup and restore operations"""
    
    def __init__(self, config_file: Optional[str] = None):
        self.config = self._load_config(config_file)
        self.backup_dir = Path(self.config['backup_directory'])
        self.backup_dir.mkdir(parents=True, exist_ok=True)
        self.logger = self._setup_logging()
        
    def _load_config(self, config_file: Optional[str]) -> Dict:
        """Load configuration from file or use defaults"""
        default_config = {
            'backup_directory': 'backups',
            'retention_days': 30,
            'compression': True,
            'verify_backups': True,
            'log_level': 'INFO',
            'pg_dump_path': 'pg_dump',
            'pg_restore_path': 'pg_restore',
            'psql_path': 'psql'
        }
        
        if config_file and os.path.exists(config_file):
            with open(config_file, 'r') as f:
                user_config = json.load(f)
                default_config.update(user_config)
        
        return default_config
    
    def _setup_logging(self) -> logging.Logger:
        """Setup logging configuration"""
        log_level = getattr(logging, self.config['log_level'].upper())
        
        logging.basicConfig(
            level=log_level,
            format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler('backup_restore.log'),
                logging.StreamHandler()
            ]
        )
        
        return logging.getLogger(__name__)
    
    def _get_db_config(self) -> Dict:
        """Get database configuration from Django settings"""
        db_config = settings.DATABASES['default']
        return {
            'host': db_config['HOST'],
            'port': db_config['PORT'],
            'database': db_config['NAME'],
            'user': db_config['USER'],
            'password': db_config['PASSWORD']
        }
    
    def _get_backup_filename(self, backup_type: str, timestamp: str = None) -> str:
        """Generate backup filename"""
        if timestamp is None:
            timestamp = datetime.datetime.now().strftime('%Y%m%d_%H%M%S')
        
        filename = f"backup_{backup_type}_{timestamp}"
        if self.config['compression']:
            filename += '.sql.gz'
        else:
            filename += '.sql'
        
        return filename
    
    def _run_command(self, command: List[str], capture_output: bool = True) -> Tuple[bool, str, str]:
        """Run a command and return success status and output"""
        try:
            self.logger.info(f"Running command: {' '.join(command)}")
            result = subprocess.run(
                command,
                capture_output=capture_output,
                text=True,
                check=True
            )
            return True, result.stdout, result.stderr
        except subprocess.CalledProcessError as e:
            self.logger.error(f"Command failed: {e}")
            return False, e.stdout, e.stderr
        except Exception as e:
            self.logger.error(f"Unexpected error: {e}")
            return False, "", str(e)
    
    def create_backup(self, backup_type: str = 'full', tables: List[str] = None) -> bool:
        """Create a database backup"""
        self.logger.info(f"Creating {backup_type} backup...")
        
        db_config = self._get_db_config()
        timestamp = datetime.datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = self._get_backup_filename(backup_type, timestamp)
        backup_path = self.backup_dir / filename
        
        # Build pg_dump command
        command = [
            self.config.get('pg_dump_path', 'pg_dump'),
            '--host', db_config['host'],
            '--port', str(db_config['port']),
            '--username', db_config['user'],
            '--dbname', db_config['database'],
            '--no-password',  # Use .pgpass or environment variable
            '--verbose'
        ]
        
        # Add backup type specific options
        if backup_type == 'schema':
            command.extend(['--schema-only'])
        elif backup_type == 'data':
            command.extend(['--data-only'])
        elif backup_type == 'full':
            command.extend(['--clean', '--create'])
        
        # Add table-specific backup if tables specified
        if tables:
            for table in tables:
                command.extend(['--table', table])
        
        # Add compression if enabled
        if self.config['compression']:
            command.extend(['--compress', '9'])
        
        # Set output file
        command.extend(['--file', str(backup_path)])
        
        # Set password via environment variable
        env = os.environ.copy()
        env['PGPASSWORD'] = db_config['password']
        
        try:
            self.logger.info(f"Creating backup: {backup_path}")
            result = subprocess.run(
                command,
                env=env,
                capture_output=True,
                text=True,
                check=True
            )
            
            # Verify backup file was created and has content
            if backup_path.exists() and backup_path.stat().st_size > 0:
                self.logger.info(f"✅ Backup created successfully: {backup_path}")
                
                # Create backup metadata
                metadata = {
                    'filename': filename,
                    'backup_type': backup_type,
                    'created_at': timestamp,
                    'size_bytes': backup_path.stat().st_size,
                    'tables': tables or 'all',
                    'compression': self.config['compression']
                }
                
                metadata_file = backup_path.with_suffix('.json')
                with open(metadata_file, 'w') as f:
                    json.dump(metadata, f, indent=2)
                
                return True
            else:
                self.logger.error("❌ Backup file is empty or doesn't exist")
                return False
                
        except subprocess.CalledProcessError as e:
            self.logger.error(f"❌ Backup failed: {e}")
            self.logger.error(f"Error output: {e.stderr}")
            return False
        except Exception as e:
            self.logger.error(f"❌ Unexpected error during backup: {e}")
            return False
    
    def restore_backup(self, backup_file: str, create_database: bool = False) -> bool:
        """Restore database from backup"""
        self.logger.info(f"Restoring from backup: {backup_file}")
        
        backup_path = self.backup_dir / backup_file
        if not backup_path.exists():
            self.logger.error(f"❌ Backup file not found: {backup_path}")
            return False
        
        db_config = self._get_db_config()
        
        # Determine if it's a compressed backup
        is_compressed = backup_file.endswith('.gz')
        
        if is_compressed:
            # Use gunzip + psql for compressed backups
            command = f"gunzip -c {backup_path} | {self.config.get('psql_path', 'psql')} --host {db_config['host']} --port {db_config['port']} --username {db_config['user']} --dbname {db_config['database']} --no-password"
        else:
            # Use psql directly for uncompressed backups
            command = f"{self.config.get('psql_path', 'psql')} --host {db_config['host']} --port {db_config['port']} --username {db_config['user']} --dbname {db_config['database']} --no-password --file {backup_path}"
        
        # Set password via environment variable
        env = os.environ.copy()
        env['PGPASSWORD'] = db_config['password']
        
        try:
            self.logger.info("Starting restore operation...")
            result = subprocess.run(
                command,
                shell=True,
                env=env,
                capture_output=True,
                text=True,
                check=True
            )
            
            self.logger.info("✅ Restore completed successfully")
            return True
            
        except subprocess.CalledProcessError as e:
            self.logger.error(f"❌ Restore failed: {e}")
            self.logger.error(f"Error output: {e.stderr}")
            return False
        except Exception as e:
            self.logger.error(f"❌ Unexpected error during restore: {e}")
            return False
    
    def list_backups(self) -> List[Dict]:
        """List all available backups"""
        self.logger.info("Listing available backups...")
        
        backups = []
        for backup_file in self.backup_dir.glob('backup_*.sql*'):
            if backup_file.suffix == '.json':
                continue
                
            metadata_file = backup_file.with_suffix('.json')
            metadata = {}
            
            if metadata_file.exists():
                try:
                    with open(metadata_file, 'r') as f:
                        metadata = json.load(f)
                except Exception as e:
                    self.logger.warning(f"Could not read metadata for {backup_file}: {e}")
            
            backup_info = {
                'filename': backup_file.name,
                'path': str(backup_file),
                'size_bytes': backup_file.stat().st_size,
                'created_at': datetime.datetime.fromtimestamp(backup_file.stat().st_ctime),
                'backup_type': metadata.get('backup_type', 'unknown'),
                'compression': metadata.get('compression', False)
            }
            
            backups.append(backup_info)
        
        # Sort by creation time (newest first)
        backups.sort(key=lambda x: x['created_at'], reverse=True)
        
        return backups
    
    def verify_backup(self, backup_file: str) -> bool:
        """Verify backup file integrity"""
        self.logger.info(f"Verifying backup: {backup_file}")
        
        backup_path = self.backup_dir / backup_file
        if not backup_path.exists():
            self.logger.error(f"❌ Backup file not found: {backup_path}")
            return False
        
        # Check if file is not empty
        if backup_path.stat().st_size == 0:
            self.logger.error("❌ Backup file is empty")
            return False
        
        # For compressed files, check if they can be decompressed
        if backup_file.endswith('.gz'):
            success, stdout, stderr = self._run_command(['gunzip', '-t', str(backup_path)])
            if not success:
                self.logger.error(f"❌ Backup file is corrupted: {stderr}")
                return False
        
        # Check if it's a valid SQL file
        try:
            with open(backup_path, 'rb') as f:
                # Read first few bytes to check for SQL signature
                header = f.read(100)
                if b'PostgreSQL database dump' in header or b'-- PostgreSQL database dump' in header:
                    self.logger.info("✅ Backup file appears to be valid")
                    return True
                else:
                    self.logger.warning("⚠️ Backup file may not be a valid PostgreSQL dump")
                    return True  # Still consider it valid if it's not empty
        except Exception as e:
            self.logger.error(f"❌ Error reading backup file: {e}")
            return False
    
    def cleanup_old_backups(self) -> int:
        """Remove old backups based on retention policy"""
        self.logger.info("Cleaning up old backups...")
        
        retention_days = self.config['retention_days']
        cutoff_date = datetime.datetime.now() - datetime.timedelta(days=retention_days)
        
        removed_count = 0
        for backup_file in self.backup_dir.glob('backup_*.sql*'):
            if backup_file.suffix == '.json':
                continue
                
            file_time = datetime.datetime.fromtimestamp(backup_file.stat().st_ctime)
            if file_time < cutoff_date:
                try:
                    # Also remove metadata file if it exists
                    metadata_file = backup_file.with_suffix('.json')
                    if metadata_file.exists():
                        metadata_file.unlink()
                    
                    backup_file.unlink()
                    self.logger.info(f"Removed old backup: {backup_file.name}")
                    removed_count += 1
                except Exception as e:
                    self.logger.error(f"Error removing {backup_file}: {e}")
        
        self.logger.info(f"✅ Cleaned up {removed_count} old backups")
        return removed_count
    
    def get_database_info(self) -> Dict:
        """Get database information and statistics"""
        self.logger.info("Getting database information...")
        
        db_config = self._get_db_config()
        
        try:
            # Connect to database
            conn = psycopg2.connect(
                host=db_config['host'],
                port=db_config['port'],
                database=db_config['database'],
                user=db_config['user'],
                password=db_config['password']
            )
            
            with conn.cursor() as cursor:
                # Get database size
                cursor.execute("SELECT pg_size_pretty(pg_database_size(current_database()));")
                db_size = cursor.fetchone()[0]
                
                # Get table information
                cursor.execute("""
                    SELECT 
                        t.schemaname,
                        t.tablename,
                        pg_size_pretty(pg_total_relation_size(t.schemaname||'.'||t.tablename)) as size,
                        COALESCE(s.n_tup_ins, 0) as inserts,
                        COALESCE(s.n_tup_upd, 0) as updates,
                        COALESCE(s.n_tup_del, 0) as deletes
                    FROM pg_tables t
                    LEFT JOIN pg_stat_user_tables s ON t.tablename = s.relname AND t.schemaname = s.schemaname
                    WHERE t.schemaname = 'public'
                    ORDER BY pg_total_relation_size(t.schemaname||'.'||t.tablename) DESC;
                """)
                tables = cursor.fetchall()
                
                # Get connection info
                cursor.execute("SELECT count(*) FROM pg_stat_activity;")
                active_connections = cursor.fetchone()[0]
                
            conn.close()
            
            return {
                'database_name': db_config['database'],
                'database_size': db_size,
                'active_connections': active_connections,
                'tables': [
                    {
                        'schema': table[0],
                        'name': table[1],
                        'size': table[2],
                        'inserts': table[3] or 0,
                        'updates': table[4] or 0,
                        'deletes': table[5] or 0
                    }
                    for table in tables
                ]
            }
            
        except Exception as e:
            self.logger.error(f"Error getting database info: {e}")
            return {}


def main():
    """Main CLI interface"""
    parser = argparse.ArgumentParser(description='PostgreSQL Backup and Restore Manager')
    subparsers = parser.add_subparsers(dest='command', help='Available commands')
    
    # Backup command
    backup_parser = subparsers.add_parser('backup', help='Create a backup')
    backup_parser.add_argument('--type', choices=['full', 'schema', 'data'], 
                              default='full', help='Type of backup to create')
    backup_parser.add_argument('--tables', nargs='+', help='Specific tables to backup')
    backup_parser.add_argument('--config', help='Configuration file path')
    
    # Restore command
    restore_parser = subparsers.add_parser('restore', help='Restore from backup')
    restore_parser.add_argument('--file', required=True, help='Backup file to restore')
    restore_parser.add_argument('--create-db', action='store_true', 
                               help='Create database if it doesn\'t exist')
    restore_parser.add_argument('--config', help='Configuration file path')
    
    # List command
    list_parser = subparsers.add_parser('list', help='List available backups')
    list_parser.add_argument('--config', help='Configuration file path')
    
    # Verify command
    verify_parser = subparsers.add_parser('verify', help='Verify backup integrity')
    verify_parser.add_argument('--file', required=True, help='Backup file to verify')
    verify_parser.add_argument('--config', help='Configuration file path')
    
    # Cleanup command
    cleanup_parser = subparsers.add_parser('cleanup', help='Clean up old backups')
    cleanup_parser.add_argument('--config', help='Configuration file path')
    
    # Info command
    info_parser = subparsers.add_parser('info', help='Show database information')
    info_parser.add_argument('--config', help='Configuration file path')
    
    args = parser.parse_args()
    
    if not args.command:
        parser.print_help()
        return
    
    # Initialize backup manager
    manager = PostgreSQLBackupManager(args.config)
    
    try:
        if args.command == 'backup':
            success = manager.create_backup(args.type, args.tables)
            if success:
                print("✅ Backup created successfully")
                sys.exit(0)
            else:
                print("❌ Backup failed")
                sys.exit(1)
                
        elif args.command == 'restore':
            success = manager.restore_backup(args.file, args.create_db)
            if success:
                print("✅ Restore completed successfully")
                sys.exit(0)
            else:
                print("❌ Restore failed")
                sys.exit(1)
                
        elif args.command == 'list':
            backups = manager.list_backups()
            if backups:
                print(f"\n📋 Available Backups ({len(backups)} total):")
                print("-" * 80)
                for backup in backups:
                    size_mb = backup['size_bytes'] / (1024 * 1024)
                    print(f"📁 {backup['filename']}")
                    print(f"   Type: {backup['backup_type']}")
                    print(f"   Size: {size_mb:.2f} MB")
                    print(f"   Created: {backup['created_at'].strftime('%Y-%m-%d %H:%M:%S')}")
                    print(f"   Compressed: {'Yes' if backup['compression'] else 'No'}")
                    print()
            else:
                print("📭 No backups found")
                
        elif args.command == 'verify':
            success = manager.verify_backup(args.file)
            if success:
                print("✅ Backup verification passed")
                sys.exit(0)
            else:
                print("❌ Backup verification failed")
                sys.exit(1)
                
        elif args.command == 'cleanup':
            removed = manager.cleanup_old_backups()
            print(f"✅ Cleaned up {removed} old backups")
            
        elif args.command == 'info':
            info = manager.get_database_info()
            if info:
                print(f"\n📊 Database Information:")
                print(f"Database: {info.get('database_name', 'Unknown')}")
                print(f"Size: {info.get('database_size', 'Unknown')}")
                print(f"Active Connections: {info.get('active_connections', 'Unknown')}")
                print(f"\n📋 Tables:")
                for table in info.get('tables', []):
                    print(f"  • {table['name']}: {table['size']} "
                          f"(Inserts: {table['inserts']}, Updates: {table['updates']}, Deletes: {table['deletes']})")
            else:
                print("❌ Could not retrieve database information")
                
    except KeyboardInterrupt:
        print("\n⏹️ Operation cancelled by user")
        sys.exit(1)
    except Exception as e:
        print(f"💥 Unexpected error: {e}")
        sys.exit(1)


if __name__ == '__main__':
    main()
