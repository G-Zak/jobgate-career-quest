# Skills Tests SQLite Integration Guide

This guide explains how to work with the skills tests using the SQLite database system instead of JSON files.

## Overview

The skills assessment system now uses SQLite databases to store test questions, options, and results:

1. `Abstract_Reasoning.db` - Contains abstract reasoning visual pattern tests
2. `Numerical_Reasoning.db` - Contains numerical reasoning calculation tests

Each database contains these tables:

- `tests`: Contains test metadata (name, description, time limit)
- `questions`: Individual test questions with content, difficulty, and metadata
- `options`: Answer options for each question
- `users`: Users who can take tests
- `attempts`: Test attempt records
- `attempt_answers`: Individual answers from test attempts

## Migration Process

To migrate from JSON files to SQLite:

1. Run the combined migration script:

   ```bash
   python migrate_skills_tests.py
   ```

   This script will:

   - Convert abstract reasoning questions from JSON to SQLite
   - Convert numerical reasoning questions from JSON to SQLite
   - Process SVG data into image files (for abstract reasoning tests)

2. Individual migration scripts are also available:
   - `migrate_abstract_questions.py` - For abstract reasoning tests
   - `migrate_numerical_questions.py` - For numerical reasoning tests

## Directory Structure

```
jobgate-career-quest/
├── Abstract_Reasoning.db       # SQLite database for abstract reasoning
├── Numerical_Reasoning.db      # SQLite database for numerical reasoning
├── migrate_skills_tests.py     # Combined migration script
├── migrate_abstract_questions.py
├── migrate_numerical_questions.py
├── frontend/
│   └── src/
│       ├── assets/
│       │   ├── images/
│       │   │   ├── abstract_reasoning/   # Abstract test images
│       │   │   └── numerical_reasoning/  # Numerical test images
│       ├── components/
│       │   ├── abstract-reasoning/
│       │   │   └── AbstractReasoningImage.jsx
│       │   └── numerical-reasoning/
│       │       └── NumericalReasoningContent.jsx
│       └── config/
│           ├── abstract-reasoning-settings.js
│           └── numerical-reasoning-settings.js
└── backend/
    └── skills_tests/
        ├── __init__.py          # Main engine
        ├── sqlite_loader.py     # SQLite integration
        ├── svg_to_png.py        # Image conversion utility
        └── data/
            ├── abstract_reasoning_questions.json  # Legacy format
            └── numerical_reasoning_questions.json # Legacy format
```

## Usage in Code

### Backend Integration

The `SkillsTestEngine` now automatically attempts to load questions from SQLite first, falling back to JSON if needed:

```python
# This code already exists in __init__.py
def load_questions(self, test_category: str) -> List[Question]:
    """Load questions for a specific test category"""
    # First try loading from SQLite
    try:
        from .sqlite_loader import SkillsTestDBLoader
        loader = SkillsTestDBLoader()
        questions = loader.load_questions(test_category)
        self.questions_cache[test_category] = questions
        return questions
    except Exception as e:
        print(f"Error loading from SQLite, falling back to JSON: {e}")
        # Fall back to JSON loading if SQLite fails

    # JSON loading code follows...
```

### Frontend Integration

For abstract reasoning:

```jsx
import AbstractReasoningImage from '../components/abstract-reasoning/AbstractReasoningImage';

// In your component:
<AbstractReasoningImage
  imageData={question.content}
  alt={`Question ${question.question_id}`}
/>;
```

For numerical reasoning:

```jsx
import NumericalReasoningContent from '../components/numerical-reasoning/NumericalReasoningContent';

// In your component:
<NumericalReasoningContent contentData={question.content} />;
```

## Image Handling

### Abstract Reasoning

Abstract reasoning tests include SVG data converted to PNG images. The conversion happens during migration:

1. SVG data is extracted from JSON files
2. SVG files are created in `frontend/src/assets/images/abstract_reasoning/`
3. SVGs are converted to PNG using the `svg_to_png.py` utility

### Numerical Reasoning

Numerical reasoning tests can include images, tables, charts, and text:

1. Images should be placed in `frontend/src/assets/images/numerical_reasoning/`
2. Tables and charts are rendered by the `NumericalReasoningContent` component

## Adding New Questions

### Abstract Reasoning Test

```sql
-- Add a question to Abstract_Reasoning.db
INSERT INTO questions
(test_id, category, difficulty, question_content, correct_answer, explanation, time_limit, points, metadata)
VALUES
(1, 'pattern_matrices', 'medium',
 '{"type":"image","image_path":"images/abstract_reasoning/new_question.png","description":"Description here"}',
 'B', 'Explanation here', 90, 5, '{"created_date":"2025-09-05"}');

-- Get the new question ID
SELECT last_insert_rowid();

-- Add options for the question
INSERT INTO options (question_id, option_label, content)
VALUES
  (?, 'A', '{"type":"image","image_path":"images/abstract_reasoning/new_question_A.png"}'),
  (?, 'B', '{"type":"image","image_path":"images/abstract_reasoning/new_question_B.png"}'),
  (?, 'C', '{"type":"image","image_path":"images/abstract_reasoning/new_question_C.png"}'),
  (?, 'D', '{"type":"image","image_path":"images/abstract_reasoning/new_question_D.png"}');
```

### Numerical Reasoning Test

```sql
-- Add a question to Numerical_Reasoning.db
INSERT INTO questions
(test_id, category, difficulty, question_content, correct_answer, explanation, time_limit, points, metadata)
VALUES
(1, 'data_analysis', 'hard',
 '{"type":"table","headers":["Product","Q1","Q2","Q3","Q4"],"data":[["Widgets",125,136,142,158],["Gadgets",89,94,105,108],["Doohickeys",45,52,61,65]]}',
 'C', 'Explanation here', 120, 8, '{"created_date":"2025-09-05"}');

-- Get the new question ID
SELECT last_insert_rowid();

-- Add options for the question
INSERT INTO options (question_id, option_label, content)
VALUES
  (?, 'A', '{"type":"text","text":"10%"}'),
  (?, 'B', '{"type":"text","text":"15%"}'),
  (?, 'C', '{"type":"text","text":"20%"}'),
  (?, 'D', '{"type":"text","text":"25%"}');
```

## Benefits of SQLite Integration

1. **Better Data Management**: Structured database instead of large JSON files
2. **Image Separation**: Test images stored as files rather than embedded SVG
3. **Performance**: Faster loading and processing of questions
4. **Scalability**: Easier to add new questions or update existing ones
5. **Analytics**: Better tracking of test results and user performance

## Troubleshooting

If you encounter issues with the SQLite integration:

1. **Database Not Found**: Ensure the database files are in the project root
2. **Image Loading Errors**: Check the image paths in the database and ensure files exist
3. **Migration Errors**: Look for error messages in the migration script output
4. **JSON Fallback**: The system will automatically fall back to JSON if SQLite fails
5. **SQLite Tools**: Use the DB Browser for SQLite to inspect and modify the databases
