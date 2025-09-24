import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  MinusIcon,
  ChartBarIcon,
  AcademicCapIcon,
  ClockIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';

const PerformanceMetrics = ({ 
  metrics = [], 
  layout = 'grid', 
  animated = true,
  className = '' 
}) => {
  const getIcon = (type) => {
    const iconMap = {
      score: ChartBarIcon,
      tests: AcademicCapIcon,
      time: ClockIcon,
      achievement: TrophyIcon,
      trend: ArrowTrendingUpIcon
    };
    return iconMap[type] || ChartBarIcon;
  };

  const getTrendIcon = (trend) => {
    if (trend > 0) return ArrowTrendingUpIcon;
    if (trend < 0) return ArrowTrendingDownIcon;
    return MinusIcon;
  };

  const getTrendColor = (trend) => {
    if (trend > 0) return 'text-green-600';
    if (trend < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getValueColor = (value, threshold) => {
    if (!threshold) return 'text-gray-900';
    if (value >= threshold.excellent) return 'text-green-600';
    if (value >= threshold.good) return 'text-blue-600';
    if (value >= threshold.average) return 'text-yellow-600';
    return 'text-red-600';
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  const layoutClasses = {
    grid: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4',
    flex: 'flex flex-wrap gap-4',
    list: 'space-y-4'
  };

  return (
    <motion.div
      className={`${layoutClasses[layout]} ${className}`}
      variants={animated ? containerVariants : {}}
      initial={animated ? "hidden" : ""}
      animate={animated ? "visible" : ""}
    >
      {metrics.map((metric, index) => {
        const Icon = getIcon(metric.type);
        const TrendIcon = getTrendIcon(metric.trend || 0);
        const trendColor = getTrendColor(metric.trend || 0);
        const valueColor = getValueColor(metric.value, metric.threshold);

        return (
          <motion.div
            key={metric.id || index}
            className={`bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow ${
              layout === 'list' ? 'flex items-center space-x-4' : ''
            }`}
            variants={animated ? itemVariants : {}}
            whileHover={{ scale: 1.02 }}
          >
            {/* Icon and main content */}
            <div className={`flex items-center ${layout === 'list' ? 'space-x-4' : 'justify-between mb-3'}`}>
              <div className={`flex items-center ${layout === 'list' ? 'space-x-4' : 'space-x-3'}`}>
                <div className={`p-2 rounded-lg ${metric.iconBg || 'bg-blue-100'}`}>
                  <Icon className={`w-5 h-5 ${metric.iconColor || 'text-blue-600'}`} />
                </div>
                {layout === 'list' && (
                  <div>
                    <div className="text-sm font-medium text-gray-700">{metric.label}</div>
                    {metric.description && (
                      <div className="text-xs text-gray-500">{metric.description}</div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Trend indicator */}
              {metric.trend !== undefined && metric.trend !== 0 && (
                <div className={`flex items-center space-x-1 ${trendColor}`}>
                  <TrendIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {metric.trend > 0 ? '+' : ''}{metric.trend}
                    {metric.trendUnit || ''}
                  </span>
                </div>
              )}
            </div>

            {/* Value and label for grid/flex layouts */}
            {layout !== 'list' && (
              <div className="space-y-1">
                <div className={`text-2xl font-bold ${valueColor}`}>
                  {metric.prefix || ''}{metric.value}{metric.suffix || ''}
                </div>
                <div className="text-sm font-medium text-gray-700">{metric.label}</div>
                {metric.description && (
                  <div className="text-xs text-gray-500">{metric.description}</div>
                )}
              </div>
            )}

            {/* Value for list layout */}
            {layout === 'list' && (
              <div className="ml-auto text-right">
                <div className={`text-xl font-bold ${valueColor}`}>
                  {metric.prefix || ''}{metric.value}{metric.suffix || ''}
                </div>
                {metric.subValue && (
                  <div className="text-sm text-gray-500">{metric.subValue}</div>
                )}
              </div>
            )}

            {/* Progress bar (optional) */}
            {metric.progress !== undefined && (
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                  <span>Progress</span>
                  <span>{metric.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className={`h-2 rounded-full ${
                      metric.progress >= 80 ? 'bg-green-500' :
                      metric.progress >= 60 ? 'bg-blue-500' :
                      metric.progress >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${metric.progress}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                  />
                </div>
              </div>
            )}

            {/* Additional info */}
            {metric.additionalInfo && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="text-xs text-gray-600">
                  {metric.additionalInfo}
                </div>
              </div>
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default PerformanceMetrics;
