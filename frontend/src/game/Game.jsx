import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import RecruiterScene from './scenes/RecruiterScene';
import TestScene from './scenes/TestScene';

const GameComponent = ({ selectedSkill = 'react' }) => {
  const gameRef = useRef(null);
  const phaserGameRef = useRef(null);

  useEffect(() => {
    if (phaserGameRef.current) {
      phaserGameRef.current.destroy(true);
    }

    const config = {
      type: Phaser.AUTO,
      width: 1024,
      height: 768,
      parent: gameRef.current,
      backgroundColor: '#2c3e50',
      scene: [RecruiterScene, TestScene],
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 },
          debug: false
        }
      },
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
      }
    };

    phaserGameRef.current = new Phaser.Game(config);

    // Pass selected skill to the game
    phaserGameRef.current.registry.set('selectedSkill', selectedSkill);
    phaserGameRef.current.registry.set('apiUrl', process.env.VITE_API_URL || 'http://localhost:8000');

    return () => {
      if (phaserGameRef.current) {
        phaserGameRef.current.destroy(true);
        phaserGameRef.current = null;
      }
    };
  }, [selectedSkill]);

  return (
    <div className="game-wrapper w-full h-screen flex items-center justify-center bg-gray-900">
      <div ref={gameRef} className="game-container shadow-lg rounded-lg overflow-hidden" />
    </div>
  );
};

export default GameComponent;
