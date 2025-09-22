@echo off
echo ========================================
echo JobGate Career Quest - Database Setup
echo ========================================
echo.

echo Checking Docker installation...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker is not installed or not running
    echo Please install Docker Desktop from: https://www.docker.com/products/docker-desktop/
    pause
    exit /b 1
)

echo Docker is installed ✓
echo.

echo Checking if project is cloned...
if not exist "backend\database_export.json" (
    echo ERROR: database_export.json not found
    echo Please make sure you're in the project root directory
    echo and that the project has been cloned properly
    pause
    exit /b 1
)

echo Project files found ✓
echo.

echo Starting database setup...
echo This may take 2-3 minutes for the first time...
echo.

echo Starting Docker services...
docker-compose up -d

echo.
echo Waiting for database to initialize...
timeout /t 30 /nobreak >nul

echo.
echo Checking database status...
docker-compose ps

echo.
echo Checking database health...
docker-compose exec -T db pg_isready -U jobgate -d careerquest

if %errorlevel% equ 0 (
    echo Database is healthy ✓
) else (
    echo WARNING: Database health check failed
    echo This might be normal if the database is still starting up
)

echo.
echo Verifying data loading...
docker-compose exec -T backend python manage.py shell -c "from testsengine.models import Question; print(f'Questions loaded: {Question.objects.count()}')"

echo.
echo ========================================
echo Database Setup Complete!
echo ========================================
echo.
echo Access points:
echo - Frontend: http://localhost:3000
echo - Backend API: http://localhost:8000
echo - Admin Panel: http://localhost:8000/admin
echo.
echo To view logs: docker-compose logs -f
echo To stop services: docker-compose down
echo.
pause
