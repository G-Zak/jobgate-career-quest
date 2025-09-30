import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPlay, 
  FaPause, 
  FaArrowRight, 
  FaArrowLeft, 
  FaClock, 
  FaCheckCircle,
  FaQuestionCircle
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import TestDataService from '../services/testDataService';
import { submitTestAttempt, fetchTestQuestions } from '../lib/backendSubmissionHelper';
import TestResultsPage from './TestResultsPage';

const SituationalJudgmentTest = ({ testId = 30, onComplete, onBackToDashboard }) => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(25 * 60); // 25 minutes
  const [isTestStarted, setIsTestStarted] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [testData, setTestData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [loadError, setLoadError] = useState(null);
  const [results, setResults] = useState(null);
  const [testStep, setTestStep] = useState('test');
  const [testStartTime, setTestStartTime] = useState(null);

  // Utility function to shuffle array (Fisher-Yates algorithm)
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Function to load test data with robust export support and error handling
  const loadTestData = async () => {
    try {
      setLoading(true);
      setLoadError(null);

      // Fetch data from backend
      const testResult = await TestDataService.fetchTestQuestions('SJT1');
      setTestData(testResult.questions);
      console.log(`🎯 Loaded ${testResult.questions.length} SJT questions from backend`);
    } catch (error) {
      console.error('❌ Error loading SJT data:', error);
      setTestData([]);
      setLoadError(error?.message || String(error));
    } finally {
      setLoading(false);
    }
  };

  // Function to reset test state and load new questions for retake
  const handleRetakeTest = async () => {
    console.log('🔄 Starting test retake with new random questions...');
    setLoadError(null);
    // Reset all state variables
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setTimeRemaining(25 * 60);
    setIsTestStarted(true);
    setShowResults(false);
    setScore(0);
    
    // Load new random questions
    await loadTestData();
    console.log('✅ Test retake ready with fresh questions!');
  };

  // Load test data from master SJT pool with random selection
  useEffect(() => {
    loadTestData();
  }, []);

  // Timer effect
  useEffect(() => {
    let timer;
    if (isTestStarted && timeRemaining > 0 && !showResults) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTestStarted, timeRemaining, showResults]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTimeUp = () => {
    calculateScore();
    setShowResults(true);
  };

  const handleAnswerSelect = (choiceIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion]: choiceIndex
    });
  };

  const calculateScore = () => {
    let correctAnswers = 0;
    testData.forEach((question, index) => {
      const selectedIndex = selectedAnswers[index];
      if (selectedIndex !== undefined && selectedIndex === question.answer_index) {
        correctAnswers++;
      }
    });
    setScore(Math.round((correctAnswers / testData.length) * 100));
  };

  const handleNext = () => {
    if (currentQuestion < testData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      // Convert numeric answers to letter format for backend submission
      const letterAnswers = {};
      console.log('SJT Answer Debug:', {
        selectedAnswers,
        testDataLength: testData.length,
        firstQuestion: testData[0] ? { id: testData[0].id, text: testData[0].question_text?.substring(0, 50) } : null
      });
      
      Object.keys(selectedAnswers).forEach(questionIndex => {
        const answerIndex = selectedAnswers[questionIndex];
        const questionId = testData[questionIndex]?.id;
        if (questionId !== undefined && answerIndex !== undefined) {
          // Convert 0,1,2,3 to A,B,C,D
          const letterAnswer = String.fromCharCode(65 + answerIndex);
          letterAnswers[questionId] = letterAnswer;
        }
      });
      
      console.log('SJT Letter Answers:', letterAnswers);

      // Submit to backend using backendSubmissionHelper
      const startTime = testStartTime || (Date.now() - ((25 * 60) - timeRemaining) * 1000);
      const endTime = Date.now();
      const timeTaken = Math.max(1, Math.round((endTime - startTime) / 1000));
      
      console.log('SJT Submission Debug:', {
        testId: '30',
        answerCount: Object.keys(letterAnswers).length,
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
        timeTakenSeconds: timeTaken,
        timeRemaining
      });

      const result = await submitTestAttempt({
        testId: String(testId || 30), // Use provided testId prop if available, fallback to 30
        answers: letterAnswers,
        startedAt: startTime,
        finishedAt: endTime,
        reason: 'user',
        metadata: {
          testType: 'situational_judgment',
          totalQuestions: testData.length,
          currentQuestion: currentQuestion + 1
        },
        onSuccess: (processedData) => {
          console.log('Test submitted successfully:', processedData);
          setResults(processedData);
          setTestStep('results');
        },
        onError: (error) => {
          console.error('Test submission failed:', error);

          // Handle duplicate submission specially
          if (error.message === 'DUPLICATE_SUBMISSION' && error.existingSubmission) {
            console.log('Handling duplicate submission:', error.existingSubmission);

            // Use existing submission data instead of fallback calculation
            const existingScore = parseFloat(error.existingSubmission.score) || 0;
            const existingResults = {
              id: error.existingSubmission.submissionId,
              raw_score: existingScore.toFixed(2),
              max_possible_score: "100.00",
              percentage_score: existingScore.toFixed(2),
              correct_answers: Math.round((existingScore / 100) * testData.length),
              total_questions: testData.length,
              grade_letter: existingScore >= 90 ? 'A' : existingScore >= 80 ? 'B' : existingScore >= 70 ? 'C' : existingScore >= 60 ? 'D' : 'F',
              passed: existingScore >= 70,
              test_title: "SJT1 - Situational Judgment",
              test_type: "situational_judgment",
              isDuplicateSubmission: true,
              existingSubmissionMessage: error.existingSubmission.message
            };

            setResults(existingResults);
            setTestStep('results');
            return;
          }

          // Fallback to local calculation
          calculateScore();
          setShowResults(true);
        }
      });
    } catch (error) {
      console.error('Error submitting test:', error);

      // Handle duplicate submission at the catch level too
      if (error.message === 'DUPLICATE_SUBMISSION' && error.existingSubmission) {
        console.log('Handling duplicate submission in catch:', error.existingSubmission);

        // Use existing submission data instead of fallback calculation
        const existingScore = parseFloat(error.existingSubmission.score) || 0;
        const existingResults = {
          id: error.existingSubmission.submissionId,
          raw_score: existingScore.toFixed(2),
          max_possible_score: "100.00",
          percentage_score: existingScore.toFixed(2),
          correct_answers: Math.round((existingScore / 100) * testData.length),
          total_questions: testData.length,
          grade_letter: existingScore >= 90 ? 'A' : existingScore >= 80 ? 'B' : existingScore >= 70 ? 'C' : existingScore >= 60 ? 'D' : 'F',
          passed: existingScore >= 70,
          test_title: "SJT1 - Situational Judgment",
          test_type: "situational_judgment",
          isDuplicateSubmission: true,
          existingSubmissionMessage: error.existingSubmission.message
        };

        setResults(existingResults);
        setTestStep('results');
        return;
      }

      // Fallback to local calculation
      calculateScore();
      setShowResults(true);
    }
  };

  const startTest = () => {
    setIsTestStarted(true);
    setTestStartTime(Date.now());
  };

  // Safe text extractor to avoid rendering raw objects (some backend entries embed translations)
  const getScenarioText = (question) => {
    if (!question) return '';
    if (typeof question.passage_text === 'string' && question.passage_text.trim()) return question.passage_text;
    if (typeof question.explanation === 'string' && question.explanation.trim()) return question.explanation;
    if (typeof question.scenario === 'string' && question.scenario.trim()) return question.scenario;

    // Try translation objects (common shape: { translations: { en: {...}, fr: {...} } })
    const parsed = question.scenario || question.context || {};
    const translations = parsed?.translations || parsed?.translation || null;
    if (translations && typeof translations === 'object') {
      if (translations.en) {
        if (translations.en.passage_text) return translations.en.passage_text;
        if (translations.en.question_text) return translations.en.question_text;
        if (translations.en.scenario) return translations.en.scenario;
      }
      if (translations.fr) {
        if (translations.fr.passage_text) return translations.fr.passage_text;
        if (translations.fr.question_text) return translations.fr.question_text;
        if (translations.fr.scenario) return translations.fr.scenario;
      }
      const first = Object.values(translations).find(t => t && (t.passage_text || t.question_text || t.scenario));
      if (first) return first.passage_text || first.question_text || first.scenario || '';
    }

    // Last resort: try to stringify short fields without dumping whole objects
    try {
      if (parsed && typeof parsed === 'object') {
        // Prefer short summary fields if present
        if (parsed.title && typeof parsed.title === 'string') return parsed.title;
        if (parsed.summary && typeof parsed.summary === 'string') return parsed.summary;
      }
    } catch (e) {
      // ignore
    }

    return '';
  };

  // More robust extractor: finds the most likely full scenario text inside nested context objects
  const getFullScenarioText = (question) => {
    if (!question) return '';

    // Prefer explicit passage_text or long scenario/explanation strings
    const prefer = (s) => (typeof s === 'string' && s.trim() ? s.trim() : null);
    const candidates = [];
    const p = prefer(question.passage_text) || prefer(question.explanation) || prefer(question.scenario) || prefer(question.context) || null;
    if (p) candidates.push(p);

    // If scenario/context is an object with translations, inspect them
    const ctx = question.scenario || question.context || {};
    const translations = ctx?.translations || ctx?.translation || null;
    if (translations && typeof translations === 'object') {
      // Collect likely text fields from each locale
      Object.values(translations).forEach(t => {
        if (!t || typeof t !== 'object') return;
        ['passage_text', 'scenario', 'question_text', 'text', 'description', 'body'].forEach(k => {
          const v = prefer(t[k]);
          if (v) candidates.push(v);
        });
      });
    }

    // Recursively collect string values from the context object and pick the longest
    const collectStrings = (obj, out = []) => {
      if (!obj) return out;
      if (typeof obj === 'string') {
        if (obj.trim()) out.push(obj.trim());
        return out;
      }
      if (Array.isArray(obj)) {
        obj.forEach(i => collectStrings(i, out));
        return out;
      }
      if (typeof obj === 'object') {
        Object.values(obj).forEach(v => collectStrings(v, out));
      }
      return out;
    };

    const nestedStrings = collectStrings(ctx, []);
    nestedStrings.forEach(s => {
      // avoid very short strings (like single-word locale codes)
      if (s && s.length > 20) candidates.push(s);
    });

    // Choose the best candidate: longest string (most likely full scenario)
    if (candidates.length > 0) {
      candidates.sort((a, b) => b.length - a.length);
      return candidates[0];
    }

    return '';
  };

  const getQuestionText = (question) => {
    if (!question) return '';
    if (typeof question.question_text === 'string' && question.question_text.trim()) return question.question_text;
    if (typeof question.question === 'string' && question.question.trim()) return question.question;
    // Fallback to scenario-based text
    const scenarioText = getScenarioText(question);
    if (scenarioText) return scenarioText.split('\n')[0];
    return 'What is the most appropriate response?';
  };



  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Show results page
  if (testStep === 'results') {
    return (
      <TestResultsPage
        results={results}
        testType="situational"
        testId="SJT1"
        answers={selectedAnswers}
        testData={{ questions: testData }}
        onBackToDashboard={onBackToDashboard || (() => navigate('/dashboard/skills'))}
        onRetakeTest={handleRetakeTest}
      />
    );
  }

  // Legacy results display (fallback)
  if (showResults) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto p-6"
      >
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Test Complete!</h2>
            <p className="text-gray-600">Situational Judgment Test - Results</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{score}%</div>
                <div className="text-sm text-gray-600">Overall Score</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {Object.keys(selectedAnswers).length}
                </div>
                <div className="text-sm text-gray-600">Questions Answered</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{testData.length}</div>
                <div className="text-sm text-gray-600">Total Questions</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onBackToDashboard || (() => navigate('/dashboard/skills'))}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Return to Dashboard
            </button>
            <button
              onClick={handleRetakeTest}
              disabled={loading}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Loading New Questions...
                </>
              ) : (
                'Retake Test'
              )}
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  if (!isTestStarted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto p-6"
      >
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <FaUsers className="text-6xl text-blue-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Situational Judgment Test
            </h1>
            <p className="text-gray-600 text-lg">
              Randomized Workplace Scenarios & Professional Decision Making
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 text-amber-800">
              <FaLightbulb className="text-amber-600" />
              <span className="font-semibold">Randomized Test Experience</span>
            </div>
            <p className="text-amber-700 text-sm mt-1">
              Each test session features 20 randomly selected questions from our comprehensive pool of 200+ scenarios, with shuffled answer choices for maximum variety.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-800 mb-3">📋 Test Overview</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• 20 randomly selected questions from 200+ pool</li>
                <li>• Multiple domains: teamwork, leadership, ethics</li>
                <li>• 25 minutes to complete</li>
                <li>• Fresh test experience every time</li>
              </ul>
            </div>
            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-800 mb-3">💡 Instructions</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Read each scenario carefully</li>
                <li>• Consider professional best practices</li>
                <li>• Select the most appropriate response</li>
                <li>• Questions and answers are randomized</li>
              </ul>
            </div>
          </div>

          {/* Error and warning messages */}
          {loadError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 text-sm text-red-700">
              Failed to load questions: {loadError}. Try retaking or reload the page.
            </div>
          )}
          {!loadError && !loading && testData.length === 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 text-sm text-amber-800">
              No questions loaded yet. Please try again.
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={startTest}
              disabled={loading || testData.length === 0}
              className={`flex items-center justify-center gap-2 px-8 py-4 rounded-lg transition-colors text-lg font-semibold
                ${loading || testData.length === 0
                  ? 'bg-blue-300 text-white cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
            >
              <FaPlay className="text-sm" />
              {loading ? 'Loading…' : 'Start Test'}
            </button>
            <button
              onClick={onBackToDashboard || (() => navigate('/dashboard/skills'))}
              className="px-8 py-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-lg font-semibold"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  const currentQ = testData[currentQuestion];
  if (!currentQ) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          Unable to start the test because no question is available.
          {loadError ? <> Error: {loadError}</> : null}
        </div>
        <div className="mt-4">
          <button
            onClick={onBackToDashboard || (() => navigate('/dashboard/skills'))}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Back to Dashboard
          </button>
          <button
            onClick={handleRetakeTest}
            className="ml-3 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry Loading Questions
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto p-6"
    >
      {/* Header with Timer */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <FaQuestionCircle className="text-blue-500 text-xl" />
            <h1 className="text-xl font-bold text-gray-800">
              Question {currentQuestion + 1} of {testData.length}
            </h1>
          </div>
          <div className="flex items-center gap-2 text-lg font-mono">
            <FaClock className="text-red-500" />
            <span className={timeRemaining < 300 ? 'text-red-500' : 'text-gray-700'}>
              {formatTime(timeRemaining)}
            </span>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / testData.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-lg shadow-lg p-8"
        >
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Scenario:</h2>
            <p className="text-gray-700 leading-relaxed text-base mb-6 bg-gray-50 p-4 rounded-lg">
              {getFullScenarioText(currentQ) || getScenarioText(currentQ)}
            </p>
            <h3 className="text-lg font-semibold text-gray-800">
              {getQuestionText(currentQ)}
          </h3>
          </div>

          <div className="space-y-3">
            {currentQ.options?.map((option, index) => (
              <motion.button
                key={index}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                  selectedAnswers[currentQuestion] === index
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                    selectedAnswers[currentQuestion] === index
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {selectedAnswers[currentQuestion] === index && (
                      <FaCheckCircle className="text-white text-xs" />
                    )}
                  </div>
                  <span className="text-gray-700 leading-relaxed">
                    {typeof option === 'string' ? option : option.text || option.value || option.option_id}
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            currentQuestion === 0
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
          }`}
        >
          <FaArrowLeft />
          Previous
        </button>

        <div className="text-sm text-gray-600">
          {Object.keys(selectedAnswers).length} / {testData.length} answered
        </div>

        {currentQuestion === testData.length - 1 ? (
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Submit Test
            <FaCheckCircle />
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
          >
            Next
            <FaArrowRight />
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default SituationalJudgmentTest;
