import { normalizeMAD } from './salary';

export function cosine(a, b) {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  // Calculate dot product and norms
  for (const key in a) {
    normA += a[key] * a[key];
    if (b[key] != null) {
      dotProduct += a[key] * b[key];
    }
  }
  
  for (const key in b) {
    normB += b[key] * b[key];
  }
  
  return normA && normB ? dotProduct / Math.sqrt(normA * normB) : 0;
}

export function jobToVec(job) {
  const v = {};
  
  (job.skills || []).forEach((skill) => {
    v[skill.skill_id] = Math.max(v[skill.skill_id] || 0, skill.weight || 0.5);
  });
  
  return v;
}

export function scoreJob(userVec, job, profile) {
  // Skill similarity (0..1)
  const skillSim = cosine(userVec, jobToVec(job));
  
  // Salary fit (0..1)
  const salaryMAD = normalizeMAD(job.salary_mad_min ?? job.salary ?? job.salary_mad_max);
  const targetMAD = profile?.targetSalaryMAD ?? null;
  let salaryFit = 0.5; // neutral
  
  if (salaryMAD && targetMAD) {
    // Prefer jobs that are close to or above target salary
    salaryFit = Math.max(0, Math.min(1, salaryMAD / targetMAD));
  }
  
  // City match (0..1)
  const cityMatch = profile?.preferredCities?.includes(job.location_city) ? 1 : 0;
  
  // Seniority match (0..1)
  const seniorityMatch = profile?.seniority 
    ? (job.seniority === profile.seniority ? 1 : 0.5) 
    : 0.5;
  
  // Remote work bonus
  const remoteBonus = job.remote && profile?.prefersRemote ? 0.1 : 0;
  
  // Weighted score
  const score = 0.6 * skillSim + 0.15 * salaryFit + 0.1 * cityMatch + 0.1 * seniorityMatch + remoteBonus;
  const matchPct = Math.round(score * 100); // 0..100
  
  return {
    job,
    score,
    matchPct,
    parts: {
      skillSim,
      salaryFit,
      cityMatch,
      seniorityMatch
    }
  };
}

export function recommend(userVec, jobs, profile, topK = 10) {
  const scored = jobs
    .filter(job => job.status === 'active')
    .map(job => scoreJob(userVec, job, profile));
  
  scored.sort((a, b) => b.score - a.score);
  
  return scored.slice(0, topK);
}

export function getTopSkillsFromJob(job, limit = 3) {
  return job.skills
    .sort((a, b) => b.weight - a.weight)
    .slice(0, limit)
    .map(skill => ({ skill: skill.skill_id, weight: skill.weight }));
}

export function getMatchExplanation(parts) {
  const explanations = [];
  
  if (parts.skillSim > 0.7) {
    explanations.push('Compétences très compatibles');
  } else if (parts.skillSim > 0.4) {
    explanations.push('Compétences partiellement compatibles');
  }
  
  if (parts.salaryFit > 0.8) {
    explanations.push('Salaire attractif');
  } else if (parts.salaryFit > 0.6) {
    explanations.push('Salaire correct');
  }
  
  if (parts.cityMatch > 0) {
    explanations.push('Localisation préférée');
  }
  
  if (parts.seniorityMatch > 0.8) {
    explanations.push('Niveau d\'expérience parfait');
  }
  
  return explanations.length > 0 ? explanations.join(' • ') : 'Correspondance générale';
}
