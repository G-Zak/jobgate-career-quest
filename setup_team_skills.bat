@echo off
echo ========================================
echo JobGate Career Quest - Team Setup
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python from https://www.python.org/downloads/
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ All prerequisites found!
echo.

echo ========================================
echo Setting up Backend...
echo ========================================
cd backend

REM Create virtual environment
echo Creating Python virtual environment...
python -m venv venv
if %errorlevel% neq 0 (
    echo ERROR: Failed to create virtual environment
    pause
    exit /b 1
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Install Python dependencies
echo Installing Python dependencies...
pip install --upgrade pip
pip install -r requirements.txt

REM Create .env file if it doesn't exist
if not exist .env (
    echo Creating .env file...
    echo DEBUG=True > .env
    echo SECRET_KEY=your-secret-key-change-this-in-production >> .env
    echo DATABASE_URL=postgresql://postgres:password@localhost:5432/jobgate_db >> .env
    echo ALLOWED_HOSTS=localhost,127.0.0.1 >> .env
    echo CORS_ALLOWED_ORIGINS=http://localhost:3000 >> .env
)

REM Run migrations
echo Running database migrations...
python manage.py migrate

REM Load sample data
echo Loading sample data...
if exist database_export.json (
    python manage.py loaddata database_export.json
) else (
    echo WARNING: database_export.json not found, creating sample data...
    python manage.py create_sample_data
)

echo ✅ Backend setup complete!
echo.

echo ========================================
echo Setting up Frontend...
echo ========================================
cd ..\frontend

REM Install Node.js dependencies
echo Installing Node.js dependencies...
npm install

echo ✅ Frontend setup complete!
echo.

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo To start the application:
echo.
echo 1. Backend (in one terminal):
echo    cd backend
echo    venv\Scripts\activate
echo    python manage.py runserver
echo.
echo 2. Frontend (in another terminal):
echo    cd frontend
echo    npm run dev
echo.
echo Then visit:
echo - Frontend: http://localhost:3000
echo - Backend API: http://localhost:8000
echo - Admin Panel: http://localhost:8000/admin
echo.
pause
