import Phaser from 'phaser';
import PreloadScene from '@scenes/PreloadScene';
import MainScene from '@scenes/MainScene';
import RecruiterScene from '@scenes/RecruiterScene';
import QuizScene from '@scenes/QuizScene';

/**
 * Main Phaser game configuration
 * Defines scenes, physics, rendering settings
 */
export const gameConfig = {
  type: Phaser.AUTO,
  width: 1024,
  height: 768,
  parent: 'phaser-game',
  backgroundColor: '#1a252f',
  
  // Scene configuration
  scene: [
    PreloadScene,    // Scene 0: Asset loading
    MainScene,       // Scene 1: Main menu/dashboard
    RecruiterScene,  // Scene 2: Recruiter interaction
    QuizScene        // Scene 3: Quiz interface (if needed)
  ],

  // Physics configuration
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false // Set to true for development
    }
  },

  // Scale configuration
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
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
  },

  // Render configuration
  render: {
    antialias: false, // Keep pixel-perfect for pixel art
    pixelArt: true,   // Enable pixel art mode
    roundPixels: true // Round pixel positions
  },

  // Input configuration
  input: {
    activePointers: 3, // Support multi-touch
    smoothFactor: 0,   // No input smoothing for responsive feel
  },

  // Audio configuration
  audio: {
    disableWebAudio: false,
    context: false
  },

  // Development configuration
  plugins: {
    global: []
  }
};

// Scene keys for easy reference
export const SCENE_KEYS = {
  PRELOAD: 'PreloadScene',
  MAIN: 'MainScene', 
  RECRUITER: 'RecruiterScene',
  QUIZ: 'QuizScene'
};

// Game constants
export const GAME_CONFIG = {
  // Canvas dimensions
  CANVAS_WIDTH: 1024,
  CANVAS_HEIGHT: 768,
  
  // Asset paths
  ASSETS_PATH: '/src/game/assets/',
  IMAGES_PATH: '/src/game/assets/images/',
  SOUNDS_PATH: '/src/game/assets/sounds/',
  SPRITES_PATH: '/src/game/assets/sprites/',
  
  // Responsive breakpoints
  BREAKPOINTS: {
    MOBILE: 768,
    TABLET: 1024,
    DESKTOP: 1920
  },
  
  // Performance settings
  MAX_PARTICLES: 100,
  TARGET_FPS: 60,
  
  // Animation settings
  DEFAULT_ANIM_DURATION: 2000,
  TYPEWRITER_SPEED: 50,
  
  // UI settings
  UI_DEPTH: 1000,
  DIALOG_DEPTH: 2000,
  DEBUG_DEPTH: 9999
};

export default gameConfig;
