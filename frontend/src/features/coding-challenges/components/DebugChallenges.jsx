import React, { useState, useEffect } from 'react';

const DebugChallenges = () => {
 const [challenges, setChallenges] = useState([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState(null);
 const [debugInfo, setDebugInfo] = useState([]);

 const addDebugInfo = (message) => {
 setDebugInfo(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
 };

 useEffect(() => {
 fetchChallenges();
 }, []);

 const fetchChallenges = async () => {
 try {
 setError(null);
 addDebugInfo(' Démarrage du fetch...');

 const url = 'http://127.0.0.1:8000/api/challenges/';
 addDebugInfo(` URL: ${url}`);

 const response = await fetch(url, {
 method: 'GET',
 headers: {
 'Accept': 'application/json',
 'Content-Type': 'application/json',
 }
 });

 addDebugInfo(` Status: ${response.status}`);
 addDebugInfo(` Status Text: ${response.statusText}`);
 addDebugInfo(` Headers: ${JSON.stringify([...response.headers.entries()])}`);

 if (response.ok) {
 const data = await response.json();
 addDebugInfo(` Données reçues: ${data.length} défis`);
 addDebugInfo(` Premier défi: ${data[0]?.title || 'Aucun'}`);
 setChallenges(data);
 } else {
 const errorText = await response.text();
 addDebugInfo(` Erreur HTTP: ${response.status}`);
 addDebugInfo(` Réponse: ${errorText}`);
 setError(`Erreur ${response.status}: ${errorText}`);
 }
 } catch (error) {
 addDebugInfo(` Exception: ${error.message}`);
 addDebugInfo(` Stack: ${error.stack}`);
 setError(`Erreur de connexion: ${error.message}`);
 setChallenges([]);
 } finally {
 setLoading(false);
 addDebugInfo(' Fetch terminé');
 }
 };

 const testAPIDirectly = async () => {
 addDebugInfo(' Test API direct...');
 try {
 const response = await fetch('http://127.0.0.1:8000/api/challenges/');
 const data = await response.json();
 addDebugInfo(` Test direct réussi: ${data.length} défis`);
 } catch (error) {
 addDebugInfo(` Test direct échoué: ${error.message}`);
 }
 };

 return (
 <div className="p-6 max-w-4xl mx-auto">
 <h1 className="text-2xl font-bold mb-4"> Debug Défis de Programmation</h1>

 {/* Informations de Debug */}
 <div className="bg-gray-100 p-4 rounded-lg mb-6">
 <h2 className="text-lg font-semibold mb-2"> Informations de Debug</h2>
 <div className="max-h-64 overflow-y-auto text-sm font-mono">
 {debugInfo.map((info, index) => (
 <div key={index} className="mb-1">{info}</div>
 ))}
 </div>
 <button
 onClick={testAPIDirectly}
 className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
 >
 Test API Direct
 </button>
 <button
 onClick={fetchChallenges}
 className="mt-2 ml-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
 >
 Refetch
 </button>
 </div>

 {/* État de Chargement */}
 {loading && (
 <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
 ⏳ Chargement en cours...
 </div>
 )}

 {/* Erreurs */}
 {error && (
 <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
 <strong>Erreur:</strong> {error}
 </div>
 )}

 {/* Succès */}
 {!loading && !error && challenges.length > 0 && (
 <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
 <strong>Succès!</strong> {challenges.length} défis chargés
 </div>
 )}

 {/* Liste des Défis */}
 <div className="space-y-4">
 <h2 className="text-xl font-semibold"> Défis Chargés ({challenges.length})</h2>
 {challenges.map((challenge, index) => (
 <div key={challenge.id} className="border border-gray-300 rounded-lg p-4">
 <h3 className="font-semibold">{index + 1}. {challenge.title}</h3>
 <p className="text-gray-600 text-sm">{challenge.description}</p>
 <div className="flex gap-4 text-xs text-gray-500 mt-2">
 <span> {challenge.language}</span>
 <span>⭐ {challenge.difficulty}</span>
 <span> {challenge.category}</span>
 <span>⏱️ {challenge.estimated_time_minutes}min</span>
 <span> {challenge.max_points}pts</span>
 </div>
 </div>
 ))}
 </div>

 {/* JSON Brut */}
 {challenges.length > 0 && (
 <details className="mt-6">
 <summary className="cursor-pointer font-semibold"> Données JSON Brutes</summary>
 <pre className="bg-gray-100 p-4 rounded mt-2 text-xs overflow-auto">
 {JSON.stringify(challenges, null, 2)}
 </pre>
 </details>
 )}
 </div>
 );
};

export default DebugChallenges;
