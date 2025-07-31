import BaseScene from './BaseScene.js';
import { SCENE_KEYS, GAME_CONFIG } from '@game/config/gameConfig';
import AssetLoader from '@game/utils/AssetLoader.js';

/**
 * PreloadScene - Handles loading of all game assets with AssetLoader
 * Shows loading progress and initializes the game
 */
class PreloadScene extends BaseScene {
  constructor() {
    super(SCENE_KEYS.PRELOAD);
    this.assetLoader = null;
  }

  preload() {
    console.log('🎮 PreloadScene: Loading assets...');
    
    // Create loading UI
    this.createLoadingUI();
    
    // Initialize asset loader
    this.assetLoader = new AssetLoader(this);
    
    // Set up event listeners for asset loading
    this.events.on('loadingProgress', this.updateProgress, this);
    this.events.on('assetsLoaded', this.onLoadComplete, this);
    this.load.on('loaderror', this.onLoadError, this);

    // Load all game assets using AssetLoader
    this.assetLoader.loadAssets();
  }

  createLoadingUI() {
    const { centerX, centerY } = this.getResponsiveDimensions();

    // Background
    this.createBackground();

    // Title
    this.titleText = this.add.text(centerX, centerY - 100, 'CareerQuest', {
      fontSize: '48px',
      fill: '#4a90e2',
      fontFamily: 'Arial, sans-serif',
      fontStyle: 'bold'
    });
    this.titleText.setOrigin(0.5);

    // Loading text
    this.loadingText = this.add.text(centerX, centerY, 'Loading...', {
      fontSize: '24px',
      fill: '#ffffff',
      fontFamily: 'Arial, sans-serif'
    });
    this.loadingText.setOrigin(0.5);

    // Progress bar background
    this.progressBarBg = this.add.graphics();
    this.progressBarBg.fillStyle(0x333333);
    this.progressBarBg.fillRect(centerX - 200, centerY + 50, 400, 20);
    
    // Progress bar
    this.progressBar = this.add.graphics();
    
    // Percentage text
    this.percentText = this.add.text(centerX, centerY + 80, '0%', {
      fontSize: '18px',
      fill: '#ffffff',
      fontFamily: 'Arial, sans-serif'
    });
    this.percentText.setOrigin(0.5);

    // Loading spinner
    this.spinner = this.createLoadingSpinner(centerX + 220, centerY + 60);
  }

  createLoadingSpinner(x, y) {
    const spinner = this.add.graphics();
    spinner.lineStyle(3, 0x4a90e2, 1);
    spinner.arc(x, y, 12, 0, Math.PI * 1.5);
    
    this.tweens.add({
      targets: spinner,
      rotation: Math.PI * 2,
      duration: 1000,
      repeat: -1,
      ease: 'Linear'
    });

    return spinner;
  }

  updateProgress(percentage) {
    // Update progress bar
    if (this.progressBar) {
      const progressWidth = (percentage / 100) * 396; // 400 - 4 for padding
      this.progressBar.clear();
      this.progressBar.fillStyle(0x4CAF50); // Green color
      this.progressBar.fillRect(
        this.progressBarBg.x + 2, 
        this.progressBarBg.y + 2, 
        progressWidth, 
        16 // 20 - 4 for padding
      );
    }

    // Update percentage text
    if (this.percentText) {
      this.percentText.setText(`${percentage}%`);
    }

    // Update loading text with animated dots
    const dots = '.'.repeat((Math.floor(percentage / 25) % 4));
    if (this.loadingText) {
      this.loadingText.setText(`Loading${dots}`);
    }

    console.log(`📊 Asset loading progress: ${percentage}%`);
  }

  onLoadComplete() {
    console.log('✅ PreloadScene: All assets loaded successfully');
    
    // Update UI to show completion
    if (this.loadingText) {
      this.loadingText.setText('Loading Complete!');
      this.loadingText.setStyle({ fill: '#27ae60' });
    }
    
    if (this.percentText) {
      this.percentText.setText('100%');
    }
    
    // Wait a moment then transition to main scene
    this.time.delayedCall(1000, () => {
      this.startGame();
    });
  }

  onLoadError(file) {
    console.error('❌ PreloadScene: Failed to load asset:', file?.key || 'unknown');
    
    if (this.loadingText) {
      this.loadingText.setText('Loading Error - Click to Continue');
      this.loadingText.setStyle({ fill: '#e74c3c' });
    }
    
    // Allow user to click to continue despite error
    this.input.once('pointerdown', () => {
      this.startGame();
    });
  }

  startGame() {
    console.log('🚀 PreloadScene: Starting game...');
    
    // Fade transition to main scene
    this.cameras.main.fadeOut(500, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      // Start the main scene (which handles skill selection)
      this.scene.start(SCENE_KEYS.MAIN);
    });
  }

  // Handle resize
  resize() {
    this.handleResize();
    
    // Reposition UI elements
    const { centerX, centerY } = this.getResponsiveDimensions();
    
    if (this.titleText) {
      this.titleText.setPosition(centerX, centerY - 100);
    }
    
    if (this.loadingText) {
      this.loadingText.setPosition(centerX, centerY);
    }
    
    if (this.progressBarBg) {
      // Clear and redraw at new position
      this.progressBarBg.clear();
      this.progressBarBg.fillStyle(0x333333);
      this.progressBarBg.fillRect(centerX - 200, centerY + 50, 400, 20);
    }
    
    if (this.percentText) {
      this.percentText.setPosition(centerX, centerY + 80);
    }
    
    if (this.spinner) {
      this.spinner.setPosition(centerX + 220, centerY + 60);
    }
  }

  // Clean up when scene shuts down
  shutdown() {
    console.log('🧹 PreloadScene: Cleaning up...');
    
    // Remove event listeners
    this.events.off('loadingProgress');
    this.events.off('assetsLoaded');
    this.load.off('loaderror');
    
    // Clean up asset loader
    if (this.assetLoader) {
      this.assetLoader = null;
    }
    
    super.shutdown();
  }
}

export default PreloadScene;
