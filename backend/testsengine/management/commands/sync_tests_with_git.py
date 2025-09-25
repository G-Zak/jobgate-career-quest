#!/usr/bin/env python3
"""
Command to sync test data with git for safe merging
This command should be run before and after git operations
"""

import os
import subprocess
from django.core.management.base import BaseCommand
from django.core.management import call_command

class Command(BaseCommand):
    help = 'Sync test data with git for safe merging'
    
    def add_arguments(self, parser):
        parser.add_argument(
            '--action',
            type=str,
            choices=['pre-merge', 'post-merge', 'pre-push', 'post-pull'],
            required=True,
            help='Git operation being performed'
        )
        parser.add_argument(
            '--backup-dir',
            type=str,
            default='backend/testsengine/fixtures',
            help='Directory for backup files'
        )
    
    def handle(self, *args, **options):
        action = options['action']
        backup_dir = options['backup_dir']
        
        self.stdout.write(f'🔄 Syncing test data for git operation: {action}')
        
        if action == 'pre-merge':
            self.pre_merge_sync(backup_dir)
        elif action == 'post-merge':
            self.post_merge_sync(backup_dir)
        elif action == 'pre-push':
            self.pre_push_sync(backup_dir)
        elif action == 'post-pull':
            self.post_pull_sync(backup_dir)
        
        self.stdout.write(
            self.style.SUCCESS(f'✅ Test data sync completed for {action}')
        )
    
    def pre_merge_sync(self, backup_dir):
        """Backup test data before merging"""
        self.stdout.write('📦 Backing up test data before merge...')
        
        # Create backup directory
        os.makedirs(backup_dir, exist_ok=True)
        
        # Backup all test data
        call_command('backup_tests', output_dir=backup_dir, include_questions=True)
        
        # Add backup files to git
        self.add_backup_to_git(backup_dir)
        
        self.stdout.write('✅ Pre-merge backup completed')
    
    def post_merge_sync(self, backup_dir):
        """Restore test data after merging"""
        self.stdout.write('🔄 Restoring test data after merge...')
        
        # Check if backup files exist
        if not os.path.exists(backup_dir):
            self.stdout.write('⚠️ No backup directory found, skipping restore')
            return
        
        # Restore test data
        call_command('restore_tests', input_dir=backup_dir, force=True)
        
        self.stdout.write('✅ Post-merge restore completed')
    
    def pre_push_sync(self, backup_dir):
        """Ensure test data is backed up before pushing"""
        self.stdout.write('📦 Ensuring test data is backed up before push...')
        
        # Create backup directory
        os.makedirs(backup_dir, exist_ok=True)
        
        # Backup all test data
        call_command('backup_tests', output_dir=backup_dir, include_questions=True)
        
        # Add backup files to git
        self.add_backup_to_git(backup_dir)
        
        self.stdout.write('✅ Pre-push backup completed')
    
    def post_pull_sync(self, backup_dir):
        """Restore test data after pulling"""
        self.stdout.write('🔄 Restoring test data after pull...')
        
        # Check if backup files exist
        if not os.path.exists(backup_dir):
            self.stdout.write('⚠️ No backup directory found, skipping restore')
            return
        
        # Restore test data
        call_command('restore_tests', input_dir=backup_dir, force=True)
        
        self.stdout.write('✅ Post-pull restore completed')
    
    def add_backup_to_git(self, backup_dir):
        """Add backup files to git"""
        try:
            # Add all backup files to git
            subprocess.run(['git', 'add', f'{backup_dir}/*'], check=True)
            
            # Commit backup files
            subprocess.run([
                'git', 'commit', '-m', 
                'Backup test data before git operation'
            ], check=True)
            
            self.stdout.write('✅ Backup files added to git')
        except subprocess.CalledProcessError as e:
            self.stdout.write(f'⚠️ Failed to add backup to git: {e}')
        except FileNotFoundError:
            self.stdout.write('⚠️ Git not found, skipping git operations')
