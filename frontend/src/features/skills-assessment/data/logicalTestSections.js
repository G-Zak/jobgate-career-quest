// Import scoring system utilities
import { enhanceQuestionsWithScoring } from '../lib/scoringSystem.js';

/**
 * Default score weight configuration for logical test questions
 */
const DEFAULT_LOGICAL_SCORE_WEIGHT = {
 base: 5,
 difficultyBonus: 2,
 timeFactor: 1
};

/**
 * Helper function to add scoring weights to questions
 * @param {Array} questions - Array of question objects
 * @returns {Array} Questions with scoring weights added
 */
function addScoringWeights(questions) {
 return questions.map(question => ({
 ...question,
 scoreWeight: question.scoreWeight || DEFAULT_LOGICAL_SCORE_WEIGHT
 }));
}

// Logical Reasoning Test Data Structure
export const getLogicalTestSections = () => {
 return {
 title: "Logical Reasoning Tests",
 description: "Evaluate your logical thinking and reasoning abilities through various problem-solving scenarios.",
 totalQuestions: 60,
 totalTime: 30, // 30 minutes total (10 min per section)
 // Global scoring configuration for the test
 scoringConfig: {
 timeWeight: 0.3,
 difficultyWeight: 0.5,
 accuracyWeight: 0.2
 },
 sections: [
 getLogicalSection1(),
 getLogicalSection2(),
 getLogicalSection3(),
 getLogicalSection4()
 ]
 };
};

export const getLogicalSection1 = () => {
 return {
 id: 1,
 title: "Number Series",
 description: "Questions that test your ability to reason with numbers and identify patterns in numerical sequences.",
 instructions: "Analyze the number sequences and identify the pattern to determine the next number in the series.",
 timeLimit: 10, // 15 minutes
 questions: addScoringWeights(generateLogicalSection1Questions())
 };
};
export const getLogicalSection2 = () => {
 return {
 id: 2,
 title: "Advanced Number Series",
 description: "Challenging number series questions that require deeper analysis of sequences.",
 instructions: "Analyze each series carefully and determine the next numbers in the pattern.",
 timeLimit: 15,
 questions: addScoringWeights(generateLogicalSection2Questions())
 };
};
export const getLogicalSection3 = () => {
 return {
 id: 3,
 title: "Additional Number Series Practice",
 description: "Additional practice with number series questions to strengthen your pattern recognition skills.",
 instructions: "This set will give you additional practice dealing with number series questions. Look carefully for the pattern, and then choose which pair of numbers comes next.",
 timeLimit: 15,
 questions: addScoringWeights(generateLogicalSection3Questions())
 };
};

export const getLogicalSection4 = () => {
 return {
 id: 4,
 title: "Problem Solving",
 description: "Complex logical problems that require systematic thinking and problem-solving strategies.",
 instructions: "Solve complex logical problems using systematic thinking and problem-solving strategies.",
 timeLimit: 15,
 questions: addScoringWeights(generateLogicalSection4Questions())
 };
};

