import React from 'react';
import { motion } from 'framer-motion';
import { FaFlag, FaClock, FaChartPie, FaSearch, FaInfoCircle, FaCheckCircle } from 'react-icons/fa';

const TestInfoPage = ({ testData, onBackToDashboard, onStartTest, onShowResults, extraInfoEnabled = false }) => {
  if (!testData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Test not found</h2>
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

  const difficultyInfo = getDifficultyInfo(testData.difficulty);

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
        title: "Basic Logical Reasoning",
        subtitle: "Fundamental Logic & Patterns",
        duration: "20 minutes",
        questions: "20",
        format: "Multiple Choice",
        instructions: "Identify logical patterns, sequences, and relationships in various problem types.",
        guidelines: [
          "Look for underlying patterns and rules",
          "Consider sequence progression (arithmetic, geometric, etc.)",
          "Analyze cause and effect relationships",
          "Apply basic logical principles",
          "Work systematically through each problem"
        ],
        additionalInfo: "This beginner-level test introduces fundamental logical reasoning concepts."
      },
      'LRT2': {
        title: "Advanced Number Series",
        subtitle: "Complex Numerical Patterns",
        duration: "10 minutes",
        questions: "20",
        format: "Multiple Choice (5 options)",
        instructions: "Advanced number series questions with complex patterns including interruptions and alternating series.",
        guidelines: [
          "Each question has a definite pattern",
          "Some series may be interrupted by a periodic number (e.g., every third number)",
          "Some patterns contain two alternating series",
          "Look carefully for the pattern before choosing your answer",
          "You will be choosing from five options instead of four"
        ],
        additionalInfo: "Example: In series 14, 16, 32, 18, 20, 32, 22, 24, 32 - the number 32 appears as every third number."
      }
    };
    
    return testInfoDatabase[testId] || null;
  };

  // Get comprehensive test information
  const testInfo = getTestInfo(testData.id);
  
  // Use retrieved info if available, otherwise fall back to basic info
  const displayInfo = testInfo || {
    title: testData.category || "Assessment Test",
    subtitle: testData.description || "Assessment Test",
    duration: testData.duration || "20 minutes",
    questions: testData.questions || "20",
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
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
              onClick={() => onStartTest(testData.id)}
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
