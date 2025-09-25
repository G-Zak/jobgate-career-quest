from django.core.management.base import BaseCommand
from django.db import transaction
import json
import random

from testsengine.models import Test, Question


class Command(BaseCommand):
    help = "Create/Refresh LRT1 (Logical Deduction) with EN+FR, 50-item pool, clear stems and options"

    def add_arguments(self, parser):
        parser.add_argument("--dry-run", action="store_true")
        parser.add_argument("--test-id", type=int, default=13, help="Backend test id to refresh (default 13)")

    def handle(self, *args, **opts):
        test_id = opts.get("test_id", 13)
        dry = opts.get("dry_run", False)
        self.stdout.write("🇲🇦 Refreshing LRT1 Logical Deduction…")

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

        # Fixed clear items (mix)
        fixed = [
            (
                "Premise 1: All chefs wear aprons. Premise 2: Ahmed is a chef. Conclusion: Ahmed wears an apron. Is the conclusion valid?",
                "Prémisse 1 : Tous les chefs portent des tabliers. Prémisse 2 : Ahmed est chef. Conclusion : Ahmed porte un tablier. La conclusion est-elle valide ?",
                ['Yes, valid', 'No, invalid', 'Cannot be determined', 'Premises contradict'],
                ['Oui, valide', 'Non, invalide', 'Impossible à déterminer', 'Prémisses contradictoires'],
                'A', 'easy'
            ),
            (
                "Premise 1: If it rains, streets get wet. Premise 2: Streets are wet. Conclusion: It rained. Is the conclusion valid?",
                "Prémisse 1 : S'il pleut, les rues sont mouillées. Prémisse 2 : Les rues sont mouillées. Conclusion : Il a plu. La conclusion est-elle valide ?",
                ['Yes, valid', 'No, invalid', 'Cannot be determined', 'Premises contradict'],
                ['Oui, valide', 'Non, invalide', 'Impossible à déterminer', 'Prémisses contradictoires'],
                'B', 'easy'
            ),
            (
                "Premise 1: No olives are sweet. Premise 2: Some market foods are olives. Conclusion: Some market foods are not sweet. Is the conclusion valid?",
                "Prémisse 1 : Aucune olive n'est sucrée. Prémisse 2 : Certains produits du souk sont des olives. Conclusion : Certains produits du souk ne sont pas sucrés. La conclusion est-elle valide ?",
                ['Yes, valid', 'No, invalid', 'Cannot be determined', 'Premises contradict'],
                ['Oui, valide', 'Non, invalide', 'Impossible à déterminer', 'Prémisses contradictoires'],
                'A', 'medium'
            ),
            (
                "Premise 1: All engineers are logical. Premise 2: Some Moroccans are engineers. Conclusion: Some Moroccans are logical. Is the conclusion valid?",
                "Prémisse 1 : Tous les ingénieurs sont logiques. Prémisse 2 : Certains Marocains sont ingénieurs. Conclusion : Certains Marocains sont logiques. La conclusion est-elle valide ?",
                ['Yes, valid', 'No, invalid', 'Cannot be determined', 'Premises contradict'],
                ['Oui, valide', 'Non, invalide', 'Impossible à déterminer', 'Prémisses contradictoires'],
                'A', 'medium'
            ),
            (
                "Premise 1: If the ferry departs, the horn sounds. Premise 2: The horn did not sound. Conclusion: The ferry did not depart. Is the conclusion valid?",
                "Prémisse 1 : Si le ferry part, la sirène retentit. Prémisse 2 : La sirène n'a pas retenti. Conclusion : Le ferry n'est pas parti. La conclusion est-elle valide ?",
                ['Yes, valid', 'No, invalid', 'Cannot be determined', 'Premises contradict'],
                ['Oui, valide', 'Non, invalide', 'Impossible à déterminer', 'Prémisses contradictoires'],
                'A', 'hard'
            ),
            (
                "Premise 1: Some artisans are coop members. Premise 2: All coop members document their work. Conclusion: Some artisans document their work. Is the conclusion valid?",
                "Prémisse 1 : Certains artisans sont membres d'une coopérative. Prémisse 2 : Tous les membres de la coopérative documentent leur travail. Conclusion : Certains artisans documentent leur travail. La conclusion est-elle valide ?",
                ['Yes, valid', 'No, invalid', 'Cannot be determined', 'Premises contradict'],
                ['Oui, valide', 'Non, invalide', 'Impossible à déterminer', 'Prémisses contradictoires'],
                'A', 'hard'
            ),
        ]
        for q_en, q_fr, opts_en, opts_fr, ans, diff in fixed:
            data.append(item(q_en, q_fr, opts_en, opts_fr, ans, diff))

        # Template generators to reach 50 items
        persons = ["Ahmed","Fatima","Hassan","Imane","Omar","Khadija"]
        places = ["Casablanca","Rabat","Marrakech","Fès","Agadir"]

        def gen_syllogism():
            A = random.choice(["All", "No"])  # All X are Y / No X are Y
            X = random.choice(["students","merchants","drivers","tourists","engineers"]) 
            Y = random.choice(["Moroccans","professionals","artists","writers","athletes"]) 
            z = random.choice(persons)
            premise2 = f"{z} is an {X[:-1]}" if X.endswith('s') else f"{z} is {X}"
            if A == "All":
                q_en = f"Premise 1: All {X} are {Y}. Premise 2: {premise2}. Conclusion: {z} is a {Y[:-1] if Y.endswith('s') else Y}. Is the conclusion valid?"
                q_fr = f"Prémisse 1 : Tous les {X} sont des {Y}. Prémisse 2 : {z} est {('un '+X[:-1]) if X.endswith('s') else (' '+X)}. Conclusion : {z} est {('un '+Y[:-1]) if Y.endswith('s') else (' '+Y)}. La conclusion est-elle valide ?"
                ans = 'A'
                diff = random.choice(['easy','medium'])
            else:
                q_en = f"Premise 1: No {X} are {Y}. Premise 2: {premise2}. Conclusion: {z} is not a {Y[:-1] if Y.endswith('s') else Y}. Is the conclusion valid?"
                q_fr = f"Prémisse 1 : Aucun {X} n'est {Y}. Prémisse 2 : {z} est {('un '+X[:-1]) if X.endswith('s') else (' '+X)}. Conclusion : {z} n'est pas {('un '+Y[:-1]) if Y.endswith('s') else (' '+Y)}. La conclusion est-elle valide ?"
                ans = 'A'
                diff = random.choice(['easy','medium'])
            opts_en = ['Yes, valid','No, invalid','Cannot be determined','Premises contradict']
            opts_fr = ['Oui, valide','Non, invalide','Impossible à déterminer','Prémisses contradictoires']
            return item(q_en, q_fr, opts_en, opts_fr, ans, diff)

        def gen_conditionals():
            p = random.choice(["it rains","power fails","the shop opens","the train departs"]) 
            q = random.choice(["streets get wet","lights go off","sales begin","the whistle blows"]) 
            q_en = (
                f"Premise 1: If {p}, then {q}. Premise 2: {q.capitalize()}. Conclusion: {p.capitalize()}. Is the conclusion valid?"
            )
            q_fr = (
                f"Prémisse 1 : Si {p}, alors {q}. Prémisse 2 : {q.capitalize()}. Conclusion : {p.capitalize()}. La conclusion est-elle valide ?"
            )
            opts_en = ['Yes, valid','No, invalid','Cannot be determined','Premises contradict']
            opts_fr = ['Oui, valide','Non, invalide','Impossible à déterminer','Prémisses contradictoires']
            return item(q_en, q_fr, opts_en, opts_fr, 'B', random.choice(['easy','medium']))

        def gen_venn():
            X = random.choice(["cooperatives","souks","cafés","museums"]) 
            Y = random.choice(["places with guides","places with tickets","places with menus","quiet places"]) 
            Z = random.choice(["crowded places","historic sites","expensive places"]) 
            q_en = (
                f"Premise 1: All {X} are {Y}. Premise 2: Some {Y} are {Z}. Conclusion: Some {X} are {Z}. Is the conclusion valid?"
            )
            q_fr = (
                f"Prémisse 1 : Tous les {X} sont des {Y}. Prémisse 2 : Certains {Y} sont des {Z}. Conclusion : Certains {X} sont des {Z}. La conclusion est-elle valide ?"
            )
            # Typically invalid (existential import caution), we label as invalid for training
            return item(q_en, q_fr, ['Yes, valid','No, invalid','Cannot be determined','Premises contradict'],
                        ['Oui, valide','Non, invalide','Impossible à déterminer','Prémisses contradictoires'], 'B', 'hard')

        # Fill to 50
        generators = [gen_syllogism, gen_conditionals, gen_venn]
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
                        'title': 'Logical Reasoning Test 1 - Deduction',
                        'test_type': 'logical_reasoning',
                        'description': 'Deductive logic: syllogisms, conditionals, and set relations (EN + FR)',
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
                        "domain": "logical_deduction",
                        "translations": {"fr": {"question_text": q["q_fr"], "options": q["opts_fr"]}},
                        "tags": ["Morocco", "logic", "deduction"],
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

        self.stdout.write(f"📊 Prepared {created} LRT1 items (H/M/E = {counts['hard']}/{counts['medium']}/{counts['easy']})" + (" [dry-run]" if dry else ""))
        self.stdout.write("🎯 Selection ratios for LRT1 set in API: hard 50%, medium 30%, easy 20% (21 questions)")

