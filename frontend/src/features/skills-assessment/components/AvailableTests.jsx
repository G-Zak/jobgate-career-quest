import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaLock, FaPlay, FaChartLine, FaBrain, FaSearch, FaFilter } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const testsData = [
  {
    categoryKey: "numericalReasoningTests",
    prefix: "NRT",
    total: 15,
    unlocked: [1, 2, 3],
    icon: <FaChartLine className="text-blue-600" />,
    progress: 20
  },
  {
    categoryKey: "verbalReasoningTests",
    prefix: "VRT",
    total: 8,
    unlocked: [1, 2],
    icon: <FaBrain className="text-green-600" />,
    progress: 25
  },
  {
    categoryKey: "abstractReasoningTests",
    prefix: "LRT",
    total: 10,
    unlocked: [1],
    icon: <FaChartLine className="text-purple-600" />,
    progress: 10
  }
];

const AvailableTests = ({ onBackToDashboard, onStartTest }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [expandedCategory, setExpandedCategory] = useState(null);

  const filteredTests = testsData.filter(test => {
    const categoryText = t(test.categoryKey);
    const matchesSearch = categoryText.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "all" || 
                         (filter === "unlocked" && test.unlocked.length > 0) ||
                         (filter === "inprogress" && test.progress > 0 && test.progress < 100);
    return matchesSearch && matchesFilter;
  });

  const toggleCategory = (index) => {
    setExpandedCategory(expandedCategory === index ? null : index);
  };

  const handleTestStart = (testId) => {
    // Map test IDs to specific test types
    let targetTest = testId;
    
    if (testId.startsWith('NRT')) {
      targetTest = 'numerical-reasoning';
    } else if (testId.startsWith('LRT')) {
      targetTest = 'abstract-reasoning';
    } else if (testId.startsWith('VRT')) {
      targetTest = 'verbal-reasoning';
    }
    
    // Use callback if provided, otherwise use navigate as fallback
    if (onStartTest) {
      onStartTest(targetTest);
    } else {
      navigate("/test-session", { state: { testId: targetTest } });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Header with back button */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 p-4 transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={onBackToDashboard}
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t('backToDashboard')}
          </button>
          <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-200 transition-colors">{t('skillsAssessment')}</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-extrabold mb-4 tracking-tight text-gray-900 dark:text-gray-100 transition-colors">
            Assessment Dashboard
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 transition-colors">
            {t('skillsTestDescription')}
          </p>
        </motion.div>

        {/* Search and Filter Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-4 mb-8 border transition-colors duration-300"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400 dark:text-gray-500 transition-colors" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                placeholder={t('searchTests')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <FaFilter className="mr-2 text-gray-400 dark:text-gray-500 transition-colors" />
                <select
                  className="border rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">{t('allTests')}</option>
                  <option value="unlocked">{t('unlocked')}</option>
                  <option value="inprogress">{t('inProgress')}</option>
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tests List */}
        <div className="space-y-6">
          {filteredTests.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className={`rounded-xl shadow-sm border overflow-hidden transition-colors duration-300 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700`}
            >
              <div 
                className="p-6 cursor-pointer flex justify-between items-center"
                onClick={() => toggleCategory(index)}
              >
                <div className="flex items-center">
                  <div className="mr-4 p-3 rounded-lg bg-gray-100 dark:bg-gray-700 transition-colors">
                    {section.icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 transition-colors">{t(section.categoryKey)}</h2>
                    <div className="flex items-center mt-1">
                      <div className="w-32 rounded-full h-2 mr-3 bg-gray-200 dark:bg-gray-600 transition-colors">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${section.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400 transition-colors">
                        {section.unlocked.length} {t('of')} {section.total} {t('unlocked')}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-gray-400 dark:text-gray-500 transition-colors">
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
                                ? "bg-white dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-gray-600 border-blue-200 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:shadow-md"
                                : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"}
                            `}
                            onClick={(e) => {
                              e.stopPropagation();
                              unlocked && handleTestStart(testId);
                            }}
                          >
                            <div className="text-lg mb-2 font-semibold text-gray-800 dark:text-gray-200">{testId}</div>
                            <div className="text-xl">
                              {unlocked ? (
                                <FaPlay className="text-blue-600 dark:text-blue-400 mx-auto" />
                              ) : (
                                <FaLock className="text-gray-400 dark:text-gray-500 mx-auto" />
                              )}
                            </div>
                            {unlocked && (
                              <div className="mt-2 text-xs text-blue-600 dark:text-blue-400 font-medium">
                                {t('available')}
                              </div>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-gray-100 transition-colors">{t('startTechnicalTests')}</h3>
          <button
            onClick={() => navigate('/technical-tests')}
            className="px-6 py-3 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors shadow-md"
          >
            {t('startTechnicalTests')}
          </button>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 transition-colors">
            {t('skillsTestsDescription')}
          </p>
        </div>

        {filteredTests.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-12 text-center border border-gray-200 dark:border-gray-700 transition-colors duration-300"
          >
            <div className="text-gray-400 dark:text-gray-500 mb-4 transition-colors">
              <FaSearch className="mx-auto text-4xl" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1 transition-colors">
              {t('noTestsFound')}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 transition-colors">
              {t('adjustSearchCriteria')}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AvailableTests;
