import React from 'react';
import { useTranslation } from 'react-i18next';

const ProfileHeader = ({ user }) => {
  const { t } = useTranslation();
  return (
    <div className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl shadow-sm border p-6 transition-colors duration-300">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
            {user.name.charAt(0)}
          </div>
          <div className="absolute -bottom-1 -right-1 bg-purple-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
            {t('level')} {user.level}
          </div>
        </div>
        
        <div className="flex-1">
          <h2 className="text-gray-900 dark:text-gray-100 text-xl font-bold transition-colors">{user.name}</h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 transition-colors">{t('level')} {user.level} {t('careerExplorer')}</p>
          
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-gray-700 dark:text-gray-300 text-sm font-medium transition-colors">{t('careerProgress')}</span>
              <span className="text-sm font-semibold text-blue-600">{user.overallScore}%</span>
            </div>
            <div className="bg-gray-200 dark:bg-gray-700 w-full rounded-full h-2 transition-colors">
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
                className="bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200 border-blue-200 dark:border-blue-700 text-xs px-3 py-1 rounded-full font-medium border transition-colors"
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