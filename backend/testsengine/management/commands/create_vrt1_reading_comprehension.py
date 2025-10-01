from django.core.management.base import BaseCommand
from django.db import transaction
from testsengine.models import Test, Question

class Command(BaseCommand):
 help = 'Creates VRT1 Reading Comprehension questions with 10 passages and 3 questions each'

 def handle(self, *args, **options):
 self.stdout.write(' Creating VRT1 Reading Comprehension questions...')

 # Reading comprehension data
 reading_comprehension_data = [
 {
 'passage': 'The rapid growth of technology has transformed how people communicate. While social media has connected individuals across the globe, it has also raised concerns about privacy and the decline of face-to-face interactions. Studies suggest that while online communication can strengthen weak ties, it may weaken close relationships if it replaces direct contact. Therefore, the challenge of the digital age is not only to stay connected, but also to maintain meaningful human interactions.',
 'questions': [
 {
 'question_text': 'What is the main concern raised in the passage?',
 'options': [
 'Technology improves global communication.',
 'Social media has eliminated privacy concerns.',
 'Online communication may weaken close relationships.',
 'Direct contact is unnecessary in the digital age.'
 ],
 'correct_answer': 'C',
 'difficulty': 'easy',
 'explanation': 'The passage explicitly states that online communication "may weaken close relationships if it replaces direct contact."'
 },
 {
 'question_text': 'According to the passage, social media:',
 'options': [
 'Only strengthens close relationships.',
 'Has both positive and negative effects.',
 'Always replaces face-to-face interactions.',
 'Is the only way people connect globally.'
 ],
 'correct_answer': 'B',
 'difficulty': 'medium',
 'explanation': 'The passage mentions both positive effects (connecting individuals globally, strengthening weak ties) and negative effects (privacy concerns, weakening close relationships).'
 },
 {
 'question_text': 'What does the passage suggest is the challenge of the digital age?',
 'options': [
 'To increase the number of online friends.',
 'To use technology more efficiently.',
 'To balance online connections with meaningful human interactions.',
 'To eliminate social media completely.'
 ],
 'correct_answer': 'C',
 'difficulty': 'medium',
 'explanation': 'The passage states that "the challenge of the digital age is not only to stay connected, but also to maintain meaningful human interactions."'
 }
 ]
 },
 {
 'passage': 'Climate change represents one of the most pressing challenges of our time, affecting ecosystems, weather patterns, and human societies worldwide. Rising global temperatures have led to melting ice caps, rising sea levels, and more frequent extreme weather events. While individual actions like reducing carbon footprints are important, systemic changes in energy production, transportation, and industrial processes are necessary to address this crisis effectively. International cooperation and policy implementation are crucial for meaningful progress.',
 'questions': [
 {
 'question_text': 'What is the primary focus of this passage?',
 'options': [
 'Individual actions to reduce carbon footprints.',
 'The global impact and challenges of climate change.',
 'The benefits of international cooperation.',
 'Weather pattern predictions for the future.'
 ],
 'correct_answer': 'B',
 'difficulty': 'easy',
 'explanation': 'The passage opens by stating that climate change is "one of the most pressing challenges of our time" and discusses its global impacts.'
 },
 {
 'question_text': 'According to the passage, what is necessary to address climate change effectively?',
 'options': [
 'Only individual actions are needed.',
 'Systemic changes in energy and industry.',
 'Focusing only on weather patterns.',
 'Eliminating all international cooperation.'
 ],
 'correct_answer': 'B',
 'difficulty': 'medium',
 'explanation': 'The passage states that "systemic changes in energy production, transportation, and industrial processes are necessary to address this crisis effectively."'
 },
 {
 'question_text': 'What does the passage suggest about international cooperation?',
 'options': [
 'It is unnecessary for addressing climate change.',
 'It is crucial for meaningful progress.',
 'It only affects weather patterns.',
 'It should be avoided in policy implementation.'
 ],
 'correct_answer': 'B',
 'difficulty': 'easy',
 'explanation': 'The passage explicitly states that "International cooperation and policy implementation are crucial for meaningful progress."'
 }
 ]
 },
 {
 'passage': 'The concept of artificial intelligence has evolved from science fiction to reality, with applications spanning healthcare, finance, transportation, and entertainment. Machine learning algorithms can now process vast amounts of data to identify patterns and make predictions with remarkable accuracy. However, this technological advancement raises important questions about job displacement, privacy, and the ethical implications of automated decision-making. As AI systems become more sophisticated, society must grapple with balancing innovation and human welfare.',
 'questions': [
 {
 'question_text': 'What does the passage say about AI applications?',
 'options': [
 'They are limited to science fiction.',
 'They span multiple industries including healthcare and finance.',
 'They only affect entertainment.',
 'They have no real-world impact.'
 ],
 'correct_answer': 'B',
 'difficulty': 'easy',
 'explanation': 'The passage states that AI applications span "healthcare, finance, transportation, and entertainment."'
 },
 {
 'question_text': 'What concerns does the passage raise about AI?',
 'options': [
 'Only technical limitations.',
 'Job displacement, privacy, and ethical implications.',
 'The cost of implementation.',
 'The speed of data processing.'
 ],
 'correct_answer': 'B',
 'difficulty': 'medium',
 'explanation': 'The passage mentions "important questions about job displacement, privacy, and the ethical implications of automated decision-making."'
 },
 {
 'question_text': 'What does the passage suggest society must do as AI becomes more sophisticated?',
 'options': [
 'Avoid using AI completely.',
 'Focus only on technical development.',
 'Balance innovation with human welfare.',
 'Eliminate all ethical considerations.'
 ],
 'correct_answer': 'C',
 'difficulty': 'hard',
 'explanation': 'The passage concludes that "society must grapple with balancing innovation and human welfare."'
 }
 ]
 },
 {
 'passage': 'Urban planning has become increasingly important as cities worldwide face growing populations and limited space. Smart city initiatives integrate technology to improve infrastructure, reduce environmental impact, and enhance quality of life for residents. These projects often involve renewable energy systems, efficient public transportation, and data-driven decision making. However, successful implementation requires careful consideration of community needs, equitable access to resources, and long-term sustainability goals.',
 'questions': [
 {
 'question_text': 'Why has urban planning become increasingly important?',
 'options': [
 'Cities have unlimited space available.',
 'Cities face growing populations and limited space.',
 'Technology is no longer needed in cities.',
 'Environmental concerns are no longer relevant.'
 ],
 'correct_answer': 'B',
 'difficulty': 'easy',
 'explanation': 'The passage states that urban planning is important because "cities worldwide face growing populations and limited space."'
 },
 {
 'question_text': 'What do smart city initiatives typically involve?',
 'options': [
 'Only renewable energy systems.',
 'Technology integration to improve infrastructure and reduce environmental impact.',
 'Eliminating all public transportation.',
 'Ignoring community needs completely.'
 ],
 'correct_answer': 'B',
 'difficulty': 'medium',
 'explanation': 'The passage states that smart city initiatives "integrate technology to improve infrastructure, reduce environmental impact, and enhance quality of life for residents."'
 },
 {
 'question_text': 'What does the passage suggest is required for successful smart city implementation?',
 'options': [
 'Ignoring community needs.',
 'Focusing only on technology.',
 'Careful consideration of community needs, equitable access, and sustainability.',
 'Eliminating all long-term planning.'
 ],
 'correct_answer': 'C',
 'difficulty': 'hard',
 'explanation': 'The passage states that successful implementation "requires careful consideration of community needs, equitable access to resources, and long-term sustainability goals."'
 }
 ]
 },
 {
 'passage': 'The human brain is one of the most complex structures in the known universe, containing approximately 86 billion neurons connected by trillions of synapses. Recent advances in neuroscience have revealed the brain\'s remarkable plasticity, its ability to reorganize and adapt throughout life. This neuroplasticity enables learning, memory formation, and recovery from injury. Understanding these mechanisms has profound implications for education, rehabilitation, and the treatment of neurological disorders.',
 'questions': [
 {
 'question_text': 'How many neurons does the human brain contain?',
 'options': [
 '86 million neurons.',
 '86 billion neurons.',
 '86 trillion neurons.',
 'The passage does not specify.'
 ],
 'correct_answer': 'B',
 'difficulty': 'easy',
 'explanation': 'The passage explicitly states that the brain contains "approximately 86 billion neurons."'
 },
 {
 'question_text': 'What is neuroplasticity?',
 'options': [
 'The number of neurons in the brain.',
 'The brain\'s ability to reorganize and adapt throughout life.',
 'The study of brain disorders.',
 'The process of brain development in children only.'
 ],
 'correct_answer': 'B',
 'difficulty': 'medium',
 'explanation': 'The passage defines neuroplasticity as "the brain\'s remarkable plasticity, its ability to reorganize and adapt throughout life."'
 },
 {
 'question_text': 'What are the implications of understanding brain mechanisms?',
 'options': [
 'Only for treating brain injuries.',
 'For education, rehabilitation, and treatment of neurological disorders.',
 'Only for memory formation.',
 'Only for learning new skills.'
 ],
 'correct_answer': 'B',
 'difficulty': 'medium',
 'explanation': 'The passage states that understanding these mechanisms "has profound implications for education, rehabilitation, and the treatment of neurological disorders."'
 }
 ]
 },
 {
 'passage': 'Sustainable agriculture represents a critical approach to feeding the world\'s growing population while preserving environmental resources. This practice emphasizes soil health, water conservation, and biodiversity protection. Farmers adopting sustainable methods often use crop rotation, organic fertilizers, and integrated pest management. While these practices may initially require more labor and investment, they typically lead to long-term benefits including improved soil quality, reduced chemical dependency, and enhanced ecosystem resilience.',
 'questions': [
 {
 'question_text': 'What is the main goal of sustainable agriculture?',
 'options': [
 'To maximize short-term profits.',
 'To feed the growing population while preserving environmental resources.',
 'To eliminate all farming practices.',
 'To focus only on organic fertilizers.'
 ],
 'correct_answer': 'B',
 'difficulty': 'easy',
 'explanation': 'The passage states that sustainable agriculture is "a critical approach to feeding the world\'s growing population while preserving environmental resources."'
 },
 {
 'question_text': 'What practices do sustainable farmers typically use?',
 'options': [
 'Only chemical fertilizers.',
 'Crop rotation, organic fertilizers, and integrated pest management.',
 'Only monoculture farming.',
 'Maximum chemical dependency.'
 ],
 'correct_answer': 'B',
 'difficulty': 'medium',
 'explanation': 'The passage states that sustainable farmers "often use crop rotation, organic fertilizers, and integrated pest management."'
 },
 {
 'question_text': 'What are the long-term benefits of sustainable agriculture?',
 'options': [
 'Only reduced labor requirements.',
 'Improved soil quality, reduced chemical dependency, and enhanced ecosystem resilience.',
 'Only increased chemical use.',
 'Only short-term financial gains.'
 ],
 'correct_answer': 'B',
 'difficulty': 'hard',
 'explanation': 'The passage states that sustainable practices "typically lead to long-term benefits including improved soil quality, reduced chemical dependency, and enhanced ecosystem resilience."'
 }
 ]
 },
 {
 'passage': 'The concept of work-life balance has gained significant attention in modern society as employees struggle to manage professional responsibilities with personal well-being. Remote work technologies have provided new opportunities for flexibility, allowing many workers to perform their duties from home or other locations. However, this shift has also blurred the boundaries between work and personal time, potentially leading to increased stress and burnout. Organizations must develop policies that support employee well-being while maintaining productivity standards.',
 'questions': [
 {
 'question_text': 'What has gained significant attention in modern society?',
 'options': [
 'Only remote work technologies.',
 'The concept of work-life balance.',
 'Only professional responsibilities.',
 'Only personal well-being.'
 ],
 'correct_answer': 'B',
 'difficulty': 'easy',
 'explanation': 'The passage opens by stating that "The concept of work-life balance has gained significant attention in modern society."'
 },
 {
 'question_text': 'What opportunity have remote work technologies provided?',
 'options': [
 'Eliminating all work responsibilities.',
 'New opportunities for flexibility in work location.',
 'Only increasing work hours.',
 'Only reducing productivity.'
 ],
 'correct_answer': 'B',
 'difficulty': 'medium',
 'explanation': 'The passage states that remote work technologies "have provided new opportunities for flexibility, allowing many workers to perform their duties from home or other locations."'
 },
 {
 'question_text': 'What challenge has remote work created?',
 'options': [
 'Only increased productivity.',
 'Blurred boundaries between work and personal time, potentially leading to stress and burnout.',
 'Only improved work-life balance.',
 'Only reduced flexibility.'
 ],
 'correct_answer': 'B',
 'difficulty': 'hard',
 'explanation': 'The passage states that remote work "has also blurred the boundaries between work and personal time, potentially leading to increased stress and burnout."'
 }
 ]
 },
 {
 'passage': 'Renewable energy sources such as solar, wind, and hydroelectric power are becoming increasingly cost-competitive with traditional fossil fuels. This economic shift, combined with growing environmental awareness, has accelerated the global transition toward cleaner energy systems. Governments worldwide are implementing policies to support renewable energy development, including tax incentives, feed-in tariffs, and renewable portfolio standards. Despite these advances, challenges remain in energy storage, grid integration, and ensuring reliable power supply during periods of low renewable generation.',
 'questions': [
 {
 'question_text': 'What is happening to renewable energy costs?',
 'options': [
 'They are becoming more expensive than fossil fuels.',
 'They are becoming increasingly cost-competitive with traditional fossil fuels.',
 'They are no longer economically viable.',
 'They are only affordable in developed countries.'
 ],
 'correct_answer': 'B',
 'difficulty': 'easy',
 'explanation': 'The passage states that renewable energy sources "are becoming increasingly cost-competitive with traditional fossil fuels."'
 },
 {
 'question_text': 'What has accelerated the global transition to cleaner energy?',
 'options': [
 'Only government policies.',
 'Economic shift combined with growing environmental awareness.',
 'Only technological advances.',
 'Only fossil fuel depletion.'
 ],
 'correct_answer': 'B',
 'difficulty': 'medium',
 'explanation': 'The passage states that "This economic shift, combined with growing environmental awareness, has accelerated the global transition toward cleaner energy systems."'
 },
 {
 'question_text': 'What challenges remain with renewable energy?',
 'options': [
 'Only high costs.',
 'Energy storage, grid integration, and ensuring reliable power supply during low generation periods.',
 'Only environmental concerns.',
 'Only government support.'
 ],
 'correct_answer': 'B',
 'difficulty': 'hard',
 'explanation': 'The passage states that "challenges remain in energy storage, grid integration, and ensuring reliable power supply during periods of low renewable generation."'
 }
 ]
 },
 {
 'passage': 'The field of biotechnology has revolutionized medicine through the development of gene therapies, personalized treatments, and advanced diagnostic tools. These innovations have enabled doctors to target specific genetic mutations and tailor treatments to individual patients. However, the high cost of these therapies raises concerns about healthcare accessibility and equity. Additionally, ethical questions surrounding gene editing and genetic privacy continue to challenge the medical community and society at large.',
 'questions': [
 {
 'question_text': 'How has biotechnology revolutionized medicine?',
 'options': [
 'Only through reducing healthcare costs.',
 'Through gene therapies, personalized treatments, and advanced diagnostic tools.',
 'Only through eliminating all diseases.',
 'Only through traditional treatment methods.'
 ],
 'correct_answer': 'B',
 'difficulty': 'easy',
 'explanation': 'The passage states that biotechnology has revolutionized medicine "through the development of gene therapies, personalized treatments, and advanced diagnostic tools."'
 },
 {
 'question_text': 'What concern does the passage raise about biotechnological treatments?',
 'options': [
 'Only their effectiveness.',
 'High cost raising concerns about healthcare accessibility and equity.',
 'Only their safety.',
 'Only their availability.'
 ],
 'correct_answer': 'B',
 'difficulty': 'medium',
 'explanation': 'The passage states that "the high cost of these therapies raises concerns about healthcare accessibility and equity."'
 },
 {
 'question_text': 'What ethical questions does the passage mention?',
 'options': [
 'Only about treatment costs.',
 'Questions surrounding gene editing and genetic privacy.',
 'Only about treatment effectiveness.',
 'Only about patient consent.'
 ],
 'correct_answer': 'B',
 'difficulty': 'hard',
 'explanation': 'The passage states that "ethical questions surrounding gene editing and genetic privacy continue to challenge the medical community and society at large."'
 }
 ]
 },
 {
 'passage': 'The concept of circular economy represents a fundamental shift from the traditional linear model of production, consumption, and disposal. Instead of creating waste, this approach emphasizes designing products for longevity, reusability, and recyclability. Companies are increasingly adopting circular principles by implementing take-back programs, using recycled materials, and designing for disassembly. While this transition requires significant investment and cultural change, it offers potential benefits including reduced resource consumption, decreased environmental impact, and new business opportunities.',
 'questions': [
 {
 'question_text': 'What does the circular economy represent?',
 'options': [
 'A continuation of traditional linear production models.',
 'A fundamental shift from the traditional linear model of production, consumption, and disposal.',
 'Only increased waste production.',
 'Only focus on single-use products.'
 ],
 'correct_answer': 'B',
 'difficulty': 'easy',
 'explanation': 'The passage states that circular economy "represents a fundamental shift from the traditional linear model of production, consumption, and disposal."'
 },
 {
 'question_text': 'What does the circular economy emphasize?',
 'options': [
 'Only increasing production.',
 'Designing products for longevity, reusability, and recyclability.',
 'Only creating more waste.',
 'Only using new materials.'
 ],
 'correct_answer': 'B',
 'difficulty': 'medium',
 'explanation': 'The passage states that circular economy "emphasizes designing products for longevity, reusability, and recyclability."'
 },
 {
 'question_text': 'What potential benefits does the passage mention for circular economy?',
 'options': [
 'Only increased costs.',
 'Reduced resource consumption, decreased environmental impact, and new business opportunities.',
 'Only increased waste.',
 'Only higher production costs.'
 ],
 'correct_answer': 'B',
 'difficulty': 'hard',
 'explanation': 'The passage states that circular economy "offers potential benefits including reduced resource consumption, decreased environmental impact, and new business opportunities."'
 }
 ]
 }
 ]

 with transaction.atomic():
 # Clear existing VRT1 questions
 Question.objects.filter(test_id=1).delete()
 self.stdout.write(' Cleared existing VRT1 questions')

 # Create questions for each passage
 question_count = 0
 for passage_data in reading_comprehension_data:
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
 order=question_count,
 explanation=question_data['explanation']
 )

 # Update VRT1 test metadata
 test1 = Test.objects.get(id=1)
 test1.total_questions = question_count
 test1.save()

 self.stdout.write(f' Created {question_count} reading comprehension questions for VRT1')
 self.stdout.write(f' Updated VRT1 test metadata')

 self.stdout.write('\n VRT1 Reading Comprehension questions created successfully!')
 self.stdout.write(f' Summary:')
 self.stdout.write(f' - Passages: {len(reading_comprehension_data)}')
 self.stdout.write(f' - Questions per passage: 3')
 self.stdout.write(f' - Total questions: {question_count}')
 self.stdout.write(f' - Test ID: 1 (VRT1)')
 self.stdout.write(f' - Question type: reading_comprehension')
 self.stdout.write(f' - Scoring: Each correct answer = +1 point')
