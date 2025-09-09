#!/usr/bin/env node

/**
 * Data Quality Validation Script for Skills Assessment Migration
 * This script validates the JSONL files and provides statistics for database migration
 */

import fs from 'fs';
import path from 'path';

const BASE_PATH = './db-migration';

// Utility function to read JSONL file
function readJSONL(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        return content.trim().split('\n').map(line => JSON.parse(line));
    } catch (error) {
        console.error(`Error reading ${filePath}:`, error.message);
        return [];
    }
}

// Validate SJT questions
function validateSJTQuestions() {
    console.log('\n=== SITUATIONAL JUDGMENT TEST VALIDATION ===');
    const filePath = path.join(BASE_PATH, 'situational-judgment', 'sjt_questions.jsonl');
    const questions = readJSONL(filePath);
    
    console.log(`Total SJT Questions: ${questions.length}`);
    
    // Domain distribution
    const domains = {};
    const difficulties = {};
    const duplicateIds = new Set();
    const seenIds = new Set();
    
    questions.forEach(q => {
        // Check for duplicate IDs
        if (seenIds.has(q.id)) {
            duplicateIds.add(q.id);
        }
        seenIds.add(q.id);
        
        // Count domains
        domains[q.domain] = (domains[q.domain] || 0) + 1;
        
        // Count difficulties  
        difficulties[q.difficulty] = (difficulties[q.difficulty] || 0) + 1;
        
        // Basic validation
        if (!q.scenario || !q.choices || !q.answer || !q.explanation) {
            console.warn(`⚠️  Incomplete question: ${q.id}`);
        }
        
        if (q.choices.length !== 4) {
            console.warn(`⚠️  Question ${q.id} has ${q.choices.length} choices (expected 4)`);
        }
        
        if (q.answer_index < 0 || q.answer_index >= q.choices.length) {
            console.warn(`⚠️  Invalid answer_index for ${q.id}: ${q.answer_index}`);
        }
    });
    
    console.log('\nDomain Distribution:');
    Object.entries(domains).sort((a,b) => b[1] - a[1]).forEach(([domain, count]) => {
        console.log(`  ${domain}: ${count}`);
    });
    
    console.log('\nDifficulty Distribution:');
    Object.entries(difficulties).forEach(([diff, count]) => {
        console.log(`  ${diff}: ${count}`);
    });
    
    if (duplicateIds.size > 0) {
        console.warn(`⚠️  Duplicate IDs found: ${Array.from(duplicateIds).join(', ')}`);
    } else {
        console.log('✅ No duplicate IDs found');
    }
}

// Validate Verbal Reasoning questions
function validateVerbalQuestions() {
    console.log('\n=== VERBAL REASONING VALIDATION ===');
    
    const files = [
        { name: 'Analogy', path: 'analogy_questions.jsonl' },
        { name: 'Blood Relations', path: 'blood_relations_questions.jsonl' },
        { name: 'Classification', path: 'classification_questions.jsonl' },
        { name: 'Coding/Decoding', path: 'coding_decoding_questions.jsonl' }
    ];
    
    files.forEach(file => {
        const filePath = path.join(BASE_PATH, 'verbal-reasoning', file.path);
        if (!fs.existsSync(filePath)) {
            console.warn(`⚠️  File not found: ${file.path}`);
            return;
        }
        
        const questions = readJSONL(filePath);
        console.log(`\n${file.name}: ${questions.length} questions`);
        
        const types = {};
        const difficulties = {};
        
        questions.forEach(q => {
            types[q.type] = (types[q.type] || 0) + 1;
            difficulties[q.difficulty] = (difficulties[q.difficulty] || 0) + 1;
            
            // Basic validation
            if (!q.stem || !q.choices || q.answer_index === undefined) {
                console.warn(`⚠️  Incomplete question: ${q.id}`);
            }
        });
        
        if (Object.keys(types).length > 0) {
            console.log('  Types:', Object.entries(types).map(([k,v]) => `${k}(${v})`).join(', '));
        }
        console.log('  Difficulties:', Object.entries(difficulties).map(([k,v]) => `${k}(${v})`).join(', '));
    });
}

// Generate migration SQL statements
function generateMigrationSQL() {
    console.log('\n=== MIGRATION SQL STATEMENTS ===');
    
    console.log(`
-- Create database and tables for skills assessment
CREATE DATABASE IF NOT EXISTS jobgate_skills_assessment;
USE jobgate_skills_assessment;

-- SJT Questions Table
CREATE TABLE sjt_questions (
    id VARCHAR(20) PRIMARY KEY,
    domain VARCHAR(50) NOT NULL,
    scenario TEXT NOT NULL,
    choices JSON NOT NULL,
    answer_index INTEGER NOT NULL,
    answer TEXT NOT NULL,
    explanation TEXT NOT NULL,
    difficulty ENUM('easy', 'medium', 'hard') NOT NULL,
    tags JSON,
    translations JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_domain (domain),
    INDEX idx_difficulty (difficulty)
);

-- Verbal Questions Table  
CREATE TABLE verbal_questions (
    id VARCHAR(20) PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    subtype VARCHAR(50),
    stem TEXT NOT NULL,
    choices JSON NOT NULL,
    answer_index INTEGER NOT NULL,
    answer TEXT NOT NULL,
    difficulty ENUM('easy', 'medium', 'hard') NOT NULL,
    explanation TEXT,
    relationship_type VARCHAR(100),
    structure_data JSON,
    tags JSON,
    translations JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_type (type),
    INDEX idx_difficulty (difficulty)
);

-- Test Configurations Table
CREATE TABLE test_configurations (
    id VARCHAR(50) PRIMARY KEY,
    test_name VARCHAR(100) NOT NULL,
    description TEXT,
    total_duration_minutes INTEGER,
    sections JSON,
    difficulty_levels JSON,
    scoring_method VARCHAR(50),
    image_path_base VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- User Test Sessions Table
CREATE TABLE user_test_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    test_type ENUM('sjt', 'verbal', 'spatial') NOT NULL,
    session_id VARCHAR(100) NOT NULL,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    score INTEGER,
    total_questions INTEGER,
    correct_answers INTEGER,
    session_data JSON,
    INDEX idx_user_id (user_id),
    INDEX idx_test_type (test_type),
    INDEX idx_session_id (session_id)
);

-- User Question Responses Table
CREATE TABLE user_question_responses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id VARCHAR(100) NOT NULL,
    question_id VARCHAR(20) NOT NULL,
    user_answer_index INTEGER,
    user_answer TEXT,
    is_correct BOOLEAN,
    time_taken_seconds INTEGER,
    answered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_session_id (session_id),
    INDEX idx_question_id (question_id),
    FOREIGN KEY (session_id) REFERENCES user_test_sessions(session_id)
);
`);
}

// Main execution
function main() {
    console.log('🚀 Skills Assessment Data Validation and Migration Prep');
    console.log('=' .repeat(60));
    
    if (!fs.existsSync(BASE_PATH)) {
        console.error(`❌ Migration directory not found: ${BASE_PATH}`);
        process.exit(1);
    }
    
    validateSJTQuestions();
    validateVerbalQuestions();
    generateMigrationSQL();
    
    console.log('\n✅ Validation complete! Check the output above for any warnings.');
    console.log('\n📋 Next Steps:');
    console.log('1. Review any warnings above');
    console.log('2. Run the generated SQL to create database schema');
    console.log('3. Import JSONL files using your preferred method (e.g., Python script, MySQL import)');
    console.log('4. Update application code to use database queries instead of static files');
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}

export { validateSJTQuestions, validateVerbalQuestions, generateMigrationSQL };
