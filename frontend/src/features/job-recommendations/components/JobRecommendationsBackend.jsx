import React, { useState, useEffect } from 'react';
import {
  BriefcaseIcon,
  MapPinIcon,
  ClockIcon,
  CurrencyDollarIcon,
  BookmarkIcon,
  EyeIcon,
  ChevronRightIcon,
  StarIcon,
  TagIcon,
  SparklesIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  UserGroupIcon,
  CheckCircleIcon,
  HeartIcon,
  PencilIcon,
  PlusCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolidIcon, HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { useJobRecommendations } from '../../../hooks/useJobRecommendations';
import { loadUserProfile } from '../../../utils/profileUtils';

const JobRecommendationsBackend = ({
  maxJobs = 6,
  showSkillsAnalysis = true,
  autoRefresh = false
}) => {
  const {
    recommendations,
    loading,
    error,
    userPreferences,
    skillsAnalysis,
    userProfile,
    updateRecommendationStatus,
    applyToJob,
    refresh
  } = useJobRecommendations({
    limit: maxJobs,
    minScore: 50,
    autoLoad: true,
    refreshInterval: autoRefresh ? 300000 : null // 5 minutes
  });

  const [savedJobs, setSavedJobs] = useState(new Set());
  const [applyingJobs, setApplyingJobs] = useState(new Set());
  const [likedJobs, setLikedJobs] = useState(new Set());

  // Load saved jobs from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('savedJobs');
    if (saved) {
      try {
        setSavedJobs(new Set(JSON.parse(saved)));
      } catch (error) {
        console.error('Error loading saved jobs:', error);
      }
    }
  }, []);

  // Save jobs to localStorage
  const saveJobsToStorage = (jobs) => {
    try {
      localStorage.setItem('savedJobs', JSON.stringify([...jobs]));
    } catch (error) {
      console.error('Error saving jobs:', error);
    }
  };

  const handleSaveJob = (jobId) => {
    const newSavedJobs = new Set(savedJobs);
    if (newSavedJobs.has(jobId)) {
      newSavedJobs.delete(jobId);
    } else {
      newSavedJobs.add(jobId);
    }
    setSavedJobs(newSavedJobs);
    saveJobsToStorage(newSavedJobs);
  };

  const handleLikeJob = (jobId) => {
    const newLikedJobs = new Set(likedJobs);
    if (newLikedJobs.has(jobId)) {
      newLikedJobs.delete(jobId);
    } else {
      newLikedJobs.add(jobId);
    }
    setLikedJobs(newLikedJobs);
  };

  const handleApplyToJob = async (jobId) => {
    setApplyingJobs(prev => new Set(prev).add(jobId));
    try {
      await applyToJob(jobId, 'Je suis très intéressé par cette opportunité.');
      // Update recommendation status to applied
      await updateRecommendationStatus(jobId, 'applied');
    } catch (error) {
      console.error('Error applying to job:', error);
    } finally {
      setApplyingJobs(prev => {
        const newSet = new Set(prev);
        newSet.delete(jobId);
        return newSet;
      });
    }
  };

  const handleViewJob = async (jobId) => {
    try {
      await updateRecommendationStatus(jobId, 'viewed');
    } catch (error) {
      console.error('Error updating job status:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center space-y-6">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-slate-200 dark:border-slate-700 rounded-full"></div>
                <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  Loading opportunities
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Finding the best matches for your profile...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center py-20">
            <div className="relative inline-flex items-center justify-center w-24 h-24 mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-full blur-xl"></div>
              <div className="relative w-24 h-24 bg-gradient-to-r from-red-100 to-orange-100 dark:from-red-900/20 dark:to-orange-900/20 rounded-2xl flex items-center justify-center shadow-lg">
                <ExclamationTriangleIcon className="w-12 h-12 text-red-500 dark:text-red-400" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Something went wrong
            </h3>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-lg mx-auto leading-relaxed">
              {error}
            </p>
            <button
              onClick={refresh}
              className="group inline-flex items-center px-6 py-3 bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <ArrowPathIcon className="w-5 h-5 mr-2 group-hover:rotate-180 transition-transform duration-300" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Main Content Area */}
      <main className="w-full overflow-y-auto">
        {/* Modern Header */}
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
                      Job Recommendations
                    </h1>
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                      {recommendations.length} opportunities found
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {skillsAnalysis && (
                  <div className="hidden sm:flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200/50 dark:border-blue-700/50">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                      {skillsAnalysis.total_skills} skills analyzed
                    </span>
                  </div>
                )}
                <button
                  onClick={refresh}
                  disabled={loading}
                  className={`group relative px-4 py-2.5 rounded-xl font-medium transition-all duration-200 ${loading
                    ? 'bg-slate-100 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                    : 'bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white shadow-lg hover:shadow-xl'
                    }`}
                >
                  <div className="flex items-center space-x-2">
                    <ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin' : 'group-hover:rotate-180'} transition-transform duration-300`} />
                    <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modern No Results State */}
        {recommendations.length === 0 && !loading && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <div className="relative inline-flex items-center justify-center w-24 h-24 mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-full blur-xl"></div>
                <div className="relative w-24 h-24 bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-2xl flex items-center justify-center shadow-lg">
                  <BriefcaseIcon className="w-12 h-12 text-slate-400" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                No opportunities found
              </h3>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-lg mx-auto leading-relaxed">
                We couldn't find any jobs matching your current skills. Try adding more skills to your profile or check back later.
              </p>
              <button
                onClick={refresh}
                className="group inline-flex items-center px-6 py-3 bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <ArrowPathIcon className="w-5 h-5 mr-2 group-hover:rotate-180 transition-transform duration-300" />
                Refresh recommendations
              </button>
            </div>
          </div>
        )}

        {/* Modern Job List */}
        {recommendations.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid gap-6">
              {recommendations.map((recommendation, index) => {
                const job = recommendation.job;
                const isSaved = savedJobs.has(job.id);
                const isLiked = likedJobs.has(job.id);
                const isApplying = applyingJobs.has(job.id);

                return (
                  <div
                    key={job.id}
                    className="group relative bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 p-6 transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 hover:border-slate-300/60 dark:hover:border-slate-600/60"
                  >
                    {/* Match Score Badge */}
                    <div className="absolute -top-3 -right-3">
                      <div className="flex items-center space-x-1 px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-green-500 text-white text-sm font-semibold rounded-full shadow-lg">
                        <StarIcon className="w-4 h-4" />
                        <span>{Math.round(recommendation.overall_score)}%</span>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      {/* Company Avatar */}
                      <div className="flex-shrink-0">
                        <div className="relative">
                          <div className="w-14 h-14 bg-gradient-to-br from-slate-600 to-slate-800 dark:from-slate-500 dark:to-slate-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                            <span className="text-white font-bold text-lg">
                              {job.company.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                      </div>

                      {/* Job Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            {/* Job Title & Company */}
                            <div className="mb-3">
                              <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-1">
                                {job.title}
                              </h3>
                              <p className="text-lg text-slate-600 dark:text-slate-400 font-medium">
                                {job.company}
                              </p>
                            </div>

                            {/* Job Meta */}
                            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-4">
                              <div className="flex items-center space-x-1.5">
                                <MapPinIcon className="w-4 h-4" />
                                <span className="font-medium">{job.location}</span>
                              </div>
                              <div className="flex items-center space-x-1.5">
                                <ClockIcon className="w-4 h-4" />
                                <span className="font-medium">{job.job_type}</span>
                              </div>
                              <div className="flex items-center space-x-1.5">
                                <CalendarIcon className="w-4 h-4" />
                                <span className="font-medium">2 days ago</span>
                              </div>
                            </div>

                            {/* Salary & Seniority */}
                            <div className="flex flex-wrap items-center gap-4 mb-4">
                              <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400">
                                <CurrencyDollarIcon className="w-5 h-5" />
                                <span className="font-semibold">
                                  {job.salary_min && job.salary_max
                                    ? `${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()} MAD`
                                    : 'Salary not specified'}
                                </span>
                              </div>
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                                {job.seniority}
                              </span>
                            </div>

                            {/* Description */}
                            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4 line-clamp-2">
                              {job.description}
                            </p>

                            {/* Skills */}
                            {recommendation.matched_skills && recommendation.matched_skills.length > 0 && (
                              <div className="mb-4">
                                <div className="flex items-center space-x-2 mb-2">
                                  <TagIcon className="w-4 h-4 text-blue-500" />
                                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    Matching Skills
                                  </span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {recommendation.matched_skills.slice(0, 6).map((skill, skillIndex) => (
                                    <span
                                      key={skillIndex}
                                      className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200/50 dark:border-blue-700/50"
                                    >
                                      {skill}
                                    </span>
                                  ))}
                                  {recommendation.matched_skills.length > 6 && (
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                                      +{recommendation.matched_skills.length - 6} more
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex flex-col items-end space-y-3 ml-6">
                            {/* Action Buttons */}
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleLikeJob(job.id)}
                                className={`p-2.5 rounded-lg transition-all duration-200 ${isLiked
                                  ? 'text-red-500 bg-red-50 dark:bg-red-900/20 shadow-sm'
                                  : 'text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                                  }`}
                              >
                                {isLiked ? (
                                  <HeartSolidIcon className="w-5 h-5" />
                                ) : (
                                  <HeartIcon className="w-5 h-5" />
                                )}
                              </button>
                              <button
                                onClick={() => handleSaveJob(job.id)}
                                className={`p-2.5 rounded-lg transition-all duration-200 ${isSaved
                                  ? 'text-amber-500 bg-amber-50 dark:bg-amber-900/20 shadow-sm'
                                  : 'text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20'
                                  }`}
                              >
                                {isSaved ? (
                                  <BookmarkSolidIcon className="w-5 h-5" />
                                ) : (
                                  <BookmarkIcon className="w-5 h-5" />
                                )}
                              </button>
                            </div>

                            {/* Apply Button */}
                            <button
                              onClick={() => handleApplyToJob(job.id)}
                              disabled={isApplying || recommendation.status === 'applied'}
                              className={`group relative px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${recommendation.status === 'applied'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300 cursor-default'
                                : isApplying
                                  ? 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400 cursor-not-allowed'
                                  : 'bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white shadow-lg hover:shadow-xl'
                                }`}
                            >
                              {isApplying ? (
                                <div className="flex items-center space-x-2">
                                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                  <span>Applying...</span>
                                </div>
                              ) : recommendation.status === 'applied' ? (
                                <div className="flex items-center space-x-2">
                                  <CheckCircleIcon className="w-4 h-4" />
                                  <span>Applied</span>
                                </div>
                              ) : (
                                'Apply Now'
                              )}
                            </button>

                            {/* View Details */}
                            <button
                              onClick={() => handleViewJob(job.id)}
                              className="flex items-center space-x-1.5 text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                            >
                              <EyeIcon className="w-4 h-4" />
                              <span>View Details</span>
                              <ChevronRightIcon className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default JobRecommendationsBackend;