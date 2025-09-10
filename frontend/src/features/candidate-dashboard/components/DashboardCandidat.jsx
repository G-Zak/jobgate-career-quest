import React from 'react';
import ProfileHeader from './ProfileHeader';
import DynamicBadges from './DynamicBadges';
import DynamicSkillsPerformance from './DynamicSkillsPerformance';
import TestTimeline from './TestTimeline';
import JobRecommendations from './JobRecommendations';
import JobRecommendationWidget from '../../job-recommendations/components/JobRecommendationWidget';
import RecentTestResults from './RecentTestResults';
import TestStatsWidget from './TestStatsWidget';
import DynamicQuickStats from './DynamicQuickStats';
import { useScrollToTop } from '../../../shared/utils/scrollUtils';

const Dashboard = ({ onNavigateToSection }) => {
  // Universal scroll management
  useScrollToTop([], { smooth: true }); // Scroll on component mount

  const handleViewAllTests = () => {
    if (onNavigateToSection) {
      onNavigateToSection('historique-tests');
    }
  };

  const handleViewAllJobRecommendations = () => {
    if (onNavigateToSection) {
      onNavigateToSection('offres-recommandees');
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
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
        {/* Main Dashboard Content */}

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 lg:gap-6">
        {/* Left Column - Profile & Stats */}
        <div className="xl:col-span-4 space-y-4 lg:space-y-6">
          <ProfileHeader user={userData} />
          
          {/* Dynamic Quick Stats */}
          <DynamicQuickStats />

          {/* Job Recommendations Widget */}
          <JobRecommendationWidget 
            userSkills={userData.declaredSkills}
            userLocation="Casablanca"
            maxJobs={3}
            onViewAll={handleViewAllJobRecommendations}
          />

          {/* Test Stats Widget */}
          <TestStatsWidget />

          {/* Recent Test Results */}
          <RecentTestResults onViewAll={handleViewAllTests} />
        </div>          {/* Right Column - Main Content */}
          <div className="xl:col-span-8 space-y-4 lg:space-y-6">
            {/* Dynamic Badges Grid */}
            <DynamicBadges />
            
            {/* Dynamic Skills Performance */}
            <DynamicSkillsPerformance />
            
            {/* Job Recommendations */}
            <JobRecommendations jobs={userData.jobRecommendations} />
            
            {/* Test Timeline */}
            <TestTimeline onViewAll={handleViewAllTests} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;