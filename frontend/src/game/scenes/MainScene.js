import BaseScene from './BaseScene.js';
import { SCENE_KEYS } from '@game/config/gameConfig';

/**
 * MainScene - Main menu and skill selection
 * Bridge between React dashboard and game scenes
 */
class MainScene extends BaseScene {
  constructor() {
    super(SCENE_KEYS.MAIN);
  }

  create() {
    console.log('🎮 MainScene: Creating main menu...');
    
    // Initialize scene
    this.createBackground();
    this.createUI();
    
    // Set up event handlers
    this.setupEventHandlers();
  }

  createUI() {
    const { centerX, centerY, isMobile } = this.getResponsiveDimensions();
    
    // Title
    this.titleText = this.add.text(centerX, centerY - 200, 'CareerQuest', {
      fontSize: isMobile ? '36px' : '48px',
      fill: '#4a90e2',
      fontFamily: 'Arial, sans-serif',
      fontStyle: 'bold'
    });
    this.titleText.setOrigin(0.5);

    // Subtitle
    this.subtitleText = this.add.text(centerX, centerY - 150, 'Choose Your Skill Assessment', {
      fontSize: isMobile ? '18px' : '24px',
      fill: '#ffffff',
      fontFamily: 'Arial, sans-serif'
    });
    this.subtitleText.setOrigin(0.5);

    // Current skill display
    this.currentSkillText = this.add.text(centerX, centerY - 100, '', {
      fontSize: '20px',
      fill: '#27ae60',
      fontFamily: 'Arial, sans-serif',
      fontStyle: 'bold'
    });
    this.currentSkillText.setOrigin(0.5);
    this.updateSkillDisplay();

    // Start button
    this.startButton = this.createButton(
      centerX, 
      centerY + 50, 
      isMobile ? 200 : 250, 
      50, 
      'Enter Career Quest', 
      () => this.startQuest(),
      {
        backgroundColor: 0x27ae60,
        hoverColor: 0x2ecc71,
        fontSize: isMobile ? '16px' : '18px'
      }
    );

    // Back to dashboard button
    this.backButton = this.createButton(
      centerX, 
      centerY + 120, 
      isMobile ? 160 : 200, 
      40, 
      'Back to Dashboard', 
      () => this.backToDashboard(),
      {
        backgroundColor: 0x95a5a6,
        hoverColor: 0xbdc3c7,
        fontSize: '14px'
      }
    );

    // Instructions
    this.instructionsText = this.add.text(centerX, centerY + 200, 
      'Click "Enter Career Quest" to meet your recruiter and start the assessment!', {
      fontSize: isMobile ? '14px' : '16px',
      fill: '#bdc3c7',
      fontFamily: 'Arial, sans-serif',
      align: 'center',
      wordWrap: { width: isMobile ? 300 : 500, useAdvancedWrap: true }
    });
    this.instructionsText.setOrigin(0.5);
  }

  updateSkillDisplay() {
    const skillNames = {
      'react': 'React Development',
      'javascript': 'JavaScript',
      'python': 'Python',
      'nodejs': 'Node.js',
      'typescript': 'TypeScript',
      'vue': 'Vue.js',
      'angular': 'Angular'
    };

    const skillName = skillNames[this.selectedSkill] || this.selectedSkill.toUpperCase();
    this.currentSkillText.setText(`Selected Skill: ${skillName}`);
  }

  startQuest() {
    console.log(`🚀 Starting quest for skill: ${this.selectedSkill}`);
    
    // Transition to recruiter scene
    this.createFadeTransition(SCENE_KEYS.RECRUITER, {
      selectedSkill: this.selectedSkill
    });
  }

  backToDashboard() {
    console.log('🔙 Returning to React dashboard...');
    
    // Call React callback to exit game
    this.callReact('onGameExit');
  }

  setupEventHandlers() {
    // Listen for skill changes from React
    this.registry.events.on('changedata-selectedSkill', (parent, key, data) => {
      this.selectedSkill = data;
      this.updateSkillDisplay();
    });

    // Handle keyboard shortcuts
    this.input.keyboard.on('keydown-ENTER', () => {
      this.startQuest();
    });

    this.input.keyboard.on('keydown-ESC', () => {
      this.backToDashboard();
    });
  }

  onSkillChange(newSkill) {
    super.onSkillChange(newSkill);
    this.updateSkillDisplay();
  }

  // Handle resize
  resize() {
    this.handleResize();
    
    // Recreate UI with new dimensions
    if (this.titleText) {
      this.children.removeAll();
      this.createBackground();
      this.createUI();
    }
  }
}

export default MainScene;
