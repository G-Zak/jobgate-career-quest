import { useState, useEffect, useRef, useCallback } from 'react';
import { createTestScoringIntegration, formatUniversalResults } from '../lib/universalScoringIntegration';

/**
 * Universal Scoring Hook for All Test Components
 *
 * This hook provides a standardized way to integrate universal scoring
 * across all test components with console logging for backend verification.
 *
 * @param {string} testType - Type of test (numerical, logical, verbal, etc.)
 * @param {Array} questions - Array of questions for the test
 * @param {Object} customConfig - Custom scoring configuration
 * @param {Object} options - Additional options
 * @returns {Object} Scoring system state and methods
 */
export const useUniversalScoring = (testType, questions = [], customConfig = null, options = {}) => {
 const [scoringSystem, setScoringSystem] = useState(null);
 const [isInitialized, setIsInitialized] = useState(false);
 const [currentQuestionId, setCurrentQuestionId] = useState(null);
 const questionStartTimeRef = useRef(null);
 const testStartTimeRef = useRef(null);

 const {
 enableConsoleLogging = true,
 logPrefix = '',
 autoStartTest = true
 } = options;

 // Console logging helper
 const log = (message, data = null) => {
 if (enableConsoleLogging) {
 console.log(`${logPrefix} ${message}`, data || '');
 }
 };

 // Initialize scoring system
 useEffect(() => {
 if (!testType || !questions.length) {
 log('Skipping scoring initialization - missing testType or questions');
 return;
 }

 try {
 log('Initializing universal scoring system', {
 testType,
 questionCount: questions.length,
 customConfig
 });

 const integration = createTestScoringIntegration(testType, questions, customConfig);
 setScoringSystem(integration);
 setIsInitialized(true);

 if (autoStartTest) {
 integration.startTest();
 testStartTimeRef.current = Date.now();
 log('Test started automatically');
 }

 log('Universal scoring system initialized successfully');
 } catch (error) {
 console.error(' Error initializing universal scoring system:', error);
 }
 }, [testType, questions, customConfig, autoStartTest]);

 // Start question timer (memoized)
 const startQuestion = useCallback((questionId) => {
 if (!scoringSystem || !questionId) return;

 try {
 const questionIdStr = `${testType}_${questionId}`;
 scoringSystem.startQuestionTimer(questionIdStr);
 setCurrentQuestionId(questionIdStr);
 questionStartTimeRef.current = Date.now();

 log(`Started question timer for ${questionIdStr}`);
 } catch (error) {
 console.error(' Error starting question timer:', error);
 }
 }, [scoringSystem, testType]);

 // Record answer (memoized)
 const recordAnswer = useCallback((questionId, answer) => {
 if (!scoringSystem || !questionId) return;

 try {
 const questionIdStr = `${testType}_${questionId}`;
 scoringSystem.recordAnswer(questionIdStr, answer);

 const timeTaken = questionStartTimeRef.current ?
 Math.round((Date.now() - questionStartTimeRef.current) / 1000) : 0;

 log(`Recorded answer for ${questionIdStr}`, {
 answer,
 timeTaken: `${timeTaken}s`
 });
 } catch (error) {
 console.error(' Error recording answer:', error);
 }
 }, [scoringSystem, testType]);

 // Get current results (memoized)
 const getResults = useCallback(() => {
 if (!scoringSystem) return null;

 try {
 const results = scoringSystem.getResults();
 log('Retrieved current results', results);
 return results;
 } catch (error) {
 console.error(' Error getting results:', error);
 return null;
 }
 }, [scoringSystem]);

 // Get formatted results (memoized)
 const getFormattedResults = useCallback(() => {
 if (!scoringSystem) return null;

 try {
 const results = scoringSystem.getResults();
 const formatted = formatUniversalResults(results, testType);

 log('Retrieved formatted results', formatted);
 return formatted;
 } catch (error) {
 console.error(' Error getting formatted results:', error);
 return null;
 }
 }, [scoringSystem, testType]);

 // Get score breakdown (memoized)
 const getScoreBreakdown = useCallback(() => {
 if (!scoringSystem) return null;

 try {
 const breakdown = scoringSystem.getScoreBreakdown();
 log('Retrieved score breakdown', breakdown);
 return breakdown;
 } catch (error) {
 console.error(' Error getting score breakdown:', error);
 return null;
 }
 }, [scoringSystem]);

 // Get question timings (memoized)
 const getQuestionTimings = useCallback(() => {
 if (!scoringSystem) return null;

 try {
 const timings = scoringSystem.getQuestionTimings();
 log('Retrieved question timings', timings);
 return timings;
 } catch (error) {
 console.error(' Error getting question timings:', error);
 return null;
 }
 }, [scoringSystem]);

 // Complete test (memoized)
 const completeTest = useCallback(() => {
 if (!scoringSystem) return null;

 try {
 scoringSystem.completeTest();
 const results = getFormattedResults();

 log('Test completed', {
 totalTime: testStartTimeRef.current ?
 Math.round((Date.now() - testStartTimeRef.current) / 1000) : 0,
 results
 });

 return results;
 } catch (error) {
 console.error(' Error completing test:', error);
 return null;
 }
 }, [scoringSystem, getFormattedResults]);

 // Reset scoring system (memoized)
 const resetScoring = useCallback(() => {
 if (!scoringSystem) return;

 try {
 scoringSystem.reset();
 setCurrentQuestionId(null);
 questionStartTimeRef.current = null;
 testStartTimeRef.current = null;

 log('Scoring system reset');
 } catch (error) {
 console.error(' Error resetting scoring system:', error);
 }
 }, [scoringSystem]);

 // Get comprehensive test results for backend submission (memoized)
 const getTestResultsForSubmission = useCallback((testId, answers, additionalData = {}) => {
 if (!scoringSystem) return null;

 try {
 const results = getFormattedResults();
 const scoreBreakdown = getScoreBreakdown();
 const questionTimings = getQuestionTimings();

 const testResults = {
 testId,
 testType,
 ...results,
 scoreBreakdown,
 questionTimings,
 answers,
 scoringSystem,
 ...additionalData
 };

 log('Generated test results for submission', testResults);
 return testResults;
 } catch (error) {
 console.error(' Error generating test results for submission:', error);
 return null;
 }
 }, [scoringSystem, getFormattedResults, getScoreBreakdown, getQuestionTimings, testType]);

 return {
 // State
 scoringSystem,
 isInitialized,
 currentQuestionId,

 // Methods
 startQuestion,
 recordAnswer,
 getResults,
 getFormattedResults,
 getScoreBreakdown,
 getQuestionTimings,
 completeTest,
 resetScoring,
 getTestResultsForSubmission,

 // Utilities
 log
 };
};

export default useUniversalScoring;
