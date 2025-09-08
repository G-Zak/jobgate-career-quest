import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { DarkModeProvider } from '../contexts/DarkModeContext';
import MainDashboard from '../shared/components/layout/MainDashboard';
import Dashboard from '../features/candidate-dashboard/components/DashboardCandidat';

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');

  const content = currentView === 'candidat-dashboard' ? <Dashboard /> : <MainDashboard />;

  return (
    <DarkModeProvider>
      <BrowserRouter>
        {content}
      </BrowserRouter>
    </DarkModeProvider>
  );
}