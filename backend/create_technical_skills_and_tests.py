#!/usr/bin/env python3
"""
Script pour créer les compétences techniques et les tests QCM manquants
"""

import os
import sys
import django

# Configuration Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'careerquest.settings')
django.setup()

from skills.models import Skill, TechnicalTest, TestQuestion, TestOption

def create_skills():
    """Créer les compétences techniques manquantes"""
    skills_to_create = [
        {'name': 'Python', 'category': 'Programming Languages', 'description': 'Langage de programmation polyvalent'},
        {'name': 'Java', 'category': 'Programming Languages', 'description': 'Langage de programmation orienté objet'},
        {'name': 'JavaScript', 'category': 'Programming Languages', 'description': 'Langage de programmation pour le web'},
        {'name': 'C', 'category': 'Programming Languages', 'description': 'Langage de programmation système'},
        {'name': 'OSI', 'category': 'Network', 'description': 'Modèle OSI des réseaux'},
    ]
    
    created_skills = {}
    for skill_data in skills_to_create:
        skill, created = Skill.objects.get_or_create(
            name=skill_data['name'],
            defaults={
                'category': skill_data['category'],
                'description': skill_data['description']
            }
        )
        created_skills[skill_data['name']] = skill
        print(f"{'Créé' if created else 'Existe déjà'}: {skill.name}")
    
    return created_skills

def create_python_test(python_skill):
    """Créer un test QCM pour Python"""
    test, created = TechnicalTest.objects.get_or_create(
        test_name="Test Python - Fondamentaux",
        defaults={
            'skill': python_skill,
            'description': "Test des connaissances fondamentales en Python",
            'duration_minutes': 30,
            'passing_score': 70,
            'is_active': True
        }
    )
    
    if not created:
        print(f"Test Python existe déjà: {test.test_name}")
        return test
    
    print(f"Créé: {test.test_name}")
    
    # Questions Python
    python_questions = [
        {
            'question_text': "Quel est le résultat de l'expression suivante en Python: len([1, 2, 3, [4, 5]])?",
            'options': ['3', '4', '5', 'Erreur'],
            'correct': 1,  # '4'
            'explanation': "La fonction len() compte le nombre d'éléments au premier niveau de la liste."
        },
        {
            'question_text': "Quelle est la différence entre 'is' et '==' en Python?",
            'options': [
                "'is' compare les valeurs, '==' compare les identités",
                "'is' compare les identités, '==' compare les valeurs", 
                "Il n'y a pas de différence",
                "'is' est plus rapide que '=='"
            ],
            'correct': 1,
            'explanation': "'is' vérifie si deux variables pointent vers le même objet en mémoire, '==' vérifie si les valeurs sont égales."
        },
        {
            'question_text': "Que fait le mot-clé 'pass' en Python?",
            'options': [
                "Il termine le programme",
                "Il ne fait rien - c'est un placeholder",
                "Il passe à la ligne suivante",
                "Il lève une exception"
            ],
            'correct': 1,
            'explanation': "'pass' est une instruction nulle qui ne fait rien. Elle est utilisée comme placeholder."
        },
        {
            'question_text': "Quelle est la sortie de ce code: print(3 * 'Python')?",
            'options': ['PythonPythonPython', 'Python3', 'PythonPython', 'Erreur'],
            'correct': 0,
            'explanation': "L'opérateur * avec une chaîne la répète le nombre de fois spécifié."
        },
        {
            'question_text': "Comment créer une liste vide en Python?",
            'options': ['list()', '[]', 'empty_list()', 'Toutes les réponses ci-dessus'],
            'correct': 3,
            'explanation': "On peut créer une liste vide avec [] ou list()."
        },
        {
            'question_text': "Quelle méthode permet d'ajouter un élément à la fin d'une liste?",
            'options': ['add()', 'append()', 'insert()', 'push()'],
            'correct': 1,
            'explanation': "La méthode append() ajoute un élément à la fin d'une liste."
        },
        {
            'question_text': "Que retourne l'expression 'Hello'[1:3] en Python?",
            'options': ['He', 'el', 'ell', 'Hello'],
            'correct': 1,
            'explanation': "Le slicing [1:3] retourne les caractères de l'index 1 inclus à 3 exclu."
        },
        {
            'question_text': "Quel type de données Python est ordonné et modifiable?",
            'options': ['tuple', 'set', 'list', 'dict'],
            'correct': 2,
            'explanation': "Les listes sont ordonnées et modifiables en Python."
        },
        {
            'question_text': "Comment définir une fonction en Python?",
            'options': ['function myFunc():', 'def myFunc():', 'func myFunc():', 'define myFunc():'],
            'correct': 1,
            'explanation': "Le mot-clé 'def' est utilisé pour définir une fonction en Python."
        },
        {
            'question_text': "Quelle est la différence entre une liste et un tuple en Python?",
            'options': [
                "Aucune différence",
                "Les listes sont modifiables, les tuples sont immutables",
                "Les tuples sont plus rapides",
                "Les listes utilisent [] et les tuples utilisent ()"
            ],
            'correct': 1,
            'explanation': "La principale différence est que les listes sont modifiables (mutables) tandis que les tuples sont immutables."
        }
    ]
    
    for i, q_data in enumerate(python_questions):
        question = TestQuestion.objects.create(
            test=test,
            question_text=q_data['question_text'],
            question_type='multiple_choice',
            points=10,
            order=i + 1,
            explanation=q_data['explanation']
        )
        
        for j, option_text in enumerate(q_data['options']):
            TestOption.objects.create(
                question=question,
                option_text=option_text,
                is_correct=(j == q_data['correct']),
                order=j + 1
            )
    
    return test

