import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaTrophy, FaRedo, FaArrowLeft, FaClock, FaChartLine, FaBrain, FaStar, FaAward, FaMedal } from 'react-icons/fa';
import { formatDuration, getPerformanceLevel } from '../lib/scoreUtils';
import { useAssessmentStore } from '../store/useAssessmentStore';
import { formatUniversalResults } from '../lib/universalScoringIntegration';

const TestResultsPage = ({
  testResults,
  results, // From unified scoring system
  testType,
  testId,
  answers,
  testData,
  onBackToDashboard,
  onRetakeTest,
  showUniversalResults = false,
  scoringSystem = null
}) => {
  const { addAttempt } = useAssessmentStore();

  // Use results from unified scoring if available, otherwise fallback to legacy testResults
  const finalResults = results || testResults;

  useEffect(() => {
    // Console logging for backend scoring verification
    console.group('🎯 Test Results - Backend Scoring Verification');
    console.log('📊 Final Results:', finalResults);
    console.log('🔧 Test Type:', testType);
    console.log('🆔 Test ID:', testId);
    console.log('📝 Answers:', answers);
    console.log('⚙️ Scoring System:', scoringSystem);
    console.log('🌐 Show Universal Results:', showUniversalResults);

    if (scoringSystem) {
      console.log('📈 Universal Scoring Results:', scoringSystem.getResults());
      console.log('⏱️ Question Timings:', scoringSystem.getQuestionTimings());
      console.log('🎯 Score Breakdown:', scoringSystem.getScoreBreakdown());
    }

    if (results) {
      console.log('✅ Universal Results Available:', results);
      console.log('📊 Score Details:', {
        correct: results.correct,
        total: results.total,
        percentage: results.percentage,
        resultLabel: results.resultLabel
      });
    }

    console.groupEnd();

    // If we have results from unified scoring, make sure it's in the store
    if (results && results.attempt) {
      addAttempt(results.attempt);
    }
  }, [results, addAttempt, testType, testId, answers, scoringSystem, showUniversalResults]);

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
      const universalData = {
        testId: testId || results.attempt?.test_id || 'unknown',
        score: results.correct || 0,
        totalQuestions: results.total || 0,
        percentage: results.percentage || 0,
        timeSpent: results.attempt?.duration_seconds || 0,
        resultLabel: results.resultLabel || results.attempt?.result_label || 'Completed',
        isPassed: results.percentage >= 70,
        // Universal scoring specific data
        universalScoring: true,
        scoreBreakdown: results.scoreBreakdown || null,
        difficultyBreakdown: results.difficultyBreakdown || null,
        timeEfficiency: results.timeEfficiency || null,
        averageTimePerQuestion: results.averageTimePerQuestion || null,
        performanceLevel: results.performanceLevel || null
      };

      // Log universal scoring details
      console.log('🎯 Universal Scoring Data:', universalData);

      return universalData;
    } else {
      // Legacy format
      return {
        testId: finalResults.testId || testId || 'unknown',
        score: finalResults.score || 0,
        totalQuestions: finalResults.totalQuestions || 0,
        percentage: finalResults.percentage || 0,
        timeSpent: finalResults.timeSpent || 0,
        resultLabel: finalResults.resultLabel || 'Completed',
        isPassed: finalResults.isPassed || finalResults.percentage >= 70,
        universalScoring: false
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
        <div className={`grid gap-6 px-8 pb-8 ${resultData.universalScoring ? 'grid-cols-2' : 'grid-cols-3'}`}>
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
            {resultData.universalScoring && resultData.scoreBreakdown && (
              <p className="text-sm text-blue-500 mt-1">
                +{resultData.scoreBreakdown.difficultyBonus || 0} difficulty bonus
              </p>
            )}
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
            {resultData.universalScoring && resultData.timeEfficiency && (
              <p className="text-sm text-green-500 mt-1">
                {resultData.timeEfficiency}% time efficiency
              </p>
            )}
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
            {resultData.universalScoring && resultData.performanceLevel && (
              <p className="text-sm text-gray-600 mt-1">
                {resultData.performanceLevel}
              </p>
            )}
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

        {/* Universal Scoring Details */}
        {resultData.universalScoring && (resultData.difficultyBreakdown || resultData.averageTimePerQuestion) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.85 }}
            className="mx-8 mb-6 p-6 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg"
          >
            <div className="flex items-center mb-4">
              <FaBrain className="text-purple-600 mr-3" />
              <h4 className="font-semibold text-purple-800">Advanced Scoring Analysis</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resultData.difficultyBreakdown && (
                <div className="bg-white p-4 rounded-lg">
                  <h5 className="font-medium text-gray-800 mb-2 flex items-center">
                    <FaStar className="text-yellow-500 mr-2" />
                    Difficulty Performance
                  </h5>
                  <div className="space-y-1">
                    {Object.entries(resultData.difficultyBreakdown).map(([level, count]) => (
                      <div key={level} className="flex justify-between text-sm">
                        <span className="text-gray-600">Level {level}:</span>
                        <span className="font-medium">{count} questions</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {resultData.averageTimePerQuestion && (
                <div className="bg-white p-4 rounded-lg">
                  <h5 className="font-medium text-gray-800 mb-2 flex items-center">
                    <FaClock className="text-blue-500 mr-2" />
                    Time Analysis
                  </h5>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Avg per question:</span>
                      <span className="font-medium">{Math.round(resultData.averageTimePerQuestion)}s</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total time:</span>
                      <span className="font-medium">{formatDuration(resultData.timeSpent)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
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
