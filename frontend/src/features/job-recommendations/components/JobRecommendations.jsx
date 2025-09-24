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
  XMarkIcon,
  XCircleIcon,
  InformationCircleIcon,
  UserCircleIcon,
  MinusIcon
} from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolidIcon, HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { jobOffers } from '../../../data/jobOffers';
import { loadUserProfile } from '../../../utils/profileUtils';
import jobRecommendationsApi from '../../../services/jobRecommendationsApi';
import { mockJobOffers } from '../../../data/mockJobOffers';

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
  const [showScoreModal, setShowScoreModal] = useState(null);

  // Use profile from props (passed from JobRecommendationsPage)
  useEffect(() => {
    console.log('🔍 JobRecommendations - Props received:');
    console.log('  - userId:', userId);
    console.log('  - userSkills:', userSkills);
    console.log('  - userLocation:', userLocation);
    console.log('  - userProfile:', userProfile);

    if (userProfile) {
      console.log('🔍 JobRecommendations - Setting userProfile from props:', userProfile);
      setUserProfile(userProfile);
    }
  }, [userId, userSkills, userLocation, userProfile]);

  // Listen for profile changes with real-time updates
  useEffect(() => {
    const handleStorageChange = async () => {
      console.log('Profile updated, refreshing from database...');
      // Reload from database instead of localStorage
      try {
        const response = await jobRecommendationsApi.getUserProfile();
        if (response.success && response.profile) {
          const profileData = response.profile;
          const transformedProfile = {
            id: profileData.user_id,
            name: profileData.name,
            email: profileData.email,
            location: profileData.location,
            about: profileData.about,
            skills: profileData.skills?.map(skill => skill.name) || [],
            skillsWithProficiency: profileData.skills?.map(skill => ({
              id: skill.id,
              name: skill.name,
              proficiency: 'intermediate'
            })) || [],
            education: [],
            experience: []
          };
          console.log('🔍 JobRecommendations - handleStorageChange setting profile:', transformedProfile);
          setUserProfile(transformedProfile);
          setLastUpdateTime(Date.now());
        }
    } catch (error) {
        console.error('Error refreshing profile from database:', error);
      }
    };

    const handleCustomProfileUpdate = (event) => {
      const updatedProfile = event.detail.profile;
      setUserProfile(updatedProfile);
      setLastUpdateTime(Date.now());
    };

    if (realTimeUpdate) {
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('profileUpdated', handleCustomProfileUpdate);
    }

    // Disabled periodic check to prevent conflicts with props
    // const interval = setInterval(() => {
    //   const currentProfile = loadUserProfile();
    //   if (currentProfile && JSON.stringify(currentProfile) !== JSON.stringify(userProfile)) {
    //     setUserProfile(currentProfile);
    //     setLastUpdateTime(Date.now());
    //   }
    // }, 2000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('profileUpdated', handleCustomProfileUpdate);
      // clearInterval(interval); // Disabled since interval is disabled
    };
  }, [userProfile, realTimeUpdate]);

  // Get current user skills (prioritize from profile, fallback to props)
  const currentUserSkills = useMemo(() => {
    console.log('🔍 JobRecommendations - useMemo triggered with:');
    console.log('  - userProfile:', userProfile);
    console.log('  - userProfile?.skillsWithProficiency:', userProfile?.skillsWithProficiency);
    console.log('  - userSkills (props):', userSkills);

    if (userProfile?.skillsWithProficiency) {
      const skills = userProfile.skillsWithProficiency.map(skill => skill.name);
      console.log('🔍 JobRecommendations - currentUserSkills from profile:', skills);
      return skills;
    }
    console.log('🔍 JobRecommendations - currentUserSkills from props:', userSkills);
    return userSkills;
  }, [userProfile, userSkills]);

  const currentUserLocation = userProfile?.location || userLocation;

  // Enhanced job scoring algorithm
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

      const skillMatchPercentage = job.tags.length > 0 ? (skillMatches.length / job.tags.length) * 50 : 0;
      score += skillMatchPercentage;

      // Location matching (20% weight)
      if (location && job.location) {
        const locationMatch = location.toLowerCase().includes(job.location.toLowerCase()) ||
          job.location.toLowerCase().includes(location.toLowerCase());
        score += locationMatch ? 20 : 0;
      }

      // Experience level matching (15% weight)
      if (userProf?.experienceLevel && job.experience) {
        const userExp = userProf.experienceLevel.toLowerCase();
        const jobExp = job.experience.toLowerCase();

        if (userExp.includes('senior') && (jobExp.includes('senior') || jobExp.includes('lead'))) {
          score += 15;
        } else if (userExp.includes('mid') && (jobExp.includes('mid') || jobExp.includes('intermediate'))) {
          score += 15;
        } else if (userExp.includes('junior') && (jobExp.includes('junior') || jobExp.includes('entry'))) {
          score += 15;
        } else if (userExp.includes('entry') && jobExp.includes('entry')) {
          score += 15;
        }
      }

      // Job type preference (10% weight)
      if (userProf?.jobTypePreference && job.type) {
        const userPref = userProf.jobTypePreference.toLowerCase();
        const jobType = job.type.toLowerCase();
        if (userPref.includes(jobType) || jobType.includes(userPref)) {
          score += 10;
        }
      }

      // Salary expectation (5% weight)
      if (userProf?.salaryExpectation && job.salary) {
        const userSalary = parseInt(userProf.salaryExpectation.replace(/[^\d]/g, ''));
        const jobSalary = parseInt(job.salary.replace(/[^\d]/g, ''));
        if (userSalary && jobSalary) {
          const salaryRatio = Math.min(userSalary, jobSalary) / Math.max(userSalary, jobSalary);
          score += salaryRatio * 5;
        }
      }

      return Math.min(Math.round(score), 100);
    };
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

  // Calculate job recommendations
  useEffect(() => {
    if (!currentUserSkills.length) {
      setLoading(false);
      return;
    }

    const loadJobRecommendations = async () => {
      try {
    setLoading(true);

        // Create user profile data for API
        const userProfileData = {
          name: userProfile?.name || 'User',
          email: userProfile?.email || 'user@example.com',
          skillsWithProficiency: userProfile?.skillsWithProficiency || currentUserSkills.map(skill => ({
            name: typeof skill === 'string' ? skill : skill.name || skill,
            proficiency: 'intermediate'
          })),
          contact: {
            location: currentUserLocation
          },
          education: userProfile?.education || [],
          experience: userProfile?.experience || []
        };

        try {
          // Try to get recommendations from backend API
          console.log('🔄 Calling backend API for recommendations with profile:', userProfileData);
          console.log('🔍 User profile data:', userProfile);
          console.log('🔍 Current user skills:', currentUserSkills);

          const response = await jobRecommendationsApi.getAdvancedRecommendations(
            userProfileData,
            { limit: maxJobs }
          );

          console.log('📡 Backend API response:', response);
          if (response.success && response.recommendations && response.recommendations.length > 0) {
            // Transform advanced algorithm response to frontend format
            const transformedJobs = response.recommendations.map(rec => ({
              id: rec.job.id,
              title: rec.job.title,
              company: rec.job.company,
              location: rec.job.location,
              city: rec.job.location?.split(',')[0] || rec.job.location,
              type: rec.job.job_type,
              experience: rec.job.seniority,
              description: `Advanced algorithm recommendation: ${rec.job.title} at ${rec.job.company}`,
              requirements: `Required skills: ${rec.job.required_skills?.join(', ') || 'Not specified'}`,
              salary: rec.job.salary_min && rec.job.salary_max
                ? `${rec.job.salary_min.toLocaleString()} - ${rec.job.salary_max.toLocaleString()} MAD`
                : 'Salary not specified',
              remote: rec.job.remote,
              posted: new Date().toISOString(),
              requiredSkills: rec.job.required_skills || [],
              preferredSkills: rec.job.preferred_skills || [],
              tags: rec.job.tags || [],
              recommendationScore: rec.overall_score,
              skillMatchScore: rec.skill_score,
              salaryFitScore: rec.salary_fit,
              locationMatchScore: rec.location_bonus,
              seniorityMatchScore: 50, // Default for advanced algorithm
              remoteBonus: rec.remote_bonus,
              matchedSkills: rec.matched_skills || [],
              missingSkills: rec.missing_skills || [],
              recommendationReason: rec.recommendation_reason,
              status: 'new',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              isHighMatch: rec.overall_score >= 70,
              isGoodMatch: rec.overall_score >= 50,
              skillMatchCount: rec.matched_skills_count || 0,
              // Advanced algorithm specific fields
              contentScore: rec.content_score,
              algorithmMethod: response.algorithm_info?.method || 'Advanced Algorithm'
            }));

            setRecommendedJobs(transformedJobs);
            console.log('✅ Loaded job recommendations from backend API');
            return;
          } else {
            console.log('⚠️ Backend API returned empty recommendations, using mock data fallback');
          }
        } catch (apiError) {
          console.warn('Backend API not available, using mock data:', apiError);
        }

        // Fallback to mock data with enhanced scoring
        console.log('🔄 Using mock data fallback for job recommendations');
        const activeJobs = mockJobOffers.filter(job => job.status === 'active');
      const jobsWithScores = activeJobs.map(job => {
        const score = calculateJobScore(job, currentUserSkills, currentUserLocation, userProfile);

          // Get matched skills from both required_skills and tags
          const requiredSkills = job.required_skills?.map(skill => skill.name) || [];
          const preferredSkills = job.preferred_skills?.map(skill => skill.name) || [];
          const allJobSkills = [...requiredSkills, ...preferredSkills, ...(job.tags || [])];

          const matchedSkills = allJobSkills.filter(jobSkill =>
            currentUserSkills.some(userSkill => {
              const skillName = typeof userSkill === 'string' ? userSkill : userSkill.name;
              return skillName.toLowerCase().includes(jobSkill.toLowerCase()) ||
                jobSkill.toLowerCase().includes(skillName.toLowerCase());
          })
        );

        return {
          ...job,
          recommendationScore: score,
          matchedSkills,
          isHighMatch: score >= 70,
          isGoodMatch: score >= 50,
            skillMatchCount: matchedSkills.length,
            // Ensure all required fields are present for the UI
            salary: job.salary_min && job.salary_max
              ? `${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()} ${job.salary_currency}`
              : 'Salary not specified',
            type: job.job_type || 'full-time',
            experience: job.seniority || 'mid',
            remote: job.remote || false,
            posted: job.posted || new Date().toISOString(),
            requiredSkills: requiredSkills,
            preferredSkills: preferredSkills,
            tags: job.tags || []
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

      } catch (error) {
        console.error('Error loading job recommendations:', error);
        setRecommendedJobs([]);
      } finally {
      setLoading(false);
      }
    };

    const timer = setTimeout(loadJobRecommendations, 500);
    return () => clearTimeout(timer);
  }, [currentUserSkills, currentUserLocation, maxJobs, calculateJobScore, userProfile, lastUpdateTime]);

  const handleSaveJob = async (jobId) => {
    try {
      // Update local state immediately for better UX
    const newSavedJobs = new Set(savedJobs);
    if (newSavedJobs.has(jobId)) {
      newSavedJobs.delete(jobId);
    } else {
      newSavedJobs.add(jobId);
    }
    setSavedJobs(newSavedJobs);
    saveJobsToStorage(newSavedJobs);

      // Try to update recommendation status in backend
      try {
        const job = recommendedJobs.find(j => j.id === jobId);
        if (job && job.status) {
          await jobRecommendationsApi.updateRecommendationStatus(
            job.status === 'saved' ? 'new' : 'saved'
          );
        }
      } catch (apiError) {
        console.warn('Could not update recommendation status in backend:', apiError);
      }
    } catch (error) {
      console.error('Error saving job:', error);
    }
  };

  const handleLikeJob = async (jobId) => {
    try {
      // Update local state immediately for better UX
    const newLikedJobs = new Set(likedJobs);
    if (newLikedJobs.has(jobId)) {
      newLikedJobs.delete(jobId);
    } else {
      newLikedJobs.add(jobId);
    }
    setLikedJobs(newLikedJobs);
      localStorage.setItem('likedJobs', JSON.stringify([...newLikedJobs]));

      // Try to update recommendation status in backend
      try {
        const job = recommendedJobs.find(j => j.id === jobId);
        if (job && job.status) {
          await jobRecommendationsApi.updateRecommendationStatus(
            job.status === 'interested' ? 'new' : 'interested'
          );
        }
      } catch (apiError) {
        console.warn('Could not update recommendation status in backend:', apiError);
      }
    } catch (error) {
      console.error('Error liking job:', error);
    }
  };

  const handleApplyToJob = async (jobId) => {
    setApplyingJobs(prev => new Set(prev).add(jobId));
    try {
      // Try to apply to job in backend
      try {
        await jobRecommendationsApi.applyToJob(jobId, '', '');

        // Update recommendation status
        const job = recommendedJobs.find(j => j.id === jobId);
        if (job && job.status) {
          await jobRecommendationsApi.updateRecommendationStatus(job.status, 'applied');
        }
      } catch (apiError) {
        console.warn('Could not apply to job in backend:', apiError);
        // Fallback to simulation
      await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Update local state
      const newAppliedJobs = new Set(appliedJobs);
      newAppliedJobs.add(jobId);
      setAppliedJobs(newAppliedJobs);
      localStorage.setItem('appliedJobs', JSON.stringify([...newAppliedJobs]));

      // Update recommendation status to applied
      setRecommendedJobs(prev => prev.map(job =>
        job.id === jobId ? { ...job, status: 'applied' } : job
      ));

      // Show success message
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
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
    const newExpanded = new Set(expandedDescriptions);
    if (newExpanded.has(jobId)) {
      newExpanded.delete(jobId);
      } else {
      newExpanded.add(jobId);
      }
    setExpandedDescriptions(newExpanded);
  };

  // Get score color based on percentage
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  // Get score progress color
  const getScoreProgressColor = (score) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Check if skill is matched
  const isSkillMatched = (skill, matchedSkills) => {
    return matchedSkills.some(matchedSkill =>
      matchedSkill.toLowerCase().includes(skill.toLowerCase()) ||
      skill.toLowerCase().includes(matchedSkill.toLowerCase())
    );
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

  if (!currentUserSkills.length) {
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
                        12 opportunities found for you
                    </p>
                    </div>
                  </div>
                </div>
                  </div>
                </div>
              </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ExclamationTriangleIcon className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                  </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No Skills Found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
                  Add your skills to your profile to get personalized job recommendations tailored to your expertise.
                </p>
                <button
                  onClick={() => window.location.href = '/dashboard?section=mon-espace'}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  <UserCircleIcon className="w-4 h-4 mr-2" />
                  Complete My Profile
                </button>
              </div>
            </div>
          </div>
        </main>
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
            </div>
          </div>
        </div>

        {/* Modern Job List */}
        {recommendedJobs.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid gap-6">
              {recommendedJobs.map((job, index) => {
                const isSaved = savedJobs.has(job.id);
                const isLiked = likedJobs.has(job.id);
                const isApplying = applyingJobs.has(job.id);
                const score = Math.round(job.recommendationScore);

                return (
                  <div
                    key={job.id}
                    className="group relative bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 p-6 transition-all duration-200 hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-700"
                  >
                    {/* Header with Company Avatar and Actions */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4 flex-1">
                        {/* Company Avatar */}
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-sm">
                          <span className="text-white font-semibold text-sm">
                            {job.company?.charAt(0).toUpperCase() || 'C'}
                          </span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                            {job.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 font-medium text-sm mb-3">
                            {job.company}
                          </p>

                          {/* Compact Meta Info */}
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center space-x-1">
                              <MapPinIcon className="w-4 h-4" />
                              <span>{job.location}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <ClockIcon className="w-4 h-4" />
                              <span>{job.type}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <CalendarIcon className="w-4 h-4" />
                              <span>2 days ago</span>
                            </div>
                            {job.experience && (
                              <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full text-xs font-medium">
                                {job.experience}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Salary and Actions */}
                      <div className="text-right flex-shrink-0">
                        {job.salary && (
                          <div className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                            {job.salary}
                          </div>
                        )}
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleLikeJob(job.id)}
                            className={`p-2 rounded-lg transition-all duration-200 ${isLiked
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
                            className={`p-2 rounded-lg transition-all duration-200 ${isSaved
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
                      </div>
                    </div>

                    {/* Advanced Algorithm Matching Score Section */}
                    <div className="mb-6 p-4 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800/50 dark:to-blue-900/20 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <StarIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                            AI-Powered Match
                          </span>
                          {job.algorithmMethod && (
                            <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">
                              {job.algorithmMethod}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => setShowScoreModal(job.id)}
                          className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
                        >
                          View Details
                        </button>
                      </div>

                      <div className="flex items-center space-x-4">
                        {/* Circular Progress */}
                        <div className="relative w-16 h-16">
                          <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                            <path
                              className="text-slate-200 dark:text-slate-700"
                              stroke="currentColor"
                              strokeWidth="3"
                              fill="none"
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <path
                              className={getScoreProgressColor(score)}
                              stroke="currentColor"
                              strokeWidth="3"
                              fill="none"
                              strokeLinecap="round"
                              strokeDasharray={`${score}, 100`}
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className={`text-lg font-bold ${getScoreColor(score).split(' ')[0]}`}>
                              {score}%
                            </span>
                          </div>
                        </div>

                        {/* Advanced Score Breakdown */}
                        <div className="flex-1">
                          <div className="grid grid-cols-2 gap-3 mb-3">
                            {/* Skill Match Score */}
                            <div className="bg-white/60 dark:bg-slate-700/60 rounded-lg p-2">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Skills</span>
                                <span className="text-xs font-bold text-green-600 dark:text-green-400">
                                  {Math.round(job.skillMatchScore || 0)}%
                                </span>
                              </div>
                              <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-1.5">
                                <div
                                  className="bg-green-500 h-1.5 rounded-full transition-all duration-500"
                                  style={{ width: `${job.skillMatchScore || 0}%` }}
                                ></div>
                              </div>
                            </div>

                            {/* Content Match Score */}
                            <div className="bg-white/60 dark:bg-slate-700/60 rounded-lg p-2">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Content</span>
                                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                                  {Math.round(job.contentScore || 0)}%
                                </span>
                              </div>
                              <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-1.5">
                                <div
                                  className="bg-blue-500 h-1.5 rounded-full transition-all duration-500"
                                  style={{ width: `${job.contentScore || 0}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>

                          <p className="text-xs text-slate-600 dark:text-slate-400">
                            {job.skillMatchCount || 0}/{job.totalSkillsCount || 0} skills matched • {job.recommendationReason || 'AI-powered recommendation'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Job Description */}
                    <div className="mb-6">
                        <p className={`text-slate-600 dark:text-slate-400 text-sm leading-relaxed ${!expandedDescriptions.has(job.id) ? 'line-clamp-2' : ''
                          }`}>
                          {job.description}
                        </p>
                        {job.description && job.description.length > 150 && (
                          <button
                            onClick={() => toggleDescription(job.id)}
                          className="mt-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
                          >
                            {expandedDescriptions.has(job.id) ? 'See less' : 'See more'}
                          </button>
                        )}
                      </div>

                    {/* Advanced Skills Analysis Section */}
                    {(job.requiredSkills?.length > 0 || job.preferredSkills?.length > 0) && (
                      <div className="mb-6 p-4 bg-slate-50/80 dark:bg-slate-800/50 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                              Skills Analysis
                            </span>
                          </div>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {job.skillMatchCount || 0}/{job.totalSkillsCount || 0} matched
                          </span>
                    </div>

                        {/* Required Skills */}
                        {job.requiredSkills?.length > 0 && (
                          <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                                Required Skills ({job.requiredSkills.length})
                              </span>
                              <span className="text-xs text-slate-500 dark:text-slate-400">
                                {job.matchedSkills?.filter(skill =>
                                  job.requiredSkills?.some(req =>
                                    req.toLowerCase().includes(skill.toLowerCase()) ||
                                    skill.toLowerCase().includes(req.toLowerCase())
                                  )
                                ).length || 0} matched
                          </span>
                        </div>
                            <div className="flex flex-wrap gap-2">
                              {job.requiredSkills.map((skill, skillIndex) => {
                                const isMatched = job.matchedSkills?.some(matchedSkill =>
                                  matchedSkill.toLowerCase().includes(skill.toLowerCase()) ||
                                  skill.toLowerCase().includes(matchedSkill.toLowerCase())
                                );
                                return (
                            <span
                              key={skillIndex}
                                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${isMatched
                                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700'
                                      : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-700'
                                      }`}
                            >
                                    {isMatched ? (
                                      <CheckCircleIcon className="w-3 h-3 mr-1.5" />
                                    ) : (
                                      <XCircleIcon className="w-3 h-3 mr-1.5" />
                                    )}
                              {skill}
                            </span>
                                );
                              })}
                        </div>
                      </div>
                    )}

                        {/* Preferred Skills */}
                        {job.preferredSkills?.length > 0 && (
                          <div>
                        <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                                Preferred Skills ({job.preferredSkills.length})
                            </span>
                              <span className="text-xs text-slate-500 dark:text-slate-400">
                                {job.matchedSkills?.filter(skill =>
                                  job.preferredSkills?.some(pref =>
                                    pref.toLowerCase().includes(skill.toLowerCase()) ||
                                    skill.toLowerCase().includes(pref.toLowerCase())
                                  )
                                ).length || 0} matched
                            </span>
                          </div>
                            <div className="flex flex-wrap gap-2">
                              {job.preferredSkills.map((skill, skillIndex) => {
                                const isMatched = job.matchedSkills?.some(matchedSkill =>
                                  matchedSkill.toLowerCase().includes(skill.toLowerCase()) ||
                                  skill.toLowerCase().includes(matchedSkill.toLowerCase())
                                );
                                return (
                            <span
                              key={skillIndex}
                                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${isMatched
                                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700'
                                      : 'bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-600'
                                      }`}
                                  >
                                    {isMatched ? (
                                      <CheckCircleIcon className="w-3 h-3 mr-1.5" />
                                    ) : (
                                      <MinusIcon className="w-3 h-3 mr-1.5" />
                                    )}
                              {skill}
                            </span>
                                );
                              })}
                        </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Posted 2 days ago
                      </div>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleViewJob(job.id)}
                          className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handleApplyToJob(job.id)}
                          disabled={isApplying || job.status === 'applied'}
                          className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md ${job.status === 'applied'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300 cursor-default'
                            : isApplying
                              ? 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400 cursor-not-allowed'
                              : 'bg-blue-600 hover:bg-blue-700 text-white'
                            }`}
                        >
                          {isApplying ? (
                            <div className="flex items-center space-x-2">
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              <span>Applying...</span>
                            </div>
                          ) : job.status === 'applied' ? (
                            <div className="flex items-center space-x-2">
                              <CheckCircleIcon className="w-4 h-4" />
                              <span>Applied</span>
                            </div>
                          ) : (
                            'Apply Now'
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Score Details Modal */}
        {showScoreModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Match Breakdown
                  </h3>
                        <button
                    onClick={() => setShowScoreModal(null)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                        >
                    <XMarkIcon className="w-6 h-6" />
                        </button>
                      </div>
                    </div>
              <div className="p-6">
                {(() => {
                  const job = recommendedJobs.find(j => j.id === showScoreModal);
                  if (!job) return null;

                  return (
                    <div className="space-y-6">
                      {/* Overall Score */}
                      <div className="text-center">
                        <div className="relative w-24 h-24 mx-auto mb-4">
                          <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                            <path
                              className="text-slate-200 dark:text-slate-700"
                              stroke="currentColor"
                              strokeWidth="3"
                              fill="none"
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <path
                              className={getScoreProgressColor(job.recommendationScore)}
                              stroke="currentColor"
                              strokeWidth="3"
                              fill="none"
                              strokeLinecap="round"
                              strokeDasharray={`${job.recommendationScore}, 100`}
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className={`text-2xl font-bold ${getScoreColor(job.recommendationScore).split(' ')[0]}`}>
                              {Math.round(job.recommendationScore)}%
                            </span>
                  </div>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 mb-2">
                          AI-Powered Match for {job.title} at {job.company}
                        </p>
                        {job.algorithmMethod && (
                          <span className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-medium">
                            {job.algorithmMethod}
                          </span>
                        )}
                      </div>

                      {/* Advanced Algorithm Breakdown */}
                      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
                        <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                          Algorithm Breakdown
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          {/* Skill Match Score */}
                          <div className="bg-white dark:bg-slate-700/50 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Skills Match</span>
                              <span className="text-lg font-bold text-green-600 dark:text-green-400">
                                {Math.round(job.skillMatchScore || 0)}%
                              </span>
                            </div>
                            <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                              <div
                                className="bg-green-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${job.skillMatchScore || 0}%` }}
                              ></div>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                              {job.skillMatchCount || 0}/{job.totalSkillsCount || 0} skills matched
                            </p>
                          </div>

                          {/* Content Match Score */}
                          <div className="bg-white dark:bg-slate-700/50 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Content Match</span>
                              <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                {Math.round(job.contentScore || 0)}%
                              </span>
                            </div>
                            <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                              <div
                                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${job.contentScore || 0}%` }}
                              ></div>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                              TF-IDF similarity analysis
                            </p>
                          </div>

                          {/* Location Bonus */}
                          <div className="bg-white dark:bg-slate-700/50 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Location</span>
                              <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                                +{Math.round(job.locationMatchScore || 0)}%
                              </span>
                            </div>
                            <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                              <div
                                className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${Math.min((job.locationMatchScore || 0) * 10, 100)}%` }}
                              ></div>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                              Location preference bonus
                            </p>
                          </div>

                          {/* Remote Bonus */}
                          <div className="bg-white dark:bg-slate-700/50 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Remote</span>
                              <span className="text-lg font-bold text-orange-600 dark:text-orange-400">
                                +{Math.round(job.remoteBonus || 0)}%
                              </span>
                            </div>
                            <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                              <div
                                className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${Math.min((job.remoteBonus || 0) * 20, 100)}%` }}
                              ></div>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                              Remote work preference
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Advanced Skills Analysis */}
                      <div>
                        <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                          Skills Analysis
                        </h4>

                        {/* Required Skills */}
                        {job.requiredSkills?.length > 0 && (
                          <div className="mb-4">
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                Required Skills ({job.requiredSkills.length})
                              </span>
                              <span className="text-xs text-slate-500 dark:text-slate-400">
                                {job.matchedSkills?.filter(skill =>
                                  job.requiredSkills?.some(req =>
                                    req.toLowerCase().includes(skill.toLowerCase()) ||
                                    skill.toLowerCase().includes(req.toLowerCase())
                                  )
                                ).length || 0} matched
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {job.requiredSkills.map((skill, index) => {
                                const isMatched = job.matchedSkills?.some(matchedSkill =>
                                  matchedSkill.toLowerCase().includes(skill.toLowerCase()) ||
                                  skill.toLowerCase().includes(matchedSkill.toLowerCase())
                                );
                                return (
                                  <span
                                    key={index}
                                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${isMatched
                                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700'
                                      : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-700'
                                      }`}
                                  >
                                    {isMatched ? (
                                      <CheckCircleIcon className="w-3 h-3 mr-1.5" />
                                    ) : (
                                      <XCircleIcon className="w-3 h-3 mr-1.5" />
                                    )}
                                    {skill}
                                  </span>
                );
              })}
                            </div>
                          </div>
                        )}

                        {/* Preferred Skills */}
                        {job.preferredSkills?.length > 0 && (
                          <div className="mb-4">
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                Preferred Skills ({job.preferredSkills.length})
                              </span>
                              <span className="text-xs text-slate-500 dark:text-slate-400">
                                {job.matchedSkills?.filter(skill =>
                                  job.preferredSkills?.some(pref =>
                                    pref.toLowerCase().includes(skill.toLowerCase()) ||
                                    skill.toLowerCase().includes(pref.toLowerCase())
                                  )
                                ).length || 0} matched
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {job.preferredSkills.map((skill, index) => {
                                const isMatched = job.matchedSkills?.some(matchedSkill =>
                                  matchedSkill.toLowerCase().includes(skill.toLowerCase()) ||
                                  skill.toLowerCase().includes(matchedSkill.toLowerCase())
                                );
                                return (
                                  <span
                                    key={index}
                                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${isMatched
                                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700'
                                      : 'bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-600'
                                      }`}
                                  >
                                    {isMatched ? (
                                      <CheckCircleIcon className="w-3 h-3 mr-1.5" />
                                    ) : (
                                      <MinusIcon className="w-3 h-3 mr-1.5" />
                                    )}
                                    {skill}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Missing Skills Summary */}
                        {job.missingSkills?.length > 0 && (
                          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-semibold text-amber-800 dark:text-amber-200">
                                Skills to Learn ({job.missingSkills.length})
                              </span>
                              <span className="text-xs text-amber-600 dark:text-amber-400">
                                ✗ Consider learning
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {job.missingSkills.slice(0, 8).map((skill, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-700 rounded-full text-xs font-medium"
                                >
                                  <XCircleIcon className="w-3 h-3 mr-1.5" />
                                  {skill}
                                </span>
                              ))}
                              {job.missingSkills.length > 8 && (
                                <span className="inline-flex items-center px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-700 rounded-full text-xs font-medium">
                                  +{job.missingSkills.length - 8} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* AI-Powered Recommendations */}
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4">
                        <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">
                          🤖 AI-Powered Recommendations
                        </h4>
                        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
                          <li className="flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            <span>This recommendation is powered by Content-Based Filtering + K-Means Clustering</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            <span>Focus on learning the missing required skills to increase your match score</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            <span>Consider preferred skills as bonus qualifications that can boost your profile</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            <span>Location and remote preferences are factored into the algorithm</span>
                          </li>
                        </ul>
                        {job.recommendationReason && (
                          <div className="mt-3 p-2 bg-white/60 dark:bg-slate-800/60 rounded border border-blue-200 dark:border-blue-700">
                            <p className="text-xs text-blue-700 dark:text-blue-300 font-medium">
                              💡 {job.recommendationReason}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default JobRecommendations;