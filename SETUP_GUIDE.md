# 🚀 JobGate Career Quest - Setup Guide

This guide will help you successfully run the project with frontend and backend, including database setup and test loading.

## 📋 Prerequisites

Before starting, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **Python** (v3.8 or higher)
- **PostgreSQL** (v12 or higher)
- **Git** (for cloning the repository)

## 🗄️ Database Setup

### 1. Install PostgreSQL

**macOS (using Homebrew):**
```bash
brew install postgresql
brew services start postgresql
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

**Windows:**
Download and install from [PostgreSQL official website](https://www.postgresql.org/download/windows/)

### 2. Create Database and User

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database and user
CREATE DATABASE jobgate_career_quest;
CREATE USER jobgate_user WITH PASSWORD 'your_password_here';
GRANT ALL PRIVILEGES ON DATABASE jobgate_career_quest TO jobgate_user;
\q
```

### 3. Update Database Configuration

Edit `backend/careerquest/database_config.py`:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'jobgate_career_quest',
        'USER': 'jobgate_user',
        'PASSWORD': 'your_password_here',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

## 🔧 Backend Setup

### 1. Navigate to Backend Directory

```bash
cd backend
```

### 2. Create Virtual Environment

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Run Database Migrations

```bash
python manage.py migrate
```

### 5. Create Superuser (Optional)

```bash
python manage.py createsuperuser
```

### 6. Load Test Data

```bash
# Load all test questions and data
python manage.py add_verbal_questions
python manage.py add_numerical_questions
python manage.py add_lrt1_questions
python manage.py add_lrt2_questions
python manage.py add_lrt3_questions
python manage.py add_diagrammatic_image_questions
python manage.py add_diagrammatic_20_questions
python manage.py add_abstract_questions
python manage.py add_sjt_correct_answers
python manage.py update_spatial_tests_to_5_options
```

### 7. Start Backend Server

```bash
python manage.py runserver
```

The backend will be available at `http://localhost:8000`

## 🎨 Frontend Setup

### 1. Navigate to Frontend Directory

```bash
cd frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Frontend Server

```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## 🧪 Test Loading Verification

### 1. Check Backend API

Open your browser and visit:
- `http://localhost:8000/api/tests/` - Should return list of tests
- `http://localhost:8000/api/tests/4/questions/` - Should return 20 random situational judgment questions

### 2. Check Frontend

1. Open `http://localhost:3000`
2. Navigate to Skills Assessment
3. Try different tests:
   - **Verbal Reasoning Test** - Should load questions from database
   - **Numerical Reasoning Test** - Should load questions from database
   - **Situational Judgment Test** - Should show 20 random questions
   - **Spatial Reasoning Test** - Should load with 5 options (A-E)
   - **Abstract Reasoning Test** - Should load with images
   - **Diagrammatic Reasoning Test** - Should load with images

### 3. Test Submission and Scoring

1. Take any test
2. Submit answers
3. Check that scores are calculated and stored
4. Verify in database that submissions and scores are saved

## 🔍 Troubleshooting

### Common Issues

#### 1. Database Connection Error

**Error:** `django.db.utils.OperationalError: could not connect to server`

**Solution:**
- Ensure PostgreSQL is running
- Check database credentials in `database_config.py`
- Verify database exists and user has permissions

#### 2. Port Already in Use

**Error:** `Port 3000 is already in use`

**Solution:**
```bash
# Kill processes on ports 3000, 3001, 8000
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9
lsof -ti:8000 | xargs kill -9
```

#### 3. Frontend Not Loading Questions

**Error:** Questions not loading or showing "Test Unavailable"

**Solution:**
- Check backend is running on port 8000
- Verify API endpoints are accessible
- Check browser console for errors
- Ensure CORS is properly configured

#### 4. Images Not Loading

**Error:** Images fail to load in tests

**Solution:**
- Check image paths in frontend
- Verify images exist in `frontend/src/assets/images/`
- Check browser network tab for 404 errors

### 5. Scoring Issues

**Error:** Scores return null or 0%

**Solution:**
- Ensure correct answers are set in database
- Check submission format (should use letters A, B, C, D, E)
- Verify scoring service is working

## 📊 Database Verification

### Check Test Data

```bash
cd backend
python manage.py shell
```

```python
from testsengine.models import Test, Question, TestSubmission, Score

# Check tests
tests = Test.objects.all()
print(f"Total tests: {tests.count()}")

# Check questions
questions = Question.objects.all()
print(f"Total questions: {questions.count()}")

# Check submissions
submissions = TestSubmission.objects.all()
print(f"Total submissions: {submissions.count()}")

# Check scores
scores = Score.objects.all()
print(f"Total scores: {scores.count()}")
```

## 🚀 Quick Start Commands

```bash
# 1. Clone repository
git clone <repository-url>
cd jobgate-career-quest

# 2. Setup database
# (Follow database setup steps above)

# 3. Backend setup
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py add_verbal_questions
python manage.py add_numerical_questions
python manage.py add_lrt1_questions
python manage.py add_lrt2_questions
python manage.py add_lrt3_questions
python manage.py add_diagrammatic_image_questions
python manage.py add_diagrammatic_20_questions
python manage.py add_abstract_questions
python manage.py add_sjt_correct_answers
python manage.py update_spatial_tests_to_5_options
python manage.py runserver

# 4. Frontend setup (in new terminal)
cd frontend
npm install
npm run dev
```

## 📝 Notes

- **Random Selection**: Some tests (Situational Judgment, Abstract, Diagrammatic, etc.) use random question selection
- **Database Storage**: All questions, answers, and scores are stored in PostgreSQL
- **Image Assets**: Images are served from `frontend/src/assets/images/`
- **CORS**: Backend is configured to allow frontend requests
- **Scoring**: Scores are calculated server-side and stored in database

## 🆘 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Verify all prerequisites are installed
3. Ensure database is running and accessible
4. Check backend and frontend logs for errors
5. Verify API endpoints are working

## ✅ Success Checklist

- [ ] PostgreSQL installed and running
- [ ] Database created and configured
- [ ] Backend dependencies installed
- [ ] Database migrations run
- [ ] Test data loaded
- [ ] Backend server running on port 8000
- [ ] Frontend dependencies installed
- [ ] Frontend server running on port 3000
- [ ] Tests load questions from database
- [ ] Test submission and scoring works
- [ ] Images load correctly
- [ ] Random question selection works

Once all items are checked, you should have a fully functional testing platform! 🎉
