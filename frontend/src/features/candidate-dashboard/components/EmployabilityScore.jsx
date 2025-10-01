import React, { useState, useEffect } from 'react';
import {
 ChartBarIcon,
 ArrowTrendingUpIcon,
 UserGroupIcon,
 ChevronDownIcon,
 CheckCircleIcon,
 ExclamationTriangleIcon,
 XCircleIcon,
 AcademicCapIcon,
 ArrowPathIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import dashboardApi from '../services/dashboardApi';
import EmployabilityScoreModal from './EmployabilityScoreModal';

const EmployabilityScore = () => {
 const [selectedProfile, setSelectedProfile] = useState('Software Engineer');
 const [employabilityScore, setEmployabilityScore] = useState(0); // Start with 0, will be updated from API
 const [previousScore, setPreviousScore] = useState(0); // Start with 0, will be updated from API
 const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState(null);
 const [scoreData, setScoreData] = useState(null);
 const [isModalOpen, setIsModalOpen] = useState(false);
 const [refreshTrigger, setRefreshTrigger] = useState(0);

 const profiles = [
 'Software Engineer',
 'Data Scientist',
 'Product Manager',
 'UX Designer',
 'DevOps Engineer',
 'Financial Analyst',
 'Mechanical Engineer',
 'Marketing Manager'
 ];

 // Fetch employability score data
 useEffect(() => {
 const fetchScoreData = async () => {
 try {
 setLoading(true);
 setError(null);
 const data = await dashboardApi.getEmployabilityScore(selectedProfile);

 // Validate data structure
 if (!data || typeof data.overallScore === 'undefined') {
 throw new Error('Invalid data structure received from API');
 }

 setScoreData(data);
 setEmployabilityScore(data.overallScore || 0);

 // Calculate previous score more accurately
 const improvementTrend = data.improvement || 0;
 setPreviousScore(Math.max(0, (data.overallScore || 0) - improvementTrend));

 } catch (err) {
 console.error('Error fetching employability score:', err);

 // Provide more specific error messages
 let errorMessage = 'Failed to load employability score';
 if (err.message.includes('401') || err.message.includes('token')) {
 errorMessage = 'Authentication required. Please log in again.';
 } else if (err.message.includes('404')) {
 errorMessage = 'No test data found. Take some assessments to see your score.';
 } else if (err.message.includes('500')) {
 errorMessage = 'Server error. Please try again later.';
 } else if (err.message.includes('Invalid data structure')) {
 errorMessage = 'Data format error. Please contact support.';
 }

 setError(errorMessage);

 // Set fallback data for better UX
 setScoreData({
 overallScore: 0,
 categories: {},
 testsCompleted: 0,
 improvement: 0,
 scoreInterpretation: {
 level: 'No Data',
 description: 'Complete assessments to see your score',
 market_position: null,
 color: 'gray'
 },
 recommendations: []
 });
 setEmployabilityScore(0);
 setPreviousScore(0);

 } finally {
 setLoading(false);
 }
 };

 fetchScoreData();
 }, [selectedProfile, refreshTrigger]); // Re-fetch when profile changes or refresh is triggered

 // Refresh function that can be called externally
 const refreshData = () => {
 setRefreshTrigger(prev => prev + 1);
 };

 // Expose refresh function globally for other components to use
 useEffect(() => {
 window.refreshEmployabilityScore = refreshData;
 return () => {
 delete window.refreshEmployabilityScore;
 };
 }, []);

 const getScoreColor = (score) => {
 if (score >= 80) return 'text-green-600';
 if (score >= 60) return 'text-yellow-600';
 return 'text-red-600';
 };

 const getScoreBgColor = (score) => {
 if (score >= 80) return 'bg-green-50 border-green-200';
 if (score >= 60) return 'bg-yellow-50 border-yellow-200';
 return 'bg-red-50 border-red-200';
 };

 const getScoreIcon = (score) => {
 if (score >= 80) return <CheckCircleIcon className="w-6 h-6 text-green-600" />;
 if (score >= 60) return <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600" />;
 return <XCircleIcon className="w-6 h-6 text-red-600" />;
 };

 const getScoreLabel = (score) => {
 if (score >= 90) return 'Excellent';
 if (score >= 80) return 'Very Good';
 if (score >= 70) return 'Good';
 if (score >= 60) return 'Average';
 return 'Needs Improvement';
 };

 const scoreChange = employabilityScore - previousScore;
 const isImproving = scoreChange > 0;

 if (loading) {
 return (
 <div className="relative bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6 min-h-[280px]">
 <div className="animate-pulse">
 {/* Header skeleton */}
 <div className="flex items-center justify-between mb-6">
 <div className="flex items-center space-x-4">
 <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>

 <div>
 <div className="h-6 w-48 bg-gray-200 rounded mb-2"></div>
 <div className="h-4 w-32 bg-gray-200 rounded"></div>
 </div>
 </div>
 <div className="h-8 w-32 bg-gray-200 rounded-lg"></div>

 </div>

 {/* Main content skeleton */}
 <div className="flex items-center justify-between mb-6">
 <div className="flex items-center space-x-6">
 {/* Score circle skeleton */}
 <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
 <div className="space-y-2">
 <div className="h-6 w-32 bg-gray-200 rounded"></div>
 <div className="h-4 w-48 bg-gray-200 rounded"></div>
 <div className="h-4 w-24 bg-gray-200 rounded"></div>
 </div>
 </div>

 {/* Stats skeleton */}
 <div className="flex items-center space-x-8">
 <div className="text-center">
 <div className="h-8 w-12 bg-gray-200 rounded mb-2 mx-auto"></div>
 <div className="h-4 w-16 bg-gray-200 rounded"></div>
 </div>
 <div className="text-center">
 <div className="h-8 w-12 bg-gray-200 rounded mb-2 mx-auto"></div>
 <div className="h-4 w-12 bg-gray-200 rounded"></div>
 </div>
 <div className="h-12 w-28 bg-gray-200 rounded-xl"></div>
 </div>
 </div>

 {/* Insight section skeleton */}
 <div className="bg-gray-100 rounded-lg p-4">
 <div className="flex items-start space-x-3">
 <div className="w-2 h-2 bg-gray-200 rounded-full mt-2"></div>
 <div className="flex-1">
 <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
 <div className="h-4 w-full bg-gray-200 rounded"></div>
 </div>
 </div>
 </div>
 </div>

 {/* Loading indicator overlay */}
 <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 rounded-xl">
 <div className="text-center">
 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
 <p className="text-sm text-gray-600 font-medium">Loading your employability score...</p>
 </div>
 </div>
 </div>
 );
 }

 if (error) {
 return (
 <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6 min-h-[280px]">
 <div className="flex flex-col items-center justify-center h-full py-8">
 <ExclamationTriangleIcon className="w-12 h-12 text-red-500 mx-auto mb-4" />
 <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to Load Score</h3>
 <p className="text-gray-600 mb-6 text-center max-w-md">{error}</p>
 <div className="flex space-x-3">
 <button
 onClick={() => {
 setError(null);
 setLoading(true);
 // Trigger re-fetch by updating a dependency
 setSelectedProfile(prev => prev);
 }}
 className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
 >
 Try Again
 </button>
 {error.includes('Authentication') && (
 <button
 onClick={() => window.location.href = '/login'}
 className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
 >
 Login
 </button>
 )}

 </div>
 </div>
 </div>
 );
 }

 return (
 <>
 {/* Enhanced Compact Dashboard View */}
 <motion.div
 className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6 min-h-[280px]"
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.3 }}
 >
 {/* Header */}
 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
 <div className="flex items-center space-x-3 lg:space-x-4 min-w-0">
 <div className="p-2.5 lg:p-3 bg-blue-100 rounded-xl flex-shrink-0">
 <ChartBarIcon className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600" />
 </div>
 <div className="min-w-0 flex-1">
 <h2 className="text-lg lg:text-xl font-semibold text-gray-900 truncate">Employability Score</h2>
 <p className="text-xs lg:text-sm text-gray-500 truncate">Your career readiness assessment</p>
 </div>
 </div>

 {/* Profile Selector and Refresh Button */}
 <div className="flex items-center space-x-2 flex-shrink-0">
 {/* Refresh Button */}
 <button
 onClick={refreshData}
 disabled={loading}
 className="p-2 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
 title="Refresh data"
 >
 <ArrowPathIcon className={`w-4 h-4 text-gray-600 ${loading ? 'animate-spin' : ''}`} />
 </button>

 {/* Profile Selector */}
 <div className="relative">
 <button
 onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
 className="flex items-center space-x-2 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors text-sm w-full sm:w-auto justify-between sm:justify-start"
 >
 <span className="font-medium text-gray-700 truncate max-w-[180px]">{selectedProfile}</span>
 <ChevronDownIcon className="w-3 h-3 text-gray-500 flex-shrink-0" />
 </button>

 {isProfileDropdownOpen && (
 <div className="absolute right-0 mt-2 w-full sm:w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10 max-h-60 overflow-y-auto">
 {profiles.map((profile) => (
 <button
 key={profile}
 onClick={() => {
 setSelectedProfile(profile);
 setIsProfileDropdownOpen(false);
 }}
 className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg transition-colors ${
 selectedProfile === profile ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
 }`}
 >
 {profile}
 </button>
 ))}
 </div>
 )}
 </div>
 </div>
 </div>

 {/* Enhanced Main Content */}
 <div className="space-y-6">
 {/* Score Display Section */}
 <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
 {/* Left Side - Enhanced Score Circle */}
 <div className="flex items-center space-x-4 lg:space-x-6">
 <div className="relative flex-shrink-0">
 <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full border-4 lg:border-6 border-gray-200 flex items-center justify-center bg-gray-50">
 <div className="text-center">
 <div className={`text-xl lg:text-2xl font-bold ${getScoreColor(employabilityScore)}`}>
 {loading ? '...' : employabilityScore}
 </div>
 <div className="text-xs text-gray-500">/ 100</div>
 </div>
 </div>
 {/* Enhanced Animated Progress Ring */}
 <svg
 className="absolute inset-0 w-20 h-20 lg:w-24 lg:h-24 transform -rotate-90"
 viewBox="0 0 100 100"
 >
 <circle
 cx="50"
 cy="50"
 r="40"
 fill="none"
 stroke="currentColor"
 strokeWidth="6"
 strokeDasharray="251.2"
 strokeDashoffset={251.2 - (251.2 * employabilityScore / 100)}
 className={getScoreColor(employabilityScore).replace('text-', 'stroke-')}
 strokeLinecap="round"
 style={{
 transition: 'stroke-dashoffset 1.2s ease-out'
 }}
 />
 </svg>
 </div>

 {/* Enhanced Score Details */}
 <div className="space-y-2 min-w-0 flex-1">
 <div className="flex items-center space-x-3">
 {getScoreIcon(employabilityScore)}
 <span className={`text-base lg:text-lg font-semibold ${getScoreColor(employabilityScore)} truncate`}>
 {loading ? 'Loading...' : scoreData?.scoreInterpretation?.level || getScoreLabel(employabilityScore)}
 </span>
 </div>
 <p className="text-sm text-gray-600 truncate">
 Profile: <span className="font-medium text-gray-900">{selectedProfile}</span>
 </p>
 {/* Market Position Insight */}
 {scoreData?.scoreInterpretation?.market_position && (
 <p className="text-sm text-blue-600 font-medium line-clamp-2">
 {scoreData.scoreInterpretation.market_position}
 </p>
 )}
 </div>
 </div>

 {/* Right Side - Enhanced Quick Stats */}
 <div className="flex items-center justify-between lg:justify-end lg:space-x-6 xl:space-x-8 gap-4">
 {/* Tests Completed */}
 <div className="text-center flex-shrink-0">
 <div className="flex items-center justify-center space-x-1 lg:space-x-2 mb-1 lg:mb-2">
 <AcademicCapIcon className="w-4 h-4 lg:w-5 lg:h-5 text-blue-500" />
 <span className="text-xl lg:text-2xl font-bold text-gray-900">
 {loading ? '...' : scoreData?.testsCompleted || 0}
 </span>
 </div>
 <div className="text-xs lg:text-sm text-gray-500 font-medium">Tests Taken</div>
 </div>

 {/* Improvement Trend */}
 <div className="text-center flex-shrink-0">
 <div className="flex items-center justify-center space-x-1 lg:space-x-2 mb-1 lg:mb-2">
 <ArrowTrendingUpIcon className={`w-4 h-4 lg:w-5 lg:h-5 ${isImproving ? 'text-green-600' : 'text-red-600'}`} />
 <span className={`text-xl lg:text-2xl font-bold ${isImproving ? 'text-green-600' : 'text-red-600'}`}>
 {loading ? '...' : `${isImproving ? '+' : ''}${scoreChange.toFixed(1)}`}
 </span>
 </div>
 <div className="text-xs lg:text-sm text-gray-500 font-medium">Trend</div>
 </div>

 {/* View Details Button */}
 <button
 onClick={() => setIsModalOpen(true)}
 className="px-4 py-2 lg:px-6 lg:py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg lg:rounded-xl transition-colors flex items-center space-x-2 shadow-sm hover:shadow-md flex-shrink-0"
 >
 <ChartBarIcon className="w-4 h-4 lg:w-5 lg:h-5" />
 <span className="text-sm lg:text-base">View Details</span>
 </button>
 </div>
 </div>

 {/* Key Insight Section */}
 {(scoreData?.recommendations && scoreData.recommendations.length > 0) && (
 <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
 <div className="flex items-start space-x-3">
 <div className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-400 mt-2"></div>
 <div className="flex-1">
 <h4 className="text-sm font-semibold text-gray-900 mb-1">
 Top Recommendation
 </h4>
 <p className="text-sm text-gray-700">
 {scoreData.recommendations[0]?.title || 'Continue taking assessments to improve your score'}
 </p>
 </div>
 </div>
 </div>
 )}
 </div>
 </motion.div>

 {/* Detailed Modal */}
 <EmployabilityScoreModal
 isOpen={isModalOpen}
 onClose={() => setIsModalOpen(false)}
 scoreData={scoreData}
 selectedProfile={selectedProfile}
 onProfileChange={setSelectedProfile}
 profiles={profiles}
 loading={loading}
 />
 </>
 );
};

export default EmployabilityScore;
