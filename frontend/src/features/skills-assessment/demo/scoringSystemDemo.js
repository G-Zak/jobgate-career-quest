/**
 * Scoring System Complete Demo
 * 
 * This file demonstrates the complete logical test scoring system in action.
 * It shows how to use all the components together for a real-world scenario.
 * 
 * @author JobGate Career Quest
 * @version 1.0.0
 */

import {
    calculateScore,
    calculateTotalScore,
    enhanceQuestionsWithScoring,
    getScoringPreset,
    debugScoreCalculation,
    DEFAULT_SCORING_CONFIG
} from '../lib/scoringSystem.js';

import {
    LogicalTestScoring,
    createLogicalTestScoring,
    formatTestResults
} from '../lib/logicalTestScoring.js';

import { getLogicalTestSections } from '../data/logicalTestSections.js';

/**
 * Complete demonstration of the logical test scoring system
 */
export function runCompleteScoringDemo() {
    console.log('🚀 Logical Test Scoring System - Complete Demo\n');

    // Step 1: Load test data
    console.log('📋 Step 1: Loading Test Data');
    const testData = getLogicalTestSections();
    console.log(`Loaded test: "${testData.title}"`);
    console.log(`Total sections: ${testData.sections.length}`);
    console.log(`Global scoring config:`, testData.scoringConfig);

    // Step 2: Extract and enhance questions
    console.log('\n🔧 Step 2: Preparing Questions');
    const allQuestions = [];
    testData.sections.forEach(section => {
        if (section.questions) {
            allQuestions.push(...section.questions);
        }
    });

    console.log(`Total questions available: ${allQuestions.length}`);
    console.log('Sample question structure:');
    console.log(JSON.stringify(allQuestions[0], null, 2));

    // Step 3: Create scoring instance
    console.log('\n⚙️ Step 3: Setting Up Scoring System');
    const scoringSystem = createLogicalTestScoring(testData.scoringConfig);
    scoringSystem.startTest();

    // Step 4: Simulate user taking the test
    console.log('\n👤 Step 4: Simulating User Test Session');
    const testQuestions = allQuestions.slice(0, 5); // Take first 5 questions

    testQuestions.forEach((question, index) => {
        console.log(`\nQuestion ${index + 1}: ${question.question}`);
        console.log(`Difficulty: ${question.difficulty}`);

        // Start timer
        scoringSystem.startQuestionTimer(question.id);

        // Simulate thinking time based on difficulty
        const thinkingTime = question.difficulty * 15 + Math.random() * 20;

        // Simulate user answer (sometimes correct, sometimes wrong)
        const isCorrect = Math.random() > 0.3; // 70% chance of correct answer
        const userAnswer = isCorrect ? question.correct_answer : 'a';

        // Record answer
        scoringSystem.recordAnswer(question.id, userAnswer);

        const timing = scoringSystem.getQuestionTiming(question.id);
        console.log(`User answered: ${userAnswer} (Correct: ${question.correct_answer})`);
        console.log(`Time taken: ${timing.duration} seconds`);

        // Calculate score
        const score = scoringSystem.calculateQuestionScore(question, question.id);
        console.log(`Calculated score: ${score}`);

        // Show detailed calculation for first question
        if (index === 0) {
            console.log('\n📊 Detailed Score Calculation:');
            debugScoreCalculation(question, userAnswer, timing.duration, testData.scoringConfig);
        }
    });

    // Step 5: Calculate final results
    console.log('\n📈 Step 5: Calculating Final Results');
    const rawResults = scoringSystem.getTestResults(testQuestions);
    const formattedResults = formatTestResults(rawResults);

    console.log('\n🎯 Test Results Summary:');
    console.log('='.repeat(50));
    console.log(`Overall Score: ${formattedResults.score}/${formattedResults.maxScore} (${formattedResults.percentage}%)`);
    console.log(`Grade: ${formattedResults.grade}`);
    console.log(`Correct Answers: ${formattedResults.correct}/${formattedResults.total}`);
    console.log(`Completion Rate: ${formattedResults.completionRate}%`);
    console.log(`Average Time per Question: ${formattedResults.averageTime} seconds`);
    console.log(`Total Test Duration: ${formattedResults.totalTime} seconds`);
    console.log(`Performance: ${formattedResults.performance}`);

    // Step 6: Show difficulty breakdown
    console.log('\n📊 Difficulty Breakdown:');
    Object.keys(formattedResults.difficultyBreakdown).forEach(difficulty => {
        const data = formattedResults.difficultyBreakdown[difficulty];
        console.log(`Difficulty ${difficulty}: ${data.correct}/${data.total} correct (${data.accuracy}% accuracy)`);
    });

    // Step 7: Show recommendations
    console.log('\n💡 Recommendations:');
    formattedResults.recommendations.forEach((rec, index) => {
        console.log(`${index + 1}. ${rec}`);
    });

    // Step 8: Demonstrate different scoring configurations
    console.log('\n⚖️ Step 6: Comparing Different Scoring Configurations');
    const testQuestion = testQuestions[0];
    const testAnswer = scoringSystem.getUserAnswer(testQuestion.id);
    const testTime = scoringSystem.getQuestionTiming(testQuestion.id).duration;

    const configs = [
        { name: 'Standard', config: getScoringPreset('STANDARD') },
        { name: 'Speed Focused', config: getScoringPreset('SPEED_FOCUSED') },
        { name: 'Accuracy Focused', config: getScoringPreset('ACCURACY_FOCUSED') },
        { name: 'Difficulty Focused', config: getScoringPreset('DIFFICULTY_FOCUSED') }
    ];

    console.log(`\nQuestion: ${testQuestion.question}`);
    console.log(`Answer: ${testAnswer}, Time: ${testTime}s, Difficulty: ${testQuestion.difficulty}`);

    configs.forEach(({ name, config }) => {
        const score = calculateScore(testQuestion, testAnswer, testTime, config);
        console.log(`${name}: ${score} points`);
    });

    // Step 9: Show data export/import capabilities
    console.log('\n💾 Step 7: Data Persistence Demo');
    const exportedState = scoringSystem.exportState();
    console.log('Exported state keys:', Object.keys(exportedState));
    console.log('User answers count:', exportedState.userAnswers.length);
    console.log('Timing data count:', exportedState.timingData.length);

    // Create new scoring system and import state
    const newScoringSystem = createLogicalTestScoring();
    newScoringSystem.importState(exportedState);

    const importedResults = newScoringSystem.getTestResults(testQuestions);
    console.log('Imported results match original:',
        importedResults.totalScore === rawResults.totalScore ? '✅ Yes' : '❌ No'
    );

    console.log('\n✅ Demo completed successfully!');
    console.log('\nThe scoring system is ready for production use.');

    return {
        testData,
        rawResults,
        formattedResults,
        scoringSystem,
        exportedState
    };
}

