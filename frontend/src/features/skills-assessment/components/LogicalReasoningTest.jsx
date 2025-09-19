import React, { useState, useEffect, useMemo } from 'react';
import backendApi from '../api/backendApi';
import { motion, AnimatePresence } from 'framer-motion';
import { FaClock, FaBrain, FaCheckCircle, FaTimesCircle, FaStop, FaArrowRight, FaFlag, FaCog, FaSearch, FaLightbulb, FaPuzzlePiece, FaPause, FaPlay, FaTimes } from 'react-icons/fa';
// Removed frontend data imports - using backend API instead
import { submitTestAttempt, fetchTestQuestions } from '../lib/backendSubmissionHelper';
import TestResultsPage from './TestResultsPage';

const LogicalReasoningTest = ({ onBackToDashboard, testId = 'lrt1' }) => {
  // Map frontend test ID to backend database ID
  const getBackendTestId = (frontendId) => {
    const testIdMapping = {
      'lrt1': '30', // Default to Deductive Logic
      'logical': '30',
      'logical_deductive': '30',
      'logical_inductive': '31',
      'logical_critical': '32',
      'LRT1': '30',
      'LRT2': '31',
      'LRT3': '32'
    };
    return testIdMapping[frontendId] || frontendId || '30'; // Default to Deductive Logic
  };
  
  const backendTestId = getBackendTestId(testId);
  
  const [testStep, setTestStep] = useState('loading');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(25 * 60); // 25 minutes default
  const [answers, setAnswers] = useState({});
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [startedAt, setStartedAt] = useState(null);
  const [results, setResults] = useState(null);

  // Smooth scroll-to-top function - only called on navigation
  const scrollToTop = () => {
    // Target the main scrollable container in MainDashboard
    const mainScrollContainer = document.querySelector('.main-content-area .overflow-y-auto');
    if (mainScrollContainer) {
      // Smooth scroll to top
      mainScrollContainer.scrollTo({ 
        top: 0, 
        behavior: 'smooth',
        block: 'start'
      });
    } else {
      // Fallback to window scroll
      window.scrollTo({ 
        top: 0, 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Only scroll to top when question changes (not on every render)
  useEffect(() => {
    if (testStep === 'test' && currentQuestionIndex > 0) {
      // Small delay to ensure DOM has updated after question change
      const timer = setTimeout(() => {
        scrollToTop();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [currentQuestionIndex, testStep]);

  // Initialize test with backend API
  useEffect(() => {
    const initializeTest = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch test questions from backend (secure - no correct answers)
        const fetchedQuestions = await fetchTestQuestions(backendTestId);
        setQuestions(fetchedQuestions);
        
        setTimeRemaining(25 * 60); // 25 minutes default
        setStartedAt(new Date());
        setTestStep('test');
        
      } catch (error) {
        console.error('Failed to initialize test:', error);
        setError('Failed to load test questions. Please try again.');
        setTestStep('error');
      } finally {
        setLoading(false);
      }
    };

    initializeTest();
  }, [backendTestId]);

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

  const handleAnswerSelect = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 >= questions.length) {
      handleFinishTest();
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
    
    // Smooth scroll to top after navigation
    setTimeout(() => scrollToTop(), 150);
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
    
    // Smooth scroll to top after navigation
    setTimeout(() => scrollToTop(), 150);
  };

  const handleFinishTest = async () => {
    try {
      // Submit to backend for scoring
      const result = await submitTestAttempt({
        testId: backendTestId,
        answers,
        startedAt: startedAt,
        finishedAt: Date.now(),
        reason: 'user',
        metadata: {
          testType: 'logical_reasoning',
          totalQuestions: questions.length,
          currentQuestion: currentQuestionIndex + 1
        },
        onSuccess: (data) => {
          console.log('Test submitted successfully:', data);
          setResults(data.score);
          setTestStep('results');
          scrollToTop();
        },
        onError: (error) => {
          console.error('Test submission failed:', error);
          setError(`Submission failed: ${error.message}`);
        }
      });
      
    } catch (error) {
      console.error('Error finishing test:', error);
      setError('Failed to submit test. Please try again.');
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

  const handleResume = () => {
    setIsPaused(false);
    setShowPauseModal(false);
  };

  const handleExitTest = () => {
    setShowExitModal(true);
  };

  const handleConfirmExit = () => {
    onBackToDashboard();
  };

  const getCurrentQuestion = () => {
    if (!questions || !Array.isArray(questions) || questions.length === 0) return null;
    return questions[currentQuestionIndex] || null;
  };

  const getTotalAnswered = () => {
    return Object.keys(answers).length;
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading Test</h2>
          <p className="text-gray-600">Preparing your logical reasoning assessment...</p>
        </motion.div>
      </div>
    );
  }

  // Error state
  if (testStep === 'error') {
    return (
      <div className="bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto p-6"
        >
          <FaTimes className="text-red-500 text-6xl mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Test</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={onBackToDashboard}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors ml-4"
          >
            Back to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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

  // Show results page
  if (testStep === 'results') {
    return (
      <TestResultsPage
        results={results}
        testType="logical"
        testId={testId}
        answers={answers}
        testData={{ questions }}
        onBackToDashboard={onBackToDashboard}
      />
    );
  }

  const currentQuestion = getCurrentQuestion();
  const isLastQuestion = currentQuestionIndex + 1 >= questions.length;
  const isAnswered = answers[currentQuestion?.id] != null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handleExitTest}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FaTimes className="w-4 h-4" />
              <span className="font-medium">Exit Test</span>
            </button>

            <div className="text-center">
              <div className="text-xl font-bold text-gray-800">
                Logical Reasoning Test
              </div>
              <div className="text-sm text-gray-600">
                Question {currentQuestionIndex + 1} of {questions.length}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-gray-500">Time Remaining</div>
                <div className={`text-lg font-bold font-mono ${timeRemaining <= 60 ? 'text-red-500' : 'text-blue-600'}`}>
                  {formatTime(timeRemaining)}
                </div>
              </div>
              <button
                onClick={handlePauseToggle}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                {isPaused ? <FaPlay className="w-4 h-4" /> : <FaPause className="w-4 h-4" />}
                <span className="font-medium">{isPaused ? 'Resume' : 'Pause'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Question Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl text-white">
                <FaBrain className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  Question {currentQuestionIndex + 1}
                </h3>
                <p className="text-gray-600">
                  {currentQuestion?.question_type || 'Logical Reasoning'}
                </p>
              </div>
            </div>
            <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {currentQuestionIndex + 1} of {questions.length}
            </div>
          </div>

          {/* Question Text */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
              <h4 className="text-lg font-medium text-gray-800 leading-relaxed">
                {currentQuestion?.question_text}
              </h4>
              {currentQuestion?.context && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                  <p className="text-sm text-blue-800 font-medium">
                    <strong>Context:</strong> {currentQuestion.context}
                  </p>
                </div>
              )}
            </div>

            {/* Answer Options */}
            <div role="radiogroup" aria-labelledby={`q-${currentQuestion.id}-label`} className="grid gap-4">
              {currentQuestion?.options?.map((option, index) => {
                const optionLetter = String.fromCharCode(65 + index);
                const isSelected = answers[currentQuestion.id] === optionLetter;

                return (
                  <motion.label
                    key={index}
                    className={`w-full rounded-xl border-2 px-6 py-4 cursor-pointer transition-all duration-200 ${
                      isSelected 
                        ? "border-blue-500 bg-blue-50 text-blue-700 shadow-lg" 
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 hover:shadow-md"
                    }`}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <input
                      type="radio"
                      name={`q-${currentQuestion.id}`}
                      value={optionLetter}
                      className="sr-only"
                      checked={isSelected}
                      onChange={() => handleAnswerSelect(currentQuestion.id, optionLetter)}
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 text-sm font-bold ${
                          isSelected 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-200 text-gray-600'
                        }`}>
                          {optionLetter}
                        </span>
                        <span className="text-lg font-medium">{option}</span>
                      </div>
                      {isSelected && <FaCheckCircle className="w-5 h-5 text-blue-500" />}
                    </div>
                  </motion.label>
                );
              })}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <button
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                currentQuestionIndex === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <FaArrowRight className="w-4 h-4 rotate-180" />
              Previous
            </button>

            <div className="text-sm text-gray-500">
              {getTotalAnswered()} of {rule?.totalQuestions || 20} answered
            </div>

            <motion.button
              whileHover={{ scale: isAnswered ? 1.05 : 1 }}
              whileTap={{ scale: isAnswered ? 0.95 : 1 }}
              onClick={handleNextQuestion}
              disabled={!isAnswered}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                isAnswered
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg hover:from-blue-700 hover:to-blue-800 hover:shadow-xl'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isLastQuestion ? 'Complete Test' : 'Next'}
              <FaArrowRight />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Pause Modal */}
      <AnimatePresence>
        {showPauseModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center"
            >
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaPause className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Test Paused</h3>
              <p className="text-gray-600 mb-6">Your progress has been saved. Click resume to continue.</p>
              <div className="flex gap-3">
                <button
                  onClick={handleResume}
                  className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
                >
                  Resume Test
                </button>
                <button
                  onClick={handleExitTest}
                  className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-medium transition-colors"
                >
                  Exit Test
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Exit Modal */}
      <AnimatePresence>
        {showExitModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center"
            >
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaTimesCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Exit Test?</h3>
              <p className="text-gray-600 mb-6">Your progress will be saved, but you'll need to restart the test.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowExitModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmExit}
                  className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors"
                >
                  Exit Test
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LogicalReasoningTest;