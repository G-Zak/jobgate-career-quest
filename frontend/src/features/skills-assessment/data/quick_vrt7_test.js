// Quick test of VRT7 JavaScript version
import { getRandomizedVRT7Test, vrt7QuestionsData, vrt7Metadata } from './verbalBloodRelationsLogicalPuzzlesVRT7_JS.js';

console.log('🧪 VRT7 JavaScript Test');
console.log('='.repeat(40));

// Test data availability
console.log('📊 Data Check:');
console.log(`Total questions: ${vrt7QuestionsData.length}`);
console.log(`Blood Relations: ${vrt7QuestionsData.filter(q => q.type === 'blood_relations').length}`);
console.log(`Logical Puzzles: ${vrt7QuestionsData.filter(q => q.type === 'logical_puzzles').length}`);

// Test test generation
console.log('\n🎯 Test Generation:');
const testResult = getRandomizedVRT7Test(5);
console.log(`Test ID: ${testResult.id}`);
console.log(`Test Title: ${testResult.title}`);
console.log(`Questions Generated: ${testResult.questions.length}`);
console.log(`Time Limit: ${testResult.timeLimit} minutes`);

// Show first question
console.log('\n📝 Sample Question:');
const firstQ = testResult.questions[0];
console.log(`Q${firstQ.id}: ${firstQ.question_text.substring(0, 60)}...`);
console.log(`Type: ${firstQ.type}`);
console.log(`Difficulty: ${firstQ.difficulty}`);
console.log(`Options: ${firstQ.options.length}`);

console.log('\n✅ VRT7 JavaScript version working!');
