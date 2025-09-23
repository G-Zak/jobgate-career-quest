# 🐳 Docker Setup - JobGate Career Quest

## 🚀 One-Command Setup

```bash
# Clone and start everything
git clone <repository-url>
cd jobgate-career-quest
docker-compose up -d
```

**That's it!** Your application will be running at:
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- Admin: http://localhost:8000/admin

## 📋 What's Included

### Services
- **PostgreSQL Database** - Complete with sample data
- **Django Backend** - REST API with all endpoints
- **React Frontend** - Modern UI with all features
- **Nginx** (Optional) - Reverse proxy for production

### Features
- ✅ **Complete Test System** - All 8 test categories
- ✅ **Database Pre-loaded** - 1,200+ questions and answers
- ✅ **Health Checks** - Automatic service monitoring
- ✅ **Hot Reload** - Code changes reflected instantly
- ✅ **Volume Mounts** - Persistent data storage
- ✅ **Network Isolation** - Secure container communication

## 🛠️ Quick Commands

```bash
# Start everything
docker-compose up -d

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

## 🔧 Development

### Making Changes
1. Edit code in your IDE
2. Changes are automatically reflected (hot reload)
3. Database changes require migrations:
   ```bash
   docker-compose exec backend python manage.py makemigrations
   docker-compose exec backend python manage.py migrate
   ```

### Adding Dependencies
```bash
# Backend (Python)
docker-compose exec backend pip install new-package
# Add to requirements.txt

# Frontend (Node.js)
docker-compose exec frontend npm install new-package
# Add to package.json
```

## 📊 Monitoring

### Health Checks
- Backend: http://localhost:8000/api/health/
- Frontend: http://localhost:3000/
- Database: `docker-compose exec db pg_isready -U jobgate`

### Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

## 🗄️ Database

### Automatic Setup
- Database is created automatically
- Sample data is loaded from `database_export.json`
- All migrations are applied
- Admin user can be created

### Manual Operations
```bash
# Create admin user
docker-compose exec backend python manage.py createsuperuser

# Run migrations
docker-compose exec backend python manage.py migrate

# Load sample data
docker-compose exec backend python manage.py loaddata database_export.json

# Backup database
docker-compose exec db pg_dump -U jobgate careerquest > backup.sql
```

## 🚀 Production

### Using Nginx
```bash
# Start with Nginx
docker-compose --profile production up -d
```

### Environment Variables
Create `.env` file in backend directory:
```env
DEBUG=False
SECRET_KEY=your-production-secret
DATABASE_URL=postgres://user:pass@host:port/db
ALLOWED_HOSTS=yourdomain.com
CORS_ALLOWED_ORIGINS=https://yourdomain.com
```

## 🐛 Troubleshooting

### Common Issues

#### Port Conflicts
```bash
# Check what's using ports
netstat -tulpn | grep :3000
netstat -tulpn | grep :8000

# Kill processes
sudo kill -9 $(lsof -t -i:3000)
sudo kill -9 $(lsof -t -i:8000)
```

#### Container Issues
```bash
# Check container status
docker-compose ps

# Restart specific service
docker-compose restart backend

# Rebuild containers
docker-compose up --build -d

# Clean up
docker-compose down -v
docker system prune -a
```

#### Database Issues
```bash
# Check database logs
docker-compose logs db

# Restart database
docker-compose restart db

# Reset database
docker-compose down -v
docker-compose up -d
```

## 📁 Project Structure

```
jobgate-career-quest/
├── docker-compose.yaml          # Main Docker configuration
├── backend/
│   ├── Dockerfile              # Backend container
│   ├── .dockerignore           # Docker ignore file
│   └── database_export.json    # Sample data
├── frontend/
│   ├── Dockerfile              # Frontend container
│   └── .dockerignore           # Docker ignore file
└── devops/
    └── nginx/
        └── nginx.conf          # Nginx configuration
```

## 🎯 Performance Tips

1. **Allocate Resources**: Give Docker Desktop more RAM/CPU
2. **Use Volumes**: Persistent data storage
3. **Health Checks**: Monitor service health
4. **Logs**: Check logs for issues
5. **Clean Up**: Regular cleanup of unused resources

## 📚 Documentation

- **Full Setup Guide**: [TEAM_SETUP_GUIDE.md](TEAM_SETUP_GUIDE.md)
- **Docker Guide**: [DOCKER_SETUP_GUIDE.md](DOCKER_SETUP_GUIDE.md)
- **Project Status**: [PROJECT_STATUS.md](PROJECT_STATUS.md)

## 🆘 Support

### Getting Help
1. Check the logs: `docker-compose logs -f`
2. Check service health: `docker-compose ps`
3. Restart services: `docker-compose restart`
4. Check the full documentation

### Team Support
- Use the project's issue tracker
- Contact team members
- Check the main setup guide

---

## 🚀 Quick Start Summary

```bash
# 1. Clone
git clone <repository-url>
cd jobgate-career-quest

# 2. Start
docker-compose up -d

# 3. Access
# Frontend: http://localhost:3000
# Backend: http://localhost:8000
# Admin: http://localhost:8000/admin

# 4. Create admin
docker-compose exec backend python manage.py createsuperuser

# 5. Done! 🎉
```

**Happy Docker Development! 🐳**
