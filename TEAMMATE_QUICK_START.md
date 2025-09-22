# 🚀 Quick Start Guide for Teammates

## The Problem You're Facing
When you clone the repository, you get the **code** but not the **database data**. The database is empty, so you can't fetch questions, skills, or any test data.

## ✅ One-Command Solution

### 1. Clone and Setup
```bash
git clone <repository-url>
cd jobgate-career-quest/backend
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Run the Database Setup (ONE COMMAND!)
```bash
python quick_setup.py
```

### 4. Start the Project
```bash
# Terminal 1 - Backend
python manage.py runserver

# Terminal 2 - Frontend  
cd ../frontend
npm install
npm run dev
```

## 🎯 What the Setup Script Does

The `quick_setup.py` script automatically populates your database with:

- ✅ **50 Skills** - For skills management page
- ✅ **Sample Candidate** - With 5 skills assigned
- ✅ **875+ Questions** - For all test types:
  - Numerical Reasoning (95 questions)
  - Logical Reasoning (90 questions) 
  - Diagrammatic Reasoning (50 questions)
  - Abstract Reasoning (20 questions)
  - Spatial Reasoning (60 questions)
  - Situational Judgment (200 questions with scoring system)
- ✅ **SJT Scoring System** - Multi-score system (+2, +1, 0, -1)
- ✅ **Database Functions** - For proper scoring

## 📊 Expected Results

After running the setup script, you should see:
```
📊 Setup Summary:
   - Commands run: 13/15
   - Total Questions: 875
   - Total Tests: 30
   - Total Skills: 50
🎉 Database setup completed successfully!
```

## 🔍 Verify Everything Works

### 1. Check Django Admin
- Go to `http://localhost:8000/admin/`
- Login with `admin/admin123`
- You should see:
  - Questions (875+)
  - Question Options (800+)
  - Skills (50)
  - Tests (30+)

### 2. Test the Frontend
- Go to `http://localhost:3000`
- Try accessing different test pages
- Questions should load from the database
- Scoring should work properly

## 🚨 Troubleshooting

### If Setup Fails
```bash
# Run migrations manually
python manage.py migrate

# Run individual commands
python manage.py add_sample_skills
python manage.py create_sample_candidate
python manage.py add_numerical_questions
# ... etc
```

### If Database Connection Fails
```bash
# Check database connection
python manage.py check_postgresql

# Check if PostgreSQL is running
# Make sure your .env file has correct database settings
```

### If Frontend Can't Connect
- Make sure backend is running on port 8000
- Check CORS settings in backend
- Verify API endpoints are accessible

## 🎉 Success!

Once setup is complete, you should be able to:
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

**The key insight**: Git only stores code, not database data. That's why you need to run the setup script to populate your local database with all the questions, skills, and test data.
