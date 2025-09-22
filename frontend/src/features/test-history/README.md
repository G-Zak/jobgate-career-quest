# Test History System

A comprehensive test history tracking system that records user test sessions, scores, and detailed performance analytics.

## 🎯 Features

- **Test Session Tracking**: Record when users start and complete tests
- **Detailed Answer Storage**: Store individual question answers and correctness
- **Performance Analytics**: Track scores, time spent, and improvement trends
- **Category Statistics**: Analyze performance by test type
- **Visual Charts**: Display performance trends and category breakdowns
- **Session Management**: View, delete, and analyze past test sessions

## 📁 File Structure

```
frontend/src/features/test-history/
├── components/
│   ├── TestHistoryDashboard.jsx      # Main dashboard component
│   ├── TestHistoryList.jsx           # List view of test sessions
│   ├── TestHistoryCharts.jsx         # Analytics and charts
│   └── TestSessionDetail.jsx         # Detailed session view
├── services/
│   ├── testHistoryApi.js             # API service for backend communication
│   └── testHistoryIntegration.js     # Integration with existing test system
├── hooks/
│   └── useTestHistory.js             # Custom React hook
├── integration/
│   └── TestSubmissionIntegration.jsx # HOC and integration utilities
├── examples/
│   └── TestHistoryExample.jsx        # Usage examples
└── README.md                         # This file
```

## 🚀 Quick Start

### 1. Basic Usage

```jsx
import TestHistoryDashboard from './features/test-history/components/TestHistoryDashboard';

function App() {
  return (
    <div>
      <TestHistoryDashboard />
    </div>
  );
}
```

### 2. Integration with Existing Tests

```jsx
import { withTestHistory } from './features/test-history/integration/TestSubmissionIntegration';

const MyTestComponent = ({ onSubmitTest, testSession }) => {
  const handleSubmit = async (testData) => {
    // Your existing test submission logic
    const result = await onSubmitTest(testData);
    
    // Test history is automatically saved
    console.log('Test submitted with history:', result);
    
    return result;
  };

  return (
    <div>
      {/* Your test UI */}
    </div>
  );
};

export default withTestHistory(MyTestComponent);
```

### 3. Using the Hook

```jsx
import { useTestHistoryIntegration } from './features/test-history/integration/TestSubmissionIntegration';

const MyTestComponent = ({ testId }) => {
  const { testSession, loading, submitTestWithHistory } = useTestHistoryIntegration(testId);

  const handleSubmit = async (testData) => {
    try {
      const result = await submitTestWithHistory(testData);
      console.log('Test submitted with history:', result);
    } catch (error) {
      console.error('Submission failed:', error);
    }
  };

  return (
    <div>
      {loading ? 'Loading...' : 'Test ready'}
      {/* Your test UI */}
    </div>
  );
};
```

## 🔧 API Reference

### Backend Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/test-sessions/` | List all test sessions for user |
| POST | `/api/test-sessions/` | Create new test session |
| GET | `/api/test-sessions/{id}/detail/` | Get detailed session info |
| DELETE | `/api/test-sessions/{id}/delete/` | Delete test session |
| POST | `/api/test-sessions/submit/` | Submit completed test |
| GET | `/api/test-history/summary/` | Get performance summary |
| GET | `/api/test-history/category-stats/` | Get category statistics |
| GET | `/api/test-history/charts/` | Get chart data |

### Frontend Services

#### testHistoryApi

```javascript
// Get all test sessions
const sessions = await testHistoryApi.getTestSessions();

// Create new session
const session = await testHistoryApi.createTestSession(testId);

// Submit test results
const result = await testHistoryApi.submitTestSession(sessionData);

// Get performance summary
const summary = await testHistoryApi.getTestHistorySummary();
```

#### testHistoryIntegration

```javascript
// Start test session
const session = await testHistoryIntegration.startTestSession(testId);

// Submit test results
const result = await testHistoryIntegration.submitTestResults(
  testId,
  answers,
  score,
  duration,
  detailedAnswers
);

// Check if user completed test
const hasCompleted = await testHistoryIntegration.hasCompletedTest(testId);

// Get best score for test
const bestScore = await testHistoryIntegration.getBestScoreForTest(testId);
```

## 📊 Database Schema

### TestSession Model

```python
class TestSession(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    test = models.ForeignKey(Test, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(null=True, blank=True)
    score = models.IntegerField(null=True, blank=True)  # Percentage
    answers = models.JSONField(default=dict)
    time_spent = models.IntegerField(default=0)  # Seconds
```

