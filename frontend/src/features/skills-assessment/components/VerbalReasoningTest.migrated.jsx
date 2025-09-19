import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaClock, 
  FaBook, 
  FaStop, 
  FaArrowRight, 
  FaArrowLeft, 
  FaFlag, 
  FaQuestionCircle, 
  FaFileAlt,
  FaCheckCircle,
  FaTimes,
  FaPlay,
  FaHome
} from 'react-icons/fa';

// NEW: Import backend API services
import backendApi from '../api/backendApi';
import { submitTestAttempt, fetchTestQuestions } from '../lib/backendSubmissionHelper';

// REMOVED: Frontend scoring imports
// import { submitTestAttempt } from '../lib/submitHelper';
// import { getRuleFor, buildAttempt } from '../testRules';
// import { saveAttempt } from '../lib/attemptStorage';

import TestResultsPage from './TestResultsPage';

const VerbalReasoningTest = ({ onBackToDashboard, testId = null, language = 'english' }) => {
  // State management
  const [testStep, setTestStep] = useState('loading'); // Start with loading
  const [currentSection, setCurrentSection] = useState(1);
  const [answers, setAnswers] = useState({});
  const [testData, setTestData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(20 * 60); // 20 minutes
  const [testStartTime, setTestStartTime] = useState(null);
  
  const timerRef = useRef(null);
  const scrollRef = useRef(null);

  // Test configuration
  const TEST_DURATION = 20 * 60; // 20 minutes in seconds
  const SECTIONS = [
    { id: 1, title: 'Verbal Analogies', description: 'Complete the analogy' },
    { id: 2, title: 'Verbal Classification', description: 'Find the odd one out' },
    { id: 3, title: 'Coding & Decoding', description: 'Decode the pattern' }
  ];

  // Initialize test
  useEffect(() => {
    initializeTest();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [testId]);

  // Timer effect
  useEffect(() => {
    if (testStep === 'test' && testStartTime) {
      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - testStartTime) / 1000);
        const remaining = Math.max(0, TEST_DURATION - elapsed);
        setTimeRemaining(remaining);
        
        if (remaining === 0) {
          handleTimeUp();
        }
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [testStep, testStartTime]);

  // Initialize test with backend API
  const initializeTest = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch test questions from backend (secure - no correct answers)
      const fetchedQuestions = await fetchTestQuestions(testId);
      setQuestions(fetchedQuestions);
      setTestData({ questions: fetchedQuestions });
      
      setTestStep('test');
      setTestStartTime(Date.now());
      
    } catch (error) {
      console.error('Failed to initialize test:', error);
      setError('Failed to load test questions. Please try again.');
      setTestStep('error');
    } finally {
      setLoading(false);
    }
  };

  // Handle answer selection
  const handleAnswerSelect = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  // Handle section navigation
  const handleNextSection = () => {
    if (currentSection < SECTIONS.length) {
      setCurrentSection(prev => prev + 1);
      scrollToTop();
    }
  };

  const handlePrevSection = () => {
    if (currentSection > 1) {
      setCurrentSection(prev => prev - 1);
      scrollToTop();
    }
  };

  // Handle test submission with backend API
  const handleSubmitTest = async () => {
    try {
      setSubmitting(true);
      setError(null);

      // Validate answers before submission
      if (Object.keys(answers).length === 0) {
        setError('Please answer at least one question before submitting.');
        return;
      }

      // Submit to backend for scoring
      const result = await submitTestAttempt({
        testId,
        answers,
        startedAt: testStartTime,
        finishedAt: Date.now(),
        reason: 'user',
        metadata: {
          testType: 'verbal_reasoning',
          language,
          sections: SECTIONS.length,
          currentSection
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
      console.error('Error submitting test:', error);
      setError('Failed to submit test. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle time up
  const handleTimeUp = async () => {
    console.log('Time up! Auto-submitting test...');
    await handleSubmitTest();
  };

  // Handle exit confirmation
  const handleExitTest = () => {
    setShowExitConfirm(true);
  };

  const confirmExit = () => {
    scrollToTop();
    onBackToDashboard();
  };

  // Utility functions
  const scrollToTop = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getCurrentSectionQuestions = () => {
    if (!questions || questions.length === 0) return [];
    
    // Filter questions by section (assuming questions have section info)
    // This would need to be adapted based on your question structure
    return questions.filter(q => q.section === currentSection || !q.section);
  };

  // Loading state
  if (loading) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading Test</h2>
          <p className="text-gray-600">Preparing your verbal reasoning assessment...</p>
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
            onClick={initializeTest}
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

  // Results state
  if (testStep === 'results' && results) {
    return (
      <TestResultsPage
        results={results}
        testType="Verbal Reasoning"
        onBackToDashboard={onBackToDashboard}
        onRetakeTest={() => {
          setTestStep('test');
          setAnswers({});
          setResults(null);
          setCurrentSection(1);
          setTestStartTime(Date.now());
          setTimeRemaining(TEST_DURATION);
        }}
      />
    );
  }

  // Main test interface
  return (
    <div ref={scrollRef} className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <FaBook className="text-blue-600 text-xl mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">
                Verbal Reasoning Test
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Timer */}
              <div className="flex items-center text-lg font-mono">
                <FaClock className="text-blue-600 mr-2" />
                <span className={timeRemaining < 300 ? 'text-red-600' : 'text-gray-700'}>
                  {formatTime(timeRemaining)}
                </span>
              </div>
              
              {/* Exit button */}
              <button
                onClick={handleExitTest}
                className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
              >
                <FaHome className="mr-2" />
                Exit
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Section Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {SECTIONS.map((section) => (
              <button
                key={section.id}
                onClick={() => setCurrentSection(section.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  currentSection === section.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {section.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Test Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSection}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Section Header */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {SECTIONS[currentSection - 1]?.title}
              </h2>
              <p className="text-gray-600">
                {SECTIONS[currentSection - 1]?.description}
              </p>
            </div>

            {/* Questions */}
            <div className="space-y-6">
              {getCurrentSectionQuestions().map((question, index) => (
                <div key={question.id} className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-start mb-4">
                    <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded mr-3">
                      {index + 1}
                    </span>
                    <p className="text-gray-900 font-medium">
                      {question.question_text}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => (
                      <label
                        key={optionIndex}
                        className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                          answers[question.id] === String.fromCharCode(65 + optionIndex)
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question_${question.id}`}
                          value={String.fromCharCode(65 + optionIndex)}
                          checked={answers[question.id] === String.fromCharCode(65 + optionIndex)}
                          onChange={(e) => handleAnswerSelect(question.id, e.target.value)}
                          className="sr-only"
                        />
                        <span className="flex-shrink-0 w-6 h-6 border-2 rounded-full flex items-center justify-center mr-3">
                          {answers[question.id] === String.fromCharCode(65 + optionIndex) && (
                            <FaCheckCircle className="text-blue-600" />
                          )}
                        </span>
                        <span className="text-gray-900">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <button
                onClick={handlePrevSection}
                disabled={currentSection === 1}
                className="flex items-center px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaArrowLeft className="mr-2" />
                Previous
              </button>

              <div className="flex space-x-4">
                {currentSection < SECTIONS.length ? (
                  <button
                    onClick={handleNextSection}
                    className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Next Section
                    <FaArrowRight className="ml-2" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitTest}
                    disabled={submitting}
                    className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <FaFlag className="mr-2" />
                        Submit Test
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Exit Confirmation Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 max-w-md mx-4"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Exit Test?
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to exit? Your progress will be lost.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmExit}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Exit
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default VerbalReasoningTest;
