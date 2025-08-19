import React from 'react';
import { useTranslation } from 'react-i18next';
import ProfileHeader from './ProfileHeader';
import BadgesGrid from './BadgesGrid';
import SkillsChart from './SkillsChart';
import TestTimeline from './TestTimeline';
import JobRecommendations from './JobRecommendations';

const Dashboard = () => {
  const { t } = useTranslation();
  // Mock data - replace with API calls
  const userData = {
    name: "Yassine",
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
            
            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
              <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-3 lg:mb-4">{t('quickStats')}</h3>
              <div className="space-y-3 lg:space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm lg:text-base">{t('testsCompleted')}</span>
                  <span className="font-semibold text-gray-900 text-sm lg:text-base">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm lg:text-base">{t('averageScore')}</span>
                  <span className="font-semibold text-green-600 text-sm lg:text-base">{userData.overallScore}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm lg:text-base">{t('jobMatches')}</span>
                  <span className="font-semibold text-blue-600 text-sm lg:text-base">{userData.jobRecommendations.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm lg:text-base">{t('xpPoints')}</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-purple-600 text-sm lg:text-base">{userData.xpPoints}</span>
                    <div className="w-12 lg:w-16 h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-2 bg-purple-500 rounded-full" 
                        style={{ width: `${(userData.xpPoints / userData.nextLevelXP) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
              <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-3 lg:mb-4">{t('recentActivity')}</h3>
              <div className="space-y-3">
                {userData.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === 'test_completed' ? 'bg-blue-500' :
                      activity.type === 'badge_earned' ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">
                        {activity.type === 'test_completed' && t('completedJavaAssessment')}
                        {activity.type === 'badge_earned' && t('earnedPythonBadge')}
                        {activity.type === 'skill_improved' && t('skillImproved')}
                      </p>
                      <p className="text-xs text-gray-500">{activity.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Main Content */}
          <div className="xl:col-span-8 space-y-4 lg:space-y-6">
            {/* Badges Grid */}
            <BadgesGrid badges={userData.badges} />
            
            {/* Skills Chart */}
            <SkillsChart testResults={userData.testResults} />
            
            {/* Job Recommendations */}
            <JobRecommendations jobs={userData.jobRecommendations} />
            
            {/* Test Timeline */}
            <TestTimeline tests={userData.testResults} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;