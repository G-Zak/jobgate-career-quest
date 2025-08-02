import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import PixelArtCard from './PixelArtCard';

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
      data: testResults.map(test => test.score),
      backgroundColor: '#8A2BE2',
      borderColor: '#000',
      borderWidth: 2
    }]
  };
  
  return (
    <PixelArtCard>
      <h2 className="pixel-subtitle">📊 Skills Analysis</h2>
      <div className="chart-wrapper">
        <Bar
          data={data}
          options={{
            responsive: true,
            scales: { y: { max: 100 } },
            plugins: { legend: { display: false } }
          }}
        />
      </div>
    </PixelArtCard>
  );
};

export default SkillsChart;
