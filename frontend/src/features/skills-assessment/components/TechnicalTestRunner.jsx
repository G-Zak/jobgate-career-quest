import React, { useState, useEffect } from 'react';
import {
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon,
    ArrowLeftIcon,
    ArrowRightIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';
import { mockTechnicalTests, getRandomQuestions } from '../../../data/mockTechnicalTests';
import { calculateTestScore, saveTestResult } from '../../../utils/testScoring';

const TechnicalTestRunner = ({ testId, userId, onTestComplete, onBack }) => {
    const [test, setTest] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(0);
    const [testStarted, setTestStarted] = useState(false);
    const [testCompleted, setTestCompleted] = useState(false);
    const [testResult, setTestResult] = useState(null);
    const [loading, setLoading] = useState(true);

    // Initialize test
    useEffect(() => {
        const initializeTest = () => {
            const foundTest = Object.values(mockTechnicalTests).find(t => t.id === testId);
            if (foundTest) {
                setTest(foundTest);
                setTimeLeft(foundTest.time_limit * 60); // Convert minutes to seconds
                const randomQuestions = getRandomQuestions(testId, foundTest.question_count);
                setQuestions(randomQuestions);
                setLoading(false);
            } else {
                console.error('Test not found:', testId);
                setLoading(false);
            }
        };

        initializeTest();
    }, [testId]);

    // Timer countdown
    useEffect(() => {
        if (!testStarted || testCompleted || timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    handleTestComplete();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [testStarted, testCompleted, timeLeft]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleAnswerSelect = (questionId, answerIndex) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: answerIndex
        }));
    };

    const handleNextQuestion = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(prev => prev + 1);
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(prev => prev - 1);
        }
    };

    const handleTestComplete = () => {
        const result = calculateTestScore(answers, questions);
        const timeSpent = (test.time_limit * 60) - timeLeft;

        console.log('🎯 Test completed!', {
            testId,
            userId,
            result,
            timeSpent,
            answers: Object.keys(answers).length
        });

        // Save test result
        const savedResult = saveTestResult(testId, userId, result, answers, timeSpent);
        console.log('💾 Test result saved:', savedResult);

        setTestResult({
            ...result,
            timeSpent,
            savedResult
        });
        setTestCompleted(true);

        if (onTestComplete) {
            onTestComplete(result);
        }
    };

    const startTest = () => {
        setTestStarted(true);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-slate-600 dark:text-slate-400">Loading test...</p>
                </div>
            </div>
        );
    }

    if (!test) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <XCircleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                        Test Not Found
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                        The requested test could not be found.
                    </p>
                    <button
                        onClick={onBack}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    // Test completed - show results
    if (testCompleted && testResult) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8">
                        <div className="text-center mb-8">
                            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${testResult.passed ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'
                                }`}>
                                {testResult.passed ? (
                                    <CheckCircleIcon className="w-10 h-10 text-green-500" />
                                ) : (
                                    <XCircleIcon className="w-10 h-10 text-red-500" />
                                )}
                            </div>

                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                                {testResult.passed ? 'Congratulations!' : 'Test Completed'}
                            </h1>

                            <p className="text-slate-600 dark:text-slate-400 mb-6">
                                {testResult.passed
                                    ? 'You passed the test with flying colors!'
                                    : 'You completed the test. Keep practicing to improve your score!'
                                }
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="text-center p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                                    {testResult.score}%
                                </div>
                                <div className="text-sm text-slate-600 dark:text-slate-400">Final Score</div>
                            </div>

                            <div className="text-center p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
                                    {testResult.correctAnswers}/{testResult.totalQuestions}
                                </div>
                                <div className="text-sm text-slate-600 dark:text-slate-400">Correct Answers</div>
                            </div>

                            <div className="text-center p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                                    {formatTime(testResult.timeSpent)}
                                </div>
                                <div className="text-sm text-slate-600 dark:text-slate-400">Time Spent</div>
                            </div>
                        </div>

                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={onBack}
                                className="px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
                            >
                                Back to Tests
                            </button>
                            <button
                                onClick={() => {
                                    setTestCompleted(false);
                                    setTestResult(null);
                                    setAnswers({});
                                    setCurrentQuestion(0);
                                    setTestStarted(false);
                                    setTimeLeft(test.time_limit * 60);
                                }}
                                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                Retake Test
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Test not started - show instructions
    if (!testStarted) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                                {test.test_name}
                            </h1>
                            <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
                                {test.description}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Test Details</h3>
                                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                                    <li>• {test.question_count} questions</li>
                                    <li>• {test.time_limit} minutes time limit</li>
                                    <li>• {test.total_score} points total</li>
                                    <li>• {test.difficulty} level</li>
                                </ul>
                            </div>

                            <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
                                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Instructions</h3>
                                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                                    <li>• Read each question carefully</li>
                                    <li>• Select the best answer</li>
                                    <li>• You can navigate between questions</li>
                                    <li>• Test auto-submits when time runs out</li>
                                </ul>
                            </div>
                        </div>

                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={onBack}
                                className="px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={startTest}
                                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                Start Test
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Test in progress - show current question
    const currentQ = questions[currentQuestion];
    const progress = ((currentQuestion + 1) / questions.length) * 100;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                                {test.test_name}
                            </h1>
                            <p className="text-slate-600 dark:text-slate-400">
                                Question {currentQuestion + 1} of {questions.length}
                            </p>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className={`flex items-center ${timeLeft < 300 ? 'text-red-500' : 'text-blue-500'}`}>
                                <ClockIcon className="w-5 h-5 mr-2" />
                                <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
                            </div>

                            <button
                                onClick={onBack}
                                className="flex items-center px-3 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                                title="Exit Test"
                            >
                                <XMarkIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <div
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>

                {/* Question */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 mb-6">
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
                        {currentQ.question}
                    </h2>

                    <div className="space-y-3">
                        {currentQ.options.map((option, index) => (
                            <label
                                key={index}
                                className={`block p-4 rounded-lg border-2 cursor-pointer transition-colors ${answers[currentQ.id] === index
                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                                    : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name={`question_${currentQ.id}`}
                                    value={index}
                                    checked={answers[currentQ.id] === index}
                                    onChange={() => handleAnswerSelect(currentQ.id, index)}
                                    className="sr-only"
                                />
                                <span className="text-slate-900 dark:text-white">
                                    {String.fromCharCode(65 + index)}. {option}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>


                {/* Navigation Buttons */}
                <div className="flex justify-between">
                    <button
                        onClick={handlePreviousQuestion}
                        disabled={currentQuestion === 0}
                        className="flex items-center px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ArrowLeftIcon className="w-4 h-4 mr-2" />
                        Previous
                    </button>

                    {currentQuestion === questions.length - 1 ? (
                        <button
                            onClick={handleTestComplete}
                            className="flex items-center px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                        >
                            Submit Test
                        </button>
                    ) : (
                        <button
                            onClick={handleNextQuestion}
                            className="flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            Next
                            <ArrowRightIcon className="w-4 h-4 ml-2" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TechnicalTestRunner;
