// Simple test to check if backend is accessible
const testBackend = async () => {
    const baseUrl = 'http://localhost:8000';

    console.log('Testing backend connection...');

    try {
        // Test 1: Check if backend is running
        const healthResponse = await fetch(`${baseUrl}/admin/`);
        console.log('✓ Backend is running (admin page accessible)');

        // Test 2: Check API endpoints
        const apiEndpoints = [
            '/api/recommendations/',
            '/api/skills/',
            '/api/tests/'
        ];

        for (const endpoint of apiEndpoints) {
            try {
                const response = await fetch(`${baseUrl}${endpoint}`);
                console.log(`✓ ${endpoint} - Status: ${response.status}`);
            } catch (error) {
                console.log(`✗ ${endpoint} - Error: ${error.message}`);
            }
        }

    } catch (error) {
        console.log('✗ Backend is not accessible:', error.message);
        console.log('Make sure the backend is running on http://localhost:8000');
    }
};

// Run the test
testBackend();
