/**
 * Backend-only submission helper
 * Replaces frontend scoring logic with backend API calls
 */

import backendApi from '../api/backendApi';
import assessmentStore from '../store/useAssessmentStore';

/**
 * Submit test attempt using backend-only scoring
 * @param {Object} params - Submission parameters
 * @param {string} params.testId - Test ID
 * @param {Object} params.answers - User answers
 * @param {number} params.startedAt - Test start timestamp
 * @param {number} params.finishedAt - Test end timestamp (optional)
 * @param {string} params.reason - Submission reason ('user', 'time', 'aborted')
 * @param {Object} params.metadata - Additional metadata
 * @param {Function} params.onSuccess - Success callback
 * @param {Function} params.onError - Error callback
 */
export async function submitTestAttempt({
  testId,
  answers,
  startedAt,
  finishedAt = Date.now(),
  reason = 'user',
  metadata = {},
  onSuccess = null,
  onError = null
}) {
  try {
    console.log('Submitting test attempt to backend:', { testId, answerCount: Object.keys(answers).length });

    // Calculate time taken
    const timeTakenSeconds = backendApi.formatTimeTaken(startedAt, finishedAt);

    // Submit to backend for scoring
    const submissionResult = await backendApi.submitTestAnswers(
      testId,
      answers,
      timeTakenSeconds,
      {
        submission_reason: reason,
        ...metadata
      }
    );

    console.log('Backend submission successful:', submissionResult);

    // Extract score information from backend response
    const scoreData = submissionResult.score;
    const submissionData = {
      id: submissionResult.submission_id,
      test_id: String(testId),
      submission_id: submissionResult.submission_id,
      percentage: scoreData.percentage_score,
      correct: scoreData.correct_answers,
      total_questions: scoreData.total_questions,
      raw_score: scoreData.raw_score,
      max_possible_score: scoreData.max_possible_score,
      grade_letter: scoreData.grade_letter,
      passed: scoreData.passed,
      started_at: new Date(startedAt).toISOString(),
      finished_at: new Date(finishedAt).toISOString(),
      duration_seconds: timeTakenSeconds,
      result: reason === 'time' ? 'timeout' : reason === 'aborted' ? 'aborted' : 'completed',
      submitted_at: submissionResult.submitted_at,
      scoring_version: submissionResult.processing_info?.scoring_version || '1.0'
    };

    // Update local store with backend data
    assessmentStore.addAttempt(submissionData);

    // Call success callback with comprehensive results
    if (onSuccess) {
      onSuccess({
        attempt: submissionData,
        score: scoreData,
        submission: submissionResult,
        percentage: scoreData.percentage_score,
        correct: scoreData.correct_answers,
        total: scoreData.total_questions,
        grade: scoreData.grade_letter,
        passed: scoreData.passed,
        resultLabel: getResultLabel(scoreData.percentage_score, scoreData.grade_letter)
      });
    }

    return submissionResult;

  } catch (error) {
    console.error('Error submitting test attempt:', error);
    
    const errorMessage = backendApi.handleApiError(error, 'Test submission');
    
    if (onError) {
      onError(new Error(errorMessage));
    } else {
      // Create fallback local record for offline scenarios
      const fallbackPayload = {
        test_id: String(testId),
        percentage: 0,
        correct: 0,
        total_questions: Object.keys(answers).length,
        result: 'error',
        created_at: new Date().toISOString(),
        id: `error_${Date.now()}`,
        error_message: errorMessage
      };
      
      assessmentStore.addAttempt(fallbackPayload);
    }
    
    throw new Error(errorMessage);
  }
}

/**
 * Get test questions from backend (secure - no correct answers)
 */
export async function fetchTestQuestions(testId) {
  try {
    const questions = await backendApi.getTestQuestions(testId);
    console.log(`Fetched ${questions.length} questions for test ${testId}`);
    return questions;
  } catch (error) {
    console.error('Error fetching test questions:', error);
    throw new Error(backendApi.handleApiError(error, 'Fetching test questions'));
  }
}

/**
 * Get detailed test results from backend
 */
export async function fetchTestResults(submissionId) {
  try {
    const results = await backendApi.getTestResults(submissionId);
    console.log(`Fetched results for submission ${submissionId}`);
    return results;
  } catch (error) {
    console.error('Error fetching test results:', error);
    throw new Error(backendApi.handleApiError(error, 'Fetching test results'));
  }
}

/**
 * Get user's submission history
 */
export async function fetchUserSubmissions() {
  try {
    const submissions = await backendApi.getUserSubmissions();
    console.log(`Fetched ${submissions.length} user submissions`);
    return submissions;
  } catch (error) {
    console.error('Error fetching user submissions:', error);
    throw new Error(backendApi.handleApiError(error, 'Fetching user submissions'));
  }
}

/**
 * Validate answers before submission
 */
export async function validateTestAnswers(answers) {
  try {
    const validation = await backendApi.validateAnswers(answers);
    console.log('Answer validation successful:', validation);
    return validation;
  } catch (error) {
    console.error('Error validating answers:', error);
    throw new Error(backendApi.handleApiError(error, 'Validating answers'));
  }
}

/**
 * Get scoring configuration from backend
 */
export async function fetchScoringConfig() {
  try {
    const config = await backendApi.getScoringConfig();
    console.log('Fetched scoring configuration:', config);
    return config;
  } catch (error) {
    console.error('Error fetching scoring config:', error);
    throw new Error(backendApi.handleApiError(error, 'Fetching scoring configuration'));
  }
}

/**
 * Get result label based on score and grade
 */
function getResultLabel(percentage, grade) {
  if (percentage >= 90) return 'Excellent';
  if (percentage >= 80) return 'Very Good';
  if (percentage >= 70) return 'Good';
  if (percentage >= 60) return 'Satisfactory';
  if (percentage >= 50) return 'Needs Improvement';
  return 'Poor';
}

/**
 * Format answers for backend submission
 */
export function formatAnswersForSubmission(answers) {
  return backendApi.formatAnswersForBackend(answers);
}

/**
 * Calculate time taken in seconds
 */
export function calculateTimeTaken(startTime, endTime = Date.now()) {
  return backendApi.formatTimeTaken(startTime, endTime);
}

/**
 * Check if backend is available
 */
export async function checkBackendHealth() {
  try {
    const health = await backendApi.getHealthStatus();
    console.log('Backend health check:', health);
    return health.status === 'healthy';
  } catch (error) {
    console.error('Backend health check failed:', error);
    return false;
  }
}

/**
 * Legacy compatibility function - redirects to backend submission
 * @deprecated Use submitTestAttempt instead
 */
export async function submitTestAttemptLegacy(params) {
  console.warn('submitTestAttemptLegacy is deprecated. Use submitTestAttempt instead.');
  return submitTestAttempt(params);
}

export default {
  submitTestAttempt,
  fetchTestQuestions,
  fetchTestResults,
  fetchUserSubmissions,
  validateTestAnswers,
  fetchScoringConfig,
  formatAnswersForSubmission,
  calculateTimeTaken,
  checkBackendHealth,
  submitTestAttemptLegacy
};
