import React from 'react';

const TestTimeline = ({ tests }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">📊 Test History</h2>
        <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          View all tests →
        </a>
      </div>
      
      <div className="space-y-4">
        {tests.map((test, index) => (
          <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {test.test_type.charAt(0)}
            </div>
            
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{test.test_type} Assessment</h3>
              <p className="text-sm text-gray-500">{new Date(test.date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</p>
            </div>
            
            <div className="text-right">
              <div className={`text-lg font-bold ${
                test.score >= 80 ? 'text-green-600' : 
                test.score >= 60 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {test.score}%
              </div>
              <div className="w-16 h-2 bg-gray-200 rounded-full">
                <div 
                  className={`h-2 rounded-full ${
                    test.score >= 80 ? 'bg-green-500' : 
                    test.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${test.score}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestTimeline;