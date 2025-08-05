import React from 'react';

const TestHeader = ({ currentQuestion, totalQuestions, timer, onAbort }) => {
  const formatTime = (t) => {
    const m = Math.floor(t / 60);
    const s = t % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const progress = Math.floor((currentQuestion / totalQuestions) * 100);

  return (
    <header className="w-full bg-white border-b border-gray-200 shadow-sm px-6 py-4 mb-6">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Question Info */}
        <div>
          <p className="text-sm text-gray-500 uppercase tracking-wide">Question</p>
          <h1 className="text-2xl font-semibold">
            {String(currentQuestion).padStart(2, '0')}
            <span className="text-gray-400">/{totalQuestions}</span>
          </h1>
        </div>

        {/* Timer + Buttons */}
        <div className="flex items-center gap-4">
          <span className="text-blue-600 font-medium text-lg">
            ⏱️ {formatTime(timer)}
          </span>
          <button className="text-gray-700 hover:text-blue-600 transition">Help</button>
          <button
            className="text-gray-700 hover:text-red-600 transition font-medium"
            onClick={onAbort}
          >
            Abort
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-gray-200 rounded-full mt-4">
        <div
          className="h-full bg-blue-600 rounded-full transition-all"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </header>
  );
};

export default TestHeader;
