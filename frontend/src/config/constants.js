// Application Constants
// Global constants used throughout the application

export const APP_CONFIG = {
  NAME: 'JobGate Career Quest',
  VERSION: '1.0.0',
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  PAGINATION_SIZE: 10,
};

export const USER_ROLES = {
  CANDIDATE: 'candidate',
  RECRUITER: 'recruiter',
  ADMIN: 'admin',
};

export const SKILL_CATEGORIES = [
  'Accelerated Learning',
  'Numerical', 
  'Verbal',
  'Logical',
  'Abstract',
  'Diagrammatic',
  'Spatial',
  'Cognitive Assessment',
  'Personality',
  'Situational',
  'Technical'
];

export const SCORE_THRESHOLDS = {
  EXCELLENT: 80,
  GOOD: 60,
  NEEDS_IMPROVEMENT: 40,
};

export default {
  APP_CONFIG,
  USER_ROLES,
  SKILL_CATEGORIES,
  SCORE_THRESHOLDS,
};
