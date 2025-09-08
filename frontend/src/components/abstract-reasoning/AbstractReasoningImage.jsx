import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ABSTRACT_REASONING_SETTINGS } from '../../config/abstract-reasoning-settings';

/**
 * AbstractReasoningImage - Component to display abstract reasoning test images
 * Handles loading and error fallback for abstract reasoning test questions and options
 */
const AbstractReasoningImage = ({ imageData, alt, className = '' }) => {
  const [imageSrc, setImageSrc] = useState('');
  const [error, setError] = useState(false);
  
  useEffect(() => {
    // Reset error state when image changes
    setError(false);
    
    // Handle different image data formats
    if (typeof imageData === 'string') {
      // Direct path
      setImageSrc(ABSTRACT_REASONING_SETTINGS.resolveImagePath(imageData));
    } else if (imageData && imageData.type === 'image') {
      // Object with image_path property
      setImageSrc(ABSTRACT_REASONING_SETTINGS.resolveImagePath(imageData.image_path));
    } else {
      // Handle SVG data if present
      if (imageData && imageData.svg_data) {
        // Create a blob URL for the SVG content
        const blob = new Blob([imageData.svg_data], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        setImageSrc(url);
        
        // Clean up blob URL on unmount
        return () => URL.revokeObjectURL(url);
      } else {
        // Use fallback image
        setImageSrc(ABSTRACT_REASONING_SETTINGS.FALLBACK_IMAGE);
        setError(true);
      }
    }
  }, [imageData]);
  
  const handleError = () => {
    console.warn('Failed to load abstract reasoning image:', imageData);
    setImageSrc(ABSTRACT_REASONING_SETTINGS.FALLBACK_IMAGE);
    setError(true);
  };
  
  return (
    <div className={`abstract-reasoning-image ${className} ${error ? 'image-error' : ''}`}>
      <img 
        src={imageSrc} 
        alt={alt || 'Abstract reasoning test image'} 
        onError={handleError}
        className="max-w-full h-auto"
      />
      {error && (
        <div className="image-error-message text-sm text-red-500 mt-1">
          Image could not be loaded
        </div>
      )}
    </div>
  );
};

AbstractReasoningImage.propTypes = {
  imageData: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      type: PropTypes.string,
      image_path: PropTypes.string,
      svg_data: PropTypes.string,
    }),
  ]).isRequired,
  alt: PropTypes.string,
  className: PropTypes.string,
};

export default AbstractReasoningImage;
