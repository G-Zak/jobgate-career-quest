// Abstract Reasoning Test Data
// Single section with 25 questions, 45 minutes duration

// Define question configurations for better readability and maintenance
const QUESTIONS_CONFIG = [
 // Format: {id, text, options, complexity, answer}

 // Question 0 (first image 0.png) - Example question
 { id: 0, text: "Which figure completes the series?", options: 4, complexity: 1, answer: "A" },

 // Questions 1-5: Which figure completes the series? → 4 choices (A–D)
 { id: 1, text: "Which figure completes the series?", options: 4, complexity: 1, answer: "C" },
 { id: 2, text: "Which figure completes the series?", options: 4, complexity: 1, answer: "C" },
 { id: 3, text: "Which figure completes the series?", options: 4, complexity: 1, answer: "D" },
 { id: 4, text: "Which figure completes the series?", options: 4, complexity: 1, answer: "B" },

 // Questions 5-9: Which figure completes the statement? → 4 choices (A–D)
 { id: 5, text: "Which figure completes the statement?", options: 4, complexity: 2, answer: "B" },
 { id: 6, text: "Which figure completes the statement?", options: 4, complexity: 2, answer: "C" },
 { id: 7, text: "Which figure completes the statement?", options: 4, complexity: 2, answer: "D" },
 { id: 8, text: "Which figure completes the statement?", options: 4, complexity: 2, answer: "A" },
 { id: 9, text: "Which figure completes the statement?", options: 4, complexity: 2, answer: "C" },

 // Questions 10-14: Which figure is the odd one out? → 5 choices (A–E)
 { id: 10, text: "Which figure is the odd one out?", options: 5, complexity: 3, answer: "C" },
 { id: 11, text: "Which figure is the odd one out?", options: 5, complexity: 3, answer: "D" },
 { id: 12, text: "Which figure is the odd one out?", options: 5, complexity: 3, answer: "A" },
 { id: 13, text: "Which figure is the odd one out?", options: 5, complexity: 3, answer: "D" },
 { id: 14, text: "Which figure is the odd one out?", options: 5, complexity: 3, answer: "E" },

 // Questions 15-16: Which figure completes the series? → 4 choices (A–D)
 { id: 15, text: "Which figure completes the series?", options: 4, complexity: 3, answer: "D" },
 { id: 16, text: "Which figure completes the series?", options: 4, complexity: 3, answer: "A" },

 // Questions 17-18: Which figure belongs in neither group? → 4 choices (A–D)
 { id: 17, text: "Which figure belongs in neither group?", options: 4, complexity: 4, answer: "C" },
 { id: 18, text: "Which figure belongs in neither group?", options: 4, complexity: 4, answer: "A" },

 // Questions 19-20: Which figure is next in the series? → 4 choices (A–D)
 { id: 19, text: "Which figure is next in the series?", options: 4, complexity: 4, answer: "B" },
 { id: 20, text: "Which figure is next in the series?", options: 4, complexity: 4, answer: "D" },

 // Questions 21-22: Which figure completes the grid? → 4 choices (A–D)
 { id: 21, text: "Which figure completes the grid?", options: 4, complexity: 4, answer: "B" },
 { id: 22, text: "Which figure completes the grid?", options: 4, complexity: 5, answer: "C" },

 // Question 23-24: Which figure is the odd one out? → 5 choices (A–E)
 { id: 23, text: "Which figure is the odd one out?", options: 5, complexity: 5, answer: "C" },
 { id: 24, text: "Which figure is the odd one out?", options: 5, complexity: 5, answer: "D" },
];

export const getAbstractTestSections = () => ({
 id: 'ART',
 title: "Abstract Reasoning Test",
 description: "Pattern Recognition and Logical Sequences",
 duration_minutes: 25, // Changed from 45 to 25 minutes
 total_questions: 25,
 sections: [
 {
 id: 1,
 title: "Abstract Reasoning Assessment",
 description: "Identify patterns and complete logical sequences in abstract diagrams",
 duration_minutes: 25, // Changed from 45 to 25 minutes
 intro_image: "/src/assets/images/abstract/instructions/intro.svg",
 intro_text: {
 title: "ABSTRACT REASONING TEST",
 instructions: [
 "In this test, you will analyze abstract patterns and identify logical relationships.",
 "Look for patterns in shape, color, rotation, and position.",
 "You'll face different types of questions:",
 "- Completing sequences and series",
 "- Finding the odd one out",
 "- Identifying which figure belongs in neither group",
 "- Completing statements and grids",
 "",
 "You have 25 minutes to complete 25 questions.", // Updated instruction text
 "Work systematically and trust your logical reasoning.",
 "",
 "Click 'Start Test' when you are ready to begin."
 ]
 },
 questions: QUESTIONS_CONFIG.map(config => {
 const optionLetters = config.options === 5
 ? ["A", "B", "C", "D", "E"]
 : ["A", "B", "C", "D"];

 return {
 id: config.id,
 question: config.text,
 options: optionLetters,
 image: `/src/assets/images/abstract/questions/${config.id}.png`,
 order: config.id,
 complexity_score: config.complexity
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

// Add correct answers to questions
export const getAbstractTestWithAnswers = () => {
 const testData = getAbstractTestSections();

 // Map questions with their correct answers
 testData.sections[0].questions = testData.sections[0].questions.map(question => {
 // Find the matching config in QUESTIONS_CONFIG
 const questionConfig = QUESTIONS_CONFIG.find(q => q.id === question.id);

 return {
 ...question,
 correct_answer: questionConfig && questionConfig.answer ? questionConfig.answer.toLowerCase() : null
 };
 });

 return testData;
};
