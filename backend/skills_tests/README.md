# Skills Tests Module

A comprehensive Python module for conducting numerical and abstract reasoning tests as part of the JobGate Career Quest platform.

## Features

### 🧮 Numerical Reasoning Tests

- **25 questions, 20 minutes duration**
- **Categories**: Arithmetic/Percentages, Ratio/Proportion, Data Interpretation, Financial Calculations, Statistical Reasoning
- **Difficulty Distribution**: Easy (40%), Medium (45%), Hard (15%)
- **Advanced Scoring**: Raw score + time bonus + difficulty multipliers
- **Time Bonus**: Extra points for completing under 15 minutes

### 🔷 Abstract Reasoning Tests

- **20 questions, 15 minutes duration**
- **Categories**: Pattern Matrices, Shape Sequences, Transformation Rules, Odd-One-Out
- **Visual Patterns**: SVG-based visual questions with geometric shapes
- **Simple Scoring**: Points per correct answer (no time bonus)

### 📊 Analytics & Insights

- Performance breakdown by category and difficulty
- Time analysis per question
- Personalized study recommendations
- Percentile ranking estimation
- Detailed question-by-question results

### 🔧 Technical Features

- JSON-based question storage with validation schemas
- Session management for interactive testing
- Result export functionality
- Django integration ready
- Comprehensive error handling

## Quick Start

### Basic Usage

```python
from skills_tests import create_numerical_test, calculate_test_score

# Create a numerical reasoning test
questions, test_info = create_numerical_test(num_questions=25)

# Simulate user responses
responses = [
    {'question_id': 'NRT_001', 'answer': 'B', 'time_taken': 45},
    {'question_id': 'NRT_002', 'answer': 'C', 'time_taken': 60},
    # ... more responses
]

# Calculate score
total_time = 1200  # 20 minutes in seconds
result = calculate_test_score('numerical_reasoning', responses, questions, total_time)

print(f"Score: {result.percentage}% ({result.raw_score}/{result.total_questions})")
print(f"Final Score: {result.final_score} points")
print(f"Time Bonus: {result.time_bonus} points")
```

### Interactive Test Session

```python
from skills_tests.test_utils import TestSession

# Create a test session
session = TestSession('numerical_reasoning', user_id='user123')

# Start the test
start_info = session.start_test(num_questions=25)
print(f"Test started with {start_info['total_questions']} questions")

# Submit answers one by one
result1 = session.submit_answer('B', time_taken=45)
result2 = session.submit_answer('A', time_taken=52)

# Check if test is completed
if result2['test_completed']:
    final_results = result2['final_results']
    print(f"Test completed! Final score: {final_results.percentage}%")
```

## File Structure

```
skills_tests/
├── __init__.py                 # Main test engine and core functions
├── test_utils.py              # Session management and analytics
├── django_integration.py      # Django REST API views
├── demo.py                    # Comprehensive demonstration script
├── requirements.txt           # Python dependencies
├── data/
│   ├── numerical_reasoning_questions.json    # Sample numerical questions
│   └── abstract_reasoning_questions.json     # Sample abstract questions
└── schemas/
    ├── question_schema.json              # JSON schema for questions
    ├── numerical_test_config.json        # Numerical test configuration
    └── abstract_test_config.json         # Abstract test configuration
```

## Question Format

### Numerical Reasoning Question Example

```json
{
  "question_id": "NRT_001",
  "test_type": "numerical_reasoning",
  "difficulty": "easy",
  "category": "arithmetic_percentages",
  "question_content": {
    "type": "text",
    "text": "A store offers a 25% discount on all items. If a jacket originally costs $80, what is the final price?",
    "data": {
      "original_price": 80,
      "discount_percentage": 25
    }
  },
  "options": [
    { "option_id": "A", "content": "$55" },
    { "option_id": "B", "content": "$60" },
    { "option_id": "C", "content": "$65" },
    { "option_id": "D", "content": "$70" },
    { "option_id": "E", "content": "$75" }
  ],
  "correct_answer": "B",
  "explanation": "25% of $80 = 0.25 × $80 = $20. Final price = $80 - $20 = $60",
  "time_limit": 90,
  "points": 4
}
```

### Abstract Reasoning Question Example

```json
{
  "question_id": "ART_001",
  "test_type": "abstract_reasoning",
  "difficulty": "easy",
  "category": "pattern_matrices",
  "question_content": {
    "type": "visual",
    "pattern_type": "matrix",
    "svg_data": "<svg viewBox='0 0 300 300'>...</svg>",
    "description": "Complete the 2x2 matrix pattern"
  },
  "options": [
    {
      "option_id": "A",
      "content": {
        "type": "svg",
        "svg_data": "<svg viewBox='0 0 40 40'>...</svg>"
      }
    }
  ],
  "correct_answer": "A",
  "explanation": "The pattern alternates diagonally...",
  "time_limit": 60,
  "points": 5
}
```

## Scoring System

### Numerical Reasoning

