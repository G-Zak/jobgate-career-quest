# JobGate Career Quest

A gamified skills assessment platform that helps users evaluate their professional skills through interactive testing and provides personalized career recommendations.

## 🚀 Features

- **Gamified Skills Assessment**: Interactive tests across multiple domains
- **Personalized Recommendations**: AI-powered career path suggestions
- **Achievement System**: Badges and rewards for skill progression
- **Dashboard Analytics**: Comprehensive progress tracking
- **Multi-domain Testing**: Support for various skill categories

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: Django 4.2 + Django REST Framework
- **Authentication**: JWT (JSON Web Tokens)
- **Database**: PostgreSQL 15
- **API Documentation**: DRF Spectacular (Swagger/OpenAPI)
- **Deployment**: Docker + Docker Compose

### Project Structure
```
jobgate-career-quest/
├── backend/                    # Django REST API
│   ├── accounts/              # User management
│   ├── badges/                # Achievement system
│   ├── careerquest/           # Main Django project
│   ├── dashboard/             # Analytics & reporting
│   ├── recommendation/        # AI recommendation engine
│   ├── skills/                # Skill management
│   ├── testsengine/           # Assessment engine
│   ├── requirements.txt       # Python dependencies
│   └── Dockerfile            # Backend container config
├── frontend/                  # React application
│   ├── src/                   # Source code
│   ├── package.json          # Node.js dependencies
│   └── Dockerfile            # Frontend container config
├── docker-compose.yaml       # Multi-container orchestration
└── docs/                     # Documentation
```

## 🛠️ Development Setup

### Prerequisites
- Docker Desktop
- Git

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/G-Zak/jobgate-career-quest.git
   cd jobgate-career-quest
   ```

2. **Start the application**
   ```bash
   docker-compose up -d
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/api/schema/swagger-ui/

### Development Commands

```bash
# View container status
docker-compose ps

# View logs
docker-compose logs [service-name]

# Stop services
docker-compose down

# Rebuild after code changes
docker-compose build [service-name]
docker-compose up -d

# Run backend migrations
docker-compose exec backend python manage.py migrate

# Create Django superuser
docker-compose exec backend python manage.py createsuperuser

# Install new Python packages
# 1. Add to backend/requirements.txt
# 2. Rebuild: docker-compose build backend

# Install new Node packages
# 1. Add to frontend/package.json
# 2. Rebuild: docker-compose build frontend
```

## 🧪 Testing

```bash
# Run backend tests
docker-compose exec backend python manage.py test

# Run frontend tests (when configured)
docker-compose exec frontend npm test
```

## 📊 API Documentation

The API is fully documented using DRF Spectacular:
- **Swagger UI**: http://localhost:8000/api/schema/swagger-ui/
- **ReDoc**: http://localhost:8000/api/schema/redoc/
- **OpenAPI Schema**: http://localhost:8000/api/schema/

## 🐳 Docker Services

| Service | Port | Description |
|---------|------|-------------|
| frontend | 3000 | React development server |
| backend | 8000 | Django REST API |
| db | 5432 | PostgreSQL database (internal) |

## 🔧 Environment Variables

### Backend (.env)
```env
DATABASE_URL=postgres://jobgate:securepass@db:5432/careerquest
ENV=development
SECRET_KEY=your-secret-key
DEBUG=True
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000
```

## 📁 Django Apps

| App | Purpose |
|-----|---------|
| **accounts** | User authentication and profile management |
| **skills** | Skill definitions and categorization |
| **testsengine** | Assessment creation and execution |
| **badges** | Achievement and gamification system |
| **recommendation** | Career path recommendation engine |
| **dashboard** | Analytics and progress tracking |

## 🔐 Authentication

The application uses JWT-based authentication:
- Access tokens for API requests
- Refresh tokens for seamless user experience
- Token-based session management

## 🐛 Troubleshooting

If you encounter issues, check the [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) file for common problems and solutions.

### Common Issues
- **Container not starting**: Check logs with `docker-compose logs [service-name]`
- **Port conflicts**: Ensure ports 3000 and 8000 are available
- **Database connection**: Verify PostgreSQL container is healthy

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Developers**: Zakaria Guennani - Aymane Bouras - Yassine Mchereg
- **Organization**: EMSI (École Marocaine des Sciences de l'Ingénieur)
- **Project Type**: Internship Project

---

**Last Updated**: July 29, 2025  
**Status**: ✅ Fully Functional
