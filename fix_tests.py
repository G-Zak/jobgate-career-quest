#!/usr/bin/env python
import os
import sys
import django
import json

# Configuration Django
sys.path.append('c:/Users/cd/Desktop/tetsts/skills_validation_tests/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'careerquest.settings')
django.setup()

from skills.models import Skill, TechnicalTest, TestQuestion, CandidateProfile
from django.contrib.auth.models import User

print("=== SOLUTION RAPIDE : CREATION DIRECTE ===")

# 1. Nettoyer les anciens tests
print("Suppression des anciens tests...")
TechnicalTest.objects.all().delete()

# 2. Récupérer la compétence JavaScript
try:
    javascript_skill = Skill.objects.get(name='JavaScript')
    print(f"✅ Compétence JavaScript trouvée: {javascript_skill}")
except Skill.DoesNotExist:
    print("❌ Compétence JavaScript non trouvée")
    sys.exit(1)

# 3. Créer le test JavaScript manuellement
print("Création du test JavaScript...")
test = TechnicalTest.objects.create(
    test_name="Test JavaScript Fondamentaux",
    skill=javascript_skill,
    description="Évaluation des connaissances de base en JavaScript : variables, fonctions, DOM et événements",
    instructions="Répondez aux questions suivantes sur JavaScript. Chaque question peut avoir une ou plusieurs bonnes réponses. Prenez votre temps pour bien lire chaque question.",
    total_score=31,
    time_limit=20,
    is_active=True
)

# 4. Créer les questions
questions_data = [
    {
        "question_text": "Comment déclarer une variable qui ne peut pas être modifiée en JavaScript ?",
        "option_a": "var myVar = 'value'",
        "option_b": "let myVar = 'value'",
        "option_c": "const myVar = 'value'",
        "option_d": "final myVar = 'value'",
        "correct_answer": "c",
        "points": 3
    },
    {
        "question_text": "Quelle méthode permet d'ajouter un élément à la fin d'un tableau ?",
        "option_a": "array.add()",
        "option_b": "array.push()",
        "option_c": "array.append()",
        "option_d": "array.insert()",
        "correct_answer": "b",
        "points": 3
    },
    {
        "question_text": "Comment sélectionner un élément par son ID en JavaScript ?",
        "option_a": "document.getElement('myId')",
        "option_b": "document.getElementById('myId')",
        "option_c": "document.selectById('myId')",
        "option_d": "document.querySelector('#myId')",
        "correct_answer": "b",
        "points": 4
    },
    {
        "question_text": "Que fait la méthode addEventListener() ?",
        "option_a": "Ajoute un nouvel élément au DOM",
        "option_b": "Écoute les événements sur un élément",
        "option_c": "Crée un nouvel événement",
        "option_d": "Supprime un événement",
        "correct_answer": "b",
        "points": 4
    },
    {
        "question_text": "Quelle est la différence entre == et === ?",
        "option_a": "Pas de différence",
        "option_b": "== compare la valeur, === compare valeur et type",
        "option_c": "=== est plus rapide",
        "option_d": "== est obsolète",
        "correct_answer": "b",
        "points": 5
    },
    {
        "question_text": "Comment créer une fonction en JavaScript ?",
        "option_a": "function myFunc() {}",
        "option_b": "const myFunc = () => {}",
        "option_c": "const myFunc = function() {}",
        "option_d": "Toutes les réponses ci-dessus",
        "correct_answer": "d",
        "points": 3
    },
    {
        "question_text": "Que retourne typeof null en JavaScript ?",
        "option_a": "null",
        "option_b": "undefined",
        "option_c": "object",
        "option_d": "boolean",
        "correct_answer": "c",
        "points": 5
    },
    {
        "question_text": "Comment parcourir un tableau en JavaScript ?",
        "option_a": "for (let i = 0; i < array.length; i++)",
        "option_b": "array.forEach()",
        "option_c": "for (let item of array)",
        "option_d": "Toutes les réponses ci-dessus",
        "correct_answer": "d",
        "points": 4
    }
]

print("Création des questions...")
for i, q_data in enumerate(questions_data, 1):
    TestQuestion.objects.create(
        test=test,
        order=i,
        **q_data
    )

print(f"✅ Test créé: {test}")
print(f"✅ Questions créées: {test.testquestion_set.count()}")

# 5. Vérifier que le candidat a la compétence JavaScript
try:
    candidate = CandidateProfile.objects.get(id=1)
    if not candidate.skills.filter(name='JavaScript').exists():
        candidate.skills.add(javascript_skill)
        print(f"✅ Compétence JavaScript ajoutée au candidat {candidate}")
    else:
        print(f"✅ Le candidat {candidate} a déjà la compétence JavaScript")
except CandidateProfile.DoesNotExist:
    print("❌ Candidat ID 1 non trouvé")

# 6. Vérifier le résultat final
tests = TechnicalTest.objects.filter(is_active=True)
print(f"\n=== RÉSULTAT ===")
print(f"Tests actifs: {tests.count()}")
for test in tests:
    print(f"  - {test.test_name} ({test.testquestion_set.count()} questions)")

print("\n✅ SOLUTION APPLIQUÉE ! Actualisez votre page de debug.")
