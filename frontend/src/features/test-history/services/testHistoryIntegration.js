/**
 * Test History Integration Service
 * Integrates test history functionality with existing test submission process
 */

import testHistoryApi from './testHistoryApi';

class TestHistoryIntegration {
 /**
 * Create a test session when a test starts
 */
 async startTestSession(testId) {
 try {
 const session = await testHistoryApi.createTestSession(testId);
 return session;
 } catch (error) {
 console.error('Failed to create test session:', error);
 // Don't throw error - test can continue without history tracking
 return null;
 }
 }

 /**
 * Submit test results to both scoring system and test history
 */
 async submitTestResults(testId, answers, score, timeSpent, detailedAnswers = []) {
 try {
 // Prepare test session data
 const sessionData = {
 test_id: testId,
 score: score.percentage_score || score.score || 0,
 answers: answers,
 time_spent: timeSpent,
 detailed_answers: detailedAnswers.map((answer, index) => ({
 question_id: answer.questionId || answer.question_id || index + 1,
 selected_answer: answer.selectedAnswer || answer.selected_answer || answer.answer,
 is_correct: answer.isCorrect || answer.is_correct || false,
 time_taken: answer.timeTaken || answer.time_taken || 0
 }))
 };

 // Submit to test history system
 const historyResult = await testHistoryApi.submitTestSession(sessionData);

 return {
 success: true,
 historySession: historyResult,
 message: 'Test results saved to history successfully'
 };
 } catch (error) {
 console.error('Failed to save test results to history:', error);
 return {
 success: false,
 error: error.message,
 message: 'Test completed but history not saved'
 };
 }
 }

 /**
 * Get test history for a specific test type
 */
 async getTestHistoryByType(testType) {
 try {
 const sessions = await testHistoryApi.getTestSessions();
 return sessions.filter(session => session.test_type === testType);
 } catch (error) {
 console.error('Failed to get test history by type:', error);
 return [];
 }
 }

 /**
 * Get user's test performance summary
 */
 async getUserPerformanceSummary() {
 try {
 const summary = await testHistoryApi.getTestHistorySummary();
 return summary;
 } catch (error) {
 console.error('Failed to get performance summary:', error);
 return null;
 }
 }

 /**
 * Check if user has completed a specific test before
 */
 async hasCompletedTest(testId) {
 try {
 const sessions = await testHistoryApi.getTestSessions();
 return sessions.some(session =>
 session.test === testId && session.status === 'completed'
 );
 } catch (error) {
 console.error('Failed to check test completion:', error);
 return false;
 }
 }

 /**
 * Get user's best score for a specific test
 */
 async getBestScoreForTest(testId) {
 try {
 const sessions = await testHistoryApi.getTestSessions();
 const testSessions = sessions.filter(session =>
 session.test === testId && session.status === 'completed'
 );

 if (testSessions.length === 0) return null;

 const bestSession = testSessions.reduce((best, current) =>
 (current.score_percentage || 0) > (best.score_percentage || 0) ? current : best
 );

 return bestSession.score_percentage || 0;
 } catch (error) {
 console.error('Failed to get best score:', error);
 return null;
 }
 }

 /**
 * Get test attempt count for a specific test
 */
 async getTestAttemptCount(testId) {
 try {
 const sessions = await testHistoryApi.getTestSessions();
 return sessions.filter(session => session.test === testId).length;
 } catch (error) {
 console.error('Failed to get attempt count:', error);
 return 0;
 }
 }

 /**
 * Get recent test activity
 */
 async getRecentActivity(limit = 5) {
 try {
 const sessions = await testHistoryApi.getTestSessions();
 return sessions
 .filter(session => session.status === 'completed')
 .sort((a, b) => new Date(b.start_time) - new Date(a.start_time))
 .slice(0, limit);
 } catch (error) {
 console.error('Failed to get recent activity:', error);
 return [];
 }
 }

 /**
 * Calculate user's overall performance metrics
 */
 async getPerformanceMetrics() {
 try {
 const summary = await testHistoryApi.getTestHistorySummary();
 const categoryStats = await testHistoryApi.getTestCategoryStats();

 return {
 totalTests: summary.completed_sessions,
 averageScore: summary.average_score,
 bestScore: summary.best_score,
 totalTimeSpent: summary.total_time_spent,
 categoryBreakdown: categoryStats,
 improvementTrend: this.calculateImprovementTrend(summary.recent_sessions || [])
 };
 } catch (error) {
 console.error('Failed to get performance metrics:', error);
 return null;
 }
 }

 /**
 * Calculate improvement trend from recent sessions
 */
 calculateImprovementTrend(recentSessions) {
 if (recentSessions.length < 2) return 'insufficient_data';

 const scores = recentSessions
 .sort((a, b) => new Date(a.start_time) - new Date(b.start_time))
 .map(session => session.score_percentage || 0);

 const firstHalf = scores.slice(0, Math.floor(scores.length / 2));
 const secondHalf = scores.slice(Math.floor(scores.length / 2));

 const firstAvg = firstHalf.reduce((sum, score) => sum + score, 0) / firstHalf.length;
 const secondAvg = secondHalf.reduce((sum, score) => sum + score, 0) / secondHalf.length;

 const improvement = secondAvg - firstAvg;

 if (improvement > 5) return 'improving';
 if (improvement < -5) return 'declining';
 return 'stable';
 }
}

// Create and export a singleton instance
const testHistoryIntegration = new TestHistoryIntegration();
export default testHistoryIntegration;
