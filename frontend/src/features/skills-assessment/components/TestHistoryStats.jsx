import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaChartLine, 
  FaTrophy, 
  FaCheckCircle, 
  FaTimesCircle,
  FaGraduationCap,
  FaClock,
  FaTrendingUp,
  FaTrendingDown
} from 'react-icons/fa';

const TestHistoryStats = ({ stats }) => {
  if (!stats) return null;

  const getScoreTrendIcon = (currentScore, previousScore) => {
    if (currentScore > previousScore) return <FaTrendingUp className="text-green-500" />;
    if (currentScore < previousScore) return <FaTrendingDown className="text-red-500" />;
    return <FaChartLine className="text-gray-500" />;
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getCategoryColor = (category) => {
    const categoryColors = {
      'verbal_reasoning': 'bg-blue-500',
      'numerical_reasoning': 'bg-green-500',
      'logical_reasoning': 'bg-purple-500',
      'situational_judgment': 'bg-orange-500',
      'abstract_reasoning': 'bg-pink-500',
      'spatial_reasoning': 'bg-indigo-500',
      'technical': 'bg-gray-500',
    };
    return categoryColors[category] || 'bg-gray-500';
  };

  // Calculate trend
  const recentScores = stats.score_trend.slice(-5).map(item => item.score);
  const currentAvg = recentScores.length > 0 ? recentScores.reduce((a, b) => a + b, 0) / recentScores.length : 0;
  const previousAvg = recentScores.length > 1 ? recentScores.slice(0, -1).reduce((a, b) => a + b, 0) / (recentScores.length - 1) : currentAvg;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm p-6"
    >
      <div className="flex items-center mb-6">
        <FaChartLine className="h-6 w-6 text-blue-600 mr-3" />
        <h2 className="text-xl font-bold text-gray-900">Performance Statistics</h2>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Tests</p>
              <p className="text-2xl font-bold text-blue-900">{stats.total_tests_taken}</p>
            </div>
            <FaGraduationCap className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Average Score</p>
              <p className={`text-2xl font-bold ${getScoreColor(stats.average_score)}`}>
                {stats.average_score}%
              </p>
            </div>
            <FaChartLine className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600 font-medium">Best Score</p>
              <p className={`text-2xl font-bold ${getScoreColor(stats.best_score)}`}>
                {stats.best_score}%
              </p>
            </div>
            <FaTrophy className="h-8 w-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Success Rate</p>
              <p className="text-2xl font-bold text-purple-900">
                {stats.total_tests_taken > 0 ? Math.round((stats.tests_passed / stats.total_tests_taken) * 100) : 0}%
              </p>
            </div>
            <FaCheckCircle className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Pass/Fail Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Results</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FaCheckCircle className="text-green-500 mr-3" />
                <span className="text-gray-700">Passed</span>
              </div>
              <div className="flex items-center">
                <span className="text-2xl font-bold text-green-600">{stats.tests_passed}</span>
                <div className="ml-4 w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${stats.total_tests_taken > 0 ? (stats.tests_passed / stats.total_tests_taken) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FaTimesCircle className="text-red-500 mr-3" />
                <span className="text-gray-700">Failed</span>
              </div>
              <div className="flex items-center">
                <span className="text-2xl font-bold text-red-600">{stats.tests_failed}</span>
                <div className="ml-4 w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full" 
                    style={{ width: `${stats.total_tests_taken > 0 ? (stats.tests_failed / stats.total_tests_taken) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Trend</h3>
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                {getScoreTrendIcon(currentAvg, previousAvg)}
              </div>
              <p className="text-sm text-gray-600">Recent Performance</p>
              <p className={`text-lg font-semibold ${getScoreColor(currentAvg)}`}>
                {currentAvg.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      {stats.category_breakdown && Object.keys(stats.category_breakdown).length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance by Category</h3>
          <div className="space-y-4">
            {Object.entries(stats.category_breakdown).map(([category, data]) => (
              <div key={category} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full ${getCategoryColor(category)} mr-3`}></div>
                  <span className="text-gray-700 capitalize">
                    {category.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500">{data.count} tests</span>
                  <span className={`font-semibold ${getScoreColor(data.average_score)}`}>
                    {data.average_score}%
                  </span>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getCategoryColor(category)}`}
                      style={{ width: `${data.average_score}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Score Trend Chart */}
      {stats.score_trend && stats.score_trend.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Score Trend (Last 30 Days)</h3>
          <div className="h-64 flex items-end justify-between space-x-1">
            {stats.score_trend.slice(-10).map((point, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div 
                  className={`w-full rounded-t ${getCategoryColor(point.test_name.toLowerCase().replace(/\s+/g, '_'))} opacity-80`}
                  style={{ height: `${(point.score / 100) * 200}px` }}
                ></div>
                <div className="text-xs text-gray-500 mt-2 transform -rotate-45 origin-left">
                  {new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between text-xs text-gray-500">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>
      )}

      {/* Recent Tests */}
      {stats.recent_tests && stats.recent_tests.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Tests</h3>
          <div className="space-y-3">
            {stats.recent_tests.slice(0, 5).map((test, index) => (
              <div key={test.session_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 mr-3">#{test.session_id}</span>
                  <span className="font-medium text-gray-900">{test.test_name}</span>
                  <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {test.test_category.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`font-semibold ${getScoreColor(test.percentage_score)}`}>
                    {test.percentage_score}%
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    test.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {test.passed ? 'Passed' : 'Failed'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default TestHistoryStats;
