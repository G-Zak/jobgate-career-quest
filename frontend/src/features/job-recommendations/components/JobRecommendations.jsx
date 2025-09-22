import React, { useState, useEffect, useMemo } from 'react';
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
import { jobOffers } from '../../../data/jobOffers';
import { loadUserProfile } from '../../../utils/profileUtils';

const JobRecommendations = ({
  userId,
  userSkills = [],
  userLocation = "Casablanca",
  maxJobs = 6,
  onProfileChange,
  realTimeUpdate = true
}) => {
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState(new Set());
  const [applyingJobs, setApplyingJobs] = useState(new Set());
  const [likedJobs, setLikedJobs] = useState(new Set());
  const [expandedDescriptions, setExpandedDescriptions] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [lastUpdateTime, setLastUpdateTime] = useState(Date.now());

  // Load user profile from localStorage
  useEffect(() => {
    const profile = loadUserProfile();
    if (profile) {
      setUserProfile(profile);
    }
  }, []);

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

  // Listen for profile changes if real-time update is enabled
  useEffect(() => {
    if (!realTimeUpdate) return;

    const handleStorageChange = (e) => {
      if (e.key && e.key.startsWith('userProfile_')) {
        const updatedProfile = JSON.parse(e.newValue);
        setUserProfile(updatedProfile);
        setLastUpdateTime(Date.now());
        console.log('Skills changed via storage, updating recommendations');
      }
    };

    const handleCustomProfileUpdate = (event) => {
      const updatedProfile = event.detail.profile;
      setUserProfile(updatedProfile);
      setLastUpdateTime(Date.now());
      console.log('Real-time skills update received, refreshing recommendations immediately');
    };

    // Listen for localStorage changes
    window.addEventListener('storage', handleStorageChange);

    // Listen for custom profile update events (instant updates)
    window.addEventListener('profileUpdated', handleCustomProfileUpdate);

    // Also check for profile changes periodically (fallback)
    const interval = setInterval(() => {
      const currentProfile = loadUserProfile();
      if (currentProfile && JSON.stringify(currentProfile) !== JSON.stringify(userProfile)) {
        setUserProfile(currentProfile);
        setLastUpdateTime(Date.now());
        console.log('Profile change detected via polling');
      }
    }, 1000); // Check every second

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('profileUpdated', handleCustomProfileUpdate);
      clearInterval(interval);
    };
  }, [userProfile, realTimeUpdate]);

  // Get current user skills (prioritize from profile, fallback to props)
  const currentUserSkills = useMemo(() => {
    if (userProfile?.skillsWithProficiency) {
      return userProfile.skillsWithProficiency.map(skill => skill.name);
    }
    if (userProfile?.skills) {
      return userProfile.skills;
    }
    return userSkills;
  }, [userProfile, userSkills]);

  // Get current user location
  const currentUserLocation = useMemo(() => {
    return userProfile?.location || userLocation;
  }, [userProfile, userLocation]);

  // Enhanced recommendation algorithm
  const calculateJobScore = useMemo(() => {
    return (job, skills, location, userProf = null) => {
      let score = 0;

      // Skills matching (50% weight) - Enhanced with proficiency
      const skillMatches = job.tags.filter(tag =>
        skills.some(skill => {
          const skillName = typeof skill === 'string' ? skill : skill.name;
          return skillName.toLowerCase().includes(tag.toLowerCase()) ||
            tag.toLowerCase().includes(skillName.toLowerCase());
        })
      );

      // Calculate skill score with proficiency bonus
      let skillScore = 0;
      if (userProf?.skillsWithProficiency) {
        skillMatches.forEach(matchedTag => {
          const userSkill = userProf.skillsWithProficiency.find(skill =>
            skill.name.toLowerCase().includes(matchedTag.toLowerCase()) ||
            matchedTag.toLowerCase().includes(skill.name.toLowerCase())
          );

          if (userSkill) {
            const proficiencyBonus = {
              'beginner': 1,
              'intermediate': 1.5,
              'advanced': 2,
              'expert': 2.5
            }[userSkill.proficiency] || 1;

            skillScore += proficiencyBonus;
          }
        });
        skillScore = (skillScore / Math.max(job.tags.length, 1)) * 50;
      } else {
        skillScore = (skillMatches.length / Math.max(job.tags.length, 1)) * 50;
      }
      score += skillScore;

      // Location matching (20% weight)
      const locationScore = job.location.toLowerCase().includes(location.toLowerCase()) ? 20 : 0;
      score += locationScore;

      // Remote work bonus (10% weight)
      const remoteScore = job.remote ? 10 : 0;
      score += remoteScore;

      // Recency bonus (10% weight)
      const daysOld = Math.floor((new Date() - new Date(job.posted)) / (1000 * 60 * 60 * 24));
      const recencyScore = Math.max(0, 10 - (daysOld * 0.3));
      score += recencyScore;

      // Job type preference (10% weight)
      const jobTypePreferences = userProf?.preferredJobTypes || ['CDI', 'Stage'];
      const typeScore = jobTypePreferences.includes(job.type) ? 10 : 0;
      score += typeScore;

      return Math.min(100, Math.max(0, Math.round(score)));
    };
  }, []);

  // Calculate recommendations when skills or location change
  useEffect(() => {
    setLoading(true);

    // Add a small delay to simulate processing and debounce rapid changes
    const timer = setTimeout(() => {
      const activeJobs = jobOffers.filter(job => job.status === 'active');

      // Calculate scores and sort
      const jobsWithScores = activeJobs.map(job => {
        const score = calculateJobScore(job, currentUserSkills, currentUserLocation, userProfile);
        const matchedSkills = job.tags.filter(tag =>
          currentUserSkills.some(skill => {
            const skillName = typeof skill === 'string' ? skill : skill.name;
            return skillName.toLowerCase().includes(tag.toLowerCase()) ||
              tag.toLowerCase().includes(skillName.toLowerCase());
          })
        );

        return {
          ...job,
          recommendationScore: score,
          matchedSkills,
          isHighMatch: score >= 70,
          isGoodMatch: score >= 50,
          skillMatchCount: matchedSkills.length
        };
      });

      // Sort by score and take top N
      const sortedJobs = jobsWithScores
        .sort((a, b) => {
          // Primary sort by score
          if (b.recommendationScore !== a.recommendationScore) {
            return b.recommendationScore - a.recommendationScore;
          }
          // Secondary sort by number of matched skills
          if (b.skillMatchCount !== a.skillMatchCount) {
            return b.skillMatchCount - a.skillMatchCount;
          }
          // Tertiary sort by recency
          return new Date(b.posted) - new Date(a.posted);
        })
        .slice(0, maxJobs);

      setRecommendedJobs(sortedJobs);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [currentUserSkills, currentUserLocation, maxJobs, calculateJobScore, userProfile, lastUpdateTime]);

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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Update recommendation status to applied
      setRecommendedJobs(prev => prev.map(job =>
        job.id === jobId ? { ...job, status: 'applied' } : job
      ));
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      // Update recommendation status to viewed
      setRecommendedJobs(prev => prev.map(job =>
        job.id === jobId ? { ...job, status: 'viewed' } : job
      ));
    } catch (error) {
      console.error('Error updating job status:', error);
    }
  };

  const toggleDescription = (jobId) => {
    setExpandedDescriptions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(jobId)) {
        newSet.delete(jobId);
      } else {
        newSet.add(jobId);
      }
      return newSet;
    });
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 60) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (score >= 40) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent Match';
    if (score >= 60) return 'Good Match';
    if (score >= 40) return 'Fair Match';
    return 'Possible Match';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-600 border-t-transparent"></div>
              <p className="text-gray-600 dark:text-gray-400 text-lg">Chargement des recommandations...</p>
            </div>
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
                      {recommendedJobs.length} opportunities found for you
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {currentUserSkills.length > 0 && (
                  <div className="hidden sm:flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200/50 dark:border-blue-700/50">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                      {currentUserSkills.length} skills analyzed
                    </span>
                  </div>
                )}
                <button
                  onClick={() => window.location.reload()}
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
        {recommendedJobs.length === 0 && !loading && (
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
                onClick={() => window.location.reload()}
                className="group inline-flex items-center px-6 py-3 bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <ArrowPathIcon className="w-5 h-5 mr-2 group-hover:rotate-180 transition-transform duration-300" />
                Refresh recommendations
              </button>
            </div>
          </div>
        )}

        {/* Modern Job List */}
        {recommendedJobs.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid gap-6">
              {recommendedJobs.map((job, index) => {
                const isSaved = savedJobs.has(job.id);
                const isLiked = likedJobs.has(job.id);
                const isApplying = applyingJobs.has(job.id);

                return (
                  <div
                    key={job.id}
                    className="group relative bg-white dark:bg-slate-800/50 rounded-xl border border-slate-200/60 dark:border-slate-700/60 p-5 transition-all duration-200 hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-700"
                  >
                    {/* Match Score Badge */}
                    <div className="absolute -top-3 -right-3">
                      <div className="flex items-center space-x-1 px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-green-500 text-white text-xs font-semibold rounded-full shadow-lg">
                        <StarIcon className="w-3.5 h-3.5" />
                        <span>{Math.round(job.recommendationScore)}%</span>
                      </div>
                    </div>

                    {/* Header with Company Avatar and Actions */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start space-x-3 flex-1">
                        {/* Company Avatar */}
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center shadow-sm">
                          <span className="text-white font-semibold text-sm">
                            {job.company?.charAt(0).toUpperCase() || 'C'}
                          </span>
                        </div>


                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 truncate">
                            {job.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 font-medium text-sm mb-2">
                            {job.company}
                          </p>

                          {/* Compact Meta Info */}
                          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                            <div className="flex items-center space-x-1">
                              <MapPinIcon className="w-3.5 h-3.5" />
                              <span>{job.location}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <ClockIcon className="w-3.5 h-3.5" />
                              <span>{job.type}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <CalendarIcon className="w-3.5 h-3.5" />
                              <span>2 days ago</span>
                            </div>
                            {job.experience && (
                              <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full text-xs font-medium">
                                {job.experience}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Salary and Actions */}
                      <div className="text-right flex-shrink-0">
                        {job.salary && (
                          <div className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                            {job.salary}
                          </div>
                        )}
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleLikeJob(job.id)}
                            className={`p-1.5 rounded-lg transition-all duration-200 ${isLiked
                              ? 'text-red-500 bg-red-50 dark:bg-red-900/20 shadow-sm'
                              : 'text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                              }`}
                          >
                            {isLiked ? (
                              <HeartSolidIcon className="w-4 h-4" />
                            ) : (
                              <HeartIcon className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => handleSaveJob(job.id)}
                            className={`p-1.5 rounded-lg transition-all duration-200 ${isSaved
                              ? 'text-amber-500 bg-amber-50 dark:bg-amber-900/20 shadow-sm'
                              : 'text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20'
                              }`}
                          >
                            {isSaved ? (
                              <BookmarkSolidIcon className="w-4 h-4" />
                            ) : (
                              <BookmarkIcon className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Job Description with See More */}
                    <div className="mb-4">
                      <div className="relative">
                        <p className={`text-slate-600 dark:text-slate-400 text-sm leading-relaxed ${!expandedDescriptions.has(job.id) ? 'line-clamp-2' : ''
                          }`}>
                          {job.description}
                        </p>
                        {job.description && job.description.length > 150 && (
                          <button
                            onClick={() => toggleDescription(job.id)}
                            className="mt-1 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
                          >
                            {expandedDescriptions.has(job.id) ? 'See less' : 'See more'}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Required Skills Section */}
                    {job.tags && job.tags.length > 0 && (
                      <div className="mb-4 p-3 bg-slate-50/80 dark:bg-slate-800/50 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                            Required Skills
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {job.tags.slice(0, 8).map((skill, skillIndex) => (
                            <span
                              key={skillIndex}
                              className="inline-flex items-center px-2.5 py-1 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 border border-orange-200/70 dark:border-orange-800/70 rounded-md text-xs font-medium"
                            >
                              {skill}
                            </span>
                          ))}
                          {job.tags.length > 8 && (
                            <span className="inline-flex items-center px-2.5 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-600 rounded-md text-xs">
                              +{job.tags.length - 8} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Skills Matching Section */}
                    {job.matchedSkills && job.matchedSkills.length > 0 && (
                      <div className="mb-4 p-3 bg-green-50/80 dark:bg-green-900/20 rounded-lg border border-green-200/50 dark:border-green-700/50">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                              Your Matching Skills
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <StarIcon className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                            <span className="text-xs font-bold text-green-700 dark:text-green-300">
                              {Math.round((job.matchedSkills.length / Math.max(job.tags?.length || job.matchedSkills.length, 1)) * 100)}% Match
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {job.matchedSkills.slice(0, 6).map((skill, skillIndex) => (
                            <span
                              key={skillIndex}
                              className="inline-flex items-center px-2.5 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200/70 dark:border-green-700/70 rounded-md text-xs font-medium"
                            >
                              <CheckCircleIcon className="w-3 h-3 mr-1" />
                              {skill}
                            </span>
                          ))}
                          {job.matchedSkills.length > 6 && (
                            <span className="inline-flex items-center px-2.5 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-700 rounded-md text-xs font-medium">
                              +{job.matchedSkills.length - 6} more matches
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Posted 2 days ago
                      </div>
                      <div className="flex items-center space-x-2 ml-auto">
                        <button
                          onClick={() => handleApplyToJob(job.id)}
                          disabled={isApplying || job.status === 'applied'}
                          className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors shadow-sm hover:shadow ${job.status === 'applied'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300 cursor-default'
                            : isApplying
                              ? 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400 cursor-not-allowed'
                              : 'bg-blue-600 hover:bg-blue-700 text-white'
                            }`}
                        >
                          {isApplying ? (
                            <div className="flex items-center space-x-2">
                              <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"></div>
                              <span>Applying...</span>
                            </div>
                          ) : job.status === 'applied' ? (
                            <div className="flex items-center space-x-2">
                              <CheckCircleIcon className="w-3 h-3" />
                              <span>Applied</span>
                            </div>
                          ) : (
                            'Apply Now'
                          )}
                        </button>
                        <button
                          onClick={() => handleViewJob(job.id)}
                          className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors p-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          <span className="text-xs">View Details</span>
                        </button>
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

export default JobRecommendations;
