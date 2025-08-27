import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDarkMode } from '../contexts/DarkModeContext';

const DarkModeTestComponent = () => {
  const { t } = useTranslation();
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-lg">
        <h3 className="text-gray-800 dark:text-gray-100 font-semibold mb-2">
          {t('darkModeTest')}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
          {t('currentMode')}: {isDarkMode ? t('dark') : t('light')}
        </p>
        <button
          onClick={toggleDarkMode}
          className="w-full bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm transition-colors"
        >
          {t('toggleTo')} {isDarkMode ? t('lightMode') : t('darkMode')}
        </button>
      </div>
    </div>
  );
};

export default DarkModeTestComponent;
