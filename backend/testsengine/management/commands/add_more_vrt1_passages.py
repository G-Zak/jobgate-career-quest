from django.core.management.base import BaseCommand
from django.db import transaction
from testsengine.models import Question

class Command(BaseCommand):
 help = 'Adds 10 more reading comprehension passages to VRT1'

 def handle(self, *args, **options):
 self.stdout.write(' Adding 10 more passages to VRT1...')

 # Additional reading comprehension data
 additional_passages = [
 {
 'passage': 'The concept of digital transformation has reshaped how organizations operate in the modern economy. Companies are leveraging cloud computing, artificial intelligence, and data analytics to streamline operations and enhance customer experiences. This shift requires not only technological investment but also cultural change within organizations. Employees must adapt to new tools and processes, while leadership must develop digital strategies that align with business objectives. Success in digital transformation depends on balancing innovation with operational stability.',
 'questions': [
 {
 'question_text': 'What has digital transformation reshaped?',
 'options': [
 'Only customer experiences.',
 'How organizations operate in the modern economy.',
 'Only technological investment.',
 'Only employee training programs.'
 ],
 'correct_answer': 'B',
 'difficulty': 'easy',
 'explanation': 'The passage opens by stating that digital transformation "has reshaped how organizations operate in the modern economy."'
 },
 {
 'question_text': 'What does digital transformation require beyond technological investment?',
 'options': [
 'Only new software tools.',
 'Cultural change within organizations.',
 'Only data analytics.',
 'Only cloud computing.'
 ],
 'correct_answer': 'B',
 'difficulty': 'medium',
 'explanation': 'The passage states that digital transformation "requires not only technological investment but also cultural change within organizations."'
 },
 {
 'question_text': 'What does success in digital transformation depend on?',
 'options': [
 'Only technological investment.',
 'Only cultural change.',
 'Balancing innovation with operational stability.',
 'Only employee adaptation.'
 ],
 'correct_answer': 'C',
 'difficulty': 'hard',
 'explanation': 'The passage concludes that "Success in digital transformation depends on balancing innovation with operational stability."'
 }
 ]
 },
 {
 'passage': 'The field of quantum computing represents a revolutionary approach to processing information that could solve problems currently intractable for classical computers. Unlike traditional bits that exist in states of 0 or 1, quantum bits (qubits) can exist in superposition, allowing for parallel processing of vast amounts of data. This technology holds promise for cryptography, drug discovery, and optimization problems. However, quantum computers are extremely sensitive to environmental interference and require sophisticated error correction methods. The race to achieve quantum advantage continues among leading technology companies and research institutions.',
 'questions': [
 {
 'question_text': 'How do quantum bits differ from traditional bits?',
 'options': [
 'They are larger in size.',
 'They can exist in superposition, unlike traditional bits that are only 0 or 1.',
 'They process data more slowly.',
 'They require more energy to operate.'
 ],
 'correct_answer': 'B',
 'difficulty': 'easy',
 'explanation': 'The passage states that "Unlike traditional bits that exist in states of 0 or 1, quantum bits (qubits) can exist in superposition."'
 },
 {
 'question_text': 'What applications does quantum computing hold promise for?',
 'options': [
 'Only cryptography.',
 'Cryptography, drug discovery, and optimization problems.',
 'Only drug discovery.',
 'Only optimization problems.'
 ],
 'correct_answer': 'B',
 'difficulty': 'medium',
 'explanation': 'The passage states that quantum computing "holds promise for cryptography, drug discovery, and optimization problems."'
 },
 {
 'question_text': 'What challenges does quantum computing face?',
 'options': [
 'Only high costs.',
 'Extreme sensitivity to environmental interference and need for sophisticated error correction.',
 'Only slow processing speeds.',
 'Only limited applications.'
 ],
 'correct_answer': 'B',
 'difficulty': 'hard',
 'explanation': 'The passage states that "quantum computers are extremely sensitive to environmental interference and require sophisticated error correction methods."'
 }
 ]
 },
 {
 'passage': 'The concept of mindfulness has gained widespread recognition as a powerful tool for mental health and well-being. Rooted in ancient meditation practices, mindfulness involves paying attention to the present moment without judgment. Research has shown that regular mindfulness practice can reduce stress, improve focus, and enhance emotional regulation. Many organizations have incorporated mindfulness programs into their workplace wellness initiatives, recognizing the benefits for employee productivity and job satisfaction. However, mindfulness is not a quick fix and requires consistent practice to yield meaningful results.',
 'questions': [
 {
 'question_text': 'What is mindfulness?',
 'options': [
 'A form of physical exercise.',
 'Paying attention to the present moment without judgment.',
 'A type of medication.',
 'A form of therapy only for mental illness.'
 ],
 'correct_answer': 'B',
 'difficulty': 'easy',
 'explanation': 'The passage defines mindfulness as "paying attention to the present moment without judgment."'
 },
 {
 'question_text': 'What benefits has research shown for mindfulness practice?',
 'options': [
 'Only improved focus.',
 'Reduced stress, improved focus, and enhanced emotional regulation.',
 'Only stress reduction.',
 'Only emotional regulation.'
 ],
 'correct_answer': 'B',
 'difficulty': 'medium',
 'explanation': 'The passage states that research has shown mindfulness "can reduce stress, improve focus, and enhance emotional regulation."'
 },
 {
 'question_text': 'What does the passage say about mindfulness as a solution?',
 'options': [
 'It provides immediate results.',
 'It is not a quick fix and requires consistent practice.',
 'It works without any practice.',
 'It only works for certain people.'
 ],
 'correct_answer': 'B',
 'difficulty': 'hard',
 'explanation': 'The passage concludes that "mindfulness is not a quick fix and requires consistent practice to yield meaningful results."'
 }
 ]
 },
 {
 'passage': 'The rise of e-commerce has fundamentally transformed retail landscapes worldwide, creating both opportunities and challenges for businesses. Online platforms enable companies to reach global markets with relatively low overhead costs, while consumers benefit from convenience and competitive pricing. However, this shift has led to the closure of many traditional brick-and-mortar stores, affecting local economies and employment. The integration of omnichannel strategies, combining online and offline experiences, has become crucial for retail success. Companies must adapt to changing consumer expectations while maintaining profitability in an increasingly competitive digital marketplace.',
 'questions': [
 {
 'question_text': 'What has e-commerce fundamentally transformed?',
 'options': [
 'Only consumer behavior.',
 'Retail landscapes worldwide.',
 'Only online platforms.',
 'Only pricing strategies.'
 ],
 'correct_answer': 'B',
 'difficulty': 'easy',
 'explanation': 'The passage opens by stating that e-commerce "has fundamentally transformed retail landscapes worldwide."'
 },
 {
 'question_text': 'What benefits do online platforms provide for companies?',
 'options': [
 'Only lower costs.',
 'Reaching global markets with relatively low overhead costs.',
 'Only convenience.',
 'Only competitive pricing.'
 ],
 'correct_answer': 'B',
 'difficulty': 'medium',
 'explanation': 'The passage states that online platforms "enable companies to reach global markets with relatively low overhead costs."'
 },
 {
 'question_text': 'What has become crucial for retail success?',
 'options': [
 'Only online presence.',
 'The integration of omnichannel strategies, combining online and offline experiences.',
 'Only offline stores.',
 'Only competitive pricing.'
 ],
 'correct_answer': 'B',
 'difficulty': 'hard',
 'explanation': 'The passage states that "The integration of omnichannel strategies, combining online and offline experiences, has become crucial for retail success."'
 }
 ]
 },
 {
 'passage': 'The concept of personalized medicine represents a paradigm shift from one-size-fits-all treatments to customized healthcare based on individual genetic profiles. Advances in genomics and biotechnology have enabled doctors to identify genetic predispositions to diseases and tailor treatments accordingly. This approach can improve treatment efficacy while reducing adverse side effects. However, personalized medicine raises concerns about genetic privacy, healthcare costs, and equitable access to advanced treatments. The ethical implications of genetic testing and data sharing continue to challenge the medical community and policymakers.',
 'questions': [
 {
 'question_text': 'What does personalized medicine represent?',
 'options': [
 'A continuation of traditional treatments.',
 'A paradigm shift from one-size-fits-all treatments to customized healthcare based on individual genetic profiles.',
 'Only genetic testing.',
 'Only treatment customization.'
 ],
 'correct_answer': 'B',
 'difficulty': 'easy',
 'explanation': 'The passage states that personalized medicine "represents a paradigm shift from one-size-fits-all treatments to customized healthcare based on individual genetic profiles."'
 },
 {
 'question_text': 'What can personalized medicine improve?',
 'options': [
 'Only treatment costs.',
 'Treatment efficacy while reducing adverse side effects.',
 'Only genetic privacy.',
 'Only healthcare access.'
 ],
 'correct_answer': 'B',
 'difficulty': 'medium',
 'explanation': 'The passage states that personalized medicine "can improve treatment efficacy while reducing adverse side effects."'
 },
 {
 'question_text': 'What concerns does personalized medicine raise?',
 'options': [
 'Only treatment effectiveness.',
 'Genetic privacy, healthcare costs, and equitable access to advanced treatments.',
 'Only genetic testing accuracy.',
 'Only treatment availability.'
 ],
 'correct_answer': 'B',
 'difficulty': 'hard',
 'explanation': 'The passage states that personalized medicine "raises concerns about genetic privacy, healthcare costs, and equitable access to advanced treatments."'
 }
 ]
 },
 {
 'passage': 'The concept of virtual reality has evolved from science fiction to practical applications across various industries. VR technology creates immersive digital environments that can simulate real-world experiences or create entirely new ones. Industries such as gaming, education, healthcare, and real estate have adopted VR for training, therapy, and visualization purposes. However, widespread adoption faces challenges including high costs, technical limitations, and concerns about prolonged use effects. As technology advances and becomes more accessible, VR is expected to play an increasingly important role in how people work, learn, and interact.',
 'questions': [
 {
 'question_text': 'What has virtual reality evolved from?',
 'options': [
 'Only gaming applications.',
 'Science fiction to practical applications across various industries.',
 'Only educational tools.',
 'Only entertainment purposes.'
 ],
 'correct_answer': 'B',
 'difficulty': 'easy',
 'explanation': 'The passage states that VR "has evolved from science fiction to practical applications across various industries."'
 },
 {
 'question_text': 'What industries have adopted VR?',
 'options': [
 'Only gaming.',
 'Gaming, education, healthcare, and real estate.',
 'Only healthcare.',
 'Only education.'
 ],
 'correct_answer': 'B',
 'difficulty': 'medium',
 'explanation': 'The passage states that "Industries such as gaming, education, healthcare, and real estate have adopted VR for training, therapy, and visualization purposes."'
 },
 {
 'question_text': 'What challenges does VR face for widespread adoption?',
 'options': [
 'Only technical limitations.',
 'High costs, technical limitations, and concerns about prolonged use effects.',
 'Only high costs.',
 'Only user acceptance.'
 ],
 'correct_answer': 'B',
 'difficulty': 'hard',
 'explanation': 'The passage states that "widespread adoption faces challenges including high costs, technical limitations, and concerns about prolonged use effects."'
 }
 ]
 },
 {
 'passage': 'The concept of space exploration has captured human imagination for centuries, but recent technological advances have made it more accessible than ever before. Private companies are now competing with government agencies to develop reusable rockets and space tourism capabilities. This commercialization of space has reduced launch costs and accelerated innovation in space technology. However, the increasing number of satellites and space debris raises concerns about orbital congestion and environmental impact. International cooperation and regulation will be essential to ensure sustainable space exploration and utilization.',
 'questions': [
 {
 'question_text': 'What has made space exploration more accessible?',
 'options': [
 'Only government funding.',
 'Recent technological advances.',
 'Only private companies.',
 'Only reduced costs.'
 ],
 'correct_answer': 'B',
 'difficulty': 'easy',
 'explanation': 'The passage states that "recent technological advances have made it more accessible than ever before."'
 },
 {
 'question_text': 'What has the commercialization of space achieved?',
 'options': [
 'Only increased costs.',
 'Reduced launch costs and accelerated innovation in space technology.',
 'Only increased competition.',
 'Only space tourism.'
 ],
 'correct_answer': 'B',
 'difficulty': 'medium',
 'explanation': 'The passage states that "This commercialization of space has reduced launch costs and accelerated innovation in space technology."'
 },
 {
 'question_text': 'What concerns does the passage raise about space exploration?',
 'options': [
 'Only high costs.',
 'Orbital congestion and environmental impact from satellites and space debris.',
 'Only technical limitations.',
 'Only international cooperation.'
 ],
 'correct_answer': 'B',
 'difficulty': 'hard',
 'explanation': 'The passage states that "the increasing number of satellites and space debris raises concerns about orbital congestion and environmental impact."'
 }
 ]
 },
 {
 'passage': 'The concept of blockchain technology has emerged as a revolutionary approach to data storage and transaction verification. Originally developed for cryptocurrencies, blockchain creates a decentralized, immutable ledger that can record transactions without the need for central authorities. This technology has applications beyond finance, including supply chain management, voting systems, and digital identity verification. However, blockchain faces challenges such as high energy consumption, scalability limitations, and regulatory uncertainty. The technology continues to evolve, with new consensus mechanisms and applications being developed to address these limitations.',
 'questions': [
 {
 'question_text': 'What is blockchain technology?',
 'options': [
 'Only a cryptocurrency.',
 'A revolutionary approach to data storage and transaction verification.',
 'Only a database system.',
 'Only a payment method.'
 ],
 'correct_answer': 'B',
 'difficulty': 'easy',
 'explanation': 'The passage defines blockchain as "a revolutionary approach to data storage and transaction verification."'
 },
 {
 'question_text': 'What does blockchain create?',
 'options': [
 'Only financial records.',
 'A decentralized, immutable ledger that can record transactions without central authorities.',
 'Only digital currencies.',
 'Only voting systems.'
 ],
 'correct_answer': 'B',
 'difficulty': 'medium',
 'explanation': 'The passage states that blockchain "creates a decentralized, immutable ledger that can record transactions without the need for central authorities."'
 },
 {
 'question_text': 'What challenges does blockchain face?',
 'options': [
 'Only regulatory issues.',
 'High energy consumption, scalability limitations, and regulatory uncertainty.',
 'Only energy consumption.',
 'Only scalability issues.'
 ],
 'correct_answer': 'B',
 'difficulty': 'hard',
 'explanation': 'The passage states that blockchain "faces challenges such as high energy consumption, scalability limitations, and regulatory uncertainty."'
 }
 ]
 },
 {
 'passage': 'The concept of microlearning has gained popularity as an effective approach to professional development and skill acquisition. This method involves delivering educational content in small, focused segments that can be consumed in short time periods. Microlearning is particularly effective for busy professionals who need to stay updated with rapidly changing technologies and industry practices. Research suggests that this approach improves knowledge retention and engagement compared to traditional lengthy training sessions. However, microlearning works best when integrated into a comprehensive learning strategy rather than used in isolation.',
 'questions': [
 {
 'question_text': 'What is microlearning?',
 'options': [
 'A traditional educational approach.',
 'An approach involving educational content in small, focused segments for short time periods.',
 'Only online learning.',
 'Only professional development.'
 ],
 'correct_answer': 'B',
 'difficulty': 'easy',
 'explanation': 'The passage defines microlearning as "delivering educational content in small, focused segments that can be consumed in short time periods."'
 },
 {
 'question_text': 'Who is microlearning particularly effective for?',
 'options': [
 'Only students.',
 'Busy professionals who need to stay updated with rapidly changing technologies and industry practices.',
 'Only teachers.',
 'Only beginners.'
 ],
 'correct_answer': 'B',
 'difficulty': 'medium',
 'explanation': 'The passage states that microlearning "is particularly effective for busy professionals who need to stay updated with rapidly changing technologies and industry practices."'
 },
 {
 'question_text': 'What does research suggest about microlearning?',
 'options': [
 'It is less effective than traditional learning.',
 'It improves knowledge retention and engagement compared to traditional lengthy training sessions.',
 'It only works for certain subjects.',
 'It requires more time than traditional learning.'
 ],
 'correct_answer': 'B',
 'difficulty': 'hard',
 'explanation': 'The passage states that "Research suggests that this approach improves knowledge retention and engagement compared to traditional lengthy training sessions."'
 }
 ]
 },
 {
 'passage': 'The concept of smart cities represents an ambitious vision for urban development that integrates technology to improve quality of life and sustainability. These cities use sensors, data analytics, and Internet of Things (IoT) devices to optimize traffic flow, reduce energy consumption, and enhance public services. Citizens benefit from improved infrastructure, better air quality, and more efficient government services. However, implementing smart city technologies requires significant investment, robust cybersecurity measures, and careful consideration of privacy concerns. The success of smart cities depends on balancing technological innovation with citizen needs and environmental sustainability.',
 'questions': [
 {
 'question_text': 'What do smart cities represent?',
 'options': [
 'Only technological advancement.',
 'An ambitious vision for urban development that integrates technology to improve quality of life and sustainability.',
 'Only environmental sustainability.',
 'Only government efficiency.'
 ],
 'correct_answer': 'B',
 'difficulty': 'easy',
 'explanation': 'The passage defines smart cities as "an ambitious vision for urban development that integrates technology to improve quality of life and sustainability."'
 },
 {
 'question_text': 'What technologies do smart cities use?',
 'options': [
 'Only sensors.',
 'Sensors, data analytics, and Internet of Things (IoT) devices.',
 'Only data analytics.',
 'Only IoT devices.'
 ],
 'correct_answer': 'B',
 'difficulty': 'medium',
 'explanation': 'The passage states that smart cities "use sensors, data analytics, and Internet of Things (IoT) devices to optimize traffic flow, reduce energy consumption, and enhance public services."'
 },
 {
 'question_text': 'What does the success of smart cities depend on?',
 'options': [
 'Only technological innovation.',
 'Balancing technological innovation with citizen needs and environmental sustainability.',
 'Only citizen needs.',
 'Only environmental sustainability.'
 ],
 'correct_answer': 'B',
 'difficulty': 'hard',
 'explanation': 'The passage concludes that "The success of smart cities depends on balancing technological innovation with citizen needs and environmental sustainability."'
 }
 ]
 }
 ]

 with transaction.atomic():
 # Get current question count to continue numbering
 current_count = Question.objects.filter(test_id=1).count()
 self.stdout.write(f' Current VRT1 questions: {current_count}')

 # Add new questions
 question_count = 0
 for passage_data in additional_passages:
 passage_text = passage_data['passage']

 for question_data in passage_data['questions']:
 question_count += 1
 Question.objects.create(
 test_id=1,
 question_type='reading_comprehension',
 question_text=question_data['question_text'],
 passage=passage_text,
 options=question_data['options'],
 correct_answer=question_data['correct_answer'],
 difficulty_level=question_data['difficulty'],
 order=current_count + question_count,
 explanation=question_data['explanation']
 )

 # Update VRT1 test metadata
 from testsengine.models import Test
 test1 = Test.objects.get(id=1)
 test1.total_questions = current_count + question_count
 test1.save()

 self.stdout.write(f' Added {question_count} new reading comprehension questions')
 self.stdout.write(f' Updated VRT1 total questions to {test1.total_questions}')

 self.stdout.write('\n Additional VRT1 passages added successfully!')
 self.stdout.write(f' Summary:')
 self.stdout.write(f' - New passages: {len(additional_passages)}')
 self.stdout.write(f' - New questions: {question_count}')
 self.stdout.write(f' - Total VRT1 questions: {current_count + question_count}')
 self.stdout.write(f' - Test ID: 1 (VRT1)')
 self.stdout.write(f' - Question type: reading_comprehension')
