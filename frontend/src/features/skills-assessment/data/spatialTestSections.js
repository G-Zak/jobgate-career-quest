// Multi-section spatial reasoning test data structure
export const getSpatialTestSections = () => {
  return {
    title: "Spatial Reasoning Tests",
    total_duration_minutes: 249, // 60 + 45 + 90 + 40 + 7 + 7
    sections: [
      getSpatialSection1(),
      getSpatialSection2(),
      getSpatialSection3(),
      getSpatialSection4(),
      getSpatialSection5(),
      getSpatialSection6(),
    ]
  };
};// Individual section functions for separate tests
export const getSpatialSection1 = () => ({
  id: 1,
  title: "Spatial Reasoning Assessment - Section 1",
  description: "Shape Assembly - Match component shapes to target configurations",
  duration_minutes: 60,
  sections: [
    {
      id: 1,
      title: "Section 1: Shape Assembly",
      description: "Match component shapes to target configurations",
      duration_minutes: 60,
      intro_image: "/src/assets/images/spatial/instructions/section_1_intro.png",
      intro_text: {
        title: "SPATIAL REASONING TESTS SECTION 1",
        instructions: [
          "Take a look at the following 3 shapes. Note the letters on the side of each shape:",
          "Join all of the 3 shapes together with the corresponding letters to make the following shape:",
          "During the following spatial reasoning exercise your task is to look at the given shapes and decide which of the examples match the shape when joined together by the corresponding letters. You have 60 minutes to answer the 40 questions."
        ]
      },
      question_type: "shape_assembly",
      total_questions: 40,
      questions: [
        // All 40 questions for Section 1: Shape Assembly
        // Section 1 Answer Key: Q1-Q40
        ...Array.from({ length: 40 }, (_, index) => {
          const questionId = index + 1;
          // Answer key for Section 1: Q1-Q40
          const answerKey = [
            "B", "D", "A", "E", "D", "B", "A", "C", "A", "C", // Q1-Q10
            "D", "B", "E", "A", "C", "D", "E", "A", "C", "B", // Q11-Q20
            "E", "E", "C", "C", "E", "B", "E", "D", "E", "A", // Q21-Q30
            "E", "C", "E", "B", "C", "B", "A", "D", "E", "A"  // Q31-Q40
          ];
          
          return {
            id: questionId,
            question_text: `Which option shows the correct assembly of these shapes?`,
            context: "Look at the component shapes and find which option matches when assembled by corresponding letters.",
            question_image: `/src/assets/images/spatial/questions/section_1/question_${questionId}.png`,
            options: [
              { id: "A", text: "Option A" },
              { id: "B", text: "Option B" },
              { id: "C", text: "Option C" },
              { id: "D", text: "Option D" },
              { id: "E", text: "Option E" }
            ],
            correct_answer: answerKey[questionId - 1],
            order: questionId,
            complexity_score: Math.min(5, Math.floor((questionId - 1) / 8) + 1) // Gradually increase difficulty (1-5)
          };
        })
      ]
    }
  ]
});

