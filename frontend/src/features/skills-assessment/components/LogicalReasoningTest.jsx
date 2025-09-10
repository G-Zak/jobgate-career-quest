import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaClock, FaBrain, FaCheckCircle, FaTimesCircle, FaStop, FaArrowRight, FaFlag, FaCog, FaSearch, FaLightbulb, FaPuzzlePiece } from 'react-icons/fa';
import { useScrollToTop, useTestScrollToTop, useQuestionScrollToTop, scrollToTop } from '../../../shared/utils/scrollUtils';
import { getLogicalTestSections } from '../data/logicalTestSections';

const LogicalReasoningTest = ({ onBackToDashboard }) => {
  const [testStep, setTestStep] = useState('test'); // Skip instructions - start directly with test
  const [currentSection, setCurrentSection] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(10 * 60); // 10 minutes per section
  const [answers, setAnswers] = useState({});
  const [testData, setTestData] = useState(null);
  const [loading, setLoading] = useState(true);

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
            handleNextSection();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [testStep, timeRemaining]);

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

  const handleFinishTest = () => {
    setTestStep('results');
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
      <div className="w-full bg-gray-50 flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading test...</p>
        </div>
      </div>
    );
  }

  if (!testData) {
    return (
      <div className="w-full bg-gray-50 flex items-center justify-center py-20">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Test Not Available</h2>
          <p className="text-gray-600 mb-4">Unable to load the test data. Please try again.</p>
          <button
            onClick={onBackToDashboard}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div id="logical-test-root" className="relative min-h-screen">
      {/* Fixed gradient background */}
      <div id="logical-bg" className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-50 to-purple-50" aria-hidden="true" />
      
      {/* Local scroll container: only test area scrolls */}
      <div 
        id="logical-test-scroll" 
        className="test-scroll-container relative h-[calc(100vh-7rem)] overflow-y-auto overflow-x-hidden"
        data-scroll-container="logical-test"
      >
        {/* Test Header - Sticky within local container */}
        <div id="logical-test-header" className="bg-white shadow-sm border-b border-gray-200 p-4 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <button
              onClick={onBackToDashboard}
              className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </button>
            <h1 className="text-xl font-semibold text-gray-800">{testData.title}</h1>
            {testStep === 'test' && (
              <div className="flex items-center space-x-6">
                <div className="flex items-center text-blue-600">
                  <FaClock className="mr-2" />
                  <span className="font-mono text-lg">{formatTime(timeRemaining)}</span>
                </div>
                <span className="text-gray-500">
                  Section {currentSection} - Question {currentQuestion} of 20
                </span>
                <button
                  onClick={handleAbortTest}
                  className="flex items-center px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors font-medium"
                  title="Abort Test"
                >
                  <FaStop className="mr-2" />
                  Abort Test
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content within local scroll container */}
        <div>
          {/* Instructions Step */}
          {testStep === 'instructions' && (
            <motion.div id="logical-instructions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto px-6 py-12"
            >
              <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Logical Reasoning Test Instructions</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">Test Overview</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li>• <strong>Total Duration:</strong> 40 minutes (10 minutes per section)</li>
                      <li>• <strong>Total Questions:</strong> 80 questions (20 per section)</li>
                      <li>• <strong>Sections:</strong> 4 sections covering different logical reasoning skills</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">Test Sections</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {testData.sections.map((section) => (
                        <div key={section.id} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                          {getSectionIcon(section.id)}
                          <div>
                            <h4 className="font-semibold text-gray-800">{section.title}</h4>
                            <p className="text-sm text-gray-600">{section.description}</p>
                            <p className="text-xs text-gray-500 mt-1">20 questions • 10 minutes</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">Instructions</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li>• Each section is timed separately (10 minutes each)</li>
                      <li>• Read each question carefully and select the best answer</li>
                      <li>• You can navigate between questions within a section</li>
                      <li>• Your answers are automatically saved</li>
                      <li>• The test will automatically move to the next section when time runs out</li>
                      <li>• Ensure you have a quiet environment for optimal concentration</li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-2">Important Notes:</h4>
                    <ul className="space-y-1 text-blue-700 text-sm">
                      <li>• You cannot return to previous sections once completed</li>
                      <li>• Make sure to answer all questions in each section before time runs out</li>
                      <li>• Take your time to understand each question thoroughly</li>
                      <li>• If unsure, make your best educated guess</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-8 text-center">
                  <button
                    onClick={handleStartTest}
                    className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg"
                  >
                    Start Test
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Test Step */}
          {testStep === 'test' && (
            <div id="logical-test-content" className="max-w-5xl mx-auto px-6 py-8 mt-8 md:mt-10">
              {/* Section Header */}
              <div className="mb-6">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getSectionIcon(currentSection)}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          Section {currentSection}: {getCurrentSection()?.title}
                        </h3>
                        <p className="text-sm text-gray-600">{getCurrentSection()?.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Time Remaining</div>
                      <div className="text-lg font-mono font-bold text-blue-600">{formatTime(timeRemaining)}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Section Progress</span>
                  <span>{Math.round((currentQuestion / 20) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(currentQuestion / 20) * 100}%` }}
                  ></div>
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div id="logical-question-card"
                  key={`${currentSection}-${currentQuestion}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-lg shadow-sm p-8 border border-gray-200 relative z-0"
                >
                  {(() => {
                    const question = getCurrentQuestion();
                    if (!question) return null;

                    return (
                      <div>
                        {/* Question Header */}
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center space-x-3">
                            {getSectionIcon(currentSection)}
                            <div>
                              <h3 className="text-lg font-semibold text-gray-800">
                                Question {currentQuestion}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {getCurrentSection()?.title}
                              </p>
                            </div>
                          </div>
                          <span className="text-sm text-gray-400">
                            {currentQuestion} of 20
                          </span>
                        </div>

                        {/* Question Text */}
                        <div className="mb-6">
                          <h4 className="text-lg font-medium text-gray-800 mb-4 leading-relaxed">
                            {question.question}
                          </h4>

                          {/* Answer Options */}
                          <div className="space-y-3">
                            {question.options.map((option, index) => {
                              const optionLetter = String.fromCharCode(65 + index); // A, B, C, D
                              const isSelected = answers[question.id] === optionLetter;

                              return (
                                <button
                                  key={index}
                                  onClick={() => handleAnswerSelect(question.id, optionLetter)}
                                  className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                                    isSelected
                                      ? 'border-blue-500 bg-blue-50 shadow-md'
                                      : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                                  }`}
                                >
                                  <div className="flex items-center space-x-3">
                                    <div
                                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-medium ${
                                        isSelected
                                          ? 'border-blue-500 bg-blue-500 text-white'
                                          : 'border-gray-300 text-gray-500'
                                      }`}
                                    >
                                      {optionLetter}
                                    </div>
                                    <span className="text-gray-700">{option}</span>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex justify-between items-center pt-4">
                          <button
                            onClick={handlePreviousQuestion}
                            disabled={currentQuestion === 1}
                            className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                              currentQuestion === 1
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:shadow-md'
                            }`}
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Previous
                          </button>

                          {currentQuestion === 20 ? (
                            currentSection === testData.sections.length ? (
                              <button
                                onClick={handleFinishTest}
                                className="flex items-center px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                              >
                                <FaFlag className="mr-2" />
                                Finish Test
                              </button>
                            ) : (
                              <button
                                onClick={handleNextSection}
                                className="flex items-center px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                              >
                                Next Section
                                <FaArrowRight className="ml-2" />
                              </button>
                            )
                          ) : (
                            <button
                              onClick={handleNextQuestion}
                              disabled={!answers[question.id]}
                              className={`flex items-center px-8 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg ${
                                !answers[question.id]
                                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                                  : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 hover:shadow-xl transform hover:scale-105'
                              }`}
                            >
                              Next
                              <FaArrowRight className="ml-2" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </motion.div>
              </AnimatePresence>
            </div>
          )}

          {/* Results Step */}
          {testStep === 'results' && (
            <motion.div id="logical-results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto px-6 py-12"
            >
              <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200 text-center">
                <div className="mb-6">
                  <FaCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Test Completed!</h2>
                  <p className="text-gray-600">Your logical reasoning assessment has been submitted.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-800">Questions Answered</h3>
                    <p className="text-2xl font-bold text-blue-600">{getTotalAnswered()}</p>
                    <p className="text-sm text-blue-600">of {getTotalQuestions()}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-green-800">Sections Completed</h3>
                    <p className="text-2xl font-bold text-green-600">{testData.sections.length}</p>
                    <p className="text-sm text-green-600">All sections</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-purple-800">Status</h3>
                    <p className="text-2xl font-bold text-purple-600">Complete</p>
                    <p className="text-sm text-purple-600">Submitted successfully</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-gray-600">
                    Your results will be processed and available in your dashboard shortly.
                  </p>
                  <button
                    onClick={onBackToDashboard}
                    className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                  >
                    Return to Dashboard
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LogicalReasoningTest;
