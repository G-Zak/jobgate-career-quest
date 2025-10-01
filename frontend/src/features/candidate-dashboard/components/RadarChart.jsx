import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const RadarChart = ({ data, size = 200, animated = true, showTooltips = true }) => {
 const [hoveredPoint, setHoveredPoint] = useState(null);
 const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
 const svgRef = useRef(null);

 const centerX = size / 2;
 const centerY = size / 2;
 const radius = size * 0.35;
 const numCategories = data.length;
 const angleStep = (2 * Math.PI) / numCategories;

 // Enhanced color scheme based on score ranges
 const getScoreColor = (score) => {
 if (score >= 80) return { fill: 'rgba(34, 197, 94, 0.15)', stroke: 'rgb(34, 197, 94)', point: 'rgb(34, 197, 94)' };
 if (score >= 60) return { fill: 'rgba(251, 191, 36, 0.15)', stroke: 'rgb(251, 191, 36)', point: 'rgb(251, 191, 36)' };
 return { fill: 'rgba(239, 68, 68, 0.15)', stroke: 'rgb(239, 68, 68)', point: 'rgb(239, 68, 68)' };
 };

 // Calculate average score for overall color
 const averageScore = data.reduce((sum, item) => sum + item.score, 0) / data.length;
 const chartColors = getScoreColor(averageScore);

 // Calculate points for each category
 const points = data.map((item, index) => {
 const angle = index * angleStep - Math.PI / 2; // Start from top
 const normalizedScore = Math.max(0, Math.min(100, item.score)) / 100; // Clamp between 0-100
 const x = centerX + radius * normalizedScore * Math.cos(angle);
 const y = centerY + radius * normalizedScore * Math.sin(angle);

 // Calculate label position
 const labelRadius = radius * 1.2;
 const labelX = centerX + labelRadius * Math.cos(angle);
 const labelY = centerY + labelRadius * Math.sin(angle);

 return {
 x,
 y,
 labelX,
 labelY,
 angle,
 normalizedScore,
 colors: getScoreColor(item.score),
 ...item
 };
 });

 // Create path for the radar chart
 const pathData = points
 .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
 .join(' ') + ' Z'; // Close the path

 // Handle mouse events for tooltips
 const handleMouseMove = (event, point, index) => {
 if (!showTooltips) return;

 const svgRect = svgRef.current?.getBoundingClientRect();
 if (svgRect) {
 setTooltipPosition({
 x: event.clientX - svgRect.left,
 y: event.clientY - svgRect.top
 });
 setHoveredPoint({ ...point, index });
 }
 };

 const handleMouseLeave = () => {
 setHoveredPoint(null);
 };

 // Create enhanced spider chart grid with concentric circles and value labels
 const gridCircles = [0.2, 0.4, 0.6, 0.8, 1.0].map((scale, index) => (
 <g key={index}>
 <circle
 cx={centerX}
 cy={centerY}
 r={radius * scale}
 fill="none"
 stroke={index === 4 ? "#9ca3af" : "#e5e7eb"}
 strokeWidth={index === 4 ? "2" : "1"}
 strokeOpacity={index === 4 ? "0.8" : "0.6"}
 />
 {/* Grid value labels removed as requested */}
 </g>
 ));

 // Create enhanced spider web grid lines radiating from center
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
 stroke="#d1d5db"
 strokeWidth="1.5"
 strokeOpacity="0.7"
 />
 );
 });

 // Create additional internal grid structure for spider web effect
 const internalGridLines = [];
 for (let scaleIndex = 0; scaleIndex < 5; scaleIndex++) {
 const scale = (scaleIndex + 1) * 0.2;
 const polygonPoints = data.map((_, index) => {
 const angle = index * angleStep - Math.PI / 2;
 const x = centerX + radius * scale * Math.cos(angle);
 const y = centerY + radius * scale * Math.sin(angle);
 return `${x},${y}`;
 }).join(' ');

 internalGridLines.push(
 <polygon
 key={`internal-${scaleIndex}`}
 points={polygonPoints}
 fill="none"
 stroke="#f3f4f6"
 strokeWidth="1"
 strokeOpacity="0.5"
 />
 );
 }

 // Create enhanced labels with better positioning
 const labels = points.map((point, index) => {
 // Adjust text anchor based on position
 let textAnchor = "middle";
 if (point.labelX > centerX + 10) textAnchor = "start";
 else if (point.labelX < centerX - 10) textAnchor = "end";

 return (
 <g key={index}>
 {/* Category name */}
 <text
 x={point.labelX}
 y={point.labelY - 6}
 textAnchor={textAnchor}
 dominantBaseline="middle"
 className="text-xs font-semibold fill-gray-700"
 >
 {point.name}
 </text>
 {/* Score value with color coding */}
 <text
 x={point.labelX}
 y={point.labelY + 8}
 textAnchor={textAnchor}
 dominantBaseline="middle"
 className="text-xs font-bold"
 fill={point.colors.stroke}
 >
 {Math.round(point.score)}
 </text>
 </g>
 );
 });

 return (
 <div className="relative flex justify-center">
 <svg
 ref={svgRef}
 width={size}
 height={size}
 className="overflow-visible"
 style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
 >
 {/* Background circle */}
 <circle
 cx={centerX}
 cy={centerY}
 r={radius * 1.05}
 fill="rgba(249, 250, 251, 0.8)"
 stroke="none"
 />

 {/* Enhanced Spider Chart Grid */}
 {gridCircles}
 {gridLines}
 {internalGridLines}

 {/* Animated radar area */}
 {animated ? (
 <motion.path
 d={pathData}
 fill={chartColors.fill}
 stroke={chartColors.stroke}
 strokeWidth="3"
 strokeLinejoin="round"
 initial={{ pathLength: 0, opacity: 0 }}
 animate={{ pathLength: 1, opacity: 1 }}
 transition={{ duration: 1.5, ease: "easeOut" }}
 />
 ) : (
 <path
 d={pathData}
 fill={chartColors.fill}
 stroke={chartColors.stroke}
 strokeWidth="3"
 strokeLinejoin="round"
 />
 )}

 {/* Data points with hover effects */}
 {points.map((point, index) => (
 <g key={index}>
 {/* Hover area (invisible) */}
 <circle
 cx={point.x}
 cy={point.y}
 r="12"
 fill="transparent"
 style={{ cursor: showTooltips ? 'pointer' : 'default' }}
 onMouseMove={(e) => handleMouseMove(e, point, index)}
 onMouseLeave={handleMouseLeave}
 />

 {/* Animated data point */}
 {animated ? (
 <motion.circle
 cx={point.x}
 cy={point.y}
 r={hoveredPoint?.index === index ? "6" : "5"}
 fill={point.colors.point}
 stroke="white"
 strokeWidth="3"
 initial={{ scale: 0, opacity: 0 }}
 animate={{ scale: 1, opacity: 1 }}
 transition={{
 duration: 0.6,
 delay: index * 0.1,
 type: "spring",
 stiffness: 200
 }}
 whileHover={{ scale: 1.2 }}
 style={{
 filter: hoveredPoint?.index === index ? 'drop-shadow(0 2px 8px rgba(0,0,0,0.2))' : 'none',
 cursor: showTooltips ? 'pointer' : 'default'
 }}
 />
 ) : (
 <circle
 cx={point.x}
 cy={point.y}
 r={hoveredPoint?.index === index ? "6" : "5"}
 fill={point.colors.point}
 stroke="white"
 strokeWidth="3"
 style={{
 filter: hoveredPoint?.index === index ? 'drop-shadow(0 2px 8px rgba(0,0,0,0.2))' : 'none',
 cursor: showTooltips ? 'pointer' : 'default'
 }}
 onMouseMove={(e) => handleMouseMove(e, point, index)}
 onMouseLeave={handleMouseLeave}
 />
 )}
 </g>
 ))}

 {/* Labels */}
 {labels}
 </svg>

 {/* Enhanced Tooltip */}
 {showTooltips && hoveredPoint && (
 <div
 className="absolute z-10 bg-gray-900 text-white px-3 py-2 rounded-lg shadow-lg pointer-events-none transform -translate-x-1/2 -translate-y-full"
 style={{
 left: tooltipPosition.x,
 top: tooltipPosition.y - 10,
 }}
 >
 <div className="text-sm font-semibold">{hoveredPoint.name}</div>
 <div className="text-xs text-gray-300">
 Score: <span className="font-bold text-white">{Math.round(hoveredPoint.score)}/100</span>
 </div>
 {hoveredPoint.count && (
 <div className="text-xs text-gray-300">
 Tests: <span className="font-bold text-white">{hoveredPoint.count}</span>
 </div>
 )}
 {/* Tooltip arrow */}
 <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
 </div>
 )}
 </div>
 );
};

export default RadarChart;
