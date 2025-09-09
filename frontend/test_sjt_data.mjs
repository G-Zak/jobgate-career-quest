// Quick test to verify SJT data format
import fs from 'fs';
import path from 'path';

const testSJTData = () => {
  try {
    const dataPath = '/Users/zakariaguennani/Documents/Dev/EMSI/Internship/jobgate-career-quest/frontend/src/features/skills-assessment/data/situationalJudgmentTest.jsonl';
    const content = fs.readFileSync(dataPath, 'utf8');
    const lines = content.trim().split('\n');
    
    // Parse first 5 questions to test
    const questions = lines
      .filter(line => line.trim() && !line.includes('"total_items"'))
      .slice(0, 5)
      .map(line => JSON.parse(line));
    
    console.log('✅ SJT Data Test Results:');
    console.log(`📊 Total lines found: ${lines.length}`);
    console.log(`🎯 Parsed questions: ${questions.length}`);
    
    questions.forEach((q, index) => {
      console.log(`\n📝 Question ${index + 1}:`);
      console.log(`   ID: ${q.id}`);
      console.log(`   Domain: ${q.domain}`);
      console.log(`   Difficulty: ${q.difficulty}`);
      console.log(`   Choices: ${q.choices ? q.choices.length : 'Missing!'}`);
      console.log(`   Answer Index: ${q.answer_index}`);
      console.log(`   Scenario Length: ${q.scenario ? q.scenario.length : 'Missing!'} chars`);
    });
    
    // Check if all required fields exist
    const requiredFields = ['id', 'domain', 'difficulty', 'scenario', 'choices', 'answer_index'];
    const missingFields = requiredFields.filter(field => 
      questions.some(q => !q.hasOwnProperty(field))
    );
    
    if (missingFields.length === 0) {
      console.log('\n✅ All required fields present in questions!');
    } else {
      console.log(`\n❌ Missing fields: ${missingFields.join(', ')}`);
    }
    
    return questions;
    
  } catch (error) {
    console.error('❌ Error testing SJT data:', error.message);
    return [];
  }
};

// Run the test
const testData = testSJTData();
console.log('\n🎯 Test completed!');
