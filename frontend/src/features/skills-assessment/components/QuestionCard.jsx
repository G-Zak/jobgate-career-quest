import React, { useState } from 'react';
import { motion } from 'framer-motion';

const QuestionCard = ({ questionNumber, questionText, options, onSelect, onNext }) => {
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
      className="max-w-4xl mx-auto bg-white border border-gray-200 shadow-sm rounded-lg p-8"
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Question {questionNumber}</h2>
      <p className="text-gray-700 mb-6">{questionText || 'This is where the question text goes.'}</p>

      <div className="space-y-3 mb-6">
        {options?.map((opt, index) => (
          <button
            key={index}
            onClick={() => handleOptionClick(index)}
            className={`w-full text-left px-4 py-3 border rounded-lg transition-all duration-200
              ${selectedOption === index
                ? 'bg-blue-50 border-blue-600 shadow-md scale-[1.02]'
                : 'hover:border-blue-400 hover:scale-[1.01]'}
            `}
          >
            <span className="font-medium text-gray-800">
              Option {String.fromCharCode(65 + index)}:
            </span> {opt}
          </button>
        ))}
      </div>

      <div className="text-right">
        <button
          onClick={onNext}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg text-lg transition-transform duration-200 hover:scale-105 active:scale-95"
        >
          Next →
        </button>
      </div>
    </motion.div>
  );
};

export default QuestionCard;
