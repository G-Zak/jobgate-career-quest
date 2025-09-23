import React, { useState, useEffect } from 'react';
import { 
  ChartBarIcon, 
  ArrowTrendingUpIcon, 
  UserGroupIcon,
  ChevronDownIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import dashboardApi from '../services/dashboardApi';

const EmployabilityScore = () => {
  const [selectedProfile, setSelectedProfile] = useState('Software Engineer');
  const [employabilityScore, setEmployabilityScore] = useState(72);
  const [previousScore, setPreviousScore] = useState(68);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scoreData, setScoreData] = useState(null);

  const profiles = [
    'Software Engineer',
    'Data Scientist',
    'Product Manager',
    'UX Designer',
    'DevOps Engineer',
    'Financial Analyst',
    'Mechanical Engineer',
    'Marketing Manager'
  ];

  // Fetch employability score data
  useEffect(() => {
    const fetchScoreData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await dashboardApi.getEmployabilityScore();
        setScoreData(data);
        setEmployabilityScore(data.overallScore);
        setPreviousScore(Math.max(0, data.overallScore - (data.improvement || 0)));
      } catch (err) {
        console.error('Error fetching employability score:', err);
        setError('Failed to load employability score');
        // Keep default values on error
      } finally {
        setLoading(false);
      }
    };

    fetchScoreData();
  }, []);

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

  const getScoreLabel = (score) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Very Good';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Average';
    return 'Needs Improvement';
  };

  const scoreChange = employabilityScore - previousScore;
  const isImproving = scoreChange > 0;

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
              <div>
                <div className="h-6 w-48 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 w-32 bg-gray-200 rounded"></div>
              </div>
            </div>
            <div className="h-10 w-32 bg-gray-200 rounded-lg"></div>
          </div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
              <div className="space-y-2">
                <div className="h-6 w-32 bg-gray-200 rounded"></div>
                <div className="h-4 w-48 bg-gray-200 rounded"></div>
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-16 w-16 bg-gray-200 rounded"></div>
              <div className="h-16 w-16 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="text-center py-8">
          <ExclamationTriangleIcon className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to Load Score</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <ChartBarIcon className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Employability Score</h2>
            <p className="text-sm text-gray-500">Your career readiness assessment</p>
          </div>
        </div>
        
        {/* Profile Selector */}
        <div className="relative">
          <button
            onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
          >
            <span className="text-sm font-medium text-gray-700">{selectedProfile}</span>
            <ChevronDownIcon className="w-4 h-4 text-gray-500" />
          </button>
          
          {isProfileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
              {profiles.map((profile) => (
                <button
                  key={profile}
                  onClick={() => {
                    setSelectedProfile(profile);
                    setIsProfileDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                    selectedProfile === profile ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                  }`}
                >
                  {profile}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Score Display */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-6">
          {/* Circular Score */}
          <div className="relative">
            <div className="w-24 h-24 rounded-full border-8 border-gray-200 flex items-center justify-center">
              <div className="text-center">
                <div className={`text-3xl font-bold ${getScoreColor(employabilityScore)}`}>
                  {employabilityScore}
                </div>
                <div className="text-xs text-gray-500">/ 100</div>
              </div>
            </div>
            {/* Progress Ring */}
            <svg className="absolute inset-0 w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeDasharray={`${(employabilityScore / 100) * 251.2} 251.2`}
                className={getScoreColor(employabilityScore).replace('text-', 'stroke-')}
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Score Details */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              {getScoreIcon(employabilityScore)}
              <span className={`text-lg font-semibold ${getScoreColor(employabilityScore)}`}>
                {getScoreLabel(employabilityScore)}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              Your employability as a <span className="font-medium">{selectedProfile}</span> is {employabilityScore}/100
            </p>
            
            {/* Score Change */}
            <div className="flex items-center space-x-2">
              <ArrowTrendingUpIcon className={`w-4 h-4 ${isImproving ? 'text-green-600' : 'text-red-600'}`} />
              <span className={`text-sm font-medium ${isImproving ? 'text-green-600' : 'text-red-600'}`}>
                {isImproving ? '+' : ''}{scoreChange} points
              </span>
              <span className="text-xs text-gray-500">from last month</span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {loading ? '...' : `${Math.round((employabilityScore / 75) * 100)}%`}
            </div>
            <div className="text-xs text-gray-500">vs. Average</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {loading ? '...' : scoreData?.testsCompleted || 0}
            </div>
            <div className="text-xs text-gray-500">Tests Taken</div>
          </div>
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Score Breakdown</h3>
        
        <div className="grid grid-cols-2 gap-4">
          {/* Strengths */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-green-700 flex items-center">
              <CheckCircleIcon className="w-4 h-4 mr-2" />
              Strengths
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Technical Skills</span>
                <span className="text-sm font-medium text-green-600">85</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Logical Reasoning</span>
                <span className="text-sm font-medium text-green-600">78</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Problem Solving</span>
                <span className="text-sm font-medium text-green-600">82</span>
              </div>
            </div>
          </div>

          {/* Areas for Improvement */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-red-700 flex items-center">
              <ExclamationTriangleIcon className="w-4 h-4 mr-2" />
              Areas for Improvement
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Communication</span>
                <span className="text-sm font-medium text-red-600">45</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Leadership</span>
                <span className="text-sm font-medium text-red-600">52</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Teamwork</span>
                <span className="text-sm font-medium text-yellow-600">65</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3 mt-6 pt-4 border-t border-gray-200">
        <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          View Detailed Report
        </button>
        <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          Improve Score
        </button>
      </div>
    </div>
  );
};

export default EmployabilityScore;
