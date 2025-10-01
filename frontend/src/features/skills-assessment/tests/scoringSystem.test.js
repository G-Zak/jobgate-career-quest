/**
 * Scoring System Tests
 *
 * Simple tests to verify the scoring system works correctly.
 * These tests can be run in the browser console or with a test runner.
 *
 * @author JobGate Career Quest
 * @version 1.0.0
 */

import {
 calculateScore,
 calculateTotalScore,
 calculateTimeEfficiency,
 validateScoringConfig,
 DEFAULT_SCORING_CONFIG,
 SCORING_PRESETS
} from '../lib/scoringSystem.js';

/**
 * Test data
 */
const testQuestion = {
 id: "test_1",
 type: "multiple_choice",
 question: "Test question",
 options: ["A", "B", "C", "D"],
 correct_answer: "b",
 difficulty: 2,
 section: 1,
 scoreWeight: {
 base: 5,
 difficultyBonus: 2,
 timeFactor: 1
 }
};

/**
 * Test runner utility
 */
function runTest(testName, testFunction) {
 try {
 const result = testFunction();
 console.log(` ${testName}: PASSED`);
 return result;
 } catch (error) {
 console.log(` ${testName}: FAILED - ${error.message}`);
 return null;
 }
}

/**
 * Test 1: Correct answer with good time
 */
function testCorrectAnswerGoodTime() {
 const score = calculateScore(testQuestion, "b", 20, DEFAULT_SCORING_CONFIG);

 // Should return a positive score
 if (score <= 0) {
 throw new Error(`Expected positive score, got ${score}`);
 }

 return score;
}

/**
 * Test 2: Wrong answer
 */
function testWrongAnswer() {
 const score = calculateScore(testQuestion, "a", 5, DEFAULT_SCORING_CONFIG);

 // Should return 0 for wrong answer
 if (score !== 0) {
 throw new Error(`Expected 0 for wrong answer, got ${score}`);
 }

 return score;
}

/**
 * Test 3: Time efficiency calculation
 */
function testTimeEfficiency() {
 const easyTime = calculateTimeEfficiency(15, 1);
 const hardTime = calculateTimeEfficiency(15, 3);

 // Harder questions should have higher thresholds
 if (hardTime <= easyTime) {
 throw new Error('Hard questions should have different time efficiency');
 }

 return { easyTime, hardTime };
}

/**
 * Test 4: Configuration validation
 */
function testConfigurationValidation() {
 const validConfig = { timeWeight: 0.3, difficultyWeight: 0.5, accuracyWeight: 0.2 };
 const invalidConfig = { timeWeight: 0.3, difficultyWeight: 0.5, accuracyWeight: 0.1 };

 const validResult = validateScoringConfig(validConfig);
 const invalidResult = validateScoringConfig(invalidConfig);

 if (!validResult.isValid) {
 throw new Error('Valid config should pass validation');
 }

 if (invalidResult.isValid) {
 throw new Error('Invalid config should fail validation');
 }

 return { validResult, invalidResult };
}

/**
 * Test 5: Total score calculation
 */
function testTotalScoreCalculation() {
 const questionResults = [
 {
 question: testQuestion,
 userAnswer: "b",
 timeTaken: 20,
 score: calculateScore(testQuestion, "b", 20)
 },
 {
 question: testQuestion,
 userAnswer: "a",
 timeTaken: 30,
 score: calculateScore(testQuestion, "a", 30)
 }
 ];

 const totalScore = calculateTotalScore(questionResults);

 if (totalScore.totalQuestions !== 2) {
 throw new Error(`Expected 2 total questions, got ${totalScore.totalQuestions}`);
 }

 if (totalScore.correctAnswers !== 1) {
 throw new Error(`Expected 1 correct answer, got ${totalScore.correctAnswers}`);
 }

 return totalScore;
}

/**
 * Test 6: Different scoring configurations
 */
function testScoringConfigurations() {
 const question = testQuestion;
 const userAnswer = "b";
 const timeTaken = 30;

 const standardScore = calculateScore(question, userAnswer, timeTaken, SCORING_PRESETS.STANDARD);
 const speedScore = calculateScore(question, userAnswer, timeTaken, SCORING_PRESETS.SPEED_FOCUSED);
 const accuracyScore = calculateScore(question, userAnswer, timeTaken, SCORING_PRESETS.ACCURACY_FOCUSED);

 // All should be positive for correct answer
 if (standardScore <= 0 || speedScore <= 0 || accuracyScore <= 0) {
 throw new Error('All configurations should return positive scores for correct answers');
 }

 return { standardScore, speedScore, accuracyScore };
}

/**
 * Test 7: Edge cases
 */
function testEdgeCases() {
 // Test with zero time
 const zeroTimeScore = calculateScore(testQuestion, "b", 0);
 if (zeroTimeScore <= 0) {
 throw new Error('Zero time should still give positive score for correct answer');
 }

 // Test with very high time
 const highTimeScore = calculateScore(testQuestion, "b", 300);
 if (highTimeScore <= 0) {
 throw new Error('High time should still give some score for correct answer');
 }

 // Test with difficulty 5
 const hardQuestion = { ...testQuestion, difficulty: 5 };
 const hardScore = calculateScore(hardQuestion, "b", 30);
 if (hardScore <= 0) {
 throw new Error('Hard question should give positive score for correct answer');
 }

 return { zeroTimeScore, highTimeScore, hardScore };
}

/**
 * Run all tests
 */
export function runAllTests() {
 console.log(' Running Scoring System Tests\n');

 const results = {
 correctAnswerGoodTime: runTest('Correct Answer Good Time', testCorrectAnswerGoodTime),
 wrongAnswer: runTest('Wrong Answer', testWrongAnswer),
 timeEfficiency: runTest('Time Efficiency', testTimeEfficiency),
 configurationValidation: runTest('Configuration Validation', testConfigurationValidation),
 totalScoreCalculation: runTest('Total Score Calculation', testTotalScoreCalculation),
 scoringConfigurations: runTest('Scoring Configurations', testScoringConfigurations),
 edgeCases: runTest('Edge Cases', testEdgeCases)
 };

 const passedTests = Object.values(results).filter(result => result !== null).length;
 const totalTests = Object.keys(results).length;

 console.log(`\n Test Results: ${passedTests}/${totalTests} tests passed`);

 if (passedTests === totalTests) {
 console.log(' All tests passed! The scoring system is working correctly.');
 } else {
 console.log('️ Some tests failed. Please check the implementation.');
 }

 return results;
}

/**
 * Quick smoke test
 */
export function quickSmokeTest() {
 console.log(' Quick Smoke Test\n');

 // Test basic functionality
 const score = calculateScore(testQuestion, "b", 20);
 const isValid = validateScoringConfig(DEFAULT_SCORING_CONFIG);

 console.log(`Basic score calculation: ${score > 0 ? '' : ''}`);
 console.log(`Default config validation: ${isValid.isValid ? '' : ''}`);

 return {
 scoreCalculation: score > 0,
 configValidation: isValid.isValid
 };
}

// Auto-run tests if this file is executed directly
if (typeof window !== 'undefined' && window.location?.pathname?.includes('test')) {
 runAllTests();
}

export default {
 runAllTests,
 quickSmokeTest
};

