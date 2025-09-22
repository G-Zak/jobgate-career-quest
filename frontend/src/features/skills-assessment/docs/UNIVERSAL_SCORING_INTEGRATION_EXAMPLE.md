# Universal Scoring Integration Example

This document shows how to integrate the universal scoring system into any test component.

## Quick Integration Guide

### 1. Import the Hook

```jsx
import { useUniversalScoring } from '../hooks/useUniversalScoring';
```

### 2. Add the Hook to Your Component

```jsx
const YourTestComponent = ({ onBackToDashboard, testId }) => {
  // ... existing state ...

  // Universal scoring hook
  const allQuestions = testData?.sections?.flatMap(section => section.questions) || [];
  const {
    scoringSystem,
    isInitialized: scoringInitialized,
    startQuestion,
    recordAnswer,
    getFormattedResults,
    getScoreBreakdown,
    getQuestionTimings,
    completeTest,
    getTestResultsForSubmission
  } = useUniversalScoring('your-test-type', allQuestions, testData?.scoringConfig, {
    enableConsoleLogging: true,
    logPrefix: '🧠', // Custom prefix for your test type
    autoStartTest: false
  });

  // ... rest of your component
};
```

### 3. Start Test When Ready

```jsx
// Start test when scoring system is ready
useEffect(() => {
  if (scoringSystem && scoringInitialized && testData) {
    console.log('🧠 Starting your test with universal scoring');
    scoringSystem.startTest();
  }
}, [scoringSystem, scoringInitialized, testData]);
```

### 4. Start Question Timer

```jsx
// Start question timer when question changes
useEffect(() => {
  if (currentQuestionData && scoringSystem) {
    startQuestion(currentQuestionData.question_id);
  }
}, [currentQuestion, currentQuestionData, scoringSystem, startQuestion]);
```

### 5. Record Answers

```jsx
// Handle answer selection
const handleAnswerSelect = (questionId, answer) => {
  // Find the question to get the correct answer
  const question = currentSectionData?.questions?.find(q => q.question_id === questionId);
  const isCorrect = question ? question.correct_answer === answer : false;

  // Record answer in universal scoring system
  recordAnswer(questionId, answer);

  setAnswers(prev => ({
    ...prev,
    [questionId]: {
      answer,
      isCorrect,
      timestamp: new Date().toISOString()
    }
  }));
};
```

### 6. Complete Test

```jsx
// Handle test completion
const handleTestComplete = async () => {
  try {
    const endTime = new Date();
    const duration = Math.floor((endTime - startedAt) / 1000);

    // Console logging for backend scoring verification
    console.group('✅ Test Complete - Backend Scoring Verification');
    console.log('🕐 End Time:', endTime);
    console.log('⏱️ Duration:', duration, 'seconds');
    console.log('📊 Final Answers:', answers);
    console.log('⚙️ Scoring System Available:', !!scoringSystem);

    // Get results from universal scoring system
    let universalResults = null;
    if (scoringSystem) {
      universalResults = getFormattedResults();
      console.log('🎯 Universal Results:', universalResults);
      console.log('📈 Score Breakdown:', getScoreBreakdown());
      console.log('⏱️ Question Timings:', getQuestionTimings());
    }

    // Complete the test in universal scoring system
    if (scoringSystem) {
      completeTest();
    }

    // Calculate score
    const totalQuestions = rule?.totalQuestions || 20;
    const correctAnswers = Object.values(answers).filter(answer => answer.isCorrect).length;
    const score = universalResults ? universalResults.percentage : (totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0);

    console.log('📊 Final Score Calculation:', {
      totalQuestions,
      correctAnswers,
      score,
      universalScoring: !!universalResults
    });

    // Build attempt record
    const attempt = buildAttempt(testId, totalQuestions, correctAnswers, startedAtRef.current, 'user');
    addAttempt(attempt);

    const testResults = {
      testId: testId,
      testType: 'your-test-type',
      score: score,
      totalQuestions: totalQuestions,
      correctAnswers: correctAnswers,
      duration: duration,
      answers: answers,
      completedAt: endTime.toISOString(),
      startedAt: startedAt?.toISOString(),
      attempt: attempt,
      // Include universal scoring results if available
      universalResults: universalResults,
      scoringSystem: scoringSystem
    };

    console.log('📋 Final Test Results:', testResults);

    // Submit to backend
    try {
      console.log('🚀 Submitting to backend...');
      await submitTestAttempt(testResults);
      console.log('✅ Backend submission successful');
    } catch (error) {
      console.error('❌ Error submitting test attempt:', error);
    }

    console.groupEnd();

    setResults(testResults);
    setTestStep('results');
  } catch (error) {
    console.error('Error completing test:', error);
  }
};
```

### 7. Show Results with Universal Scoring

```jsx
// Show results page
if (testStep === 'results') {
  return (
    <TestResultsPage
      testResults={results}
      results={results?.universalResults || results}
      testType="your-test-type"
      testId={testId}
      answers={answers}
      testData={testData}
      onBackToDashboard={onBackToDashboard}
      onRetakeTest={() => {
        setTestStep('test');
        setCurrentSection(1);
        setCurrentQuestion(1);
        setAnswers({});
        setTimeRemaining(10 * 60);
        setResults(null);
        setStartedAt(new Date());
      }}
      showUniversalResults={!!results?.universalResults}
      scoringSystem={scoringSystem}
    />
  );
}
```

## Test Type Prefixes

Use these prefixes for different test types:

- `🔢` - Numerical Reasoning
- `🧠` - Logical Reasoning  
- `📝` - Verbal Reasoning
- `🎨` - Abstract Reasoning
- `📊` - Diagrammatic Reasoning
- `🌐` - Spatial Reasoning
- `⚖️` - Situational Judgment
- `⚙️` - Technical Assessment

## Console Logging

The universal scoring system provides comprehensive console logging for backend verification:

- **Test Start**: When the test begins
- **Question Start**: When each question timer starts
- **Answer Recording**: When answers are recorded with timing
- **Score Calculation**: Detailed breakdown of scoring
- **Test Completion**: Final results and submission status
- **Backend Submission**: Success/failure of backend calls

## Benefits

1. **Consistent UI**: All tests use the same TestResultsPage with universal scoring details
2. **Console Logging**: Comprehensive logging for backend verification
3. **Easy Integration**: Simple hook-based integration
4. **Advanced Analytics**: Difficulty breakdown, time efficiency, performance levels
5. **Backend Ready**: All data needed for backend submission included

## Example Test Types

- `numerical` - Numerical reasoning tests
- `logical` - Logical reasoning tests
- `verbal` - Verbal reasoning tests
- `abstract` - Abstract reasoning tests
- `diagrammatic` - Diagrammatic reasoning tests
- `spatial` - Spatial reasoning tests
- `situational` - Situational judgment tests
- `technical` - Technical assessment tests
