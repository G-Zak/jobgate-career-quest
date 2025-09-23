# 🎯 JobGate Career Quest - Complete Setup Documentation

This repository contains comprehensive documentation for setting up and running the JobGate Career Quest testing platform.

## 📚 Documentation Files

### 1. **SETUP_GUIDE.md** - Main Setup Instructions
- Complete step-by-step setup guide
- Database configuration
- Backend and frontend setup
- Test loading verification
- Prerequisites and requirements

### 2. **MANAGEMENT_COMMANDS.md** - Django Commands Reference
- All available Django management commands
- Complete setup sequence
- Database verification commands
- Troubleshooting commands

### 3. **TROUBLESHOOTING.md** - Problem Resolution
- Common issues and solutions
- Debugging steps
- Emergency reset procedures
- Success indicators

## 🚀 Quick Start

For a quick setup, follow these steps:

1. **Read SETUP_GUIDE.md** - Complete setup instructions
2. **Follow the Prerequisites** - Install Node.js, Python, PostgreSQL
3. **Setup Database** - Create database and configure credentials
4. **Run Backend Setup** - Install dependencies, run migrations, load data
5. **Run Frontend Setup** - Install dependencies, start development server
6. **Verify Everything Works** - Check tests load from database

## 🔧 Key Features

### Database Integration
- ✅ **All questions loaded from PostgreSQL database**
- ✅ **Random selection of 20 questions from larger pools**
- ✅ **Scores calculated and stored in database**
- ✅ **Submissions tracked with user answers**

### Test Types Available
- **Verbal Reasoning Tests** (VRT1-VRT4)
- **Numerical Reasoning Tests** (NRT1)
- **Logical Reasoning Tests** (LRT1-LRT3)
- **Diagrammatic Reasoning Tests** (DRT1-DRT2)
- **Abstract Reasoning Tests** (ART1)
- **Spatial Reasoning Tests** (SRT1-SRT3)
- **Situational Judgment Tests** (SJT1)

### Random Selection
- **Situational Judgment Test**: 20 random questions from 200
- **Abstract Reasoning Test**: 20 random questions with images
- **Diagrammatic Reasoning Test**: 20 random questions with images
- **Numerical Reasoning Test**: 20 random questions
- **Logical Reasoning Tests**: 20 random questions each

## 🗄️ Database Schema

### Key Tables
- **`testsengine_test`** - Test definitions
- **`testsengine_question`** - Questions with options and correct answers
- **`testsengine_testsubmission`** - User test submissions
- **`testsengine_answer`** - Individual user answers
- **`testsengine_score`** - Calculated scores and grades

### Data Flow
1. **Questions** → Loaded from database via API
2. **User Answers** → Submitted to database
3. **Scoring** → Calculated using database-stored correct answers
4. **Results** → Stored in database for persistence

## 🎨 Frontend Features

### Test Components
- **Responsive Design** - Works on desktop and mobile
- **Image Support** - Displays test images correctly
- **Progress Tracking** - Shows question progress
- **Answer Selection** - Multiple choice with visual feedback
- **Score Display** - Shows calculated scores and grades

### Navigation
- **Test Selection** - Choose from available tests
- **Question Navigation** - Previous/Next buttons
- **Test Submission** - Submit answers for scoring
- **Results View** - Display scores and feedback

## 🔍 Verification Checklist

Before considering setup complete, verify:

- [ ] PostgreSQL running and accessible
- [ ] Database created with proper credentials
- [ ] Backend server running on port 8000
- [ ] Frontend server running on port 3000
- [ ] API endpoints returning data
- [ ] Tests loading questions from database
- [ ] Images displaying correctly
- [ ] Random selection working (20 questions)
- [ ] Test submission and scoring working
- [ ] All 5 options (A-E) showing for spatial tests

## 🆘 Support

If you encounter issues:

1. **Check TROUBLESHOOTING.md** - Common problems and solutions
2. **Check MANAGEMENT_COMMANDS.md** - Data loading commands
3. **Check SETUP_GUIDE.md** - Complete setup instructions
4. **Check browser console** - Frontend errors
5. **Check backend terminal** - Django errors

## 📝 Notes

- **All data is stored in PostgreSQL database**
- **No hardcoded questions or answers in frontend**
- **Random selection ensures test variety**
- **Scoring is calculated server-side**
- **Images are served from frontend assets**
- **CORS is configured for frontend-backend communication**

## 🎉 Success

Once setup is complete, you'll have a fully functional testing platform with:
- Database-driven question loading
- Random question selection
- Server-side scoring
- Persistent data storage
- Responsive user interface
- Multiple test types
- Image support
- Progress tracking

**Happy Testing!** 🚀
