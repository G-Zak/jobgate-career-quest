import React from 'react';
import { 
  PlayIcon, 
  ChartBarIcon, 
  UserIcon,
  CogIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const QuickActions = ({ onNavigateToSection }) => {
  const actions = [
    {
      id: 'take-test',
      title: 'Take New Assessment',
      description: 'Start a new skills assessment',
      icon: PlayIcon,
      color: 'bg-blue-600 hover:bg-blue-700',
      onClick: () => {
        if (onNavigateToSection) {
          onNavigateToSection('skills-assessment');
        }
      }
    },
    {
      id: 'view-tests',
      title: 'View All Tests',
      description: 'See your test history',
      icon: ChartBarIcon,
      color: 'bg-gray-100 hover:bg-gray-200 text-gray-700',
      onClick: () => {
        if (onNavigateToSection) {
          onNavigateToSection('tests-history');
        }
      }
    },
    {
      id: 'update-profile',
      title: 'Update Profile',
      description: 'Manage your account',
      icon: UserIcon,
      color: 'bg-gray-100 hover:bg-gray-200 text-gray-700',
      onClick: () => {
        if (onNavigateToSection) {
          onNavigateToSection('profile');
        }
      }
    },
    {
      id: 'settings',
      title: 'Settings',
      description: 'App preferences',
      icon: CogIcon,
      color: 'bg-gray-100 hover:bg-gray-200 text-gray-700',
      onClick: () => {
        if (onNavigateToSection) {
          onNavigateToSection('settings');
        }
      }
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
          return (
            <button
              key={action.id}
              onClick={action.onClick}
              className={`w-full ${action.color} px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center space-x-3`}
            >
              <IconComponent className="w-5 h-5" />
              <div className="flex-1 text-left">
                <div className="font-medium">{action.title}</div>
                <div className="text-xs opacity-75">{action.description}</div>
              </div>
              <ArrowRightIcon className="w-4 h-4 opacity-50" />
            </button>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-gray-900">12</div>
            <div className="text-xs text-gray-500">Tests Available</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-900">8</div>
            <div className="text-xs text-gray-500">Categories</div>
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
