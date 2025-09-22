@echo off
echo Complete API Fix Script
echo ======================
echo.

echo 1. Stopping containers...
docker-compose down

echo.
echo 2. Rebuilding backend...
docker-compose build backend

echo.
echo 3. Starting containers...
docker-compose up -d

echo.
echo 4. Waiting for services to start...
timeout /t 15 /nobreak

echo.
echo 5. Running migrations...
docker-compose exec backend python manage.py migrate

echo.
echo 6. Creating sample data...
docker-compose exec backend python manage.py create_sample_jobs --count 15

echo.
echo 7. Generating recommendations...
docker-compose exec backend python manage.py generate_recommendations

echo.
echo 8. Testing API endpoints...
python test-api-endpoints.py

echo.
echo 9. Restarting frontend...
docker-compose restart frontend

echo.
echo 10. Checking container status...
docker-compose ps

echo.
echo ======================
echo Fix complete!
echo.
echo Your application should now be working at:
echo - Frontend: http://localhost:3000
echo - Backend: http://localhost:8000
echo - Admin: http://localhost:8000/admin
echo.
echo Check the "API Test" tab in the frontend to verify everything is working.
