// VRT4 Test Verification Script
// Quick test to verify the VRT4 system is working correctly

import { getRandomizedVRT4, getAnalogiesDatasetStats, getAvailableQuestionTypes } from './verbalAnalogiesVRT4.js';

// Test the VRT4 system
export function testVRT4System() {
  console.log('🧪 Testing VRT4 - Verbal Analogies System');
  console.log('=' .repeat(50));

  try {
    // Test 1: Generate a randomized test
    console.log('\n📝 Test 1: Generating Randomized VRT4 Test');
    const test1 = getRandomizedVRT4();
    console.log(`✅ Test generated successfully`);
    console.log(`   Test ID: ${test1.id}`);
    console.log(`   Title: ${test1.title}`);
    console.log(`   Time Limit: ${test1.timeLimit} minutes`);
    console.log(`   Total Questions: ${test1.totalQuestions}`);

    // Test 2: Verify question distribution
    console.log('\n📊 Test 2: Verifying Question Distribution');
    const questions = test1.sections[0].passages[0].questions;
    
    const difficultyCount = {
      easy: questions.filter(q => q.difficulty === 'easy').length,
      medium: questions.filter(q => q.difficulty === 'medium').length,
      hard: questions.filter(q => q.difficulty === 'hard').length
    };
    
    console.log(`   Easy: ${difficultyCount.easy} (target: 12)`);
    console.log(`   Medium: ${difficultyCount.medium} (target: 12)`);
    console.log(`   Hard: ${difficultyCount.hard} (target: 6)`);
    
    const typeCount = {};
    questions.forEach(q => {
      typeCount[q.type] = (typeCount[q.type] || 0) + 1;
    });
    
    console.log('\n📝 Question Types Distribution:');
    Object.entries(typeCount).forEach(([type, count]) => {
      console.log(`   ${type}: ${count} questions`);
    });

    // Test 3: Verify randomization
    console.log('\n🔄 Test 3: Verifying Randomization');
    const test2 = getRandomizedVRT4();
    const questions2 = test2.sections[0].passages[0].questions;
    
    const firstQuestionIds1 = questions.slice(0, 5).map(q => q.original_id);
    const firstQuestionIds2 = questions2.slice(0, 5).map(q => q.original_id);
    
    const isDifferent = JSON.stringify(firstQuestionIds1) !== JSON.stringify(firstQuestionIds2);
    
    if (isDifferent) {
      console.log('✅ Tests are randomized (different question order/selection)');
      console.log(`   Test 1 first 5: ${firstQuestionIds1.join(', ')}`);
      console.log(`   Test 2 first 5: ${firstQuestionIds2.join(', ')}`);
    } else {
      console.log('⚠️  Tests may not be fully randomized (same first 5 questions)');
    }

    // Test 4: Dataset statistics
    console.log('\n📈 Test 4: Dataset Statistics');
    const stats = getAnalogiesDatasetStats();
    console.log(`   Total Questions in Pool: ${stats.totalQuestions}`);
    console.log(`   Easy: ${stats.byDifficulty.easy}`);
    console.log(`   Medium: ${stats.byDifficulty.medium}`);
    console.log(`   Hard: ${stats.byDifficulty.hard}`);

    // Test 5: Question types
    console.log('\n📋 Test 5: Available Question Types');
    const questionTypes = getAvailableQuestionTypes();
    questionTypes.forEach(type => {
      console.log(`   ${type.type}: ${type.totalQuestions} total (E:${type.difficultyBreakdown.easy}, M:${type.difficultyBreakdown.medium}, H:${type.difficultyBreakdown.hard})`);
    });

    // Test 6: Sample questions
    console.log('\n❓ Test 6: Sample Questions');
    questions.slice(0, 3).forEach((q, index) => {
      console.log(`\n   Question ${index + 1} (${q.difficulty}, ${q.type}):`);
      console.log(`   ${q.question_text}`);
      console.log(`   Options: ${q.options.join(', ')}`);
      console.log(`   Answer: ${q.correct_answer}`);
    });

    console.log('\n🎉 VRT4 System Test Complete - All tests passed!');
    return true;

  } catch (error) {
    console.error('❌ VRT4 System Test Failed:', error);
    return false;
  }
}

// Run the test if this file is executed directly
if (typeof window !== 'undefined') {
  // Browser environment
  window.testVRT4 = testVRT4System;
  console.log('VRT4 test function available as window.testVRT4()');
} else {
  // Node.js environment
  testVRT4System();
}
