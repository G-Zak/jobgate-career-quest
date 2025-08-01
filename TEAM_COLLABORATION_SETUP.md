# 👥 Team Collaboration Setup Guide
*How to set up jobgate-career-quest for 3-person development team*

## 🎯 Quick Start for Team Members

### For Team Members (Getting Started):

**1. Clone the Repository**
```bash
# Each team member runs this once
git clone https://github.com/G-Zak/jobgate-career-quest.git
cd jobgate-career-quest
```

**2. Set Up Development Environment**
```bash
# Build and start the development environment
docker-compose up --build

# Verify everything works
# Frontend: http://localhost:3000
# Backend: http://localhost:8000
# Database: PostgreSQL on port 5432
```

**3. Configure Git Identity**
```bash
# Each person sets their identity
git config user.name "Your Full Name"
git config user.email "your.email@example.com"

# Optional: Set global config for all projects
git config --global user.name "Your Full Name"
git config --global user.email "your.email@example.com"
```

## 🏗️ Project Structure Overview

```
jobgate-career-quest/
├── frontend/          # React + Vite + Phaser game
├── backend/           # Django REST API
├── devops/           # Nginx configuration
├── docs/             # Documentation
└── scripts/          # Deployment scripts
```

**Who Works Where:**
- **Frontend Developer**: `frontend/` directory (React, Phaser, UI/UX)
- **Backend Developer**: `backend/` directory (Django, APIs, database)
- **Full-Stack/DevOps**: Both directories + `devops/`, `scripts/`

## 🔄 Daily Team Workflow

### Morning Routine (Everyone):
```bash
# 1. Switch to main branch
git checkout main

# 2. Get latest changes
git pull origin main

# 3. Create feature branch for today's work
git checkout -b feature/your-task-name
```

### During Development:
```bash
# Make changes to your files...

# Stage and commit frequently
git add .
git commit -m "feat: implement user authentication"

# Push your branch (first time)
git push -u origin feature/your-task-name

# Push updates
git push
```

### End of Day:
```bash
# Make sure all work is committed and pushed
git status
git add .
git commit -m "wip: save progress on feature"
git push
```

## 🌿 Branching Strategy

### Branch Types:
```
main                    # Production-ready code
├── develop            # Integration branch (optional)
├── feature/user-auth  # New features
├── fix/login-bug      # Bug fixes
└── hotfix/critical    # Emergency fixes
```

### Branch Naming Convention:
```bash
# Features
feature/user-authentication
feature/game-scoring-system
feature/job-recommendations

# Bug fixes
fix/login-validation-error
fix/phaser-loading-issue
fix/docker-build-problem

# Hotfixes
hotfix/security-vulnerability
hotfix/database-connection
```

## 🤝 Collaboration Workflow

### Method 1: GitHub Pull Requests (Recommended)

**Step 1: Create Feature Branch**
```bash
git checkout main
git pull origin main
git checkout -b feature/your-feature-name
```

**Step 2: Work and Commit**
```bash
# Make your changes
git add .
git commit -m "feat: add feature description"
git push -u origin feature/your-feature-name
```

**Step 3: Create Pull Request**
1. Go to GitHub repository
2. Click "Pull Request" 
3. Select your branch → main
4. Add description of changes
5. Request review from team members
6. Wait for approval and merge

**Step 4: Clean Up**
```bash
# After PR is merged
git checkout main
git pull origin main
git branch -d feature/your-feature-name  # Delete local branch
```

### Method 2: Direct Collaboration (Advanced)

**Adding Team Members to Repository:**
```bash
# Repository owner (G-Zak) adds collaborators
# GitHub → Settings → Manage access → Invite collaborator
```

**Team Member Workflow:**
```bash
# Always work on feature branches
git checkout -b feature/my-work
# ... make changes ...
git push -u origin feature/my-work

# Merge when ready (after team communication)
git checkout main
git pull origin main
git merge feature/my-work
git push origin main
git branch -d feature/my-work
```

## 📋 Team Communication Protocols

### Before Starting Work:
- [ ] Check team chat/Discord for ongoing work
- [ ] Pull latest changes from main
- [ ] Announce what you're working on
- [ ] Create descriptive branch name

### During Development:
- [ ] Commit frequently with clear messages
- [ ] Push your branch daily
- [ ] Communicate blockers immediately
- [ ] Ask for help when stuck

### Before Merging:
- [ ] Test your changes locally
- [ ] Ensure Docker containers still work
- [ ] Write clear PR description
- [ ] Request team review

### Merge Conflicts (Don't Panic!):
```bash
# When git pull shows conflicts
git status                    # See conflicted files

# Edit each file, look for:
<<<<<<< HEAD
Your changes
=======
Their changes
>>>>>>> branch-name

# Choose what to keep, remove conflict markers
git add .
git commit -m "resolve: merge conflict in filename"
git push
```

## 🛠️ Development Environment Setup

### Prerequisites for Each Team Member:
```bash
# Install required tools
# - Docker Desktop
# - Git
# - VS Code (recommended)
# - Node.js (for frontend work)
# - Python (for backend work)
```

### First Time Setup:
```bash
# Clone and setup
git clone https://github.com/G-Zak/jobgate-career-quest.git
cd jobgate-career-quest

# Build containers
docker-compose up --build

# Verify everything works
curl http://localhost:8000/api/health  # Backend check
open http://localhost:3000             # Frontend check
```

### Development Commands:
```bash
# Start development environment
docker-compose up

# Restart specific service
docker-compose restart frontend
docker-compose restart backend

# View logs
docker-compose logs frontend
docker-compose logs backend

# Stop everything
docker-compose down
```

## 🏷️ Commit Message Standards

### Format:
```
type(scope): description

feat(auth): add JWT token validation
fix(ui): resolve mobile navigation bug  
docs(api): update endpoint documentation
style(frontend): format code with prettier
refactor(backend): simplify user service
test(auth): add unit tests for login
chore(deps): update dependencies
```

### Examples for Our Project:
```bash
# Frontend commits
git commit -m "feat(game): add Phaser scene transitions"
git commit -m "fix(ui): resolve responsive design issues"
git commit -m "style(components): update button styling"

# Backend commits  
git commit -m "feat(api): add user authentication endpoints"
git commit -m "fix(db): resolve migration conflicts"
git commit -m "test(models): add user model tests"

# Full-stack commits
git commit -m "feat(auth): implement complete login system"
git commit -m "fix(docker): resolve container networking"
```

## 🚨 Emergency Procedures

### When Someone Accidentally Pushes to Main:
```bash
# Don't panic! We can fix this
git log --oneline  # Find the problematic commit

# Option 1: Revert the commit (safe)
git revert commit-hash
git push origin main

# Option 2: Reset (dangerous, discuss with team first)
git reset --hard HEAD~1
git push --force origin main
```

### When Docker Stops Working:
```bash
# Clean slate approach
docker-compose down
docker system prune -f
docker-compose up --build
```

### When Git Gets Confusing:
```bash
# Save your work
git stash

# Get clean main
git checkout main
git fetch origin
git reset --hard origin/main

# Create new branch
git checkout -b feature/my-work-v2

# Restore your work
git stash pop
```

## 📊 Team Workflow Example

### Week 1 - Feature Development:

**Monday:**
```bash
# Everyone starts fresh
git checkout main && git pull origin main

# Person 1: Frontend
git checkout -b feature/user-dashboard

# Person 2: Backend  
git checkout -b feature/user-api

# Person 3: Integration
git checkout -b feature/auth-integration
```

**Daily:**
```bash
# Everyone pushes progress
git add . && git commit -m "wip: daily progress"
git push
```

**Friday:**
```bash
# Create pull requests
# Review each other's code
# Merge when approved
# Plan next week
```

## 🎯 Success Metrics

### Good Team Collaboration:
- [ ] No force pushes to main
- [ ] All features go through branches
- [ ] Regular commits with clear messages
- [ ] Docker environment works for everyone
- [ ] Code reviews before merging
- [ ] Open communication about conflicts

### Warning Signs:
- [ ] Frequent merge conflicts
- [ ] Force pushing to main
- [ ] Unclear commit messages
- [ ] Working directly on main branch
- [ ] Silent development (no communication)

---

## 📞 Quick Help Commands

```bash
# Emergency: Undo everything and start fresh
git stash                    # Save current work
git checkout main           # Go to main
git reset --hard origin/main  # Match remote exactly
git checkout -b feature/new-start  # Start over

# Check what everyone is working on
git branch -a               # See all branches
git log --oneline --graph   # Visual history

# Sync with team
git fetch origin            # Get latest info
git status                  # Check your status
```

**Remember: When in doubt, ask the team! Better to ask than break something. 🤝**
