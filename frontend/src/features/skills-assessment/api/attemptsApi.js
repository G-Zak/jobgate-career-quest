/**
 * API client for test attempts
 */

const API_BASE = '/api';

export async function postAttempt(attempt) {
  try {
    const response = await fetch(`${API_BASE}/attempts/`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-CSRFToken': getCsrfToken() 
      },
      credentials: 'include',
      body: JSON.stringify(attempt),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to save attempt: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error posting attempt:', error);
    throw error;
  }
}

export async function fetchAttempts(testId = null) {
  try {
    const url = testId 
      ? `${API_BASE}/attempts/by_test/?test_id=${testId}`
      : `${API_BASE}/attempts/`;
      
    const response = await fetch(url, { 
      credentials: 'include',
      headers: {
        'X-CSRFToken': getCsrfToken()
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to load attempts: ${response.status}`);
    }
    
    const data = await response.json();
    return Array.isArray(data) ? data : data.results || [];
  } catch (error) {
    console.error('Error fetching attempts:', error);
    throw error;
  }
}

export async function fetchMetrics() {
  try {
    const response = await fetch(`${API_BASE}/attempts/metrics/`, { 
      credentials: 'include',
      headers: {
        'X-CSRFToken': getCsrfToken()
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to load metrics: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching metrics:', error);
    throw error;
  }
}

// Utility function to get CSRF token
function getCsrfToken() {
  const cookieValue = document.cookie
    .split('; ')
    .find(row => row.startsWith('csrftoken='))
    ?.split('=')[1];
  return cookieValue || '';
}
