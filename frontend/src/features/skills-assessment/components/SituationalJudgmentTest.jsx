import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaClock, FaFlag, FaCheckCircle, FaTimesCircle, FaStop, FaArrowRight, FaSearchPlus, FaLayerGroup, FaImage, FaPause, FaPlay, FaTimes, FaUsers, FaLightbulb, FaBalanceScale, FaExclamationTriangle } from 'react-icons/fa';
import { useScrollToTop, useTestScrollToTop, useQuestionScrollToTop, scrollToTop } from '../../../shared/utils/scrollUtils';
import TestResultsPage from './TestResultsPage';

const SituationalJudgmentTest = ({ onBackToDashboard, testId = 1 }) => {
  const [testStep, setTestStep] = useState('test'); // Skip instructions - start directly with test
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(25 * 60); // 25 minutes for situational judgment
  const [answers, setAnswers] = useState({});
  const [testData, setTestData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [loadError, setLoadError] = useState(null);

  // Universal scroll management using scroll utilities
  useScrollToTop([], { smooth: true }); // Scroll on component mount
  useTestScrollToTop(testStep, 'situational-test-scroll', { smooth: true, attempts: 5 }); // Scroll on test step changes
  useQuestionScrollToTop(currentQuestion, testStep, 'situational-test-scroll'); // Scroll on question changes

  // Function to load test data
  const loadTestData = async () => {
    try {
      setLoading(true);
      setLoadError(null);

      // Dynamically import the generator
      const mod = await import('../utils/masterSJTGenerator');
      const maybeDefault = mod?.default;
      const maybeFunc = mod?.generateTest;

      let generatorInstance = null;
      let testResult = null;

      if (typeof maybeDefault === 'function') {
        generatorInstance = new maybeDefault();
        testResult = generatorInstance.generateTest('test-user', { questionCount: 20 });
      } else if (maybeDefault && typeof maybeDefault.generateTest === 'function') {
        testResult = maybeDefault.generateTest('test-user', { questionCount: 20 });
      } else if (typeof maybeFunc === 'function') {
        testResult = maybeFunc('test-user', { questionCount: 20 });
      } else {
        throw new Error('masterSJTGenerator has no usable export');
      }

      if (!testResult || !Array.isArray(testResult.questions) || testResult.questions.length === 0) {
        throw new Error('SJT generator returned no questions');
      }

      setTestData(testResult.questions);
    } catch (error) {
      console.error('Error loading SJT data:', error);
      setTestData([]);
      setLoadError(error?.message || String(error));
    } finally {
      setLoading(false);
    }
  };

  // Load test data
  useEffect(() => {
    loadTestData();
  }, []);

  // Timer countdown
  useEffect(() => {
    if (testStep === 'test' && timeRemaining > 0 && !isPaused) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleFinishTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [testStep, timeRemaining, isPaused]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleStartTest = () => {
    setTestStep('test');
    
    // Use scroll utility for immediate scroll on test start
    setTimeout(() => {
      scrollToTop({
        container: 'situational-test-scroll',
        forceImmediate: true,
        attempts: 3,
        delay: 50
      });
    }, 100);
  };

  const handleAnswerSelect = (questionIndex, choiceIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: choiceIndex
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestion < testData.length) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      handleFinishTest();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleFinishTest = () => {
    setTestStep('results');
  };

  const handlePauseToggle = () => {
    if (isPaused) {
      setIsPaused(false);
      setShowPauseModal(false);
    } else {
      setIsPaused(true);
      setShowPauseModal(true);
    }
  };

  const handleResumeTest = () => {
    setIsPaused(false);
    setShowPauseModal(false);
  };

  const handleExitTest = () => {
    setShowExitModal(true);
  };

  const confirmExitTest = () => {
    onBackToDashboard();
  };

  const cancelExitTest = () => {
    setShowExitModal(false);
  };

  const handleAbortTest = () => {
    if (window.confirm("Are you sure you want to abort this test? Your progress will be lost.")) {
      onBackToDashboard();
    }
  };

  const getCurrentQuestion = () => {
    return testData[currentQuestion - 1];
  };

  const getTotalAnswered = () => {
    return Object.keys(answers).length;
  };

  const getTotalQuestions = () => {
    return testData.length;
  };

  const getDomainIcon = (domain) => {
    const iconMap = {
      teamwork: <FaUsers className="text-blue-500" />,
      leadership: <FaLightbulb className="text-purple-500" />,
      communication: <FaExclamationTriangle className="text-green-500" />,
      customer_service: <FaCheckCircle className="text-orange-500" />,
      ethics: <FaBalanceScale className="text-red-500" />,
      inclusivity: <FaUsers className="text-pink-500" />,
      conflict: <FaExclamationTriangle className="text-yellow-500" />,
      safety: <FaExclamationTriangle className="text-red-600" />
    };
    return iconMap[domain] || <FaLightbulb className="text-gray-500" />;
  };

  const getDifficultyColor = (difficulty) => {
    const colorMap = {
      easy: 'text-green-600 bg-green-100',
      medium: 'text-yellow-600 bg-yellow-100',
      hard: 'text-red-600 bg-red-100'
    };
    return colorMap[difficulty] || 'text-gray-600 bg-gray-100';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-blue-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-32 w-32 border-4 border-green-200 border-t-green-600 mx-auto mb-8"></div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Loading Situational Judgment Test</h3>
          <p className="text-gray-600">Preparing your assessment...</p>
        </motion.div>
      </div>
    );
  }

  if (loadError || !testData.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-blue-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaTimesCircle className="w-12 h-12 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Test Unavailable</h2>
          <p className="text-gray-600 mb-8">{loadError || 'Unable to load the test data. Please try again later.'}</p>
          <button
            onClick={onBackToDashboard}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-colors font-medium"
          >
            Back to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  // Results step - delegate to TestResultsPage
  if (testStep === 'results') {
    if (!testData.length) return null;

    let correctCount = 0;
    testData.forEach((question, index) => {
      if (answers[index] === question.answer_index) {
        correctCount++;
      }
    });

    const results = {
      testType: 'Situational Judgment',
      totalQuestions: testData.length,
      answeredQuestions: Object.keys(answers).length,
      correctAnswers: correctCount,
      score: Math.round((correctCount / testData.length) * 100),
      timeSpent: (25 * 60) - timeRemaining, // 25 minutes base time
      timeTaken: formatTime((25 * 60) - timeRemaining),
      totalTime: formatTime(25 * 60),
      answers: answers,
      correctAnswersList: testData.reduce((acc, question, index) => {
        acc[index] = question.answer_index;
        return acc;
      }, {}),
      complexity: 'Medium',
      averageComplexity: testData.reduce((sum, q) => {
        const difficultyScore = q.difficulty === 'easy' ? 2 : q.difficulty === 'medium' ? 3 : 4;
        return sum + difficultyScore;
      }, 0) / testData.length
    };

    return (
      <TestResultsPage
        results={results}
        onBackToDashboard={onBackToDashboard}
        testQuestions={testData}
        gradientClass="from-green-50 via-teal-50 to-blue-50"
        primaryColor="green"
        testIcon={FaUsers}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-blue-50">
      {/* Unified Modern Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-white/20 shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handleExitTest}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-white/50 rounded-lg transition-all duration-200"
            >
              <FaTimes className="w-4 h-4" />
              <span className="font-medium">Exit Test</span>
            </button>

            <div className="flex items-center gap-8">
              <div className="text-center">
                <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                  Situational Judgment Test
                </div>
                <div className="text-sm text-gray-600">
                  Question {currentQuestion} of {getTotalQuestions()}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-gray-500">Time Remaining</div>
                <div className={`text-xl font-bold font-mono ${timeRemaining <= 300 ? 'text-red-500' : 'text-green-600'}`}>
                  {formatTime(timeRemaining)}
                </div>
              </div>
              <button
                onClick={handlePauseToggle}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {isPaused ? <FaPlay className="w-4 h-4" /> : <FaPause className="w-4 h-4" />}
                <span className="font-medium">{isPaused ? 'Resume' : 'Pause'}</span>
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {testStep === 'test' && (
          <div className="flex flex-col gap-6">
            {/* Section Info & Progress Card */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-8 border border-white/20"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <FaUsers className="text-green-600" />
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      Workplace Scenarios
                    </h2>
                    <p className="text-gray-600 mt-1">
                      Evaluate situations and choose the best course of action
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Progress</div>
                  <div className="text-2xl font-bold text-green-600">
                    {currentQuestion}/{getTotalQuestions()}
                  </div>
                </div>
              </div>

              {/* Enhanced Progress Bar */}
              <div className="relative">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Progress</span>
                  <span>{Math.round((currentQuestion / getTotalQuestions()) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-green-500 to-teal-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(currentQuestion / getTotalQuestions()) * 100}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Start</span>
                  <span>Complete</span>
                </div>
              </div>
            </motion.section>

            {/* Question Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion}
                className="bg-white rounded-2xl shadow-lg border border-white/20 overflow-hidden"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="p-8">
                  {/* Question Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {currentQuestion}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">Workplace Scenario</h3>
                        <p className="text-gray-600">Choose the best response</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {getCurrentQuestion()?.domain && (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          {getDomainIcon(getCurrentQuestion().domain)}
                          <span className="capitalize">{getCurrentQuestion().domain.replace('_', ' ')}</span>
                        </div>
                      )}
                      {getCurrentQuestion()?.difficulty && (
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(getCurrentQuestion().difficulty)}`}>
                          {getCurrentQuestion().difficulty.toUpperCase()}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Question Content */}
                  {getCurrentQuestion()?.question && (
                    <div className="mb-8 p-6 bg-gray-50 rounded-xl">
                      <h4 className="text-lg font-semibold text-gray-800 mb-4">Situation:</h4>
                      <p className="text-gray-700 leading-relaxed">{getCurrentQuestion().question}</p>
                    </div>
                  )}

                  {/* Answer Options */}
                  <div className="mb-8">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <FaSearchPlus className="mr-2 text-green-600" />
                      What would you do?
                    </h4>
                    <div className="space-y-4">
                      {getCurrentQuestion()?.choices?.map((choice, index) => (
                        <motion.button
                          key={index}
                          onClick={() => handleAnswerSelect(currentQuestion - 1, index)}
                          className={`w-full p-6 text-left rounded-xl border-2 transition-all duration-200 ${
                            answers[currentQuestion - 1] === index
                              ? 'border-green-500 bg-green-50 shadow-lg'
                              : 'border-gray-200 hover:border-green-300 bg-white hover:shadow-md'
                          }`}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                        >
                          <div className="flex items-start gap-4">
                            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold ${
                              answers[currentQuestion - 1] === index
                                ? 'bg-green-500 border-green-500 text-white'
                                : 'border-gray-300 text-gray-500'
                            }`}>
                              {String.fromCharCode(65 + index)}
                            </div>
                            <p className={`text-gray-700 leading-relaxed ${
                              answers[currentQuestion - 1] === index ? 'text-gray-800 font-medium' : ''
                            }`}>
                              {choice}
                            </p>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Navigation */}
                  <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                    <motion.button
                      onClick={handlePreviousQuestion}
                      disabled={currentQuestion === 1}
                      className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-200 ${
                        currentQuestion === 1
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:shadow-md'
                      }`}
                      whileHover={currentQuestion > 1 ? { scale: 1.02 } : {}}
                      whileTap={currentQuestion > 1 ? { scale: 0.98 } : {}}
                    >
                      <span>← Previous</span>
                    </motion.button>

                    <div className="text-center">
                      <p className={`text-sm font-medium ${
                        answers[currentQuestion - 1] !== undefined ? 'text-green-600' : 'text-gray-500'
                      }`}>
                        {answers[currentQuestion - 1] !== undefined ? '✓ Answer selected' : 'Select an answer to continue'}
                      </p>
                    </div>

                    <motion.button
                      onClick={handleNextQuestion}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl hover:from-green-600 hover:to-teal-600 transition-all duration-200 shadow-lg"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span>{currentQuestion === getTotalQuestions() ? 'Complete Test' : 'Next Question'}</span>
                      <FaArrowRight />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Pause Modal */}
      <AnimatePresence>
        {showPauseModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <FaPause className="text-yellow-600 text-2xl mr-3" />
                  <h3 className="text-xl font-bold text-gray-900">Test Paused</h3>
                </div>
                <p className="text-gray-600 mb-6">
                  Your test is currently paused. The timer has stopped. Click resume when you're ready to continue.
                </p>
                <div className="flex space-x-3">
                  <motion.button
                    onClick={handleResumeTest}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FaPlay />
                    <span>Resume Test</span>
                  </motion.button>
                  <motion.button
                    onClick={() => setShowExitModal(true)}
                    className="px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Exit Test
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Exit Confirmation Modal */}
      <AnimatePresence>
        {showExitModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <FaTimes className="text-red-600 text-2xl mr-3" />
                  <h3 className="text-xl font-bold text-gray-900">Exit Test?</h3>
                </div>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to exit the test? All your progress will be lost and you'll return to the dashboard.
                </p>
                <div className="flex space-x-3">
                  <motion.button
                    onClick={cancelExitTest}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={confirmExitTest}
                    className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Exit Test
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SituationalJudgmentTest;
