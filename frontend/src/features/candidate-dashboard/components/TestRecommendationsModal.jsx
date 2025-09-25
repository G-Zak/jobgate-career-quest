import React, { useState, useEffect } from 'react';
import {
  XMarkIcon,
  AcademicCapIcon,
  ChartBarIcon,
  ClockIcon,
  StarIcon,
  PlayIcon,
  TrophyIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

const TestRecommendationsModal = ({ isOpen, onClose, onStartTest, onNavigateToTest }) => {
  const [recommendedTests, setRecommendedTests] = useState([]);
  const [loading, setLoading] = useState(false);

  // Test recommendations mapped to actual existing tests
  const mockTestRecommendations = [
    {
      id: 'NRT1',
      testRoute: 'NRT1',
      title: 'Numerical Reasoning Test 1',
      category: 'Cognitive',
      difficulty: 'Intermediate',
      duration: 20,
      description: 'Improve your numerical analysis and problem-solving skills',
      currentScore: 45,
      targetScore: 75,
      priority: 'high',
      status: 'not_taken',
      skillsImproved: ['Mathematical Analysis', 'Data Interpretation', 'Problem Solving'],
      estimatedImprovement: '+30 points'
    },
    {
      id: 'SRT1',
      testRoute: 'SRT1',
      title: 'Spatial Reasoning Test 1',
      category: 'Cognitive',
      difficulty: 'Intermediate',
      duration: 20,
      description: 'Enhance your spatial visualization and pattern recognition',
      currentScore: 0,
      targetScore: 70,
      priority: 'high',
      status: 'not_taken',
      skillsImproved: ['Spatial Visualization', 'Pattern Recognition', '3D Thinking'],
      estimatedImprovement: '+70 points'
    },
    {
      id: 'VRT1',
      testRoute: 'VRT1',
      title: 'Verbal Reasoning Test 1',
      category: 'Cognitive',
      difficulty: 'Intermediate',
      duration: 20,
      description: 'Improve your verbal comprehension and reasoning skills',
      currentScore: 55,
      targetScore: 80,
      priority: 'medium',
      status: 'retake_recommended',
      skillsImproved: ['Reading Comprehension', 'Critical Thinking', 'Language Skills'],
      estimatedImprovement: '+25 points'
    },
    {
      id: 'VRT2',
      testRoute: 'VRT2',
      title: 'Verbal Reasoning Test 2',
      category: 'Cognitive',
      difficulty: 'Advanced',
      duration: 20,
      description: 'Advanced verbal reasoning with complex passages',
      currentScore: 0,
      targetScore: 85,
      priority: 'medium',
      status: 'not_taken',
      skillsImproved: ['Advanced Comprehension', 'Critical Analysis', 'Vocabulary'],
      estimatedImprovement: '+85 points'
    },
    {
      id: 'SJT1',
      testRoute: 'SJT1',
      title: 'Situational Judgment Test',
      category: 'Behavioral',
      difficulty: 'Beginner',
      duration: 20,
      description: 'Assess your decision-making in workplace scenarios',
      currentScore: 0,
      targetScore: 75,
      priority: 'low',
      status: 'not_taken',
      skillsImproved: ['Decision Making', 'Leadership', 'Communication'],
      estimatedImprovement: '+75 points'
    },
    {
      id: 'DRT1',
      testRoute: 'DRT1',
      title: 'Diagrammatic Reasoning Test 1',
      category: 'Cognitive',
      difficulty: 'Intermediate',
      duration: 20,
      description: 'Test your logical thinking with diagrams and flowcharts',
      currentScore: 30,
      targetScore: 70,
      priority: 'medium',
      status: 'retake_recommended',
      skillsImproved: ['Logical Thinking', 'Pattern Analysis', 'Process Understanding'],
      estimatedImprovement: '+40 points'
    }
  ];

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setRecommendedTests(mockTestRecommendations);
        setLoading(false);
      }, 500);
    }
  }, [isOpen]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDifficultyIcon = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return <StarIcon className="w-4 h-4 text-green-500" />;
      case 'Intermediate': return <StarSolidIcon className="w-4 h-4 text-yellow-500" />;
      case 'Advanced': return <StarSolidIcon className="w-4 h-4 text-red-500" />;
      default: return <StarIcon className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'not_taken': return <AcademicCapIcon className="w-5 h-5 text-blue-500" />;
      case 'retake_recommended': return <ExclamationTriangleIcon className="w-5 h-5 text-orange-500" />;
      default: return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <TrophyIcon className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">Improve Your Skills</h2>
                <p className="text-blue-100">Recommended tests to boost your employability score</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <span className="ml-4 text-gray-600">Loading recommendations...</span>
            </div>
          ) : (
            <div className="space-y-4">
              {recommendedTests.map((test) => (
                <div
                  key={test.id}
                  className="border border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-lg transition-all duration-200 cursor-pointer group"
                  onClick={() => {
                    onClose();
                    if (onNavigateToTest) {
                      onNavigateToTest(test.testRoute);
                    } else if (onStartTest) {
                      onStartTest(test);
                    }
                  }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                        {getStatusIcon(test.status)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{test.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(test.priority)}`}>
                            {test.priority.toUpperCase()} PRIORITY
                          </span>
                        </div>
                        <p className="text-gray-600 mb-3">{test.description}</p>
                        
                        {/* Test Details */}
                        <div className="flex items-center space-x-6 text-sm text-gray-500 mb-3">
                          <div className="flex items-center space-x-1">
                            <ChartBarIcon className="w-4 h-4" />
                            <span>{test.category}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            {getDifficultyIcon(test.difficulty)}
                            <span>{test.difficulty}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <ClockIcon className="w-4 h-4" />
                            <span>{test.duration} min</span>
                          </div>
                        </div>

                        {/* Skills Improved */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {test.skillsImproved.map((skill, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-md font-medium"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Score Progress */}
                    <div className="text-right min-w-[120px]">
                      <div className="text-sm text-gray-500 mb-1">Current → Target</div>
                      <div className="text-lg font-bold text-gray-900 mb-1">
                        {test.currentScore}% → {test.targetScore}%
                      </div>
                      <div className="text-sm font-medium text-green-600">
                        {test.estimatedImprovement}
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(test.currentScore / test.targetScore) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="text-sm text-gray-500">
                      {test.status === 'retake_recommended' ? 'Retake recommended' : 'Not taken yet'}
                    </div>
                    <button
                      className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors group-hover:bg-blue-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                        if (onNavigateToTest) {
                          onNavigateToTest(test.testRoute);
                        } else if (onStartTest) {
                          onStartTest(test);
                        }
                      }}
                    >
                      <PlayIcon className="w-4 h-4" />
                      <span>{test.status === 'retake_recommended' ? 'Retake Test' : 'Start Test'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Complete these tests to improve your employability score by up to 50 points
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestRecommendationsModal;
