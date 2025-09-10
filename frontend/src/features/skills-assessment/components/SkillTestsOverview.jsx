import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaCode, FaQuestionCircle, FaClock, FaTrophy, FaPlay, FaLock, FaCheckCircle } from 'react-icons/fa';
import PracticalTests from '../../coding-challenges/components/PracticalTests';

// Composant d'éditeur de code simple
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

// Interface directe pour un test pratique
const DirectPracticalTestInterface = ({ test, onBack }) => {
  const [code, setCode] = useState('');
  const [showUnavailableModal, setShowUnavailableModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

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
    setCode(test?.starter_code || getDefaultCode(test?.language));
  }, [test]);

  const handleExecuteCode = () => {
    setIsRunning(true);
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
                <h1 className="text-2xl font-bold text-gray-900">{test.title}</h1>
                <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                  <span className="capitalize bg-gray-100 px-2 py-1 rounded">{test.language}</span>
                  <span className={`capitalize px-2 py-1 rounded ${
                    test.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                    test.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {test.difficulty === 'beginner' ? 'Débutant' :
                     test.difficulty === 'intermediate' ? 'Intermédiaire' : 'Avancé'}
                  </span>
                  <div className="flex items-center gap-1">
                    <FaTrophy className="w-4 h-4" />
                    <span>{test.max_points} points</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaClock className="w-4 h-4" />
                    <span>{test.estimated_time_minutes} min</span>
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
                <p className="text-gray-700 leading-relaxed">{test.description}</p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Détails</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <pre className="whitespace-pre-wrap text-sm text-gray-800 leading-relaxed">
                    {test.problem_statement}
                  </pre>
                </div>
              </div>

              {test.input_format && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Format d'Entrée</h4>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-gray-700 text-sm">{test.input_format}</p>
                  </div>
                </div>
              )}

              {test.output_format && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Format de Sortie</h4>
                  <div className="bg-green-50 rounded-lg p-4">
                    <p className="text-gray-700 text-sm">{test.output_format}</p>
                  </div>
                </div>
              )}

              {test.sample_input && test.sample_output && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Exemple</h4>
                  <div className="space-y-3">
                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">Entrée:</h5>
                      <div className="bg-gray-100 rounded p-3">
                        <pre className="text-sm text-gray-800">{test.sample_input}</pre>
                      </div>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">Sortie:</h5>
                      <div className="bg-gray-100 rounded p-3">
                        <pre className="text-sm text-gray-800">{test.sample_output}</pre>
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
                  {test.language}
                </span>
              </div>
            </div>
            
            <div className="flex-1 overflow-hidden">
              <SimpleCodeEditor
                value={code}
                onChange={setCode}
                language={test.language}
              />
            </div>
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
                Votre solution de {code.split('\n').length} lignes en {test.language} est prête.
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

const SkillTestsOverview = ({ onBackToDashboard, onStartTest, userId = 1 }) => {
  const [skills, setSkills] = useState([]);
  const [userSkills, setUserSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [showPracticalTests, setShowPracticalTests] = useState(false);
  const [selectedPracticalTest, setSelectedPracticalTest] = useState(null);

  useEffect(() => {
    loadUserSkillsAndTests();
  }, [userId]);

  const loadUserSkillsAndTests = async () => {
    try {
      // Charger les compétences de l'utilisateur
      let userSkillsData = [];
      try {
        const candidateResponse = await fetch(`http://localhost:8000/api/candidates/${userId}/`);
        if (candidateResponse.ok) {
          const candidate = await candidateResponse.json();
          userSkillsData = candidate.skills || [];
          console.log('Compétences utilisateur chargées:', userSkillsData);
        } else {
          throw new Error('Candidat non trouvé');
        }
      } catch (error) {
        console.log('Pas de compétences utilisateur trouvées, chargement de toutes les compétences disponibles');
        // Fallback : charger toutes les compétences disponibles
        try {
          const skillsResponse = await fetch('http://localhost:8000/api/skills/');
          if (skillsResponse.ok) {
            const allSkills = await skillsResponse.json();
            userSkillsData = allSkills.slice(0, 5); // Prendre les 5 premières compétences
            console.log('Toutes les compétences chargées:', userSkillsData);
          }
        } catch (skillsError) {
          console.log('Erreur chargement compétences, utilisation données mock');
          // Données mock pour les compétences
          userSkillsData = [
            { id: 1, name: 'Python' },
            { id: 2, name: 'Django' },
            { id: 3, name: 'JavaScript' }
          ];
        }
      }

      setUserSkills(userSkillsData);

      // Si l'utilisateur n'a pas de compétences, ne rien afficher
      if (userSkillsData.length === 0) {
        setSkills([]);
        setLoading(false);
        return;
      }

      // Charger les tests QCM
      let qcmTests = [];
      try {
        const testsResponse = await fetch('http://localhost:8000/api/tests-alt/');
        if (testsResponse.ok) {
          qcmTests = await testsResponse.json();
          console.log('Tests QCM chargés depuis API:', qcmTests);
        } else {
          throw new Error('API non disponible');
        }
      } catch (error) {
        console.log('API non disponible, utilisation des données mock QCM');
        // Données mock pour les tests QCM basées sur le JSON
        qcmTests = [
          {
            id: 1,
            title: 'Test JavaScript Expert',
            test_type: 'technical',
            description: 'Évaluation des concepts avancés de JavaScript',
            duration_minutes: 45,
            total_questions: 6,
            passing_score: 70,
            is_active: true,
            skill: 1, // JavaScript/Python
            test_name: 'Test JavaScript Expert',
            total_score: 30,
            time_limit: 45
          },
          {
            id: 2,
            title: 'Test Python Architecture',
            test_type: 'technical', 
            description: 'Concepts avancés d\'architecture et de design patterns en Python',
            duration_minutes: 40,
            total_questions: 4,
            passing_score: 70,
            is_active: true,
            skill: 1, // JavaScript/Python
            test_name: 'Test Python Architecture',
            total_score: 25,
            time_limit: 40
          },
          {
            id: 3,
            title: 'Test Django Fondamentaux',
            test_type: 'technical',
            description: 'Évaluation des compétences Django : modèles, vues, templates, ORM et architecture MVT. Ce test couvre les concepts fondamentaux et avancés.',
            duration_minutes: 25,
            total_questions: 12,
            passing_score: 70,
            is_active: true,
            skill: 2, // Django
            test_name: 'Test Django Fondamentaux',
            total_score: 37,
            time_limit: 25
          },
          {
            id: 4,
            title: 'Test Java Spring Boot',
            test_type: 'technical',
            description: 'Framework Spring Boot et architecture microservices',
            duration_minutes: 35,
            total_questions: 4,
            passing_score: 70,
            is_active: true,
            skill: 3, // Java (si existe)
            test_name: 'Test Java Spring Boot',
            total_score: 20,
            time_limit: 35
          }
        ];
      }

      // Charger les tests pratiques (challenges)
      let practicalTests = [];
      try {
        const challengesResponse = await fetch('http://127.0.0.1:8000/api/coding-challenges/');
        practicalTests = await challengesResponse.json();
      } catch (error) {
        console.log('API non disponible, utilisation des données mock');
        // Données mock pour les tests pratiques
        practicalTests = [
          {
            id: 1,
            title: 'Vérifier un palindrome',
            slug: 'palindrome-check',
            description: 'Vérifiez si une chaîne est un palindrome.',
            difficulty: 'beginner',
            category: 'string_manipulation',
            language: 'python',
            problem_statement: `Écrivez une fonction qui vérifie si une chaîne de caractères est un palindrome.

Un palindrome est un mot, une phrase, ou une séquence qui se lit de la même manière de gauche à droite et de droite à gauche.

**Exemple :**
- "radar" → True
- "hello" → False  
- "A man a plan a canal Panama" → True (en ignorant les espaces et la casse)

**Instructions :**
- Ignorez les espaces et la casse
- Retournez True si c'est un palindrome, False sinon`,
            input_format: 'Une chaîne de caractères',
            output_format: 'True ou False',
            constraints: 'La chaîne peut contenir des lettres, des chiffres et des espaces',
            starter_code: `def is_palindrome(s):
    """
    Vérifie si une chaîne est un palindrome
    
    Args:
        s (str): La chaîne à vérifier
    
    Returns:
        bool: True si c'est un palindrome, False sinon
    """
    # Votre code ici
    pass

# Tests
print(is_palindrome("radar"))  # True
print(is_palindrome("hello"))  # False
print(is_palindrome("A man a plan a canal Panama"))  # True`,
            estimated_time_minutes: 15,
            skill_id: 1 // Programmation Python
          },
          {
            id: 2,
            title: 'Somme de deux nombres',
            slug: 'two-sum',
            description: 'Trouvez deux nombres dans un tableau qui additionnent à une cible donnée.',
            difficulty: 'beginner',
            category: 'algorithms',
            language: 'python',
            problem_statement: `Étant donné un tableau d'entiers et une valeur cible, trouvez les indices de deux nombres qui additionnent à la cible.

Vous pouvez supposer qu'il y a exactement une solution, et vous ne pouvez pas utiliser le même élément deux fois.

**Exemple :**
\`\`\`
nums = [2, 7, 11, 15], target = 9
Résultat : [0, 1]
Explication : nums[0] + nums[1] = 2 + 7 = 9
\`\`\`

**Instructions :**
- Retournez les indices sous forme de liste
- L'ordre des indices n'est pas important`,
            input_format: 'Un tableau d\'entiers et un entier cible',
            output_format: 'Une liste de deux indices',
            constraints: '2 ≤ nums.length ≤ 1000, -10^9 ≤ nums[i] ≤ 10^9',
            starter_code: `def two_sum(nums, target):
    """
    Trouve les indices de deux nombres qui additionnent à la cible
    
    Args:
        nums (List[int]): Liste d'entiers
        target (int): Valeur cible
    
    Returns:
        List[int]: Indices des deux nombres
    """
    # Votre code ici
    pass

# Tests
print(two_sum([2, 7, 11, 15], 9))  # [0, 1]
print(two_sum([3, 2, 4], 6))       # [1, 2]`,
            estimated_time_minutes: 20,
            skill_id: 1 // Programmation Python
          },
          {
            id: 3,
            title: 'FizzBuzz',
            slug: 'fizzbuzz',
            description: 'Implémentez le classique problème FizzBuzz.',
            difficulty: 'beginner',
            category: 'algorithms',
            language: 'python',
            problem_statement: `Écrivez un programme qui affiche les nombres de 1 à n. Mais :
- Pour les multiples de 3, affichez "Fizz" au lieu du nombre
- Pour les multiples de 5, affichez "Buzz" au lieu du nombre  
- Pour les multiples de 3 ET 5, affichez "FizzBuzz" au lieu du nombre

**Exemple pour n=15 :**
\`\`\`
1, 2, Fizz, 4, Buzz, Fizz, 7, 8, Fizz, Buzz, 11, Fizz, 13, 14, FizzBuzz
\`\`\`

**Instructions :**
- Retournez une liste de chaînes de caractères
- Les nombres normaux doivent être convertis en chaînes`,
            input_format: 'Un entier n',
            output_format: 'Une liste de chaînes',
            constraints: '1 ≤ n ≤ 1000',
            starter_code: `def fizzbuzz(n):
    """
    Génère la séquence FizzBuzz pour les nombres de 1 à n
    
    Args:
        n (int): Nombre limite
    
    Returns:
        List[str]: Séquence FizzBuzz
    """
    # Votre code ici
    pass

# Tests
print(fizzbuzz(15))`,
            estimated_time_minutes: 10,
            skill_id: 1 // Programmation Python
          }
        ];
      }

      // Filtrer uniquement les compétences de l'utilisateur et associer les tests
      const skillsWithTests = userSkillsData.map(skill => {
        const qcmTestsForSkill = qcmTests.filter(test => test.skill === skill.id && test.is_active);
        const practicalTestsForSkill = practicalTests.filter(test => 
          test.skill_id === skill.id ||
          test.language?.toLowerCase() === skill.name?.toLowerCase() ||
          skill.name?.toLowerCase().includes(test.language?.toLowerCase())
        );

        return {
          ...skill,
          qcmTests: qcmTestsForSkill,
          practicalTests: practicalTestsForSkill,
          totalTests: qcmTestsForSkill.length + practicalTestsForSkill.length
        };
      });

      // Trier par nombre de tests disponibles (décroissant)
      skillsWithTests.sort((a, b) => b.totalTests - a.totalTests);

      setSkills(skillsWithTests);
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      setLoading(false);
    }
  };

  const startQCMTest = (test) => {
    // Rediriger vers le test QCM
    console.log('Démarrer test QCM:', test);
    // TODO: Intégrer avec le système de test QCM existant
  };

  const startPracticalTest = (test) => {
    // Afficher l'interface de test pratique directement
    console.log('startPracticalTest appelé avec:', test);
    console.log('État actuel selectedPracticalTest:', selectedPracticalTest);
    setSelectedPracticalTest(test);
    console.log('setSelectedPracticalTest appelé');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <div className="ml-4 text-lg">Chargement des compétences...</div>
      </div>
    );
  }

  if (showPracticalTests) {
    return <PracticalTests onBackToDashboard={() => setShowPracticalTests(false)} />;
  }

  if (selectedPracticalTest) {
    return (
      <DirectPracticalTestInterface 
        test={selectedPracticalTest} 
        onBack={() => setSelectedPracticalTest(null)} 
      />
    );
  }

  if (selectedSkill) {
    return (
      <SkillTestsDetail 
        skill={selectedSkill} 
        onBack={() => setSelectedSkill(null)}
        onBackToDashboard={onBackToDashboard}
        onStartPracticalTest={startPracticalTest}
        onStartTest={onStartTest}
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
          <h1 className="text-3xl font-bold text-gray-800">Tests par Compétence</h1>
          <p className="text-gray-600 mt-2">
            Choisissez une compétence pour voir les tests disponibles
          </p>
        </div>
      </div>

      {/* Grille des compétences */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills.map(skill => (
          <div 
            key={skill.id} 
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 cursor-pointer"
            onClick={() => setSelectedSkill(skill)}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-gray-800">{skill.name}</h3>
              {skill.totalTests > 0 && (
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  {skill.totalTests} test{skill.totalTests > 1 ? 's' : ''}
                </span>
              )}
            </div>

            <div className="space-y-2 mb-4">
              {skill.qcmTests.length > 0 && (
                <div className="flex items-center text-sm text-gray-600">
                  <FaQuestionCircle className="mr-2 text-blue-500" />
                  <span>{skill.qcmTests.length} test{skill.qcmTests.length > 1 ? 's' : ''} QCM</span>
                </div>
              )}
              {skill.practicalTests.length > 0 && (
                <div className="flex items-center text-sm text-gray-600">
                  <FaCode className="mr-2 text-green-500" />
                  <span>{skill.practicalTests.length} test{skill.practicalTests.length > 1 ? 's' : ''} pratique{skill.practicalTests.length > 1 ? 's' : ''}</span>
                </div>
              )}
            </div>

            {skill.totalTests === 0 ? (
              <div className="text-center py-4">
                <p className="text-gray-500 text-sm">Aucun test disponible</p>
              </div>
            ) : (
              <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors text-sm">
                Voir les tests
              </button>
            )}
          </div>
        ))}
      </div>

      {skills.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🎯</div>
          <h3 className="text-xl font-medium text-gray-600 mb-2">Aucune compétence sélectionnée</h3>
          <p className="text-gray-500 mb-6">
            Vous devez d'abord ajouter vos compétences pour voir les tests disponibles.
          </p>
          <button
            onClick={() => {/* Navigate to skills selector */}}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Gérer mes compétences
          </button>
        </div>
      )}
    </div>
  );
};

