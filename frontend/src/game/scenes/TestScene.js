import BaseScene from './BaseScene';

export default class TestScene extends BaseScene {
  constructor() {
    super('TestScene');
  }

  create() {
    this.createBackground();
    
    // Temporary message until we implement the full test UI
    const messageText = this.add.text(512, 384, 'Test Scene Coming Soon!', {
      fontSize: '32px',
      fill: '#ffffff',
      fontFamily: 'Arial, sans-serif'
    });
    messageText.setOrigin(0.5);

    const backButton = this.createButton(
      512, 450, 150, 50, 'Back to Intro',
      () => this.scene.start('RecruiterScene')
    );
  }
}
