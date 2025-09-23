#!/bin/bash
# Setup Cron Jobs for PostgreSQL Backups
# ======================================

# This script sets up automated backup cron jobs for the JobGate Career Quest system

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BACKEND_DIR="/Users/zakariaguennani/Documents/Dev/EMSI/Internship/jobgate-career-quest/backend"
PYTHON_PATH=$(which python)
BACKUP_SCRIPT="$BACKEND_DIR/scheduled_backup.py"
MANAGE_SCRIPT="$BACKEND_DIR/manage.py"

echo -e "${BLUE}🔧 Setting up PostgreSQL Backup Cron Jobs${NC}"
echo "=============================================="

# Check if backend directory exists
if [ ! -d "$BACKEND_DIR" ]; then
    echo -e "${RED}❌ Backend directory not found: $BACKEND_DIR${NC}"
    exit 1
fi

# Check if Python is available
if [ ! -f "$PYTHON_PATH" ]; then
    echo -e "${RED}❌ Python not found: $PYTHON_PATH${NC}"
    exit 1
fi

# Check if backup script exists
if [ ! -f "$BACKUP_SCRIPT" ]; then
    echo -e "${RED}❌ Backup script not found: $BACKUP_SCRIPT${NC}"
    exit 1
fi

# Check if manage.py exists
if [ ! -f "$MANAGE_SCRIPT" ]; then
    echo -e "${RED}❌ manage.py not found: $MANAGE_SCRIPT${NC}"
    exit 1
fi

echo -e "${GREEN}✅ All required files found${NC}"

# Create backup directory if it doesn't exist
BACKUP_DIR="$BACKEND_DIR/backups"
mkdir -p "$BACKUP_DIR"
echo -e "${GREEN}✅ Backup directory created: $BACKUP_DIR${NC}"

# Create logs directory if it doesn't exist
LOGS_DIR="$BACKEND_DIR/logs"
mkdir -p "$LOGS_DIR"
echo -e "${GREEN}✅ Logs directory created: $LOGS_DIR${NC}"

# Create cron job entries
echo -e "${YELLOW}📝 Creating cron job entries...${NC}"

# Full backup every Sunday at 2 AM
FULL_BACKUP_CRON="0 2 * * 0 cd $BACKEND_DIR && $PYTHON_PATH $BACKUP_SCRIPT --type=full --config=backup_config.json >> $LOGS_DIR/cron_backup.log 2>&1"

# Incremental backup every day at 2 AM (except Sunday)
INCREMENTAL_BACKUP_CRON="0 2 * * 1-6 cd $BACKEND_DIR && $PYTHON_PATH $BACKUP_SCRIPT --type=incremental --config=backup_config.json >> $LOGS_DIR/cron_backup.log 2>&1"

# Cleanup old backups every Monday at 3 AM
CLEANUP_CRON="0 3 * * 1 cd $BACKEND_DIR && $PYTHON_PATH $MANAGE_SCRIPT backup_database --cleanup >> $LOGS_DIR/cron_cleanup.log 2>&1"

# Database info check every day at 4 AM
INFO_CRON="0 4 * * * cd $BACKEND_DIR && $PYTHON_PATH $MANAGE_SCRIPT backup_database --info >> $LOGS_DIR/cron_info.log 2>&1"

# Create temporary cron file
TEMP_CRON_FILE="/tmp/backup_cron_$$"

# Get current crontab
crontab -l > "$TEMP_CRON_FILE" 2>/dev/null || touch "$TEMP_CRON_FILE"

# Add backup cron jobs if they don't exist
if ! grep -q "backup_full" "$TEMP_CRON_FILE"; then
    echo "# JobGate Career Quest - Full Database Backup (Sunday 2 AM)" >> "$TEMP_CRON_FILE"
    echo "$FULL_BACKUP_CRON" >> "$TEMP_CRON_FILE"
    echo "" >> "$TEMP_CRON_FILE"
    echo -e "${GREEN}✅ Added full backup cron job${NC}"
else
    echo -e "${YELLOW}⚠️ Full backup cron job already exists${NC}"
fi

if ! grep -q "backup_incremental" "$TEMP_CRON_FILE"; then
    echo "# JobGate Career Quest - Incremental Database Backup (Mon-Sat 2 AM)" >> "$TEMP_CRON_FILE"
    echo "$INCREMENTAL_BACKUP_CRON" >> "$TEMP_CRON_FILE"
    echo "" >> "$TEMP_CRON_FILE"
    echo -e "${GREEN}✅ Added incremental backup cron job${NC}"
else
    echo -e "${YELLOW}⚠️ Incremental backup cron job already exists${NC}"
fi

if ! grep -q "backup_cleanup" "$TEMP_CRON_FILE"; then
    echo "# JobGate Career Quest - Backup Cleanup (Monday 3 AM)" >> "$TEMP_CRON_FILE"
    echo "$CLEANUP_CRON" >> "$TEMP_CRON_FILE"
    echo "" >> "$TEMP_CRON_FILE"
    echo -e "${GREEN}✅ Added cleanup cron job${NC}"
else
    echo -e "${YELLOW}⚠️ Cleanup cron job already exists${NC}"
fi

if ! grep -q "backup_info" "$TEMP_CRON_FILE"; then
    echo "# JobGate Career Quest - Database Info Check (Daily 4 AM)" >> "$TEMP_CRON_FILE"
    echo "$INFO_CRON" >> "$TEMP_CRON_FILE"
    echo "" >> "$TEMP_CRON_FILE"
    echo -e "${GREEN}✅ Added database info cron job${NC}"
else
    echo -e "${YELLOW}⚠️ Database info cron job already exists${NC}"
fi

# Install the new crontab
crontab "$TEMP_CRON_FILE"
rm "$TEMP_CRON_FILE"

echo -e "${GREEN}✅ Cron jobs installed successfully${NC}"

# Test the backup system
echo -e "${YELLOW}🧪 Testing backup system...${NC}"
cd "$BACKEND_DIR"

# Test backup creation
if $PYTHON_PATH $MANAGE_SCRIPT backup_database --type=schema > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backup system test passed${NC}"
else
    echo -e "${RED}❌ Backup system test failed${NC}"
    exit 1
fi

# Show current crontab
echo -e "${BLUE}📋 Current crontab entries:${NC}"
echo "================================"
crontab -l | grep -A 1 -B 1 "JobGate Career Quest" || echo "No JobGate Career Quest cron jobs found"

echo ""
echo -e "${GREEN}🎉 Backup cron jobs setup completed successfully!${NC}"
echo ""
echo -e "${BLUE}📋 Summary:${NC}"
echo "• Full backup: Every Sunday at 2:00 AM"
echo "• Incremental backup: Monday-Saturday at 2:00 AM"
echo "• Cleanup: Every Monday at 3:00 AM"
echo "• Database info: Daily at 4:00 AM"
echo ""
echo -e "${BLUE}📁 Backup location:${NC} $BACKUP_DIR"
echo -e "${BLUE}📝 Logs location:${NC} $LOGS_DIR"
echo ""
echo -e "${YELLOW}💡 To view cron logs:${NC}"
echo "tail -f $LOGS_DIR/cron_backup.log"
echo "tail -f $LOGS_DIR/cron_cleanup.log"
echo "tail -f $LOGS_DIR/cron_info.log"
echo ""
echo -e "${YELLOW}💡 To manually run backups:${NC}"
echo "cd $BACKEND_DIR"
echo "python manage.py backup_database --type=full"
echo "python manage.py backup_database --list"
echo "python manage.py backup_database --info"
echo ""
echo -e "${GREEN}✅ Setup complete!${NC}"
