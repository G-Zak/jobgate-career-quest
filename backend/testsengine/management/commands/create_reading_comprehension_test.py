from django.core.management.base import BaseCommand
from django.db import transaction
from testsengine.models import Test, Question

class Command(BaseCommand):
    help = 'Creates a reading comprehension test with 20 questions for VRT1'

    def handle(self, *args, **options):
        # Create or get the reading comprehension test
        test, created = Test.objects.get_or_create(
            id=1,  # Use ID 1 for VRT1
            defaults={
                'title': 'Reading Comprehension Test',
                'description': 'Test your reading comprehension and verbal reasoning skills',
                'duration_minutes': 20,
                'total_questions': 20,
                'is_active': True
            }
        )
        
        if created:
            self.stdout.write(f'Created new test: {test.title}')
        else:
            self.stdout.write(f'Using existing test: {test.title}')
            # Clear existing questions
            Question.objects.filter(test_id=test.id).delete()
            self.stdout.write('Cleared existing questions')

        # Reading comprehension passages and questions
        passages_and_questions = [
            {
                'passage': '''The Industrial Revolution was a period of major industrialization and innovation during the late 18th and early 19th centuries. The Industrial Revolution began in Great Britain and quickly spread throughout the world. The American Industrial Revolution commonly referred to as the Second Industrial Revolution, started sometime between 1820 and 1870. This period saw the mechanization of agriculture and textile manufacturing and a revolution in power, including steam ships and railroads, that affected social, cultural and economic conditions.''',
                'questions': [
                    {
                        'question': 'When did the Industrial Revolution begin?',
                        'options': ['Late 17th century', 'Late 18th century', 'Early 19th century', 'Mid 19th century'],
                        'correct': 'B'
                    },
                    {
                        'question': 'Where did the Industrial Revolution start?',
                        'options': ['United States', 'France', 'Great Britain', 'Germany'],
                        'correct': 'C'
                    },
                    {
                        'question': 'What was mechanized during this period?',
                        'options': ['Transportation only', 'Agriculture and textiles', 'Mining only', 'All industries'],
                        'correct': 'B'
                    }
                ]
            },
            {
                'passage': '''Climate change refers to long-term shifts in global temperatures and weather patterns. While climate variations are natural, since the 1800s human activities have been the main driver of climate change, primarily due to burning fossil fuels like coal, oil and gas. Burning fossil fuels generates greenhouse gas emissions that act like a blanket wrapped around the Earth, trapping the sun's heat and raising temperatures.''',
                'questions': [
                    {
                        'question': 'What is the main cause of climate change since the 1800s?',
                        'options': ['Natural variations', 'Human activities', 'Solar activity', 'Volcanic eruptions'],
                        'correct': 'B'
                    },
                    {
                        'question': 'What do greenhouse gas emissions act like?',
                        'options': ['A shield', 'A blanket', 'A filter', 'A mirror'],
                        'correct': 'B'
                    },
                    {
                        'question': 'What happens when greenhouse gases trap heat?',
                        'options': ['Temperatures drop', 'Temperatures rise', 'Weather stabilizes', 'Rain increases'],
                        'correct': 'B'
                    }
                ]
            },
            {
                'passage': '''Artificial Intelligence (AI) is intelligence demonstrated by machines, in contrast to the natural intelligence displayed by humans. Leading AI textbooks define the field as the study of "intelligent agents": any device that perceives its environment and takes actions that maximize its chance of successfully achieving its goals. The term "artificial intelligence" is often used to describe machines that mimic "cognitive" functions that humans associate with the human mind, such as "learning" and "problem solving".''',
                'questions': [
                    {
                        'question': 'What is artificial intelligence?',
                        'options': ['Human intelligence', 'Machine intelligence', 'Natural intelligence', 'Animal intelligence'],
                        'correct': 'B'
                    },
                    {
                        'question': 'What do AI agents do?',
                        'options': ['Only perceive', 'Only act', 'Perceive and act to achieve goals', 'Only learn'],
                        'correct': 'C'
                    },
                    {
                        'question': 'What cognitive functions do AI machines mimic?',
                        'options': ['Only learning', 'Only problem solving', 'Learning and problem solving', 'All human functions'],
                        'correct': 'C'
                    }
                ]
            },
            {
                'passage': '''The human brain is the command center for the human nervous system. It receives signals from the body's sensory organs and outputs information to the muscles. The human brain has the same basic structure as other mammal brains but is larger in relation to body size than any other brains. The brain consists of the cerebrum, the brainstem, and the cerebellum. It controls most of the activities of the body, processing, integrating, and coordinating the information it receives from the sense organs.''',
                'questions': [
                    {
                        'question': 'What is the brain\'s role in the nervous system?',
                        'options': ['Support center', 'Command center', 'Storage center', 'Processing center only'],
                        'correct': 'B'
                    },
                    {
                        'question': 'How does the human brain compare to other mammal brains?',
                        'options': ['Smaller', 'Same size', 'Larger relative to body size', 'More complex structure'],
                        'correct': 'C'
                    },
                    {
                        'question': 'What are the main parts of the brain?',
                        'options': ['Cerebrum only', 'Cerebrum and brainstem', 'Cerebrum, brainstem, and cerebellum', 'Cerebellum only'],
                        'correct': 'C'
                    }
                ]
            },
            {
                'passage': '''Renewable energy is energy from sources that are naturally replenishing but flow-limited. Renewable resources are virtually inexhaustible in duration but limited in the amount of energy that is available per unit of time. The major types of renewable energy sources are biomass, geothermal resources, sunlight, water, and wind. These energy sources are called renewable because they are naturally replenished on a human timescale.''',
                'questions': [
                    {
                        'question': 'What characterizes renewable energy sources?',
                        'options': ['Naturally replenishing', 'Unlimited in amount', 'Always available', 'Cheap to produce'],
                        'correct': 'A'
                    },
                    {
                        'question': 'What is the limitation of renewable resources?',
                        'options': ['Duration', 'Amount available per unit of time', 'Cost', 'Technology'],
                        'correct': 'B'
                    },
                    {
                        'question': 'Why are these sources called renewable?',
                        'options': ['They are cheap', 'They are clean', 'They are naturally replenished', 'They are efficient'],
                        'correct': 'C'
                    }
                ]
            },
            {
                'passage': '''The concept of sustainable development was introduced in the 1987 Brundtland Report, which defined it as "development that meets the needs of the present without compromising the ability of future generations to meet their own needs." This definition emphasizes the importance of balancing economic growth, social equity, and environmental protection. Sustainable development requires thinking about the long-term consequences of our actions and making decisions that consider both present and future needs.''',
                'questions': [
                    {
                        'question': 'When was the concept of sustainable development introduced?',
                        'options': ['1985', '1987', '1990', '1992'],
                        'correct': 'B'
                    },
                    {
                        'question': 'What does sustainable development balance?',
                        'options': ['Only economic growth', 'Economic growth and social equity', 'Economic growth, social equity, and environmental protection', 'Only environmental protection'],
                        'correct': 'C'
                    },
                    {
                        'question': 'What does sustainable development require?',
                        'options': ['Short-term thinking', 'Long-term thinking', 'Present-only focus', 'Past analysis'],
                        'correct': 'B'
                    }
                ]
            },
            {
                'passage': '''The Internet is a global network of interconnected computers that communicate using standardized protocols. It was originally developed in the late 1960s as a way for researchers to share information. Today, the Internet has become an essential part of modern life, enabling communication, commerce, education, and entertainment on a global scale. The World Wide Web, which runs on top of the Internet, has made information accessible to billions of people worldwide.''',
                'questions': [
                    {
                        'question': 'What is the Internet?',
                        'options': ['A single computer', 'A global network of computers', 'A software program', 'A type of cable'],
                        'correct': 'B'
                    },
                    {
                        'question': 'When was the Internet originally developed?',
                        'options': ['1950s', 'Late 1960s', '1970s', '1980s'],
                        'correct': 'B'
                    },
                    {
                        'question': 'What runs on top of the Internet?',
                        'options': ['Email only', 'The World Wide Web', 'Social media only', 'Video games'],
                        'correct': 'B'
                    }
                ]
            }
        ]

        # Create questions
        question_count = 0
        with transaction.atomic():
            for passage_data in passages_and_questions:
                passage_text = passage_data['passage']
                for i, q_data in enumerate(passage_data['questions']):
                    question_count += 1
                    Question.objects.create(
                        test_id=test.id,
                        question_type='reading_comprehension',
                        question_text=q_data['question'],
                        passage=passage_text,
                        options=q_data['options'],
                        correct_answer=q_data['correct'],
                        difficulty_level='medium',
                        order=question_count
                    )
                    if question_count >= 20:
                        break
                if question_count >= 20:
                    break

        self.stdout.write(self.style.SUCCESS(f'Successfully created {question_count} reading comprehension questions for VRT1!'))
        self.stdout.write(f'Test ID: {test.id}')
        self.stdout.write(f'Duration: {test.duration_minutes} minutes')
        self.stdout.write(f'Total questions: {question_count}')
