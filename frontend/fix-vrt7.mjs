// Fix verbalReasoningVRT7.jsonl schema issues
// This script standardizes field names and fixes schema inconsistencies

import fs from 'fs';

const filePath = './src/features/skills-assessment/data/verbalReasoningVRT7.jsonl';

// Read the file
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.trim().split('\n').filter(line => line.trim()); // Remove empty lines

console.log(`Processing ${lines.length} lines...`);

const fixedLines = lines.map((line, index) => {
  try {
    const obj = JSON.parse(line);
    
    // Skip if this is metadata (has total_items)
    if (obj.total_items !== undefined) {
      console.log(`Skipping metadata at line ${index + 1}`);
      return null;
    }
    
    // Fix field name issues
    if (obj.question && !obj.stem) {
      obj.stem = obj.question;
      delete obj.question;
      console.log(`Fixed 'question' -> 'stem' at line ${index + 1}`);
    }
    
    // Ensure all required fields exist with defaults
    if (!obj.id) obj.id = `VR-FIXED-${index + 1}`;
    if (!obj.type) obj.type = 'unknown';
    if (!obj.stem) obj.stem = 'Missing stem';
    if (!obj.choices) obj.choices = [];
    if (obj.answer_index === undefined) obj.answer_index = 0;
    if (!obj.answer) obj.answer = obj.choices[0] || 'Unknown';
    if (!obj.difficulty) obj.difficulty = 'medium';
    if (!obj.explanation) obj.explanation = 'No explanation provided';
    if (!obj.tags) obj.tags = ['verbal_reasoning'];
    if (!obj.translations) obj.translations = {};
    
    return JSON.stringify(obj);
  } catch (e) {
    console.error(`Error parsing line ${index + 1}: ${e.message}`);
    return null;
  }
}).filter(line => line !== null); // Remove null entries

console.log(`Fixed ${fixedLines.length} valid questions`);

// Write back to file
fs.writeFileSync(filePath, fixedLines.join('\n') + '\n');
console.log('✅ File updated successfully!');
