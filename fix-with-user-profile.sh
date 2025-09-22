#!/bin/bash

echo "Fixing API with User Profile Integration"
echo "======================================"
echo

echo "1. Stopping containers..."
docker-compose down

echo
echo "2. Rebuilding backend with user profile integration..."
docker-compose build backend

echo
echo "3. Starting containers..."
docker-compose up -d

echo
echo "4. Waiting for services to start..."
sleep 15

echo
echo "5. Running migrations..."
docker-compose exec backend python manage.py migrate

echo
echo "6. Creating sample data..."
docker-compose exec backend python manage.py create_sample_jobs --count 20

echo
echo "7. Testing user profile integration..."
python test-user-profile-integration.py

echo
echo "8. Restarting frontend..."
docker-compose restart frontend

echo
echo "9. Checking container status..."
docker-compose ps

echo
echo "======================================"
echo "Fix complete!"
echo
echo "Your application now uses the user profile from localStorage!"
echo
echo "To test:"
echo "1. Go to http://localhost:3000"
echo "2. Click 'Mon Profil' to add/edit your skills"
echo "3. Click 'Offres d'emploi' to see personalized recommendations"
echo "4. Click 'API Test' to verify everything is working"
echo
echo "The system will now use your actual skills and profile data!"
