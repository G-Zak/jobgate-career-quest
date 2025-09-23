import React from 'react';
import ProfileHeader from './ProfileHeader';
// Core components for professional dashboard
import EmployabilityScore from './EmployabilityScore';
import CareerReadinessBreakdown from './CareerReadinessBreakdown';
import EnhancedJobRecommendations from './EnhancedJobRecommendations';
// Merged and simplified components
import MergedStatsWidget from './MergedStatsWidget';
import SimplifiedRecentTests from './SimplifiedRecentTests';
import { useScrollToTop } from '../../../shared/utils/scrollUtils';
import '../../../features/candidate-dashboard/styles/dashboard-design-system.css';

const Dashboard = ({ onNavigateToSection }) => {
  // Universal scroll management
  useScrollToTop([], { smooth: true }); // Scroll on component mount

  const handleViewAllTests = () => {
    if (onNavigateToSection) {
      onNavigateToSection('tests-history');
    }
  };
  
  // Mock data - replace with API calls
  const userData = {
    name: "zakaria",
    avatar: "avatar-3.png",
    level: 3,
    overallScore: 82,
    xpPoints: 2480,
    nextLevelXP: 3000,
    declaredSkills: ["Java", "Python", "Teamwork"],
    badges: [
      { id: 1, name: "Java Expert", image: "js-badge", earned: true, rarity: "gold" },
      { id: 2, name: "Python Pro", image: "python-badge", earned: true, rarity: "silver" },
      { id: 3, name: "Quick Learner", image: "learner-badge", earned: false, rarity: "bronze" }
    ],
    testResults: [
      { test_type: "Java", score: 88, date: "2023-05-15" },
      { test_type: "Python", score: 76, date: "2023-05-10" }
    ],
    jobRecommendations: [
      { id: "101", title: "Frontend Developer", company: "PixelTech", match: 89, salary: "$75k-$95k", location: "Remote" },
      { id: "205", title: "Python Developer", company: "DataCraft", match: 78, salary: "$65k-$85k", location: "San Francisco" }
    ],
    recentActivity: [
      { type: "test_completed", content: "Completed Java Assessment", date: "2 hours ago", score: 88 },
      { type: "badge_earned", content: "Earned Python Pro badge", date: "1 day ago" },
      { type: "skill_improved", content: "Teamwork skill improved", date: "3 days ago" }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sa-container py-6">
        {/* Hero Section - Employability Score (Full Width) */}
        <div className="mb-8">
          <EmployabilityScore />
        </div>

        {/* Professional Layout - Desktop (12 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Profile & Stats (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <ProfileHeader user={userData} />
            <MergedStatsWidget />
            <SimplifiedRecentTests onViewAll={handleViewAllTests} />
            
            {/* Achievements & Badges */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Achievements</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">🏆</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Perfect Score</p>
                    <p className="text-xs text-gray-600">Verbal Reasoning - 100%</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">⚡</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Speed Master</p>
                    <p className="text-xs text-gray-600">Completed 5 tests this week</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">📈</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Improvement</p>
                    <p className="text-xs text-gray-600">+12% average score increase</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg text-sm font-medium transition-colors">
                  Take New Assessment
                </button>
                <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-lg text-sm font-medium transition-colors">
                  View All Tests
                </button>
                <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-lg text-sm font-medium transition-colors">
                  Update Profile
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Main Content (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Career Readiness Breakdown with integrated benchmarks */}
            <CareerReadinessBreakdown />
            
            {/* Job Recommendations */}
            <EnhancedJobRecommendations onViewAll={handleViewAllTests} />
          </div>
        </div>

        {/* Mobile Layout - Stacked */}
        <div className="lg:hidden space-y-6 mt-6">
          <div className="space-y-6">
            <MergedStatsWidget />
            <SimplifiedRecentTests onViewAll={handleViewAllTests} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;