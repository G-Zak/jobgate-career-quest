import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaPlay, FaLock, FaCode, FaServer, FaCogs } from "react-icons/fa";
import { motion } from "framer-motion";

const stacks = [
  {
    nameKey: "frontend",
    icon: <FaCode className="text-blue-500 w-6 h-6" />,
    tests: [
      { id: "JS-BASICS", labelKey: "javascriptBasics", unlocked: true },
      { id: "REACT", labelKey: "reactComponents", unlocked: false },
    ],
  },
  {
    nameKey: "backend",
    icon: <FaServer className="text-green-500 w-6 h-6" />,
    tests: [
      { id: "NODE", labelKey: "nodeJsIntro", unlocked: true },
      { id: "EXPRESS", labelKey: "expressRouting", unlocked: false },
    ],
  },
  {
    nameKey: "algorithms",
    icon: <FaCogs className="text-purple-500 w-6 h-6" />,
    tests: [
      { id: "SORTING", labelKey: "sortingAlgorithms", unlocked: true },
      { id: "DP", labelKey: "dynamicProgramming", unlocked: false },
    ],
  },
];

const TechnicalTests = ({ onBackToDashboard }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
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
          <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-200 transition-colors">{t('technicalTests')}</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-14">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-12 text-center transition-colors"
        >
          {t('testCategories')}
        </motion.h1>

        {stacks.map((stack, index) => (
          <motion.div
            key={stack.nameKey}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index, duration: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-10 border border-gray-200 dark:border-gray-700 transition-colors duration-300"
          >
            <div className="flex items-center space-x-4 mb-6">
              {stack.icon}
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 transition-colors">{t(stack.nameKey)}</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
              {stack.tests.map((test) => (
                <motion.div
                  key={test.id}
                  whileHover={{ scale: test.unlocked ? 1.04 : 1 }}
                  whileTap={{ scale: 0.97 }}
                  className={`p-4 rounded-lg border text-center font-medium cursor-pointer transition-all duration-200
                    ${test.unlocked
                      ? "bg-white dark:bg-gray-700 hover:bg-green-50 dark:hover:bg-gray-600 border-green-200 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:shadow-md"
                      : "bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"}`}
                  onClick={() =>
                    test.unlocked && navigate("/test-session", { state: { testId: test.id } })
                  }
                >
                  <div className="text-base mb-2 text-gray-800 dark:text-gray-200">{t(test.labelKey)}</div>
                  <div className="text-xl">
                    {test.unlocked ? (
                      <FaPlay className="text-green-500 dark:text-green-400 mx-auto" />
                    ) : (
                      <FaLock className="text-gray-400 dark:text-gray-500 mx-auto" />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TechnicalTests;
