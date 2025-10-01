import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import recommendationApi from '../services/recommendationApi';
import {
 MagnifyingGlassIcon,
 FunnelIcon,
 MapPinIcon,
 CurrencyDollarIcon,
 ClockIcon,
 BuildingOfficeIcon,
 BriefcaseIcon,
 StarIcon,
 HeartIcon,
 ShareIcon,
 ArrowRightIcon,
 AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

const JobListingsPage = () => {
 const navigate = useNavigate();
 const { user } = useAuth();
 const [jobs, setJobs] = useState([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState(null);
 const [savedJobs, setSavedJobs] = useState(new Set());

 const [filters, setFilters] = useState({
 search: '',
 location: '',
 industry: '',
 jobType: '',
 salaryMin: '',
 salaryMax: '',
 remote: false,
 seniority: ''
 });

 const [showFilters, setShowFilters] = useState(false);
 const [sortBy, setSortBy] = useState('posted_at');
 const [hideSales, setHideSales] = useState(false);

 // Load all job offers from the database with recommendation scores
 useEffect(() => {
 const loadJobs = async () => {
 try {
 setLoading(true);

 // Fetch job offers from backend recommendation API
 const apiResult = await recommendationApi.getAllJobOffers();
 const jobsData = (apiResult && apiResult.results) || [];

 // Load user preferences/profile to filter irrelevant industries (e.g., Sales for devs)
 let userPrefs = null;
 let profileForRecommendations = null;

 try {
 if (user) {
 userPrefs = await recommendationApi.getUserPreferences();
 // Try to load candidate profile used by recommendation engine
 const profileResp = await recommendationApi.makeRequest('/profile/');
 profileForRecommendations = profileResp || null;
 }
 } catch (prefErr) {
 // Non-fatal - we will apply best-effort filtering
 console.log('Could not load user preferences/profile for recommendation filtering', prefErr);
 }

 // Apply client-side profile filtering: hide sales roles for developer-like profiles
 const isDevLike = (() => {
 // If user preferences explicitly mention preferred industries, check for software/dev indicators
 if (userPrefs) {
 const prefs = userPrefs.preferred_industries || userPrefs.preferredJobTypes || userPrefs.preferred_job_types || [];
 // If user prefers non-sales industries or explicitly lists software, consider dev-like
 if (Array.isArray(prefs) && prefs.length > 0) {
 const joined = prefs.join(' ').toLowerCase();
 return joined.includes('software') || joined.includes('development') || joined.includes('it') || joined.includes('tech');
 }
 }

 // Inspect candidate profile skills
 if (profileForRecommendations && profileForRecommendations.skills) {
 const skillNames = (profileForRecommendations.skills || []).map(s => (s.name || '').toLowerCase()).join(' ');
 return /(java|javascript|react|python|django|node|typescript|frontend|backend|devops|aws|azure)/.test(skillNames);
 }

 // Fall back to checking authenticated user's basic role (if available)
 if (user && user.roles) {
 return user.roles.includes('developer') || user.roles.includes('dev');
 }

 return false;
 })();
 // Filter out sales-related offers unless user explicitly prefers sales
 // We'll allow a UI toggle to override this behavior for visibility/debugging
 const hideSalesEffective = hideSales || isDevLike; // default hide for dev-like users
 const filteredByProfile = (() => {
 const filtered = [];
 const kept = [];

 const prefersSales = (userPrefs && ((userPrefs.preferred_industries || []).join(' ').toLowerCase().includes('sales')));

 jobsData.forEach(job => {
 if (!isDevLike) {
 kept.push(job);
 return;
 }

 const industry = (job.industry || job.title || '').toString().toLowerCase();
 const tags = (Array.isArray(job.tags) ? job.tags.join(' ') : (job.tags || '')).toLowerCase();
 const requiredSkillNames = (job.required_skills || []).map(s => (s.name || '').toLowerCase()).join(' ');
 const preferredSkillNames = (job.preferred_skills || []).map(s => (s.name || '').toLowerCase()).join(' ');

 const combined = `${industry} ${tags} ${requiredSkillNames} ${preferredSkillNames}`;

 if (/\bsales\b|account executive|business development|\bbdm\b|commercial|salesforce/.test(combined)) {
 // If user explicitly prefers sales, keep it regardless
 if (prefersSales) {
 kept.push(job);
 } else {
 filtered.push({ job, reason: 'sales-like' });
 }
 } else {
 kept.push(job);
 }
 });

 // If hideSalesEffective is true, remove filtered items
 if (hideSalesEffective) {
 console.debug(`Profile filtering: removed ${filtered.length} sales-like jobs`, filtered.map(f => ({ id: f.job.id, title: f.job.title })));
 return kept;
 }

 // If not hiding sales, return all jobs
 return jobsData;
 })();

 // If authenticated, request recommendation score per job (best-effort)
 if (user) {
 const token = localStorage.getItem('access_token');
 const jobsWithScores = await Promise.all(
 filteredByProfile.map(async (job) => {
 try {
 // Use the recommendations endpoint to ask for a job-specific recommendation
 const rec = await recommendationApi.makeRequest(`/api/cognitive/job/${job.id}/recommendations/`);
 // rec may be admin-only; fallback to zero
 const overall = Array.isArray(rec?.recommendations) && rec.recommendations.length ? (rec.recommendations[0].overall_score || 0) : 0;
 const scoreNormalized = overall > 1 ? overall / 100 : overall; // handle 0-100 vs 0-1
 return {
 ...job,
 recommendationScore: scoreNormalized || 0,
 canApply: (scoreNormalized || 0) >= 0.4
 };
 } catch (err) {
 // Silent fallback
 return { ...job, recommendationScore: 0, canApply: false };
 }
 })
 );

 setJobs(jobsWithScores);
 } else {
 // Unauthenticated users see job offers without recommendation scores
 setJobs(filteredByProfile.map(job => ({ ...job, recommendationScore: 0, canApply: false })));
 }

 console.log(`Loaded ${filteredByProfile.length} jobs from database (filtered from ${jobsData.length})`);

 } catch (error) {
 console.error('Error loading jobs:', error);
 setError('Failed to load job offers. Please try again.');
 } finally {
 setLoading(false);
 }
 };

 loadJobs();
 }, [user]);

 // Handle job application
 const handleApplyToJob = (job) => {
 if (!job.canApply) {
 alert('Your match score is too low to apply for this position. Consider improving your skills or taking more assessments.');
 return;
 }

 // Navigate to application page or open modal
 navigate(`/jobs/${job.id}/apply`);
 };

 // Handle saving jobs
 const handleSaveJob = (jobId) => {
 const newSavedJobs = new Set(savedJobs);
 if (newSavedJobs.has(jobId)) {
 newSavedJobs.delete(jobId);
 } else {
 newSavedJobs.add(jobId);
 }
 setSavedJobs(newSavedJobs);

 // Save to localStorage
 localStorage.setItem('savedJobs', JSON.stringify([...newSavedJobs]));
 };

 // Utility functions
 const formatSalary = (min, max, currency = 'MAD') => {
 if (!min && !max) return 'Salary not specified';
 if (min && max) return `${min.toLocaleString()} - ${max.toLocaleString()} ${currency}`;
 if (min) return `From ${min.toLocaleString()} ${currency}`;
 if (max) return `Up to ${max.toLocaleString()} ${currency}`;
 };

 const getIndustryColor = (industry) => {
 const colors = {
 'Software Development': 'border-blue-200 text-blue-800 bg-blue-50 dark:border-blue-800 dark:text-blue-200 dark:bg-blue-900/20',
 'Data & Analytics': 'border-purple-200 text-purple-800 bg-purple-50 dark:border-purple-800 dark:text-purple-200 dark:bg-purple-900/20',
 'Digital Marketing': 'border-green-200 text-green-800 bg-green-50 dark:border-green-800 dark:text-green-200 dark:bg-green-900/20',
 'Finance & Banking': 'border-yellow-200 text-yellow-800 bg-yellow-50 dark:border-yellow-800 dark:text-yellow-200 dark:bg-yellow-900/20',
 'Engineering': 'border-red-200 text-red-800 bg-red-50 dark:border-red-800 dark:text-red-200 dark:bg-red-900/20',
 'Healthcare': 'border-pink-200 text-pink-800 bg-pink-50 dark:border-pink-800 dark:text-pink-200 dark:bg-pink-900/20',
 };
 return colors[industry] || 'border-slate-200 text-slate-800 bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:bg-slate-700';
 };

 // Filter and sort jobs
 const filteredJobs = jobs.filter(job => {
 const matchesSearch = !filters.search ||
 job.title.toLowerCase().includes(filters.search.toLowerCase()) ||
 job.company.toLowerCase().includes(filters.search.toLowerCase()) ||
 job.description?.toLowerCase().includes(filters.search.toLowerCase());

 const matchesLocation = !filters.location || job.location === filters.location;
 const matchesIndustry = !filters.industry || job.industry === filters.industry;
 const matchesJobType = !filters.jobType || job.job_type === filters.jobType;
 const matchesSeniority = !filters.seniority || job.seniority === filters.seniority;
 const matchesRemote = !filters.remote || job.remote_flag;

 const matchesSalary = (!filters.salaryMin || (job.salary_min && job.salary_min >= parseInt(filters.salaryMin))) &&
 (!filters.salaryMax || (job.salary_max && job.salary_max <= parseInt(filters.salaryMax)));

 return matchesSearch && matchesLocation && matchesIndustry &&
 matchesJobType && matchesSeniority && matchesRemote && matchesSalary;
 }).sort((a, b) => {
 switch (sortBy) {
 case 'salary_desc':
 return (b.salary_max || 0) - (a.salary_max || 0);
 case 'salary_asc':
 return (a.salary_min || 0) - (b.salary_min || 0);
 case 'company':
 return a.company.localeCompare(b.company);
 case 'location':
 return a.location.localeCompare(b.location);
 default:
 return new Date(b.posted_at || b.updated_at) - new Date(a.posted_at || a.updated_at);
 }
 });

 if (loading) {
 return (
 <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
 <div className="flex items-center justify-center min-h-screen">
 <div className="flex flex-col items-center">
 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
 <p className="mt-4 text-gray-600 dark:text-gray-400">Loading job offers...</p>
 </div>
 </div>
 </div>
 );
 }

 if (error) {
 return (
 <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
 <div className="flex items-center justify-center min-h-screen">
 <div className="text-center">
 <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
 <button
 onClick={() => window.location.reload()}
 className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
 >
 Try Again
 </button>
 </div>
 </div>
 </div>
 );
 }

 return (
 <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
 {/* Header */}
 <div className="border-b border-slate-200/60 dark:border-slate-700/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl sticky top-0 z-10">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <div className="flex items-center justify-between py-6">
 <div className="flex items-center space-x-4">
 <div className="flex items-center space-x-3">
 <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
 <BriefcaseIcon className="w-6 h-6 text-white" />
 </div>
 <div>
 <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
 All Job Offers
 </h1>
 <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
 {filteredJobs.length} opportunities available
 </p>
 </div>
 </div>
 </div>

 <div className="flex items-center space-x-4">
 <select
 value={sortBy}
 onChange={(e) => setSortBy(e.target.value)}
 className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm"
 >
 <option value="posted_at">Latest First</option>
 <option value="salary_desc">Highest Salary</option>
 <option value="salary_asc">Lowest Salary</option>
 <option value="company">Company A-Z</option>
 <option value="location">Location A-Z</option>
 </select>
 </div>
 </div>
 </div>
 </div>

 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
 <div className="flex items-center justify-end">
 <label className="flex items-center space-x-2 text-sm text-slate-700 dark:text-slate-300">
 <input
 type="checkbox"
 checked={hideSales}
 onChange={(e) => setHideSales(e.target.checked)}
 className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
 />
 <span>Hide Sales roles</span>
 </label>
 </div>
 </div>

 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
 {/* Search and Filters */}
 <div className="mb-8">
 <div className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-200/60 dark:border-slate-700/60 p-6 shadow-lg">
 <div className="flex items-center space-x-4 mb-4">
 <div className="flex-1 relative">
 <MagnifyingGlassIcon className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
 <input
 type="text"
 placeholder="Search jobs, companies, or keywords..."
 value={filters.search}
 onChange={(e) => setFilters({ ...filters, search: e.target.value })}
 className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
 />
 </div>

 <button
 onClick={() => setShowFilters(!showFilters)}
 className={`group flex items-center space-x-2 px-4 py-3 border rounded-xl font-medium transition-all duration-200 ${showFilters
 ? 'border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-600 dark:bg-blue-900/20 dark:text-blue-300'
 : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600'
 }`}
 >
 <FunnelIcon className="w-4 h-4" />
 <span>Filters</span>
 </button>
 </div>

 {/* Expanded Filters */}
 {showFilters && (
 <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
 <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
 <div>
 <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
 Location
 </label>
 <select
 value={filters.location}
 onChange={(e) => setFilters({ ...filters, location: e.target.value })}
 className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
 >
 <option value="">All locations</option>
 <option value="Casablanca">Casablanca</option>
 <option value="Rabat">Rabat</option>
 <option value="Marrakech">Marrakech</option>
 <option value="Fès">Fès</option>
 <option value="Tangier">Tangier</option>
 <option value="Agadir">Agadir</option>
 </select>
 </div>

 <div>
 <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
 Industry
 </label>
 <select
 value={filters.industry}
 onChange={(e) => setFilters({ ...filters, industry: e.target.value })}
 className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
 >
 <option value="">All industries</option>
 <option value="Software Development">Software Development</option>
 <option value="Data & Analytics">Data & Analytics</option>
 <option value="Digital Marketing">Digital Marketing</option>
 <option value="Finance & Banking">Finance & Banking</option>
 <option value="Engineering">Engineering</option>
 <option value="Healthcare">Healthcare</option>
 </select>
 </div>

 <div>
 <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
 Seniority
 </label>
 <select
 value={filters.seniority}
 onChange={(e) => setFilters({ ...filters, seniority: e.target.value })}
 className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
 >
 <option value="">All levels</option>
 <option value="junior">Junior</option>
 <option value="intermediate">Intermediate</option>
 <option value="senior">Senior</option>
 <option value="expert">Expert</option>
 </select>
 </div>

 <div className="flex items-end">
 <label className="flex items-center space-x-2">
 <input
 type="checkbox"
 checked={filters.remote}
 onChange={(e) => setFilters({ ...filters, remote: e.target.checked })}
 className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
 />
 <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
 Remote only
 </span>
 </label>
 </div>
 </div>
 </div>
 )}
 </div>
 </div>

 {/* Job Listings Grid */}
 <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
 {filteredJobs.map((job) => (
 <div
 key={job.id}
 className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-200/60 dark:border-slate-700/60 p-6 shadow-lg hover:shadow-xl transition-all duration-300 group"
 >
 {/* Job Header */}
 <div className="flex items-start justify-between mb-4">
 <div className="flex-1">
 <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
 {job.title}
 </h3>
 <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400 mb-2">
 <BuildingOfficeIcon className="w-4 h-4" />
 <span className="font-medium">{job.company}</span>
 </div>
 </div>

 <button
 onClick={() => handleSaveJob(job.id)}
 className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
 >
 {savedJobs.has(job.id) ? (
 <HeartSolidIcon className="w-5 h-5 text-red-500" />
 ) : (
 <HeartIcon className="w-5 h-5 text-slate-400" />
 )}
 </button>
 </div>

 {/* Job Details */}
 <div className="space-y-3 mb-4">
 <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
 <MapPinIcon className="w-4 h-4" />
 <span>{job.location}</span>
 {job.remote_flag && (
 <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300 rounded-full text-xs font-medium">
 Remote
 </span>
 )}
 </div>

 <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
 <CurrencyDollarIcon className="w-4 h-4" />
 <span>{formatSalary(job.salary_min, job.salary_max, job.salary_currency)}</span>
 </div>

 {job.industry && (
 <div className="flex items-center space-x-2">
 <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getIndustryColor(job.industry)}`}>
 {job.industry}
 </span>
 {job.seniority && (
 <span className="px-2 py-1 bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300 rounded-full text-xs font-medium">
 {job.seniority}
 </span>
 )}
 </div>
 )}
 </div>

 {/* Job Description Preview */}
 {job.description && (
 <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-3">
 {job.description.substring(0, 150)}...
 </p>
 )}

 {/* Recommendation Score */}
 {user && job.recommendationScore > 0 && (
 <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
 <div className="flex items-center justify-between">
 <div className="flex items-center space-x-2">
 <StarIcon className="w-4 h-4 text-blue-600" />
 <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
 Match Score
 </span>
 </div>
 <div className="flex items-center space-x-2">
 <div className="w-16 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
 <div
 className={`h-2 rounded-full ${
 job.recommendationScore >= 0.7 ? 'bg-green-500' :
 job.recommendationScore >= 0.4 ? 'bg-yellow-500' : 'bg-red-500'
 }`}
 style={{ width: `${Math.min(job.recommendationScore * 100, 100)}%` }}
 />
 </div>
 <span className="text-sm font-bold text-blue-900 dark:text-blue-100">
 {Math.round(job.recommendationScore * 100)}%
 </span>
 </div>
 </div>
 </div>
 )}

 {/* Action Buttons */}
 <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
 <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
 <ClockIcon className="w-4 h-4" />
 <span>
 {new Date(job.posted_at || job.updated_at).toLocaleDateString()}
 </span>
 </div>

 <div className="flex items-center space-x-2">
 <button
 onClick={() => navigate(`/jobs/${job.id}`)}
 className="group flex items-center space-x-2 px-3 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200"
 >
 <span>View Details</span>
 <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
 </button>

 {user && (
 <button
 onClick={() => handleApplyToJob(job)}
 disabled={!job.canApply}
 className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
 job.canApply
 ? 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg'
 : 'bg-slate-300 dark:bg-slate-600 text-slate-500 dark:text-slate-400 cursor-not-allowed'
 }`}
 title={job.canApply ? 'Apply to this job' : 'Match score too low to apply (minimum 40% required)'}
 >
 <span>{job.canApply ? 'Apply Now' : 'Not Eligible'}</span>
 </button>
 )}
 </div>
 </div>
 </div>
 ))}
 </div>

 {/* Empty State */}
 {filteredJobs.length === 0 && (
 <div className="text-center py-12">
 <BriefcaseIcon className="w-16 h-16 text-slate-400 mx-auto mb-4" />
 <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
 No jobs found
 </h3>
 <p className="text-slate-600 dark:text-slate-400 mb-4">
 Try adjusting your search criteria or filters
 </p>
 <button
 onClick={() => setFilters({
 search: '',
 location: '',
 industry: '',
 jobType: '',
 salaryMin: '',
 salaryMax: '',
 remote: false,
 seniority: ''
 })}
 className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
 >
 Clear Filters
 </button>
 </div>
 )}
 </div>
 </div>
 );
};

export default JobListingsPage;
