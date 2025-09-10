#!/usr/bin/env python
import os
import sys
import django

# Configuration Django
sys.path.append('c:/Users/cd/Desktop/tetsts/skills_validation_tests/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'careerquest.settings')
django.setup()

from skills.models import Skill, TechnicalTest, CandidateProfile
from django.contrib.auth.models import User

print("=== DIAGNOSTIC COMPLET ===")

# 1. Vérifier les compétences
skills = Skill.objects.all()
print(f"Compétences dans la base: {skills.count()}")
for skill in skills:
    print(f"  - {skill.name} (ID: {skill.id})")

# 2. Vérifier les tests
tests = TechnicalTest.objects.all()
print(f"\nTests dans la base: {tests.count()}")
for test in tests:
    print(f"  - {test.test_name} (Skill: {test.skill.name}, Active: {test.is_active})")

# 3. Vérifier le candidat
try:
    candidate = CandidateProfile.objects.get(id=1)
    print(f"\nCandidat ID 1: {candidate.first_name} {candidate.last_name}")
    print(f"Compétences du candidat: {candidate.skills.count()}")
    for skill in candidate.skills.all():
        print(f"  - {skill.name}")
except CandidateProfile.DoesNotExist:
    print("\nCandidat ID 1 n'existe pas, création...")
    user, created = User.objects.get_or_create(
        username='candidat1',
        defaults={'email': 'candidat1@example.com'}
    )
    candidate = CandidateProfile.objects.create(
        user=user,
        first_name='Candidat',
        last_name='Test',
        email='candidat1@example.com'
    )
    print(f"Candidat créé: {candidate}")

# 4. Tester le serializer
from skills.serializers import TechnicalTestSerializer
print(f"\n=== TEST API ===")
active_tests = TechnicalTest.objects.filter(is_active=True)
print(f"Tests actifs: {active_tests.count()}")

serializer = TechnicalTestSerializer(active_tests, many=True)
print(f"Données sérialisées: {len(serializer.data)} tests")
for test_data in serializer.data:
    print(f"  - {test_data['test_name']} (ID: {test_data['id']}, Questions: {test_data['question_count']})")

print("\n=== FIN DIAGNOSTIC ===")
