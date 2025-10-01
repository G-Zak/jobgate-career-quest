import React, { useState, useEffect } from 'react';
import {
 ClockIcon,
 ChartBarIcon,
 ArrowTopRightOnSquareIcon,
 ExclamationTriangleIcon,
 CheckCircleIcon,
 XCircleIcon
} from '@heroicons/react/24/outline';
import dashboardApi from '../services/dashboardApi';

const RecentTests = ({ data, onViewAll, limit = 5 }) => {
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState(null);
 const [tests, setTests] = useState([]);

 // Use data from props or fetch if not provided
 useEffect(() => {
 if (data) {
 // Use data passed from parent (dashboard aggregated API)
 const limitedTests = Array.isArray(data) ? data.slice(0, limit) : [];
 setTests(limitedTests);
 setLoading(false);
 } else {
 // Fallback: fetch data directly
 const fetchRecentTests = async () => {
 try {
 setLoading(true);
 setError(null);
 const apiData = await dashboardApi.getRecentTests(limit);
 setTests(apiData);
 } catch (err) {
 console.error('Error fetching recent tests:', err);
 setError('Failed to load recent tests');
 setTests([]);
 } finally {
 setLoading(false);
 }
 };

 fetchRecentTests();
 }
 }, [data, limit]);

 const getScoreColor = (score) => {
 if (score >= 80) return 'text-green-600';
 if (score >= 60) return 'text-yellow-600';
 return 'text-red-600';
 };

 const getScoreIcon = (score) => {
 if (score >= 80) return <CheckCircleIcon className="w-4 h-4 text-green-600" />;
 if (score >= 60) return <ChartBarIcon className="w-4 h-4 text-yellow-600" />;
 return <XCircleIcon className="w-4 h-4 text-red-600" />;
 };

 const formatDate = (dateString) => {
 const date = new Date(dateString);
 const now = new Date();
 const diffTime = Math.abs(now - date);
 const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

 if (diffDays === 1) return 'Yesterday';
 if (diffDays < 7) return `${diffDays} days ago`;
 if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
 return date.toLocaleDateString();
 };

 const getTestTypeIcon = (testType) => {
 const icons = {
 'verbal': '',
 'numerical': '',
 'logical': '',
 'abstract': '',
 'diagrammatic': '',
 'situational': '',
 'spatial': '️',
 'technical': '️'
 };
 return icons[testType?.toLowerCase()] || '';
 };

 if (loading) {
 return (
 <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
 <div className="animate-pulse">
 <div className="flex items-center justify-between mb-6">
 <div className="flex items-center space-x-3">
 <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
 <div>
 <div className="h-6 w-48 bg-gray-200 rounded mb-2"></div>
 <div className="h-4 w-32 bg-gray-200 rounded"></div>
 </div>
 </div>
 <div className="h-8 w-24 bg-gray-200 rounded"></div>
 </div>
 <div className="space-y-3">
 {[...Array(limit)].map((_, i) => (
 <div key={i} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
 <div className="w-8 h-8 bg-gray-200 rounded"></div>
 <div className="flex-1">
 <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
 <div className="h-3 w-24 bg-gray-200 rounded"></div>
 </div>
 <div className="h-6 w-12 bg-gray-200 rounded"></div>
 </div>
 ))}
 </div>
 </div>
 </div>
 );
 }

 if (error) {
 return (
 <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
 <div className="text-center py-8">
 <ExclamationTriangleIcon className="w-12 h-12 text-red-500 mx-auto mb-4" />
 <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to Load Tests</h3>
 <p className="text-gray-600 mb-4">{error}</p>
 <button
 onClick={() => window.location.reload()}
 className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
 >
 Retry
 </button>
 </div>
 </div>
 );
 }

 return (
 <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
 {/* Header */}
 <div className="flex items-center justify-between mb-6">
 <div className="flex items-center space-x-3">
 <div className="p-2 bg-purple-100 rounded-lg">
 <ClockIcon className="w-6 h-6 text-purple-600" />
 </div>
 <div>
 <h2 className="text-xl font-semibold text-gray-900">Recent Tests</h2>
 <p className="text-sm text-gray-500">Your latest assessment results</p>
 </div>
 </div>

 {onViewAll && (
 <button
 onClick={onViewAll}
 className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
 >
 <span>View All</span>
 <ArrowTopRightOnSquareIcon className="w-4 h-4" />
 </button>
 )}
 </div>

 {/* Test List */}
 <div className="space-y-3">
 {tests.length === 0 ? (
 <div className="text-center py-8">
 <ClockIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
 <h3 className="text-lg font-semibold text-gray-900 mb-2">No Tests Yet</h3>
 <p className="text-gray-600 mb-4">Start taking assessments to see your results here</p>
 <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
 Take Your First Test
 </button>
 </div>
 ) : (
 tests.map((test) => (
 <div key={test.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
 {/* Test Icon */}
 <div className="text-2xl">
 {getTestTypeIcon(test.test_type)}
 </div>

 {/* Test Info */}
 <div className="flex-1 min-w-0">
 <h3 className="text-sm font-semibold text-gray-900 truncate">
 {test.test_name || test.test_type || 'Unknown Test'}
 </h3>
 <div className="flex items-center space-x-2 text-xs text-gray-500">
 <ClockIcon className="w-3 h-3" />
 <span>{formatDate(test.date)}</span>
 </div>
 </div>

 {/* Score */}
 <div className="flex items-center space-x-2">
 {getScoreIcon(test.score)}
 <span className={`text-sm font-semibold ${getScoreColor(test.score)}`}>
 {test.score}%
 </span>
 </div>
 </div>
 ))
 )}
 </div>

 {/* Summary Stats */}
 {tests.length > 0 && (
 <div className="mt-6 pt-4 border-t border-gray-200">
 <div className="grid grid-cols-3 gap-4 text-center">
 <div>
 <div className="text-lg font-semibold text-gray-900">
 {tests.length}
 </div>
 <div className="text-xs text-gray-500">Tests Taken</div>
 </div>
 <div>
 <div className="text-lg font-semibold text-gray-900">
 {tests.length > 0 ? Math.round(tests.reduce((sum, test) => sum + test.score, 0) / tests.length) : 0}%
 </div>
 <div className="text-xs text-gray-500">Average Score</div>
 </div>
 <div>
 <div className="text-lg font-semibold text-gray-900">
 {tests.filter(test => test.score >= 80).length}
 </div>
 <div className="text-xs text-gray-500">High Scores</div>
 </div>
 </div>
 </div>
 )}
 </div>
 );
};

export default RecentTests;