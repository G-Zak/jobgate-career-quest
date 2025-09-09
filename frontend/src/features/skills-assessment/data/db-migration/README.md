# Skills Assessment Database Migration Files

This directory contains cleaned and renamed data files prepared for database migration. Each file has been organized with clear, descriptive names that follow database naming conventions.

## Directory Structure

```
db-migration/
├── situational-judgment/
│   └── sjt_questions.jsonl                 # Situational Judgment Test questions
├── verbal-reasoning/
│   ├── analogy_questions.jsonl             # Verbal analogy questions (VRT4)
│   ├── blood_relations_questions.jsonl     # Blood relations logical puzzles (VRT7)
│   ├── classification_questions.jsonl      # Verbal classification questions (VRT5)
│   └── coding_decoding_questions.jsonl     # Coding/decoding questions (VRT6)
└── spatial-reasoning/
    └── spatial_test_config.json            # Spatial test configuration and metadata
```

## File Mappings (Old → New)

### Situational Judgment Tests
- `masterSJTPool.jsonl` → `sjt_questions.jsonl`

### Verbal Reasoning Tests  
- `verbal_analogy_dataset.jsonl` → `analogy_questions.jsonl`
- `verbalReasoningVRT7.jsonl` → `blood_relations_questions.jsonl`
- `verbal_classification_dataset.jsonl` → `classification_questions.jsonl`
- `verbal_coding_decoding_dataset.jsonl` → `coding_decoding_questions.jsonl`

### Spatial Reasoning Tests
- `spatialTestSections.js` → `spatial_test_config.json` (converted from JS to JSON)

## Database Schema Recommendations

### Table: `sjt_questions`
```sql
CREATE TABLE sjt_questions (
    id VARCHAR(20) PRIMARY KEY,
    domain VARCHAR(50),
    scenario TEXT,
    choices JSON,
    answer_index INTEGER,
    answer TEXT,
    explanation TEXT,
    difficulty ENUM('easy', 'medium', 'hard'),
    tags JSON,
    translations JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Table: `verbal_questions`  
```sql
CREATE TABLE verbal_questions (
    id VARCHAR(20) PRIMARY KEY,
    type VARCHAR(50),
    subtype VARCHAR(50),
    stem TEXT,
    choices JSON,
    answer_index INTEGER,
    answer TEXT,
    difficulty ENUM('easy', 'medium', 'hard'),
    explanation TEXT,
    relationship VARCHAR(100),
    structure JSON,
    tags JSON,
    translations JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Table: `spatial_questions`
```sql
CREATE TABLE spatial_questions (
    id VARCHAR(20) PRIMARY KEY,
    section_id VARCHAR(50),
    question_number INTEGER,
    image_path VARCHAR(255),
    choices JSON,
    answer_index INTEGER,
    answer TEXT,
    difficulty ENUM('easy', 'medium', 'hard'),
    explanation TEXT,
    tags JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Table: `test_configurations`
```sql
CREATE TABLE test_configurations (
    id VARCHAR(50) PRIMARY KEY,
    test_name VARCHAR(100),
    description TEXT,
    total_duration_minutes INTEGER,
    sections JSON,
    difficulty_levels JSON,
    scoring_method VARCHAR(50),
    image_path_base VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Data Quality Notes

### Situational Judgment (SJT)
- ✅ 200 questions with consistent ID format (SJT-0001 to SJT-0200)
- ✅ All questions have domains: teamwork, leadership, ethics, customer_service, communication, conflict, inclusivity, safety
- ✅ Consistent difficulty levels: easy, medium, hard
- ✅ All questions include explanations and tags

### Verbal Reasoning
- ✅ Analogy questions: 73 questions with types (completing_pair, simple_analogy, choose_pair, double_analogy)
- ✅ Blood relations: 96 questions focused on family relationship logic
- ✅ Classification: Consistent format with pattern recognition
- ✅ Coding/decoding: Pattern-based verbal reasoning questions

### Spatial Reasoning
- ⚠️ Currently in JavaScript format - needs conversion to individual question records
- ✅ Well-structured with sections and difficulty progression
- ⚠️ Image dependencies need to be managed separately

## Migration Steps

1. **Import JSON/JSONL files** into respective database tables
2. **Handle image assets** for spatial reasoning questions
3. **Set up foreign key relationships** between questions and test configurations
4. **Create indexes** on frequently queried fields (difficulty, type, domain)
5. **Implement data validation** for question integrity
6. **Set up audit trails** for question modifications

## Additional Considerations

- **Question Randomization**: Implement database-level randomization for test generation
- **User Progress Tracking**: Add tables for user responses and progress
- **Analytics**: Consider adding fields for question performance metrics
- **Internationalization**: The translation fields are ready for multi-language support
- **Version Control**: Add version fields for question updates and A/B testing

## Usage in Application

After migration, update application imports to use database queries instead of static file imports:

```javascript
// Old way
import { masterSJTGenerator } from './utils/masterSJTGenerator.js';

// New way  
const questions = await db.query('SELECT * FROM sjt_questions WHERE difficulty = ?', [difficulty]);
```
