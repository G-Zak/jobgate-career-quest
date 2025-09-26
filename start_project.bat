@echo off
echo 🚀 Starting JobGate Career Quest Project...
echo.

echo 📦 Starting Backend Server...
start "Backend Server" cmd /k "cd backend && python manage.py runserver 8000"

echo ⏳ Waiting for backend to start...
timeout /t 5 /nobreak > nul

echo 🌐 Starting Frontend Server...
start "Frontend Server" cmd /k "cd frontend && npm start"

echo.
echo ✅ Project started successfully!
echo.
echo 📊 Backend: http://localhost:8000
echo 🌐 Frontend: http://localhost:3000
echo.
echo 🧪 Available Tests:
echo   - 35 Competence Validation Tests
echo   - 568 Questions Total
echo   - 8 Test Types (Verbal, Numerical, Abstract, Spatial, etc.)
echo.
echo Press any key to exit...
pause > nul
