/**
 * Universal Scoring Integration for Frontend
 *
 * This module provides a unified scoring system that works with all test types
 * in the frontend, integrating with the backend universal scoring system.
 *
 * @author JobGate Career Quest
 * @version 1.0.0
 */

import {
 calculateScore,
 calculateTotalScore,
 calculateTimeEfficiency,
 DEFAULT_SCORING_CONFIG,
 DEFAULT_SCORE_WEIGHT,
 SCORING_PRESETS
} from './scoringSystem.js';

/**
 * Universal test scoring manager for frontend
 */
export class UniversalTestScoring {
 constructor(testType = 'unknown', customConfig = null) {
 this.testType = testType;
 this.globalConfig = customConfig || this.getDefaultConfigForTestType(testType);
 this.userAnswers = new Map();
 this.timingData = new Map();
 this.startTime = null;
 this.questions = new Map();
 }

 /**
 * Get default configuration for test type
 * @param {string} testType - Type of test
 * @returns {Object} Default configuration
 */
 getDefaultConfigForTestType(testType) {
 switch (testType.toLowerCase()) {
 case 'numerical':
 return SCORING_PRESETS.NUMERICAL || {
 timeWeight: 0.4,
 difficultyWeight: 0.4,
 accuracyWeight: 0.2
 };
 case 'verbal':
 return SCORING_PRESETS.VERBAL || {
 timeWeight: 0.2,
 difficultyWeight: 0.3,
 accuracyWeight: 0.5
 };
 case 'abstract':
 return SCORING_PRESETS.ABSTRACT || {
 timeWeight: 0.3,
 difficultyWeight: 0.6,
 accuracyWeight: 0.1
 };
 case 'spatial':
 return SCORING_PRESETS.SPATIAL || {
 timeWeight: 0.3,
 difficultyWeight: 0.5,
 accuracyWeight: 0.2
 };
 case 'logical':
 return SCORING_PRESETS.LOGICAL || {
 timeWeight: 0.3,
 difficultyWeight: 0.5,
 accuracyWeight: 0.2
 };
 default:
 return DEFAULT_SCORING_CONFIG;
 }
 }

 /**
 * Load questions from any test format
 * @param {Array} rawQuestions - Array of questions in any format
 * @param {Object} globalConfig - Global scoring configuration
 */
 loadQuestions(rawQuestions, globalConfig = null) {
 if (globalConfig) {
 this.globalConfig = globalConfig;
 }

 if (!Array.isArray(rawQuestions)) {
 console.warn('Questions must be an array');
 return;
 }

 rawQuestions.forEach((question, index) => {
 const normalized = this.normalizeQuestion(question, index);
 this.questions.set(normalized.id, normalized);
 });

 console.log(`Loaded ${this.questions.size} questions for ${this.testType} test`);
 }

 /**
 * Normalize question from any format to universal format
 * @param {Object} question - Raw question in any format
 * @param {number} index - Question index
 * @returns {Object} Normalized question
 */
 normalizeQuestion(question, index) {
 // Handle different question formats
 let normalized = {
 id: question.id || `${this.testType}_${index + 1}`,
 type: question.type || 'multiple_choice',
 question: question.question || question.question_text || question.prompt,
 options: question.options || question.choices || [],
 correct_answer: question.correct_answer || question.correctAnswer || '',
 difficulty: question.difficulty || question.complexity_score || question.complexity || 1,
 section: question.section || 1,
 scoreWeight: question.scoreWeight || question.score_weight || DEFAULT_SCORE_WEIGHT,
 category: question.category || this.testType,
 originalFormat: this.testType
 };

 // Handle numerical test format specifically
 if (this.testType === 'numerical' && question.question_id) {
 normalized.id = `numerical_${question.question_id}`;
 normalized.type = 'numerical';
 normalized.question = question.question;

 // Extract options from numerical format
 if (question.options && Array.isArray(question.options)) {
 normalized.options = question.options.map(opt =>
 typeof opt === 'object' ? opt.text : opt
 );
 }

 normalized.correct_answer = question.correct_answer;
 normalized.difficulty = question.complexity_score || question.difficulty || 1;
 normalized.category = question.category || 'numerical_reasoning';
 }

 // Ensure scoreWeight is properly formatted
 if (!normalized.scoreWeight || typeof normalized.scoreWeight !== 'object') {
 normalized.scoreWeight = {
 base: 5,
 difficultyBonus: 2,
 timeFactor: 1
 };
 }

 return normalized;
 }

 /**
 * Start timing for a question
 * @param {string} questionId - Unique question identifier
 */
 startQuestionTimer(questionId) {
 this.timingData.set(questionId, {
 startTime: Date.now(),
 endTime: null,
 duration: null
 });
 }

