import React, { useState, useEffect } from 'react';
import { FaTrophy, FaMedal, FaStar, FaFire, FaClock, FaBullseye } from 'react-icons/fa';

const DynamicBadges = () => {
 const [badges, setBadges] = useState([]);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
 loadAndCalculateBadges();
 }, []);

 const loadAndCalculateBadges = async () => {
 try {
 const response = await fetch('http://localhost:8000/api/results/');
 const testResults = await response.json();

 const calculatedBadges = calculateBadges(testResults);
 setBadges(calculatedBadges);
 setLoading(false);
 } catch (error) {
 console.error('Erreur lors du chargement des badges:', error);
 setLoading(false);
 }
 };

 const calculateBadges = (testResults) => {
 const badges = [];

 // Badge Première Réussite
 if (testResults.length > 0) {
 badges.push({
 id: 'first_test',
 name: 'Premier Test',
 description: 'Complété votre premier test',
 icon: FaBullseye,
 earned: true,
 rarity: 'bronze',
 earnedDate: testResults[testResults.length - 1]?.completed_at
 });
 }

 // Badge Scores Élevés
 const highScores = testResults.filter(test => test.percentage >= 80);
 if (highScores.length >= 1) {
 badges.push({
 id: 'high_scorer',
 name: 'Score Élevé',
 description: 'Obtenu 80% ou plus',
 icon: FaTrophy,
 earned: true,
 rarity: 'gold',
 earnedDate: highScores[0]?.completed_at
 });
 }

 // Badge Perfectionniste
 const perfectScores = testResults.filter(test => test.percentage >= 95);
 if (perfectScores.length >= 1) {
 badges.push({
 id: 'perfectionist',
 name: 'Perfectionniste',
 description: '95% ou plus dans un test',
 icon: FaStar,
 earned: true,
 rarity: 'legendary',
 earnedDate: perfectScores[0]?.completed_at
 });
 }

 // Badge Rapide
 const fastTests = testResults.filter(test => test.time_taken <= 300); // 5 minutes
 if (fastTests.length >= 1) {
 badges.push({
 id: 'speed_demon',
 name: 'Éclair',
 description: 'Complété un test en moins de 5 minutes',
 icon: FaClock,
 earned: true,
 rarity: 'silver',
 earnedDate: fastTests[0]?.completed_at
 });
 }

 // Badge Série
 if (testResults.length >= 3) {
 badges.push({
 id: 'streak',
 name: 'En Série',
 description: 'Complété 3 tests ou plus',
 icon: FaFire,
 earned: true,
 rarity: 'silver',
 earnedDate: testResults[2]?.completed_at
 });
 }

 // Badge Expert par Compétence
 const skillGroups = testResults.reduce((acc, test) => {
 if (!acc[test.skill]) acc[test.skill] = [];
 acc[test.skill].push(test);
 return acc;
 }, {});

 Object.entries(skillGroups).forEach(([skill, tests]) => {
 const avgScore = tests.reduce((sum, test) => sum + test.percentage, 0) / tests.length;
 if (avgScore >= 75 && tests.length >= 2) {
 badges.push({
 id: `expert_${skill.toLowerCase()}`,
 name: `Expert ${skill}`,
 description: `Maîtrise démontrée en ${skill}`,
 icon: FaMedal,
 earned: true,
 rarity: 'gold',
 earnedDate: tests[tests.length - 1]?.completed_at
 });
 }
 });

 // Badges non obtenus (pour motivation)
 if (testResults.length < 5) {
 badges.push({
 id: 'test_master',
 name: 'Maître des Tests',
 description: 'Complétez 5 tests',
 icon: FaTrophy,
 earned: false,
 rarity: 'gold',
 progress: testResults.length,
 target: 5
 });
 }

 return badges.slice(0, 6); // Limiter à 6 badges
 };

 const getRarityColor = (rarity) => {
 switch (rarity) {
 case 'legendary': return 'from-purple-400 to-pink-400 border-purple-300';
 case 'gold': return 'from-yellow-400 to-orange-400 border-yellow-300';
 case 'silver': return 'from-gray-300 to-gray-400 border-gray-300';
 case 'bronze': return 'from-orange-300 to-orange-400 border-orange-300';
 default: return 'from-gray-200 to-gray-300 border-gray-200';
 }
 };

 if (loading) {
 return (
 <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
 <h2 className="text-xl font-bold text-gray-900 mb-6">Achievements</h2>
 <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
 {[1, 2, 3, 4, 5, 6].map(i => (
 <div key={i} className="animate-pulse">
 <div className="w-full h-24 bg-gray-200 rounded-lg mb-2"></div>
 <div className="h-3 bg-gray-200 rounded w-3/4 mx-auto"></div>
 </div>
 ))}
 </div>
 </div>
 );
 }

 return (
 <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
 <div className="flex items-center justify-between mb-6">
 <h2 className="text-xl font-bold text-gray-900">Achievements</h2>
 <span className="text-sm text-gray-500">
 {badges.filter(b => b.earned).length}/{badges.length}
 </span>
 </div>

 {badges.length === 0 ? (
 <div className="text-center py-8">
 <div className="text-gray-400 text-4xl mb-3"></div>
 <p className="text-gray-500 text-sm">Aucun achievement</p>
 <p className="text-gray-400 text-xs">Passez des tests pour débloquer des badges</p>
 </div>
 ) : (
 <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
 {badges.map((badge) => (
 <div
 key={badge.id}
 className={`relative p-4 rounded-lg border-2 transition-all duration-300 ${
 badge.earned
 ? `bg-gradient-to-br ${getRarityColor(badge.rarity)} shadow-lg hover:scale-105`
 : 'bg-gray-100 border-gray-200 opacity-60'
 }`}
 >
 <div className="text-center">
 <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${
 badge.earned ? 'bg-white bg-opacity-20' : 'bg-gray-300'
 }`}>
 <badge.icon className={`text-xl ${
 badge.earned ? 'text-white' : 'text-gray-500'
 }`} />
 </div>

 <h3 className={`font-semibold text-xs mb-1 ${
 badge.earned ? 'text-white' : 'text-gray-600'
 }`}>
 {badge.name}
 </h3>

 <p className={`text-xs ${
 badge.earned ? 'text-white text-opacity-80' : 'text-gray-500'
 }`}>
 {badge.description}
 </p>

 {/* Progress pour badges non obtenus */}
 {!badge.earned && badge.progress !== undefined && (
 <div className="mt-2">
 <div className="w-full bg-gray-300 rounded-full h-1">
 <div
 className="bg-blue-500 h-1 rounded-full transition-all duration-300"
 style={{ width: `${(badge.progress / badge.target) * 100}%` }}
 ></div>
 </div>
 <p className="text-xs text-gray-500 mt-1">
 {badge.progress}/{badge.target}
 </p>
 </div>
 )}

 {/* Date d'obtention */}
 {badge.earned && badge.earnedDate && (
 <p className="text-xs text-white text-opacity-60 mt-2">
 {new Date(badge.earnedDate).toLocaleDateString('fr-FR')}
 </p>
 )}
 </div>

 {/* Indicateur de rareté */}
 {badge.earned && (
 <div className="absolute top-1 right-1">
 <div className={`w-2 h-2 rounded-full ${
 badge.rarity === 'legendary' ? 'bg-purple-300' :
 badge.rarity === 'gold' ? 'bg-yellow-300' :
 badge.rarity === 'silver' ? 'bg-gray-300' : 'bg-orange-300'
 }`}></div>
 </div>
 )}
 </div>
 ))}
 </div>
 )}
 </div>
 );
};

export default DynamicBadges;
