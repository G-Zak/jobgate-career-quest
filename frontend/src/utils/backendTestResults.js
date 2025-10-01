/**
 * Backend Test Results Integration
 * Handles test results synchronization between frontend and backend
 */

import backendApi from '../features/skills-assessment/api/backendApi';

/**
 * Get user's test results from backend API
 * @param {number} userId - User ID
 * @returns {Promise<Array>} Array of test results
 */
export const getBackendTestResults = async (userId) => {
    try {
        console.log('🔍 Fetching test results from backend for user:', userId);

        // Get user's submissions from backend
        const submissions = await backendApi.getUserSubmissions();
        console.log('📊 Backend submissions:', submissions);

        // Transform submissions to match frontend format
        const testResults = submissions.map(submission => ({
            id: submission.id,
            testId: submission.test_id,
            userId: userId,
            testType: submission.test_type, // Include test type for cognitive tests
            result: {
                score: submission.percentage_score,
                percentage: submission.percentage_score,
                correctAnswers: submission.correct_answers,
                totalQuestions: submission.total_questions,
                passed: submission.passed,
                grade: submission.grade_letter
            },
            answers: submission.answers_data || {},
            timeSpent: submission.time_taken_seconds,
            completedAt: submission.submitted_at,
            timestamp: new Date(submission.submitted_at).getTime(),
            source: 'backend'
        }));

        console.log('✅ Transformed test results:', testResults);
        return testResults;

    } catch (error) {
        console.error('❌ Error fetching backend test results:', error);
        return [];
    }
};

/**
 * Get latest test result for a specific test from backend
 * @param {number} userId - User ID
 * @param {number} testId - Test ID
 * @returns {Promise<Object|null>} Latest test result or null
 */
export const getLatestBackendTestResult = async (userId, testId) => {
    try {
        const allResults = await getBackendTestResults(userId);
        const testResults = allResults.filter(result => result.testId === testId);

        if (testResults.length === 0) {
            console.log(`🔍 No backend test results found for test ${testId}`);
            return null;
        }

        // Return the most recent result
        const latestResult = testResults.sort((a, b) => b.timestamp - a.timestamp)[0];
        console.log(`✅ Latest backend test result for test ${testId}:`, latestResult);
        return latestResult;

    } catch (error) {
        console.error('❌ Error fetching latest backend test result:', error);
        return null;
    }
};

/**
 * Submit test result to backend API
 * @param {number} testId - Test ID
 * @param {Object} answers - User answers
 * @param {number} timeSpent - Time spent in seconds
 * @param {Object} metadata - Additional metadata
 * @returns {Promise<Object>} Submission result
 */
export const submitTestResultToBackend = async (testId, answers, timeSpent, metadata = {}) => {
    try {
        console.log('📤 Submitting test result to backend:', {
            testId,
            answerCount: Object.keys(answers).length,
            timeSpent,
            metadata
        });

        const submissionResult = await backendApi.submitTestAnswers(
            testId,
            answers,
            timeSpent,
            metadata
        );

        console.log('✅ Test result submitted to backend:', submissionResult);
        return submissionResult;

    } catch (error) {
        console.error('❌ Error submitting test result to backend:', error);
        throw error;
    }
};

/**
 * Get test results for skill matching (used by recommendation engine)
 * @param {number} userId - User ID
 * @returns {Promise<Object>} Skill test scores object
 */
export const getSkillTestScoresFromBackend = async (userId) => {
    try {
        const testResults = await getBackendTestResults(userId);
        const skillScores = {};

        // Map test results to skill names and cognitive test types
        // This mapping should match the skill-to-test mapping in testScoreIntegration.js
        const SKILL_TO_TEST_MAPPING = {
            1: 'Python',
            2: 'JavaScript',
            3: 'React',
            4: 'Django',
            5: 'SQL',
            6: 'SQLite',
            7: 'Java',
            8: 'Git',
            9: 'HTML5'
        };

        // Map cognitive test types to categories
        const COGNITIVE_TEST_MAPPING = {
            'numerical_reasoning': 'Numerical Reasoning',
            'verbal_reasoning': 'Verbal Reasoning',
            'logical_reasoning': 'Logical Reasoning',
            'abstract_reasoning': 'Abstract Reasoning',
            'spatial_reasoning': 'Spatial Reasoning',
            'diagrammatic_reasoning': 'Diagrammatic Reasoning',
            'situational_judgment': 'Situational Judgment'
        };

        testResults.forEach(result => {
            const skillName = SKILL_TO_TEST_MAPPING[result.testId];
            const cognitiveType = result.testType; // Get test type from backend

            if (skillName) {
                // For testing purposes, consider 50%+ as passed
                const isPassed = result.result.percentage >= 50;

                skillScores[skillName] = {
                    percentage: result.result.percentage,
                    score: result.result.score,
                    correctAnswers: result.result.correctAnswers,
                    totalQuestions: result.result.totalQuestions,
                    passed: isPassed, // Use 50% threshold for testing
                    grade: result.result.grade,
                    completedAt: result.completedAt,
                    testType: 'technical'
                };
            } else if (cognitiveType && COGNITIVE_TEST_MAPPING[cognitiveType]) {
                // Handle cognitive tests
                const cognitiveCategory = COGNITIVE_TEST_MAPPING[cognitiveType];
                const isPassed = result.result.percentage >= 50;

                skillScores[cognitiveCategory] = {
                    percentage: result.result.percentage,
                    score: result.result.score,
                    correctAnswers: result.result.correctAnswers,
                    totalQuestions: result.result.totalQuestions,
                    passed: isPassed,
                    grade: result.result.grade,
                    completedAt: result.completedAt,
                    testType: 'cognitive',
                    category: cognitiveCategory
                };
            }
        });

        console.log('📊 Skill test scores from backend:', skillScores);
        return skillScores;

    } catch (error) {
        console.error('❌ Error getting skill test scores from backend:', error);
        return {};
    }
};

/**
 * Sync localStorage test results to backend
 * @param {number} userId - User ID
 * @returns {Promise<boolean>} Success status
 */
export const syncLocalStorageToBackend = async (userId) => {
    try {
        console.log('🔄 Syncing localStorage test results to backend...');

        // Get localStorage results
        const localResults = JSON.parse(localStorage.getItem(`testResults_${userId}`) || '[]');
        console.log('📋 Local results to sync:', localResults.length);

        let syncedCount = 0;

        for (const localResult of localResults) {
            try {
                // Skip if already synced (has source: 'backend')
                if (localResult.source === 'backend') {
                    continue;
                }

                // Submit to backend
                await submitTestResultToBackend(
                    localResult.testId,
                    localResult.answers,
                    localResult.timeSpent,
                    { synced_from_localStorage: true }
                );

                // Mark as synced
                localResult.source = 'backend';
                syncedCount++;

            } catch (error) {
                console.error(`❌ Error syncing test ${localResult.testId}:`, error);
            }
        }

        // Update localStorage with synced results
        localStorage.setItem(`testResults_${userId}`, JSON.stringify(localResults));

        console.log(`✅ Synced ${syncedCount} test results to backend`);
        return syncedCount > 0;

    } catch (error) {
        console.error('❌ Error syncing localStorage to backend:', error);
        return false;
    }
};
