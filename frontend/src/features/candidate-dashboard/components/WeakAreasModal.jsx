import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  XMarkIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  ChartBarIcon,
  PlayIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';

const WeakAreasModal = ({ isOpen, onClose, recommendations = [], onNavigateToTest }) => {
  const navigate = useNavigate();

  const handleTestClick = (test) => {
    onClose();
    if (onNavigateToTest && test.testRoute) {
      // Use the MainDashboard navigation system
      onNavigateToTest(test.testRoute);
    } else if (test.route) {
      // Fallback to React Router navigation
      navigate(test.route);
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
                    <h2 className="text-xl font-bold">Improve Your Skills</h2>
                    <p className="text-orange-100 text-sm">Recommended tests to boost your employability score</p>
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
              {/* Summary Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-2xl font-bold text-blue-600">6</div>
                  <div className="text-sm text-blue-700">Tests Available</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-2xl font-bold text-green-600">+245</div>
                  <div className="text-sm text-green-700">Potential Points</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="text-2xl font-bold text-purple-600">2h</div>
                  <div className="text-sm text-purple-700">Total Time</div>
                </div>
              </div>

              {/* Test Cards */}
              <div className="space-y-4">
                {/* Numerical Reasoning Test */}
                <motion.div
                  className="border border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-lg transition-all duration-200 cursor-pointer group bg-white"
                  onClick={() => handleTestClick({ testRoute: 'NRT1' })}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <ChartBarIcon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-700">
                            Numerical Reasoning Test 1
                          </h3>
                          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                            HIGH PRIORITY
                          </span>
                        </div>
                        <p className="text-gray-600 mb-3">
                          Improve your numerical analysis and problem-solving skills
                        </p>
                        <div className="flex items-center space-x-6 text-sm text-gray-500 mb-3">
                          <div className="flex items-center space-x-1">
                            <ChartBarIcon className="w-4 h-4" />
                            <span>Cognitive</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <TrophyIcon className="w-4 h-4" />
                            <span>Intermediate</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <ClockIcon className="w-4 h-4" />
                            <span>20 min</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">Mathematical Analysis</span>
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">Data Interpretation</span>
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">Problem Solving</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          Not taken yet
                        </div>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-sm text-gray-500 mb-1">Current → Target</div>
                      <div className="text-lg font-bold text-gray-900">45% → 75%</div>
                      <div className="text-sm font-medium text-green-600">+30 points</div>
                      <div className="w-24 bg-gray-200 rounded-full h-2 mt-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                      </div>
                      <button className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center space-x-2">
                        <PlayIcon className="w-4 h-4" />
                        <span>Start Test</span>
                      </button>
                    </div>
                  </div>
                </motion.div>

                {/* Spatial Reasoning Test */}
                <motion.div
                  className="border border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-lg transition-all duration-200 cursor-pointer group bg-white"
                  onClick={() => handleTestClick({ testRoute: 'SRT1' })}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="p-3 bg-green-100 rounded-lg">
                        <ChartBarIcon className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-700">
                            Spatial Reasoning Test 1
                          </h3>
                          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                            HIGH PRIORITY
                          </span>
                        </div>
                        <p className="text-gray-600 mb-3">
                          Enhance your spatial visualization and pattern recognition
                        </p>
                        <div className="flex items-center space-x-6 text-sm text-gray-500 mb-3">
                          <div className="flex items-center space-x-1">
                            <ChartBarIcon className="w-4 h-4" />
                            <span>Cognitive</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <TrophyIcon className="w-4 h-4" />
                            <span>Intermediate</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <ClockIcon className="w-4 h-4" />
                            <span>20 min</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">Spatial Visualization</span>
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">Pattern Recognition</span>
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">3D Thinking</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          Not taken yet
                        </div>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-sm text-gray-500 mb-1">Current → Target</div>
                      <div className="text-lg font-bold text-gray-900">0% → 70%</div>
                      <div className="text-sm font-medium text-green-600">+70 points</div>
                      <div className="w-24 bg-gray-200 rounded-full h-2 mt-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '0%' }}></div>
                      </div>
                      <button className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center space-x-2">
                        <PlayIcon className="w-4 h-4" />
                        <span>Start Test</span>
                      </button>
                    </div>
                  </div>
                </motion.div>

                {/* Verbal Reasoning Test */}
                <motion.div
                  className="border border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-lg transition-all duration-200 cursor-pointer group bg-white"
                  onClick={() => handleTestClick({ testRoute: 'VRT1' })}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="p-3 bg-yellow-100 rounded-lg">
                        <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-700">
                            Verbal Reasoning Test 1
                          </h3>
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                            MEDIUM PRIORITY
                          </span>
                        </div>
                        <p className="text-gray-600 mb-3">
                          Improve your verbal comprehension and reasoning skills
                        </p>
                        <div className="flex items-center space-x-6 text-sm text-gray-500 mb-3">
                          <div className="flex items-center space-x-1">
                            <ChartBarIcon className="w-4 h-4" />
                            <span>Cognitive</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <TrophyIcon className="w-4 h-4" />
                            <span>Intermediate</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <ClockIcon className="w-4 h-4" />
                            <span>20 min</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">Reading Comprehension</span>
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">Critical Thinking</span>
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">Language Skills</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          Retake recommended
                        </div>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-sm text-gray-500 mb-1">Current → Target</div>
                      <div className="text-lg font-bold text-gray-900">55% → 80%</div>
                      <div className="text-sm font-medium text-green-600">+25 points</div>
                      <div className="w-24 bg-gray-200 rounded-full h-2 mt-2">
                        <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '69%' }}></div>
                      </div>
                      <button className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center space-x-2">
                        <PlayIcon className="w-4 h-4" />
                        <span>Retake Test</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
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
