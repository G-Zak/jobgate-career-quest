import React, { useState } from 'react';
import { 
  UserGroupIcon, 
  TrendingUpIcon, 
  TrendingDownIcon,
  MinusIcon,
  ChevronRightIcon,
  LightBulbIcon,
  BookOpenIcon,
  PlayIcon
} from '@heroicons/react/24/outline';

const Benchmarks = () => {
  const [activeTab, setActiveTab] = useState('comparison');

  const benchmarkData = [
    {
      category: 'Technical Skills',
      yourScore: 88,
      averageScore: 72,
      topPercentile: 95,
      improvement: '+5',
      status: 'excellent'
    },
    {
      category: 'Logical Reasoning',
      yourScore: 78,
      averageScore: 65,
      topPercentile: 85,
      improvement: '+3',
      status: 'good'
    },
    {
      category: 'Numerical Reasoning',
      yourScore: 85,
      averageScore: 70,
      topPercentile: 90,
      improvement: '+2',
      status: 'excellent'
    },
    {
      category: 'Verbal Reasoning',
      yourScore: 72,
      averageScore: 68,
      topPercentile: 75,
      improvement: '+4',
      status: 'good'
    },
    {
      category: 'Situational Judgment',
      yourScore: 82,
      averageScore: 75,
      topPercentile: 88,
      improvement: '+3',
      status: 'good'
    },
    {
      category: 'Abstract Reasoning',
      yourScore: 65,
      averageScore: 62,
      topPercentile: 70,
      improvement: '+3',
      status: 'average'
    },
    {
      category: 'Diagrammatic Reasoning',
      yourScore: 70,
      averageScore: 68,
      topPercentile: 78,
      improvement: '+2',
      status: 'good'
    },
    {
      category: 'Spatial Reasoning',
      yourScore: 58,
      averageScore: 65,
      topPercentile: 80,
      improvement: '+3',
      status: 'needs-improvement'
    }
  ];

  const recommendations = [
    {
      skill: 'Spatial Reasoning',
      priority: 'High',
      description: 'Focus on 3D visualization exercises and mental rotation practice',
      resources: [
        { name: '3D Visualization Course', type: 'Course', duration: '2 weeks' },
        { name: 'Spatial Reasoning Practice Tests', type: 'Practice', duration: '1 week' },
        { name: 'Mental Rotation Exercises', type: 'Exercise', duration: 'Daily' }
      ]
    },
    {
      skill: 'Abstract Reasoning',
      priority: 'Medium',
      description: 'Improve pattern recognition and abstract thinking skills',
      resources: [
        { name: 'Pattern Recognition Workshop', type: 'Workshop', duration: '3 days' },
        { name: 'Abstract Reasoning Tests', type: 'Practice', duration: '2 weeks' },
        { name: 'Logic Puzzles Collection', type: 'Exercise', duration: 'Ongoing' }
      ]
    },
    {
      skill: 'Communication Skills',
      priority: 'High',
      description: 'Enhance verbal and written communication abilities',
      resources: [
        { name: 'Communication Skills Course', type: 'Course', duration: '4 weeks' },
        { name: 'Presentation Skills Workshop', type: 'Workshop', duration: '2 days' },
        { name: 'Writing Practice Sessions', type: 'Practice', duration: 'Daily' }
      ]
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-50';
      case 'good': return 'text-blue-600 bg-blue-50';
      case 'average': return 'text-yellow-600 bg-yellow-50';
      case 'needs-improvement': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'excellent': return 'Excellent';
      case 'good': return 'Good';
      case 'average': return 'Average';
      case 'needs-improvement': return 'Needs Improvement';
      default: return 'Unknown';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'text-red-600 bg-red-50';
      case 'Medium': return 'text-yellow-600 bg-yellow-50';
      case 'Low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <UserGroupIcon className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Benchmarks</h2>
            <p className="text-sm text-gray-500">Compare your performance with other candidates</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('comparison')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'comparison'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Comparison
          </button>
          <button
            onClick={() => setActiveTab('recommendations')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'recommendations'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Recommendations
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'comparison' ? (
        <div className="space-y-4">
          {benchmarkData.map((item, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <h3 className="font-medium text-gray-900">{item.category}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                    {getStatusLabel(item.status)}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span>Top {item.topPercentile}%</span>
                </div>
              </div>

              {/* Comparison Bars */}
              <div className="space-y-2">
                {/* Your Score */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Your Score</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${item.yourScore}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900">{item.yourScore}</span>
                  </div>
                </div>

                {/* Average Score */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Average</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gray-400 h-2 rounded-full"
                        style={{ width: `${item.averageScore}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900">{item.averageScore}</span>
                  </div>
                </div>
              </div>

              {/* Improvement */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center space-x-2">
                  <TrendingUpIcon className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-600">Improvement</span>
                </div>
                <span className="text-sm font-medium text-green-600">{item.improvement} points</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {recommendations.map((rec, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-medium text-gray-900">{rec.skill}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(rec.priority)}`}>
                      {rec.priority} Priority
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{rec.description}</p>
                </div>
              </div>

              {/* Resources */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700 flex items-center">
                  <BookOpenIcon className="w-4 h-4 mr-2" />
                  Recommended Resources
                </h4>
                {rec.resources.map((resource, resIndex) => (
                  <div key={resIndex} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <PlayIcon className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-gray-700">{resource.name}</span>
                      <span className="text-xs text-gray-500">({resource.type})</span>
                    </div>
                    <span className="text-xs text-gray-500">{resource.duration}</span>
                  </div>
                ))}
              </div>

              <button className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Start Improvement Plan
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-3 mt-6 pt-4 border-t border-gray-200">
        <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          View Full Report
        </button>
        <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          Set Goals
        </button>
      </div>
    </div>
  );
};

export default Benchmarks;
