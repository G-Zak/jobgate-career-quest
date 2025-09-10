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
  SparklesIcon
} from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';
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

  // Listen for profile changes if real-time update is enabled
  useEffect(() => {
    if (!realTimeUpdate) return;

    const handleStorageChange = (e) => {
      if (e.key === 'userProfile') {
        const updatedProfile = JSON.parse(e.newValue);
        setUserProfile(updatedProfile);
        setLastUpdateTime(Date.now());
      }
    };

    // Listen for localStorage changes
    window.addEventListener('storage', handleStorageChange);

    // Also check for profile changes periodically
    const interval = setInterval(() => {
      const currentProfile = loadUserProfile();
      if (currentProfile && JSON.stringify(currentProfile) !== JSON.stringify(userProfile)) {
        setUserProfile(currentProfile);
        setLastUpdateTime(Date.now());
      }
    }, 1000); // Check every second

    return () => {
      window.removeEventListener('storage', handleStorageChange);
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

  const toggleSaveJob = (jobId) => {
    setSavedJobs(prev => {
      const newSaved = new Set(prev);
      if (newSaved.has(jobId)) {
        newSaved.delete(jobId);
      } else {
        newSaved.add(jobId);
      }
      return newSaved;
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
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="animate-pulse">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Recommandations pour vous
        </h2>
        <div className="flex items-center space-x-4">
          {currentUserSkills.length > 0 && (
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
              <SparklesIcon className="w-4 h-4 text-blue-500" />
              <span>Basé sur {currentUserSkills.length} compétence{currentUserSkills.length > 1 ? 's' : ''}</span>
            </div>
          )}
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {recommendedJobs.length} offres trouvées
          </span>
        </div>
      </div>

      {/* Skills Summary */}
      {currentUserSkills.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center space-x-2 mb-2">
            <TagIcon className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900 dark:text-blue-300">
              Compétences utilisées pour les recommandations:
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {currentUserSkills.slice(0, 8).map((skill, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-300 rounded-full text-xs font-medium"
              >
                {typeof skill === 'string' ? skill : skill.name}
              </span>
            ))}
            {currentUserSkills.length > 8 && (
              <span className="text-xs text-blue-600 dark:text-blue-400">
                +{currentUserSkills.length - 8} autres
              </span>
            )}
          </div>
        </div>
      )}

      <div className="space-y-4">
        {recommendedJobs.map((job) => (
          <div 
            key={job.id} 
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-all duration-200 group"
          >
            {/* Header Row */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-4 flex-1">
                {/* Company Logo */}
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                  style={{ backgroundColor: job.logoColor }}
                >
                  {job.logo}
                </div>
                
                {/* Job Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                        {job.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 font-medium">
                        {job.company}
                      </p>
                    </div>
                    
                    {/* Match Score */}
                    <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getScoreColor(job.recommendationScore)}`}>
                      <div className="flex items-center space-x-1">
                        <StarIcon className="w-3 h-3" />
                        <span>{Math.round(job.recommendationScore)}%</span>
                        {job.isHighMatch && <span className="text-green-600">⚡</span>}
                      </div>
                    </div>
                  </div>
                  
                  {/* Job Details */}
                  <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <MapPinIcon className="w-4 h-4" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <BriefcaseIcon className="w-4 h-4" />
                      <span>{job.type}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <ClockIcon className="w-4 h-4" />
                      <span>{job.experience}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <CurrencyDollarIcon className="w-4 h-4" />
                      <span>{job.salary}</span>
                    </div>
                    {job.remote && (
                      <span className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 text-xs px-2 py-1 rounded-full">
                        Télétravail
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Action Button */}
              <button
                onClick={() => toggleSaveJob(job.id)}
                className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors ml-4"
              >
                {savedJobs.has(job.id) ? (
                  <BookmarkSolidIcon className="w-5 h-5 text-blue-600" />
                ) : (
                  <BookmarkIcon className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Description */}
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
              {job.description}
            </p>

            {/* Skills Tags */}
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {job.tags.slice(0, 6).map((tag, index) => {
                  const isMatched = job.matchedSkills.includes(tag);
                  return (
                    <span 
                      key={index}
                      className={`text-xs px-2 py-1 rounded-full border ${
                        isMatched 
                          ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700' 
                          : 'bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600'
                      }`}
                    >
                      {isMatched && <TagIcon className="w-3 h-3 inline mr-1" />}
                      {tag}
                    </span>
                  );
                })}
                {job.tags.length > 6 && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    +{job.tags.length - 6} more
                  </span>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Publié le {new Date(job.posted).toLocaleDateString('fr-FR')}
              </div>
              
              <div className="flex items-center space-x-3">
                <button className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  <EyeIcon className="w-4 h-4" />
                  <span>Voir détails</span>
                </button>
                
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1">
                  <span>Postuler</span>
                  <ChevronRightIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {recommendedJobs.length === 0 && !loading && (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <BriefcaseIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Aucune recommandation trouvée
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {currentUserSkills.length === 0 
              ? "Ajoutez vos compétences dans votre profil pour obtenir des recommandations personnalisées."
              : "Aucune offre ne correspond actuellement à vos compétences. Essayez d'ajouter d'autres compétences ou vérifiez plus tard."
            }
          </p>
          {currentUserSkills.length === 0 && (
            <button 
              onClick={() => window.location.href = '/profile'}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Compléter mon profil
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default JobRecommendations;
