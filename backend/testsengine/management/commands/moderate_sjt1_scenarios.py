from django.core.management.base import BaseCommand
from django.db import transaction
import json

from testsengine.models import Question, Test


class Command(BaseCommand):
    help = "Make SJT1 scenarios moderately longer (half the previous length) and update test to 15 questions in 30 minutes"

    def add_arguments(self, parser):
        parser.add_argument("--test-id", type=int, default=30, help="Backend test id to update (default 30)")
        parser.add_argument("--dry-run", action="store_true", help="Preview changes without saving")

    def handle(self, *args, **opts):
        test_id = opts.get("test_id", 30)
        dry = opts.get("dry_run", False)

        # Moderate context - half the length of the super detailed version
        moderate_context_en = (
            "\n\nSituational context: This involves key stakeholders including Fatima (QA Lead), Hassan (Team Lead), and Omar (Client Relations). "
            "The project has a remaining budget of 180,000 MAD with contractual penalties of 15,000 MAD for delays exceeding 24 hours. "
            "The team is currently managing multiple deliverables while working extended hours. Communication protocols require bilingual updates "
            "(French/English) within 2 hours of critical decisions. The client expects detailed risk assessments for any scope changes. "
            "Your decision will impact future contract renewals worth approximately 2.5M MAD annually and the company's reputation for reliability."
        )

        moderate_context_fr = (
            "\n\nContexte situationnel : Cela implique des parties prenantes clés dont Fatima (Responsable QA), Hassan (Chef d'équipe), et Omar (Relations Client). "
            "Le projet dispose d'un budget restant de 180 000 MAD avec des pénalités contractuelles de 15 000 MAD pour les retards dépassant 24 heures. "
            "L'équipe gère actuellement plusieurs livrables tout en travaillant en heures supplémentaires. Les protocoles de communication exigent des mises à jour bilingues "
            "(français/anglais) dans les 2 heures suivant les décisions critiques. Le client attend des évaluations détaillées des risques pour tout changement de périmètre. "
            "Votre décision impactera les renouvellements de contrats futurs d'une valeur d'environ 2,5M MAD annuellement et la réputation de l'entreprise en matière de fiabilité."
        )

        with transaction.atomic():
            # Update test configuration for 15 questions and 30 minutes
            try:
                test = Test.objects.get(id=test_id)
                if not dry:
                    test.duration_minutes = 30
                    test.total_questions = 15
                    test.save(update_fields=["duration_minutes", "total_questions"])
                self.stdout.write(f"{'[DRY RUN] Would update' if dry else 'Updated'} test config: 15 questions, 30 minutes")
            except Test.DoesNotExist:
                self.stdout.write(self.style.WARNING(f"Test with id={test_id} not found"))
                return

            # Update scenarios
            qs = Question.objects.filter(test_id=test_id, question_type='situational_judgment').order_by('order')
            if not qs.exists():
                self.stdout.write(self.style.WARNING(f"No SJT questions found for test_id={test_id}"))
                return

            updated = 0
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

                # Remove any existing long context and replace with moderate context
                # Remove the super detailed context if it exists
                if "Comprehensive situational context:" in en:
                    # Find where the original scenario ends (before the comprehensive context)
                    parts = en.split("\n\nComprehensive situational context:")
                    en = parts[0]  # Keep only the original scenario
                
                # Remove the previous additional context if it exists
                if "Additional context:" in en:
                    parts = en.split("\n\nAdditional context:")
                    en = parts[0]  # Keep only the original scenario

                # Remove detailed context if it exists
                if "Detailed context:" in en:
                    parts = en.split("\n\nDetailed context:")
                    en = parts[0]  # Keep only the original scenario

                # Handle French similarly
                if fr:
                    if "Contexte situationnel complet :" in fr:
                        parts = fr.split("\n\nContexte situationnel complet :")
                        fr = parts[0]
                    if "Contexte supplémentaire :" in fr:
                        parts = fr.split("\n\nContexte supplémentaire :")
                        fr = parts[0]
                    if "Contexte détaillé :" in fr:
                        parts = fr.split("\n\nContexte détaillé :")
                        fr = parts[0]

                # Add moderate context
                new_en = en + moderate_context_en
                new_fr = (fr or en) + moderate_context_fr

                ctx["scenario"]["en"] = new_en
                ctx["scenario"]["fr"] = new_fr

                if not dry:
                    q.context = json.dumps(ctx)
                    q.save(update_fields=["context"])
                updated += 1

        if dry:
            self.stdout.write(f"[DRY RUN] Would make {updated} SJT scenarios moderately longer and update test to 15 questions/30 minutes")
        else:
            self.stdout.write(self.style.SUCCESS(f"Made {updated} SJT scenarios moderately longer and updated test to 15 questions/30 minutes"))
