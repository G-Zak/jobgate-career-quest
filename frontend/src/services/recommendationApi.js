/**
 * API service for job recommendations
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class RecommendationApiService {
  constructor() {
    this.baseURL = `${API_BASE_URL}/api/recommendations`;
  }

  /**
   * Get authentication token from localStorage
   */
  getAuthToken() {
    return localStorage.getItem('access_token');
  }

  /**
   * Make authenticated API request
   */
  async makeRequest(endpoint, options = {}) {
    const token = this.getAuthToken();
    const url = `${this.baseURL}${endpoint}`;

    console.log(`Making API request to: ${url}`);

    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    };

    const config = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      console.log(`Response status: ${response.status} for ${url}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error(`API Error for ${url}:`, errorData);
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  /**
   * Get job recommendations for the authenticated user
   */
  async getRecommendations(params = {}) {
    const queryParams = new URLSearchParams();

    if (params.limit) queryParams.append('limit', params.limit);
    if (params.min_score) queryParams.append('min_score', params.min_score);
    if (params.status) queryParams.append('status', params.status);

    // Use user profile from params if provided, otherwise get from localStorage
    const userProfile = params.user_profile || this.getUserProfile();
    if (userProfile) {
      queryParams.append('user_profile', JSON.stringify(userProfile));
    }

    const endpoint = queryParams.toString() ? `/?${queryParams.toString()}` : '/';
    return this.makeRequest(endpoint);
  }

  /**
   * Get user profile from localStorage
   */
  getUserProfile() {
    try {
      const profile = localStorage.getItem('userProfile_1');
      return profile ? JSON.parse(profile) : null;
    } catch (error) {
      console.error('Error loading user profile:', error);
      return null;
    }
  }

  /**
   * Get detailed job information with match score
   */
  async getJobDetails(jobId) {
    return this.makeRequest(`/jobs/${jobId}/`);
  }

  /**
   * Search jobs with filters
   */
  async searchJobs(params = {}) {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          value.forEach(v => queryParams.append(key, v));
        } else {
          queryParams.append(key, value);
        }
      }
    });

    const endpoint = queryParams.toString() ? `/jobs/search/?${queryParams.toString()}` : '/jobs/search/';
    return this.makeRequest(endpoint);
  }

  /**
   * Update recommendation status
   */
  async updateRecommendationStatus(recommendationId, status) {
    return this.makeRequest(`/recommendations/${recommendationId}/status/`, {
      method: 'POST',
      body: JSON.stringify({ status }),
    });
  }

  /**
   * Apply to a job
   */
  async applyToJob(jobId, coverLetter = '') {
    return this.makeRequest(`/jobs/${jobId}/apply/`, {
      method: 'POST',
      body: JSON.stringify({ cover_letter: coverLetter }),
    });
  }

  /**
   * Get user's job applications
   */
  async getMyApplications() {
    return this.makeRequest('/applications/');
  }

  /**
   * Get user job preferences
   */
  async getUserPreferences() {
    return this.makeRequest('/preferences/');
  }

  /**
   * Update user job preferences
   */
  async updateUserPreferences(preferences) {
    return this.makeRequest('/preferences/', {
      method: 'PUT',
      body: JSON.stringify(preferences),
    });
  }

  /**
   * Get user skills analysis
   */
  async getUserSkillsAnalysis(params = {}) {
    const userProfile = params.user_profile || this.getUserProfile();
    const queryParams = new URLSearchParams();

    if (userProfile) {
      queryParams.append('user_profile', JSON.stringify(userProfile));
    }

    const endpoint = queryParams.toString() ? `/skills/analysis/?${queryParams.toString()}` : '/skills/analysis/';
    return this.makeRequest(endpoint);
  }
}

// Create singleton instance
const recommendationApi = new RecommendationApiService();

export default recommendationApi;

// Export individual methods for convenience
export const {
  getRecommendations,
  getJobDetails,
  searchJobs,
  updateRecommendationStatus,
  applyToJob,
  getMyApplications,
  getUserPreferences,
  updateUserPreferences,
  getUserSkillsAnalysis,
} = recommendationApi;

