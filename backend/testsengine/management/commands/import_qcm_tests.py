from django.core.management.base import BaseCommand
import json
import os
from testsengine.models import Test, Question

class Command(BaseCommand):
    help = 'Importe les tests QCM depuis le fichier JSON'

    def handle(self, *args, **options):
        self.stdout.write('Importation des tests QCM...')
        
        # Chemin vers le fichier JSON
        json_file_path = os.path.join(
            os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))),
            'skills-api', 'exemple_tests.json'
        )
        
        if not os.path.exists(json_file_path):
            self.stdout.write(self.style.ERROR(f'Fichier non trouvé: {json_file_path}'))
            return
        
        try:
            with open(json_file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            tests_created = 0
            questions_created = 0
            
            for test_data in data['tests']:
                skill_name = test_data['skill_name']
                test_name = test_data['test_name']
                
                # Mapper les noms de compétences aux types de tests Django
                skill_mapping = {
                    'JavaScript': 'technical',
                    'Python': 'technical', 
                    'Java': 'technical',
                    'Django': 'technical',
                    'React': 'technical',
                    'Node.js': 'technical'
                }
                
                test_type = skill_mapping.get(skill_name, 'technical')
                
                # Créer ou récupérer le test
                test, created = Test.objects.get_or_create(
                    title=test_name,
                    test_type=test_type,
                    defaults={
                        'description': test_data.get('description', ''),
                        'duration_minutes': test_data.get('time_limit', 30),
                        'total_questions': len(test_data.get('questions', [])),
                        'passing_score': 70,
                        'is_active': True
                    }
                )
                
                if created:
                    tests_created += 1
                    self.stdout.write(f'✅ Test créé: {test_name} ({skill_name})')
                else:
                    self.stdout.write(f'⚠️  Test existe déjà: {test_name}')
                
                # Supprimer les anciennes questions si le test existait déjà
                if not created:
                    test.questions.all().delete()
                
                # Ajouter les questions
                for i, question_data in enumerate(test_data.get('questions', [])):
                    # Construire les options
                    options = []
                    if question_data.get('option_a'):
                        options.append(f"A. {question_data['option_a']}")
                    if question_data.get('option_b'):
                        options.append(f"B. {question_data['option_b']}")
                    if question_data.get('option_c'):
                        options.append(f"C. {question_data['option_c']}")
                    if question_data.get('option_d'):
                        options.append(f"D. {question_data['option_d']}")
                    
                    question = Question.objects.create(
                        test=test,
                        question_type='multiple_choice',
                        question_text=question_data['question_text'],
                        options=options,
                        correct_answer=question_data['correct_answer'].upper(),
                        explanation=question_data.get('explanation', ''),
                        difficulty_level='medium',
                        order=i + 1
                    )
                    questions_created += 1
                
                # Mettre à jour le nombre total de questions
                test.total_questions = test.questions.count()
                test.save()
            
            self.stdout.write(
                self.style.SUCCESS(
                    f'🎉 Import terminé ! '
                    f'{tests_created} tests créés, '
                    f'{questions_created} questions créées'
                )
            )
            
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'❌ Erreur lors de l\'import: {str(e)}')
            )
