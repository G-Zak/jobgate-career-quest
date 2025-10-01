import React, { useState, useEffect } from 'react';
import { FaCode, FaDatabase, FaCoffee, FaPython } from 'react-icons/fa';

const DynamicSkillsPerformance = () => {
 const [skillsData, setSkillsData] = useState([]);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
 loadSkillsPerformance();
 }, []);

 const loadSkillsPerformance = async () => {
 try {
 const response = await fetch('http://localhost:8000/api/results/');
 const testResults = await response.json();

 const skillsPerformance = calculateSkillsPerformance(testResults);
 setSkillsData(skillsPerformance);
 setLoading(false);
 } catch (error) {
 console.error('Erreur lors du chargement des performances:', error);
 setLoading(false);
 }
 };

 const calculateSkillsPerformance = (testResults) => {
 const skillGroups = testResults.reduce((acc, test) => {
 if (!acc[test.skill]) {
 acc[test.skill] = [];
 }
 acc[test.skill].push(test);
 return acc;
 }, {});

 const skillsPerformance = Object.entries(skillGroups).map(([skill, tests]) => {
 // Trier par date pour calculer les tendances
 const sortedTests = tests.sort((a, b) => new Date(a.completed_at) - new Date(b.completed_at));

 // Calculer le score moyen
 const averageScore = tests.reduce((sum, test) => sum + test.percentage, 0) / tests.length;

 // Calculer la tendance (amélioration/dégradation)
 let trend = 'stable';
 if (sortedTests.length >= 2) {
 const recentTests = sortedTests.slice(-3); // 3 tests les plus récents
 const olderTests = sortedTests.slice(0, -3); // Tests plus anciens

 if (recentTests.length > 0 && olderTests.length > 0) {
 const recentAvg = recentTests.reduce((sum, test) => sum + test.percentage, 0) / recentTests.length;
 const olderAvg = olderTests.reduce((sum, test) => sum + test.percentage, 0) / olderTests.length;

 const improvement = ((recentAvg - olderAvg) / olderAvg) * 100;

 if (improvement > 5) trend = 'improving';
 else if (improvement < -5) trend = 'declining';
 }
 }

 // Déterminer le niveau de maîtrise
 let masteryLevel = 'Débutant';
 let masteryColor = 'text-red-600';
 if (averageScore >= 90) {
 masteryLevel = 'Expert';
 masteryColor = 'text-purple-600';
 } else if (averageScore >= 75) {
 masteryLevel = 'Avancé';
 masteryColor = 'text-green-600';
 } else if (averageScore >= 60) {
 masteryLevel = 'Intermédiaire';
 masteryColor = 'text-blue-600';
 } else if (averageScore >= 40) {
 masteryLevel = 'Novice';
 masteryColor = 'text-yellow-600';
 }

 return {
 skill,
 averageScore: Math.round(averageScore),
 testsCount: tests.length,
 trend,
 masteryLevel,
 masteryColor,
 lastTestDate: sortedTests[sortedTests.length - 1]?.completed_at,
 bestScore: Math.max(...tests.map(t => t.percentage)),
 icon: getSkillIcon(skill)
 };
 });

 return skillsPerformance.sort((a, b) => b.averageScore - a.averageScore);
 };

 const getSkillIcon = (skill) => {
 switch (skill.toLowerCase()) {
 case 'django': return FaPython;
 case 'java': return FaCoffee;
 case 'javascript': return FaCode;
 case 'mysql': return FaDatabase;
 default: return FaCode;
 }
 };

 const getTrendIcon = (trend) => {
 switch (trend) {
 case 'improving': return '';
 case 'declining': return '';
 default: return '️';
 }
 };

 const getTrendColor = (trend) => {
 switch (trend) {
 case 'improving': return 'text-green-600';
 case 'declining': return 'text-red-600';
 default: return 'text-gray-600';
 }
 };

 const getProgressColor = (score) => {
 if (score >= 90) return 'bg-purple-500';
 if (score >= 75) return 'bg-green-500';
 if (score >= 60) return 'bg-blue-500';
 if (score >= 40) return 'bg-yellow-500';
 return 'bg-red-500';
 };

 if (loading) {
 return (
 <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
 <h2 className="text-xl font-bold text-gray-900 mb-6">Performance par Compétence</h2>
 <div className="space-y-4">
 {[1, 2, 3, 4].map(i => (
 <div key={i} className="animate-pulse">
 <div className="flex items-center space-x-4">
 <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
 <div className="flex-1">
 <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
 <div className="h-3 bg-gray-200 rounded w-full"></div>
 </div>
 <div className="w-16 h-4 bg-gray-200 rounded"></div>
 </div>
 </div>
 ))}
 </div>
 </div>
 );
 }

 return (
 <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
 <div className="flex items-center justify-between mb-6">
 <h2 className="text-xl font-bold text-gray-900">Performance par Compétence</h2>
 <span className="text-sm text-gray-500">
 {skillsData.length} compétence{skillsData.length > 1 ? 's' : ''} évaluée{skillsData.length > 1 ? 's' : ''}
 </span>
 </div>

 {skillsData.length === 0 ? (
 <div className="text-center py-8">
 <div className="text-gray-400 text-4xl mb-3"></div>
 <p className="text-gray-500 text-sm">Aucune performance</p>
 <p className="text-gray-400 text-xs">Passez des tests pour voir vos performances</p>
 </div>
 ) : (
 <div className="space-y-4">
 {skillsData.map((skill) => (
 <div key={skill.skill} className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors">
 <div className="flex items-center justify-between mb-3">
 <div className="flex items-center space-x-3">
 <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
 <skill.icon className="text-xl text-gray-600" />
 </div>
 <div>
 <h3 className="font-semibold text-gray-900">{skill.skill}</h3>
 <div className="flex items-center space-x-2 text-sm text-gray-500">
 <span>{skill.testsCount} test{skill.testsCount > 1 ? 's' : ''}</span>
 <span>•</span>
 <span className={skill.masteryColor}>{skill.masteryLevel}</span>
 </div>
 </div>
 </div>

 <div className="text-right">
 <div className="flex items-center space-x-2">
 <span className="text-lg font-bold text-gray-900">{skill.averageScore}%</span>
 <span className={`text-sm ${getTrendColor(skill.trend)}`}>
 {getTrendIcon(skill.trend)}
 </span>
 </div>
 <p className="text-xs text-gray-500">Meilleur: {skill.bestScore}%</p>
 </div>
 </div>

 {/* Barre de progression */}
 <div className="mb-3">
 <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
 <span>Progression</span>
 <span>{skill.averageScore}/100</span>
 </div>
 <div className="w-full bg-gray-200 rounded-full h-2">
 <div
 className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(skill.averageScore)}`}
 style={{ width: `${skill.averageScore}%` }}
 ></div>
 </div>
 </div>

 {/* Informations supplémentaires */}
 <div className="flex items-center justify-between text-xs text-gray-500">
 <div className="flex items-center space-x-4">
 <span className={getTrendColor(skill.trend)}>
 {skill.trend === 'improving' ? 'En amélioration' :
 skill.trend === 'declining' ? 'En baisse' : 'Stable'}
 </span>
 </div>
 <span>
 Dernier test: {new Date(skill.lastTestDate).toLocaleDateString('fr-FR')}
 </span>
 </div>
 </div>
 ))}
 </div>
 )}
 </div>
 );
};

export default DynamicSkillsPerformance;
