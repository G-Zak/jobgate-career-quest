import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import MainDashboard from '../shared/components/layout/MainDashboard';
import Dashboard from '../features/candidate-dashboard/components/DashboardCandidat';

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');

  const content = currentView === 'candidat-dashboard' ? <Dashboard /> : <MainDashboard />;

  return (
    <BrowserRouter>
      {content}
    </BrowserRouter>
  );
}