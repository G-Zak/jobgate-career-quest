import React, { useState, useEffect } from 'react';
import ScoreDashboard from './ScoreDashboard';

const TestResultsIntegration = ({ testSession, onRetakeTest, onViewHistory }) => {
  const [loading, setLoading] = useState(true);
  const [scoreData, setScoreData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (testSession?.id) {
      fetchTestResults();
    }
  }, [testSession]);

  const fetchTestResults = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch comprehensive score data
      const response = await fetch(`/api/scores/${testSession.id}/detailed_breakdown/`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch results: ${response.status}`);
      }

      const data = await response.json();
      setScoreData(data);
    } catch (err) {
      console.error('Error fetching test results:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRetakeTest = () => {
    if (onRetakeTest) {
      onRetakeTest(testSession.test_type);
    }
  };

  const handleViewHistory = () => {
    if (onViewHistory) {
      onViewHistory();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your test results...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Unable to Load Results
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="space-y-2">
              <button
                onClick={fetchTestResults}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={handleRetakeTest}
                className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Retake Test
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!scoreData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="text-gray-400 text-6xl mb-4">📊</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            No Results Available
          </h2>
          <p className="text-gray-600 mb-4">
            Test results are not yet available for this session.
          </p>
          <button
            onClick={handleRetakeTest}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Take Test
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with action buttons */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Test Results Dashboard
              </h1>
              <p className="text-gray-600">
                Comprehensive analysis of your {testSession.test_type.replace('_', ' ')} assessment
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleViewHistory}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
              >
                <span className="mr-2">📈</span>
                View History
              </button>
              <button
                onClick={handleRetakeTest}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <span className="mr-2">🔄</span>
                Retake Test
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main results dashboard */}
      <ScoreDashboard 
        userId={testSession.user_id}
        testSessionId={testSession.id}
      />

      {/* Footer with additional actions */}
      <div className="bg-white border-t mt-8">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className="text-sm text-gray-500">
              Test completed on {new Date(testSession.end_time).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
            <div className="flex space-x-4">
              <button 
                onClick={() => window.print()}
                className="text-gray-600 hover:text-gray-800 flex items-center text-sm"
              >
                <span className="mr-1">🖨️</span>
                Print Results
              </button>
              <button 
                onClick={() => {
                  // Export functionality would go here
                  alert('Export functionality coming soon!');
                }}
                className="text-gray-600 hover:text-gray-800 flex items-center text-sm"
              >
                <span className="mr-1">📄</span>
                Export PDF
              </button>
              <button 
                onClick={() => {
                  const url = window.location.href;
                  navigator.clipboard.writeText(url);
                  alert('Results link copied to clipboard!');
                }}
                className="text-gray-600 hover:text-gray-800 flex items-center text-sm"
              >
                <span className="mr-1">🔗</span>
                Share Results
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestResultsIntegration;
