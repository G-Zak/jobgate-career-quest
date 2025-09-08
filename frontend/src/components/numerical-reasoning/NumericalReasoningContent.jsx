import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { NUMERICAL_REASONING_SETTINGS } from '../../config/numerical-reasoning-settings';

/**
 * NumericalReasoningContent - Component to display numerical reasoning test content
 * Handles different formats of numerical reasoning content (text, images, tables, etc.)
 */
const NumericalReasoningContent = ({ contentData, className = '' }) => {
  const [content, setContent] = useState(null);
  const [error, setError] = useState(false);
  
  useEffect(() => {
    // Reset error state when content changes
    setError(false);
    
    if (!contentData) {
      setError(true);
      return;
    }
    
    // Handle different content types
    if (typeof contentData === 'string') {
      // Simple text content
      setContent({ type: 'text', text: contentData });
    } else if (contentData.type) {
      // Process based on content type
      switch(contentData.type) {
        case 'image':
          setContent({
            type: 'image',
            src: NUMERICAL_REASONING_SETTINGS.resolveImagePath(contentData.image_path),
            alt: contentData.description || 'Numerical reasoning chart',
          });
          break;
        
        case 'table':
          setContent({
            type: 'table',
            headers: contentData.headers || [],
            rows: contentData.data || [],
          });
          break;
          
        case 'text':
          setContent({
            type: 'text',
            text: contentData.text || contentData.description || '',
          });
          break;
          
        case 'chart':
          // For data that should be rendered as a chart
          setContent({
            type: 'chart',
            chartType: contentData.chart_type || 'bar',
            data: contentData.data || [],
            options: contentData.options || {},
          });
          break;
          
        default:
          // Default handling for unknown content
          setContent({ type: 'text', text: JSON.stringify(contentData) });
      }
    } else {
      // Unknown format, display as JSON
      setContent({ type: 'text', text: JSON.stringify(contentData) });
    }
  }, [contentData]);
  
  // Handle image loading errors
  const handleImageError = () => {
    setError(true);
  };
  
  // If content isn't ready yet
  if (!content) {
    return <div className="loading">Loading content...</div>;
  }
  
  // Render based on content type
  return (
    <div className={`numerical-content ${className} ${error ? 'content-error' : ''}`}>
      {content.type === 'text' && (
        <div className="numerical-text">
          {content.text}
        </div>
      )}
      
      {content.type === 'image' && (
        <div className="numerical-image">
          <img 
            src={error ? NUMERICAL_REASONING_SETTINGS.FALLBACK_IMAGE : content.src}
            alt={content.alt} 
            onError={handleImageError}
            className="max-w-full h-auto"
          />
          {error && (
            <div className="image-error-message text-sm text-red-500 mt-1">
              Image could not be loaded
            </div>
          )}
        </div>
      )}
      
      {content.type === 'table' && (
        <div className="numerical-table overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                {content.headers.map((header, index) => (
                  <th key={index} className="border border-gray-300 px-4 py-2">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {content.rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="border border-gray-300 px-4 py-2">
                      {typeof cell === 'number' 
                        ? NUMERICAL_REASONING_SETTINGS.formatNumber(cell)
                        : cell
                      }
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {content.type === 'chart' && (
        <div className="numerical-chart">
          {/* Placeholder for chart rendering - would use a chart library */}
          <div className="chart-placeholder p-4 border border-dashed border-gray-300 rounded">
            {error ? (
              <div className="text-red-500">Chart could not be rendered</div>
            ) : (
              <div>
                <p>{content.chartType} Chart (Data visualization)</p>
                <p className="text-sm text-gray-500">Chart would be rendered here using a chart library</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

NumericalReasoningContent.propTypes = {
  contentData: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      type: PropTypes.string,
      text: PropTypes.string,
      image_path: PropTypes.string,
      description: PropTypes.string,
      headers: PropTypes.array,
      data: PropTypes.array,
      chart_type: PropTypes.string,
      options: PropTypes.object
    }),
  ]).isRequired,
  className: PropTypes.string,
};

export default NumericalReasoningContent;
