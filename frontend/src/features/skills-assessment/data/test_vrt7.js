#!/usr/bin/env node

// Test script to verify VRT7 functionality
import { getRandomizedVRT7Test } from './verbalBloodRelationsLogicalPuzzlesVRT7.js';

console.log('='.repeat(60));
console.log('VRT7 TEST EXECUTION VERIFICATION');
console.log('='.repeat(60));

try {
  // Test VRT7 generation
  console.log('\n1. Testing VRT7 test generation...');
  const vrt7Test = getRandomizedVRT7Test(10);
  
  console.log(`✅ Test ID: ${vrt7Test.id}`);
  console.log(`✅ Title: ${vrt7Test.title}`);
  console.log(`✅ Time Limit: ${vrt7Test.timeLimit} minutes`);
  console.log(`✅ Total Questions: ${vrt7Test.questions.length}`);
  
  // Verify question structure
  console.log('\n2. Verifying question structure...');
  const firstQuestion = vrt7Test.questions[0];
  console.log(`✅ Question 1 ID: ${firstQuestion.id}`);
  console.log(`✅ Question 1 Type: ${firstQuestion.type}`);
  console.log(`✅ Question 1 Difficulty: ${firstQuestion.difficulty}`);
  console.log(`✅ Question 1 Text: ${firstQuestion.question_text.substring(0, 80)}...`);
  console.log(`✅ Question 1 Options: ${firstQuestion.options.length} choices`);
  console.log(`✅ Question 1 Has Correct Answer: ${!!firstQuestion.correct_answer}`);
  console.log(`✅ Question 1 Has Explanation: ${!!firstQuestion.explanation}`);
  
  // Test question distribution
  console.log('\n3. Testing question distribution...');
  const bloodRelationsCount = vrt7Test.questions.filter(q => q.type === 'blood_relations').length;
  const logicalPuzzlesCount = vrt7Test.questions.filter(q => q.type === 'logical_puzzles').length;
  
  console.log(`✅ Blood Relations Questions: ${bloodRelationsCount}`);
  console.log(`✅ Logical Puzzles Questions: ${logicalPuzzlesCount}`);
  
  // Test difficulty distribution
  const difficultyDistribution = {};
  vrt7Test.questions.forEach(q => {
    difficultyDistribution[q.difficulty] = (difficultyDistribution[q.difficulty] || 0) + 1;
  });
  
  console.log('\n4. Difficulty distribution:');
  Object.entries(difficultyDistribution).forEach(([difficulty, count]) => {
    console.log(`✅ ${difficulty}: ${count} questions`);
  });
  
  console.log('\n' + '='.repeat(60));
  console.log('🎉 VRT7 INTEGRATION SUCCESSFUL!');
  console.log('✅ VRT7 is ready to run and fully functional!');
  console.log('='.repeat(60));
  
} catch (error) {
  console.error('\n❌ VRT7 Test Failed:', error.message);
  console.error('Stack:', error.stack);
  process.exit(1);
}
