import React, { useState } from 'react';
import { motion } from 'framer-motion';

const TrendChart = ({
 data = [],
 width = 400,
 height = 200,
 color = 'blue',
 showPoints = true,
 showGrid = true,
 animated = true,
 className = ''
}) => {
 const [hoveredPoint, setHoveredPoint] = useState(null);

 if (!data || data.length === 0) {
 return (
 <div className={`flex items-center justify-center bg-gray-50 rounded-lg ${className}`} style={{ width, height }}>
 <div className="text-center text-gray-500">
 <div className="text-sm">No data available</div>
 </div>
 </div>
 );
 }

 // Color configurations
 const colorConfig = {
 blue: { stroke: '#3B82F6', fill: 'rgba(59, 130, 246, 0.1)', point: '#3B82F6' },
 green: { stroke: '#10B981', fill: 'rgba(16, 185, 129, 0.1)', point: '#10B981' },
 red: { stroke: '#EF4444', fill: 'rgba(239, 68, 68, 0.1)', point: '#EF4444' },
 yellow: { stroke: '#F59E0B', fill: 'rgba(245, 158, 11, 0.1)', point: '#F59E0B' },
 purple: { stroke: '#8B5CF6', fill: 'rgba(139, 92, 246, 0.1)', point: '#8B5CF6' }
 };

 const colors = colorConfig[color] || colorConfig.blue;

 // Calculate chart dimensions
 const padding = 40;
 const chartWidth = width - (padding * 2);
 const chartHeight = height - (padding * 2);

 // Find min and max values
 const values = data.map(d => d.value);
 const minValue = Math.min(...values);
 const maxValue = Math.max(...values);
 const valueRange = maxValue - minValue || 1;

 // Calculate points
 const points = data.map((item, index) => {
 const x = padding + (index / (data.length - 1)) * chartWidth;
 const y = padding + chartHeight - ((item.value - minValue) / valueRange) * chartHeight;
 return { x, y, ...item };
 });

 // Create path for the line
 const pathData = points
 .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
 .join(' ');

 // Create area path
 const areaPath = `${pathData} L ${points[points.length - 1].x} ${padding + chartHeight} L ${points[0].x} ${padding + chartHeight} Z`;

 // Grid lines
 const gridLines = [];
 if (showGrid) {
 // Horizontal grid lines
 for (let i = 0; i <= 4; i++) {
 const y = padding + (i / 4) * chartHeight;
 gridLines.push(
 <line
 key={`h-${i}`}
 x1={padding}
 y1={y}
 x2={padding + chartWidth}
 y2={y}
 stroke="#f3f4f6"
 strokeWidth="1"
 strokeDasharray="2,2"
 />
 );
 }

 // Vertical grid lines
 for (let i = 0; i <= 4; i++) {
 const x = padding + (i / 4) * chartWidth;
 gridLines.push(
 <line
 key={`v-${i}`}
 x1={x}
 y1={padding}
 x2={x}
 y2={padding + chartHeight}
 stroke="#f3f4f6"
 strokeWidth="1"
 strokeDasharray="2,2"
 />
 );
 }
 }

 return (
 <div className={`relative ${className}`}>
 <svg width={width} height={height} className="overflow-visible">
 {/* Grid */}
 {gridLines}

 {/* Area fill */}
 {animated ? (
 <motion.path
 d={areaPath}
 fill={colors.fill}
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 transition={{ duration: 1, delay: 0.5 }}
 />
 ) : (
 <path d={areaPath} fill={colors.fill} />
 )}

 {/* Line */}
 {animated ? (
 <motion.path
 d={pathData}
 fill="none"
 stroke={colors.stroke}
 strokeWidth="3"
 strokeLinecap="round"
 strokeLinejoin="round"
 initial={{ pathLength: 0 }}
 animate={{ pathLength: 1 }}
 transition={{ duration: 2, ease: "easeInOut" }}
 />
 ) : (
 <path
 d={pathData}
 fill="none"
 stroke={colors.stroke}
 strokeWidth="3"
 strokeLinecap="round"
 strokeLinejoin="round"
 />
 )}

 {/* Data points */}
 {showPoints && points.map((point, index) => (
 <g key={index}>
 {/* Hover area */}
 <circle
 cx={point.x}
 cy={point.y}
 r="8"
 fill="transparent"
 style={{ cursor: 'pointer' }}
 onMouseEnter={() => setHoveredPoint({ ...point, index })}
 onMouseLeave={() => setHoveredPoint(null)}
 />

 {/* Visible point */}
 {animated ? (
 <motion.circle
 cx={point.x}
 cy={point.y}
 r={hoveredPoint?.index === index ? "6" : "4"}
 fill={colors.point}
 stroke="white"
 strokeWidth="2"
 initial={{ scale: 0 }}
 animate={{ scale: 1 }}
 transition={{ duration: 0.3, delay: index * 0.1 }}
 style={{
 filter: hoveredPoint?.index === index ? 'drop-shadow(0 2px 8px rgba(0,0,0,0.2))' : 'none'
 }}
 />
 ) : (
 <circle
 cx={point.x}
 cy={point.y}
 r={hoveredPoint?.index === index ? "6" : "4"}
 fill={colors.point}
 stroke="white"
 strokeWidth="2"
 style={{
 filter: hoveredPoint?.index === index ? 'drop-shadow(0 2px 8px rgba(0,0,0,0.2))' : 'none'
 }}
 />
 )}
 </g>
 ))}

 {/* Y-axis labels */}
 {[0, 1, 2, 3, 4].map(i => {
 const value = minValue + (i / 4) * valueRange;
 const y = padding + chartHeight - (i / 4) * chartHeight;
 return (
 <text
 key={i}
 x={padding - 10}
 y={y + 4}
 textAnchor="end"
 className="text-xs fill-gray-500"
 >
 {Math.round(value)}
 </text>
 );
 })}

 {/* X-axis labels */}
 {points.map((point, index) => {
 if (index % Math.ceil(points.length / 5) === 0 || index === points.length - 1) {
 return (
 <text
 key={index}
 x={point.x}
 y={padding + chartHeight + 20}
 textAnchor="middle"
 className="text-xs fill-gray-500"
 >
 {point.label || index + 1}
 </text>
 );
 }
 return null;
 })}
 </svg>

 {/* Tooltip */}
 {hoveredPoint && (
 <div
 className="absolute z-10 bg-gray-900 text-white px-3 py-2 rounded-lg shadow-lg pointer-events-none transform -translate-x-1/2 -translate-y-full"
 style={{
 left: hoveredPoint.x,
 top: hoveredPoint.y - 10,
 }}
 >
 <div className="text-sm font-semibold">{hoveredPoint.label || `Point ${hoveredPoint.index + 1}`}</div>
 <div className="text-xs text-gray-300">
 Value: <span className="font-bold text-white">{hoveredPoint.value}</span>
 </div>
 {hoveredPoint.date && (
 <div className="text-xs text-gray-300">
 Date: <span className="font-bold text-white">{hoveredPoint.date}</span>
 </div>
 )}
 {/* Tooltip arrow */}
 <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
 </div>
 )}
 </div>
 );
};

export default TrendChart;
