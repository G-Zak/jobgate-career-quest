from django.core.management.base import BaseCommand
from django.db import transaction
from testsengine.models import Question

class Command(BaseCommand):
    help = 'Completes VRT1 question pool to 60 questions'

    def handle(self, *args, **options):
        self.stdout.write('📚 Completing VRT1 question pool to 60 questions...')
        
        current_count = Question.objects.filter(test_id=1).count()
        needed = 60 - current_count
        
        self.stdout.write(f'Current questions: {current_count}')
        self.stdout.write(f'Need to add: {needed} more questions')
        
        if needed <= 0:
            self.stdout.write('✅ VRT1 already has 60+ questions!')
            return
        
        with transaction.atomic():
            # Additional passages to reach 60 questions
            additional_passages = [
                {
                    'passage': 'The concept of mindfulness has gained widespread recognition as a powerful tool for mental health and well-being. Rooted in ancient meditation practices, mindfulness involves paying attention to the present moment without judgment. Research has shown that regular mindfulness practice can reduce stress, improve focus, and enhance emotional regulation. Many organizations have incorporated mindfulness programs into their workplace wellness initiatives, recognizing the benefits for employee productivity and job satisfaction. However, mindfulness is not a quick fix and requires consistent practice to yield meaningful results.',
                    'questions': [
                        {
                            'question_text': 'What is mindfulness?',
                            'options': ['A form of physical exercise', 'Paying attention to the present moment without judgment', 'A type of medication', 'A form of therapy only for mental illness'],
                            'correct_answer': 'B',
                            'difficulty': 'easy'
                        },
                        {
                            'question_text': 'What benefits has research shown for mindfulness practice?',
                            'options': ['Only improved focus', 'Reduced stress, improved focus, and enhanced emotional regulation', 'Only stress reduction', 'Only emotional regulation'],
                            'correct_answer': 'B',
                            'difficulty': 'medium'
                        },
                        {
                            'question_text': 'What does the passage say about mindfulness as a solution?',
                            'options': ['It provides immediate results', 'It is not a quick fix and requires consistent practice', 'It works without any practice', 'It only works for certain people'],
                            'correct_answer': 'B',
                            'difficulty': 'hard'
                        }
                    ]
                },
                {
                    'passage': 'The rise of e-commerce has fundamentally transformed retail landscapes worldwide, creating both opportunities and challenges for businesses. Online platforms enable companies to reach global markets with relatively low overhead costs, while consumers benefit from convenience and competitive pricing. However, this shift has led to the closure of many traditional brick-and-mortar stores, affecting local economies and employment. The integration of omnichannel strategies, combining online and offline experiences, has become crucial for retail success. Companies must adapt to changing consumer expectations while maintaining profitability in an increasingly competitive digital marketplace.',
                    'questions': [
                        {
                            'question_text': 'What has e-commerce fundamentally transformed?',
                            'options': ['Only consumer behavior', 'Retail landscapes worldwide', 'Only online platforms', 'Only pricing strategies'],
                            'correct_answer': 'B',
                            'difficulty': 'easy'
                        },
                        {
                            'question_text': 'What benefits do online platforms provide for companies?',
                            'options': ['Only lower costs', 'Reaching global markets with relatively low overhead costs', 'Only convenience', 'Only competitive pricing'],
                            'correct_answer': 'B',
                            'difficulty': 'medium'
                        },
                        {
                            'question_text': 'What has become crucial for retail success?',
                            'options': ['Only online presence', 'The integration of omnichannel strategies, combining online and offline experiences', 'Only offline stores', 'Only competitive pricing'],
                            'correct_answer': 'B',
                            'difficulty': 'hard'
                        }
                    ]
                },
                {
                    'passage': 'The concept of personalized medicine represents a paradigm shift from one-size-fits-all treatments to customized healthcare based on individual genetic profiles. Advances in genomics and biotechnology have enabled doctors to identify genetic predispositions to diseases and tailor treatments accordingly. This approach can improve treatment efficacy while reducing adverse side effects. However, personalized medicine raises concerns about genetic privacy, healthcare costs, and equitable access to advanced treatments. The ethical implications of genetic testing and data sharing continue to challenge the medical community and policymakers.',
                    'questions': [
                        {
                            'question_text': 'What does personalized medicine represent?',
                            'options': ['A continuation of traditional treatments', 'A paradigm shift from one-size-fits-all treatments to customized healthcare based on individual genetic profiles', 'Only genetic testing', 'Only treatment customization'],
                            'correct_answer': 'B',
                            'difficulty': 'easy'
                        },
                        {
                            'question_text': 'What can personalized medicine improve?',
                            'options': ['Only treatment costs', 'Treatment efficacy while reducing adverse side effects', 'Only genetic privacy', 'Only healthcare access'],
                            'correct_answer': 'B',
                            'difficulty': 'medium'
                        },
                        {
                            'question_text': 'What concerns does personalized medicine raise?',
                            'options': ['Only treatment effectiveness', 'Genetic privacy, healthcare costs, and equitable access to advanced treatments', 'Only genetic testing accuracy', 'Only treatment availability'],
                            'correct_answer': 'B',
                            'difficulty': 'hard'
                        }
                    ]
                },
                {
                    'passage': 'The concept of virtual reality has evolved from science fiction to practical applications across various industries. VR technology creates immersive digital environments that can simulate real-world experiences or create entirely new ones. Industries such as gaming, education, healthcare, and real estate have adopted VR for training, therapy, and visualization purposes. However, widespread adoption faces challenges including high costs, technical limitations, and concerns about prolonged use effects. As technology advances and becomes more accessible, VR is expected to play an increasingly important role in how people work, learn, and interact.',
                    'questions': [
                        {
                            'question_text': 'What has virtual reality evolved from?',
                            'options': ['Only gaming applications', 'Science fiction to practical applications across various industries', 'Only educational tools', 'Only entertainment purposes'],
                            'correct_answer': 'B',
                            'difficulty': 'easy'
                        },
                        {
                            'question_text': 'What industries have adopted VR?',
                            'options': ['Only gaming', 'Gaming, education, healthcare, and real estate', 'Only healthcare', 'Only education'],
                            'correct_answer': 'B',
                            'difficulty': 'medium'
                        },
                        {
                            'question_text': 'What challenges does VR face for widespread adoption?',
                            'options': ['Only technical limitations', 'High costs, technical limitations, and concerns about prolonged use effects', 'Only high costs', 'Only user acceptance'],
                            'correct_answer': 'B',
                            'difficulty': 'hard'
                        }
                    ]
                },
                {
                    'passage': 'The concept of space exploration has captured human imagination for centuries, but recent technological advances have made it more accessible than ever before. Private companies are now competing with government agencies to develop reusable rockets and space tourism capabilities. This commercialization of space has reduced launch costs and accelerated innovation in space technology. However, the increasing number of satellites and space debris raises concerns about orbital congestion and environmental impact. International cooperation and regulation will be essential to ensure sustainable space exploration and utilization.',
                    'questions': [
                        {
                            'question_text': 'What has made space exploration more accessible?',
                            'options': ['Only government funding', 'Recent technological advances', 'Only private companies', 'Only reduced costs'],
                            'correct_answer': 'B',
                            'difficulty': 'easy'
                        },
                        {
                            'question_text': 'What has the commercialization of space achieved?',
                            'options': ['Only increased costs', 'Reduced launch costs and accelerated innovation in space technology', 'Only increased competition', 'Only space tourism'],
                            'correct_answer': 'B',
                            'difficulty': 'medium'
                        },
                        {
                            'question_text': 'What concerns does the passage raise about space exploration?',
                            'options': ['Only high costs', 'Orbital congestion and environmental impact from satellites and space debris', 'Only technical limitations', 'Only international cooperation'],
                            'correct_answer': 'B',
                            'difficulty': 'hard'
                        }
                    ]
                },
                {
                    'passage': 'The concept of blockchain technology has emerged as a revolutionary approach to data storage and transaction verification. Originally developed for cryptocurrencies, blockchain creates a decentralized, immutable ledger that can record transactions without the need for central authorities. This technology has applications beyond finance, including supply chain management, voting systems, and digital identity verification. However, blockchain faces challenges such as high energy consumption, scalability limitations, and regulatory uncertainty. The technology continues to evolve, with new consensus mechanisms and applications being developed to address these limitations.',
                    'questions': [
                        {
                            'question_text': 'What is blockchain technology?',
                            'options': ['Only a cryptocurrency', 'A revolutionary approach to data storage and transaction verification', 'Only a database system', 'Only a payment method'],
                            'correct_answer': 'B',
                            'difficulty': 'easy'
                        },
                        {
                            'question_text': 'What does blockchain create?',
                            'options': ['Only financial records', 'A decentralized, immutable ledger that can record transactions without central authorities', 'Only digital currencies', 'Only voting systems'],
                            'correct_answer': 'B',
                            'difficulty': 'medium'
                        },
                        {
                            'question_text': 'What challenges does blockchain face?',
                            'options': ['Only regulatory issues', 'High energy consumption, scalability limitations, and regulatory uncertainty', 'Only energy consumption', 'Only scalability issues'],
                            'correct_answer': 'B',
                            'difficulty': 'hard'
                        }
                    ]
                }
            ]
            
            # Add questions from additional passages
            questions_added = 0
            for passage_data in additional_passages:
                if questions_added >= needed:
                    break
                    
                passage_text = passage_data['passage']
                for question_data in passage_data['questions']:
                    if questions_added >= needed:
                        break
                        
                    Question.objects.create(
                        test_id=1,
                        question_type='reading_comprehension',
                        question_text=question_data['question_text'],
                        passage=passage_text,
                        options=question_data['options'],
                        correct_answer=question_data['correct_answer'],
                        difficulty_level=question_data['difficulty'],
                        order=Question.objects.filter(test_id=1).count() + 1,
                        explanation=f'This question tests understanding of the passage about {passage_text[:50]}...'
                    )
                    questions_added += 1
            
            self.stdout.write(f'Added {questions_added} questions')
            
            # Verify final count
            final_count = Question.objects.filter(test_id=1).count()
            self.stdout.write(f'Final VRT1 count: {final_count} questions')
            
            if final_count >= 60:
                self.stdout.write('✅ VRT1 question pool completed!')
            else:
                self.stdout.write(f'⚠️ Still need {60 - final_count} more questions')
