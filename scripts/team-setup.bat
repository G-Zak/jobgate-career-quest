@echo off
REM 🚀 JobGate Career Quest - Team Member Setup Script (Windows Batch)
REM Run this script when you first join the team
REM Usage: Double-click this file or run from Command Prompt

echo 🎯 Welcome to JobGate Career Quest Development Team!
echo 📋 Setting up your development environment...
echo.

REM Check if Git is installed
echo 🔧 Checking Git configuration...
where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Git not found! Please install Git first.
    echo Download from: https://git-scm.com/download/win
    pause
    exit /b 1
)

REM Check Git configuration
git config user.name >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Git user.name not set!
    set /p fullname="Enter your full name: "
    git config user.name "%fullname%"
    echo ✅ Git name set to: %fullname%
) else (
    for /f "tokens=*" %%i in ('git config user.name') do echo ✅ Git name: %%i
)

git config user.email >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Git user.email not set!
    set /p email="Enter your email: "
    git config user.email "%email%"
    echo ✅ Git email set to: %email%
) else (
    for /f "tokens=*" %%i in ('git config user.email') do echo ✅ Git email: %%i
)

REM Check if we're in the right directory
if not exist "docker-compose.yaml" (
    echo ❌ Error: docker-compose.yaml not found!
    echo Make sure you're in the jobgate-career-quest directory
    pause
    exit /b 1
)

REM Pull latest changes
echo 📥 Pulling latest changes from main branch...
git checkout main
git pull origin main
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️ Warning: Could not pull latest changes. Continue anyway.
)

REM Check Docker
echo 🐳 Checking Docker...
where docker >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Docker not found! Please install Docker Desktop first.
    echo Download from: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

REM Check if Docker is running
docker info >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Docker is not running! Please start Docker Desktop.
    echo 💡 Tip: Look for Docker Desktop in your Start Menu
    pause
    exit /b 1
)

echo ✅ Docker is ready!

REM Check docker-compose availability
where docker-compose >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️ docker-compose not found, trying docker compose...
    set DOCKER_COMPOSE_CMD=docker compose
) else (
    set DOCKER_COMPOSE_CMD=docker-compose
)

REM Build and start containers
echo 🏗️ Building development environment...
echo ⏳ This may take several minutes on first run...
%DOCKER_COMPOSE_CMD% up --build -d
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Error building containers. Check Docker Desktop and try again.
    echo 💡 Try running: %DOCKER_COMPOSE_CMD% logs
    pause
    exit /b 1
)

echo ✅ Containers built and started!

REM Wait for services to start
echo ⏳ Waiting for services to start...
timeout /t 15 /nobreak >nul

REM Check services (simplified for batch)
echo 🔍 Checking services...
echo ⚠️ Services may take a few minutes to fully start
echo 💡 Check http://localhost:3000 for frontend
echo 💡 Check http://localhost:8000 for backend

echo.
echo 🎉 Setup Complete!
echo.
echo 📖 Next Steps:
echo 1. Read TEAM_COLLABORATION_SETUP.md for team workflow
echo 2. Open http://localhost:3000 to see the frontend
echo 3. Open http://localhost:8000 to see the backend
echo 4. Create your first feature branch: git checkout -b feature/your-name-test
echo.
echo 🤝 Team Communication:
echo - Always work on feature branches
echo - Push your work daily
echo - Ask questions in team chat
echo - Review code before merging
echo.
echo 🆘 Need Help?
echo - Run: %DOCKER_COMPOSE_CMD% logs frontend
echo - Run: %DOCKER_COMPOSE_CMD% logs backend
echo - Check: TEAM_COLLABORATION_SETUP.md
echo - Ask your teammates!
echo.
echo 🖥️ Windows Tips:
echo - Use PowerShell or Git Bash for better commands
echo - Install Windows Terminal for better experience
echo - Use VS Code with WSL extension for Linux-like development
echo.
echo Happy coding! 🚀

pause
