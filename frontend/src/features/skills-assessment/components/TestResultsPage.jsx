import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FaTrophy, FaRedo, FaClock, FaAward, FaMedal, FaStar, FaLightbulb, FaHistory, FaHome, FaBullseye } from 'react-icons/fa';
import { formatDuration } from '../lib/scoreUtils';
import { useAssessmentStore } from '../store/useAssessmentStore';
import { formatUniversalResults } from '../lib/universalScoringIntegration';
import TestHistoryModal from '../../test-history/components/TestHistoryModal';
import '../../candidate-dashboard/styles/dashboard-design-system.css';

const TestResultsPage = ({
  testResults,
  results, // From unified scoring system
  testType,
  testId,
  answers,
  onBackToDashboard,
  onRetakeTest,
  onBackToTestList,
  showUniversalResults = false,
  scoringSystem = null,
  testMeta = null // optional { title, description } from question fetch
}) => {
  const { addAttempt } = useAssessmentStore();
  const hasAddedAttempt = useRef(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  // Use results from unified scoring if available, otherwise fallback to legacy testResults
  const finalResults = results || testResults;

  useEffect(() => {
    // If we have results from unified scoring, make sure it's in the store (only once)
    if (results && results.attempt && !hasAddedAttempt.current) {
      addAttempt(results.attempt);
      hasAddedAttempt.current = true;
    }
  }, [results, addAttempt, testType, testId, answers, scoringSystem, showUniversalResults]);

  if (!finalResults) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">No results available</h2>
          <button
            onClick={onBackToDashboard}
            className="sa-btn sa-btn-primary"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Extract data from either unified results or legacy results
  const extractResultData = () => {
    if (results) {
      // From unified scoring system - handle both old and new field names
      // Check if results has the new backend structure
      if (results.percentage_score !== undefined) {
        return {
          testId: String(testId || results.test_id || 'unknown'),
          score: parseInt(results.correct_answers) || 0,
          totalQuestions: parseInt(results.total_questions) || 0,
          percentage: parseFloat(results.percentage_score) || 0,
          timeSpent: parseInt(results.time_spent) || 0,
          resultLabel: String(results.grade_letter || 'Completed'),
          isPassed: (parseFloat(results.percentage_score) || 0) >= 70
        };
      } else {
          // Legacy unified scoring format or compact backendSubmissionHelper shape
          // Normalize available fields from different possible shapes to avoid
          // accidentally parsing objects (e.g. results.score may be an object).
          const scoreValue = (typeof results.correctAnswers !== 'undefined')
            ? results.correctAnswers
            : (typeof results.correct !== 'undefined')
              ? results.correct
              : (results.score && typeof results.score.correct_answers !== 'undefined')
                ? results.score.correct_answers
                : undefined;

          const totalValue = (typeof results.totalQuestions !== 'undefined')
            ? results.totalQuestions
            : (typeof results.total !== 'undefined')
              ? results.total
              : (results.score && typeof results.score.total_questions !== 'undefined')
                ? results.score.total_questions
                : undefined;

          const percentageRaw = (typeof results.percentage !== 'undefined')
            ? results.percentage
            : (results.score && typeof results.score.percentage_score !== 'undefined')
              ? results.score.percentage_score
              : (typeof results.score === 'number' ? results.score : undefined);

          const timeRaw = (typeof results.duration !== 'undefined')
            ? results.duration
            : (results.attempt && typeof results.attempt.duration_seconds !== 'undefined')
              ? results.attempt.duration_seconds
              : (typeof results.duration_seconds !== 'undefined' ? results.duration_seconds : undefined);

          return {
            testId: String(testId || results.attempt?.test_id || 'unknown'),
            score: parseInt(scoreValue) || 0,
            totalQuestions: parseInt(totalValue) || 0,
            percentage: parseFloat(percentageRaw) || 0,
            timeSpent: parseInt(timeRaw) || 0,
            resultLabel: String(results.resultLabel || results.attempt?.result_label || 'Completed'),
            isPassed: (parseFloat(percentageRaw) || 0) >= 70
          };
        }
    } else {
      // Legacy format
      return {
        testId: String(finalResults.testId || testId || 'unknown'),
        score: parseInt(finalResults.score) || 0,
        totalQuestions: parseInt(finalResults.totalQuestions) || 0,
        percentage: parseFloat(finalResults.percentage) || 0,
        timeSpent: parseInt(finalResults.timeSpent) || 0,
        resultLabel: String(finalResults.resultLabel || 'Completed'),
        isPassed: finalResults.isPassed || (parseFloat(finalResults.percentage) || 0) >= 70
      };
    }
  };

  const resultData = extractResultData();
  console.log('🔍 TestResultsPage - Results object:', results);
  console.log('🔍 TestResultsPage - Extracted data:', resultData);
  
  // Safety check: ensure all values are primitives, not objects
  const safeResultData = {
    testId: String(resultData.testId),
    score: parseInt(resultData.score) || 0,
    totalQuestions: parseInt(resultData.totalQuestions) || 0,
    // If backend didn't provide a percentage but we have score/total, compute it
    percentage: (function() {
      const p = parseFloat(resultData.percentage);
      if (!isNaN(p) && p > 0) return p;
      const s = parseInt(resultData.score);
      const t = parseInt(resultData.totalQuestions);
      if (!isNaN(s) && !isNaN(t) && t > 0) return Math.round((s / t) * 100);
      return 0;
    })(),
    timeSpent: parseInt(resultData.timeSpent) || 0,
    resultLabel: String(resultData.resultLabel),
    isPassed: Boolean(resultData.isPassed)
  };
  
  const getTestTitle = (testId) => {
    const titleMap = {
      'NRT': 'Numerical Reasoning',
      'VRT': 'Verbal Reasoning',
      'LRT': 'Logical Reasoning',
      'ART': 'Abstract Reasoning',
      'DRT': 'Diagrammatic Reasoning',
      'SRT': 'Spatial Reasoning',
      'SJT': 'Situational Judgment',
      'TAT': 'Technical Assessment'
    };

    if (testId === 'LRT2') {
      return 'Advanced Number Series';
    }

    const testPrefix = testId.substring(0, 3);
    const baseTitle = titleMap[testPrefix] || 'Assessment';
    return `${testId} - ${baseTitle}`;
  };

  const getTestCategory = (testId) => {
    const categoryMap = {
      'NRT': 'cognitive',
      'VRT': 'cognitive',
      'LRT': 'cognitive',
      'ART': 'cognitive',
      'DRT': 'cognitive',
      'SRT': 'cognitive',
      'SJT': 'behavioral',
      'TAT': 'technical'
    };

    const testPrefix = testId.substring(0, 3);
    return categoryMap[testPrefix] || 'cognitive';
  };

  const getPerformanceBadge = (percentage) => {
    if (percentage >= 90) {
      return { icon: <FaTrophy className="text-yellow-500" />, label: 'Expert', color: 'text-yellow-600' };
    } else if (percentage >= 75) {
      return { icon: <FaMedal className="text-blue-500" />, label: 'Advanced', color: 'text-blue-600' };
    } else if (percentage >= 60) {
      return { icon: <FaAward className="text-green-500" />, label: 'Intermediate', color: 'text-green-600' };
    } else {
      return { icon: <FaStar className="text-gray-500" />, label: 'Novice', color: 'text-gray-600' };
    }
  };



  const getAverageTimePerQuestion = () => {
    if (safeResultData.timeSpent > 0 && safeResultData.totalQuestions > 0) {
      return Math.round(safeResultData.timeSpent / safeResultData.totalQuestions);
    }
    return null;
  };

  const getImprovementSuggestion = (percentage, testId) => {
    const testPrefix = testId.substring(0, 3);
    const suggestions = {
      'NRT': 'Focus on mathematical calculations and data interpretation exercises',
      'VRT': 'Practice reading comprehension and vocabulary building',
      'LRT': 'Work on pattern recognition and logical sequence problems',
      'ART': 'Develop abstract thinking through visual pattern exercises',
      'DRT': 'Practice flowchart analysis and process understanding',
      'SRT': 'Enhance spatial visualization with 3D rotation exercises',
      'SJT': 'Study workplace scenarios and decision-making frameworks',
      'TAT': 'Review technical concepts and hands-on practice'
    };

    if (percentage >= 75) {
      return 'Excellent performance! Consider taking advanced assessments to further challenge yourself.';
    }

    return suggestions[testPrefix] || 'Review the test material and practice similar questions to improve your score.';
  };



  const getScoreColor = (score) => {
    if (score >= 75) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score) => {
    if (score >= 75) return 'bg-green-50 border-green-200';
    if (score >= 60) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  const handleViewHistory = () => {
    // Open test history modal
    setIsHistoryModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sa-container py-6">
        {/* Top breadcrumb / test header area */}
        <div className="mb-4 flex items-start justify-between">
          <div>
            <button
              onClick={() => { if (onBackToDashboard) onBackToDashboard(); else window.location.href = '/dashboard'; }}
              className="text-sm text-gray-600 hover:underline"
            >
              Back to Assessment Dashboard
            </button>

            {testMeta?.title || safeResultData.testId ? (
              <div className="mt-2">
                <div className="text-sm text-gray-500">{testMeta?.title || safeResultData.testId}</div>
                {testMeta?.description && <div className="text-sm text-gray-600">{testMeta.description}</div>}
              </div>
            ) : null}
          </div>
        </div>
        {/* Header - Removed back button and date as they exist in Quick Actions */}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Score Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <div className="sa-card h-full">
              {/* Header */}
              <div className="text-center mb-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="relative">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center ${getScoreBgColor(safeResultData.percentage)} border-2`}>
                      <FaTrophy className={`w-8 h-8 ${getScoreColor(safeResultData.percentage)}`} />
                    </div>
                  </div>
                </div>

                <h1 className="sa-heading-1 mb-2">Test Completed</h1>
                <p className="text-gray-600 mb-4">{getTestTitle(safeResultData.testId)}</p>

                {/* Score Display */}
                <div className={`inline-block px-6 py-3 rounded-xl border-2 ${getScoreBgColor(safeResultData.percentage)}`}>
                  <div className="text-center">
                    <div className={`text-4xl font-bold ${getScoreColor(safeResultData.percentage)} mb-1`}>
                      {safeResultData.percentage}%
                    </div>
                    <div className="text-sm text-gray-600">
                      {safeResultData.score}/{safeResultData.totalQuestions} questions correct
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <FaClock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <div className="font-semibold text-gray-900">{formatDuration(safeResultData.timeSpent)}</div>
                  <div className="text-sm text-gray-600">Time Spent</div>
                </div>

                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <FaBullseye className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <div className="font-semibold text-gray-900">{getAverageTimePerQuestion() || 'N/A'}s</div>
                  <div className="text-sm text-gray-600">Avg per Question</div>
                </div>
              </div>

              {/* Performance Level */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-50 rounded-full">
                  {getPerformanceBadge(safeResultData.percentage).icon}
                  <span className={`font-medium ${getPerformanceBadge(safeResultData.percentage).color}`}>
                    {getPerformanceBadge(safeResultData.percentage).label} Level
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Actions & Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Quick Actions Card */}
            <div className="sa-card">
              <div className="sa-card-header">
                <h3 className="sa-heading-2">Quick Actions</h3>
              </div>
              <div className="space-y-3">
                <button
                  onClick={handleViewHistory}
                  className="w-full sa-btn sa-btn-secondary flex items-center justify-center"
                >
                  <FaHistory className="w-4 h-4 mr-2" />
                  View Test History
                </button>

                {onRetakeTest && (
                  <button
                    onClick={() => {
                      try {
                        onRetakeTest();
                      } catch (error) {
                        console.error('Error retaking test:', error);
                      }
                    }}
                    className="w-full sa-btn sa-btn-primary flex items-center justify-center"
                  >
                    <FaRedo className="w-4 h-4 mr-2" />
                    Retake Test
                  </button>
                )}

                <button
                  onClick={() => {
                    try {
                      if (onBackToDashboard) {
                        onBackToDashboard();
                      } else {
                        // Fallback navigation
                        window.location.href = '/dashboard';
                      }
                    } catch (error) {
                      console.error('Error navigating to dashboard:', error);
                      window.location.href = '/dashboard';
                    }
                  }}
                  className="w-full sa-btn sa-btn-ghost flex items-center justify-center"
                >
                  <FaHome className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </button>
              </div>
            </div>

            {/* Performance Insights Card */}
            <div className="sa-card">
              <div className="sa-card-header">
                <h3 className="sa-heading-2">Performance Insights</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Accuracy</span>
                  <span className="font-semibold">{Math.round((safeResultData.score / safeResultData.totalQuestions) * 100)}%</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Category</span>
                  <span className="font-semibold capitalize">{getTestCategory(safeResultData.testId)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Status</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    safeResultData.isPassed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {safeResultData.isPassed ? 'PASSED' : 'NEEDS IMPROVEMENT'}
                  </span>
                </div>
              </div>
            </div>

            {/* Improvement Tips Card */}
            <div className="sa-card">
              <div className="sa-card-header">
                <h3 className="sa-heading-2 flex items-center">
                  <FaLightbulb className="w-5 h-5 mr-2 text-yellow-500" />
                  Next Steps
                </h3>
              </div>
              <div className="text-sm text-gray-600 leading-relaxed">
                {getImprovementSuggestion(safeResultData.percentage, safeResultData.testId)}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Test History Modal */}
      <TestHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
      />
    </div>
  );
};
export default TestResultsPage;
