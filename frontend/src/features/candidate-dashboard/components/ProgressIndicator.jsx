import React from 'react';
import { motion } from 'framer-motion';

const ProgressIndicator = ({ 
  value, 
  max = 100, 
  size = 'md', 
  color = 'blue', 
  showValue = true, 
  label = '', 
  animated = true,
  className = ''
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  // Size configurations
  const sizeConfig = {
    sm: { width: 'w-16', height: 'h-16', strokeWidth: 4, textSize: 'text-xs' },
    md: { width: 'w-20', height: 'h-20', strokeWidth: 6, textSize: 'text-sm' },
    lg: { width: 'w-24', height: 'h-24', strokeWidth: 8, textSize: 'text-base' },
    xl: { width: 'w-32', height: 'h-32', strokeWidth: 10, textSize: 'text-lg' }
  };
  
  // Color configurations
  const colorConfig = {
    blue: { stroke: 'stroke-blue-500', bg: 'stroke-blue-100', text: 'text-blue-600' },
    green: { stroke: 'stroke-green-500', bg: 'stroke-green-100', text: 'text-green-600' },
    yellow: { stroke: 'stroke-yellow-500', bg: 'stroke-yellow-100', text: 'text-yellow-600' },
    red: { stroke: 'stroke-red-500', bg: 'stroke-red-100', text: 'text-red-600' },
    purple: { stroke: 'stroke-purple-500', bg: 'stroke-purple-100', text: 'text-purple-600' },
    indigo: { stroke: 'stroke-indigo-500', bg: 'stroke-indigo-100', text: 'text-indigo-600' }
  };
  
  const config = sizeConfig[size];
  const colors = colorConfig[color];
  
  // Calculate circle properties
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  return (
    <div className={`flex flex-col items-center space-y-2 ${className}`}>
      <div className={`relative ${config.width} ${config.height}`}>
        <svg
          className="transform -rotate-90 w-full h-full"
          viewBox="0 0 100 100"
        >
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            className={colors.bg}
            strokeWidth={config.strokeWidth}
          />
          
          {/* Progress circle */}
          {animated ? (
            <motion.circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              className={colors.stroke}
              strokeWidth={config.strokeWidth}
              strokeLinecap="round"
              strokeDasharray={strokeDasharray}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          ) : (
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              className={colors.stroke}
              strokeWidth={config.strokeWidth}
              strokeLinecap="round"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
            />
          )}
        </svg>
        
        {/* Center content */}
        {showValue && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className={`font-bold ${colors.text} ${config.textSize}`}>
                {Math.round(value)}
              </div>
              {max !== 100 && (
                <div className={`text-xs text-gray-500`}>
                  / {max}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Label */}
      {label && (
        <div className="text-center">
          <div className="text-sm font-medium text-gray-700">{label}</div>
        </div>
      )}
    </div>
  );
};

export default ProgressIndicator;
