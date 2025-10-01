/**
 * Universal Test Scoring System
 *
 * A comprehensive, scalable scoring system for all test types in the skills assessment platform.
 * This system calculates scores based on accuracy, difficulty, and time efficiency.
 *
 * @author JobGate Career Quest
 * @version 1.0.0
 */

/**
 * Global scoring configuration for tests
 * @typedef {Object} GlobalScoringConfig
 * @property {number} timeWeight - Weight for time-based scoring (0-1)
 * @property {number} difficultyWeight - Weight for difficulty-based scoring (0-1)
 * @property {number} accuracyWeight - Weight for accuracy-based scoring (0-1)
 */

/**
 * Score weight configuration for individual questions
 * @typedef {Object} ScoreWeight
 * @property {number} base - Base score for correct answer
 * @property {number} difficultyBonus - Bonus multiplier for difficulty level
 * @property {number} timeFactor - Time efficiency factor multiplier
 */

/**
 * Question object structure with scoring weights
 * @typedef {Object} QuestionWithScoring
 * @property {string} id - Unique question identifier
 * @property {string} type - Question type (e.g., "multiple_choice")
 * @property {string} question - Question text
 * @property {string[]} options - Available answer options
 * @property {string} correct_answer - Correct answer identifier
 * @property {number} difficulty - Difficulty level (1-5)
 * @property {number} section - Section number
 * @property {ScoreWeight} scoreWeight - Scoring configuration
 */

/**
 * Default global scoring configuration
 * @constant {GlobalScoringConfig}
 */
export const DEFAULT_SCORING_CONFIG = {
 timeWeight: 0.3,
 difficultyWeight: 0.5,
 accuracyWeight: 0.2
};

/**
 * Default score weight configuration for questions
 * @constant {ScoreWeight}
 */
export const DEFAULT_SCORE_WEIGHT = {
 base: 5,
 difficultyBonus: 2,
 timeFactor: 1
};

/**
 * Time efficiency thresholds (in seconds)
 * @constant {Object}
 */
export const TIME_THRESHOLDS = {
 EXCELLENT: 15, // Very fast - maximum time bonus
 GOOD: 30, // Good speed - moderate time bonus
 AVERAGE: 60, // Average speed - minimal time bonus
 SLOW: 120 // Slow - no time bonus, potential penalty
};

/**
 * Difficulty level multipliers
 * @constant {Object}
 */
export const DIFFICULTY_MULTIPLIERS = {
 1: 0.8, // Easy - reduced bonus
 2: 1.0, // Medium - standard bonus
 3: 1.2, // Hard - increased bonus
 4: 1.5, // Very hard - high bonus
 5: 2.0 // Expert - maximum bonus
};

/**
 * Calculates the score for a single question based on user's answer, time taken, and scoring configuration.
 *
 * Scoring Rules:
 * 1. Wrong answer → score = 0
 * 2. Start with base score
 * 3. Add (difficulty × difficultyBonus × difficultyWeight)
 * 4. Apply time efficiency factor (faster = better, slower = smaller bonus)
 * 5. Apply accuracyWeight as final multiplier
 *
 * @param {QuestionWithScoring} question - Question object with scoring weights
 * @param {string} userAnswer - User's selected answer
 * @param {number} timeTaken - Time taken to answer (in seconds)
 * @param {GlobalScoringConfig} globalConfig - Global scoring configuration
 * @returns {number} Final score as rounded integer
 *
 * @example
 * const question = {
 * id: "logical_1_1",
 * type: "multiple_choice",
 * question: "What comes next in the series: 2, 4, 6, 8, ...?",
 * options: ["10", "12", "14", "16"],
 * correct_answer: "a",
 * difficulty: 2,
 * section: 1,
 * scoreWeight: {
 * base: 5,
 * difficultyBonus: 2,
 * timeFactor: 1
 * }
 * };
 *
 * const score = calculateScore(question, "a", 20, DEFAULT_SCORING_CONFIG);
 * console.log(score); // Returns calculated score
 */
