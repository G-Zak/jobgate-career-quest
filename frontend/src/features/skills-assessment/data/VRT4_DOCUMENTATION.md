# VRT4 - Verbal Analogies Test Documentation

## Overview
VRT4 is a comprehensive verbal analogies test that uses advanced randomization to prevent cheating while maintaining consistent difficulty and type distribution.

## Test Specifications

### Basic Parameters
- **Total Questions**: 30
- **Time Limit**: 25 minutes (~50 seconds per question)
- **Test ID**: VRT4
- **Category**: Verbal Analogies

### Difficulty Distribution
- **Easy**: 12 questions (40%)
- **Medium**: 12 questions (40%)
- **Hard**: 6 questions (20%)

### Question Type Distribution

| Type | Count | Easy | Medium | Hard | Description |
|------|-------|------|--------|------|-------------|
| Completing Pair | 4 | 2 | 1 | 1 | Classic "A : B :: C : ?" format |
| Simple Analogy | 4 | 2 | 2 | 0 | Direct relationship matching |
| Choose Pair | 4 | 1 | 2 | 1 | Select most analogous pair |
| Double Analogy | 3 | 1 | 1 | 1 | Two simultaneous analogies |
| Similar Word | 3 | 1 | 1 | 1 | Synonyms/antonyms |
| Detecting Analogy | 3 | 1 | 2 | 0 | Find matching relationships |
| Three Word | 3 | 1 | 1 | 1 | Sequential analogies |
| Number Analogy | 3 | 1 | 2 | 0 | Mathematical patterns |
| Alphabet Analogy | 3 | 1 | 1 | 1 | Letter sequence patterns |

## Anti-Cheating Features

### Randomization Strategy
1. **Question Pool**: 72+ questions across all types and difficulties
2. **Random Selection**: Each test selects exactly 30 questions per specification
3. **Type Distribution**: Maintains exact count per type while randomizing specific questions
4. **Difficulty Balance**: Preserves 40/40/20 easy/medium/hard ratio
5. **Final Shuffle**: Questions are shuffled after selection to mix types

### Security Measures
- Different question sets for each test attempt
- Maintains consistent difficulty curve
- Prevents memorization of specific question sequences
- Large enough pool to ensure variety over multiple attempts

## Question Types Explained

### 1. Completing Pair (TYPE1)
**Format**: "A : B :: C : ___"
**Example**: "Author : Book :: Composer : ___"
**Answer**: "Score"

### 2. Simple Analogy (TYPE2)
**Format**: "A : B :: C : ___"
**Example**: "Mild : Gentle :: Fierce : ___"
**Answer**: "Intense"

### 3. Choose Pair (TYPE3)
**Format**: Choose the pair most analogous to given pair
**Example**: "Choose the pair most analogous to 'Painter : Easel'"
**Answer**: "Baker : Oven"

### 4. Double Analogy (TYPE4)
**Format**: Solve two related analogies simultaneously
**Example**: "Hand : Glove :: Foot : ___ ; Bird : Air :: Fish : ___"
**Answer**: "Shoe; Water"

### 5. Similar Word (TYPE5)
**Format**: Find synonyms or antonyms
**Example**: "Choose the word most similar to 'Fragile'"
**Answer**: "Delicate"

### 6. Detecting Analogy (TYPE6)
**Format**: Identify pairs with same relationship
**Example**: "Which option contains pairs sharing the same relationship?"
**Answer**: "Puppy:Dog, Kitten:Cat" (young:adult)

### 7. Three Word (TYPE7)
**Format**: Complete three-term sequence
**Example**: "Morning : Afternoon : Evening :: Seed : Sprout : ___"
**Answer**: "Plant"

### 8. Number Analogy (TYPE8)
**Format**: Mathematical pattern recognition
**Example**: "2 : 4 :: 3 : ___"
**Answer**: "6" (multiply by 2)

### 9. Alphabet Analogy (TYPE9)
**Format**: Letter pattern recognition
**Example**: "C : F :: M : ___"
**Answer**: "P" (shift +3 letters)

## Technical Implementation

### File Structure
```
verbalAnalogiesVRT4.js          # Main VRT4 implementation
verbal_analogy_dataset.jsonl    # Question database (72+ questions)
verbalReasoningCategories.js    # Category definitions
verbalReasoningTestManager.js   # Test management system
```

### Integration Points
- **Component**: VerbalReasoningTest.jsx handles VRT4 via testId='VRT4'
- **Routing**: Accessible as VRT4, '4', or 4
- **Category**: "verbalAnalogies" -> "comprehensive" level

### Data Format
Questions follow standardized format:
```javascript
{
  id: 1,
  question_text: "Author : Book :: Composer : ____",
  options: ["Piano", "Score", "Concert", "Orchestra", "Studio"],
  correct_answer: "Score",
  explanation: "An author produces a book. Similarly, a composer produces a musical score.",
  type: "completing_pair",
  difficulty: "easy",
  relationship: "producer:product"
}
```

## Usage Examples

### Access VRT4
```javascript
// Via component
<VerbalReasoningTest testId="VRT4" />

// Via test manager
const test = testManager.generateTestByLegacyId('VRT4');
```

### Statistics
```javascript
import { getAnalogiesDatasetStats } from './verbalAnalogiesVRT4';
const stats = getAnalogiesDatasetStats();
```

## Future Enhancements

### Potential Additions
1. **Adaptive Difficulty**: Adjust question difficulty based on performance
2. **More Question Types**: Add new analogy formats
3. **Expanded Pool**: Add more questions to increase randomization
4. **Performance Analytics**: Track question performance for optimization
5. **Multilingual Support**: Add translated versions

### Maintenance
- Monitor question pool balance
- Update question difficulties based on performance data
- Add new questions to maintain randomization effectiveness
- Review and improve question quality based on user feedback
