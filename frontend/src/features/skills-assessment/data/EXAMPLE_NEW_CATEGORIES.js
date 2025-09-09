// Example: How to Add New Verbal Reasoning Test Categories
// This file demonstrates how to add new categories like Analogies, Classification, etc.

// ==========================================
// EXAMPLE: ANALOGIES CATEGORY
// ==========================================

// Step 1: Create question pools for the new category
export const analogiesBasicPool = [
  {
    id: "analogies_basic_001",
    analogy_type: "Simple Relationships",
    questions: [
      {
        id: 1,
        question_text: "Bird is to Fly as Fish is to:",
        options: ["Walk", "Swim", "Run", "Crawl"],
        correct_answer: "Swim",
        explanation: "Birds fly through air, fish swim through water."
      },
      {
        id: 2,
        question_text: "Hot is to Cold as Day is to:",
        options: ["Sun", "Light", "Night", "Moon"],
        correct_answer: "Night",
        explanation: "Hot and cold are opposites, day and night are opposites."
      }
      // Add more analogy questions...
    ]
  }
  // Add more analogy groups...
];

export const analogiesIntermediatePool = [
  {
    id: "analogies_intermediate_001", 
    analogy_type: "Complex Relationships",
    questions: [
      {
        id: 1,
        question_text: "Author is to Book as Composer is to:",
        options: ["Orchestra", "Symphony", "Instrument", "Concert"],
        correct_answer: "Symphony",
        explanation: "An author creates a book, a composer creates a symphony."
      }
      // Add more complex analogies...
    ]
  }
  // Add more groups...
];

// Step 2: Create randomization functions
export function getRandomizedAnalogiesBasic(questionCount = 15) {
  // Implementation similar to reading comprehension randomization
  return {
    id: "ANALOGY1",
    title: "Verbal Analogies Test 1 - Basic Level",
    description: "Basic word relationship analogies",
    timeLimit: 15,
    sections: [
      {
        id: 1,
        title: "Word Analogies - Basic Level",
        description: "Identify the relationship between words and complete the analogies.",
        passages: [] // Analogies don't use passages, just questions
      }
    ]
  };
}

export function getRandomizedAnalogiesIntermediate(questionCount = 20) {
  // Similar implementation for intermediate level
  return {
    id: "ANALOGY2", 
    title: "Verbal Analogies Test 2 - Intermediate Level",
    description: "Complex word relationship analogies",
    timeLimit: 20,
    sections: [
      {
        id: 2,
        title: "Word Analogies - Intermediate Level", 
        description: "Identify complex relationships between words and concepts.",
        passages: []
      }
    ]
  };
}

// ==========================================
// EXAMPLE: CLASSIFICATION CATEGORY  
// ==========================================

export const classificationBasicPool = [
  {
    id: "classification_basic_001",
    classification_type: "Basic Categorization",
    questions: [
      {
        id: 1,
        question_text: "Which word does NOT belong with the others?",
        options: ["Apple", "Orange", "Banana", "Carrot"],
        correct_answer: "Carrot",
        explanation: "Apple, Orange, and Banana are fruits. Carrot is a vegetable."
      }
      // Add more classification questions...
    ]
  }
  // Add more classification groups...
];

// ==========================================
// HOW TO INTEGRATE NEW CATEGORIES
// ==========================================

/*
To add a new category, follow these steps:

1. Create question pools (like above examples)

2. Add to verbalReasoningCategories.js:

export const verbalReasoningCategories = {
  readingComprehension: { ... }, // existing
  
  // ADD NEW CATEGORY HERE:
  analogies: {
    id: "analogies",
    name: "Verbal Analogies", 
    description: "Tests ability to identify relationships between words and concepts",
    levels: {
      basic: {
        name: "Basic Analogies",
        testId: "ANALOGY1",
        description: "Simple word relationship analogies",
        questionPool: analogiesBasicPool,
        defaultQuestionCount: 15,
        getRandomizedTest: getRandomizedAnalogiesBasic
      },
      intermediate: {
        name: "Intermediate Analogies",
        testId: "ANALOGY2", 
        description: "Complex relationship analogies",
        questionPool: analogiesIntermediatePool,
        defaultQuestionCount: 20,
        getRandomizedTest: getRandomizedAnalogiesIntermediate
      }
    }
  },
  
  classification: {
    id: "classification",
    name: "Word Classification",
    description: "Tests ability to categorize and classify words based on relationships", 
    levels: {
      basic: {
        name: "Basic Classification",
        testId: "CLASS1",
        description: "Simple categorization tasks",
        questionPool: classificationBasicPool,
        defaultQuestionCount: 12,
        getRandomizedTest: getRandomizedClassificationBasic
      }
    }
  }
};

3. Update component routing to handle new testIds (ANALOGY1, ANALOGY2, CLASS1, etc.)

4. The testManager will automatically handle the new categories

5. Users can then access:
   - Reading Comprehension: VRT1, VRT2, VRT3 (current)
   - Analogies: ANALOGY1, ANALOGY2 (new)
   - Classification: CLASS1 (new)
   - etc.
*/
