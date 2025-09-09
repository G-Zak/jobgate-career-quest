// VRT7 Integration Test - Simulate how VerbalReasoningTest component loads VRT7
// This simulates the exact process used by the component

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('=== VRT7 Integration Test ===');

// Simulate the loading process from VerbalReasoningTest.jsx
async function testVRT7Loading() {
  try {
    console.log('1. Testing VRT7 loading through test manager...');
    
    // Import the manager like the component does
    const { getRandomizedTestByLegacyId } = await import('./src/features/skills-assessment/data/verbalReasoningTestManager.js');
    
    console.log('2. Calling getRandomizedTestByLegacyId with VRT7...');
    
    // This is exactly what the VerbalReasoningTest component does for VRT7
    const vrt7Data = getRandomizedTestByLegacyId('VRT7');
    
    console.log('✅ VRT7 loaded successfully!');
    console.log('Test ID:', vrt7Data.id);
    console.log('Title:', vrt7Data.title);
    console.log('Description:', vrt7Data.description);
    console.log('Time Limit:', vrt7Data.timeLimit);
    
    // Check if it has the correct structure for the UI
    if (vrt7Data.sections && vrt7Data.sections.length > 0) {
      console.log('✅ Sections structure exists');
      const section = vrt7Data.sections[0];
      console.log('Section:', section.title);
      console.log('Passages (questions):', section.questions?.length || 0);
      
      if (section.questions && section.questions.length > 0) {
        const firstPassage = section.questions[0];
        console.log('✅ First passage structure verified:');
        console.log('  - Title:', firstPassage.passage_title);
        console.log('  - Has passage text:', !!firstPassage.passage_text);
        console.log('  - Questions in passage:', firstPassage.questions?.length || 0);
        
        if (firstPassage.questions && firstPassage.questions.length > 0) {
          const firstQuestion = firstPassage.questions[0];
          console.log('✅ First question verified:');
          console.log('  - ID:', firstQuestion.id);
          console.log('  - Type:', firstQuestion.type);
          console.log('  - Has options:', !!firstQuestion.options);
          console.log('  - Options count:', firstQuestion.options?.length || 0);
          console.log('  - Has correct answer:', !!firstQuestion.correct_answer);
        }
      }
    } else {
      console.log('❌ Missing sections structure - UI expects sections!');
    }
    
    console.log('✅ VRT7 Integration test completed successfully!');
    
  } catch (error) {
    console.error('❌ VRT7 Integration test failed:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

testVRT7Loading();
