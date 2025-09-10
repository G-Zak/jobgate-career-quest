// Multi-section spatial reasoning test data structure
// Each section can have its own intro, instructions, and question types

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
        {
          id: 1,
          question_text: "Which option shows the correct assembly of these shapes?",
          context: "Look at the component shapes and find which option matches when assembled by corresponding letters.",
          question_image: "/src/assets/images/spatial/questions/section_1/question_1.png",
          options: [], // Empty since complete image contains all options
          correct_answer: "A",
          order: 1,
          complexity_score: 2
        },
        {
          id: 2,
          question_text: "Select the correct assembled shape:",
          context: "Match the component pieces to form the target shape.",
          question_image: "/src/assets/images/spatial/questions/section_1/question_2.png",
          options: [
            { id: "A", image: "/src/assets/images/spatial/options/section_1/question_2_option_a.png", text: "Option A" },
            { id: "B", image: "/src/assets/images/spatial/options/section_1/question_2_option_b.png", text: "Option B" },
            { id: "C", image: "/src/assets/images/spatial/options/section_1/question_2_option_c.png", text: "Option C" },
            { id: "D", image: "/src/assets/images/spatial/options/section_1/question_2_option_d.png", text: "Option D" }
          ],
          correct_answer: "B",
          order: 2,
          complexity_score: 2
        },
        {
          id: 3,
          question_text: "Which assembly matches the target configuration?",
          context: "Analyze how the labeled edges should connect.",
          question_image: "/src/assets/images/spatial/questions/section_1/question_3.png",
          options: [
            { id: "A", image: "/src/assets/images/spatial/options/section_1/question_3_option_a.png", text: "Option A" },
            { id: "B", image: "/src/assets/images/spatial/options/section_1/question_3_option_b.png", text: "Option B" },
            { id: "C", image: "/src/assets/images/spatial/options/section_1/question_3_option_c.png", text: "Option C" },
            { id: "D", image: "/src/assets/images/spatial/options/section_1/question_3_option_d.png", text: "Option D" }
          ],
          correct_answer: "C",
          order: 3,
          complexity_score: 3
        },
        {
          id: 4,
          question_text: "Find the correct shape assembly:",
          context: "Consider the orientation and connection points.",
          question_image: "/src/assets/images/spatial/questions/section_1/question_4.png",
          options: [
            { id: "A", image: "/src/assets/images/spatial/options/section_1/question_4_option_a.png", text: "Option A" },
            { id: "B", image: "/src/assets/images/spatial/options/section_1/question_4_option_b.png", text: "Option B" },
            { id: "C", image: "/src/assets/images/spatial/options/section_1/question_4_option_c.png", text: "Option C" },
            { id: "D", image: "/src/assets/images/spatial/options/section_1/question_4_option_d.png", text: "Option D" }
          ],
          correct_answer: "A",
          order: 4,
          complexity_score: 3
        },
        {
          id: 5,
          question_text: "Which option represents the assembled shape?",
          context: "Pay attention to the letter correspondences and final shape.",
          question_image: "/src/assets/images/spatial/questions/section_1/question_5.png",
          options: [
            { id: "A", image: "/src/assets/images/spatial/options/section_1/question_5_option_a.png", text: "Option A" },
            { id: "B", image: "/src/assets/images/spatial/options/section_1/question_5_option_b.png", text: "Option B" },
            { id: "C", image: "/src/assets/images/spatial/options/section_1/question_5_option_c.png", text: "Option C" },
            { id: "D", image: "/src/assets/images/spatial/options/section_1/question_5_option_d.png", text: "Option D" }
          ],
          correct_answer: "D",
          order: 5,
          complexity_score: 4
        },
        {
          id: 6,
          question_text: "Select the correct final assembly:",
          context: "This is a more complex assembly with multiple connection points.",
          question_image: "/src/assets/images/spatial/questions/section_1/question_6.png",
          options: [
            { id: "A", image: "/src/assets/images/spatial/options/section_1/question_6_option_a.png", text: "Option A" },
            { id: "B", image: "/src/assets/images/spatial/options/section_1/question_6_option_b.png", text: "Option B" },
            { id: "C", image: "/src/assets/images/spatial/options/section_1/question_6_option_c.png", text: "Option C" },
            { id: "D", image: "/src/assets/images/spatial/options/section_1/question_6_option_d.png", text: "Option D" }
          ],
          correct_answer: "B",
          order: 6,
          complexity_score: 4
        },
        // Questions 7-40: Template questions for remaining items
        ...Array.from({ length: 39 }, (_, index) => {
          const questionId = index + 2;
          return {
            id: questionId,
            question_text: `Which option shows the correct assembly of these shapes? (Question ${questionId})`,
            context: "Look at the component shapes and find which option matches when assembled by corresponding letters.",
            question_image: `/src/assets/images/spatial/questions/section_1/question_${questionId}.png`,
            options: [], // Empty since complete image contains all options (A, B, C, D, E)
            correct_answer: "A", // TODO: Update with actual correct answers from your book
            order: questionId,
            complexity_score: Math.min(5, Math.floor((questionId - 1) / 8) + 1) // Gradually increase difficulty
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
