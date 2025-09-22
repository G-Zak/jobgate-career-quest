import React from 'react';
import {
  BriefcaseIcon,
  MapPinIcon,
  ClockIcon,
  ChevronRightIcon,
  StarIcon,
  ArrowRightIcon,
  SparklesIcon,
  CalendarIcon,
  CurrencyDollarIcon
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
    <div className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-200/60 dark:border-slate-700/60 p-6 shadow-lg">
      {/* Modern Widget Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <BriefcaseIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Job Recommendations
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {recommendedJobs.length} opportunities found
            </p>
          </div>
        </div>

        <button
          onClick={onViewAll}
          className="group flex items-center space-x-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 text-sm font-medium transition-colors"
        >
          <span>View all</span>
          <ChevronRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
        </button>
      </div>

      {/* Modern Job List */}
      <div className="space-y-3">
        {recommendedJobs.map((job) => (
          <div
            key={job.id}
            className="group relative p-4 rounded-xl border border-slate-200/60 dark:border-slate-700/60 hover:border-slate-300/60 dark:hover:border-slate-600/60 hover:shadow-md transition-all duration-200 cursor-pointer bg-white/50 dark:bg-slate-800/30"
          >
            {/* Match Score Badge */}
            <div className="absolute -top-2 -right-2">
              <div className="flex items-center space-x-1 px-2 py-1 bg-gradient-to-r from-emerald-500 to-green-500 text-white text-xs font-semibold rounded-full shadow-lg">
                <StarIcon className="w-3 h-3" />
                <span>{Math.round(job.score)}%</span>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              {/* Company Avatar */}
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-800 dark:from-slate-500 dark:to-slate-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <span className="text-white font-bold text-sm">
                    {job.company.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Job Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                      {job.title}
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 truncate font-medium">
                      {job.company}
                    </p>
                  </div>
                </div>

                {/* Job Details */}
                <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center space-x-1">
                    <MapPinIcon className="w-3 h-3" />
                    <span className="truncate">{job.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <ClockIcon className="w-3 h-3" />
                    <span>{job.type}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CalendarIcon className="w-3 h-3" />
                    <span>2 days ago</span>
                  </div>
                  {job.remote && (
                    <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 px-2 py-0.5 rounded-full text-xs font-medium">
                      Remote
                    </span>
                  )}
                </div>

                {/* Matched Skills */}
                {job.matchedSkills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {job.matchedSkills.slice(0, 3).map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-xs font-medium rounded-lg border border-blue-200/50 dark:border-blue-700/50"
                      >
                        {skill}
                      </span>
                    ))}
                    {job.matchedSkills.length > 3 && (
                      <span className="inline-flex items-center px-2 py-1 bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 text-xs font-medium rounded-lg">
                        +{job.matchedSkills.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Action Arrow */}
              <ChevronRightIcon className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors flex-shrink-0 mt-1" />
            </div>
          </div>
        ))}
      </div>

      {/* Modern Widget Footer */}
      {recommendedJobs.length === 0 ? (
        <div className="text-center py-8">
          <div className="relative inline-flex items-center justify-center w-16 h-16 mb-4">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-full blur-xl"></div>
            <div className="relative w-16 h-16 bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-2xl flex items-center justify-center shadow-lg">
              <BriefcaseIcon className="w-8 h-8 text-slate-400" />
            </div>
          </div>
          <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            No recommendations yet
          </h4>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            Update your profile to get personalized job recommendations
          </p>
          <button
            onClick={onViewAll}
            className="group inline-flex items-center px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white text-sm font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <SparklesIcon className="w-4 h-4 mr-2" />
            <span>Complete Profile</span>
          </button>
        </div>
      ) : (
        <div className="mt-6 pt-4 border-t border-slate-200/60 dark:border-slate-700/60">
          <button
            onClick={onViewAll}
            className="group w-full bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
          >
            <span>View All Recommendations</span>
            <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        </div>
      )}
    </div>
  );
};

export default JobRecommendationWidget;
