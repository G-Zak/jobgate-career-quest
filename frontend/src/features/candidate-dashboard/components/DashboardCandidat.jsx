import React from 'react';
import ProfileHeader from './ProfileHeader';
import DynamicBadges from './DynamicBadges';
import SkillsPerformance from './SkillsPerformance';
import TestTimeline from './TestTimeline';
import JobRecommendations from './JobRecommendations';
import RecentTests from './RecentTests';
import TestStatsWidget from './TestStatsWidget';
import DynamicQuickStats from './DynamicQuickStats';
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
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Left Column - Profile & Stats */}
          <div className="xl:col-span-4 sa-stack">
            <ProfileHeader user={userData} />
            <DynamicQuickStats />
            <TestStatsWidget />
            <RecentTests onViewAll={handleViewAllTests} />
          </div>

          {/* Right Column - Main Content */}
          <div className="xl:col-span-8 sa-stack">
            <DynamicBadges />
            <SkillsPerformance />
            <JobRecommendations onViewAll={handleViewAllTests} />
            <TestTimeline onViewAll={handleViewAllTests} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;