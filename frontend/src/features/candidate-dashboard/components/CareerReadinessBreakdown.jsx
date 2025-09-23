import React, { useState, useEffect } from 'react';
import { 
  ChartBarIcon, 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon,
  MinusIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import RadarChart from './RadarChart';

const CareerReadinessBreakdown = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Mock data for the 8 test categories
  const skillCategories = [
    {
      id: 'verbal',
      name: 'Verbal Reasoning',
      icon: '📖',
      score: 72,
      previousScore: 68,
      benchmark: 65,
      description: 'Reading comprehension, analogies, and language skills',
      color: 'blue'
    },
    {
      id: 'numerical',
      name: 'Numerical Reasoning',
      icon: '🧮',
      score: 85,
      previousScore: 82,
      benchmark: 70,
      description: 'Mathematical problem solving and data interpretation',
      color: 'green'
    },
    {
      id: 'logical',
      name: 'Logical Reasoning',
      icon: '🧩',
      score: 78,
      previousScore: 75,
      benchmark: 68,
      description: 'Pattern recognition and logical sequences',
      color: 'purple'
    },
    {
      id: 'abstract',
      name: 'Abstract Reasoning',
      icon: '🔮',
      score: 65,
      previousScore: 62,
      benchmark: 60,
      description: 'Non-verbal reasoning and abstract thinking',
      color: 'indigo'
    },
    {
      id: 'diagrammatic',
      name: 'Diagrammatic Reasoning',
      icon: '📊',
      score: 70,
      previousScore: 67,
      benchmark: 65,
      description: 'Flowchart analysis and process understanding',
      color: 'teal'
    },
    {
      id: 'spatial',
      name: 'Spatial Reasoning',
      icon: '🌐',
      score: 58,
      previousScore: 55,
      benchmark: 60,
      description: '3D visualization and mental rotation',
      color: 'orange'
    },
    {
      id: 'situational',
      name: 'Situational Judgment',
      icon: '⚖️',
      score: 82,
      previousScore: 79,
      benchmark: 75,
      description: 'Workplace scenarios and decision making',
      color: 'emerald'
    },
    {
      id: 'technical',
      name: 'Technical Skills',
      icon: '💻',
      score: 88,
      previousScore: 85,
      benchmark: 80,
      description: 'Programming concepts and system design',
      color: 'red'
    }
  ];

  const getScoreColor = (score, benchmark) => {
    if (score >= benchmark + 15) return 'text-green-600';
    if (score >= benchmark) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score, benchmark) => {
    if (score >= benchmark + 15) return 'bg-green-50 border-green-200';
    if (score >= benchmark) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  const getScoreIcon = (score, benchmark) => {
    if (score >= benchmark + 15) return <CheckCircleIcon className="w-4 h-4 text-green-600" />;
    if (score >= benchmark) return <ExclamationTriangleIcon className="w-4 h-4 text-yellow-600" />;
    return <XCircleIcon className="w-4 h-4 text-red-600" />;
  };

  const getTrendIcon = (current, previous) => {
    const change = current - previous;
    if (change > 0) return <ArrowTrendingUpIcon className="w-4 h-4 text-green-600" />;
    if (change < 0) return <ArrowTrendingDownIcon className="w-4 h-4 text-red-600" />;
    return <MinusIcon className="w-4 h-4 text-gray-400" />;
  };

  const getPerformanceLevel = (score, benchmark) => {
    if (score >= benchmark + 15) return 'Above 70% of candidates';
    if (score >= benchmark) return 'Above 50% of candidates';
    return 'Below 50% of candidates';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <ChartBarIcon className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Career Readiness Breakdown</h2>
            <p className="text-sm text-gray-500">Performance across all skill categories</p>
          </div>
        </div>
      </div>

      {/* Radar Chart */}
      <div className="mb-6">
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <RadarChart data={skillCategories} size={300} />
        </div>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {skillCategories.map((category) => {
          const change = category.score - category.previousScore;
          const isImproving = change > 0;
          
          return (
            <div
              key={category.id}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                selectedCategory === category.id 
                  ? 'border-blue-300 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
            >
              {/* Category Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{category.icon}</span>
                  <span className="text-sm font-medium text-gray-700">{category.name}</span>
                </div>
                {getScoreIcon(category.score, category.benchmark)}
              </div>

              {/* Score Display */}
              <div className="text-center mb-3">
                <div className={`text-2xl font-bold ${getScoreColor(category.score, category.benchmark)}`}>
                  {category.score}
                </div>
                <div className="text-xs text-gray-500">/ 100</div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    category.score >= category.benchmark + 15 ? 'bg-green-500' :
                    category.score >= category.benchmark ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(category.score, 100)}%` }}
                />
              </div>

              {/* Performance Info */}
              <div className="text-center">
                <div className="text-xs text-gray-600 mb-1">
                  {getPerformanceLevel(category.score, category.benchmark)}
                </div>
                
                {/* Trend */}
                <div className="flex items-center justify-center space-x-1">
                  {getTrendIcon(category.score, category.previousScore)}
                  <span className={`text-xs font-medium ${
                    isImproving ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-500'
                  }`}>
                    {isImproving ? '+' : ''}{change}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Category Details */}
      {selectedCategory && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          {(() => {
            const category = skillCategories.find(c => c.id === selectedCategory);
            return (
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-2xl">{category.icon}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                    <p className="text-sm text-gray-600">{category.description}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{category.score}</div>
                    <div className="text-xs text-gray-500">Current Score</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{category.benchmark}</div>
                    <div className="text-xs text-gray-500">Benchmark</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {category.score - category.previousScore > 0 ? '+' : ''}{category.score - category.previousScore}
                    </div>
                    <div className="text-xs text-gray-500">Change</div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-3 mt-6 pt-4 border-t border-gray-200">
        <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          View Detailed Analysis
        </button>
        <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          Improve Weak Areas
        </button>
      </div>
    </div>
  );
};

export default CareerReadinessBreakdown;
