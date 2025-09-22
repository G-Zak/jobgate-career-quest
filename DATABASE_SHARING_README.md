# 🔄 Database Sharing Guide

## The Problem
You want your teammate to have the **exact same data** as you, not just populate the database with new data.

## ✅ Solution: Export/Import Your Database

### Step 1: Export Your Database (You do this)

```bash
cd backend
python manage.py dumpdata --natural-foreign --natural-primary -e contenttypes -e auth.Permission > database_export.json
```

This creates a `database_export.json` file with all your data.

### Step 2: Share the File

**Option A: Add to Git (Recommended)**
```bash
git add database_export.json
git commit -m "Add database export for teammates"
git push
```

**Option B: Share via Cloud**
- Upload to Google Drive, Dropbox, etc.
- Send the link to your teammate

**Option C: Send Directly**
- Email the file
- Send via Slack, Discord, etc.

### Step 3: Your Teammate Imports the Data

```bash
# 1. Clone repository
git clone <repository-url>
cd jobgate-career-quest/backend

# 2. Install dependencies
pip install -r requirements.txt

# 3. Import your data (ONE COMMAND!)
python import_database.py

# 4. Start the project
python manage.py runserver
```

## 🎯 What Gets Shared

The export includes:
- ✅ **All Questions** (875+)
- ✅ **All Question Options** (800+ with scores)
- ✅ **All Skills** (50)
- ✅ **All Tests** (30+)
- ✅ **All Scoring Data** (SJT scoring system)
- ✅ **All User Data** (if any)
- ✅ **All Submissions** (if any)

## 🔍 Verify Success

Your teammate should see:
- **875+ Questions** in Django Admin
- **800+ Question Options** with scores
- **50 Skills** for management page
- **All tests working** with your exact data
- **SJT scoring system** working correctly

## 🚨 Important Notes

- ✅ **Preserves relationships** between models
- ✅ **Includes all data** (questions, options, skills, etc.)
- ✅ **Works across different environments**
- ❌ **Large file size** (1MB+ for your data)
- ❌ **Sensitive data** (passwords, etc. - use `-e` flags to exclude)

## 🎉 Why This Works

Django's `dumpdata` and `loaddata` commands are perfect for sharing database content between developers because they:
1. **Preserve relationships** - all foreign keys work correctly
2. **Database agnostic** - works with PostgreSQL, SQLite, MySQL
3. **Selective export** - exclude sensitive data
4. **Version controlled** - can track changes over time

---

**The key insight**: Instead of populating the database with new data, you're sharing your exact database content with your teammate. This ensures they have the same questions, answers, and scoring system as you.
