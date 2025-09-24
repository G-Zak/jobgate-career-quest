import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PlayIcon,
  ChartBarIcon,
  UserIcon,
  CogIcon,
  ArrowRightIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import dashboardApi from '../services/dashboardApi';

const QuickActions = ({ onNavigateToSection }) => {
  const navigate = useNavigate();
  const [selectedAction, setSelectedAction] = useState(null);
  const [quickStats, setQuickStats] = useState({
    testsAvailable: 0,
    categoriesCount: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuickStats = async () => {
      try {
        // Fetch available tests and categories count
        const [testStats] = await Promise.all([
          dashboardApi.getTestStatistics().catch(() => ({ totalTests: 0 }))
        ]);

        setQuickStats({
          testsAvailable: 12, // Default available tests
          categoriesCount: 8   // Default categories
        });
      } catch (error) {
        console.error('Error fetching quick stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuickStats();
  }, []);

  const handleActionClick = (action) => {
    setSelectedAction(action.id);

    // Add slight delay for visual feedback
    setTimeout(() => {
      if (action.route) {
        navigate(action.route);
      } else if (action.onClick) {
        action.onClick();
      }
      setSelectedAction(null);
    }, 150);
  };


  const actions = [
    {
      id: 'take-test',
      title: 'Take New Assessment',
      description: 'Start a new skills assessment',
      icon: PlayIcon,
      color: 'bg-blue-600 hover:bg-blue-700 text-white',
      activeColor: 'bg-blue-800',
      route: '/skills-assessment',
      primary: true
    },
    {
      id: 'view-tests',
      title: 'View Test History',
      description: 'See your completed tests',
      icon: ChartBarIcon,
      color: 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900',
      activeColor: 'bg-gray-300',
      route: '/test-history',
      primary: false
    },
    {
      id: 'browse-jobs',
      title: 'Browse Jobs',
      description: 'Find job opportunities',
      icon: BriefcaseIcon,
      color: 'bg-green-100 hover:bg-green-200 text-green-700 hover:text-green-900',
      activeColor: 'bg-green-300',
      route: '/jobs',
      primary: false

    },
    {
      id: 'update-profile',
      title: 'Update Profile',
      description: 'Complete your profile',
      icon: UserIcon,
      color: 'bg-purple-100 hover:bg-purple-200 text-purple-700 hover:text-purple-900',
      activeColor: 'bg-purple-300',
      route: '/profile',
      primary: false
    },
    {
      id: 'view-recommendations',
      title: 'Job Recommendations',
      description: 'View personalized matches',
      icon: DocumentTextIcon,
      color: 'bg-orange-100 hover:bg-orange-200 text-orange-700 hover:text-orange-900',
      activeColor: 'bg-orange-300',
      route: '/job-recommendations',
      primary: false

    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 bg-blue-100 rounded-lg">
          <ArrowRightIcon className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          <p className="text-sm text-gray-500">Common tasks and shortcuts</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        {actions.map((action) => {
          const IconComponent = action.icon;
          const isSelected = selectedAction === action.id;
          const buttonClasses = isSelected
            ? `w-full ${action.activeColor} px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-3 transform scale-95 shadow-inner`
            : `w-full ${action.color} px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-3 hover:transform hover:scale-[1.02] hover:shadow-md active:scale-95`;

          return (
            <button
              key={action.id}
              onClick={() => handleActionClick(action)}
              className={buttonClasses}
              disabled={isSelected}
            >
              <div className={`p-1 rounded ${action.primary ? 'bg-white/20' : 'bg-current/10'}`}>
                <IconComponent className="w-5 h-5" />
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold">{action.title}</div>
                <div className={`text-xs ${action.primary ? 'text-white/80' : 'opacity-75'}`}>
                  {action.description}
                </div>
              </div>
              <ArrowRightIcon className={`w-4 h-4 transition-transform duration-200 ${isSelected ? 'rotate-90' : 'group-hover:translate-x-1'} ${action.primary ? 'text-white/60' : 'opacity-50'}`} />

            </button>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="text-lg font-bold text-blue-600">
              {loading ? '...' : quickStats.testsAvailable}
            </div>
            <div className="text-xs text-blue-700 font-medium">Tests Available</div>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <div className="text-lg font-bold text-green-600">
              {loading ? '...' : quickStats.categoriesCount}
            </div>
            <div className="text-xs text-green-700 font-medium">Categories</div>

          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-gray-900 mb-2">Quick Tips</h4>
        <div className="space-y-1 text-xs text-gray-600">
          <p>• Take tests regularly to track your progress</p>
          <p>• Focus on areas that need improvement</p>
          <p>• Review your results to identify strengths</p>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;
