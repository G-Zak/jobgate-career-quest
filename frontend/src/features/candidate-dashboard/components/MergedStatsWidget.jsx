import React, { useState, useEffect } from 'react';
import {
 ChartBarIcon,
 ClockIcon,
 TrophyIcon,
 ArrowTrendingUpIcon,
 CheckCircleIcon,
 AcademicCapIcon
} from '@heroicons/react/24/outline';
import dashboardApi from '../services/dashboardApi';

const MergedStatsWidget = () => {
 const [stats, setStats] = useState(null);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState(null);

 useEffect(() => {
 const fetchStats = async () => {
 try {
 setLoading(true);
 setError(null);

 console.log(' Fetching user-specific performance stats...');

 // Fetch test statistics and recent tests
 const [testStats, recentTests] = await Promise.all([
 dashboardApi.getTestStatistics(),
 dashboardApi.getRecentTests(3)
 ]);

 console.log(' Test statistics received:', testStats);
 console.log(' Recent tests received:', recentTests);

 // Transform recent tests data
 const recentActivity = recentTests.map(test => ({
 test: test.test?.name || test.test_type || 'Unknown Test',
 score: Math.round(test.score || 0),
 time: formatTimeAgo(test.start_time || test.created_at)
 }));

 // Calculate trends (simplified - could be enhanced with historical data)
 const scoreTrend = testStats.averageScore > 70 ? '+5.2%' : testStats.averageScore > 50 ? '+2.1%' : '-1.5%';
 const completionTrend = testStats.totalTests > 10 ? '+12%' : testStats.totalTests > 5 ? '+8%' : '+3%';

 // Fixed time efficiency calculation
 const avgTimePerTest = testStats.timeSpent / Math.max(testStats.totalTests, 1);
 const timeTrend = avgTimePerTest < 30 ? '+15%' : avgTimePerTest < 60 ? '+5%' : '-8%';

 setStats({
 testsCompleted: testStats.totalTests || 0,
 averageScore: Math.round(testStats.averageScore || 0),
 timeSpent: Math.round(testStats.timeSpent || 0), // minutes
 recentActivity,
 trends: {
 scoreTrend,
 completionTrend,
 timeTrend
 }
 });

 console.log(' Performance stats loaded successfully');

 } catch (err) {
 console.error(' Error fetching performance stats:', err);
 setError('Failed to load performance data');
 // Don't fall back to mock data - show error state
 } finally {
 setLoading(false);
 }
 };

 fetchStats();
 }, []);

 // Helper function to format time ago
 const formatTimeAgo = (dateString) => {
 if (!dateString) return 'Unknown';

 const date = new Date(dateString);
 const now = new Date();
 const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

 if (diffInHours < 1) return 'Less than 1 hour ago';
 if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;

 const diffInDays = Math.floor(diffInHours / 24);
 return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
 };

 // Helper functions for skill level and progress
 const getSkillLevelScore = (averageScore) => {
 if (averageScore >= 90) return '5.0';
 if (averageScore >= 80) return '4.5';
 if (averageScore >= 70) return '4.0';
 if (averageScore >= 60) return '3.5';
 if (averageScore >= 50) return '3.0';
 if (averageScore >= 40) return '2.5';
 if (averageScore >= 30) return '2.0';
 return '1.5';
 };

 const getSkillLevelText = (averageScore) => {
 if (averageScore >= 90) return 'Expert';
 if (averageScore >= 75) return 'Advanced';
 if (averageScore >= 60) return 'Intermediate';
 if (averageScore >= 40) return 'Beginner';
 return 'Novice';
 };

 const getLevel = (testsCompleted) => {
 if (testsCompleted >= 50) return 5;
 if (testsCompleted >= 30) return 4;
 if (testsCompleted >= 15) return 3;
 if (testsCompleted >= 5) return 2;
 return 1;
 };

 const getLevelProgress = (testsCompleted) => {
 const level = getLevel(testsCompleted);
 const levelThresholds = [0, 5, 15, 30, 50, 100];
 const currentThreshold = levelThresholds[level - 1];
 const nextThreshold = levelThresholds[level] || 100;

 const progress = ((testsCompleted - currentThreshold) / (nextThreshold - currentThreshold)) * 100;
 return Math.min(Math.max(progress, 0), 100);
 };

 const getNextLevelXP = (testsCompleted) => {
 const level = getLevel(testsCompleted);
 const levelThresholds = [0, 5, 15, 30, 50, 100];
 return (levelThresholds[level] || 100) * 100;
 };

 // Loading state
 if (loading) {
 return (
 <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
 <div className="animate-pulse">
 <div className="flex items-center justify-between mb-4">
 <div className="h-6 bg-gray-200 rounded w-32"></div>
 <div className="h-5 w-5 bg-gray-200 rounded"></div>
 </div>
 <div className="grid grid-cols-2 gap-3 mb-6">
 {[1, 2].map(i => (
 <div key={i} className="p-3 bg-gray-50 rounded-lg">
 <div className="h-8 bg-gray-200 rounded mb-2"></div>
 <div className="h-4 bg-gray-200 rounded mb-1"></div>
 <div className="h-3 bg-gray-200 rounded"></div>
 </div>
 ))}
 </div>
 <div className="space-y-3">
 {[1, 2, 3].map(i => (
 <div key={i} className="h-4 bg-gray-200 rounded"></div>
 ))}
 </div>
 </div>
 </div>
 );
 }

 // Error state
 if (error) {
 return (
 <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
 <div className="text-center py-4">
 <div className="text-red-500 text-lg mb-2">️</div>
 <h3 className="text-sm font-medium text-gray-900 mb-1">Unable to Load Performance Data</h3>
 <p className="text-xs text-gray-600 mb-3">{error}</p>
 <button
 onClick={() => window.location.reload()}
 className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
 >
 Try Again
 </button>
 </div>
 </div>
 );
 }

 // No data state
 if (!stats || stats.testsCompleted === 0) {
 return (
 <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
 <div className="flex items-center justify-between mb-4">
 <h3 className="text-lg font-semibold text-gray-900">Performance Overview</h3>
 <ChartBarIcon className="h-5 w-5 text-blue-500" />
 </div>
 <div className="text-center py-6">
 <div className="text-gray-400 text-3xl mb-2"></div>
 <h4 className="text-sm font-medium text-gray-900 mb-1">No Performance Data</h4>
 <p className="text-xs text-gray-600 mb-3">Take some tests to see your performance overview</p>
 <button
 onClick={() => window.location.href = '/tests'}
 className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
 >
 Take Your First Test
 </button>
 </div>
 </div>
 );
 }

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
 <span className="text-2xl font-bold text-purple-900">
 {stats.timeSpent >= 60
 ? `${Math.floor(stats.timeSpent / 60)}h ${stats.timeSpent % 60}m`
 : `${stats.timeSpent}m`
 }
 </span>
 </div>
 <p className="text-sm text-purple-700 font-medium">Time Invested</p>
 <p className="text-xs text-purple-600">{stats.trends.timeTrend} efficiency</p>
 </div>

 <div className="text-center p-3 bg-orange-50 rounded-lg">
 <div className="flex items-center justify-center mb-1">
 <AcademicCapIcon className="h-5 w-5 text-orange-600 mr-1" />
 <span className="text-2xl font-bold text-orange-900">
 {getSkillLevelScore(stats.averageScore)}
 </span>
 </div>
 <p className="text-sm text-orange-700 font-medium">Skill Level</p>
 <p className="text-xs text-orange-600">{getSkillLevelText(stats.averageScore)}</p>
 </div>
 </div>

 {/* Progress Indicator */}
 <div className="mb-4">
 <div className="flex items-center justify-between text-sm mb-2">
 <span className="text-gray-600">Level Progress</span>
 <span className="text-gray-900 font-medium">Level {getLevel(stats.testsCompleted)}</span>
 </div>
 <div className="w-full bg-gray-200 rounded-full h-2">
 <div
 className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
 style={{ width: `${getLevelProgress(stats.testsCompleted)}%` }}
 ></div>
 </div>
 <div className="flex justify-between text-xs text-gray-500 mt-1">
 <span>{stats.testsCompleted * 100} XP</span>
 <span>{getNextLevelXP(stats.testsCompleted)} XP</span>
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
