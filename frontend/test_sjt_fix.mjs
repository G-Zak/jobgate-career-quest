#!/usr/bin/env node

/**
 * Test script to verify SJT component fix
 * Tests the MasterSJTGenerator utility directly
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Simple test to import and use the MasterSJTGenerator
async function testSJTGenerator() {
  try {
    console.log('🧪 Testing MasterSJTGenerator...');
    
    // Import the generator
    const { default: masterSJTGenerator } = await import('./src/features/skills-assessment/utils/masterSJTGenerator.js');
    
    console.log('✅ Successfully imported MasterSJTGenerator');
    
    // Test generating a small test
    const testResult = masterSJTGenerator.generateTest('test-user-123', { 
      questionCount: 5 
    });
    
    console.log(`✅ Generated test with ${testResult.questions.length} questions`);
    console.log(`✅ Test ID: ${testResult.testId}`);
    console.log(`✅ Test metadata:`, testResult.metadata);
    
    // Verify question structure
    const firstQuestion = testResult.questions[0];
    if (firstQuestion && firstQuestion.id && firstQuestion.scenario && firstQuestion.choices) {
      console.log('✅ Question structure is valid');
      console.log('   Sample question:', {
        id: firstQuestion.id,
        domain: firstQuestion.domain,
        scenario: firstQuestion.scenario.substring(0, 50) + '...',
        choiceCount: firstQuestion.choices.length
      });
    } else {
      console.log('❌ Invalid question structure');
      return false;
    }
    
    console.log('\n🎉 SJT Generator test PASSED! The component should work now.');
    return true;
    
  } catch (error) {
    console.error('❌ SJT Generator test FAILED:', error.message);
    console.error('Full error:', error);
    return false;
  }
}

// Run the test
testSJTGenerator().then(success => {
  process.exit(success ? 0 : 1);
});
