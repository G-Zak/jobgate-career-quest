#!/bin/bash
# Quick setup script for Skills Management System

echo "🚀 Setting up Skills Management System for Team..."
echo "=================================================="

# Change to backend directory
cd backend

echo "1️⃣ Running database migrations..."
python manage.py migrate

echo "2️⃣ Setting up skills and tests data..."
python manage.py shell < setup_skills_data.py

echo "3️⃣ Verifying setup..."
python manage.py shell -c "
from skills.models import Skill, TechnicalTest, TestQuestion
print(f'✅ Skills: {Skill.objects.count()}')
print(f'✅ Tests: {TechnicalTest.objects.count()}') 
print(f'✅ Questions: {TestQuestion.objects.count()}')
"

echo ""
echo "🎯 Setup Complete! Now start the services:"
echo "   Backend:  cd backend && python manage.py runserver"
echo "   Frontend: cd frontend && npm run dev"
echo ""
echo "📱 Access the application at: http://localhost:5173"