export const getSpatialSection2 = () => ({
  id: 2,
  title: "Spatial Reasoning Assessment - Section 2",
  description: "Mental Rotation - Rotate 3D objects mentally and match them with examples",
  duration_minutes: 45,
  sections: [
    {
      id: 2,
      title: "Section 2: Mental Rotation",
      description: "Rotate 3D objects mentally and match them with examples",
      duration_minutes: 45,
      intro_image: "/src/assets/images/spatial/instructions/section_2_intro.png",
      intro_text: {
        title: "SPATIAL REASONING TESTS SECTION 2",
        instructions: [
          "During the second spatial reasoning test that I've provided you with, you will be required to look at 3-dimensional objects.",
          "You have to imagine the 3-dimensional objects rotated in a specific way and then match them up against a choice of examples.",
          "Both objects rotate the same amount.",
          "",
          "EXAMPLE:",
          "Look at the 2 objects below:",
          "• A tall rectangular block with a black dot",
          "• A longer horizontal rectangular piece with a black dot",
          "",
          "You now have to decide which of the 4 options provided demonstrates both objects rotated with the dot in the correct position:",
          "",
          "A) Objects positioned horizontally with dots aligned",
          "B) Objects positioned vertically - one tall block, one horizontal piece", 
          "C) Objects positioned at different angles with dots correctly aligned ✓",
          "D) Objects positioned at angles with dots in different positions",
          "",
          "The correct answer is C - This shows both objects properly rotated with the dots in the correct position.",
          "",
          "INSTRUCTIONS:",
          "Now move on to spatial reasoning test exercise 2 on the following page.",
          "You have 45 minutes in which to complete the 40 questions.",
          "For each question, select the letter (A, B, C, or D) that corresponds to the correct answer."
        ]
      },
      question_type: "mental_rotation",
      total_questions: 40,
      questions: [
        // All 40 questions for Section 2: Mental Rotation
        // Section 2 Answer Key: Q1-Q40 (Note: These correspond to Q27-Q40 in the overall test)
        ...Array.from({ length: 40 }, (_, index) => {
          const questionId = index + 1;
          // Answer key for Section 2: Q1-Q40 (Mental Rotation)
          // Based on provided answers for Q27-Q40: C,B,D,D,A,A,B,C,B,C,C,A,B,C
          // These are the first 14 answers for Section 2 (Q1-Q14)
          const answerKey = [
            "C", "B", "D", "D", "A", "A", "B", "C", "B", "C", // Q1-Q10
            "C", "A", "B", "C", "A", "A", "A", "A", "A", "A", // Q11-Q20 (placeholder for remaining)
            "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", // Q21-Q30 (placeholder)
            "A", "A", "A", "A", "A", "A", "A", "A", "A", "A"  // Q31-Q40 (placeholder)
          ];
          
          return {
            id: questionId,
            question_text: `Which option shows both objects rotated with the dot in the correct position?`,
            context: "Imagine the 3D objects rotated and match them against the examples provided.",
            question_image: `/src/assets/images/spatial/questions/section_2/question_${questionId}.png`,
            options: [
              { id: "A", text: "Option A" },
              { id: "B", text: "Option B" },
              { id: "C", text: "Option C" },
              { id: "D", text: "Option D" }
            ],
            correct_answer: answerKey[questionId - 1],
            order: questionId,
            complexity_score: Math.min(5, Math.floor((questionId - 1) / 8) + 1) // Gradually increase difficulty (1-5)
          };
        })
      ]
    }
  ]
});

// Helper functions for section-based paths
export const getSectionQuestionImagePath = (sectionId, questionId) => {
  return `/src/assets/images/spatial/questions/section_${sectionId}/question_${questionId}.png`;
};

export const getSectionOptionImagePath = (sectionId, questionId, optionLetter) => {
  return `/src/assets/images/spatial/options/section_${sectionId}/question_${questionId}_option_${optionLetter.toLowerCase()}.png`;
};

export const getSectionIntroImagePath = (sectionId) => {
  return `/src/assets/images/spatial/instructions/section_${sectionId}_intro.png`;
};

// Helper functions for test navigation
export const getCurrentSection = (testData, sectionId) => {
  return testData.sections.find(section => section.id === sectionId);
};

export const getCurrentQuestion = (testData, sectionId, questionNumber) => {
  const section = getCurrentSection(testData, sectionId);
  return section?.questions.find(q => q.order === questionNumber);
};

export const getGlobalQuestionNumber = (testData, sectionId, localQuestionNumber) => {
  let globalNumber = 0;
  for (let i = 0; i < testData.sections.length; i++) {
    if (testData.sections[i].id === sectionId) {
      return globalNumber + localQuestionNumber;
    }
    globalNumber += testData.sections[i].total_questions;
  }
  return globalNumber + localQuestionNumber;
};

export const getTotalQuestions = (testData) => {
  return testData.sections.reduce((total, section) => total + section.total_questions, 0);
};

