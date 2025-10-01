import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
 FaBrain,
 FaCog,
 FaPlay,
 FaLock,
 FaCheckCircle,
 FaClock,
 FaQuestionCircle,
 FaChevronDown,
 FaChevronUp,
 FaSearch,
 FaGlobe,
 FaChartLine,
 FaCube,
 FaUsers,
 FaSitemap
} from 'react-icons/fa';
import { motion, AnimatePresence } from "framer-motion";
import { useScrollToTop } from '../../../shared/utils/scrollUtils';
import TestInfoPage from './TestInfoPage';
import TestResultsPage from './TestResultsPage';

const unifiedTestsData = [
 {
 category: "Numerical Reasoning Tests",
 prefix: "NRT",
 total: 1,
 unlocked: [1],
 icon: <FaChartLine className="text-blue-600" />,
 progress: 100,
 testType: "numerical",
 tests: [
 { id: "NRT1", title: "NRT1", difficulty: "easy", level: "Beginner", duration: "15 min", questions: "20", badge: "", color: "blue" }

 ].map(test => ({ ...test, unlocked: true, description: `${test.level} numerical reasoning assessment` }))
 },
 {
 category: "Verbal Reasoning Tests",
 prefix: "VRT",
 total: 5,
 unlocked: [1, 2, 3, 4, 5],
 icon: <FaBrain className="text-emerald-600" />,
 progress: 100,
 testType: "verbal",
 tests: [
 { id: "VRT1", title: "VRT1 - Reading Comprehension", difficulty: "mixed", level: "Mixed Difficulty", duration: "20 min", questions: "10", badge: "�", color: "emerald", unlocked: true, description: "Comprehensive reading comprehension with mixed difficulty passages covering science, business, and management topics" },
 { id: "VRT2", title: "VRT2 - Analogies", difficulty: "expert", level: "Expert", duration: "25 min", questions: "25", badge: "", color: "emerald", unlocked: true, description: "Comprehensive analogies across 9 different types" },
 { id: "VRT3", title: "VRT3 - Classification", difficulty: "expert", level: "Expert", duration: "25 min", questions: "25", badge: "", color: "emerald", unlocked: true, description: "Classification (Odd-One-Out): words, pairs, numbers, letters" },
 { id: "VRT4", title: "VRT4 - Coding & Decoding", difficulty: "expert", level: "Master", duration: "30 min", questions: "25", badge: "", color: "emerald", unlocked: true, description: "Coding & Decoding: crack patterns, codes, and ciphers" },
 { id: "VRT5", title: "VRT5 - Blood Relations & Logical Puzzles", difficulty: "expert", level: "Master", duration: "35 min", questions: "25", badge: "", color: "emerald", unlocked: true, description: "Blood Relations & Logical Puzzles: advanced reasoning challenges" }

 ]
 },
 {
 category: "Logical Reasoning Tests",
 prefix: "LRT",
 total: 3,
 unlocked: [1, 2, 3, 4, 5, 6, 7],
 icon: <FaCog className="text-purple-600" />,
 progress: 100,
 testType: "logical",
 tests: [
 { id: "LRT1", title: "LRT1", difficulty: "easy", level: "Beginner", duration: "15 min", questions: "20", badge: "", color: "purple" },
 { id: "LRT2", title: "LRT2", difficulty: "easy", level: "Beginner", duration: "15 min", questions: "20", badge: "", color: "purple" },
 { id: "LRT3", title: "LRT3", difficulty: "easy", level: "Beginner", duration: "15 min", questions: "20", badge: "", color: "purple" }
 ].map(test => ({ ...test, unlocked: true, description: `${test.level} logical reasoning assessment` }))
 },
 {
 category: "Abstract Reasoning Tests",
 prefix: "ART",
 total: 1,
 unlocked: [1],
 icon: <FaBrain className="text-indigo-600" />,
 progress: 100,
 testType: "abstract",
 tests: [
 { id: "ART1", title: "ART1", difficulty: "easy", level: "Beginner", duration: "15 min", questions: "20", badge: "", color: "indigo" }
 ].map(test => ({ ...test, unlocked: true, description: `${test.level} abstract reasoning assessment` }))
 },
 {
 category: "Diagrammatic Reasoning Tests",
 prefix: "DRT",
 total: 2,
 unlocked: [1, 2],
 icon: <FaSitemap className="text-green-600" />,
 progress: 100,
 testType: "diagrammatic",
 tests: [
 { id: "DRT1", title: "DRT1", difficulty: "easy", level: "Beginner", duration: "15 min", questions: "20", badge: "", color: "green" },
 { id: "DRT2", title: "DRT2", difficulty: "easy", level: "Beginner", duration: "15 min", questions: "20", badge: "", color: "green" }
 ].map(test => ({ ...test, unlocked: true, description: `${test.level} diagrammatic reasoning assessment` }))
 },
 {
 category: "Spatial Reasoning Tests",
 prefix: "SRT",
 total: 6,
 unlocked: [1, 2, 3, 4, 5, 6],
 icon: <FaCube className="text-orange-600" />,
 progress: 100,
 testType: "spatial",
 tests: [
 { id: "SRT1", title: "SRT1", difficulty: "easy", level: "Beginner", duration: "15 min", questions: "20", badge: "", color: "orange" },
 { id: "SRT2", title: "SRT2", difficulty: "easy", level: "Beginner", duration: "15 min", questions: "20", badge: "", color: "orange" },
 { id: "SRT3", title: "SRT3", difficulty: "easy", level: "Beginner", duration: "15 min", questions: "20", badge: "", color: "orange" },
 { id: "SRT4", title: "SRT4", difficulty: "medium", level: "Intermediate", duration: "20 min", questions: "25", badge: "", color: "orange" },
 { id: "SRT5", title: "SRT5", difficulty: "medium", level: "Intermediate", duration: "20 min", questions: "25", badge: "", color: "orange" },
 { id: "SRT6", title: "SRT6", difficulty: "medium", level: "Intermediate", duration: "20 min", questions: "25", badge: "", color: "orange" }
 ].map(test => ({ ...test, unlocked: true, description: `${test.level} spatial reasoning assessment` }))
 },
 {
 category: "Situational Judgment Tests",
 prefix: "SJT",
 total: 1,
 unlocked: [1],
 icon: <FaUsers className="text-teal-600" />,
 progress: 100,
 testType: "situational",
 tests: [
 { id: "SJT1", title: "SJT1", difficulty: "easy", level: "Beginner", duration: "15 min", questions: "20", badge: "", color: "teal" }
 ].map(test => ({ ...test, unlocked: true, description: `${test.level} situational judgment assessment` }))
 },
 {
 category: "Technical Assessment Tests",
 prefix: "TAT",
 total: 8,
 unlocked: [1, 2, 3, 4, 5, 6, 7, 8],
 icon: <FaCog className="text-red-600" />,
 progress: 100,
 testType: "technical",
 tests: [
 { id: "TAT1", title: "TAT1", difficulty: "easy", level: "Beginner", duration: "15 min", questions: "20", badge: "", color: "red" },
 { id: "TAT2", title: "TAT2", difficulty: "easy", level: "Beginner", duration: "15 min", questions: "20", badge: "", color: "red" },
 { id: "TAT3", title: "TAT3", difficulty: "medium", level: "Intermediate", duration: "20 min", questions: "25", badge: "", color: "red" },
 { id: "TAT4", title: "TAT4", difficulty: "medium", level: "Intermediate", duration: "20 min", questions: "25", badge: "", color: "red" },
 { id: "TAT5", title: "TAT5", difficulty: "medium", level: "Intermediate", duration: "20 min", questions: "25", badge: "", color: "red" },
 { id: "TAT6", title: "TAT6", difficulty: "hard", level: "Advanced", duration: "25 min", questions: "30", badge: "", color: "red" },
 { id: "TAT7", title: "TAT7", difficulty: "hard", level: "Advanced", duration: "25 min", questions: "30", badge: "", color: "red" },
 { id: "TAT8", title: "TAT8", difficulty: "hard", level: "Expert", duration: "30 min", questions: "35", badge: "", color: "red" }
 ].map(test => ({ ...test, unlocked: true, description: `${test.level} technical assessment` }))
 }
];

