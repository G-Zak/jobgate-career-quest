// Abstract Reasoning Test Data
// Single section with 24 questions, 45 minutes duration

export const getAbstractTestSections = () => ({
  id: 'ART',
  title: "Abstract Reasoning Test",
  description: "Pattern Recognition and Logical Sequences",
  duration_minutes: 45,
  total_questions: 24,
  sections: [
    {
      id: 1,
      title: "Abstract Reasoning Assessment",
      description: "Identify patterns and complete logical sequences in abstract diagrams",
      duration_minutes: 45,
      intro_image: "/src/assets/images/abstract/instructions/intro.svg",
      intro_text: {
        title: "ABSTRACT REASONING TEST",
        instructions: [
          "In this test, you will analyze abstract patterns and identify logical relationships.",
          "Look for patterns in shape, color, rotation, and position.",
          "Each question shows a sequence of diagrams with one missing.",
          "Select the option that best completes each sequence.",
          "",
          "You have 45 minutes to complete 24 questions.",
          "Work systematically and trust your logical reasoning.",
          "",
          "Click 'Start Test' when you are ready to begin."
        ]
      },
      questions: Array.from({ length: 24 }, (_, index) => {
        const questionId = index + 1;
        // Questions 10-15 and 24 have 5 options (A-E), others have 4 options (A-D)
        const hasEOption = (questionId >= 10 && questionId <= 15) || questionId === 24;
        const options = hasEOption 
          ? ["A", "B", "C", "D", "E"]
          : ["A", "B", "C", "D"];
        
        return {
          id: questionId,
          question: "Which pattern completes the sequence?",
          options: options,
          image: `/src/assets/images/abstract/questions/${questionId}.png`,
          order: questionId,
          complexity_score: Math.min(5, Math.floor((questionId - 1) / 6) + 1) // Gradually increase difficulty (1-5)
        };
      })
    }
  ]
});

// Export function for getting just the main section
export const getAbstractSection = () => {
  const testData = getAbstractTestSections();
  return {
    ...testData,
    sections: testData.sections
  };
};

// Correct answers array (updated with real answers)
const correctAnswers = [
  'a', 'c', 'c', 'd', 'b', 'b', 'c', 'd', 'a', 'c',  // Questions 1-10 (A-D)
  'c', 'd', 'a', 'd', 'e', 'd', 'a', 'c', 'a', 'b',  // Questions 11-20 (11-15 have E option)
  'd', 'b', 'c', 'c'                                   // Questions 21-24 (24 has E option)
]; // 24 answers - UPDATED WITH REAL ANSWERS

// Add correct answers to questions
export const getAbstractTestWithAnswers = () => {
  const testData = getAbstractTestSections();
  testData.sections[0].questions = testData.sections[0].questions.map((question, index) => ({
    ...question,
    correct_answer: correctAnswers[index]
  }));
  return testData;
};
