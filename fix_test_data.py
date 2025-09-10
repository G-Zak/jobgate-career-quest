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

from skills.models import TechnicalTest, TestResult, TestQuestion

def fix_test_data():
    """Corriger toutes les incohérences dans les données de tests"""
    print("🔧 CORRECTION DES DONNÉES DE TESTS")
    print("=" * 50)
    
    # 1. Corriger les scores totaux des tests
    print("\n1. 🎯 Correction des scores totaux...")
    tests = TechnicalTest.objects.all()
    for test in tests:
        question_points = sum(q.points for q in test.testquestion_set.all())
        if test.total_score != question_points:
            print(f"   ⚠️  {test.test_name}:")
            print(f"      Ancien total: {test.total_score}")
            print(f"      Nouveau total: {question_points}")
            test.total_score = question_points
            test.save()
        else:
            print(f"   ✅ {test.test_name}: {test.total_score} points (correct)")
    
    # 2. Vérifier et afficher les résultats corrigés
    print("\n2. 📊 Vérification des résultats...")
    results = TestResult.objects.all()
    for result in results:
        percentage = round((result.score / result.test.total_score) * 100, 1)
        print(f"   📝 {result.test.test_name}:")
        print(f"      Score: {result.score}/{result.test.total_score}")
        print(f"      Pourcentage: {percentage}%")
        print(f"      Compétence: {result.test.skill.name}")
        print(f"      Temps: {result.time_taken}s ({result.time_taken//60}min {result.time_taken%60}s)")
    
    # 3. Recréer les résultats avec les bonnes données si nécessaire
    print("\n3. 🔄 État final des tests...")
    for test in TechnicalTest.objects.all():
        print(f"   📚 {test.test_name}:")
        print(f"      Questions: {test.question_count}")
        print(f"      Points total: {test.total_score}")
        print(f"      Compétence: {test.skill.name}")
    
    print("\n✅ CORRECTION TERMINÉE!")

if __name__ == "__main__":
    fix_test_data()
