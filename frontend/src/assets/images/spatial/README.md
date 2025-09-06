# Multi-Section Spatial Reasoning Test

This spatial reasoning test now supports multiple sections, each with its own introduction, question types, and image sets. Section 1 focuses on shape assembly tasks based on the provided instruction image.

## Directory Structure

```
frontend/src/assets/images/spatial/
├── instructions/       # Section introduction images
│   ├── section_1_intro.png
│   ├── section_2_intro.png
│   └── ...
├── questions/          # Question images organized by section
│   ├── section_1/
│   │   ├── question_1.png
│   │   ├── question_2.png
│   │   └── ...
│   ├── section_2/
│   │   ├── question_1.png
│   │   └── ...
│   └── ...
├── options/            # Answer option images organized by section
│   ├── section_1/
│   │   ├── question_1_option_a.png
│   │   ├── question_1_option_b.png
│   │   └── ...
│   ├── section_2/
│   │   └── ...
│   └── ...
└── mental_rotation/    # Legacy generated patterns (kept for reference)
```

## Section 1: Shape Assembly

Based on the provided instruction image, Section 1 tests shape assembly skills:

- **Task**: Look at component shapes with letter labels (e.g., hexagon with 'a', triangle with 'a' and 'b', square with 'b')
- **Goal**: Identify which option shows the correct assembly when shapes are joined at corresponding letters
- **Skills Tested**: Spatial visualization, pattern matching, geometric reasoning

### Section 1 Instructions Summary
- "Take a look at the following 3 shapes. Note the letters on the side of each shape"
- "Join all of the 3 shapes together with the corresponding letters to make the following shape"
- "Look at the given shapes and decide which of the examples match the shape when joined together by the corresponding letters"

## Adding New Sections

### 1. Create Section Directory Structure

```bash
mkdir -p frontend/src/assets/images/spatial/questions/section_X
mkdir -p frontend/src/assets/images/spatial/options/section_X
```

### 2. Add Section Introduction Image

Save your section intro image as:
`frontend/src/assets/images/spatial/instructions/section_X_intro.png`

### 3. Update Test Data

Edit `/frontend/src/features/skills-assessment/data/spatialTestSections.js`:

```javascript
// Add new section to the sections array
{
  id: X,
  title: "Section X: Your Section Name",
  description: "Description of what this section tests",
  duration_minutes: 15,
  intro_image: getSectionIntroImagePath(X),
  intro_text: {
    title: "SECTION TITLE",
    instructions: [
      "Instruction 1",
      "Instruction 2",
      // ...
    ]
  },
  question_type: "your_question_type",
  total_questions: 6,
  questions: [
    // Your questions here
  ]
}
```

## Image Naming Conventions

**Section Intro Images:**
- Format: `section_X_intro.png`
- Example: `section_1_intro.png`, `section_2_intro.png`

**Question Images:**
- Format: `section_X/question_Y.png`
- Example: `section_1/question_1.png`, `section_1/question_2.png`

**Option Images:**
- Format: `section_X/question_Y_option_Z.png`
- Example: `section_1/question_1_option_a.png`, etc.

## Recommended Image Specs

- **Introduction Images:** 800x600px (4:3 ratio) for clear instruction display
- **Question Images:** 600x400px (3:2 ratio) for main content
- **Option Images:** 150x150px (square) for consistent option display
- **Format:** PNG for crisp graphics, JPG for photographs
- **Background:** White or transparent for consistency

## Section Flow

1. **Main Instructions**: Overview of entire test
2. **Section Introduction**: Specific instructions for current section with intro image
3. **Test Questions**: Section-specific questions with navigation
4. **Results**: Combined results across all sections

## Helper Functions

The system provides automatic path generation:

```javascript
getSectionIntroImagePath(sectionId)         // → section intro image path
getSectionQuestionImagePath(sectionId, qId) // → question image path  
getSectionOptionImagePath(sectionId, qId, option) // → option image path
```

This makes it easy to reorganize files or change naming conventions.
