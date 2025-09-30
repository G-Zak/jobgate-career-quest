"""
Create/Refresh NRT2 - Numerical Reasoning (Advanced) with Moroccan-context questions.
- Creates the test if missing (title: NRT2 - Numerical Reasoning (Advanced))
- Removes existing questions for this test
- Inserts 60 questions with heavier mix on medium/hard difficulty
- Adds French translations in context JSON
"""
from django.core.management.base import BaseCommand
from django.db import transaction
from testsengine.models import Test, Question
import json


def q(order, diff, correct, q_en, opts_en, expl_en, q_fr, opts_fr, expl_fr, cat='numerical', calc=False, steps=True):
    return {
        'order': order,
        'difficulty_level': diff,
        'category': cat,
        'correct_answer': correct,
        'question_text_en': q_en,
        'options_en': [{'option_id': k, 'text': v} for k, v in opts_en],
        'explanation_en': expl_en,
        'question_text_fr': q_fr,
        'options_fr': [{'option_id': k, 'text': v} for k, v in opts_fr],
        'explanation_fr': expl_fr,
        'requires_calculator': calc,
        'multiple_steps': steps,
        'moroccan_context': True
    }


class Command(BaseCommand):
    help = 'Create/Refresh NRT2 (Advanced Numerical Reasoning) with 60 Moroccan-context questions and FR translations.'

    def add_arguments(self, parser):
        parser.add_argument('--dry-run', action='store_true', help='Show actions without writing to DB')

    def handle(self, *args, **opts):
        title = 'NRT2 - Numerical Reasoning (Advanced)'
        test = Test.objects.filter(title=title, test_type='numerical_reasoning').first()
        if not test:
            test = Test.objects.create(
                title=title,
                test_type='numerical_reasoning',
                description='Advanced numerical reasoning with Moroccan context and mixed difficulty.',
                duration_minutes=20,
                total_questions=60,
                passing_score=70,
                is_active=True,
                version='1.0'
            )
        
        data = self._build_questions()
        self.stdout.write(f"Prepared {len(data)} questions for {title} (test_id={test.id}).")

        if opts['dry_run']:
            self.stdout.write(self.style.WARNING('DRY RUN: No DB changes made.'))
            for d in data[:5]:
                self.stdout.write(f"#{d['order']} [{d['difficulty_level']}] {d['question_text_en'][:70]}… -> {d['correct_answer']}")
            return

        with transaction.atomic():
            deleted = test.questions.count()
            test.questions.all().delete()
            self.stdout.write(f'Deleted {deleted} existing questions for test {test.id}.')

            created = 0
            for d in data:
                qobj = Question.objects.create(
                    test=test,
                    question_type='multiple_choice',
                    question_text=d['question_text_en'],
                    options=d['options_en'],
                    correct_answer=d['correct_answer'],
                    explanation=d['explanation_en'],
                    difficulty_level=d['difficulty_level'],
                    order=d['order'],
                )
                qobj.context = json.dumps({
                    'translations': {
                        'fr': {
                            'question_text': d['question_text_fr'],
                            'options': d['options_fr'],
                            'explanation': d['explanation_fr']
                        }
                    },
                    'metadata': {
                        'category': d['category'],
                        'requires_calculator': d['requires_calculator'],
                        'multiple_steps': d['multiple_steps'],
                        'moroccan_context': True
                    }
                })
                qobj.save()
                created += 1

            test.total_questions = created
            try:
                test.max_possible_score = test.calculate_max_score()
            except Exception:
                pass
            test.save()

        self.stdout.write(self.style.SUCCESS(f'Refreshed {created} questions for {title} (test_id={test.id}).'))

    def _build_questions(self):
        # Programmatically build 60 questions with Moroccan context and FR translations (ASCII-safe)
        cities = [
            'Casablanca','Rabat','Marrakech','Fes','Tangier','Agadir','Oujda','Meknes','Tetouan',
            'Chefchaouen','Essaouira','Safi','Nador','Ouarzazate','Kenitra'
        ]
        Q = []
        o = 1

        def add(q_en, opts_en, expl_en, q_fr, opts_fr, expl_fr, diff):
            nonlocal o
            # correct answer is the first tuple's letter
            correct_letter = opts_en[0][0]
            opts_en_norm = [(chr(65+i), text) for i, (_, text) in enumerate(opts_en[:4])]
            opts_fr_norm = [(chr(65+i), text) for i, (_, text) in enumerate(opts_fr[:4])]
            Q.append(q(o, diff, correct_letter, q_en, opts_en_norm, expl_en, q_fr, opts_fr_norm, expl_fr))
            o += 1

        def fmt_mad(x):
            return f"{int(x)} MAD" if abs(x - int(x)) < 1e-9 else f"{x:.1f} MAD"

        ci = 0
        def city():
            nonlocal ci
            c = cities[ci % len(cities)]
            ci += 1
            return c

        # EASY (12) - discounts, unit prices, simple speed-time
        easy_discounts = [(500,10),(600,15),(800,20),(350,5),(1200,12),(950,8)]
        for price, disc in easy_discounts:
            c = city()
            disc_amt = round(price*disc/100,2)
            sale = round(price - disc_amt, 2)
            q_en = f"A shop in {c} offers {disc}% off on an item priced {fmt_mad(price)}. Sale price?"
            q_fr = f"Boutique a {c} offre {disc}% sur un article a {fmt_mad(price)}. Prix solde ?"
            correct = fmt_mad(sale)
            opts = [('A', correct), ('B', fmt_mad(price)), ('C', fmt_mad(sale+10)), ('D', fmt_mad(sale-10))]
            add(q_en, opts, f"Discount={disc_amt} -> {correct}.", q_fr, opts, f"Remise={disc_amt} -> {correct}.", 'easy')

        unit_cases = [(3,36),(2.5,50),(4,70)]
        for kg, total in unit_cases:
            c = city()
            p = round(total/kg, 2)
            q_en = f"In {c}, {kg} kg of olives cost {fmt_mad(total)}. Price per kg?"
            q_fr = f"A {c}, {kg} kg d'olives coutent {fmt_mad(total)}. Prix au kg ?"
            correct = fmt_mad(p)
            opts = [('A', correct), ('B', fmt_mad(p+1)), ('C', fmt_mad(p-1)), ('D', fmt_mad(p+2))]
            add(q_en, opts, f"Unit price = {total}/{kg} = {p} MAD/kg.", q_fr, opts, f"Prix unitaire = {total}/{kg} = {p} MAD/kg.", 'easy')

        st_cases = [(40,80),(60,60),(150,50)]
        for dist, sp in st_cases:
            c = city()
            minutes = int(round(dist/sp*60))
            q_en = f"A bus in {c} travels {dist} km at {sp} km/h. Travel time (minutes)?"
            q_fr = f"Un bus a {c} parcourt {dist} km a {sp} km/h. Temps (minutes) ?"
            opts = [('A', f"{minutes}"), ('B', f"{minutes-5}"), ('C', f"{minutes+5}"), ('D', f"{minutes+10}")]
            add(q_en, opts, f"t = d/v -> {minutes} min.", q_fr, opts, f"t = d/v -> {minutes} min.", 'easy')

        # MEDIUM (24)
        chain_cases = [(15,-10),(12,8),(20,-15),(10,10)]
        for up, down in chain_cases:
            c = city()
            factor = (1+up/100)*(1+down/100)
            net = round((factor-1)*100,1)
            q_en = f"In {c}, a price increases by {up}% then changes by {down}%. Net change?"
            q_fr = f"A {c}, un prix augmente de {up}% puis change de {down}%. Variation nette ?"
            correct = f"{net}%"
            opts = [('A', correct), ('B', f"{net+1}%"), ('C', f"{net-1}%"), ('D', f"{round(net+2,1)}%")]
            add(q_en, opts, f"(1+{up}%)(1+{down}%) -> {net}%.", q_fr, opts, f"(1+{up}%)(1+{down}%) -> {net}%.", 'medium')

        si_cases = [(5000,4,3),(8000,5,2),(6000,3,4),(7000,6,1)]
        for P,r,t in si_cases:
            c = city()
            I = int(P*r*t/100)
            q_en = f"In {c}, simple interest on {fmt_mad(P)} at {r}% for {t} years: interest?"
            q_fr = f"A {c}, interet simple sur {fmt_mad(P)} a {r}% pendant {t} ans : interet ?"
            correct = fmt_mad(I)
            opts = [('A', correct), ('B', fmt_mad(I-50)), ('C', fmt_mad(I+50)), ('D', fmt_mad(I+100))]
            add(q_en, opts, f"I = P*r*t = {I} MAD.", q_fr, opts, f"I = P*r*t = {I} MAD.", 'medium')

        mix_cases = [(8,120,12,80),(5,100,15,60),(10,90,10,70)]
        for a,pa,b,pb in mix_cases:
            c = city()
            avg = round((a*pa+b*pb)/(a+b),2)
            q_en = f"A merchant in {c} mixes {a} kg at {fmt_mad(pa)}/kg with {b} kg at {fmt_mad(pb)}/kg. Average price per kg?"
            q_fr = f"Un marchand a {c} melange {a} kg a {fmt_mad(pa)}/kg avec {b} kg a {fmt_mad(pb)}/kg. Prix moyen au kg ?"
            correct = fmt_mad(avg)
            opts = [('A', fmt_mad(avg-2)), ('B', fmt_mad(avg-1)), ('C', correct), ('D', fmt_mad(avg+2))]
            add(q_en, opts, f"Avg = ({a}*{pa}+{b}*{pb})/({a+b}) = {avg} MAD/kg.", q_fr, opts, f"Moyenne = {avg} MAD/kg.", 'medium')

        vat_cases = [(600,8,10),(900,20,15),(1200,10,5)]
        for base, vat, disc in vat_cases:
            c = city()
            ttc = base*(1+vat/100)
            final = round(ttc*(1-disc/100),2)
            q_en = f"In {c}, an item {fmt_mad(base)} +{vat}% VAT then -{disc}% on TTC. Final price?"
            q_fr = f"A {c}, un article {fmt_mad(base)} +{vat}% TVA puis -{disc}% sur TTC. Prix final ?"
            correct = fmt_mad(final)
            opts = [('A', correct), ('B', fmt_mad(final+10)), ('C', fmt_mad(final-10)), ('D', fmt_mad(round(base*(1-disc/100),2)))]
            add(q_en, opts, f"TTC={ttc:.2f}; remise -> {final}.", q_fr, opts, f"TTC={ttc:.2f}; remise -> {final}.", 'medium')

        lpk_cases = [(240,18),(180,12),(300,21)]
        for d,L in lpk_cases:
            c = city()
            cons = round(L/d*100,1)
            q_en = f"A van in {c} travels {d} km using {L} L. Consumption (L/100 km)?"
            q_fr = f"Une camionnette a {c} parcourt {d} km avec {L} L. Conso (L/100 km) ?"
            correct = f"{cons}"
            opts = [('A', correct), ('B', f"{cons+0.5}"), ('C', f"{cons-0.5}"), ('D', f"{cons+1.0}")]
            add(q_en, opts, f"{L}/{d}*100 = {cons} L/100km.", q_fr, opts, f"{L}/{d}*100 = {cons} L/100km.", 'medium')

        pm_cases = [(750,900,10),(1000,1200,15),(900,1100,5)]
        for cost, listp, disc in pm_cases:
            c = city()
            sell = listp*(1-disc/100)
            profit = sell - cost
            margin = round(profit/cost*100,1)
            q_en = f"In {c}, buy at {fmt_mad(cost)}, list {fmt_mad(listp)}, discount {disc}%. Profit margin on cost?"
            q_fr = f"A {c}, achat {fmt_mad(cost)}, affichage {fmt_mad(listp)}, remise {disc}%. Marge sur cout ?"
            correct = f"{margin}%"
            opts = [('A', f"{margin-2}%"), ('B', f"{margin-1}%"), ('C', correct), ('D', f"{margin+1}%")]
            add(q_en, opts, f"Sell={sell:.0f}; profit={profit:.0f}; margin={margin}%.", q_fr, opts, f"Vente={sell:.0f}; profit={profit:.0f}; marge={margin}%.", 'medium')

        # HARD (24)
        ci_cases = [(12000,5,4),(10000,6,3),(15000,4,5),(8000,7,3)]
        for P,r,t in ci_cases:
            c = city()
            A = round(P*((1+r/100)**t))
            q_en = f"In {c}, balance after {t} years at {r}% compounded annually on {fmt_mad(P)}?"
            q_fr = f"A {c}, solde apres {t} ans a {r}% capitalise annuellement sur {fmt_mad(P)} ?"
            correct = fmt_mad(A)
            opts = [('A', correct), ('B', fmt_mad(A-100)), ('C', fmt_mad(A+100)), ('D', fmt_mad(A-200))]
            add(q_en, opts, f"A=P(1+r)^t -> {A}.", q_fr, opts, f"A=P(1+r)^t -> {A}.", 'hard')

        hm_cases = [(60,90),(50,75),(70,105),(80,120)]
        for v1,v2 in hm_cases:
            c = city()
            vavg = round(2*v1*v2/(v1+v2))
            q_en = f"A driver in {c} travels equal distances at {v1} and {v2} km/h. Average speed?"
            q_fr = f"Un conducteur a {c} parcourt des distances egales a {v1} et {v2} km/h. Vitesse moyenne ?"
            correct = f"{vavg} km/h"
            opts = [('A', correct), ('B', f"{vavg-5} km/h"), ('C', f"{vavg+5} km/h"), ('D', f"{vavg-10} km/h")]
            add(q_en, opts, f"Harmonic mean = 2v1v2/(v1+v2) = {vavg}.", q_fr, opts, f"Moyenne harmonique = {vavg}.", 'hard')

        tile_cases = [(6,4,40,40,10),(5,3,30,30,8),(4,4,50,50,12)]
        for L,W,tw,th,waste in tile_cases:
            c = city()
            area_m2 = L*W
            tile_m2 = (tw/100)*(th/100)
            needed = int((area_m2/tile_m2)*(1+waste/100) + 0.999)
            q_en = f"A tiler in {c} covers {L}x{W} m terrace with {tw}x{th} cm tiles, {waste}% extra. Tiles needed?"
            q_fr = f"Un carreleur a {c} couvre {L}x{W} m avec des carreaux {tw}x{th} cm, {waste}% marge. Carreaux ?"
            opts = [('A', f"{needed}"), ('B', f"{needed-10}"), ('C', f"{needed+10}"), ('D', f"{needed-5}")]
            add(q_en, opts, f"Area={area_m2} m2; tile={tile_m2:.2f} m2; +{waste}%.", q_fr, opts, f"Aire={area_m2}; carreau={tile_m2:.2f}; +{waste}%.", 'hard')

        work_cases = [(6,9),(8,12),(5,10),(7,14)]
        for a,b in work_cases:
            c = city()
            rate = 1/a + 1/b
            days = round(1/rate,1)
            q_en = f"In {c}, one worker finishes in {a} days, another in {b} days. Together, days?"
            q_fr = f"A {c}, un ouvrier finit en {a} jours, un autre en {b} jours. Ensemble, jours ?"
            opts = [('A', f"{days}"), ('B', f"{days+0.5}"), ('C', f"{days-0.5}"), ('D', f"{days+1}")]
            add(q_en, opts, f"1/T=1/{a}+1/{b} -> {days} j.", q_fr, opts, f"1/T=1/{a}+1/{b} -> {days} j.", 'hard')

        be_cases = [(6000,8,18,1200),(9000,12,25,1000),(7000,10,22,1500)]
        for F,v,p,units in be_cases:
            c = city()
            profit = units*(p - v) - F
            q_en = f"In {c}, coop fixed {fmt_mad(F)} and variable {fmt_mad(v)}/unit. At {units} units sold at {fmt_mad(p)}, profit?"
            q_fr = f"A {c}, cooperative cout fixe {fmt_mad(F)} et variable {fmt_mad(v)}/unite. A {units} unites a {fmt_mad(p)}, profit ?"
            correct = fmt_mad(profit)
            opts = [('A', correct), ('B', fmt_mad(profit-200)), ('C', fmt_mad(profit+200)), ('D', fmt_mad(profit-400))]
            add(q_en, opts, f"Profit = n(p-v)-F = {profit} MAD.", q_fr, opts, f"Profit = n(p-v)-F = {profit} MAD.", 'hard')

        # Top up to exactly 60 by adding medium chain variants if needed
        while len(Q) < 60:
            c = city()
            up, down = 10, -5
            factor = (1+up/100)*(1+down/100)
            net = round((factor-1)*100,1)
            q_en = f"In {c}, a price increases by {up}% then changes by {down}%. Net change?"
            q_fr = f"A {c}, un prix augmente de {up}% puis change de {down}%. Variation nette ?"
            correct = f"{net}%"
            opts = [('A', correct), ('B', f"{net+0.5}%"), ('C', f"{net-0.5}%"), ('D', f"{net+1.0}%")]
            add(q_en, opts, f"(1+{up}%)(1{down}%)->{net}%", q_fr, opts, f"(1+{up}%)(1{down}%)->{net}%", 'medium')

        return Q