export function calculateScore(question, userAnswer, timeTaken, globalConfig = DEFAULT_SCORING_CONFIG) {
 // Input validation
 if (!question || !userAnswer || typeof timeTaken !== 'number' || timeTaken < 0) {
 console.warn('Invalid input parameters for calculateScore');
 return 0;
 }

 // Rule 1: Wrong answer → score = 0
 if (userAnswer !== question.correct_answer) {
 return 0;
 }

 // Rule 2: Start with base score
 const baseScore = question.scoreWeight?.base || DEFAULT_SCORE_WEIGHT.base;

 // Rule 3: Add (difficulty × difficultyBonus × difficultyWeight)
 const difficulty = Math.max(1, Math.min(5, question.difficulty || 1));
 const difficultyBonus = question.scoreWeight?.difficultyBonus || DEFAULT_SCORE_WEIGHT.difficultyBonus;
 const difficultyMultiplier = DIFFICULTY_MULTIPLIERS[difficulty] || 1.0;
 const difficultyScore = difficulty * difficultyBonus * globalConfig.difficultyWeight * difficultyMultiplier;

 // Rule 4: Apply time efficiency factor
 const timeEfficiency = calculateTimeEfficiency(timeTaken, question.difficulty);
 const timeBonus = timeEfficiency * globalConfig.timeWeight;

 // Rule 5: Apply accuracyWeight as final multiplier
 const preliminaryScore = baseScore + difficultyScore + timeBonus;
 const finalScore = preliminaryScore * globalConfig.accuracyWeight;

 // Return rounded integer
 return Math.round(Math.max(0, finalScore));
}

/**
 * Calculates time efficiency factor based on time taken and question difficulty.
 * Faster answers get higher efficiency scores.
 *
 * @param {number} timeTaken - Time taken in seconds
 * @param {number} difficulty - Question difficulty level (1-5)
 * @returns {number} Time efficiency factor (0-2)
 */
export function calculateTimeEfficiency(timeTaken, difficulty = 1) {
 // Adjust thresholds based on difficulty
 const adjustedThresholds = {
 EXCELLENT: TIME_THRESHOLDS.EXCELLENT * (1 + (difficulty - 1) * 0.2),
 GOOD: TIME_THRESHOLDS.GOOD * (1 + (difficulty - 1) * 0.3),
 AVERAGE: TIME_THRESHOLDS.AVERAGE * (1 + (difficulty - 1) * 0.4),
 SLOW: TIME_THRESHOLDS.SLOW * (1 + (difficulty - 1) * 0.5)
 };

 if (timeTaken <= adjustedThresholds.EXCELLENT) {
 return 2.0; // Maximum time bonus
 } else if (timeTaken <= adjustedThresholds.GOOD) {
 return 1.5; // Good time bonus
 } else if (timeTaken <= adjustedThresholds.AVERAGE) {
 return 1.0; // Standard time bonus
 } else if (timeTaken <= adjustedThresholds.SLOW) {
 return 0.5; // Reduced time bonus
 } else {
 return 0.2; // Minimal time bonus for very slow answers
 }
}

/**
 * Calculates total test score from multiple question results.
 *
 * @param {Array} questionResults - Array of question results with scores
 * @param {GlobalScoringConfig} globalConfig - Global scoring configuration
 * @returns {Object} Total score breakdown
 */
