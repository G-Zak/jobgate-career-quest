# ⚡ Quick Start Guide

## 🚀 Get Running in 5 Minutes

### Prerequisites
- Python 3.8+
- Node.js 18+
- PostgreSQL (or use SQLite for testing)

### Windows Users
```bash
# 1. Clone the repository
git clone <repository-url>
cd jobgate-career-quest

# 2. Run the setup script
setup_team_windows.bat

# 3. Start the application
# Terminal 1 - Backend
cd backend
venv\Scripts\activate
python manage.py runserver

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Linux/Mac Users
```bash
# 1. Clone the repository
git clone <repository-url>
cd jobgate-career-quest

# 2. Run the setup script
chmod +x setup_team_skills.sh
./setup_team_skills.sh

# 3. Start the application
# Terminal 1 - Backend
cd backend
source venv/bin/activate
python manage.py runserver

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## 🌐 Access Points
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Admin Panel**: http://localhost:8000/admin

## 🔑 Default Credentials
- **Admin Username**: admin
- **Admin Password**: (set during setup)

## 📚 Full Documentation
For detailed setup instructions, see [TEAM_SETUP_GUIDE.md](TEAM_SETUP_GUIDE.md)

## 🆘 Need Help?
Check the troubleshooting section in the full setup guide or create an issue in the repository.
