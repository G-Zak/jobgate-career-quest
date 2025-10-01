import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import JobRecommendations from './JobRecommendations';
import { AuthProvider } from '../../../contexts/AuthContext';

// Mock the API services
jest.mock('../services/dashboardApi');
jest.mock('../../../services/jobRecommendationsApi');
jest.mock('../../../utils/profileUtils');

const mockUser = {
    id: 1,
    email: 'test@example.com',
    first_name: 'Test',
    last_name: 'User'
};

const mockUserProfile = {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    skills: ['React', 'JavaScript', 'Python'],
    location: 'New York',
    experienceLevel: 'intermediate'
};

const mockJobs = [
    {
        id: "101",
        title: "Frontend Developer",
        company: "PixelTech",
        match: 89,
        salary: "$75k-$95k",
        location: "Remote",
        skills: ["React", "JavaScript", "CSS", "TypeScript"],
        description: "Join our team to build amazing user interfaces using modern web technologies.",
        type: "Full-time",
        posted: new Date().toISOString()
    },
    {
        id: "205",
        title: "Python Developer",
        company: "DataCraft",
        match: 78,
        salary: "$65k-$85k",
        location: "San Francisco",
        skills: ["Python", "Django", "SQL", "PostgreSQL"],
        description: "We're looking for a passionate Python developer to join our data engineering team.",
        type: "Full-time",
        posted: new Date().toISOString()
    }
];

// Mock the API responses
const mockDashboardApi = require('../services/dashboardApi');
const mockJobRecommendationsApi = require('../../../services/jobRecommendationsApi');
const mockProfileUtils = require('../../../utils/profileUtils');

mockDashboardApi.getJobRecommendations.mockResolvedValue(mockJobs);
mockJobRecommendationsApi.syncProfileAndGetRecommendations.mockResolvedValue({
    recommendations: mockJobs
});
mockProfileUtils.loadUserProfile.mockResolvedValue(mockUserProfile);

const renderWithAuth = (component) => {
    return render(
        <AuthProvider value={{ user: mockUser }}>
            {component}
        </AuthProvider>
    );
};

describe('JobRecommendations Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders loading state initially', () => {
        renderWithAuth(<JobRecommendations />);
        expect(screen.getByText('Loading dashboard...')).toBeInTheDocument();
    });

    test('renders job recommendations after loading', async () => {
        renderWithAuth(<JobRecommendations />);

        await waitFor(() => {
            expect(screen.getByText('Job Recommendations')).toBeInTheDocument();
        });

        expect(screen.getByText('Frontend Developer')).toBeInTheDocument();
        expect(screen.getByText('PixelTech')).toBeInTheDocument();
        expect(screen.getByText('Python Developer')).toBeInTheDocument();
        expect(screen.getByText('DataCraft')).toBeInTheDocument();
    });

    test('displays dynamic header with user skills count', async () => {
        renderWithAuth(<JobRecommendations />);

        await waitFor(() => {
            expect(screen.getByText('Based on your 3 skills and test results')).toBeInTheDocument();
        });
    });

    test('shows refresh button and allows refreshing', async () => {
        renderWithAuth(<JobRecommendations />);

        await waitFor(() => {
            expect(screen.getByText('Refresh')).toBeInTheDocument();
        });

        const refreshButton = screen.getByText('Refresh');
        fireEvent.click(refreshButton);

        await waitFor(() => {
            expect(screen.getByText('Refreshing...')).toBeInTheDocument();
        });
    });

    test('displays job match insights', async () => {
        renderWithAuth(<JobRecommendations />);

        await waitFor(() => {
            expect(screen.getByText('Job Match Insights')).toBeInTheDocument();
        });

        expect(screen.getByText('1 Excellent matches')).toBeInTheDocument();
        expect(screen.getByText('1 Good matches')).toBeInTheDocument();
    });

    test('shows dynamic quick tips based on user profile', async () => {
        renderWithAuth(<JobRecommendations />);

        await waitFor(() => {
            expect(screen.getByText('Your profile has 3 skills - keep adding more for better matches')).toBeInTheDocument();
        });
    });

    test('handles empty state when no jobs found', async () => {
        mockDashboardApi.getJobRecommendations.mockResolvedValue([]);
        mockJobRecommendationsApi.syncProfileAndGetRecommendations.mockResolvedValue({
            recommendations: []
        });

        renderWithAuth(<JobRecommendations />);

        await waitFor(() => {
            expect(screen.getByText('No Matching Jobs Found')).toBeInTheDocument();
        });
    });

    test('displays job cards with all information', async () => {
        renderWithAuth(<JobRecommendations />);

        await waitFor(() => {
            expect(screen.getByText('Frontend Developer')).toBeInTheDocument();
        });

        // Check job details
        expect(screen.getByText('PixelTech')).toBeInTheDocument();
        expect(screen.getByText('$75k-$95k')).toBeInTheDocument();
        expect(screen.getByText('Remote')).toBeInTheDocument();
        expect(screen.getByText('89% Match')).toBeInTheDocument();
        expect(screen.getByText('Excellent Match')).toBeInTheDocument();

        // Check skills
        expect(screen.getByText('React')).toBeInTheDocument();
        expect(screen.getByText('JavaScript')).toBeInTheDocument();
        expect(screen.getByText('CSS')).toBeInTheDocument();
        expect(screen.getByText('TypeScript')).toBeInTheDocument();

        // Check action buttons
        expect(screen.getByText('View Details')).toBeInTheDocument();
        expect(screen.getByText('Apply Now')).toBeInTheDocument();
    });
});



