"""
Django management command to add Abstract Reasoning questions with images
"""

from django.core.management.base import BaseCommand
from django.db import transaction, models
from testsengine.models import Test, Question
import random


class Command(BaseCommand):
    help = 'Add Abstract Reasoning questions with images for ART1 (Pattern Recognition)'

    def handle(self, *args, **options):
        try:
            # Get the ART1 test (ID 10)
            test = Test.objects.get(id=10)
            self.stdout.write(f"Adding Abstract Reasoning questions to test: {test.title}")
            
            with transaction.atomic():
                # Clear existing questions first
                test.questions.all().delete()
                self.stdout.write("Cleared existing questions")
                
                # Add new questions
                questions_added = self.add_questions(test)
                
                self.stdout.write(
                    self.style.SUCCESS(
                        f'Successfully added {questions_added} questions to {test.title}'
                    )
                )
                
                # Update test total questions count
                test.total_questions = test.questions.count()
                test.save()
                
                self.stdout.write(f"Updated total questions count to: {test.total_questions}")
                
        except Test.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('ART1 test (ID 10) not found!')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error adding questions: {str(e)}')
            )

    def add_questions(self, test):
        """Add Abstract Reasoning questions with images"""
        questions_data = self.get_questions_data()
        questions_added = 0
        
        for i, question_data in enumerate(questions_data, start=1):
            question = Question.objects.create(
                test=test,
                question_text=question_data['question_text'],
                options=question_data['options'],
                correct_answer=question_data['correct_answer'],
                difficulty_level=question_data['difficulty_level'],
                explanation=question_data.get('explanation', ''),
                order=i,
                question_type='abstract_reasoning',
                main_image=question_data.get('question_image', '')
            )
            
            questions_added += 1
            self.stdout.write(f"Added question {i}: {question_data['question_text'][:50]}...")
        
        return questions_added

    def get_questions_data(self):
        """Return Abstract Reasoning questions with images"""
        return [
            # EASY QUESTIONS (1-7)
            {
                'question_text': 'Look at the pattern. What comes next in the sequence?',
                'question_image': '/assets/images/abstract/questions/1.png',
                'options': [
                    {'option_id': 'A', 'text': 'A'},
                    {'option_id': 'B', 'text': 'B'},
                    {'option_id': 'C', 'text': 'C'},
                    {'option_id': 'D', 'text': 'D'},
                    {'option_id': 'E', 'text': 'E'}
                ],
                'correct_answer': 'A',
                'difficulty_level': 'easy',
                'complexity_score': 1,
                'explanation': 'The pattern shows a simple sequence. Option A is the correct next element.'
            },
            {
                'question_text': 'Which figure completes the pattern?',
                'question_image': '/assets/images/abstract/questions/2.png',
                'options': [
                    {'option_id': 'A', 'text': 'A'},
                    {'option_id': 'B', 'text': 'B'},
                    {'option_id': 'C', 'text': 'C'},
                    {'option_id': 'D', 'text': 'D'},
                    {'option_id': 'E', 'text': 'E'}
                ],
                'correct_answer': 'B',
                'difficulty_level': 'easy',
                'complexity_score': 1,
                'explanation': 'The pattern follows a clear rule. Option B completes the sequence.'
            },
            {
                'question_text': 'What is the next shape in this sequence?',
                'question_image': '/assets/images/abstract/questions/3.png',
                'options': [
                    {'option_id': 'A', 'text': 'A'},
                    {'option_id': 'B', 'text': 'B'},
                    {'option_id': 'C', 'text': 'C'},
                    {'option_id': 'D', 'text': 'D'},
                    {'option_id': 'E', 'text': 'E'}
                ],
                'correct_answer': 'C',
                'difficulty_level': 'easy',
                'complexity_score': 1,
                'explanation': 'The sequence alternates between two types of shapes. Option C is correct.'
            },
            {
                'question_text': 'Complete the abstract pattern.',
                'question_image': '/assets/images/abstract/questions/4.png',
                'options': [
                    {'option_id': 'A', 'text': 'A'},
                    {'option_id': 'B', 'text': 'B'},
                    {'option_id': 'C', 'text': 'C'},
                    {'option_id': 'D', 'text': 'D'},
                    {'option_id': 'E', 'text': 'E'}
                ],
                'correct_answer': 'D',
                'difficulty_level': 'easy',
                'complexity_score': 1,
                'explanation': 'The pattern shows a clear transformation. Option D completes it.'
            },
            {
                'question_text': 'Which option continues the sequence?',
                'question_image': '/assets/images/abstract/questions/5.png',
                'options': [
                    {'option_id': 'A', 'text': 'A'},
                    {'option_id': 'B', 'text': 'B'},
                    {'option_id': 'C', 'text': 'C'},
                    {'option_id': 'D', 'text': 'D'},
                    {'option_id': 'E', 'text': 'E'}
                ],
                'correct_answer': 'E',
                'difficulty_level': 'easy',
                'complexity_score': 1,
                'explanation': 'The sequence follows a specific rule. Option E is the logical continuation.'
            },
            {
                'question_text': 'What comes next in this abstract sequence?',
                'question_image': '/assets/images/abstract/questions/6.png',
                'options': [
                    {'option_id': 'A', 'text': 'A'},
                    {'option_id': 'B', 'text': 'B'},
                    {'option_id': 'C', 'text': 'C'},
                    {'option_id': 'D', 'text': 'D'},
                    {'option_id': 'E', 'text': 'E'}
                ],
                'correct_answer': 'A',
                'difficulty_level': 'easy',
                'complexity_score': 1,
                'explanation': 'The pattern shows a clear progression. Option A is the correct next element.'
            },
            {
                'question_text': 'Complete the logical sequence.',
                'question_image': '/assets/images/abstract/questions/7.png',
                'options': [
                    {'option_id': 'A', 'text': 'A'},
                    {'option_id': 'B', 'text': 'B'},
                    {'option_id': 'C', 'text': 'C'},
                    {'option_id': 'D', 'text': 'D'},
                    {'option_id': 'E', 'text': 'E'}
                ],
                'correct_answer': 'B',
                'difficulty_level': 'easy',
                'complexity_score': 1,
                'explanation': 'The pattern shows a clear transformation. Option B completes the sequence.'
            },

            # MEDIUM QUESTIONS (8-14)
            {
                'question_text': 'Which figure follows the pattern?',
                'question_image': '/assets/images/abstract/questions/8.png',
                'options': [
                    {'option_id': 'A', 'text': 'A'},
                    {'option_id': 'B', 'text': 'B'},
                    {'option_id': 'C', 'text': 'C'},
                    {'option_id': 'D', 'text': 'D'},
                    {'option_id': 'E', 'text': 'E'}
                ],
                'correct_answer': 'C',
                'difficulty_level': 'medium',
                'complexity_score': 2,
                'explanation': 'The pattern involves multiple transformations. Option C is correct.'
            },
            {
                'question_text': 'What is the next element in this sequence?',
                'question_image': '/assets/images/abstract/questions/9.png',
                'options': [
                    {'option_id': 'A', 'text': 'A'},
                    {'option_id': 'B', 'text': 'B'},
                    {'option_id': 'C', 'text': 'C'},
                    {'option_id': 'D', 'text': 'D'},
                    {'option_id': 'E', 'text': 'E'}
                ],
                'correct_answer': 'D',
                'difficulty_level': 'medium',
                'complexity_score': 2,
                'explanation': 'The pattern shows a complex progression. Option D is the logical next element.'
            },
            {
                'question_text': 'Complete the abstract pattern.',
                'question_image': '/assets/images/abstract/questions/10.png',
                'options': [
                    {'option_id': 'A', 'text': 'A'},
                    {'option_id': 'B', 'text': 'B'},
                    {'option_id': 'C', 'text': 'C'},
                    {'option_id': 'D', 'text': 'D'},
                    {'option_id': 'E', 'text': 'E'}
                ],
                'correct_answer': 'E',
                'difficulty_level': 'medium',
                'complexity_score': 2,
                'explanation': 'The pattern involves multiple rules. Option E completes it.'
            },
            {
                'question_text': 'Analyze the sequence and determine the next figure.',
                'question_image': '/assets/images/abstract/questions/11.png',
                'options': [
                    {'option_id': 'A', 'text': 'A'},
                    {'option_id': 'B', 'text': 'B'},
                    {'option_id': 'C', 'text': 'C'},
                    {'option_id': 'D', 'text': 'D'},
                    {'option_id': 'E', 'text': 'E'}
                ],
                'correct_answer': 'A',
                'difficulty_level': 'medium',
                'complexity_score': 2,
                'explanation': 'The pattern involves multiple transformations. Option A is correct.'
            },
            {
                'question_text': 'What completes this complex sequence?',
                'question_image': '/assets/images/abstract/questions/12.png',
                'options': [
                    {'option_id': 'A', 'text': 'A'},
                    {'option_id': 'B', 'text': 'B'},
                    {'option_id': 'C', 'text': 'C'},
                    {'option_id': 'D', 'text': 'D'},
                    {'option_id': 'E', 'text': 'E'}
                ],
                'correct_answer': 'B',
                'difficulty_level': 'medium',
                'complexity_score': 2,
                'explanation': 'The pattern shows a complex sequence. Option B completes it.'
            },
            {
                'question_text': 'Identify the next element in this abstract sequence.',
                'question_image': '/assets/images/abstract/questions/13.png',
                'options': [
                    {'option_id': 'A', 'text': 'A'},
                    {'option_id': 'B', 'text': 'B'},
                    {'option_id': 'C', 'text': 'C'},
                    {'option_id': 'D', 'text': 'D'},
                    {'option_id': 'E', 'text': 'E'}
                ],
                'correct_answer': 'C',
                'difficulty_level': 'medium',
                'complexity_score': 2,
                'explanation': 'The pattern involves several transformation rules. Option C is correct.'
            },
            {
                'question_text': 'Complete the logical progression.',
                'question_image': '/assets/images/abstract/questions/14.png',
                'options': [
                    {'option_id': 'A', 'text': 'A'},
                    {'option_id': 'B', 'text': 'B'},
                    {'option_id': 'C', 'text': 'C'},
                    {'option_id': 'D', 'text': 'D'},
                    {'option_id': 'E', 'text': 'E'}
                ],
                'correct_answer': 'D',
                'difficulty_level': 'medium',
                'complexity_score': 2,
                'explanation': 'The pattern follows a complex rule. Option D is the logical completion.'
            },

            # HARD QUESTIONS (15-20)
            {
                'question_text': 'What is the next figure in this sequence?',
                'question_image': '/assets/images/abstract/questions/15.png',
                'options': [
                    {'option_id': 'A', 'text': 'A'},
                    {'option_id': 'B', 'text': 'B'},
                    {'option_id': 'C', 'text': 'C'},
                    {'option_id': 'D', 'text': 'D'},
                    {'option_id': 'E', 'text': 'E'}
                ],
                'correct_answer': 'E',
                'difficulty_level': 'hard',
                'complexity_score': 3,
                'explanation': 'The pattern involves multiple complex transformations. Option E is correct.'
            },
            {
                'question_text': 'Analyze the pattern and select the next element.',
                'question_image': '/assets/images/abstract/questions/16.png',
                'options': [
                    {'option_id': 'A', 'text': 'A'},
                    {'option_id': 'B', 'text': 'B'},
                    {'option_id': 'C', 'text': 'C'},
                    {'option_id': 'D', 'text': 'D'},
                    {'option_id': 'E', 'text': 'E'}
                ],
                'correct_answer': 'A',
                'difficulty_level': 'hard',
                'complexity_score': 3,
                'explanation': 'The sequence shows a highly complex pattern. Option A is correct.'
            },
            {
                'question_text': 'Complete the abstract sequence.',
                'question_image': '/assets/images/abstract/questions/17.png',
                'options': [
                    {'option_id': 'A', 'text': 'A'},
                    {'option_id': 'B', 'text': 'B'},
                    {'option_id': 'C', 'text': 'C'},
                    {'option_id': 'D', 'text': 'D'},
                    {'option_id': 'E', 'text': 'E'}
                ],
                'correct_answer': 'B',
                'difficulty_level': 'hard',
                'complexity_score': 3,
                'explanation': 'The pattern involves several complex transformation rules. Option B completes it.'
            },
            {
                'question_text': 'What follows in this logical sequence?',
                'question_image': '/assets/images/abstract/questions/18.png',
                'options': [
                    {'option_id': 'A', 'text': 'A'},
                    {'option_id': 'B', 'text': 'B'},
                    {'option_id': 'C', 'text': 'C'},
                    {'option_id': 'D', 'text': 'D'},
                    {'option_id': 'E', 'text': 'E'}
                ],
                'correct_answer': 'C',
                'difficulty_level': 'hard',
                'complexity_score': 3,
                'explanation': 'The sequence follows a highly complex pattern. Option C is the logical continuation.'
            },
            {
                'question_text': 'Identify the next figure in this sequence.',
                'question_image': '/assets/images/abstract/questions/19.png',
                'options': [
                    {'option_id': 'A', 'text': 'A'},
                    {'option_id': 'B', 'text': 'B'},
                    {'option_id': 'C', 'text': 'C'},
                    {'option_id': 'D', 'text': 'D'},
                    {'option_id': 'E', 'text': 'E'}
                ],
                'correct_answer': 'D',
                'difficulty_level': 'hard',
                'complexity_score': 3,
                'explanation': 'The pattern involves multiple complex transformations. Option D is correct.'
            },
            {
                'question_text': 'Complete the complex abstract pattern.',
                'question_image': '/assets/images/abstract/questions/20.png',
                'options': [
                    {'option_id': 'A', 'text': 'A'},
                    {'option_id': 'B', 'text': 'B'},
                    {'option_id': 'C', 'text': 'C'},
                    {'option_id': 'D', 'text': 'D'},
                    {'option_id': 'E', 'text': 'E'}
                ],
                'correct_answer': 'E',
                'difficulty_level': 'hard',
                'complexity_score': 3,
                'explanation': 'The sequence shows a highly complex pattern involving multiple elements. Option E completes it.'
            }
        ]