 /**
 * Record user's answer and stop timing
 * @param {string} questionId - Unique question identifier
 * @param {string} answer - User's selected answer
 */
 recordAnswer(questionId, answer) {
 const timing = this.timingData.get(questionId);
 if (timing) {
 timing.endTime = Date.now();
 timing.duration = Math.round((timing.endTime - timing.startTime) / 1000);
 }

 this.userAnswers.set(questionId, {
 answer: answer.toString().toLowerCase(),
 timestamp: Date.now(),
 timeTaken: timing?.duration || 0
 });
 }

 /**
 * Calculate score for a specific question
 * @param {string} questionId - Question identifier
 * @returns {number} Calculated score
 */
 calculateQuestionScore(questionId) {
 const question = this.questions.get(questionId);
 const userData = this.userAnswers.get(questionId);

 if (!question || !userData) {
 return 0;
 }

 return calculateScore(
 question,
 userData.answer,
 userData.timeTaken,
 this.globalConfig
 );
 }

 /**
 * Calculate scores for all answered questions
 * @returns {Array} Array of question results with scores
 */
 calculateAllScores() {
 const results = [];

 this.questions.forEach((question, questionId) => {
 const userData = this.userAnswers.get(questionId);
 const score = userData ? this.calculateQuestionScore(questionId) : 0;

 results.push({
 question,
 userAnswer: userData?.answer || null,
 timeTaken: userData?.timeTaken || 0,
 score,
 isAnswered: !!userData
 });
 });

 return results;
 }

 /**
 * Get comprehensive test results
 * @returns {Object} Complete test results
 */
 getTestResults() {
 const questionResults = this.calculateAllScores();
 const totalScore = calculateTotalScore(questionResults, this.globalConfig);

 return {
 ...totalScore,
 testType: this.testType,
 questionResults,
 answeredQuestions: questionResults.filter(r => r.isAnswered).length,
 totalQuestions: this.questions.size,
 completionRate: Math.round((questionResults.filter(r => r.isAnswered).length / this.questions.size) * 100),
 testDuration: this.getTotalTestDuration(),
 scoringConfig: this.globalConfig
 };
 }

 /**
 * Get total test duration in seconds
 * @returns {number} Total test duration
 */
 getTotalTestDuration() {
 if (!this.startTime) return 0;
 return Math.round((Date.now() - this.startTime) / 1000);
 }

 /**
 * Start the overall test timer
 */
 startTest() {
 this.startTime = Date.now();
 }

 /**
 * Check if a question has been answered
 * @param {string} questionId - Question identifier
 * @returns {boolean} Whether question has been answered
 */
 isQuestionAnswered(questionId) {
 return this.userAnswers.has(questionId);
 }

 /**
 * Get user's answer for a specific question
 * @param {string} questionId - Question identifier
 * @returns {string|null} User's answer or null if not answered
 */
 getUserAnswer(questionId) {
 const userData = this.userAnswers.get(questionId);
 return userData?.answer || null;
 }

 /**
 * Get current test statistics
 * @returns {Object} Current statistics
 */
 getCurrentStats() {
 const answeredCount = this.userAnswers.size;
 const totalTime = this.getTotalTestDuration();

 return {
 answeredQuestions: answeredCount,
 totalQuestions: this.questions.size,
 totalTime,
 averageTimePerQuestion: answeredCount > 0 ? Math.round(totalTime / answeredCount) : 0,
 completionRate: this.questions.size > 0 ?
 Math.round((answeredCount / this.questions.size) * 100) : 0
 };
 }

 /**
 * Reset all tracking data
 */
 reset() {
 this.userAnswers.clear();
 this.timingData.clear();
 this.questions.clear();
 this.startTime = null;
 }

 /**
 * Get detailed score breakdown for a question
 * @param {string} questionId - Question identifier
 * @returns {Object} Detailed score breakdown
 */
 getScoreBreakdown(questionId) {
 const question = this.questions.get(questionId);
 const userData = this.userAnswers.get(questionId);

 if (!question || !userData) {
 return null;
 }

 // Calculate detailed breakdown
 const isCorrect = userData.answer === question.correct_answer.toLowerCase();

 if (!isCorrect) {
 return {
 correct: false,
 finalScore: 0,
 breakdown: {
 baseScore: question.scoreWeight.base,
 difficultyBonus: 0,
 timeBonus: 0,
 preliminaryScore: 0,
 accuracyMultiplier: this.globalConfig.accuracyWeight,
 finalScore: 0
 }
 };
 }

 const baseScore = question.scoreWeight.base;
 const difficultyBonus = question.difficulty * question.scoreWeight.difficultyBonus * this.globalConfig.difficultyWeight;
 const timeEfficiency = calculateTimeEfficiency(userData.timeTaken, question.difficulty, question.type);
 const timeBonus = timeEfficiency * this.globalConfig.timeWeight;
 const preliminaryScore = baseScore + difficultyBonus + timeBonus;
 const finalScore = preliminaryScore * this.globalConfig.accuracyWeight;

 return {
 correct: true,
 finalScore: Math.round(finalScore),
 breakdown: {
 baseScore,
 difficultyBonus: Math.round(difficultyBonus * 100) / 100,
 timeBonus: Math.round(timeBonus * 100) / 100,
 timeEfficiency: Math.round(timeEfficiency * 100) / 100,
 preliminaryScore: Math.round(preliminaryScore * 100) / 100,
 accuracyMultiplier: this.globalConfig.accuracyWeight,
 finalScore: Math.round(finalScore * 100) / 100
 },
 questionInfo: {
 type: question.type,
 difficulty: question.difficulty,
 timeTaken: userData.timeTaken
 }
 };
 }
}

