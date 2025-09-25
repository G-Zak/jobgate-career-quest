from django.core.management.base import BaseCommand
from django.db import transaction
import json
import random
import string

from testsengine.models import Test, Question


class Command(BaseCommand):
    help = "Create/Refresh VRT4 (Coding & Decoding) with Moroccan context, FR translations, 50-item pool"

    def add_arguments(self, parser):
        parser.add_argument("--dry-run", action="store_true")
        parser.add_argument("--test-id", type=int, default=4, help="Backend test id to refresh (default 4)")

    def handle(self, *args, **opts):
        test_id = opts.get("test_id", 4)
        dry = opts.get("dry_run", False)
        self.stdout.write("🇲🇦 Refreshing VRT4 Coding & Decoding with Moroccan-context items…")

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

        # Helpers --------------------------------------------------------------
        alphabet = string.ascii_uppercase
        def caesar(word: str, shift: int) -> str:
            res = []
            for ch in word.upper():
                if ch in alphabet:
                    idx = (alphabet.index(ch) + shift) % 26
                    res.append(alphabet[idx])
                else:
                    res.append(ch)
            return "".join(res)

        def a1z26(word: str) -> str:
            return "-".join(str(alphabet.index(ch) + 1) for ch in word.upper() if ch in alphabet)

        def spaced(word: str) -> str:
            return " ".join(list(word.upper()))

        # 1) Caesar shift patterns (easy/medium)
        city_words = ["RABAT", "FES", "MEKNES", "AGADIR", "TANGIER", "OUARZAZATE"]
        for w in city_words[:4]:
            code = caesar(w, 1)
            opts = [code, caesar(w, 2), caesar(w[::-1], 1), w[::-1]]
            data.append(item(
                f"If each letter is shifted by +1 (A→B, B→C, …), what is the code for '{w}'?",
                f"Si chaque lettre est décalée de +1 (A→B, B→C, …), quel est le code de « {w} » ?",
                opts, opts, 'A', 'easy'))
        for w in city_words[2:6]:
            code = caesar(w, 2)
            opts = [code, caesar(w, 1), caesar(w, 3), caesar(w[::-1], 2)]
            data.append(item(
                f"Using a Caesar shift of +2, the code for '{w}' is:",
                f"Avec un décalage de César de +2, le code de « {w} » est :",
                opts, opts, 'A', 'medium'))

        # 2) A1Z26 (letters to numbers) (easy/medium)
        words = ["CASA", "MOROCCO", "SOUK", "ARGAN", "SAFI", "NADOR"]
        for w in words[:3]:
            code = a1z26(w)
            decoys = [a1z26(w[::-1]), a1z26(caesar(w, 1)), a1z26(w).replace('-', ' ')]
            opts = [code, decoys[0], decoys[1], decoys[2]]
            data.append(item(
                f"In A1Z26 (A=1,…,Z=26), what is the code for '{w}'?",
                f"En A1Z26 (A=1,…,Z=26), quel est le code de « {w} » ?",
                opts, opts, 'A', 'easy'))
        for w in words[2:6]:
            code = a1z26(w)
            # Harder decoys: shuffle some numbers
            nums = code.split('-')
            decoy2 = '-'.join(nums[::-1])
            decoy3 = '-'.join(str(int(n)+1) for n in nums)
            decoy4 = '-'.join(nums[:-1] + [str(int(nums[-1])-1)])
            opts = [code, decoy2, decoy3, decoy4]
            data.append(item(
                f"Using A1Z26, select the correct code for '{w}'.",
                f"En A1Z26, choisissez le code correct pour « {w} ».",
                opts, opts, 'A', 'medium'))

        # 3) Word-to-code mapping (rules discovery) (medium/hard)
        mapping_examples = [
            ("FEZ", "GFA", "+1 each"),  # +1 per letter
            ("RABAT", "SBCBU", "+1 each"),
            ("SOUK", "TOVL", "+1 each"),
        ]
        targets = ["MEKNES", "SAFI", "NADOR", "CASABLANCA"]
        for t in targets:
            code = caesar(t, 1)
            opts = [code, caesar(t, 2), t[::-1], caesar(t, -1)]
            data.append(item(
                "If FEZ→GFA, RABAT→SBCBU, SOUK→TOVL (each letter +1), what is the code for '" + t + "'?",
                "Si FÈS→GFA, RABAT→SBCBU, SOUK→TOVL (chaque lettre +1), quel est le code de « " + t + " » ?",
                opts, opts, 'A', 'medium'))

        # 4) Mixed: reverse + shift (hard)
        samples = ["MARRAKECH", "OUJDA", "TETOUAN", "CHEFCHAOUEN"]
        for w in samples:
            code = caesar(w[::-1], 1)
            opts = [code, w[::-1], caesar(w, 1), caesar(w[::-1], 2)]
            data.append(item(
                f"Rule: reverse the word then shift each letter by +1. Code for '{w}' is:",
                f"Règle : inverser le mot puis décaler chaque lettre de +1. Le code de « {w} » est :",
                opts, opts, 'A', 'hard'))

        # 5) Number coding: replace each letter by its position sum (hard)
        names = ["AHMED", "FATIMA", "HASSAN", "IMANE", "OMAR", "KHADIJA"]
        def letters_sum(word):
            return sum(alphabet.index(ch) + 1 for ch in word)
        for w in names:
            true_sum = letters_sum(w)
            opts = [str(true_sum), str(true_sum+1), str(true_sum-1), str(true_sum+2)]
            data.append(item(
                f"If a word's code equals the sum of its letter positions (A=1,…,Z=26), what is the code for '{w}'?",
                f"Si le code d’un mot est la somme des positions de ses lettres (A=1,…,Z=26), quel est le code de « {w} » ?",
                opts, opts, 'A', 'hard'))

        # 6) Pattern: alternate +1/-1 (medium/hard)
        alt_words = ["RABAT", "SAHARA", "ATLAS", "CASABLANCA"]
        def alt_shift(word):
            out = []
            for i, ch in enumerate(word):
                out.append(caesar(ch, 1 if i % 2 == 0 else -1))
            return "".join(out)
        for w in alt_words:
            code = alt_shift(w)
            opts = [code, caesar(w, 1), caesar(w, -1), w[::-1]]
            data.append(item(
                f"Rule: positions 1,3,5… +1; positions 2,4,6… −1. Code for '{w}'?",
                f"Règle : positions 1,3,5… +1 ; positions 2,4,6… −1. Code de « {w} » ?",
                opts, opts, 'A', random.choice(['medium','hard'])))

        # Ensure at least 50 items; generate extra Caesar items
        while len(data) < 50:
            w = random.choice(["RABAT","FES","SAFI","NADOR","OUJDA","AGADIR","TANGIER"])  # names/cities
            s = random.choice([1,2,3])
            code = caesar(w, s)
            opts = [code, caesar(w, (s+1)%26), caesar(w[::-1], s), w[::-1]]
            diff = 'easy' if s == 1 else ('medium' if s == 2 else 'hard')
            data.append(item(
                f"Using a Caesar shift of +{s}, the code for '{w}' is:",
                f"Avec un décalage de César de +{s}, le code de « {w} » est :",
                opts, opts, 'A', diff))

        # Persist --------------------------------------------------------------
        created = 0
        counts = {"easy": 0, "medium": 0, "hard": 0}
        if not dry:
            with transaction.atomic():
                # Ensure the Test exists
                test, _ = Test.objects.get_or_create(
                    id=test_id,
                    defaults={
                        'title': 'Verbal Reasoning Test 4 - Coding & Decoding (Moroccan Context)',
                        'test_type': 'verbal_reasoning',
                        'description': 'Crack letter/number coding patterns; EN with FR translations.',
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
                        "domain": "coding_decoding",
                        "translations": {"fr": {"question_text": q["q_fr"], "options": q["opts_fr"]}},
                        "tags": ["Morocco", "coding", "decoding", "caesar", "A1Z26"],
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
                test.title = 'Verbal Reasoning Test 4 - Coding & Decoding (Moroccan Context)'
                test.description = 'Crack letter/number coding patterns; EN with FR translations.'
                test.test_type = 'verbal_reasoning'
                test.is_active = True
                test.total_questions = created
                test.save()
        else:
            for q in data:
                counts[q["diff"]] += 1
                created += 1

        self.stdout.write(f"📊 Prepared {created} VRT4 items (H/M/E = {counts['hard']}/{counts['medium']}/{counts['easy']})" + (" [dry-run]" if dry else ""))
        self.stdout.write("🎯 Selection ratios for VRT4 set in API: hard 50%, medium 30%, easy 20% (21 questions)")

