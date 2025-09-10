import React, { useState, useEffect } from 'react';
import { FaPlay, FaClock, FaQuestionCircle, FaArrowLeft, FaCheckCircle, FaTrophy } from 'react-icons/fa';

const SkillBasedTests = ({ userId, testId, onBackToDashboard }) => {
  const [userSkills, setUserSkills] = useState([]);
  const [availableTests, setAvailableTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTest, setSelectedTest] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [testResult, setTestResult] = useState(null);

  // Charger les compétences de l'utilisateur et les tests disponibles
  useEffect(() => {
    loadUserSkillsAndTests();
  }, []);

  // Démarrer automatiquement un test si testId est fourni
  useEffect(() => {
    if (testId && availableTests.length > 0 && !selectedTest) {
      const testToStart = availableTests.find(test => test.id === testId);
      if (testToStart) {
        console.log('Démarrage automatique du test:', testToStart.title);
        startTest(testToStart);
      }
    }
  }, [testId, availableTests, selectedTest]);

    const loadUserSkillsAndTests = async () => {
        try {
            // Charger les compétences de l'utilisateur depuis son profil
            const candidateResponse = await fetch(`http://localhost:8000/api/candidates/${userId}/`);
            if (!candidateResponse.ok) {
                setUserSkills([]);
                setAvailableTests([]);
                setLoading(false);
                return;
            }
            
            const candidate = await candidateResponse.json();
            const userSkillsData = candidate.skills || [];
            setUserSkills(userSkillsData);
            
            if (userSkillsData.length === 0) {
                setAvailableTests([]);
                setLoading(false);
                return;
            }
            
            // Charger les tests techniques depuis testsengine
            const testsResponse = await fetch('http://localhost:8000/api/tests/?test_type=technical');
            const allTests = await testsResponse.json();
            
            // Filtrer les tests techniques actifs  
            const userTests = allTests.filter(test => 
                test.test_type === 'technical' && test.is_active
            );
            
            setAvailableTests(userTests);
            setLoading(false);
        } catch (error) {
            console.error('Erreur lors du chargement:', error);
            setUserSkills([]);
            setAvailableTests([]);
            setLoading(false);
        }
    };  const startTest = async (test) => {
    try {
      // Charger les questions du test depuis testsengine
      const response = await fetch(`http://localhost:8000/api/tests/${test.id}/`);
      const testWithQuestions = await response.json();
      
      setSelectedTest(testWithQuestions);
      setTimeLeft(test.duration_minutes * 60); // Convertir minutes en secondes
      setTestStarted(true);
      setTestCompleted(false);
      setCurrentQuestion(0);
      setAnswers({});
      setTestResult(null);
    } catch (error) {
      console.error('Erreur lors du démarrage du test:', error);
    }
  };

  const submitAnswer = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < selectedTest.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      finishTest();
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const finishTest = async () => {
    try {
      const timeTaken = (selectedTest.duration_minutes * 60) - timeLeft;
      
      const result = await fetch('http://localhost:8000/api/results/submit_test/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          candidate_id: 1, // En production, récupérer depuis l'auth
          test_id: selectedTest.id,
          answers: answers,
          time_taken: timeTaken
        })
      });
      
      const testResultData = await result.json();
      
      setTestResult(testResultData);
      setTestStarted(false);
      setTestCompleted(true);
      
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
    }
  };

  const backToTests = () => {
    setSelectedTest(null);
    setTestStarted(false);
    setTestCompleted(false);
    setTestResult(null);
    loadUserSkillsAndTests(); // Recharger pour mise à jour
  };

  // Timer
  useEffect(() => {
    if (testStarted && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (testStarted && timeLeft === 0) {
      finishTest();
    }
  }, [testStarted, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <div className="ml-4 text-lg">Chargement des tests...</div>
      </div>
    );
  }

  // Vue des résultats
  if (testCompleted && testResult) {
    const percentage = testResult.percentage;
    const getScoreColor = (perc) => {
      if (perc >= 80) return 'text-green-600';
      if (perc >= 60) return 'text-yellow-600';
      return 'text-red-600';
    };

    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="mb-6">
            <FaCheckCircle className={`text-6xl mx-auto mb-4 ${getScoreColor(percentage)}`} />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Test Terminé !</h1>
            <h2 className="text-xl text-gray-600">{selectedTest.title}</h2>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Score</p>
                <p className={`text-2xl font-bold ${getScoreColor(percentage)}`}>
                  {testResult.score}/{selectedTest.total_questions * 5} {/* Assuming 5 points per question */}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Pourcentage</p>
                <p className={`text-2xl font-bold ${getScoreColor(percentage)}`}>
                  {percentage}%
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Temps</p>
                <p className="text-2xl font-bold text-gray-700">
                  {Math.floor(testResult.time_taken / 60)}:{(testResult.time_taken % 60).toString().padStart(2, '0')}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={backToTests}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Retour aux tests
            </button>
            <button
              onClick={onBackToDashboard}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Retour au dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Vue du test en cours
  if (selectedTest && testStarted) {
    // Safety checks for questions
    if (!selectedTest.questions || selectedTest.questions.length === 0) {
      return (
        <div className="max-w-4xl mx-auto p-6">
          <div className="text-center py-12">
            <div className="text-red-500 text-6xl mb-4">❌</div>
            <h3 className="text-xl font-medium text-gray-600 mb-2">Erreur: Aucune question trouvée</h3>
            <p className="text-gray-500 mb-6">Ce test ne contient aucune question.</p>
            <button
              onClick={() => setSelectedTest(null)}
              className="bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded-lg transition-colors"
            >
              Retour aux tests
            </button>
          </div>
        </div>
      );
    }

    if (currentQuestion >= selectedTest.questions.length) {
      console.error('Current question index out of bounds:', currentQuestion, 'Total questions:', selectedTest.questions.length);
      setCurrentQuestion(0); // Reset to first question
      return null;
    }

    const question = selectedTest.questions[currentQuestion];
    
    // Additional safety check for the question object
    if (!question) {
      return (
        <div className="max-w-4xl mx-auto p-6">
          <div className="text-center py-12">
            <div className="text-red-500 text-6xl mb-4">❌</div>
            <h3 className="text-xl font-medium text-gray-600 mb-2">Erreur: Question introuvable</h3>
            <p className="text-gray-500 mb-6">La question {currentQuestion + 1} n'existe pas.</p>
            <button
              onClick={() => setSelectedTest(null)}
              className="bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded-lg transition-colors"
            >
              Retour aux tests
            </button>
          </div>
        </div>
      );
    }
    
    return (
      <div className="max-w-4xl mx-auto p-6">
        {/* Header du test */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{selectedTest.title}</h1>
              <p className="text-gray-600">Question {currentQuestion + 1} sur {selectedTest.questions.length}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className={`flex items-center ${timeLeft < 300 ? 'text-red-500' : 'text-blue-500'}`}>
                <FaClock className="mr-2" />
                <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
              </div>
            </div>
          </div>
          
          {/* Barre de progression */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / selectedTest.questions.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-6">
            {question?.question_text || question?.text || "Question non disponible"}
          </h2>
          
          <div className="space-y-3">
            {['a', 'b', 'c', 'd'].map(option => {
              // Handle different option formats
              let optionText = '';
              if (question[`option_${option}`]) {
                // Django format: option_a, option_b, etc.
                optionText = question[`option_${option}`];
              } else if (question.options && Array.isArray(question.options)) {
                // Array format: options[0], options[1], etc.
                const optionIndex = option === 'a' ? 0 : option === 'b' ? 1 : option === 'c' ? 2 : 3;
                optionText = question.options[optionIndex];
              } else {
                optionText = `Option ${option.toUpperCase()} non disponible`;
              }

              return (
                <button
                  key={option}
                  onClick={() => submitAnswer(question.id, option)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                    answers[question.id] === option
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="font-semibold mr-3">{option.toUpperCase()}.</span>
                  {optionText}
                </button>
              );
            })}
          </div>
          
          <div className="flex justify-between mt-8">
            <button
              onClick={previousQuestion}
              disabled={currentQuestion === 0}
              className="px-6 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors"
            >
              Précédent
            </button>
            
            <button
              onClick={nextQuestion}
              disabled={!answers[question.id]}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50 hover:bg-blue-600 transition-colors"
            >
              {currentQuestion === selectedTest.questions.length - 1 ? 'Terminer' : 'Suivant'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Vue de la liste des tests
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
            Passez des tests techniques basés sur vos compétences déclarées
          </p>
        </div>
      </div>

      {/* Mes compétences */}
      {userSkills.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Mes Compétences</h2>
          <div className="flex flex-wrap gap-2">
            {userSkills.map(skill => (
              <span
                key={skill.id}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
              >
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Tests disponibles ou messages */}
      {availableTests.length === 0 && userSkills.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🎯</div>
          <h3 className="text-xl font-medium text-gray-600 mb-2">Aucune compétence déclarée</h3>
          <p className="text-gray-500 mb-6">
            Vous devez d'abord ajouter vos compétences techniques pour voir les tests disponibles.
          </p>
          <button
            onClick={onBackToDashboard}
            className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg transition-colors"
          >
            Aller à la gestion des compétences
          </button>
        </div>
      ) : availableTests.length === 0 && userSkills.length > 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📚</div>
          <h3 className="text-xl font-medium text-gray-600 mb-2">Aucun test disponible</h3>
          <p className="text-gray-500 mb-6">
            Aucun test n'est encore créé pour vos compétences actuelles.
            <br />
            Les administrateurs peuvent créer des tests dans l'interface d'administration.
          </p>
          <button
            onClick={onBackToDashboard}
            className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg transition-colors"
          >
            Retour au tableau de bord
          </button>
        </div>
      ) : (
        /* Tests disponibles */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {availableTests.map(test => {
            const skill = userSkills.find(s => s.id === test.skill);
            
            return (
              <div key={test.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{test.title}</h3>
                    <p className="text-sm text-blue-600 font-medium">
                      Compétence: {skill?.name}
                    </p>
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
                    <span>{test.total_questions} questions</span>
                  </div>
                  <div className="flex items-center">
                    <FaClock className="mr-1" />
                    <span>{test.duration_minutes} min</span>
                  </div>
                  <div className="font-medium">
                    Seuil: {test.passing_score}%
                  </div>
                </div>
                
                <button
                  onClick={() => startTest(test)}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
                >
                  <FaPlay className="mr-2" />
                  Commencer le test
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SkillBasedTests;
