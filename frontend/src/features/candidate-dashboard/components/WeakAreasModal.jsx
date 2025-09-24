import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  XMarkIcon,
  ExclamationTriangleIcon,
  ArrowRightIcon,
  ClockIcon,
  ChartBarIcon,
  PlayIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';

const WeakAreasModal = ({ isOpen, onClose, recommendations = [] }) => {
  const navigate = useNavigate();

  const handleTestClick = (test) => {
    navigate(test.route);
    onClose();
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-50';
      case 'Medium': return 'text-yellow-600 bg-yellow-50';
      case 'Hard': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Modal */}
        <div className="flex min-h-full items-center justify-center p-4">
          <motion.div
            className="relative bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <ExclamationTriangleIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Improve Weak Areas</h2>
                    <p className="text-orange-100 text-sm">Targeted test recommendations to boost your scores</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {recommendations.length === 0 ? (
                <div className="text-center py-12">
                  <TrophyIcon className="h-16 w-16 text-green-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Great Job!</h3>
                  <p className="text-gray-600 mb-6">
                    You don't have any weak areas that need immediate attention. 
                    All your scores are above 70%!
                  </p>
                  <button
                    onClick={() => navigate('/tests')}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Take More Tests
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Summary */}
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <h3 className="font-semibold text-orange-900 mb-2">
                      Areas for Improvement ({recommendations.length})
                    </h3>
                    <p className="text-orange-800 text-sm">
                      Focus on these areas to significantly boost your overall employability score. 
                      Taking the recommended tests will help you improve in these specific skills.
                    </p>
                  </div>

                  {/* Recommendations */}
                  {recommendations.map((recommendation, index) => {
                    const IconComponent = recommendation.icon;
                    
                    return (
                      <motion.div
                        key={recommendation.categoryId}
                        className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        {/* Category Header */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg ${recommendation.color}`}>
                              <IconComponent className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{recommendation.category}</h4>
                              <p className="text-sm text-gray-600">{recommendation.description}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(recommendation.priority)}`}>
                              {recommendation.priority} Priority
                            </div>
                          </div>
                        </div>

                        {/* Score Progress */}
                        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-gray-600">Current Score</span>
                            <span className="font-semibold text-gray-900">{recommendation.currentScore}%</span>
                          </div>
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-gray-600">Target Score</span>
                            <span className="font-semibold text-green-600">{recommendation.targetScore}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-orange-400 to-orange-600 h-2 rounded-full"
                              style={{ width: `${(recommendation.currentScore / recommendation.targetScore) * 100}%` }}
                            />
                          </div>
                        </div>

                        {/* Recommended Tests */}
                        <div>
                          <h5 className="font-medium text-gray-900 mb-3">Recommended Tests</h5>
                          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                            {recommendation.tests.map((test, testIndex) => (
                              <motion.button
                                key={testIndex}
                                onClick={() => handleTestClick(test)}
                                className="text-left p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <h6 className="font-medium text-gray-900 text-sm group-hover:text-blue-700">
                                    {test.name}
                                  </h6>
                                  <ArrowRightIcon className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                                </div>
                                <div className="flex items-center space-x-3 text-xs text-gray-500">
                                  <div className="flex items-center space-x-1">
                                    <ClockIcon className="h-3 w-3" />
                                    <span>{test.duration}</span>
                                  </div>
                                  <div className={`px-2 py-1 rounded-full ${getDifficultyColor(test.difficulty)}`}>
                                    {test.difficulty}
                                  </div>
                                </div>
                              </motion.button>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  💡 Tip: Focus on high-priority areas first for maximum impact
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => navigate('/tests')}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2"
                  >
                    <PlayIcon className="h-4 w-4" />
                    <span>Browse All Tests</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default WeakAreasModal;
