import React from 'react';
import { FaArrowLeft, FaClock, FaCheck, FaTimes, FaTrophy, FaCalendarAlt, FaUser } from 'react-icons/fa';

const TestSessionDetail = ({ session, onBack }) => {
  if (!session) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">❌</div>
        <h3 className="text-xl font-medium text-gray-600 mb-2">Session Not Found</h3>
        <p className="text-gray-500">The requested test session could not be found.</p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'easy': 'bg-green-100 text-green-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'hard': 'bg-red-100 text-red-800'
    };
    return colors[difficulty] || 'bg-gray-100 text-gray-800';
  };

  const formatDuration = (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString()
    };
  };

  const correctAnswers = session.answers ? session.answers.filter(a => a.is_correct).length : 0;
  const totalAnswers = session.answers ? session.answers.length : 0;
  const incorrectAnswers = totalAnswers - correctAnswers;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
        >
          <FaArrowLeft className="mr-2" />
          Back to Sessions
        </button>
        
        <div className={`px-4 py-2 rounded-lg font-bold text-lg ${getScoreColor(session.score_percentage)}`}>
          {session.score_percentage}%
        </div>
      </div>

      {/* Session Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{session.test_title}</h2>
            <p className="text-gray-600 capitalize">{session.test_type.replace('_', ' ')} Test</p>
          </div>
          
          <div className="text-right">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              session.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {session.passed ? 'PASSED' : 'FAILED'}
            </div>
          </div>
        </div>

        {/* Session Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <FaCalendarAlt className="text-gray-400 mr-2" />
              <span className="text-sm text-gray-600">Date</span>
            </div>
            <div className="font-semibold text-gray-900">
              {formatDateTime(session.start_time).date}
            </div>
            <div className="text-xs text-gray-500">
              {formatDateTime(session.start_time).time}
            </div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <FaClock className="text-gray-400 mr-2" />
              <span className="text-sm text-gray-600">Duration</span>
            </div>
            <div className="font-semibold text-gray-900">
              {formatDuration(session.duration_minutes)}
            </div>
            <div className="text-xs text-gray-500">
              {Math.floor(session.time_spent / 60)}m {session.time_spent % 60}s
            </div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <FaCheck className="text-green-400 mr-2" />
              <span className="text-sm text-gray-600">Correct</span>
            </div>
            <div className="font-semibold text-gray-900">{correctAnswers}</div>
            <div className="text-xs text-gray-500">out of {totalAnswers}</div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <FaTrophy className="text-yellow-400 mr-2" />
              <span className="text-sm text-gray-600">Score</span>
            </div>
            <div className="font-semibold text-gray-900">{session.score_percentage}%</div>
            <div className="text-xs text-gray-500">
              {session.passed ? 'Passed' : 'Failed'}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Answers */}
      {session.answers && session.answers.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Question-by-Question Analysis</h3>
          
          <div className="space-y-4">
            {session.answers.map((answer, index) => (
              <div
                key={answer.id || index}
                className={`border rounded-lg p-4 ${
                  answer.is_correct 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-red-200 bg-red-50'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-gray-900">
                        Question {answer.question_order || index + 1}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(answer.difficulty_level)}`}>
                        {answer.difficulty_level?.toUpperCase() || 'UNKNOWN'}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm mb-3">
                      {answer.question_text}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {answer.is_correct ? (
                      <FaCheck className="text-green-600 text-lg" />
                    ) : (
                      <FaTimes className="text-red-600 text-lg" />
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Your Answer:</span>
                    <span className={`ml-2 font-medium ${
                      answer.is_correct ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {answer.selected_answer}
                    </span>
                  </div>
                  
                  <div>
                    <span className="text-gray-600">Correct Answer:</span>
                    <span className="ml-2 font-medium text-gray-800">
                      {answer.correct_answer}
                    </span>
                  </div>
                  
                  <div>
                    <span className="text-gray-600">Time Taken:</span>
                    <span className="ml-2 font-medium text-gray-800">
                      {answer.time_taken}s
                    </span>
                  </div>
                  
                  <div>
                    <span className="text-gray-600">Answered At:</span>
                    <span className="ml-2 font-medium text-gray-800">
                      {new Date(answer.answered_at).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Performance Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Summary</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{correctAnswers}</div>
            <div className="text-sm text-gray-600">Correct Answers</div>
            <div className="text-xs text-gray-500">
              {totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0}% accuracy
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600 mb-2">{incorrectAnswers}</div>
            <div className="text-sm text-gray-600">Incorrect Answers</div>
            <div className="text-xs text-gray-500">
              {totalAnswers > 0 ? Math.round((incorrectAnswers / totalAnswers) * 100) : 0}% error rate
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {totalAnswers > 0 ? Math.round(session.time_spent / totalAnswers) : 0}s
            </div>
            <div className="text-sm text-gray-600">Avg. Time per Question</div>
            <div className="text-xs text-gray-500">
              Total: {Math.floor(session.time_spent / 60)}m {session.time_spent % 60}s
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h3>
        
        <div className="space-y-3">
          {session.score_percentage < 70 && (
            <div className="flex items-start">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3"></div>
              <p className="text-gray-700">
                <strong>Review Fundamentals:</strong> Your score suggests you should focus on basic concepts and practice more questions.
              </p>
            </div>
          )}
          
          {session.score_percentage >= 70 && session.score_percentage < 90 && (
            <div className="flex items-start">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3"></div>
              <p className="text-gray-700">
                <strong>Good Progress:</strong> You're on the right track! Focus on your weaker areas to improve further.
              </p>
            </div>
          )}
          
          {session.score_percentage >= 90 && (
            <div className="flex items-start">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
              <p className="text-gray-700">
                <strong>Excellent Performance:</strong> Great job! Consider taking more advanced tests or helping others.
              </p>
            </div>
          )}
          
          {session.time_spent / totalAnswers > 120 && (
            <div className="flex items-start">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
              <p className="text-gray-700">
                <strong>Time Management:</strong> You took longer than average per question. Practice with time limits to improve speed.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestSessionDetail;
