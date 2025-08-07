import React from 'react';

const BadgesGrid = ({ badges, isDarkMode }) => {
  const rarityColors = {
    gold: 'from-yellow-400 to-yellow-600',
    silver: 'from-gray-300 to-gray-500', 
    bronze: 'from-orange-400 to-orange-600'
  };

  return (
    <div className={`rounded-xl shadow-sm border p-6 transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-xl font-bold transition-colors ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>Achievements</h2>
        <div className={`text-sm transition-colors ${
          isDarkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          {badges.filter(b => b.earned).length} of {badges.length} earned
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {badges.map(badge => (
          <div 
            key={badge.id} 
            className={`relative p-4 rounded-lg border-2 transition-all duration-200 ${
              badge.earned 
                ? `${isDarkMode 
                    ? 'border-gray-600 bg-gradient-to-br from-gray-700 to-gray-800 hover:shadow-lg hover:border-gray-500' 
                    : 'border-gray-200 bg-gradient-to-br from-white to-gray-50 hover:shadow-md'
                  }` 
                : `${isDarkMode
                    ? 'border-gray-700 bg-gray-900 opacity-60'
                    : 'border-gray-100 bg-gray-50 opacity-60'
                  }`
            }`}
          >
            <div className="flex flex-col items-center text-center">
              <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${
                badge.earned ? rarityColors[badge.rarity] : 'from-gray-300 to-gray-400'
              } flex items-center justify-center mb-3 ${
                badge.earned ? 'shadow-lg' : ''
              }`}>
                <span className="text-white text-xl font-bold">
                  {badge.earned ? '🏅' : '🔒'}
                </span>
              </div>
              
              <h3 className={`font-semibold text-sm transition-colors ${
                badge.earned 
                  ? (isDarkMode ? 'text-white' : 'text-gray-900')
                  : (isDarkMode ? 'text-gray-500' : 'text-gray-500')
              }`}>
                {badge.name}
              </h3>
              
              {badge.earned && (
                <div className={`mt-2 px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                  badge.rarity === 'gold' 
                    ? (isDarkMode ? 'bg-yellow-900/30 text-yellow-300' : 'bg-yellow-100 text-yellow-800')
                    : badge.rarity === 'silver' 
                    ? (isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800')
                    : (isDarkMode ? 'bg-orange-900/30 text-orange-300' : 'bg-orange-100 text-orange-800')
                }`}>
                  {badge.rarity.charAt(0).toUpperCase() + badge.rarity.slice(1)}
                </div>
              )}
            </div>
            
            {!badge.earned && (
              <div className={`absolute inset-0 flex items-center justify-center rounded-lg transition-colors ${
                isDarkMode ? 'bg-gray-900 bg-opacity-80' : 'bg-gray-50 bg-opacity-80'
              }`}>
                <div className="text-center">
                  <div className="text-2xl mb-1">🔒</div>
                  <div className={`text-xs transition-colors ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>Locked</div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BadgesGrid;