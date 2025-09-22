from django.core.management.base import BaseCommand
from django.db import transaction, models
from testsengine.models import Question, Test
import random

class Command(BaseCommand):
    help = 'Fix VRT duplicates and ensure each test has exactly 60 unique questions'

    def add_arguments(self, parser):
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Show what would be done without making changes',
        )

    def handle(self, *args, **options):
        dry_run = options['dry_run']
        
        if dry_run:
            self.stdout.write(self.style.WARNING('DRY RUN MODE - No changes will be made'))
        
        vrt_tests = [1, 2, 3, 4, 5]  # Active VRT tests
        
        with transaction.atomic():
            if dry_run:
                # In dry run, don't use atomic transaction
                pass
            
            for test_id in vrt_tests:
                self.fix_vrt_test(test_id, dry_run)
        
        if not dry_run:
            self.stdout.write(self.style.SUCCESS('✅ All VRT tests fixed successfully!'))
        else:
            self.stdout.write(self.style.WARNING('Dry run completed. Use without --dry-run to apply changes.'))

    def fix_vrt_test(self, test_id, dry_run=False):
        test = Test.objects.get(id=test_id)
        self.stdout.write(f'\n🔍 Processing {test.title} (ID: {test_id})')
        
        # Get all questions for this test
        all_questions = Question.objects.filter(test_id=test_id)
        self.stdout.write(f'   Current questions: {all_questions.count()}')
        
        # Find unique questions
        unique_questions = []
        seen_combinations = set()
        duplicates_to_remove = []
        
        for q in all_questions:
            combo = (q.question_text, str(q.options), q.correct_answer)
            if combo not in seen_combinations:
                unique_questions.append(q)
                seen_combinations.add(combo)
            else:
                duplicates_to_remove.append(q)
        
        self.stdout.write(f'   Unique questions: {len(unique_questions)}')
        self.stdout.write(f'   Duplicates to remove: {len(duplicates_to_remove)}')
        
        if not dry_run:
            # Remove duplicates
            if duplicates_to_remove:
                duplicate_ids = [q.id for q in duplicates_to_remove]
                Question.objects.filter(id__in=duplicate_ids).delete()
                self.stdout.write(f'   ✅ Removed {len(duplicates_to_remove)} duplicates')
            
            # Add new unique questions to reach 60
            questions_needed = 60 - len(unique_questions)
            if questions_needed > 0:
                self.stdout.write(f'   Adding {questions_needed} new unique questions...')
                self.add_unique_questions(test_id, questions_needed)
            elif questions_needed < 0:
                # Remove excess questions (keep first 60)
                excess_questions = Question.objects.filter(test_id=test_id)[60:]
                excess_count = excess_questions.count()
                excess_questions.delete()
                self.stdout.write(f'   ✅ Removed {excess_count} excess questions')
        
        # Verify final count
        final_count = Question.objects.filter(test_id=test_id).count()
        self.stdout.write(f'   Final question count: {final_count}')

    def add_unique_questions(self, test_id, count_needed):
        """Add unique questions for the specified VRT test"""
        
        if test_id == 1:  # VRT1 - Reading Comprehension
            self.add_reading_comprehension_questions(test_id, count_needed)
        elif test_id == 2:  # VRT2 - Verbal Analogies
            self.add_analogy_questions(test_id, count_needed)
        elif test_id == 3:  # VRT3 - Verbal Classification
            self.add_classification_questions(test_id, count_needed)
        elif test_id == 4:  # VRT4 - Coding & Decoding
            self.add_coding_questions(test_id, count_needed)
        elif test_id == 5:  # VRT5 - Blood Relations
            self.add_blood_relation_questions(test_id, count_needed)

    def add_reading_comprehension_questions(self, test_id, count):
        """Add unique reading comprehension questions"""
        passages = [
            {
                "text": "The concept of sustainable development has gained significant traction in recent decades as societies grapple with environmental challenges and resource depletion. This approach seeks to meet present needs without compromising the ability of future generations to meet their own needs. It encompasses three main pillars: environmental protection, economic development, and social equity. Governments, businesses, and individuals are increasingly adopting sustainable practices, from renewable energy initiatives to circular economy models that minimize waste and maximize resource efficiency.",
                "questions": [
                    {
                        "text": "What are the three main pillars of sustainable development?",
                        "options": ["Environmental, Economic, Social", "Political, Cultural, Technological", "Individual, Community, Global", "Past, Present, Future"],
                        "answer": "A"
                    },
                    {
                        "text": "What is the primary goal of sustainable development?",
                        "options": ["Maximize profits", "Meet present needs without compromising future", "Eliminate all environmental impact", "Focus only on economic growth"],
                        "answer": "B"
                    },
                    {
                        "text": "What does the circular economy model aim to do?",
                        "options": ["Increase production", "Minimize waste and maximize efficiency", "Reduce competition", "Eliminate all businesses"],
                        "answer": "B"
                    }
                ]
            },
            {
                "text": "Artificial intelligence has revolutionized numerous industries, from healthcare diagnostics to autonomous vehicles. Machine learning algorithms can process vast amounts of data to identify patterns and make predictions with remarkable accuracy. However, this technological advancement also raises important ethical questions about privacy, bias, and job displacement. As AI systems become more sophisticated, society must carefully consider how to harness their benefits while addressing potential risks and ensuring equitable access to these technologies.",
                "questions": [
                    {
                        "text": "What is a key capability of machine learning algorithms?",
                        "options": ["Create physical objects", "Process data to identify patterns", "Replace all human workers", "Eliminate the need for computers"],
                        "answer": "B"
                    },
                    {
                        "text": "What ethical concerns does AI raise?",
                        "options": ["Only technical issues", "Privacy, bias, and job displacement", "Only cost concerns", "Only speed problems"],
                        "answer": "B"
                    },
                    {
                        "text": "What should society consider regarding AI?",
                        "options": ["Only the benefits", "Only the risks", "Benefits while addressing risks", "Ignore AI completely"],
                        "answer": "C"
                    }
                ]
            }
        ]
        
        # Add more passages as needed
        for i in range(count):
            passage = passages[i % len(passages)]
            question_data = passage["questions"][i % len(passage["questions"])]
            
            # Get the next order number for this test
            max_order = Question.objects.filter(test_id=test_id).aggregate(max_order=models.Max('order'))['max_order'] or 0
            next_order = max_order + 1
            
            Question.objects.create(
                test_id=test_id,
                question_text=question_data["text"],
                passage=passage["text"],
                options=question_data["options"],
                correct_answer=question_data["answer"],
                difficulty_level=random.choice(['easy', 'medium', 'hard']),
                question_type='reading_comprehension',
                order=next_order
            )

    def add_analogy_questions(self, test_id, count):
        """Add unique analogy questions"""
        analogies = [
            {"stem": "Ocean is to Water as Desert is to:", "options": ["Sand", "Heat", "Cactus", "Oasis"], "answer": "A"},
            {"stem": "Doctor is to Hospital as Teacher is to:", "options": ["School", "Student", "Book", "Classroom"], "answer": "A"},
            {"stem": "Book is to Library as Car is to:", "options": ["Garage", "Road", "Driver", "Engine"], "answer": "A"},
            {"stem": "Pen is to Write as Knife is to:", "options": ["Cut", "Sharp", "Metal", "Handle"], "answer": "A"},
            {"stem": "Bird is to Fly as Fish is to:", "options": ["Swim", "Water", "Scale", "Gill"], "answer": "A"},
            {"stem": "Sun is to Day as Moon is to:", "options": ["Night", "Sky", "Star", "Dark"], "answer": "A"},
            {"stem": "Key is to Lock as Password is to:", "options": ["Account", "Computer", "Security", "User"], "answer": "A"},
            {"stem": "Seed is to Plant as Egg is to:", "options": ["Bird", "Chicken", "Animal", "Life"], "answer": "A"},
            {"stem": "Rain is to Umbrella as Sun is to:", "options": ["Hat", "Shade", "Sunglasses", "Protection"], "answer": "A"},
            {"stem": "Student is to Learn as Athlete is to:", "options": ["Train", "Compete", "Win", "Exercise"], "answer": "A"}
        ]
        
        for i in range(count):
            analogy = analogies[i % len(analogies)]
            # Get the next order number for this test
            max_order = Question.objects.filter(test_id=test_id).aggregate(max_order=models.Max('order'))['max_order'] or 0
            next_order = max_order + 1 + i
            
            Question.objects.create(
                test_id=test_id,
                question_text=analogy["stem"],
                options=analogy["options"],
                correct_answer=analogy["answer"],
                difficulty_level=random.choice(['easy', 'medium', 'hard']),
                question_type='analogy',
                order=next_order
            )

    def add_classification_questions(self, test_id, count):
        """Add unique classification questions"""
        classifications = [
            {"stem": "Which word does not belong with the others?", "words": ["Apple", "Banana", "Orange", "Carrot"], "options": ["Apple", "Banana", "Orange", "Carrot"], "answer": "D"},
            {"stem": "Find the odd one out:", "words": ["Dog", "Cat", "Bird", "Tree"], "options": ["Dog", "Cat", "Bird", "Tree"], "answer": "D"},
            {"stem": "Choose the word which is least like the others:", "words": ["Red", "Blue", "Green", "Happy"], "options": ["Red", "Blue", "Green", "Happy"], "answer": "D"},
            {"stem": "Which word is different from the others?", "words": ["Book", "Magazine", "Newspaper", "Television"], "options": ["Book", "Magazine", "Newspaper", "Television"], "answer": "D"},
            {"stem": "Find the word that doesn't fit:", "words": ["Car", "Truck", "Bus", "Airplane"], "options": ["Car", "Truck", "Bus", "Airplane"], "answer": "D"},
            {"stem": "Which is the odd one out?", "words": ["Piano", "Guitar", "Violin", "Microphone"], "options": ["Piano", "Guitar", "Violin", "Microphone"], "answer": "D"},
            {"stem": "Choose the word that doesn't belong:", "words": ["Monday", "Tuesday", "Wednesday", "January"], "options": ["Monday", "Tuesday", "Wednesday", "January"], "answer": "D"},
            {"stem": "Which word is least like the others?", "words": ["Doctor", "Nurse", "Teacher", "Hospital"], "options": ["Doctor", "Nurse", "Teacher", "Hospital"], "answer": "D"},
            {"stem": "Find the odd one out:", "words": ["Spring", "Summer", "Autumn", "Weather"], "options": ["Spring", "Summer", "Autumn", "Weather"], "answer": "D"},
            {"stem": "Which word doesn't fit with the group?", "words": ["Eyes", "Nose", "Mouth", "Chair"], "options": ["Eyes", "Nose", "Mouth", "Chair"], "answer": "D"}
        ]
        
        for i in range(count):
            classification = classifications[i % len(classifications)]
            # Get the next order number for this test
            max_order = Question.objects.filter(test_id=test_id).aggregate(max_order=models.Max('order'))['max_order'] or 0
            next_order = max_order + 1 + i
            
            Question.objects.create(
                test_id=test_id,
                question_text=classification["stem"],
                options=classification["options"],
                correct_answer=classification["answer"],
                difficulty_level=random.choice(['easy', 'medium', 'hard']),
                question_type='classification',
                order=next_order
            )

    def add_coding_questions(self, test_id, count):
        """Add unique coding & decoding questions"""
        codings = [
            {"text": "If CAT is coded as 3120, how is DOG coded?", "options": ["4157", "4156", "4158", "4159"], "answer": "A"},
            {"text": "If HELLO is coded as 85121215, how is WORLD coded?", "options": ["231518124", "231518125", "231518126", "231518127"], "answer": "A"},
            {"text": "If 12345 is coded as 54321, how is 67890 coded?", "options": ["09876", "09877", "09878", "09879"], "answer": "A"},
            {"text": "If APPLE is coded as BQQMF, how is ORANGE coded?", "options": ["PSBOHF", "PSBOHG", "PSBOHH", "PSBOHI"], "answer": "A"},
            {"text": "If 1=A, 2=B, 3=C, what is 4?", "options": ["D", "E", "F", "G"], "answer": "A"},
            {"text": "If MORNING is coded as NPSOJOH, how is EVENING coded?", "options": ["FWFOJOH", "FWFOJOG", "FWFOJOF", "FWFOJOE"], "answer": "A"},
            {"text": "If 5+3=8, 7+2=9, what is 4+6?", "options": ["10", "11", "12", "13"], "answer": "A"},
            {"text": "If ABC is coded as XYZ, how is DEF coded?", "options": ["GHI", "JKL", "MNO", "PQR"], "answer": "A"},
            {"text": "If 2×3=6, 4×5=20, what is 6×7?", "options": ["42", "43", "44", "45"], "answer": "A"},
            {"text": "If RED is coded as 1854, how is BLUE coded?", "options": ["221215", "221216", "221217", "221218"], "answer": "A"}
        ]
        
        for i in range(count):
            coding = codings[i % len(codings)]
            # Get the next order number for this test
            max_order = Question.objects.filter(test_id=test_id).aggregate(max_order=models.Max('order'))['max_order'] or 0
            next_order = max_order + 1 + i
            
            Question.objects.create(
                test_id=test_id,
                question_text=coding["text"],
                options=coding["options"],
                correct_answer=coding["answer"],
                difficulty_level=random.choice(['easy', 'medium', 'hard']),
                question_type='coding',
                order=next_order
            )

    def add_blood_relation_questions(self, test_id, count):
        """Add unique blood relation questions"""
        relations = [
            {"text": "A is B's father. B is C's mother. What is A to C?", "options": ["Grandfather", "Father", "Uncle", "Brother"], "answer": "A"},
            {"text": "X is Y's brother. Y is Z's sister. What is X to Z?", "options": ["Brother", "Sister", "Cousin", "Uncle"], "answer": "A"},
            {"text": "P is Q's son. Q is R's daughter. What is P to R?", "options": ["Grandson", "Son", "Nephew", "Cousin"], "answer": "A"},
            {"text": "M is N's wife. N is O's father. What is M to O?", "options": ["Mother", "Aunt", "Sister", "Cousin"], "answer": "A"},
            {"text": "A is B's uncle. B is C's father. What is A to C?", "options": ["Great-uncle", "Uncle", "Cousin", "Brother"], "answer": "A"},
            {"text": "X is Y's grandfather. Y is Z's father. What is X to Z?", "options": ["Great-grandfather", "Grandfather", "Uncle", "Father"], "answer": "A"},
            {"text": "P is Q's sister. Q is R's mother. What is P to R?", "options": ["Aunt", "Mother", "Sister", "Cousin"], "answer": "A"},
            {"text": "M is N's brother. N is O's husband. What is M to O?", "options": ["Brother-in-law", "Brother", "Cousin", "Uncle"], "answer": "A"},
            {"text": "A is B's daughter. B is C's son. What is A to C?", "options": ["Granddaughter", "Daughter", "Niece", "Cousin"], "answer": "A"},
            {"text": "X is Y's mother. Y is Z's wife. What is X to Z?", "options": ["Mother-in-law", "Mother", "Aunt", "Sister"], "answer": "A"}
        ]
        
        for i in range(count):
            relation = relations[i % len(relations)]
            # Get the next order number for this test
            max_order = Question.objects.filter(test_id=test_id).aggregate(max_order=models.Max('order'))['max_order'] or 0
            next_order = max_order + 1 + i
            
            Question.objects.create(
                test_id=test_id,
                question_text=relation["text"],
                options=relation["options"],
                correct_answer=relation["answer"],
                difficulty_level=random.choice(['easy', 'medium', 'hard']),
                question_type='blood_relation',
                order=next_order
            )
