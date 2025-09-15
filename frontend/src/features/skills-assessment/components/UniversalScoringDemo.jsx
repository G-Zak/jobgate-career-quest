import React, { useState } from 'react';
import { FaCalculator, FaBrain, FaChartLine, FaClock, FaCheck, FaTimes } from 'react-icons/fa';
import { createTestScoringIntegration, formatUniversalResults } from '../lib/universalScoringIntegration';

const UniversalScoringDemo = () => {
    const [selectedTestType, setSelectedTestType] = useState('numerical');
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [userAnswers, setUserAnswers] = useState({});
    const [questionStartTime, setQuestionStartTime] = useState(null);
    const [showResults, setShowResults] = useState(false);
    const [results, setResults] = useState(null);

    // Sample questions for different test types
    const sampleQuestions = {
        numerical: [
            {
                id: 'num_1',
                question_id: 1,
                type: 'numerical',
                question: 'If a car travels at 60 mph for 2.5 hours, how far does it travel?',
                options: [
                    { option_id: 'A', text: '120 miles' },
                    { option_id: 'B', text: '150 miles' },
                    { option_id: 'C', text: '180 miles' },
                    { option_id: 'D', text: '200 miles' }
                ],
                correct_answer: 'B',
                complexity_score: 2,
                category: 'Basic Arithmetic'
            },
            {
                id: 'num_2',
                question_id: 2,
                type: 'numerical',
                question: 'An investment of $5,000 grows to $6,200 after 2 years. What is the annual growth rate?',
                options: [
                    { option_id: 'A', text: '10%' },
                    { option_id: 'B', text: '12%' },
                    { option_id: 'C', text: '15%' },
                    { option_id: 'D', text: '24%' }
                ],
                correct_answer: 'B',
                complexity_score: 4,
                category: 'Financial Calculations'
            }
        ],
        logical: [
            {
                id: 'logical_1',
                type: 'multiple_choice',
                question: 'Look at this series: 2, 4, 6, 8, 10, ... What number should come next?',
                options: ['11', '12', '13', '14'],
                correct_answer: 'b',
                difficulty: 1,
                section: 1
            },
            {
                id: 'logical_2',
                type: 'multiple_choice',
                question: 'Look at this series: 2, 6, 18, 54, ... What number should come next?',
                options: ['108', '148', '162', '216'],
                correct_answer: 'c',
                difficulty: 3,
                section: 1
            }
        ],
        verbal: [
            {
                id: 'verbal_1',
                type: 'multiple_choice',
                question: 'Choose the word that best completes the analogy: Book is to Library as Car is to ___',
                options: ['Garage', 'Road', 'Driver', 'Engine'],
                correct_answer: 'a',
                difficulty: 2,
                section: 1
            },
            {
                id: 'verbal_2',
                type: 'multiple_choice',
                question: 'Which word is most similar in meaning to "ephemeral"?',
                options: ['Permanent', 'Temporary', 'Important', 'Difficult'],
                correct_answer: 'b',
                difficulty: 3,
                section: 1
            }
        ]
    };

    const [scoringSystem] = useState(() => {
        const questions = sampleQuestions[selectedTestType];
        return createTestScoringIntegration(selectedTestType, questions);
    });

    const questions = sampleQuestions[selectedTestType];
    const currentQuestionData = questions[currentQuestion];

    const handleTestTypeChange = (testType) => {
        setSelectedTestType(testType);
        setCurrentQuestion(0);
        setUserAnswers({});
        setShowResults(false);
        setResults(null);

        // Reinitialize scoring system
        const newQuestions = sampleQuestions[testType];
        const newScoringSystem = createTestScoringIntegration(testType, newQuestions);
        newScoringSystem.startTest();
        setQuestionStartTime(Date.now());
    };

    const handleAnswerSelect = (answer) => {
        if (!questionStartTime) return;

        const timeTaken = (Date.now() - questionStartTime) / 1000;
        const questionId = selectedTestType === 'numerical' ?
            `numerical_${currentQuestionData.question_id}` :
            currentQuestionData.id;

        // Record answer in scoring system
        scoringSystem.recordAnswer(questionId, answer);

        setUserAnswers(prev => ({
            ...prev,
            [currentQuestion]: { answer, timeTaken }
        }));

        // Move to next question or show results
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(prev => prev + 1);
            setQuestionStartTime(Date.now());
        } else {
            // Test complete
            const testResults = scoringSystem.getResults();
            const formattedResults = formatUniversalResults(testResults, selectedTestType);
            setResults(formattedResults);
            setShowResults(true);
        }
    };

    const startDemo = () => {
        setCurrentQuestion(0);
        setUserAnswers({});
        setShowResults(false);
        setResults(null);
        setQuestionStartTime(Date.now());
        scoringSystem.reset();
        scoringSystem.startTest();
    };

    const getScoreBreakdown = () => {
        if (!userAnswers[currentQuestion]) return null;

        const questionId = selectedTestType === 'numerical' ?
            `numerical_${currentQuestionData.question_id}` :
            currentQuestionData.id;

        return scoringSystem.getScoreBreakdown(questionId);
    };

    const getTestTypeIcon = (type) => {
        switch (type) {
            case 'numerical': return <FaCalculator className="w-5 h-5" />;
            case 'logical': return <FaBrain className="w-5 h-5" />;
            case 'verbal': return <FaChartLine className="w-5 h-5" />;
            default: return <FaCalculator className="w-5 h-5" />;
        }
    };

    const getTestTypeColor = (type) => {
        switch (type) {
            case 'numerical': return 'blue';
            case 'logical': return 'green';
            case 'verbal': return 'purple';
            default: return 'blue';
        }
    };

    if (showResults && results) {
        return (
            <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                            <FaCheck className="w-8 h-8 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Test Complete!</h2>
                        <p className="text-gray-600">Universal Scoring System Results</p>
                    </div>

                    {/* Overall Score */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-blue-50 p-6 rounded-lg text-center">
                            <div className="text-3xl font-bold text-blue-600 mb-2">{results.score}/{results.maxScore}</div>
                            <div className="text-sm text-blue-800">Total Score</div>
                        </div>
                        <div className="bg-green-50 p-6 rounded-lg text-center">
                            <div className="text-3xl font-bold text-green-600 mb-2">{results.percentage}%</div>
                            <div className="text-sm text-green-800">Percentage</div>
                        </div>
                        <div className="bg-purple-50 p-6 rounded-lg text-center">
                            <div className="text-3xl font-bold text-purple-600 mb-2">{results.grade}</div>
                            <div className="text-sm text-purple-800">Grade</div>
                        </div>
                    </div>

                    {/* Performance Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Details</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Correct Answers:</span>
                                    <span className="font-semibold">{results.correct}/{results.total}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Completion Rate:</span>
                                    <span className="font-semibold">{results.completionRate}%</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Average Time:</span>
                                    <span className="font-semibold">{results.averageTime}s</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Performance Level:</span>
                                    <span className="font-semibold text-green-600">{results.performance}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h3>
                            <ul className="space-y-2">
                                {results.recommendations.map((rec, index) => (
                                    <li key={index} className="text-sm text-gray-700 flex items-start">
                                        <FaCheck className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                        {rec}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Question-by-Question Breakdown */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Question Breakdown</h3>
                        <div className="space-y-3">
                            {questions.map((question, index) => {
                                const userAnswer = userAnswers[index];
                                const questionId = selectedTestType === 'numerical' ?
                                    `numerical_${question.question_id}` :
                                    question.id;
                                const breakdown = scoringSystem.getScoreBreakdown(questionId);

                                return (
                                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-medium">Question {index + 1}</span>
                                            <div className="flex items-center space-x-4">
                                                <span className={`px-2 py-1 rounded text-xs ${userAnswer?.answer === (selectedTestType === 'numerical' ?
                                                        question.correct_answer :
                                                        question.correct_answer
                                                    ) ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {userAnswer?.answer === (selectedTestType === 'numerical' ?
                                                        question.correct_answer :
                                                        question.correct_answer
                                                    ) ? <FaCheck className="w-3 h-3" /> : <FaTimes className="w-3 h-3" />}
                                                </span>
                                                <span className="font-semibold">{breakdown?.finalScore || 0} pts</span>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-2">{question.question}</p>
                                        <div className="text-xs text-gray-500">
                                            Answer: {userAnswer?.answer} | Time: {userAnswer?.timeTaken?.toFixed(1)}s
                                            {breakdown?.breakdown && (
                                                <span className="ml-4">
                                                    Base: {breakdown.breakdown.baseScore},
                                                    Difficulty: +{breakdown.breakdown.difficultyBonus},
                                                    Time: +{breakdown.breakdown.timeBonus}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="text-center">
                        <button
                            onClick={startDemo}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Try Another Test
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
            <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">🎯 Universal Scoring System Demo</h1>
                    <p className="text-gray-600 mb-6">
                        Experience how the universal scoring system works across different test types
                    </p>
                </div>

                {/* Test Type Selection */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Choose Test Type</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {Object.keys(sampleQuestions).map((type) => {
                            const color = getTestTypeColor(type);
                            const isSelected = selectedTestType === type;

                            return (
                                <button
                                    key={type}
                                    onClick={() => handleTestTypeChange(type)}
                                    className={`p-4 rounded-lg border-2 transition-all ${isSelected
                                            ? `border-${color}-500 bg-${color}-50`
                                            : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <div className="flex items-center justify-center mb-2">
                                        {getTestTypeIcon(type)}
                                    </div>
                                    <div className={`font-semibold capitalize ${isSelected ? `text-${color}-700` : 'text-gray-700'
                                        }`}>
                                        {type} Test
                                    </div>
                                    <div className={`text-sm ${isSelected ? `text-${color}-600` : 'text-gray-500'
                                        }`}>
                                        {sampleQuestions[type].length} questions
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Current Question */}
                {currentQuestionData && (
                    <div className="bg-gray-50 rounded-lg p-6 mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Question {currentQuestion + 1} of {questions.length}
                            </h3>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <FaClock className="w-4 h-4" />
                                <span>Time: {questionStartTime ? Math.floor((Date.now() - questionStartTime) / 1000) : 0}s</span>
                            </div>
                        </div>

                        <div className="mb-6">
                            <p className="text-gray-800 text-lg leading-relaxed mb-4">
                                {currentQuestionData.question}
                            </p>

                            {currentQuestionData.complexity_score && (
                                <div className="text-sm text-gray-600 mb-4">
                                    Complexity: {currentQuestionData.complexity_score}/5
                                </div>
                            )}
                        </div>

                        {/* Answer Options */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {currentQuestionData.options?.map((option) => (
                                <button
                                    key={option.option_id || option}
                                    onClick={() => handleAnswerSelect(option.option_id || option)}
                                    className="p-4 rounded-lg border-2 border-gray-200 hover:border-blue-300 bg-white transition-all text-left"
                                >
                                    <div className="flex items-center">
                                        <span className="font-semibold text-lg mr-3">
                                            {option.option_id || option}.
                                        </span>
                                        <span>{option.text || option}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Start Button */}
                {currentQuestion === 0 && !questionStartTime && (
                    <div className="text-center">
                        <button
                            onClick={startDemo}
                            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold"
                        >
                            Start {selectedTestType.charAt(0).toUpperCase() + selectedTestType.slice(1)} Test
                        </button>
                    </div>
                )}

                {/* Progress */}
                {questionStartTime && (
                    <div className="mb-6">
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                            <span>Progress</span>
                            <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UniversalScoringDemo;

