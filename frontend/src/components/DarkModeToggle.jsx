import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDarkMode } from '../contexts/DarkModeContext';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

const DarkModeToggle = ({ className = "" }) => {
  const { t } = useTranslation();
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <button
      onClick={toggleDarkMode}
      className={`
        relative inline-flex items-center justify-center
        w-10 h-10 rounded-lg
        bg-gray-100 hover:bg-gray-200 
        dark:bg-gray-800 dark:hover:bg-gray-700
        text-gray-600 dark:text-gray-300
        transition-all duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        dark:focus:ring-offset-gray-900
        ${className}
      `}
      aria-label={isDarkMode ? t('switchToLightMode') : t('switchToDarkMode')}
      title={isDarkMode ? t('switchToLightMode') : t('switchToDarkMode')}
    >
      <div className="relative w-5 h-5">
        {/* Sun Icon - visible in dark mode */}
        <SunIcon 
          className={`
            absolute inset-0 w-5 h-5 transition-all duration-300 ease-in-out
            ${isDarkMode ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-50'}
          `}
        />
        
        {/* Moon Icon - visible in light mode */}
        <MoonIcon 
          className={`
            absolute inset-0 w-5 h-5 transition-all duration-300 ease-in-out
            ${!isDarkMode ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-50'}
          `}
        />
      </div>
    </button>
  );
};

// Alternative toggle component with text
export const DarkModeToggleWithText = ({ className = "" }) => {
  const { t } = useTranslation();
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <button
      onClick={toggleDarkMode}
      className={`
        flex items-center space-x-3 px-4 py-2 rounded-lg
        bg-gray-100 hover:bg-gray-200 
        dark:bg-gray-800 dark:hover:bg-gray-700
        text-gray-700 dark:text-gray-300
        transition-all duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        dark:focus:ring-offset-gray-900
        ${className}
      `}
    >
      <div className="relative w-5 h-5">
        <SunIcon 
          className={`
            absolute inset-0 w-5 h-5 transition-all duration-300 ease-in-out
            ${isDarkMode ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-50'}
          `}
        />
        <MoonIcon 
          className={`
            absolute inset-0 w-5 h-5 transition-all duration-300 ease-in-out
            ${!isDarkMode ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-50'}
          `}
        />
      </div>
      <span className="text-sm font-medium">
        {isDarkMode ? t('lightMode') : t('darkMode')}
      </span>
    </button>
  );
};

// Switch-style toggle
export const DarkModeSwitch = ({ className = "" }) => {
  const { t } = useTranslation();
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <button
      onClick={toggleDarkMode}
      className={`
        relative inline-flex h-6 w-11 items-center rounded-full
        transition-colors duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        dark:focus:ring-offset-gray-900
        ${isDarkMode ? 'bg-blue-600' : 'bg-gray-200'}
        ${className}
      `}
      aria-label={t('toggleDarkMode')}
    >
      <span
        className={`
          inline-block h-4 w-4 transform rounded-full
          bg-white transition-transform duration-200 ease-in-out
          ${isDarkMode ? 'translate-x-6' : 'translate-x-1'}
        `}
      />
    </button>
  );
};

export default DarkModeToggle;
