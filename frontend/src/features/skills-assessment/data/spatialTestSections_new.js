// Multi-section spatial reasoning test data structure
export const getSpatialTestSections = () => ({
  id: 1,
  title: "Spatial Reasoning Assessment",
  description: "Multi-section spatial intelligence evaluation",
  duration_minutes: 90, // Total for all sections
  sections: [
    {
      id: 1,
      title: "Section 1: Shape Assembly",
      description: "Match component shapes to target configurations",
      duration_minutes: 45,
      intro_image: "/src/assets/images/spatial/instructions/section_1_intro.png",
      intro_text: {
        title: "SPATIAL REASONING TESTS SECTION 1",
        instructions: [
          "Take a look at the following 3 shapes. Note the letters on the side of each shape:",
          "Join all of the 3 shapes together with the corresponding letters to make the following shape:",
          "During the following spatial reasoning exercise your task is to look at the given shapes and decide which of the examples match the shape when joined together by the corresponding letters. You have 45 minutes to answer the 40 questions."
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
            options: [], // Empty since complete image contains all options (A, B, C, D, E)
            correct_answer: "A", // TODO: Update with actual correct answers from your book
            order: questionId,
            complexity_score: Math.min(5, Math.floor((questionId - 1) / 8) + 1) // Gradually increase difficulty (1-5)
          };
        })
      ]
    }
    // Additional sections can be added here later
    // Section 2: Mental Rotation
    // Section 3: Pattern Recognition
    // Section 4: 3D Visualization
    // etc.
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
