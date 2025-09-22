# Universal Test Scoring System Guide

## Overview

The Universal Test Scoring System is a comprehensive, scalable scoring framework designed for all test types in the JobGate Career Quest platform. It calculates scores based on three key factors: **accuracy**, **difficulty**, and **time efficiency**.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Question Structure](#question-structure)
3. [Scoring Configuration](#scoring-configuration)
4. [Scoring Algorithm](#scoring-algorithm)
5. [Usage Examples](#usage-examples)
6. [API Reference](#api-reference)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)

## Quick Start

### Basic Usage

```javascript
import { calculateScore, DEFAULT_SCORING_CONFIG } from '../lib/scoringSystem.js';

// Example question with scoring weights
const question = {
  id: "logical_1_1",
  type: "multiple_choice",
  question: "Look at this series: 2, 4, 6, 8, 10, ... What number should come next?",
  options: ["11", "12", "13", "14"],
  correct_answer: "b",
  difficulty: 2,
  section: 1,
  scoreWeight: {
    base: 5,
    difficultyBonus: 2,
    timeFactor: 1
  }
};

// Calculate score for a correct answer in 20 seconds
const score = calculateScore(question, "b", 20, DEFAULT_SCORING_CONFIG);
console.log(score); // Returns calculated score as integer
```

### Test Configuration

```javascript
// Global test configuration
const testConfig = {
  title: "Logical Reasoning Test",
  scoringConfig: {
    timeWeight: 0.3,        // 30% weight for time efficiency
    difficultyWeight: 0.5,  // 50% weight for difficulty
    accuracyWeight: 0.2     // 20% weight for accuracy
  },
  questions: [/* array of questions */]
};
```

## Question Structure

### Required Fields

```javascript
const question = {
  id: "unique_question_id",           // Required: Unique identifier
  type: "multiple_choice",            // Required: Question type
  question: "Question text...",       // Required: Question content
  options: ["A", "B", "C", "D"],     // Required: Answer options
  correct_answer: "b",                // Required: Correct answer key
  difficulty: 2,                      // Required: Difficulty level (1-5)
  section: 1,                         // Required: Section number
  scoreWeight: {                      // Required: Scoring configuration
    base: 5,                          // Base score for correct answer
    difficultyBonus: 2,               // Difficulty bonus multiplier
    timeFactor: 1                     // Time efficiency factor
  }
};
```

### Difficulty Levels

| Level | Description | Multiplier | Typical Time Range |
|-------|-------------|------------|-------------------|
| 1 | Easy | 0.8x | 10-30 seconds |
| 2 | Medium | 1.0x | 20-60 seconds |
| 3 | Hard | 1.2x | 30-90 seconds |
| 4 | Very Hard | 1.5x | 45-120 seconds |
| 5 | Expert | 2.0x | 60-180 seconds |

## Scoring Configuration

### Global Configuration

The global scoring configuration determines how much weight each factor has in the final score:

```javascript
const scoringConfig = {
  timeWeight: 0.3,        // Time efficiency weight (0-1)
  difficultyWeight: 0.5,  // Difficulty weight (0-1)
  accuracyWeight: 0.2     // Accuracy weight (0-1)
};
```

**Note**: The weights should sum to approximately 1.0 for balanced scoring.

### Preset Configurations

The system includes several preset configurations:

```javascript
import { getScoringPreset } from '../lib/scoringSystem.js';

// Available presets:
const standard = getScoringPreset('STANDARD');        // Balanced approach
const speedFocused = getScoringPreset('SPEED_FOCUSED'); // Emphasizes quick thinking
const accuracyFocused = getScoringPreset('ACCURACY_FOCUSED'); // Emphasizes correctness
const difficultyFocused = getScoringPreset('DIFFICULTY_FOCUSED'); // Emphasizes challenging questions
```

## Scoring Algorithm

### Step-by-Step Process

1. **Check Answer Correctness**
   - If wrong answer → return 0
   - If correct answer → continue to scoring

2. **Calculate Base Score**
   - Start with `question.scoreWeight.base`

3. **Add Difficulty Bonus**
   - Formula: `difficulty × difficultyBonus × difficultyWeight × difficultyMultiplier`
   - Difficulty multiplier increases with difficulty level

4. **Apply Time Efficiency Factor**
   - Faster answers get higher time bonuses
   - Time thresholds adjust based on question difficulty

5. **Apply Accuracy Weight**
   - Multiply preliminary score by `accuracyWeight`

6. **Return Final Score**
   - Round to nearest integer
   - Ensure score is non-negative

### Time Efficiency Calculation

Time efficiency is calculated based on adjusted thresholds:

```javascript
// Example for difficulty 2 question:
const thresholds = {
  EXCELLENT: 15 * 1.2,  // 18 seconds
  GOOD: 30 * 1.3,       // 39 seconds
  AVERAGE: 60 * 1.4,    // 84 seconds
  SLOW: 120 * 1.5       // 180 seconds
};
```

### Score Calculation Formula

```
Final Score = round(
  (baseScore + difficultyScore + timeBonus) × accuracyWeight
)

Where:
- baseScore = question.scoreWeight.base
- difficultyScore = difficulty × difficultyBonus × difficultyWeight × difficultyMultiplier
- timeBonus = timeEfficiency × timeWeight
- timeEfficiency = calculated based on time taken and difficulty
```

## Usage Examples

### Example 1: Basic Score Calculation

```javascript
import { calculateScore, DEFAULT_SCORING_CONFIG } from '../lib/scoringSystem.js';

const question = {
  id: "logical_1_1",
  type: "multiple_choice",
  question: "What comes next: 2, 4, 6, 8, ...?",
  options: ["10", "12", "14", "16"],
  correct_answer: "a",
  difficulty: 1,
  section: 1,
  scoreWeight: { base: 5, difficultyBonus: 2, timeFactor: 1 }
};

// Correct answer in 15 seconds
const score = calculateScore(question, "a", 15, DEFAULT_SCORING_CONFIG);
// Result: 2 (rounded from calculation)
```

### Example 2: Wrong Answer

```javascript
// Wrong answer - always returns 0
const score = calculateScore(question, "b", 5, DEFAULT_SCORING_CONFIG);
// Result: 0
```

### Example 3: Complete Test Scoring

```javascript
import { calculateTotalScore } from '../lib/scoringSystem.js';

const testResults = [
  { question: question1, userAnswer: "a", timeTaken: 15, score: 0 },
  { question: question2, userAnswer: "c", timeTaken: 45, score: 0 },
  { question: question3, userAnswer: "b", timeTaken: 30, score: 0 }
];

// Calculate individual scores
const resultsWithScores = testResults.map(result => ({
  ...result,
  score: calculateScore(result.question, result.userAnswer, result.timeTaken)
}));

// Calculate total test score
const totalScore = calculateTotalScore(resultsWithScores);
console.log(totalScore);
// Output: { totalScore: 6, maxPossibleScore: 12, percentage: 50, ... }
```

### Example 4: Different Configurations

```javascript
import { SCORING_PRESETS } from '../lib/scoringSystem.js';

const question = { /* ... */ };
const userAnswer = "a";
const timeTaken = 30;

// Compare different configurations
const standardScore = calculateScore(question, userAnswer, timeTaken, SCORING_PRESETS.STANDARD);
const speedScore = calculateScore(question, userAnswer, timeTaken, SCORING_PRESETS.SPEED_FOCUSED);
const accuracyScore = calculateScore(question, userAnswer, timeTaken, SCORING_PRESETS.ACCURACY_FOCUSED);

console.log({ standardScore, speedScore, accuracyScore });
```

## API Reference

### Core Functions

#### `calculateScore(question, userAnswer, timeTaken, globalConfig)`

Calculates the score for a single question.

**Parameters:**
- `question` (Object): Question object with scoring weights
- `userAnswer` (string): User's selected answer
- `timeTaken` (number): Time taken in seconds
- `globalConfig` (Object): Global scoring configuration (optional)

**Returns:** `number` - Calculated score as rounded integer

#### `calculateTotalScore(questionResults, globalConfig)`

Calculates total score for a complete test.

**Parameters:**
- `questionResults` (Array): Array of question results with scores
- `globalConfig` (Object): Global scoring configuration (optional)

**Returns:** `Object` - Total score breakdown

#### `enhanceQuestionsWithScoring(questions, defaultScoreWeight)`

Adds scoring weights to question objects.

**Parameters:**
- `questions` (Array): Array of question objects
- `defaultScoreWeight` (Object): Default scoring weights (optional)

**Returns:** `Array` - Enhanced questions with scoring weights

### Utility Functions

#### `calculateTimeEfficiency(timeTaken, difficulty)`

Calculates time efficiency factor.

#### `validateScoringConfig(config)`

Validates scoring configuration.

#### `debugScoreCalculation(question, userAnswer, timeTaken, globalConfig)`

Logs detailed scoring breakdown for debugging.

### Constants

#### `DEFAULT_SCORING_CONFIG`
Default global scoring configuration.

#### `DEFAULT_SCORE_WEIGHT`
Default question scoring weights.

#### `SCORING_PRESETS`
Predefined scoring configurations.

#### `TIME_THRESHOLDS`
Time efficiency thresholds.

#### `DIFFICULTY_MULTIPLIERS`
Difficulty level multipliers.

## Best Practices

### 1. Question Design

- **Set appropriate difficulty levels**: Use 1-5 scale consistently
- **Provide meaningful scoreWeight**: Adjust base, difficultyBonus, and timeFactor based on question complexity
- **Use descriptive IDs**: Make question IDs meaningful and unique

### 2. Configuration Management

- **Validate configurations**: Use `validateScoringConfig()` to ensure weights sum to 1.0
- **Choose appropriate presets**: Select preset configurations that match your test goals
- **Document custom configs**: Document any custom scoring configurations

### 3. Performance Optimization

- **Batch processing**: Use `enhanceQuestionsWithScoring()` for multiple questions
- **Cache calculations**: Store calculated scores to avoid recalculation
- **Use appropriate data structures**: Keep question objects lightweight

### 4. Testing and Validation

- **Test edge cases**: Test with very fast/slow times, different difficulties
- **Validate scores**: Ensure scores make sense for your use case
- **Debug when needed**: Use `debugScoreCalculation()` for troubleshooting

## Troubleshooting

### Common Issues

#### 1. Scores Always Return 0

**Cause**: Wrong answer provided
**Solution**: Verify the `userAnswer` matches one of the options and check `correct_answer`

#### 2. Unexpected Low Scores

**Cause**: Very slow time or low difficulty weight
**Solution**: Check time taken and adjust global configuration weights

#### 3. Import Errors

**Cause**: Incorrect import path
**Solution**: Verify the relative path to `scoringSystem.js`

#### 4. Configuration Validation Fails

**Cause**: Weights don't sum to 1.0
**Solution**: Adjust weights or use preset configurations

### Debug Tips

```javascript
// Use debug function to see detailed calculation
import { debugScoreCalculation } from '../lib/scoringSystem.js';

debugScoreCalculation(question, userAnswer, timeTaken, globalConfig);

// Validate configuration
import { validateScoringConfig } from '../lib/scoringSystem.js';

const validation = validateScoringConfig(myConfig);
if (!validation.isValid) {
  console.warn(validation.suggestion);
}
```

### Performance Considerations

- **Large test sets**: For tests with 100+ questions, consider calculating scores in batches
- **Real-time scoring**: Cache intermediate calculations for live scoring updates
- **Memory usage**: Avoid storing large arrays of detailed score breakdowns unless needed

## Integration Guide

### With React Components

```javascript
import React, { useState, useEffect } from 'react';
import { calculateScore, calculateTotalScore } from '../lib/scoringSystem.js';

function TestComponent({ questions, scoringConfig }) {
  const [results, setResults] = useState([]);
  
  const handleAnswer = (questionId, answer, timeTaken) => {
    const question = questions.find(q => q.id === questionId);
    const score = calculateScore(question, answer, timeTaken, scoringConfig);
    
    setResults(prev => [...prev, {
      questionId,
      score,
      timeTaken
    }]);
  };
  
  const getTotalScore = () => {
    return calculateTotalScore(results, scoringConfig);
  };
  
  // Component implementation...
}
```

### With Test Data

```javascript
import { enhanceQuestionsWithScoring } from '../lib/scoringSystem.js';

// Enhance existing questions with scoring weights
const enhancedQuestions = enhanceQuestionsWithScoring(rawQuestions, {
  base: 5,
  difficultyBonus: 2,
  timeFactor: 1
});
```

## Conclusion

The Universal Test Scoring System provides a flexible, comprehensive framework for scoring tests across the JobGate Career Quest platform. By following this guide and using the provided examples, you can implement sophisticated scoring logic that rewards accuracy, difficulty, and time efficiency appropriately.

For additional support or feature requests, please refer to the project documentation or contact the development team.