def create_java_test(java_skill):
    """Créer un test QCM pour Java"""
    test, created = TechnicalTest.objects.get_or_create(
        test_name="Test Java - Programmation Orientée Objet",
        defaults={
            'skill': java_skill,
            'description': "Test des concepts fondamentaux de Java et POO",
            'duration_minutes': 35,
            'passing_score': 70,
            'is_active': True
        }
    )
    
    if not created:
        print(f"Test Java existe déjà: {test.test_name}")
        return test
    
    print(f"Créé: {test.test_name}")
    
    java_questions = [
        {
            'question_text': "Quelle est la caractéristique principale de Java?",
            'options': [
                "Compilé vers code machine",
                "Interprété ligne par ligne", 
                "Compilé vers bytecode puis interprété par JVM",
                "Uniquement orienté objet"
            ],
            'correct': 2,
            'explanation': "Java est compilé vers bytecode qui est ensuite interprété par la JVM."
        },
        {
            'question_text': "Que signifie 'public static void main(String[] args)'?",
            'options': [
                "Point d'entrée du programme",
                "Méthode privée",
                "Constructeur de classe",
                "Méthode d'instance"
            ],
            'correct': 0,
            'explanation': "public static void main est le point d'entrée standard d'un programme Java."
        },
        {
            'question_text': "Quelle est la différence entre '==' et '.equals()' en Java?",
            'options': [
                "Aucune différence",
                "'==' compare les références, '.equals()' compare le contenu",
                "'==' compare le contenu, '.equals()' compare les références",
                "'.equals()' est plus rapide"
            ],
            'correct': 1,
            'explanation': "'==' compare les références d'objets, '.equals()' compare le contenu des objets."
        },
        {
            'question_text': "Qu'est-ce que l'encapsulation en Java?",
            'options': [
                "Masquer les détails d'implémentation",
                "Créer plusieurs classes",
                "Utiliser des interfaces",
                "Hériter d'une classe parent"
            ],
            'correct': 0,
            'explanation': "L'encapsulation consiste à masquer les détails d'implémentation interne d'une classe."
        },
        {
            'question_text': "Quel mot-clé permet d'hériter d'une classe en Java?",
            'options': ['inherits', 'extends', 'implements', 'super'],
            'correct': 1,
            'explanation': "Le mot-clé 'extends' permet à une classe d'hériter d'une autre classe."
        },
        {
            'question_text': "Qu'est-ce qu'une interface en Java?",
            'options': [
                "Une classe abstraite",
                "Un contrat que les classes doivent respecter",
                "Une méthode statique",
                "Un type primitif"
            ],
            'correct': 1,
            'explanation': "Une interface définit un contrat (méthodes) que les classes implémentantes doivent respecter."
        },
        {
            'question_text': "Que fait le mot-clé 'final' en Java?",
            'options': [
                "Termine le programme",
                "Rend une variable/méthode/classe non modifiable",
                "Finalise un objet",
                "Crée une constante"
            ],
            'correct': 1,
            'explanation': "'final' empêche la modification d'une variable, la redéfinition d'une méthode ou l'héritage d'une classe."
        },
        {
            'question_text': "Quelle est la différence entre ArrayList et LinkedList?",
            'options': [
                "Aucune différence",
                "ArrayList utilise un tableau, LinkedList une liste chaînée",
                "ArrayList est plus lente",
                "LinkedList n'existe pas en Java"
            ],
            'correct': 1,
            'explanation': "ArrayList utilise un tableau redimensionnable, LinkedList utilise une structure de liste doublement chaînée."
        }
    ]
    
    for i, q_data in enumerate(java_questions):
        question = TestQuestion.objects.create(
            test=test,
            question_text=q_data['question_text'],
            question_type='multiple_choice',
            points=10,
            order=i + 1,
            explanation=q_data['explanation']
        )
        
        for j, option_text in enumerate(q_data['options']):
            TestOption.objects.create(
                question=question,
                option_text=option_text,
                is_correct=(j == q_data['correct']),
                order=j + 1
            )
    
    return test

