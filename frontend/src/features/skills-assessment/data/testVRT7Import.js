// Simple VRT7 test - check if the data loads properly
import verbalReasoningVRT7Data from './verbalReasoningVRT7.jsonl?raw';

console.log('VRT7 Raw Data Length:', verbalReasoningVRT7Data ? verbalReasoningVRT7Data.length : 'undefined');
console.log('VRT7 First 100 chars:', verbalReasoningVRT7Data ? verbalReasoningVRT7Data.substring(0, 100) : 'undefined');

export const testVRT7Import = () => {
  try {
    const lines = verbalReasoningVRT7Data.trim().split('\n');
    console.log('VRT7 Lines found:', lines.length);
    return { success: true, lineCount: lines.length };
  } catch (error) {
    console.error('VRT7 Import Error:', error);
    return { success: false, error: error.message };
  }
};