/**
 * Hook for using universal scoring in React components
 * @param {string} testType - Type of test
 * @param {Object} customConfig - Custom scoring configuration
 * @returns {Object} Scoring utilities and state
 */
export function useUniversalScoring(testType = 'unknown', customConfig = null) {
 const [scoringSystem] = React.useState(() => new UniversalTestScoring(testType, customConfig));
 const [isTestStarted, setIsTestStarted] = React.useState(false);
 const [currentResults, setCurrentResults] = React.useState(null);

 const startTest = React.useCallback(() => {
 scoringSystem.startTest();
 setIsTestStarted(true);
 }, [scoringSystem]);

 const loadQuestions = React.useCallback((questions, config) => {
 scoringSystem.loadQuestions(questions, config);
 }, [scoringSystem]);

 const startQuestionTimer = React.useCallback((questionId) => {
 scoringSystem.startQuestionTimer(questionId);
 }, [scoringSystem]);

 const recordAnswer = React.useCallback((questionId, answer) => {
 scoringSystem.recordAnswer(questionId, answer);
 }, [scoringSystem]);

 const getResults = React.useCallback(() => {
 const rawResults = scoringSystem.getTestResults();
 setCurrentResults(rawResults);
 return rawResults;
 }, [scoringSystem]);

 const isAnswered = React.useCallback((questionId) => {
 return scoringSystem.isQuestionAnswered(questionId);
 }, [scoringSystem]);

 const getUserAnswer = React.useCallback((questionId) => {
 return scoringSystem.getUserAnswer(questionId);
 }, [scoringSystem]);

 const getCurrentStats = React.useCallback(() => {
 return scoringSystem.getCurrentStats();
 }, [scoringSystem]);

 const reset = React.useCallback(() => {
 scoringSystem.reset();
 setIsTestStarted(false);
 setCurrentResults(null);
 }, [scoringSystem]);

 return {
 // State
 isTestStarted,
 currentResults,

 // Actions
 startTest,
 loadQuestions,
 startQuestionTimer,
 recordAnswer,
 getResults,
 reset,

 // Utilities
 isAnswered,
 getUserAnswer,
 getCurrentStats,

 // Direct access
 scoringSystem
 };
}

/**
 * Utility function to create scoring integration for any test
 * @param {string} testType - Type of test
 * @param {Array} questions - Array of questions
 * @param {Object} customConfig - Custom configuration
 * @returns {Object} Ready-to-use scoring utilities
 */
export function createTestScoringIntegration(testType, questions = [], customConfig = null) {
 const scoring = new UniversalTestScoring(testType, customConfig);

 if (questions.length > 0) {
 scoring.loadQuestions(questions);
 }

 return {
 // Core methods
 startTest: () => scoring.startTest(),
 startQuestionTimer: (questionId) => scoring.startQuestionTimer(questionId),
 recordAnswer: (questionId, answer) => scoring.recordAnswer(questionId, answer),
 getResults: () => scoring.getTestResults(),

 // Utilities
 isAnswered: (questionId) => scoring.isQuestionAnswered(questionId),
 getUserAnswer: (questionId) => scoring.getUserAnswer(questionId),
 getCurrentStats: () => scoring.getCurrentStats(),
 getScoreBreakdown: (questionId) => scoring.getScoreBreakdown(questionId),

 // Direct access
 scoringSystem: scoring
 };
}

/**
 * Format results for display
 * @param {Object} results - Test results
 * @param {string} testType - Type of test
 * @returns {Object} Formatted results for UI display
 */
