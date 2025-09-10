import React, { useEffect } from 'react';
import { FaCheckCircle, FaTrophy, FaChartLine } from 'react-icons/fa';

const TestCompletionNotification = ({ 
  testResult, 
  onViewDashboard, 
  onViewHistory, 
  onClose,
  autoShow = true 
}) => {
  useEffect(() => {
    if (autoShow && testResult) {
      // Auto-fermer après 10 secondes si pas d'interaction
      const timer = setTimeout(() => {
        onClose();
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [testResult, autoShow, onClose]);

  if (!testResult) return null;

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (percentage >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getPerformanceMessage = (percentage) => {
    if (percentage >= 80) return { text: 'Excellent travail !', emoji: '🎉' };
    if (percentage >= 60) return { text: 'Bon résultat !', emoji: '👍' };
    return { text: 'Continuez vos efforts !', emoji: '💪' };
  };

  const performance = getPerformanceMessage(testResult.percentage);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 transform animate-bounce-in">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaCheckCircle className="text-green-600 text-2xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Test Terminé ! {performance.emoji}
          </h2>
          <p className="text-gray-600">{performance.text}</p>
        </div>

        {/* Result Card */}
        <div className={`border-2 rounded-xl p-6 mb-6 ${getScoreColor(testResult.percentage)}`}>
          <div className="text-center">
            <h3 className="font-semibold text-lg mb-2">{testResult.testName}</h3>
            <div className="text-3xl font-bold mb-2">
              {testResult.percentage}%
            </div>
            <div className="text-sm opacity-75">
              {testResult.score}/{testResult.maxScore} points
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-white bg-opacity-50 rounded-full h-2 mt-4">
              <div 
                className="h-2 rounded-full bg-current opacity-75 transition-all duration-1000"
                style={{ width: `${testResult.percentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-blue-600 text-lg mb-1">⏱️</div>
            <div className="text-sm text-gray-600">Temps</div>
            <div className="font-semibold">
              {Math.floor(testResult.timeTaken / 60)}:{(testResult.timeTaken % 60).toString().padStart(2, '0')}
            </div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-purple-600 text-lg mb-1">🎯</div>
            <div className="text-sm text-gray-600">Compétence</div>
            <div className="font-semibold text-xs">{testResult.skill}</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={onViewDashboard}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
          >
            <FaChartLine />
            <span>Voir le Dashboard</span>
          </button>
          
          <button
            onClick={onViewHistory}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
          >
            <FaTrophy />
            <span>Historique des Tests</span>
          </button>
          
          <button
            onClick={onClose}
            className="w-full text-gray-500 hover:text-gray-700 py-2 text-sm transition-colors"
          >
            Fermer
          </button>
        </div>

        {/* Auto-close indicator */}
        <div className="mt-4 text-center">
          <div className="text-xs text-gray-400">
            Se fermera automatiquement dans 10 secondes
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestCompletionNotification;
