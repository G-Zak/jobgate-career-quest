import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
 ChartBarIcon,
 ClockIcon,
 TrophyIcon,
 ArrowTrendingUpIcon,
 ArrowTrendingDownIcon,
 MinusIcon,
 CheckCircleIcon,
 AcademicCapIcon,
 FireIcon,
 StarIcon
} from '@heroicons/react/24/outline';
import dashboardApi from '../services/dashboardApi';

const EnhancedPerformanceOverview = () => {
 const navigate = useNavigate();
 const [performanceData, setPerformanceData] = useState(null);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState(null);

 useEffect(() => {
 const fetchPerformanceData = async () => {
 try {
 setLoading(true);
 setError(null);

 console.log(' Fetching comprehensive performance data...');

 // Fetch multiple data sources for comprehensive overview
 const [testStats, employabilityData, achievements, recentTests] = await Promise.all([
 dashboardApi.getTestStatistics(),
 dashboardApi.getEmployabilityScore(),
 dashboardApi.getAchievements(),
 dashboardApi.getRecentTests(5)
 ]);

 console.log(' Performance data received:', { testStats, employabilityData, achievements, recentTests });

 // Calculate performance metrics
 const metrics = calculatePerformanceMetrics(testStats, employabilityData, achievements, recentTests);
 setPerformanceData(metrics);

 console.log(' Performance overview loaded successfully');

 } catch (err) {
 console.error(' Error fetching performance data:', err);
 setError('Failed to load performance data');
 } finally {
 setLoading(false);
 }
 };

 fetchPerformanceData();
 }, []);

 const calculatePerformanceMetrics = (testStats, employabilityData, achievements, recentTests) => {
 // Calculate trends based on recent performance
 const recentScores = recentTests.slice(0, 3).map(test => test.score || 0);
 const olderScores = recentTests.slice(3, 6).map(test => test.score || 0);

 const recentAvg = recentScores.length > 0 ? recentScores.reduce((a, b) => a + b, 0) / recentScores.length : 0;
 const olderAvg = olderScores.length > 0 ? olderScores.reduce((a, b) => a + b, 0) / olderScores.length : 0;
 const scoreTrend = recentAvg - olderAvg;

 // Calculate completion rate trend
 const thisWeekTests = recentTests.filter(test => {
 const testDate = new Date(test.start_time || test.created_at);
 const weekAgo = new Date();
 weekAgo.setDate(weekAgo.getDate() - 7);
 return testDate >= weekAgo;
 }).length;

 const lastWeekTests = recentTests.filter(test => {
 const testDate = new Date(test.start_time || test.created_at);
 const twoWeeksAgo = new Date();
 twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
 const weekAgo = new Date();
 weekAgo.setDate(weekAgo.getDate() - 7);
 return testDate >= twoWeeksAgo && testDate < weekAgo;
 }).length;

 const completionTrend = thisWeekTests - lastWeekTests;

 // Calculate time efficiency - Fixed calculation
 const avgTimePerTest = testStats.timeSpent / Math.max(testStats.totalTests, 1);
 const timeEfficiencyTrend = avgTimePerTest < 30 ? 1 : avgTimePerTest < 60 ? 0 : -1;
 const timeEfficiencyPercentage = avgTimePerTest < 30 ? 15 : avgTimePerTest < 60 ? 5 : -8;

 // Calculate skill level progression
 const earnedAchievements = achievements.filter(a => a.earned).length;
 const skillLevelScore = getSkillLevelScore(testStats.averageScore);

 return {
 testsCompleted: testStats.totalTests || 0,
 averageScore: Math.round(testStats.averageScore || 0),
 timeInvested: Math.round(testStats.timeSpent || 0), // in minutes
 skillLevel: skillLevelScore,
 skillLevelText: testStats.skillLevel || 'Novice',
 scoreTrend: Math.round(scoreTrend),
 completionTrend,
 timeEfficiencyTrend,
 timeEfficiencyPercentage,
 earnedAchievements,
 totalAchievements: achievements.length,
 recentActivity: recentTests.slice(0, 3),
 performanceLevel: getPerformanceLevel(testStats.averageScore || 0),
 consistencyScore: calculateConsistencyScore(recentTests)
 };
 };

 const getSkillLevelScore = (averageScore) => {
 if (averageScore >= 90) return 5.0;
 if (averageScore >= 80) return 4.5;
 if (averageScore >= 70) return 4.0;
 if (averageScore >= 60) return 3.5;
 if (averageScore >= 50) return 3.0;
 if (averageScore >= 40) return 2.5;
 return 2.0;
 };

 const getPerformanceLevel = (averageScore) => {
 if (averageScore >= 90) return 'Excellent';
 if (averageScore >= 80) return 'Proficient';
 if (averageScore >= 70) return 'Developing';
 if (averageScore >= 60) return 'Basic';
 return 'Improving';
 };

 const calculateConsistencyScore = (recentTests) => {
 if (recentTests.length < 3) return 0;

 const scores = recentTests.slice(0, 5).map(test => test.score || 0);
 const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
 const variance = scores.reduce((sum, score) => sum + Math.pow(score - avg, 2), 0) / scores.length;
 const standardDeviation = Math.sqrt(variance);

 // Lower standard deviation = higher consistency (inverted scale)
 return Math.max(0, Math.round(100 - (standardDeviation * 2)));
 };

 const getTrendIcon = (trend) => {
 if (trend > 0) return ArrowTrendingUpIcon;
 if (trend < 0) return ArrowTrendingDownIcon;
 return MinusIcon;
 };

 const getTrendColor = (trend) => {
 if (trend > 0) return 'text-green-600';
 if (trend < 0) return 'text-red-600';
 return 'text-gray-600';
 };

 const formatTrend = (trend, unit = '') => {
 if (trend === 0) return 'No change';
 const sign = trend > 0 ? '+' : '';
 return `${sign}${trend}${unit}`;
 };

 // Loading state
 if (loading) {
 return (
 <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
 <div className="animate-pulse">
 <div className="flex items-center justify-between mb-6">
 <div className="h-6 bg-gray-200 rounded w-40"></div>
 <div className="h-5 w-5 bg-gray-200 rounded"></div>
 </div>
 <div className="grid grid-cols-2 gap-4 mb-6">
 {[1, 2, 3, 4].map(i => (
 <div key={i} className="p-4 bg-gray-50 rounded-lg">
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
 <div className="text-center py-8">
 <div className="text-red-500 text-lg mb-2">️</div>
 <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to Load Performance Data</h3>
 <p className="text-gray-600 mb-4">{error}</p>
 <button
 onClick={() => window.location.reload()}
 className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
 >
 Try Again
 </button>
 </div>
 </div>
 );
 }

 // No data state
 if (!performanceData || performanceData.testsCompleted === 0) {
 return (
 <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
 <div className="flex items-center justify-between mb-6">
 <h3 className="text-lg font-semibold text-gray-900">Performance Overview</h3>
 <ChartBarIcon className="h-5 w-5 text-blue-500" />
 </div>
 <div className="text-center py-8">
 <div className="text-gray-400 text-4xl mb-4"></div>
 <h4 className="text-lg font-semibold text-gray-900 mb-2">No Performance Data</h4>
 <p className="text-gray-600 mb-6">Take some tests to see your performance overview and analytics</p>
 <button
 onClick={() => window.location.href = '/tests'}
 className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
 >
 Take Your First Test
 </button>
 </div>
 </div>
 );
 }

 return (
 <motion.div
 className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.5 }}
 >
 {/* Header */}
 <div className="flex items-center justify-between mb-6">
 <h3 className="text-lg font-semibold text-gray-900">Performance Overview</h3>
 <ChartBarIcon className="h-5 w-5 text-blue-500" />
 </div>

 {/* Main Stats Grid */}
 <div className="grid grid-cols-2 gap-4 mb-6">
 {/* Tests Completed */}
 <motion.div
 className="text-center p-4 bg-blue-50 rounded-lg"
 whileHover={{ scale: 1.02 }}
 >
 <div className="flex items-center justify-center mb-2">
 <CheckCircleIcon className="h-5 w-5 text-blue-600 mr-2" />
 <span className="text-2xl font-bold text-blue-900">{performanceData.testsCompleted}</span>
 </div>
 <p className="text-sm text-blue-700 font-medium">Tests Completed</p>
 <div className="flex items-center justify-center mt-1">
 {React.createElement(getTrendIcon(performanceData.completionTrend), {
 className: `h-3 w-3 ${getTrendColor(performanceData.completionTrend)} mr-1`
 })}
 <span className={`text-xs ${getTrendColor(performanceData.completionTrend)}`}>
 {formatTrend(performanceData.completionTrend)} this week
 </span>
 </div>
 </motion.div>

 {/* Average Score */}
 <motion.div
 className="text-center p-4 bg-green-50 rounded-lg"
 whileHover={{ scale: 1.02 }}
 >
 <div className="flex items-center justify-center mb-2">
 <TrophyIcon className="h-5 w-5 text-green-600 mr-2" />
 <span className="text-2xl font-bold text-green-900">{performanceData.averageScore}%</span>
 </div>
 <p className="text-sm text-green-700 font-medium">Average Score</p>
 <div className="flex items-center justify-center mt-1">
 {React.createElement(getTrendIcon(performanceData.scoreTrend), {
 className: `h-3 w-3 ${getTrendColor(performanceData.scoreTrend)} mr-1`
 })}
 <span className={`text-xs ${getTrendColor(performanceData.scoreTrend)}`}>
 {formatTrend(performanceData.scoreTrend, '%')} recent
 </span>
 </div>
 </motion.div>

 {/* Time Invested */}
 <motion.div
 className="text-center p-4 bg-purple-50 rounded-lg"
 whileHover={{ scale: 1.02 }}
 >
 <div className="flex items-center justify-center mb-2">
 <ClockIcon className="h-5 w-5 text-purple-600 mr-2" />
 <span className="text-2xl font-bold text-purple-900">
 {performanceData.timeInvested >= 60
 ? `${Math.floor(performanceData.timeInvested / 60)}h ${performanceData.timeInvested % 60}m`
 : `${performanceData.timeInvested}m`
 }
 </span>
 </div>
 <p className="text-sm text-purple-700 font-medium">Time Invested</p>
 <div className="flex items-center justify-center mt-1">
 {React.createElement(getTrendIcon(performanceData.timeEfficiencyTrend), {
 className: `h-3 w-3 ${getTrendColor(performanceData.timeEfficiencyTrend)} mr-1`
 })}
 <span className={`text-xs ${getTrendColor(performanceData.timeEfficiencyTrend)}`}>
 {performanceData.timeEfficiencyPercentage > 0 ? '+' : ''}{performanceData.timeEfficiencyPercentage}% efficiency
 </span>
 </div>
 </motion.div>

 {/* Skill Level */}
 <motion.div
 className="text-center p-4 bg-orange-50 rounded-lg"
 whileHover={{ scale: 1.02 }}
 >
 <div className="flex items-center justify-center mb-2">
 <StarIcon className="h-5 w-5 text-orange-600 mr-2" />
 <span className="text-2xl font-bold text-orange-900">{performanceData.skillLevel}</span>
 </div>
 <p className="text-sm text-orange-700 font-medium">Skill Level</p>
 <p className="text-xs text-orange-600 mt-1">{performanceData.skillLevelText}</p>
 </motion.div>
 </div>

 {/* Performance Insights */}
 <div className="mb-4">
 <div className="flex items-center justify-between text-sm mb-2">
 <span className="text-gray-600">Performance Level</span>
 <span className="text-gray-900 font-medium">{performanceData.performanceLevel}</span>
 </div>
 <div className="w-full bg-gray-200 rounded-full h-2">
 <div
 className={`h-2 rounded-full transition-all duration-300 ${
 performanceData.averageScore >= 90 ? 'bg-green-500' :
 performanceData.averageScore >= 80 ? 'bg-blue-500' :
 performanceData.averageScore >= 70 ? 'bg-yellow-500' :
 performanceData.averageScore >= 60 ? 'bg-orange-500' : 'bg-red-500'
 }`}
 style={{ width: `${Math.min(performanceData.averageScore, 100)}%` }}
 />
 </div>
 <div className="flex justify-between text-xs text-gray-500 mt-1">
 <span>Consistency: {performanceData.consistencyScore}%</span>
 <span>Achievements: {performanceData.earnedAchievements}/{performanceData.totalAchievements}</span>
 </div>
 </div>

 {/* Recent Activity Snapshot */}
 <div className="border-t pt-4">
 <h4 className="text-sm font-medium text-gray-700 mb-3">Recent Activity</h4>
 <div className="space-y-2">
 {performanceData.recentActivity.map((activity, index) => (
 <div key={index} className="flex items-center justify-between text-sm">
 <div className="flex items-center">
 <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
 <span className="text-gray-600 truncate">
 {activity.test?.name || activity.test_type || 'Test'}
 </span>
 </div>
 <div className="flex items-center space-x-2">
 <span className={`font-medium ${
 (activity.score || 0) >= 80 ? 'text-green-600' :
 (activity.score || 0) >= 60 ? 'text-blue-600' : 'text-orange-600'
 }`}>
 {Math.round(activity.score || 0)}%
 </span>
 <span className="text-gray-400 text-xs">
 {new Date(activity.start_time || activity.created_at).toLocaleDateString()}
 </span>
 </div>
 </div>
 ))}
 </div>
 <div className="mt-3 text-center">
 <button
 onClick={() => navigate('/test-history')}
 className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 hover:underline"
 >
 View All Activity →
 </button>
 </div>
 </div>
 </motion.div>
 );
};

export default EnhancedPerformanceOverview;
