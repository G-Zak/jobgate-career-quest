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
  FaFilter,
  FaGlobe,
  FaChartLine,
  FaCube,
  FaUsers
} from 'react-icons/fa';
import { motion, AnimatePresence } from "framer-motion";
import { useScrollToTop } from '../../../shared/utils/scrollUtils';

const defaultTestsData = [
  {
    category: "Master Situational Judgment Test",
    prefix: "MASTER-SJT",
    total: 1,
    unlocked: [1],
    icon: <FaUsers className="text-indigo-600" />,
    progress: 100,
    testType: "master-sjt",
    featured: true,
    tests: [
      {
        id: 1,
        title: "Master SJT",
        unlocked: true,
        level: "Comprehensive",
        type: "master_workplace_assessment",
        description: "Comprehensive workplace behavior and judgment assessment covering all professional domains",
        duration: "35 min",
        questions: "35 (randomized)",
        badge: "🎯",
        difficulty: "adaptive",
        color: "indigo",
        features: ["Anti-cheating", "Retake cooldown", "200+ question pool", "Personalized results"]
      }
    ]
  },
  {
    category: "Situational Judgment Tests",
    prefix: "SJT",
    total: 1,
    unlocked: [1],
    icon: <FaUsers className="text-indigo-600" />,
    progress: 100,
    testType: "situational",
    tests: [
      {
        id: "SJT",
        title: "SJT",
        unlocked: true,
        level: "Professional",
        type: "workplace_scenarios",
        description: "Randomized workplace scenarios from 200+ question pool",
        duration: "25 min",
        questions: "20 (random)",
        badge: "💼",
        difficulty: "medium",
        color: "indigo",
        features: ["Random selection", "200+ question pool", "Shuffled answers", "Fresh test every time"]
      }
    ]
  },
  {
    category: "Numerical Reasoning Tests",
    prefix: "NRT",
    total: 15,
    unlocked: [1, 2, 3],
    icon: <FaChartLine className="text-blue-600" />,
    progress: 20,
    testType: "numerical"
  },
  {
    category: "Logical Reasoning Tests",
    prefix: "LRT",
    total: 10,
    unlocked: [1],
    icon: <FaChartLine className="text-purple-600" />,
    progress: 10,
    testType: "logical"
  },
  {
    category: "Spatial Reasoning Tests",
    prefix: "SRT",
    total: 12,
    unlocked: [1, 2, 3, 4, 5, 6],
    icon: <FaCube className="text-orange-600" />,
    progress: 50,
    testType: "spatial"
  }
];

