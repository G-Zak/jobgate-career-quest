/**
 * Master Situational Judgment Test (SJT) Generator
 * Manages question pool, test generation, retake logic, and anti-cheating measures
 */

import masterSJTPool from '../data/masterSJTPool.jsonl?raw';

class MasterSJTGenerator {
  constructor() {
    this.questionPool = [];
    this.usedQuestions = new Map(); // userId -> Set of used question IDs
    this.retakeCooldown = 14 * 24 * 60 * 60 * 1000; // 2 weeks in milliseconds
    this.lastTestDates = new Map(); // userId -> last test date
    this.init();
  }

  /**
   * Initialize the question pool from JSONL data
   */
  init() {
    try {
      const lines = masterSJTPool.trim().split('\n');
      this.questionPool = lines
        .filter(line => line.trim() && !line.includes('"total_items"')) // Exclude metadata
        .map(line => {
          try {
            return JSON.parse(line);
          } catch (e) {
            console.warn('Failed to parse question line:', line);
            return null;
          }
        })
        .filter(Boolean);
      
      console.log(`Initialized SJT pool with ${this.questionPool.length} questions`);
    } catch (error) {
      console.error('Failed to initialize SJT question pool:', error);
      this.questionPool = [];
    }
  }

  /**
   * Check if user can take a test (respects cooldown period)
   */
  canUserTakeTest(userId) {
    // DEVELOPMENT: Temporarily disable cooldown for testing
    return true;
    
    const lastTestDate = this.lastTestDates.get(userId);
    if (!lastTestDate) return true;
    
    const timeSinceLastTest = Date.now() - lastTestDate;
    return timeSinceLastTest >= this.retakeCooldown;
  }

  /**
   * Get days remaining until user can retake
   */
  getDaysUntilRetake(userId) {
    const lastTestDate = this.lastTestDates.get(userId);
    if (!lastTestDate) return 0;
    
    const timeSinceLastTest = Date.now() - lastTestDate;
    const timeRemaining = this.retakeCooldown - timeSinceLastTest;
    return Math.ceil(timeRemaining / (24 * 60 * 60 * 1000));
  }

  /**
   * Clear test history for development (removes cooldown restrictions)
   */
  clearTestHistory(userId = null) {
    if (userId) {
      this.lastTestDates.delete(userId);
      this.usedQuestions.delete(userId);
    } else {
      this.lastTestDates.clear();
      this.usedQuestions.clear();
    }
  }

  /**
   * Get available questions for a user (excluding previously used ones)
   */
  getAvailableQuestions(userId) {
    const usedIds = this.usedQuestions.get(userId) || new Set();
    return this.questionPool.filter(q => !usedIds.has(q.id));
  }

  /**
   * Generate a balanced test with specified parameters
   */
  generateTest(userId, testOptions = {}) {
    const options = {
      questionCount: 35,
      domains: {
        teamwork: 7,
        leadership: 6,
        communication: 5,
        customer_service: 4,
        ethics: 4,
        inclusivity: 4,
        conflict: 3,
        safety: 2
      },
      difficultyDistribution: {
        easy: 0.4,   // 40%
        medium: 0.4, // 40% 
        hard: 0.2    // 20%
      },
      ...testOptions
    };

    if (!this.canUserTakeTest(userId)) {
      throw new Error(`User must wait ${this.getDaysUntilRetake(userId)} more days before retaking the test`);
    }

    const availableQuestions = this.getAvailableQuestions(userId);
    
    if (availableQuestions.length < options.questionCount) {
      // Reset used questions for this user if pool is exhausted
      console.log(`Resetting question pool for user ${userId} - insufficient unused questions`);
      this.usedQuestions.delete(userId);
      return this.generateTest(userId, testOptions);
    }

    const selectedQuestions = [];
    const domainQuestions = this.groupQuestionsByDomain(availableQuestions);
    
    // Select questions by domain
    for (const [domain, count] of Object.entries(options.domains)) {
      const domainPool = domainQuestions[domain] || [];
      if (domainPool.length < count) {
        console.warn(`Insufficient questions for domain ${domain}: needed ${count}, available ${domainPool.length}`);
      }
      
      const domainSelected = this.selectQuestionsByDifficulty(
        domainPool, 
        Math.min(count, domainPool.length), 
        options.difficultyDistribution
      );
      selectedQuestions.push(...domainSelected);
    }

    // Fill remaining slots if needed
    const remaining = options.questionCount - selectedQuestions.length;
    if (remaining > 0) {
      const usedIds = new Set(selectedQuestions.map(q => q.id));
      const remainingPool = availableQuestions.filter(q => !usedIds.has(q.id));
      const additional = this.selectQuestionsByDifficulty(
        remainingPool, 
        remaining, 
        options.difficultyDistribution
      );
      selectedQuestions.push(...additional);
    }

    // Shuffle questions and choices
    const shuffledQuestions = this.shuffleArray([...selectedQuestions])
      .slice(0, options.questionCount)
      .map(question => this.randomizeChoices(question));

    // Track used questions
    const usedIds = this.usedQuestions.get(userId) || new Set();
    shuffledQuestions.forEach(q => usedIds.add(q.id));
    this.usedQuestions.set(userId, usedIds);
    this.lastTestDates.set(userId, Date.now());

    return {
      questions: shuffledQuestions,
      metadata: this.generateMetadata(shuffledQuestions),
      testId: this.generateTestId(),
      userId,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Group questions by domain
   */
  groupQuestionsByDomain(questions) {
    return questions.reduce((groups, question) => {
      const domain = question.domain;
      if (!groups[domain]) groups[domain] = [];
      groups[domain].push(question);
      return groups;
    }, {});
  }

  /**
   * Select questions with proper difficulty distribution
   */
  selectQuestionsByDifficulty(pool, count, distribution) {
    const difficultyGroups = pool.reduce((groups, q) => {
      if (!groups[q.difficulty]) groups[q.difficulty] = [];
      groups[q.difficulty].push(q);
      return groups;
    }, {});

    const selected = [];
    const targetCounts = {
      easy: Math.round(count * distribution.easy),
      medium: Math.round(count * distribution.medium),
      hard: Math.round(count * distribution.hard)
    };

    // Adjust for rounding
    const total = Object.values(targetCounts).reduce((a, b) => a + b, 0);
    if (total !== count) {
      targetCounts.medium += count - total;
    }

    for (const [difficulty, targetCount] of Object.entries(targetCounts)) {
      const availableQuestions = difficultyGroups[difficulty] || [];
      const shuffled = this.shuffleArray([...availableQuestions]);
      selected.push(...shuffled.slice(0, Math.min(targetCount, shuffled.length)));
    }

    // Fill any remaining slots
    if (selected.length < count) {
      const usedIds = new Set(selected.map(q => q.id));
      const remaining = pool.filter(q => !usedIds.has(q.id));
      const additional = this.shuffleArray(remaining).slice(0, count - selected.length);
      selected.push(...additional);
    }

    return selected;
  }

  /**
   * Randomize answer choices order
   */
  randomizeChoices = (question) => {
    const originalAnswer = question.choices[question.answer_index];
    const shuffledChoices = this.shuffleArray([...question.choices]);
    const newAnswerIndex = shuffledChoices.indexOf(originalAnswer);
    
    return {
      ...question,
      choices: shuffledChoices,
      answer_index: newAnswerIndex,
      original_answer_index: question.answer_index // Keep for verification
    };
  }

  /**
   * Generate test metadata
   */
  generateMetadata(questions) {
    const domains = {};
    const difficulties = {};
    
    questions.forEach(q => {
      domains[q.domain] = (domains[q.domain] || 0) + 1;
      difficulties[q.difficulty] = (difficulties[q.difficulty] || 0) + 1;
    });

    return {
      total_items: questions.length,
      domains,
      difficulty_distribution: difficulties,
      generation_timestamp: new Date().toISOString()
    };
  }

  /**
   * Generate unique test ID
   */
  generateTestId() {
    return `SJT-TEST-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Shuffle array using Fisher-Yates algorithm
   */
  shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Score a completed test
   */
  scoreTest(questions, userAnswers) {
    let correctAnswers = 0;
    const results = [];

    questions.forEach((question, index) => {
      const userAnswer = userAnswers[index];
      const isCorrect = userAnswer === question.answer_index;
      if (isCorrect) correctAnswers++;

      results.push({
        questionId: question.id,
        domain: question.domain,
        difficulty: question.difficulty,
        userAnswer,
        correctAnswer: question.answer_index,
        isCorrect,
        explanation: question.explanation
      });
    });

    const score = Math.round((correctAnswers / questions.length) * 100);
    const domainScores = this.calculateDomainScores(results);

    return {
      totalScore: score,
      correctAnswers,
      totalQuestions: questions.length,
      domainScores,
      results,
      interpretation: this.interpretScore(score)
    };
  }

  /**
   * Calculate scores by domain
   */
  calculateDomainScores(results) {
    const domainResults = {};
    
    results.forEach(result => {
      if (!domainResults[result.domain]) {
        domainResults[result.domain] = { correct: 0, total: 0 };
      }
      domainResults[result.domain].total++;
      if (result.isCorrect) {
        domainResults[result.domain].correct++;
      }
    });

    const domainScores = {};
    Object.entries(domainResults).forEach(([domain, stats]) => {
      domainScores[domain] = {
        score: Math.round((stats.correct / stats.total) * 100),
        correct: stats.correct,
        total: stats.total
      };
    });

    return domainScores;
  }

  /**
   * Interpret overall score
   */
  interpretScore(score) {
    if (score >= 85) return { level: 'Excellent', description: 'Demonstrates excellent judgment and decision-making skills across all workplace situations.' };
    if (score >= 75) return { level: 'Proficient', description: 'Shows strong workplace judgment with good understanding of professional best practices.' };
    if (score >= 65) return { level: 'Developing', description: 'Demonstrates basic workplace judgment with room for improvement in some areas.' };
    if (score >= 55) return { level: 'Needs Development', description: 'Requires significant development in workplace judgment and decision-making skills.' };
    return { level: 'Inadequate', description: 'Needs comprehensive training in workplace judgment and professional behavior.' };
  }

  /**
   * Get pool statistics
   */
  getPoolStatistics() {
    const domains = {};
    const difficulties = {};
    
    this.questionPool.forEach(q => {
      domains[q.domain] = (domains[q.domain] || 0) + 1;
      difficulties[q.difficulty] = (difficulties[q.difficulty] || 0) + 1;
    });

    return {
      totalQuestions: this.questionPool.length,
      domains,
      difficulties,
      activeUsers: this.usedQuestions.size
    };
  }

  /**
   * Reset user's question history (admin function)
   */
  resetUserHistory(userId) {
    this.usedQuestions.delete(userId);
    this.lastTestDates.delete(userId);
  }

  /**
   * Get user's test history summary
   */
  getUserTestHistory(userId) {
    const usedQuestions = this.usedQuestions.get(userId);
    const lastTestDate = this.lastTestDates.get(userId);
    
    return {
      questionsUsed: usedQuestions ? usedQuestions.size : 0,
      lastTestDate: lastTestDate ? new Date(lastTestDate).toISOString() : null,
      canRetake: this.canUserTakeTest(userId),
      daysUntilRetake: this.getDaysUntilRetake(userId),
      questionsRemaining: this.getAvailableQuestions(userId).length
    };
  }
}

// Create singleton instance
const masterSJTGenerator = new MasterSJTGenerator();

export default masterSJTGenerator;
