import React, { useState, useEffect, useRef } from 'react';
import { 
  XMarkIcon, 
  ChevronDownIcon,
  ArrowTrendingUpIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  DocumentArrowDownIcon,
  ShareIcon,
  PrinterIcon,
  AcademicCapIcon,
  ChartBarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import RadarChart from './RadarChart';
import ProgressIndicator from './ProgressIndicator';
import TrendChart from './TrendChart';
import PerformanceMetrics from './PerformanceMetrics';

const EmployabilityScoreModal = ({ 
  isOpen, 
  onClose, 
  scoreData, 
  selectedProfile, 
  onProfileChange,
  profiles,
  loading 
}) => {
  const [activeTab, setActiveTab] = useState('breakdown');
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);

  // Focus management for accessibility
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement;
      // Focus the modal after animation completes
      setTimeout(() => {
        modalRef.current?.focus();
      }, 300);
    } else if (previousFocusRef.current) {
      previousFocusRef.current.focus();
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return 'bg-green-50 border-green-200';
    if (score >= 60) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  const getScoreIcon = (score) => {
    if (score >= 80) return <CheckCircleIcon className="w-6 h-6 text-green-600" />;
    if (score >= 60) return <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600" />;
    return <XCircleIcon className="w-6 h-6 text-red-600" />;
  };

  const handleExportPDF = () => {
    // TODO: Implement PDF export functionality
    console.log('Exporting PDF...');
  };

  const handleShare = () => {
    // TODO: Implement sharing functionality
    console.log('Sharing report...');
  };

  const handlePrint = () => {
    window.print();
  };

  const tabs = [
    { id: 'breakdown', label: 'Category Breakdown', icon: ChartBarIcon },
    { id: 'trends', label: 'Performance Trends', icon: ArrowTrendingUpIcon },
    { id: 'recommendations', label: 'Recommendations', icon: AcademicCapIcon },
    { id: 'history', label: 'Test History', icon: ClockIcon }
  ];

  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.95,
      y: 50 
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95,
      y: 50,
      transition: {
        duration: 0.2,
        ease: "easeIn"
      }
    }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.2 }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="flex min-h-full items-center justify-center p-4">
          <motion.div
            ref={modalRef}
            className="relative w-full max-w-6xl bg-white rounded-2xl shadow-2xl"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            {/* Header */}
            <motion.div 
              className="flex items-center justify-between p-6 border-b border-gray-200"
              variants={itemVariants}
            >
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <ChartBarIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 id="modal-title" className="text-2xl font-bold text-gray-900">
                    Detailed Employability Report
                  </h2>
                  <p className="text-sm text-gray-500">
                    Comprehensive analysis of your career readiness
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleExportPDF}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Export PDF"
                >
                  <DocumentArrowDownIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Share Report"
                >
                  <ShareIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={handlePrint}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Print Report"
                >
                  <PrinterIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Close modal"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
            </motion.div>

            {/* Score Overview */}
            <motion.div 
              className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50"
              variants={itemVariants}
            >
              <div className="flex items-center justify-between">
                {/* Score Circle */}
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full border-8 border-gray-200 flex items-center justify-center">
                      <div className="text-center">
                        <div className={`text-4xl font-bold ${getScoreColor(scoreData?.overallScore || 0)}`}>
                          {loading ? '...' : scoreData?.overallScore || 0}
                        </div>
                        <div className="text-sm text-gray-500">/ 100</div>
                      </div>
                    </div>
                    {/* Animated progress ring */}
                    <svg className="absolute inset-0 w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        strokeDasharray={`${((scoreData?.overallScore || 0) / 100) * 251.2} 251.2`}
                        className={getScoreColor(scoreData?.overallScore || 0).replace('text-', 'stroke-')}
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>

                  {/* Score Details */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      {getScoreIcon(scoreData?.overallScore || 0)}
                      <span className={`text-2xl font-bold ${getScoreColor(scoreData?.overallScore || 0)}`}>
                        {loading ? 'Loading...' : scoreData?.scoreInterpretation?.level || 'Unknown'}
                      </span>
                    </div>
                    <p className="text-gray-600 max-w-md">
                      {loading ? 'Calculating your score...' : 
                        scoreData?.scoreInterpretation?.description || 
                        'No interpretation available'
                      }
                    </p>
                    {scoreData?.scoreInterpretation?.market_position && (
                      <p className="text-sm text-gray-500">
                        {scoreData.scoreInterpretation.market_position}
                      </p>
                    )}
                  </div>
                </div>

                {/* Profile Selector */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-medium text-gray-700">{selectedProfile}</span>
                    <ChevronDownIcon className="w-4 h-4 text-gray-500" />
                  </button>

                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                      {profiles.map((profile) => (
                        <button
                          key={profile}
                          onClick={() => {
                            onProfileChange(profile);
                            setIsProfileDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors ${
                            profile === selectedProfile ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                          }`}
                        >
                          {profile}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Tabs */}
            <motion.div 
              className="border-b border-gray-200"
              variants={itemVariants}
            >
              <nav className="flex space-x-8 px-6">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </motion.div>

            {/* Tab Content */}
            <motion.div 
              className="p-6 max-h-96 overflow-y-auto"
              variants={contentVariants}
              initial="hidden"
              animate="visible"
            >
              {activeTab === 'breakdown' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Category Performance</h3>
                    {scoreData?.categories && Object.keys(scoreData.categories).length > 0 && (
                      <div className="text-sm text-gray-500">
                        Overall Score: <span className="font-bold text-gray-900">{Math.round(scoreData.overallScore || 0)}/100</span>
                      </div>
                    )}
                  </div>

                  {loading ? (
                    <div className="animate-pulse space-y-3">
                      <div className="h-64 bg-gray-200 rounded-lg"></div>
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
                      ))}
                    </div>
                  ) : scoreData?.categories ? (
                    <div className="space-y-6">
                      {/* Enhanced Radar Chart Section */}
                      {Object.keys(scoreData.categories).length > 0 && (
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                          <h4 className="text-lg font-semibold text-gray-900 mb-4 text-center">Skills Overview</h4>
                          <div className="flex justify-center">
                            <RadarChart
                              data={(() => {
                                // Define all possible test types that can exist
                                const allTestTypes = {
                                  // Individual cognitive test types
                                  'numerical_reasoning': 'Numerical Reasoning',
                                  'abstract_reasoning': 'Abstract Reasoning',
                                  'verbal_reasoning': 'Verbal Reasoning',
                                  'spatial_reasoning': 'Spatial Reasoning',
                                  'logical_reasoning': 'Logical Reasoning',
                                  'diagrammatic_reasoning': 'Diagrammatic Reasoning',
                                  'analytical_reasoning': 'Analytical Reasoning',
                                  // Other test categories
                                  'situational': 'Situational Tests',
                                  'technical': 'Technical Tests'
                                };

                                // Create data for all test types, showing 0 for untaken tests
                                return Object.entries(allTestTypes).map(([key, displayName]) => {
                                  const testData = scoreData.categories?.[key];
                                  return {
                                    name: displayName,
                                    score: testData?.score || 0,
                                    count: testData?.count || 0,
                                    hasData: testData?.count > 0
                                  };
                                });
                              })()}
                              size={280}
                              animated={true}
                              showTooltips={true}
                            />
                          </div>
                        </div>
                      )}

                      {/* Detailed Category Breakdown */}
                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-gray-900">Detailed Analysis</h4>
                        {Object.entries(scoreData.categories).map(([categoryKey, categoryData]) => {
                          const categoryNames = {
                            'cognitive': 'Cognitive Abilities',
                            'technical': 'Technical Skills',
                            'situational': 'Situational Judgment',
                            'communication': 'Communication',
                            'analytical': 'Analytical Thinking'
                          };

                          const categoryDescriptions = {
                            'cognitive': 'Logical thinking, reasoning, and problem-solving skills',
                            'technical': 'Domain-specific technical knowledge and expertise',
                            'situational': 'Decision-making and interpersonal skills in workplace scenarios',
                            'communication': 'Verbal and written communication effectiveness',
                            'analytical': 'Data analysis, mathematical reasoning, and quantitative skills'
                          };

                          const categoryName = categoryNames[categoryKey] || categoryKey;
                          const categoryDesc = categoryDescriptions[categoryKey] || '';
                          const score = categoryData.score || 0;
                          const count = categoryData.count || 0;

                          // Skip categories with no tests taken
                          if (count === 0) return null;

                          const getScoreColorClass = (score) => {
                            if (score >= 80) return 'text-green-600';
                            if (score >= 60) return 'text-yellow-600';
                            return 'text-red-600';
                          };

                          const getScoreLevel = (score) => {
                            if (score >= 90) return 'Excellent';
                            if (score >= 80) return 'Very Good';
                            if (score >= 70) return 'Good';
                            if (score >= 60) return 'Average';
                            if (score >= 50) return 'Below Average';
                            return 'Needs Improvement';
                          };

                          return (
                            <motion.div
                              key={categoryKey}
                              className="p-5 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                              variants={itemVariants}
                            >
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                  <h5 className="text-lg font-semibold text-gray-900 mb-1">{categoryName}</h5>
                                  <p className="text-sm text-gray-600 mb-3">{categoryDesc}</p>
                                </div>
                                <div className="text-right ml-4">
                                  <div className={`text-3xl font-bold ${getScoreColorClass(score)} mb-1`}>
                                    {Math.round(score)}
                                  </div>
                                  <div className={`text-sm font-medium ${getScoreColorClass(score)}`}>
                                    {getScoreLevel(score)}
                                  </div>
                                </div>
                              </div>

                              <div className="grid grid-cols-4 gap-4 mb-4">
                                <div className="text-center p-3 bg-gray-50 rounded-lg">
                                  <div className="text-lg font-bold text-gray-900">{count}</div>
                                  <div className="text-xs text-gray-500">Tests Taken</div>
                                </div>
                                <div className="text-center p-3 bg-gray-50 rounded-lg">
                                  <div className="text-lg font-bold text-gray-900">{Math.round(categoryData.best_score || 0)}</div>
                                  <div className="text-xs text-gray-500">Best Score</div>
                                </div>
                                <div className="text-center p-3 bg-gray-50 rounded-lg">
                                  <div className="text-lg font-bold text-gray-900">{Math.round(categoryData.consistency || 0)}%</div>
                                  <div className="text-xs text-gray-500">Consistency</div>
                                </div>
                                <div className="text-center p-3 bg-gray-50 rounded-lg">
                                  <div className={`text-lg font-bold ${categoryData.recent_trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {categoryData.recent_trend > 0 ? '+' : ''}{categoryData.recent_trend?.toFixed(1) || '0.0'}
                                  </div>
                                  <div className="text-xs text-gray-500">Recent Trend</div>
                                </div>
                              </div>

                              {/* Enhanced Progress bar */}
                              <div className="w-full bg-gray-200 rounded-full h-4 mb-3">
                                <motion.div
                                  className={`h-4 rounded-full ${score >= 80 ? 'bg-gradient-to-r from-green-500 to-green-600' : score >= 60 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' : 'bg-gradient-to-r from-red-500 to-red-600'}`}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${Math.min(score, 100)}%` }}
                                  transition={{ duration: 1.2, delay: 0.3 }}
                                />
                              </div>

                              {/* Performance insights */}
                              <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center space-x-2">
                                  {categoryData.recent_trend !== 0 && (
                                    <>
                                      <ArrowTrendingUpIcon className={`w-4 h-4 ${categoryData.recent_trend > 0 ? 'text-green-600' : 'text-red-600'}`} />
                                      <span className={`${categoryData.recent_trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {categoryData.recent_trend > 0 ? 'Improving' : 'Declining'} trend
                                      </span>
                                    </>
                                  )}
                                </div>
                                <div className="text-gray-500">
                                  Last updated: {categoryData.last_updated ? new Date(categoryData.last_updated).toLocaleDateString() : 'N/A'}
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-16 text-gray-500">
                      <AcademicCapIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <p className="text-xl font-medium mb-2">No test data available yet</p>
                      <p className="text-sm">Complete some assessments to see your detailed breakdown</p>
                      <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Take Your First Assessment
                      </button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'trends' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Performance Trends</h3>
                    {scoreData?.improvement_trend && (
                      <div className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-medium ${
                        scoreData.improvement_trend > 0 ? 'bg-green-100 text-green-700' :
                        scoreData.improvement_trend < 0 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        <ArrowTrendingUpIcon className={`w-4 h-4 ${
                          scoreData.improvement_trend > 0 ? 'text-green-600' :
                          scoreData.improvement_trend < 0 ? 'text-red-600' : 'text-gray-600'
                        }`} />
                        <span>
                          {scoreData.improvement_trend > 0 ? '+' : ''}{scoreData.improvement_trend.toFixed(1)} points
                        </span>
                      </div>
                    )}
                  </div>

                  {loading ? (
                    <div className="animate-pulse space-y-4">
                      <div className="h-64 bg-gray-200 rounded-lg"></div>
                      <div className="grid grid-cols-3 gap-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
                        ))}
                      </div>
                    </div>
                  ) : scoreData?.categories ? (
                    <div className="space-y-6">
                      {/* Overall Performance Summary */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-500 rounded-lg">
                              <ChartBarIcon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <div className="text-2xl font-bold text-blue-900">{Math.round(scoreData.overallScore || 0)}</div>
                              <div className="text-sm text-blue-700">Current Score</div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-green-500 rounded-lg">
                              <AcademicCapIcon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <div className="text-2xl font-bold text-green-900">{scoreData.testsCompleted || 0}</div>
                              <div className="text-sm text-green-700">Tests Completed</div>
                            </div>
                          </div>
                        </div>

                        <div className={`bg-gradient-to-br rounded-xl p-4 border ${
                          (scoreData.improvement_trend || 0) >= 0
                            ? 'from-emerald-50 to-emerald-100 border-emerald-200'
                            : 'from-red-50 to-red-100 border-red-200'
                        }`}>
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg ${
                              (scoreData.improvement_trend || 0) >= 0 ? 'bg-emerald-500' : 'bg-red-500'
                            }`}>
                              <ArrowTrendingUpIcon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <div className={`text-2xl font-bold ${
                                (scoreData.improvement_trend || 0) >= 0 ? 'text-emerald-900' : 'text-red-900'
                              }`}>
                                {scoreData.improvement_trend > 0 ? '+' : ''}{(scoreData.improvement_trend || 0).toFixed(1)}
                              </div>
                              <div className={`text-sm ${
                                (scoreData.improvement_trend || 0) >= 0 ? 'text-emerald-700' : 'text-red-700'
                              }`}>
                                Trend Points
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Category Trends */}
                      <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Category Performance Trends</h4>
                        <div className="space-y-4">
                          {Object.entries(scoreData.categories)
                            .filter(([_, data]) => data.count > 0)
                            .map(([categoryKey, categoryData]) => {
                              const categoryNames = {
                                'cognitive': 'Cognitive Abilities',
                                'technical': 'Technical Skills',
                                'situational': 'Situational Judgment',
                                'communication': 'Communication',
                                'analytical': 'Analytical Thinking'
                              };

                              const categoryName = categoryNames[categoryKey] || categoryKey;
                              const trend = categoryData.recent_trend || 0;
                              const score = categoryData.score || 0;
                              const consistency = categoryData.consistency || 0;

                              return (
                                <motion.div
                                  key={categoryKey}
                                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                  variants={itemVariants}
                                >
                                  <div className="flex items-center space-x-4">
                                    <div className="flex-shrink-0">
                                      <div className={`w-3 h-3 rounded-full ${
                                        score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                      }`}></div>
                                    </div>
                                    <div>
                                      <div className="font-medium text-gray-900">{categoryName}</div>
                                      <div className="text-sm text-gray-500">
                                        Score: {Math.round(score)} • Consistency: {Math.round(consistency)}%
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex items-center space-x-3">
                                    <div className="text-right">
                                      <div className={`text-sm font-medium ${
                                        trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-gray-600'
                                      }`}>
                                        {trend > 0 ? '+' : ''}{trend.toFixed(1)} pts
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        {trend > 0 ? 'Improving' : trend < 0 ? 'Declining' : 'Stable'}
                                      </div>
                                    </div>
                                    <ArrowTrendingUpIcon className={`w-5 h-5 ${
                                      trend > 0 ? 'text-green-500' : trend < 0 ? 'text-red-500 transform rotate-180' : 'text-gray-400'
                                    }`} />
                                  </div>
                                </motion.div>
                              );
                            })}
                        </div>
                      </div>

                      {/* Performance Insights */}
                      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Performance Insights</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-3">
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-sm text-gray-700">
                                <strong>Strongest Area:</strong> {
                                  Object.entries(scoreData.categories)
                                    .filter(([_, data]) => data.count > 0)
                                    .sort(([,a], [,b]) => (b.score || 0) - (a.score || 0))[0]?.[0]
                                    ? {
                                        'cognitive': 'Cognitive Abilities',
                                        'technical': 'Technical Skills',
                                        'situational': 'Situational Judgment',
                                        'communication': 'Communication',
                                        'analytical': 'Analytical Thinking'
                                      }[Object.entries(scoreData.categories)
                                        .filter(([_, data]) => data.count > 0)
                                        .sort(([,a], [,b]) => (b.score || 0) - (a.score || 0))[0][0]] || 'N/A'
                                    : 'N/A'
                                }
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                              <span className="text-sm text-gray-700">
                                <strong>Focus Area:</strong> {
                                  Object.entries(scoreData.categories)
                                    .filter(([_, data]) => data.count > 0)
                                    .sort(([,a], [,b]) => (a.score || 0) - (b.score || 0))[0]?.[0]
                                    ? {
                                        'cognitive': 'Cognitive Abilities',
                                        'technical': 'Technical Skills',
                                        'situational': 'Situational Judgment',
                                        'communication': 'Communication',
                                        'analytical': 'Analytical Thinking'
                                      }[Object.entries(scoreData.categories)
                                        .filter(([_, data]) => data.count > 0)
                                        .sort(([,a], [,b]) => (a.score || 0) - (b.score || 0))[0][0]] || 'N/A'
                                    : 'N/A'
                                }
                              </span>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              <span className="text-sm text-gray-700">
                                <strong>Most Consistent:</strong> {
                                  Object.entries(scoreData.categories)
                                    .filter(([_, data]) => data.count > 0)
                                    .sort(([,a], [,b]) => (b.consistency || 0) - (a.consistency || 0))[0]?.[0]
                                    ? {
                                        'cognitive': 'Cognitive',
                                        'technical': 'Technical',
                                        'situational': 'Situational',
                                        'communication': 'Communication',
                                        'analytical': 'Analytical'
                                      }[Object.entries(scoreData.categories)
                                        .filter(([_, data]) => data.count > 0)
                                        .sort(([,a], [,b]) => (b.consistency || 0) - (a.consistency || 0))[0][0]] || 'N/A'
                                    : 'N/A'
                                }
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                              <span className="text-sm text-gray-700">
                                <strong>Fastest Improving:</strong> {
                                  Object.entries(scoreData.categories)
                                    .filter(([_, data]) => data.count > 0)
                                    .sort(([,a], [,b]) => (b.recent_trend || 0) - (a.recent_trend || 0))[0]?.[0]
                                    ? {
                                        'cognitive': 'Cognitive',
                                        'technical': 'Technical',
                                        'situational': 'Situational',
                                        'communication': 'Communication',
                                        'analytical': 'Analytical'
                                      }[Object.entries(scoreData.categories)
                                        .filter(([_, data]) => data.count > 0)
                                        .sort(([,a], [,b]) => (b.recent_trend || 0) - (a.recent_trend || 0))[0][0]] || 'N/A'
                                    : 'N/A'
                                }
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-16 text-gray-500">
                      <ArrowTrendingUpIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <p className="text-xl font-medium mb-2">No trend data available</p>
                      <p className="text-sm">Complete more assessments to see your performance trends</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'recommendations' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Personalized Recommendations</h3>
                  {loading ? (
                    <div className="animate-pulse space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
                      ))}
                    </div>
                  ) : scoreData?.recommendations && scoreData.recommendations.length > 0 ? (
                    <div className="space-y-4">
                      {scoreData.recommendations.map((recommendation, index) => (
                        <motion.div
                          key={index}
                          className={`p-4 rounded-lg border-l-4 ${
                            recommendation.priority === 'high' ? 'bg-red-50 border-red-400' :
                            recommendation.priority === 'medium' ? 'bg-yellow-50 border-yellow-400' :
                            'bg-blue-50 border-blue-400'
                          }`}
                          variants={itemVariants}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <div className={`flex-shrink-0 w-3 h-3 rounded-full ${
                                  recommendation.priority === 'high' ? 'bg-red-400' :
                                  recommendation.priority === 'medium' ? 'bg-yellow-400' :
                                  'bg-blue-400'
                                }`}></div>
                                <h4 className="text-lg font-medium text-gray-900">{recommendation.title}</h4>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                  recommendation.priority === 'high' ? 'bg-red-100 text-red-800' :
                                  recommendation.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-blue-100 text-blue-800'
                                }`}>
                                  {recommendation.priority} priority
                                </span>
                              </div>
                              <p className="text-gray-600 mb-3">{recommendation.description}</p>

                              {recommendation.type === 'improvement' && (
                                <div className="flex space-x-2">
                                  <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
                                    Take {recommendation.category} Tests
                                  </button>
                                  <button className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors">
                                    Learn More
                                  </button>
                                </div>
                              )}

                              {recommendation.type === 'assessment' && (
                                <button className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors">
                                  Take More Tests
                                </button>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <CheckCircleIcon className="w-12 h-12 mx-auto mb-4 text-green-300" />
                      <p className="text-lg font-medium">Great job!</p>
                      <p className="text-sm mt-1">No specific recommendations at this time. Keep up the good work!</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'history' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Test Sessions</h3>
                  {loading ? (
                    <div className="animate-pulse space-y-3">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
                      ))}
                    </div>
                  ) : scoreData?.recent_sessions && scoreData.recent_sessions.length > 0 ? (
                    <div className="space-y-3">
                      {scoreData.recent_sessions.map((session, index) => (
                        <motion.div
                          key={session.id || index}
                          className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                          variants={itemVariants}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-1">
                                <h4 className="font-medium text-gray-900">{session.test_title || 'Test Session'}</h4>
                                <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                  {session.test_type || 'Unknown'}
                                </span>
                              </div>
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <span>
                                  <ClockIcon className="w-4 h-4 inline mr-1" />
                                  {session.duration_minutes ? `${session.duration_minutes} min` : 'N/A'}
                                </span>
                                <span>
                                  {session.start_time ? new Date(session.start_time).toLocaleDateString() : 'Unknown date'}
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className={`text-2xl font-bold ${
                                (session.score || 0) >= 80 ? 'text-green-600' :
                                (session.score || 0) >= 60 ? 'text-yellow-600' :
                                'text-red-600'
                              }`}>
                                {session.score || 0}
                              </div>
                              <div className="text-xs text-gray-500">/ 100</div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <ClockIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium">No test history available</p>
                      <p className="text-sm mt-1">Complete some assessments to see your test history here</p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>

            {/* Footer */}
            <motion.div 
              className="flex items-center justify-between p-6 bg-gray-50 rounded-b-2xl"
              variants={itemVariants}
            >
              <div className="text-sm text-gray-500">
                Last updated: {scoreData?.lastUpdated ? new Date(scoreData.lastUpdated).toLocaleDateString() : 'Never'}
              </div>
              <div className="flex space-x-3">
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                  Take Recommended Tests
                </button>
                <button 
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default EmployabilityScoreModal;
