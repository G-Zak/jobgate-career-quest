// Randomized Test Generation Service
// Integrates with existing test system to provide dynamic, cheat-resistant tests

import {
 readingComprehensionPools,
 verbalAnalogyPools,
 generateRandomizedTest,
 selectRandomQuestions
} from './verbalQuestionPools.js';

// ==========================================
// ANTI-CHEATING FEATURES
// ==========================================

/**
 * Generates a unique test session with randomized questions
 * This prevents users from memorizing questions across attempts
 */
export class RandomizedTestGenerator {
 constructor() {
 this.sessionHistory = new Map(); // Track user sessions
 this.questionUsageFrequency = new Map(); // Track question frequency
 }

 /**
 * Generate a test that's unique for this user session
 * @param {string} userId - User identifier
 * @param {string} testType - Type of test to generate
 * @param {Object} options - Test configuration options
 * @returns {Object} Unique test configuration
 */
 generateUniqueTest(userId, testType = 'VRT', options = {}) {
 const {
 questionCount = 20,
 difficulty = 'intermediate',
 avoidRecentQuestions = true,
 maxQuestionReuse = 3 // How many times a question can be reused before being retired
 } = options;

 // Get user's question history
 const userHistory = this.sessionHistory.get(userId) || { usedQuestions: new Set(), testCount: 0 };

 // Select questions avoiding recently used ones
 let availableQuestions = this.getAvailableQuestions(testType, difficulty, userHistory.usedQuestions, avoidRecentQuestions);

 // If we don't have enough fresh questions, include some used ones
 if (availableQuestions.length < questionCount) {
 const allQuestions = this.getAllQuestions(testType, difficulty);
 const additionalQuestions = allQuestions.filter(q => !availableQuestions.some(aq => aq.id === q.id));
 availableQuestions = [...availableQuestions, ...additionalQuestions];
 }

 // Shuffle and select questions
 const shuffledQuestions = this.shuffleArray([...availableQuestions]);
 const selectedQuestions = shuffledQuestions.slice(0, questionCount);

 // Update user history
 selectedQuestions.forEach(q => {
 userHistory.usedQuestions.add(q.id);
 this.updateQuestionUsage(q.id);
 });

 userHistory.testCount++;
 this.sessionHistory.set(userId, userHistory);

 // Generate test configuration
 const testConfig = this.createTestConfiguration(selectedQuestions, testType, difficulty, userHistory.testCount);

 return testConfig;
 }

 /**
 * Get available questions for a test type, avoiding overused questions
 */
 getAvailableQuestions(testType, difficulty, usedQuestions, avoidRecent) {
 let allQuestions = this.getAllQuestions(testType, difficulty);

 if (avoidRecent) {
 // Filter out recently used questions
 allQuestions = allQuestions.filter(q => !usedQuestions.has(q.id));
 }

 // Filter out overused questions
 allQuestions = allQuestions.filter(q => {
 const usageCount = this.questionUsageFrequency.get(q.id) || 0;
 return usageCount < 3; // Max 3 uses before retirement
 });

 return allQuestions;
 }

 /**
 * Get all questions for a specific test type and difficulty
 */
 getAllQuestions(testType, difficulty) {
 if (testType.includes('VRT') || testType === 'reading_comprehension') {
 return Object.values(readingComprehensionPools).flat();
 } else if (testType === 'verbal_analogies') {
 if (difficulty === 'basic') {
 return verbalAnalogyPools.basicRelationships;
 } else {
 return [...verbalAnalogyPools.basicRelationships, ...verbalAnalogyPools.advancedRelationships];
 }
 }
 return [];
 }

 /**
 * Update question usage frequency for analytics
 */
 updateQuestionUsage(questionId) {
 const currentCount = this.questionUsageFrequency.get(questionId) || 0;
 this.questionUsageFrequency.set(questionId, currentCount + 1);
 }

