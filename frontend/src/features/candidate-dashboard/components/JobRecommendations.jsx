import React, { useState, useEffect } from 'react';
import { jobOffers } from '../../../data/jobOffers';

const JobRecommendations = ({ onViewAll, maxJobs = 2 }) => {
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
      await new Promise(resolve => setTimeout(resolve, 500));
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

  // Function to calculate job recommendations
  const calculateRecommendedJobs = (profile) => {
    const userSkills = profile.skills || [];
    const userLocation = profile.location || 'Casablanca';

    if (!jobOffers || jobOffers.length === 0) {
      return [];
    }
    
    const activeJobs = jobOffers.filter(job => job.status !== 'inactive');
    
    const jobsWithScores = activeJobs.map(job => {
      let score = 0;
      
      // Skills matching (50% weight)
      if (userSkills.length > 0 && job.tags && job.tags.length > 0) {
        const matchingSkills = job.tags.filter(skill => 
          userSkills.some(userSkill => 
            userSkill.name && userSkill.name.toLowerCase() === skill.toLowerCase()
          )
        );
        const skillsScore = (matchingSkills.length / job.tags.length) * 50;
        score += skillsScore;

        // Proficiency bonus
        matchingSkills.forEach(skill => {
          const userSkill = userSkills.find(us => 
            us.name && us.name.toLowerCase() === skill.toLowerCase()
          );
          if (userSkill && userSkill.proficiency) {
            const proficiencyBonus = {
              'expert': 10,
              'advanced': 7,
              'intermediate': 4,
              'beginner': 2
            }[userSkill.proficiency] || 0;
            score += proficiencyBonus;
          }
        });
      }
      
      // Location matching (20% weight)
      if (job.location.toLowerCase().includes(userLocation.toLowerCase()) || 
          job.remote) {
        score += 20;
      }
      
      // Remote work bonus (10% weight)
      if (job.remote) {
        score += 10;
      }
      
      // Job recency (10% weight)
      if (job.postedDate) {
        const daysSincePosted = Math.floor(
          (new Date() - new Date(job.postedDate)) / (1000 * 60 * 60 * 24)
        );
        if (daysSincePosted <= 7) score += 10;
        else if (daysSincePosted <= 30) score += 5;
      }
      
      // Job type preference (10% weight)
      if (job.type === 'Full-time') score += 10;
      
      return {
        ...job,
        matchScore: Math.min(Math.round(score), 100)
      };
    });
    
    return jobsWithScores
      .filter(job => job.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, maxJobs);
  };

  // Initial load
  useEffect(() => {
    const profile = getUserProfile();
    setUserProfile(profile);
    updateRecommendations(profile);
  }, [maxJobs]);

  // Listen for localStorage changes (profile updates)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'userProfile' || e.storageArea === localStorage) {
        const newProfile = getUserProfile();
        setUserProfile(newProfile);
        updateRecommendations(newProfile);
      }
    };

    // Listen for storage events (changes from other tabs/windows)
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [maxJobs]);

  // Periodic check for profile changes (for same-tab updates)
  useEffect(() => {
    const interval = setInterval(() => {
      const currentProfile = getUserProfile();
      const currentProfileStr = JSON.stringify(currentProfile);
      const savedProfileStr = JSON.stringify(userProfile);
      
      if (currentProfileStr !== savedProfileStr) {
        console.log('Profile changed, updating job recommendations...');
        setUserProfile(currentProfile);
        updateRecommendations(currentProfile);
      }
    }, 2000); // Check every 2 seconds

    return () => clearInterval(interval);
  }, [userProfile, maxJobs]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <h2 className="text-xl font-bold text-gray-900">Recommended Jobs</h2>
          {isUpdating && (
            <div className="flex items-center space-x-2 text-sm text-blue-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span>Updating...</span>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={handleRefresh}
            disabled={isUpdating}
            className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded transition-colors disabled:opacity-50"
            title="Refresh recommendations"
          >
            <svg className={`w-4 h-4 ${isUpdating ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <button 
            onClick={onViewAll}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            View all jobs →
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        {recommendedJobs && recommendedJobs.length > 0 ? (
          recommendedJobs.map(job => (
            <div
              key={job.id}
              className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200 hover:border-blue-200 cursor-pointer group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                      style={{ backgroundColor: job.logoColor || '#3B82F6' }}
                    >
                      {job.logo || job.company.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {job.title}
                      </h3>
                      <p className="text-sm text-gray-600">{job.company}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {job.location}
                      {job.remote && <span className="ml-1 text-green-600">(Remote)</span>}
                    </span>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                      {job.salary}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-700">Match:</span>
                      <div className="w-20 h-2 bg-gray-200 rounded-full">
                        <div 
                          className={`h-2 rounded-full ${
                            job.matchScore >= 80 ? 'bg-green-500' : 
                            job.matchScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${job.matchScore}%` }}
                        ></div>
                      </div>
                      <span className={`text-sm font-semibold ${
                        job.matchScore >= 80 ? 'text-green-600' : 
                        job.matchScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {job.matchScore}%
                      </span>
                    </div>
                    
                    <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p className="mb-2">No job recommendations available yet.</p>
            <p className="text-sm">Complete your profile to get personalized recommendations!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobRecommendations;