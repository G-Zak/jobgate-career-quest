// Test Configuration for Randomized Verbal Reasoning Tests
// This file allows you to easily manage test settings and question pools

export const testConfiguration = {
  // ==========================================
  // ANTI-CHEATING SETTINGS
  // ==========================================
  antiCheating: {
    enabled: true,
    maxQuestionReuse: 3, // Retire questions after 3 uses
    avoidRecentQuestions: true, // Don't repeat questions from recent attempts
    sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    shuffleAnswerOptions: true, // Randomize answer order
    preventBackNavigation: true, // Can't go back to previous questions
    timeBasedRandomization: true // Different questions at different times of day
  },

  // ==========================================
  // TEST VARIANTS CONFIGURATION
  // ==========================================
  testVariants: {
    // Static Tests (Original Behavior)
    static: {
      VRT1: {
        questionCount: 20,
        duration: 20,
        difficulty: 'basic',
        description: 'Basic verbal reasoning with reading comprehension'
      },
      VRT2: {
        questionCount: 20,
        duration: 20,
        difficulty: 'intermediate',
        description: 'Intermediate verbal reasoning with varied topics'
      },
      VRT3: {
        questionCount: 20,
        duration: 20,
        difficulty: 'intermediate',
        description: 'Business-focused verbal reasoning test'
      }
    },

    // Randomized Tests (New Behavior)
    randomized: {
      VRTR1: {
        questionCount: 20,
        duration: 25,
        difficulty: 'basic',
        description: 'Randomized basic verbal reasoning test',
        poolDistribution: {
          scienceNature: 0.6,
          businessEconomics: 0.2,
          historyCulture: 0.2
        }
      },
      VRTR2: {
        questionCount: 25,
        duration: 30,
        difficulty: 'intermediate',
        description: 'Randomized intermediate verbal reasoning test',
        poolDistribution: {
          scienceNature: 0.4,
          businessEconomics: 0.3,
          historyCulture: 0.3
        }
      },
      VRTR3: {
        questionCount: 30,
        duration: 35,
        difficulty: 'advanced',
        description: 'Randomized advanced verbal reasoning test',
        poolDistribution: {
          scienceNature: 0.3,
          businessEconomics: 0.4,
          historyCulture: 0.3
        }
      },
      ANALOGY1: {
        questionCount: 15,
        duration: 20,
        difficulty: 'basic',
        description: 'Basic verbal analogies test',
        testType: 'verbal_analogies'
      },
      ANALOGY2: {
        questionCount: 20,
        duration: 25,
        difficulty: 'intermediate',
        description: 'Intermediate verbal analogies test',
        testType: 'verbal_analogies'
      },
      ANALOGY3: {
        questionCount: 25,
        duration: 30,
        difficulty: 'advanced',
        description: 'Advanced verbal analogies test',
        testType: 'verbal_analogies'
      }
    }
  },

  // ==========================================
  // QUESTION POOL MANAGEMENT
  // ==========================================
  questionPools: {
    minimumPoolSize: {
      basic: 100, // Need at least 100 questions for basic tests
      intermediate: 150,
      advanced: 200
    },
    targetPoolSize: {
      basic: 300, // Target 300 questions for good randomization
      intermediate: 500,
      advanced: 700
    },
    retirementThreshold: 3, // Retire questions after 3 uses
    refreshCycle: 30 // Add new questions every 30 days
  },

  // ==========================================
  // SCORING CONFIGURATION
  // ==========================================
  scoring: {
    passingScore: 70, // 70% to pass
    gradingScale: {
      excellent: 90,
      good: 80,
      satisfactory: 70,
      needsImprovement: 60,
      unsatisfactory: 0
    },
    timeBonus: {
      enabled: true,
      maxBonus: 5, // Maximum 5% bonus for fast completion
      bonusThreshold: 0.75 // Bonus if completed in less than 75% of allotted time
    },
    penaltyForGuessing: {
      enabled: false, // Set to true to penalize random guessing
      penaltyRate: 0.25 // Deduct 0.25 points for wrong answers
    }
  },

  // ==========================================
  // ACCESSIBILITY SETTINGS
  // ==========================================
  accessibility: {
    fontSize: {
      small: '14px',
      medium: '16px',
      large: '18px',
      extraLarge: '20px'
    },
    colorSchemes: {
      default: {
        background: '#ffffff',
        text: '#1f2937',
        accent: '#3b82f6'
      },
      highContrast: {
        background: '#000000',
        text: '#ffffff',
        accent: '#ffff00'
      },
      darkMode: {
        background: '#1f2937',
        text: '#f9fafb',
        accent: '#60a5fa'
      }
    },
    supportScreenReader: true,
    keyboardNavigation: true,
    extendedTime: {
      enabled: true,
      multiplier: 1.5 // 50% extra time for accessibility needs
    }
  },

  // ==========================================
  // ANALYTICS CONFIGURATION
  // ==========================================
  analytics: {
    trackQuestionDifficulty: true,
    trackUserProgress: true,
    trackTimePerQuestion: true,
    trackAnswerPatterns: true,
    generateReports: {
      daily: true,
      weekly: true,
      monthly: true
    },
    dataRetention: {
      userSessions: 90, // Keep user session data for 90 days
      testResults: 365, // Keep test results for 1 year
      analytics: 730 // Keep analytics for 2 years
    }
  },

  // ==========================================
  // DEVELOPMENT & TESTING
  // ==========================================
  development: {
    debugMode: import.meta.env.DEV,
    showQuestionIds: false,
    showCorrectAnswers: false,
    bypassTimeLimit: false,
    enableTestMode: true, // Allow developers to see all questions
    logLevel: 'info' // 'debug', 'info', 'warn', 'error'
  }
};

// ==========================================
// HELPER FUNCTIONS
// ==========================================

/**
 * Get test configuration by test ID
 */
export const getTestConfig = (testId) => {
  // Check randomized tests first
  if (testConfiguration.testVariants.randomized[testId]) {
    return {
      ...testConfiguration.testVariants.randomized[testId],
      isRandomized: true,
      testId
    };
  }

  // Check static tests
  if (testConfiguration.testVariants.static[testId]) {
    return {
      ...testConfiguration.testVariants.static[testId],
      isRandomized: false,
      testId
    };
  }

  // Default configuration
  return {
    questionCount: 20,
    duration: 20,
    difficulty: 'intermediate',
    description: 'Standard verbal reasoning test',
    isRandomized: false,
    testId
  };
};

/**
 * Check if anti-cheating features are enabled
 */
export const isAntiCheatEnabled = () => {
  return testConfiguration.antiCheating.enabled;
};

/**
 * Get recommended question pool sizes
 */
export const getPoolSizeRequirements = (difficulty) => {
  return {
    minimum: testConfiguration.questionPools.minimumPoolSize[difficulty] || 100,
    target: testConfiguration.questionPools.targetPoolSize[difficulty] || 300
  };
};

/**
 * DEPRECATED: Frontend scoring functions removed
 * All scoring is now handled by the backend API
 */

/**
 * @deprecated Use backend API for score calculation
 * @throws {Error} Always throws error - use backend API instead
 */
export const calculateFinalScore = () => {
  throw new Error('calculateFinalScore() is deprecated. Use backend API for scoring.');
};

/**
 * @deprecated Use backend API for grade calculation
 * @throws {Error} Always throws error - use backend API instead
 */
export const getGrade = () => {
  throw new Error('getGrade() is deprecated. Use backend API for scoring.');
};

export default testConfiguration;
