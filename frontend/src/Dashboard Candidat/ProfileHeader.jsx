import React from 'react';

const ProfileHeader = ({ user }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
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
          <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
          <p className="text-sm text-gray-600 mb-3">Level {user.level} Career Explorer</p>
          
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">Career Progress</span>
              <span className="text-sm font-semibold text-blue-600">{user.overallScore}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
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
                className="bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full font-medium border border-blue-200"
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