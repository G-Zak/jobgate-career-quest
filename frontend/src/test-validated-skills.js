/**
 * Test script for validated skills integration
 * Run this in the browser console to test the functionality
 */

import { getValidatedSkills, filterToValidatedSkills, getValidationStats } from './utils/validatedSkills.js';

// Test function
async function testValidatedSkills() {
    console.log('🧪 Testing Validated Skills Integration...');

    const userId = 5; // Test user ID
    const userSkills = ['Python', 'Django', 'React', 'JavaScript', 'Java'];

    try {
        // Test 1: Get validated skills
        console.log('\n📋 Test 1: Getting validated skills...');
        const validatedSkills = await getValidatedSkills(userId);
        console.log('✅ Validated skills:', validatedSkills);

        // Test 2: Filter to validated skills
        console.log('\n📋 Test 2: Filtering to validated skills...');
        const filteredSkills = await filterToValidatedSkills(userSkills, userId);
        console.log('✅ Filtered skills:', filteredSkills);

        // Test 3: Get validation stats
        console.log('\n📋 Test 3: Getting validation statistics...');
        const stats = await getValidationStats(userSkills, userId);
        console.log('✅ Validation stats:', stats);

        // Test 4: Check specific skill validation
        console.log('\n📋 Test 4: Checking specific skill validation...');
        const isPythonValidated = validatedSkills.includes('Python');
        const isReactValidated = validatedSkills.includes('React');
        console.log('✅ Python validated:', isPythonValidated);
        console.log('✅ React validated:', isReactValidated);

        console.log('\n🎉 All tests completed successfully!');

        return {
            validatedSkills,
            filteredSkills,
            stats,
            isPythonValidated,
            isReactValidated
        };

    } catch (error) {
        console.error('❌ Test failed:', error);
        return null;
    }
}

// Export for use in browser console
window.testValidatedSkills = testValidatedSkills;

console.log('🧪 Validated Skills Test loaded. Run testValidatedSkills() to test the integration.');
