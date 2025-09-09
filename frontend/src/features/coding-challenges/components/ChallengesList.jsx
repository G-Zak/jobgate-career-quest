import React, { useState, useEffect } from 'react';
import { 
  Code, 
  Clock, 
  Trophy, 
  Filter, 
  Search,
  ChevronRight,
  Star,
  Users,
  Target
} from 'lucide-react';

const ChallengesList = ({ onSelectChallenge }) => {
  const [challenges, setChallenges] = useState([]);
  const [filteredChallenges, setFilteredChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const difficultyColors = {
    'beginner': 'bg-green-100 text-green-800 border-green-200',
    'intermediate': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'advanced': 'bg-orange-100 text-orange-800 border-orange-200',
    'expert': 'bg-red-100 text-red-800 border-red-200'
  };

  const languageIcons = {
    'python': '🐍',
    'javascript': '🟨',
    'java': '☕',
    'cpp': '⚡',
    'csharp': '💜',
    'go': '🔵',
    'rust': '🦀'
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  useEffect(() => {
    filterChallenges();
  }, [challenges, searchTerm, selectedLanguage, selectedDifficulty, selectedCategory]);

  const fetchChallenges = async () => {
    try {
      setError(null);
      console.log('Fetching challenges...');
      const response = await fetch('http://127.0.0.1:8000/api/challenges/');
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Challenges data:', data);
        setChallenges(data);
      } else {
        console.error('Failed to fetch challenges. Status:', response.status);
        const errorText = await response.text();
        console.error('Error response:', errorText);
        setError(`Erreur ${response.status}: ${errorText}`);
      }
    } catch (error) {
      console.error('Error fetching challenges:', error);
      setError(`Erreur de connexion: ${error.message}`);
      setChallenges([]);
    } finally {
      setLoading(false);
    }
  };

  const filterChallenges = () => {
    let filtered = challenges;

    if (searchTerm) {
      filtered = filtered.filter(challenge =>
        challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        challenge.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        challenge.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedLanguage) {
      filtered = filtered.filter(challenge => challenge.language === selectedLanguage);
    }

    if (selectedDifficulty) {
      filtered = filtered.filter(challenge => challenge.difficulty === selectedDifficulty);
    }

    if (selectedCategory) {
      filtered = filtered.filter(challenge => challenge.category === selectedCategory);
    }

    setFilteredChallenges(filtered);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedLanguage('');
    setSelectedDifficulty('');
    setSelectedCategory('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des défis...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong className="font-bold">Erreur de chargement!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
          <button
            onClick={fetchChallenges}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Défis de Programmation
          </h1>
          <p className="text-gray-600">
            Testez vos compétences avec {challenges.length} défis de programmation
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-wrap gap-4 items-end">
            
            {/* Search */}
            <div className="flex-1 min-w-64">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rechercher
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Rechercher par titre, description ou tags..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Language Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Langage
              </label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Tous</option>
                <option value="python">Python</option>
                <option value="javascript">JavaScript</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
                <option value="csharp">C#</option>
              </select>
            </div>

            {/* Difficulty Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Difficulté
              </label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Toutes</option>
                <option value="beginner">Débutant</option>
                <option value="intermediate">Intermédiaire</option>
                <option value="advanced">Avancé</option>
                <option value="expert">Expert</option>
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Catégorie
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Toutes</option>
                <option value="algorithms">Algorithmes</option>
                <option value="data_structures">Structures de Données</option>
                <option value="string_manipulation">Manipulation de Chaînes</option>
                <option value="mathematics">Mathématiques</option>
                <option value="dynamic_programming">Programmation Dynamique</option>
              </select>
            </div>

            {/* Reset Button */}
            <button
              onClick={resetFilters}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Réinitialiser
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            {filteredChallenges.length} défi(s) trouvé(s)
          </p>
        </div>

        {/* Challenges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChallenges.map((challenge) => (
            <div key={challenge.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              
              {/* Challenge Header */}
              <div className="p-6 pb-4">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 flex-1 pr-2">
                    {challenge.title}
                  </h3>
                  <span className="text-2xl">
                    {languageIcons[challenge.language] || '💻'}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {challenge.description}
                </p>

                {/* Metadata */}
                <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{challenge.estimated_time_minutes}min</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Trophy className="w-4 h-4" />
                    <span>{challenge.max_points}pts</span>
                  </div>
                </div>

                {/* Difficulty Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${difficultyColors[challenge.difficulty]}`}>
                    {challenge.difficulty === 'beginner' && 'Débutant'}
                    {challenge.difficulty === 'intermediate' && 'Intermédiaire'}
                    {challenge.difficulty === 'advanced' && 'Avancé'}
                    {challenge.difficulty === 'expert' && 'Expert'}
                  </span>
                  <span className="text-xs text-gray-500 capitalize">
                    {challenge.language}
                  </span>
                </div>

                {/* Tags */}
                {challenge.tags && challenge.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {challenge.tags.slice(0, 3).map((tag, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                    {challenge.tags.length > 3 && (
                      <span className="px-2 py-1 text-xs text-gray-500">
                        +{challenge.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Challenge Footer */}
              <div className="px-6 pb-6">
                <button
                  onClick={() => onSelectChallenge && onSelectChallenge(challenge)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 group"
                >
                  <Code className="w-4 h-4" />
                  <span>Commencer le défi</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredChallenges.length === 0 && !loading && (
          <div className="text-center py-12">
            <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun défi trouvé
            </h3>
            <p className="text-gray-600 mb-4">
              Essayez de modifier vos critères de recherche
            </p>
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Voir tous les défis
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default ChallengesList;
