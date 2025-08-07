import React from 'react';

const JobRecommendations = ({ jobs, isDarkMode }) => {
  return (
    <div className={`rounded-xl shadow-sm border p-6 transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-xl font-bold transition-colors ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>Recommended Jobs</h2>
        <a href="#" className={`text-sm font-medium transition-colors ${
          isDarkMode 
            ? 'text-blue-400 hover:text-blue-300' 
            : 'text-blue-600 hover:text-blue-700'
        }`}>
          View all jobs →
        </a>
      </div>
      
      <div className="space-y-4">
        {jobs.map(job => (
          <div
            key={job.id}
            className={`p-4 border rounded-lg transition-all duration-200 cursor-pointer group ${
              isDarkMode
                ? 'border-gray-700 hover:shadow-lg hover:border-gray-600 hover:bg-gray-750'
                : 'border-gray-200 hover:shadow-md hover:border-blue-200'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                    {job.company.charAt(0)}
                  </div>
                  <div>
                    <h3 className={`font-semibold transition-colors ${
                      isDarkMode 
                        ? 'text-white group-hover:text-blue-400' 
                        : 'text-gray-900 group-hover:text-blue-600'
                    }`}>
                      {job.title}
                    </h3>
                    <p className={`text-sm transition-colors ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>{job.company}</p>
                  </div>
                </div>
                
                <div className={`flex items-center space-x-4 text-sm mb-3 transition-colors ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {job.location}
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
                    <span className={`text-sm font-medium transition-colors ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>Match:</span>
                    <div className={`w-20 h-2 rounded-full transition-colors ${
                      isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                    }`}>
                      <div 
                        className={`h-2 rounded-full ${
                          job.match >= 80 ? 'bg-green-500' : 
                          job.match >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${job.match}%` }}
                      ></div>
                    </div>
                    <span className={`text-sm font-semibold ${
                      job.match >= 80 ? 'text-green-500' : 
                      job.match >= 60 ? 'text-yellow-500' : 'text-red-500'
                    }`}>
                      {job.match}%
                    </span>
                  </div>
                  
                  <button className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isDarkMode
                      ? 'bg-blue-900/30 text-blue-400 hover:bg-blue-900/50'
                      : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                  }`}>
                    Apply Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobRecommendations;