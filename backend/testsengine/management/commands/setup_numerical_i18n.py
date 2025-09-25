"""
Django management command to set up numerical test with i18n support
"""
from django.core.management.base import BaseCommand
from django.db import transaction
from testsengine.models import Test, Question
from testsengine.models_i18n import (
    TestTranslation, QuestionTranslation, 
    NumericalTestCategory, NumericalTestCategoryTranslation,
    NumericalQuestionExtension
)
import json


class Command(BaseCommand):
    help = 'Set up numerical test with internationalization support'

    def add_arguments(self, parser):
        parser.add_argument(
            '--create-categories',
            action='store_true',
            help='Create numerical test categories',
        )
        parser.add_argument(
            '--create-translations',
            action='store_true',
            help='Create translations for existing tests',
        )
        parser.add_argument(
            '--test-id',
            type=int,
            help='Specific test ID to process',
        )

    def handle(self, *args, **options):
        self.stdout.write('Setting up numerical test i18n support...')
        
        with transaction.atomic():
            if options['create_categories']:
                self.create_categories()
            
            if options['create_translations']:
                test_id = options.get('test_id')
                self.create_translations(test_id)
        
        self.stdout.write(self.style.SUCCESS('Setup completed successfully!'))

    def create_categories(self):
        """Create numerical test categories with translations"""
        categories_data = [
            {
                'name': 'basic_arithmetic',
                'display_order': 1,
                'translations': {
                    'en': {
                        'display_name': 'Basic Arithmetic',
                        'description': 'Addition, subtraction, multiplication, and division problems'
                    },
                    'fr': {
                        'display_name': 'Arithmétique de Base',
                        'description': 'Problèmes d\'addition, soustraction, multiplication et division'
                    }
                }
            },
            {
                'name': 'percentages',
                'display_order': 2,
                'translations': {
                    'en': {
                        'display_name': 'Percentages and Ratios',
                        'description': 'Percentage calculations, ratios, and proportions'
                    },
                    'fr': {
                        'display_name': 'Pourcentages et Ratios',
                        'description': 'Calculs de pourcentages, ratios et proportions'
                    }
                }
            },
            {
                'name': 'data_interpretation',
                'display_order': 3,
                'translations': {
                    'en': {
                        'display_name': 'Data Interpretation',
                        'description': 'Reading and analyzing charts, graphs, and tables'
                    },
                    'fr': {
                        'display_name': 'Interprétation de Données',
                        'description': 'Lecture et analyse de graphiques, tableaux et diagrammes'
                    }
                }
            },
            {
                'name': 'word_problems',
                'display_order': 4,
                'translations': {
                    'en': {
                        'display_name': 'Word Problems',
                        'description': 'Mathematical problems presented in text format'
                    },
                    'fr': {
                        'display_name': 'Problèmes de Mots',
                        'description': 'Problèmes mathématiques présentés sous forme de texte'
                    }
                }
            },
            {
                'name': 'financial_calculations',
                'display_order': 5,
                'translations': {
                    'en': {
                        'display_name': 'Financial Calculations',
                        'description': 'Interest, profit/loss, and financial analysis'
                    },
                    'fr': {
                        'display_name': 'Calculs Financiers',
                        'description': 'Intérêts, profit/perte et analyse financière'
                    }
                }
            }
        ]
        
        for cat_data in categories_data:
            category, created = NumericalTestCategory.objects.get_or_create(
                name=cat_data['name'],
                defaults={
                    'display_order': cat_data['display_order'],
                    'is_active': True
                }
            )
            
            if created:
                self.stdout.write(f'Created category: {category.name}')
            
            # Create translations
            for lang, trans_data in cat_data['translations'].items():
                translation, created = NumericalTestCategoryTranslation.objects.get_or_create(
                    category=category,
                    language=lang,
                    defaults=trans_data
                )
                
                if created:
                    self.stdout.write(f'  Created {lang} translation for {category.name}')

    def create_translations(self, test_id=None):
        """Create translations for numerical tests"""
        if test_id:
            tests = Test.objects.filter(id=test_id, test_type='numerical_reasoning')
        else:
            tests = Test.objects.filter(test_type='numerical_reasoning')
        
        for test in tests:
            self.stdout.write(f'Processing test: {test.title}')
            
            # Create test translations
            self.create_test_translations(test)
            
            # Create question translations
            for question in test.questions.all():
                self.create_question_translations(question)

    def create_test_translations(self, test):
        """Create translations for a test"""
        translations_data = {
            'en': {
                'title': 'Numerical Reasoning Test',
                'description': 'Assess your ability to interpret and analyze numerical data, perform calculations, and solve mathematical problems.',
                'instructions': 'You will be presented with numerical reasoning questions that test your ability to interpret data and perform calculations. Analyze the data carefully before selecting your answer.'
            },
            'fr': {
                'title': 'Test de Raisonnement Numérique',
                'description': 'Évaluez votre capacité à interpréter et analyser des données numériques, effectuer des calculs et résoudre des problèmes mathématiques.',
                'instructions': 'Vous serez présenté avec des questions de raisonnement numérique qui testent votre capacité à interpréter les données et effectuer des calculs. Analysez attentivement les données avant de sélectionner votre réponse.'
            }
        }
        
        for lang, trans_data in translations_data.items():
            translation, created = TestTranslation.objects.get_or_create(
                test=test,
                language=lang,
                defaults=trans_data
            )
            
            if created:
                self.stdout.write(f'  Created {lang} translation for test')

    def create_question_translations(self, question):
        """Create translations for a question"""
        # This is a template - you'll need to add actual translations
        # based on your existing question content
        
        # Example for a basic arithmetic question
        if 'speed' in question.question_text.lower() and 'hour' in question.question_text.lower():
            translations_data = {
                'en': {
                    'question_text': question.question_text,
                    'options': question.options,
                    'explanation': question.explanation or ''
                },
                'fr': {
                    'question_text': question.question_text.replace('speed', 'vitesse').replace('hour', 'heure'),
                    'options': self.translate_options(question.options, 'fr'),
                    'explanation': self.translate_explanation(question.explanation or '', 'fr')
                }
            }
            
            for lang, trans_data in translations_data.items():
                translation, created = QuestionTranslation.objects.get_or_create(
                    question=question,
                    language=lang,
                    defaults=trans_data
                )
                
                if created:
                    self.stdout.write(f'    Created {lang} translation for question {question.id}')

    def translate_options(self, options, target_lang):
        """Translate question options"""
        if target_lang == 'fr' and isinstance(options, list):
            translated = []
            for option in options:
                if isinstance(option, dict) and 'text' in option:
                    translated_option = option.copy()
                    # Basic translation for units
                    translated_option['text'] = option['text'].replace('miles', 'kilomètres').replace('hours', 'heures')
                    translated.append(translated_option)
                else:
                    translated.append(option)
            return translated
        return options

    def translate_explanation(self, explanation, target_lang):
        """Translate question explanation"""
        if target_lang == 'fr':
            # Basic translation for common terms
            return explanation.replace('speed', 'vitesse').replace('distance', 'distance').replace('time', 'temps')
        return explanation
