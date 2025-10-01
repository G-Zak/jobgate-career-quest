from django.core.management.base import BaseCommand
from django.db import transaction
import json
import random

from testsengine.models import Test, Question

class Command(BaseCommand):
 help = "Create/Refresh VRT3 (Classification/Odd-One-Out) with Moroccan context, FR translations, 50-item pool"

 def add_arguments(self, parser):
 parser.add_argument("--dry-run", action="store_true")
 parser.add_argument("--test-id", type=int, default=3, help="Backend test id to refresh (default 3)")

 def handle(self, *args, **opts):
 test_id = opts.get("test_id", 3)
 dry = opts.get("dry_run", False)
 self.stdout.write(" Refreshing VRT3 Classification (Odd-One-Out) with Moroccan-context items…")

 def item(q_en, q_fr, opts_en, opts_fr, ans, diff):
 return {
 "q_en": q_en,
 "q_fr": q_fr,
 "opts_en": opts_en,
 "opts_fr": opts_fr,
 "ans": ans,
 "diff": diff,
 }

 data = []

 # 1) Words (Moroccan context)
 data.extend([
 item(
 "Odd one out:",
 "L'intrus :",
 ["Casablanca", "Rabat", "Marrakech", "euro"],
 ["Casablanca", "Rabat", "Marrakech", "euro"],
 "D", "easy",
 ),
 item(
 "Odd one out:",
 "L'intrus :",
 ["argan", "olive", "almond", "sardine"],
 ["argan", "olive", "amande", "sardine"],
 "D", "easy",
 ),
 item(
 "Odd one out:",
 "L'intrus :",
 ["dirham", "MAD", "euro", "bank"],
 ["dirham", "MAD", "euro", "banque"],
 "D", "medium",
 ),
 item(
 "Odd one out (crafts):",
 "L'intrus (artisanat) :",
 ["zellige", "tadelakt", "cedar carving", "phosphate"],
 ["zellige", "tadelakt", "bois de cèdre sculpté", "phosphate"],
 "D", "medium",
 ),
 item(
 "Odd one out (foods):",
 "L'intrus (aliments) :",
 ["couscous", "tagine", "pastilla", "tram"],
 ["couscous", "tajine", "pastilla", "tramway"],
 "D", "easy",
 ),
 item(
 "Odd one out (places):",
 "L'intrus (lieux) :",
 ["Essaouira", "Agadir", "Tangier", "cedar"],
 ["Essaouira", "Agadir", "Tanger", "cèdre"],
 "D", "medium",
 ),
 ])

 # 2) Pairs (choose the pair that doesn't fit the common relationship)
 data.extend([
 item(
 "Odd pair out (product → outcome):",
 "Le couple intrus (produit → résultat) :",
 ["olive → oil", "argan → oil", "wheat → flour", "sardine → olive"],
 ["olive → huile", "argan → huile", "blé → farine", "sardine → olive"],
 "D", "medium",
 ),
 item(
 "Odd pair out (place → coast):",
 "Le couple intrus (lieu → côte) :",
 ["Agadir → Atlantic", "Tangier → Mediterranean", "Dakhla → Atlantic", "Fès → Atlantic"],
 ["Agadir → Atlantique", "Tanger → Méditerranée", "Dakhla → Atlantique", "Fès → Atlantique"],
 "D", "hard",
 ),
 item(
 "Odd pair out (animal → habitat):",
 "Le couple intrus (animal → habitat) :",
 ["camel → desert", "goat → mountain", "sardine → ocean", "argan → oasis"],
 ["chameau → désert", "chèvre → montagne", "sardine → océan", "argan → oasis"],
 "D", "hard",
 ),
 item(
 "Odd pair out (festival → city):",
 "Le couple intrus (festival → ville) :",
 ["Gnaoua → Essaouira", "Film Festival → Marrakech", "Cherry Festival → Sefrou", "Rif → Ouarzazate"],
 ["Gnaoua → Essaouira", "Festival du film → Marrakech", "Fête des cerises → Sefrou", "Rif → Ouarzazate"],
 "D", "hard",
 ),
 ])

 # 3) Numbers (properties): clearer stems per property
 # We avoid the ambiguous "Odd number out" phrasing and state the rule instead
 def add_number_question_specific(nums, intruder_index, diff, q_en, q_fr):
 opts_en = [str(n) for n in nums]
 opts_fr = opts_en[:]
 data.append(item(q_en, q_fr, opts_en, opts_fr, chr(65 + intruder_index), diff))

 def add_number_progression_question(nums, intruder_index, diff, step):
 q_en = f"Numbers: Three follow an arithmetic progression of +{step}. Which number breaks the pattern?"
 q_fr = f"Nombres : trois suivent une progression arithmétique de +{step}. Quel nombre casse le motif ?"
 add_number_question_specific(nums, intruder_index, diff, q_en, q_fr)

 # Multiples of 3 except one
 add_number_question_specific([9, 12, 18, 20], 3, "easy",
 "Numbers: Which is NOT a multiple of 3?",
 "Nombres : lequel n’est PAS un multiple de 3 ?")
 add_number_question_specific([21, 27, 30, 31], 3, "medium",
 "Numbers: Which is NOT a multiple of 3?",
 "Nombres : lequel n’est PAS un multiple de 3 ?")
 # Primes with one composite
 add_number_question_specific([11, 13, 17, 15], 3, "medium",
 "Numbers: Which number is NOT prime?",
 "Nombres : quel nombre n’est PAS premier ?")
 add_number_question_specific([19, 23, 29, 35], 3, "hard",
 "Numbers: Which number is NOT prime?",
 "Nombres : quel nombre n’est PAS premier ?")
 # Perfect squares with one non-square
 add_number_question_specific([16, 25, 36, 27], 3, "easy",
 "Numbers: Which is NOT a perfect square?",
 "Nombres : lequel n’est PAS un carré parfait ?")
 add_number_question_specific([49, 64, 81, 77], 3, "medium",
 "Numbers: Which is NOT a perfect square?",
 "Nombres : lequel n’est PAS un carré parfait ?")
 # Even/odd mix
 add_number_question_specific([8, 14, 22, 25], 3, "easy",
 "Numbers: Which is NOT even (i.e., is odd)?",
 "Nombres : lequel n’est PAS pair (c.-à-d. est impair) ?")
 add_number_question_specific([31, 37, 41, 42], 3, "medium",
 "Numbers: Which number is NOT prime?",
 "Nombres : quel nombre n’est PAS premier ?")
 # Metric trade step (250 g multiples)
 add_number_question_specific([500, 750, 1000, 900], 3, "hard",
 "Numbers: Which value is NOT a multiple of 250 g?",
 "Nombres : quelle valeur n’est PAS un multiple de 250 g ?")

 # 4) Letters (sequences/patterns)
 def add_letter_question(opts, intruder_index, diff):
 data.append(item("Odd letter out:", "La lettre intruse :", opts, opts, chr(65 + intruder_index), diff))

 # Vowels vs consonants
 add_letter_question(["A", "E", "I", "B"], 3, "easy")
 add_letter_question(["O", "U", "Y", "A"], 2, "medium") # Y treated as consonant here
 # Alphabetic steps (every 2)
 add_letter_question(["A", "C", "E", "F"], 3, "medium")
 add_letter_question(["B", "D", "F", "H"], 3, "hard")
 # Same starting letter with Moroccan words (FR/EN neutral letters)
 add_letter_question(["M", "M", "M", "R"], 3, "easy") # Marrakech, Meknès, Midelt vs Rabat

 # 5) More Moroccan words-based sets
 data.extend([
 item(
 "Odd one out (transport):",
 "L'intrus (transport) :",
 ["tram", "train", "taxi", "tajine"],
 ["tram", "train", "taxi", "tajine"],
 "D", "easy",
 ),
 item(
 "Odd one out (export):",
 "L'intrus (export) :",
 ["phosphates", "citrus", "textiles", "atlas"],
 ["phosphates", "agrumes", "textiles", "atlas"],
 "D", "medium",
 ),
 item(
 "Odd one out (regions):",
 "L'intrus (régions) :",
 ["Souss", "Draa-Tafilalet", "Oriental", "couscous"],
 ["Souss", "Drâa-Tafilalet", "L'Oriental", "couscous"],
 "D", "hard",
 ),
 item(
 "Odd one out (agriculture):",
 "L'intrus (agriculture) :",
 ["irrigation", "harvest", "sowing", "customs"],
 ["irrigation", "récolte", "semis", "douanes"],
 "D", "medium",
 ),
 item(
 "Odd one out (units):",
 "L'intrus (unités) :",
 ["kilogram", "meter", "dirham", "liter"],
 ["kilogramme", "mètre", "dirham", "litre"],
 "C", "easy",
 ),
 ])

 # Ensure at least 50 items; generate extra progression-based number items if needed
 while len(data) < 50:
 base = random.randint(10, 50)
 step = 5
 nums = [base, base + step, base + 2*step, base + (2*step + 2)] # last breaks +5 pattern
 add_number_progression_question(nums, 3, random.choice(["medium", "hard"]), step)

 created = 0
 counts = {"easy": 0, "medium": 0, "hard": 0}
 if not dry:
 with transaction.atomic():
 Question.objects.filter(test_id=test_id).delete()
 order = 0
 for q in data:
 order += 1
 ctx = {
 "locale": "MA",
 "domain": "verbal_classification",
 "translations": {
 "fr": {
 "question_text": q["q_fr"],
 "options": q["opts_fr"],
 }
 },
 "tags": ["Morocco", "classification", "odd-one-out", "metric", "MAD"],
 }
 Question.objects.create(
 test_id=test_id,
 question_type='classification',
 question_text=q["q_en"],
 passage=None,
 options=q["opts_en"],
 correct_answer=q["ans"],
 difficulty_level=q["diff"],
 order=order,
 explanation=None,
 context=json.dumps(ctx),
 )
 counts[q["diff"]] += 1
 created += 1
 test = Test.objects.filter(id=test_id).first()
 if test:
 test.title = 'Verbal Reasoning Test 3 - Classification (Moroccan Context)'
 test.description = 'Odd-One-Out across words, pairs, numbers, letters; EN with FR translations.'
 test.test_type = 'verbal_reasoning'
 test.is_active = True
 test.total_questions = created
 test.save()
 else:
 for q in data:
 counts[q["diff"]] += 1
 created += 1

 self.stdout.write(f" Prepared {created} VRT3 items (H/M/E = {counts['hard']}/{counts['medium']}/{counts['easy']})" + (" [dry-run]" if dry else ""))
 self.stdout.write(" Selection ratios for VRT3 set in API: hard 50%, medium 30%, easy 20% (21 questions)")

