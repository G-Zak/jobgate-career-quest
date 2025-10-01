/**
 * Scoring System Usage Examples
 *
 * This file demonstrates how to use the universal scoring system for logical tests.
 * It includes examples of question objects, scoring calculations, and different configurations.
 *
 * @author JobGate Career Quest
 * @version 1.0.0
 */

import {
 calculateScore,
 calculateTotalScore,
 enhanceQuestionsWithScoring,
 getScoringPreset,
 debugScoreCalculation,
 DEFAULT_SCORING_CONFIG,
 SCORING_PRESETS
} from '../lib/scoringSystem.js';

/**
 * Example question objects with proper structure including scoreWeight
 */
export const exampleQuestions = [
 {
 id: "logical_1_1",
 type: "multiple_choice",
 question: "Look at this series: 2, 4, 6, 8, 10, ... What number should come next?",
 options: ["11", "12", "13", "14"],
 correct_answer: "b",
 difficulty: 1,
 section: 1,
 scoreWeight: {
 base: 5,
 difficultyBonus: 2,
 timeFactor: 1
 }
 },
 {
 id: "logical_1_2",
 type: "multiple_choice",
 question: "Look at this series: 2, 6, 18, 54, ... What number should come next?",
 options: ["108", "148", "162", "216"],
 correct_answer: "c",
 difficulty: 3,
 section: 1,
 scoreWeight: {
 base: 5,
 difficultyBonus: 2,
 timeFactor: 1
 }
 },
 {
 id: "logical_1_3",
 type: "multiple_choice",
 question: "Look at this series: 7, 10, 8, 11, 9, 12, ... What number should come next?",
 options: ["7", "10", "12", "13"],
 correct_answer: "b",
 difficulty: 3,
 section: 1,
 scoreWeight: {
 base: 5,
 difficultyBonus: 2,
 timeFactor: 1
 }
 }
];

/**
 * Example test configuration with global scoring settings
 */
export const exampleTestConfig = {
 title: "Logical Reasoning Test - Example",
 description: "Example test with comprehensive scoring system",
 totalQuestions: 3,
 totalTime: 30,
 scoringConfig: {
 timeWeight: 0.3,
 difficultyWeight: 0.5,
 accuracyWeight: 0.2
 },
 questions: exampleQuestions
};

/**
 * Simulated test results with user answers and timing data
 */
export const exampleTestResults = [
 {
 question: exampleQuestions[0],
 userAnswer: "b", // Correct answer
 timeTaken: 15, // 15 seconds - excellent time
 score: 0 // Will be calculated
 },
 {
 question: exampleQuestions[1],
 userAnswer: "a", // Wrong answer
 timeTaken: 45, // 45 seconds
 score: 0 // Will be calculated
 },
 {
 question: exampleQuestions[2],
 userAnswer: "b", // Correct answer
 timeTaken: 90, // 90 seconds - slow
 score: 0 // Will be calculated
 }
];

/**
 * Example 1: Basic score calculation for a single question
 */
export function exampleBasicScoring() {
 console.log('=== Example 1: Basic Score Calculation ===');

 const question = exampleQuestions[0];
 const userAnswer = "b";
 const timeTaken = 20;

 const score = calculateScore(question, userAnswer, timeTaken);

 console.log('Question:', question.question);
 console.log('User Answer:', userAnswer);
 console.log('Time Taken:', timeTaken, 'seconds');
 console.log('Calculated Score:', score);

 return score;
}

/**
 * Example 2: Score calculation with different configurations
 */
export function exampleDifferentConfigurations() {
 console.log('\n=== Example 2: Different Scoring Configurations ===');

 const question = exampleQuestions[1]; // Difficulty 3 question
 const userAnswer = "c"; // Correct answer
 const timeTaken = 30; // 30 seconds

 console.log('Question:', question.question);
 console.log('User Answer:', userAnswer);
 console.log('Time Taken:', timeTaken, 'seconds');
 console.log('Difficulty:', question.difficulty);

 // Test with different configurations
 const configs = [
 { name: 'Standard', config: SCORING_PRESETS.STANDARD },
 { name: 'Speed Focused', config: SCORING_PRESETS.SPEED_FOCUSED },
 { name: 'Accuracy Focused', config: SCORING_PRESETS.ACCURACY_FOCUSED },
 { name: 'Difficulty Focused', config: SCORING_PRESETS.DIFFICULTY_FOCUSED }
 ];

 configs.forEach(({ name, config }) => {
 const score = calculateScore(question, userAnswer, timeTaken, config);
 console.log(`${name} Configuration Score:`, score);
 });
}

