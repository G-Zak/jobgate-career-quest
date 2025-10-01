import React, { useState, useEffect } from 'react';
import {
 BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
 LineChart, Line, PieChart, Pie, Cell, RadialBarChart, RadialBar
} from 'recharts';

const ScoreDashboard = ({ userId, testSessionId }) => {
 const [scoreData, setScoreData] = useState(null);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState(null);
 const [selectedView, setSelectedView] = useState('overview');

 useEffect(() => {
 fetchScoreData();
 }, [testSessionId]);

 const fetchScoreData = async () => {
 try {
 setLoading(true);
 const response = await fetch(`/api/scores/${testSessionId}/detailed_breakdown/`);
 if (!response.ok) throw new Error('Failed to fetch score data');
 const data = await response.json();
 setScoreData(data);
 } catch (err) {
 setError(err.message);
 } finally {
 setLoading(false);
 }
 };

 if (loading) {
 return (
 <div className="flex items-center justify-center h-64">
 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
 </div>
 );
 }

 if (error) {
 return (
 <div className="bg-red-50 border border-red-200 rounded-lg p-4">
 <h3 className="text-red-800 font-medium">Error Loading Scores</h3>
 <p className="text-red-600">{error}</p>
 </div>
 );
 }

 const { overall_score, category_breakdown, performance_insights, comparison_data } = scoreData;

 return (
 <div className="max-w-7xl mx-auto p-6 space-y-6">
 {/* Header */}
 <div className="bg-white rounded-lg shadow-lg p-6">
 <div className="flex items-center justify-between">
 <div>
 <h1 className="text-3xl font-bold text-gray-900">
 Test Results: {overall_score.session.test_configuration.name}
 </h1>
 <p className="text-gray-600 mt-1">
 Completed on {new Date(overall_score.calculated_at).toLocaleDateString()}
 </p>
 </div>
 <div className="text-right">
 <div className="text-4xl font-bold text-blue-600">
 {overall_score.scaled_score}
 </div>
 <div className="text-sm text-gray-500">
 out of {overall_score.scoring_profile.scale_max}
 </div>
 </div>
 </div>
 </div>

 {/* Navigation Tabs */}
 <div className="bg-white rounded-lg shadow">
 <nav className="flex space-x-8 px-6" aria-label="Score views">
 {[
 { key: 'overview', label: 'Overview', icon: '' },
 { key: 'categories', label: 'Category Breakdown', icon: '' },
 { key: 'insights', label: 'Performance Insights', icon: '' },
 { key: 'comparison', label: 'Comparison', icon: '️' }
 ].map((tab) => (
 <button
 key={tab.key}
 onClick={() => setSelectedView(tab.key)}
 className={`py-4 px-1 border-b-2 font-medium text-sm ${
 selectedView === tab.key
 ? 'border-blue-500 text-blue-600'
 : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
 }`}
 >
 <span className="mr-2">{tab.icon}</span>
 {tab.label}
 </button>
 ))}
 </nav>
 </div>

 {/* Content based on selected view */}
 {selectedView === 'overview' && (
 <OverviewTab
 overallScore={overall_score}
 categoryBreakdown={category_breakdown}
 performanceInsights={performance_insights}
 />
 )}

 {selectedView === 'categories' && (
 <CategoriesTab categoryBreakdown={category_breakdown} />
 )}

 {selectedView === 'insights' && (
 <InsightsTab
 performanceInsights={performance_insights}
 overallScore={overall_score}
 />
 )}

 {selectedView === 'comparison' && (
 <ComparisonTab
 comparisonData={comparison_data}
 overallScore={overall_score}
 />
 )}
 </div>
 );
};