/**
 * Quick demo function for testing specific scenarios
 */
export function runQuickDemo() {
    console.log('⚡ Quick Scoring Demo\n');

    // Simple question
    const question = {
        id: "demo_1",
        type: "multiple_choice",
        question: "What comes next: 2, 4, 6, 8, ...?",
        options: ["10", "12", "14", "16"],
        correct_answer: "a",
        difficulty: 1,
        section: 1,
        scoreWeight: {
            base: 5,
            difficultyBonus: 2,
            timeFactor: 1
        }
    };

    // Test scenarios
    const scenarios = [
        { answer: "a", time: 10, description: "Correct, very fast" },
        { answer: "a", time: 60, description: "Correct, slow" },
        { answer: "b", time: 5, description: "Wrong, very fast" },
        { answer: "a", time: 120, description: "Correct, very slow" }
    ];

    scenarios.forEach(({ answer, time, description }) => {
        const score = calculateScore(question, answer, time);
        console.log(`${description}: ${score} points`);
    });

    return scenarios.map(scenario => ({
        ...scenario,
        score: calculateScore(question, scenario.answer, scenario.time)
    }));
}

/**
 * Performance benchmark demo
 */
export function runPerformanceBenchmark() {
    console.log('🏃 Performance Benchmark\n');

    const question = {
        id: "benchmark_1",
        type: "multiple_choice",
        question: "Benchmark question",
        options: ["A", "B", "C", "D"],
        correct_answer: "b",
        difficulty: 3,
        section: 1,
        scoreWeight: { base: 5, difficultyBonus: 2, timeFactor: 1 }
    };

    const iterations = 10000;
    const startTime = performance.now();

    for (let i = 0; i < iterations; i++) {
        calculateScore(question, "b", Math.random() * 120);
    }

    const endTime = performance.now();
    const duration = endTime - startTime;
    const avgTime = duration / iterations;

    console.log(`Calculated ${iterations} scores in ${duration.toFixed(2)}ms`);
    console.log(`Average time per calculation: ${avgTime.toFixed(4)}ms`);
    console.log(`Calculations per second: ${Math.round(1000 / avgTime)}`);

    return {
        iterations,
        duration,
        avgTime,
        calculationsPerSecond: Math.round(1000 / avgTime)
    };
}

// Auto-run demo if this file is executed directly
if (typeof window !== 'undefined' && window.location?.pathname?.includes('demo')) {
    runCompleteScoringDemo();
}

export default {
    runCompleteScoringDemo,
    runQuickDemo,
    runPerformanceBenchmark
};

