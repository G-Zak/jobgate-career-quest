/**
 * Job Recommendations API Service
 * Handles all API calls related to job recommendations and profile synchronization
 */

class JobRecommendationsApi {
    constructor() {
        this.baseURL = 'http://localhost:8000/api/recommendations';
    }

    /**
     * Refresh the access token using the refresh token
     */
    async refreshAccessToken() {
        try {
            const refreshToken = localStorage.getItem('refresh_token');
            if (!refreshToken) {
                throw new Error('No refresh token available');
            }

            console.log('🔄 Refreshing access token...');

            const response = await fetch('http://localhost:8000/api/auth/token/refresh/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refresh: refreshToken }),
            });

            if (!response.ok) {
                throw new Error(`Token refresh failed: ${response.status}`);
            }

            const data = await response.json();

            if (data.access) {
                // Update the access token in localStorage
                localStorage.setItem('access_token', data.access);
                console.log('✅ Access token refreshed successfully');
                return data.access;
            } else {
                throw new Error('No access token in refresh response');
            }
        } catch (error) {
            console.error('❌ Token refresh failed:', error);
            // Clear tokens and redirect to login
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
            throw error;
        }
    }

    /**
     * Make an authenticated API request with automatic token refresh
     */
    async makeAuthenticatedRequest(endpoint, options = {}) {
        try {
            let token = localStorage.getItem('access_token');

            const response = await fetch(`${this.baseURL}${endpoint}`, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    ...options.headers,
                },
            });

            // If 401 Unauthorized, try to refresh token and retry
            if (response.status === 401) {
                console.log('🔄 401 Unauthorized, attempting token refresh...');

                try {
                    const newToken = await this.refreshAccessToken();

                    // Retry the request with the new token
                    const retryResponse = await fetch(`${this.baseURL}${endpoint}`, {
                        ...options,
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${newToken}`,
                            ...options.headers,
                        },
                    });

                    if (!retryResponse.ok) {
                        const errorText = await retryResponse.text();
                        console.error('🔍 Retry after refresh failed:', errorText);
                        throw new Error(`HTTP error! status: ${retryResponse.status}`);
                    }

                    return retryResponse;
                } catch (refreshError) {
                    console.error('❌ Token refresh failed, redirecting to login:', refreshError);
                    // Redirect to login page
                    window.location.href = '/login';
                    throw refreshError;
                }
            }

            if (!response.ok) {
                const errorText = await response.text();
                console.error('🔍 API Error response:', errorText);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return response;
        } catch (error) {
            console.error('Error in authenticated request:', error);
            throw error;
        }
    }

    /**
     * Get user profile data for recommendations
     */
    async getUserProfile() {
        try {
            console.log('🔍 JobRecommendationsApi - Getting user profile...');

            const response = await this.makeAuthenticatedRequest('/profile/', {
                method: 'GET',
                credentials: 'include',
            });

            console.log('🔍 JobRecommendationsApi - Response status:', response.status);
            const data = await response.json();
            console.log('🔍 JobRecommendationsApi - Response data:', data);

            return data;
        } catch (error) {
            console.error('Error fetching user profile:', error);
            throw error;
        }
    }

    /**
     * Sync user profile with recommendation system and get new recommendations
     */
    async syncProfileAndGetRecommendations(profileData, preferences = {}, options = {}) {
        try {
            const requestBody = {
                profile: profileData,
                preferences: preferences,
                limit: options.limit || 12,
                min_score: options.min_score || 50.0
            };

            console.log('🚀 Making API call to:', `${this.baseURL}/profile/sync/`);
            console.log('📤 Request body:', requestBody);

            const response = await this.makeAuthenticatedRequest('/profile/sync/', {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify(requestBody),
            });

            console.log('📡 Response status:', response.status);
            const data = await response.json();
            console.log('✅ API Response data:', data);
            return data;
        } catch (error) {
            console.error('Error syncing profile and getting recommendations:', error);
            throw error;
        }
    }

    /**
     * Get advanced job recommendations using Content-Based + K-Means algorithm
     */
    async getAdvancedRecommendations(profileData, options = {}) {
        try {
            console.log('🚀 Getting advanced recommendations with profile:', profileData);

            const response = await this.makeAuthenticatedRequest('/advanced/', {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify({
                    profile: profileData,
                    limit: options.limit || 12
                }),
            });

            console.log('📡 Advanced recommendations response:', response.status);
            const data = await response.json();
            console.log('✅ Advanced recommendations data:', data);
            return data;
        } catch (error) {
            console.error('Error getting advanced recommendations:', error);
            throw error;
        }
    }

    /**
     * Get saved job recommendations for the current user
     */
    async getSavedRecommendations(options = {}) {
        try {
            const params = new URLSearchParams();
            if (options.limit) params.append('limit', options.limit);
            if (options.min_score) params.append('min_score', options.min_score);
            if (options.status) params.append('status', options.status);

            const response = await this.makeAuthenticatedRequest(`/saved/?${params}`, {
                method: 'GET',
                credentials: 'include',
            });

            return await response.json();
        } catch (error) {
            console.error('Error fetching saved recommendations:', error);
            throw error;
        }
    }

    /**
     * Get job recommendations (legacy endpoint for compatibility)
     */
    async getRecommendations(userProfile = null, options = {}) {
        try {
            const params = new URLSearchParams();
            if (options.limit) params.append('limit', options.limit);
            if (options.min_score) params.append('min_score', options.min_score);
            if (options.status) params.append('status', options.status);

            if (userProfile) {
                params.append('user_profile', JSON.stringify(userProfile));
            }

            const response = await fetch(`${this.baseURL}/?${params}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                },
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching recommendations:', error);
            throw error;
        }
    }

    /**
     * Update recommendation status (viewed, applied, interested, etc.)
     */
    async updateRecommendationStatus(recommendationId, status) {
        try {
            const response = await fetch(`${this.baseURL}/recommendations/${recommendationId}/status/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                },
                credentials: 'include',
                body: JSON.stringify({ status }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error updating recommendation status:', error);
            throw error;
        }
    }

    /**
     * Apply to a job
     */
    async applyToJob(jobId, coverLetter = '', resumeUrl = '') {
        try {
            const response = await fetch(`${this.baseURL}/jobs/${jobId}/apply/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                },
                credentials: 'include',
                body: JSON.stringify({
                    cover_letter: coverLetter,
                    resume_url: resumeUrl,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error applying to job:', error);
            throw error;
        }
    }

    /**
     * Get user's job applications
     */
    async getMyApplications() {
        try {
            const response = await fetch(`${this.baseURL}/applications/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                },
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching applications:', error);
            throw error;
        }
    }

    /**
     * Get or update user job preferences
     */
    async getUserPreferences() {
        try {
            const response = await fetch(`${this.baseURL}/preferences/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                },
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching user preferences:', error);
            throw error;
        }
    }

    /**
     * Update user job preferences
     */
    async updateUserPreferences(preferences) {
        try {
            const response = await fetch(`${this.baseURL}/preferences/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                },
                credentials: 'include',
                body: JSON.stringify(preferences),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error updating user preferences:', error);
            throw error;
        }
    }

    /**
     * Get skills analysis for the current user
     */
    async getSkillsAnalysis(userProfile = null) {
        try {
            const params = new URLSearchParams();
            if (userProfile) {
                params.append('user_profile', JSON.stringify(userProfile));
            }

            const response = await fetch(`${this.baseURL}/skills/analysis/?${params}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                },
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching skills analysis:', error);
            throw error;
        }
    }
}

// Create and export a singleton instance
const jobRecommendationsApi = new JobRecommendationsApi();
export default jobRecommendationsApi;
