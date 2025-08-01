# 🚀 JobGate Career Quest - Team Member Setup Script (Windows PowerShell)
# Run this script when you first join the team
# Usage: Right-click -> "Run with PowerShell" or run: powershell -ExecutionPolicy Bypass -File team-setup.ps1

Write-Host "🎯 Welcome to JobGate Career Quest Development Team!" -ForegroundColor Green
Write-Host "📋 Setting up your development environment..." -ForegroundColor Cyan

# Check if Git is installed and configured
Write-Host "🔧 Checking Git configuration..." -ForegroundColor Yellow

# Check if Git is installed
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Git not found! Please install Git first." -ForegroundColor Red
    Write-Host "Download from: https://git-scm.com/download/win" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Check Git configuration
try {
    $gitName = git config user.name 2>$null
    if (-not $gitName) {
        Write-Host "❌ Git user.name not set!" -ForegroundColor Red
        $fullname = Read-Host "Enter your full name"
        git config user.name "$fullname"
        Write-Host "✅ Git name set to: $fullname" -ForegroundColor Green
    } else {
        Write-Host "✅ Git name: $gitName" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️ Error checking Git name configuration" -ForegroundColor Yellow
}

try {
    $gitEmail = git config user.email 2>$null
    if (-not $gitEmail) {
        Write-Host "❌ Git user.email not set!" -ForegroundColor Red
        $email = Read-Host "Enter your email"
        git config user.email "$email"
        Write-Host "✅ Git email set to: $email" -ForegroundColor Green
    } else {
        Write-Host "✅ Git email: $gitEmail" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️ Error checking Git email configuration" -ForegroundColor Yellow
}

# Check if we're in the right directory
if (-not (Test-Path "docker-compose.yaml")) {
    Write-Host "❌ Error: docker-compose.yaml not found!" -ForegroundColor Red
    Write-Host "Make sure you're in the jobgate-career-quest directory" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Pull latest changes
Write-Host "📥 Pulling latest changes from main branch..." -ForegroundColor Cyan
try {
    git checkout main
    git pull origin main
    Write-Host "✅ Code updated successfully!" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Warning: Could not pull latest changes. Continue anyway." -ForegroundColor Yellow
}

# Check Docker
Write-Host "🐳 Checking Docker..." -ForegroundColor Yellow

# Check if Docker is installed
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Docker not found! Please install Docker Desktop first." -ForegroundColor Red
    Write-Host "Download from: https://www.docker.com/products/docker-desktop" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if Docker is running
try {
    docker info 2>$null | Out-Null
    Write-Host "✅ Docker is ready!" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not running! Please start Docker Desktop." -ForegroundColor Red
    Write-Host "💡 Tip: Look for Docker Desktop in your Start Menu" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if docker-compose is available
if (-not (Get-Command docker-compose -ErrorAction SilentlyContinue)) {
    Write-Host "⚠️ docker-compose not found, trying docker compose..." -ForegroundColor Yellow
    $dockerComposeCmd = "docker compose"
} else {
    $dockerComposeCmd = "docker-compose"
}

# Build and start containers
Write-Host "🏗️ Building development environment..." -ForegroundColor Cyan
Write-Host "⏳ This may take several minutes on first run..." -ForegroundColor Yellow

try {
    if ($dockerComposeCmd -eq "docker compose") {
        & docker compose up --build -d
    } else {
        & docker-compose up --build -d
    }
    Write-Host "✅ Containers built and started!" -ForegroundColor Green
} catch {
    Write-Host "❌ Error building containers. Check Docker Desktop and try again." -ForegroundColor Red
    Write-Host "💡 Try running: $dockerComposeCmd logs" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Wait for services to start
Write-Host "⏳ Waiting for services to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# Check if services are running
Write-Host "🔍 Checking services..." -ForegroundColor Yellow

# Check frontend
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 5 -ErrorAction Stop
    Write-Host "✅ Frontend running at http://localhost:3000" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Frontend might still be starting... Check in a few minutes." -ForegroundColor Yellow
}

# Check backend
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000" -TimeoutSec 5 -ErrorAction Stop
    Write-Host "✅ Backend running at http://localhost:8000" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Backend might still be starting... Check in a few minutes." -ForegroundColor Yellow
}

# Success message
Write-Host ""
Write-Host "🎉 Setup Complete!" -ForegroundColor Green -BackgroundColor DarkGreen
Write-Host ""
Write-Host "📖 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Read TEAM_COLLABORATION_SETUP.md for team workflow"
Write-Host "2. Open http://localhost:3000 to see the frontend"
Write-Host "3. Open http://localhost:8000 to see the backend"
Write-Host "4. Create your first feature branch: git checkout -b feature/your-name-test"
Write-Host ""
Write-Host "🤝 Team Communication:" -ForegroundColor Cyan
Write-Host "- Always work on feature branches"
Write-Host "- Push your work daily"
Write-Host "- Ask questions in team chat"
Write-Host "- Review code before merging"
Write-Host ""
Write-Host "🆘 Need Help?" -ForegroundColor Yellow
Write-Host "- Run: $dockerComposeCmd logs frontend"
Write-Host "- Run: $dockerComposeCmd logs backend"
Write-Host "- Check: TEAM_COLLABORATION_SETUP.md"
Write-Host "- Ask your teammates!"
Write-Host ""
Write-Host "🖥️ Windows Tips:" -ForegroundColor Magenta
Write-Host "- Use PowerShell or Git Bash for commands"
Write-Host "- Install Windows Terminal for better experience"
Write-Host "- Use VS Code with WSL extension for Linux-like development"
Write-Host ""
Write-Host "Happy coding! 🚀" -ForegroundColor Green

Read-Host "Press Enter to close"
