import os
import django
import json

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'careerquest.settings')
django.setup()

from skills.models import TechnicalTest

def analyze_test_json(test_name_part):
    """Analyser le JSON d'un test pour comprendre pourquoi il n'importe pas"""
    test = TechnicalTest.objects.filter(test_name__icontains=test_name_part).first()
    
    if not test:
        print(f"❌ Aucun test trouvé contenant '{test_name_part}'")
        return
    
    print(f"\n=== ANALYSE: {test.test_name} ===")
    print(f"Questions actuelles: {test.question_count}")
    print(f"JSON présent: {bool(test.json_data)}")
    
    if not test.json_data:
        print("❌ Pas de données JSON")
        return
    
    try:
        # Récupérer les données JSON
        if isinstance(test.json_data, dict):
            data = test.json_data
        else:
            data = json.loads(test.json_data)
        
        print(f"Type de données: {type(data)}")
        print(f"Clés principales: {list(data.keys())}")
        
        # Analyser les questions
        if 'questions' not in data:
            print("❌ Pas de clé 'questions' dans le JSON")
            print("Structure complète:", json.dumps(data, indent=2)[:500] + "...")
            return
        
        questions = data['questions']
        print(f"Nombre de questions dans JSON: {len(questions)}")
        
        if questions:
            first_q = questions[0]
            print(f"Structure première question: {list(first_q.keys())}")
            
            # Vérifier les champs requis
            required_fields = ['question', 'options', 'correct_answer']
            missing_fields = [field for field in required_fields if field not in first_q]
            
            if missing_fields:
                print(f"❌ Champs manquants: {missing_fields}")
            else:
                print("✅ Champs requis présents")
                
                # Vérifier les options
                if 'options' in first_q:
                    options = first_q['options']
                    print(f"Nombre d'options: {len(options) if isinstance(options, list) else 'Pas une liste'}")
                    if isinstance(options, list) and len(options) >= 4:
                        print("✅ Au moins 4 options")
                    else:
                        print("❌ Moins de 4 options")
            
            print("\nPremière question complète:")
            print(json.dumps(first_q, indent=2, ensure_ascii=False))
        
    except Exception as e:
        print(f"❌ Erreur analyse JSON: {e}")

# Analyser les tests problématiques
analyze_test_json("mysql")
analyze_test_json("java")