def create_javascript_test(js_skill):
    """Créer un test QCM pour JavaScript"""
    test, created = TechnicalTest.objects.get_or_create(
        test_name="Test JavaScript - Fondamentaux Web",
        defaults={
            'skill': js_skill,
            'description': "Test des concepts fondamentaux de JavaScript",
            'duration_minutes': 30,
            'passing_score': 70,
            'is_active': True
        }
    )
    
    if not created:
        print(f"Test JavaScript existe déjà: {test.test_name}")
        return test
    
    print(f"Créé: {test.test_name}")
    
    js_questions = [
        {
            'question_text': "Quelle est la différence entre 'var', 'let' et 'const' en JavaScript?",
            'options': [
                "Aucune différence",
                "'var' a une portée fonction, 'let' et 'const' ont une portée bloc",
                "'let' est plus ancien que 'var'",
                "'const' peut être modifié"
            ],
            'correct': 1,
            'explanation': "'var' a une portée fonction, 'let' et 'const' ont une portée bloc. 'const' ne peut pas être réassigné."
        },
        {
            'question_text': "Que fait l'opérateur '===' en JavaScript?",
            'options': [
                "Comparaison avec conversion de type",
                "Comparaison stricte sans conversion de type",
                "Assignment",
                "Concaténation"
            ],
            'correct': 1,
            'explanation': "'===' effectue une comparaison stricte sans conversion de type, contrairement à '=='."
        },
        {
            'question_text': "Comment déclarer une fonction en JavaScript?",
            'options': [
                "function myFunc() {}",
                "const myFunc = () => {}",
                "const myFunc = function() {}",
                "Toutes les réponses ci-dessus"
            ],
            'correct': 3,
            'explanation': "JavaScript offre plusieurs syntaxes pour déclarer des fonctions."
        },
        {
            'question_text': "Qu'est-ce que le 'hoisting' en JavaScript?",
            'options': [
                "Élévation des déclarations en haut de leur portée",
                "Conversion de type automatique",
                "Gestion des erreurs",
                "Optimisation du code"
            ],
            'correct': 0,
            'explanation': "Le hoisting élève les déclarations de variables et fonctions en haut de leur portée."
        },
        {
            'question_text': "Comment ajouter un élément à un tableau en JavaScript?",
            'options': ['add()', 'push()', 'append()', 'insert()'],
            'correct': 1,
            'explanation': "La méthode push() ajoute un élément à la fin d'un tableau."
        },
        {
            'question_text': "Qu'est-ce qu'une closure en JavaScript?",
            'options': [
                "Une fonction qui a accès aux variables de sa portée externe",
                "Une boucle fermée",
                "Une condition if/else",
                "Un objet fermé"
            ],
            'correct': 0,
            'explanation': "Une closure est une fonction qui a accès aux variables de sa portée externe même après que cette portée ait été fermée."
        }
    ]
    
    for i, q_data in enumerate(js_questions):
        question = TestQuestion.objects.create(
            test=test,
            question_text=q_data['question_text'],
            question_type='multiple_choice',
            points=10,
            order=i + 1,
            explanation=q_data['explanation']
        )
        
        for j, option_text in enumerate(q_data['options']):
            TestOption.objects.create(
                question=question,
                option_text=option_text,
                is_correct=(j == q_data['correct']),
                order=j + 1
            )
    
    return test

