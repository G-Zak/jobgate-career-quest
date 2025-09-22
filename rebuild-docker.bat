@echo off
echo Rebuilding and restarting Docker containers...
echo.

echo Stopping existing containers...
docker-compose down

echo.
echo Rebuilding containers...
docker-compose build --no-cache

echo.
echo Starting containers...
docker-compose up -d

echo.
echo Waiting for services to start...
timeout /t 10 /nobreak

echo.
echo Checking container status...
docker-compose ps

echo.
echo Services should be available at:
echo - Frontend: http://localhost:3000
echo - Backend API: http://localhost:8000
echo - Admin: http://localhost:8000/admin
echo.
echo To view logs, run: docker-compose logs -f
echo To stop services, run: docker-compose down
