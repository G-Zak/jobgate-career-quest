# 🎯 Skills Management System - Team Setup Guide

## Overview
The "Gestion des compétences" allows users to:
1. **Add technical skills** from predefined categories
2. **Access tests** based on their selected skills
3. **Take technical assessments** for competencies

## 🗄️ Database Structure

### Skills Categories
- **Programming Languages**: Python, JavaScript, Java, TypeScript, C++
- **Frontend Technologies**: React, Vue.js, Angular, HTML/CSS
- **Backend Technologies**: Django, Express.js, Flask, Node.js, Spring Boot
- **Databases**: MySQL, PostgreSQL, MongoDB, Redis, SQL
- **DevOps & Cloud**: Docker, Kubernetes, AWS, CI/CD

### Technical Tests Available
- **Python Fundamentals** (4 questions)
- **Django Framework** (5 questions) 
- **React.js Expert** (3 questions)

## 🚀 Setup Instructions for Team Members

### Step 1: Database Migration
```bash
cd backend
python manage.py migrate
```

### Step 2: Load Skills Data
Run this Python script to populate skills:

```python
# Run in Django shell: python manage.py shell
from skills.models import Skill

# Create all skills if they don't exist
skills_data = [
    # Programming Languages
    {'name': 'Python', 'category': 'programming', 'description': 'Python programming language'},
    {'name': 'JavaScript', 'category': 'programming', 'description': 'JavaScript programming language'},
    {'name': 'Java', 'category': 'programming', 'description': 'Java programming language'},
    {'name': 'TypeScript', 'category': 'programming', 'description': 'TypeScript programming language'},
    {'name': 'C++', 'category': 'programming', 'description': 'C++ programming language'},
    
    # Frontend Technologies
    {'name': 'React', 'category': 'frontend', 'description': 'React.js framework'},
    {'name': 'Vue.js', 'category': 'frontend', 'description': 'Vue.js framework'},
    {'name': 'Angular', 'category': 'frontend', 'description': 'Angular framework'},
    {'name': 'HTML/CSS', 'category': 'frontend', 'description': 'HTML and CSS'},
    
    # Backend Technologies
    {'name': 'Django', 'category': 'backend', 'description': 'Django framework'},
    {'name': 'Flask', 'category': 'backend', 'description': 'Flask framework'},
    {'name': 'Express.js', 'category': 'backend', 'description': 'Express.js framework'},
    {'name': 'Node.js', 'category': 'backend', 'description': 'Node.js runtime'},
    {'name': 'Spring Boot', 'category': 'backend', 'description': 'Spring Boot framework'},
    
    # Databases
    {'name': 'PostgreSQL', 'category': 'database', 'description': 'PostgreSQL database'},
    {'name': 'MySQL', 'category': 'database', 'description': 'MySQL database'},
    {'name': 'MongoDB', 'category': 'database', 'description': 'MongoDB database'},
    {'name': 'Redis', 'category': 'database', 'description': 'Redis database'},
    {'name': 'SQL', 'category': 'database', 'description': 'Structured Query Language'},
    
    # DevOps & Cloud
    {'name': 'Docker', 'category': 'devops', 'description': 'Docker containerization'},
    {'name': 'Kubernetes', 'category': 'devops', 'description': 'Kubernetes orchestration'},
    {'name': 'AWS', 'category': 'devops', 'description': 'Amazon Web Services'},
    {'name': 'CI/CD', 'category': 'devops', 'description': 'Continuous Integration/Deployment'},
]

for skill_data in skills_data:
    skill, created = Skill.objects.get_or_create(
        name=skill_data['name'],
        defaults=skill_data
    )
    if created:
        print(f"Created skill: {skill.name}")
    else:
        print(f"Skill already exists: {skill.name}")
```

