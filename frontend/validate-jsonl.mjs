// JSONL Schema Validator for JobGate Career Quest
// Validates all JSONL data files for consistency and completeness

import fs from 'fs';
import path from 'path';

// Define schema for different test types
const schemas = {
  sjt: {
    required: ['id', 'domain', 'scenario', 'choices', 'answer_index', 'answer', 'explanation', 'difficulty', 'tags', 'translations'],
    types: {
      id: 'string',
      domain: 'string', 
      scenario: 'string',
      choices: 'array',
      answer_index: 'number',
      answer: 'string',
      explanation: 'string',
      difficulty: 'string',
      tags: 'array',
      translations: 'object'
    }
  },
  verbal: {
    required: ['id', 'type', 'stem', 'choices', 'answer_index', 'answer', 'difficulty', 'explanation', 'tags', 'translations'],
    types: {
      id: 'string',
      type: 'string',
      stem: 'string',
      choices: 'array',
      answer_index: 'number', 
      answer: 'string',
      difficulty: 'string',
      explanation: 'string',
      tags: 'array',
      translations: 'object'
    }
  }
};

// Validate a single question object
function validateQuestion(question, schema, filename, lineNumber) {
  const errors = [];
  
  // Check required fields
  for (const field of schema.required) {
    if (!(field in question)) {
      errors.push(`Missing required field: ${field}`);
    }
  }
  
  // Check field types
  for (const [field, expectedType] of Object.entries(schema.types)) {
    if (field in question) {
      const actualType = Array.isArray(question[field]) ? 'array' : typeof question[field];
      if (actualType !== expectedType) {
        errors.push(`Field '${field}' should be ${expectedType}, got ${actualType}`);
      }
    }
  }
  
  // Validate choices array
  if (question.choices && Array.isArray(question.choices)) {
    if (question.choices.length < 2) {
      errors.push(`Choices array should have at least 2 options`);
    }
  }
  
  // Validate answer_index
  if (typeof question.answer_index === 'number' && question.choices) {
    if (question.answer_index < 0 || question.answer_index >= question.choices.length) {
      errors.push(`answer_index ${question.answer_index} is out of bounds for choices array`);
    }
  }
  
  // Validate answer matches choice
  if (question.answer && question.choices && typeof question.answer_index === 'number') {
    if (question.choices[question.answer_index] !== question.answer) {
      errors.push(`answer '${question.answer}' doesn't match choice at index ${question.answer_index}: '${question.choices[question.answer_index]}'`);
    }
  }
  
  return errors.map(error => `${filename}:${lineNumber} - ${error}`);
}

// Validate a JSONL file
function validateJSONL(filePath, schema) {
  console.log(`\n🔍 Validating ${path.basename(filePath)}...`);
  
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.trim().split('\n');
  const errors = [];
  let validQuestions = 0;
  
  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    
    try {
      const question = JSON.parse(line);
      const questionErrors = validateQuestion(question, schema, path.basename(filePath), lineNumber);
      errors.push(...questionErrors);
      
      if (questionErrors.length === 0) {
        validQuestions++;
      }
    } catch (e) {
      errors.push(`${path.basename(filePath)}:${lineNumber} - Invalid JSON: ${e.message}`);
    }
  });
  
  console.log(`✅ Valid questions: ${validQuestions}/${lines.length}`);
  
  if (errors.length > 0) {
    console.log(`❌ Found ${errors.length} errors:`);
    errors.forEach(error => console.log(`  ${error}`));
  } else {
    console.log(`✅ All questions valid!`);
  }
  
  return { validQuestions, totalQuestions: lines.length, errors };
}

// Main validation function
async function validateAllJSONL() {
  console.log('🧪 JSONL Schema Validation Report');
  console.log('================================');
  
  const dataDir = './src/features/skills-assessment/data';
  const files = [
    { path: path.join(dataDir, 'masterSJTPool.jsonl'), schema: schemas.sjt },
    { path: path.join(dataDir, 'verbalReasoningVRT7.jsonl'), schema: schemas.verbal },
    { path: path.join(dataDir, 'verbal_analogy_dataset.jsonl'), schema: schemas.verbal },
    { path: path.join(dataDir, 'verbal_classification_dataset.jsonl'), schema: schemas.verbal },
    { path: path.join(dataDir, 'verbal_coding_decoding_dataset.jsonl'), schema: schemas.verbal }
  ];
  
  const results = [];
  
  for (const file of files) {
    if (fs.existsSync(file.path)) {
      const result = validateJSONL(file.path, file.schema);
      results.push({ file: path.basename(file.path), ...result });
    } else {
      console.log(`⚠️  File not found: ${file.path}`);
    }
  }
  
  // Summary
  console.log('\n📊 Summary:');
  console.log('===========');
  
  let totalValid = 0;
  let totalQuestions = 0;
  let totalErrors = 0;
  
  results.forEach(result => {
    totalValid += result.validQuestions;
    totalQuestions += result.totalQuestions;
    totalErrors += result.errors.length;
    
    const percentage = ((result.validQuestions / result.totalQuestions) * 100).toFixed(1);
    console.log(`${result.file}: ${result.validQuestions}/${result.totalQuestions} (${percentage}%) valid`);
  });
  
  console.log(`\nOverall: ${totalValid}/${totalQuestions} questions valid`);
  console.log(`Total errors: ${totalErrors}`);
  
  if (totalErrors === 0) {
    console.log('🎉 All JSONL files are valid!');
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  validateAllJSONL().catch(console.error);
}

export { validateJSONL, validateQuestion, schemas };
