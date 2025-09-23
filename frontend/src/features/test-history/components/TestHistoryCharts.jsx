import React from 'react';
import { FaChartLine, FaChartPie, FaClock, FaTrophy } from 'react-icons/fa';

const TestHistoryCharts = ({ chartData, categoryStats }) => {
  if (!chartData || !categoryStats) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-xl">
        <div className="text-gray-400 text-6xl mb-4">📊</div>
        <h3 className="text-xl font-medium text-gray-600 mb-2">No Chart Data Available</h3>
        <p className="text-gray-500">Complete some tests to see your performance analytics.</p>
      </div>
    );
  }

  const getCategoryColor = (index) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500',
      'bg-pink-500', 'bg-indigo-500', 'bg-red-500', 'bg-yellow-500'
    ];
    return colors[index % colors.length];
  };

  const getCategoryTextColor = (index) => {
    const colors = [
      'text-blue-600', 'text-green-600', 'text-purple-600', 'text-orange-600',
      'text-pink-600', 'text-indigo-600', 'text-red-600', 'text-yellow-600'
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="space-y-8">
      {/* Score Trend Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-6">
          <FaChartLine className="text-blue-600 text-xl mr-3" />
          <h3 className="text-lg font-semibold text-gray-900">Score Trend Over Time</h3>
        </div>
        
        {chartData.labels && chartData.labels.length > 0 ? (
          <div className="space-y-4">
            {/* Simple Line Chart Representation */}
            <div className="h-64 flex items-end justify-between space-x-2">
              {chartData.scores.map((score, index) => {
                const height = (score / 100) * 200; // Scale to 200px max height
                return (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div
                      className="bg-blue-500 rounded-t w-full transition-all duration-300 hover:bg-blue-600"
                      style={{ height: `${height}px` }}
                      title={`${chartData.labels[index]}: ${score}%`}
                    ></div>
                    <div className="text-xs text-gray-500 mt-2 transform -rotate-45 origin-left">
                      {chartData.labels[index]}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Chart Legend */}
            <div className="flex justify-between text-sm text-gray-600">
              <span>Date</span>
              <span>Score (%)</span>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No score data available for the last 30 days
          </div>
        )}
      </div>

      {/* Category Performance Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-6">
          <FaChartPie className="text-green-600 text-xl mr-3" />
          <h3 className="text-lg font-semibold text-gray-900">Performance by Category</h3>
        </div>
        
        {categoryStats.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bar Chart */}
            <div>
              <h4 className="text-md font-medium text-gray-700 mb-4">Average Scores</h4>
              <div className="space-y-3">
                {categoryStats.map((stat, index) => (
                  <div key={stat.test_type} className="flex items-center space-x-3">
                    <div className="w-24 text-sm text-gray-600 truncate">
                      {stat.test_type.replace('_', ' ').toUpperCase()}
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                      <div
                        className={`h-4 rounded-full ${getCategoryColor(index)} transition-all duration-300`}
                        style={{ width: `${stat.average_score}%` }}
                      ></div>
                      <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                        {stat.average_score}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pie Chart Representation */}
            <div>
              <h4 className="text-md font-medium text-gray-700 mb-4">Test Distribution</h4>
              <div className="space-y-2">
                {categoryStats.map((stat, index) => {
                  const percentage = (stat.count / categoryStats.reduce((sum, s) => sum + s.count, 0)) * 100;
                  return (
                    <div key={stat.test_type} className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded ${getCategoryColor(index)}`}></div>
                      <div className="flex-1 text-sm text-gray-600">
                        {stat.test_type.replace('_', ' ').toUpperCase()}
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        {stat.count} ({percentage.toFixed(1)}%)
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No category data available
          </div>
        )}
      </div>

      {/* Time Spent Analysis */}
      {chartData.time_spent && chartData.time_spent.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-6">
            <FaClock className="text-purple-600 text-xl mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">Time Spent Analysis</h3>
          </div>
          
          <div className="space-y-4">
            {/* Time Spent Bar Chart */}
            <div className="h-48 flex items-end justify-between space-x-2">
              {chartData.time_spent.map((time, index) => {
                const maxTime = Math.max(...chartData.time_spent);
                const height = (time / maxTime) * 150; // Scale to 150px max height
                return (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div
                      className="bg-purple-500 rounded-t w-full transition-all duration-300 hover:bg-purple-600"
                      style={{ height: `${height}px` }}
                      title={`${chartData.labels[index]}: ${time} minutes`}
                    ></div>
                    <div className="text-xs text-gray-500 mt-2 transform -rotate-45 origin-left">
                      {chartData.labels[index]}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Time Statistics */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-gray-900">
                  {Math.round(chartData.time_spent.reduce((a, b) => a + b, 0) / chartData.time_spent.length)}m
                </div>
                <div className="text-sm text-gray-600">Average Time</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-gray-900">
                  {Math.max(...chartData.time_spent)}m
                </div>
                <div className="text-sm text-gray-600">Longest Test</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-gray-900">
                  {Math.min(...chartData.time_spent)}m
                </div>
                <div className="text-sm text-gray-600">Shortest Test</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Performance Insights */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
        <div className="flex items-center mb-4">
          <FaTrophy className="text-yellow-600 text-xl mr-3" />
          <h3 className="text-lg font-semibold text-gray-900">Performance Insights</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Strengths</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              {categoryStats
                .filter(stat => stat.average_score >= 80)
                .map(stat => (
                  <li key={stat.test_type} className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    {stat.test_type.replace('_', ' ').toUpperCase()} ({stat.average_score}%)
                  </li>
                ))}
              {categoryStats.filter(stat => stat.average_score >= 80).length === 0 && (
                <li className="text-gray-500">Keep practicing to identify your strengths!</li>
              )}
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Areas for Improvement</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              {categoryStats
                .filter(stat => stat.average_score < 70)
                .map(stat => (
                  <li key={stat.test_type} className="flex items-center">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                    {stat.test_type.replace('_', ' ').toUpperCase()} ({stat.average_score}%)
                  </li>
                ))}
              {categoryStats.filter(stat => stat.average_score < 70).length === 0 && (
                <li className="text-gray-500">Great job! All categories are performing well.</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestHistoryCharts;
