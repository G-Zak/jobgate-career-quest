import React, { useState, useEffect } from 'react';
import { FaSyncAlt, FaEye, FaPlay, FaClock, FaQuestionCircle } from 'react-icons/fa';

const TestDebugPage = () => {
 const [tests, setTests] = useState([]);
 const [skills, setSkills] = useState([]);
 const [candidates, setCandidates] = useState([]);
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState(null);
 const [selectedTest, setSelectedTest] = useState(null);

 useEffect(() => {
 loadAllData();
 }, []);

 const loadAllData = async () => {
 setLoading(true);
 setError(null);

 try {
 // Charger les tests
 console.log('Chargement des tests...');
 const testsResponse = await fetch('http://localhost:8000/api/tests-alt/');
 console.log('Tests response status:', testsResponse.status);

 if (!testsResponse.ok) {
 throw new Error(`Tests API error: ${testsResponse.status}`);
 }

 const testsData = await testsResponse.json();
 console.log('Tests data:', testsData);
 setTests(testsData);

 // Charger les compétences
 console.log('Chargement des compétences...');
 const skillsResponse = await fetch('http://localhost:8000/api/skills/');
 console.log('Skills response status:', skillsResponse.status);

 if (!skillsResponse.ok) {
 throw new Error(`Skills API error: ${skillsResponse.status}`);
 }

 const skillsData = await skillsResponse.json();
 console.log('Skills data:', skillsData);
 setSkills(skillsData);

 // Charger les candidats
 console.log('Chargement des candidats...');
 const candidatesResponse = await fetch('http://localhost:8000/api/candidates/');
 console.log('Candidates response status:', candidatesResponse.status);

 if (!candidatesResponse.ok) {
 throw new Error(`Candidates API error: ${candidatesResponse.status}`);
 }

 const candidatesData = await candidatesResponse.json();
 console.log('Candidates data:', candidatesData);
 setCandidates(candidatesData);

 } catch (err) {
 console.error('Erreur lors du chargement:', err);
 setError(err.message);
 } finally {
 setLoading(false);
 }
 };

 const loadTestDetails = async (testId) => {
 try {
 const response = await fetch(`http://localhost:8000/api/tests/${testId}/`);
 if (!response.ok) {
 throw new Error(`Error loading test ${testId}: ${response.status}`);
 }
 const testData = await response.json();
 setSelectedTest(testData);
 console.log('Test détaillé:', testData);
 } catch (err) {
 console.error('Erreur lors du chargement du test:', err);
 setError(err.message);
 }
 };

 const getSkillName = (skillId) => {
 const skill = skills.find(s => s.id === skillId);
 return skill ? skill.name : `Skill ID: ${skillId}`;
 };

 return (
 <div className="max-w-7xl mx-auto p-6">
 <div className="bg-white rounded-xl shadow-lg p-6">
 <div className="flex justify-between items-center mb-6">
 <h1 className="text-3xl font-bold text-gray-800"> Page de Test - API Debug</h1>
 <button
 onClick={loadAllData}
 disabled={loading}
 className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
 >
 <FaSyncAlt className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
 Actualiser
 </button>
 </div>

 {error && (
 <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
 <strong>Erreur:</strong> {error}
 </div>
 )}

 {loading && (
 <div className="flex justify-center items-center h-32">
 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
 <span className="ml-3">Chargement...</span>
 </div>
 )}

 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
 {/* Section Tests */}
 <div className="bg-gray-50 rounded-lg p-4">
 <h2 className="text-xl font-semibold mb-4 flex items-center">
 <FaPlay className="mr-2 text-green-500" />
 Tests Disponibles ({tests.length})
 </h2>

 {tests.length === 0 ? (
 <p className="text-gray-500 italic">Aucun test trouvé</p>
 ) : (
 <div className="space-y-3">
 {tests.map(test => (
 <div key={test.id} className="bg-white rounded-lg p-4 border">
 <div className="flex justify-between items-start mb-2">
 <h3 className="font-semibold text-gray-800">{test.test_name}</h3>
 <button
 onClick={() => loadTestDetails(test.id)}
 className="text-blue-500 hover:text-blue-700"
 >
 <FaEye />
 </button>
 </div>
 <div className="text-sm text-gray-600 space-y-1">
 <p><strong>ID:</strong> {test.id}</p>
 <p><strong>Compétence:</strong> {getSkillName(test.skill)}</p>
 <p><strong>Questions:</strong> {test.question_count || 0}</p>
 <p><strong>Durée:</strong> {test.time_limit} min</p>
 <p><strong>Score total:</strong> {test.total_score}</p>
 <p><strong>Actif:</strong> {test.is_active ? '' : ''}</p>
 </div>
 {test.description && (
 <p className="text-sm text-gray-500 mt-2">{test.description}</p>
 )}
 </div>
 ))}
 </div>
 )}
 </div>

 {/* Section Compétences */}
 <div className="bg-gray-50 rounded-lg p-4">
 <h2 className="text-xl font-semibold mb-4 flex items-center">
 <FaQuestionCircle className="mr-2 text-purple-500" />
 Compétences ({skills.length})
 </h2>

 {skills.length === 0 ? (
 <p className="text-gray-500 italic">Aucune compétence trouvée</p>
 ) : (
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-96 overflow-y-auto">
 {skills.map(skill => (
 <div key={skill.id} className="bg-white rounded p-2 text-sm">
 <span className="font-medium">{skill.name}</span>
 <div className="text-xs text-gray-500">ID: {skill.id} | {skill.category}</div>
 </div>
 ))}
 </div>
 )}
 </div>
 </div>

 {/* Section Candidats */}
 <div className="mt-6 bg-gray-50 rounded-lg p-4">
 <h2 className="text-xl font-semibold mb-4 flex items-center">
 <FaClock className="mr-2 text-orange-500" />
 Candidats ({candidates.length})
 </h2>

 {candidates.length === 0 ? (
 <p className="text-gray-500 italic">Aucun candidat trouvé</p>
 ) : (
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
 {candidates.map(candidate => (
 <div key={candidate.id} className="bg-white rounded-lg p-3 border">
 <h3 className="font-semibold">{candidate.full_name || `${candidate.first_name} ${candidate.last_name}`}</h3>
 <p className="text-sm text-gray-600">ID: {candidate.id}</p>
 <p className="text-sm text-gray-600">Email: {candidate.email}</p>
 <p className="text-sm text-gray-600">Compétences: {candidate.skills?.length || 0}</p>
 {candidate.skills && candidate.skills.length > 0 && (
 <div className="mt-2">
 <div className="flex flex-wrap gap-1">
 {candidate.skills.map(skill => (
 <span key={skill.id} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
 {skill.name}
 </span>
 ))}
 </div>
 </div>
 )}
 </div>
 ))}
 </div>
 )}
 </div>

 {/* Détails du test sélectionné */}
 {selectedTest && (
 <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
 <h2 className="text-xl font-semibold mb-4"> Détails du Test: {selectedTest.test_name}</h2>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
 <div>
 <p><strong>ID:</strong> {selectedTest.id}</p>
 <p><strong>Compétence:</strong> {selectedTest.skill_name}</p>
 <p><strong>Questions:</strong> {selectedTest.questions?.length || 0}</p>
 <p><strong>Durée:</strong> {selectedTest.time_limit} minutes</p>
 </div>
 <div>
 <p><strong>Score total:</strong> {selectedTest.total_score}</p>
 <p><strong>Actif:</strong> {selectedTest.is_active ? 'Oui' : 'Non'}</p>
 <p><strong>Instructions:</strong> {selectedTest.instructions}</p>
 </div>
 </div>

 {selectedTest.questions && selectedTest.questions.length > 0 && (
 <div>
 <h3 className="font-semibold mb-2">Questions ({selectedTest.questions.length}):</h3>
 <div className="space-y-3 max-h-64 overflow-y-auto">
 {selectedTest.questions.map((question, index) => (
 <div key={question.id} className="bg-white rounded p-3 border">
 <p className="font-medium">Q{index + 1}: {question.question_text}</p>
 <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
 <p>A) {question.option_a}</p>
 <p>B) {question.option_b}</p>
 <p>C) {question.option_c}</p>
 <p>D) {question.option_d}</p>
 </div>
 <p className="text-sm text-green-600 mt-1">
 <strong>Réponse:</strong> {question.correct_answer.toUpperCase()} |
 <strong> Points:</strong> {question.points}
 </p>
 </div>
 ))}
 </div>
 </div>
 )}

 <button
 onClick={() => setSelectedTest(null)}
 className="mt-4 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
 >
 Fermer
 </button>
 </div>
 )}

 {/* Info de status */}
 <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
 <h3 className="font-semibold mb-2"> Status de l'API</h3>
 <div className="grid grid-cols-3 gap-4 text-center">
 <div>
 <div className="text-2xl font-bold text-blue-600">{tests.length}</div>
 <div className="text-sm text-gray-600">Tests</div>
 </div>
 <div>
 <div className="text-2xl font-bold text-purple-600">{skills.length}</div>
 <div className="text-sm text-gray-600">Compétences</div>
 </div>
 <div>
 <div className="text-2xl font-bold text-orange-600">{candidates.length}</div>
 <div className="text-sm text-gray-600">Candidats</div>
 </div>
 </div>
 </div>
 </div>
 </div>
 );
};

export default TestDebugPage;
