import React from 'react';
import {
 ClockIcon,
 CheckCircleIcon,
 ArrowRightIcon
} from '@heroicons/react/24/outline';

const SimplifiedRecentTests = ({ onViewAll }) => {
 // Mock data - replace with API calls
 const recentTests = [
 {
 id: 1,
 name: "Verbal Reasoning",
 score: 85,
 date: "2 hours ago",
 status: "completed",
 type: "VRT1"
 },
 {
 id: 2,
 name: "Numerical Reasoning",
 score: 72,
 date: "1 day ago",
 status: "completed",
 type: "NRT1"
 },
 {
 id: 3,
 name: "Abstract Reasoning",
 score: 91,
 date: "2 days ago",
 status: "completed",
 type: "ART1"
 },
 {
 id: 4,
 name: "Diagrammatic Reasoning",
 score: 68,
 date: "3 days ago",
 status: "completed",
 type: "DRT1"
 }
 ];

 const getScoreColor = (score) => {
 if (score >= 80) return "text-green-600 bg-green-50";
 if (score >= 60) return "text-yellow-600 bg-yellow-50";
 return "text-red-600 bg-red-50";
 };

 return (
 <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
 <div className="flex items-center justify-between mb-4">
 <h3 className="text-lg font-semibold text-gray-900">Recent Tests</h3>
 <button
 onClick={onViewAll}
 className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center"
 >
 View All
 <ArrowRightIcon className="h-4 w-4 ml-1" />
 </button>
 </div>

 <div className="space-y-3">
 {recentTests.slice(0, 4).map((test) => (
 <div key={test.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
 <div className="flex items-center space-x-3">
 <div className="flex-shrink-0">
 <CheckCircleIcon className="h-5 w-5 text-green-500" />
 </div>
 <div className="min-w-0 flex-1">
 <p className="text-sm font-medium text-gray-900 truncate">
 {test.name}
 </p>
 <div className="flex items-center space-x-2 mt-1">
 <span className="text-xs text-gray-500">{test.type}</span>
 <span className="text-xs text-gray-400">•</span>
 <div className="flex items-center">
 <ClockIcon className="h-3 w-3 text-gray-400 mr-1" />
 <span className="text-xs text-gray-500">{test.date}</span>
 </div>
 </div>
 </div>
 </div>

 <div className="flex-shrink-0">
 <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getScoreColor(test.score)}`}>
 {test.score}%
 </span>
 </div>
 </div>
 ))}
 </div>

 {/* Quick Stats Summary */}
 <div className="mt-4 pt-4 border-t border-gray-200">
 <div className="flex items-center justify-between text-sm">
 <span className="text-gray-600">This week:</span>
 <div className="flex items-center space-x-4">
 <span className="text-gray-900 font-medium">4 tests</span>
 <span className="text-gray-400">•</span>
 <span className="text-gray-900 font-medium">79% avg</span>
 </div>
 </div>
 </div>
 </div>
 );
};

export default SimplifiedRecentTests;
