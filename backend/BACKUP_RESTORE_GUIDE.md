# PostgreSQL Backup and Restore Guide

## Overview

This guide provides comprehensive instructions for setting up and managing PostgreSQL backups for the JobGate Career Quest scoring system. The backup system includes:

- **Full Database Backups**: Complete database dumps
- **Schema-Only Backups**: Database structure without data
- **Data-Only Backups**: Data without schema
- **Incremental Backups**: Changes since last backup
- **Automated Scheduling**: Cron-based backup automation
- **Backup Verification**: Integrity checking
- **Retention Management**: Automatic cleanup of old backups

## Quick Start

### 1. Create a Full Backup
```bash
# Using Django management command
python manage.py backup_database --type=full

# Using direct script
python backup_restore.py backup --type=full
```

### 2. List Available Backups
```bash
python manage.py backup_database --list
```

### 3. Restore from Backup
```bash
python manage.py backup_database --restore --file=backup_full_20250919_143022.sql
```

### 4. Verify Backup Integrity
```bash
python manage.py backup_database --verify --file=backup_full_20250919_143022.sql
```

## Installation and Setup

### Prerequisites

1. **PostgreSQL Tools**: Ensure `pg_dump`, `pg_restore`, and `psql` are installed
2. **Python Dependencies**: Install required packages
3. **Database Access**: Ensure proper database credentials

### Install Dependencies

```bash
pip install psycopg2-binary
```

### Configure Backup Settings

Edit `backup_config.json`:

```json
{
  "backup_directory": "backups",
  "retention_days": 30,
  "compression": true,
  "verify_backups": true,
  "log_level": "INFO"
}
```

## Backup Types

### 1. Full Backup
Complete database dump including schema and data.

```bash
# Django command
python manage.py backup_database --type=full

# Direct script
python backup_restore.py backup --type=full
```

**Features:**
- Includes all tables, data, indexes, constraints
- Can restore to empty database
- Compressed by default
- Includes metadata

### 2. Schema-Only Backup
Database structure without data.

```bash
python manage.py backup_database --type=schema
```

**Use Cases:**
- Development environment setup
- Schema versioning
- Quick database structure replication

### 3. Data-Only Backup
Data without schema structure.

```bash
python manage.py backup_database --type=data
```

**Use Cases:**
- Data migration
- Incremental data updates
- Data analysis

### 4. Table-Specific Backup
Backup specific tables only.

```bash
python manage.py backup_database --type=full --tables testsengine_test testsengine_question
```

## Restore Operations

### 1. Full Restore
Restore complete database from backup.

```bash
python manage.py backup_database --restore --file=backup_full_20250919_143022.sql
```

### 2. Restore with Database Creation
Create database if it doesn't exist.

```bash
python manage.py backup_database --restore --file=backup_full_20250919_143022.sql --create-db
```

### 3. Verify Before Restore
Always verify backup integrity before restoring.

```bash
python manage.py backup_database --verify --file=backup_full_20250919_143022.sql
```

## Automated Scheduling

### 1. Setup Cron Job

Add to crontab (`crontab -e`):

```bash
# Full backup every Sunday at 2 AM
0 2 * * 0 cd /path/to/backend && python scheduled_backup.py --type=full

# Incremental backup every day at 2 AM (except Sunday)
0 2 * * 1-6 cd /path/to/backend && python scheduled_backup.py --type=incremental

# Cleanup old backups every Monday at 3 AM
0 3 * * 1 cd /path/to/backend && python manage.py backup_database --cleanup
```

### 2. Configure Schedule

Edit `backup_config.json`:

```json
{
  "backup_schedule": {
    "enabled": true,
    "full_backup_days": ["sunday"],
    "incremental_backup_days": ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"],
    "backup_time": "02:00",
    "timezone": "UTC"
  }
}
```

## Backup Management

### 1. List Backups
```bash
python manage.py backup_database --list
```

**Output:**
```
📋 Available Backups (5 total):
--------------------------------------------------------------------------------
📁 backup_full_20250919_143022.sql.gz
   Type: full
   Size: 2.45 MB
   Created: 2025-09-19 14:30:22
   Compressed: Yes

📁 backup_schema_20250919_120000.sql
   Type: schema
   Size: 0.15 MB
   Created: 2025-09-19 12:00:00
   Compressed: No
```

### 2. Cleanup Old Backups
```bash
python manage.py backup_database --cleanup
```

### 3. Database Information
```bash
python manage.py backup_database --info
```

**Output:**
```
📊 Database Information:
----------------------------------------
Database: jobgate_career_quest
Size: 15.2 MB
Active Connections: 3

📋 Tables:
  • testsengine_test: 2.1 MB (Inserts: 12, Updates: 0, Deletes: 0)
  • testsengine_question: 8.5 MB (Inserts: 150, Updates: 0, Deletes: 0)
  • testsengine_testsubmission: 1.2 MB (Inserts: 45, Updates: 0, Deletes: 0)
```

## Backup Verification

### 1. Verify Backup Integrity
```bash
python manage.py backup_database --verify --file=backup_full_20250919_143022.sql
```

### 2. Test Restore (Dry Run)
```bash
# Create test database
createdb test_restore_db

# Restore to test database
pg_restore --dbname=test_restore_db backup_full_20250919_143022.sql

# Verify data
psql test_restore_db -c "SELECT COUNT(*) FROM testsengine_test;"

# Clean up
dropdb test_restore_db
```

