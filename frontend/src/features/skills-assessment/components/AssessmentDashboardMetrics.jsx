import React, { useEffect, useState } from 'react';
import testHistoryApi from '../../test-history/services/testHistoryApi';

export default function AssessmentDashboardMetrics() {
 const [metrics, setMetrics] = useState({
 testsCompleted: 0,
 avgPercentage: 0,
 totalAttempts: 0,
 bestByTest: {}
 });
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState(null);

 useEffect(() => {
 const loadMetrics = async () => {
 try {
 setLoading(true);
 setError(null);

 // Get test history summary
 const summary = await testHistoryApi.getTestHistorySummary();

 // Get category stats for best scores by test type
 const categoryStats = await testHistoryApi.getTestCategoryStats();

 // Build best scores by test type
 const bestByTest = {};
 categoryStats.forEach(stat => {
 bestByTest[stat.test_type] = stat.best_score;
 });

 setMetrics({
 testsCompleted: summary.completed_sessions || 0,
 avgPercentage: Math.round(summary.average_score || 0),
 totalAttempts: summary.total_sessions || 0,
 bestByTest
 });
 } catch (err) {
 console.error('Failed to load metrics:', err);
 setError('Failed to load assessment metrics');
 } finally {
 setLoading(false);
 }
 };

 loadMetrics();
 }, []);

 if (loading) {
 return (
 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
 {[1, 2, 3].map(i => (
 <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
 <div className="h-4 bg-gray-200 rounded mb-2"></div>
 <div className="h-8 bg-gray-200 rounded"></div>
 </div>
 ))}
 </div>
 );
 }

 if (error) {
 return (
 <div className="bg-red-50 border border-red-200 rounded-xl p-4">
 <p className="text-red-600 text-sm">Failed to load assessment metrics</p>
 </div>
 );
 }

 return (
 <div className="space-y-6">
 <h2 className="text-2xl font-bold text-gray-800 mb-6">Assessment Overview</h2>

 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
 <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
 <div className="flex items-center justify-between">
 <div>
 <div className="text-sm text-gray-500 mb-1">Completed Tests</div>
 <div className="text-2xl font-semibold text-gray-800">{metrics.testsCompleted}</div>
 </div>
 <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
 <span className="text-green-600 text-lg"></span>
 </div>
 </div>
 </div>

 <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
 <div className="flex items-center justify-between">
 <div>
 <div className="text-sm text-gray-500 mb-1">Average Score</div>
 <div className="text-2xl font-semibold text-gray-800">{metrics.avgPercentage}%</div>
 </div>
 <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
 <span className="text-blue-600 text-lg"></span>
 </div>
 </div>
 </div>

 <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
 <div className="flex items-center justify-between">
 <div>
 <div className="text-sm text-gray-500 mb-1">Total Attempts</div>
 <div className="text-2xl font-semibold text-gray-800">{metrics.totalAttempts}</div>
 </div>
 <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
 <span className="text-purple-600 text-lg"></span>
 </div>
 </div>
 </div>
 </div>

 {/* Best Scores by Test */}
 {Object.keys(metrics.bestByTest).length > 0 && (
 <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
 <h3 className="text-lg font-semibold text-gray-800 mb-4">Best Scores by Test</h3>
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
 {Object.entries(metrics.bestByTest).map(([testId, score]) => (
 <div key={testId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
 <div>
 <div className="text-sm font-medium text-gray-800 capitalize">
 {testId.replace(/_/g, ' ')}
 </div>
 <div className="text-xs text-gray-500">Best Score</div>
 </div>
 <div className="text-lg font-bold text-blue-600">{score}%</div>
 </div>
 ))}
 </div>
 </div>
 )}
 </div>
 );
}
