import React from 'react';
import { 
  ChartBarIcon, 
  ClockIcon, 
  TrophyIcon, 
  ArrowTrendingUpIcon,
  CheckCircleIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

const MergedStatsWidget = () => {
  // Mock data - replace with API calls
  const stats = {
    testsCompleted: 21,
    averageScore: 78.5,
    timeSpent: 296, // minutes
    recentActivity: [
      { test: "Verbal Reasoning", score: 85, time: "2 hours ago" },
      { test: "Numerical", score: 72, time: "1 day ago" },
      { test: "Abstract", score: 91, time: "2 days ago" }
    ],
    trends: {
      scoreTrend: '+5.2%',
      completionTrend: '+12%',
      timeTrend: '-8%'
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Performance Overview</h3>
        <ChartBarIcon className="h-5 w-5 text-blue-500" />
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-center mb-1">
            <CheckCircleIcon className="h-5 w-5 text-blue-600 mr-1" />
            <span className="text-2xl font-bold text-blue-900">{stats.testsCompleted}</span>
          </div>
          <p className="text-sm text-blue-700 font-medium">Tests Completed</p>
          <p className="text-xs text-blue-600">{stats.trends.completionTrend} this month</p>
        </div>

        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="flex items-center justify-center mb-1">
            <TrophyIcon className="h-5 w-5 text-green-600 mr-1" />
            <span className="text-2xl font-bold text-green-900">{stats.averageScore}%</span>
          </div>
          <p className="text-sm text-green-700 font-medium">Average Score</p>
          <p className="text-xs text-green-600">{stats.trends.scoreTrend} improvement</p>
        </div>

        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <div className="flex items-center justify-center mb-1">
            <ClockIcon className="h-5 w-5 text-purple-600 mr-1" />
            <span className="text-2xl font-bold text-purple-900">{Math.floor(stats.timeSpent / 60)}h</span>
          </div>
          <p className="text-sm text-purple-700 font-medium">Time Invested</p>
          <p className="text-xs text-purple-600">{stats.trends.timeTrend} efficiency</p>
        </div>

        <div className="text-center p-3 bg-orange-50 rounded-lg">
          <div className="flex items-center justify-center mb-1">
            <AcademicCapIcon className="h-5 w-5 text-orange-600 mr-1" />
            <span className="text-2xl font-bold text-orange-900">4.2</span>
          </div>
          <p className="text-sm text-orange-700 font-medium">Skill Level</p>
          <p className="text-xs text-orange-600">Out of 5.0</p>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-600">Level Progress</span>
          <span className="text-gray-900 font-medium">Level 3</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full" style={{ width: '82%' }}></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>2,480 XP</span>
          <span>3,000 XP</span>
        </div>
      </div>

      {/* Recent Activity Snapshot */}
      <div className="border-t pt-4">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Recent Activity</h4>
        <div className="space-y-2">
          {stats.recentActivity.slice(0, 3).map((activity, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-gray-600">{activity.test}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-900">{activity.score}%</span>
                <span className="text-gray-400 text-xs">{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 text-center">
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            View All Activity →
          </button>
        </div>
      </div>
    </div>
  );
};

export default MergedStatsWidget;
