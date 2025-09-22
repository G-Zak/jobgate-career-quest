# 🐳 Docker Setup Guide - JobGate Career Quest

## 📋 Prerequisites

### Required Software
- **Docker Desktop** - [Download for Windows](https://www.docker.com/products/docker-desktop/)
- **Docker Compose** - Included with Docker Desktop
- **Git** - [Download here](https://git-scm.com/downloads)

### System Requirements
- **RAM**: 4GB minimum, 8GB recommended
- **Disk Space**: 2GB free space
- **OS**: Windows 10/11, macOS, or Linux

## 🚀 Quick Start with Docker

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd jobgate-career-quest
```

### Step 2: Start with Docker Compose
```bash
# Start all services
docker-compose up -d

# Or with build (if you made changes)
docker-compose up --build -d
```

### Step 3: Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Admin Panel**: http://localhost:8000/admin
- **Database**: localhost:5432

## 🐳 Docker Commands Reference

### Basic Commands
```bash
# Start all services
docker-compose up -d

# Start with build
docker-compose up --build -d

# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: deletes data)
docker-compose down -v

# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

### Development Commands
```bash
# Rebuild specific service
docker-compose build backend
docker-compose build frontend

# Restart specific service
docker-compose restart backend
docker-compose restart frontend

# Execute commands in running container
docker-compose exec backend python manage.py shell
docker-compose exec backend python manage.py createsuperuser
docker-compose exec frontend npm install

# Access database
docker-compose exec db psql -U jobgate -d careerquest
```

### Debugging Commands
```bash
# Check service status
docker-compose ps

# Check service health
docker-compose exec backend curl -f http://localhost:8000/api/health/
docker-compose exec frontend curl -f http://localhost:3000/

# View resource usage
docker stats

# Clean up unused resources
docker system prune -a
```

## 🔧 Configuration

### Environment Variables
The Docker setup uses these default environment variables:

#### Backend (.env)
```env
DEBUG=True
SECRET_KEY=your-secret-key-change-in-production
DATABASE_URL=postgres://jobgate:securepass@db:5432/careerquest
ALLOWED_HOSTS=localhost,127.0.0.1,backend
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

#### Frontend
```env
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=JobGate Career Quest
NODE_ENV=development
```

### Custom Configuration
To modify settings, create a `.env` file in the backend directory:

```bash
# Create .env file
cp backend/.env.example backend/.env

# Edit the file
nano backend/.env
```

## 🗄️ Database Management

### Automatic Database Setup
The Docker setup automatically:
1. Creates the PostgreSQL database
2. Runs Django migrations
3. Loads sample data from `database_export.json`
4. Creates necessary tables and indexes

### Manual Database Operations
```bash
# Run migrations
docker-compose exec backend python manage.py migrate

# Load sample data
docker-compose exec backend python manage.py loaddata database_export.json

# Create superuser
docker-compose exec backend python manage.py createsuperuser

# Access Django shell
docker-compose exec backend python manage.py shell

# Access database directly
docker-compose exec db psql -U jobgate -d careerquest
```

### Database Backup
```bash
# Backup database
docker-compose exec db pg_dump -U jobgate careerquest > backup.sql

# Restore database
docker-compose exec -T db psql -U jobgate careerquest < backup.sql
```

## 🚀 Production Deployment

### Using Nginx (Optional)
```bash
# Start with Nginx reverse proxy
docker-compose --profile production up -d

# This will start:
# - Database (PostgreSQL)
# - Backend (Django)
# - Frontend (React)
# - Nginx (Reverse Proxy)
```

### Production Environment Variables
```env
# Backend
DEBUG=False
SECRET_KEY=your-production-secret-key
DATABASE_URL=postgres://user:pass@host:port/db
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
CORS_ALLOWED_ORIGINS=https://yourdomain.com

# Frontend
VITE_API_URL=https://api.yourdomain.com
NODE_ENV=production
```

## 🐛 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Check what's using the port
netstat -tulpn | grep :3000
netstat -tulpn | grep :8000
netstat -tulpn | grep :5432

# Kill processes using ports
sudo kill -9 $(lsof -t -i:3000)
sudo kill -9 $(lsof -t -i:8000)
sudo kill -9 $(lsof -t -i:5432)
```

#### Docker Build Issues
```bash
# Clean Docker cache
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache

# Check Docker logs
docker-compose logs backend
docker-compose logs frontend
```

#### Database Connection Issues
```bash
# Check database status
docker-compose exec db pg_isready -U jobgate

# Check database logs
docker-compose logs db

# Restart database
docker-compose restart db
```

#### Frontend Build Issues
```bash
# Clear npm cache
docker-compose exec frontend npm cache clean --force

# Reinstall dependencies
docker-compose exec frontend rm -rf node_modules package-lock.json
docker-compose exec frontend npm install
```

### Service Health Checks
```bash
# Check all services
docker-compose ps

# Check specific service health
docker-compose exec backend curl -f http://localhost:8000/api/health/
docker-compose exec frontend curl -f http://localhost:3000/
docker-compose exec db pg_isready -U jobgate
```

## 📊 Monitoring

### Resource Usage
```bash
# View container resource usage
docker stats

# View specific container
docker stats jobgate_backend
docker stats jobgate_frontend
docker stats jobgate_db
```

### Logs
```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db

# View logs with timestamps
docker-compose logs -f -t backend
```

## 🔄 Development Workflow

### Making Changes
1. **Code Changes**: Edit files in your IDE
2. **Hot Reload**: Changes are automatically reflected
3. **Database Changes**: Run migrations in backend container
4. **Dependencies**: Rebuild containers if needed

### Git Workflow
```bash
# Pull latest changes
git pull origin main

# Rebuild containers
docker-compose up --build -d

# Check if everything works
docker-compose ps
```

## 📁 Project Structure
```
jobgate-career-quest/
├── docker-compose.yaml          # Docker services configuration
├── backend/
│   ├── Dockerfile              # Backend container config
│   ├── requirements.txt        # Python dependencies
│   └── database_export.json    # Sample data
├── frontend/
│   ├── Dockerfile              # Frontend container config
│   └── package.json            # Node.js dependencies
└── devops/
    └── nginx/
        └── nginx.conf          # Nginx configuration
```

## 🎯 Performance Tips

### Optimize Docker Performance
1. **Allocate More Resources**: Increase RAM/CPU in Docker Desktop
2. **Use .dockerignore**: Exclude unnecessary files
3. **Multi-stage Builds**: Optimize image sizes
4. **Volume Mounts**: Use volumes for node_modules

### Database Performance
1. **Indexes**: Ensure proper database indexes
2. **Connection Pooling**: Configure PostgreSQL settings
3. **Memory**: Allocate sufficient RAM to database container

## 🆘 Getting Help

### Docker Issues
- Check Docker Desktop is running
- Ensure ports are not in use
- Check system resources (RAM/disk)

### Application Issues
- Check container logs
- Verify environment variables
- Test database connectivity

### Team Support
- Use the project's issue tracker
- Check the main setup guide: [TEAM_SETUP_GUIDE.md](TEAM_SETUP_GUIDE.md)
- Contact team members for help

---

## 🚀 Quick Commands Summary

```bash
# Start everything
docker-compose up -d

# Stop everything
docker-compose down

# View logs
docker-compose logs -f

# Rebuild and start
docker-compose up --build -d

# Access backend shell
docker-compose exec backend python manage.py shell

# Access database
docker-compose exec db psql -U jobgate -d careerquest

# Clean up
docker-compose down -v
docker system prune -a
```

**Happy Docker Development! 🐳**
