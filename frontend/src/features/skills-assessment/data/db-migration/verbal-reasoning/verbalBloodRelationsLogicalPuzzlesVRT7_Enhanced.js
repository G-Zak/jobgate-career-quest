// VRT7: Enhanced Blood Relations and Logical Puzzles Test
// Comprehensive implementation with full dataset and improved features

// Parse the JSONL data directly as a string (avoiding import issues)
const loadVRT7Data = () => {
  // This would normally be loaded from the JSONL file
  // For now, let's create a comprehensive dataset
  const bloodRelationsQuestions = [
    {
      "id": "VR-BR-0001",
      "type": "blood_relations",
      "question_text": "Pointing to a photograph, Maya says, 'She is the daughter of my grandfather's only son.' How is the girl in the photograph related to Maya?",
      "options": ["Sister", "Cousin", "Niece", "Daughter", "Aunt"],
      "correct_answer": "Sister",
      "difficulty": "easy",
      "explanation": "Maya's grandfather's only son is Maya's father. The daughter of Maya's father is Maya's sister."
    },
    {
      "id": "VR-BR-0002",
      "type": "blood_relations",
      "question_text": "Rahul introduces Priya as the wife of the only nephew of his father. How is Priya related to Rahul?",
      "options": ["Sister-in-law", "Wife", "Cousin", "Daughter-in-law", "Niece"],
      "correct_answer": "Sister-in-law",
      "difficulty": "medium",
      "explanation": "Rahul's father's only nephew is Rahul's cousin. Priya is the wife of Rahul's cousin, making her Rahul's sister-in-law."
    },
    {
      "id": "VR-BR-0003",
      "type": "blood_relations",
      "question_text": "Aarti said, 'This boy is the son of the only son of my mother.' How is the boy related to Aarti?",
      "options": ["Son", "Brother", "Nephew", "Cousin", "Uncle"],
      "correct_answer": "Nephew",
      "difficulty": "medium",
      "explanation": "The only son of Aarti's mother is Aarti's brother. The son of Aarti's brother is Aarti's nephew."
    },
    {
      "id": "VR-BR-0004",
      "type": "blood_relations",
      "question_text": "Kiran is the brother of Suma. Suma is the sister of Ravi. How is Kiran related to Ravi?",
      "options": ["Brother", "Cousin", "Uncle", "Son", "Father"],
      "correct_answer": "Brother",
      "difficulty": "easy",
      "explanation": "If Kiran is Suma's brother and Suma is Ravi's sister, then Kiran and Ravi are both siblings to Suma, making them brothers."
    },
    {
      "id": "VR-BR-0005",
      "type": "blood_relations",
      "question_text": "Deepak's father is the only son of Mohan's father. How is Mohan related to Deepak?",
      "options": ["Father", "Uncle", "Brother", "Grandfather", "Cousin"],
      "correct_answer": "Uncle",
      "difficulty": "medium",
      "explanation": "Deepak's father is the only son of Mohan's father, meaning Deepak's father and Mohan are brothers. Therefore, Mohan is Deepak's uncle."
    },
    {
      "id": "VR-BR-0006",
      "type": "blood_relations",
      "question_text": "Looking at a portrait, Aditi says, 'His mother is the wife of my father's son.' Whose portrait is Aditi looking at?",
      "options": ["Her son", "Her nephew", "Her cousin", "Her brother", "Her father"],
      "correct_answer": "Her son",
      "difficulty": "hard",
      "explanation": "Aditi's father's son could be Aditi's brother or Aditi herself (if she's the only child). The wife of Aditi's father's son would be either her sister-in-law or Aditi herself. Since 'his mother' refers to the portrait subject, and if the wife is Aditi, then the portrait is of Aditi's son."
    },
    {
      "id": "VR-BR-0007",
      "type": "blood_relations",
      "question_text": "Vinod introduces Rekha saying, 'She is the wife of the only nephew of the only brother of my mother.' How is Rekha related to Vinod?",
      "options": ["Sister-in-law", "Cousin", "Sister", "Aunt", "Mother"],
      "correct_answer": "Sister-in-law",
      "difficulty": "hard",
      "explanation": "The only brother of Vinod's mother is Vinod's uncle. The only nephew of this uncle is Vinod's cousin. Rekha is the wife of Vinod's cousin, making her Vinod's sister-in-law."
    },
    {
      "id": "VR-BR-0008",
      "type": "blood_relations",
      "question_text": "Sita is the daughter of Ram's father's wife. How is Sita related to Ram?",
      "options": ["Sister", "Mother", "Daughter", "Wife", "Cousin"],
      "correct_answer": "Sister",
      "difficulty": "easy",
      "explanation": "Ram's father's wife is Ram's mother. Sita is the daughter of Ram's mother, making her Ram's sister."
    },
    {
      "id": "VR-BR-0009",
      "type": "blood_relations",
      "question_text": "Amit said, 'This girl is the wife of the grandson of my wife's mother.' How is the girl related to Amit?",
      "options": ["Daughter-in-law", "Granddaughter", "Daughter", "Sister-in-law", "Niece"],
      "correct_answer": "Daughter-in-law",
      "difficulty": "hard",
      "explanation": "Amit's wife's mother is Amit's mother-in-law. The grandson of Amit's mother-in-law could be Amit's son (through his wife). The wife of Amit's son is Amit's daughter-in-law."
    },
    {
      "id": "VR-BR-0010",
      "type": "blood_relations",
      "question_text": "Pointing to a man, Kavita says, 'He is the son of my father's sister.' How is the man related to Kavita?",
      "options": ["Cousin", "Brother", "Uncle", "Nephew", "Son"],
      "correct_answer": "Cousin",
      "difficulty": "easy",
      "explanation": "Kavita's father's sister is Kavita's aunt. The son of Kavita's aunt is Kavita's cousin."
    },
    {
      "id": "VR-BR-0011",
      "type": "blood_relations",
      "question_text": "Rajesh is the father of Monika. Monika is the sister of Suresh. Suresh is the son of Priya. How is Priya related to Rajesh?",
      "options": ["Wife", "Sister", "Mother", "Daughter", "Sister-in-law"],
      "correct_answer": "Wife",
      "difficulty": "medium",
      "explanation": "Rajesh is Monika's father, and Monika is Suresh's sister. Suresh is Priya's son. Since Monika and Suresh are siblings and have different named parents (Rajesh and Priya), Priya must be Rajesh's wife."
    },
    {
      "id": "VR-BR-0012",
      "type": "blood_relations",
      "question_text": "Anita introduces Ravi as the husband of the granddaughter of her mother. How is Ravi related to Anita?",
      "options": ["Son-in-law", "Grandson", "Nephew-in-law", "Brother-in-law", "Grandson-in-law"],
      "correct_answer": "Son-in-law",
      "difficulty": "hard",
      "explanation": "The granddaughter of Anita's mother is Anita's daughter (assuming Anita is the mother's daughter). Ravi is the husband of Anita's daughter, making him Anita's son-in-law."
    },
    {
      "id": "VR-BR-0013",
      "type": "blood_relations",
      "question_text": "Neha says, 'Yash's mother is the only daughter of my mother.' How is Neha related to Yash?",
      "options": ["Aunt", "Mother", "Sister", "Grandmother", "Cousin"],
      "correct_answer": "Aunt",
      "difficulty": "medium",
      "explanation": "The only daughter of Neha's mother is Neha's sister. Yash's mother is Neha's sister, making Neha Yash's aunt."
    },
    {
      "id": "VR-BR-0014",
      "type": "blood_relations",
      "question_text": "Rohit is the son of Asha. Asha is the sister of Vikram. Meera is the daughter of Vikram. How is Meera related to Rohit?",
      "options": ["Cousin", "Sister", "Aunt", "Niece", "Mother"],
      "correct_answer": "Cousin",
      "difficulty": "easy",
      "explanation": "Rohit is Asha's son, and Asha is Vikram's sister. Meera is Vikram's daughter. Since their parents (Asha and Vikram) are siblings, Rohit and Meera are cousins."
    },
    {
      "id": "VR-BR-0015",
      "type": "blood_relations",
      "question_text": "Pointing to a photograph, Sunita says, 'She is the daughter of the only son of my grandfather's wife.' How is the girl in the photograph related to Sunita?",
      "options": ["Niece", "Cousin", "Sister", "Daughter", "Aunt"],
      "correct_answer": "Niece",
      "difficulty": "medium",
      "explanation": "Sunita's grandfather's wife is Sunita's grandmother. The only son of Sunita's grandmother could be Sunita's father or uncle. The daughter of this son would be either Sunita's sister (if he's her father) or niece (if he's her uncle). Given the phrasing 'only son', it likely refers to Sunita's uncle, making the girl her niece."
    }
  ];

  const logicalPuzzlesQuestions = [
    {
      "id": "VR-LP-0001",
      "type": "logical_puzzles",
      "question_text": "Given the statements: 'All birds can fly', 'No birds can fly', 'Some birds can fly', 'Birds cannot fly'. Which two statements cannot both be true simultaneously, but can both be false?",
      "options": ["1 and 2", "2 and 3", "1 and 4", "3 and 4"],
      "correct_answer": "1 and 2",
      "difficulty": "easy",
      "explanation": "'All birds can fly' and 'No birds can fly' are direct contradictions. They cannot both be true, but both can be false if some birds can fly and some cannot."
    },
    {
      "id": "VR-LP-0002",
      "type": "logical_puzzles",
      "question_text": "Given the statements: 'All students passed the exam', 'Some students failed the exam', 'No students took the exam', 'Exactly half the students passed'. Which two statements are mutually exclusive (cannot both be true)?",
      "options": ["1 and 2", "2 and 3", "1 and 3", "3 and 4"],
      "correct_answer": "1 and 2",
      "difficulty": "easy",
      "explanation": "If all students passed, then it's impossible that some students failed. These statements are mutually exclusive."
    },
    {
      "id": "VR-LP-0003",
      "type": "logical_puzzles",
      "question_text": "From 'All roses are flowers' and 'All flowers need water', what can we logically conclude?",
      "options": ["Some roses are red", "All roses need water", "Some flowers are roses", "Roses are plants"],
      "correct_answer": "All roses need water",
      "difficulty": "medium",
      "explanation": "From 'All roses are flowers' and 'All flowers need water', we can deduce by transitivity that 'All roses need water'."
    },
    {
      "id": "VR-LP-0004",
      "type": "logical_puzzles",
      "question_text": "Which two statements can both be true but cannot both be false? 'Some animals are mammals', 'Some animals are not mammals', 'All animals are vertebrates', 'No animals are plants'.",
      "options": ["1 and 2", "2 and 3", "1 and 3", "3 and 4"],
      "correct_answer": "1 and 2",
      "difficulty": "medium",
      "explanation": "'Some animals are mammals' and 'Some animals are not mammals' can both be true simultaneously. However, they cannot both be false because together they cover all logical possibilities for animals regarding mammalian status."
    },
    {
      "id": "VR-LP-0005",
      "type": "logical_puzzles",
      "question_text": "In a sequence: Monday, Wednesday, Friday, Sunday, ?, Thursday. What comes next?",
      "options": ["Tuesday", "Saturday", "Monday", "Wednesday"],
      "correct_answer": "Tuesday",
      "difficulty": "medium",
      "explanation": "The pattern skips one day each time: Mon (+2) Wed (+2) Fri (+2) Sun (+2) Tue (+2) Thu. The missing day is Tuesday."
    },
    {
      "id": "VR-LP-0006",
      "type": "logical_puzzles",
      "question_text": "If A is taller than B, B is taller than C, and C is taller than D, which statement must be true?",
      "options": ["D is the shortest", "A is the tallest", "B is taller than D", "All of the above"],
      "correct_answer": "All of the above",
      "difficulty": "easy",
      "explanation": "From the given relationships: A > B > C > D. This means A is tallest, D is shortest, and B is taller than D. All statements are true."
    },
    {
      "id": "VR-LP-0007",
      "type": "logical_puzzles",
      "question_text": "Three friends - Alex, Ben, and Carl - have different ages. Alex is not the oldest. Ben is older than Carl. Who is the youngest?",
      "options": ["Alex", "Ben", "Carl", "Cannot be determined"],
      "correct_answer": "Carl",
      "difficulty": "medium",
      "explanation": "Ben is older than Carl, so Carl is not the oldest. Alex is not the oldest. Since Ben > Carl and Alex ≠ oldest, Ben must be the oldest, making Carl the youngest."
    },
    {
      "id": "VR-LP-0008",
      "type": "logical_puzzles",
      "question_text": "In the series 2, 6, 12, 20, 30, ?, what is the next number?",
      "options": ["40", "42", "44", "46"],
      "correct_answer": "42",
      "difficulty": "hard",
      "explanation": "The differences between consecutive terms are: 4, 6, 8, 10... (increasing by 2). Next difference would be 12, so 30 + 12 = 42."
    },
    {
      "id": "VR-LP-0009",
      "type": "logical_puzzles",
      "question_text": "If some doctors are teachers and some teachers are artists, which conclusion is valid?",
      "options": ["Some doctors are artists", "No doctors are artists", "All teachers are doctors", "Cannot be determined"],
      "correct_answer": "Cannot be determined",
      "difficulty": "hard",
      "explanation": "The overlap between doctors and artists cannot be determined from the given information. There may or may not be doctors who are also artists."
    },
    {
      "id": "VR-LP-0010",
      "type": "logical_puzzles",
      "question_text": "Five people sit in a row. Maria sits two seats to the right of John. Lisa sits immediately to the left of Maria. Where does Lisa sit relative to John?",
      "options": ["Immediately to the right", "Two seats to the right", "One seat to the right", "Two seats to the left"],
      "correct_answer": "One seat to the right",
      "difficulty": "medium",
      "explanation": "If Maria is 2 seats right of John and Lisa is immediately left of Maria, then Lisa is 1 seat right of John. John-[someone]-Lisa-Maria."
    }
  ];

  return {
    bloodRelations: bloodRelationsQuestions,
    logicalPuzzles: logicalPuzzlesQuestions,
    total: bloodRelationsQuestions.length + logicalPuzzlesQuestions.length
  };
};

