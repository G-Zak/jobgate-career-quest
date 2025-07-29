import BaseScene from './BaseScene';

export default class RecruiterScene extends BaseScene {
  constructor() {
    super('RecruiterScene');
  }

  create() {
    this.createBackground();
    
    // Get selected skill from game registry
    const selectedSkill = this.game.registry.get('selectedSkill') || 'react';
    
    this.createOfficeEnvironment();
    this.createRecruiterCharacter();
    this.createDialogue(selectedSkill);
    this.createStartButton(selectedSkill);
  }

  createOfficeEnvironment() {
    // Office desk
    const desk = this.add.rectangle(300, 550, 400, 100, 0x8b4513);
    
    // Office chair
    const chair = this.add.rectangle(200, 450, 80, 120, 0x2c3e50);
    
    // Computer monitor
    const monitor = this.add.rectangle(350, 480, 120, 80, 0x1a1a1a);
    const screen = this.add.rectangle(350, 480, 100, 60, 0x0066cc);
    
    // Office plants for atmosphere
    const plant1 = this.add.rectangle(100, 600, 40, 80, 0x27ae60);
    const plant2 = this.add.rectangle(900, 600, 40, 80, 0x27ae60);
  }

  createRecruiterCharacter() {
    // Simple recruiter character (will be replaced with actual sprite later)
    const recruiterBody = this.add.rectangle(200, 400, 60, 100, 0x3498db);
    const recruiterHead = this.add.circle(200, 350, 30, 0xfdbcb4);
    
    // Hair
    const hair = this.add.circle(200, 340, 35, 0x8b4513);
    
    // Simple face features
    const leftEye = this.add.circle(190, 345, 3, 0x000000);
    const rightEye = this.add.circle(210, 345, 3, 0x000000);
    const mouth = this.add.arc(200, 360, 8, 0, Math.PI, false, 0x000000);
    mouth.setClosePath(false);
    mouth.setStrokeStyle(2, 0x000000);

    // Add subtle animation to make character feel alive
    this.tweens.add({
      targets: [recruiterBody, recruiterHead, hair, leftEye, rightEye],
      y: '+=5',
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  createDialogue(skill) {
    const dialogueBox = this.add.rectangle(650, 400, 500, 200, 0x2c3e50, 0.9);
    const dialogueBorder = this.add.rectangle(650, 400, 500, 200, 0x3498db);
    dialogueBorder.setStrokeStyle(3, 0x3498db);
    dialogueBorder.setFillStyle();

    const skillNames = {
      'react': 'React Development',
      'javascript': 'JavaScript Programming',
      'python': 'Python Development',
      'django': 'Django Framework'
    };

    const skillName = skillNames[skill] || 'Programming';
    
    const dialogueText = `Welcome to JobGate Career Quest!

I'm here to help you validate your ${skillName} skills.

This assessment will test your knowledge through:
• Multiple choice questions
• Code completion challenges
• Problem-solving scenarios

Duration: 30 minutes
Questions: 10
Difficulty: Intermediate

Are you ready to showcase your skills?`;

    // Use typewriter effect for dialogue
    setTimeout(() => {
      this.createTypewriterText(430, 320, dialogueText, {
        fontSize: '16px',
        fill: '#ecf0f1',
        wordWrap: { width: 450 },
        lineSpacing: 5
      }, 30);
    }, 1000);
  }

  createStartButton(skill) {
    // Wait for dialogue to finish before showing button
    setTimeout(() => {
      const { button, buttonText } = this.createButton(
        650, 550, 200, 60, 'Begin Assessment',
        () => this.startTest(skill),
        {
          backgroundColor: 0xe74c3c,
          hoverColor: 0xc0392b,
          fontSize: '18px'
        }
      );

      // Add entrance animation for button
      button.setScale(0);
      buttonText.setScale(0);
      
      this.tweens.add({
        targets: [button, buttonText],
        scaleX: 1,
        scaleY: 1,
        duration: 300,
        ease: 'Back.easeOut'
      });
    }, 4000);
  }

  startTest(skill) {
    // Add click sound effect (if audio is added later)
    // this.sound.play('buttonClick');
    
    this.createFadeTransition('TestScene', { 
      skill: skill,
      startTime: Date.now()
    });
  }
}
