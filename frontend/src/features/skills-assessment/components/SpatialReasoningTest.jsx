import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaClock, FaCube, FaStop, FaArrowRight, FaFlag, FaSync, FaSearchPlus, FaExpand, FaEye, FaImage, FaLayerGroup, FaPlay, FaTimes, FaCheckCircle } from 'react-icons/fa';
import { getSpatialTestSections, getSpatialSection1, getSpatialSection2, getSpatialSection3, getSpatialSection4, getSpatialSection5, getSpatialSection6 } from '../data/spatialTestSections';
import { useScrollToTop, useTestScrollToTop, useQuestionScrollToTop, scrollToTop } from '../../../shared/utils/scrollUtils';
import { submitTestAttempt } from '../lib/submitHelper';
import TestResultsPage from './TestResultsPage';
import { getRuleFor, buildAttempt } from '../testRules';
import { saveAttempt } from '../lib/attemptStorage';

const SpatialReasoningTest = ({ onBackToDashboard, testId = 'spatial' }) => {
  const rule = getRuleFor(testId);
  
  const [testStep, setTestStep] = useState('test');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(rule?.timeLimitMin * 60 || 20 * 60);
  const [answers, setAnswers] = useState({});
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showExitModal, setShowExitModal] = useState(false);
  const [startedAt, setStartedAt] = useState(null);
  const [results, setResults] = useState(null);

  const testContainerRef = useRef(null);

  // Universal scroll management
  useScrollToTop([], { smooth: true });
  useTestScrollToTop(testStep, testContainerRef, { smooth: true, attempts: 5 });
  useQuestionScrollToTop(currentQuestionIndex, testStep, testContainerRef);

  // Load spatial reasoning test data and select 20 questions
  useEffect(() => {
    const loadSpatialTestData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let data;
        if (testId === 'SRT1') {
          data = getSpatialSection1();
        } else if (testId === 'SRT2') {
          data = getSpatialSection2();
        } else if (testId === 'SRT3') {
          data = getSpatialSection3();
        } else if (testId === 'SRT4') {
          data = getSpatialSection4();
        } else if (testId === 'SRT5') {
          data = getSpatialSection5();
        } else if (testId === 'SRT6') {
          data = getSpatialSection6();
        } else {
          data = getSpatialTestSections();
        }
        
        // If data has sections, select 20 questions from the first section
        if (data.sections && data.sections.length > 0) {
          const section = data.sections[0]; // Use first section
          const allQuestions = section.questions || [];
          
          // Randomly select 20 questions from the available 40
          const shuffled = allQuestions.sort(() => Math.random() - 0.5);
          const selectedQuestions = shuffled.slice(0, rule?.totalQuestions || 20);
          
          setQuestions(selectedQuestions);
        } else if (data.questions) {
          // If data has direct questions, select 20
          const allQuestions = data.questions;
          const shuffled = allQuestions.sort(() => Math.random() - 0.5);
          const selectedQuestions = shuffled.slice(0, rule?.totalQuestions || 20);
          
          setQuestions(selectedQuestions);
        }
        
        setTimeRemaining(rule?.timeLimitMin * 60 || 20 * 60);
        setStartedAt(new Date());
        
      } catch (error) {
        console.error('Error loading spatial test data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadSpatialTestData();
  }, [testId, rule]);

  // Timer effect
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
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleFinishTest = async () => {
    try {
      const totalQuestions = rule?.totalQuestions || 20;
      const correctAnswers = Object.values(answers).filter(answer => answer === true).length;
      const percentage = Math.round((correctAnswers / totalQuestions) * 100);
      const finishedAt = new Date();
      const duration = Math.round((finishedAt - startedAt) / 1000);

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
      setTestStep('results');
    } catch (error) {
      console.error('Error finishing test:', error);
      setTestStep('results');
    }
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
            <FaCube className="w-8 h-8 text-blue-600 animate-pulse" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading Test</h2>
          <p className="text-gray-600">Preparing your spatial reasoning assessment...</p>
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
        testType="spatial"
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
    <div className="min-h-screen bg-gray-50" ref={testContainerRef}>
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
                Spatial Reasoning Test
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
                <FaCube className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  Question {currentQuestionIndex + 1}
                </h3>
                <p className="text-gray-600">
                  Spatial Reasoning Assessment
                </p>
              </div>
            </div>
            <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {currentQuestionIndex + 1} of {rule?.totalQuestions || 20}
            </div>
          </div>

          {/* Question Content */}
          <div className="mb-8">
            {/* Question Image */}
            {currentQuestion?.question_image && (
              <div className="mb-6">
                <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                  <img
                    src={currentQuestion.question_image}
                    alt={`Question ${currentQuestionIndex + 1}`}
                    className="max-w-full h-auto mx-auto rounded-lg shadow-sm"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              </div>
            )}

            {/* Question Text */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
              <h4 className="text-lg font-medium text-gray-800 leading-relaxed">
                {currentQuestion?.question_text || currentQuestion?.question}
              </h4>
              {currentQuestion?.context && (
                <p className="text-gray-600 mt-2 text-sm">
                  {currentQuestion.context}
                </p>
              )}
            </div>

            {/* Answer Options */}
            <div className="space-y-3">
              {currentQuestion?.options?.map((option, index) => {
                const optionLetter = option.id || String.fromCharCode(65 + index);
                const isSelected = answers[currentQuestion.id] === optionLetter;

                return (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleAnswerSelect(currentQuestion.id, optionLetter)}
                    className={`w-full text-left p-6 rounded-xl border-2 transition-all duration-200 ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-100'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        isSelected
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {optionLetter}
                      </div>
                      <span className="text-gray-800 font-medium">{option.text || option}</span>
                      {isSelected && <FaCheckCircle className="ml-auto text-blue-500" />}
                    </div>
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
                <FaTimes className="w-8 h-8 text-red-600" />
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

export default SpatialReasoningTest;