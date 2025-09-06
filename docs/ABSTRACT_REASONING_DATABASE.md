# Abstract Reasoning Tests Integration Guide

This guide explains how to work with the abstract reasoning tests using the SQLite database and image files.

## System Overview

The abstract reasoning test system now uses a SQLite database (`Abstract_Reasoning.db`) to store test questions, options, and results. This database contains the following tables:

- `tests`: Contains test metadata (name, description, time limit)
- `questions`: Individual test questions with content, difficulty, and metadata
- `options`: Answer options for each question
- `users`: Users who can take tests
- `attempts`: Test attempt records
- `attempt_answers`: Individual answers from test attempts

Images for questions and options are stored as files in `/frontend/src/assets/images/abstract_reasoning/`.

## Setup Steps

Follow these steps to set up the abstract reasoning test system:

1. **Ensure the SQLite database is in the project root:**

   - The database file (`Abstract_Reasoning.db`) should be in the root directory
   - This file contains all the test questions and options

2. **Install required Python dependencies:**

   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. **Generate PNG images from SVG data:**

   ```bash
   cd backend
   python -m skills_tests.svg_to_png
   ```

   This script will:

   - Find all SVG files in the frontend images directory
   - Convert them to PNG format for use in the UI
   - You need either cairosvg, wand, svglib or Inkscape installed

4. **Verify the integration:**
   - Start the Django server
   - Access the API endpoints to check if questions load correctly
   - The Django integration will automatically use the SQLite loader

## Adding New Questions

To add new questions:

1. Insert records into the SQLite database:

   ```sql
   -- Add a question
   INSERT INTO questions (test_id, category, difficulty, question_content, correct_answer, explanation, time_limit, points, metadata)
   VALUES (1, 'pattern_matrices', 'medium', '{"type":"image","image_path":"images/abstract_reasoning/new_question.png","description":"Description here"}', 'B', 'Explanation here', 90, 5, '{"created_date":"2025-09-05"}');

   -- Get the new question ID
   SELECT last_insert_rowid();

   -- Add options for the question (replace question_id with the ID from above)
   INSERT INTO options (question_id, option_label, content)
   VALUES
     (question_id, 'A', '{"type":"image","image_path":"images/abstract_reasoning/new_question_A.png"}'),
     (question_id, 'B', '{"type":"image","image_path":"images/abstract_reasoning/new_question_B.png"}'),
     (question_id, 'C', '{"type":"image","image_path":"images/abstract_reasoning/new_question_C.png"}'),
     (question_id, 'D', '{"type":"image","image_path":"images/abstract_reasoning/new_question_D.png"}');
   ```

2. Add the corresponding image files to `/frontend/src/assets/images/abstract_reasoning/`.

## Frontend Integration

Use the `AbstractReasoningImage` component to display test images:

```jsx
import AbstractReasoningImage from '../components/abstract-reasoning/AbstractReasoningImage';

// In your component:
<AbstractReasoningImage
  imageData={question.content}
  alt={`Question ${question.question_id}`}
/>;
```

## JSON Database Fallback

The system includes a fallback to the JSON database if the SQLite database cannot be accessed. This ensures the tests will continue to work even if there are issues with the SQLite integration.
