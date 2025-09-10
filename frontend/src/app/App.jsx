import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { DarkModeProvider } from '../contexts/DarkModeContext';
import MainDashboard from '../shared/components/layout/MainDashboard';
import Dashboard from '../features/candidate-dashboard/components/DashboardCandidat';
import { initializeScrollBehavior } from '../shared/utils/scrollUtils';
import { DarkModeProvider } from '../contexts/DarkModeContext';

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');

  // Initialize scroll behavior on app mount
  useEffect(() => {
    const cleanup = initializeScrollBehavior();
    return cleanup;
  }, []);

  const content = currentView === 'candidat-dashboard' ? <Dashboard /> : <MainDashboard />;

  return (
    <DarkModeProvider>
      <BrowserRouter>
        {content}
      </BrowserRouter>
    </DarkModeProvider>
  );
}