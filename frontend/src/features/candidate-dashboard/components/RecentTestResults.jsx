import React, { useState, useEffect } from 'react';
import { FaTrophy, FaArrowUp, FaArrowDown, FaClock, FaEye } from 'react-icons/fa';

const RecentTestResults = ({ onViewAll }) => {
  const [recentTests, setRecentTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecentTests();
  }, []);

  const loadRecentTests = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/results/');
      const results = await response.json();
      
      // Prendre les 5 tests les plus récents avec calculs corrigés
      const recent = results
        .slice(0, 5)
        .map(result => {
          // Calculer le pourcentage correct
          const correctedPercentage = result.total_score > 0 
            ? Math.round((result.score / result.total_score) * 100)
            : 0;
            
          return {
            id: result.id,
            testName: result.test_name || 'Test Technique',
            skill: result.skill || 'Non spécifié',
            score: result.score,
            maxScore: result.total_score || result.max_score || 100,
            percentage: correctedPercentage,
            date: new Date(result.completed_at || result.started_at),
            duration: result.time_taken,
            type: 'technical'
          };
        });

      setRecentTests(recent);
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors du chargement des tests récents:', error);
      setLoading(false);
    }
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = (percentage) => {
    if (percentage >= 80) return <FaArrowUp className="text-green-500 text-xs" />;
    if (percentage >= 60) return <FaClock className="text-yellow-500 text-xs" />;
    return <FaArrowDown className="text-red-500 text-xs" />;
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes}min`;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tests Récents</h3>
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="w-12 h-6 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Tests Récents</h3>
        <button 
          onClick={onViewAll}
          className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm transition-colors"
        >
          <FaEye />
          <span>Voir tout</span>
        </button>
      </div>

      {recentTests.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-400 text-4xl mb-3">📝</div>
          <p className="text-gray-500 text-sm">Aucun test récent</p>
          <p className="text-gray-400 text-xs">Passez votre premier test pour voir vos résultats ici</p>
        </div>
      ) : (
        <div className="space-y-3">
          {recentTests.map((test) => (
            <div key={test.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              {/* Icon */}
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <FaTrophy className="text-blue-600 text-sm" />
              </div>

              {/* Test Info */}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 truncate">
                  {test.testName}
                </h4>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <span>{test.skill}</span>
                  <span>•</span>
                  <span>{formatDuration(test.duration)}</span>
                  <span>•</span>
                  <span>{test.date.toLocaleDateString('fr-FR')}</span>
                </div>
              </div>

              {/* Score */}
              <div className="flex items-center space-x-2">
                {getScoreIcon(test.percentage)}
                <span className={`text-sm font-semibold ${getScoreColor(test.percentage)}`}>
                  {test.percentage}%
                </span>
              </div>
            </div>
          ))}

          {recentTests.length > 0 && (
            <div className="pt-3 border-t border-gray-100">
              <button 
                onClick={onViewAll}
                className="w-full text-center text-sm text-blue-600 hover:text-blue-700 transition-colors"
              >
                Voir l'historique complet →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RecentTestResults;
