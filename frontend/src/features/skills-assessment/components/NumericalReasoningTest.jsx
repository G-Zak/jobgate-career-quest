import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChartLine, FaClock, FaStop, FaArrowRight, FaArrowLeft, FaFlag, FaCalculator, FaQuestionCircle, FaTable, FaChartBar, FaCheckCircle, FaBrain, FaTimesCircle, FaPause, FaPlay, FaTimes, FaCog, FaSearch, FaLightbulb, FaPuzzlePiece, FaCheck } from 'react-icons/fa';
import TestDataService from '../services/testDataService';
// Removed complex scroll utilities - using simple scrollToTop function instead
import { submitTestAttempt } from '../lib/submitHelper';
import TestResultsPage from './TestResultsPage';
import { getRuleFor } from '../testRules';
import { buildAttempt } from '../lib/scoreUtils';
import { useAttempts } from '../store/useAttempts';
import { createTestScoringIntegration, formatUniversalResults } from '../lib/universalScoringIntegration';
import { useUniversalScoring } from '../hooks/useUniversalScoring';

const NumericalReasoningTest = ({ onBackToDashboard, testId }) => {
  const rule = getRuleFor(testId);
  const { addAttempt } = useAttempts();
  const [testStep, setTestStep] = useState('test'); // Skip instructions - start directly with test
  const [currentSection, setCurrentSection] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(rule?.timeLimitMin * 60 || 20 * 60); // Use rule time limit
  const [answers, setAnswers] = useState({});
  const [testData, setTestData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [startedAt, setStartedAt] = useState(null);
  const [results, setResults] = useState(null);
  const timerRef = useRef(null);
  const startedAtRef = useRef(Date.now());

  // Get current section and question data
  const currentSectionData = testData?.sections?.[currentSection - 1];
  const currentQuestionData = currentSectionData?.questions?.[currentQuestion - 1];
  const totalSections = testData?.sections?.length || 0;
  const totalQuestions = rule?.totalQuestions || 20;

  // Initialize universal scoring system
  const {
    scoringSystem,
    isInitialized: scoringInitialized,
    startQuestion,
    recordAnswer,
    completeTest,
    getFormattedResults
  } = useUniversalScoring('numerical-reasoning', testData?.sections?.flatMap(s => s.questions) || [], null, {
    enableConsoleLogging: true,
    logPrefix: '🔢',
    autoStartTest: false
  });

  // Smooth scroll-to-top function - only called on navigation
  const scrollToTop = () => {
    // Target the main scrollable container in MainDashboard
    const mainScrollContainer = document.querySelector('.main-content-area .overflow-y-auto');
    if (mainScrollContainer) {
      // Smooth scroll to top
      mainScrollContainer.scrollTo({ 
        top: 0, 
        behavior: 'smooth',
        block: 'start'
      });
    } else {
      // Fallback to window scroll
      window.scrollTo({ 
        top: 0, 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Only scroll to top when question changes (not on every render)
  useEffect(() => {
    if (testStep === 'test' && currentQuestion > 0) {
      // Small delay to ensure DOM has updated after question change
      const timer = setTimeout(() => {
        scrollToTop();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [currentQuestion, testStep]);

  // Load test data
  useEffect(() => {
    const loadTestData = async () => {
      try {
        setLoading(true);
        const data = await TestDataService.fetchTestQuestions('NRT1');
        // Limit questions to rule's totalQuestions
        const limitedData = {
          ...data,
          sections: data.sections.map(section => ({
            ...section,
            questions: section.questions.slice(0, rule?.totalQuestions || 20)
          }))
        };
        setTestData(limitedData);
        setTimeRemaining(rule?.timeLimitMin * 60 || 20 * 60);
        setStartedAt(new Date());
      } catch (error) {
        console.error('Error loading test data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadTestData();
  }, [rule]);

  // Start test when scoring system is ready
  useEffect(() => {
    if (scoringSystem && scoringInitialized && testData) {
      console.log('🔢 Starting numerical test with universal scoring');
      scoringSystem.startTest();
    }
  }, [scoringSystem, scoringInitialized, testData]);

  // Start question timer when question changes
  useEffect(() => {
    if (currentQuestionData && scoringSystem) {
      startQuestion(currentQuestionData.question_id);
    }
  }, [currentQuestion, currentQuestionData, scoringSystem, startQuestion]);

  // Timer countdown
  useEffect(() => {
    if (testStep === 'test' && timeRemaining > 0 && !isPaused) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [testStep, timeRemaining, isPaused]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Handle next section
  const handleNextSection = () => {
    if (currentSection < testData?.sections?.length) {
      setCurrentSection(prev => prev + 1);
      setCurrentQuestion(1);
      setTimeRemaining(10 * 60); // Reset timer for new section
    } else {
      handleTestComplete();
    }
  };

  // Handle timer expiry
  const handleTimeUp = async () => {
    try {
      const endTime = new Date();
      const duration = Math.floor((endTime - startedAt) / 1000);
      
      // Prepare answers for backend submission
      const answersForBackend = {};
      Object.entries(answers).forEach(([questionId, answer]) => {
        if (typeof answer === 'object' && answer.selectedAnswer !== undefined) {
          answersForBackend[questionId] = answer.selectedAnswer;
        } else if (typeof answer === 'string') {
          answersForBackend[questionId] = answer;
        }
      });

      // Submit to backend for scoring
      try {
        const submissionResult = await submitTestAttempt({
          testId: 21, // Backend test ID for Numerical Reasoning - Basic Arithmetic
          answers: answersForBackend,
          startedAt: startedAtRef.current,
          finishedAt: endTime.getTime(),
          reason: 'time',
          metadata: {
            testType: 'numerical-reasoning',
            timeLimit: rule?.timeLimitMin * 60 || 20 * 60
          }
        });

        // Use backend scoring results
        const testResults = {
          testId: testId,
          testType: 'numerical-reasoning',
          score: submissionResult.score?.percentage_score || 0,
          totalQuestions: submissionResult.score?.total_questions || 0,
          correctAnswers: submissionResult.score?.correct_answers || 0,
          duration: duration,
          answers: answers,
          completedAt: endTime.toISOString(),
          startedAt: startedAt?.toISOString(),
          submissionId: submissionResult.submission_id,
          grade: submissionResult.score?.grade_letter || 'F'
        };

        setResults(testResults);
        setTestStep('results');
      } catch (error) {
        console.error('Error submitting test attempt:', error);
        // Fallback to frontend scoring if backend fails
        const totalQuestions = rule?.totalQuestions || 20;
        const correctAnswers = Object.values(answers).filter(answer => 
          typeof answer === 'object' ? answer.isCorrect : false
        ).length;
        const score = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
        
        const testResults = {
          testId: testId,
          testType: 'numerical-reasoning',
          score: score,
          totalQuestions: totalQuestions,
          correctAnswers: correctAnswers,
          duration: duration,
          answers: answers,
          completedAt: endTime.toISOString(),
          startedAt: startedAt?.toISOString()
        };

        setResults(testResults);
        setTestStep('results');
      }
    } catch (error) {
      console.error('Error handling time up:', error);
    }
  };

  // Handle test completion
  const handleTestComplete = async () => {
    try {
      const endTime = new Date();
      const duration = Math.floor((endTime - startedAt) / 1000);
      
      // Prepare answers for backend submission
      const answersForBackend = {};
      Object.entries(answers).forEach(([questionId, answer]) => {
        if (typeof answer === 'object' && answer.selectedAnswer !== undefined) {
          answersForBackend[questionId] = answer.selectedAnswer;
        } else if (typeof answer === 'string') {
          answersForBackend[questionId] = answer;
        }
      });

      // Submit to backend for scoring
      try {
        const submissionResult = await submitTestAttempt({
          testId: 21, // Backend test ID for Numerical Reasoning - Basic Arithmetic
          answers: answersForBackend,
          startedAt: startedAtRef.current,
          finishedAt: endTime.getTime(),
          reason: 'user',
          metadata: {
            testType: 'numerical-reasoning',
            timeLimit: rule?.timeLimitMin * 60 || 20 * 60
          }
        });

        // Use backend scoring results
        const testResults = {
          testId: testId,
          testType: 'numerical-reasoning',
          score: submissionResult.score?.percentage_score || 0,
          totalQuestions: submissionResult.score?.total_questions || 0,
          correctAnswers: submissionResult.score?.correct_answers || 0,
          duration: duration,
          answers: answers,
          completedAt: endTime.toISOString(),
          startedAt: startedAt?.toISOString(),
          submissionId: submissionResult.submission_id,
          grade: submissionResult.score?.grade_letter || 'F'
        };

        setResults(testResults);
        setTestStep('results');
      } catch (error) {
        console.error('Error submitting test attempt:', error);
        // Fallback to frontend scoring if backend fails
        const totalQuestions = rule?.totalQuestions || 20;
        const correctAnswers = Object.values(answers).filter(answer => 
          typeof answer === 'object' ? answer.isCorrect : false
        ).length;
        const score = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
        
        const testResults = {
          testId: testId,
          testType: 'numerical-reasoning',
          score: score,
          totalQuestions: totalQuestions,
          correctAnswers: correctAnswers,
          duration: duration,
          answers: answers,
          completedAt: endTime.toISOString(),
          startedAt: startedAt?.toISOString()
        };

        setResults(testResults);
        setTestStep('results');
      }
    } catch (error) {
      console.error('Error completing test:', error);
    }
  };

  // Handle pause/resume
  const handlePause = () => {
    setIsPaused(true);
    setShowPauseModal(true);
  };

  const handleResume = () => {
    setIsPaused(false);
    setShowPauseModal(false);
  };

  // Handle exit
  const handleExit = () => {
    setShowExitModal(true);
  };

  const handleConfirmExit = () => {
    onBackToDashboard();
  };

  // Handle answer selection
  const handleAnswerSelect = (questionId, answer) => {
    // Find the question to get the correct answer
    const question = currentSectionData?.questions?.find(q => q.id === questionId);
    const isCorrect = question ? question.correct_answer === answer : false;

    // Record answer in universal scoring system
    recordAnswer(questionId, answer);

    setAnswers(prev => ({
      ...prev,
      [questionId]: {
        answer,
        isCorrect,
        timestamp: new Date().toISOString()
      }
    }));
  };

  // Handle next question
  const handleNext = () => {
    if (currentQuestion < totalQuestions) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      handleNextSection();
    }
    
    // Smooth scroll to top after navigation
    setTimeout(() => scrollToTop(), 150);
  };

  // Handle previous question
  const handlePrevious = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(prev => prev - 1);
    }
    
    // Smooth scroll to top after navigation
    setTimeout(() => scrollToTop(), 150);
  };

  // Show results page
  if (testStep === 'results') {
    return (
      <TestResultsPage
        testResults={results}
        results={results?.universalResults || results}
        testType="numerical-reasoning"
        testId={testId}
        answers={answers}
        testData={testData}
        onBackToDashboard={onBackToDashboard}
        onRetakeTest={() => {
          setTestStep('test');
          setCurrentSection(1);
          setCurrentQuestion(1);
          setAnswers({});
          setTimeRemaining(10 * 60);
          setResults(null);
          setStartedAt(new Date());
        }}
        showUniversalResults={!!results?.universalResults}
        scoringSystem={scoringSystem}
      />
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading test...</p>
        </div>
      </div>
    );
  }

  if (!testData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Test not available</h2>
          <button
            onClick={onBackToDashboard}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Check if current question is answered for gated navigation
  const currentQuestionAnswered = currentQuestionData ? 
    answers[currentQuestionData.id]?.answer != null : false;

  if (!testData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Numerical Reasoning Test...</p>
        </div>
      </div>
    );
  }

  // Use the already defined variables
  const section = currentSectionData;
  const question = currentQuestionData;

  if (false) { // Disabled instructions - use TestInfoPage instead
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-blue-50 to-green-100 p-6"
      >
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-xl p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <FaChartLine className="text-blue-600 text-3xl mr-3" />
                <h1 className="text-3xl font-bold text-gray-900">{section.intro_text.title}</h1>
              </div>
              <p className="text-xl text-gray-600">{section.description}</p>
            </div>

            {/* Instructions Image */}
            {section.intro_image && (
              <div className="mb-8 text-center">
                <div className="flex justify-center">
                  <img 
                    src={section.intro_image} 
                    alt="Numerical Reasoning Instructions"
                    className="max-w-xl max-h-96 w-auto h-auto mx-auto rounded-lg shadow-md object-contain"
                    style={{ maxWidth: '528px', maxHeight: '352px' }}
                  />
                </div>
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
                        <span className="text-blue-600 mr-2">•</span>
                        {instruction}
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Test Info */}
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <FaClock className="text-blue-600 text-2xl mx-auto mb-2" />
                <p className="font-semibold text-gray-900">{testData.duration_minutes} Minutes</p>
                <p className="text-sm text-gray-600">Time Limit</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <FaCalculator className="text-green-600 text-2xl mx-auto mb-2" />
                <p className="font-semibold text-gray-900">{testData.total_questions} Questions</p>
                <p className="text-sm text-gray-600">Total Questions</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg text-center">
                <FaChartBar className="text-yellow-600 text-2xl mx-auto mb-2" />
                <p className="font-semibold text-gray-900">Data Analysis</p>
                <p className="text-sm text-gray-600">Focus Area</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between">
              <button
                onClick={() => {
                  if (typeof onBack === 'function') {
                    onBack();
                  } else {
                    console.warn("onBack function was not provided to NumericalReasoningTest");
                  }
                }}
                className="flex items-center px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Back to Tests
              </button>
              <button
                onClick={handleNextSection}
                className="flex items-center px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
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

  const renderDataVisual = (question) => {
    if (!question) return null;

    if (question.data_type === 'chart') {
      // Create custom chart visualizations
      return (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">{question.chart_data?.title || 'Chart Data'}</h3>
          <div className="bg-gray-50 rounded-lg p-6">
            {/* BAR CHARTS */}
            {question.chart_data?.type === 'bar_chart' && (
              <div>
                <div className="text-xl font-bold text-blue-600 mb-3 text-center">Bar Chart: {question.chart_data.title}</div>

                {/* Book Sales Chart */}
                {question.chart_data.title === 'Book Sales' && (
                  <div>
                    <div className="flex items-end justify-around h-64 mb-4">
                      <div className="flex flex-col items-center">
                        <div className="bg-blue-500 w-16 h-44 rounded-t-md"></div>
                        <div className="text-sm font-medium mt-2">2020</div>
                        <div className="text-sm font-bold">$1M</div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-blue-500 w-16 h-52 rounded-t-md"></div>
                        <div className="text-sm font-medium mt-2">2021</div>
                        <div className="text-sm font-bold">$1.2M</div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-blue-500 w-16 h-60 rounded-t-md"></div>
                        <div className="text-sm font-medium mt-2">2022</div>
                        <div className="text-sm font-bold">$1.4M</div>
                      </div>
                    </div>
                    <p className="text-center text-sm text-gray-700">Annual Book Sales by Year (in millions of dollars)</p>
                  </div>
                )}

                {/* Quarterly Sales Chart */}
                {question.chart_data.title === 'Quarterly Sales' && (
                  <div>
                    <div className="flex items-end justify-around h-64 mb-4">
                      <div className="flex flex-col items-center">
                        <div className="bg-green-500 w-16 h-32 rounded-t-md"></div>
                        <div className="text-sm font-medium mt-2">Q1</div>
                        <div className="text-sm font-bold">$200K</div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-green-500 w-16 h-48 rounded-t-md"></div>
                        <div className="text-sm font-medium mt-2">Q2</div>
                        <div className="text-sm font-bold">$300K</div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-green-500 w-16 h-48 rounded-t-md"></div>
                        <div className="text-sm font-medium mt-2">Q3</div>
                        <div className="text-sm font-bold">$300K</div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-green-500 w-16 h-60 rounded-t-md"></div>
                        <div className="text-sm font-medium mt-2">Q4</div>
                        <div className="text-sm font-bold">$400K</div>
                      </div>
                    </div>
                    <p className="text-center text-sm text-gray-700">Quarterly Sales (in thousands of dollars)</p>
                  </div>
                )}
              </div>
            )}

            {/* PIE CHART */}
            {question.chart_data?.type === 'pie_chart' && (
              <div>
                <div className="text-xl font-bold text-blue-600 mb-3 text-center">Pie Chart: {question.chart_data.title}</div>

                {/* Market Share Chart */}
                {question.chart_data.title === 'Market Share' && (
                  <div className="flex flex-col items-center">
                    <div className="relative w-64 h-64 mb-4">
                      <svg viewBox="0 0 100 100" className="w-full h-full">
                        {/* Company A: 25% */}
                        <path d="M50,50 L50,0 A50,50 0 0,1 97.5,32.5 z" fill="#3B82F6"></path>
                        {/* Company B: 30% */}
                        <path d="M50,50 L97.5,32.5 A50,50 0 0,1 82.5,91.5 z" fill="#10B981"></path>
                        {/* Company C: 20% */}
                        <path d="M50,50 L82.5,91.5 A50,50 0 0,1 29.5,95.5 z" fill="#F59E0B"></path>
                        {/* Company D: 25% */}
                        <path d="M50,50 L29.5,95.5 A50,50 0 0,1 50,0 z" fill="#EF4444"></path>
                      </svg>
                    </div>

                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-center">
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-blue-500 mr-2"></div>
                        <span>Company A: 25%</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-green-500 mr-2"></div>
                        <span>Company B: 30%</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-yellow-500 mr-2"></div>
                        <span>Company C: 20%</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-red-500 mr-2"></div>
                        <span>Company D: 25%</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* LINE CHARTS */}
            {question.chart_data?.type === 'line_chart' && (
              <div>
                <div className="text-xl font-bold text-blue-600 mb-3 text-center">Line Chart: {question.chart_data.title}</div>

                {/* Website Visitors Chart */}
                {question.chart_data.title === 'Website Visitors' && (
                  <div>
                    <div className="h-64 border-b border-l border-gray-300 relative p-4">
                      {/* Y-axis labels */}
                      <div className="absolute -left-10 bottom-0 h-full flex flex-col justify-between text-xs text-gray-600">
                        <span>100K</span>
                        <span>80K</span>
                        <span>60K</span>
                        <span>40K</span>
                        <span>20K</span>
                        <span>0</span>
                      </div>

                      {/* Points and lines */}
                      <svg className="w-full h-full" viewBox="0 0 700 400">
                        <polyline
                          points="50,300 150,270 250,200 350,150 450,90 550,70 650,50"
                          fill="none"
                          stroke="#3B82F6"
                          strokeWidth="4"
                        />
                        <circle cx="50" cy="300" r="8" fill="#3B82F6" />
                        <circle cx="150" cy="270" r="8" fill="#3B82F6" />
                        <circle cx="250" cy="200" r="8" fill="#3B82F6" />
                        <circle cx="350" cy="150" r="8" fill="#3B82F6" />
                        <circle cx="450" cy="90" r="8" fill="#3B82F6" />
                        <circle cx="550" cy="70" r="8" fill="#3B82F6" />
                        <circle cx="650" cy="50" r="8" fill="#3B82F6" />

                        {/* Values */}
                        <text x="50" y="325" fontSize="12" fill="#4B5563" textAnchor="middle">Jan</text>
                        <text x="150" y="325" fontSize="12" fill="#4B5563" textAnchor="middle">Feb</text>
                        <text x="250" y="325" fontSize="12" fill="#4B5563" textAnchor="middle">Mar</text>
                        <text x="350" y="325" fontSize="12" fill="#4B5563" textAnchor="middle">Apr</text>
                        <text x="450" y="325" fontSize="12" fill="#4B5563" textAnchor="middle">May</text>
                        <text x="550" y="325" fontSize="12" fill="#4B5563" textAnchor="middle">Jun</text>
                        <text x="650" y="325" fontSize="12" fill="#4B5563" textAnchor="middle">Jul</text>

                        <text x="50" y="280" fontSize="12" fill="#4B5563" textAnchor="middle">40K</text>
                        <text x="150" y="250" fontSize="12" fill="#4B5563" textAnchor="middle">45K</text>
                        <text x="250" y="180" fontSize="12" fill="#4B5563" textAnchor="middle">60K</text>
                        <text x="350" y="130" fontSize="12" fill="#4B5563" textAnchor="middle">70K</text>
                        <text x="450" y="70" fontSize="12" fill="#4B5563" textAnchor="middle">82K</text>
                        <text x="550" y="50" fontSize="12" fill="#4B5563" textAnchor="middle">88K</text>
                        <text x="650" y="30" fontSize="12" fill="#4B5563" textAnchor="middle">95K</text>
                      </svg>
                    </div>
                    <p className="text-center text-sm text-gray-700 mt-6">Monthly Website Visitors (January through July)</p>
                  </div>
                )}

                {/* Stock Prices Chart */}
                {question.chart_data.title === 'Stock Prices' && (
                  <div>
                    <div className="h-64 border-b border-l border-gray-300 relative p-4">
                      {/* Y-axis labels */}
                      <div className="absolute -left-10 bottom-0 h-full flex flex-col justify-between text-xs text-gray-600">
                        <span>$50</span>
                        <span>$45</span>
                        <span>$40</span>
                        <span>$35</span>
                        <span>$0</span>
                      </div>

                      {/* Points and lines */}
                      <svg className="w-full h-full" viewBox="0 0 500 400">
                        <polyline
                          points="50,200 150,100 250,150 350,50 450,30"
                          fill="none"
                          stroke="#EF4444"
                          strokeWidth="4"
                        />
                        <circle cx="50" cy="200" r="8" fill="#EF4444" />
                        <circle cx="150" cy="100" r="8" fill="#EF4444" />
                        <circle cx="250" cy="150" r="8" fill="#EF4444" />
                        <circle cx="350" cy="50" r="8" fill="#EF4444" />
                        <circle cx="450" cy="30" r="8" fill="#EF4444" />

                        {/* Values */}
                        <text x="50" y="325" fontSize="12" fill="#4B5563" textAnchor="middle">Jan</text>
                        <text x="150" y="325" fontSize="12" fill="#4B5563" textAnchor="middle">Feb</text>
                        <text x="250" y="325" fontSize="12" fill="#4B5563" textAnchor="middle">Mar</text>
                        <text x="350" y="325" fontSize="12" fill="#4B5563" textAnchor="middle">Apr</text>
                        <text x="450" y="325" fontSize="12" fill="#4B5563" textAnchor="middle">May</text>

                        <text x="50" y="180" fontSize="12" fill="#4B5563" textAnchor="middle">$40</text>
                        <text x="150" y="80" fontSize="12" fill="#4B5563" textAnchor="middle">$45</text>
                        <text x="250" y="130" fontSize="12" fill="#4B5563" textAnchor="middle">$43</text>
                        <text x="350" y="30" fontSize="12" fill="#4B5563" textAnchor="middle">$47</text>
                        <text x="450" y="10" fontSize="12" fill="#4B5563" textAnchor="middle">$48</text>
                      </svg>
                    </div>
                    <p className="text-center text-sm text-gray-700 mt-6">Company X Stock Prices (January through May)</p>
                  </div>
                )}
              </div>
            )}
          </div>
          {question?.data_description && (
            <div className="mt-2 text-sm text-gray-600 italic">
              {question.data_description}
            </div>
          )}
        </div>
      );
    } else if (question.data_type === 'table') {
      return (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">{question.table_data?.title || 'Table Data'}</h3>
          <div className="bg-gray-50 rounded-lg p-4 overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  {question.table_data?.headers.map((header, index) => (
                    <th key={index} className="py-2 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {question.table_data?.rows.map((row, rowIndex) => (
                  <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} className="py-2 px-4 border-b border-gray-200 text-sm text-gray-700">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }
    return null;
  };

  if (false && section) { // Disabled old completion logic
    // Calculate overall score
    const correctCount = Object.entries(answers).reduce((count, [questionId, selectedAnswer]) => {
      const question = section.questions.find(q => q.id === parseInt(questionId));
      if (question && question.correct_answer === selectedAnswer) {
        return count + 1;
      }
      return count;
    }, 0);

    const scorePercentage = Math.round((correctCount / section.questions.length) * 100);
    const timeSpentFormatted = formatTime(testData.duration_minutes * 60 - timeRemaining);

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-6"
      >
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-xl shadow-xl p-8">
            {/* Exact replica of the design you shared */}
            <div className="text-center">
              {/* Checkmark Icon */}
              <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-green-500 flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                </svg>
              </div>

              <h2 className="text-3xl font-bold text-gray-900 mb-2">Test Completed!</h2>
              <p className="text-gray-600 mb-8">
                Your Numerical Reasoning test has been submitted successfully.
              </p>
            </div>

            {/* Score Bar - Matching the image exactly */}
            <div className="mb-4 bg-purple-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-purple-600 uppercase">YOUR SCORE</span>
                <span className="text-sm font-medium text-purple-600">{scorePercentage}%</span>
              </div>
              <div className="w-full bg-purple-100 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full"
                  style={{ width: `${scorePercentage}%` }}
                ></div>
              </div>
            </div>

            {/* Score Details - Exactly as in the image */}
            <div className="grid grid-cols-2 gap-8 text-center mb-6">
              <div>
                <p className="text-3xl font-bold text-purple-600">
                  {correctCount} / {section.questions.length}
                </p>
                <p className="text-gray-600">Correct Answers</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-purple-600">
                  {timeSpentFormatted}
                </p>
                <p className="text-gray-600">Time Spent</p>
              </div>
            </div>

            <p className="text-center text-gray-600 mb-8">
              Your results will be processed and added to your profile.
            </p>

            <button
              onClick={() => {
                // Calculate and pass the results directly
                const correctCount = Object.entries(answers).reduce((count, [questionId, selectedAnswer]) => {
                  const question = section.questions.find(q => q.id === parseInt(questionId));
                  if (question && question.correct_answer === selectedAnswer) {
                    return count + 1;
                  }
                  return count;
                }, 0);

                const results = {
                  testType: 'Numerical Reasoning',
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
                  timeSpent: testData.duration_minutes * 60 - timeRemaining,
                  completed: true
                };

                if (onComplete) {
                  onComplete(results);
                } else if (typeof onBack === 'function') {
                  onBack();
                } else {
                  console.warn("Neither onComplete nor onBack functions were provided to NumericalReasoningTest");
                }
              }}
              className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium w-full"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Modern Test Header - Matching Verbal Test Design */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Test Info */}
            <div className="flex items-center space-x-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleExit}
                className="flex items-center text-gray-600 hover:text-red-600 transition-colors"
              >
                <FaTimes className="text-xl" />
              </motion.button>
              
              <div>
                <h1 className="text-xl font-bold text-gray-800">Numerical Reasoning Test</h1>
                <p className="text-sm text-gray-600">
                  Question {currentQuestion} of {totalQuestions}
                </p>
              </div>
            </div>

            {/* Center: Progress Bar */}
            <div className="flex-1 max-w-md mx-8">
              <div className="bg-gray-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(currentQuestion / totalQuestions) * 100}%` }}
                  transition={{ duration: 0.5 }}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1 text-center">
                {Math.round((currentQuestion / totalQuestions) * 100)}% Complete
              </p>
            </div>

            {/* Right: Timer & Controls */}
            <div className="flex items-center space-x-4">                    
              <div className={`text-right ${timeRemaining < 300 ? 'text-red-500' : timeRemaining < 600 ? 'text-orange-500' : 'text-blue-600'}`}>
                <div className="text-2xl font-bold font-mono">
                  <FaClock className="inline mr-2" />
                  {formatTime(timeRemaining)}
                </div>
                <p className="text-xs opacity-75">Time Remaining</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Test Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-6"
          >
            {/* Question Card - Matching Verbal Test Design */}
            <section className="bg-white rounded-2xl shadow-lg p-8">
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <FaQuestionCircle className="text-blue-600 text-xl mr-3" />
                <h3 className="text-lg font-semibold text-gray-800">
                  Question {currentQuestion}
                </h3>
              </div>
              
              <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                {question?.question_text || question?.question}
              </p>
              
              {/* Display data visuals if present */}
              {question && (question.data_type === 'chart' || question.data_type === 'table') && renderDataVisual(question)}
              
              {/* Answer Options - Matching Verbal Test Design */}
              <div role="radiogroup" aria-labelledby={`q-${question?.id}-label`} className="grid gap-4">
                {question?.options?.map((option, index) => {
                  // Handle both string and object options
                  const optionText = typeof option === 'string' ? option : option.text || option.value || option.option_id;
                  const optionValue = typeof option === 'string' ? option : option.value || option.option_id || option.text;
                  const isSelected = answers[question?.id]?.answer === optionValue;
                  const letters = ['A', 'B', 'C', 'D', 'E'];
                  
                  return (
                    <motion.label
                      key={`option-${index}-${optionValue}`}
                      className={`w-full rounded-xl border-2 px-6 py-4 cursor-pointer transition-all duration-200 ${
                        isSelected 
                          ? "border-blue-500 bg-blue-50 text-blue-700 shadow-lg" 
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 hover:shadow-md"
                      }`}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <input
                        type="radio"
                        name={`q-${question?.id}`}
                        value={optionValue}
                        className="sr-only"
                        checked={isSelected}
                        onChange={() => handleAnswerSelect(question?.id, optionValue)}
                      />
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 text-sm font-bold ${
                            isSelected 
                              ? 'bg-blue-500 text-white' 
                              : 'bg-gray-200 text-gray-600'
                          }`}>
                            {letters[index]}
                          </span>
                          <span className="text-lg font-medium">{optionText}</span>
                        </div>
                        {isSelected && <FaCheckCircle className="w-5 h-5 text-blue-500" />}
                      </div>
                    </motion.label>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Navigation - Matching Verbal Test Design */}
          <div className="flex justify-between items-center pt-6 border-t border-gray-200">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePrevious}
                disabled={currentQuestion === 1}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
              >
                <FaArrowLeft />
                Previous
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={currentQuestion === totalQuestions ? handleTestComplete : handleNext}
                disabled={!currentQuestionAnswered}
                className={`flex items-center gap-2 px-8 py-3 rounded-xl transition-all duration-200 font-medium shadow-lg ${
                  currentQuestionAnswered
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {currentQuestion === totalQuestions ? (
                  <>
                    <FaFlag />
                    Submit Test
                  </>
                ) : (
                  <>
                    Next
                    <FaArrowRight />
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Pause Modal */}
      <AnimatePresence>
        {showPauseModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
            >
              <div className="text-center">
                <FaPause className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Test Paused</h3>
                <p className="text-gray-600 mb-6">
                  Your test is currently paused. Click resume to continue.
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={handleResume}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Resume Test
                  </button>
                  <button
                    onClick={handleConfirmExit}
                    className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Exit Test
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Exit Modal */}
      <AnimatePresence>
        {showExitModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
            >
              <div className="text-center">
                <FaTimesCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Exit Test?</h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to exit? Your progress will be lost.
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowExitModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmExit}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
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

export default NumericalReasoningTest;
