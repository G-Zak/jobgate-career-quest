import React, { useState, useEffect } from 'react';
import backendApi from '../api/backendApi';
import { 
    FaCode, 
    FaClock, 
    FaQuestionCircle, 
    FaChartBar, 
    FaCheckCircle, 
    FaTimes,
    FaLightbulb,
    FaArrowRight,
    FaArrowLeft
} from 'react-icons/fa';
// Removed frontend data imports - using backend API instead
import { submitTestAttempt, fetchTestQuestions } from '../lib/backendSubmissionHelper';
import TestResultsPage from './TestResultsPage';

const TechnicalTest = ({ userId = 'user123', onTestComplete, testId = 'technical' }) => {
  // Map frontend test ID to backend database ID
  const getBackendTestId = (frontendId) => {
    const testIdMapping = {
      'technical': '9', // Default to JavaScript Technical Test
      'javascript': '9',
      'python': '10',
      'js': '9',
      'py': '10',
      'TCT1': '9', // Add TCT mappings
      'TCT2': '10'
    };
    return testIdMapping[frontendId] || frontendId || '9'; // Default to JavaScript
  };
  
  const backendTestId = getBackendTestId(testId);
  
  const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState({});
    const [testStarted, setTestStarted] = useState(false);
    const [testCompleted, setTestCompleted] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showExplanation, setShowExplanation] = useState(false);
  const [startedAt, setStartedAt] = useState(null);
  const [results, setResults] = useState(null);

    useEffect(() => {
        loadTest();
    }, [backendTestId]);

    useEffect(() => {
        let timer;
        if (testStarted && timeRemaining > 0 && !testCompleted) {
            timer = setInterval(() => {
                setTimeRemaining(prev => {
                    if (prev <= 1) {
                        handleTimeUp();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [testStarted, timeRemaining, testCompleted]);

    const loadTest = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch test questions from backend (secure - no correct answers)
            const fetchedQuestions = await fetchTestQuestions(backendTestId);
            setQuestions(fetchedQuestions);
            
            // Set default time limit (30 minutes for technical tests)
            setTimeRemaining(30 * 60);
            setStartedAt(new Date());
            
        } catch (err) {
            console.error('Failed to load technical test:', err);
            setError('Failed to load technical test. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const startTest = () => {
        setTestStarted(true);
        setCurrentQuestionIndex(0);
    };

    const handleTimeUp = () => {
        handleFinishTest();
    };

    const handleAnswerSelect = (questionId, answer) => {
        setUserAnswers(prev => ({
            ...prev,
            [questionId]: answer
        }));
    };

    const goToNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setShowExplanation(false);
        } else {
            handleFinishTest();
        }
    };

    const goToPreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
            setShowExplanation(false);
        }
    };

    const handleFinishTest = async () => {
        try {
            // Submit to backend for scoring
            const result = await submitTestAttempt({
                testId: backendTestId,
                answers: userAnswers,
                startedAt: startedAt,
                finishedAt: Date.now(),
                reason: 'user',
                metadata: {
                    testType: 'technical',
                    totalQuestions: questions.length,
                    currentQuestion: currentQuestionIndex + 1
                },
                onSuccess: (data) => {
                    console.log('Test submitted successfully:', data);
                    setResults(data.score);
        setTestCompleted(true);
                },
                onError: (error) => {
                    console.error('Test submission failed:', error);
                    setError(`Submission failed: ${error.message}`);
                }
            });
            
        } catch (error) {
            console.error('Error finishing test:', error);
            setError('Failed to submit test. Please try again.');
        }
    };


    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const getProgressPercentage = () => {
        if (!questions?.length) return 0;
        return Math.round(((currentQuestionIndex + 1) / questions.length) * 100);
    };

    const getAnsweredCount = () => {
        return Object.keys(userAnswers).length;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading technical test...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-2xl mx-auto p-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                    <FaTimes className="text-red-500 text-4xl mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-red-800 mb-2">Unable to Load Test</h3>
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        onClick={loadTest}
                        className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!testStarted) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                    <FaCode className="text-6xl text-blue-600 mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">Technical Test</h1>
                    <p className="text-lg text-gray-600 mb-6">
                        Test your technical knowledge with {questions.length} questions covering various programming concepts.
                    </p>
                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                        <div className="text-center p-6 bg-blue-50 rounded-lg">
                            <FaQuestionCircle className="text-3xl text-blue-600 mx-auto mb-2" />
                            <h3 className="font-semibold text-gray-800">Questions</h3>
                            <p className="text-2xl font-bold text-blue-600">{questions.length}</p>
                        </div>
                        <div className="text-center p-6 bg-green-50 rounded-lg">
                            <FaClock className="text-3xl text-green-600 mx-auto mb-2" />
                            <h3 className="font-semibold text-gray-800">Time Limit</h3>
                            <p className="text-2xl font-bold text-green-600">30 minutes</p>
                        </div>
                        <div className="text-center p-6 bg-purple-50 rounded-lg">
                            <FaChartBar className="text-3xl text-purple-600 mx-auto mb-2" />
                            <h3 className="font-semibold text-gray-800">Type</h3>
                            <p className="text-2xl font-bold text-purple-600">Technical</p>
                        </div>
                    </div>
                    <button
                        onClick={startTest}
                        className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                    >
                        Start Test
                    </button>
                </div>
            </div>
        );
    }

    if (testCompleted) {
        return (
            <TestResultsPage
                results={results}
                testType="technical"
                testId={testId}
                answers={userAnswers}
                testData={{ questions }}
                onBackToDashboard={onTestComplete}
            />
        );
    }

    const currentQuestion = questions && Array.isArray(questions) && questions.length > 0 ? questions[currentQuestionIndex] : null;
    const userAnswer = currentQuestion ? userAnswers[currentQuestion.id] : null;

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <FaCode className="text-blue-600 text-xl" />
                        <div>
                            <h1 className="text-xl font-bold">Technical Assessment</h1>
                            <p className="text-gray-600">Question {currentQuestionIndex + 1} of {questions.length}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <FaClock className="text-orange-500" />
                            <span className={`font-mono ${timeRemaining < 300 ? 'text-red-600' : 'text-gray-700'}`}>
                                {formatTime(timeRemaining)}
                            </span>
                        </div>
                        <div className="text-sm text-gray-600">
                            {getAnsweredCount()}/{questions.length} answered
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${getProgressPercentage()}%` }}
                        ></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{getProgressPercentage()}% complete</p>
                </div>
            </div>

            {/* Question */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                            {currentQuestion.question_type}
                        </span>
                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                            Technical
                        </span>
                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                            {currentQuestion.difficulty_level}
                        </span>
                    </div>
                    <h2 className="text-lg font-semibold mb-4">
                        {currentQuestion.question_text}
                    </h2>
                    {currentQuestion.context && (
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                            <p className="text-sm text-blue-800 font-medium">
                                <strong>Context:</strong> {currentQuestion.context}
                            </p>
                        </div>
                    )}
                </div>

                {/* Options */}
                <div className="space-y-3">
                    {currentQuestion.options.map((option, index) => {
                        const optionLetter = String.fromCharCode(65 + index); // A, B, C, D, E
                        const isSelected = userAnswer === optionLetter;
                        
                        return (
                        <button
                                key={optionLetter}
                                onClick={() => handleAnswerSelect(currentQuestion.id, optionLetter)}
                            className={`w-full text-left p-4 border-2 rounded-lg transition-colors ${
                                    isSelected
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300'
                            }`}
                        >
                            <div className="flex items-start gap-3">
                                <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-medium ${
                                        isSelected
                                        ? 'bg-blue-500 text-white border-blue-500'
                                        : 'border-gray-300'
                                }`}>
                                        {optionLetter}
                                </span>
                                    <span>{option}</span>
                            </div>
                        </button>
                        );
                    })}
                </div>

                {/* Explanation Toggle */}
                {currentQuestion.explanation && (
                    <div className="mt-4">
                        <button
                            onClick={() => setShowExplanation(!showExplanation)}
                            className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                        >
                            <FaLightbulb />
                            {showExplanation ? 'Hide' : 'Show'} Explanation
                        </button>
                        {showExplanation && (
                            <div className="mt-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <p className="text-gray-700">{currentQuestion.explanation}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center">
                <button
                    onClick={goToPreviousQuestion}
                    disabled={currentQuestionIndex === 0}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <FaArrowLeft />
                    Previous
                </button>

                <div className="text-center">
                    <p className="text-sm text-gray-600">
                        Question {currentQuestionIndex + 1} of {questions.length}
                    </p>
                </div>

                {currentQuestionIndex === questions.length - 1 ? (
                    <button
                        onClick={goToNextQuestion}
                        className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                    >
                        <FaCheckCircle />
                        Complete Test
                    </button>
                ) : (
                    <button
                        onClick={goToNextQuestion}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Next
                        <FaArrowRight />
                    </button>
                )}
            </div>
        </div>
    );
};



export default TechnicalTest;
