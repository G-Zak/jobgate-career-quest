// Verbal Reasoning Test Manager
// Central system for managing different types of verbal reasoning tests

import { verbalReasoningCategories } from './verbalReasoningCategories';

// ==========================================
// TEST MANAGEMENT SYSTEM
// ==========================================

export class VerbalReasoningTestManager {
  constructor() {
    this.categories = verbalReasoningCategories;
  }

  // Get all available categories
  getCategories() {
    return Object.keys(this.categories).map(key => ({
      id: key,
      ...this.categories[key]
    }));
  }

  // Get a specific category
  getCategory(categoryId) {
    return this.categories[categoryId];
  }

  // Get all levels for a category
  getCategoryLevels(categoryId) {
    const category = this.categories[categoryId];
    if (!category) return [];
    
    return Object.keys(category.levels).map(levelKey => ({
      id: levelKey,
      categoryId,
      ...category.levels[levelKey]
    }));
  }

  // Get a specific test by category and level
  getTest(categoryId, level) {
    const category = this.categories[categoryId];
    if (!category || !category.levels[level]) {
      throw new Error(`Test not found: ${categoryId}.${level}`);
    }
    
    return category.levels[level];
  }

  // Get randomized test by legacy testId (for backward compatibility)
  getTestByLegacyId(testId) {
    // Map legacy IDs to new system
    const legacyMapping = {
      // CONSOLIDATED READING COMPREHENSION
      'VRT-COMP': { category: 'readingComprehension', level: 'consolidated' },
      'VRT_COMP': { category: 'readingComprehension', level: 'consolidated' },
      'VRTCOMP': { category: 'readingComprehension', level: 'consolidated' },
      
      // LEGACY INDIVIDUAL READING COMPREHENSION (deprecated but maintained for compatibility)
      'VRT1': { category: 'readingComprehension', level: 'basic' },
      'VRT2': { category: 'readingComprehension', level: 'intermediate' }, 
      'VRT3': { category: 'readingComprehension', level: 'advanced' },
      
      // OTHER VERBAL REASONING TESTS
      'VRT4': { category: 'verbalAnalogies', level: 'comprehensive' },
      'VRT5': { category: 'classification', level: 'comprehensive' },
      'VRT6': { category: 'codingDecoding', level: 'comprehensive' },
      'VRT7': { category: 'bloodRelationsLogicalPuzzles', level: 'comprehensive' },
      
      // NUMERIC COMPATIBILITY
      '1': { category: 'readingComprehension', level: 'basic' },
      '2': { category: 'readingComprehension', level: 'intermediate' },
      '3': { category: 'readingComprehension', level: 'advanced' },
      '4': { category: 'verbalAnalogies', level: 'comprehensive' },
      '5': { category: 'classification', level: 'comprehensive' },
      '6': { category: 'codingDecoding', level: 'comprehensive' },
      '7': { category: 'bloodRelationsLogicalPuzzles', level: 'comprehensive' }
    };

    const mapping = legacyMapping[testId];
    if (!mapping) {
      throw new Error(`Unknown legacy test ID: ${testId}`);
    }

    return this.getTest(mapping.category, mapping.level);
  }

  // Generate a randomized test
  generateRandomizedTest(categoryId, level, options = {}) {
    const test = this.getTest(categoryId, level);
    const questionCount = options.questionCount || test.defaultQuestionCount;
    
    return test.getRandomizedTest(questionCount);
  }

  // Generate test by legacy ID (for backward compatibility)
  generateTestByLegacyId(testId, options = {}) {
    const test = this.getTestByLegacyId(testId);
    const questionCount = options.questionCount || test.defaultQuestionCount;
    
    return test.getRandomizedTest(questionCount);
  }

  // Add a new category (for future expansion)
  addCategory(categoryId, categoryData) {
    this.categories[categoryId] = categoryData;
  }

  // Add a new level to existing category
  addCategoryLevel(categoryId, levelId, levelData) {
    if (!this.categories[categoryId]) {
      throw new Error(`Category ${categoryId} does not exist`);
    }
    
    this.categories[categoryId].levels[levelId] = levelData;
  }

  // Get test statistics
  getTestStats(categoryId, level) {
    const test = this.getTest(categoryId, level);
    return {
      totalPassages: test.questionPool.length,
      defaultQuestionCount: test.defaultQuestionCount,
      totalQuestions: test.questionPool.reduce((total, passage) => total + passage.questions.length, 0),
      averageQuestionsPerPassage: test.questionPool.reduce((total, passage) => total + passage.questions.length, 0) / test.questionPool.length
    };
  }

  // Get all test statistics
  getAllTestStats() {
    const stats = {};
    
    Object.keys(this.categories).forEach(categoryId => {
      const category = this.categories[categoryId];
      stats[categoryId] = {
        name: category.name,
        levels: {}
      };
      
      Object.keys(category.levels).forEach(levelId => {
        stats[categoryId].levels[levelId] = this.getTestStats(categoryId, levelId);
      });
    });
    
    return stats;
  }
}

// ==========================================
// SINGLETON INSTANCE
// ==========================================

export const testManager = new VerbalReasoningTestManager();

// ==========================================
// CONVENIENCE FUNCTIONS FOR BACKWARD COMPATIBILITY
// ==========================================

// Legacy function mappings for existing component
export function getRandomizedTestByLegacyId(testId, options = {}) {
  return testManager.generateTestByLegacyId(testId, options);
}

// New standardized functions for future use
export function getRandomizedTest(categoryId, level, options = {}) {
  return testManager.generateRandomizedTest(categoryId, level, options);
}

export function getTestCategories() {
  return testManager.getCategories();
}

export function getTestLevels(categoryId) {
  return testManager.getCategoryLevels(categoryId);
}

// ==========================================
// EXAMPLE USAGE FOR FUTURE CATEGORIES
// ==========================================

/*
// Example: Adding a new category (Analogies)
testManager.addCategory('analogies', {
  id: 'analogies',
  name: 'Verbal Analogies',
  description: 'Tests ability to identify relationships between words and concepts',
  levels: {
    basic: {
      name: 'Basic Analogies',
      testId: 'ANALOGY1',
      description: 'Simple word relationship analogies',
      questionPool: analogiesBasicPool,
      defaultQuestionCount: 15,
      getRandomizedTest: getRandomizedAnalogiesBasic
    },
    intermediate: {
      name: 'Intermediate Analogies', 
      testId: 'ANALOGY2',
      description: 'Complex relationship analogies',
      questionPool: analogiesIntermediatePool,
      defaultQuestionCount: 20,
      getRandomizedTest: getRandomizedAnalogiesIntermediate
    }
  }
});

// Example: Adding a classification category
testManager.addCategory('classification', {
  id: 'classification',
  name: 'Word Classification',
  description: 'Tests ability to categorize and classify words based on relationships',
  levels: {
    basic: {
      name: 'Basic Classification',
      testId: 'CLASS1',
      description: 'Simple categorization tasks',
      questionPool: classificationBasicPool,
      defaultQuestionCount: 12,
      getRandomizedTest: getRandomizedClassificationBasic
    }
  }
});
*/
