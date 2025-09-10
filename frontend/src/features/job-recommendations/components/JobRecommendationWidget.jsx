import React from 'react';
import { 
  BriefcaseIcon, 
  MapPinIcon, 
  ClockIcon,
  ChevronRightIcon,
  StarIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { jobOffers } from '../../../data/jobOffers';

const JobRecommendationWidget = ({ userSkills = [], userLocation = "Casablanca", maxJobs = 3, onViewAll }) => {
  // Simple recommendation algorithm for widget
  const getRecommendedJobs = () => {
    const activeJobs = jobOffers.filter(job => job.status === 'active');
    
    // Calculate simple scores
    const jobsWithScores = activeJobs.map(job => {
      let score = 0;
      
      // Skills matching
      const skillMatches = job.tags.filter(tag => 
        userSkills.some(skill => 
          skill.toLowerCase().includes(tag.toLowerCase()) || 
          tag.toLowerCase().includes(skill.toLowerCase())
        )
      );
      score += (skillMatches.length / Math.max(job.tags.length, 1)) * 40;
      
      // Location matching
      if (job.location.toLowerCase().includes(userLocation.toLowerCase())) {
        score += 20;
      }
      
      // Remote work bonus
      if (job.remote) score += 10;
      
      // Recency bonus
      const daysOld = Math.floor((new Date() - new Date(job.posted)) / (1000 * 60 * 60 * 24));
      score += Math.max(0, 15 - (daysOld * 0.5));
      
      // Job type preference
      score += job.type === 'CDI' ? 15 : job.type === 'Stage' ? 10 : 5;
      
      return {
        ...job,
        score: Math.min(100, Math.max(0, score)),
        matchedSkills: skillMatches
      };
    });
    
    return jobsWithScores
      .sort((a, b) => b.score - a.score)
      .slice(0, maxJobs);
  };

  const recommendedJobs = getRecommendedJobs();

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
            </h3>
          </div>
        </div>
        
        <button 
          onClick={onViewAll}
          className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium flex items-center space-x-1"
        >
          <span>View all jobs →</span>
        </button>
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
                
                {/* Matched Skills */}
                {job.matchedSkills.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {job.matchedSkills.slice(0, 3).map((skill, index) => (
                      <span 
                        key={index}
                        className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-xs px-2 py-0.5 rounded-full"
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
