#!/usr/bin/env python3
"""
Django management command to create sample skill tests
"""

from django.core.management.base import BaseCommand
from django.db import transaction
from skills.models import Skill, TechnicalTest, TestQuestion
import json

class Command(BaseCommand):
    help = 'Create sample skill tests for profile evaluation'

    def handle(self, *args, **options):
        self.stdout.write('Creating sample skill tests...')
        
        with transaction.atomic():
            # Get or create skills
            skills_data = [
                {'name': 'Python', 'category': 'programming'},
                {'name': 'JavaScript', 'category': 'programming'},
                {'name': 'React', 'category': 'frontend'},
                {'name': 'Django', 'category': 'backend'},
                {'name': 'SQL', 'category': 'database'},
                {'name': 'Git', 'category': 'other'},
            ]
            
            skills = {}
            for skill_data in skills_data:
                skill, created = Skill.objects.get_or_create(
                    name=skill_data['name'],
                    defaults={'category': skill_data['category']}
                )
                skills[skill_data['name']] = skill
                if created:
                    self.stdout.write(f'Created skill: {skill.name}')
            
            # Create sample tests
            tests_data = [
                {
                    'skill_name': 'Python',
                    'test_name': 'Python Fundamentals Test',
                    'description': 'Test your Python programming fundamentals',
                    'instructions': 'Answer all questions. Each question has only one correct answer.',
                    'time_limit': 30,
                    'total_score': 100,
                    'questions': [
                        {
                            'question_text': 'What is the correct way to create a list in Python?',
                            'option_a': 'list = []',
                            'option_b': 'list = {}',
                            'option_c': 'list = ()',
                            'option_d': 'list = []',
                            'correct_answer': 'A',
                            'explanation': 'Lists in Python are created using square brackets [].'
                        },
                        {
                            'question_text': 'Which keyword is used to define a function in Python?',
                            'option_a': 'function',
                            'option_b': 'def',
                            'option_c': 'func',
                            'option_d': 'define',
                            'correct_answer': 'B',
                            'explanation': 'The "def" keyword is used to define functions in Python.'
                        },
                        {
                            'question_text': 'What does the len() function do?',
                            'option_a': 'Returns the length of a string or list',
                            'option_b': 'Returns the maximum value',
                            'option_c': 'Returns the minimum value',
                            'option_d': 'Returns the sum of elements',
                            'correct_answer': 'A',
                            'explanation': 'len() returns the number of items in an object.'
                        }
                    ]
                },
                {
                    'skill_name': 'JavaScript',
                    'test_name': 'JavaScript Essentials Test',
                    'description': 'Test your JavaScript programming knowledge',
                    'instructions': 'Answer all questions. Each question has only one correct answer.',
                    'time_limit': 25,
                    'total_score': 100,
                    'questions': [
                        {
                            'question_text': 'What is the correct way to declare a variable in JavaScript?',
                            'option_a': 'var name = "John"',
                            'option_b': 'variable name = "John"',
                            'option_c': 'v name = "John"',
                            'option_d': 'declare name = "John"',
                            'correct_answer': 'A',
                            'explanation': 'Variables in JavaScript are declared using var, let, or const.'
                        },
                        {
                            'question_text': 'Which method is used to add an element to the end of an array?',
                            'option_a': 'push()',
                            'option_b': 'add()',
                            'option_c': 'append()',
                            'option_d': 'insert()',
                            'correct_answer': 'A',
                            'explanation': 'push() adds one or more elements to the end of an array.'
                        }
                    ]
                },
                {
                    'skill_name': 'React',
                    'test_name': 'React Components Test',
                    'description': 'Test your React component knowledge',
                    'instructions': 'Answer all questions about React components and hooks.',
                    'time_limit': 20,
                    'total_score': 100,
                    'questions': [
                        {
                            'question_text': 'What is a React component?',
                            'option_a': 'A JavaScript function that returns HTML',
                            'option_b': 'A CSS class',
                            'option_c': 'A database table',
                            'option_d': 'A server-side function',
                            'correct_answer': 'A',
                            'explanation': 'React components are JavaScript functions that return HTML elements.'
                        },
                        {
                            'question_text': 'Which hook is used to manage state in functional components?',
                            'option_a': 'useState',
                            'option_b': 'useEffect',
                            'option_c': 'useContext',
                            'option_d': 'useReducer',
                            'correct_answer': 'A',
                            'explanation': 'useState is the hook used to manage state in functional components.'
                        }
                    ]
                },
                {
                    'skill_name': 'Django',
                    'test_name': 'Django Framework Test',
                    'description': 'Test your Django web framework knowledge',
                    'instructions': 'Answer questions about Django models, views, and templates.',
                    'time_limit': 35,
                    'total_score': 100,
                    'questions': [
                        {
                            'question_text': 'What is Django?',
                            'option_a': 'A Python web framework',
                            'option_b': 'A JavaScript library',
                            'option_c': 'A database system',
                            'option_d': 'A CSS framework',
                            'correct_answer': 'A',
                            'explanation': 'Django is a high-level Python web framework.'
                        },
                        {
                            'question_text': 'Which file contains Django URL patterns?',
                            'option_a': 'urls.py',
                            'option_b': 'views.py',
                            'option_c': 'models.py',
                            'option_d': 'settings.py',
                            'correct_answer': 'A',
                            'explanation': 'urls.py contains URL patterns in Django projects.'
                        }
                    ]
                },
                {
                    'skill_name': 'SQL',
                    'test_name': 'SQL Database Test',
                    'description': 'Test your SQL database query knowledge',
                    'instructions': 'Answer questions about SQL queries and database operations.',
                    'time_limit': 25,
                    'total_score': 100,
                    'questions': [
                        {
                            'question_text': 'Which SQL command is used to retrieve data?',
                            'option_a': 'SELECT',
                            'option_b': 'GET',
                            'option_c': 'FETCH',
                            'option_d': 'RETRIEVE',
                            'correct_answer': 'A',
                            'explanation': 'SELECT is used to retrieve data from a database.'
                        },
                        {
                            'question_text': 'What does WHERE clause do in SQL?',
                            'option_a': 'Filters records based on conditions',
                            'option_b': 'Groups records',
                            'option_c': 'Orders records',
                            'option_d': 'Joins tables',
                            'correct_answer': 'A',
                            'explanation': 'WHERE clause filters records based on specified conditions.'
                        }
                    ]
                },
                {
                    'skill_name': 'Git',
                    'test_name': 'Git Version Control Test',
                    'description': 'Test your Git version control knowledge',
                    'instructions': 'Answer questions about Git commands and workflows.',
                    'time_limit': 20,
                    'total_score': 100,
                    'questions': [
                        {
                            'question_text': 'Which command is used to stage files in Git?',
                            'option_a': 'git add',
                            'option_b': 'git stage',
                            'option_c': 'git commit',
                            'option_d': 'git push',
                            'correct_answer': 'A',
                            'explanation': 'git add is used to stage files for commit.'
                        },
                        {
                            'question_text': 'What does git commit do?',
                            'option_a': 'Saves changes to the local repository',
                            'option_b': 'Pushes changes to remote repository',
                            'option_c': 'Pulls changes from remote repository',
                            'option_d': 'Creates a new branch',
                            'correct_answer': 'A',
                            'explanation': 'git commit saves staged changes to the local repository.'
                        }
                    ]
                }
            ]
            
            for test_data in tests_data:
                skill = skills[test_data['skill_name']]
                
                # Create or update test
                test, created = TechnicalTest.objects.get_or_create(
                    test_name=test_data['test_name'],
                    skill=skill,
                    defaults={
                        'description': test_data['description'],
                        'instructions': test_data['instructions'],
                        'time_limit': test_data['time_limit'],
                        'total_score': test_data['total_score'],
                        'is_active': True
                    }
                )
                
                if created:
                    self.stdout.write(f'Created test: {test.test_name}')
                else:
                    self.stdout.write(f'Test already exists: {test.test_name}')
                
                # Create questions
                for i, question_data in enumerate(test_data['questions'], 1):
                    question, q_created = TestQuestion.objects.get_or_create(
                        test=test,
                        order=i,
                        defaults={
                            'question_text': question_data['question_text'],
                            'option_a': question_data['option_a'],
                            'option_b': question_data['option_b'],
                            'option_c': question_data['option_c'],
                            'option_d': question_data['option_d'],
                            'correct_answer': question_data['correct_answer'],
                            'explanation': question_data['explanation']
                        }
                    )
                    
                    if q_created:
                        self.stdout.write(f'  Created question {i}: {question.question_text[:50]}...')
        
        self.stdout.write(
            self.style.SUCCESS('Successfully created sample skill tests!')
        )

