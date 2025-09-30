import React, { useState, useEffect } from 'react';
import { FaTrophy, FaChartLine, FaClock, FaCalendarAlt, FaFilter, FaDownload, FaEye, FaTrash } from 'react-icons/fa';
import TestHistoryList from './TestHistoryList';
import TestHistoryCharts from './TestHistoryCharts';
import TestSessionDetail from './TestSessionDetail';
import testHistoryApi from '../services/testHistoryApi';

const TestHistoryDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [testSessions, setTestSessions] = useState([]);
  const [summary, setSummary] = useState(null);
  const [categoryStats, setCategoryStats] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  useEffect(() => {
    // Check if user has a valid token in localStorage
    const token = localStorage.getItem('access_token');
    if (!token) {
      setError('Please log in to view your test history.');
      setLoading(false);
      return;
    }
    
    // Check if token is expired (basic check)
    try {
      const tokenData = JSON.parse(atob(token.split('.')[1]));
      const now = Date.now() / 1000;
      if (tokenData.exp < now) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setError('Your session has expired. Please log in again to view your test history.');
        setLoading(false);
        return;
      }
    } catch (e) {
      // Token is malformed, remove it
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setError('Invalid session. Please log in again to view your test history.');
      setLoading(false);
      return;
    }
    
    loadTestHistoryData();
  }, []);

  const loadTestHistoryData = async () => {
    try {
      setLoading(true);
      setError(null);


      // Load all data in parallel
      const [sessionsData, summaryData, categoryData, chartsData] = await Promise.all([
        testHistoryApi.getTestSessions(),
        testHistoryApi.getTestHistorySummary(),
        testHistoryApi.getTestCategoryStats(),
        testHistoryApi.getTestHistoryCharts()
      ]);



      setTestSessions(sessionsData);
      setSummary(summaryData);
  // API now returns an array of category stats
  setCategoryStats(Array.isArray(categoryData) ? categoryData : []);
      setChartData(chartsData);
    } catch (err) {
      console.error('❌ Error loading test history data:', err);
      
      // Check if it's an authentication error
      if (err.message.includes('401') || err.message.includes('Unauthorized') || err.message.includes('Session expired')) {
        setError('Your session has expired. Please log in again to view your test history.');
      } else {
        setError(`Failed to load test history data: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSessionClick = async (sessionId) => {
    try {
      const sessionDetail = await testHistoryApi.getTestSessionDetail(sessionId);
      setSelectedSession(sessionDetail);
      setActiveTab('detail');
    } catch (err) {
      console.error('Error loading session detail:', err);
      setError('Failed to load session details.');
    }
  };

  const handleDeleteSession = async (sessionId) => {
    if (window.confirm('Are you sure you want to delete this test session?')) {
      try {
        await testHistoryApi.deleteTestSession(sessionId);
        // Reload data
        await loadTestHistoryData();
        setError(null);
      } catch (err) {
        console.error('Error deleting session:', err);
        setError('Failed to delete test session.');
      }
    }
  };

  const getFilteredAndSortedSessions = () => {
    let filtered = testSessions;

    // Filter by test type
    if (filterType !== 'all') {
      filtered = filtered.filter(session => session.test_type === filterType);
    }

    // Sort sessions
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.start_time) - new Date(a.start_time);
        case 'score':
          return (b.score || 0) - (a.score || 0);
        case 'test_name':
          return a.test_title.localeCompare(b.test_title);
        default:
          return 0;
      }
    });

    return filtered;
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getTestTypeColor = (testType) => {
    const colors = {
      'verbal_reasoning': 'bg-blue-100 text-blue-800',
      'numerical_reasoning': 'bg-green-100 text-green-800',
      'logical_reasoning': 'bg-purple-100 text-purple-800',
      'abstract_reasoning': 'bg-orange-100 text-orange-800',
      'spatial_reasoning': 'bg-pink-100 text-pink-800',
      'situational_judgment': 'bg-indigo-100 text-indigo-800',
      'technical': 'bg-gray-100 text-gray-800'
    };
    return colors[testType] || 'bg-gray-100 text-gray-800';
  };

  const formatDuration = (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <div className="ml-4 text-lg text-gray-600">Loading test history...</div>
      </div>
    );
  }

  if (error) {
    const isAuthError = error.includes('session') || error.includes('expired') || error.includes('log in');
    
    return (
      <div className={`${isAuthError ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200'} border rounded-xl p-6`}>
        <div className="flex items-center">
          <div className={`${isAuthError ? 'text-yellow-400' : 'text-red-400'} mr-3`}>
            <FaChartLine className="text-xl" />
          </div>
          <div>
            <h3 className={`text-lg font-medium ${isAuthError ? 'text-yellow-800' : 'text-red-800'}`}>
              {isAuthError ? 'Session Expired' : 'Error Loading Test History'}
            </h3>
            <p className={`${isAuthError ? 'text-yellow-600' : 'text-red-600'} mt-1`}>{error}</p>
            <div className="mt-3 flex gap-2">
              {!isAuthError && (
                <button
                  onClick={loadTestHistoryData}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
              )}
              {isAuthError && (
                <button
                  onClick={() => window.location.href = '/login'}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Go to Login
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Test History</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Track your test performance, view detailed results, and analyze your progress over time.
        </p>
              <div className="text-xs text-gray-500 mt-4 text-center">
                <button
                  onClick={loadTestHistoryData}
                  className="px-2 py-1 bg-blue-100 text-blue-600 rounded text-xs hover:bg-blue-200"
                >
                  🔄 Refresh Data
                </button>
              </div>
      </div>

      {/* Summary Stats */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-blue-50 p-3 rounded-lg">
                <FaTrophy className="text-blue-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Tests Completed</p>
                <p className="text-2xl font-bold text-gray-900">{summary.completed_sessions}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-green-50 p-3 rounded-lg">
                <FaChartLine className="text-green-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Average Score</p>
                <p className="text-2xl font-bold text-gray-900">{summary.average_score}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-yellow-50 p-3 rounded-lg">
                <FaTrophy className="text-yellow-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Best Score</p>
                <p className="text-2xl font-bold text-gray-900">{summary.best_score}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-purple-50 p-3 rounded-lg">
                <FaClock className="text-purple-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Total Time</p>
                <p className="text-2xl font-bold text-gray-900">{summary.total_time_spent}m</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('sessions')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'sessions'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              All Sessions
            </button>
            <button
              onClick={() => setActiveTab('charts')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'charts'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Analytics
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Recent Sessions */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Test Sessions</h3>
                <div className="space-y-3">
                  {summary?.recent_sessions?.slice(0, 5).map((session) => (
                    <div
                      key={session.id}
                      className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer"
                      onClick={() => handleSessionClick(session.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-gray-900">{session.test_title}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTestTypeColor(session.test_type)}`}>
                              {session.test_type.replace('_', ' ').toUpperCase()}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <FaCalendarAlt className="text-gray-400" />
                              {new Date(session.start_time).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <FaClock className="text-gray-400" />
                              {formatDuration(session.duration_minutes)}
                            </span>
                          </div>
                        </div>
                        <div className={`px-3 py-1 rounded-lg font-bold text-lg ${getScoreColor(session.score_percentage)}`}>
                          {session.score_percentage}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Category Stats */}
              {categoryStats.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance by Category</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categoryStats.map((stat) => (
                      <div key={stat.test_type} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">
                            {stat.test_type.replace('_', ' ').toUpperCase()}
                          </h4>
                          <span className="text-sm text-gray-500">{stat.count} tests</span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Average:</span>
                            <span className="font-medium">{stat.average_score}%</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Best:</span>
                            <span className="font-medium">{stat.best_score}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'sessions' && (
            <TestHistoryList
              sessions={getFilteredAndSortedSessions()}
              onSessionClick={handleSessionClick}
              onDeleteSession={handleDeleteSession}
              filterType={filterType}
              setFilterType={setFilterType}
              sortBy={sortBy}
              setSortBy={setSortBy}
              getScoreColor={getScoreColor}
              getTestTypeColor={getTestTypeColor}
              formatDuration={formatDuration}
            />
          )}

          {activeTab === 'charts' && (
            <TestHistoryCharts
              chartData={chartData}
              categoryStats={categoryStats}
            />
          )}

          {activeTab === 'detail' && selectedSession && (
            <TestSessionDetail
              session={selectedSession}
              onBack={() => setActiveTab('sessions')}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TestHistoryDashboard;
