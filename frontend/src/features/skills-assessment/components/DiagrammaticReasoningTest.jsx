import React, { useState, useEffect } from 'react';
import backendApi from '../api/backendApi';
import { motion, AnimatePresence } from 'framer-motion';
import { FaClock, FaFlag, FaCheckCircle, FaTimesCircle, FaStop, FaArrowRight, FaSearchPlus, FaLayerGroup, FaImage, FaPause, FaPlay, FaTimes, FaSitemap, FaProjectDiagram } from 'react-icons/fa';
// Removed frontend data imports - using backend API instead
import { submitTestAttempt, fetchTestQuestions } from '../lib/backendSubmissionHelper';
import TestResultsPage from './TestResultsPage';

const DiagrammaticReasoningTest = ({ onBackToDashboard, testId = null }) => {
  // Map frontend test ID to backend database ID
  const getBackendTestId = (frontendId) => {
    const testIdMapping = {
      'diagrammatic': '24', // Default to Pattern Recognition
      'diagrammatic_pattern': '24',
      'diagrammatic_logic': '25',
      'diagrammatic_network': '26',
      'DRT1': '24',
      'DRT2': '25',
      'DRT3': '26'
    };
    return testIdMapping[frontendId] || frontendId || '24'; // Default to Pattern Recognition
  };
  
  const backendTestId = getBackendTestId(testId);

  const [testStep, setTestStep] = useState('loading');
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(30 * 60); // 30 minutes default
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
    if (testStep === 'test' && currentQuestion > 0) {
      // Small delay to ensure DOM has updated after question change
      const timer = setTimeout(() => {
        scrollToTop();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [currentQuestion, testStep]);

  // Initialize test with backend API
  useEffect(() => {
    const initializeTest = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch test questions from backend (secure - no correct answers)
        const fetchedQuestions = await fetchTestQuestions(backendTestId);
        setQuestions(fetchedQuestions);
        
        setTimeRemaining(30 * 60); // 30 minutes default
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

  const handleStartTest = () => {
    setTestStep('test');
    
    // Scroll to top when test starts
    setTimeout(() => scrollToTop(), 100);
  };

  const handleAnswerSelect = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      handleFinishTest();
    }
    
    // Smooth scroll to top after navigation
    setTimeout(() => scrollToTop(), 150);
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(prev => prev - 1);
    } else {
      // Move to previous section
      const prevSection = testData.sections?.find(s => s.id === currentSection - 1);
      if (prevSection) {
        setCurrentSection(currentSection - 1);
        setCurrentQuestion(prevSection.total_questions);
      }
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
          testType: 'diagrammatic_reasoning',
          totalQuestions: questions.length,
          currentQuestion: currentQuestion
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
    if (!questions || !Array.isArray(questions) || questions.length === 0) return null;
    return questions[currentQuestion - 1] || null;
  };

  const getTotalAnswered = () => {
    return Object.keys(answers).length;
  };

  const getTotalQuestions = () => {
    return questions && Array.isArray(questions) ? questions.length : 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-32 w-32 border-4 border-purple-200 border-t-purple-600 mx-auto mb-8"></div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Loading Diagrammatic Reasoning Test</h3>
          <p className="text-gray-600">Preparing your assessment...</p>
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

  // Results step - delegate to TestResultsPage
  if (testStep === 'results') {
    return (
      <TestResultsPage
        results={results}
        testType="diagrammatic"
        testId={testId}
        answers={answers}
        testData={{ questions }}
        onBackToDashboard={onBackToDashboard}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
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
                <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Diagrammatic Reasoning Test
                </div>
                <div className="text-sm text-gray-600">
                  Question {currentQuestion} of {getTotalQuestions()}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-gray-500">Time Remaining</div>
                <div className={`text-xl font-bold font-mono ${timeRemaining <= 300 ? 'text-red-500' : 'text-purple-600'}`}>
                  {formatTime(timeRemaining)}
                </div>
              </div>
              <button
                onClick={handlePauseToggle}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
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
                  <FaProjectDiagram className="text-purple-600" />
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      Diagrammatic Analysis
                    </h2>
                    <p className="text-gray-600 mt-1">
                      Analyze diagrams and identify logical patterns
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Progress</div>
                  <div className="text-2xl font-bold text-purple-600">
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
                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
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
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {currentQuestion}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">Diagrammatic Pattern</h3>
                        <p className="text-gray-600">Analyze the diagram sequence</p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      <FaLayerGroup className="inline mr-1" />
                      Complexity: {getCurrentQuestion()?.complexity_score || 3}/5
                    </div>
                  </div>

                  {/* Question Content */}
                  {getCurrentQuestion()?.question_text && (
                    <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                      <p className="text-lg text-gray-800">{getCurrentQuestion().question_text}</p>
                      {getCurrentQuestion()?.context && (
                        <p className="text-sm text-gray-600 mt-2">{getCurrentQuestion().context}</p>
                      )}
                    </div>
                  )}

                  {/* Question Image */}
                  {getCurrentQuestion()?.main_image && (
                    <div className="mb-8 text-center">
                      <div className="inline-block bg-white rounded-xl p-4 shadow-md border">
                        <div className="flex justify-center">
                          <img 
                            src={getCurrentQuestion().main_image} 
                            alt={`Diagrammatic pattern ${getCurrentQuestion()?.id || ''}`}
                            className="max-w-xl max-h-[28rem] w-auto h-auto rounded-lg object-contain"
                            style={{ maxWidth: '528px', maxHeight: '422px' }}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextElementSibling.style.display = 'flex';
                            }}
                          />
                        </div>
                        <div className="hidden items-center justify-center w-full h-48 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
                          <div className="text-center">
                            <FaImage className="text-gray-400 text-3xl mx-auto mb-2" />
                            <p className="text-gray-500">Diagram image not available</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Answer Options */}
                  <div className="mb-8">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <FaSearchPlus className="mr-2 text-purple-600" />
                      Select the correct answer:
                    </h4>
                    <div className="flex justify-center gap-4 w-full">
                      {getCurrentQuestion()?.options?.map((option) => {
                        const optionsCount = getCurrentQuestion()?.options?.length || 0;
                        
                        // Calculate width based on number of options
                        const buttonWidth = optionsCount <= 3 ? 'w-20' : optionsCount === 4 ? 'w-16' : 'w-12';
                        
                        return (
                          <motion.button
                            key={option}
                            onClick={() => handleAnswerSelect(getCurrentQuestion().id, option)}
                            className={`${buttonWidth} h-16 rounded-lg border-2 transition-all duration-200 flex items-center justify-center ${
                              answers[getCurrentQuestion().id] === option
                                ? 'border-purple-500 bg-purple-500 text-white shadow-lg'
                                : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50 hover:shadow-md'
                            }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <span className="text-2xl font-bold">
                              {option}
                            </span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Navigation */}
                  <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                    <motion.button
                      onClick={handlePreviousQuestion}
                      disabled={currentSection === 1 && currentQuestion === 1}
                      className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-200 ${
                        currentSection === 1 && currentQuestion === 1
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:shadow-md'
                      }`}
                      whileHover={!(currentSection === 1 && currentQuestion === 1) ? { scale: 1.02 } : {}}
                      whileTap={!(currentSection === 1 && currentQuestion === 1) ? { scale: 0.98 } : {}}
                    >
                      <span>← Previous</span>
                    </motion.button>

                    <div className="text-center">
                      <p className={`text-sm font-medium ${
                        answers[`${currentSection}_${getCurrentQuestion()?.id}`] ? 'text-green-600' : 'text-gray-500'
                      }`}>
                        {answers[`${currentSection}_${getCurrentQuestion()?.id}`] ? '✓ Answer selected' : 'Select an answer to continue'}
                      </p>
                    </div>

                    <motion.button
                      onClick={handleNextQuestion}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl hover:from-purple-600 hover:to-indigo-600 transition-all duration-200 shadow-lg"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span>{getGlobalQuestionNumber() === getTotalQuestions() ? 'Complete Test' : 'Next Question'}</span>
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

export default DiagrammaticReasoningTest;
