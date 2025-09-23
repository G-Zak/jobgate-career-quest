# 🗄️ Database Setup Guide for Teammates

## 🚀 Quick Database Setup

### Option 1: Docker (Automatic - Recommended)
```bash
# Clone and start everything (database loads automatically)
git clone https://github.com/G-Zak/jobgate-career-quest.git
cd jobgate-career-quest
docker-compose up -d

# Wait for database to be ready (2-3 minutes)
docker-compose logs -f db
```

### Option 2: Local Development
```bash
# Follow the local setup guide
git clone https://github.com/G-Zak/jobgate-career-quest.git
cd jobgate-career-quest
setup_team_windows.bat  # Windows
./setup_team_skills.sh  # Linux/Mac
```

---

## 📊 What's Included in the Database

### **Complete Test Data**
- **1,200+ Questions** across 8 test categories
- **4,800+ Answer Options** with scoring values
- **Test Sessions** and scoring history
- **User Accounts** and authentication data

### **Test Categories**
1. **Verbal Reasoning Tests (VRT1-VRT5)**
   - Reading Comprehension (21 passages, 63 questions)
   - Verbal Analogies (60 questions)
   - Verbal Classification (60 questions)
   - Coding & Decoding (60 questions)
   - Blood Relations (60 questions)

2. **Numerical Reasoning Tests (NRT1-NRT3)**
   - Basic Arithmetic (60 questions)
   - Data Interpretation (60 questions)
   - Advanced Mathematics (60 questions)

3. **Logical Reasoning Tests (LRT1-LRT3)**
   - Pattern Recognition (60 questions)
   - Logical Sequences (60 questions)
   - Deductive Reasoning (60 questions)

4. **Abstract Reasoning Tests (ART1-ART3)**
   - Abstract Patterns (60 questions)
   - Spatial Relationships (60 questions)
   - Non-verbal Reasoning (60 questions)

5. **Diagrammatic Reasoning Tests (DRT1-DRT3)**
   - Diagram Analysis (60 questions)
   - Flow Charts (60 questions)
   - Process Diagrams (60 questions)

6. **Spatial Reasoning Tests (SRT1-SRT3)**
   - 3D Visualization (60 questions)
   - Spatial Rotation (60 questions)
   - Mental Rotation (60 questions)

7. **Situational Judgment Tests (SJT1-SJT3)**
   - Workplace Scenarios (200 questions)
   - Leadership Situations (200 questions)
   - Team Management (200 questions)

8. **Technical Skills Tests (TST1-TST3)**
   - Programming Concepts (60 questions)
   - System Design (60 questions)
   - Technical Problem Solving (60 questions)

---

## 🔧 Database Configuration

### **Docker Database Settings**
```yaml
# Database Configuration
POSTGRES_DB: careerquest
POSTGRES_USER: jobgate
POSTGRES_PASSWORD: securepass
POSTGRES_INITDB_ARGS: "--encoding=UTF-8 --lc-collate=C --lc-ctype=C"
```

### **Connection Details**
- **Host**: localhost (Docker) or 127.0.0.1 (Local)
- **Port**: 5432
- **Database**: careerquest
- **Username**: jobgate
- **Password**: securepass

---

## 🛠️ Database Management Commands

### **Docker Commands**
```bash
# Check database status
docker-compose ps db

# View database logs
docker-compose logs -f db

# Access database shell
docker-compose exec db psql -U jobgate -d careerquest

# Backup database
docker-compose exec db pg_dump -U jobgate careerquest > backup.sql

# Restore database
docker-compose exec -T db psql -U jobgate -d careerquest < backup.sql

# Reset database (clean slate)
docker-compose down -v
docker-compose up -d
```

### **Django Commands**
```bash
# Run migrations
docker-compose exec backend python manage.py migrate

# Load sample data
docker-compose exec backend python manage.py loaddata database_export.json

# Create superuser
docker-compose exec backend python manage.py createsuperuser

# Access Django shell
docker-compose exec backend python manage.py shell

# Check database connection
docker-compose exec backend python manage.py dbshell
```

---

## 🔍 Verify Database Setup

