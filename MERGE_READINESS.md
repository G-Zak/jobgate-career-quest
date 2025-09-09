# MERGE_READINESS — My Part

## 1. Overview

I have developed 3 skills validation tests for the JobGate Career Quest platform:

- **Spatial Reasoning Test**: 6-section comprehensive spatial intelligence assessment with mental rotation, shape assembly, and 3D visualization
- **Verbal Reasoning Test**: 5-category verbal intelligence assessment including reading comprehension, analogies, classification, coding/decoding, and logical puzzles  
- **Situational Judgment Test (SJT)**: Professional workplace scenario assessment with randomized question selection

**Purpose of each test:**
- **Spatial**: Assess candidate's ability to visualize, rotate, and manipulate 3D objects and spatial relationships
- **Verbal**: Evaluate language comprehension, logical reasoning, and verbal problem-solving skills (consolidated from 7 to 5 categories to eliminate redundancy)
- **Situational**: Measure professional judgment and decision-making in workplace scenarios

## 2. Tech Stack

**Language & Framework:**
- React 18.2.0 with JSX
- JavaScript ES2020+
- Vite 5.x build tool
- Node.js runtime

**Core Dependencies:**
- `framer-motion` ^12.23.12 - Animations and transitions
- `react-icons` ^5.5.0 - Icon components  
- `react-router-dom` ^7.7.1 - Client-side routing
- `@heroicons/react` ^2.2.0 - UI icons

**Styling:**
- TailwindCSS ^3.4.0 - Utility-first styling
- PostCSS ^8.4.0 - CSS processing
- Custom CSS animations and transitions

**Development Tools:**
- ESLint with React hooks plugin
- TypeScript support (configured but optional)
- Vite dev server with HMR

## 3. Data Storage

**Current Format:** JSONL (JSON Lines) files for all test data

**File Locations:**
```
frontend/src/features/skills-assessment/data/
├── spatialTestSections.js           # Spatial test structure (JavaScript objects)
├── situationalJudgmentTest.jsonl    # SJT questions (151 items)
├── masterSJTPool.jsonl             # Master SJT pool (200+ items)  
├── verbal_analogy_dataset.jsonl     # Verbal analogies (73 items)
├── verbal_classification_dataset.jsonl # Word classification (90+ items)
├── verbal_coding_decoding_dataset.jsonl # Coding puzzles (100+ items)
└── verbalReasoningVRT7.jsonl       # Blood relations & logic (100+ items)
```

**Sample Question Schema (JSONL):**
```json
{
  "id": "VR-SJT-0001",
  "type": "situational_test", 
  "domain": "teamwork",
  "scenario": "Your team member consistently misses deadlines...",
  "choices": ["Option A", "Option B", "Option C", "Option D"],
  "answer_index": 1,
  "answer": "Offer to help with workload and time management",
  "explanation": "Supporting a struggling teammate demonstrates...",
  "difficulty": "easy",
  "tags": ["SJT", "teamwork", "collaboration"],
  "translations": {}
}
```

**Spatial Test Schema (JavaScript Objects):**
```javascript
{
  id: 1,
  question_text: "Which option shows the correct assembly?",
  context: "Look at component shapes and find matching assembly",
  question_image: "/src/assets/images/spatial/questions/section_1/question_1.png", 
  options: ["A", "B", "C", "D"],
  correct_answer: "A",
  order: 1,
  complexity_score: 1
}
```

## 4. Execution Flow

### Test Lifecycle:
**Loader** → **Section Intro** → **Renderer** → **Scorer** → **Results**

**Step-by-step flow:**

1. **Data Loading**
   - Component mounts → `useEffect` triggers data loader
   - JSONL files parsed via `fetch()` and `.json()` parsing
   - Test data stored in React state (`testData`)

2. **Test Configuration** 
   - Timer initialized based on test duration (25-90 minutes)
   - Question randomization (SJT uses Fisher-Yates shuffle)
   - Answer state management via `useState({})`

3. **Question Rendering**
   - Current question retrieved from state index
   - Dynamic answer choice rendering (A/B/C/D or True/False/Cannot Say)
   - Real-time timer countdown with auto-submit

4. **Answer Collection**
   - User selections stored in answers object: `{sectionId_passageId_questionId: answer}`
   - Navigation between questions with validation
   - Progress tracking and visual indicators

5. **Scoring & Results**
   - Automatic scoring on test completion
   - Percentage calculation: `(correct/total) * 100`
   - Performance categorization and feedback display

### Entry Points:
```javascript
// Main Dashboard routing
<SpatialReasoningTest testId="SRT1" />
<VerbalReasoningTest testId="VRT1" />  
<SituationalJudgmentTest testId="SJT" />
```

## 5. Current Directory / File Structure

