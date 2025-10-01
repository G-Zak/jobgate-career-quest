import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
 XMarkIcon,
 ChartBarIcon,
 ArrowTrendingUpIcon,
 LightBulbIcon,
 ClockIcon,
 PrinterIcon,
 ShareIcon,
 DocumentArrowDownIcon,
 AcademicCapIcon,
 StarIcon,
 ExclamationTriangleIcon,
 CheckCircleIcon
} from '@heroicons/react/24/outline';
import RadarChart from './RadarChart';
import TrendChart from './TrendChart';
import PerformanceMetrics from './PerformanceMetrics';

const CareerReadinessModal = ({ isOpen, onClose, data, categoryStats, employabilityData }) => {
 const [activeTab, setActiveTab] = useState('breakdown');
 const modalRef = useRef(null);

 if (!isOpen) return null;

 const tabs = [
 { id: 'breakdown', name: 'Category Breakdown', icon: ChartBarIcon },
 { id: 'trends', name: 'Performance Trends', icon: ArrowTrendingUpIcon },
 { id: 'recommendations', name: 'Recommendations', icon: LightBulbIcon },
 { id: 'history', name: 'Test History', icon: ClockIcon }
 ];

 const handlePrint = () => {
 // Create a print-friendly version
 const printContent = modalRef.current;
 const printWindow = window.open('', '_blank');

 printWindow.document.write(`
 <html>
 <head>
 <title>Career Readiness Analysis Report</title>
 <style>
 body { font-family: Arial, sans-serif; margin: 20px; }
 .print-header { text-align: center; margin-bottom: 30px; }
 .print-section { margin-bottom: 20px; page-break-inside: avoid; }
 .print-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; }
 .print-card { border: 1px solid #ddd; padding: 15px; border-radius: 8px; }
 .score-large { font-size: 24px; font-weight: bold; color: #7c3aed; }
 .category-score { font-size: 18px; font-weight: bold; }
 @media print { body { margin: 0; } }
 </style>
 </head>
 <body>
 <div class="print-header">
 <h1>Career Readiness Analysis Report</h1>
 <p>Generated on ${new Date().toLocaleDateString()}</p>
 </div>
 ${generatePrintContent()}
 </body>
 </html>
 `);

 printWindow.document.close();
 printWindow.print();
 };

 const generatePrintContent = () => {
 const performance = getOverallPerformance();
 let content = '';

 if (performance) {
 content += `
 <div class="print-section">
 <h2>Overall Performance Summary</h2>
 <div class="print-grid">
 <div class="print-card">
 <div class="score-large">${performance.averageScore}</div>
 <div>Average Score</div>
 </div>
 <div class="print-card">
 <div class="score-large">${performance.strongAreas.length}</div>
 <div>Strong Areas</div>
 </div>
 <div class="print-card">
 <div class="score-large">${performance.weakAreas.length}</div>
 <div>Areas to Improve</div>
 </div>
 <div class="print-card">
 <div class="score-large">${performance.totalCategories}</div>
 <div>Categories Assessed</div>
 </div>
 </div>
 </div>
 `;
 }

 if (categoryStats && categoryStats.length > 0) {
 content += `
 <div class="print-section">
 <h2>Category Breakdown</h2>
 <div class="print-grid">
 ${categoryStats.map(category => `
 <div class="print-card">
 <h3>${category.name}</h3>
 <div class="category-score">${category.score}/100</div>
 <p>Benchmark: ${category.benchmark}</p>
 <p>Tests Taken: ${category.count || 0}</p>
 <p>${category.description}</p>
 </div>
 `).join('')}
 </div>
 </div>
 `;
 }

 return content;
 };

 const handleShare = async () => {
 const shareData = {
 title: 'Career Readiness Analysis',
 text: `Check out my career readiness analysis! Average score: ${getOverallPerformance()?.averageScore || 'N/A'}`,
 url: window.location.href
 };

 if (navigator.share && navigator.canShare(shareData)) {
 try {
 await navigator.share(shareData);
 } catch (err) {
 console.log('Error sharing:', err);
 fallbackShare();
 }
 } else {
 fallbackShare();
 }
 };

 const fallbackShare = () => {
 // Create a shareable summary
 const performance = getOverallPerformance();
 const summary = `Career Readiness Analysis Summary:
Average Score: ${performance?.averageScore || 'N/A'}
Strong Areas: ${performance?.strongAreas.length || 0}
Areas to Improve: ${performance?.weakAreas.length || 0}
Total Categories: ${performance?.totalCategories || 0}

View full report: ${window.location.href}`;

 if (navigator.clipboard) {
 navigator.clipboard.writeText(summary).then(() => {
 alert('Report summary copied to clipboard!');
 });
 } else {
 // Fallback for older browsers
 const textArea = document.createElement('textarea');
 textArea.value = summary;
 document.body.appendChild(textArea);
 textArea.select();
 document.execCommand('copy');
 document.body.removeChild(textArea);
 alert('Report summary copied to clipboard!');
 }
 };

 const handleExportPDF = () => {
 // For now, use the print functionality as PDF export
 // In a real implementation, you would use a library like jsPDF or Puppeteer
 const printContent = generatePrintContent();
 const performance = getOverallPerformance();

 // Create a blob with HTML content that can be saved
 const htmlContent = `
 <!DOCTYPE html>
 <html>
 <head>
 <title>Career Readiness Analysis Report</title>
 <style>
 body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
 .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #7c3aed; padding-bottom: 20px; }
 .section { margin-bottom: 30px; }
 .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; }
 .card { border: 1px solid #ddd; padding: 15px; border-radius: 8px; background: #f9f9f9; }
 .score-large { font-size: 24px; font-weight: bold; color: #7c3aed; }
 .category-score { font-size: 18px; font-weight: bold; }
 </style>
 </head>
 <body>
 <div class="header">
 <h1>Career Readiness Analysis Report</h1>
 <p>Generated on ${new Date().toLocaleDateString()}</p>
 </div>
 ${printContent}
 <div class="section">
 <p><em>This report was generated by the Career Readiness Assessment System.</em></p>
 </div>
 </body>
 </html>
 `;

 const blob = new Blob([htmlContent], { type: 'text/html' });
 const url = URL.createObjectURL(blob);
 const a = document.createElement('a');
 a.href = url;
 a.download = `career-readiness-report-${new Date().toISOString().split('T')[0]}.html`;
 document.body.appendChild(a);
 a.click();
 document.body.removeChild(a);
 URL.revokeObjectURL(url);

 alert('Report downloaded as HTML file. You can open it in a browser and print to PDF.');
 };

 const getOverallPerformance = () => {
 if (!categoryStats || categoryStats.length === 0) return null;

 const averageScore = categoryStats.reduce((sum, cat) => sum + cat.score, 0) / categoryStats.length;
 const strongAreas = categoryStats.filter(cat => cat.score >= cat.benchmark + 10);
 const weakAreas = categoryStats.filter(cat => cat.score < cat.benchmark);

 return {
 averageScore: Math.round(averageScore),
 strongAreas,
 weakAreas,
 totalCategories: categoryStats.length
 };
 };

 const performance = getOverallPerformance();

 return (
 <AnimatePresence>
 <div className="fixed inset-0 z-50 overflow-y-auto">
 {/* Backdrop */}
 <motion.div
 className="fixed inset-0 bg-black bg-opacity-50"
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 onClick={onClose}
 />

 {/* Modal */}
 <div className="flex min-h-full items-center justify-center p-4">
 <motion.div
 ref={modalRef}
 className="relative w-full max-w-6xl bg-white rounded-2xl shadow-2xl"
 initial={{ opacity: 0, scale: 0.95, y: 20 }}
 animate={{ opacity: 1, scale: 1, y: 0 }}
 exit={{ opacity: 0, scale: 0.95, y: 20 }}
 transition={{ duration: 0.3, ease: "easeOut" }}
 >
 {/* Header */}
 <div className="flex items-center justify-between p-6 border-b border-gray-200">
 <div className="flex items-center space-x-3">
 <div className="p-2 bg-purple-100 rounded-lg">
 <ChartBarIcon className="w-6 h-6 text-purple-600" />
 </div>
 <div>
 <h2 className="text-2xl font-bold text-gray-900">Career Readiness Analysis</h2>
 <p className="text-sm text-gray-500">Comprehensive performance breakdown and insights</p>
 </div>
 </div>

 <div className="flex items-center space-x-2">
 {/* Action Buttons */}
 <button
 onClick={handlePrint}
 className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
 title="Print Report"
 >
 <PrinterIcon className="w-5 h-5" />
 </button>
 <button
 onClick={handleShare}
 className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
 title="Share Report"
 >
 <ShareIcon className="w-5 h-5" />
 </button>
 <button
 onClick={handleExportPDF}
 className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
 title="Export PDF"
 >
 <DocumentArrowDownIcon className="w-5 h-5" />
 </button>
 <button
 onClick={onClose}
 className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
 >
 <XMarkIcon className="w-5 h-5" />
 </button>
 </div>
 </div>

 {/* Tabs */}
 <div className="border-b border-gray-200">
 <nav className="flex space-x-8 px-6">
 {tabs.map((tab) => {
 const Icon = tab.icon;
 return (
 <button
 key={tab.id}
 onClick={() => setActiveTab(tab.id)}
 className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
 activeTab === tab.id
 ? 'border-purple-500 text-purple-600'
 : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
 }`}
 >
 <Icon className="w-4 h-4" />
 <span>{tab.name}</span>
 </button>
 );
 })}
 </nav>
 </div>

 {/* Content */}
 <div className="p-6 max-h-[70vh] overflow-y-auto">
 {activeTab === 'breakdown' && (
 <div className="space-y-6">
 {/* Overall Performance Summary */}
 {performance && (
 <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-100">
 <h3 className="text-lg font-semibold text-gray-900 mb-4">Overall Performance Summary</h3>
 <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
 <div className="text-center">
 <div className="text-3xl font-bold text-purple-600">{performance.averageScore}</div>
 <div className="text-sm text-gray-600">Average Score</div>
 </div>
 <div className="text-center">
 <div className="text-3xl font-bold text-green-600">{performance.strongAreas.length}</div>
 <div className="text-sm text-gray-600">Strong Areas</div>
 </div>
 <div className="text-center">
 <div className="text-3xl font-bold text-red-600">{performance.weakAreas.length}</div>
 <div className="text-sm text-gray-600">Areas to Improve</div>
 </div>
 <div className="text-center">
 <div className="text-3xl font-bold text-blue-600">{performance.totalCategories}</div>
 <div className="text-sm text-gray-600">Categories Assessed</div>
 </div>
 </div>
 </div>
 )}

 {/* Enhanced Radar Chart */}
 {categoryStats && categoryStats.length > 0 && (
 <div className="bg-gray-50 rounded-xl p-6">
 <h4 className="text-lg font-semibold text-gray-900 mb-4 text-center">Skills Overview</h4>
 <div className="flex justify-center">
 <RadarChart data={categoryStats} size={400} />
 </div>
 </div>
 )}

 {/* Detailed Category Analysis */}
 <div>
 <h4 className="text-lg font-semibold text-gray-900 mb-4">Detailed Category Analysis</h4>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 {categoryStats && categoryStats.map((category) => (
 <div key={category.id} className="bg-white border border-gray-200 rounded-lg p-4">
 <div className="flex items-center space-x-3 mb-3">
 <span className="text-2xl">{category.icon}</span>
 <div>
 <h5 className="font-semibold text-gray-900">{category.name}</h5>
 <p className="text-sm text-gray-600">{category.description}</p>
 </div>
 </div>

 <div className="grid grid-cols-3 gap-4 text-center mb-3">
 <div>
 <div className="text-xl font-bold text-gray-900">{category.score}</div>
 <div className="text-xs text-gray-500">Current Score</div>
 </div>
 <div>
 <div className="text-xl font-bold text-gray-900">{category.benchmark}</div>
 <div className="text-xs text-gray-500">Benchmark</div>
 </div>
 <div>
 <div className="text-xl font-bold text-gray-900">{category.count || 0}</div>
 <div className="text-xs text-gray-500">Tests Taken</div>
 </div>
 </div>

 {/* Performance Indicator */}
 <div className="flex items-center justify-center space-x-2">
 {category.score >= category.benchmark + 10 ? (
 <>
 <CheckCircleIcon className="w-4 h-4 text-green-500" />
 <span className="text-sm text-green-600 font-medium">Excellent</span>
 </>
 ) : category.score >= category.benchmark ? (
 <>
 <StarIcon className="w-4 h-4 text-yellow-500" />
 <span className="text-sm text-yellow-600 font-medium">Good</span>
 </>
 ) : (
 <>
 <ExclamationTriangleIcon className="w-4 h-4 text-red-500" />
 <span className="text-sm text-red-600 font-medium">Needs Improvement</span>
 </>
 )}
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>
 )}

 {activeTab === 'trends' && (
 <div className="space-y-6">
 <div className="text-center">
 <h3 className="text-lg font-semibold text-gray-900 mb-2">Performance Trends</h3>
 <p className="text-gray-600">Track your progress over time and identify improvement patterns</p>
 </div>

 {/* Placeholder for trend charts */}
 <div className="bg-gray-50 rounded-xl p-8 text-center">
 <ArrowTrendingUpIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
 <p className="text-gray-600">Trend analysis will be displayed here based on historical test data</p>
 </div>
 </div>
 )}

 {activeTab === 'recommendations' && (
 <div className="space-y-6">
 <div className="text-center">
 <h3 className="text-lg font-semibold text-gray-900 mb-2">Personalized Recommendations</h3>
 <p className="text-gray-600">AI-driven suggestions to improve your career readiness</p>
 </div>

 {/* Placeholder for recommendations */}
 <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-8 text-center border border-yellow-200">
 <LightBulbIcon className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
 <p className="text-gray-700">Personalized recommendations will be generated based on your performance data</p>
 </div>
 </div>
 )}

 {activeTab === 'history' && (
 <div className="space-y-6">
 <div className="text-center">
 <h3 className="text-lg font-semibold text-gray-900 mb-2">Test History</h3>
 <p className="text-gray-600">Complete history of your assessments and progress</p>
 </div>

 {/* Placeholder for test history */}
 <div className="bg-gray-50 rounded-xl p-8 text-center">
 <AcademicCapIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
 <p className="text-gray-600">Detailed test history and completion statistics will be displayed here</p>
 </div>
 </div>
 )}
 </div>
 </motion.div>
 </div>
 </div>
 </AnimatePresence>
 );
};

export default CareerReadinessModal;
