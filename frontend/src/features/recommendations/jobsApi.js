export async function fetchJobs() {
 try {
 // Try to fetch from backend API first
 const backendResponse = await fetch('/api/jobs/', {
 method: 'GET',
 headers: {
 'Content-Type': 'application/json',
 },
 });

 if (backendResponse.ok) {
 const data = await backendResponse.json();
 return Array.isArray(data) ? data : [];
 }
 } catch (error) {
 console.log('Backend jobs API not available, using mock data');
 }

 // Fallback to mock data
 try {
 const response = await fetch('/mocks/jobs_ma.json');
 if (!response.ok) throw new Error('Mock data load failed');
 const data = await response.json();
 return Array.isArray(data) ? data : [];
 } catch (error) {
 console.error('Failed to load jobs data:', error);
 return [];
 }
}

export async function fetchJobById(id) {
 const jobs = await fetchJobs();
 return jobs.find(job => job.id === id) || null;
}

export function filterJobsByLocation(jobs, cities) {
 if (cities.length === 0) return jobs;
 return jobs.filter(job => cities.includes(job.location_city));
}

export function filterJobsByRemote(jobs, remoteOnly) {
 if (!remoteOnly) return jobs;
 return jobs.filter(job => job.remote);
}

export function filterJobsBySeniority(jobs, seniority) {
 if (seniority.length === 0) return jobs;
 return jobs.filter(job => seniority.includes(job.seniority));
}
