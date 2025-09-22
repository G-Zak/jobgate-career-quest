# 🔧 Django Management Commands Reference

This file lists all the custom Django management commands available for setting up test data.

## 📋 Available Commands

### 1. Verbal Reasoning Tests
```bash
python manage.py add_verbal_questions
```
- Adds verbal reasoning questions to the database
- Test IDs: 5, 6, 7, 8

### 2. Numerical Reasoning Tests
```bash
python manage.py add_numerical_questions
python manage.py add_more_numerical_questions
```
- Adds numerical reasoning questions
- Test ID: 21

### 3. Logical Reasoning Tests
```bash
python manage.py add_lrt1_questions
python manage.py add_lrt2_questions
python manage.py add_lrt3_questions
```
- Adds logical reasoning questions for LRT1, LRT2, LRT3
- Test IDs: 13, 14, 15

### 4. Diagrammatic Reasoning Tests
```bash
python manage.py add_diagrammatic_image_questions
python manage.py add_diagrammatic_20_questions
python manage.py add_drt2_questions
```
- Adds diagrammatic reasoning questions with images
- Test IDs: 12, 24, 25

### 5. Abstract Reasoning Tests
```bash
python manage.py add_abstract_questions
```
- Adds abstract reasoning questions with images
- Test ID: 10

### 6. Spatial Reasoning Tests
```bash
python manage.py update_spatial_tests_to_5_options
```
- Updates spatial tests to have 5 options (A, B, C, D, E)
- Test IDs: 15, 16, 17

### 7. Situational Judgment Tests
```bash
python manage.py add_sjt_correct_answers
```
- Adds correct answers for situational judgment test questions
- Test ID: 4

## 🚀 Complete Setup Sequence

Run these commands in order to set up all test data:

```bash
# 1. Basic migrations
python manage.py migrate

# 2. Load all test questions
python manage.py add_verbal_questions
python manage.py add_numerical_questions
python manage.py add_lrt1_questions
python manage.py add_lrt2_questions
python manage.py add_lrt3_questions
python manage.py add_diagrammatic_image_questions
python manage.py add_diagrammatic_20_questions
python manage.py add_abstract_questions

# 3. Fix and update existing data
python manage.py add_sjt_correct_answers
python manage.py update_spatial_tests_to_5_options
```

## 📊 Verification Commands

### Check Database Status
```bash
python manage.py shell
```

```python
from testsengine.models import Test, Question, TestSubmission, Score

# Count all data
print(f"Tests: {Test.objects.count()}")
print(f"Questions: {Question.objects.count()}")
print(f"Submissions: {TestSubmission.objects.count()}")
print(f"Scores: {Score.objects.count()}")

# Check specific test
test = Test.objects.get(id=4)
questions = Question.objects.filter(test_id=4)
print(f"Test 4 questions: {questions.count()}")
```

### Check Random Selection
```bash
# Test API endpoint
curl -s "http://localhost:8000/api/tests/4/questions/" | jq '.total_questions'
```

## 🔍 Troubleshooting Commands

### Reset Database (DANGER - Deletes all data)
```bash
python manage.py flush
python manage.py migrate
# Then run all setup commands again
```

### Check Specific Test Data
```bash
python manage.py shell
```

```python
from testsengine.models import Question

# Check questions for specific test
questions = Question.objects.filter(test_id=4)
for q in questions[:5]:
    print(f"Q{q.id}: {q.question_text[:50]}...")
    print(f"  Options: {q.options}")
    print(f"  Correct: {q.correct_answer}")
    print()
```

## 📝 Notes

- All commands are safe to run multiple times
- Commands will skip existing data or update as needed
- Some commands clear existing data before adding new data
- Always run migrations before loading data
- Check the setup guide for complete instructions
