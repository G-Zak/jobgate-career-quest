# 🗄️ Database Setup Guide for Teammates

This guide explains how to set up the database using the exported JSON file from the main branch.

## 📋 Prerequisites

- Docker Desktop installed and running
- Git installed
- Basic terminal/command prompt knowledge

## 🚀 Quick Setup (Recommended)

### Step 1: Clone the Repository
```bash
git clone https://github.com/G-Zak/jobgate-career-quest.git
cd jobgate-career-quest
```

### Step 2: Switch to the Feature Branch
```bash
git checkout feature/database_integration
```

### Step 3: Start the Project with Database
```bash
# Windows
setup_database_windows.bat

# Linux/Mac
./setup_database.sh

# OR manually
docker-compose up -d
```

### Step 4: Verify Database Setup
```bash
python verify_database.py
```

**That's it! 🎉** The database should now be loaded with all the test data.

---

## 🔧 Manual Database Setup (If Needed)

If the automated setup doesn't work, follow these manual steps:

### Step 1: Start Docker Services
```bash
docker-compose up -d
```

### Step 2: Wait for Database to be Ready
```bash
# Check if database is healthy
docker-compose ps

# Watch database logs
docker-compose logs -f db
```
Wait until you see `jobgate_db` status as `healthy`.

### Step 3: Run Django Migrations
```bash
docker-compose exec backend python manage.py migrate
```

### Step 4: Load the Database Data
```bash
# Load the exported data
docker-compose exec backend python manage.py loaddata database_export.json
```

### Step 5: Create Admin User (Optional)
```bash
docker-compose exec backend python manage.py createsuperuser
```

### Step 6: Verify Data is Loaded
```bash
python verify_database.py
```

---

## 📊 What's Included in the Database

The `database_export.json` file contains:

### **Test Data**
- **8 Test Categories**: Verbal, Numerical, Logical, Abstract, Diagrammatic, Spatial, Situational, Technical
- **1,200+ Questions**: Across all test categories with proper answers
- **Answer Options**: Multiple choice options with scoring values
- **Test Sessions**: Sample historical test attempts

### **Test Categories Breakdown**
- **Verbal Reasoning (VRT1-VRT5)**: ~300+ questions
- **Numerical Reasoning (NRT1-NRT3)**: ~180+ questions  
- **Logical Reasoning (LRT1-LRT3)**: ~180+ questions
- **Abstract Reasoning (ART1-ART3)**: ~180+ questions
- **Diagrammatic Reasoning (DRT1-DRT3)**: ~180+ questions
- **Spatial Reasoning (SRT1-SRT3)**: ~180+ questions
- **Situational Judgment (SJT1-SJT3)**: ~600+ questions
- **Technical Skills (TST1-TST3)**: ~180+ questions

---

## 🔍 Verification Steps

### 1. Check Database Connection
```bash
python verify_database.py
```
Expected output:
```
--- Database Verification Script ---

1. Checking database connection...
   ✅ Database connected successfully.

2. Checking data integrity...
   - Total Questions found: 1200+
   - Total Tests found: 8+
   - Total Test Sessions found: 50+

   ✅ Initial data (questions, tests) appears to be loaded.
```

### 2. Access Django Admin
- Open: http://localhost:8000/admin
- Login with superuser credentials
- Navigate to `Testsengine` → `Questions`
- You should see 1,200+ questions listed

### 3. Test API Endpoints
```bash
# Test the API
curl http://localhost:8000/api/tests/
curl http://localhost:8000/api/tests/1/questions/
```

---

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Check if Docker is running
docker ps

# Check database logs
docker-compose logs db

# Restart database
docker-compose restart db
```

### Data Loading Issues
```bash
# Check if database_export.json exists
ls -la database_export.json

# Clear database and reload
docker-compose exec backend python manage.py flush --no-input
docker-compose exec backend python manage.py loaddata database_export.json
```

### Port Conflicts
```bash
# Check what's using port 3000
lsof -i :3000

# Kill process using port 3000
kill -9 <PID>

# Or use different port
docker-compose up -d
```

---

## 📱 Access the Application

Once everything is set up:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Admin Panel**: http://localhost:8000/admin

---

## 🎯 What You'll See

### Frontend Features
- **Employability Score Dashboard**: Complete career readiness assessment
- **Test Categories**: All 8 test types with questions loaded from database
- **Test History**: Track your progress and scores
- **Job Recommendations**: Based on your employability score
- **Career Analytics**: Radar charts and performance breakdowns

### Backend Features
- **REST API**: Full CRUD operations for tests and results
- **Database**: PostgreSQL with 1,200+ questions
- **Admin Panel**: Manage tests, questions, and user data
- **Scoring System**: Automated test scoring and analysis

---

## 🆘 Need Help?

If you encounter any issues:

1. **Check the logs**: `docker-compose logs -f`
2. **Verify database**: `python verify_database.py`
3. **Restart services**: `docker-compose restart`
4. **Contact the team lead** with specific error messages

---

## 📝 Quick Commands Reference

```bash
# Start everything
docker-compose up -d

# Stop everything
docker-compose down

# View logs
docker-compose logs -f

# Check status
docker-compose ps

# Access backend shell
docker-compose exec backend python manage.py shell

# Run migrations
docker-compose exec backend python manage.py migrate

# Load data
docker-compose exec backend python manage.py loaddata database_export.json

# Create superuser
docker-compose exec backend python manage.py createsuperuser

# Verify setup
python verify_database.py
```

**Happy coding! 🚀**
