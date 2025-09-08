import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import jobgateLogo from '../../../assets/images/ui/JOBGATE LOGO.png';

const HeaderBar = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleBackToDashboard = () => {
    // Navigate back to dashboard - you can customize this based on your routing setup
    window.history.back();
  };

  return (
    <div className="header-bar h-16 border-b px-12 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <div className="header-content h-full flex items-center justify-between max-w-screen-2xl mx-auto">
        {/* Logo */}
        <div className="logo-container flex items-center">
          <img 
            src={jobgateLogo} 
            alt="Jobgate" 
            className="logo-image h-8"
          />
        </div>
        
        {/* Center Navigation */}
        <nav className="main-navigation flex items-center space-x-8">
          <button 
            onClick={handleBackToDashboard}
            className="nav-button text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors pb-1"
          >
            {t('dashboard')}
          </button>
          
          <span className="nav-button text-base font-medium text-blue-500 border-b-2 border-blue-500 pb-1">
            {t('skillsAssessment')}
          </span>
        </nav>

        {/* Right Avatar */}
        <div className="user-avatar w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full transition-colors"></div>
      </div>
    </div>
  );
};

export default HeaderBar;
