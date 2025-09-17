import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaClock, FaBrain, FaCheckCircle, FaTimesCircle, FaStop, FaArrowRight, FaFlag, FaCog, FaSearch, FaLightbulb, FaPuzzlePiece, FaPause, FaPlay, FaTimes } from 'react-icons/fa';
// Removed complex scroll utilities - using simple scrollToTop function instead
import { getLogicalTestSections } from '../data/logicalTestSections';
import { submitTestAttempt } from '../lib/submitHelper';
import TestResultsPage from './TestResultsPage';
import { getRuleFor, buildAttempt } from '../testRules';
import { saveAttempt } from '../lib/attemptStorage';

const LogicalReasoningTest = ({ onBackToDashboard, testId = 'lrt1' }) => {
  const rule = getRuleFor(testId);
  const [testStep, setTestStep] = useState('test');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(rule?.timeLimitMin * 60 || 20 * 60);
  const [answers, setAnswers] = useState({});
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
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

  // Load and prepare questions
  useEffect(() => {
    try {
      setLoading(true);
      const data = getLogicalTestSections();
      
      // Flatten all questions from all sections
      const allQuestions = [];
      data?.sections?.forEach(section => {
        if (section.questions) {
          section.questions.forEach(question => {
            allQuestions.push({
              ...question,
              sectionTitle: section.title
            });
          });
        }
      });
      
      // Shuffle and limit to rule's totalQuestions
      const shuffled = allQuestions.sort(() => Math.random() - 0.5);
      const limitedQuestions = shuffled.slice(0, rule?.totalQuestions || 20);
      
      setQuestions(limitedQuestions);
      setTimeRemaining(rule?.timeLimitMin * 60 || 20 * 60);
      setStartedAt(new Date());
    } catch (error) {
      console.error('Error loading test data:', error);
    } finally {
      setLoading(false);
    }
  }, [rule]);

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
    const totalQuestions = rule?.totalQuestions || 20;
    
    if (currentQuestionIndex + 1 >= totalQuestions) {
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
    console.log('handleFinishTest called');
    try {
      const totalQuestions = rule?.totalQuestions || 20;
      const correctAnswers = Object.values(answers).filter(answer => answer === true).length;
      const percentage = Math.round((correctAnswers / totalQuestions) * 100);
      const finishedAt = new Date();
      const duration = Math.round((finishedAt - startedAt) / 1000);
      
      console.log(`Results: ${correctAnswers}/${totalQuestions} (${percentage}%)`);

      const attempt = buildAttempt({
        testId: testId,
        totalQuestions,
        correct: correctAnswers,
        percentage,
        startedAt,
        finishedAt,
        duration
      });

      saveAttempt(attempt);

      const result = {
        score: correctAnswers,
        correct: correctAnswers,
        total: totalQuestions,
        percentage,
        duration,
        result: percentage >= 70 ? 'pass' : 'fail'
      };

      try {
        await submitTestAttempt({
          testId: testId,
          testVersion: '1.0',
          language: 'en',
          answers,
          testData: { questions },
          startedAt
        });
      } catch (submitError) {
        console.error('Error submitting to backend:', submitError);
      }
      
      setResults(result);
      console.log('Setting testStep to results');
      setTestStep('results');
    } catch (error) {
      console.error('Error finishing test:', error);
      setTestStep('results');
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
    return questions[currentQuestionIndex];
  };

  const getTotalAnswered = () => {
    return Object.keys(answers).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaBrain className="w-8 h-8 text-blue-600 animate-pulse" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading Test</h2>
          <p className="text-gray-600">Preparing your assessment...</p>
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
  const isLastQuestion = currentQuestionIndex + 1 >= (rule?.totalQuestions || 20);
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
                Question {currentQuestionIndex + 1} of {rule?.totalQuestions || 20}
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
                  {currentQuestion?.sectionTitle || 'Logical Reasoning'}
                </p>
              </div>
            </div>
            <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {currentQuestionIndex + 1} of {rule?.totalQuestions || 20}
            </div>
          </div>

          {/* Question Text */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
              <h4 className="text-lg font-medium text-gray-800 leading-relaxed">
                {currentQuestion?.question}
              </h4>
            </div>

            {/* Answer Options */}
            <div className="flex flex-wrap gap-3 justify-center">
              {currentQuestion?.options?.map((option, index) => {
                const optionLetter = String.fromCharCode(65 + index);
                const isSelected = answers[currentQuestion.id] === optionLetter;

                return (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAnswerSelect(currentQuestion.id, optionLetter)}
                    className={`w-12 h-12 rounded-full border-2 transition-all duration-200 flex items-center justify-center ${
                      isSelected
                        ? 'border-blue-500 bg-blue-500 text-white shadow-lg'
                        : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50 hover:shadow-md'
                    }`}
                  >
                    <span className="text-lg font-bold">
                      {optionLetter}
                    </span>
                  </motion.button>
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