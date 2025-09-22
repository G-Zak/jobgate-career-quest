import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { DarkModeProvider } from '../contexts/DarkModeContext';
import { AuthProvider } from '../contexts/AuthContext';
import AppRoutes from '../routes/AppRoutes';
import { initializeScrollBehavior } from '../shared/utils/scrollUtils';

export default function App() {
  // Initialize scroll behavior on app mount
  useEffect(() => {
    const cleanup = initializeScrollBehavior();
    return cleanup;
  }, []);

  return (
    <DarkModeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </DarkModeProvider>
  );
}