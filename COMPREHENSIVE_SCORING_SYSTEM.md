# Comprehensive Scoring System Documentation

## Overview

The Skills Assessment Platform now includes a comprehensive scoring system that provides advanced analytics, multi-algorithm scoring, and detailed performance insights across all test types (SJT, Verbal Reasoning, and Spatial Reasoning).

## 🎯 Features

### Multi-Algorithm Scoring Engine
- **Raw Score**: Basic correct/total ratio
- **Weighted Difficulty**: Scores weighted by question difficulty
- **IRT Scoring**: Item Response Theory for adaptive assessment
- **Competency-Based**: Domain-specific skill evaluation
- **Percentile Ranking**: Performance relative to peer groups

### Advanced Analytics
- **Performance Insights**: AI-generated insights about test performance
- **Category Breakdown**: Detailed analysis by skill categories
- **Time Analytics**: Time efficiency and pacing analysis
- **Strengths & Weaknesses**: Personalized performance identification
- **Recommendations**: Targeted improvement suggestions

### Industry Integration
- **Role-Specific Rubrics**: Scoring adapted for different industries
- **Competency Mapping**: Skills aligned with job requirements
- **Benchmark Comparisons**: Performance vs. industry standards

## 📊 Architecture

### Database Models

#### ScoringProfile
```python
class ScoringProfile(models.Model):
    name = models.CharField(max_length=100, unique=True)
    test_type = models.CharField(max_length=50)
    scoring_algorithm = models.CharField(max_length=50, choices=ALGORITHM_CHOICES)
    algorithm_parameters = models.JSONField(default=dict)
    scale_min = models.IntegerField(default=0)
    scale_max = models.IntegerField(default=100)
    pass_threshold = models.FloatField(default=70.0)
    category_weights = models.JSONField(default=dict)
    performance_levels = models.JSONField(default=dict)
    industry_rubrics = models.JSONField(default=dict)
    is_active = models.BooleanField(default=True)
```

#### TestScore
```python
class TestScore(models.Model):
    session = models.OneToOneField('TestSession', on_delete=models.CASCADE)
    scoring_profile = models.ForeignKey(ScoringProfile, on_delete=models.CASCADE)
    raw_score = models.IntegerField()
    scaled_score = models.FloatField()
    percentage_score = models.FloatField()
    percentile_rank = models.FloatField()
    completion_time = models.IntegerField()
    accuracy_rate = models.FloatField()
    time_per_question = models.FloatField()
    strengths = models.JSONField(default=list)
    weaknesses = models.JSONField(default=list)
    recommendations = models.JSONField(default=list)
```

#### CategoryScore
```python
class CategoryScore(models.Model):
    test_score = models.ForeignKey(TestScore, on_delete=models.CASCADE)
    category = models.CharField(max_length=100)
    questions_attempted = models.IntegerField()
    questions_correct = models.IntegerField()
    raw_score = models.IntegerField()
    weighted_score = models.FloatField()
    percentage = models.FloatField()
    avg_time_per_question = models.FloatField()
    difficulty_distribution = models.JSONField(default=dict)
    performance_level = models.CharField(max_length=50)
```

### Scoring Algorithms

#### 1. Competency-Based Scoring (SJT)
```python
competency_weights = {
    'leadership': 0.25,
    'teamwork': 0.20,
    'problem_solving': 0.25,
    'communication': 0.20,
    'decision_making': 0.10
}
```

#### 2. Weighted Difficulty Scoring (Verbal)
```python
difficulty_weights = {
    'easy': 1.0,
    'medium': 1.5,
    'hard': 2.0,
    'expert': 2.5
}
```

#### 3. IRT Scoring (Spatial)
```python
# Uses Item Response Theory with parameters:
ability_range = (-3, 3)
difficulty_range = (-2, 2)
discrimination_factor = 1.5
```

## 🔧 API Endpoints

### Score Calculation
```
POST /api/scores/calculate_score/
{
    "session_id": 123,
    "scoring_profile_id": 1
}
```

### Detailed Breakdown
```
GET /api/scores/{session_id}/detailed_breakdown/
```

### Performance Analytics
```
GET /api/scores/{session_id}/performance_analytics/
```

### Comparison Data
```
GET /api/scores/{session_id}/comparison_data/
```

## 🚀 Setup Instructions

### 1. Run the Setup Script
```bash
chmod +x setup_comprehensive_scoring.sh
./setup_comprehensive_scoring.sh
```

### 2. Manual Setup (Alternative)
```bash
# Install dependencies
pip install numpy scipy pandas scikit-learn

# Run migrations
cd backend
python manage.py makemigrations testsengine
python manage.py migrate

# Setup scoring profiles and migrate data
python manage.py migrate_and_score
```

### 3. Frontend Integration
```jsx
import ScoreDashboard from './ScoreDashboard';
import TestResultsIntegration from './TestResultsIntegration';

// Use the integrated component
<TestResultsIntegration 
    testSession={testSession}
    onRetakeTest={handleRetakeTest}
    onViewHistory={handleViewHistory}
/>
```

## 📈 Usage Examples