const OverviewTab = ({ overallScore, categoryBreakdown, performanceInsights }) => {
 const performanceColor = (percentage) => {
 if (percentage >= 90) return 'text-green-600 bg-green-100';
 if (percentage >= 80) return 'text-blue-600 bg-blue-100';
 if (percentage >= 70) return 'text-yellow-600 bg-yellow-100';
 if (percentage >= 60) return 'text-orange-600 bg-orange-100';
 return 'text-red-600 bg-red-100';
 };

 const getPerformanceLevel = (percentage) => {
 if (percentage >= 90) return 'Excellent';
 if (percentage >= 80) return 'Proficient';
 if (percentage >= 70) return 'Developing';
 if (percentage >= 60) return 'Basic';
 return 'Below Basic';
 };

 return (
 <div className="space-y-6">
 {/* Score Overview Cards */}
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
 <ScoreCard
 title="Overall Score"
 value={`${overallScore.scaled_score}/${overallScore.scoring_profile.scale_max}`}
 subtitle={`${parseFloat(overallScore.percentage_score).toFixed(1)}%`}
 color="blue"
 />
 <ScoreCard
 title="Performance Level"
 value={getPerformanceLevel(parseFloat(overallScore.percentage_score))}
 subtitle={`${overallScore.percentile_rank}th percentile`}
 color="green"
 />
 <ScoreCard
 title="Time Taken"
 value={`${Math.floor(overallScore.completion_time / 60)}:${(overallScore.completion_time % 60).toString().padStart(2, '0')}`}
 subtitle={`${parseFloat(overallScore.time_per_question).toFixed(1)}s/question`}
 color="purple"
 />
 <ScoreCard
 title="Accuracy"
 value={`${overallScore.raw_score}/${overallScore.session.questions_answered}`}
 subtitle={`${parseFloat(overallScore.accuracy_rate).toFixed(1)}% correct`}
 color="indigo"
 />
 </div>

 {/* Category Overview Chart */}
 <div className="bg-white rounded-lg shadow-lg p-6">
 <h2 className="text-xl font-semibold text-gray-900 mb-4">Category Performance</h2>
 <ResponsiveContainer width="100%" height={300}>
 <BarChart data={categoryBreakdown}>
 <CartesianGrid strokeDasharray="3 3" />
 <XAxis dataKey="category" />
 <YAxis />
 <Tooltip
 formatter={(value, name) => [`${value.toFixed(1)}%`, 'Score']}
 labelFormatter={(label) => `Category: ${label}`}
 />
 <Bar dataKey="percentage" fill="#3B82F6" radius={[4, 4, 0, 0]} />
 </BarChart>
 </ResponsiveContainer>
 </div>

 {/* Quick Insights */}
 <div className="bg-white rounded-lg shadow-lg p-6">
 <h2 className="text-xl font-semibold text-gray-900 mb-4">Key Insights</h2>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 {performanceInsights.slice(0, 4).map((insight, index) => (
 <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
 <div className="text-2xl">{insight.icon}</div>
 <div>
 <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
 insight.type === 'excellent' ? 'bg-green-100 text-green-800' :
 insight.type === 'good' ? 'bg-blue-100 text-blue-800' :
 insight.type === 'average' ? 'bg-yellow-100 text-yellow-800' :
 'bg-red-100 text-red-800'
 }`}>
 {insight.type.replace('_', ' ').toUpperCase()}
 </div>
 <p className="text-gray-700 mt-1">{insight.message}</p>
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>
 );
};

const CategoriesTab = ({ categoryBreakdown }) => {
 const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316', '#06B6D4'];

 const pieData = categoryBreakdown.map((category, index) => ({
 name: category.category,
 value: parseFloat(category.percentage),
 color: COLORS[index % COLORS.length]
 }));

 return (
 <div className="space-y-6">
 {/* Category Performance Table */}
 <div className="bg-white rounded-lg shadow-lg overflow-hidden">
 <div className="px-6 py-4 border-b border-gray-200">
 <h2 className="text-xl font-semibold text-gray-900">Detailed Category Analysis</h2>
 </div>
 <div className="overflow-x-auto">
 <table className="min-w-full divide-y divide-gray-200">
 <thead className="bg-gray-50">
 <tr>
 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
 Category
 </th>
 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
 Questions
 </th>
 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
 Score
 </th>
 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
 Performance Level
 </th>
 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
 Avg Time
 </th>
 </tr>
 </thead>
 <tbody className="bg-white divide-y divide-gray-200">
 {categoryBreakdown.map((category, index) => (
 <tr key={index}>
 <td className="px-6 py-4 whitespace-nowrap">
 <div className="flex items-center">
 <div className={`w-3 h-3 rounded-full mr-3`}
 style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
 <div className="text-sm font-medium text-gray-900">
 {category.category.replace('_', ' ').toUpperCase()}
 </div>
 </div>
 </td>
 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
 {category.questions_correct}/{category.questions_attempted}
 </td>
 <td className="px-6 py-4 whitespace-nowrap">
 <div className="flex items-center">
 <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
 <div
 className="h-2 rounded-full bg-blue-600"
 style={{ width: `${category.percentage}%` }}
 ></div>
 </div>
 <span className="text-sm font-medium text-gray-900">
 {parseFloat(category.percentage).toFixed(1)}%
 </span>
 </div>
 </td>
 <td className="px-6 py-4 whitespace-nowrap">
 <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
 category.performance_level === 'excellent' ? 'bg-green-100 text-green-800' :
 category.performance_level === 'proficient' ? 'bg-blue-100 text-blue-800' :
 category.performance_level === 'developing' ? 'bg-yellow-100 text-yellow-800' :
 category.performance_level === 'basic' ? 'bg-orange-100 text-orange-800' :
 'bg-red-100 text-red-800'
 }`}>
 {category.performance_level.replace('_', ' ')}
 </span>
 </td>
 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
 {parseFloat(category.avg_time_per_question).toFixed(1)}s
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>

 {/* Category Distribution Chart */}
 <div className="bg-white rounded-lg shadow-lg p-6">
 <h2 className="text-xl font-semibold text-gray-900 mb-4">Score Distribution by Category</h2>
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
 <ResponsiveContainer width="100%" height={300}>
 <PieChart>
 <Pie
 data={pieData}
 cx="50%"
 cy="50%"
 labelLine={false}
 label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
 outerRadius={80}
 fill="#8884d8"
 dataKey="value"
 >
 {pieData.map((entry, index) => (
 <Cell key={`cell-${index}`} fill={entry.color} />
 ))}
 </Pie>
 <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
 </PieChart>
 </ResponsiveContainer>

 <div className="space-y-3">
 <h3 className="font-medium text-gray-900">Category Legend</h3>
 {pieData.map((entry, index) => (
 <div key={index} className="flex items-center justify-between">
 <div className="flex items-center space-x-3">
 <div className="w-4 h-4 rounded" style={{ backgroundColor: entry.color }}></div>
 <span className="text-sm text-gray-700">{entry.name.replace('_', ' ')}</span>
 </div>
 <span className="text-sm font-medium text-gray-900">{entry.value.toFixed(1)}%</span>
 </div>
 ))}
 </div>
 </div>
 </div>
 </div>
 );
};

const InsightsTab = ({ performanceInsights, overallScore }) => {
 return (
 <div className="space-y-6">
 {/* Performance Insights */}
 <div className="bg-white rounded-lg shadow-lg p-6">
 <h2 className="text-xl font-semibold text-gray-900 mb-6">Performance Insights</h2>
 <div className="space-y-4">
 {performanceInsights.map((insight, index) => (
 <div key={index} className="border-l-4 border-blue-500 bg-blue-50 p-4">
 <div className="flex items-center">
 <span className="text-2xl mr-3">{insight.icon}</span>
 <div className="flex-1">
 <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium mb-2 ${
 insight.type === 'excellent' ? 'bg-green-100 text-green-800' :
 insight.type === 'good' ? 'bg-blue-100 text-blue-800' :
 insight.type === 'average' ? 'bg-yellow-100 text-yellow-800' :
 'bg-red-100 text-red-800'
 }`}>
 {insight.type.replace('_', ' ').toUpperCase()}
 </div>
 <p className="text-gray-700">{insight.message}</p>
 </div>
 </div>
 </div>
 ))}
 </div>
 </div>

 {/* Strengths and Weaknesses */}
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
 <div className="bg-white rounded-lg shadow-lg p-6">
 <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
 <span className="mr-2"></span>
 Strengths
 </h3>
 <div className="space-y-2">
 {overallScore.strengths.length > 0 ? overallScore.strengths.map((strength, index) => (
 <div key={index} className="flex items-center p-2 bg-green-50 rounded">
 <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
 <span className="text-green-800">{strength.replace('_', ' ')}</span>
 </div>
 )) : (
 <p className="text-gray-500 italic">Continue working to identify your strengths</p>
 )}
 </div>
 </div>

 <div className="bg-white rounded-lg shadow-lg p-6">
 <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center">
 <span className="mr-2"></span>
 Areas for Improvement
 </h3>
 <div className="space-y-2">
 {overallScore.weaknesses.length > 0 ? overallScore.weaknesses.map((weakness, index) => (
 <div key={index} className="flex items-center p-2 bg-red-50 rounded">
 <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
 <span className="text-red-800">{weakness.replace('_', ' ')}</span>
 </div>
 )) : (
 <p className="text-gray-500 italic">Great job! No significant weaknesses identified</p>
 )}
 </div>
 </div>
 </div>

 {/* Recommendations */}
 <div className="bg-white rounded-lg shadow-lg p-6">
 <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
 <span className="mr-2"></span>
 Personalized Recommendations
 </h3>
 <div className="space-y-3">
 {overallScore.recommendations.map((recommendation, index) => (
 <div key={index} className="flex items-start p-3 bg-blue-50 rounded-lg">
 <span className="text-blue-600 mr-3 mt-1">•</span>
 <p className="text-blue-800">{recommendation}</p>
 </div>
 ))}
 </div>
 </div>
 </div>
 );
};

const ComparisonTab = ({ comparisonData, overallScore }) => {
 const comparisonChartData = [
 {
 metric: 'Score',
 yours: comparisonData.your_score,
 average: comparisonData.average_score,
 difference: comparisonData.your_score - comparisonData.average_score
 },
 {
 metric: 'Percentage',
 yours: comparisonData.your_percentage,
 average: comparisonData.average_percentage,
 difference: comparisonData.your_percentage - comparisonData.average_percentage
 },
 {
 metric: 'Time (min)',
 yours: Math.round(comparisonData.your_time / 60),
 average: Math.round(comparisonData.average_time / 60),
 difference: Math.round((comparisonData.your_time - comparisonData.average_time) / 60)
 }
 ];

 return (
 <div className="space-y-6">
 {/* Percentile Ranking */}
 <div className="bg-white rounded-lg shadow-lg p-6">
 <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Ranking</h2>
 <div className="flex items-center justify-center">
 <ResponsiveContainer width="100%" height={200}>
 <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%"
 data={[{ name: 'Percentile', value: comparisonData.percentile_rank, fill: '#3B82F6' }]}>
 <RadialBar dataKey="value" cornerRadius={10} fill="#3B82F6" />
 <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-3xl font-bold fill-gray-800">
 {Math.round(comparisonData.percentile_rank)}th
 </text>
 <text x="50%" y="60%" textAnchor="middle" dominantBaseline="middle" className="text-sm fill-gray-600">
 Percentile
 </text>
 </RadialBarChart>
 </ResponsiveContainer>
 </div>
 <p className="text-center text-gray-600 mt-4">
 You scored better than {Math.round(comparisonData.percentile_rank)}% of test takers
 </p>
 </div>

 {/* Performance Comparison */}
 <div className="bg-white rounded-lg shadow-lg p-6">
 <h2 className="text-xl font-semibold text-gray-900 mb-4">Performance Comparison</h2>
 <ResponsiveContainer width="100%" height={300}>
 <BarChart data={comparisonChartData}>
 <CartesianGrid strokeDasharray="3 3" />
 <XAxis dataKey="metric" />
 <YAxis />
 <Tooltip />
 <Bar dataKey="yours" name="Your Score" fill="#3B82F6" />
 <Bar dataKey="average" name="Average Score" fill="#9CA3AF" />
 </BarChart>
 </ResponsiveContainer>
 </div>

 {/* Detailed Comparison Table */}
 <div className="bg-white rounded-lg shadow-lg overflow-hidden">
 <div className="px-6 py-4 border-b border-gray-200">
 <h2 className="text-xl font-semibold text-gray-900">Detailed Comparison</h2>
 </div>
 <div className="overflow-x-auto">
 <table className="min-w-full divide-y divide-gray-200">
 <thead className="bg-gray-50">
 <tr>
 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
 Metric
 </th>
 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
 Your Performance
 </th>
 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
 Average Performance
 </th>
 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
 Difference
 </th>
 </tr>
 </thead>
 <tbody className="bg-white divide-y divide-gray-200">
 {comparisonChartData.map((row, index) => (
 <tr key={index}>
 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
 {row.metric}
 </td>
 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
 {row.yours.toFixed(1)}
 </td>
 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
 {row.average.toFixed(1)}
 </td>
 <td className="px-6 py-4 whitespace-nowrap text-sm">
 <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
 row.difference > 0 ? 'bg-green-100 text-green-800' :
 row.difference < 0 ? 'bg-red-100 text-red-800' :
 'bg-gray-100 text-gray-800'
 }`}>
 {row.difference > 0 ? '+' : ''}{row.difference.toFixed(1)}
 </span>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 </div>
 );
};

const ScoreCard = ({ title, value, subtitle, color }) => {
 const colorClasses = {
 blue: 'bg-blue-50 border-blue-200 text-blue-800',
 green: 'bg-green-50 border-green-200 text-green-800',
 purple: 'bg-purple-50 border-purple-200 text-purple-800',
 indigo: 'bg-indigo-50 border-indigo-200 text-indigo-800'
 };

 return (
 <div className={`bg-white rounded-lg shadow-lg border-l-4 p-6 ${colorClasses[color]?.replace('bg-', 'border-l-')}`}>
 <div className="flex items-center">
 <div className="flex-1">
 <p className="text-sm font-medium text-gray-600">{title}</p>
 <p className="text-2xl font-bold text-gray-900">{value}</p>
 {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
 </div>
 </div>
 </div>
 );
};

export default ScoreDashboard;
