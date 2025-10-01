from django.core.management.base import BaseCommand
from django.db import transaction
import json

from testsengine.models import Test, Question

class Command(BaseCommand):
 help = "Expand/Refresh VRT1 with longer Moroccan-context passages and 60/20/20 difficulty mix (H/M/E)"

 def add_arguments(self, parser):
 parser.add_argument("--dry-run", action="store_true")

 def handle(self, *args, **opts):
 test_id = 1
 dry = opts.get("dry_run", False)
 self.stdout.write(" Expanding VRT1 with longer Moroccan passages; targeting 60% hard / 20% medium / 20% easy …")

 # Ten longer passages, each with 3 questions
 # Keep passages concise but richer than before; include MAD and metric
 data = []

 def add_passage(en, fr, qs):
 data.append({"passage_en": en, "passage_fr": fr, "questions": qs})

 add_passage(
 (
 "In Casablanca's Habous district, Fatima runs a specialty shop selling extra-virgin argan oil "
 "sourced from women's cooperatives near Agadir and Taroudant. Wholesale cost averages 250 MAD/L, "
 "and she targets a 22% margin. A Ramadan bundle (2×500 ml) gets a 10% promo discount; social posts "
 "and the weekend souk lifted monthly footfall by 18%, raising revenue despite discounts."
 ),
 (
 "Dans le quartier des Habous à Casablanca, Fatima tient une boutique spécialisée vendant de l'huile "
 "d'argan extra-vierge provenant de coopératives féminines près d'Agadir et de Taroudant. Le coût "
 "de gros moyen est de 250 MAD/L, et elle vise une marge de 22 %. Un pack Ramadan (2×500 ml) "
 "bénéficie d'une remise de 10 % ; les publications et le souk du week-end ont augmenté la "
 "fréquentation mensuelle de 18 %, faisant croître le chiffre d'affaires malgré les remises."
 ),
 [
 {
 "q_en": "What wholesale cost is cited for argan oil?",
 "q_fr": "Quel coût de gros est mentionné pour l'huile d'argan ?",
 "opts_en": ["200 MAD/L", "250 MAD/L", "280 MAD/L", "300 MAD/L"],
 "opts_fr": ["200 MAD/L", "250 MAD/L", "280 MAD/L", "300 MAD/L"],
 "ans": "B", "diff": "easy",
 },
 {
 "q_en": "What was the footfall change mentioned?",
 "q_fr": "Quel changement de fréquentation est mentionné ?",
 "opts_en": ["−10%", "+10%", "+18%", "+25%"],
 "opts_fr": ["−10 %", "+10 %", "+18 %", "+25 %"],
 "ans": "C", "diff": "medium",
 },
 {
 "q_en": "Which regions supply Fatima's shop?",
 "q_fr": "Quelles régions approvisionnent la boutique de Fatima ?",
 "opts_en": ["Rabat & Fès", "Agadir & Taroudant", "Tanger & Oujda", "Laâyoune & Dakhla"],
 "opts_fr": ["Rabat & Fès", "Agadir & Taroudant", "Tanger & Oujda", "Laâyoune & Dakhla"],
 "ans": "B", "diff": "easy",
 },
 ],
 )

 add_passage(
 (
 "Omar operates a Rabat cold-chain service delivering produce from a farm 120 km away. By redesigning "
 "routes and keeping trucks below 80 km/h, fuel use fell 12% while deliveries stayed under 2 hours. "
 "Farmers earn 8 MAD/kg for tomatoes; logistics are billed 2 MAD/kg. Supermarkets renewed annual "
 "contracts after consistent on-time rates during peak tourism months."
 ),
 (
 "Omar exploite un service de chaîne du froid à Rabat livrant des produits depuis une ferme à 120 km. "
 "En repensant les itinéraires et en limitant les camions à 80 km/h, la consommation a baissé de 12 % "
 "tout en gardant les livraisons sous 2 heures. Les agriculteurs gagnent 8 MAD/kg pour les tomates ; "
 "la logistique est facturée 2 MAD/kg. Les supermarchés ont renouvelé les contrats annuels grâce à la "
 "ponctualité lors des pics touristiques."
 ),
 [
 {"q_en": "How far is the farm?", "q_fr": "À quelle distance est la ferme ?",
 "opts_en": ["60 km", "90 km", "120 km", "200 km"],
 "opts_fr": ["60 km", "90 km", "120 km", "200 km"], "ans": "C", "diff": "easy"},
 {"q_en": "What reduced fuel use?", "q_fr": "Qu'est-ce qui a réduit la consommation ?",
 "opts_en": ["Heavier trucks", "Higher speeds", "Route redesign & <80 km/h", "Night-only driving"],
 "opts_fr": ["Camions plus lourds", "Vitesses plus élevées", "Itinéraires repensés & <80 km/h", "Conduite nocturne seulement"],
 "ans": "C", "diff": "medium"},
 {"q_en": "How are logistics billed?", "q_fr": "Comment la logistique est-elle facturée ?",
 "opts_en": ["Per liter", "Per kilogram", "Per crate", "Per km"],
 "opts_fr": ["Par litre", "Par kilogramme", "Par caisse", "Par km"], "ans": "B", "diff": "easy"},
 ],
 )

 add_passage(
 (
 "Imane leads a women's cooperative near Essaouira producing artisanal couscous. To reach export grade, "
 "they standardized 1 kg packs and added QR codes showing origin and harvest dates. A Marrakech "
 "distributor pays 18 MAD/kg with a seasonal bonus above 5,000 kg. Training improved throughput and "
 "reduced defects by 15% quarter-over-quarter."
 ),
 (
 "Imane dirige une coopérative féminine près d'Essaouira produisant du couscous artisanal. Pour l'export, "
 "elles ont standardisé des sachets de 1 kg et ajouté des QR codes indiquant l'origine et les dates de "
 "récolte. Un distributeur à Marrakech paie 18 MAD/kg avec une prime au-delà de 5 000 kg. La formation "
 "a augmenté le débit et réduit les défauts de 15 % d'un trimestre à l'autre."
 ),
 [
 {"q_en": "What is the pack size?", "q_fr": "Quelle est la taille du sachet ?",
 "opts_en": ["500 g", "1 kg", "2 kg", "5 kg"],
 "opts_fr": ["500 g", "1 kg", "2 kg", "5 kg"], "ans": "B", "diff": "easy"},
 {"q_en": "Who pays 18 MAD/kg?", "q_fr": "Qui paie 18 MAD/kg ?",
 "opts_en": ["Rabat hotel", "Marrakech distributor", "Agadir factory", "Fès retailer"],
 "opts_fr": ["Hôtel de Rabat", "Distributeur de Marrakech", "Usine d'Agadir", "Détaillant de Fès"],
 "ans": "B", "diff": "medium"},
 {"q_en": "Defects changed by?", "q_fr": "Les défauts ont changé de ?",
 "opts_en": ["−5%", "−10%", "−15%", "−20%"],
 "opts_fr": ["−5 %", "−10 %", "−15 %", "−20 %"], "ans": "C", "diff": "hard"},
 ],
 )

 add_passage(
 (
 "Hassan manages a Chefchaouen guesthouse. Low-flow showers cut water from 12 L/min to 8 L/min. "
 "Solar panels now supply 40% of monthly electricity; occupancy improved after partnering with a tour "
 "operator, and the property won a local sustainability award."
 ),
 (
 "Hassan gère une maison d'hôtes à Chefchaouen. Des douches à faible débit ont réduit l'eau de 12 L/min "
 "à 8 L/min. Des panneaux solaires fournissent 40 % de l'électricité mensuelle ; l'occupation s'est "
 "améliorée après un partenariat avec un tour-opérateur, et l'établissement a reçu un prix local."
 ),
 [
 {"q_en": "New water flow?", "q_fr": "Nouveau débit d'eau ?",
 "opts_en": ["6 L/min", "8 L/min", "10 L/min", "12 L/min"],
 "opts_fr": ["6 L/min", "8 L/min", "10 L/min", "12 L/min"], "ans": "B", "diff": "easy"},
 {"q_en": "Solar share is?", "q_fr": "Part solaire ?",
 "opts_en": ["20%", "30%", "40%", "50%"],
 "opts_fr": ["20 %", "30 %", "40 %", "50 %"], "ans": "C", "diff": "medium"},
 {"q_en": "Which award?", "q_fr": "Quel prix ?",
 "opts_en": ["National tourism", "Local sustainability", "Innovation", "No award"],
 "opts_fr": ["Tourisme national", "Durabilité locale", "Innovation", "Aucun"], "ans": "B", "diff": "hard"},
 ],
 )

 # Additional 6 passages (focus on harder questions)
 add_passage(
 (
 "At the Tangier Med port, a cooperative exports preserved lemons. A 20-foot reefer container holds "
 "24,000 jars (350 g each). Electricity during pre-cooling adds 0.35 MAD/jar; logistics and tariffs add "
 "another 1.15 MAD/jar. A new contract requires a 5% cost reduction without changing the recipe."
 ),
 (
 "Au port Tanger Med, une coopérative exporte des citrons confits. Un conteneur frigorifique de 20 pieds "
 "contient 24 000 bocaux (350 g chacun). L'électricité du pré-refroidissement ajoute 0,35 MAD/bocal ; "
 "la logistique et les droits ajoutent 1,15 MAD/bocal. Un nouveau contrat exige 5 % de réduction des coûts "
 "sans changer la recette."
 ),
 [
 {"q_en": "Jar mass each?", "q_fr": "Masse par bocal ?",
 "opts_en": ["250 g", "300 g", "350 g", "500 g"],
 "opts_fr": ["250 g", "300 g", "350 g", "500 g"], "ans": "C", "diff": "hard"},
 {"q_en": "Added cost/jar?", "q_fr": "Coût ajouté/bocal ?",
 "opts_en": ["0.35 MAD", "1.15 MAD", "1.50 MAD", "1.70 MAD"],
 "opts_fr": ["0,35 MAD", "1,15 MAD", "1,50 MAD", "1,70 MAD"], "ans": "D", "diff": "hard"},
 {"q_en": "Container capacity?", "q_fr": "Capacité du conteneur ?",
 "opts_en": ["12,000", "24,000", "36,000", "48,000"],
 "opts_fr": ["12 000", "24 000", "36 000", "48 000"], "ans": "B", "diff": "hard"},
 ],
 )

 add_passage(
 (
 "A Fès pottery workshop exports tagine sets. A kiln cycle takes 9 hours, firing 120 sets; glazing adds "
 "3 hours per batch. Energy costs rose 14% QoQ; to maintain margins, the workshop raised export price by "
 "8% and cut defect rate from 9% to 6% through better QC."
 ),
 (
 "Un atelier de poterie à Fès exporte des tajines. Un cycle de four dure 9 heures pour 120 ensembles ; "
 "l'émaillage ajoute 3 heures par lot. Les coûts énergétiques ont augmenté de 14 % T/T ; pour garder la "
 "marge, l'atelier a augmenté le prix d'exportation de 8 % et réduit le taux de défauts de 9 % à 6 % grâce au CQ."
 ),
 [
 {"q_en": "Defect rate now?", "q_fr": "Taux de défaut actuel ?",
 "opts_en": ["3%", "6%", "9%", "12%"],
 "opts_fr": ["3 %", "6 %", "9 %", "12 %"], "ans": "B", "diff": "hard"},
 {"q_en": "Kiln sets per cycle?", "q_fr": "Ensembles par cycle ?",
 "opts_en": ["60", "90", "120", "150"],
 "opts_fr": ["60", "90", "120", "150"], "ans": "C", "diff": "hard"},
 {"q_en": "Price was raised by?", "q_fr": "La hausse de prix ?",
 "opts_en": ["4%", "6%", "8%", "10%"],
 "opts_fr": ["4 %", "6 %", "8 %", "10 %"], "ans": "C", "diff": "hard"},
 ],
 )

 add_passage(
 (
 "An Agadir fishery upgraded its cold chain. Ice production capacity rose from 3 to 4.5 tons/day; "
 "evaporators reduced waste by 11%. Export buyers require fillets in 1.2 kg packs priced at 72 MAD/kg, "
 "with a quality bonus if weekly claims fall below 1%."
 ),
 (
 "Une pêcherie d'Agadir a modernisé sa chaîne du froid. La capacité de glace est passée de 3 à 4,5 t/j ; "
 "les évaporateurs ont réduit les pertes de 11 %. Les acheteurs exigent des filets en sachets de 1,2 kg "
 "au prix de 72 MAD/kg, avec une prime de qualité si les réclamations hebdomadaires passent sous 1 %."
 ),
 [
 {"q_en": "New ice capacity?", "q_fr": "Nouvelle capacité de glace ?",
 "opts_en": ["3.0 t/day", "3.5 t/day", "4.5 t/day", "5.0 t/day"],
 "opts_fr": ["3,0 t/j", "3,5 t/j", "4,5 t/j", "5,0 t/j"], "ans": "C", "diff": "hard"},
 {"q_en": "Pack weight?", "q_fr": "Poids du sachet ?",
 "opts_en": ["800 g", "1.0 kg", "1.2 kg", "1.5 kg"],
 "opts_fr": ["800 g", "1,0 kg", "1,2 kg", "1,5 kg"], "ans": "C", "diff": "hard"},
 {"q_en": "Price/kg is?", "q_fr": "Prix/kg ?",
 "opts_en": ["52 MAD", "62 MAD", "72 MAD", "82 MAD"],
 "opts_fr": ["52 MAD", "62 MAD", "72 MAD", "82 MAD"], "ans": "C", "diff": "hard"},
 ],
 )

 add_passage(
 (
 "In Marrakech, a textile cluster standardized organic cotton T-shirts. Cutting waste fell from 7% to 4%. "
 "A retailer pays 58 MAD/unit FOB; to offset a 9% dye cost increase, the cluster introduced lean changes "
 "that lifted hourly output by 12%."
 ),
 (
 "À Marrakech, un cluster textile a standardisé des T-shirts en coton bio. Le rebut de coupe est passé de 7 % à 4 %. "
 "Un détaillant paie 58 MAD/unité FOB ; pour compenser +9 % de teinture, le cluster a introduit du lean qui a "
 "augmenté le débit horaire de 12 %."
 ),
 [
 {"q_en": "Cutting waste now?", "q_fr": "Rebut de coupe actuel ?",
 "opts_en": ["3%", "4%", "5%", "7%"],
 "opts_fr": ["3 %", "4 %", "5 %", "7 %"], "ans": "B", "diff": "hard"},
 {"q_en": "Retailer price/unit?", "q_fr": "Prix détaillant/unité ?",
 "opts_en": ["48 MAD", "58 MAD", "68 MAD", "78 MAD"],
 "opts_fr": ["48 MAD", "58 MAD", "68 MAD", "78 MAD"], "ans": "B", "diff": "hard"},
 {"q_en": "Output change?", "q_fr": "Changement de débit ?",
 "opts_en": ["−9%", "+5%", "+9%", "+12%"],
 "opts_fr": ["−9 %", "+5 %", "+9 %", "+12 %"], "ans": "D", "diff": "hard"},
 ],
 )

 add_passage(
 (
 "Ouarzazate's Noor complex inspired a local SME to install solar at a date-processing plant. Grid draw "
 "fell 36% while throughput rose 8% after line balancing. A new vacuum sealer extended shelf life from "
 "6 to 9 months, unlocking export lanes with tighter QA."
 ),
 (
 "Le complexe Noor d'Ouarzazate a inspiré une PME à installer du solaire dans une usine de dattes. La "
 "consommation réseau a baissé de 36 % tandis que le débit a augmenté de 8 % après l'équilibrage des lignes. "
 "Un nouveau scelleur sous vide a prolongé la durée de conservation de 6 à 9 mois, ouvrant des débouchés export."
 ),
 [
 {"q_en": "Shelf life now?", "q_fr": "Durée de conservation maintenant ?",
 "opts_en": ["5 months", "6 months", "9 months", "12 months"],
 "opts_fr": ["5 mois", "6 mois", "9 mois", "12 mois"], "ans": "C", "diff": "hard"},
 {"q_en": "Grid draw change?", "q_fr": "Changement d'énergie réseau ?",
 "opts_en": ["−18%", "−24%", "−36%", "−40%"],
 "opts_fr": ["−18 %", "−24 %", "−36 %", "−40 %"], "ans": "C", "diff": "hard"},
 {"q_en": "Throughput rose by?", "q_fr": "Débit a augmenté de ?",
 "opts_en": ["4%", "6%", "8%", "10%"],
 "opts_fr": ["4 %", "6 %", "8 %", "10 %"], "ans": "C", "diff": "medium"},
 ],
 )

 add_passage(
 (
 "In Meknès, an orchard cooperative adopted drip irrigation. Water use per hectare dropped 28% while apple "
 "grades improved, lifting average price from 3.8 to 4.4 MAD/kg. A new cold-room increased storage capacity "
 "by 35%, smoothing seasonal cash flow."
 ),
 (
 "À Meknès, une coopérative fruitière a adopté le goutte-à-goutte. L'eau par hectare a baissé de 28 % tandis que "
 "les calibres se sont améliorés, faisant passer le prix moyen de 3,8 à 4,4 MAD/kg. Une nouvelle chambre froide "
 "a augmenté la capacité de stockage de 35 %, lissant la trésorerie saisonnière."
 ),
 [
 {"q_en": "Price moved to?", "q_fr": "Prix passé à ?",
 "opts_en": ["3.6 MAD/kg", "4.0 MAD/kg", "4.4 MAD/kg", "4.8 MAD/kg"],
 "opts_fr": ["3,6 MAD/kg", "4,0 MAD/kg", "4,4 MAD/kg", "4,8 MAD/kg"], "ans": "C", "diff": "hard"},
 {"q_en": "Storage capacity change?", "q_fr": "Changement de capacité ?",
 "opts_en": ["+15%", "+25%", "+35%", "+45%"],
 "opts_fr": ["+15 %", "+25 %", "+35 %", "+45 %"], "ans": "C", "diff": "hard"},
 {"q_en": "Water use per hectare?", "q_fr": "Utilisation d'eau/ha ?",
 "opts_en": ["−18%", "−28%", "−32%", "−38%"],
 "opts_fr": ["−18 %", "−28 %", "−32 %", "−38 %"], "ans": "B", "diff": "medium"},
 ],
 )

 # Calculate desired totals: for 10 passages => 30 items: H18, M6, E6
 desired = {"hard": 18, "medium": 6, "easy": 6}
 counts = {"hard": 0, "medium": 0, "easy": 0}

 # Build DB writes
 created = 0
 if not dry:
 with transaction.atomic():
 Question.objects.filter(test_id=test_id).delete()
 order = 0
 for p in data:
 for q in p["questions"]:
 order += 1
 diff = q["diff"]
 counts[diff] = counts.get(diff, 0) + 1
 ctx = {
 "locale": "MA",
 "domain": "verbal_reading",
 "translations": {"fr": {
 "passage_text": p["passage_fr"],
 "question_text": q["q_fr"],
 "options": q["opts_fr"],
 }},
 "tags": ["Morocco", "MAD", "metric"],
 }
 Question.objects.create(
 test_id=test_id,
 question_type="reading_comprehension",
 question_text=q["q_en"],
 passage=p["passage_en"],
 options=q["opts_en"],
 correct_answer=q["ans"],
 difficulty_level=diff,
 order=order,
 explanation=None,
 context=json.dumps(ctx),
 )
 created += 1
 test = Test.objects.filter(id=test_id).first()
 if test:
 test.title = "Verbal Reasoning Test 1 - Reading Comprehension"
 test.description = "Reading comprehension (Moroccan context, EN/FR)."
 test.duration_minutes = test.duration_minutes or 20
 test.test_type = "verbal_reasoning"
 test.is_active = True
 test.total_questions = created
 test.save()
 else:
 # Simulate counting
 for p in data:
 for q in p["questions"]:
 counts[q["diff"]] = counts.get(q["diff"], 0) + 1
 created += 1

 self.stdout.write(f" Prepared {created} VRT1 items (H/M/E = {counts['hard']}/{counts['medium']}/{counts['easy']})" + (" [dry-run]" if dry else ""))
 if not dry:
 # Warn if mix deviates notably
 def pct(n):
 return int(round(100.0 * n / max(1, created)))
 self.stdout.write(f" Mix => hard {pct(counts['hard'])}%, medium {pct(counts['medium'])}%, easy {pct(counts['easy'])}% (target 60/20/20)")
 self.stdout.write("ℹ️ FR stored under context.translations.fr; answers are A–D letters for scoring")