### TestAnswer Model

```python
class TestAnswer(models.Model):
    session = models.ForeignKey(TestSession, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    selected_answer = models.CharField(max_length=10)
    is_correct = models.BooleanField()
    time_taken = models.IntegerField(default=0)  # Seconds
    answered_at = models.DateTimeField(auto_now_add=True)
```

## 🎨 Components

### TestHistoryDashboard

Main dashboard component with tabs for overview, sessions list, and analytics.

**Props:**
- None (loads data automatically)

**Features:**
- Performance summary cards
- Recent test sessions
- Category performance breakdown
- Navigation between different views

### TestHistoryList

Displays a list of test sessions with filtering and sorting options.

**Props:**
- `sessions` - Array of test session objects
- `onSessionClick` - Function to handle session selection
- `onDeleteSession` - Function to handle session deletion
- `filterType` - Current filter type
- `setFilterType` - Function to update filter
- `sortBy` - Current sort option
- `setSortBy` - Function to update sort

### TestHistoryCharts

Displays performance analytics and charts.

**Props:**
- `chartData` - Chart data from API
- `categoryStats` - Category statistics

### TestSessionDetail

Shows detailed information about a specific test session.

**Props:**
- `session` - Test session object
- `onBack` - Function to go back to list

## 🔄 Integration Examples

### 1. With Existing Test Components

```jsx
import { TestSubmissionIntegration } from './features/test-history/integration/TestSubmissionIntegration';

const MyTestPage = () => {
  const handleSubmitTest = async (testData) => {
    // Your existing submission logic
    return await submitToBackend(testData);
  };

  return (
    <TestSubmissionIntegration 
      testId={1} 
      testType="verbal_reasoning"
      onSubmitTest={handleSubmitTest}
    >
      <YourTestComponent />
    </TestSubmissionIntegration>
  );
};
```

### 2. With Higher-Order Component

```jsx
import { withTestHistory } from './features/test-history/integration/TestSubmissionIntegration';

const MyTestComponent = ({ testId, onSubmitTest, testSession }) => {
  // Your component logic
  return <div>Test UI</div>;
};

export default withTestHistory(MyTestComponent);
```

### 3. Manual Integration

```jsx
import testHistoryIntegration from './features/test-history/services/testHistoryIntegration';

const MyTestComponent = ({ testId }) => {
  useEffect(() => {
    // Start session when test begins
    testHistoryIntegration.startTestSession(testId);
  }, [testId]);

  const handleSubmit = async (testData) => {
    // Submit to your existing system
    const result = await submitToYourBackend(testData);
    
    // Also save to test history
    await testHistoryIntegration.submitTestResults(
      testId,
      testData.answers,
      testData.score,
      testData.duration,
      testData.detailedAnswers
    );
    
    return result;
  };

  return <div>Test UI</div>;
};
```

## 🎯 Best Practices

1. **Always start a test session** when a user begins a test
2. **Submit detailed answers** including question IDs, selected answers, and timing
3. **Handle errors gracefully** - test history should not break the main test flow
4. **Use the integration utilities** for consistent behavior across tests
5. **Store comprehensive metadata** for better analytics

## 🐛 Troubleshooting

### Common Issues

1. **Test history not saving**
   - Check if test session was created successfully
   - Verify API endpoints are accessible
   - Check browser console for errors

2. **Performance data not loading**
   - Ensure user has completed tests
   - Check if backend is returning data
   - Verify API authentication

3. **Charts not displaying**
   - Check if chart data is properly formatted
   - Ensure sufficient data points exist
   - Verify chart component props

### Debug Mode

Enable debug logging by setting:

```javascript
localStorage.setItem('testHistoryDebug', 'true');
```

This will log detailed information about test history operations to the console.

## 📈 Future Enhancements

- [ ] Real-time performance tracking
- [ ] Advanced analytics and insights
- [ ] Performance comparison with other users
- [ ] Automated recommendations based on performance
- [ ] Export functionality for test results
- [ ] Mobile-optimized charts and visualizations

## 🤝 Contributing

When adding new features to the test history system:

1. Update the API service if new endpoints are needed
2. Add proper error handling and loading states
3. Include comprehensive documentation
4. Add examples for new functionality
5. Test integration with existing test components

## 📝 License

This test history system is part of the JobGate Career Quest project and follows the same licensing terms.
