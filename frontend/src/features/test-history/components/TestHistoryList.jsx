import React from 'react';
import { FaEye, FaTrash, FaCalendarAlt, FaClock, FaTrophy } from 'react-icons/fa';

const TestHistoryList = ({
 sessions,
 onSessionClick,
 onDeleteSession,
 filterType,
 setFilterType,
 sortBy,
 setSortBy,
 getScoreColor,
 getTestTypeColor,
 formatDuration
}) => {
 const testTypes = [
 { value: 'all', label: 'All Tests' },
 { value: 'verbal_reasoning', label: 'Verbal Reasoning' },
 { value: 'numerical_reasoning', label: 'Numerical Reasoning' },
 { value: 'logical_reasoning', label: 'Logical Reasoning' },
 { value: 'abstract_reasoning', label: 'Abstract Reasoning' },
 { value: 'spatial_reasoning', label: 'Spatial Reasoning' },
 { value: 'situational_judgment', label: 'Situational Judgment' },
 { value: 'technical', label: 'Technical' }
 ];

 const sortOptions = [
 { value: 'date', label: 'Date (Newest First)' },
 { value: 'score', label: 'Score (Highest First)' },
 { value: 'test_name', label: 'Test Name (A-Z)' }
 ];

 return (
 <div className="space-y-6">
 {/* Filters and Controls */}
 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
 <div className="flex items-center space-x-4">
 <div className="flex items-center space-x-2">
 <FaCalendarAlt className="text-gray-500" />
 <select
 value={filterType}
 onChange={(e) => setFilterType(e.target.value)}
 className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
 >
 {testTypes.map(type => (
 <option key={type.value} value={type.value}>
 {type.label}
 </option>
 ))}
 </select>
 </div>

 <select
 value={sortBy}
 onChange={(e) => setSortBy(e.target.value)}
 className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
 >
 {sortOptions.map(option => (
 <option key={option.value} value={option.value}>
 {option.label}
 </option>
 ))}
 </select>
 </div>

 <div className="text-sm text-gray-500">
 {sessions.length} session{sessions.length !== 1 ? 's' : ''}
 </div>
 </div>

 {/* Sessions List */}
 <div className="space-y-4">
 {sessions.length === 0 ? (
 <div className="text-center py-12 bg-gray-50 rounded-xl">
 <div className="text-gray-400 text-6xl mb-4"></div>
 <h3 className="text-xl font-medium text-gray-600 mb-2">No test sessions found</h3>
 <p className="text-gray-500">
 {filterType === 'all'
 ? "You haven't completed any tests yet."
 : `No ${filterType.replace('_', ' ')} tests found.`
 }
 </p>
 </div>
 ) : (
 sessions.map((session) => (
 <div
 key={session.id}
 className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
 >
 <div className="flex items-start justify-between">
 <div className="flex-1">
 <div className="flex items-center space-x-3 mb-3">
 <h3 className="text-lg font-semibold text-gray-900">{session.test_title}</h3>
 <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTestTypeColor(session.test_type)}`}>
 {session.test_type.replace('_', ' ').toUpperCase()}
 </span>
 {session.passed && (
 <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
 PASSED
 </span>
 )}
 </div>

 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
 <div className="flex items-center space-x-2">
 <FaCalendarAlt className="text-gray-400" />
 <span className="text-gray-600">
 {new Date(session.start_time).toLocaleDateString()}
 </span>
 </div>

 <div className="flex items-center space-x-2">
 <FaClock className="text-gray-400" />
 <span className="text-gray-600">
 {formatDuration(session.duration_minutes)}
 </span>
 </div>

 <div className="flex items-center space-x-2">
 <FaTrophy className="text-gray-400" />
 <span className="text-gray-600">Status:</span>
 <span className={`px-2 py-1 rounded text-xs font-medium ${
 session.status === 'completed'
 ? 'bg-green-100 text-green-800'
 : 'bg-yellow-100 text-yellow-800'
 }`}>
 {session.status.toUpperCase()}
 </span>
 </div>

 <div className="flex items-center space-x-2">
 <span className="text-gray-600">Time Spent:</span>
 <span className="font-medium text-gray-900">
 {Math.floor(session.time_spent / 60)}m {session.time_spent % 60}s
 </span>
 </div>
 </div>
 </div>

 <div className="flex items-center gap-4">
 {/* Score Badge */}
 <div className={`px-4 py-2 rounded-lg font-bold text-lg ${getScoreColor(session.score_percentage)}`}>
 {session.score_percentage}%
 </div>

 {/* Action Buttons */}
 <div className="flex items-center gap-2">
 <button
 onClick={() => onSessionClick(session.id)}
 className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
 title="View Details"
 >
 <FaEye className="text-lg" />
 </button>
 <button
 onClick={() => onDeleteSession(session.id)}
 className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
 title="Delete Session"
 >
 <FaTrash className="text-lg" />
 </button>
 </div>
 </div>
 </div>

 {/* Progress Bar */}
 <div className="mt-4">
 <div className="flex justify-between text-sm text-gray-600 mb-1">
 <span>Performance</span>
 <span>{session.score_percentage}%</span>
 </div>
 <div className="w-full bg-gray-200 rounded-full h-2">
 <div
 className={`h-2 rounded-full transition-all duration-300 ${
 session.score_percentage >= 80 ? 'bg-green-500' :
 session.score_percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
 }`}
 style={{ width: `${session.score_percentage}%` }}
 ></div>
 </div>
 </div>

 {/* Answers Summary */}
 {session.answers && session.answers.length > 0 && (
 <div className="mt-4 pt-4 border-t border-gray-100">
 <div className="text-sm text-gray-600">
 <span className="font-medium">Answers Summary:</span>
 <div className="mt-1 flex flex-wrap gap-2">
 <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
 Correct: {session.answers.filter(a => a.is_correct).length}
 </span>
 <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">
 Incorrect: {session.answers.filter(a => !a.is_correct).length}
 </span>
 <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">
 Total: {session.answers.length}
 </span>
 </div>
 </div>
 </div>
 )}
 </div>
 ))
 )}
 </div>
 </div>
 );
};

export default TestHistoryList;
