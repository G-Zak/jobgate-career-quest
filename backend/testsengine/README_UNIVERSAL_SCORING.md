# Universal Scoring System

A comprehensive, scalable scoring system for ALL test types in the JobGate Career Quest platform. This system provides consistent, fair, and detailed scoring across multiple choice, numerical, verbal, abstract, spatial, situational, and other test formats.

## 🌟 Features

- **Universal Compatibility**: Works with any question type
- **Flexible Configuration**: Customizable scoring weights for different test types
- **Time Efficiency Tracking**: Rewards faster, more efficient answers
- **Difficulty-Based Scoring**: Higher difficulty questions yield more points
- **Real-Time Calculation**: Instant score calculation as users answer
- **Detailed Analytics**: Comprehensive breakdown of performance
- **Database Integration**: Full Django ORM integration
- **API Ready**: RESTful API endpoints for frontend integration
- **Production Ready**: Well-tested, documented, and scalable

## 🏗️ Architecture

### Core Components

1. **`scoring_system.py`** - Core scoring logic and algorithms
2. **`models_scoring.py`** - Django models for database integration
3. **`scoring_service.py`** - Service layer for business logic
4. **`views_scoring.py`** - API endpoints and views
5. **`examples_scoring.py`** - Comprehensive usage examples

### Question Types Supported

- **Multiple Choice**: Standard A, B, C, D questions
- **Numerical**: Mathematical calculations and data interpretation
- **Verbal**: Reading comprehension and vocabulary
- **Abstract**: Pattern recognition and abstract reasoning
- **Spatial**: Spatial visualization and mental rotation
- **Situational**: Judgment and decision-making scenarios
- **Diagrammatic**: Diagram interpretation and analysis
- **Technical**: Technical knowledge and problem-solving
- **Logical**: Logical reasoning and sequence analysis
- **Open Ended**: Free-form text responses

## 🚀 Quick Start

### 1. Basic Score Calculation

```python
from testsengine.scoring_system import UniversalScoringSystem, Question, QuestionType, ScoreWeight

# Create scoring system
scoring_system = UniversalScoringSystem()

# Create a question
question = Question(
    id="q_1",
    type=QuestionType.MULTIPLE_CHOICE,
    question="What is 2 + 2?",
    options=["3", "4", "5", "6"],
    correct_answer="4",
    difficulty=1,
    score_weight=ScoreWeight(base=5, difficulty_bonus=2.0, time_factor=1.0)
)

# Calculate score
score = scoring_system.calculate_score(question, "4", 15.0)  # Correct answer, 15 seconds
print(f"Score: {score}")  # Output: Score: 2
```

### 2. Database Integration

```python
from testsengine.scoring_service import ScoringService

# Create service
service = ScoringService()

# Create question in database
question = service.create_question(
    question_id="demo_1",
    question_type="multiple_choice",
    question_text="What is 3 + 3?",
    correct_answer="6",
    difficulty=1,
    options=["5", "6", "7", "8"]
)

# Start test session
session = service.start_test_session(
    user=request.user,
    test_id="demo_test",
    test_type="logical"
)

# Record response
response = service.record_question_response(
    session=session,
    question_id="demo_1",
    user_answer="6",
    time_taken=20.0
)

# Complete session and get results
result = service.complete_test_session(session)
```

### 3. API Usage

```javascript
// Start test session
const startResponse = await fetch('/scoring/start-session/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        test_id: 'logical_reasoning_v1',
        test_type: 'logical',
        scoring_config: 'standard'
    })
});

// Record question response
const recordResponse = await fetch('/scoring/record-response/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        session_id: sessionId,
        question_id: 'logical_1_1',
        user_answer: 'b',
        time_taken: 25.5
    })
});

// Complete session and get results
const completeResponse = await fetch('/scoring/complete-session/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_id: sessionId })
});
```

## 📊 Scoring Algorithm

### Score Calculation Formula

```python
if answer_wrong:
    score = 0
else:
    base_score = question.score_weight.base
    difficulty_bonus = (question.difficulty × 
                       question.score_weight.difficulty_bonus × 
                       global_config.difficulty_weight)
    time_bonus = time_efficiency_factor × global_config.time_weight
    preliminary_score = base_score + difficulty_bonus + time_bonus
    final_score = preliminary_score × global_config.accuracy_weight
    score = round(final_score)
```

### Time Efficiency Calculation

Time efficiency is calculated based on question type and difficulty:

- **Excellent**: Within 1.0x expected time → 2.0x bonus
- **Good**: Within 1.5x expected time → 1.5x bonus  
- **Average**: Within 2.0x expected time → 1.0x bonus
- **Slow**: Within 3.0x expected time → 0.5x bonus
- **Very Slow**: Beyond 3.0x expected time → 0.2x bonus

### Default Time Thresholds (seconds)

