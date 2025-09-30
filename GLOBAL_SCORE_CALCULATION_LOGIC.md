# Global Score Calculation Logic

## Overview
The global job match score is calculated using a weighted combination of multiple factors that assess a candidate's suitability for a specific job position.

## Score Components & Weights

### 1. Skills Match (40% weight) - Most Important
- **Purpose**: Assess how well the candidate's skills match the job requirements
- **Calculation**: 
  - Required skills match: 70% weight within skills score
  - Preferred skills match: 30% weight within skills score
  - Formula: `(required_matches / total_required) * 0.7 + (preferred_matches / total_preferred) * 0.3`
- **Range**: 0-100%
- **Example**: If job requires [Python, JavaScript] and candidate has [Python, React], score = (1/2 * 0.7 + 0/1 * 0.3) = 35%

### 2. Technical Tests (15% weight) - Verified Abilities
- **Purpose**: Verify technical skills through actual test performance
- **Calculation**: 
  - Count passed tests (50%+ score) for job-relevant skills
  - Formula: `passed_technical_tests / total_relevant_technical_tests`
- **Range**: 0-100%
- **Example**: If job requires JavaScript and candidate passed JavaScript test, score = 100%

### 3. Cognitive Tests (10% weight) - Mental Abilities
- **Purpose**: Assess cognitive abilities (numerical, verbal, logical reasoning, etc.)
- **Calculation**: 
  - Average score of all cognitive tests taken
  - Formula: `sum(cognitive_test_scores) / number_of_cognitive_tests`
- **Range**: 0-100%
- **Test Types**: Numerical Reasoning, Verbal Reasoning, Logical Reasoning, Abstract Reasoning, Spatial Reasoning, Diagrammatic Reasoning, Situational Judgment
- **Example**: If candidate took 3 cognitive tests with scores 80%, 70%, 60%, score = (80+70+60)/3 = 70%

### 4. Location Bonus (15% weight) - Geographic Compatibility
- **Purpose**: Assess geographic compatibility between candidate and job location
- **Calculation**: 
  - Exact match: 100%
  - Partial match (same city): 100%
  - No match: 0%
- **Range**: 0-100%
- **Example**: Candidate in "Casablanca, Morocco" and job in "Casablanca, Morocco" = 100%

### 5. Content Similarity (15% weight) - Profile Match
- **Purpose**: How well the candidate's profile matches the job description
- **Calculation**: 
  - Text similarity analysis between candidate profile and job description
  - Natural language processing to identify matching keywords and concepts
- **Range**: 0-100%
- **Example**: Profile with "React development experience" matching job "React frontend developer" = high similarity

### 6. Career Cluster Fit (5% weight) - Career Path Alignment
- **Purpose**: How well the job fits the candidate's career cluster/path
- **Calculation**: 
  - Analysis of job category alignment with candidate's career trajectory
  - Considers industry, role level, and career progression
- **Range**: 0-100%
- **Example**: Software developer applying for senior developer role in same industry = high fit

## Final Score Calculation

```
Global Score = (Skills × 40%) + (Technical Tests × 15%) + (Cognitive Tests × 10%) + (Location × 15%) + (Content Similarity × 15%) + (Career Cluster Fit × 5%)
```

### Detailed Formula:
```
Global Score = (Skills × 0.40) + (Technical Tests × 0.15) + (Cognitive Tests × 0.10) + (Location × 0.15) + (Content Similarity × 0.15) + (Career Cluster Fit × 0.05)
```

### Example Calculation

**Job**: React Developer at TechCorp in Casablanca, Morocco
**Requirements**: React, JavaScript, Git

**Candidate Profile**:
- Skills: [React, JavaScript, Python] (matches 2/3 required)
- Technical Tests: Passed JavaScript (1/1 relevant)
- Cognitive Tests: 75% average (3 tests taken)
- Location: Casablanca, Morocco
- Content Similarity: 65% (good profile match)
- Career Cluster Fit: 80% (aligned career path)

**Calculation**:
1. **Skills Score**: (2/3 × 0.7) + (0/0 × 0.3) = 46.7%
2. **Technical Tests**: 1/1 = 100%
3. **Cognitive Tests**: 75%
4. **Location**: 100% (exact match)
5. **Content Similarity**: 65%
6. **Career Cluster Fit**: 80%

**Global Score**: 
(46.7 × 0.40) + (100 × 0.15) + (75 × 0.10) + (100 × 0.15) + (65 × 0.15) + (80 × 0.05)
= 18.68 + 15 + 7.5 + 15 + 9.75 + 4
= **69.93%**

## Score Interpretation

| Score Range | Interpretation | Recommendation |
|-------------|----------------|----------------|
| 90-100% | Excellent Match | Strong candidate, likely to succeed |
| 80-89% | Very Good Match | Good candidate, high potential |
| 70-79% | Good Match | Suitable candidate, consider |
| 60-69% | Fair Match | May work with training |
| 50-59% | Poor Match | Requires significant development |
| 0-49% | Very Poor Match | Not recommended |

## Test Passing Thresholds

- **Technical Tests**: 50% (configurable, was 70%)
- **Cognitive Tests**: 50% (configurable, was 70%)

## Additional Factors (Not in Global Score)

### Content Similarity
- **Purpose**: How well profile matches job description
- **Weight**: 0% (informational only)
- **Calculation**: Text similarity analysis

### Career Cluster Fit
- **Purpose**: How well job fits candidate's career cluster
- **Weight**: 0% (informational only)
- **Calculation**: Career path alignment analysis

### Preferred Skills Match
- **Purpose**: Bonus qualifications
- **Weight**: 0% (informational only)
- **Calculation**: Additional skills beyond requirements

## Implementation Details

### Backend Integration
- Test results stored in database (TestSubmission, Score models)
- Real-time calculation using backend API
- Fallback to localStorage for backward compatibility

### Frontend Display
- Real-time score updates
- Detailed breakdown visualization
- Color-coded progress bars
- Explanatory text for each component

### Data Sources
- **Skills**: User profile, job requirements
- **Technical Tests**: Backend database
- **Cognitive Tests**: Backend database
- **Location**: User profile, job location

## Configuration

The scoring system can be configured by modifying:
- `frontend/src/utils/backendTestResults.js` - Test type mappings
- `frontend/src/features/job-recommendations/components/JobRecommendations.jsx` - Score weights
- `backend/recommendation/enhanced_services.py` - Backend scoring logic

## Future Enhancements

1. **Experience Level**: Add years of experience as a factor
2. **Education**: Include education level matching
3. **Salary Fit**: Consider salary expectations
4. **Remote Work**: Factor in remote work preferences
5. **Company Culture**: Add cultural fit assessment
6. **Industry Experience**: Include industry-specific experience
