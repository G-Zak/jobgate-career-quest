/**
 * Unified scoring utilities for all test types
 */

export function computeResultLabel(percentage) {
  if (percentage >= 80) return 'Strong';
  if (percentage >= 60) return 'Competent';
  return 'Developing';
}

export function buildAttemptPayload(input) {
  const {
    testId,
    total,
    correct,
    startedAt,
    finishedAt,
    reason,
    answersByQuestion = {},
    sectionBreakdown = null,
    language = 'en'
  } = input;

  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
  const duration = Math.max(0, Math.round((finishedAt - startedAt) / 1000));
  
  const result =
    reason === 'aborted' ? 'aborted' :
    reason === 'time' ? 'timeout' :
    'completed';

  return {
    test_id: String(testId),
    test_version: 'v1',
    language: language || 'en',
    total_questions: total,
    correct: correct,
    percentage,
    raw_score: percentage, // can later swap to IRT/standardized
    started_at: new Date(startedAt).toISOString(),
    finished_at: new Date(finishedAt).toISOString(),
    duration_seconds: duration,
    result,
    result_label: computeResultLabel(percentage),
    payload: {
      answersByQuestion: answersByQuestion || {},
      sectionBreakdown: sectionBreakdown || null,
      reason: reason
    },
  };
}

/**
 * Calculate score from answers and questions
 */
export function calculateScore(answers, questions) {
  if (!questions || questions.length === 0) {
    return { correct: 0, total: 0, percentage: 0 };
  }

  let correct = 0;
  const total = questions.length;

  questions.forEach((question, index) => {
    const userAnswer = answers[index] || answers[question.id] || answers[`q${index}`];
    if (userAnswer && question.correct_answer) {
      // Handle different answer formats
      const correctAnswer = question.correct_answer.toString().toLowerCase();
      const userAnswerNormalized = userAnswer.toString().toLowerCase();
      
      if (correctAnswer === userAnswerNormalized) {
        correct++;
      }
    }
  });

  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
  
  return { correct, total, percentage };
}

/**
 * Format duration for display
 */
export function formatDuration(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Get performance level based on percentage
 */
export function getPerformanceLevel(percentage) {
  if (percentage >= 90) return { label: 'Excellent', color: 'green', icon: '🏆' };
  if (percentage >= 80) return { label: 'Strong', color: 'blue', icon: '⭐' };
  if (percentage >= 70) return { label: 'Good', color: 'indigo', icon: '👍' };
  if (percentage >= 60) return { label: 'Competent', color: 'yellow', icon: '✓' };
  if (percentage >= 50) return { label: 'Fair', color: 'orange', icon: '📈' };
  return { label: 'Developing', color: 'red', icon: '📚' };
}
