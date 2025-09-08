import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const QuestionCard = ({ questionNumber, questionText, options, onSelect, onNext }) => {
  const { t } = useTranslation();
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionClick = (index) => {
    setSelectedOption(index);
    onSelect(options[index]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto border shadow-sm rounded-lg p-8 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300"
    >
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100 transition-colors">{t('question')} {questionNumber}</h2>
      <p className="mb-6 text-gray-700 dark:text-gray-300 transition-colors">{questionText || 'This is where the question text goes.'}</p>

      <div className="space-y-3 mb-6">
        {options?.map((opt, index) => (
          <button
            key={index}
            onClick={() => handleOptionClick(index)}
            className={`w-full text-left px-4 py-3 border rounded-lg transition-all duration-200
              ${selectedOption === index
                ? 'bg-blue-50 dark:bg-blue-900 border-blue-600 dark:border-blue-500 shadow-md scale-[1.02] text-blue-800 dark:text-blue-200'
                : 'border-gray-200 dark:border-gray-600 hover:border-blue-400 hover:scale-[1.01] bg-white dark:bg-gray-700'
              }
            `}
          >
            <span className="font-medium text-gray-800 dark:text-gray-200 transition-colors">
              {t('option')} {String.fromCharCode(65 + index)}:
            </span> {opt}
          </button>
        ))}
      </div>

      <div className="text-right">
        <button
          onClick={onNext}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg text-lg transition-transform duration-200 hover:scale-105 active:scale-95"
        >
          {t('next')} →
        </button>
      </div>
    </motion.div>
  );
};

export default QuestionCard;
