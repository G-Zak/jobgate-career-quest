#!/bin/bash

# 🚀 JobGate Career Quest - Team Member Setup Script
# Run this script when you first join the team

echo "🎯 Welcome to JobGate Career Quest Development Team!"
echo "📋 Setting up your development environment..."

# Check if Git is configured
echo "🔧 Checking Git configuration..."
if ! git config user.name > /dev/null; then
    echo "❌ Git user.name not set!"
    read -p "Enter your full name: " fullname
    git config user.name "$fullname"
    echo "✅ Git name set to: $fullname"
else
    echo "✅ Git name: $(git config user.name)"
fi

if ! git config user.email > /dev/null; then
    echo "❌ Git user.email not set!"
    read -p "Enter your email: " email
    git config user.email "$email"
    echo "✅ Git email set to: $email"
else
    echo "✅ Git email: $(git config user.email)"
fi

# Check if we're in the right directory
if [ ! -f "docker-compose.yaml" ]; then
    echo "❌ Error: docker-compose.yaml not found!"
    echo "Make sure you're in the jobgate-career-quest directory"
    exit 1
fi

# Pull latest changes
echo "📥 Pulling latest changes from main branch..."
git checkout main
git pull origin main

# Check Docker
echo "🐳 Checking Docker..."
if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found! Please install Docker Desktop first."
    echo "Download from: https://www.docker.com/products/docker-desktop"
    exit 1
fi

if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running! Please start Docker Desktop."
    exit 1
fi

echo "✅ Docker is ready!"

# Build and start containers
echo "🏗️ Building development environment..."
docker-compose up --build -d

# Wait a moment for containers to start
echo "⏳ Waiting for services to start..."
sleep 10

# Check if services are running
echo "🔍 Checking services..."
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Frontend running at http://localhost:3000"
else
    echo "⚠️ Frontend might still be starting..."
fi

if curl -s http://localhost:8000 > /dev/null; then
    echo "✅ Backend running at http://localhost:8000"
else
    echo "⚠️ Backend might still be starting..."
fi

echo ""
echo "🎉 Setup Complete!"
echo ""
echo "📖 Next Steps:"
echo "1. Read TEAM_COLLABORATION_SETUP.md for team workflow"
echo "2. Open http://localhost:3000 to see the frontend"
echo "3. Open http://localhost:8000 to see the backend"
echo "4. Create your first feature branch: git checkout -b feature/your-name-test"
echo ""
echo "🤝 Team Communication:"
echo "- Always work on feature branches"
echo "- Push your work daily"
echo "- Ask questions in team chat"
echo "- Review code before merging"
echo ""
echo "🆘 Need Help?"
echo "- Run: docker-compose logs frontend"
echo "- Run: docker-compose logs backend"
echo "- Check: TEAM_COLLABORATION_SETUP.md"
echo "- Ask your teammates!"
echo ""
echo "Happy coding! 🚀"