export function calculateTotalScore(questionResults, globalConfig = DEFAULT_SCORING_CONFIG) {
 if (!Array.isArray(questionResults) || questionResults.length === 0) {
 return {
 totalScore: 0,
 maxPossibleScore: 0,
 percentage: 0,
 correctAnswers: 0,
 totalQuestions: 0,
 averageTime: 0,
 difficultyBreakdown: {}
 };
 }

 const totalScore = questionResults.reduce((sum, result) => sum + (result.score || 0), 0);
 const maxPossibleScore = questionResults.reduce((sum, result) => {
 const question = result.question;
 const baseScore = question.scoreWeight?.base || DEFAULT_SCORE_WEIGHT.base;
 const difficulty = question.difficulty || 1;
 const difficultyBonus = question.scoreWeight?.difficultyBonus || DEFAULT_SCORE_WEIGHT.difficultyBonus;
 const difficultyMultiplier = DIFFICULTY_MULTIPLIERS[difficulty] || 1.0;
 const maxDifficultyScore = difficulty * difficultyBonus * globalConfig.difficultyWeight * difficultyMultiplier;
 const maxTimeBonus = 2.0 * globalConfig.timeWeight; // Maximum time efficiency
 const maxScore = (baseScore + maxDifficultyScore + maxTimeBonus) * globalConfig.accuracyWeight;
 return sum + Math.round(maxScore);
 }, 0);

 const correctAnswers = questionResults.filter(result => result.score > 0).length;
 const totalQuestions = questionResults.length;
 const percentage = maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 0;

 const averageTime = questionResults.reduce((sum, result) => sum + (result.timeTaken || 0), 0) / totalQuestions;

 // Difficulty breakdown
 const difficultyBreakdown = {};
 questionResults.forEach(result => {
 const difficulty = result.question.difficulty || 1;
 if (!difficultyBreakdown[difficulty]) {
 difficultyBreakdown[difficulty] = { correct: 0, total: 0, totalScore: 0 };
 }
 difficultyBreakdown[difficulty].total++;
 if (result.score > 0) {
 difficultyBreakdown[difficulty].correct++;
 }
 difficultyBreakdown[difficulty].totalScore += result.score || 0;
 });

 return {
 totalScore,
 maxPossibleScore,
 percentage,
 correctAnswers,
 totalQuestions,
 averageTime: Math.round(averageTime * 100) / 100,
 difficultyBreakdown
 };
}

/**
 * Creates a question object with default scoring weights if not provided.
 *
 * @param {Object} questionData - Basic question data
 * @param {ScoreWeight} customScoreWeight - Optional custom scoring weights
 * @returns {QuestionWithScoring} Enhanced question object
 */
export function enhanceQuestionWithScoring(questionData, customScoreWeight = null) {
 return {
 ...questionData,
 scoreWeight: customScoreWeight || DEFAULT_SCORE_WEIGHT
 };
}

/**
 * Batch processes multiple questions to add scoring weights.
 *
 * @param {Array} questions - Array of question objects
 * @param {ScoreWeight} defaultScoreWeight - Default scoring weights to apply
 * @returns {Array<QuestionWithScoring>} Enhanced questions with scoring weights
 */
export function enhanceQuestionsWithScoring(questions, defaultScoreWeight = null) {
 if (!Array.isArray(questions)) {
 return [];
 }

 return questions.map(question => enhanceQuestionWithScoring(question, defaultScoreWeight));
}

/**
 * Validates scoring configuration to ensure weights sum to approximately 1.0.
 *
 * @param {GlobalScoringConfig} config - Configuration to validate
 * @returns {Object} Validation result with isValid and suggestions
 */
export function validateScoringConfig(config) {
 const sum = config.timeWeight + config.difficultyWeight + config.accuracyWeight;
 const tolerance = 0.01; // Allow small floating point differences

 return {
 isValid: Math.abs(sum - 1.0) < tolerance,
 sum,
 suggestion: sum !== 1.0 ? `Weights should sum to 1.0. Current sum: ${sum.toFixed(3)}` : null
 };
}

/**
 * Preset scoring configurations for different test types
 */
