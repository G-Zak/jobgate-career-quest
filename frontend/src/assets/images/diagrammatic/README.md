# Diagrammatic Reasoning Tests - Image Implementation Guide

## Overview
This directory contains all images and assets for the Diagrammatic Reasoning Tests module, which follows the same structure as the Spatial Reasoning Tests.

## Directory Structure

```
diagrammatic/
├── instructions/
│   ├── section_1_intro.png     # Introduction image for Section 1 (Logical Sequences)
│   └── section_2_intro.png     # Introduction image for Section 2 (Flow Diagrams)
├── questions/
│   ├── section_1/              # Section 1: Logical Sequences (30 questions)
│   │   ├── question_1.png
│   │   ├── question_2.png
│   │   └── ...question_30.png
│   └── section_2/              # Section 2: Flow Diagrams (30 questions)
│       ├── question_1.png
│       ├── question_2.png
│       └── ...question_30.png
└── options/                    # Optional: If using individual option images
    ├── section_1/
    └── section_2/
```

## Test Structure

### Section 1: Logical Sequences (30 questions, 45 minutes)
- **Question Type**: `logical_sequences`
- **Pattern**: Identify patterns in diagrammatic sequences
- **Options**: A, B, C, D, E
- **Focus**: Pattern recognition, logical progression, abstract reasoning

### Section 2: Flow Diagrams (30 questions, 45 minutes)
- **Question Type**: `flow_diagrams`
- **Pattern**: Trace through flowcharts and process diagrams
- **Options**: A, B, C, D, E
- **Focus**: Process analysis, logical flow, decision trees

## Image Specifications

### Question Images
- **Format**: PNG (recommended) or SVG
- **Resolution**: Minimum 800x600px, Maximum 1200x800px
- **Background**: White or transparent
- **Style**: Clean, professional diagrams with clear contrast

### Section 1 Images (Logical Sequences)
- Should show a sequence of 3-4 diagrams with a clear pattern
- The pattern should progress logically (rotation, transformation, addition/removal of elements)
- Include visual elements like shapes, lines, arrows, symbols
- Ensure the pattern is challenging but solvable within the time limit

### Section 2 Images (Flow Diagrams)
- Should show flowcharts with decision points, processes, and outcomes
- Include standard flowchart symbols (rectangles, diamonds, circles, arrows)
- Clear start and end points
- Logical branching with Yes/No decisions
- Process boxes with operations or transformations

## Implementation Notes

### Question Format
Each question image should be complete and self-contained, including:
1. The sequence or flowchart to analyze
2. Clear visual indicators of what needs to be determined
3. Professional appearance consistent with cognitive assessment standards

### Answer Selection
The current implementation uses letter-only buttons (A, B, C, D, E) for answer selection, similar to the spatial tests. Each question image should include all options within the image itself.

### Complexity Progression
Questions are designed with increasing complexity:
- Questions 1-6: Complexity level 1
- Questions 7-12: Complexity level 2
- Questions 13-18: Complexity level 3
- Questions 19-24: Complexity level 4
- Questions 25-30: Complexity level 5

## File Naming Convention

### Question Images
- `question_1.png` to `question_30.png` in each section folder
- Use consistent numbering (no zero-padding needed)

### Instruction Images
- `section_1_intro.png` - Logical Sequences introduction
- `section_2_intro.png` - Flow Diagrams introduction

## Integration Status

✅ **Completed Components:**
- DiagrammaticReasoningTest.jsx - Main test component
- diagrammaticTestSections.js - Test data structure
- MainDashboard.jsx integration
- AvailableTests.jsx integration
- Directory structure created

🔄 **Pending Implementation:**
- Question images (60 total: 30 per section)
- Instruction images (2 total)
- Correct answers mapping in test data
- Testing and validation

## Test IDs and Routing

### Test Identification
- **DRT1**: Section 1 only (Logical Sequences)
- **DRT2**: Section 2 only (Flow Diagrams)
- **Full Test**: All sections combined

### Integration Points
- Tests appear in AvailableTests with "DRT" prefix
- Routing handled in MainDashboard.jsx
- Supports both individual sections and full multi-section tests

## Development Notes

The implementation follows the exact same pattern as SpatialReasoningTest:
- Multi-section support with individual section introductions
- Timer management per section
- Question navigation with answer persistence
- Comprehensive instructions and examples
- Responsive design with scroll management
- Professional assessment interface

To add images, simply place the PNG files in the appropriate directories following the naming convention above.
