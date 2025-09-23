# Team Database Setup Guide

## 🎯 Quick Setup for Teammates

### Prerequisites
- Python 3.8+
- Django 4.2+
- PostgreSQL or SQLite

### Step 1: Clone Repository
```bash
git clone <your-repo-url>
cd jobgate-career-quest
git checkout feature/database_integration
```

### Step 2: Backend Setup
```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
```

### Step 3: Import Database
```bash
python import_database.py
```

### Step 4: Start Development
```bash
# Terminal 1 - Backend
python manage.py runserver

# Terminal 2 - Frontend  
cd ../frontend
npm install
npm run dev
```

## 📊 What's Included

### Complete Test Database:
- **VRT1-VRT5**: 300 unique verbal reasoning questions
- **SJT**: 32 situational judgment questions with scoring
- **All Other Tests**: Numerical, Logical, Diagrammatic, Abstract, Spatial
- **Skills Database**: 50+ technical skills
- **Scoring Systems**: Complete scoring logic and functions

### Key Features:
- ✅ All questions have realistic answers (no placeholders)
- ✅ Random question selection works properly
- ✅ Anti-cheating measures implemented
- ✅ Complete scoring system
- ✅ All tests functional and ready

## 🔧 Troubleshooting

### If Import Fails:
```bash
# Clear existing data
python manage.py flush --noinput

# Re-import
python import_database.py
```

### If Questions Missing:
```bash
# Recreate questions
python manage.py fix_vrt_duplicates_v2
python manage.py fix_vrt5_real_answers
```

## 📞 Support
If you encounter issues, check:
1. Python/Django versions match
2. Database migrations completed
3. All dependencies installed
4. File permissions correct

---
**Last Updated**: September 22, 2025
**Database Version**: Complete with all fixes and improvements
