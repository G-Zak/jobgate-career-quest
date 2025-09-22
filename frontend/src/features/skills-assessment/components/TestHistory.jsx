import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaHistory, 
  FaChartLine, 
  FaTrophy, 
  FaClock, 
  FaEye, 
  FaTrash,
  FaFilter,
  FaSearch,
  FaCalendarAlt,
  FaGraduationCap
} from 'react-icons/fa';
import TestHistoryService from '../services/testHistoryService';
import TestHistoryDetail from './TestHistoryDetail';
import TestHistoryStats from './TestHistoryStats';
import TestHistoryFilters from './TestHistoryFilters';

const TestHistory = () => {
  const [historyData, setHistoryData] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [filters, setFilters] = useState({
    test_type: '',
    date_from: '',
    date_to: '',
    limit: 20,
    offset: 0
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadTestHistory();
    loadStats();
  }, [filters]);

  const loadTestHistory = async () => {
    try {
      setLoading(true);
      const data = await TestHistoryService.getUserTestHistory('anonymous', filters);
      setHistoryData(data.results || []);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error loading test history:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const data = await TestHistoryService.getTestHistoryStats('anonymous');
      setStats(data);
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  };

  const handleViewDetail = async (sessionId) => {
    try {
      const detail = await TestHistoryService.getTestHistoryDetail(sessionId);
      setSelectedSession(detail);
      setShowDetail(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteSession = async (sessionId) => {
    if (window.confirm('Are you sure you want to delete this test session?')) {
      try {
        await TestHistoryService.deleteTestHistory(sessionId);
        await loadTestHistory();
        await loadStats();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters, offset: 0 });
  };

  const filteredHistory = historyData.filter(entry => 
    entry.test_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.test_category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading test history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <FaHistory className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Test History</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowStats(!showStats)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FaChartLine className="mr-2" />
                {showStats ? 'Hide Stats' : 'Show Stats'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Section */}
        <AnimatePresence>
          {showStats && stats && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8"
            >
              <TestHistoryStats stats={stats} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <TestHistoryFilters 
            filters={filters}
            onFilterChange={handleFilterChange}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Test History List */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Test Sessions ({filteredHistory.length})
            </h2>
          </div>

          {filteredHistory.length === 0 ? (
            <div className="text-center py-12">
              <FaHistory className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No test sessions found</h3>
              <p className="text-gray-500">Complete some tests to see your history here.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredHistory.map((entry, index) => (
                <motion.div
                  key={entry.session_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {entry.test_name}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${TestHistoryService.getCategoryColor(entry.test_category)}`}>
                          {entry.test_category.replace('_', ' ').toUpperCase()}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          entry.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {entry.passed ? 'PASSED' : 'FAILED'}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-600">
                        <div className="flex items-center">
                          <FaGraduationCap className="mr-1" />
                          <span className={`font-semibold ${TestHistoryService.getGradeColor(entry.grade_letter)}`}>
                            Grade: {entry.grade_letter}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <FaTrophy className="mr-1" />
                          <span className={`font-semibold ${entry.percentage_score >= 70 ? 'text-green-600' : 'text-red-600'}`}>
                            {entry.percentage_score}%
                          </span>
                        </div>
                        <div className="flex items-center">
                          <FaClock className="mr-1" />
                          <span>{entry.duration_formatted}</span>
                        </div>
                        <div className="flex items-center">
                          <span>{entry.correct_answers}/{entry.total_questions} correct</span>
                        </div>
                      </div>
                      
                      <div className="mt-2 text-sm text-gray-500">
                        <FaCalendarAlt className="inline mr-1" />
                        {formatDate(entry.date_taken)}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewDetail(entry.session_id)}
                        className="flex items-center px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <FaEye className="mr-1" />
                        View Details
                      </button>
                      <button
                        onClick={() => handleDeleteSession(entry.session_id)}
                        className="flex items-center px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <FaTrash className="mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {showDetail && selectedSession && (
          <TestHistoryDetail
            session={selectedSession}
            onClose={() => {
              setShowDetail(false);
              setSelectedSession(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default TestHistory;