export const getSpatialSection3 = () => ({
  id: 3,
  title: "Spatial Reasoning Assessment - Section 3",
  description: "Spatial Visualization - Complete 3D patterns and identify missing elements",
  duration_minutes: 90,
  sections: [
    {
      id: 3,
      title: "Section 3: Spatial Visualization",
      description: "Complete 3D patterns and identify missing elements",
      duration_minutes: 90,
      intro_image: "/src/assets/images/spatial/instructions/section_3_intro.png",
      intro_text: {
        title: "SPATIAL REASONING TESTS SECTION 3",
        instructions: [
          "During the third spatial reasoning test that I've provided you with, you will be required to analyze 3-dimensional patterns and visual arrangements.",
          "You have to identify missing elements, complete patterns, or determine how objects would look from different perspectives.",
          "Each question presents a 3D spatial scenario where you must visualize the complete picture.",
          "",
          "EXAMPLE:",
          "Look at the 3D arrangement below:",
          "• A series of interconnected blocks forming a specific pattern",
          "• One section is missing from the arrangement",
          "",
          "You now have to decide which of the 4 options provided correctly completes the pattern:",
          "",
          "A) A block that doesn't fit the spatial requirements",
          "B) A block oriented incorrectly for the pattern", 
          "C) A block that completes the pattern correctly ✓",
          "D) A block that overlaps with existing elements",
          "",
          "The correct answer is C - This block fits perfectly and completes the 3D pattern.",
          "",
          "INSTRUCTIONS:",
          "Now move on to spatial reasoning test exercise 3 on the following page.",
          "You have 90 minutes in which to complete the 40 questions.",
          "For each question, select the letter (A, B, C, or D) that corresponds to the correct answer."
        ]
      },
      question_type: "spatial_visualization",
      total_questions: 40,
      questions: [
        // All 40 questions for Section 3: Spatial Visualization
        ...Array.from({ length: 40 }, (_, index) => {
          const questionId = index + 1;
          return {
            id: questionId,
            question_text: `Which option correctly completes the 3D pattern or arrangement?`,
            context: "Analyze the spatial arrangement and identify the missing element that completes the pattern.",
            question_image: `/src/assets/images/spatial/questions/section_3/question_${questionId}.png`,
            options: ["A", "B", "C", "D"],
            correct_answer: "A", // TODO: Update with actual correct answers from your book
            order: questionId,
            complexity_score: Math.min(5, Math.floor((questionId - 1) / 8) + 1) // Gradually increase difficulty (1-5)
          };
        })
      ]
    }
  ]
});

export const getSpatialSection4 = () => ({
  id: 4,
  title: "Spatial Reasoning Assessment - Section 4",
  description: "Figure Identification - Identify which figure is identical to the first (may be rotated)",
  duration_minutes: 40,
  sections: [
    {
      id: 4,
      title: "Section 4: Figure Identification",
      description: "Identify which figure is identical to the first (may be rotated)",
      duration_minutes: 40,
      intro_image: "/src/assets/images/spatial/instructions/section_4_intro.png",
      intro_text: {
        title: "SPATIAL REASONING TESTS SECTION 4",
        instructions: [
          "In spatial reasoning exercise 4 you need to identify which of the 4 figures presented (A, B, C or D) is identical to the first.",
          "Take a look at the following sample question:",
          "",
          "Sample question",
          "Which of the 4 figures presented (A, B, C or D) is identical to the first?",
          "",
          "You will notice that the only shape from the 4 presented (A, B, C or D), shape A is identical to the first one when rotated either way.",
          "",
          "INSTRUCTIONS:",
          "You now have 40 minutes to answer the 40 questions that follow.",
          "For each question, select the letter (A, B, C, or D) that corresponds to the correct answer."
        ]
      },
      question_type: "figure_identification",
      total_questions: 40,
      questions: [
        // All 40 questions for Section 4: Figure Identification
        ...Array.from({ length: 40 }, (_, index) => {
          const questionId = index + 1;
          return {
            id: questionId,
            question_text: `Which of the 4 figures presented (A, B, C or D) is identical to the first?`,
            context: "Look at the first figure and identify which of the four options (A, B, C, or D) is identical to it when rotated.",
            question_image: `/src/assets/images/spatial/questions/section_4/question_${questionId}.png`,
            options: ["A", "B", "C", "D"],
            correct_answer: "A", // TODO: Update with actual correct answers from your book
            order: questionId,
            complexity_score: Math.min(5, Math.floor((questionId - 1) / 8) + 1) // Gradually increase difficulty (1-5)
          };
        })
      ]
    }
  ]
});

