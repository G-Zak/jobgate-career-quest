# 🔧 Troubleshooting Guide

This guide helps resolve common issues when setting up and running the JobGate Career Quest project.

## 🚨 Common Issues & Solutions

### 1. Database Connection Issues

#### Error: `django.db.utils.OperationalError: could not connect to server`

**Causes:**
- PostgreSQL not running
- Wrong database credentials
- Database doesn't exist
- User doesn't have permissions

**Solutions:**
```bash
# Check if PostgreSQL is running
brew services list | grep postgresql  # macOS
sudo systemctl status postgresql      # Linux

# Start PostgreSQL
brew services start postgresql        # macOS
sudo systemctl start postgresql       # Linux

# Check database exists
psql -U postgres -l

# Create database if missing
psql -U postgres
CREATE DATABASE jobgate_career_quest;
CREATE USER jobgate_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE jobgate_career_quest TO jobgate_user;
\q
```

### 2. Port Already in Use

#### Error: `Port 3000 is already in use` or `Port 8000 is already in use`

**Solution:**
```bash
# Find and kill processes using ports
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9
lsof -ti:8000 | xargs kill -9

# Or use specific port
python manage.py runserver 8001  # Backend on 8001
npm run dev -- --port 3001       # Frontend on 3001
```

### 3. Frontend Not Loading Questions

#### Error: "Test Unavailable" or questions not loading

**Causes:**
- Backend not running
- CORS issues
- API endpoint errors
- Network connectivity

**Solutions:**
```bash
# 1. Check backend is running
curl http://localhost:8000/api/tests/

# 2. Check specific test endpoint
curl http://localhost:8000/api/tests/4/questions/

# 3. Check browser console for errors
# Open Developer Tools (F12) → Console tab

# 4. Verify CORS settings in backend/careerquest/settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173"
]
```

### 4. Images Not Loading

#### Error: Images fail to load in tests

**Causes:**
- Wrong image paths
- Images don't exist
- Frontend server not serving static files

**Solutions:**
```bash
# 1. Check if images exist
ls -la frontend/src/assets/images/

# 2. Check image paths in browser
# Open Developer Tools → Network tab → Look for 404 errors

# 3. Verify image paths in components
# Should be: /src/assets/images/[test_type]/[image_name]
```

### 5. Scoring Issues

#### Error: Scores return null or 0%

**Causes:**
- Missing correct answers
- Wrong answer format
- Scoring service errors

**Solutions:**
```bash
# 1. Check if correct answers exist
python manage.py shell
```

```python
from testsengine.models import Question
questions = Question.objects.filter(test_id=4)
for q in questions[:3]:
    print(f"Q{q.id}: correct_answer = {q.correct_answer}")
```

```bash
# 2. Add correct answers if missing
python manage.py add_sjt_correct_answers

# 3. Check answer format
# Should be letters: A, B, C, D, E
# Not numbers: 0, 1, 2, 3, 4
```

### 6. Random Selection Not Working

#### Error: All questions showing instead of 20 random

**Causes:**
- Test not in random selection list
- Backend not updated

**Solutions:**
```bash
# 1. Check backend/testsengine/views.py
# Ensure test ID is in random_selection list

# 2. Restart backend server
python manage.py runserver

# 3. Test API endpoint
curl -s "http://localhost:8000/api/tests/4/questions/" | jq '.random_selection'
```

### 7. Dependencies Issues

#### Error: `ModuleNotFoundError` or `npm ERR`

**Solutions:**
```bash
# Backend dependencies
cd backend
pip install -r requirements.txt

# Frontend dependencies
cd frontend
npm install

# If still issues, try:
pip install --upgrade pip
npm cache clean --force
npm install
```

### 8. Migration Issues

#### Error: `django.db.utils.ProgrammingError` or migration errors

**Solutions:**
```bash
# 1. Reset migrations (DANGER - deletes data)
python manage.py flush
python manage.py migrate

# 2. Or fix specific migration
python manage.py migrate --fake-initial
python manage.py migrate
```

## 🔍 Debugging Steps

### 1. Check Backend Logs
```bash
cd backend
python manage.py runserver --verbosity=2
```

### 2. Check Frontend Logs
```bash
cd frontend
npm run dev
# Check terminal output for errors
```

### 3. Check Database
```bash
python manage.py shell
```

```python
from testsengine.models import *
print(f"Tests: {Test.objects.count()}")
print(f"Questions: {Question.objects.count()}")
print(f"Submissions: {TestSubmission.objects.count()}")
```

### 4. Check API Endpoints
```bash
# Test basic connectivity
curl http://localhost:8000/api/tests/

# Test specific test
curl http://localhost:8000/api/tests/4/questions/ | jq '.total_questions'

# Test submission
curl -X POST http://localhost:8000/api/tests/4/submit/ \
  -H "Content-Type: application/json" \
  -d '{"answers": {"11": "A"}, "time_taken_seconds": 300}'
```

## 🆘 Emergency Reset

If nothing works, try a complete reset:

```bash
# 1. Stop all servers
# Ctrl+C in all terminal windows

# 2. Kill all processes
lsof -ti:3000 | xargs kill -9
lsof -ti:8000 | xargs kill -9

# 3. Reset database
psql -U postgres
DROP DATABASE jobgate_career_quest;
CREATE DATABASE jobgate_career_quest;
GRANT ALL PRIVILEGES ON DATABASE jobgate_career_quest TO jobgate_user;
\q

# 4. Reset backend
cd backend
rm -rf venv
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

# 5. Reset frontend (in new terminal)
cd frontend
rm -rf node_modules
npm install
npm run dev
```

## 📞 Getting Help

If you're still stuck:

1. Check the main SETUP_GUIDE.md
2. Check MANAGEMENT_COMMANDS.md for data loading
3. Check browser console for frontend errors
4. Check backend terminal for Django errors
5. Verify all prerequisites are installed
6. Try the emergency reset procedure

## ✅ Success Indicators

You know everything is working when:

- [ ] Backend runs without errors on port 8000
- [ ] Frontend runs without errors on port 3000
- [ ] API endpoints return data (not 404/500 errors)
- [ ] Tests load questions from database
- [ ] Images display correctly
- [ ] Test submission works and shows scores
- [ ] Random selection shows 20 questions (not 200)
- [ ] All 5 options (A-E) show for spatial tests