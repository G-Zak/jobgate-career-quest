import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaCode, FaClock, FaTrophy, FaPlay, FaLock, FaCheckCircle } from 'react-icons/fa';

// Composant d'éditeur de code simple (sans Monaco pour éviter les erreurs d'import)
const SimpleCodeEditor = ({ value, onChange, language }) => {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full h-full font-mono text-sm bg-gray-900 text-green-400 p-4 resize-none focus:outline-none border-0 rounded"
      placeholder={`Votre code ${language} ici...`}
      style={{ 
        fontFamily: 'Consolas, Monaco, "Courier New", monospace',
        lineHeight: '1.4',
        tabSize: 4
      }}
    />
  );
};

const PracticalTests = ({ onBackToDashboard }) => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChallenge, setSelectedChallenge] = useState(null);

  useEffect(() => {
    loadChallenges();
  }, []);

  const loadChallenges = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/challenges/');
      if (response.ok) {
        const data = await response.json();
        setChallenges(data);
      } else {
        console.error('Erreur lors du chargement des tests pratiques');
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChallenge = (challenge) => {
    setSelectedChallenge(challenge);
  };

  const handleBackToChallenges = () => {
    setSelectedChallenge(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <div className="ml-4 text-lg">Chargement des tests pratiques...</div>
      </div>
    );
  }

  if (selectedChallenge) {
    return (
      <PracticalTestInterface 
        challenge={selectedChallenge}
        onBack={handleBackToChallenges}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center mb-8">
        <button
          onClick={onBackToDashboard}
          className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <FaArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Tests Pratiques</h1>
          <p className="text-gray-600 mt-2">
            Tests de programmation pour évaluer vos compétences pratiques
          </p>
        </div>
      </div>

      {/* Note d'indisponibilité */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
        <div className="flex items-center">
          <FaLock className="text-yellow-600 mr-3" />
          <div>
            <h3 className="text-yellow-800 font-semibold">Tests en développement</h3>
            <p className="text-yellow-700 text-sm">
              Ces tests pratiques sont actuellement en cours de développement. 
              L'exécution du code sera bientôt disponible.
            </p>
          </div>
        </div>
      </div>

      {/* Grille des tests */}
      {challenges.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🔧</div>
          <h3 className="text-xl font-medium text-gray-600 mb-2">Aucun test pratique disponible</h3>
          <p className="text-gray-500">
            Les tests pratiques seront bientôt ajoutés.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map(challenge => (
            <div 
              key={challenge.id} 
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{challenge.title}</h3>
                  <div className="flex gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      challenge.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                      challenge.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {challenge.difficulty === 'beginner' ? 'Débutant' :
                       challenge.difficulty === 'intermediate' ? 'Intermédiaire' : 'Avancé'}
                    </span>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full capitalize">
                      {challenge.language}
                    </span>
                  </div>
                </div>
                <FaLock className="text-gray-400" />
              </div>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {challenge.description}
              </p>
              
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center">
                  <FaClock className="mr-1" />
                  <span>{challenge.estimated_time_minutes} min</span>
                </div>
                <div className="flex items-center">
                  <FaTrophy className="mr-1" />
                  <span>{challenge.max_points} pts</span>
                </div>
                <div className="flex items-center">
                  <FaCode className="mr-1" />
                  <span className="capitalize">{challenge.category}</span>
                </div>
              </div>
              
              <button
                onClick={() => handleSelectChallenge(challenge)}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
              >
                <FaPlay className="mr-2" />
                Commencer le test
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Interface pour un test pratique avec éditeur Monaco complet
const PracticalTestInterface = ({ challenge, onBack }) => {
  const [code, setCode] = useState(challenge?.starter_code || '');
  const [showUnavailableModal, setShowUnavailableModal] = useState(false);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // Code par défaut selon le langage
  const getDefaultCode = (language) => {
    switch (language?.toLowerCase()) {
      case 'python':
        return `# Votre solution Python ici
def solution():
    # Implémentez votre solution
    pass

# Tests
if __name__ == "__main__":
    result = solution()
    print(result)`;
      case 'java':
        return `public class Solution {
    public static void main(String[] args) {
        Solution sol = new Solution();
        // Testez votre solution ici
    }
    
    // Implémentez votre solution ici
    public void solution() {
        
    }
}`;
      case 'javascript':
        return `// Votre solution JavaScript ici
function solution() {
    // Implémentez votre solution
}

// Tests
console.log(solution());`;
      case 'c':
        return `#include <stdio.h>

int main() {
    // Implémentez votre solution ici
    
    return 0;
}`;
      default:
        return '// Votre code ici';
    }
  };

  useEffect(() => {
    if (!code || code.trim() === '') {
      setCode(challenge?.starter_code || getDefaultCode(challenge?.language));
    }
  }, [challenge]);

  const handleExecuteCode = () => {
    setIsRunning(true);
    setOutput('');
    
    // Simuler l'exécution
    setTimeout(() => {
      setIsRunning(false);
      setShowUnavailableModal(true);
    }, 1000);
  };

  const handleSubmitCode = () => {
    setShowSubmitModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <FaArrowLeft className="w-4 h-4" />
                Retour
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{challenge.title}</h1>
                <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                  <span className="capitalize bg-gray-100 px-2 py-1 rounded">{challenge.language}</span>
                  <span className={`capitalize px-2 py-1 rounded ${
                    challenge.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                    challenge.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {challenge.difficulty === 'beginner' ? 'Débutant' :
                     challenge.difficulty === 'intermediate' ? 'Intermédiaire' : 'Avancé'}
                  </span>
                  <div className="flex items-center gap-1">
                    <FaTrophy className="w-4 h-4" />
                    <span>{challenge.max_points} points</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaClock className="w-4 h-4" />
                    <span>{challenge.estimated_time_minutes} min</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleExecuteCode}
                disabled={isRunning}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white rounded-lg transition-colors"
              >
                {isRunning ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Exécution...
                  </>
                ) : (
                  <>
                    <FaPlay className="w-4 h-4" />
                    Exécuter
                  </>
                )}
              </button>
              
              <button
                onClick={handleSubmitCode}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                <FaCheckCircle className="w-4 h-4" />
                Soumettre
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
          
          {/* Left Panel - Problem Description */}
          <div className="bg-white rounded-lg shadow-sm border flex flex-col">
            <div className="border-b p-4 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900">Énoncé du Problème</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Description</h4>
                <p className="text-gray-700 leading-relaxed">{challenge.description}</p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Détails</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <pre className="whitespace-pre-wrap text-sm text-gray-800 leading-relaxed">
                    {challenge.problem_statement}
                  </pre>
                </div>
              </div>

              {challenge.input_format && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Format d'Entrée</h4>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-gray-700 text-sm">{challenge.input_format}</p>
                  </div>
                </div>
              )}

              {challenge.output_format && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Format de Sortie</h4>
                  <div className="bg-green-50 rounded-lg p-4">
                    <p className="text-gray-700 text-sm">{challenge.output_format}</p>
                  </div>
                </div>
              )}

              {challenge.sample_input && challenge.sample_output && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Exemple</h4>
                  <div className="space-y-3">
                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">Entrée:</h5>
                      <div className="bg-gray-100 rounded p-3">
                        <pre className="text-sm text-gray-800">{challenge.sample_input}</pre>
                      </div>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">Sortie:</h5>
                      <div className="bg-gray-100 rounded p-3">
                        <pre className="text-sm text-gray-800">{challenge.sample_output}</pre>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Code Editor */}
          <div className="bg-white rounded-lg shadow-sm border flex flex-col">
            <div className="border-b p-4 bg-gray-50">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <FaCode className="w-5 h-5" />
                  Éditeur de Code
                </h3>
                <span className="text-sm text-gray-600 capitalize bg-gray-200 px-3 py-1 rounded">
                  {challenge.language}
                </span>
              </div>
            </div>
            
            <div className="flex-1 overflow-hidden">
              <SimpleCodeEditor
                value={code}
                onChange={setCode}
                language={challenge.language}
              />
            </div>

            {/* Output Panel */}
            {output && (
              <div className="border-t bg-gray-900 text-white">
                <div className="p-3 border-b border-gray-700">
                  <h4 className="text-sm font-semibold">Sortie</h4>
                </div>
                <div className="p-4 h-32 overflow-y-auto">
                  <pre className="text-sm text-green-400">{output}</pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal d'exécution indisponible */}
      {showUnavailableModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center mb-4">
              <div className="bg-orange-100 p-3 rounded-full mr-4">
                <FaLock className="text-orange-500 text-xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Exécution temporairement indisponible</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Le système d'exécution de code est actuellement en cours de développement. 
              Cette fonctionnalité sera bientôt disponible pour tester vos solutions en temps réel.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-blue-800 mb-2">En attendant, vous pouvez :</h4>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• Écrire et modifier votre code dans l'éditeur</li>
                <li>• Vérifier la syntaxe et la logique</li>
                <li>• Soumettre votre solution une fois terminée</li>
              </ul>
            </div>
            <div className="text-center">
              <button
                onClick={() => setShowUnavailableModal(false)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Compris
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de soumission indisponible */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <FaCheckCircle className="text-blue-500 text-xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Soumission en développement</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Le système de soumission et d'évaluation automatique est en cours de finalisation. 
              Votre code a été sauvegardé localement.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-green-800 mb-2">Code sauvegardé :</h4>
              <p className="text-green-700 text-sm">
                Votre solution de {code.split('\n').length} lignes en {challenge.language} est prête.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Continuer à coder
              </button>
              <button
                onClick={onBack}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Terminer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PracticalTests;
