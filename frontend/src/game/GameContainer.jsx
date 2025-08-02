import { useEffect, useRef, useState } from 'react';
// import Phaser from 'phaser';
// import { gameConfig } from '@game/config/gameConfig';

/**
 * GameContainer - React wrapper component for Phaser.js
 * Handles the integration between React and Phaser game engine
 * TEMPORARILY DISABLED - Phaser dependencies commented out
 */
const GameContainer = ({ 
  selectedSkill = 'react', 
  onGameExit = null,
  onQuizStart = null,
  className = '' 
}) => {
  return (
    <div className={`game-container ${className}`}>
      <div className="min-h-screen bg-gray-900 text-white p-8 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-red-500">⚠️ Game Temporarily Disabled</h1>
          <p className="text-xl mb-4">The game component is currently disabled due to dependency issues.</p>
          <p className="text-lg mb-6">Selected Skill: <span className="text-green-400">{selectedSkill}</span></p>
          {onGameExit && (
            <button
              onClick={onGameExit}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg text-lg font-semibold transition-colors"
            >
              Back to Dashboard
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameContainer;
