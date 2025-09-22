import React from 'react';

const RadarChart = ({ data, size = 200 }) => {
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size * 0.35;
  const numCategories = data.length;
  const angleStep = (2 * Math.PI) / numCategories;

  // Calculate points for each category
  const points = data.map((item, index) => {
    const angle = index * angleStep - Math.PI / 2; // Start from top
    const normalizedScore = item.score / 100;
    const x = centerX + radius * normalizedScore * Math.cos(angle);
    const y = centerY + radius * normalizedScore * Math.sin(angle);
    return { x, y, ...item };
  });

  // Create path for the radar chart
  const pathData = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ');

  // Create grid circles
  const gridCircles = [0.2, 0.4, 0.6, 0.8, 1.0].map((scale, index) => (
    <circle
      key={index}
      cx={centerX}
      cy={centerY}
      r={radius * scale}
      fill="none"
      stroke="#e5e7eb"
      strokeWidth="1"
    />
  ));

  // Create grid lines
  const gridLines = data.map((_, index) => {
    const angle = index * angleStep - Math.PI / 2;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    return (
      <line
        key={index}
        x1={centerX}
        y1={centerY}
        x2={x}
        y2={y}
        stroke="#e5e7eb"
        strokeWidth="1"
      />
    );
  });

  // Create labels
  const labels = points.map((point, index) => {
    const angle = index * angleStep - Math.PI / 2;
    const labelRadius = radius * 1.15;
    const x = centerX + labelRadius * Math.cos(angle);
    const y = centerY + labelRadius * Math.sin(angle);
    
    return (
      <g key={index}>
        <text
          x={x}
          y={y}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-xs font-medium fill-gray-700"
        >
          {point.name}
        </text>
        <text
          x={x}
          y={y + 12}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-xs fill-gray-500"
        >
          {point.score}
        </text>
      </g>
    );
  });

  return (
    <div className="flex justify-center">
      <svg width={size} height={size} className="overflow-visible">
        {/* Grid */}
        {gridCircles}
        {gridLines}
        
        {/* Radar area */}
        <path
          d={pathData}
          fill="rgba(59, 130, 246, 0.1)"
          stroke="rgb(59, 130, 246)"
          strokeWidth="2"
        />
        
        {/* Data points */}
        {points.map((point, index) => (
          <circle
            key={index}
            cx={point.x}
            cy={point.y}
            r="4"
            fill="rgb(59, 130, 246)"
            stroke="white"
            strokeWidth="2"
          />
        ))}
        
        {/* Labels */}
        {labels}
      </svg>
    </div>
  );
};

export default RadarChart;
