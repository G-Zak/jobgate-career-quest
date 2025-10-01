from django.core.management.base import BaseCommand
from django.db import transaction
import json
import random

from testsengine.models import Test, Question

class Command(BaseCommand):
 help = "Create/Refresh VRT5 (Blood Relations & Logical Puzzles) with Moroccan context, FR translations, 50-item pool"

 def add_arguments(self, parser):
 parser.add_argument("--dry-run", action="store_true")
 parser.add_argument("--test-id", type=int, default=5, help="Backend test id to refresh (default 5)")

 def handle(self, *args, **opts):
 test_id = opts.get("test_id", 5)
 dry = opts.get("dry_run", False)
 self.stdout.write(" Refreshing VRT5 Blood Relations & Logical Puzzles…")

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

 # Names and relation lexicon
 names = ["Ahmed","Fatima","Hassan","Imane","Omar","Khadija","Youssef","Sara","Nadia","Rachid"]
 rel_en = {
 'aunt': 'Aunt', 'uncle': 'Uncle', 'niece': 'Niece', 'nephew': 'Nephew',
 'father_in_law': 'Father-in-law', 'mother_in_law': 'Mother-in-law',
 'brother_in_law': 'Brother-in-law', 'sister_in_law': 'Sister-in-law',
 'cousin': 'Cousin', 'grandfather': 'Grandfather', 'grandmother': 'Grandmother',
 'son': 'Son', 'daughter': 'Daughter', 'father': 'Father', 'mother': 'Mother',
 'brother': 'Brother', 'sister': 'Sister'
 }
 rel_fr = {
 'aunt': 'Tante', 'uncle': 'Oncle', 'niece': 'Nièce', 'nephew': 'Neveu',
 'father_in_law': 'Beau-père', 'mother_in_law': 'Belle-mère',
 'brother_in_law': 'Beau-frère', 'sister_in_law': 'Belle-sœur',
 'cousin': 'Cousin(e)', 'grandfather': 'Grand-père', 'grandmother': 'Grand-mère',
 'son': 'Fils', 'daughter': 'Fille', 'father': 'Père', 'mother': 'Mère',
 'brother': 'Frère', 'sister': 'Sœur'
 }

 # 1) Simple family tree (easy)
 easy_triples = [
 ("Ahmed is the son of Hassan. Khadija is Hassan's sister. How is Khadija related to Ahmed?",
 "Ahmed est le fils de Hassan. Khadija est la sœur de Hassan. Quel est le lien de Khadija avec Ahmed ?",
 'aunt'),
 ("Omar is married to Imane. Hassan is Omar's father. How is Hassan related to Imane?",
 "Omar est marié à Imane. Hassan est le père d'Omar. Quel est le lien de Hassan avec Imane ?",
 'father_in_law'),
 ("Fatima is Nadia's mother. Rachid is Fatima's brother. How is Rachid related to Nadia?",
 "Fatima est la mère de Nadia. Rachid est le frère de Fatima. Quel est le lien de Rachid avec Nadia ?",
 'uncle'),
 ]
 for q_en, q_fr, correct_key in easy_triples:
 options_keys = ['aunt','uncle','cousin','sister']
 # Ensure correct in A
 opts_en = [rel_en[correct_key]] + [rel_en[k] for k in options_keys if k != correct_key][:3]
 opts_fr = [rel_fr[correct_key]] + [rel_fr[k] for k in options_keys if k != correct_key][:3]
 data.append(item(q_en, q_fr, opts_en, opts_fr, 'A', 'easy'))

 # 2) Medium: in-laws and generational (medium)
 mediums = [
 ("Imane is the sister of Ahmed. Ahmed is married to Sara. How is Imane related to Sara?",
 "Imane est la sœur d'Ahmed. Ahmed est marié à Sara. Quel est le lien d'Imane avec Sara ?",
 'sister_in_law', ['sister_in_law','cousin','aunt','niece']),
 ("Youssef is the son of Omar. Omar is the son of Hassan. How is Hassan related to Youssef?",
 "Youssef est le fils d'Omar. Omar est le fils de Hassan. Quel est le lien de Hassan avec Youssef ?",
 'grandfather', ['grandfather','father','uncle','cousin']),
 ("Khadija is the daughter of Fatima. Fatima is the daughter of Rachid. How is Rachid related to Khadija?",
 "Khadija est la fille de Fatima. Fatima est la fille de Rachid. Quel est le lien de Rachid avec Khadija ?",
 'grandfather', ['grandfather','father','uncle','brother'])
 ]
 for q_en, q_fr, correct_key, keys in mediums:
 opts_en = [rel_en[k] for k in keys]
 opts_fr = [rel_fr[k] for k in keys]
 data.append(item(q_en, q_fr, opts_en, opts_fr, 'A', 'medium'))

 # 3) Hard: multi-statement chains (hard)
 hards = [
 ("Ahmed says: 'Fatima is my mother's husband's daughter.' If Ahmed has no sisters, who is Fatima to Ahmed?",
 "Ahmed dit : 'Fatima est la fille du mari de ma mère.' Si Ahmed n'a pas de sœurs, qui est Fatima pour Ahmed ?",
 ['self','cousin','aunt','sister'], 'self'),
 ("Omar points to a photo and says: 'He is the son of the only son of my grandfather.' Who is the person to Omar?",
 "Omar montre une photo et dit : 'C'est le fils du seul fils de mon grand-père.' Qui est cette personne par rapport à Omar ?",
 ['brother','cousin','nephew','uncle'], 'brother'),
 ]
 for q_en, q_fr, key_opts, correct_key in hards:
 map_en = {'self':'Self', 'brother':'Brother', 'cousin':'Cousin', 'aunt':'Aunt', 'sister':'Sister', 'nephew':'Nephew', 'uncle':'Uncle'}
 map_fr = {'self':'Lui-même', 'brother':'Frère', 'cousin':'Cousin', 'aunt':'Tante', 'sister':'Sœur', 'nephew':'Neveu', 'uncle':'Oncle'}
 opts_en = [map_en[k] for k in key_opts]
 opts_fr = [map_fr[k] for k in key_opts]
 correct_index = key_opts.index(correct_key)
 data.append(item(q_en, q_fr, opts_en, opts_fr, chr(65+correct_index), 'hard'))

 # 4) Short logical puzzles (seating/directions) (mix)
 puzzles = [
 ("Four friends (Ahmed, Omar, Hassan, Youssef) sit in a row facing north. Ahmed is to the immediate right of Omar. Hassan is at one end. Who sits at the other end?",
 "Quatre amis (Ahmed, Omar, Hassan, Youssef) sont assis en rangée face au nord. Ahmed est immédiatement à droite d'Omar. Hassan est à une extrémité. Qui est à l'autre extrémité ?",
 ['Youssef','Ahmed','Omar','Cannot be determined'], 'Youssef', 'medium'),
 ("Fatima starts at the souk, walks 2 km east, then 2 km south, then 2 km west. Where is she relative to the start?",
 "Fatima part du souk, marche 2 km vers l'est, puis 2 km vers le sud, puis 2 km vers l'ouest. Où se trouve-t-elle par rapport au départ ?",
 ['2 km south','2 km east','at start','2 km west'], '2 km south', 'easy'),
 ]
 for q_en, q_fr, opts_en, correct_en, diff in puzzles:
 # FR options mirror EN exactly for these
 opts_fr = opts_en[:]
 correct_index = opts_en.index(correct_en)
 data.append(item(q_en, q_fr, opts_en, opts_fr, chr(65+correct_index), diff))

 # 5) Auto-generate relation questions to reach 50 items
 def gen_relation_question():
 A, B, C = random.sample(names, 3)
 female_names = {"Fatima","Imane","Khadija","Sara","Nadia"}

 pattern = random.choice(['aunt','uncle','sister_in_law','brother_in_law','grandfather','grandmother','cousin'])
 if pattern == 'aunt':
 q_en = f"{A} is the sister of {B}. {B} is the parent of {C}. How is {A} related to {C}?"
 q_fr = f"{A} est la sœur de {B}. {B} est le parent de {C}. Quel est le lien de {A} avec {C} ?"
 correct = 'aunt'
 decoys = ['cousin','sister','mother']
 elif pattern == 'uncle':
 q_en = f"{A} is the brother of {B}. {C} is the child of {B}. How is {A} related to {C}?"
 q_fr = f"{A} est le frère de {B}. {C} est l'enfant de {B}. Quel est le lien de {A} avec {C} ?"
 correct = 'uncle'
 decoys = ['cousin','brother','father']
 elif pattern == 'sister_in_law':
 q_en = f"{A} is married to {B}. {C} is the sister of {B}. How is {C} related to {A}?"
 q_fr = f"{A} est marié(e) à {B}. {C} est la sœur de {B}. Quel est le lien de {C} avec {A} ?"
 correct = 'sister_in_law'
 decoys = ['aunt','cousin','mother_in_law']
 elif pattern == 'brother_in_law':
 q_en = f"{A} is married to {B}. {C} is the brother of {B}. How is {C} related to {A}?"
 q_fr = f"{A} est marié(e) à {B}. {C} est le frère de {B}. Quel est le lien de {C} avec {A} ?"
 correct = 'brother_in_law'
 decoys = ['uncle','cousin','father_in_law']
 elif pattern == 'grandfather':
 q_en = f"{B} is the parent of {C}. {A} is the parent of {B}. How is {A} related to {C}?"
 q_fr = f"{B} est le parent de {C}. {A} est le parent de {B}. Quel est le lien de {A} avec {C} ?"
 correct = 'grandfather'
 decoys = ['father','uncle','cousin']
 elif pattern == 'grandmother':
 q_en = f"{B} is the parent of {C}. {A} is the mother of {B}. How is {A} related to {C}?"
 q_fr = f"{B} est le parent de {C}. {A} est la mère de {B}. Quel est le lien de {A} avec {C} ?"
 correct = 'grandmother'
 decoys = ['mother','aunt','cousin']
 else: # cousin-derived aunt/uncle depending on B's gender
 q_en = f"{A} and {B} are children of siblings. {C} is the child of {A}. How is {B} related to {C}?"
 q_fr = f"{A} et {B} sont enfants de frères/sœurs. {C} est l'enfant de {A}. Quel est le lien de {B} avec {C} ?"
 correct = 'aunt' if B in female_names else 'uncle'
 decoys = ['cousin','sister','niece'] if correct == 'aunt' else ['cousin','brother','nephew']
 opts_keys = [correct] + decoys
 opts_en = [rel_en[k] for k in opts_keys]
 opts_fr = [rel_fr[k] for k in opts_keys]
 diff = random.choice(['easy','medium','hard'])
 return item(q_en, q_fr, opts_en, opts_fr, 'A', diff)

 while len(data) < 50:
 data.append(gen_relation_question())

 # Persist --------------------------------------------------------------
 created = 0
 counts = {"easy": 0, "medium": 0, "hard": 0}
 if not dry:
 with transaction.atomic():
 # Ensure the Test exists
 test, _ = Test.objects.get_or_create(
 id=test_id,
 defaults={
 'title': 'Verbal Reasoning Test 5 - Blood Relations & Logical Puzzles (Moroccan Context)',
 'test_type': 'verbal_reasoning',
 'description': 'Family-tree and logic challenges; EN with FR translations.',
 'duration_minutes': 20,
 'total_questions': 50,
 'passing_score': 70,
 'is_active': True,
 }
 )
 # Refresh question pool
 Question.objects.filter(test_id=test_id).delete()
 order = 0
 for q in data:
 order += 1
 ctx = {
 "locale": "MA",
 "domain": "blood_relations_logical_puzzles",
 "translations": {"fr": {"question_text": q["q_fr"], "options": q["opts_fr"]}},
 "tags": ["Morocco", "blood_relations", "family_tree", "logic"],
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
 # Update test metadata
 test.title = 'Verbal Reasoning Test 5 - Blood Relations & Logical Puzzles (Moroccan Context)'
 test.description = 'Family-tree and logic challenges; EN with FR translations.'
 test.test_type = 'verbal_reasoning'
 test.is_active = True
 test.total_questions = created
 test.save()
 else:
 for q in data:
 counts[q["diff"]] += 1
 created += 1

 self.stdout.write(f" Prepared {created} VRT5 items (H/M/E = {counts['hard']}/{counts['medium']}/{counts['easy']})" + (" [dry-run]" if dry else ""))
 self.stdout.write(" Selection ratios for VRT5 set in API: hard 50%, medium 30%, easy 20% (21 questions)")