const defaultTestsData = [];

const AvailableTests = ({ onBackToDashboard, onStartTest, onViewTestInfo, testFilter }) => {
 const navigate = useNavigate();
 const [searchTerm, setSearchTerm] = useState("");
 const [expandedCategory, setExpandedCategory] = useState(null);
 const [selectedLanguage, setSelectedLanguage] = useState("english");
 const [verbalTests, setVerbalTests] = useState([]);
 const [testsData, setTestsData] = useState([...defaultTestsData, ...unifiedTestsData]);
 const [loading, setLoading] = useState(true);

 // Navigation state for test info and results pages
 const [currentPage, setCurrentPage] = useState('dashboard'); // 'dashboard', 'testInfo', 'testResults'
 const [selectedTestData, setSelectedTestData] = useState(null);
 const [testResults, setTestResults] = useState(null);

 // Universal scroll management
 useScrollToTop([], { smooth: true });

 // Language options
 const languages = [
 { code: "english", label: "English", flag: "" },
 { code: "french", label: "Français", flag: "" }
 ];

 // Fetch verbal tests from backend
 useEffect(() => {
 setTestsData([...defaultTestsData, ...unifiedTestsData]);
 setLoading(false);
 }, []);

 // Auto-expand category if filter is applied
 useEffect(() => {
 if (testFilter) {
 const categoryIndex = testsData.findIndex(test => test.testType === testFilter);
 if (categoryIndex !== -1) {
 setExpandedCategory(categoryIndex);
 }
 }
 }, [testFilter]);

 const filteredTests = testsData.filter(test => {
 if (testFilter && test.testType !== testFilter) {
 return false;
 }

 const matchesSearch = test.category.toLowerCase().includes(searchTerm.toLowerCase());
 return matchesSearch;
 });

 const toggleCategory = (index) => {
 setExpandedCategory(expandedCategory === index ? null : index);
 };

 const handleTestStart = (testId) => {
 // Find the test data from both defaultTestsData and unifiedTestsData
 let testData = null;

 // Search in unifiedTestsData first
 for (const section of unifiedTestsData) {
 const test = section.tests?.find(t => t.id === testId || t.title === testId);
 if (test) {
 testData = {
 id: testId,
 title: test.title,
 difficulty: test.difficulty,
 level: test.level,
 duration: test.duration,
 questions: test.questions,
 description: test.description,
 testType: section.testType
 };
 break;
 }
 }

 // If not found, search in defaultTestsData
 if (!testData) {
 for (const section of defaultTestsData) {
 const test = section.tests?.find(t =>
 t.id === testId ||
 t.title === testId ||
 t.id.toString() === testId.toString()
 );
 if (test) {
 testData = {
 id: testId,
 title: test.title,
 difficulty: test.difficulty,
 level: test.level,
 duration: test.duration,
 questions: test.questions,
 description: test.description,
 testType: section.testType
 };
 break;
 }
 }
 }

 // Handle Master SJT as regular SJT
 if (testId === 'MASTER-SJT' || testId === 'Master SJT' || testId === 1 || testId === '1') {
 testData = {
 id: 'SJT1',
 title: 'Situational Judgment Test',
 difficulty: 'adaptive',
 level: 'Comprehensive',
 duration: '25 min',
 questions: '20 (randomized)',
 description: 'Comprehensive workplace behavior and judgment assessment covering all professional domains',
 testType: 'situational'
 };
 }

 // Check if we should use the new unified UX pattern
 if (onViewTestInfo && testData) {
 // New unified pattern: Dashboard → Test Info → Test Runner → Results
 onViewTestInfo(testId, testData);
 } else if (testData) {
 // Legacy pattern: Show test info page within AvailableTests
 setSelectedTestData(testData);
 setCurrentPage('testInfo');
 }
 };

 const handleActualTestStart = (testId) => {
 const testIdWithLang = testId === 'VERBAL_COMPREHENSIVE' ? `${testId}_${selectedLanguage.toUpperCase()}` : testId;

 if (onStartTest) {
 onStartTest(testIdWithLang);
 } else {
 navigate("/test-session", { state: { testId: testIdWithLang } });
 }
 };

 const handleBackToDashboard = () => {
 setCurrentPage('dashboard');
 setSelectedTestData(null);
 setTestResults(null);
 if (onBackToDashboard) {
 onBackToDashboard();
 }
 };

 const handleShowResults = (results) => {
 setTestResults(results);
 setCurrentPage('testResults');
 };

 // Difficulty badge component
 const DifficultyBadge = ({ difficulty }) => {
 const difficultyConfig = {
 easy: { color: "bg-green-100 text-green-800", label: "Easy" },
 medium: { color: "bg-yellow-100 text-yellow-800", label: "Medium" },
 hard: { color: "bg-orange-100 text-orange-800", label: "Hard" },
 expert: { color: "bg-red-100 text-red-800", label: "Expert" }
 };

 const config = difficultyConfig[difficulty] || difficultyConfig.easy;

 return (
 <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
 {config.label}
 </span>
 );
 };

 // Conditional rendering based on current page
 if (currentPage === 'testInfo') {
 return (
 <TestInfoPage
 testId={selectedTestData?.id}
 onBackToDashboard={handleBackToDashboard}
 onStartTest={handleActualTestStart}
 onShowResults={handleShowResults}
 />
 );
 }

 if (currentPage === 'testResults') {
 return (
 <TestResultsPage
 testResults={testResults}
 onBackToDashboard={handleBackToDashboard}
 onRetakeTest={(testId) => {
 // Reset to test info page for retake
 handleTestStart(testId);
 }}
 />
 );
 }

 return (
 <div className="min-h-screen bg-gray-50">
 {/* Header with back button */}
 <div id="available-tests-header" className="bg-white shadow-sm border-b border-gray-200 p-4 sticky top-0 z-40">
 <div className="max-w-7xl mx-auto flex items-center justify-between">
 <button
 onClick={handleBackToDashboard}
 className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
 >
 <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
 </svg>
 Back to Dashboard
 </button>
 <h1 className="text-xl font-semibold text-gray-800">Skills Assessment</h1>
 </div>
 </div>

 <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
 <motion.div
 initial={{ opacity: 0, y: -20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.6 }}
 className="mb-8"
 >
 <h1 className="text-3xl font-bold text-gray-900 mb-2">
 Assessment Dashboard
 </h1>
 <p className="text-gray-600">
 Select a test to evaluate your skills and track your progress
 </p>
 </motion.div>

 {/* Search and Language Bar */}
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 transition={{ delay: 0.3 }}
 className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-200"
 >
 <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
 <div className="relative flex-grow">
 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
 <FaSearch className="text-gray-400" />
 </div>
 <input
 type="text"
 className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
 placeholder="Search tests..."
 value={searchTerm}
 onChange={(e) => setSearchTerm(e.target.value)}
 />
 </div>

 {/* Language Selector */}
 <div className="flex items-center">
 <FaGlobe className="text-gray-400 mr-2" />
 <select
 className="border border-gray-300 rounded-md bg-gray-50 px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
 value={selectedLanguage}
 onChange={(e) => setSelectedLanguage(e.target.value)}
 >
 {languages.map((lang) => (
 <option key={lang.code} value={lang.code}>
 {lang.flag} {lang.label}
 </option>
 ))}
 </select>
 </div>
 </div>
 </motion.div>

 {/* Tests List */}
 {loading ? (
 <div className="space-y-6">
 {[1, 2, 3].map((i) => (
 <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
 <div className="flex items-center space-x-4">
 <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
 <div className="flex-1">
 <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
 <div className="h-4 bg-gray-200 rounded w-1/2"></div>
 </div>
 </div>
 </div>
 ))}
 </div>
 ) : (
 <div className="space-y-6">
 {filteredTests.map((section, index) => (
 <motion.div
 key={index}
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.1 * index }}
 className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
 >
 <div
 className="p-6 cursor-pointer flex justify-between items-center hover:bg-gray-50 transition-colors"
 onClick={() => toggleCategory(index)}
 >
 <div className="flex items-center">
 <div className="mr-4 p-3 bg-gray-100 rounded-lg">
 {section.icon}
 </div>
 <div>
 <h2 className="text-lg font-semibold text-gray-800">{section.category}</h2>
 <div className="flex items-center mt-1">
 <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
 <div
 className="bg-blue-600 h-2 rounded-full"
 style={{ width: `${section.progress}%` }}
 ></div>
 </div>
 <span className="text-sm text-gray-500">
 {section.unlocked.length} of {section.total} unlocked
 </span>
 </div>
 </div>
 </div>
 <div className="text-gray-400">
 <motion.div
 animate={{ rotate: expandedCategory === index ? 180 : 0 }}
 >
 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
 </svg>
 </motion.div>
 </div>
 </div>

 <AnimatePresence>
 {expandedCategory === index && (
 <motion.div
 initial={{ opacity: 0, height: 0 }}
 animate={{ opacity: 1, height: "auto" }}
 exit={{ opacity: 0, height: 0 }}
 transition={{ duration: 0.3 }}
 className="px-6 pb-6"
 >
 {/* Special layout for Master SJT, Grid layout for all other tests */}
 {false && section.testType === "master-sjt" && section.tests ? (
 <div className="grid grid-cols-1 gap-6">
 {section.tests.map((test) => {
 const colorSchemes = {
 indigo: {
 bg: "bg-indigo-50",
 border: "border-indigo-200",
 text: "text-indigo-700",
 hover: "hover:border-indigo-400",
 button: "bg-indigo-600 hover:bg-indigo-700"
 }
 };

 const scheme = colorSchemes.indigo;
 const isMasterSJT = true;

 return (
 <motion.div
 key={test.id}
 whileHover={{ y: -4 }}
 className={`rounded-lg border ${scheme.border} ${scheme.bg} overflow-hidden transition-all duration-300 ${
 test.unlocked ? `cursor-pointer ${scheme.hover}` : "opacity-70"
 } relative`}
 onClick={() => {
 if (!test.unlocked) return;
 handleTestStart('MASTER-SJT');
 }}
 >
 {section.featured && (
 <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
 FEATURED
 </div>
 )}

 <div className="p-8">
 {/* Test header with title and difficulty */}
 <div className="flex justify-between items-start mb-4">
 <div className="flex items-center space-x-3">
 <span className="text-2xl">{test.badge}</span>
 <h3 className="text-xl font-semibold text-gray-900">
 {test.title}
 </h3>
 </div>
 <span className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full">
 ADAPTIVE
 </span>
 </div>

 {/* Level indicator */}
 <div className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-2">
 {test.level}
 </div>

 {/* Description */}
 <p className="text-gray-600 text-base mb-6 leading-relaxed">
 {test.description}
 </p>

 {/* Master SJT Features */}
 {test.features && (
 <div className="grid grid-cols-2 gap-3 mb-6">
 {test.features.map((feature, idx) => (
 <div key={idx} className="flex items-center space-x-2 text-sm text-indigo-700">
 <FaCheckCircle className="text-indigo-600" />
 <span>{feature}</span>
 </div>
 ))}
 </div>
 )}

 {/* Stats */}
 <div className="flex justify-between items-center text-base text-gray-500 mb-6">
 <div className="flex items-center gap-1">
 <FaClock className="text-gray-400" />
 <span>{test.duration}</span>
 </div>
 <div className="flex items-center gap-1">
 <FaQuestionCircle className="text-gray-400" />
 <span>{test.questions}</span>
 </div>
 </div>

 {/* Action Button */}
 {test.unlocked ? (
 <button
 className="w-full py-4 text-lg px-4 text-white font-medium rounded-md transition-colors bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center gap-2"
 onClick={(e) => {
 e.stopPropagation();
 handleTestStart('MASTER-SJT');
 }}
 >
 <FaPlay className="text-sm" />
 <span>Start Master Assessment</span>
 </button>
 ) : (
 <div className="w-full py-4 px-4 bg-gray-100 text-gray-500 font-medium rounded-md flex items-center justify-center gap-2">
 <FaLock className="text-sm" />
 <span>Locked</span>
 </div>
 )}
 </div>
 </motion.div>
 );
 })}
 </div>
 ) : (
 /* Grid Layout for ALL other test types */
 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
 {Array.from({ length: section.total }, (_, i) => {
 const num = i + 1;
 const unlocked = section.unlocked.includes(num);
 const testId = `${section.prefix}${num}`;

 // Find the corresponding test in the section's tests array to get difficulty
 const testData = section.tests?.find(test => test.id === testId);
 const difficultyLabel = testData?.level || "Available";

 return (
 <motion.div
 key={testId}
 whileHover={{ scale: unlocked ? 1.03 : 1 }}
 whileTap={{ scale: 0.98 }}
 className={`p-4 rounded-lg border text-center font-medium cursor-pointer transition-all duration-200
 ${unlocked
 ? "bg-white hover:bg-blue-50 border-blue-200 text-gray-800 hover:shadow-md"
 : "bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed"}
 `}
 onClick={(e) => {
 e.stopPropagation();
 unlocked && handleTestStart(testId);
 }}
 >
 <div className="text-lg mb-2 font-semibold">{testId}</div>
 <div className="text-xl">
 {unlocked ? (
 <FaPlay className="text-blue-600 mx-auto" />
 ) : (
 <FaLock className="text-gray-400 mx-auto" />
 )}
 </div>
 {unlocked && (
 <div className="mt-2 text-xs text-blue-600 font-medium">
 {difficultyLabel}
 </div>
 )}
 </motion.div>
 );
 })}
 </div>
 )}
 </motion.div>
 )}
 </AnimatePresence>
 </motion.div>
 ))}
 </div>
 )}

 <div className="mt-12 text-center">
 <h3 className="text-lg font-medium mb-4">Proceed to Technical Tests</h3>
 <button
 onClick={() => navigate('/technical-tests')}
 className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-sm"
 >
 Start Technical Tests Now
 </button>
 <p className="text-sm text-gray-500 mt-2">
 You will be tested on the skills from your CV
 </p>
 </div>

 {!loading && filteredTests.length === 0 && (
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 className="bg-white rounded-lg shadow-sm p-12 text-center border border-gray-200"
 >
 <div className="text-gray-400 mb-4">
 <FaSearch className="mx-auto text-4xl" />
 </div>
 <h3 className="text-lg font-medium text-gray-900 mb-1">
 No tests found
 </h3>
 <p className="text-gray-500">
 Try adjusting your search or filter criteria
 </p>
 </motion.div>
 )}
 </div>
 </div>
 );
};

export default AvailableTests;