export const getSpatialSection5 = () => ({
  id: 5,
  title: "Spatial Reasoning Assessment - Section 5",
  description: "Rotation Recognition - Identify which figure is a rotation of the question figure",
  duration_minutes: 7,
  sections: [
    {
      id: 5,
      title: "Section 5: Rotation Recognition",
      description: "Identify which figure is a rotation of the question figure",
      duration_minutes: 7,
      intro_image: "/src/assets/images/spatial/instructions/section_5_intro.png",
      intro_text: {
        title: "SPATIAL REASONING TESTS SECTION 7",
        instructions: [
          "In this next set of questions you have to identify which of the Answer figures is a rotation of the Question figure.",
          "You have to rotate the Question figure in your head and identify which of the Answer figures is the correct answer.",
          "",
          "Take a look at the following question:",
          "Q. Which of the Answer figures is a rotation of the Question figure?",
          "",
          "You will notice that shape E is the only option from the 5 which is identical when rotated.",
          "With this type of question be careful not to fall into the trap of looking for 'mirror' images of the Question figure.",
          "Instead, make sure you mentally rotate the Question figure in your mind until you identify the correct option from the Answer figures.",
          "",
          "Once you understand what is required, work through the following exercise as quickly and accurately as possible.",
          "",
          "INSTRUCTIONS:",
          "There are 20 questions and you have 7 minutes to complete the test.",
          "For each question, select the letter (A, B, C, D, or E) that corresponds to the correct answer."
        ]
      },
      question_type: "rotation_recognition",
      total_questions: 20,
      questions: [
        // All 20 questions for Section 5: Rotation Recognition
        ...Array.from({ length: 20 }, (_, index) => {
          const questionId = index + 1;
          return {
            id: questionId,
            question_text: `Which of the Answer figures is a rotation of the Question figure?`,
            context: "Mentally rotate the question figure in your head and identify which of the answer figures matches when rotated.",
            question_image: `/src/assets/images/spatial/questions/section_5/question_${questionId}.png`,
            options: ["A", "B", "C", "D", "E"],
            correct_answer: "E", // TODO: Update with actual correct answers from your book (based on your attachment, E is correct)
            order: questionId,
            complexity_score: Math.min(5, Math.floor((questionId - 1) / 4) + 1) // Gradually increase difficulty (1-5)
          };
        })
      ]
    }
  ]
});

export const getSpatialSection6 = () => ({
  id: 6,
  title: "Spatial Reasoning Assessment - Section 6",
  description: "Component Assembly - Identify which component shape can be made from component parts",
  duration_minutes: 7,
  sections: [
    {
      id: 6,
      title: "Section 6: Component Assembly",
      description: "Identify which component shape can be made from component parts",
      duration_minutes: 7,
      intro_image: "/src/assets/images/spatial/instructions/section_6_intro.png",
      intro_text: {
        title: "SPATIAL REASONING TESTS SECTION 8",
        instructions: [
          "In this next set of questions you have to identify which of the COMPONENT SHAPES can be made from the COMPONENT PARTS.",
          "You decide which of the component shapes is built from the component parts.",
          "You need to do this visually and mentally. Shapes CAN be rotated.",
          "",
          "Take a look at the following question:",
          "Q. Which of the COMPONENT SHAPES can be made from the COMPONENT PARTS?",
          "",
          "You will notice that COMPONENT SHAPE A is the only option from the 4 which can be assembled from the COMPONENT PARTS.",
          "",
          "Once you understand what is required, work through the following exercise as quickly and accurately as possible.",
          "",
          "INSTRUCTIONS:",
          "There are 20 questions and you have 7 minutes to complete the test.",
          "For each question, select the letter (A, B, C, or D) that corresponds to the correct answer."
        ]
      },
      question_type: "component_assembly",
      total_questions: 20,
      questions: [
        // All 20 questions for Section 6: Component Assembly
        ...Array.from({ length: 20 }, (_, index) => {
          const questionId = index + 1;
          return {
            id: questionId,
            question_text: `Which of the COMPONENT SHAPES can be made from the COMPONENT PARTS?`,
            context: "Visually and mentally identify which component shape can be assembled from the given component parts. Shapes can be rotated.",
            question_image: `/src/assets/images/spatial/questions/section_6/question_${questionId}.png`,
            options: ["A", "B", "C", "D"],
            correct_answer: "A", // TODO: Update with actual correct answers from your book (based on your attachment, A is correct)
            order: questionId,
            complexity_score: Math.min(5, Math.floor((questionId - 1) / 4) + 1) // Gradually increase difficulty (1-5)
          };
        })
      ]
    }
  ]
});
