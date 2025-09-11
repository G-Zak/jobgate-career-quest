# Comprehensive Scoring & Recommendation System

## Overview
This system provides end-to-end scoring, attempt persistence, and intelligent job recommendations based on test performance.

## Architecture

### 1. Scoring System (`lib/scoreUtils.ts`)
- **`computePercentage(correct, total)`**: Calculates percentage score
- **`buildAttempt(testId, total, correct, startedAt, reason)`**: Creates standardized attempt records
- **`Attempt` type**: Standardized attempt data structure

### 2. Attempt Storage (`store/useAttempts.ts`)
- **Zustand store** with persistence
- **`addAttempt(attempt)`**: Store new attempts
- **`getAttemptsForTest(testId)`**: Retrieve attempts by test
- **`hydrate(list)`**: Load attempts from external source
- **`clearAttempts()`**: Reset all attempts

### 3. User Skill Profile (`skills.ts`)
- **`buildUserSkillVector(attempts)`**: Creates skill vector from test attempts
- **Test-to-skill mapping**: Maps test types to relevant skills
- **Recency weighting**: Recent tests have higher impact (6-month half-life)
- **`getTopSkills(userVec, limit)`**: Get top skills by score
- **`getSkillLevel(score)`**: Convert score to skill level

### 4. Jobs Data (`jobsApi.ts` + `public/mocks/jobs_ma.json`)
- **Mock Moroccan job offers** with realistic data
- **Broken/missing salaries** for testing normalization
- **Backend API fallback** for production use
- **Job filtering** by location, remote, seniority

### 5. Salary Normalization (`salary.ts`)
- **`normalizeMAD(input)`**: Handles various salary formats
- **Supports**: "12k-18k MAD", "MAD 9000", null, "—", ranges
- **`formatMAD(amount)`**: Format amounts for display
- **`getSalaryRange(min, max)`**: Create readable salary ranges

### 6. Recommendation Engine (`engine.ts`)
- **`cosine(a, b)`**: Calculate skill similarity
- **`jobToVec(job)`**: Convert job to skill vector
- **`scoreJob(userVec, job, profile)`**: Calculate match score
- **`recommend(userVec, jobs, profile, topK)`**: Get top recommendations
- **Multi-factor scoring**: Skills (60%), Salary (15%), Location (10%), Seniority (10%)

### 7. Recommendations Hook (`useRecommendations.ts`)
- **`useRecommendations(profile, topK)`**: Main hook for getting recommendations
- **`useUserProfile()`**: Get user preferences
- **`getRecommendations(profile, topK)`**: Async function for recommendations
- **Loading states** and error handling

## Test Integration

### Updated Test Runners
All test runners now include:
- **`startedAtRef`**: Track test start time
- **`addAttempt`**: Store attempts in Zustand store
- **`buildAttempt`**: Create standardized attempt records
- **Timer expiry handling**: Save attempts when time runs out
- **Results navigation**: Navigate to results page with attempt data

### Scoring Contract
Every test now:
1. **Tracks start time** with `useRef(Date.now())`
2. **Calculates correct/total/percentage** on completion
3. **Builds attempt record** with `buildAttempt()`
4. **Stores attempt** with `addAttempt()`
5. **Navigates to results** with attempt data

## Job Recommendations

### Features
- **Intelligent matching** based on test performance
- **Multi-factor scoring** considering skills, salary, location, seniority
- **Mock data support** with realistic Moroccan job offers
- **Salary normalization** handling various formats
- **Skill-based recommendations** from test attempts
- **Loading states** and error handling
- **Empty states** with helpful messages

### User Experience
- **Personalized recommendations** based on actual test performance
- **Match explanations** showing why jobs are recommended
- **Skill tags** showing relevant skills for each job
- **Salary ranges** with proper formatting
- **Remote work indicators**
- **Company logos** and job details

## Data Flow

```
Test Completion → buildAttempt() → addAttempt() → buildUserSkillVector() → recommend() → UI
```

1. **User completes test**
2. **Test calculates score** (correct/total/percentage)
3. **Attempt record created** with standardized format
4. **Attempt stored** in Zustand store with persistence
5. **Skill vector built** from all attempts
6. **Jobs fetched** from API or mock data
7. **Recommendations calculated** using cosine similarity
8. **UI displays** personalized job recommendations

## Mock Data

### Job Offers (`public/mocks/jobs_ma.json`)
- **12 realistic job offers** from Moroccan companies
- **Various salary formats** for testing normalization
- **Different skill requirements** for diverse recommendations
- **Location variety** (Casablanca, Rabat, Marrakech)
- **Seniority levels** (junior, intermediate, senior)
- **Remote work options**

### Salary Examples
- `"12k-18k MAD"` → Normalized to 15000 MAD
- `"MAD 9000"` → Normalized to 9000 MAD
- `null` → Handled gracefully
- `"—"` → Treated as missing data

## Usage Examples

### In Test Runners
```javascript
import { buildAttempt } from '../lib/scoreUtils';
import { useAttempts } from '../store/useAttempts';

const { addAttempt } = useAttempts();
const startedAtRef = useRef(Date.now());

// On test completion
const attempt = buildAttempt(testId, total, correct, startedAtRef.current, 'user');
addAttempt(attempt);
```

### In Dashboard
```javascript
import { useRecommendations, useUserProfile } from '../recommendations/useRecommendations';

const userProfile = useUserProfile();
const { recommendations, loading, error } = useRecommendations(userProfile, 5);
```

## Benefits

1. **Consistent Scoring**: All tests use the same scoring system
2. **Persistent Attempts**: Test history is saved and accessible
3. **Intelligent Recommendations**: Based on actual test performance
4. **Scalable Architecture**: Easy to add new tests and job sources
5. **User Experience**: Personalized and relevant job suggestions
6. **Data Integrity**: Standardized attempt records across all tests
7. **Fallback Support**: Works with or without backend API

## Future Enhancements

- **Real-time updates** when new attempts are added
- **Advanced filtering** options for job recommendations
- **Skill gap analysis** showing areas for improvement
- **Career path suggestions** based on test performance
- **Integration with external job APIs**
- **Machine learning** for improved matching algorithms
