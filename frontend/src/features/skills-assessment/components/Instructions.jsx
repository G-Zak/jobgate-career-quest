import React from 'react';
import { useTranslation } from 'react-i18next';

const Instructions = ({ onStart }) => {
  const { t } = useTranslation();
  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="p-8 rounded-lg shadow-md border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100 transition-colors">{t('numericalReasoningTests')}: NRT1</h2>
        <p className="mb-4 text-gray-700 dark:text-gray-300 transition-colors">
          {t('testDescription')}
        </p>

        <p className="text-md font-semibold mb-2 text-gray-800 dark:text-gray-100 transition-colors">{t('instructionsTitle')}</p>
        <ul className="list-disc list-inside mb-4 space-y-1 text-gray-700 dark:text-gray-300 transition-colors">
          <li>{t('noInterruptions')}</li>
          <li>{t('readInstructionsCarefully')}</li>
          <li>{t('ensureStableConnection')}</li>
          <li>{t('allowSufficientTime')}</li>
          <li>
            {t('oneAttemptOnly')}
          </li>
        </ul>

        <p className="mb-8 text-gray-700 dark:text-gray-300 transition-colors" dangerouslySetInnerHTML={{ __html: t('testDuration') }}>
        </p>

        <div className="text-right">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg text-lg transition"
            onClick={onStart}
          >
            {t('startTest')} →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Instructions;
