import { useState, useEffect, useRef } from 'react';
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
        logPrefix = '🎯',
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
            console.error('❌ Error initializing universal scoring system:', error);
        }
    }, [testType, questions, customConfig, autoStartTest]);

    // Start question timer
    const startQuestion = (questionId) => {
        if (!scoringSystem || !questionId) return;

        try {
            const questionIdStr = `${testType}_${questionId}`;
            scoringSystem.startQuestionTimer(questionIdStr);
            setCurrentQuestionId(questionIdStr);
            questionStartTimeRef.current = Date.now();

            log(`Started question timer for ${questionIdStr}`);
        } catch (error) {
            console.error('❌ Error starting question timer:', error);
        }
    };

    // Record answer
    const recordAnswer = (questionId, answer) => {
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
            console.error('❌ Error recording answer:', error);
        }
    };

    // Get current results
    const getResults = () => {
        if (!scoringSystem) return null;

        try {
            const results = scoringSystem.getResults();
            log('Retrieved current results', results);
            return results;
        } catch (error) {
            console.error('❌ Error getting results:', error);
            return null;
        }
    };

    // Get formatted results
    const getFormattedResults = () => {
        if (!scoringSystem) return null;

        try {
            const results = scoringSystem.getResults();
            const formatted = formatUniversalResults(results, testType);

            log('Retrieved formatted results', formatted);
            return formatted;
        } catch (error) {
            console.error('❌ Error getting formatted results:', error);
            return null;
        }
    };

    // Get score breakdown
    const getScoreBreakdown = () => {
        if (!scoringSystem) return null;

        try {
            const breakdown = scoringSystem.getScoreBreakdown();
            log('Retrieved score breakdown', breakdown);
            return breakdown;
        } catch (error) {
            console.error('❌ Error getting score breakdown:', error);
            return null;
        }
    };

    // Get question timings
    const getQuestionTimings = () => {
        if (!scoringSystem) return null;

        try {
            const timings = scoringSystem.getQuestionTimings();
            log('Retrieved question timings', timings);
            return timings;
        } catch (error) {
            console.error('❌ Error getting question timings:', error);
            return null;
        }
    };

    // Complete test
    const completeTest = () => {
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
            console.error('❌ Error completing test:', error);
            return null;
        }
    };

    // Reset scoring system
    const resetScoring = () => {
        if (!scoringSystem) return;

        try {
            scoringSystem.reset();
            setCurrentQuestionId(null);
            questionStartTimeRef.current = null;
            testStartTimeRef.current = null;

            log('Scoring system reset');
        } catch (error) {
            console.error('❌ Error resetting scoring system:', error);
        }
    };

    // Get comprehensive test results for backend submission
    const getTestResultsForSubmission = (testId, answers, additionalData = {}) => {
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
            console.error('❌ Error generating test results for submission:', error);
            return null;
        }
    };

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
