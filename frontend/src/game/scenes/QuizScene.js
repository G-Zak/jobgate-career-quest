import BaseScene from './BaseScene.js';
import { SCENE_KEYS } from '@game/config/gameConfig';

/**
 * QuizScene - Basic quiz interface (will be enhanced in later tasks)
 * This scene can be used if quiz is integrated within Phaser
 */
class QuizScene extends BaseScene {
  constructor() {
    super(SCENE_KEYS.QUIZ);
  }

  create() {
    console.log('🎮 QuizScene: Creating quiz interface...');
    
    this.createBackground();
    this.createQuizUI();
  }

  createQuizUI() {
    const { centerX, centerY, isMobile } = this.getResponsiveDimensions();
    
    // Title
    this.titleText = this.add.text(centerX, 50, 'Quiz Mode', {
      fontSize: isMobile ? '24px' : '32px',
      fill: '#4a90e2',
      fontFamily: 'Arial, sans-serif',
      fontStyle: 'bold'
    });
    this.titleText.setOrigin(0.5);

    // Info text
    this.infoText = this.add.text(centerX, centerY, 
      'Quiz interface will be implemented in React.\nThis scene is ready for future Phaser-based quiz features.', {
      fontSize: isMobile ? '16px' : '20px',
      fill: '#ffffff',
      fontFamily: 'Arial, sans-serif',
      align: 'center',
      wordWrap: { width: isMobile ? 300 : 600, useAdvancedWrap: true }
    });
    this.infoText.setOrigin(0.5);

    // Back button
    this.createButton(
      centerX, 
      centerY + 100, 
      isMobile ? 120 : 150, 
      40, 
      'Back to Game', 
      () => this.goBack(),
      {
        backgroundColor: 0x95a5a6,
        hoverColor: 0xbdc3c7,
        fontSize: '16px'
      }
    );
  }

  goBack() {
    console.log('🔙 Returning to recruiter scene...');
    
    this.createFadeTransition(SCENE_KEYS.RECRUITER, {
      selectedSkill: this.selectedSkill
    });
  }

  // Handle resize
  resize() {
    this.handleResize();
    
    // Recreate UI with new dimensions
    if (this.titleText) {
      this.children.removeAll();
      this.createBackground();
      this.createQuizUI();
    }
  }
}

export default QuizScene;
