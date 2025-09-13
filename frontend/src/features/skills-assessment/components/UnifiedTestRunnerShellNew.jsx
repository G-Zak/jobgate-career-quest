import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaClock, FaFlag, FaCheckCircle, FaTimesCircle, FaStop, FaArrowRight, FaPause, FaPlay } from 'react-icons/fa';

const UnifiedTestRunnerShell = ({
  meta,
  currentIndex,
  total,
  onPrev,
  onNext,
  onAbort,
  onSubmit,
  isLast,
  canNext,
  sectionIndex,
  sectionTotal,
  children
}) => {
  const [timeRemaining, setTimeRemaining] = useState(meta.timeLimit * 60); // Convert minutes to seconds
  const [isPaused, setIsPaused] = useState(false);
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);

  // Timer countdown
  useEffect(() => {
    if (timeRemaining > 0 && !isPaused) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            onSubmit({ reason: 'time' });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeRemaining, isPaused, onSubmit]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handlePauseToggle = () => {
    if (isPaused) {
      setIsPaused(false);
      setShowPauseModal(false);
    } else {
      setIsPaused(true);
      setShowPauseModal(true);
    }
  };

  const handleResume = () => {
    setIsPaused(false);
    setShowPauseModal(false);
  };

  const handleExit = () => {
    setShowExitModal(true);
  };

  const handleConfirmExit = () => {
    onAbort();
  };

  const handleNext = () => {
    if (isLast) {
      onSubmit({ reason: 'end' });
    } else {
      onNext();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-white/20 shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handleExit}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-white/50 rounded-lg transition-all duration-200"
            >
              <FaArrowLeft className="w-4 h-4" />
              <span className="font-medium">Exit Test</span>
            </button>

            <div className="flex items-center gap-8">
              <div className="text-center">
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {meta.title}
                </div>
                <div className="text-sm text-gray-600">
                  Question {currentIndex + 1} of {total}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-gray-500">Time Remaining</div>
                <div className={`text-xl font-bold font-mono ${timeRemaining <= 300 ? 'text-red-500' : 'text-blue-600'}`}>
                  {formatTime(timeRemaining)}
                </div>
              </div>
              <button
                onClick={handlePauseToggle}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {isPaused ? <FaPlay className="w-4 h-4" /> : <FaPause className="w-4 h-4" />}
                <span className="font-medium">{isPaused ? 'Resume' : 'Pause'}</span>
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-2">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{Math.round(((currentIndex + 1) / total) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentIndex + 1) / total) * 100}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {children}
      </div>

      {/* Navigation */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.button
              onClick={onPrev}
              disabled={currentIndex === 0}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-200 ${
                currentIndex === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:shadow-md'
              }`}
              whileHover={currentIndex > 0 ? { scale: 1.02 } : {}}
              whileTap={currentIndex > 0 ? { scale: 0.98 } : {}}
            >
              <span>← Previous</span>
            </motion.button>

            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-500">
                {currentIndex + 1} of {total}
              </div>
            </div>

            <motion.button
              onClick={handleNext}
              disabled={!canNext}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-200 ${
                !canNext
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : isLast
                  ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
              }`}
              whileHover={canNext ? { scale: 1.02 } : {}}
              whileTap={canNext ? { scale: 0.98 } : {}}
            >
              <span>{isLast ? 'Complete Test' : 'Next'}</span>
              <FaArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Pause Modal */}
      {showPauseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
          >
            <div className="text-center">
              <FaPause className="mx-auto text-4xl text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Test Paused</h3>
              <p className="text-gray-600 mb-6">Your progress has been saved. Click Resume to continue.</p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={handleResume}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Resume Test
                </button>
                <button
                  onClick={handleConfirmExit}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Exit Test
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Exit Modal */}
      {showExitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
          >
            <div className="text-center">
              <FaTimesCircle className="mx-auto text-4xl text-red-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Exit Test?</h3>
              <p className="text-gray-600 mb-6">Are you sure you want to exit? Your progress will be saved.</p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={handleConfirmExit}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Yes, Exit
                </button>
                <button
                  onClick={() => setShowExitModal(false)}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default UnifiedTestRunnerShell;