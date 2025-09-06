from django.core.management.base import BaseCommand
from testsengine.models import Test, Question

class Command(BaseCommand):
    help = 'Create Verbal Reasoning Assessment test with sample questions'

    def handle(self, *args, **options):
        # Create or get the Verbal Reasoning Test
        test, created = Test.objects.get_or_create(
            title="Verbal Reasoning Assessment",
            test_type="verbal_reasoning",
            defaults={
                'description': 'Assess candidate\'s ability to understand, analyze, and draw conclusions from written information.',
                'duration_minutes': 25,
                'total_questions': 28,
                'passing_score': 70
            }
        )
        
        if created:
            self.stdout.write(
                self.style.SUCCESS(f'Successfully created test: {test.title}')
            )
        else:
            self.stdout.write(
                self.style.WARNING(f'Test already exists: {test.title}')
            )

        # Clear existing questions for this test
        Question.objects.filter(test=test).delete()

        # Reading Comprehension Questions
        reading_passages = [
            {
                'passage': '''Climate change represents one of the most significant challenges facing humanity in the 21st century. The scientific consensus is clear: human activities, particularly the burning of fossil fuels, are the primary drivers of global warming. Rising temperatures have led to melting ice caps, rising sea levels, and increasingly frequent extreme weather events. However, the response to this crisis has been mixed. While some nations have implemented ambitious renewable energy programs and carbon reduction targets, others continue to prioritize short-term economic gains over long-term environmental sustainability. The transition to clean energy requires substantial investment in new technologies, infrastructure, and workforce retraining. Critics argue that the economic costs are too high, while proponents emphasize that the cost of inaction far exceeds the investment required for mitigation.''',
                'questions': [
                    {
                        'question_text': 'According to the passage, what is the primary cause of global warming?',
                        'options': ['Natural climate cycles', 'Human activities, especially burning fossil fuels', 'Solar radiation changes', 'Volcanic eruptions'],
                        'correct_answer': 'B'
                    },
                    {
                        'question_text': 'The passage suggests that the global response to climate change has been:',
                        'options': ['Uniformly positive', 'Completely inadequate', 'Mixed and inconsistent', 'Primarily focused on technology'],
                        'correct_answer': 'C'
                    },
                    {
                        'question_text': 'What do proponents of climate action argue about the costs?',
                        'options': ['Costs are manageable with proper planning', 'The cost of inaction exceeds mitigation investment', 'Economic benefits outweigh environmental concerns', 'Costs should be shared equally among nations'],
                        'correct_answer': 'B'
                    }
                ]
            },
            {
                'passage': '''The rise of artificial intelligence in the workplace has sparked intense debate about the future of employment. Automation has the potential to eliminate millions of jobs across various sectors, from manufacturing to customer service. However, history suggests that technological advancement, while displacing certain roles, also creates new opportunities. The Industrial Revolution, for instance, eliminated agricultural jobs but gave rise to factory work and eventually service industries. Similarly, the digital revolution destroyed some traditional roles while creating entirely new career paths in technology, digital marketing, and e-commerce. The key challenge lies not in preventing technological progress, but in ensuring that workers have the skills and training necessary to adapt to changing economic conditions. Education systems and employers must collaborate to provide continuous learning opportunities and reskilling programs.''',
                'questions': [
                    {
                        'question_text': 'What historical example does the passage use to illustrate technological job displacement?',
                        'options': ['The Digital Revolution', 'The Industrial Revolution', 'The Information Age', 'The Space Race'],
                        'correct_answer': 'B'
                    },
                    {
                        'question_text': 'According to the passage, what is the key challenge regarding AI and employment?',
                        'options': ['Preventing technological advancement', 'Eliminating all automation', 'Ensuring worker adaptation through skills training', 'Maintaining traditional job roles'],
                        'correct_answer': 'C'
                    }
                ]
            }
        ]

        # Vocabulary in Context Questions
        vocabulary_questions = [
            {
                'question_text': 'In the sentence "The politician\'s rhetoric was so persuasive that it swayed even the most skeptical voters," the word "rhetoric" most nearly means:',
                'options': ['Dishonesty', 'Speaking style or persuasive language', 'Political position', 'Personal charm'],
                'correct_answer': 'B'
            },
            {
                'question_text': 'In the context "The company decided to diversify its portfolio to mitigate risk," the word "mitigate" means:',
                'options': ['Increase', 'Eliminate', 'Reduce or lessen', 'Transfer'],
                'correct_answer': 'C'
            },
            {
                'question_text': 'The phrase "unprecedented economic growth" suggests that the growth is:',
                'options': ['Temporary', 'Without previous example', 'Declining', 'Predicted'],
                'correct_answer': 'B'
            }
        ]

        # Logical Deduction Questions
        logical_questions = [
            {
                'question_text': '''All successful entrepreneurs are risk-takers. Maria is a successful entrepreneur. Therefore:''',
                'options': ['Maria might be a risk-taker', 'Maria is definitely a risk-taker', 'Maria is not a risk-taker', 'We cannot determine if Maria is a risk-taker'],
                'correct_answer': 'B'
            },
            {
                'question_text': '''If it rains, the picnic will be cancelled. The picnic was not cancelled. What can we conclude?''',
                'options': ['It rained', 'It did not rain', 'The weather was uncertain', 'The picnic was postponed'],
                'correct_answer': 'B'
            }
        ]

        # Critical Reasoning Questions
        critical_questions = [
            {
                'question_text': '''A study shows that students who eat breakfast perform better on tests. The school board concludes that providing free breakfast will improve all students\' test scores. What is the main flaw in this reasoning?''',
                'options': ['The sample size was too small', 'Correlation does not imply causation', 'The study was biased', 'Free breakfast is too expensive'],
                'correct_answer': 'B'
            },
            {
                'question_text': '''A company claims their new software increases productivity by 40%. Which additional information would be most important to evaluate this claim?''',
                'options': ['The cost of the software', 'How productivity was measured and compared', 'The size of the company', 'The number of users'],
                'correct_answer': 'B'
            }
        ]

        # Analogies Questions
        analogy_questions = [
            {
                'question_text': 'Book is to Author as Painting is to:',
                'options': ['Canvas', 'Artist', 'Frame', 'Gallery'],
                'correct_answer': 'B'
            },
            {
                'question_text': 'Telescope is to Astronomer as Microscope is to:',
                'options': ['Laboratory', 'Biologist', 'Specimen', 'Lens'],
                'correct_answer': 'B'
            },
            {
                'question_text': 'Democracy is to Vote as Monarchy is to:',
                'options': ['Crown', 'Rule', 'Decree', 'Palace'],
                'correct_answer': 'C'
            }
        ]

        # Create questions
        question_order = 1

        # Add reading comprehension questions
        for passage_data in reading_passages:
            for q in passage_data['questions']:
                Question.objects.create(
                    test=test,
                    question_type='reading_comprehension',
                    question_text=q['question_text'],
                    passage=passage_data['passage'],
                    options=q['options'],
                    correct_answer=q['correct_answer'],
                    difficulty_level='medium',
                    order=question_order
                )
                question_order += 1

        # Add vocabulary questions
        for q in vocabulary_questions:
            Question.objects.create(
                test=test,
                question_type='vocabulary',
                question_text=q['question_text'],
                options=q['options'],
                correct_answer=q['correct_answer'],
                difficulty_level='medium',
                order=question_order
            )
            question_order += 1

        # Add logical deduction questions
        for q in logical_questions:
            Question.objects.create(
                test=test,
                question_type='logical_deduction',
                question_text=q['question_text'],
                options=q['options'],
                correct_answer=q['correct_answer'],
                difficulty_level='medium',
                order=question_order
            )
            question_order += 1

        # Add critical reasoning questions
        for q in critical_questions:
            Question.objects.create(
                test=test,
                question_type='critical_reasoning',
                question_text=q['question_text'],
                options=q['options'],
                correct_answer=q['correct_answer'],
                difficulty_level='hard',
                order=question_order
            )
            question_order += 1

        # Add analogy questions
        for q in analogy_questions:
            Question.objects.create(
                test=test,
                question_type='analogies',
                question_text=q['question_text'],
                options=q['options'],
                correct_answer=q['correct_answer'],
                difficulty_level='easy',
                order=question_order
            )
            question_order += 1

        # Add more questions to reach 28 total
        additional_vocabulary = [
            {
                'question_text': 'In the sentence "The witness gave an ambiguous statement," ambiguous means:',
                'options': ['Clear and direct', 'Open to multiple interpretations', 'Truthful', 'Brief'],
                'correct_answer': 'B'
            },
            {
                'question_text': 'A "meticulous" person is:',
                'options': ['Careless', 'Very careful and precise', 'Impatient', 'Generous'],
                'correct_answer': 'B'
            },
            {
                'question_text': 'To "collaborate" means to:',
                'options': ['Work alone', 'Work together', 'Compete', 'Supervise'],
                'correct_answer': 'B'
            },
            {
                'question_text': 'An "innovative" approach is:',
                'options': ['Traditional', 'New and creative', 'Expensive', 'Simple'],
                'correct_answer': 'B'
            },
            {
                'question_text': 'To "consolidate" means to:',
                'options': ['Separate', 'Combine or strengthen', 'Weaken', 'Ignore'],
                'correct_answer': 'B'
            },
            {
                'question_text': 'A "pragmatic" solution is:',
                'options': ['Theoretical', 'Practical and realistic', 'Expensive', 'Temporary'],
                'correct_answer': 'B'
            },
            {
                'question_text': 'To "substantiate" a claim means to:',
                'options': ['Deny it', 'Support it with evidence', 'Question it', 'Ignore it'],
                'correct_answer': 'B'
            },
            {
                'question_text': 'An "arbitrary" decision is:',
                'options': ['Well-reasoned', 'Based on random choice rather than system', 'Democratic', 'Unanimous'],
                'correct_answer': 'B'
            },
            {
                'question_text': 'To "extrapolate" means to:',
                'options': ['Summarize', 'Estimate based on known information', 'Ignore data', 'Collect information'],
                'correct_answer': 'B'
            },
            {
                'question_text': 'A "comprehensive" report is:',
                'options': ['Brief', 'Complete and thorough', 'Confusing', 'Preliminary'],
                'correct_answer': 'B'
            },
            {
                'question_text': 'To "scrutinize" means to:',
                'options': ['Ignore', 'Examine closely', 'Approve quickly', 'Summarize'],
                'correct_answer': 'B'
            },
            {
                'question_text': 'An "implicit" message is:',
                'options': ['Clearly stated', 'Suggested but not directly expressed', 'Shouted', 'Written'],
                'correct_answer': 'B'
            },
            {
                'question_text': 'Capacity is to Volume as:',
                'options': ['Length is to Width', 'Speed is to Distance', 'Weight is to Mass', 'Time is to Duration'],
                'correct_answer': 'C'
            }
        ]

        for q in additional_vocabulary:
            Question.objects.create(
                test=test,
                question_type='vocabulary',
                question_text=q['question_text'],
                options=q['options'],
                correct_answer=q['correct_answer'],
                difficulty_level='medium',
                order=question_order
            )
            question_order += 1

        self.stdout.write(
            self.style.SUCCESS(f'Successfully created {question_order - 1} questions for Verbal Reasoning Assessment')
        )
