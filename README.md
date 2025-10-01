# JobGate - AI-Powered Career Assessment Platform

An intelligent career assessment and job matching platform that leverages AI and machine learning to evaluate candidates' skills across multiple dimensions and provide personalized job recommendations.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)
- [License](#license)
- [Team](#team)

## Overview

JobGate is a comprehensive platform that combines cognitive testing, technical assessments, and behavioral evaluations to create detailed employability profiles. The platform uses AI-powered algorithms to match candidates with suitable career opportunities based on their skills, experience, and test performance.

**Key Capabilities:**
- Multi-dimensional skills assessment (cognitive, technical, situational)
- AI-powered job recommendations using hybrid filtering
- Real-time analytics and performance tracking
- Gamification with XP system and achievements
- Scalable architecture supporting 10,000+ concurrent users

For detailed project information, see [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md).

## Features

### 1. Comprehensive Skills Assessment
- **Cognitive Tests**: Verbal, Numerical, Logical, Abstract, Spatial, and Diagrammatic Reasoning
- **Situational Judgment Tests**: Workplace scenario evaluation and decision-making
- **Technical Assessments**: Programming challenges in Python, JavaScript, Java, C++
- **Multiple Difficulty Levels**: Easy, Medium, Hard, and Expert with coefficient-based scoring

### 2. Employability Scoring System
- **Profile-Based Weighting**: Customized scoring for Software Engineers, Data Scientists, and Product Managers
- **Multi-Dimensional Analysis**: Evaluation across cognitive, technical, analytical, situational, and communication skills
- **0-100 Scale**: Normalized scoring with clear interpretation (Exceptional, Excellent, Good, Fair, Needs Improvement)

### 3. AI-Powered Job Recommendations
- **Hybrid Filtering**: Combines content-based and collaborative filtering
- **Multi-Factor Matching**: Skills (40%), Experience (20%), Technical Tests (15%), Location (15%), Cognitive Skills (35%), Employability (10%)
- **Match Percentage**: Clear indication of job fit with explanation
- **Personalized Suggestions**: Based on test performance and profile

### 4. Interactive Dashboard
- **Real-Time Analytics**: Performance visualization with radar charts and progress tracking
- **Test History**: Complete history with multiple attempt support
- **XP & Leveling System**: 11 levels with achievement badges and rewards
- **Personalized Insights**: Improvement recommendations and next steps

### 5. Job Management
- **Advanced Filtering**: By location, salary, experience level, and required skills
- **Saved Jobs**: Bookmark interesting opportunities
- **Application Tracking**: Monitor application status
- **Job Comparison**: Side-by-side comparison of opportunities

## Technology Stack

### Frontend
- **React 18.2** - Modern component-based UI framework
- **Vite 4.3** - Fast build tool and development server
- **TailwindCSS 3.3** - Utility-first CSS framework
- **Framer Motion 10.12** - Animation library
- **Axios** - HTTP client for API communication
- **Chart.js** - Data visualization
- **React Router** - Client-side routing
- **Zustand** - Lightweight state management

### Backend
- **Python 3.11** - Programming language
- **Django 4.2** - Web framework
- **Django REST Framework 3.14** - RESTful API toolkit
- **PostgreSQL 15** - Relational database
- **Redis** - Caching and session management
- **Celery** - Asynchronous task processing
- **Scikit-learn** - Machine learning algorithms
- **NumPy & Pandas** - Data processing

### DevOps & Tools
- **Docker & Docker Compose** - Containerization
- **Nginx** - Reverse proxy and load balancing
- **Git & GitHub** - Version control
- **DRF Spectacular** - API documentation (Swagger/OpenAPI)
- **JWT** - Authentication tokens

## Prerequisites

### Required Software
- **Docker Desktop** (recommended) - [Download](https://www.docker.com/products/docker-desktop/)
  - Includes Docker Compose
  - Windows 10/11, macOS, or Linux
- **Git** - [Download](https://git-scm.com/downloads)

### For Local Development (without Docker)
- **Python 3.11+** - [Download](https://www.python.org/downloads/)
- **Node.js 18+** - [Download](https://nodejs.org/)
- **PostgreSQL 15+** - [Download](https://www.postgresql.org/download/)
- **Redis** (optional) - [Download](https://redis.io/download/)

### System Requirements
- **RAM**: 4GB minimum, 8GB recommended
- **Disk Space**: 2GB free space
- **Ports**: 3000 (frontend), 8000 (backend), 5432 (database)

## Quick Start

### Using Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/G-Zak/jobgate-career-quest.git
   cd jobgate-career-quest
   ```

2. **Start all services**
   ```bash
   docker-compose up -d
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/api/schema/swagger-ui/
   - Admin Panel: http://localhost:8000/admin

4. **Create a superuser (optional)**
   ```bash
   docker-compose exec backend python manage.py createsuperuser
   ```

That's it! The application is now running.

## Installation

### Option 1: Docker Setup (Recommended)

Docker setup is the easiest and most reliable way to run the application.

1. **Clone the repository**
   ```bash
   git clone https://github.com/G-Zak/jobgate-career-quest.git
   cd jobgate-career-quest
   ```

2. **Start with Docker Compose**
   ```bash
   docker-compose up -d
   ```

   This will:
   - Build frontend and backend containers
   - Start PostgreSQL database
   - Run database migrations
   - Start all services

3. **Verify services are running**
   ```bash
   docker-compose ps
   ```

### Option 2: Local Development Setup

For local development without Docker:

#### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv

   # Activate (Windows)
   venv\Scripts\activate

   # Activate (Linux/Mac)
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure database**
   - Create PostgreSQL database named `careerquest`
   - Update `backend/careerquest/settings.py` with your database credentials

5. **Run migrations**
   ```bash
   python manage.py migrate
   ```

6. **Create superuser**
   ```bash
   python manage.py createsuperuser
   ```

7. **Start backend server**
   ```bash
   python manage.py runserver
   ```

#### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

## Configuration

### Environment Variables

#### Backend (.env)

Create a `.env` file in the `backend/` directory:

```env
# Database Configuration
DATABASE_URL=postgres://jobgate:securepass@db:5432/careerquest
# For local: DATABASE_URL=postgres://username:password@localhost:5432/careerquest

# Django Settings
SECRET_KEY=your-secret-key-here-change-in-production
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Environment
ENV=development

# Redis (optional)
REDIS_URL=redis://localhost:6379/0

# Email Configuration (optional)
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
```

#### Frontend (.env)

Create a `.env` file in the `frontend/` directory:

```env
# API Configuration
VITE_API_URL=http://localhost:8000

# Environment
VITE_ENV=development
```

### Database Setup

#### Using Docker
Database is automatically created and configured when using Docker Compose.

#### Manual Setup
```sql
-- Create database
CREATE DATABASE careerquest;

-- Create user
CREATE USER jobgate WITH PASSWORD 'securepass';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE careerquest TO jobgate;
```

## Running the Application

### Using Docker

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild after code changes
docker-compose up --build -d

# Restart specific service
docker-compose restart backend
docker-compose restart frontend
```

### Using Local Development

```bash
# Terminal 1: Backend
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
python manage.py runserver

# Terminal 2: Frontend
cd frontend
npm run dev
```

### Development Commands

#### Docker Commands

```bash
# View container status
docker-compose ps

# View logs for specific service
docker-compose logs backend
docker-compose logs frontend
docker-compose logs db

# Execute commands in containers
docker-compose exec backend python manage.py migrate
docker-compose exec backend python manage.py createsuperuser
docker-compose exec backend python manage.py shell

# Access database
docker-compose exec db psql -U jobgate -d careerquest

# Rebuild specific service
docker-compose build backend
docker-compose build frontend
```

#### Django Management Commands

```bash
# Run migrations
python manage.py migrate

# Create migrations
python manage.py makemigrations

# Create superuser
python manage.py createsuperuser

# Collect static files
python manage.py collectstatic

# Run tests
python manage.py test

# Django shell
python manage.py shell

# Load test data (if available)
python manage.py loaddata fixtures/test_data.json
```

## API Documentation

The API is fully documented using DRF Spectacular (Swagger/OpenAPI):

- **Swagger UI**: http://localhost:8000/api/schema/swagger-ui/
- **ReDoc**: http://localhost:8000/api/schema/redoc/
- **OpenAPI Schema**: http://localhost:8000/api/schema/

### Key API Endpoints

#### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/token/refresh/` - Refresh access token
- `POST /api/auth/logout/` - User logout

#### Tests
- `GET /api/tests/` - List available tests
- `GET /api/tests/{id}/questions/` - Get test questions
- `POST /api/tests/submit/` - Submit test answers
- `GET /api/tests/history/` - Get test history

#### User Profile
- `GET /api/users/profile/` - Get user profile
- `PUT /api/users/profile/` - Update user profile
- `GET /api/users/employability-score/` - Get employability score

#### Job Recommendations
- `GET /api/jobs/recommendations/` - Get personalized job recommendations
- `GET /api/jobs/` - List all jobs with filtering
- `POST /api/jobs/{id}/save/` - Save a job
- `GET /api/jobs/saved/` - Get saved jobs

#### Dashboard
- `GET /api/dashboard/stats/` - Get dashboard statistics
- `GET /api/dashboard/recent-tests/` - Get recent test sessions
- `GET /api/dashboard/skill-breakdown/` - Get skill category breakdown

## Testing

### Backend Tests

```bash
# Using Docker
docker-compose exec backend python manage.py test

# Run specific app tests
docker-compose exec backend python manage.py test testsengine
docker-compose exec backend python manage.py test recommendation

# Run with coverage
docker-compose exec backend coverage run --source='.' manage.py test
docker-compose exec backend coverage report

# Local development
cd backend
python manage.py test
```

### Frontend Tests

```bash
# Using Docker
docker-compose exec frontend npm test

# Run with coverage
docker-compose exec frontend npm run test:coverage

# Local development
cd frontend
npm test
```

## Deployment

### Production Deployment with Docker

1. **Update environment variables**
   ```bash
   # backend/.env
   DEBUG=False
   ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
   SECRET_KEY=your-production-secret-key
   DATABASE_URL=postgres://user:pass@production-db:5432/careerquest
   ```

2. **Build production images**
   ```bash
   docker-compose -f docker-compose.prod.yml build
   ```

3. **Run migrations**
   ```bash
   docker-compose -f docker-compose.prod.yml run backend python manage.py migrate
   ```

4. **Collect static files**
   ```bash
   docker-compose -f docker-compose.prod.yml run backend python manage.py collectstatic --noinput
   ```

5. **Start services**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

### Deployment Checklist

- [ ] Set `DEBUG=False` in production
- [ ] Use strong `SECRET_KEY`
- [ ] Configure `ALLOWED_HOSTS`
- [ ] Set up SSL/TLS certificates
- [ ] Configure production database
- [ ] Set up Redis for caching
- [ ] Configure email backend
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy
- [ ] Set up CI/CD pipeline
- [ ] Configure CORS settings
- [ ] Enable security headers

### Recommended Hosting Platforms

- **AWS**: EC2, RDS, S3, CloudFront
- **Google Cloud**: Compute Engine, Cloud SQL, Cloud Storage
- **DigitalOcean**: Droplets, Managed Databases
- **Heroku**: Easy deployment with add-ons
- **Railway**: Modern deployment platform

## Project Structure

```
jobgate-career-quest/
├── backend/                    # Django REST API
│   ├── accounts/              # User authentication and profiles
│   ├── badges/                # Achievement and gamification system
│   ├── careerquest/           # Main Django project settings
│   ├── dashboard/             # Analytics and reporting
│   ├── recommendation/        # AI recommendation engine
│   ├── skills/                # Skill definitions and management
│   ├── testsengine/           # Test engine and scoring
│   ├── manage.py              # Django management script
│   ├── requirements.txt       # Python dependencies
│   └── Dockerfile             # Backend container configuration
│
├── frontend/                  # React application
│   ├── public/                # Static assets
│   ├── src/
│   │   ├── components/        # Reusable React components
│   │   ├── features/          # Feature-specific components
│   │   │   ├── auth/          # Authentication
│   │   │   ├── dashboard/     # Dashboard
│   │   │   ├── jobs/          # Job recommendations
│   │   │   └── tests/         # Test taking interface
│   │   ├── hooks/             # Custom React hooks
│   │   ├── services/          # API service layer
│   │   ├── utils/             # Utility functions
│   │   ├── App.jsx            # Main App component
│   │   └── main.jsx           # Entry point
│   ├── package.json           # Node.js dependencies
│   ├── vite.config.js         # Vite configuration
│   └── Dockerfile             # Frontend container configuration
│
├── docs/                      # Documentation
│   ├── BRANCHING_STRATEGY.md  # Git workflow
│   ├── COMPONENT-MAP.md       # Component documentation
│   └── TESTS_DATABASE.md      # Test data documentation
│
├── docker-compose.yaml        # Multi-container orchestration
├── .gitignore                 # Git ignore rules
├── README.md                  # This file
├── PROJECT_OVERVIEW.md        # Detailed project overview
├── CHANGELOG.md               # Version history
├── TROUBLESHOOTING.md         # Common issues and solutions
└── LICENSE                    # MIT License
```

### Django Apps

| App | Purpose |
|-----|---------|
| **accounts** | User authentication, registration, and profile management |
| **skills** | Skill definitions, categories, and user skill tracking |
| **testsengine** | Test creation, question management, test sessions, scoring |
| **badges** | Achievement system, badges, XP tracking, gamification |
| **recommendation** | Job recommendation engine, clustering, matching algorithms |
| **dashboard** | Analytics, statistics, progress tracking, reporting |

## Contributing

We welcome contributions to JobGate! Here's how you can help:

### Getting Started

1. **Fork the repository**
   ```bash
   git clone https://github.com/your-username/jobgate-career-quest.git
   cd jobgate-career-quest
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make your changes**
   - Write clean, readable code
   - Follow existing code style
   - Add tests for new features
   - Update documentation as needed

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "Add amazing feature"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```

6. **Open a Pull Request**
   - Provide a clear description of changes
   - Reference any related issues
   - Ensure all tests pass

### Code Style Guidelines

**Python (Backend)**
- Follow PEP 8 style guide
- Use meaningful variable and function names
- Write docstrings for functions and classes
- Keep functions small and focused
- Use type hints where appropriate

**JavaScript/React (Frontend)**
- Follow ESLint configuration
- Use functional components with hooks
- Keep components small and reusable
- Use meaningful prop names
- Write JSDoc comments for complex functions

### Commit Message Format

```
type(scope): subject

body (optional)

footer (optional)
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Example:**
```
feat(tests): add abstract reasoning test type

Implemented new abstract reasoning test with pattern recognition
questions. Includes scoring algorithm and UI components.

Closes #123
```

## Troubleshooting

### Common Issues

#### Docker Issues

**Problem: Containers won't start**
```bash
# Check container status
docker-compose ps

# View logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs db

# Restart services
docker-compose restart
```

**Problem: Port already in use**
```bash
# Check what's using the port (Linux/Mac)
lsof -i :3000
lsof -i :8000

# Check what's using the port (Windows)
netstat -ano | findstr :3000
netstat -ano | findstr :8000

# Kill the process or change ports in docker-compose.yaml
```

**Problem: Database connection errors**
```bash
# Ensure database container is healthy
docker-compose ps db

# Check database logs
docker-compose logs db

# Restart database
docker-compose restart db

# Reset database (WARNING: deletes all data)
docker-compose down -v
docker-compose up -d
```

#### Backend Issues

**Problem: Module not found errors**
```bash
# Rebuild backend container
docker-compose build backend
docker-compose up -d backend

# Or reinstall dependencies locally
cd backend
pip install -r requirements.txt
```

**Problem: Migration errors**
```bash
# Check migration status
docker-compose exec backend python manage.py showmigrations

# Run migrations
docker-compose exec backend python manage.py migrate

# If migrations are conflicted, reset (WARNING: deletes data)
docker-compose exec backend python manage.py migrate --fake
```

#### Frontend Issues

**Problem: npm install fails**
```bash
# Clear npm cache
docker-compose exec frontend npm cache clean --force

# Rebuild frontend
docker-compose build frontend --no-cache
docker-compose up -d frontend
```

**Problem: API connection errors**
```bash
# Check VITE_API_URL in frontend/.env
# Should be: VITE_API_URL=http://localhost:8000

# Verify backend is running
curl http://localhost:8000/api/

# Check CORS settings in backend/careerquest/settings.py
```

For more detailed troubleshooting, see [TROUBLESHOOTING.md](./TROUBLESHOOTING.md).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### MIT License Summary

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software.

## Team

### Development Team
- **Zakaria Guennani** - Lead Full-Stack Developer - [GitHub](https://github.com/G-Zak)
- **Aymane Bouras** - Full-Stack Developer
- **Yassine Mchereg** - Full-Stack Developer

### Organization
**EMSI (École Marocaine des Sciences de l'Ingénieur)**
- Educational institution supporting the project
- Provided academic guidance and resources

### Company
**JobGate**
- Host company for internship project
- Provided business requirements and mentorship

### Project Information
- **Type**: Internship Project
- **Duration**: July - September 2025
- **Status**: Production Ready
- **Version**: 1.0.0

## Acknowledgments

- Django and Django REST Framework communities
- React and Vite communities
- Scikit-learn for machine learning capabilities
- All open-source contributors whose libraries made this project possible

## Links

- **Repository**: https://github.com/G-Zak/jobgate-career-quest
- **Documentation**: [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md)
- **Issue Tracker**: https://github.com/G-Zak/jobgate-career-quest/issues
- **Changelog**: [CHANGELOG.md](CHANGELOG.md)

---

**Last Updated**: September 2025
**Status**: ✅ Production Ready
**Version**: 1.0.0

---

*For detailed project information, architecture, and technical achievements, see [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md)*
