@echo off
echo Testing Profile Sync System
echo ==========================
echo.

echo 1. Starting Docker containers...
docker-compose up -d

echo.
echo 2. Waiting for services to start...
timeout /t 10 /nobreak

echo.
echo 3. Testing backend API...
python test-user-profile-integration.py

echo.
echo 4. Checking container status...
docker-compose ps

echo.
echo ==========================
echo Test complete!
echo.
echo Your application should now be running at:
echo - Frontend: http://localhost:3000
echo - Backend: http://localhost:8000
echo.
echo To test the profile sync:
echo 1. Go to the Profile page
echo 2. Update your skills
echo 3. Click "Save Changes"
echo 4. Check the sync notification
echo 5. Go to the Jobs page to see updated recommendations
echo.
pause
