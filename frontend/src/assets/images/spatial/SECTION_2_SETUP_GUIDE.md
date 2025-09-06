# Section 2: Mental Rotation - Setup Guide

## ✅ **Section 2 Added Successfully!**

### **Configuration Complete:**
- ✅ **Section 2 data structure** created with mental rotation focus
- ✅ **Directory structure** ready for question images
- ✅ **Instruction text** from your book implemented
- ✅ **45-minute duration** configured (same as Section 1)
- ✅ **40 questions** template ready

## 📁 **Directory Structure for Section 2:**

```
frontend/src/assets/images/spatial/
├── instructions/
│   ├── section_1_intro.png ✅
│   └── section_2_intro.png ← Add your Section 2 intro image here
├── questions/
│   ├── section_1/ ✅ (40 questions)
│   └── section_2/ ← Add your Section 2 question images here
└── options/
    ├── section_1/ (if needed)
    └── section_2/ (if needed)
```

## 🎯 **Section 2 Details:**

### **Question Type:** Mental Rotation
- **Focus**: 3D object rotation and spatial visualization
- **Task**: Match rotated 3D objects with correct orientations
- **Key Element**: Both objects rotate the same amount
- **Special Feature**: Dot position tracking during rotation

### **Instructions Configured:**
```
"During the second spatial reasoning test that I've provided you with, you will be required to look at 3-dimensional objects. You have to imagine the 3-dimensional objects rotated in a specific way and then match them up against a choice of examples."

"Both objects rotate the same amount."

"You now have to decide which of the 4 options provided demonstrates both objects rotated with the dot in the correct position."
```

## 📝 **What You Need to Do:**

### **1. Add Section 2 Intro Image**
Save your Section 2 instruction image as:
```
/frontend/src/assets/images/spatial/instructions/section_2_intro.png
```

### **2. Add Section 2 Question Images**
Save your 40 Section 2 question images as:
```
/frontend/src/assets/images/spatial/questions/section_2/question_1.png
/frontend/src/assets/images/spatial/questions/section_2/question_2.png
...
/frontend/src/assets/images/spatial/questions/section_2/question_40.png
```

### **3. Update Correct Answers**
Edit the data file to set correct answers for Section 2:
```javascript
// In spatialTestSections.js, find Section 2 questions and update:
correct_answer: "C", // Change from "A" to actual correct answer
```

## 🔄 **Test Flow Updated:**

1. **Main Instructions** → Overview of entire 2-section test
2. **Section 1 Intro** → Shape assembly instructions  
3. **Section 1 Questions** → 40 shape assembly questions
4. **Section 2 Intro** → Mental rotation instructions
5. **Section 2 Questions** → 40 mental rotation questions  
6. **Results** → Combined results from both sections

## ⏱️ **Test Duration:**
- **Section 1**: 45 minutes (Shape Assembly)
- **Section 2**: 45 minutes (Mental Rotation)  
- **Total**: 135 minutes (2.25 hours with buffer)

## 🎉 **Ready Features:**
- ✅ **Multi-section navigation** working
- ✅ **Section-specific intros** with different instruction images
- ✅ **Progress tracking** across sections
- ✅ **Answer storage** separated by section
- ✅ **Results calculation** for combined performance

The test now supports both Section 1 (Shape Assembly) and Section 2 (Mental Rotation) with proper navigation between them! 🚀
