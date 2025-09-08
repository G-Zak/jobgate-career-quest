import React from 'react';
import { useTranslation } from 'react-i18next';

const TestTimeline = ({ tests }) => {
  const { t } = useTranslation();
  return (
    <div className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl shadow-sm border p-6 transition-colors duration-300">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-gray-900 dark:text-gray-100 text-xl font-bold transition-colors">{t('testHistory')}</h2>
        <a href="#" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium transition-colors">
          {t('viewAllTests')} →
        </a>
      </div>
      
      <div className="space-y-4">
        {tests.map((test, index) => (
          <div key={index} className="bg-gray-50 dark:bg-gray-700 flex items-center space-x-4 p-4 rounded-lg transition-colors">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {test.test_type.charAt(0)}
            </div>
            
            <div className="flex-1">
              <h3 className="text-gray-900 dark:text-gray-100 font-semibold transition-colors">{test.test_type} {t('assessment')}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm transition-colors">{new Date(test.date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</p>
            </div>
            
            <div className="text-right">
              <div className={`text-lg font-bold ${
                test.score >= 80 ? 'text-green-600' : 
                test.score >= 60 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {test.score}%
              </div>
              <div className="bg-gray-200 dark:bg-gray-600 w-16 h-2 rounded-full transition-colors">
                <div 
                  className={`h-2 rounded-full ${
                    test.score >= 80 ? 'bg-green-500' : 
                    test.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${test.score}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestTimeline;