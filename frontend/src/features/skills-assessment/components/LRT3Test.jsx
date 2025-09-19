import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaClock, FaBrain, FaCheckCircle, FaTimesCircle, FaStop, FaArrowRight, FaFlag, FaPuzzlePiece } from 'react-icons/fa';
import { useScrollToTop, useTestScrollToTop, useQuestionScrollToTop, scrollToTop } from '../../../shared/utils/scrollUtils';
// Removed frontend data imports - using backend API instead
import { submitTestAttempt, fetchTestQuestions } from '../lib/backendSubmissionHelper';
import TestResultsPage from './TestResultsPage';

const LRT3Test = ({ onBackToDashboard, testId = 'lrt3' }) => {
  // Map frontend test ID to backend database ID
  const getBackendTestId = (frontendId) => {
    const testIdMapping = {
      'lrt3': '32', // Default to Critical Thinking
      'LRT3': '32',
      'logical_critical': '32',
      'critical': '32'
    };
    return testIdMapping[frontendId] || frontendId || '32'; // Default to Critical Thinking
  };
  
  const backendTestId = getBackendTestId(testId);
  
  const [testStep, setTestStep] = useState('loading');
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(35 * 60); // 35 minutes default
  const [answers, setAnswers] = useState({});
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startedAt, setStartedAt] = useState(null);
  const [results, setResults] = useState(null);

  // Universal scroll management using scroll utilities
  useScrollToTop([], { smooth: true }); // Scroll on component mount
  useTestScrollToTop(testStep, 'lrt3-test-scroll', { smooth: true, attempts: 5 }); // Scroll on test step changes
  useQuestionScrollToTop(currentQuestion, testStep, 'lrt3-test-scroll'); // Scroll on question changes

  // Initialize test with backend API
  useEffect(() => {
    const initializeTest = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch test questions from backend (secure - no correct answers)
        const fetchedQuestions = await fetchTestQuestions(backendTestId);
        setQuestions(fetchedQuestions);
        
        setTimeRemaining(35 * 60); // 35 minutes default
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
  }, [testStep, timeRemaining]);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Get current question data
  const getCurrentQuestion = () => {
    if (!questions || !Array.isArray(questions) || questions.length === 0) return null;
    return questions[currentQuestion - 1] || null;
  };

  // Handle answer selection
  const handleAnswerSelect = (answer) => {
    const questionId = getCurrentQuestion()?.id;
    if (questionId) {
      setAnswers(prev => ({
        ...prev,
        [questionId]: answer
      }));
    }
  };

  // Handle next question
  const handleNextQuestion = () => {
    if (currentQuestion < questions.length) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      handleFinishTest();
    }
  };

  // Handle previous question
  const handlePreviousQuestion = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  // Handle finish test
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
          testType: 'logical_reasoning_lrt3',
          totalQuestions: questions.length,
          currentQuestion: currentQuestion
        },
        onSuccess: (data) => {
          console.log('Test submitted successfully:', data);
          setResults(data.score);
          setTestStep('results');
          scrollToTop('lrt3-test-scroll');
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



  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading LRT3 Test...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (testStep === 'error') {
    return (
      <div className="bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md mx-auto p-6">
          <FaTimesCircle className="text-6xl text-red-500 mx-auto mb-4" />
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
        </div>
      </div>
    );
  }

  // Results step - delegate to TestResultsPage
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div id="lrt3-test-scroll" className="container mx-auto px-4 py-8">
        

        {/* Test */}
        {testStep === 'test' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-4xl mx-auto"
          >
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">LRT3 - Critical Thinking</h1>
                  <p className="text-gray-600">Critical thinking and argument analysis</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2 text-lg font-semibold">
                    <FaClock className={`${timeRemaining <= 120 ? 'text-red-500' : 'text-blue-600'}`} />
                    <span className={`${timeRemaining <= 120 ? 'text-red-500' : 'text-blue-600'}`}>
                      {formatTime(timeRemaining)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">Time Remaining</p>
                </div>
              </div>

              {/* Progress */}
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Progress</span>
                  <span className="text-sm font-medium text-gray-700">{Math.round((currentQuestion / questions.length) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(currentQuestion / questions.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div id="lrt3-question-card"
                key={currentQuestion}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg shadow-sm p-8 border border-gray-200"
              >
                {/* Question Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                      <FaPuzzlePiece />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">Question {currentQuestion}</h3>
                      <p className="text-sm text-gray-500">Critical Thinking</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{currentQuestion} of {questions.length}</span>
                </div>

                {/* Question */}
                <div className="mb-8">
                  <p className="text-lg text-gray-800 leading-relaxed mb-6">
                    {getCurrentQuestion()?.question_text}
                  </p>
                  {getCurrentQuestion()?.context && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                      <p className="text-sm text-blue-800 font-medium">
                        <strong>Context:</strong> {getCurrentQuestion().context}
                      </p>
                    </div>
                  )}

                  {/* Options */}
                  <div className="flex justify-center gap-4 w-full">
                    {getCurrentQuestion()?.options?.map((option, index) => {
                      const optionLetter = String.fromCharCode(65 + index); // A, B, C, D, E
                      const isSelected = answers[getCurrentQuestion()?.id] === optionLetter;
                      const optionsCount = getCurrentQuestion()?.options?.length || 0;
                      
                      // Calculate width based on number of options
                      const buttonWidth = optionsCount <= 3 ? 'w-20' : optionsCount === 4 ? 'w-16' : 'w-12';
                      
                      return (
                        <button
                          key={index}
                          onClick={() => handleAnswerSelect(optionLetter)}
                          className={`${buttonWidth} h-16 rounded-lg border-2 transition-all duration-200 flex items-center justify-center ${
                            isSelected 
                              ? 'border-blue-500 bg-blue-500 text-white shadow-lg' 
                              : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50 hover:shadow-md'
                          }`}
                        >
                          <span className="text-2xl font-bold">
                            {optionLetter.toUpperCase()}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                  <button
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestion === 1}
                    className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  <div className="flex space-x-3">
                    <button
                      onClick={handleFinishTest}
                      className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <FaStop className="inline mr-2" />
                      Finish Test
                    </button>
                    
                    <button
                      onClick={handleNextQuestion}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      {currentQuestion === questions.length ? 'Finish' : 'Next'}
                      <FaArrowRight className="inline ml-2" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}

      </div>
    </div>
  );
};

export default LRT3Test;
