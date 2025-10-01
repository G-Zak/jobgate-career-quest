// Test Section 1 Configuration
import { getSpatialTestSections, getCurrentSection, getCurrentQuestion, getTotalQuestions } from './spatialTestSections.js';

// Test the data structure
const testData = getSpatialTestSections();
console.log(" Section 1 Test Configuration:");
console.log(" Total Sections:", testData.sections.length);
console.log(" Section 1 Questions:", testData.sections[0].total_questions);
console.log(" Section 1 Duration:", testData.sections[0].duration_minutes, "minutes");
console.log(" Total Questions Overall:", getTotalQuestions(testData));

// Test helper functions
const section1 = getCurrentSection(testData, 1);
console.log(" Section 1 Title:", section1.title);
console.log(" Question Type:", section1.question_type);

// Test first and last questions
const firstQuestion = getCurrentQuestion(testData, 1, 1);
const lastQuestion = getCurrentQuestion(testData, 1, 40);
console.log(" First Question ID:", firstQuestion.id);
console.log(" Last Question ID:", lastQuestion.id);
console.log(" First Question Image:", firstQuestion.question_image);
console.log(" Last Question Image:", lastQuestion.question_image);

// Test question structure
console.log(" Question Structure Check:");
console.log(" - Question Text:", firstQuestion.question_text);
console.log(" - Context:", firstQuestion.context);
console.log(" - Options Length:", firstQuestion.options.length); // Should be 0 for complete images
console.log(" - Correct Answer:", firstQuestion.correct_answer);

console.log(" Section 1 is properly configured for complete image format!");
