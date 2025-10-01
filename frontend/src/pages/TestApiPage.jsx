import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const TestApiPage = () => {
 const { user, isAuthenticated } = useAuth();
 const [apiStatus, setApiStatus] = useState('Testing...');
 const [jobCount, setJobCount] = useState(0);
 const [jobs, setJobs] = useState([]);

 useEffect(() => {
 testApi();
 }, [user]);

 const testApi = async () => {
 try {
 const token = localStorage.getItem('access_token');
 console.log(' Testing API with token:', token ? 'Present' : 'Missing');
 console.log(' User:', user);
 console.log(' Is Authenticated:', isAuthenticated);

 if (!token) {
 setApiStatus(' No authentication token found');
 return;
 }

 // Test job offers API
 const response = await fetch('http://localhost:8001/api/recommendations/api/job-offers/', {
 headers: {
 'Authorization': `Bearer ${token}`,
 'Content-Type': 'application/json',
 },
 });

 console.log(' API Response status:', response.status);

 if (response.ok) {
 const data = await response.json();
 console.log(' API Response data:', data);

 const jobsData = data.results || data || [];
 setJobs(jobsData.slice(0, 5)); // Show first 5 jobs
 setJobCount(data.count || jobsData.length);
 setApiStatus(` API Working! Found ${data.count || jobsData.length} jobs`);
 } else {
 const errorText = await response.text();
 console.error(' API Error:', errorText);
 setApiStatus(` API Error: ${response.status} - ${errorText}`);
 }
 } catch (error) {
 console.error(' API Test Error:', error);
 setApiStatus(` Connection Error: ${error.message}`);
 }
 };

 const loginTestUser = () => {
 // Test user credentials
 const testUser = {
 id: 104,
 username: 'testuser',
 email: 'test@example.com',
 first_name: 'Test',
 last_name: 'User',
 name: 'Test User'
 };

 const testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzU5MTE4NTEyLCJpYXQiOjE3NTkxMTQ5MTIsImp0aSI6IjU2MDlmNGE2ZWFlNDQ5OTNhYmUzY2M2NjhkYmUyZjI1IiwidXNlcl9pZCI6IjEwNCJ9.USnYI8lHnnf5cFK42WcwuoLRYfrP7Ia4CnZPrIJnrWs';

 // Store in localStorage
 localStorage.setItem('access_token', testToken);
 localStorage.setItem('refresh_token', testToken);
 localStorage.setItem('user', JSON.stringify(testUser));

 console.log(' Test user logged in:', testUser);

 // Reload the page to trigger auth context update
 window.location.reload();
 };

 return (
 <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
 <div className="max-w-4xl mx-auto">
 <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
 API Test Page
 </h1>

 {/* Authentication Status */}
 <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
 <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
 Authentication Status
 </h2>
 <div className="space-y-2">
 <p><strong>Is Authenticated:</strong> {isAuthenticated ? ' Yes' : ' No'}</p>
 <p><strong>User:</strong> {user ? `${user.name} (${user.email})` : 'Not logged in'}</p>
 <p><strong>Token:</strong> {localStorage.getItem('access_token') ? ' Present' : ' Missing'}</p>
 </div>

 {!isAuthenticated && (
 <button
 onClick={loginTestUser}
 className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
 >
 Login Test User
 </button>
 )}
 </div>

 {/* API Status */}
 <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
 <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
 API Status
 </h2>
 <p className="text-lg mb-4">{apiStatus}</p>
 <p><strong>Job Count:</strong> {jobCount}</p>

 <button
 onClick={testApi}
 className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
 >
 Test API Again
 </button>
 </div>

 {/* Sample Jobs */}
 {jobs.length > 0 && (
 <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
 <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
 Sample Jobs (First 5)
 </h2>
 <div className="space-y-4">
 {jobs.map((job) => (
 <div key={job.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
 <h3 className="font-semibold text-gray-900 dark:text-white">{job.title}</h3>
 <p className="text-gray-600 dark:text-gray-400">{job.company} - {job.location}</p>
 <p className="text-sm text-gray-500 dark:text-gray-500">
 {job.salary_min && job.salary_max
 ? `${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()} ${job.currency}`
 : 'Salary not specified'
 }
 </p>
 </div>
 ))}
 </div>
 </div>
 )}
 </div>
 </div>
 );
};

export default TestApiPage;
