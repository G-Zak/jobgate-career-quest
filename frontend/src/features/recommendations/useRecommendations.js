import { useMemo, useState, useEffect } from 'react';
import { useAttempts } from '../skills-assessment/store/useAttempts';
import { buildUserSkillVector, getTopSkills } from './skills';
import { fetchJobs } from './jobsApi';
import { recommend } from './engine';

export function useRecommendations(profile, topK = 10) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { attempts } = useAttempts();

  useEffect(() => {
    const loadJobs = async () => {
      try {
        setLoading(true);
        setError(null);
        const jobsData = await fetchJobs();
        setJobs(jobsData);
      } catch (err) {
        setError('Erreur lors du chargement des offres d\'emploi');
        console.error('Failed to load jobs:', err);
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, []);

  const recommendations = useMemo(() => {
    if (jobs.length === 0 || attempts.length === 0) return [];

    const userVec = buildUserSkillVector(attempts);
    return recommend(userVec, jobs, profile, topK);
  }, [jobs, attempts, profile, topK]);

  const userSkills = useMemo(() => {
    if (attempts.length === 0) return [];
    
    const userVec = buildUserSkillVector(attempts);
    return getTopSkills(userVec, 5);
  }, [attempts]);

  return {
    recommendations,
    userSkills,
    loading,
    error,
    totalJobs: jobs.length,
    hasAttempts: attempts.length > 0
  };
}

export async function getRecommendations(profile, topK = 10) {
  const attempts = useAttempts.getState().attempts;
  const userVec = buildUserSkillVector(attempts);
  const jobs = await fetchJobs();
  
  return recommend(userVec, jobs, profile, topK);
}

export function useUserProfile() {
  // This could be enhanced to load from localStorage or user settings
  return {
    preferredCities: ['Casablanca', 'Rabat'],
    targetSalaryMAD: 15000,
    seniority: 'junior',
    prefersRemote: true
  };
}
