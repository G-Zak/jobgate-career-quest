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

def show_json_structure():
    """Montrer la structure JSON des tests problématiques"""
    print("🔍 DIAGNOSTIC JSON DES TESTS")
    print("=" * 50)
    
    # Test qui fonctionne (Django)
    working_test = TechnicalTest.objects.filter(test_name__icontains='django', testquestion__isnull=False).first()
    if working_test and working_test.json_data:
        print("\n✅ FORMAT QUI FONCTIONNE (Django):")
        data = working_test.json_data if isinstance(working_test.json_data, dict) else json.loads(working_test.json_data)
        if 'questions' in data and data['questions']:
            first_q = data['questions'][0]
            print(json.dumps(first_q, indent=2, ensure_ascii=False))
    
    # Tests qui ne fonctionnent pas
    broken_tests = ['mysql', 'java']
    
    for test_name in broken_tests:
        test = TechnicalTest.objects.filter(test_name__icontains=test_name).first()
        if test and test.json_data:
            print(f"\n❌ FORMAT QUI NE FONCTIONNE PAS ({test_name.upper()}):")
            try:
                data = test.json_data if isinstance(test.json_data, dict) else json.loads(test.json_data)
                if 'questions' in data and data['questions']:
                    first_q = data['questions'][0]
                    print(json.dumps(first_q, indent=2, ensure_ascii=False))
                    
                    # Analyser les différences
                    print(f"\n🔍 ANALYSE {test_name.upper()}:")
                    required_fields = ['question', 'options', 'correct_answer']
                    for field in required_fields:
                        if field in first_q:
                            print(f"  ✅ {field}: {type(first_q[field])}")
                            if field == 'options':
                                print(f"      Nombre d'options: {len(first_q[field]) if isinstance(first_q[field], list) else 'N/A'}")
                        else:
                            print(f"  ❌ {field}: MANQUANT")
                else:
                    print("Pas de questions dans le JSON")
                    print("Structure complète:")
                    print(json.dumps(data, indent=2, ensure_ascii=False)[:500] + "...")
            except Exception as e:
                print(f"Erreur: {e}")

if __name__ == "__main__":
    show_json_structure()
