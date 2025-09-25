from django.core.management.base import BaseCommand
from django.db import transaction
import json

from testsengine.models import Question


class Command(BaseCommand):
    help = "Replace SJT1 scenarios with MUCH LONGER, super detailed versions (EN/FR) - keeps scoring intact"

    def add_arguments(self, parser):
        parser.add_argument("--test-id", type=int, default=30, help="Backend test id to update (default 30)")
        parser.add_argument("--dry-run", action="store_true", help="Preview changes without saving")

    def handle(self, *args, **opts):
        test_id = opts.get("test_id", 30)
        dry = opts.get("dry_run", False)

        # Super detailed context that will be appended to ALL scenarios
        mega_context_en = (
            "\n\nComprehensive situational context: This workplace scenario occurs within a complex organizational structure involving multiple departments, "
            "stakeholders, and competing priorities. The key players include Fatima (Senior QA Lead with 8 years experience), Hassan (Team Lead responsible for 3 parallel projects), "
            "Omar (Client Relations Manager handling a portfolio worth 4.2M MAD), Khadija (Security & Compliance Officer), and Imane (Project Coordinator managing timelines). "
            "\n\nFinancial implications: The current project operates under a strict budget of 180,000 MAD remaining, with contractual penalty clauses triggering automatic deductions of 15,000 MAD "
            "for every 24-hour delay beyond the agreed deadline. Previous similar incidents have resulted in client escalations, emergency meetings with C-level executives, "
            "and negative impacts on team morale that took months to recover. The company's annual contract renewal cycle is approaching, with this client representing 35% of total revenue. "
            "\n\nOperational constraints: The team is currently managing three concurrent deliverables while operating at 110% capacity, with most members already working 50+ hour weeks. "
            "The technical infrastructure requires specific security clearances for any modifications, and all changes must be approved through a formal change control board that meets twice weekly. "
            "Communication protocols mandate bilingual documentation (French/English) for all client-facing materials, with updates required within 2 hours of any critical decisions. "
            "\n\nStakeholder expectations: The client's technical team in Rabat expects detailed risk assessments, comprehensive mitigation strategies, and transparent communication about any deviations "
            "from the original project scope. Senior management has emphasized that this project serves as a reference case for future business development, and the company's reputation for reliability, "
            "technical excellence, and ethical business practices is directly tied to the outcome. Your decision-making process will be documented, reviewed by the quality assurance team, "
            "and potentially used as a case study in future training programs. Consider the immediate technical requirements, long-term business relationships, regulatory compliance obligations, "
            "team welfare, and the broader impact on organizational culture and market positioning."
        )

        mega_context_fr = (
            "\n\nContexte situationnel complet : Ce scénario professionnel se déroule dans une structure organisationnelle complexe impliquant plusieurs départements, "
            "parties prenantes et priorités concurrentes. Les acteurs clés incluent Fatima (Responsable QA Senior avec 8 ans d'expérience), Hassan (Chef d'équipe responsable de 3 projets parallèles), "
            "Omar (Responsable Relations Client gérant un portefeuille de 4,2M MAD), Khadija (Responsable Sécurité & Conformité), et Imane (Coordinatrice de projet gérant les délais). "
            "\n\nImplications financières : Le projet actuel fonctionne sous un budget strict de 180 000 MAD restants, avec des clauses de pénalité contractuelles déclenchant des déductions automatiques de 15 000 MAD "
            "pour chaque retard de 24 heures au-delà de l'échéance convenue. Des incidents similaires précédents ont entraîné des escalades client, des réunions d'urgence avec les dirigeants, "
            "et des impacts négatifs sur le moral d'équipe qui ont pris des mois à récupérer. Le cycle de renouvellement annuel des contrats de l'entreprise approche, ce client représentant 35% du chiffre d'affaires total. "
            "\n\nContraintes opérationnelles : L'équipe gère actuellement trois livrables simultanés tout en fonctionnant à 110% de capacité, la plupart des membres travaillant déjà plus de 50 heures par semaine. "
            "L'infrastructure technique nécessite des autorisations de sécurité spécifiques pour toute modification, et tous les changements doivent être approuvés par un comité de contrôle des changements qui se réunit deux fois par semaine. "
            "Les protocoles de communication exigent une documentation bilingue (français/anglais) pour tous les matériaux destinés aux clients, avec des mises à jour requises dans les 2 heures suivant toute décision critique. "
            "\n\nAttentes des parties prenantes : L'équipe technique du client à Rabat attend des évaluations détaillées des risques, des stratégies d'atténuation complètes, et une communication transparente sur toute déviation "
            "du périmètre original du projet. La direction générale a souligné que ce projet sert de cas de référence pour le développement commercial futur, et la réputation de l'entreprise en matière de fiabilité, "
            "d'excellence technique et de pratiques commerciales éthiques est directement liée au résultat. Votre processus de prise de décision sera documenté, examiné par l'équipe d'assurance qualité, "
            "et potentiellement utilisé comme étude de cas dans les futurs programmes de formation. Considérez les exigences techniques immédiates, les relations commerciales à long terme, les obligations de conformité réglementaire, "
            "le bien-être de l'équipe, et l'impact plus large sur la culture organisationnelle et le positionnement sur le marché."
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

                # Avoid double-appending: check for our marker
                if "Comprehensive situational context:" in en:
                    continue

                new_en = en + mega_context_en
                new_fr = (fr or en) + mega_context_fr

                ctx["scenario"]["en"] = new_en
                ctx["scenario"]["fr"] = new_fr

                if not dry:
                    q.context = json.dumps(ctx)
                    q.save(update_fields=["context"])
                updated += 1

        if dry:
            self.stdout.write(f"[DRY RUN] Would make {updated} SJT scenarios SUPER DETAILED for test_id={test_id}")
        else:
            self.stdout.write(self.style.SUCCESS(f"Made {updated} SJT scenarios SUPER DETAILED with comprehensive context (EN/FR)"))
