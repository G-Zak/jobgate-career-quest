import React from 'react';
import './PixelArt.css';

const PixelFooter = () => {
  return (
    <footer className="pixel-footer">
      <button className="pixel-nav-button">
        <span className="pixel-icon">🏠</span> Home
      </button>
      <button className="pixel-nav-button">
        <span className="pixel-icon">🎮</span> Career Quest
      </button>
      <button className="pixel-nav-button">
        <span className="pixel-icon">📊</span> Stats
      </button>
      <button className="pixel-nav-button">
        <span className="pixel-icon">🔔</span> Alerts
      </button>
    </footer>
  );
};

export default PixelFooter;