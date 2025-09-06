// Multi-section spatial reasoning test data structure
export const getSpatialTestSections = () => ({
  id: 1,
  title: "Spatial Reasoning Assessment",
  description: "Multi-section spatial intelligence evaluation",
  duration_minutes: 105, // Total for all sections (60 + 45)
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
        ...Array.from({ length: 40 }, (_, index) => {
          const questionId = index + 1;
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
            correct_answer: "A", // TODO: Update with actual correct answers from your book
            order: questionId,
            complexity_score: Math.min(5, Math.floor((questionId - 1) / 8) + 1) // Gradually increase difficulty (1-5)
          };
        })
      ]
    },
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
        ...Array.from({ length: 40 }, (_, index) => {
          const questionId = index + 1;
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
            correct_answer: "A", // TODO: Update with actual correct answers from your book
            order: questionId,
            complexity_score: Math.min(5, Math.floor((questionId - 1) / 8) + 1) // Gradually increase difficulty (1-5)
          };
        })
      ]
    }
    // Additional sections can be added here later
    // Section 3: Pattern Recognition
    // Section 4: 3D Visualization
    // etc.
  ]
});

// Individual section functions for separate tests
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
        ...Array.from({ length: 40 }, (_, index) => {
          const questionId = index + 1;
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
            correct_answer: "A", // TODO: Update with actual correct answers from your book
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
        ...Array.from({ length: 40 }, (_, index) => {
          const questionId = index + 1;
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
            correct_answer: "A", // TODO: Update with actual correct answers from your book
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
