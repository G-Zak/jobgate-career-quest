import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { DarkModeProvider } from '../contexts/DarkModeContext';
import { AuthProvider } from '../contexts/AuthContext';
import AppRoutes from '../routes/AppRoutes';
import { initializeScrollBehavior } from '../shared/utils/scrollUtils';

export default function App() {
  const hasInitializedScroll = useRef(false);

  // Initialize scroll behavior on app mount
  useEffect(() => {
    // Prevent double execution in Strict Mode
    if (hasInitializedScroll.current) {
      return;
    }
    hasInitializedScroll.current = true;

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