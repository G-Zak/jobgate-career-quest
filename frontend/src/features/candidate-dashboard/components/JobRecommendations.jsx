import React, { useState, useEffect } from 'react';
import {
  BriefcaseIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  StarIcon,
  ArrowTopRightOnSquareIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import dashboardApi from '../services/dashboardApi';
import jobRecommendationsApi from '../../../services/jobRecommendationsApi';
import { useAuth } from '../../../contexts/AuthContext';
import { loadUserProfile } from '../../../utils/profileUtils';

const JobRecommendations = ({ onViewAll, limit = 3 }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Load user profile
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await loadUserProfile();
        setUserProfile(profile);
      } catch (err) {
        console.error('Error loading user profile:', err);
      }
    };

    loadProfile();
  }, []);

  // Fetch dynamic job recommendations
  const fetchJobRecommendations = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      // Try to get recommendations from the advanced API first
      if (userProfile && userProfile.skills && userProfile.skills.length > 0) {
        try {
          const userProfileData = {
            name: userProfile.name || 'User',
            email: userProfile.email || 'user@example.com',
            skills: userProfile.skills || [],
            skillsWithProficiency: userProfile.skillsWithProficiency || userProfile.skills.map(skill => ({
              name: typeof skill === 'string' ? skill : skill.name || skill,
              proficiency: 'intermediate'
            })),
            contact: {
              location: userProfile.location || 'Unknown'
            },
            education: userProfile.education || [],
            experience: userProfile.experience || [],
            experienceLevel: userProfile.experienceLevel || 'intermediate',
            location: userProfile.location || 'Unknown'
          };

          console.log('🔍 Fetching dynamic job recommendations with profile:', userProfileData);

          const response = await jobRecommendationsApi.syncProfileAndGetRecommendations(
            userProfileData,
            {},
            { limit: limit, min_score: 50.0 }
          );

          if (response && response.recommendations && response.recommendations.length > 0) {
            // Transform API response to dashboard format
            const transformedJobs = response.recommendations.map(rec => ({
              id: rec.job_id || rec.id,
              title: rec.job_title || rec.title,
              company: rec.company_name || rec.company,
              match: Math.round(rec.match_score || rec.score || 0),
              salary: rec.salary || 'Competitive',
              location: rec.location || 'Not specified',
              skills: rec.required_skills || rec.skills || [],
              description: rec.description || '',
              type: rec.job_type || 'Full-time',
              posted: rec.posted_date || new Date().toISOString()
            }));

            setJobs(transformedJobs);
            return;
          }
        } catch (apiError) {
          console.warn('Advanced API failed, falling back to basic API:', apiError);
        }
      }

      // Fallback to basic dashboard API
      const data = await dashboardApi.getJobRecommendations(limit);
      setJobs(data);
    } catch (err) {
      console.error('Error fetching job recommendations:', err);
      setError('Failed to load job recommendations');
      // Keep empty array on error
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchJobRecommendations();
  }, [limit, userProfile]);

  // Refresh function
  const handleRefresh = () => {
    fetchJobRecommendations(true);
  };

  const getMatchColor = (match) => {
    if (match >= 80) return 'text-green-600 bg-green-50';
    if (match >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getMatchLabel = (match) => {
    if (match >= 80) return 'Excellent Match';
    if (match >= 60) return 'Good Match';
    return 'Fair Match';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
              <div>
                <div className="h-6 w-48 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 w-32 bg-gray-200 rounded"></div>
              </div>
            </div>
            <div className="h-8 w-24 bg-gray-200 rounded"></div>
          </div>
          <div className="space-y-4">
            {[...Array(limit)].map((_, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="h-5 w-48 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-8 w-16 bg-gray-200 rounded"></div>
                </div>
                <div className="flex space-x-4">
                  <div className="h-4 w-20 bg-gray-200 rounded"></div>
                  <div className="h-4 w-16 bg-gray-200 rounded"></div>
                  <div className="h-4 w-24 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center py-8">
          <ExclamationTriangleIcon className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to Load Jobs</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <BriefcaseIcon className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Job Recommendations</h2>
            <p className="text-sm text-gray-500">
              {userProfile && userProfile.skills && userProfile.skills.length > 0
                ? `Based on your ${userProfile.skills.length} skills and test results`
                : 'Based on your skills and test results'
              }
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 text-sm font-medium transition-colors disabled:opacity-50"
            title="Refresh recommendations"
          >
            <ArrowPathIcon className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>

          {onViewAll && (
            <button
              onClick={onViewAll}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
            >
              <span>View All</span>
              <ArrowTopRightOnSquareIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Job Cards */}
      <div className="space-y-4">
        {jobs.length === 0 ? (
          <div className="text-center py-8">
            <BriefcaseIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {userProfile && userProfile.skills && userProfile.skills.length > 0
                ? 'No Matching Jobs Found'
                : 'No Jobs Available'
              }
            </h3>
            <p className="text-gray-600 mb-4">
              {userProfile && userProfile.skills && userProfile.skills.length > 0
                ? 'Try adjusting your skills or complete more tests to find better matches'
                : 'Add your skills to your profile to get personalized job recommendations'
              }
            </p>
            {userProfile && userProfile.skills && userProfile.skills.length > 0 && (
              <button
                onClick={handleRefresh}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Refresh Recommendations
              </button>
            )}
          </div>
        ) : (
          jobs.map((job) => (
            <div key={job.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors group">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                    {job.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">{job.company}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <MapPinIcon className="w-4 h-4" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <CurrencyDollarIcon className="w-4 h-4" />
                      <span>{job.salary}</span>
                    </div>
                    {job.type && (
                      <div className="flex items-center space-x-1">
                        <BriefcaseIcon className="w-4 h-4" />
                        <span>{job.type}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Match Score */}
                <div className="text-right">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getMatchColor(job.match)}`}>
                    <StarIcon className="w-4 h-4 mr-1" />
                    {job.match}% Match
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{getMatchLabel(job.match)}</p>
                </div>
              </div>

              {/* Skills */}
              {job.skills && job.skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {job.skills.slice(0, 4).map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md border border-blue-200"
                    >
                      {skill}
                    </span>
                  ))}
                  {job.skills.length > 4 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                      +{job.skills.length - 4} more
                    </span>
                  )}
                </div>
              )}

              {/* Job Description Preview */}
              {job.description && (
                <div className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {job.description.length > 120
                    ? `${job.description.substring(0, 120)}...`
                    : job.description
                  }
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="text-xs text-gray-500">
                  {job.posted && `Posted ${new Date(job.posted).toLocaleDateString()}`}
                </div>
                <div className="flex space-x-2">
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors">
                    View Details
                  </button>
                  <button className="text-green-600 hover:text-green-700 text-sm font-medium transition-colors">
                    Apply Now
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Job Match Insights */}
      {jobs.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Job Match Insights</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">
                {jobs.filter(job => job.match >= 80).length} Excellent matches
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600">
                {jobs.filter(job => job.match >= 60 && job.match < 80).length} Good matches
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-gray-600">
                {jobs.filter(job => job.match >= 50 && job.match < 60).length} Fair matches
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <span className="text-gray-600">
                {jobs.filter(job => job.match < 50).length} Low matches
              </span>
            </div>
          </div>

          {/* Average Match Score */}
          <div className="mt-4 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Average Match Score</span>
              <span className="text-sm font-semibold text-gray-900">
                {Math.round(jobs.reduce((sum, job) => sum + job.match, 0) / jobs.length)}%
              </span>
            </div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(100, Math.round(jobs.reduce((sum, job) => sum + job.match, 0) / jobs.length))}%`
                }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Tips */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Tips</h3>
        <div className="space-y-2 text-sm text-gray-600">
          {userProfile && userProfile.skills && userProfile.skills.length > 0 ? (
            <>
              <p>• Your profile has {userProfile.skills.length} skills - keep adding more for better matches</p>
              <p>• Focus on skills that appear frequently in your target roles</p>
              <p>• Complete more assessments to improve job matching accuracy</p>
              <p>• Consider taking specialized tests for your desired career path</p>
            </>
          ) : (
            <>
              <p>• Add your skills to your profile to get personalized job recommendations</p>
              <p>• Complete assessments to improve job matching accuracy</p>
              <p>• Focus on skills that appear frequently in your target roles</p>
              <p>• Consider taking specialized tests for your desired career path</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobRecommendations;