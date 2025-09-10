import React, { useState, useEffect } from 'react';

const DynamicQuickStats = () => {
  const [stats, setStats] = useState({
    testsCompleted: 0,
    averageScore: 0,
    jobMatches: 0,
    skillsValidated: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuickStats();
  }, []);

  const loadQuickStats = async () => {
    try {
      // Charger les résultats de tests
      const testsResponse = await fetch('http://localhost:8000/api/results/');
      const testResults = await testsResponse.json();

      // Charger les compétences du candidat
      const candidateResponse = await fetch('http://localhost:8000/api/candidates/1/');
      const candidateData = await candidateResponse.json();

      // Calculer les statistiques
      const testsCompleted = testResults.length;
      const averageScore = testsCompleted > 0 
        ? Math.round(testResults.reduce((sum, test) => sum + test.percentage, 0) / testsCompleted)
        : 0;

      // Compétences validées (tests avec score >= 70%)
      const skillsValidated = testResults.filter(test => test.percentage >= 70).length;

      // Job matches simulé basé sur les compétences validées
      const jobMatches = Math.min(skillsValidated * 2, 10); // Max 10 matches

      setStats({
        testsCompleted,
        averageScore,
        jobMatches,
        skillsValidated
      });

      setLoading(false);
    } catch (error) {
      console.error('Erreur lors du chargement des stats:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
        <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-3 lg:mb-4">Quick Stats</h3>
        <div className="animate-pulse space-y-3 lg:space-y-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex items-center justify-between">
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="h-4 bg-gray-200 rounded w-8"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
      <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-3 lg:mb-4">Quick Stats</h3>
      <div className="space-y-3 lg:space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-600 text-sm lg:text-base">Tests Complétés</span>
          <span className="font-semibold text-gray-900 text-sm lg:text-base">{stats.testsCompleted}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600 text-sm lg:text-base">Score Moyen</span>
          <span className={`font-semibold text-sm lg:text-base ${
            stats.averageScore >= 80 ? 'text-green-600' : 
            stats.averageScore >= 60 ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {stats.averageScore}%
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600 text-sm lg:text-base">Compétences Validées</span>
          <span className="font-semibold text-blue-600 text-sm lg:text-base">{stats.skillsValidated}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600 text-sm lg:text-base">Job Matches</span>
          <span className="font-semibold text-purple-600 text-sm lg:text-base">{stats.jobMatches}</span>
        </div>
      </div>
    </div>
  );
};

export default DynamicQuickStats;
