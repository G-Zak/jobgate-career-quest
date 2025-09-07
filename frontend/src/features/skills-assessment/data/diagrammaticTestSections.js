// Multi-section diagrammatic reasoning test data structure
export const getDiagrammaticTestSections = () => ({
  id: 1,
  title: "Diagrammatic Reasoning Assessment",
  description: "Multi-section diagrammatic logic evaluation",
  duration_minutes: 75, // Total for all sections (30 + 45)
  sections: [
    {
      id: 1,
      title: "Section 1: Logical Sequences",
      description: "Identify patterns and complete logical sequences",
      duration_minutes: 30,
      intro_image: "/src/assets/images/diagrammatic/instructions/section_1_intro.png",
      intro_text: {
        title: "DIAGRAMMATIC REASONING TESTS SECTION 1",
        instructions: [
          "Look at the following sequence of diagrams. Each sequence follows a logical pattern:",
          "Study the pattern carefully and determine what comes next in the sequence:",
          "During the following diagrammatic reasoning exercise your task is to look at the given sequences and decide which of the examples completes the pattern. You have 45 minutes to answer the 20 questions."
        ]
      },
      question_type: "logical_sequences",
      total_questions: 20,
      questions: [
        // All 20 questions for Section 1: Logical Sequences
        ...Array.from({ length: 20 }, (_, index) => {
          const questionId = index + 1;
          const correctAnswers = ["B", "C", "C", "B", "D", "C", "D", "A", "B", "C", "A", "D", "A", "C", "B", "B", "B", "A", "B", "D"];
          return {
            id: questionId,
            question_text: `Which option completes the logical sequence?`,
            context: "Study the pattern in the sequence and determine which option logically follows.",
            question_image: `/src/assets/images/diagrammatic/questions/section_1/question_${questionId}.png`,
            options: [
              { id: "A", text: "Option A" },
              { id: "B", text: "Option B" },
              { id: "C", text: "Option C" },
              { id: "D", text: "Option D" },
              { id: "E", text: "Option E" }
            ],
            correct_answer: correctAnswers[index],
            order: questionId,
            complexity_score: Math.min(5, Math.floor((questionId - 1) / 4) + 1) // Gradually increase difficulty (1-5)
          };
        })
      ]
    },
    {
      id: 2,
      title: "Section 2: Flow Diagrams",
      description: "Trace through flowcharts and determine logical outcomes",
      duration_minutes: 45,
      intro_image: "/src/assets/images/diagrammatic/instructions/section_2_intro.png",
      intro_text: {
        title: "DIAGRAMMATIC REASONING TESTS SECTION 2",
        instructions: [
          "In this section, you will work with flow diagrams and process charts.",
          "You need to trace through the logical flow and determine the correct outcome.",
          "Follow the arrows and apply the rules shown in each diagram.",
          "",
          "EXAMPLE:",
          "Look at the flow diagram below:",
          "• Start with an input value",
          "• Follow the decision points (Yes/No branches)",
          "• Apply the operations shown in each box",
          "",
          "You have to decide which output is correct based on the given input:",
          "",
          "A) Output after following the 'Yes' branch",
          "B) Output after following the 'No' branch", 
          "C) Output after applying all transformations ✓",
          "D) Output with incorrect rule application",
          "",
          "The correct answer is C - This shows the result after correctly following the flow.",
          "",
          "INSTRUCTIONS:",
          "Now move on to diagrammatic reasoning test exercise 2 on the following page.",
          "You have 45 minutes in which to complete the 30 questions.",
          "For each question, select the letter (A, B, C, D, or E) that corresponds to the correct answer."
        ]
      },
      question_type: "flow_diagrams",
      total_questions: 30,
      questions: [
        // All 30 questions for Section 2: Flow Diagrams
        ...Array.from({ length: 30 }, (_, index) => {
          const questionId = index + 1;
          return {
            id: questionId,
            question_text: `What is the correct output when following this flow diagram?`,
            context: "Trace through the flowchart step by step and determine the logical outcome.",
            question_image: `/src/assets/images/diagrammatic/questions/section_2/question_${questionId}.png`,
            options: [
              { id: "A", text: "Option A" },
              { id: "B", text: "Option B" },
              { id: "C", text: "Option C" },
              { id: "D", text: "Option D" },
              { id: "E", text: "Option E" }
            ],
            correct_answer: "A", // TODO: Update with actual correct answers
            order: questionId,
            complexity_score: Math.min(5, Math.floor((questionId - 1) / 6) + 1) // Gradually increase difficulty (1-5)
          };
        })
      ]
    }
    // Additional sections can be added here later
    // Section 3: Network Analysis
    // Section 4: Process Diagrams
    // etc.
  ]
});