### Calculate Score for a Test Session
```python
from testsengine.scoring_system import ScoringEngine
from testsengine.models import TestSession, ScoringProfile

# Get test session and scoring profile
session = TestSession.objects.get(id=123)
profile = ScoringProfile.objects.get(test_type='sjt', is_active=True)

# Calculate comprehensive score
scoring_engine = ScoringEngine()
result = scoring_engine.calculate_comprehensive_score(session, profile)

print(f"Scaled Score: {result.scaled_score}")
print(f"Percentile: {result.percentile_rank}")
print(f"Strengths: {result.strengths}")
```

### Frontend Score Display
```jsx
const [scoreData, setScoreData] = useState(null);

useEffect(() => {
    fetch(`/api/scores/${sessionId}/detailed_breakdown/`)
        .then(response => response.json())
        .then(data => setScoreData(data));
}, [sessionId]);

return <ScoreDashboard userId={userId} testSessionId={sessionId} />;
```

## 🎨 Frontend Components

### ScoreDashboard
- **Overview Tab**: Key metrics and performance summary
- **Categories Tab**: Detailed breakdown by skill categories
- **Insights Tab**: Performance insights and recommendations
- **Comparison Tab**: Percentile ranking and peer comparison

### TestResultsIntegration
- Complete test results interface
- Action buttons for retaking tests
- Export and sharing functionality
- Error handling and loading states

## 🔍 Performance Levels

### Score Ranges
- **Excellent**: 90-100% (Top 10%)
- **Proficient**: 80-89% (Top 25%)
- **Developing**: 70-79% (Average)
- **Basic**: 60-69% (Below Average)
- **Below Basic**: <60% (Needs Improvement)

### Industry Rubrics
```python
industry_rubrics = {
    'technology': {
        'problem_solving': 0.35,
        'technical_reasoning': 0.30,
        'innovation': 0.20,
        'collaboration': 0.15
    },
    'healthcare': {
        'decision_making': 0.30,
        'empathy': 0.25,
        'attention_to_detail': 0.25,
        'communication': 0.20
    }
}
```

## 🧪 Testing

### Run Scoring System Tests
```bash
cd backend
python manage.py test testsengine.tests.test_scoring
```

### Frontend Component Testing
```bash
cd frontend
npm test -- --testPathPattern=ScoreDashboard
```

## 🔧 Configuration

### Scoring Profiles Setup
```python
# Create custom scoring profile
profile = ScoringProfile.objects.create(
    name="Advanced SJT Scoring",
    test_type="sjt",
    scoring_algorithm="competency_based",
    algorithm_parameters={
        'competency_weights': {
            'leadership': 0.30,
            'teamwork': 0.25,
            'problem_solving': 0.25,
            'communication': 0.20
        }
    },
    scale_min=0,
    scale_max=100,
    pass_threshold=75.0
)
```

### Performance Optimization
- **Caching**: Implement Redis caching for score calculations
- **Database Indexing**: Add indexes on frequently queried fields
- **Background Processing**: Use Celery for intensive calculations

## 🚨 Troubleshooting

### Common Issues

#### 1. Import Errors
```bash
# Ensure all packages are installed
pip install -r requirements.txt

# Check Python path
export PYTHONPATH="${PYTHONPATH}:/path/to/project/backend"
```

#### 2. Migration Issues
```bash
# Reset migrations if needed
python manage.py migrate testsengine zero
python manage.py migrate testsengine
```

#### 3. Frontend API Errors
```javascript
// Check API endpoint availability
fetch('/api/scores/health/')
    .then(response => console.log('API Status:', response.status))
    .catch(error => console.error('API Error:', error));
```

## 📝 Data Migration

### Question Data Format
```json
{
    "id": "sjt_001",
    "scenario": "Team situation description",
    "question": "What would you do?",
    "options": [
        {"id": "A", "text": "Option A"},
        {"id": "B", "text": "Option B"}
    ],
    "correct_answer": "B",
    "category": "teamwork",
    "difficulty": "medium",
    "competency": "teamwork"
}
```

### Migration Command
```bash
python manage.py migrate_and_score --data-dir=questions/ --recalculate-scores
```

## 🔮 Future Enhancements

### Planned Features
- **Adaptive Testing**: Dynamic question selection based on performance
- **Machine Learning**: AI-powered difficulty adjustment
- **Real-time Analytics**: Live performance tracking
- **Advanced Reporting**: PDF report generation
- **Mobile Optimization**: Enhanced mobile scoring interface

### API Extensions
- **Bulk Score Calculation**: Process multiple sessions
- **Historical Trends**: Performance tracking over time
- **Comparative Analytics**: Team and organizational benchmarks

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Add scoring tests
4. Submit pull request

### Code Standards
- Follow PEP 8 for Python code
- Use ESLint for JavaScript/React
- Add comprehensive test coverage
- Document new scoring algorithms

## 📚 Additional Resources

- [Django REST Framework Documentation](https://www.django-rest-framework.org/)
- [React Charts with Recharts](https://recharts.org/)
- [Item Response Theory Guide](https://en.wikipedia.org/wiki/Item_response_theory)
- [Competency-Based Assessment](https://www.competencyworks.org/)

---

For questions or support, please refer to the project documentation or create an issue in the repository.
