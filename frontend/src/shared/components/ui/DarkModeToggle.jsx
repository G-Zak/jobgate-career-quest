import React from 'react';
import { useDarkMode } from '../../contexts/DarkModeContext';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

const DarkModeToggle = ({ className = "" }) => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <button
      onClick={toggleDarkMode}
      className={`relative inline-flex items-center justify-center w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 ${
        isDarkMode 
          ? 'bg-blue-600 hover:bg-blue-700' 
          : 'bg-gray-300 hover:bg-gray-400'
      } ${className}`}
      aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
    >
      <span
        className={`absolute left-1 inline-block w-4 h-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${
          isDarkMode ? 'translate-x-6' : 'translate-x-0'
        }`}
      />
      <span className="sr-only">
        {isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      </span>
      
      {/* Icons */}
      <SunIcon 
        className={`absolute left-1 w-3 h-3 text-yellow-500 transition-opacity duration-200 ${
          isDarkMode ? 'opacity-0' : 'opacity-100'
        }`}
      />
      <MoonIcon 
        className={`absolute right-1 w-3 h-3 text-blue-200 transition-opacity duration-200 ${
          isDarkMode ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </button>
  );
};

export default DarkModeToggle;
