/**
 * Backend API service for skills assessment
 * Replaces all frontend scoring logic with backend-only architecture
 */

import authService from '../../../services/authService';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class BackendApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async fetchWithAuth(url, options = {}, retry = true) {
    // Ensure headers object exists
    options.headers = options.headers || {};

    // Merge our auth headers (authService holds latest tokens)
    const authHeaders = {
      'Content-Type': 'application/json',
      ...(localStorage.getItem('access_token') && { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` })
    };

    options.headers = { ...authHeaders, ...options.headers };

    const response = await fetch(url, options);

    // If unauthorized and we haven't retried yet, try refreshing the token
    if (response.status === 401 && retry) {
      console.debug('[backendApi] Received 401, attempting token refresh...');
      try {
        const refreshed = await authService.refreshAccessToken();
        if (refreshed) {
          console.debug('[backendApi] Token refresh successful, retrying request');
          // Retry the original request with new token
          options.headers.Authorization = `Bearer ${localStorage.getItem('access_token')}`;
          return await this.fetchWithAuth(url, options, false);
        }
        console.debug('[backendApi] Token refresh failed or no refresh token available');
      } catch (e) {
        console.debug('[backendApi] Token refresh threw an error', e);
        // fall through and return original response
      }
    }

    return response;
  }

  /**
   * Get authentication headers
   */
  getAuthHeaders() {
    const token = localStorage.getItem('access_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  /**
   * Fetch all available tests
   */
  async getTests() {
    try {
      const response = await this.fetchWithAuth(`${this.baseURL}/api/tests/`, {
        method: 'GET'
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch tests: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching tests:', error);
      throw error;
    }
  }

  /**
   * Get test details by ID
   */
  async getTestDetails(testId) {
    try {
      const response = await this.fetchWithAuth(`${this.baseURL}/api/tests/${testId}/`, {
        method: 'GET'
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch test details: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching test details:', error);
      throw error;
    }
  }

  /**
   * Get test questions (without correct answers for security)
   */
  async getTestQuestions(testId) {
    try {
      const response = await this.fetchWithAuth(`${this.baseURL}/api/tests/${testId}/questions/`, {
        method: 'GET'
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch test questions: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching test questions:', error);
      throw error;
    }
  }

  /**
   * Submit test answers for scoring
   */
  async submitTestAnswers(testId, answers, timeTakenSeconds, metadata = {}) {
    try {
      // Preserve numeric answers for numerical reasoning tests.
      // Accept several possible metadata.testType values for robustness.
      const isNumericalType = metadata && (
        metadata.testType === 'numerical-reasoning' ||
        metadata.testType === 'numerical_reasoning' ||
        metadata.testType === 'numerical' ||
        metadata.test_type === 'numerical_reasoning'
      );

      const answersPayload = isNumericalType
        ? Object.fromEntries(Object.entries(answers).map(([k, v]) => [String(k), String(v)]))
        : this.formatAnswersForBackend(answers);

      const payload = {
        answers: answersPayload,
        time_taken_seconds: timeTakenSeconds,
        submission_metadata: {
          browser: navigator.userAgent,
          device: this.getDeviceType(),
          session_id: `sjt_${Date.now()}`,
          // Only include allowed metadata keys
          ...(metadata.browser && { browser: metadata.browser }),
          ...(metadata.device && { device: metadata.device }),
          ...(metadata.session_id && { session_id: metadata.session_id }),
          ...(metadata.user_agent && { user_agent: metadata.user_agent }),
          ...(metadata.screen_resolution && { screen_resolution: metadata.screen_resolution }),
          ...(metadata.timezone && { timezone: metadata.timezone })
        }
      };

      const response = await this.fetchWithAuth(`${this.baseURL}/api/tests/${testId}/submit/`, {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();

        // Handle 409 Conflict (duplicate submission) specially
        if (response.status === 409) {
          const duplicateError = new Error(`Submission already exists for this test`);
          duplicateError.status = 409;
          duplicateError.existingSubmission = {
            submissionId: errorData.existing_submission_id,
            score: errorData.existing_score,
            submittedAt: errorData.submitted_at,
            message: errorData.message
          };
          throw duplicateError;
        }

        throw new Error(`Failed to submit test: ${errorData.error || response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error submitting test:', error);
      throw error;
    }
  }

  /**
   * Get detailed test results by submission ID
   */
  async getTestResults(submissionId) {
    try {
      const response = await this.fetchWithAuth(`${this.baseURL}/api/submissions/${submissionId}/results/`, {
        method: 'GET'
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch test results: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching test results:', error);
      throw error;
    }
  }

  /**
   * Get user's test submission history
   */
  async getUserSubmissions() {
    try {
      const response = await this.fetchWithAuth(`${this.baseURL}/api/my-submissions/`, {
        method: 'GET'
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch user submissions: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching user submissions:', error);
      throw error;
    }
  }

  /**
   * Calculate score preview without saving (optional)
   */
  async calculateScorePreview(testId, answers, timeTakenSeconds) {
    try {
      const payload = {
        answers: this.formatAnswersForBackend(answers),
        time_taken_seconds: timeTakenSeconds
      };

      const response = await this.fetchWithAuth(`${this.baseURL}/api/tests/${testId}/calculate-score/`, {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Failed to calculate score preview: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error calculating score preview:', error);
      throw error;
    }
  }

  /**
   * Get scoring configuration
   */
  async getScoringConfig() {
    try {
      const response = await this.fetchWithAuth(`${this.baseURL}/api/scoring-config/`, {
        method: 'GET'
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch scoring config: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching scoring config:', error);
      throw error;
    }
  }

  /**
   * Validate answer format before submission
   */
  async validateAnswers(answers) {
    try {
      const payload = {
        answers: this.formatAnswersForBackend(answers)
      };

      const response = await this.fetchWithAuth(`${this.baseURL}/api/validate-answers/`, {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Answer validation failed: ${errorData.error || response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error validating answers:', error);
      throw error;
    }
  }

  /**
   * Get system health status
   */
  async getHealthStatus() {
    try {
      const response = await this.fetchWithAuth(`${this.baseURL}/api/health/`, {
        method: 'GET'
      });

      if (!response.ok) {
        throw new Error(`Health check failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error checking health status:', error);
      throw error;
    }
  }

  /**
   * Format answers for backend submission
   * Converts frontend answer format to backend expected format
   */
  formatAnswersForBackend(answers) {
    const formattedAnswers = {};
    
    Object.entries(answers).forEach(([questionId, answer]) => {
      const key = String(questionId);

      // Normalize simple string answers
      if (typeof answer === 'string') {
        const trimmed = answer.trim();
        // If it's a numeric string (e.g. '42', '3.14'), preserve it as-is
        if (/^-?\d+(?:\.\d+)?$/.test(trimmed)) {
          formattedAnswers[key] = trimmed;
          return;
        }

        // If single-char string, treat as choice letter
        if (trimmed.length === 1) {
          formattedAnswers[key] = trimmed.toUpperCase();
          return;
        }

        // Otherwise preserve the string (may be a free-text numeric or other answer)
        formattedAnswers[key] = trimmed;
        return;
      }

      // Normalize numeric answers (preserve number as string)
      if (typeof answer === 'number') {
        formattedAnswers[key] = String(answer);
        return;
      }

      // Fallback: convert to string if possible, otherwise skip
      try {
        formattedAnswers[key] = String(answer);
      } catch (e) {
        formattedAnswers[key] = '';
      }
    });

    return formattedAnswers;
  }

  /**
   * Get device type for metadata
   */
  getDeviceType() {
    const userAgent = navigator.userAgent;
    if (/Mobile|Android|iPhone|iPad/.test(userAgent)) {
      return 'Mobile';
    } else if (/Tablet|iPad/.test(userAgent)) {
      return 'Tablet';
    } else {
      return 'Desktop';
    }
  }

  /**
   * Format time taken in seconds
   */
  formatTimeTaken(startTime, endTime = Date.now()) {
    return Math.max(1, Math.round((endTime - startTime) / 1000));
  }

  /**
   * Error handler for API calls
   */
  handleApiError(error, context = 'API call') {
    console.error(`${context} failed:`, error);
    
    // Return a user-friendly error message
    if (error.message.includes('Failed to fetch')) {
      return 'Unable to connect to the server. Please check your internet connection.';
    } else if (error.message.includes('401')) {
      return 'Authentication required. Please log in again.';
    } else if (error.message.includes('403')) {
      return 'Access denied. You do not have permission to perform this action.';
    } else if (error.message.includes('404')) {
      return 'The requested resource was not found.';
    } else if (error.message.includes('500')) {
      return 'Server error. Please try again later.';
    } else {
      return error.message || 'An unexpected error occurred.';
    }
  }
}

// Create and export a singleton instance
const backendApi = new BackendApiService();
export default backendApi;

// Export individual methods for convenience
export const {
  getTests,
  getTestDetails,
  getTestQuestions,
  submitTestAnswers,
  getTestResults,
  getUserSubmissions,
  calculateScorePreview,
  getScoringConfig,
  validateAnswers,
  getHealthStatus,
  formatAnswersForBackend,
  formatTimeTaken,
  handleApiError
} = backendApi;
