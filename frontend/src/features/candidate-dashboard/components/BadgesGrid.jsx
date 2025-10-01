import React from 'react';
import { Trophy, Lock, Star } from 'lucide-react';

const BadgesGrid = ({ badges }) => {
 const rarityColors = {
 gold: 'sa-chip-warning',
 silver: 'sa-chip-default',
 bronze: 'sa-chip-danger'
 };

 const rarityIcons = {
 gold: <Star className="w-3 h-3" />,
 silver: <Trophy className="w-3 h-3" />,
 bronze: <Trophy className="w-3 h-3" />
 };

 return (
 <div className="sa-card sa-fade-in">
 <div className="sa-card-header">
 <div className="flex items-center justify-between">
 <h2 className="sa-heading-2">Achievements</h2>
 <div className="sa-caption">
 {badges.filter(b => b.earned).length} of {badges.length} earned
 </div>
 </div>
 </div>

 <div className="sa-grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
 {badges.map(badge => (
 <div
 key={badge.id}
 className={`relative p-4 rounded-lg border-2 transition-all duration-200 ${
 badge.earned
 ? 'border-gray-200 bg-gradient-to-br from-white to-gray-50 hover:shadow-md'
 : 'border-gray-100 bg-gray-50 opacity-60'
 }`}
 >
 <div className="flex flex-col items-center text-center">
 <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${
 badge.earned ?
 (badge.rarity === 'gold' ? 'from-yellow-400 to-yellow-600' :
 badge.rarity === 'silver' ? 'from-gray-300 to-gray-500' :
 'from-orange-400 to-orange-600') :
 'from-gray-300 to-gray-400'
 } flex items-center justify-center mb-3 ${
 badge.earned ? 'shadow-lg' : ''
 }`}>
 <span className="text-white text-xl font-bold">
 {badge.earned ? '' : <Lock className="w-6 h-6" />}
 </span>
 </div>

 <h3 className={`sa-body font-semibold ${
 badge.earned ? 'text-gray-900' : 'text-gray-500'
 }`}>
 {badge.name}
 </h3>

 {badge.earned && (
 <div className={`mt-2 sa-chip ${rarityColors[badge.rarity]}`}>
 {rarityIcons[badge.rarity]}
 {badge.rarity.charAt(0).toUpperCase() + badge.rarity.slice(1)}
 </div>
 )}
 </div>

 {!badge.earned && (
 <div className="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-80 rounded-lg">
 <div className="text-center">
 <Lock className="w-6 h-6 mx-auto mb-1 text-gray-400" />
 <div className="sa-caption">Locked</div>
 </div>
 </div>
 )}
 </div>
 ))}
 </div>
 </div>
 );
};

export default BadgesGrid;