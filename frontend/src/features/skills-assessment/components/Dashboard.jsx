import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaTrophy, 
  FaChartLine, 
  FaHistory, 
  FaCog, 
  FaUser,
  FaBookOpen,
  FaBrain,
  FaCalculator,
  FaLightbulb,
  FaShapes,
  FaEye,
  FaQuestionCircle
} from 'react-icons/fa';
import TestHistory from './TestHistory';
import TestHistoryStats from './TestHistoryStats';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showStats, setShowStats] = useState(false);

  const testCategories = [
    {
      id: 'verbal',
      name: 'Verbal Reasoning',
      icon: FaBookOpen,
      color: 'bg-blue-500',
      description: 'Reading comprehension, vocabulary, and language skills',
      tests: ['VRT1', 'VRT2', 'VRT3', 'VRT4', 'VRT5']
    },
    {
      id: 'numerical',
      name: 'Numerical Reasoning',
      icon: FaCalculator,
      color: 'bg-green-500',
      description: 'Mathematical problem solving and data interpretation',
      tests: ['NRT1', 'NRT2', 'NRT3']
    },
    {
      id: 'logical',
      name: 'Logical Reasoning',
      icon: FaBrain,
      color: 'bg-purple-500',
      description: 'Pattern recognition and logical deduction',
      tests: ['LRT1', 'LRT2', 'LRT3']
    },
    {
      id: 'situational',
      name: 'Situational Judgment',
      icon: FaQuestionCircle,
      color: 'bg-orange-500',
      description: 'Workplace scenarios and decision making',
      tests: ['SJT1']
    },
    {
      id: 'abstract',
      name: 'Abstract Reasoning',
      icon: FaShapes,
      color: 'bg-pink-500',
      description: 'Pattern recognition and abstract thinking',
      tests: ['ART1']
    },
    {
      id: 'spatial',
      name: 'Spatial Reasoning',
      icon: FaEye,
      color: 'bg-indigo-500',
      description: '3D visualization and spatial awareness',
      tests: ['SRT1', 'SRT2', 'SRT3']
    }
  ];

  const tabs = [
    { id: 'overview', name: 'Overview', icon: FaChartLine },
    { id: 'history', name: 'Test History', icon: FaHistory },
    { id: 'categories', name: 'Test Categories', icon: FaBookOpen },
    { id: 'settings', name: 'Settings', icon: FaCog }
  ];

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome to JobGate Career Quest</h1>
        <p className="text-blue-100 text-lg">
          Enhance your cognitive abilities and prepare for your dream career with our comprehensive assessment platform.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <FaTrophy className="h-8 w-8 text-yellow-500 mr-4" />
            <div>
              <p className="text-sm text-gray-600">Tests Completed</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <FaChartLine className="h-8 w-8 text-green-500 mr-4" />
            <div>
              <p className="text-sm text-gray-600">Average Score</p>
              <p className="text-2xl font-bold text-gray-900">--</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <FaHistory className="h-8 w-8 text-blue-500 mr-4" />
            <div>
              <p className="text-sm text-gray-600">This Week</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
          </div>
        </div>
      </div>

      {/* Test Categories Grid */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Test Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-center mb-4">
                <div className={`p-3 rounded-lg ${category.color} text-white mr-4`}>
                  <category.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">{category.description}</p>
              <div className="flex flex-wrap gap-2">
                {category.tests.map((test) => (
                  <span
                    key={test}
                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                  >
                    {test}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCategories = () => (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">Test Categories</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testCategories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center mb-4">
              <div className={`p-3 rounded-lg ${category.color} text-white mr-4`}>
                <category.icon className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{category.name}</h3>
                <p className="text-gray-600">{category.description}</p>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Available Tests:</h4>
              <div className="flex flex-wrap gap-2">
                {category.tests.map((test) => (
                  <button
                    key={test}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full hover:bg-blue-200 transition-colors"
                  >
                    {test}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Show Statistics</p>
              <p className="text-sm text-gray-600">Display performance charts and analytics</p>
            </div>
            <button
              onClick={() => setShowStats(!showStats)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                showStats ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  showStats ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <FaTrophy className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-gray-600">
                <FaUser className="h-5 w-5 mr-2" />
                <span>Anonymous User</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-5 w-5 mr-2" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'history' && <TestHistory />}
          {activeTab === 'categories' && renderCategories()}
          {activeTab === 'settings' && renderSettings()}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