### **Check Database is Running**
```bash
# Check container status
docker-compose ps

# Check database health
docker-compose exec db pg_isready -U jobgate -d careerquest

# Check database connection
docker-compose exec backend python manage.py dbshell
```

### **Verify Data is Loaded**
```bash
# Check questions count
docker-compose exec backend python manage.py shell -c "
from testsengine.models import Question
print(f'Total questions: {Question.objects.count()}')
"

# Check tests count
docker-compose exec backend python manage.py shell -c "
from testsengine.models import Test
print(f'Total tests: {Test.objects.count()}')
"

# Check test sessions count
docker-compose exec backend python manage.py shell -c "
from testsengine.models import TestSession
print(f'Total test sessions: {TestSession.objects.count()}')
"
```

### **Access Admin Panel**
- **URL**: http://localhost:8000/admin
- **Username**: admin (or create one)
- **Password**: admin (or your chosen password)

---

## 🐛 Database Troubleshooting

### **Database Won't Start**
```bash
# Check Docker is running
docker --version
docker-compose --version

# Check port 5432 is free
netstat -tulpn | grep :5432

# Restart database service
docker-compose restart db

# Check database logs
docker-compose logs db
```

### **Data Not Loading**
```bash
# Check if database_export.json exists
ls -la backend/database_export.json

# Manually load data
docker-compose exec backend python manage.py loaddata database_export.json

# Check for errors
docker-compose logs backend
```

### **Connection Issues**
```bash
# Check database is accessible
docker-compose exec backend python manage.py dbshell

# Test connection from host
psql -h localhost -p 5432 -U jobgate -d careerquest

# Check network connectivity
docker-compose exec backend ping db
```

### **Reset Everything**
```bash
# Stop all services
docker-compose down

# Remove all volumes (WARNING: This deletes all data)
docker-compose down -v

# Start fresh
docker-compose up -d

# Wait for database to initialize
docker-compose logs -f db
```

---

## 📊 Database Schema Overview

### **Key Tables**
- **testsengine_test** - Test definitions
- **testsengine_question** - Questions and answers
- **testsengine_questionoption** - Answer options with scoring
- **testsengine_testsession** - User test sessions
- **testsengine_score** - Test scores and results
- **testsengine_testsubmission** - Test submissions
- **testsengine_testanswer** - Individual answers

### **Data Relationships**
```
Test (1) -> (Many) Questions
Question (1) -> (Many) QuestionOptions
TestSession (1) -> (Many) TestSubmissions
TestSubmission (1) -> (Many) TestAnswers
```

---

## 🎯 Success Indicators

### **✅ Database is Working When:**
- **Container running**: `docker-compose ps` shows db as "Up"
- **Health check passes**: `pg_isready` returns "accepting connections"
- **Data loaded**: Admin panel shows questions and tests
- **API works**: http://localhost:8000/api/tests/ returns test data
- **Frontend works**: http://localhost:3000 loads without errors

### **❌ Common Issues:**
- **Port 5432 in use**: Kill process using the port
- **Docker not running**: Start Docker Desktop
- **Data not loaded**: Run `loaddata` command manually
- **Connection refused**: Check database container status

---

## 🚀 Quick Start Commands

### **One-Line Setup**
```bash
git clone https://github.com/G-Zak/jobgate-career-quest.git && cd jobgate-career-quest && docker-compose up -d
```

### **One-Line Reset**
```bash
docker-compose down -v && docker-compose up -d
```

### **One-Line Status Check**
```bash
docker-compose ps && docker-compose exec db pg_isready -U jobgate -d careerquest
```

---

## 📚 Additional Resources

- **Full Setup Guide**: [TEAM_SETUP_GUIDE.md](TEAM_SETUP_GUIDE.md)
- **Docker Guide**: [DOCKER_SETUP_GUIDE.md](DOCKER_SETUP_GUIDE.md)
- **Quick Start**: [TEAMMATE_QUICK_START.md](TEAMMATE_QUICK_START.md)
- **API Documentation**: http://localhost:8000/api/docs/

---

**🎉 Your database is ready with 1,200+ questions and complete test data!**
