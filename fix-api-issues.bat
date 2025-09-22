@echo off
echo Fixing API connection issues...
echo.

echo 1. Checking if containers are running...
docker-compose ps

echo.
echo 2. Checking backend logs...
docker-compose logs backend --tail=20

echo.
echo 3. Testing backend connection...
docker-compose exec backend python -c "
import requests
try:
    response = requests.get('http://localhost:8000/admin/')
    print('✓ Backend is accessible')
    print(f'Status: {response.status_code}')
except Exception as e:
    print(f'✗ Backend error: {e}')
"

echo.
echo 4. Testing API endpoints...
docker-compose exec backend python -c "
import requests
endpoints = ['/api/recommendations/', '/api/skills/', '/api/tests/']
for endpoint in endpoints:
    try:
        response = requests.get(f'http://localhost:8000{endpoint}')
        print(f'✓ {endpoint} - Status: {response.status_code}')
    except Exception as e:
        print(f'✗ {endpoint} - Error: {e}')
"

echo.
echo 5. Running migrations...
docker-compose exec backend python manage.py migrate

echo.
echo 6. Creating sample data...
docker-compose exec backend python manage.py create_sample_jobs --count 10

echo.
echo 7. Generating recommendations...
docker-compose exec backend python manage.py generate_recommendations

echo.
echo 8. Restarting frontend to pick up changes...
docker-compose restart frontend

echo.
echo Fix complete! Check the logs above for any errors.
echo If issues persist, try:
echo - docker-compose down
echo - docker-compose up --build
