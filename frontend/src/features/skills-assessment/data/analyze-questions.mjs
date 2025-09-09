#!/usr/bin/env node

/**
 * Comprehensive Question Count Analysis
 * This script analyzes all question files to give exact counts
 */

import fs from 'fs';
import path from 'path';

const BASE_PATH = '.';

// Read JSONL files
function readJSONL(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        return content.trim().split('\n').map(line => JSON.parse(line));
    } catch (error) {
        console.error(`Error reading ${filePath}:`, error.message);
        return [];
    }
}

// Read JS files and extract question data
function countQuestionsInJS(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        
        // Count different patterns for questions
        const idMatches = content.match(/"id":\s*"[^"]+"/g) || [];
        const vrtMatches = content.match(/VR-[A-Z]+-\d+/g) || [];
        const sjtMatches = content.match(/SJT-\d+/g) || [];
        const spatialMatches = content.match(/question_\d+/g) || [];
        
        return {
            ids: idMatches.length,
            vrt: vrtMatches.length,
            sjt: sjtMatches.length,
            spatial: spatialMatches.length,
            total: Math.max(idMatches.length, vrtMatches.length, sjtMatches.length, spatialMatches.length)
        };
    } catch (error) {
        console.error(`Error reading ${filePath}:`, error.message);
        return { ids: 0, vrt: 0, sjt: 0, spatial: 0, total: 0 };
    }
}

function analyzeAllFiles() {
    console.log('🔍 COMPREHENSIVE QUESTION ANALYSIS\n');
    
    let totalQuestions = 0;
    
    // Analyze JSONL files
    console.log('📄 JSONL Files:');
    const jsonlFiles = [
        'masterSJTPool.jsonl',
        'verbal_analogy_dataset.jsonl',
        'verbal_classification_dataset.jsonl', 
        'verbal_coding_decoding_dataset.jsonl',
        'verbalReasoningVRT7.jsonl'
    ];
    
    jsonlFiles.forEach(file => {
        const filePath = path.join(BASE_PATH, file);
        if (fs.existsSync(filePath)) {
            const questions = readJSONL(filePath);
            console.log(`  ${file}: ${questions.length} questions`);
            totalQuestions += questions.length;
        } else {
            console.log(`  ${file}: FILE NOT FOUND`);
        }
    });
    
    console.log(`\n📄 JSONL Total: ${totalQuestions} questions\n`);
    
    // Analyze JS files
    console.log('📜 JavaScript Files:');
    const jsFiles = [
        'verbalAnalogiesVRT4.js',
        'verbalBloodRelationsLogicalPuzzlesVRT7_Enhanced.js',
        'verbalClassificationVRT5.js',
        'verbalCodingDecodingVRT6.js',
        'spatialTestSections.js',
        'imageBasedQuestions.js',
        'randomizedQuestionPools.js',
        'verbalReasoningCategories.js',
        'verbalTestSections.js'
    ];
    
    let jsTotal = 0;
    jsFiles.forEach(file => {
        const filePath = path.join(BASE_PATH, file);
        if (fs.existsSync(filePath)) {
            const counts = countQuestionsInJS(filePath);
            console.log(`  ${file}: ~${counts.total} questions (${counts.ids} IDs, ${counts.vrt} VRT, ${counts.sjt} SJT, ${counts.spatial} spatial)`);
            jsTotal += counts.total;
        } else {
            console.log(`  ${file}: FILE NOT FOUND`);
        }
    });
    
    console.log(`\n📜 JS Files Total: ~${jsTotal} questions (may have duplicates)\n`);
    
    // Check migration directory
    console.log('📁 Migration Directory Analysis:');
    const migrationPath = path.join(BASE_PATH, 'db-migration');
    
    if (fs.existsSync(migrationPath)) {
        // Check situational judgment
        const sjtPath = path.join(migrationPath, 'situational-judgment', 'sjt_questions.jsonl');
        if (fs.existsSync(sjtPath)) {
            const sjtQuestions = readJSONL(sjtPath);
            console.log(`  SJT Migration: ${sjtQuestions.length} questions`);
        }
        
        // Check verbal reasoning
        const verbalPath = path.join(migrationPath, 'verbal-reasoning');
        if (fs.existsSync(verbalPath)) {
            const verbalFiles = fs.readdirSync(verbalPath);
            let verbalTotal = 0;
            verbalFiles.forEach(file => {
                if (file.endsWith('.jsonl')) {
                    const questions = readJSONL(path.join(verbalPath, file));
                    console.log(`  ${file}: ${questions.length} questions`);
                    verbalTotal += questions.length;
                } else if (file.endsWith('.js')) {
                    const counts = countQuestionsInJS(path.join(verbalPath, file));
                    console.log(`  ${file}: ~${counts.total} questions`);
                }
            });
            console.log(`  Verbal Total: ${verbalTotal}+ questions`);
        }
    } else {
        console.log('  Migration directory not found');
    }
    
    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 SUMMARY:');
    console.log(`• Confirmed JSONL Questions: ${totalQuestions}`);
    console.log(`• Additional JS Questions: ~${jsTotal - totalQuestions} (estimated)`);
    console.log(`• Total Estimated: ~${totalQuestions + (jsTotal - totalQuestions)}`);
    console.log('\n💡 Recommendations:');
    console.log('1. Convert all JS files to JSONL for consistent format');
    console.log('2. Deduplicate questions across files');
    console.log('3. Ensure all questions have proper database-ready format');
}

// Run analysis
analyzeAllFiles();
