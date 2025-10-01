import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
 XMarkIcon,
 ChartBarIcon,
 ClockIcon,
 TrophyIcon,
 CalendarIcon,
 EyeIcon,
 TrashIcon,
 ArrowsPointingOutIcon,
 ArrowsPointingInIcon
} from '@heroicons/react/24/outline';
import { FaTrophy, FaChartLine, FaClock, FaCalendarAlt } from 'react-icons/fa';
import testHistoryApi from '../services/testHistoryApi';

const TestHistoryModal = ({ isOpen, onClose }) => {
 const [activeTab, setActiveTab] = useState('overview');
 const [testSessions, setTestSessions] = useState([]);
 const [summary, setSummary] = useState(null);
 const [categoryStats, setCategoryStats] = useState([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState(null);
 const [isExpanded, setIsExpanded] = useState(false);

 useEffect(() => {
 if (isOpen) {
 loadTestHistoryData();
 }
 }, [isOpen]);

 const loadTestHistoryData = async () => {
 try {
 setLoading(true);
 setError(null);

 const token = localStorage.getItem('access_token');
 if (!token) {
 setError('Please log in to view your test history.');
 setLoading(false);
 return;
 }

 const [sessionsData, summaryData, categoryData] = await Promise.all([
 testHistoryApi.getTestSessions(),
 testHistoryApi.getTestHistorySummary(),
 testHistoryApi.getTestCategoryStats()
 ]);

 setTestSessions(sessionsData || []);
 setSummary(summaryData || {});
 setCategoryStats(categoryData || []);
 } catch (error) {
 console.error('Error loading test history:', error);
 setError('Failed to load test history data.');
 } finally {
 setLoading(false);
 }
 };

 const formatDuration = (seconds) => {
 if (!seconds) return 'N/A';
 const minutes = Math.floor(seconds / 60);
 return `${minutes}m`;
 };

 const getScoreColor = (score) => {
 if (score >= 80) return 'text-green-600';
 if (score >= 60) return 'text-yellow-600';
 return 'text-red-600';
 };

 const getTestTypeColor = (testType) => {
 const colors = {
 'verbal_reasoning': 'bg-blue-100 text-blue-800',
 'numerical_reasoning': 'bg-green-100 text-green-800',
 'logical_reasoning': 'bg-purple-100 text-purple-800',
 'abstract_reasoning': 'bg-orange-100 text-orange-800',
 'spatial_reasoning': 'bg-pink-100 text-pink-800',
 'situational_judgment': 'bg-indigo-100 text-indigo-800'
 };
 return colors[testType] || 'bg-gray-100 text-gray-800';
 };

 if (!isOpen) return null;

 const modalVariants = {
 hidden: { opacity: 0, scale: 0.95 },
 visible: { opacity: 1, scale: 1 },
 exit: { opacity: 0, scale: 0.95 }
 };

 const backdropVariants = {
 hidden: { opacity: 0 },
 visible: { opacity: 1 },
 exit: { opacity: 0 }
 };

 return (
 <AnimatePresence>
 <motion.div
 className="fixed inset-0 z-50 overflow-y-auto"
 variants={backdropVariants}
 initial="hidden"
 animate="visible"
 exit="exit"
 >
 {/* Backdrop */}
 <div
 className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
 onClick={onClose}
 />

 {/* Modal */}
 <div className="flex min-h-full items-center justify-center p-4">
 <motion.div
 className={`relative w-full bg-white rounded-2xl shadow-2xl transition-all duration-300 flex flex-col ${
 isExpanded
 ? 'max-w-7xl h-[90vh]'
 : 'max-w-4xl h-[80vh]'
 }`}
 variants={modalVariants}
 initial="hidden"
 animate="visible"
 exit="exit"
 transition={{ type: "spring", damping: 25, stiffness: 300 }}
 >
 {/* Header */}
 <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
 <div className="flex items-center space-x-3">
 <div className="p-2 bg-blue-100 rounded-lg">
 <ChartBarIcon className="h-6 w-6 text-blue-600" />
 </div>
 <div>
 <h2 className="text-2xl font-bold text-gray-900">Test History</h2>
 <p className="text-sm text-gray-600">Track your performance and progress</p>
 </div>
 </div>

 <div className="flex items-center space-x-2">
 <button
 onClick={() => setIsExpanded(!isExpanded)}
 className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
 title={isExpanded ? "Collapse" : "Expand"}
 >
 {isExpanded ? (
 <ArrowsPointingInIcon className="h-5 w-5" />
 ) : (
 <ArrowsPointingOutIcon className="h-5 w-5" />
 )}
 </button>
 <button
 onClick={onClose}
 className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
 >
 <XMarkIcon className="h-5 w-5" />
 </button>
 </div>
 </div>

 {/* Content */}
 <div className="flex-1 overflow-hidden min-h-0">
 {loading ? (
 <div className="flex items-center justify-center h-full">
 <div className="text-center">
 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
 <p className="text-gray-600">Loading test history...</p>
 </div>
 </div>
 ) : error ? (
 <div className="flex items-center justify-center h-full">
 <div className="text-center">
 <div className="text-red-400 text-6xl mb-4">️</div>
 <h3 className="text-xl font-medium text-gray-600 mb-2">Error Loading Data</h3>
 <p className="text-gray-500 mb-4">{error}</p>
 <button
 onClick={loadTestHistoryData}
 className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
 >
 Retry
 </button>
 </div>
 </div>
 ) : (
 <div className="h-full flex flex-col min-h-0">
 {/* Tabs */}
 <div className="flex border-b border-gray-200 px-6 flex-shrink-0">
 {[
 { id: 'overview', label: 'Overview', icon: ChartBarIcon },
 { id: 'sessions', label: 'All Sessions', icon: CalendarIcon },
 { id: 'analytics', label: 'Analytics', icon: TrophyIcon }
 ].map((tab) => (
 <button
 key={tab.id}
 onClick={() => setActiveTab(tab.id)}
 className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
 activeTab === tab.id
 ? 'border-blue-500 text-blue-600'
 : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
 }`}
 >
 <tab.icon className="h-4 w-4" />
 <span>{tab.label}</span>
 </button>
 ))}
 </div>

 {/* Tab Content */}
 <div className="flex-1 overflow-y-auto p-6 min-h-0">
 {activeTab === 'overview' && (
 <div className="space-y-6">
 {/* Summary Cards */}
 <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
 <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
 <div className="flex items-center justify-between">
 <div>
 <p className="text-sm text-blue-600 font-medium">Tests Completed</p>
 <p className="text-2xl font-bold text-blue-900">
 {summary?.total_tests || testSessions.length || 0}
 </p>
 </div>
 <FaTrophy className="h-8 w-8 text-blue-500" />
 </div>
 </div>

 <div className="bg-green-50 rounded-xl p-4 border border-green-100">
 <div className="flex items-center justify-between">
 <div>
 <p className="text-sm text-green-600 font-medium">Average Score</p>
 <p className="text-2xl font-bold text-green-900">
 {summary?.average_score ? `${summary.average_score}%` : '0%'}
 </p>
 </div>
 <FaChartLine className="h-8 w-8 text-green-500" />
 </div>
 </div>

 <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100">
 <div className="flex items-center justify-between">
 <div>
 <p className="text-sm text-yellow-600 font-medium">Best Score</p>
 <p className="text-2xl font-bold text-yellow-900">
 {summary?.best_score ? `${summary.best_score}%` : '0%'}
 </p>
 </div>
 <FaTrophy className="h-8 w-8 text-yellow-500" />
 </div>
 </div>

 <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
 <div className="flex items-center justify-between">
 <div>
 <p className="text-sm text-purple-600 font-medium">Total Time</p>
 <p className="text-2xl font-bold text-purple-900">
 {summary?.total_time ? formatDuration(summary.total_time) : '0m'}
 </p>
 </div>
 <FaClock className="h-8 w-8 text-purple-500" />
 </div>
 </div>
 </div>

 {/* Recent Sessions */}
 <div className="bg-white rounded-xl border border-gray-200 mb-6">
 <div className="p-4 border-b border-gray-200">
 <h3 className="text-lg font-semibold text-gray-900">Recent Test Sessions</h3>
 </div>
 <div className="divide-y divide-gray-200">
 {testSessions.slice(0, 5).map((session, index) => (
 <div key={session.id || index} className="p-4 hover:bg-gray-50 transition-colors">
 <div className="flex items-center justify-between">
 <div className="flex-1">
 <div className="flex items-center space-x-3">
 <h4 className="font-medium text-gray-900">
 {session.test_title || 'Test Session'}
 </h4>
 <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTestTypeColor(session.test_type)}`}>
 {session.test_type?.replace('_', ' ').toUpperCase() || 'UNKNOWN'}
 </span>
 </div>
 <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
 <span className="flex items-center">
 <CalendarIcon className="h-4 w-4 mr-1" />
 {session.created_at ? new Date(session.created_at).toLocaleDateString() : 'N/A'}
 </span>
 <span className="flex items-center">
 <ClockIcon className="h-4 w-4 mr-1" />
 {formatDuration(session.duration)}
 </span>
 </div>
 </div>
 <div className={`text-right ${getScoreColor(session.score_percentage)}`}>
 <div className="text-lg font-bold">
 {session.score_percentage || 0}%
 </div>
 </div>
 </div>
 </div>
 ))}
 {testSessions.length === 0 && (
 <div className="p-8 text-center text-gray-500">
 <ChartBarIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
 <p>No test sessions found. Complete some tests to see your history.</p>
 </div>
 )}
 </div>
 </div>
 </div>
 )}

 {activeTab === 'sessions' && (
 <div className="space-y-4">
 <div className="text-center text-gray-500">
 <p>All Sessions view - Implementation can be expanded here</p>
 </div>
 </div>
 )}

 {activeTab === 'analytics' && (
 <div className="space-y-4">
 <div className="text-center text-gray-500">
 <p>Analytics view - Implementation can be expanded here</p>
 </div>
 </div>
 )}
 </div>
 </div>
 )}
 </div>
 </motion.div>
 </div>
 </motion.div>
 </AnimatePresence>
 );
};

export default TestHistoryModal;
