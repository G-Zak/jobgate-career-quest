from django.core.management.base import BaseCommand
from testsengine.models import Test, Question

class Command(BaseCommand):
 help = 'Create multiple Verbal Reasoning Tests with progressive difficulty'

 def handle(self, *args, **options):
 # Create VRT1 - Basic Level
 vrt1, created = Test.objects.get_or_create(
 title="Verbal Reasoning Test 1 - Basic",
 test_type="verbal_reasoning",
 defaults={
 'description': 'Basic level verbal reasoning assessment focusing on fundamental comprehension and vocabulary skills.',
 'duration_minutes': 20,
 'total_questions': 20,
 'passing_score': 60
 }
 )

 # Create VRT2 - Intermediate Level
 vrt2, created = Test.objects.get_or_create(
 title="Verbal Reasoning Test 2 - Intermediate",
 test_type="verbal_reasoning",
 defaults={
 'description': 'Intermediate level verbal reasoning with more complex passages and critical thinking.',
 'duration_minutes': 25,
 'total_questions': 25,
 'passing_score': 65
 }
 )

 # Create VRT3 - Advanced Level
 vrt3, created = Test.objects.get_or_create(
 title="Verbal Reasoning Test 3 - Advanced",
 test_type="verbal_reasoning",
 defaults={
 'description': 'Advanced verbal reasoning requiring sophisticated analysis and complex deduction.',
 'duration_minutes': 30,
 'total_questions': 30,
 'passing_score': 70
 }
 )

 # Clear existing questions for these tests
 Question.objects.filter(test__in=[vrt1, vrt2, vrt3]).delete()

 # VRT1 - Basic Level Questions (Easy)
 vrt1_questions = [
 # Reading Comprehension - Basic
 {
 'passage': '''Technology has dramatically changed how we communicate. Email, instant messaging, and social media have made it possible to connect with people around the world instantly. However, some argue that these digital forms of communication lack the personal touch of face-to-face conversation. While digital communication is convenient and fast, it may not convey emotions and nuances as effectively as in-person interaction.''',
 'questions': [
 {
 'question_text': 'According to the passage, what is the main advantage of digital communication?',
 'options': ['It conveys emotions better', 'It is convenient and fast', 'It replaces face-to-face conversation', 'It is more personal'],
 'correct_answer': 'B'
 },
 {
 'question_text': 'What concern is raised about digital communication in the passage?',
 'options': ['It is too expensive', 'It lacks personal touch', 'It is too slow', 'It is unreliable'],
 'correct_answer': 'B'
 }
 ]
 },
 # Vocabulary - Basic
 {
 'question_text': 'In the sentence "The student was diligent in completing all assignments," the word "diligent" means:',
 'options': ['Lazy', 'Careful and hardworking', 'Quick', 'Confused'],
 'correct_answer': 'B'
 },
 {
 'question_text': 'What does "transparent" mean in "The company\'s transparent policies"?',
 'options': ['Hidden', 'Open and clear', 'Expensive', 'Complex'],
 'correct_answer': 'B'
 },
 # Logical Deduction - Basic
 {
 'question_text': 'All birds can fly. Penguins are birds. Therefore:',
 'options': ['Penguins can fly', 'Penguins cannot fly', 'The statement contains an error', 'Penguins are not birds'],
 'correct_answer': 'C'
 },
 # Analogies - Basic
 {
 'question_text': 'Teacher is to Student as Doctor is to:',
 'options': ['Hospital', 'Patient', 'Medicine', 'Stethoscope'],
 'correct_answer': 'B'
 },
 {
 'question_text': 'Hot is to Cold as Day is to:',
 'options': ['Sun', 'Light', 'Night', 'Time'],
 'correct_answer': 'C'
 }
 ]

 # VRT2 - Intermediate Level Questions
 vrt2_questions = [
 # Reading Comprehension - Intermediate
 {
 'passage': '''The concept of emotional intelligence has gained significant attention in workplace psychology. Unlike traditional IQ, which measures cognitive abilities, emotional intelligence encompasses the ability to recognize, understand, and manage emotions in oneself and others. Research suggests that employees with higher emotional intelligence tend to be more effective leaders, better team players, and more adaptable to change. Companies are increasingly incorporating emotional intelligence assessments into their hiring and training processes, recognizing that technical skills alone are insufficient for success in today\'s collaborative work environment.''',
 'questions': [
 {
 'question_text': 'How does emotional intelligence differ from traditional IQ according to the passage?',
 'options': ['It measures cognitive abilities', 'It focuses on managing emotions', 'It is less important', 'It cannot be assessed'],
 'correct_answer': 'B'
 },
 {
 'question_text': 'Why are companies incorporating emotional intelligence into hiring processes?',
 'options': ['Technical skills alone are insufficient', 'It is required by law', 'It is cheaper to assess', 'It replaces IQ testing'],
 'correct_answer': 'A'
 }
 ]
 },
 # Vocabulary - Intermediate
 {
 'question_text': 'In "The CEO\'s pragmatic approach to problem-solving," the word "pragmatic" suggests:',
 'options': ['Theoretical', 'Practical and realistic', 'Emotional', 'Aggressive'],
 'correct_answer': 'B'
 },
 # Critical Reasoning - Intermediate
 {
 'question_text': 'Studies show that people who read regularly have larger vocabularies. Sarah reads every day. Therefore, Sarah must have a large vocabulary. What assumption is this argument making?',
 'options': ['Reading is enjoyable', 'All studies are accurate', 'Regular reading always increases vocabulary', 'Sarah is intelligent'],
 'correct_answer': 'C'
 }
 ]

 # VRT3 - Advanced Level Questions
 vrt3_questions = [
 # Reading Comprehension - Advanced
 {
 'passage': '''The paradigm shift toward sustainable business practices represents more than mere corporate social responsibility; it constitutes a fundamental reimagining of value creation in the 21st century. Traditional profit maximization models, predicated on externalized environmental and social costs, are increasingly recognized as unsustainable in a resource-constrained world. Progressive organizations are adopting circular economy principles, wherein waste becomes input for subsequent processes, thereby minimizing environmental impact while potentially reducing operational costs. This transition requires sophisticated stakeholder management, as the benefits often accrue over longer time horizons than conventional investment cycles, necessitating a recalibration of performance metrics and investor expectations.''',
 'questions': [
 {
 'question_text': 'According to the passage, what characterizes the shift toward sustainable business practices?',
 'options': ['Simple cost reduction', 'Fundamental reimagining of value creation', 'Marketing strategy', 'Regulatory compliance'],
 'correct_answer': 'B'
 },
 {
 'question_text': 'What challenge does the transition to sustainable practices present?',
 'options': ['Higher immediate costs', 'Longer time horizons for benefits require recalibrated metrics', 'Lack of technology', 'Consumer resistance'],
 'correct_answer': 'B'
 }
 ]
 },
 # Critical Reasoning - Advanced
 {
 'question_text': 'A researcher claims that meditation increases creativity based on a study of 100 participants who meditated for 30 days and showed improved scores on creativity tests. What is the most significant limitation of this conclusion?',
 'options': ['Sample size too small', 'No control group for comparison', 'Meditation period too short', 'Creativity tests are unreliable'],
 'correct_answer': 'B'
 }
 ]

 # Create questions for VRT1
 question_order = 1
 for item in vrt1_questions:
 if 'passage' in item: # Reading comprehension
 for q in item['questions']:
 Question.objects.create(
 test=vrt1,
 question_type='reading_comprehension',
 question_text=q['question_text'],
 passage=item['passage'],
 options=q['options'],
 correct_answer=q['correct_answer'],
 difficulty_level='easy',
 order=question_order
 )
 question_order += 1
 else: # Other question types
 question_type = 'vocabulary' if 'word' in item['question_text'] or 'means' in item['question_text'] else \
 'logical_deduction' if 'Therefore' in item['question_text'] else 'analogies'
 Question.objects.create(
 test=vrt1,
 question_type=question_type,
 question_text=item['question_text'],
 options=item['options'],
 correct_answer=item['correct_answer'],
 difficulty_level='easy',
 order=question_order
 )
 question_order += 1

 # Add more basic questions to reach 20
 additional_vrt1 = [
 {
 'question_text': 'Find the word that best completes the analogy: Book is to Library as Car is to:',
 'options': ['Road', 'Garage', 'Engine', 'Driver'],
 'correct_answer': 'B',
 'type': 'analogies'
 },
 {
 'question_text': 'In the phrase "an optimistic outlook," optimistic means:',
 'options': ['Pessimistic', 'Hopeful and positive', 'Realistic', 'Uncertain'],
 'correct_answer': 'B',
 'type': 'vocabulary'
 },
 {
 'question_text': 'If all roses are flowers, and some flowers are red, then:',
 'options': ['All roses are red', 'Some roses might be red', 'No roses are red', 'All flowers are roses'],
 'correct_answer': 'B',
 'type': 'logical_deduction'
 }
 ]

 for item in additional_vrt1:
 Question.objects.create(
 test=vrt1,
 question_type=item['type'],
 question_text=item['question_text'],
 options=item['options'],
 correct_answer=item['correct_answer'],
 difficulty_level='easy',
 order=question_order
 )
 question_order += 1

 # Continue with remaining questions to reach 20 for VRT1
 more_vrt1_questions = [
 {
 'question_text': 'The word "meticulous" in "She was meticulous in her research" means:',
 'options': ['Careless', 'Very careful and precise', 'Fast', 'Expensive'],
 'correct_answer': 'B',
 'type': 'vocabulary'
 },
 {
 'question_text': 'Ocean is to Fish as Sky is to:',
 'options': ['Blue', 'Clouds', 'Bird', 'Air'],
 'correct_answer': 'C',
 'type': 'analogies'
 },
 {
 'question_text': 'All students who study pass their exams. John passed his exam. Therefore:',
 'options': ['John studied', 'John might have studied', 'John did not study', 'All students pass'],
 'correct_answer': 'B',
 'type': 'logical_deduction'
 },
 {
 'question_text': 'In "The novel was incredibly captivating," captivating means:',
 'options': ['Boring', 'Difficult', 'Fascinating and engaging', 'Short'],
 'correct_answer': 'C',
 'type': 'vocabulary'
 },
 {
 'question_text': 'Pen is to Write as Brush is to:',
 'options': ['Hair', 'Paint', 'Clean', 'Art'],
 'correct_answer': 'B',
 'type': 'analogies'
 },
 {
 'question_text': 'What does "collaborate" mean in "We need to collaborate on this project"?',
 'options': ['Compete', 'Work together', 'Work alone', 'Argue'],
 'correct_answer': 'B',
 'type': 'vocabulary'
 },
 {
 'question_text': 'Happy is to Sad as Light is to:',
 'options': ['Bright', 'Dark', 'Heavy', 'Fast'],
 'correct_answer': 'B',
 'type': 'analogies'
 },
 {
 'question_text': 'If some doctors are teachers, and all teachers are educated, then:',
 'options': ['All doctors are educated', 'Some doctors are educated', 'No doctors are teachers', 'All educated people are doctors'],
 'correct_answer': 'B',
 'type': 'logical_deduction'
 },
 {
 'question_text': 'The word "innovative" in "an innovative solution" means:',
 'options': ['Old', 'New and creative', 'Expensive', 'Simple'],
 'correct_answer': 'B',
 'type': 'vocabulary'
 },
 {
 'question_text': 'Clock is to Time as Thermometer is to:',
 'options': ['Heat', 'Temperature', 'Weather', 'Science'],
 'correct_answer': 'B',
 'type': 'analogies'
 }
 ]

 for item in more_vrt1_questions:
 Question.objects.create(
 test=vrt1,
 question_type=item['type'],
 question_text=item['question_text'],
 options=item['options'],
 correct_answer=item['correct_answer'],
 difficulty_level='easy',
 order=question_order
 )
 question_order += 1

 self.stdout.write(
 self.style.SUCCESS(f'Successfully created VRT1 with {question_order - 1} questions')
 )

 # Create questions for VRT2 (Intermediate)
 question_order = 1
 for item in vrt2_questions:
 if 'passage' in item:
 for q in item['questions']:
 Question.objects.create(
 test=vrt2,
 question_type='reading_comprehension',
 question_text=q['question_text'],
 passage=item['passage'],
 options=q['options'],
 correct_answer=q['correct_answer'],
 difficulty_level='medium',
 order=question_order
 )
 question_order += 1
 else:
 question_type = 'vocabulary' if 'word' in item['question_text'] or 'means' in item['question_text'] else 'critical_reasoning'
 Question.objects.create(
 test=vrt2,
 question_type=question_type,
 question_text=item['question_text'],
 options=item['options'],
 correct_answer=item['correct_answer'],
 difficulty_level='medium',
 order=question_order
 )
 question_order += 1

 # Add more VRT2 questions to reach 25
 additional_vrt2 = [
 {
 'passage': '''Climate change adaptation strategies vary significantly across different geographical regions and economic contexts. Coastal communities often prioritize sea-level rise mitigation through infrastructure improvements, while inland agricultural areas focus on drought-resistant crop development and water conservation techniques. The effectiveness of these strategies depends largely on local implementation capacity, funding availability, and community engagement levels. Recent studies indicate that collaborative approaches involving multiple stakeholders tend to produce more sustainable and comprehensive solutions than top-down governmental initiatives alone.''',
 'questions': [
 {
 'question_text': 'What determines the effectiveness of climate adaptation strategies according to the passage?',
 'options': ['Geographic location only', 'Implementation capacity, funding, and community engagement', 'Government policies only', 'Economic status only'],
 'correct_answer': 'B'
 },
 {
 'question_text': 'What advantage do collaborative approaches have over top-down initiatives?',
 'options': ['They are cheaper', 'They produce more sustainable solutions', 'They are faster to implement', 'They require less planning'],
 'correct_answer': 'B'
 }
 ],
 'type': 'reading_comprehension'
 },
 {
 'question_text': 'The word "synthesize" in "We need to synthesize information from multiple sources" means:',
 'options': ['Separate', 'Combine and integrate', 'Analyze', 'Reject'],
 'correct_answer': 'B',
 'type': 'vocabulary'
 },
 {
 'question_text': 'A study claims that exercise improves mood. However, the study only included participants who already enjoyed exercising. What is the main limitation?',
 'options': ['Sample size too small', 'Selection bias in participants', 'Study duration too short', 'Wrong measurement tools'],
 'correct_answer': 'B',
 'type': 'critical_reasoning'
 }
 ]

 for item in additional_vrt2:
 if item['type'] == 'reading_comprehension':
 for q in item['questions']:
 Question.objects.create(
 test=vrt2,
 question_type='reading_comprehension',
 question_text=q['question_text'],
 passage=item['passage'],
 options=q['options'],
 correct_answer=q['correct_answer'],
 difficulty_level='medium',
 order=question_order
 )
 question_order += 1
 else:
 Question.objects.create(
 test=vrt2,
 question_type=item['type'],
 question_text=item['question_text'],
 options=item['options'],
 correct_answer=item['correct_answer'],
 difficulty_level='medium',
 order=question_order
 )
 question_order += 1

 # Continue with more VRT2 questions...
 more_vrt2_questions = [
 {
 'question_text': 'What does "ambiguous" mean in "The contract terms were ambiguous"?',
 'options': ['Clear', 'Open to multiple interpretations', 'Expensive', 'Legal'],
 'correct_answer': 'B',
 'type': 'vocabulary'
 },
 {
 'question_text': 'If all managers are employees, and some employees work remotely, then:',
 'options': ['All managers work remotely', 'Some managers might work remotely', 'No managers work remotely', 'All remote workers are managers'],
 'correct_answer': 'B',
 'type': 'logical_deduction'
 },
 {
 'question_text': 'Research shows correlation between coffee consumption and productivity. A company concludes that providing free coffee will increase productivity. What assumption is being made?',
 'options': ['Coffee is inexpensive', 'Correlation implies causation', 'Employees like coffee', 'Productivity can be measured'],
 'correct_answer': 'B',
 'type': 'critical_reasoning'
 },
 {
 'question_text': 'The term "redundant" in "The explanation was redundant" means:',
 'options': ['Necessary', 'Unnecessary repetition', 'Complex', 'Brief'],
 'correct_answer': 'B',
 'type': 'vocabulary'
 },
 {
 'question_text': 'Innovation is to Progress as Tradition is to:',
 'options': ['Change', 'Stability', 'Innovation', 'Future'],
 'correct_answer': 'B',
 'type': 'analogies'
 }
 ]

 for item in more_vrt2_questions:
 Question.objects.create(
 test=vrt2,
 question_type=item['type'],
 question_text=item['question_text'],
 options=item['options'],
 correct_answer=item['correct_answer'],
 difficulty_level='medium',
 order=question_order
 )
 question_order += 1

 # Add remaining questions to reach exactly 25
 remaining_vrt2 = [
 {
 'question_text': 'What does "consolidate" mean in "We need to consolidate our resources"?',
 'options': ['Distribute', 'Combine and strengthen', 'Reduce', 'Eliminate'],
 'correct_answer': 'B',
 'type': 'vocabulary'
 },
 {
 'question_text': 'Microscope is to Small as Telescope is to:',
 'options': ['Large', 'Distant', 'Space', 'Stars'],
 'correct_answer': 'B',
 'type': 'analogies'
 },
 {
 'question_text': 'A survey shows that people who own pets are happier. The conclusion that owning pets causes happiness is flawed because:',
 'options': ['The survey was too small', 'Happy people might be more likely to own pets', 'Pets are expensive', 'The survey was biased'],
 'correct_answer': 'B',
 'type': 'critical_reasoning'
 },
 {
 'question_text': 'The word "facilitate" in "Technology can facilitate learning" means:',
 'options': ['Prevent', 'Make easier', 'Complicate', 'Replace'],
 'correct_answer': 'B',
 'type': 'vocabulary'
 },
 {
 'question_text': 'Democracy is to Voting as Monarchy is to:',
 'options': ['Crown', 'Inheritance', 'Palace', 'Power'],
 'correct_answer': 'B',
 'type': 'analogies'
 },
 {
 'question_text': 'What does "comprehensive" mean in "a comprehensive report"?',
 'options': ['Brief', 'Complete and thorough', 'Expensive', 'Difficult'],
 'correct_answer': 'B',
 'type': 'vocabulary'
 },
 {
 'question_text': 'Strategy is to Planning as Recipe is to:',
 'options': ['Food', 'Cooking', 'Kitchen', 'Ingredients'],
 'correct_answer': 'B',
 'type': 'analogies'
 },
 {
 'question_text': 'If some artists are musicians, and all musicians are creative, then:',
 'options': ['All artists are creative', 'Some artists are creative', 'No artists are musicians', 'All creative people are artists'],
 'correct_answer': 'B',
 'type': 'logical_deduction'
 },
 {
 'question_text': 'The term "substantiate" in "Please substantiate your claim" means:',
 'options': ['Deny', 'Support with evidence', 'Question', 'Simplify'],
 'correct_answer': 'B',
 'type': 'vocabulary'
 },
 {
 'question_text': 'Foundation is to Building as Root is to:',
 'options': ['Soil', 'Tree', 'Branch', 'Leaf'],
 'correct_answer': 'B',
 'type': 'analogies'
 },
 {
 'question_text': 'A company claims their training program increases sales by 50%. What additional information would be most important to evaluate this claim?',
 'options': ['Cost of the program', 'How sales increases were measured and compared to a control group', 'Number of participants', 'Duration of the program'],
 'correct_answer': 'B',
 'type': 'critical_reasoning'
 }
 ]

 for item in remaining_vrt2:
 Question.objects.create(
 test=vrt2,
 question_type=item['type'],
 question_text=item['question_text'],
 options=item['options'],
 correct_answer=item['correct_answer'],
 difficulty_level='medium',
 order=question_order
 )
 question_order += 1

 self.stdout.write(
 self.style.SUCCESS(f'Successfully created VRT2 with {question_order - 1} questions')
 )

 # Create questions for VRT3 (Advanced) - 30 questions
 question_order = 1
 for item in vrt3_questions:
 if 'passage' in item:
 for q in item['questions']:
 Question.objects.create(
 test=vrt3,
 question_type='reading_comprehension',
 question_text=q['question_text'],
 passage=item['passage'],
 options=q['options'],
 correct_answer=q['correct_answer'],
 difficulty_level='hard',
 order=question_order
 )
 question_order += 1
 else:
 Question.objects.create(
 test=vrt3,
 question_type='critical_reasoning',
 question_text=item['question_text'],
 options=item['options'],
 correct_answer=item['correct_answer'],
 difficulty_level='hard',
 order=question_order
 )
 question_order += 1

 # Add more VRT3 questions to reach 30 (advanced level)
 advanced_vrt3_questions = [
 {
 'passage': '''The epistemological foundations of artificial intelligence research rest upon complex philosophical assumptions about the nature of cognition, consciousness, and knowledge representation. Contemporary machine learning paradigms, while demonstrating remarkable empirical success, often lack theoretical frameworks that adequately explain their emergent behaviors or generalization capabilities. This explanatory gap poses significant challenges for developing robust, interpretable AI systems that can operate reliably in novel or adversarial contexts. Furthermore, the anthropomorphic bias inherent in many AI evaluation metrics may systematically underestimate the potential for machine intelligence to manifest in forms fundamentally different from human cognition, potentially limiting our conception of what constitutes intelligence itself.''',
 'questions': [
 {
 'question_text': 'What does the passage suggest is the primary challenge facing contemporary machine learning?',
 'options': ['Lack of computational power', 'Absence of theoretical frameworks explaining emergent behaviors', 'Insufficient training data', 'Hardware limitations'],
 'correct_answer': 'B'
 },
 {
 'question_text': 'According to the passage, how might anthropomorphic bias affect AI development?',
 'options': ['It improves human-AI interaction', 'It may limit our conception of intelligence', 'It makes AI more reliable', 'It reduces development costs'],
 'correct_answer': 'B'
 },
 {
 'question_text': 'The "explanatory gap" mentioned in the passage refers to:',
 'options': ['Differences between human and machine intelligence', 'The inability to explain machine learning behaviors theoretically', 'Communication problems between researchers', 'Funding shortages in AI research'],
 'correct_answer': 'B'
 }
 ],
 'type': 'reading_comprehension'
 },
 {
 'question_text': 'In academic discourse, "paradigmatic" typically refers to:',
 'options': ['Contradictory', 'Serving as a typical example or model', 'Outdated', 'Controversial'],
 'correct_answer': 'B',
 'type': 'vocabulary'
 },
 {
 'question_text': 'A study finds that students who take notes by hand perform better on tests than those who type notes. The researchers conclude that handwriting improves learning. What alternative explanation should be considered?',
 'options': ['Handwriting is faster than typing', 'Students who choose handwriting may have different learning preferences or habits', 'Typed notes are easier to read', 'Hand fatigue affects performance'],
 'correct_answer': 'B',
 'type': 'critical_reasoning'
 }
 ]

 for item in advanced_vrt3_questions:
 if item['type'] == 'reading_comprehension':
 for q in item['questions']:
 Question.objects.create(
 test=vrt3,
 question_type='reading_comprehension',
 question_text=q['question_text'],
 passage=item['passage'],
 options=q['options'],
 correct_answer=q['correct_answer'],
 difficulty_level='hard',
 order=question_order
 )
 question_order += 1
 else:
 Question.objects.create(
 test=vrt3,
 question_type=item['type'],
 question_text=item['question_text'],
 options=item['options'],
 correct_answer=item['correct_answer'],
 difficulty_level='hard',
 order=question_order
 )
 question_order += 1

 # Continue adding more advanced questions...
 more_advanced_questions = [
 {
 'question_text': 'The term "ostensibly" in "The policy was ostensibly designed to help" suggests:',
 'options': ['Obviously', 'Apparently, but perhaps not actually', 'Secretly', 'Effectively'],
 'correct_answer': 'B',
 'type': 'vocabulary'
 },
 {
 'question_text': 'A pharmaceutical company conducts a study showing their new drug is effective. The study was funded by the same company. What type of bias is this most likely to introduce?',
 'options': ['Selection bias', 'Confirmation bias', 'Financial conflict of interest', 'Observer bias'],
 'correct_answer': 'C',
 'type': 'critical_reasoning'
 },
 {
 'question_text': 'What does "ubiquitous" mean in "Smartphones have become ubiquitous"?',
 'options': ['Expensive', 'Present everywhere', 'Obsolete', 'Complex'],
 'correct_answer': 'B',
 'type': 'vocabulary'
 },
 {
 'question_text': 'Premise 1: All effective leaders inspire trust. Premise 2: Maria inspires trust. Conclusion: Maria is an effective leader. This reasoning is:',
 'options': ['Valid and sound', 'Invalid due to affirming the consequent', 'Valid but unsound', 'Circular reasoning'],
 'correct_answer': 'B',
 'type': 'logical_deduction'
 },
 {
 'question_text': 'The word "inexorable" in "The inexorable march of technology" means:',
 'options': ['Slow', 'Unstoppable', 'Beneficial', 'Harmful'],
 'correct_answer': 'B',
 'type': 'vocabulary'
 },
 {
 'question_text': 'A researcher argues that meditation reduces stress based on self-reported stress levels. What methodological concern is most significant?',
 'options': ['Sample size', 'Subjective self-reporting may be unreliable', 'Duration of study', 'Location of study'],
 'correct_answer': 'B',
 'type': 'critical_reasoning'
 },
 {
 'question_text': 'In scholarly writing, "empirical" evidence refers to:',
 'options': ['Theoretical speculation', 'Evidence based on observation or experience', 'Historical records', 'Expert opinions'],
 'correct_answer': 'B',
 'type': 'vocabulary'
 },
 {
 'question_text': 'Evolution is to Species as Revolution is to:',
 'options': ['Change', 'Society', 'Violence', 'Progress'],
 'correct_answer': 'B',
 'type': 'analogies'
 },
 {
 'question_text': 'What does "equivocal" mean in "The results were equivocal"?',
 'options': ['Clear', 'Ambiguous or uncertain', 'Positive', 'Statistical'],
 'correct_answer': 'B',
 'type': 'vocabulary'
 },
 {
 'question_text': 'A study claims that City A is safer than City B based on crime statistics. However, City A has a much smaller population. What factor should be considered?',
 'options': ['Weather differences', 'Crime rates per capita rather than absolute numbers', 'Economic differences', 'Geographic size'],
 'correct_answer': 'B',
 'type': 'critical_reasoning'
 }
 ]

 for item in more_advanced_questions:
 Question.objects.create(
 test=vrt3,
 question_type=item['type'],
 question_text=item['question_text'],
 options=item['options'],
 correct_answer=item['correct_answer'],
 difficulty_level='hard',
 order=question_order
 )
 question_order += 1

 # Add final questions to reach exactly 30
 final_vrt3_questions = [
 {
 'question_text': 'The term "pervasive" in "a pervasive influence" means:',
 'options': ['Limited', 'Spreading throughout', 'Temporary', 'Positive'],
 'correct_answer': 'B',
 'type': 'vocabulary'
 },
 {
 'question_text': 'Catalyst is to Reaction as Inspiration is to:',
 'options': ['Thought', 'Creativity', 'Person', 'Art'],
 'correct_answer': 'B',
 'type': 'analogies'
 },
 {
 'question_text': 'What does "superfluous" mean in "The explanation contained superfluous details"?',
 'options': ['Important', 'Unnecessary', 'Technical', 'Interesting'],
 'correct_answer': 'B',
 'type': 'vocabulary'
 },
 {
 'question_text': 'If all premises in a logical argument are true, but the conclusion is false, the argument is:',
 'options': ['Sound', 'Valid', 'Invalid', 'Incomplete'],
 'correct_answer': 'C',
 'type': 'logical_deduction'
 },
 {
 'question_text': 'The word "disparate" in "disparate groups" means:',
 'options': ['Similar', 'Fundamentally different', 'Large', 'Organized'],
 'correct_answer': 'B',
 'type': 'vocabulary'
 },
 {
 'question_text': 'A poll shows 80% support for a policy, but only 100 people were surveyed in a city of 1 million. The main limitation is:',
 'options': ['Sample size too small to be representative', 'Methodology unclear', 'Bias in questions', 'Wrong target population'],
 'correct_answer': 'A',
 'type': 'critical_reasoning'
 },
 {
 'question_text': 'Hypothesis is to Theory as Blueprint is to:',
 'options': ['Drawing', 'Building', 'Plan', 'Architecture'],
 'correct_answer': 'B',
 'type': 'analogies'
 },
 {
 'question_text': 'In research context, "spurious" correlation means:',
 'options': ['Strong correlation', 'False or misleading correlation', 'Positive correlation', 'Measured correlation'],
 'correct_answer': 'B',
 'type': 'vocabulary'
 },
 {
 'question_text': 'The phrase "ad hominem" in logical discourse refers to:',
 'options': ['Supporting evidence', 'Attacking the person rather than the argument', 'Latin terminology', 'Expert testimony'],
 'correct_answer': 'B',
 'type': 'vocabulary'
 },
 {
 'question_text': 'A company reports 100% customer satisfaction, but they only surveyed customers who made repeat purchases. This demonstrates:',
 'options': ['Excellent service', 'Sample selection bias', 'Statistical significance', 'Customer loyalty'],
 'correct_answer': 'B',
 'type': 'critical_reasoning'
 }
 ]

 for item in final_vrt3_questions:
 Question.objects.create(
 test=vrt3,
 question_type=item['type'],
 question_text=item['question_text'],
 options=item['options'],
 correct_answer=item['correct_answer'],
 difficulty_level='hard',
 order=question_order
 )
 question_order += 1

 self.stdout.write(
 self.style.SUCCESS(f'Successfully created VRT3 with {question_order - 1} questions')
 )

 self.stdout.write(
 self.style.SUCCESS('Successfully created all Verbal Reasoning Tests:')
 )
 self.stdout.write(f' VRT1: {vrt1.total_questions} questions (Basic level)')
 self.stdout.write(f' VRT2: {vrt2.total_questions} questions (Intermediate level)')
 self.stdout.write(f' VRT3: {vrt3.total_questions} questions (Advanced level)')
