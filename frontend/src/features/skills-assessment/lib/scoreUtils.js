export function computePercentage(correct, total) {
  return total ? Math.round((correct / total) * 100) : 0;
}

export function buildAttempt(testId, total, correct, startedAt, reason) {
  const percentage = computePercentage(correct, total);
  return {
    test_id: String(testId),
    total_questions: total,
    correct,
    percentage,
    started_at: new Date(startedAt).toISOString(),
    finished_at: new Date().toISOString(),
    duration_seconds: Math.max(0, Math.round((Date.now() - startedAt) / 1000)),
    result: reason === 'time' ? 'timeout' : reason === 'aborted' ? 'aborted' : 'completed',
  };
}

export function formatDuration(seconds) {
  if (seconds < 60) {
    return `${seconds}s`;
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
}

export function getPerformanceLevel(percentage) {
  if (percentage >= 90) return { level: 'Excellent', color: 'text-green-600', bgColor: 'bg-green-100' };
  if (percentage >= 80) return { level: 'Very Good', color: 'text-green-500', bgColor: 'bg-green-50' };
  if (percentage >= 70) return { level: 'Good', color: 'text-blue-600', bgColor: 'bg-blue-100' };
  if (percentage >= 60) return { level: 'Satisfactory', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
  if (percentage >= 50) return { level: 'Needs Improvement', color: 'text-orange-600', bgColor: 'bg-orange-100' };
  return { level: 'Poor', color: 'text-red-600', bgColor: 'bg-red-100' };
}

export function buildAttemptPayload(testId, total, correct, startedAt, reason) {
  return buildAttempt(testId, total, correct, startedAt, reason);
}

export function calculateScore(correct, total) {
  return computePercentage(correct, total);
}
