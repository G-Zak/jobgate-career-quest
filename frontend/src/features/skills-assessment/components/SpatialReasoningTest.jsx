import React, { useState, useEffect, useRef } from 'react';
import backendApi from '../api/backendApi';
import { motion, AnimatePresence } from 'framer-motion';
import { FaClock, FaCube, FaStop, FaArrowRight, FaFlag, FaSync, FaSearchPlus, FaExpand, FaEye, FaImage, FaLayerGroup, FaPlay, FaTimes, FaCheckCircle } from 'react-icons/fa';
// Removed frontend data imports - using backend API instead
import { submitTestAttempt } from '../lib/backendSubmissionHelper';
import TestDataService from '../services/testDataService';
import TestResultsPage from './TestResultsPage';

const SpatialReasoningTest = ({ onBackToDashboard, testId = 'spatial' }) => {
 // Map frontend test ID to backend database ID
 const getBackendTestId = (frontendId) => {
 const testIdMapping = {
 'spatial': '15', // Default to Shape Assembly (legacy)
 'spatial_shape': '15',
 'spatial_rotation': '16',
 'spatial_visualization': '17',
 'spatial_identification': '18',
 'spatial_pattern': '19',
 'spatial_relations': '20',
 'SR1': '16',
 'SR2': '17',
 'SR3': '18',
 'SR4': '19',
 'SR5': '20',
 'SR6': '21',
 // SRT pools (shifted so SRT1 points to backend test set that contains spatial images)
 'SRT1': '16',
 'SRT2': '17',
 'SRT3': '18',
 'SRT4': '19',
 'SRT5': '20',
 'SRT6': '21'
 };
 return testIdMapping[frontendId] || frontendId || '15'; // Default to Shape Assembly
 };

 const backendTestId = getBackendTestId(testId);

 const [testStep, setTestStep] = useState('loading');
 const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
 const [timeRemaining, setTimeRemaining] = useState(20 * 60); // 20 minutes default
 const [answers, setAnswers] = useState({});
 const [questions, setQuestions] = useState([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState(null);
 const [showExitModal, setShowExitModal] = useState(false);
 const [startedAt, setStartedAt] = useState(null);
 const [results, setResults] = useState(null);

 const testContainerRef = useRef(null);

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
 if (testStep === 'test' && currentQuestionIndex > 0) {
 // Small delay to ensure DOM has updated after question change
 const timer = setTimeout(() => {
 scrollToTop();
 }, 100);

 return () => clearTimeout(timer);
 }
 }, [currentQuestionIndex, testStep]);

 // Initialize test with backend API
 useEffect(() => {
 const initializeTest = async () => {
 try {
 setLoading(true);
 setError(null);

 // Fetch test questions from backend and transform them for frontend
 // Use TestDataService.fetchTestQuestions which returns a frontend-friendly
 // object including `questions` (with parsed translations and main_image)
 const fetched = await TestDataService.fetchTestQuestions(testId);
 const fetchedQuestions = (fetched && fetched.questions) ? fetched.questions : fetched;
 setQuestions(fetchedQuestions || []);

 setTimeRemaining(20 * 60); // 20 minutes default
 setStartedAt(new Date());
 setTestStep('test');

 } catch (error) {
 console.error('Failed to initialize test:', error);
 setError('Failed to load test questions. Please try again.');
 setTestStep('error');
 } finally {
 setLoading(false);
 }
 };

 initializeTest();
 }, [backendTestId]);

 // Timer effect
 useEffect(() => {
 if (testStep === 'test' && timeRemaining > 0) {
 const timer = setInterval(() => {
 setTimeRemaining(prev => {
 if (prev <= 1) {
 handleFinishTest();
 return 0;
 }
 return prev - 1;
 });
 }, 1000);

 return () => clearInterval(timer);
 }
 }, [testStep, timeRemaining]);

 const formatTime = (seconds) => {
 const minutes = Math.floor(seconds / 60);
 const remainingSeconds = seconds % 60;
 return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
 };

 const handleAnswerSelect = (questionId, answer) => {
 setAnswers(prev => ({
 ...prev,
 [questionId]: answer
 }));
 };

 const handleNextQuestion = () => {
 const totalQuestions = questions.length;

 if (currentQuestionIndex + 1 >= totalQuestions) {
 handleFinishTest();
 } else {
 setCurrentQuestionIndex(prev => prev + 1);
 }

 // Smooth scroll to top after navigation
 setTimeout(() => scrollToTop(), 150);
 };

 const handlePreviousQuestion = () => {
 if (currentQuestionIndex > 0) {
 setCurrentQuestionIndex(prev => prev - 1);
 }

 // Smooth scroll to top after navigation
 setTimeout(() => scrollToTop(), 150);
 };

 const handleFinishTest = async () => {
 try {
 // Submit to backend for scoring
 const result = await submitTestAttempt({
 testId: backendTestId,
 answers,
 startedAt: startedAt,
 finishedAt: Date.now(),
 reason: 'user',
 metadata: {
 testType: 'spatial_reasoning',
 totalQuestions: questions.length,
 currentQuestion: currentQuestionIndex + 1
 },
 onSuccess: (data) => {
 console.log('Test submitted successfully:', data);
 setResults(data.score);
 setTestStep('results');
 scrollToTop();
 },
 onError: (error) => {
 console.error('Test submission failed:', error);

 // Handle duplicate submission specially
 if (error.message === 'DUPLICATE_SUBMISSION' && error.existingSubmission) {
 console.log('Handling duplicate submission:', error.existingSubmission);

 // Use existing submission data instead of showing error
 const existingScore = parseFloat(error.existingSubmission.score) || 0;
 const existingResults = {
 id: error.existingSubmission.submissionId,
 raw_score: existingScore.toFixed(2),
 max_possible_score: "100.00",
 percentage_score: existingScore.toFixed(2),
 correct_answers: Math.round((existingScore / 100) * questions.length),
 total_questions: questions.length,
 grade_letter: existingScore >= 90 ? 'A' : existingScore >= 80 ? 'B' : existingScore >= 70 ? 'C' : existingScore >= 60 ? 'D' : 'F',
 passed: existingScore >= 70,
 test_title: "Spatial Reasoning Test",
 test_type: "spatial_reasoning",
 isDuplicateSubmission: true,
 existingSubmissionMessage: error.existingSubmission.message
 };

 setResults(existingResults);
 setTestStep('results');
 scrollToTop();
 return;
 }

 setError(`Submission failed: ${error.message}`);
 }
 });

 } catch (error) {
 console.error('Error finishing test:', error);

 // Handle duplicate submission at the catch level too
 if (error.message === 'DUPLICATE_SUBMISSION' && error.existingSubmission) {
 console.log('Handling duplicate submission in catch:', error.existingSubmission);

 // Use existing submission data instead of showing error
 const existingScore = parseFloat(error.existingSubmission.score) || 0;
 const existingResults = {
 id: error.existingSubmission.submissionId,
 raw_score: existingScore.toFixed(2),
 max_possible_score: "100.00",
 percentage_score: existingScore.toFixed(2),
 correct_answers: Math.round((existingScore / 100) * questions.length),
 total_questions: questions.length,
 grade_letter: existingScore >= 90 ? 'A' : existingScore >= 80 ? 'B' : existingScore >= 70 ? 'C' : existingScore >= 60 ? 'D' : 'F',
 passed: existingScore >= 70,
 test_title: "Spatial Reasoning Test",
 test_type: "spatial_reasoning",
 isDuplicateSubmission: true,
 existingSubmissionMessage: error.existingSubmission.message
 };

 setResults(existingResults);
 setTestStep('results');
 scrollToTop();
 return;
 }

 setError('Failed to submit test. Please try again.');
 }
 };

 const handleExitTest = () => {
 setShowExitModal(true);
 };

 const handleConfirmExit = () => {
 onBackToDashboard();
 };

 const getCurrentQuestion = () => {
 if (!questions || !Array.isArray(questions) || questions.length === 0) return null;
 return questions[currentQuestionIndex] || null;
 };

 // Build a safe, displayable context string from various possible fields
 const getContextText = (question) => {
 if (!question) return '';

 // If passage_text (produced by transformer) is available, prefer it
 if (question.passage_text && typeof question.passage_text === 'string') return question.passage_text;

 // If explanation or question_text fallback exists, prefer short explanation
 if (question.explanation && typeof question.explanation === 'string') return question.explanation;

 // If scenario or context is a string, use it
 if (question.scenario && typeof question.scenario === 'string') return question.scenario;
 if (question.context && typeof question.context === 'string') return question.context;

 // If scenario is an object with translations, try to extract readable fields
 const scenario = question.scenario || {};
 const translations = scenario.translations || scenario.translation || null;
 if (translations && typeof translations === 'object') {
 if (translations.en && translations.en.passage_text) return translations.en.passage_text;
 if (translations.en && translations.en.question_text) return translations.en.question_text;
 if (translations.fr && translations.fr.passage_text) return translations.fr.passage_text;
 if (translations.fr && translations.fr.question_text) return translations.fr.question_text;
 const first = Object.values(translations).find(t => t && (t.passage_text || t.question_text));
 if (first) return first.passage_text || first.question_text;
 }

 // Last resort: empty string (don't render object directly)
 return '';
 };

 const getTotalAnswered = () => {
 return Object.keys(answers).length;
 };

 if (loading) {
 return (
 <div className="min-h-screen bg-gray-50 flex items-center justify-center">
 <motion.div
 initial={{ opacity: 0, scale: 0.9 }}
 animate={{ opacity: 1, scale: 1 }}
 className="text-center"
 >
 <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
 <FaCube className="w-8 h-8 text-blue-600 animate-pulse" />
 </div>
 <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading Test</h2>
 <p className="text-gray-600">Preparing your spatial reasoning assessment...</p>
 </motion.div>
 </div>
 );
 }

 if (!questions.length) {
 return (
 <div className="min-h-screen bg-gray-50 flex items-center justify-center">
 <motion.div
 initial={{ opacity: 0, scale: 0.9 }}
 animate={{ opacity: 1, scale: 1 }}
 className="text-center max-w-md"
 >
 <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
 <FaTimes className="w-12 h-12 text-red-600" />
 </div>
 <h2 className="text-2xl font-bold text-gray-800 mb-4">Test Unavailable</h2>
 <p className="text-gray-600 mb-8">Unable to load the test data. Please try again later.</p>
 <button
 onClick={onBackToDashboard}
 className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors font-medium"
 >
 Back to Dashboard
 </button>
 </motion.div>
 </div>
 );
 }

 // Show results page
 if (testStep === 'results') {
 return (
 <TestResultsPage
 results={results}
 testType="spatial"
 testId={testId}
 answers={answers}
 testData={{ questions }}
 onBackToDashboard={onBackToDashboard}
 />
 );
 }

 const currentQuestion = getCurrentQuestion();
 const isLastQuestion = questions && Array.isArray(questions) ? currentQuestionIndex + 1 >= questions.length : false;
 const isAnswered = currentQuestion ? answers[currentQuestion.id] != null : false;

 return (
 <div className="bg-gray-50" ref={testContainerRef}>
 {/* Header */}
 <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
 <div className="max-w-4xl mx-auto px-6 py-4">
 <div className="flex items-center justify-between">
 <button
 onClick={handleExitTest}
 className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
 >
 <FaTimes className="w-4 h-4" />
 <span className="font-medium">Exit Test</span>
 </button>

 <div className="text-center">
 <div className="text-xl font-bold text-gray-800">
 Spatial Reasoning Test
 </div>
 <div className="text-sm text-gray-600">
 Question {currentQuestionIndex + 1} of {questions.length}
 </div>
 </div>

 <div className="flex items-center gap-4">
 <div className="text-right">
 <div className="text-sm text-gray-500">Time Remaining</div>
 <div className={`text-lg font-bold font-mono ${timeRemaining <= 60 ? 'text-red-500' : 'text-blue-600'}`}>
 {formatTime(timeRemaining)}
 </div>
 </div>
 </div>
 </div>
 </div>
 </header>

 {/* Main Content */}
 <div className="max-w-4xl mx-auto px-6 py-8">
 <div className="bg-white rounded-xl shadow-lg p-8">
 {/* Question Header */}
 <div className="flex items-center justify-between mb-8">
 <div className="flex items-center gap-3">
 <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl text-white">
 <FaCube className="w-5 h-5" />
 </div>
 <div>
 <h3 className="text-xl font-bold text-gray-800">
 Question {currentQuestionIndex + 1}
 </h3>
 <p className="text-gray-600">
 Spatial Reasoning Assessment
 </p>
 </div>
 </div>
 <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
 {currentQuestionIndex + 1} of {questions.length}
 </div>
 </div>

 {/* Question Content */}
 <div className="mb-8">
 {/* Question Image */}
 {currentQuestion?.main_image && (
 <div className="mb-6">
 <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
 <div className="flex justify-center">
 <img
 src={(() => {
 const img = currentQuestion.main_image || '';
 // If backend provides '/assets/...' convert to '/src/assets/...' which matches frontend static assets
 if (img.startsWith('/assets')) return `/src${img}`;
 if (img.startsWith('/src/assets')) return img;
 // Fallback to using filename in section_1 (legacy behavior)
 const fileName = img.split('/').pop();
 return fileName ? `/src/assets/images/spatial/questions/section_1/${fileName}` : '';
 })()}
 alt={`Question ${currentQuestionIndex + 1}`}
 className="max-w-xl max-h-[28rem] w-auto h-auto rounded-lg shadow-sm object-contain"
 style={{ maxWidth: '528px', maxHeight: '422px' }}
 onError={(e) => {
 e.target.style.display = 'none';
 }}
 />
 </div>
 </div>
 </div>
 )}

 {/* Question Text */}
 <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
 <h4 className="text-lg font-medium text-gray-800 leading-relaxed">
 {currentQuestion?.question_text || currentQuestion?.question}
 </h4>
 {getContextText(currentQuestion) && (
 <p className="text-gray-600 mt-2 text-sm">
 {getContextText(currentQuestion)}
 </p>
 )}
 </div>

 {/* Answer Options */}
 <div className="flex justify-center gap-4 w-full">
 {currentQuestion?.options?.map((option, index) => {
 // Handle both string and object options
 const optionValue = typeof option === 'string' ? option : option.value || option.option_id || option.text;
 const letters = ['A', 'B', 'C', 'D', 'E'];
 const optionLetter = letters[index] || String.fromCharCode(65 + index);
 const isSelected = answers[currentQuestion.id] === optionLetter;
 const optionsCount = currentQuestion?.options?.length || 0;

 // Calculate width based on number of options
 const buttonWidth = optionsCount <= 3 ? 'w-20' : optionsCount === 4 ? 'w-16' : optionsCount === 5 ? 'w-14' : 'w-12';

 return (
 <motion.button
 key={index}
 whileHover={{ scale: 1.02 }}
 whileTap={{ scale: 0.98 }}
 onClick={() => handleAnswerSelect(currentQuestion.id, optionLetter)}
 className={`${buttonWidth} h-16 rounded-lg border-2 transition-all duration-200 flex items-center justify-center ${
 isSelected
 ? 'border-blue-500 bg-blue-500 text-white shadow-lg'
 : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50 hover:shadow-md'
 }`}
 >
 <span className="text-2xl font-bold">
 {optionLetter}
 </span>
 </motion.button>
 );
 })}
 </div>
 </div>

 {/* Navigation */}
 <div className="flex items-center justify-between pt-6 border-t border-gray-200">
 <button
 onClick={handlePreviousQuestion}
 disabled={currentQuestionIndex === 0}
 className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
 currentQuestionIndex === 0
 ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
 : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
 }`}
 >
 <FaArrowRight className="w-4 h-4 rotate-180" />
 Previous
 </button>

 <div className="text-sm text-gray-500">
 {getTotalAnswered()} of {questions.length} answered
 </div>

 <motion.button
 whileHover={{ scale: isAnswered ? 1.05 : 1 }}
 whileTap={{ scale: isAnswered ? 0.95 : 1 }}
 onClick={handleNextQuestion}
 disabled={!isAnswered}
 className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
 isAnswered
 ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg hover:from-blue-700 hover:to-blue-800 hover:shadow-xl'
 : 'bg-gray-200 text-gray-400 cursor-not-allowed'
 }`}
 >
 {isLastQuestion ? 'Complete Test' : 'Next'}
 <FaArrowRight />
 </motion.button>
 </div>
 </div>
 </div>
 {/* Exit Modal */}
 <AnimatePresence>
 {showExitModal && (
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
 >
 <motion.div
 initial={{ scale: 0.9, opacity: 0 }}
 animate={{ scale: 1, opacity: 1 }}
 exit={{ scale: 0.9, opacity: 0 }}
 className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center"
 >
 <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
 <FaTimes className="w-8 h-8 text-red-600" />
 </div>
 <h3 className="text-xl font-bold text-gray-800 mb-2">Exit Test?</h3>
 <p className="text-gray-600 mb-6">Your progress will be saved, but you'll need to restart the test.</p>
 <div className="flex gap-3">
 <button
 onClick={() => setShowExitModal(false)}
 className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-medium transition-colors"
 >
 Cancel
 </button>
 <button
 onClick={handleConfirmExit}
 className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors"
 >
 Exit Test
 </button>
 </div>
 </motion.div>
 </motion.div>
 )}
 </AnimatePresence>
 </div>
 );
};

export default SpatialReasoningTest;