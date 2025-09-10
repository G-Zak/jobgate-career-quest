import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft, FaArrowRight, FaClock, FaCheckCircle, FaFlag } from 'react-icons/fa';
import { getAbstractTestWithAnswers } from '../data/abstractTestSections';
import { scrollToTop } from '../../../shared/utils/scrollUtils';
import { Button } from '@mui/material';

const AbstractReasoningTest = ({ onComplete, onBack }) => {
  const [testData, setTestData] = useState(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showInstructions, setShowInstructions] = useState(false); // Disable instructions - use TestInfoPage instead
  const [timeLeft, setTimeLeft] = useState(0);
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    const data = getAbstractTestWithAnswers();
    setTestData(data);
    setTimeLeft(data.duration_minutes * 60); // Convert to seconds
    // Start test immediately - instructions shown via TestInfoPage
    setShowInstructions(false);
    setTestStarted(true);
  }, []);

  useEffect(() => {
    if (testStarted && !testCompleted && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTestComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [testStarted, testCompleted, timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleStartTest = () => {
    setShowInstructions(false);
    setTestStarted(true);
    scrollToTop();
  };

  const handleAnswerSelect = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = () => {
    const section = testData.sections[currentSection];
    if (currentQuestion < section.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      handleTestComplete();
    }
    scrollToTop();
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      scrollToTop();
    }
  };

  const handleTestComplete = () => {
    setTestCompleted(true);
    clearInterval(timerRef.current);
    scrollToTop();
    
    // Calculate results
    const section = testData?.sections?.[currentSection];
    if (!section) return;
    
    // Calculate score (number of correct answers)
    let correctCount = 0;
    Object.entries(answers).forEach(([questionId, selectedAnswer]) => {
      const question = section.questions.find(q => q.id === parseInt(questionId));
      if (question && question.correct_answer === selectedAnswer) {
        correctCount++;
      }
    });
    
    const results = {
      testType: 'Abstract Reasoning',
      sectionTitle: section.title,
      totalQuestions: section.questions.length,
      answeredQuestions: Object.keys(answers).length,
      correctCount: correctCount,
      score: (correctCount / section.questions.length) * 100,
      answers: answers,
      correctAnswers: section.questions.reduce((acc, q) => {
        acc[q.id] = q.correct_answer;
        return acc;
      }, {}),
      timeSpent: testData.duration_minutes * 60 - timeLeft,
      completed: true
    };
    
    if (onComplete) {
      onComplete(results);
    }
  };

  if (!testData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Abstract Reasoning Test...</p>
        </div>
      </div>
    );
  }

  const section = testData?.sections?.[currentSection] || { questions: [] };
  const question = section?.questions?.[currentQuestion] || {};

  if (showInstructions) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-6"
      >
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-xl p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <FaFlag className="text-purple-600 text-3xl mr-3" />
                <h1 className="text-3xl font-bold text-gray-900">{section.intro_text.title}</h1>
              </div>
              <p className="text-xl text-gray-600">{section.description}</p>
            </div>

            {/* Instructions Image */}
            {section.intro_image && (
              <div className="mb-8 text-center">
                <img 
                  src={section.intro_image} 
                  alt="Abstract Reasoning Instructions"
                  className="max-w-full h-auto mx-auto rounded-lg shadow-md"
                  style={{ maxHeight: '300px' }}
                />
              </div>
            )}

            {/* Instructions List */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Instructions:</h3>
              <ul className="space-y-2">
                {section.intro_text.instructions.map((instruction, index) => (
                  <li key={index} className="text-gray-700 flex items-start">
                    {instruction && (
                      <>
                        <span className="text-purple-600 mr-2">•</span>
                        {instruction}
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Test Info */}
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <FaClock className="text-purple-600 text-2xl mx-auto mb-2" />
                <p className="font-semibold text-gray-900">{testData.duration_minutes} Minutes</p>
                <p className="text-sm text-gray-600">Time Limit</p>
              </div>
              <div className="bg-indigo-50 p-4 rounded-lg text-center">
                <FaCheckCircle className="text-indigo-600 text-2xl mx-auto mb-2" />
                <p className="font-semibold text-gray-900">{testData.total_questions} Questions</p>
                <p className="text-sm text-gray-600">Total Questions</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <FaFlag className="text-blue-600 text-2xl mx-auto mb-2" />
                <p className="font-semibold text-gray-900">Pattern Analysis</p>
                <p className="text-sm text-gray-600">Focus Area</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between">
              <button
                onClick={onBack}
                className="flex items-center px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                <FaArrowLeft className="mr-2" />
                Back to Tests
              </button>
              <button
                onClick={handleStartTest}
                className="flex items-center px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
              >
                Start Test
                <FaArrowRight className="ml-2" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (testCompleted) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-6"
      >
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-xl p-8 text-center">
            <FaCheckCircle className="text-green-600 text-6xl mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Test Completed!</h2>
            <p className="text-xl text-gray-600 mb-6">
              Your Abstract Reasoning test has been submitted successfully.
            </p>
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              {/* Score information */}
              <div className="mb-6">
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-purple-600 bg-purple-200">
                        Your Score
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-purple-600">
                        {Math.round((Object.values(answers).filter((answer, index) => {
                          const question = section.questions.find(q => q.id === parseInt(Object.keys(answers)[index]));
                          return question && question.correct_answer === answer;
                        }).length / section.questions.length) * 100)}%
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-purple-200">
                    <div style={{ width: `${Math.round((Object.values(answers).filter((answer, index) => {
                      const question = section.questions.find(q => q.id === parseInt(Object.keys(answers)[index]));
                      return question && question.correct_answer === answer;
                    }).length / section.questions.length) * 100)}%` }} 
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-600"></div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-center mb-4">
                <div>
                  <p className="text-2xl font-bold text-purple-600">
                    {Object.values(answers).filter((answer, index) => {
                      const question = section.questions.find(q => q.id === parseInt(Object.keys(answers)[index]));
                      return question && question.correct_answer === answer;
                    }).length} / {section.questions.length}
                  </p>
                  <p className="text-gray-600">Correct Answers</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-indigo-600">
                    {formatTime(testData.duration_minutes * 60 - timeLeft)}
                  </p>
                  <p className="text-gray-600">Time Spent</p>
                </div>
              </div>
              
              <p className="text-center text-gray-700">
                Your results will be processed and added to your profile.
              </p>
            </div>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              className="action-button"
              onClick={() => {
                if (typeof onBack === 'function') {
                  onBack();
                } else {
                  console.warn("onBack function was not provided to AbstractReasoningTest");
                }
              }}
            >
              Return to Dashboard
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100"
    >
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{section.title}</h1>
              <p className="text-gray-600">
                Question {currentQuestion + 1} of {section.questions.length}
              </p>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center text-lg font-semibold">
                <FaClock className="text-purple-600 mr-2" />
                <span className={timeLeft < 300 ? 'text-red-600' : 'text-gray-700'}>
                  {formatTime(timeLeft)}
                </span>
              </div>
              <button
                onClick={handleTestComplete}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Finish Test
              </button>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / section.questions.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Question Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-8"
          >
            {/* Question */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Question {currentQuestion + 1}
                </h2>
                <span className="text-sm text-gray-500">
                  Complexity: {question?.complexity_score || '?'}/5
                </span>
              </div>
              
              <p className="text-lg text-gray-700 mb-6">{question?.question || 'Loading question...'}</p>
              
              {/* Question Image */}
              {question?.image && (
                <div className="mb-8 text-center">
                  <img 
                    src={question.image} 
                    alt={`Abstract reasoning question ${question?.id || ''}`}
                    className="max-w-full h-auto mx-auto rounded-lg shadow-md bg-gray-50"
                    style={{ maxHeight: '500px' }}
                  />
                </div>
              )}
              
              {/* Answer Options */}
              <div className={`grid gap-4 ${question?.options?.length === 5 ? 'grid-cols-2 md:grid-cols-5' : 'grid-cols-2 md:grid-cols-4'}`}>
                {question?.options?.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleAnswerSelect(question.id, option.toLowerCase())}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                      answers[question.id] === option.toLowerCase()
                        ? 'border-purple-600 bg-purple-50 text-purple-700'
                        : 'border-gray-200 hover:border-purple-300 bg-white'
                    }`}
                  >
                    <span className="text-lg font-semibold">{option}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center pt-6 border-t">
              <button
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className={`flex items-center px-6 py-3 rounded-lg transition-colors ${
                  currentQuestion === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-500 text-white hover:bg-gray-600'
                }`}
              >
                <FaArrowLeft className="mr-2" />
                Previous
              </button>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  {answers[question.id] ? 'Answer selected' : 'Select an answer'}
                </p>
              </div>

              <button
                onClick={handleNext}
                className="flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                {currentQuestion === section.questions.length - 1 ? 'Complete Test' : 'Next'}
                <FaArrowRight className="ml-2" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default AbstractReasoningTest;
