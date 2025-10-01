export type TestRule = {
 timeLimitMin: number;
 totalQuestions: number;
 difficultyLabel: 'mixed';
};

export const TEST_RULES: Record<string, TestRule> = {
 // Core families
 numerical: { timeLimitMin: 20, totalQuestions: 20, difficultyLabel: 'mixed' },
 situational: { timeLimitMin: 20, totalQuestions: 20, difficultyLabel: 'mixed' },

 // Verbal series - UNIFIED VRT1 (10Q / 20min from mixed difficulty pool)
 vrt1: { timeLimitMin: 20, totalQuestions: 10, difficultyLabel: 'mixed' }, // Reading Comprehension
 vrt2: { timeLimitMin: 25, totalQuestions: 25, difficultyLabel: 'mixed' }, // Analogies
 vrt3: { timeLimitMin: 25, totalQuestions: 25, difficultyLabel: 'mixed' }, // Classification
 vrt4: { timeLimitMin: 30, totalQuestions: 25, difficultyLabel: 'mixed' }, // Coding & Decoding
 vrt5: { timeLimitMin: 35, totalQuestions: 25, difficultyLabel: 'mixed' }, // Blood Relations & Logical Puzzles

 // Logical series (each LRTx is 20Q / 20min)
 lrt1: { timeLimitMin: 20, totalQuestions: 20, difficultyLabel: 'mixed' },
 lrt2: { timeLimitMin: 20, totalQuestions: 20, difficultyLabel: 'mixed' },
 lrt3: { timeLimitMin: 20, totalQuestions: 20, difficultyLabel: 'mixed' },

 // Abstract & Diagrammatic (15Q / 30min)
 abstract: { timeLimitMin: 30, totalQuestions: 15, difficultyLabel: 'mixed' },
 diagrammatic: { timeLimitMin: 30, totalQuestions: 15, difficultyLabel: 'mixed' },

 // Spatial (20Q from 40 available; 20min)
 spatial: { timeLimitMin: 20, totalQuestions: 20, difficultyLabel: 'mixed' },
};

export function getRuleFor(testIdRaw: string): TestRule | null {
 const key = String(testIdRaw || '').toLowerCase();

 // Handle different test ID formats
 const normalizedKey = key
 .replace(/^nrt(\d+)$/, 'numerical') // NRT1, NRT2 -> numerical
 .replace(/^vrt(\d+)$/, 'vrt$1') // VRT1 -> vrt1, VRT2 -> vrt2
 .replace(/^lrt(\d+)$/, 'lrt$1') // LRT1 -> lrt1, LRT2 -> lrt2
 .replace(/^art(\d+)$/, 'abstract') // ART1 -> abstract
 .replace(/^drt(\d+)$/, 'diagrammatic') // DRT1, DRT2 -> diagrammatic
 .replace(/^srt(\d+)$/, 'spatial') // SRT1, SRT2 -> spatial
 .replace(/^sjt(\d+)$/, 'situational') // SJT1 -> situational
 .replace(/^tat(\d+)$/, 'technical'); // TAT1, TAT2 -> technical

 return TEST_RULES[normalizedKey] || null;
}

// Helper function to build attempt record
export function buildAttempt(
 testId: string,
 total: number,
 correct: number,
 startedAt: number,
 reason: 'user' | 'time' | 'aborted'
) {
 const percentage = total ? Math.round((correct / total) * 100) : 0;
 return {
 test_id: testId,
 total_questions: total,
 correct,
 percentage,
 started_at: new Date(startedAt).toISOString(),
 finished_at: new Date().toISOString(),
 duration_seconds: Math.round((Date.now() - startedAt) / 1000),
 result: reason === 'time' ? 'timeout' : reason === 'aborted' ? 'aborted' : 'completed',
 };
}

// Helper function to get pretty title from test ID
export function getPrettyTitle(testId: string): string {
 const key = testId.toLowerCase();

 // Handle different test ID formats
 const normalizedKey = key
 .replace(/^nrt(\d+)$/, 'numerical') // NRT1, NRT2 -> numerical
 .replace(/^vrt(\d+)$/, 'vrt$1') // VRT1 -> vrt1, VRT2 -> vrt2
 .replace(/^lrt(\d+)$/, 'lrt$1') // LRT1 -> lrt1, LRT2 -> lrt2
 .replace(/^art(\d+)$/, 'abstract') // ART1 -> abstract
 .replace(/^drt(\d+)$/, 'diagrammatic') // DRT1, DRT2 -> diagrammatic
 .replace(/^srt(\d+)$/, 'spatial') // SRT1, SRT2 -> spatial
 .replace(/^sjt(\d+)$/, 'situational') // SJT1 -> situational
 .replace(/^tat(\d+)$/, 'technical'); // TAT1, TAT2 -> technical

 const titles: Record<string, string> = {
 numerical: 'Numerical Reasoning Test',
 situational: 'Situational Judgment Test',
 vrt1: 'Verbal Reasoning Test 1 - Reading Comprehension',
 vrt2: 'Verbal Reasoning Test 2 - Analogies',
 vrt3: 'Verbal Reasoning Test 3 - Classification',
 vrt4: 'Verbal Reasoning Test 4 - Coding & Decoding',
 vrt5: 'Verbal Reasoning Test 5 - Blood Relations & Logical Puzzles',

 lrt1: 'Logical Reasoning Test 1',
 lrt2: 'Logical Reasoning Test 2',
 lrt3: 'Logical Reasoning Test 3',
 abstract: 'Abstract Reasoning Test',
 diagrammatic: 'Diagrammatic Reasoning Test',
 spatial: 'Spatial Reasoning Test',
 technical: 'Technical Assessment Test',
 };

 return titles[normalizedKey] || testId.charAt(0).toUpperCase() + testId.slice(1);
}