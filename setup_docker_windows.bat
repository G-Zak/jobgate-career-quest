@echo off
echo ========================================
echo JobGate Career Quest - Docker Setup
echo ========================================
echo.

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker is not installed or not in PATH
    echo Please install Docker Desktop from https://www.docker.com/products/docker-desktop/
    pause
    exit /b 1
)

REM Check if Docker Compose is available
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker Compose is not available
    echo Please ensure Docker Desktop is properly installed
    pause
    exit /b 1
)

echo ✅ Docker and Docker Compose found!
echo.

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker is not running
    echo Please start Docker Desktop and try again
    pause
    exit /b 1
)

echo ✅ Docker is running!
echo.

echo ========================================
echo Building and Starting Services...
echo ========================================

REM Stop any existing containers
echo Stopping existing containers...
docker-compose down >nul 2>&1

REM Build and start services
echo Building and starting services...
docker-compose up --build -d

if %errorlevel% neq 0 (
    echo ERROR: Failed to start services
    echo Check the logs with: docker-compose logs
    pause
    exit /b 1
)

echo ✅ Services started successfully!
echo.

echo ========================================
echo Waiting for Services to be Ready...
echo ========================================

REM Wait for database to be ready
echo Waiting for database to be ready...
timeout /t 10 /nobreak >nul

REM Wait for backend to be ready
echo Waiting for backend to be ready...
timeout /t 15 /nobreak >nul

REM Wait for frontend to be ready
echo Waiting for frontend to be ready...
timeout /t 10 /nobreak >nul

echo ✅ All services should be ready now!
echo.

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Your application is now running:
echo.
echo - Frontend: http://localhost:3000
echo - Backend API: http://localhost:8000
echo - Admin Panel: http://localhost:8000/admin
echo - Database: localhost:5432
echo.
echo Default credentials:
echo - Database: jobgate / securepass
echo - Admin: (create with command below)
echo.
echo Useful commands:
echo.
echo - View logs: docker-compose logs -f
echo - Stop services: docker-compose down
echo - Restart services: docker-compose restart
echo - Access backend shell: docker-compose exec backend python manage.py shell
echo - Create admin user: docker-compose exec backend python manage.py createsuperuser
echo.
echo ========================================
echo Creating Admin User...
echo ========================================
echo.
echo Please create an admin user for the Django admin panel:
echo.
docker-compose exec backend python manage.py createsuperuser
echo.

echo ========================================
echo Docker Setup Complete!
echo ========================================
echo.
echo For detailed documentation, see:
echo - DOCKER_SETUP_GUIDE.md
echo - TEAM_SETUP_GUIDE.md
echo.
echo Happy coding! 🐳
echo.
pause