export function formatUniversalResults(results, testType = 'unknown') {
 const {
 totalScore,
 maxPossibleScore,
 percentage,
 correctAnswers,
 totalQuestions,
 averageTime,
 difficultyBreakdown,
 completionRate,
 testDuration
 } = results;

 return {
 // Overall scores
 score: totalScore,
 maxScore: maxPossibleScore,
 percentage: Math.round(percentage),
 grade: getGradeFromPercentage(percentage),

 // Question statistics
 correct: correctAnswers,
 total: totalQuestions,
 incorrect: totalQuestions - correctAnswers,
 completionRate,

 // Timing statistics
 averageTime: Math.round(averageTime),
 totalTime: testDuration,

 // Difficulty breakdown
 difficultyBreakdown,

 // Performance indicators
 performance: getPerformanceIndicator(percentage, averageTime, testType),

 // Test-specific recommendations
 recommendations: generateRecommendations(results, testType),

 // Test metadata
 testType,
 scoredAt: new Date().toISOString()
 };
}

/**
 * Get letter grade from percentage
 * @param {number} percentage - Score percentage
 * @returns {string} Letter grade
 */
function getGradeFromPercentage(percentage) {
 if (percentage >= 90) return 'A';
 if (percentage >= 80) return 'B';
 if (percentage >= 70) return 'C';
 if (percentage >= 60) return 'D';
 return 'F';
}

/**
 * Get performance indicator based on score and timing
 * @param {number} percentage - Score percentage
 * @param {number} averageTime - Average time per question
 * @param {string} testType - Type of test
 * @returns {string} Performance indicator
 */
function getPerformanceIndicator(percentage, averageTime, testType) {
 const timeThresholds = getTimeThresholdsForTestType(testType);

 if (percentage >= 80 && averageTime <= timeThresholds.excellent) return 'Excellent';
 if (percentage >= 70 && averageTime <= timeThresholds.good) return 'Good';
 if (percentage >= 60) return 'Average';
 if (percentage >= 50) return 'Below Average';
 return 'Needs Improvement';
}

/**
 * Get time thresholds for different test types
 * @param {string} testType - Type of test
 * @returns {Object} Time thresholds
 */
function getTimeThresholdsForTestType(testType) {
 switch (testType.toLowerCase()) {
 case 'numerical':
 return { excellent: 60, good: 90, average: 120 };
 case 'verbal':
 return { excellent: 90, good: 120, average: 150 };
 case 'abstract':
 return { excellent: 45, good: 75, average: 105 };
 case 'spatial':
 return { excellent: 60, good: 90, average: 120 };
 case 'logical':
 return { excellent: 45, good: 75, average: 105 };
 default:
 return { excellent: 60, good: 90, average: 120 };
 }
}

/**
 * Generate recommendations based on test results and type
 * @param {Object} results - Test results
 * @param {string} testType - Type of test
 * @returns {Array} Array of recommendation strings
 */
function generateRecommendations(results, testType) {
 const recommendations = [];
 const { percentage, averageTime, difficultyBreakdown } = results;

 // General performance recommendations
 if (percentage < 70) {
 const testSpecificAdvice = getTestSpecificAdvice(testType);
 recommendations.push(testSpecificAdvice);
 }

 // Time management recommendations
 const timeThresholds = getTimeThresholdsForTestType(testType);
 if (averageTime > timeThresholds.average) {
 recommendations.push(`Practice speed and efficiency in ${testType} reasoning`);
 }

 // Difficulty-specific recommendations
 if (difficultyBreakdown[4]?.accuracy < 50 || difficultyBreakdown[5]?.accuracy < 50) {
 recommendations.push(`Work on more challenging ${testType} problems`);
 }

 // Completion recommendations
 if (results.completionRate < 100) {
 recommendations.push('Practice time management to complete all questions');
 }

 // Positive reinforcement
 if (recommendations.length === 0) {
 recommendations.push(`Excellent performance! Consider advanced ${testType} challenges`);
 }

 return recommendations;
}

/**
 * Get test-specific advice for improvement
 * @param {string} testType - Type of test
 * @returns {string} Test-specific advice
 */
function getTestSpecificAdvice(testType) {
 switch (testType.toLowerCase()) {
 case 'logical':
 return 'Focus on understanding logical patterns and sequence recognition';
 case 'numerical':
 return 'Practice mathematical calculations and data interpretation skills';
 case 'verbal':
 return 'Improve reading comprehension and vocabulary skills';
 case 'abstract':
 return 'Work on pattern recognition and abstract thinking abilities';
 case 'spatial':
 return 'Practice spatial visualization and mental rotation exercises';
 default:
 return 'Focus on understanding the underlying concepts and patterns';
 }
}

// Export everything for easy importing
export default {
 UniversalTestScoring,
 useUniversalScoring,
 createTestScoringIntegration,
 formatUniversalResults,
 DEFAULT_SCORING_CONFIG,
 SCORING_PRESETS
};

