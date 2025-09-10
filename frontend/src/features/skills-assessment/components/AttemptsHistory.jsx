import React, { useEffect } from 'react';
import { useAssessmentStore } from '../store/useAssessmentStore';
import { fetchAttempts } from '../api/attemptsApi';
import { formatDuration, getPerformanceLevel } from '../lib/scoreUtils';

export default function AttemptsHistory() {
  const { attempts, hydrateAttempts, loading, error } = useAssessmentStore();

  useEffect(() => {
    const loadAttempts = async () => {
      try {
        const attemptsList = await fetchAttempts();
        hydrateAttempts(attemptsList);
      } catch (error) {
        console.error('Failed to load attempts:', error);
      }
    };

    loadAttempts();
  }, [hydrateAttempts]);

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">Test History</h2>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded mb-2 w-1/3"></div>
                  <div className="h-5 bg-gray-200 rounded mb-2 w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
                <div className="h-8 w-16 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">Test History</h2>
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <p className="text-red-600">Failed to load test history</p>
        </div>
      </div>
    );
  }

  if (attempts.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">Test History</h2>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-gray-400 text-2xl">📝</span>
          </div>
          <h3 className="text-lg font-medium text-gray-600 mb-2">No test attempts yet</h3>
          <p className="text-gray-500">Take your first assessment to see your progress here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Test History</h2>
        <div className="text-sm text-gray-500">
          {attempts.length} attempt{attempts.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="space-y-3">
        {attempts.map((attempt) => {
          const performanceLevel = getPerformanceLevel(attempt.percentage);
          const date = new Date(attempt.finished_at || attempt.created_at);
          
          return (
            <article key={attempt.id || attempt.finished_at} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="text-sm text-gray-500">
                      {date.toLocaleString()}
                    </div>
                    {attempt.language && attempt.language !== 'en' && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">
                        {attempt.language.toUpperCase()}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3 mb-2">
                    <div className="font-semibold text-lg text-gray-800 capitalize">
                      {attempt.test_id.replace(/_/g, ' ')}
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium bg-${performanceLevel.color}-100 text-${performanceLevel.color}-700`}>
                      {performanceLevel.icon} {attempt.result_label || performanceLevel.label}
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">{attempt.correct}</span>
                    <span className="text-gray-400">/</span>
                    <span>{attempt.total_questions}</span>
                    <span className="text-gray-400 mx-2">•</span>
                    <span>{formatDuration(attempt.duration_seconds)}</span>
                    <span className="text-gray-400 mx-2">•</span>
                    <span className="capitalize">{attempt.result}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-800">{attempt.percentage}%</div>
                  </div>
                </div>
              </div>
              
              {/* Additional Details */}
              {attempt.payload && attempt.payload.sectionBreakdown && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Section Breakdown:</span>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {Object.entries(attempt.payload.sectionBreakdown).map(([section, score]) => (
                        <span key={section} className="px-2 py-1 bg-gray-100 rounded text-xs">
                          {section}: {score}%
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
