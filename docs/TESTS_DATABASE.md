# JobGate Career Quest: Tests Database Overview

## 1. Database Technology
- **Backend:** Django ORM
- **Database:** SQLite (default for development)
- **Location:** `/Users/zakariaguennani/Documents/Dev/EMSI/Internship/jobgate-career-quest/backend/db.sqlite3`

## 2. Main Models
### Test
- **Table:** `testsengine_test`
- **Fields:**
  - `id` (integer, primary key)
  - `title` (string)
  - `description` (text)
  - `test_type` (string, e.g. 'verbal_reasoning', 'numerical_reasoning')
  - `duration_minutes` (integer)
  - `difficulty_level` (string)
  - `created_at` (datetime)

### Question
- **Table:** `testsengine_question`
- **Fields:**
  - `id` (integer, primary key)
  - `test` (foreign key to Test)
  - `question_text` (text)
  - `question_type` (string, e.g. 'reading_comprehension', 'vocabulary')
  - `options` (JSON/text)
  - `correct_option` (integer or string)
  - `order` (integer)

### TestSession
- **Table:** `testsengine_testsession`
- **Fields:**
  - `id` (integer, primary key)
  - `user` (foreign key to User)
  - `test` (foreign key to Test)
  - `score` (integer)
  - `completed_at` (datetime)
  - `answers` (JSON/text)

## 3. How Tests Are Stored
- Each test is a row in `testsengine_test`.
- Each question is linked to a test via the `test` foreign key in `testsengine_question`.
- Options for each question are stored as a JSON/text field.
- Correct answers are stored in the `correct_option` field.

## 4. Scoring System
- When a user completes a test, a `TestSession` is created.
- The user's answers are compared to the correct answers in the database.
- The score is calculated as the number of correct answers.
- The score and answers are stored in the `TestSession` table for future reference.

## 5. How Data Flows
- **Frontend:** Fetches available tests via `/api/tests/` endpoint.
- **Taking a Test:**
  - Frontend fetches questions for a test via `/api/tests/{id}/`.
  - User submits answers; frontend sends them to backend.
  - Backend calculates score, creates a `TestSession` record.
- **Review:** User can view past scores and answers from `TestSession` records.

## 6. Management Commands
- Custom Django management commands (e.g. `create_multiple_verbal_tests`) are used to populate the database with test and question data.

## 7. Example: Verbal Reasoning Test
- Test: "Verbal Reasoning Test 1 - Basic" (id=2)
- Questions: Linked in `testsengine_question` with `test_id=2`
- Scoring: Each correct answer increments the score in `TestSession`

---
For more details, see the Django models in `backend/testsengine/models.py` and API endpoints in `backend/testsengine/views.py`.
