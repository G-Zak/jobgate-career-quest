// Export all data files for easy import
export * from './jobOffers';

// Re-export specific items for convenience
export { default as jobOffers } from './jobOffers';
export { 
  jobCategories, 
  jobTypes, 
  moroccanCities, 
  techSkills,
  getJobById,
  getJobsByCompany,
  getJobsByLocation,
  getJobsByType,
  getJobsBySkill,
  getActiveJobs,
  getRecentJobs,
  searchJobs,
  createJobOffer
} from './jobOffers';
