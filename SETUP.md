# Development Setup Guide

## Initial Setup (One-time)

### 1. System Requirements
- Docker Desktop (latest version)
- Git
- Code editor (VS Code recommended)

### 2. Clone and Start
```bash
git clone https://github.com/G-Zak/jobgate-career-quest.git
cd jobgate-career-quest
docker-compose up -d
```

### 3. Verify Installation
```bash
# Check all containers are running
docker-compose ps

# Test services
curl http://localhost:3000  # Should return 200
curl http://localhost:8000  # Should return 200
```

### 4. Setup Django Backend
```bash
# Create database tables
docker-compose exec backend python manage.py migrate

# Create admin user (optional)
docker-compose exec backend python manage.py createsuperuser

# Collect static files (if needed)
docker-compose exec backend python manage.py collectstatic --noinput
```

## Daily Development Workflow

### Starting Development
```bash
# Start all services
docker-compose up -d

# Watch logs (optional)
docker-compose logs -f
```

### Making Changes

#### Backend Changes (Python/Django)
```bash
# After modifying Python code, Django auto-reloads
# For new dependencies:
# 1. Add to backend/requirements.txt
# 2. Rebuild container:
docker-compose build backend
docker-compose up -d
```

#### Frontend Changes (React/JavaScript)
```bash
# Vite auto-reloads on file changes
# For new dependencies:
# 1. Add to frontend/package.json
# 2. Rebuild container:
docker-compose build frontend
docker-compose up -d
```

#### Database Changes
```bash
# Create new migration
docker-compose exec backend python manage.py makemigrations

# Apply migrations
docker-compose exec backend python manage.py migrate
```

### Testing Your Changes
```bash
# Backend tests
docker-compose exec backend python manage.py test

# Check API endpoints
curl http://localhost:8000/api/endpoint-name/

# Frontend in browser
open http://localhost:3000
```

### Stopping Development
```bash
# Stop all services
docker-compose down

# Stop and remove volumes (clean slate)
docker-compose down -v
```

## Code Organization

### Backend Structure
```
backend/
├── accounts/          # User authentication & profiles
├── badges/           # Achievements & gamification
├── careerquest/      # Main Django settings
├── dashboard/        # Analytics & reporting
├── recommendation/   # AI recommendations
├── skills/          # Skill definitions
├── testsengine/     # Assessment engine
├── manage.py        # Django management
└── requirements.txt # Python dependencies
```

### Frontend Structure
```
frontend/
├── src/
│   ├── components/   # Reusable UI components
│   ├── pages/       # Page components
│   ├── hooks/       # Custom React hooks
│   ├── api/         # API client functions
│   ├── assets/      # Images, icons, etc.
│   └── game/        # Game-specific components
├── public/          # Static assets
└── package.json     # Node.js dependencies
```

## Environment Configuration

### Development Environment Variables

#### Backend (.env - optional)
```env
DEBUG=True
SECRET_KEY=dev-secret-key
DATABASE_URL=postgres://jobgate:securepass@db:5432/careerquest
ALLOWED_HOSTS=localhost,127.0.0.1
```

#### Frontend (.env - optional)
```env
VITE_API_URL=http://localhost:8000
VITE_ENV=development
```

## Database Management

### Accessing PostgreSQL
```bash
# Connect to database
docker-compose exec db psql -U jobgate -d careerquest

# Backup database
docker-compose exec db pg_dump -U jobgate careerquest > backup.sql

# Restore database
docker-compose exec -T db psql -U jobgate careerquest < backup.sql
```

### Common Django Commands
```bash
# Interactive shell
docker-compose exec backend python manage.py shell

# Django admin
open http://localhost:8000/admin

# Create app
docker-compose exec backend python manage.py startapp newapp

# Reset migrations (careful!)
docker-compose exec backend find . -path "*/migrations/*.py" -not -name "__init__.py" -delete
docker-compose exec backend python manage.py makemigrations
```

## API Development

### Testing API Endpoints
```bash
# Using curl
curl -X GET http://localhost:8000/api/skills/
curl -X POST http://localhost:8000/api/accounts/register/ \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"testpass123"}'

# View API documentation
open http://localhost:8000/api/schema/swagger-ui/
```

### Adding New API Endpoints
1. Create serializers in `serializers.py`
2. Create views in `views.py`
3. Add URLs in `urls.py`
4. Test with API documentation

## Common Development Tasks

### Adding a New Feature
1. Create/modify Django models (backend)
2. Create migrations: `python manage.py makemigrations`
3. Apply migrations: `python manage.py migrate`
4. Create API serializers and views
5. Add API URLs
6. Create React components (frontend)
7. Connect frontend to API
8. Test integration

### Debugging
```bash
# View container logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs db

# Access container shell
docker-compose exec backend bash
docker-compose exec frontend sh

# Django debug
# Add breakpoint: import pdb; pdb.set_trace()
```

## Performance Tips

### Development Optimization
- Use Docker volume mounts for hot reloading
- Enable Django debug toolbar (in development)
- Use React DevTools browser extension
- Monitor container resource usage

### Database Optimization
```bash
# View slow queries (Django)
# Add to settings.py:
LOGGING = {
    'version': 1,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        'django.db.backends': {
            'level': 'DEBUG',
            'handlers': ['console'],
        },
    },
}
```

## Deployment Preparation

### Before Production
1. Set `DEBUG=False` in Django settings
2. Configure proper `ALLOWED_HOSTS`
3. Use environment variables for secrets
4. Set up proper logging
5. Configure static file serving
6. Run security checks: `python manage.py check --deploy`

### Build for Production
```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Frontend production build
docker-compose exec frontend npm run build
```

---

**Need Help?**
- Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for common issues
- Review Django/React documentation
- Check container logs for errors
