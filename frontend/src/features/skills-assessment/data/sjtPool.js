import masterSJTPool from './masterSJTPool.jsonl?raw';

// Load and parse SJT questions from the JSONL file
export function loadSjtPool(testId = 'situational') {
  try {
    const lines = masterSJTPool.trim().split('\n');
    const questions = lines
      .filter(line => line.trim() && !line.includes('"total_items"')) // Exclude metadata
      .map(line => {
        try {
          const question = JSON.parse(line);
          // Transform the data structure to match the expected format
          return {
            id: question.id,
            scenario: question.scenario,
            prompt: "What would you do in this situation?",
            options: question.choices.map((choice, index) => ({
              id: String.fromCharCode(65 + index), // A, B, C, D
              text: choice
            })),
            correct: String.fromCharCode(65 + question.answer_index), // Convert 0-based to A, B, C, D
            domain: question.domain,
            difficulty: question.difficulty,
            explanation: question.explanation,
            tags: question.tags
          };
        } catch (e) {
          console.warn('Failed to parse question line:', line);
          return null;
        }
      })
      .filter(Boolean);

    // Shuffle questions for mixed difficulty
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    
    console.log(`Loaded ${shuffled.length} SJT questions`);
    return shuffled;
  } catch (error) {
    console.error('Failed to load SJT pool:', error);
    return [];
  }
}

// Helper function to get questions by domain
export function getSjtQuestionsByDomain(domain) {
  const allQuestions = loadSjtPool();
  return allQuestions.filter(q => q.domain === domain);
}

// Helper function to get questions by difficulty
export function getSjtQuestionsByDifficulty(difficulty) {
  const allQuestions = loadSjtPool();
  return allQuestions.filter(q => q.difficulty === difficulty);
}
