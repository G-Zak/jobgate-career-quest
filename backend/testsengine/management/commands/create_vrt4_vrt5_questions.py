from django.core.management.base import BaseCommand
from django.db import transaction
from testsengine.models import Question

class Command(BaseCommand):
    help = 'Creates VRT4 (Coding & Decoding) and VRT5 (Blood Relations) questions'

    def handle(self, *args, **options):
        self.stdout.write('🔧 Creating VRT4 and VRT5 questions...')
        
        with transaction.atomic():
            # VRT4: Coding & Decoding Questions
            coding_questions = [
                {
                    'question_text': 'If MYSTIFY is coded as NZTUJGZ, how is NEMESIS coded?',
                    'options': ['OFNFTJT', 'OFNFTJS', 'OFNFTJU', 'OFNFTJV', 'OFNFTJW'],
                    'correct_answer': 'A',
                    'difficulty': 'medium',
                    'explanation': 'Each letter is shifted by +1 in the alphabet: M→N, Y→Z, S→T, etc.'
                },
                {
                    'question_text': 'In a certain code, GARDEN → FZQCDM. How will NATURE be coded?',
                    'options': ['MZSTQD', 'MZSTQE', 'MZSTQF', 'MZSTQG', 'MZSTQH'],
                    'correct_answer': 'A',
                    'difficulty': 'hard',
                    'explanation': 'Each letter is shifted by -1: G→F, A→Z, R→Q, D→C, E→D, N→M.'
                },
                {
                    'question_text': 'If CRYPTO is coded as DQZQUP (alternating +1,+2), how is SECRET coded?',
                    'options': ['TGEVGV', 'TGEVGW', 'TGEVGX', 'TGEVGY', 'TGEVGZ'],
                    'correct_answer': 'A',
                    'difficulty': 'hard',
                    'explanation': 'Pattern: +1, +2, +1, +2, +1, +2 for each letter position.'
                },
                {
                    'question_text': 'If APPLE is coded as 1-16-16-12-5, how is ORANGE coded?',
                    'options': ['15-18-1-14-7-5', '15-18-2-14-7-5', '15-18-1-15-7-5', '15-18-1-14-8-5', '15-18-1-14-7-6'],
                    'correct_answer': 'A',
                    'difficulty': 'easy',
                    'explanation': 'Each letter is converted to its position in the alphabet.'
                },
                {
                    'question_text': 'If 12345 is coded as 54321, how is 67890 coded?',
                    'options': ['09876', '09877', '09878', '09879', '09880'],
                    'correct_answer': 'A',
                    'difficulty': 'easy',
                    'explanation': 'The pattern is to reverse the order of digits.'
                },
                {
                    'question_text': 'If CAT is coded as 3120, how is DOG coded?',
                    'options': ['4157', '4158', '4159', '4160', '4161'],
                    'correct_answer': 'A',
                    'difficulty': 'medium',
                    'explanation': 'C=3, A=1, T=20. So D=4, O=15, G=7.'
                },
                {
                    'question_text': 'If HELLO is coded as 85121215, how is WORLD coded?',
                    'options': ['231518124', '231518125', '231518126', '231518127', '231518128'],
                    'correct_answer': 'A',
                    'difficulty': 'medium',
                    'explanation': 'Each letter is converted to its position: H=8, E=5, L=12, L=12, O=15.'
                },
                {
                    'question_text': 'If ABC is coded as XYZ, how is DEF coded?',
                    'options': ['WUV', 'WVU', 'UVW', 'VUW', 'VWU'],
                    'correct_answer': 'A',
                    'difficulty': 'easy',
                    'explanation': 'Each letter is mapped to its reverse position: A→Z, B→Y, C→X, etc.'
                },
                {
                    'question_text': 'If 2+3=5 is coded as 2*3=6, how is 4+7=11 coded?',
                    'options': ['4*7=28', '4*7=29', '4*7=30', '4*7=31', '4*7=32'],
                    'correct_answer': 'A',
                    'difficulty': 'easy',
                    'explanation': 'The operation changes from addition to multiplication.'
                },
                {
                    'question_text': 'If RED is coded as 18-5-4, how is BLUE coded?',
                    'options': ['2-12-21-5', '2-12-22-5', '2-12-23-5', '2-12-24-5', '2-12-25-5'],
                    'correct_answer': 'A',
                    'difficulty': 'medium',
                    'explanation': 'Each letter is converted to its position: B=2, L=12, U=21, E=5.'
                }
            ]
            
            for i, q_data in enumerate(coding_questions, 1):
                Question.objects.create(
                    test_id=4,
                    question_type='coding_decoding',
                    question_text=q_data['question_text'],
                    options=q_data['options'],
                    correct_answer=q_data['correct_answer'],
                    difficulty_level=q_data['difficulty'],
                    order=i,
                    explanation=q_data['explanation']
                )
            self.stdout.write(f'  ✅ Created {len(coding_questions)} coding & decoding questions for VRT4')
            
            # VRT5: Blood Relations Questions
            blood_questions = [
                {
                    'question_text': "Pointing to a photograph, Maya says, 'She is the daughter of my grandfather's only son.' How is Maya related to the person in the photograph?",
                    'options': ['Sister', 'Cousin', 'Aunt', 'Mother', 'Niece'],
                    'correct_answer': 'A',
                    'difficulty': 'medium',
                    'explanation': "Maya's grandfather's only son is Maya's father. The daughter of Maya's father is Maya's sister."
                },
                {
                    'question_text': "Rahul introduces Priya as the wife of the only nephew of his father. How is Priya related to Rahul?",
                    'options': ['Sister-in-law', 'Wife', 'Cousin', 'Aunt', 'Mother'],
                    'correct_answer': 'A',
                    'difficulty': 'hard',
                    'explanation': "Rahul's father's only nephew is Rahul's brother. Priya is the wife of Rahul's brother, so she is Rahul's sister-in-law."
                },
                {
                    'question_text': "Aarti said, 'This boy is the son of the only son of my mother.' How is the boy related to Aarti?",
                    'options': ['Son', 'Brother', 'Nephew', 'Cousin', 'Uncle'],
                    'correct_answer': 'A',
                    'difficulty': 'easy',
                    'explanation': "Aarti's mother's only son is Aarti's brother. The son of Aarti's brother is Aarti's nephew."
                },
                {
                    'question_text': "Kiran is the brother of Suma. Suma is the sister of Ravi. How is Kiran related to Ravi?",
                    'options': ['Brother', 'Cousin', 'Uncle', 'Father', 'Son'],
                    'correct_answer': 'A',
                    'difficulty': 'easy',
                    'explanation': 'Kiran and Suma are siblings. Suma and Ravi are siblings. Therefore, Kiran and Ravi are brothers.'
                },
                {
                    'question_text': "Deepak's father is the only son of Mohan's father. How is Mohan related to Deepak?",
                    'options': ['Uncle', 'Father', 'Brother', 'Cousin', 'Grandfather'],
                    'correct_answer': 'A',
                    'difficulty': 'medium',
                    'explanation': "Mohan's father's only son is Mohan. Deepak's father is Mohan. Therefore, Mohan is Deepak's father."
                },
                {
                    'question_text': "If A is the brother of B, B is the sister of C, and C is the father of D, how is A related to D?",
                    'options': ['Uncle', 'Father', 'Brother', 'Cousin', 'Grandfather'],
                    'correct_answer': 'A',
                    'difficulty': 'medium',
                    'explanation': 'A is the brother of B, B is the sister of C, so A is the brother of C. C is the father of D, so A is the uncle of D.'
                },
                {
                    'question_text': "Pointing to a man, Sita says, 'He is the son of my father's only daughter.' How is the man related to Sita?",
                    'options': ['Son', 'Brother', 'Nephew', 'Cousin', 'Uncle'],
                    'correct_answer': 'A',
                    'difficulty': 'hard',
                    'explanation': "Sita's father's only daughter is Sita herself. The son of Sita is Sita's son."
                },
                {
                    'question_text': "If P is the father of Q, Q is the mother of R, and R is the son of S, how is S related to P?",
                    'options': ['Daughter-in-law', 'Wife', 'Sister', 'Mother', 'Aunt'],
                    'correct_answer': 'A',
                    'difficulty': 'hard',
                    'explanation': 'P is the father of Q, Q is the mother of R, so Q is P\'s daughter. R is the son of S, so S is the wife of Q. Therefore, S is P\'s daughter-in-law.'
                },
                {
                    'question_text': "A man said to a woman, 'Your mother's husband's sister is my aunt.' How is the woman related to the man?",
                    'options': ['Sister', 'Cousin', 'Aunt', 'Niece', 'Mother'],
                    'correct_answer': 'B',
                    'difficulty': 'hard',
                    'explanation': "The woman's mother's husband is the woman's father. The woman's father's sister is the woman's aunt. The man's aunt is the woman's aunt, so they are cousins."
                },
                {
                    'question_text': "If X is the brother of Y, Y is the daughter of Z, and Z is the wife of W, how is X related to W?",
                    'options': ['Son', 'Brother', 'Nephew', 'Cousin', 'Uncle'],
                    'correct_answer': 'A',
                    'difficulty': 'medium',
                    'explanation': 'Y is the daughter of Z, and X is the brother of Y, so X is also the son of Z. Z is the wife of W, so W is the father of X.'
                }
            ]
            
            for i, q_data in enumerate(blood_questions, 1):
                Question.objects.create(
                    test_id=5,
                    question_type='blood_relations',
                    question_text=q_data['question_text'],
                    options=q_data['options'],
                    correct_answer=q_data['correct_answer'],
                    difficulty_level=q_data['difficulty'],
                    order=i,
                    explanation=q_data['explanation']
                )
            self.stdout.write(f'  ✅ Created {len(blood_questions)} blood relation questions for VRT5')
            
            # Update test metadata
            from testsengine.models import Test
            test4 = Test.objects.get(id=4)
            test4.total_questions = len(coding_questions)
            test4.save()
            
            test5 = Test.objects.get(id=5)
            test5.total_questions = len(blood_questions)
            test5.save()
            
            self.stdout.write(f'  ✅ Updated test metadata')

        self.stdout.write('\n🎉 VRT4 and VRT5 questions created successfully!')
        self.stdout.write(f'VRT4 (Coding & Decoding): {len(coding_questions)} questions')
        self.stdout.write(f'VRT5 (Blood Relations): {len(blood_questions)} questions')
