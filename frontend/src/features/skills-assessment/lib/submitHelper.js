import { buildAttemptPayload, calculateScore } from '../lib/scoreUtils';
import { postAttempt } from '../api/attemptsApi';
import assessmentStore from '../store/useAssessmentStore';

/**
 * Unified test submission handler for all test types
 */
export async function submitTestAttempt({
  testId,
  testData,
  answers,
  startedAt,
  finishedAt = Date.now(),
  reason = 'user',
  language = 'en',
  sectionBreakdown = null,
  onSuccess = null,
  onError = null
}) {
  try {
    // Calculate score from answers and test data
    const { correct, total } = calculateScore(answers, testData);
    
    // Build the attempt payload
    const payload = buildAttemptPayload({
      testId,
      total,
      correct,
      startedAt,
      finishedAt,
      reason,
      answersByQuestion: answers,
      sectionBreakdown,
      language
    });

    console.log('Submitting test attempt:', payload);

    // Try to save to backend
    let savedAttempt;
    try {
      savedAttempt = await postAttempt(payload);
      console.log('Successfully saved attempt to backend:', savedAttempt);
    } catch (backendError) {
      console.warn('Backend save failed, storing locally:', backendError);
      // Still proceed with local storage and UI updates
      savedAttempt = { ...payload, id: `local_${Date.now()}` };
    }

    // Update local store immediately (for UI responsiveness)
    assessmentStore.addAttempt(savedAttempt);

    // Call success callback with results
    if (onSuccess) {
      onSuccess({
        attempt: savedAttempt,
        percentage: payload.percentage,
        correct,
        total,
        resultLabel: payload.result_label
      });
    }

    return savedAttempt;

  } catch (error) {
    console.error('Error submitting test attempt:', error);
    
    if (onError) {
      onError(error);
    } else {
      // Default error handling - still create a minimal local record
      const fallbackPayload = {
        test_id: String(testId),
        percentage: 0,
        correct: 0,
        total_questions: testData?.length || 0,
        result: 'aborted',
        created_at: new Date().toISOString(),
        id: `error_${Date.now()}`
      };
      
      assessmentStore.addAttempt(fallbackPayload);
    }
    
    throw error;
  }
}

/**
 * Extract answers from different test component formats
 */
export function extractAnswers(answersObject, testData) {
  if (!answersObject || !testData) return {};
  
  const normalized = {};
  
  // Handle different answer formats
  if (Array.isArray(answersObject)) {
    // Array format: [answer1, answer2, ...]
    answersObject.forEach((answer, index) => {
      normalized[index] = answer;
    });
  } else if (typeof answersObject === 'object') {
    // Object format: { 0: 'a', 1: 'b', ... } or { q0: 'a', q1: 'b', ... }
    Object.entries(answersObject).forEach(([key, value]) => {
      normalized[key] = value;
    });
  }
  
  return normalized;
}

/**
 * Get test ID from various test identifiers
 */
export function normalizeTestId(testId) {
  if (!testId) return 'unknown';
  
  const id = String(testId).toLowerCase();
  
  // Map different test ID formats to canonical names
  const testIdMap = {
    'verbal': 'verbal',
    'verbal_reasoning': 'verbal',
    'numerical': 'numerical', 
    'numerical_reasoning': 'numerical',
    'logical': 'logical',
    'logical_reasoning': 'logical',
    'abstract': 'abstract',
    'abstract_reasoning': 'abstract',
    'spatial': 'spatial',
    'spatial_reasoning': 'spatial',
    'diagrammatic': 'diagrammatic',
    'diagrammatic_reasoning': 'diagrammatic',
    'situational': 'situational',
    'sjt': 'situational',
    'master-sjt': 'situational_advanced',
    'technical': 'technical'
  };
  
  return testIdMap[id] || id;
}