 /**
 * Shuffle array using Fisher-Yates algorithm
 */
 shuffleArray(array) {
 const shuffled = [...array];
 for (let i = shuffled.length - 1; i > 0; i--) {
 const j = Math.floor(Math.random() * (i + 1));
 [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
 }
 return shuffled;
 }

 /**
 * Create a complete test configuration
 */
 createTestConfiguration(questions, testType, difficulty, testNumber) {
 const baseId = testType.includes('VRT') ? testType : `${testType}_${difficulty}`;

 return {
 id: `${baseId}_${Date.now()}_${testNumber}`,
 title: this.getTestTitle(testType, difficulty, testNumber),
 description: this.getTestDescription(testType, difficulty),
 duration_minutes: Math.ceil(questions.length * 1.5),
 difficulty,
 question_type: 'verbal_reasoning',
 total_questions: questions.length,
 questions: questions,
 generated_at: new Date().toISOString(),
 session_id: `session_${Date.now()}`,
 randomization_applied: true,
 intro_text: {
 title: this.getTestTitle(testType, difficulty, testNumber).toUpperCase(),
 instructions: [
 "Instructions",
 "",
 `This test contains ${questions.length} questions randomly selected from our question bank.`,
 "",
 "Each question has been carefully chosen to assess your verbal reasoning abilities.",
 "",
 "Read each passage carefully and answer the questions based only on the information provided.",
 "",
 "You cannot return to previous questions once you move forward.",
 "",
 "Try to find a quiet place where you will not be interrupted during the test."
 ]
 }
 };
 }

 getTestTitle(testType, difficulty, testNumber) {
 if (testType.includes('VRT')) {
 return `Verbal Reasoning Test ${testType.replace('VRT', '')} (Attempt ${testNumber})`;
 }
 return `${testType.replace('_', ' ').toUpperCase()} Test - ${difficulty.toUpperCase()} (Attempt ${testNumber})`;
 }

 getTestDescription(testType, difficulty) {
 const descriptions = {
 'reading_comprehension': {
 'basic': 'Reading comprehension with straightforward True/False/Cannot Say questions',
 'intermediate': 'Reading comprehension with varied question types and moderate complexity',
 'advanced': 'Advanced reading comprehension requiring critical thinking and inference skills'
 },
 'verbal_analogies': {
 'basic': 'Basic verbal analogies testing fundamental relationship recognition',
 'intermediate': 'Intermediate analogies with varied relationship types',
 'advanced': 'Complex analogies requiring abstract thinking and advanced vocabulary'
 }
 };

 const typeKey = testType.includes('VRT') ? 'reading_comprehension' : testType;
 return descriptions[typeKey]?.[difficulty] || 'Verbal reasoning assessment';
 }

 /**
 * Get analytics on question usage and test patterns
 */
 getAnalytics() {
 return {
 totalUsers: this.sessionHistory.size,
 totalQuestions: this.questionUsageFrequency.size,
 averageTestsPerUser: Array.from(this.sessionHistory.values()).reduce((sum, user) => sum + user.testCount, 0) / this.sessionHistory.size,
 questionUsageDistribution: Object.fromEntries(this.questionUsageFrequency),
 mostUsedQuestions: Array.from(this.questionUsageFrequency.entries())
 .sort(([,a], [,b]) => b - a)
 .slice(0, 10),
 retiredQuestions: Array.from(this.questionUsageFrequency.entries())
 .filter(([, count]) => count >= 3)
 .map(([id]) => id)
 };
 }

 /**
 * Reset user history (for testing or privacy)
 */
 resetUserHistory(userId) {
 this.sessionHistory.delete(userId);
 }

 /**
 * Add new questions to the pools dynamically
 */
 addQuestionsToPool(poolName, questions) {
 // This would integrate with your content management system
 console.log(`Adding ${questions.length} questions to ${poolName} pool`);
 // Implementation would depend on how you store the question pools
 }
}

// ==========================================
// INTEGRATION WITH EXISTING SYSTEM
// ==========================================

// Global instance for the application
export const testGenerator = new RandomizedTestGenerator();

/**
 * Modify existing VRT functions to use randomized questions
 */
export const getRandomizedVerbalSection = (sectionNumber, userId, options = {}) => {
 const testType = `VRT${sectionNumber}`;
 return testGenerator.generateUniqueTest(userId, testType, {
 questionCount: 20,
 difficulty: 'intermediate',
 ...options
 });
};

/**
 * Generate a completely new test type with analogies
 */
export const getVerbalAnalogiesTest = (userId, difficulty = 'intermediate') => {
 return testGenerator.generateUniqueTest(userId, 'verbal_analogies', {
 questionCount: 15,
 difficulty
 });
};

// ==========================================
// SCORING AND VALIDATION
// ==========================================

export class TestScoringService {
 constructor() {
 this.completedTests = new Map();
 }

 /**
 * Score a completed test
 */
 scoreTest(testId, userId, answers) {
 const test = this.getTestById(testId);
 if (!test) {
 throw new Error('Test not found');
 }

 let correctAnswers = 0;
 const detailedResults = [];

 test.questions.forEach((passage, passageIndex) => {
 if (passage.questions) {
 // Reading comprehension format
 passage.questions.forEach((question, questionIndex) => {
 const userAnswer = answers[`${passageIndex}_${questionIndex}_${question.id}`];
 const isCorrect = userAnswer === question.correct_answer;

 if (isCorrect) correctAnswers++;

 detailedResults.push({
 passageTitle: passage.passage_title,
 questionId: question.id,
 questionText: question.question_text,
 userAnswer,
 correctAnswer: question.correct_answer,
 isCorrect,
 explanation: question.explanation
 });
 });
 } else if (passage.correct_answer) {
 // Verbal analogies format
 const userAnswer = answers[passage.id];
 const isCorrect = userAnswer === passage.correct_answer;

 if (isCorrect) correctAnswers++;

 detailedResults.push({
 questionId: passage.id,
 questionText: passage.question_text,
 userAnswer,
 correctAnswer: passage.correct_answer,
 isCorrect,
 explanation: passage.explanation
 });
 }
 });

 const totalQuestions = this.getTotalQuestions(test);
 const score = (correctAnswers / totalQuestions) * 100;

 const result = {
 testId,
 userId,
 score: Math.round(score * 100) / 100,
 correctAnswers,
 totalQuestions,
 percentage: Math.round(score),
 detailedResults,
 completedAt: new Date().toISOString(),
 difficulty: test.difficulty,
 testType: test.question_type
 };

 this.completedTests.set(`${userId}_${testId}`, result);
 return result;
 }

 getTotalQuestions(test) {
 if (test.questions[0]?.questions) {
 // Reading comprehension format
 return test.questions.reduce((total, passage) => total + passage.questions.length, 0);
 } else {
 // Verbal analogies format
 return test.questions.length;
 }
 }

 getTestById(testId) {
 // This would integrate with your test storage system
 // For now, return a placeholder
 return null;
 }

 getUserTestHistory(userId) {
 const userTests = [];
 for (const [key, result] of this.completedTests.entries()) {
 if (key.startsWith(`${userId}_`)) {
 userTests.push(result);
 }
 }
 return userTests.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
 }
}

export const scoringService = new TestScoringService();
