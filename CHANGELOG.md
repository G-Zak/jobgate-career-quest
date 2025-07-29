# Changelog

All notable changes to the JobGate Career Quest project will be documented in this file.

## [1.0.1] - 2025-07-29

### Fixed
- **Backend Container Issues**: Resolved ModuleNotFoundError for missing JWT and setuptools dependencies
- **Frontend Port Configuration**: Fixed Vite server to run on correct port 3000 instead of default 5173
- **Container Orchestration**: All services now start and communicate properly

### Added
- `djangorestframework-simplejwt==5.3.0` to backend dependencies for JWT authentication
- `setuptools==69.0.0` to backend dependencies for pkg_resources compatibility
- Proper port configuration in frontend Dockerfile for Docker Compose compatibility

### Changed
- Updated `backend/requirements.txt` with missing dependencies
- Modified `frontend/Dockerfile` CMD to specify host and port explicitly
- Enhanced Docker Compose configuration for better development experience

### Technical Details
#### Backend Dependencies Added
```diff
+ djangorestframework-simplejwt==5.3.0  # JWT authentication
+ setuptools==69.0.0                    # Required for pkg_resources
```

#### Frontend Dockerfile Updated
```diff
- CMD ["npm", "run", "dev"]
+ CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]
```

### Infrastructure
- All Docker containers now start successfully
- Backend API accessible at http://localhost:8000
- Frontend app accessible at http://localhost:3000
- PostgreSQL database running and healthy
- Auto-reloading enabled for development

### Documentation
- Created comprehensive TROUBLESHOOTING.md guide
- Updated README.md with complete setup instructions
- Added SETUP.md for development workflow
- Documented all fixes and resolution steps

## [1.0.0] - 2025-07-29

### Initial Release
- Django REST Framework backend with JWT authentication
- React frontend with Vite and Tailwind CSS
- PostgreSQL database integration
- Docker Compose development environment
- Gamified skills assessment system
- Multi-app Django architecture:
  - accounts (user management)
  - skills (skill definitions)
  - testsengine (assessment engine)
  - badges (achievement system)
  - recommendation (career recommendations)
  - dashboard (analytics)

### Features
- User authentication and registration
- Skills assessment framework
- Badge and achievement system
- Career recommendation engine
- Analytics dashboard
- API documentation with Swagger/OpenAPI

---

### Version Format
This project follows [Semantic Versioning](https://semver.org/):
- **MAJOR** version for incompatible API changes
- **MINOR** version for backwards-compatible functionality additions  
- **PATCH** version for backwards-compatible bug fixes

### Categories
- **Added** for new features
- **Changed** for changes in existing functionality
- **Deprecated** for soon-to-be removed features
- **Removed** for now removed features
- **Fixed** for any bug fixes
- **Security** for vulnerability fixes