// Individual section functions for separate tests
export const getDiagrammaticSection1 = () => ({
  id: 1,
  title: "Diagrammatic Reasoning Assessment - Section 1",
  description: "Logical Sequences - Identify patterns and complete logical sequences",
  duration_minutes: 30,
  sections: [
    {
      id: 1,
      title: "Section 1: Logical Sequences",
      description: "Identify patterns and complete logical sequences",
      duration_minutes: 30,
      intro_image: "/src/assets/images/diagrammatic/instructions/section_1_intro.png",
      intro_text: {
        title: "DIAGRAMMATIC REASONING TESTS SECTION 1",
        instructions: [
          "Look at the following sequence of diagrams. Each sequence follows a logical pattern:",
          "Study the pattern carefully and determine what comes next in the sequence:",
          "During the following diagrammatic reasoning exercise your task is to look at the given sequences and decide which of the examples completes the pattern. You have 45 minutes to answer the 20 questions."
        ]
      },
      question_type: "logical_sequences",
      total_questions: 20,
      questions: [
        // All 20 questions for Section 1: Logical Sequences
        ...Array.from({ length: 20 }, (_, index) => {
          const questionId = index + 1;
          const correctAnswers = ["B", "C", "C", "B", "D", "C", "D", "A", "B", "C", "A", "D", "A", "C", "B", "B", "B", "A", "B", "D"];
          return {
            id: questionId,
            question_text: `Which option completes the logical sequence?`,
            context: "Study the pattern in the sequence and determine which option logically follows.",
            question_image: `/src/assets/images/diagrammatic/questions/section_1/question_${questionId}.png`,
            options: [
              { id: "A", text: "Option A" },
              { id: "B", text: "Option B" },
              { id: "C", text: "Option C" },
              { id: "D", text: "Option D" },
              { id: "E", text: "Option E" }
            ],
            correct_answer: correctAnswers[index],
            order: questionId,
            complexity_score: Math.min(5, Math.floor((questionId - 1) / 4) + 1) // Gradually increase difficulty (1-5)
          };
        })
      ]
    }
  ]
});

export const getDiagrammaticSection2 = () => ({
  id: 2,
  title: "Diagrammatic Reasoning Assessment - Section 2",
  description: "Flow Diagrams - Trace through flowcharts and determine logical outcomes",
  duration_minutes: 45,
  sections: [
    {
      id: 2,
      title: "Section 2: Flow Diagrams",
      description: "Trace through flowcharts and determine logical outcomes",
      duration_minutes: 45,
      intro_image: "/src/assets/images/diagrammatic/instructions/section_2_intro.png",
      intro_text: {
        title: "DIAGRAMMATIC REASONING TESTS SECTION 2",
        instructions: [
          "In this section, you will work with flow diagrams and process charts.",
          "You need to trace through the logical flow and determine the correct outcome.",
          "Follow the arrows and apply the rules shown in each diagram.",
          "",
          "EXAMPLE:",
          "Look at the flow diagram below:",
          "• Start with an input value",
          "• Follow the decision points (Yes/No branches)",
          "• Apply the operations shown in each box",
          "",
          "You have to decide which output is correct based on the given input:",
          "",
          "A) Output after following the 'Yes' branch",
          "B) Output after following the 'No' branch", 
          "C) Output after applying all transformations ✓",
          "D) Output with incorrect rule application",
          "",
          "The correct answer is C - This shows the result after correctly following the flow.",
          "",
          "INSTRUCTIONS:",
          "Now move on to diagrammatic reasoning test exercise 2 on the following page.",
          "You have 45 minutes in which to complete the 30 questions.",
          "For each question, select the letter (A, B, C, D, or E) that corresponds to the correct answer."
        ]
      },
      question_type: "flow_diagrams",
      total_questions: 30,
      questions: [
        // All 30 questions for Section 2: Flow Diagrams
        ...Array.from({ length: 30 }, (_, index) => {
          const questionId = index + 1;
          return {
            id: questionId,
            question_text: `What is the correct output when following this flow diagram?`,
            context: "Trace through the flowchart step by step and determine the logical outcome.",
            question_image: `/src/assets/images/diagrammatic/questions/section_2/question_${questionId}.png`,
            options: [
              { id: "A", text: "Option A" },
              { id: "B", text: "Option B" },
              { id: "C", text: "Option C" },
              { id: "D", text: "Option D" },
              { id: "E", text: "Option E" }
            ],
            correct_answer: "A", // TODO: Update with actual correct answers
            order: questionId,
            complexity_score: Math.min(5, Math.floor((questionId - 1) / 6) + 1) // Gradually increase difficulty (1-5)
          };
        })
      ]
    }
  ]
});

// Helper functions for section-based paths
export const getSectionQuestionImagePath = (sectionId, questionId) => {
  return `/src/assets/images/diagrammatic/questions/section_${sectionId}/question_${questionId}.png`;
};

export const getSectionOptionImagePath = (sectionId, questionId, optionLetter) => {
  return `/src/assets/images/diagrammatic/options/section_${sectionId}/question_${questionId}_option_${optionLetter.toLowerCase()}.png`;
};

export const getSectionIntroImagePath = (sectionId) => {
  return `/src/assets/images/diagrammatic/instructions/section_${sectionId}_intro.png`;
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
