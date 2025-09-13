import React, { useState, useEffect } from 'react';
import { Eye, Clock, CheckCircle, XCircle } from 'lucide-react';

const RecentTests = ({ onViewAll }) => {
  const [recentTests, setRecentTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecentTests();
  }, []);

  const loadRecentTests = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/results/');
      const results = await response.json();
      
      // Get the 5 most recent tests
      const recent = results
        .slice(0, 5)
        .map(result => {
          const percentage = result.total_score > 0 
            ? Math.round((result.score / result.total_score) * 100)
            : 0;
            
          return {
            id: result.id,
            testName: result.test_name || 'Test Technique',
            skill: result.skill || 'Non spécifié',
            score: result.score,
            maxScore: result.total_score || result.max_score || 100,
            percentage: percentage,
            date: new Date(result.completed_at || result.started_at),
            duration: result.time_taken,
            type: 'technical',
            passed: percentage >= 70
          };
        });

      setRecentTests(recent);
      setLoading(false);
    } catch (error) {
      console.error('Error loading recent tests:', error);
      setLoading(false);
    }
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return 'sa-stat-value-success';
    if (percentage >= 60) return 'sa-stat-value-warning';
    return 'sa-stat-value-danger';
  };

  const formatDate = (date) => {
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Hier';
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    if (diffDays < 30) return `Il y a ${Math.ceil(diffDays / 7)} semaines`;
    return date.toLocaleDateString('fr-FR');
  };

  if (loading) {
    return (
      <div className="sa-card sa-fade-in">
        <div className="sa-card-header">
          <h3 className="sa-heading-2">Tests Récents</h3>
        </div>
        <div className="animate-pulse sa-stack">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center justify-between">
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="h-4 bg-gray-200 rounded w-8"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (recentTests.length === 0) {
    return (
      <div className="sa-card sa-fade-in">
        <div className="sa-card-header">
          <div className="flex items-center justify-between">
            <h3 className="sa-heading-2">Tests Récents</h3>
            <button 
              onClick={onViewAll}
              className="sa-btn sa-btn-ghost"
            >
              Voir tout
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="sa-empty-state">
          <div className="sa-empty-state-icon">
            <CheckCircle className="w-12 h-12 text-gray-400" />
          </div>
          <div className="sa-empty-state-title">Aucun test passé</div>
          <div className="sa-empty-state-description">
            Vos statistiques apparaîtront ici
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sa-card sa-fade-in">
      <div className="sa-card-header">
        <div className="flex items-center justify-between">
          <h3 className="sa-heading-2">Tests Récents</h3>
          <button 
            onClick={onViewAll}
            className="sa-btn sa-btn-ghost"
          >
            Voir tout
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="sa-stack">
        {recentTests.map((test) => (
          <div key={test.id} className="sa-stat-item">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  test.passed ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                }`}>
                  {test.passed ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                </div>
                <div>
                  <div className="sa-body font-medium">{test.testName}</div>
                  <div className="sa-caption">{formatDate(test.date)}</div>
                </div>
              </div>
              <div className="text-right">
                <div className={`sa-stat-value ${getScoreColor(test.percentage)}`}>
                  {test.percentage}%
                </div>
                <div className="sa-caption">{test.score}/{test.maxScore}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentTests;
