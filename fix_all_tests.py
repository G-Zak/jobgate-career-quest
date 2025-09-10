#!/usr/bin/env python
import os
import sys
import django

# Ajouter le chemin du backend
sys.path.append('c:/Users/cd/Desktop/tetsts/skills_validation_tests/backend')
os.chdir('c:/Users/cd/Desktop/tetsts/skills_validation_tests/backend')

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'careerquest.settings')
django.setup()

from skills.models import TechnicalTest
import json

def fix_all_broken_tests():
    """Corriger tous les tests avec 0 questions"""
    print("🔧 CORRECTION AUTOMATIQUE DE TOUS LES TESTS")
    print("=" * 50)
    
    broken_tests = TechnicalTest.objects.filter(testquestion__isnull=True).distinct()
    
    for test in broken_tests:
        if not test.json_data:
            print(f"❌ {test.test_name}: Pas de JSON")
            continue
            
        print(f"\n🔧 Correction: {test.test_name}")
        try:
            # Réessayer l'import
            test.import_from_json()
            print(f"✅ Questions créées: {test.question_count}")
        except Exception as e:
            print(f"❌ Erreur: {e}")
            
            # Analyser le problème
            try:
                data = test.json_data if isinstance(test.json_data, dict) else json.loads(test.json_data)
                
                if 'questions' not in data:
                    print(f"   - Pas de clé 'questions' dans le JSON")
                    print(f"   - Clés disponibles: {list(data.keys())}")
                    continue
                
                questions = data['questions']
                if not questions:
                    print(f"   - Liste de questions vide")
                    continue
                
                # Vérifier la première question
                first_q = questions[0]
                required = ['question', 'options', 'correct_answer']
                missing = [f for f in required if f not in first_q]
                
                if missing:
                    print(f"   - Champs manquants: {missing}")
                    print(f"   - Champs disponibles: {list(first_q.keys())}")
                else:
                    print(f"   - Structure semble correcte")
                    print(f"   - Première question: {first_q}")
                
            except Exception as e2:
                print(f"   - Erreur analyse: {e2}")

if __name__ == "__main__":
    fix_all_broken_tests()
