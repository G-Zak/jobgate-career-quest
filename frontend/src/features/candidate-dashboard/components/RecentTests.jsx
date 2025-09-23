import React from 'react';
import { 
  ClockIcon, 
  ChartBarIcon, 
  ArrowTopRightOnSquareIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

const RecentTests = ({ data, onViewAll, limit = 5 }) => {
  // Use data from props or show error state
  const tests = data || [];

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
      'verbal': '📖',
      'numerical': '🧮',
      'logical': '🧩',
      'abstract': '🔮',
      'diagrammatic': '📊',
      'situational': '💼',
      'spatial': '🏗️',
      'technical': '⚙️'
    };
    return icons[testType?.toLowerCase()] || '📝';
  };

  // Show error state if no data is provided
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center py-8">
          <ExclamationTriangleIcon className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Recent Tests</h3>
          <p className="text-gray-600 mb-4">Unable to load recent test data. Please try refreshing the page.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Refresh Page
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
                  {test.test_title || test.test_type || 'Unknown Test'}
                </h3>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <ClockIcon className="w-3 h-3" />
                  <span>{formatDate(test.date_taken)}</span>
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