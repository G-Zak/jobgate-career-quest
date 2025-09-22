import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaTimes, 
  FaTrophy, 
  FaClock, 
  FaGraduationCap, 
  FaCheckCircle, 
  FaTimesCircle,
  FaQuestionCircle,
  FaCalendarAlt,
  FaUser,
  FaBook
} from 'react-icons/fa';

const TestHistoryDetail = ({ session, onClose }) => {
  if (!session) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getGradeColor = (grade) => {
    const gradeColors = {
      'A': 'text-green-600',
      'B': 'text-blue-600',
      'C': 'text-yellow-600',
      'D': 'text-orange-600',
      'F': 'text-red-600',
    };
    return gradeColors[grade] || 'text-gray-600';
  };

  const getCategoryColor = (category) => {
    const categoryColors = {
      'verbal_reasoning': 'bg-blue-100 text-blue-800',
      'numerical_reasoning': 'bg-green-100 text-green-800',
      'logical_reasoning': 'bg-purple-100 text-purple-800',
      'situational_judgment': 'bg-orange-100 text-orange-800',
      'abstract_reasoning': 'bg-pink-100 text-pink-800',
      'spatial_reasoning': 'bg-indigo-100 text-indigo-800',
      'technical': 'bg-gray-100 text-gray-800',
    };
    return categoryColors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <FaBook className="h-6 w-6 text-blue-600 mr-3" />
            <h2 className="text-xl font-bold text-gray-900">Test Session Details</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Test Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Information</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <FaBook className="text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Test Name</p>
                    <p className="font-medium">{session.test_name}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(session.test_category)}`}>
                    {session.test_category.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                {session.test_description && (
                  <div>
                    <p className="text-sm text-gray-600">Description</p>
                    <p className="text-sm">{session.test_description}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Session Details</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <FaCalendarAlt className="text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Date Taken</p>
                    <p className="font-medium">{formatDate(session.date_taken)}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FaClock className="text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="font-medium">{session.duration_formatted}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FaQuestionCircle className="text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Questions</p>
                    <p className="font-medium">{session.total_questions} total</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Results Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className={`text-3xl font-bold ${getScoreColor(session.percentage_score)}`}>
                  {session.percentage_score}%
                </div>
                <p className="text-sm text-gray-600">Overall Score</p>
              </div>
              <div className="text-center">
                <div className={`text-3xl font-bold ${getGradeColor(session.grade_letter)}`}>
                  {session.grade_letter}
                </div>
                <p className="text-sm text-gray-600">Grade</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">
                  {session.correct_answers}/{session.total_questions}
                </div>
                <p className="text-sm text-gray-600">Correct Answers</p>
              </div>
              <div className="text-center">
                <div className={`text-3xl font-bold ${session.passed ? 'text-green-600' : 'text-red-600'}`}>
                  {session.passed ? (
                    <FaCheckCircle className="mx-auto" />
                  ) : (
                    <FaTimesCircle className="mx-auto" />
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  {session.passed ? 'Passed' : 'Failed'}
                </p>
              </div>
            </div>
          </div>

          {/* Detailed Answers */}
          {session.details && session.details.answers && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Answers</h3>
              <div className="space-y-4">
                {Object.entries(session.details.answers).map(([questionId, answer]) => (
                  <div key={questionId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <span className="font-medium text-gray-900 mr-3">Q{questionId}:</span>
                      <span className="text-gray-700">Answer: {answer}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500">Question ID: {questionId}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Additional Metadata */}
          {session.details && session.details.metadata && (
            <div className="mt-6 bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Additional Information</h4>
              <pre className="text-xs text-gray-600 overflow-x-auto">
                {JSON.stringify(session.details.metadata, null, 2)}
              </pre>
            </div>
          )}

          {/* Submission Details */}
          {session.submission_details && (
            <div className="mt-6 bg-blue-50 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Submission Details</h4>
              <div className="text-xs text-gray-600">
                <p>Submission ID: {session.submission_details.id}</p>
                <p>Time Taken: {session.submission_details.time_taken_seconds} seconds</p>
                <p>Completed: {session.submission_details.is_complete ? 'Yes' : 'No'}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TestHistoryDetail;
