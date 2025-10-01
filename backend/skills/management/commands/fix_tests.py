from django.core.management.base import BaseCommand
from skills.models import TechnicalTest

class Command(BaseCommand):
 help = 'Répare tous les tests qui ont du JSON mais pas de questions'

 def handle(self, *args, **options):
 self.stdout.write(" Recherche des tests à réparer...")

 # Trouver tous les tests avec JSON mais sans questions
 tests_to_fix = []
 for test in TechnicalTest.objects.all():
 if test.json_data and test.question_count == 0:
 tests_to_fix.append(test)

 if not tests_to_fix:
 self.stdout.write(
 self.style.SUCCESS(" Tous les tests sont déjà corrects !")
 )
 return

 self.stdout.write(f" {len(tests_to_fix)} test(s) à réparer:")

 for test in tests_to_fix:
 self.stdout.write(f" - {test.test_name}")

 # Demander confirmation
 confirm = input("\nConfirmer la réparation ? (y/N): ")
 if confirm.lower() != 'y':
 self.stdout.write(" Opération annulée")
 return

 # Réparer chaque test
 repaired_count = 0
 for test in tests_to_fix:
 try:
 self.stdout.write(f" Réparation: {test.test_name}...")
 questions_before = test.question_count
 test.import_from_json()
 questions_after = test.question_count

 if questions_after > questions_before:
 self.stdout.write(
 self.style.SUCCESS(
 f" {questions_after} questions créées"
 )
 )
 repaired_count += 1
 else:
 self.stdout.write(
 self.style.WARNING(
 f" ️ Aucune question créée"
 )
 )

 except Exception as e:
 self.stdout.write(
 self.style.ERROR(f" Erreur: {e}")
 )

 self.stdout.write(
 self.style.SUCCESS(
 f"\n Réparation terminée: {repaired_count}/{len(tests_to_fix)} test(s) réparés"
 )
 )