def create_c_test(c_skill):
    """Créer un test QCM pour C"""
    test, created = TechnicalTest.objects.get_or_create(
        test_name="Test C - Programmation Système",
        defaults={
            'skill': c_skill,
            'description': "Test des concepts fondamentaux du langage C",
            'duration_minutes': 35,
            'passing_score': 70,
            'is_active': True
        }
    )
    
    if not created:
        print(f"Test C existe déjà: {test.test_name}")
        return test
    
    print(f"Créé: {test.test_name}")
    
    c_questions = [
        {
            'question_text': "Quelle est la fonction principale d'un programme C?",
            'options': ['start()', 'begin()', 'main()', 'init()'],
            'correct': 2,
            'explanation': "La fonction main() est le point d'entrée de tout programme C."
        },
        {
            'question_text': "Que fait l'opérateur '&' en C?",
            'options': [
                "ET logique",
                "Retourne l'adresse d'une variable",
                "ET bit à bit",
                "Concaténation"
            ],
            'correct': 1,
            'explanation': "L'opérateur '&' retourne l'adresse mémoire d'une variable."
        },
        {
            'question_text': "Qu'est-ce qu'un pointeur en C?",
            'options': [
                "Une variable qui contient une adresse mémoire",
                "Un type de données",
                "Une fonction",
                "Un opérateur"
            ],
            'correct': 0,
            'explanation': "Un pointeur est une variable qui stocke l'adresse mémoire d'une autre variable."
        },
        {
            'question_text': "Comment allouer de la mémoire dynamiquement en C?",
            'options': ['new', 'malloc()', 'alloc()', 'memory()'],
            'correct': 1,
            'explanation': "malloc() est utilisé pour allouer de la mémoire dynamiquement en C."
        },
        {
            'question_text': "Que fait la fonction 'printf()' en C?",
            'options': [
                "Lit une entrée",
                "Affiche une sortie formatée",
                "Calcule une valeur",
                "Alloue de la mémoire"
            ],
            'correct': 1,
            'explanation': "printf() affiche une sortie formatée vers la sortie standard."
        },
        {
            'question_text': "Quelle est la différence entre '++i' et 'i++' en C?",
            'options': [
                "Aucune différence",
                "++i incrémente avant utilisation, i++ incrémente après",
                "++i est plus rapide",
                "i++ ne fonctionne qu'avec des entiers"
            ],
            'correct': 1,
            'explanation': "++i (pré-incrémentation) incrémente avant utilisation, i++ (post-incrémentation) incrémente après."
        }
    ]
    
    for i, q_data in enumerate(c_questions):
        question = TestQuestion.objects.create(
            test=test,
            question_text=q_data['question_text'],
            question_type='multiple_choice',
            points=10,
            order=i + 1,
            explanation=q_data['explanation']
        )
        
        for j, option_text in enumerate(q_data['options']):
            TestOption.objects.create(
                question=question,
                option_text=option_text,
                is_correct=(j == q_data['correct']),
                order=j + 1
            )
    
    return test

