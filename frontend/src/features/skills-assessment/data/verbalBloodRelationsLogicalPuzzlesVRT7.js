// VRT7: Blood Relations and Logical Puzzles Test
// This module handles the JSONL data and provides randomized test generation

import verbalReasoningVRT7Data from './verbalReasoningVRT7.jsonl?raw';

// Parse JSONL data
const parseJSONL = (jsonlText) => {
  const lines = jsonlText.trim().split('\n');
  const questions = [];
  let metadata = null;
  
  lines.forEach(line => {
    try {
      const parsed = JSON.parse(line);
      if (parsed.total_items !== undefined) {
        // This is the metadata object
        metadata = parsed;
      } else {
        // This is a question object
        questions.push(parsed);
      }
    } catch (error) {
      console.warn('Failed to parse JSONL line:', line, error);
    }
  });
  
  return { questions, metadata };
};

// Load and parse the VRT7 data
const { questions: allQuestions, metadata } = parseJSONL(verbalReasoningVRT7Data);

// Separate questions by type
const bloodRelationsQuestions = allQuestions.filter(q => q.type === 'blood_relations');
const logicalPuzzlesQuestions = allQuestions.filter(q => q.type === 'logical_puzzles');

// Separate by difficulty
const getQuestionsByDifficulty = (questions, difficulty) => {
  return questions.filter(q => q.difficulty === difficulty);
};

// Shuffle array utility
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Generate randomized test
export const getRandomizedVRT7Test = (questionCount = 30) => {
  // Calculate distribution
  const bloodRelationsCount = Math.floor(questionCount * 0.5);
  const logicalPuzzlesCount = questionCount - bloodRelationsCount;
  
  // Difficulty distribution (40% easy, 40% medium, 20% hard)
  const easyCount = Math.floor(questionCount * 0.4);
  const mediumCount = Math.floor(questionCount * 0.4);
  const hardCount = questionCount - easyCount - mediumCount;
  
  // Get questions by difficulty for each type
  const bloodEasy = shuffleArray(getQuestionsByDifficulty(bloodRelationsQuestions, 'easy'));
  const bloodMedium = shuffleArray(getQuestionsByDifficulty(bloodRelationsQuestions, 'medium'));
  const bloodHard = shuffleArray(getQuestionsByDifficulty(bloodRelationsQuestions, 'hard'));
  
  const logicEasy = shuffleArray(getQuestionsByDifficulty(logicalPuzzlesQuestions, 'easy'));
  const logicMedium = shuffleArray(getQuestionsByDifficulty(logicalPuzzlesQuestions, 'medium'));
  const logicHard = shuffleArray(getQuestionsByDifficulty(logicalPuzzlesQuestions, 'hard'));
  
  // Select questions maintaining both type and difficulty distribution
  const selectedQuestions = [];
  
  // Distribute difficulty across both types
  const bloodEasyCount = Math.floor(easyCount * 0.5);
  const bloodMediumCount = Math.floor(mediumCount * 0.5);
  const bloodHardCount = Math.floor(hardCount * 0.5);
  
  const logicEasyCount = easyCount - bloodEasyCount;
  const logicMediumCount = mediumCount - bloodMediumCount;
  const logicHardCount = hardCount - bloodHardCount;
  
  // Add blood relations questions
  selectedQuestions.push(...bloodEasy.slice(0, bloodEasyCount));
  selectedQuestions.push(...bloodMedium.slice(0, bloodMediumCount));
  selectedQuestions.push(...bloodHard.slice(0, bloodHardCount));
  
  // Add logical puzzles questions
  selectedQuestions.push(...logicEasy.slice(0, logicEasyCount));
  selectedQuestions.push(...logicMedium.slice(0, logicMediumCount));
  selectedQuestions.push(...logicHard.slice(0, logicHardCount));
  
  // Shuffle final question order
  const finalQuestions = shuffleArray(selectedQuestions);
  
  // Convert to VRT format
  const convertedQuestions = finalQuestions.map((q, index) => ({
    id: index + 1,
    question_text: q.stem || q.question,
    question_type: q.type === 'blood_relations' ? 'blood_relations' : 'logical_puzzles',
    subtype: q.subtype || null,
    context: q.context || null,
    statements: q.statements || null,
    options: q.choices,
    correct_answer: q.answer,
    correct_answer_index: q.answer_index,
    difficulty: q.difficulty,
    explanation: q.explanation,
    tags: q.tags || [],
    structure: q.structure || null,
    logic_system: q.logic_system || null
  }));
  
  return {
    title: "Blood Relations & Logical Puzzles",
    description: "Advanced verbal reasoning test covering family relationships and logical problem solving",
    timeLimit: 35, // minutes
    totalQuestions: convertedQuestions.length,
    questionCount: convertedQuestions.length,
    questions: convertedQuestions,
    questionTypes: {
      blood_relations: convertedQuestions.filter(q => q.question_type === 'blood_relations').length,
      logical_puzzles: convertedQuestions.filter(q => q.question_type === 'logical_puzzles').length
    },
    difficultyDistribution: {
      easy: convertedQuestions.filter(q => q.difficulty === 'easy').length,
      medium: convertedQuestions.filter(q => q.difficulty === 'medium').length,
      hard: convertedQuestions.filter(q => q.difficulty === 'hard').length
    },
    metadata: {
      version: "1.0",
      created: new Date().toISOString(),
      totalAvailableQuestions: allQuestions.length,
      antiCheating: true,
      randomized: true
    }
  };
};

// Export question pools for analysis
export const getVRT7Statistics = () => {
  return {
    totalQuestions: allQuestions.length,
    bloodRelations: bloodRelationsQuestions.length,
    logicalPuzzles: logicalPuzzlesQuestions.length,
    byDifficulty: {
      easy: getQuestionsByDifficulty(allQuestions, 'easy').length,
      medium: getQuestionsByDifficulty(allQuestions, 'medium').length,
      hard: getQuestionsByDifficulty(allQuestions, 'hard').length
    },
    metadata
  };
};

// Default export
export default {
  getRandomizedTest: getRandomizedVRT7Test,
  getStatistics: getVRT7Statistics,
  title: "Blood Relations & Logical Puzzles",
  description: "Test covering family relationships and logical reasoning",
  defaultQuestionCount: 30,
  timeLimit: 35,
  difficulty: "master",
  type: "blood_relations_logical_puzzles"
};
