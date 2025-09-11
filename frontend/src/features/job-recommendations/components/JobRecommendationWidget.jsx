import React, { useState, useEffect } from 'react';
import { 
  BriefcaseIcon, 
  MapPinIcon, 
  ClockIcon,
  ChevronRightIcon,
  StarIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { jobOffers } from '../../../data/jobOffers';

const JobRecommendationWidget = ({ maxJobs = 3, onViewAll }) => {
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [userProfile, setUserProfile] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);

  // Function to get user profile from localStorage
  const getUserProfile = () => {
    try {
      const profile = JSON.parse(localStorage.getItem('userProfile') || '{}');
      return profile;
    } catch (error) {
      console.error('Error parsing user profile:', error);
      return {};
    }
  };

  // Function to update recommendations with loading state
  const updateRecommendations = async (profile) => {
    setIsUpdating(true);
    try {
      // Small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 300));
      const newJobs = calculateRecommendedJobs(profile);
      setRecommendedJobs(newJobs);
    } finally {
      setIsUpdating(false);
    }
  };

  // Manual refresh function
  const handleRefresh = () => {
    const currentProfile = getUserProfile();
    setUserProfile(currentProfile);
    updateRecommendations(currentProfile);
  };

  // Enhanced recommendation algorithm
  const calculateRecommendedJobs = (profile) => {
    const userSkills = profile.skills || [];
    const userLocation = profile.location || 'Casablanca';

    if (!jobOffers || jobOffers.length === 0) {
      return [];
    }
    
    const activeJobs = jobOffers.filter(job => job.status !== 'inactive');
    
    const jobsWithScores = activeJobs.map(job => {
      let score = 0;
      let reasons = [];
      
      // Skill matching (50% weight)
      const jobSkills = job.skills || [];
      const skillMatches = jobSkills.filter(skill => 
        userSkills.some(userSkill => 
          userSkill.name && userSkill.name.toLowerCase() === skill.toLowerCase()
        )
      );
      
      if (skillMatches.length > 0) {
        score += (skillMatches.length / jobSkills.length) * 50;
        
        // Proficiency bonus
        const totalProficiency = skillMatches.reduce((sum, skillName) => {
          const userSkill = userSkills.find(us => 
            us.name && us.name.toLowerCase() === skillName.toLowerCase()
          );
          return sum + (userSkill?.proficiency || 0);
        }, 0);
        
        if (totalProficiency > 0) {
          score += (totalProficiency / (skillMatches.length * 5)) * 15;
          reasons.push(`${skillMatches.length} skill match${skillMatches.length > 1 ? 'es' : ''}`);
        }
      }
      
      // Location matching (20% weight)
      if (job.location && userLocation) {
        if (job.location.toLowerCase().includes(userLocation.toLowerCase()) || 
            userLocation.toLowerCase().includes(job.location.toLowerCase())) {
          score += 20;
          reasons.push('Location match');
        }
      }
      
      // Remote work bonus (10% weight)
      if (job.type && job.type.toLowerCase().includes('remote')) {
        score += 10;
        reasons.push('Remote work');
      }
      
      // Experience level matching (15% weight)
      if (job.level && profile.experience) {
        const experienceYears = profile.experience;
        if ((job.level.toLowerCase().includes('junior') && experienceYears <= 2) ||
            (job.level.toLowerCase().includes('mid') && experienceYears >= 2 && experienceYears <= 5) ||
            (job.level.toLowerCase().includes('senior') && experienceYears >= 5)) {
          score += 15;
          reasons.push('Experience level match');
        }
      }
      
      return {
        ...job,
        score: Math.round(score),
        reasons: reasons,
        matchedSkills: skillMatches
      };
    });
    
    return jobsWithScores
      .filter(job => job.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, maxJobs);
  };

  // Initialize recommendations and profile on component mount
  useEffect(() => {
    const profile = getUserProfile();
    setUserProfile(profile);
    updateRecommendations(profile);
  }, []);

  // Listen for localStorage changes from other components
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'userProfile') {
        const newProfile = getUserProfile();
        setUserProfile(newProfile);
        updateRecommendations(newProfile);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Periodic check for profile changes (fallback)
  useEffect(() => {
    const interval = setInterval(() => {
      const currentProfile = getUserProfile();
      const currentProfileString = JSON.stringify(currentProfile);
      const storedProfileString = JSON.stringify(userProfile);
      
      if (currentProfileString !== storedProfileString) {
        setUserProfile(currentProfile);
        updateRecommendations(currentProfile);
      }
    }, 2000); // Check every 2 seconds

    return () => clearInterval(interval);
  }, [userProfile]);

  if (!jobOffers || jobOffers.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        No job offers available
      </div>
    );
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-gray-600';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      {/* Widget Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <BriefcaseIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recommended Jobs
              {isUpdating && (
                <span className="ml-2 text-sm text-blue-600 dark:text-blue-400">
                  Updating...
                </span>
              )}
            </h3>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            disabled={isUpdating}
            className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors disabled:opacity-50"
            title="Refresh recommendations"
          >
            <svg className={`w-4 h-4 ${isUpdating ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          
          <button 
            onClick={onViewAll}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium flex items-center space-x-1"
          >
            <span>View all jobs →</span>
          </button>
        </div>
      </div>

      {/* Job List */}
      <div className="space-y-4">
        {recommendedJobs.map((job) => (
          <div 
            key={job.id}
            className="group p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 cursor-pointer"
          >
            <div className="flex items-start space-x-3">
              {/* Company Logo */}
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
                style={{ backgroundColor: job.logoColor }}
              >
                {job.logo}
              </div>
              
              {/* Job Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                      {job.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {job.company}
                    </p>
                  </div>
                  
                  {/* Match Score */}
                  <div className={`flex items-center space-x-1 ${getScoreColor(job.score)}`}>
                    <StarIcon className="w-3 h-3" />
                    <span className="text-xs font-medium">
                      {Math.round(job.score)}%
                    </span>
                  </div>
                </div>
                
                {/* Job Details */}
                <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <MapPinIcon className="w-3 h-3" />
                    <span className="truncate">{job.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <ClockIcon className="w-3 h-3" />
                    <span>{job.type}</span>
                  </div>
                  {job.remote && (
                    <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 px-2 py-0.5 rounded-full">
                      Remote
                    </span>
                  )}
                </div>
                
                {/* Match Reasons */}
                {job.reasons && job.reasons.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {job.reasons.slice(0, 2).map((reason, index) => (
                      <span 
                        key={index}
                        className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-xs px-2 py-0.5 rounded-full"
                      >
                        {reason}
                      </span>
                    ))}
                    {job.reasons.length > 2 && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        +{job.reasons.length - 2} more
                      </span>
                    )}
                  </div>
                )}
                
                {/* Matched Skills */}
                {job.matchedSkills && job.matchedSkills.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {job.matchedSkills.slice(0, 3).map((skill, index) => (
                      <span 
                        key={index}
                        className="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300 text-xs px-2 py-0.5 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                    {job.matchedSkills.length > 3 && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        +{job.matchedSkills.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>
              
              {/* Action Arrow */}
              <ChevronRightIcon className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors flex-shrink-0" />
            </div>
          </div>
        ))}
      </div>

      {/* Widget Footer */}
      {recommendedJobs.length === 0 ? (
        <div className="text-center py-8">
          <BriefcaseIcon className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Mettez à jour votre profil pour des recommandations personnalisées
          </p>
        </div>
      ) : (
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button 
            onClick={onViewAll}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2"
          >
            <span>Voir toutes les recommandations</span>
            <ArrowRightIcon className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default JobRecommendationWidget;
