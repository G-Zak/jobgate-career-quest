// LRT2 - Advanced Number Series Test Data Structure
// Section 2 only: Advanced Number Series with complex patterns

export const getLRT2TestSections = () => {
 return {
 title: "LRT2 - Advanced Number Series",
 description: "Advanced number series questions with complex patterns including interruptions and alternating series.",
 totalQuestions: 20,
 totalTime: 10, // 10 minutes
 sections: [
 getLRT2Section2()
 ]
 };
};

export const getLRT2Section2 = () => {
 return {
 id: 2,
 title: "Advanced Number Series",
 description: "More difficult number series questions with complex patterns including interruptions and alternating series.",
 instructions: "This set contains additional, and sometimes more difficult, number series questions. Again, each question has a definite pattern. Some of the number series may be interrupted by a particular number that appears periodically in the pattern. For example, in the series 14, 16, 32, 18, 20, 32, 22, 24, 32, the number 32 appears as every third number. Sometimes, the pattern contains two alternating series. For example, in the series 1, 5, 3, 7, 5, 9, 7, the pattern is add 4, subtract 2, add 4, subtract 2, and so on. Look carefully for the pattern, and then choose which pair of numbers comes next. Note also that you will be choosing from five options instead of four.",
 timeLimit: 10, // 10 minutes
 questions: generateLRT2Section2Questions()
 };
};

