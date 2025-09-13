import React, { useState, useEffect } from 'react';
import { CheckCircle, Target, Award, Briefcase } from 'lucide-react';

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

  const getScoreColor = (score) => {
    if (score >= 80) return 'sa-stat-value-success';
    if (score >= 60) return 'sa-stat-value-warning';
    return 'sa-stat-value-danger';
  };

  if (loading) {
    return (
      <div className="sa-card sa-fade-in">
        <div className="sa-card-header">
          <h3 className="sa-heading-2">Quick Stats</h3>
        </div>
        <div className="animate-pulse sa-stack">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="sa-stat-item">
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="h-4 bg-gray-200 rounded w-8"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="sa-card sa-fade-in">
      <div className="sa-card-header">
        <h3 className="sa-heading-2">Quick Stats</h3>
      </div>
      <div className="sa-stack">
        <div className="sa-stat-item">
          <span className="sa-stat-label">Tests Complétés</span>
          <span className="sa-stat-value">{stats.testsCompleted}</span>
        </div>
        <div className="sa-stat-item">
          <span className="sa-stat-label">Score Moyen</span>
          <span className={`sa-stat-value ${getScoreColor(stats.averageScore)}`}>
            {stats.averageScore}%
          </span>
        </div>
        <div className="sa-stat-item">
          <span className="sa-stat-label">Compétences Validées</span>
          <span className="sa-stat-value sa-stat-value-primary">{stats.skillsValidated}</span>
        </div>
        <div className="sa-stat-item">
          <span className="sa-stat-label">Job Matches</span>
          <span className="sa-stat-value sa-stat-value-primary">{stats.jobMatches}</span>
        </div>
      </div>
    </div>
  );
};

export default DynamicQuickStats;
