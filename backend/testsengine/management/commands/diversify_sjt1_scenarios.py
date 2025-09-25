from django.core.management.base import BaseCommand
from django.db import transaction
import json
import random

from testsengine.models import Question


class Command(BaseCommand):
    help = "Diversify SJT1 scenarios with unique, varied contexts for each situation"

    def add_arguments(self, parser):
        parser.add_argument("--test-id", type=int, default=30, help="Backend test id to update (default 30)")
        parser.add_argument("--dry-run", action="store_true", help="Preview changes without saving")

    def handle(self, *args, **opts):
        test_id = opts.get("test_id", 30)
        dry = opts.get("dry_run", False)

        # Diverse context templates based on scenario type
        context_templates = {
            "team_dynamics": {
                "en": "\n\nTeam context: The development team consists of 8 members with varying experience levels. Recent sprint retrospectives revealed communication gaps affecting productivity. The team lead Omar has been with the company for 3 years and values inclusive decision-making. Current project deadlines are tight with a client demo scheduled in 5 days. Team morale surveys indicate some members feel their contributions aren't recognized. The company culture emphasizes collaboration and psychological safety.",
                "fr": "\n\nContexte d'équipe : L'équipe de développement se compose de 8 membres avec des niveaux d'expérience variés. Les rétrospectives de sprint récentes ont révélé des lacunes de communication affectant la productivité. Le chef d'équipe Omar est dans l'entreprise depuis 3 ans et valorise la prise de décision inclusive. Les délais actuels du projet sont serrés avec une démo client prévue dans 5 jours. Les enquêtes de moral d'équipe indiquent que certains membres estiment que leurs contributions ne sont pas reconnues. La culture d'entreprise met l'accent sur la collaboration et la sécurité psychologique."
            },
            "client_relations": {
                "en": "\n\nClient context: This client represents 25% of annual revenue (1.8M MAD) and has been with the company for 2 years. They operate in the financial services sector with strict regulatory requirements. Previous escalations were resolved through transparent communication and proactive solutions. The client's technical team in Rabat expects weekly progress reports and immediate notification of any issues. Contract renewal discussions are scheduled for next quarter. The relationship manager Fatima has built strong trust with their stakeholders.",
                "fr": "\n\nContexte client : Ce client représente 25% du chiffre d'affaires annuel (1,8M MAD) et est avec l'entreprise depuis 2 ans. Il opère dans le secteur des services financiers avec des exigences réglementaires strictes. Les escalades précédentes ont été résolues grâce à une communication transparente et des solutions proactives. L'équipe technique du client à Rabat attend des rapports de progrès hebdomadaires et une notification immédiate de tout problème. Les discussions de renouvellement de contrat sont prévues pour le prochain trimestre. La responsable de relation Fatima a établi une forte confiance avec leurs parties prenantes."
            },
            "security_compliance": {
                "en": "\n\nSecurity context: The company follows ISO 27001 standards and undergoes quarterly security audits. Recent cybersecurity incidents in the industry have heightened awareness. The security officer Khadija requires all policy deviations to be documented and approved. Current security protocols mandate two-factor authentication and encrypted communications for sensitive data. The IT infrastructure includes cloud services with specific compliance requirements. Any security breach could result in regulatory fines up to 500,000 MAD and reputation damage.",
                "fr": "\n\nContexte sécurité : L'entreprise suit les normes ISO 27001 et subit des audits de sécurité trimestriels. Les incidents de cybersécurité récents dans l'industrie ont accru la sensibilisation. La responsable sécurité Khadija exige que toutes les déviations de politique soient documentées et approuvées. Les protocoles de sécurité actuels exigent une authentification à deux facteurs et des communications cryptées pour les données sensibles. L'infrastructure informatique inclut des services cloud avec des exigences de conformité spécifiques. Toute violation de sécurité pourrait entraîner des amendes réglementaires jusqu'à 500 000 MAD et des dommages à la réputation."
            },
            "vendor_management": {
                "en": "\n\nVendor context: The company works with 15+ vendors across different services with contracts totaling 3.2M MAD annually. Procurement policies require competitive bidding for contracts over 50,000 MAD. The finance team led by Hassan conducts monthly vendor performance reviews. Recent supply chain disruptions have emphasized the importance of vendor reliability. All vendor relationships are governed by strict SLAs with penalty clauses. The procurement manager Imane maintains detailed vendor scorecards and relationship histories.",
                "fr": "\n\nContexte fournisseur : L'entreprise travaille avec plus de 15 fournisseurs sur différents services avec des contrats totalisant 3,2M MAD annuellement. Les politiques d'approvisionnement exigent des appels d'offres concurrentiels pour les contrats de plus de 50 000 MAD. L'équipe financière dirigée par Hassan effectue des évaluations mensuelles de performance des fournisseurs. Les perturbations récentes de la chaîne d'approvisionnement ont souligné l'importance de la fiabilité des fournisseurs. Toutes les relations fournisseurs sont régies par des SLA stricts avec des clauses de pénalité. La responsable des achats Imane maintient des tableaux de bord détaillés des fournisseurs et des historiques de relations."
            },
            "project_management": {
                "en": "\n\nProject context: This is a 6-month agile project with a budget of 850,000 MAD, currently in sprint 8 of 12. The project involves integrating three legacy systems with modern APIs. Stakeholders include internal teams and external partners across Casablanca, Rabat, and Marrakech. Daily standups reveal blockers related to technical debt and resource allocation. The project manager Amina uses JIRA for tracking and Slack for team communication. Client expectations include bi-weekly demos and comprehensive documentation in both French and English.",
                "fr": "\n\nContexte projet : Il s'agit d'un projet agile de 6 mois avec un budget de 850 000 MAD, actuellement au sprint 8 sur 12. Le projet implique l'intégration de trois systèmes legacy avec des API modernes. Les parties prenantes incluent des équipes internes et des partenaires externes à travers Casablanca, Rabat et Marrakech. Les standups quotidiens révèlent des blocages liés à la dette technique et à l'allocation des ressources. La chef de projet Amina utilise JIRA pour le suivi et Slack pour la communication d'équipe. Les attentes du client incluent des démos bihebdomadaires et une documentation complète en français et en anglais."
            },
            "process_improvement": {
                "en": "\n\nProcess context: The company is implementing lean methodologies to improve efficiency and reduce waste. Current processes involve manual approvals that create bottlenecks, especially during peak periods. The operations manager Hassan has identified 5 key areas for automation. Employee feedback suggests that some processes are outdated and hinder productivity. Change management protocols require stakeholder buy-in and phased rollouts. Recent process improvements have resulted in 20% time savings and improved employee satisfaction scores.",
                "fr": "\n\nContexte processus : L'entreprise met en œuvre des méthodologies lean pour améliorer l'efficacité et réduire le gaspillage. Les processus actuels impliquent des approbations manuelles qui créent des goulots d'étranglement, surtout pendant les périodes de pointe. Le responsable des opérations Hassan a identifié 5 domaines clés pour l'automatisation. Les retours des employés suggèrent que certains processus sont obsolètes et entravent la productivité. Les protocoles de gestion du changement exigent l'adhésion des parties prenantes et des déploiements par phases. Les améliorations de processus récentes ont entraîné 20% d'économies de temps et des scores de satisfaction des employés améliorés."
            }
        }

        # Keywords to identify scenario types
        scenario_keywords = {
            "team_dynamics": ["team", "meeting", "colleague", "overlooked", "ideas", "communication", "collaboration"],
            "client_relations": ["client", "customer", "service", "cancel", "revenue", "relationship", "satisfaction"],
            "security_compliance": ["security", "policy", "compliance", "audit", "breach", "protocol", "shortcut", "bypassing"],
            "vendor_management": ["vendor", "supplier", "billing", "contract", "procurement", "overbilling"],
            "project_management": ["project", "deadline", "rollout", "implementation", "delivery", "scope", "timeline"],
            "process_improvement": ["process", "procedure", "workflow", "efficiency", "improvement", "automation"]
        }

        def classify_scenario(scenario_text):
            """Classify scenario based on keywords"""
            text_lower = scenario_text.lower()
            scores = {}
            
            for category, keywords in scenario_keywords.items():
                score = sum(1 for keyword in keywords if keyword in text_lower)
                scores[category] = score
            
            # Return category with highest score, or random if tie
            max_score = max(scores.values())
            if max_score == 0:
                return random.choice(list(context_templates.keys()))
            
            candidates = [cat for cat, score in scores.items() if score == max_score]
            return random.choice(candidates)

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
                    en = scenario
                    ctx["scenario"] = {"en": en, "fr": None}

                if not en:
                    continue

                # Extract original scenario (before any context additions)
                original_en = en.split("\n\nSituational context:")[0].split("\n\nDetailed context:")[0].split("\n\nAdditional context:")[0]
                original_fr = None
                if fr:
                    original_fr = fr.split("\n\nContexte situationnel :")[0].split("\n\nContexte détaillé :")[0].split("\n\nContexte supplémentaire :")[0]

                # Classify and get appropriate context
                category = classify_scenario(original_en)
                template = context_templates[category]

                # Build new scenario with specific context
                new_en = original_en + template["en"]
                new_fr = (original_fr or original_en) + template["fr"]

                ctx["scenario"]["en"] = new_en
                ctx["scenario"]["fr"] = new_fr

                if not dry:
                    q.context = json.dumps(ctx)
                    q.save(update_fields=["context"])
                
                if dry:
                    self.stdout.write(f"Question {q.order}: {category} - {original_en[:50]}...")
                
                updated += 1

        if dry:
            self.stdout.write(f"[DRY RUN] Would diversify {updated} SJT scenarios with unique contexts")
        else:
            self.stdout.write(self.style.SUCCESS(f"Diversified {updated} SJT scenarios with unique, varied contexts"))
