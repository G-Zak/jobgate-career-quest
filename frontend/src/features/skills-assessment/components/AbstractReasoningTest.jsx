import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FaBrain, FaClock, FaQuestionCircle } from 'react-icons/fa';
import axios from 'axios';
import { APP_CONFIG } from '../../../config/constants';

const AbstractReasoningTest = ({ onBackToDashboard, onTestComplete }) => {
  const { t } = useTranslation();
  const [testState, setTestState] = useState('instructions'); // 'instructions', 'testing', 'results'
  const [sessionId, setSessionId] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(25);
  const [timeRemaining, setTimeRemaining] = useState(15 * 60); // 15 minutes
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [testResults, setTestResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Global timer effect for the entire test
  useEffect(() => {
    let timer;
    
    if (testState === 'testing' && timeRemaining > 0) {
      console.log(`Setting up global abstract timer, time: ${timeRemaining}`);
      timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            console.log("Time's up! Ending test automatically.");
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    // Clear interval when component unmounts or when test state changes
    return () => {
      if (timer) {
        console.log(`Clearing abstract timer`);
        clearInterval(timer);
      }
    };
  }, [testState, timeRemaining]);

  // Log when current question changes but don't reset the timer
  useEffect(() => {
    if (currentQuestion) {
      console.log("Current abstract question updated:", currentQuestion);
      console.log("Question ID:", currentQuestion.question_id);
      console.log("Question description:", currentQuestion.question_content?.description || "Not specified");
      console.log("Options structure:", JSON.stringify(currentQuestion.options?.[0] || {}, null, 2));
    }
  }, [currentQuestion?.question_id]); // Only trigger when question_id changes

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const startTest = async () => {
    setIsLoading(true);
    try {
      // Request all 25 questions in our test
      const response = await axios.post(`${APP_CONFIG.API_BASE_URL}/skills-tests/start/`, {
        test_type: 'abstract_reasoning',
        difficulty: 'intermediate',
        num_questions: 25 // Explicitly request all 25 questions using the correct parameter name
      });

      // Always set total questions to 25 regardless of API response
      setSessionId(response.data.session_id);
      setTotalQuestions(25); // Hardcode to 25 questions total
      setTimeRemaining(15 * 60); // Always set to 15 minutes (900 seconds) for the entire test

      // Set the first question from the response
      console.log("First abstract question data:", response.data.test_info.question);
      console.log("Abstract question ID:", response.data.test_info.question.question_id);
      
      setCurrentQuestion(response.data.test_info.question);
      setQuestionNumber(response.data.test_info.current_question);
      setSelectedAnswer(null);
      setTestState('testing');
    } catch (error) {
      console.error('Error starting test:', error);
      alert(t('errorStartingTest'));
    } finally {
      setIsLoading(false);
    }
  };

  const loadNextQuestion = async (currentSessionId = sessionId) => {
    try {
      const response = await axios.get(`${APP_CONFIG.API_BASE_URL}/skills-tests/question/${currentSessionId}/`);
      if (response.data.success && response.data.question) {
        console.log("Next abstract question data - ID:", response.data.question.question_id);
        setCurrentQuestion(response.data.question);
        setQuestionNumber(response.data.question_number);
        setSelectedAnswer(null);
        // Don't reset timer when loading next question (global timer continues)
      } else {
        await getResults(currentSessionId);
      }
    } catch (error) {
      console.error('Error loading question:', error);
    }
  };

  const submitAnswer = async () => {
    if (!selectedAnswer || isLoading || testState === 'results') return;

    setIsLoading(true);
    try {
      // Get image number to determine correct answer
      let imageNumber = null;
      if (typeof currentQuestion.question_id === 'string' && currentQuestion.question_id.startsWith('ART_')) {
        imageNumber = parseInt(currentQuestion.question_id.replace('ART_', ''), 10) - 1;
      }

      // For global timing, just record a standard time per question (since we don't track per-question time anymore)
      const timeTaken = 30; // Arbitrary time value for the question
      console.log(`Current abstract time remaining for entire test: ${timeRemaining}s`);
      
      // Log the answer vs correct answer
      if (imageNumber !== null && imageNumber >= 0 && imageNumber < abstractCorrectAnswers.length) {
        console.log(`Question ${imageNumber+1}: User selected ${selectedAnswer}, Correct answer: ${abstractCorrectAnswers[imageNumber]}`);
      }

      // Ensure we always submit a valid option letter (A-E)
      const answerToSubmit = selectedAnswer;
      
      const response = await axios.post(`${APP_CONFIG.API_BASE_URL}/skills-tests/submit-answer/`, {
        session_id: sessionId,
        answer: answerToSubmit,
        time_taken: timeTaken > 0 ? timeTaken : questionTimeLimit // If timer ran out, use full time limit
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
        console.log("Next abstract question data from submit:", nextQuestion);
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
      const response = await axios.get(`${APP_CONFIG.API_BASE_URL}/skills-tests/results/${currentSessionId}/`);
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

  const handleTimeUp = () => {
    if (sessionId) {
      getResults();
    }
  };

  // Mapping of question descriptions based on question number (0-indexed)
  const abstractQuestionDescriptions = [
    "Which figure completes the series?", // 0.png
    "Which figure completes the series?", // 1.png
    "Which figure completes the series?", // 2.png
    "Which figure completes the series?", // 3.png
    "Which figure completes the series?", // 4.png
    "Which figure completes the statement?", // 5.png
    "Which figure completes the statement?", // 6.png
    "Which figure completes the statement?", // 7.png
    "Which figure completes the statement?", // 8.png
    "Which figure completes the statement?", // 9.png
    "Which figure is the odd one out?", // 10.png
    "Which figure is the odd one out?", // 11.png
    "Which figure is the odd one out?", // 12.png
    "Which figure is the odd one out?", // 13.png
    "Which figure is the odd one out?", // 14.png
    "Which figure completes the series?", // 15.png
    "Which figure completes the series?", // 16.png
    "Which figure belongs in neither group?", // 17.png
    "Which figure belongs in neither group?", // 18.png
    "Which figure is next in the series?", // 19.png
    "Which figure is next in the series?", // 20.png
    "Which figure completes the grid?", // 21.png
    "Which figure completes the grid?", // 22.png
    "Which figure is the odd one out?", // 23.png
    "Which figure is the odd one out?"  // 24.png
  ];
  
  // Correct answers for each question (0-indexed)
  const abstractCorrectAnswers = [
    "A", // 0.png
    "C", // 1.png
    "C", // 2.png
    "D", // 3.png
    "B", // 4.png
    "B", // 5.png
    "C", // 6.png
    "D", // 7.png
    "A", // 8.png
    "C", // 9.png
    "C", // 10.png
    "D", // 11.png
    "A", // 12.png
    "D", // 13.png
    "E", // 14.png
    "D", // 15.png
    "A", // 16.png
    "C", // 17.png
    "A", // 18.png
    "B", // 19.png
    "D", // 20.png
    "B", // 21.png
    "C", // 22.png
    "C", // 23.png
    "D"  // 24.png
  ];

  // Get question options format based on question type
  const getQuestionOptionsCount = (imageNumber) => {
    // Questions with 5 options (A, B, C, D, E) are "odd one out" type
    const fiveOptionQuestions = [10, 11, 12, 13, 14, 23, 24];
    return fiveOptionQuestions.includes(imageNumber) ? 5 : 4;
  };

  const renderAbstractImage = (questionId) => {
    // Extract the number from the question ID (e.g., "ART_001" -> "1")
    let imageNumber = null;
    
    if (typeof questionId === 'string' && questionId.startsWith('ART_')) {
      imageNumber = parseInt(questionId.replace('ART_', ''), 10) - 1;
    } else if (typeof questionId === 'number') {
      imageNumber = questionId;
    } else if (questionId && questionId.question_id) {
      // Handle the case when the full question object is passed
      imageNumber = parseInt(questionId.question_id.replace('ART_', ''), 10) - 1;
    }
    
    if (imageNumber === null || isNaN(imageNumber)) {
      console.error('Invalid question ID for image rendering:', questionId);
      return <div className="text-red-500">Invalid image reference</div>;
    }

    // Make sure the image number is within range (0-24)
    imageNumber = Math.min(Math.max(0, imageNumber), 24);
    
    // Construct the image path
    const imagePath = `/abstractTest_images/${imageNumber}.png`;
    
    console.log(`Rendering abstract image for question ${questionId}, path: ${imagePath}`);
    
    return (
      <div className="w-full flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg border p-2">
        <img 
          src={imagePath} 
          alt={`Abstract reasoning pattern ${imageNumber}`}
          className="max-h-64 object-contain"
        />
      </div>
    );
  };

  const renderInstructions = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto p-8"
    >
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center mb-6">
          <FaBrain className="text-purple-600 text-3xl mr-4" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {t('abstractReasoningTest')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t('assessPatternRecognition')}
            </p>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {t('testInstructions')}
          </h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
            <li>{t('abstractTestDesc')}</li>
            <li><strong>25 {t('questions')}</strong> {t('toComplete')}</li>
            <li><strong>15 {t('minutes')}</strong> {t('timeLimit')} for the Entire Test</li>
            <li>{t('lookForPatterns')}</li>
            <li>{t('useLogicalThinking')}</li>
            <li>{t('oneAttemptOnly')}</li>
          </ul>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4 mb-8">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            {t('sampleQuestion')}
          </h3>
          <p className="text-blue-800 dark:text-blue-200 text-sm">
            {t('abstractSampleDesc')}
          </p>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="w-16 h-16 bg-white dark:bg-gray-700 rounded border flex items-center justify-center">
                <div className={`w-8 h-8 ${i <= 3 ? 'bg-blue-500' : 'bg-gray-300'} rounded flex items-center justify-center text-white font-bold`}>
                  {String.fromCharCode(64 + i)} {/* A, B, C, D */}
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-blue-700 dark:text-blue-300 mt-2">
            {t('patternExplanation')}
          </p>
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
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white px-8 py-3 rounded-lg font-semibold flex items-center"
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
                {questionNumber} {t('of')} 25
              </p>
            </div>
            <div className="w-64 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full transition-all"
                style={{ width: `${(questionNumber / 25) * 100}%` }}
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
                    'bg-green-600'
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
      <div className="max-w-5xl mx-auto p-8">
        {currentQuestion && (
          <motion.div
            key={questionNumber}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700"
          >
            {/* Get image number to determine question type */}
            {(() => {
              let imageNumber = null;
              if (typeof currentQuestion.question_id === 'string' && currentQuestion.question_id.startsWith('ART_')) {
                imageNumber = parseInt(currentQuestion.question_id.replace('ART_', ''), 10) - 1;
              }
              
              // Use custom question description based on image number
              const questionDescription = imageNumber !== null && imageNumber >= 0 && imageNumber < abstractQuestionDescriptions.length 
                ? abstractQuestionDescriptions[imageNumber] 
                : currentQuestion.question_content?.description || 
                  currentQuestion.content?.question || 
                  currentQuestion.content?.text || 
                  currentQuestion.question_text || 
                  "Question not available";
                
              return (
                <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
                  {questionDescription}
                </h2>
              );
            })()}

            {/* Main question image display */}
            <div className="mb-8 flex justify-center">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600 w-full max-w-2xl">
                {renderAbstractImage(currentQuestion.question_id)}
              </div>
            </div>

            {/* Pattern sequence display - Not needed with PNG images */}

            {/* Options display */}
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-white">
                {t('selectCorrectOption')}
              </h3>
              {/* Determine grid layout based on number of options */}
              {(() => {
                // Extract image number to determine question type
                let imageNumber = null;
                if (typeof currentQuestion.question_id === 'string' && currentQuestion.question_id.startsWith('ART_')) {
                  imageNumber = parseInt(currentQuestion.question_id.replace('ART_', ''), 10) - 1;
                }
                
                // Questions with 5 options need a different layout (A, B, C, D, E)
                const hasFiveOptions = imageNumber !== null && getQuestionOptionsCount(imageNumber) === 5;
                const gridClass = hasFiveOptions ? "grid grid-cols-2 md:grid-cols-5 gap-4" : "grid grid-cols-2 md:grid-cols-4 gap-4";
                
                // Generate option IDs based on whether this is a 4 or 5 option question
                const optionLetters = hasFiveOptions ? ['A', 'B', 'C', 'D', 'E'] : ['A', 'B', 'C', 'D'];
                
                return (
                  <div className={gridClass}>
                    {optionLetters.map((letter, index) => {
                      // Find the matching option from the backend if it exists
                      const option = currentQuestion.options.find(opt => opt.option_id === letter) || 
                                     { option_id: letter };
                      
                      return (
                        <button
                          key={index}
                          onClick={() => setSelectedAnswer(letter)}
                          className={`p-4 rounded-lg border-2 transition-all aspect-square ${selectedAnswer === letter
                              ? 'border-purple-600 bg-purple-50 dark:bg-purple-900 shadow-md'
                              : 'border-gray-200 dark:border-gray-600 hover:border-purple-400 bg-white dark:bg-gray-700'
                            }`}
                        >
                          <div className="h-full flex flex-col items-center justify-center">
                            <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                              {letter}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                );
              })()}
              
            </div>

            <div className="flex justify-end">
              <button
                onClick={submitAnswer}
                disabled={!selectedAnswer || isLoading || testState === 'results'}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white px-8 py-3 rounded-lg font-semibold flex items-center"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {t('submitting')}...
                  </>
                ) : (
                  <>
                    {questionNumber < 25 ? t('nextQuestion') : t('finishTest')}
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
          <FaBrain className="text-purple-600 text-5xl mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {t('testCompleted')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t('abstractReasoningResults')}
          </p>
        </div>

        {testResults && (
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">{t('overallScore')}</h3>
              {/* Calculate percentage based on raw score out of 25 questions */}
              <div className="text-4xl font-bold">
                {Math.round(((testResults.results?.raw_score || 0) / 25) * 100)}%
              </div>
              <p className="text-purple-100 mt-2">
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
                <span className="text-gray-600 dark:text-gray-400">{t('patternRecognition')}:</span>
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
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold"
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

export default AbstractReasoningTest;
