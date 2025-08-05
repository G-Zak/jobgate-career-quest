import React, { useState } from 'react';
import MainDashboard from '../shared/components/layout/MainDashboard';
import Dashboard from '../features/candidate-dashboard/components/DashboardCandidat';

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');

  if (currentView === 'candidat-dashboard') {
    return <Dashboard />;
  }

  return <MainDashboard />;
}