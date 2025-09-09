// LRT3 - Additional Number Series Practice Test Data Structure
// Section 3 only: Additional practice with number series questions

export const getLRT3TestSections = () => {
  return {
    title: "LRT3 - Additional Number Series Practice",
    description: "Additional practice with number series questions to strengthen your pattern recognition skills.",
    totalQuestions: 20,
    totalTime: 10, // 10 minutes
    sections: [
      getLRT3Section3()
    ]
  };
};

export const getLRT3Section3 = () => {
  return {
    id: 3,
    title: "Additional Number Series Practice",
    description: "Additional practice with number series questions to strengthen your pattern recognition skills.",
    instructions: "This set will give you additional practice dealing with number series questions. Look carefully for the pattern, and then choose which pair of numbers comes next.",
    timeLimit: 10, // 10 minutes
    questions: generateLRT3Section3Questions()
  };
};

// Section 3: Additional Number Series Practice Questions
function generateLRT3Section3Questions() {
  const questions = [
    {
      id: `lrt3_3_1`,
      type: "multiple_choice",
      question: "Look at this series: 44, 41, 38, 35, 32, 29, 26, ... What pair of numbers should come next?",
      options: ["24, 21", "22, 19", "23, 19", "29, 32", "23, 20"],
      correct_answer: "e", // 23, 20
      difficulty: 2,
      section: 3
    },
    {
      id: `lrt3_3_2`,
      type: "multiple_choice",
      question: "Look at this series: 6, 10, 14, 18, 22, 26, 30, ... What pair of numbers should come next?",
      options: ["36, 40", "33, 37", "38, 42", "34, 36", "34, 38"],
      correct_answer: "e", // 34, 38
      difficulty: 2,
      section: 3
    },
    {
      id: `lrt3_3_3`,
      type: "multiple_choice",
      question: "Look at this series: 34, 30, 26, 22, 18, 14, 10, ... What pair of numbers should come next?",
      options: ["8, 6", "6, 4", "14, 18", "6, 2", "4, 0"],
      correct_answer: "d", // 6, 2
      difficulty: 2,
      section: 3
    },
    {
      id: `lrt3_3_4`,
      type: "multiple_choice",
      question: "Look at this series: 2, 44, 4, 41, 6, 38, 8, ... What pair of numbers should come next?",
      options: ["10, 12", "35, 32", "34, 9", "35, 10", "10, 52"],
      correct_answer: "d", // 35, 10
      difficulty: 2,
      section: 3
    },
    {
      id: `lrt3_3_5`,
      type: "multiple_choice",
      question: "Look at this series: 32, 29, 26, 23, 20, 17, 14, ... What pair of numbers should come next?",
      options: ["11, 8", "12, 8", "11, 7", "32, 29", "10, 9"],
      correct_answer: "a", // 11, 8
      difficulty: 2,
      section: 3
    },
    {
      id: `lrt3_3_6`,
      type: "multiple_choice",
      question: "Look at this series: 14, 14, 26, 26, 38, 38, 50, ... What pair of numbers should come next?",
      options: ["60, 72", "50, 62", "50, 72", "62, 62", "62, 80"],
      correct_answer: "b", // 50, 62
      difficulty: 2,
      section: 3
    },
    {
      id: `lrt3_3_7`,
      type: "multiple_choice",
      question: "Look at this series: 8, 12, 9, 13, 10, 14, 11, ... What pair of numbers should come next?",
      options: ["14, 11", "15, 12", "8, 15", "15, 19", "8, 5"],
      correct_answer: "b", // 15, 12
      difficulty: 2,
      section: 3
    },
    {
      id: `lrt3_3_8`,
      type: "multiple_choice",
      question: "Look at this series: 4, 7, 26, 10, 13, 20, 16, ... What pair of numbers should come next?",
      options: ["14, 4", "14, 17", "18, 14", "19, 13", "19, 14"],
      correct_answer: "e", // 19, 14
      difficulty: 2,
      section: 3
    },
    {
      id: `lrt3_3_9`,
      type: "multiple_choice",
      question: "Look at this series: 3, 8, 10, 15, 17, 22, 24, ... What pair of numbers should come next?",
      options: ["26, 28", "29, 34", "29, 31", "26, 31", "26, 32"],
      correct_answer: "c", // 29, 31
      difficulty: 2,
      section: 3
    },
    {
      id: `lrt3_3_10`,
      type: "multiple_choice",
      question: "Look at this series: 17, 14, 14, 11, 11, 8, 8, ... What pair of numbers should come next?",
      options: ["8, 5", "5, 2", "8, 2", "5, 5", "5, 8"],
      correct_answer: "d", // 5, 5
      difficulty: 2,
      section: 3
    },
    {
      id: `lrt3_3_11`,
      type: "multiple_choice",
      question: "Look at this series: 13, 29, 15, 26, 17, 23, 19, ... What pair of numbers should come next?",
      options: ["21, 23", "20, 21", "20, 17", "25, 27", "22, 20"],
      correct_answer: "b", // 20, 21
      difficulty: 3,
      section: 3
    },
    {
      id: `lrt3_3_12`,
      type: "multiple_choice",
      question: "Look at this series: 16, 26, 56, 36, 46, 68, 56, ... What pair of numbers should come next?",
      options: ["80, 66", "64, 82", "66, 80", "78, 68", "66, 82"],
      correct_answer: "c", // 66, 80
      difficulty: 3,
      section: 3
    },
    {
      id: `lrt3_3_13`,
      type: "multiple_choice",
      question: "Look at this series: 7, 9, 66, 12, 14, 66, 17, ... What pair of numbers should come next?",
      options: ["19, 66", "66, 19", "19, 22", "20, 66", "66, 20"],
      correct_answer: "a", // 19, 66
      difficulty: 3,
      section: 3
    },
    {
      id: `lrt3_3_14`,
      type: "multiple_choice",
      question: "Look at this series: 3, 5, 35, 10, 12, 35, 17, ... What pair of numbers should come next?",
      options: ["22, 35", "35, 19", "19, 35", "19, 24", "22, 24"],
      correct_answer: "c", // 19, 35
      difficulty: 3,
      section: 3
    },
    {
      id: `lrt3_3_15`,
      type: "multiple_choice",
      question: "Look at this series: 36, 31, 29, 24, 22, 17, 15, ... What pair of numbers should come next?",
      options: ["13, 11", "10, 5", "13, 8", "12, 7", "10, 8"],
      correct_answer: "e", // 10, 8
      difficulty: 3,
      section: 3
    },
    {
      id: `lrt3_3_16`,
      type: "multiple_choice",
      question: "Look at this series: 42, 40, 38, 35, 33, 31, 28, ... What pair of numbers should come next?",
      options: ["25, 22", "26, 23", "26, 24", "25, 23", "26, 22"],
      correct_answer: "c", // 26, 24
      difficulty: 3,
      section: 3
    },
    {
      id: `lrt3_3_17`,
      type: "multiple_choice",
      question: "Look at this series: 11, 14, 14, 17, 17, 20, 20, ... What pair of numbers should come next?",
      options: ["23, 23", "23, 26", "21, 24", "24, 24", "24, 27"],
      correct_answer: "a", // 23, 23
      difficulty: 3,
      section: 3
    },
    {
      id: `lrt3_3_18`,
      type: "multiple_choice",
      question: "Look at this series: 17, 32, 19, 29, 21, 26, 23, ... What pair of numbers should come next?",
      options: ["25, 25", "20, 22", "23, 25", "25, 22", "27, 32"],
      correct_answer: "c", // 23, 25
      difficulty: 3,
      section: 3
    },
    {
      id: `lrt3_3_19`,
      type: "multiple_choice",
      question: "Look at this series: 10, 34, 12, 31, 14, 28, 16, ... What pair of numbers should come next?",
      options: ["25, 18", "30, 13", "19, 26", "18, 20", "25, 22"],
      correct_answer: "a", // 25, 18
      difficulty: 3,
      section: 3
    },
    {
      id: `lrt3_3_20`,
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

// Individual section export for separate test
export const getLRT3Test = () => {
  return {
    title: "LRT3 - Additional Number Series Practice Test",
    description: "Test your number series pattern recognition abilities with additional practice questions.",
    totalQuestions: 20,
    totalTime: 10,
    sections: [getLRT3Section3()]
  };
};
