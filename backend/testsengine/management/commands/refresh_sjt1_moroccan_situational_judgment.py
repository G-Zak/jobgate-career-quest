from django.core.management.base import BaseCommand
from django.db import transaction
import json
import random

from testsengine.models import Test, Question
from testsengine.question_option_model import QuestionOption

class Command(BaseCommand):
 help = "Create/Refresh SJT1 (Situational Judgment) with EN+FR, 50-item pool, clear stems and options; per-option scoring +2/+1/0/-1"

 def add_arguments(self, parser):
 parser.add_argument("--dry-run", action="store_true")
 parser.add_argument("--test-id", type=int, default=30, help="Backend test id to refresh (default 30)")

 def handle(self, *args, **opts):
 test_id = opts.get("test_id", 30)
 dry = opts.get("dry_run", False)
 self.stdout.write(" Refreshing SJT1 Situational Judgment…")

 def sjt_item(scenario_en, scenario_fr, question_en, question_fr, opts_en_with_scores, opts_fr):
 # opts_en_with_scores: list of tuples (text_en, score)
 # opts_fr: list of text_fr matching order
 letters = ["A", "B", "C", "D"]
 options_en = [t for t, _ in opts_en_with_scores]
 scores = [s for _, s in opts_en_with_scores]
 # Build per-option dicts
 option_rows = [
 {"letter": letters[i], "text_en": options_en[i], "text_fr": opts_fr[i], "score": scores[i]}
 for i in range(min(4, len(options_en)))
 ]
 return {
 "scenario_en": scenario_en,
 "scenario_fr": scenario_fr,
 "question_en": question_en,
 "question_fr": question_fr,
 "options_en": options_en[:4],
 "options_fr": opts_fr[:4],
 "option_rows": option_rows[:4],
 }

 data = []

 # Fixed detailed items with Moroccan workplace context (EN + FR)
 fixed = [
 sjt_item(
 "Casablanca — You have just joined a cross‑functional team at NoorTech Maroc. During sprint reviews and in the Slack #product-ideas channel, Amina (a junior analyst) is frequently talked over and her comments are not summarized in the meeting notes. A key deliverable is due in 5 days and the team is under pressure after a missed milestone. The project budget has 25,000 MAD remaining for this sprint, and the team lead, Hassan, prefers short meetings due to client calls.\n\nAdditional context: The client expects an update tomorrow morning. QA raised a risk about accessibility that Amina flagged earlier. The team has no clear practice for turn‑taking or capturing action items. You want to ensure inclusion without slowing delivery or increasing costs.",
 "Casablanca — Vous venez d'intégrer une équipe pluridisciplinaire chez NoorTech Maroc. Lors des revues de sprint et sur le canal Slack #product-ideas, Amina (analyste junior) est souvent interrompue et ses remarques ne figurent pas dans les comptes rendus. Un livrable clé est prévu dans 5 jours et l'équipe est sous pression après un jalon manqué. Le budget restant pour ce sprint est de 25 000 MAD, et le chef d'équipe, Hassan, privilégie des réunions courtes à cause d'appels clients.\n\nContexte supplémentaire : Le client attend une mise à jour demain matin. La QA a signalé un risque d'accessibilité déjà mentionné par Amina. L'équipe n'a pas de pratique claire pour le tour de parole ni pour la prise de notes d'actions. Vous souhaitez garantir l'inclusion sans ralentir la livraison ni augmenter les coûts.",
 "What is the most appropriate response to ensure inclusion without derailing delivery?",
 "Quelle est la meilleure réponse pour garantir l'inclusion sans perturber la livraison ?",
 [
 ("Speak privately with the team lead to agree on inclusive practices (round‑robin updates, note‑taker rotation) and apply them in the next review", 2),
 ("Wait until the deliverable is submitted, then raise the issue in a retrospective", 1),
 ("Make a light joke during the meeting to encourage participation and move on", 0),
 ("Ignore it; the pressure will pass and Amina will adapt", -1),
 ],
 [
 "Parler en privé avec le chef d'équipe pour convenir de pratiques inclusives (tour de table, rotation du preneur de notes) et les appliquer à la prochaine revue",
 "Attendre la soumission du livrable puis aborder le sujet en rétrospective",
 "Faire une blague pendant la réunion pour encourager la participation puis continuer",
 "Ignorer ; la pression passera et Amina s'adaptera",
 ],
 ),
 sjt_item(
 "Rabat — A public‑sector client managing a 1.2 M MAD annual contract reports repeated service interruptions during peak hours. They are threatening to cancel unless a remediation plan is presented within 48 hours. Your CRM shows an SLA with penalty clauses (up to 80,000 MAD). Logs suggest a configuration regression after last week's patch. The account manager, Imane, is on leave until tomorrow.\n\nAdditional context: A ministerial event is scheduled this weekend and the client's leadership is highly sensitive to outages. The on‑call engineer is Khadija, who can prepare a rollback within 6 hours if approved. Communications should follow the incident template and be bilingual (EN/FR) per contract.",
 "Rabat — Un client du secteur public gérant un contrat annuel de 1,2 M MAD signale des interruptions de service répétées aux heures de pointe. Il menace de résilier à moins qu'un plan de remédiation ne soit présenté sous 48 heures. Le CRM indique un SLA avec pénalités (jusqu'à 80 000 MAD). Les journaux suggèrent une régression de configuration après le correctif de la semaine dernière. La gestionnaire de compte, Imane, est en congé jusqu'à demain.\n\nContexte supplémentaire : Un événement ministériel est prévu ce week‑end et la direction du client est très sensible aux pannes. L'ingénieure d'astreinte, Khadija, peut préparer un rollback en 6 heures si approuvé. Les communications doivent suivre le modèle d'incident et être bilingues (FR/EN) selon le contrat.",
 "What should be your first step?",
 "Quelle devrait être votre première action ?",
 [
 ("Acknowledge the incident, assign an incident owner, and share a concrete recovery plan with milestones and communication cadence", 2),
 ("Escalate internally and wait for the account manager to return before responding to the client", 1),
 ("Wait to see if traffic normalizes this week before committing to actions", 0),
 ("Suggest canceling early to avoid penalties and reputational risk", -1),
 ],
 [
 "Accuser réception, nommer un responsable d'incident et partager un plan de remédiation concret avec jalons et fréquence de communication",
 "Escalader en interne et attendre le retour de la gestionnaire de compte avant de répondre au client",
 "Attendre de voir si le trafic se normalise cette semaine avant de s'engager",
 "Proposer une résiliation anticipée pour éviter pénalités et risque réputationnel",
 ],
 ),
 sjt_item(
 "Marrakech — While reconciling invoices from a logistics vendor, you notice a recurring 1.5% 'expedite' fee added to 12 invoices over three months (≈45,000 MAD total). No change orders or approvals exist for this fee. The vendor is key to festival shipments scheduled next week. Your finance partner, Omar, is available this afternoon for a quick review.\n\nAdditional context: The procurement policy requires written justification for any surcharge above 0.5%. Previous emails show the vendor pressed for faster payment terms last quarter. The operations lead, Ahmed, fears switching vendors so close to the festival.",
 "Marrakech — En rapprochant des factures d'un prestataire logistique, vous remarquez des frais \"express\" récurrents de 1,5 % ajoutés à 12 factures sur trois mois (≈45 000 MAD au total). Aucun avenant ni approbation n'existe pour ces frais. Ce prestataire est clé pour les expéditions du festival prévues la semaine prochaine. Votre partenaire finance, Omar, est disponible cet après‑midi pour un examen rapide.\n\nContexte supplémentaire : La politique achats exige une justification écrite pour tout surcoût supérieur à 0,5 %. Des emails antérieurs montrent que le prestataire demandait des délais de paiement plus courts le trimestre dernier. Le responsable opérations, Ahmed, craint de changer de prestataire si près du festival.",
 "What should you do next?",
 "Que devriez-vous faire ensuite ?",
 [
 ("Validate the pattern with Finance, freeze payment on disputed lines, notify the vendor formally, and open an internal review", 2),
 ("Inform your supervisor first and decide later whether to contact Finance", 1),
 ("Keep documenting and monitor future invoices before taking action", 0),
 ("Ignore since the percentage is small and shipments are urgent", -1),
 ],
 [
 "Confirmer l'anomalie avec la Finance, bloquer le paiement des lignes contestées, informer officiellement le fournisseur et ouvrir un examen interne",
 "Informer d'abord votre supérieur et décider plus tard de contacter la Finance",
 "Continuer à documenter et surveiller les prochaines factures avant d'agir",
 "Ignorer puisque le pourcentage est faible et que les expéditions sont urgentes",
 ],
 ),
 ]
 data.extend(fixed)

 # Template generators to reach 50 items with balanced difficulties
 names = ["Ahmed", "Fatima", "Hassan", "Imane", "Omar", "Khadija"]
 cities = ["Casablanca", "Rabat", "Marrakech", "Fès", "Agadir"]
 domains = [
 ("safety", "A colleague operates machinery without PPE", "Un collègue utilise une machine sans EPI"),
 ("ethics", "Manager has a personal link to a vendor", "Le manager a un lien personnel avec un fournisseur"),
 ("customer", "A long-term customer is upset about delays", "Un client de longue date est contrarié par des retards"),
 ("teamwork", "Two team members argue about priorities", "Deux membres d'équipe se disputent les priorités"),
 ("inclusion", "Venue not accessible for a teammate", "Lieu non accessible pour un coéquipier"),
 ("security", "Staff use a shortcut bypassing security", "Des employés utilisent un raccourci contournant la sécurité"),
 ("change", "Resistance to a new software rollout", "Résistance à un nouveau logiciel"),
 ]

 def gen_item():
 person = random.choice(names)
 city = random.choice(cities)
 domain_key, en_issue, fr_issue = random.choice(domains)
 scenario_en = (
 f"{city} — You are a project coordinator at NoorTech Maroc. "
 f"{person}, a colleague in operations, reports that {en_issue.lower()}. "
 "A client demo is in 72 hours; the remaining sprint budget is 18,000 MAD and overtime requires prior approval. "
 "Morale is mixed after last week's failed pilot.\n\n"
 "Additional context: Stakeholders include Fatima (QA), Hassan (Team Lead), and the client sponsor in Rabat. "
 "Security requires change approvals before any configuration adjustments. "
 "The communications plan expects bilingual updates (FR/EN) and clarity on risk and next steps."
 )
 scenario_fr = (
 f"{city} — Vous êtes coordinateur·rice de projet chez NoorTech Maroc. "
 f"{person}, un·e collègue des opérations, signale que {fr_issue.lower()}. "
 "Une démonstration client a lieu dans 72 heures ; le budget restant du sprint est de 18 000 MAD et les heures supplémentaires nécessitent une approbation préalable. "
 "Le moral est mitigé après l'échec du pilote la semaine dernière.\n\n"
 "Contexte supplémentaire : Les parties prenantes incluent Fatima (QA), Hassan (chef d'équipe) et le sponsor client à Rabat. "
 "La sécurité exige des validations de changement avant tout ajustement de configuration. "
 "Le plan de communication attend des mises à jour bilingues (FR/EN) avec risques et prochaines étapes."
 )
 question_en = "What is the most appropriate response given these constraints?"
 question_fr = "Quelle est la réponse la plus appropriée compte tenu de ces contraintes ?"
 opts_en_scores = [
 ("Address the issue immediately while proposing a practical solution", 2),
 ("Consult relevant stakeholders before acting", 1),
 ("Wait to see if it resolves itself", 0),
 ("Ignore to avoid conflict", -1),
 ]
 opts_fr = [
 "Traiter immédiatement le problème tout en proposant une solution pratique",
 "Consulter les parties prenantes avant d'agir",
 "Attendre pour voir si cela se résout",
 "Ignorer pour éviter le conflit",
 ]
 return sjt_item(scenario_en, scenario_fr, question_en, question_fr, opts_en_scores, opts_fr)

 while len(data) < 50:
 data.append(gen_item())

 # Persist
 created = 0
 if not dry:
 with transaction.atomic():
 test, _ = Test.objects.get_or_create(
 id=test_id,
 defaults={
 'title': 'Situational Judgment Test 1',
 'test_type': 'situational_judgment',
 'description': 'Workplace scenarios and decision making (EN + FR, Moroccan context)',
 'duration_minutes': 25,
 'total_questions': 50,
 'passing_score': 70,
 'is_active': True,
 }
 )
 # Clear existing questions and options
 QuestionOption.objects.filter(question__test_id=test_id).delete()
 Question.objects.filter(test_id=test_id).delete()

 # Assign difficulties roughly 50% hard, 30% medium, 20% easy across pool
 # We'll cycle through a pattern while inserting
 difficulty_cycle = (['hard'] * 5) + (['medium'] * 3) + (['easy'] * 2)
 idx = 0
 order = 0
 for q in data:
 order += 1
 diff = difficulty_cycle[idx % len(difficulty_cycle)]
 idx += 1
 ctx = {
 "locale": "MA",
 "domain": "situational_judgment",
 "scenario": {"en": q["scenario_en"], "fr": q["scenario_fr"]},
 "translations": {
 "fr": {
 "question_text": q["question_fr"],
 "options": q["options_fr"],
 }
 },
 "tags": ["Morocco", "SJT", "workplace"],
 }
 question = Question.objects.create(
 test_id=test_id,
 question_type='situational_judgment',
 question_text=q["question_en"],
 passage=None,
 options=q["options_en"], # Provide options to frontend
 correct_answer='A', # Best option; not used for SJT scoring
 difficulty_level=diff,
 order=order,
 explanation=None,
 context=json.dumps(ctx),
 )
 # Create per-option scoring rows (+2/+1/0/-1)
 for opt in q["option_rows"]:
 QuestionOption.objects.create(
 question=question,
 option_letter=opt["letter"],
 option_text=opt["text_en"],
 score_value=opt["score"],
 )
 created += 1
 test.total_questions = created
 test.is_active = True
 test.save()
 else:
 created = len(data)

 self.stdout.write(f" Prepared {created} SJT1 items (EN+FR stored; +2/+1/0/-1 per option)")
 self.stdout.write(" Selection ratios for SJT1 will be 50% hard, 30% medium, 20% easy (21 questions) via API")

