// Candidate Dashboard Service
// API calls specific to candidate dashboard functionality

import apiClient from '../../shared/services/api.js';
import { ENDPOINTS } from '../../shared/services/endpoints.js';

export class CandidateDashboardService {
  // Get candidate dashboard data
  static async getDashboardData(userId) {
    try {
      const response = await apiClient.get(ENDPOINTS.DASHBOARD.CANDIDATE, {
        params: { user_id: userId }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  }

  // Get user profile
  static async getUserProfile(userId) {
    try {
      const response = await apiClient.get(ENDPOINTS.USERS.DETAIL(userId));
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }

  // Get user badges
  static async getUserBadges(userId) {
    try {
      const response = await apiClient.get(ENDPOINTS.BADGES.USER_BADGES(userId));
      return response.data;
    } catch (error) {
      console.error('Error fetching user badges:', error);
      throw error;
    }
  }

  // Get test results/history
  static async getTestHistory(userId) {
    try {
      const response = await apiClient.get(ENDPOINTS.TESTS.HISTORY(userId));
      return response.data;
    } catch (error) {
      console.error('Error fetching test history:', error);
      throw error;
    }
  }

  // Get job recommendations
  static async getJobRecommendations(userId) {
    try {
      const response = await apiClient.get(ENDPOINTS.JOBS.RECOMMENDATIONS, {
        params: { user_id: userId }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching job recommendations:', error);
      throw error;
    }
  }

  // Get user skills
  static async getUserSkills(userId) {
    try {
      const response = await apiClient.get(ENDPOINTS.SKILLS.USER_SKILLS(userId));
      return response.data;
    } catch (error) {
      console.error('Error fetching user skills:', error);
      throw error;
    }
  }

  // Update user profile
  static async updateProfile(userId, profileData) {
    try {
      const response = await apiClient.put(
        ENDPOINTS.USERS.UPDATE_PROFILE(userId), 
        profileData
      );
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }
}

export default CandidateDashboardService;
