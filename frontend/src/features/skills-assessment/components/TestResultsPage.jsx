import React from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaTimesCircle, FaTrophy, FaRedo } from 'react-icons/fa';

const TestResultsPage = ({ testResults, onBackToDashboard, onRetakeTest }) => {
  if (!testResults) {
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

  const { testId, score, totalQuestions, percentage, isPassed, timeSpent } = testResults;

  const getResultStatus = () => {
    if (isPassed) {
      return {
        icon: <FaCheckCircle className="text-green-600" />,
        text: 'PASSED',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200'
      };
    } else {
      return {
        icon: <FaTimesCircle className="text-red-600" />,
        text: 'FAILED', 
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200'
      };
    }
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
            {getTestTitle(testId)} Results
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
              {score}/{totalQuestions}
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
              {percentage}%
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

        {/* Performance Message */}
        {isPassed ? (
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

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="text-center p-8 bg-gray-50 border-t border-gray-200"
        >
          <div className="flex justify-center gap-4">
            <button
              onClick={onBackToDashboard}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              Back to Dashboard
            </button>
            {onRetakeTest && (
              <button
                onClick={() => onRetakeTest(testId)}
                className="px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors font-medium"
              >
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
