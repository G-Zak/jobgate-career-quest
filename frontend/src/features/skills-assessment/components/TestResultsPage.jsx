import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaTrophy, FaRedo, FaArrowLeft, FaClock, FaChartLine } from 'react-icons/fa';
import { formatDuration, getPerformanceLevel } from '../lib/scoreUtils';
import { useAssessmentStore } from '../store/useAssessmentStore';

const TestResultsPage = ({ 
  testResults, 
  results, // From unified scoring system
  testType,
  testId,
  answers,
  testData,
  onBackToDashboard, 
  onRetakeTest 
}) => {
  const { addAttempt } = useAssessmentStore();
  const hasAddedAttempt = useRef(false);

  // Use results from unified scoring if available, otherwise fallback to legacy testResults
  const finalResults = results || testResults;

  useEffect(() => {
    // If we have results from unified scoring, make sure it's in the store (only once)
    if (results && results.attempt && !hasAddedAttempt.current) {
      addAttempt(results.attempt);
      hasAddedAttempt.current = true;
    }
  }, [results, addAttempt]);

  if (!finalResults) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">No results available</h2>
          <button
            onClick={onBackToDashboard}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
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
      // From unified scoring system
      return {
        testId: testId || results.attempt?.test_id || 'unknown',
        score: results.correct || 0,
        totalQuestions: results.total || 0,
        percentage: results.percentage || 0,
        timeSpent: results.attempt?.duration_seconds || 0,
        resultLabel: results.resultLabel || results.attempt?.result_label || 'Completed',
        isPassed: results.percentage >= 70
      };
    } else {
      // Legacy format
      return {
        testId: finalResults.testId || testId || 'unknown',
        score: finalResults.score || 0,
        totalQuestions: finalResults.totalQuestions || 0,
        percentage: finalResults.percentage || 0,
        timeSpent: finalResults.timeSpent || 0,
        resultLabel: finalResults.resultLabel || 'Completed',
        isPassed: finalResults.isPassed || finalResults.percentage >= 70
      };
    }
  };

  const resultData = extractResultData();
  const performanceLevel = getPerformanceLevel(resultData.percentage);

  const getResultStatus = () => {
    // Use performanceLevel from scoreUtils for consistent labeling
    return {
      icon: <FaCheckCircle className="text-green-600" />,
      text: performanceLevel.label,
      color: performanceLevel.color,
      bgColor: performanceLevel.bgColor,
      borderColor: performanceLevel.borderColor
    };
  };

  const resultStatus = getResultStatus();

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

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl w-full bg-white rounded-lg shadow-lg overflow-hidden"
      >
        {/* Header with result icon */}
        <div className="text-center py-8 px-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="mb-6"
          >
            <div className={`inline-flex items-center justify-center w-16 h-16 ${resultStatus.bgColor} ${resultStatus.borderColor} border-2 rounded-full`}>
              <div className="text-3xl">
                {resultStatus.icon}
              </div>
            </div>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-3xl font-bold text-gray-900 mb-2"
          >
            Test Complete!
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-gray-600"
          >
            {getTestTitle(resultData.testId)} Results
          </motion.p>
        </div>

        {/* Results Cards */}
        <div className="grid grid-cols-3 gap-6 px-8 pb-8">
          {/* Score */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center p-6 bg-blue-50 rounded-lg"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Score</h3>
            <p className="text-3xl font-bold text-blue-600">
              {resultData.score}/{resultData.totalQuestions}
            </p>
          </motion.div>

          {/* Percentage */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-center p-6 bg-green-50 rounded-lg"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Percentage</h3>
            <p className="text-3xl font-bold text-green-600">
              {resultData.percentage}%
            </p>
          </motion.div>

          {/* Result */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className={`text-center p-6 ${resultStatus.bgColor} rounded-lg`}
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Result</h3>
            <p className={`text-2xl font-bold ${resultStatus.color}`}>
              {resultStatus.text}
            </p>
          </motion.div>
        </div>

        {/* Time Spent (if available) */}
        {resultData.timeSpent > 0 && (
          <div className="px-8 pb-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85 }}
              className="text-center p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center justify-center mb-2">
                <FaClock className="text-gray-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-800">Time Taken</h3>
              </div>
              <p className="text-xl font-bold text-gray-700">
                {formatDuration(resultData.timeSpent)}
              </p>
            </motion.div>
          </div>
        )}

        {/* Performance Message */}
        {resultData.isPassed ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mx-8 mb-6 p-4 bg-green-50 border border-green-200 rounded-lg"
          >
            <div className="flex items-center">
              <FaTrophy className="text-green-600 mr-3" />
              <div>
                <h4 className="font-semibold text-green-800">Congratulations!</h4>
                <p className="text-green-700 text-sm">You have successfully passed this assessment.</p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mx-8 mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
          >
            <div className="flex items-center">
              <FaRedo className="text-yellow-600 mr-3" />
              <div>
                <h4 className="font-semibold text-yellow-800">Keep practicing!</h4>
                <p className="text-yellow-700 text-sm">Review the material and try again when you're ready.</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="text-center p-8 bg-gray-50 border-t border-gray-200"
        >
          <div className="flex justify-center gap-4">
            <button
              onClick={onBackToDashboard}
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              <FaArrowLeft className="w-4 h-4 mr-2" />
              Back to Assessment Dashboard
            </button>
            {onRetakeTest && (
              <button
                onClick={() => onRetakeTest(resultData.testId)}
                className="flex items-center px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors font-medium"
              >
                <FaRedo className="w-4 h-4 mr-2" />
                Retake Test
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default TestResultsPage;
