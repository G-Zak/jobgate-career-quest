// Section 1: Complete question definitions for shape assembly
// Each question has a complete image with component shapes and all options (A, B, C, D, E)

const generateSection1Questions = () => {
 const questions = [];

 for (let i = 1; i <= 40; i++) {
 questions.push({
 id: i,
 question_text: `Which option shows the correct assembly of these shapes? (Question ${i})`,
 context: "Look at the component shapes and find which option matches when assembled by corresponding letters.",
 question_image: `/src/assets/images/spatial/questions/section_1/question_${i}.png`,
 options: [], // Empty since complete image contains all options (A, B, C, D, E)
 correct_answer: "A", // TODO: Update with actual correct answers
 order: i,
 complexity_score: Math.min(5, Math.floor((i - 1) / 8) + 1) // Gradually increase difficulty
 });
 }

 return questions;
};

// Export the questions array
export const section1Questions = generateSection1Questions();

// Note: You need to update the correct_answer field for each question
// based on the actual correct option in your book/images
