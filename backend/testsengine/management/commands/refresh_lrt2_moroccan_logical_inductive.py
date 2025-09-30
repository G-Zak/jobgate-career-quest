from django.core.management.base import BaseCommand
from django.db import transaction
import json
import random

from testsengine.models import Test, Question


class Command(BaseCommand):
    help = "Create/Refresh LRT2 (Logical Induction) with EN+FR, 50-item pool, clear stems and options"

    def add_arguments(self, parser):
        parser.add_argument("--dry-run", action="store_true")
        parser.add_argument("--test-id", type=int, default=14, help="Backend test id to refresh (default 14)")

    def handle(self, *args, **opts):
        test_id = opts.get("test_id", 14)
        dry = opts.get("dry_run", False)
        self.stdout.write("🇲🇦 Refreshing LRT2 Logical Induction…")

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

        # Fixed clear inductive items (patterns, sequences)
        fixed = [
            (
                "Sequence: 2, 4, 7, 11, 16, ?  What comes next?",
                "Suite : 2, 4, 7, 11, 16, ?  Quel est le nombre suivant ?",
                ['22', '21', '23', '24'],
                ['22', '21', '23', '24'],
                'A', 'easy'
            ),
            (
                "Pattern: Mon, Wed, Sat, Tue, Thu, ?  Next day in pattern?",
                "Modèle : Lun, Mer, Sam, Mar, Jeu, ?  Jour suivant du modèle ?",
                ['Dim', 'Ven', 'Lun', 'Mer'],
                ['Dim', 'Ven', 'Lun', 'Mer'],
                'B', 'medium'
            ),
            (
                "Observation: All sampled argan bottles from this cooperative are sealed. Best generalization?",
                "Observation : Toutes les bouteilles d'argan de cette coopérative échantillonnées sont scellées. Meilleure généralisation ?",
                ['Probably most bottles are sealed', 'All bottles everywhere are sealed', 'No bottles are sealed', 'Cannot infer anything'],
                ['Probablement la plupart des bouteilles sont scellées', 'Toutes les bouteilles partout sont scellées', 'Aucune bouteille n’est scellée', 'On ne peut rien en déduire'],
                'A', 'medium'
            ),
            (
                "Series: 5, 10, 20, 40, ?  Next number?",
                "Série : 5, 10, 20, 40, ?  Nombre suivant ?",
                ['80', '75', '90', '85'],
                ['80', '75', '90', '85'],
                'A', 'easy'
            ),
        ]
        for q_en, q_fr, opts_en, opts_fr, ans, diff in fixed:
            data.append(item(q_en, q_fr, opts_en, opts_fr, ans, diff))

        # Generators
        days_en = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
        days_fr = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim']

        def gen_arith_seq():
            start = random.randint(1, 9)
            step = random.randint(2, 6)
            seq = [start]
            for _ in range(4):
                seq.append(seq[-1] + step)
            next_val = seq[-1] + step
            q_en = f"Arithmetic sequence: {', '.join(map(str, seq))}, ?  Next number?"
            q_fr = f"Suite arithmétique : {', '.join(map(str, seq))}, ?  Nombre suivant ?"
            opts = [str(next_val), str(next_val+1), str(next_val-1), str(next_val+2)]
            return item(q_en, q_fr, opts, opts, 'A', random.choice(['easy','medium']))

        def gen_geo_seq():
            start = random.choice([2,3,4])
            ratio = random.choice([2,3])
            seq = [start]
            for _ in range(4):
                seq.append(seq[-1] * ratio)
            next_val = seq[-1] * ratio
            q_en = f"Geometric sequence: {', '.join(map(str, seq))}, ?  Next number?"
            q_fr = f"Suite géométrique : {', '.join(map(str, seq))}, ?  Nombre suivant ?"
            opts = [str(next_val), str(next_val//ratio), str(next_val+ratio), str(next_val+1)]
            return item(q_en, q_fr, opts, opts, random.choice(['A','A','B']), random.choice(['easy','medium']))

        def gen_alt_pattern():
            # Alternating +n, +m
            a = random.randint(1,6)
            b = random.randint(2,8)
            start = random.randint(1,10)
            seq = [start]
            add_a = True
            for _ in range(4):
                seq.append(seq[-1] + (a if add_a else b))
                add_a = not add_a
            next_val = seq[-1] + (a if add_a else b)
            q_en = f"Alternating pattern (+{a}, +{b}): {', '.join(map(str, seq))}, ?  Next number?"
            q_fr = f"Motif alterné (+{a}, +{b}) : {', '.join(map(str, seq))}, ?  Nombre suivant ?"
            opts = [str(next_val), str(next_val+a), str(next_val+b), str(next_val-1)]
            return item(q_en, q_fr, opts, opts, 'A', 'medium')

        def gen_days_pattern():
            start_i = random.randint(0,6)
            step = random.randint(1,3)
            seq_en, seq_fr = [], []
            i = start_i
            for _ in range(5):
                seq_en.append(days_en[i%7]); seq_fr.append(days_fr[i%7]); i += step
            next_en, next_fr = days_en[i%7], days_fr[i%7]
            q_en = f"Days pattern ({step}-step): {', '.join(seq_en)}, ?  Next day?"
            q_fr = f"Motif des jours (pas de {step}) : {', '.join(seq_fr)}, ?  Jour suivant ?"
            opts_en = [next_en, days_en[(i+1)%7], days_en[(i+2)%7], days_en[(i-1)%7]]
            opts_fr = [next_fr, days_fr[(i+1)%7], days_fr[(i+2)%7], days_fr[(i-1)%7]]
            return item(q_en, q_fr, opts_en, opts_fr, 'A', random.choice(['medium','hard']))

        generators = [gen_arith_seq, gen_geo_seq, gen_alt_pattern, gen_days_pattern]
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
                        'title': 'Logical Reasoning Test 2 - Induction',
                        'test_type': 'logical_reasoning',
                        'description': 'Inductive reasoning: sequences, patterns, generalization (EN + FR)',
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
                        "domain": "logical_induction",
                        "translations": {"fr": {"question_text": q["q_fr"], "options": q["opts_fr"]}},
                        "tags": ["Morocco", "logic", "induction"],
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

        self.stdout.write(f"📊 Prepared {created} LRT2 items (H/M/E = {counts['hard']}/{counts['medium']}/{counts['easy']})" + (" [dry-run]" if dry else ""))
        self.stdout.write("🎯 Selection ratios for LRT2 set in API: hard 50%, medium 30%, easy 20% (21 questions)")

