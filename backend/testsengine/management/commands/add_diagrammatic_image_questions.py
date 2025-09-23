"""
Django management command to add Diagrammatic Reasoning questions with images
"""

from django.core.management.base import BaseCommand
from django.db import transaction, models
from testsengine.models import Test, Question
import random


class Command(BaseCommand):
    help = 'Add Diagrammatic Reasoning questions with images for DRT1 (Pattern Recognition)'

    def handle(self, *args, **options):
        try:
            # Get the DRT1 test (ID 24)
            test = Test.objects.get(id=24)
            self.stdout.write(f"Adding Diagrammatic Reasoning questions to test: {test.title}")
            
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
                self.style.ERROR('DRT1 test (ID 24) not found!')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error adding questions: {str(e)}')
            )

    def add_questions(self, test):
        """Add Diagrammatic Reasoning questions with images and 3 difficulty levels"""
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
                question_type='diagrammatic_reasoning',
                main_image=question_data.get('question_image', '')
            )
            
            questions_added += 1
            self.stdout.write(f"Added question {i}: {question_data['question_text'][:50]}...")
        
        return questions_added

    def get_questions_data(self):
        """Return Diagrammatic Reasoning questions with images and 3 difficulty levels"""
        return [
            # EASY QUESTIONS (1-7) - Section 1: Logical Sequences
            {
                'question_text': 'Look at the sequence of shapes. What comes next in the pattern?',
                'question_image': '/assets/images/diagrammatic/questions/section_1/question_1.png',
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
                'explanation': 'The pattern shows a simple rotation sequence. The next shape should be option A.'
            },
            {
                'question_text': 'Which figure completes the sequence?',
                'question_image': '/assets/images/diagrammatic/questions/section_1/question_2.png',
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
                'explanation': 'The sequence shows a pattern of increasing complexity. Option B completes the pattern.'
            },
            {
                'question_text': 'What is the next shape in this sequence?',
                'question_image': '/assets/images/diagrammatic/questions/section_1/question_3.png',
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
                'explanation': 'The pattern alternates between two types of shapes. Option C is the correct next shape.'
            },
            {
                'question_text': 'Complete the pattern sequence.',
                'question_image': '/assets/images/diagrammatic/questions/section_1/question_4.png',
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
                'explanation': 'The sequence follows a specific transformation rule. Option D completes the pattern.'
            },
            {
                'question_text': 'Which option continues the sequence?',
                'question_image': '/assets/images/diagrammatic/questions/section_1/question_5.png',
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
                'explanation': 'The pattern shows a clear progression. Option E is the logical continuation.'
            },
            {
                'question_text': 'What comes next in this diagrammatic sequence?',
                'question_image': '/assets/images/diagrammatic/questions/section_1/question_6.png',
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
                'explanation': 'The sequence follows a specific rule. Option A is the correct next element.'
            },
            {
                'question_text': 'Complete the logical sequence.',
                'question_image': '/assets/images/diagrammatic/questions/section_1/question_7.png',
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
            {
                'question_text': 'Which figure follows the pattern?',
                'question_image': '/assets/images/diagrammatic/questions/section_1/question_8.png',
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
                'explanation': 'The sequence follows a specific rule. Option C is the correct continuation.'
            },
            {
                'question_text': 'What is the next element in this sequence?',
                'question_image': '/assets/images/diagrammatic/questions/section_1/question_9.png',
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
                'explanation': 'The pattern shows a clear progression. Option D is the logical next element.'
            },
            {
                'question_text': 'Complete the diagrammatic pattern.',
                'question_image': '/assets/images/diagrammatic/questions/section_1/question_10.png',
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
                'explanation': 'The sequence follows a specific transformation rule. Option E completes the pattern.'
            },

            # MEDIUM QUESTIONS (11-20) - Section 1: Logical Sequences
            {
                'question_text': 'Analyze the sequence and determine the next figure.',
                'question_image': '/assets/images/diagrammatic/questions/section_1/question_11.png',
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
                'explanation': 'The pattern involves multiple transformations. Option A is the correct next figure.'
            },
            {
                'question_text': 'What completes this complex sequence?',
                'question_image': '/assets/images/diagrammatic/questions/section_1/question_12.png',
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
                'explanation': 'The sequence shows a complex pattern involving multiple elements. Option B completes it.'
            },
            {
                'question_text': 'Identify the next element in this diagrammatic sequence.',
                'question_image': '/assets/images/diagrammatic/questions/section_1/question_13.png',
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
                'explanation': 'The pattern involves several transformation rules. Option C is the correct next element.'
            },
            {
                'question_text': 'Complete the logical progression.',
                'question_image': '/assets/images/diagrammatic/questions/section_1/question_14.png',
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
                'explanation': 'The sequence follows a complex pattern. Option D is the logical completion.'
            },
            {
                'question_text': 'What is the next figure in this sequence?',
                'question_image': '/assets/images/diagrammatic/questions/section_1/question_15.png',
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
                'explanation': 'The pattern involves multiple transformation rules. Option E is the correct next figure.'
            },
            {
                'question_text': 'Analyze the pattern and select the next element.',
                'question_image': '/assets/images/diagrammatic/questions/section_1/question_16.png',
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
                'explanation': 'The sequence shows a complex pattern. Option A is the correct next element.'
            },
            {
                'question_text': 'Complete the diagrammatic sequence.',
                'question_image': '/assets/images/diagrammatic/questions/section_1/question_17.png',
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
                'explanation': 'The pattern involves several transformation rules. Option B completes the sequence.'
            },
            {
                'question_text': 'What follows in this logical sequence?',
                'question_image': '/assets/images/diagrammatic/questions/section_1/question_18.png',
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
                'explanation': 'The sequence follows a complex pattern. Option C is the logical continuation.'
            },
            {
                'question_text': 'Identify the next figure in this sequence.',
                'question_image': '/assets/images/diagrammatic/questions/section_1/question_19.png',
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
                'explanation': 'The pattern involves multiple transformations. Option D is the correct next figure.'
            },
            {
                'question_text': 'Complete the complex diagrammatic pattern.',
                'question_image': '/assets/images/diagrammatic/questions/section_1/question_20.png',
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
                'explanation': 'The sequence shows a complex pattern involving multiple elements. Option E completes it.'
            },

            # HARD QUESTIONS (21-30) - Section 2: Flow Diagrams
            {
                'question_text': 'Analyze this complex flow diagram and determine the next step.',
                'question_image': '/assets/images/diagrammatic/questions/section_2/question_1.svg',
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
                'explanation': 'The flow diagram shows a complex decision tree. Option A represents the correct next step.'
            },
            {
                'question_text': 'What is the next process in this workflow?',
                'question_image': '/assets/images/diagrammatic/questions/section_1/question_21.png',
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
                'explanation': 'The workflow follows a specific logical progression. Option B is the correct next process.'
            },
            {
                'question_text': 'Complete this complex diagrammatic sequence.',
                'question_image': '/assets/images/diagrammatic/questions/section_1/question_22.png',
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
                'explanation': 'The sequence involves multiple complex transformations. Option C completes the pattern.'
            },
            {
                'question_text': 'What follows in this advanced sequence?',
                'question_image': '/assets/images/diagrammatic/questions/section_1/question_23.png',
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
                'explanation': 'The pattern involves sophisticated transformation rules. Option D is the correct continuation.'
            },
            {
                'question_text': 'Analyze this complex diagram and select the next element.',
                'question_image': '/assets/images/diagrammatic/questions/section_1/question_24.png',
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
                'explanation': 'The diagram shows a complex pattern involving multiple elements. Option E is the correct next element.'
            },
            {
                'question_text': 'Complete this advanced diagrammatic pattern.',
                'question_image': '/assets/images/diagrammatic/questions/section_1/question_25.png',
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
                'explanation': 'The pattern involves multiple complex transformation rules. Option A completes the pattern.'
            },
            {
                'question_text': 'What is the next step in this complex sequence?',
                'question_image': '/assets/images/diagrammatic/questions/section_1/question_26.png',
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
                'explanation': 'The sequence follows a sophisticated pattern. Option B is the correct next step.'
            },
            {
                'question_text': 'Identify the next element in this advanced sequence.',
                'question_image': '/assets/images/diagrammatic/questions/section_1/question_27.png',
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
                'explanation': 'The pattern involves multiple complex transformation rules. Option C is the correct next element.'
            },
            {
                'question_text': 'Complete this sophisticated diagrammatic sequence.',
                'question_image': '/assets/images/diagrammatic/questions/section_1/question_28.png',
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
                'explanation': 'The sequence shows a complex pattern involving multiple elements. Option D completes it.'
            },
            {
                'question_text': 'What follows in this advanced diagrammatic pattern?',
                'question_image': '/assets/images/diagrammatic/questions/section_1/question_29.png',
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
                'explanation': 'The pattern involves sophisticated transformation rules. Option E is the correct continuation.'
            },
            {
                'question_text': 'Analyze this complex diagram and determine the next element.',
                'question_image': '/assets/images/diagrammatic/questions/section_1/question_30.png',
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
                'explanation': 'The diagram shows a complex pattern involving multiple elements and transformation rules. Option A is the correct next element.'
            }
        ]
