#!/usr/bin/env python3
"""
Script pour ajouter les nouvelles compétences à un utilisateur test
"""

import os
import sys
import django

# Configuration Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'careerquest.settings')
django.setup()

from accounts.models import Candidate
from skills.models import Skill

def add_skills_to_user(user_id=1):
    """Ajouter les nouvelles compétences à l'utilisateur"""
    
    # Récupérer ou créer le candidat
    try:
        candidate = Candidate.objects.get(id=user_id)
        print(f"Candidat trouvé: {candidate}")
    except Candidate.DoesNotExist:
        print(f"Candidat avec ID {user_id} non trouvé. Création...")
        # Créer un candidat de test
        from django.contrib.auth.models import User
        user, created = User.objects.get_or_create(
            username=f'testuser{user_id}',
            defaults={
                'first_name': 'Test',
                'last_name': 'User',
                'email': f'test{user_id}@example.com'
            }
        )
        candidate = Candidate.objects.create(
            user=user,
            phone_number='+212600000000'
        )
        print(f"Candidat créé: {candidate}")
    
    # Compétences à ajouter
    skill_names = ['Python', 'Java', 'JavaScript', 'C', 'OSI']
    
    print(f"\n=== Ajout des compétences au candidat {candidate} ===")
    
    for skill_name in skill_names:
        try:
            skill = Skill.objects.get(name=skill_name)
            candidate.skills.add(skill)
            print(f"✅ Ajouté: {skill.name}")
        except Skill.DoesNotExist:
            print(f"❌ Compétence non trouvée: {skill_name}")
    
    candidate.save()
    
    print(f"\n=== Compétences du candidat {candidate} ===")
    for skill in candidate.skills.all():
        print(f"- {skill.name} ({skill.category})")
    
    return candidate

def main():
    print("=== Ajout des compétences à l'utilisateur test ===")
    candidate = add_skills_to_user(1)
    print(f"\n✅ Terminé! Le candidat {candidate} a maintenant accès aux nouveaux tests.")

if __name__ == '__main__':
    main()
