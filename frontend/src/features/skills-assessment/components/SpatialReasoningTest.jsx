import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaClock, FaCube, FaStop, FaArrowRight, FaFlag, FaSync, FaSearchPlus, FaExpand, FaEye, FaImage, FaLayerGroup, FaPause, FaPlay, FaTimes } from 'react-icons/fa';
import { getSpatialTestSections, getSpatialSection1, getSpatialSection2, getSpatialSection3, getSpatialSection4, getSpatialSection5, getSpatialSection6 } from '../data/spatialTestSections';
import { useScrollToTop, useTestScrollToTop, useQuestionScrollToTop, scrollToTop } from '../../../shared/utils/scrollUtils';
import { submitTestAttempt } from '../lib/submitHelper';
import TestResultsPage from './TestResultsPage';

const SpatialReasoningTest = ({ onBackToDashboard, testId = null }) => {
  // Determine starting section based on testId
  const getStartingSection = (testId) => {
    if (typeof testId === 'string') {
      if (testId === 'SRT1') return 1;
      if (testId === 'SRT2') return 2;
      if (testId === 'SRT3') return 3;
      if (testId === 'SRT4') return 4;
      if (testId === 'SRT5') return 5;
      if (testId === 'SRT6') return 6;
      const match = testId.match(/SRT(\d+)/);
      if (match) {
        const sectionNum = parseInt(match[1]);
        return sectionNum <= 6 ? sectionNum : 1;
      }
    }
    return 1;
  };

  const startingSection = getStartingSection(testId);
  
  const [testStep, setTestStep] = useState('test');
  const [currentSection, setCurrentSection] = useState(startingSection);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(45 * 60);
  const [answers, setAnswers] = useState({});
  const [testData, setTestData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [startedAt, setStartedAt] = useState(null);
  const [results, setResults] = useState(null);

  const testContainerRef = useRef(null);

  // Universal scroll management
  useScrollToTop([], { smooth: true });
  useTestScrollToTop(testStep, testContainerRef, { smooth: true, attempts: 5 });
  useTestScrollToTop(currentSection, testContainerRef, { smooth: true, attempts: 3 });
  useQuestionScrollToTop(currentQuestion, testStep, testContainerRef);

  // Load spatial reasoning test data
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
        
        setTestData(data);
        setStartedAt(new Date());
        
        if (data.sections && data.sections[startingSection - 1]) {
          const sectionDuration = data.sections[startingSection - 1].duration_minutes * 60;
          setTimeRemaining(sectionDuration);
        } else {
          setTimeRemaining(data.duration_minutes * 60);
        }
        
      } catch (error) {
        console.error('Error loading spatial test data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadSpatialTestData();
  }, [startingSection, testId]);

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
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getCurrentSection = () => {
    return testData?.sections?.find(section => section.id === currentSection);
  };

  const getCurrentQuestion = () => {
    const section = getCurrentSection();
    return section?.questions?.find(q => q.order === currentQuestion);
  };

  const getTotalQuestions = () => {
    return testData?.sections?.reduce((total, section) => total + section.total_questions, 0) || 0;
  };

  const getTotalAnswered = () => {
    return Object.keys(answers).length;
  };

  const getGlobalQuestionNumber = () => {
    if (!testData?.sections) return currentQuestion;
    
    let globalNum = 0;
    for (let i = 0; i < testData.sections.length; i++) {
      const section = testData.sections[i];
      if (section.id === currentSection) {
        return globalNum + currentQuestion;
      }
      globalNum += section.total_questions;
    }
    return globalNum + currentQuestion;
  };

  const handleAnswerSelect = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [`${currentSection}_${questionId}`]: answer
    }));
  };

  const handleNextQuestion = () => {
    const section = getCurrentSection();
    if (currentQuestion < section.total_questions) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      const nextSection = testData.sections.find(s => s.id === currentSection + 1);
      if (nextSection) {
        setCurrentSection(currentSection + 1);
        setCurrentQuestion(1);
      } else {
        handleFinishTest();
      }
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(prev => prev - 1);
    } else {
      const prevSection = testData.sections.find(s => s.id === currentSection - 1);
      if (prevSection) {
        setCurrentSection(currentSection - 1);
        setCurrentQuestion(prevSection.total_questions);
      }
    }
  };

  const handleFinishTest = async () => {
    try {
      // Generate the testId based on the current section or provided testId
      const finalTestId = testId || `SRT${currentSection}`;
      
      // Submit the test using unified scoring
      const result = await submitTestAttempt({
        testId: finalTestId,
        testVersion: '1.0',
        language: 'en',
        answers,
        testData,
        startedAt
      });
      
      setResults(result);
      setTestStep('results');
    } catch (error) {
      console.error('Error submitting test:', error);
      setTestStep('results'); // Still show results even if submission fails
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-32 w-32 border-4 border-purple-200 border-t-purple-600 mx-auto mb-8"></div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Loading Spatial Reasoning Test</h3>
          <p className="text-gray-600">Preparing your assessment...</p>
        </motion.div>
      </div>
    );
  }

  if (error || !testData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center">
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
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors font-medium"
          >
            Back to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
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
                <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Spatial Reasoning Test
                </div>
                <div className="text-sm text-gray-600">
                  Section {currentSection} of {testData?.sections?.length || 6} • Question {currentQuestion} of {getCurrentSection()?.total_questions || 0}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-gray-500">Time Remaining</div>
                <div className={`text-xl font-bold font-mono ${timeRemaining <= 60 ? 'text-red-500' : 'text-purple-600'}`}>
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
        {testStep === 'test' && getCurrentQuestion() && (
          <div className="flex flex-col gap-6">
            {/* Section Info & Progress Card */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-8 border border-white/20"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <FaLayerGroup className="text-purple-600 text-2xl" />
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      {getCurrentSection()?.title}
                    </h2>
                    <p className="text-gray-600 mt-1">
                      {getCurrentSection()?.question_type?.replace('_', ' ')?.replace(/\b\w/g, l => l.toUpperCase())}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Section Progress</div>
                  <div className="text-2xl font-bold text-purple-600">
                    {currentQuestion}/{getCurrentSection()?.total_questions}
                  </div>
                </div>
              </div>

              {/* Enhanced Progress Bar */}
              <div className="relative">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Progress</span>
                  <span>{Math.round((currentQuestion / (getCurrentSection()?.total_questions || 1)) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(currentQuestion / (getCurrentSection()?.total_questions || 1)) * 100}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full shadow-sm"
                  />
                </div>
              </div>
            </motion.section>

            {/* Question Card */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg border border-white/20 overflow-hidden"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${currentSection}-${currentQuestion}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="p-8"
                >
                  {(() => {
                    const question = getCurrentQuestion();
                    if (!question) return null;

                    return (
                      <div>
                        {/* Question Header */}
                        <div className="flex items-center justify-between mb-8">
                          <div className="flex items-center gap-3">
                            <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl text-white">
                              <FaCube className="w-5 h-5" />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-gray-800">
                                Question {currentQuestion}
                              </h3>
                              <p className="text-gray-600">
                                {getCurrentSection()?.title}
                              </p>
                            </div>
                          </div>
                          <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                            {currentQuestion} of {getCurrentSection()?.total_questions}
                          </div>
                        </div>

                        {/* Question Text */}
                        <div className="mb-8">
                          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 mb-6">
                            <h4 className="text-lg font-medium text-gray-800 leading-relaxed mb-4">
                              {question.question_text}
                            </h4>
                            {question.context && (
                              <p className="text-gray-600 text-sm bg-white/70 p-3 rounded-lg">
                                💡 {question.context}
                              </p>
                            )}
                          </div>

                          {/* Visual Content */}
                          <div className="mb-6">
                            <div className="bg-gray-50 rounded-xl p-6 flex items-center justify-center">
                              <img 
                                src={question.question_image} 
                                alt="Question visual"
                                className="max-w-full max-h-96 object-contain rounded-lg shadow-md"
                                onError={(e) => {
                                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDYwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI2MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMzAgMjAwQzIzMCAxODQuNTM2IDI0Mi41MzYgMTcyIDI1OCAxNzJIMzQyQzM1Ny40NjQgMTcyIDM3MCAyODQuNTM2IDM3MCAyMDBDMzcwIDIxNS40NjQgMzU3LjQ2NCAyMjggMzQyIDIyOEgyNThDMjQyLjUzNiAyMjggMjMwIDIxNS40NjQgMjMwIDIwMFoiIGZpbGw9IiM5Q0E4RjAiLz4KPHR9CJHD0YXQgCBjbGFzcz0ic21hbGwiIGZpbGw9IiM2Rjc1ODciIGZvbnQtZmFtaWx5PSJzeXN0ZW0tdWkiIGZvbnQtc2l6ZT0iMTYiIGZvbnQtd2VpZ2h0PSI1MDAiPgogIDx0c3BhbiB4PSIzMDAiIHk9IjIwOCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+UXVlc3Rpb24gSW1hZ2U8L3RzcGFuPgo8L3RleHQ+Cjwvc3ZnPgo=';
                                }}
                              />
                            </div>
                            <div className="mt-2 text-sm text-gray-500 text-center">
                              Complexity: {question.complexity_score}/5
                            </div>
                          </div>

                          {/* Answer Options - Vertical Layout */}
                          <div className="space-y-3">
                            <h3 className="text-lg font-semibold mb-4">Select your answer:</h3>
                            <div className="flex justify-center gap-4">
                              {(getCurrentSection()?.question_type === 'mental_rotation' ? ['A', 'B', 'C', 'D'] : ['A', 'B', 'C', 'D', 'E']).map((letter) => {
                                const isSelected = answers[`${currentSection}_${question.id}`] === letter;

                                return (
                                  <motion.button
                                    key={letter}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleAnswerSelect(question.id, letter)}
                                    className={`w-16 h-16 rounded-xl border-2 font-bold text-xl transition-all duration-200 ${
                                      isSelected
                                        ? 'border-purple-500 bg-purple-500 text-white shadow-lg shadow-purple-100'
                                        : 'border-gray-300 bg-white text-gray-700 hover:border-purple-300 hover:bg-purple-50'
                                    }`}
                                  >
                                    {letter}
                                  </motion.button>
                                );
                              })}
                            </div>
                            <p className="text-sm text-gray-500 text-center mt-4">
                              Click the letter that corresponds to the correct answer
                            </p>
                          </div>
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                          <button
                            onClick={handlePreviousQuestion}
                            disabled={currentQuestion === 1 && currentSection === 1}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                              currentQuestion === 1 && currentSection === 1
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:shadow-md'
                            }`}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Previous
                          </button>

                          {currentQuestion === getCurrentSection()?.total_questions ? (
                            currentSection === testData.sections.length ? (
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleFinishTest}
                                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                              >
                                <FaFlag />
                                Finish Test
                              </motion.button>
                            ) : (
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleNextQuestion}
                                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                              >
                                Next Section
                                <FaArrowRight />
                              </motion.button>
                            )
                          ) : (
                            <motion.button
                              whileHover={{ scale: answers[`${currentSection}_${question.id}`] ? 1.05 : 1 }}
                              whileTap={{ scale: answers[`${currentSection}_${question.id}`] ? 0.95 : 1 }}
                              onClick={handleNextQuestion}
                              disabled={!answers[`${currentSection}_${question.id}`]}
                              className={`flex items-center gap-2 px-8 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg ${
                                !answers[`${currentSection}_${question.id}`]
                                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                                  : 'bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 hover:shadow-xl'
                              }`}
                            >
                              Next
                              <FaArrowRight />
                            </motion.button>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </motion.div>
              </AnimatePresence>
            </motion.section>
          </div>
        )}

        {/* Results Step */}
        {testStep === 'results' && (
          <TestResultsPage
            results={results}
            testType="spatial"
            testId={testId || `SRT${currentSection}`}
            answers={answers}
            testData={testData}
            onBackToDashboard={onBackToDashboard}
            onRetakeTest={() => window.location.reload()}
          />
        )}
      </div>

      {/* Pause Modal */}
      <AnimatePresence>
        {showPauseModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaPause className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Test Paused</h3>
                <p className="text-gray-600 mb-6">
                  Your test is paused. The timer is stopped. Click resume when you're ready to continue.
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={handleResumeTest}
                    className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors font-medium"
                  >
                    <FaPlay className="w-4 h-4" />
                    Resume Test
                  </button>
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaTimes className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Exit Test?</h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to exit? Your progress will be lost and you'll need to start over.
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={cancelExitTest}
                    className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmExitTest}
                    className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors font-medium"
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

export default SpatialReasoningTest;
