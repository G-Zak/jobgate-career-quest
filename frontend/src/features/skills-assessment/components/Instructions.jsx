import React from 'react';

const Instructions = ({ onStart }) => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4">NUMERICAL REASONING TEST: NRT1</h2>
        <p className="text-gray-700 mb-4">
          This test has been designed to assess your numerical reasoning ability using the information provided
          in a series of charts, tables and figures. Look at each chart or table provided for each question,
          and use the information in these to work out the correct answer.
          You have 5 options from which to choose from. Only one of these options is the correct answer.
        </p>

        <p className="text-md font-semibold text-gray-800 mb-2">Remember:</p>
        <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
          <li>Please take this test in a quiet environment where you are unlikely to be distracted</li>
          <li>You may use a calculator for this test</li>
          <li>Ensure you have rough paper for working out</li>
          <li>Work both quickly and accurately</li>
          <li>
            If required for accessibility purposes, additional time can be assigned in your profile. If you are
            not using a mobile device, you can navigate this test without using your keyboard, using the arrow keys
            to move between items.
          </li>
        </ul>

        <p className="text-gray-700 mb-8">
          This test consists of <strong>20 questions</strong> and you have <strong>18 minutes</strong> in which
          to complete this. The questions are numbered across the top of the screen.
        </p>

        <div className="text-right">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg text-lg transition"
            onClick={onStart}
          >
            START →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Instructions;
