import React from 'react';
import { 
  BriefcaseIcon, 
  MapPinIcon, 
  CurrencyDollarIcon,
  StarIcon,
  ArrowTopRightOnSquareIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const JobRecommendations = ({ data, onViewAll, limit = 3 }) => {
  // Use data from props or show error state
  const jobs = data || [];

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

  // Show error state if no data is provided
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center py-8">
          <ExclamationTriangleIcon className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Job Recommendations</h3>
          <p className="text-gray-600 mb-4">Unable to load job recommendations. Please try refreshing the page.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Refresh Page
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
            <p className="text-sm text-gray-500">Based on your skills and test results</p>
          </div>
        </div>
        
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

      {/* Job Cards */}
      <div className="space-y-4">
        {jobs.length === 0 ? (
          <div className="text-center py-8">
            <BriefcaseIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Jobs Available</h3>
            <p className="text-gray-600">Complete more tests to get personalized job recommendations</p>
          </div>
        ) : (
          jobs.map((job) => (
            <div key={job.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{job.title}</h3>
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
                <div className="flex flex-wrap gap-2">
                  {job.skills.slice(0, 3).map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                    >
                      {skill}
                    </span>
                  ))}
                  {job.skills.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                      +{job.skills.length - 3} more
                    </span>
                  )}
                </div>
              )}
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
          </div>
        </div>
      )}

      {/* Quick Tips */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Tips</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <p>• Complete more assessments to improve job matching accuracy</p>
          <p>• Focus on skills that appear frequently in your target roles</p>
          <p>• Consider taking specialized tests for your desired career path</p>
        </div>
      </div>
    </div>
  );
};

export default JobRecommendations;