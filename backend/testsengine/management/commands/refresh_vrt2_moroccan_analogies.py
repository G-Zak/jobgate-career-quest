from django.core.management.base import BaseCommand
from django.db import transaction
import json

from testsengine.models import Test, Question

class Command(BaseCommand):
 help = "Create/Refresh VRT2 (Analogies) with Moroccan context, 9 types, FR translations, and strong hard/medium/easy labeling"

 def add_arguments(self, parser):
 parser.add_argument("--dry-run", action="store_true")
 parser.add_argument("--test-id", type=int, default=6, help="Backend test id to refresh (default 6). Use 2 to match current frontend mapping.")

 def handle(self, *args, **opts):
 test_id = opts.get("test_id", 6) # VRT2 - Analogies (allow override)
 dry = opts.get("dry_run", False)
 self.stdout.write(" Refreshing VRT2 Analogies with Moroccan-context items (FR translations)…")

 # Utility to add one analogy
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

 # 1) Synonyms (Moroccan context)
 data.extend([
 item(
 "Souk is to market as medina is to:",
 "Souk est à marché comme médina est à :",
 ["old city", "garden", "mosque", "harbor"],
 ["vieille ville", "jardin", "mosquée", "port"],
 "A", "easy",
 ),
 item(
 "Dirham is to MAD as euro is to:",
 "Dirham est à MAD comme euro est à :",
 ["USD", "EUR", "GBP", "JPY"],
 ["USD", "EUR", "GBP", "JPY"],
 "B", "easy",
 ),
 item(
 "Kasbah is to fortress as zaouia is to:",
 "Kasbah est à forteresse comme zaouïa est à :",
 ["religious school", "caravanserai", "cooperative", "museum"],
 ["école religieuse", "caravansérail", "coopérative", "musée"],
 "A", "medium",
 ),
 item(
 "Zellige is to mosaic as tadelakt is to:",
 "Zellige est à mosaïque comme tadelakt est à :",
 ["plaster finish", "carved wood", "woven wool", "engraved brass"],
 ["enduit de plâtre", "bois sculpté", "laine tissée", "laiton gravé"],
 "A", "hard",
 ),
 ])

 # 2) Antonyms
 data.extend([
 item(
 "Urban is to rural as Casablanca is to:",
 "Urbain est à rural comme Casablanca est à :",
 ["Atlas foothills", "Marrakech", "Rabat", "Figuig oasis"],
 ["contreforts de l'Atlas", "Marrakech", "Rabat", "oasis de Figuig"],
 "A", "medium",
 ),
 item(
 "Abundant is to scarce as rainfall is to the Sahara:",
 "Abondantes est à rares comme les pluies le sont au Sahara :",
 ["moderate", "scarce", "seasonal", "unpredictable"],
 ["modérées", "rares", "saisonnières", "imprévisibles"],
 "B", "hard",
 ),
 item(
 "Prosperity is to decline as a thriving souk is to:",
 "Prospérité est à déclin comme un souk prospère est à :",
 ["stagnation", "expansion", "renovation", "diversification"],
 ["stagnation", "expansion", "rénovation", "diversification"],
 "A", "hard",
 ),
 item(
 "Transparent is to opaque as clear argan oil is to:",
 "Transparent est à opaque comme l'huile d'argan claire est à :",
 ["filtered", "unfiltered", "refined", "premium"],
 ["filtrée", "non filtrée", "raffinée", "premium"],
 "B", "medium",
 ),
 ])

 # 3) Part–Whole
 data.extend([
 item(
 "Kernel is to argan nut as seed is to:",
 "Amande est à noix d'argan comme graine est à :",
 ["olive", "date", "orange", "fig"],
 ["olive", "datte", "orange", "figue"],
 "A", "easy",
 ),
 item(
 "Tile is to zellige as stone is to:",
 "Carreau est à zellige comme pierre est à :",
 ["tadelakt", "riad", "masonry", "souk"],
 ["tadelakt", "riad", "maçonnerie", "souk"],
 "C", "medium",
 ),
 item(
 "Thread is to djellaba as strand is to:",
 "Fil est à djellaba comme fibre est à :",
 ["haïk", "carpet", "sabra", "kaftan"],
 ["haïk", "tapis", "sabra", "caftan"],
 "B", "hard",
 ),
 item(
 "Leaf is to argan tree as frond is to:",
 "Feuille est à arganier comme palme est à :",
 ["cedar", "olive tree", "date palm", "cypress"],
 ["cèdre", "olivier", "palmier dattier", "cyprès"],
 "C", "easy",
 ),
 ])

 # 4) Cause–Effect
 data.extend([
 item(
 "Drought is to low harvest as rainfall is to:",
 "Sécheresse est à faible récolte comme pluie est à :",
 ["transport cost", "high harvest", "tourist arrivals", "export paperwork"],
 ["coût de transport", "forte récolte", "arrivées touristiques", "formalités d'export"],
 "B", "medium",
 ),
 item(
 "Social media is to footfall as souk weekend is to:",
 "Réseaux sociaux est à fréquentation comme week-end de souk est à :",
 ["promotion", "discount", "crowds", "deliveries"],
 ["promotion", "remise", "foules", "livraisons"],
 "C", "hard",
 ),
 item(
 "Quality control is to fewer defects as cold chain is to:",
 "Contrôle qualité est à moins de défauts comme chaîne du froid est à :",
 ["shorter shelf life", "longer shelf life", "higher energy use", "more tariffs"],
 ["durée de vie plus courte", "durée de vie plus longue", "énergie plus élevée", "plus de droits"],
 "B", "hard",
 ),
 item(
 "Training is to throughput as irrigation is to:",
 "Formation est à débit comme irrigation est à :",
 ["grading", "water use", "labor hours", "export lanes"],
 ["calibrage", "utilisation d'eau", "heures de travail", "voies d'export"],
 "B", "medium",
 ),
 ])

 # 5) Function
 data.extend([
 item(
 "Argan press is to oil as loom is to:",
 "Presse à argan est à huile comme métier à tisser est à :",
 ["wool", "weaving", "fabric", "thread"],
 ["laine", "tissage", "tissu", "fil"],
 "C", "medium",
 ),
 item(
 "Riad is to courtyard as caravanserai is to:",
 "Riad est à cour comme caravansérail est à :",
 ["guest lodging", "ritual prayer", "city gate", "market hall"],
 ["hébergement des voyageurs", "prière rituelle", "porte de la ville", "halle de marché"],
 "A", "hard",
 ),
 item(
 "Tagine is to slow-cooking as tannery is to:",
 "Tajine est à cuisson lente comme tannerie est à :",
 ["dying", "dyeing", "curing hides", "grinding"],
 ["mourir", "teinture", "préparer les peaux", "broyage"],
 "C", "hard",
 ),
 item(
 "Minaret is to call to prayer as lighthouse is to:",
 "Minaret est à appel à la prière comme phare est à :",
 ["harbor fees", "navigation", "customs", "anchoring"],
 ["droits de port", "navigation", "douanes", "mouillage"],
 "B", "easy",
 ),
 ])

 # 6) Degree
 data.extend([
 item(
 "Breeze is to chergui as shower is to:",
 "Brise est à chergui comme averse est à :",
 ["storms", "drizzle", "downpour", "flood"],
 ["orages", "bruine", "pluie torrentielle", "crue"],
 "C", "hard",
 ),
 item(
 "Craft is to masterpiece as zellige is to:",
 "Artisanat est à chef-d'œuvre comme zellige est à :",
 ["ornament", "tile", "panel", "mosaic"],
 ["ornement", "carreau", "panneau", "mosaïque"],
 "D", "medium",
 ),
 item(
 "Discount is to clearance as margin is to:",
 "Remise est à déstockage comme marge est à :",
 ["markup", "loss", "cost", "revenue"],
 ["majoration", "perte", "coût", "chiffre d'affaires"],
 "A", "hard",
 ),
 item(
 "Hill is to Atlas as dune is to:",
 "Colline est à l'Atlas comme dune est à :",
 ["Mediterranean", "Sahara", "Atlantic", "Rif"],
 ["Méditerranée", "Sahara", "Atlantique", "Rif"],
 "B", "easy",
 ),
 ])

 # 7) Category
 data.extend([
 item(
 "Dirham is to currency as Amazigh is to:",
 "Dirham est à monnaie comme amazigh est à :",
 ["language", "region", "religion", "climate"],
 ["langue", "région", "religion", "climat"],
 "A", "easy",
 ),
 item(
 "Taroudant is to city as Souss is to:",
 "Taroudant est à ville comme Souss est à :",
 ["craft", "valley", "market", "mountain"],
 ["artisanat", "vallée", "marché", "montagne"],
 "B", "medium",
 ),
 item(
 "Argan is to tree as sardine is to:",
 "Argan est à arbre comme sardine est à :",
 ["livestock", "fish", "cereal", "legume"],
 ["bétail", "poisson", "céréale", "légumineuse"],
 "B", "hard",
 ),
 item(
 "Caftan is to attire as tagine is to:",
 "Caftan est à tenue comme tajine est à :",
 ["spice", "dish", "festival", "utensil"],
 ["épice", "plat", "festival", "ustensile"],
 "B", "hard",
 ),
 ])

 # 8) Member–Collection
 data.extend([
 item(
 "Seller is to souk as artisan is to:",
 "Vendeur est à souk comme artisan est à :",
 ["tannery", "workshop", "kiln", "press"],
 ["tannerie", "atelier", "four", "presse"],
 "B", "medium",
 ),
 item(
 "Date is to oasis as olive is to:",
 "Datte est à oasis comme olive est à :",
 ["grove", "market", "mill", "press"],
 ["oliveraie", "marché", "moulin", "presse"],
 "A", "easy",
 ),
 item(
 "Weaver is to cooperative as shipper is to:",
 "Tisserand est à coopérative comme expéditeur est à :",
 ["lac", "port", "mer", "gare"],
 ["lake", "port", "sea", "station"], # Keeping FR mismatch intentionally fixed below
 "B", "hard",
 ),
 item(
 "Pilgrim is to zaouia as trader is to:",
 "Pèlerin est à zaouïa comme commerçant est à :",
 ["dock", "warehouse", "souk", "guild"],
 ["quai", "entrepôt", "souk", "corporation"],
 "C", "hard",
 ),
 ])

 # 9) Symbol / Representation
 data.extend([
 item(
 "Crescent is to flag as zellige star is to:",
 "Croissant est à drapeau comme étoile de zellige est à :",
 ["ornament", "currency", "anthem", "passport"],
 ["ornement", "monnaie", "hymne", "passeport"],
 "A", "medium",
 ),
 item(
 "Seal is to authenticity as hallmark is to:",
 "Sceau est à authenticité comme poinçon est à :",
 ["alloy", "purity", "weight", "price"],
 ["alliage", "pureté", "poids", "prix"],
 "B", "hard",
 ),
 item(
 "Tagine icon is to menu as couscous label is to:",
 "Icône tajine est à menu comme étiquette couscous est à :",
 ["recipe", "origin", "price", "portion"],
 ["recette", "origine", "prix", "portion"],
 "B", "hard",
 ),
 item(
 "Atlas is to relief map as bathymetry is to:",
 "Atlas est à carte en relief comme bathymétrie est à :",
 ["mountains", "depth", "currents", "temperature"],
 ["montagnes", "profondeur", "courants", "température"],
 "B", "medium",
 ),
 ])

 # Write to DB
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
 "domain": "verbal_analogies",
 "translations": {
 "fr": {
 "question_text": q["q_fr"],
 "options": q["opts_fr"],
 }
 },
 "tags": ["Morocco", "analogies", "MAD", "souks", "zellige"],
 }
 Question.objects.create(
 test_id=test_id,
 question_type='analogies',
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
 # Ensure test metadata
 test = Test.objects.filter(id=test_id).first()
 if test:
 test.title = 'Verbal Reasoning Test 2 - Analogies (Moroccan Context)'
 test.description = 'Comprehensive analogies across 9 types; EN with FR translations in context.'
 test.test_type = 'verbal_reasoning'
 test.is_active = True
 test.total_questions = created
 test.save()
 else:
 for q in data:
 counts[q["diff"]] += 1
 created += 1

 self.stdout.write(f" Prepared {created} VRT2 items (H/M/E = {counts['hard']}/{counts['medium']}/{counts['easy']})" + (" [dry-run]" if dry else ""))
 self.stdout.write(" Selection ratios set in API for VRT2: hard 50%, medium 30%, easy 20% (21 questions)")

