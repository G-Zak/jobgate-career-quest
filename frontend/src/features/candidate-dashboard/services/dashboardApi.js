const API_BASE_URL = 'http://localhost:8000/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

class DashboardApi {
  // Get user profile data
  async getUserProfile() {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }

  // Get employability score data
  async getEmployabilityScore(profile = null) {
    try {
      // Build URL with profile parameter if provided
      let url = `${API_BASE_URL}/test-history/summary/`;
      if (profile) {
        url += `?profile=${encodeURIComponent(profile)}`;
      }

      const response = await fetch(url, {

        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Transform the new structured data to match component expectations
      return {
        // Core score data
        overallScore: data.overall_score || 0,
        categories: data.categories || {},
        individual_test_scores: data.individual_test_scores || {}, // Add individual test scores
        testsCompleted: data.total_tests_completed || 0,
        improvement: data.improvement_trend || 0,
        lastUpdated: data.last_updated || new Date().toISOString(),

        // Score interpretation
        scoreInterpretation: data.score_interpretation || {
          level: 'Unknown',
          description: 'No data available',
          market_position: 'Unknown',
          color: 'gray'
        },

        // Recommendations
        recommendations: data.recommendations || [],

        // Profile information
        profile: data.profile || null,

        // Legacy compatibility
        level: this.calculateLevel(data.overall_score || 0),
        xpPoints: (data.total_tests_completed || 0) * 100,
        nextLevelXP: this.getNextLevelXP((data.total_tests_completed || 0) * 100),

        // Backward compatibility fields
        average_score: data.overall_score || 0,
        best_score: data.best_score || 0,
        total_time_spent: data.total_time_spent || 0,
        recent_sessions: data.recent_sessions || []

      };
    } catch (error) {
      console.error('Error fetching employability score:', error);
      throw error;
    }
  }

  // Get career readiness breakdown
  async getCareerReadinessBreakdown() {
    try {
      const response = await fetch(`${API_BASE_URL}/test-history/category-stats/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Transform category stats to breakdown format
      return {
        categories: data.category_stats || [],
        overallReadiness: data.overall_readiness || 0,
        strengths: data.top_categories || [],
        areasForImprovement: data.bottom_categories || [],
        benchmark: {
          industry: 75,
          peer: 68,
          target: 85
        }
      };
    } catch (error) {
      console.error('Error fetching career readiness breakdown:', error);
      throw error;
    }
  }

  // Get job recommendations
  async getJobRecommendations(limit = 3) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/dashboard/summary/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const jobs = data.job_recommendations?.jobs || [];
      return jobs.slice(0, limit);
    } catch (error) {
      console.error('Error fetching job recommendations:', error);
      // Return enhanced mock data if API fails
      return [
        {
          id: "101",
          title: "Frontend Developer",
          company: "PixelTech",
          match: 89,
          salary: "$75k-$95k",
          location: "Remote",
          skills: ["React", "JavaScript", "CSS", "TypeScript"],
          description: "Join our team to build amazing user interfaces using modern web technologies. You'll work on cutting-edge projects that impact millions of users.",
          type: "Full-time",
          posted: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "205",
          title: "Python Developer",
          company: "DataCraft",
          match: 78,
          salary: "$65k-$85k",
          location: "San Francisco",
          skills: ["Python", "Django", "SQL", "PostgreSQL"],
          description: "We're looking for a passionate Python developer to join our data engineering team. Work with large datasets and build scalable applications.",
          type: "Full-time",
          posted: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "312",
          title: "Full Stack Developer",
          company: "TechStart",
          match: 72,
          salary: "$70k-$90k",
          location: "New York",
          skills: ["React", "Node.js", "MongoDB", "AWS"],
          description: "Join our fast-growing startup as a full-stack developer. You'll work on both frontend and backend systems in a collaborative environment.",
          type: "Full-time",
          posted: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];
    }
  }

  // Get recent tests
  async getRecentTests(limit = 5) {
    try {
      const response = await fetch(`${API_BASE_URL}/test-history/summary/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Extract recent sessions from the summary and limit them
      const recentSessions = data.recent_sessions || [];
      return recentSessions.slice(0, limit).map(session => ({
        id: session.id,
        test_name: session.test_title,
        test_type: session.test_type,
        score: session.score,
        date: session.start_time,
        duration_minutes: session.duration_minutes,
        passed: session.passed || session.score >= 70 // Fallback pass criteria
      }));
    } catch (error) {
      console.error('Error fetching recent tests:', error);
      throw error;
    }
  }

  // Get test statistics
  async getTestStatistics() {
    try {
      const response = await fetch(`${API_BASE_URL}/test-history/summary/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      return {
        totalTests: data.total_tests_completed || 0,
        averageScore: data.average_score || 0,
        timeSpent: data.total_time_spent || 0,
        skillLevel: this.calculateSkillLevel(data.average_score || 0),
        recentActivity: data.recent_activity || []
      };
    } catch (error) {
      console.error('Error fetching test statistics:', error);
      throw error;
    }
  }

  // Get achievements and badges
  async getAchievements() {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/achievements/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.achievements || [];
    } catch (error) {
      console.error('Error fetching achievements:', error);
      throw error;
    }
  }

  // Helper methods
  calculateLevel(xpPoints) {
    if (xpPoints < 500) return 1;
    if (xpPoints < 1000) return 2;
    if (xpPoints < 2000) return 3;
    if (xpPoints < 4000) return 4;
    return 5;
  }

  getNextLevelXP(currentXP) {
    const levels = [0, 500, 1000, 2000, 4000, 8000];
    const currentLevel = this.calculateLevel(currentXP);
    return levels[currentLevel] || 8000;
  }

  calculateSkillLevel(averageScore) {
    if (averageScore >= 90) return "Expert";
    if (averageScore >= 75) return "Advanced";
    if (averageScore >= 60) return "Intermediate";
    return "Beginner";
  }
}

export default new DashboardApi();
