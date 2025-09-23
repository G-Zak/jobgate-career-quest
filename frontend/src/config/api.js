// Configuration de l'API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

export const API_ENDPOINTS = {
  // Tests existants
  TESTS: `${API_BASE_URL}/api/tests/`,
  SESSIONS: `${API_BASE_URL}/api/sessions/`,
  RESULTS: `${API_BASE_URL}/api/results/`,
  
  // Nouveaux endpoints pour les défis de programmation
  CHALLENGES: `${API_BASE_URL}/api/challenges/`,
  SUBMISSIONS: `${API_BASE_URL}/api/submissions/`,
  CODING_SESSIONS: `${API_BASE_URL}/api/coding-sessions/`,
};

// Configuration des headers par défaut
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

// Helper pour les requêtes API
export const apiRequest = async (url, options = {}) => {
  const config = {
    headers: DEFAULT_HEADERS,
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

export default API_BASE_URL;
