import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaClock, FaTrophy, FaChartLine, FaFilter, FaDownload, FaMedal } from 'react-icons/fa';

const TestHistoryDashboard = () => {
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  useEffect(() => {
    loadTestHistory();
  }, []);

  const loadTestHistory = async () => {
    try {
      // Charger les résultats des tests techniques
      const technicalResponse = await fetch('http://localhost:8000/api/results/');
      const technicalResults = await technicalResponse.json();

      // TODO: Ajouter les résultats des tests psychotechniques
      // const psychoResponse = await fetch('http://localhost:8000/api/psycho-results/');
      // const psychoResults = await psychoResponse.json();

      // Formatter les données pour l'affichage avec calculs corrigés
      const formattedResults = technicalResults.map(result => {
        // Calculer le pourcentage correct
        const correctedPercentage = result.total_score > 0 
          ? Math.round((result.score / result.total_score) * 100)
          : 0;
          
        return {
          id: result.id,
          type: 'technical',
          testName: result.test_name || 'Test Technique',
          skill: result.skill || 'Non spécifié',
          score: result.score,
          maxScore: result.total_score || result.max_score || 100,
          percentage: correctedPercentage,
          date: new Date(result.completed_at || result.started_at),
          duration: result.time_taken,
          status: result.status,
          difficulty: 'intermediate',
          badge: null
        };
      });

      setTestResults(formattedResults);
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors du chargement de l\'historique:', error);
      setLoading(false);
    }
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600 bg-green-50';
    if (percentage >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getTestTypeColor = (type) => {
    if (type === 'technical') return 'bg-blue-100 text-blue-800';
    if (type === 'psychotechnical') return 'bg-purple-100 text-purple-800';
    return 'bg-gray-100 text-gray-800';
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const filteredAndSortedResults = testResults
    .filter(result => filterType === 'all' || result.type === filterType)
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(b.date) - new Date(a.date);
      if (sortBy === 'score') return b.percentage - a.percentage;
      if (sortBy === 'testName') return a.testName.localeCompare(b.testName);
      return 0;
    });

  const stats = {
    totalTests: testResults.length,
    averageScore: testResults.length > 0 
      ? Math.round(testResults.reduce((sum, test) => sum + test.percentage, 0) / testResults.length)
      : 0,
    bestScore: testResults.length > 0 
      ? Math.max(...testResults.map(test => test.percentage))
      : 0,
    completedToday: testResults.filter(test => {
      const today = new Date();
      const testDate = new Date(test.date);
      return testDate.toDateString() === today.toDateString();
    }).length
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <div className="ml-4 text-lg text-gray-600">Chargement de l'historique...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">📊 Historique des Tests</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Consultez tous vos résultats de tests techniques et psychotechniques, suivez vos progrès et identifiez vos points forts.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-50 p-3 rounded-lg">
              <FaTrophy className="text-blue-600 text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Tests Complétés</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalTests}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-50 p-3 rounded-lg">
              <FaChartLine className="text-green-600 text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Score Moyen</p>
              <p className="text-2xl font-bold text-gray-900">{stats.averageScore}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-yellow-50 p-3 rounded-lg">
              <FaMedal className="text-yellow-600 text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Meilleur Score</p>
              <p className="text-2xl font-bold text-gray-900">{stats.bestScore}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-purple-50 p-3 rounded-lg">
              <FaCalendarAlt className="text-purple-600 text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Aujourd'hui</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completedToday}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <FaFilter className="text-gray-500" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Tous les tests</option>
                <option value="technical">Tests techniques</option>
                <option value="psychotechnical">Tests psychotechniques</option>
              </select>
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="date">Trier par date</option>
              <option value="score">Trier par score</option>
              <option value="testName">Trier par nom</option>
            </select>
          </div>

          <button className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
            <FaDownload />
            <span>Exporter</span>
          </button>
        </div>
      </div>

      {/* Test Results */}
      <div className="space-y-4">
        {filteredAndSortedResults.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="text-gray-400 text-6xl mb-4">📝</div>
            <h3 className="text-xl font-medium text-gray-600 mb-2">Aucun test trouvé</h3>
            <p className="text-gray-500">
              {filterType === 'all' 
                ? "Vous n'avez pas encore passé de tests."
                : `Aucun test ${filterType === 'technical' ? 'technique' : 'psychotechnique'} trouvé.`
              }
            </p>
          </div>
        ) : (
          filteredAndSortedResults.map((test) => (
            <div key={test.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">{test.testName}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTestTypeColor(test.type)}`}>
                      {test.type === 'technical' ? 'Technique' : 'Psychotechnique'}
                    </span>
                    {test.skill && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                        {test.skill}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <FaCalendarAlt className="text-gray-400" />
                      <span className="text-gray-600">
                        {test.date.toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <FaClock className="text-gray-400" />
                      <span className="text-gray-600">
                        {formatDuration(test.duration)}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-gray-600">Score:</span>
                      <span className="font-medium text-gray-900">
                        {test.score}/{test.maxScore}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-gray-600">Statut:</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        test.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {test.status === 'completed' ? 'Terminé' : 'En cours'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Score Badge */}
                <div className={`px-4 py-2 rounded-lg font-bold text-lg ${getScoreColor(test.percentage)}`}>
                  {test.percentage}%
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Progression</span>
                  <span>{test.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      test.percentage >= 80 ? 'bg-green-500' :
                      test.percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${test.percentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TestHistoryDashboard;
