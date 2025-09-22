/**
 * Test History Service
 * Handles all API calls related to test history management
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

class TestHistoryService {
  /**
   * Save a new test session result
   * @param {Object} testData - Test session data
   * @returns {Promise<Object>} - Saved test history entry
   */
  static async saveTestHistory(testData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/test-history/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save test history');
      }

      return await response.json();
    } catch (error) {
      console.error('Error saving test history:', error);
      throw error;
    }
  }

  /**
   * Get test history for a specific user
   * @param {string|number} userId - User ID or 'anonymous'
   * @param {Object} filters - Optional filters
   * @returns {Promise<Object>} - Test history data with pagination
   */
  static async getUserTestHistory(userId = 'anonymous', filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      // Add filters to query params
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value);
        }
      });

      const url = userId === 'anonymous' 
        ? `${API_BASE_URL}/api/test-history/user/?${queryParams}`
        : `${API_BASE_URL}/api/test-history/user/${userId}/?${queryParams}`;

      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch test history');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching test history:', error);
      throw error;
    }
  }

  /**
   * Get detailed information about a specific test session
   * @param {number} sessionId - Session ID
   * @returns {Promise<Object>} - Detailed test session data
   */
  static async getTestHistoryDetail(sessionId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/test-history/${sessionId}/`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch test history detail');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching test history detail:', error);
      throw error;
    }
  }

  /**
   * Get comprehensive test history statistics for a user
   * @param {string|number} userId - User ID or 'anonymous'
   * @returns {Promise<Object>} - Test history statistics
   */
  static async getTestHistoryStats(userId = 'anonymous') {
    try {
      const url = userId === 'anonymous'
        ? `${API_BASE_URL}/api/test-history/user/stats/`
        : `${API_BASE_URL}/api/test-history/user/${userId}/stats/`;

      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch test history stats');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching test history stats:', error);
      throw error;
    }
  }

  /**
   * Delete a specific test history entry
   * @param {number} sessionId - Session ID
   * @returns {Promise<boolean>} - Success status
   */
  static async deleteTestHistory(sessionId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/test-history/${sessionId}/delete/`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete test history');
      }

      return true;
    } catch (error) {
      console.error('Error deleting test history:', error);
      throw error;
    }
  }

  /**
   * Helper method to format test history data for display
   * @param {Object} historyEntry - Raw test history entry
   * @returns {Object} - Formatted data
   */
  static formatHistoryEntry(historyEntry) {
    return {
      ...historyEntry,
      dateFormatted: new Date(historyEntry.date_taken).toLocaleDateString(),
      timeFormatted: new Date(historyEntry.date_taken).toLocaleTimeString(),
      scoreColor: historyEntry.percentage_score >= 70 ? 'text-green-600' : 'text-red-600',
      gradeColor: this.getGradeColor(historyEntry.grade_letter),
    };
  }

  /**
   * Get color class for grade letter
   * @param {string} grade - Grade letter (A, B, C, D, F)
   * @returns {string} - CSS color class
   */
  static getGradeColor(grade) {
    const gradeColors = {
      'A': 'text-green-600',
      'B': 'text-blue-600',
      'C': 'text-yellow-600',
      'D': 'text-orange-600',
      'F': 'text-red-600',
    };
    return gradeColors[grade] || 'text-gray-600';
  }

  /**
   * Get category color for test types
   * @param {string} category - Test category
   * @returns {string} - CSS color class
   */
  static getCategoryColor(category) {
    const categoryColors = {
      'verbal_reasoning': 'bg-blue-100 text-blue-800',
      'numerical_reasoning': 'bg-green-100 text-green-800',
      'logical_reasoning': 'bg-purple-100 text-purple-800',
      'situational_judgment': 'bg-orange-100 text-orange-800',
      'abstract_reasoning': 'bg-pink-100 text-pink-800',
      'spatial_reasoning': 'bg-indigo-100 text-indigo-800',
      'technical': 'bg-gray-100 text-gray-800',
    };
    return categoryColors[category] || 'bg-gray-100 text-gray-800';
  }
}

export default TestHistoryService;