// Enhanced utility functions
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const getQuestionsByDifficulty = (questions, difficulty) => {
  return questions.filter(q => q.difficulty === difficulty);
};

const getBalancedSelection = (questions, count, difficultyDistribution = { easy: 0.4, medium: 0.4, hard: 0.2 }) => {
  const easyQuestions = getQuestionsByDifficulty(questions, 'easy');
  const mediumQuestions = getQuestionsByDifficulty(questions, 'medium');
  const hardQuestions = getQuestionsByDifficulty(questions, 'hard');
  
  const easyCount = Math.floor(count * difficultyDistribution.easy);
  const mediumCount = Math.floor(count * difficultyDistribution.medium);
  const hardCount = count - easyCount - mediumCount;
  
  const selectedEasy = shuffleArray(easyQuestions).slice(0, Math.min(easyCount, easyQuestions.length));
  const selectedMedium = shuffleArray(mediumQuestions).slice(0, Math.min(mediumCount, mediumQuestions.length));
  const selectedHard = shuffleArray(hardQuestions).slice(0, Math.min(hardCount, hardQuestions.length));
  
  return [...selectedEasy, ...selectedMedium, ...selectedHard];
};

// Main test generation function
export function getRandomizedVRT7Test(questionCount = 25) {
  try {
    const data = loadVRT7Data();
    
    // Calculate balanced split between question types
    const brCount = Math.ceil(questionCount / 2);
    const lpCount = questionCount - brCount;
    
    // Get balanced selection for each type
    const selectedBR = getBalancedSelection(data.bloodRelations, brCount);
    const selectedLP = getBalancedSelection(data.logicalPuzzles, lpCount);
    
    // Combine and shuffle final selection
    const allSelected = shuffleArray([...selectedBR, ...selectedLP]);
    
    // Renumber questions sequentially and ensure proper format
    const numberedQuestions = allSelected.map((q, index) => ({
      id: index + 1,
      question_text: q.question_text,
      options: q.options,
      correct_answer: q.correct_answer,
      explanation: q.explanation,
      type: q.type,
      difficulty: q.difficulty,
      // Add additional metadata for better tracking
      original_id: q.id,
      category: q.type === 'blood_relations' ? 'Blood Relations' : 'Logical Puzzles'
    }));
    
    // Generate test statistics
    const stats = {
      total_questions: numberedQuestions.length,
      blood_relations: numberedQuestions.filter(q => q.type === 'blood_relations').length,
      logical_puzzles: numberedQuestions.filter(q => q.type === 'logical_puzzles').length,
      difficulty: {
        easy: numberedQuestions.filter(q => q.difficulty === 'easy').length,
        medium: numberedQuestions.filter(q => q.difficulty === 'medium').length,
        hard: numberedQuestions.filter(q => q.difficulty === 'hard').length
      }
    };
    
    // Convert to passage-like structure for UI compatibility
    // Each question becomes its own "passage" with question embedded
    const passageStructuredData = numberedQuestions.map((question, index) => ({
      passage_title: `${question.category} - Question ${index + 1}`,
      passage_text: question.type === 'blood_relations' ? 
        `This is a blood relations question. Read the relationship description carefully and determine the family connection.` :
        `This is a logical puzzle question. Analyze the given statements and apply logical reasoning to find the correct answer.`,
      passage_id: `VRT7_P${index + 1}`,
      questions: [question]
    }));

    return {
      id: "VRT7",
      title: "Verbal Reasoning Test 7 - Blood Relations & Logical Puzzles",
      description: "Advanced verbal reasoning with family relationships and logical puzzle solving",
      timeLimit: 35,
      // Structure as single section with multiple passages for UI compatibility
      sections: [{
        id: "VRT7_S1",
        title: "Blood Relations & Logical Puzzles",
        description: "Family relationships and logical reasoning questions",
        intro_text: {
          title: "Blood Relations & Logical Puzzles Test",
          instructions: [
            "This test contains blood relations and logical puzzle questions.",
            "For blood relations: Carefully analyze the family relationships described.",
            "For logical puzzles: Apply logical reasoning to find the correct answer.",
            "Read each question carefully and select the best answer.",
            "You have 35 minutes to complete all questions."
          ]
        },
        instructions: [
          "This test contains blood relations and logical puzzle questions.",
          "For blood relations: Carefully analyze the family relationships described.",
          "For logical puzzles: Apply logical reasoning to find the correct answer.",
          "Read each question carefully and select the best answer.",
          "You have 35 minutes to complete all questions."
        ],
        duration_minutes: 35,
        questions: passageStructuredData
      }],
      questions: numberedQuestions, // Keep original flat structure for compatibility
      statistics: stats,
      // Enhanced metadata
      test_type: "blood_relations_logical_puzzles",
      difficulty_level: "master",
      version: "2.0",
      generated_at: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error generating VRT7 test:', error);
    // Fallback test with minimal questions
    const fallbackQuestion = {
      id: 1,
      question_text: "Sample question: How is a father's son related to you?",
      options: ["Brother or Self", "Cousin", "Uncle", "Nephew"],
      correct_answer: "Brother or Self",
      explanation: "Your father's son is either you (if you're male) or your brother.",
      type: "blood_relations",
      difficulty: "easy"
    };

    return {
      id: "VRT7",
      title: "Verbal Reasoning Test 7 - Blood Relations & Logical Puzzles",
      description: "Advanced verbal reasoning (Limited mode)",
      timeLimit: 35,
      sections: [{
        id: "VRT7_S1_FALLBACK",
        title: "Blood Relations & Logical Puzzles - Limited Mode",
        description: "Sample question due to loading error",
        instructions: [
          "This is a fallback mode with limited questions.",
          "Please contact administrator if this persists."
        ],
        duration_minutes: 35,
        questions: [{
          passage_title: "Blood Relations - Sample Question",
          passage_text: "This is a sample blood relations question to test basic functionality.",
          passage_id: "VRT7_FALLBACK_P1",
          questions: [fallbackQuestion]
        }]
      }],
      questions: [fallbackQuestion],
      error: "Failed to load full question set"
    };
  }
}

// Export metadata
export const vrt7Metadata = {
  total_items: 25,
  blood_relations_count: 15,
  logical_puzzles_count: 10,
  difficulty_distribution: {
    easy: 40,
    medium: 40,
    hard: 20
  },
  version: "2.0",
  last_updated: "2025-09-08"
};
