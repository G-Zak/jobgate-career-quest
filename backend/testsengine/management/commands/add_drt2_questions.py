"""
Django management command to add DRT2 questions (Flow Diagrams)
"""

from django.core.management.base import BaseCommand
from django.db import transaction, models
from testsengine.models import Test, Question
import random


class Command(BaseCommand):
    help = 'Add DRT2 questions (Flow Diagrams) for test ID 25'

    def handle(self, *args, **options):
        try:
            # Get the DRT2 test (ID 25)
            test = Test.objects.get(id=25)
            self.stdout.write(f"Adding DRT2 Flow Diagram questions to test: {test.title}")
            
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
                self.style.ERROR('DRT2 test (ID 25) not found!')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error adding questions: {str(e)}')
            )

    def add_questions(self, test):
        """Add DRT2 Flow Diagram questions with 3 difficulty levels"""
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
        """Return DRT2 Flow Diagram questions with 3 difficulty levels"""
        return [
            # EASY QUESTIONS (1-10) - Flow Diagrams
            {
                'question_text': 'Analyze this simple flow diagram. What is the next step?',
                'question_image': '/assets/images/diagrammatic/questions/section_2/question_1.svg',
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
                'explanation': 'The flow diagram shows a simple decision tree. Option A represents the correct next step.'
            },
            {
                'question_text': 'What follows in this basic workflow?',
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
                'explanation': 'The workflow follows a clear sequence. Option B is the logical next step.'
            },
            {
                'question_text': 'Complete this simple process flow.',
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
                'explanation': 'The process flow shows a clear pattern. Option C completes the sequence.'
            },
            {
                'question_text': 'What is the next action in this flowchart?',
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
                'explanation': 'The flowchart follows a logical progression. Option D is the correct next action.'
            },
            {
                'question_text': 'Which step completes this basic process?',
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
                'explanation': 'The process shows a clear sequence. Option E completes the basic process.'
            },
            {
                'question_text': 'What comes next in this simple decision tree?',
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
                'explanation': 'The decision tree follows a clear logic. Option A is the correct next step.'
            },
            {
                'question_text': 'Complete this basic workflow sequence.',
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
                'explanation': 'The workflow shows a clear pattern. Option B completes the sequence.'
            },
            {
                'question_text': 'What is the next step in this process?',
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
                'explanation': 'The process follows a logical sequence. Option C is the correct next step.'
            },
            {
                'question_text': 'Which action follows in this flowchart?',
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
                'explanation': 'The flowchart shows a clear progression. Option D is the logical next action.'
            },
            {
                'question_text': 'Complete this simple process flow.',
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
                'explanation': 'The process flow follows a clear pattern. Option E completes the sequence.'
            },

            # MEDIUM QUESTIONS (11-20) - Complex Flow Diagrams
            {
                'question_text': 'Analyze this complex workflow. What is the next step?',
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
                'explanation': 'The complex workflow involves multiple decision points. Option A is the correct next step.'
            },
            {
                'question_text': 'What follows in this advanced process flow?',
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
                'explanation': 'The advanced process flow shows multiple branches. Option B is the logical continuation.'
            },
            {
                'question_text': 'Complete this complex decision tree.',
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
                'explanation': 'The decision tree involves multiple conditions. Option C completes the complex tree.'
            },
            {
                'question_text': 'What is the next action in this sophisticated flowchart?',
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
                'explanation': 'The sophisticated flowchart has multiple paths. Option D is the correct next action.'
            },
            {
                'question_text': 'Which step completes this advanced process?',
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
                'explanation': 'The advanced process involves multiple stages. Option E completes the process.'
            },
            {
                'question_text': 'What comes next in this complex decision tree?',
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
                'explanation': 'The complex decision tree has multiple branches. Option A is the correct next step.'
            },
            {
                'question_text': 'Complete this sophisticated workflow sequence.',
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
                'explanation': 'The sophisticated workflow involves multiple processes. Option B completes the sequence.'
            },
            {
                'question_text': 'What is the next step in this advanced process?',
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
                'explanation': 'The advanced process has multiple decision points. Option C is the correct next step.'
            },
            {
                'question_text': 'Which action follows in this complex flowchart?',
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
                'explanation': 'The complex flowchart involves multiple paths. Option D is the logical next action.'
            },
            {
                'question_text': 'Complete this advanced process flow.',
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
                'explanation': 'The advanced process flow has multiple stages. Option E completes the sequence.'
            },

            # HARD QUESTIONS (21-30) - Advanced Flow Diagrams
            {
                'question_text': 'Analyze this highly complex workflow. What is the next step?',
                'question_image': '/assets/images/diagrammatic/questions/section_1/question_21.png',
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
                'explanation': 'The highly complex workflow involves multiple decision trees. Option A is the correct next step.'
            },
            {
                'question_text': 'What follows in this expert-level process flow?',
                'question_image': '/assets/images/diagrammatic/questions/section_1/question_22.png',
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
                'explanation': 'The expert-level process flow has multiple parallel paths. Option B is the logical continuation.'
            },
            {
                'question_text': 'Complete this master-level decision tree.',
                'question_image': '/assets/images/diagrammatic/questions/section_1/question_23.png',
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
                'explanation': 'The master-level decision tree involves complex nested conditions. Option C completes the tree.'
            },
            {
                'question_text': 'What is the next action in this expert flowchart?',
                'question_image': '/assets/images/diagrammatic/questions/section_1/question_24.png',
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
                'explanation': 'The expert flowchart has multiple complex paths. Option D is the correct next action.'
            },
            {
                'question_text': 'Which step completes this master-level process?',
                'question_image': '/assets/images/diagrammatic/questions/section_1/question_25.png',
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
                'explanation': 'The master-level process involves multiple complex stages. Option E completes the process.'
            },
            {
                'question_text': 'What comes next in this expert decision tree?',
                'question_image': '/assets/images/diagrammatic/questions/section_1/question_26.png',
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
                'explanation': 'The expert decision tree has multiple complex branches. Option A is the correct next step.'
            },
            {
                'question_text': 'Complete this master-level workflow sequence.',
                'question_image': '/assets/images/diagrammatic/questions/section_1/question_27.png',
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
                'explanation': 'The master-level workflow involves multiple complex processes. Option B completes the sequence.'
            },
            {
                'question_text': 'What is the next step in this expert process?',
                'question_image': '/assets/images/diagrammatic/questions/section_1/question_28.png',
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
                'explanation': 'The expert process has multiple complex decision points. Option C is the correct next step.'
            },
            {
                'question_text': 'Which action follows in this master flowchart?',
                'question_image': '/assets/images/diagrammatic/questions/section_1/question_29.png',
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
                'explanation': 'The master flowchart involves multiple complex paths. Option D is the logical next action.'
            },
            {
                'question_text': 'Complete this expert-level process flow.',
                'question_image': '/assets/images/diagrammatic/questions/section_1/question_30.png',
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
                'explanation': 'The expert-level process flow has multiple complex stages. Option E completes the sequence.'
            }
        ]
