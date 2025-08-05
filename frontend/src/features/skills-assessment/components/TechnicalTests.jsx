import React from "react";
import { useNavigate } from "react-router-dom";
import { FaPlay, FaLock, FaCode, FaServer, FaCogs } from "react-icons/fa";
import { motion } from "framer-motion";

const stacks = [
  {
    name: "Frontend",
    icon: <FaCode className="text-blue-500 w-6 h-6" />,
    tests: [
      { id: "JS-BASICS", label: "JavaScript Basics", unlocked: true },
      { id: "REACT", label: "React Components", unlocked: false },
    ],
  },
  {
    name: "Backend",
    icon: <FaServer className="text-green-500 w-6 h-6" />,
    tests: [
      { id: "NODE", label: "Node.js Intro", unlocked: true },
      { id: "EXPRESS", label: "Express Routing", unlocked: false },
    ],
  },
  {
    name: "Algorithmique",
    icon: <FaCogs className="text-purple-500 w-6 h-6" />,
    tests: [
      { id: "SORTING", label: "Sorting Algorithms", unlocked: true },
      { id: "DP", label: "Dynamic Programming", unlocked: false },
    ],
  },
];

const TechnicalTests = ({ onBackToDashboard }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
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
          <h1 className="text-xl font-semibold text-gray-800">Tests Techniques</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-14">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-extrabold text-gray-900 mb-12 text-center"
        >
          Technical Test Categories
        </motion.h1>

        {stacks.map((stack, index) => (
          <motion.div
            key={stack.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index, duration: 0.4 }}
            className="bg-white rounded-xl shadow-md p-6 mb-10 border"
          >
            <div className="flex items-center space-x-4 mb-6">
              {stack.icon}
              <h2 className="text-2xl font-bold text-gray-800">{stack.name}</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
              {stack.tests.map((test) => (
                <motion.div
                  key={test.id}
                  whileHover={{ scale: test.unlocked ? 1.04 : 1 }}
                  whileTap={{ scale: 0.97 }}
                  className={`p-4 rounded-lg border text-center font-medium cursor-pointer transition-all duration-200
                    ${test.unlocked
                      ? "bg-white hover:bg-green-50 border-green-200 text-gray-800 hover:shadow-md"
                      : "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"}`}
                  onClick={() =>
                    test.unlocked && navigate("/test-session", { state: { testId: test.id } })
                  }
                >
                  <div className="text-base mb-2">{test.label}</div>
                  <div className="text-xl">
                    {test.unlocked ? (
                      <FaPlay className="text-green-500 mx-auto" />
                    ) : (
                      <FaLock className="text-gray-400 mx-auto" />
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
