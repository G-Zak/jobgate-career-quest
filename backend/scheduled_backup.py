#!/usr/bin/env python3
"""
Scheduled Backup Script
======================

This script provides automated backup scheduling functionality.
It can be run as a cron job to create regular backups.

Usage:
    python scheduled_backup.py --config=backup_config.json
    python scheduled_backup.py --type=full --schedule=daily
    python scheduled_backup.py --type=incremental --schedule=hourly
"""

import os
import sys
import argparse
import json
import datetime
import logging
from pathlib import Path
from typing import Dict, List

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'careerquest.settings')
import django
django.setup()

from backup_restore import PostgreSQLBackupManager


class ScheduledBackupManager:
    """Manages scheduled backup operations"""
    
    def __init__(self, config_file: str = 'backup_config.json'):
        self.config_file = config_file
        self.config = self._load_config()
        self.manager = PostgreSQLBackupManager(config_file)
        self.logger = self._setup_logging()
        
    def _load_config(self) -> Dict:
        """Load configuration from file"""
        config_path = Path(self.config_file)
        if not config_path.exists():
            raise FileNotFoundError(f"Configuration file not found: {config_path}")
        
        with open(config_path, 'r') as f:
            return json.load(f)
    
    def _setup_logging(self) -> logging.Logger:
        """Setup logging for scheduled operations"""
        log_dir = Path('logs')
        log_dir.mkdir(exist_ok=True)
        
        log_file = log_dir / f"scheduled_backup_{datetime.datetime.now().strftime('%Y%m%d')}.log"
        
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler(log_file),
                logging.StreamHandler()
            ]
        )
        
        return logging.getLogger(__name__)
    
    def should_run_backup(self, backup_type: str) -> bool:
        """Determine if backup should run based on schedule"""
        now = datetime.datetime.now()
        schedule = self.config.get('backup_schedule', {})
        
        if not schedule.get('enabled', False):
            return False
        
        # Check if it's a full backup day
        if backup_type == 'full':
            full_backup_days = schedule.get('full_backup_days', ['sunday'])
            day_name = now.strftime('%A').lower()
            return day_name in full_backup_days
        
        # Check if it's an incremental backup day
        elif backup_type == 'incremental':
            incremental_days = schedule.get('incremental_backup_days', 
                                          ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'])
            day_name = now.strftime('%A').lower()
            return day_name in incremental_days
        
        return False
    
    def run_scheduled_backup(self, backup_type: str = 'full') -> bool:
        """Run a scheduled backup"""
        self.logger.info(f"Starting scheduled {backup_type} backup...")
        
        # Check if backup should run
        if not self.should_run_backup(backup_type):
            self.logger.info(f"Skipping {backup_type} backup - not scheduled for today")
            return True
        
        # Check backup time
        schedule = self.config.get('backup_schedule', {})
        backup_time = schedule.get('backup_time', '02:00')
        current_time = datetime.datetime.now().strftime('%H:%M')
        
        if current_time != backup_time:
            self.logger.info(f"Backup scheduled for {backup_time}, current time is {current_time}")
            return True
        
        try:
            # Create backup
            success = self.manager.create_backup(backup_type)
            
            if success:
                self.logger.info(f"✅ Scheduled {backup_type} backup completed successfully")
                
                # Send notification if enabled
                self._send_notification(f"Scheduled {backup_type} backup completed successfully")
                
                # Clean up old backups
                self.manager.cleanup_old_backups()
                
                return True
            else:
                self.logger.error(f"❌ Scheduled {backup_type} backup failed")
                self._send_notification(f"Scheduled {backup_type} backup failed", is_error=True)
                return False
                
        except Exception as e:
            self.logger.error(f"❌ Error during scheduled backup: {e}")
            self._send_notification(f"Scheduled backup error: {e}", is_error=True)
            return False
    
    def _send_notification(self, message: str, is_error: bool = False):
        """Send notification about backup status"""
        notifications = self.config.get('notifications', {})
        
        if not notifications.get('enabled', False):
            return
        
        # Email notification
        email_config = notifications.get('email', {})
        if email_config.get('enabled', False):
            self._send_email_notification(message, is_error, email_config)
        
        # Webhook notification
        webhook_config = notifications.get('webhook', {})
        if webhook_config.get('enabled', False):
            self._send_webhook_notification(message, is_error, webhook_config)
    
    def _send_email_notification(self, message: str, is_error: bool, config: Dict):
        """Send email notification"""
        try:
            import smtplib
            from email.mime.text import MIMEText
            from email.mime.multipart import MIMEMultipart
            
            # Create message
            msg = MIMEMultipart()
            msg['From'] = config['from_email']
            msg['To'] = ', '.join(config['to_emails'])
            msg['Subject'] = f"Backup {'Error' if is_error else 'Success'} - {datetime.datetime.now().strftime('%Y-%m-%d %H:%M')}"
            
            body = f"""
            Database Backup Notification
            
            {message}
            
            Time: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
            Server: {os.uname().nodename}
            """
            
            msg.attach(MIMEText(body, 'plain'))
            
            # Send email
            server = smtplib.SMTP(config['smtp_server'], config['smtp_port'])
            server.starttls()
            if config['username'] and config['password']:
                server.login(config['username'], config['password'])
            
            text = msg.as_string()
            server.sendmail(config['from_email'], config['to_emails'], text)
            server.quit()
            
            self.logger.info("Email notification sent successfully")
            
        except Exception as e:
            self.logger.error(f"Failed to send email notification: {e}")
    
    def _send_webhook_notification(self, message: str, is_error: bool, config: Dict):
        """Send webhook notification"""
        try:
            import requests
            
            payload = {
                'message': message,
                'timestamp': datetime.datetime.now().isoformat(),
                'server': os.uname().nodename,
                'is_error': is_error
            }
            
            response = requests.post(
                config['url'],
                json=payload,
                timeout=config.get('timeout', 30)
            )
            
            if response.status_code == 200:
                self.logger.info("Webhook notification sent successfully")
            else:
                self.logger.error(f"Webhook notification failed: {response.status_code}")
                
        except Exception as e:
            self.logger.error(f"Failed to send webhook notification: {e}")
    
    def run_backup_rotation(self):
        """Run backup rotation strategy"""
        self.logger.info("Running backup rotation...")
        
        # Get all backups
        backups = self.manager.list_backups()
        
        # Group by type
        full_backups = [b for b in backups if b['backup_type'] == 'full']
        incremental_backups = [b for b in backups if b['backup_type'] == 'incremental']
        
        # Keep only the latest full backup and last 7 incremental backups
        if len(full_backups) > 1:
            # Sort by creation time and keep only the latest
            full_backups.sort(key=lambda x: x['created_at'], reverse=True)
            for backup in full_backups[1:]:
                self.logger.info(f"Removing old full backup: {backup['filename']}")
                # Remove old full backup (implementation depends on storage backend)
        
        if len(incremental_backups) > 7:
            # Sort by creation time and keep only the last 7
            incremental_backups.sort(key=lambda x: x['created_at'], reverse=True)
            for backup in incremental_backups[7:]:
                self.logger.info(f"Removing old incremental backup: {backup['filename']}")
                # Remove old incremental backup (implementation depends on storage backend)
        
        self.logger.info("Backup rotation completed")


def main():
    """Main function for scheduled backup"""
    parser = argparse.ArgumentParser(description='Scheduled Database Backup')
    parser.add_argument('--config', default='backup_config.json',
                       help='Configuration file path')
    parser.add_argument('--type', choices=['full', 'incremental'],
                       default='full', help='Type of backup to run')
    parser.add_argument('--force', action='store_true',
                       help='Force backup regardless of schedule')
    parser.add_argument('--rotation', action='store_true',
                       help='Run backup rotation')
    
    args = parser.parse_args()
    
    try:
        scheduler = ScheduledBackupManager(args.config)
        
        if args.rotation:
            scheduler.run_backup_rotation()
        else:
            if args.force or scheduler.should_run_backup(args.type):
                success = scheduler.run_scheduled_backup(args.type)
                sys.exit(0 if success else 1)
            else:
                print(f"Skipping {args.type} backup - not scheduled")
                sys.exit(0)
                
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)


if __name__ == '__main__':
    main()
