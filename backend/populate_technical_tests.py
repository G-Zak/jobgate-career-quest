#!/usr/bin/env python3
"""
Comprehensive script to populate technical tests with questions of varying difficulty levels
"""

import os
import sys
import django

# Setup Django environment
sys.path.append('/Users/zakariaguennani/Documents/Dev/EMSI/Internship/jobgate-career-quest/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'careerquest.settings')
django.setup()

from testsengine.models import Test, Question
from skills.models import Skill
from django.contrib.auth.models import User

def create_comprehensive_tests():
    """Create technical tests with mixed difficulty levels"""
    
    # Clear existing technical tests
    Test.objects.filter(test_type='technical').delete()
    print("🧹 Cleared existing technical tests")
    
    # Ensure skills exist
    skills_data = [
        ('Python', 'programming', 'Python programming language'),
        ('JavaScript', 'programming', 'JavaScript programming language'),
        ('React', 'frontend', 'React.js framework'),
        ('Django', 'backend', 'Django web framework'),
        ('Node.js', 'backend', 'Node.js runtime environment'),
        ('SQL', 'database', 'Structured Query Language'),
        ('Docker', 'devops', 'Docker containerization'),
        ('Git', 'tools', 'Git version control'),
    ]
    
    created_skills = {}
    for name, category, description in skills_data:
        skill, created = Skill.objects.get_or_create(
            name=name,
            defaults={'category': category, 'description': description}
        )
        created_skills[name] = skill
        if created:
            print(f"✅ Created skill: {name}")
    
    # Define comprehensive test data with mixed difficulty levels
    tests_data = {
        'Python': {
            'title': 'Test Python - Compétences Générales',
            'description': 'Évaluation complète des compétences Python (Débutant à Avancé)',
            'duration_minutes': 45,
            'total_questions': 15,
            'passing_score': 60,
            'questions': [
                # DÉBUTANT Level (5 questions)
                {
                    'question_text': 'Quelle est la syntaxe correcte pour créer une liste en Python ?',
                    'options': ['my_list = []', 'my_list = ()', 'my_list = {}', 'my_list = <>'],
                    'correct_answer': 'A',
                    'difficulty': 'beginner',
                    'points': 2
                },
                {
                    'question_text': 'Comment afficher "Hello World" en Python ?',
                    'options': ['echo("Hello World")', 'print("Hello World")', 'console.log("Hello World")', 'printf("Hello World")'],
                    'correct_answer': 'B',
                    'difficulty': 'beginner',
                    'points': 2
                },
                {
                    'question_text': 'Quel type de données représente le nombre 3.14 en Python ?',
                    'options': ['int', 'float', 'string', 'boolean'],
                    'correct_answer': 'B',
                    'difficulty': 'beginner',
                    'points': 2
                },
                {
                    'question_text': 'Comment créer une variable nommée "age" avec la valeur 25 ?',
                    'options': ['var age = 25', 'int age = 25', 'age = 25', 'age := 25'],
                    'correct_answer': 'C',
                    'difficulty': 'beginner',
                    'points': 2
                },
                {
                    'question_text': 'Quelle méthode permet d\'ajouter un élément à la fin d\'une liste ?',
                    'options': ['add()', 'append()', 'insert()', 'push()'],
                    'correct_answer': 'B',
                    'difficulty': 'beginner',
                    'points': 2
                },
                
                # INTERMÉDIAIRE Level (7 questions)
                {
                    'question_text': 'Que retourne cette expression: [x**2 for x in range(5)]',
                    'options': ['[0, 1, 4, 9, 16]', '[1, 4, 9, 16, 25]', '[0, 1, 2, 3, 4]', '[1, 2, 3, 4, 5]'],
                    'correct_answer': 'A',
                    'difficulty': 'intermediate',
                    'points': 4
                },
                {
                    'question_text': 'Quelle est la différence entre une liste et un tuple en Python ?',
                    'options': ['Les tuples sont mutables, les listes ne le sont pas', 'Les listes sont mutables, les tuples ne le sont pas', 'Il n\'y a aucune différence', 'Les tuples ne peuvent contenir que des nombres'],
                    'correct_answer': 'B',
                    'difficulty': 'intermediate',
                    'points': 4
                },
                {
                    'question_text': 'Comment gérer une exception en Python ?',
                    'options': ['try/catch', 'try/except', 'try/finally', 'catch/throw'],
                    'correct_answer': 'B',
                    'difficulty': 'intermediate',
                    'points': 4
                },
                {
                    'question_text': 'Que fait la méthode join() sur une chaîne de caractères ?',
                    'options': ['Sépare une chaîne', 'Joint des éléments avec un séparateur', 'Supprime des espaces', 'Convertit en majuscules'],
                    'correct_answer': 'B',
                    'difficulty': 'intermediate',
                    'points': 4
                },
                {
                    'question_text': 'Comment définir une fonction avec un paramètre par défaut ?',
                    'options': ['def func(x=5):', 'def func(x:=5):', 'def func(x default 5):', 'def func(x || 5):'],
                    'correct_answer': 'A',
                    'difficulty': 'intermediate',
                    'points': 4
                },
                {
                    'question_text': 'Quelle est la sortie de: dict.get("key", "default")',
                    'options': ['Retourne la valeur ou lève une erreur', 'Retourne la valeur ou "default"', 'Retourne toujours None', 'Retourne toujours "default"'],
                    'correct_answer': 'B',
                    'difficulty': 'intermediate',
                    'points': 4
                },
                {
                    'question_text': 'Comment créer un générateur en Python ?',
                    'options': ['Avec return', 'Avec yield', 'Avec generate', 'Avec create'],
                    'correct_answer': 'B',
                    'difficulty': 'intermediate',
                    'points': 4
                },
                
                # AVANCÉ Level (3 questions)
                {
                    'question_text': 'Qu\'est-ce qu\'un décorateur en Python ?',
                    'options': ['Une fonction qui modifie le comportement d\'une autre fonction', 'Un type de variable', 'Une méthode de classe', 'Un module externe'],
                    'correct_answer': 'A',
                    'difficulty': 'advanced',
                    'points': 6
                },
                {
                    'question_text': 'Comment fonctionne le GIL (Global Interpreter Lock) en Python ?',
                    'options': ['Permet le vrai multithreading', 'Empêche l\'exécution simultanée de bytecode Python', 'Gère la mémoire automatiquement', 'Optimise les boucles'],
                    'correct_answer': 'B',
                    'difficulty': 'advanced',
                    'points': 6
                },
                {
                    'question_text': 'Quelle est la différence entre __str__ et __repr__ ?',
                    'options': ['Aucune différence', '__str__ pour les humains, __repr__ pour les développeurs', '__repr__ pour les humains, __str__ pour les développeurs', 'Ils font la même chose'],
                    'correct_answer': 'B',
                    'difficulty': 'advanced',
                    'points': 6
                }
            ]
        },
        
        'JavaScript': {
            'title': 'Test JavaScript - Frontend & Backend',
            'description': 'Évaluation JavaScript complète tous niveaux',
            'duration_minutes': 40,
            'total_questions': 12,
            'passing_score': 65,
            'questions': [
                # DÉBUTANT (4 questions)
                {
                    'question_text': 'Comment déclarer une variable en JavaScript ES6 ?',
                    'options': ['var x = 5', 'let x = 5', 'const x = 5', 'Toutes les réponses'],
                    'correct_answer': 'D',
                    'difficulty': 'beginner',
                    'points': 2
                },
                {
                    'question_text': 'Quelle méthode ajoute un élément à la fin d\'un tableau ?',
                    'options': ['push()', 'add()', 'append()', 'insert()'],
                    'correct_answer': 'A',
                    'difficulty': 'beginner',
                    'points': 2
                },
                {
                    'question_text': 'Comment afficher dans la console ?',
                    'options': ['print()', 'console.log()', 'echo()', 'display()'],
                    'correct_answer': 'B',
                    'difficulty': 'beginner',
                    'points': 2
                },
                {
                    'question_text': 'Quel opérateur compare la valeur ET le type ?',
                    'options': ['==', '===', '!=', '!=='],
                    'correct_answer': 'B',
                    'difficulty': 'beginner',
                    'points': 2
                },
                
                # INTERMÉDIAIRE (5 questions)
                {
                    'question_text': 'Qu\'est-ce que le hoisting en JavaScript ?',
                    'options': ['Élévation des déclarations', 'Optimisation du code', 'Gestion d\'erreurs', 'Création d\'objets'],
                    'correct_answer': 'A',
                    'difficulty': 'intermediate',
                    'points': 4
                },
                {
                    'question_text': 'Comment créer une promesse en JavaScript ?',
                    'options': ['new Promise()', 'Promise.create()', 'makePromise()', 'Promise.new()'],
                    'correct_answer': 'A',
                    'difficulty': 'intermediate',
                    'points': 4
                },
                {
                    'question_text': 'Que fait la méthode map() sur un tableau ?',
                    'options': ['Filtre les éléments', 'Transforme chaque élément', 'Trie le tableau', 'Trouve un élément'],
                    'correct_answer': 'B',
                    'difficulty': 'intermediate',
                    'points': 4
                },
                {
                    'question_text': 'Comment définir une fonction fléchée ?',
                    'options': ['function() => {}', '() => {}', '=> function() {}', 'arrow function() {}'],
                    'correct_answer': 'B',
                    'difficulty': 'intermediate',
                    'points': 4
                },
                {
                    'question_text': 'Qu\'est-ce que le destructuring ?',
                    'options': ['Suppression d\'objets', 'Extraction de propriétés', 'Destruction de variables', 'Nettoyage mémoire'],
                    'correct_answer': 'B',
                    'difficulty': 'intermediate',
                    'points': 4
                },
                
                # AVANCÉ (3 questions)
                {
                    'question_text': 'Comment fonctionne l\'Event Loop en JavaScript ?',
                    'options': ['Exécution synchrone uniquement', 'Gestion de la pile d\'appels et de la queue', 'Multithreading natif', 'Parallélisme automatique'],
                    'correct_answer': 'B',
                    'difficulty': 'advanced',
                    'points': 6
                },
                {
                    'question_text': 'Qu\'est-ce qu\'une closure en JavaScript ?',
                    'options': ['Fermeture de fonction', 'Accès aux variables du scope parent', 'Type de boucle', 'Méthode d\'objet'],
                    'correct_answer': 'B',
                    'difficulty': 'advanced',
                    'points': 6
                },
                {
                    'question_text': 'Comment implémenter l\'héritage avec les classes ES6 ?',
                    'options': ['extends', 'inherits', 'prototype', 'super()'],
                    'correct_answer': 'A',
                    'difficulty': 'advanced',
                    'points': 6
                }
            ]
        },
        
        'React': {
            'title': 'Test React.js - Développement Frontend',
            'description': 'Évaluation React.js du débutant à l\'expert',
            'duration_minutes': 35,
            'total_questions': 10,
            'passing_score': 70,
            'questions': [
                # DÉBUTANT (3 questions)
                {
                    'question_text': 'Qu\'est-ce que JSX en React ?',
                    'options': ['Un langage de programmation', 'Une extension de syntaxe JavaScript', 'Une base de données', 'Un serveur web'],
                    'correct_answer': 'B',
                    'difficulty': 'beginner',
                    'points': 3
                },
                {
                    'question_text': 'Comment créer un composant fonctionnel en React ?',
                    'options': ['class Component extends React.Component', 'function Component() {}', 'new Component()', 'Component.create()'],
                    'correct_answer': 'B',
                    'difficulty': 'beginner',
                    'points': 3
                },
                {
                    'question_text': 'Quelle méthode permet de mettre à jour le state ?',
                    'options': ['updateState()', 'setState()', 'changeState()', 'modifyState()'],
                    'correct_answer': 'B',
                    'difficulty': 'beginner',
                    'points': 3
                },
                
                # INTERMÉDIAIRE (4 questions)
                {
                    'question_text': 'À quoi sert useEffect en React ?',
                    'options': ['Gérer le state', 'Gérer les effets de bord', 'Créer des composants', 'Gérer les props'],
                    'correct_answer': 'B',
                    'difficulty': 'intermediate',
                    'points': 5
                },
                {
                    'question_text': 'Comment passer des données d\'un parent à un enfant ?',
                    'options': ['Via state', 'Via props', 'Via context', 'Via refs'],
                    'correct_answer': 'B',
                    'difficulty': 'intermediate',
                    'points': 5
                },
                {
                    'question_text': 'Qu\'est-ce que le Virtual DOM ?',
                    'options': ['Une copie du DOM réel en mémoire', 'Un serveur virtuel', 'Une base de données', 'Un composant React'],
                    'correct_answer': 'A',
                    'difficulty': 'intermediate',
                    'points': 5
                },
                {
                    'question_text': 'Comment gérer les formulaires en React ?',
                    'options': ['Composants contrôlés', 'Composants non contrôlés', 'Les deux approches', 'Aucune des deux'],
                    'correct_answer': 'C',
                    'difficulty': 'intermediate',
                    'points': 5
                },
                
                # AVANCÉ (3 questions)
                {
                    'question_text': 'Qu\'est-ce que React.memo() ?',
                    'options': ['Un hook de mémoire', 'Un HOC pour optimiser les rendus', 'Une méthode de stockage', 'Un gestionnaire d\'état'],
                    'correct_answer': 'B',
                    'difficulty': 'advanced',
                    'points': 7
                },
                {
                    'question_text': 'Comment optimiser les performances d\'une liste React ?',
                    'options': ['Utiliser des keys uniques', 'React.memo', 'useMemo/useCallback', 'Toutes les réponses'],
                    'correct_answer': 'D',
                    'difficulty': 'advanced',
                    'points': 7
                },
                {
                    'question_text': 'Qu\'est-ce que le Context API ?',
                    'options': ['Gestion globale d\'état', 'Composant de routage', 'Gestionnaire d\'événements', 'API de contexte serveur'],
                    'correct_answer': 'A',
                    'difficulty': 'advanced',
                    'points': 7
                }
            ]
        },
        
        'Django': {
            'title': 'Test Django - Framework Web Python',
            'description': 'Évaluation Django complète',
            'duration_minutes': 40,
            'total_questions': 12,
            'passing_score': 65,
            'questions': [
                # DÉBUTANT (4 questions)
                {
                    'question_text': 'Qu\'est-ce qu\'un modèle Django ?',
                    'options': ['Une vue', 'Une représentation de données en base', 'Un template', 'Un formulaire'],
                    'correct_answer': 'B',
                    'difficulty': 'beginner',
                    'points': 2
                },
                {
                    'question_text': 'Comment créer un projet Django ?',
                    'options': ['django create project', 'django-admin startproject', 'python manage.py startproject', 'django new project'],
                    'correct_answer': 'B',
                    'difficulty': 'beginner',
                    'points': 2
                },
                {
                    'question_text': 'Quel fichier contient les paramètres du projet ?',
                    'options': ['config.py', 'settings.py', 'params.py', 'django.py'],
                    'correct_answer': 'B',
                    'difficulty': 'beginner',
                    'points': 2
                },
                {
                    'question_text': 'Comment démarrer le serveur de développement ?',
                    'options': ['python manage.py runserver', 'django runserver', 'python runserver', 'manage.py start'],
                    'correct_answer': 'A',
                    'difficulty': 'beginner',
                    'points': 2
                },
                
                # INTERMÉDIAIRE (5 questions)
                {
                    'question_text': 'Qu\'est-ce qu\'une migration Django ?',
                    'options': ['Déplacement de fichiers', 'Changement de structure de base de données', 'Sauvegarde', 'Import de données'],
                    'correct_answer': 'B',
                    'difficulty': 'intermediate',
                    'points': 4
                },
                {
                    'question_text': 'Comment définir une relation Many-to-Many ?',
                    'options': ['ForeignKey', 'OneToOneField', 'ManyToManyField', 'RelatedField'],
                    'correct_answer': 'C',
                    'difficulty': 'intermediate',
                    'points': 4
                },
                {
                    'question_text': 'Qu\'est-ce que l\'ORM Django ?',
                    'options': ['Object-Relational Mapping', 'Optimized Request Manager', 'Organized Response Model', 'Object Resource Manager'],
                    'correct_answer': 'A',
                    'difficulty': 'intermediate',
                    'points': 4
                },
                {
                    'question_text': 'Comment créer une vue basée sur une classe ?',
                    'options': ['def view(request):', 'class MyView(View):', 'function MyView():', 'view = View()'],
                    'correct_answer': 'B',
                    'difficulty': 'intermediate',
                    'points': 4
                },
                {
                    'question_text': 'Qu\'est-ce que Django REST Framework ?',
                    'options': ['Un module de test', 'Un framework pour créer des APIs', 'Un gestionnaire de templates', 'Un ORM alternatif'],
                    'correct_answer': 'B',
                    'difficulty': 'intermediate',
                    'points': 4
                },
                
                # AVANCÉ (3 questions)
                {
                    'question_text': 'Comment optimiser les requêtes Django ORM ?',
                    'options': ['select_related() et prefetch_related()', 'only() et defer()', 'Les deux approches', 'Aucune optimisation nécessaire'],
                    'correct_answer': 'C',
                    'difficulty': 'advanced',
                    'points': 6
                },
                {
                    'question_text': 'Qu\'est-ce qu\'un middleware Django ?',
                    'options': ['Un composant qui traite les requêtes/réponses', 'Un type de modèle', 'Une vue spéciale', 'Un template filter'],
                    'correct_answer': 'A',
                    'difficulty': 'advanced',
                    'points': 6
                },
                {
                    'question_text': 'Comment implémenter la mise en cache Django ?',
                    'options': ['Redis uniquement', 'Memcached uniquement', 'Cache framework intégré', 'Pas de cache disponible'],
                    'correct_answer': 'C',
                    'difficulty': 'advanced',
                    'points': 6
                }
            ]
        },
        
        'SQL': {
            'title': 'Test SQL - Bases de Données',
            'description': 'Évaluation des compétences SQL',
            'duration_minutes': 30,
            'total_questions': 10,
            'passing_score': 60,
            'questions': [
                # DÉBUTANT (4 questions)
                {
                    'question_text': 'Quelle commande SQL permet de récupérer des données ?',
                    'options': ['GET', 'SELECT', 'FETCH', 'RETRIEVE'],
                    'correct_answer': 'B',
                    'difficulty': 'beginner',
                    'points': 2
                },
                {
                    'question_text': 'Comment filtrer les résultats dans une requête SELECT ?',
                    'options': ['FILTER', 'WHERE', 'HAVING', 'IF'],
                    'correct_answer': 'B',
                    'difficulty': 'beginner',
                    'points': 2
                },
                {
                    'question_text': 'Quelle commande insère des données ?',
                    'options': ['ADD', 'INSERT', 'CREATE', 'PUT'],
                    'correct_answer': 'B',
                    'difficulty': 'beginner',
                    'points': 2
                },
                {
                    'question_text': 'Comment trier les résultats ?',
                    'options': ['SORT BY', 'ORDER BY', 'ARRANGE BY', 'GROUP BY'],
                    'correct_answer': 'B',
                    'difficulty': 'beginner',
                    'points': 2
                },
                
                # INTERMÉDIAIRE (4 questions)
                {
                    'question_text': 'Qu\'est-ce qu\'un INNER JOIN ?',
                    'options': ['Joint toutes les lignes', 'Joint les lignes qui correspondent dans les deux tables', 'Joint la table de gauche', 'Joint la table de droite'],
                    'correct_answer': 'B',
                    'difficulty': 'intermediate',
                    'points': 4
                },
                {
                    'question_text': 'Quelle fonction compte le nombre de lignes ?',
                    'options': ['SUM()', 'COUNT()', 'TOTAL()', 'NUMBER()'],
                    'correct_answer': 'B',
                    'difficulty': 'intermediate',
                    'points': 4
                },
                {
                    'question_text': 'Comment éviter les doublons dans les résultats ?',
                    'options': ['UNIQUE', 'DISTINCT', 'DIFFERENT', 'SINGLE'],
                    'correct_answer': 'B',
                    'difficulty': 'intermediate',
                    'points': 4
                },
                {
                    'question_text': 'Qu\'est-ce qu\'une clé étrangère ?',
                    'options': ['Une clé primaire', 'Une référence à une clé primaire d\'une autre table', 'Une clé unique', 'Une clé de cryptage'],
                    'correct_answer': 'B',
                    'difficulty': 'intermediate',
                    'points': 4
                },
                
                # AVANCÉ (2 questions)
                {
                    'question_text': 'Qu\'est-ce qu\'une vue (VIEW) en SQL ?',
                    'options': ['Une table physique', 'Une requête stockée comme une table virtuelle', 'Un index', 'Une procédure'],
                    'correct_answer': 'B',
                    'difficulty': 'advanced',
                    'points': 6
                },
                {
                    'question_text': 'Comment optimiser une requête SQL lente ?',
                    'options': ['Ajouter des index', 'Optimiser les JOIN', 'Éviter SELECT *', 'Toutes les réponses'],
                    'correct_answer': 'D',
                    'difficulty': 'advanced',
                    'points': 6
                }
            ]
        }
    }
    
    # Create tests and questions
    for skill_name, test_data in tests_data.items():
        try:
            skill = created_skills[skill_name]
            
            # Create the test
            test = Test.objects.create(
                title=test_data['title'],
                description=test_data['description'],
                duration_minutes=test_data['duration_minutes'],
                total_questions=test_data['total_questions'],
                passing_score=test_data['passing_score'],
                test_type='technical',
                is_active=True
            )
            
            print(f"✅ Created test: {test.title}")
            
            # Create questions
            for i, question_data in enumerate(test_data['questions'], 1):
                question = Question.objects.create(
                    test=test,
                    question_type='multiple_choice',
                    question_text=question_data['question_text'],
                    options=question_data['options'],
                    correct_answer=question_data['correct_answer'],
                    difficulty_level='easy' if question_data['difficulty'] == 'beginner' else 
                                   'medium' if question_data['difficulty'] == 'intermediate' else 'hard',
                    order=i,
                    explanation=f"Question de niveau {question_data['difficulty']} - {question_data['points']} points"
                )
            
            print(f"   📝 Added {len(test_data['questions'])} questions")
            
        except Exception as e:
            print(f"❌ Error creating test for {skill_name}: {e}")
    
    # Create test summary
    print(f"\n🎯 SUMMARY:")
    print(f"📊 Total Tests Created: {Test.objects.filter(test_type='technical').count()}")
    print(f"📝 Total Questions: {Question.objects.filter(test__test_type='technical').count()}")
    
    # Show test distribution by difficulty
    for test in Test.objects.filter(test_type='technical'):
        questions = test.questions.all()
        beginner = sum(1 for q in questions if 'débutant' in q.explanation.lower() or 'beginner' in q.explanation.lower())
        intermediate = sum(1 for q in questions if 'intermédiaire' in q.explanation.lower() or 'intermediate' in q.explanation.lower())
        advanced = sum(1 for q in questions if 'avancé' in q.explanation.lower() or 'advanced' in q.explanation.lower())
        
        print(f"   {test.title}:")
        print(f"     🟢 Débutant: {beginner} questions")
        print(f"     🟡 Intermédiaire: {intermediate} questions") 
        print(f"     🔴 Avancé: {advanced} questions")
    
    print(f"\n✅ Technical tests population completed!")

if __name__ == '__main__':
    create_comprehensive_tests()
