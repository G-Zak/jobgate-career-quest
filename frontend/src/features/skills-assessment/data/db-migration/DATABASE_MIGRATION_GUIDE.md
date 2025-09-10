# 🗄️ Real Database Migration Guide

## 🎯 Database Options & Recommendations

### **Recommended: PostgreSQL** ✅
- **Why PostgreSQL?** Native JSON support, excellent performance, ACID compliance
- **Your Setup**: Already configured in `backend/careerquest/database_config.py`
- **Benefits**: JSON fields, full-text search, scalability, production-ready

### **Alternative Options**
- **MySQL/MariaDB**: Good JSON support (MySQL 5.7+), widely supported
- **SQLite**: Already in use for development, good for small scale
- **MongoDB**: NoSQL option, excellent for document storage (requires different ORM)

## 🚀 **QUICK START - 3 Simple Steps**

### **Step 1: Run Setup Script**
```bash
cd frontend/src/features/skills-assessment/data/db-migration
chmod +x setup.sh
./setup.sh
```

### **Step 2: Choose Database**
The setup script will ask you to choose:
1. **PostgreSQL** (Recommended) - Automatic setup
2. **MySQL** - Manual configuration needed
3. **SQLite** - Development only

### **Step 3: Migrate Data**
```bash
# Preview migration (safe)
python3 migrate_to_database.py --database postgresql --dry-run

# Actually migrate
python3 migrate_to_database.py --database postgresql --create-tables
```

## ✅ **What You Get After Migration**

### **Complete Database Schema**
- ✅ **752 Questions** imported across 3 test types
- ✅ **User Session Tracking** with detailed analytics
- ✅ **Question Performance Metrics** for optimization
- ✅ **Test Configurations** for different assessment types

### **Production-Ready Features**
- ✅ **JSON Storage** for flexible question data
- ✅ **Performance Indexes** for fast queries
- ✅ **User Response Tracking** with timing data
- ✅ **Analytics Engine** for question optimization
- ✅ **Session Management** with pause/resume capability

## 🏗️ Database Schema Design

### **Core Tables Structure**

```sql
-- Skills Assessment Questions
CREATE TABLE assessment_questions (
    id SERIAL PRIMARY KEY,
    question_id VARCHAR(50) UNIQUE NOT NULL,
    test_type VARCHAR(20) NOT NULL, -- 'sjt', 'verbal', 'spatial'
    category VARCHAR(50) NOT NULL,
    subcategory VARCHAR(50),
    question_text TEXT NOT NULL,
    choices JSON NOT NULL, -- Array of choice objects
    correct_answer INTEGER NOT NULL,
    difficulty VARCHAR(10) NOT NULL, -- 'easy', 'medium', 'hard'
    explanation TEXT,
    tags JSON, -- Array of tags
    metadata JSON, -- Additional data (time_limit, images, etc.)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Test Configurations
CREATE TABLE test_configurations (
    id SERIAL PRIMARY KEY,
    test_type VARCHAR(20) NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    total_questions INTEGER NOT NULL,
    time_limit INTEGER, -- in minutes
    passing_score INTEGER,
    difficulty_distribution JSON, -- {"easy": 30, "medium": 50, "hard": 20}
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Test Sessions
CREATE TABLE user_test_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL, -- Foreign key to users table
    test_configuration_id INTEGER REFERENCES test_configurations(id),
    session_token VARCHAR(100) UNIQUE NOT NULL,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    total_score INTEGER,
    percentage_score DECIMAL(5,2),
    time_taken INTEGER, -- in seconds
    status VARCHAR(20) DEFAULT 'in_progress', -- 'in_progress', 'completed', 'abandoned'
    session_data JSON -- Store session state, answered questions, etc.
);

-- User Question Responses
CREATE TABLE user_question_responses (
    id SERIAL PRIMARY KEY,
    session_id INTEGER REFERENCES user_test_sessions(id),
    question_id VARCHAR(50) REFERENCES assessment_questions(question_id),
    user_answer INTEGER,
    is_correct BOOLEAN,
    time_taken INTEGER, -- in seconds
    answered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Question Performance Analytics
CREATE TABLE question_analytics (
    id SERIAL PRIMARY KEY,
    question_id VARCHAR(50) REFERENCES assessment_questions(question_id),
    total_attempts INTEGER DEFAULT 0,
    correct_attempts INTEGER DEFAULT 0,
    avg_time_taken DECIMAL(8,2), -- in seconds
    difficulty_rating DECIMAL(3,2), -- calculated difficulty based on performance
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **Indexes for Performance**

```sql
-- Primary indexes for fast queries
CREATE INDEX idx_questions_test_type ON assessment_questions(test_type);
CREATE INDEX idx_questions_category ON assessment_questions(category);
CREATE INDEX idx_questions_difficulty ON assessment_questions(difficulty);
CREATE INDEX idx_sessions_user_id ON user_test_sessions(user_id);
CREATE INDEX idx_responses_session_id ON user_question_responses(session_id);
CREATE INDEX idx_responses_question_id ON user_question_responses(question_id);

-- Composite indexes for complex queries
CREATE INDEX idx_questions_type_category ON assessment_questions(test_type, category);
CREATE INDEX idx_questions_type_difficulty ON assessment_questions(test_type, difficulty);
CREATE INDEX idx_sessions_user_status ON user_test_sessions(user_id, status);
```

## 🔧 Django Models Implementation

Let me create the Django models for your existing Django backend:
