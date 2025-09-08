import React from 'react';
import { useTranslation } from 'react-i18next';

const TestHeader = ({ currentQuestion, totalQuestions, timer, onAbort }) => {
  const { t } = useTranslation();
  const formatTime = (t) => {
    const m = Math.floor(t / 60);
    const s = t % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const progress = Math.floor((currentQuestion / totalQuestions) * 100);

  return (
    <header className="w-full border-b shadow-sm px-6 py-4 mb-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Question Info */}
        <div>
          <p className="text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400 transition-colors">{t('question')}</p>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 transition-colors">
            {String(currentQuestion).padStart(2, '0')}
            <span className="text-gray-400 dark:text-gray-500 transition-colors">/{totalQuestions}</span>
          </h1>
        </div>

        {/* Timer + Buttons */}
        <div className="flex items-center gap-4">
          <span className="text-blue-600 font-medium text-lg">
            ⏱️ {formatTime(timer)}
          </span>
          <button className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t('help')}</button>
          <button
            className="text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 font-medium transition-colors"
            onClick={onAbort}
          >
            {t('submit')}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-4 transition-colors">
        <div
          className="h-full bg-blue-600 rounded-full transition-all"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </header>
  );
};

export default TestHeader;
