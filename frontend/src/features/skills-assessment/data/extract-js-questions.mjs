#!/usr/bin/env node

/**
 * JS to JSONL Converter
 * Extracts questions from JS files and converts them to clean JSONL format
 */

import fs from 'fs';
import path from 'path';

// Extract questions from verbalClassificationVRT5.js
function extractClassificationQuestions() {
    console.log('🔄 Extracting Classification Questions...');
    
    const filePath = 'verbalClassificationVRT5.js';
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Extract the SAMPLE_CLASSIFICATION array
    const match = content.match(/const SAMPLE_CLASSIFICATION = \[([\s\S]*?)\];/);
    if (!match) {
        console.log('❌ Could not find SAMPLE_CLASSIFICATION array');
        return [];
    }
    
    try {
        // Clean up the array content and parse
        let arrayContent = match[1];
        
        // Split by question objects (look for {id: pattern)
        const questionMatches = arrayContent.match(/\{id:"[^"]+"[^}]*\}/g) || [];
        
        const questions = questionMatches.map(questionStr => {
            try {
                // Clean up the string and parse as JSON
                const cleanStr = questionStr
                    .replace(/id:/g, '"id":')
                    .replace(/type:/g, '"type":')
                    .replace(/difficulty:/g, '"difficulty":')
                    .replace(/stem:/g, '"stem":')
                    .replace(/choices:/g, '"choices":')
                    .replace(/answer_index:/g, '"answer_index":')
                    .replace(/answer:/g, '"answer":')
                    .replace(/explanation:/g, '"explanation":');
                
                return JSON.parse(cleanStr);
            } catch (e) {
                console.warn('⚠️  Failed to parse question:', questionStr.substring(0, 50));
                return null;
            }
        }).filter(q => q !== null);
        
        console.log(`✅ Extracted ${questions.length} classification questions`);
        return questions;
    } catch (error) {
        console.error('❌ Error extracting classification questions:', error.message);
        return [];
    }
}

// Extract questions from verbalCodingDecodingVRT6.js
function extractCodingDecodingQuestions() {
    console.log('🔄 Extracting Coding/Decoding Questions...');
    
    const filePath = 'verbalCodingDecodingVRT6.js';
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Look for question patterns
    const questionMatches = content.match(/\{[^}]*id:"VR-CD-\d+"[^}]*\}/g) || [];
    
    const questions = questionMatches.map(questionStr => {
        try {
            // Clean up the string for JSON parsing
            const cleanStr = questionStr
                .replace(/(\w+):/g, '"$1":')
                .replace(/'/g, '"');
            
            return JSON.parse(cleanStr);
        } catch (e) {
            console.warn('⚠️  Failed to parse coding question:', questionStr.substring(0, 50));
            return null;
        }
    }).filter(q => q !== null);
    
    console.log(`✅ Extracted ${questions.length} coding/decoding questions`);
    return questions;
}

// Convert all additional JS questions
function convertAllJSQuestions() {
    console.log('🚀 Converting JS Files to JSONL Format\n');
    
    // Extract classification questions
    const classificationQuestions = extractClassificationQuestions();
    if (classificationQuestions.length > 0) {
        const outputPath = 'db-migration/verbal-reasoning/classification_questions_extended.jsonl';
        const jsonlContent = classificationQuestions.map(q => JSON.stringify(q)).join('\n');
        fs.writeFileSync(outputPath, jsonlContent);
        console.log(`📝 Wrote ${classificationQuestions.length} questions to ${outputPath}\n`);
    }
    
    // Extract coding/decoding questions
    const codingQuestions = extractCodingDecodingQuestions();
    if (codingQuestions.length > 0) {
        const outputPath = 'db-migration/verbal-reasoning/coding_decoding_questions_extended.jsonl';
        const jsonlContent = codingQuestions.map(q => JSON.stringify(q)).join('\n');
        fs.writeFileSync(outputPath, jsonlContent);
        console.log(`📝 Wrote ${codingQuestions.length} questions to ${outputPath}\n`);
    }
    
    console.log('✅ JS to JSONL conversion complete!');
    console.log('\n📊 Summary:');
    console.log(`• Classification: ${classificationQuestions.length} additional questions`);
    console.log(`• Coding/Decoding: ${codingQuestions.length} additional questions`);
    console.log(`• Total New Questions: ${classificationQuestions.length + codingQuestions.length}`);
}

// Run conversion
convertAllJSQuestions();
