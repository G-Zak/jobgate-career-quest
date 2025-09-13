import React, { useState, useEffect } from 'react';
import { MapPin, DollarSign, ArrowRight, Star, Briefcase } from 'lucide-react';
import { useRecommendations, useUserProfile } from '../../recommendations/useRecommendations';
import { getMatchExplanation, getTopSkillsFromJob } from '../../recommendations/engine';
import { formatMAD, getSalaryRange } from '../../recommendations/salary';

const JobRecommendations = ({ onViewAll, maxJobs = 2 }) => {
  const userProfile = useUserProfile();
  const { recommendations, userSkills, loading, error, hasAttempts } = useRecommendations(userProfile, maxJobs);

  const getMatchColor = (score) => {
    if (score >= 80) return 'sa-job-match-fill-success';
    if (score >= 60) return 'sa-job-match-fill-warning';
    return 'sa-job-match-fill-danger';
  };

  if (loading) {
    return (
      <div className="sa-card sa-fade-in">
        <div className="sa-card-header">
          <h2 className="sa-heading-2">Recommended Jobs</h2>
        </div>
        <div className="animate-pulse sa-stack">
          {[1, 2].map(i => (
            <div key={i} className="sa-job-card">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="sa-card sa-fade-in">
        <div className="sa-card-header">
          <h2 className="sa-heading-2">Recommended Jobs</h2>
        </div>
        <div className="sa-empty-state">
          <div className="sa-empty-state-icon">
            <Briefcase className="w-12 h-12 text-gray-400" />
          </div>
          <div className="sa-empty-state-title">Error loading jobs</div>
          <div className="sa-empty-state-description">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="sa-card sa-fade-in">
      <div className="sa-card-header">
        <div className="flex items-center justify-between">
          <h2 className="sa-heading-2">Recommended Jobs</h2>
          <button 
            onClick={onViewAll}
            className="sa-btn sa-btn-ghost"
          >
            View all jobs
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="sa-stack">
        {recommendations && recommendations.length > 0 ? (
          recommendations.map(({ job, matchPct, parts }) => {
            const topSkills = getTopSkillsFromJob(job, 3);
            const salaryRange = getSalaryRange(job.salary_mad_min, job.salary_mad_max);
            
            return (
              <div
                key={job.id}
                className="sa-job-card"
              >
                <div className="sa-job-header">
                  <div 
                    className="sa-job-logo"
                    style={{ backgroundColor: job.logoColor || '#3B82F6' }}
                  >
                    {job.logo || job.company.charAt(0)}
                  </div>
                  <div className="sa-job-info">
                    <h3 className="sa-job-title">
                      {job.title}
                    </h3>
                    <p className="sa-job-company">{job.company}</p>
                  </div>
                </div>
                
                <div className="sa-job-meta">
                  <span className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {job.location}
                    {job.remote && <span className="ml-1 sa-chip sa-chip-success">Remote</span>}
                  </span>
                  <span className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-1" />
                    {salaryRange}
                  </span>
                </div>
                
                <div className="mb-3">
                  <div className="flex flex-wrap gap-1">
                    {topSkills.map(({ skill, weight }) => (
                      <span key={skill} className="sa-chip sa-chip-primary text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="sa-job-footer">
                  <div className="sa-job-match">
                    <span className="sa-body">Match:</span>
                    <div className="sa-job-match-bar">
                      <div 
                        className={`sa-job-match-fill ${getMatchColor(matchPct)}`}
                        style={{ width: `${matchPct}%` }}
                      ></div>
                    </div>
                    <span className={`sa-body font-semibold ${
                      matchPct >= 80 ? 'text-green-600' : 
                      matchPct >= 60 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {matchPct}%
                    </span>
                  </div>
                  
                  <button className="sa-btn sa-btn-primary">
                    Apply Now
                  </button>
                </div>
                
                <div className="mt-2">
                  <p className="sa-caption text-xs text-gray-500">
                    {getMatchExplanation(parts)}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="sa-empty-state">
            <div className="sa-empty-state-icon">
              <Briefcase className="w-12 h-12 text-gray-400" />
            </div>
            <div className="sa-empty-state-title">
              {!hasAttempts ? 'No job recommendations available yet' : 'No matching jobs found'}
            </div>
            <div className="sa-empty-state-description">
              {!hasAttempts 
                ? 'Complete some tests to get personalized recommendations!' 
                : 'Try adjusting your preferences or complete more tests to improve matches.'
              }
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobRecommendations;