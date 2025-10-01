import React, { useState, useEffect } from 'react';
import { FaClock, FaTrophy, FaEye } from 'react-icons/fa';

const TestTimeline = ({ onViewAll }) => {
 const [tests, setTests] = useState([]);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
 loadTestTimeline();
 }, []);

 const loadTestTimeline = async () => {
 try {
 const response = await fetch('http://localhost:8000/api/results/');
 const results = await response.json();

 // Prendre les 6 tests les plus récents pour la timeline
 const timelineTests = results
 .slice(0, 6)
 .map(result => ({
 id: result.id,
 testName: result.test_name || 'Test Technique',
 skill: result.skill || 'Non spécifié',
 score: result.score,
 maxScore: result.max_score || 100,
 percentage: result.percentage,
 date: new Date(result.completed_at || result.started_at),
 duration: result.time_taken,
 type: 'technical'
 }));

 setTests(timelineTests);
 setLoading(false);
 } catch (error) {
 console.error('Erreur lors du chargement de la timeline:', error);
 setLoading(false);
 }
 };

 const formatDuration = (seconds) => {
 const minutes = Math.floor(seconds / 60);
 return `${minutes}min`;
 };

 const getScoreColor = (percentage) => {
 if (percentage >= 80) return 'text-green-600 bg-green-500';
 if (percentage >= 60) return 'text-yellow-600 bg-yellow-500';
 return 'text-red-600 bg-red-500';
 };

 if (loading) {
 return (
 <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
 <h2 className="text-xl font-bold text-gray-900 mb-6">Timeline des Tests</h2>
 <div className="animate-pulse space-y-4">
 {[1, 2, 3, 4].map(i => (
 <div key={i} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
 <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
 <div className="flex-1 space-y-2">
 <div className="h-4 bg-gray-200 rounded w-3/4"></div>
 <div className="h-3 bg-gray-200 rounded w-1/2"></div>
 </div>
 <div className="w-16 h-6 bg-gray-200 rounded"></div>
 </div>
 ))}
 </div>
 </div>
 );
 }

 return (
 <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
 <div className="flex items-center justify-between mb-6">
 <h2 className="text-xl font-bold text-gray-900">Timeline des Tests</h2>
 {onViewAll && (
 <button
 onClick={onViewAll}
 className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
 >
 <FaEye />
 <span>Voir tout</span>
 </button>
 )}
 </div>

 {tests.length === 0 ? (
 <div className="text-center py-8">
 <div className="text-gray-400 text-4xl mb-3"></div>
 <p className="text-gray-500 text-sm">Aucun test dans la timeline</p>
 <p className="text-gray-400 text-xs">Vos tests récents s'afficheront ici</p>
 </div>
 ) : (
 <div className="space-y-4">
 {tests.map((test, index) => (
 <div key={test.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
 <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
 {test.skill.charAt(0).toUpperCase()}
 </div>

 <div className="flex-1">
 <h3 className="font-semibold text-gray-900">{test.testName}</h3>
 <div className="flex items-center space-x-4 text-sm text-gray-500">
 <span>{test.date.toLocaleDateString('fr-FR')}</span>
 <div className="flex items-center space-x-1">
 <FaClock className="text-xs" />
 <span>{formatDuration(test.duration)}</span>
 </div>
 <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
 {test.skill}
 </span>
 </div>
 </div>

 <div className="text-right">
 <div className={`text-lg font-bold ${getScoreColor(test.percentage).split(' ')[0]}`}>
 {test.percentage}%
 </div>
 <div className="w-16 h-2 bg-gray-200 rounded-full">
 <div
 className={`h-2 rounded-full ${getScoreColor(test.percentage).split(' ')[1]}`}
 style={{ width: `${test.percentage}%` }}
 ></div>
 </div>
 <div className="text-xs text-gray-500 mt-1">
 {test.score}/{test.maxScore}
 </div>
 </div>
 </div>
 ))}

 {tests.length > 0 && onViewAll && (
 <div className="pt-4 border-t border-gray-100">
 <button
 onClick={onViewAll}
 className="w-full text-center text-sm text-blue-600 hover:text-blue-700 transition-colors"
 >
 Voir l'historique complet →
 </button>
 </div>
 )}
 </div>
 )}
 </div>
 );
};

export default TestTimeline;