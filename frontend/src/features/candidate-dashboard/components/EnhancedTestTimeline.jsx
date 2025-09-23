import React, { useState } from 'react';
import { 
  ClockIcon, 
  TrophyIcon, 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon,
  MinusIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  StarIcon,
  FireIcon
} from '@heroicons/react/24/outline';

const EnhancedTestTimeline = () => {
  const [filter, setFilter] = useState('all');

  const timelineData = [
    {
      id: 1,
      type: 'test_completed',
      title: 'Technical Skills Assessment',
      date: '2 hours ago',
      score: 88,
      previousScore: 85,
      category: 'Technical',
      icon: '💻',
      milestone: 'Reached Technical Excellence',
      description: 'Achieved 85+ score in Technical Skills for the first time',
      impact: '+3 points to overall employability score'
    },
    {
      id: 2,
      type: 'milestone_reached',
      title: 'Employability Score Milestone',
      date: '1 day ago',
      score: 72,
      previousScore: 68,
      category: 'Overall',
      icon: '🏆',
      milestone: 'Reached 70+ Employability Score',
      description: 'Crossed the 70-point threshold for Software Engineer profile',
      impact: 'Unlocked 3 new job recommendations'
    },
    {
      id: 3,
      type: 'skill_improvement',
      title: 'Logical Reasoning Test',
      date: '3 days ago',
      score: 78,
      previousScore: 75,
      category: 'Logical',
      icon: '🧩',
      milestone: 'Logical Reasoning Improved',
      description: 'Improved by 3 points, now above 75% of candidates',
      impact: '+2 points to overall employability score'
    },
    {
      id: 4,
      type: 'test_completed',
      title: 'Numerical Reasoning Test',
      date: '1 week ago',
      score: 85,
      previousScore: 82,
      category: 'Numerical',
      icon: '🧮',
      milestone: 'Numerical Excellence',
      description: 'Maintained high performance in numerical reasoning',
      impact: '+1 point to overall employability score'
    },
    {
      id: 5,
      type: 'skill_improvement',
      title: 'Situational Judgment Test',
      date: '2 weeks ago',
      score: 82,
      previousScore: 79,
      category: 'Situational',
      icon: '⚖️',
      milestone: 'Situational Judgment Breakthrough',
      description: 'Improved workplace decision-making skills significantly',
      impact: '+2 points to overall employability score'
    },
    {
      id: 6,
      type: 'test_completed',
      title: 'Verbal Reasoning Test',
      date: '3 weeks ago',
      score: 72,
      previousScore: 68,
      category: 'Verbal',
      icon: '📖',
      milestone: 'Verbal Skills Enhanced',
      description: 'Improved reading comprehension and language skills',
      impact: '+1 point to overall employability score'
    },
    {
      id: 7,
      type: 'milestone_reached',
      title: 'First Assessment Complete',
      date: '1 month ago',
      score: 68,
      previousScore: 0,
      category: 'Overall',
      icon: '🎯',
      milestone: 'Assessment Journey Started',
      description: 'Completed your first comprehensive skills assessment',
      impact: 'Baseline employability score established'
    }
  ];

  const filters = [
    { id: 'all', label: 'All Activities', count: timelineData.length },
    { id: 'milestone_reached', label: 'Milestones', count: timelineData.filter(item => item.type === 'milestone_reached').length },
    { id: 'test_completed', label: 'Tests', count: timelineData.filter(item => item.type === 'test_completed').length },
    { id: 'skill_improvement', label: 'Improvements', count: timelineData.filter(item => item.type === 'skill_improvement').length }
  ];

  const filteredData = filter === 'all' 
    ? timelineData 
    : timelineData.filter(item => item.type === filter);

  const getScoreChange = (current, previous) => {
    return current - previous;
  };

  const getScoreChangeIcon = (change) => {
    if (change > 0) return <ArrowTrendingUpIcon className="w-4 h-4 text-green-600" />;
    if (change < 0) return <ArrowTrendingDownIcon className="w-4 h-4 text-red-600" />;
    return <MinusIcon className="w-4 h-4 text-gray-400" />;
  };

  const getScoreChangeColor = (change) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-500';
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'milestone_reached': return <TrophyIcon className="w-5 h-5 text-yellow-600" />;
      case 'test_completed': return <CheckCircleIcon className="w-5 h-5 text-blue-600" />;
      case 'skill_improvement': return <ArrowTrendingUpIcon className="w-5 h-5 text-green-600" />;
      default: return <ClockIcon className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'milestone_reached': return 'bg-yellow-50 border-yellow-200';
      case 'test_completed': return 'bg-blue-50 border-blue-200';
      case 'skill_improvement': return 'bg-green-50 border-green-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <ClockIcon className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Test Timeline & Milestones</h2>
            <p className="text-sm text-gray-500">Your assessment journey and achievements</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex space-x-2 mb-6">
        {filters.map((filterItem) => (
          <button
            key={filterItem.id}
            onClick={() => setFilter(filterItem.id)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              filter === filterItem.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {filterItem.label} ({filterItem.count})
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        {filteredData.map((item, index) => {
          const scoreChange = getScoreChange(item.score, item.previousScore);
          
          return (
            <div key={item.id} className="relative">
              {/* Timeline Line */}
              {index < filteredData.length - 1 && (
                <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-200"></div>
              )}
              
              <div className={`p-4 rounded-lg border-2 ${getTypeColor(item.type)}`}>
                <div className="flex items-start space-x-4">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center">
                      {getTypeIcon(item.type)}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                          <span className="text-2xl">{item.icon}</span>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                          <span>{item.date}</span>
                          <span>•</span>
                          <span>{item.category}</span>
                          {item.score > 0 && (
                            <>
                              <span>•</span>
                              <span className="font-medium">Score: {item.score}</span>
                            </>
                          )}
                        </div>
                        
                        <div className="mb-3">
                          <div className="flex items-center space-x-2 mb-1">
                            <StarIcon className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm font-medium text-gray-700">{item.milestone}</span>
                          </div>
                          <p className="text-sm text-gray-600">{item.description}</p>
                        </div>
                        
                        {/* Impact */}
                        <div className="flex items-center space-x-2 text-sm">
                          <FireIcon className="w-4 h-4 text-orange-500" />
                          <span className="text-gray-600">Impact:</span>
                          <span className="font-medium text-gray-900">{item.impact}</span>
                        </div>
                      </div>
                      
                      {/* Score Change */}
                      {scoreChange !== 0 && (
                        <div className="flex items-center space-x-1">
                          {getScoreChangeIcon(scoreChange)}
                          <span className={`text-sm font-medium ${getScoreChangeColor(scoreChange)}`}>
                            {scoreChange > 0 ? '+' : ''}{scoreChange}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-gray-900">{timelineData.length}</div>
            <div className="text-sm text-gray-500">Total Activities</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {timelineData.filter(item => item.type === 'milestone_reached').length}
            </div>
            <div className="text-sm text-gray-500">Milestones</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {timelineData.filter(item => item.type === 'test_completed').length}
            </div>
            <div className="text-sm text-gray-500">Tests Completed</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {timelineData.reduce((sum, item) => sum + getScoreChange(item.score, item.previousScore), 0)}
            </div>
            <div className="text-sm text-gray-500">Total Improvement</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3 mt-6 pt-4 border-t border-gray-200">
        <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          View Full Timeline
        </button>
        <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          Export Report
        </button>
      </div>
    </div>
  );
};

export default EnhancedTestTimeline;
