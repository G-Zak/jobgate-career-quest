import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPlay, 
  FaPause, 
  FaArrowRight, 
  FaArrowLeft, 
  FaClock, 
  FaCheckCircle,
  FaExclamationTriangle,
  FaLightbulb,
  FaUsers,
  FaBalanceScale
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const SituationalJudgmentTest = ({ testId = 1, onComplete, onBackToDashboard }) => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(25 * 60); // 25 minutes
  const [isTestStarted, setIsTestStarted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [testData, setTestData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);

  // Utility function to shuffle array (Fisher-Yates algorithm)
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Function to load test data with random selection
  const loadTestData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/data/masterSJTPool.jsonl');
      const text = await response.text();
      const lines = text.trim().split('\n').filter(line => line.trim());
      
      // Parse all questions from the master pool
      const allQuestions = lines.map(line => JSON.parse(line));
      
      // Randomly select 20 questions for this test instance
      const selectedQuestions = shuffleArray(allQuestions).slice(0, 20);
      
      // Shuffle answer choices for each question to prevent answer patterns
      const questionsWithShuffledChoices = selectedQuestions.map(q => {
        const originalChoices = [...q.choices];
        const shuffledChoices = shuffleArray(q.choices);
        const newCorrectIndex = shuffledChoices.indexOf(originalChoices[q.answer_index]);
        
        return {
          ...q,
          choices: shuffledChoices,
          answer_index: newCorrectIndex
        };
      });
      
      setTestData(questionsWithShuffledChoices);
      setLoading(false);
      console.log(`🎯 Loaded ${questionsWithShuffledChoices.length} randomly selected questions from pool of ${allQuestions.length}`);
    } catch (error) {
      console.error('❌ Error loading SJT data:', error);
      // Fallback to basic questions if loading fails
      setTestData([]);
      setLoading(false);
    }
  };

  // Function to reset test state and load new questions for retake
  const handleRetakeTest = async () => {
    console.log('🔄 Starting test retake with new random questions...');
    // Reset all state variables
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setTimeRemaining(25 * 60);
    setIsTestStarted(false);
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

  const handleSubmit = () => {
    calculateScore();
    setShowResults(true);
  };

  const startTest = () => {
    setIsTestStarted(true);
  };

  const getDomainIcon = (domain) => {
    const iconMap = {
      teamwork: <FaUsers className="text-blue-500" />,
      leadership: <FaLightbulb className="text-purple-500" />,
      communication: <FaExclamationTriangle className="text-green-500" />,
      customer_service: <FaCheckCircle className="text-orange-500" />,
      ethics: <FaBalanceScale className="text-red-500" />,
      inclusivity: <FaUsers className="text-pink-500" />,
      conflict: <FaExclamationTriangle className="text-yellow-500" />,
      safety: <FaExclamationTriangle className="text-red-600" />
    };
    return iconMap[domain] || <FaLightbulb className="text-gray-500" />;
  };

  const getDifficultyColor = (difficulty) => {
    const colorMap = {
      easy: 'text-green-600 bg-green-100',
      medium: 'text-yellow-600 bg-yellow-100',
      hard: 'text-red-600 bg-red-100'
    };
    return colorMap[difficulty] || 'text-gray-600 bg-gray-100';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

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

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={startTest}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold"
            >
              <FaPlay className="text-sm" />
              Start Test
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
  if (!currentQ) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto p-6"
    >
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            {getDomainIcon(currentQ.domain)}
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                Question {currentQuestion + 1} of {testData.length}
              </h1>
              <div className="flex items-center gap-3 text-sm">
                <span className="capitalize text-gray-600">{currentQ.domain}</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(currentQ.difficulty)}`}>
                  {currentQ.difficulty}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-lg font-mono">
            <FaClock className="text-red-500" />
            <span className={timeRemaining < 300 ? 'text-red-500' : 'text-gray-700'}>
              {formatTime(timeRemaining)}
            </span>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / testData.length) * 100}%` }}
            />
          </div>
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
              {currentQ.scenario}
            </p>
            <h3 className="text-lg font-semibold text-gray-800">
              {currentQ.question || "What is the most appropriate response?"}
            </h3>
          </div>

          <div className="space-y-3">
            {currentQ.choices.map((choice, index) => (
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
                  <span className="text-gray-700 leading-relaxed">{choice}</span>
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
