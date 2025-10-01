from django.core.management.base import BaseCommand
from django.db import transaction
import json

from testsengine.models import Test, Question
from testsengine.question_option_model import QuestionOption

class Command(BaseCommand):
 help = "Replace SJT1 with a single bug scenario (EN+FR) and per-option scoring (+2/+1/0/-1)"

 def add_arguments(self, parser):
 parser.add_argument("--test-id", type=int, default=30, help="Backend test id to seed (default 30)")
 parser.add_argument("--dry-run", action="store_true")

 def handle(self, *args, **opts):
 test_id = opts.get("test_id", 30)
 dry = opts.get("dry_run", False)

 # Scenario and translations
 scenario_en = (
 "You are part of a software development team working on a client’s project. "
 "The deadline is approaching in three days, but you notice a critical bug that might delay the delivery. "
 "Your project manager insists that you deliver on time, while your teammate suggests reporting the bug immediately to avoid bigger problems later."
 )
 scenario_fr = (
 "Vous faites partie d'une équipe de développement logiciel travaillant sur le projet d'un client. "
 "L'échéance arrive dans trois jours, mais vous constatez un bug critique qui pourrait retarder la livraison. "
 "Votre chef de projet insiste pour livrer à temps, tandis que votre coéquipier suggère de signaler immédiatement le bug afin d'éviter de plus gros problèmes plus tard."
 )

 question_en = "What would you do in this situation?"
 question_fr = "Que feriez-vous dans cette situation ?"

 # Options with scoring (+2/+1/0/-1) — keeps SJT scoring model
 # Rationale: C is best (act + inform), B is good (transparent but risks timeline),
 # D is neutral (process issue; lacks transparency), A is poor (hides risk)
 options_en = [
 "Deliver the project on time without reporting the bug to satisfy the project manager.", # A -> -1
 "Report the bug immediately, even if it risks missing the deadline.", # B -> +1
 "Try to fix the bug quickly and inform the manager about the situation with possible outcomes.", # C -> +2
 "Ask the client for an extension without telling them about the bug.", # D -> 0
 ]
 options_fr = [
 "Livrer le projet à temps sans signaler le bug pour satisfaire le chef de projet.",
 "Signaler immédiatement le bug, même si cela risque de faire manquer l'échéance.",
 "Essayer de corriger rapidement le bug et informer le chef de projet de la situation avec les issues possibles.",
 "Demander au client une prolongation sans lui parler du bug.",
 ]
 letter_scores = {
 "A": -1,
 "B": 1,
 "C": 2,
 "D": 0,
 }

 if dry:
 self.stdout.write("[DRY RUN] Would replace SJT questions with the single bug scenario (EN+FR)")
 return

 with transaction.atomic():
 test, _ = Test.objects.get_or_create(
 id=test_id,
 defaults={
 'title': 'Situational Judgment Test 1',
 'test_type': 'situational_judgment',
 'description': 'Judgment on workplace scenarios (single bug scenario, EN+FR)',
 'duration_minutes': 10,
 'total_questions': 1,
 'passing_score': 70,
 'is_active': True,
 }
 )

 # Clear existing questions/options for this test
 QuestionOption.objects.filter(question__test_id=test_id).delete()
 Question.objects.filter(test_id=test_id).delete()

 # Build context with scenario and FR translations
 ctx = {
 "locale": "MA",
 "domain": "situational_judgment",
 "scenario": {"en": scenario_en, "fr": scenario_fr},
 "translations": {
 "fr": {
 "question_text": question_fr,
 "options": options_fr,
 }
 },
 "tags": ["SJT", "bug", "delivery", "Morocco"],
 }

 q = Question.objects.create(
 test_id=test_id,
 question_type='situational_judgment',
 question_text=question_en,
 passage=None,
 options=options_en,
 correct_answer='C', # not used for SJT, but kept for compatibility
 difficulty_level='medium',
 order=1,
 explanation=None,
 context=json.dumps(ctx),
 )

 # Create per-option scoring rows
 letters = ["A", "B", "C", "D"]
 for idx, letter in enumerate(letters):
 QuestionOption.objects.create(
 question=q,
 option_letter=letter,
 option_text=options_en[idx],
 score_value=letter_scores[letter],
 )

 # Update test metadata
 test.total_questions = 1
 test.is_active = True
 test.save(update_fields=["total_questions", "is_active"])

 self.stdout.write(" SJT1 replaced with single bug scenario (EN+FR) and per-option scoring")

