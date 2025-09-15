import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChartLine, FaClock, FaStop, FaArrowRight, FaFlag, FaCalculator, FaQuestionCircle, FaTable, FaChartBar, FaCheckCircle, FaBrain, FaTimesCircle, FaPause, FaPlay, FaTimes, FaCog, FaSearch, FaLightbulb, FaPuzzlePiece, FaCheck } from 'react-icons/fa';
import { getNumericalTestWithAnswers } from '../data/numericalTestSections';
import { useScrollToTop, useTestScrollToTop, useQuestionScrollToTop, scrollToTop } from '../../../shared/utils/scrollUtils';
import { submitTestAttempt } from '../lib/submitHelper';
import TestResultsPage from './TestResultsPage';
import { getRuleFor } from '../testRules';
import { buildAttempt } from '../lib/scoreUtils';
import { useAttempts } from '../store/useAttempts';
import { createTestScoringIntegration, formatUniversalResults } from '../lib/universalScoringIntegration';

const NumericalReasoningTestWithUniversalScoring = ({ onBackToDashboard, testId }) => {
    const rule = getRuleFor(testId);
    const { addAttempt } = useAttempts();
    const [testStep, setTestStep] = useState('test');
    const [currentSection, setCurrentSection] = useState(1);
    const [currentQuestion, setCurrentQuestion] = useState(1);
    const [timeRemaining, setTimeRemaining] = useState(rule?.timeLimitMin * 60 || 20 * 60);
    const [answers, setAnswers] = useState({});
    const [testData, setTestData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isPaused, setIsPaused] = useState(false);
    const [showPauseModal, setShowPauseModal] = useState(false);
    const [showExitModal, setShowExitModal] = useState(false);
    const [startedAt, setStartedAt] = useState(null);
    const [results, setResults] = useState(null);
    const [scoringSystem, setScoringSystem] = useState(null);
    const [showScoringDemo, setShowScoringDemo] = useState(false);
    const timerRef = useRef(null);
    const startedAtRef = useRef(Date.now());

    // Universal scroll management
    useScrollToTop([], { smooth: true });
    useTestScrollToTop(testStep, 'numerical-test-scroll', { smooth: true, attempts: 5 });
    useQuestionScrollToTop(currentQuestion, testStep, 'numerical-test-scroll');

    // Load test data and initialize scoring system
    useEffect(() => {
        try {
            setLoading(true);
            const data = getNumericalTestWithAnswers();

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
            startedAtRef.current = Date.now();

            // Initialize universal scoring system
            const allQuestions = limitedData.sections.flatMap(section => section.questions);
            const scoringIntegration = createTestScoringIntegration('numerical', allQuestions, data.scoringConfig);
            setScoringSystem(scoringIntegration);

            // Start the test timer in scoring system
            scoringIntegration.startTest();
        } catch (error) {
            console.error('Error loading numerical test data:', error);
        } finally {
            setLoading(false);
        }
    }, [rule]);

    // Start question timer when question changes
    useEffect(() => {
        if (scoringSystem && currentSectionData?.questions?.[currentQuestion - 1]) {
            const question = currentSectionData.questions[currentQuestion - 1];
            const questionIdStr = `numerical_${question.question_id}`;
            scoringSystem.startQuestionTimer(questionIdStr);
        }
    }, [currentQuestion, scoringSystem, currentSectionData]);

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
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [testStep, timeRemaining, isPaused]);

    const currentSectionData = testData?.sections?.[currentSection - 1];
    const totalQuestions = currentSectionData?.questions?.length || 0;
    const currentQuestionData = currentSectionData?.questions?.[currentQuestion - 1];

    // Handle answer selection with universal scoring
    const handleAnswerSelect = (questionId, answer) => {
        const question = currentSectionData?.questions?.find(q => q.question_id === questionId);
        const isCorrect = question ? question.correct_answer === answer : false;

        // Record answer in universal scoring system
        if (scoringSystem) {
            const questionIdStr = `numerical_${questionId}`;
            scoringSystem.recordAnswer(questionIdStr, answer);
        }

        setAnswers(prev => ({
            ...prev,
            [questionId]: {
                answer,
                isCorrect,
                timestamp: new Date().toISOString()
            }
        }));
    };

    // Handle timer expiry with universal scoring
    const handleTimeUp = async () => {
        try {
            const endTime = new Date();
            const duration = Math.floor((endTime - startedAt) / 1000);

            // Get results from universal scoring system
            let universalResults = null;
            if (scoringSystem) {
                universalResults = scoringSystem.getResults();
            }

            // Fallback to simple scoring if universal scoring not available
            const totalQuestions = rule?.totalQuestions || 20;
            const correctAnswers = Object.values(answers).filter(answer => answer.isCorrect).length;
            const score = universalResults ? universalResults.percentage : (totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0);

            // Build attempt record
            const attempt = buildAttempt(testId, totalQuestions, correctAnswers, startedAtRef.current, 'time');
            addAttempt(attempt);

            const testResults = {
                testId: testId,
                testType: 'numerical-reasoning',
                score: score,
                totalQuestions: totalQuestions,
                correctAnswers: correctAnswers,
                duration: duration,
                answers: answers,
                completedAt: endTime.toISOString(),
                startedAt: startedAt?.toISOString(),
                attempt: attempt,
                universalResults: universalResults // Include universal scoring results
            };

            // Submit to backend
            try {
                await submitTestAttempt(testResults);
            } catch (error) {
                console.error('Error submitting test attempt:', error);
            }

            setResults(testResults);
            setTestStep('results');
        } catch (error) {
            console.error('Error handling time up:', error);
        }
    };

    // Handle test completion with universal scoring
    const handleTestComplete = async () => {
        try {
            const endTime = new Date();
            const duration = Math.floor((endTime - startedAt) / 1000);

            // Get results from universal scoring system
            let universalResults = null;
            if (scoringSystem) {
                universalResults = scoringSystem.getResults();
            }

            // Fallback to simple scoring if universal scoring not available
            const totalQuestions = rule?.totalQuestions || 20;
            const correctAnswers = Object.values(answers).filter(answer => answer.isCorrect).length;
            const score = universalResults ? universalResults.percentage : (totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0);

            // Build attempt record
            const attempt = buildAttempt(testId, totalQuestions, correctAnswers, startedAtRef.current, 'user');
            addAttempt(attempt);

            const testResults = {
                testId: testId,
                testType: 'numerical-reasoning',
                score: score,
                totalQuestions: totalQuestions,
                correctAnswers: correctAnswers,
                duration: duration,
                answers: answers,
                completedAt: endTime.toISOString(),
                startedAt: startedAt?.toISOString(),
                attempt: attempt,
                universalResults: universalResults // Include universal scoring results
            };

            // Submit to backend
            try {
                await submitTestAttempt(testResults);
            } catch (error) {
                console.error('Error submitting test attempt:', error);
            }

            setResults(testResults);
            setTestStep('results');
        } catch (error) {
            console.error('Error completing test:', error);
        }
    };

    // Navigation functions
    const handleNext = () => {
        if (currentQuestion < totalQuestions) {
            setCurrentQuestion(prev => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestion > 1) {
            setCurrentQuestion(prev => prev - 1);
        }
    };

    const handlePause = () => {
        setIsPaused(true);
        setShowPauseModal(true);
    };

    const handleResume = () => {
        setIsPaused(false);
        setShowPauseModal(false);
    };

    const handleExit = () => {
        setShowExitModal(true);
    };

    const handleConfirmExit = () => {
        onBackToDashboard();
    };

    // Utility functions
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getCurrentStats = () => {
        if (!scoringSystem) return null;
        return scoringSystem.getCurrentStats();
    };

    const showScoringBreakdown = () => {
        if (!scoringSystem || !currentQuestionData) return null;

        const questionIdStr = `numerical_${currentQuestionData.question_id}`;
        const breakdown = scoringSystem.getScoreBreakdown(questionIdStr);

        if (!breakdown) return null;

        return (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="text-sm font-semibold text-blue-800 mb-2">Scoring Breakdown</h4>
                <div className="text-xs text-blue-700 space-y-1">
                    <div>Correct: {breakdown.correct ? 'Yes' : 'No'}</div>
                    <div>Final Score: {breakdown.finalScore} points</div>
                    {breakdown.breakdown && (
                        <>
                            <div>Base Score: {breakdown.breakdown.baseScore}</div>
                            <div>Difficulty Bonus: {breakdown.breakdown.difficultyBonus}</div>
                            <div>Time Bonus: {breakdown.breakdown.timeBonus}</div>
                            <div>Time Efficiency: {breakdown.breakdown.timeEfficiency}</div>
                        </>
                    )}
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading numerical reasoning test...</p>
                </div>
            </div>
        );
    }

    if (testStep === 'results' && results) {
        return (
            <TestResultsPage
                results={results}
                onBackToDashboard={onBackToDashboard}
                showUniversalResults={true}
            />
        );
    }

    if (!testData || !currentSectionData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600">Error loading test data</p>
                    <button
                        onClick={onBackToDashboard}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50" id="numerical-test-scroll">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={onBackToDashboard}
                                className="text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                <FaArrowRight className="w-5 h-5 rotate-180" />
                            </button>
                            <div>
                                <h1 className="text-xl font-semibold text-gray-900">Numerical Reasoning Test</h1>
                                <p className="text-sm text-gray-600">Universal Scoring System Active</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            {/* Scoring Demo Button */}
                            <button
                                onClick={() => setShowScoringDemo(!showScoringDemo)}
                                className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors"
                            >
                                <FaCog className="inline w-3 h-3 mr-1" />
                                Scoring Demo
                            </button>

                            {/* Timer */}
                            <div className="flex items-center space-x-2 bg-red-50 px-3 py-1 rounded-full">
                                <FaClock className="w-4 h-4 text-red-600" />
                                <span className="text-sm font-medium text-red-600">
                                    {formatTime(timeRemaining)}
                                </span>
                            </div>

                            {/* Pause Button */}
                            <button
                                onClick={isPaused ? handleResume : handlePause}
                                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                            >
                                {isPaused ? <FaPlay className="w-4 h-4" /> : <FaPause className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-white border-b">
                <div className="max-w-4xl mx-auto px-4 py-2">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                        <span>Question {currentQuestion} of {totalQuestions}</span>
                        <span>{Math.round((currentQuestion / totalQuestions) * 100)}% Complete</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(currentQuestion / totalQuestions) * 100}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 py-8">
                {showScoringDemo && (
                    <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                        <h3 className="text-lg font-semibold text-purple-800 mb-2">🎯 Universal Scoring System Demo</h3>
                        <div className="text-sm text-purple-700 space-y-2">
                            <p><strong>How it works:</strong></p>
                            <ul className="list-disc list-inside space-y-1 ml-4">
                                <li>Wrong answer = 0 points</li>
                                <li>Correct answer = Base score + Difficulty bonus + Time bonus</li>
                                <li>Faster answers get higher time bonuses</li>
                                <li>Harder questions give more points when answered correctly</li>
                            </ul>
                            {getCurrentStats() && (
                                <div className="mt-3 p-2 bg-purple-100 rounded">
                                    <strong>Current Stats:</strong> {getCurrentStats().answeredQuestions}/{getCurrentStats().totalQuestions} answered,
                                    Avg time: {getCurrentStats().averageTimePerQuestion}s
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {currentQuestionData && (
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        {/* Question Header */}
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                                <FaCalculator className="w-5 h-5 text-blue-600 mr-2" />
                                Question {currentQuestion} <span className="text-sm text-gray-500 ml-2">({currentQuestionData?.category || 'General'})</span>
                            </h2>
                            <span className="text-sm text-gray-500">
                                Complexity: {currentQuestionData?.complexity_score || 3}/5
                            </span>
                        </div>

                        {/* Question Text */}
                        <div className="mb-6">
                            <p className="text-gray-800 text-lg leading-relaxed">
                                {currentQuestionData.question}
                            </p>
                        </div>

                        {/* Answer Options */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                            {currentQuestionData?.options?.map((option) => (
                                <button
                                    key={option.option_id}
                                    onClick={() => handleAnswerSelect(currentQuestionData.question_id, option.option_id)}
                                    className={`p-4 rounded border-2 transition-all duration-200 text-left ${answers[currentQuestionData.question_id]?.answer === option.option_id
                                            ? 'border-blue-500 bg-blue-100 text-blue-800'
                                            : 'border-gray-200 hover:border-blue-300 bg-white'
                                        }`}
                                >
                                    <div className="flex items-center">
                                        <span className="font-semibold text-lg mr-3">{option.option_id}.</span>
                                        <span>{option.text}</span>
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Scoring Breakdown */}
                        {answers[currentQuestionData.question_id] && showScoringBreakdown()}

                        {/* Navigation */}
                        <div className="flex items-center justify-between mt-8 pt-6 border-t">
                            <button
                                onClick={handlePrevious}
                                disabled={currentQuestion === 1}
                                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Previous
                            </button>

                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={handleExit}
                                    className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    Exit Test
                                </button>

                                {currentQuestion === totalQuestions ? (
                                    <button
                                        onClick={handleTestComplete}
                                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                    >
                                        Complete Test
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleNext}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Next
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Pause Modal */}
            {showPauseModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md mx-4">
                        <h3 className="text-lg font-semibold mb-4">Test Paused</h3>
                        <p className="text-gray-600 mb-6">Your progress has been saved. You can resume when ready.</p>
                        <div className="flex space-x-3">
                            <button
                                onClick={handleResume}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Resume
                            </button>
                            <button
                                onClick={() => {
                                    setShowPauseModal(false);
                                    handleConfirmExit();
                                }}
                                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                            >
                                Exit
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Exit Modal */}
            {showExitModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md mx-4">
                        <h3 className="text-lg font-semibold mb-4">Exit Test?</h3>
                        <p className="text-gray-600 mb-6">Are you sure you want to exit? Your progress will be lost.</p>
                        <div className="flex space-x-3">
                            <button
                                onClick={handleConfirmExit}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                                Exit
                            </button>
                            <button
                                onClick={() => setShowExitModal(false)}
                                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NumericalReasoningTestWithUniversalScoring;

