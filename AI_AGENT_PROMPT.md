# 🤖 AI Agent Prompt for Teammates

## Copy & Paste This Prompt into Your AI Agent

```
I need help setting up a JobGate Career Quest project with a complete database. Here are the details:

**Repository**: https://github.com/G-Zak/jobgate-career-quest.git

**Project Type**: Full-stack web application with:
- Frontend: React.js with Vite
- Backend: Django with REST API
- Database: PostgreSQL with 1,200+ questions and complete test data
- Docker support available

**Quick Setup Options**:

**Option 1 - Docker with Database (Recommended)**:
```bash
git clone https://github.com/G-Zak/jobgate-career-quest.git
cd jobgate-career-quest
# Windows: setup_database_windows.bat
# Linux/Mac: ./setup_database.sh
# OR manually: docker-compose up -d
```

**Option 2 - Local Development**:
```bash
git clone https://github.com/G-Zak/jobgate-career-quest.git
cd jobgate-career-quest
# Windows: setup_team_windows.bat
# Linux/Mac: ./setup_team_skills.sh
```

**Database Includes**:
- 1,200+ questions across 8 test categories
- 4,800+ answer options with scoring
- Complete test data for Verbal, Numerical, Logical, Abstract, Diagrammatic, Spatial, Situational, and Technical tests
- User accounts and test history data

**What I need**:
1. Help me clone and set up the project
2. Get the database running with all test data loaded
3. Get both frontend and backend running
4. Verify the database has 1,200+ questions loaded
5. Access the application at http://localhost:3000
6. Troubleshoot any database or setup issues

**Verification Steps**:
- Run `python verify_database.py` to check data is loaded
- Check http://localhost:8000/admin shows questions and tests
- Verify http://localhost:8000/api/tests/ returns test data
- Confirm frontend loads without errors

**Expected Result**: A working web application with complete test system, scoring, and admin panel.

Please guide me through the setup process step by step, focusing on ensuring the database is properly loaded with all test data.
```

---

## Alternative Shorter Prompt

```
Help me set up this project with database: https://github.com/G-Zak/jobgate-career-quest.git

It's a React + Django app with PostgreSQL database containing 1,200+ test questions.

Setup:
1. Clone repo
2. Run `setup_database_windows.bat` (Windows) or `./setup_database.sh` (Linux/Mac)
3. Verify with `python verify_database.py`
4. Access http://localhost:3000

Guide me through setup and database verification.
```

---

## What Your Teammates Will Get

When they use this prompt, their AI agent will:

1. **Guide them through cloning** the repository
2. **Help with Docker setup** including database initialization
3. **Verify database data** is loaded correctly (1,200+ questions)
4. **Troubleshoot database issues** like connection problems
5. **Check all services** are running properly
6. **Verify the application** works end-to-end

## Database Verification Commands

Your teammates can use these commands to verify everything is working:

```bash
# Check database status
docker-compose ps

# Verify data is loaded
python verify_database.py

# Check questions count
docker-compose exec backend python manage.py shell -c "from testsengine.models import Question; print(f'Questions: {Question.objects.count()}')"

# Check API data
curl http://localhost:8000/api/tests/

# Access admin panel
# Open http://localhost:8000/admin in browser
```

## Success Indicators

✅ **Everything Working When:**
- `python verify_database.py` shows 1000+ questions
- http://localhost:3000 loads without errors
- http://localhost:8000/admin shows test data
- http://localhost:8000/api/tests/ returns JSON data
- All test categories are available in the frontend

❌ **Common Issues:**
- Database not loaded: Run `docker-compose exec backend python manage.py loaddata database_export.json`
- Port conflicts: Check ports 3000/8000/5432 are free
- Docker not running: Start Docker Desktop
- Data missing: Reset with `docker-compose down -v && docker-compose up -d`

---

**Your teammates can now use this prompt to get the complete project with database running! 🎉**
