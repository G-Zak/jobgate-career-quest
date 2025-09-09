// Test script to validate VRT7 Enhanced data structure
import { getVRT7Enhanced } from './src/features/skills-assessment/data/verbalBloodRelationsLogicalPuzzlesVRT7_Enhanced.js';

console.log('=== VRT7 Enhanced Test ===');

try {
  const vrt7Data = getVRT7Enhanced();
  
  console.log('✅ VRT7 data loaded successfully');
  console.log('Test ID:', vrt7Data.id);
  console.log('Title:', vrt7Data.title);
  console.log('Description:', vrt7Data.description);
  console.log('Time Limit:', vrt7Data.timeLimit, 'minutes');
  
  // Check sections structure
  if (vrt7Data.sections && vrt7Data.sections.length > 0) {
    console.log('✅ Sections structure exists');
    const section = vrt7Data.sections[0];
    console.log('Section ID:', section.id);
    console.log('Section Title:', section.title);
    console.log('Instructions count:', section.instructions?.length || 0);
    console.log('Questions (passages) count:', section.questions?.length || 0);
    
    // Check first question structure
    if (section.questions && section.questions.length > 0) {
      const firstPassage = section.questions[0];
      console.log('✅ First passage structure:');
      console.log('  - Passage Title:', firstPassage.passage_title);
      console.log('  - Passage Text length:', firstPassage.passage_text?.length || 0);
      console.log('  - Questions in passage:', firstPassage.questions?.length || 0);
      
      if (firstPassage.questions && firstPassage.questions.length > 0) {
        const firstQuestion = firstPassage.questions[0];
        console.log('✅ First question structure:');
        console.log('  - Question ID:', firstQuestion.id);
        console.log('  - Question Text:', firstQuestion.question_text?.substring(0, 100) + '...');
        console.log('  - Options count:', firstQuestion.options?.length || 0);
        console.log('  - Correct Answer:', firstQuestion.correct_answer);
        console.log('  - Type:', firstQuestion.type);
        console.log('  - Difficulty:', firstQuestion.difficulty);
      }
    }
  } else {
    console.log('❌ No sections structure found');
  }
  
  // Check statistics
  if (vrt7Data.statistics) {
    console.log('✅ Statistics:');
    console.log('  - Total Questions:', vrt7Data.statistics.total_questions);
    console.log('  - Blood Relations:', vrt7Data.statistics.blood_relations);
    console.log('  - Logical Puzzles:', vrt7Data.statistics.logical_puzzles);
    console.log('  - Difficulty Distribution:', vrt7Data.statistics.difficulty);
  }
  
  console.log('=== Test completed successfully ===');
  
} catch (error) {
  console.error('❌ Error testing VRT7:', error);
  console.error('Stack:', error.stack);
}