### Step 3: Create Technical Tests
```python
# Run in Django shell: python manage.py shell
from skills.models import Skill, TechnicalTest, TestQuestion

# Create Python Test
python_skill = Skill.objects.get(name='Python')
python_test, created = TechnicalTest.objects.get_or_create(
    test_name='Test Python Fondamentaux',
    skill=python_skill,
    defaults={
        'description': 'Évaluation des concepts fondamentaux de Python : syntaxe, structures de données, POO',
        'instructions': 'Répondez aux questions suivantes sur Python. Vous avez 30 minutes.',
        'total_score': 20,
        'time_limit': 30,
        'is_active': True
    }
)

if created:
    # Add Python questions
    questions = [
        {
            'order': 1,
            'question_text': 'Quelle est la sortie de print(type([]))?',
            'option_a': '<class "list">',
            'option_b': '<class "dict">',
            'option_c': '<class "tuple">',
            'option_d': '<class "set">',
            'correct_answer': 'a',
            'points': 5,
            'explanation': 'Le type de [] est list en Python.'
        },
        {
            'order': 2,
            'question_text': 'Comment créer une fonction lambda qui retourne le carré d\'un nombre?',
            'option_a': 'lambda x: x^2',
            'option_b': 'lambda x: x**2',
            'option_c': 'lambda x: x*x',
            'option_d': 'Les réponses B et C',
            'correct_answer': 'd',
            'points': 5,
            'explanation': 'En Python, x**2 et x*x donnent le même résultat pour le carré.'
        }
    ]
    
    for q_data in questions:
        TestQuestion.objects.create(test=python_test, **q_data)

# Repeat for Django and React tests...
```

### Step 4: Start Services
```bash
# Terminal 1: Backend
cd backend
python manage.py runserver

# Terminal 2: Frontend  
cd frontend
npm run dev
```

## 🎮 How It Works

### 1. Skills Management Interface
- Users access via the dashboard
- Skills are grouped by categories with visual cards
- Each skill shows: Name, Category, Description
- Users can add skills with proficiency levels (Débutant, Intermédiaire, Avancé)

### 2. Tests Access ("Tests par compétence")
- Only shows tests for skills the user has added
- Each test displays: Duration, Number of questions, Passing score
- Users can start tests directly from the interface

### 3. Test Taking Experience
- Timer countdown
- Progress bar
- Multiple choice questions with A, B, C, D options
- Navigation between questions
- Automatic submission when time expires

## 🔄 Data Flow

1. **Skills Loading**: Frontend calls `/api/skills/` → Returns categorized skills
2. **User Profile**: Frontend calls `/api/candidates/{id}/` → Returns user's selected skills  
3. **Available Tests**: Frontend calls `/api/tests-alt/` → Returns tests for user's skills
4. **Test Taking**: Frontend calls `/api/tests-alt/{test_id}/` → Returns test with questions
5. **Submit Results**: Frontend posts to `/api/results/submit_test/` → Saves test results

## 📊 Database Files

The data is stored in:
- `backend/db.sqlite3` - Main SQLite database
- Contains all skills, tests, questions, and user data

## 🔧 Troubleshooting

### Common Issues:
1. **"Failed to load skills"**: Check if backend is running on port 8000
2. **Empty skills list**: Run the skills creation script above
3. **No tests available**: Ensure technical tests are created and linked to skills
4. **JavaScript errors**: Check browser console, refresh page

### Verification Commands:
```bash
# Check skills count
python manage.py shell -c "from skills.models import Skill; print(f'Skills: {Skill.objects.count()}')"

# Check tests count  
python manage.py shell -c "from skills.models import TechnicalTest; print(f'Tests: {TechnicalTest.objects.count()}')"

# Check API endpoints
curl http://localhost:8000/api/skills/
curl http://localhost:8000/api/tests-alt/
```

## 🎯 Expected Result

After setup, users should see:
- **Skills organized by categories** (Programming, Frontend, Backend, Database, DevOps)
- **Add/Remove skills functionality** with proficiency levels
- **Technical tests** available based on selected skills
- **Working test interface** with timer and question navigation

This ensures all team members have the exact same skills management experience!
