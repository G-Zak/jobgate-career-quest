import React, { useState, useEffect } from 'react';
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
import { generateTechnicalTest, groupQuestionsBySkill, calculateSkillCoverage } from '../data/technicalTestSections';

const TechnicalTest = ({ userId = 'user123', onTestComplete }) => {
    const [testData, setTestData] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState({});
    const [testStarted, setTestStarted] = useState(false);
    const [testCompleted, setTestCompleted] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [skillCoverage, setSkillCoverage] = useState([]);

    useEffect(() => {
        loadTest();
    }, [userId]);

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
            const test = await generateTechnicalTest(userId);
            setTestData(test);
            
            if (test.sections && test.sections[0]?.questions?.length > 0) {
                setTimeRemaining(test.duration_minutes * 60);
                const coverage = calculateSkillCoverage(test.user_skills || [], test.sections[0].questions);
                setSkillCoverage(coverage);
            } else if (test.user_skills && test.user_skills.length === 0) {
                setError("Please add your technical skills first to generate a personalized test.");
            } else if (test.error) {
                setError(test.error);
            } else {
                setError("No technical questions available for your skills yet.");
            }
        } catch (err) {
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
        setTestCompleted(true);
        calculateResults();
    };

    const handleAnswerSelect = (questionId, answer) => {
        setUserAnswers(prev => ({
            ...prev,
            [questionId]: answer
        }));
    };

    const goToNextQuestion = () => {
        if (currentQuestionIndex < testData.sections[0].questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setShowExplanation(false);
        }
    };

    const goToPreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
            setShowExplanation(false);
        }
    };

    const completeTest = () => {
        setTestCompleted(true);
        calculateResults();
    };

    const calculateResults = () => {
        const questions = testData.sections[0].questions;
        let correctAnswers = 0;
        const skillResults = {};
        
        questions.forEach(question => {
            const userAnswer = userAnswers[question.id];
            const isCorrect = userAnswer === question.correct_answer;
            
            if (isCorrect) correctAnswers++;
            
            // Track skill-specific results
            if (!skillResults[question.skill_name]) {
                skillResults[question.skill_name] = {
                    total: 0,
                    correct: 0,
                    category: question.skill_category
                };
            }
            skillResults[question.skill_name].total++;
            if (isCorrect) skillResults[question.skill_name].correct++;
        });

        const results = {
            totalQuestions: questions.length,
            correctAnswers,
            score: Math.round((correctAnswers / questions.length) * 100),
            skillResults,
            timeSpent: (testData.duration_minutes * 60) - timeRemaining,
            completedAt: new Date().toISOString()
        };

        onTestComplete?.(results);
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const getProgressPercentage = () => {
        if (!testData?.sections?.[0]?.questions?.length) return 0;
        return Math.round(((currentQuestionIndex + 1) / testData.sections[0].questions.length) * 100);
    };

    const getAnsweredCount = () => {
        return Object.keys(userAnswers).length;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your personalized technical test...</p>
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
            <TestIntroScreen 
                testData={testData}
                skillCoverage={skillCoverage}
                onStartTest={startTest}
            />
        );
    }

    if (testCompleted) {
        return (
            <TestResultsScreen 
                testData={testData}
                userAnswers={userAnswers}
                onRetry={() => {
                    setTestStarted(false);
                    setTestCompleted(false);
                    setCurrentQuestionIndex(0);
                    setUserAnswers({});
                    setTimeRemaining(testData.duration_minutes * 60);
                }}
            />
        );
    }

    const currentQuestion = testData.sections[0].questions[currentQuestionIndex];
    const userAnswer = userAnswers[currentQuestion.id];

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <FaCode className="text-blue-600 text-xl" />
                        <div>
                            <h1 className="text-xl font-bold">Technical Assessment</h1>
                            <p className="text-gray-600">Question {currentQuestionIndex + 1} of {testData.sections[0].questions.length}</p>
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
                            {getAnsweredCount()}/{testData.sections[0].questions.length} answered
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
                            {currentQuestion.skill_name}
                        </span>
                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                            {currentQuestion.skill_category}
                        </span>
                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                            Level {currentQuestion.difficulty_level}
                        </span>
                    </div>
                    <h2 className="text-lg font-semibold mb-4">
                        {currentQuestion.question}
                    </h2>
                </div>

                {/* Options */}
                <div className="space-y-3">
                    {currentQuestion.options.map(option => (
                        <button
                            key={option}
                            onClick={() => handleAnswerSelect(currentQuestion.id, option.toLowerCase())}
                            className={`w-full text-left p-4 border-2 rounded-lg transition-colors ${
                                userAnswer === option.toLowerCase()
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300'
                            }`}
                        >
                            <div className="flex items-start gap-3">
                                <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-medium ${
                                    userAnswer === option.toLowerCase()
                                        ? 'bg-blue-500 text-white border-blue-500'
                                        : 'border-gray-300'
                                }`}>
                                    {option}
                                </span>
                                <span>{currentQuestion.option_texts[option]}</span>
                            </div>
                        </button>
                    ))}
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
                        Question {currentQuestionIndex + 1} of {testData.sections[0].questions.length}
                    </p>
                </div>

                {currentQuestionIndex === testData.sections[0].questions.length - 1 ? (
                    <button
                        onClick={completeTest}
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

const TestIntroScreen = ({ testData, skillCoverage, onStartTest }) => {
    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-md p-8">
                <div className="text-center mb-8">
                    <FaCode className="text-6xl text-blue-600 mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        {testData.title}
                    </h1>
                    <p className="text-gray-600 text-lg">
                        {testData.description}
                    </p>
                </div>

                {/* Test Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <FaQuestionCircle className="text-blue-600 text-2xl mx-auto mb-2" />
                        <div className="text-2xl font-bold text-blue-800">{testData.total_questions}</div>
                        <div className="text-blue-600">Questions</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                        <FaClock className="text-green-600 text-2xl mx-auto mb-2" />
                        <div className="text-2xl font-bold text-green-800">{testData.duration_minutes}</div>
                        <div className="text-green-600">Minutes</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <FaChartBar className="text-purple-600 text-2xl mx-auto mb-2" />
                        <div className="text-2xl font-bold text-purple-800">{skillCoverage.length}</div>
                        <div className="text-purple-600">Skills</div>
                    </div>
                </div>

                {/* Skills Coverage */}
                <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-4">Skills Being Assessed</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {skillCoverage.map(skill => (
                            <div key={skill.id} className="flex items-center justify-between p-4 border rounded-lg">
                                <div>
                                    <div className="font-medium">{skill.name}</div>
                                    <div className="text-sm text-gray-600">{skill.category}</div>
                                </div>
                                <div className="text-right">
                                    {skill.hasQuestions ? (
                                        <div>
                                            <FaCheckCircle className="text-green-500 inline mr-1" />
                                            <span className="text-sm">{skill.questionCount} questions</span>
                                        </div>
                                    ) : (
                                        <div>
                                            <FaTimes className="text-red-500 inline mr-1" />
                                            <span className="text-sm text-red-600">No questions</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Instructions */}
                <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-4">Instructions</h3>
                    <div className="space-y-3 text-gray-700">
                        {testData.sections[0].intro_text.instructions.map((instruction, index) => (
                            <p key={index}>{instruction}</p>
                        ))}
                    </div>
                </div>

                {/* Start Button */}
                <div className="text-center">
                    <button
                        onClick={onStartTest}
                        disabled={testData.total_questions === 0}
                        className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {testData.total_questions === 0 ? 'No Questions Available' : 'Start Test'}
                    </button>
                    {testData.total_questions === 0 && (
                        <p className="text-red-600 mt-2">Please add more technical skills to generate questions.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

const TestResultsScreen = ({ testData, userAnswers, onRetry }) => {
    const questions = testData.sections[0].questions;
    const totalQuestions = questions.length;
    const correctAnswers = questions.filter(q => userAnswers[q.id] === q.correct_answer).length;
    const score = Math.round((correctAnswers / totalQuestions) * 100);

    // Calculate skill-specific results
    const skillResults = questions.reduce((acc, question) => {
        const skillName = question.skill_name;
        if (!acc[skillName]) {
            acc[skillName] = {
                name: skillName,
                category: question.skill_category,
                total: 0,
                correct: 0
            };
        }
        acc[skillName].total++;
        if (userAnswers[question.id] === question.correct_answer) {
            acc[skillName].correct++;
        }
        return acc;
    }, {});

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-green-600';
        if (score >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getScoreBg = (score) => {
        if (score >= 80) return 'bg-green-50 border-green-200';
        if (score >= 60) return 'bg-yellow-50 border-yellow-200';
        return 'bg-red-50 border-red-200';
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-md p-8">
                <div className="text-center mb-8">
                    <FaCheckCircle className="text-6xl text-green-600 mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Test Completed!
                    </h1>
                    <p className="text-gray-600">
                        Here are your technical assessment results
                    </p>
                </div>

                {/* Overall Score */}
                <div className={`p-6 rounded-lg border-2 mb-8 ${getScoreBg(score)}`}>
                    <div className="text-center">
                        <div className={`text-4xl font-bold ${getScoreColor(score)}`}>
                            {score}%
                        </div>
                        <div className="text-gray-600 mt-2">
                            {correctAnswers} out of {totalQuestions} questions correct
                        </div>
                    </div>
                </div>

                {/* Skill Breakdown */}
                <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-4">Performance by Skill</h3>
                    <div className="space-y-4">
                        {Object.values(skillResults).map(skill => {
                            const skillScore = Math.round((skill.correct / skill.total) * 100);
                            return (
                                <div key={skill.name} className="border rounded-lg p-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <div>
                                            <div className="font-medium">{skill.name}</div>
                                            <div className="text-sm text-gray-600">{skill.category}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className={`text-lg font-bold ${getScoreColor(skillScore)}`}>
                                                {skillScore}%
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                {skill.correct}/{skill.total}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                            className={`h-2 rounded-full ${
                                                skillScore >= 80 ? 'bg-green-500' :
                                                skillScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                            }`}
                                            style={{ width: `${skillScore}%` }}
                                        ></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 justify-center">
                    <button
                        onClick={onRetry}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                    >
                        Retake Test
                    </button>
                    <button
                        onClick={() => window.location.href = '/dashboard'}
                        className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TechnicalTest;
