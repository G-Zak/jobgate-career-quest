import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
 Chart as ChartJS,
 CategoryScale,
 LinearScale,
 BarElement,
 Title,
 Tooltip,
 Legend,
} from 'chart.js';

ChartJS.register(
 CategoryScale,
 LinearScale,
 BarElement,
 Title,
 Tooltip,
 Legend
);

const SkillsChart = ({ testResults }) => {
 const data = {
 labels: testResults.map(test => test.test_type),
 datasets: [{
 label: 'Score',
 data: testResults.map(test => test.score),
 backgroundColor: [
 'rgba(59, 130, 246, 0.8)',
 'rgba(16, 185, 129, 0.8)',
 'rgba(245, 158, 11, 0.8)',
 'rgba(239, 68, 68, 0.8)',
 'rgba(139, 92, 246, 0.8)',
 ],
 borderColor: [
 'rgba(59, 130, 246, 1)',
 'rgba(16, 185, 129, 1)',
 'rgba(245, 158, 11, 1)',
 'rgba(239, 68, 68, 1)',
 'rgba(139, 92, 246, 1)',
 ],
 borderWidth: 2,
 borderRadius: 8,
 borderSkipped: false,
 }]
 };

 const options = {
 responsive: true,
 maintainAspectRatio: false,
 plugins: {
 legend: {
 display: false,
 },
 tooltip: {
 backgroundColor: 'rgba(0, 0, 0, 0.8)',
 titleColor: 'white',
 bodyColor: 'white',
 borderColor: 'rgba(255, 255, 255, 0.1)',
 borderWidth: 1,
 cornerRadius: 8,
 displayColors: false,
 callbacks: {
 label: function(context) {
 return `Score: ${context.parsed.y}%`;
 }
 }
 },
 },
 scales: {
 x: {
 grid: {
 display: false,
 },
 ticks: {
 color: '#6b7280',
 font: {
 size: 12,
 }
 }
 },
 y: {
 beginAtZero: true,
 max: 100,
 grid: {
 color: 'rgba(107, 114, 128, 0.1)',
 },
 ticks: {
 color: '#6b7280',
 font: {
 size: 12,
 },
 callback: function(value) {
 return value + '%';
 }
 }
 },
 },
 };

 return (
 <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
 <div className="flex items-center justify-between mb-6">
 <h2 className="text-xl font-bold text-gray-900">Skills Performance</h2>
 <div className="text-sm text-gray-500">
 Average: {Math.round(testResults.reduce((acc, test) => acc + test.score, 0) / testResults.length)}%
 </div>
 </div>

 <div className="h-64">
 <Bar data={data} options={options} />
 </div>
 </div>
 );
};

export default SkillsChart;