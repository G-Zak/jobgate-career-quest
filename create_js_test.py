#!/usr/bin/env python
import os
import sys
import django

# Configuration Django
sys.path.append('c:/Users/cd/Desktop/tetsts/skills_validation_tests/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'careerquest.settings')
django.setup()

from skills.models import Skill, TechnicalTest

# Récupérer la compétence JavaScript
try:
    javascript_skill = Skill.objects.get(name='JavaScript')
    print(f"Compétence trouvée: {javascript_skill}")
except Skill.DoesNotExist:
    print("Compétence JavaScript non trouvée !")
    sys.exit(1)

# Données du test au format attendu par le modèle
test_data = {
    "questions": [
        {
            "question": "Comment déclarer une variable qui ne peut pas être modifiée en JavaScript ?",
            "options": ["var myVar = 'value'", "let myVar = 'value'", "const myVar = 'value'", "final myVar = 'value'"],
            "correct_answer": "c",
            "points": 3
        },
        {
            "question": "Quelle méthode permet d'ajouter un élément à la fin d'un tableau ?",
            "options": ["array.add()", "array.push()", "array.append()", "array.insert()"],
            "correct_answer": "b",
            "points": 3
        },
        {
            "question": "Comment sélectionner un élément par son ID en JavaScript ?",
            "options": ["document.getElement('myId')", "document.getElementById('myId')", "document.selectById('myId')", "document.querySelector('#myId')"],
            "correct_answer": "b",
            "points": 4
        },
        {
            "question": "Que fait la méthode addEventListener() ?",
            "options": ["Ajoute un nouvel élément au DOM", "Écoute les événements sur un élément", "Crée un nouvel événement", "Supprime un événement"],
            "correct_answer": "b",
            "points": 4
        },
        {
            "question": "Quelle est la différence entre == et === ?",
            "options": ["Pas de différence", "== compare la valeur, === compare valeur et type", "=== est plus rapide", "== est obsolète"],
            "correct_answer": "b",
            "points": 5
        },
        {
            "question": "Comment créer une fonction en JavaScript ?",
            "options": ["function myFunc() {}", "const myFunc = () => {}", "const myFunc = function() {}", "Toutes les réponses ci-dessus"],
            "correct_answer": "d",
            "points": 3
        },
        {
            "question": "Que retourne typeof null en JavaScript ?",
            "options": ["null", "undefined", "object", "boolean"],
            "correct_answer": "c",
            "points": 5
        },
        {
            "question": "Comment parcourir un tableau en JavaScript ?",
            "options": ["for (let i = 0; i < array.length; i++)", "array.forEach()", "for (let item of array)", "Toutes les réponses ci-dessus"],
            "correct_answer": "d",
            "points": 4
        }
    ]
}

# Créer le test
test = TechnicalTest.objects.create(
    test_name="Test JavaScript Fondamentaux",
    skill=javascript_skill,
    description="Évaluation des connaissances de base en JavaScript : variables, fonctions, DOM et événements",
    instructions="Répondez aux questions suivantes sur JavaScript. Chaque question peut avoir une ou plusieurs bonnes réponses. Prenez votre temps pour bien lire chaque question.",
    total_score=31,
    time_limit=20,
    json_data=test_data
)

print(f"Test créé avec succès: {test}")
print(f"Nombre de questions créées: {test.question_count}")
