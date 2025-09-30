/**
 * Test authentication utilities for development
 */

export const loginTestUser = () => {
  // Test user credentials
  const testUser = {
    id: 104,
    username: 'testuser',
    email: 'test@example.com',
    first_name: 'Test',
    last_name: 'User',
    name: 'Test User'
  };

  const testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzU5MTE4ODkxLCJpYXQiOjE3NTkxMTUyOTEsImp0aSI6IjEyMDE5ZTljMzI3YjQyOWI4NGE5NzA5ZjMwYmFhNTUwIiwidXNlcl9pZCI6IjEwNCJ9.Ujk0Ae7hpXdbgEVANg9zKTAMEjYW4YKCujhOrZ3ptxc';

  // Store in localStorage
  localStorage.setItem('access_token', testToken);
  localStorage.setItem('refresh_token', testToken);
  localStorage.setItem('user', JSON.stringify(testUser));

  console.log('✅ Test user logged in:', testUser);
  
  // Reload the page to trigger auth context update
  window.location.reload();
};

export const logoutTestUser = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
  
  console.log('✅ Test user logged out');
  
  // Reload the page to trigger auth context update
  window.location.reload();
};

// Auto-login test user in development
if (import.meta.env.DEV) {
  // Check if user is already logged in
  const existingToken = localStorage.getItem('access_token');
  if (!existingToken) {
    console.log('🔧 Development mode: Auto-logging in test user');
    setTimeout(() => {
      loginTestUser();
    }, 1000);
  }
}
