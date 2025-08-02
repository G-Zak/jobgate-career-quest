import React from 'react';
import './PixelArt.css';

const PixelArtCard = ({ children, className = '' }) => {
  return (
    <div className={`pixel-card ${className}`}>
      {children}
    </div>
  );
};

export default PixelArtCard;