import React, { useState, useEffect, useRef } from 'react';
import backendApi from '../api/backendApi';
import { motion, AnimatePresence } from 'framer-motion';
import {
 FaCode,
 FaClock,
 FaQuestionCircle,
 FaChartBar,
 FaCheckCircle,
 FaTimes,
 FaLightbulb,
 FaArrowRight,
 FaArrowLeft,
 FaStop,
 FaFlag,
 FaSync,
 FaSearchPlus,
 FaExpand,
 FaEye,
 FaBrain,
 FaPlay
} from 'react-icons/fa';
// Removed frontend data imports - using backend API instead
import { submitTestAttempt, fetchTestQuestions } from '../lib/backendSubmissionHelper';
import TestResultsPage from './TestResultsPage';

const TechnicalTest = ({ onBackToDashboard, testId = 'technical' }) => {
 // Map frontend test ID to backend database ID based on skill
 const getBackendTestId = (frontendId) => {
 const testIdMapping = {
 // Technical tests by skill
 'python': '10',
 'javascript': '9',
 'react': '11',
 'django': '12',
 'sql': '13',
 'sqlite': '14',
 'java': '15',
 'git': '16',
 // Legacy mappings
 'technical': '9',
 'js': '9',
 'py': '10',
 'TCT1': '9',
 'TCT2': '10'
 };
 return testIdMapping[frontendId] || frontendId || '9'; // Default to JavaScript
 };

 const backendTestId = getBackendTestId(testId);

 const [testStep, setTestStep] = useState('loading');
 const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
 const [timeRemaining, setTimeRemaining] = useState(15 * 60); // 15 minutes
 const [answers, setAnswers] = useState({});
 const [questions, setQuestions] = useState([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState(null);
 const [showExitModal, setShowExitModal] = useState(false);
 const [startedAt, setStartedAt] = useState(null);
 const [results, setResults] = useState(null);

 const testContainerRef = useRef(null);

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

 // Ensure we have exactly 20 questions with proper options
 let questionsToUse = fetchedQuestions;
 if (fetchedQuestions.length > 20) {
 // Take first 20 questions
 questionsToUse = fetchedQuestions.slice(0, 20);
 } else if (fetchedQuestions.length < 20) {
 // Duplicate questions to reach 20
 const questionsNeeded = 20 - fetchedQuestions.length;
 const duplicatedQuestions = [];
 for (let i = 0; i < questionsNeeded; i++) {
 const questionIndex = i % fetchedQuestions.length;
 const originalQuestion = fetchedQuestions[questionIndex];
 let options = originalQuestion.options || ['Option A', 'Option B', 'Option C', 'Option D'];

 // Convert object format to array format
 if (typeof options === 'object' && !Array.isArray(options)) {
 options = Object.entries(options).map(([key, value]) => value);
 console.log(` Converted options for duplicated question:`, options);
 }

 const duplicatedQuestion = {
 ...originalQuestion,
 id: `duplicate_${i}_${originalQuestion.id}`,
 question_text: `${originalQuestion.question_text} (Question ${i + 1 + fetchedQuestions.length})`,
 options: options
 };
 duplicatedQuestions.push(duplicatedQuestion);
 }
 questionsToUse = [...fetchedQuestions, ...duplicatedQuestions];
 }

 // Ensure all questions have proper options and convert format
 questionsToUse = questionsToUse.map((question, index) => {
 let options = question.options || ['Option A', 'Option B', 'Option C', 'Option D'];

 // Convert object format {A: "option1", B: "option2"} to array format
 if (typeof options === 'object' && !Array.isArray(options)) {
 // Use Object.entries to maintain order and get values
 options = Object.entries(options).map(([key, value]) => value);
 console.log(` Converted options for question ${index + 1}:`, options);
 }

 return {
 ...question,
 id: question.id || `q_${index}`,
 options: options,
 question_text: question.question_text || question.question || `Question ${index + 1}`,
 difficulty_level: question.difficulty_level || 'Intermediate',
 question_type: question.question_type || 'Multiple Choice'
 };
 });

 setQuestions(questionsToUse);
 setTimeRemaining(15 * 60); // 15 minutes
 setStartedAt(new Date());
 setTestStep('test');

 } catch (err) {
 console.error('Failed to load technical test:', err);
 setError('Failed to load technical test. Please try again.');
 setTestStep('error');
 } finally {
 setLoading(false);
 }
 };

 const startTest = () => {
 setTestStep('test');
 setCurrentQuestionIndex(0);
 };

 const handleTimeUp = () => {
 handleFinishTest();
 };

 const handleAnswerSelect = (questionId, answer) => {
 setAnswers(prev => ({
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
 setTestStep('submitting');

 // Calculate time spent
 const timeSpent = startedAt ? Math.floor((Date.now() - startedAt.getTime()) / 1000) : 0;

 // Submit to backend for scoring
 const result = await submitTestAttempt({
 testId: backendTestId,
 answers: answers,
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
 setResults(data);
 setTestStep('results');
 },
 onError: (error) => {
 console.error('Test submission failed:', error);
 setError(`Submission failed: ${error.message}`);
 setTestStep('error');
 }
 });

 } catch (error) {
 console.error('Error finishing test:', error);
 setError('Failed to submit test. Please try again.');
 setTestStep('error');
 }
 };

 const formatTime = (seconds) => {
 const minutes = Math.floor(seconds / 60);
 const remainingSeconds = seconds % 60;
 return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
 };

 // Safe extractor to avoid rendering raw objects in JSX
 const extractText = (value) => {
 if (!value) return '';
 if (typeof value === 'string') return value;
 try {
 // Handle common translation/context shapes
 const translations = value.translations || value.translation || null;
 if (translations && typeof translations === 'object') {
 if (translations.en) {
 return translations.en.passage_text || translations.en.question_text || translations.en.scenario || translations.en.text || '';
 }
 if (translations.fr) {
 return translations.fr.passage_text || translations.fr.question_text || translations.fr.scenario || translations.fr.text || '';
 }
 const first = Object.values(translations).find(t => t && (t.passage_text || t.question_text || t.scenario || t.text));
 if (first) return first.passage_text || first.question_text || first.scenario || first.text || '';
 }

 if (typeof value === 'object') {
 if (value.passage_text) return value.passage_text;
 if (value.question_text) return value.question_text;
 if (value.scenario) return value.scenario;
 if (value.title) return value.title;
 }
 } catch (e) {
 // ignore parsing errors
 }
 return '';
 };

 const getProgressPercentage = () => {
 if (!questions?.length) return 0;
 return Math.round(((currentQuestionIndex + 1) / questions.length) * 100);
 };

 const getAnsweredCount = () => {
 return Object.keys(answers).length;
 };

 if (testStep === 'loading') {
 return (
 <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
 <motion.div
 initial={{ opacity: 0, scale: 0.9 }}
 animate={{ opacity: 1, scale: 1 }}
 className="text-center"
 >
 <motion.div
 animate={{ rotate: 360 }}
 transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
 className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-6"
 />
 <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading Technical Test</h2>
 <p className="text-gray-600">Preparing your assessment...</p>
 </motion.div>
 </div>
 );
 }

 if (testStep === 'error') {
 return (
 <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center p-4">
 <motion.div
 initial={{ opacity: 0, scale: 0.9 }}
 animate={{ opacity: 1, scale: 1 }}
 className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center"
 >
 <motion.div
 initial={{ scale: 0 }}
 animate={{ scale: 1 }}
 transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
 className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
 >
 <FaTimes className="text-red-500 text-2xl" />
 </motion.div>
 <h2 className="text-2xl font-bold text-gray-800 mb-2">Unable to Load Test</h2>
 <p className="text-gray-600 mb-6">{error}</p>
 <button
 onClick={loadTest}
 className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
 >
 Try Again
 </button>
 </motion.div>
 </div>
 );
 }

 if (testStep === 'test' && currentQuestionIndex === 0 && Object.keys(answers).length === 0) {
 return (
 <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
 <motion.div
 initial={{ opacity: 0, scale: 0.9 }}
 animate={{ opacity: 1, scale: 1 }}
 className="max-w-4xl w-full bg-white rounded-xl shadow-lg overflow-hidden"
 >
 {/* Header */}
 <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 text-center">
 <motion.div
 initial={{ scale: 0 }}
 animate={{ scale: 1 }}
 transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
 className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4"
 >
 <FaCode className="text-3xl" />
 </motion.div>
 <h1 className="text-3xl font-bold mb-2">Technical Assessment</h1>
 <p className="text-blue-100">Test your technical knowledge and skills</p>
 </div>

 {/* Test Info */}
 <div className="p-8">
 <div className="grid md:grid-cols-3 gap-6 mb-8">
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.3 }}
 className="text-center p-6 bg-blue-50 rounded-lg"
 >
 <FaQuestionCircle className="text-3xl text-blue-600 mx-auto mb-3" />
 <h3 className="font-semibold text-gray-800 mb-1">Questions</h3>
 <p className="text-3xl font-bold text-blue-600">{questions.length}</p>
 </motion.div>
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.4 }}
 className="text-center p-6 bg-green-50 rounded-lg"
 >
 <FaClock className="text-3xl text-green-600 mx-auto mb-3" />
 <h3 className="font-semibold text-gray-800 mb-1">Time Limit</h3>
 <p className="text-3xl font-bold text-green-600">15 min</p>
 </motion.div>
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.5 }}
 className="text-center p-6 bg-purple-50 rounded-lg"
 >
 <FaChartBar className="text-3xl text-purple-600 mx-auto mb-3" />
 <h3 className="font-semibold text-gray-800 mb-1">Type</h3>
 <p className="text-3xl font-bold text-purple-600">Technical</p>
 </motion.div>
 </div>

 <motion.button
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.6 }}
 onClick={startTest}
 className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-semibold text-lg flex items-center justify-center gap-3"
 >
 <FaPlay className="text-xl" />
 Start Assessment
 </motion.button>
 </div>
 </motion.div>
 </div>
 );
 }

 if (testStep === 'results') {
 return (
 <TestResultsPage
 results={results}
 testType="technical"
 testId={testId}
 answers={answers}
 testData={{ questions }}
 onBackToDashboard={onBackToDashboard}
 />
 );
 }

 const currentQuestion = questions && Array.isArray(questions) && questions.length > 0 ? questions[currentQuestionIndex] : null;
 const userAnswer = currentQuestion ? answers[currentQuestion.id] : null;

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
 {Object.keys(answers).length}/{questions.length} answered
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
 <strong>Context:</strong> {extractText(currentQuestion.context) || extractText(currentQuestion.scenario)}
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
 className={`w-full text-left p-4 border-2 rounded-lg transition-colors ${isSelected
 ? 'border-blue-500 bg-blue-50'
 : 'border-gray-200 hover:border-gray-300'
 }`}
 >
 <div className="flex items-start gap-3">
 <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-medium ${isSelected
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
