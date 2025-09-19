# 🚀 Scoring System Quick Reference

## ⚡ Quick Start Checklist

### **Adding Scoring to a New Test Type**

```bash
# 1. Copy the scoring service template
cp backend/testsengine/services/scoring_service.py \
   backend/testsengine/services/[test_type]_scoring_service.py

# 2. Update test data with correct answers
# Add "correct_answer" and "difficulty_level" to each question

# 3. Update frontend component
# Add scoring API call in handleSubmitTest()

# 4. Test everything
python manage.py test testsengine.tests.test_scoring_system
```

---

## 📊 Scoring Formula (Universal)

```python
# This works for ALL test types
score = is_correct ? difficulty_coefficient : 0

# Difficulty coefficients:
EASY   = 1.0 points
MEDIUM = 1.5 points  
HARD   = 2.0 points
```

---

## 🗃️ Database Models (Already Created)

```python
TestSubmission  # Links user + test + answers
Answer          # Individual question answers  
Score           # Calculated results
```

---

## 📁 File Locations

| Component | Location |
|-----------|----------|
| **Scoring Service** | `backend/testsengine/services/scoring_service.py` |
| **Database Models** | `backend/testsengine/models.py` |
| **Unit Tests** | `backend/testsengine/tests/test_scoring_system.py` |
| **Management Command** | `backend/testsengine/management/commands/test_scoring_system.py` |
| **Test Data** | `frontend/src/features/skills-assessment/data/` |

---

## 🔧 Common Commands

```bash
# Test scoring system
python manage.py test_scoring_system --create-sample-data --verbose

# Run unit tests
python manage.py test testsengine.tests.test_scoring_system -v 2

# Create database migrations
python manage.py makemigrations testsengine

# Apply migrations
python manage.py migrate
```

---

## 📋 Test Data Format

### **Multiple Choice Tests (A, B, C, D)**
```javascript
{
  "id": "Q1",
  "question_text": "What is 2 + 2?",
  "options": ["3", "4", "5", "6"],
  "correct_answer": "B",           // ← Required
  "difficulty_level": "easy"       // ← Required
}
```

### **Text-Based Tests (Situational)**
```javascript
{
  "id": "Q1", 
  "scenario": "Your colleague is late...",
  "choices": ["Option A", "Option B", "Option C", "Option D"],
  "answer_index": 1,               // ← 0-based index (B = 1)
  "difficulty": "medium"           // ← Required
}
```

---

## 🎯 Current Status

| Test Type | Correct Answers | Scoring Service | Status |
|-----------|----------------|-----------------|---------|
| **Verbal** | ✅ | ✅ | **Complete** |
| **Spatial** | ✅ | ❌ | **Needs Service** |
| **Numerical** | ❌ | ❌ | **Needs Both** |
| **Logical** | ❌ | ❌ | **Needs Both** |
| **Abstract** | ❌ | ❌ | **Needs Both** |
| **Situational** | ✅ | ❌ | **Needs Service** |

---

## 🐘 PostgreSQL Migration

### **Already Ready!** ✅
- Database config supports PostgreSQL
- Models use JSONField (PostgreSQL compatible)
- Dependencies installed

### **To Switch:**
```bash
# 1. Install PostgreSQL
brew install postgresql  # macOS

# 2. Create database
createdb jobgate_career_quest

# 3. Update .env file
USE_POSTGRESQL=True
DB_NAME=jobgate_career_quest
DB_USER=your_username
DB_PASSWORD=your_password

# 4. Run migrations
python manage.py migrate
```

---

## 🚨 Common Issues & Solutions

### **Issue: "UNIQUE constraint failed"**
```python
# Solution: Delete existing session before creating new one
TestSession.objects.filter(user=user, test=test).delete()
```

### **Issue: "No answers provided for submission"**
```python
# Solution: Check that answers_data is not empty
if not answers_data:
    raise ValueError("No answers provided for submission")
```

### **Issue: "Test not found"**
```bash
# Solution: Create sample data first
python manage.py test_scoring_system --create-sample-data
```

---

## 📞 Need Help?

1. **Check the full guide**: `SCORING_SYSTEM_GUIDE.md`
2. **Look at verbal test example**: `backend/testsengine/services/scoring_service.py`
3. **Run the management command**: `python manage.py test_scoring_system --help`
4. **Check unit tests**: `backend/testsengine/tests/test_scoring_system.py`

---

## 🎉 Success Indicators

✅ **Scoring service created**  
✅ **Correct answers added to test data**  
✅ **Frontend calls scoring API**  
✅ **Unit tests pass**  
✅ **Management command works**  
✅ **Score displays correctly**  

**You're done!** 🚀

