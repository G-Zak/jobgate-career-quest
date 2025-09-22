# 🔄 How to Share Database Data with Teammates

## The Problem
You want your teammate to have the **exact same data** as you, not just populate the database with new data.

## ✅ Solution: Database Export/Import

### Step 1: Export Your Database (You do this)

```bash
cd backend
python manage.py dumpdata --natural-foreign --natural-primary -e contenttypes -e auth.Permission > database_export.json
```

This creates a `database_export.json` file with all your data.

### Step 2: Share the File
- **Add to Git**: `git add database_export.json && git commit -m "Add database export" && git push`
- **Or share via cloud**: Upload to Google Drive, Dropbox, etc.
- **Or send directly**: Email, Slack, etc.

### Step 3: Your Teammate Imports the Data

```bash
# 1. Clone and setup
git clone <repository-url>
cd jobgate-career-quest/backend

# 2. Install dependencies
pip install -r requirements.txt

# 3. Run migrations (creates empty tables)
python manage.py migrate

# 4. Import your data
python manage.py loaddata database_export.json

# 5. Start the project
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

## 🔧 Alternative Methods

### Method 2: PostgreSQL Dump (If using PostgreSQL)

```bash
# Export
pg_dump -h localhost -U your_username -d your_database > database_dump.sql

# Import
psql -h localhost -U your_username -d your_database < database_dump.sql
```

### Method 3: SQLite File (If using SQLite)

```bash
# Just copy the database file
cp db.sqlite3 ../shared_db.sqlite3
# Then share the file
```

### Method 4: Docker Database Volume

```bash
# Export database volume
docker run --rm -v your_db_volume:/data -v $(pwd):/backup alpine tar czf /backup/db_backup.tar.gz -C /data .

# Import database volume
docker run --rm -v your_db_volume:/data -v $(pwd):/backup alpine tar xzf /backup/db_backup.tar.gz -C /data
```

## 🚨 Important Notes

### For Django Export/Import:
- ✅ **Preserves relationships** between models
- ✅ **Includes all data** (questions, options, skills, etc.)
- ✅ **Works across different environments**
- ❌ **Large file size** (1MB+ for your data)
- ❌ **Sensitive data** (passwords, etc. - use `-e` flags to exclude)

### For PostgreSQL Dump:
- ✅ **Complete database backup**
- ✅ **Faster for large databases**
- ❌ **Database-specific** (PostgreSQL only)
- ❌ **Requires same database setup**

### For SQLite File:
- ✅ **Simplest method**
- ✅ **Complete database**
- ❌ **SQLite only**
- ❌ **Platform-specific** (file permissions, etc.)

## 🎉 Recommended Approach

**Use Django Export/Import** because:
1. **Database agnostic** - works with PostgreSQL, SQLite, MySQL
2. **Preserves relationships** - all foreign keys work correctly
3. **Selective export** - exclude sensitive data
4. **Version controlled** - can track changes over time

## 📝 Step-by-Step for Your Teammate

```bash
# 1. Clone repository
git clone <repository-url>
cd jobgate-career-quest/backend

# 2. Install dependencies
pip install -r requirements.txt

# 3. Setup database (empty tables)
python manage.py migrate

# 4. Import your data
python manage.py loaddata database_export.json

# 5. Verify data
python manage.py shell -c "
from testsengine.models import Question, QuestionOption
from skills.models import Skill
print(f'Questions: {Question.objects.count()}')
print(f'Question Options: {QuestionOption.objects.count()}')
print(f'Skills: {Skill.objects.count()}')
"

# 6. Start project
python manage.py runserver
```

## 🔍 Verify Success

Your teammate should see:
- **875+ Questions** in Django Admin
- **800+ Question Options** with scores
- **50 Skills** for management page
- **All tests working** with your exact data
- **SJT scoring system** working correctly

---

**The key insight**: Django's `dumpdata` and `loaddata` commands are perfect for sharing database content between developers while preserving all relationships and data integrity.
