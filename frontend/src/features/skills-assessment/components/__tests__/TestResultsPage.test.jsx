import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TestResultsPage from '../TestResultsPage';

// Mock framer-motion
jest.mock('framer-motion', () => ({
 motion: {
 div: ({ children, ...props }) => <div {...props}>{children}</div>,
 },
 AnimatePresence: ({ children }) => <>{children}</>,
}));

// Mock the assessment store
jest.mock('../../store/useAssessmentStore', () => ({
 useAssessmentStore: () => ({
 addAttempt: jest.fn(),
 }),
}));

const mockTestResults = {
 testId: 'VRT3',
 score: 15,
 totalQuestions: 21,
 percentage: 71,
 timeSpent: 28,
 resultLabel: 'Good',
 isPassed: true,
 submittedAt: new Date().toISOString(),
};

const defaultProps = {
 testResults: mockTestResults,
 testType: 'verbal-reasoning',
 testId: 'VRT3',
 answers: [],
 onBackToDashboard: jest.fn(),
 onRetakeTest: jest.fn(),
 onBackToTestList: jest.fn(),
};

describe('TestResultsPage', () => {
 beforeEach(() => {
 jest.clearAllMocks();
 });

 test('renders test results correctly', () => {
 render(<TestResultsPage {...defaultProps} />);

 expect(screen.getByText('Test Completed')).toBeInTheDocument();
 expect(screen.getByText('VRT3 - Verbal Reasoning')).toBeInTheDocument();
 expect(screen.getByText('71%')).toBeInTheDocument();
 expect(screen.getByText('15/21 questions correct')).toBeInTheDocument();
 });

 test('does not show back to dashboard button in header', () => {
 render(<TestResultsPage {...defaultProps} />);

 // Should not have back button in header (removed as per requirements)
 const backButtons = screen.getAllByText(/back to dashboard/i);
 // Should only have one back button (in Quick Actions)
 expect(backButtons).toHaveLength(1);
 });

 test('does not show date in header', () => {
 render(<TestResultsPage {...defaultProps} />);

 // Should not show date in header (removed as per requirements)
 expect(screen.queryByText(/september/i)).not.toBeInTheDocument();
 });

 test('shows generic title instead of "Excellent Work!"', () => {
 render(<TestResultsPage {...defaultProps} />);

 expect(screen.getByText('Test Completed')).toBeInTheDocument();
 expect(screen.queryByText('Excellent Work!')).not.toBeInTheDocument();
 });

 test('quick actions buttons work correctly', () => {
 render(<TestResultsPage {...defaultProps} />);

 // Test View Test History button
 const historyButton = screen.getByText('View Test History');
 fireEvent.click(historyButton);
 expect(defaultProps.onBackToTestList).toHaveBeenCalled();

 // Test Retake Test button
 const retakeButton = screen.getByText('Retake Test');
 fireEvent.click(retakeButton);
 expect(defaultProps.onRetakeTest).toHaveBeenCalled();

 // Test Back to Dashboard button
 const dashboardButton = screen.getByText('Back to Dashboard');
 fireEvent.click(dashboardButton);
 expect(defaultProps.onBackToDashboard).toHaveBeenCalled();
 });

 test('handles missing onRetakeTest prop', () => {
 const propsWithoutRetake = { ...defaultProps, onRetakeTest: undefined };
 render(<TestResultsPage {...propsWithoutRetake} />);

 expect(screen.queryByText('Retake Test')).not.toBeInTheDocument();
 });

 test('shows performance insights correctly', () => {
 render(<TestResultsPage {...defaultProps} />);

 expect(screen.getByText('Performance Insights')).toBeInTheDocument();
 expect(screen.getByText('Accuracy')).toBeInTheDocument();
 expect(screen.getByText('Category')).toBeInTheDocument();
 expect(screen.getByText('Status')).toBeInTheDocument();
 expect(screen.getByText('PASSED')).toBeInTheDocument();
 });

 test('shows next steps section', () => {
 render(<TestResultsPage {...defaultProps} />);

 expect(screen.getByText('Next Steps')).toBeInTheDocument();
 });
});