- **Base Points**: 4 points per question
- **Difficulty Multipliers**: Easy (1.0x), Medium (1.2x), Hard (1.5x)
- **Time Bonus**: Up to 20 extra points for completing under 15 minutes
- **Formula**: `final_score = (correct_answers × base_points × difficulty_multiplier) + time_bonus`

### Abstract Reasoning

- **Base Points**: 5 points per question
- **No Time Bonus**: Simple scoring system
- **Formula**: `final_score = correct_answers × 5`

## Django Integration

### URL Configuration

```python
# urls.py
from django.urls import path
from skills_tests.django_integration import (
    StartTestView, SubmitAnswerView, GetQuestionView,
    GetTestResultsView, ListAvailableTestsView, ExportResultsView
)

urlpatterns = [
    path('api/skills-tests/start/', StartTestView.as_view(), name='start_test'),
    path('api/skills-tests/submit-answer/', SubmitAnswerView.as_view(), name='submit_answer'),
    path('api/skills-tests/question/<str:session_id>/', GetQuestionView.as_view(), name='get_question'),
    path('api/skills-tests/results/<str:session_id>/', GetTestResultsView.as_view(), name='get_results'),
    path('api/skills-tests/available/', ListAvailableTestsView.as_view(), name='list_tests'),
    path('api/skills-tests/export/', ExportResultsView.as_view(), name='export_results'),
]
```

### Frontend Integration

```javascript
// Start a test
const response = await fetch('/api/skills-tests/start/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    test_type: 'numerical_reasoning',
    user_id: 'user123',
    num_questions: 25,
  }),
});
const data = await response.json();

// Submit answers
const submitResponse = await fetch('/api/skills-tests/submit-answer/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    session_id: data.session_id,
    answer: 'B',
    time_taken: 45,
  }),
});
```

## API Endpoints

| Endpoint                                   | Method | Description                        |
| ------------------------------------------ | ------ | ---------------------------------- |
| `/api/skills-tests/available/`             | GET    | List all available test types      |
| `/api/skills-tests/start/`                 | POST   | Start a new test session           |
| `/api/skills-tests/question/<session_id>/` | GET    | Get current question               |
| `/api/skills-tests/submit-answer/`         | POST   | Submit answer for current question |
| `/api/skills-tests/results/<session_id>/`  | GET    | Get detailed test results          |
| `/api/skills-tests/export/`                | POST   | Export results to file             |

## Analytics Output

```python
# Category Performance
{
  "arithmetic_percentages": {
    "total": 6,
    "correct": 4,
    "percentage": 66.7,
    "average_time": 52.3
  },
  "data_interpretation": {
    "total": 7,
    "correct": 5,
    "percentage": 71.4,
    "average_time": 78.1
  }
}

# Study Recommendations
[
  "Good performance with room for improvement in specific areas.",
  "Focus on improving in: financial_calculations, statistical_reasoning",
  "Work on time management - practice solving problems more quickly"
]
```

## Testing

Run the demonstration script to test all functionality:

```bash
cd backend/skills_tests
python demo.py
```

This will:

- ✅ Load and validate question data
- ✅ Demonstrate test creation and scoring
- ✅ Show analytics and recommendations
- ✅ Test session management
- ✅ Export sample results

## Question Creation Guidelines

### Numerical Reasoning

1. **Arithmetic/Percentages**: Basic calculations, discounts, tax calculations
2. **Ratio/Proportion**: Recipe scaling, map distances, unit conversions
3. **Data Interpretation**: Charts, graphs, tables analysis
4. **Financial Calculations**: Interest, profit/loss, investment returns
5. **Statistical Reasoning**: Averages, medians, probability

### Abstract Reasoning

1. **Pattern Matrices**: 2x2 or 3x3 grids with missing elements
2. **Shape Sequences**: Progressive changes in size, rotation, color
3. **Transformation Rules**: Apply same rule to different shapes
4. **Odd One Out**: Identify shape that breaks the pattern

## Performance Optimization

- **Question Caching**: Questions loaded once and cached in memory
- **Session Storage**: In production, use Redis or database for session storage
- **SVG Optimization**: Compress SVG data for faster loading
- **Lazy Loading**: Load questions on-demand for large question banks

## Security Considerations

- **Session Validation**: Always validate session IDs
- **Answer Encryption**: Consider encrypting correct answers in production
- **Rate Limiting**: Implement rate limiting for API endpoints
- **Input Sanitization**: Validate all user inputs
- **CORS Configuration**: Configure CORS properly for frontend integration

## Future Enhancements

- 🎯 **Question Bank Expansion**: Add more question categories
- 📱 **Mobile Optimization**: Responsive design for mobile devices
- 🌐 **Internationalization**: Multi-language support
- 📊 **Advanced Analytics**: Machine learning for performance prediction
- 🔄 **Adaptive Testing**: Difficulty adjustment based on performance
- 📧 **Report Generation**: PDF report generation with charts
- 🏆 **Gamification**: Badges, achievements, and leaderboards

## Contributors

- **Skills Assessment Team** - Initial development
- **JobGate Career Quest Project** - Platform integration

## License

This module is part of the JobGate Career Quest platform.

---

_Built with ❤️ for accurate skills assessment and career development_
