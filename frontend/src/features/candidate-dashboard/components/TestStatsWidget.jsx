import React, { useState, useEffect } from 'react';
import { FaChartBar, FaTrophy, FaCalendarAlt, FaFire } from 'react-icons/fa';

const TestStatsWidget = () => {
  const [stats, setStats] = useState({
    totalTests: 0,
    averageScore: 0,
    bestScore: 0,
    testsThisWeek: 0,
    improvement: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTestStats();
  }, []);

  const loadTestStats = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/results/');
      const results = await response.json();

      if (results.length === 0) {
        setLoading(false);
        return;
      }

      // Calculer les statistiques avec scores corrigés
      const totalTests = results.length;
      
      // Calculer le pourcentage correct pour chaque test
      const correctedResults = results.map(test => ({
        ...test,
        correctedPercentage: test.total_score > 0 
          ? Math.round((test.score / test.total_score) * 100)
          : 0
      }));

      const averageScore = Math.round(
        correctedResults.reduce((sum, test) => sum + test.correctedPercentage, 0) / totalTests
      );
      const bestScore = Math.max(...correctedResults.map(test => test.correctedPercentage));

      // Tests de cette semaine
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const testsThisWeek = results.filter(test => 
        new Date(test.completed_at || test.started_at) >= oneWeekAgo
      ).length;

      // Calculer l'amélioration (derniers tests vs premiers tests)
      let improvement = 0;
      if (correctedResults.length >= 4) {
        // Trier par date pour avoir les plus anciens d'abord
        const sortedResults = [...correctedResults].sort((a, b) => 
          new Date(a.completed_at || a.started_at) - new Date(b.completed_at || b.started_at)
        );
        
        // Comparer les 2 premiers tests avec les 2 derniers
        const oldTests = sortedResults.slice(0, 2);
        const recentTests = sortedResults.slice(-2);
        
        const oldAvg = oldTests.reduce((sum, test) => sum + test.correctedPercentage, 0) / oldTests.length;
        const recentAvg = recentTests.reduce((sum, test) => sum + test.correctedPercentage, 0) / recentTests.length;
        
        improvement = Math.round(recentAvg - oldAvg);
        
        // Limiter l'amélioration entre -100 et +100
        improvement = Math.max(-100, Math.min(100, improvement));
      }

      setStats({
        totalTests,
        averageScore,
        bestScore,
        testsThisWeek,
        improvement
      });

      setLoading(false);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performances Tests</h3>
        <div className="animate-pulse grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const statItems = [
    {
      icon: FaChartBar,
      label: 'Tests passés',
      value: stats.totalTests,
      color: 'blue',
      suffix: ''
    },
    {
      icon: FaTrophy,
      label: 'Score moyen',
      value: stats.averageScore,
      color: 'green',
      suffix: '%'
    },
    {
      icon: FaCalendarAlt,
      label: 'Cette semaine',
      value: stats.testsThisWeek,
      color: 'purple',
      suffix: ''
    },
    {
      icon: FaFire,
      label: 'Progression',
      value: stats.improvement,
      color: stats.improvement >= 0 ? 'green' : 'red',
      suffix: '%',
      showSign: true
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600',
      green: 'bg-green-50 text-green-600',
      purple: 'bg-purple-50 text-purple-600',
      red: 'bg-red-50 text-red-600'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Performances Tests</h3>
      
      {stats.totalTests === 0 ? (
        <div className="text-center py-6">
          <div className="text-gray-400 text-3xl mb-2">📊</div>
          <p className="text-gray-500 text-sm">Aucun test passé</p>
          <p className="text-gray-400 text-xs">Vos statistiques apparaîtront ici</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {statItems.map((item, index) => (
            <div key={index} className="text-center">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-2 ${getColorClasses(item.color)}`}>
                <item.icon className="text-sm" />
              </div>
              <p className="text-xs text-gray-500 mb-1">{item.label}</p>
              <p className="text-lg font-bold text-gray-900">
                {item.showSign && item.value > 0 ? '+' : ''}
                {item.value}
                {item.suffix}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TestStatsWidget;
