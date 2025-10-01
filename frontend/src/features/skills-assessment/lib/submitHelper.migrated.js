/**
 * MIGRATED: Backend-only submission helper
 *
 * This file has been completely migrated to use backend APIs only.
 * All frontend scoring logic has been removed.
 *
 * DEPRECATED: Use backendSubmissionHelper.js instead
 */

import { submitTestAttempt as backendSubmitTest } from './backendSubmissionHelper';

/**
 * @deprecated Use backendSubmissionHelper.submitTestAttempt instead
 * Legacy wrapper for backward compatibility during migration
 */
export async function submitTestAttempt(params) {
 console.warn('submitTestAttempt from submitHelper is deprecated. Use backendSubmissionHelper instead.');

 // Map old parameters to new format
 const {
 testId,
 testData, // Not used in backend version
 answers,
 startedAt,
 finishedAt = Date.now(),
 reason = 'user',
 language = 'en',
 sectionBreakdown = null, // Not used in backend version
 onSuccess = null,
 onError = null
 } = params;

 // Use backend submission
 return backendSubmitTest({
 testId,
 answers,
 startedAt,
 finishedAt,
 reason,
 metadata: {
 language,
 sectionBreakdown,
 migrationSource: 'legacy_submitHelper'
 },
 onSuccess,
 onError
 });
}

/**
 * @deprecated This function is no longer needed with backend scoring
 * @throws {Error} Always throws error - use backend API instead
 */
export function calculateScore() {
 throw new Error('calculateScore() is deprecated. Backend handles all scoring.');
}

/**
 * @deprecated This function is no longer needed with backend scoring
 * @throws {Error} Always throws error - use backend API instead
 */
export function buildAttemptPayload() {
 throw new Error('buildAttemptPayload() is deprecated. Backend handles all attempt building.');
}

// Export the legacy wrapper for backward compatibility
export default {
 submitTestAttempt
};