/**
 * Example 3: Wrong answer handling
 */
export function exampleWrongAnswer() {
 console.log('\n=== Example 3: Wrong Answer Handling ===');

 const question = exampleQuestions[0];
 const userAnswer = "a"; // Wrong answer (correct is "b")
 const timeTaken = 5; // Very fast but wrong

 const score = calculateScore(question, userAnswer, timeTaken);

 console.log('Question:', question.question);
 console.log('User Answer:', userAnswer, '(WRONG)');
 console.log('Correct Answer:', question.correct_answer);
 console.log('Time Taken:', timeTaken, 'seconds');
 console.log('Calculated Score:', score, '(Should be 0)');

 return score;
}

/**
 * Example 4: Time efficiency impact on scoring
 */
export function exampleTimeEfficiency() {
 console.log('\n=== Example 4: Time Efficiency Impact ===');

 const question = exampleQuestions[1]; // Difficulty 3
 const userAnswer = "c"; // Correct answer

 const timeScenarios = [
 { time: 10, description: 'Very Fast' },
 { time: 25, description: 'Fast' },
 { time: 45, description: 'Average' },
 { time: 90, description: 'Slow' },
 { time: 180, description: 'Very Slow' }
 ];

 console.log('Question:', question.question);
 console.log('User Answer:', userAnswer, '(Correct)');
 console.log('Difficulty:', question.difficulty);

 timeScenarios.forEach(({ time, description }) => {
 const score = calculateScore(question, userAnswer, time);
 console.log(`${description} (${time}s):`, score);
 });
}

/**
 * Example 5: Complete test scoring
 */
export function exampleCompleteTestScoring() {
 console.log('\n=== Example 5: Complete Test Scoring ===');

 // Calculate scores for all test results
 const resultsWithScores = exampleTestResults.map(result => {
 const score = calculateScore(
 result.question,
 result.userAnswer,
 result.timeTaken,
 exampleTestConfig.scoringConfig
 );

 return {
 ...result,
 score
 };
 });

 // Calculate total test score
 const totalScore = calculateTotalScore(resultsWithScores, exampleTestConfig.scoringConfig);

 console.log('Individual Question Scores:');
 resultsWithScores.forEach((result, index) => {
 console.log(`Question ${index + 1}:`, {
 correct: result.userAnswer === result.question.correct_answer,
 time: result.timeTaken,
 score: result.score
 });
 });

 console.log('\nTotal Test Results:', totalScore);

 return totalScore;
}

/**
 * Example 6: Debug scoring calculation
 */
export function exampleDebugScoring() {
 console.log('\n=== Example 6: Debug Scoring Calculation ===');

 const question = exampleQuestions[1]; // Difficulty 3
 const userAnswer = "c"; // Correct answer
 const timeTaken = 35; // 35 seconds

 // Use debug function to see detailed breakdown
 debugScoreCalculation(question, userAnswer, timeTaken, SCORING_PRESETS.STANDARD);
}

/**
 * Example 7: Enhancing questions with scoring weights
 */
export function exampleEnhancingQuestions() {
 console.log('\n=== Example 7: Enhancing Questions with Scoring Weights ===');

 // Raw questions without scoreWeight
 const rawQuestions = [
 {
 id: "test_1",
 type: "multiple_choice",
 question: "What is 2 + 2?",
 options: ["3", "4", "5", "6"],
 correct_answer: "b",
 difficulty: 1,
 section: 1
 // No scoreWeight field
 }
 ];

 console.log('Raw question (before enhancement):', rawQuestions[0]);

 // Enhance with default scoring weights
 const enhancedQuestions = enhanceQuestionsWithScoring(rawQuestions);

 console.log('Enhanced question (after enhancement):', enhancedQuestions[0]);

 return enhancedQuestions;
}

/**
 * Run all examples
 */
export function runAllExamples() {
 console.log(' Running All Scoring System Examples\n');

 exampleBasicScoring();
 exampleDifferentConfigurations();
 exampleWrongAnswer();
 exampleTimeEfficiency();
 exampleCompleteTestScoring();
 exampleDebugScoring();
 exampleEnhancingQuestions();

 console.log('\n All examples completed!');
}

/**
 * Export example data for use in other components
 */
export const scoringExamples = {
 questions: exampleQuestions,
 testConfig: exampleTestConfig,
 testResults: exampleTestResults,
 runAll: runAllExamples
};

// Auto-run examples if this file is executed directly
if (typeof window !== 'undefined' && window.location?.pathname?.includes('example')) {
 runAllExamples();
}

