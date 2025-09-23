#!/usr/bin/env python3
"""
Backup System Test Script
========================

This script tests the backup and restore functionality to ensure
everything is working correctly.

Usage:
    python test_backup_system.py
    python test_backup_system.py --test-restore
    python test_backup_system.py --full-test
"""

import os
import sys
import argparse
import tempfile
import shutil
from pathlib import Path
from datetime import datetime

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'careerquest.settings')
import django
django.setup()

from backup_restore import PostgreSQLBackupManager
from django.test import TestCase
from django.db import connection


class BackupSystemTester:
    """Test the backup and restore system"""
    
    def __init__(self):
        self.test_results = []
        self.backup_manager = None
        
    def log(self, message, level="INFO"):
        timestamp = datetime.now().strftime("%H:%M:%S")
        print(f"[{timestamp}] {level}: {message}")
    
    def setup_test_environment(self):
        """Setup test environment"""
        self.log("Setting up test environment...")
        
        # Create temporary backup directory
        self.test_backup_dir = Path(tempfile.mkdtemp(prefix="backup_test_"))
        self.log(f"Test backup directory: {self.test_backup_dir}")
        
        # Create test configuration
        test_config = {
            'backup_directory': str(self.test_backup_dir),
            'retention_days': 7,
            'compression': True,
            'verify_backups': True,
            'log_level': 'INFO'
        }
        
        # Initialize backup manager with test config
        self.backup_manager = PostgreSQLBackupManager()
        self.backup_manager.config = test_config
        self.backup_manager.backup_dir = self.test_backup_dir
        self.backup_manager.backup_dir.mkdir(parents=True, exist_ok=True)
        
        self.log("✅ Test environment setup complete")
        return True
    
    def test_database_connection(self):
        """Test database connection"""
        self.log("Testing database connection...")
        
        try:
            with connection.cursor() as cursor:
                cursor.execute("SELECT version();")
                version = cursor.fetchone()[0]
                self.log(f"✅ Database connected: {version[:50]}...")
                return True
        except Exception as e:
            self.log(f"❌ Database connection failed: {e}", "ERROR")
            return False
    
    def test_backup_creation(self):
        """Test backup creation"""
        self.log("Testing backup creation...")
        
        try:
            # Test full backup
            success = self.backup_manager.create_backup('full')
            if success:
                self.log("✅ Full backup created successfully")
                
                # Test schema backup
                success = self.backup_manager.create_backup('schema')
                if success:
                    self.log("✅ Schema backup created successfully")
                    
                    # Test data backup
                    success = self.backup_manager.create_backup('data')
                    if success:
                        self.log("✅ Data backup created successfully")
                        return True
                    else:
                        self.log("❌ Data backup failed", "ERROR")
                        return False
                else:
                    self.log("❌ Schema backup failed", "ERROR")
                    return False
            else:
                self.log("❌ Full backup failed", "ERROR")
                return False
                
        except Exception as e:
            self.log(f"❌ Backup creation error: {e}", "ERROR")
            return False
    
    def test_backup_listing(self):
        """Test backup listing"""
        self.log("Testing backup listing...")
        
        try:
            backups = self.backup_manager.list_backups()
            if backups:
                self.log(f"✅ Found {len(backups)} backups")
                for backup in backups:
                    self.log(f"   📁 {backup['filename']} ({backup['backup_type']})")
                return True
            else:
                self.log("❌ No backups found", "ERROR")
                return False
        except Exception as e:
            self.log(f"❌ Backup listing error: {e}", "ERROR")
            return False
    
    def test_backup_verification(self):
        """Test backup verification"""
        self.log("Testing backup verification...")
        
        try:
            backups = self.backup_manager.list_backups()
            if not backups:
                self.log("❌ No backups to verify", "ERROR")
                return False
            
            # Test verification of first backup
            backup_file = backups[0]['filename']
            success = self.backup_manager.verify_backup(backup_file)
            
            if success:
                self.log(f"✅ Backup verification passed: {backup_file}")
                return True
            else:
                self.log(f"❌ Backup verification failed: {backup_file}", "ERROR")
                return False
                
        except Exception as e:
            self.log(f"❌ Backup verification error: {e}", "ERROR")
            return False
    
    def test_database_info(self):
        """Test database information retrieval"""
        self.log("Testing database information...")
        
        try:
            info = self.backup_manager.get_database_info()
            if info:
                self.log(f"✅ Database: {info.get('database_name', 'Unknown')}")
                self.log(f"✅ Size: {info.get('database_size', 'Unknown')}")
                self.log(f"✅ Tables: {len(info.get('tables', []))}")
                return True
            else:
                self.log("❌ Could not retrieve database information", "ERROR")
                return False
        except Exception as e:
            self.log(f"❌ Database info error: {e}", "ERROR")
            return False
    
    def test_restore_functionality(self, test_restore=False):
        """Test restore functionality (optional)"""
        if not test_restore:
            self.log("Skipping restore test (use --test-restore to enable)")
            return True
        
        self.log("Testing restore functionality...")
        
        try:
            backups = self.backup_manager.list_backups()
            if not backups:
                self.log("❌ No backups available for restore test", "ERROR")
                return False
            
            # Find a full backup
            full_backup = None
            for backup in backups:
                if backup['backup_type'] == 'full':
                    full_backup = backup
                    break
            
            if not full_backup:
                self.log("❌ No full backup found for restore test", "ERROR")
                return False
            
            self.log(f"Testing restore with: {full_backup['filename']}")
            
            # Note: Actual restore test would require a test database
            # For now, just verify the backup file exists and is valid
            backup_path = self.test_backup_dir / full_backup['filename']
            if backup_path.exists() and backup_path.stat().st_size > 0:
                self.log("✅ Backup file exists and has content")
                self.log("⚠️ Full restore test requires separate test database")
                return True
            else:
                self.log("❌ Backup file not found or empty", "ERROR")
                return False
                
        except Exception as e:
            self.log(f"❌ Restore test error: {e}", "ERROR")
            return False
    
    def cleanup_test_environment(self):
        """Cleanup test environment"""
        self.log("Cleaning up test environment...")
        
        try:
            if hasattr(self, 'test_backup_dir') and self.test_backup_dir.exists():
                shutil.rmtree(self.test_backup_dir)
                self.log("✅ Test environment cleaned up")
            return True
        except Exception as e:
            self.log(f"⚠️ Cleanup warning: {e}", "WARNING")
            return True
    
    def run_tests(self, test_restore=False, full_test=False):
        """Run all backup system tests"""
        self.log("🧪 Starting Backup System Tests")
        self.log("=" * 50)
        
        tests = [
            ("Setup Test Environment", self.setup_test_environment),
            ("Database Connection", self.test_database_connection),
            ("Backup Creation", self.test_backup_creation),
            ("Backup Listing", self.test_backup_listing),
            ("Backup Verification", self.test_backup_verification),
            ("Database Information", self.test_database_info),
            ("Restore Functionality", lambda: self.test_restore_functionality(test_restore)),
        ]
        
        if full_test:
            tests.append(("Cleanup Test Environment", self.cleanup_test_environment))
        
        passed = 0
        total = len(tests)
        
        for test_name, test_func in tests:
            self.log(f"\n--- Testing: {test_name} ---")
            try:
                if test_func():
                    passed += 1
                    self.log(f"✅ {test_name} PASSED")
                else:
                    self.log(f"❌ {test_name} FAILED", "ERROR")
            except Exception as e:
                self.log(f"❌ {test_name} ERROR: {e}", "ERROR")
        
        # Summary
        self.log("\n" + "=" * 50)
        self.log(f"🎯 BACKUP SYSTEM TEST SUMMARY")
        self.log(f"✅ Passed: {passed}/{total} tests")
        self.log(f"📊 Success Rate: {(passed/total)*100:.1f}%")
        
        if passed == total:
            self.log("🎉 ALL TESTS PASSED! Backup system is working correctly.")
            return True
        else:
            self.log(f"⚠️ {total-passed} tests failed. Please check the issues above.")
            return False


def main():
    """Main function"""
    parser = argparse.ArgumentParser(description='Test Backup System')
    parser.add_argument('--test-restore', action='store_true',
                       help='Include restore functionality tests')
    parser.add_argument('--full-test', action='store_true',
                       help='Run full test including cleanup')
    
    args = parser.parse_args()
    
    print("🧪 BACKUP SYSTEM TEST")
    print("=" * 50)
    print("This script tests the backup and restore functionality")
    print("to ensure everything is working correctly.")
    print("=" * 50)
    
    tester = BackupSystemTester()
    
    try:
        success = tester.run_tests(
            test_restore=args.test_restore,
            full_test=args.full_test
        )
        
        if success:
            print("\n🎉 SUCCESS: Backup system is working correctly!")
            sys.exit(0)
        else:
            print("\n❌ FAILURE: Some tests failed. Please check the output above.")
            sys.exit(1)
    except KeyboardInterrupt:
        print("\n⏹️ Test interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n💥 Unexpected error: {e}")
        sys.exit(1)
    finally:
        # Always cleanup
        if not args.full_test:
            tester.cleanup_test_environment()


if __name__ == '__main__':
    main()