### Main Components:
```
frontend/src/features/skills-assessment/
├── components/
│   ├── AvailableTests.jsx              # Test catalog & selection UI
│   ├── SpatialReasoningTest.jsx        # Spatial test runner (6 sections)
│   ├── VerbalReasoningTest.jsx         # Verbal test runner (7 categories)
│   ├── SituationalJudgmentTest.jsx     # SJT test runner (randomized)
│   ├── MasterSJTTest.jsx               # Legacy SJT (unused)
│   └── TestLayout.jsx                  # Shared test container
├── data/
│   ├── spatialTestSections.js          # Spatial test definitions
│   ├── verbalTestSections.js           # Verbal test structure  
│   ├── verbalReasoningCategories.js    # Verbal categorization
│   ├── verbalReasoningTestManager.js   # Verbal randomization engine
│   └── *.jsonl files                   # Question datasets
└── utils/
    └── scrollUtils.js                  # Scroll management utilities
```

### Routing Integration:
```
src/shared/components/layout/MainDashboard.jsx  # Main router
├── Routes to spatial test: testId="SRT1-6"
├── Routes to verbal test: testId="VRT1-7" 
└── Routes to SJT test: testId="SJT"
```

### Asset Dependencies:
```
frontend/src/assets/images/spatial/
├── instructions/                       # Section intro images
└── questions/                          # Question visual content
    ├── section_1/ (40 images)
    ├── section_2/ (40 images) 
    ├── section_3/ (40 images)
    ├── section_4/ (40 images)
    ├── section_5/ (20 images)
    └── section_6/ (20 images)
```

## 6. Known Issues / To-Do

### Code Quality Issues:
- **Duplicate SJT implementations**: `SituationalJudgmentTest.jsx` and `MasterSJTTest.jsx` contain overlapping functionality
- **Redundant VRT tests**: VRT1, VRT2, VRT3 are all reading comprehension with similar content - need consolidation into single randomized test
- **Inconsistent data formats**: Spatial uses JS objects, Verbal/SJT use JSONL
- **Mixed ID conventions**: Some use "VR-SJT-0001", others use numeric IDs
- **Hardcoded image paths**: Spatial test images not dynamically managed

### Missing Features:
- **Answer explanations**: Limited feedback on incorrect answers
- **Adaptive difficulty**: All questions same weight regardless of complexity
- **Progress persistence**: No save/resume functionality
- **Detailed analytics**: Basic scoring without skill breakdown

### Technical Debt:
- **Large bundle size**: Individual JSONL files loaded separately
- **No error boundaries**: Component crashes can break entire test
- **Manual timer management**: Could use custom hook abstraction
- **Repetitive scroll handling**: Similar scroll code across components

## 7. Next Steps for Merge

### Schema Normalization:
```javascript
// Target unified schema
{
  "id": "SP-001",        // Spatial: SP-, Verbal: VR-, SJT: SJT-
  "type": "spatial_test",
  "category": "mental_rotation",
  "question_text": "...",
  "options": [],
  "correct_answer": "",
  "difficulty": "medium",  // easy|medium|hard
  "duration_seconds": 120,
  "explanation": "...",
  "tags": ["spatial", "3d_visualization"]
}
```

### Verbal Test Consolidation Plan:
- **Current**: VRT1 (Basic), VRT2 (Intermediate), VRT3 (Advanced) - all reading comprehension
- **Target**: Single VRT-COMP (Reading Comprehension) with randomized questions from all difficulty levels
- **Remaining Tests**: VRT4 (Analogies), VRT5 (Classification), VRT6 (Coding/Decoding), VRT7 (Logical Puzzles)
- **Anti-cheating**: Random selection from merged question pool of all comprehension passages

### ID Assignment Strategy:
- **Spatial Tests**: `SP-{section}{question}` (SP-101, SP-201, etc.)
- **Verbal Tests**: `VR-COMP-{number}`, `VR-A-{number}`, `VR-C-{number}`, etc.  
- **SJT Tests**: `SJT-{domain}{number}` (SJT-T001, SJT-L001, etc.)

### Team Alignment Requirements:
- **Data format standardization**: Convert all to consistent JSONL or database schema
- **API endpoint design**: Backend routes for test data retrieval
- **Authentication integration**: User session management and progress tracking  
- **Results storage**: Database schema for test scores and analytics

### Suggested Merge Actions:
1. **Consolidate VRT Tests**: Merge VRT1-3 into single randomized reading comprehension test
2. **Export & Audit**: Extract all question data to unified JSONL format
3. **Schema Migration**: Create database tables matching current structure
4. **API Integration**: Replace file loading with backend API calls
5. **Component Integration**: Merge with teammates' authentication and dashboard systems
6. **Testing & Validation**: Cross-browser testing and performance optimization

**Merge Priority:** High - Core assessment functionality ready for integration after VRT consolidation.
