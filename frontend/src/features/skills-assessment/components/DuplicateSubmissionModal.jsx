import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTrophy, FaRedo, FaHistory, FaTimes, FaClock, FaBullseye, FaHome } from 'react-icons/fa';
import '../../candidate-dashboard/styles/dashboard-design-system.css';

const DuplicateSubmissionModal = ({
 isOpen,
 onClose,
 existingSubmission,
 testTitle,
 onViewResults,
 onRetakeTest,
 onBackToDashboard,
 onNavigateToTestHistory
}) => {
 if (!isOpen || !existingSubmission) return null;

 const handleViewHistory = () => {
 // Close modal first
 onClose();

 // Use the navigation callback if provided, otherwise fallback to dashboard navigation
 if (onNavigateToTestHistory) {
 onNavigateToTestHistory();
 } else if (onBackToDashboard) {
 // Fallback to dashboard if no test history navigation is provided
 onBackToDashboard();
 }
 };

 const formatDate = (dateString) => {
 try {
 const date = new Date(dateString);
 return date.toLocaleDateString('en-US', {
 year: 'numeric',
 month: 'long',
 day: 'numeric',
 hour: '2-digit',
 minute: '2-digit'
 });
 } catch (error) {
 return 'Unknown date';
 }
 };

 const getScoreColor = (score) => {
 if (score >= 75) return 'text-green-600';
 if (score >= 60) return 'text-yellow-600';
 return 'text-red-600';
 };

 const getScoreBgColor = (score) => {
 if (score >= 75) return 'bg-green-50 border-green-200';
 if (score >= 60) return 'bg-yellow-50 border-yellow-200';
 return 'bg-red-50 border-red-200';
 };

 return (
 <AnimatePresence>
 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
 <motion.div
 initial={{ opacity: 0, scale: 0.9 }}
 animate={{ opacity: 1, scale: 1 }}
 exit={{ opacity: 0, scale: 0.9 }}
 transition={{ duration: 0.3 }}
 className="sa-card max-w-lg w-full mx-4"
 >
 {/* Header */}
 <div className="sa-card-header flex items-center justify-between">
 <div className="flex items-center space-x-3">
 <div className="flex-shrink-0">
 <FaTrophy className="h-6 w-6 text-blue-600" />
 </div>
 <div>
 <h3 className="sa-heading-2">
 Keep Going!
 </h3>
 <p className="text-sm text-gray-600">
 You've already completed this assessment
 </p>
 </div>
 </div>
 <button
 onClick={onClose}
 className="text-gray-400 hover:text-gray-600 transition-colors"
 >
 <FaTimes className="h-5 w-5" />
 </button>
 </div>

 {/* Content */}
 <div className="sa-card-content">
 <div className="text-center mb-6">
 <h4 className="text-lg font-medium text-gray-900 mb-2">
 {testTitle}
 </h4>
 <p className="text-sm text-gray-600 flex items-center justify-center">
 <FaClock className="w-4 h-4 mr-1" />
 Completed on {formatDate(existingSubmission.submittedAt)}
 </p>
 </div>

 {/* Score Display */}
 <div className={`p-6 rounded-xl border-2 mb-6 ${getScoreBgColor(existingSubmission.score)}`}>
 <div className="text-center">
 <div className="flex items-center justify-center mb-3">
 <div className="relative">
 <div className={`w-16 h-16 rounded-full flex items-center justify-center ${getScoreBgColor(existingSubmission.score)} border-2`}>
 <FaTrophy className={`w-6 h-6 ${getScoreColor(existingSubmission.score)}`} />
 </div>
 </div>
 </div>
 <div className={`text-4xl font-bold ${getScoreColor(existingSubmission.score)} mb-2`}>
 {existingSubmission.score}%
 </div>
 <div className="text-sm text-gray-600">
 Great job on completing this assessment!
 </div>
 </div>
 </div>

 {/* Stats */}
 <div className="grid grid-cols-2 gap-4 mb-6">
 <div className="text-center p-3 bg-gray-50 rounded-lg">
 <FaBullseye className="w-5 h-5 text-blue-600 mx-auto mb-1" />
 <div className="text-sm font-medium text-gray-900">Attempts</div>
 <div className="text-xs text-gray-600">1 completed</div>
 </div>

 <div className="text-center p-3 bg-gray-50 rounded-lg">
 <FaClock className="w-5 h-5 text-purple-600 mx-auto mb-1" />
 <div className="text-sm font-medium text-gray-900">Status</div>
 <div className="text-xs text-gray-600">Completed</div>
 </div>
 </div>

 {/* Action Buttons */}
 <div className="space-y-3">
 <button
 onClick={handleViewHistory}
 className="w-full sa-btn sa-btn-primary flex items-center justify-center"
 >
 <FaHistory className="h-4 w-4 mr-2" />
 View Test History
 </button>

 {onRetakeTest && (
 <button
 onClick={onRetakeTest}
 className="w-full sa-btn sa-btn-secondary flex items-center justify-center"
 >
 <FaRedo className="h-4 w-4 mr-2" />
 Retake Test
 </button>
 )}

 <button
 onClick={onBackToDashboard}
 className="w-full sa-btn sa-btn-ghost flex items-center justify-center"
 >
 <FaHome className="h-4 w-4 mr-2" />
 Back to Dashboard
 </button>
 </div>
 </div>
 </motion.div>
 </div>
 </AnimatePresence>
 );
};

export default DuplicateSubmissionModal;
