import React, { useState, useEffect } from 'react';
import ProfileHeader from './ProfileHeader';
// Core components for professional dashboard
import EmployabilityScore from './EmployabilityScore';
import CareerReadinessBreakdown from './CareerReadinessBreakdown';
import JobRecommendations from './JobRecommendations';
import RecentTests from './RecentTests';
import AchievementsBadges from './AchievementsBadges';
import QuickActions from './QuickActions';
// Merged and simplified components
import MergedStatsWidget from './MergedStatsWidget';
import { useScrollToTop } from '../../../shared/utils/scrollUtils';
import dashboardAggregatedApi from '../services/dashboardAggregatedApi';
import '../../../features/candidate-dashboard/styles/dashboard-design-system.css';

const Dashboard = ({ onNavigateToSection }) => {
  // Universal scroll management
  useScrollToTop([], { smooth: true }); // Scroll on component mount

  // State management
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await dashboardAggregatedApi.getDashboardSummary();
        const transformedData = dashboardAggregatedApi.transformDataForComponents(data);
        
        setDashboardData(transformedData);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const handleViewAllTests = () => {
    if (onNavigateToSection) {
      onNavigateToSection('tests-history');
    }
  };
  
  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <div className="ml-4 text-lg text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-center">
          <div className="text-red-400 mr-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-medium text-red-800">Error Loading Dashboard</h3>
            <p className="text-red-600 mt-1">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // User data for ProfileHeader
  const userData = {
    name: dashboardData?.userProfile?.first_name || "User",
    avatar: "avatar-3.png",
    level: dashboardData?.mergedStats?.levelProgress?.currentLevel || 1,
    overallScore: dashboardData?.employabilityScore?.score || 0,
    xpPoints: 2480,
    nextLevelXP: 3000,
    declaredSkills: ["Java", "Python", "Teamwork"]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sa-container py-6">
        {/* Hero Section - Employability Score (Full Width) */}
        <div className="mb-8">
          <EmployabilityScore data={dashboardData?.employabilityScore} />
        </div>

        {/* Professional Layout - Desktop (12 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Profile & Stats (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <ProfileHeader user={userData} />
            <MergedStatsWidget data={dashboardData?.mergedStats} />
            <RecentTests data={dashboardData?.recentTests} onViewAll={handleViewAllTests} />
            <AchievementsBadges data={dashboardData?.achievements} />
            <QuickActions onNavigateToSection={onNavigateToSection} />
          </div>

          {/* Right Column - Main Content (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Career Readiness Breakdown with integrated benchmarks */}
            <CareerReadinessBreakdown data={dashboardData?.careerReadinessBreakdown} />
            
            {/* Job Recommendations */}
            <JobRecommendations data={dashboardData?.jobRecommendations} onViewAll={handleViewAllTests} />
          </div>
        </div>

        {/* Mobile Layout - Stacked */}
        <div className="lg:hidden space-y-6 mt-6">
          <div className="space-y-6">
            <MergedStatsWidget />
            <RecentTests onViewAll={handleViewAllTests} />
            <AchievementsBadges />
            <QuickActions onNavigateToSection={onNavigateToSection} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;