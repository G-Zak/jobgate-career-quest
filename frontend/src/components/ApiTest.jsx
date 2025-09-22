import React, { useState } from 'react';
import recommendationApi from '../services/recommendationApi';

const ApiTest = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const testEndpoints = async () => {
        setLoading(true);
        setResults([]);

        const tests = [
            {
                name: 'Get Recommendations',
                test: () => recommendationApi.getRecommendations()
            },
            {
                name: 'Search Jobs',
                test: () => recommendationApi.searchJobs({ q: 'python' })
            },
            {
                name: 'Get User Preferences',
                test: () => recommendationApi.getUserPreferences()
            },
            {
                name: 'Get Skills Analysis',
                test: () => recommendationApi.getUserSkillsAnalysis()
            }
        ];

        for (const test of tests) {
            try {
                console.log(`Testing ${test.name}...`);
                const result = await test.test();
                setResults(prev => [...prev, {
                    name: test.name,
                    status: 'success',
                    data: result
                }]);
            } catch (error) {
                console.error(`Error testing ${test.name}:`, error);
                setResults(prev => [...prev, {
                    name: test.name,
                    status: 'error',
                    error: error.message
                }]);
            }
        }

        setLoading(false);
    };

    const testDirectConnection = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8000/api/recommendations/');
            const data = await response.text();
            setResults(prev => [...prev, {
                name: 'Direct Connection Test',
                status: response.ok ? 'success' : 'error',
                data: `Status: ${response.status}, Response: ${data.substring(0, 200)}...`
            }]);
        } catch (error) {
            setResults(prev => [...prev, {
                name: 'Direct Connection Test',
                status: 'error',
                error: error.message
            }]);
        }
        setLoading(false);
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">API Connection Test</h1>

            <div className="space-y-4 mb-6">
                <button
                    onClick={testEndpoints}
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? 'Testing...' : 'Test API Endpoints'}
                </button>

                <button
                    onClick={testDirectConnection}
                    disabled={loading}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 ml-4"
                >
                    Test Direct Connection
                </button>
            </div>

            <div className="space-y-2">
                {results.map((result, index) => (
                    <div
                        key={index}
                        className={`p-4 rounded border ${result.status === 'success'
                                ? 'bg-green-50 border-green-200'
                                : 'bg-red-50 border-red-200'
                            }`}
                    >
                        <h3 className="font-semibold">
                            {result.name} - {result.status === 'success' ? '✓ Success' : '✗ Error'}
                        </h3>
                        {result.error && (
                            <p className="text-red-600 mt-1">{result.error}</p>
                        )}
                        {result.data && (
                            <pre className="mt-2 text-sm bg-gray-100 p-2 rounded overflow-auto">
                                {JSON.stringify(result.data, null, 2)}
                            </pre>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ApiTest;