// Composant pour afficher les tests d'une compétence spécifique
const SkillTestsDetail = ({ skill, onBack, onBackToDashboard, onStartPracticalTest, onStartTest }) => {
  const [selectedTest, setSelectedTest] = useState(null);

  const startQCMTest = (test) => {
    // Démarrer le test QCM en utilisant la fonction fournie par le dashboard
    console.log(`Démarrage du test QCM : ${test.test_name}`);
    if (onStartTest) {
      onStartTest(test.id || test.test_id, skill.id); // Pass skillId as second parameter
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center mb-8">
        <button
          onClick={onBack}
          className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <FaArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Tests pour {skill.name}</h1>
          <p className="text-gray-600 mt-2">
            {skill.totalTests} test{skill.totalTests > 1 ? 's' : ''} disponible{skill.totalTests > 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Tests QCM */}
        {skill.qcmTests.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaQuestionCircle className="mr-3 text-blue-500" />
              Tests QCM
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {skill.qcmTests.map(test => (
                <div key={test.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">{test.test_name}</h3>
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        QCM
                      </span>
                    </div>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      Disponible
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {test.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <FaQuestionCircle className="mr-1" />
                      <span>{test.question_count} questions</span>
                    </div>
                    <div className="flex items-center">
                      <FaClock className="mr-1" />
                      <span>{test.time_limit} min</span>
                    </div>
                    <div className="flex items-center">
                      <FaTrophy className="mr-1" />
                      <span>{test.total_score} pts</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => startQCMTest(test)}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
                  >
                    <FaPlay className="mr-2" />
                    Commencer le test
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tests Pratiques */}
        {skill.practicalTests.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaCode className="mr-3 text-green-500" />
              Tests Pratiques
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {skill.practicalTests.map(test => (
                <div key={test.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">{test.title}</h3>
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        Code
                      </span>
                    </div>
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                      Bientôt
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {test.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <FaCode className="mr-1" />
                      <span className="capitalize">{test.language}</span>
                    </div>
                    <div className="flex items-center">
                      <FaClock className="mr-1" />
                      <span>{test.estimated_time_minutes} min</span>
                    </div>
                    <div className="flex items-center">
                      <FaTrophy className="mr-1" />
                      <span>{test.max_points} pts</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => onStartPracticalTest(test)}
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
                  >
                    <FaCode className="mr-2" />
                    Test pratique (bientôt)
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {skill.totalTests === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📚</div>
            <h3 className="text-xl font-medium text-gray-600 mb-2">Aucun test disponible</h3>
            <p className="text-gray-500">
              Aucun test n'est encore créé pour cette compétence.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillTestsOverview;
