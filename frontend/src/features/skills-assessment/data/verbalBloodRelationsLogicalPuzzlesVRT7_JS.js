// VRT7: Blood Relations and Logical Puzzles Test Data
// Converted from JSONL to JavaScript for better compatibility

export const vrt7QuestionsData = [
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
  }
];

// Metadata
export const vrt7Metadata = {
  total_items: 100,
  blood_relations_count: 50,
  logical_puzzles_count: 50,
  difficulty_distribution: {
    easy: 40,
    medium: 40,
    hard: 20
  }
};

// Utility functions
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const getQuestionsByType = (type) => {
  return vrt7QuestionsData.filter(q => q.type === type);
};

const getQuestionsByDifficulty = (questions, difficulty) => {
  return questions.filter(q => q.difficulty === difficulty);
};

// Main test generation function
export function getRandomizedVRT7Test(questionCount = 25) {
  const bloodRelationsQuestions = getQuestionsByType('blood_relations');
  const logicalPuzzlesQuestions = getQuestionsByType('logical_puzzles');
  
  // Get balanced selection (roughly 50/50 split)
  const brCount = Math.ceil(questionCount / 2);
  const lpCount = questionCount - brCount;
  
  // Shuffle and select questions
  const selectedBR = shuffleArray(bloodRelationsQuestions).slice(0, brCount);
  const selectedLP = shuffleArray(logicalPuzzlesQuestions).slice(0, lpCount);
  
  // Combine and shuffle final selection
  const allSelected = shuffleArray([...selectedBR, ...selectedLP]);
  
  // Renumber questions sequentially
  const numberedQuestions = allSelected.map((q, index) => ({
    ...q,
    id: index + 1
  }));
  
  return {
    id: "VRT7",
    title: "Verbal Reasoning Test 7 - Blood Relations & Logical Puzzles",
    description: "Advanced verbal reasoning with family relationships and logical puzzle solving",
    timeLimit: 35,
    questions: numberedQuestions
  };
}
