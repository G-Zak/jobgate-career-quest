/**
 * Test History Integration Example
 * Shows how to integrate test history with existing test components
 */

import React, { useState, useEffect } from 'react';
import { FaPlay, FaHistory, FaChartLine, FaTrophy } from 'react-icons/fa';
import TestHistoryDashboard from '../components/TestHistoryDashboard';
import testHistoryIntegration from '../services/testHistoryIntegration';
import useTestHistory from '../hooks/useTestHistory';

const TestHistoryExample = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [testSession, setTestSession] = useState(null);
  const [performance, setPerformance] = useState(null);
  const { loading, error, getPerformanceMetrics } = useTestHistory();

  useEffect(() => {
    loadPerformanceData();
  }, []);

  const loadPerformanceData = async () => {
    try {
      const metrics = await getPerformanceMetrics();
      setPerformance(metrics);
    } catch (err) {
      console.error('Failed to load performance data:', err);
    }
  };

  const startTestExample = async () => {
    try {
      // Example: Start a verbal reasoning test
      const session = await testHistoryIntegration.startTestSession(1); // Test ID 1
      setTestSession(session);
      console.log('Test session started:', session);
    } catch (error) {
      console.error('Failed to start test session:', error);
    }
  };

  const submitTestExample = async () => {
    try {
      // Example: Submit test results
      const testData = {
        answers: {
          '1': 'A',
          '2': 'B',
          '3': 'C'
        },
        score: { percentage_score: 85 },
        duration: 1200, // 20 minutes in seconds
        detailedAnswers: [
          {
            questionId: 1,
            selectedAnswer: 'A',
            isCorrect: true,
            timeTaken: 45
          },
          {
            questionId: 2,
            selectedAnswer: 'B',
            isCorrect: true,
            timeTaken: 60
          },
          {
            questionId: 3,
            selectedAnswer: 'C',
            isCorrect: false,
            timeTaken: 75
          }
        ]
      };

      const result = await testHistoryIntegration.submitTestResults(
        1, // Test ID
        testData.answers,
        testData.score,
        testData.duration,
        testData.detailedAnswers
      );

      console.log('Test submitted with history:', result);
      setTestSession(null);
      loadPerformanceData(); // Refresh performance data
    } catch (error) {
      console.error('Failed to submit test:', error);
    }
  };

  const checkTestHistory = async () => {
    try {
      const hasCompleted = await testHistoryIntegration.hasCompletedTest(1);
      const bestScore = await testHistoryIntegration.getBestScoreForTest(1);
      const attemptCount = await testHistoryIntegration.getTestAttemptCount(1);
      const recentActivity = await testHistoryIntegration.getRecentActivity(5);

      console.log('Test History Check:', {
        hasCompleted,
        bestScore,
        attemptCount,
        recentActivity
      });
    } catch (error) {
      console.error('Failed to check test history:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <div className="ml-4 text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Test History Integration Example</h1>
        <p className="text-gray-600">
          This example demonstrates how to integrate test history functionality with your existing test system.
        </p>
      </div>

      {/* Navigation */}
      <div className="mb-8">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveView('dashboard')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeView === 'dashboard'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FaChartLine className="inline mr-2" />
            Dashboard
          </button>
          <button
            onClick={() => setActiveView('example')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeView === 'example'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FaPlay className="inline mr-2" />
            Integration Example
          </button>
          <button
            onClick={() => setActiveView('history')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeView === 'history'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FaHistory className="inline mr-2" />
            Test History
          </button>
        </div>
      </div>

      {/* Dashboard View */}
      {activeView === 'dashboard' && (
        <TestHistoryDashboard />
      )}

      {/* Integration Example View */}
      {activeView === 'example' && (
        <div className="space-y-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Session Management</h2>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={startTestExample}
                  disabled={testSession}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Start Test Session
                </button>
                
                <button
                  onClick={submitTestExample}
                  disabled={!testSession}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Submit Test Results
                </button>
                
                <button
                  onClick={checkTestHistory}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Check History
                </button>
              </div>

              {testSession && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-medium text-green-800 mb-2">Active Test Session</h3>
                  <p className="text-green-700 text-sm">
                    Session ID: {testSession.id} | Test: {testSession.test_title}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Performance Metrics</h2>
            
            {performance ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {performance.totalTests}
                  </div>
                  <div className="text-sm text-gray-600">Total Tests</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {performance.averageScore}%
                  </div>
                  <div className="text-sm text-gray-600">Average Score</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-600 mb-2">
                    {performance.bestScore}%
                  </div>
                  <div className="text-sm text-gray-600">Best Score</div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No performance data available. Complete some tests to see metrics.
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Integration Code Example</h2>
            
            <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
              <pre className="text-green-400 text-sm">
{`// 1. Start a test session
const session = await testHistoryIntegration.startTestSession(testId);

// 2. Submit test results
const result = await testHistoryIntegration.submitTestResults(
  testId,
  answers,
  score,
  duration,
  detailedAnswers
);

// 3. Check test history
const hasCompleted = await testHistoryIntegration.hasCompletedTest(testId);
const bestScore = await testHistoryIntegration.getBestScoreForTest(testId);

// 4. Get performance metrics
const metrics = await testHistoryIntegration.getPerformanceMetrics();`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* History View */}
      {activeView === 'history' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Test History API</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Available Endpoints:</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• <code>GET /api/test-sessions/</code> - List all test sessions</li>
                <li>• <code>POST /api/test-sessions/</code> - Create new test session</li>
                <li>• <code>POST /api/test-sessions/submit/</code> - Submit test results</li>
                <li>• <code>GET /api/test-history/summary/</code> - Get performance summary</li>
                <li>• <code>GET /api/test-history/category-stats/</code> - Get category statistics</li>
                <li>• <code>GET /api/test-history/charts/</code> - Get chart data</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Database Schema:</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <pre className="text-sm text-gray-700">
{`TestSession:
- id (Primary Key)
- user (Foreign Key to User)
- test (Foreign Key to Test)
- status (not_started, in_progress, completed, abandoned)
- start_time (DateTime)
- end_time (DateTime)
- score (Integer - percentage)
- answers (JSONField)
- time_spent (Integer - seconds)

TestAnswer:
- id (Primary Key)
- session (Foreign Key to TestSession)
- question (Foreign Key to Question)
- selected_answer (CharField)
- is_correct (Boolean)
- time_taken (Integer - seconds)
- answered_at (DateTime)`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="font-medium text-red-800 mb-2">Error</h3>
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
};

export default TestHistoryExample;
