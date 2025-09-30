/**
 * Test History API Service
 * Handles all API calls related to test history and sessions
 */

const API_BASE_URL = 'http://localhost:8000/api';

class TestHistoryApi {
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
   * Get all test sessions for the current user
   */
  async getTestSessions() {
    try {
      const response = await fetch(`${API_BASE_URL}/test-sessions/`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          throw new Error('Session expired. Please log in again.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching test sessions:', error);
      throw error;
    }
  }

  /**
   * Get detailed information about a specific test session
   */
  async getTestSessionDetail(sessionId) {
    try {
      const response = await fetch(`${API_BASE_URL}/test-sessions/${sessionId}/detail/`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching test session detail:', error);
      throw error;
    }
  }

  /**
   * Create a new test session
   */
  async createTestSession(testId) {
    try {
      const response = await fetch(`${API_BASE_URL}/test-sessions/`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          test: testId,
          status: 'in_progress'
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating test session:', error);
      throw error;
    }
  }

  /**
   * Submit a completed test session
   */
  async submitTestSession(sessionData) {
    try {
      const response = await fetch(`${API_BASE_URL}/test-sessions/submit/`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(sessionData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error submitting test session:', error);
      throw error;
    }
  }

  /**
   * Get test history summary statistics
   */
  async getTestHistorySummary() {
    try {
      const response = await fetch(`${API_BASE_URL}/test-history/summary/`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          throw new Error('Session expired. Please log in again.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching test history summary:', error);
      throw error;
    }
  }

  /**
   * Get test category statistics
   */
  async getTestCategoryStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/test-history/category-stats/`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          throw new Error('Session expired. Please log in again.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

  // API now returns the category stats array directly
  return await response.json();
    } catch (error) {
      console.error('Error fetching test category stats:', error);
      throw error;
    }
  }

  /**
   * Get chart data for test history
   */
  async getTestHistoryCharts() {
    try {
      const response = await fetch(`${API_BASE_URL}/test-history/charts/`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          throw new Error('Session expired. Please log in again.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching test history charts:', error);
      throw error;
    }
  }

  /**
   * Delete a test session
   */
  async deleteTestSession(sessionId) {
    try {
      const response = await fetch(`${API_BASE_URL}/test-sessions/${sessionId}/delete/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting test session:', error);
      throw error;
    }
  }
}

// Create and export a singleton instance
const testHistoryApi = new TestHistoryApi();
export default testHistoryApi;