// Section 1: Number Series Questions
function generateLogicalSection1Questions() {
 const questions = [
 {
 id: `logical_1_1`,
 type: "multiple_choice",
 question: "Look at this series: 2, 4, 6, 8, 10, ... What number should come next?",
 options: ["11", "12", "13", "14"],
 correct_answer: "b",
 difficulty: 1,
 section: 1,
 scoreWeight: {
 base: 5,
 difficultyBonus: 2,
 timeFactor: 1
 }
 },
 {
 id: `logical_1_2`,
 type: "multiple_choice",
 question: "Look at this series: 58, 52, 46, 40, 34, ... What number should come next?",
 options: ["26", "28", "30", "32"],
 correct_answer: "b",
 difficulty: 1,
 section: 1,
 scoreWeight: {
 base: 5,
 difficultyBonus: 2,
 timeFactor: 1
 }
 },
 {
 id: `logical_1_3`,
 type: "multiple_choice",
 question: "Look at this series: 40, 40, 47, 47, 54, ... What number should come next?",
 options: ["40", "44", "54", "61"],
 correct_answer: "c",
 difficulty: 1,
 section: 1
 },
 {
 id: `logical_1_4`,
 type: "multiple_choice",
 question: "Look at this series: 544, 509, 474, 439, ... What number should come next?",
 options: ["404", "414", "420", "445"],
 correct_answer: "a",
 difficulty: 1,
 section: 1
 },
 {
 id: `logical_1_5`,
 type: "multiple_choice",
 question: "Look at this series: 201, 202, 204, 207, ... What number should come next?",
 options: ["205", "208", "210", "211"],
 correct_answer: "d",
 difficulty: 1,
 section: 1
 },
 {
 id: `logical_1_6`,
 type: "multiple_choice",
 question: "Look at this series: 8, 22, 8, 28, 8, ... What number should come next?",
 options: ["9", "29", "32", "34"],
 correct_answer: "d",
 difficulty: 2,
 section: 1
 },
 {
 id: `logical_1_7`,
 type: "multiple_choice",
 question: "Look at this series: 80, 10, 70, 15, 60, ... What number should come next?",
 options: ["20", "25", "30", "50"],
 correct_answer: "a",
 difficulty: 2,
 section: 1
 },
 {
 id: `logical_1_8`,
 type: "multiple_choice",
 question: "Look at this series: 36, 34, 30, 28, 24, ... What number should come next?",
 options: ["20", "22", "23", "26"],
 correct_answer: "b",
 difficulty: 2,
 section: 1
 },
 {
 id: `logical_1_9`,
 type: "multiple_choice",
 question: "Look at this series: 22, 21, 23, 22, 24, 23, ... What number should come next?",
 options: ["22", "24", "25", "26"],
 correct_answer: "c",
 difficulty: 2,
 section: 1
 },
 {
 id: `logical_1_10`,
 type: "multiple_choice",
 question: "Look at this series: 3, 4, 7, 8, 11, 12, ... What number should come next?",
 options: ["7", "10", "14", "15"],
 correct_answer: "d",
 difficulty: 2,
 section: 1
 },
 {
 id: `logical_1_11`,
 type: "multiple_choice",
 question: "Look at this series: 31, 29, 24, 22, 17, ... What number should come next?",
 options: ["15", "14", "13", "12"],
 correct_answer: "a",
 difficulty: 2,
 section: 1
 },
 {
 id: `logical_1_12`,
 type: "multiple_choice",
 question: "Look at this series: 21, 9, 21, 11, 21, 13, ... What number should come next?",
 options: ["14", "15", "21", "23"],
 correct_answer: "c",
 difficulty: 2,
 section: 1
 },
 {
 id: `logical_1_13`,
 type: "multiple_choice",
 question: "Look at this series: 53, 53, 40, 40, 27, 27, ... What number should come next?",
 options: ["12", "14", "27", "53"],
 correct_answer: "b",
 difficulty: 2,
 section: 1
 },
 {
 id: `logical_1_14`,
 type: "multiple_choice",
 question: "Look at this series: 2, 6, 18, 54, ... What number should come next?",
 options: ["108", "148", "162", "216"],
 correct_answer: "c",
 difficulty: 3,
 section: 1
 },
 {
 id: `logical_1_15`,
 type: "multiple_choice",
 question: "Look at this series: 1,000, 200, 40, ... What number should come next?",
 options: ["8", "10", "15", "20"],
 correct_answer: "a",
 difficulty: 3,
 section: 1
 },
 {
 id: `logical_1_16`,
 type: "multiple_choice",
 question: "Look at this series: 7, 10, 8, 11, 9, 12, ... What number should come next?",
 options: ["7", "10", "12", "13"],
 correct_answer: "b",
 difficulty: 3,
 section: 1
 },
 {
 id: `logical_1_17`,
 type: "multiple_choice",
 question: "Look at this series: 14, 28, 20, 40, 32, 64, ... What number should come next?",
 options: ["52", "56", "96", "128"],
 correct_answer: "b",
 difficulty: 3,
 section: 1
 },
 {
 id: `logical_1_18`,
 type: "multiple_choice",
 question: "Look at this series: 1.5, 2.3, 3.1, 3.9, ... What number should come next?",
 options: ["4.2", "4.4", "4.7", "5.1"],
 correct_answer: "c",
 difficulty: 3,
 section: 1
 },
 {
 id: `logical_1_19`,
 type: "multiple_choice",
 question: "Look at this series: 5.2, 4.8, 4.4, 4, ... What number should come next?",
 options: ["3", "3.3", "3.5", "3.6"],
 correct_answer: "d",
 difficulty: 3,
 section: 1
 },
 {
 id: `logical_1_20`,
 type: "multiple_choice",
 question: "Look at this series: 2, 1, 1/2, 1/4, ... What number should come next?",
 options: ["1/3", "1/8", "2/8", "1/16"],
 correct_answer: "d",
 difficulty: 3,
 section: 1
 }
 ];
 return questions;
}

