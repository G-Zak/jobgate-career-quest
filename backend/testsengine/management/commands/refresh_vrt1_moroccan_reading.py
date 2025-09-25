from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils import timezone
import json

from testsengine.models import Test, Question


class Command(BaseCommand):
    help = "Create/Refresh VRT1 (Reading Comprehension) with Moroccan-context passages, EN/FR translations, and valid answers"

    def add_arguments(self, parser):
        parser.add_argument("--dry-run", action="store_true", help="Print summary without writing to DB")

    def handle(self, *args, **options):
        test_id = 1  # VRT1
        dry_run = options.get("dry_run", False)

        self.stdout.write("🇲🇦 Refreshing VRT1 with Moroccan-context passages (EN/FR)...")

        # Define Moroccan-context passages (money in MAD, metric units, Moroccan names/places)
        # Each passage provides 3 MCQs A-D with correct_answer letter
        passages = [
            {
                "passage_en": (
                    "In Casablanca, Fatima manages a family-run grocery that sources olives and argan oil "
                    "from cooperatives near Agadir and Taroudant. The store buys extra-virgin argan oil at "
                    "250 MAD per liter and sells it at a 20% margin. During a spring promotion, she offers a "
                    "10% discount to regular customers. Despite the discount, monthly revenue from argan oil "
                    "grew due to higher footfall driven by social media posts and the souk weekend."
                ),
                "passage_fr": (
                    "À Casablanca, Fatima gère une épicerie familiale qui s'approvisionne en olives et en huile "
                    "d'argan auprès de coopératives près d'Agadir et de Taroudant. Le magasin achète l'huile "
                    "d'argan extra-vierge à 250 MAD le litre et la vend avec une marge de 20 %. Pendant une "
                    "promotion de printemps, elle offre une remise de 10 % aux clients fidèles. Malgré la remise, "
                    "le chiffre d'affaires mensuel provenant de l'huile d'argan a augmenté grâce à une plus forte "
                    "fréquentation due aux publications sur les réseaux sociaux et au week-end du souk."
                ),
                "questions": [
                    {
                        "question_en": "What is the store's purchase price for one liter of argan oil?",
                        "question_fr": "Quel est le prix d'achat du magasin pour un litre d'huile d'argan ?",
                        "options_en": [
                            "200 MAD per liter",
                            "250 MAD per liter",
                            "300 MAD per liter",
                            "350 MAD per liter",
                        ],
                        "options_fr": [
                            "200 MAD par litre",
                            "250 MAD par litre",
                            "300 MAD par litre",
                            "350 MAD par litre",
                        ],
                        "correct_answer": "B",
                        "difficulty": "easy",
                        "explanation": "The passage explicitly states the store buys at 250 MAD/L.",
                    },
                    {
                        "question_en": "During the promotion, what happened to monthly revenue from argan oil?",
                        "question_fr": "Pendant la promotion, qu'est-il arrivé au chiffre d'affaires mensuel de l'huile d'argan ?",
                        "options_en": [
                            "It decreased because of the discount",
                            "It stayed the same",
                            "It increased due to higher footfall",
                            "It is not mentioned",
                        ],
                        "options_fr": [
                            "Il a diminué à cause de la remise",
                            "Il est resté identique",
                            "Il a augmenté grâce à une fréquentation plus élevée",
                            "Ce n'est pas mentionné",
                        ],
                        "correct_answer": "C",
                        "difficulty": "medium",
                        "explanation": "The passage states revenue grew due to higher footfall despite the discount.",
                    },
                    {
                        "question_en": "Which locations are mentioned as sources for products?",
                        "question_fr": "Quelles localités sont mentionnées comme sources des produits ?",
                        "options_en": [
                            "Marrakech and Ouarzazate",
                            "Agadir and Taroudant",
                            "Rabat and Fès",
                            "Tanger and Oujda",
                        ],
                        "options_fr": [
                            "Marrakech et Ouarzazate",
                            "Agadir et Taroudant",
                            "Rabat et Fès",
                            "Tanger et Oujda",
                        ],
                        "correct_answer": "B",
                        "difficulty": "easy",
                        "explanation": "The passage mentions cooperatives near Agadir and Taroudant.",
                    },
                ],
            },
            {
                "passage_en": (
                    "Omar runs a transport service in Rabat delivering fresh produce from a farm 120 km away. "
                    "He optimized routes to reduce fuel usage by 12% while keeping delivery time under 2 hours. "
                    "Farmers are paid 8 MAD per kilogram for tomatoes, and the service charges 2 MAD per kg "
                    "for logistics. Supermarkets appreciate the consistency during peak tourism months."
                ),
                "passage_fr": (
                    "Omar gère un service de transport à Rabat livrant des produits frais depuis une ferme située "
                    "à 120 km. Il a optimisé les itinéraires pour réduire la consommation de carburant de 12 % tout "
                    "en maintenant un délai de livraison de moins de 2 heures. Les agriculteurs sont payés 8 MAD par "
                    "kilogramme de tomates et le service facture 2 MAD par kg pour la logistique. Les supermarchés "
                    "apprécient la régularité pendant les mois de fort tourisme."
                ),
                "questions": [
                    {
                        "question_en": "What unit is used to pay farmers for tomatoes?",
                        "question_fr": "Quelle unité est utilisée pour payer les agriculteurs pour les tomates ?",
                        "options_en": [
                            "Per liter",
                            "Per kilogram",
                            "Per crate",
                            "Per kilometer",
                        ],
                        "options_fr": [
                            "Par litre",
                            "Par kilogramme",
                            "Par caisse",
                            "Par kilomètre",
                        ],
                        "correct_answer": "B",
                        "difficulty": "easy",
                        "explanation": "Payment is 8 MAD per kilogram.",
                    },
                    {
                        "question_en": "What improvement did Omar achieve?",
                        "question_fr": "Quelle amélioration Omar a-t-il réalisée ?",
                        "options_en": [
                            "12% faster delivery",
                            "12% reduction in fuel usage",
                            "12% increase in prices",
                            "12% larger trucks",
                        ],
                        "options_fr": [
                            "Livraison 12 % plus rapide",
                            "Réduction de 12 % de la consommation de carburant",
                            "Augmentation de 12 % des prix",
                            "Camions 12 % plus grands",
                        ],
                        "correct_answer": "B",
                        "difficulty": "medium",
                        "explanation": "He optimized routes to reduce fuel usage by 12%.",
                    },
                    {
                        "question_en": "How far is the farm from Rabat?",
                        "question_fr": "À quelle distance se trouve la ferme de Rabat ?",
                        "options_en": [
                            "60 km",
                            "90 km",
                            "120 km",
                            "200 km",
                        ],
                        "options_fr": [
                            "60 km",
                            "90 km",
                            "120 km",
                            "200 km",
                        ],
                        "correct_answer": "C",
                        "difficulty": "easy",
                        "explanation": "The farm is 120 km away.",
                    },
                ],
            },
            {
                "passage_en": (
                    "Imane leads a women’s cooperative near Essaouira producing artisanal couscous. "
                    "To meet export standards, they standardized packaging to 1 kg bags and introduced a QR code "
                    "showing origin and harvesting dates. The cooperative negotiated with a distributor in Marrakech "
                    "for a purchase price of 18 MAD per kg, with a seasonal bonus when sales exceed 5,000 kg."
                ),
                "passage_fr": (
                    "Imane dirige une coopérative féminine près d'Essaouira qui produit du couscous artisanal. "
                    "Pour répondre aux normes d'exportation, elles ont standardisé l'emballage en sachets de 1 kg et "
                    "introduit un QR code indiquant l'origine et les dates de récolte. La coopérative a négocié avec "
                    "un distributeur à Marrakech un prix d'achat de 18 MAD par kg, avec une prime saisonnière lorsque "
                    "les ventes dépassent 5 000 kg."
                ),
                "questions": [
                    {
                        "question_en": "What package size was standardized for export?",
                        "question_fr": "Quelle taille d'emballage a été standardisée pour l'exportation ?",
                        "options_en": [
                            "500 g",
                            "1 kg",
                            "2 kg",
                            "5 kg",
                        ],
                        "options_fr": [
                            "500 g",
                            "1 kg",
                            "2 kg",
                            "5 kg",
                        ],
                        "correct_answer": "B",
                        "difficulty": "easy",
                        "explanation": "They standardized to 1 kg bags.",
                    },
                    {
                        "question_en": "Which city is the distributor based in?",
                        "question_fr": "Dans quelle ville se trouve le distributeur ?",
                        "options_en": [
                            "Rabat",
                            "Marrakech",
                            "Agadir",
                            "Fès",
                        ],
                        "options_fr": [
                            "Rabat",
                            "Marrakech",
                            "Agadir",
                            "Fès",
                        ],
                        "correct_answer": "B",
                        "difficulty": "easy",
                        "explanation": "The distributor is in Marrakech.",
                    },
                    {
                        "question_en": "What additional feature was added to the packaging?",
                        "question_fr": "Quelle fonctionnalité supplémentaire a été ajoutée à l'emballage ?",
                        "options_en": [
                            "Barcode with prices",
                            "QR code with origin and dates",
                            "RFID tag for inventory",
                            "Sticker with recipes",
                        ],
                        "options_fr": [
                            "Code-barres avec prix",
                            "QR code avec origine et dates",
                            "Étiquette RFID pour l'inventaire",
                            "Autocollant avec recettes",
                        ],
                        "correct_answer": "B",
                        "difficulty": "medium",
                        "explanation": "A QR code showing origin and harvesting dates was introduced.",
                    },
                ],
            },
            {
                "passage_en": (
                    "Hassan manages a guesthouse in Chefchaouen. To reduce water usage, he installed low-flow showers "
                    "that cut consumption from 12 L/min to 8 L/min. Electricity costs fell after adding solar panels, "
                    "which supply 40% of monthly needs. Guest satisfaction improved, and the guesthouse received a "
                    "local sustainability award."
                ),
                "passage_fr": (
                    "Hassan gère une maison d'hôtes à Chefchaouen. Pour réduire la consommation d'eau, il a installé "
                    "des douches à faible débit faisant passer la consommation de 12 L/min à 8 L/min. Les coûts "
                    "d'électricité ont baissé après l'installation de panneaux solaires couvrant 40 % des besoins mensuels. "
                    "La satisfaction des clients s'est améliorée et la maison d'hôtes a reçu un prix local de durabilité."
                ),
                "questions": [
                    {
                        "question_en": "What was the new water flow rate after the upgrade?",
                        "question_fr": "Quel était le nouveau débit d'eau après l'amélioration ?",
                        "options_en": [
                            "6 L/min",
                            "8 L/min",
                            "10 L/min",
                            "12 L/min",
                        ],
                        "options_fr": [
                            "6 L/min",
                            "8 L/min",
                            "10 L/min",
                            "12 L/min",
                        ],
                        "correct_answer": "B",
                        "difficulty": "easy",
                        "explanation": "Consumption decreased to 8 L/min.",
                    },
                    {
                        "question_en": "How much electricity do the solar panels supply?",
                        "question_fr": "Quelle part d'électricité les panneaux solaires fournissent-ils ?",
                        "options_en": [
                            "20% of monthly needs",
                            "30% of monthly needs",
                            "40% of monthly needs",
                            "50% of monthly needs",
                        ],
                        "options_fr": [
                            "20 % des besoins mensuels",
                            "30 % des besoins mensuels",
                            "40 % des besoins mensuels",
                            "50 % des besoins mensuels",
                        ],
                        "correct_answer": "C",
                        "difficulty": "medium",
                        "explanation": "Panels supply 40% of monthly needs.",
                    },
                    {
                        "question_en": "What recognition did the guesthouse receive?",
                        "question_fr": "Quelle reconnaissance la maison d'hôtes a-t-elle reçue ?",
                        "options_en": [
                            "A national tourism award",
                            "A local sustainability award",
                            "A social media certificate",
                            "No recognition was mentioned",
                        ],
                        "options_fr": [
                            "Un prix national du tourisme",
                            "Un prix local de durabilité",
                            "Un certificat des réseaux sociaux",
                            "Aucune reconnaissance mentionnée",
                        ],
                        "correct_answer": "B",
                        "difficulty": "easy",
                        "explanation": "The passage states it received a local sustainability award.",
                    },
                ],
            },
        ]

        # Build Question entries
        created = 0
        with transaction.atomic():
            if not dry_run:
                Question.objects.filter(test_id=test_id).delete()
            
            order = 0
            for p in passages:
                for q in p["questions"]:
                    order += 1
                    context = {
                        "locale": "MA",
                        "domain": "verbal_reading",
                        "translations": {
                            "fr": {
                                "passage_text": p["passage_fr"],
                                "question_text": q["question_fr"],
                                "options": q["options_fr"],
                            }
                        },
                        "tags": ["Morocco", "MAD", "metric"],
                    }

                    if not dry_run:
                        Question.objects.create(
                            test_id=test_id,
                            question_type="reading_comprehension",
                            question_text=q["question_en"],
                            passage=p["passage_en"],
                            options=q["options_en"],
                            correct_answer=q["correct_answer"],
                            difficulty_level=q["difficulty"],
                            order=order,
                            explanation=q.get("explanation"),
                            context=json.dumps(context),
                        )
                    created += 1

            if not dry_run:
                # Ensure Test metadata is reasonable (10 shown on frontend; backend can have more)
                test = Test.objects.filter(id=test_id).first()
                if test:
                    test.title = "Verbal Reasoning Test 1 - Reading Comprehension"
                    test.description = "Reading comprehension with Moroccan contexts (EN/FR)."
                    test.duration_minutes = test.duration_minutes or 20
                    test.test_type = "verbal_reasoning"
                    test.is_active = True
                    test.total_questions = created
                    test.save()

        self.stdout.write(f"✅ Prepared {created} Moroccan-context VRT1 items" + (" (dry-run)" if dry_run else ""))
        if not dry_run:
            self.stdout.write("ℹ️  Stored FR translations under context.translations.fr for passage/question/options")
            self.stdout.write("🎯 Correct answers are letters A–D; scoring works with existing backend")

