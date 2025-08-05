import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaLock, FaPlay, FaChartLine, FaBrain, FaSearch, FaFilter } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const testsData = [
  {
    category: "Numerical Reasoning Tests",
    prefix: "NRT",
    total: 15,
    unlocked: [1, 2, 3],
    icon: <FaChartLine className="text-blue-600" />,
    progress: 20
  },
  {
    category: "Verbal Reasoning Tests",
    prefix: "VRT",
    total: 8,
    unlocked: [1, 2],
    icon: <FaBrain className="text-green-600" />,
    progress: 25
  },
  {
    category: "Logical Reasoning Tests",
    prefix: "LRT",
    total: 10,
    unlocked: [1],
    icon: <FaChartLine className="text-purple-600" />,
    progress: 10
  }
];

const AvailableTests = ({ onBackToDashboard, onStartTest }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [expandedCategory, setExpandedCategory] = useState(null);

  const filteredTests = testsData.filter(test => {
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
    // Use callback if provided, otherwise use navigate as fallback
    if (onStartTest) {
      onStartTest(testId);
    } else {
      navigate("/test-session", { state: { testId } });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header with back button */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4">
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
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

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

        {filteredTests.length === 0 && (
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
