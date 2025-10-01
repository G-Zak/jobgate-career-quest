import React from 'react';
import { motion } from 'framer-motion';
import { FaFlag, FaClock, FaChartPie, FaSearch, FaInfoCircle, FaCheckCircle } from 'react-icons/fa';
import { getRuleFor, getPrettyTitle } from '../testRules';

const TestInfoPage = ({ testId, onBackToDashboard, onStartTest, onShowResults, extraInfoEnabled = false }) => {
 const rule = getRuleFor(testId);

 if (!rule) {
 return (
 <div className="bg-gray-50 flex items-center justify-center">
 <div className="text-center">
 <h2 className="text-xl font-semibold text-gray-800 mb-2">Test info not available</h2>
 <p className="text-gray-600 mb-4">Unknown test: {testId}</p>
 <button
 onClick={onBackToDashboard}
 className="px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
 >
 Back to Dashboard
 </button>
 </div>
 </div>
 );
 }

 const getDifficultyInfo = (difficulty) => {
 const difficultyMap = {
 easy: { label: 'Beginner', color: 'text-green-600' },
 medium: { label: 'Intermediate', color: 'text-yellow-600' },
 hard: { label: 'Advanced', color: 'text-orange-600' },
 expert: { label: 'Expert', color: 'text-red-600' },
 mixed: { label: 'Mixed Difficulty', color: 'text-purple-600' },
 adaptive: { label: 'Adaptive', color: 'text-blue-600' }
 };
 return difficultyMap[difficulty] || { label: 'Available', color: 'text-gray-600' };
 };

 const difficultyInfo = getDifficultyInfo(rule.difficultyLabel);

 // Static test information based on test-information.md
 const getTestInfo = (testId) => {
 const testInfoDatabase = {
 'NRT1': {
 title: "Numerical Reasoning Test",
 subtitle: "Charts, Tables & Figures Analysis",
 duration: "20 minutes",
 questions: "20",
 format: "Multiple Choice (4 options)",
 instructions: "This test has been designed to assess your numerical reasoning ability using the information provided in a series of charts, tables and figures. Look at each chart or table provided for each question, and use the information in these to work out the correct answer. You have 5 options from which to choose from. Only one of these options is the correct answer.",
 guidelines: [
 "Please take this test in a quiet environment where you are unlikely to be distracted",
 "You may use a calculator for this test",
 "Ensure you have rough paper for working out",
 "Work both quickly and accurately",
 "If required for accessibility purposes, additional time can be assigned in your profile",
 "If you are not using a mobile device, you can navigate this test without using your keyboard, using the arrow keys to move between items"
 ],
 additionalInfo: "This test consists of 20 questions and you have 20 minutes in which to complete this. The questions are numbered across the top of the screen.",
 extraInfo: [
 "Calculator is permitted for complex calculations",
 "Rough paper should be available for workings",
 "Questions increase in difficulty progressively",
 "Review your answers if time permits"
 ]
 },
 'VRT1': {
 title: "Reading Comprehension - Basic Level",
 subtitle: "Text Analysis & Understanding",
 duration: "20 minutes",
 questions: "9",
 format: "True/False/Cannot Say",
 instructions: "Read each passage carefully and answer the questions based on the information provided.",
 guidelines: [
 "Read each passage thoroughly before attempting questions",
 "Base your answers only on the information provided in the passage",
 "True: The statement is definitely true based on the passage",
 "False: The statement is definitely false based on the passage",
 "Cannot Say: There is insufficient information to determine if the statement is true or false"
 ],
 additionalInfo: "Focus on understanding the main ideas, supporting details, and logical relationships within each passage."
 },
 'VRT2': {
 title: "Business & Professional Reading",
 subtitle: "Workplace Communication Analysis",
 duration: "25 minutes",
 questions: "25",
 format: "Multiple Choice",
 instructions: "Analyze business documents, emails, reports, and professional communications to answer comprehension questions.",
 guidelines: [
 "Focus on business context and professional terminology",
 "Identify key information, decisions, and recommendations",
 "Consider the target audience and communication purpose",
 "Pay attention to tone, formality level, and business etiquette"
 ],
 additionalInfo: "This test evaluates your ability to understand and analyze workplace communications effectively."
 },
 'LRT1': {
 title: "Logical Reasoning Test 1",
 subtitle: "Pattern Recognition & Logical Sequences",
 duration: "20 minutes",
 questions: "20",
 format: "Multiple Choice (4 options)",
 instructions: "This test assesses your logical reasoning ability through pattern recognition, sequence analysis, and logical problem-solving. You will encounter various types of logical problems that test your ability to identify patterns, relationships, and logical structures.",
 guidelines: [
 "Look for underlying patterns and rules in sequences",
 "Consider arithmetic, geometric, and other progression types",
 "Analyze cause and effect relationships",
 "Apply logical principles systematically",
 "Work through each problem methodically"
 ],
 additionalInfo: "Mixed difficulty questions covering fundamental to intermediate logical reasoning concepts."
 },
 'LRT2': {
 title: "Logical Reasoning Test 2",
 subtitle: "Advanced Pattern Analysis",
 duration: "20 minutes",
 questions: "20",
 format: "Multiple Choice (4 options)",
 instructions: "This test focuses on advanced logical reasoning patterns including complex sequences, spatial reasoning, and multi-step logical problems. You will encounter more challenging problems that require deeper analysis and pattern recognition.",
 guidelines: [
 "Look for complex patterns and relationships",
 "Consider multiple variables and constraints",
 "Analyze spatial and geometric patterns",
 "Apply advanced logical principles",
 "Work systematically through multi-step problems"
 ],
 additionalInfo: "Mixed difficulty questions covering intermediate to advanced logical reasoning concepts."
 },
 'LRT3': {
 title: "Logical Reasoning Test 3",
 subtitle: "Expert-Level Logical Analysis",
 duration: "20 minutes",
 questions: "20",
 format: "Multiple Choice (4 options)",
 instructions: "This test presents expert-level logical reasoning challenges including abstract patterns, complex relationships, and advanced problem-solving scenarios. These questions test your ability to think critically and apply logical principles in sophisticated contexts.",
 guidelines: [
 "Identify abstract and non-obvious patterns",
 "Consider multiple logical frameworks simultaneously",
 "Analyze complex cause-and-effect relationships",
 "Apply advanced reasoning strategies",
 "Think creatively and systematically"
 ],
 additionalInfo: "Mixed difficulty questions covering advanced to expert-level logical reasoning concepts."
 },
 'SRT1': {
 title: "Spatial Reasoning Test 1",
 subtitle: "Shape Assembly & Pattern Recognition",
 duration: "20 minutes",
 questions: "20",
 format: "Multiple Choice (4 options)",
 instructions: "This test assesses your spatial reasoning ability through shape assembly, pattern recognition, and 3D visualization. You will be shown component shapes and need to identify which option shows the correct assembly when joined together by corresponding letters.",
 guidelines: [
 "Look carefully at the component shapes and their letters",
 "Visualize how the shapes would look when assembled",
 "Match the letters on corresponding sides",
 "Consider the final target shape configuration",
 "Work systematically through each question"
 ],
 additionalInfo: "Mixed difficulty questions covering fundamental to intermediate spatial reasoning concepts."
 },
 'SRT2': {
 title: "Spatial Reasoning Test 2",
 subtitle: "Advanced Spatial Analysis",
 duration: "20 minutes",
 questions: "20",
 format: "Multiple Choice (4 options)",
 instructions: "This test focuses on advanced spatial reasoning including complex shape transformations, 3D rotations, and spatial relationship analysis. You will encounter more challenging spatial problems that require deeper visualization skills.",
 guidelines: [
 "Analyze complex spatial relationships",
 "Consider 3D rotations and transformations",
 "Visualize shapes from different perspectives",
 "Apply advanced spatial reasoning principles",
 "Work methodically through each problem"
 ],
 additionalInfo: "Mixed difficulty questions covering intermediate to advanced spatial reasoning concepts."
 },
 'SRT3': {
 title: "Spatial Reasoning Test 3",
 subtitle: "Expert-Level Spatial Visualization",
 duration: "20 minutes",
 questions: "20",
 format: "Multiple Choice (4 options)",
 instructions: "This test presents expert-level spatial reasoning challenges including complex 3D manipulations, abstract spatial patterns, and advanced visualization scenarios. These questions test your ability to think spatially in sophisticated contexts.",
 guidelines: [
 "Master complex 3D spatial manipulations",
 "Identify abstract spatial patterns and relationships",
 "Apply expert-level visualization strategies",
 "Think creatively about spatial problems",
 "Work systematically through challenging scenarios"
 ],
 additionalInfo: "Mixed difficulty questions covering advanced to expert-level spatial reasoning concepts."
 }
 };

 return testInfoDatabase[testId] || null;
 };

 // Get comprehensive test information
 const testInfo = getTestInfo(testId);

 // Use retrieved info if available, otherwise fall back to basic info
 const displayInfo = testInfo || {
 title: getPrettyTitle(testId),
 subtitle: "Assessment Test",
 duration: `${rule.timeLimitMin} minutes`,
 questions: rule.totalQuestions.toString(),
 format: "Multiple Choice",
 instructions: "Follow the instructions for each question carefully. Select the best answer from the available options.",
 guidelines: [
 "Read each question carefully",
 "Select the best answer from the available options",
 "Work efficiently but accurately",
 "Review your answers if time permits"
 ],
 additionalInfo: "Complete all questions within the time limit."
 };

 return (
 <div className="bg-gray-50 flex items-center justify-center p-0">
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.6 }}
 className="max-w-4xl w-full bg-white rounded-lg shadow-lg overflow-hidden"
 >
 {/* Header */}
 <div className="text-center py-8 px-6 border-b border-gray-200">
 <div className="mb-4">
 <FaSearch className="mx-auto text-4xl text-blue-600" />
 </div>
 <h1 className="text-3xl font-bold text-gray-900 mb-2">
 {displayInfo.title}
 </h1>
 {displayInfo.subtitle && (
 <p className="text-lg text-blue-600 font-medium mb-3">
 {displayInfo.subtitle}
 </p>
 )}
 <p className="text-gray-600 max-w-2xl mx-auto">
 {displayInfo.instructions}
 </p>
 </div>

 {/* Test Info Cards */}
 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8">
 {/* Questions */}
 <div className="text-center p-6 bg-blue-50 rounded-lg">
 <FaFlag className="mx-auto text-3xl text-blue-600 mb-3" />
 <h3 className="text-lg font-semibold text-gray-800 mb-1">Questions</h3>
 <p className="text-2xl font-bold text-blue-600">{displayInfo.questions}</p>
 <p className="text-sm text-gray-600 mt-1">{displayInfo.format}</p>
 </div>

 {/* Time Limit */}
 <div className="text-center p-6 bg-green-50 rounded-lg">
 <FaClock className="mx-auto text-3xl text-green-600 mb-3" />
 <h3 className="text-lg font-semibold text-gray-800 mb-1">Time Limit</h3>
 <p className="text-2xl font-bold text-green-600">{displayInfo.duration}</p>
 </div>

 {/* Section */}
 <div className="text-center p-6 bg-purple-50 rounded-lg">
 <FaChartPie className="mx-auto text-3xl text-purple-600 mb-3" />
 <h3 className="text-lg font-semibold text-gray-800 mb-1">Difficulty</h3>
 <p className={`text-2xl font-bold ${difficultyInfo.color}`}>
 {difficultyInfo.label}
 </p>
 </div>
 </div>

 {/* Instructions */}
 <div className="px-8 pb-6">
 <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
 <FaInfoCircle className="mr-2 text-blue-600" />
 Instructions:
 </h3>
 <div className="bg-gray-50 rounded-lg p-6 mb-6">
 <p className="text-gray-700 leading-relaxed mb-4">
 {displayInfo.instructions}
 </p>

 {displayInfo.guidelines && displayInfo.guidelines.length > 0 && (
 <div className="mt-4">
 <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
 <FaCheckCircle className="mr-2 text-green-600" />
 Guidelines:
 </h4>
 <ul className="space-y-2">
 {displayInfo.guidelines.map((guideline, index) => (
 <li key={index} className="flex items-start text-gray-700">
 <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
 <span>{guideline}</span>
 </li>
 ))}
 </ul>
 </div>
 )}

 {displayInfo.additionalInfo && (
 <div className="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-600">
 <p className="text-blue-800 font-medium">
 {displayInfo.additionalInfo}
 </p>
 </div>
 )}
 </div>

 {/* Optional Extra Info Section - controlled by extraInfoEnabled flag */}
 {extraInfoEnabled && displayInfo.extraInfo && (
 <div className="mt-6 p-6 bg-yellow-50 rounded-lg border border-yellow-200">
 <h4 className="font-semibold text-yellow-800 mb-3 flex items-center">
 <FaSearch className="mr-2 text-yellow-600" />
 Additional Information:
 </h4>
 <div className="text-yellow-700">
 {typeof displayInfo.extraInfo === 'string' ? (
 <p>{displayInfo.extraInfo}</p>
 ) : (
 <ul className="space-y-2">
 {displayInfo.extraInfo.map((item, index) => (
 <li key={index} className="flex items-start">
 <span className="w-2 h-2 bg-yellow-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
 <span>{item}</span>
 </li>
 ))}
 </ul>
 )}
 </div>
 </div>
 )}
 </div>

 {/* Action Buttons */}
 <div className="flex justify-between items-center p-8 bg-gray-50 border-t border-gray-200">
 <button
 onClick={onBackToDashboard}
 className="px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors font-medium"
 >
 Back to Dashboard
 </button>
 <div className="flex gap-4">
 <button
 onClick={() => onStartTest(testId)}
 className="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
 >
 Start Test
 </button>
 {/* Demo button for testing results page */}

 </div>
 </div>
 </motion.div>
 </div>
 );
};

export default TestInfoPage;
