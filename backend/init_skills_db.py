#!/usr/bin/env python
import os
import django
import sys

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'careerquest.settings')
sys.path.append('.')
django.setup()

from django.contrib.auth.models import User
from skills.models import Skill, CandidateProfile, TechnicalTest, TestQuestion

def init_database():
    print("🚀 Initialisation de la base de données Skills Assessment...")
    
    # Créer superuser
    if not User.objects.filter(username='admin').exists():
        User.objects.create_superuser('admin', 'admin@test.com', 'admin123')
        print('✅ Superuser créé: admin / admin123')
    else:
        print('ℹ️ Superuser admin existe déjà')
    
    # Créer les compétences
    skills_data = [
        ('Python', 'programming', 'Langage de programmation polyvalent et puissant'),
        ('JavaScript', 'programming', 'Langage pour le web frontend et backend'),
        ('Java', 'programming', 'Langage orienté objet robuste et populaire'),
        ('C#', 'programming', 'Langage Microsoft pour .NET'),
        ('PHP', 'programming', 'Langage web côté serveur'),
        ('TypeScript', 'programming', 'JavaScript avec typage statique'),
        
        ('React', 'frontend', 'Bibliothèque JavaScript pour interfaces utilisateur'),
        ('Vue.js', 'frontend', 'Framework JavaScript progressif'),
        ('Angular', 'frontend', 'Framework web TypeScript complet'),
        ('HTML', 'frontend', 'Langage de balisage pour le web'),
        ('CSS', 'frontend', 'Feuilles de style en cascade'),
        ('Sass/SCSS', 'frontend', 'Préprocesseur CSS'),
        
        ('Node.js', 'backend', 'Runtime JavaScript côté serveur'),
        ('Django', 'backend', 'Framework web Python'),
        ('Spring Boot', 'backend', 'Framework Java pour microservices'),
        ('Express.js', 'backend', 'Framework web Node.js minimaliste'),
        ('Laravel', 'backend', 'Framework PHP élégant'),
        
        ('MySQL', 'database', 'Système de gestion de base de données relationnelle'),
        ('PostgreSQL', 'database', 'Base de données relationnelle avancée'),
        ('MongoDB', 'database', 'Base de données NoSQL orientée documents'),
        ('Redis', 'database', 'Store de structure de données en mémoire'),
        ('SQLite', 'database', 'Base de données légère et autonome'),
        
        ('Docker', 'devops', 'Plateforme de conteneurisation'),
        ('AWS', 'devops', 'Services cloud Amazon'),
        ('Git', 'devops', 'Système de contrôle de version distribué'),
        ('Jenkins', 'devops', 'Serveur d\'intégration continue'),
        ('Kubernetes', 'devops', 'Orchestrateur de conteneurs'),
        
        ('React Native', 'mobile', 'Framework pour apps mobiles cross-platform'),
        ('Flutter', 'mobile', 'SDK UI de Google pour apps natives'),
        ('Swift', 'mobile', 'Langage pour le développement iOS'),
        ('Kotlin', 'mobile', 'Langage moderne pour Android'),
        
        ('Jest', 'testing', 'Framework de test JavaScript'),
        ('Pytest', 'testing', 'Framework de test Python'),
        ('Selenium', 'testing', 'Outil d\'automatisation de tests web'),
        ('JUnit', 'testing', 'Framework de test unitaire Java'),
    ]
    
    print(f'📝 Création de {len(skills_data)} compétences...')
    for name, category, description in skills_data:
        skill, created = Skill.objects.get_or_create(
            name=name,
            defaults={'category': category, 'description': description}
        )
        if created:
            print(f'✅ Compétence créée: {name}')
    
    # Créer des candidats d'exemple
    print('👥 Création de candidats d\'exemple...')
    
    # Candidat 1 - Développeur Full Stack
    user1, created = User.objects.get_or_create(
        username='candidat1',
        defaults={
            'email': 'candidat1@test.com',
            'first_name': 'Jean',
            'last_name': 'Dupont'
        }
    )
    if created:
        user1.set_password('password123')
        user1.save()
        
        candidate1, created = CandidateProfile.objects.get_or_create(
            user=user1,
            defaults={
                'first_name': 'Jean',
                'last_name': 'Dupont',
                'email': 'jean.dupont@test.com',
                'phone': '01 23 45 67 89'
            }
        )
        if created:
            # Ajouter compétences Full Stack
            skills_fullstack = ['JavaScript', 'React', 'Node.js', 'Python', 'Django', 'MySQL', 'Git']
            for skill_name in skills_fullstack:
                try:
                    skill = Skill.objects.get(name=skill_name)
                    candidate1.skills.add(skill)
                except Skill.DoesNotExist:
                    pass
            print('✅ Candidat Jean Dupont (Full Stack) créé')
    
    # Candidat 2 - Développeur Backend
    user2, created = User.objects.get_or_create(
        username='candidat2',
        defaults={
            'email': 'candidat2@test.com',
            'first_name': 'Marie',
            'last_name': 'Martin'
        }
    )
    if created:
        user2.set_password('password123')
        user2.save()
        
        candidate2, created = CandidateProfile.objects.get_or_create(
            user=user2,
            defaults={
                'first_name': 'Marie',
                'last_name': 'Martin',
                'email': 'marie.martin@test.com',
                'phone': '01 34 56 78 90'
            }
        )
        if created:
            # Ajouter compétences Backend
            skills_backend = ['Java', 'Spring Boot', 'PostgreSQL', 'Docker', 'AWS', 'Git']
            for skill_name in skills_backend:
                try:
                    skill = Skill.objects.get(name=skill_name)
                    candidate2.skills.add(skill)
                except Skill.DoesNotExist:
                    pass
            print('✅ Candidat Marie Martin (Backend) créé')
    
    # Créer des tests d'exemple
    print('🧪 Création de tests d\'exemple...')
    
    # Test JavaScript
    try:
        js_skill = Skill.objects.get(name='JavaScript')
        js_test, created = TechnicalTest.objects.get_or_create(
            test_name='Test JavaScript Fondamentaux',
            skill=js_skill,
            defaults={
                'description': 'Évaluation des connaissances de base en JavaScript',
                'instructions': 'Ce test évalue vos connaissances fondamentales en JavaScript. Vous avez 30 minutes pour répondre aux questions.',
                'total_score': 10,
                'time_limit': 30,
                'is_active': True
            }
        )
        
        if created:
            # Questions JavaScript
            questions = [
                {
                    'question': 'Qu\'est-ce que le hoisting en JavaScript ?',
                    'options': ['Une méthode pour optimiser le code', 'Le fait que les déclarations sont remontées en haut de leur scope', 'Une façon de créer des objets', 'Un type de boucle'],
                    'correct_answer': 'b',
                    'points': 2
                },
                {
                    'question': 'Quelle est la différence entre == et === ?',
                    'options': ['Aucune différence', '== compare les valeurs, === compare les valeurs et les types', '== est plus rapide', '=== est obsolète'],
                    'correct_answer': 'b',
                    'points': 2
                },
                {
                    'question': 'Comment déclarer une variable en JavaScript ES6+ ?',
                    'options': ['var seulement', 'let et const', 'declare', 'variable'],
                    'correct_answer': 'b',
                    'points': 2
                },
                {
                    'question': 'Que fait Array.prototype.map() ?',
                    'options': ['Modifie le tableau original', 'Crée un nouveau tableau transformé', 'Filtre les éléments', 'Trie le tableau'],
                    'correct_answer': 'b',
                    'points': 2
                },
                {
                    'question': 'Qu\'est-ce qu\'une fonction fléchée (arrow function) ?',
                    'options': ['Une fonction obsolète', 'Une syntaxe concise pour écrire des fonctions', 'Une fonction qui va vite', 'Un type de boucle'],
                    'correct_answer': 'b',
                    'points': 2
                }
            ]
            
            for i, q_data in enumerate(questions, 1):
                TestQuestion.objects.create(
                    test=js_test,
                    order=i,
                    question_text=q_data['question'],
                    option_a=q_data['options'][0],
                    option_b=q_data['options'][1],
                    option_c=q_data['options'][2],
                    option_d=q_data['options'][3],
                    correct_answer=q_data['correct_answer'],
                    points=q_data['points']
                )
            print('✅ Test JavaScript créé avec 5 questions')
    except Skill.DoesNotExist:
        print('❌ Compétence JavaScript non trouvée')
    
    # Test Python
    try:
        python_skill = Skill.objects.get(name='Python')
        python_test, created = TechnicalTest.objects.get_or_create(
            test_name='Test Python Fondamentaux',
            skill=python_skill,
            defaults={
                'description': 'Évaluation des connaissances de base en Python',
                'instructions': 'Ce test évalue vos connaissances fondamentales en Python. Vous avez 25 minutes pour répondre aux questions.',
                'total_score': 8,
                'time_limit': 25,
                'is_active': True
            }
        )
        
        if created:
            # Questions Python
            questions = [
                {
                    'question': 'Qu\'est-ce qu\'une list comprehension en Python ?',
                    'options': ['Une fonction built-in', 'Une façon concise de créer des listes', 'Un type de données', 'Une librairie'],
                    'correct_answer': 'b',
                    'points': 2
                },
                {
                    'question': 'Comment gérer les exceptions en Python ?',
                    'options': ['try/catch', 'try/except', 'catch/finally', 'handle/error'],
                    'correct_answer': 'b',
                    'points': 2
                },
                {
                    'question': 'Qu\'est-ce qu\'un décorateur en Python ?',
                    'options': ['Une fonction qui modifie une autre fonction', 'Un pattern de design', 'Une librairie', 'Un type de classe'],
                    'correct_answer': 'a',
                    'points': 2
                },
                {
                    'question': 'Quelle est la différence entre une liste et un tuple ?',
                    'options': ['Aucune différence', 'Les tuples sont mutables', 'Les listes sont mutables, les tuples non', 'Les tuples sont plus lents'],
                    'correct_answer': 'c',
                    'points': 2
                }
            ]
            
            for i, q_data in enumerate(questions, 1):
                TestQuestion.objects.create(
                    test=python_test,
                    order=i,
                    question_text=q_data['question'],
                    option_a=q_data['options'][0],
                    option_b=q_data['options'][1],
                    option_c=q_data['options'][2],
                    option_d=q_data['options'][3],
                    correct_answer=q_data['correct_answer'],
                    points=q_data['points']
                )
            print('✅ Test Python créé avec 4 questions')
    except Skill.DoesNotExist:
        print('❌ Compétence Python non trouvée')
    
    print('\n🎯 Initialisation terminée !')
    print('=================================')
    print('🌐 Admin Django: http://localhost:8000/admin')
    print('👤 Login: admin / admin123')
    print('')
    print('📊 Candidats créés:')
    print('  - Jean Dupont (candidat1 / password123)')
    print('  - Marie Martin (candidat2 / password123)')
    print('')
    print('🧪 Tests créés:')
    print('  - Test JavaScript Fondamentaux (10 points)')
    print('  - Test Python Fondamentaux (8 points)')
    print('')
    print('💡 Pour créer vos propres tests:')
    print('  1. Allez sur l\'admin Django')
    print('  2. Section "Tests Techniques"')
    print('  3. Cliquez "Ajouter"')
    print('  4. Collez votre JSON dans le champ prévu')
    print('=================================')

if __name__ == '__main__':
    init_database()
