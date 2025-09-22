# 🚀 Complete Team Setup Guide - JobGate Career Quest

## 📋 Prerequisites

### Required Software
- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **Python** (v3.8 or higher) - [Download here](https://www.python.org/downloads/)
- **Git** - [Download here](https://git-scm.com/downloads)
- **PostgreSQL** (v13 or higher) - [Download here](https://www.postgresql.org/download/windows/)

### Optional (Recommended)
- **Visual Studio Code** - [Download here](https://code.visualstudio.com/)
- **Postman** (for API testing) - [Download here](https://www.postman.com/downloads/)

## 🗂️ Project Structure
```
jobgate-career-quest/
├── frontend/          # React.js frontend
├── backend/           # Django backend
├── docs/             # Documentation
├── exports/          # Database exports
└── scripts/          # Setup scripts
```

## 🚀 Quick Start Options

### Option 1: Docker Setup (Recommended for Teams)

#### Prerequisites
- **Docker Desktop** - [Download for Windows](https://www.docker.com/products/docker-desktop/)

#### Step 1: Clone and Start
```bash
# Clone the repository
git clone <repository-url>
cd jobgate-career-quest

# Run Docker setup script
setup_docker_windows.bat

# Or manually with Docker Compose
docker-compose up -d
```

#### Step 2: Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Admin Panel**: http://localhost:8000/admin

### Option 2: Local Development Setup

#### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd jobgate-career-quest
```

#### Step 2: Backend Setup
```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment (Windows)
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
copy .env.example .env
# Edit .env with your database credentials

# Run migrations
python manage.py migrate

# Load sample data
python manage.py loaddata database_export.json

# Create superuser (optional)
python manage.py createsuperuser

# Start backend server
python manage.py runserver
```

#### Step 3: Frontend Setup
```bash
# Open new terminal, navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

#### Step 4: Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Admin Panel**: http://localhost:8000/admin

## 🗄️ Database Setup

### Option 1: Use Provided Database Export (Recommended)
The project includes a complete database export with all test data:
```bash
cd backend
python manage.py loaddata database_export.json
```

### Option 2: Fresh Database Setup
```bash
cd backend
python manage.py migrate
python manage.py populate_technical_tests
python manage.py create_sample_data
```

## 🔧 Configuration

### Backend Configuration (.env)
```env
DEBUG=True
SECRET_KEY=your-secret-key-here
DATABASE_URL=postgresql://username:password@localhost:5432/jobgate_db
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

### Frontend Configuration
The frontend is pre-configured to work with the backend. No additional setup required.

## 🧪 Available Tests

### Test Categories
1. **Verbal Reasoning Tests (VRT1-VRT5)**
   - Reading Comprehension
   - Analogies
   - Classification
   - Coding & Decoding
   - Blood Relations

2. **Numerical Reasoning Tests (NRT1-NRT3)**
   - Basic Arithmetic
   - Data Interpretation
   - Advanced Calculations

3. **Logical Reasoning Tests (LRT1-LRT3)**
   - Pattern Recognition
   - Sequence Analysis
   - Logical Puzzles

4. **Abstract Reasoning Tests (ART1-ART3)**
   - Shape Patterns
   - Abstract Sequences
   - Visual Logic

5. **Diagrammatic Reasoning Tests (DRT1-DRT3)**
   - Diagram Analysis
   - Visual Patterns
   - Flow Charts

6. **Spatial Reasoning Tests (SRT1-SRT3)**
   - 3D Visualization
   - Spatial Relationships
   - Mental Rotation

7. **Situational Judgment Tests (SJT1-SJT3)**
   - Workplace Scenarios
   - Decision Making
   - Professional Judgment

8. **Technical Assessment Tests (TAT1-TAT3)**
   - Programming Concepts
   - Technical Knowledge
   - Problem Solving

## 📊 Features

### For Test Takers
- **Test History**: Track all completed tests
- **Real-time Scoring**: Immediate feedback after tests
- **Progress Analytics**: Charts and statistics
- **Retake Tests**: Multiple attempts with different questions
- **Responsive Design**: Works on all devices

### For Administrators
- **Django Admin**: Full database management
- **Test Management**: Add/edit questions and tests
- **User Management**: Monitor user progress
- **Analytics Dashboard**: Comprehensive reporting

## 🛠️ Development

### Backend Development
```bash
cd backend
# Activate virtual environment
venv\Scripts\activate

# Run tests
python manage.py test

# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Start development server
python manage.py runserver
```

### Frontend Development
```bash
cd frontend
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🐛 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Kill process using port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Kill process using port 8000
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

#### Database Connection Issues
1. Ensure PostgreSQL is running
2. Check database credentials in .env
3. Verify database exists
4. Run migrations: `python manage.py migrate`

#### Node.js Issues
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rmdir /s node_modules
npm install
```

#### Python Virtual Environment Issues
```bash
# Deactivate current environment
deactivate

# Remove and recreate virtual environment
rmdir /s venv
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

## 📁 Important Files

### Database Files
- `backend/database_export.json` - Complete database with all test data
- `backend/db.sqlite3` - SQLite database (fallback)

### Configuration Files
- `backend/.env` - Backend environment variables
- `frontend/package.json` - Frontend dependencies
- `backend/requirements.txt` - Backend dependencies

### Setup Scripts
- `setup_team_skills.bat` - Windows setup script
- `setup_team_skills.sh` - Linux/Mac setup script

## 🔐 Default Credentials

### Django Admin
- **Username**: admin
- **Password**: admin123
- **URL**: http://localhost:8000/admin

### Test User
- **Username**: testuser
- **Password**: testpass123

## 📞 Support

### Team Communication
- Use the project's issue tracker for bugs
- Create feature requests for new functionality
- Document any issues you encounter

### Development Guidelines
1. Always pull latest changes before starting work
2. Create feature branches for new development
3. Test thoroughly before pushing changes
4. Update documentation when adding features

## 🚀 Deployment

### Production Setup
1. Set `DEBUG=False` in backend/.env
2. Configure production database
3. Set up proper CORS settings
4. Use production web server (nginx/Apache)
5. Build frontend: `npm run build`

### Environment Variables (Production)
```env
DEBUG=False
SECRET_KEY=your-production-secret-key
DATABASE_URL=postgresql://user:pass@host:port/db
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
CORS_ALLOWED_ORIGINS=https://yourdomain.com
```

## 📈 Project Status

### ✅ Completed Features
- Complete test system with 8 categories
- Real-time scoring and feedback
- Test history and analytics
- Responsive design
- Database integration
- Admin panel

### 🔄 In Progress
- Advanced analytics
- User management improvements
- Performance optimizations

### 📋 Future Features
- Mobile app
- Advanced reporting
- Integration with HR systems
- Multi-language support

---

## 🎯 Quick Commands Reference

```bash
# Start everything
cd backend && venv\Scripts\activate && python manage.py runserver &
cd frontend && npm run dev

# Stop everything
# Press Ctrl+C in both terminals

# Reset database
cd backend
python manage.py flush
python manage.py loaddata database_export.json

# Update dependencies
cd backend && pip install -r requirements.txt
cd frontend && npm install
```

**Happy Coding! 🚀**
