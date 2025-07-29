# Career Quest MVP - Sprint 1 Development Roadmap

## 🎯 Sprint Goal
Deliver the first playable prototype with:
- Recruiter intro scene
- Smooth transition 
- Focused test UI
- Backend/API connection
- Basic skill validation logic

## 📋 Recommended Development Order

### Phase 1: Foundation (Days 1-2)
**Start Here** - Build the core game infrastructure

#### Task 1: Setup Frontend Architecture (2 pts)
**User Story 1.1** - Setup Frontend with React and Phaser

**What to do:**
1. Install Phaser in your React project
2. Create game container component
3. Setup basic scene management
4. Test rendering with simple sprite

**Files to create/modify:**
```
frontend/src/
├── game/
│   ├── Game.jsx              # Main game component
│   ├── scenes/
│   │   ├── BaseScene.js      # Base scene class
│   │   ├── RecruiterScene.js # Recruiter intro
│   │   └── TestScene.js      # Test interface
│   ├── assets/
│   │   ├── sprites/          # Character sprites
│   │   └── ui/               # UI elements
│   └── utils/
│       └── GameManager.js    # Scene transitions
```

**Implementation steps:**
```bash
# Install Phaser
npm install phaser

# Install additional dependencies for game development
npm install @types/phaser  # If using TypeScript
```

---

### Phase 2: Backend Preparation (Days 2-3)
**Parallel with frontend** - Setup data layer

#### Task 2: Setup Backend API for Questions (2 pts)
**User Story 1.2** - Setup Backend Django REST + PostgreSQL

**What to do:**
1. Create Question and Skill models
2. Setup API endpoints for test data
3. Add sample questions to database
4. Test API connectivity

**Files to create/modify:**
```
backend/
├── testsengine/
│   ├── models.py             # Question, Test, Result models
│   ├── serializers.py        # API serializers
│   ├── views.py              # API endpoints
│   └── urls.py               # Route configuration
├── skills/
│   ├── models.py             # Skill definitions
│   └── fixtures/             # Sample data
└── api/
    └── urls.py               # Main API routing
```

**API Endpoints to create:**
```python
# /api/skills/                  # List available skills
# /api/questions/<skill_id>/    # Get questions for skill
# /api/test-results/            # Submit test results
```

---

### Phase 3: Game Scenes (Days 3-5)
**Core gameplay implementation**

#### Task 3: Build Recruiter Intro Scene (2 pts)
**User Story 2.1** - Recruiter Scene with NPC Dialogues

**What to do:**
1. Create recruiter character sprite
2. Implement typewriter dialogue effect
3. Add "Start Test" button
4. Setup scene layout and styling

**Key features:**
- Pixel-art recruiter at desk
- Professional dialogue: "Welcome, this is a React test, Level 1, duration 30min..."
- Interactive button to proceed

#### Task 4: Implement Scene Transition Logic (1 pt)
**User Story 2.2** - Transition to Test Scene

**What to do:**
1. Create fade transition effect
2. Implement scene switching logic
3. Pass skill data between scenes
4. Test smooth transitions

---

### Phase 4: Test Interface (Days 5-7)
**Main testing functionality**

#### Task 5: Develop Test UI (Questions + Timer) (3 pts)
**User Story 2.3** - Focused Test UI Scene

**What to do:**
1. Create full-screen question interface
2. Implement multiple-choice (A, B, C, D) layout
3. Add countdown timer
4. Show progress indicator
5. Handle answer selection and validation

**UI Components needed:**
- Question display area
- Answer buttons (A, B, C, D)
- Timer component
- Progress bar
- Submit button

---

### Phase 5: Integration (Days 7-8)
**Connect everything together**

#### Task 6: Trigger Skill-Based Test from UI (1 pt)
**User Story 3.1** - Trigger Test Based on Selected Skill

**What to do:**
1. Create skill selection interface
2. Connect to backend API
3. Launch appropriate test based on skill
4. Pass skill context to game

#### Task 7: Complete End-to-End Test Flow (2 pts)
**User Story 7.1** - End-to-End Test Flow

**What to do:**
1. Implement score calculation
2. Show results after test completion
3. Award badges based on performance
4. Update dashboard with results

---

## 🛠️ Technical Implementation Guide

### Step 1: Setup Phaser in React

**1. Install dependencies:**
```bash
cd frontend
npm install phaser
```

**2. Create Game component:**
```jsx
// frontend/src/game/Game.jsx
import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import RecruiterScene from './scenes/RecruiterScene';
import TestScene from './scenes/TestScene';

const Game = () => {
  const gameRef = useRef(null);

  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      width: 1024,
      height: 768,
      parent: gameRef.current,
      scene: [RecruiterScene, TestScene],
      physics: {
        default: 'arcade',
      },
    };

    const game = new Phaser.Game(config);

    return () => {
      game.destroy(true);
    };
  }, []);

  return <div ref={gameRef} className="game-container" />;
};

export default Game;
```

### Step 2: Create Django Models

