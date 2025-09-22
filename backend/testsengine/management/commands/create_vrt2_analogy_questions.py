from django.core.management.base import BaseCommand
from django.db import transaction
from testsengine.models import Test, Question

class Command(BaseCommand):
    help = 'Creates comprehensive analogy questions for VRT2 (Verbal Reasoning Test 2)'

    def handle(self, *args, **options):
        test_id = 6  # VRT2 Test ID
        
        # Update test metadata
        test, created = Test.objects.get_or_create(
            id=test_id,
            defaults={
                'title': 'Verbal Reasoning Test 2 - Analogies',
                'description': 'Comprehensive analogies across 9 different types',
                'duration_minutes': 25,
                'test_type': 'verbal_reasoning',
                'is_active': True
            }
        )
        
        if not created:
            test.title = 'Verbal Reasoning Test 2 - Analogies'
            test.description = 'Comprehensive analogies across 9 different types'
            test.duration_minutes = 25
            test.test_type = 'verbal_reasoning'
            test.save()
            self.stdout.write(f'Updated test {test_id} metadata')
        else:
            self.stdout.write(f'Created test {test_id}')

        # Clear existing questions
        Question.objects.filter(test_id=test_id).delete()
        self.stdout.write(f'Cleared existing questions for test {test_id}')

        # Define 9 different types of analogies with 3 questions each (27 total)
        analogy_questions = [
            # Type 1: Synonym Analogies
            {
                'question_text': 'Book is to Library as Car is to:',
                'options': ['Garage', 'Road', 'Driver', 'Engine', 'Wheel'],
                'correct_answer': 'A',
                'difficulty': 'easy',
                'explanation': 'A book is stored in a library, just as a car is stored in a garage.'
            },
            {
                'question_text': 'Happy is to Joyful as Sad is to:',
                'options': ['Angry', 'Mournful', 'Excited', 'Calm', 'Surprised'],
                'correct_answer': 'B',
                'difficulty': 'easy',
                'explanation': 'Happy and Joyful are synonyms, just as Sad and Mournful are synonyms.'
            },
            {
                'question_text': 'Large is to Huge as Small is to:',
                'options': ['Big', 'Tiny', 'Medium', 'Average', 'Normal'],
                'correct_answer': 'B',
                'difficulty': 'easy',
                'explanation': 'Large and Huge are synonyms, just as Small and Tiny are synonyms.'
            },
            
            # Type 2: Antonym Analogies
            {
                'question_text': 'Hot is to Cold as Light is to:',
                'options': ['Bright', 'Dark', 'Heavy', 'Warm', 'Clear'],
                'correct_answer': 'B',
                'difficulty': 'easy',
                'explanation': 'Hot and Cold are antonyms, just as Light and Dark are antonyms.'
            },
            {
                'question_text': 'Up is to Down as Left is to:',
                'options': ['Right', 'Forward', 'Back', 'Side', 'Center'],
                'correct_answer': 'A',
                'difficulty': 'easy',
                'explanation': 'Up and Down are antonyms, just as Left and Right are antonyms.'
            },
            {
                'question_text': 'Win is to Lose as Success is to:',
                'options': ['Victory', 'Failure', 'Achievement', 'Triumph', 'Accomplishment'],
                'correct_answer': 'B',
                'difficulty': 'medium',
                'explanation': 'Win and Lose are antonyms, just as Success and Failure are antonyms.'
            },
            
            # Type 3: Part-Whole Analogies
            {
                'question_text': 'Page is to Book as Leaf is to:',
                'options': ['Tree', 'Branch', 'Root', 'Flower', 'Stem'],
                'correct_answer': 'A',
                'difficulty': 'easy',
                'explanation': 'A page is part of a book, just as a leaf is part of a tree.'
            },
            {
                'question_text': 'Wheel is to Car as Blade is to:',
                'options': ['Knife', 'Handle', 'Cut', 'Sharp', 'Metal'],
                'correct_answer': 'A',
                'difficulty': 'easy',
                'explanation': 'A wheel is part of a car, just as a blade is part of a knife.'
            },
            {
                'question_text': 'Chapter is to Novel as Scene is to:',
                'options': ['Play', 'Actor', 'Stage', 'Audience', 'Theater'],
                'correct_answer': 'A',
                'difficulty': 'medium',
                'explanation': 'A chapter is part of a novel, just as a scene is part of a play.'
            },
            
            # Type 4: Function/Purpose Analogies
            {
                'question_text': 'Scissors is to Cut as Hammer is to:',
                'options': ['Build', 'Nail', 'Wood', 'Tool', 'Strike'],
                'correct_answer': 'E',
                'difficulty': 'easy',
                'explanation': 'Scissors are used to cut, just as a hammer is used to strike.'
            },
            {
                'question_text': 'Thermometer is to Temperature as Scale is to:',
                'options': ['Weight', 'Measure', 'Heavy', 'Light', 'Balance'],
                'correct_answer': 'A',
                'difficulty': 'medium',
                'explanation': 'A thermometer measures temperature, just as a scale measures weight.'
            },
            {
                'question_text': 'Key is to Lock as Password is to:',
                'options': ['Computer', 'Account', 'Security', 'Access', 'Login'],
                'correct_answer': 'B',
                'difficulty': 'medium',
                'explanation': 'A key opens a lock, just as a password opens an account.'
            },
            
            # Type 5: Cause-Effect Analogies
            {
                'question_text': 'Rain is to Flood as Fire is to:',
                'options': ['Smoke', 'Ash', 'Heat', 'Destruction', 'Water'],
                'correct_answer': 'D',
                'difficulty': 'medium',
                'explanation': 'Rain causes floods, just as fire causes destruction.'
            },
            {
                'question_text': 'Study is to Knowledge as Exercise is to:',
                'options': ['Health', 'Strength', 'Fitness', 'Muscle', 'Energy'],
                'correct_answer': 'A',
                'difficulty': 'medium',
                'explanation': 'Study leads to knowledge, just as exercise leads to health.'
            },
            {
                'question_text': 'Practice is to Skill as Experience is to:',
                'options': ['Wisdom', 'Age', 'Time', 'Learning', 'Growth'],
                'correct_answer': 'A',
                'difficulty': 'hard',
                'explanation': 'Practice develops skill, just as experience develops wisdom.'
            },
            
            # Type 6: Degree/Intensity Analogies
            {
                'question_text': 'Whisper is to Shout as Glance is to:',
                'options': ['Look', 'Stare', 'See', 'Watch', 'Observe'],
                'correct_answer': 'B',
                'difficulty': 'medium',
                'explanation': 'Whisper is a low degree of sound, shout is high; glance is a low degree of looking, stare is high.'
            },
            {
                'question_text': 'Warm is to Hot as Cool is to:',
                'options': ['Cold', 'Freezing', 'Chilly', 'Icy', 'Frozen'],
                'correct_answer': 'A',
                'difficulty': 'easy',
                'explanation': 'Warm is a moderate degree of heat, hot is high; cool is a moderate degree of cold, cold is high.'
            },
            {
                'question_text': 'Like is to Love as Dislike is to:',
                'options': ['Hate', 'Anger', 'Fury', 'Rage', 'Despise'],
                'correct_answer': 'A',
                'difficulty': 'medium',
                'explanation': 'Like is a moderate degree of affection, love is high; dislike is a moderate degree of negative feeling, hate is high.'
            },
            
            # Type 7: Sequence/Order Analogies
            {
                'question_text': 'Monday is to Tuesday as January is to:',
                'options': ['February', 'December', 'Year', 'Month', 'Calendar'],
                'correct_answer': 'A',
                'difficulty': 'easy',
                'explanation': 'Monday is followed by Tuesday, just as January is followed by February.'
            },
            {
                'question_text': 'Child is to Adult as Seed is to:',
                'options': ['Plant', 'Tree', 'Flower', 'Fruit', 'Growth'],
                'correct_answer': 'A',
                'difficulty': 'medium',
                'explanation': 'Child develops into an adult, just as a seed develops into a plant.'
            },
            {
                'question_text': 'Morning is to Afternoon as Spring is to:',
                'options': ['Summer', 'Fall', 'Winter', 'Year', 'Season'],
                'correct_answer': 'A',
                'difficulty': 'medium',
                'explanation': 'Morning is followed by afternoon, just as spring is followed by summer.'
            },
            
            # Type 8: Classification/Category Analogies
            {
                'question_text': 'Apple is to Fruit as Carrot is to:',
                'options': ['Vegetable', 'Orange', 'Food', 'Root', 'Garden'],
                'correct_answer': 'A',
                'difficulty': 'easy',
                'explanation': 'Apple is a type of fruit, just as carrot is a type of vegetable.'
            },
            {
                'question_text': 'Dog is to Animal as Rose is to:',
                'options': ['Flower', 'Plant', 'Garden', 'Beauty', 'Thorn'],
                'correct_answer': 'A',
                'difficulty': 'easy',
                'explanation': 'Dog is a type of animal, just as rose is a type of flower.'
            },
            {
                'question_text': 'Piano is to Instrument as Novel is to:',
                'options': ['Book', 'Literature', 'Story', 'Author', 'Reading'],
                'correct_answer': 'A',
                'difficulty': 'medium',
                'explanation': 'Piano is a type of instrument, just as novel is a type of book.'
            },
            
            # Type 9: Mathematical/Logical Analogies
            {
                'question_text': '2 is to 4 as 3 is to:',
                'options': ['6', '9', '12', '1', '5'],
                'correct_answer': 'A',
                'difficulty': 'easy',
                'explanation': '2 × 2 = 4, just as 3 × 2 = 6.'
            },
            {
                'question_text': 'Square is to Rectangle as Circle is to:',
                'options': ['Oval', 'Round', 'Sphere', 'Curve', 'Arc'],
                'correct_answer': 'A',
                'difficulty': 'medium',
                'explanation': 'A square is a special type of rectangle, just as a circle is a special type of oval.'
            },
            {
                'question_text': 'Addition is to Subtraction as Multiplication is to:',
                'options': ['Division', 'Addition', 'Subtraction', 'Calculation', 'Math'],
                'correct_answer': 'A',
                'difficulty': 'medium',
                'explanation': 'Addition and subtraction are inverse operations, just as multiplication and division are inverse operations.'
            }
        ]

        # Create questions
        created_count = 0
        with transaction.atomic():
            for i, q_data in enumerate(analogy_questions, 1):
                question = Question.objects.create(
                    test_id=test_id,
                    question_type='analogies',
                    question_text=q_data['question_text'],
                    options=q_data['options'],
                    correct_answer=q_data['correct_answer'],
                    difficulty_level=q_data['difficulty'],
                    order=i,
                    explanation=q_data['explanation']
                )
                created_count += 1
                if created_count % 5 == 0:
                    self.stdout.write(f'Created {created_count} questions...')

        self.stdout.write(self.style.SUCCESS(f'Successfully created {created_count} analogy questions for VRT2!'))
        self.stdout.write(f'Test includes 9 different types of analogies:')
        self.stdout.write('1. Synonym Analogies')
        self.stdout.write('2. Antonym Analogies') 
        self.stdout.write('3. Part-Whole Analogies')
        self.stdout.write('4. Function/Purpose Analogies')
        self.stdout.write('5. Cause-Effect Analogies')
        self.stdout.write('6. Degree/Intensity Analogies')
        self.stdout.write('7. Sequence/Order Analogies')
        self.stdout.write('8. Classification/Category Analogies')
        self.stdout.write('9. Mathematical/Logical Analogies')
