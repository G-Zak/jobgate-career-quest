import React, { useState, useEffect } from 'react';
import {
    TrophyIcon,
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon,
    StarIcon,
    ArrowLeftIcon,
    AcademicCapIcon,
    EyeIcon,
    ArrowPathIcon
} from '@heroicons/react/24/outline';
import {
    CheckCircleIcon as CheckCircleSolidIcon,
    XCircleIcon as XCircleSolidIcon,
    StarIcon as StarSolidIcon,
    TrophyIcon as TrophySolidIcon
} from '@heroicons/react/24/solid';
import { getTestResults, getUserTestStats, getLatestTestResult } from '../../../utils/testScoring';
import { getAllTechnicalTests } from '../../../data/mockTechnicalTests';

const TestScoresPage = ({ userId = 1, onBack }) => {
    const [testResults, setTestResults] = useState([]);
    const [stats, setStats] = useState(null);
    const [allTests, setAllTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTest, setSelectedTest] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [sortBy, setSortBy] = useState('recent'); // recent, score, test
    const [filterBy, setFilterBy] = useState('all'); // all, passed, failed

    useEffect(() => {
        loadTestData();
    }, [userId]);

    const loadTestData = () => {
        try {
            setLoading(true);

            // Load test results
            const results = getTestResults(userId);
            setTestResults(results);

            // Load user statistics
            const userStats = getUserTestStats(userId);
            setStats(userStats);

            // Load all available tests for reference
            const tests = getAllTechnicalTests();
            setAllTests(tests);

        } catch (error) {
            console.error('Error loading test data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getTestInfo = (testId) => {
        return allTests.find(test => test.id === testId) || {
            test_name: 'Unknown Test',
            skill: { name: 'Unknown' },
            difficulty: 'Unknown'
        };
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const getScoreColor = (percentage) => {
        if (percentage >= 90) return 'text-green-600';
        if (percentage >= 80) return 'text-blue-600';
        if (percentage >= 70) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getScoreBadgeColor = (percentage) => {
        if (percentage >= 90) return 'bg-green-100 text-green-800 border-green-200';
        if (percentage >= 80) return 'bg-blue-100 text-blue-800 border-blue-200';
        if (percentage >= 70) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        return 'bg-red-100 text-red-800 border-red-200';
    };

    const getDifficultyColor = (difficulty) => {
        switch (difficulty.toLowerCase()) {
            case 'beginner': return 'bg-green-100 text-green-800';
            case 'intermediate': return 'bg-yellow-100 text-yellow-800';
            case 'advanced': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const sortedAndFilteredResults = () => {
        let filtered = testResults;

        // Filter by pass/fail
        if (filterBy === 'passed') {
            filtered = filtered.filter(result => result.result.passed);
        } else if (filterBy === 'failed') {
            filtered = filtered.filter(result => !result.result.passed);
        }

        // Sort results
        return filtered.sort((a, b) => {
            switch (sortBy) {
                case 'score':
                    return b.result.score - a.result.score;
                case 'test':
                    const testA = getTestInfo(a.testId);
                    const testB = getTestInfo(b.testId);
                    return testA.test_name.localeCompare(testB.test_name);
                case 'recent':
                default:
                    return b.timestamp - a.timestamp;
            }
        });
    };

    const handleViewDetails = (result) => {
        setSelectedTest(result);
        setShowDetails(true);
    };

    const handleRetakeTest = (testId) => {
        // This would trigger the test runner
        // For now, we'll just show an alert
        alert(`Retaking test ${testId} - This would start the test runner`);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-slate-600 dark:text-slate-400">Loading test scores...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            {/* Header */}
            <div className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <button
                                onClick={onBack}
                                className="flex items-center text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mr-4"
                            >
                                <ArrowLeftIcon className="w-5 h-5 mr-2" />
                                Back to Tests
                            </button>
                            <div className="flex items-center">
                                <TrophyIcon className="w-8 h-8 text-yellow-500 mr-3" />
                                <div>
                                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                                        Test Scores
                                    </h1>
                                    <p className="text-slate-600 dark:text-slate-400">
                                        Your test results and progress
                                    </p>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={loadTestData}
                            className="flex items-center px-3 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                        >
                            <ArrowPathIcon className="w-4 h-4 mr-2" />
                            Refresh
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Statistics Overview */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                            <div className="flex items-center">
                                <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                                    <AcademicCapIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Tests</p>
                                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.totalTests}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                            <div className="flex items-center">
                                <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                                    <CheckCircleSolidIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Passed</p>
                                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.passedTests}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                            <div className="flex items-center">
                                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                                    <StarSolidIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Average Score</p>
                                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.averageScore}%</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                            <div className="flex items-center">
                                <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                                    <ClockIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Time</p>
                                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                        {formatTime(stats.totalTimeSpent)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Filters and Sorting */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-8">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Filter by Status
                            </label>
                            <select
                                value={filterBy}
                                onChange={(e) => setFilterBy(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="all">All Tests</option>
                                <option value="passed">Passed Only</option>
                                <option value="failed">Failed Only</option>
                            </select>
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Sort by
                            </label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="recent">Most Recent</option>
                                <option value="score">Highest Score</option>
                                <option value="test">Test Name</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Test Results List */}
                {testResults.length === 0 ? (
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-12 text-center">
                        <TrophyIcon className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                            No Test Results Yet
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-6">
                            Complete some tests to see your scores and progress here.
                        </p>
                        <button
                            onClick={onBack}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <AcademicCapIcon className="w-4 h-4 mr-2" />
                            Start Taking Tests
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {sortedAndFilteredResults().map((result) => {
                            const testInfo = getTestInfo(result.testId);
                            return (
                                <div
                                    key={result.id}
                                    className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center mb-2">
                                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mr-3">
                                                    {testInfo.test_name}
                                                </h3>
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(testInfo.difficulty)}`}>
                                                    {testInfo.difficulty}
                                                </span>
                                            </div>
                                            <p className="text-slate-600 dark:text-slate-400 mb-3">
                                                {testInfo.skill.name} • {formatDate(result.completedAt)}
                                            </p>
                                            <div className="flex items-center space-x-4">
                                                <div className="flex items-center">
                                                    <span className={`text-2xl font-bold ${getScoreColor(result.result.percentage)}`}>
                                                        {result.result.percentage}%
                                                    </span>
                                                    <span className="ml-2 text-slate-600 dark:text-slate-400">
                                                        ({result.result.correctAnswers}/{result.result.totalQuestions})
                                                    </span>
                                                </div>
                                                <div className="flex items-center">
                                                    {result.result.passed ? (
                                                        <CheckCircleSolidIcon className="w-5 h-5 text-green-500 mr-1" />
                                                    ) : (
                                                        <XCircleSolidIcon className="w-5 h-5 text-red-500 mr-1" />
                                                    )}
                                                    <span className={`text-sm font-medium ${result.result.passed ? 'text-green-600' : 'text-red-600'}`}>
                                                        {result.result.passed ? 'Passed' : 'Failed'}
                                                    </span>
                                                </div>
                                                {result.timeSpent && (
                                                    <div className="flex items-center text-slate-600 dark:text-slate-400">
                                                        <ClockIcon className="w-4 h-4 mr-1" />
                                                        <span className="text-sm">{formatTime(result.timeSpent)}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2 ml-4">
                                            <button
                                                onClick={() => handleViewDetails(result)}
                                                className="flex items-center px-3 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                                            >
                                                <EyeIcon className="w-4 h-4 mr-1" />
                                                Details
                                            </button>
                                            <button
                                                onClick={() => handleRetakeTest(result.testId)}
                                                className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                            >
                                                <ArrowPathIcon className="w-4 h-4 mr-1" />
                                                Retake
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Test Details Modal */}
                {showDetails && selectedTest && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                                        Test Details
                                    </h2>
                                    <button
                                        onClick={() => setShowDetails(false)}
                                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                    >
                                        <XCircleIcon className="w-6 h-6" />
                                    </button>
                                </div>

                                {(() => {
                                    const testInfo = getTestInfo(selectedTest.testId);
                                    return (
                                        <div className="space-y-6">
                                            <div>
                                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                                                    {testInfo.test_name}
                                                </h3>
                                                <p className="text-slate-600 dark:text-slate-400">
                                                    {testInfo.skill.name} • {testInfo.difficulty}
                                                </p>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                                                    <p className="text-sm text-slate-600 dark:text-slate-400">Score</p>
                                                    <p className={`text-2xl font-bold ${getScoreColor(selectedTest.result.percentage)}`}>
                                                        {selectedTest.result.percentage}%
                                                    </p>
                                                </div>
                                                <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                                                    <p className="text-sm text-slate-600 dark:text-slate-400">Status</p>
                                                    <div className="flex items-center">
                                                        {selectedTest.result.passed ? (
                                                            <CheckCircleSolidIcon className="w-5 h-5 text-green-500 mr-2" />
                                                        ) : (
                                                            <XCircleSolidIcon className="w-5 h-5 text-red-500 mr-2" />
                                                        )}
                                                        <span className={`font-semibold ${selectedTest.result.passed ? 'text-green-600' : 'text-red-600'}`}>
                                                            {selectedTest.result.passed ? 'Passed' : 'Failed'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                                                    <p className="text-sm text-slate-600 dark:text-slate-400">Correct Answers</p>
                                                    <p className="text-xl font-semibold text-slate-900 dark:text-white">
                                                        {selectedTest.result.correctAnswers}/{selectedTest.result.totalQuestions}
                                                    </p>
                                                </div>
                                                <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                                                    <p className="text-sm text-slate-600 dark:text-slate-400">Time Spent</p>
                                                    <p className="text-xl font-semibold text-slate-900 dark:text-white">
                                                        {selectedTest.timeSpent ? formatTime(selectedTest.timeSpent) : 'N/A'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Completed At</p>
                                                <p className="text-slate-900 dark:text-white">
                                                    {formatDate(selectedTest.completedAt)}
                                                </p>
                                            </div>

                                            <div className="flex justify-end space-x-3">
                                                <button
                                                    onClick={() => setShowDetails(false)}
                                                    className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                                                >
                                                    Close
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setShowDetails(false);
                                                        handleRetakeTest(selectedTest.testId);
                                                    }}
                                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                                >
                                                    Retake Test
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TestScoresPage;
