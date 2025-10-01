/**
 * Logical Test Scoring Integration
 *
 * This module integrates the universal scoring system with the logical reasoning test.
 * It provides functions to calculate scores, track timing, and generate results.
 *
 * @author JobGate Career Quest
 * @version 1.0.0
 */

import {
 calculateScore,
 calculateTotalScore,
 DEFAULT_SCORING_CONFIG
} from './scoringSystem.js';

/**
 * Tracks user answers and timing for logical test questions
 */
export class LogicalTestScoring {
 constructor(testConfig = null) {
 this.testConfig = testConfig || {
 scoringConfig: DEFAULT_SCORING_CONFIG
 };
 this.userAnswers = new Map();
 this.timingData = new Map();
 this.startTime = null;
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
 answer,
 timestamp: Date.now(),
 timeTaken: timing?.duration || 0
 });
 }

 /**
 * Calculate score for a specific question
 * @param {Object} question - Question object with scoring weights
 * @param {string} questionId - Question identifier
 * @returns {number} Calculated score
 */
 calculateQuestionScore(question, questionId) {
 const userData = this.userAnswers.get(questionId);
 if (!userData) {
 return 0;
 }

 return calculateScore(
 question,
 userData.answer,
 userData.timeTaken,
 this.testConfig.scoringConfig
 );
 }

 /**
 * Calculate scores for all answered questions
 * @param {Array} questions - Array of question objects
 * @returns {Array} Array of question results with scores
 */
 calculateAllScores(questions) {
 return questions.map(question => {
 const userData = this.userAnswers.get(question.id);
 const score = userData ? this.calculateQuestionScore(question, question.id) : 0;

 return {
 question,
 userAnswer: userData?.answer || null,
 timeTaken: userData?.timeTaken || 0,
 score,
 isAnswered: !!userData
 };
 });
 }

 /**
 * Get comprehensive test results
 * @param {Array} questions - Array of question objects
 * @returns {Object} Complete test results
 */
 getTestResults(questions) {
 const questionResults = this.calculateAllScores(questions);
 const totalScore = calculateTotalScore(questionResults, this.testConfig.scoringConfig);

 return {
 ...totalScore,
 questionResults,
 answeredQuestions: questionResults.filter(r => r.isAnswered).length,
 totalQuestions: questions.length,
 completionRate: Math.round((questionResults.filter(r => r.isAnswered).length / questions.length) * 100),
 testDuration: this.getTotalTestDuration()
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
 * Get current test statistics
 * @returns {Object} Current test statistics
 */
 getCurrentStats() {
 const answeredCount = this.userAnswers.size;
 const totalTime = this.getTotalTestDuration();

 return {
 answeredQuestions: answeredCount,
 totalTime,
 averageTimePerQuestion: answeredCount > 0 ? Math.round(totalTime / answeredCount) : 0
 };
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
 * Get timing data for a specific question
 * @param {string} questionId - Question identifier
 * @returns {Object|null} Timing data or null if not available
 */
 getQuestionTiming(questionId) {
 return this.timingData.get(questionId) || null;
 }

 /**
 * Reset all tracking data
 */
 reset() {
 this.userAnswers.clear();
 this.timingData.clear();
 this.startTime = null;
 }

 /**
 * Export current state for persistence
 * @returns {Object} Serializable state data
 */
 exportState() {
 return {
 userAnswers: Array.from(this.userAnswers.entries()),
 timingData: Array.from(this.timingData.entries()),
 startTime: this.startTime,
 testConfig: this.testConfig
 };
 }

 /**
 * Import state from persisted data
 * @param {Object} stateData - Serializable state data
 */
 importState(stateData) {
 this.userAnswers = new Map(stateData.userAnswers || []);
 this.timingData = new Map(stateData.timingData || []);
 this.startTime = stateData.startTime || null;
 this.testConfig = stateData.testConfig || this.testConfig;
 }
}

/**
 * Utility function to create a scoring instance for logical tests
 * @param {Object} testConfig - Test configuration with scoring settings
 * @returns {LogicalTestScoring} Configured scoring instance
 */
export function createLogicalTestScoring(testConfig = null) {
 const defaultConfig = {
 scoringConfig: {
 timeWeight: 0.3,
 difficultyWeight: 0.5,
 accuracyWeight: 0.2
 }
 };

 return new LogicalTestScoring(testConfig || defaultConfig);
}

/**
 * Utility function to format test results for display
 * @param {Object} results - Test results from getTestResults()
 * @returns {Object} Formatted results for UI display
 */
export function formatTestResults(results) {
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
 percentage,
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
 difficultyBreakdown: formatDifficultyBreakdown(difficultyBreakdown),

 // Performance indicators
 performance: getPerformanceIndicator(percentage, averageTime),

 // Recommendations
 recommendations: generateRecommendations(results)
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
 * Format difficulty breakdown for display
 * @param {Object} breakdown - Difficulty breakdown data
 * @returns {Object} Formatted breakdown
 */
function formatDifficultyBreakdown(breakdown) {
 const formatted = {};

 Object.keys(breakdown).forEach(difficulty => {
 const data = breakdown[difficulty];
 formatted[difficulty] = {
 correct: data.correct,
 total: data.total,
 accuracy: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0,
 averageScore: data.total > 0 ? Math.round(data.totalScore / data.total) : 0
 };
 });

 return formatted;
}

/**
 * Get performance indicator based on score and timing
 * @param {number} percentage - Score percentage
 * @param {number} averageTime - Average time per question
 * @returns {string} Performance indicator
 */
function getPerformanceIndicator(percentage, averageTime) {
 if (percentage >= 80 && averageTime <= 45) return 'Excellent';
 if (percentage >= 70 && averageTime <= 60) return 'Good';
 if (percentage >= 60) return 'Average';
 if (percentage >= 50) return 'Below Average';
 return 'Needs Improvement';
}

/**
 * Generate recommendations based on test results
 * @param {Object} results - Test results
 * @returns {Array} Array of recommendation strings
 */
function generateRecommendations(results) {
 const recommendations = [];

 if (results.percentage < 70) {
 recommendations.push('Focus on understanding the underlying patterns in number sequences');
 }

 if (results.averageTime > 90) {
 recommendations.push('Practice speed and efficiency in pattern recognition');
 }

 if (results.difficultyBreakdown[3]?.accuracy < 50 || results.difficultyBreakdown[4]?.accuracy < 50) {
 recommendations.push('Work on more challenging logical reasoning problems');
 }

 if (results.completionRate < 100) {
 recommendations.push('Practice time management to complete all questions');
 }

 if (recommendations.length === 0) {
 recommendations.push('Excellent performance! Consider advanced logical reasoning challenges');
 }

 return recommendations;
}

// Export all utilities
export default {
 LogicalTestScoring,
 createLogicalTestScoring,
 formatTestResults
};

