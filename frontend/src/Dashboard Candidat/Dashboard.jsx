import React from 'react';
import ProfileHeader from './ProfileHeader';
import BadgesGrid from './BadgesGrid';
import SkillsChart from './SkillsChart';
import TestTimeline from './TestTimeline';
import JobRecommendations from './JobRecommendations';
import { Link } from 'react-router-dom';




const Dashboard = () => {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between items-center h-16">
      <div className="flex items-center space-x-4">
        <div className="text-2xl font-bold text-blue-600">JobGate</div>
        <div className="hidden md:flex items-center space-x-6 ml-8">
          <a href="#" className="text-gray-600 hover:text-blue-600 font-medium border-b-2 border-blue-600 pb-4">Dashboard</a>
          <a href="#" className="text-gray-500 hover:text-gray-600 transition-colors duration-200">Skills</a>
          
          {/* Menu déroulant amélioré */}
          <div className="relative group">
            <button className="text-gray-500 hover:text-blue-600 flex items-center space-x-1 transition-colors duration-200">
              <span>Tests</span>
              <svg className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className="absolute left-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none transform opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 z-10">
              <div className="py-1">
                <Link 
                  to="/tests" 
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150 flex items-center"
                >
                  <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Test soft
                </Link>
                <Link 
                  to="/technical-tests" 
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150 flex items-center"
                >
                  <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Test technique
                </Link>
              </div>
            </div>
          </div>
          
          <a href="#" className="text-gray-500 hover:text-gray-600 transition-colors duration-200">Jobs</a>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <button className="p-2 text-gray-500 hover:text-gray-600 relative transition-colors duration-200">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5-5V9l-5-5H9l5 5v3z" />
          </svg>
          <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center transform hover:scale-110 transition-transform">3</span>
        </button>
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold hover:bg-blue-600 transition-colors duration-200 cursor-pointer">
          {userData.name.charAt(0)}
        </div>
      </div>
    </div>
  </div>
</nav>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {userData.name}! 👋
          </h1>
          <p className="text-gray-600">
            Ready to level up your career? Let's see what's new today.
          </p>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Profile & Stats */}
          <div className="lg:col-span-4 space-y-6">
            <ProfileHeader user={userData} />
            
            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Tests Completed</span>
                  <span className="font-semibold text-gray-900">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Average Score</span>
                  <span className="font-semibold text-green-600">{userData.overallScore}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Job Matches</span>
                  <span className="font-semibold text-blue-600">{userData.jobRecommendations.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">XP Points</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-purple-600">{userData.xpPoints}</span>
                    <div className="w-16 h-2 bg-gray-200 rounded-full">
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
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {userData.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === 'test_completed' ? 'bg-blue-500' :
                      activity.type === 'badge_earned' ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.content}</p>
                      <p className="text-xs text-gray-500">{activity.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Center Column - Main Content */}
          <div className="lg:col-span-8 space-y-6">
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