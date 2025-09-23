const API_BASE_URL = 'http://localhost:8000/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

class DashboardAggregatedApi {
  /**
   * Get all dashboard data in a single API call
   */
  async getDashboardSummary() {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/dashboard/summary/`, {
        method: 'GET',
        headers: getAuthHeaders(),
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
      console.error('Error fetching dashboard summary:', error);
      throw error;
    }
  }

  /**
   * Transform dashboard data for individual components
   */
  transformDataForComponents(dashboardData) {
    const { test_history, achievements, job_recommendations, user_profile } = dashboardData;

    return {
      // For EmployabilityScore component
      employabilityScore: {
        score: test_history.summary.average_score,
        testsCompleted: test_history.summary.total_tests,
        averageScore: test_history.summary.average_score,
        trend: 'up', // Could be calculated from score_trend
        vsAverage: 5 // Placeholder
      },

      // For CareerReadinessBreakdown component
      careerReadinessBreakdown: test_history.category_stats.map(stat => ({
        category: stat.category,
        score: stat.average_score,
        benchmark: stat.average_score + 5 // Placeholder
      })),

      // For JobRecommendations component
      jobRecommendations: job_recommendations.jobs,

      // For RecentTests component
      recentTests: test_history.recent_sessions,

      // For AchievementsBadges component
      achievements: achievements.list,

      // For MergedStatsWidget component
      mergedStats: {
        testsCompleted: test_history.summary.total_tests,
        averageScore: test_history.summary.average_score,
        timeSpent: test_history.summary.total_time_spent,
        skillLevel: this.calculateSkillLevel(test_history.summary.average_score),
        levelProgress: this.calculateLevelProgress(test_history.summary.total_tests),
        recentActivity: test_history.recent_sessions.slice(0, 3)
      },

      // Chart data
      chartData: test_history.chart_data,

      // User profile
      userProfile: user_profile
    };
  }

  /**
   * Calculate skill level based on average score
   */
  calculateSkillLevel(averageScore) {
    if (averageScore >= 90) return 'Expert';
    if (averageScore >= 80) return 'Advanced';
    if (averageScore >= 70) return 'Intermediate';
    if (averageScore >= 60) return 'Beginner';
    return 'Novice';
  }

  /**
   * Calculate level progress based on tests completed
   */
  calculateLevelProgress(testsCompleted) {
    const levels = [
      { level: 1, required: 0, name: 'Novice' },
      { level: 2, required: 5, name: 'Beginner' },
      { level: 3, required: 10, name: 'Intermediate' },
      { level: 4, required: 20, name: 'Advanced' },
      { level: 5, required: 50, name: 'Expert' }
    ];

    let currentLevel = levels[0];
    let nextLevel = levels[1];

    for (let i = 0; i < levels.length - 1; i++) {
      if (testsCompleted >= levels[i].required && testsCompleted < levels[i + 1].required) {
        currentLevel = levels[i];
        nextLevel = levels[i + 1];
        break;
      }
    }

    if (testsCompleted >= levels[levels.length - 1].required) {
      currentLevel = levels[levels.length - 1];
      nextLevel = null;
    }

    const progress = nextLevel 
      ? Math.min(100, ((testsCompleted - currentLevel.required) / (nextLevel.required - currentLevel.required)) * 100)
      : 100;

    return {
      currentLevel: currentLevel.level,
      currentLevelName: currentLevel.name,
      nextLevel: nextLevel?.level,
      nextLevelName: nextLevel?.name,
      progress: Math.round(progress),
      testsCompleted,
      testsToNextLevel: nextLevel ? nextLevel.required - testsCompleted : 0
    };
  }
}

export default new DashboardAggregatedApi();