export const SCORING_PRESETS = {
 // Standard configuration - balanced approach
 STANDARD: {
 timeWeight: 0.3,
 difficultyWeight: 0.5,
 accuracyWeight: 0.2
 },

 // Speed-focused - emphasizes quick thinking
 SPEED_FOCUSED: {
 timeWeight: 0.5,
 difficultyWeight: 0.3,
 accuracyWeight: 0.2
 },

 // Accuracy-focused - emphasizes correctness over speed
 ACCURACY_FOCUSED: {
 timeWeight: 0.2,
 difficultyWeight: 0.3,
 accuracyWeight: 0.5
 },

 // Difficulty-focused - emphasizes challenging questions
 DIFFICULTY_FOCUSED: {
 timeWeight: 0.2,
 difficultyWeight: 0.6,
 accuracyWeight: 0.2
 },

 // Balanced with slight speed emphasis
 BALANCED_SPEED: {
 timeWeight: 0.4,
 difficultyWeight: 0.4,
 accuracyWeight: 0.2
 }
};

/**
 * Utility function to get a scoring preset by name
 *
 * @param {string} presetName - Name of the preset (e.g., 'STANDARD', 'SPEED_FOCUSED')
 * @returns {GlobalScoringConfig} Scoring configuration
 */
export function getScoringPreset(presetName) {
 return SCORING_PRESETS[presetName] || DEFAULT_SCORING_CONFIG;
}

/**
 * Debug utility to log detailed scoring breakdown for a question
 *
 * @param {QuestionWithScoring} question - Question object
 * @param {string} userAnswer - User's answer
 * @param {number} timeTaken - Time taken
 * @param {GlobalScoringConfig} globalConfig - Global config
 */
export function debugScoreCalculation(question, userAnswer, timeTaken, globalConfig = DEFAULT_SCORING_CONFIG) {
 console.group(`Score Calculation Debug - ${question.id}`);

 const isCorrect = userAnswer === question.correct_answer;
 console.log('Correct Answer:', isCorrect);

 if (!isCorrect) {
 console.log('Final Score: 0 (incorrect answer)');
 console.groupEnd();
 return;
 }

 const baseScore = question.scoreWeight?.base || DEFAULT_SCORE_WEIGHT.base;
 const difficulty = question.difficulty || 1;
 const difficultyBonus = question.scoreWeight?.difficultyBonus || DEFAULT_SCORE_WEIGHT.difficultyBonus;
 const difficultyMultiplier = DIFFICULTY_MULTIPLIERS[difficulty] || 1.0;
 const difficultyScore = difficulty * difficultyBonus * globalConfig.difficultyWeight * difficultyMultiplier;
 const timeEfficiency = calculateTimeEfficiency(timeTaken, difficulty);
 const timeBonus = timeEfficiency * globalConfig.timeWeight;
 const preliminaryScore = baseScore + difficultyScore + timeBonus;
 const finalScore = preliminaryScore * globalConfig.accuracyWeight;

 console.log('Base Score:', baseScore);
 console.log('Difficulty:', difficulty);
 console.log('Difficulty Multiplier:', difficultyMultiplier);
 console.log('Difficulty Score:', difficultyScore);
 console.log('Time Taken:', timeTaken, 'seconds');
 console.log('Time Efficiency:', timeEfficiency);
 console.log('Time Bonus:', timeBonus);
 console.log('Preliminary Score:', preliminaryScore);
 console.log('Accuracy Weight:', globalConfig.accuracyWeight);
 console.log('Final Score:', Math.round(finalScore));

 console.groupEnd();
}

// Export all utilities for easy importing
export default {
 calculateScore,
 calculateTimeEfficiency,
 calculateTotalScore,
 enhanceQuestionWithScoring,
 enhanceQuestionsWithScoring,
 validateScoringConfig,
 getScoringPreset,
 debugScoreCalculation,
 DEFAULT_SCORING_CONFIG,
 DEFAULT_SCORE_WEIGHT,
 TIME_THRESHOLDS,
 DIFFICULTY_MULTIPLIERS,
 SCORING_PRESETS
};

