/**
 * MIGRATED: Frontend scoring utilities - BACKEND-ONLY ARCHITECTURE
 * 
 * This file has been migrated to remove all frontend scoring logic.
 * All scoring is now handled by the backend API.
 * 
 * DEPRECATED FUNCTIONS:
 * - calculateScore() - Use backend API instead
 * - computePercentage() - Use backend API instead
 * - buildAttempt() - Use backendSubmissionHelper instead
 * 
 * REMAINING UTILITIES:
 * - Performance level display helpers
 * - Duration formatting
 * - UI utility functions
 */

/**
 * Format duration in seconds to human-readable string
 * @param {number} seconds - Duration in seconds
 * @returns {string} Formatted duration (e.g., "2m 30s")
 */
export function formatDuration(seconds) {
  if (seconds < 60) {
    return `${seconds}s`;
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
}

/**
 * Get performance level styling based on percentage score
 * @param {number} percentage - Score percentage (0-100)
 * @returns {Object} Performance level with styling
 */
export function getPerformanceLevel(percentage) {
  if (percentage >= 90) return { 
    level: 'Excellent', 
    color: 'text-green-600', 
    bgColor: 'bg-green-100',
    description: 'Outstanding performance'
  };
  if (percentage >= 80) return { 
    level: 'Very Good', 
    color: 'text-green-500', 
    bgColor: 'bg-green-50',
    description: 'Above average performance'
  };
  if (percentage >= 70) return { 
    level: 'Good', 
    color: 'text-blue-600', 
    bgColor: 'bg-blue-100',
    description: 'Solid performance'
  };
  if (percentage >= 60) return { 
    level: 'Satisfactory', 
    color: 'text-yellow-600', 
    bgColor: 'bg-yellow-100',
    description: 'Adequate performance'
  };
  if (percentage >= 50) return { 
    level: 'Needs Improvement', 
    color: 'text-orange-600', 
    bgColor: 'bg-orange-100',
    description: 'Below average performance'
  };
  return { 
    level: 'Poor', 
    color: 'text-red-600', 
    bgColor: 'bg-red-100',
    description: 'Requires significant improvement'
  };
}

/**
 * Get grade letter based on percentage score
 * @param {number} percentage - Score percentage (0-100)
 * @returns {string} Grade letter (A+, A, B+, B, C+, C, D, F)
 */
export function getGradeLetter(percentage) {
  if (percentage >= 97) return 'A+';
  if (percentage >= 93) return 'A';
  if (percentage >= 90) return 'A-';
  if (percentage >= 87) return 'B+';
  if (percentage >= 83) return 'B';
  if (percentage >= 80) return 'B-';
  if (percentage >= 77) return 'C+';
  if (percentage >= 73) return 'C';
  if (percentage >= 70) return 'C-';
  if (percentage >= 67) return 'D+';
  if (percentage >= 63) return 'D';
  if (percentage >= 60) return 'D-';
  return 'F';
}

/**
 * Check if score indicates passing grade
 * @param {number} percentage - Score percentage (0-100)
 * @param {number} passingThreshold - Passing threshold (default: 70)
 * @returns {boolean} Whether the score is passing
 */
export function isPassingScore(percentage, passingThreshold = 70) {
  return percentage >= passingThreshold;
}

/**
 * Format score for display
 * @param {number} score - Raw score
 * @param {number} maxScore - Maximum possible score
 * @returns {Object} Formatted score information
 */
export function formatScore(score, maxScore) {
  const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
  const performance = getPerformanceLevel(percentage);
  const grade = getGradeLetter(percentage);
  const passing = isPassingScore(percentage);

  return {
    raw: score,
    max: maxScore,
    percentage,
    grade,
    performance,
    passing,
    display: `${score}/${maxScore} (${percentage}%)`
  };
}

/**
 * Get time efficiency level based on time taken vs allocated time
 * @param {number} timeTaken - Time taken in seconds
 * @param {number} allocatedTime - Allocated time in seconds
 * @returns {Object} Time efficiency information
 */
export function getTimeEfficiency(timeTaken, allocatedTime) {
  const efficiency = (allocatedTime / timeTaken) * 100;
  
  if (efficiency >= 120) return {
    level: 'Very Fast',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    description: 'Completed well ahead of time'
  };
  if (efficiency >= 100) return {
    level: 'Efficient',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    description: 'Used time efficiently'
  };
  if (efficiency >= 80) return {
    level: 'Adequate',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    description: 'Used most of the allocated time'
  };
  return {
    level: 'Slow',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    description: 'Took longer than expected'
  };
}

/**
 * Calculate completion rate
 * @param {number} answered - Number of questions answered
 * @param {number} total - Total number of questions
 * @returns {Object} Completion information
 */
export function getCompletionRate(answered, total) {
  const rate = total > 0 ? Math.round((answered / total) * 100) : 0;
  
  let level, color, bgColor;
  if (rate >= 100) {
    level = 'Complete';
    color = 'text-green-600';
    bgColor = 'bg-green-100';
  } else if (rate >= 80) {
    level = 'Mostly Complete';
    color = 'text-blue-600';
    bgColor = 'bg-blue-100';
  } else if (rate >= 60) {
    level = 'Partially Complete';
    color = 'text-yellow-600';
    bgColor = 'bg-yellow-100';
  } else {
    level = 'Incomplete';
    color = 'text-red-600';
    bgColor = 'bg-red-100';
  }

  return {
    rate,
    level,
    color,
    bgColor,
    display: `${answered}/${total} (${rate}%)`
  };
}

/**
 * Format test results for display
 * @param {Object} results - Backend test results
 * @returns {Object} Formatted results for UI display
 */
export function formatTestResults(results) {
  if (!results) return null;

  const score = formatScore(results.raw_score, results.max_possible_score);
  const timeEfficiency = getTimeEfficiency(
    results.time_taken_seconds || 0,
    results.allocated_time_seconds || 1200 // 20 minutes default
  );
  const completion = getCompletionRate(
    results.correct_answers + results.incorrect_answers || 0,
    results.total_questions || 0
  );

  return {
    score,
    timeEfficiency,
    completion,
    grade: results.grade_letter,
    passed: results.passed,
    answers: results.answers || [],
    submittedAt: results.submitted_at,
    testType: results.test_type,
    difficulty: results.difficulty_breakdown || {}
  };
}

/**
 * DEPRECATED FUNCTIONS - DO NOT USE
 * These functions have been removed in favor of backend scoring
 */

/**
 * @deprecated Use backend API for score calculation
 * @throws {Error} Always throws error - use backend API instead
 */
export function calculateScore() {
  throw new Error('calculateScore() is deprecated. Use backend API for scoring.');
}

/**
 * @deprecated Use backend API for percentage calculation
 * @throws {Error} Always throws error - use backend API instead
 */
export function computePercentage() {
  throw new Error('computePercentage() is deprecated. Use backend API for scoring.');
}

/**
 * @deprecated Use backendSubmissionHelper for attempt building
 * @throws {Error} Always throws error - use backend API instead
 */
export function buildAttempt() {
  throw new Error('buildAttempt() is deprecated. Use backendSubmissionHelper instead.');
}

/**
 * @deprecated Use backendSubmissionHelper for attempt payload
 * @throws {Error} Always throws error - use backend API instead
 */
export function buildAttemptPayload() {
  throw new Error('buildAttemptPayload() is deprecated. Use backendSubmissionHelper instead.');
}

// Export all utility functions
export default {
  formatDuration,
  getPerformanceLevel,
  getGradeLetter,
  isPassingScore,
  formatScore,
  getTimeEfficiency,
  getCompletionRate,
  formatTestResults
};