// Section 2: Advanced Number Series Questions
function generateLogicalSection2Questions() {
 const questions = [
 {
 id: `logical_2_1`,
 type: "multiple_choice",
 question: "Look at this series: 84, 78, 72, 66, 60, 54, 48, ... What pair of numbers should come next?",
 options: ["44, 34", "42, 36", "42, 32", "40, 34", "38, 32"],
 correct_answer: "b", // 42, 36
 difficulty: 2,
 section: 2
 },
 {
 id: `logical_2_2`,
 type: "multiple_choice",
 question: "Look at this series: 3, 8, 13, 18, 23, 28, 33, ... What pair of numbers should come next?",
 options: ["39, 44", "38, 44", "38, 43", "37, 42", "33, 38"],
 correct_answer: "c", // 38, 43
 difficulty: 2,
 section: 2
 },
 {
 id: `logical_2_3`,
 type: "multiple_choice",
 question: "Look at this series: 20, 20, 17, 17, 14, 14, 11, ... What pair of numbers should come next?",
 options: ["8, 8", "11, 11", "11, 14", "8, 9", "11, 8"],
 correct_answer: "e", // 11, 8
 difficulty: 2,
 section: 2
 },
 {
 id: `logical_2_4`,
 type: "multiple_choice",
 question: "Look at this series: 18, 21, 25, 18, 29, 33, 18, ... What pair of numbers should come next?",
 options: ["43, 18", "41, 44", "37, 18", "37, 41", "38, 41"],
 correct_answer: "d", // 37, 41
 difficulty: 2,
 section: 2
 },
 {
 id: `logical_2_5`,
 type: "multiple_choice",
 question: "Look at this series: 9, 11, 33, 13, 15, 33, 17, ... What pair of numbers should come next?",
 options: ["19, 33", "33, 35", "33, 19", "15, 33", "19, 21"],
 correct_answer: "a", // 19, 33
 difficulty: 2,
 section: 2
 },
 {
 id: `logical_2_6`,
 type: "multiple_choice",
 question: "Look at this series: 2, 8, 14, 20, 26, 32, 38, ... What pair of numbers should come next?",
 options: ["2, 46", "44, 50", "42, 48", "40, 42", "32, 26"],
 correct_answer: "b", // 44, 50
 difficulty: 2,
 section: 2
 },
 {
 id: `logical_2_7`,
 type: "multiple_choice",
 question: "Look at this series: 28, 25, 5, 21, 18, 5, 14, ... What pair of numbers should come next?",
 options: ["11, 5", "10, 7", "11, 8", "5, 10", "10, 5"],
 correct_answer: "a", // 11, 5
 difficulty: 2,
 section: 2
 },
 {
 id: `logical_2_8`,
 type: "multiple_choice",
 question: "Look at this series: 9, 12, 11, 14, 13, 16, 15, ... What pair of numbers should come next?",
 options: ["14, 13", "18, 21", "14, 17", "12, 13", "18, 17"],
 correct_answer: "e", // 18, 17
 difficulty: 2,
 section: 2
 },
 {
 id: `logical_2_9`,
 type: "multiple_choice",
 question: "Look at this series: 75, 65, 85, 55, 45, 85, 35, ... What pair of numbers should come next?",
 options: ["25, 15", "25, 85", "35, 25", "85, 35", "25, 75"],
 correct_answer: "b", // 25, 85
 difficulty: 2,
 section: 2
 },
 {
 id: `logical_2_10`,
 type: "multiple_choice",
 question: "Look at this series: 1, 10, 7, 20, 13, 30, 19, ... What pair of numbers should come next?",
 options: ["26, 40", "29, 36", "40, 25", "25, 31", "40, 50"],
 correct_answer: "c", // 40, 25
 difficulty: 3,
 section: 2
 },
 {
 id: `logical_2_11`,
 type: "multiple_choice",
 question: "Look at this series: 10, 20, 25, 35, 40, 50, 55, ... What pair of numbers should come next?",
 options: ["70, 65", "60, 70", "60, 75", "60, 65", "65, 70"],
 correct_answer: "e", // 65, 70
 difficulty: 3,
 section: 2
 },
 {
 id: `logical_2_12`,
 type: "multiple_choice",
 question: "Look at this series: 40, 40, 31, 31, 22, 22, 13, ... What pair of numbers should come next?",
 options: ["13, 4", "13, 5", "4, 13", "9, 4", "4, 4"],
 correct_answer: "a", // 13, 4
 difficulty: 3,
 section: 2
 },
 {
 id: `logical_2_13`,
 type: "multiple_choice",
 question: "Look at this series: 17, 17, 34, 20, 20, 31, 23, ... What pair of numbers should come next?",
 options: ["26, 23", "34, 20", "23, 33", "27, 28", "23, 28"],
 correct_answer: "e", // 23, 28
 difficulty: 3,
 section: 2
 },
 {
 id: `logical_2_14`,
 type: "multiple_choice",
 question: "Look at this series: 2, 3, 4, 5, 6, 4, 8, ... What pair of numbers should come next?",
 options: ["9, 10", "4, 8", "10, 4", "9, 4", "8, 9"],
 correct_answer: "d", // 9, 4
 difficulty: 3,
 section: 2
 },
 {
 id: `logical_2_15`,
 type: "multiple_choice",
 question: "Look at this series: 61, 57, 50, 61, 43, 36, 61, ... What pair of numbers should come next?",
 options: ["29, 61", "27, 20", "31, 61", "22, 15", "29, 22"],
 correct_answer: "e", // 29, 22
 difficulty: 3,
 section: 2
 },
 {
 id: `logical_2_16`,
 type: "multiple_choice",
 question: "Look at this series: 9, 16, 23, 30, 37, 44, 51, ... What pair of numbers should come next?",
 options: ["59, 66", "56, 62", "58, 66", "58, 65", "54, 61"],
 correct_answer: "d", // 58, 65
 difficulty: 3,
 section: 2
 },
 {
 id: `logical_2_17`,
 type: "multiple_choice",
 question: "Look at this series: 8, 22, 12, 16, 22, 20, 24, ... What pair of numbers should come next?",
 options: ["28, 32", "28, 22", "22, 28", "32, 36", "22, 26"],
 correct_answer: "c", // 22, 28
 difficulty: 3,
 section: 2
 },
 {
 id: `logical_2_18`,
 type: "multiple_choice",
 question: "Look at this series: 6, 20, 8, 14, 10, 8, 12, ... What pair of numbers should come next?",
 options: ["14, 10", "2, 18", "4, 12", "2, 14", "14, 14"],
 correct_answer: "d", // 2, 14
 difficulty: 3,
 section: 2
 },
 {
 id: `logical_2_19`,
 type: "multiple_choice",
 question: "Look at this series: 11, 16, 21, 26, 31, 36, 41, ... What pair of numbers should come next?",
 options: ["47, 52", "46, 52", "45, 49", "46, 51", "46, 52"],
 correct_answer: "d", // 46, 51
 difficulty: 3,
 section: 2
 },
 {
 id: `logical_2_20`,
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

// Section 3: Additional Number Series Practice Questions
function generateLogicalSection3Questions() {
 const questions = [
 {
 id: `logical_3_1`,
 type: "multiple_choice",
 question: "Look at this series: 44, 41, 38, 35, 32, 29, 26, ... What pair of numbers should come next?",
 options: ["24, 21", "22, 19", "23, 19", "29, 32", "23, 20"],
 correct_answer: "e", // 23, 20
 difficulty: 2,
 section: 3
 },
 {
 id: `logical_3_2`,
 type: "multiple_choice",
 question: "Look at this series: 6, 10, 14, 18, 22, 26, 30, ... What pair of numbers should come next?",
 options: ["36, 40", "33, 37", "38, 42", "34, 36", "34, 38"],
 correct_answer: "e", // 34, 38
 difficulty: 2,
 section: 3
 },
 {
 id: `logical_3_3`,
 type: "multiple_choice",
 question: "Look at this series: 34, 30, 26, 22, 18, 14, 10, ... What pair of numbers should come next?",
 options: ["8, 6", "6, 4", "14, 18", "6, 2", "4, 0"],
 correct_answer: "d", // 6, 2
 difficulty: 2,
 section: 3
 },
 {
 id: `logical_3_4`,
 type: "multiple_choice",
 question: "Look at this series: 2, 44, 4, 41, 6, 38, 8, ... What pair of numbers should come next?",
 options: ["10, 12", "35, 32", "34, 9", "35, 10", "10, 52"],
 correct_answer: "d", // 35, 10
 difficulty: 2,
 section: 3
 },
 {
 id: `logical_3_5`,
 type: "multiple_choice",
 question: "Look at this series: 32, 29, 26, 23, 20, 17, 14, ... What pair of numbers should come next?",
 options: ["11, 8", "12, 8", "11, 7", "32, 29", "10, 9"],
 correct_answer: "a", // 11, 8
 difficulty: 2,
 section: 3
 },
 {
 id: `logical_3_6`,
 type: "multiple_choice",
 question: "Look at this series: 14, 14, 26, 26, 38, 38, 50, ... What pair of numbers should come next?",
 options: ["60, 72", "50, 62", "50, 72", "62, 62", "62, 80"],
 correct_answer: "b", // 50, 62
 difficulty: 2,
 section: 3
 },
 {
 id: `logical_3_7`,
 type: "multiple_choice",
 question: "Look at this series: 8, 12, 9, 13, 10, 14, 11, ... What pair of numbers should come next?",
 options: ["14, 11", "15, 12", "8, 15", "15, 19", "8, 5"],
 correct_answer: "b", // 15, 12
 difficulty: 2,
 section: 3
 },
 {
 id: `logical_3_8`,
 type: "multiple_choice",
 question: "Look at this series: 4, 7, 26, 10, 13, 20, 16, ... What pair of numbers should come next?",
 options: ["14, 4", "14, 17", "18, 14", "19, 13", "19, 14"],
 correct_answer: "e", // 19, 14
 difficulty: 2,
 section: 3
 },
 {
 id: `logical_3_9`,
 type: "multiple_choice",
 question: "Look at this series: 3, 8, 10, 15, 17, 22, 24, ... What pair of numbers should come next?",
 options: ["26, 28", "29, 34", "29, 31", "26, 31", "26, 32"],
 correct_answer: "c", // 29, 31
 difficulty: 2,
 section: 3
 },
 {
 id: `logical_3_10`,
 type: "multiple_choice",
 question: "Look at this series: 17, 14, 14, 11, 11, 8, 8, ... What pair of numbers should come next?",
 options: ["8, 5", "5, 2", "8, 2", "5, 5", "5, 8"],
 correct_answer: "d", // 5, 5
 difficulty: 2,
 section: 3
 },
 {
 id: `logical_3_11`,
 type: "multiple_choice",
 question: "Look at this series: 13, 29, 15, 26, 17, 23, 19, ... What pair of numbers should come next?",
 options: ["21, 23", "20, 21", "20, 17", "25, 27", "22, 20"],
 correct_answer: "b", // 20, 21
 difficulty: 3,
 section: 3
 },
 {
 id: `logical_3_12`,
 type: "multiple_choice",
 question: "Look at this series: 16, 26, 56, 36, 46, 68, 56, ... What pair of numbers should come next?",
 options: ["80, 66", "64, 82", "66, 80", "78, 68", "66, 82"],
 correct_answer: "c", // 66, 80
 difficulty: 3,
 section: 3
 },
 {
 id: `logical_3_13`,
 type: "multiple_choice",
 question: "Look at this series: 7, 9, 66, 12, 14, 66, 17, ... What pair of numbers should come next?",
 options: ["19, 66", "66, 19", "19, 22", "20, 66", "66, 20"],
 correct_answer: "a", // 19, 66
 difficulty: 3,
 section: 3
 },
 {
 id: `logical_3_14`,
 type: "multiple_choice",
 question: "Look at this series: 3, 5, 35, 10, 12, 35, 17, ... What pair of numbers should come next?",
 options: ["22, 35", "35, 19", "19, 35", "19, 24", "22, 24"],
 correct_answer: "c", // 19, 35
 difficulty: 3,
 section: 3
 },
 {
 id: `logical_3_15`,
 type: "multiple_choice",
 question: "Look at this series: 36, 31, 29, 24, 22, 17, 15, ... What pair of numbers should come next?",
 options: ["13, 11", "10, 5", "13, 8", "12, 7", "10, 8"],
 correct_answer: "e", // 10, 8
 difficulty: 3,
 section: 3
 },
 {
 id: `logical_3_16`,
 type: "multiple_choice",
 question: "Look at this series: 42, 40, 38, 35, 33, 31, 28, ... What pair of numbers should come next?",
 options: ["25, 22", "26, 23", "26, 24", "25, 23", "26, 22"],
 correct_answer: "c", // 26, 24
 difficulty: 3,
 section: 3
 },
 {
 id: `logical_3_17`,
 type: "multiple_choice",
 question: "Look at this series: 11, 14, 14, 17, 17, 20, 20, ... What pair of numbers should come next?",
 options: ["23, 23", "23, 26", "21, 24", "24, 24", "24, 27"],
 correct_answer: "a", // 23, 23
 difficulty: 3,
 section: 3
 },
 {
 id: `logical_3_18`,
 type: "multiple_choice",
 question: "Look at this series: 17, 32, 19, 29, 21, 26, 23, ... What pair of numbers should come next?",
 options: ["25, 25", "20, 22", "23, 25", "25, 22", "27, 32"],
 correct_answer: "c", // 23, 25
 difficulty: 3,
 section: 3
 },
 {
 id: `logical_3_19`,
 type: "multiple_choice",
 question: "Look at this series: 10, 34, 12, 31, 14, 28, 16, ... What pair of numbers should come next?",
 options: ["25, 18", "30, 13", "19, 26", "18, 20", "25, 22"],
 correct_answer: "a", // 25, 18
 difficulty: 3,
 section: 3
 },
 {
 id: `logical_3_20`,
 type: "multiple_choice",
 question: "Look at this series: 32, 31, 32, 29, 32, 27, 32, ... What pair of numbers should come next?",
 options: ["25, 32", "31, 32", "29, 32", "25, 30", "29, 30"],
 correct_answer: "a", // 25, 32
 difficulty: 3,
 section: 3
 }
 ];
 return questions;
}

// Section 4: Problem Solving Questions (placeholders)
function generateLogicalSection4Questions() {
 const questions = [];
 for (let i = 1; i <= 20; i++) {
 questions.push({
 id: `logical_4_${i}`,
 type: "multiple_choice",
 question: `Problem Solving Question ${i}: Solve the logical puzzle.`,
 options: ["Option A", "Option B", "Option C", "Option D"],
 correct_answer: "a",
 difficulty: Math.floor((i - 1) / 7) + 1,
 section: 4
 });
 }
 return questions;
}