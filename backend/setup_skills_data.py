#!/usr/bin/env python3
"""
Quick setup script for Skills Management System
Run with: python manage.py shell < setup_skills_data.py
"""

from skills.models import Skill, TechnicalTest, TestQuestion

def setup_skills():
    """Create all skills if they don't exist"""
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

    created_count = 0
    for skill_data in skills_data:
        skill, created = Skill.objects.get_or_create(
            name=skill_data['name'],
            defaults=skill_data
        )
        if created:
            print(f"✅ Created skill: {skill.name}")
            created_count += 1
        else:
            print(f"⚠️  Skill already exists: {skill.name}")
    
    print(f"\n📊 Summary: {created_count} new skills created, {Skill.objects.count()} total skills")

def setup_technical_tests():
    """Create technical tests with questions"""
    
    # Python Test
    try:
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
            print(f"✅ Created test: {python_test.test_name}")
            
            # Add Python questions
            python_questions = [
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
                },
                {
                    'order': 3,
                    'question_text': 'Quelle structure de données Python est ordonnée et modifiable?',
                    'option_a': 'tuple',
                    'option_b': 'set',
                    'option_c': 'list',
                    'option_d': 'frozenset',
                    'correct_answer': 'c',
                    'points': 5,
                    'explanation': 'Les listes sont ordonnées et modifiables en Python.'
                },
                {
                    'order': 4,
                    'question_text': 'Comment gérer les exceptions en Python?',
                    'option_a': 'try/catch',
                    'option_b': 'try/except',
                    'option_c': 'try/finally',
                    'option_d': 'catch/except',
                    'correct_answer': 'b',
                    'points': 5,
                    'explanation': 'Python utilise try/except pour la gestion des exceptions.'
                }
            ]
            
            for q_data in python_questions:
                TestQuestion.objects.create(test=python_test, **q_data)
            
            print(f"   Added {len(python_questions)} questions to Python test")
        else:
            print(f"⚠️  Test already exists: {python_test.test_name}")
    except Skill.DoesNotExist:
        print("❌ Python skill not found. Run setup_skills() first.")

    # React Test
    try:
        react_skill = Skill.objects.get(name='React')
        react_test, created = TechnicalTest.objects.get_or_create(
            test_name='Test React.js Expert',
            skill=react_skill,
            defaults={
                'description': 'Évaluation avancée des compétences React : hooks, state management, composants',
                'instructions': 'Questions sur React.js. Durée: 25 minutes.',
                'total_score': 15,
                'time_limit': 25,
                'is_active': True
            }
        )

        if created:
            print(f"✅ Created test: {react_test.test_name}")
            
            react_questions = [
                {
                    'order': 1,
                    'question_text': 'Quel hook React utilise-t-on pour gérer l\'état local d\'un composant?',
                    'option_a': 'useEffect',
                    'option_b': 'useState',
                    'option_c': 'useContext',
                    'option_d': 'useReducer',
                    'correct_answer': 'b',
                    'points': 5,
                    'explanation': 'useState est le hook principal pour gérer l\'état local dans React.'
                },
                {
                    'order': 2,
                    'question_text': 'Quand useEffect s\'exécute-t-il par défaut?',
                    'option_a': 'Avant le rendu',
                    'option_b': 'Après chaque rendu',
                    'option_c': 'Une seule fois au montage',
                    'option_d': 'Jamais',
                    'correct_answer': 'b',
                    'points': 5,
                    'explanation': 'useEffect s\'exécute après chaque rendu par défaut.'
                },
                {
                    'order': 3,
                    'question_text': 'Comment éviter les re-rendus inutiles en React?',
                    'option_a': 'React.memo',
                    'option_b': 'useMemo',
                    'option_c': 'useCallback',
                    'option_d': 'Toutes les réponses',
                    'correct_answer': 'd',
                    'points': 5,
                    'explanation': 'React.memo, useMemo et useCallback aident tous à optimiser les performances.'
                }
            ]
            
            for q_data in react_questions:
                TestQuestion.objects.create(test=react_test, **q_data)
                
            print(f"   Added {len(react_questions)} questions to React test")
        else:
            print(f"⚠️  Test already exists: {react_test.test_name}")
    except Skill.DoesNotExist:
        print("❌ React skill not found. Run setup_skills() first.")

    # Django Test
    try:
        django_skill = Skill.objects.get(name='Django')
        django_test, created = TechnicalTest.objects.get_or_create(
            test_name='Test Django Framework',
            skill=django_skill,
            defaults={
                'description': 'Test complet sur Django : modèles, vues, templates, ORM',
                'instructions': 'Évaluation Django. Temps accordé: 35 minutes.',
                'total_score': 25,
                'time_limit': 35,
                'is_active': True
            }
        )

        if created:
            print(f"✅ Created test: {django_test.test_name}")
            
            django_questions = [
                {
                    'order': 1,
                    'question_text': 'Quelle commande Django permet de créer les tables en base de données?',
                    'option_a': 'python manage.py makemigrations',
                    'option_b': 'python manage.py migrate',
                    'option_c': 'python manage.py runserver',
                    'option_d': 'python manage.py shell',
                    'correct_answer': 'b',
                    'points': 5,
                    'explanation': 'migrate applique les migrations et crée/modifie les tables en base.'
                },
                {
                    'order': 2,
                    'question_text': 'Quel est le pattern architectural utilisé par Django?',
                    'option_a': 'MVC',
                    'option_b': 'MVP',
                    'option_c': 'MVT',
                    'option_d': 'MVVM',
                    'correct_answer': 'c',
                    'points': 5,
                    'explanation': 'Django utilise le pattern MVT (Model-View-Template).'
                },
                {
                    'order': 3,
                    'question_text': 'Comment définir une relation many-to-many en Django?',
                    'option_a': 'ForeignKey',
                    'option_b': 'OneToOneField',
                    'option_c': 'ManyToManyField',
                    'option_d': 'RelatedField',
                    'correct_answer': 'c',
                    'points': 5,
                    'explanation': 'ManyToManyField définit une relation plusieurs-à-plusieurs.'
                },
                {
                    'order': 4,
                    'question_text': 'Quel fichier contient la configuration principale d\'un projet Django?',
                    'option_a': 'urls.py',
                    'option_b': 'views.py',
                    'option_c': 'settings.py',
                    'option_d': 'models.py',
                    'correct_answer': 'c',
                    'points': 5,
                    'explanation': 'settings.py contient toute la configuration du projet Django.'
                },
                {
                    'order': 5,
                    'question_text': 'Comment créer un superutilisateur Django?',
                    'option_a': 'python manage.py createuser',
                    'option_b': 'python manage.py createsuperuser',
                    'option_c': 'python manage.py adduser',
                    'option_d': 'python manage.py admin',
                    'correct_answer': 'b',
                    'points': 5,
                    'explanation': 'createsuperuser crée un utilisateur avec accès admin.'
                }
            ]
            
            for q_data in django_questions:
                TestQuestion.objects.create(test=django_test, **q_data)
                
            print(f"   Added {len(django_questions)} questions to Django test")
        else:
            print(f"⚠️  Test already exists: {django_test.test_name}")
    except Skill.DoesNotExist:
        print("❌ Django skill not found. Run setup_skills() first.")

    print(f"\n📊 Tests Summary: {TechnicalTest.objects.count()} total tests available")

def main():
    """Run complete setup"""
    print("🚀 Setting up Skills Management System...")
    print("=" * 50)
    
    print("\n1️⃣ Setting up skills...")
    setup_skills()
    
    print("\n2️⃣ Setting up technical tests...")
    setup_technical_tests()
    
    print("\n✅ Setup completed! Skills and tests are ready.")
    print("\n📋 Verification:")
    print(f"   - Skills created: {Skill.objects.count()}")
    print(f"   - Tests created: {TechnicalTest.objects.count()}")
    print(f"   - Questions created: {TestQuestion.objects.count()}")
    
    print("\n🎯 Next steps:")
    print("   1. Start backend: python manage.py runserver")
    print("   2. Start frontend: npm run dev")
    print("   3. Access skills management in the dashboard")

if __name__ == "__main__":
    main()