## Configuration Options

### backup_config.json

```json
{
  "backup_directory": "backups",
  "retention_days": 30,
  "compression": true,
  "verify_backups": true,
  "log_level": "INFO",
  "pg_dump_path": "pg_dump",
  "pg_restore_path": "pg_restore",
  "psql_path": "psql",
  "backup_schedule": {
    "enabled": true,
    "full_backup_days": ["sunday"],
    "incremental_backup_days": ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"],
    "backup_time": "02:00",
    "timezone": "UTC"
  },
  "notifications": {
    "enabled": true,
    "email": {
      "smtp_server": "localhost",
      "smtp_port": 587,
      "username": "",
      "password": "",
      "from_email": "backup@jobgate-career-quest.com",
      "to_emails": ["admin@jobgate-career-quest.com"]
    }
  }
}
```

## Security Considerations

### 1. Backup Encryption
```bash
# Encrypt backup file
gpg --symmetric --cipher-algo AES256 backup_full_20250919_143022.sql

# Decrypt for restore
gpg --decrypt backup_full_20250919_143022.sql.gpg > backup_full_20250919_143022.sql
```

### 2. Secure Storage
- Store backups in secure, encrypted storage
- Use different locations for local and remote backups
- Implement access controls
- Regular security audits

### 3. Database Credentials
- Use environment variables for passwords
- Implement least-privilege access
- Rotate credentials regularly

## Monitoring and Alerts

### 1. Backup Status Monitoring
```bash
# Check last backup
ls -la backups/ | head -5

# Check backup logs
tail -f backup_restore.log
```

### 2. Email Notifications
Configure email alerts in `backup_config.json`:

```json
{
  "notifications": {
    "enabled": true,
    "email": {
      "smtp_server": "smtp.gmail.com",
      "smtp_port": 587,
      "username": "backup@yourcompany.com",
      "password": "your_app_password",
      "from_email": "backup@yourcompany.com",
      "to_emails": ["admin@yourcompany.com", "dba@yourcompany.com"]
    }
  }
}
```

### 3. Webhook Notifications
```json
{
  "notifications": {
    "webhook": {
      "enabled": true,
      "url": "https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK",
      "timeout": 30
    }
  }
}
```

## Disaster Recovery

### 1. Recovery Procedures

#### Complete Database Loss
```bash
# 1. Create new database
createdb jobgate_career_quest

# 2. Restore from latest full backup
python manage.py backup_database --restore --file=backup_full_20250919_143022.sql --create-db

# 3. Apply any incremental backups
python manage.py backup_database --restore --file=backup_incremental_20250920_020000.sql

# 4. Verify data integrity
python manage.py backup_database --info
```

#### Partial Data Loss
```bash
# 1. Identify affected tables
psql jobgate_career_quest -c "SELECT tablename FROM pg_tables WHERE schemaname = 'public';"

# 2. Restore specific tables
python manage.py backup_database --restore --file=backup_full_20250919_143022.sql --tables=testsengine_test
```

### 2. Recovery Testing
```bash
# Monthly recovery test
python test_recovery.py --backup=backup_full_20250919_143022.sql --test-db=test_recovery_db
```

## Troubleshooting

### Common Issues

#### 1. Permission Denied
```bash
# Fix backup directory permissions
chmod 755 backups/
chown postgres:postgres backups/
```

#### 2. Database Connection Failed
```bash
# Check database configuration
python manage.py dbshell

# Verify connection settings
python manage.py backup_database --info
```

#### 3. Backup File Corrupted
```bash
# Verify backup integrity
python manage.py backup_database --verify --file=backup_full_20250919_143022.sql

# Check file size
ls -la backups/backup_full_20250919_143022.sql
```

#### 4. Restore Failed
```bash
# Check database exists
psql -l | grep jobgate_career_quest

# Check backup file format
file backups/backup_full_20250919_143022.sql
```

## Best Practices

### 1. Backup Strategy
- **Daily Incremental**: Monday-Saturday
- **Weekly Full**: Sunday
- **Monthly Archive**: Keep for 1 year
- **Test Restores**: Monthly

### 2. Storage Strategy
- **Local Storage**: Immediate access
- **Remote Storage**: Disaster recovery
- **Multiple Locations**: Geographic distribution

### 3. Monitoring
- **Backup Success**: Daily verification
- **Storage Space**: Weekly checks
- **Recovery Testing**: Monthly tests

### 4. Documentation
- **Recovery Procedures**: Documented and tested
- **Contact Information**: Updated regularly
- **Escalation Procedures**: Clear and defined

## Maintenance

### Daily Tasks
- Monitor backup completion
- Check backup logs
- Verify storage space

### Weekly Tasks
- Review backup retention
- Test restore procedures
- Update documentation

### Monthly Tasks
- Full recovery testing
- Security audit
- Performance review

## Support

For issues or questions:
1. Check logs: `tail -f backup_restore.log`
2. Verify configuration: `python manage.py backup_database --info`
3. Test backup: `python manage.py backup_database --verify --file=latest_backup.sql`
4. Contact system administrator

---

**Remember**: Regular backups are essential for data protection. Test your restore procedures regularly to ensure they work when needed!
