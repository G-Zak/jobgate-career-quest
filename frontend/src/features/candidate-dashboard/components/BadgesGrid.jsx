import React from 'react';

const BadgesGrid = ({ badges }) => {
  const rarityColors = {
    gold: 'from-yellow-400 to-yellow-600',
    silver: 'from-gray-300 to-gray-500', 
    bronze: 'from-orange-400 to-orange-600'
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Achievements</h2>
        <div className="text-sm text-gray-500">
          {badges.filter(b => b.earned).length} of {badges.length} earned
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {badges.map(badge => (
          <div 
            key={badge.id} 
            className={`relative p-4 rounded-lg border-2 transition-all duration-200 ${
              badge.earned 
                ? 'border-gray-200 bg-gradient-to-br from-white to-gray-50 hover:shadow-md' 
                : 'border-gray-100 bg-gray-50 opacity-60'
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
              
              <h3 className={`font-semibold text-sm ${
                badge.earned ? 'text-gray-900' : 'text-gray-500'
              }`}>
                {badge.name}
              </h3>
              
              {badge.earned && (
                <div className={`mt-2 px-2 py-1 rounded-full text-xs font-medium ${
                  badge.rarity === 'gold' ? 'bg-yellow-100 text-yellow-800' :
                  badge.rarity === 'silver' ? 'bg-gray-100 text-gray-800' :
                  'bg-orange-100 text-orange-800'
                }`}>
                  {badge.rarity.charAt(0).toUpperCase() + badge.rarity.slice(1)}
                </div>
              )}
            </div>
            
            {!badge.earned && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-80 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl mb-1">🔒</div>
                  <div className="text-xs text-gray-500">Locked</div>
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