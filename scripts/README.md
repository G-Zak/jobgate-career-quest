# Team Setup Scripts - Cross Platform Guide

Choose the right setup script for your operating system:

## 🐧 **Linux / macOS**
Run the bash script:
```bash
cd jobgate-career-quest
chmod +x scripts/team-setup.sh
./scripts/team-setup.sh
```

## 🪟 **Windows**

### Option 1: PowerShell (Recommended)
1. Right-click on `scripts/team-setup.ps1`
2. Select "Run with PowerShell"

Or from PowerShell:
```powershell
cd jobgate-career-quest
powershell -ExecutionPolicy Bypass -File scripts/team-setup.ps1
```

### Option 2: Command Prompt
1. Double-click `scripts/team-setup.bat`

Or from cmd:
```cmd
cd jobgate-career-quest
scripts\team-setup.bat
```

## 📋 **Prerequisites**

### All Platforms:
- **Git** installed and configured
- **Docker Desktop** installed and running
- **Internet connection** for downloading dependencies

### Windows Specific:
- **Windows 10/11** with WSL2 enabled (for Docker Desktop)
- **PowerShell 5.1+** (built into Windows)
- Consider installing **Windows Terminal** for better experience

## 🔧 **What These Scripts Do**

1. ✅ Check Git configuration (name/email)
2. 📥 Pull latest code from main branch
3. 🐳 Verify Docker is installed and running
4. 🏗️ Build development containers
5. ⏳ Wait for services to start
6. 🔍 Check that frontend/backend are accessible
7. 📖 Show next steps and helpful commands

## 🆘 **Troubleshooting**

### Git Issues:
```bash
# Configure Git manually if scripts fail
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Docker Issues:
- **Make sure Docker Desktop is running**
- **On Windows**: Enable WSL2 integration
- **Check ports**: 3000 (frontend) and 8000 (backend) should be free

### Permission Issues (Windows):
```powershell
# If PowerShell execution policy blocks scripts:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Services Not Starting:
```bash
# Check container logs
docker-compose logs frontend
docker-compose logs backend

# Restart containers
docker-compose down
docker-compose up --build
```

## 💡 **Platform-Specific Tips**

### Windows:
- Use **Git Bash** or **PowerShell** for Git commands
- Install **VS Code** with **WSL extension** for Linux-like development
- Consider using **Windows Terminal** instead of cmd

### macOS:
- Use **Homebrew** to install missing tools
- **Docker Desktop** may require permissions approval

### Linux:
- Use your distribution's package manager for dependencies
- May need to add user to `docker` group

## 🎯 **Next Steps After Setup**

1. Read `TEAM_COLLABORATION_SETUP.md`
2. Create your feature branch: `git checkout -b feature/your-name-test`
3. Open http://localhost:3000 (frontend)
4. Open http://localhost:8000 (backend)
5. Start developing! 🚀

## 📞 **Still Need Help?**

- Check the main `TEAM_COLLABORATION_SETUP.md` file
- Ask in team chat
- Review `TROUBLESHOOTING.md`
- Contact your team lead
