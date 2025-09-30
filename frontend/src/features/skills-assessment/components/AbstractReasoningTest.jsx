import React, { useState, useEffect, useRef } from 'react';
import backendApi from '../api/backendApi';
import { motion, AnimatePresence } from 'framer-motion';
import { FaClock, FaBrain, FaStop, FaArrowRight, FaFlag, FaSync, FaSearchPlus, FaExpand, FaEye, FaImage, FaLayerGroup, FaPlay, FaTimes, FaCheckCircle, FaArrowLeft } from 'react-icons/fa';
// Removed frontend data imports - using backend API instead
import { submitTestAttempt, fetchTestQuestions } from '../lib/backendSubmissionHelper';
import TestResultsPage from './TestResultsPage';


const AbstractReasoningTest = ({ onBackToDashboard, onNavigateToTestHistory, testId = 'abstract' }) => {
  // Map frontend test ID to backend database ID
  const getBackendTestId = (frontendId) => {
    const testIdMapping = {
      'abstract': '10', // Default to Abstract Reasoning
      'abstract_pattern': '10',
      'abstract_sequence': '11',
      'abstract_analysis': '12',
      'ART1': '10', // Abstract Reasoning Test 1
      'ART2': '11', // Abstract Reasoning Test 2
      'ART3': '12'  // Abstract Reasoning Test 3
    };
    return testIdMapping[frontendId] || frontendId || '10'; // Default to Abstract Reasoning
  };
  
  const backendTestId = getBackendTestId(testId);
  
  const [testStep, setTestStep] = useState('loading');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(20 * 60); // 20 minutes default
  const [answers, setAnswers] = useState({});
  const [questions, setQuestions] = useState([]);
  const [testMeta, setTestMeta] = useState({ title: '', description: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showExitModal, setShowExitModal] = useState(false);
  const [startedAt, setStartedAt] = useState(null);
  const [results, setResults] = useState(null);


  const testContainerRef = useRef(null);

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

        // Fetch test questions and metadata from backend (secure - no correct answers)
        // use backendApi directly so we can capture top-level test metadata (title/description)
        const response = await backendApi.getTestQuestions(backendTestId);
        const fetchedQuestions = response?.questions || [];
        setQuestions(fetchedQuestions);
        setTestMeta({
          title: response?.test_title || response?.title || '',
          description: response?.test_description || response?.description || ''
        });
        
        setTimeRemaining(20 * 60); // 20 minutes default
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

  // Timer effect
  useEffect(() => {
    if (testStep === 'test' && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeRemaining === 0) {
      handleFinishTest();
    }
  }, [testStep, timeRemaining]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (questionId, selectedOption) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: selectedOption,
    }));
  };



  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
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
          testType: 'abstract_reasoning',
          totalQuestions: questions.length,
          currentQuestion: currentQuestionIndex + 1
        },
        onSuccess: (processedData) => {
          console.log('Test submitted successfully:', processedData);
          setResults(processedData);
          setTestStep('results');
        },
        onError: (error) => {
          console.error('Test submission failed:', error);

          // Handle duplicate submission specially
          if (error.message === 'DUPLICATE_SUBMISSION' && error.existingSubmission) {
            console.log('Handling duplicate submission:', error.existingSubmission);

            // Use existing submission data instead of showing modal
            const existingScore = parseFloat(error.existingSubmission.score) || 0;
            const existingResults = {
              id: error.existingSubmission.submissionId,
              raw_score: existingScore.toFixed(2),
              max_possible_score: "100.00",
              percentage_score: existingScore.toFixed(2),
              correct_answers: Math.round((existingScore / 100) * questions.length),
              total_questions: questions.length,
              grade_letter: existingScore >= 90 ? 'A' : existingScore >= 80 ? 'B' : existingScore >= 70 ? 'C' : existingScore >= 60 ? 'D' : 'F',
              passed: existingScore >= 70,
              test_title: "ART1 - Abstract Reasoning",
              test_type: "abstract_reasoning",
              isDuplicateSubmission: true,
              existingSubmissionMessage: error.existingSubmission.message
            };

            setResults(existingResults);
            setTestStep('results');
            return;
          }

          setError('Failed to submit test. Please try again.');
        }
      });

    } catch (error) {
      console.error('Error finishing test:', error);

      // Handle duplicate submission at the catch level too
      if (error.message === 'DUPLICATE_SUBMISSION' && error.existingSubmission) {
        console.log('Handling duplicate submission in catch:', error.existingSubmission);

        // Use existing submission data instead of showing modal
        const existingScore = parseFloat(error.existingSubmission.score) || 0;
        const existingResults = {
          id: error.existingSubmission.submissionId,
          raw_score: existingScore.toFixed(2),
          max_possible_score: "100.00",
          percentage_score: existingScore.toFixed(2),
          correct_answers: Math.round((existingScore / 100) * questions.length),
          total_questions: questions.length,
          grade_letter: existingScore >= 90 ? 'A' : existingScore >= 80 ? 'B' : existingScore >= 70 ? 'C' : existingScore >= 60 ? 'D' : 'F',
          passed: existingScore >= 70,
          test_title: "ART1 - Abstract Reasoning",
          test_type: "abstract_reasoning",
          isDuplicateSubmission: true,
          existingSubmissionMessage: error.existingSubmission.message
        };

        setResults(existingResults);
        setTestStep('results');
        return;
      }

      setError('Failed to submit test. Please try again.');
    }
  };

  const handleExitTest = () => {
    setShowExitModal(true);
  };

  const handleConfirmExit = () => {
    setShowExitModal(false);
      onBackToDashboard();
  };

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isAnswered = answers[currentQuestion?.id] !== undefined;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaBrain className="w-8 h-8 text-purple-600 animate-pulse" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading Test</h2>
          <p className="text-gray-600">Preparing your abstract reasoning assessment...</p>
        </motion.div>
      </div>
    );
  }

  if (error || !questions.length) {
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
          <p className="text-gray-600 mb-8">{error || 'Unable to load the test data. Please try again later.'}</p>
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

  if (testStep === 'results') {
    return (
      <TestResultsPage
        results={results}
        testType="abstract"
        testId={testId}
          answers={answers}
          testData={{ questions }}
          testMeta={testMeta}
        onBackToDashboard={onBackToDashboard}
      />
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 bg-white/60 min-h-screen">
      {/* Modern Test Header - Matching Spatial Test Design */}
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
                <h1 className="text-xl font-bold text-gray-800">Abstract Reasoning Test</h1>
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
                  className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1 text-center">
                {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}% Complete
              </p>
            </div>

            {/* Right: Timer & Controls */}
            <div className="flex items-center space-x-4">                    
              <div className={`text-right ${timeRemaining < 300 ? 'text-red-500' : timeRemaining < 600 ? 'text-orange-500' : 'text-purple-600'}`}>
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
      <div className="max-w-7xl mx-auto px-6 bg-white/60">
        <AnimatePresence mode="wait">
        <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-6"
          >
            {/* Question Card - Matching Spatial Test Design */}
            <section className="bg-white rounded-2xl shadow-lg p-8">
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <FaBrain className="text-purple-600 text-xl mr-3" />
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
                          src={`/src/assets/images/abstract/questions/${currentQuestion.main_image.split('/').pop()}`}
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
                    const letters = ['A', 'B', 'C', 'D', 'E'];
                    const optionLetter = letters[index] || String.fromCharCode(65 + index);
                    const optionsCount = currentQuestion?.options?.length || 0;
                    const buttonWidth = optionsCount <= 3 ? 'w-20' : optionsCount === 4 ? 'w-16' : optionsCount === 5 ? 'w-14' : 'w-12';
                    const isSelected = answers[currentQuestion?.id] === optionLetter;

                    return (
                      <motion.button
                        key={`option-${index}-${optionValue}`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAnswerSelect(currentQuestion?.id, optionLetter)}
                        className={`${buttonWidth} h-16 rounded-lg border-2 transition-all duration-200 flex items-center justify-center ${
                          isSelected
                            ? 'border-purple-500 bg-purple-500 text-white shadow-lg'
                            : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50 hover:shadow-md'
                        }`}
                      >
                        <span className="text-2xl font-bold">
                          {optionLetter}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Navigation - Matching Spatial Test Design */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-200">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
              >
                <FaArrowLeft />
                Previous
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={isLastQuestion ? handleFinishTest : handleNextQuestion}
                disabled={!isAnswered}
                className={`flex items-center gap-2 px-8 py-3 rounded-xl transition-all duration-200 font-medium shadow-lg ${
                  isAnswered
                    ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800'
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

      {/* Exit Modal */}
      <AnimatePresence>
        {showExitModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
            >
      <div className="text-center">
                <FaTimes className="w-12 h-12 text-red-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Exit Test?</h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to exit? Your progress will be lost.
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowExitModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmExit}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
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

export default AbstractReasoningTest;