**1. Questions model:**
```python
# backend/testsengine/models.py
from django.db import models
from skills.models import Skill

class Question(models.Model):
    QUESTION_TYPES = [
        ('mcq', 'Multiple Choice'),
        ('code', 'Code Completion'),
    ]
    
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE)
    question_text = models.TextField()
    question_type = models.CharField(max_length=10, choices=QUESTION_TYPES)
    difficulty = models.IntegerField(default=1)  # 1-5 scale
    
class Answer(models.Model):
    question = models.ForeignKey(Question, related_name='answers', on_delete=models.CASCADE)
    answer_text = models.TextField()
    is_correct = models.BooleanField(default=False)
    option_letter = models.CharField(max_length=1)  # A, B, C, D
```

### Step 3: Create API Endpoints

**1. Serializers:**
```python
# backend/testsengine/serializers.py
from rest_framework import serializers
from .models import Question, Answer

class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ['id', 'answer_text', 'option_letter']

class QuestionSerializer(serializers.ModelSerializer):
    answers = AnswerSerializer(many=True, read_only=True)
    
    class Meta:
        model = Question
        fields = ['id', 'question_text', 'question_type', 'difficulty', 'answers']
```

**2. Views:**
```python
# backend/testsengine/views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Question
from .serializers import QuestionSerializer

@api_view(['GET'])
def get_questions_by_skill(request, skill_id):
    questions = Question.objects.filter(skill_id=skill_id)[:10]  # Limit to 10 questions
    serializer = QuestionSerializer(questions, many=True)
    return Response(serializer.data)
```

### Step 4: Create Phaser Scenes

**1. Base Scene:**
```javascript
// frontend/src/game/scenes/BaseScene.js
import Phaser from 'phaser';

export default class BaseScene extends Phaser.Scene {
  constructor(key) {
    super({ key });
  }

  createBackground() {
    // Add common background elements
    this.add.rectangle(512, 384, 1024, 768, 0x2c3e50);
  }

  createFadeTransition(targetScene, data = {}) {
    this.cameras.main.fadeOut(500, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start(targetScene, data);
    });
  }
}
```

**2. Recruiter Scene:**
```javascript
// frontend/src/game/scenes/RecruiterScene.js
import BaseScene from './BaseScene';

export default class RecruiterScene extends BaseScene {
  constructor() {
    super('RecruiterScene');
  }

  create() {
    this.createBackground();
    
    // Add recruiter sprite (placeholder for now)
    const recruiter = this.add.rectangle(300, 400, 100, 150, 0x34495e);
    
    // Add dialogue
    const dialogue = this.add.text(500, 300, 
      'Welcome! This is a React skill test.\nLevel: Intermediate\nDuration: 30 minutes\n\nAre you ready to begin?', 
      { fontSize: '18px', fill: '#fff', wordWrap: { width: 400 } }
    );

    // Add start button
    const startButton = this.add.rectangle(650, 500, 150, 50, 0x27ae60);
    const buttonText = this.add.text(650, 500, 'Start Test', { fontSize: '16px', fill: '#fff' });
    startButton.setInteractive();
    buttonText.setOrigin(0.5);

    startButton.on('pointerdown', () => {
      this.createFadeTransition('TestScene', { skill: 'react' });
    });
  }
}
```

## 🎮 Integration with Existing Project

Since your Docker environment is already working, you can integrate this into your existing structure:

**1. Update frontend package.json:**
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "phaser": "^3.70.0"
  }
}
```

**2. Add game route to your React app:**
```jsx
// frontend/src/App.jsx
import Game from './game/Game';

function App() {
  return (
    <div className="App">
      <Route path="/game" component={Game} />
      {/* Other routes */}
    </div>
  );
}
```

**3. Update Django URLs:**
```python
# backend/careerquest/urls.py
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/tests/', include('testsengine.urls')),
    path('api/skills/', include('skills.urls')),
    # Other URLs
]
```

## 🚀 Quick Start Commands

```bash
# Start your existing environment
docker-compose up -d

# Install Phaser in frontend
docker-compose exec frontend npm install phaser

# Create Django migrations for new models
docker-compose exec backend python manage.py makemigrations testsengine
docker-compose exec backend python manage.py migrate

# Create sample data
docker-compose exec backend python manage.py shell
# >>> from testsengine.models import Question, Answer
# >>> from skills.models import Skill
# >>> # Create sample questions...
```

## 📊 Success Metrics for Sprint 1

- [ ] Phaser game renders in React container
- [ ] Recruiter scene displays with dialogue
- [ ] Transition to test scene works
- [ ] Test UI shows questions from backend API
- [ ] Timer countdown functions
- [ ] Score calculation works end-to-end
- [ ] Results are saved to database

## 🔄 Next Steps After Sprint 1

1. **Sprint 2**: Advanced game features (animations, sound, better graphics)
2. **Sprint 3**: Dashboard integration and badge system
3. **Sprint 4**: Recruiter dashboard and recommendation engine

Would you like me to help you start with any specific task, or would you prefer to begin with setting up Phaser in your React application?
