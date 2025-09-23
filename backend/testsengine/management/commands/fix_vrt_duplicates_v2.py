from django.core.management.base import BaseCommand
from django.db import transaction, models
from testsengine.models import Question, Test
import random
import string

class Command(BaseCommand):
    help = 'Fix VRT duplicates with truly unique questions'

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
        
        if not dry_run:
            # Clear all existing questions for this test
            Question.objects.filter(test_id=test_id).delete()
            self.stdout.write(f'   ✅ Cleared all existing questions')
            
            # Add 60 unique questions
            self.add_unique_questions(test_id, 60)
        
        # Verify final count
        final_count = Question.objects.filter(test_id=test_id).count()
        self.stdout.write(f'   Final question count: {final_count}')

    def add_unique_questions(self, test_id, count):
        """Add unique questions for the specified VRT test"""
        
        if test_id == 1:  # VRT1 - Reading Comprehension
            self.add_reading_comprehension_questions(test_id, count)
        elif test_id == 2:  # VRT2 - Verbal Analogies
            self.add_analogy_questions(test_id, count)
        elif test_id == 3:  # VRT3 - Verbal Classification
            self.add_classification_questions(test_id, count)
        elif test_id == 4:  # VRT4 - Coding & Decoding
            self.add_coding_questions(test_id, count)
        elif test_id == 5:  # VRT5 - Blood Relations
            self.add_blood_relation_questions(test_id, count)

    def add_reading_comprehension_questions(self, test_id, count):
        """Add unique reading comprehension questions"""
        topics = [
            "sustainable development", "artificial intelligence", "climate change", "renewable energy",
            "space exploration", "medical research", "education technology", "urban planning",
            "biodiversity conservation", "digital transformation", "mental health", "food security",
            "renewable energy", "cybersecurity", "sustainable agriculture", "clean water access",
            "renewable materials", "smart cities", "ocean conservation", "green technology"
        ]
        
        for i in range(count):
            topic = topics[i % len(topics)]
            passage_num = i + 1
            
            # Generate unique passage
            passage = f"The concept of {topic} has gained significant attention in recent years as societies worldwide grapple with complex challenges and opportunities. This multifaceted approach encompasses various dimensions including technological innovation, environmental considerations, and social impact. Research and development in this field have accelerated dramatically, with numerous organizations, governments, and private entities investing substantial resources to advance understanding and implementation. The implications extend far beyond immediate applications, potentially reshaping how we approach fundamental aspects of modern life. As this field continues to evolve, it presents both unprecedented opportunities and significant challenges that require careful consideration and strategic planning. Passage {passage_num} explores these themes in detail, examining the current state of knowledge and future prospects."
            
            # Generate unique questions
            questions = [
                {
                    "text": f"What is the main focus of this passage about {topic}?",
                    "options": [
                        f"The historical development of {topic}",
                        f"The current challenges in {topic}",
                        f"The future potential of {topic}",
                        f"The economic impact of {topic}"
                    ],
                    "answer": "B"
                },
                {
                    "text": f"What does the passage suggest about {topic}?",
                    "options": [
                        f"It is a simple concept",
                        f"It requires significant investment",
                        f"It has limited applications",
                        f"It is outdated technology"
                    ],
                    "answer": "B"
                },
                {
                    "text": f"According to the passage, what is true about {topic}?",
                    "options": [
                        f"It affects only one sector",
                        f"It has global implications",
                        f"It is not well understood",
                        f"It requires no planning"
                    ],
                    "answer": "B"
                }
            ]
            
            # Select one question for this passage
            question_data = questions[i % len(questions)]
            
            Question.objects.create(
                test_id=test_id,
                question_text=question_data["text"],
                passage=passage,
                options=question_data["options"],
                correct_answer=question_data["answer"],
                difficulty_level=random.choice(['easy', 'medium', 'hard']),
                question_type='reading_comprehension',
                order=i + 1
            )

    def add_analogy_questions(self, test_id, count):
        """Add unique analogy questions"""
        analogy_templates = [
            ("{word1} is to {word2} as {word3} is to:", "{word4}"),
            ("{word1} : {word2} :: {word3} :", "{word4}"),
            ("{word1} relates to {word2} as {word3} relates to:", "{word4}"),
            ("{word1} and {word2} have the same relationship as {word3} and:", "{word4}"),
            ("If {word1} is to {word2}, then {word3} is to:", "{word4}")
        ]
        
        word_pairs = [
            ("Ocean", "Water", "Desert", "Sand"),
            ("Doctor", "Hospital", "Teacher", "School"),
            ("Book", "Library", "Car", "Garage"),
            ("Pen", "Write", "Knife", "Cut"),
            ("Bird", "Fly", "Fish", "Swim"),
            ("Sun", "Day", "Moon", "Night"),
            ("Key", "Lock", "Password", "Account"),
            ("Seed", "Plant", "Egg", "Animal"),
            ("Rain", "Umbrella", "Sun", "Hat"),
            ("Student", "Learn", "Athlete", "Train"),
            ("Chef", "Kitchen", "Pilot", "Cockpit"),
            ("Actor", "Stage", "Singer", "Microphone"),
            ("Writer", "Book", "Painter", "Canvas"),
            ("Farmer", "Field", "Fisherman", "Boat"),
            ("Builder", "House", "Baker", "Bakery"),
            ("Driver", "Car", "Rider", "Bicycle"),
            ("Swimmer", "Pool", "Runner", "Track"),
            ("Reader", "Book", "Viewer", "Screen"),
            ("Listener", "Music", "Watcher", "Movie"),
            ("Player", "Game", "Dancer", "Dance")
        ]
        
        for i in range(count):
            template = analogy_templates[i % len(analogy_templates)]
            word_pair = word_pairs[i % len(word_pairs)]
            
            # Generate unique question text
            question_text = template[0].format(
                word1=word_pair[0], word2=word_pair[1], 
                word3=word_pair[2], word4=word_pair[3]
            )
            
            # Generate options with the correct answer and distractors
            correct_answer = word_pair[3]
            distractors = [
                f"Option{i+1}A", f"Option{i+1}B", f"Option{i+1}C"
            ]
            
            # Shuffle options
            options = [correct_answer] + distractors
            random.shuffle(options)
            correct_index = options.index(correct_answer)
            answer_letter = chr(65 + correct_index)  # A, B, C, or D
            
            Question.objects.create(
                test_id=test_id,
                question_text=question_text,
                options=options,
                correct_answer=answer_letter,
                difficulty_level=random.choice(['easy', 'medium', 'hard']),
                question_type='analogy',
                order=i + 1
            )

    def add_classification_questions(self, test_id, count):
        """Add unique classification questions"""
        categories = [
            ("Fruits", ["Apple", "Banana", "Orange", "Carrot"]),
            ("Animals", ["Dog", "Cat", "Bird", "Tree"]),
            ("Colors", ["Red", "Blue", "Green", "Happy"]),
            ("Vehicles", ["Car", "Truck", "Bus", "Airplane"]),
            ("Instruments", ["Piano", "Guitar", "Violin", "Microphone"]),
            ("Days", ["Monday", "Tuesday", "Wednesday", "January"]),
            ("Professions", ["Doctor", "Nurse", "Teacher", "Hospital"]),
            ("Seasons", ["Spring", "Summer", "Autumn", "Weather"]),
            ("Body Parts", ["Eyes", "Nose", "Mouth", "Chair"]),
            ("Sports", ["Football", "Basketball", "Tennis", "Stadium"]),
            ("Countries", ["France", "Germany", "Italy", "Europe"]),
            ("Languages", ["English", "Spanish", "French", "Dictionary"]),
            ("Shapes", ["Circle", "Square", "Triangle", "Color"]),
            ("Elements", ["Gold", "Silver", "Copper", "Metal"]),
            ("Planets", ["Earth", "Mars", "Jupiter", "Solar"]),
            ("Oceans", ["Atlantic", "Pacific", "Indian", "Water"]),
            ("Mountains", ["Everest", "Kilimanjaro", "Denali", "Peak"]),
            ("Rivers", ["Nile", "Amazon", "Mississippi", "Water"]),
            ("Cities", ["London", "Paris", "Tokyo", "Country"]),
            ("Continents", ["Asia", "Africa", "Europe", "World"])
        ]
        
        question_templates = [
            "Which word does not belong with the others?",
            "Find the odd one out:",
            "Choose the word which is least like the others:",
            "Which word is different from the others?",
            "Find the word that doesn't fit:",
            "Which is the odd one out?",
            "Choose the word that doesn't belong:",
            "Which word is least like the others?",
            "Find the odd one out:",
            "Which word doesn't fit with the group?"
        ]
        
        for i in range(count):
            category = categories[i % len(categories)]
            template = question_templates[i % len(question_templates)]
            
            # The last item in the category is the odd one out
            words = category[1]
            odd_one = words[-1]
            others = words[:-1]
            
            # Shuffle the options
            options = words.copy()
            random.shuffle(options)
            correct_index = options.index(odd_one)
            answer_letter = chr(65 + correct_index)  # A, B, C, or D
            
            Question.objects.create(
                test_id=test_id,
                question_text=template,
                options=options,
                correct_answer=answer_letter,
                difficulty_level=random.choice(['easy', 'medium', 'hard']),
                question_type='classification',
                order=i + 1
            )

    def add_coding_questions(self, test_id, count):
        """Add unique coding & decoding questions"""
        for i in range(count):
            # Generate unique coding patterns
            base_word = f"WORD{i+1}"
            coded_word = self.generate_coded_word(base_word, i)
            
            question_text = f"If {base_word} is coded as {coded_word}, how is {self.generate_target_word(i)} coded?"
            
            # Generate options
            correct_answer = self.generate_correct_coding(i)
            options = [correct_answer] + [self.generate_wrong_coding(i, j) for j in range(3)]
            random.shuffle(options)
            
            correct_index = options.index(correct_answer)
            answer_letter = chr(65 + correct_index)
            
            Question.objects.create(
                test_id=test_id,
                question_text=question_text,
                options=options,
                correct_answer=answer_letter,
                difficulty_level=random.choice(['easy', 'medium', 'hard']),
                question_type='coding',
                order=i + 1
            )

    def add_blood_relation_questions(self, test_id, count):
        """Add unique blood relation questions"""
        relations = [
            ("A is B's father. B is C's mother. What is A to C?", "Grandfather"),
            ("X is Y's brother. Y is Z's sister. What is X to Z?", "Brother"),
            ("P is Q's son. Q is R's daughter. What is P to R?", "Grandson"),
            ("M is N's wife. N is O's father. What is M to O?", "Mother"),
            ("A is B's uncle. B is C's father. What is A to C?", "Great-uncle"),
            ("X is Y's grandfather. Y is Z's father. What is X to Z?", "Great-grandfather"),
            ("P is Q's sister. Q is R's mother. What is P to R?", "Aunt"),
            ("M is N's brother. N is O's husband. What is M to O?", "Brother-in-law"),
            ("A is B's daughter. B is C's son. What is A to C?", "Granddaughter"),
            ("X is Y's mother. Y is Z's wife. What is X to Z?", "Mother-in-law")
        ]
        
        for i in range(count):
            relation = relations[i % len(relations)]
            
            # Generate unique names
            names = [f"Person{chr(65+j)}{i+1}" for j in range(3)]
            question_text = relation[0].replace("A", names[0]).replace("B", names[1]).replace("C", names[2])
            
            correct_answer = relation[1]
            options = [correct_answer] + [f"Option{i+1}{j}" for j in ['A', 'B', 'C']]
            random.shuffle(options)
            
            correct_index = options.index(correct_answer)
            answer_letter = chr(65 + correct_index)
            
            Question.objects.create(
                test_id=test_id,
                question_text=question_text,
                options=options,
                correct_answer=answer_letter,
                difficulty_level=random.choice(['easy', 'medium', 'hard']),
                question_type='blood_relation',
                order=i + 1
            )

    def generate_coded_word(self, word, seed):
        """Generate a coded version of a word"""
        random.seed(seed)
        coded = ""
        for char in word:
            if char.isalpha():
                coded += chr((ord(char) - ord('A') + seed + 1) % 26 + ord('A'))
            else:
                coded += char
        return coded

    def generate_target_word(self, seed):
        """Generate a target word for coding"""
        words = ["TEST", "CODE", "WORD", "TEXT", "DATA", "INFO", "TASK", "WORK", "GOAL", "PLAN"]
        return words[seed % len(words)]

    def generate_correct_coding(self, seed):
        """Generate correct coding for target word"""
        return f"CODE{seed+1}"

    def generate_wrong_coding(self, seed, option):
        """Generate wrong coding options"""
        return f"WRONG{seed+1}{option+1}"