// Section 2: Advanced Number Series Questions
function generateLRT2Section2Questions() {
 const questions = [
 {
 id: `lrt2_2_1`,
 type: "multiple_choice",
 question: "Look at this series: 84, 78, 72, 66, 60, 54, 48, ... What pair of numbers should come next?",
 options: ["44, 34", "42, 36", "42, 32", "40, 34", "38, 32"],
 correct_answer: "b", // 42, 36
 difficulty: 2,
 section: 2
 },
 {
 id: `lrt2_2_2`,
 type: "multiple_choice",
 question: "Look at this series: 3, 8, 13, 18, 23, 28, 33, ... What pair of numbers should come next?",
 options: ["39, 44", "38, 44", "38, 43", "37, 42", "33, 38"],
 correct_answer: "c", // 38, 43
 difficulty: 2,
 section: 2
 },
 {
 id: `lrt2_2_3`,
 type: "multiple_choice",
 question: "Look at this series: 20, 20, 17, 17, 14, 14, 11, ... What pair of numbers should come next?",
 options: ["8, 8", "11, 11", "11, 14", "8, 9", "11, 8"],
 correct_answer: "e", // 11, 8
 difficulty: 2,
 section: 2
 },
 {
 id: `lrt2_2_4`,
 type: "multiple_choice",
 question: "Look at this series: 18, 21, 25, 18, 29, 33, 18, ... What pair of numbers should come next?",
 options: ["43, 18", "41, 44", "37, 18", "37, 41", "38, 41"],
 correct_answer: "d", // 37, 41
 difficulty: 2,
 section: 2
 },
 {
 id: `lrt2_2_5`,
 type: "multiple_choice",
 question: "Look at this series: 9, 11, 33, 13, 15, 33, 17, ... What pair of numbers should come next?",
 options: ["19, 33", "33, 35", "33, 19", "15, 33", "19, 21"],
 correct_answer: "a", // 19, 33
 difficulty: 2,
 section: 2
 },
 {
 id: `lrt2_2_6`,
 type: "multiple_choice",
 question: "Look at this series: 2, 8, 14, 20, 26, 32, 38, ... What pair of numbers should come next?",
 options: ["2, 46", "44, 50", "42, 48", "40, 42", "32, 26"],
 correct_answer: "b", // 44, 50
 difficulty: 2,
 section: 2
 },
 {
 id: `lrt2_2_7`,
 type: "multiple_choice",
 question: "Look at this series: 28, 25, 5, 21, 18, 5, 14, ... What pair of numbers should come next?",
 options: ["11, 5", "10, 7", "11, 8", "5, 10", "10, 5"],
 correct_answer: "a", // 11, 5
 difficulty: 2,
 section: 2
 },
 {
 id: `lrt2_2_8`,
 type: "multiple_choice",
 question: "Look at this series: 9, 12, 11, 14, 13, 16, 15, ... What pair of numbers should come next?",
 options: ["14, 13", "18, 21", "14, 17", "12, 13", "18, 17"],
 correct_answer: "e", // 18, 17
 difficulty: 2,
 section: 2
 },
 {
 id: `lrt2_2_9`,
 type: "multiple_choice",
 question: "Look at this series: 75, 65, 85, 55, 45, 85, 35, ... What pair of numbers should come next?",
 options: ["25, 15", "25, 85", "35, 25", "85, 35", "25, 75"],
 correct_answer: "b", // 25, 85
 difficulty: 2,
 section: 2
 },
 {
 id: `lrt2_2_10`,
 type: "multiple_choice",
 question: "Look at this series: 1, 10, 7, 20, 13, 30, 19, ... What pair of numbers should come next?",
 options: ["26, 40", "29, 36", "40, 25", "25, 31", "40, 50"],
 correct_answer: "c", // 40, 25
 difficulty: 3,
 section: 2
 },
 {
 id: `lrt2_2_11`,
 type: "multiple_choice",
 question: "Look at this series: 10, 20, 25, 35, 40, 50, 55, ... What pair of numbers should come next?",
 options: ["70, 65", "60, 70", "60, 75", "60, 65", "65, 70"],
 correct_answer: "e", // 65, 70
 difficulty: 3,
 section: 2
 },
 {
 id: `lrt2_2_12`,
 type: "multiple_choice",
 question: "Look at this series: 40, 40, 31, 31, 22, 22, 13, ... What pair of numbers should come next?",
 options: ["13, 4", "13, 5", "4, 13", "9, 4", "4, 4"],
 correct_answer: "a", // 13, 4
 difficulty: 3,
 section: 2
 },
 {
 id: `lrt2_2_13`,
 type: "multiple_choice",
 question: "Look at this series: 17, 17, 34, 20, 20, 31, 23, ... What pair of numbers should come next?",
 options: ["26, 23", "34, 20", "23, 33", "27, 28", "23, 28"],
 correct_answer: "e", // 23, 28
 difficulty: 3,
 section: 2
 },
 {
 id: `lrt2_2_14`,
 type: "multiple_choice",
 question: "Look at this series: 2, 3, 4, 5, 6, 4, 8, ... What pair of numbers should come next?",
 options: ["9, 10", "4, 8", "10, 4", "9, 4", "8, 9"],
 correct_answer: "d", // 9, 4
 difficulty: 3,
 section: 2
 },
 {
 id: `lrt2_2_15`,
 type: "multiple_choice",
 question: "Look at this series: 61, 57, 50, 61, 43, 36, 61, ... What pair of numbers should come next?",
 options: ["29, 61", "27, 20", "31, 61", "22, 15", "29, 22"],
 correct_answer: "e", // 29, 22
 difficulty: 3,
 section: 2
 },
 {
 id: `lrt2_2_16`,
 type: "multiple_choice",
 question: "Look at this series: 9, 16, 23, 30, 37, 44, 51, ... What pair of numbers should come next?",
 options: ["59, 66", "56, 62", "58, 66", "58, 65", "54, 61"],
 correct_answer: "d", // 58, 65
 difficulty: 3,
 section: 2
 },
 {
 id: `lrt2_2_17`,
 type: "multiple_choice",
 question: "Look at this series: 8, 22, 12, 16, 22, 20, 24, ... What pair of numbers should come next?",
 options: ["28, 32", "28, 22", "22, 28", "32, 36", "22, 26"],
 correct_answer: "c", // 22, 28
 difficulty: 3,
 section: 2
 },
 {
 id: `lrt2_2_18`,
 type: "multiple_choice",
 question: "Look at this series: 6, 20, 8, 14, 10, 8, 12, ... What pair of numbers should come next?",
 options: ["14, 10", "2, 18", "4, 12", "2, 14", "14, 14"],
 correct_answer: "d", // 2, 14
 difficulty: 3,
 section: 2
 },
 {
 id: `lrt2_2_19`,
 type: "multiple_choice",
 question: "Look at this series: 11, 16, 21, 26, 31, 36, 41, ... What pair of numbers should come next?",
 options: ["47, 52", "46, 52", "45, 49", "46, 51", "46, 52"],
 correct_answer: "d", // 46, 51
 difficulty: 3,
 section: 2
 },
 {
 id: `lrt2_2_20`,
 type: "multiple_choice",
 question: "Look at this series: 8, 11, 21, 15, 18, 21, 22, ... What pair of numbers should come next?",
 options: ["25, 18", "25, 21", "25, 29", "24, 21", "22, 26"],
 correct_answer: "b", // 25, 21
 difficulty: 3,
 section: 2
 }
 ];
 return questions;
}

// Individual section export for separate test
export const getLRT2Test = () => {
 return {
 title: "LRT2 - Advanced Number Series Test",
 description: "Test your advanced number series pattern recognition abilities.",
 totalQuestions: 20,
 totalTime: 10,
 sections: [getLRT2Section2()]
 };
};
