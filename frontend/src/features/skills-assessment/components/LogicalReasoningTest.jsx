import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaClock, FaBrain, FaCheckCircle, FaTimesCircle, FaStop, FaArrowRight, FaFlag, FaCog, FaSearch, FaLightbulb, FaPuzzlePiece, FaPause, FaPlay, FaTimes } from 'react-icons/fa';
import { useScrollToTop, useTestScrollToTop, useQuestionScrollToTop, scrollToTop } from '../../../shared/utils/scrollUtils';
import { getLogicalTestSections } from '../data/logicalTestSections';
import { submitTestAttempt } from '../lib/submitHelper';
import TestResultsPage from './TestResultsPage';

const LogicalReasoningTest = ({ onBackToDashboard }) => {
  const [testStep, setTestStep] = useState('test'); // Skip instructions - start directly with test
  const [currentSection, setCurrentSection] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(10 * 60); // 10 minutes per section
  const [answers, setAnswers] = useState({});
  const [testData, setTestData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [startedAt, setStartedAt] = useState(null);
  const [results, setResults] = useState(null);

  // Universal scroll management using scroll utilities
  useScrollToTop([], { smooth: true }); // Scroll on component mount
  useTestScrollToTop(testStep, 'logical-test-scroll', { smooth: true, attempts: 5 }); // Scroll on test step changes
  useQuestionScrollToTop(currentQuestion, testStep, 'logical-test-scroll'); // Scroll on question changes

  // Load test data
  useEffect(() => {
    try {
      setLoading(true);
      const data = getLogicalTestSections();
      setTestData(data);
      setTimeRemaining(10 * 60); // 10 minutes per section
      setStartedAt(new Date());
    } catch (error) {
      console.error('Error loading test data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Timer countdown
  useEffect(() => {
    if (testStep === 'test' && timeRemaining > 0 && !isPaused) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleNextSection();
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
        container: 'logical-test-scroll',
        forceImmediate: true,
        attempts: 3,
        delay: 50
      });
    }, 100);
  };

  const handleAnswerSelect = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNextQuestion = () => {
    const currentSectionData = getCurrentSection();
    if (currentQuestion < currentSectionData.questions.length) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      handleNextSection();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleNextSection = () => {
    if (currentSection < testData.sections.length) {
      setCurrentSection(prev => prev + 1);
      setCurrentQuestion(1);
      setTimeRemaining(10 * 60); // Reset timer for next section
    } else {
      handleFinishTest();
    }
  };

  const handleFinishTest = async () => {
    try {
      // Submit the test using unified scoring
      const result = await submitTestAttempt({
        testId: 'LRT',
        testVersion: '1.0',
        language: 'en',
        answers,
        testData,
        startedAt
      });
      
      setResults(result);
      setTestStep('results');
    } catch (error) {
      console.error('Error submitting test:', error);
      setTestStep('results'); // Still show results even if submission fails
    }
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

  const getCurrentSection = () => {
    return testData?.sections?.find(s => s.id === currentSection);
  };

  const getCurrentQuestion = () => {
    const section = getCurrentSection();
    return section?.questions?.find((q, index) => index + 1 === currentQuestion);
  };

  const getSectionIcon = (sectionId) => {
    switch (sectionId) {
      case 1:
        return <FaSearch className="text-blue-600" />; // Number series pattern recognition
      case 2:
        return <FaBrain className="text-green-600" />;
      case 3:
        return <FaLightbulb className="text-yellow-600" />;
      case 4:
        return <FaPuzzlePiece className="text-purple-600" />;
      default:
        return <FaCog className="text-gray-600" />;
    }
  };

  const getTotalAnswered = () => {
    return Object.keys(answers).length;
  };

  const getTotalQuestions = () => {
    return testData?.totalQuestions || 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-32 w-32 border-4 border-blue-200 border-t-blue-600 mx-auto mb-8"></div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Loading Logical Reasoning Test</h3>
          <p className="text-gray-600">Preparing your assessment...</p>
        </motion.div>
      </div>
    );
  }

  if (!testData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaTimesCircle className="w-12 h-12 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Test Unavailable</h2>
          <p className="text-gray-600 mb-8">Unable to load the test data. Please try again later.</p>
          <button
            onClick={onBackToDashboard}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors font-medium"
          >
            Back to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
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
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Logical Reasoning Test
                </div>
                <div className="text-sm text-gray-600">
                  Section {currentSection} of {testData?.sections?.length || 4} • Question {currentQuestion} of 20
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-gray-500">Time Remaining</div>
                <div className={`text-xl font-bold font-mono ${timeRemaining <= 60 ? 'text-red-500' : 'text-blue-600'}`}>
                  {formatTime(timeRemaining)}
                </div>
              </div>
              <button
                onClick={handlePauseToggle}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
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
                  {getSectionIcon(currentSection)}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      {getCurrentSection()?.title}
                    </h2>
                    <p className="text-gray-600 mt-1">
                      {getCurrentSection()?.description}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Section Progress</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {currentQuestion}/20
                  </div>
                </div>
              </div>

              {/* Enhanced Progress Bar */}
              <div className="relative">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Progress</span>
                  <span>{Math.round((currentQuestion / 20) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(currentQuestion / 20) * 100}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-sm"
                  />
                </div>
              </div>
            </motion.section>

            {/* Question Card */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg border border-white/20 overflow-hidden"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${currentSection}-${currentQuestion}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="p-8"
                >
                  {(() => {
                    const question = getCurrentQuestion();
                    if (!question) return null;

                    return (
                      <div>
                        {/* Question Header */}
                        <div className="flex items-center justify-between mb-8">
                          <div className="flex items-center gap-3">
                            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl text-white">
                              <FaBrain className="w-5 h-5" />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-gray-800">
                                Question {currentQuestion}
                              </h3>
                              <p className="text-gray-600">
                                {getCurrentSection()?.title}
                              </p>
                            </div>
                          </div>
                          <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                            {currentQuestion} of 20
                          </div>
                        </div>

                        {/* Question Text */}
                        <div className="mb-8">
                          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
                            <h4 className="text-lg font-medium text-gray-800 leading-relaxed">
                              {question.question}
                            </h4>
                          </div>

                          {/* Answer Options - Vertical Layout */}
                          <div className="space-y-3">
                            {question.options.map((option, index) => {
                              const optionLetter = String.fromCharCode(65 + index);
                              const isSelected = answers[question.id] === optionLetter;

                              return (
                                <motion.button
                                  key={index}
                                  whileHover={{ scale: 1.01 }}
                                  whileTap={{ scale: 0.99 }}
                                  onClick={() => handleAnswerSelect(question.id, optionLetter)}
                                  className={`w-full text-left p-6 rounded-xl border-2 transition-all duration-200 ${
                                    isSelected
                                      ? 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-100'
                                      : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                                  }`}
                                >
                                  <div className="flex items-center gap-4">
                                    <div
                                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold ${
                                        isSelected
                                          ? 'border-blue-500 bg-blue-500 text-white'
                                          : 'border-gray-300 text-gray-500'
                                      }`}
                                    >
                                      {optionLetter}
                                    </div>
                                    <span className="text-gray-700 text-lg">{option}</span>
                                  </div>
                                </motion.button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                          <button
                            onClick={handlePreviousQuestion}
                            disabled={currentQuestion === 1}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                              currentQuestion === 1
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:shadow-md'
                            }`}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Previous
                          </button>

                          {currentQuestion === 20 ? (
                            currentSection === testData.sections.length ? (
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleFinishTest}
                                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                              >
                                <FaFlag />
                                Finish Test
                              </motion.button>
                            ) : (
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleNextSection}
                                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                              >
                                Next Section
                                <FaArrowRight />
                              </motion.button>
                            )
                          ) : (
                            <motion.button
                              whileHover={{ scale: answers[question.id] ? 1.05 : 1 }}
                              whileTap={{ scale: answers[question.id] ? 0.95 : 1 }}
                              onClick={handleNextQuestion}
                              disabled={!answers[question.id]}
                              className={`flex items-center gap-2 px-8 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg ${
                                !answers[question.id]
                                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                                  : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 hover:shadow-xl'
                              }`}
                            >
                              Next
                              <FaArrowRight />
                            </motion.button>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </motion.div>
              </AnimatePresence>
            </motion.section>
          </div>
        )}

        {/* Results Step */}
        {testStep === 'results' && (
          <TestResultsPage
            results={results}
            testType="logical"
            testId="LRT"
            answers={answers}
            testData={testData}
            onBackToDashboard={onBackToDashboard}
            onRetakeTest={() => window.location.reload()}
          />
        )}
      </div>

      {/* Pause Modal */}
      <AnimatePresence>
        {showPauseModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaPause className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Test Paused</h3>
                <p className="text-gray-600 mb-6">
                  Your test is paused. The timer is stopped. Click resume when you're ready to continue.
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={handleResumeTest}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors font-medium"
                  >
                    <FaPlay className="w-4 h-4" />
                    Resume Test
                  </button>
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaTimes className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Exit Test?</h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to exit? Your progress will be lost and you'll need to start over.
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={cancelExitTest}
                    className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmExitTest}
                    className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors font-medium"
                  >
                    Exit Test
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LogicalReasoningTest;
