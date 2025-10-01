import React, { useState, useEffect } from 'react';
import {
 BriefcaseIcon,
 MapPinIcon,
 CurrencyDollarIcon,
 StarIcon,
 ArrowTopRightOnSquareIcon,
 ExclamationTriangleIcon,
 ChartBarIcon,
 TrophyIcon,
 AcademicCapIcon
} from '@heroicons/react/24/outline';
import dashboardApi from '../services/dashboardApi';

const JobRecommendations = ({ data, onViewAll, onNavigateToTest, limit = 3 }) => {
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState(null);
 const [jobs, setJobs] = useState([]);

 // Use data from props or fetch if not provided
 useEffect(() => {
 if (data && Array.isArray(data) && data.length > 0) {
 // Use data passed from parent (dashboard aggregated API)
 const limitedJobs = data.slice(0, limit);
 setJobs(limitedJobs);
 setLoading(false);
 setError(null);
 } else if (data === null || data === undefined) {
 // Fallback: fetch data directly when no data is provided
 const fetchJobRecommendations = async () => {
 try {
 setLoading(true);
 setError(null);
 const apiData = await dashboardApi.getJobRecommendations(limit);
 setJobs(Array.isArray(apiData) ? apiData : []);
 } catch (err) {
 console.error('Error fetching job recommendations:', err);
 setError('Failed to load job recommendations');
 setJobs([]);
 } finally {
 setLoading(false);
 }
 };

 fetchJobRecommendations();
 } else {
 // Data is provided but empty or invalid
 setJobs([]);
 setLoading(false);
 setError(null);
 }
 }, [data, limit]);

 const getMatchColor = (match) => {
 if (match >= 80) return 'text-green-600 bg-green-50';
 if (match >= 60) return 'text-yellow-600 bg-yellow-50';
 return 'text-red-600 bg-red-50';
 };

 const getMatchLabel = (match) => {
 if (match >= 80) return 'Excellent Match';
 if (match >= 60) return 'Good Match';
 return 'Fair Match';
 };

 const handleStartTest = (test) => {
 console.log('Starting test:', test);
 // Navigate to test or handle test start logic
 setShowTestModal(false);
 // You can add navigation logic here
 };

 if (loading) {
 return (
 <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
 <div className="animate-pulse">
 <div className="flex items-center justify-between mb-6">
 <div className="flex items-center space-x-3">
 <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
 <div>
 <div className="h-6 w-48 bg-gray-200 rounded mb-2"></div>
 <div className="h-4 w-32 bg-gray-200 rounded"></div>
 </div>
 </div>
 <div className="h-8 w-24 bg-gray-200 rounded"></div>
 </div>
 <div className="space-y-4">
 {[...Array(limit)].map((_, i) => (
 <div key={i} className="border border-gray-200 rounded-lg p-4">
 <div className="flex justify-between items-start mb-3">
 <div className="flex-1">
 <div className="h-5 w-48 bg-gray-200 rounded mb-2"></div>
 <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
 <div className="h-4 w-24 bg-gray-200 rounded"></div>
 </div>
 <div className="h-8 w-16 bg-gray-200 rounded"></div>
 </div>
 <div className="flex space-x-4">
 <div className="h-4 w-20 bg-gray-200 rounded"></div>
 <div className="h-4 w-16 bg-gray-200 rounded"></div>
 <div className="h-4 w-24 bg-gray-200 rounded"></div>
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>
 );
 }

 if (error) {
 return (
 <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
 <div className="text-center py-8">
 <ExclamationTriangleIcon className="w-12 h-12 text-red-500 mx-auto mb-4" />
 <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to Load Jobs</h3>
 <p className="text-gray-600 mb-4">{error}</p>
 <button
 onClick={() => window.location.reload()}
 className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
 >
 Retry
 </button>
 </div>
 </div>
 );
 }

 return (
 <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
 {/* Header */}
 <div className="flex items-center justify-between mb-4">
 <div className="flex items-center space-x-3">
 <div className="p-2 bg-green-100 rounded-lg">
 <BriefcaseIcon className="w-6 h-6 text-green-600" />
 </div>
 <div>
 <h2 className="text-lg font-semibold text-gray-900">Job Recommendations</h2>
 <p className="text-sm text-gray-500">Based on your skills and test results</p>
 </div>
 </div>

 {onViewAll && (
 <button
 onClick={onViewAll}
 className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
 >
 <span>View All</span>
 <ArrowTopRightOnSquareIcon className="w-4 h-4" />
 </button>
 )}
 </div>

 {/* Job Cards */}
 <div className="space-y-3">
 {jobs.length === 0 ? (
 <div className="text-center py-6">
 <BriefcaseIcon className="w-10 h-10 text-gray-400 mx-auto mb-3" />
 <h3 className="text-base font-semibold text-gray-900 mb-2">No Jobs Available</h3>
 <p className="text-sm text-gray-600 mb-3">Complete more tests to get personalized job recommendations</p>
 <div className="text-xs text-gray-500">
 <p>• Take skills assessments to improve matching</p>
 <p>• Update your profile with relevant skills</p>
 </div>
 </div>
 ) : (
 jobs.slice(0, 2).map((job) => (
 <div key={job.id} className="border border-gray-200 rounded-lg p-3 hover:border-blue-300 hover:shadow-sm transition-all duration-200">
 <div className="flex justify-between items-start mb-2">
 <div className="flex-1 min-w-0">
 <h3 className="text-base font-semibold text-gray-900 mb-1 truncate">{job.title}</h3>
 <p className="text-sm text-gray-600 mb-2 flex items-center">
 <span>{job.company}</span>
 {job.job_type && (
 <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-md">
 {job.job_type}
 </span>
 )}
 </p>
 <div className="flex items-center space-x-3 text-xs text-gray-500">
 <div className="flex items-center space-x-1">
 <MapPinIcon className="w-3 h-3" />
 <span className="truncate">{job.location}</span>
 {job.remote && (
 <span className="ml-1 px-1 py-0.5 bg-green-100 text-green-700 text-xs rounded">
 Remote
 </span>
 )}
 </div>
 <div className="flex items-center space-x-1">
 <CurrencyDollarIcon className="w-3 h-3" />
 <span className="truncate">{job.salary}</span>
 </div>
 </div>
 </div>

 {/* Match Score */}
 <div className="text-right ml-2">
 <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getMatchColor(job.match)}`}>
 <StarIcon className="w-3 h-3 mr-1" />
 {job.match}%
 </div>
 <p className="text-xs text-gray-500 mt-1">{getMatchLabel(job.match)}</p>
 </div>
 </div>

 {/* Skills */}
 {job.skills && job.skills.length > 0 && (
 <div className="flex flex-wrap gap-1 mt-2">
 {job.skills.slice(0, 3).map((skill, index) => (
 <span
 key={index}
 className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md font-medium"
 >
 {skill}
 </span>
 ))}
 {job.skills.length > 3 && (
 <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
 +{job.skills.length - 3}
 </span>
 )}
 </div>
 )}
 </div>
 ))
 )}
 </div>

 {/* Quick Stats & Tips */}
 {jobs.length > 0 ? (
 <div className="mt-4 pt-3 border-t border-gray-200">
 <div className="grid grid-cols-2 gap-3 text-center mb-3">
 <div className="p-2 bg-green-50 rounded-lg">
 <div className="text-sm font-bold text-green-600">
 {jobs.filter(job => job.match >= 80).length}
 </div>
 <div className="text-xs text-green-700 font-medium">Excellent</div>
 </div>
 <div className="p-2 bg-blue-50 rounded-lg">
 <div className="text-sm font-bold text-blue-600">
 {Math.round(jobs.reduce((sum, job) => sum + job.match, 0) / jobs.length)}%
 </div>
 <div className="text-xs text-blue-700 font-medium">Avg Match</div>
 </div>
 </div>
 <div className="text-center">
 <p className="text-xs text-gray-600">
 Based on your skills and test performance
 </p>
 </div>
 </div>
 ) : (
 <div className="mt-4 pt-3 border-t border-gray-200">
 <h4 className="text-sm font-semibold text-gray-900 mb-2">Quick Tips</h4>
 <div className="space-y-1 text-xs text-gray-600">
 <p>• Complete more assessments to improve job matching accuracy</p>
 <p>• Focus on skills that appear frequently in your target roles</p>
 <p>• Consider taking specialized tests for your desired career path</p>
 </div>
 </div>
 )}

 </div>
 );
};

export default JobRecommendations;