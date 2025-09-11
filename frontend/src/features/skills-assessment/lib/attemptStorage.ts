// Local storage utility for test attempts
export interface TestAttempt {
  test_id: string;
  total_questions: number;
  correct: number;
  percentage: number;
  started_at: string;
  finished_at: string;
  duration_seconds: number;
  result: 'completed' | 'timeout' | 'aborted';
}

const STORAGE_KEY = 'test_attempts';

export function saveAttempt(attempt: TestAttempt): void {
  try {
    const existing = getAttempts();
    const updated = [...existing, attempt];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving attempt:', error);
  }
}

export function getAttempts(): TestAttempt[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading attempts:', error);
    return [];
  }
}

export function getAttemptsForTest(testId: string): TestAttempt[] {
  return getAttempts().filter(attempt => attempt.test_id === testId);
}

export function getLatestAttemptForTest(testId: string): TestAttempt | null {
  const attempts = getAttemptsForTest(testId);
  return attempts.length > 0 ? attempts[attempts.length - 1] : null;
}

export function clearAttempts(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing attempts:', error);
  }
}
