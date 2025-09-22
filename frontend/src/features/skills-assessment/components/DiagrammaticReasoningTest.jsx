import React, { useState, useEffect } from 'react';
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
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(25 * 60); // 25 minutes default
  const [answers, setAnswers] = useState({});
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
    if (testStep === 'test' && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0) {
      handleFinishTest();
    }
  }, [testStep, timeRemaining]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      handleFinishTest();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
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
          currentQuestion: currentQuestionIndex + 1
        }
      });

      console.log('Test submitted successfully:', result);
      setResults(result);
      setTestStep('results');
      
    } catch (error) {
      console.error('Error finishing test:', error);
      setError('Failed to submit test. Please try again.');
    }
  };

  const handleExitTest = () => {
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
          <p className="text-gray-600">Preparing your diagrammatic reasoning assessment...</p>
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
            <FaTimes className="w-12 h-12 text-red-600" />
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
        testType="diagrammatic"
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
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Modern Test Header - Matching Verbal Test Design */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Test Info */}
            <div className="flex items-center space-x-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleExitTest}
                className="flex items-center text-gray-600 hover:text-red-600 transition-colors"
              >
                <FaTimes className="text-xl" />
              </motion.button>
              
              <div>
                <h1 className="text-xl font-bold text-gray-800">Diagrammatic Reasoning Test</h1>
                <p className="text-sm text-gray-600">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </p>
              </div>
            </div>

            {/* Center: Progress Bar */}
            <div className="flex-1 max-w-md mx-8">
              <div className="bg-gray-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1 text-center">
                {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}% Complete
              </p>
            </div>

            {/* Right: Timer & Controls */}
            <div className="flex items-center space-x-4">                    
              <div className={`text-right ${timeRemaining < 300 ? 'text-red-500' : timeRemaining < 600 ? 'text-orange-500' : 'text-blue-600'}`}>
                <div className="text-2xl font-bold font-mono">
                  <FaClock className="inline mr-2" />
                  {formatTime(timeRemaining)}
                </div>
                <p className="text-xs opacity-75">Time Remaining</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Test Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-6"
          >
            {/* Question Card - Matching Verbal Test Design */}
            <section className="bg-white rounded-2xl shadow-lg p-8">
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <FaProjectDiagram className="text-blue-600 text-xl mr-3" />
                  <h3 className="text-lg font-semibold text-gray-800">
                    Question {currentQuestionIndex + 1}
                  </h3>
                </div>
                
                <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                  {currentQuestion?.question_text}
                </p>
                
                {/* Question Image - Similar to Spatial Test */}
                {currentQuestion?.main_image && (
                  <div className="mb-6">
                    <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                      <div className="flex justify-center">
                        <img
                          src={`/src/assets/images/diagrammatic/questions/section_1/${currentQuestion.main_image.split('/').pop()}`}
                          alt={`Question ${currentQuestionIndex + 1}`}
                          className="max-w-2xl max-h-[20rem] w-auto h-auto rounded-lg shadow-sm object-contain"
                          style={{ maxWidth: '560px', maxHeight: '350px' }}
                          onError={(e) => {
                            console.log('Image failed to load:', e.target.src);
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Answer Options - Horizontal Layout */}
                <div role="radiogroup" aria-labelledby={`q-${currentQuestion?.id}-label`} className="flex flex-wrap justify-center gap-4">
                  {currentQuestion?.options?.map((option, index) => {
                    // Handle both string and object options
                    const optionValue = typeof option === 'string' ? option : option.value || option.option_id || option.text;
                    const isSelected = answers[currentQuestion?.id] === optionValue;
                    const letters = ['A', 'B', 'C', 'D', 'E'];
                    
                    return (
                      <motion.label
                        key={`option-${index}-${optionValue}`}
                        className={`flex items-center justify-center w-16 h-16 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                          isSelected 
                            ? "border-blue-500 bg-blue-50 text-blue-700 shadow-lg" 
                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 hover:shadow-md"
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <input
                          type="radio"
                          name={`q-${currentQuestion?.id}`}
                          value={optionValue}
                          className="sr-only"
                          checked={isSelected}
                          onChange={() => handleAnswerSelect(currentQuestion?.id, optionValue)}
                        />
                        <div className="flex items-center justify-center">
                          <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            isSelected 
                              ? 'bg-blue-500 text-white' 
                              : 'bg-gray-200 text-gray-600'
                          }`}>
                            {letters[index]}
                          </span>
                        </div>
                      </motion.label>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Navigation - Matching Verbal Test Design */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-200">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
              >
                <FaArrowRight className="w-4 h-4 rotate-180" />
                Previous
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={isLastQuestion ? handleFinishTest : handleNextQuestion}
                disabled={!isAnswered}
                className={`flex items-center gap-2 px-8 py-3 rounded-xl transition-all duration-200 font-medium shadow-lg ${
                  isAnswered
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isLastQuestion ? (
                  <>
                    <FaFlag />
                    Submit Test
                  </>
                ) : (
                  <>
                    Next
                    <FaArrowRight />
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DiagrammaticReasoningTest;