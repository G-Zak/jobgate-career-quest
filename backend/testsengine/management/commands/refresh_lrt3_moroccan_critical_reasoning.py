from django.core.management.base import BaseCommand
from django.db import transaction
import json
import random

from testsengine.models import Test, Question

class Command(BaseCommand):
 help = "Create/Refresh LRT3 (Critical Reasoning) with EN+FR, 50-item pool, clear stems and options"

 def add_arguments(self, parser):
 parser.add_argument("--dry-run", action="store_true")
 parser.add_argument("--test-id", type=int, default=15, help="Backend test id to refresh (default 15)")

 def handle(self, *args, **opts):
 test_id = opts.get("test_id", 15)
 dry = opts.get("dry_run", False)
 self.stdout.write("Refreshing LRT3 Critical Reasoning...")

 def item(q_en, q_fr, opts_en, opts_fr, ans, diff, explanation=None):
 return {
 "q_en": q_en,
 "q_fr": q_fr,
 "opts_en": opts_en,
 "opts_fr": opts_fr,
 "ans": ans,
 "diff": diff,
 "ex": explanation,
 }

 data = []

 # Fixed clear argument items (strengthen/weaken/assumption)
 fixed = [
 (
 "Argument: A new tram line reduced traffic in Rabat. Therefore, building tram lines in other cities will reduce traffic. Which option most weakens the argument?",
 "Argument : Une nouvelle ligne de tram a réduit le trafic à Rabat. Donc, construire des lignes de tram dans d'autres villes réduira le trafic. Quelle option affaiblit le plus l'argument ?",
 [
 'Other cities lack the budget to maintain tram systems',
 'Rabat also increased parking fees and bus frequency simultaneously',
 'People prefer to walk in small cities',
 'Trams are comfortable and eco-friendly'
 ],
 [
 "D'autres villes n'ont pas le budget pour entretenir les trams",
 "Rabat a également augmenté les tarifs de stationnement et la fréquence des bus simultanément",
 "Les gens préfèrent marcher dans les petites villes",
 "Les trams sont confortables et écologiques"
 ],
 'B', 'medium'
 ),
 (
 "Conclusion: Argan oil sales rose after a festival campaign. Therefore, the campaign caused the rise. What is a required assumption?",
 "Conclusion : Les ventes d'huile d'argan ont augmenté après une campagne de festival. Donc, la campagne a causé la hausse. Quelle hypothèse est requise ?",
 [
 'No other major factor affected sales during that period',
 'The campaign was expensive',
 'All customers saw the campaign',
 'The product was discounted'
 ],
 [
 "Aucun autre facteur majeur n'a affecté les ventes pendant cette période",
 "La campagne était coûteuse",
 "Tous les clients ont vu la campagne",
 "Le produit était en promotion"
 ],
 'A', 'hard'
 ),
 (
 "Observation: Shops using the new POS system report fewer errors. Which option most strengthens that the system is the cause?",
 "Observation : Les boutiques utilisant le nouveau système POS signalent moins d'erreurs. Quelle option renforce le plus que le système en est la cause ?",
 [
 'Shops that did not adopt POS show no change in errors',
 'Shop staff also received training',
 'The new system has a modern UI',
 'POS hardware was donated'
 ],
 [
 "Les boutiques qui n'ont pas adopté le POS ne montrent aucun changement d'erreurs",
 "Le personnel a également été formé",
 "Le nouveau système a une interface moderne",
 "Le matériel POS a été offert"
 ],
 'A', 'medium'
 ),
 ]
 for q_en, q_fr, opts_en, opts_fr, ans, diff in fixed:
 data.append(item(q_en, q_fr, opts_en, opts_fr, ans, diff))

 # Generators
 def gen_strengthen():
 topic = random.choice(['market regulation','public transport','water conservation','education reform'])
 city = random.choice(['Casablanca','Rabat','Marrakech','Fès'])
 q_en = f"Argument: A policy on {topic} in {city} improved outcomes. So, the policy causes improvement. Which option most strengthens the argument?"
 q_fr = f"Argument : Une politique sur {topic} à {city} a amélioré les résultats. Donc, la politique cause l'amélioration. Quelle option renforce le plus l'argument ?"
 opts_en = [
 'A control group without the policy saw no improvement',
 'The policy was popular',
 'The policy was announced on TV',
 'The budget increased'
 ]
 opts_fr = [
 "Un groupe témoin sans la politique n'a vu aucune amélioration",
 'La politique était populaire',
 'La politique a été annoncée à la TV',
 'Le budget a augmenté'
 ]
 return item(q_en, q_fr, opts_en, opts_fr, 'A', random.choice(['medium','hard']))

 def gen_weaken():
 topic = random.choice(['traffic congestion','littering','school attendance','hospital wait times'])
 q_en = f"Claim: A new app reduced {topic}. Which option most weakens the claim?"
 q_fr = f"Affirmation : Une nouvelle application a réduit {topic}. Quelle option affaiblit le plus l'affirmation ?"
 opts_en = [
 'A seasonal factor already reduces it every year',
 'Users liked the app UI',
 'The app had 10k downloads',
 'A new logo was launched'
 ]
 opts_fr = [
 'Un facteur saisonnier le réduit déjà chaque année',
 "Les utilisateurs ont aimé l'interface de l'app",
 "L'app a eu 10 000 téléchargements",
 'Un nouveau logo a été lancé'
 ]
 return item(q_en, q_fr, opts_en, opts_fr, 'A', random.choice(['medium','hard']))

 def gen_assumption():
 topic = random.choice(['festival marketing','export training','cooperative support'])
 q_en = f"Conclusion: After {topic}, sales increased. Therefore, {topic} caused the rise. What is a required assumption?"
 q_fr = f"Conclusion : Après {topic}, les ventes ont augmenté. Donc, {topic} a causé la hausse. Quelle hypothèse est requise ?"
 opts_en = [
 'No other major changes drove the increase',
 'Everyone saw the campaign',
 'The product quality changed',
 'The store moved location'
 ]
 opts_fr = [
 "Aucun autre changement majeur n'a provoqué la hausse",
 'Tout le monde a vu la campagne',
 'La qualité du produit a changé',
 "La boutique a changé d'emplacement"
 ]
 return item(q_en, q_fr, opts_en, opts_fr, 'A', random.choice(['hard','medium']))

 generators = [gen_strengthen, gen_weaken, gen_assumption]
 while len(data) < 50:
 data.append(random.choice(generators)())

 # Persist
 created = 0
 counts = {"easy": 0, "medium": 0, "hard": 0}
 if not dry:
 with transaction.atomic():
 test, _ = Test.objects.get_or_create(
 id=test_id,
 defaults={
 'title': 'Logical Reasoning Test 3 - Critical Reasoning',
 'test_type': 'logical_reasoning',
 'description': 'Critical reasoning: strengthen, weaken, assumptions (EN + FR)',
 'duration_minutes': 20,
 'total_questions': 50,
 'passing_score': 70,
 'is_active': True,
 }
 )
 Question.objects.filter(test_id=test_id).delete()
 order = 0
 for q in data:
 order += 1
 ctx = {
 "locale": "MA",
 "domain": "critical_reasoning",
 "translations": {"fr": {"question_text": q["q_fr"], "options": q["opts_fr"]}},
 "tags": ["Morocco", "logic", "critical"],
 }
 Question.objects.create(
 test_id=test_id,
 question_type='multiple_choice',
 question_text=q["q_en"],
 passage=None,
 options=q["opts_en"],
 correct_answer=q["ans"],
 difficulty_level=q["diff"],
 order=order,
 explanation=q.get("ex"),
 context=json.dumps(ctx),
 )
 counts[q["diff"]] += 1
 created += 1
 test.total_questions = created
 test.is_active = True
 test.save()
 else:
 for q in data:
 counts[q["diff"]] += 1
 created += 1

 self.stdout.write(f"Prepared {created} LRT3 items (H/M/E = {counts['hard']}/{counts['medium']}/{counts['easy']})" + (" [dry-run]" if dry else ""))
 self.stdout.write("Selection ratios for LRT3 set in API: hard 50%, medium 30%, easy 20% (21 questions)")

