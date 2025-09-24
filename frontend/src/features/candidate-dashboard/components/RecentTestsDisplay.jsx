import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  TrophyIcon,
  CalendarIcon,
  ArrowRightIcon,
  AcademicCapIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import dashboardApi from '../services/dashboardApi';

const RecentTestsDisplay = ({ limit = 4, showViewAll = true }) => {
  const navigate = useNavigate();
  const [recentTests, setRecentTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecentTests = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('🔍 Fetching recent tests data...');
        const tests = await dashboardApi.getRecentTests(limit);

        console.log('📊 Recent tests received:', tests);

        // Take the last 4 tests taken (regardless of pass/fail status)
        const recentTests = (tests || []).slice(0, limit);

        setRecentTests(recentTests);
        console.log('✅ Recent tests loaded:', recentTests);

      } catch (err) {
        console.error('❌ Error fetching recent tests:', err);
        setError('Failed to load recent tests');
      } finally {
        setLoading(false);
      }
    };

    fetchRecentTests();
  }, [limit]);

  const getTestTypeIcon = (testType) => {
    const iconMap = {
      'technical': AcademicCapIcon,
      'cognitive': ChartBarIcon,
      'situational': CheckCircleIcon,
      'verbal_reasoning': AcademicCapIcon,
      'numerical_reasoning': ChartBarIcon,
      'logical_reasoning': ChartBarIcon,
      'analytical': ChartBarIcon,
      'communication': AcademicCapIcon,
      'soft_skills': CheckCircleIcon
    };
    return iconMap[testType] || AcademicCapIcon;
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 80) return 'text-blue-600 bg-blue-50';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50';
    if (score >= 60) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const getScoreBadgeColor = (score) => {
    if (score >= 90) return 'bg-green-100 text-green-800';
    if (score >= 80) return 'bg-blue-100 text-blue-800';
    if (score >= 70) return 'bg-yellow-100 text-yellow-800';
    if (score >= 60) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const formatDuration = (minutes) => {
    if (!minutes || minutes === 0) return 'N/A';
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  const handleTestClick = (test) => {
    // Navigate to test details or results page
    if (test.test_id) {
      navigate(`/test-results/${test.test_id}`);
    }
  };

  const handleViewAll = () => {
    navigate('/test-history');
  };

  // Loading state
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Tests</h3>
          <ClockIcon className="h-5 w-5 text-blue-500" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="w-16 h-6 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Tests</h3>
          <ClockIcon className="h-5 w-5 text-blue-500" />
        </div>
        <div className="text-center py-6">
          <XCircleIcon className="h-12 w-12 text-red-400 mx-auto mb-3" />
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
  if (!recentTests || recentTests.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Tests</h3>
          <ClockIcon className="h-5 w-5 text-blue-500" />
        </div>
        <div className="text-center py-8">
          <AcademicCapIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">No Tests Yet</h4>
          <p className="text-gray-600 mb-6">Start taking assessments to see your results here</p>
          <button
            onClick={() => navigate('/skills-assessment')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Take Assessment
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
        <h3 className="text-lg font-semibold text-gray-900">Recent Tests</h3>
        <ClockIcon className="h-5 w-5 text-blue-500" />
      </div>

      {/* Tests List */}
      <div className="space-y-3">
        {recentTests.map((test, index) => {
          const TestIcon = getTestTypeIcon(test.test?.test_type || test.test_type);
          const score = Math.round(test.score || 0);
          
          return (
            <motion.div
              key={test.id || index}
              className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              onClick={() => handleTestClick(test)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              {/* Test Icon */}
              <div className={`p-2 rounded-full ${getScoreColor(score)}`}>
                <TestIcon className="h-5 w-5" />
              </div>

              {/* Test Info */}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 truncate">
                  {test.test?.name || test.test_name || `${(test.test?.test_type || test.test_type || 'Test').replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} Test`}
                </h4>
                <div className="flex items-center space-x-3 mt-1 text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <CalendarIcon className="h-3 w-3" />
                    <span>{formatDate(test.start_time || test.created_at)}</span>
                  </div>
                  {test.time_spent && (
                    <div className="flex items-center space-x-1">
                      <ClockIcon className="h-3 w-3" />
                      <span>{formatDuration(test.time_spent)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Score Badge */}
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreBadgeColor(score)}`}>
                  {score}%
                </span>
                <ArrowRightIcon className="h-4 w-4 text-gray-400" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* View All Button */}
      {showViewAll && (
        <div className="mt-6 text-center">
          <button
            onClick={handleViewAll}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 hover:underline"
          >
            View All Tests →
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default RecentTestsDisplay;
