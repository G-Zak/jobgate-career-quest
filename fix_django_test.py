#!/usr/bin/env python
import os
import sys
import django

# Configuration Django
sys.path.append('c:/Users/cd/Desktop/tetsts/skills_validation_tests/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'careerquest.settings')
django.setup()

from skills.models import Skill, TechnicalTest, TestQuestion

print("=== CORRECTION TEST DJANGO ===")

# 1. Trouver le test Django
try:
    django_test = TechnicalTest.objects.get(test_name="Test Django Fondamentaux")
    print(f"✅ Test Django trouvé: {django_test}")
    print(f"Questions actuelles: {django_test.testquestion_set.count()}")
except TechnicalTest.DoesNotExist:
    print("❌ Test Django non trouvé")
    sys.exit(1)

# 2. Supprimer les anciennes questions (s'il y en a)
django_test.testquestion_set.all().delete()
print("🗑️ Anciennes questions supprimées")

# 3. Créer les questions manuellement
questions_data = [
    {
        "question_text": "Quelle commande permet de créer un nouveau projet Django ?",
        "option_a": "django-admin startproject monprojet",
        "option_b": "python manage.py startproject monprojet",
        "option_c": "django create monprojet",
        "option_d": "python django.py new monprojet",
        "correct_answer": "a",
        "points": 2
    },
    {
        "question_text": "Comment définir un modèle Django avec un champ texte obligatoire ?",
        "option_a": "title = models.CharField(max_length=100)",
        "option_b": "title = models.CharField(max_length=100, required=True)",
        "option_c": "title = models.CharField(max_length=100, null=False)",
        "option_d": "title = models.TextField(obligatoire=True)",
        "correct_answer": "a",
        "points": 3
    },
    {
        "question_text": "Que fait la commande 'python manage.py makemigrations' ?",
        "option_a": "Applique les migrations à la base de données",
        "option_b": "Crée les fichiers de migration basés sur les changements de modèles",
        "option_c": "Supprime les migrations existantes",
        "option_d": "Lance le serveur de développement",
        "correct_answer": "b",
        "points": 3
    },
    {
        "question_text": "Comment récupérer tous les objets d'un modèle Article en Django ?",
        "option_a": "Article.get_all()",
        "option_b": "Article.objects.all()",
        "option_c": "Article.all()",
        "option_d": "Article.objects.get_all()",
        "correct_answer": "b",
        "points": 4
    },
    {
        "question_text": "Quelle est la syntaxe correcte pour une vue basée sur une fonction ?",
        "option_a": "def ma_vue(request): return HttpResponse('Hello')",
        "option_b": "function ma_vue(request) { return HttpResponse('Hello') }",
        "option_c": "view ma_vue(request): return HttpResponse('Hello')",
        "option_d": "def ma_vue(): return HttpResponse('Hello')",
        "correct_answer": "a",
        "points": 3
    },
    {
        "question_text": "Comment passer des données à un template Django ?",
        "option_a": "return render(request, 'template.html', data)",
        "option_b": "return render(request, 'template.html', context=data)",
        "option_c": "return render(request, 'template.html', {'cle': 'valeur'})",
        "option_d": "Toutes les réponses ci-dessus sont correctes",
        "correct_answer": "d",
        "points": 4
    },
    {
        "question_text": "Quelle est la syntaxe pour afficher une variable dans un template Django ?",
        "option_a": "<?= variable ?>",
        "option_b": "{{ variable }}",
        "option_c": "{% variable %}",
        "option_d": "$variable",
        "correct_answer": "b",
        "points": 3
    },
    {
        "question_text": "Comment créer un superutilisateur en Django ?",
        "option_a": "python manage.py createsuperuser",
        "option_b": "python manage.py createuser --admin",
        "option_c": "python manage.py admin create",
        "option_d": "django-admin createsuperuser",
        "correct_answer": "a",
        "points": 2
    },
    {
        "question_text": "Quelle méthode ORM permet de filtrer les objets selon une condition ?",
        "option_a": "Article.objects.where(titre='test')",
        "option_b": "Article.objects.filter(titre='test')",
        "option_c": "Article.objects.select(titre='test')",
        "option_d": "Article.objects.find(titre='test')",
        "correct_answer": "b",
        "points": 4
    },
    {
        "question_text": "Comment inclure les URLs d'une application dans le projet principal ?",
        "option_a": "path('blog/', include('blog.urls'))",
        "option_b": "url('blog/', include('blog.urls'))",
        "option_c": "include('blog/', 'blog.urls')",
        "option_d": "path('blog/', 'blog.urls')",
        "correct_answer": "a",
        "points": 4
    },
    {
        "question_text": "Quel fichier contient la configuration principale d'un projet Django ?",
        "option_a": "config.py",
        "option_b": "settings.py",
        "option_c": "django.conf",
        "option_d": "main.py",
        "correct_answer": "b",
        "points": 2
    },
    {
        "question_text": "Comment exécuter une boucle dans un template Django ?",
        "option_a": "{{ for item in items }}",
        "option_b": "{% for item in items %} ... {% endfor %}",
        "option_c": "<?php foreach($items as $item) ?>",
        "option_d": "<loop items='items'>",
        "correct_answer": "b",
        "points": 3
    }
]

print("📝 Création des questions Django...")
for i, q_data in enumerate(questions_data, 1):
    TestQuestion.objects.create(
        test=django_test,
        order=i,
        **q_data
    )

print(f"✅ Questions créées: {django_test.testquestion_set.count()}")

# 4. Vérifier le candidat a Django comme compétence
from skills.models import CandidateProfile
try:
    candidate = CandidateProfile.objects.get(id=1)
    django_skill = Skill.objects.get(name='Django')
    if not candidate.skills.filter(name='Django').exists():
        candidate.skills.add(django_skill)
        print(f"✅ Compétence Django ajoutée au candidat {candidate}")
    else:
        print(f"✅ Le candidat {candidate} a déjà la compétence Django")
except (CandidateProfile.DoesNotExist, Skill.DoesNotExist) as e:
    print(f"⚠️ Attention: {e}")

print(f"\n🎉 TEST DJANGO CORRIGÉ !")
print(f"Test: {django_test.test_name}")
print(f"Questions: {django_test.testquestion_set.count()}/12")
print(f"Score total: {django_test.total_score}")
print("\n✅ Actualisez votre page de debug ou allez dans 'Tests par Compétence'!")