| Question Type | Excellent | Good | Average | Slow |
|---------------|-----------|------|---------|------|
| Multiple Choice | 15 | 30 | 60 | 120 |
| Numerical | 30 | 60 | 90 | 150 |
| Verbal | 45 | 90 | 120 | 180 |
| Abstract | 20 | 40 | 70 | 120 |
| Spatial | 25 | 50 | 80 | 130 |
| Situational | 40 | 80 | 120 | 180 |
| Diagrammatic | 30 | 60 | 90 | 150 |
| Technical | 60 | 120 | 180 | 240 |
| Logical | 20 | 40 | 70 | 120 |
| Open Ended | 120 | 240 | 360 | 600 |

## ⚙️ Configuration

### Global Scoring Configurations

```python
# Standard balanced configuration
standard_config = GlobalScoringConfig(
    time_weight=0.3,        # 30% weight for time efficiency
    difficulty_weight=0.5,  # 50% weight for difficulty
    accuracy_weight=0.2     # 20% weight for accuracy
)

# Speed-focused configuration
speed_config = GlobalScoringConfig(
    time_weight=0.5,
    difficulty_weight=0.3,
    accuracy_weight=0.2
)

# Accuracy-focused configuration
accuracy_config = GlobalScoringConfig(
    time_weight=0.2,
    difficulty_weight=0.3,
    accuracy_weight=0.5
)
```

### Question Score Weights

```python
# Default score weight
default_weight = ScoreWeight(
    base=5,              # Base points for correct answer
    difficulty_bonus=2.0, # Multiplier for difficulty bonus
    time_factor=1.0      # Multiplier for time efficiency
)

# Custom weight for difficult questions
hard_question_weight = ScoreWeight(
    base=10,             # Higher base score
    difficulty_bonus=3.0, # Higher difficulty bonus
    time_factor=1.2      # Slightly higher time factor
)
```

## 🗄️ Database Models

### ScoringConfig
- `name`: Configuration name
- `time_weight`: Weight for time-based scoring (0-1)
- `difficulty_weight`: Weight for difficulty-based scoring (0-1)
- `accuracy_weight`: Weight for accuracy-based scoring (0-1)

### Question
- `id`: Unique question identifier
- `question_type`: Type of question
- `question_text`: Question text
- `correct_answer`: Correct answer
- `difficulty`: Difficulty level (1-5)
- `base_score`: Base score for correct answer
- `difficulty_bonus`: Difficulty bonus multiplier
- `time_factor`: Time factor multiplier

### TestSession
- `user`: User taking the test
- `test_id`: Test identifier
- `test_type`: Type of test
- `started_at`: Session start time
- `completed_at`: Session completion time
- `scoring_config`: Scoring configuration used

### QuestionResponse
- `session`: Test session
- `question`: Question answered
- `user_answer`: User's answer
- `time_taken`: Time taken in seconds
- `calculated_score`: Calculated score
- `score_breakdown`: Detailed score breakdown

### TestResult
- `session`: Test session
- `total_score`: Total score achieved
- `max_possible_score`: Maximum possible score
- `percentage`: Score percentage
- `grade`: Letter grade (A-F)
- `performance_level`: Performance indicator
- `recommendations`: Improvement recommendations

## 🌐 API Endpoints

### Test Session Management

- `POST /scoring/start-session/` - Start new test session
- `POST /scoring/record-response/` - Record question response
- `POST /scoring/complete-session/` - Complete test session

### Results and History

- `GET /scoring/results/{session_id}/` - Get test results
- `GET /scoring/history/` - Get user test history
- `GET /scoring/session/{session_id}/status/` - Get session status

### Question Management

- `GET /scoring/question/{question_id}/` - Get question details
- `POST /scoring/import-questions/` - Import questions from JSON

### Scoring Utilities

- `POST /scoring/calculate-score/` - Calculate score for single question
- `GET /scoring/configs/` - Get available scoring configurations

## 📝 Usage Examples

### Frontend Integration

```javascript
class TestScoring {
    constructor(testType) {
        this.testType = testType;
        this.sessionId = null;
        this.questionStartTime = null;
    }
    
    async startTest(testId) {
        const response = await fetch('/scoring/start-session/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                test_id: testId,
                test_type: this.testType
            })
        });
        
        const data = await response.json();
        this.sessionId = data.session_id;
        return data;
    }
    
    startQuestion(questionId) {
        this.currentQuestionId = questionId;
        this.questionStartTime = Date.now();
    }
    
    async submitAnswer(answer) {
        const timeTaken = (Date.now() - this.questionStartTime) / 1000;
        
        const response = await fetch('/scoring/record-response/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                session_id: this.sessionId,
                question_id: this.currentQuestionId,
                user_answer: answer,
                time_taken: timeTaken
            })
        });
        
        return await response.json();
    }
    
    async completeTest() {
        const response = await fetch('/scoring/complete-session/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ session_id: this.sessionId })
        });
        
        return await response.json();
    }
}
```

### Django View Integration

```python
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from testsengine.scoring_service import ScoringService

@require_http_methods(["POST"])
@csrf_exempt
def custom_test_view(request):
    # Your custom test logic here
    service = ScoringService()
    
    # Start session
    session = service.start_test_session(
        user=request.user,
        test_id="custom_test",
        test_type="logical"
    )
    
    # Process questions and responses
    # ...
    
    # Complete session
    result = service.complete_test_session(session)
    
    return JsonResponse({
        'success': True,
        'results': service.get_session_results(session)
    })
```

