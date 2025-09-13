// type Vec = Record<string, number>;

// Map tests → skills
const TEST_TO_SKILL = {
  // Core test types
  numerical: ['numerical'],
  verbal: ['verbal'],
  situational: ['sjt'],
  spatial: ['spatial'],
  abstract: ['abstract'],
  diagrammatic: ['diagrammatic'],
  
  // Logical series
  lrt1: ['logical'],
  lrt2: ['logical'],
  lrt3: ['logical'],
  
  // Verbal series
  vrt1: ['verbal'],
  vrt2: ['verbal'],
  vrt3: ['verbal'],
  vrt4: ['verbal'],
  vrt5: ['verbal'],
  vrt6: ['verbal'],
  vrt7: ['verbal'],
  
  // Spatial series
  srt1: ['spatial'],
  srt2: ['spatial'],
  srt3: ['spatial'],
  
  // Technical skills (if present)
  'technical:java': ['java', 'programming'],
  'technical:python': ['python', 'programming'],
  'technical:javascript': ['javascript', 'programming'],
  'technical:react': ['react', 'frontend', 'javascript'],
  'technical:node': ['nodejs', 'backend', 'javascript'],
  'technical:sql': ['sql', 'database'],
  'technical:git': ['git', 'version-control'],
};

export function buildUserSkillVector(attempts) {
  const acc = {};
  const now = Date.now();
  
  for (const attempt of attempts) {
    const skills = TEST_TO_SKILL[attempt.test_id] || [];
    const days = Math.max(0, (now - Date.parse(attempt.finished_at)) / (1000 * 60 * 60 * 24));
    const recency = Math.exp(-days / 180); // 6-month half-life
    
    for (const skill of skills) {
      acc[skill] ??= { sum: 0, w: 0 };
      acc[skill].sum += (attempt.percentage / 100) * recency;
      acc[skill].w += recency;
    }
  }
  
  const v = {};
  Object.entries(acc).forEach(([skill, { sum, w }]) => {
    v[skill] = w ? Math.min(1, sum / w) : 0;
  });
  
  return v;
}

export function getTopSkills(userVec, limit = 5) {
  return Object.entries(userVec)
    .map(([skill, score]) => ({ skill, score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function getSkillLevel(score) {
  if (score >= 0.9) return 'Expert';
  if (score >= 0.7) return 'Advanced';
  if (score >= 0.5) return 'Intermediate';
  if (score >= 0.3) return 'Beginner';
  return 'Novice';
}
