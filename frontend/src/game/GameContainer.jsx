import { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { gameConfig } from '@game/config/gameConfig';

/**
 * GameContainer - React wrapper component for Phaser.js
 * Handles the integration between React and Phaser game engine
 */
const GameContainer = ({ 
  selectedSkill = 'react', 
  onGameExit = null,
  onQuizStart = null,
  className = '' 
}) => {
  const gameRef = useRef(null);
  const phaserGameRef = useRef(null);
  const [gameLoaded, setGameLoaded] = useState(false);
  const [gameError, setGameError] = useState(null);

  useEffect(() => {
    if (gameRef.current && !phaserGameRef.current) {
      try {
        // Create Phaser game configuration
        const config = {
          ...gameConfig,
          parent: gameRef.current,
          callbacks: {
            onGameExit: onGameExit,
            onQuizStart: onQuizStart,
          },
          scale: {
            mode: Phaser.Scale.RESIZE,
            parent: gameRef.current,
            width: '100%',
            height: '100%',
            min: {
              width: 320,
              height: 240
            },
            max: {
              width: 1920,
              height: 1080
            }
          }
        };

        // Initialize Phaser game
        phaserGameRef.current = new Phaser.Game(config);

        // Pass data to Phaser
        phaserGameRef.current.registry.set('selectedSkill', selectedSkill);
        phaserGameRef.current.registry.set('reactCallbacks', {
          onGameExit,
          onQuizStart
        });

        // Game loaded successfully
        setGameLoaded(true);
        setGameError(null);

      } catch (error) {
        console.error('Failed to initialize Phaser game:', error);
        setGameError(error.message);
        setGameLoaded(false);
      }
    }

    // Cleanup function
    return () => {
      if (phaserGameRef.current) {
        phaserGameRef.current.destroy(true);
        phaserGameRef.current = null;
        setGameLoaded(false);
      }
    };
  }, [selectedSkill, onGameExit, onQuizStart]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (phaserGameRef.current) {
        phaserGameRef.current.scale.refresh();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update skill when prop changes
  useEffect(() => {
    if (phaserGameRef.current && gameLoaded) {
      phaserGameRef.current.registry.set('selectedSkill', selectedSkill);
      
      // Notify current scene of skill change
      const currentScene = phaserGameRef.current.scene.getActiveScene();
      if (currentScene && currentScene.onSkillChange) {
        currentScene.onSkillChange(selectedSkill);
      }
    }
  }, [selectedSkill, gameLoaded]);

  if (gameError) {
    return (
      <div className={`game-container error ${className}`}>
        <div className="error-message bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <h3 className="font-bold">Game Error</h3>
          <p>Failed to load game: {gameError}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`game-container ${className}`}>
      {!gameLoaded && (
        <div className="loading-overlay absolute inset-0 bg-gray-900 flex items-center justify-center z-10">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p>Loading CareerQuest...</p>
          </div>
        </div>
      )}
      
      <div 
        ref={gameRef} 
        className="phaser-game w-full h-full"
        style={{ 
          minHeight: '400px',
          background: '#1a252f' // Fallback background
        }}
      />
    </div>
  );
};

export default GameContainer;
