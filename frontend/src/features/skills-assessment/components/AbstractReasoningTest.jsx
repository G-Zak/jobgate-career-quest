import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBrain, FaClock, FaStop, FaArrowRight, FaFlag, FaEye, FaQuestionCircle } from 'react-icons/fa';
import { useScrollToTop, useTestScrollToTop, useQuestionScrollToTop, scrollToTop } from '../../../shared/utils/scrollUtils';
import TestDataService from '../services/testDataService';

const AbstractReasoningTest = ({ onBackToDashboard, onTestComplete }) => {
  const [testStep, setTestStep] = useState('instructions');
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(25);
  const [timeRemaining, setTimeRemaining] = useState(15 * 60);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState({});
  const [testData, setTestData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState(null);

  const testContainerRef = useRef(null);

  // Universal scroll management using scroll utilities
  useScrollToTop([], { smooth: true });
  useTestScrollToTop(testStep, testContainerRef);
  useQuestionScrollToTop(questionNumber, testStep, testContainerRef);

  // Timer effect
  useEffect(() => {
    let timer;
    
    if (testStep === 'test' && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleFinishTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [testStep, timeRemaining]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const startTest = async () => {
    try {
      // Load test data from backend
      const testData = await TestDataService.fetchTestQuestions('ART1');
      setTestData(testData.questions || []);
      setCurrentQuestion(testData.questions?.[0] || null);
      setQuestionNumber(1);
      setTotalQuestions(testData.questions?.length || 25);
      setTestStep('test');
      setTimeRemaining(15 * 60);
      console.log('Abstract test started with', testData.questions?.length || 0, 'questions');
    } catch (error) {
      console.error('Error starting abstract test:', error);
    }
  };

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
    setAnswers(prev => ({
      ...prev,
      [questionNumber]: answer
    }));
  };

  const handleNextQuestion = () => {
    if (questionNumber < totalQuestions) {
      setQuestionNumber(prev => prev + 1);
      setCurrentQuestion(testData[questionNumber]);
      setSelectedAnswer(answers[questionNumber + 1] || null);
    } else {
      handleFinishTest();
    }
  };

  const handleFinishTest = () => {
    // Calculate score
    let correctAnswers = 0;
    testData.forEach((question, index) => {
      if (answers[index + 1] === question.answer) {
        correctAnswers++;
      }
    });

    const score = Math.round((correctAnswers / totalQuestions) * 100);
    const results = {
      score,
      correctAnswers,
      totalQuestions,
      percentage: score
    };

    setTestResults(results);
    setTestStep('results');
  };

  const handleBackToDashboard = () => {
    if (onBackToDashboard) {
      onBackToDashboard();
    }
  };

  if (testStep === 'instructions') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl mx-4"
        >
          <div className="text-center mb-8">
            <FaBrain className="text-6xl text-purple-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Abstract Reasoning Test</h1>
            <p className="text-gray-600 text-lg">
              Test your ability to identify patterns and relationships in abstract shapes and figures.
            </p>
      </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-center space-x-3">
              <FaClock className="text-blue-500" />
              <span className="text-gray-700">Duration: 15 minutes</span>
            </div>
            <div className="flex items-center space-x-3">
              <FaQuestionCircle className="text-green-500" />
              <span className="text-gray-700">Questions: {totalQuestions}</span>
            </div>
            <div className="flex items-center space-x-3">
              <FaEye className="text-orange-500" />
              <span className="text-gray-700">Pattern Recognition</span>
            </div>
          </div>

          <div className="text-center">
          <button
              onClick={startTest}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
          >
              Start Test
          </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (testStep === 'test' && currentQuestion) {
    return (
      <div className="min-h-screen bg-gray-50" ref={testContainerRef}>
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <FaBrain className="text-2xl text-purple-600" />
                <h1 className="text-xl font-semibold text-gray-800">Abstract Reasoning Test</h1>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <FaClock className="text-red-500" />
                  <span className="text-lg font-mono text-red-600">{formatTime(timeRemaining)}</span>
                </div>
                <div className="text-gray-600">
                  Question {questionNumber} of {totalQuestions}
                </div>
              </div>
            </div>
                </div>
              </div>

        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              {currentQuestion.text}
            </h2>

            <div className="space-y-3">
              {['A', 'B', 'C', 'D', 'E'].slice(0, currentQuestion.options).map((option) => (
                <label
                  key={option}
                  className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedAnswer === option
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="answer"
                    value={option}
                    checked={selectedAnswer === option}
                    onChange={(e) => handleAnswerSelect(e.target.value)}
                    className="sr-only"
                  />
                  <span className="flex-shrink-0 w-6 h-6 border-2 rounded-full flex items-center justify-center mr-3">
                    {selectedAnswer === option && (
                      <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                    )}
                  </span>
                  <span className="text-gray-900">{option}</span>
                </label>
              ))}
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={handleBackToDashboard}
                className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Exit Test
              </button>
              <button
                onClick={handleNextQuestion}
                disabled={!selectedAnswer}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200"
              >
                {questionNumber === totalQuestions ? 'Finish Test' : 'Next Question'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (testStep === 'results' && testResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 flex items-center justify-center">
        <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl mx-4"
        >
          <div className="text-center">
            <FaBrain className="text-6xl text-purple-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Test Complete!</h1>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <div className="text-4xl font-bold text-purple-600 mb-2">
                {testResults.percentage}%
              </div>
              <div className="text-gray-600">
                {testResults.correctAnswers} out of {testResults.totalQuestions} correct
                    </div>
                  </div>

            <button
              onClick={handleBackToDashboard}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
            >
              Back to Dashboard
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading test...</p>
              </div>
    </div>
  );
};

export default AbstractReasoningTest;