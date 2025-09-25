# Test Data Management for Safe Merging

This document explains how to safely manage test data during Git operations to prevent data loss during merges.

## 🚨 Problem

When merging branches, test data (questions, tests, skills) can be lost because:
- Database migrations might reset data
- Different branches might have different test data
- Manual data entry gets overwritten

## ✅ Solution

This system provides automated backup and restore functionality for test data.

## 📁 Files Created

### Management Commands
- `backend/testsengine/management/commands/backup_tests.py` - Backup test data
- `backend/testsengine/management/commands/restore_tests.py` - Restore test data
- `backend/testsengine/management/commands/sync_tests_with_git.py` - Sync with Git operations

### Setup Scripts
- `backend/setup_tests_for_merge.py` - Initial setup
- `backend/post_merge_restore.py` - Post-merge restoration
- `backend/validate_test_data.py` - Data validation

### Git Hooks
- `backend/git_hooks/setup_hooks.py` - Setup automatic Git hooks

## 🚀 Quick Start

### 1. Initial Setup
```bash
cd backend
python setup_tests_for_merge.py
```

### 2. Setup Git Hooks (Optional)
```bash
cd backend
python git_hooks/setup_hooks.py
```

### 3. Before Merging
```bash
cd backend
python manage.py backup_tests --include-questions
git add backend/testsengine/fixtures/
git commit -m "Backup test data before merge"
```

### 4. After Merging
```bash
cd backend
python post_merge_restore.py
```

## 📋 Manual Commands

### Backup Test Data
```bash
# Backup all test data
python manage.py backup_tests --include-questions

# Backup to specific directory
python manage.py backup_tests --output-dir /path/to/backup --include-questions
```

### Restore Test Data
```bash
# Restore from default location
python manage.py restore_tests

# Restore from specific directory
python manage.py restore_tests --input-dir /path/to/backup

# Force restore (overwrite existing)
python manage.py restore_tests --force

# Clear existing data before restore
python manage.py restore_tests --clear-existing
```

### Sync with Git Operations
```bash
# Before merging
python manage.py sync_tests_with_git --action pre-merge

# After merging
python manage.py sync_tests_with_git --action post-merge

# Before pushing
python manage.py sync_tests_with_git --action pre-push

# After pulling
python manage.py sync_tests_with_git --action post-pull
```

### Validate Test Data
```bash
python validate_test_data.py
```

## 🔄 Workflow for Safe Merging

### Option 1: Manual (Recommended)
1. **Before merging:**
   ```bash
   cd backend
   python manage.py backup_tests --include-questions
   git add backend/testsengine/fixtures/
   git commit -m "Backup test data before merge"
   ```

2. **Merge:**
   ```bash
   git merge main
   ```

3. **After merging:**
   ```bash
   cd backend
   python post_merge_restore.py
   ```

### Option 2: Automatic (with Git Hooks)
1. **Setup once:**
   ```bash
   cd backend
   python git_hooks/setup_hooks.py
   ```

2. **Merge normally:**
   ```bash
   git merge main
   # Hooks will automatically backup/restore
   ```

## 📊 What Gets Backed Up

- **Skills** (`skills_backup.json`)
- **Tests** (`tests_backup.json`)
- **Questions** (`questions_backup.json`)
- **Question Options** (`question_options_backup.json`)

## 🛠️ Troubleshooting

### No Tests Found After Merge
```bash
cd backend
python post_merge_restore.py
```

### Backup Files Missing
```bash
cd backend
python manage.py populate_technical_tests --force
python manage.py backup_tests --include-questions
```

### Data Validation Failed
```bash
cd backend
python validate_test_data.py
```

### Reset Everything
```bash
cd backend
python manage.py restore_tests --clear-existing
python manage.py populate_technical_tests --force
```

## 📝 Notes

- Backup files are stored in `backend/testsengine/fixtures/`
- Always commit backup files before merging
- The system preserves relationships between tests, questions, and options
- Use `--force` flag to overwrite existing data
- Use `--clear-existing` flag to start fresh

## 🎯 Best Practices

1. **Always backup before merging**
2. **Commit backup files to Git**
3. **Validate data after restoration**
4. **Keep backup files in version control**
5. **Test the restoration process regularly**

## 🚨 Emergency Recovery

If all else fails:
```bash
cd backend
python manage.py populate_technical_tests --force
python manage.py backup_tests --include-questions
git add backend/testsengine/fixtures/
git commit -m "Emergency test data recovery"
```
