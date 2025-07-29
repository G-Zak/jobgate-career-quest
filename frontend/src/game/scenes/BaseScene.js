import Phaser from 'phaser';

export default class BaseScene extends Phaser.Scene {
  constructor(key) {
    super({ key });
  }

  // Common background setup
  createBackground() {
    // Gradient background effect
    const graphics = this.add.graphics();
    graphics.fillGradientStyle(0x1a252f, 0x2c3e50, 0x1a252f, 0x34495e, 1);
    graphics.fillRect(0, 0, 1024, 768);

    // Add some ambient elements
    this.createAmbientElements();
  }

  createAmbientElements() {
    // Add subtle floating particles for atmosphere
    for (let i = 0; i < 20; i++) {
      const x = Phaser.Math.Between(0, 1024);
      const y = Phaser.Math.Between(0, 768);
      const particle = this.add.circle(x, y, 2, 0x3498db, 0.3);
      
      // Animate particles
      this.tweens.add({
        targets: particle,
        y: y - 100,
        alpha: 0,
        duration: Phaser.Math.Between(3000, 6000),
        ease: 'Power2',
        repeat: -1,
        yoyo: true
      });
    }
  }

  // Smooth fade transition between scenes
  createFadeTransition(targetScene, data = {}) {
    this.cameras.main.fadeOut(500, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start(targetScene, data);
    });
  }

  // Create styled button
  createButton(x, y, width, height, text, onClick, style = {}) {
    const defaultStyle = {
      backgroundColor: 0x27ae60,
      hoverColor: 0x2ecc71,
      textColor: '#ffffff',
      fontSize: '16px'
    };
    
    const buttonStyle = { ...defaultStyle, ...style };

    // Button background
    const button = this.add.rectangle(x, y, width, height, buttonStyle.backgroundColor);
    button.setInteractive({ useHandCursor: true });

    // Button text
    const buttonText = this.add.text(x, y, text, {
      fontSize: buttonStyle.fontSize,
      fill: buttonStyle.textColor,
      fontFamily: 'Arial, sans-serif'
    });
    buttonText.setOrigin(0.5);

    // Hover effects
    button.on('pointerover', () => {
      button.setFillStyle(buttonStyle.hoverColor);
      this.tweens.add({
        targets: [button, buttonText],
        scaleX: 1.05,
        scaleY: 1.05,
        duration: 100
      });
    });

    button.on('pointerout', () => {
      button.setFillStyle(buttonStyle.backgroundColor);
      this.tweens.add({
        targets: [button, buttonText],
        scaleX: 1,
        scaleY: 1,
        duration: 100
      });
    });

    button.on('pointerdown', onClick);

    return { button, buttonText };
  }

  // Typewriter text effect
  createTypewriterText(x, y, text, style = {}, speed = 50) {
    const defaultStyle = {
      fontSize: '18px',
      fill: '#ffffff',
      fontFamily: 'Arial, sans-serif',
      wordWrap: { width: 400 }
    };

    const textStyle = { ...defaultStyle, ...style };
    const textObject = this.add.text(x, y, '', textStyle);
    
    let i = 0;
    const timer = this.time.addEvent({
      delay: speed,
      callback: () => {
        textObject.text += text[i];
        i++;
        if (i === text.length) {
          timer.remove();
        }
      },
      repeat: text.length - 1
    });

    return textObject;
  }
}
