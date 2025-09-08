import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FaChartLine, FaClock, FaQuestionCircle } from 'react-icons/fa';
import axios from 'axios';
// Define API base URL directly
const API_BASE_URL = 'http://localhost:8000/api';

// Configure axios defaults
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['Accept'] = 'application/json';

const NumericalReasoningTest = ({
  testData,
  questions,
  totalQuestionsCount,
  timeLimit,
  onSuccess,
  onError,
  onBackToDashboard,
  onTestComplete,
}) => {
  // Simple translation function fallback if i18n is not available
  const t = (key) => {
    const translations = {
      'numericalReasoningTest': 'Numerical Reasoning Test',
      'assessNumericalSkills': 'Assess your numerical skills',
      'testInstructions': 'Test Instructions',
      'numericalTestDesc': 'This test measures your ability to make correct decisions based on numerical data.',
      'questions': 'questions',
      'toComplete': 'to complete',
      'minutes': 'minutes',
      'timeLimit': 'time limit',
      'useCalculationsCarefully': 'Use calculations carefully and pay attention to units and scales.',
      'oneAttemptOnly': 'You have one attempt only.',
      'backToDashboard': 'Back to Dashboard',
      'startTest': 'Start Test',
      'starting': 'Starting',
      'question': 'Question',
      'of': 'of',
      'endTest': 'End Test',
      'submitting': 'Submitting',
      'nextQuestion': 'Next Question',
      'finishTest': 'Finish Test',
      'testCompleted': 'Test Completed',
      'numericalReasoningResults': 'Numerical Reasoning Results',
      'overallScore': 'Overall Score',
      'excellent': 'Excellent',
      'good': 'Good',
      'needsImprovement': 'Needs Improvement',
      'correctAnswers': 'Correct Answers',
      'timeUsed': 'Time Used',
      'seconds': 'seconds',
      'accuracy': 'Accuracy',
      'viewDetailedResults': 'View Detailed Results',
      'errorStartingTest': 'Error starting test. Please try again.',
      'selectCorrectOption': 'Select your answer'
    };
    return translations[key] || key;
  };

  const [testState, setTestState] = useState('instructions'); // 'instructions', 'testing', 'results'
  const [sessionId, setSessionId] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(totalQuestionsCount || 25);
  const [timeRemaining, setTimeRemaining] = useState(15 * 60); // 15 minutes
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [testResults, setTestResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Global timer effect for the entire test
  useEffect(() => {
    let timer;
    
    if (testState === 'testing' && timeRemaining > 0) {
      console.log(`Setting up global numerical test timer, time: ${timeRemaining}`);
      timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            console.log("Time's up! Ending test automatically.");
            // Submit current answer even if none selected
            handleSubmitAnswer(true); // Pass true to indicate time's up
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    // Clear interval when component unmounts or when test state changes
    return () => {
      if (timer) {
        console.log(`Clearing numerical test timer`);
        clearInterval(timer);
      }
    };
  }, [testState, timeRemaining]);

  // Log when current question changes but don't reset the timer
  useEffect(() => {
    if (currentQuestion) {
      console.log("Current question updated:", currentQuestion);
      console.log("Question ID:", currentQuestion.question_id);
    }
  }, [currentQuestion?.question_id]); // Only trigger when question_id changes

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  // Reference for abstract reasoning question descriptions and answers - not used in numerical test
  const abstractQuestionDescriptions = [
    { question: "Which figure completes the series?", options: ["A", "B", "C", "D"], answer: "A" },
    { question: "Which figure completes the series?", options: ["A", "B", "C", "D"], answer: "C" },
    { question: "Which figure completes the series?", options: ["A", "B", "C", "D"], answer: "C" },
    { question: "Which figure completes the series?", options: ["A", "B", "C", "D"], answer: "D" },
    { question: "Which figure completes the series?", options: ["A", "B", "C", "D"], answer: "B" },
    { question: "Which figure completes the statement?", options: ["A", "B", "C", "D"], answer: "B" },
    { question: "Which figure completes the statement?", options: ["A", "B", "C", "D"], answer: "C" },
    { question: "Which figure completes the statement?", options: ["A", "B", "C", "D"], answer: "D" },
    { question: "Which figure completes the statement?", options: ["A", "B", "C", "D"], answer: "A" },
    { question: "Which figure completes the statement?", options: ["A", "B", "C", "D"], answer: "C" },
    { question: "Which figure is the odd one out?", options: ["A", "B", "C", "D", "E"], answer: "C" },
    { question: "Which figure is the odd one out?", options: ["A", "B", "C", "D", "E"], answer: "D" },
    { question: "Which figure is the odd one out?", options: ["A", "B", "C", "D", "E"], answer: "A" },
    { question: "Which figure is the odd one out?", options: ["A", "B", "C", "D", "E"], answer: "D" },
    { question: "Which figure is the odd one out?", options: ["A", "B", "C", "D", "E"], answer: "E" },
    { question: "Which figure completes the series?", options: ["A", "B", "C", "D"], answer: "D" },
    { question: "Which figure completes the series?", options: ["A", "B", "C", "D"], answer: "A" },
    { question: "Which figure belongs in neither group?", options: ["A", "B", "C", "D"], answer: "C" },
    { question: "Which figure belongs in neither group?", options: ["A", "B", "C", "D"], answer: "A" },
    { question: "Which figure is next in the series?", options: ["A", "B", "C", "D"], answer: "B" },
    { question: "Which figure is next in the series?", options: ["A", "B", "C", "D"], answer: "D" },
    { question: "Which figure completes the grid?", options: ["A", "B", "C", "D"], answer: "B" },
    { question: "Which figure completes the grid?", options: ["A", "B", "C", "D"], answer: "C" },
    { question: "Which figure is the odd one out?", options: ["A", "B", "C", "D", "E"], answer: "C" },
    { question: "Which figure is the odd one out?", options: ["A", "B", "C", "D", "E"], answer: "D" }
  ];  const startTest = async () => {
    setIsLoading(true);
    try {
      console.log('Starting test with URL:', `${API_BASE_URL}/skills-tests/start/`);
      const response = await axios.post(`${API_BASE_URL}/skills-tests/start/`, {
        test_type: 'numerical_reasoning',
        user_id: 'guest-user',
        num_questions: 25 // Explicitly request all 25 questions
      });

      // Log the complete response data structure to understand the format
      console.log("Complete API response:", JSON.stringify(response.data, null, 2));

      setSessionId(response.data.session_id);
      setTotalQuestions(25); // Always set to 25 questions
      setTimeRemaining(15 * 60); // Set to 15 minutes (900 seconds) for the entire test

      // Set the first question from the response
      const questionData = response.data.test_info.question;
      console.log("First question data:", questionData);
      // Log specific question_content structure to debug
      console.log("Question content structure:", questionData.question_content);
      setCurrentQuestion(questionData);
      setQuestionNumber(response.data.test_info.current_question);
      setSelectedAnswer(null);
      setTestState('testing');
    } catch (error) {
      console.error('Error starting test:', error);
      // More detailed error information
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      } else if (error.request) {
        console.error('No response received, request:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
      alert(t('errorStartingTest'));
    } finally {
      setIsLoading(false);
    }
  };

  const loadNextQuestion = async (currentSessionId = sessionId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/skills-tests/question/${currentSessionId}/`);
      if (response.data.success && response.data.question) {
        console.log("Next question data:", response.data.question);
        
        // Set the new question data and reset selection
        setCurrentQuestion(response.data.question);
        setQuestionNumber(response.data.question_number);
        setSelectedAnswer(null);
        
        // Don't reset timer when loading next question (global timer continues)
        console.log(`Moving to next question with global time remaining: ${timeRemaining}s`);
      } else {
        await getResults(currentSessionId);
      }
    } catch (error) {
      console.error('Error loading question:', error);
    }
  };

  const handleSubmitAnswer = async (isTimeUp = false) => {
    // Allow submission when time's up even if no answer is selected
    if ((!selectedAnswer && !isTimeUp) || isLoading || testState === 'results') return;

    setIsLoading(true);
    try {
      // For global timing, just record a standard time per question (since we don't track per-question time anymore)
      const timeTaken = 30; // Arbitrary time value for the question
      console.log(`Current numerical test time remaining for entire test: ${timeRemaining}s`);
      
      // If time's up and no answer selected, use a placeholder for submission
      const answerToSubmit = isTimeUp && !selectedAnswer ? 'timeout' : selectedAnswer;

      // Make a direct API call instead of using an imported function
      const response = await axios.post(`${API_BASE_URL}/skills-tests/submit-answer/`, {
        session_id: sessionId,
        answer: answerToSubmit,
        time_taken: timeTaken > 0 ? timeTaken : questionTimeLimit, // If timer ran out, use full time limit
        is_timeout: isTimeUp && !selectedAnswer // Flag to indicate timeout with no answer
      });

      // Check if test is completed from the response
      if (response.data.result && response.data.result.test_completed) {
        // Test is completed, show results directly from the response
        if (response.data.result.final_results) {
          console.log('Test completed, final results:', response.data.result.final_results);
          setTestResults(response.data.result.final_results);
          setTestState('results');
        } else {
          // Fallback: get results from API
          await getResults();
        }
      } else {
        // Load next question
        const nextQuestion = response.data.result.next_question;
        console.log("Next question data from submit:", nextQuestion);
        console.log("Next question content structure:", nextQuestion.question_content);
        
        // Log all possible question text fields to debug
        console.log("Question text fields:", {
          "question_content.question": nextQuestion.question_content?.question,
          "question_content.text": nextQuestion.question_content?.text,
          "question_text": nextQuestion.question_text,
          "text": nextQuestion.text
        });
        
        setCurrentQuestion(nextQuestion);
        setQuestionNumber(response.data.result.question_number + 1);
        setSelectedAnswer('');
        
        // No need to reset timer - global timer continues
        console.log(`Moving to next question with global time remaining: ${timeRemaining}s`);
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
      // Don't retry if already in results state
      if (testState === 'results') {
        return;
      }
      // Check if error is due to completed test
      if (error.response?.status === 400 || error.response?.status === 500) {
        console.log('Test might be completed, trying to get results...');
        await getResults();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getResults = async (currentSessionId = sessionId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/skills-tests/results/${currentSessionId}/`);
      console.log("Test results response:", response.data);
      setTestResults(response.data);
      setTestState('results');
    } catch (error) {
      console.error('Error getting results:', error);
      // If test is not completed yet, don't show error
      if (error.response?.status === 400) {
        console.log('Test not completed yet');
      } else {
        // Show actual errors
        alert('Error getting test results. Please try again.');
      }
    }
  };

  // This function is no longer needed as we handle time's up in the handleSubmitAnswer function
  // Kept as a no-op function to avoid breaking any existing references
  // Helper function for finishing the test
  const handleFinishTest = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/skills-tests/finish/`, {
        session_id: sessionId
      });
      return response.data;
    } catch (error) {
      console.error('Error finishing test:', error);
      throw error;
    }
  };

  const renderInstructions = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto p-8"
    >
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center mb-6">
          <FaChartLine className="text-blue-600 text-3xl mr-4" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {t('numericalReasoningTest')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t('assessNumericalSkills')}
            </p>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {t('testInstructions')}
          </h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
            <li>{t('numericalTestDesc')}</li>
            <li><strong>25 {t('questions')}</strong> {t('toComplete')}</li>
            <li><strong>15 {t('minutes')}</strong> {t('timeLimit')} for the Entire Test</li>
            <li>{t('useCalculationsCarefully')}</li>
            <li>{t('oneAttemptOnly')}</li>
          </ul>
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={onBackToDashboard}
            className="flex items-center px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t('backToDashboard')}
          </button>

          <button
            onClick={startTest}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-8 py-3 rounded-lg font-semibold flex items-center"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {t('starting')}...
              </>
            ) : (
              <>
                <FaQuestionCircle className="mr-2" />
                {t('startTest')}
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );

  const renderQuestion = () => (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Test Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('question')}</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {questionNumber} {t('of')} {totalQuestions}
              </p>
            </div>
            <div className="w-64 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center flex-col">
              <div className="flex items-center mb-1">
                <FaClock className={`mr-2 ${timeRemaining < 60 ? 'text-red-600' :
                    timeRemaining < 180 ? 'text-orange-500' :
                      'text-gray-500 dark:text-gray-400'
                  }`} />
                <span className={`font-mono text-lg font-bold ${
                  timeRemaining < 60 ? 'text-red-600 animate-pulse' :
                  timeRemaining < 180 ? 'text-orange-500' :
                  'text-gray-900 dark:text-gray-100'
                }`}>
                  {formatTime(timeRemaining)}
                </span>
              </div>
              {/* Timer progress bar */}
              <div className="w-36 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                <div 
                  className={`h-2 rounded-full ${
                    timeRemaining < 60 ? 'bg-red-600' :
                    timeRemaining < 180 ? 'bg-orange-500' :
                    'bg-blue-600'
                  }`}
                  style={{ 
                    width: `${(timeRemaining / (15 * 60)) * 100}%`, 
                    transition: 'width 1s linear' 
                  }}
                />
              </div>
            </div>
            <button
              onClick={onBackToDashboard}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              {t('endTest')}
            </button>
          </div>
        </div>
      </div>

      {/* Question Content */}
      <div className="max-w-4xl mx-auto p-8">
        {currentQuestion && (
          <motion.div
            key={questionNumber}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700"
          >
            <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
              {/* Based on our findings, directly access the content field */}
              {currentQuestion.content?.question || 
               "Question not available"}
            </h2>
            
            {/* Display additional context for chart/table questions */}
            {currentQuestion.content?.chart_data && (
              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-blue-800 dark:text-blue-200 font-medium">
                  <span className="mr-2">📊</span>
                  Chart data: {currentQuestion.content.chart_data.title}
                </p>
                <div className="mt-2 text-gray-600 dark:text-gray-300 text-sm">
                  {Object.entries(currentQuestion.content.chart_data.data).map(([key, value]) => (
                    <div key={key} className="inline-block mr-4">
                      {key}: <strong>{value}</strong>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Display table data as simple text */}
            {currentQuestion.content?.table_data && (
              <div className="mb-6 p-4 bg-purple-50 dark:bg-purple-900 rounded-lg border border-purple-200 dark:border-purple-800">
                <p className="text-purple-800 dark:text-purple-200 font-medium">
                  <span className="mr-2">📋</span>
                  Table data: {currentQuestion.content.table_data.title}
                </p>
                <div className="mt-2 text-gray-600 dark:text-gray-300 text-sm">
                  {currentQuestion.content.table_data.data.map((row, index) => (
                    <div key={index} className="mb-2 p-2 bg-white dark:bg-gray-800 rounded">
                      {Object.entries(row).map(([key, value]) => (
                        <span key={key} className="mr-4">
                          {key}: <strong>{value}</strong>
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-white">
              {t('selectCorrectOption')}
            </h3>
            <div className="space-y-3 mb-8">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedAnswer(option.option_id)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${selectedAnswer === option.option_id
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                      : 'border-gray-200 dark:border-gray-600 hover:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                    }`}
                >
                  <span className="font-medium">
                    {option.option_id}.
                  </span> {option.content}
                </button>
              ))}
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSubmitAnswer}
                disabled={!selectedAnswer || isLoading || testState === 'results'}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-8 py-3 rounded-lg font-semibold flex items-center"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {t('submitting')}...
                  </>
                ) : (
                  <>
                    {questionNumber < totalQuestions ? t('nextQuestion') : t('finishTest')}
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );

  const renderResults = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto p-8"
    >
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
        <div className="text-center mb-8">
          <FaChartLine className="text-blue-600 text-5xl mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {t('testCompleted')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t('numericalReasoningResults')}
          </p>
        </div>

        {testResults && (
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">{t('overallScore')}</h3>
              <div className="text-4xl font-bold">
                {Math.round(((testResults.results?.raw_score || 0) / 25) * 100)}%
              </div>
              <p className="text-blue-100 mt-2">
                {Math.round(((testResults.results?.raw_score || 0) / 25) * 100) >= 80 ? t('excellent') :
                  Math.round(((testResults.results?.raw_score || 0) / 25) * 100) >= 60 ? t('good') : t('needsImprovement')}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">{t('correctAnswers')}:</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {testResults.results?.raw_score || 0} / 25
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">{t('timeUsed')}:</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {testResults.results?.time_taken || 0} {t('seconds')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">{t('accuracy')}:</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {Math.round(((testResults.results?.raw_score || 0) / 25) * 100)}%
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-center space-x-4">
          <button
            onClick={onBackToDashboard}
            className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold"
          >
            {t('backToDashboard')}
          </button>
          {onTestComplete && (
            <button
              onClick={() => onTestComplete(testResults)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
            >
              {t('viewDetailedResults')}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {testState === 'instructions' && renderInstructions()}
      {testState === 'testing' && renderQuestion()}
      {testState === 'results' && renderResults()}
    </div>
  );
};

export default NumericalReasoningTest;
