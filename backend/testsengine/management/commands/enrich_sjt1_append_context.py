from django.core.management.base import BaseCommand
from django.db import transaction
import json

from testsengine.models import Question

class Command(BaseCommand):
 help = "Append a longer contextual paragraph to existing SJT1 scenarios (EN/FR) without altering scoring or options"

 def add_arguments(self, parser):
 parser.add_argument("--test-id", type=int, default=30, help="Backend test id to update (default 30)")
 parser.add_argument("--dry-run", action="store_true", help="Preview changes without saving")
 parser.add_argument("--only-if-short", action="store_true", help="Only append when scenario length < 240 chars")

 def handle(self, *args, **opts):
 test_id = opts.get("test_id", 30)
 dry = opts.get("dry_run", False)
 only_if_short = opts.get("only_if_short", False)

 extra_en = (
 "\n\nDetailed context: This situation involves multiple stakeholders including Fatima (QA Lead), Hassan (Team Lead), Omar (Client Relations), and Khadija (Security Officer). "
 "The project has a budget of 180,000 MAD remaining with strict contractual penalties for delays exceeding 48 hours. "
 "Previous similar incidents resulted in client escalations and team morale issues. The current workload includes three parallel deliverables, "
 "and the team is already working extended hours. Communication protocols require bilingual updates (French/English) to all parties within 2 hours of any critical decision. "
 "The client's technical team in Rabat expects detailed risk assessments and mitigation plans for any changes to the original scope. "
 "Your decision will impact not only this project but also future contract renewals worth approximately 2.5M MAD annually. "
 "Consider the technical complexity, resource constraints, stakeholder expectations, regulatory compliance requirements, and long-term business relationships. "
 "The company's reputation for reliability and transparency is at stake, and your response will be documented and reviewed by senior management."
 )
 extra_fr = (
 "\n\nContexte détaillé : Cette situation implique plusieurs parties prenantes dont Fatima (Responsable QA), Hassan (Chef d'équipe), Omar (Relations Client), et Khadija (Responsable Sécurité). "
 "Le projet dispose d'un budget restant de 180 000 MAD avec des pénalités contractuelles strictes pour les retards dépassant 48 heures. "
 "Des incidents similaires précédents ont entraîné des escalades client et des problèmes de moral d'équipe. La charge de travail actuelle comprend trois livrables en parallèle, "
 "et l'équipe travaille déjà en heures supplémentaires. Les protocoles de communication exigent des mises à jour bilingues (français/anglais) à toutes les parties dans les 2 heures suivant toute décision critique. "
 "L'équipe technique du client à Rabat attend des évaluations détaillées des risques et des plans d'atténuation pour tout changement au périmètre original. "
 "Votre décision impactera non seulement ce projet mais aussi les renouvellements de contrats futurs d'une valeur d'environ 2,5M MAD annuellement. "
 "Considérez la complexité technique, les contraintes de ressources, les attentes des parties prenantes, les exigences de conformité réglementaire, et les relations commerciales à long terme. "
 "La réputation de l'entreprise en matière de fiabilité et de transparence est en jeu, et votre réponse sera documentée et examinée par la direction générale."
 )

 qs = Question.objects.filter(test_id=test_id, question_type='situational_judgment').order_by('order')
 if not qs.exists():
 self.stdout.write(self.style.WARNING(f"No SJT questions found for test_id={test_id}"))
 return

 updated = 0
 with transaction.atomic():
 for q in qs:
 ctx = {}
 if q.context:
 try:
 ctx = json.loads(q.context)
 except Exception:
 ctx = {}

 scenario = ctx.get("scenario")
 en, fr = None, None
 if isinstance(scenario, dict):
 en = scenario.get("en")
 fr = scenario.get("fr")
 elif isinstance(scenario, str):
 # Legacy: plain string, treat as EN
 en = scenario
 ctx["scenario"] = {"en": en, "fr": None}

 # Skip if nothing to extend
 if not en:
 continue

 # Only append if short, when flag is set
 if only_if_short and len(en) >= 240:
 continue

 # Avoid double-appending (idempotency): check a marker substring
 if "Additional context:" in en or "Contexte supplémentaire" in (fr or ""):
 continue

 new_en = en + extra_en
 new_fr = (fr or en) + extra_fr # if FR missing, copy EN before appending FR extra

 ctx["scenario"]["en"] = new_en
 ctx["scenario"]["fr"] = new_fr

 if not dry:
 q.context = json.dumps(ctx)
 q.save(update_fields=["context"])
 updated += 1

 if dry:
 self.stdout.write(f"[DRY RUN] Would enrich {updated} SJT questions for test_id={test_id}")
 else:
 self.stdout.write(self.style.SUCCESS(f"Enriched {updated} SJT questions with additional context (EN/FR)"))

