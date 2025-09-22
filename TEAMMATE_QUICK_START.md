# 👥 Teammate Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Prerequisites
- **Git** - [Download here](https://git-scm.com/downloads)
- **Docker Desktop** - [Download here](https://www.docker.com/products/docker-desktop/) (Recommended)
- **OR** Python 3.8+ and Node.js 18+ (Alternative)

---

## 🐳 Option 1: Docker Setup (Recommended)

### Step 1: Clone the Repository
```bash
git clone https://github.com/G-Zak/jobgate-career-quest.git
cd jobgate-career-quest
```

### Step 2: Start Everything
```bash
# Windows
setup_docker_windows.bat

# OR manually
docker-compose up -d
```

### Step 3: Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Admin Panel**: http://localhost:8000/admin

**That's it! 🎉**

---

## 💻 Option 2: Local Development Setup

### Step 1: Clone the Repository
```bash
git clone https://github.com/G-Zak/jobgate-career-quest.git
cd jobgate-career-quest
```

### Step 2: Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Load sample data
python manage.py loaddata database_export.json

# Create admin user
python manage.py createsuperuser

# Start backend server
python manage.py runserver
```

### Step 3: Frontend Setup (New Terminal)
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Step 4: Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Admin Panel**: http://localhost:8000/admin

---

## 🎯 What You'll See

### Frontend Features
- **Dashboard** - Overview of all available tests
- **8 Test Categories** - Verbal, Numerical, Logical, Abstract, Diagrammatic, Spatial, Situational, Technical
- **Test History** - Track your progress and scores
- **Real-time Scoring** - Immediate feedback after tests
- **Responsive Design** - Works on all devices

### Backend Features
- **REST API** - All endpoints documented
- **Admin Panel** - Database management
- **Health Checks** - Service monitoring
- **Complete Database** - 1,200+ questions and answers

---

## 🛠️ Development Commands

### Docker Commands
```bash
# View logs
docker-compose logs -f

# Stop everything
docker-compose down

# Restart a service
docker-compose restart backend

# Access backend shell
docker-compose exec backend python manage.py shell

# Access database
docker-compose exec db psql -U jobgate -d careerquest
```

### Local Development Commands
```bash
# Backend
python manage.py runserver
python manage.py migrate
python manage.py shell

# Frontend
npm run dev
npm install
```

---

## 🐛 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Check what's using ports
netstat -tulpn | grep :3000
netstat -tulpn | grep :8000

# Kill processes (Windows)
taskkill /PID <PID> /F

# Kill processes (Linux/Mac)
sudo kill -9 <PID>
```

#### Docker Issues
```bash
# Check Docker is running
docker --version
docker-compose --version

# Restart Docker Desktop if needed
# Check container status
docker-compose ps
```

#### Database Issues
```bash
# Reset database (Docker)
docker-compose down -v
docker-compose up -d

# Reset database (Local)
python manage.py flush
python manage.py loaddata database_export.json
```

---

## 📚 Documentation

- **Full Setup Guide**: [TEAM_SETUP_GUIDE.md](TEAM_SETUP_GUIDE.md)
- **Docker Guide**: [DOCKER_SETUP_GUIDE.md](DOCKER_SETUP_GUIDE.md)
- **Project Status**: [PROJECT_STATUS.md](PROJECT_STATUS.md)
- **API Documentation**: http://localhost:8000/api/docs/

---

## 🆘 Need Help?

### Quick Checks
1. **Docker running?** - Check Docker Desktop is started
2. **Ports free?** - Check 3000 and 8000 are available
3. **Dependencies installed?** - Run setup scripts
4. **Database loaded?** - Check admin panel works

### Getting Support
1. **Check logs** - `docker-compose logs -f` or `python manage.py runserver`
2. **Restart services** - `docker-compose restart` or restart terminals
3. **Ask team** - Use project communication channels
4. **Check issues** - Look at project issue tracker

---

## 🎉 Success!

Once you see the application running at http://localhost:3000, you're all set!

### Next Steps
1. **Explore the tests** - Try different test categories
2. **Check the admin panel** - http://localhost:8000/admin
3. **Review the code** - Familiarize yourself with the structure
4. **Start developing** - Make your first changes

**Happy coding! 🚀**