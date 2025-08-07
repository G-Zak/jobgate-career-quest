import React from 'react';

const ProfileHeader = ({ user, isDarkMode }) => {
  return (
    <div className={`rounded-xl shadow-sm border p-6 transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
            {user.name.charAt(0)}
          </div>
          <div className="absolute -bottom-1 -right-1 bg-purple-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
            Lvl {user.level}
          </div>
        </div>
        
        <div className="flex-1">
          <h2 className={`text-xl font-bold transition-colors ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>{user.name}</h2>
          <p className={`text-sm mb-3 transition-colors ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>Level {user.level} Career Explorer</p>
          
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <span className={`text-sm font-medium transition-colors ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>Career Progress</span>
              <span className="text-sm font-semibold text-blue-400">{user.overallScore}%</span>
            </div>
            <div className={`w-full rounded-full h-2 transition-colors ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
            }`}>
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${user.overallScore}%` }}
              ></div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {user.declaredSkills.map((skill, index) => (
              <span 
                key={index} 
                className={`text-xs px-3 py-1 rounded-full font-medium border transition-colors ${
                  isDarkMode 
                    ? 'bg-blue-900/30 text-blue-300 border-blue-700/50' 
                    : 'bg-blue-50 text-blue-700 border-blue-200'
                }`}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;