# 🚀 Teammate Setup Guide

## The Problem
When you clone the repository, you get the **code** but not the **database data**. The database is empty, so you can't fetch questions, skills, or any test data.

## ✅ Quick Solution

### 1. Clone and Setup
```bash
git clone <repository-url>
cd jobgate-career-quest
```

### 2. Backend Setup
```bash
cd backend
pip install -r requirements.txt
python setup_database.py
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```

### 4. Start Backend
```bash
cd ../backend
python manage.py runserver
```

## 🔍 What the Setup Script Does

The `setup_database.py` script automatically:

1. **Runs migrations** - Creates all database tables
2. **Creates admin user** - `admin/admin123`
3. **Adds 50 skills** - For skills management page
4. **Creates sample candidate** - With 5 skills assigned
5. **Adds 200+ questions** - For all test types:
   - Numerical Reasoning (60 questions)
   - Logical Reasoning (90 questions)
   - Diagrammatic Reasoning (50 questions)
   - Abstract Reasoning (20 questions)
   - Spatial Reasoning (60 questions)
   - Situational Judgment (200 questions with scoring system)
6. **Sets up scoring system** - Including SJT multi-score system
7. **Verifies everything works** - Shows summary of data added

## 🎯 Expected Results

After running the setup script, you should see:
```
📊 Database Summary:
   - Total Questions: 500+
   - Total Tests: 15+
   - Total Skills: 50
   - SJT Questions: 200
🎉 Database setup completed successfully!
```

## 🚨 If Something Goes Wrong

### Check Database Connection
```bash
python manage.py check_postgresql
```

### Manual Setup (if script fails)
```bash
# Run each command individually
python manage.py migrate
python manage.py add_sample_skills
python manage.py create_sample_candidate
python manage.py add_numerical_questions
python manage.py add_lrt1_questions
python manage.py add_lrt2_questions
python manage.py add_lrt3_questions
python manage.py add_diagrammatic_20_questions
python manage.py add_abstract_questions
python manage.py create_spatial_tests
python manage.py update_sjt_scoring_system_fixed
python manage.py create_sjt_scoring_service
```

### Check Django Admin
1. Go to `http://localhost:8000/admin/`
2. Login with `admin/admin123`
3. Check if you see:
   - Questions (500+)
   - Question Options (800+)
   - Skills (50)
   - Tests (15+)

## 🎉 Success!

Once the setup is complete, you should be able to:
- ✅ Access all test pages
- ✅ See questions loaded from database
- ✅ Submit tests and get scores
- ✅ Use skills management page
- ✅ See all data in Django Admin

## 📞 Need Help?

If you encounter any issues:
1. Check the terminal output for error messages
2. Verify database connection
3. Check if all migrations ran successfully
4. Contact the team for support

---

**Note**: This setup only needs to be run once. After that, the database will have all the necessary data and the project will work normally.
