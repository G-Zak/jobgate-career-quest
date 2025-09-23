import React, { useState, useEffect } from 'react';
import { 
  TrophyIcon, 
  StarIcon, 
  BoltIcon,
  ChartBarIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import dashboardApi from '../services/dashboardApi';

const AchievementsBadges = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [achievements, setAchievements] = useState([]);

  // Fetch achievements data
  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await dashboardApi.getAchievements();
        setAchievements(data);
      } catch (err) {
        console.error('Error fetching achievements:', err);
        setError('Failed to load achievements');
        // Keep empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  const getAchievementIcon = (icon) => {
    const icons = {
      '🏆': TrophyIcon,
      '⚡': BoltIcon,
      '📈': ChartBarIcon,
      '⭐': StarIcon
    };
    return icons[icon] || TrophyIcon;
  };

  const getAchievementColor = (color) => {
    const colors = {
      'yellow': 'bg-yellow-50 border-yellow-200',
      'green': 'bg-green-50 border-green-200',
      'blue': 'bg-blue-50 border-blue-200',
      'purple': 'bg-purple-50 border-purple-200',
      'red': 'bg-red-50 border-red-200'
    };
    return colors[color] || 'bg-gray-50 border-gray-200';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 w-48 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 w-24 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center py-8">
          <ExclamationTriangleIcon className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to Load Achievements</h3>
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 bg-yellow-100 rounded-lg">
          <TrophyIcon className="w-6 h-6 text-yellow-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Recent Achievements</h3>
          <p className="text-sm text-gray-500">Your latest accomplishments</p>
        </div>
      </div>

      {/* Achievements List */}
      <div className="space-y-3">
        {achievements.length === 0 ? (
          <div className="text-center py-8">
            <TrophyIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Achievements Yet</h3>
            <p className="text-gray-600 mb-4">Complete tests and improve your scores to earn achievements</p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Start Taking Tests
            </button>
          </div>
        ) : (
          achievements.map((achievement) => {
            const IconComponent = getAchievementIcon(achievement.icon);
            return (
              <div
                key={achievement.id}
                className={`flex items-center space-x-3 p-3 rounded-lg border ${getAchievementColor(achievement.color)}`}
              >
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-lg">{achievement.icon}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{achievement.title}</p>
                  <p className="text-xs text-gray-600">{achievement.description}</p>
                </div>
                {achievement.earned && (
                  <div className="flex items-center space-x-1">
                    <StarIcon className="w-4 h-4 text-yellow-500" />
                    <span className="text-xs text-yellow-600 font-medium">Earned</span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Achievement Progress */}
      {achievements.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-900">Achievement Progress</span>
            <span className="text-sm text-gray-500">
              {achievements.filter(a => a.earned).length} / {achievements.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${(achievements.filter(a => a.earned).length / Math.max(achievements.length, 1)) * 100}%`
              }}
            ></div>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      {achievements.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-gray-900">
              {achievements.filter(a => a.earned).length}
            </div>
            <div className="text-xs text-gray-500">Earned</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-900">
              {achievements.length - achievements.filter(a => a.earned).length}
            </div>
            <div className="text-xs text-gray-500">Available</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AchievementsBadges;
