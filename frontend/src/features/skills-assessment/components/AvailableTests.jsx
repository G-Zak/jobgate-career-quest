import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaLock, FaPlay, FaChartLine, FaBrain, FaSearch, FaFilter, FaGlobe, FaClock, FaQuestionCircle, FaStar, FaCheckCircle, FaCube, FaSitemap } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useScrollToTop } from '../../../shared/utils/scrollUtils';

const defaultTestsData = [
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
    unlocked: [1, 2],
    icon: <FaCube className="text-orange-600" />,
    progress: 17,
    testType: "spatial"
  },
  {
    category: "Diagrammatic Reasoning Tests",
    prefix: "DRT",
    total: 8,
    unlocked: [1, 2],
    icon: <FaSitemap className="text-green-600" />,
    progress: 25,
    testType: "diagrammatic"
  },
  {
    category: "Abstract Reasoning Tests",
    prefix: "ART",
    total: 6,
    unlocked: [1],
    icon: <FaBrain className="text-indigo-600" />,
    progress: 16,
    testType: "abstract"
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
  useScrollToTop([], { smooth: true }); // Scroll on component mount

  // Language options
  const languages = [
    { code: "english", label: "English", flag: "🇺🇸" },
    { code: "french", label: "Français", flag: "🇫🇷" }
  ];

  // Fetch verbal tests from backend
  useEffect(() => {
    // Simulate 4 tests with better progression
    const total = 4;
    const unlocked = 2; // 2 tests unlocked
    const verbalSection = {
      category: "Verbal Reasoning Tests",
      prefix: "VRT",
      total,
      unlocked: Array.from({length: unlocked}, (_, i) => i+1),
      icon: <FaBrain className="text-emerald-600" />,
      progress: Math.round((unlocked/total)*100),
      testType: "verbal",
      tests: [
        { id: 1, title: "VRT1", unlocked: true, level: "Beginner" },
        { id: 2, title: "VRT2", unlocked: true, level: "Intermediate" },
        { id: 3, title: "VRT3", unlocked: false, level: "Advanced" },
        { id: 4, title: "VRT4", unlocked: false, level: "Expert" }
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
    // Apply test type filter if provided
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
    // Include language in test ID for comprehensive tests
    const testIdWithLang = testId === 'VERBAL_COMPREHENSIVE' ? `${testId}_${selectedLanguage.toUpperCase()}` : testId;
    
    // Use callback if provided, otherwise use navigate as fallback
    if (onStartTest) {
      onStartTest(testIdWithLang);
    } else {
      navigate("/test-session", { state: { testId: testIdWithLang } });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header with back button (sticky under app header) */}
      <div id="available-tests-header" className="bg-white shadow-sm border-b border-gray-200 p-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={onBackToDashboard}
            className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour au tableau de bord
          </button>
          <h1 className="text-xl font-semibold text-gray-800">Évaluation des compétences</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Assessment Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Select a test to evaluate your skills and track your progress
          </p>
        </motion.div>

        {/* Search and Filter Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm p-4 mb-8 border border-gray-200"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search tests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <FaFilter className="text-gray-400 mr-2" />
                <select
                  className="border border-gray-300 rounded-lg bg-gray-50 px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
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
                  className="border border-gray-300 rounded-lg bg-gray-50 px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
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
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
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
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <div 
                className="p-6 cursor-pointer flex justify-between items-center"
                onClick={() => toggleCategory(index)}
              >
                <div className="flex items-center">
                  <div className="mr-4 p-3 bg-gray-100 rounded-lg">
                    {section.icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">{section.category}</h2>
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

                    {/* Improved Verbal Reasoning Tests Grid */}
                    {section.testType === "verbal" && section.tests ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                        {section.tests.map((test, i) => {
                          const levelColors = {
                            "Beginner": "from-emerald-400 to-emerald-600",
                            "Intermediate": "from-blue-400 to-blue-600", 
                            "Advanced": "from-purple-400 to-purple-600",
                            "Expert": "from-red-400 to-red-600"
                          };
                          
                          return (
                            <div
                              key={test.id}
                              className={`group relative rounded-2xl border-2 transition-all duration-300 transform ${
                                test.unlocked
                                  ? "bg-white shadow-lg hover:shadow-xl hover:-translate-y-1 border-gray-200 hover:border-emerald-300 cursor-pointer"
                                  : "bg-gray-50 border-gray-200 cursor-not-allowed opacity-60"
                              }`}
                              onClick={() => test.unlocked && handleTestStart(test.id)}
                            >
                              {/* Top gradient bar */}
                              <div className={`h-2 rounded-t-xl ${test.unlocked ? `bg-gradient-to-r ${levelColors[test.level]}` : 'bg-gray-300'}`}></div>
                              
                              <div className="p-6 text-center">
                                {/* Test ID */}
                                <div className="text-2xl font-bold text-gray-800 mb-3">{test.title}</div>
                                
                                {/* Icon */}
                                <div className="mb-4">
                                  {test.unlocked ? (
                                    <div className="relative">
                                      <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${levelColors[test.level]} flex items-center justify-center shadow-lg`}>
                                        <FaPlay className="text-white text-xl ml-1" />
                                      </div>
                                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                                        <FaCheckCircle className="text-white text-xs" />
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="w-16 h-16 mx-auto rounded-full bg-gray-300 flex items-center justify-center">
                                      <FaLock className="text-gray-500 text-xl" />
                                    </div>
                                  )}
                                </div>
                                
                                {/* Level Badge */}
                                <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 ${
                                  test.unlocked 
                                    ? `bg-gradient-to-r ${levelColors[test.level]} text-white shadow-sm`
                                    : 'bg-gray-200 text-gray-500'
                                }`}>
                                  {test.level}
                                </div>
                                
                                {/* Status */}
                                <div className={`text-sm font-medium ${
                                  test.unlocked ? "text-emerald-600" : "text-gray-400"
                                }`}>
                                  {test.unlocked ? "Available" : "Locked"}
                                </div>
                                
                                {/* Hover effect overlay */}
                                {test.unlocked && (
                                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-blue-50 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                                )}
                              </div>
                            </div>
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
          <h3 className="text-lg font-medium mb-4">Passage aux tests techniques</h3>
          <button
            onClick={() => navigate('/technical-tests')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            Commencer les tests techniques maintenant
          </button>
          <p className="text-sm text-gray-500 mt-2">
            Vous allez être testé sur les compétences de votre CV
          </p>
        </div>

        {!loading && filteredTests.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-200"
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
