import React, { useState, useEffect } from 'react';
import { FaClock, FaCheckCircle, FaTimesCircle, FaBrain, FaChartLine } from 'react-icons/fa';

const AdaptiveTest = ({ userId, onTestComplete }) => {
 const [currentQuestion, setCurrentQuestion] = useState(null);
 const [questionIndex, setQuestionIndex] = useState(0);
 const [questions, setQuestions] = useState([]);
 const [answers, setAnswers] = useState([]);
 const [timeLeft, setTimeLeft] = useState(30); // 30 seconds per question
 const [testResults, setTestResults] = useState(null);
 const [isLoading, setIsLoading] = useState(true);
 const [testPhase, setTestPhase] = useState('loading'); // loading, testing, results

 // Algorithme adaptatif - commence avec difficulté moyenne
 const [currentDifficulty, setCurrentDifficulty] = useState(2); // 1=facile, 2=moyen, 3=difficile
 const [userSkillLevels, setUserSkillLevels] = useState({}); // tracking du niveau par skill
 const [questionPool, setQuestionPool] = useState({}); // questions groupées par skill et difficulté

 useEffect(() => {
 loadUserSkillsAndQuestions();
 }, [userId]);

 useEffect(() => {
 if (questions.length > 0 && questionIndex < questions.length) {
 setCurrentQuestion(questions[questionIndex]);
 setTimeLeft(30);
 }
 }, [questionIndex, questions]);

 // Timer pour chaque question
 useEffect(() => {
 if (testPhase === 'testing' && timeLeft > 0) {
 const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
 return () => clearTimeout(timer);
 } else if (timeLeft === 0 && testPhase === 'testing') {
 // Auto-submit quand le temps est écoulé
 handleAnswer(''); // réponse vide = incorrect
 }
 }, [timeLeft, testPhase]);

 const loadUserSkillsAndQuestions = async () => {
 try {
 // 1. Charger les compétences de l'utilisateur
 const skillsResponse = await fetch(`http://localhost:3001/api/skills/user/${userId}`);
 const skillsData = await skillsResponse.json();

 if (skillsData.userSkills.length === 0) {
 alert('Vous devez d\'abord sélectionner vos compétences !');
 return;
 }

 // 2. Charger TOUTES les questions pour ces compétences
 const questionsResponse = await fetch(`http://localhost:3001/api/skills/technical-questions/${userId}?limit=100`);
 const questionsData = await questionsResponse.json();

 // 3. Organiser les questions par skill et difficulté
 const pool = {};
 questionsData.questions.forEach(q => {
 if (!pool[q.skill_id]) {
 pool[q.skill_id] = { 1: [], 2: [], 3: [] };
 }
 pool[q.skill_id][q.difficulty_level].push(q);
 });

 setQuestionPool(pool);

 // 4. Générer le premier set de questions (algorithme adaptatif)
 const initialQuestions = generateAdaptiveQuestions(skillsData.userSkills, pool);
 setQuestions(initialQuestions);

 setIsLoading(false);
 setTestPhase('testing');

 } catch (error) {
 console.error('Error loading test data:', error);
 setIsLoading(false);
 }
 };

 const generateAdaptiveQuestions = (userSkills, pool) => {
 const questions = [];
 const questionsPerSkill = 3; // 3 questions par compétence pour commencer

 userSkills.forEach(skill => {
 if (pool[skill.id] && pool[skill.id][2].length > 0) {
 // Commence avec difficulté moyenne (2) pour chaque skill
 const skillQuestions = pool[skill.id][2]
 .sort(() => Math.random() - 0.5) // mélange
 .slice(0, questionsPerSkill);

 questions.push(...skillQuestions);
 }
 });

 return questions.sort(() => Math.random() - 0.5); // mélange final
 };

 const handleAnswer = (selectedAnswer) => {
 const isCorrect = selectedAnswer === currentQuestion.correct_answer;
 const timeSpent = 30 - timeLeft;

 // Enregistrer la réponse
 const answer = {
 questionId: currentQuestion.id,
 skillId: currentQuestion.skill_id,
 skillName: currentQuestion.skill_name,
 question: currentQuestion.question,
 selectedAnswer,
 correctAnswer: currentQuestion.correct_answer,
 isCorrect,
 timeSpent,
 difficulty: currentQuestion.difficulty_level
 };

 setAnswers(prev => [...prev, answer]);

 // ALGORITHME ADAPTATIF - Ajuste la difficulté pour cette compétence
 updateSkillDifficulty(currentQuestion.skill_id, isCorrect, timeSpent);

 // Passer à la question suivante
 if (questionIndex + 1 < questions.length) {
 setQuestionIndex(questionIndex + 1);
 } else {
 // Test terminé - générer plus de questions si nécessaire ou finir
 finishTest();
 }
 };

 const updateSkillDifficulty = (skillId, isCorrect, timeSpent) => {
 const currentLevel = userSkillLevels[skillId] || 2;
 let newLevel = currentLevel;

 // Logique d'adaptation :
 if (isCorrect && timeSpent < 15) {
 // Réponse correcte ET rapide -> augmenter difficulté
 newLevel = Math.min(3, currentLevel + 1);
 } else if (!isCorrect || timeSpent > 25) {
 // Réponse incorrecte OU trop lente -> réduire difficulté
 newLevel = Math.max(1, currentLevel - 1);
 }

 setUserSkillLevels(prev => ({
 ...prev,
 [skillId]: newLevel
 }));
 };

 const finishTest = () => {
 // Calculer les résultats par compétence
 const skillResults = {};

 answers.forEach(answer => {
 if (!skillResults[answer.skillId]) {
 skillResults[answer.skillId] = {
 skillName: answer.skillName,
 correct: 0,
 total: 0,
 avgTime: 0,
 level: 'beginner'
 };
 }

 skillResults[answer.skillId].total++;
 if (answer.isCorrect) skillResults[answer.skillId].correct++;
 skillResults[answer.skillId].avgTime += answer.timeSpent;
 });

 // Déterminer le niveau final pour chaque compétence
 Object.keys(skillResults).forEach(skillId => {
 const result = skillResults[skillId];
 const accuracy = result.correct / result.total;
 result.avgTime = result.avgTime / result.total;

 // Algorithme de détermination du niveau
 if (accuracy >= 0.8 && result.avgTime < 20) {
 result.level = 'expert';
 } else if (accuracy >= 0.7 && result.avgTime < 25) {
 result.level = 'advanced';
 } else if (accuracy >= 0.5) {
 result.level = 'intermediate';
 } else {
 result.level = 'beginner';
 }
 });

 setTestResults({
 skillResults,
 totalQuestions: answers.length,
 totalCorrect: answers.filter(a => a.isCorrect).length,
 averageTime: answers.reduce((sum, a) => sum + a.timeSpent, 0) / answers.length
 });

 setTestPhase('results');

 // Mettre à jour les niveaux dans la base de données
 updateUserSkillLevels(skillResults);
 };

 const updateUserSkillLevels = async (skillResults) => {
 for (const [skillId, result] of Object.entries(skillResults)) {
 try {
 await fetch(`http://localhost:3001/api/skills/user/${userId}/skill/${skillId}`, {
 method: 'PUT',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({ proficiencyLevel: result.level })
 });
 } catch (error) {
 console.error(`Error updating skill ${skillId}:`, error);
 }
 }
 };

 if (isLoading) {
 return (
 <div className="flex items-center justify-center h-64">
 <div className="text-center">
 <FaBrain className="text-4xl text-blue-500 animate-pulse mx-auto mb-4" />
 <p>Préparation de votre test adaptatif...</p>
 </div>
 </div>
 );
 }

 if (testPhase === 'results') {
 return (
 <div className="max-w-4xl mx-auto p-6">
 <div className="bg-white rounded-lg shadow-lg p-8">
 <div className="text-center mb-8">
 <FaChartLine className="text-5xl text-green-500 mx-auto mb-4" />
 <h2 className="text-3xl font-bold text-gray-800">Résultats de votre évaluation</h2>
 <p className="text-gray-600 mt-2">
 {testResults.totalCorrect}/{testResults.totalQuestions} réponses correctes
 (Temps moyen: {testResults.averageTime.toFixed(1)}s)
 </p>
 </div>

 <div className="grid md:grid-cols-2 gap-6">
 {Object.entries(testResults.skillResults).map(([skillId, result]) => (
 <div key={skillId} className="border rounded-lg p-6">
 <h3 className="text-xl font-semibold mb-4">{result.skillName}</h3>

 <div className="space-y-3">
 <div className="flex justify-between">
 <span>Précision:</span>
 <span className="font-medium">
 {((result.correct / result.total) * 100).toFixed(1)}%
 </span>
 </div>

 <div className="flex justify-between">
 <span>Temps moyen:</span>
 <span className="font-medium">{result.avgTime.toFixed(1)}s</span>
 </div>

 <div className="flex justify-between items-center">
 <span>Niveau évalué:</span>
 <span className={`px-3 py-1 rounded-full text-sm font-medium ${
 result.level === 'expert' ? 'bg-purple-100 text-purple-800' :
 result.level === 'advanced' ? 'bg-green-100 text-green-800' :
 result.level === 'intermediate' ? 'bg-blue-100 text-blue-800' :
 'bg-yellow-100 text-yellow-800'
 }`}>
 {result.level.charAt(0).toUpperCase() + result.level.slice(1)}
 </span>
 </div>
 </div>
 </div>
 ))}
 </div>

 <div className="text-center mt-8">
 <button
 onClick={() => onTestComplete(testResults)}
 className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
 >
 Retour au tableau de bord
 </button>
 </div>
 </div>
 </div>
 );
 }

 if (!currentQuestion) {
 return <div>Aucune question disponible pour vos compétences.</div>;
 }

 return (
 <div className="max-w-4xl mx-auto p-6">
 <div className="bg-white rounded-lg shadow-lg">
 {/* Header avec progression et timer */}
 <div className="border-b p-6">
 <div className="flex justify-between items-center">
 <div>
 <span className="text-sm text-gray-500">
 Question {questionIndex + 1} sur {questions.length}
 </span>
 <div className="text-lg font-semibold text-blue-600 mt-1">
 {currentQuestion.skill_name}
 </div>
 </div>

 <div className="flex items-center space-x-4">
 <div className={`flex items-center space-x-2 ${timeLeft <= 10 ? 'text-red-500' : 'text-gray-600'}`}>
 <FaClock />
 <span className="font-mono text-lg">{timeLeft}s</span>
 </div>
 </div>
 </div>

 {/* Barre de progression */}
 <div className="mt-4">
 <div className="w-full bg-gray-200 rounded-full h-2">
 <div
 className="bg-blue-600 h-2 rounded-full transition-all duration-300"
 style={{ width: `${((questionIndex + 1) / questions.length) * 100}%` }}
 ></div>
 </div>
 </div>
 </div>

 {/* Question */}
 <div className="p-8">
 <h3 className="text-xl font-semibold mb-6 leading-relaxed">
 {currentQuestion.question}
 </h3>

 {/* Options de réponse */}
 <div className="space-y-4">
 {['option_a', 'option_b', 'option_c', 'option_d'].map((option, index) => (
 <button
 key={option}
 onClick={() => handleAnswer(String.fromCharCode(65 + index))}
 className="w-full text-left p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors group"
 >
 <div className="flex items-center">
 <span className="flex-shrink-0 w-8 h-8 bg-gray-100 group-hover:bg-blue-100 rounded-full flex items-center justify-center font-semibold mr-4">
 {String.fromCharCode(65 + index)}
 </span>
 <span className="text-gray-800 group-hover:text-blue-800">
 {currentQuestion[option]}
 </span>
 </div>
 </button>
 ))}
 </div>

 {/* Indicateur de difficulté */}
 <div className="mt-6 text-center">
 <div className="inline-flex items-center space-x-2 text-sm text-gray-500">
 <span>Difficulté:</span>
 <div className="flex space-x-1">
 {[1, 2, 3].map(level => (
 <div
 key={level}
 className={`w-2 h-2 rounded-full ${
 level <= currentQuestion.difficulty_level ? 'bg-blue-500' : 'bg-gray-300'
 }`}
 />
 ))}
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>
 );
};

export default AdaptiveTest;
