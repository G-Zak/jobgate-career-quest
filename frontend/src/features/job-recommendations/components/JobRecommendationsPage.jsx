import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import JobRecommendations from './JobRecommendations';
import {
  AdjustmentsHorizontalIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
  ExclamationTriangleIcon,
  UserCircleIcon,
  BriefcaseIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { loadUserProfile } from '../../../utils/profileUtils';

const JobRecommendationsPage = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [profileUpdateTime, setProfileUpdateTime] = useState(Date.now());

  const [filters, setFilters] = useState({
    location: "",
    jobType: "",
    remote: false,
    salaryMin: "",
    experience: ""
  });

  const [showFilters, setShowFilters] = useState(false);

  // Load user profile
  useEffect(() => {
    const profile = loadUserProfile();
    setUserProfile(profile);
  }, []);

  // Listen for profile changes with real-time updates
  useEffect(() => {
    const handleProfileUpdate = () => {
      const updatedProfile = loadUserProfile();
      setUserProfile(updatedProfile);
      setProfileUpdateTime(Date.now());
      console.log('Profile updated, refreshing page data');
    };

    const handleCustomProfileUpdate = (event) => {
      const updatedProfile = event.detail.profile;
      setUserProfile(updatedProfile);
      setProfileUpdateTime(Date.now());
      console.log('Real-time profile update received on recommendations page');
    };

    // Listen for storage changes
    window.addEventListener('storage', handleProfileUpdate);

    // Listen for custom profile update events (instant updates)
    window.addEventListener('profileUpdated', handleCustomProfileUpdate);

    // Check for changes periodically (fallback)
    const interval = setInterval(() => {
      const currentProfile = loadUserProfile();
      if (currentProfile && JSON.stringify(currentProfile) !== JSON.stringify(userProfile)) {
        setUserProfile(currentProfile);
        setProfileUpdateTime(Date.now());
      }
    }, 2000);

    return () => {
      window.removeEventListener('storage', handleProfileUpdate);
      window.removeEventListener('profileUpdated', handleCustomProfileUpdate);
      clearInterval(interval);
    };
  }, [userProfile]);

  const userSkills = userProfile?.skillsWithProficiency?.map(skill => skill.name) || userProfile?.skills || [];
  const hasSkills = userSkills.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
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
                    {hasSkills
                      ? `Based on ${userSkills.length} skill${userSkills.length > 1 ? 's' : ''}`
                      : "Complete your profile for personalized recommendations"
                    }
                  </p>
                </div>
              </div>
              {hasSkills && (
                <div className="hidden sm:flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-xl border border-emerald-200/50 dark:border-emerald-700/50">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                    AI Enabled
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Warning */}
        {!hasSkills && (
          <div className="mb-8">
            <div className="relative bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200/60 dark:border-amber-700/60 rounded-2xl p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                    <ExclamationTriangleIcon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-200 mb-2">
                    Incomplete Profile
                  </h3>
                  <p className="text-amber-800 dark:text-amber-300 mb-4 leading-relaxed">
                    Add your skills to your profile to get personalized and accurate job recommendations tailored to your expertise.
                  </p>
                  <button
                    onClick={() => navigate('/dashboard', { state: { activeSection: 'mon-espace' } })}
                    className="group inline-flex items-center px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <UserCircleIcon className="w-4 h-4 mr-2" />
                    Complete My Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* User Profile Summary */}
        {userProfile && (
          <div className="mb-8">
            <div className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-200/60 dark:border-slate-700/60 p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Your Search Profile
                </h2>
                <button
                  onClick={() => navigate('/dashboard', { state: { activeSection: 'mon-espace' } })}
                  className="group flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium transition-colors"
                >
                  <UserCircleIcon className="w-4 h-4" />
                  <span>Edit</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                    Skills ({userSkills.length})
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {userSkills.slice(0, 3).map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-sm font-medium rounded-lg border border-blue-200/50 dark:border-blue-700/50"
                      >
                        {skill}
                      </span>
                    ))}
                    {userSkills.length > 3 && (
                      <span className="inline-flex items-center px-3 py-1.5 bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 text-sm font-medium rounded-lg">
                        +{userSkills.length - 3} more
                      </span>
                    )}
                    {userSkills.length === 0 && (
                      <span className="text-sm text-red-500 dark:text-red-400 font-medium">
                        No skills added
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                    Preferred Location
                  </label>
                  <p className="text-slate-600 dark:text-slate-400 font-medium">
                    {userProfile.location || "Not specified"}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                    Experience Level
                  </label>
                  <p className="text-slate-600 dark:text-slate-400 font-medium">
                    {userProfile.experienceLevel || "Not specified"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modern Filters Bar */}
        <div className="mb-8">
          <div className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-200/60 dark:border-slate-700/60 p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Search & Filters
              </h3>
              <button className="group flex items-center space-x-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
                <AdjustmentsHorizontalIcon className="w-4 h-4" />
                <span className="text-sm font-medium">Adjust Recommendations</span>
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <MagnifyingGlassIcon className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search for opportunities..."
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
              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      City
                    </label>
                    <select
                      value={filters.location}
                      onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                      className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="">All cities</option>
                      <option value="Casablanca">Casablanca</option>
                      <option value="Rabat">Rabat</option>
                      <option value="Marrakech">Marrakech</option>
                      <option value="Fès">Fès</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Contract Type
                    </label>
                    <select
                      value={filters.jobType}
                      onChange={(e) => setFilters({ ...filters, jobType: e.target.value })}
                      className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="">All types</option>
                      <option value="CDI">CDI</option>
                      <option value="CDD">CDD</option>
                      <option value="Stage">Internship</option>
                      <option value="Freelance">Freelance</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Experience
                    </label>
                    <select
                      value={filters.experience}
                      onChange={(e) => setFilters({ ...filters, experience: e.target.value })}
                      className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="">All experience</option>
                      <option value="0-1 an">0-1 year</option>
                      <option value="1-3 ans">1-3 years</option>
                      <option value="3-5 ans">3-5 years</option>
                      <option value="5+ ans">5+ years</option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    <label className="flex items-center space-x-3">
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

        {/* Job Recommendations */}
        <JobRecommendations
          userId={userProfile?.id}
          userSkills={userSkills}
          userLocation={userProfile?.location}
          maxJobs={12}
          realTimeUpdate={true}
        />
      </div>
    </div>
  );
};

export default JobRecommendationsPage;