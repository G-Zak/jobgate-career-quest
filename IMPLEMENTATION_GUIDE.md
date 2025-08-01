# Career Quest - Immediate Implementation Guide

## 🎯 Start Here: Task 1 - Setup Frontend Architecture

Since your Docker environment is already working, let's begin with implementing the Phaser game engine in your React frontend.

### Step 1: Install Phaser (5 minutes)

```bash
# Enter your frontend container
docker-compose exec frontend sh

# Install Phaser
npm install phaser

# Optional: Install TypeScript definitions if you plan to use TypeScript
npm install --save-dev @types/phaser
```

### Step 2: Create Game Directory Structure (10 minutes)

Create the following files in your frontend:

```bash
# Inside the frontend container or on your host machine:
mkdir -p src/game/{scenes,assets/{sprites,ui},utils,components}
```

### Step 3: Implement Core Game Files

#### 1. Main Game Component (`src/game/Game.jsx`)

```jsx
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
```

#### 2. Base Scene Class (`src/game/scenes/BaseScene.js`)

```javascript
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
```

#### 3. Recruiter Scene (`src/game/scenes/RecruiterScene.js`)

```javascript
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
```

### Step 4: Add Game to Your React App

Update your main App component to include the game:

```jsx
// src/App.jsx (or wherever your main component is)
import React, { useState } from 'react';
import GameComponent from './game/Game';

function App() {
  const [showGame, setShowGame] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState('react');

  const skills = [
    { id: 'react', name: 'React Development', icon: '⚛️' },
    { id: 'javascript', name: 'JavaScript', icon: '🟨' },
    { id: 'python', name: 'Python', icon: '🐍' },
    { id: 'django', name: 'Django', icon: '🎸' }
  ];

  if (showGame) {
    return <GameComponent selectedSkill={selectedSkill} />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold text-center mb-8">
        JobGate Career Quest
      </h1>
      
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl mb-6">Select a skill to validate:</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {skills.map(skill => (
            <div 
              key={skill.id}
              className="bg-gray-800 p-6 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors"
              onClick={() => {
                setSelectedSkill(skill.id);
                setShowGame(true);
              }}
            >
              <div className="text-4xl mb-2">{skill.icon}</div>
              <h3 className="text-xl font-semibold">{skill.name}</h3>
              <p className="text-gray-400 mt-2">Click to start assessment</p>
            </div>
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <button
            onClick={() => setShowGame(true)}
            className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
          >
            Start Random Assessment
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
```

### Step 5: Test Your Implementation

1. **Rebuild your frontend container:**
```bash
docker-compose build frontend
docker-compose up -d
```

2. **Access the application:**
- Frontend: http://localhost:3000
- You should see the skill selection interface
- Clicking on a skill should launch the Phaser game with the recruiter scene

### Step 6: Verify Everything Works

**Expected behavior:**
- ✅ Phaser game renders in the browser
- ✅ Recruiter scene displays with office environment
- ✅ Typewriter dialogue effect appears
- ✅ "Begin Assessment" button appears after dialogue
- ✅ Clicking button attempts to transition to TestScene (will show error for now - that's expected)

## 🐛 Common Issues & Solutions

**Issue: Phaser not rendering**
```bash
# Check if Phaser installed correctly
docker-compose exec frontend npm list phaser

# Restart containers
docker-compose restart frontend
```

**Issue: CSS styling conflicts**
Add to your global CSS:
```css
.game-container canvas {
  display: block !important;
}
```

**Issue: Container size problems**
The game automatically scales, but you can adjust the container size in Game.jsx

## ✅ Success Criteria for This Task

- [ ] Phaser game loads without errors
- [ ] Recruiter scene displays correctly
- [ ] Office environment renders (desk, chair, monitor)
- [ ] Recruiter character appears with basic animation
- [ ] Typewriter dialogue effect works
- [ ] Start button appears and is clickable
- [ ] Scene transition attempt occurs (error expected for now)

## 🔄 Next Steps

Once this is working:
1. **Task 2**: Setup backend API for questions
2. **Task 3**: Create the TestScene with actual test UI
3. **Task 4**: Connect frontend to backend API

Would you like me to help you implement any specific part of this, or do you want to proceed with setting up the backend API endpoints next?
