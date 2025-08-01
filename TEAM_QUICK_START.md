# 👥 New Team Member? Start Here!

Welcome to the **JobGate Career Quest** development team! 🚀

## 🏃‍♂️ Quick Start (5 minutes)

### 1. Clone the Repository
```bash
git clone https://github.com/G-Zak/jobgate-career-quest.git
cd jobgate-career-quest
```

### 2. Run Team Setup Script
```bash
./scripts/team-setup.sh
```

This script will:
- ✅ Configure your Git identity
- ✅ Pull latest changes
- ✅ Build development environment
- ✅ Start all services
- ✅ Verify everything works

### 3. Verify Setup
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8000
- **Game**: Click "Start Game" to test Phaser integration

## 📚 Essential Reading

1. **[TEAM_COLLABORATION_SETUP.md](TEAM_COLLABORATION_SETUP.md)** - Complete team workflow guide
2. **[Main README.md](README.md)** - Project overview and technical details

## 🎯 Your First Task

```bash
# Create your first feature branch
git checkout -b feature/your-name-hello-world

# Make a small change (add your name to a comment somewhere)
# Then commit and push
git add .
git commit -m "feat: add team member introduction"
git push -u origin feature/your-name-hello-world

# Create a Pull Request on GitHub for team review
```

## 🆘 Common Issues

**Docker not working?**
```bash
docker-compose down
docker-compose up --build
```

**Can't access frontend/backend?**
```bash
docker-compose logs frontend
docker-compose logs backend
```

**Git confusion?**
```bash
# Get back to safety
git checkout main
git pull origin main
```

## 🤝 Team Rules

- ✅ Always work on feature branches
- ✅ Push your work daily
- ✅ Ask questions in team chat
- ✅ Review code before merging
- ❌ Never push directly to main
- ❌ Never force push without team agreement

## 📞 Getting Help

1. **Check logs**: `docker-compose logs [service-name]`
2. **Read guides**: TEAM_COLLABORATION_SETUP.md
3. **Ask teammates**: Better to ask than break something!
4. **Google error messages**: Part of development life 😊

---

**Ready to build something amazing together! 🚀**
