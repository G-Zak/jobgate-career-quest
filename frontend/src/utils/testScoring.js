/**
 * Test scoring and result management utilities
 * Updated: Fixed answers.forEach error - now uses Object.entries()
 */

// Calculate test score based on correct answers
export const calculateTestScore = (answers, questions) => {
    let correctAnswers = 0;
    const totalQuestions = questions.length;

    // Ensure answers is an object
    if (!answers || typeof answers !== 'object') {
        console.warn('Invalid answers format:', answers);
        return {
            score: 0,
            percentage: 0,
            correctAnswers: 0,
            totalQuestions,
            passed: false
        };
    }

    // answers is an object with questionId as keys and answers as values
    Object.entries(answers).forEach(([questionId, answer]) => {
        const question = questions.find(q => q.id === parseInt(questionId));
        if (question && answer === question.correct_answer) {
            correctAnswers++;
        }
    });

    const percentage = Math.round((correctAnswers / totalQuestions) * 100);
    const score = Math.round((correctAnswers / totalQuestions) * 100);

    return {
        score,
        percentage,
        correctAnswers,
        totalQuestions,
        passed: percentage >= 70 // 70% passing grade
    };
};

// Save test result to localStorage
export const saveTestResult = (testId, userId, result, answers, timeSpent) => {
    const testResult = {
        id: Date.now(),
        testId,
        userId,
        result,
        answers,
        timeSpent,
        completedAt: new Date().toISOString(),
        timestamp: Date.now()
    };

    console.log('💾 Saving test result:', testResult);

    try {
        const existingResults = getTestResults(userId);
        console.log('📋 Existing results:', existingResults.length);

        const updatedResults = [...existingResults, testResult];
        console.log('📋 Updated results:', updatedResults.length);

        localStorage.setItem(`testResults_${userId}`, JSON.stringify(updatedResults));
        console.log('✅ Test result saved to localStorage');

        // Also update user profile with latest test results
        updateUserProfileWithTestResult(userId, testId, result);
        console.log('✅ User profile updated with test result');

        return testResult;
    } catch (error) {
        console.error('❌ Error saving test result:', error);
        return null;
    }
};

// Get test results for a user
export const getTestResults = (userId) => {
    try {
        const results = localStorage.getItem(`testResults_${userId}`);
        const parsedResults = results ? JSON.parse(results) : [];
        console.log('📊 Loading test results for user', userId, ':', parsedResults.length, 'results');
        return parsedResults;
    } catch (error) {
        console.error('❌ Error loading test results:', error);
        return [];
    }
};

// Get test results for a specific test
export const getTestResultsByTestId = (userId, testId) => {
    const allResults = getTestResults(userId);
    return allResults.filter(result => result.testId === testId);
};

// Get latest test result for a specific test
export const getLatestTestResult = (userId, testId) => {
    const testResults = getTestResultsByTestId(userId, testId);
    return testResults.length > 0 ? testResults[testResults.length - 1] : null;
};

// Update user profile with test result
export const updateUserProfileWithTestResult = (userId, testId, result) => {
    try {
        const profileKey = `userProfile_${userId}`;
        const existingProfile = localStorage.getItem(profileKey);

        if (existingProfile) {
            const profile = JSON.parse(existingProfile);

            // Initialize testResults if not exists
            if (!profile.testResults) {
                profile.testResults = [];
            }

            // Add or update test result
            const existingTestIndex = profile.testResults.findIndex(tr => tr.testId === testId);
            const testResult = {
                testId,
                score: result.score,
                percentage: result.percentage,
                passed: result.passed,
                completedAt: new Date().toISOString()
            };

            if (existingTestIndex >= 0) {
                profile.testResults[existingTestIndex] = testResult;
            } else {
                profile.testResults.push(testResult);
            }

            // Update lastUpdated timestamp
            profile.lastUpdated = Date.now();

            localStorage.setItem(profileKey, JSON.stringify(profile));
        }
    } catch (error) {
        console.error('Error updating user profile with test result:', error);
    }
};

// Get user's test statistics
export const getUserTestStats = (userId) => {
    const allResults = getTestResults(userId);

    if (allResults.length === 0) {
        return {
            totalTests: 0,
            passedTests: 0,
            averageScore: 0,
            totalTimeSpent: 0,
            recentTests: []
        };
    }

    const passedTests = allResults.filter(result => result.result.passed).length;
    const totalScore = allResults.reduce((sum, result) => sum + result.result.score, 0);
    const totalTimeSpent = allResults.reduce((sum, result) => sum + (result.timeSpent || 0), 0);

    return {
        totalTests: allResults.length,
        passedTests,
        averageScore: Math.round(totalScore / allResults.length),
        totalTimeSpent,
        recentTests: allResults
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, 5)
    };
};

// Check if user has completed a specific test
export const hasUserCompletedTest = (userId, testId) => {
    const latestResult = getLatestTestResult(userId, testId);
    return latestResult !== null;
};

// Get user's best score for a specific test
export const getUserBestScore = (userId, testId) => {
    const testResults = getTestResultsByTestId(userId, testId);
    if (testResults.length === 0) return null;

    return testResults.reduce((best, current) =>
        current.result.score > best.result.score ? current : best
    );
};