## 🧪 Testing

### Unit Tests

```python
from django.test import TestCase
from testsengine.scoring_system import UniversalScoringSystem, Question, QuestionType

class ScoringSystemTest(TestCase):
    def setUp(self):
        self.scoring_system = UniversalScoringSystem()
        self.question = Question(
            id="test_1",
            type=QuestionType.MULTIPLE_CHOICE,
            question="Test question?",
            options=["A", "B", "C", "D"],
            correct_answer="b",
            difficulty=2
        )
    
    def test_correct_answer_gets_score(self):
        score = self.scoring_system.calculate_score(
            self.question, "b", 30.0
        )
        self.assertGreater(score, 0)
    
    def test_wrong_answer_gets_zero(self):
        score = self.scoring_system.calculate_score(
            self.question, "a", 10.0
        )
        self.assertEqual(score, 0)
    
    def test_faster_answer_gets_more_points(self):
        slow_score = self.scoring_system.calculate_score(
            self.question, "b", 120.0
        )
        fast_score = self.scoring_system.calculate_score(
            self.question, "b", 15.0
        )
        self.assertGreater(fast_score, slow_score)
```

### Integration Tests

```python
from django.test import TestCase, Client
from django.contrib.auth.models import User

class ScoringAPITest(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user('testuser', 'test@example.com', 'pass')
        self.client.login(username='testuser', password='pass')
    
    def test_complete_test_workflow(self):
        # Start session
        response = self.client.post('/scoring/start-session/', {
            'test_id': 'test_1',
            'test_type': 'logical'
        }, content_type='application/json')
        
        self.assertEqual(response.status_code, 200)
        session_id = response.json()['session_id']
        
        # Record response
        response = self.client.post('/scoring/record-response/', {
            'session_id': session_id,
            'question_id': 'test_1',
            'user_answer': 'b',
            'time_taken': 25.0
        }, content_type='application/json')
        
        self.assertEqual(response.status_code, 200)
        
        # Complete session
        response = self.client.post('/scoring/complete-session/', {
            'session_id': session_id
        }, content_type='application/json')
        
        self.assertEqual(response.status_code, 200)
        self.assertIn('results', response.json())
```

## 🔧 Customization

### Custom Question Types

```python
# Add new question type
from testsengine.scoring_system import QuestionType

# Extend QuestionType enum
class CustomQuestionType(QuestionType):
    CUSTOM_TYPE = "custom_type"

# Add time thresholds for custom type
TimeEfficiencyCalculator.TIME_THRESHOLDS[CustomQuestionType.CUSTOM_TYPE] = {
    "excellent": 30,
    "good": 60,
    "average": 90,
    "slow": 150
}
```

### Custom Scoring Presets

```python
from testsengine.scoring_system import GlobalScoringConfig

# Create custom preset
def get_custom_config():
    return GlobalScoringConfig(
        time_weight=0.4,
        difficulty_weight=0.4,
        accuracy_weight=0.2
    )
```

## 📈 Performance Considerations

- **Caching**: Score calculations are lightweight and can be cached
- **Database Optimization**: Use select_related for efficient queries
- **Batch Operations**: Use bulk_create for importing many questions
- **Async Processing**: Consider async views for high-traffic scenarios

## 🚀 Deployment

### Django Settings

```python
# settings.py
INSTALLED_APPS = [
    # ... other apps
    'testsengine',
]

# Add scoring URLs to main urls.py
urlpatterns = [
    # ... other patterns
    path('api/scoring/', include('testsengine.urls_scoring')),
]
```

### Database Migration

```bash
python manage.py makemigrations testsengine
python manage.py migrate
```

### Create Default Scoring Configurations

```python
# management command or in Django shell
from testsengine.models_scoring import ScoringConfig
from decimal import Decimal

# Create default configurations
configs = [
    {
        'name': 'standard',
        'description': 'Standard balanced scoring',
        'time_weight': Decimal('0.3'),
        'difficulty_weight': Decimal('0.5'),
        'accuracy_weight': Decimal('0.2'),
        'is_default': True
    },
    {
        'name': 'speed_focused',
        'description': 'Speed-focused scoring',
        'time_weight': Decimal('0.5'),
        'difficulty_weight': Decimal('0.3'),
        'accuracy_weight': Decimal('0.2'),
        'is_default': False
    },
    {
        'name': 'accuracy_focused',
        'description': 'Accuracy-focused scoring',
        'time_weight': Decimal('0.2'),
        'difficulty_weight': Decimal('0.3'),
        'accuracy_weight': Decimal('0.5'),
        'is_default': False
    }
]

for config_data in configs:
    ScoringConfig.objects.get_or_create(
        name=config_data['name'],
        defaults=config_data
    )
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## 📄 License

This project is part of the JobGate Career Quest platform.

## 🆘 Support

For questions or issues:
1. Check the examples in `examples_scoring.py`
2. Review the API documentation
3. Create an issue in the repository
4. Contact the development team

---

**The Universal Scoring System is production-ready and designed to scale across all test types in your assessment platform!** 🎯