const AvailableTests = ({ onBackToDashboard, onStartTest, testFilter }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState("english");
  const [verbalTests, setVerbalTests] = useState([]);
  const [testsData, setTestsData] = useState(defaultTestsData);
  const [loading, setLoading] = useState(true);

  // Universal scroll management
  useScrollToTop([], { smooth: true });

  // Language options
  const languages = [
    { code: "english", label: "English", flag: "🇺🇸" },
    { code: "french", label: "Français", flag: "🇫🇷" }
  ];

  // Fetch verbal tests from backend
  useEffect(() => {
    const verbalSection = {
      category: "Verbal Reasoning Tests",
      prefix: "VRT",
      total: 5, // Updated from 7 to 5 after consolidation
      unlocked: [1, 2, 3, 4, 5], // Updated to reflect new structure
      icon: <FaBrain className="text-emerald-600" />,
      progress: 100,
      testType: "verbal",
      tests: [
        { 
          id: 1, 
          title: "VRT-COMP", 
          unlocked: true, 
          level: "Mixed Difficulty",
          type: "reading_comprehension_consolidated",
          description: "Comprehensive reading comprehension test with randomized passages across all difficulty levels (science, business, management)",
          duration: "25 min",
          questions: "8 passages",
          badge: "📚",
          difficulty: "mixed",
          color: "emerald",
          features: ["Anti-cheating randomization", "Mixed difficulty", "Comprehensive coverage", "Fresh test every time"]
        },
        { 
          id: 2, 
          title: "VRT4", 
          unlocked: true, 
          level: "Expert",
          type: "verbal_analogies",
          description: "Comprehensive analogies across 9 different types",
          duration: "25 min",
          questions: 30,
          title: "VRT2", 
          unlocked: true, 
          level: "Intermediate",
          type: "reading_comprehension",
          description: "Business & professional reading comprehension",
          duration: "25 min",
          questions: 25,
          badge: "📖",
          difficulty: "medium",
          color: "blue"
        },
        { 
          id: 3, 
          title: "VRT3", 
          unlocked: true, 
          level: "Advanced",
          type: "reading_comprehension",
          description: "Management & leadership comprehension",
          duration: "30 min",
          questions: 30,
          badge: "💼",
          difficulty: "hard",
          color: "purple"
        },
        { 
          id: 4, 
          title: "VRT4", 
          unlocked: true, 
          level: "Expert",
          type: "verbal_analogies",
          description: "Comprehensive analogies across 9 different types",
          duration: "25 min",
          questions: 30,
          badge: "🔗",
          difficulty: "expert",
          color: "red"
        },
        { 
          id: 5, 
          title: "VRT5", 
          unlocked: true, 
          level: "Expert",
          type: "classification",
          description: "Classification (Odd-One-Out): words, pairs, numbers, letters",
          duration: "25 min",
          questions: 25,
          badge: "🔍",
          difficulty: "expert",
          color: "teal"
        },
        { 
          id: 6, 
          title: "VRT6", 
          unlocked: true, 
          level: "Master",
          type: "coding_decoding",
          description: "Coding & Decoding: crack patterns, codes, and ciphers",
          duration: "30 min",
          questions: 25,
          badge: "🔐",
          difficulty: "master",
          color: "indigo"
        },
        { 
          id: 7, 
          title: "VRT7", 
          unlocked: true, 
          level: "Master",
          type: "blood_relations_logical_puzzles",
          description: "Blood Relations & Logical Puzzles: advanced reasoning challenges",
          duration: "35 min",
          questions: 25,
          badge: "🧩",
          difficulty: "master",
          color: "rose"
        }
      ]
    };
    setTestsData([verbalSection, ...defaultTestsData]);
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
    const matchesFilter = filter === "all" || 
                         (filter === "unlocked" && test.unlocked.length > 0) ||
                         (filter === "inprogress" && test.progress > 0 && test.progress < 100);
    return matchesSearch && matchesFilter;
  });

  const toggleCategory = (index) => {
    setExpandedCategory(expandedCategory === index ? null : index);
  };

  const handleTestStart = (testId) => {
    const testIdWithLang = testId === 'VERBAL_COMPREHENSIVE' ? `${testId}_${selectedLanguage.toUpperCase()}` : testId;
    
    // Handle Master SJT specially - only if the testId is exactly 'MASTER-SJT1' or it's from the master-sjt section
    if (testId === 'MASTER-SJT1' || testId === 'Master SJT') {
      // Use the callback pattern to set the section
      if (onStartTest) {
        onStartTest('MASTER-SJT');
      }
      return;
    }
    
    if (onStartTest) {
      onStartTest(testIdWithLang);
    } else {
      navigate("/test-session", { state: { testId: testIdWithLang } });
    }
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with back button */}
      <div id="available-tests-header" className="bg-white shadow-sm border-b border-gray-200 p-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={onBackToDashboard}
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

        {/* Search and Filter Bar */}
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
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <FaFilter className="text-gray-400 mr-2" />
                <select
                  className="border border-gray-300 rounded-md bg-gray-50 px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">All Tests</option>
                  <option value="unlocked">Unlocked</option>
                  <option value="inprogress">In Progress</option>
                </select>
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
                    {/* Enhanced Test Cards for all test types */}
                    {(section.testType === "verbal" || section.testType === "situational" || section.testType === "master-sjt") && section.tests ? (
                      <div className={`grid ${section.testType === 'master-sjt' ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'} gap-6`}>
                        {section.tests.map((test) => {
                          const colorSchemes = {
                            emerald: {
                              bg: "bg-emerald-50",
                              border: "border-emerald-200",
                              text: "text-emerald-700",
                              hover: "hover:border-emerald-400",
                              button: "bg-emerald-600 hover:bg-emerald-700"
                            },
                            blue: {
                              bg: "bg-blue-50",
                              border: "border-blue-200",
                              text: "text-blue-700",
                              hover: "hover:border-blue-400",
                              button: "bg-blue-600 hover:bg-blue-700"
                            },
                            purple: {
                              bg: "bg-purple-50",
                              border: "border-purple-200",
                              text: "text-purple-700",
                              hover: "hover:border-purple-400",
                              button: "bg-purple-600 hover:bg-purple-700"
                            },
                            red: {
                              bg: "bg-red-50",
                              border: "border-red-200",
                              text: "text-red-700",
                              hover: "hover:border-red-400",
                              button: "bg-red-600 hover:bg-red-700"
                            },
                            teal: {
                              bg: "bg-teal-50",
                              border: "border-teal-200",
                              text: "text-teal-700",
                              hover: "hover:border-teal-400",
                              button: "bg-teal-600 hover:bg-teal-700"
                            },
                            indigo: {
                              bg: "bg-indigo-50",
                              border: "border-indigo-200",
                              text: "text-indigo-700",
                              hover: "hover:border-indigo-400",
                              button: "bg-indigo-600 hover:bg-indigo-700"
                            }
                          };

                          const scheme = colorSchemes[test.color] || colorSchemes.emerald;
                          const isMasterSJT = section.testType === 'master-sjt';

                          return (
                            <motion.div
                              key={test.id}
                              whileHover={{ y: -4 }}
                              className={`rounded-lg border ${scheme.border} ${scheme.bg} overflow-hidden transition-all duration-300 ${
                                test.unlocked ? `cursor-pointer ${scheme.hover}` : "opacity-70"
                              } ${isMasterSJT ? 'relative' : ''}`}
                              onClick={() => test.unlocked && handleTestStart(section.testType === 'verbal' ? test.title : test.id)}
                            >
                              {isMasterSJT && section.featured && (
                                <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                  FEATURED
                                </div>
                              )}
                              
                              <div className={`p-6 ${isMasterSJT ? 'p-8' : ''}`}>
                                {/* Test header with title and difficulty */}
                                <div className="flex justify-between items-start mb-4">
                                  <div className="flex items-center space-x-3">
                                    <span className="text-2xl">{test.badge}</span>
                                    <h3 className={`${isMasterSJT ? 'text-xl' : 'text-lg'} font-semibold text-gray-900`}>
                                      {test.title}
                                    </h3>
                                  </div>
                                  {test.difficulty === 'adaptive' ? (
                                    <span className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                                      ADAPTIVE
                                    </span>
                                  ) : (
                                    <DifficultyBadge difficulty={test.difficulty} />
                                  )}
                                </div>
                                
                                {/* Level indicator */}
                                <div className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-2">
                                  {test.level}
                                </div>
                                
                                {/* Description */}
                                <p className={`text-gray-600 ${isMasterSJT ? 'text-base' : 'text-sm'} mb-6 leading-relaxed`}>
                                  {test.description}
                                </p>

                                {/* Master SJT Features */}
                                {isMasterSJT && test.features && (
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
                                <div className={`flex justify-between items-center text-sm text-gray-500 mb-6 ${isMasterSJT ? 'text-base' : ''}`}>
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
                                    className={`w-full ${isMasterSJT ? 'py-4 text-lg' : 'py-3'} px-4 text-white font-medium rounded-md transition-colors ${scheme.button} flex items-center justify-center gap-2`}
                                  >
                                    <FaPlay className="text-sm" />
                                    <span>{isMasterSJT ? 'Start Master Assessment' : 'Start Test'}</span>
                                  </button>
                                ) : (
                                  <div className={`w-full ${isMasterSJT ? 'py-4' : 'py-3'} px-4 bg-gray-100 text-gray-500 font-medium rounded-md flex items-center justify-center gap-2`}>
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
                      // Original grid layout for non-verbal tests
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {Array.from({ length: section.total }, (_, i) => {
                          const num = i + 1;
                          const unlocked = section.unlocked.includes(num);
                          const testId = `${section.prefix}${num}`;

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
                                  Available
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
