/**
 * Sync localStorage test results to backend
 * This script can be run in the browser console to sync existing test results
 */

import backendApi from '../features/skills-assessment/api/backendApi';

/**
 * Sync all localStorage test results to backend
 */
export const syncAllLocalStorageToBackend = async (userId = 1) => {
    try {
        console.log('🔄 Starting localStorage to backend sync...');

        // Get localStorage test results
        const localResults = JSON.parse(localStorage.getItem(`testResults_${userId}`) || '[]');
        console.log(`📋 Found ${localResults.length} test results in localStorage`);

        if (localResults.length === 0) {
            console.log('ℹ️ No test results found in localStorage');
            return { synced: 0, errors: 0 };
        }

        let synced = 0;
        let errors = 0;

        for (const localResult of localResults) {
            try {
                console.log(`📤 Syncing test ${localResult.testId}...`);

                // Convert localStorage result to backend format
                const backendAnswers = {};
                if (localResult.answers) {
                    Object.entries(localResult.answers).forEach(([questionId, answer]) => {
                        // Convert numeric answers to letter format if needed
                        if (typeof answer === 'number') {
                            const answerMap = { 0: 'A', 1: 'B', 2: 'C', 3: 'D' };
                            backendAnswers[questionId] = answerMap[answer] || answer;
                        } else {
                            backendAnswers[questionId] = answer;
                        }
                    });
                }

                // Submit to backend
                const submissionResult = await backendApi.submitTestAnswers(
                    localResult.testId,
                    backendAnswers,
                    localResult.timeSpent || 0,
                    {
                        synced_from_localStorage: true,
                        original_timestamp: localResult.timestamp,
                        skill: localResult.skill || 'Unknown'
                    }
                );

                console.log(`✅ Synced test ${localResult.testId}: ${submissionResult.score?.percentage_score}%`);
                synced++;

            } catch (error) {
                console.error(`❌ Error syncing test ${localResult.testId}:`, error);
                errors++;
            }
        }

        console.log(`🎉 Sync completed: ${synced} synced, ${errors} errors`);
        return { synced, errors };

    } catch (error) {
        console.error('❌ Error during sync:', error);
        return { synced: 0, errors: 1 };
    }
};

/**
 * Check what test results exist in localStorage
 */
export const checkLocalStorageResults = (userId = 1) => {
    try {
        const localResults = JSON.parse(localStorage.getItem(`testResults_${userId}`) || '[]');
        console.log(`📋 localStorage test results for user ${userId}:`);

        if (localResults.length === 0) {
            console.log('  No results found');
            return [];
        }

        localResults.forEach((result, index) => {
            console.log(`  ${index + 1}. Test ${result.testId}: ${result.result?.percentage || 0}% (${result.result?.passed ? 'Passed' : 'Failed'})`);
        });

        return localResults;

    } catch (error) {
        console.error('❌ Error checking localStorage:', error);
        return [];
    }
};

// Make functions available globally for console use
if (typeof window !== 'undefined') {
    window.syncLocalStorageToBackend = syncAllLocalStorageToBackend;
    window.checkLocalStorageResults = checkLocalStorageResults;
}

