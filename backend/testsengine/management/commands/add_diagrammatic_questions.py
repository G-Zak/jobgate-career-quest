"""
Django management command to add Diagrammatic Reasoning questions
"""

from django.core.management.base import BaseCommand
from django.db import transaction, models
from testsengine.models import Test, Question
import random


class Command(BaseCommand):
    help = 'Add Diagrammatic Reasoning questions for DRT1 (Pattern Recognition)'

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
        """Add Diagrammatic Reasoning questions with 3 difficulty levels"""
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
                question_type='diagrammatic_reasoning'
            )
            
            questions_added += 1
            self.stdout.write(f"Added question {i}: {question_data['question_text'][:50]}...")
        
        return questions_added

    def get_questions_data(self):
        """Return Diagrammatic Reasoning questions with 3 difficulty levels"""
        return [
            # EASY QUESTIONS (1-10)
            {
                'question_text': 'Look at the pattern in the sequence. What comes next?\n\n[Square] → [Circle] → [Triangle] → [Square] → [Circle] → ?',
                'options': [
                    {'option_id': 'A', 'text': 'Triangle'},
                    {'option_id': 'B', 'text': 'Square'},
                    {'option_id': 'C', 'text': 'Circle'},
                    {'option_id': 'D', 'text': 'Diamond'},
                    {'option_id': 'E', 'text': 'Hexagon'}
                ],
                'correct_answer': 'A',
                'difficulty_level': 'easy',
                'complexity_score': 1,
                'explanation': 'The pattern repeats every 3 shapes: Square, Circle, Triangle. After Circle comes Triangle.'
            },
            {
                'question_text': 'Which figure completes the pattern?\n\n[Red Circle] → [Blue Square] → [Red Triangle] → [Blue Circle] → [Red Square] → ?',
                'options': [
                    {'option_id': 'A', 'text': 'Blue Triangle'},
                    {'option_id': 'B', 'text': 'Red Circle'},
                    {'option_id': 'C', 'text': 'Blue Square'},
                    {'option_id': 'D', 'text': 'Red Triangle'},
                    {'option_id': 'E', 'text': 'Blue Circle'}
                ],
                'correct_answer': 'A',
                'difficulty_level': 'easy',
                'complexity_score': 1,
                'explanation': 'The pattern alternates between Red and Blue, and cycles through Circle, Square, Triangle. Next should be Blue Triangle.'
            },
            {
                'question_text': 'What is the next number in the sequence?\n\n2, 4, 8, 16, ?',
                'options': [
                    {'option_id': 'A', 'text': '24'},
                    {'option_id': 'B', 'text': '32'},
                    {'option_id': 'C', 'text': '20'},
                    {'option_id': 'D', 'text': '28'},
                    {'option_id': 'E', 'text': '36'}
                ],
                'correct_answer': 'B',
                'difficulty_level': 'easy',
                'complexity_score': 1,
                'explanation': 'Each number is double the previous: 2×2=4, 4×2=8, 8×2=16, 16×2=32.'
            },
            {
                'question_text': 'Which shape should replace the question mark?\n\n[Triangle] → [Square] → [Pentagon] → [Hexagon] → ?',
                'options': [
                    {'option_id': 'A', 'text': 'Heptagon'},
                    {'option_id': 'B', 'text': 'Octagon'},
                    {'option_id': 'C', 'text': 'Circle'},
                    {'option_id': 'D', 'text': 'Diamond'},
                    {'option_id': 'E', 'text': 'Star'}
                ],
                'correct_answer': 'A',
                'difficulty_level': 'easy',
                'complexity_score': 1,
                'explanation': 'The pattern increases by one side each time: 3, 4, 5, 6, 7 sides. Next is heptagon (7 sides).'
            },
            {
                'question_text': 'Complete the pattern:\n\nA, C, E, G, ?',
                'options': [
                    {'option_id': 'A', 'text': 'H'},
                    {'option_id': 'B', 'text': 'I'},
                    {'option_id': 'C', 'text': 'J'},
                    {'option_id': 'D', 'text': 'K'},
                    {'option_id': 'E', 'text': 'L'}
                ],
                'correct_answer': 'B',
                'difficulty_level': 'easy',
                'complexity_score': 1,
                'explanation': 'The pattern skips one letter each time: A (skip B) C (skip D) E (skip F) G (skip H) I.'
            },
            {
                'question_text': 'What comes next in the sequence?\n\n1, 3, 6, 10, 15, ?',
                'options': [
                    {'option_id': 'A', 'text': '20'},
                    {'option_id': 'B', 'text': '21'},
                    {'option_id': 'C', 'text': '22'},
                    {'option_id': 'D', 'text': '25'},
                    {'option_id': 'E', 'text': '30'}
                ],
                'correct_answer': 'B',
                'difficulty_level': 'easy',
                'complexity_score': 1,
                'explanation': 'The pattern increases by consecutive integers: +2, +3, +4, +5, +6. So 15 + 6 = 21.'
            },
            {
                'question_text': 'Which figure completes the series?\n\n[Small Circle] → [Medium Circle] → [Large Circle] → [Small Square] → [Medium Square] → ?',
                'options': [
                    {'option_id': 'A', 'text': 'Large Square'},
                    {'option_id': 'B', 'text': 'Small Circle'},
                    {'option_id': 'C', 'text': 'Medium Circle'},
                    {'option_id': 'D', 'text': 'Large Circle'},
                    {'option_id': 'E', 'text': 'Small Triangle'}
                ],
                'correct_answer': 'A',
                'difficulty_level': 'easy',
                'complexity_score': 1,
                'explanation': 'The pattern cycles through shapes (Circle, Square) and sizes (Small, Medium, Large). Next is Large Square.'
            },
            {
                'question_text': 'What is the next number?\n\n5, 10, 20, 40, ?',
                'options': [
                    {'option_id': 'A', 'text': '60'},
                    {'option_id': 'B', 'text': '70'},
                    {'option_id': 'C', 'text': '80'},
                    {'option_id': 'D', 'text': '90'},
                    {'option_id': 'E', 'text': '100'}
                ],
                'correct_answer': 'C',
                'difficulty_level': 'easy',
                'complexity_score': 1,
                'explanation': 'Each number is double the previous: 5×2=10, 10×2=20, 20×2=40, 40×2=80.'
            },
            {
                'question_text': 'Complete the pattern:\n\n[Red] → [Blue] → [Green] → [Red] → [Blue] → ?',
                'options': [
                    {'option_id': 'A', 'text': 'Green'},
                    {'option_id': 'B', 'text': 'Yellow'},
                    {'option_id': 'C', 'text': 'Red'},
                    {'option_id': 'D', 'text': 'Blue'},
                    {'option_id': 'E', 'text': 'Purple'}
                ],
                'correct_answer': 'A',
                'difficulty_level': 'easy',
                'complexity_score': 1,
                'explanation': 'The pattern cycles through Red, Blue, Green. After Blue comes Green.'
            },
            {
                'question_text': 'What comes next?\n\n2, 5, 8, 11, 14, ?',
                'options': [
                    {'option_id': 'A', 'text': '16'},
                    {'option_id': 'B', 'text': '17'},
                    {'option_id': 'C', 'text': '18'},
                    {'option_id': 'D', 'text': '19'},
                    {'option_id': 'E', 'text': '20'}
                ],
                'correct_answer': 'B',
                'difficulty_level': 'easy',
                'complexity_score': 1,
                'explanation': 'The pattern increases by 3 each time: +3, +3, +3, +3. So 14 + 3 = 17.'
            },

            # MEDIUM QUESTIONS (11-20)
            {
                'question_text': 'Which figure completes the pattern?\n\n[Circle with 1 dot] → [Square with 2 dots] → [Triangle with 3 dots] → [Circle with 4 dots] → ?',
                'options': [
                    {'option_id': 'A', 'text': 'Square with 5 dots'},
                    {'option_id': 'B', 'text': 'Triangle with 4 dots'},
                    {'option_id': 'C', 'text': 'Circle with 5 dots'},
                    {'option_id': 'D', 'text': 'Square with 3 dots'},
                    {'option_id': 'E', 'text': 'Triangle with 5 dots'}
                ],
                'correct_answer': 'A',
                'difficulty_level': 'medium',
                'complexity_score': 2,
                'explanation': 'The pattern cycles through shapes (Circle, Square, Triangle) and increases dots by 1 each time. Next is Square with 5 dots.'
            },
            {
                'question_text': 'What is the next number in the sequence?\n\n1, 4, 9, 16, 25, ?',
                'options': [
                    {'option_id': 'A', 'text': '30'},
                    {'option_id': 'B', 'text': '36'},
                    {'option_id': 'C', 'text': '40'},
                    {'option_id': 'D', 'text': '45'},
                    {'option_id': 'E', 'text': '49'}
                ],
                'correct_answer': 'B',
                'difficulty_level': 'medium',
                'complexity_score': 2,
                'explanation': 'These are perfect squares: 1²=1, 2²=4, 3²=9, 4²=16, 5²=25, 6²=36.'
            },
            {
                'question_text': 'Complete the pattern:\n\n[Small Red Circle] → [Medium Blue Square] → [Large Green Triangle] → [Small Blue Circle] → ?',
                'options': [
                    {'option_id': 'A', 'text': 'Medium Green Square'},
                    {'option_id': 'B', 'text': 'Large Red Triangle'},
                    {'option_id': 'C', 'text': 'Small Green Circle'},
                    {'option_id': 'D', 'text': 'Medium Red Square'},
                    {'option_id': 'E', 'text': 'Large Blue Triangle'}
                ],
                'correct_answer': 'A',
                'difficulty_level': 'medium',
                'complexity_score': 2,
                'explanation': 'The pattern cycles through sizes (Small, Medium, Large), colors (Red, Blue, Green), and shapes (Circle, Square, Triangle). Next is Medium Green Square.'
            },
            {
                'question_text': 'What comes next in the sequence?\n\n2, 6, 12, 20, 30, ?',
                'options': [
                    {'option_id': 'A', 'text': '40'},
                    {'option_id': 'B', 'text': '42'},
                    {'option_id': 'C', 'text': '44'},
                    {'option_id': 'D', 'text': '48'},
                    {'option_id': 'E', 'text': '50'}
                ],
                'correct_answer': 'B',
                'difficulty_level': 'medium',
                'complexity_score': 2,
                'explanation': 'The pattern is n(n+1): 1×2=2, 2×3=6, 3×4=12, 4×5=20, 5×6=30, 6×7=42.'
            },
            {
                'question_text': 'Which figure completes the series?\n\n[Circle] → [Square] → [Triangle] → [Diamond] → [Circle] → ?',
                'options': [
                    {'option_id': 'A', 'text': 'Square'},
                    {'option_id': 'B', 'text': 'Triangle'},
                    {'option_id': 'C', 'text': 'Diamond'},
                    {'option_id': 'D', 'text': 'Hexagon'},
                    {'option_id': 'E', 'text': 'Star'}
                ],
                'correct_answer': 'A',
                'difficulty_level': 'medium',
                'complexity_score': 2,
                'explanation': 'The pattern cycles through Circle, Square, Triangle, Diamond. After Circle comes Square.'
            },
            {
                'question_text': 'What is the next number?\n\n1, 1, 2, 3, 5, 8, 13, ?',
                'options': [
                    {'option_id': 'A', 'text': '18'},
                    {'option_id': 'B', 'text': '19'},
                    {'option_id': 'C', 'text': '20'},
                    {'option_id': 'D', 'text': '21'},
                    {'option_id': 'E', 'text': '22'}
                ],
                'correct_answer': 'D',
                'difficulty_level': 'medium',
                'complexity_score': 2,
                'explanation': 'This is the Fibonacci sequence where each number is the sum of the two preceding ones: 8 + 13 = 21.'
            },
            {
                'question_text': 'Complete the pattern:\n\n[Red Circle] → [Blue Square] → [Green Triangle] → [Yellow Diamond] → [Red Circle] → ?',
                'options': [
                    {'option_id': 'A', 'text': 'Blue Square'},
                    {'option_id': 'B', 'text': 'Green Triangle'},
                    {'option_id': 'C', 'text': 'Yellow Diamond'},
                    {'option_id': 'D', 'text': 'Purple Circle'},
                    {'option_id': 'E', 'text': 'Orange Square'}
                ],
                'correct_answer': 'A',
                'difficulty_level': 'medium',
                'complexity_score': 2,
                'explanation': 'The pattern cycles through Red Circle, Blue Square, Green Triangle, Yellow Diamond. After Red Circle comes Blue Square.'
            },
            {
                'question_text': 'What comes next?\n\n3, 7, 15, 31, 63, ?',
                'options': [
                    {'option_id': 'A', 'text': '125'},
                    {'option_id': 'B', 'text': '127'},
                    {'option_id': 'C', 'text': '129'},
                    {'option_id': 'D', 'text': '131'},
                    {'option_id': 'E', 'text': '135'}
                ],
                'correct_answer': 'B',
                'difficulty_level': 'medium',
                'complexity_score': 2,
                'explanation': 'The pattern is 2^n - 1: 2²-1=3, 2³-1=7, 2⁴-1=15, 2⁵-1=31, 2⁶-1=63, 2⁷-1=127.'
            },
            {
                'question_text': 'Which figure completes the sequence?\n\n[Small] → [Medium] → [Large] → [Small] → [Medium] → ?',
                'options': [
                    {'option_id': 'A', 'text': 'Large'},
                    {'option_id': 'B', 'text': 'Small'},
                    {'option_id': 'C', 'text': 'Medium'},
                    {'option_id': 'D', 'text': 'Extra Large'},
                    {'option_id': 'E', 'text': 'Tiny'}
                ],
                'correct_answer': 'A',
                'difficulty_level': 'medium',
                'complexity_score': 2,
                'explanation': 'The pattern cycles through Small, Medium, Large. After Medium comes Large.'
            },
            {
                'question_text': 'What is the next number in the sequence?\n\n1, 8, 27, 64, 125, ?',
                'options': [
                    {'option_id': 'A', 'text': '200'},
                    {'option_id': 'B', 'text': '216'},
                    {'option_id': 'C', 'text': '225'},
                    {'option_id': 'D', 'text': '250'},
                    {'option_id': 'E', 'text': '300'}
                ],
                'correct_answer': 'B',
                'difficulty_level': 'medium',
                'complexity_score': 2,
                'explanation': 'These are perfect cubes: 1³=1, 2³=8, 3³=27, 4³=64, 5³=125, 6³=216.'
            },

            # HARD QUESTIONS (21-30)
            {
                'question_text': 'Which figure completes the complex pattern?\n\n[Red Circle with 1 dot] → [Blue Square with 2 dots] → [Green Triangle with 3 dots] → [Yellow Diamond with 4 dots] → [Red Circle with 5 dots] → ?',
                'options': [
                    {'option_id': 'A', 'text': 'Blue Square with 6 dots'},
                    {'option_id': 'B', 'text': 'Green Triangle with 5 dots'},
                    {'option_id': 'C', 'text': 'Yellow Diamond with 6 dots'},
                    {'option_id': 'D', 'text': 'Purple Circle with 6 dots'},
                    {'option_id': 'E', 'text': 'Orange Square with 5 dots'}
                ],
                'correct_answer': 'A',
                'difficulty_level': 'hard',
                'complexity_score': 3,
                'explanation': 'The pattern cycles through colors (Red, Blue, Green, Yellow), shapes (Circle, Square, Triangle, Diamond), and increases dots by 1. Next is Blue Square with 6 dots.'
            },
            {
                'question_text': 'What is the next number in the complex sequence?\n\n1, 2, 6, 24, 120, ?',
                'options': [
                    {'option_id': 'A', 'text': '600'},
                    {'option_id': 'B', 'text': '720'},
                    {'option_id': 'C', 'text': '840'},
                    {'option_id': 'D', 'text': '960'},
                    {'option_id': 'E', 'text': '1080'}
                ],
                'correct_answer': 'B',
                'difficulty_level': 'hard',
                'complexity_score': 3,
                'explanation': 'This is the factorial sequence: 1! = 1, 2! = 2, 3! = 6, 4! = 24, 5! = 120, 6! = 720.'
            },
            {
                'question_text': 'Complete the complex pattern:\n\n[Small Red Circle] → [Medium Blue Square] → [Large Green Triangle] → [Small Yellow Diamond] → [Medium Red Circle] → ?',
                'options': [
                    {'option_id': 'A', 'text': 'Large Blue Square'},
                    {'option_id': 'B', 'text': 'Small Green Triangle'},
                    {'option_id': 'C', 'text': 'Medium Yellow Diamond'},
                    {'option_id': 'D', 'text': 'Large Red Circle'},
                    {'option_id': 'E', 'text': 'Small Blue Square'}
                ],
                'correct_answer': 'A',
                'difficulty_level': 'hard',
                'complexity_score': 3,
                'explanation': 'The pattern cycles through sizes (Small, Medium, Large), colors (Red, Blue, Green, Yellow), and shapes (Circle, Square, Triangle, Diamond). Next is Large Blue Square.'
            },
            {
                'question_text': 'What comes next in the sequence?\n\n2, 3, 5, 7, 11, 13, 17, ?',
                'options': [
                    {'option_id': 'A', 'text': '19'},
                    {'option_id': 'B', 'text': '21'},
                    {'option_id': 'C', 'text': '23'},
                    {'option_id': 'D', 'text': '25'},
                    {'option_id': 'E', 'text': '27'}
                ],
                'correct_answer': 'A',
                'difficulty_level': 'hard',
                'complexity_score': 3,
                'explanation': 'This is the sequence of prime numbers: 2, 3, 5, 7, 11, 13, 17, 19.'
            },
            {
                'question_text': 'Which figure completes the complex series?\n\n[Circle with 1 dot] → [Square with 4 dots] → [Triangle with 9 dots] → [Diamond with 16 dots] → [Circle with 25 dots] → ?',
                'options': [
                    {'option_id': 'A', 'text': 'Square with 36 dots'},
                    {'option_id': 'B', 'text': 'Triangle with 25 dots'},
                    {'option_id': 'C', 'text': 'Diamond with 36 dots'},
                    {'option_id': 'D', 'text': 'Circle with 36 dots'},
                    {'option_id': 'E', 'text': 'Square with 25 dots'}
                ],
                'correct_answer': 'A',
                'difficulty_level': 'hard',
                'complexity_score': 3,
                'explanation': 'The pattern cycles through shapes (Circle, Square, Triangle, Diamond) and uses perfect squares for dots: 1²=1, 2²=4, 3²=9, 4²=16, 5²=25, 6²=36. Next is Square with 36 dots.'
            },
            {
                'question_text': 'What is the next number?\n\n1, 4, 10, 20, 35, 56, ?',
                'options': [
                    {'option_id': 'A', 'text': '70'},
                    {'option_id': 'B', 'text': '84'},
                    {'option_id': 'C', 'text': '90'},
                    {'option_id': 'D', 'text': '100'},
                    {'option_id': 'E', 'text': '120'}
                ],
                'correct_answer': 'B',
                'difficulty_level': 'hard',
                'complexity_score': 3,
                'explanation': 'This is the tetrahedral numbers sequence: n(n+1)(n+2)/6. For n=7: 7×8×9/6 = 84.'
            },
            {
                'question_text': 'Complete the complex pattern:\n\n[Red Circle] → [Blue Square] → [Green Triangle] → [Yellow Diamond] → [Purple Circle] → [Orange Square] → ?',
                'options': [
                    {'option_id': 'A', 'text': 'Pink Triangle'},
                    {'option_id': 'B', 'text': 'Cyan Diamond'},
                    {'option_id': 'C', 'text': 'Lime Circle'},
                    {'option_id': 'D', 'text': 'Brown Square'},
                    {'option_id': 'E', 'text': 'Gray Triangle'}
                ],
                'correct_answer': 'A',
                'difficulty_level': 'hard',
                'complexity_score': 3,
                'explanation': 'The pattern cycles through colors (Red, Blue, Green, Yellow, Purple, Orange) and shapes (Circle, Square, Triangle, Diamond). Next is Pink Triangle.'
            },
            {
                'question_text': 'What comes next in the sequence?\n\n1, 3, 7, 15, 31, 63, ?',
                'options': [
                    {'option_id': 'A', 'text': '125'},
                    {'option_id': 'B', 'text': '127'},
                    {'option_id': 'C', 'text': '129'},
                    {'option_id': 'D', 'text': '131'},
                    {'option_id': 'E', 'text': '135'}
                ],
                'correct_answer': 'B',
                'difficulty_level': 'hard',
                'complexity_score': 3,
                'explanation': 'The pattern is 2^n - 1: 2¹-1=1, 2²-1=3, 2³-1=7, 2⁴-1=15, 2⁵-1=31, 2⁶-1=63, 2⁷-1=127.'
            },
            {
                'question_text': 'Which figure completes the complex sequence?\n\n[Small Red Circle with 1 dot] → [Medium Blue Square with 2 dots] → [Large Green Triangle with 3 dots] → [Small Yellow Diamond with 4 dots] → [Medium Red Circle with 5 dots] → ?',
                'options': [
                    {'option_id': 'A', 'text': 'Large Blue Square with 6 dots'},
                    {'option_id': 'B', 'text': 'Small Green Triangle with 6 dots'},
                    {'option_id': 'C', 'text': 'Medium Yellow Diamond with 6 dots'},
                    {'option_id': 'D', 'text': 'Large Red Circle with 6 dots'},
                    {'option_id': 'E', 'text': 'Small Blue Square with 5 dots'}
                ],
                'correct_answer': 'A',
                'difficulty_level': 'hard',
                'complexity_score': 3,
                'explanation': 'The pattern cycles through sizes (Small, Medium, Large), colors (Red, Blue, Green, Yellow), shapes (Circle, Square, Triangle, Diamond), and increases dots by 1. Next is Large Blue Square with 6 dots.'
            },
            {
                'question_text': 'What is the next number in the complex sequence?\n\n1, 1, 2, 4, 7, 13, 24, ?',
                'options': [
                    {'option_id': 'A', 'text': '44'},
                    {'option_id': 'B', 'text': '45'},
                    {'option_id': 'C', 'text': '46'},
                    {'option_id': 'D', 'text': '47'},
                    {'option_id': 'E', 'text': '48'}
                ],
                'correct_answer': 'A',
                'difficulty_level': 'hard',
                'complexity_score': 3,
                'explanation': 'This is the Tribonacci sequence where each number is the sum of the three preceding ones: 7 + 13 + 24 = 44.'
            }
        ]
