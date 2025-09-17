import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaClock, FaBrain, FaCheckCircle, FaTimesCircle, FaStop, FaArrowRight, FaFlag, FaPuzzlePiece } from 'react-icons/fa';
// Removed complex scroll utilities - using simple scrollToTop function instead
import { getLRT3TestSections } from '../data/lrt3TestSections';

const LRT3Test = ({ onBackToDashboard }) => {
  const [testStep, setTestStep] = useState('test'); // Skip instructions - start directly with test
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(10 * 60); // 10 minutes
  const [answers, setAnswers] = useState({});
  const [testData, setTestData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Universal scroll management using scroll utilities
  useScrollToTop([], { smooth: true }); // Scroll on component mount
  useTestScrollToTop(testStep, 'lrt3-test-scroll', { smooth: true, attempts: 5 }); // Scroll on test step changes
  useQuestionScrollToTop(currentQuestion, testStep, 'lrt3-test-scroll'); // Scroll on question changes

  // Load test data
  useEffect(() => {
    try {
      setLoading(true);
      const data = getLRT3TestSections();
      setTestData(data);
      setTimeRemaining(10 * 60); // 10 minutes
    } catch (error) {
      console.error('Error loading test data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

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

  // Get current section data
  const getCurrentSection = () => {
    return testData?.sections?.[0]; // Only one section for LRT3
  };

  // Get current question data
  const getCurrentQuestion = () => {
    const section = getCurrentSection();
    return section?.questions?.[currentQuestion - 1];
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
    if (currentQuestion < 20) {
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
  const handleFinishTest = () => {
    setTestStep('results');
    scrollToTop('lrt3-test-scroll');
  };

  // Calculate results
  const calculateResults = () => {
    const section = getCurrentSection();
    if (!section) return { score: 0, total: 0, percentage: 0, passed: false };

    let correct = 0;
    const total = section.questions.length;

    section.questions.forEach(question => {
      const userAnswer = answers[question.id];
      if (userAnswer === question.correct_answer) {
        correct++;
      }
    });

    const percentage = Math.round((correct / total) * 100);
    const passed = percentage >= 70; // 70% passing grade

    return { score: correct, total, percentage, passed };
  };

  // Start test
  const handleStartTest = () => {
    setTestStep('test');
    setCurrentQuestion(1);
    setTimeRemaining(10 * 60);
    scrollToTop('lrt3-test-scroll');
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

  if (!testData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <FaTimesCircle className="text-6xl text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Test</h2>
          <p className="text-gray-600 mb-4">Unable to load test data. Please try again.</p>
          <button
            onClick={onBackToDashboard}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div id="lrt3-test-scroll" className="container mx-auto px-4 py-8">
        
        {/* Instructions */}
        {testStep === 'instructions' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-center mb-8">
                <FaPuzzlePiece className="text-6xl text-blue-600 mx-auto mb-4" />
                <h1 className="text-4xl font-bold text-gray-800 mb-2">{testData.title}</h1>
                <p className="text-xl text-gray-600">{testData.description}</p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-6 bg-blue-50 rounded-lg">
                  <FaFlag className="text-3xl text-blue-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-800">Questions</h3>
                  <p className="text-2xl font-bold text-blue-600">{testData.totalQuestions}</p>
                </div>
                <div className="text-center p-6 bg-green-50 rounded-lg">
                  <FaClock className="text-3xl text-green-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-800">Time Limit</h3>
                  <p className="text-2xl font-bold text-green-600">{testData.totalTime} minutes</p>
                </div>
                <div className="text-center p-6 bg-purple-50 rounded-lg">
                  <FaBrain className="text-3xl text-purple-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-800">Section</h3>
                  <p className="text-2xl font-bold text-purple-600">Practice</p>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Instructions:</h3>
                <div className="bg-gray-50 rounded-lg p-6">
                  <p className="text-gray-700 leading-relaxed">
                    {getCurrentSection()?.instructions}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <button
                  onClick={onBackToDashboard}
                  className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Back to Dashboard
                </button>
                <button
                  onClick={handleStartTest}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  Start Test
                </button>
              </div>
            </div>
          </motion.div>
        )}

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
                  <h1 className="text-2xl font-bold text-gray-800">LRT3 - Additional Number Series Practice</h1>
                  <p className="text-gray-600">Additional practice with number series questions</p>
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
                  <span className="text-sm font-medium text-gray-700">{Math.round((currentQuestion / 20) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(currentQuestion / 20) * 100}%` }}
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
                      <p className="text-sm text-gray-500">Additional Number Series Practice</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{currentQuestion} of 20</span>
                </div>

                {/* Question */}
                <div className="mb-8">
                  <p className="text-lg text-gray-800 leading-relaxed mb-6">
                    {getCurrentQuestion()?.question}
                  </p>

                  {/* Options */}
                  <div className="space-y-3">
                    {getCurrentQuestion()?.options?.map((option, index) => {
                      const optionLetter = String.fromCharCode(97 + index); // a, b, c, d, e
                      const isSelected = answers[getCurrentQuestion()?.id] === optionLetter;
                      
                      return (
                        <button
                          key={index}
                          onClick={() => handleAnswerSelect(optionLetter)}
                          className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                            isSelected 
                              ? 'border-blue-500 bg-blue-50 text-blue-700' 
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <span className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium ${
                              isSelected 
                                ? 'border-blue-500 bg-blue-500 text-white' 
                                : 'border-gray-300 text-gray-600'
                            }`}>
                              {optionLetter.toUpperCase()}
                            </span>
                            <span className="text-gray-800">{option}</span>
                          </div>
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
                      {currentQuestion === 20 ? 'Finish' : 'Next'}
                      <FaArrowRight className="inline ml-2" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}

        {/* Results */}
        {testStep === 'results' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-center mb-8">
                {calculateResults().passed ? (
                  <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
                ) : (
                  <FaTimesCircle className="text-6xl text-red-500 mx-auto mb-4" />
                )}
                <h1 className="text-4xl font-bold text-gray-800 mb-2">Test Complete!</h1>
                <p className="text-xl text-gray-600">LRT3 - Additional Number Series Practice Results</p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-6 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-2">Score</h3>
                  <p className="text-3xl font-bold text-blue-600">
                    {calculateResults().score}/{calculateResults().total}
                  </p>
                </div>
                <div className="text-center p-6 bg-green-50 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-2">Percentage</h3>
                  <p className="text-3xl font-bold text-green-600">{calculateResults().percentage}%</p>
                </div>
                <div className="text-center p-6 bg-purple-50 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-2">Result</h3>
                  <p className={`text-3xl font-bold ${calculateResults().passed ? 'text-green-600' : 'text-red-600'}`}>
                    {calculateResults().passed ? 'PASSED' : 'FAILED'}
                  </p>
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={onBackToDashboard}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default LRT3Test;