def create_osi_test(osi_skill):
    """Créer un test QCM pour OSI"""
    test, created = TechnicalTest.objects.get_or_create(
        test_name="Test OSI - Modèle de Référence Réseau",
        defaults={
            'skill': osi_skill,
            'description': "Test sur le modèle OSI et les protocoles réseau",
            'duration_minutes': 25,
            'passing_score': 70,
            'is_active': True
        }
    )
    
    if not created:
        print(f"Test OSI existe déjà: {test.test_name}")
        return test
    
    print(f"Créé: {test.test_name}")
    
    osi_questions = [
        {
            'question_text': "Combien de couches compte le modèle OSI?",
            'options': ['5', '6', '7', '8'],
            'correct': 2,
            'explanation': "Le modèle OSI compte 7 couches, de la couche physique à la couche application."
        },
        {
            'question_text': "Quelle est la première couche du modèle OSI?",
            'options': ['Application', 'Transport', 'Réseau', 'Physique'],
            'correct': 3,
            'explanation': "La couche physique est la première couche (couche 1) du modèle OSI."
        },
        {
            'question_text': "À quelle couche OSI appartient le protocole TCP?",
            'options': ['Couche 3 - Réseau', 'Couche 4 - Transport', 'Couche 5 - Session', 'Couche 6 - Présentation'],
            'correct': 1,
            'explanation': "TCP fonctionne à la couche 4 (Transport) du modèle OSI."
        },
        {
            'question_text': "Quel protocole fonctionne à la couche 3 du modèle OSI?",
            'options': ['HTTP', 'TCP', 'IP', 'Ethernet'],
            'correct': 2,
            'explanation': "IP (Internet Protocol) fonctionne à la couche 3 (Réseau) du modèle OSI."
        },
        {
            'question_text': "Que fait la couche Transport (couche 4)?",
            'options': [
                "Routage des paquets",
                "Transport fiable des données",
                "Gestion des sessions",
                "Formatage des données"
            ],
            'correct': 1,
            'explanation': "La couche Transport assure le transport fiable des données entre les applications."
        },
        {
            'question_text': "Quelle couche gère l'encodage et le chiffrement des données?",
            'options': ['Session', 'Présentation', 'Application', 'Transport'],
            'correct': 1,
            'explanation': "La couche Présentation (couche 6) gère l'encodage, le chiffrement et la compression des données."
        },
        {
            'question_text': "Quel est l'ordre correct des couches OSI de bas en haut?",
            'options': [
                "Physique, Liaison, Réseau, Transport, Session, Présentation, Application",
                "Application, Présentation, Session, Transport, Réseau, Liaison, Physique",
                "Physique, Réseau, Liaison, Transport, Session, Présentation, Application",
                "Application, Session, Présentation, Transport, Réseau, Liaison, Physique"
            ],
            'correct': 0,
            'explanation': "L'ordre correct est: Physique, Liaison de données, Réseau, Transport, Session, Présentation, Application."
        }
    ]
    
    for i, q_data in enumerate(osi_questions):
        question = TestQuestion.objects.create(
            test=test,
            question_text=q_data['question_text'],
            question_type='multiple_choice',
            points=10,
            order=i + 1,
            explanation=q_data['explanation']
        )
        
        for j, option_text in enumerate(q_data['options']):
            TestOption.objects.create(
                question=question,
                option_text=option_text,
                is_correct=(j == q_data['correct']),
                order=j + 1
            )
    
    return test

def main():
    print("=== Création des compétences et tests techniques ===")
    
    # Créer les compétences
    skills = create_skills()
    
    print("\n=== Création des tests QCM ===")
    
    # Créer les tests
    if 'Python' in skills:
        create_python_test(skills['Python'])
    
    if 'Java' in skills:
        create_java_test(skills['Java'])
    
    if 'JavaScript' in skills:
        create_javascript_test(skills['JavaScript'])
    
    if 'C' in skills:
        create_c_test(skills['C'])
    
    if 'OSI' in skills:
        create_osi_test(skills['OSI'])
    
    print("\n=== Création terminée ===")
    print("Vous pouvez maintenant tester ces compétences dans l'interface!")

if __name__ == '__main__':
    main()
